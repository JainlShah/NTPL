import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GenericTable from "../../components/genericTable.jsx";
import useFetchData from "../../hooks/useCoilInventory.jsx";
import "../../styles/coilInventory.css";
import QRScreenCoils from "../../components/QrCodeScreens/QRScreenCoils.jsx";
import GenericForm from "../../components/generic/GenericForm.jsx";
import log from "../../components/logger.jsx";
import { toast } from "react-toastify";
import Remark from "../../components/generic/Remark.jsx";
import exportToExcel from "../../util/export.js";
import { ClipLoader } from "react-spinners";
import CommonError from "../../components/error/CommonError.jsx";
import ConfirmationPopup from "../../components/generic/ConfirmationPopup.jsx";
import QRModelCoil from "../../model/QRModelCoil.jsx";
import Chip from "../../components/Chips.jsx";
import { useRowLock } from "../../hooks/useRowLock.jsx";
//import { set } from "react-datepicker/dist/date_utils.js";

const CoilsInventory = () => {
  const navigate = useNavigate();
  const { lockedRows, lockRow, unlockRow } = useRowLock();

  const [searchQuery, setSearchQuery] = useState("");
  const [currPage, setCurrPage] = useState(1);
  const [filters, setFilters] = useState([]);
  const [isAddCoilVisible, setIsAddCoilVisible] = useState(false);
  const [currRow, setCurrRow] = useState(null);
  const [isQRVisible, setIsQRVisible] = useState(false);
  const [qrDetails, setQrDetails] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const confirmPasscode = "123456";
  const confirmDeletePasscode = "654321";
  const confirmUnblockPasscode = "987654";

  // const [confirmPasscode] = useState("123456");
  const [isVisible, setIsVisible] = useState(false);
  const [isEditUnblockVisible, setIsEditUnblockVisible] = useState(false);
  const [isEditblockVisible, setIsEditblockVisible] = useState(false);
  const [isTransferVisible, setIsTransferVisible] = useState(false);
  const [isUnTransferVisible, setIsUnTransferVisible] = useState(false);

  const onAddSuccess = (data) => {
    log.info("Recently added coil:", data);

    const formattedDate = data.registeredDate
      ? (() => {
          const date = new Date(data.registeredDate);
          const day = String(date.getDate()).padStart(2, "0");
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const year = date.getFullYear();
          return `${day}-${month}-${year}`; // Format: dd-MM-yyyy
        })()
      : "N/A";

    const qrDetails = new QRModelCoil(
      data.coilNumber,
      null, // rollNumber (if not available)
      data.qrCodeNumber,
      data.width,
      data.weight,
      data.grade,
      data.materialType?.toUpperCase(),
      formattedDate,
      data.statusType?.toUpperCase()
    );

    setQrDetails(qrDetails);
    setIsQRVisible(true);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        unlockRow(currRow.coilNumber, "editing")
        setIsQRVisible(false);
        setQrDetails(null);
        setSelectedStatus(null);
        setIsAddCoilVisible(false);
        setIsRemarkVisible(false);
        setIsCoilDetailVisible(false);
        setIsCoilEditable(false);
        setIsDeleteClicked(false);
        setIsVisible(false);
      }
    };
    const handlePopState = () => {
      unlockRow(currRow.coilNumber, "editing");
      console.log("Back");
    };
 
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("popstate", handlePopState);
 
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("popstate", handlePopState);
    };
 
  });
  const {
    data,
    loading,
    error,
    addCoil,
    updateCoil,
    deleteCoil,
    recentlyAddedCoil,
    pagination,
    handleExport,
    handleStatusUpdate,
    availableFilters,
  } = useFetchData(searchQuery, currPage, filters, onAddSuccess);

  const [isCoilDetailVisible, setIsCoilDetailVisible] = useState(false);

  const [isRemarkVisible, setIsRemarkVisible] = useState(false);
  const [isCoilEditable, setIsCoilEditable] = useState(false);
  const [isDeleteClicked, setIsDeleteClicked] = useState(false);

  useEffect(() => {
    // if (recentlyAddedCoil) {
    //   setCurrRow(recentlyAddedCoil);
    //   setIsQRVisible(true);
    // }
    setIsCoilEditable(false);
    console.log(JSON.stringify(availableFilters))
  }, [recentlyAddedCoil,data]);

  const columns = [
    { label: "Coil No.", accessor: "coilNumber" },
    { label: "Coil Grade", accessor: "grade" },
    { label: "Thickness (mm)", accessor: "thickness" },
    { label: "Weight (kg)", accessor: "weight" },
    { label: "MTC_1.5T", accessor: "MTC1_5T" },
    { label: "MTC_1.7T", accessor: "MTC1_7T" },
    { label: "Width (mm)", accessor: "width" },

    {
      label: "Date",
      accessor: "registeredDate",
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
      accessor: "statusType",
      render: (value) => {
        // Map statuses to colors
        const statusColors = {
          ready: "#28a745", // Green
          Blocked: "#dc3545", // Red
          Transfered: "#6c757d", // Gray
          Hold: "#ffc107", // Yellow
        };
        const displayValue =
          value === "transfer"
            ? "Transfered"
            : value === "block"
            ? "Blocked"
            : value === "partialUtilize"
            ? "Ready"
            : value === "hold"
            ? "Hold"
            : "Ready";

        return (
          <Chip
            label={displayValue}
            color={statusColors[displayValue] || "#007bff"}
          />
        );
      },
    },
  ];
  const filterableColumns = [
    "coilNumber",
    "grade",
    "thickness",
    "MTC1_5T",
    "MTC1_7T",
    "width",
    "weight",
    "statusType",
    "registeredDate",
  ];

  const handleQrView = (row) => {
    setCurrRow(row);

    const formattedDate = row.registeredDate
      ? (() => {
          const date = new Date(row.registeredDate);
          const day = String(date.getDate()).padStart(2, "0");
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const year = date.getFullYear();
          return `${day}-${month}-${year}`; // Format: dd-MM-yyyy
        })()
      : "N/A";
    const qrDetails = new QRModelCoil(
      row.coilNumber,
      null, // rollNumber (if not available)
      row.qrCodeNumber,
      row.width,
      row.weight,
      row.grade,
      row.materialType?.toUpperCase() || "N/A", // Convert to uppercase

      formattedDate,
      row.statusType?.toUpperCase()
    );

    setQrDetails(qrDetails);
    console.log("QR details:", qrDetails);
    setIsQRVisible(!isQRVisible);
  };

  const handleFilter = (filters) => {
    log.info("Filters applied:", filters);
    console.log("Filters applied:", filters);

    setFilters(filters);
    setCurrPage(1);
  };

  const onRowClick = (row) => {
    log.info("Row clicked:", row);
    lockRow(row.coilNumber, "editing");
    setCurrRow(row);
    setIsCoilDetailVisible(true);
    setIsVisible(false);
  };

  const showToast = (message, type) => {
    if (type === "error") {
      toast.error(message);
    } else {
      toast.success(message);
    }
  };

  const handleCoilSubmission = (formData, isUpdate = false) => {
    const missingFields = [];
    for (let [key, value] of formData.entries()) {
      if (key === "document" || key === "MTC1_5T") continue;
      if (!value) missingFields.push(key);
    }
    if (isUpdate) {
      log.info("Updating coil details:", formData);
      setIsCoilDetailVisible(false);
      updateCoil(formData);
      setIsCoilEditable(false);
      // showToast("Coil details updated successfully", "success");
    } else {
      log.info("Adding new coil:", formData);
      const form = new FormData();
      for (let [key, value] of formData.entries()) {
        form.append(key, value);
      }
      form.append("statusType", "ready");
      addCoil(form);
      setIsAddCoilVisible(false);
      
    }
    setFilters([]);

  };

  const renderFormFields = (row, editable) => [
    {
      name: "coilNumber",
      label: (
        <div className="flex">
          Coil Number<span className="required-asterisk">*</span>
        </div>
      ),
      type: "text",
      placeholder: "Enter coil number",
      value: row?.coilNumber,
      disabled: !editable || row?.statusType === "partialUtilize",
    },
    {
      name: "grade",
      label: (
        <div className="flex">
          Grade<span className="required-asterisk">*</span>
        </div>
      ),
      type: "text",
      placeholder: "Enter grade",
      value: row?.grade,
      disabled: !editable || row?.statusType === "partialUtilize",
    },
    {
      name: "thickness",
      type: "select",
      placeholder: "Select thickness",
      label: (
        <div className="flex">
          Thickness (mm)<span className="required-asterisk">*</span>
        </div>
      ),
      // type: "number",
      // placeholder: "Enter thickness",
      value: row?.thickness,
      options: [
        //{ label: "Select thickness", value: "" },
        { label: "0.20", value: "0.20" },
        { label: "0.23", value: "0.23" },
        { label: "0.25", value: "0.25" },
        { label: "0.27", value: "0.27" },
        { label: "0.30", value: "0.30" },
      ],
      disabled: !editable || row?.statusType === "partialUtilize",
    },
    {
      name: "weight",
      label: (
        <div className="flex">
          Weight (kg)<span className="required-asterisk">*</span>
        </div>
      ),
      type: "number",
      placeholder: "Enter weight",
      value: row?.weight,
      disabled: !editable || row?.statusType === "partialUtilize",
    },
    {
      name: "MTC1_5T",
      label: <div className="flex">MTC 1.5T</div>,
      type: "number",
      placeholder: "Enter MTC 1.5T",
      value: row?.MTC1_5T,
      disabled: !editable || row?.statusType === "partialUtilize",
    },
    {
      name: "MTC1_7T",
      // label: "MTC 1.7T",
      label: (
        <div className="flex">
          MTC 1.7T
          <span className="required-asterisk">*</span>
        </div>
      ),
      type: "number",
      placeholder: "Enter MTC 1.7T",
      value: row?.MTC1_7T,
      disabled: !editable || row?.statusType === "partialUtilize",
    },
    {
      name: "width",
      label: (
        <div className="flex">
          Width (mm)<span className="required-asterisk">*</span>
        </div>
      ),
      type: "number",
      placeholder: "Enter width",
      value: row?.width,
      disabled: !editable || row?.statusType === "partialUtilize",
    },
    {
      name: "materialType",
      type: "select",
      placeholder: "Select Material Type",
      label: (
        <div className="flex">
          Material Type <span className="required-asterisk">*</span>
        </div>
      ),

      value: row?.materialType,
      options: [
        { label: "CRGO", value: "crgo" },
        { label: "CRNO", value: "crno" },
      ],
      disabled: !editable || row?.statusType === "partialUtilize",
    },
    {
      name: "epstienTest",
      label: "Epstien Test @1.7",
      type: "text",
      placeholder: "Enter Epstien Test",
      value: row?.epstienTest,
      disabled: !editable,
    },
    {
      name: "registeredDate",
      label: (
        <div className="flex">
          Date
          <span className="required-asterisk">*</span>
        </div>
      ),
      type: "date",
      placeholder: "Enter date",
      value: row?.registeredDate
        ? new Date(row?.registeredDate).toISOString().split("T")[0]
        : "",
      disabled: !editable || row?.statusType === "partialUtilize",
    },
    {
      name: "document",
      label: "Uploaded Files",
      type: "file",
      placeholder: "Select files",
      value: row?.document?.filename,
      disabled: !editable || row?.statusType === "partialUtilize",
    },
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrPage(1);
  };
  const handlePageChange = (page) => {
    setCurrPage(page);
  };

  const handleDeleteCoil = () => {
    if (currRow) {
      setIsDeleteClicked(true);
      setIsVisible(false);
    }
    //setIsRemarkVisible(true);
  };
  const handleConfirmDelete = () => {
    deleteCoil(currRow);
    setIsDeleteClicked(false);
    setIsCoilDetailVisible(false);
    setIsVisible(false);
  };

  const handleRemarkSubmission = (remark) => {
    console.log("Remark submitted:", remark);
    const updatedStatusData = {
      coilNumber: currRow.coilNumber,
      statusType: selectedStatus,
      description: remark,
    };
    handleStatusUpdate(updatedStatusData);
    setIsCoilDetailVisible(false);
    setIsRemarkVisible(false);
  };
  const handleAddToSlitting = () => {
    if (currRow.coilNumber) {
      navigate("/slitting?coilNumber=" + currRow.coilNumber);
    }
  };
  return (
    <div className="coil-inventory">
      <h1>Coils Inventory</h1>
      {error != null ? (
        <CommonError error={error} />
      ) : (
        <div className="coil-inventory-body">
          <div className="coil-inventory-table">
            {
              <GenericTable
                columns={columns}
                loading={loading}
                data={data}
                searchQuery={searchQuery}
                enableSearch={true}
                enableFilter={true}
                filter={availableFilters}
                onFilter={handleFilter}
                onQrView={handleQrView}
                onRowClick={onRowClick}
                isAddEnable={true}
                onAddClick={() => setIsAddCoilVisible(true)}
                onSearchChange={handleSearch}
                pagination={pagination}
                onPageChange={handlePageChange}
                filterableColumns={filterableColumns}
                lockedRows={lockedRows}
              />
            }
            {isQRVisible && (
              <div className="qr-overlay">
                <div className="qr-modal">
                  <QRScreenCoils
                    value={qrDetails}
                    onClose={() => setIsQRVisible(false)}
                  />
                </div>
              </div>
            )}
            {isAddCoilVisible && (
              <GenericForm
                fields={renderFormFields(null, true)}
                onSubmit={handleCoilSubmission}
                onClose={() => setIsAddCoilVisible(false)}
                title="Add Coil"
                viewOnly={false}
                showToast={showToast}
                customButtons={(formData, close) => (
                  <>
                    <button
                      className="close-button"
                      onClick={() => setIsAddCoilVisible(false)}
                    >
                      Cancel
                    </button>
                  </>
                )}
              />
            )}
            {isCoilDetailVisible && (
              <>
                <div className="coil-detail-container">
                  <GenericForm
                    key={`coil-details-${isCoilEditable}`}
                    title={
                      isCoilEditable ? "Update Coil Details" : "Coil Details"
                    }
                    fields={renderFormFields(currRow, isCoilEditable)}
                    data={currRow}
                    onClose={() => {
                      unlockRow(currRow.coilNumber, "editing");
                      setIsCoilDetailVisible(false);
                      setIsCoilEditable(false);
                    }}
                    isMoveCoil={true}
                    onAddToSlitting={handleAddToSlitting}
                    viewOnly={!isCoilEditable}
                    onSubmit={(formDataToSubmit) => {
                      unlockRow(currRow.coilNumber, "editing");
                      handleCoilSubmission(formDataToSubmit, true);
                    }}
                    showToast={showToast}
                    customButtons={(formData, onClose) => (
                      <>
                        <button
                          onClick={() => {
                            unlockRow(formData.coilNumber, "editing");
                            onClose();
                          }}
                          className="close-button"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            unlockRow(formData.coilNumber, "editing");
                            handleDeleteCoil();
                          }}
                          className="delete-button"
                        >
                          Delete
                        </button>
                        {isDeleteClicked && (
                          <ConfirmationPopup
                            message="Are you sure you want to delete this coil?"
                            title="Delete Coil"
                            onConfirm={handleConfirmDelete}
                            onCancel={() => {
                              setIsDeleteClicked(false);
                              setIsVisible(false);
                              setIsRemarkVisible(false);
                            }}
                            confirmPasscode={confirmDeletePasscode}
                            isVisible={isDeleteClicked}
                          />
                        )}
                        {isCoilEditable ? (
                          <></>
                        ) : (
                          <>
                            {(currRow.statusType === "ready" ||
                              currRow.statusType === "partialUtilize") && (
                              <button
                                onClick={() => {
                                  setIsVisible(true);
                                  // setIsCoilEditable(true)
                                  setIsDeleteClicked(false);
                                }}
                                className="edit-button"
                              >
                                Edit
                              </button>
                            )}
                            {isVisible && (
                              <ConfirmationPopup
                                title="Edit Coil"
                                message="Please enter the passcode to edit coil."
                                confirmPasscode={confirmPasscode}
                                isVisible={isVisible}
                                onConfirm={() => {
                                  setIsVisible(false);
                                  setIsCoilEditable(true);
                                  setIsDeleteClicked(false);
                                }}
                                onCancel={() => {
                                  setIsVisible(false);
                                  setIsDeleteClicked(false);
                                }}
                              />
                            )}

                            {currRow.statusType === "" ||
                            currRow.statusType === null ? (
                              <>
                                <button
                                  className="status-button"
                                  onClick={() => {
                                    setIsRemarkVisible(true);
                                    setSelectedStatus("transfer");
                                  }}
                                >
                                  Transfer
                                </button>

                                <button
                                  className="status-button"
                                  onClick={() => {
                                    setIsRemarkVisible(true);
                                    setSelectedStatus("block");
                                  }}
                                >
                                  Block
                                </button>
                              </>
                            ) : currRow.statusType === "transfer" ? (
                              <button
                                className="status-button"
                                onClick={() => {
                                  //setIsRemarkVisible(true);
                                  setSelectedStatus("ready");
                                  setIsUnTransferVisible(true);
                                }}
                              >
                                Un-Transfer
                              </button>
                            ) : (
                              <>
                                <button
                                  className="status-button"
                                  onClick={() => {
                                    //setIsRemarkVisible(true);
                                    setSelectedStatus("transfer");
                                    setIsTransferVisible(true);
                                  }}
                                >
                                  Transfer
                                </button>
                                {currRow.statusType === "block" ? (
                                  <button
                                    className="status-button"
                                    onClick={() => {
                                      setIsEditUnblockVisible(true);
                                      console.log("Unblock clicked");

                                      //setIsRemarkVisible(true);
                                      setSelectedStatus("ready");
                                    }}
                                  >
                                    Un-Block
                                  </button>
                                ) : (
                                  <button
                                    className="status-button"
                                    onClick={() => {
                                      //setIsRemarkVisible(true);
                                      setIsEditblockVisible(true);
                                      setIsEditUnblockVisible(false);
                                      setSelectedStatus("block");
                                    }}
                                  >
                                    Block
                                  </button>
                                )}
                              </>
                            )}
                            {isEditUnblockVisible && (
                              <ConfirmationPopup
                                title="Unblock Coil"
                                message="Please enter the passcode to unblock the coil."
                                isVisible={isEditUnblockVisible}
                                confirmPasscode={confirmUnblockPasscode}
                                onConfirm={() => {
                                  setIsEditUnblockVisible(false);
                                  setSelectedStatus("ready");
                                  setIsRemarkVisible(true);
                                }}
                                onCancel={() => {
                                  setIsEditUnblockVisible(false);
                                }}
                              />
                            )}
                            {isEditblockVisible && (
                              <ConfirmationPopup
                                title="Block Coil"
                                message="Please enter the passcode to block the coil."
                                isVisible={isEditblockVisible}
                                confirmPasscode={confirmUnblockPasscode}
                                onConfirm={() => {
                                  setIsEditblockVisible(false);
                                  setSelectedStatus("block");
                                  setIsRemarkVisible(true);
                                }}
                                onCancel={() => {
                                  setIsEditblockVisible(false);
                                }}
                              />
                            )}
                            {isTransferVisible && (
                              <ConfirmationPopup
                                title="Transfer Coil"
                                message="Please enter the passcode to Transfer the coil."
                                isVisible={isTransferVisible}
                                confirmPasscode={confirmPasscode}
                                onConfirm={() => {
                                  setIsTransferVisible(false);
                                  setSelectedStatus("transfer");
                                  setIsRemarkVisible(true);
                                }}
                                onCancel={() => {
                                  setIsTransferVisible(false);
                                }}
                              />
                            )}
                            {isUnTransferVisible && (
                              <ConfirmationPopup
                                title="Un-Transfer Coil"
                                message="Please enter the passcode to Un-Transfer the coil."
                                isVisible={isUnTransferVisible}
                                confirmPasscode={confirmPasscode}
                                onConfirm={() => {
                                  setIsUnTransferVisible(false);
                                  setSelectedStatus("ready");
                                  setIsRemarkVisible(true);
                                }}
                                onCancel={() => {
                                  setIsUnTransferVisible(false);
                                }}
                              />
                            )}
                          </>
                        )}
                      </>
                    )}
                  />
                </div>
                {isRemarkVisible && (
                  <Remark
                    onClose={() => {
                      // unlockRow(currRow.coilNumber, "editing");
                      setIsRemarkVisible(false);
                    }}
                    onSave={(data) => {
                      unlockRow(currRow.coilNumber, "editing");
                      handleRemarkSubmission(data);
                    }}
                  />
                )}
              </>
            )}
          </div>

          {data.length > 0 && (
            <div className="action-button-containe">
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
    </div>
  );
};

export default CoilsInventory;
