import React, { useState, useEffect } from "react";
import log from "../components/logger.jsx";
import ScrapService from "../services/ScrapService.jsx";
import exportToExcel from "../util/export.js";
import { toast } from "react-hot-toast";

const useScrap = (searchQuery, currPage, filters, by) => {
  const [scrapList, setScrapList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10,
    totalItems: 0,
  });
  const [availableFilters, setAvailableFilters] = useState([]);
  const fetchScrap = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await ScrapService.getScrap({
        searchQuery,
        currPage,
        limit: pagination.itemsPerPage,
        filters,
        by
      });
      log.info(response);
      if (
        response?.responseStatusList?.statusList &&
        response.responseStatusList.statusList[0]?.statusCode === 200
      ) {
        setScrapList(response.responseObject.data);
        setPagination({
          currentPage: response.responseObject.pagination.currentPage,
          totalPages: response.responseObject.pagination.totalPages,
          itemsPerPage: response.responseObject.pagination.itemsPerPage,
          totalItems: response.responseObject.pagination.totalItems,
        });
        setAvailableFilters(response.responseObject.availableFilter);

        if (by === "thickness") {
          const getByThickness = formatByThickness(response.responseObject.data);
          console.log("getByThickness", getByThickness);
          setScrapList(getByThickness);
        }
        if (by === "scrapType") {
          const getByScrapType = formatByScrapType(response.responseObject.data);
          console.log("getByScrapType", getByScrapType);
          setScrapList(getByScrapType);
        }
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

  const moveScrap = async (data) => {
    try {
      setLoading(true);
      setError(null);
      log.info("Moving scrap...", data);

      const response = await ScrapService.moveScrap(data);
      log.info(response);

      const statusList = response?.responseStatusList?.statusList || [];
      const firstStatus = statusList[0] || {};

      if (firstStatus.statusCode === 200) {
        log.info("Scrap moved successfully.");

        // Ensure correct key is used
        const status = String(data.moveTo || "")
          .trim()
          .toLowerCase();
        log.info("Scrap status received:", status);

        if (status === "dispatch") {
          toast.success("Scrap dispatched successfully.");
        } else if (status === "scrapyard") {
          log.info("ℹ️ Scrap status is not 'dispatch', using default message.");
          toast.success("Scrap moved to scrap yard successfully.");
        } else {
          toast.success("Scrap moved successfully.");
        }

        fetchScrap();
      } else {
        toast.error("Failed to move scrap.");
        const statusDesc =
          firstStatus.statusDesc || response?.error || "Unknown error";
        toast.error(statusDesc);
      }
    } catch (error) {
      log.error("Error moving scrap:", error);
      setError(error.message);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setLoading(true);
      setError(null);
      log.info("Exporting scrap data...");
      const response = await ScrapService.exportScrap();
      if (
        response?.responseStatusList?.statusList &&
        response.responseStatusList.statusList[0]?.statusCode === 200
      ) {
        exportToExcel(response.responseObject.data.details, "scrap_inventory");
        log.info("Scrap data exported successfully.");
      } else {
        log.error("Failed to export scrap data.");
        const statusDesc =
          response?.responseStatusList?.statusList[0]?.statusDesc ||
          response?.error ||
          "Unknown error";
        // setError(statusDesc);
        toast.error(statusDesc);
      }
    } catch (error) {
      setError(error.message || "Failed to export scrap data");
    } finally {
      setLoading(false);
    }
  };

  const addScraps = async (data) => {
    try {
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      setLoading(true);
      await delay(2000);
      setError(null);
      log.info("Adding scrap...", data);

      const response = await ScrapService.addScrap(data);

      if (
        response?.responseStatusList?.statusList &&
        response.responseStatusList.statusList[0]?.statusCode === 200
      ) {
        toast.success("Scrap added successfully.");
      } else {
        log.error("Failed to add scrap.");
        const statusDesc =
          response?.responseStatusList?.statusList[0]?.statusDesc ||
          response?.error ||
          "Unknown error";
        setError(statusDesc);
        toast.error(response?.error);
      }
    } catch (error) {
      setError(error.message || "Failed to add scrap");
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatByThickness = (data) => {
    const allScraps = Object.values(data).flat();

    // Step 1: Initialize the grouped object with all required thicknesses
    const groupedByThickness = {
      0.20: { thickness: 0.20, weight: 0, items: [] },
      0.23: { thickness: 0.23, weight: 0, items: [] },
      0.25: { thickness: 0.25, weight: 0, items: [] },
      0.27: { thickness: 0.27, weight: 0, items: [] },
      0.30: { thickness: 0.30, weight: 0, items: [] },
    };

    // Step 2: Group by thickness and calculate total weight
    allScraps.forEach((scrap) => {
      const { thickness, weight } = scrap;

      // Check if the thickness exists in the grouped object
      if (groupedByThickness[thickness]) {
        groupedByThickness[thickness].weight += weight;
        groupedByThickness[thickness].items.push(scrap);
      }
    });

    // Step 3: Convert the grouped object into an array
    return Object.values(groupedByThickness);
  };
  const formatByScrapType = (data) => {
    const allScraps = Object.values(data).flat();

    // Step 1: Initialize the grouped object with all required scrap types
    const groupedByScrapType = {
      startRoll: { scrapType: "startRoll", totalWeight: 0, items: [] },
      endRoll: { scrapType: "endRoll", totalWeight: 0, items: [] },
      triangle: { scrapType: "triangle", totalWeight: 0, items: [] },
      punch: { scrapType: "punch", totalWeight: 0, items: [] },
      extra: { scrapType: "extra", totalWeight: 0, items: [] },
      trim: { scrapType: "trim", totalWeight: 0, items: [] },
      other: { scrapType: "other", totalWeight: 0, items: [] },
    };

    // Step 2: Group by scrap type and calculate total weight
    allScraps.forEach((scrap) => {
      const { scrapType, weight } = scrap;

      // Check if the scrap type exists in the grouped object
      if (groupedByScrapType[scrapType]) {
        groupedByScrapType[scrapType].totalWeight += weight;
        groupedByScrapType[scrapType].items.push(scrap);
      }
    });

    // Step 3: Convert the grouped object into an array
    return Object.values(groupedByScrapType);
  };

  useEffect(() => {
    fetchScrap();
    console.log(by)
  }, [searchQuery, currPage, filters, by]);

  return {
    scrapList,
    loading,
    error,
    moveScrap,
    addScraps,
    pagination,
    handleExport,
    availableFilters
  };
};

export default useScrap;
