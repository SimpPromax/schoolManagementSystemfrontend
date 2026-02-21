// src/config/axios.js
import axios from 'axios';
import Swal from 'sweetalert2';

// Get API URL from environment variable with fallback
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://192.168.100.126:8080/api';

console.log('🔧 Axios configured with API URL:', API_URL);
console.log('Environment:', import.meta.env.MODE);

// SweetAlert helper for toast notifications
const showToast = (icon, title, text = '') => {
  Swal.fire({
    icon,
    title,
    text,
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });
};

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - ALWAYS get fresh token from localStorage
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token fresh from localStorage for EVERY request
    const token = localStorage.getItem('token');
    
    // Log the request details (helpful for debugging)
    console.log(`📍 ${config.method.toUpperCase()} request to: ${config.url}`);
    console.log('📡 Full URL:', `${config.baseURL}${config.url}`);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Token attached to request');
    } else {
      console.warn('⚠️ No token found for request:', config.url);
      
      // If no token and not a public endpoint, redirect to login
      if (!config.url.includes('/auth/login') && 
          !config.url.includes('/auth/register') && 
          !config.url.includes('/auth/health')) {
        console.log('🚫 Unauthorized - redirecting to login');
        window.location.href = '/login';
      }
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`✅ Response received for ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error('❌ Response error:', {
      message: error.message,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.config?.headers
    });

    const { response } = error;
    
    if (response) {
      switch (response.status) {
        case 401:
          // Token expired or invalid
          if (window.location.pathname !== '/login') {
            showToast('error', 'Session Expired', 'Please login again');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setTimeout(() => {
              window.location.href = '/login';
            }, 1500);
          }
          break;
        
        case 403:
          showToast('error', 'Access Denied', 'You do not have permission for this action');
          break;
        
        case 404:
          showToast('error', 'Not Found', 'The requested resource was not found');
          break;
        
        case 500:
          showToast('error', 'Server Error', 'Please try again later');
          break;
        
        default:
          if (response.data && response.data.message) {
            showToast('error', 'Error', response.data.message);
          } else {
            showToast('error', 'Error', 'An unexpected error occurred');
          }
      }
    } else {
      showToast('error', 'Network Error', 'Please check your internet connection');
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;