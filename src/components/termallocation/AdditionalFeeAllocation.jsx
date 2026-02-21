/* eslint-disable no-unused-vars */
import React, { useState, useMemo, useEffect, useCallback, useReducer } from 'react';
import {
  Search,
  Plus,
  Trash2,
  Calendar,
  DollarSign,
  Users,
  CheckCircle,
  AlertTriangle,
  Clock,
  Loader2,
  AlertCircle,
  User,
  FilePlus,
  Shield,
  LogOut,
  RefreshCw,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const MySwal = withReactContent(Swal);

// ============================================
// API SERVICE - Fee Allocation
// ============================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// Create fee management API instance
const feeApi = axios.create({
  baseURL: '${API_BASE_URL}/v1/fee-management',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Apply interceptors matching your existing pattern
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

// Create student API instance
const studentApi = axios.create({
  baseURL: '${API_BASE_URL}/v1',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  }
});

studentApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Generic API response handler
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

// Generic API error handler
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

// Unauthorized handler
const handleUnauthorized = () => {
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
  localStorage.removeItem('user');
  
  MySwal.fire({
    title: 'Session Expired',
    text: 'Your session has expired. Please login again.',
    icon: 'warning',
    confirmButtonText: 'Login',
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
  activeTab: 'single',
  loadingStates: {
    initial: false,
    students: false,
    terms: false,
    feeHistory: false,
    submitting: false,
    deleting: false,
    refreshing: false
  },
  errors: {
    students: null,
    terms: null,
    submit: null,
    delete: null
  },
  students: [],
  selectedStudent: null,
  bulkSelectedStudents: [],
  terms: [],
  currentTerm: null,
  feeHistory: [],
  searchQuery: ''
};

function feeReducer(state, action) {
  switch (action.type) {
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    
    case 'SET_STUDENTS':
      return {
        ...state,
        students: action.payload,
        errors: { ...state.errors, students: null }
      };
    
    case 'SET_SELECTED_STUDENT':
      return { ...state, selectedStudent: action.payload };
    
    case 'SET_BULK_SELECTED_STUDENTS':
      return { ...state, bulkSelectedStudents: action.payload };
    
    case 'SET_TERMS':
      return {
        ...state,
        terms: action.payload.terms,
        currentTerm: action.payload.currentTerm,
        errors: { ...state.errors, terms: null }
      };
    
    case 'SET_FEE_HISTORY':
      return { ...state, feeHistory: action.payload };
    
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    
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

// ========== MAIN COMPONENT ==========

const AdditionalFeeAllocation = () => {
  const navigate = useNavigate();
  const { 
    user, 
    isAuthenticated, 
    isAdmin, 
    isAccountant, 
    hasRole, 
    hasAnyRole,
    logout,
    showAlert
  } = useAuth();
  
  const [state, dispatch] = useReducer(feeReducer, initialState);
  
  const [formData, setFormData] = useState({
    termId: '',
    itemName: '',
    feeType: 'OTHER',
    amount: '',
    dueDate: '',
    isMandatory: false,
    notes: '',
    itemType: 'ADDITIONAL'
  });
  
  const [formErrors, setFormErrors] = useState({});

  // ========== DATA FETCHING ==========

  const setLoading = useCallback((key, value) => {
    dispatch({ type: 'SET_LOADING', payload: { [key]: value } });
  }, []);

  const setError = useCallback((key, error) => {
    dispatch({ type: 'SET_ERROR', payload: { key, error } });
  }, []);

  const fetchStudents = useCallback(async () => {
    setLoading('students', true);
    try {
      const response = await studentApi.get('/students');
      const responseData = handleApiResponse(response);
      
      let studentsArray = [];
      
      if (Array.isArray(responseData)) {
        studentsArray = responseData;
      } else if (responseData && typeof responseData === 'object') {
        if (Array.isArray(responseData.students)) {
          studentsArray = responseData.students;
        } else if (Array.isArray(responseData.data)) {
          studentsArray = responseData.data;
        } else if (Array.isArray(responseData.content)) {
          studentsArray = responseData.content;
        }
      }
      
      dispatch({
        type: 'SET_STUDENTS',
        payload: studentsArray
      });
      
    } catch (error) {
      const errorMessage = handleApiError(error, 'fetching students');
      setError('students', errorMessage);
      console.error('Students fetch error:', error);
    } finally {
      setLoading('students', false);
    }
  }, [setLoading, setError]);

  const fetchTerms = useCallback(async () => {
    setLoading('terms', true);
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
        }
      }
      
      if (!Array.isArray(termsArray)) {
        console.warn('Terms data is not an array:', termsArray);
        termsArray = [];
      }
      
      dispatch({
        type: 'SET_TERMS',
        payload: {
          terms: termsArray,
          currentTerm: currentTerm
        }
      });
      
      // Set default term in form
      if (currentTerm) {
        setFormData(prev => ({ ...prev, termId: currentTerm.id }));
      }
      
    } catch (error) {
      const errorMessage = handleApiError(error, 'fetching terms');
      setError('terms', errorMessage);
      console.error('Terms fetch error:', error);
    } finally {
      setLoading('terms', false);
    }
  }, [setLoading, setError]);

  const fetchFeeHistory = useCallback(async (studentId) => {
    if (!studentId) return;
    
    setLoading('feeHistory', true);
    try {
      const response = await feeApi.get(`/additional-fees/student/${studentId}`);
      const responseData = handleApiResponse(response);
      
      let historyArray = [];
      
      if (Array.isArray(responseData)) {
        historyArray = responseData;
      } else if (responseData && typeof responseData === 'object') {
        if (Array.isArray(responseData.data)) {
          historyArray = responseData.data;
        } else if (Array.isArray(responseData.fees)) {
          historyArray = responseData.fees;
        } else if (Array.isArray(responseData.content)) {
          historyArray = responseData.content;
        }
      }
      
      dispatch({
        type: 'SET_FEE_HISTORY',
        payload: historyArray
      });
      
    } catch (error) {
      console.error('Fee history fetch error:', error);
      dispatch({ type: 'SET_FEE_HISTORY', payload: [] });
    } finally {
      setLoading('feeHistory', false);
    }
  }, [setLoading]);

  const refreshAllData = useCallback(async () => {
    dispatch({ type: 'RESET_ERRORS' });
    setLoading('refreshing', true);
    
    try {
      await Promise.all([fetchStudents(), fetchTerms()]);
      
      if (state.selectedStudent) {
        await fetchFeeHistory(state.selectedStudent.id);
      }
      
      showAlert('success', 'Data Refreshed', 'All data has been refreshed successfully.');
      return true;
    } catch (error) {
      console.error('Refresh error:', error);
      showAlert('error', 'Refresh Failed', 'Failed to refresh data');
      return false;
    } finally {
      setLoading('refreshing', false);
    }
  }, [fetchStudents, fetchTerms, fetchFeeHistory, state.selectedStudent, showAlert, setLoading]);

  // ========== INITIAL LOAD ==========

  useEffect(() => {
    const loadInitialData = async () => {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }
      
      setLoading('initial', true);
      try {
        await Promise.all([fetchStudents(), fetchTerms()]);
      } catch (error) {
        console.error('Initial load error:', error);
      } finally {
        setLoading('initial', false);
      }
    };
    
    loadInitialData();
  }, [isAuthenticated, navigate, fetchStudents, fetchTerms, setLoading]);

  useEffect(() => {
    if (state.selectedStudent) {
      fetchFeeHistory(state.selectedStudent.id);
    }
  }, [state.selectedStudent, fetchFeeHistory]);

  // ========== FORM HANDLING ==========

  const validateForm = () => {
    const errors = {};
    
    if (state.activeTab === 'single' && !state.selectedStudent) {
      errors.student = 'Please select a student';
    }
    
    if (state.activeTab === 'bulk' && state.bulkSelectedStudents.length === 0) {
      errors.students = 'Please select at least one student';
    }
    
    if (!formData.itemName.trim()) {
      errors.itemName = 'Fee item name is required';
    }
    
    if (!formData.termId) {
      errors.termId = 'Please select a term';
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      errors.amount = 'Please enter a valid amount';
    }
    
    if (!formData.dueDate) {
      errors.dueDate = 'Due date is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading('submitting', true);
    
    try {
      if (state.activeTab === 'single') {
        const feeRequest = {
          ...formData,
          studentId: state.selectedStudent.id,
          amount: parseFloat(formData.amount),
        };

        const response = await feeApi.post('/additional-fees', feeRequest);
        const result = handleApiResponse(response);
        
        showAlert('success', 'Fee Added', 'Additional fee has been allocated successfully!');
        
        // Reset form
        setFormData({
          termId: state.currentTerm?.id || '',
          itemName: '',
          feeType: 'OTHER',
          amount: '',
          dueDate: '',
          isMandatory: false,
          notes: '',
          itemType: 'ADDITIONAL'
        });
        
        setFormErrors({});
        
        // Reload history
        if (state.selectedStudent) {
          await fetchFeeHistory(state.selectedStudent.id);
        }
      } else {
        // Bulk submission
        const bulkRequest = {
          ...formData,
          studentIds: state.bulkSelectedStudents.map(s => s.id),
          amount: parseFloat(formData.amount),
        };

        const response = await feeApi.post('/additional-fees/bulk', bulkRequest);
        const result = handleApiResponse(response);
        
        showAlert('success', 'Fees Allocated', 
          `Additional fees have been allocated to ${result.successCount || state.bulkSelectedStudents.length} students`
        );
        
        // Reset bulk selection
        dispatch({ type: 'SET_BULK_SELECTED_STUDENTS', payload: [] });
        setFormErrors({});
      }
      
    } catch (error) {
      const errorMessage = handleApiError(error, 'allocating fees');
      showAlert('error', 'Allocation Failed', errorMessage);
      console.error('Submit error:', error);
    } finally {
      setLoading('submitting', false);
    }
  };

  const handleDeleteFee = async (feeItemId) => {
    if (!isAdmin && !hasRole('ADMIN')) {
      showAlert('error', 'Access Denied', 'Only administrators can delete fees');
      return;
    }
    
    const result = await showConfirmDialog(
      'Delete Fee Item',
      'Are you sure you want to delete this additional fee item?',
      'Yes, delete it',
      'Cancel'
    );

    if (!result.isConfirmed) return;

    setLoading('deleting', true);
    
    try {
      const response = await feeApi.delete(`/additional-fees/${feeItemId}`);
      handleApiResponse(response);
      
      showAlert('success', 'Fee Deleted', 'Additional fee item has been deleted.');
      
      if (state.selectedStudent) {
        await fetchFeeHistory(state.selectedStudent.id);
      }
      
    } catch (error) {
      const errorMessage = handleApiError(error, 'deleting fee');
      showAlert('error', 'Delete Failed', errorMessage);
      console.error('Delete error:', error);
    } finally {
      setLoading('deleting', false);
    }
  };

  // ========== STUDENT SELECTION HANDLERS ==========

  const handleStudentSelect = (student) => {
    dispatch({ type: 'SET_SELECTED_STUDENT', payload: student });
    
    if (formErrors.student) {
      setFormErrors({
        ...formErrors,
        student: ''
      });
    }
  };

  const toggleBulkStudent = (student) => {
    const isSelected = state.bulkSelectedStudents.some(s => s.id === student.id);
    if (isSelected) {
      dispatch({
        type: 'SET_BULK_SELECTED_STUDENTS',
        payload: state.bulkSelectedStudents.filter(s => s.id !== student.id)
      });
    } else {
      dispatch({
        type: 'SET_BULK_SELECTED_STUDENTS',
        payload: [...state.bulkSelectedStudents, student]
      });
    }
    
    if (formErrors.students) {
      setFormErrors({
        ...formErrors,
        students: ''
      });
    }
  };

  const selectAllStudents = () => {
    if (state.bulkSelectedStudents.length === filteredStudentsForBulk.length) {
      dispatch({ type: 'SET_BULK_SELECTED_STUDENTS', payload: [] });
    } else {
      dispatch({
        type: 'SET_BULK_SELECTED_STUDENTS',
        payload: [...filteredStudentsForBulk]
      });
    }
    
    if (formErrors.students) {
      setFormErrors({
        ...formErrors,
        students: ''
      });
    }
  };

  const handleSearchChange = (e) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value });
  };

  // ========== FILTERED STUDENTS ==========

  const filteredStudents = useMemo(() => {
    return state.students.filter(student => {
      const matchesSearch = state.searchQuery === '' || 
        [student.fullName, student.studentId, student.grade, student.email]
          .some(field => field?.toLowerCase().includes(state.searchQuery.toLowerCase()));
      return matchesSearch;
    });
  }, [state.searchQuery, state.students]);

  const filteredStudentsForBulk = useMemo(() => {
    return state.students.filter(student => {
      const matchesSearch = state.searchQuery === '' || 
        [student.fullName, student.studentId, student.grade]
          .some(field => field?.toLowerCase().includes(state.searchQuery.toLowerCase()));
      return matchesSearch;
    });
  }, [state.searchQuery, state.students]);

  // ========== RENDER LOGIC ==========

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const isLoading = state.loadingStates.refreshing || state.loadingStates.initial;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FilePlus className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Additional Fee Allocation</h1>
                <p className="text-gray-600">Add special or one-time fees to individual students or in bulk</p>
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
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: 'single' })}
              className={`px-6 py-3 rounded-xl font-medium flex items-center transition-all duration-200 ${
                state.activeTab === 'single'
                  ? 'bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <User className="w-5 h-5 mr-2" />
              Single Student
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: 'bulk' })}
              className={`px-6 py-3 rounded-xl font-medium flex items-center transition-all duration-200 ${
                state.activeTab === 'bulk'
                  ? 'bg-linear-to-r from-green-600 to-green-700 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <Users className="w-5 h-5 mr-2" />
              Bulk Allocation
            </motion.button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Panel - Student Selection */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center mb-6">
              {state.activeTab === 'single' ? (
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
              ) : (
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
              )}
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  {state.activeTab === 'single' ? 'Select Student' : 'Select Students'}
                </h2>
                <p className="text-sm text-gray-600">
                  {state.activeTab === 'single' ? 'Choose a student' : 'Choose multiple students'}
                </p>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, student ID, or grade..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200"
                  value={state.searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
            </div>

            {formErrors.student && state.activeTab === 'single' && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {formErrors.student}
                </p>
              </div>
            )}

            {formErrors.students && state.activeTab === 'bulk' && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {formErrors.students}
                </p>
              </div>
            )}

            {state.loadingStates.students ? (
              <LoadingSpinner text="Loading students..." />
            ) : state.errors.students ? (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-red-300 mx-auto mb-4" />
                <p className="text-gray-700 mb-4">{state.errors.students}</p>
                <button
                  onClick={fetchStudents}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : (
              <>
                {state.activeTab === 'single' ? (
                  <div className="space-y-3 max-h-100 overflow-y-auto pr-2">
                    {filteredStudents.map((student) => (
                      <motion.div
                        key={student.id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleStudentSelect(student)}
                        className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                          state.selectedStudent?.id === student.id
                            ? 'bg-linear-to-r from-blue-50 to-blue-100 border-2 border-blue-200'
                            : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${
                            state.selectedStudent?.id === student.id
                              ? 'bg-blue-600 text-white'
                              : 'bg-blue-100 text-blue-600'
                          }`}>
                            <span className="font-bold text-lg">
                              {student.fullName?.charAt(0) || 'S'}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{student.fullName}</p>
                            <p className="text-sm text-gray-600">
                              {student.studentId} • Grade {student.grade}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              <span className="font-medium">Pending:</span> KES {student.pendingAmount?.toLocaleString() || 0}
                            </p>
                          </div>
                          {state.selectedStudent?.id === student.id && (
                            <CheckCircle className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-gray-600">
                        {state.bulkSelectedStudents.length} of {filteredStudentsForBulk.length} selected
                      </span>
                      <button
                        onClick={selectAllStudents}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {state.bulkSelectedStudents.length === filteredStudentsForBulk.length ? 'Deselect All' : 'Select All'}
                      </button>
                    </div>
                    
                    <div className="space-y-3 max-h-87.5 overflow-y-auto pr-2">
                      {filteredStudentsForBulk.map((student) => {
                        const isSelected = state.bulkSelectedStudents.some(s => s.id === student.id);
                        return (
                          <motion.div
                            key={student.id}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => toggleBulkStudent(student)}
                            className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                              isSelected
                                ? 'bg-linear-to-r from-green-50 to-green-100 border-2 border-green-200'
                                : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                                  isSelected
                                    ? 'bg-green-600 text-white'
                                    : 'bg-green-100 text-green-600'
                                }`}>
                                  <span className="font-bold">
                                    {student.fullName?.charAt(0) || 'S'}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{student.fullName}</p>
                                  <p className="text-sm text-gray-500">
                                    {student.studentId} • Grade {student.grade}
                                  </p>
                                </div>
                              </div>
                              {isSelected && (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right Panel - Fee Allocation Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-linear-to-r from-purple-100 to-purple-200 rounded-xl mr-4">
                <FilePlus className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Additional Fee Allocation Form</h2>
                <p className="text-gray-600">Configure additional fees for selected students</p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Fee Item Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="itemName"
                    required
                    disabled={state.loadingStates.submitting}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      formErrors.itemName 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:border-purple-500 focus:ring-purple-500'
                    } focus:ring-2 focus:ring-opacity-20 transition-all duration-200 disabled:bg-gray-50`}
                    value={formData.itemName}
                    onChange={handleInputChange}
                    placeholder="e.g., Sports Equipment, Field Trip, Science Kit"
                  />
                  {formErrors.itemName && (
                    <p className="text-sm text-red-600 mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {formErrors.itemName}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Fee Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="feeType"
                    required
                    disabled={state.loadingStates.submitting}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-20 transition-all duration-200 bg-white disabled:bg-gray-50"
                    value={formData.feeType}
                    onChange={handleInputChange}
                  >
                    <option value="TUITION">Tuition Fee</option>
                    <option value="BASIC">Basic Fee</option>
                    <option value="EXAMINATION">Examination Fee</option>
                    <option value="TRANSPORT">Transport Fee</option>
                    <option value="LIBRARY">Library Fee</option>
                    <option value="SPORTS">Sports Fee</option>
                    <option value="ACTIVITY">Activity Fee</option>
                    <option value="HOSTEL">Hostel Fee</option>
                    <option value="UNIFORM">Uniform Fee</option>
                    <option value="BOOKS">Book Fee</option>
                    <option value="OTHER">Other Fee</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Term <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="termId"
                    required
                    disabled={state.loadingStates.submitting}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      formErrors.termId 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:border-purple-500 focus:ring-purple-500'
                    } focus:ring-2 focus:ring-opacity-20 transition-all duration-200 bg-white disabled:bg-gray-50`}
                    value={formData.termId}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Term</option>
                    {state.terms.map((term) => (
                      <option key={term.id} value={term.id}>
                        {term.termName} ({term.academicYear})
                      </option>
                    ))}
                  </select>
                  {formErrors.termId && (
                    <p className="text-sm text-red-600 mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {formErrors.termId}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Amount (KES) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">KES</span>
                    <input
                      type="number"
                      name="amount"
                      required
                      step="0.01"
                      min="0"
                      disabled={state.loadingStates.submitting}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                        formErrors.amount 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:border-purple-500 focus:ring-purple-500'
                      } focus:ring-2 focus:ring-opacity-20 transition-all duration-200 disabled:bg-gray-50`}
                      value={formData.amount}
                      onChange={handleInputChange}
                      placeholder="0.00"
                    />
                  </div>
                  {formErrors.amount && (
                    <p className="text-sm text-red-600 mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {formErrors.amount}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Due Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      name="dueDate"
                      required
                      disabled={state.loadingStates.submitting}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                        formErrors.dueDate 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:border-purple-500 focus:ring-purple-500'
                      } focus:ring-2 focus:ring-opacity-20 transition-all duration-200 disabled:bg-gray-50`}
                      value={formData.dueDate}
                      onChange={handleInputChange}
                    />
                  </div>
                  {formErrors.dueDate && (
                    <p className="text-sm text-red-600 mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {formErrors.dueDate}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Notes (Optional)
                  </label>
                  <textarea
                    name="notes"
                    disabled={state.loadingStates.submitting}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-20 transition-all duration-200 disabled:bg-gray-50"
                    rows="3"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Add any description or notes for this additional fee..."
                  />
                </div>
              </div>

              <div className="flex items-center mb-8">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="isMandatory"
                      className="sr-only"
                      disabled={state.loadingStates.submitting}
                      checked={formData.isMandatory}
                      onChange={handleInputChange}
                    />
                    <div className={`w-12 h-6 rounded-full transition-all duration-200 ${
                      formData.isMandatory ? 'bg-purple-600' : 'bg-gray-300'
                    }`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200 ${
                        formData.isMandatory ? 'left-7' : 'left-1'
                      }`}></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">Mark as mandatory fee</span>
                </label>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                <div>
                  {state.activeTab === 'single' ? (
                    state.selectedStudent && (
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <span className="font-bold text-blue-600">
                            {state.selectedStudent.fullName?.charAt(0) || 'S'}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Allocating fee to:</p>
                          <p className="font-semibold text-gray-900">{state.selectedStudent.fullName}</p>
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                        <Users className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Selected students:</p>
                        <p className="font-semibold text-gray-900">{state.bulkSelectedStudents.length} students</p>
                      </div>
                    </div>
                  )}
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={state.loadingStates.submitting || 
                    (state.activeTab === 'single' && !state.selectedStudent) || 
                    (state.activeTab === 'bulk' && state.bulkSelectedStudents.length === 0)}
                  className="bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-medium py-3 px-8 rounded-xl flex items-center shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {state.loadingStates.submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FilePlus className="w-5 h-5 mr-2" />
                      Allocate Additional Fee
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </div>

          {/* Additional Fees History */}
          {state.activeTab === 'single' && state.selectedStudent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 bg-white rounded-2xl shadow-xl border border-gray-100"
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">Additional Fees History</h2>
                    <p className="text-sm text-gray-600">Previously allocated fees for {state.selectedStudent.fullName}</p>
                  </div>
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                    {state.feeHistory.length} items
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                {state.loadingStates.feeHistory ? (
                  <LoadingSpinner text="Loading fee history..." />
                ) : state.feeHistory.length > 0 ? (
                  <div className="overflow-x-auto rounded-xl border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Fee Item
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Due Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {state.feeHistory.map((fee) => (
                          <tr key={fee.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-gray-900">{fee.itemName}</td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-800 font-medium">
                                {fee.feeType.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-semibold text-gray-900">
                              KES {fee.amount?.toLocaleString()}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center text-gray-700">
                                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                {new Date(fee.dueDate).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                fee.status === 'PAID' 
                                  ? 'bg-green-100 text-green-800'
                                  : fee.status === 'PARTIAL'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {fee.status === 'PAID' && <CheckCircle className="w-3 h-3 mr-1" />}
                                {fee.status === 'PARTIAL' && <AlertTriangle className="w-3 h-3 mr-1" />}
                                {fee.status === 'PENDING' && <Clock className="w-3 h-3 mr-1" />}
                                {fee.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {!fee.isAutoGenerated && (isAdmin || isAccountant || hasRole('ADMIN') || hasRole('ACCOUNTANT')) && (
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleDeleteFee(fee.id)}
                                  disabled={state.loadingStates.deleting}
                                  className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center px-3 py-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                >
                                  <Trash2 className="w-4 h-4 mr-1.5" />
                                  {state.loadingStates.deleting ? 'Deleting...' : 'Delete'}
                                </motion.button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <DollarSign className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No additional fees found</h3>
                    <p className="text-gray-600">No additional fees have been allocated to this student yet.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdditionalFeeAllocation;