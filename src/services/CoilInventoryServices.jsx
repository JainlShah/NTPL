import apiClient from "./ApiService";
import mockData from "../util/coilMock.json";
import { AddedCoil, coilInfo, coilInventoryList } from "../util/mock";
import { PAGE_LIMIT } from "../config/apiConfig";

const CoilInventoryServices = {
  getCoilInventory: async ({
    searchQuery,
    currPage,
    itemsPerPage,
    filters,
  }) => {
    console.log(
      "getcoilinventory",
      searchQuery,
      currPage,
      itemsPerPage,
      filters
    );

    // Reformat filters to the desired structure
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

    if (import.meta.env.VITE_NODE_MODE === "development") {
      // Use mock data during development
      return coilInventoryList();
    }

    const response = await apiClient.get(
      "/api/coilInventory/getAllCoilDetail",
      {
        params: {
          searchTerm: searchQuery,
          ...formattedFilters, // Spread the formatted filters into the params
          currentPage: currPage,
          itemsPerPage: PAGE_LIMIT,
        },
        headers: {
          "Content-Type": "application/json",
        },
        data: {},
      }
    );
    return response;
  },

  addCoil: async (coilData) => {
    console.log("addcoil", coilData);
    if (import.meta.env.VITE_NODE_MODE === "development") {
      // Use mock data during development
      return AddedCoil();
    }
    for (let pair of coilData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }
    const response = await apiClient.post(
      "/api/coilInventory/addCoilDetail",
      coilData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Specify the content type for multipart
        },
      }
    );
    return response;
  },

  updateCoil: async (coilData) => {
    if (import.meta.env.VITE_NODE_MODE === "development") {
      // Use mock data during development
      return AddedCoil();
    }
    const response = await apiClient.put(
      "/api/coilInventory/updateCoilDetail",
      coilData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Specify the content type for multipart
        },
      }
    );
    return response;
  },

  deleteCoil: async (coilNumber) => {
    if (import.meta.env.VITE_NODE_MODE === "development") {
      // Use mock data during development
      return coilInventoryList();
    }
    const response = await apiClient.delete(
      `/api/coilInventory/deleteCoilDetail/`,
      {
        params: {
          coilNumber: coilNumber,
        },
      }
    );
    return response;
  },

  exportCoilInventory: async (searchQuery, currPage, filters, all) => {
    if (import.meta.env.VITE_NODE_MODE === "development") {
      // Use mock data during development
      return mockData;
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
      "/api/coilInventory/getAllCoilDetail",
      {
        params: {
          searchTerm: searchQuery,
          ...formattedFilters, // Spread the formatted filters into the params
          currentPage: currPage,
          itemsPerPage: PAGE_LIMIT,
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

  checkCoilExist: async (coilNumber) => {
    if (import.meta.env.VITE_NODE_MODE === "development") {
      // Use mock data during development
      return;
    }
    const response = await apiClient.get(
      `/api/coilInventory/isExist/${coilNumber}`,
      {
        data: {},
      }
    );
    return response;
  },
  getCoilInfo: async (coil_rollNumber) => {
    if (import.meta.env.VITE_NODE_MODE === "development") {
      // Use mock data during development
      const response = coilInfo();
      return response;
    }
    const response = await apiClient.get(`/api/coilInventory/getCoilDetail/`, {
      params: {
        coil_rollNumber: coil_rollNumber,
      },
      data: {},
    });
    return response;
  },
  fetchJobNumbersByThicknessAndWidth: async (thickness, width, weight) => {
    if (import.meta.env.VITE_NODE_MODE === "development") {
      // Use mock data during development
      return coilInventoryList();
    }
    const response = await apiClient.get(`/api/shortlist/getSelectedData`, {
      params: {
        thickness: thickness,
        width: width,
        weight: weight,
        getDataFrom: "job",
      },
      data: {},
    });
    return response;
  },
};

export default CoilInventoryServices;
