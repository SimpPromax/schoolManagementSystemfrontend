/* eslint-disable no-unused-vars */
import React, { useState, useMemo, useEffect, useCallback, useReducer } from 'react';
import {
  Calendar,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  Clock,
  RefreshCw,
  Save,
  X,
  Loader2,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  User,
  LogOut,
  School,
  History,
  Settings,
  FileText
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const MySwal = withReactContent(Swal);

// ========== API CONFIGURATION ==========

const feeApi = axios.create({
  baseURL: 'http://localhost:8080/api/v1/fee-management',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  }
});

feeApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

feeApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      handleUnauthorized();
    }
    return Promise.reject(error);
  }
);

const handleApiResponse = (response) => {
  const responseData = response.data;
  
  if (!responseData) {
    throw new Error('No response data received');
  }

  if (responseData.success === false) {
    const error = new Error(responseData.message || 'Request failed');
    error.response = response;
    throw error;
  }

  return responseData.data || responseData;
};

const handleApiError = (error, context = '') => {
  console.error(`API Error in ${context}:`, error.response?.data || error.message);

  if (error.response) {
    const errorData = error.response.data;
    
    let message = 'Request failed';
    
    if (typeof errorData === 'string') {
      message = errorData;
    } else if (errorData && typeof errorData === 'object') {
      message = errorData.message || errorData.error || errorData.exception || 
               errorData.errorMessage || 'Server error occurred';
    }
    
    switch (error.response.status) {
      case 400:
        return message || 'Bad request. Please check your input.';
      case 401:
        return 'Session expired. Please login again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return message || 'The requested resource was not found.';
      case 409:
        return message || 'Conflict: Resource already exists.';
      case 500:
        return message || 'Server error. Please try again later.';
      default:
        return message || `Error: ${error.response.status}`;
    }
  } else if (error.request) {
    return 'Network error. Please check your connection.';
  } else {
    return error.message || 'An unexpected error occurred.';
  }
};

const handleUnauthorized = () => {
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
  localStorage.removeItem('user');
  
  MySwal.fire({
    title: <span className="text-amber-600">Session Expired</span>,
    html: <p className="text-gray-700">Your session has expired. Please login again.</p>,
    icon: 'warning',
    confirmButtonText: 'Login',
    confirmButtonColor: '#3b82f6',
    showCloseButton: true,
    customClass: {
      popup: 'rounded-2xl border border-gray-200 shadow-xl',
      title: 'text-lg font-bold',
      confirmButton: 'px-4 py-2 rounded-lg font-medium'
    }
  }).then(() => {
    window.location.href = '/login';
  });
};

// ========== ALERT UTILITIES ==========

const showSuccessAlert = (title, message) => {
  MySwal.fire({
    title: <span className="text-emerald-600">{title}</span>,
    html: <p className="text-gray-700">{message}</p>,
    icon: 'success',
    confirmButtonText: 'OK',
    confirmButtonColor: '#10b981',
    showCloseButton: true,
    customClass: {
      popup: 'rounded-2xl border border-gray-200 shadow-xl',
      title: 'text-lg font-bold',
      confirmButton: 'px-4 py-2 rounded-lg font-medium'
    }
  });
};

const showErrorAlert = (title, message) => {
  MySwal.fire({
    title: <span className="text-rose-600">{title}</span>,
    html: <p className="text-gray-700">{message}</p>,
    icon: 'error',
    confirmButtonText: 'OK',
    confirmButtonColor: '#ef4444',
    showCloseButton: true,
    customClass: {
      popup: 'rounded-2xl border border-gray-200 shadow-xl',
      title: 'text-lg font-bold',
      confirmButton: 'px-4 py-2 rounded-lg font-medium'
    }
  });
};

const showConfirmDialog = (title, message, confirmText, cancelText) => {
  return MySwal.fire({
    title: <span className="text-gray-900">{title}</span>,
    html: <p className="text-gray-700">{message}</p>,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonColor: '#3b82f6',
    cancelButtonColor: '#6b7280',
    reverseButtons: true,
    customClass: {
      popup: 'rounded-2xl border border-gray-200 shadow-xl',
      title: 'text-lg font-bold',
      confirmButton: 'px-4 py-2 rounded-lg font-medium',
      cancelButton: 'px-4 py-2 rounded-lg font-medium'
    }
  });
};

// ========== COMPONENTS ==========

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };
  
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600 mb-2`} />
      <span className="text-sm text-gray-600">{text}</span>
    </div>
  );
};

const RoleBadge = ({ role }) => {
  const roleColors = {
    admin: 'bg-red-100 text-red-800 border-red-200',
    accountant: 'bg-blue-100 text-blue-800 border-blue-200',
    teacher: 'bg-green-100 text-green-800 border-green-200',
    parent: 'bg-purple-100 text-purple-800 border-purple-200',
    student: 'bg-amber-100 text-amber-800 border-amber-200',
    staff: 'bg-indigo-100 text-indigo-800 border-indigo-200'
  };
  
  const normalizedRole = role?.toLowerCase() || 'user';
  const color = roleColors[normalizedRole] || 'bg-gray-100 text-gray-800 border-gray-200';
  
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${color}`}>
      <Shield className="w-3 h-3" />
      {normalizedRole.charAt(0).toUpperCase() + normalizedRole.slice(1)}
    </span>
  );
};

// ========== STATE MANAGEMENT ==========

const initialState = {
  terms: [],
  currentTerm: null,
  academicYearHistory: [],
  loadingStates: {
    terms: false,
    settingCurrent: false,
    savingTerm: false,
    deletingTerm: false,
    refreshing: false
  },
  errors: {
    terms: null,
    save: null,
    delete: null
  }
};

function termReducer(state, action) {
  switch (action.type) {
    case 'SET_TERMS':
      return {
        ...state,
        terms: action.payload,
        errors: { ...state.errors, terms: null }
      };
    case 'SET_CURRENT_TERM':
      return { ...state, currentTerm: action.payload };
    case 'SET_ACADEMIC_YEAR_HISTORY':
      return { ...state, academicYearHistory: action.payload };
    case 'SET_LOADING':
      return {
        ...state,
        loadingStates: { ...state.loadingStates, ...action.payload }
      };
    case 'SET_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.payload.key]: action.payload.error }
      };
    case 'RESET_ERRORS':
      return {
        ...state,
        errors: initialState.errors
      };
    default:
      return state;
  }
}

// ========== FORM VALIDATION ==========

const validateTermForm = (formData) => {
  const errors = {};
  
  if (!formData.termName.trim()) {
    errors.termName = 'Term name is required';
  }
  
  if (!formData.startDate) {
    errors.startDate = 'Start date is required';
  }
  
  if (!formData.endDate) {
    errors.endDate = 'End date is required';
  }
  
  if (!formData.feeDueDate) {
    errors.feeDueDate = 'Fee due date is required';
  }
  
  if (formData.startDate && formData.endDate) {
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    
    if (end <= start) {
      errors.endDate = 'End date must be after start date';
    }
  }
  
  if (formData.feeDueDate && formData.endDate) {
    const due = new Date(formData.feeDueDate);
    const end = new Date(formData.endDate);
    
    if (due > end) {
      errors.feeDueDate = 'Fee due date cannot be after term end date';
    }
  }
  
  return errors;
};

// ========== MAIN COMPONENT ==========

const TermManagement = () => {
  const navigate = useNavigate();
  const { 
    user, 
    isAuthenticated, 
    isAdmin, 
    isAccountant, 
    hasRole, 
    hasAnyRole,
    logout
  } = useAuth();
  
  const [state, dispatch] = useReducer(termReducer, initialState);

  // ========== DATA FETCHING ==========

  const setLoadingState = useCallback((key, value) => {
    dispatch({ type: 'SET_LOADING', payload: { [key]: value } });
  }, []);

  const setError = useCallback((key, error) => {
    dispatch({ type: 'SET_ERROR', payload: { key, error } });
  }, []);

  const fetchTerms = useCallback(async () => {
    setLoadingState('terms', true);
    try {
      const response = await feeApi.get('/terms');
      const responseData = handleApiResponse(response);
      
      let termsArray = [];
      let currentTerm = null;
      
      if (Array.isArray(responseData)) {
        termsArray = responseData;
        currentTerm = termsArray.find(term => term.isCurrent === true);
      } else if (responseData && typeof responseData === 'object') {
        if (Array.isArray(responseData.terms)) {
          termsArray = responseData.terms;
          currentTerm = responseData.currentTerm || termsArray.find(term => term.isCurrent === true);
        } else if (Array.isArray(responseData.data)) {
          termsArray = responseData.data;
          currentTerm = responseData.currentTerm || termsArray.find(term => term.isCurrent === true);
        } else if (Array.isArray(responseData.content)) {
          termsArray = responseData.content;
          currentTerm = responseData.currentTerm || termsArray.find(term => term.isCurrent === true);
        }
      }
      
      if (!Array.isArray(termsArray)) {
        termsArray = [];
      }
      
      termsArray = termsArray.map(term => ({
        id: term.id || term.termId,
        termName: term.termName || term.name || '',
        academicYear: term.academicYear || '',
        startDate: term.startDate,
        endDate: term.endDate,
        feeDueDate: term.feeDueDate,
        isCurrent: Boolean(term.isCurrent || term.current),
        isActive: term.isActive !== false,
        status: term.status || 'ACTIVE'
      }));
      
      dispatch({
        type: 'SET_TERMS',
        payload: termsArray
      });
      
      if (currentTerm) {
        const normalizedCurrentTerm = {
          id: currentTerm.id || currentTerm.termId,
          termName: currentTerm.termName || currentTerm.name || '',
          academicYear: currentTerm.academicYear || '',
          startDate: currentTerm.startDate,
          endDate: currentTerm.endDate,
          feeDueDate: currentTerm.feeDueDate,
          isCurrent: true,
          isActive: currentTerm.isActive !== false,
          status: currentTerm.status || 'ACTIVE'
        };
        
        dispatch({
          type: 'SET_CURRENT_TERM',
          payload: normalizedCurrentTerm
        });
      }
      
    } catch (error) {
      const errorMessage = handleApiError(error, 'fetching terms');
      setError('terms', errorMessage);
      console.error('Terms fetch error:', error);
    } finally {
      setLoadingState('terms', false);
    }
  }, [setLoadingState, setError]);

  const fetchAcademicYearHistory = useCallback(async () => {
    try {
      const response = await feeApi.get('/terms');
      const responseData = handleApiResponse(response);
      
      let allTerms = [];
      
      if (Array.isArray(responseData)) {
        allTerms = responseData;
      } else if (responseData && typeof responseData === 'object') {
        if (Array.isArray(responseData.terms)) {
          allTerms = responseData.terms;
        } else if (Array.isArray(responseData.data)) {
          allTerms = responseData.data;
        } else if (Array.isArray(responseData.content)) {
          allTerms = responseData.content;
        }
      }
      
      if (Array.isArray(allTerms)) {
        const years = {};
        allTerms.forEach(term => {
          const academicYear = term.academicYear || 'Unknown';
          if (!years[academicYear]) {
            years[academicYear] = {
              academicYear,
              terms: [],
              totalCollections: 0,
              collectionRate: 0,
              totalStudents: 0
            };
          }
          years[academicYear].terms.push(term);
        });
        
        const history = Object.values(years)
          .map(year => ({
            ...year,
            isCurrent: year.terms.some(t => t.isCurrent === true),
            totalStudents: year.terms.reduce((sum, term) => sum + (term.totalStudents || 0), 0),
            totalCollections: year.terms.reduce((sum, term) => sum + (term.collectedAmount || 0), 0),
            collectionRate: year.terms.length > 0 
              ? year.terms.reduce((sum, term) => sum + (term.collectionRate || 0), 0) / year.terms.length
              : 0
          }))
          .sort((a, b) => b.academicYear.localeCompare(a.academicYear));
        
        dispatch({
          type: 'SET_ACADEMIC_YEAR_HISTORY',
          payload: history
        });
      }
    } catch (error) {
      console.error('Academic year history error:', error);
    }
  }, []);

  // ========== REFRESH FUNCTION ==========

  const refreshAllData = useCallback(async () => {
    dispatch({ type: 'RESET_ERRORS' });
    setLoadingState('refreshing', true);
    
    try {
      await fetchTerms();
      showSuccessAlert(
        'Data Refreshed',
        'All term data has been refreshed successfully.'
      );
      return true;
    } catch (error) {
      console.error('Refresh error:', error);
      showErrorAlert('Refresh Failed', 'Failed to refresh term data');
      return false;
    } finally {
      setLoadingState('refreshing', false);
    }
  }, [fetchTerms, setLoadingState]);

  // ========== INITIAL LOAD ==========

  useEffect(() => {
    const loadInitialData = async () => {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }
      
      try {
        await fetchTerms();
      } catch (error) {
        console.error('Initial load error:', error);
      }
    };
    
    loadInitialData();
  }, [isAuthenticated, navigate, fetchTerms]);

  // ========== SWEETALERT2 FORM HANDLING ==========

  const showTermForm = (term = null) => {
    const isEdit = !!term;
    const defaultFormData = {
      termName: term?.termName || '',
      academicYear: term?.academicYear || `${new Date().getFullYear()}`,
      startDate: term?.startDate?.split('T')[0] || '',
      endDate: term?.endDate?.split('T')[0] || '',
      feeDueDate: term?.feeDueDate?.split('T')[0] || '',
      isActive: term?.isActive !== false,
      isCurrent: term?.isCurrent || false
    };

    MySwal.fire({
      title: <span className="text-gray-900">{isEdit ? 'Edit Term' : 'Create New Term'}</span>,
      html: (
        <div className="text-left space-y-6 max-h-[70vh] overflow-y-auto pr-2">
          {/* Term Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Term Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="termName"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-20 transition-all duration-200"
              defaultValue={defaultFormData.termName}
              placeholder="e.g., Term 1 2026"
            />
          </div>

          {/* Academic Year */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Academic Year <span className="text-red-500">*</span>
            </label>
            <select
              id="academicYear"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-20 transition-all duration-200 bg-white"
              defaultValue={defaultFormData.academicYear}
            >
              <option value="">Select Year</option>
              {Array.from({length: 5}, (_, i) => new Date().getFullYear() + i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Dates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="startDate"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-20 transition-all duration-200"
                defaultValue={defaultFormData.startDate}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="endDate"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-20 transition-all duration-200"
                defaultValue={defaultFormData.endDate}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Fee Due Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="feeDueDate"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-20 transition-all duration-200"
                defaultValue={defaultFormData.feeDueDate}
              />
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  id="isActive"
                  className="sr-only"
                  defaultChecked={defaultFormData.isActive}
                />
                <div className={`w-12 h-6 rounded-full transition-all duration-200 ${
                  defaultFormData.isActive ? 'bg-indigo-600' : 'bg-gray-300'
                }`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200 ${
                    defaultFormData.isActive ? 'left-7' : 'left-1'
                  }`}></div>
                </div>
              </div>
              <span className="text-sm font-medium text-gray-700">Active Term</span>
            </label>
            
            {!isEdit && (
              <label className="flex items-center space-x-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    id="isCurrent"
                    className="sr-only"
                    defaultChecked={defaultFormData.isCurrent}
                  />
                  <div className={`w-12 h-6 rounded-full transition-all duration-200 ${
                    defaultFormData.isCurrent ? 'bg-green-600' : 'bg-gray-300'
                  }`}>
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200 ${
                      defaultFormData.isCurrent ? 'left-7' : 'left-1'
                    }`}></div>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-700">Set as Current Term</span>
              </label>
            )}
          </div>
        </div>
      ),
      showCancelButton: true,
      confirmButtonText: isEdit ? 'Update Term' : 'Create Term',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#6b7280',
      width: 600,
      customClass: {
        popup: 'rounded-2xl border border-gray-200 shadow-xl',
        title: 'text-lg font-bold mb-4',
        confirmButton: 'px-4 py-2.5 rounded-lg font-medium',
        cancelButton: 'px-4 py-2.5 rounded-lg font-medium',
        htmlContainer: 'overflow-visible'
      },
      preConfirm: () => {
        const formData = {
          termName: document.getElementById('termName').value,
          academicYear: document.getElementById('academicYear').value,
          startDate: document.getElementById('startDate').value,
          endDate: document.getElementById('endDate').value,
          feeDueDate: document.getElementById('feeDueDate').value,
          isActive: document.getElementById('isActive').checked,
          isCurrent: document.getElementById('isCurrent')?.checked || false
        };

        const errors = validateTermForm(formData);
        
        if (Object.keys(errors).length > 0) {
          const errorMessages = Object.values(errors).join('<br>');
          MySwal.showValidationMessage(`Please fix the following errors:<br>${errorMessages}`);
          return false;
        }

        return formData;
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        await handleSaveTerm(result.value, term?.id);
      }
    });
  };

  // ========== ACTION HANDLERS ==========

  const handleSaveTerm = async (formData, termId = null) => {
    setLoadingState('savingTerm', true);
    
    MySwal.fire({
      title: termId ? 'Updating Term...' : 'Creating Term...',
      text: 'Please wait while we save your changes.',
      icon: 'info',
      showConfirmButton: false,
      allowOutsideClick: false,
      customClass: {
        popup: 'rounded-2xl border border-gray-200 shadow-xl'
      },
      didOpen: () => {
        MySwal.showLoading();
      }
    });
    
    try {
      if (termId) {
        const response = await feeApi.put(`/terms/${termId}`, formData);
        handleApiResponse(response);
        showSuccessAlert('Term Updated', 'Term has been updated successfully!');
      } else {
        const response = await feeApi.post('/terms', formData);
        handleApiResponse(response);
        showSuccessAlert('Term Created', 'Term has been created successfully!');
      }
      
      await fetchTerms();
      
    } catch (error) {
      const errorMessage = handleApiError(error, 'saving term');
      showErrorAlert('Save Failed', errorMessage);
      console.error('Save term error:', error);
    } finally {
      setLoadingState('savingTerm', false);
    }
  };

  const handleDelete = async (termId) => {
    if (!isAdmin && !hasRole('ADMIN')) {
      showErrorAlert(
        'Access Denied',
        'Only administrators can delete terms'
      );
      return;
    }
    
    const result = await showConfirmDialog(
      'Delete Term',
      'Are you sure you want to delete this term? This action cannot be undone.',
      'Yes, delete it',
      'Cancel'
    );

    if (!result.isConfirmed) return;

    setLoadingState('deletingTerm', true);
    
    MySwal.fire({
      title: 'Deleting Term...',
      text: 'Please wait while we delete the term.',
      icon: 'info',
      showConfirmButton: false,
      allowOutsideClick: false,
      customClass: {
        popup: 'rounded-2xl border border-gray-200 shadow-xl'
      },
      didOpen: () => {
        MySwal.showLoading();
      }
    });
    
    try {
      const response = await feeApi.delete(`/terms/${termId}`);
      handleApiResponse(response);
      
      MySwal.close();
      showSuccessAlert('Term Deleted', 'Term has been deleted successfully.');
      await fetchTerms();
      
    } catch (error) {
      MySwal.close();
      const errorMessage = handleApiError(error, 'deleting term');
      showErrorAlert('Delete Failed', errorMessage);
      console.error('Delete term error:', error);
    } finally {
      setLoadingState('deletingTerm', false);
    }
  };

  const handleSetCurrent = async (termId) => {
    if (!isAdmin && !isAccountant && !hasRole('ADMIN') && !hasRole('ACCOUNTANT')) {
      showErrorAlert(
        'Access Denied',
        'Only administrators or accountants can set current term'
      );
      return;
    }
    
    const result = await showConfirmDialog(
      'Set Current Term',
      'Are you sure you want to set this term as the current term?',
      'Yes, set as current',
      'Cancel'
    );

    if (!result.isConfirmed) return;

    setLoadingState('settingCurrent', true);
    
    MySwal.fire({
      title: 'Setting Current Term...',
      text: 'Please wait while we update the current term.',
      icon: 'info',
      showConfirmButton: false,
      allowOutsideClick: false,
      customClass: {
        popup: 'rounded-2xl border border-gray-200 shadow-xl'
      },
      didOpen: () => {
        MySwal.showLoading();
      }
    });
    
    try {
      const response = await feeApi.post(`/terms/${termId}/set-current`);
      const updatedTerm = handleApiResponse(response);
      
      MySwal.close();
      
      dispatch({
        type: 'SET_CURRENT_TERM',
        payload: { ...updatedTerm, isCurrent: true }
      });
      
      const updatedTerms = state.terms.map(term => ({
        ...term,
        isCurrent: term.id === termId
      }));
      
      dispatch({
        type: 'SET_TERMS',
        payload: updatedTerms
      });
      
      showSuccessAlert(
        'Term Updated',
        `${updatedTerm.termName} is now the current term.`
      );
      
    } catch (error) {
      MySwal.close();
      const errorMessage = handleApiError(error, 'setting current term');
      
      if (error.response?.status === 409 || 
          errorMessage.includes('already') ||
          errorMessage.includes('current')) {
        
        MySwal.fire({
          title: <span className="text-amber-600">Term Already Current</span>,
          html: <p className="text-gray-700">This term is already set as the current term.</p>,
          icon: 'info',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3b82f6',
          showCloseButton: true,
          customClass: {
            popup: 'rounded-2xl border border-gray-200 shadow-xl',
            title: 'text-lg font-bold',
            confirmButton: 'px-4 py-2 rounded-lg font-medium'
          }
        });
        
        const updatedTerms = state.terms.map(term => ({
          ...term,
          isCurrent: term.id === termId
        }));
        
        const currentTerm = updatedTerms.find(term => term.id === termId);
        
        if (currentTerm) {
          dispatch({
            type: 'SET_CURRENT_TERM',
            payload: { ...currentTerm, isCurrent: true }
          });
        }
        
        dispatch({
          type: 'SET_TERMS',
          payload: updatedTerms
        });
        
      } else {
        showErrorAlert('Failed to Set Current Term', errorMessage);
      }
      
    } finally {
      setLoadingState('settingCurrent', false);
    }
  };

  // ========== QUICK ACTIONS ==========

  const quickActions = useMemo(() => {
    const actions = [
      {
        title: 'Fee Structures',
        description: 'Manage grade-wise fee configurations',
        icon: FileText,
        color: 'bg-blue-100 text-blue-600',
        link: '/accountant/term-fees/structures',
        requiredRoles: ['ADMIN', 'ACCOUNTANT']
      },
      {
        title: 'Additional Fees',
        description: 'Add special or one-time fees',
        icon: Plus,
        color: 'bg-green-100 text-green-600',
        link: '/accountant/term-fees/additional-fees',
        requiredRoles: ['ADMIN', 'ACCOUNTANT']
      },
      {
        title: 'Academic History',
        description: 'View previous academic years',
        icon: History,
        color: 'bg-purple-100 text-purple-600',
        action: fetchAcademicYearHistory,
        requiredRoles: ['ADMIN', 'ACCOUNTANT', 'TEACHER']
      },
      {
        title: 'Term Fee Dashboard',
        description: 'View fee collection overview',
        icon: Settings,
        color: 'bg-amber-100 text-amber-600',
        link: '/accountant/term-fees/dashboard',
        requiredRoles: ['ADMIN', 'ACCOUNTANT', 'TEACHER']
      }
    ];
    
    return actions.filter(action => {
      if (!action.requiredRoles || action.requiredRoles.length === 0) return true;
      return hasAnyRole(action.requiredRoles) || isAdmin || isAccountant;
    });
  }, [isAdmin, isAccountant, hasAnyRole, fetchAcademicYearHistory]);

  // ========== RENDER LOGIC ==========

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const isLoading = state.loadingStates.refreshing || state.loadingStates.terms;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Term Management</h1>
                <p className="text-gray-600">Manage academic terms and their configurations</p>
              </div>
            </div>
            
            {/* User Info */}
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">
                  {user?.fullName || user?.username || user?.email || 'User'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-gray-500" />
                <div className="flex gap-1">
                  {user?.role && <RoleBadge role={user.role} />}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => logout()}
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
            <button
              onClick={refreshAllData}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-xl border border-gray-200 shadow-sm disabled:opacity-50 transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Refreshing...' : 'Refresh Data'}
            </button>
            {(isAdmin || isAccountant || hasRole('ADMIN') || hasRole('ACCOUNTANT')) && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => showTermForm()}
                disabled={state.loadingStates.savingTerm}
                className="bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-2.5 px-5 rounded-xl flex items-center shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
              >
                {state.loadingStates.savingTerm ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5 mr-2" />
                    Create New Term
                  </>
                )}
              </motion.button>
            )}
          </div>
        </div>

        {/* Current Term Card */}
        {state.currentTerm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center mb-2">
                    <Calendar className="w-6 h-6 mr-2" />
                    <p className="text-sm font-medium opacity-90">CURRENT TERM</p>
                  </div>
                  <h2 className="text-3xl font-bold mt-1 mb-4">{state.currentTerm.termName}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                      <p className="text-sm opacity-90">Academic Year</p>
                      <p className="text-xl font-semibold">{state.currentTerm.academicYear}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                      <p className="text-sm opacity-90">Start Date</p>
                      <p className="text-xl font-semibold">
                        {state.currentTerm.startDate ? new Date(state.currentTerm.startDate).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        }) : 'Not set'}
                      </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                      <p className="text-sm opacity-90">End Date</p>
                      <p className="text-xl font-semibold">
                        {state.currentTerm.endDate ? new Date(state.currentTerm.endDate).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        }) : 'Not set'}
                      </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                      <p className="text-sm opacity-90">Fee Due Date</p>
                      <p className="text-xl font-semibold">
                        {state.currentTerm.feeDueDate ? new Date(state.currentTerm.feeDueDate).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        }) : 'Not set'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium flex items-center">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  ACTIVE
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -4 }}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={action.action || (() => navigate(action.link))}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && (action.action ? action.action() : navigate(action.link))}
              >
                <div className="flex items-start">
                  <div className={`p-3 rounded-lg ${action.color} mr-3 group-hover:scale-110 transition-transform duration-300`}>
                    <action.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Terms List */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-800">All Academic Terms</h2>
              <p className="text-gray-600 mt-1">Manage and configure academic terms</p>
            </div>
            <div className="text-sm text-gray-600">
              {state.terms.length} term{state.terms.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {state.loadingStates.terms ? (
            <LoadingSpinner text="Loading terms..." />
          ) : state.errors.terms ? (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-red-300 mx-auto mb-4" />
              <p className="text-gray-700 mb-4">{state.errors.terms}</p>
              <button
                onClick={fetchTerms}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : state.terms.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No terms found</h3>
              <p className="text-gray-600 mb-6">Create your first academic term to get started</p>
              {(isAdmin || isAccountant || hasRole('ADMIN') || hasRole('ACCOUNTANT')) && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => showTermForm()}
                  className="bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-2.5 px-5 rounded-xl flex items-center shadow-lg hover:shadow-xl transition-all duration-200 mx-auto"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create New Term
                </motion.button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Term
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Academic Year
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Fee Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {state.terms.map((term) => (
                    <motion.tr
                      key={term.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`hover:bg-gray-50 transition-colors ${
                        term.isCurrent ? 'bg-blue-50' : ''
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {term.isCurrent && (
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                          )}
                          <div>
                            <span className="font-semibold text-gray-900">{term.termName}</span>
                            {term.isCurrent && (
                              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                Current
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-900 font-medium">{term.academicYear}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {term.startDate ? new Date(term.startDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          }) : 'N/A'}
                          <span className="mx-2">→</span>
                          {term.endDate ? new Date(term.endDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          }) : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                          <Calendar className="w-3 h-3 mr-1" />
                          {term.feeDueDate ? new Date(term.feeDueDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          }) : 'Not set'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                          term.isCurrent
                            ? 'bg-green-100 text-green-800'
                            : term.isActive
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {term.isCurrent ? 'Current' : term.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TermManagement;