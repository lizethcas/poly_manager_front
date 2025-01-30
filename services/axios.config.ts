import axios from "axios";

const baseURLs = {
  development: {
    dashboard: "http://localhost:8000/dashboard/api/",
    chat: "http://localhost:8000/chat/",
   
  },
  production: {
    dashboard: "https://dploy-production.up.railway.app/dashboard/api/",
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

// Add interceptor to include auth token
axiosDashboard.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    // If no token is found, redirect to login
    window.location.href = '/login';
  }
  return config;
});

// Update the response interceptor to be more specific
axiosDashboard.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const axiosChat = axios.create({
  baseURL: isDevelopment ? baseURLs.development.chat : baseURLs.production.chat,
});

export default {
  axiosDashboard,
  axiosChat
};


