import axios from "axios";

const urls = {
  production: "https://dploy-production.up.railway.app/dashboard/api/",
  development: "http://localhost:8000/dashboard/api/",
};

const axiosInstance = axios.create({
  baseURL: urls.production,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
