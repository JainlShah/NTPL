import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";

const ConfirmationPopup = ({
  title,
  message,
  onConfirm,
  onCancel,
  isVisible,
  // confirmPasscode,
}) => {
  const [passcode, setPasscode] = useState(new Array(6).fill(""));
  const [activeInputIndex, setActiveInputIndex] = useState(null);
  const passcodeRefs = useRef([]);
  const confirmPasscode = "123456";

  // Focus the first input field when the popup is visible
  useEffect(() => {
    if (isVisible) {
      setPasscode(new Array(6).fill("")); // Clear previous passcode
      setTimeout(() => {
        passcodeRefs.current[0]?.focus();
      }, 0);
    }
  }, [isVisible]);

  // Handle passcode input changes
  const handlePasscodeChange = (value, index) => {
    if (value.length > 1) return; // Prevent multi-character input

    const newPasscode = [...passcode];
    newPasscode[index] = value;
    setPasscode(newPasscode);

    // Move focus to the next input
    if (value && index < passcode.length - 1) {
      passcodeRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace or delete in the inputs
  const handlePasscodeKeyDown = (e, index) => {
    if (e.key === "Backspace" || e.key === "Delete") {
      const newPasscode = [...passcode];
      newPasscode[index] = "";

      if (index > 0) {
        passcodeRefs.current[index - 1]?.focus();
      }
      setPasscode(newPasscode);
    }
  };

  // Validate the entered passcode using the passed function
  const validatePasscode = () => {
    return passcode.join("") === confirmPasscode;
  };

  // Handle confirm button click
  const handleConfirm = () => {
    if (passcode.some((char) => char === "")) {
      toast.error("Please enter the complete passcode.");
      return;
    }

    if (validatePasscode()) {
      onConfirm();
    } else {
      toast.error("Invalid passcode. Please try again.");
      setPasscode(new Array(6).fill(""));
      passcodeRefs.current[0]?.focus();
    }
  };

  return (
    // <div className="">
    <div className="delete-popup">
      <h2>{title}</h2>
      <p>{message}</p>
      <div className="passcode-container">
        {isVisible && (
          <div className="passcode-container">
            {passcode.map((char, index) => (
              <input
                key={index}
                type="password"
                value={char}
                maxLength="1"
                ref={(el) => (passcodeRefs.current[index] = el)}
                onChange={(e) => handlePasscodeChange(e.target.value, index)}
                onKeyDown={(e) => handlePasscodeKeyDown(e, index)}
                onFocus={() => setActiveInputIndex(index)}
                onBlur={() => setActiveInputIndex(null)}
                className={`passcode-input ${
                  activeInputIndex === index ? "active" : ""
                }`}
              />
            ))}
          </div>
        )}
      </div>
      <div className="action-container">
        <button className="close-button" onClick={onCancel}>
          Cancel
        </button>
        {isVisible ? (
          <button className="submit-button" onClick={handleConfirm}>
            Confirm
          </button>
        ) : (
          <button className="submit-button" onClick={onConfirm}>
            Confirm
          </button>
        )}
      </div>
    </div>
    // </div>
  );
};

export default ConfirmationPopup;
