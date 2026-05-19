import axios from 'axios';
// import { useAuthStore } from '../store/authStore';

const axiosClient = axios.create({
  baseURL: (import.meta as any).env.VITE_API_GATEWAY_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 25000, // ⚡ Tăng từ 8000 lên 25000ms (25s) để cover API Gateway timeout
});

axiosClient.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('token'); 
    
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
