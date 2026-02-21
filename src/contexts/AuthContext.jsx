// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

// Import your configured axios instance
import axiosInstance from '../api/axiosConfig';

// Create context
const AuthContext = createContext(null);

// Export hook to use auth context
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Constants for roles
const ROLES = {
  ADMIN: 'ADMIN',
  TEACHER: 'TEACHER',
  STUDENT: 'STUDENT',
  PARENT: 'PARENT',
  STAFF: 'STAFF',
  ACCOUNTANT: 'ACCOUNTANT',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(true);
  const [token, setTokenState] = useState(() => localStorage.getItem('token'));
  const navigate = useNavigate();

  // Set token function to keep token state and localStorage in sync
  const setToken = useCallback((newToken) => {
    setTokenState(newToken);
    if (newToken) {
      localStorage.setItem('token', newToken);
      // Also set in axios instance for future requests
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      console.log('✅ Token set in axios headers');
    } else {
      localStorage.removeItem('token');
      delete axiosInstance.defaults.headers.common['Authorization'];
      console.log('❌ Token removed from axios headers');
    }
  }, []);

  // Fetch current user from API
  const fetchCurrentUser = useCallback(async () => {
    const currentToken = token || localStorage.getItem('token');
    
    if (!currentToken) {
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching current user...');
      const response = await axiosInstance.get('/auth/me');
      
      if (response.data.success) {
        const userData = response.data.data;
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('✅ User fetched successfully:', userData);
      } else {
        console.warn('❌ Failed to fetch user, token might be invalid');
        setToken(null);
        localStorage.removeItem('user');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setToken(null);
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, [token, setToken]);

  // Check auth status on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    console.log('AuthProvider mounted, stored token exists:', !!storedToken);
    
    if (storedToken) {
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, [fetchCurrentUser]);

  // Show alert notification
  const showAlert = useCallback((icon, title, text = '') => {
    return Swal.fire({
      icon,
      title,
      text,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  }, []);

  // Show confirmation dialog
  const showConfirm = useCallback(async (title, text, confirmButtonText = 'Confirm') => {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText,
      cancelButtonText: 'Cancel'
    });
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      const loginData = {
        username: credentials.email || credentials.username,
        password: credentials.password,
        rememberMe: false
      };

      console.log('🔐 Login attempt with username:', loginData.username);
      console.log('Using API URL:', axiosInstance.defaults.baseURL);

      const response = await axiosInstance.post('/auth/login', loginData);
      
      console.log('📥 Login response:', response.data);
      
      if (response.data.success) {
        const { token: accessToken, ...userData } = response.data.data;
        
        // Store token first
        setToken(accessToken);
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Verify token was set
        console.log('✅ Token verification:', {
          localStorage: localStorage.getItem('token') ? 'Present' : 'Missing',
          axiosHeaders: axiosInstance.defaults.headers.common['Authorization'] ? 'Present' : 'Missing'
        });
        
        showAlert('success', 'Login successful!');
        
        // Redirect based on role
        redirectBasedOnRole(userData.role);
        
        return { success: true, user: userData };
      } else {
        showAlert('error', 'Login Failed', response.data.message);
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('❌ Login error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
      showAlert('error', 'Login Failed', message);
      return { success: false, message };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const registrationData = {
        username: userData.username,
        email: userData.email,
        fullName: userData.fullName,
        password: userData.password,
        confirmPassword: userData.confirmPassword,
        phone: userData.phone || '',
        address: userData.address || '',
        role: userData.role
      };
      
      console.log('📝 Sending registration data:', registrationData);
      
      const response = await axiosInstance.post('/auth/register', registrationData);
      
      console.log('📥 Registration response:', response.data);
      
      if (response.data.success) {
        showAlert('success', 'Registration successful!', 'Please login with your credentials.');
        navigate('/login');
        return { success: true, message: 'Registration successful' };
      } else {
        showAlert('error', 'Registration Failed', response.data.message);
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('❌ Registration error:', error.response?.data);
      const message = error.response?.data?.message || 'Registration failed';
      showAlert('error', 'Registration Failed', message);
      return { success: false, message };
    }
  };

  // Logout function
  const logout = async () => {
    const result = await showConfirm('Logout', 'Are you sure you want to logout?', 'Yes, logout');
    
    if (result.isConfirmed) {
      try {
        await axiosInstance.post('/auth/logout');
        console.log('✅ Logout successful');
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        // Clear everything
        setToken(null);
        setUser(null);
        localStorage.removeItem('user');
        
        showAlert('success', 'Logged out successfully');
        navigate('/login');
      }
    }
  };

  // Update user profile
  const updateUser = useCallback((userData) => {
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }, [user]);

  // Get current user from API
  const getCurrentUser = async () => {
    try {
      const response = await axiosInstance.get('/auth/me');
      if (response.data.success && response.data.data) {
        const userData = response.data.data;
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true, user: userData };
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
    return { success: false };
  };

  // Change password
  const changePassword = async (passwordData) => {
    try {
      const response = await axiosInstance.put('/auth/change-password', passwordData);
      if (response.data.success) {
        showAlert('success', 'Password changed successfully');
      }
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to change password';
      showAlert('error', 'Password Change Failed', message);
      return { success: false, message };
    }
  };

  // Update profile
  const updateProfile = async (profileData) => {
    try {
      const response = await axiosInstance.put('/auth/profile', profileData);
      if (response.data.success && response.data.data) {
        updateUser(response.data.data);
        showAlert('success', 'Profile updated successfully');
        return { success: true, user: response.data.data };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile';
      showAlert('error', 'Profile Update Failed', message);
      return { success: false, message };
    }
  };

  // Helper function to redirect based on role
  const redirectBasedOnRole = (role) => {
    const upperRole = role?.toUpperCase() || '';
    
    switch (upperRole) {
      case ROLES.ADMIN:
        navigate('/admin/dashboard');
        break;
      case ROLES.TEACHER:
        navigate('/teacher/dashboard');
        break;
      case ROLES.STUDENT:
        navigate('/student/dashboard');
        break;
      case ROLES.PARENT:
        navigate('/parent/dashboard');
        break;
      case ROLES.ACCOUNTANT:
      case ROLES.STAFF:
        navigate('/accountant/dashboard');
        break;
      default:
        navigate('/dashboard');
    }
  };

  // Check user permissions
  const hasRole = useCallback((requiredRole) => {
    if (!user?.role) return false;
    return user.role.toUpperCase() === requiredRole.toUpperCase();
  }, [user]);

  const hasAnyRole = useCallback((requiredRoles) => {
    if (!user?.role) return false;
    const userRole = user.role.toUpperCase();
    return requiredRoles.some(role => role.toUpperCase() === userRole);
  }, [user]);

  // Context value
  const value = {
    // State
    user,
    token,
    loading,
    
    // Auth methods
    login,
    register,
    logout,
    updateUser,
    getCurrentUser,
    changePassword,
    updateProfile,
    
    // Role checks
    isAuthenticated: !!token,
    isAdmin: user?.role === ROLES.ADMIN,
    isTeacher: user?.role === ROLES.TEACHER,
    isStudent: user?.role === ROLES.STUDENT,
    isParent: user?.role === ROLES.PARENT,
    isAccountant: user?.role === ROLES.ACCOUNTANT || user?.role === ROLES.STAFF,
    getUserRole: () => user?.role,
    hasRole,
    hasAnyRole,
    
    // Constants
    ROLES,
    
    // UI helpers
    showAlert,
    showConfirm,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;