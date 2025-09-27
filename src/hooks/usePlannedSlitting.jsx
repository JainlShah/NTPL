import { useState, useEffect } from "react";
import log from "../components/logger";
import { PlannedSlittingService } from "../services/PlannedSlittingServices";
import exportToExcel from "../util/export";

const usePlannedSlitting = (searchQuery, currPage, filters) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availableFilters, setAvailableFilters] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1, 
    totalPages: 1,
    itemsPerPage: 10,
    totalItems: 0,
  });

  const fetchPlannedSlitting = async () => {
    try {
      setLoading(true);
      setError(null);
      log.info("Fetching planned slitting data...", searchQuery, currPage);
      const response = await PlannedSlittingService.getPlannedSlitting({
        searchQuery,
        currPage,
        limit: pagination.itemsPerPage,
        filters,
      });

      // Debugging the response
      log.info("Planned slitting data fetched successfully.", response);

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
        const statusDesc = response?.responseStatusList?.statusList[0]?.statusDesc || response?.error || "Unknown error";
        log.error("Failed to fetch planned slitting data:", statusDesc);
        setError(statusDesc);
      }
    } catch (err) {
      log.error("Error fetching planned slitting data:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleExport = async () => {
    try {
      setLoading(true);
      setError(null);
      log.info("Exporting planned slitting data...");
      const response = await PlannedSlittingService.exportPlannedSlitting();
      if (
        response?.responseStatusList?.statusList &&
        response.responseStatusList.statusList[0]?.statusCode === 200
      ) {
        log.info("planned slitting exported successfully.");
        exportToExcel(response.responseObject.data, "planned_slitting_data");
      } else {
        log.error("Failed to export planned slitting.");
        const statusDesc = response?.responseStatusList?.statusList[0]?.statusDesc || response?.error || "Unknown error";
        setError(statusDesc);
      }
    } catch (error) {
      setError(error.message || "Failed to export planned slitting");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPagination({
      currentPage: currPage,
      totalPages: 1,
      itemsPerPage: 10,
    });
    fetchPlannedSlitting();
  }, [searchQuery, currPage, filters]);

  return { data, loading, error, pagination, handleExport, availableFilters };
};

export default usePlannedSlitting;
