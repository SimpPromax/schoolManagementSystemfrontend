import axiosInstance from './axiosConfig';

export const authAPI = {
  // Login
  login: async (credentials) => {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  },

  // Register
  register: async (userData) => {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  },

  // Refresh token
  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await axiosInstance.post('/auth/refresh-token', null, {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });
    return response.data;
  },

  // Logout
  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      console.error('Logout API error:', error);
    }
  },

  // Change password
  changePassword: async (data) => {
    const response = await axiosInstance.put('/auth/change-password', data);
    return response.data;
  },

  // Update profile
  updateProfile: async (data) => {
    const response = await axiosInstance.put('/auth/profile', data);
    return response.data;
  },

  // Enable user (Admin only)
  enableUser: async (userId) => {
    const response = await axiosInstance.put(`/auth/users/${userId}/enable`);
    return response.data;
  },

  // Disable user (Admin only)
  disableUser: async (userId) => {
    const response = await axiosInstance.put(`/auth/users/${userId}/disable`);
    return response.data;
  },

  // Unlock user (Admin only)
  unlockUser: async (userId) => {
    const response = await axiosInstance.put(`/auth/users/${userId}/unlock`);
    return response.data;
  },
};