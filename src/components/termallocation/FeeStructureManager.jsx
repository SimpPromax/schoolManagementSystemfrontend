/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback, useMemo, useReducer, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  DollarSign,
  BookOpen,
  GraduationCap,
  Bus,
  Book,
  Shirt,
  Trophy,
  Library,
  Activity,
  Home,
  Loader2,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Shield,
  User,
  LogOut,
  RefreshCw,
  Calendar,
  ChevronRight,
  FileText,
  History,
  Settings,
  ChevronDown,
  Zap,
  Users,
  Folder
} from 'lucide-react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const MySwal = withReactContent(Swal);

// ========== SWEETALERT2 STYLING ==========

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
    confirmButtonText: 'Try Again',
    confirmButtonColor: '#ef4444',
    showCloseButton: true,
    customClass: {
      popup: 'rounded-2xl border border-gray-200 shadow-xl',
      title: 'text-lg font-bold',
      confirmButton: 'px-4 py-2 rounded-lg font-medium'
    }
  });
};

const showWarningAlert = (title, message) => {
  return MySwal.fire({
    title: <span className="text-amber-600">{title}</span>,
    html: <p className="text-gray-700">{message}</p>,
    icon: 'warning',
    confirmButtonColor: '#f59e0b',
    cancelButtonColor: '#6b7280',
    showCloseButton: true,
    customClass: {
      popup: 'rounded-2xl border border-gray-200 shadow-xl',
      title: 'text-lg font-bold',
      confirmButton: 'px-4 py-2 rounded-lg font-medium',
      cancelButton: 'px-4 py-2 rounded-lg font-medium'
    },
    showConfirmButton: true,
    showCancelButton: false,
    confirmButtonText: 'OK'
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

// ========== API CONFIGURATION ==========

// Create fee management API instance
const feeApi = axios.create({
  baseURL: 'http://localhost:8080/api/v1/fee-management',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Create student API instance
const studentApi = axios.create({
  baseURL: 'http://localhost:8080/api/v1/students',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Apply interceptors to both APIs
const applyInterceptors = (apiInstance) => {
  apiInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  apiInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        handleUnauthorized();
      }
      return Promise.reject(error);
    }
  );
};

applyInterceptors(feeApi);
applyInterceptors(studentApi);

// Generic API response handler
const handleApiResponse = (response) => {
  const responseData = response.data;
  
  if (!responseData) {
    throw new Error('No response data received');
  }

  // Check for success flag in response
  if (responseData.success === false) {
    const error = new Error(responseData.message || 'Request failed');
    error.response = response;
    throw error;
  }

  // Return data field if exists, otherwise return full response
  return responseData.data || responseData;
};

// Generic API error handler
const handleApiError = (error, context = '') => {
  console.error(`API Error in ${context}:`, error.response?.data || error.message);

  if (error.response) {
    const errorData = error.response.data;
    
    // Extract message from different response formats
    let message = 'Request failed';
    
    if (typeof errorData === 'string') {
      message = errorData;
    } else if (errorData && typeof errorData === 'object') {
      message = errorData.message || errorData.error || errorData.exception || 
               errorData.errorMessage || 'Server error occurred';
    }
    
    // Status-specific handling
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
    customClass: {
      popup: 'rounded-2xl border border-gray-200 shadow-xl',
      title: 'text-lg font-bold',
      confirmButton: 'px-4 py-2 rounded-lg font-medium'
    }
  }).then(() => {
    window.location.href = '/login';
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

// Fee Type Icons
const FeeTypeIcon = ({ type }) => {
  const icons = {
    TUITION: GraduationCap,
    BASIC: BookOpen,
    EXAMINATION: Book,
    TRANSPORT: Bus,
    LIBRARY: Library,
    SPORTS: Trophy,
    ACTIVITY: Activity,
    HOSTEL: Home,
    UNIFORM: Shirt,
    BOOKS: Book,
    OTHER: DollarSign
  };
  
  const Icon = icons[type] || DollarSign;
  
  return <Icon className="w-5 h-5" />;
};

// Helper to extract numeric part from grade string
const extractGradeNumber = (grade) => {
  if (!grade || typeof grade !== 'string') return null;
  
  // Remove "Grade " prefix if present
  const cleanGrade = grade.replace(/^Grade\s*/i, '');
  
  // Extract first sequence of digits
  const match = cleanGrade.match(/^(\d+)/);
  return match ? parseInt(match[1], 10) : null;
};

// Enhanced Custom Dropdown Component
const CustomDropdown = ({ 
  value, 
  onChange, 
  options, 
  placeholder = "Select...", 
  disabled = false,
  error = null,
  className = "",
  name,
  required = false,
  displayKey = "name",
  valueKey = "id",
  label = null,
  loading = false,
  loadingText = "Loading..."
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDisplayValue = (option) => {
    if (option === null || option === undefined) {
      return '';
    }
    
    if (typeof option === 'object') {
      // Handle object options
      if (displayKey && option[displayKey] !== undefined) {
        const displayValue = option[displayKey];
        return displayValue === null || displayValue === undefined ? '' : String(displayValue);
      }
      if (option.name !== undefined) {
        const nameValue = option.name;
        return nameValue === null || nameValue === undefined ? '' : String(nameValue);
      }
      if (option.termName !== undefined && option.academicYear !== undefined) {
        return `${option.termName} ${option.academicYear}`;
      }
      if (option.grade !== undefined) {
        const gradeValue = option.grade;
        return gradeValue === null || gradeValue === undefined ? '' : String(gradeValue);
      }
      // Fallback: try to stringify
      try {
        return JSON.stringify(option);
      } catch {
        return 'Invalid option';
      }
    }
    
    // If it's not an object, return as string
    return String(option || '');
  };

  const getOptionValue = (option) => {
    if (option === null || option === undefined) {
      return '';
    }
    
    if (typeof option === 'object') {
      if (valueKey && option[valueKey] !== undefined) {
        const value = option[valueKey];
        return value === null || value === undefined ? '' : String(value);
      }
      if (option.id !== undefined) {
        const idValue = option.id;
        return idValue === null || idValue === undefined ? '' : String(idValue);
      }
      // If no id found, use display value as fallback
      return getDisplayValue(option);
    }
    
    // If it's not an object, return as string
    return String(option || '');
  };

  const handleSelect = (option) => {
    const optionValue = getOptionValue(option);
    onChange({ target: { name, value: optionValue } });
    setIsOpen(false);
  };

  // Find selected display value
  const selectedOption = options.find(option => {
    const optionValue = getOptionValue(option);
    return optionValue === value || optionValue === String(value);
  });
  
  const selectedDisplayValue = selectedOption 
    ? getDisplayValue(selectedOption)
    : value || '';

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
          {loading && (
            <span className="ml-2 text-xs text-blue-600">
              <Loader2 className="w-3 h-3 inline animate-spin" /> {loadingText}
            </span>
          )}
        </label>
      )}
      
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled || loading}
        className={`w-full px-4 py-3 rounded-lg border ${
          error 
            ? 'border-red-500 bg-red-50' 
            : isOpen
            ? 'border-indigo-500 ring-2 ring-indigo-500 ring-opacity-20'
            : 'border-gray-300 hover:border-gray-400'
        } bg-white text-left flex justify-between items-center transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed`}
      >
        <span className={!selectedDisplayValue ? 'text-gray-400' : 'text-gray-900'}>
          {selectedDisplayValue || placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>
      
      {isOpen && !loading && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.length === 0 ? (
            <div className="px-4 py-3 text-gray-500 text-center">No options available</div>
          ) : (
            options.map((option, index) => {
              const optionValue = getOptionValue(option);
              const optionDisplay = getDisplayValue(option);
              
              return (
                <div
                  key={optionValue || index}
                  className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                    value === optionValue ? 'bg-indigo-50 text-indigo-700' : 'text-gray-900'
                  }`}
                  onClick={() => handleSelect(option)}
                >
                  {optionDisplay}
                </div>
              );
            })
          )}
        </div>
      )}
      
      {error && (
        <p className="text-sm text-red-600 mt-1 flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
};

// ========== FORM VALIDATION ==========

const validateFeeStructureForm = (formData) => {
  const errors = {};
  
  if (!formData.termId) {
    errors.termId = 'Please select a term';
  }
  
  if (!formData.grade) {
    errors.grade = 'Please select a grade';
  }
  
  // Validate numeric fields
  const numericFields = ['tuitionFee', 'basicFee', 'examinationFee', 'transportFee', 
                        'libraryFee', 'sportsFee', 'activityFee', 'hostelFee', 
                        'uniformFee', 'bookFee', 'otherFees'];
  
  numericFields.forEach(field => {
    const value = formData[field];
    if (value !== '' && (isNaN(value) || parseFloat(value) < 0)) {
      errors[field] = 'Please enter a valid amount';
    }
  });
  
  return errors;
};

// ========== STATE MANAGEMENT ==========

const initialState = {
  feeStructures: [],
  terms: [],
  loadingStates: {
    feeStructures: false,
    terms: false,
    savingStructure: false,
    deletingStructure: false,
    refreshing: false,
    autoBilling: false
  },
  errors: {
    feeStructures: null,
    terms: null,
    save: null,
    delete: null,
    autoBilling: null
  }
};

function feeStructureReducer(state, action) {
  switch (action.type) {
    case 'SET_FEE_STRUCTURES':
      return {
        ...state,
        feeStructures: action.payload,
        errors: { ...state.errors, feeStructures: null }
      };
    case 'SET_TERMS':
      return {
        ...state,
        terms: action.payload,
        errors: { ...state.errors, terms: null }
      };
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

const FeeStructureManager = () => {
  const [searchParams] = useSearchParams();
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
  
  const [state, dispatch] = useReducer(feeStructureReducer, initialState);
  const [selectedTerm, setSelectedTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState(searchParams.get('grade') || '');
  const [grades, setGrades] = useState([]);
  const [gradesLoading, setGradesLoading] = useState(false);
  const [gradesError, setGradesError] = useState(null);
  
  // Auto-billing controlled state
  const [autoBillingState, setAutoBillingState] = useState({
    selectedGrade: '',
    selectedTermId: selectedTerm || '',
  });

  // ========== DATA FETCHING ==========

  const setLoadingState = useCallback((key, value) => {
    dispatch({ type: 'SET_LOADING', payload: { [key]: value } });
  }, []);

  const setError = useCallback((key, error) => {
    dispatch({ type: 'SET_ERROR', payload: { key, error } });
  }, []);

  // ========== FETCH REAL GRADES FROM DATABASE ==========

  const fetchGrades = useCallback(async () => {
    setGradesLoading(true);
    setGradesError(null);
    
    try {
      console.log('Fetching grades from API...');
      
      // Try the new grades endpoint
      const response = await studentApi.get('/grades');
      console.log('Grades API response:', response);
      
      const gradesData = handleApiResponse(response);
      console.log('Processed grades data:', gradesData);
      
      let gradesArray = [];
      
      // Handle different response formats
      if (Array.isArray(gradesData)) {
        gradesArray = gradesData;
      } else if (gradesData && typeof gradesData === 'object') {
        if (Array.isArray(gradesData.data)) {
          gradesArray = gradesData.data;
        } else if (Array.isArray(gradesData.content)) {
          gradesArray = gradesData.content;
        } else if (Array.isArray(gradesData.grades)) {
          gradesArray = gradesData.grades;
        } else {
          // Try to extract from any array in the object
          const values = Object.values(gradesData);
          const arrayValues = values.filter(v => Array.isArray(v));
          if (arrayValues.length > 0) {
            gradesArray = arrayValues[0];
          }
        }
      }
      
      console.log('Raw grades array:', gradesArray);
      
      // Clean, deduplicate, and sort grades
      gradesArray = [...new Set(gradesArray
        .filter(grade => grade != null && String(grade).trim() !== '')
        .map(grade => String(grade).trim())
      )].sort((a, b) => {
        // Extract numbers from grade strings
        const numA = extractGradeNumber(a);
        const numB = extractGradeNumber(b);
        
        // If both have numbers, compare numerically
        if (numA !== null && numB !== null) {
          return numA - numB;
        }
        
        // If only one has number, put it first
        if (numA !== null) return -1;
        if (numB !== null) return 1;
        
        // Otherwise sort alphabetically
        return a.localeCompare(b);
      });
      
      console.log('Cleaned and sorted grades:', gradesArray);
      
      setGrades(gradesArray);
      
    } catch (error) {
      console.error('Grades fetch error details:', error);
      const errorMessage = handleApiError(error, 'fetching grades');
      setGradesError(errorMessage);
      console.error('Grades fetch error:', error);
    } finally {
      setGradesLoading(false);
    }
  }, []);

  const fetchTerms = useCallback(async () => {
    setLoadingState('terms', true);
    try {
      const response = await feeApi.get('/terms');
      const responseData = handleApiResponse(response);
      
      console.log('Terms API response:', responseData);
      
      let termsArray = [];
      
      // Handle different response formats
      if (Array.isArray(responseData)) {
        termsArray = responseData;
      } else if (responseData && typeof responseData === 'object') {
        if (Array.isArray(responseData.terms)) {
          termsArray = responseData.terms;
        } else if (Array.isArray(responseData.data)) {
          termsArray = responseData.data;
        } else if (Array.isArray(responseData.content)) {
          termsArray = responseData.content;
        } else {
          const values = Object.values(responseData);
          if (Array.isArray(values)) {
            termsArray = values;
          }
        }
      }
      
      // Ensure terms is an array
      if (!Array.isArray(termsArray)) {
        console.warn('Terms data is not an array:', termsArray);
        termsArray = [];
      }
      
      // Normalize term data
      termsArray = termsArray.map(term => ({
        id: term.id || term.termId,
        termName: term.termName || term.name || '',
        academicYear: term.academicYear || '',
        startDate: term.startDate,
        endDate: term.endDate,
        feeDueDate: term.feeDueDate,
        isCurrent: Boolean(term.isCurrent || term.current),
        status: term.status || 'ACTIVE'
      }));
      
      dispatch({
        type: 'SET_TERMS',
        payload: termsArray
      });
      
      // Set default selected term
      if (termsArray.length > 0 && !selectedTerm) {
        const currentTerm = termsArray.find(t => t.isCurrent);
        setSelectedTerm(currentTerm?.id || termsArray[0].id);
      }
      
    } catch (error) {
      const errorMessage = handleApiError(error, 'fetching terms');
      setError('terms', errorMessage);
      console.error('Terms fetch error:', error);
    } finally {
      setLoadingState('terms', false);
    }
  }, [selectedTerm, setLoadingState, setError]);

  const fetchFeeStructures = useCallback(async () => {
    if (!selectedTerm) {
      dispatch({ type: 'SET_FEE_STRUCTURES', payload: [] });
      return;
    }

    setLoadingState('feeStructures', true);
    try {
      const response = await feeApi.get(`/fee-structure/term/${selectedTerm}`);
      const feeData = handleApiResponse(response);
      
      // Handle array or object response
      let feeStructuresArray = [];
      if (Array.isArray(feeData)) {
        feeStructuresArray = feeData;
      } else if (feeData && typeof feeData === 'object') {
        if (Array.isArray(feeData.data)) {
          feeStructuresArray = feeData.data;
        } else if (Array.isArray(feeData.content)) {
          feeStructuresArray = feeData.content;
        } else if (Array.isArray(feeData.feeStructures)) {
          feeStructuresArray = feeData.feeStructures;
        }
      }
      
      console.log('All fee structures from API:', feeStructuresArray);
      console.log('Selected grade:', selectedGrade);
      
      // Filter by grade if selected and grade is not empty
      if (selectedGrade && selectedGrade !== '') {
        // Extract numeric part from selected grade (e.g., "10" from "10-A")
        const selectedGradeNumber = extractGradeNumber(selectedGrade);
        console.log('Selected grade number extracted:', selectedGradeNumber);
        
        if (selectedGradeNumber !== null) {
          // Filter structures where the grade matches the extracted number
          feeStructuresArray = feeStructuresArray.filter(structure => {
            if (!structure.grade) return false;
            
            // Extract number from structure's grade (backend stores "10", "11", etc.)
            const structureGradeNumber = extractGradeNumber(structure.grade);
            console.log('Comparing:', {
              selectedGrade,
              selectedGradeNumber,
              structureGrade: structure.grade,
              structureGradeNumber,
              match: structureGradeNumber === selectedGradeNumber
            });
            
            // Compare the extracted numbers
            return structureGradeNumber === selectedGradeNumber;
          });
        } else {
          // If we can't extract a number, do a string comparison
          feeStructuresArray = feeStructuresArray.filter(structure => 
            structure.grade === selectedGrade
          );
        }
      }
      
      console.log('Filtered fee structures:', feeStructuresArray);
      
      dispatch({
        type: 'SET_FEE_STRUCTURES',
        payload: feeStructuresArray
      });
      
    } catch (error) {
      const errorMessage = handleApiError(error, 'fetching fee structures');
      setError('feeStructures', errorMessage);
      console.error('Fee structures fetch error:', error);
    } finally {
      setLoadingState('feeStructures', false);
    }
  }, [selectedTerm, selectedGrade, setLoadingState, setError]);

  // ========== REFRESH FUNCTION ==========

  const refreshAllData = useCallback(async () => {
    dispatch({ type: 'RESET_ERRORS' });
    setLoadingState('refreshing', true);
    setGradesError(null);
    
    try {
      await Promise.all([
        fetchGrades(),
        fetchTerms(),
        fetchFeeStructures()
      ]);
      
      showSuccessAlert('Data Refreshed', 'All fee structure data has been refreshed successfully.');
      return true;
    } catch (error) {
      console.error('Refresh error:', error);
      showErrorAlert('Refresh Failed', 'Failed to refresh fee structure data');
      return false;
    } finally {
      setLoadingState('refreshing', false);
    }
  }, [fetchGrades, fetchTerms, fetchFeeStructures, setLoadingState]);

  // ========== AUTO-BILLING FUNCTIONS ==========

  const handleAutoBillAllStudents = useCallback(async (termId) => {
    setLoadingState('autoBilling', true);
    
    MySwal.fire({
      title: 'Auto-billing All Students...',
      text: 'Please wait while we bill all active students.',
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
      console.log('Starting auto-billing for all students, term:', termId);
      
      const response = await feeApi.post('/auto-bill');
      const responseData = handleApiResponse(response);
      
      console.log('Auto-billing response:', responseData);
      
      // Show success message with details
      let successMessage = 'Auto-billing completed successfully.';
      if (responseData) {
        if (responseData.billedCount !== undefined) {
          successMessage += ` ${responseData.billedCount} students billed.`;
        }
        if (responseData.message) {
          successMessage += ` ${responseData.message}`;
        }
      }
      
      MySwal.close();
      showSuccessAlert('Auto-billing Complete', successMessage);
      
      // Refresh data to show updated fee structures
      await refreshAllData();
      
    } catch (error) {
      MySwal.close();
      console.error('Auto-billing error:', error);
      const errorMessage = handleApiError(error, 'auto-billing');
      showErrorAlert('Auto-billing Failed', errorMessage);
    } finally {
      setLoadingState('autoBilling', false);
    }
  }, [setLoadingState, refreshAllData]);

  const handleAutoBillByGrade = useCallback(async (grade, termId) => {
    setLoadingState('autoBilling', true);
    
    MySwal.fire({
      title: 'Auto-billing Grade...',
      text: `Please wait while we bill students in ${grade}.`,
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
      console.log('Auto-billing grade:', grade, 'term:', termId);
      
      // First, get all students in this grade
      const studentsResponse = await studentApi.get(`/filter?grade=${encodeURIComponent(grade)}`);
      const studentsData = handleApiResponse(studentsResponse);
      
      console.log('Students in grade:', studentsData);
      
      let studentsArray = [];
      if (Array.isArray(studentsData)) {
        studentsArray = studentsData;
      } else if (studentsData && typeof studentsData === 'object') {
        if (Array.isArray(studentsData.data)) {
          studentsArray = studentsData.data;
        } else if (Array.isArray(studentsData.content)) {
          studentsArray = studentsData.content;
        } else if (Array.isArray(studentsData.students)) {
          studentsArray = studentsData.students;
        }
      }
      
      // Filter active students
      const activeStudents = studentsArray.filter(student => 
        student.status === 'ACTIVE' || student.status === 'ENROLLED'
      );
      
      console.log(`Active students in ${grade}:`, activeStudents.length);
      
      if (activeStudents.length === 0) {
        MySwal.close();
        showWarningAlert('No Active Students', `No active students found in grade ${grade}.`);
        setLoadingState('autoBilling', false);
        return;
      }

      MySwal.close();
      
      const result = await showConfirmDialog(
        'Confirm Grade Auto-billing',
        `This will bill ${activeStudents.length} active students in ${grade} for the selected term. Continue?`,
        'Yes, Bill These Students',
        'Cancel'
      );

      if (!result.isConfirmed) {
        setLoadingState('autoBilling', false);
        return;
      }

      MySwal.fire({
        title: 'Processing Auto-billing...',
        text: `Billing ${activeStudents.length} students in ${grade}`,
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

      let successCount = 0;
      let failedCount = 0;
      const errors = [];

      // Process each student in the grade
      for (const student of activeStudents) {
        try {
          const response = await feeApi.post(`/auto-bill/student/${student.id}/term/${termId}`);
          handleApiResponse(response);
          successCount++;
          
          // Show progress for large batches
          if (activeStudents.length > 10) {
            const progress = Math.round((successCount + failedCount) / activeStudents.length * 100);
            console.log(`Progress: ${progress}% (${successCount + failedCount}/${activeStudents.length})`);
          }
        } catch (error) {
          failedCount++;
          const errorMessage = handleApiError(error, `billing student ${student.id}`);
          errors.push(`Student ${student.fullName || student.id}: ${errorMessage}`);
          console.error(`Failed to bill student ${student.id}:`, error);
        }
      }

      MySwal.close();

      // Show results
      let resultMessage = `Auto-billing for ${grade} completed: ${successCount} successful, ${failedCount} failed.`;
      
      if (failedCount > 0) {
        resultMessage += ` Check logs for ${failedCount} error${failedCount > 1 ? 's' : ''}.`;
        if (errors.length > 0) {
          console.error('Auto-billing errors:', errors);
        }
        showWarningAlert('Auto-billing Complete', resultMessage);
      } else {
        showSuccessAlert('Auto-billing Complete', resultMessage);
      }
      
      // Refresh data
      await refreshAllData();
      
    } catch (error) {
      MySwal.close();
      console.error('Grade auto-billing error:', error);
      const errorMessage = handleApiError(error, 'grade auto-billing');
      showErrorAlert('Auto-billing Failed', errorMessage);
    } finally {
      setLoadingState('autoBilling', false);
    }
  }, [setLoadingState, refreshAllData]);

  // ========== SWEETALERT2 AUTO-BILLING MODAL ==========

  const showAutoBillingModal = useCallback(() => {
    MySwal.fire({
      title: <span className="text-gray-900">Auto-billing</span>,
      html: (
        <div className="text-left space-y-6 max-h-[70vh] overflow-y-auto pr-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Zap className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-gray-700">
                Automatically generate fee bills for students based on their grade fee structures.
              </p>
            </div>
          </div>

          {/* Term Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Term <span className="text-red-500">*</span>
            </label>
            <select
              id="autoBillingTermId"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-20 transition-all duration-200 bg-white"
              defaultValue={autoBillingState.selectedTermId}
            >
              <option value="">Select Term</option>
              {state.terms.map(term => (
                <option key={term.id} value={term.id}>
                  {term.termName} {term.academicYear}
                </option>
              ))}
            </select>
          </div>

          {/* Auto-bill All Students Card */}
          <div 
            className="bg-linear-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => {
              const termId = document.getElementById('autoBillingTermId').value;
              if (!termId) {
                MySwal.showValidationMessage('Please select a term first');
                return;
              }
              MySwal.close();
              handleAutoBillAllStudents(termId);
            }}
          >
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-1">Bill All Students</h3>
                <p className="text-sm text-gray-700">
                  Bill ALL active students for the selected term
                </p>
              </div>
            </div>
          </div>

          {/* Auto-bill by Grade Section */}
          <div className="bg-linear-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-5">
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Grade <span className="text-red-500">*</span>
              </label>
              <select
                id="autoBillingGrade"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-20 transition-all duration-200 bg-white"
                defaultValue={autoBillingState.selectedGrade}
              >
                <option value="">Select Grade</option>
                {grades.map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
            </div>
            
            <button
              type="button"
              onClick={() => {
                const grade = document.getElementById('autoBillingGrade').value;
                const termId = document.getElementById('autoBillingTermId').value;
                
                if (!grade || !termId) {
                  MySwal.showValidationMessage('Please select both grade and term');
                  return;
                }
                
                MySwal.close();
                handleAutoBillByGrade(grade, termId);
              }}
              className="w-full bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Folder className="w-5 h-5 mr-2" />
              Bill by Grade
            </button>
          </div>

          {/* Info Box */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2 shrink-0" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">How auto-billing works:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Uses the grade fee structure defined in the system</li>
                  <li>Only bills active students with assigned grades</li>
                  <li>Skips students already billed for the term</li>
                  <li>Updates student fee summaries automatically</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
      showCancelButton: true,
      confirmButtonText: 'Close',
      cancelButtonText: null,
      showConfirmButton: false,
      cancelButtonColor: '#6b7280',
      width: 600,
      customClass: {
        popup: 'rounded-2xl border border-gray-200 shadow-xl',
        title: 'text-lg font-bold mb-4',
        cancelButton: 'px-4 py-2.5 rounded-lg font-medium',
        htmlContainer: 'overflow-visible'
      }
    });
  }, [state.terms, grades, autoBillingState.selectedTermId, autoBillingState.selectedGrade, handleAutoBillAllStudents, handleAutoBillByGrade]);

  // ========== SWEETALERT2 FORM HANDLING ==========

  const showFeeStructureForm = (structure = null) => {
    const isEdit = !!structure;
    
    // Find the matching grade from our grades array for editing
    let matchingGrade = structure?.grade || selectedGrade || '';
    if (structure && structure.grade) {
      const structureGradeNumber = extractGradeNumber(structure.grade);
      if (structureGradeNumber !== null) {
        const foundGrade = grades.find(grade => {
          const gradeNumber = extractGradeNumber(grade);
          return gradeNumber === structureGradeNumber;
        });
        if (foundGrade) {
          matchingGrade = foundGrade;
        }
      }
    }

    const defaultFormData = {
      termId: structure?.academicTerm?.id || structure?.termId || selectedTerm || '',
      grade: matchingGrade,
      tuitionFee: structure?.tuitionFee || '',
      basicFee: structure?.basicFee || '',
      examinationFee: structure?.examinationFee || '',
      transportFee: structure?.transportFee || '',
      libraryFee: structure?.libraryFee || '',
      sportsFee: structure?.sportsFee || '',
      activityFee: structure?.activityFee || '',
      hostelFee: structure?.hostelFee || '',
      uniformFee: structure?.uniformFee || '',
      bookFee: structure?.bookFee || '',
      otherFees: structure?.otherFees || '',
      isActive: structure?.isActive !== false,
    };

    // Function to calculate total
    const calculateTotal = (formData) => {
      const fees = [
        parseFloat(formData.tuitionFee) || 0,
        parseFloat(formData.basicFee) || 0,
        parseFloat(formData.examinationFee) || 0,
        parseFloat(formData.transportFee) || 0,
        parseFloat(formData.libraryFee) || 0,
        parseFloat(formData.sportsFee) || 0,
        parseFloat(formData.activityFee) || 0,
        parseFloat(formData.hostelFee) || 0,
        parseFloat(formData.uniformFee) || 0,
        parseFloat(formData.bookFee) || 0,
        parseFloat(formData.otherFees) || 0,
      ];
      return fees.reduce((sum, fee) => sum + fee, 0);
    };

    // Update total display function
    const updateTotalDisplay = () => {
      const tuitionFee = parseFloat(document.getElementById('tuitionFee')?.value) || 0;
      const basicFee = parseFloat(document.getElementById('basicFee')?.value) || 0;
      const examinationFee = parseFloat(document.getElementById('examinationFee')?.value) || 0;
      const transportFee = parseFloat(document.getElementById('transportFee')?.value) || 0;
      const libraryFee = parseFloat(document.getElementById('libraryFee')?.value) || 0;
      const sportsFee = parseFloat(document.getElementById('sportsFee')?.value) || 0;
      const activityFee = parseFloat(document.getElementById('activityFee')?.value) || 0;
      const hostelFee = parseFloat(document.getElementById('hostelFee')?.value) || 0;
      const uniformFee = parseFloat(document.getElementById('uniformFee')?.value) || 0;
      const bookFee = parseFloat(document.getElementById('bookFee')?.value) || 0;
      const otherFees = parseFloat(document.getElementById('otherFees')?.value) || 0;
      
      const total = tuitionFee + basicFee + examinationFee + transportFee + 
                   libraryFee + sportsFee + activityFee + hostelFee + 
                   uniformFee + bookFee + otherFees;
      
      const totalElement = document.getElementById('totalDisplay');
      if (totalElement) {
        totalElement.textContent = `KES ${total.toLocaleString()}`;
      }
    };

    MySwal.fire({
      title: <span className="text-gray-900">{isEdit ? 'Edit Fee Structure' : 'Create Fee Structure'}</span>,
      html: (
        <div className="text-left space-y-6 max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Term Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Term <span className="text-red-500">*</span>
              </label>
              <select
                id="termId"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-20 transition-all duration-200 bg-white"
                defaultValue={defaultFormData.termId}
              >
                <option value="">Select Term</option>
                {state.terms.map(term => (
                  <option key={term.id} value={term.id}>
                    {term.termName} {term.academicYear}
                  </option>
                ))}
              </select>
            </div>

            {/* Grade Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Grade <span className="text-red-500">*</span>
              </label>
              <select
                id="grade"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-20 transition-all duration-200 bg-white"
                defaultValue={defaultFormData.grade}
              >
                <option value="">Select Grade</option>
                {grades.map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Basic Fees Card */}
            <div className="space-y-4 p-6 border rounded-xl bg-linear-to-br from-blue-50 to-blue-100 border-blue-200">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Basic Fees</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Basic Fee</label>
                  <input
                    type="number"
                    id="basicFee"
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200"
                    defaultValue={defaultFormData.basicFee}
                    placeholder="0"
                    onInput={updateTotalDisplay}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Tuition Fee</label>
                  <input
                    type="number"
                    id="tuitionFee"
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200"
                    defaultValue={defaultFormData.tuitionFee}
                    placeholder="0"
                    onInput={updateTotalDisplay}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Examination Fee</label>
                  <input
                    type="number"
                    id="examinationFee"
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200"
                    defaultValue={defaultFormData.examinationFee}
                    placeholder="0"
                    onInput={updateTotalDisplay}
                  />
                </div>
              </div>
            </div>

            {/* Optional Fees Card */}
            <div className="space-y-4 p-6 border rounded-xl bg-linear-to-br from-green-50 to-green-100 border-green-200">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <Trophy className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Optional Fees</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Transport Fee</label>
                  <input
                    type="number"
                    id="transportFee"
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:ring-opacity-20 transition-all duration-200"
                    defaultValue={defaultFormData.transportFee}
                    placeholder="0"
                    onInput={updateTotalDisplay}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Library Fee</label>
                  <input
                    type="number"
                    id="libraryFee"
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:ring-opacity-20 transition-all duration-200"
                    defaultValue={defaultFormData.libraryFee}
                    placeholder="0"
                    onInput={updateTotalDisplay}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Sports Fee</label>
                  <input
                    type="number"
                    id="sportsFee"
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:ring-opacity-20 transition-all duration-200"
                    defaultValue={defaultFormData.sportsFee}
                    placeholder="0"
                    onInput={updateTotalDisplay}
                  />
                </div>
              </div>
            </div>

            {/* Additional Fees Card */}
            <div className="space-y-4 p-6 border rounded-xl bg-linear-to-br from-purple-50 to-purple-100 border-purple-200">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg mr-3">
                  <Activity className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Additional Fees</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Activity Fee</label>
                  <input
                    type="number"
                    id="activityFee"
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:ring-opacity-20 transition-all duration-200"
                    defaultValue={defaultFormData.activityFee}
                    placeholder="0"
                    onInput={updateTotalDisplay}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Hostel Fee</label>
                  <input
                    type="number"
                    id="hostelFee"
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:ring-opacity-20 transition-all duration-200"
                    defaultValue={defaultFormData.hostelFee}
                    placeholder="0"
                    onInput={updateTotalDisplay}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Uniform Fee</label>
                  <input
                    type="number"
                    id="uniformFee"
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:ring-opacity-20 transition-all duration-200"
                    defaultValue={defaultFormData.uniformFee}
                    placeholder="0"
                    onInput={updateTotalDisplay}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Book Fee</label>
              <input
                type="number"
                id="bookFee"
                step="0.01"
                min="0"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-20 transition-all duration-200"
                defaultValue={defaultFormData.bookFee}
                placeholder="0"
                onInput={updateTotalDisplay}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Other Fees</label>
              <input
                type="number"
                id="otherFees"
                step="0.01"
                min="0"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-20 transition-all duration-200"
                defaultValue={defaultFormData.otherFees}
                placeholder="0"
                onInput={updateTotalDisplay}
              />
            </div>
          </div>

          <div className="flex items-center">
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
              <span className="text-sm font-medium text-gray-700">Active Fee Structure</span>
            </label>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Total Fee Structure</p>
                <div id="totalDisplay" className="text-3xl font-bold text-indigo-600">
                  KES {calculateTotal(defaultFormData).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      showCancelButton: true,
      confirmButtonText: isEdit ? 'Update Fee Structure' : 'Create Fee Structure',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#6b7280',
      width: 900,
      customClass: {
        popup: 'rounded-2xl border border-gray-200 shadow-xl',
        title: 'text-lg font-bold mb-4',
        confirmButton: 'px-4 py-2.5 rounded-lg font-medium',
        cancelButton: 'px-4 py-2.5 rounded-lg font-medium',
        htmlContainer: 'overflow-visible'
      },
      preConfirm: () => {
        const formData = {
          termId: document.getElementById('termId').value,
          grade: document.getElementById('grade').value,
          tuitionFee: document.getElementById('tuitionFee').value,
          basicFee: document.getElementById('basicFee').value,
          examinationFee: document.getElementById('examinationFee').value,
          transportFee: document.getElementById('transportFee').value,
          libraryFee: document.getElementById('libraryFee').value,
          sportsFee: document.getElementById('sportsFee').value,
          activityFee: document.getElementById('activityFee').value,
          hostelFee: document.getElementById('hostelFee').value,
          uniformFee: document.getElementById('uniformFee').value,
          bookFee: document.getElementById('bookFee').value,
          otherFees: document.getElementById('otherFees').value,
          isActive: document.getElementById('isActive').checked,
        };

        const errors = validateFeeStructureForm(formData);
        
        if (Object.keys(errors).length > 0) {
          const errorMessages = Object.values(errors).join('<br>');
          MySwal.showValidationMessage(`Please fix the following errors:<br>${errorMessages}`);
          return false;
        }

        return formData;
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        await handleSaveFeeStructure(result.value, structure?.id);
      }
    });
  };

  // ========== ACTION HANDLERS ==========

  const handleSaveFeeStructure = async (formData, structureId = null) => {
    setLoadingState('savingStructure', true);
    
    MySwal.fire({
      title: structureId ? 'Updating Fee Structure...' : 'Creating Fee Structure...',
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
      // Log the data being sent
      console.log('Form data before sending:', formData);
      
      // Extract numeric grade from form data before sending
      const formGrade = formData.grade;
      const numericGrade = extractGradeNumber(formGrade)?.toString() || formGrade;
      
      const feeData = {
        termId: formData.termId,
        grade: numericGrade, // Send the numeric grade to backend
        tuitionFee: parseFloat(formData.tuitionFee) || 0,
        basicFee: parseFloat(formData.basicFee) || 0,
        examinationFee: parseFloat(formData.examinationFee) || 0,
        transportFee: parseFloat(formData.transportFee) || 0,
        libraryFee: parseFloat(formData.libraryFee) || 0,
        sportsFee: parseFloat(formData.sportsFee) || 0,
        activityFee: parseFloat(formData.activityFee) || 0,
        hostelFee: parseFloat(formData.hostelFee) || 0,
        uniformFee: parseFloat(formData.uniformFee) || 0,
        bookFee: parseFloat(formData.bookFee) || 0,
        otherFees: parseFloat(formData.otherFees) || 0,
        isActive: formData.isActive !== false,
      };

      console.log('Data being sent to API (with numeric grade):', feeData);

      let response;
      if (structureId) {
        response = await feeApi.put(`/fee-structure/${structureId}`, feeData);
      } else {
        response = await feeApi.post('/fee-structure', feeData);
      }
      
      const responseData = handleApiResponse(response);
      console.log('API Response:', responseData);
      
      MySwal.close();
      
      showSuccessAlert(
        structureId ? 'Fee Structure Updated' : 'Fee Structure Created',
        structureId 
          ? 'Fee structure has been updated successfully!' 
          : 'Fee structure has been created successfully!'
      );
      
      await fetchFeeStructures();
      
    } catch (error) {
      MySwal.close();
      console.error('Save fee structure error details:', error);
      const errorMessage = handleApiError(error, 'saving fee structure');
      showErrorAlert('Save Failed', errorMessage);
    } finally {
      setLoadingState('savingStructure', false);
    }
  };

  const handleDelete = async (structureId) => {
    if (!isAdmin && !hasRole('ADMIN')) {
      showErrorAlert('Access Denied', 'Only administrators can delete fee structures');
      return;
    }
    
    const result = await showConfirmDialog(
      'Delete Fee Structure',
      'Are you sure you want to delete this fee structure? This action cannot be undone.',
      'Yes, delete it',
      'Cancel'
    );

    if (!result.isConfirmed) return;

    setLoadingState('deletingStructure', true);
    
    MySwal.fire({
      title: 'Deleting Fee Structure...',
      text: 'Please wait while we delete the fee structure.',
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
      const response = await feeApi.delete(`/fee-structure/${structureId}`);
      handleApiResponse(response);
      
      MySwal.close();
      showSuccessAlert('Fee Structure Deleted', 'Fee structure has been deleted successfully.');
      await fetchFeeStructures();
      
    } catch (error) {
      MySwal.close();
      const errorMessage = handleApiError(error, 'deleting fee structure');
      showErrorAlert('Delete Failed', errorMessage);
      console.error('Delete fee structure error:', error);
    } finally {
      setLoadingState('deletingStructure', false);
    }
  };

  // ========== INITIAL LOAD ==========

  useEffect(() => {
    const loadInitialData = async () => {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }
      
      try {
        // Fetch grades first, then terms
        console.log('Starting initial data load...');
        await Promise.all([fetchGrades(), fetchTerms()]);
        console.log('Initial data load complete');
      } catch (error) {
        console.error('Initial load error:', error);
        showErrorAlert('Load Error', 'Failed to load initial data');
      }
    };
    
    loadInitialData();
  }, [isAuthenticated, navigate, fetchGrades, fetchTerms]);

  useEffect(() => {
    if (selectedTerm) {
      fetchFeeStructures();
    }
  }, [selectedTerm, fetchFeeStructures]);

  // ========== HELPER FUNCTIONS ==========

  const getTermName = (termId) => {
    const term = state.terms.find(t => t.id === termId);
    return term ? `${term.termName} ${term.academicYear}` : '';
  };

  // ========== QUICK ACTIONS ==========

  const quickActions = useMemo(() => {
    const actions = [
      {
        title: 'Auto-billing',
        description: 'Generate bills for students',
        icon: Zap,
        color: 'bg-amber-100 text-amber-600',
        onClick: showAutoBillingModal,
        requiredRoles: ['ADMIN', 'ACCOUNTANT']
      },
      {
        title: 'Term Management',
        description: 'Configure academic terms',
        icon: Calendar,
        color: 'bg-blue-100 text-blue-600',
        link: '/accountant/term-fees/term-management',
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
        title: 'Term Fee Dashboard',
        description: 'View fee collection overview',
        icon: Settings,
        color: 'bg-purple-100 text-purple-600',
        link: '/accountant/term-fees/dashboard',
        requiredRoles: ['ADMIN', 'ACCOUNTANT', 'TEACHER']
      }
    ];
    
    return actions.filter(action => {
      if (!action.requiredRoles || action.requiredRoles.length === 0) return true;
      return hasAnyRole(action.requiredRoles) || isAdmin || isAccountant;
    });
  }, [isAdmin, isAccountant, hasAnyRole, showAutoBillingModal]);

  // ========== RENDER LOGIC ==========

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const isLoading = state.loadingStates.refreshing || state.loadingStates.feeStructures || gradesLoading;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Fee Structure Management</h1>
                <p className="text-gray-600">Configure fee structures for different grades and terms</p>
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
                onClick={() => showFeeStructureForm()}
                disabled={state.loadingStates.savingStructure}
                className="bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-2.5 px-5 rounded-xl flex items-center shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
              >
                {state.loadingStates.savingStructure ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5 mr-2" />
                    Create Fee Structure
                  </>
                )}
              </motion.button>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -4 }}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={action.onClick || (() => action.link && navigate(action.link))}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && (action.onClick?.() || (action.link && navigate(action.link)))}
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

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Filter Fee Structures</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <CustomDropdown
              label="Select Term"
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              options={state.terms.map(term => ({
                id: term.id,
                name: `${term.termName} ${term.academicYear}`
              }))}
              placeholder="Select Term"
              disabled={state.loadingStates.terms}
              loading={state.loadingStates.terms}
              loadingText="Loading terms..."
              error={state.errors.terms}
            />
          </div>
          
          <div>
            <CustomDropdown
              label="Select Grade"
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              options={[
                // Add "All Grades" as the first option with empty string value
                { id: '', name: 'All Grades' },
                // Then add all actual grades
                ...grades.map(grade => ({ 
                  id: grade, 
                  name: grade
                }))
              ]}
              placeholder="Select Grade"
              disabled={gradesLoading}
              loading={gradesLoading}
              loadingText="Loading grades..."
              error={gradesError}
            />
          </div>
          
          <div className="flex items-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchFeeStructures}
              disabled={state.loadingStates.feeStructures || !selectedTerm}
              className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
            >
              {state.loadingStates.feeStructures ? 'Loading...' : 'Apply Filters'}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Fee Structures List */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Fee Structures</h2>
              <p className="text-gray-600 mt-1">
                Showing {state.feeStructures.length} fee structure{state.feeStructures.length !== 1 ? 's' : ''}
                {selectedGrade && selectedGrade !== '' ? ` for ${selectedGrade}` : ' for All Grades'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {state.feeStructures.length > 0 && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Active</span>
                  <div className="w-2 h-2 bg-gray-400 rounded-full ml-3"></div>
                  <span>Inactive</span>
                </div>
              )}
              {/* Auto-billing Quick Button */}
              {(isAdmin || isAccountant || hasRole('ADMIN') || hasRole('ACCOUNTANT')) && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={showAutoBillingModal}
                  className="flex items-center gap-2 bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-medium py-2.5 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Zap className="w-4 h-4" />
                  Auto-billing
                </motion.button>
              )}
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {state.loadingStates.feeStructures ? (
            <div className="text-center py-12">
              <LoadingSpinner text="Loading fee structures..." />
            </div>
          ) : state.errors.feeStructures ? (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-red-300 mx-auto mb-4" />
              <p className="text-gray-700 mb-4">{state.errors.feeStructures}</p>
              <button
                onClick={fetchFeeStructures}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : state.feeStructures.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No fee structures found</h3>
              <p className="text-gray-600 mb-6">
                {selectedTerm ? 
                  `No fee structures for selected term${selectedGrade && selectedGrade !== '' ? ` and grade ${selectedGrade}` : ''}.` : 
                  'Select a term to view fee structures.'}
              </p>
              {grades.length === 0 && !gradesLoading && (
                <div className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded-lg mb-4">
                  <AlertTriangle className="w-5 h-5 inline mr-2" />
                  No active grades found in database. Please add students with grades first.
                </div>
              )}
              {(isAdmin || isAccountant || hasRole('ADMIN') || hasRole('ACCOUNTANT')) && (
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => showFeeStructureForm()}
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Create your first fee structure
                  </button>
                  <span className="text-gray-400">|</span>
                  <button
                    onClick={showAutoBillingModal}
                    className="text-amber-600 hover:text-amber-800 font-medium"
                  >
                    Start auto-billing
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Grade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Term
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Total Fee
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
                  {state.feeStructures.map((structure) => {
                    const total = (structure.tuitionFee || 0) +
                                 (structure.basicFee || 0) +
                                 (structure.examinationFee || 0) +
                                 (structure.transportFee || 0) +
                                 (structure.libraryFee || 0) +
                                 (structure.sportsFee || 0) +
                                 (structure.activityFee || 0) +
                                 (structure.hostelFee || 0) +
                                 (structure.uniformFee || 0) +
                                 (structure.bookFee || 0) +
                                 (structure.otherFees || 0);
                    return (
                      <motion.tr
                        key={structure.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                              <span className="font-bold text-indigo-600">
                                {structure.grade?.replace('Grade ', 'G')}
                              </span>
                            </div>
                            <div>
                              <span className="font-semibold text-gray-900">{structure.grade}</span>
                              {selectedGrade && extractGradeNumber(selectedGrade) === extractGradeNumber(structure.grade) && (
                                <div className="text-xs text-green-600 mt-1">
                                  Matches: {selectedGrade}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">
                              {getTermName(structure.academicTerm?.id || structure.termId)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-2xl font-bold text-indigo-600">
                            KES {total.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {structure.isActive ? 'Active fee structure' : 'Inactive'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${
                            structure.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {structure.isActive ? (
                              <>
                                <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                                Active
                              </>
                            ) : (
                              <>
                                <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
                                Inactive
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            {(isAdmin || isAccountant || hasRole('ADMIN') || hasRole('ACCOUNTANT')) && (
                              <>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => showFeeStructureForm(structure)}
                                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center px-3 py-2 hover:bg-indigo-50 rounded-lg transition-colors"
                                >
                                  <Edit2 className="w-4 h-4 mr-1.5" />
                                  Edit
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => {
                                    setAutoBillingState({
                                      selectedGrade: structure.grade,
                                      selectedTermId: structure.academicTerm?.id || structure.termId || selectedTerm
                                    });
                                    showAutoBillingModal();
                                  }}
                                  className="text-amber-600 hover:text-amber-800 text-sm font-medium flex items-center px-3 py-2 hover:bg-amber-50 rounded-lg transition-colors"
                                >
                                  <Zap className="w-4 h-4 mr-1.5" />
                                  Bill Grade
                                </motion.button>
                              </>
                            )}
                            {isAdmin && hasRole('ADMIN') && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleDelete(structure.id)}
                                disabled={state.loadingStates.deletingStructure}
                                className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center px-3 py-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              >
                                <Trash2 className="w-4 h-4 mr-1.5" />
                                {state.loadingStates.deletingStructure ? 'Deleting...' : 'Delete'}
                              </motion.button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeeStructureManager;