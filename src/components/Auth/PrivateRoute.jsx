// src/components/Auth/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Check if user has required role
  if (allowedRoles.length > 0 && user?.role) {
    const userRole = user.role.toUpperCase();
    const hasPermission = allowedRoles.some(role => 
      role.toUpperCase() === userRole
    );

    if (!hasPermission) {
      // Redirect to appropriate dashboard based on role
      switch (userRole) {
        case 'ADMIN':
          return <Navigate to="/admin/dashboard" />;
        case 'TEACHER':
          return <Navigate to="/teacher/dashboard" />;
        case 'STUDENT':
          return <Navigate to="/student/dashboard" />;
        case 'PARENT':
          return <Navigate to="/parent/dashboard" />;
        case 'ACCOUNTANT':
          return <Navigate to="/accountant/dashboard" />;
        case 'STAFF':
          return <Navigate to="/staff/dashboard" />;
        default:
          return <Navigate to="/dashboard" />;
      }
    }
  }

  return children;
};

export default PrivateRoute;