import { PAGE_LIMIT } from "../config/apiConfig";
import { plannedSlitting } from "../util/mock";
import apiClient from "./ApiService";
export const PlannedSlittingService = {
  getPlannedSlitting: async ({ searchQuery, currPage, limit, filters }) => {
    if (import.meta.env.VITE_NODE_MODE === "development") {
      return plannedSlitting();
    }
    const formattedFilters = {};
    Object.entries(filters).forEach(([key, values]) => {
      if (values && values.length > 0) { // ChFeck if values are not empty or null
        if (Array.isArray(values)) {
          formattedFilters[key] = values.join(","); // Combine multiple values with a separator if needed
        } else {
          formattedFilters[key] = values; // Single value
        }
      }
    });
    const response = await apiClient.get(
      "/api/plannedslitting/getAllPlannedSlittingDetail",
      {
        params: {
          searchTerm: searchQuery,
          currentPage: currPage,
          itemsPerPage: PAGE_LIMIT,
          ...formattedFilters,
        },
        headers: {
          "Content-Type": "application/json",
        },
        data: {}
      }
    );
    return response;
  },
  exportPlannedSlitting: async () => {
    if (import.meta.env.VITE_NODE_MODE === "development") {
      return plannedSlitting();
    }
    const response = await apiClient.get("/plannedslitting/export");
    return response;
  },
};
