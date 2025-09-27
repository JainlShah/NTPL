import { PAGE_LIMIT } from "../config/apiConfig";
import { ShortList } from "../util/mock";
import apiClient from "./ApiService";

const ShortlistService = {
  getShortlist: async ({ searchQuery, currPage, limit, filters }) => {
    if (import.meta.env.VITE_NODE_MODE === "development") {
      return ShortList();
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
    const response = await apiClient.get(
      "/api/shortlist/getAllShortlistDetail/",
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
        data: {},
      }
    );
    return response;
  },
  addShortlist: async (data) => {
    if (import.meta.env.VITE_NODE_MODE === "development") {
      return;
    }
    const response = await apiClient.post(
      "api/shortlist/addShortlistDetail",
      data
    );
    return response;
  },

  deleteShortlist: async (id) => {
    const response = await apiClient.delete(`/shortlist/${id}`);
    return response;
  },

  updateShortlist: async (data) => {
    const response = await apiClient.put(
      "/api/shortlist/updateShortlistDetail",
      data
    );
    return response;
  },

  exportShortlist: async (searchQuery, filters, all) => {
    if (import.meta.env.VITE_NODE_MODE === "development") {
      return ShortList();
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
    const response = await apiClient.get(
      "api/shortlist/getAllShortlistDetail",
      {
        params: {
          searchTerm: searchQuery,
          ...formattedFilters,
          all: all,
        },
        headers: {
          "Content-Type": "application/json",
        },
        data: {},
      }
    );
    return response;
  },

  getAvailableRolls: async (width, thickness, weight) => {
    const response = await apiClient.get("/api/shortlist/getSelectedData", {
      params: {
        thickness: thickness,
        width: width,
        weight: weight,
        getDataFrom: "roll",
      },
      data: {},
    });
    return response;
  },

  assignRollToshortlist: async (body) => {
    const response = await apiClient.put(
      "/api/shortlist/assignShortlistDetail",
      body
    );
    return response;
  },
};
export default ShortlistService;
