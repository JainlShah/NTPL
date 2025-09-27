import React, { useState, useEffect } from "react";
import log from "../components/logger";
import PackingService from "../services/PackingServices";

import { toast } from "react-hot-toast";

const usePacking = (searchQuery, currPage, filters, packingQr) => {
  const [packing, setPacking] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availableFilters, setAvailableFilters] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10,
    totalItems: 0,
  });

  const fetchPacking = async () => {
    try {
      setLoading(true);
      setError(null);
      log.info("Fetching packing data...");
      const response = await PackingService.getPackingList({
        searchQuery,
        currPage,
        limit: pagination?.itemsPerPage,
        filters,
      });
      if (
        response?.responseStatusList?.statusList &&
        response.responseStatusList.statusList[0]?.statusCode === 200
      ) {
        setPacking(response.responseObject.data);
        setPagination({
          currentPage: response.responseObject.pagination.currentPage,
          totalPages: response.responseObject.pagination.totalPages,
          itemsPerPage: response.responseObject.pagination.itemsPerPage,
          totalItems: response.responseObject.pagination.totalItems,
        });
        setAvailableFilters(response.responseObject.availableFilter);
        log.info("Pagination data:", pagination);
      } else {
        const statusDesc =
          response?.responseStatusList?.statusList[0]?.statusDesc ||
          response?.error ||
          "Unknown error";
        setError(statusDesc);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  const updatePacking = async (packingData) => {
    try {
      setLoading(true);
      setError(null);
      log.info("Updating packing data...", packingData);
      const response = await PackingService.updatePacking(packingData);
      log.info("Packing data updated successfully.", response);
      if (
        response?.responseStatusList?.statusList &&
        response.responseStatusList.statusList[0]?.statusCode === 200
      ) {
        toast.success("Packing data updated successfully.");
        fetchPacking();
        packingQr(response?.responseObject?.data);
      } else {
        const statusDesc =
          response?.responseStatusList?.statusList[0]?.statusDesc ||
          response?.error ||
          "Unknown error";
        // setError(statusDesc);
        toast.error(statusDesc);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    setPagination({
      currentPage: currPage,
      totalPages: 1,
      itemsPerPage: 10,
    });
    fetchPacking();
  }, [searchQuery, currPage, filters]);

  return {
    packing,
    loading,
    error,
    pagination,
    updatePacking,
    fetchPacking,
    availableFilters,
  };
};

export default usePacking;
