import axios from "axios";

const baseURLs = {
  development: {
    dashboard: "http://localhost:8000/dashboard/api/",
    chat: "http://localhost:8000/chat/",
  },
  production: {
    dashboard: "https://dploy-production.up.railway.app/dashboard/api/",
    chat: "https://dploy-production.up.railway.app/chat",
  },
};

const isDevelopment = process.env.NODE_ENV === "development";


// Create separate axios instances for different endpoints

export const axiosDashboard = axios.create({
  baseURL: isDevelopment
    ? baseURLs.development.dashboard
    : baseURLs.production.dashboard,
});

export const axiosChat = axios.create({
  baseURL:  baseURLs.production.chat,
});
