import React, { useState, useEffect, useCallback, useRef } from "react";
import usePlannedSlitting from "../../hooks/usePlannedSlitting";
import "../../styles/PlannedSlitting.css";
import Pagination from "../../components/Pagination";
import exportToExcel from "../../util/export";
import { ClipLoader } from "react-spinners";
import nodata from "../../assets/nodata.png";
import CommonError from "../../components/error/CommonError";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Player } from "@lottiefiles/react-lottie-player";
import animationData from "../../assets/loading.json";
import SlittingTable from "../slitting/SlittingTable";
const PlannedSlitting = () => {
  const [currPage, setCurrPage] = useState(1);
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filterActive, setFilterActive] = useState(false);
  const [enableSearch, setEnableSearch] = useState(true);
  const [enableFilter, setEnableFilter] = useState(true);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setFilterActive(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const {
    data = [],
    loading,
    error,
    pagination,
    handleExport,
    availableFilters
  } = usePlannedSlitting(searchQuery, currPage, filters);

  useEffect(() => {
    console.log("Planned Slitting", data);
  }, [data]);

  const [showAddModal, setShowAddModal] = useState(false);
  const filterableColumns = ["coil_rollNumber", "drawingNumber", "thickness"];

  const CustomDropdown = ({ label, options, value = [], onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const displayValue =
      value.length === 0
        ? `Select ${label}`
        : value.length === 1
          ? value[0]
          : `${value.length} items selected`;

    const handleCheckboxChange = (option, checked) => {
      const updatedValue = checked
        ? [...value, option]
        : value.filter((v) => v !== option);
      onChange(updatedValue);
    };

    return (
      <div className="custom-dropdown" ref={dropdownRef}>
        <div className="dropdown-header" onClick={() => setIsOpen(!isOpen)}>
          <span>{displayValue}</span>
          <FontAwesomeIcon
            icon={faChevronDown}
            className={isOpen ? "chevron-rotated" : ""}
          />
        </div>
        {isOpen && (
          <div className="dropdown-list">
            <div className="dropdown-actions">
              <span>{label}</span>
              <FontAwesomeIcon
                icon={faTimes}
                className="clear-icon"
                title="Clear"
                onClick={() => onChange([])}
              />
            </div>
            {options.map((option) => (
              <div key={option} className="dropdown-item">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={value.includes(option)}
                    onChange={(e) =>
                      handleCheckboxChange(option, e.target.checked)
                    }
                  />
                  <span className="checkbox-text">{option}</span>
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const getUniqueValues = (columnAccessor) => {
    if (!Array.isArray(data)) return [];

    return Array.from(
      new Set(
        data.flatMap((group) => {
          if (columnAccessor === "coil_rollNumber") {
            return group.coil_rollNumber ? [group.coil_rollNumber] : [];
          }
          return group.rollsData
            .filter((item) => item != null)
            .map((row) => row[columnAccessor])
            .filter((value) => value != null);
        })
      )
    );
  };

  const filteredData = Array.isArray(data)
    ? data.filter((group) => {
      if (!group) return false;

      const matchesGroupFilter = filters.coil_rollNumber
        ? group.coil_rollNumber?.toString().includes(filters.coil_rollNumber)
        : true;

      const matchesDetailsFilter =
        Array.isArray(group.rollsData) &&
        group.rollsData.some((row) => {
          if (!row) return false;

          return Object.keys(filters).every((key) => {
            if (!filters[key]) return true;
            return row[key]?.toString().includes(filters[key]);
          });
        });

      return matchesGroupFilter && matchesDetailsFilter;
    })
    : [];

  const handlePageChange = (page) => {
    setCurrPage(page);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");

    // Debugging: Log filtered data
    console.log("Filtered Data:", filteredData);

    // Generate the printable content
    const printContent = `
      <html>
        <head>
          <title>Planned Slitting Report</title>
          <style>
            @page {
              margin-top: 50px; /* Top margin */
              margin-bottom: 50px; /* Bottom margin */
            }
            body { 
              font-family: Arial, sans-serif; 
              padding: 20px; 
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 20px;
            }
            th, td { 
              border: 1px solid #000; 
              padding: 8px; 
              text-align: center; 
            }
            th { 
              background-color: #f0f0f0; 
            }
            h1 {
              text-align: center;
              color: #333;
            }
            .print-date {
              text-align: right;
              margin-bottom: 20px;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <h1>Planned Slitting Report</h1>
          <div class="print-date">Printed on: ${new Date().toLocaleString()}</div>
          <table>
            <thead>
              <tr>
                <th>Coil/Roll No.</th>
                <th>Job No.</th>
                <th>Drawing No.</th>
                <th>Weight (kg)</th>
                <th>Width (mm)</th>
                <th>Thickness (mm)</th>
                <th>Program Trim (kg)</th>
                <th>Program Weight (kg)</th>
              </tr>
            </thead>
            <tbody>
              ${data.slice(0, 50)
        .map((group) =>
          group.rollsData
            .map(
              (row, rowIndex) => `
                        <tr>
                          ${rowIndex === 0
                  ? `<td rowspan="${group.rollsData.length}">${group.coil_rollNumber}</td>`
                  : ""
                }
                          <td>${row.jobNumber || ""}</td>
                          <td>${row.drawingNumber || ""}</td>
                          <td>${row.weight || ""}</td>
                          <td>${row.width || ""}</td>
                          ${rowIndex === 0
                  ? `<td rowspan="${group.rollsData.length}">${row.thickness}</td>
                            <td rowspan="${group.rollsData.length}">${group.programTrim}</td>
                               <td rowspan="${group.rollsData.length}">${group.programWeight}</td>`
                  : ""
                }
                        </tr>
                      `
            )
            .join("")
        )
        .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `;

    // Debugging: Log print content
    console.log("Print Content:", printContent);

    // Write the printable content to the new window
    printWindow.document.write(printContent);
    printWindow.document.close();

    // Wait for content to load before printing
    printWindow.onload = function () {
      printWindow.print();
      printWindow.onafterprint = function () {
        printWindow.close();
      };
    };
  };

  const renderTable = (data, isPrintable = false) => (
    <table className="table-auto">
      <thead>
        <tr>
          <th>Coil/Roll No.</th>
          <th>Thickness (mm)</th>
          <th>Weight (kg)</th>
          <th>Width (mm)</th>
          <th>Drawing No.</th>
          <th>Work Order</th>
          <th>Job No.</th>
        </tr>
      </thead>
      <tbody>
        {data.map((group, groupIndex) => (
          <React.Fragment key={groupIndex}>
            {group.rollsData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="coil-row"
                style={{
                  background:
                    !isPrintable &&
                    (groupIndex % 2 === 0 ? "#f0f0f0" : "#d7e5f3"),
                }}
              >
                {rowIndex === 0 && (
                  <td rowSpan={group.rollsData.length}>
                    {group.coil_rollNumber}
                  </td>
                )}
                <td>{row.thickness}</td>
                <td>{row.weight}</td>
                <td>{row.width}</td>
                <td>{row.drawingNumber || "Extra"}</td>
                <td>{row.workOrder || "Extra"}</td>
                <td>{row.jobNumber || "Extra"}</td>
              </tr>
            ))}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
  const handleSearchChange = (value) => {
    console.log("handleSearchChange:", value);
    setSearchQuery(value);
    setCurrPage(1);
  };

  const handleRowClick = (row) => {
    console.log("Row clicked:", row);
    // onRowCLick(row);
  };
  const handleFilter = (filters) => {
    console.log("handleFilter:", filters);
      setFilters(filters);
      setCurrPage(1);
    };
  return (
    <div className="planned-slitting-container">
      <h1>Planned Slitting</h1>

      {error ? (
        <CommonError error={error} />
      ) : (
        <div className="planned-slitting-body">
          <>
            {/* <div className="top-container">
              {enableSearch && (
                <div className="searchBar">
                  <i className="search-icon fa fa-search"></i>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              )}

              {enableFilter && (
                <div className="filter-container">
                  <i
                    className={`icon fa-solid fa-filter ${filterActive ? "active-filter" : ""
                      }`}
                    onClick={() => setFilterActive(!filterActive)}
                  ></i>
                </div>
              )}
            </div>

            {filterActive && (
              <div className="filter-modal">
                <div className="filter-modal-content">
                  <h3>Filters</h3>
                  <div className="filter-options">
                    {filterableColumns.map((accessor) => {
                      const uniqueValues = getUniqueValues(accessor);

                      return (
                        <div key={accessor} className="filter-option">
                          <label>
                            {accessor === "coil_rollNumber"
                              ? "Coil/Roll No."
                              : accessor === "drawingNumber"
                                ? "Drawing No."
                                : accessor === "workOrder"
                                  ? "Work Order"
                                  : "Job No."}
                          </label>
                          <CustomDropdown
                            label={
                              accessor === "coil_rollNumber"
                                ? "Coil/Roll No."
                                : accessor === "drawingNumber"
                                  ? "Drawing No."
                                  : accessor === "workOrder"
                                    ? "Work Order"
                                    : "Job No."
                            }
                            options={uniqueValues}
                            value={filters[accessor] || []}
                            onChange={(newValue) => {
                              setFilters((prev) => ({
                                ...prev,
                                [accessor]: newValue,
                              }));
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>

                  <div className="action-container">
                    <button
                      className="close-button"
                      onClick={() => {
                        setFilterActive(false);
                        setFilters({});
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className="submit-button"
                      onClick={() => setFilterActive(false)}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )} */}

            {/* {!loading ? (
              filteredData.length > 0 ? (
                <div className="planned-slitting-table">
                  {renderTable(filteredData)}
                  <div id="printable-table" style={{ display: "none" }}>
                    {renderTable(filteredData, true)}
                  </div>
                  <Pagination
                    itemsPerPage={pagination.itemsPerPage}
                    currentPage={pagination.currentPage}
                    totalItems={pagination.totalItems}
                    onPageChange={handlePageChange}
                  />
                </div>
              ) : (
                <div className="no-data-container">
                  <img
                    src={nodata}
                    alt="No data available"
                    style={{ width: "200px" }}
                  />
                  <p className="no-data">No data available</p>
                </div>
              )
            ) : (
              <div className="loading-overlay">
                <div style={{ width: 300, height: 300 }}>
                  <Player
                    autoplay
                    loop
                    speed={2}
                    src={animationData}
                    style={{ width: "80%", height: "80%" }}
                  />
                </div>
              </div>
            )} */}

            <SlittingTable data={data} loading={loading} error={error} pagination={pagination} onPageChange={handlePageChange} onSearchChange={handleSearchChange} onRowClick={handleRowClick} filter={availableFilters} onApplyFilters={handleFilter}/>
          </>

          {data.length > 0 && (
            <div className="action-btn-planned">
              {/* <button
                className="export-button"
                onClick={handleExport}
                disabled={filteredData.length === 0}
              >
                Export
              </button> */}
              <button
                className="submit-button"
                onClick={handlePrint}
                disabled={filteredData.length === 0}
              >
                Print
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlannedSlitting;
