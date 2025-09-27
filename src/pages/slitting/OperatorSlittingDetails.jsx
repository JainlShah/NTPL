import React, { useState, useEffect, useRef } from "react";

import "../../styles/Slitting.css";
import StackMM from "../../util/StackMM.json";
import StatusDropDown from "./StatusDropDown";
import ConfirmationPopup from "../../components/generic/ConfirmationPopup";
import toast from "react-hot-toast";
import BalanceAvailableRollDisplay from "./BalanceAvailableRollDisplay";
import { width } from "@fortawesome/free-solid-svg-icons/fa0";
import useSlittingOperatorHook from "../../hooks/useSlittingOperatorHook";
const OperatorSlittingDetails = ({
  data,
  title,
  isViewOnly,
  onSubmit,
  onClose,
  onPartialCoilHold,
  onCoilHold,
  onStatusChange,
  onGenerateQR,
}) => {
  const inputRef = useRef(null);

  useEffect(() => {
    // Focus the input field when the component renders
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const [formData, setFormData] = useState({
    coil_rollNumber: "",
    weight: "",
    thickness: "",
    width: "",
    stack: "",
    date: "",
  });

  const [rows, setRows] = useState([]);
  const [balancedCoilWeight, setBalancedCoilWeight] = useState(0);
  const [isEditable, setIsEditable] = useState(isViewOnly ? false : true);
  const [isPartialCoilHold, setIsPartialCoilHold] = useState(false);
  const [isFinishClicked, setIsFinishClicked] = useState(false);
  const [isCoilHoldClicked, setIsCoilHoldClicked] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isBalancedAvailableRollDisplay, setIsBalancedAvailableRollDisplay] = useState(false);
  const [partialCoilHoldFormData, setPartialCoilHoldFormData] = useState({
    coilNumber: "",
    weight: "",
    stack: "",
    width: "",
  });

  const  { slittingOperator, setSlittingOperator } = useSlittingOperatorHook();
  useEffect(() => {
    if (data) {
      setFormData({
        coil_rollNumber: data.coil_rollNumber || "",
        weight: data.weight || "",
        thickness: data.thickness || "",
        width: data.width || "",
        programTrim: data.programTrim || "",
        stack: data.stack || "",
        trimWidth: data.trimWidth || "",
        trimScrap: data.trimScrap || "",
        date: data.createdAt
          ? data.createdAt.split("T")[0]
          : new Date().toISOString().split("T")[0], // Default to today’s date if null
      });

      setRows(
        data.rollsData?.map((row) => ({
          jobId: row.jobId || null,
          rollId: row.rollId || "",
          jobNumber: row.jobNumber || "N/A",
          drawingNumber: row.drawingNumber || "N/A",
          workOrder: row.workOrder || "N/A",
          width: row.width || "",
          length: row.length || "",
          weight: row.weight || "",
          rollStatus: row.rollStatus || "",
          actualWeight: row.actualWeight || null,
          rollTrim: row.rollTrim || "",
          splitId: row.splitId || null,
          stack: row.stack || "",
          isInitiatedFromShortlist: row.initiateFromShortlist || false,
        })) || []
      );
    } else {
      setFormData({
        coil_rollNumber: "",
        weight: "",
        thickness: "",
        width: "",
        programTrim: "",
        stack: "",
        trimWidth: "",
        trimScrap: "",
        date: new Date().toISOString().split("T")[0], // Set today's date by default
      });
      setRows([
        {
          jobId: null,
          rollId: "",
          jobNumber: "",
          drawingNumber: "",
          workOrder: "",
          stack: "",
          width: "",
          length: "",
          weight: "",
          rollStatus: "",
          actualWeight: "" || null,
          rollTrim: "",
          splitId: null, // Unique identifier for split groups
          isInitiatedFromShortlist: false,
        },
      ]);
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      const groupedRolls = {};
      let groupCounter = 1;

      const updatedRows =
        data.rollsData?.map((row) => {
          const { splitId } = row;

          if (splitId) {
            if (!groupedRolls[splitId]) {
              groupedRolls[splitId] = groupCounter++;
            }
          }

          return {
            ...row,
            splitGroup: splitId ? groupedRolls[splitId] : null,
          };
        }) || [];

      setFormData({
        coil_rollNumber: data.coil_rollNumber || "",
        weight: data.weight || "",
        thickness: data.thickness || "",
        width: data.width || "",
        programTrim: data.programTrim || "",
        stack: data.stack || "",
        trimWidth: data.trimWidth || "",
        trimScrap: data.trimScrap || "",

        date: new Date().toISOString().split("T")[0], // Set today's date by default
      });

      setRows(updatedRows);
    }
    setBalancedCoilWeight(0);
  }, [data]);

  const handleStackChange = (value) => {
    if (isNaN(value) || /[+\-*/.]/.test(value)) {
      toast.error("Please enter a valid number for stack.");
      return;
    }
    if (Number(value) > 250) {
      toast.error("Stack should not be greater than 250.");
      return;
    }
    const stackMM = StackMM[value];
    const programTrim = formData.programTrim;

    const updatedRows = rows.map((row) => {
      if (row.splitId) {
        const rollTrimPercentage = row.rollTrim / programTrim;
        console.log("rollTrimPercentage", rollTrimPercentage);
        return {
          ...row,
          actualWeight:
            Math.round(rollTrimPercentage * stackMM * row.width * 10) / 10,
        };
      } else {
        return {
          ...row,
          actualWeight: Math.round(stackMM * row.width * 10) / 10,
        };
      }
    });

    setRows(updatedRows);
    const updatedTrimScrap = (formData.trimWidth * stackMM).toFixed(2) ;
    console.log("updatedTrimScrap", updatedTrimScrap);
    setFormData((prevFormData) => ({
      ...prevFormData,
      stack: value,
      trimScrap: updatedTrimScrap
    }));
  };
  const handlePartialCoilHoldChange = () => {
    setIsPartialCoilHold(true);
  };
  const handleFinishClick = () => {
    if (
      !formData.coil_rollNumber ||
      !formData.stack ||
      rows.some((row) => !row.rollId || !row.actualWeight)
    ) {
      toast.error("Please ensure all fields are filled out correctly.");
      return;
    }
    const totalWeight = rows.reduce((acc, row) => acc + row.actualWeight, 0) + Number(formData.trimScrap);


    if (totalWeight > Number(formData.weight) * 1.03) {
      toast.error("Total weight of rolls can not be greater than the coil weight.");
      return;
    } else {
      console.log("totalWeight", totalWeight, data.programWeight);
      const totalProgramWeight = rows.reduce((acc, row) => acc + row.weight, 0);
      if(totalWeight > totalProgramWeight*1.03){
        toast.error("Total weight of rolls can not be greater than the program weight.");
        setShowPopup(true);
        return;
      }

      // if (Number(formData.stack) === 250) {

      //   const isWeightAvailable = rows.every((row) => {
      //     return row.weight >= row.actualWeight * 1.03;
      //   });

      //   if (isWeightAvailable) {
      //     console.log("isWeightAvailable", isWeightAvailable);
      //     setIsBalancedAvailableRollDisplay(true);
      //   } else {
      //     setIsFinishClicked(true);
      //     calculateBalancedCoil();
      //   }

      // } else {
      //   setIsFinishClicked(true);
      //   calculateBalancedCoil();
      // }

      setIsFinishClicked(true);
      calculateBalancedCoil();
    }
  };
  const handlePartialCoilHold = () => {
    const updatedFormData = {
      ...partialCoilHoldFormData,
      coil_rollNumber: formData.coil_rollNumber,
    };
    setPartialCoilHoldFormData(updatedFormData); // Update state for consistency
    onPartialCoilHold(updatedFormData); // Send updated form data
  };

  const handleCoilHold = () => {
    setIsCoilHoldClicked(true);
    // onCoilHold(formData.coilNumber);
  };
  const handleCoilHoldConfirm = () => {
    const coilHold = {
      coilNumber: formData.coil_rollNumber,
      statusType: "hold",
      description: "",
      updatedBy: "slitting operator",
      slittingProgramId: formData.slittingProgramId,
    };
    onCoilHold(coilHold);
    setIsCoilHoldClicked(false);
  };
  const handleGenerateQR = () => {
    if (
      !formData.coil_rollNumber ||
      !formData.stack ||
      rows.some((row) => !row.rollId || !row.actualWeight)
    ) {
      toast.error("Please ensure all fields are filled out correctly.");
      return;
    }

    const finishFormData = {
      slittingProgramId: data.slittingProgramId,
      coil_rollNumber: formData.coil_rollNumber,
      updatedBy: "Slitting Operator",
      slittingProgramStatus: "finish",
      stack: Number(formData.stack),
      trimWidth: formData.trimWidth,
      width: formData.width,
      thickness: formData.thickness,
      weight: formData.weight,
      trimScrap: formData.trimScrap,
      programTrim: formData.programTrim,
      date: formData.date,
      rollsData: rows.map((row) => ({
        ...row,
        actualWeight: Math.round(row.actualWeight * 10) / 10,
      })),
    };

    if (Number(formData.stack) === 250) {

      const isWeightAvailable = rows.every((row) => {
        return row.weight >= row.actualWeight * 1.03;
      });

      if (isWeightAvailable) {
        console.log("isWeightAvailable", isWeightAvailable);
        setIsBalancedAvailableRollDisplay(true);
        setIsFinishClicked(false);
      } else {
        setIsFinishClicked(false);
        setBalancedCoilWeight(0);
        // setIsFinishClicked(true);
        calculateBalancedCoil();
        onGenerateQR(finishFormData);
        setSlittingOperator(false);

      }

    } else {
      setIsFinishClicked(false);
      setBalancedCoilWeight(0);
      onGenerateQR(finishFormData);
      setSlittingOperator(false);

    }

    // setIsFinishClicked(false);
    // setBalancedCoilWeight(0);
  };

  const handleStatusChange = (formData) => {
    setRows(
      rows.map((row) =>
        row.rollId === formData.rollId
          ? { ...row, rollStatus: formData.rollStatus }
          : row
      )
    );
    onStatusChange(formData);
  };
  const calculateBalancedCoil = () => {
    // const maxProgramTrim = ((Number(data.weight) - Number(data.trimScrap))/(Number(data.width) - Number(data.trimWidth)))*10;

    const programTrim = formData.programTrim;

    const totalWeightConsumed =
      Math.round(StackMM[Number(formData.stack)] * data.width * 10) / 10;

    const balancedCoilWeight = (
      Number(data.weight) - totalWeightConsumed
    ).toFixed(2);
    console.log("balancedCoilWeight", balancedCoilWeight);
    setBalancedCoilWeight(balancedCoilWeight);
  };

  const predefinedColors = [
    "rgba(252, 208, 217, 0.5)", // Red
    "rgba(178, 223, 253, 0.5)", // Blue
    "rgba(255, 236, 188, 0.5)", // Yellow
    "rgba(184, 255, 255, 0.5)", // Green
    "rgba(204, 180, 250, 0.5)", // Purple
    "rgba(255, 229, 203, 0.5)", // Orange
  ];

  const splitGroupColorMap = {};

  const getGroupColor = (splitGroup) => {
    if (!splitGroup) return "transparent"; // No color for non-grouped rows

    if (!splitGroupColorMap[splitGroup]) {
      const colorIndex =
        Object.keys(splitGroupColorMap).length % predefinedColors.length;
      splitGroupColorMap[splitGroup] = predefinedColors[colorIndex];
    }

    return splitGroupColorMap[splitGroup];
  };
  const handlePasscodeConfirmation = () => {
    calculateBalancedCoil();
    setIsFinishClicked(true);
  };
  const handleBalanceAvailableRollContinue = () => {
    setIsBalancedAvailableRollDisplay(false);
    const finishFormData = {
      slittingProgramId: data.slittingProgramId,
      coil_rollNumber: formData.coil_rollNumber,
      updatedBy: "Slitting Operator",
      slittingProgramStatus: "finish",
      stack: Number(formData.stack),
      trimWidth: formData.trimWidth,
      width: formData.width,
      thickness: formData.thickness,
      weight: formData.weight,
      trimScrap: formData.trimScrap,
      programTrim: formData.programTrim,
      rollsData: rows.map((row) => ({
        ...row,
        actualWeight: Math.round(row.actualWeight * 10) / 10,
      })),
    };
    setSlittingOperator(true);

    onGenerateQR(finishFormData);
  };
  const handleBalanceAvailableRollClose = () => {
    setIsBalancedAvailableRollDisplay(false);
    const finishFormData = {
      slittingProgramId: data.slittingProgramId,
      coil_rollNumber: formData.coil_rollNumber,
      updatedBy: "Slitting Operator",
      slittingProgramStatus: "finish",
      stack: Number(formData.stack),
      trimWidth: formData.trimWidth,
      width: formData.width,
      thickness: formData.thickness,
      weight: formData.weight,
      trimScrap: formData.trimScrap,
      programTrim: formData.programTrim,
      rollsData: rows.map((row) => ({
        ...row,
        actualWeight: Math.round(row.actualWeight * 10) / 10,
      })),
    };
    
    setSlittingOperator(false);
    onGenerateQR(finishFormData);
  }

  return (
    <>
      <div className="slitting-form">
        <div className="slitting-form-container">
          <h2>{title}</h2>

          <div className="form-row">
            <div className="form-group">
              <label>Coll/Roll No.</label>
              <input
                type="text"
                name="coilNumber"
                value={formData.coil_rollNumber}
                disabled={!isEditable}
              />
            </div>
            <div className="form-group">
              <label>Coil weight (kg)</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                disabled={!isEditable}
              />
            </div>
            <div className="form-group">
              <label>Coil thickness (mm)</label>
              <input
                type="number"
                name="thickness"
                value={formData.thickness}
                disabled={!isEditable}
              />
            </div>
            <div className="form-group">
              <label>Coil width (mm)</label>
              <input
                type="number"
                name="width"
                value={formData.width}
                disabled={!isEditable}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>
                Program Trim (kg)<span className="required-asterisk">*</span>
              </label>
              <input
                type="number"
                name="programTrim"
                value={formData.programTrim}
                disabled={true}
              />
            </div>
            <div className="form-group">
              <label>
                Stack (mm)<span className="required-asterisk">*</span>
              </label>
              <input
                type="number"
                name="stack"
                value={formData.stack}
                onChange={(e) => handleStackChange(e.target.value)}
                ref={inputRef}
                onWheel={(e) => e.target.blur()}
                onKeyDown={(e) => {
                  if (e.key === '-' || e.key === '+' ||e.key === 'e') {
                  e.preventDefault();
                  }
                }}
              />
            </div>
            <div className="form-group">
              <label>
                Date <span className="required-asterisk">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date || new Date().toISOString().split("T")[0]} // Default to today’s date
                onChange={(e) =>
                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    date:
                      e.target.value || new Date().toISOString().split("T")[0], // Ensure it's always set
                  }))
                }
              />
            </div>
          </div>

          <div className="slitting-form-data-table-wrapper">
            <table className="common-table">
              <thead>
                <tr>
                  <th>Job No.</th>
                  <th>Drawing No.</th>
                  <th>Work Order</th>
                  <th>Width (mm)</th>
                  <th>Planned weight (kg)</th>
                  <th>
                    Actual weight (kg)
                    <span className="required-asterisk">*</span>
                  </th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr
                    key={index}
                    className={
                      row.splitGroup ? `split-group-${row.splitGroup}` : ""
                    }
                    style={{ backgroundColor: getGroupColor(row.splitGroup) }}
                  >
                    <td>
                      <input
                        type="text"
                        value={row.jobNumber || "N/A"}
                        disabled={!isEditable}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.drawingNumber || "N/A"}
                        disabled={!isEditable}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.workOrder || "N/A"}
                        disabled={!isEditable}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={row.width}
                        disabled={!isEditable}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={row.weight}
                        disabled={!isEditable}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={row.actualWeight || ""}
                        onFocus={(e) => {
                          if (!row.actualWeight)
                            toast.error(
                              "Automatically gets calculated, please enter stack"
                            );
                          e.target.blur();
                        }}
                      />
                    </td>
                    <td>
                      <StatusDropDown
                        row={row}
                        index={index}
                        onStatusChange={(formData) =>
                          handleStatusChange(formData)
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="action-container">
            <button className="close-button" onClick={onClose}>
              Close
            </button>
            {formData.coil_rollNumber &&
              !formData.coil_rollNumber.includes("_") && (
                <>
                  <button className="hold-button" onClick={handleCoilHold}>
                    Coil Hold
                  </button>
                  {/* <button className="hold-button" onClick={handlePartialCoilHoldChange}>Partial Coil Hold</button> */}
                </>
              )}

            <button className="submit-button" onClick={handleFinishClick}>
              {" "}
              Finish
            </button>
          </div>
          {isPartialCoilHold && (
            <div className="common-popup">
              <div className="common-popup-body">
                <h3>Partial Coil Hold</h3>
                <table className="common-table">
                  <thead>
                    <tr>
                      <th>Coil width (mm)</th>
                      <th>Stack (mm)</th>
                      <th>Weight (kg)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <input
                          type="number"
                          value={partialCoilHoldFormData.width}
                          onChange={(e) =>
                            setPartialCoilHoldFormData({
                              ...partialCoilHoldFormData,
                              width: e.target.value,
                            })
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={partialCoilHoldFormData.stack}
                          onChange={(e) =>
                            setPartialCoilHoldFormData({
                              ...partialCoilHoldFormData,
                              stack: e.target.value,
                            })
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={partialCoilHoldFormData.weight}
                          onChange={(e) =>
                            setPartialCoilHoldFormData({
                              ...partialCoilHoldFormData,
                              weight: e.target.value,
                            })
                          }
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="action-container">
                  <button
                    className="close-button"
                    onClick={() => setIsPartialCoilHold(false)}
                  >
                    Close
                  </button>
                  <button
                    className="submit-button"
                    onClick={handlePartialCoilHold}
                  >
                    {" "}
                    Finish
                  </button>
                </div>
              </div>
            </div>
          )}

          {isFinishClicked && (
            <div className="common-popup">
              <div className="common-popup-body">
                <table className="common-table">
                  <thead>
                    <tr>
                      <th>Coil width (mm)</th>
                      <th>Weight (kg)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, index) => (
                      <tr key={index}>
                        <td>
                          {row.width}{" "}
                          {row.jobNumber?.split("-")[0] === "Extra"
                            ? " - Extra"
                            : ""}{" "}
                        </td>
                        <td>{row.actualWeight}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="info-detail">
                  {balancedCoilWeight > 0 && (
                    <>
                      <p>
                        <strong>
                          Balanced Coil Weight (kg): {balancedCoilWeight}
                        </strong>
                      </p>
                    </>
                  )}
                </div>
                <div className="action-container">
                  <button
                    className="close-button"
                    onClick={() => setIsFinishClicked(false)}
                  >
                    Close
                  </button>
                  <button className="submit-button" onClick={handleGenerateQR}>
                    {" "}
                    Generate QR
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>



        {isCoilHoldClicked && (
          <ConfirmationPopup
            title="Coil Hold"
            message="Are you sure you want to hold this coil?"
            onConfirm={handleCoilHoldConfirm}
            onCancel={() => setIsCoilHoldClicked(false)}
          />
        )}

        {showPopup && (
          <ConfirmationPopup
            title="Total roll weight exceeds program total weight"
            message="Please enter the passcode to proceed."
            isVisible={showPopup}
            confirmPasscode={123456}
            onConfirm={() => {
              setShowPopup(false);
              handlePasscodeConfirmation();
            }}
            onCancel={() => {
              setShowPopup(false);
            }}
          />
        )}

        {isBalancedAvailableRollDisplay && (

          <BalanceAvailableRollDisplay data={rows} onContinue={handleBalanceAvailableRollContinue} onClose={handleBalanceAvailableRollClose} />
        )}
      </div>
    </>
  );
};

export default OperatorSlittingDetails;
