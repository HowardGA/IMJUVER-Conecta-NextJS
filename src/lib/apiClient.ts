'use client';

import axios from 'axios';

const apiClient = axios.create({
  baseURL:  'http://localhost:3001/api',
  timeout: 10000,
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
//https://imjuver-backend.onrender.com/api