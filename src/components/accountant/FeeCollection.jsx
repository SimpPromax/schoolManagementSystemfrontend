/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Search,
  Filter,
  Download,
  Mail,
  MessageSquare,
  Bell,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Eye,
  Send,
  CreditCard,
  BarChart3,
  RefreshCw,
  Printer,
  FileText,
  Percent,
  Clock,
  UserCheck,
  Zap,
  Phone,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  BarChart2,
  PieChart as PieChartIcon,
  TrendingDown,
  CalendarDays,
  FileSpreadsheet,
  Receipt,
  Shield,
  Lock,
  User,
  Home,
  PhoneCall,
  MessageCircle,
  Smartphone,
  CheckSquare,
  Square,
  Activity,
  Target,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  ChevronRight,
  CreditCard as Card,
  Wallet,
  Banknote,
  QrCode,
  Maximize2,
  Plus,
  History,
  Layers,
  Receipt as ReceiptIcon,
  ExternalLink,
  Loader2,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  Info,
  AlertOctagon,
  ShieldCheck,
  BarChart
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, ScatterChart, Scatter, ZAxis
} from 'recharts';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const MySwal = withReactContent(Swal);

// Create axios instance with the same pattern as Transactions
const feeApi = axios.create({
  baseURL: 'http://localhost:8080/api/fee-collection',
  timeout: 10000,
});

// Add request interceptor for auth token
feeApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response handler - consistent with Transactions component
const handleResponse = (response) => {
  const responseData = response.data;
  if (responseData && typeof responseData === 'object') {
    if (responseData.success === false) {
      throw new Error(responseData.message || 'Request failed');
    }
    return responseData.data || responseData;
  }
  return responseData;
};

// Error handler - consistent with Transactions component
const handleError = (error) => {
  console.error('Error details:', error);
  
  if (error.response) {
    const errorData = error.response.data;
    console.log('Backend error response:', errorData);
    
    let errorMessage = 'Request failed';
    
    if (typeof errorData === 'string') {
      errorMessage = errorData;
    } else if (errorData && typeof errorData === 'object') {
      if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.error) {
        errorMessage = errorData.error;
      } else if (errorData.exception) {
        errorMessage = errorData.exception;
      } else if (errorData.timestamp) {
        errorMessage = errorData.message || errorData.error || 'Server error occurred';
      }
    }
    
    console.error('Backend error details:', {
      status: error.response.status,
      statusText: error.response.statusText,
      data: errorData,
      headers: error.response.headers
    });
    
    throw new Error(errorMessage);
  } else if (error.request) {
    throw new Error('No response from server. Please check your connection.');
  } else {
    throw new Error(error.message || 'Request failed');
  }
};

// SweetAlert2 configuration
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
  MySwal.fire({
    title: <span className="text-amber-600">{title}</span>,
    html: <p className="text-gray-700">{message}</p>,
    icon: 'warning',
    confirmButtonText: 'Continue',
    confirmButtonColor: '#f59e0b',
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

// Loading Spinner Component
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

// Loading Overlay Component
const LoadingOverlay = ({ isLoading, message = 'Loading...' }) => {
  if (!isLoading) return null;
  
  return (
    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
        <p className="text-sm text-gray-700">{message}</p>
      </div>
    </div>
  );
};

// Payment Transaction Card Component
const PaymentTransactionCard = ({ payment, student }) => (
  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors group">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <Calendar className="w-3 h-3 text-gray-500" />
        <span className="text-sm font-medium text-gray-900">
          {new Date(payment.paymentDate).toLocaleDateString('en-KE', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      </div>
      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono">
        {payment.receiptNumber}
      </span>
    </div>
    
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <PaymentMethodBadge method={payment.paymentMethod} />
        {payment.installmentNumber && (
          <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
            Installment {payment.installmentNumber}
          </span>
        )}
      </div>
      <span className="text-lg font-bold text-emerald-600">
        KSh {payment.amount?.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
      </span>
    </div>
    
    {payment.notes && (
      <div className="mt-2 pt-2 border-t border-gray-200">
        <p className="text-xs text-gray-600 flex items-start gap-1">
          <span className="mt-0.5">📝</span>
          <span>{payment.notes}</span>
        </p>
      </div>
    )}
    
    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
      <div className="text-xs text-gray-500">
        <span className="font-medium">Verified by:</span> {payment.verifiedBy || 'System'}
      </div>
      {payment.verified && (
        <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" /> Verified
        </span>
      )}
    </div>
  </div>
);

// Custom components
const FeeStatusBadge = ({ status }) => {
  const config = {
    PAID: { label: 'Paid', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: CheckCircle },
    PENDING: { label: 'Pending', color: 'bg-amber-100 text-amber-800 border-amber-200', icon: Clock },
    OVERDUE: { label: 'Overdue', color: 'bg-rose-100 text-rose-800 border-rose-200', icon: AlertTriangle },
    partial: { label: 'Partial', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Percent }
  };

  const { label, color, icon: Icon } = config[status] || config.PENDING;

  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${color}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </motion.span>
  );
};

const PaymentMethodBadge = ({ method }) => {
  const config = {
    ONLINE_BANKING: { label: 'Online', color: 'bg-blue-100 text-blue-800', icon: CreditCard },
    CREDIT_CARD: { label: 'Credit Card', color: 'bg-emerald-100 text-emerald-800', icon: Card },
    DEBIT_CARD: { label: 'Debit Card', color: 'bg-emerald-100 text-emerald-800', icon: Card },
    UPI: { label: 'UPI', color: 'bg-purple-100 text-purple-800', icon: QrCode },
    CASH: { label: 'Cash', color: 'bg-amber-100 text-amber-800', icon: Banknote },
    CHEQUE: { label: 'Cheque', color: 'bg-gray-100 text-gray-800', icon: FileText },
    BANK_TRANSFER: { label: 'Bank Transfer', color: 'bg-indigo-100 text-indigo-800', icon: FileSpreadsheet },
    NEFT: { label: 'NEFT', color: 'bg-indigo-100 text-indigo-800', icon: FileSpreadsheet },
    RTGS: { label: 'RTGS', color: 'bg-indigo-100 text-indigo-800', icon: FileSpreadsheet },
    IMPS: { label: 'IMPS', color: 'bg-indigo-100 text-indigo-800', icon: FileSpreadsheet }
  };
  
  const { label, color, icon: Icon } = config[method] || { label: method, color: 'bg-gray-100 text-gray-800', icon: CreditCard };
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${color}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
};

const StatCard = ({ label, value, icon: Icon, color, trend, change, isLoading = false }) => {
  const trendColor = change >= 0 ? 'text-emerald-600' : 'text-rose-600';
  const trendIcon = change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />;
  
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative"
    >
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {isLoading ? '...' : value}
          </p>
          {trend && !isLoading && (
            <div className="flex items-center gap-1 mt-2">
              <span className={`text-xs font-medium ${trendColor} flex items-center gap-1`}>
                {trendIcon}
                {Math.abs(change)}%
              </span>
              <span className="text-xs text-gray-500">from last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
};

const NotificationToast = ({ type, message, onAction }) => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Bell
  };
  
  const Icon = icons[type] || Bell;
  
  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      className="flex items-center gap-3 bg-white p-4 rounded-lg shadow-lg border border-gray-200"
    >
      <Icon className={`w-5 h-5 ${
        type === 'success' ? 'text-emerald-500' :
        type === 'error' ? 'text-rose-500' :
        type === 'warning' ? 'text-amber-500' : 'text-blue-500'
      }`} />
      <div className="flex-1">
        <p className="font-medium text-sm">{message}</p>
      </div>
      {onAction && (
        <button
          onClick={onAction}
          className="text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          View
        </button>
      )}
    </motion.div>
  );
};

// Helper function to calculate payment percentage
const calculatePaymentPercentage = (totalFee, paidAmount) => {
  if (!totalFee || totalFee <= 0) return 0;
  if (!paidAmount) return 0;
  const percentage = (paidAmount / totalFee) * 100;
  return Math.min(100, Math.max(0, percentage));
};

// Report Type and Format enums matching backend
const ReportType = {
  STUDENT_FEE_SUMMARY: 'STUDENT_FEE_SUMMARY',
  COLLECTION_TREND: 'COLLECTION_TREND',
  PAYMENT_METHOD_ANALYSIS: 'PAYMENT_METHOD_ANALYSIS',
  OVERDUE_ANALYSIS: 'OVERDUE_ANALYSIS',
  CLASS_WISE_PERFORMANCE: 'CLASS_WISE_PERFORMANCE',
  CUSTOM_REPORT: 'CUSTOM_REPORT'
};

const ReportFormat = {
  PDF: 'PDF',
  EXCEL: 'EXCEL',
  CSV: 'CSV',
  HTML: 'HTML'
};

// Map frontend report names to backend enum values
const reportTypeMapping = {
  'Monthly Collection Summary': ReportType.COLLECTION_TREND,
  'Student Detailed Report': ReportType.STUDENT_FEE_SUMMARY,
  'Overdue Analysis Report': ReportType.OVERDUE_ANALYSIS,
  'Payment Methods Report': ReportType.PAYMENT_METHOD_ANALYSIS,
  'Class-wise Performance': ReportType.CLASS_WISE_PERFORMANCE
};

const FeeCollection = () => {
  const navigate = useNavigate();
  const { showAlert } = useAuth();
  
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedTerm, setSelectedTerm] = useState('MONTHLY');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState('overview');
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [activeTab, setActiveTab] = useState('students');
  const [dateRange, setDateRange] = useState('this_month');
  const [filterStatus, setFilterStatus] = useState('all');

  // State for API data with loading states
  const [dashboardStats, setDashboardStats] = useState(null);
  const [collectionTrend, setCollectionTrend] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [overdueDistribution, setOverdueDistribution] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [classAnalytics, setClassAnalytics] = useState([]);
  
  // Individual loading states
  const [statsLoading, setStatsLoading] = useState(true);
  const [trendLoading, setTrendLoading] = useState(true);
  const [paymentMethodsLoading, setPaymentMethodsLoading] = useState(true);
  const [overdueLoading, setOverdueLoading] = useState(true);
  const [recentPaymentsLoading, setRecentPaymentsLoading] = useState(true);
  const [studentsLoading, setStudentsLoading] = useState(true);
  const [classAnalyticsLoading, setClassAnalyticsLoading] = useState(true);

  // Cache for student recent payments
  const [studentRecentPaymentsCache, setStudentRecentPaymentsCache] = useState({});
  const [loadingStudentPayments, setLoadingStudentPayments] = useState({});

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadDashboardStats(),
        loadCollectionTrend('MONTHLY'),
        loadPaymentMethods(),
        loadOverdueDistribution(),
        loadRecentPayments(5),
        loadStudents(),
        loadClassAnalytics()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
      showErrorAlert('Data Load Failed', 'Failed to load fee collection data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadDashboardStats = async () => {
    setStatsLoading(true);
    try {
      const response = await feeApi.get('/dashboard/stats');
      const statsData = handleResponse(response);
      setDashboardStats(statsData);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      handleError(error);
    } finally {
      setStatsLoading(false);
    }
  };

  const loadCollectionTrend = async (period) => {
    setTrendLoading(true);
    try {
      const response = await feeApi.get(`/dashboard/trend?period=${period}`);
      const trendData = handleResponse(response);
      setCollectionTrend(trendData.dataPoints || []);
    } catch (error) {
      console.error('Error loading collection trend:', error);
      handleError(error);
    } finally {
      setTrendLoading(false);
    }
  };

  const loadPaymentMethods = async () => {
    setPaymentMethodsLoading(true);
    try {
      const response = await feeApi.get('/dashboard/payment-methods');
      const paymentData = handleResponse(response);
      setPaymentMethods(paymentData.paymentMethods || []);
    } catch (error) {
      console.error('Error loading payment methods:', error);
      handleError(error);
    } finally {
      setPaymentMethodsLoading(false);
    }
  };

  const loadOverdueDistribution = async () => {
    setOverdueLoading(true);
    try {
      const response = await feeApi.get('/dashboard/overdue-distribution');
      const overdueData = handleResponse(response);
      setOverdueDistribution(overdueData.overdueRanges || []);
    } catch (error) {
      console.error('Error loading overdue distribution:', error);
      handleError(error);
    } finally {
      setOverdueLoading(false);
    }
  };

  const loadRecentPayments = async (limit) => {
    setRecentPaymentsLoading(true);
    try {
      const response = await feeApi.get(`/dashboard/recent-payments?limit=${limit}`);
      const paymentsData = handleResponse(response);
      setRecentPayments(paymentsData || []);
    } catch (error) {
      console.error('Error loading recent payments:', error);
      handleError(error);
    } finally {
      setRecentPaymentsLoading(false);
    }
  };

  const loadStudents = async () => {
    setStudentsLoading(true);
    try {
      const filterRequest = {
        page: 0,
        size: 50,
        sortBy: 'createdAt',
        sortDirection: 'DESC'
      };
      const response = await feeApi.post('/students/filter', filterRequest);
      const studentsData = handleResponse(response);
      setStudents(studentsData || []);
    } catch (error) {
      console.error('Error loading students:', error);
      handleError(error);
    } finally {
      setStudentsLoading(false);
    }
  };

  const loadClassAnalytics = async () => {
    setClassAnalyticsLoading(true);
    try {
      // Since the backend endpoint returns empty, we'll calculate from student data
      const gradeGroups = {};
      students.forEach(student => {
        if (student.grade) {
          if (!gradeGroups[student.grade]) {
            gradeGroups[student.grade] = {
              grade: student.grade,
              totalFee: 0,
              collected: 0,
              pending: 0,
              studentCount: 0
            };
          }
          gradeGroups[student.grade].totalFee += student.totalFee || 0;
          gradeGroups[student.grade].collected += student.paidAmount || 0;
          gradeGroups[student.grade].pending += student.pendingAmount || 0;
          gradeGroups[student.grade].studentCount += 1;
        }
      });
      
      setClassAnalytics(Object.values(gradeGroups));
    } catch (error) {
      console.error('Error loading class analytics:', error);
    } finally {
      setClassAnalyticsLoading(false);
    }
  };

  // NEW: Load recent payments for a specific student
  const loadStudentRecentPayments = async (studentId, limit = 5) => {
    setLoadingStudentPayments(prev => ({ ...prev, [studentId]: true }));
    
    try {
      const response = await feeApi.get(`/students/${studentId}/recent-payments?limit=${limit}`);
      const paymentsData = handleResponse(response);
      
      // Cache the results
      setStudentRecentPaymentsCache(prev => ({
        ...prev,
        [studentId]: {
          data: paymentsData,
          timestamp: Date.now()
        }
      }));
      
      return paymentsData;
    } catch (error) {
      console.error(`Error loading recent payments for student ${studentId}:`, error);
      handleError(error);
      throw error;
    } finally {
      setLoadingStudentPayments(prev => ({ ...prev, [studentId]: false }));
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    setStatsLoading(true);
    setTrendLoading(true);
    setPaymentMethodsLoading(true);
    setOverdueLoading(true);
    setRecentPaymentsLoading(true);
    setStudentsLoading(true);
    setClassAnalyticsLoading(true);
    
    try {
      await Promise.all([
        loadDashboardStats(),
        loadCollectionTrend(selectedTerm),
        loadPaymentMethods(),
        loadOverdueDistribution(),
        loadRecentPayments(5),
        loadStudents(),
        loadClassAnalytics()
      ]);
      showSuccessAlert('Data Refreshed', 'All fee collection data has been refreshed.');
    } catch (error) {
      showErrorAlert('Refresh Failed', 'Failed to refresh data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced notification system
  const addNotification = (type, message, action) => {
    const id = Date.now();
    const newNotification = { id, type, message, action };
    setNotifications(prev => [newNotification, ...prev].slice(0, 5));
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  // Handle viewing all transactions for a student
  const handleViewAllTransactions = async (student) => {
    setIsLoading(true);
    try {
      const response = await feeApi.get(`/students/${student.studentId}/payment-history`);
      const history = handleResponse(response);
      
      MySwal.fire({
        title: <span className="text-gray-900">Complete Payment History - {student.studentName}</span>,
        html: (
          <div className="text-left space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Student Summary */}
            <div className="p-4 bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{student.studentName}</h3>
                  <p className="text-sm text-gray-600">{student.grade} • {student.guardianName}</p>
                </div>
                <FeeStatusBadge status={student.feeStatus} />
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <p className="text-xs text-gray-500">Total Fee</p>
                  <p className="text-lg font-bold">KSh {student.totalFee?.toLocaleString('en-KE') || '0'}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Total Paid</p>
                  <p className="text-lg font-bold text-emerald-600">KSh {history.totalPaid?.toLocaleString('en-KE') || '0'}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Pending</p>
                  <p className="text-lg font-bold text-rose-600">KSh {history.totalPending?.toLocaleString('en-KE') || '0'}</p>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Payment Progress</span>
                  <span className="font-medium text-emerald-600">
                    {history.paymentProgress || '0%'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: history.paymentProgress || 
                      `${calculatePaymentPercentage(student.totalFee, student.paidAmount)}%` 
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Transaction List */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">
                  All Transactions ({history.transactions?.length || 0})
                </h4>
              </div>
              
              {history.transactions && history.transactions.length > 0 ? (
                <div className="space-y-3">
                  {history.transactions.map((transaction) => (
                    <div 
                      key={transaction.id} 
                      className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            transaction.paymentMethod === 'ONLINE_BANKING' ? 'bg-blue-100' :
                            transaction.paymentMethod === 'CREDIT_CARD' || transaction.paymentMethod === 'DEBIT_CARD' ? 'bg-emerald-100' :
                            transaction.paymentMethod === 'UPI' ? 'bg-purple-100' :
                            transaction.paymentMethod === 'CASH' ? 'bg-amber-100' : 'bg-gray-100'
                          }`}>
                            {transaction.paymentMethod === 'ONLINE_BANKING' ? <CreditCard className="w-4 h-4 text-blue-600" /> :
                             transaction.paymentMethod === 'CREDIT_CARD' || transaction.paymentMethod === 'DEBIT_CARD' ? <Card className="w-4 h-4 text-emerald-600" /> :
                             transaction.paymentMethod === 'UPI' ? <QrCode className="w-4 h-4 text-purple-600" /> :
                             transaction.paymentMethod === 'CASH' ? <Banknote className="w-4 h-4 text-amber-600" /> :
                             <FileText className="w-4 h-4 text-gray-600" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-gray-900">{transaction.receiptNumber}</p>
                              {transaction.installmentNumber && (
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                  Installment {transaction.installmentNumber}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500">
                              {new Date(transaction.paymentDate).toLocaleDateString('en-KE', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{transaction.verifiedBy || 'System'}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">KSh {transaction.amount?.toLocaleString('en-KE') || '0'}</p>
                          <PaymentMethodBadge method={transaction.paymentMethod} />
                        </div>
                      </div>
                      
                      {transaction.notes && (
                        <div className="mt-2 pt-2 border-t border-gray-100">
                          <p className="text-xs text-gray-600">{transaction.notes}</p>
                        </div>
                      )}
                      
                      {transaction.breakdown && transaction.breakdown.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-xs font-medium text-gray-700 mb-2">Fee Breakdown:</p>
                          <div className="space-y-1">
                            {transaction.breakdown.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-xs">
                                <span className="text-gray-600">{item.category}</span>
                                <span className="font-medium">KSh {item.amount?.toFixed(2)} ({item.percentage}%)</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-900 font-medium">No transactions found</p>
                  <p className="text-sm text-gray-600 mt-1">No payments recorded for this student yet</p>
                </div>
              )}
            </div>

            {/* Payment Summary */}
            {history.summary && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3">Payment Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Transactions</span>
                    <span className="font-medium">{history.summary.totalTransactions || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">First Payment</span>
                    <span className="font-medium">
                      {history.summary.firstPayment ? 
                        new Date(history.summary.firstPayment).toLocaleDateString('en-KE', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        }) : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Last Payment</span>
                    <span className="font-medium">
                      {history.summary.lastPayment ? 
                        new Date(history.summary.lastPayment).toLocaleDateString('en-KE', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        }) : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Payment Methods Used</span>
                    <span className="font-medium">
                      {history.summary.paymentMethods?.join(', ') || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Average Payment Amount</span>
                    <span className="font-medium">
                      KSh {history.summary.averagePaymentAmount?.toLocaleString('en-KE') || '0'}
                    </span>
                  </div>
                </div>
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
    } catch (error) {
      console.error('Error loading payment history:', error);
      handleError(error);
      showErrorAlert('Error', 'Failed to load payment history. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // FIXED: Enhanced Recent Payments Function with NEW endpoint
  const handleShowRecentPayments = async (student) => {
    const studentId = student.studentId;
    
    // Check if already loading
    if (loadingStudentPayments[studentId]) {
      return;
    }
    
    // Check cache first (5 minute cache)
    const cachedData = studentRecentPaymentsCache[studentId];
    const cacheAge = cachedData ? Date.now() - cachedData.timestamp : Infinity;
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
    
    let payments;
    
    if (cachedData && cacheAge < CACHE_DURATION) {
      // Use cached data
      payments = cachedData.data;
    } else {
      // Load fresh data
      try {
        payments = await loadStudentRecentPayments(studentId, 5);
      } catch (error) {
        // Handle error - show appropriate message
        if (student.paymentCount > 0) {
          showErrorAlert(
            'Could not load recent payments',
            `This student has ${student.paymentCount} payment${student.paymentCount > 1 ? 's' : ''} but we couldn't load the recent transactions.`
          );
        } else {
          showNoPaymentsModal(student);
        }
        return;
      }
    }
    
    // Show the modal
    if (!payments || payments.length === 0) {
      showNoPaymentsModal(student);
    } else {
      showRecentPaymentsModal(student, payments);
    }
  };

  // FIXED: Show recent payments modal
  const showRecentPaymentsModal = (student, payments) => {
    const isLoading = loadingStudentPayments[student.studentId];

    MySwal.fire({
      title: <span className="text-gray-900">Recent Payments - {student.studentName}</span>,
      html: (
        <div className="text-left space-y-4 max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading payments...</span>
            </div>
          ) : (
            <>
              <div className="text-sm text-gray-600 mb-3">
                Showing {payments.length} recent transaction{payments.length > 1 ? 's' : ''} 
                {student.paymentCount > payments.length && (
                  <span> of {student.paymentCount} total</span>
                )}
              </div>
              
              {payments.map((payment) => (
                <PaymentTransactionCard 
                  key={payment.id} 
                  payment={payment} 
                  student={student}
                />
              ))}
              
              {student.paymentCount > 5 && (
                <div className="text-center pt-2 border-t border-gray-200">
                  <button
                    onClick={() => {
                      MySwal.close();
                      handleViewAllTransactions(student);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium mt-3 flex items-center justify-center gap-1 w-full"
                  >
                    <span>View complete payment history ({student.paymentCount} transactions)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      ),
      width: 500,
      showConfirmButton: false,
      showCloseButton: true,
      customClass: {
        popup: 'rounded-2xl border border-gray-200 shadow-xl',
        title: 'text-lg font-bold mb-4'
      }
    });
  };

  // FIXED: Show no payments modal
  const showNoPaymentsModal = (student) => {
    MySwal.fire({
      title: <span className="text-gray-900">No Recent Payments</span>,
      html: (
        <div className="text-center py-6">
          <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-900 font-medium">No recent payments found</p>
          <p className="text-sm text-gray-600 mt-1">
            {student.paymentCount > 0 
              ? `This student has ${student.paymentCount} payment${student.paymentCount > 1 ? 's' : ''}, but none in the recent period.`
              : 'No payments recorded for this student yet.'}
          </p>
          {student.paymentCount > 0 && (
            <button
              onClick={() => {
                MySwal.close();
                handleViewAllTransactions(student);
              }}
              className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center gap-1 mx-auto"
            >
              <span>View all {student.paymentCount} transaction{student.paymentCount > 1 ? 's' : ''}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
      width: 400,
      showConfirmButton: false,
      showCloseButton: true,
      customClass: {
        popup: 'rounded-2xl border border-gray-200 shadow-xl',
        title: 'text-lg font-bold mb-4'
      }
    });
  };

  // Enhanced Email Reminder Function
  const handleEmailReminder = async (student) => {
    const { value: formValues } = await MySwal.fire({
      title: <span className="text-gray-900">Send Email Reminder</span>,
      html: (
        <div className="text-left space-y-6">
          {/* Student Information */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{student.studentName}</h3>
                <p className="text-sm text-gray-600">{student.grade} • {student.guardianName}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-rose-600">
                  Pending: KSh {student.pendingAmount?.toLocaleString('en-KE') || '0'}
                </p>
                <p className="text-xs text-gray-500">Due: {student.dueDate || 'N/A'}</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm font-medium">{student.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Reminders Sent</p>
                <p className="text-sm font-medium">{student.remindersSent || 0} times</p>
              </div>
            </div>
          </div>

          {/* Email Template Selection */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Select Email Template</h4>
            <div className="space-y-2">
              {[
                {
                  id: 'GENTLE',
                  title: 'Gentle Reminder',
                  description: 'Polite reminder about pending fee',
                },
                {
                  id: 'DUE_DATE',
                  title: 'Due Date Reminder',
                  description: 'Urgent reminder about approaching due date',
                },
                {
                  id: 'OVERDUE',
                  title: 'Overdue Notice',
                  description: 'Formal notice for overdue payment',
                },
                {
                  id: 'FINAL_NOTICE',
                  title: 'Final Notice',
                  description: 'Final warning before further action',
                },
              ].map((template) => (
                <label
                  key={template.id}
                  className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="emailTemplate"
                    value={template.id}
                    defaultChecked={template.id === 'GENTLE'}
                    className="mt-1 text-blue-600"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{template.title}</p>
                    <p className="text-xs text-gray-500">{template.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Email Content */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-900">Email Content</h4>
              <button
                type="button"
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Reset to Default
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  defaultValue={`Gentle Reminder: School Fee Pending for ${student.studentName}`}
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Message Body
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm min-h-37.5"
                  defaultValue={`Dear ${student.guardianName},

This is a gentle reminder that the school fee for ${student.studentName} (${student.grade}) is pending.

Payment Details:
• Total Fee: KSh ${student.totalFee?.toLocaleString('en-KE') || '0'}
• Amount Paid: KSh ${student.paidAmount?.toLocaleString('en-KE') || '0'}
• Amount Due: KSh ${student.pendingAmount?.toLocaleString('en-KE') || '0'}
• Due Date: ${student.dueDate || 'N/A'}

Payment Methods Available:
1. Online Payment (Portal/UPI)
2. Credit/Debit Card
3. Bank Transfer
4. Cash at School Office

Please complete the payment at your earliest convenience to avoid any late fees.

For any queries or payment issues, please contact the accounts department.

Best regards,
School Accounts Department`}
                />
              </div>
            </div>
          </div>

          {/* Additional Options */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Additional Options</h4>
            <div className="space-y-2">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded text-blue-600"
                />
                <span className="text-sm text-gray-700">
                  Attach fee invoice as PDF
                </span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded text-blue-600"
                />
                <span className="text-sm text-gray-700">
                  Send copy to school accounts department
                </span>
              </label>
            </div>
          </div>
        </div>
      ),
      showCancelButton: true,
      confirmButtonText: 'Send Email',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#6b7280',
      showCloseButton: true,
      width: 700,
      customClass: {
        popup: 'rounded-2xl border border-gray-200 shadow-xl',
        title: 'text-lg font-bold',
      },
      preConfirm: () => {
        const subject = document.querySelector('input[type="text"]').value;
        const content = document.querySelector('textarea').value;
        const template = document.querySelector('input[name="emailTemplate"]:checked').value;
        
        return {
          studentId: student.studentId,
          channel: 'EMAIL',
          template: template,
          customContent: content,
          attachInvoice: true,
          sendCopyToAccounts: true
        };
      },
    });

    if (formValues) {
      setIsLoading(true);
      try {
        const response = await feeApi.post('/reminders/email', formValues);
        const result = handleResponse(response);
        
        showSuccessAlert(
          'Email Sent Successfully!',
          `Email reminder has been sent to ${student.guardianName} (${student.email}).`
        );
        
        addNotification('success', `Email sent to ${student.guardianName}`);
        
        // Refresh student data
        await loadStudents();
        
      } catch (error) {
        handleError(error);
        showErrorAlert('Failed to Send', 'There was an error sending the email. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Enhanced SMS Reminder Function
  const handleSMSReminder = async (student) => {
    const { value: formValues } = await MySwal.fire({
      title: <span className="text-gray-900">Send SMS Reminder</span>,
      html: (
        <div className="text-left space-y-6">
          {/* Student Information */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{student.studentName}</h3>
                <p className="text-sm text-gray-600">{student.grade} • {student.guardianName}</p>
              </div>
              <div className="text-right">
                <Phone className="w-5 h-5 text-gray-400 inline mr-1" />
                <span className="text-sm font-medium">{student.contact}</span>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500">Reminders Sent</p>
                <p className="text-sm font-medium">{student.remindersSent || 0} times</p>
              </div>
            </div>
          </div>

          {/* SMS Template Selection */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Select SMS Template</h4>
            <div className="space-y-2">
              {[
                {
                  id: 'GENTLE',
                  title: 'Gentle SMS',
                  content: `Dear parent, fee for ${student.studentName} is pending. Amount: KSh ${student.pendingAmount}. Due: ${student.dueDate}. School Accounts`,
                  charCount: 120,
                },
                {
                  id: 'OVERDUE',
                  title: 'Urgent SMS',
                  content: `URGENT: Fee for ${student.studentName} overdue. Pay KSh ${student.pendingAmount} immediately. Contact school office.`,
                  charCount: 110,
                },
                {
                  id: 'FINAL_NOTICE',
                  title: 'Final Notice',
                  content: `FINAL NOTICE: School fee overdue for ${student.studentName}. Pay KSh ${student.pendingAmount} now.`,
                  charCount: 90,
                },
              ].map((template) => (
                <label
                  key={template.id}
                  className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="smsTemplate"
                    value={template.id}
                    defaultChecked={template.id === 'GENTLE'}
                    className="mt-1 text-blue-600"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-sm">{template.title}</p>
                      <span className="text-xs text-gray-500">{template.charCount} chars</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{template.content}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* SMS Content */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-900">SMS Content</h4>
              <span className="text-xs text-gray-500">
                <span id="charCount">120</span>/160 characters
              </span>
            </div>
            
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm min-h-25 font-mono"
              defaultValue={`Dear ${student.guardianName}, fee for ${student.studentName} (${student.grade}) is pending. Amount due: KSh ${student.pendingAmount}. Due date: ${student.dueDate}. Pay online or visit school office. School Accounts`}
              onChange={(e) => {
                const charCount = e.target.value.length;
                document.getElementById('charCount').textContent = charCount;
              }}
            />
            
            <div className="mt-2 text-xs text-gray-500">
              Tip: Keep SMS under 160 characters to avoid multiple messages.
            </div>
          </div>
        </div>
      ),
      showCancelButton: true,
      confirmButtonText: 'Send SMS',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      showCloseButton: true,
      width: 600,
      customClass: {
        popup: 'rounded-2xl border border-gray-200 shadow-xl',
        title: 'text-lg font-bold',
      },
      preConfirm: () => {
        const smsContent = document.querySelector('textarea').value;
        if (smsContent.length === 0) {
          MySwal.showValidationMessage('Please enter SMS content');
          return false;
        }
        const template = document.querySelector('input[name="smsTemplate"]:checked').value;
        
        return {
          studentId: student.studentId,
          channel: 'SMS',
          template: template,
          customContent: smsContent,
          attachInvoice: false
        };
      },
    });

    if (formValues) {
      setIsLoading(true);
      try {
        const response = await feeApi.post('/reminders/sms', formValues);
        const result = handleResponse(response);
        
        showSuccessAlert(
          'SMS Sent Successfully!',
          `SMS reminder has been sent to ${student.guardianName} (${student.contact}).`
        );
        
        addNotification('success', `SMS sent to ${student.guardianName}`);
        
        // Refresh student data
        await loadStudents();
        
      } catch (error) {
        handleError(error);
        showErrorAlert('Failed to Send', 'There was an error sending the SMS. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const sendBulkReminders = async () => {
    const selected = filteredStudents.filter(s => selectedStudents.includes(s.studentId));
    if (selected.length === 0) {
      showWarningAlert(
        'No Students Selected',
        'Please select at least one student to send reminders.'
      );
      return;
    }

    const { value: formValues } = await MySwal.fire({
      title: <span className="text-gray-900">Send Bulk Reminders</span>,
      html: (
        <div className="text-left space-y-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-blue-900">
              {selected.length} student{selected.length > 1 ? 's' : ''} selected
            </p>
            <p className="text-xs text-blue-700 mt-1">
              Total pending amount: KSh {selected.reduce((sum, s) => sum + (s.pendingAmount || 0), 0).toLocaleString('en-KE')}
            </p>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Communication Channels
              </label>
              <div className="space-y-2">
                {[
                  { id: 'EMAIL', label: 'Email', icon: Mail },
                  { id: 'SMS', label: 'SMS', icon: MessageSquare },
                  { id: 'WHATSAPP', label: 'WhatsApp', icon: MessageCircle },
                ].map(channel => (
                  <label key={channel.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <input 
                      type="radio" 
                      name="bulkChannel" 
                      value={channel.id} 
                      defaultChecked={channel.id === 'EMAIL'} 
                      className="text-blue-600 rounded" 
                    />
                    <channel.icon className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">{channel.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reminder Template
              </label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option value="GENTLE">Gentle Reminder</option>
                <option value="DUE_DATE">Due Date Reminder</option>
                <option value="OVERDUE">Overdue Notice</option>
                <option value="FINAL_NOTICE">Final Notice</option>
              </select>
            </div>
          </div>
        </div>
      ),
      showCancelButton: true,
      confirmButtonText: 'Send Reminders',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#6b7280',
      showCloseButton: true,
      customClass: {
        popup: 'rounded-2xl border border-gray-200 max-w-md shadow-xl',
        title: 'text-lg font-bold'
      },
      preConfirm: () => {
        const channel = document.querySelector('input[name="bulkChannel"]:checked').value;
        const template = document.querySelector('select').value;
        
        return {
          studentIds: selected.map(s => s.studentId),
          channel: channel,
          template: template,
          attachInvoice: true
        };
      },
    });

    if (formValues) {
      setIsLoading(true);
      try {
        const response = await feeApi.post('/reminders/bulk', formValues);
        const result = handleResponse(response);
        
        if (result) {
          showSuccessAlert(
            'Bulk Reminders Sent!',
            `Successfully sent ${result.successfullySent} reminders. ${result.failed > 0 ? `${result.failed} failed.` : ''}`
          );
          addNotification('success', `Bulk reminders sent to ${result.successfullySent} parents`);
          setSelectedStudents([]);
        }
      } catch (error) {
        handleError(error);
        showErrorAlert('Operation Failed', 'There was an error sending bulk reminders.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleExportData = async (format) => {
    const result = await showConfirmDialog(
      'Export Data',
      `Export fee collection data to ${format} format?`,
      `Export to ${format}`,
      'Cancel'
    );
    
    if (result.isConfirmed) {
      setIsLoading(true);
      try {
        // Create filter request based on current filters
        const filterRequest = {
          grade: selectedClass !== 'All' ? selectedClass : null,
          feeStatus: filterStatus !== 'all' ? filterStatus.toUpperCase() : null,
          searchQuery: searchQuery || null,
          page: 0,
          size: 1000,
          sortBy: 'createdAt',
          sortDirection: 'DESC'
        };

        const response = await feeApi.post('/bulk/export', filterRequest);
        const exportInfo = handleResponse(response);
        
        if (exportInfo.message === "Export functionality not yet implemented") {
          showWarningAlert(
            'Feature Not Available',
            'Export functionality is not yet implemented in the backend. Please check back later.'
          );
        } else {
          showSuccessAlert(
            'Export Initiated!',
            `Export job has been queued. Download will be available at: ${exportInfo.downloadUrl}`
          );
        }
      } catch (error) {
        handleError(error);
        showErrorAlert('Export Failed', 'There was an error initiating the export.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleGenerateReport = async (type) => {
    const { value: formValues } = await MySwal.fire({
      title: <span className="text-gray-900">Generate {type} Report</span>,
      html: (
        <div className="text-left space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input 
                type="date" 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                defaultValue={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input 
                type="date" 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                defaultValue={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
          
          {type === 'Class-wise Performance' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Classes
              </label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {classAnalytics.map(cls => (
                  <label key={cls.grade} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input type="checkbox" defaultChecked className="text-blue-600 rounded" />
                    <span className="text-sm">{cls.grade}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Report Format
            </label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option value="PDF">PDF</option>
              <option value="EXCEL">Excel (XLSX)</option>
              <option value="CSV">CSV</option>
              <option value="HTML">HTML</option>
            </select>
          </div>
        </div>
      ),
      showCancelButton: true,
      confirmButtonText: 'Generate Report',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#6b7280',
      showCloseButton: true,
      customClass: {
        popup: 'rounded-2xl border border-gray-200 max-w-md shadow-xl',
        title: 'text-lg font-bold'
      },
      preConfirm: () => {
        const startDate = document.querySelector('input[type="date"]:first-of-type').value;
        const endDate = document.querySelector('input[type="date"]:last-of-type').value;
        const format = document.querySelector('select').value;
        
        if (!startDate || !endDate) {
          MySwal.showValidationMessage('Please select both start and end dates');
          return false;
        }

        // Use the proper enum mapping
        const reportType = reportTypeMapping[type] || ReportType.CUSTOM_REPORT;
        
        // Validate format is valid enum value
        if (!Object.values(ReportFormat).includes(format)) {
          MySwal.showValidationMessage(`Invalid format: ${format}. Must be one of: ${Object.values(ReportFormat).join(', ')}`);
          return false;
        }

        return {
          reportType: reportType,
          format: format,  // Now using proper enum value
          startDate: startDate,
          endDate: endDate,
          includeCharts: true
        };
      },
    });

    if (formValues) {
      setIsLoading(true);
      try {
        console.log('Sending report request:', formValues);
        const response = await feeApi.post('/reports/generate', formValues);
        const report = handleResponse(response);
        
        showSuccessAlert(
          'Report Generated!',
          `Your ${type} report has been generated successfully. You can download it from the reports section.`
        );
      } catch (error) {
        console.error('Report generation error:', error);
        handleError(error);
        showErrorAlert('Generation Failed', 'There was an error generating the report. Please check the format and try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Filter students
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = searchQuery === '' || 
        [student.studentName, student.guardianName, student.grade, student.email, student.contact]
          .some(field => field?.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesClass = selectedClass === 'All' || student.grade === selectedClass;
      
      const matchesStatus = filterStatus === 'all' || student.feeStatus === filterStatus.toUpperCase();
      
      return matchesSearch && matchesClass && matchesStatus;
    });
  }, [searchQuery, selectedClass, filterStatus, students]);

  // Statistics from API data
  const stats = useMemo(() => {
    if (!dashboardStats) {
      return {
        totalCollected: 'KSh 0',
        totalPending: 'KSh 0',
        totalFee: 'KSh 0',
        collectionRate: '0%',
        paidCount: 0,
        overdueCount: 0,
        partialCount: 0,
        collectionTrend: '+0%',
        pendingTrend: '-0%',
        remindersSent: 0,
        multiplePayments: 0,
        avgPayments: '0'
      };
    }

    return {
      totalCollected: `KSh ${(dashboardStats.totalCollected || 0).toLocaleString('en-KE')}`,
      totalPending: `KSh ${(dashboardStats.totalPending || 0).toLocaleString('en-KE')}`,
      totalFee: `KSh ${(dashboardStats.totalFee || 0).toLocaleString('en-KE')}`,
      collectionRate: `${dashboardStats.collectionRate?.toFixed(1) || '0'}%`,
      paidCount: dashboardStats.paidStudents || 0,
      overdueCount: dashboardStats.overdueStudents || 0,
      partialCount: dashboardStats.partialPaidStudents || 0,
      collectionTrend: dashboardStats.targetAchievementRate ? `+${dashboardStats.targetAchievementRate.toFixed(1)}%` : '+0%',
      pendingTrend: dashboardStats.remainingTarget ? `-${((dashboardStats.remainingTarget / (dashboardStats.totalPending || 1)) * 100).toFixed(1)}%` : '-0%',
      remindersSent: dashboardStats.remindersSentToday || 0,
      multiplePayments: dashboardStats.multiplePaymentStudents || 0,
      avgPayments: dashboardStats.averagePaymentsPerStudent?.toFixed(1) || '0'
    };
  }, [dashboardStats]);

  // Chart data from API
  const collectionTrendData = useMemo(() => {
    return collectionTrend.map(point => ({
      month: new Date(point.date).toLocaleDateString('en-US', { month: 'short' }),
      collected: point.collectedAmount || 0,
      target: point.targetAmount || 0,
      overdue: point.overdueAmount || 0
    }));
  }, [collectionTrend]);

  const paymentMethodsData = useMemo(() => {
    return paymentMethods.map(method => ({
      name: method.displayName,
      value: method.percentage || 0,
      color: method.color || '#6b7280',
      transactions: method.transactionCount || 0,
      amount: method.totalAmount || 0
    }));
  }, [paymentMethods]);

  const overdueDistributionData = useMemo(() => {
    return overdueDistribution.map(range => ({
      range: range.range,
      count: range.studentCount || 0,
      amount: range.totalAmount || 0
    }));
  }, [overdueDistribution]);

  // Quick actions
  const quickActions = [
    { 
      icon: Send, 
      label: 'Batch Reminders', 
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      action: sendBulkReminders 
    },
    { 
      icon: FileText, 
      label: 'Generate Report', 
      color: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
      action: () => handleGenerateReport('Monthly Collection Summary')
    },
    { 
      icon: RefreshCw, 
      label: 'Refresh Data', 
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      action: handleRefresh 
    },
    { 
      icon: Download, 
      label: 'Export Excel', 
      color: 'bg-gradient-to-br from-amber-500 to-amber-600',
      action: () => handleExportData('EXCEL')
    },
    {
      icon: ArrowRight,
      label: 'View Transactions',
      color: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
      action: () => navigate('/accountant/transactions')
    }
  ];

  // Toggle student selection
  const toggleStudentSelection = (studentId) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(s => s.studentId));
    }
  };

  // Handle period change for trend chart
  const handleTrendPeriodChange = async (period) => {
    setSelectedTerm(period);
    setTrendLoading(true);
    try {
      await loadCollectionTrend(period);
    } catch (error) {
      console.error('Error changing trend period:', error);
      handleError(error);
    } finally {
      setTrendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50/30 p-4 md:p-6">
      {/* Notifications Panel */}
      <AnimatePresence>
        {notifications.length > 0 && (
          <div className="fixed top-4 right-4 z-50 space-y-2 w-96">
            {notifications.map(notification => (
              <NotificationToast
                key={notification.id}
                {...notification}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8"
      >
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-xl">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Fee Collection Management
                </h1>
                <p className="text-gray-600 mt-1">
                  Track payments, send reminders, and analyze collection trends
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-xl border border-gray-200 shadow-sm disabled:opacity-50 transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Processing...' : 'Refresh Data'}
            </button>
            <Link
              to="/accountant"
              className="flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 px-4 py-3 hover:bg-white rounded-xl border border-gray-200 transition-all"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Quick Stats - From API */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8"
      >
        <StatCard
          label="Total Collected"
          value={statsLoading ? '...' : stats.totalCollected}
          icon={DollarSign}
          color="bg-gradient-to-br from-blue-500 to-blue-600"
          trend={stats.collectionTrend}
          change={parseFloat(stats.collectionTrend)}
          isLoading={statsLoading}
        />
        <StatCard
          label="Collection Rate"
          value={statsLoading ? '...' : stats.collectionRate}
          icon={Percent}
          color="bg-gradient-to-br from-emerald-500 to-emerald-600"
          trend="+2.3%"
          change={2.3}
          isLoading={statsLoading}
        />
        <StatCard
          label="Paid Students"
          value={statsLoading ? '...' : `${stats.paidCount}/${students.length}`}
          icon={UserCheck}
          color="bg-gradient-to-br from-green-500 to-green-600"
          trend={students.length > 0 ? `${(stats.paidCount/students.length * 100).toFixed(0)}%` : '0%'}
          change={students.length > 0 ? (stats.paidCount/students.length * 100) : 0}
          isLoading={statsLoading || studentsLoading}
        />
        <StatCard
          label="Multiple Payments"
          value={statsLoading ? '...' : `${stats.multiplePayments}/${students.length}`}
          icon={Layers}
          color="bg-gradient-to-br from-purple-500 to-purple-600"
          trend="+5.2%"
          change={5.2}
          isLoading={statsLoading || studentsLoading}
        />
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Collection Trend Chart */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-gray-100 relative"
        >
          <LoadingOverlay isLoading={trendLoading} message="Loading trend data..." />
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Collection Trend & Targets</h2>
              <p className="text-sm text-gray-600 mt-1">Monthly performance vs targets</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={selectedTerm}
                onChange={(e) => handleTrendPeriodChange(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={trendLoading}
              >
                <option value="MONTHLY">Last 6 Months</option>
                <option value="QUARTERLY">Quarterly View</option>
                <option value="DAILY">Daily View</option>
                <option value="WEEKLY">Weekly View</option>
              </select>
            </div>
          </div>
          
          {!trendLoading && collectionTrendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={collectionTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis 
                  dataKey="month" 
                  stroke="#6b7280" 
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#6b7280" 
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `KSh ${(value/1000000).toFixed(0)}M`}
                />
                <Tooltip 
                  formatter={(value) => [`KSh ${(value/1000000).toFixed(2)}M`, 'Amount']}
                  labelStyle={{ color: '#374151', fontWeight: 600 }}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="collected" 
                  name="Collected Amount"
                  stroke="#3b82f6" 
                  fill="url(#colorCollected)" 
                  strokeWidth={3}
                />
                <Area 
                  type="monotone" 
                  dataKey="target" 
                  name="Target Amount"
                  stroke="#10b981" 
                  fill="url(#colorTarget)" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
                <Area 
                  type="monotone" 
                  dataKey="overdue" 
                  name="Overdue Amount"
                  stroke="#ef4444" 
                  fill="url(#colorOverdue)" 
                  strokeWidth={2}
                  opacity={0.6}
                />
                <defs>
                  <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorOverdue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            !trendLoading && (
              <div className="flex items-center justify-center h-80">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No trend data available</p>
                </div>
              </div>
            )
          )}
        </motion.div>

        {/* Payment Methods & Overdue Distribution */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Payment Methods */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 relative">
            <LoadingOverlay isLoading={paymentMethodsLoading} message="Loading payment methods..." />
            
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Payment Methods</h2>
              <PieChartIcon className="w-5 h-5 text-gray-400" />
            </div>
            
            {!paymentMethodsLoading && paymentMethodsData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={paymentMethodsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {paymentMethodsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name, props) => [
                      `${value}% (${props.payload.transactions} transactions)`,
                      name
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              !paymentMethodsLoading && (
                <div className="flex items-center justify-center h-48">
                  <div className="text-center">
                    <PieChartIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No payment method data</p>
                  </div>
                </div>
              )
            )}
          </div>

          {/* Overdue Distribution */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 relative">
            <LoadingOverlay isLoading={overdueLoading} message="Loading overdue data..." />
            
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Overdue Distribution</h2>
              <AlertTriangle className="w-5 h-5 text-rose-400" />
            </div>
            
            {!overdueLoading && overdueDistributionData.length > 0 ? (
              <div className="space-y-4">
                {overdueDistributionData.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{item.range}</span>
                      <span className="text-gray-600">{item.count} students</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-rose-500 h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${(item.count / Math.max(...overdueDistributionData.map(d => d.count || 1)) * 100)}%` 
                        }}
                      />
                    </div>
                    <div className="text-right text-sm text-rose-600 font-medium">
                      KSh {item.amount?.toLocaleString('en-KE') || '0'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              !overdueLoading && (
                <div className="text-center py-8">
                  <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No overdue data available</p>
                </div>
              )
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent Payments Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6 relative"
      >
        <LoadingOverlay isLoading={recentPaymentsLoading} message="Loading recent payments..." />
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Recent Payments</h2>
            <p className="text-sm text-gray-600 mt-1">Latest fee payments received</p>
          </div>
          <Link 
            to="/accountant/transactions"
            className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline flex items-center gap-1"
          >
            View All Transactions
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {!recentPaymentsLoading && recentPayments.length > 0 ? (
          <div className="space-y-3">
            {recentPayments.map((payment) => (
              <motion.div
                key={payment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ x: 5 }}
                className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 hover:border-blue-200 transition-all cursor-pointer"
                onClick={() => navigate(`/accountant/transactions`)}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${
                    payment.paymentMethod === 'ONLINE_BANKING' ? 'bg-blue-100' :
                    payment.paymentMethod === 'CREDIT_CARD' || payment.paymentMethod === 'DEBIT_CARD' ? 'bg-emerald-100' :
                    payment.paymentMethod === 'UPI' ? 'bg-purple-100' :
                    payment.paymentMethod === 'CASH' ? 'bg-amber-100' : 'bg-gray-100'
                  }`}>
                    {payment.paymentMethod === 'ONLINE_BANKING' ? <CreditCard className="w-5 h-5 text-blue-600" /> :
                     payment.paymentMethod === 'CREDIT_CARD' || payment.paymentMethod === 'DEBIT_CARD' ? <Card className="w-5 h-5 text-emerald-600" /> :
                     payment.paymentMethod === 'UPI' ? <QrCode className="w-5 h-5 text-purple-600" /> :
                     payment.paymentMethod === 'CASH' ? <Banknote className="w-5 h-5 text-amber-600" /> :
                     <FileText className="w-5 h-5 text-gray-600" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">{payment.studentName}</p>
                      {payment.installmentNumber && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                          Installment {payment.installmentNumber}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{payment.studentGrade} • {new Date(payment.paymentDate).toLocaleDateString('en-KE', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</p>
                    <p className="text-xs text-gray-500">{payment.receiptNumber}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold text-lg text-gray-900">KSh {payment.amount?.toLocaleString('en-KE') || '0'}</p>
                    <PaymentMethodBadge method={payment.paymentMethod} />
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          !recentPaymentsLoading && (
            <div className="text-center py-12">
              <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No recent payments found</p>
            </div>
          )
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
          <span className="text-sm text-gray-500">One-click operations</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.label}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 * index }}
              onClick={action.action}
              disabled={isLoading}
              className="group bg-white p-5 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-left relative"
            >
              {isLoading && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-2xl">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                </div>
              )}
              <div className={`${action.color} p-3 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <p className="font-semibold text-gray-900">{action.label}</p>
              <p className="text-xs text-gray-500 mt-1">Click to execute</p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Student Fee Management */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden relative"
      >
        <LoadingOverlay isLoading={studentsLoading} message="Loading student data..." />
        
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Student Fee Management</h2>
              <p className="text-gray-600 mt-1">View student fee status and complete payment history</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
              {/* Expand Button */}
              <button
                onClick={() => navigate('/accountant/transactions')}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm hover:shadow-md"
              >
                <ArrowRight className="w-4 h-4" />
                Manage Transactions
              </button>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search students, guardians, or classes..."
                    className="pl-10 pr-4 py-2.5 w-full border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-gray-50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    disabled={studentsLoading}
                  />
                </div>
                
                {/* Filters */}
                <div className="flex gap-2">
                  <select
                    className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    disabled={studentsLoading}
                  >
                    <option value="All">All Classes</option>
                    {[...new Set(students.map(s => s.grade))].map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                  
                  <select
                    className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    disabled={studentsLoading}
                  >
                    <option value="all">All Status</option>
                    <option value="PAID">Paid</option>
                    <option value="PENDING">Pending</option>
                    <option value="OVERDUE">Overdue</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          {/* Selection Stats */}
          {selectedStudents.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">
                      {selectedStudents.length} student{selectedStudents.length > 1 ? 's' : ''} selected
                    </span>
                  </div>
                  <span className="text-sm text-blue-700">
                    Total pending: KSh {students
                      .filter(s => selectedStudents.includes(s.studentId))
                      .reduce((sum, s) => sum + (s.pendingAmount || 0), 0)
                      .toLocaleString('en-KE')}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={sendBulkReminders}
                    className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Send Bulk Reminders
                  </button>
                  <button
                    onClick={() => setSelectedStudents([])}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Student List with Complete Payment History */}
        <div className="overflow-x-auto">
          {!studentsLoading && filteredStudents.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                        onChange={toggleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        disabled={studentsLoading}
                      />
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</span>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Fee Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Amount Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStudents.map((student) => {
                  // Calculate payment percentage on frontend
                  const paymentPercentage = calculatePaymentPercentage(student.totalFee, student.paidAmount);
                  const isRecentPaymentsLoading = loadingStudentPayments[student.studentId];
                  
                  return (
                    <motion.tr
                      key={student.studentId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedStudents.includes(student.studentId)}
                            onChange={() => toggleStudentSelection(student.studentId)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            disabled={studentsLoading}
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-gray-900">{student.studentName}</p>
                              {student.remindersSent > 0 && (
                                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                                  {student.remindersSent} reminder{student.remindersSent > 1 ? 's' : ''}
                                </span>
                              )}
                              {student.paymentCount > 0 && (
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                  {student.paymentCount} payment{student.paymentCount > 1 ? 's' : ''}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{student.grade} • {student.guardianName}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Phone className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-500">{student.contact}</span>
                              <Mail className="w-3 h-3 text-gray-400 ml-2" />
                              <span className="text-xs text-gray-500">{student.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <FeeStatusBadge status={student.feeStatus} />
                          <div className="text-xs space-y-1">
                            <p className="text-gray-500">Due: {student.dueDate || 'N/A'}</p>
                            {student.lastPaymentDate && (
                              <p className="text-emerald-600">Last payment: {new Date(student.lastPaymentDate).toLocaleDateString('en-KE', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}</p>
                            )}
                            {student.lastReminderDate && (
                              <p className="text-amber-600">Last reminder: {new Date(student.lastReminderDate).toLocaleDateString('en-KE', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Total:</span>
                            <span className="font-semibold">KSh {student.totalFee?.toLocaleString('en-KE') || '0'}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Paid:</span>
                            <span className="font-semibold text-emerald-600">KSh {student.paidAmount?.toLocaleString('en-KE') || '0'}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Pending:</span>
                            <span className="font-semibold text-rose-600">KSh {student.pendingAmount?.toLocaleString('en-KE') || '0'}</span>
                          </div>
                          
                          {/* Progress Bar - Now calculated on frontend */}
                          <div className="mt-2">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>Payment Progress</span>
                              <span className="font-medium">
                                {paymentPercentage.toFixed(1)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${paymentPercentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {/* View Recent Payments Button - FIXED */}
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleShowRecentPayments(student)}
                            disabled={isLoading || isRecentPaymentsLoading || student.paymentCount === 0}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                              student.paymentCount === 0 
                                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                : isRecentPaymentsLoading
                                ? 'bg-indigo-50 text-indigo-500 cursor-wait'
                                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                            }`}
                            title={
                              student.paymentCount === 0 
                                ? 'No payments to show' 
                                : isRecentPaymentsLoading
                                ? 'Loading recent payments...'
                                : `View recent payments (${student.paymentCount} total)`
                            }
                          >
                            <Clock className={`w-4 h-4 ${isRecentPaymentsLoading ? 'animate-pulse' : ''}`} />
                            {isRecentPaymentsLoading ? 'Loading...' : (
                              student.paymentCount === 0 ? 'No Txns' : `Recent (${student.paymentCount})`
                            )}
                          </motion.button>
                          
                          {/* Email Reminder */}
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleEmailReminder(student)}
                            disabled={isLoading || student.feeStatus === 'PAID'}
                            className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
                          >
                            <Mail className="w-4 h-4" />
                            Email ({student.remindersSent || 0})
                          </motion.button>
                          
                          {/* SMS Reminder */}
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleSMSReminder(student)}
                            disabled={isLoading || student.feeStatus === 'PAID'}
                            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
                          >
                            <MessageSquare className="w-4 h-4" />
                            SMS ({student.remindersSent || 0})
                          </motion.button>
                          
                          {/* View All Transactions Button */}
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleViewAllTransactions(student)}
                            disabled={isLoading || student.paymentCount === 0}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                              student.paymentCount === 0 
                                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                            }`}
                          >
                            <Eye className="w-4 h-4" />
                            Full History
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            !studentsLoading && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No students found</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  {students.length === 0 
                    ? 'No student data available. Please refresh or check your connection.' 
                    : 'No students match your current search criteria. Try adjusting your filters or search terms.'}
                </p>
              </div>
            )
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default FeeCollection;