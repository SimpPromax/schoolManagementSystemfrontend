/* eslint-disable no-prototype-builtins */
/* eslint-disable no-unused-vars */
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Search,
  Filter,
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
  CloudUpload
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
    verified: { label: 'Verified', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: CheckCircle },
    pending: { label: 'Pending', color: 'bg-amber-100 text-amber-800 border-amber-200', icon: Clock },
    unverified: { label: 'Unverified', color: 'bg-gray-100 text-gray-800 border-gray-200', icon: AlertCircle },
    matched: { label: 'Matched', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Link },
    unmatched: { label: 'Unmatched', color: 'bg-rose-100 text-rose-800 border-rose-200', icon: Unlink },
    UNVERIFIED: { label: 'Unverified', color: 'bg-gray-100 text-gray-800 border-gray-200', icon: AlertCircle },
    MATCHED: { label: 'Matched', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Link },
    PENDING: { label: 'Pending', color: 'bg-amber-100 text-amber-800 border-amber-200', icon: Clock }
  };

  const { label, color, icon: Icon } = config[status] || config.unverified;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${color}`}>
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

// API Service functions
const transactionApi = axios.create({
  baseURL: 'http://localhost:8080/api/transactions',
});

// Add request interceptor to add auth token
transactionApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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
    const errorMessage = errorData.message ||
      errorData.error ||
      errorData ||
      'Request failed';
    throw new Error(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
  } else if (error.request) {
    throw new Error('No response from server. Please check your connection.');
  } else {
    throw new Error(error.message || 'Request failed');
  }
};


// Enhanced Import Modal Component with Glassmorphism
// Enhanced Import Modal Component with Glassmorphism
const ImportModal = ({ isOpen, onClose, onUpload, isLoading }) => {
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState(null);

  // Prevent body scroll when modal is open
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
    
    // Check file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      showErrorAlert('File Too Large', 'File size should be less than 10MB');
      return;
    }

    // Check file type
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

    // Create preview
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
          count: lines.length - 1 // Subtract header
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
      {/* Fixed full-screen backdrop with light glassmorphic effect */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        {/* Light semi-transparent glassmorphic backdrop */}
        <div 
          className="fixed inset-0 bg-linear-to-br from-white/40 via-gray-50/30 to-blue-50/20 backdrop-blur-md"
          onClick={resetModal}
        >
          {/* Subtle background texture for glass effect */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-100/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-purple-100/10 rounded-full blur-3xl"></div>
          </div>
          
          {/* Subtle grid pattern overlay */}
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `linear-gradient(to right, #888 1px, transparent 1px),
                                linear-gradient(to bottom, #888 1px, transparent 1px)`,
              backgroundSize: '20px 20px',
            }}
          ></div>
        </div>
        
        {/* Modal container positioned slightly lower */}
        <div className="relative min-h-screen flex items-start justify-center p-4 pt-28 lg:pt-32">
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ 
              type: "spring", 
              damping: 20, 
              stiffness: 300,
              delay: 0.1
            }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl mt-4"
          >
            {/* Enhanced glassmorphic Modal Card */}
            <div className="relative bg-linear-to-br from-white/95 via-white/92 to-white/95 backdrop-blur-xl rounded-2xl border border-white/50 shadow-2xl overflow-hidden"
              style={{
                boxShadow: `
                  0 20px 40px -12px rgba(0, 0, 0, 0.15),
                  0 8px 24px 0 rgba(149, 157, 165, 0.2),
                  inset 0 1px 0 rgba(255, 255, 255, 0.8),
                  inset 0 -1px 0 rgba(0, 0, 0, 0.05)
                `,
              }}
            >
              {/* Subtle border glow */}
              <div className="absolute inset-0 rounded-2xl pointer-events-none border border-white/30"></div>
              
              {/* Header */}
              <div className="p-6 border-b border-gray-100/50 bg-linear-to-r from-white/60 via-white/40 to-white/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-linear-to-br from-blue-100/50 to-blue-200/50 backdrop-blur-sm rounded-xl">
                      <Upload className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        Import Bank Statement
                      </h2>
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

              {/* Content */}
              <div className="p-6">
                {/* File Upload Area */}
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

                {/* File Preview */}
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

                      {/* Preview Content */}
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

                {/* Supported Formats */}
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

                {/* Instructions */}
                <div className="bg-linear-to-r from-blue-50/70 to-indigo-50/70 backdrop-blur-sm rounded-lg p-4 border border-blue-100/50">
                  <h4 className="font-semibold text-blue-800 mb-2">📋 Import Instructions</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Ensure file has columns: Date, Description, Amount, Reference</li>
                    <li>• Remove any header rows or footers from the statement</li>
                    <li>• Date format should be YYYY-MM-DD or DD/MM/YYYY</li>
                    <li>• Amount should be numeric (₹ symbol will be removed)</li>
                  </ul>
                </div>
              </div>

              {/* Footer */}
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

const Transactions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const studentIdParam = queryParams.get('student');
  const { showAlert } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState('today');
  const [paymentMethod, setPaymentMethod] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [viewMode, setViewMode] = useState('list');
  const [activeTab, setActiveTab] = useState('unverified');
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState(null);

  // State for backend data
  const [bankStatements, setBankStatements] = useState([]);
  const [verifiedTransactions, setVerifiedTransactions] = useState([]);
  const [students, setStudents] = useState([]);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 20,
    totalPages: 0,
    totalElements: 0
  });

  // Fetch data from backend
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch bank transactions
      const bankResponse = await transactionApi.get('/bank', {
        params: { page: 0, size: 100 }
      });
      const bankData = handleResponse(bankResponse);
      setBankStatements(Array.isArray(bankData) ? bankData : (bankData.content || []));

      // Fetch verified transactions
      const verifiedResponse = await transactionApi.get('/verified', {
        params: { page: 0, size: 100 }
      });
      const verifiedData = handleResponse(verifiedResponse);
      setVerifiedTransactions(Array.isArray(verifiedData) ? verifiedData : (verifiedData.content || []));

      // Fetch students from StudentDTO API (enhanced with fee info)
      try {
        const studentsResponse = await axios.get('http://localhost:8080/api/v1/students', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const studentsData = studentsResponse.data;
        
        // The backend now returns List<StudentDTO> directly
        const formattedStudents = (Array.isArray(studentsData) ? studentsData : []).map(dto => ({
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

          // ✅ Use NEW fee fields from backend
          totalFee: dto.totalFee || 0,
          paidAmount: dto.paidAmount || 0,
          pendingAmount: dto.pendingAmount !== undefined 
            ? dto.pendingAmount 
            : Math.max(0, (dto.totalFee || 0) - (dto.paidAmount || 0)),
          feeStatus: dto.feeStatus || 'PENDING',

          // Fee breakdown
          tuitionFee: dto.tuitionFee || 0,
          admissionFee: dto.admissionFee || 0,
          examinationFee: dto.examinationFee || 0,
          otherFees: dto.otherFees || 0,

          // Transport
          transportMode: dto.transportMode,
          transportFee: dto.transportFee || 0,
          transportFeeStatus: dto.transportFeeStatus || 'PENDING',

          // Compatibility alias
          contact: dto.phone || dto.emergencyContactPhone,

          // Related data (if fetched via JOIN)
          familyMembers: dto.familyMembers || [],
          medicalRecords: dto.medicalRecords || [],
          achievements: dto.achievements || [],
          clubs: dto.clubs || [],
          hobbies: dto.hobbies || []
        }));

        setStudents(formattedStudents);
        console.log(`✅ Loaded ${formattedStudents.length} students with real fee data`);

      } catch (studentError) {
        console.error('Error fetching students from /api/v1/students:', studentError);
        // REMOVED MOCK DATA - Only use real backend data
        showErrorAlert('Student Data Error', 'Failed to load student data from server');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      showAlert('error', 'Failed to load data', error.message);
    } finally {
      setIsLoading(false);
    }
  }, [showAlert]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter transactions based on active tab
  const filteredTransactions = useMemo(() => {
    let transactions = [];
    if (activeTab === 'verified') {
      transactions = verifiedTransactions;
    } else if (activeTab === 'unverified') {
      // Filter bank statements that are not verified and not matched
      transactions = bankStatements.filter(stmt =>
        (!stmt.isVerified || stmt.isVerified === false) &&
        (stmt.status === 'UNVERIFIED' || stmt.status === 'PENDING')
      );
    } else {
      transactions = [...verifiedTransactions, ...bankStatements];
    }

    // Filter by student if studentId param exists
    if (studentIdParam) {
      transactions = transactions.filter(t => t.student?.id === parseInt(studentIdParam) || t.studentId === parseInt(studentIdParam));
    }

    // Apply search filter
    if (searchQuery) {
      transactions = transactions.filter(transaction => {
        const searchLower = searchQuery.toLowerCase();
        return (
          (transaction.student?.fullName || transaction.studentName || '').toLowerCase().includes(searchLower) ||
          (transaction.description || '').toLowerCase().includes(searchLower) ||
          (transaction.referenceNumber || transaction.receiptNumber || '').toLowerCase().includes(searchLower) ||
          (transaction.bankReference || '').toLowerCase().includes(searchLower) ||
          String(transaction.amount || '').includes(searchQuery)
        );
      });
    }

    return transactions;
  }, [activeTab, studentIdParam, searchQuery, verifiedTransactions, bankStatements]);

  // Get student data
  const getStudentData = (studentId) => {
    return students.find(s => s.id === studentId);
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
      setBankStatements(prev => [...importedData, ...prev]);
      setShowImportModal(false);
      setImportFile(null);
      
      showSuccessAlert(
        'File Imported!',
        `Successfully imported ${importedData.length} transactions from bank statement.`
      );
    } catch (error) {
      console.error('Import error:', error);
      showErrorAlert('Import Failed', error.message || 'Failed to import bank statement file.');
    } finally {
      setIsLoading(false);
    }
  };

  // Match bank transaction to student
  const handleMatchTransaction = async (transactionId, studentId) => {
    try {
      const response = await transactionApi.post(`/bank/${transactionId}/match/${studentId}`);
      const updatedTransaction = handleResponse(response);
      
      // Update bank statements
      setBankStatements(prev =>
        prev.map(stmt =>
          stmt.id === transactionId ? updatedTransaction : stmt
        )
      );
      
      // Refresh data
      fetchData();
      showSuccessAlert('Transaction Matched!', 'Transaction successfully matched with student.');
    } catch (error) {
      showErrorAlert('Match Failed', error.message || 'Failed to match transaction.');
    }
  };

  // Enhanced Edit Payment Record - Match bank transaction to student
  const handleEditPaymentRecord = async (bankTransaction = null, isNewMatch = false) => {
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
                  ₹{bankTransaction?.amount?.toLocaleString() || '0'}
                </p>
                <TransactionStatusBadge status={bankTransaction?.status || 'unverified'} />
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
                <p className="text-sm font-medium font-mono">{bankTransaction?.referenceNumber || 'N/A'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-gray-500">Description</p>
                <p className="text-sm font-medium">{bankTransaction?.description || 'N/A'}</p>
              </div>
            </div>
          </div>

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
                    Pending: ₹{student.pendingAmount.toLocaleString()}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Quick student stats */}
            <div className="mt-3 grid grid-cols-3 gap-2">
              {students.slice(0, 3).map(student => (
                <button
                  key={student.id}
                  type="button"
                  onClick={() => {
                    document.getElementById('studentSelect').value = student.id;
                  }}
                  className="p-2 border border-gray-200 rounded-lg text-left hover:bg-gray-50"
                >
                  <p className="text-xs font-medium truncate">{student.fullName}</p>
                  <p className="text-xs text-gray-500">
                    ID: {student.studentId}
                  </p>
                  <p className="text-xs text-amber-600">
                    Pending: ₹{student.pendingAmount.toLocaleString()}
                  </p>
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
                  Amount (₹)
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
                  defaultValue={bankTransaction ? getPaymentMethodFromBankTransaction(bankTransaction.description) : 'bank'}
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
                  Receipt Number
                </label>
                <input
                  type="text"
                  id="receiptNumber"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Auto-generated"
                  defaultValue={`RC-${String(verifiedTransactions.length + 1).padStart(3, '0')}`}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                id="paymentNotes"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                placeholder="Add any notes about this payment..."
                defaultValue={bankTransaction?.notes || ''}
              />
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
                  Dear Parent, payment of ₹{bankTransaction?.amount?.toLocaleString() || '0'} received for {bankTransaction?.student?.fullName || 'Student'}. Receipt: RC-{String(verifiedTransactions.length + 1).padStart(3, '0')}. Thank you!
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
                <span className="font-medium">{bankTransaction?.referenceNumber || 'New'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Amount</span>
                <span className="font-medium">₹{bankTransaction?.amount?.toLocaleString() || '0'}</span>
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
      preConfirm: () => {
        const studentSelect = document.getElementById('studentSelect');
        const selectedStudentId = studentSelect?.value;
        const sendSMS = document.getElementById('sendSMS')?.checked;
        
        if (!selectedStudentId) {
          MySwal.showValidationMessage('Please select a student for this payment');
          return false;
        }
        
        const selectedStudent = students.find(s => s.id === parseInt(selectedStudentId));
        return {
          studentId: parseInt(selectedStudentId),
          studentName: selectedStudent.fullName,
          guardianContact: selectedStudent.contact,
          amount: bankTransaction?.amount || parseFloat(document.getElementById('paymentAmount').value),
          method: document.getElementById('paymentMethod').value,
          date: document.getElementById('paymentDate').value,
          receiptNumber: document.getElementById('receiptNumber').value,
          notes: document.getElementById('paymentNotes').value,
          sendSMS: sendSMS,
          bankTransactionId: bankTransaction?.id,
          isNewMatch: isNewMatch
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
        // Match bank transaction to student
        await handleMatchTransaction(bankTransaction.id, formValues.studentId);
        
        // Verify payment
        const verificationRequest = {
          bankTransactionId: bankTransaction.id,
          studentId: formValues.studentId,
          amount: formValues.amount,
          paymentMethod: formValues.method,
          paymentDate: formValues.date,
          receiptNumber: formValues.receiptNumber,
          notes: formValues.notes
        };
        
        const response = await transactionApi.post('/verify', verificationRequest);
        const verifiedTransaction = handleResponse(response);
        
        // Update verified transactions
        setVerifiedTransactions(prev => [verifiedTransaction, ...prev]);
        
        // Send SMS if requested
        if (formValues.sendSMS) {
          await sendPaymentConfirmationSMS(
            formValues.guardianContact,
            formValues.studentName,
            formValues.amount,
            formValues.receiptNumber
          );
        }
        
        showSuccessAlert(
          'Payment Verified Successfully!',
          `Payment of ₹${formValues.amount.toLocaleString()} verified for ${formValues.studentName}. ${
            formValues.sendSMS ? 'SMS confirmation sent to parent.' : ''
          }`
        );
        
        // Refresh data
        fetchData();
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

  // Send SMS confirmation
  const sendPaymentConfirmationSMS = async (contact, studentName, amount, receipt) => {
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
        message: `Dear Parent/Guardian, payment of ₹${amount.toLocaleString()} received for ${studentName} (${student.grade}). Receipt: ${receipt}. Thank you! - School Management System`,
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
    const isBankTransaction = transaction.hasOwnProperty('bankAccount') || transaction.hasOwnProperty('referenceNumber');
    const student = isBankTransaction
      ? students.find(s => s.id === transaction.student?.id)
      : getStudentData(transaction.student?.id || transaction.studentId);

    MySwal.fire({
      title: <span className="text-gray-900">Transaction Details</span>,
      html: (
        <div className="text-left space-y-6">
          {/* Transaction Type */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {isBankTransaction ? (
                <>
                  <Banknote className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-blue-700">Bank Transaction</span>
                </>
              ) : (
                <>
                  <Receipt className="w-5 h-5 text-emerald-600" />
                  <span className="font-semibold text-emerald-700">Verified Payment</span>
                </>
              )}
            </div>
            <TransactionStatusBadge status={isBankTransaction ? (transaction.status || 'unverified') : 'verified'} />
          </div>

          {/* Transaction Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Reference Number</p>
              <p className="text-sm font-mono font-medium">{transaction.referenceNumber || transaction.receiptNumber || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Date</p>
              <p className="text-sm font-medium">
                {transaction.transactionDate ? new Date(transaction.transactionDate).toLocaleDateString() :
                 transaction.paymentDate ? new Date(transaction.paymentDate).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-gray-500">Description</p>
              <p className="text-sm font-medium">{transaction.description || transaction.receiptNumber || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Amount</p>
              <p className="text-xl font-bold text-gray-900">₹{transaction.amount?.toLocaleString() || '0'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Payment Method</p>
              <div className="mt-1">
                <PaymentMethodBadge
                  method={isBankTransaction
                    ? getPaymentMethodFromBankTransaction(transaction.description)
                    : transaction.paymentMethod
                  }
                />
              </div>
            </div>
          </div>

          {/* Student Information (if matched/verified) */}
          {student && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Student Details</h4>
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
                  <p className="text-xs text-gray-500">Contact</p>
                  <p className="text-sm font-medium">{student.phone || student.contact || 'No phone'}</p>
                </div>
                {student.feeStatus === 'PENDING' && student.pendingAmount > 0 && (
                  <div className="col-span-2">
                    <p className="text-xs text-amber-600">
                      Pending: ₹{student.pendingAmount.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Additional Info */}
          {transaction.verifiedBy && (
            <div className="text-sm text-gray-600">
              <p>Verified by: {transaction.verifiedBy?.fullName || transaction.verifiedBy}</p>
              <p>Verified on: {transaction.verifiedAt ? new Date(transaction.verifiedAt).toLocaleDateString() : 'N/A'}</p>
            </div>
          )}
          
          {transaction.smsSent && (
            <div className="flex items-center gap-2 text-sm text-emerald-600">
              <MessageSquare className="w-4 h-4" />
              SMS confirmation sent to parent
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

  // Handle bulk verification
  const handleBulkVerify = async () => {
    const selectedBankTransactions = bankStatements.filter(stmt =>
      selectedTransactions.includes(stmt.id) &&
      (!stmt.isVerified || stmt.isVerified === false)
    );

    if (selectedBankTransactions.length === 0) {
      showErrorAlert('No Selection', 'Please select unverified bank transactions to verify.');
      return;
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
          verificationData: {
            paymentMethod: 'BANK_TRANSFER',
            notes: 'Bulk verified from bank statements'
          }
        };

        const response = await transactionApi.post('/bulk-verify', bulkRequest);
        const verifiedTransactions = handleResponse(response);
        
        // Update state
        setVerifiedTransactions(prev => [...verifiedTransactions, ...prev]);
        
        // Update bank statements
        setBankStatements(prev =>
          prev.map(stmt =>
            selectedBankTransactions.some(t => t.id === stmt.id)
              ? { ...stmt, isVerified: true, status: 'MATCHED' }
              : stmt
          )
        );
        
        setSelectedTransactions([]);
        showSuccessAlert('Bulk Verification Complete!', `Successfully verified ${selectedBankTransactions.length} transactions.`);
        
        // Refresh data
        fetchData();
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
    const currentTransactions = filteredTransactions.filter(t => !t.isVerified);
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
        showSuccessAlert('Transaction Deleted!', 'Bank transaction has been deleted successfully.');
      } catch (error) {
        showErrorAlert('Delete Failed', error.message || 'Failed to delete transaction.');
      }
    }
  };

  // Statistics
  const stats = useMemo(() => {
    const unverifiedCount = bankStatements.filter(stmt => 
      !stmt.isVerified && (stmt.status === 'UNVERIFIED' || stmt.status === 'PENDING')
    ).length;

    const verifiedCount = verifiedTransactions.length;
    const totalAmount = verifiedTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);

    const todayAmount = verifiedTransactions.filter(t => {
      const transactionDate = t.paymentDate ? new Date(t.paymentDate) : new Date();
      const today = new Date();
      return transactionDate.toDateString() === today.toDateString();
    }).reduce((sum, t) => sum + (t.amount || 0), 0);

    // Calculate total pending fees from all students
    const totalPendingFees = students.reduce((sum, student) => 
      sum + (student.pendingAmount || 0), 0);

    // Count students with pending fees
    const pendingPayments = students.filter(s => 
      s.feeStatus === 'PENDING' && (s.pendingAmount || 0) > 0
    ).length;

    return {
      unverifiedCount,
      verifiedCount,
      totalAmount: `₹${(totalAmount / 1_000_000).toFixed(2)}M`,
      todayAmount: `₹${(todayAmount / 1_000).toFixed(1)}K`,
      matchRate: `${bankStatements.length > 0 ? ((verifiedCount / bankStatements.length) * 100).toFixed(1) : '0'}%`,
      pendingPayments,
      totalPendingAmount: `₹${(totalPendingFees / 1_000).toFixed(1)}K`
    };
  }, [bankStatements, verifiedTransactions, students]);

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
              onClick={fetchData}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-xl border border-gray-200 shadow-sm disabled:opacity-50 transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Loading...' : 'Refresh Data'}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Quick Stats */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8"
      >
        <StatCard
          label="Unverified Transactions"
          value={stats.unverifiedCount}
          icon={AlertCircle}
          color="bg-gradient-to-br from-amber-500 to-amber-600"
          trend="Needs Attention"
          change={0}
        />
        <StatCard
          label="Verified Payments"
          value={stats.verifiedCount}
          icon={CheckCircle}
          color="bg-gradient-to-br from-emerald-500 to-emerald-600"
          trend="+12.5%"
          change={12.5}
        />
        <StatCard
          label="Total Verified Amount"
          value={stats.totalAmount}
          icon={DollarSign}
          color="bg-gradient-to-br from-blue-500 to-blue-600"
          trend="+8.5%"
          change={8.5}
        />
        <StatCard
          label="Match Rate"
          value={stats.matchRate}
          icon={Percent}
          color="bg-gradient-to-br from-purple-500 to-purple-600"
          trend="Improving"
          change={5.2}
        />
      </motion.div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          {[
            { id: 'unverified', label: 'Unverified Bank Transactions', icon: AlertCircle },
            { id: 'verified', label: 'Verified Payments', icon: CheckCircle },
            { id: 'all', label: 'All Transactions', icon: Database }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6"
      >
        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {activeTab === 'unverified' ? 'Unverified Bank Transactions' :
               activeTab === 'verified' ? 'Verified Payments' : 'All Transactions'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {activeTab === 'unverified' ? 'Match bank transactions to students and verify payments' :
               activeTab === 'verified' ? 'View all verified payments and student records' :
               'Complete transaction history including bank statements'}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative flex-1">
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
            className="mb-4 p-4 bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200"
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
                  Total amount: ₹{bankStatements
                    .filter(stmt => selectedTransactions.includes(stmt.id))
                    .reduce((sum, stmt) => sum + (stmt.amount || 0), 0)
                    .toLocaleString()}
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

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {activeTab === 'unverified' && (
                  <th className="px-6 py-3 text-left">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedTransactions.length === filteredTransactions.filter(t => !t.isVerified).length && filteredTransactions.filter(t => !t.isVerified).length > 0}
                        onChange={toggleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Select</span>
                    </div>
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Transaction Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Amount & Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Student Match
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTransactions.map((transaction) => {
                const isBankTransaction = transaction.hasOwnProperty('referenceNumber') ||
                  transaction.hasOwnProperty('bankAccount') ||
                  transaction.status === 'UNVERIFIED' ||
                  transaction.status === 'PENDING';
                const student = isBankTransaction
                  ? transaction.student || getStudentData(transaction.student?.id)
                  : transaction.student || getStudentData(transaction.studentId);
                const isVerified = transaction.isVerified === true || (!isBankTransaction);
                const isMatched = isBankTransaction && transaction.status === 'MATCHED';
                const isUnverifiedBank = isBankTransaction && (!transaction.isVerified || transaction.isVerified === false);

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
                          disabled={transaction.isVerified}
                        />
                      </td>
                    )}
                    <td className="px-6 py-4">
                      <div>
                        <div className="flex items-center gap-2">
                          {isBankTransaction ? (
                            <Banknote className="w-4 h-4 text-gray-400" />
                          ) : (
                            <Receipt className="w-4 h-4 text-gray-400" />
                          )}
                          <p className="font-semibold text-gray-900">
                            {isBankTransaction ? (transaction.description || transaction.referenceNumber) : transaction.receiptNumber}
                          </p>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          <p>Date: {transaction.transactionDate ? new Date(transaction.transactionDate).toLocaleDateString() :
                                   transaction.paymentDate ? new Date(transaction.paymentDate).toLocaleDateString() : 'N/A'}</p>
                          <p className="font-mono text-xs mt-1">
                            Ref: {transaction.referenceNumber || transaction.receiptNumber || 'N/A'}
                          </p>
                          {isBankTransaction && transaction.bankAccount && (
                            <p className="text-xs text-gray-500">Acct: {transaction.bankAccount}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-lg font-bold text-gray-900">₹{transaction.amount?.toLocaleString() || '0'}</p>
                        <PaymentMethodBadge
                          method={isBankTransaction
                            ? getPaymentMethodFromBankTransaction(transaction.description)
                            : transaction.paymentMethod
                          }
                        />
                        {!isBankTransaction && transaction.smsSent && (
                          <div className="flex items-center gap-1 text-xs text-emerald-600">
                            <MessageSquare className="w-3 h-3" />
                            SMS Sent
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <TransactionStatusBadge
                        status={isBankTransaction ? (transaction.status || 'unverified') : 'verified'}
                      />
                      {!isBankTransaction && transaction.verifiedBy && (
                        <p className="text-xs text-gray-500 mt-1">
                          By {transaction.verifiedBy?.fullName || transaction.verifiedBy}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {student ? (
                        <div>
                          <p className="font-medium text-gray-900">{student.fullName}</p>
                          <p className="text-sm text-gray-600">{student.grade}</p>
                          <p className="text-xs text-gray-500">{student.phone || student.contact || 'No phone'}</p>
                          {student.feeStatus === 'PENDING' && student.pendingAmount > 0 && (
                            <p className="text-xs text-amber-600 mt-1">
                              Pending: ₹{student.pendingAmount.toLocaleString()}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="text-center">
                          <Unlink className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                          <p className="text-xs text-gray-500">Not matched</p>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {/* Case 1: Verified transactions (non-bank) */}
                        {isVerified && !isBankTransaction ? (
                          <>
                            <VerifiedStatusIndicator isVerified={true} />
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDownloadReceipt(transaction.id)}
                              className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                              title="Download Receipt"
                            >
                              <Download className="w-4 h-4" />
                            </motion.button>
                          </>
                        ) :
                        /* Case 2: Matched bank transactions */
                        isMatched ? (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleEditPaymentRecord(transaction, false)}
                              className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                              title="Edit Payment Record"
                            >
                              <Edit className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleDownloadReceipt(transaction.id)}
                              className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
                              title="Download Receipt"
                            >
                              <Download className="w-4 h-4" />
                            </motion.button>
                          </>
                        ) :
                        /* Case 3: Unverified bank transactions */
                        isUnverifiedBank ? (
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
                        ) : null}
                        
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
          
          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No transactions found</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                {activeTab === 'unverified'
                  ? 'All bank transactions have been verified. Import new bank statements to see more.'
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
          )}
        </div>
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