import { PAGE_LIMIT } from "../config/apiConfig";
import { JobOrderList } from "../util/mock";
import apiClient from "./ApiService";
export const JobOrderService = {
  getJobOrders: async ({ searchQuery, currPage, limit, filters }) => {
    if (import.meta.env.VITE_NODE_MODE === "development") {
      return JobOrderList();
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
    const response = await apiClient.get("/api/joborder/getAllJobDetail", {
      params: {
        searchTerm: searchQuery,
        currentPage: currPage,
        itemsPerPage: PAGE_LIMIT,
        ...formattedFilters,
      },
      data: {},
    });
    return response;
  },
  addJobOrder: async (data) => {
    if (import.meta.env.VITE_NODE_MODE === "development") {
      return JobOrderList();
    }

    // Convert fields to numbers where necessary
    const formattedData = {
      ...data,
      sets: Number(data.sets),
      // isPacked: false,
      jobAttributes: data.jobAttributes.map((attr) => ({
        ...attr,
        width: Number(attr.width),
        trimmingWeight: Number(attr.trimmingWeight),
        processWeight: Number(attr.processWeight),
        thickness: Number(attr.thickness),
      })),
    };  

    const response = await apiClient.post(
      "/api/joborder/addJobDetail",
      formattedData,
      {
        data: {},
      }
    );
    return response;
  },

  updateJobOrder: async (data) => {
    if (import.meta.env.VITE_NODE_MODE === "development") {
      return;
    }
    const formattedData = {
      ...data,
      sets: Number(data.sets),
      // isPacked: false,
      jobAttributes: data.jobAttributes.map((attr) => ({
        ...attr,
        width: Number(attr.width),
        trimmingWeight: Number(attr.trimmingWeight),
        processWeight: Number(attr.processWeight),
        thickness: Number(attr.thickness),
      })),
    };

    const response = await apiClient.put(
      `/api/joborder/updateJobDetail`,
      formattedData
    );
    return response;
  },
  deleteJobOrder: async (jobNo) => {
    if (import.meta.env.VITE_NODE_MODE === "development") {
      return;
    }
    const response = await apiClient.delete(`/api/joborder/deleteJobDetail/`, {
      params: {
        jobNumber: jobNo,
      },
    });
    return response;
  },
  exportJobOrders: async () => {
    if (import.meta.env.VITE_NODE_MODE === "development") {
      // Use mock data during development
      return JobOrderList();
    }

    const response = await apiClient.get("/api/joborder/getAllJobDetail");
    return response;
  },
  getUnOccupiedJobOrders: async (thickness) => {
    if (import.meta.env.VITE_NODE_MODE === "development") {
      // Use mock data during development
      return JobOrderList();
    }
    const response = await apiClient.get("/api/joborder/getUnoccupiedData", {
      params: {
        thickness: thickness,
      },
      data: {},
    });
    return response;
  },
};
