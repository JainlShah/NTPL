import { useState, useEffect } from "react";
import log from "../components/logger";
import apiClient from "../services/ApiService";
import exportToExcel from "../util/export";
import { RollReadyCuttingService } from "../services/RollReadyCuttingServices";
import toast from "react-hot-toast";

export const useRollsReadyCutting = (
  searchQuery,
  currPage,
  filters,
  onBalancedRoll
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: currPage || 1,
    totalPages: 1,
    itemsPerPage: 10,
    totalItems: 0,
  });
  const [availableFilters, setAvailableFilters] = useState([]);

  const fetchRollsReadyCutting = async () => {
    try {
      setLoading(true);
      setError(null);

      log.info(
        "Fetching rolls ready cutting data...",
        searchQuery,
        currPage,
        filters
      );

      const response = await RollReadyCuttingService.getRollsReadyCutting({
        searchQuery,
        currPage: currPage,
        limit: pagination.itemsPerPage,
        filters,
      });
      console.log(response);

      if (response?.responseStatusList?.statusList?.[0]?.statusCode === 200) {
        setData(response.responseObject.data);
        setPagination({
          currentPage: response.responseObject.pagination.currentPage,
          totalPages: response.responseObject.pagination.totalPages,
          itemsPerPage: response.responseObject.pagination.itemsPerPage,
          totalItems: response.responseObject.pagination.totalItems,
        });
        setAvailableFilters(response.responseObject.availableFilter);
      } else {
        const statusDesc =
          response?.responseStatusList?.statusList?.[0]?.statusDesc ||
          response?.error ||
          "Unknown error";
        setError(statusDesc);
      }
    } catch (error) {
      log.error("Error fetching rolls ready cutting data:", error);
      setError(error.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const updateRollsReadyCutting = async (roll) => {
    try {
      setLoading(true);
      setError(null);

      log.info("Updating rolls ready cutting data...", roll);

      const response = await RollReadyCuttingService.updateRollReadyCutting(
        roll
      );

      if (response?.responseStatusList?.statusList?.[0]?.statusCode === 200) {
        toast.success("Roll is ready for packing.");
        const balancedRoll = response.responseObject.data.balancedRoll;
        if (
          balancedRoll !== null &&
          balancedRoll !== undefined &&
          balancedRoll.weight > 0
        ) {
          onBalancedRoll && onBalancedRoll(balancedRoll);
        }
        fetchRollsReadyCutting();
      } else {
        const statusDesc =
          response?.responseStatusList?.statusList?.[0]?.statusDesc ||
          response?.error ||
          "Unknown error";
        // setError(statusDesc);
        toast.error(statusDesc);
      }
    } catch (error) {
      log.error("Error updating rolls ready cutting data:", error);
      setError(error.message || "Failed to update data");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setLoading(true);
      setError(null);

      log.info("Exporting rolls ready cutting data...");

      const response = await RollReadyCuttingService.exportRollsReadyCutting(
        searchQuery,
        // currPage,
        filters,
        true
      );

      if (response?.responseStatusList?.statusList?.[0]?.statusCode === 200) {
        exportToExcel(response.responseObject.data, "RollsReadyCutting");
      } else {
        const statusDesc =
          response?.responseStatusList?.statusList?.[0]?.statusDesc ||
          response?.error ||
          "Unknown error";
        // setError(statusDesc);
        toast.error(statusDesc);
      }
    } catch (error) {
      log.error("Error exporting rolls ready cutting data:", error);
      setError(error.message || "Failed to export data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      currentPage: currPage || 1,
    }));
    fetchRollsReadyCutting();
  }, [searchQuery, currPage, filters]);

  return {
    loading,
    error,
    data,
    pagination,
    handleExport,
    updateRollsReadyCutting,
    availableFilters,
  };
};

export default useRollsReadyCutting;
