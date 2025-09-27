import React, { useState, useEffect } from "react";
import log from "../components/logger.jsx";
import SlittingService from "../services/SlittingService.jsx";
import { toast } from "react-hot-toast";
import useSlittingOperatorHook from "./useSlittingOperatorHook.jsx";

const useSlitting = (
  searchQuery,
  currPage,
  filters,
  onGenerateQrSuccess,
  onAddSuccess
) => {
  const [slittingList, setSlittingList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stackValue, setStackValue] = useState(0);
  const [newSlittingProgram, setNewSlittingProgram] = useState(null);
  const [availableFilters, setAvailableFilters] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10,
    totalItems: 0,
  });
  const { slittingOperator, setSlittingOperator } = useSlittingOperatorHook();
  useEffect(() => {
    fetchSlittingData();
  }, [searchQuery, currPage, filters]);

  const fetchSlittingData = async () => {
    try {
      setLoading(true);
      setError(null);

      log.info("Fetching slitting data...", { searchQuery, currPage, filters });

      const response = await SlittingService.getSlittingList({
        searchQuery,
        currPage,
        filters,
      });

      if (
        response?.responseStatusList?.statusList &&
        response.responseStatusList.statusList[0]?.statusCode === 200
      ) {
        setSlittingList(response.responseObject.data || []);
        setPagination({
          currentPage: response.responseObject.pagination?.currentpage || 1,
          totalPages: response.responseObject.pagination?.totalPages || 1,
          itemsPerPage: response.responseObject.pagination?.itemsPerPage || 10,
          totalItems: response.responseObject.pagination?.totalItems || 0,
        });
        setAvailableFilters(response.responseObject.availableFilter);
      } else {
        const statusDesc =
          response?.responseStatusList?.statusList[0]?.statusDesc ||
          response?.error ||
          "Unknown error";
        setError(statusDesc);

        // throw new Error(errorMsg);
      }
    } catch (err) {
      log.error("Error while fetching slitting data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApiCall = async (apiFunction, args, successMessage) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiFunction(args);

      if (response?.responseStatusList?.statusList?.[0]?.statusCode === 200) {
        toast.success(successMessage);
        fetchSlittingData();
      } else {
        const errorMsg =
          response?.responseStatusList?.statusList?.[0]?.statusDesc ||
          "An error occurred.";
        // setError(errorMsg);
        toast.error(errorMsg);
      }

      return response;
    } catch (err) {
      log.error("Error during API call:", err);
      setError(err.message);
      toast.error("An error occurred.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addSlittingProgram = (formData) =>
    handleApiCall(
      SlittingService.addSlittingProgram,
      formData,
      "Slitting program added successfully."
    );

  const coilHold = (holdData) =>
    handleApiCall(SlittingService.coilHold, holdData, "Coil hold successful.");

  const partialCoilHold = (formData) =>
    handleApiCall(
      SlittingService.partialCoilHold,
      formData,
      "Partial coil hold successful."
    );

  const generateQR = async (formData) => {
    try {
      setLoading(true);
      setError(null);

      log.info("Generating QR code", formData);
      const finishFormData = {
        slittingProgramId: formData.slittingProgramId,
        coil_rollNumber: formData.coil_rollNumber,
        updatedBy: "Slitting Operator",
        slittingProgramStatus: "finish",
        stack: Number(formData.stack),
        trimScrap: Number(formData.trimScrap),
        rollsData: formData.rollsData.map((row) => ({
          jobId: row.jobId,
          rollId: row.rollId,
          actualWeight: row.actualWeight,
          splitId: row.splitId,
        })),
      };
      const response = await SlittingService.generateQR(finishFormData);

      if (
        response?.responseStatusList?.statusList &&
        response.responseStatusList.statusList[0]?.statusCode === 200
      ) {
        onGenerateQrSuccess(response.responseObject.data);

        const newSlitting = generateNewSlittingProgram(formData);
        setNewSlittingProgram(newSlitting);
        if (formData.stack < 250) {
          setSlittingOperator(false);
          setStackValue(formData.stack);
        }

        fetchSlittingData();
        log.info("QR code generated successfully");
        toast.success("QR code generated successfully");
      } else {
        log.error("Failed to finish the slitting program");
        const statusDesc =
          response?.responseStatusList?.statusList[0]?.statusDesc ||
          response?.error ||
          "Unknown error";
        // setError(statusDesc);
        toast.error(statusDesc);
      }
    } catch (err) {
      log.error("Error while generating QR code:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = (formData) =>
    handleApiCall(
      SlittingService.updateStatus,
      formData,
      "Slitting program status updated successfully."
    );

  const handleSlittingProgramDelete = (data) =>
    handleApiCall(
      SlittingService.deleteSlittingProgram,
      data,
      "Slitting program deleted successfully."
    );

  const updateSlitiingProgram = (formData) =>
    handleApiCall(
      (data) => SlittingService.updateSlittingProgram(data),
      formData,
      "Slitting program updated successfully."
    );

  const addMaximumStackSlittingProgram = async () => {
    if (slittingOperator) {
      setLoading(true);
      const result = await SlittingService.addSlittingProgram(
        newSlittingProgram
      );
      setLoading(false);
      console.log("result", result);
      onAddSuccess(result.responseObject.data);
    }
  };

  const generateNewSlittingProgram = (formData) => {
    console.log("formData", formData);
    const totalProgramWeight = formData.rollsData.reduce(
      (acc, row) => acc + Number(row.actualWeight),
      0
    );
    console.log("totalProgramWeight", totalProgramWeight);
    const balancedCoilWeight =
      Number(formData.weight) -
      Number(totalProgramWeight) -
      Number(formData.trimScrap);

    const updatedRow = formData.rollsData.map((row) => ({
      ...row,
      weight: row.weight - row.actualWeight,
    }));

    console.log("updatedRow", updatedRow);
    const totalUpdatedRollWeight = updatedRow.reduce(
      (acc, row) => acc + row.weight,
      0
    );
    const programTrim = (totalUpdatedRollWeight / formData.width) * 10;
    const trimScrap =
      Math.round(programTrim * formData.trimWidth * 10) / 10 / 10;

    const finalUpdatedRows = updatedRow.map((row) => ({
      ...row,
      rollTrim: (row.rollTrim / formData.programTrim) * programTrim,
    }));
    console.log(
      "programTrim",
      programTrim,
      "trimScrap",
      trimScrap,
      "balancedCoilWeight",
      balancedCoilWeight
    );
    console.log("finalUpdatedRows", finalUpdatedRows);
    const finalTotalProgramWeight = finalUpdatedRows
      .reduce((acc, row) => acc + Number(row.weight), 0)
      .toFixed(2);
    if (balancedCoilWeight > 3) {
      const newSlittingProgram = {
        coil_rollNumber: formData.coil_rollNumber,
        weight: balancedCoilWeight,
        thickness: formData.thickness,
        width: formData.width,
        trimWidth: formData.trimWidth,
        programTrim: programTrim.toFixed(2),
        trimScrap: +trimScrap,
        createdBy: "Slitting Operator",
        slittingProgramStatus: "none",
        programStack: null,
        programWeight: finalTotalProgramWeight,
        rollsData: finalUpdatedRows
          .filter((row) => row.jobNumber && row.jobNumber !== "Extra")
          .map((row) => ({
            jobNumber: row.jobNumber || "Extra",
            drawingNumber: row.drawingNumber || "Extra",
            workOrder: row.workOrder || "Extra",
            rollTrim: row.rollTrim,
            width: row.width,
            thickness: row.thickness,
            length: row.length,
            weight: row.weight.toFixed(2),
            splitId: row.splitId,
            jobId: row.jobId,
            stack: null,
            isInitiatedFromShortlist: row.initiateFromShortlist,
            createdBy: "Slitting Operator",
          })),
      };
      return newSlittingProgram;
    }
    return null;
  };

  return {
    slittingList,
    loading,
    error,
    fetchSlittingData,
    pagination,
    addSlittingProgram,
    coilHold,
    partialCoilHold,
    generateQR,
    updateStatus,
    handleSlittingProgramDelete,
    updateSlitiingProgram,
    addMaximumStackSlittingProgram,
    availableFilters,
  };
};

export default useSlitting;
