import React, { useState, useEffect } from "react";
import log from "../../../components/logger";
import GenericTable from "../../../components/genericTable";
import { useJobOrder } from "../../../hooks/useJobOrder";
import "../../../styles/jobOrderList.css";
import JobOrderBirthing from "../jobOrder/jobOrderBirthing";
import { ClipLoader } from "react-spinners";
import CommonError from "../../../components/error/CommonError";
import QRModelPacking from "../../../model/QRModelPacking.jsx";
import QRScreenPacking from "../../../components/QrCodeScreens/QrScreenPacking.jsx";
import Chip from "../../../components/Chips.jsx";
import { render } from "react-dom";

const JobOrderList = () => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [isDetailsVisible, setDetailsVisible] = useState(false);
  const [isAddJobOrderVisible, setAddJobOrderVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currPage, setCurrPage] = useState(1);
  const [filters, setFilters] = useState([]);
  const [qrDetails, setQrDetails] = useState(null);
  const [isQRVisible, setIsQRVisible] = useState(false);
  const [currRow, setCurrRow] = useState(null);

  const {
    loading,
    error,
    addJobOrder,
    updateJobOrder,
    deleteJobOrder,
    data,
    pagination,
    handleExport,
    availableFilters,
  } = useJobOrder(searchQuery, currPage, filters);

  // Transform the data to include a formatted status

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setDetailsVisible(false);
        setAddJobOrderVisible(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleAddCick = () => {
    log.info("Add job order clicked");
    setAddJobOrderVisible(true);
  };

  const handleOnRowClick = (row) => {
    log.info("Row clicked:", row);
    const isPacked = row.status === "Packed";
    setSelectedRow({ ...row, isPacked });
    setDetailsVisible(true);
  };

  const handleAddJobOrder = (formData) => {
    console.log("New item added:", formData);
    setAddJobOrderVisible(false);
    addJobOrder(formData);
    setSelectedRow(null);
    setDetailsVisible(false);
    setCurrPage(1);
    setSearchQuery("");
    setFilters([]);
  };

  const handleEditJobOrder = (formData) => {
    console.log("Item edited:", formData);
    setDetailsVisible(false);
    updateJobOrder(formData);
  };

  const handleDeleteJobOrder = (jobNo) => {
    console.log("Item deleted:", jobNo);
    deleteJobOrder(jobNo);
    setDetailsVisible(false);
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
  const handleQrView = (row) => {
    if (!row || !data || data.length === 0) {
      console.error("Invalid row or data is empty");
      return;
    }

    if (row.status !== "Packed") {
      console.warn("QR View is disabled for In Progress jobs.");
      return;
    }

    const selectedData = data.find((item) => item.jobNumber === row.jobNumber);

    if (!selectedData) {
      console.error("Selected row not found in data");
      return;
    }

    // const formattedDate = selectedData.updatedAt
    //   ? new Date(selectedData.updatedAt).toISOString().split("T")[0]
    //   : "N/A";
    const formattedDate = selectedData.updatedAt
      ? (() => {
          const date = new Date(selectedData.updatedAt);
          const day = String(date.getDate()).padStart(2, "0");
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const year = date.getFullYear();
          return `${day}-${month}-${year}`; // Format: dd-MM-yyyy
        })()
      : "N/A";
      console.log("Selected Data:", selectedData);

    const qrDetails = new QRModelPacking(
      selectedData.qrCodeNumber || "N/A",
      selectedData.jobNumber || "N/A",
      selectedData.drawingNumber || "N/A",
      selectedData.workOrder || "N/A",
      selectedData.customerName || "N/A",
      selectedData.packedWeight || "N/A",
      selectedData.PONumber || "N/A",
      formattedDate
    );

    setQrDetails(qrDetails);
    console.log("QR details:", qrDetails);
    setIsQRVisible(true);
  };

  const handlePageChange = (page) => {
    setCurrPage(page);
  };
  const transformedData = React.useMemo(() => {
    return data.map((item) => {
      // Check if all job attributes have programStatus as "Job_Birthing"
      const allJobBirthing = item.jobAttributes?.every(
        (attr) => attr.programStatus === "Job_Birthing"
      );

      return {
        ...item,
        status: allJobBirthing
          ? "Ready for Slitting"
          : item.status === "Job_Birthing"
          ? "Ready for Slitting" // Map "Job_Birthing" to "Ready"
          : item.isPacked
          ? "Packed"
          : "In Progress",
      };
    });
  }, [data]);

  // Updated columns definition with simplified status handling
  const columns = [
    { label: "Job No", accessor: "jobNumber" },
    { label: "Work Order", accessor: "workOrder" },
    { label: "Drawing No.", accessor: "drawingNumber" },
    {
      label: "Status",
      accessor: "status",
      render: (value) => {
        const statusColor =
          value === "Packed"
            ? "#28a745"
            : value === "Ready for Slitting"
            ? "#007bff"
            : "#ffc107";
        return <Chip label={value} color={statusColor} />;
      },
    },
  ];

  const filterableColumns = [
    "jobNumber",
    "workOrder",
    "drawingNumber",
    "status",
  ];

  return (
    <div className="job-list">
      <h1>Job Number</h1>
      {error != null ? (
        <CommonError error={error} />
      ) : (
        <div className="roll-inventory-body">
          <GenericTable
            loading={loading}
            searchQuery={searchQuery}
            enableSearch={true}
            enableFilter={true}
            columns={columns}
            data={transformedData} // Use transformed data instead of raw data
            isAddEnable={true}
            onAddClick={handleAddCick}
            onRowClick={handleOnRowClick}
            onSearchChange={handleSearch}
            onQrView={(row) => {
              if (row.status === "Packed") {
                handleQrView(row);
              }
            }}
            pagination={pagination}
            onPageChange={handlePageChange}
            filter={availableFilters}
            onFilter={handleFilter}
            filterableColumns={filterableColumns}
          />
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
          {transformedData.length > 0 && (
            <div className="action-button-container">
              {/* <button
                className="action-button"
                onClick={handleExport}
                disabled={transformedData.length === 0}
              >
                Export
              </button> */}
            </div>
          )}
        </div>
      )}

      {isAddJobOrderVisible && (
        <JobOrderBirthing
          onCancelClick={() => setAddJobOrderVisible(false)}
          data={null}
          isEditMode={true}
          onSaveClick={handleAddJobOrder}
        />
      )}
      {isDetailsVisible && (
        <JobOrderBirthing
          data={selectedRow}
          isEditMode={false}
          onCancelClick={() => setDetailsVisible(false)}
          onSaveClick={handleEditJobOrder}
          onDeleteClick={handleDeleteJobOrder}
        />
      )}
    </div>
  );
};

export default JobOrderList;
