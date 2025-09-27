import React, { useState, useRef, useEffect } from "react";
import "../../styles/Slitting.css";
import toast from "react-hot-toast";

const StatusDropDown = ({ row, index, onStatusChange }) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isHoldPopupOpen, setIsHoldPopupOpen] = useState(false);
    const [popupPosition, setPopupPosition] = useState("down"); // 'down' or 'up'
    const [holdPopupPosition, setHoldPopupPosition] = useState("down"); // 'down' or 'up'
    const [selectedStatus, setSelectedStatus] = useState(row.rollStatus.charAt(0).toUpperCase() + row.rollStatus.slice(1)); // Track selected status
    const [holdReasons, setHoldReasons] = useState([]); // Track selected hold reasons
    const [otherRemark, setOtherRemark] = useState(""); // Track 'Other Remark' input
    const popupRef = useRef(null);
    const holdPopupRef = useRef(null);

    const handlePopupToggle = () => {

        setIsPopupOpen(!isPopupOpen);
        setIsHoldPopupOpen(false); // Ensure Hold popup closes when main dropdown opens

    };

    const handleStatusSelect = (status) => {
        // setSelectedStatus(status);
        setIsPopupOpen(false);

        if (status === "hold" || status === "Hold") {
            setIsHoldPopupOpen(true); // Open Hold popup when "Hold" is selected
        } else {
            setIsHoldPopupOpen(false);
            console.log("Status change:", status);
            onStatusChange({
                "rollId": row.rollId,
                "rollStatus": `${status.toLowerCase()}`,
                "subStatus": {},
                "updatedBy": "Slitting Operator"
            }); // Clear hold data for other statuses
            setSelectedStatus(status);
        }
    };

    const handleHoldReasonChange = (reason) => {
        setHoldReasons((prevReasons) =>
            prevReasons.includes(reason)
                ? prevReasons.filter((r) => r !== reason) // Remove reason
                : [...prevReasons, reason] // Add reason
        );
    };

    const handleOtherRemarkChange = (event) => {
        setOtherRemark(event.target.value);
    };

    const handleHoldSubmit = () => {
        console.log("Hold reasons:", holdReasons);
        onStatusChange({
            "rollId": row.rollId,
            "rollStatus": "hold",
            "subStatus": {
                "statusType": holdReasons
            },
            "updatedBy": "Slitting Operator"
        });
        setSelectedStatus("Hold");
        setIsHoldPopupOpen(false); // Close the hold popup
    };

    const adjustPopupPosition = () => {
        if (popupRef.current) {
            const popupRect = popupRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            if (popupRect.bottom > windowHeight) {
                setPopupPosition("up");
            } else {
                setPopupPosition("down");
            }
        }
    };

    const adjustHoldPopupPosition = () => {
        if (holdPopupRef.current) {
            const holdPopupRect = holdPopupRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            if (holdPopupRect.bottom > windowHeight) {
                setHoldPopupPosition("up");
            } else {
                setHoldPopupPosition("down");
            }
        }
    };

    const handleClickOutside = (event) => {
        const isClickInsidePopup = popupRef.current && popupRef.current.contains(event.target);
        const isClickInsideHoldPopup = holdPopupRef.current && holdPopupRef.current.contains(event.target);
        const isClickOnButton = event.target.closest(".dropdown-button");

        if (!isClickInsidePopup && !isClickInsideHoldPopup && !isClickOnButton) {
            setIsPopupOpen(false);
            setIsHoldPopupOpen(false);
        }
    };

    useEffect(() => {
        if (isPopupOpen) {
            adjustPopupPosition();
        }
    }, [isPopupOpen]);

    useEffect(() => {
        if (isHoldPopupOpen) {
            adjustHoldPopupPosition();
        }
    }, [isHoldPopupOpen]);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="dropdown-wrapper">
            <button className="dropdown-button" onClick={handlePopupToggle}>
                {selectedStatus}
            </button>
            {isPopupOpen && (
                <div
                    className={`popup ${popupPosition === "up" ? "popup-up" : "popup-down"}`}
                    ref={popupRef}
                >
                    {row.rollStatus === "ready" || row.rollStatus === "Ready" ? (
                        <>
                            <button
                                className="dropdown-button"
                                onClick={() => handleStatusSelect("Hold")}
                            >
                                Hold
                            </button>

                        </>
                    ) :
                        row.rollStatus === "extra" || row.rollStatus === "Extra" ? (
                            <>
                                <button
                                    className="dropdown-button"
                                    onClick={() => handleStatusSelect("Hold")}
                                >
                                    Hold
                                </button>

                            </>
                        ) : row.jobNumber.includes("Extra") ? (
                            <>
                                <button
                                    className="dropdown-button"
                                    onClick={() => handleStatusSelect("Extra")}
                                >
                                    Extra
                                </button>

                            </>
                        ) : (
                            <>
                                <button
                                    className="dropdown-button"
                                    onClick={() => handleStatusSelect("Ready")}
                                >
                                    Ready
                                </button>

                            </>
                        )
                    }
                </div>
            )}

            {/* Hold Popup */}
            {isHoldPopupOpen && (
                <div
                    className={`hold-popup ${holdPopupPosition === "up" ? "popup-up" : "popup-down"
                        }`}
                    ref={holdPopupRef}
                >
                    <div className="checkbox-container">
                        <label>
                            <input
                                type="checkbox"
                                checked={holdReasons.includes("Bulging")}
                                onChange={() => handleHoldReasonChange("Bulging")}
                            />
                            Bulging
                        </label>
                    </div>
                    <div>
                        <label>
                            <input
                                type="checkbox"
                                checked={holdReasons.includes("Waviness")}
                                onChange={() => handleHoldReasonChange("Waviness")}
                            />
                            Waviness
                        </label>
                    </div>
                    <div>
                        <label>
                            <input
                                type="checkbox"
                                checked={holdReasons.includes("Dents")}
                                onChange={() => handleHoldReasonChange("Dents")}
                            />
                            Dents
                        </label>
                    </div>
                    <div>
                        <label>
                            <input
                                type="checkbox"
                                checked={holdReasons.includes("Rust")}
                                onChange={() => handleHoldReasonChange("Rust")}
                            />
                            Rust
                        </label>
                    </div>
                    <div>
                        <label>
                            <input
                                type="checkbox"
                                checked={holdReasons.includes("Watermark")}
                                onChange={() => handleHoldReasonChange("Watermark")}
                            />
                            Watermark
                        </label>
                    </div>
                    <div>
                        <label>
                            <input
                                type="checkbox"
                                checked={holdReasons.includes("Defective")}
                                onChange={() => handleHoldReasonChange("Defective")}
                            />
                            Defective
                        </label>
                    </div>
                    <div >
                        <label>
                            Other Remark:
                        </label>
                        <input
                            type="text"
                            value={otherRemark}
                            onChange={handleOtherRemarkChange}
                            placeholder="Enter remark"
                        />
                    </div>
                    <button onClick={handleHoldSubmit}>Submit</button>
                </div>
            )}
        </div>
    );
};

export default StatusDropDown;
