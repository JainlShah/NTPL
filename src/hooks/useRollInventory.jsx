import { useState, useEffect } from "react";
import log from "../components/logger";
import { RollInventoryService } from "../services/rollInventoryServices";
import exportToExcel from "../util/export";
import { toast } from "react-hot-toast";

export const useRollInventory = (searchQuery, currPage, filters) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10,
    totalItems: 0,
  });
  const [availableFilters, setAvailableFilters] = useState([]);

  const fecthRollInventory = async () => {
    try {
      setLoading(true);
      setError(null);
      log.info("Fetching roll inventory data...");
      console.log(searchQuery, currPage, filters);
      const response = await RollInventoryService.getRollInventory({
        searchQuery,
        currPage,
        limit: pagination.itemsPerPage,
        filters,
      });
      console.log(response);
      if (
        response?.responseStatusList?.statusList &&
        response.responseStatusList.statusList[0]?.statusCode === 200
      ) {
        setData(response.responseObject.data);
        setPagination({
          currentPage: response.responseObject.pagination.currentPage,
          totalPages: response.responseObject.pagination.totalPages,
          itemsPerPage: response.responseObject.pagination.itemsPerPage,
          totalItems: response.responseObject.pagination.totalItems,
        });
        setAvailableFilters(response.responseObject.availableFilter);
      } else {
        log.error("Failed to fetch roll inventory data.");
        const statusDesc =
          response?.responseStatusList?.statusList[0]?.statusDesc ||
          response?.error ||
          "Unknown error";
        // toast.error(statusDesc);
        setError(statusDesc);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setLoading(true);
      setError(null);
      log.info("Exporting job orders...");
      const response = await RollInventoryService.exportRollInventory(
        searchQuery,
        currPage,
        filters,
        true
      );
      if (
        response?.responseStatusList?.statusList &&
        response.responseStatusList.statusList[0]?.statusCode === 200
      ) {
        log.info("Roll inventory exported successfully.");
        exportToExcel(response.responseObject.data, "Roll_Inventory Data");
      } else {
        log.error("Failed to export roll inventory.");
        const statusDesc =
          response?.responseStatusList?.statusList[0]?.statusDesc ||
          response?.error ||
          "Unknown error";
        // setError(statusDesc);
        toast.error(statusDesc);
      }
    } catch (error) {
      setError(error.message || "Failed to export roll inventory");
    } finally {
      setLoading(false);
    }
  };

  const addRolls = async (rollInventoryData) => {
    try {
      setLoading(true);
      setError(null);
      log.info("Adding Roll....");
      const response = await RollInventoryService.addRolls(rollInventoryData);
      if (
        response?.responseStatusList?.statusList &&
        response.responseStatusList.statusList[0]?.statusCode === 200
      ) {
        log.info("Roll is added successfully.");
        fecthRollInventory();
      } else {
        log.error("Failed to add Roll.");
        const statusDesc =
          response?.responseStatusList?.statusList[0]?.statusDesc ||
          response?.error ||
          "Unknown error";
        // setError(statusDesc);
        toast.error(statusDesc);
      }
    } catch (error) {
      setError(error.message || "Failed to add rolls");
    } finally {
      setLoading(false);
    }
  };

  const updateRollsStatus = async (rollInventoryData) => {
    try {
      setLoading(true);
      setError(null);
      log.info("Updating Roll....", rollInventoryData);
      const response = await RollInventoryService.updateRolls(
        rollInventoryData
      );
      console.log(" update roll response", response);
      if (
        response?.responseStatusList?.statusList &&
        response.responseStatusList.statusList[0]?.statusCode === 200
      ) {
        log.info("Roll Status is updated successfully.");
        toast.success("Roll Status is updated successfully.");
        fecthRollInventory();
      } else {
        log.error("Failed to update Roll.");
        const statusDesc =
          response?.responseStatusList?.statusList[0]?.statusDesc ||
          response?.error ||
          "Unknown error";
        // setError(statusDesc);
        toast.error(statusDesc);
      }
    } catch (error) {
      setError(error.message || "Failed to update rolls");
    } finally {
      setLoading(false);
    }
  };
  const moveRollToCutting = async (data) => {
    try {
      setLoading(true);
      setError(null);
      log.info("Moving to Cutting....", data);
      const response = await RollInventoryService.moveToCutting(data);
      if (
        response?.responseStatusList?.statusList &&
        response.responseStatusList.statusList[0]?.statusCode === 200
      ) {
        log.info("Roll is moved to Cutting successfully.");
        toast.success("Roll is moved to Cutting successfully.");
        fecthRollInventory();
      } else {
        log.error("Failed to move to Cutting.");
        const statusDesc =
          response?.responseStatusList?.statusList[0]?.statusDesc ||
          response?.error ||
          "Unknown error";
        toast.error(statusDesc);
      }
    } catch (error) {
      setError(error.message || "Failed to move to Cutting");
    } finally {
      setLoading(false);
    }
  };

  const unassignRoll = async (rollId) => {
    try {
      setLoading(true);
      setError(null);
      log.info("Unassigning roll with ID:", rollId);
      const response = await RollInventoryService.unassignRolls(rollId);
      console.log("Unassign roll response:", response);
      if (
        response?.responseStatusList?.statusList &&
        response?.responseStatusList?.statusList?.[0]?.statusCode === 200
      ) {
        log.info("Roll unassigned successfully.");
        toast.success("Roll unassigned successfully");
        fecthRollInventory();
      } else {
        log.error("Failed to unassign Roll.");
        const statusDesc =
          response?.responseStatusList?.statusList?.[0]?.statusDesc ||
          response?.error ||
          "Unknown error";
        toast.error(statusDesc || "Failed to unassign roll. Please try again.");
        return false;
      }
    } catch (error) {
      setError(error.message || "Failed to unassign roll");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPagination({ currentPage: currPage, totalPages: 1, itemsPerPage: 10 });
    fecthRollInventory();
  }, [searchQuery, currPage, filters]);

  return {
    data,
    loading,
    error,
    addRolls,
    updateRollsStatus,
    pagination,
    handleExport,
    moveRollToCutting,
    availableFilters,
    unassignRoll,
  };
};
export default useRollInventory;
