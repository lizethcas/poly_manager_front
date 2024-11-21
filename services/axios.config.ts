import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NUXT_API_URL || 'http://localhost:8000/dashboard/api/',
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

export default axiosInstance; 