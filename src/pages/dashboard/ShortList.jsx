import React, { useState, useEffect } from "react";
import useShortlist from "../../hooks/useShortlist.jsx";
import GenericTable from "../../components/genericTable.jsx";
import "../../styles/ShortList.css";
import { ClipLoader } from "react-spinners";
import CommonError from "../../components/error/CommonError.jsx";
import { useNavigate } from "react-router-dom";
import ShortlistService from "../../services/ShortlistService.jsx";
import toast from "react-hot-toast";

const ShortList = () => {
  const navigate = useNavigate();

  const [currRow, setCurrRow] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currPage, setCurrPage] = useState(1);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [isRollPopupVisible, setRollPopupVisible] = useState(false);
  const [selectedRoll, setSelectedRoll] = useState("");
  const [filters, setFilters] = useState([]);
  const [rollNumbers, setRollNumbers] = useState([]);
  const [rollLoading, setRollLoading] = useState(false); // Added loading state for roll numbers

  const { loading, error, shortlist, moveShortList, pagination, handleExport, assignToRoll,availableFilters } =
    useShortlist(searchQuery, currPage, filters);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setPopupVisible(false);
        setRollPopupVisible(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const onRowClick = (row) => {
    console.log("Row clicked:", row);
    setCurrRow(row);
    setPopupVisible(true);
  };

  const fetchRollNumbers = async (width, thickness, weight) => {
    setRollLoading(true);
    setRollNumbers([]); // Reset previous roll numbers
    try {
      const response = await ShortlistService.getAvailableRolls(width, thickness, weight);
      if (response?.responseStatusList?.statusList &&
        response.responseStatusList.statusList[0]?.statusCode === 200) {
        const result = response.responseObject.data;
        if (result?.length == 0) {
          toast.error(`No roll found for thickness: ${thickness} and width: ${width}`);
          setRollPopupVisible(false);
          return;
        }
        setRollNumbers(response.responseObject.data);
      } else {
        toast.error(response?.responseStatusList?.statusList[0]?.statusDesc ||
          response?.error ||
          "Unknown error");
      }
    } catch (error) {
      console.error("Error fetching rolls:", error);
    } finally {
      setRollLoading(false);
    }
  };

  const handleButtonClick = async (action) => {
    console.log(`Action selected: ${action}`);
    if (!currRow) return;

    if (action === "Slitting") {

      navigate("/slitting", {
        state: {
          jobNumber: currRow.jobNumber,
          width: currRow.width,
          thickness: currRow.thickness,
          workOrder: currRow.workOrder,
          drawingNumber: currRow.drawingNumber,
          weight: currRow.weight,
          jobId: currRow.jobId
        },
      });
      setPopupVisible(false);
    } else if (action === "Roll") {
      setPopupVisible(false);
      await fetchRollNumbers(currRow.width, currRow.thickness, currRow.weight); // Fetch rolls
      setRollPopupVisible(true);
    }
  };

  const handlePopupClose = () => {
    setPopupVisible(false);
  };

  const handleRollPopupClose = () => {
    setRollPopupVisible(false);
    setSelectedRoll("");
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrPage(1);
  };

  const handlePageChange = (page) => {
    setCurrPage(page);
  };

  const handleFilter = (filters) => {
    console.log("Filters applied:", filters);
    setFilters(filters);
    setCurrPage(1);
  };

  const handleRollSubmit = async () => {
    console.log(`Selected roll: ${selectedRoll}`);
    if (!selectedRoll) return;
    const roll = rollNumbers.find((roll) => roll.rollNumber === selectedRoll);
    const body = {
      jobId: currRow.jobId,
      rollNumber: selectedRoll,
      jobNumber: currRow.jobNumber,
      rollId: roll.rollId,
      assignTo: "roll"
    }
    assignToRoll(body);

    setRollPopupVisible(false);
    setSelectedRoll("");
  };

  const columns = [
    { label: "Job No.", accessor: "jobNumber" },
    { label: "Drawing No.", accessor: "drawingNumber" },
    { label: "Work Order No.", accessor: "workOrder" },
    { label: "Thickness (mm)", accessor: "thickness" },
    { label: "Weight (kg)", accessor: "weight" },
    { label: "Width (mm)", accessor: "width" },
  ];

  const filterableColumns = [
    "jobNumber",
    "drawingNumber",
    "workOrder",
    "stack",
    "weight",
    "width",
  ];

  const Modal = ({ isVisible, onClose, children, showDefaultClose = true }) => {
    if (!isVisible) return null;

    return (
      <div className="popup-overlay">
        <div className="popup-contain">
          {children}
          {showDefaultClose && (
            <button className="close-button" onClick={onClose}>
              Close
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="shortlist-container">
        <h1>Shortlist</h1>
        {error ? (
          <CommonError error={error} />
        ) : (
          <div className="shortlist-body">
            <div className="shortlist-table">
              <GenericTable
                loading={loading}
                columns={columns}
                data={shortlist}
                onRowClick={onRowClick}
                onSearchChange={handleSearch}
                enableSearch={true}
                enableFilter={true}
                pagination={pagination}
                filter={availableFilters}
                onFilter={handleFilter}
                onPageChange={handlePageChange}
                filterableColumns={filterableColumns}
              />
            </div>
            {!loading && !error && shortlist.length > 0 && (
              <div className="action-button-container">
                <button className="action-button" onClick={handleExport}>
                  Export
                </button>
              </div>
            )}
          </div>
        )}

        {/* Main Action Popup */}
        {isPopupVisible && (
          <Modal isVisible={true} onClose={handlePopupClose}>
            <div className="button-popup-container">
              <button
                className="popup-button"
                onClick={() => handleButtonClick("Slitting")}
              >
                Slitting
              </button>
              <button
                className="popup-button"
                onClick={() => handleButtonClick("Roll")}
              >
                Roll
              </button>
            </div>
          </Modal>
        )}

        {/* Roll Selection Popup */}
        {isRollPopupVisible && (
          <Modal
            isVisible={true}
            onClose={handleRollPopupClose}
            showDefaultClose={false}
          >
            <div className="cutting-modal-content">
              <h3 className="modal-title">Select Roll No.</h3>
              <div className="select-container">
                {rollLoading ? (
                  <ClipLoader size={30} />
                ) : (
                  <select
                    value={selectedRoll}
                    onChange={(e) => setSelectedRoll(e.target.value)}
                    className="jobno-select"
                  >
                    <option value="">Select a Roll No.</option>
                    {rollNumbers.map((roll) => (
                      <option key={roll.rollNumber} value={roll.rollNumber}>
                        {roll.rollNumber}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div className="action-container">
                <button
                  className="submit-button"
                  onClick={handleRollSubmit}
                  disabled={!selectedRoll.trim()}
                >
                  Submit
                </button>
                <button className="close-button" onClick={handleRollPopupClose}>
                  Cancel
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </>
  );
};

export default ShortList;
