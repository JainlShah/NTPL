import React, { useState, useEffect } from "react";
import log from "../../../components/logger";
import useScrap from "../../../hooks/useScrap";
import "../../../styles/ScrapScreen.css";
import exportToExcel from "../../../util/export";
import GenericForm from "../../../components/generic/GenericForm";
import { ClipLoader } from "react-spinners";
import CommonError from "../../../components/error/CommonError";
import toast from "react-hot-toast";
import ScrapByThickness from "./ScrapByThickness";
import ScrapByType from "./ScrapByType";
import GenericTable from "../../../components/genericTable";
import ScrapByRoll from "./scrapByRoll";

const ScrapScreen = () => {
  const [isDetailsVisible, setDetailsVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [actualWeight, setActualWeightMoved] = useState(""); // For "Actual Weight Moved"
  const [formData, setFormData] = useState(null); // State to store form data
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currPage, setCurrPage] = useState(1);
  const [filters, setFilters] = useState([]);
  const [activeTab, setActiveTab] = useState("thickness");

  const { loading, error, scrapList, moveScrap, pagination, handleExport, availableFilters } =
    useScrap(searchQuery, currPage, filters);

  // Handle Escape key to close popups
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setDetailsVisible(false);
        setPopupVisible(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Log pagination changes
  useEffect(() => {
    log.info("Scrap list pagination:", pagination);
  }, [scrapList]);

  // Table columns
  const columns = [
    { label: "Thickness", accessor: "thickness" },
    {
      label: "Scrap Type",
      accessor: "scrapType",
      render: (value) =>
        value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(),
    },
    { label: "Weight", accessor: "weight" },
    {
      label: "Date",
      accessor: "createdAt",
      render: (value) => {
        const date = new Date(value);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`; // Format: dd-MM-yyyy
      },
    },
  ];

  // Filterable columns
  const filterableColumns = ["thickness", "scrapType", "weight", "createdAt"];

  // Handle row click
  const handleRowClick = (row) => {
    log.info("Row clicked:", row);
    setSelectedRow(row);
    setDetailsVisible(true);
    setActualWeightMoved(""); // Reset actual weight
    setInputError(""); // Clear any previous errors
  };

  const handleFormSubmit = (formData) => {
    const actualWeightMoved = formData.get("actualWeightMoved");
    const selectedWeight = selectedRow.weight;

    // Validate input before submission
    if (parseFloat(actualWeightMoved) > parseFloat(selectedWeight)) {
      toast.error(
        "Actual weight moved cannot be greater than the total scrap weight."
      );
      return;
    }

    // If validation passes, proceed with the form submission
    handleMove(formData);
  };

  // Handle move scrap
  const handleMove = (formData) => {
    log.info(`Actual Weight Moved: ${actualWeight}`);
    setFormData(formData); // Store form data
    setPopupVisible(true);
  };

  // Handle popup close
  const handlePopupClose = () => {
    setPopupVisible(false);
    setDetailsVisible(false);
  };

  // Handle button click in popup
  const handleButtonClick = (buttonName) => {
    log.info(`${buttonName} clicked.`);
    let data = null;
    if (formData) {
      const jsonData = {};
      for (let pair of formData.entries()) {
        jsonData[pair[0]] = pair[1] instanceof File ? pair[1].name : pair[1];
      }
      jsonData.scrapStatus = buttonName;
      jsonData.scrapId = selectedRow.scrapId;
      log.info("Form Data JSON:", JSON.stringify(jsonData, null, 2));
      data = jsonData;
    }

    handlePopupClose();
    const transferData = {
      scrapId: data.scrapId,
      scrapStatus: data.scrapStatus,
      actualWeight: Number(data.actualWeightMoved),
    };
    moveScrap(transferData);
  };

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrPage(page);
  };

  // Handle filters
  const handleFilter = (filters) => {
    log.info("Filters applied:", filters);
    setFilters(filters);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  }

  return (
    <>
      <div className="scrap-screen">
        <h1 className="title">Scrap Management</h1>

        <div className="scrap-container">
          {error != null ? (
            <CommonError error={error} />
          ) : (
            //   <GenericTable
            //     columns={columns}
            //     loading={loading}
            //     data={scrapList}
            //     onRowClick={handleRowClick}
            //     enableSearch={true}
            //     onPageChange={handlePageChange}
            //     onSearchChange={handleSearch}
            //     pagination={pagination}
            //     enableFilter={true}
            //     filter = {availableFilters}
            //     onFilter={handleFilter}
            //     filterableColumns={filterableColumns}
            //   />
            // )
            <>
              <div className="scrap-tab-container">
                <span
                  className={`tab ${activeTab === "thickness" ? "active" : ""}`}
                  onClick={() => { handleTabClick("thickness") }}
                >
                  Thickness
                </span>
                <span
                  className={`tab ${activeTab === "scrapType" ? "active" : ""}`}
                  onClick={() => { handleTabClick("scrapType") }}
                >
                  Scrap type
                </span>
                <span
                  className={`tab ${activeTab === "rolls" ? "active" : ""}`}
                  onClick={() => { handleTabClick("rolls") }}
                >
                  Rolls
                </span>
                
              </div>
              <hr />

              <div className="scrap-body-container">

                {activeTab === "rolls" && (
                  <>
                    <ScrapByRoll />
                  </>
                )}

                {activeTab === "thickness" && (
                  <>
                    <ScrapByThickness />
                  </>
                )}
                {activeTab === "scrapType" && (
                  <>
                    <ScrapByType />
                  </>
                )}
              </div>
            </>
          )

          }
        </div>

        {isDetailsVisible && selectedRow && (
          <GenericForm
            fields={[
              {
                label: "Thickness",
                name: "thickness",
                type: "text",
                placeholder: "Thickness",
                value: selectedRow.thickness,
                disabled: true,
              },
              {
                label: "Scrap Type",
                name: "scrapType",
                type: "text",
                placeholder: "Scrap Type",
                value: selectedRow.scrapType,
                disabled: true,
              },
              {
                label: "Weight",
                name: "weight",
                type: "number",
                placeholder: "Weight",
                value: selectedRow.weight,
                disabled: true,
              },
              {
                label: "Date",
                name: "createdAt", // The name for the date field
                type: "text", // You can make it a "text" field for user input, or a "date" field if using a date picker
                placeholder: "Date",
                value: selectedRow.createdAt
                  ? new Date(selectedRow.createdAt).toLocaleDateString()
                  : "",
                disabled: true, // Keep disabled to prevent editing
              },
              {
                label: "Actual Weight Moved",
                name: "actualWeightMoved",
                type: "number",
                placeholder: "Actual Weight Moved",
                value: actualWeight,
                disabled: false,
              },
            ]}
            title="Update Scrap"
            onSubmit={handleFormSubmit}
            onClose={() => setDetailsVisible(false)}
            customButtons={(formData, onClose) => (
              <>
                <button className="close-button" onClick={onClose}>
                  Cancel
                </button>
              </>
            )}
          />
        )}

        {/* {scrapList.length > 0 && (
          <div className="action-button-container">
            <button
              className="action-button"
              onClick={handleExport}
              disabled={scrapList.length === 0}
            >
              Export
            </button>
          </div>
        )} */}

        {/* Popup */}
        {isPopupVisible && (
          <div className="button-popup-overlay">
            <div className="button-popup-container">
              <button
                className="popup-button"
                onClick={() => handleButtonClick("dispatch")}
              >
                Dispatch
              </button>
              <button
                className="popup-button"
                onClick={() => handleButtonClick("scrapyard")}
              >
                Scrap Yard
              </button>
              <button className="popup-close" onClick={handlePopupClose}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ScrapScreen;
