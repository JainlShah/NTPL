// src/config/apiConfig.js

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const PAGE_LIMIT = import.meta.env.VITE_PAGE_LIMIT;
export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  Authorization: `Basic TlRQTDMyMSFAIyQ=`, 
};

// Function to add specific headers dynamically if needed
export const getHeaders = (additionalHeaders = {}) => ({
  Authorization: "Basic TlRQTDMyMSFAIyQ=",
  ...additionalHeaders,
});
