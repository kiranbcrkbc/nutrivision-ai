import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { showToast } from './toastStore';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:8080/api' : '/api');
export const AI_SERVICE_URL = import.meta.env.VITE_AI_SERVICE_URL || (import.meta.env.DEV ? 'http://localhost:8000/api/ai' : '/api/ai');

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('nutrivision_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Standardized Error Handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<{ message?: string; error?: { message?: string } }>) => {
    if (!error.response) {
      // Network / Connection Error
      console.warn('API Network Error: Backend service may be offline at', API_BASE_URL);
      return Promise.reject(new Error('Unable to connect to Vitamin Deficiency Backend. Please verify that the server is running.'));
    }

    const status = error.response.status;
    const errorMessage =
      error.response.data?.error?.message ||
      error.response.data?.message ||
      'An unexpected server error occurred.';

    if (status === 401) {
      localStorage.removeItem('nutrivision_token');
      localStorage.removeItem('nutrivision_user');
      // showToast.warning('Session Expired', 'Please log in again to continue.');
    } else if (status === 403) {
      showToast.error('Access Denied', 'You do not have permission to perform this action.');
    } else if (status >= 500) {
      showToast.error('Server Error', 'The backend encountered an internal error.');
    }

    return Promise.reject(new Error(errorMessage));
  }
);
