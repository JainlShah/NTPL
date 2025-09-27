import React, { useState, useEffect, useCallback } from "react";
import "../../styles/Slitting.css";
import { width } from "@fortawesome/free-solid-svg-icons/fa0";
import { toast } from "react-hot-toast";
import apiClient from "../../services/ApiService";
import { coilInventoryList, JobNumberList } from "../../util/mock";
import ConfirmationPopup from "../../components/generic/ConfirmationPopup.jsx";
import CoilInventoryServices from "../../services/CoilInventoryServices.jsx";
import { JobOrderService } from "../../services/jobOrderService.jsx";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

const SlittingForm = ({
  data,
  title,
  isViewOnly,
  onSubmit,
  onClose,
  onDelete,
  addedCoil = null,
  shorlistedJobInfo,
  rollNumber,
}) => {
  const [formData, setFormData] = useState({
    coil_rollNumber: "",
    weight: "",
    thickness: "",
    width: "",
  });

  const [rows, setRows] = useState([]);
  const [jobNumbers, setJobNumbers] = useState([]); // List of job numbers
  const [totalSetsForShortlistedJob, setTotalSetsForShortlistedJob] =
    useState(0);
  const [enabledFields, setEnabledFields] = useState({
    drawingNumber: false,
    workOrder: false,
  });
  const [isEditable, setIsEditable] = useState(isViewOnly ? false : true);
  const [selectedJobNumberWidth, setSelectedJobNumberWidth] = useState(null);
  const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] =
    useState(false);
  const [jobInfo, setJobInfo] = useState([]);
  const [hasFetchedCoilDetails, setHasFetchedCoilDetails] = useState(false);
  const [jobFetched, setJobFetched] = useState(false);
  const [isEditConfirmationPopup, setIsEditConfirmationPopup] = useState(false);
  const editPasscode = "123456";
  const [isDeleteConfirmationPopup, setIsDeleteConfirmationPopup] = useState(false);
  const deletePasscode = "123456";
  useEffect(() => {
    const totalProgramWeight = calculateTotalWeight();
    setFormData((prevFormData) => ({
      ...prevFormData,
      programWeight: totalProgramWeight,
    }));
    if (rollNumber !== null || rollNumber !== undefined) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        coil_rollNumber: rollNumber,
      }));
      fetchCoilDetails(rollNumber);
    }
    if (addedCoil && !hasFetchedCoilDetails) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        coil_rollNumber: addedCoil,
      }));

      fetchCoilDetails(addedCoil);
      setHasFetchedCoilDetails(true); // Prevent future calls
    }
    if (shorlistedJobInfo) {
      console.log(
        `Shortlisted job number: ${JSON.stringify(shorlistedJobInfo)}`
      );
    }
  }, [addedCoil, hasFetchedCoilDetails, shorlistedJobInfo]);

  useEffect(() => {
    if (data) {
      setFormData({
        coil_rollNumber: data.coil_rollNumber || "",
        weight: data.weight || "",
        thickness: data.thickness || "",
        width: data.width || "",
        trimWidth: data.trimWidth || "",
        trimScrap: data.trimScrap || "",
        programTrim: data.programTrim || "",
        programWeight: data.programWeight || "",
        usedWeight: data.usedWeight || "",
        ...(isViewOnly
          ? {
            statusDescription: null,
            updatedFor: "slitting Supervisor",
            updatedBy: "Slitting Supervisor",
          }
          : {}),
      });

      const groupedRows = data.rollsData?.reduce((acc, row, i) => {
        if (row.splitId) {
          if (!acc[row.splitId]) {
            acc[row.splitId] = [];
          }
          acc[row.splitId].push(row);
        } else {
          acc[i] = [row];
        }
        return acc;
      }, {});

      const finalRows = Object.values(groupedRows).flatMap((group) => {
        if (group.length > 1) {
          return group.map((row, index) => ({
            jobId: row.jobId || null,
            jobNumber: row.jobNumber || "",
            drawingNumber: row.drawingNumber || "NA",
            workOrder: row.workOrder || "NA",
            rollTrim: row.rollTrim || null,
            width: row.width || null,
            thickness: row.thickness || formData.thickness || null,
            length: row.length || null,
            weight: row.weight || null,
            splitRoll: true,
            showAddIcon: index === 0,
            stack: row.stack || null,
            isChild: index !== 0,
            isInitiatedFromShortlist: row.isInitiatedFromShortlist || false,
            splitId: row.splitId || null,
            ...(isViewOnly
              ? {
                rollId: row.rollId || null,
                rollStatus: row.rollStatus || "",
                subStatus: {},
                createdBy: "Slitting Supervisor",
                updatedBy: "Slitting Supervisor",
                slittingProgramId: data.slittingProgramId,
              }
              : {}),
          })).filter(row => row.jobNumber !== null && row.jobNumber !== undefined);
        } else {
          return group.map((row) => ({
            jobId: row.jobId || null,
            jobNumber: row.jobNumber || "",
            drawingNumber: row.drawingNumber || "NA",
            workOrder: row.workOrder || "NA",
            rollTrim: row.rollTrim || null,
            width: row.width || null,
            thickness: row.thickness || formData.thickness || null,
            length: row.length || null,
            weight: row.weight || null,
            splitRoll: false,
            showAddIcon: false,
            stack: row.stack || null,
            isChild: false,
            isInitiatedFromShortlist: row.isInitiatedFromShortlist || false,
            splitId: row.splitId || null,
            ...(isViewOnly
              ? {
                rollId: row.rollId || null,
                rollStatus: row.rollStatus || "",
                subStatus: {},
                createdBy: "Slitting Supervisor",
                updatedBy: "Slitting Supervisor",
                slittingProgramId: data.slittingProgramId,
              }
              : {}),
          })).filter(row => row.jobNumber !== null && row.jobNumber !== undefined);
        }
      });
      const updatedFinal = finalRows.filter((row) => row.jobNumber && row.jobNumber !== null && row.jobNumber !== undefined)
      setRows(updatedFinal || []);
    } else if (
      shorlistedJobInfo &&
      shorlistedJobInfo.jobNumber !== null &&
      shorlistedJobInfo.jobNumber !== undefined
    ) {
      setFormData({
        coil_rollNumber: "",
        weight: "",
        thickness: shorlistedJobInfo.thickness || "",
        width: "",
        trimWidth: "",
        trimScrap: "",
        programTrim: "",
        programWeight: "",
        usedWeight: "",

        ...(isViewOnly
          ? {
            statusDescription: null,
            updatedFor: "slitting Supervisor",
            updatedBy: "Slitting Supervisor",
          }
          : {}),
      });

      setRows([
        {
          jobId: shorlistedJobInfo.jobId || null,
          jobNumber: shorlistedJobInfo.jobNumber || "",
          drawingNumber: shorlistedJobInfo.drawingNumber || "NA",
          workOrder: shorlistedJobInfo.workOrder || "NA",
          rollTrim: null,
          width: shorlistedJobInfo.width || null,
          thickness: shorlistedJobInfo.thickness || null,
          length: null,
          weight: shorlistedJobInfo.weight || null,
          splitRoll: false,
          showAddIcon: false,
          isChild: false,
          stack: null,
          isInitiatedFromShortlist: true,
          ...(isViewOnly
            ? {
              rollId: "",
              rollStatus: "",
              subStatus: {},
              createdBy: "Slitting Supervisor",
              updatedBy: "Slitting Supervisor",
              slittingProgramId: "",
            }
            : {}),
        },
      ]);
    } else {
      setFormData({
        coil_rollNumber: "",
        weight: "",
        thickness: "",
        width: "",
        trimWidth: "",
        trimScrap: "",
        programTrim: "",
        programWeight: "",
        usedWeight: "",
        ...(isViewOnly
          ? {
            statusDescription: null,
            updatedFor: "slitting Supervisor",
            updatedBy: "Slitting Supervisor",
          }
          : {}),
      });
      setRows([
        {
          jobId: null,
          jobNumber: "",
          drawingNumber: "",
          workOrder: "",
          rollTrim: null,
          width: null,
          thickness: formData.thickness || null,
          length: null,
          weight: null,
          splitRoll: false,
          showAddIcon: false,
          isChild: false,
          splitId: null, // Unique identifier for split groups
          stack: null,
          isInitiatedFromShortlist: false,
          ...(isViewOnly
            ? {
              rollId: "",
              rollStatus: "",
              subStatus: {},
              createdBy: "Slitting Supervisor",
              updatedBy: "Slitting Supervisor",
              slittingProgramId: data.slittingProgramId,
            }
            : {}),
        },
      ]);
    }
  }, [data, shorlistedJobInfo]);

  const fetchCoilDetails = async (coil_rollNumber) => {
    try {
      // const response = await apiClient.get(`/api/coilDetails/${coil_rollNumber}`);
      if (
        coil_rollNumber !== null &&
        coil_rollNumber !== undefined &&
        coil_rollNumber !== ""
      ) {
        console.log("Fetching coil details for:", coil_rollNumber);
        const response = await CoilInventoryServices.getCoilInfo(
          coil_rollNumber
        );
        console.log("Fetched coil details:", response);
        if (response.error != null) {
          toast.error(
            response?.responseStatusList?.statusList[0]?.statusDesc ||
            response?.error ||
            "Unknown error"
          );
          setFormData({
            ...formData,
            coil_rollNumber: coil_rollNumber,
            weight: "",
            thickness: "",
            width: "",
            usedWeight: "",
          });
        } else {
          if (response.responseStatusList.statusList[0].statusCode === 200) {
            const coils = response.responseObject.data;
            if (coils.statusType === "fullyUtilize") {
              setFormData({
                ...formData,
                coil_rollNumber: coil_rollNumber,
                weight: "",
                thickness: "",
                width: "",
                usedWeight: "",
              });
              toast.error(
                "Coil is fully utilized. Please enter another coil number."
              );
              return;
            }
            if (coils) {
              console.log("Fetched coil details:", coils);
              if (
                shorlistedJobInfo.jobNumber !== null &&
                shorlistedJobInfo.jobNumber !== undefined
              ) {
                console.log("Shortlisted")
                if (coils.thickness !== Number(shorlistedJobInfo.thickness)) {
                  throw new Error(
                    "Thickness of coil does not match with shorlisted job thickness"
                  );
                } else {
                  if (coils.width < Number(shorlistedJobInfo.width)) {
                    throw new Error(
                      "Width of coil is less than shorlisted job width"
                    );
                  } else if (coils.weight < Number(shorlistedJobInfo.weight)) {
                    throw new Error(
                      "Weight of coil is less than shorlisted job weight"
                    );
                  } else {
                    setFormData({
                      ...formData,
                      coil_rollNumber:
                        coils.coilNumber || coils.coil_rollNumber,
                      weight: coils.weight,
                      thickness: coils.thickness,
                      width: coils.width,
                      usedWeight: coils.usedWeight,
                    });
                    setRows((prevRows) =>
                      prevRows.map((row) => ({
                        ...row,
                        thickness: coils.thickness,
                      }))
                    );
                    if (formData.thickness) {
                      fetchJobNumbers();
                    }
                  }
                }
              } else {
                console.log("Not Shortlisted")
                if (
                  (rollNumber !== null && rollNumber !== undefined) ||
                  coil_rollNumber?.includes("_")
                ) {
                  console.log("Roll Number")
                  setFormData({
                    ...formData,
                    coil_rollNumber: coils.coil_rollNumber || coils.coilNumber,
                    weight: coils.weight,
                    thickness: coils.thickness,
                    width: coils.width,
                    usedWeight: coils.usedWeight
                  });
                  setRows((prevRows) =>
                    prevRows.map((row) => ({
                      ...row,
                      thickness: coils.thickness,
                    }))
                  );
                  if (formData.thickness) {
                    fetchJobNumbers();
                  }
                } else {
                  console.log("Coil Number")
                  setFormData({
                    ...formData,
                    coil_rollNumber: coils.coilNumber,
                    weight: coils.weight,
                    thickness: coils.thickness,
                    width: coils.width,
                    usedWeight: coils.usedWeight
                  });
                  setRows((prevRows) =>
                    prevRows.map((row) => ({
                      ...row,
                      thickness: coils.thickness,
                    }))
                  );
                  if (formData.thickness) {
                    fetchJobNumbers();
                  }
                }
              }
            } else {
              console.log("Coil details not found");
              toast.error(
                response?.responseStatusList?.statusList[0]?.statusDesc ||
                response?.error ||
                "Unknown error"
              );
              setFormData({
                ...formData,
                coil_rollNumber: coil_rollNumber,
                weight: "",
                thickness: "",
                width: "",
                usedWeight: "",
              });
              if (addedCoil) {
                // onClose();
              }
            }
          } else {
            console.log("Coil details not found", response);
            toast.error(
              response?.responseStatusList?.statusList[0]?.statusDesc ||
              response?.error ||
              "Unknown error"
            );
            setFormData({
              ...formData,
              coil_rollNumber: coil_rollNumber,
              weight: "",
              thickness: "",
              width: "",
              usedWeight: "",
            });
            if (addedCoil) {
              // onClose();
            }
          }
        }
      } else {
        setFormData({
          ...formData,
          coil_rollNumber: coil_rollNumber,
          weight: "",
          thickness: "",
          width: "",
          usedWeight: "",
        });
        if (addedCoil) {
          // onClose();
        }
      }
    } catch (error) {
      if (addedCoil) {
        onClose();
      } else {
        error;
        toast.error(error.message);
        console.error("Error fetching coil details:", error);
      }
    }
  };

  const getAvailableJobNumbers = (rows, jobNumbers) => {
    // Step 1: Filter job numbers with available attributes
    const filteredJobNumbers = jobNumbers.filter((job) => {
      const jobNumber = String(job.jobNumber); // Ensure consistent type

      // Check if at least one attribute is not fully occupied
      const hasAvailableAttributes = job.jobAttributes.some((attr) => {
        const width = String(attr.width); // Ensure consistent type
        const maxWeight =
          Number(attr.processWeight) * 1.03 - Number(attr.usedWeight); // Ensure consistent type
        console.log(
          "Job Number:",
          jobNumber,
          "Width:",
          width,
          "Max Weight:",
          maxWeight
        );
        // Calculate the total weight already occupied for this width and job number
        const totalOccupiedWeight = rows.reduce((total, row) => {
          if (row.jobNumber === jobNumber && String(row.width) === width) {
            return total + Number(row.weight);
          }
          return total;
        }, 0);

        console.log("Total Weight Occupied:", totalOccupiedWeight);

        // Check if the current width still has space left
        return maxWeight > totalOccupiedWeight;
      });

      return hasAvailableAttributes;
    });

    return filteredJobNumbers;
  };

  // Fetch Job Numbers
  const fetchJobNumbers = async () => {
    try {
      // Mock API call, replace with actual API call
      const response = await JobOrderService.getUnOccupiedJobOrders(
        formData.thickness
      );
      setJobInfo(response?.responseObject?.data);
      const currJobNumbers = response.responseObject.data
        .map((job) => ({
          jobNumber: job.jobNumber,
          workOrder: job.workOrder,
          drawingNumber: job.drawingNumber,
          jobAttributes: job.jobAttributes,
        }))
        .filter((job) => job.jobAttributes.some((attr) => !attr.occupied)); // Only include jobs with at least one unoccupied attribute

      // Step 3: Update state with available job numbers
      const availableJobNumbers = getAvailableJobNumbers(rows, currJobNumbers);
      setJobNumbers(availableJobNumbers);

      if (availableJobNumbers.length === 0) {
        toast.error(
          "No available job numbers found. Please create a new job order."
        );
        // setJobFetched(false);
      } else {
        // setJobFetched(true);
      }
      console.log("Available job numbers:", availableJobNumbers);
    } catch (error) {
      // setJobFetched(false);
      console.error("Error fetching job numbers:", error);
      // toast.error("Failed to fetch job numbers. Please try again later.");
    }
  };
  const handleJobSelection = (jobNumber, jobNumbers, rows) => {
    if (jobNumber === "Extra") {
      setFormData({ ...formData, jobNumber: "" });
      const randomValue = Math.floor(Math.random() * 1000000);
      setFormData({ ...formData, jobNumber: randomValue });
      return;
    }
    const selectedJob = jobNumbers.find((job) => job.jobNumber === jobNumber);
    if (selectedJob) {
      // Map to store total weights used for each width under the selected jobNumber
      const widthWeightMap = new Map();

      if (rows.length > 0) {
        // Calculate the total weight for each width in rows for the selected jobNumber
        rows?.forEach((row) => {
          if (row.jobNumber === jobNumber) {
            const width = String(row.width); // Ensure consistent type
            const weight = Number(row.weight); // Ensure consistent type
            widthWeightMap.set(
              width,
              (widthWeightMap.get(width) || 0) + weight
            );
          }
        });

        widthWeightMap.forEach((weight, width) => {
          console.log("Width:", width, "Total Weight:", weight);
        });
        // Determine which widths are fully occupied
        const occupiedWidthsForJob = new Set();
        selectedJob.jobAttributes.forEach((attr) => {
          const attrWidth = String(attr.width); // Ensure consistent type
          const maxWeight =
            Number(attr.processWeight) * 1.03 - Number(attr.usedWeight); // Ensure consistent type
          const totalWeightUsed = widthWeightMap.get(attrWidth) || 0;

          // If the total weight used meets or exceeds the max weight, mark the width as occupied
          if (totalWeightUsed >= maxWeight) {
            occupiedWidthsForJob.add(attrWidth);
          }
        });

        console.log("Occupied widths for job:", jobNumber, [
          ...occupiedWidthsForJob,
        ]);

        // Filter the jobAttributes to find available widths
        const availableAttributes = selectedJob.jobAttributes.filter((attr) => {
          const attrWidth = String(attr.width); // Ensure same type as occupiedWidthsForJob
          return !attr.occupied && !occupiedWidthsForJob.has(attrWidth);
        });

        console.log(
          "Available widths for current row:",
          availableAttributes.map((attr) => attr.width)
        );

        // Set the state with the updated available attributes
        setSelectedJobNumberWidth({
          jobNumber: jobNumber,
          availableAttributes: availableAttributes,
        });
      }
    }
  };

  // Handle dropdown change
  const handleDropdownChange = async (index, field, value) => {
    const updatedRows = [...rows];

    if (field === "jobNumber") {
      if (
        shorlistedJobInfo &&
        shorlistedJobInfo.jobNumber !== null &&
        value === shorlistedJobInfo?.jobNumber
      ) {
        const totalWidth = rows.reduce(
          (total, row, i) => (i !== index ? total + Number(row.width) : total),
          0
        );
        console.log("totalWidth", totalWidth);
        const totalWeightConsumedShortlisted = rows.reduce(
          (total, row, i) =>
            row.jobNumber === value && i !== index
              ? total + Number(row.weight)
              : total,
          0
        );
        console.log(
          "totalWeightConsumedShortlisted",
          totalWeightConsumedShortlisted
        );
        if (
          totalWeightConsumedShortlisted -
          Number(shorlistedJobInfo.weight) * 1.03 <
          shorlistedJobInfo.weight
        ) {
          const prevRow = updatedRows[index - 1];
          if (
            (prevRow !== null || prevRow !== undefined) &&
            prevRow.splitId === rows[index].splitId
          ) {
            const weight =
              (Number(formData.programTrim) * Number(shorlistedJobInfo.width)) /
              10;
            updatedRows[index][field] = value;
            updatedRows[index].drawingNumber = shorlistedJobInfo.drawingNumber;
            updatedRows[index].workOrder = shorlistedJobInfo.workOrder;
            updatedRows[index].width = shorlistedJobInfo.width;
            updatedRows[index].isInitiatedFromShortlist = true;
            updatedRows[index].weight = weight;
            updatedRows[index].jobId = shorlistedJobInfo.jobId;
          } else {
            if (
              totalWidth +
              Number(shorlistedJobInfo.width) +
              Number(formData.trimWidth || 0) >
              Number(formData.width || 0)
            ) {
              toast.error("Total width exceeded, can not add this job number");
              updatedRows[index].jobNumber = "";
              updatedRows[index].drawingNumber = "";
              updatedRows[index].workOrder = "";
              updatedRows[index].width = "";
              setRows(updatedRows);
              return;
            } else {
              const weight =
                (Number(formData.programTrim) *
                  Number(shorlistedJobInfo.width)) /
                10;
              updatedRows[index][field] = value;
              updatedRows[index].drawingNumber =
                shorlistedJobInfo.drawingNumber;
              updatedRows[index].workOrder = shorlistedJobInfo.workOrder;
              updatedRows[index].width = shorlistedJobInfo.width;
              updatedRows[index].isInitiatedFromShortlist = true;
              updatedRows[index].weight = weight;
              updatedRows[index].jobId = shorlistedJobInfo.jobId;
            }
          }
        } else {
          toast.error("Total weight exceeded, can not add this job number");
          updatedRows[index].jobNumber = "";
          updatedRows[index].drawingNumber = "";
          updatedRows[index].workOrder = "";
          updatedRows[index].width = "";
        }
        setRows(updatedRows);
        return;
      }
      // Recalculate total weight and update programWeight
      const totalProgramWeight = calculateTotalWeight();
      setFormData((prevFormData) => ({
        ...prevFormData,
        programWeight: totalProgramWeight,
      }));

      // Clear dependent fields
      updatedRows[index].drawingNumber = "";
      updatedRows[index].workOrder = "";
      updatedRows[index].width = "";

      const selectedJob = jobNumbers.find((job) => job.jobNumber === value);
      if (selectedJob) {
        // Automatically populate work order and enable width options
        updatedRows[index][field] = value;
        updatedRows[index].workOrder = selectedJob.workOrder;

        updatedRows[index].drawingNumber = selectedJob.drawingNumber;

        // Save the jobAttributes for the selected job
        updatedRows[index].jobAttributes = selectedJob.jobAttributes;
      }
    }

    setRows(updatedRows);
    handleJobSelection(value, jobNumbers, rows);
  };
  const handleAddRow = () => {
    // Check if all fields in all previous rows are filled
    const areAllRowsComplete = rows.every((row) => {
      return Object.keys(row).every((key) => {
        console.log("Key:", key, "Value:", row[key]);
        if (
          key === "splitRoll" ||
          key === "showAddIcon" ||
          key === "isChild" ||
          key === "stack" ||
          key === "jobId"
        ) {
          return true; // Ignore these fields in validation
        }
        return row[key] !== ""; // Ensure other fields are not empty
      });
    });

    if (!areAllRowsComplete) {
      toast.error(
        "Please fill all fields in the previous rows before adding a new one."
      );
      return;
    }
    // Recalculate total weight and update programWeight
    const totalProgramWeight = calculateTotalWeight();
    setFormData((prevFormData) => ({
      ...prevFormData,
      programWeight: totalProgramWeight,
    }));

    const lastRow = rows[rows.length - 1]; // Define lastRow
    const splitId = lastRow.splitId;
    const totalRollTrim = rows.reduce((sum, row) => {
      if (row.splitId === splitId) {
        console.log(row.rollTrim);
        return sum + row.rollTrim;
      }
      return sum;
    }, 0);
    console.log(
      "Total Roll Trim:",
      totalRollTrim,
      splitId,
      formData.programTrim
    );
    if (splitId !== null && Math.abs(totalRollTrim - Number(formData.programTrim)) > 0.01) {
      toast.error(
        "Sum of roll trim of all split rolls should be equal to the program trim."
      );
      return;
    }

    console.log("Previous Row values before new row", rows);
    setRows([
      ...rows,
      {
        jobId: "",
        jobNumber: "",
        drawingNumber: "",
        workOrder: "",
        rollTrim: formData.programTrim,
        width: null,
        thickness: formData.thickness,
        length: null,
        weight: null,
        splitRoll: false,
        showAddIcon: false,
        isChild: false,
        splitId: null, // Unique identifier for split groups
        stack: null,
        isInitiatedFromShortlist: false,
      },
    ]);
  };

  const handleAddExtraRoll = (index) => {
    console.log("handleAddExtraRoll called for index:", index); // Debug log

    if (!rows || rows.length === 0) {
      console.error("Rows are not initialized or empty"); // Debug for empty rows
      return;
    }

    const newRows = [...rows];
    newRows[index]["jobId"] = `Extra ${Math.floor(Math.random() * 1000000)}`;
    newRows[index]["jobNumber"] = "Extra";
    newRows[index]["drawingNumber"] = "Extra";
    newRows[index]["workOrder"] = "Extra";
    newRows[index]["jobAttributes"] = null;
    newRows[index]["width"] = null;
    newRows[index]["length"] = null;
    newRows[index]["weight"] = 0;

    setRows(newRows);
    console.log("Extra Roll Added. Updated Rows:", newRows);
  };

  const handleAddSplitRow = (index) => {
    const lastRow = rows[rows.length - 1];

    // // Check if all fields in the last row are filled
    // const isLastRowComplete = Object.keys(lastRow).every((key) => {
    //   if (
    //     key === "splitRoll" ||
    //     key === "showAddIcon" ||
    //     key === "isChild" ||
    //     key === "stack" ||
    //     key === "jobId"
    //   ) {
    //     return true;
    //   }
    //   return lastRow[key] !== "";
    // });

    // if (!isLastRowComplete) {
    //   toast.error(
    //     "Please fill all fields in the previous row before adding a new one."
    //   );
    //   return;
    // }

    const newRows = [...rows];
    const parentRow = newRows[index];

    // If the parent doesn't already have a splitId, assign a new unique ID
    if (!parentRow.splitId) {
      parentRow.splitId = `split-${Date.now()}`; // Generate a unique splitId
    }

    // Add a child row with the same splitId as the parent
    newRows.splice(index + 1, 0, {
      jobId: null,
      jobNumber: "",
      drawingNumber: "",
      workOrder: "",
      rollTrim: "",
      width: null,
      thickness: formData.thickness,
      length: null,
      weight: null,
      splitRoll: false, // Disable splitting for child rows
      showAddIcon: false, // No add icon for child rows
      isChild: true, // Mark the row as a child row
      splitId: parentRow.splitId, // Same splitId as the parent
      stack: null,
      isInitiatedFromShortlist: false,
    });

    setRows(newRows);
  };

  const handleDeleteRow = (index) => {
    const newRows = [...rows];

    // If the row is a parent, remove all subsequent child rows
    if (!newRows[index].isChild) {
      let childIndex = index + 1;
      while (childIndex < newRows.length && newRows[childIndex].isChild) {
        newRows.splice(childIndex, 1);
      }
    }

    // Remove the selected row
    newRows.splice(index, 1);
    setRows(newRows);
    // Recalculate total weight and update programWeight
    console.log("New Rows:", newRows, rows);
    const totalProgramWeight = newRows.reduce(
      (acc, row) => acc + row.weight,
      0
    );
    console.log("Total Program Weight:", totalProgramWeight);
    setFormData((prevFormData) => ({
      ...prevFormData,
      programWeight: totalProgramWeight,
    }));
  };

  const handleSplitRollChange = (index, isChecked) => {
    const newRows = [...rows];

    const hasChildRows = newRows.some(
      (row, i) =>
        i > index && row.splitId && row.splitId === newRows[index].splitId
    );
    if (hasChildRows) {
      toast.error("There are split rolls added. Please remove them first.");
      return;
    }

    if (!isChecked) {
      newRows[index].splitId = null;
      newRows[index].splitRoll = false;
      newRows[index].showAddIcon = newRows[index].splitRoll;
      newRows[index].rollTrim = formData.programTrim;
    } else {
      newRows[index].splitId = newRows[index].splitId || `split-${Date.now()}`;
      newRows[index].splitRoll = true;
      newRows[index].showAddIcon = newRows[index].splitRoll;
      newRows[index].rollTrim = "";
    }

    setRows(newRows);
    console.log(rows);
  };

  const handleInputChange = (event, index, field) => {
    const newRows = [...rows];
    let value = Number(event.target.value);

    // Prevent negative values
    if (value < 0) {
      value = "";
      toast.error("Negative values are not allowed.");
      return;
    }

    if (field === "rollTrim") {
      if (value > formData.programTrim) {
        toast.error("Roll trim cannot be greater than program trim.");
        return;
      }
      if (newRows[index]["isChild"]) {
        const allSplitRows = newRows.filter(
          (row) => row["splitId"] === newRows[index]["splitId"]
        );

        let totalRollTrim = allSplitRows.reduce((sum, row) => {
          return sum + Number(row.rollTrim);
        }, 0);
        console.log("Total Roll Trim:", totalRollTrim);
        totalRollTrim =
          totalRollTrim - Number(newRows[index].rollTrim) + Number(value);

        if (totalRollTrim > formData.programTrim) {
          toast.error(
            "Total roll trim of split rolls cannot be greater than program trim."
          );
          return;
        }
      }
      const weightSum = rows.reduce((sum, row, i) => {
        if (
          i !== index &&
          row.width === newRows[index].width &&
          row.jobNumber === newRows[index].jobNumber
        ) {
          return sum + Number(row.weight);
        }
        return sum;
      }, 0);
      console.log("weightSum", weightSum, newRows);
      const weightOfCurr = Math.round(((newRows[index]["width"] * value) / 10) * 10) / 10;
      if (newRows.length > 1 && newRows[index].jobAttributes) {


        const jobInfo = newRows[index]?.jobAttributes ? newRows[index].jobAttributes.filter(
          (job) => job["width"] === newRows[index]["width"]
        )[0] : newRows[index].width;

        const pWeight =
          Number(jobInfo.processWeight) - Number(jobInfo.usedWeight);

        console.log("weight of split roll", jobInfo, (Number(weightOfCurr)), Number(weightSum), pWeight * 1.03)
        if (Number(weightOfCurr) + Number(weightSum) > pWeight * 1.03) {
          toast.error(`Weight of ${newRows[index]['jobNumber']} and selected width ${newRows[index]['width']} can not be greater than the 3% of remaing process weight: ${pWeight * 1.03}`);
          return;
        }

        newRows[index][field] = value;
        newRows[index]["weight"] =
          Math.round(((newRows[index]["width"] * value) / 10) * 10) / 10;

        // Recalculate total weight and update programWeight
        const totalProgramWeight = calculateTotalWeight();
        setFormData((prevFormData) => ({
          ...prevFormData,
          programWeight: totalProgramWeight,
        }));

        setRows(newRows);
        return;
      } else {
        newRows[index][field] = value;
        newRows[index]["weight"] =
          Math.round(((newRows[index]["width"] * value) / 10) * 10) / 10;

        // Recalculate total weight and update programWeight
        const totalProgramWeight = calculateTotalWeight();
        setFormData((prevFormData) => ({
          ...prevFormData,
          programWeight: totalProgramWeight,
        }));

        setRows(newRows);
        return;
      }
    }

    if (field === "width") {
      console.log("job attributes", newRows[index].jobAttributes);
      const selectedAttr = newRows[index]?.jobAttributes?.find(
        (attr) => value === attr.width
      );
      newRows[index]["jobId"] = selectedAttr ? selectedAttr?.jobId : null;
      console.log("Job Id:", newRows[index]["jobId"], selectedAttr);

      if (newRows[index]["splitId"]) {
        if (newRows[index]["isChild"]) {
          if (value !== newRows[index - 1]["width"]) {
            toast.error("Width of split rolls should be same as parent roll.");
            return;
          } else {
            newRows[index][field] = value;
            newRows[index]["weight"] =
              (value * newRows[index]["rollTrim"]) / 10;
            newRows[index]["jobId"] = selectedAttr ? selectedAttr.jobId : null;

            // Recalculate total weight and update programWeight
            const totalProgramWeight = calculateTotalWeight();
            setFormData((prevFormData) => ({
              ...prevFormData,
              programWeight: totalProgramWeight,
            }));

            setRows(newRows);
            return;
          }
        } else {
          const totalWidth = newRows.reduce((sum, row, i) => {
            if (!row["isChild"] && i !== index) {
              return sum + Number(row.width);
            }
            return sum;
          }, 0);
          // totalWidth += Number(value);
          if (
            totalWidth + Number(value) + Number(formData.trimWidth) >
            formData.width
          ) {
            toast.error(
              "Total width of rolls cannot be greater than coil width."
            );
            return;
          }
          newRows[index][field] = value;
          let childRows = newRows.filter(
            (row) =>
              row["splitId"] === newRows[index]["splitId"] && row["isChild"]
          );
          childRows.forEach((row) => {
            row.width = "";
            row.weight = "";
            row.rollTrim = "";
          });
          newRows[index]["jobId"] = selectedAttr ? selectedAttr.jobId : null;

          // Recalculate total weight and update programWeight
          const totalProgramWeight = calculateTotalWeight();
          setFormData((prevFormData) => ({
            ...prevFormData,
            programWeight: totalProgramWeight,
          }));

          setRows(newRows);
          return;
        }
      }

      let totalWidth = 0;
      totalWidth = newRows.reduce((sum, row, i) => {
        if (!row["isChild"] && i !== index) {
          return sum + Number(row.width);
        }
        return sum;
      }, 0);
      totalWidth += Number(value);
      console.log("Total Width:", totalWidth, formData.width, Number(formData.trimWidth));
      if (totalWidth + Number(formData.trimWidth) > formData.width) {
        toast.error("Total width of rolls cannot be greater than coil width.");
        return;
      }
      const weight =
        Math.round(((value * newRows[index]["rollTrim"]) / 10) * 10) / 10;
      const totalWeight = newRows.reduce(
        (acc, row, i) => (i !== index ? acc + row.weight : acc),
        0
      );
      console.log("Total Weight:", totalWeight + weight);
      const currRoW = newRows[index];
      const totalConsumedWeightForWidth = newRows.reduce(
        (acc, row, i) =>
          i !== index &&
            row.width === value &&
            row.jobNumber === currRoW.jobNumber
            ? acc + row.weight
            : acc,
        0
      );
      console.log(
        "Total Weight of selected width:",
        value,
        totalConsumedWeightForWidth
      );
      if (newRows[index].jobAttributes) {
        const selectedAttr = newRows[index]?.jobAttributes?.find(
          (attr) => value === attr.width
        );
        console.log(selectedAttr, (Number(selectedAttr.processWeight) * 1.03), Number(selectedAttr.usedWeight))
        const allowedWeight =
          (Number(selectedAttr.processWeight) * 1.03) -
          Number(selectedAttr.usedWeight); // Allow 3% more weight
        const minAllowedWeight = selectedAttr.processWeight * 0.97; // Allow 3% less weight
        console.log("Allowed Weight:", allowedWeight,)
        if (totalConsumedWeightForWidth + weight >= allowedWeight) {
          toast.error(
            "Total weight of rolls of selected width cannot exceed 3% of the process weight."
          );
          return;
        }
      }

      if (totalWeight + weight > formData.weight - formData.usedWeight) {
        if (formData.usedWeight !== 0 || formData.usedWeight !== null) {
          toast.error(
            "Total weight of rolls cannot be greater than coil weight, remaining weight is " + (formData.weight - formData.usedWeight)
          );
          return;
        }
        toast.error(
          "Total weight of rolls cannot be greater than coil weight."
        );
        return;
      }
      newRows[index][field] = value;
      newRows[index]["weight"] =
        Math.round(((value * newRows[index]["rollTrim"]) / 10) * 10) / 10;
      console.log("Weight:", newRows[index]["weight"]);
      newRows[index]["jobId"] = selectedAttr ? selectedAttr.jobId : null;

      // Recalculate total weight and update programWeight
      const totalProgramWeight = calculateTotalWeight().toFixed(2);
      setFormData((prevFormData) => ({
        ...prevFormData,
        programWeight: totalProgramWeight,
      }));

      setRows(newRows);
      return;
    }
  };

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };
  const calculateTotalWeight = () => {
    return rows.reduce((total, row) => total + (Number(row.weight) || 0), 0);
  };
  const handleFormChange = (event) => {
    if (event.target.value < 0) {
      toast.error("Negative values are not allowed.");
      return;
    }

    // Handle changes to trimWidth
    if (event.target.name === "trimWidth") {
      let totalWidth = 0;
      rows.forEach((row) => {
        if (!row["isChild"]) {
          totalWidth += Number(row.width);
        }
      });
      if (Number(event.target.value) + totalWidth > formData.width) {
        toast.error(
          "Total width of rolls + trim width cannot be greater than coil width."
        );
        return;
      }
      const programTotalScrap = Math.round(
        Number(event.target.value) * Number(formData.programTrim)
      ) || 0;
      setFormData({
        ...formData,
        [event.target.name]: event.target.value,
        trimScrap: (programTotalScrap / 10).toFixed(2),
      });
      return;
    }

    // Handle changes to programTrim
    if (event.target.name === "programTrim") {
      const maxProgramTrimForShorlistedJob =
        ((Number(shorlistedJobInfo?.weight) * 1.03) /
          Number(shorlistedJobInfo?.width)) *
        10;

      if (
        shorlistedJobInfo &&
        shorlistedJobInfo.jobNumber !== null &&
        shorlistedJobInfo.jobNumber !== undefined
      ) {
        if (event.target.value > maxProgramTrimForShorlistedJob) {
          toast.error(
            `Maximum program trim allowed is ${maxProgramTrimForShorlistedJob.toFixed(2)}, for this shortlisted job.`
          );
          return;
        }
      }

      const updatedRow = rows.map((row) => {
        if (!row.splitId) {
          row.rollTrim = event.target.value;
          row.weight =
            Math.round(((row.width * event.target.value) / 10) * 10) / 10;
        }
        return row;
      });

      const totalWeightOfSelectedJobForWidth = updatedRow.reduce((acc, row) => {
        const key = `${row.jobNumber}-${row.width}`;
        if (!acc[key]) {
          acc[key] = 0;
        }
        acc[key] += Number(row.weight);
        return acc;
      }, {});
      console.log(
        "totalWeightOfSelectedJobForWidth",
        totalWeightOfSelectedJobForWidth
      );

      const isValid = updatedRow.every((row) => {
        const key = `${row.jobNumber}-${row.width}`;
        const totalWeight = totalWeightOfSelectedJobForWidth[key];
        const jobAttr = row.jobAttributes?.find(
          (attr) => attr.width === row.width
        );
        if (
          jobAttr &&
          jobAttr.processWeight - jobAttr.usedWeight < totalWeight
        ) {
          return false;
        }
        return true;
      });

      if (!isValid) {
        toast.error(
          "Total weight of job exceed the planned process weight for jobs."
        );
        return;
      }
      let weight = (Number(formData.weight) || 0) - (Number(formData.usedWeight) || 0);
      console.log("weight", weight, formData.weight, data?.usedWeight);
      if (data?.usedWeight != null) {
        weight = weight + data?.usedWeight;
        console.log("weight", weight);
      }
      const trimScrap = Number(formData.trimScrap) || 0;
      const width = Number(formData.width) || 0;
      const trimWidth = Number(formData.trimWidth) || 0;
      const maxProgramTrim = (weight / width) * 10;

      if (event.target.value > maxProgramTrim) {
        console.log("maxProgramTrim", maxProgramTrim);
        toast.error(
          "Program trim cannot be greater than the maximum program trim : " +
          Math.trunc(maxProgramTrim * 100) / 100
          +
          "."
        );
        return;
      }
      const programTotalScrap =
        Number(formData.trimWidth) * Number(event.target.value);
      setFormData({
        ...formData,
        [event.target.name]: event.target.value,
        trimScrap: Math.trunc((programTotalScrap / 10) * 100) / 100,
      });
      const totalProgramWeight = calculateTotalWeight();
      setFormData((prevFormData) => ({
        ...prevFormData,
        [event.target.name]: event.target.value,
        programWeight: totalProgramWeight,
      }));
      if (event.target.name === "programWeight") {
        setFormData((prevFormData) => ({
          ...prevFormData,
          programWeight: event.target.value,
        }));
      }

      setRows(updatedRow);
      setFormData((prevFormData) => ({
        ...prevFormData,
        programWeight: totalProgramWeight,
      }));
    }
  };
  const handlecoil_rollNumberChange = (event) => {
    setFormData({
      ...formData,
      coil_rollNumber: event.target.value.toUpperCase(),
    });
    debouncedSearchChange(event.target.value);
  };
  const debouncedSearchChange = useCallback(
    debounce(fetchCoilDetails, 2000),
    []
  );

  const handleSubmit = () => {
    // Check if any formData field is empty
    const emptyFormFields = [];
    if (!formData.coil_rollNumber) emptyFormFields.push("Coil Number");
    if (!formData.weight) emptyFormFields.push("Weight");
    if (!formData.thickness) emptyFormFields.push("Thickness");
    if (!formData.width) emptyFormFields.push("Width");
    if (!formData.trimWidth) emptyFormFields.push("Trim Width");
    if (!formData.programTrim) emptyFormFields.push("Program Trim");

    // Check if any row fields are empty
    const emptyRowFields = [];
    rows.forEach((row, index) => {
      if (!row.jobNumber) emptyRowFields.push(`Job No`);
      if (!row.drawingNumber) emptyRowFields.push(`Drawing No`);
      if (!row.workOrder) emptyRowFields.push(`Work Order`);
      if (!row.rollTrim) emptyRowFields.push(`rollTrim`);
      if (!row.width) emptyRowFields.push(`Width`);
      if (!row.thickness) emptyRowFields.push(`Thickness`);
      // if (!row.length) emptyRowFields.push(`Length`);
      if (!row.weight) emptyRowFields.push(`Weight`);
    });

    // Combine all empty fields
    const allEmptyFields = [...emptyFormFields, ...emptyRowFields];

    // Check for negative values
    const negativeFormFields = [];
    if (formData.weight < 0) negativeFormFields.push("Weight");
    if (formData.thickness < 0) negativeFormFields.push("Thickness");
    if (formData.width < 0) negativeFormFields.push("Width");

    const negativeRowFields = [];
    rows.forEach((row, index) => {
      if (row.width < 0) negativeRowFields.push(`Width in Row ${index + 1}`);
      if (row.thickness < 0)
        negativeRowFields.push(`Thickness in Row ${index + 1}`);
      if (row.weight < 0) negativeRowFields.push(`Weight in Row ${index + 1}`);
      if (row.length < 0) negativeRowFields.push(`Length in Row ${index + 1}`);
    });

    const allNegativeFields = [...negativeFormFields, ...negativeRowFields];

    // Show error if any fields are empty or negative
    if (allEmptyFields.length > 0) {
      toast.error(
        `Please fill out the following fields: ${allEmptyFields.join(", ")}`
      );
      return; // Stop further execution
    }
    if (allNegativeFields.length > 0) {
      toast.error(
        `The following fields contain negative values: ${allNegativeFields.join(
          ", "
        )}`
      );
      return; // Stop further execution
    }
    // Check if the sum of rollTrim for all rows with the same splitId equals the program trim
    const splitGroups = rows.reduce((groups, row) => {
      if (row.splitId) {
        if (!groups[row.splitId]) {
          groups[row.splitId] = [];
        }
        groups[row.splitId].push(row);
      }
      return groups;
    }, {});

    for (const splitId in splitGroups) {
      const totalRollTrim = splitGroups[splitId].reduce(
        (sum, row) => sum + Number(row.rollTrim),
        0
      );
      if (Math.abs(totalRollTrim - Number(formData.programTrim)) > 0.01) {
        toast.error(
          `Sum of roll trim for split group ${splitId} should be equal to the program trim.`
        );
        return;
      }

    }

    const totalWeight = rows.reduce((acc, row) => acc + Number(row.weight), 0);
    if (Number(formData.weight) < totalWeight + Number(formData.trimScrap) - 0.5) {
      toast.error(
        "Total weight of program cannot be greater than coil weight."
      );
      return;
    }
    // Prepare data for submission
    const savedData = {
      coil_rollNumber: formData.coil_rollNumber,
      weight: formData.weight,
      thickness: formData.thickness,
      width: formData.width,
      trimWidth: formData.trimWidth,
      programTrim: formData.programTrim,
      trimScrap: Number(formData.trimScrap),
      programWeight: formData.programWeight,
      createdBy: "Slitting Supervisor",
      slittingProgramStatus: "none",
      programStack: null,
      rollsData: rows.map((row) => ({
        jobNumber: row.jobNumber,
        drawingNumber: row.drawingNumber,
        workOrder: row.workOrder,
        rollTrim: row.rollTrim,
        width: row.width,
        thickness: row.thickness,
        length: row.length,
        weight: row.weight,
        splitId: row.splitId,
        jobId:
          row.jobNumber === "Extra"
            ? `Extra-${Math.floor(Math.random() * 1000000)}`
            : row.jobId,
        stack: row.stack,
        isInitiatedFromShortlist: row.isInitiatedFromShortlist,
        ...(isViewOnly
          ? {
            rollId: row.rollId || null,
            rollStatus: row.rollStatus || "",
            subStatus: {},
            createdBy: "Slitting Supervisor",
            updatedBy: "Slitting Supervisor",
            slittingProgramId: data.slittingProgramId,
          }
          : { createdBy: "Slitting Supervisor" }),
      })),
    };
    console.log("savedData", savedData);
    // Call the onSubmit function
    onSubmit(savedData);
  };

  const handleEdit = () => {
    setIsEditConfirmationPopup(true);
  };
  const handleDelete = () => {
    setIsDeleteConfirmationPopup(true);
  };
  const onConfirmDelete = () => {
    setIsDeleteConfirmationVisible(false);
    const datA = {
      coil_rollNumber: formData.coil_rollNumber,
      slittingProgramId: data.slittingProgramId,
    };
    onDelete(datA);
    onClose();
  };

  const handleKeyPress = (e, rowIndex, fieldName) => {
    // Check if 'Enter' key is pressed
    if (e.key === "Enter") {
      handleAddRow();
    }
  };

  const handleFocus = (e) => {
    if (formData.coil_rollNumber === "") {
      toast.error("Please enter coil number first!");
      e.target.blur();
      return;
    }
    e.target.select();
  };

  const getShortlistedWeightConsumed = () => {
    const shortlistedRolls = rows.filter((row) => row.isInitiatedFromShortlist);
    const totalWeightConsumed = shortlistedRolls.reduce(
      (acc, row) => acc + row.weight,
      0
    );
    if (
      shorlistedJobInfo?.weight <
      totalWeightConsumed <
      shorlistedJobInfo?.weight * 1.03
    ) {
      return false;
    } else if (totalWeightConsumed < shorlistedJobInfo?.weight * 1.03) {
      return true;
    }
    return false;
  };

  return (
    <>
      <div className="slitting-form">
        <div className="slitting-form-container">
          <h2>{title}</h2>
          <div className="form-row">
            <div className="form-group">
              <label>
                {formData?.coil_rollNumber?.includes("_") ? "Roll No." : "Coil No."}
                <span className="required-asterisk">*</span>
              </label>
              <input
                type="text"
                name="coil_rollNumber"
                value={formData.coil_rollNumber}
                onChange={handlecoil_rollNumberChange}
                disabled={!isEditable || addedCoil}
              />
            </div>
            <div className="form-group">
              <label>
                {formData?.coil_rollNumber?.includes("_") ? "Roll Weight (kg)" : "Coil Weight (kg)"}
                <span className="required-asterisk">*</span>
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                placeholder="Auto populated according to coil number"
                disabled={true}
                style={{ cursor: "not-allowed" }}
              />
            </div>
            <div className="form-group">
              <label>
                {formData?.coil_rollNumber?.includes("_") ? "Roll Thickness (mm)" : "Coil Thickness (mm)"}
                <span className="required-asterisk">*</span>
              </label>
              <input
                type="number"
                name="thickness"
                value={formData.thickness}
                placeholder="Auto populated according to coil number"
                disabled={true}
                style={{ cursor: "not-allowed" }}
              />
            </div>
            <div className="form-group">
              <label>
                {formData?.coil_rollNumber?.includes("_") ? "Roll Width (mm)" : "Coil Width (mm)"}
                <span className="required-asterisk">*</span>
              </label>
              <input
                type="number"
                name="width"
                value={formData.width}
                placeholder="Auto populated according to coil number"
                disabled={true}
                style={{ cursor: "not-allowed" }}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                Trim width (mm)<span className="required-asterisk">*</span>
              </label>
              <input
                type="number"
                name="trimWidth"
                value={formData.trimWidth}
                onChange={(e) => handleFormChange(e)}
                placeholder="Enter trim width"
                onFocus={handleFocus}
                disabled={!isEditable}
                onWheel={(e) => e.target.blur()}
                onKeyDown={(e) => {
                  if (e.key === '-' || e.key === '+' || e.key === 'e') {
                    e.preventDefault();
                  }
                }}
              />
            </div>
            <div className="form-group">
              <label>
                Program Scrap (kg)<span className="required-asterisk">*</span>
              </label>
              <input
                type="number"
                name="trimScrap"
                value={formData.trimScrap}
                onChange={handleFormChange}
                disabled={true}
                style={{ cursor: "not-allowed" }}
              />
            </div>
            <div className="form-group">
              <label>
                Program Trim (kg)<span className="required-asterisk">*</span>
              </label>
              <input
                type="number"
                name="programTrim"
                value={formData.programTrim}
                onChange={(e) => handleFormChange(e)}
                placeholder="Enter program trim"
                onFocus={handleFocus}
                disabled={!isEditable}
                onWheel={(e) => e.target.blur()}
                onKeyDown={(e) => {
                  if (e.key === '-' || e.key === '+' || e.key === 'e') {
                    e.preventDefault();
                  }
                }}
              />
            </div>
            <div className="form-group">
              <label>
                Program Weight (kg)<span className="required-asterisk">*</span>
              </label>
              <input
                type="number"
                name="programWeight"
                value={formData.programWeight}
                onChange={handleFormChange}
                placeholder="Program Weight"
                onFocus={handleFocus}
                disabled={true}
                onWheel={(e) => e.target.blur()}
              />
            </div>
          </div>

          <div className="slitting-form-data-table-wrapper">
            <table className="common-table">
              <thead>
                <tr>
                  <th>
                    Job No.<span className="required-asterisk">*</span>
                  </th>
                  <th>
                    Drawing No.<span className="required-asterisk">*</span>
                  </th>
                  <th className="required">
                    <div className="flex">
                      Work Order
                      <p>*</p>
                    </div>
                  </th>
                  <th className="required">
                    <div className="flex">
                      Roll Trim (kg)
                      <p>*</p>
                    </div>
                  </th>

                  <th>
                    Width (mm)<span className="required-asterisk">*</span>
                  </th>
                  <th className="required">
                    <div className="flex">
                      Thickness (mm)
                      <p>*</p>
                    </div>
                  </th>
                  <th>Length (mm)</th>
                  <th className="required">
                    <div className="flex">
                      Weight
                      <p>*</p>
                    </div>
                  </th>
                  {isEditable && (
                    <>
                      <th> Split Rolls</th>
                      <th>Actions</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr
                    key={index}
                    className={row.isChild ? "split-row" : ""}
                    style={{
                      backgroundColor: row.isChild ? "#f0f0f0" : "transparent",
                    }}
                  >
                    <td>
                      <select
                        value={row.jobNumber}
                        onClick={() => {
                          if (!jobFetched) {
                            fetchJobNumbers();
                          }
                        }}
                        onChange={(e) => {
                          const selectedValue = e.target.value;
                          if (selectedValue === "Extra") {
                            handleAddExtraRoll(index); // Call handleAddExtraRoll when "Extra" is selected
                          } else {
                            handleDropdownChange(
                              index,
                              "jobNumber",
                              selectedValue
                            ); // Handle other changes
                          }
                        }}
                        disabled={
                          !isEditable ||
                          formData.coil_rollNumber === "" ||
                          row.isInitiatedFromShortlist
                        }
                      >
                        <option value="">
                          {row.jobNumber ? row.jobNumber : "Select"}
                        </option>
                        {getShortlistedWeightConsumed() && (
                          <option value={shorlistedJobInfo.jobNumber}>
                            {shorlistedJobInfo.jobNumber}
                          </option>
                        )}
                        {jobNumbers.map((job, idx) => (
                          <option key={idx} value={job.jobNumber}>
                            {job.jobNumber}
                          </option>
                        ))}
                        <option value="Extra">Extra</option>
                      </select>
                    </td>

                    <td>
                      {row.jobNumber === "Extra" ? (
                        <input
                          type="text"
                          value={row.drawingNumber}
                          onFocus={(e) => {
                            toast.error("It will automatically get calculated");
                            e.target.blur();
                          }}
                          style={{ cursor: "not-allowed" }}
                          readOnly={true}
                        />
                      ) : (
                        <input
                          type="text"
                          value={row.drawingNumber}
                          onFocus={(e) => {
                            if (!row.drawingNumber) {
                              toast.error("Drawing number is required.");
                              e.target.blur();
                            }
                          }}
                          readOnly={true}
                          data-tooltip-id={`tooltip-${index}-width`}
                          data-tooltip-content={row.drawingNumber || ""}
                          data-tooltip-place="top"
                          style={{ cursor: "not-allowed" }}
                        />
                      )}
                      {row.drawingNumber && (
                        <Tooltip id={`tooltip-${index}-width`} />
                      )}
                    </td>

                    <td>
                      {row.jobNumber === "Extra" ? (
                        <input
                          type="text"
                          value={row.workOrder}
                          onFocus={(e) => {
                            if (!row.drawingNumber) {
                              toast.error("Drawing number is required.");
                              e.target.blur();
                            }
                          }}
                          readOnly={true}
                          style={{ cursor: "not-allowed" }}
                        />
                      ) : (
                        <input
                          type="text"
                          value={row.workOrder}
                          onFocus={(e) => {
                            if (!row.workOrder) {
                              toast.error("Drawing number is required.");
                              e.target.blur();
                            }
                          }}
                          readOnly={true}
                          data-tooltip-id={`tooltip-${index}-width`}
                          data-tooltip-content={row.workOrder || ""}
                          data-tooltip-place="top"
                          style={{ cursor: "not-allowed" }}
                        />
                      )}
                      {row.workOrder && (
                        <Tooltip id={`tooltip-${index}-width`} />
                      )}
                    </td>
                    {/* Other Fields */}
                    <td>
                      <input
                        type="number"
                        value={row.rollTrim}
                        onChange={(e) => {
                          handleInputChange(e, index, "rollTrim");
                        }}
                        disabled={
                          !isEditable ||
                          formData.coil_rollNumber === "" ||
                          !row.splitId
                        }
                        onWheel={(e) => e.target.blur()}
                        data-tooltip-id={`tooltip-${index}-width`}
                        data-tooltip-content={row.rollTrim || ""}
                        data-tooltip-place="top"
                      />
                      {<Tooltip id={`tooltip-${index}-width`} />}
                    </td>
                    <td>
                      {row.jobAttributes ? (
                        <select
                          value={row.width}
                          onChange={(e) => handleInputChange(e, index, "width")}
                          disabled={
                            !isEditable || formData.coil_rollNumber === ""
                          }
                        >
                          <option value="">
                            {row.width ? row.width : "Select"}
                          </option>
                          {selectedJobNumberWidth &&
                            selectedJobNumberWidth.availableAttributes.length >
                            0 ? (
                            selectedJobNumberWidth.availableAttributes.map(
                              (attr, idx) => (
                                // attr.thickness === formData.thickness ? (
                                <option key={idx} value={attr.width}>
                                  {attr.width}
                                </option>
                                // ) : null
                              )
                            )
                          ) : (
                            <></>
                            // toast.error("No available widths for the selected job number.")
                          )}
                        </select>
                      ) : (
                        <input
                          type="number"
                          value={row.width}
                          onChange={(e) => handleInputChange(e, index, "width")}
                          onKeyDown={(e) => handleKeyPress(e, index, "width")}
                          disabled={
                            shorlistedJobInfo?.jobNumber === row.jobNumber ||
                            !isEditable
                          }
                        />
                      )}
                    </td>

                    <td>
                      <input
                        type="number"
                        value={row.thickness}
                        onFocus={(e) => {
                          if (!row.thickness) {
                            toast.error("It will automatically get calculated");
                            e.target.blur();
                          }
                        }}
                        onKeyDown={(e) => handleKeyPress(e, index, "thickness")}
                        data-tooltip-id={`tooltip-${index}-width`}
                        data-tooltip-content={row.thickness || ""}
                        data-tooltip-place="top"
                        style={{ cursor: "not-allowed" }}
                        readOnly={true}
                        disabled={true}
                      />
                      {row.thickness && (
                        <Tooltip id={`tooltip-${index}-width`} />
                      )}
                    </td>
                    <td>
                      <input
                        type="number"
                        value={row.length}
                        onChange={(e) => handleInputChange(e, index, "length")}
                        onKeyDown={(e) => handleKeyPress(e, index, "length")}
                        disabled={
                          !isEditable || formData.coil_rollNumber === ""
                        }
                        data-tooltip-id={`tooltip-${index}-width`}
                        data-tooltip-content={row.length || ""}
                        data-tooltip-place="top"
                      />
                      {row.length && <Tooltip id={`tooltip-${index}-width`} />}
                    </td>
                    <td>
                      <input
                        type="number"
                        value={row.weight}
                        onFocus={(e) => {
                          if (!row.weight) {
                            toast.error("It will automatically get calculated");
                            e.target.blur();
                          }
                        }}
                        readOnly={true}
                        style={{ cursor: "not-allowed" }}
                        onKeyDown={(e) => handleKeyPress(e, index, "weight")}
                      />
                    </td>
                    {isEditable && (
                      <>
                        <td>
                          {!row.isChild && (
                            <input
                              type="checkbox"
                              checked={row.splitRoll}
                              onChange={(e) =>
                                handleSplitRollChange(index, e.target.checked)
                              }
                            />
                          )}
                        </td>

                        <td>
                          <>
                            {index != 0 && (
                              <i
                                className="fa fa-trash"
                                onClick={() => handleDeleteRow(index)}
                                style={{
                                  cursor: "pointer",
                                  marginRight: "10px",
                                }}
                              ></i>
                            )}
                            {row.showAddIcon && (
                              <i
                                className="fa fa-plus"
                                onClick={() => handleAddSplitRow(index)}
                                style={{ cursor: "pointer" }}
                              ></i>
                            )}
                          </>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="action-container">
            <button className="close-button" onClick={onClose}>
              Close
            </button>
            {isEditable ? (
              <>
                <button className="add-row-button" onClick={handleAddRow}>
                  Add Row
                </button>
                <button className="submit-button" onClick={handleSubmit}>
                  Submit
                </button>
              </>
            ) : (
              <>
                <button className="edit-button" onClick={handleEdit}>
                  Edit
                </button>
                <button className="delete-button" onClick={handleDelete}>
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
        {isDeleteConfirmationVisible && (
          <ConfirmationPopup
            message="Are you sure you want to delete this coil?"
            title="Delete Coil"
            onConfirm={onConfirmDelete}
            onCancel={() => setIsDeleteConfirmationVisible(false)}
          />
        )}
        {
          isEditConfirmationPopup && (
            <ConfirmationPopup
              title="Edit Slitting"
              message="Please enter the passcode to edit Slitting program."
              confirmPasscode={editPasscode}
              isVisible={isEditConfirmationPopup}
              onConfirm={() => {
                setIsEditConfirmationPopup(false);
                setIsEditable(true);
              }}
              onCancel={() => {
                setIsEditConfirmationPopup(false);
                setIsEditable(false);
              }}
            />
          )
        }
        {
          isDeleteConfirmationPopup && (
            <ConfirmationPopup
              title="Delete Slitting"
              message="Please enter the passcode to delete Slitting program."
              confirmPasscode={deletePasscode}
              isVisible={isDeleteConfirmationPopup}
              onConfirm={() => {
                setIsDeleteConfirmationPopup(false);
                setIsDeleteConfirmationVisible(true);
              }}
              onCancel={() => {
                setIsDeleteConfirmationPopup(false);
                setIsDeleteConfirmationVisible(false);
              }}
            />
          )
        }
      </div>
    </>
  );
};

export default SlittingForm;