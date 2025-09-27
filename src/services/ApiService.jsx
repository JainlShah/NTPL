// src/services/apiService.js
import axios from "axios";
import { API_BASE_URL, getHeaders } from "../config/apiConfig";

// Centralized API function
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptors to attach headers and handle errors globally
apiClient.interceptors.request.use(
  (config) => {
    config.headers = {
      ...config.headers,
      ...getHeaders(),
    };
    console.log("Final Headers:", config.headers); // Log the headers
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error("API Error:", error);
    if (error.response?.data?.responseStatusList?.statusList?.[0]) {
      return {
        error: error.response.data.responseStatusList.statusList[0].statusDesc,
      };
    }
    if (error.response) {
      // Handle specific HTTP status codes from the server
      switch (error.response.status) {
        case 400:
          return { error: "Bad request. Please check your data." };
        case 401:
          return { error: "Unauthorized. Please log in again." };
        case 403:
          return { error: "Forbidden access." };
        case 404:
          return {
            error: "Resource not found or API endpoint does not exist.",
          };
        case 500:
          return { error: "Internal server error. Please try again later." };
        default:
          return { error: "Something went wrong. Please try again later." };
      }
    } else if (error.request) {
      if (error.code === "ECONNABORTED") {
        return { error: "The request took too long. Please try again later." };
      }
      return {
        error:
          "Unable to reach the server. The API might be offline or unavailable.",
      };
    } else {
      // Catch unexpected errors or configuration issues
      if (error.message === "Network Error") {
        return {
          error: "API is offline or unreachable. Please contact support.",
        };
      }
      return { error: `An unexpected error occurred: ${error.message}` };
    }
  }
);

export default apiClient;
