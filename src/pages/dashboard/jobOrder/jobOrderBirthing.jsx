import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "../../../styles/jobOrderBirthing.css";
import ConfirmationPopup from "../../../components/generic/ConfirmationPopup";

const JobOrderBirthing = ({
  data = null,
  isEditMode = false,
  onSaveClick,
  onCancelClick,
  onDeleteClick,
}) => {
  const [rows, setRows] = useState([]);
  const [editMode, setEditMode] = useState(isEditMode);
  const [formData, setFormData] = useState({
    jobNumber: "",
    sets: "",
    drawingNumber: "",
    customerJobNumber: "",
    workOrder: "",
    PONumber: "",
    drawingWeight: "",
    customerName: "",
  });
  const [isPasscodePopupVisible, setIsPasscodePopupVisible] = useState(false);
  const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] =
    useState(false);
  const confirmPasscode = "123456";
  const confirmDeletePasscode = "654321";

  const thicknessOptions = ["Select Thickness", "0.2", "0.23", "0.25", "0.27", "0.3"];

  useEffect(() => {
    if (data) {
      setFormData({
        jobNumber: data.jobNumber || "",
        sets: data.sets || "",
        drawingNumber: data.drawingNumber || "",
        customerJobNumber: data.customerJobNumber || "",
        workOrder: data.workOrder || "",
        PONumber: data.PONumber || "",
        drawingWeight: data.drawingWeight || "",
        customerName: data.customerName || "",
      });

      const jobAttributes = data.jobAttributes || [];
      const rowsData = jobAttributes.map((item) => ({
        width: item.width || "",
        thickness: item.thickness || "",
        trimmingWeight: item.trimmingWeight || "",
        processWeight: item.processWeight || "",
        usedWeight: item.usedWeight,
        status: item.programStatus || "",
      }));

      setRows(rowsData);
    } else {
      setFormData({
        jobNumber: "",
        sets: "",
        drawingNumber: "",
        customerJobNumber: "",
        workOrder: "",
        PONumber: "",
        drawingWeight: "",
        customerName: "",
      });
      setRows([
        {
          width: "",
          thickness: "",
          trimmingWeight: "",
          processWeight: "",
        },
      ]);
    }
  }, [data]);

  const handleInputChange = (index, field, value) => {
    if (!editMode) return;

    if (value < 0) {
      toast.error(`${field} cannot be negative.`);
      return;
    }
    if (value > 9999) {
      toast.error(`${field} cannot be greater than 9999.`);
      return;
    }

    const updatedRows = rows.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    );

    // Ensure Width Uniqueness
    if (field === "width") {
      const isOccupied = rows.some(
        (row, i) => i !== index && row.width === value
      );
      if (isOccupied) {
        toast.error("Width already exists.");
        return;
      }
    }

    // Auto-Calculate Process Weight
    if (field === "trimmingWeight" || field === "width") {
      const processWeight =
        updatedRows[index].width * updatedRows[index].trimmingWeight;
      updatedRows[index].processWeight = processWeight.toFixed(2);
    }

    // Validate Process Weight Against Used Weight
    if (updatedRows[index].processWeight < updatedRows[index].usedWeight) {
      toast.error(
        `Process Weight (${updatedRows[index].processWeight}) cannot be less than Consumed Weight (${updatedRows[index].usedWeight}).`
      );
      return;
    }

    setRows(updatedRows);

  };

  const handleAddRow = () => {
    const emptyFields = rows.reduce((acc, row) => {
      Object.entries(row).forEach(([key, value]) => {
        if (
          (!value || String(value).trim() === "") &&
          key !== "usedWeight" &&
          key !== "status"
        ) {
          acc.push(key);
        }
      });
      return acc;
    }, []);

    if (emptyFields.length > 0) {
      toast.error(`${emptyFields.join(", ")} is required.`);
      return;
    }
    setRows([
      ...rows,
      { width: "", thickness: "", trimmingWeight: "", processWeight: "" },
    ]);
  };

  const handleDeleteRow = (index) => {
    if (rows.length > 1) {
      const updatedRows = rows.filter((_, i) => i !== index);
      setRows(updatedRows);
    } else {
      toast.error("You cannot delete the last row.");
    }
  };

  const validateForm = () => {
    let isValid = true;
    const emptyFields = Object.entries(formData).reduce((acc, [key, value]) => {
      if (
        (!value || String(value).trim() === "") &&
        key !== "customerJobNumber"
      ) {
        acc.push(key);
        isValid = false;
      }
      return acc;
    }, []);

    const emptyRowFields = rows.reduce((acc, row, rowIndex) => {
      Object.entries(row).forEach(([key, value]) => {
        if (
          (!value || String(value).trim() === "") &&
          key !== "usedWeight" &&
          key !== "status"
        ) {
          acc.push(`Row ${rowIndex + 1}: ${key}`);
          isValid = false;
        }
      });
      return acc;
    }, []);

    if (emptyFields.length > 0) {
      toast.error(`${emptyFields.join(", ")} is required.`);
    }

    if (emptyRowFields.length > 0) {
      toast.error(`${emptyRowFields.join(", ")} is required.`);
    }

    return isValid;
  };

  const handleSaveClick = () => {
    if (validateForm()) {
      const savedData = {
        jobNumber: formData.jobNumber,
        sets: formData.sets,
        drawingNumber: formData.drawingNumber,
        customerJobNumber: formData.customerJobNumber,
        workOrder: formData.workOrder,
        PONumber: formData.PONumber,
        drawingWeight: Number(formData.drawingWeight),
        customerName: formData.customerName,
        jobAttributes: rows.map((row) => ({
          width: row.width,
          thickness: row.thickness,
          trimmingWeight: row.trimmingWeight,
          processWeight: row.processWeight,
        })),
      };

      console.log("Saved Data:", savedData);
      toast.success("Changes saved!");
      setEditMode(false);
      if (onSaveClick) {
        onSaveClick(savedData);
      }
    }
  };

  const handleFormChange = (field, value) => {
    if(field === "drawingWeight"){
      setFormData({ ...formData, [field]: value });
      return;
    }
    if (field === "customerName") {
      setFormData({ ...formData, [field]: value });
      return;
    }
    const validInput = value.match(/^[0-9a-zA-Z\/\(\)\-_ ]*$/);
    if (!validInput) {
      toast.error(
        "Invalid input. Only alphanumeric characters, '/', '()', '_', and space are allowed."
      );
      return;
    }
    setFormData({ ...formData, [field]: value });
  };

  const handleCancelClick = () => {
    onCancelClick();
  };

  const handleDeleteClick = () => {
    setIsDeleteConfirmationVisible(true);
  };

  const confirmDelete = () => {
    if (onDeleteClick) {
      onDeleteClick(data?.jobNumber);
    }
  };

  const handlePasscodeConfirm = () => {
    setIsPasscodePopupVisible(false);

    const isUsed = data?.jobAttributes.some((attr) => attr.usedWeight > 0);

    if (isUsed) {
      toast.error("Job Number is already used.");
      return;
    }
    setEditMode(true);
  };

  // Render action buttons based on status and edit mode
  const renderActionButtons = () => {
    if (editMode) {
      return (
        <button
          type="button"
          className="submit-button"
          onClick={handleSaveClick}
        >
          Save
        </button>
      );
    }

    if (data) {
      const isPacked = data.status === "Packed";
      return (
        <>
          {!isPacked && (
            <button
              type="button"
              className="edit-button"
              onClick={() => setIsPasscodePopupVisible(true)}
            >
              Edit
            </button>
          )}
          {!isPacked && (
            <button
              type="button"
              className="delete-button"
              onClick={handleDeleteClick}
            >
              Delete
            </button>
          )}
        </>
      );
    }

    return null;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="job-order-container">
          <h2 className="job-details-heading">
            {data ? "Job Number Details" : "Add New Job Number"}
          </h2>
          <form className="job-details-form">
            <div className="form-row">
              <div className="form-group">
                <label>
                  Job No. <span className="required-asterisk">*</span>
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.jobNumber}
                  onChange={(e) =>
                    handleFormChange("jobNumber", e.target.value.toUpperCase())
                  }
                  disabled={!editMode || data}
                />
              </div>
              <div className="form-group">
                <label>
                  Drawing No. <span className="required-asterisk">*</span>
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.drawingNumber}
                  onChange={(e) =>
                    handleFormChange(
                      "drawingNumber",
                      e.target.value.toUpperCase()
                    )
                  }
                  disabled={!editMode}
                />
              </div>
              <div className="form-group">
                <label>
                  Sets <span className="required-asterisk">*</span>
                </label>
                <input
                  type="number"
                  className="input-field"
                  value={formData.sets}
                  onWheel={(e) => e.target.blur()}
                  onChange={(e) => handleFormChange("sets", e.target.value)}
                  disabled={!editMode}
                  onKeyDown={(e) => {
                    if (e.key === '-' || e.key === '+' ||e.key === 'e') {
                    e.preventDefault();
                    }
                  }}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>
                  Work Order <span className="required-asterisk">*</span>
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.workOrder}
                  onChange={(e) =>
                    handleFormChange("workOrder", e.target.value.toUpperCase())
                  }
                  disabled={!editMode}
                />
              </div>
              <div className="form-group">
                <label>
                  PO No. <span className="required-asterisk">*</span>
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.PONumber}
                  onChange={(e) => handleFormChange("PONumber", e.target.value.toUpperCase())}
                  disabled={!editMode}
                />
              </div>
              <div className="form-group">
                <label>Customer Job No.</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.customerJobNumber}
                  onChange={(e) =>
                    handleFormChange(
                      "customerJobNumber",
                      e.target.value.toUpperCase()
                    )
                  }
                  disabled={!editMode}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>
                  Drawing Weight (kg){" "}
                  <span className="required-asterisk">*</span>
                </label>
                <input
                  type="number"
                  className="input-field"
                  value={formData.drawingWeight}
                  onChange={(e) =>
                    handleFormChange("drawingWeight", e.target.value)
                  }
                  disabled={!editMode}
                  onKeyDown={(e) => {
                    if (e.key === '-' || e.key === '+' ||e.key === 'e') {
                    e.preventDefault();
                    }
                  }}
                />
              </div>
              <div className="form-group">
                <label>
                  Customer Name <span className="required-asterisk">*</span>
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.customerName}
                  onChange={(e) =>
                    handleFormChange("customerName", e.target.value)
                  }
                  disabled={!editMode}
                />
              </div>
            </div>
            <div className="table-job-order">
              <table className="common-table">
                <thead>
                  <tr>
                    <th>
                      Width (mm)<span className="required-asterisk">*</span>
                    </th>
                    <th>
                      Thickness (mm)<span className="required-asterisk">*</span>
                    </th>
                    <th>
                      Trimming Weight (kg)
                      <span className="required-asterisk">*</span>
                    </th>
                    <th>
                      Process Weight (kg)
                      <span className="required-asterisk">*</span>
                    </th>
                    {!editMode && <th>Consumed Weight (kg)</th>}
                    {!editMode && <th>Status</th>}
                    {editMode && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="number"
                          className="input-field"
                          value={row.width}
                          disabled={!editMode}
                          onChange={(e) =>
                            handleInputChange(index, "width", e.target.value)
                          }
                          onWheel={(e) => e.target.blur()}
                          onKeyDown={(e) => {
                            if (e.key === '-' || e.key === '+' ||e.key === 'e') {
                            e.preventDefault();
                            }
                          }}
                        />
                      </td>
                      <td>
                        <select
                          className="input-field"
                          value={row.thickness}
                          disabled={!editMode}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "thickness",
                              e.target.value
                            )
                          }
                        >
                          {thicknessOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          type="number"
                          className="input-field"
                          value={row.trimmingWeight}
                          disabled={!editMode}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "trimmingWeight",
                              e.target.value
                            )
                          }
                          onWheel={(e) => e.target.blur()}
                          onKeyDown={(e) => {
                            if (e.key === '-' || e.key === '+' ||e.key === 'e') {
                            e.preventDefault();
                            }
                          }}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="input-field"
                          value={row.processWeight}
                          disabled={true}
                          readOnly
                        />
                      </td>
                      {!editMode && <td>{row.usedWeight || "N/A"}</td>}
                      {!editMode && <td>{row.status || "N/A"}</td>}
                      {editMode && (
                        <td>
                          {index !== 0 && (
                            <i
                              className="fa fa-trash"
                              onClick={() => handleDeleteRow(index)}
                            ></i>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="form-actions">
              <button
                type="button"
                className="close-button"
                onClick={handleCancelClick}
              >
                Close
              </button>
              {editMode && (
                <button
                  type="button"
                  className="add-row-button"
                  onClick={handleAddRow}
                >
                  Add Row
                </button>
              )}
              {renderActionButtons()}
            </div>
          </form>
        </div>
      </div>

      {isPasscodePopupVisible && (
        <ConfirmationPopup
          title="Edit job order"
          message="Please enter the passcode to edit job order."
          onConfirm={handlePasscodeConfirm}
          onCancel={() => setIsPasscodePopupVisible(false)}
          isVisible={isPasscodePopupVisible}
          confirmPasscode={confirmPasscode}
        />
      )}

      {isDeleteConfirmationVisible && (
        <ConfirmationPopup
          title="Delete Job Order"
          message="Are you sure you want to delete this job order?"
          onConfirm={confirmDelete}
          onCancel={() => setIsDeleteConfirmationVisible(false)}
          isVisible={isDeleteConfirmationVisible}
          confirmPasscode={confirmDeletePasscode}
        />
      )}

      <ToastContainer />
    </div>
  );
};

export default JobOrderBirthing;
