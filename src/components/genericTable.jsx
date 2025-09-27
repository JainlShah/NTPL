import React, { useState, useEffect, useCallback, useRef } from "react";
import Pagination from "./Pagination";
import "../styles/genericTable.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import animationData from "../assets/loading.json";
import { Player } from "@lottiefiles/react-lottie-player";
import nodata from "../assets/nodata.png";
import {
  faFilter,
  faTimes,
  faSort,
  faSortUp,
  faSortDown,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { isMobile, isTablet } from "react-device-detect";
import toast from "react-hot-toast";
import { BrowserMultiFormatReader } from "@zxing/library";

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
                <span className="checkbox-text">
                  {label === "Date"
                    ? new Date(option).toLocaleDateString("en-GB").replace(/\//g, "-")
                    : option}
                </span>
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const GenericTable = ({
  columns,
  data,
  searchQuery,
  onRowClick,
  onQrView,
  onMenuClick,
  enableSearch = false,
  enableFilter = false,
  filter,
  onFilter,
  itemsPerPage = 10,
  isAddEnable = false,
  onAddClick,
  onPageChange,
  onSearchChange,
  pagination,
  loading = false,
  filterableColumns = [],
  lockedRows = {},
}) => {
  const [searchText, setSearchText] = useState(searchQuery);
  const [filterActive, setFilterActive] = useState(false);
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [selectedRow, setSelectedRow] = useState(null);
  const filterRef = useRef(null);
  const [scannerMode, setScannerMode] = useState("");
  const [isCameraAccessible, setIsCameraAccessible] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const videoRef = useRef(null);
  const [isCameraRequested, setIsCameraRequested] = useState(false);
  let codeReader = new BrowserMultiFormatReader();
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && filterActive) {
        setFilterActive(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [filterActive]);

  console.log("lockedRows", lockedRows);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFilterActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setFilterActive(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (scannerMode === "camera") {
      handleCameraPermission();
    } else if (scannerMode === "scanner") {
      alert("Please connect an external QR scanner.");
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, [scannerMode]);

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
    debouncedSearchChange(e.target.value);
    onPageChange(1);
  };

  const debouncedSearchChange = useCallback(debounce(onSearchChange, 400), []);

  const sortData = (data) => {
    if (!sortConfig.key) return data;
    const sortedData = [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
    });

    return sortedData;
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = sortData(data);
  const filterableColumn = filter ? Object.keys(filter) : [];
  const formatLabel = (key) => {
    const column = columns.find((c) => c.accessor === key);
    if (column) {
      return column.label.charAt(0).toUpperCase() + column.label.slice(1);
    }
    return key.charAt(0).toUpperCase() + key.slice(1);
  };


  const handleCameraPermission = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Camera not supported on this browser.");
        return;
      }

      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );

      if (videoDevices.length === 0) {
        alert("No camera found. Please connect a webcam.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraAccessible(true);
      setPermissionDenied(false);
    } catch (error) {
      console.error("Error accessing camera:", error);
      if (error.name === "NotAllowedError") {
        alert(
          "Camera access denied. Please enable it in your browser settings."
        );
      }
      setIsCameraAccessible(false);
      setPermissionDenied(true);
    }
  };
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraAccessible(true);
      setPermissionDenied(false);
      scanQRCode();
    } catch (error) {
      console.error("Error accessing camera:", error);
      setIsCameraAccessible(false);
      setPermissionDenied(true);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      let stream = videoRef.current.srcObject;
      let tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const scanQRCode = () => {
    if (!videoRef.current) return;

    codeReader.decodeFromVideoDevice(
      undefined,
      videoRef.current,
      (result, err) => {
        if (result) {
          console.log(`QR Code Detected: ${result.getText()}`);
          setSearchText(result.getText());
          debouncedSearchChange(result.getText());
          stopCamera(); // Stop the camera after scanning
          setScannerMode("");
          codeReader.reset(); // Reset the scanner

        } else if (err && err.name !== "NotFoundException") {
          console.error("QR Code scanning error:", err);
        }
      }
    );
  };
  return (
    <>
      <div className="table-container">
        <div className="top-container">
          {enableSearch && (
            <div className="searchBar">
              <i className="search-icon fa fa-search"></i>
              <input
                type="text"
                placeholder="Search..."
                value={searchText}
                onChange={handleSearch}
              />
            </div>
          )}
          {/*Filter Modal*/}
          {onQrView && (isMobile || isTablet) && (
            <div className="filter-container">
              <i
                className={`icon fa-solid fa-camera ${filterActive ? "active-filter" : ""
                  }`}
                onClick={() => {
                  setScannerMode("camera")
                  setIsCameraRequested(true)
                  if (!isCameraAccessible) {
                    handleCameraPermission()
                  }
                }}
              ></i>
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
                  const uniqueValues = filter[accessor]; // Get unique values from the filters object
                  console.log("uniqueValues", accessor, uniqueValues);
                  return (
                    <div key={accessor} className="filter-option">
                      <label>{formatLabel(accessor)}</label>
                      <CustomDropdown
                        label={formatLabel(accessor)}
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
                    setFilters({});
                    onFilter({});
                  }}
                >
                  Clear
                </button>
                <button
                  className="submit-button"
                  onClick={() => {
                    setFilterActive(false);
                    if (onFilter) {
                      onFilter(filters);
                    }
                  }}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}
        {loading && <p style={{ textAlign: "center" }}>Loading data...</p>}

        {!loading ? (
          sortedData.length > 0 ? (
            <>
              <div className="table-responsive">
                <table className="table-auto">
                  <thead>
                    <tr>
                      {columns.map((col, index) => (
                        <th
                          key={index}
                          onClick={() => handleSort(col.accessor)}
                          style={{ cursor: "pointer" }}
                        >
                          {col.label}{" "}
                          {sortConfig.key === col.accessor && (
                            <FontAwesomeIcon
                              icon={
                                sortConfig.direction === "asc"
                                  ? faSortUp
                                  : faSortDown
                              }
                            />
                          )}
                          {sortConfig.key !== col.accessor && (
                            <FontAwesomeIcon icon={faSort} />
                          )}
                        </th>
                      ))}
                      {onQrView && <th>QR Code</th>}
                      {onMenuClick && <th>Menu</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {sortedData.map((row, rowIndex) => (
                      <tr
                        key={rowIndex}
                        onClick={() => {
                          if (
                            lockedRows[row.rollId] ||
                            lockedRows[row.coilNumber]
                          ) {
                            if (lockedRows[row.rollId]) {
                              toast.error(
                                `Roll ${row.rollNumber} is already in use`
                              );
                            } else {
                              toast.error(
                                `Coil ${row.coilNumber} is already in use`
                              );
                            }
                            return;
                          }
                          setSelectedRow(rowIndex);
                          onRowClick(row);
                        }}
                        className={
                          selectedRow === rowIndex ? "selected-row" : ""
                        }
                        style={{
                          background:
                            lockedRows[row.rollId] || lockedRows[row.coilNumber]
                              ? "#f8d7da"
                              : "",
                          cursor:
                            lockedRows[row.rollId] || lockedRows[row.coilNumber]
                              ? "not-allowed"
                              : onRowClick
                                ? "pointer"
                                : "default",
                        }}
                      >
                        {columns.map((col, colIndex) => (
                          <td
                            key={colIndex}
                            title={
                              col.accessor === "status" ||
                                col.accessor === "rollstatus" ||
                                col.accessor === "statusType"
                                ? row.description
                                  ? row.description
                                  : row[col.accessor] || "NA"
                                : row[col.accessor] || "NA"
                            }
                          >
                            {col.render
                              ? col.render(row[col.accessor] || "NA", row)
                              : typeof row[col.accessor] === "number"
                                ? Number.isInteger(row[col.accessor])
                                  ? row[col.accessor]
                                  : row[col.accessor].toFixed(2)
                                : (row[col.accessor] || "NA")
                                  .toString()
                                  .toUpperCase()}
                          </td>
                        ))}
                        {/* QR Code Button */}
                        {onQrView && (
                          <td>
                            <button
                              onClick={(e) => {
                                if (
                                  row.status === "In Progress" ||
                                  row.status === "Ready for Slitting"
                                )
                                  return;
                                e.stopPropagation();
                                onQrView(row);
                              }}
                              className={`qr-button ${row.status === "In Progress" ||
                                row.status === "Ready for Slitting"
                                ? "disabled"
                                : ""
                                }`}
                              disabled={
                                row.status === "In Progress" ||
                                row.status === "Ready for Slitting"
                              }
                              title={
                                row.status === "In Progress" ||
                                  row.status === "Ready for Slitting"
                                  ? "You can see the QR Code when it is Packed"
                                  : "View QR Code"
                              }
                            >
                              View
                            </button>
                          </td>
                        )}

                        {onMenuClick && (
                          <td>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onMenuClick(row);
                              }}
                              title="Menu"
                            >
                              <i className="fa fa-ellipsis-v"></i>
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Pagination
                itemsPerPage={pagination.itemsPerPage}
                currentPage={pagination.currentPage}
                totalItems={pagination.totalItems}
                handlePageChange={onPageChange}
              />
            </>
          ) : (
            <div className="no-data-container">
              <img
                src={nodata}
                alt="No data available"
                style={{ width: "200px", height: "200px" }}
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
        )}

        {scannerMode === "camera" && (
          <div className="camera-container">
            {/* {!isCameraRequested && !permissionDenied && (
            <p style={{ color: "red" }}>Please enable camera permission.</p>
          )} */}
            {permissionDenied && (
              <div className="permission-container">
                <p style={{ color: "red" }}>
                  Camera access denied. Please enable camera permission in your browser settings.
                </p>
                <button onClick={handleCameraPermission}>Grant Permission</button>
              </div>
            )}

            {isCameraAccessible && (
              <div className="full-screen-camera">
                <video ref={videoRef} autoPlay muted />
                <p className="scan-text">Camera is ready. Scan your QR code.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default GenericTable;
