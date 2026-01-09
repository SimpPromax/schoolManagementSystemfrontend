import axios from 'axios';
import Swal from 'sweetalert2';

const API_URL = 'http://localhost:8080/api/v1';

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

// Request interceptor to add token
axiosInstance.interceptors.request.use(
  (config) => {
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

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
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