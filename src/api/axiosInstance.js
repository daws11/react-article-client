import axios from 'axios';
import { API_BASE_URL } from './config';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {'Content-Type': 'application/json'}
});

// Optional: Tambahkan interceptor jika perlu
// axiosInstance.interceptors.request.use(config => {
//   // Misal: tambah token Auth
//   // const token = localStorage.getItem('token');
//   // if (token) {
//   //   config.headers.Authorization = `Bearer ${token}`;
//   // }
//   return config;
// });

export default axiosInstance;