import { useState, useEffect } from "react";
import CoilInventoryService from "../services/CoilInventoryServices";
import log from "../components/logger.jsx";
import exportToExcel from "../util/export.js";
import { toast } from "react-hot-toast";


const useCoilInventory = (searchQuery, currPage, filters, onAddSuccess) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentlyAddedCoil, setRecentlyAddedCoil] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10,
    totalItems: 0,
  });
  const [availableFilters, setAvailableFilters] = useState([]);
  const [checkCoilExistResponse, setCheckCoilExistResponse] = useState(null);

  const fetchData = async () => {
    try {
      // setLoading(true);
      // setError(null);
      log.info("Fetching coil inventory data...");
      const result = await CoilInventoryService.getCoilInventory({
        searchQuery,
        currPage,
        itemsPerPage: pagination.itemsPerPage,
        filters,
      });
      if (
        result?.responseStatusList?.statusList &&
        result.responseStatusList.statusList[0]?.statusCode === 200
      ) {
        log.info("Coil inventory data fetched successfully.");
        setData(result.responseObject.data);
        setPagination({
          currentPage: result.responseObject.pagination.currentPage,
          totalPages: result.responseObject.pagination.totalPages,
          itemsPerPage: result.responseObject.pagination.itemsPerPage,
          totalItems: result.responseObject.pagination.totalItems,
        });
        setAvailableFilters(result.responseObject.availableFilter);
        
        console.log("Filters:", availableFilters);
          log.info("Pagination data:", pagination);
      } else {
        const statusDesc =
          result?.responseStatusList?.statusList[0]?.statusDesc ||
          result?.error ||
          "Unknown error";
        setError(statusDesc);
      }
    } catch (err) {
      log.error("Failed to fetch data.", err);
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const addCoil = async (coilData) => {
    try {
      setLoading(true);
      setError(null);
      log.info("Adding coil data...", JSON.stringify(coilData));

      const response = await CoilInventoryService.addCoil(coilData);
      log.info("Coil added successfully.", response);

      if (
        response?.responseStatusList?.statusList &&
        response.responseStatusList.statusList[0]?.statusCode === 200
      ) {
        fetchData();
        log.info("Coil added successfully.");
        setRecentlyAddedCoil(response.responseObject.data.coilInventory);
        onAddSuccess(response.responseObject.data.coilInventory);
        toast.success("Coil added successfully");
      } else {
        log.error("Failed to add coil.");
        const statusDesc =
          response?.responseStatusList?.statusList[0]?.statusDesc ||
          response?.error ||
          "Unknown error";
        // setError(statusDesc);
        toast.error(statusDesc);
      }
    } catch (error) {
      setError(error.message || "Failed to add coil");
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };
  const updateCoil = async (coilData) => {
    try {
      setLoading(true);
      setError(null);
      log.info("Updating coil data...");
      const response = await CoilInventoryService.updateCoil(coilData);
      log.info("Coil updated successfully.", response);

      if (
        response?.responseStatusList?.statusList &&
        response.responseStatusList.statusList[0]?.statusCode === 200
      ) {
        log.info("Coil updated successfully.");
        toast.success("Coil updated successfully");
        fetchData();
      } else {
        log.error("Failed to update coil.");
        const statusDesc =
          response?.responseStatusList?.statusList[0]?.statusDesc ||
          response?.error ||
          "Unknown error";
        // setError(statusDesc);
        toast.error(statusDesc);
      }
    } catch (error) {
      toast.error("Failed to update coil.");
      setError(error.message || "Failed to update coil");
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCoil = async (data) => {
    try {
      setLoading(true);
      setError(null);
      log.info("Deleting coil data...", data.coilNumber);
      const response = await CoilInventoryService.deleteCoil(data.coilNumber);
      if (
        response?.responseStatusList?.statusList &&
        response.responseStatusList.statusList[0]?.statusCode === 200
      ) {
        log.info("Coil deleted successfully.");
        toast.success("Coil deleted sucessfully");
        fetchData();
      } else {
        log.error("Failed to delete coil.");
        const statusDesc =
          response?.responseStatusList?.statusList[0]?.statusDesc ||
          response?.error ||
          "Unknown error";
        // setError(statusDesc);
        toast.error(statusDesc);
      }
    } catch (error) {
      setError(error.message || "Failed to delete coil");
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setLoading(true);
      setError(null);
      log.info("Exporting coil data...");
      const response = await CoilInventoryService.exportCoilInventory( searchQuery,
        currPage,
        filters, true);
      if (
        response?.responseStatusList?.statusList &&
        response.responseStatusList.statusList[0]?.statusCode === 200
      ) {
        exportToExcel(response.responseObject.data, "coil_inventory");
        log.info("Coil data exported successfully.");
      } else {
        log.error("Failed to export coil data.");
        const statusDesc =
          response?.responseStatusList?.statusList[0]?.statusDesc ||
          response?.error ||
          "Unknown error";
        // setError(statusDesc);
        toast.error(statusDesc);
      }
    } catch (error) {
      setError(error.message || "Failed to export coil data");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckCoilExist = async (coilNumber) => {
    try {
      setLoading(true);
      setError(null);
      log.info("Checking if coil exists...");
      const response = await CoilInventoryService.checkCoilExist(coilNumber);
      if (
        response?.responseStatusList?.statusList &&
        response.responseStatusList.statusList[0]?.statusCode === 200
      ) {
        setCheckCoilExistResponse("Coil exists");
        log.info("Coil exists.");
      } else {
        setCheckCoilExistResponse("Coil does not exist");
        log.error("Failed to check if coil exists.");
        const statusDesc =
          response?.responseStatusList?.statusList[0]?.statusDesc ||
          response?.error ||
          "Unknown error";
        // setError(statusDesc);
        toast.error(statusDesc);
      }
    } catch (error) {
      if (error.responseStatusList.statusList[0].statusCode === 404) {
        setCheckCoilExistResponse("Coil does not exist");
      } else {
        setError(error.message || "Failed to check if coil exists");
        toast.error(error);
      }
    } finally {
      setLoading(false);
    }
  };
  const handleStatusUpdate = async (data) => {
    try {
      setLoading(true);
      setError(null);
      log.info("Updating coil status...");
      const response = await CoilInventoryService.updateCoil(data);
      if (
        response?.responseStatusList?.statusList &&
        response.responseStatusList.statusList[0]?.statusCode === 200
      ) {
        log.info("Coil status updated successfully.");
        toast.success("Coil status updated successfully");
        fetchData();
      } else {
        log.error("Failed to update coil status.");
        const statusDesc =
          response?.responseStatusList?.statusList[0]?.statusDesc ||
          response?.error ||
          "Unknown error";
        // setError(statusDesc);
        toast.error(statusDesc);
      }
    } catch (error) {
      setError(error.message || "Failed to update coil status");
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPagination({ currentPage: currPage, totalPages: 1, itemsPerPage: 10 });
    fetchData();
  }, [searchQuery, currPage, filters]);

  return {
    data,
    loading,
    error,
    addCoil,
    updateCoil,
    deleteCoil,
    recentlyAddedCoil,
    pagination,
    handleExport,
    handleCheckCoilExist,
    checkCoilExistResponse,
    handleStatusUpdate,
    availableFilters
  };
};

export default useCoilInventory;
