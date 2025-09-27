import { PAGE_LIMIT } from "../config/apiConfig";
import { addScrap, ScrapList } from "../util/mock";
import apiClient from "./ApiService";

const ScrapService = {
  getScrap: async ({ searchQuery, currPage, limit, filters, by }) => {

    if (import.meta.env.VITE_NODE_MODE === "development") {
      return ScrapList();
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
    const response = await apiClient.get("/api/scrap/getAllScrapDetail", {
      params: {
        searchTerm: searchQuery,
        currentPage: currPage,
        itemsPerPage: PAGE_LIMIT,
        ...formattedFilters,
        scrapBy:by
      }
    });
    return response;
  },
  addScrap: async (scrapData) => {
    // if (import.meta.env.VITE_NODE_MODE === "development") {
    // return;
    // }

    const response = await apiClient.post(
      "/api/scrap/addScrapDetail",
      scrapData
    );
    return response;
  },

  updateScrap: async (id, scrapData) => {
    const response = await apiClient.put(`/scrap/${id}`, scrapData);
    return response;
  },

  exportScrap: async () => {
    // if (import.meta.env.VITE_NODE_MODE === "development") {
    return ScrapList();
    // }
    // const response = await apiClient.get("/scrap/export");
    // return response;
  },
  moveScrap: async (data) => {
    // if (import.meta.env.VITE_NODE_MODE === "development") {
    // return addScrap;
    // }
    const response = await apiClient.put("api/scrap/moveScrapDetail", data);
    return response;
  },
};

export default ScrapService;
