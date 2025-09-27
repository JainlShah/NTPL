import { useState, useEffect } from "react";
import apiClient from "../services/ApiService";
import log from "../components/logger";
import { JobOrderService } from "../services/jobOrderService";
import exportToExcel from "../util/export";
import {toast} from "react-hot-toast";

export const useJobOrder = (searchQuery, currPage, filters) => {
  const [data, setdata] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10,
    totalItems: 0,
  });
  const [availableFilters, setAvailableFilters] = useState([]);
  const fetchJobOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      log.info("Fetching job orders...");
      const response = await JobOrderService.getJobOrders({
        searchQuery,
        currPage,
        limit: pagination.itemsPerPage,
        filters,
      });
      log.info("Job details", response);
      if (
        response?.responseStatusList?.statusList &&
        response.responseStatusList.statusList[0]?.statusCode === 200
      )  {
        setdata(response.responseObject.data);
        setPagination({
          currentPage: response.responseObject.pagination.currentPage,
          totalPages: response.responseObject.pagination.totalPages,
          itemsPerPage: response.responseObject.pagination.itemsPerPage,
          totalItems: response.responseObject.pagination.totalItems,
        });
        setAvailableFilters(response.responseObject.availableFilter);
      } else {
        const statusDesc = response?.responseStatusList?.statusList[0]?.statusDesc || response?.error || "Unknown error";
        setError(statusDesc);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const addJobOrder = async (jobOrderData) => {
    try {
      setLoading(true);
      setError(null);
      log.info("Adding job order...");
      const response = await JobOrderService.addJobOrder(jobOrderData);
      
      if (
        response?.responseStatusList?.statusList &&
        response.responseStatusList.statusList[0]?.statusCode === 200
      ) {
        log.info("Job order added successfully.");
        toast.success("Job order added successfully");
        fetchJobOrders();
      } else {
        log.error("Failed to add job order.");
        const statusDesc = response?.responseStatusList?.statusList[0]?.statusDesc || response?.error || "Unknown error";
        // setError(statusDesc);
        toast.error(response?.error);
      }
    } catch (error) {
      setError(error.message || "Failed to add job order");
    } finally {
      setLoading(false);
    }
  };
  const updateJobOrder = async (jobOrderData) => {
    try {
      setLoading(true);
      setError(null);
      log.info("Updating job order...", jobOrderData);
      const response = await JobOrderService.updateJobOrder(jobOrderData);
      if (
        response?.responseStatusList?.statusList &&
        response.responseStatusList.statusList[0]?.statusCode === 200
      ) {
        log.info("Job order updated successfully.");
        toast.success("Job order updated successfully");
        fetchJobOrders();
      } else {
        log.error("Failed to update job order.");
        const statusDesc = response?.responseStatusList?.statusList[0]?.statusDesc || response?.error || "Unknown error";
        // setError(statusDesc);
        toast.error(statusDesc);
      }
    } catch (error) {
      setError(error.message || "Failed to update job order");
      toast.error("Failed to update job order");
    } finally {
      setLoading(false);
    }
  };
  const deleteJobOrder = async (jobNo) => {
    try {
      setLoading(true);
      setError(null);
      log.info("Deleting job order...");
      const response = await JobOrderService.deleteJobOrder(jobNo);
      if (
        response?.responseStatusList?.statusList &&
        response.responseStatusList.statusList[0]?.statusCode === 200
      ) {
        toast.success("Job order deleted successfully");
        log.info("Job order deleted successfully.");
        fetchJobOrders();
      } else {
        log.error("Failed to delete job order.");
        const statusDesc = response?.responseStatusList?.statusList[0]?.statusDesc || response?.error || "Unknown error";
        toast.error(statusDesc);
        // setError(statusDesc);
      }
    } catch (error) {
      setError(error.message || "Failed to delete job order");
    } finally {
      setLoading(false);
    }
  };
  const handleExport = async () => {
    try {
      setLoading(true);
      setError(null);
      log.info("Exporting job orders...");
      const response = await JobOrderService.exportJobOrders();
      if (
        response?.responseStatusList?.statusList &&
        response.responseStatusList.statusList[0]?.statusCode === 200
      ) {
        log.info("Job orders exported successfully.");
        exportToExcel(response.responseObject.data, "job_orders");
      } else {
        log.error("Failed to export job orders.");
        const statusDesc = response?.responseStatusList?.statusList[0]?.statusDesc || response?.error || "Unknown error";
        toast.error(statusDesc);
        // setError(statusDesc);
      }
    } catch (error) {
      setError(error.message || "Failed to export job orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPagination({ currentPage: currPage, totalPages: 1, itemsPerPage: 10 });
    fetchJobOrders();
  }, [searchQuery, currPage, filters]);

  return {
    data,
    loading,
    error,
    addJobOrder,
    updateJobOrder,
    pagination,
    deleteJobOrder,
    handleExport,
    availableFilters
  };
};
export default useJobOrder;
