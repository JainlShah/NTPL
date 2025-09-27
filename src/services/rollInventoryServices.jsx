import { RollInventoryList } from "../util/mock";
import apiClient from "./ApiService";
import { PAGE_LIMIT } from "../config/apiConfig";
export const RollInventoryService = {
  getRollInventory: async ({ searchQuery, currPage, limit, filters }) => {
    console.log("getRollInventory", searchQuery, currPage, limit, filters);
    if (import.meta.env.VITE_NODE_MODE === "development") {
      return RollInventoryList();
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
      "/api/rollInventory/getAllRollDetail",
      {
        params: {
          searchTerm: searchQuery,
          ...formattedFilters,
          currentPage: currPage,
          itemsPerPage: PAGE_LIMIT,
        },
        data: {},
      }
    );
    return response;
  },
  addRolls: async (data) => {
    const response = await apiClient.post("/rollinventory", data);
    return response;
  },
  updateRolls: async (data) => {
    if (import.meta.env.VITE_NODE_MODE === "development") {
      return;
    }
    // const response = await apiClient.put(`/rollinventory/${id}`, data);
    const response = await apiClient.put(
      `/api/rollInventory/updateRollStatus/`,
      data
    );
    return response;
  },
  unassignRolls: async (data) => {
    if (import.meta.env.VITE_NODE_MODE === "development") {
      return;
    }
    const response = await apiClient.put(
      `/api/rollInventory/unassingRollDetail/`,
      { rollId: data }
    );
    return response;
  },
  deleteRollInventory: async (id) => {
    const response = await apiClient.delete(`/rollinventory/${id}`);
    return response;
  },
  exportRollInventory: async (searchQuery, currPage, filters, all) => {
    if (import.meta.env.VITE_NODE_MODE === "development") {
      return RollInventoryList();
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
      "/api/rollInventory/getAllRollDetail",
      {
        params: {
          searchTerm: searchQuery,
          ...formattedFilters,
          currentPage: currPage,
          itemsPerPage: PAGE_LIMIT,
          all: all,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  },
  moveToCutting: async (data) => {
    if (import.meta.env.VITE_NODE_MODE === "development") {
      return;
    }
    const response = await apiClient.put(
      `/api/rollInventory/assignRollDetail`,
      data
    );
    return response;
  },
};
