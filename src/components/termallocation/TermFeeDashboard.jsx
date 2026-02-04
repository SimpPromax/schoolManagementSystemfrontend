/* eslint-disable no-unused-vars */
import React, { useState, useMemo, useEffect, useCallback, useReducer } from 'react';
import {
  Users, DollarSign, Percent, AlertTriangle, Clock,
  RefreshCw, TrendingUp, TrendingDown, BarChart,
  PieChart as PieChartIcon, Calendar, Layers, Plus,
  ArrowRight, Filter, Loader2, ChevronRight,
  ArrowUpRight, ArrowDownRight, Activity, FileText,
  AlertCircle, X, Settings, History, School, ChevronLeft,
  ChevronDown, PlusCircle, Trash2, Edit2, LogOut, User,
  Shield, CheckCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  Tooltip, Legend
} from 'recharts';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const MySwal = withReactContent(Swal);

// ========== API CONFIGURATION ==========

const API_CONFIG = {
  BASE_URL: 'http://localhost:8080/api/v1/fee-management',
  TIMEOUT: 15000
};

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      handleUnauthorized();
    }
    return Promise.reject(error);
  }
);

const studentApi = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  timeout: API_CONFIG.TIMEOUT,
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
    switch (error.response.status) {
      case 400:
        return error.response.data?.message || 'Bad request. Please check your input.';
      case 401:
        return 'Session expired. Please login again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 409:
        return 'Conflict: The term is already set as current.';
      case 500:
        if (error.config?.url?.includes('/set-current')) {
          return 'Server error: Cannot set term as current. It may already be current or there may be a database issue.';
        }
        return 'Server error. Please try again later.';
      default:
        return error.response.data?.message || `Error: ${error.response.status}`;
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
  MySwal.fire({
    title: 'Session Expired',
    text: 'Your session has expired. Please login again.',
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
    <div className="flex flex-col items-center justify-center p-4 min-h-50">
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
  dashboardStats: {
    totalExpectedFee: 0,
    totalCollectedFee: 0,
    totalOutstanding: 0,
    collectionRate: 0,
    totalStudents: 0,
    paidStudents: 0,
    partialStudents: 0,
    pendingStudents: 0
  },
  gradeDashboards: [],
  currentTerm: null,
  terms: [],
  students: [],
  academicYearHistory: [],
  loadingStates: {
    dashboard: false,
    students: false,
    terms: false,
    history: false,
    autoBilling: false,
    initialization: false,
    settingCurrent: false,
    refreshing: false
  },
  errors: {
    dashboard: null,
    students: null,
    terms: null,
    history: null
  }
};

function dashboardReducer(state, action) {
  switch (action.type) {
    case 'SET_DASHBOARD_STATS':
      return {
        ...state,
        dashboardStats: action.payload,
        errors: { ...state.errors, dashboard: null }
      };
    case 'SET_GRADE_DASHBOARDS':
      return { ...state, gradeDashboards: action.payload };
    case 'SET_CURRENT_TERM':
      return { ...state, currentTerm: action.payload };
    case 'SET_TERMS':
      return {
        ...state,
        terms: action.payload,
        errors: { ...state.errors, terms: null }
      };
    case 'SET_STUDENTS':
      return {
        ...state,
        students: action.payload,
        errors: { ...state.errors, students: null }
      };
    case 'SET_ACADEMIC_YEAR_HISTORY':
      return {
        ...state,
        academicYearHistory: action.payload,
        errors: { ...state.errors, history: null }
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

const TermFeeDashboard = () => {
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
  
  const [state, dispatch] = useReducer(dashboardReducer, initialState);
  const [initializeForm, setInitializeForm] = useState({
    academicYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
    termPeriods: [
      { termName: 'First Term', startDate: '', endDate: '', feeDueDate: '' },
      { termName: 'Second Term', startDate: '', endDate: '', feeDueDate: '' },
      { termName: 'Third Term', startDate: '', endDate: '', feeDueDate: '' }
    ]
  });

  // Grade colors for charts
  const gradeColors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', 
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
  ];

  // ========== DATA FETCHING ==========

  const setLoading = useCallback((key, value) => {
    dispatch({ type: 'SET_LOADING', payload: { [key]: value } });
  }, []);

  const setError = useCallback((key, error) => {
    dispatch({ type: 'SET_ERROR', payload: { key, error } });
  }, []);

  // ========== FETCH FUNCTIONS ==========

  const fetchTerms = useCallback(async () => {
    setLoading('terms', true);
    try {
      const response = await api.get('/terms');
      const responseData = handleApiResponse(response);
      
      let termsArray = [];
      let currentTerm = null;
      
      if (Array.isArray(responseData)) {
        termsArray = responseData;
        currentTerm = termsArray.find(term => term.isCurrent === true);
      } else if (responseData && responseData.terms) {
        termsArray = responseData.terms;
        currentTerm = responseData.currentTerm || termsArray.find(term => term.isCurrent === true);
      }
      
      termsArray = termsArray.map(term => ({
        ...term,
        isCurrent: Boolean(term.isCurrent)
      }));
      
      dispatch({
        type: 'SET_TERMS',
        payload: termsArray
      });
      
      if (currentTerm) {
        dispatch({
          type: 'SET_CURRENT_TERM',
          payload: { ...currentTerm, isCurrent: true }
        });
      }
      
    } catch (error) {
      if (error.response?.status === 404) {
        setError('terms', null);
      } else {
        const errorMessage = handleApiError(error, 'fetching terms');
        setError('terms', errorMessage);
      }
      console.error('Terms error:', error);
    } finally {
      setLoading('terms', false);
    }
  }, [setLoading, setError]);

  const fetchStudents = useCallback(async () => {
    setLoading('students', true);
    try {
      const response = await studentApi.get('/students/fee-summary');
      const studentsData = Array.isArray(response.data) ? response.data : [];
      
      console.log(`📊 Loaded ${studentsData.length} students with fee summaries`);
      
      const transformedStudents = studentsData.map(student => ({
        id: student.studentId,
        fullName: student.studentName,
        grade: student.grade,
        totalFee: student.totalFee || 0,
        paidAmount: student.paidAmount || 0,
        pendingAmount: student.pendingAmount || 0,
        feeStatus: student.feeStatus,
        studentId: `STU${String(student.studentId).padStart(6, '0')}`,
        email: '',
        phone: '',
        collectionRate: student.totalFee > 0 ? 
          (student.paidAmount / student.totalFee) * 100 : 0
      }));
      
      dispatch({
        type: 'SET_STUDENTS',
        payload: transformedStudents
      });
      
      // Calculate dashboard stats from student data
      const stats = transformedStudents.reduce((acc, student) => {
        acc.totalExpectedFee += student.totalFee || 0;
        acc.totalCollectedFee += student.paidAmount || 0;
        acc.totalOutstanding += student.pendingAmount || 0; // Use pendingAmount directly
        acc.totalStudents += 1;
        
        if (student.feeStatus === 'PAID') {
          acc.paidStudents += 1;
        } else if (student.feeStatus === 'PARTIAL') {
          acc.partialStudents += 1;
        } else if (student.feeStatus === 'PENDING' || student.feeStatus === 'OVERDUE') {
          acc.pendingStudents += 1;
        }
        
        return acc;
      }, {
        totalExpectedFee: 0,
        totalCollectedFee: 0,
        totalOutstanding: 0,
        totalStudents: 0,
        paidStudents: 0,
        partialStudents: 0,
        pendingStudents: 0
      });
      
      // Calculate collection rate
      stats.collectionRate = stats.totalExpectedFee > 0 
        ? (stats.totalCollectedFee / stats.totalExpectedFee) * 100 
        : 0;
      
      // If collection rate is negative (more collected than expected), cap at 100%
      if (stats.collectionRate > 100) {
        stats.collectionRate = 100;
      }
      
      dispatch({
        type: 'SET_DASHBOARD_STATS',
        payload: stats
      });
      
      // Calculate grade dashboards
      const grades = [...new Set(transformedStudents.map(s => s.grade).filter(Boolean))];
      const gradeDashboards = grades.map(grade => {
        const gradeStudents = transformedStudents.filter(s => s.grade === grade);
        const enrolled = gradeStudents.length;
        
        const expectedRevenue = gradeStudents.reduce((sum, s) => sum + (s.totalFee || 0), 0);
        const collected = gradeStudents.reduce((sum, s) => sum + (s.paidAmount || 0), 0);
        const outstanding = gradeStudents.reduce((sum, s) => sum + (s.pendingAmount || 0), 0); // Use pendingAmount
        
        const paidStudents = gradeStudents.filter(s => s.feeStatus === 'PAID').length;
        const partialStudents = gradeStudents.filter(s => s.feeStatus === 'PARTIAL').length;
        const pendingStudents = gradeStudents.filter(s => s.feeStatus === 'PENDING').length;
        const overdueStudents = gradeStudents.filter(s => s.feeStatus === 'OVERDUE').length;
        
        // Calculate collection rate for this grade
        let collectionRate = expectedRevenue > 0 ? (collected / expectedRevenue) * 100 : 0;
        if (collectionRate > 100) collectionRate = 100;
        
        return {
          grade,
          enrolled,
          expectedRevenue,
          collected,
          outstanding,
          collectionRate,
          paidStudents,
          partialStudents,
          pendingStudents,
          overdueStudents
        };
      });
      
      dispatch({
        type: 'SET_GRADE_DASHBOARDS',
        payload: gradeDashboards
      });
      
    } catch (error) {
      const errorMessage = handleApiError(error, 'fetching students with fee summary');
      setError('students', errorMessage);
      console.error('Students with fee summary error:', error);
    } finally {
      setLoading('students', false);
    }
  }, [setLoading, setError]);

  const fetchAcademicYearHistory = useCallback(async () => {
    setLoading('history', true);
    try {
      const response = await api.get('/terms');
      const responseData = handleApiResponse(response);
      
      let allTerms = [];
      if (Array.isArray(responseData)) {
        allTerms = responseData;
      } else if (responseData && responseData.terms) {
        allTerms = responseData.terms;
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
      const errorMessage = handleApiError(error, 'fetching academic year history');
      setError('history', errorMessage);
      console.error('Academic year history error:', error);
    } finally {
      setLoading('history', false);
    }
  }, [setLoading, setError]);

  // ========== REFRESH FUNCTION ==========

  const refreshAllData = useCallback(async () => {
    dispatch({ type: 'RESET_ERRORS' });
    setLoading('refreshing', true);
    
    try {
      await Promise.all([
        fetchTerms(),
        fetchStudents()
      ]);
      
      showSuccessAlert('Data Refreshed', 'All dashboard data has been refreshed successfully.');
      return true;
    } catch (error) {
      console.error('Refresh error:', error);
      showErrorAlert('Refresh Failed', 'Failed to refresh dashboard data');
      return false;
    } finally {
      setLoading('refreshing', false);
    }
  }, [fetchTerms, fetchStudents, setLoading]);

  // ========== ACTION HANDLERS ==========

  const handleAutoBill = useCallback(async () => {
    if (!isAdmin && !hasRole('ADMIN')) {
      showErrorAlert('Access Denied', 'Only administrators can trigger auto-billing');
      return;
    }
    
    const result = await showConfirmDialog(
      'Auto Bill Current Term',
      'This will bill all active students for the current term. Continue?',
      'Yes, proceed',
      'Cancel'
    );

    if (!result.isConfirmed) return;

    setLoading('autoBilling', true);
    try {
      const response = await api.post('/auto-bill');
      handleApiResponse(response);
      
      showSuccessAlert('Auto-billing Completed', 'Auto-billing completed successfully!');
      await refreshAllData();
    } catch (error) {
      const errorMessage = handleApiError(error, 'auto-billing');
      showErrorAlert('Auto-billing Failed', errorMessage);
    } finally {
      setLoading('autoBilling', false);
    }
  }, [isAdmin, hasRole, refreshAllData, setLoading]);

  // ========== INITIALIZE ACADEMIC YEAR HANDLERS ==========

  const handleInitializeAcademicYear = useCallback(async (academicYear, termPeriods) => {
    if (!isAdmin && !isAccountant && !hasRole('ADMIN') && !hasRole('ACCOUNTANT')) {
      showErrorAlert('Access Denied', 'Only administrators or accountants can initialize academic years');
      return;
    }
    
    setLoading('initialization', true);
    
    MySwal.fire({
      title: 'Initializing Academic Year',
      text: 'Please wait while we create the academic terms...',
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
      const createdTerms = [];
      
      for (const [index, termPeriod] of termPeriods.entries()) {
        try {
          const termResponse = await api.post('/terms', {
            termName: termPeriod.termName,
            academicYear: academicYear,
            startDate: termPeriod.startDate,
            endDate: termPeriod.endDate,
            feeDueDate: termPeriod.feeDueDate,
            isCurrent: index === 0
          });
          
          const createdTerm = handleApiResponse(termResponse);
          createdTerms.push(createdTerm);
          
        } catch (termError) {
          MySwal.close();
          
          if (termError.response?.status === 400 && 
              termError.response?.data?.message?.includes('already exists')) {
            showErrorAlert('Duplicate Term', 
              `Term "${termPeriod.termName}" for academic year ${academicYear} already exists.`
            );
          } else {
            const errorMessage = handleApiError(termError, 'creating term');
            showErrorAlert('Term Creation Failed', errorMessage);
          }
          return;
        }
      }
      
      if (createdTerms.length > 0) {
        try {
          const firstTerm = createdTerms[0];
          if (!firstTerm.isCurrent) {
            await api.post(`/terms/${firstTerm.id}/set-current`);
          }
        } catch (setCurrentError) {
          console.warn('Could not set term as current:', setCurrentError);
        }
      }
      
      MySwal.close();
      
      showSuccessAlert('Academic Year Initialized', 
        `Academic year ${academicYear} initialized successfully with ${createdTerms.length} terms!`
      );
      
      // Reset form
      setInitializeForm({
        academicYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
        termPeriods: initializeForm.termPeriods.map(term => ({
          ...term,
          startDate: '',
          endDate: '',
          feeDueDate: ''
        }))
      });
      
      await refreshAllData();
      
    } catch (error) {
      MySwal.close();
      const errorMessage = handleApiError(error, 'initializing academic year');
      showErrorAlert('Initialization Failed', errorMessage);
      console.error('Academic year initialization error:', error);
    } finally {
      setLoading('initialization', false);
    }
  }, [isAdmin, isAccountant, hasRole, refreshAllData, setLoading, initializeForm.termPeriods]);

  const handleInitializeAcademicYearForm = useCallback(() => {
    MySwal.fire({
      title: <span className="text-gray-900">Initialize Academic Year</span>,
      html: (
        <div className="text-left space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Academic Year Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Academic Year
            </label>
            <input
              type="text"
              id="academicYearInput"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              defaultValue={initializeForm.academicYear}
              placeholder="e.g., 2026-2027"
            />
            <p className="text-sm text-gray-500 mt-2">
              Format: StartYear-EndYear (e.g., 2026-2027)
            </p>
          </div>
          
          {/* Term Periods */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Term Periods Configuration</h4>
            {initializeForm.termPeriods.map((term, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium text-gray-900">{term.termName}</h5>
                  {index === 0 && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                      Will be set as current term
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Start Date</label>
                    <input
                      type="date"
                      id={`startDate-${index}`}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      defaultValue={term.startDate}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">End Date</label>
                    <input
                      type="date"
                      id={`endDate-${index}`}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      defaultValue={term.endDate}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Fee Due Date</label>
                    <input
                      type="date"
                      id={`feeDueDate-${index}`}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      defaultValue={term.feeDueDate}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Important Notes */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-blue-600" />
              <h4 className="font-semibold text-blue-800">Important Notes</h4>
            </div>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• The first term will automatically be set as the current term</li>
              <li>• You can change the current term later from Term Management</li>
              <li>• Fee structures need to be configured separately for each grade</li>
              <li>• Once initialized, academic years cannot be deleted (only archived)</li>
            </ul>
          </div>
        </div>
      ),
      showCancelButton: true,
      confirmButtonText: 'Initialize Academic Year',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#6b7280',
      showCloseButton: true,
      width: 700,
      customClass: {
        popup: 'rounded-2xl border border-gray-200 shadow-xl',
        title: 'text-lg font-bold mb-4',
        confirmButton: 'px-4 py-2.5 rounded-lg font-medium',
        cancelButton: 'px-4 py-2.5 rounded-lg font-medium'
      },
      preConfirm: () => {
        // Get values from form
        const academicYear = document.getElementById('academicYearInput').value;
        
        // Validate academic year format
        const yearRegex = /^\d{4}-\d{4}$/;
        if (!yearRegex.test(academicYear)) {
          MySwal.showValidationMessage('Academic year must be in format: YYYY-YYYY (e.g., 2026-2027)');
          return false;
        }

        // Get all term dates
        const termPeriods = initializeForm.termPeriods.map((term, index) => {
          const startDate = document.getElementById(`startDate-${index}`).value;
          const endDate = document.getElementById(`endDate-${index}`).value;
          const feeDueDate = document.getElementById(`feeDueDate-${index}`).value;
          
          return {
            termName: term.termName,
            startDate,
            endDate,
            feeDueDate
          };
        });

        // Validate all dates are filled
        for (const termPeriod of termPeriods) {
          if (!termPeriod.startDate || !termPeriod.endDate || !termPeriod.feeDueDate) {
            MySwal.showValidationMessage(`Please fill in all dates for ${termPeriod.termName}`);
            return false;
          }
          
          const startDate = new Date(termPeriod.startDate);
          const endDate = new Date(termPeriod.endDate);
          const dueDate = new Date(termPeriod.feeDueDate);
          
          if (endDate <= startDate) {
            MySwal.showValidationMessage(`${termPeriod.termName}: End date must be after start date`);
            return false;
          }
          
          if (dueDate < startDate) {
            MySwal.showValidationMessage(`${termPeriod.termName}: Fee due date cannot be before term start date`);
            return false;
          }
        }
        
        return { academicYear, termPeriods };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const { academicYear, termPeriods } = result.value;
        handleInitializeAcademicYear(academicYear, termPeriods);
      }
    });
  }, [initializeForm.academicYear, initializeForm.termPeriods, handleInitializeAcademicYear]);

  const showInitializeModal = useCallback(() => {
    MySwal.fire({
      title: <span className="text-gray-900">Initialize Academic Year Required</span>,
      html: (
        <div className="text-left space-y-4">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-800 mb-1">No Academic Terms Found</h4>
                <p className="text-sm text-amber-700">
                  You need to initialize an academic year with term periods before you can manage fees.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h5 className="font-medium text-gray-900">What you need to provide:</h5>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Academic year (e.g., 2026-2027)</li>
              <li>• Start and end dates for each term</li>
              <li>• Fee due dates for each term</li>
            </ul>
          </div>
        </div>
      ),
      showCancelButton: true,
      confirmButtonText: 'Initialize Now',
      cancelButtonText: 'Later',
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#6b7280',
      width: 600,
      customClass: {
        popup: 'rounded-2xl border border-gray-200 shadow-xl',
        title: 'text-lg font-bold mb-4',
        confirmButton: 'px-4 py-2 rounded-lg font-medium',
        cancelButton: 'px-4 py-2 rounded-lg font-medium'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        handleInitializeAcademicYearForm();
      }
    });
  }, [handleInitializeAcademicYearForm]);

  const handleLogout = useCallback(() => {
    MySwal.fire({
      title: <span className="text-gray-900">Confirm Logout</span>,
      html: <p className="text-gray-700">Are you sure you want to logout?</p>,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      customClass: {
        popup: 'rounded-2xl border border-gray-200 shadow-xl',
        title: 'text-lg font-bold',
        confirmButton: 'px-4 py-2 rounded-lg font-medium',
        cancelButton: 'px-4 py-2 rounded-lg font-medium'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
      }
    });
  }, [logout]);

  // ========== TERM MANAGEMENT HANDLERS ==========

  const handleSetCurrentTerm = useCallback(async (termId) => {
    if (!state.currentTerm || state.currentTerm.id === termId) {
      return;
    }
    
    const result = await showConfirmDialog(
      'Set as Current Term',
      'Are you sure you want to set this term as the current term?',
      'Yes, set as current',
      'Cancel'
    );
    
    if (!result.isConfirmed) return;
    
    setLoading('settingCurrent', true);
    
    try {
      const response = await api.post(`/terms/${termId}/set-current`);
      const updatedTerm = handleApiResponse(response);
      
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
      
      showSuccessAlert('Term Updated', 
        `${updatedTerm.termName} is now the current term.`
      );
      
    } catch (error) {
      const errorMessage = handleApiError(error, 'setting current term');
      
      if (error.response?.status === 409 || 
          errorMessage.includes('already') ||
          errorMessage.includes('current')) {
        showErrorAlert('Term Already Current', 
          'This term is already set as the current term.'
        );
        
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
      setLoading('settingCurrent', false);
    }
  }, [state.currentTerm, state.terms, setLoading]);

  const showAcademicYearHistoryModal = useCallback(() => {
    MySwal.fire({
      title: <span className="text-gray-900">Academic Year History</span>,
      html: (
        <div className="text-left space-y-6 max-h-[70vh] overflow-y-auto">
          {state.academicYearHistory.length > 0 ? (
            <div className="space-y-4">
              {state.academicYearHistory.map((year, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <School className="w-5 h-5 text-blue-600" />
                      <div>
                        <h3 className="font-bold text-gray-900">{year.academicYear}</h3>
                        <p className="text-sm text-gray-600">{year.terms?.length || 0} terms</p>
                      </div>
                      {year.isCurrent && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                          Current Year
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">
                        KES {year.totalCollections?.toLocaleString('en-KE') || '0'}
                      </p>
                      <p className="text-xs text-gray-600">Total Collections</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-600">Collection Rate</p>
                      <p className="text-sm font-bold text-blue-600">{year.collectionRate?.toFixed(1) || 0}%</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-600">Total Students</p>
                      <p className="text-sm font-bold text-green-600">{year.totalStudents || 0}</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-600">Status</p>
                      <p className="text-sm font-bold text-purple-600">
                        {year.isCurrent ? 'Active' : 'Completed'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-700 text-sm">Terms in this Year</h4>
                    {year.terms?.map((term, termIndex) => (
                      <div key={termIndex} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">{term.termName}</p>
                            {term.isCurrent && (
                              <span className="px-1.5 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                                CURRENT
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600">
                            {term.startDate ? new Date(term.startDate).toLocaleDateString() : 'N/A'} - 
                            {term.endDate ? new Date(term.endDate).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                        
                        {(isAdmin || isAccountant || hasRole('ADMIN') || hasRole('ACCOUNTANT')) && !term.isCurrent && (
                          <button
                            type="button"
                            onClick={() => {
                              MySwal.close();
                              handleSetCurrentTerm(term.id);
                            }}
                            className="ml-2 px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors"
                          >
                            Set Current
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">No academic year history found</p>
              <p className="text-sm text-gray-500 mt-2">Initialize an academic year to get started</p>
            </div>
          )}
        </div>
      ),
      width: 700,
      showConfirmButton: false,
      showCloseButton: true,
      customClass: {
        popup: 'rounded-2xl border border-gray-200 shadow-xl',
        title: 'text-lg font-bold mb-4'
      }
    });
  }, [state.academicYearHistory, isAdmin, isAccountant, hasRole, handleSetCurrentTerm]);

  const handleLoadYearHistory = useCallback(async () => {
    await fetchAcademicYearHistory();
    showAcademicYearHistoryModal();
  }, [fetchAcademicYearHistory, showAcademicYearHistoryModal]);

  // ========== INITIAL LOAD ==========

  useEffect(() => {
    const loadInitialData = async () => {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }
      
      try {
        await Promise.all([
          fetchTerms(),
          fetchStudents()
        ]);
      } catch (error) {
        console.error('Initial load error:', error);
      }
    };
    
    loadInitialData();
  }, [isAuthenticated, navigate, fetchTerms, fetchStudents]);

  // Show initialization modal if no terms exist
  useEffect(() => {
    if (state.terms.length === 0 && !state.loadingStates.terms) {
      const timer = setTimeout(() => {
        if (isAdmin || isAccountant || hasRole('ADMIN') || hasRole('ACCOUNTANT')) {
          showInitializeModal();
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [state.terms.length, state.loadingStates.terms, isAdmin, isAccountant, hasRole, showInitializeModal]);

  // ========== UI DATA ==========

  const quickActions = useMemo(() => {
    const actions = [
      {
        title: 'View Fee Structures',
        description: 'Manage grade-wise fee configurations',
        icon: Layers,
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
        title: 'Term Management',
        description: 'Configure academic terms',
        icon: Settings,
        color: 'bg-amber-100 text-amber-600',
        action: handleLoadYearHistory,
        requiredRoles: ['ADMIN', 'ACCOUNTANT']
      },
      {
        title: 'Academic History',
        description: 'View previous years',
        icon: History,
        color: 'bg-purple-100 text-purple-600',
        action: handleLoadYearHistory,
        requiredRoles: ['ADMIN', 'ACCOUNTANT', 'TEACHER']
      }
    ];
    
    return actions.filter(action => {
      if (!action.requiredRoles || action.requiredRoles.length === 0) return true;
      return hasAnyRole(action.requiredRoles) || isAdmin || isAccountant;
    });
  }, [isAdmin, isAccountant, hasAnyRole, handleLoadYearHistory]);

  const paymentStatusData = useMemo(() => {
    return [
      { 
        name: 'Paid in Full', 
        value: state.dashboardStats.paidStudents || 0, 
        color: '#10B981',
        percentage: state.dashboardStats.totalStudents > 0 ? 
          Math.round((state.dashboardStats.paidStudents / state.dashboardStats.totalStudents) * 100) : 0
      },
      { 
        name: 'Partially Paid', 
        value: state.dashboardStats.partialStudents || 0, 
        color: '#F59E0B',
        percentage: state.dashboardStats.totalStudents > 0 ? 
          Math.round((state.dashboardStats.partialStudents / state.dashboardStats.totalStudents) * 100) : 0
      },
      { 
        name: 'Not Paid', 
        value: state.dashboardStats.pendingStudents || 0, 
        color: '#EF4444',
        percentage: state.dashboardStats.totalStudents > 0 ? 
          Math.round((state.dashboardStats.pendingStudents / state.dashboardStats.totalStudents) * 100) : 0
      },
    ];
  }, [state.dashboardStats]);

  const hasChartData = useMemo(() => {
    return paymentStatusData.some(item => item.value > 0);
  }, [paymentStatusData]);

  // ========== RENDER LOGIC ==========

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const isLoading = state.loadingStates.refreshing;

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
                <h1 className="text-3xl font-bold text-gray-900">Term Fee Management</h1>
                <p className="text-gray-600">Manage term fees, billing, and collections</p>
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
              onClick={handleLogout}
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
            {(isAdmin || hasRole('ADMIN')) && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAutoBill}
                disabled={state.loadingStates.autoBilling}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-xl flex items-center shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {state.loadingStates.autoBilling ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Auto Bill Current Term
                  </>
                )}
              </motion.button>
            )}
            {(isAccountant || isAdmin || hasRole('ACCOUNTANT') || hasRole('ADMIN')) && (
              <Link
                to="/accountant/term-fees/additional-fees"
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-5 rounded-xl flex items-center shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Additional Fees
              </Link>
            )}
          </div>
        </div>

        {/* Current Term Status */}
        <div className="mb-8">
          {state.currentTerm ? (
            <div className="bg-blue-600 rounded-2xl p-6 text-white">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Current Academic Term</h2>
                  <p className="text-lg mb-1">{state.currentTerm.termName} • {state.currentTerm.academicYear}</p>
                  <p className="text-blue-100">
                    {state.currentTerm.startDate ? new Date(state.currentTerm.startDate).toLocaleDateString() : 'N/A'} - 
                    {state.currentTerm.endDate ? new Date(state.currentTerm.endDate).toLocaleDateString() : 'N/A'}
                  </p>
                  <p className="text-blue-100 mt-2">
                    Fee Due Date: {state.currentTerm.feeDueDate ? new Date(state.currentTerm.feeDueDate).toLocaleDateString() : 'Not set'}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="bg-white/20 px-4 py-2 rounded-full text-sm font-medium">
                    {state.currentTerm.isCurrent ? 'CURRENT TERM' : 'INACTIVE'}
                  </span>
                  {state.currentTerm.status && (
                    <span className="text-sm opacity-90">
                      Status: {state.currentTerm.status}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : state.terms.length > 0 ? (
            <div className="bg-amber-500 rounded-2xl p-6 text-white">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">No Current Term Set</h2>
                  <p className="text-amber-100">
                    Select a term to set as current from the Academic History
                  </p>
                </div>
                {(isAdmin || isAccountant || hasRole('ADMIN') || hasRole('ACCOUNTANT')) && (
                  <button
                    onClick={handleLoadYearHistory}
                    className="bg-white text-amber-600 hover:bg-amber-50 font-medium px-6 py-3 rounded-xl transition-colors"
                  >
                    View Academic History
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-amber-500 rounded-2xl p-6 text-white">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">No Academic Terms</h2>
                  <p className="text-amber-100">Please initialize an academic year to get started</p>
                </div>
                {(isAdmin || isAccountant || hasRole('ADMIN') || hasRole('ACCOUNTANT')) && (
                  <button
                    onClick={showInitializeModal}
                    className="bg-white text-amber-600 hover:bg-amber-50 font-medium px-6 py-3 rounded-xl transition-colors"
                  >
                    Initialize Academic Year
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Total Students</p>
              <p className="text-3xl font-bold text-gray-900">{state.dashboardStats.totalStudents}</p>
              <p className="text-xs text-gray-500 mt-1">
                {state.gradeDashboards.length} grades
              </p>
            </div>
            <div className="p-4 bg-blue-100 rounded-xl">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Expected Revenue</p>
              <p className="text-3xl font-bold text-gray-900">
                KES {state.dashboardStats.totalExpectedFee?.toLocaleString('en-KE') || '0'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                From {state.gradeDashboards.length} grades
              </p>
            </div>
            <div className="p-4 bg-green-100 rounded-xl">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Collection Rate</p>
              <p className="text-3xl font-bold text-gray-900">
                {state.dashboardStats.collectionRate?.toFixed(1) || 0}%
              </p>
              <p className="text-xs text-gray-500 mt-1">
                KES {state.dashboardStats.totalCollectedFee?.toLocaleString('en-KE') || '0'} collected
              </p>
            </div>
            <div className="p-4 bg-emerald-100 rounded-xl">
              <Percent className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Outstanding</p>
              <p className="text-3xl font-bold text-gray-900">
                KES {Math.abs(state.dashboardStats.totalOutstanding || 0)?.toLocaleString('en-KE')}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {state.dashboardStats.totalOutstanding < 0 ? 'Overpayment' : 'Pending'}
              </p>
            </div>
            <div className="p-4 bg-red-100 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
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

      {/* Grade-wise Analysis */}
      {state.gradeDashboards.length > 0 && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Grade-wise Analysis</h2>
            <div className="flex items-center text-sm text-gray-600">
              <Filter className="w-4 h-4 mr-1" />
              <span>{state.gradeDashboards.length} grades aggregated above</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {state.gradeDashboards.map((gradeData, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300"
              >
                <div 
                  className="p-6 text-white relative overflow-hidden"
                  style={{ backgroundColor: gradeColors[index % gradeColors.length] }}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8"></div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-2xl font-bold">{gradeData.grade}</h2>
                      <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                        {gradeData.enrolled} Students
                      </span>
                    </div>
                    <p className="opacity-90 mb-6">Fee Collection Overview</p>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <p className="text-sm text-gray-600">Expected</p>
                      <p className="text-xl font-bold text-blue-600">KES {gradeData.expectedRevenue?.toLocaleString('en-KE') || 0}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl">
                      <p className="text-sm text-gray-600">Collected</p>
                      <p className="text-xl font-bold text-green-600">KES {gradeData.collected?.toLocaleString('en-KE') || 0}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-xl">
                      <p className="text-sm text-gray-600">Rate</p>
                      <p className="text-xl font-bold text-purple-600">{gradeData.collectionRate?.toFixed(1) || 0}%</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-xl">
                      <p className="text-sm text-gray-600">Outstanding</p>
                      <p className="text-xl font-bold text-red-600">KES {Math.abs(gradeData.outstanding || 0)?.toLocaleString('en-KE')}</p>
                      <p className="text-xs text-gray-500">
                        {gradeData.outstanding < 0 ? 'Overpayment' : 'Pending'}
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Collection Progress</span>
                      <span>{gradeData.collectionRate?.toFixed(1) || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-linear-to-r from-green-500 to-emerald-600 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(gradeData.collectionRate || 0, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Link
                      to={`/students?grade=${gradeData.grade}`}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-center"
                    >
                      View Students
                    </Link>
                    <Link
                      to={`/accountant/term-fees/structures?grade=${gradeData.grade}`}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-center transition-all duration-200"
                    >
                      Fee Structure
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Payment Status Chart */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 min-h-100">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Payment Status Distribution</h2>
        <div className="h-75 min-h-75 w-full">
          {hasChartData ? (
            <ResponsiveContainer width="100%" height="100%" minHeight={300}>
              <PieChart>
                <Pie
                  data={paymentStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={80}
                  innerRadius={40}
                  paddingAngle={2}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentStatusData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color}
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    backgroundColor: 'white'
                  }}
                  formatter={(value, name, props) => [
                    `${value} students`, 
                    props.payload.name
                  ]}
                  labelFormatter={(name) => `Status: ${name}`}
                />
                <Legend 
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center">
              <PieChartIcon className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium mb-1">No payment data available</p>
              <p className="text-sm text-gray-400">
                Initialize academic year and add fee structures
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TermFeeDashboard;