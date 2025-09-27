import React, { useState, useEffect } from "react";
import "../../../styles/actionMenu.css";
import { useNavigate } from "react-router-dom";
import { useRollInventory } from "../../../hooks/useRollInventory";
import { toast } from "react-hot-toast";
import CoilInventoryServices from "../../../services/CoilInventoryServices";
import { RollInventoryService } from "../../../services/rollInventoryServices";

const ActionMenu = ({
  isModelVisible,
  row,
  onClose,
  rollService,
  onUpdate,
  moveToCutting,
  onUnassign,
}) => {
  const [activeMenuItem, setActiveMenuItem] = useState(null);
  const [activeSubMenuItem, setActiveSubMenuItem] = useState(null);
  const [isMenuModalVisible, setMenuModalVisible] = useState(isModelVisible);
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const [selectedReason, setSelectedReason] = useState("");
  const [openMenu, setOpenMenu] = useState(null);
  const [openSubSubMenus, setOpenSubSubMenu] = useState(null);
  const [showApplyButton, setShowApplyButton] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [cuttingModalVisible, setCuttingModalVisible] = useState(false);
  const [jobNumber, setJobNumber] = useState("");
  const [jobNumbers, setJobNumbers] = useState([]);
  const [Rolls, setRolls] = useState(null);
  // const { updateRollsStatus } = useRollInventory();
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const menuData = [
    ...(row?.rollStatus?.toLowerCase() !== "hold" &&
    row?.rollStatus?.toLowerCase() !== "ready" &&
    row?.rollStatus?.toLowerCase() !== "transfer" &&
    row?.rollStatus?.toLowerCase() !== "reject"
      ? [
          {
            name: "Assign",
            subMenu: [
              { name: "Slitting" },
              { name: "Cutting" },
              { name: "Transfer" },
            ],
          },
        ]
      : row?.rollStatus?.toLowerCase() === "transfer"
      ? [{ name: "Untransfer" }]
      : []),
    ...(row?.rollStatus?.toLowerCase() === "reject"
      ? [{ name: "Ready" }]
      : row?.rollStatus?.toLowerCase() === "hold"
      ? [{ name: "Ready" }]
      : [{ name: "Hold" }]),

    ...(row?.rollStatus?.toLowerCase() !== "extra"
      ? [{ name: "Unassign" }]
      : []),

    ...(row?.rollStatus?.toLowerCase() === "reject"
      ? [
          { name: "Move To Scrap" }, // No subMenu here
        ]
      : []),
    ...(row?.rollStatus?.toLowerCase() !== "reject"
      ? [
          {
            name: "Reject",
            subMenu: [
              {
                name: "Aesthetic",
                subMenu: [
                  { name: "Black or White Marks" },
                  { name: "Shiny Dots" },
                  { name: "White Lines" },
                  { name: "Black Lines" },
                  { name: "Color Variations" },
                ],
              },
              {
                name: "Geometric",
                subMenu: [{ name: "Wave" }, { name: "Camber" }],
              },
              {
                name: "Magnetic",
                subMenu: [{ name: "Loss" }, { name: "Insulation" }],
              },
              { name: "Watermark" },
              { name: "Rust" },
              {
                name: "Other",
                subMenu: [
                  { name: "Groove" },
                  { name: "Hole" },
                  { name: "Cracks" },
                ],
              },
            ],
          },
        ]
      : []),
  ];

  const resetMenuState = () => {
    setActiveMenuItem(null);
    setActiveSubMenuItem(null);
    setActiveSubMenu(null);
    setOpenMenu(null);
    setOpenSubSubMenu(null);
  };

  const closeMenuModal = () => {
    setMenuModalVisible(false);
    resetMenuState();
    setSelectedReason("");
    setShowApplyButton(false);
    onClose();
  };

  const openSubMenu = (item) => {
    console.log(`Menu item clicked: ${item.name}`);
    if (
      item.name === "Hold" ||
      item.name === "Ready" ||
      item.name === "UnReject" ||
      item.name === "Move To Scrap" ||
      item.name === "Untransfer" ||
      item.name === "Unassign"
    ) {
      resetMenuState();
      handleHoldAction(item.name);
    } else {
      if (openMenu !== item.name) {
        setOpenSubSubMenu(null);
        setActiveSubMenuItem(null);
      }
      setOpenMenu(item.name === openMenu ? null : item.name);
      setActiveSubMenu(item.name === openMenu ? null : item);
    }
  };

  const handleReasonSelection = async (reason, item) => {
    console.log(`Submenu item clicked: ${reason}`);
    if (reason === "Slitting") {
      navigate("/slitting?rollNumber=" + row?.rollNumber);
      setSelectedReason(reason);
      setSelectedItem(item);
      setConfirmModalVisible(true);
    } else if (reason === "Cutting") {
      await fetchAvailableJobNumbers(row.thickness, row.width, row.weight);
      setCuttingModalVisible(true);
      setMenuModalVisible(false);
    } else {
      setSelectedReason(reason);
      setSelectedItem(item);
      setShowApplyButton(true);
      handleApply();
    }
    resetMenuState();
  };

  // const openSubMenu = (item) => {
  //   if (item.name === "Hold" || item.name === "ready") {
  //     resetMenuState();
  //     handleHoldAction(item.name);
  //   } else {
  //     if (openMenu !== item.name) {
  //       setOpenSubSubMenu(null);
  //       setActiveSubMenuItem(null);
  //     }
  //     setOpenMenu(item.name === openMenu ? null : item.name);
  //     setActiveSubMenu(item.name === openMenu ? null : item);
  //   }
  // };

  const handleHoldAction = (action) => {
    setSelectedReason(action);
    setConfirmModalVisible(true);
  };

  const openSubSubMenu = (submenu) => {
    setOpenSubSubMenu(submenu.name === openSubSubMenus ? null : submenu.name);
  };

  // const handleReasonSelection = async (reason, item) => {
  //   if (reason === "Slitting") {
  //     navigate("/slitting?rollNumber=" + row?.rollNumber);
  //     setSelectedReason(reason);
  //     setSelectedItem(item);
  //     setConfirmModalVisible(true);
  //   } else if (reason === "Cutting") {
  //     await fetchAvailableJobNumbers(row.thickness, row.width, row.weight);
  //     setCuttingModalVisible(true);
  //     setMenuModalVisible(false);
  //   } else {
  //     setSelectedReason(reason);
  //     setSelectedItem(item);
  //     setShowApplyButton(true);
  //     handleApply();
  //   }
  //   resetMenuState();
  // };

  const handleApply = () => {
    setConfirmModalVisible(true);
  };

  const fetchAvailableJobNumbers = async (thickness, width, weight) => {
    try {
      const response =
        await CoilInventoryServices.fetchJobNumbersByThicknessAndWidth(
          thickness,
          width,
          weight
        );
      console.log("API Response:", response);

      // Check if the response is valid and contains the expected data
      if (response?.responseStatusList?.statusList?.[0]?.statusCode === 200) {
        const data = response.responseObject?.data;

        // Ensure data is an array
        if (Array.isArray(data)) {
          // // Filter and map job numbers
          // const filteredJobNumbers = data
          //   .filter((item) => item.jobNumber) // Ensure only valid jobNumbers
          //   .map((item) => item.jobNumber);  // Extract jobNumber field

          // console.log("Filtered Job Numbers:", filteredJobNumbers);
          setJobNumbers(data); // Update state with extracted job numbers
        } else {
          console.error("Data is not an array:", data);
          setJobNumbers([]); // Reset jobNumbers if data is not an array
        }
      } else {
        console.error(
          "API Error:",
          response?.responseStatusList?.statusList?.[0]?.statusDesc
        );
        toast.error(
          response?.responseStatusList?.statusList?.[0]?.statusDesc ||
            "Unknown error"
        );
        setJobNumbers([]); // Reset jobNumbers in case of an error
      }
    } catch (error) {
      console.error("Failed to fetch job numbers:", error);
      toast.error("Failed to fetch job numbers");
      setJobNumbers([]); // Reset on failure
    }
  };

  const handleConfirmApply = async () => {
    setConfirmModalVisible(false);
    let status = Rolls.name.toLowerCase();

    if (selectedReason === "Transfer") {
      status = "transfer";
    }
    if (Rolls.name === "Move To Scrap") {
      status = "scrap";
    }
    if (Rolls.name === "Unassign") {
      console.log("Unassigning roll:", row?.rollId);
      const formData = {
        rollId: row?.rollId,
        rollStatus: "extra", // Always set to extra when unassigning
        updatedBy: "Roll Inventory",
      };
      await onUnassign(formData); // Call the specific unassign API
      closeMenuModal();
      return;
    }
    if (
      Rolls.name === "Ready" ||
      Rolls.name === "ready" ||
      Rolls.name === "Untransfer"
    ) {
      if (
        row.jobNumber === "" ||
        row.jobNumber === null ||
        row.jobNumber === "Extra"
      ) {
        status = "extra";
      } else {
        status = "ready";
      }
    }

    const rollInventoryData = {
      rollId: row?.rollId,
      rollStatus: status || "",
      subStatus: {
        statusType: [selectedItem?.name.toLowerCase()],
        subStatusType: selectedReason.toLowerCase() || "",
      },
      updatedBy: "Roll Inventory",
    };
    console.log(rollInventoryData);
    onUpdate(rollInventoryData);
    closeMenuModal();
  };

  const handleCancelApply = () => {
    setConfirmModalVisible(false);
  };

  const handleCuttingSubmit = () => {
    const data = {
      rollId: row?.rollId,
      jobNumber: jobNumber,
      jobId: jobNumbers.find((job) => job.jobNumber === jobNumber)?.jobId,
      rollNumber: row?.rollNumber,
    };
    moveToCutting(data);
    setCuttingModalVisible(false);
    setMenuModalVisible(false);
  };

  const handleCloseCutting = () => {
    setCuttingModalVisible(false);
    setJobNumber("");
    setMenuModalVisible(true);
    resetMenuState();
  };

  const Modal = ({ isVisible, onClose, children, showDefaultClose = true }) => {
    if (!isVisible) return null;

    return (
      <div className="action-modal-overlay">
        <div className="action-modal">
          {children}
          {showDefaultClose && (
            <div className="action-button-container">
              <button className="close-button" onClick={onClose}>
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const getConfirmationMessage = () => {
    if (selectedReason === "Slitting") {
      return `Are you sure you want to proceed with Slitting for roll ${row?.rollNumber}?`;
    }
    if (selectedReason === "Unassign") {
      return `Are you sure you want to unassign ${row?.rollNumber} roll and mark it as extra?`;
    }
    if (selectedReason === "Cutting") {
      return `Are you sure you want to proceed with Cutting for roll ${row?.rollNumber}?`;
    }
    if (selectedReason === "Hold" || selectedReason === "ready") {
      return `Are you sure you want to ${selectedReason} ${row?.rollNumber} roll?`;
    }
    if (selectedReason === "Transfer") {
      return `Are you sure you want to ${selectedReason} ${row?.rollNumber} roll?`;
    }
    if (selectedReason === "Untransfer") {
      return `Are you sure you want to ${selectedReason} ${row?.rollNumber} roll?`;
    }
    if (selectedReason === "UnReject") {
      return `Are you sure you want to ${selectedReason} ${row?.rollNumber} roll?`;
    }
    if (selectedReason === "Move To Scrap") {
      return `Are you sure you want to ${selectedReason} ${row?.rollNumber} roll?`;
    }
    if (selectedReason === "Ready") {
      return `Are you sure you want to ${selectedReason} ${row?.rollNumber} roll?`;
    }
    return `Are you sure you want to apply "${selectedReason}" for rejection?`;
  };

  const renderMenuItem = (item) => {
    const isActive = activeMenuItem === item.name;
    const isDisabled = confirmModalVisible || cuttingModalVisible;

    return (
      <div key={item.name} className={`menu-items ${isActive ? "active" : ""}`}>
        <button
          className={`menu-button ${isActive ? "active" : ""}`}
          onClick={() => {
            if (!isDisabled) {
              setActiveMenuItem(isActive ? null : item.name);
              openSubMenu(item);
              setRolls(item);
            }
          }}
          disabled={isDisabled}
        >
          {item.name}
        </button>
        {/* Ensure submenu is only rendered if item.subMenu exists */}
        {item.subMenu && openMenu === item.name && !isDisabled && (
          <div className="submenu-container">{renderSubMenu(item)}</div>
        )}
      </div>
    );
  };

  const renderSubMenu = (submenu, isRightAligned = false) => {
    if (!submenu?.subMenu) return null;

    return (
      <div className={`${isRightAligned ? "right-aligned" : ""}`}>
        {submenu.subMenu.map((subItem) => {
          const isSubMenuActive = activeSubMenuItem === subItem.name;
          const isDisabled = confirmModalVisible || cuttingModalVisible;

          return (
            <div
              key={subItem.name}
              className={`submenu-item ${isSubMenuActive ? "active" : ""}`}
            >
              <button
                className={`submenu-button ${isSubMenuActive ? "active" : ""}`}
                onClick={() => {
                  if (!isDisabled) {
                    if (isSubMenuActive) {
                      setActiveSubMenuItem(null);
                      setOpenSubSubMenu(null);
                    } else {
                      setActiveSubMenuItem(subItem.name);
                      if (subItem.subMenu) {
                        openSubSubMenu(subItem);
                      } else {
                        handleReasonSelection(subItem.name, submenu);
                      }
                    }
                  }
                }}
                disabled={isDisabled}
              >
                {subItem.subMenu && (
                  <span className={`arrow ${isSubMenuActive ? "active" : ""}`}>
                    ▶
                  </span>
                )}
                {subItem.name}
              </button>

              {subItem.subMenu &&
                openSubSubMenus === subItem.name &&
                !isDisabled && (
                  <div className="submenu-right">
                    {renderSubMenu(subItem, true)}
                  </div>
                )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="action-menu-wrapper">
      <div className="menu-container">
        {isMenuModalVisible && (
          <Modal isVisible={true} onClose={closeMenuModal}>
            <div className="menu-container">
              {menuData.map((item) => {
                if (row?.workOrder === "extra" && item.name === "Assign") {
                  return null;
                } else {
                  return renderMenuItem(item);
                }
              })}
            </div>
          </Modal>
        )}
      </div>
      {cuttingModalVisible && (
        <Modal
          isVisible={true}
          onClose={handleCloseCutting}
          showDefaultClose={false}
        >
          <div className="cutting-modal-content">
            <h3 className="modal-title">Select Job Number for Cutting</h3>
            <div className="select-container">
              <select
                value={jobNumber}
                onChange={(e) => setJobNumber(e.target.value)}
                className="jobno-select"
              >
                <option value="">Select a Job Number</option>
                {jobNumbers.map((job) => (
                  <option key={job.jobNumber} value={job.jobNumber}>
                    {job.jobNumber}
                  </option>
                ))}
              </select>
            </div>
            <div className="action-container">
              <button
                className="submit-button"
                onClick={handleCuttingSubmit}
                disabled={!jobNumber.trim()}
              >
                Submit
              </button>
              <button className="close-button" onClick={handleCloseCutting}>
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}

      {confirmModalVisible && (
        <Modal
          className="model"
          isVisible={true}
          onClose={handleCancelApply}
          showDefaultClose={false}
        >
          <div className="confirmation-modal">
            <h3>Confirmation</h3>
            <p>{getConfirmationMessage()}</p>
            <div className="action-container">
              <button className="close-button" onClick={handleCancelApply}>
                Close
              </button>
              <button className="submit-button" onClick={handleConfirmApply}>
                Apply
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ActionMenu;
