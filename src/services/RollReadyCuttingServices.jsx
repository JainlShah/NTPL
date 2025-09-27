import { all } from "axios";
import { PAGE_LIMIT } from "../config/apiConfig";
import { rollsReadyCutting, updateRollsReadyCutting } from "../util/mock";
import { CuttingProductionResponse } from "../util/productionMock";

import apiClient from "./ApiService";
export const RollReadyCuttingService = {
  getRollsReadyCutting: async ({ searchQuery, currPage, limit, filters }) => {
    if (import.meta.env.VITE_NODE_MODE === "development") {
      return CuttingProductionResponse();
    }
    const formattedFilters = {};
    Object.entries(filters).forEach(([key, values]) => {
      if (values && values.length > 0) {
        // ChFeck if values are not empty or null
        if (Array.isArray(values)) {
          formattedFilters[key] = values.join(","); // Combine multiple values with a separator if needed
        } else {
          formattedFilters[key] = values; // Single value
        }
      }
    });
    const response = await apiClient.get("/api/cutting/getAllRolls/", {
      params: {
        searchTerm: searchQuery,
        currentPage: currPage,
        itemsPerPage: PAGE_LIMIT,
        ...formattedFilters,
      },
    });
    return response;
  },

  updateRollReadyCutting: async (data) => {
    if (import.meta.env.VITE_NODE_MODE === "development") {
      return updateRollsReadyCutting();
    }
    const response = await apiClient.put(
      `/api/cutting/updateCuttingProcess`,
      data
    );
    return response;
  },

  exportRollsReadyCutting: async (searchQuery, filters, all) => {
    if (import.meta.env.VITE_NODE_MODE === "development") {
      return rollsReadyCutting();
    }
    const formattedFilters = {};
    Object.entries(filters).forEach(([key, values]) => {
      if (values && values.length > 0) {
        // ChFeck if values are not empty or null
        if (Array.isArray(values)) {
          formattedFilters[key] = values.join(","); // Combine multiple values with a separator if needed
        } else {
          formattedFilters[key] = values; // Single value
        }
      }
    });

    const response = await apiClient.get("/api/cutting/getAllRolls/", {
      params: {
        searchTerm: searchQuery,
        // currentPage: currPage,
        // itemsPerPage: PAGE_LIMIT,
        ...formattedFilters,
        all: all,
      },
    });
    return response;
  },
};
