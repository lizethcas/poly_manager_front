import axios from "axios";

const baseURLs = {
  development: {
    default: "http://localhost:8000/",
    dashboard: "http://localhost:8000/dashboard/api/",
    chat: "http://localhost:8000/chat/"
  }
};

// Create separate axios instances for different endpoints
export const axiosDefault = axios.create({
  baseURL: baseURLs.development.default
});

export const axiosDashboard = axios.create({
  baseURL: baseURLs.development.dashboard
});

export const axiosChat = axios.create({
  baseURL: baseURLs.development.chat
});
