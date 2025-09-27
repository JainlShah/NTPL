import { useState, useEffect, useCallback, useRef } from "react";
import React from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import animationData from "../../assets/loading.json";
import nodata from "../../assets/nodata.png";
import Pagination from "../../components/Pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faTimes } from "@fortawesome/free-solid-svg-icons";

const CustomDropdown = ({ label, options, value = [], onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle display value
  const displayValue =
    value.length === 0
      ? `Select ${label}`
      : value.length === 1
      ? value[0]
      : `${value.length} items selected`;

  // Handle checkbox change
  const handleCheckboxChange = (option) => (e) => {
    const newValue = e.target.checked
      ? [...value, option] // Add option if checked
      : value.filter((v) => v !== option); // Remove option if unchecked
    onChange(newValue);
  };

  // Clear all selected values
  const handleClear = () => {
    onChange([]);
  };

  return (
    <div className="custom-dropdown" ref={dropdownRef}>
      <div className="dropdown-header" onClick={() => setIsOpen(!isOpen)}>
        <span>{displayValue}</span>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`chevron ${isOpen ? "chevron-rotated" : ""}`}
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
              onClick={handleClear}
            />
          </div>
          {options.map((option) => (
            <div key={option} className="dropdown-item">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={value.includes(option)}
                  onChange={handleCheckboxChange(option)}
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

const SlittingTable = ({
  data,
  loading,
  pagination,
  onPageChange,
  searchQuery,
  onSearchChange,
  filter,
  onRowClick,
  onAddClick,
  isAddEnable = false,
  onApplyFilters,
}) => {
  const [tempFilters, setTempFilters] = useState({}); // Temporary filter state
  const [filterActive, setFilterActive] = useState(false);
  const [searchText, setSearchText] = useState(searchQuery);
  const filterRef = useRef(null);

  const handleClickOutside = (event) => {
    const isClickInsideFilter =
      filterRef.current && filterRef.current.contains(event.target);
    console.log("isClickInsideFilter", isClickInsideFilter);
    if (isClickInsideFilter) {
    } else {
      setFilterActive(false);
    }
  };
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
  });
  useEffect(() => {
    console.log("data", data);
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounce implementation using useRef to prevent memory leaks
  const debounceRef = useRef(null);
  const debounce = (func, delay) => {
    return (...args) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        if (typeof func === "function") func(...args);
      }, delay);
    };
  };

  const debouncedSearchChange = useCallback(debounce(onSearchChange, 400), [
    onSearchChange,
  ]);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
    debouncedSearchChange(e.target.value);
  };

  const pageChange = (page) => {
    console.log("Page changed:", page);
    onPageChange(page);
  };

  const handleRowClick = (row) => {
    console.log("Row clicked:", row);
    onRowClick(row);
  };

  const renderTable = (data) => (
    <table className="table-auto">
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
        {data.map((group, groupIndex) => (
          <React.Fragment key={groupIndex}>
            {group.rollsData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="coil-row"
                style={{
                  background: groupIndex % 2 === 0 ? "#f0f0f0" : "#d7e5f3",
                  cursor: "pointer",
                }}
                onClick={() => handleRowClick(group)}
              >
                {rowIndex === 0 && (
                  <td rowSpan={group.rollsData.length}>
                    {group.coil_rollNumber}
                  </td>
                )}
                <td>{row.jobNumber || "Extra"}</td>
                <td>{row.drawingNumber || "Extra"}</td>
                <td>{row.weight ?? 0}</td>
                <td>{row.width ?? 0}</td>
                {rowIndex === 0 && (
                  <td rowSpan={group.rollsData.length}>{row.thickness ?? 0}</td>
                )}
                {rowIndex === 0 && (
                  <td rowSpan={group.rollsData.length}>
                    {group.programTrim ?? 0}
                  </td>
                )}
                {rowIndex === 0 && (
                  <td rowSpan={group.rollsData.length}>
                    {group.programWeight ?? 0}
                  </td>
                )}
              </tr>
            ))}
            {/* Add a horizontal line after each group */}
            <tr key={`${groupIndex}-separator`}>
              <td colSpan="8" style={{ padding: 0 }}>
                <hr style={{ border: "1px solid #ccc", margin: 0 }} />
              </td>
            </tr>
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );

  const applyFilters = () => {
    console.log(tempFilters);
    if (typeof onApplyFilters === "function") {
      onApplyFilters(tempFilters);
    }
    setFilterActive(false); // Close the filter modal
  };
  const filterableColumn = filter ? Object.keys(filter) : [];
  const formatLabel = (key) => {
    const column = data.find((c) => c.accessor === key);
    return column ? column.label : key;
  };
  return (
    <div className="table-container">
      <div className="top-container">
        <div className="searchBar">
          <i className="search-icon fa fa-search"></i>
          <input
            type="text"
            placeholder="Search..."
            value={searchText}
            onChange={handleSearch}
          />
        </div>

        <div className="filter-container">
          <i
            className={`icon fa-solid fa-filter ${
              filterActive ? "active-filter" : ""
            }`}
            onClick={() => setFilterActive(!filterActive)}
          ></i>
        </div>
        {isAddEnable && (
          <div className="add-container">
            <i className="icon fa-solid fa-plus" onClick={onAddClick}></i>
          </div>
        )}
      </div>

      {filterActive && (
        <div className="filter-modal">
          <div className="filter-modal-content" ref={filterRef}>
            <h3>Filters</h3>
            <div className="filter-options">
              {filterableColumn.map((accessor) => {
                const uniqueValues = filter[accessor];
                return (
                  <div key={accessor} className="filter-option">
                    <label>
                      {accessor
                        .replace(/([A-Z])/g, " $1")
                        .trim()
                        .replace(/^\w/, (c) => c.toUpperCase())}
                    </label>
                    <CustomDropdown
                      label={accessor
                        .replace(/([A-Z])/g, " $1")
                        .trim()
                        .replace(/^\w/, (c) => c.toUpperCase())}
                      options={uniqueValues}
                      value={tempFilters[accessor] || []}
                      onChange={(newValue) => {
                        setTempFilters((prev) => ({
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
                onClick={() => setTempFilters({})}
              >
                Clear
              </button>
              <button className="submit-button" onClick={applyFilters}>
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {!loading ? (
        data.length > 0 ? (
          <div className="planned-slitting-table">
            {renderTable(data)}
            <Pagination
              itemsPerPage={pagination.itemsPerPage}
              currentPage={pagination.currentPage}
              totalItems={pagination.totalItems}
              handlePageChange={pageChange}
            />
          </div>
        ) : (
          <div className="no-data-container">
            <img
              src={nodata}
              alt="No data available"
              style={{ width: "200px" }}
            />
            <p>No data available</p>
          </div>
        )
      ) : (
        <div className="loading-overlay">
          <Player
            autoplay
            loop
            src={animationData}
            style={{ width: "80%", height: "80%" }}
          />
        </div>
      )}
    </div>
  );
};

export default SlittingTable;
