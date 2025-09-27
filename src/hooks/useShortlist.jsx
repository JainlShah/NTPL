import { useState, useEffect } from "react";
import ShortlistService from "../services/ShortlistService";
import log from "../components/logger";
import exportToExcel from "../util/export";
import { toast } from "react-hot-toast";

const useShortlist = (searchQuery, currPage, filters) => {
  const [shortlist, setShortlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10,
    totalItems: 0,
  });
  const [availableFilters, setAvailableFilters] = useState([]);

  const fetchShortlist = async () => {
    try {
      log.info("Fetching shortlist data...");
      setLoading(true);
      setError(null);
      // Fetch shortlist data from API
      const response = await ShortlistService.getShortlist({
        searchQuery,
        currPage,
        limit: pagination.itemsPerPage,
        filters,
      });
      console.log("sadc" + response);
      if (
        response?.responseStatusList?.statusList &&
        response.responseStatusList.statusList[0]?.statusCode === 200
      ) {
        setShortlist(response.responseObject.data);
        console.log(JSON.stringify(response.responseObject.data));
        setPagination({
          currentPage: response.responseObject.pagination.currentPage,
          totalPages: response.responseObject.pagination.totalPages,
          itemsPerPage: response.responseObject.pagination.itemsPerPage,
          totalItems: response.responseObject.pagination.totalItems,
        });
        setAvailableFilters(response.responseObject.availableFilter);
      } else {
        const statusDesc =
          response?.responseStatusList?.statusList[0]?.statusDesc ||
          response?.error ||
          "Unknown error";
        setError(statusDesc);
      }
    } catch (error) {
      log.error("Error while fetching shortlist data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  const addShortlist = async (shortlistData) => {
    try {
      setLoading(true);
      setError(null);
      log.info("adding shortlist data...");
      const response = await ShortlistService.addShortlist(shortlistData);
      if (
        response?.responseStatusList?.statusList &&
        response.responseStatusList.statusList[0]?.statusCode === 200
      ) {
        log.info("data adding in shortlist successfully");
        toast.success("Shortlist initiated successfully");
        // fetchData();
      } else {
        log.error("Failed to initiate shortlist");
        const statusDesc =
          response?.responseStatusList?.statusList[0]?.statusDesc ||
          response?.error ||
          "Unknown error";
        // setError(statusDesc);
        toast.error(statusDesc);
      }
    } catch (error) {
      setError(error.message || "Failed to initiate shortlist");
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromShortlist = (item) => {
    setShortlist((prevShortlist) => prevShortlist.filter((i) => i !== item));
  };

  const handleExport = async () => {
    try {
      setLoading(true);
      setError(null);
      log.info("Exporting shortlist data...");
      const response = await ShortlistService.exportShortlist(
        searchQuery,
        // currPage,
        filters,
        true
      );
      if (
        response?.responseStatusList?.statusList &&
        response.responseStatusList.statusList[0]?.statusCode === 200
      ) {
        exportToExcel(response.responseObject.data, "shortlist");
        log.info("Shortlist data exported successfully.");
      } else {
        log.error("Failed to export shortlist data.");
        const statusDesc =
          response?.responseStatusList?.statusList[0]?.statusDesc ||
          response?.error ||
          "Unknown error";
        // setError(statusDesc);
        toast.error(statusDesc);
      }
    } catch (error) {
      setError(error.message || "Failed to export shortlist data");
    } finally {
      setLoading(false);
    }
  };
  const assignToRoll = async (shortlistData) => {
    try {
      setLoading(true);
      setError(null);
      log.info("adding shortlist data...");
      const response = await ShortlistService.assignRollToshortlist(
        shortlistData
      );
      if (
        response?.responseStatusList?.statusList &&
        response.responseStatusList.statusList[0]?.statusCode === 200
      ) {
        log.info("data adding in shortlist successfully");
        toast.success("Roll assigned successfully");
        fetchShortlist();
      } else {
        log.error("Failed to initiate shortlist");
        const statusDesc =
          response?.responseStatusList?.statusList[0]?.statusDesc ||
          response?.error ||
          "Unknown error";
        // setError(statusDesc);
        toast.error(statusDesc);
      }
    } catch (error) {
      setError(error.message || "Failed to initiate shortlist");
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch shortlist data from API
    fetchShortlist();
  }, [searchQuery, currPage, filters]);

  return {
    loading,
    error,
    shortlist,
    pagination,
    handleExport,
    addShortlist,
    assignToRoll,
    availableFilters,
  };
};

export default useShortlist;
