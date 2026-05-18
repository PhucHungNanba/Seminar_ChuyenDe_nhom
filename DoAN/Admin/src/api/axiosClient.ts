import axios from 'axios';
// import { useAdminStore } from '../store/adminStore';

const axiosClient = axios.create({
  baseURL: (import.meta as any).env.VITE_API_GATEWAY_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('adminToken'); 
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response: any) => {
    return response.data; 
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

export default axiosClient;
