import React, { useState, useEffect, useRef } from "react";
import "../../styles/dashboard.css";
import "../../styles/packing.css";
import Pagination from "../../components/Pagination";
import usePacking from "../../hooks/usePacking";
import log from "../../components/logger";
import { ClipLoader } from "react-spinners";
import CommonError from "../../components/error/CommonError";
import GenericForm from "../../components/generic/GenericForm";
import { toast } from "react-hot-toast";
import ConfirmationPopup from "../../components/generic/ConfirmationPopup";
import QRScreenPacking from "../../components/QrCodeScreens/QrScreenPacking";
import QRModelPacking from "../../model/QRModelPacking";
import useShortlist from "../../hooks/useShortlist";
import StackMM from "../../util/StackMM.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Player } from "@lottiefiles/react-lottie-player";
import animationData from "../../assets/loading.json";
import nodata from "../../assets/nodata.png";

const Packing = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currPage, setCurrPage] = useState(1);
  const [filters, setFilters] = useState({});
  const [filterActive, setFilterActive] = useState(false);
  const [enableSearch, setEnableSearch] = useState(true);
  const [enableFilter, setEnableFilter] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(1);
  const [selectedCard, setSelectedCard] = useState(null);
  const [shortlistPopupVisible, setShortlistPopupVisible] = useState(false);
  console.log(selectedCard);
  const [packedWeight, setPackedWeight] = useState("");
  const [scrapWeight, setScrapWeight] = useState("");
  const [excessWeight, setExcessWeight] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [showPopup, setShowPopup] = useState(false);

  // console.log(selectedCard.jobAttributes[0].excessWeight);
  // const jobAttributes = selectedCard.jobAttributes.map((attr) => ({
  //   scrap: attr.scrap,
  //   slittingProgramId: attr.slittingProgramId,
  //   excessWeight: attr.excessWeight,
  //   stack: attr.stack,
  //   packedWeight: attr.packedWeight,
  // }));
  // console.log(jobAttributes);

  const packingQr = (data) => {
    // const formattedDate = data.result.updatedAt
    //   ? new Date(data.result.updatedAt).toISOString().split("T")[0]
    //   : "N/A";

    const formattedDate = data.result.updatedAt
      ? (() => {
        const date = new Date(data.result.updatedAt);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`; // Format: dd-MM-yyyy
      })()
      : "N/A";

    console.log("packingQr", data);
    const packing = new QRModelPacking(
      data.result.qrCodeNumber || "N/A",
      data.result.jobNumber,
      data.result.drawingNumber,
      data.result.workOrder,
      data.result.customerName,
      data.result.packedWeight || "N/A",
      data.result.PONumber,
      formattedDate
    );
    setQRDetails(packing);
    setIsQRVisible(true);
  };
  const {
    loading,
    error,
    packing,
    pagination,
    updatePacking,
    availableFilters,
  } = usePacking(searchQuery, currPage, filters, packingQr);
  const { addShortlist } = useShortlist();

  const [shortlistValues, setShortlistValues] = useState({
    width: "",
    weight: "",
  });
  console.log(shortlistValues);

  const [isQRVisible, setIsQRVisible] = useState(false);
  const [qrDetails, setQRDetails] = useState(null);
  const getUniqueValues = (columnAccessor) => {
    if (!packing) return [];
    return Array.from(
      new Set(
        packing
          .map((row) => row[columnAccessor])
          .filter((value) => value != null)
      )
    );
  };
  const filterableColumns = ["jobNumber", "drawingNumber"];

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsQRVisible(false);
        setFilterActive(false);
        setShortlistPopupVisible(false);
        setSelectedCard(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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
        ? [...value, option] // Add the option if checked
        : value.filter((v) => v !== option); // Remove the option if unchecked
      onChange(updatedValue); // Pass the updated value to parent
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
                onClick={() => onChange([])} // Clear the value
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

  // Modified to handle both direct packing QR and finish button QR

  // console.log("packingQr", packing);
  const onPackingUpdate = (data) => {
    console.log("onPackingUpdate", data);
    setQRDetails(packing);
    setIsQRVisible(true);
  };

  const handleShortlistSubmit = async () => {
    if (!selectedCard || !shortlistValues.width || !shortlistValues.weight) {
      toast.error("Please fill in all required fields");
      return;
    }
    const filteredJobs = selectedCard.jobAttributes.filter(
      (job) => job.width === Number(shortlistValues.width)
    );
    const thicknessValue =
      filteredJobs.length > 0 ? filteredJobs[0].thickness : null;

    const shortlistData = {
      jobNumber: selectedCard.jobNumber,
      width: parseFloat(shortlistValues.width),
      weight: parseFloat(shortlistValues.weight),
      thickness: thicknessValue,
      drawingNumber: selectedCard.jobAttributes[0].drawingNumber,
      workOrder: selectedCard.jobAttributes[0].workOrder,
    };

    console.log("jobNumber", shortlistData);
    addShortlist(shortlistData);
    setShortlistPopupVisible(false);
    setShortlistValues({
      width: "",
      weight: "",
    });
    //
  };

  // Update items per page based on screen size
  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth <= 480) {
        setItemsPerPage(4);
      } else if (window.innerWidth <= 768) {
        setItemsPerPage(6);
      } else if (window.innerWidth <= 1024) {
        setItemsPerPage(6);
      } else {
        setItemsPerPage(15);
      }
    };

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  // Debounce function for search
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const debouncedSearchChange = debounce((value) => {
    setSearchQuery(value);
  }, 300);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    debouncedSearchChange(e.target.value);
    onPageChange(1);
  };

  const handlePageChange = (page) => {
    setCurrPage(page);
  };

  const handleFilterApply = () => {
    log.info("Filters applied:", filters);
    setFilterActive(false);
    setCurrPage(1);
  };

  const handleCardClick = (card) => {
    console.log("Card clicked:", card);
    setSelectedCard(card);
  };

  const closePopup = () => {
    setSelectedCard(null);
    setIsQRVisible(false);
    setQRDetails(null);
    setPackedWeight("");
    setExcessWeight("");
    setScrapWeight("");
    setDate("");
  };

  // Get table data for the selected card
  const getTableData = (card) => {
    if (!card || !card.jobAttributes) {
      return [];
    }
    return Array.isArray(card.jobAttributes)
      ? card.jobAttributes
      : [card.jobAttributes];
  };

  // Validate if required fields are filled before opening the shortlist popup
  const handleInitiateShortlist = () => {
    setShortlistPopupVisible(true);
  };

  // Handle changes in the shortlist popup dropdowns
  const handleShortlistChange = (field, value) => {
    if (field === "weight") {
      const width = shortlistValues.width;
      console.log("selectedCard", selectedCard, width);
      const processWeight = selectedCard.jobAttributes.filter(
        (job) => job.width === Number(width)
      );
      console.log("processWeight", processWeight);
      if (Number(value) > processWeight[0].weight) {
        toast.error("Weight cannot be greater than process weight");
        return;
      }
    }
    setShortlistValues((prev) => ({ ...prev, [field]: value }));
  };

  // Handle submission of the shortlist popup

  // Handle Finish button click
  const handleFinish = () => {
    if (!packedWeight) {
      toast.error("Please fill in all required fields");
      return;
    }
    const packedTotalWeight =
      Number(packedWeight) + Number(excessWeight) + Number(scrapWeight);
    const totalProcessWeight = selectedCard.jobAttributes.reduce((sum, job) => {
      return sum + Number(job.cutWeight);
    }, 0);
    console.log("totalProcessWeight", totalProcessWeight, packedTotalWeight);

    if (packedTotalWeight > totalProcessWeight * 1.03) {
      toast.error(
        "Total of packed weight, excess weight and scrap cannot be greater than 3% of cut weight"
      );
      setShowPopup(true);
      return;
    }
    if (packedTotalWeight * 1.03 < totalProcessWeight) {
      toast.error(
        "Total of packed weight, excess weight and scrap cannot be less than 3% of cut weight"
      );
      setShowPopup(true);
      return;
    }
    const packingDetails = {
      jobNumber: selectedCard.jobNumber,
      workOrder: selectedCard.workOrder,
      scrapWeight: scrapWeight,
      packedWeight: packedWeight,
      excessWeight: excessWeight || 0,
      jobAttributes: selectedCard.jobAttributes.map((attr) => ({
        rollId: attr.rollId,
        jobId: attr.jobId,
      })),
      date: new Date().toISOString().split("T")[0],
    };

    updatePacking(packingDetails);

    // Close the popup
    setSelectedCard(null);
  };

  const handlePasscodeConfirmation = () => {
     const packingDetails = {
      jobNumber: selectedCard.jobNumber,
      workOrder: selectedCard.workOrder,
      scrapWeight: scrapWeight,
      packedWeight: packedWeight,
      excessWeight: excessWeight || 0,
      jobAttributes: selectedCard.jobAttributes.map((attr) => ({
        rollId: attr.rollId,
        jobId: attr.jobId,
      })),
      date: new Date().toISOString().split("T")[0],
    };

    updatePacking(packingDetails);

    // Close the popup
    setSelectedCard(null);
    setPackedWeight("");
    setExcessWeight("");
    setScrapWeight("");

  }

  const totalPages = Math.ceil((packing?.length || 0) / itemsPerPage);
  const currentJobs = packing || [];

  const columns = [
    { label: "Width (mm)", accessor: "width" },
    { label: "Weight (kg)", accessor: "weight" },
    { label: "Cut Weight (kg)", accessor: "cutWeight" },
    { label: "Stack (mm)", accessor: "stack" },
    { label: "Packed Weight (kg)", accessor: "packedWeight" },
    { label: "Scrap (kg)", accessor: "scrap" },
    { label: "Excess Weight (kg)", accessor: "excessWeight" },
  ];
  const handleInputChange = (field, value) => {
    const totalCutWeight = selectedCard.jobAttributes.reduce((sum, job) => {
      return sum + Number(job.cutWeight);
    }, 0);
    console.log("totalCutWeight", totalCutWeight);
    if (field === "packedWeight") {
      const sum = Number(value) + Number(excessWeight) + Number(scrapWeight);

      // if (sum > totalCutWeight) {
      //   toast.error(
      //     "Total of packed weight, excess weight and scrap cannot be greater than cut weight"
      //   );
      //   return;
      // }
      setPackedWeight(value);
    } else if (field === "scrapWeight") {
      const sum = Number(packedWeight) + Number(excessWeight) + Number(value);
      // if (sum > totalCutWeight) {
      //   toast.error(
      //     "Total of packed weight, excess weight and scrap cannot be greater than cut weight"
      //   );
      //   return;
      // }
      setScrapWeight(value);
    } else {
      const sum = Number(packedWeight) + Number(value) + Number(scrapWeight);
      // if (sum > totalCutWeight) {
      //   toast.error(
      //     "Total of packed weight, excess weight and scrap cannot be greater than cut weight"
      //   );
      //   return;
      // }
      setExcessWeight(value);
    }
  };
  return (
    <div className="packing-container">
      <h1>Packing Supervisor</h1>
      {error != null ? (
        <CommonError error={error} />
      ) : (
        <div className="packing-cards">
          {!error && (
            <div className="top-container">
              {enableSearch && (
                <div className="searchBar">
                  <i className="search-icon fa fa-search"></i>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearch}
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
          )}
          {filterActive && (
            <div className="filter-modal">
              <div className="filter-modal-content">
                <h3>Filters</h3>
                <div className="filter-options">
                  {filterableColumns.map((accessor) => {
                    const uniqueValues = availableFilters[accessor];

                    return (
                      <div key={accessor} className="filter-option">
                        <label>
                          {accessor === "jobNumber"
                            ? "Job Number"
                            : "Drawing Number"}
                        </label>
                        <CustomDropdown
                          label={
                            accessor === "jobNumber"
                              ? "Job Number"
                              : "Drawing Number"
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
                    onClick={() => {
                      setFilterActive(false);
                      handleFilterApply(); // Ensure this function is defined and handles the filters
                    }}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}
          {!error && !loading && (
            <>
              {currentJobs.length > 0 ? (
                <>
                  <div className="cards-container">
                    {currentJobs.map((job, index) => (
                      <div
                        key={`${job.jobNumber}-${index}`}
                        className="packing-card"
                        onClick={() => handleCardClick(job)}
                      >
                        <h3>Job No. {job.jobNumber}</h3>
                        <div className="card-body">
                          <p>
                            Drawing No: {job.jobAttributes[0]?.drawingNumber}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Pagination
                    itemsPerPage={pagination.itemsPerPage}
                    currentPage={pagination.currentPage}
                    totalItems={pagination.totalItems}
                    handlePageChange={handlePageChange}
                  />
                </>
              ) : (
                <div className="no-data-container">
                  <img
                    src={nodata}
                    alt="No data available"
                    style={{ width: "200px" }}
                  />
                  <p className="no-data">No data available</p>
                </div>
              )}
            </>
          )}
        </div>
      )}
      {isQRVisible && qrDetails && (
        <div className="qr-overlay">
          <div className="qr-modal">
            <QRScreenPacking
              value={qrDetails}
              onClose={() => setIsQRVisible(false)}
            />
          </div>
        </div>
      )}

      {selectedCard && !isQRVisible && (
        <div className="popup-overlay">
          <div className="popup-container">
            <div className="common-table">
              <div className="popup-title">
                <h3>
                  Job Number: <br></br>
                  {selectedCard.jobNumber}
                </h3>
                <h3>
                  Drawing No: <br></br>
                  {selectedCard.jobAttributes[0].drawingNumber}
                </h3>
                <h3>
                  Work Order: <br></br>
                  {selectedCard.jobAttributes[0].workOrder}
                </h3>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Drawing Weight (kg)</label>
                  <input
                    type="number"
                    value={selectedCard.drawingWeight}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={date || new Date().toISOString().split("T")[0]} // Default to today’s date
                  // onChange={(e) =>
                  //   handleInputChange("scrapWeight", e.target.value)
                  // }
                  />
                </div>
              </div>
              <table className="common-table">
                <thead>
                  <tr>
                    <th>Width (mm)</th>
                    <th>Process Weight (kg)</th>
                    <th>Cut Weight (kg)</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCard.jobAttributes.map(
                    (job, index) =>
                      job.width !== null &&
                      job.cutWeight !== null && (
                        <tr key={index}>
                          <td>{job.width}</td>
                          <td>{job.weight}</td>
                          <td>{job.cutWeight}</td>
                        </tr>
                      )
                  )}
                  <tr>
                    <td>Total:</td>
                    <td>
                      {selectedCard.jobAttributes
                        .reduce((total, job) => total + job.weight, 0)
                        .toFixed(1)}
                    </td>
                    <td>
                      {selectedCard.jobAttributes
                        .reduce(
                          (total, job) =>
                            job.cutWeight != null
                              ? total + job.cutWeight
                              : total,
                          0
                        )
                        .toFixed(1)}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="form-row">
                <div className="form-group">
                  <label>Packed Weight (kg)</label>
                  <input
                    type="number"
                    value={packedWeight}
                    onChange={(e) =>
                      handleInputChange("packedWeight", e.target.value)
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Scrap Weight (kg)</label>
                  <input
                    type="number"
                    value={scrapWeight}
                    onChange={(e) =>
                      handleInputChange("scrapWeight", e.target.value)
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Excess Weight (kg)</label>
                  <input
                    type="number"
                    value={excessWeight}
                    onChange={(e) =>
                      handleInputChange("excessWeight", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="action-container">
                <button className="close-button" onClick={closePopup}>
                  Close
                </button>
                <button
                  className="edit-button"
                  onClick={() => {
                    handleInitiateShortlist();
                  }}
                >
                  Initiate Shortlist
                </button>
                <button
                  className="submit-button"
                  onClick={() => {
                    const allCutting = selectedCard.jobAttributes.every(
                      (job) => job.programStatus === "cutting"
                    );
                    if (allCutting) {
                      handleFinish();
                    } else {
                      toast.error(
                        "Make sure all width of the job is ready for packing"
                      );
                    }
                  }}
                >
                  Finish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showPopup && (
        <ConfirmationPopup
          title="Do you want to proceed with packing?"
          message="Please enter the passcode to proceed."
          isVisible={showPopup}
          confirmPasscode={123456}
          onConfirm={() => {
            setShowPopup(false);
            handlePasscodeConfirmation();
          }}
          onCancel={() => {
            setShowPopup(false);
          }}
        />
      )}

      {/* Shortlist Popup */}
      {shortlistPopupVisible && (
        <div className="popup-overlay">
          <div className="popup-containe">
            <h3>
              Drawing No:
              {selectedCard.drawingNumber}
            </h3>
            <div className="shortlist-tabl">
              <label>Width (mm):</label>
              <select
                value={shortlistValues.width}
                onChange={(e) => handleShortlistChange("width", e.target.value)}
              >
                <option value="">Select</option>
                {selectedCard.jobAttributes.map((job, index) => (
                  <option key={index} value={job.width}>
                    {job.width}
                  </option>
                ))}
              </select>

              <label>Weight (kg):</label>
              <input
                type="number"
                value={shortlistValues.weight}
                onChange={(e) =>
                  handleShortlistChange("weight", e.target.value)
                }
              ></input>
            </div>
            <div className="action-container">
              <button
                className="close-button"
                onClick={() => setShortlistPopupVisible(false)}
              >
                Cancel
              </button>
              <button className="submit-button" onClick={handleShortlistSubmit}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      {loading && (
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
      
    </div>
  );
};

export default Packing;
