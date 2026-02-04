/* eslint-disable no-unused-vars */
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Search,
  Download,
  Eye,
  CreditCard,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Printer,
  Calendar,
  DollarSign,
  CreditCard as Card,
  QrCode,
  Banknote,
  FileText,
  ChevronRight,
  ArrowRight,
  RefreshCw,
  BarChart2,
  TrendingUp,
  TrendingDown,
  Users,
  Percent,
  Clock,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  Receipt,
  Mail,
  MessageSquare,
  Wallet,
  Phone,
  Bell,
  Edit,
  Plus,
  User,
  Home,
  Smartphone,
  FileCheck,
  ReceiptText,
  AlertCircle,
  ShieldCheck,
  FileSearch,
  CheckSquare,
  CalendarDays,
  Upload,
  FileUp,
  Database,
  Check,
  X,
  Link,
  Unlink,
  BarChart,
  CheckCircle2,
  CircleCheck,
  Circle,
  AlertCircle as AlertCircleIcon,
  File,
  Image,
  FileIcon,
  X as XIcon,
  CloudUpload,
  Loader2,
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  MoreHorizontal,
  Layers,
  BookOpen,
  School,
  Book,
  GraduationCap,
  ClipboardCheck,
  ClipboardList,
  AlertOctagon
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const MySwal = withReactContent(Swal);

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

const showWarningAlert = (title, message, actionButton = null) => {
  return MySwal.fire({
    title: <span className="text-amber-600">{title}</span>,
    html: <p className="text-gray-700">{message}</p>,
    icon: 'warning',
    confirmButtonColor: actionButton?.color || '#f59e0b',
    cancelButtonColor: '#6b7280',
    showCloseButton: true,
    customClass: {
      popup: 'rounded-2xl border border-gray-200 shadow-xl',
      title: 'text-lg font-bold',
      confirmButton: 'px-4 py-2 rounded-lg font-medium',
      cancelButton: 'px-4 py-2 rounded-lg font-medium'
    },
    showConfirmButton: !actionButton,
    showCancelButton: !!actionButton,
    confirmButtonText: actionButton ? (actionButton.text || 'Proceed') : 'OK',
    cancelButtonText: 'Cancel'
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

// Payment method mapping for bank transactions
const getPaymentMethodFromBankTransaction = (description) => {
  const desc = description?.toLowerCase() || '';
  if (desc.includes('upi') || desc.includes('qr')) return 'upi';
  if (desc.includes('neft') || desc.includes('rtgs') || desc.includes('imps')) return 'bank';
  if (desc.includes('card')) return 'card';
  if (desc.includes('cash')) return 'cash';
  if (desc.includes('cheque') || desc.includes('check')) return 'cheque';
  return 'bank';
};

const PaymentMethodBadge = ({ method }) => {
  const config = {
    online: { label: 'Online', color: 'bg-blue-100 text-blue-800 border border-blue-200', icon: CreditCard },
    card: { label: 'Card', color: 'bg-emerald-100 text-emerald-800 border border-emerald-200', icon: Card },
    upi: { label: 'UPI', color: 'bg-purple-100 text-purple-800 border border-purple-200', icon: QrCode },
    cash: { label: 'Cash', color: 'bg-amber-100 text-amber-800 border border-amber-200', icon: Banknote },
    cheque: { label: 'Cheque', color: 'bg-gray-100 text-gray-800 border border-gray-200', icon: FileText },
    bank: { label: 'Bank Transfer', color: 'bg-indigo-100 text-indigo-800 border border-indigo-200', icon: FileSpreadsheet },
    ONLINE_BANKING: { label: 'Online Banking', color: 'bg-blue-100 text-blue-800 border border-blue-200', icon: CreditCard },
    UPI: { label: 'UPI', color: 'bg-purple-100 text-purple-800 border border-purple-200', icon: QrCode },
    CASH: { label: 'Cash', color: 'bg-amber-100 text-amber-800 border border-amber-200', icon: Banknote },
    CHEQUE: { label: 'Cheque', color: 'bg-gray-100 text-gray-800 border border-gray-200', icon: FileText },
    CREDIT_CARD: { label: 'Credit Card', color: 'bg-emerald-100 text-emerald-800 border border-emerald-200', icon: Card },
    DEBIT_CARD: { label: 'Debit Card', color: 'bg-emerald-100 text-emerald-800 border border-emerald-200', icon: Card },
    BANK_TRANSFER: { label: 'Bank Transfer', color: 'bg-indigo-100 text-indigo-800 border border-indigo-200', icon: FileSpreadsheet },
    NEFT: { label: 'NEFT', color: 'bg-indigo-100 text-indigo-800 border border-indigo-200', icon: FileSpreadsheet },
    RTGS: { label: 'RTGS', color: 'bg-indigo-100 text-indigo-800 border border-indigo-200', icon: FileSpreadsheet },
    IMPS: { label: 'IMPS', color: 'bg-indigo-100 text-indigo-800 border border-indigo-200', icon: FileSpreadsheet }
  };

  const { label, color, icon: Icon } = config[method] || config.bank;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${color}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
};

const TransactionStatusBadge = ({ status }) => {
  const config = {
    UNVERIFIED: { label: 'Unmatched', color: 'bg-gray-100 text-gray-800 border-gray-200', icon: AlertCircle },
    PENDING: { label: 'Pending', color: 'bg-amber-100 text-amber-800 border-amber-200', icon: Clock },
    MATCHED: { label: 'Auto-Matched', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: CheckCircle },
    VERIFIED: { label: 'Verified', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: ShieldCheck },
    CANCELLED: { label: 'Cancelled', color: 'bg-rose-100 text-rose-800 border-rose-200', icon: XCircle },
    unverified: { label: 'Unmatched', color: 'bg-gray-100 text-gray-800 border-gray-200', icon: AlertCircle },
    pending: { label: 'Pending', color: 'bg-amber-100 text-amber-800 border-amber-200', icon: Clock },
    matched: { label: 'Auto-Matched', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: CheckCircle },
    verified: { label: 'Verified', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: ShieldCheck },
    cancelled: { label: 'Cancelled', color: 'bg-rose-100 text-rose-800 border-rose-200', icon: XCircle }
  };

  const { label, color, icon: Icon } = config[status] || config.UNVERIFIED;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${color}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
};

const TermStatusBadge = ({ status }) => {
  const config = {
    PENDING: { label: 'Pending', color: 'bg-amber-100 text-amber-800 border border-amber-200', icon: Clock },
    PARTIAL: { label: 'Partial', color: 'bg-blue-100 text-blue-800 border border-blue-200', icon: AlertCircle },
    PAID: { label: 'Paid', color: 'bg-emerald-100 text-emerald-800 border border-emerald-200', icon: CheckCircle },
    OVERDUE: { label: 'Overdue', color: 'bg-rose-100 text-rose-800 border border-rose-200', icon: AlertTriangle },
    UNASSIGNED: { label: 'Unassigned', color: 'bg-gray-100 text-gray-800 border border-gray-200', icon: XCircle }
  };

  const { label, color, icon: Icon } = config[status] || config.UNASSIGNED;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${color}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
};

const StatCard = ({ label, value, icon: Icon, color, trend, change }) => {
  const trendColor = change >= 0 ? 'text-emerald-600' : 'text-rose-600';
  const trendIcon = change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
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

const VerifiedStatusIndicator = ({ isVerified }) => {
  if (isVerified) {
    return (
      <div className="flex items-center gap-2">
        <div className="relative">
          <Circle className="w-6 h-6 text-emerald-500 absolute" />
          <CheckCircle2 className="w-6 h-6 text-emerald-500" fill="#10b981" fillOpacity={0.2} />
        </div>
        <span className="text-xs font-medium text-emerald-700">Verified</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <AlertCircleIcon className="w-6 h-6 text-amber-500" />
      <span className="text-xs font-medium text-amber-700">Unverified</span>
    </div>
  );
};

/**
 * Transform backend API response to frontend expected format
 * Converts flat fields to nested student object structure
 */
const transformTransactionResponse = (apiData) => {
  if (!Array.isArray(apiData)) {
    console.warn('transformTransactionResponse: Expected array, got', typeof apiData);
    return [];
  }

  return apiData.map(item => {
    // If it's already in the correct format (has nested student), return as-is
    if (item.student && typeof item.student === 'object') {
      return item;
    }

    // Create a copy to avoid mutating the original
    const transformed = { ...item };
    
    // Check if we have student-related flat fields
    const hasStudentData = item.studentId || item.studentName;
    
    if (hasStudentData) {
      // Build nested student object from flat fields
      transformed.student = {
        // Basic student info
        id: item.studentId,
        studentId: item.studentStudentId || item.studentCode || item.studentId,
        fullName: item.studentName,
        grade: item.studentGrade,
        
        // Term assignment fields (move from transaction root to student object)
        hasTermAssignments: item.hasTermAssignments !== undefined 
          ? item.hasTermAssignments 
          : false,
        termAssignmentCount: item.termAssignmentCount !== undefined 
          ? item.termAssignmentCount 
          : 0,
        
        // Fee fields (move from transaction root to student object)
        totalFee: item.studentTotalFee,
        paidAmount: item.studentPaidAmount,
        pendingAmount: item.studentPendingAmount,
        feeStatus: item.studentFeeStatus,
        paymentPercentage: item.studentPaymentPercentage,
        
        // Contact fields
        phone: item.studentPhone,
        email: item.studentEmail,
        emergencyContactPhone: item.studentEmergencyContactPhone,
        emergencyContactName: item.studentEmergencyContactName,
        contact: item.studentPhone || item.studentEmergencyContactPhone
      };

      // Clean up: remove flat fields that are now nested
      // ✅ FIXED: Use Object.prototype.hasOwnProperty.call() instead of direct call
      const fieldsToRemove = [
        'studentId', 'studentName', 'studentGrade',
        'hasTermAssignments', 'termAssignmentCount',
        'studentTotalFee', 'studentPaidAmount', 'studentPendingAmount',
        'studentFeeStatus', 'studentPaymentPercentage',
        'studentPhone', 'studentEmail', 'studentEmergencyContactPhone',
        'studentEmergencyContactName'
      ];

      fieldsToRemove.forEach(field => {
        // ✅ FIXED: Use the safe method
        if (Object.prototype.hasOwnProperty.call(transformed, field)) {
          delete transformed[field];
        }
      });
    }

    return transformed;
  });
};

/**
 * Transform student list from backend to frontend format
 */
const transformStudentResponse = (apiData) => {
  if (!Array.isArray(apiData)) {
    console.warn('transformStudentResponse: Expected array, got', typeof apiData);
    return [];
  }

  return apiData.map(dto => ({
    id: dto.id,
    studentId: dto.studentId,
    fullName: dto.fullName,
    grade: dto.grade,
    phone: dto.phone,
    email: dto.email,
    address: dto.address,
    emergencyContactName: dto.emergencyContactName,
    emergencyContactPhone: dto.emergencyContactPhone,
    emergencyRelation: dto.emergencyRelation,
    totalFee: dto.totalFee || 0,
    paidAmount: dto.paidAmount || 0,
    pendingAmount: dto.pendingAmount !== undefined 
      ? dto.pendingAmount 
      : Math.max(0, (dto.totalFee || 0) - (dto.paidAmount || 0)),
    feeStatus: dto.feeStatus || 'PENDING',
    contact: dto.phone || dto.emergencyContactPhone,
    
    // Term assignment fields from backend
    hasTermAssignments: dto.hasTermAssignments || false,
    termAssignmentCount: dto.termAssignmentCount || 0
  }));
};

// ============================================
// API SERVICE
// ============================================

// API Service functions
const transactionApi = axios.create({
  baseURL: 'http://localhost:8080/api/transactions',
});

const feeManagementApi = axios.create({
  baseURL: 'http://localhost:8080/api/fees',
});

// Add request interceptor to add auth token
const addAuthToken = (config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

transactionApi.interceptors.request.use(addAuthToken);
feeManagementApi.interceptors.request.use(addAuthToken);

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

const handleError = (error) => {
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
      
      if (errorMessage.includes('Duplicate entry') || errorMessage.includes('constraint')) {
        const match = errorMessage.match(/Duplicate entry '([^']+)'/);
        if (match) {
          errorMessage = `Duplicate reference number detected: "${match[1]}". Please use unique reference numbers.`;
        }
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

// Import Modal Component
const ImportModal = ({ isOpen, onClose, onUpload, isLoading }) => {
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  };

  const processFile = (selectedFile) => {
    setFile(selectedFile);
    
    if (selectedFile.size > 10 * 1024 * 1024) {
      showErrorAlert('File Too Large', 'File size should be less than 10MB');
      return;
    }

    const validTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/json',
      'text/plain'
    ];

    if (!validTypes.includes(selectedFile.type) && !selectedFile.name.match(/\.(csv|xlsx?|json|txt)$/i)) {
      showErrorAlert('Invalid File Type', 'Please upload CSV, Excel, JSON, or text files only');
      return;
    }

    if (selectedFile.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonContent = JSON.parse(e.target.result);
          setPreview({
            type: 'json',
            content: JSON.stringify(jsonContent, null, 2).substring(0, 500) + '...',
            count: Array.isArray(jsonContent) ? jsonContent.length : 1
          });
        } catch (error) {
          setPreview({
            type: 'text',
            content: 'Unable to parse JSON. Raw preview: ' + e.target.result.substring(0, 500) + '...'
          });
        }
      };
      reader.readAsText(selectedFile);
    } else if (selectedFile.type.includes('csv') || selectedFile.name.endsWith('.csv')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const lines = e.target.result.split('\n');
        setPreview({
          type: 'csv',
          content: lines.slice(0, 5).join('\n'),
          count: lines.length - 1
        });
      };
      reader.readAsText(selectedFile);
    } else {
      setPreview({
        type: 'file',
        name: selectedFile.name,
        size: (selectedFile.size / 1024).toFixed(2) + ' KB'
      });
    }
  };

  const handleUpload = () => {
    if (file) {
      onUpload(file);
      resetModal();
    }
  };

  const resetModal = () => {
    setFile(null);
    setPreview(null);
    onClose();
  };

  const getFileIcon = (fileName) => {
    if (fileName?.endsWith('.csv')) return <FileText className="w-10 h-10 text-emerald-600" />;
    if (fileName?.endsWith('.xlsx') || fileName?.endsWith('.xls')) return <FileSpreadsheet className="w-10 h-10 text-green-600" />;
    if (fileName?.endsWith('.json')) return <FileText className="w-10 h-10 text-amber-600" />;
    return <File className="w-10 h-10 text-blue-600" />;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div 
          className="fixed inset-0 bg-linear-to-br from-white/40 via-gray-50/30 to-blue-50/20 backdrop-blur-md"
          onClick={resetModal}
        />
        
        <div className="relative min-h-screen flex items-start justify-center p-4 pt-28 lg:pt-32">
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", damping: 20, stiffness: 300, delay: 0.1 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl mt-4"
          >
            <div className="relative bg-linear-to-br from-white/95 via-white/92 to-white/95 backdrop-blur-xl rounded-2xl border border-white/50 shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-gray-100/50 bg-linear-to-r from-white/60 via-white/40 to-white/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-linear-to-br from-blue-100/50 to-blue-200/50 backdrop-blur-sm rounded-xl">
                      <Upload className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">Import Bank Statement</h2>
                      <p className="text-gray-600 mt-1">Upload CSV, Excel, or JSON files from your bank</p>
                    </div>
                  </div>
                  <button
                    onClick={resetModal}
                    className="p-2 hover:bg-white/60 rounded-full transition-colors backdrop-blur-sm"
                  >
                    <XIcon className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-8">
                  <div
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                      dragOver
                        ? 'border-blue-400 bg-blue-50/50 scale-[1.02] backdrop-blur-sm'
                        : 'border-gray-300/60 hover:border-blue-300/60 hover:bg-gray-50/40 backdrop-blur-sm'
                    }`}
                    style={{
                      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(147, 51, 234, 0.04) 100%)',
                    }}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      onChange={handleFileChange}
                      accept=".csv,.xlsx,.xls,.json,.txt"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center">
                        <div className="p-4 bg-linear-to-br from-blue-50/70 to-blue-100/70 backdrop-blur-sm rounded-full mb-4">
                          <CloudUpload className="w-12 h-12 text-blue-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          {file ? 'File Selected' : 'Drag & Drop or Click to Upload'}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {file ? file.name : 'Supports CSV, Excel, JSON files up to 10MB'}
                        </p>
                        {!file && (
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-3 bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium shadow-lg shadow-blue-400/20 hover:shadow-xl hover:shadow-blue-400/30 transition-all"
                          >
                            Browse Files
                          </motion.div>
                        )}
                      </div>
                    </label>
                  </div>
                </div>

                {file && preview && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                  >
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">File Preview</h3>
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200/40 p-6 shadow-sm">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          {getFileIcon(file.name)}
                          <div>
                            <h4 className="font-medium text-gray-800">{file.name}</h4>
                            <p className="text-sm text-gray-600">
                              {(file.size / 1024).toFixed(2)} KB • {preview.count ? `${preview.count} records` : 'Processing...'}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setFile(null);
                            setPreview(null);
                          }}
                          className="p-2 hover:bg-white/60 rounded-full backdrop-blur-sm"
                        >
                          <XIcon className="w-5 h-5 text-gray-500" />
                        </button>
                      </div>

                      {preview.content && (
                        <div className="mt-4">
                          <div className="flex items-center gap-2 mb-2">
                            <FileSearch className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">Preview</span>
                          </div>
                          <div className="bg-gray-50/90 backdrop-blur-sm rounded-lg p-4 overflow-auto max-h-60 shadow-inner border border-gray-200/30">
                            <pre className="text-sm text-gray-700 font-mono whitespace-pre-wrap">
                              {preview.content}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-800 mb-3">Supported Formats</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="flex items-center gap-2 p-3 bg-white/70 backdrop-blur-sm rounded-lg border border-gray-200/40">
                      <FileText className="w-5 h-5 text-emerald-500" />
                      <span className="text-sm font-medium">CSV</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-white/70 backdrop-blur-sm rounded-lg border border-gray-200/40">
                      <FileSpreadsheet className="w-5 h-5 text-green-500" />
                      <span className="text-sm font-medium">Excel</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-white/70 backdrop-blur-sm rounded-lg border border-gray-200/40">
                      <FileText className="w-5 h-5 text-amber-500" />
                      <span className="text-sm font-medium">JSON</span>
                    </div>
                  </div>
                </div>

                <div className="bg-linear-to-r from-blue-50/70 to-indigo-50/70 backdrop-blur-sm rounded-lg p-4 border border-blue-100/50">
                  <h4 className="font-semibold text-blue-800 mb-2">📋 Import Instructions</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Ensure file has columns: Date, Description, Amount, Reference</li>
                    <li>• Remove any header rows or footers from the statement</li>
                    <li>• Date format should be YYYY-MM-DD or DD/MM/YYYY</li>
                    <li>• Amount should be numeric (KES symbol will be removed)</li>
                  </ul>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100/50 bg-linear-to-r from-transparent via-white/50 to-transparent">
                <div className="flex gap-3">
                  <button
                    onClick={resetModal}
                    disabled={isLoading}
                    className="flex-1 px-4 py-3 bg-white/80 hover:bg-white text-gray-700 rounded-lg border border-gray-300/60 backdrop-blur-sm transition-all text-sm font-medium hover:shadow-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={!file || isLoading}
                    className="flex-1 px-4 py-3 bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-lg shadow-lg shadow-emerald-400/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium hover:shadow-xl hover:shadow-emerald-400/30"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Importing...
                      </span>
                    ) : (
                      'Import File'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const SimplePagination = ({ currentPage, onPageChange, hasNextPage, hasPreviousPage }) => {
  return (
    <div className="flex items-center justify-center gap-4 px-4 py-3 border-t border-gray-200 bg-white">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPreviousPage}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
          hasPreviousPage
            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            : 'bg-gray-50 text-gray-400 cursor-not-allowed'
        }`}
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </button>
      
      <span className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">
        Page {currentPage}
      </span>
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
          hasNextPage
            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            : 'bg-gray-50 text-gray-400 cursor-not-allowed'
        }`}
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

const Transactions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const studentIdParam = queryParams.get('student');
  const { showAlert } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [activeTab, setActiveTab] = useState('unverified');
  const [showImportModal, setShowImportModal] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const MAX_PAGE_ROWS = 20;

  const [bankStatements, setBankStatements] = useState([]);
  const [students, setStudents] = useState([]);
  const [backendStats, setBackendStats] = useState({
    totalTransactions: 0,
    unverifiedCount: 0,
    matchedCount: 0,
    verifiedCount: 0,
    totalAmount: 0,
    todayAmount: 0,
    matchRate: "0%",
    totalPendingFees: 0
  });

  // Cache refresh function
  const refreshBackendCache = async () => {
    try {
      const response = await transactionApi.post('/optimization/cache/refresh');
      handleResponse(response);
      return true;
    } catch (error) {
      console.error('Failed to refresh backend cache:', error);
      return false;
    }
  };

  // Fetch statistics from backend
  const fetchStatistics = async () => {
    try {
      const response = await transactionApi.get('/statistics/summary');
      const statsData = handleResponse(response);
      
      setBackendStats({
        totalTransactions: statsData.totalTransactions || 0,
        unverifiedCount: statsData.unverifiedCount || 0,
        matchedCount: statsData.matchedCount || 0,
        verifiedCount: statsData.verifiedCount || 0,
        totalAmount: statsData.totalAmount || 0,
        todayAmount: statsData.todayAmount || 0,
        matchRate: statsData.matchRate || "0%",
        totalPendingFees: statsData.totalPendingFees || 0
      });
      
      return statsData;
    } catch (error) {
      console.error('Error fetching statistics:', error);
      return null;
    }
  };

  // UPDATED FETCH FUNCTION WITH DATA TRANSFORMATION
  const fetchAllData = useCallback(async (refreshCache = false) => {
    setIsLoading(true);
    
    try {
      // Step 1: Refresh backend cache if requested
      if (refreshCache) {
        await refreshBackendCache();
      }
      
      // Step 2: Fetch statistics FIRST
      await fetchStatistics();
      
      // Step 3: Fetch ALL bank transactions and TRANSFORM the data
      try {
        const bankResponse = await transactionApi.get('/bank?all=true');
        const allBankData = handleResponse(bankResponse);
        
        console.log('🔍 Raw API response (first transaction):', allBankData[0]);
        
        // TRANSFORM THE DATA: Convert flat fields to nested structure
        const transformedBankData = transformTransactionResponse(allBankData);
        
        console.log('✅ Transformed data (first transaction):', transformedBankData[0]);
        console.log(`✅ Loaded ${transformedBankData.length} bank transactions`);
        
        setBankStatements(transformedBankData);
        setCurrentPage(1);
        
      } catch (bankError) {
        console.error('Error fetching bank transactions:', bankError);
        showAlert('warning', 'Bank transactions', 'Could not load bank transactions');
        
        // Fallback
        try {
          const fallbackResponse = await transactionApi.get('/bank?page=0&size=1000');
          const fallbackData = handleResponse(fallbackResponse);
          const transformedData = transformTransactionResponse(fallbackData.content || []);
          setBankStatements(transformedData);
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError);
        }
      }

      // Step 4: Fetch ALL students and transform the data
      try {
        const studentsResponse = await axios.get('http://localhost:8080/api/v1/students', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const studentsData = studentsResponse.data;
        
        // Transform student data
        const formattedStudents = transformStudentResponse(
          Array.isArray(studentsData) ? studentsData : []
        );

        setStudents(formattedStudents);
        console.log(`✅ Loaded ${formattedStudents.length} students`);

      } catch (studentError) {
        console.error('Error fetching students:', studentError);
        showAlert('warning', 'Student Data', 'Could not load student information');
      }
      
      // Step 5: Show success message
      if (refreshCache) {
        showSuccessAlert(
          'Data Refreshed!',
          'Successfully refreshed transactions and students from backend.'
        );
      }
      
    } catch (error) {
      console.error('General error fetching data:', error);
      showAlert('error', 'Data Load Error', error.message);
    } finally {
      setIsLoading(false);
    }
  }, [showAlert]);

  // Initial data fetch
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Filter transactions based on active tab, search, and pagination
  const filteredTransactions = useMemo(() => {
    let transactions = [...bankStatements];
    
    if (activeTab === 'unverified') {
      transactions = bankStatements.filter(stmt => 
        stmt.status === 'UNVERIFIED' || stmt.status === 'PENDING'
      );
    } else if (activeTab === 'matched') {
      transactions = bankStatements.filter(stmt => 
        stmt.status === 'MATCHED'
      );
    } else if (activeTab === 'verified') {
      transactions = bankStatements.filter(stmt => 
        stmt.status === 'VERIFIED'
      );
    } else if (activeTab === 'all') {
      transactions = [...bankStatements];
    }

    // Filter by student if studentId param exists
    if (studentIdParam) {
      transactions = transactions.filter(t => 
        t.student?.id === parseInt(studentIdParam)
      );
    }

    // Apply search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      transactions = transactions.filter(transaction => {
        return (
          (transaction.student?.fullName || '').toLowerCase().includes(searchLower) ||
          (transaction.description || '').toLowerCase().includes(searchLower) ||
          (transaction.bankReference || '').toLowerCase().includes(searchLower) ||
          String(transaction.amount || '').includes(searchQuery)
        );
      });
    }

    // Sort by date, most recent first
    transactions.sort((a, b) => {
      const dateA = a.transactionDate ? new Date(a.transactionDate) : new Date(a.paymentDate || 0);
      const dateB = b.transactionDate ? new Date(b.transactionDate) : new Date(b.paymentDate || 0);
      return dateB - dateA;
    });

    // Apply SIMPLE pagination
    const startIndex = (currentPage - 1) * MAX_PAGE_ROWS;
    const endIndex = startIndex + MAX_PAGE_ROWS;
    
    return {
      total: transactions.length,
      hasNextPage: endIndex < transactions.length,
      hasPreviousPage: currentPage > 1,
      pageData: transactions.slice(startIndex, endIndex)
    };
  }, [activeTab, studentIdParam, searchQuery, bankStatements, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  // Get student data (now works with nested structure)
  const getStudentData = (studentId) => {
    return students.find(s => s.id === studentId);
  };

  // Validate student for payment
  const validateStudentForPayment = async (studentId) => {
    try {
      const response = await feeManagementApi.get(`/student/${studentId}/validate`);
      const validationData = handleResponse(response);
      
      if (!validationData.success) {
        throw new Error(validationData.message || 'Student validation failed');
      }
      
      return {
        success: true,
        data: validationData.data,
        message: validationData.message
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Student validation failed',
        data: { hasTermAssignments: false }
      };
    }
  };

  // View term assignments for a student
  const handleViewTermAssignments = async (student) => {
    if (!student) return;
    
    console.log('📘 Viewing term assignments for student:', student);
    
    setIsLoading(true);
    
    try {
      // ONLY fetch term assignments data
      console.log('📞 Calling term assignments API for student ID:', student.id);
      
      const response = await feeManagementApi.get(`/student/${student.id}/term-assignments`);
      const data = handleResponse(response);
      
      console.log('✅ Term assignments API response:', data);
      
      // Extract term assignments from the response
      let termAssignments = [];
      
      // Handle different response formats
      if (data && data.data && Array.isArray(data.data.termAssignments)) {
        termAssignments = data.data.termAssignments;
        console.log('📊 Got term assignments from data.data.termAssignments:', termAssignments.length);
      } else if (Array.isArray(data)) {
        termAssignments = data;
        console.log('📊 Got term assignments from array response:', termAssignments.length);
      } else if (data && Array.isArray(data.termAssignments)) {
        termAssignments = data.termAssignments;
        console.log('📊 Got term assignments from data.termAssignments:', termAssignments.length);
      } else {
        console.log('⚠️ No term assignments found in response structure:', data);
      }
      
      // Calculate totals from term assignments
      const totalTermFee = termAssignments.reduce((sum, term) => sum + (Number(term.totalFee) || 0), 0);
      const totalTermPaid = termAssignments.reduce((sum, term) => sum + (Number(term.paidAmount) || 0), 0);
      const totalTermPending = termAssignments.reduce((sum, term) => sum + (Number(term.pendingAmount) || 0), 0);
      
      // Use student data as fallback
      const hasTermAssignments = termAssignments.length > 0;
      const termAssignmentCount = termAssignments.length;
      
      const formatCurrency = (amount) => {
        const numAmount = Number(amount) || 0;
        return new Intl.NumberFormat('en-KE', {
          style: 'currency',
          currency: 'KES',
          minimumFractionDigits: 2
        }).format(numAmount);
      };

      // Show as SweetAlert2 popup
      MySwal.fire({
        title: <span className="text-gray-900">Term Assignments - {student.fullName}</span>,
        html: (
          <div className="text-left space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Student Information */}
            <div className="p-4 bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-lg text-gray-900">Student Information</h3>
                  </div>
                  <p className="text-sm text-gray-600">{student.grade} • ID: {student.studentId}</p>
                </div>
                <div className={`px-3 py-1.5 rounded-lg ${
                  hasTermAssignments 
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}>
                  <div className="flex items-center gap-2">
                    {hasTermAssignments ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <AlertTriangle className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium">
                      {hasTermAssignments ? 'Has Term Assignments' : 'No Term Assignments'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Total Terms</p>
                  <p className="text-lg font-bold text-gray-900">
                    {termAssignmentCount}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Total Fee</p>
                  <p className="text-lg font-bold text-gray-900">
                    {formatCurrency(student.totalFee || totalTermFee || 0)}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Paid Amount</p>
                  <p className="text-lg font-bold text-gray-900">
                    {formatCurrency(student.paidAmount || totalTermPaid || 0)}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Pending</p>
                  <p className="text-lg font-bold text-amber-600">
                    {formatCurrency(student.pendingAmount || totalTermPending || 0)}
                  </p>
                </div>
              </div>

              {!hasTermAssignments && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-amber-800">No Term Assignments</h4>
                      <p className="text-xs text-amber-700 mt-1">
                        This student has not been assigned to any academic terms.
                      </p>
                      <div className="mt-2 text-xs text-amber-700">
                        <p className="font-medium">Required Action:</p>
                        <p className="mt-1">Please assign this student to academic terms in the Term Management section.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Term Assignments List */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-gray-700" />
                  <h3 className="font-semibold text-gray-900">Term-wise Fee Breakdown</h3>
                </div>
                <span className="text-sm text-gray-500">
                  {termAssignmentCount} term(s) assigned
                </span>
              </div>

              {!hasTermAssignments ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
                  <Book className="w-12 h-12 text-gray-400 mx-auto" />
                  <h4 className="mt-4 text-lg font-semibold text-gray-900">No Term Assignments Found</h4>
                  <p className="text-gray-600 mt-2">
                    This student has not been assigned to any academic terms.
                  </p>
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 max-w-md mx-auto">
                    <p className="text-sm text-blue-800 font-medium">Next Steps:</p>
                    <ul className="text-xs text-blue-700 mt-1 space-y-1">
                      <li>• Navigate to Term Management section</li>
                      <li>• Assign student to current academic term</li>
                      <li>• Configure term fees and due dates</li>
                      <li>• Refresh student data after assignment</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {termAssignments.map((term, index) => (
                    <div
                      key={index}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <School className="w-4 h-4 text-blue-600" />
                            <h4 className="font-medium text-gray-900">
                              {term.termName || `Term ${index + 1}`}
                            </h4>
                          </div>

                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <p className="text-xs text-gray-500">Total Fee</p>
                              <p className="text-sm font-bold text-gray-900">
                                {formatCurrency(term.totalFee || 0)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Paid Amount</p>
                              <p className="text-sm font-bold text-emerald-600">
                                {formatCurrency(term.paidAmount || 0)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Pending</p>
                              <p className="text-sm font-bold text-amber-600">
                                {formatCurrency(term.pendingAmount || 0)}
                              </p>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="mt-3">
                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                              <span>Payment Progress</span>
                              <span className="font-medium">
                                {term.totalFee > 0 
                                  ? `${Math.round(((term.paidAmount || 0) / (term.totalFee || 1)) * 100)}%`
                                  : '0%'
                                }
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="h-2 bg-linear-to-r from-blue-500 to-emerald-500 rounded-full"
                                style={{
                                  width: `${term.totalFee > 0 
                                    ? Math.min(100, ((term.paidAmount || 0) / (term.totalFee || 1)) * 100)
                                    : 0}%`
                                }}
                              />
                            </div>
                          </div>
                          
                          {/* Show fee items if available */}
                          {term.feeItems && term.feeItems.length > 0 && (
                            <div className="mt-3">
                              <p className="text-xs font-medium text-gray-700 mb-1">Fee Breakdown:</p>
                              <div className="grid grid-cols-2 gap-2">
                                {term.feeBreakdown && (
                                  <>
                                    {term.feeBreakdown.tuitionFee > 0 && (
                                      <div className="text-xs">
                                        <span className="text-gray-600">Tuition: </span>
                                        <span className="font-medium">{formatCurrency(term.feeBreakdown.tuitionFee)}</span>
                                      </div>
                                    )}
                                    {term.feeBreakdown.examinationFee > 0 && (
                                      <div className="text-xs">
                                        <span className="text-gray-600">Examination: </span>
                                        <span className="font-medium">{formatCurrency(term.feeBreakdown.examinationFee)}</span>
                                      </div>
                                    )}
                                    {term.feeBreakdown.otherFees > 0 && (
                                      <div className="text-xs">
                                        <span className="text-gray-600">Other Fees: </span>
                                        <span className="font-medium">{formatCurrency(term.feeBreakdown.otherFees)}</span>
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="ml-3">
                          <TermStatusBadge status={term.status || 'UNASSIGNED'} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="p-4 bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-gray-900 mb-3">Payment Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 bg-white rounded-lg">
                  <p className="text-xs text-gray-500">Total Terms</p>
                  <p className="text-lg font-bold text-gray-900">{termAssignmentCount}</p>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <p className="text-xs text-gray-500">Total Fee</p>
                  <p className="text-lg font-bold text-gray-900">
                    {formatCurrency(totalTermFee || student.totalFee || 0)}
                  </p>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <p className="text-xs text-gray-500">Total Paid</p>
                  <p className="text-lg font-bold text-emerald-600">
                    {formatCurrency(totalTermPaid || student.paidAmount || 0)}
                  </p>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <p className="text-xs text-gray-500">Total Pending</p>
                  <p className="text-lg font-bold text-amber-600">
                    {formatCurrency(totalTermPending || student.pendingAmount || 0)}
                  </p>
                </div>
              </div>
              
              {!hasTermAssignments && (
                <div className="mt-3 p-2 bg-amber-50 rounded border border-amber-200">
                  <p className="text-xs text-amber-700 font-medium">
                    ℹ️ No term assignments found. Using student-level fee data.
                  </p>
                </div>
              )}
            </div>
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
      console.error('❌ Error in handleViewTermAssignments:', error);
      
      // Show user-friendly error message
      MySwal.fire({
        title: <span className="text-amber-600">Term Assignments</span>,
        html: (
          <div className="text-center py-4">
            <Book className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Term Data</h4>
            <p className="text-gray-600 mb-4">
              {error.message || 'Could not retrieve term assignment information.'}
            </p>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 max-w-md mx-auto">
              <p className="text-sm font-medium text-gray-900">Student Information:</p>
              <p className="text-sm text-gray-700">{student.fullName} • {student.grade}</p>
              <p className="text-xs text-gray-500 mt-1">Student ID: {student.studentId}</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="text-center">
                  <p className="text-xs text-gray-500">Total Fee</p>
                  <p className="font-bold">KSh {student.totalFee?.toLocaleString('en-KE') || '0'}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Pending</p>
                  <p className="font-bold text-amber-600">KSh {student.pendingAmount?.toLocaleString('en-KE') || '0'}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-blue-800">Troubleshooting:</p>
              <ul className="text-xs text-blue-700 mt-1 space-y-1">
                <li>• Check if the student exists in the system</li>
                <li>• Verify term management service is running</li>
                <li>• Ensure student has active enrollment status</li>
              </ul>
            </div>
          </div>
        ),
        width: 500,
        showConfirmButton: true,
        confirmButtonText: 'OK',
        confirmButtonColor: '#3b82f6',
        showCloseButton: true,
        customClass: {
          popup: 'rounded-2xl border border-gray-200 shadow-xl',
          title: 'text-lg font-bold mb-4',
          confirmButton: 'px-4 py-2 rounded-lg font-medium'
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Bulk validate students
  const handleBulkValidate = async () => {
    if (selectedStudents.length === 0) {
      showErrorAlert('No Selection', 'Please select students to validate.');
      return;
    }

    setIsLoading(true);
    try {
      const validationResults = [];
      let validCount = 0;
      let invalidCount = 0;
      let totalPendingAmount = 0;

      for (const studentId of selectedStudents) {
        const student = getStudentData(studentId);
        if (!student) continue;

        const result = await validateStudentForPayment(studentId);
        validationResults.push({
          student,
          result
        });

        if (result.success) {
          validCount++;
          totalPendingAmount += student.pendingAmount || 0;
        } else {
          invalidCount++;
        }
      }

      const summaryHtml = (
        <div className="text-left space-y-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
              <p className="text-xs text-emerald-700">Valid Students</p>
              <p className="text-2xl font-bold text-emerald-800">{validCount}</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-xs text-amber-700">Invalid Students</p>
              <p className="text-2xl font-bold text-amber-800">{invalidCount}</p>
            </div>
          </div>

          {validCount > 0 && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 font-medium">
                Total Pending Amount: KSh {totalPendingAmount.toLocaleString('en-KE')}
              </p>
            </div>
          )}

          {invalidCount > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold text-amber-800 mb-2">Issues Found:</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {validationResults
                  .filter(r => !r.result.success)
                  .map((r, index) => (
                    <div key={index} className="p-2 bg-amber-50 rounded border border-amber-200">
                      <p className="text-sm font-medium text-gray-900">{r.student.fullName}</p>
                      <p className="text-xs text-amber-700">{r.result.message}</p>
                    </div>
                  ))
                }
              </div>
            </div>
          )}

          {invalidCount > 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertOctagon className="w-4 h-4 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800">Action Required</p>
                  <p className="text-xs text-amber-700 mt-1">
                    {invalidCount} student{invalidCount > 1 ? 's' : ''} cannot receive payments due to missing term assignments.
                    Please resolve these issues before proceeding.
                  </p>
                  <div className="mt-2 space-y-1">
                    <p className="text-xs font-medium text-amber-800">Suggested Actions:</p>
                    <ul className="text-xs text-amber-700 space-y-1">
                      <li>• Check term management for missing assignments</li>
                      <li>• Verify student enrollment status</li>
                      <li>• Ensure term fees are properly configured</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      );

      const result = await showConfirmDialog(
        'Bulk Validation Results',
        summaryHtml,
        validCount > 0 ? 'Process Payments' : 'Close',
        'Cancel'
      );

      if (result.isConfirmed && validCount > 0) {
        showSuccessAlert(
          'Validation Complete',
          `Ready to process payments for ${validCount} valid student(s). Total pending amount: KSh ${totalPendingAmount.toLocaleString('en-KE')}`
        );
      }

    } catch (error) {
      showErrorAlert('Validation Failed', error.message || 'Failed to validate students.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file import
  const handleUpload = async (file) => {
    if (!file) return;
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await transactionApi.post('/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const importedData = handleResponse(response);
      // Transform imported data
      const transformedData = transformTransactionResponse(importedData);
      setBankStatements(prev => [...transformedData, ...prev]);
      setShowImportModal(false);
      setCurrentPage(1);
      
      await fetchStatistics();
      
      showSuccessAlert(
        'File Imported!',
        `Successfully imported ${importedData.length} transactions from bank statement. Statistics have been updated.`
      );
    } catch (error) {
      console.error('Import error:', error);
      showErrorAlert('Import Failed', error.message || 'Failed to import bank statement file.');
    } finally {
      setIsLoading(false);
    }
  };

  // Edit Payment Record
  const handleEditPaymentRecord = async (bankTransaction = null, isNewMatch = false) => {
    if (bankTransaction?.student?.id) {
      const validationResult = await validateStudentForPayment(bankTransaction.student.id);
      if (!validationResult.success) {
        const warningResult = await showWarningAlert(
          'Student Validation Failed',
          validationResult.message,
          {
            text: 'View Term Assignments',
            color: '#3b82f6'
          }
        );
        
        if (warningResult.isConfirmed) {
          const student = getStudentData(bankTransaction.student.id);
          if (student) {
            handleViewTermAssignments(student);
          }
          return;
        }
      }
    }

    const { value: formValues } = await MySwal.fire({
      title: <span className="text-gray-900">
        {isNewMatch ? 'Match Bank Transaction' : 'Edit Payment Record'}
      </span>,
      html: (
        <div className="text-left space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Bank Transaction Details */}
          <div className="p-4 bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Banknote className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-lg text-gray-900">Bank Transaction</h3>
                </div>
                <p className="text-sm text-gray-600">Details from bank statement</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-emerald-600">
                  KSh {bankTransaction?.amount?.toLocaleString('en-KE') || '0'}
                </p>
                <TransactionStatusBadge status={bankTransaction?.status || 'UNVERIFIED'} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <p className="text-xs text-gray-500">Date</p>
                <p className="text-sm font-medium">
                  {bankTransaction?.transactionDate ? new Date(bankTransaction.transactionDate).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Reference</p>
                <p className="text-sm font-medium font-mono">{bankTransaction?.bankReference || 'N/A'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-gray-500">Description</p>
                <p className="text-sm font-medium">{bankTransaction?.description || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Student Validation Section */}
          {bankTransaction?.student && (
            <div className="p-4 bg-linear-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ClipboardCheck className="w-5 h-5 text-emerald-600" />
                  <h4 className="font-semibold text-gray-900">Student Validation</h4>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const student = getStudentData(bankTransaction.student.id);
                      if (student) {
                        handleViewTermAssignments(student);
                        MySwal.close();
                      }
                    }}
                    className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    View Terms
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500">Student</p>
                  <p className="text-sm font-medium">{bankTransaction.student.fullName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Class</p>
                  <p className="text-sm font-medium">{bankTransaction.student.grade}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-gray-500">Term Assignments</p>
                  <p className="text-sm font-medium flex items-center gap-2">
                    {bankTransaction.student.hasTermAssignments ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span className="text-emerald-700">Validated ({bankTransaction.student.termAssignmentCount} terms)</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                        <span className="text-amber-700">No term assignments</span>
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Student Selection */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Select Student</h4>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                id="studentSelect"
                className="w-full border border-gray-300 rounded-lg px-10 py-2.5 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                defaultValue={bankTransaction?.student?.id || ""}
              >
                <option value="">Search and select student...</option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.fullName} ({student.grade}) - 
                    ID: {student.studentId} - 
                    {student.hasTermAssignments ? 
                      `✅ ${student.termAssignmentCount} term(s)` : 
                      '❌ No term assignments'} - 
                    Pending: KSh {student.pendingAmount.toLocaleString('en-KE')}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mt-3 grid grid-cols-3 gap-2">
              {students.slice(0, 3).map(student => (
                <button
                  key={student.id}
                  type="button"
                  onClick={() => {
                    document.getElementById('studentSelect').value = student.id;
                  }}
                  className={`p-2 border rounded-lg text-left transition-colors ${
                    student.hasTermAssignments
                      ? 'border-emerald-200 bg-emerald-50 hover:bg-emerald-100'
                      : 'border-amber-200 bg-amber-50 hover:bg-amber-100'
                  }`}
                >
                  <p className="text-xs font-medium truncate">{student.fullName}</p>
                  <p className="text-xs text-gray-500">
                    ID: {student.studentId}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {student.hasTermAssignments ? (
                      <CheckCircle className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <AlertTriangle className="w-3 h-3 text-amber-500" />
                    )}
                    <p className={`text-xs ${
                      student.hasTermAssignments ? 'text-emerald-600' : 'text-amber-600'
                    }`}>
                      {student.hasTermAssignments ? 
                        `${student.termAssignmentCount} term(s)` : 
                        'No terms'}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Payment Details */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Payment Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Amount (KSh)
                </label>
                <input
                  type="number"
                  id="paymentAmount"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  defaultValue={bankTransaction?.amount || ''}
                  min="0"
                  readOnly={!!bankTransaction}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Bank transaction amount (read-only)
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  id="paymentMethod"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  defaultValue={bankTransaction?.paymentMethod || 'BANK_TRANSFER'}
                >
                  <option value="ONLINE_BANKING">Online Banking</option>
                  <option value="CREDIT_CARD">Credit Card</option>
                  <option value="DEBIT_CARD">Debit Card</option>
                  <option value="UPI">UPI</option>
                  <option value="CASH">Cash</option>
                  <option value="CHEQUE">Cheque</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="NEFT">NEFT</option>
                  <option value="RTGS">RTGS</option>
                  <option value="IMPS">IMPS</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Payment Date
                </label>
                <input
                  type="date"
                  id="paymentDate"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  defaultValue={bankTransaction?.transactionDate ? new Date(bankTransaction.transactionDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <input
                  type="text"
                  id="paymentNotes"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add any notes about this payment..."
                  defaultValue={bankTransaction?.notes || ''}
                />
              </div>
            </div>
          </div>

          {/* SMS Notification Options */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-900">SMS Notification</h4>
              <span className="text-xs text-gray-500">Send confirmation to parent</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">Send SMS Confirmation</span>
                </div>
                <input
                  type="checkbox"
                  id="sendSMS"
                  defaultChecked={true}
                  className="rounded text-blue-600"
                />
              </label>
              <div id="smsPreview" className="mt-3 p-2 bg-white rounded border border-gray-300 text-sm">
                <p className="text-gray-600">SMS Preview:</p>
                <p className="font-medium mt-1">
                  Dear Parent, payment of KSh {bankTransaction?.amount?.toLocaleString('en-KE') || '0'} received for {bankTransaction?.student?.fullName || 'Student'}. Thank you!
                </p>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                SMS will be sent to parent's mobile number after verification
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">Verification Summary</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Bank Transaction</span>
                <span className="font-medium">{bankTransaction?.bankReference || 'New'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Amount</span>
                <span className="font-medium">KSh {bankTransaction?.amount?.toLocaleString('en-KE') || '0'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">SMS Notification</span>
                <span className="font-medium text-emerald-600">Will be sent</span>
              </div>
              <div className="pt-2 border-t border-gray-200">
                <div className="flex justify-between text-sm font-semibold">
                  <span>Action</span>
                  <span className="text-emerald-600">
                    {isNewMatch ? 'Match & Verify Payment' : 'Update Payment Record'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      showCancelButton: true,
      confirmButtonText: isNewMatch ? 'Verify & Send SMS' : 'Update Payment',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#6b7280',
      showCloseButton: true,
      width: 700,
      customClass: {
        popup: 'rounded-2xl border border-gray-200 shadow-xl',
        title: 'text-lg font-bold',
      },
      preConfirm: async () => {
        const studentSelect = document.getElementById('studentSelect');
        const selectedStudentId = studentSelect?.value;
        const sendSMS = document.getElementById('sendSMS')?.checked;
        
        if (!selectedStudentId) {
          MySwal.showValidationMessage('Please select a student for this payment');
          return false;
        }
        
        const selectedStudent = students.find(s => s.id === parseInt(selectedStudentId));
        
        const validationResult = await validateStudentForPayment(selectedStudentId);
        if (!validationResult.success) {
          MySwal.showValidationMessage(
            <div>
              <p className="text-amber-700 font-medium">Student Validation Failed:</p>
              <p className="text-sm">{validationResult.message}</p>
              <button
                type="button"
                onClick={() => {
                  handleViewTermAssignments(selectedStudent);
                  MySwal.close();
                }}
                className="mt-2 px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                View Term Assignments
              </button>
            </div>
          );
          return false;
        }
        
        return {
          studentId: parseInt(selectedStudentId),
          studentName: selectedStudent.fullName,
          guardianContact: selectedStudent.contact,
          amount: bankTransaction?.amount || parseFloat(document.getElementById('paymentAmount').value),
          method: document.getElementById('paymentMethod').value,
          date: document.getElementById('paymentDate').value,
          notes: document.getElementById('paymentNotes').value,
          sendSMS: sendSMS,
          bankTransactionId: bankTransaction?.id,
          isNewMatch: isNewMatch,
          validationPassed: true
        };
      },
    });

    if (formValues) {
      await processPaymentVerification(formValues, bankTransaction);
    }
  };

  // Process payment verification and send SMS
  const processPaymentVerification = async (formValues, bankTransaction) => {
    setIsLoading(true);
    try {
      if (bankTransaction && formValues.isNewMatch) {
        // First match the transaction
        await handleMatchTransaction(bankTransaction.id, formValues.studentId);
        
        // Then verify the payment
        const verificationRequest = {
          bankTransactionId: bankTransaction.id,
          studentId: formValues.studentId,
          amount: formValues.amount,
          paymentMethod: formValues.method,
          paymentDate: formValues.date,
          notes: formValues.notes
        };
        
        const response = await transactionApi.post('/verify', verificationRequest);
        const verifiedTransaction = handleResponse(response);
        
        // Transform the verified transaction
        const transformedTransaction = transformTransactionResponse([verifiedTransaction])[0];
        
        // Update bank statements
        setBankStatements(prev =>
          prev.map(stmt =>
            stmt.id === bankTransaction.id ? {
              ...transformedTransaction,
              status: 'VERIFIED'
            } : stmt
          )
        );
        
        // Send SMS if requested
        if (formValues.sendSMS) {
          await sendPaymentConfirmationSMS(
            formValues.guardianContact,
            formValues.studentName,
            formValues.amount
          );
        }
        
        await fetchStatistics();
        
        showSuccessAlert(
          'Payment Verified Successfully!',
          `Payment of KSh ${formValues.amount.toLocaleString('en-KE')} verified for ${formValues.studentName}. ${
            formValues.sendSMS ? 'SMS confirmation sent to parent.' : ''
          }`
        );
        
        await fetchAllData(true);
      }
    } catch (error) {
      showErrorAlert(
        'Verification Failed',
        error.message || 'There was an error processing the payment verification.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Match bank transaction to student
  const handleMatchTransaction = async (transactionId, studentId) => {
    try {
      const response = await transactionApi.post(`/bank/${transactionId}/match/${studentId}`);
      const updatedTransaction = handleResponse(response);
      
      // Transform the matched transaction
      const transformedTransaction = transformTransactionResponse([updatedTransaction])[0];
      
      setBankStatements(prev =>
        prev.map(stmt =>
          stmt.id === transactionId ? {
            ...transformedTransaction,
            status: 'MATCHED'
          } : stmt
        )
      );
      
      await fetchStatistics();
      
      showSuccessAlert('Transaction Matched!', 'Transaction successfully matched with student.');
    } catch (error) {
      showErrorAlert('Match Failed', error.message || 'Failed to match transaction.');
    }
  };

  // Send SMS confirmation
  const sendPaymentConfirmationSMS = async (contact, studentName, amount) => {
    try {
      const student = students.find(s => s.fullName === studentName);
      if (!student) {
        console.warn('Student not found for SMS:', studentName);
        return false;
      }

      const recipient = contact || student.phone || student.emergencyContactPhone;
      if (!recipient) {
        console.warn('No valid phone number for student:', studentName);
        return false;
      }

      const smsRequest = {
        studentId: student.id,
        message: `Dear Parent/Guardian, payment of KSh ${amount.toLocaleString('en-KE')} received for ${studentName} (${student.grade}). Thank you! - School Management System`,
        recipientPhone: recipient
      };

      const response = await transactionApi.post('/sms/send', smsRequest);
      handleResponse(response);
      console.log('✅ SMS sent to', recipient);
      return true;
    } catch (error) {
      console.error('❌ SMS failed:', error.message || error);
      return false;
    }
  };

  // Handle view transaction details
  const handleViewTransactionDetails = (transaction) => {
    const student = transaction.student;
    const isMatched = transaction.status === 'MATCHED';
    const isVerified = transaction.status === 'VERIFIED';
    const smsSent = transaction.smsSent || false;

    MySwal.fire({
      title: <span className="text-gray-900">Transaction Details</span>,
      html: (
        <div className="text-left space-y-6">
          {/* Transaction Type */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Banknote className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-700">
                {isMatched ? 'Auto-Matched Bank Transaction' : 'Bank Transaction'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <TransactionStatusBadge status={transaction.status || 'UNVERIFIED'} />
              {isMatched && (
                <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
                  System Auto-Verified
                </span>
              )}
            </div>
          </div>

          {/* Transaction Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Reference Number</p>
              <p className="text-sm font-mono font-medium">{transaction.bankReference || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Date</p>
              <p className="text-sm font-medium">
                {transaction.transactionDate ? new Date(transaction.transactionDate).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-gray-500">Description</p>
              <p className="text-sm font-medium">{transaction.description || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Amount</p>
              <p className="text-xl font-bold text-gray-900">KSh {transaction.amount?.toLocaleString('en-KE') || '0'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Payment Method</p>
              <div className="mt-1">
                <PaymentMethodBadge
                  method={transaction.paymentMethod || getPaymentMethodFromBankTransaction(transaction.description)}
                />
              </div>
            </div>
          </div>

          {/* SMS Status */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-gray-600" />
                <span className="font-medium text-gray-900">SMS Notification</span>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                smsSent 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-100 text-amber-800 border border-amber-200'
              }`}>
                {smsSent ? 'SMS Sent' : 'No SMS Sent'}
              </div>
            </div>
            {smsSent && transaction.smsSentAt && (
              <p className="text-xs text-gray-500 mt-2">
                Sent on: {new Date(transaction.smsSentAt).toLocaleString()}
              </p>
            )}
            {!smsSent && isMatched && (
              <p className="text-xs text-gray-500 mt-2">
                SMS will be sent automatically for auto-matched transactions
              </p>
            )}
          </div>

          {/* Student Term Assignment Status */}
          {student && (
            <div className="p-4 bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-gray-900">Term Assignments</h4>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    MySwal.close();
                    handleViewTermAssignments(student);
                  }}
                  className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  View Details
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500">Student Name</p>
                  <p className="text-sm font-medium">{student.fullName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Class</p>
                  <p className="text-sm font-medium">{student.grade}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Term Status</p>
                  <p className="text-sm font-medium flex items-center gap-2">
                    {student.hasTermAssignments ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span className="text-emerald-700">Valid</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                        <span className="text-amber-700">No Terms</span>
                      </>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Terms</p>
                  <p className="text-sm font-medium">{student.termAssignmentCount || 0}</p>
                </div>
              </div>
              {student.pendingAmount > 0 && (
                <div className="mt-3 p-2 bg-amber-50 rounded border border-amber-200">
                  <p className="text-xs font-medium text-amber-800">Pending Amount</p>
                  <p className="text-lg font-bold text-amber-900">KSh {student.pendingAmount.toLocaleString('en-KE')}</p>
                </div>
              )}
            </div>
          )}
        </div>
      ),
      width: 600,
      showConfirmButton: false,
      showCloseButton: true,
      customClass: {
        popup: 'rounded-2xl border border-gray-200 shadow-xl',
        title: 'text-lg font-bold mb-4'
      }
    });
  };

  // Handle bulk verification with student validation
  const handleBulkVerify = async () => {
    const selectedBankTransactions = bankStatements.filter(stmt =>
      selectedTransactions.includes(stmt.id) &&
      (stmt.status === 'UNVERIFIED' || stmt.status === 'PENDING')
    );

    if (selectedBankTransactions.length === 0) {
      showErrorAlert('No Selection', 'Please select unmatched bank transactions to verify.');
      return;
    }

    const uniqueStudentIds = [...new Set(selectedBankTransactions
      .filter(t => t.student?.id)
      .map(t => t.student.id))];
    
    if (uniqueStudentIds.length > 0) {
      const validationResults = [];
      for (const studentId of uniqueStudentIds) {
        const result = await validateStudentForPayment(studentId);
        validationResults.push({ studentId, result });
      }

      const invalidStudents = validationResults.filter(r => !r.result.success);
      if (invalidStudents.length > 0) {
        const result = await showWarningAlert(
          'Student Validation Required',
          `${invalidStudents.length} student(s) have term assignment issues that need to be resolved before bulk verification.`,
          {
            text: 'View Issues',
            color: '#f59e0b'
          }
        );

        if (result.isConfirmed) {
          const issuesHtml = (
            <div className="text-left space-y-3">
              <h4 className="font-semibold text-amber-800">Validation Issues:</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {invalidStudents.map((item, index) => {
                  const student = getStudentData(item.studentId);
                  return (
                    <div key={index} className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <p className="font-medium text-gray-900">{student?.fullName || `Student ${item.studentId}`}</p>
                      <p className="text-sm text-amber-700 mt-1">{item.result.message}</p>
                      {student && (
                        <button
                          type="button"
                          onClick={() => {
                            MySwal.close();
                            handleViewTermAssignments(student);
                          }}
                          className="mt-2 px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                          View Term Assignments
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="p-3 bg-blue-50 rounded-lg mt-4">
                <p className="text-sm text-blue-800 font-medium">Required Actions:</p>
                <ul className="text-xs text-blue-700 mt-1 space-y-1">
                  <li>• Assign missing term assignments in Term Management</li>
                  <li>• Verify term fee configurations</li>
                  <li>• Ensure student enrollment status is active</li>
                </ul>
              </div>
            </div>
          );

          await MySwal.fire({
            title: <span className="text-amber-600">Resolve These Issues</span>,
            html: issuesHtml,
            showConfirmButton: true,
            confirmButtonText: 'Understood',
            confirmButtonColor: '#3b82f6',
            width: 600,
            customClass: {
              popup: 'rounded-2xl border border-gray-200 shadow-xl',
              title: 'text-lg font-bold',
            }
          });
          
          return;
        }
      }
    }

    const result = await showConfirmDialog(
      'Bulk Verification',
      `Verify ${selectedBankTransactions.length} selected bank transaction${selectedBankTransactions.length !== 1 ? 's' : ''}?`,
      'Verify All',
      'Cancel'
    );

    if (result.isConfirmed) {
      setIsLoading(true);
      try {
        const bulkRequest = {
          bankTransactionIds: selectedBankTransactions.map(t => t.id),
          sendSms: true,
          notes: 'Bulk verified from bank statements'
        };

        const response = await transactionApi.post('/bulk-verify', bulkRequest);
        const verifiedTransactions = handleResponse(response);
        
        // Transform verified transactions
        const transformedVerified = transformTransactionResponse(verifiedTransactions);
        
        // Update bank statements
        setBankStatements(prev =>
          prev.map(stmt => {
            const verifiedTx = transformedVerified.find(t => t.id === stmt.id);
            return verifiedTx ? { ...verifiedTx, status: 'VERIFIED' } : stmt;
          })
        );
        
        setSelectedTransactions([]);
        await fetchStatistics();
        
        showSuccessAlert('Bulk Verification Complete!', `Successfully verified ${selectedBankTransactions.length} transactions. Statistics have been updated.`);
        
      } catch (error) {
        showErrorAlert('Bulk Verification Failed', error.message || 'There was an error verifying multiple payments.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Toggle transaction selection
  const toggleTransactionSelection = (transactionId) => {
    setSelectedTransactions(prev =>
      prev.includes(transactionId)
        ? prev.filter(id => id !== transactionId)
        : [...prev, transactionId]
    );
  };

  // Toggle select all
  const toggleSelectAll = () => {
    const currentTransactions = filteredTransactions.pageData.filter(t => 
      t.status === 'UNVERIFIED' || t.status === 'PENDING'
    );
    if (selectedTransactions.length === currentTransactions.length) {
      setSelectedTransactions([]);
    } else {
      setSelectedTransactions(currentTransactions.map(t => t.id));
    }
  };

  // Download receipt
  const handleDownloadReceipt = async (transactionId) => {
    try {
      const response = await transactionApi.get(`/receipt/${transactionId}/pdf`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `receipt-${transactionId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      showSuccessAlert('Receipt Downloaded!', 'Receipt PDF has been downloaded successfully.');
    } catch (error) {
      showErrorAlert('Download Failed', error.message || 'Failed to download receipt.');
    }
  };

  // Delete bank transaction
  const handleDeleteTransaction = async (id) => {
    const result = await showConfirmDialog(
      'Delete Transaction',
      'Are you sure you want to delete this bank transaction?',
      'Delete',
      'Cancel'
    );

    if (result.isConfirmed) {
      try {
        await transactionApi.delete(`/bank/${id}`);
        setBankStatements(prev => prev.filter(stmt => stmt.id !== id));
        await fetchStatistics();
        showSuccessAlert('Transaction Deleted!', 'Bank transaction has been deleted successfully.');
      } catch (error) {
        showErrorAlert('Delete Failed', error.message || 'Failed to delete transaction.');
      }
    }
  };

  // Format amount for display using Kenyan Shillings
  const formatAmount = (amount) => {
    if (!amount && amount !== 0) return 'KSh 0';
    
    if (amount >= 1000000) {
      return `KSh ${(amount / 1000000).toFixed(2)}M`;
    } else if (amount >= 1000) {
      return `KSh ${(amount / 1000).toFixed(1)}K`;
    } else {
      return `KSh ${amount.toLocaleString('en-KE')}`;
    }
  };

  // Statistics using backend data
  const stats = useMemo(() => ({
    unverifiedCount: backendStats.unverifiedCount || 0,
    matchedCount: backendStats.matchedCount || 0,
    verifiedCount: backendStats.verifiedCount || 0,
    totalAmount: formatAmount(backendStats.totalAmount),
    todayAmount: formatAmount(backendStats.todayAmount),
    matchRate: backendStats.matchRate || "0%",
    totalPendingAmount: formatAmount(backendStats.totalPendingFees)
  }), [backendStats]);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50/30 p-4 md:p-6">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8"
      >
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Bank Transactions & Verification
                </h1>
                <p className="text-gray-600 mt-1">
                  Import bank statements, match payments to students, and send SMS notifications
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => setShowImportModal(true)}
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-xl shadow-sm hover:shadow-md transition-all"
            >
              <Upload className="w-4 h-4" />
              Import Bank Statement
            </button>
            <button
              onClick={() => fetchAllData(true)}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-xl border border-gray-200 shadow-sm disabled:opacity-50 transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Refreshing...' : 'Refresh Data'}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Statistics */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8"
      >
        <StatCard
          label="Unmatched Transactions"
          value={backendStats.unverifiedCount || 0}
          icon={AlertCircle}
          color="bg-gradient-to-br from-amber-500 to-amber-600"
          trend="Needs Attention"
          change={0}
        />
        <StatCard
          label="Auto-Matched"
          value={backendStats.matchedCount || 0}
          icon={CheckCircle}
          color="bg-gradient-to-br from-blue-500 to-blue-600"
          trend="System Matched"
          change={0}
        />
        <StatCard
          label="Verified Payments"
          value={backendStats.verifiedCount || 0}
          icon={ShieldCheck}
          color="bg-gradient-to-br from-emerald-500 to-emerald-600"
          trend="Manually Verified"
          change={0}
        />
        <StatCard
          label="Total Processed"
          value={backendStats.matchRate || "0%"}
          icon={Percent}
          color="bg-gradient-to-br from-purple-500 to-purple-600"
          trend="Success Rate"
          change={0}
        />
      </motion.div>

      {/* Financial Stats Row */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8"
      >
        <StatCard
          label="Total Verified Amount"
          value={formatAmount(backendStats.totalAmount)}
          icon={DollarSign}
          color="bg-gradient-to-br from-green-500 to-green-600"
          trend="All Time"
          change={0}
        />
        <StatCard
          label="Today's Verified Amount"
          value={formatAmount(backendStats.todayAmount)}
          icon={Calendar}
          color="bg-gradient-to-br from-cyan-500 to-cyan-600"
          trend="Today"
          change={0}
        />
        <StatCard
          label="Total Pending Fees"
          value={formatAmount(backendStats.totalPendingFees)}
          icon={Clock}
          color="bg-gradient-to-br from-orange-500 to-orange-600"
          trend="All Students"
          change={0}
        />
      </motion.div>

      {/* Bulk Validation Section */}
      {selectedStudents.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="p-4 bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white rounded-lg">
                  <ClipboardCheck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900">Bulk Student Validation</h3>
                  <p className="text-sm text-blue-700">
                    {selectedStudents.length} student{selectedStudents.length > 1 ? 's' : ''} selected for validation
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleBulkValidate}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Validate Students
                </button>
                <button
                  onClick={() => setSelectedStudents([])}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          {[
            { id: 'unverified', label: 'Unmatched', icon: Unlink },
            { id: 'matched', label: 'Auto-Matched', icon: Link },
            { id: 'verified', label: 'Verified', icon: ShieldCheck },
            { id: 'all', label: 'All Transactions', icon: Database }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors relative ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {isTableLoading && activeTab === tab.id && (
                <Loader2 className="w-3 h-3 ml-2 animate-spin text-blue-500" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content - Fullscreen Table Container */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-6 h-[calc(100vh-280px)] flex flex-col"
      >
        {/* Filters and Search */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {activeTab === 'unverified' ? 'Unmatched Transactions' :
                 activeTab === 'matched' ? 'Auto-Matched Transactions' :
                 activeTab === 'verified' ? 'Verified Payments' : 'All Transactions'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {activeTab === 'unverified' ? 'Bank transactions that need manual matching to students' :
                 activeTab === 'matched' ? 'Transactions automatically matched by the system algorithm' :
                 activeTab === 'verified' ? 'Manually verified payments with student records' :
                 'Complete transaction history'}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="relative flex-1 min-w-75">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by student name, bank reference, or amount..."
                  className="pl-10 pr-4 py-2.5 w-full border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-gray-50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Bulk Actions Bar */}
          {activeTab === 'unverified' && selectedTransactions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200"
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-semibold text-blue-900">
                      {selectedTransactions.length} transaction{selectedTransactions.length > 1 ? 's' : ''} selected
                    </span>
                  </div>
                  <span className="text-sm text-blue-700">
                    Total amount: KSh {bankStatements
                      .filter(stmt => selectedTransactions.includes(stmt.id))
                      .reduce((sum, stmt) => sum + (stmt.amount || 0), 0)
                      .toLocaleString('en-KE')}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleBulkVerify}
                    className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Bulk Verify & Send SMS
                  </button>
                  <button
                    onClick={() => setSelectedTransactions([])}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Table Container with Scroll */}
        <div className="flex-1 overflow-hidden">
          {isTableLoading ? (
            <div className="h-full flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-900">Loading {activeTab} transactions...</p>
                  <p className="text-sm text-gray-600 mt-1">Fetching data from server</p>
                </div>
              </motion.div>
            </div>
          ) : (
            <div className="h-full overflow-auto">
              <table className="w-full min-w-300">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    {activeTab === 'unverified' && (
                      <th className="px-6 py-4 text-left">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedTransactions.length === filteredTransactions.pageData.filter(t => 
                              t.status === 'UNVERIFIED' || t.status === 'PENDING'
                            ).length && filteredTransactions.pageData.filter(t => 
                              t.status === 'UNVERIFIED' || t.status === 'PENDING'
                            ).length > 0}
                            onChange={toggleSelectAll}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Select</span>
                        </div>
                      </th>
                    )}
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-62.5">
                      Transaction Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-45">
                      Amount & Method
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-40">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-55">
                      Student Match
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-75">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredTransactions.pageData.map((transaction) => {
                    const isUnverified = transaction.status === 'UNVERIFIED' || transaction.status === 'PENDING';
                    const isMatched = transaction.status === 'MATCHED';
                    const isVerified = transaction.status === 'VERIFIED';
                    const student = transaction.student; // Now properly nested!
                    const smsSent = transaction.smsSent || false;

                    return (
                      <motion.tr
                        key={transaction.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        {activeTab === 'unverified' && (
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={selectedTransactions.includes(transaction.id)}
                              onChange={() => toggleTransactionSelection(transaction.id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              disabled={!isUnverified}
                            />
                          </td>
                        )}
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <div className="flex items-start gap-3">
                              <Banknote className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 truncate">
                                  {transaction.description || 'Bank Transaction'}
                                </p>
                                <div className="mt-2 space-y-1">
                                  <div className="flex items-center gap-2 text-xs text-gray-600">
                                    <Calendar className="w-3 h-3" />
                                    <span>
                                      {transaction.transactionDate 
                                        ? new Date(transaction.transactionDate).toLocaleDateString('en-KE', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric'
                                          })
                                        : 'Date N/A'
                                      }
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-xs">
                                    <FileText className="w-3 h-3 text-gray-500" />
                                    <code className="text-xs font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded truncate max-w-50">
                                      {transaction.bankReference || 'No Ref'}
                                    </code>
                                  </div>
                                  {student && (
                                    <div className="flex items-center gap-2 text-xs">
                                      <div className={`p-1 rounded ${
                                        student.hasTermAssignments 
                                          ? 'bg-emerald-100 text-emerald-700' 
                                          : 'bg-amber-100 text-amber-700'
                                      }`}>
                                        <User className="w-3 h-3" />
                                      </div>
                                      <span className="font-medium truncate">{student.fullName}</span>
                                      {student.grade && <span className="text-gray-500">({student.grade})</span>}
                                      <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                                        student.hasTermAssignments
                                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                                      }`}>
                                        {student.hasTermAssignments ? (
                                          <CheckCircle className="w-3 h-3" />
                                        ) : (
                                          <AlertTriangle className="w-3 h-3" />
                                        )}
                                        <span>
                                          {student.hasTermAssignments 
                                            ? `${student.termAssignmentCount || 0} term(s)` 
                                            : 'No terms'}
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <p className="text-lg font-bold text-gray-900">KSh {transaction.amount?.toLocaleString('en-KE') || '0'}</p>
                            <div className="mt-1">
                              <PaymentMethodBadge
                                method={transaction.paymentMethod || getPaymentMethodFromBankTransaction(transaction.description)}
                              />
                            </div>
                            {smsSent && (
                              <div className="flex items-center gap-1 text-xs text-emerald-600 mt-2">
                                <MessageSquare className="w-3 h-3" />
                                SMS Sent
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <TransactionStatusBadge
                              status={transaction.status || 'UNVERIFIED'}
                            />
                            {isVerified && transaction.verifiedAt && (
                              <p className="text-xs text-gray-500 mt-2">
                                Verified: {new Date(transaction.verifiedAt).toLocaleDateString()}
                              </p>
                            )}
                            {isMatched && transaction.matchedAt && (
                              <p className="text-xs text-gray-500 mt-2">
                                Auto-matched: {new Date(transaction.matchedAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {student ? (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <p className="font-medium text-gray-900 truncate">{student.fullName}</p>
                                <button
                                  onClick={() => handleViewTermAssignments(student)}
                                  className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="View Term Assignments"
                                >
                                  <BookOpen className="w-4 h-4" />
                                </button>
                              </div>
                              <p className="text-sm text-gray-600">{student.grade}</p>
                              <p className="text-xs text-gray-500 truncate">{student.phone || student.contact || 'No phone'}</p>
                              {student.pendingAmount > 0 && (
                                <p className="text-xs text-amber-600 mt-2 font-medium">
                                  Pending: KSh {student.pendingAmount.toLocaleString('en-KE')}
                                </p>
                              )}
                            </div>
                          ) : (
                            <div className="text-center py-2">
                              <Unlink className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                              <p className="text-xs text-gray-500">Not matched</p>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {/* Case 1: Unverified transactions */}
                            {isUnverified && (
                              <>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleEditPaymentRecord(transaction, true)}
                                  className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                  title="Verify Payment"
                                >
                                  <Check className="w-4 h-4" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleDeleteTransaction(transaction.id)}
                                  className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
                                  title="Delete Transaction"
                                >
                                  <X className="w-4 h-4" />
                                </motion.button>
                              </>
                            )}
                            
                            {/* Case 2: Matched OR Verified transactions */}
                            {(isMatched || isVerified) && (
                              <>
                                <div className="flex items-center gap-2 mr-2">
                                  <div className="relative">
                                    <Circle className="w-6 h-6 text-emerald-500 absolute" />
                                    <CheckCircle2 className="w-6 h-6 text-emerald-500" fill="#10b981" fillOpacity={0.2} />
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-xs font-medium text-emerald-700">
                                      {isMatched ? 'Auto-Matched' : 'Verified'}
                                    </span>
                                    {isMatched && (
                                      <span className="text-xs text-gray-500">System Auto-Verified</span>
                                    )}
                                  </div>
                                </div>
                                
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleDownloadReceipt(transaction.id)}
                                  className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                  title="Download Receipt"
                                >
                                  <Download className="w-4 h-4" />
                                </motion.button>
                                
                                <div className={`flex items-center gap-1 px-3 py-1 rounded-lg ${
                                  smsSent 
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}>
                                  <MessageSquare className="w-4 h-4" />
                                  <span className="text-xs font-medium">
                                    {smsSent ? 'SMS Sent' : 'No SMS'}
                                  </span>
                                </div>
                              </>
                            )}
                            
                            {/* Always show View Details button */}
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleViewTransactionDetails(transaction)}
                              className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
              
              {filteredTransactions.pageData.length === 0 && !isTableLoading && (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No transactions found</h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-6">
                      {activeTab === 'unverified'
                        ? 'All bank transactions have been processed. Import new bank statements to see more.'
                        : activeTab === 'matched'
                        ? 'No auto-matched transactions found. The system will auto-match transactions during import.'
                        : activeTab === 'verified'
                        ? 'No verified payments found. Verify some unmatched transactions to see them here.'
                        : 'No transactions match your current search criteria.'}
                    </p>
                    {activeTab === 'unverified' && (
                      <button
                        onClick={() => setShowImportModal(true)}
                        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg"
                      >
                        <Upload className="w-4 h-4" />
                        Import Bank Statement
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Simple Pagination Footer */}
        {filteredTransactions.pageData.length > 0 && (
          <SimplePagination
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            hasNextPage={filteredTransactions.hasNextPage}
            hasPreviousPage={filteredTransactions.hasPreviousPage}
          />
        )}
      </motion.div>

      {/* Enhanced Import Modal with Glassmorphism */}
      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onUpload={handleUpload}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Transactions;