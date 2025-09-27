import log from "../components/logger";
import { PAGE_LIMIT } from "../config/apiConfig";
import { SlittingList, slittingOperatorFinishResponse } from "../util/mock";
import apiClient from "./ApiService";

// Utility function to convert specific fields to numbers
const convertFieldsToNumbers = (obj, keys) => {
  for (const key in obj) {
    if (keys.includes(key) && typeof obj[key] === "string") {
      obj[key] = Number(obj[key]);
    }
  }
  return obj;
};

// Process form data to ensure specific fields are numbers
const processFormData = (formData) => {
  const fieldsToConvert = ["stack", "width", "thickness", "length", "weight", "rollTrim", "programTrim", "trimWidth"];

  // Convert top-level fields
  convertFieldsToNumbers(formData, fieldsToConvert);

  // Convert nested fields inside rollsData array
  if (Array.isArray(formData.rollsData)) {
    formData.rollsData = formData.rollsData.map((roll) =>
      convertFieldsToNumbers(roll, fieldsToConvert)
    );
  }

  return formData;
};

const SlittingService = {
  // Fetch slitting list
  getSlittingList: async ({ searchQuery, currPage, filters }) => {
    log.info("Fetching slitting list", { searchQuery, currPage, filters });

    if (import.meta.env.VITE_NODE_MODE === "development") {
      return slittingOperatorFinishResponse();
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
    const response = await apiClient.get("/api/slitting/getAllSlittingProgram", {
      params: {
        searchTerm: searchQuery,
        currentPage: currPage,
        ...formattedFilters,
        itemsPerPage: PAGE_LIMIT
      },
      data: {},
    });
    return response;

  },

  // Add a new slitting program
  addSlittingProgram: async (formData) => {
    log.info("Adding slitting program (before conversion)", formData);

    const processedFormData = processFormData(formData);
    log.info("Adding slitting program (after conversion)", processedFormData);

    if (import.meta.env.VITE_NODE_MODE === "development") {
      return;
    }

    const response = await apiClient.post("/api/slitting/addSlittingProgram", processedFormData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  },

  // Update slitting program
  updateSlittingProgram: async (formData) => {
    log.info("Updating slitting program", formData);
    const processedFormData = processFormData(formData);
    if (import.meta.env.VITE_NODE_MODE === "development") {
      return;
    }

    const response = await apiClient.put("/api/slitting/updateSlittingProgram", processedFormData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;

  },

  // Delete slitting program
  deleteSlittingProgram: async (data) => {
    log.info("Deleting slitting program", data);

    if (import.meta.env.VITE_NODE_MODE === "development") {
      return;
    }

    const response = await apiClient.delete(`/api/slitting/deleteSlittingProgram`, {
      params: {
        coil_rollNumber: data.coil_rollNumber,
        slittingProgramId: data.slittingProgramId
      }
    });
    return response;
  },

  // Update coil hold
  coilHold: async (holdData) => {
    log.info("Updating coil hold", holdData);

    if (import.meta.env.VITE_NODE_MODE === "development") {
      return;
    }

    const response = await apiClient.put("/api/coilInventory/updateCoilDetail", holdData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  },

  // Partial coil hold
  partialCoilHold: async (formData) => {
    log.info("Processing partial coil hold", formData);

    if (import.meta.env.VITE_NODE_MODE === "development") {
      return;
    }

    const response = await apiClient.post("/partialcoilhold", formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  },

  // Generate QR
  generateQR: async (formData) => {
    log.info("Generating QR code", formData);

    // if (import.meta.env.VITE_NODE_MODE === "development") {
    // return slittingOperatorFinishResponse();
    // }
    const response = await apiClient.put("/api/slitting/updateByOperator", formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  },

  // Update program status
  updateStatus: async (formData) => {
    log.info("Updating roll status", formData);

    if (import.meta.env.VITE_NODE_MODE === "development") {
      return slittingOperatorFinishResponse();
    }

    const response = await apiClient.put("/api/rollInventory/updateRollStatus", formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  },
};

export default SlittingService;
