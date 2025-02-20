import axios from "axios";

const baseURLs = {
  development: {
    dashboard: "http://localhost:8000/dashboard/api/",
    chat: "http://localhost:8000/chat/",
   
  },
  production: {
    // dashboard: "https://dploy-production.up.railway.app/dashboard/api/",
    dashboard: "http://localhost:8000/dashboard/api/",
    chat: "https://dploy-production.up.railway.app/chat/",
  },
};

const isDevelopment = process.env.NODE_ENV === "development";


// Create separate axios instances for different endpoints

export const axiosDashboard = axios.create({
  baseURL: isDevelopment
    ? baseURLs.development.dashboard
    : baseURLs.production.dashboard,
});

// Add request interceptor
axiosDashboard.interceptors.request.use(
  (config) => {
    // Skip adding Bearer token for Google login endpoint
    if (config.url?.includes('google-login')) {
      return config;
    }
    
    // Get token from localStorage for other endpoints
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// Update the response interceptor to be more specific


export const axiosChat = axios.create({
  baseURL: isDevelopment ? baseURLs.development.chat : baseURLs.production.chat,
});

export default {
  axiosDashboard,
  axiosChat
};


