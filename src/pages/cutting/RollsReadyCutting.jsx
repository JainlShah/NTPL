import log from "../../components/logger";
import { useState, useEffect } from "react";
import { useRollsReadyCutting } from "../../hooks/useRollReadyCutting";
import "../../styles/rollsReadyCutting.css";
import GenericTable from "../../components/genericTable";
import { ClipLoader } from "react-spinners";
import CommonError from "../../components/error/CommonError";
import GenericForm from "../../components/generic/GenericForm";
import QRScreenRolls from "../../components/QrCodeScreens/QrScreenRolls";
import ConfirmationPopup from "../../components/generic/ConfirmationPopup";
import QRModelRolls from "../../model/QRModelRolls";
import toast from "react-hot-toast";
import StackMM from "../../util/StackMM.json";
import { useRowLock } from "../../hooks/useRowLock";

const RollsReadyCutting = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currPage, setCurrPage] = useState(1);
  const [filters, setFilters] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [productionLine, setProductionLine] = useState("");
  const [showStartPopup, setShowStartPopup] = useState(false);
  const [isQRVisible, setIsQRVisible] = useState(false);
  const [qrDetails, setQRDetails] = useState(null);
  const [actualWeight, setActualWeight] = useState(0);
  const [scrapWeight, setScrapWeight] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // Add date state

  const [balancedRoll, setBalancedRoll] = useState({
    stack: null,
    weight: null,
  });
  const [lockedRowId, setLockedRowId] = useState(null);
  console.log("LockedRowId: ", lockedRowId);

  const { lockedRows, lockRow, unlockRow } = useRowLock();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsQRVisible(false);
        console.log("LockedRowId: ", lockedRowId);
        unlockRow(lockedRowId, "editing");
        setQRDetails(null);
        setSelectedRow(null);
        setShowStartPopup(false);
      }
    };
    const handlePopState = () => {
      unlockRow(lockedRowId, "editing");
      console.log("Back");
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [lockedRowId]);

  const onBalancedRoll = (data) => {
    console.log("Balanced Roll data:", data);

    // const formattedDate = data.updatedAt
    //   ? new Date(data.updatedAt).toISOString().split("T")[0]
    //   : "N/A";
    const formattedDate = data.updatedAt
      ? (() => {
          const date = new Date(data.updatedAt);
          const day = String(date.getDate()).padStart(2, "0");
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const year = date.getFullYear();
          return `${day}-${month}-${year}`; // Format: dd-MM-yyyy
        })()
      : "N/A";

    const balancedRoll = new QRModelRolls(
      data.coilNumber,
      data.rollNumber,
      data.qrCodeNumber,
      data.jobNumber,
      data.width,
      data.weight,
      data.grade,
      data.materialType?.toUpperCase(),
      formattedDate
    );
    setQRDetails(balancedRoll);
    setIsQRVisible(true);
  };

  const handlePageChange = (page) => setCurrPage(page);

  const {
    loading,
    error,
    data,
    pagination,
    handleExport,
    updateRollsReadyCutting,
    availableFilters,
  } = useRollsReadyCutting(searchQuery, currPage, filters, onBalancedRoll);

  useEffect(() => {
    log.info("Rolls Ready for Cutting", data);
  }, [data]);

  const handleFilter = (filters) => {
    log.info("Filters applied:", filters);
    setFilters(filters);
  };

  const handleSearch = (query) => setSearchQuery(query);

  const handleRowClick = (row) => {
    console.log("Row clicked:", row);
    lockRow(row.rollId, "editing");
    setLockedRowId(row.rollId);
    setSelectedRow(row);
    setProductionLine(null);
    // setProductionLine(row.productionLine);
    setActualWeight(null); // Reset actual weight when selecting a new row
    setScrapWeight(null); // Reset scrap weight when selecting a new row
  };

  const handleCloseForm = (rollId) => {
    unlockRow(rollId, "editing");
    setSelectedRow(null);
  };

  const handleStartProduction = (formData) => {
    const productionLineValue = formData.get("productionLine");
    setProductionLine(productionLineValue);
    console.log(formData);
    console.log(
      "Start Production clicked:",
      Object.fromEntries(formData.entries())
    );
    setShowStartPopup(true);
    setScrapDetails({
      startRoll: "",
      triangle: "",
      punch: "",
      endRoll: "",
      extra: "",
    });
    console.log("Production Line:", productionLineValue);
  };

  // Update actual weight and calculate scrap weight automatically
  const handleActualWeightChange = (e) => {
    const value = parseFloat(e.target.value) || "";

    // Validation to ensure actual weight does not exceed the selectedRow weight
    if (selectedRow && value > selectedRow.parentWeight) {
      toast.error(
        `Actual weight cannot be greater than Slitted roll  weight (${selectedRow.parentWeight} kg).`
      );
      setActualWeight(parseFloat(actualWeight)); // Reset the actual weight if invalid
      // setScrapWeight(null); // Reset the scrap weight
    } else {
      setActualWeight(parseFloat(value));
      if (selectedRow) {
        // const balancedRollWeight = parseFloat(
        //   (selectedRow.weight - value).toFixed(3)
        // ); // Calculate scrap weight as the difference
        // if (balancedRollWeight > 0) {
        //   setBalancedRoll({
        //     ...balancedRoll,
        //     weight: balancedRollWeight,
        //   });
        // } else {
        //   setBalancedRoll({
        //     stack: "",
        //     weight: "",
        //   });
        // }
      }
    }
  };
  const [scrapDetails, setScrapDetails] = useState({
    startRoll: "",
    triangle: "",
    punch: "",
    endRoll: "",
    extra: "",
  });
  const calculateTotalScrapWeight = (details) => {
    const values = Object.values(details).map((val) => parseFloat(val) || 0);
    return values.reduce((sum, val) => sum + val, 0);
  };

  const handleScrapDetailChange = (field, value) => {
    if (value < 0) {
      toast.error("Negative value not allowed");
      return;
    }
    const newValue = value === "" ? "" : parseFloat(value) || 0;
    const updatedDetails = {
      ...scrapDetails,
      [field]: newValue,
    };

    setScrapDetails(updatedDetails);
    // Calculate and update total scrap weight
    const totalScrap = calculateTotalScrapWeight(updatedDetails).toFixed(1);
    setScrapWeight(totalScrap);

    // Update balanced roll weight based on new scrap weight
    // if (selectedRow && actualWeight !== null) {
    //   const balancedRollWeight = parseFloat(
    //     (selectedRow.weight - actualWeight - totalScrap).toFixed(2)
    //   );
    //   setBalancedRoll((prev) => ({
    //     ...prev,
    //     weight: balancedRollWeight,
    //     stack: 0,
    //   }));
    // }
  };

  const handleBalancedRollChange = (e, fieldName) => {
    const value = parseFloat(e.target.value) || "";
    if (value < 0) {
      toast.error("Negative value not allowed");
      return;
    }
    if (fieldName === "weight") {
      setBalancedRoll((prev) => ({
        stack: prev.stack,
        weight: value,
      }));
    }
    if (fieldName === "stack") {
      if (value > 250) {
        toast.error("Balanced Roll stack should be less than 250.");
        return;
      }
      const weighT = (StackMM[value] * Number(selectedRow.width)).toFixed(1);
      if (weighT > selectedRow.weight) {
        toast.error("Balanced Roll weight should be less than Actual Weight:");
        return;
      }
      setBalancedRoll((prev) => ({
        ...prev,
        stack: value,
        weight: weighT,
      }));

      // const scrap = (Number(selectedRow.weight) - (Number(actualWeight) + Number(weighT))).toFixed(1);
      // setScrapWeight(scrap);
      // setScrapDetails({
      //   startRoll: "",
      //   triangle: "",
      //   punch: "",
      //   endRoll: "",
      //   extra: "",
      // })

      console.log("weighT", weighT);
      console.log("balancedRoll", balancedRoll);
    }
  };
  const handleSubmit = (formData) => {
    const data = Object.fromEntries(formData.entries());
    console.log("Second Form submitted:", data);
    if (
      data.scrapType ||
      data.startRoll ||
      data.triangle ||
      data.punch ||
      data.endRoll ||
      data.extra
    )
      if (
        data.scrapType === "" ||
        data.scrapType === null ||
        data.scrapType === undefined
      )
        // Validate each field in formData
        for (const [key, value] of Object.entries(data)) {
          if (parseFloat(value) < 0) {
            toast.error(`${key} should be greater than 0.`);
            return;
          }
        }
    if (balancedRoll.weight < 0) {
      toast.error("Balanced Roll weight should be greater than 0.");
      return;
    }
    if (balancedRoll.stack < 0) {
      toast.error("Balanced Roll stack should be greater than 0.");
      return;
    }
    if (balancedRoll.weight > 0) {
      if (
        balancedRoll.stack === 0 ||
        balancedRoll.stack === null ||
        balancedRoll.stack === undefined
      ) {
        toast.error(
          "Balanced Roll stack should have some value, as balanced roll weight is greater than 0."
        );
        return;
      }
    }
    if (
      balancedRoll.weight &&
      balancedRoll.weight !== undefined &&
      balancedRoll.weight !== null
    ) {
      if (
        balancedRoll.stack === 0 ||
        balancedRoll.stack === null ||
        balancedRoll.stack === undefined
      ) {
        toast.error(
          "Balanced Roll stack should have some value, as balanced roll weight is greater than 0."
        );
        return;
      }
    }

    const total =
      Number(data.actualWeight) +
      Number(scrapWeight) +
      Number(balancedRoll.weight);
    console.log("totalsumweight", total);
    if (total > Number(selectedRow.parentWeight) * 1.03) {
      toast.error(
        `Total of actual weight, scrap and balanced roll (${total}) should not be greater than roll weight ${selectedRow.parentWeight}`
      );
      return;
    }

    const updatedData = {
      //...data,
      actualWeight: Number(data.actualWeight),
      scrapData: {
        scrapType: {
          startRoll: Number(data.startRoll),
          triangle: Number(data.triangle),
          punch: Number(data.punch),
          endRoll: Number(data.endRoll),
          extra: Number(data.extra),
        },
      },
      date: data.date || new Date().toISOString().split("T")[0], // Use form date or default to today
      scrapWeight: Number(scrapWeight),
      productionLine: productionLine,
      workOrder: selectedRow.workOrder,
      drawingNumber: selectedRow.drawingNumber,
      rollNumber: selectedRow.rollNumber,
      rollId: selectedRow.rollId,
      rollStatus: selectedRow.rollStatus,
      jobId: selectedRow.jobId,
      materialType: "crgo",
      balancedRoll: {
        weight: Number(balancedRoll.weight),
        stack: Number(balancedRoll.stack),
        rollStatus: "balanced",
        width: selectedRow.width,
      },
      updatedBy: "Cutting Supervisor",
    };
    console.log("updatedData", updatedData);
    unlockRow(formData.rollId, "editing");

    // Update rolls ready for cutting and show QR code
    updateRollsReadyCutting(updatedData); // Call the update function
    setSelectedRow(data); // Set the data for QR code display
    unlockRow(formData.rollId, "editing");
    setShowStartPopup(false);
    handleCloseForm();
    setBalancedRoll({
      stack: "",
      weight: "",
    });
  };

  const columns = [
    { label: "Roll No.", accessor: "rollNumber" },
    { label: "Job No.", accessor: "jobNumber" },
    { label: "Work Order", accessor: "workOrder" },
    { label: "Drawing No.", accessor: "drawingNumber" },
    { label: "Width (mm)", accessor: "width" },
    { label: "Weight (kg)", accessor: "weight" },
    { label: "Thickness (mm)", accessor: "thickness" },
  ];
  const filterableColumns = [
    "rollNumber",
    "jobNumber",
    "workOrder",
    "drawingNumber",
    "width",
    "weight",
    "thickness",
  ];

  return (
    <div className="rollsReadyCutting">
      <h1>Rolls Ready for Cutting</h1>

      {error && <CommonError error={error} />}

      {!error && (
        <GenericTable
          loading={loading}
          onSearchChange={handleSearch}
          enableSearch={true}
          enableFilter={true}
          columns={columns}
          data={data}
          onRowClick={handleRowClick}
          filter={availableFilters}
          onFilter={handleFilter}
          pagination={pagination}
          onSearch={handleSearch}
          onPageChange={handlePageChange}
          filterableColumns={filterableColumns}
          lockedRows={lockedRows}
        />
      )}

      {data?.length > 0 && (
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

      {selectedRow && (
        <GenericForm
          fields={[
            {
              label: "Roll No.",
              name: "rollNumber",
              type: "text",
              placeholder: "Roll No.",
              value: selectedRow.rollNumber || "",
              disabled: true,
            },
            {
              label: "Job No.",
              name: "jobNumber",
              type: "text",
              placeholder: "Job No.",
              value: selectedRow.jobNumber || "",
              disabled: true,
            },
            {
              label: "Work Order",
              name: "workOrder",
              type: "text",
              placeholder: "Work Order",
              value: selectedRow.workOrder || "",
              disabled: true,
            },
            {
              label: "Drawing No.",
              name: "drawingNumber",
              type: "text",
              placeholder: "Drawing No.",
              value: selectedRow.drawingNumber || "",
              disabled: true,
            },
            {
              label: "Width (mm)",
              name: "width",
              type: "number",
              placeholder: "Width (mm)",
              value: selectedRow.width || "",
              disabled: true,
            },
            {
              label: "Weight (kg)",
              name: "weight",
              type: "text",
              placeholder: "Weight (kg)",
              value: selectedRow.weight || "",
              disabled: true,
            },
            {
              label: "Thickness (mm)",
              name: "thickness",
              type: "number",
              placeholder: "Thickness (mm)",
              value: selectedRow.thickness || "",
              disabled: true,
            },
            {
              label: (
                <div>
                  Production Line<span className="required-asterisk">*</span>
                </div>
              ),
              name: "productionLine",
              type: "text",
              placeholder: "Add Production Line",
              value: productionLine,
              onChange: (e) => {},
              disabled: false,
            },
          ]}
          title="Add Production Line"
          onSubmit={(formData) => handleStartProduction(formData)}
          onClose={() => handleCloseForm(selectedRow.rollId)}
          customButtons={(formData, onClose) => (
            <>
              <button className="close-button" onClick={onClose}>
                Close
              </button>
              <button>Hold</button>
            </>
          )}
          isConfirmationPopupOpen={false}
          submitButtonTitle="Start Production"
        />
      )}

      {isQRVisible && (
        <div className="qr-overlay">
          <div className="qr-modal">
            <QRScreenRolls
              value={qrDetails}
              onClose={() => setIsQRVisible(false)}
            />
          </div>
        </div>
      )}

      {showStartPopup && (
        <div className="popup-overlay">
          <div className="popup-container">
            <h3 className="popup-header">Start Production</h3>
            <form
              className="add-scrap-form"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                handleSubmit(formData);
              }}
            >
              <div className="popup-body">
                <label className="label">Actual Weight (kg)</label>
                <input
                  id="actualWeight"
                  name="actualWeight"
                  type="number"
                  value={actualWeight}
                  onChange={handleActualWeightChange}
                  onWheel={(e) => e.target.blur()}
                  onKeyDown={(e) => {
                    if (e.key === "-" || e.key === "+" || e.key === "e") {
                      e.preventDefault();
                    }
                  }}
                  placeholder="Enter actual weight"
                  required
                />
                <div
                  style={{ display: "flex", gap: "1px", alignItems: "center" }}
                >
                  <div>
                    <label>Start Roll (kg) </label>
                    <input
                      id="startRoll"
                      name="startRoll"
                      type="number"
                      value={scrapDetails.startRoll}
                      onChange={(e) =>
                        handleScrapDetailChange("startRoll", e.target.value)
                      }
                      style={{ width: "80%" }}
                      placeholder="Start Roll"
                      onKeyDown={(e) => {
                        if (e.key === "-" || e.key === "+" || e.key === "e") {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>
                  <div>
                    <label>Triangle (Kg)</label>
                    <input
                      id="triangle"
                      name="triangle"
                      type="number"
                      value={scrapDetails.triangle}
                      onChange={(e) =>
                        handleScrapDetailChange("triangle", e.target.value)
                      }
                      style={{ width: "80%" }}
                      placeholder="Triangle"
                      onKeyDown={(e) => {
                        if (e.key === "-" || e.key === "+" || e.key === "e") {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>
                  <div>
                    <label>Punch (kg) </label>
                    <input
                      id="punch"
                      name="punch"
                      type="number"
                      value={scrapDetails.punch}
                      onChange={(e) =>
                        handleScrapDetailChange("punch", e.target.value)
                      }
                      placeholder="Punch"
                      onKeyDown={(e) => {
                        if (e.key === "-" || e.key === "+" || e.key === "e") {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>
                </div>

                <div
                  style={{ display: "flex", gap: "15px", alignItems: "center" }}
                >
                  <div style={{ flex: 1 }}>
                    <label>End Roll (kg) </label>
                    <input
                      id="endRoll"
                      name="endRoll"
                      type="number"
                      value={scrapDetails.endRoll}
                      onChange={(e) =>
                        handleScrapDetailChange("endRoll", e.target.value)
                      }
                      style={{ width: "90%" }}
                      placeholder="End Roll"
                      onKeyDown={(e) => {
                        if (e.key === "-" || e.key === "+" || e.key === "e") {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label>Extra (kg) </label>
                    <input
                      id="extra"
                      name="extra"
                      type="number"
                      value={scrapDetails.extra}
                      onChange={(e) =>
                        handleScrapDetailChange("extra", e.target.value)
                      }
                      style={{ width: "90%" }}
                      placeholder="Extra"
                      onKeyDown={(e) => {
                        if (e.key === "-" || e.key === "+" || e.key === "e") {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>
                </div>
                <div
                  style={{ display: "flex", gap: "15px", alignItems: "center" }}
                >
                  <div style={{ flex: 1 }}>
                    <label>Total Scrap Weight (kg)</label>
                    <input
                      id="scrapWeight"
                      name="scrapWeight"
                      type="number"
                      value={scrapWeight || ""}
                      readOnly
                      placeholder="Total scrap weight will be calculated automatically"
                      style={{ width: "90%" }}
                      disabled={actualWeight === 0}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label>Date </label>
                    <input
                      id="date"
                      name="date"
                      type="date"
                      style={{ width: "90%" }}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                </div>

                {/* Balanced Roll Section */}
                <div>
                  <h4>Balanced Roll</h4>
                  <table className="common-table">
                    <thead>
                      <tr>
                        <th>Stack (mm)</th>
                        <th>Weight (kg)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <input
                            type="number"
                            name="balancedRollStack"
                            placeholder="Enter stack"
                            value={balancedRoll.stack}
                            onChange={(e) =>
                              handleBalancedRollChange(e, "stack")
                            }
                            onWheel={(e) => e.target.blur()}
                            onKeyDown={(e) => {
                              if (e.key === "-" || e.key === "+") {
                                e.preventDefault();
                              }
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            name="balancedRollWeight"
                            placeholder="Enter weight"
                            value={balancedRoll.weight}
                            disabled={true}
                            style={{ cursor: "not-allowed" }}
                            // onChange={(e) => handleBalancedRollChange(e, "weight")}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Buttons */}
              <div className="action-container">
                <button
                  className="close-button"
                  onClick={() => {
                    unlockRow(selectedRow.rollId, "editing");
                    setShowStartPopup(false);
                    setIsQRVisible(false);
                    setQRDetails(null);
                    setSelectedRow(null);
                    setDate(new Date().toISOString().split("T")[0]);
                    balancedRoll.stack = "";
                    balancedRoll.weight = "";
                    setScrapDetails({
                      startRoll: "",
                      triangle: "",
                      punch: "",
                      endRoll: "",
                      extra: "",
                    });
                  }}
                >
                  Close
                </button>
                <button className="submit-button">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RollsReadyCutting;
