import React, { useState, useCallback, useEffect } from "react";
import "./GenericForm.css";
import { toast } from "react-hot-toast";
import ConfirmationPopup from "./ConfirmationPopup";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";

const GenericForm = ({
  fields,
  onSubmit,
  onClose,
  title = "Form",
  data = null,
  customButtons = null,
  viewOnly = false,
  showToast,
  isConfirmationPopupOpen = true,
  submitButtonTitle = "Submit",
  isMoveCoil = false,
  onAddToSlitting,
}) => {
  useEffect(() => {
    console.log("Data", data);
  }, [data]);

  // Initialize form data with default values
  const initializeFormData = () =>
    fields.reduce((acc, { name, value = "", type, options }) => {
      const defaultValue =
        type === "date" && !value
          ? new Date().toISOString().split("T")[0]
          : type === "select" && options?.length > 0 && !value
            ? name === "thickness" || name === "materialType"
              ? ""
              : fields[0].options[0].value
            : value;
      return { ...acc, [name]: defaultValue };
    }, {});

  // Initialize file data with existing files from the `data` prop
  const initializeFileData = () => {
    const initialFileData = fields.reduce((acc, { name }) => ({ ...acc, [name]: [] }), {});

    // If there is existing data and it contains the 'document' field, populate the fileData
    if (data && data.document) {
      initialFileData.document = data.document.map((file) => ({
        name: file.fileName,
        type: file.fileType,
        // Add any other properties you need from the file object
      }));
    }

    return initialFileData;
  };

  // Initialize form errors
  const initializeErrors = () =>
    fields.reduce((acc, { name }) => ({ ...acc, [name]: "" }), {});

  const [formData, setFormData] = useState(initializeFormData());
  const [fileData, setFileData] = useState(initializeFileData());
  const [formErrors, setFormErrors] = useState(initializeErrors());
  const [isSubmitClicked, setSubmitClicked] = useState(false);

  // Validate a single field
  const validateField = (field, value) => {
    const { required } = field;
    if (required && (!value || (Array.isArray(value) && value.length === 0))) {
      return `${field.label || field.name} is required.`;
    }
    return "";
  };

  // Handle field changes
  const handleFieldChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      const field = fields.find((f) => f.name === name);

      if (field.name === "coilNumber" || field.name === "productionLine") {
        const validInput = value.match(/^[0-9a-zA-Z/()-]*$/); // Allow empty input
        if (!validInput) {
          toast.error(
            "Invalid input. Only alphanumeric characters, '/', and '()' are allowed."
          );
          return;
        }
      }

      // If the field is numeric and the value is less than 0, set it to 0
      let updatedValue =
        field.type === "number" && Number(value) < 0 ? "0" : value;

      // If the field is of type string, convert it to uppercase
      if (field.type === "text") {
        updatedValue = updatedValue.toUpperCase();
      }

      // If the field is numeric and has a decimal point, allow only one digit after the decimal
      if (field.type === "number" && value.includes(".")) {
        const [integerPart, decimalPart] = value.split(".");
        if (decimalPart.length > 1) {
          updatedValue = `${integerPart}.${decimalPart.slice(0, 2)}`;
        }
      }

      if (field.name === "width" && Number(updatedValue) > 9999) {
        toast.error("Width cannot be greater than 9999");
        return;
      }

      const error = validateField(field, updatedValue);

      setFormData((prev) => ({ ...prev, [name]: updatedValue }));
      setFormErrors((prev) => ({ ...prev, [name]: error }));
    },
    [fields]
  );

  // Handle file changes
  const handleFileChange = useCallback(
    (e) => {
      const { name, files } = e.target;
      const field = fields.find((f) => f.name === name);

      // Check file size for each file
      const validFiles = Array.from(files).filter((file) => {
        if (file.size > 2 * 1024 * 1024) { // 2 MB limit
          toast.error(`File "${file.name}" exceeds the 2 MB size limit.`);
          return false; // Exclude this file
        }
        return true; // Include this file
      });

      if (validFiles.length === 0) {
        return; // No valid files to add
      }

      const error = validateField(field, validFiles);

      setFileData((prev) => {
        // Get the current files for the specific field (name)
        const currentFiles = prev[name] || [];

        // Create a Set of file names to avoid duplicates
        const currentFileNames = new Set(currentFiles.map((file) => file.name));

        // Filter out files that have already been added
        const newFiles = validFiles.filter(
          (file) => !currentFileNames.has(file.name)
        );

        return {
          ...prev,
          [name]: [...currentFiles, ...newFiles], // Append non-duplicate files
        };
      });

      setFormErrors((prev) => ({ ...prev, [name]: error }));
    },
    [fields]
  );

  // Handle file deletion
  const handleFileDelete = (fieldName, index) => {
    setFileData((prev) => ({
      ...prev,
      [fieldName]: prev[fieldName].filter((_, i) => i !== index),
    }));

    // Clear the input field value
    const fileInput = document.querySelector(`input[name="${fieldName}"]`);
    if (fileInput) {
      fileInput.value = "";
    }
  };

  // Handle form submission
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      const missingFields = [];
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "document" || key === "MTC1_5T" || key === "epstienTest")
          return;
        if (!value) missingFields.push(key);
      });

      if (missingFields.length > 0) {
        toast.error(`Missing fields: ${missingFields.join(", ")}`, "error");
        return;
      }

      // If everything is valid, show the confirmation popup
      if (isConfirmationPopupOpen) {
        setSubmitClicked(true);
      } else handleConfirmSubmit();
    },
    [formData, fileData, fields, showToast]
  );

  // Handle confirmed submission
  const handleConfirmSubmit = (e) => {
    setSubmitClicked(false); // Close the popup
    const formDataToSubmit = new FormData();
    Object.entries(formData).forEach(([key, value]) =>
      formDataToSubmit.append(key, value)
    );
    Object.entries(fileData).forEach(([key, files]) => {
      if (files) files.forEach((file) => formDataToSubmit.append(key, file));
    });

    onSubmit(formDataToSubmit); // Submit the form
  };

  // Check if any field has errors or is empty
  const isFormValid = Object.values(formErrors).every((error) => !error);
  const isAnyFieldEmpty = fields.some((field) => {
    const value = formData[field.name] || fileData[field.name];
    return (
      field.required && (!value || (Array.isArray(value) && value.length === 0))
    );
  });

  // Handle moving coil to slitting
  const handleMoveCoil = () => {
    onAddToSlitting();
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="heading-container">
          <div className="popup-header" style={{ textAlign: "center" }}>
            {title}
          </div>
          {isMoveCoil &&
            viewOnly &&
            (data?.statusType === "ready" ||
              data?.statusType === "partialUtilize") && (data?.weight - data?.usedWeight > 0) &&
               (
              <Button
                variant="contained"
                endIcon={<SendIcon />}
                onClick={handleMoveCoil}
              >
                Add to Slitting
              </Button>
            )}
        </div>
        <hr />
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="popup-body">
            {fields.map(
              ({
                name,
                label,
                type,
                placeholder,
                disabled,
                required,
                options,
              }) => (
                <div key={name} className="form-field">
                  <label>
                    {label || name} {required && "*"}
                    {type === "file" ? (
                      viewOnly ? (
                        <></>
                      ) : (
                        <div className="file-input-container">
                        <input
                          type="file"
                          accept=".png,.jpg,.pdf"
                          name={name}
                          onWheel={(e) => e.target.blur()}
                          onChange={
                            disabled
                              ? null
                              : async (e) => await handleFileChange(e)
                          }
                          multiple
                          disabled={disabled}
                          style={{
                            backgroundColor: !disabled ? "#f0f0f0" : "white",
                            cursor: disabled ? "not-allowed" : "pointer",
                          }}
                        />
                        {/* Helper text for file size limit */}
                        <p className="file-size-limit-message">
                          Maximum file size: 2 MB
                        </p>
                        {fileData[name]?.length > 0 && (
                          <span className="file-summary">
                            {fileData[name].length} file
                            {fileData[name].length > 1 ? "s" : ""} selected
                          </span>
                        )}
                      </div>
                      )
                    ) : type === "select" ? (
                      <select
                        name={name}
                        value={formData[name] || ""}
                        onChange={
                          disabled
                            ? null
                            : async (e) => await handleFieldChange(e)
                        }
                        disabled={disabled}
                        style={{
                          backgroundColor: !disabled ? "#f0f0f0" : "white",
                          cursor: disabled ? "not-allowed" : "pointer",
                        }}
                      >
                        <option value="" disabled>
                          {placeholder || "Select an option"}
                        </option>
                        {options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={type}
                        name={name}
                        placeholder={placeholder || ""}
                        value={formData[name] || ""}
                        onWheel={(e) => e.target.blur()}
                        onChange={
                          disabled
                            ? null
                            : async (e) => await handleFieldChange(e)
                        }
                        disabled={
                          disabled ||
                          (data?.coilNumber && name === "coilNumber")
                        }
                        readOnly={disabled && name === "coilNumber"}
                        style={{
                          backgroundColor: !disabled ? "#f0f0f0" : "white",
                          cursor: disabled ? "not-allowed" : "text",
                        }}
                      />
                    )}
                  </label>
                  {fileData[name]?.length > 0 ? (
                    <ul className="file-list">
                      {fileData[name].map((file, index) => (
                        <li key={index} className="file-item">
                          {file.name}
                          {!disabled ? (
                            <i
                              className="fa fa-trash"
                              style={{
                                color: "red",
                                cursor: "pointer",
                                marginLeft: "10px",
                              }}
                              onClick={async () =>
                                await handleFileDelete(name, index)
                              }
                            />
                          ) : (
                            <i
                              className="fa fa-download"
                              style={{
                                color: "red",
                                cursor: "pointer",
                                marginLeft: "10px",
                              }}
                            />
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <></>
                    // <p className="no-file-message">No file uploaded</p>
                  )}
                  {formErrors[name] && (
                    <p className="error-message">{formErrors[name]}</p>
                  )}
                </div>
              )
            )}
          </div>
          <div className="action-container">
            {customButtons && customButtons(formData, onClose)}
            {!viewOnly && (
              <button
                onClick={handleSubmit}
                className="submit-button"
                disabled={isAnyFieldEmpty || !isFormValid}
              >
                {submitButtonTitle}
              </button>
            )}
          </div>
        </form>
      </div>
      {isSubmitClicked && isConfirmationPopupOpen && (
        <ConfirmationPopup
          title={title}
          message="Are you sure you want to submit?"
          onConfirm={handleConfirmSubmit}
          onCancel={() => setSubmitClicked(false)}
        />
      )}
    </div>
  );
};

export default GenericForm;