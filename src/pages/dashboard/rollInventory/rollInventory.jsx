import React, { useState, useEffect } from "react";
import GenericTable from "../../../components/genericTable";
import useRollInventory from "../../../hooks/useRollInventory";
import log from "../../../components/logger";
import ActionMenu from "../rollInventory/ActionMenu";
import "../../../styles/rollInventory.css";
import { ClipLoader } from "react-spinners";
import CommonError from "../../../components/error/CommonError";
import Chip from "../../../components/Chips";
import QRModelRolls from "../../../model/QRModelRolls.jsx";
import QRScreenRolls from "../../../components/QrCodeScreens/QrScreenRolls.jsx";

const RollInventroy = () => {
  const [selelctedRow, setSelectedRow] = useState(null);
  const [isMenuVisible, setMenuVisible] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [currPage, setCurrPage] = useState(1);
  const [filters, setFilters] = useState([]);
  const [currRow, setCurrRow] = useState(null);
  const [qrDetails, setQrDetails] = useState(null);
  const [isQRVisible, setIsQRVisible] = useState(false);

  const {
    data,
    loading,
    error,
    addRoll,
    updateRoll,
    deleteRoll,
    recentlyAddedRoll,
    pagination,
    handleExport,
    updateRollsStatus,
    moveRollToCutting,
    availableFilters,
    unassignRoll,
  } = useRollInventory(searchQuery, currPage, filters);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsQRVisible(false);
        setQrDetails(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });
  useEffect(() => {
    log.info("Roll Inventory", data);
    log.info("availableFilters", availableFilters);
  }, [data]);

  const handleUnassign = async (formData) => {
    const success = await unassignRoll(formData.rollId);
    if (success) {
      setMenuVisible(false);
    }
  };

  const handleFilter = (filters) => {
    log.info("Filters applied:", filters);
    setFilters(filters);
    setCurrPage(1);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrPage(1);
  };

  const handlePageChange = (page) => {
    setCurrPage(page);
  };

  const handleActionMenuClick = (row) => {
    console.log("Action menu clicked for row:", row);
    setSelectedRow(row);
    setMenuVisible(true);
  };
  const handleQrView = (row) => {
    if (!row || !data || data.length === 0) {
      console.error("Invalid row or data is empty");
      return;
    }

    // Find the selected row from the data array
    const selectedData = data.find(
      (item) => item.rollNumber === row.rollNumber
    );

    if (!selectedData) {
      console.error("Selected row not found in data");
      return;
    }

    // Format the date before passing it
    // const formattedDate = selectedData.createdAt
    //   ? new Date(selectedData.createdAt).toISOString().split("T")[0]
    //   : "N/A";

    const formattedDate = selectedData.createdAt
      ? (() => {
          const date = new Date(selectedData.createdAt);
          const day = String(date.getDate()).padStart(2, "0");
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const year = date.getFullYear();
          return `${day}-${month}-${year}`; // Format: dd-MM-yyyy
        })()
      : "N/A";

    const formattedJobNumber = selectedData.jobNumber
      ?.toUpperCase()
      .startsWith("EXTRA")
      ? "EXTRA"
      : selectedData.jobNumber || "N/A";

    const qrDetails = new QRModelRolls(
      selectedData.coilNumber || "N/A",
      selectedData.rollNumber || "N/A",
      selectedData.qrCodeNumber || "N/A",
      formattedJobNumber,
      selectedData.drawingNumber || "N/A",
      selectedData.width || "N/A",
      selectedData.weight || "N/A",
      selectedData.grade || "N/A",
      selectedData.materialType?.toUpperCase() || "N/A", // Convert to uppercase
      formattedDate,
      selectedData.rollStatus
    );

    setQrDetails(qrDetails);
    console.log("QR details:", qrDetails);
    setIsQRVisible(true);
  };

  const onRowClick = (row) => {
    log.info("Row clicked:", row);
    setCurrRow(row);
    setIsCoilDetailVisible(true);
    setIsVisible(false);
  };

  const columns = [
    {
      label: "Roll No.",
      accessor: "rollNumber",
      render: (value) => {
        if (value?.toLowerCase().startsWith("balanced")) {
          return "Balanced";
        }
        return value;
      },
    },
    { label: "Width (mm)", accessor: "width" },
    { label: "Weight (kg)", accessor: "weight" },
    { label: "Thickness (mm)", accessor: "thickness" },
    // { label: "Length (mm)", accessor: "length" },
    { label: "Grade", accessor: "grade" },
    { label: "MTC1_7T", accessor: "MTC1_7T" },
    // {
    //   label: "Date",
    //   accessor: "createdAt",
    //   render: (value) => {
    //     if (value) {
    //       const date = new Date(value);
    //       if (!isNaN(date.getTime())) {
    //         return date.toISOString().split("T")[0];
    //       }
    //     }
    //     return "N/A";
    //   },
    // },
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
    {
      label: "Status",
      accessor: "rollStatus",
      render: (value) => {
        const capitalizedValue =
          value?.charAt(0).toUpperCase() + value?.slice(1);

        const statusColors = {
          Ready: "#28a745",
          Hold: "#dc3545",
          Blocked: "#ffc107",
          Block: "#6c757d",
          Reject: "#dc3545",
        };

        return (
          <Chip
            label={capitalizedValue}
            color={statusColors[capitalizedValue] || "#007bff"}
          />
        );
      },
    },
  ];

  const filterableColumns = [
    "rollNumber",
    "stack",
    "width",
    "weight",
    "thickness",
    "length",
    "grade",
    "MTC1_7T",
    "createdAt",
    "rollstatus",
  ];

  const handleUpdate = (formData) => {
    log.info("Update formData:", formData);
    updateRollsStatus(formData);
    setMenuVisible(false);
  };
  const handleMoveToCutting = (data) => {
    log.info("Move to Cutting:", data);
    moveRollToCutting(data);
    setMenuVisible(false);
  };
  return (
    <div className="roll-inventory-container">
      <h1>Roll Inventory</h1>
      {error != null ? (
        <CommonError error={error} />
      ) : (
        <div className="roll-inventory-body">
          {
            <GenericTable
              loading={loading}
              columns={columns}
              data={data}
              enableSearch={true}
              filter={availableFilters}
              enableFilter={true}
              onSearchChange={handleSearch}
              onFilter={handleFilter}
              onPageChange={handlePageChange}
              pagination={pagination}
              onMenuClick={handleActionMenuClick}
              onQrView={handleQrView}
              onRowClick={onRowClick}
              filterableColumns={filterableColumns}
            />
          }
          {isQRVisible && qrDetails && (
            <div className="qr-overlay">
              <div className="qr-modal">
                <QRScreenRolls
                  value={qrDetails}
                  onClose={() => setIsQRVisible(false)}
                />
              </div>
            </div>
          )}
          {data.length > 0 && (
            <div className="action-button-container">
              <button
                className="action-button"
                onClick={handleExport}
                disabled={data.length === 0}
              >
                Export
              </button>
            </div>
          )}
        </div>
      )}
      {isMenuVisible && (
        <ActionMenu
          isModelVisible={isMenuVisible}
          row={selelctedRow} // Pass the selected row
          onClose={() => setMenuVisible(false)}
          onUpdate={handleUpdate}
          moveToCutting={handleMoveToCutting}
          onUnassign={handleUnassign}
        />
      )}
    </div>
  );
};

export default RollInventroy;
