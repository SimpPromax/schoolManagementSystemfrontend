// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

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

  // Configure axios base URL - Update this to your backend URL
  axios.defaults.baseURL = 'http://localhost:8080'; // Update to match your Spring Boot port

  // Set token function to keep token state and localStorage in sync
  const setToken = useCallback((newToken) => {
    setTokenState(newToken);
    if (newToken) {
      localStorage.setItem('token', newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    } else {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
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
      const response = await axios.get('/api/auth/me');
      
      if (response.data.success) {
        const userData = response.data.data; // Your API returns data in 'data' field
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        // Token is invalid or expired
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

  // Configure axios defaults and auto-login
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    
    if (storedToken) {
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

  // Login function - Updated for your backend
  const login = async (credentials) => {
    try {
      // Your backend expects username field, not email
      // The Login component sends {email, password} but backend expects {username, password}
      // We'll map email to username
      const loginData = {
        username: credentials.email || credentials.username, // Handle both cases
        password: credentials.password,
        rememberMe: false
      };

      console.log('Login attempt with data:', loginData);

      const response = await axios.post('/api/auth/login', loginData);
      
      console.log('Login response:', response.data);
      
      if (response.data.success) {
        const { token: accessToken, ...userData } = response.data.data; // Your API structure
        
        // Store in localStorage and update state
        setToken(accessToken);
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        
        showAlert('success', 'Login successful!');
        
        // Redirect based on role
        redirectBasedOnRole(userData.role);
        
        return { success: true, user: userData };
      } else {
        showAlert('error', 'Login Failed', response.data.message);
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('Login error details:', error.response?.data);
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
      showAlert('error', 'Login Failed', message);
      return { success: false, message };
    }
  };

  // Register function - Updated for your backend
  const register = async (userData) => {
    try {
      // Map frontend fields to backend RegisterRequest DTO
      // Include ALL fields that your backend expects
      const registrationData = {
        username: userData.username,
        email: userData.email,
        fullName: userData.fullName, // Using fullName field from form
        password: userData.password,
        confirmPassword: userData.confirmPassword, // Include this field!
        phone: userData.phone || '',
        address: userData.address || '',
        role: userData.role
      };
      
      console.log('Sending registration data:', registrationData);
      
      const response = await axios.post('/api/auth/register', registrationData);
      
      console.log('Registration response:', response.data);
      
      if (response.data.success) {
        showAlert('success', 'Registration successful!', response.data.message || 'Please login with your credentials.');
        navigate('/login');
        return { success: true, message: 'Registration successful' };
      } else {
        showAlert('error', 'Registration Failed', response.data.message);
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('Registration error details:', error.response?.data);
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
        await axios.post('/api/auth/logout');
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
      const response = await axios.get('/api/auth/me');
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
      const response = await axios.put('/api/auth/change-password', passwordData);
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
      const response = await axios.put('/api/auth/profile', profileData);
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