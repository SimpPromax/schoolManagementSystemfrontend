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
  AlertOctagon,
  Zap,
  Shield,
  Activity,
  PlayCircle,
  FileX,
  UploadCloud,
  FileSpreadsheet as ExcelIcon,
  FileText as CSVIcon,
  Filter,
  Info,
  ExternalLink,
  FileWarning,
  AlertCircle as WarningIcon,
  HelpCircle,
  Settings,
  Send,
  Copy,
  Trash2,
  Hash,
  Calendar as CalendarIcon,
  Mail as MailIcon,
  PhoneCall,
  FilePlus,
  GitPullRequest,
  Layers as LayersIcon,
  AlertTriangle as AlertTriangleIcon,
  List,
  Database as DatabaseIcon,
  Copy as CopyIcon
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const MySwal = withReactContent(Swal);

// SweetAlert2 configuration
const showModalWithLockedBackground = (options) => {
  document.body.style.overflow = 'hidden';
  document.body.style.paddingRight = '15px';
  
  const originalCloseHandler = options.willClose;
  options.willClose = () => {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    if (originalCloseHandler) originalCloseHandler();
  };
  
  // Set default width for all modals
  options.width = options.width || 800; // Increased default width
  
  return MySwal.fire(options);
};

// Helper function to create centered content with proper spacing
const createCenteredContent = (content, isHtml = false) => {
  if (isHtml && typeof content === 'string') {
    // For HTML content, wrap in centered container
    return `
      <div class="text-center max-w-3xl mx-auto">
        ${content}
      </div>
    `;
  }
  
  // For React components
  return (
    <div className="text-center max-w-3xl mx-auto">
      {content}
    </div>
  );
};

const showSuccessAlert = (title, htmlContent) => {
  // Create a temporary div to check if content is HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  const hasTags = tempDiv.children.length > 0 || tempDiv.childNodes.length > 1;
  
  return showModalWithLockedBackground({
    title: <div className="flex items-center gap-2 justify-center">
      <CheckCircle className="w-6 h-6 text-emerald-600" />
      <span>{title}</span>
    </div>,
    html: hasTags ? `
      <div class="text-center max-w-3xl mx-auto">
        ${htmlContent}
      </div>
    ` : `<p class="text-gray-700 text-center">${htmlContent}</p>`,
    icon: 'success',
    confirmButtonText: 'OK',
    confirmButtonColor: '#10b981',
    showCloseButton: true,
    width: 700,
    customClass: {
      popup: 'rounded-2xl border border-gray-200 shadow-xl',
      title: 'text-lg font-bold flex items-center gap-2 justify-center',
      confirmButton: 'px-6 py-3 rounded-lg font-medium mx-auto block',
      htmlContainer: 'text-center'
    }
  });
};

const showWarningAlert = (title, htmlContent, actionButton = null) => {
  // Create a temporary div to check if content is HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  const hasTags = tempDiv.children.length > 0 || tempDiv.childNodes.length > 1;
  
  return showModalWithLockedBackground({
    title: <div className="flex items-center gap-2 justify-center">
      <AlertTriangle className="w-6 h-6 text-amber-600" />
      <span>{title}</span>
    </div>,
    html: hasTags ? `
      <div class="text-center max-w-4xl mx-auto">
        ${htmlContent}
      </div>
    ` : `<p class="text-gray-700 text-center">${htmlContent}</p>`,
    icon: 'warning',
    confirmButtonColor: actionButton?.color || '#f59e0b',
    cancelButtonColor: '#6b7280',
    showCloseButton: true,
    width: 800, // Wider for warning alerts
    customClass: {
      popup: 'rounded-2xl border border-gray-200 shadow-xl',
      title: 'text-lg font-bold flex items-center gap-2 justify-center',
      confirmButton: 'px-6 py-3 rounded-lg font-medium',
      cancelButton: 'px-6 py-3 rounded-lg font-medium',
      htmlContainer: 'text-center'
    },
    showConfirmButton: !actionButton,
    showCancelButton: !!actionButton,
    confirmButtonText: actionButton ? (actionButton.text || 'Proceed') : 'OK',
    cancelButtonText: 'Cancel'
  });
};

const showErrorAlert = (title, message) => {
  return showModalWithLockedBackground({
    title: <div className="flex items-center gap-2 justify-center">
      <XCircle className="w-6 h-6 text-rose-600" />
      <span>{title}</span>
    </div>,
    html: `<p class="text-gray-700 text-center max-w-2xl mx-auto">${message}</p>`,
    icon: 'error',
    confirmButtonText: 'Try Again',
    confirmButtonColor: '#ef4444',
    showCloseButton: true,
    width: 600,
    customClass: {
      popup: 'rounded-2xl border border-gray-200 shadow-xl',
      title: 'text-lg font-bold flex items-center gap-2 justify-center',
      confirmButton: 'px-6 py-3 rounded-lg font-medium mx-auto',
      htmlContainer: 'text-center'
    }
  });
};

const showConfirmDialog = (title, message, confirmText, cancelText) => {
  return showModalWithLockedBackground({
    title: <div className="flex items-center gap-2 justify-center">
      <AlertCircle className="w-6 h-6 text-gray-900" />
      <span>{title}</span>
    </div>,
    html: `<p class="text-gray-700 text-center max-w-2xl mx-auto">${message}</p>`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonColor: '#3b82f6',
    cancelButtonColor: '#6b7280',
    reverseButtons: true,
    width: 650,
    customClass: {
      popup: 'rounded-2xl border border-gray-200 shadow-xl',
      title: 'text-lg font-bold flex items-center gap-2 justify-center',
      confirmButton: 'px-6 py-3 rounded-lg font-medium',
      cancelButton: 'px-6 py-3 rounded-lg font-medium',
      htmlContainer: 'text-center'
    }
  });
};

// Show duplicate details modal
const showDuplicateDetailsModal = (duplicateRefs, totalDuplicates) => {
  return showModalWithLockedBackground({
    title: <div className="flex items-center gap-2 justify-center">
      <AlertTriangleIcon className="w-6 h-6 text-amber-600" />
      <span>Duplicate Transactions ({totalDuplicates})</span>
    </div>,
    html: `
      <div class="text-center max-w-5xl mx-auto">
        <div class="space-y-4">
          <p class="text-gray-700">
            The following transaction reference numbers already exist in the database and were skipped:
          </p>
          
          <div class="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
            <div class="space-y-2">
              ${duplicateRefs.map((ref, index) => `
                <div class="flex items-center gap-2 p-2 bg-white rounded border border-gray-200 justify-between">
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 bg-amber-500 rounded-full shrink-0"></div>
                    <code class="text-sm font-mono text-gray-800 truncate">
                      ${ref}
                    </code>
                  </div>
                  <button
                    class="copy-btn p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                    data-ref="${ref}"
                    title="Copy reference"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              `).join('')}
            </div>
          </div>
          
          <div class="p-3 bg-blue-50 rounded-lg border border-blue-200 text-left">
            <div class="flex items-start gap-2">
              <svg class="w-4 h-4 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div class="flex-1">
                <p class="text-sm font-medium text-blue-800 mb-1">Why are duplicates skipped?</p>
                <p class="text-xs text-blue-700">
                  Each transaction reference must be unique in the database. 
                  Duplicate transactions are automatically skipped to maintain data integrity.
                </p>
              </div>
            </div>
          </div>
          
          ${totalDuplicates > 10 ? `
            <p class="text-sm text-gray-500">
              Showing 10 of ${totalDuplicates} duplicate references
            </p>
          ` : ''}
        </div>
      </div>
    `,
    width: 900, // Much wider for tabular data
    showConfirmButton: true,
    confirmButtonText: 'Got it',
    confirmButtonColor: '#3b82f6',
    showCloseButton: true,
    didOpen: () => {
      // Add click handlers for copy buttons
      document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const ref = e.currentTarget.getAttribute('data-ref');
          navigator.clipboard.writeText(ref);
          MySwal.fire({
            icon: 'success',
            title: 'Copied!',
            text: 'Reference copied to clipboard',
            timer: 1500,
            showConfirmButton: false
          });
        });
      });
    },
    customClass: {
      popup: 'rounded-2xl border border-gray-200 shadow-xl',
      title: 'text-lg font-bold flex items-center gap-2 justify-center',
      htmlContainer: 'text-center'
    }
  });
};

// Special modal for tabular data
const showTableModal = (title, tableContent, width = 1000) => {
  return showModalWithLockedBackground({
    title: <div className="flex items-center gap-2 justify-center">
      <FileSpreadsheet className="w-6 h-6 text-blue-600" />
      <span>{title}</span>
    </div>,
    html: `
      <div class="text-center max-w-full">
        <div class="overflow-x-auto">
          ${tableContent}
        </div>
      </div>
    `,
    width: width,
    showConfirmButton: false,
    showCloseButton: true,
    customClass: {
      popup: 'rounded-2xl border border-gray-200 shadow-xl max-w-90vw',
      title: 'text-lg font-bold flex items-center gap-2 justify-center',
      htmlContainer: 'text-center p-0',
      closeButton: 'top-4 right-4'
    }
  });
};

// Helper function to detect and extract issue type
const extractIssueInfo = (transaction) => {
  const description = transaction.description || '';
  const notes = transaction.notes || '';
  
  if (!notes || !notes.trim()) {
    return {
      hasIssue: false,
      originalDescription: description,
      issueType: null,
      issueMessage: null,
      color: 'gray',
      icon: FileText
    };
  }
  
  let issueMessage = null;
  let issueType = 'UNMATCHED';
  
  // Check for duplicate markers
  if (notes.includes('[DUPLICATE SKIPPED]') || 
      notes.includes('Duplicate in database') ||
      notes.includes('Already exists in database')) {
    issueType = 'DUPLICATE';
    issueMessage = 'Duplicate transaction - Already exists in database';
  }
  // Check for validation issue patterns
  else if (notes.match(/\[VALIDATION ISSUE:\s*(.*?)\]/)) {
    const bracketMatch = notes.match(/\[VALIDATION ISSUE:\s*(.*?)\]/);
    issueMessage = bracketMatch[1];
  }
  else if (notes.includes('Imported with validation issue:')) {
    issueMessage = notes.split('Imported with validation issue:')[1]?.trim() || notes;
  }
  else if (notes.includes('Student validation failed:')) {
    issueMessage = notes.split('Student validation failed:')[1]?.trim() || notes;
  }
  else if (notes.includes('No matching student found')) {
    issueMessage = 'No matching student found during auto-matching';
  }
  else if (notes.toLowerCase().includes('validation issue') || 
           notes.toLowerCase().includes('validation failed')) {
    issueMessage = notes;
  }
  
  if (!issueMessage) {
    return {
      hasIssue: false,
      originalDescription: description,
      issueType: null,
      issueMessage: null,
      color: 'gray',
      icon: FileText
    };
  }
  
  // Determine issue type based on message
  const messageLower = issueMessage.toLowerCase();
  
  if (issueType === 'DUPLICATE') {
    // Already set as duplicate
  } else if (messageLower.includes('missing') || 
             messageLower.includes('invalid') || 
             messageLower.includes('required') ||
             messageLower.includes('format') ||
             messageLower.includes('malformed') ||
             messageLower.includes('duplicate')) {
    issueType = 'INVALID';
  } else if (messageLower.includes('student not found') || 
             messageLower.includes('no student match') ||
             messageLower.includes('partial match') ||
             messageLower.includes('could not match') ||
             messageLower.includes('student validation failed') ||
             messageLower.includes('no matching student')) {
    issueType = 'UNMATCHED';
  } else if (messageLower.includes('date') || 
             messageLower.includes('date format')) {
    issueType = 'FORMAT';
  }
  
  // Get color and icon based on issue type
  const getIssueConfig = (type) => {
    const config = {
      DUPLICATE: { color: 'gray', icon: DatabaseIcon, label: 'Duplicate' },
      INVALID: { color: 'rose', icon: FileX, label: 'Invalid' },
      UNMATCHED: { color: 'amber', icon: User, label: 'Unmatched' },
      FORMAT: { color: 'purple', icon: Calendar, label: 'Format Issue' }
    };
    return config[type] || config.UNMATCHED;
  };
  
  const { color, icon: Icon, label } = getIssueConfig(issueType);
  
  return {
    hasIssue: true,
    originalDescription: description,
    issueType,
    issueMessage,
    color,
    icon: Icon,
    label
  };
};

// Component to display transaction with issues
const TransactionWithIssue = ({ transaction }) => {
  const issueInfo = extractIssueInfo(transaction);
  
  if (!issueInfo.hasIssue) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {issueInfo.originalDescription || 'No description'}
            </p>
            {transaction.notes && !transaction.notes.includes('[VALIDATION ISSUE:') && 
             !transaction.notes.includes('validation issue') && 
             !transaction.notes.includes('validation failed') && (
              <p className="text-xs text-gray-500 mt-1">{transaction.notes}</p>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  const { issueType, issueMessage, originalDescription, color, icon: Icon, label } = issueInfo;
  const colorClasses = {
    gray: 'bg-gray-50 text-gray-700 border-gray-200',
    rose: 'bg-rose-50 text-rose-700 border-rose-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200'
  };
  
  return (
    <div className="space-y-3">
      {/* Original Description */}
      <div className="flex items-start gap-3">
        <FileText className="w-5 h-5 text-gray-500 mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">
            {originalDescription || 'No original description'}
          </p>
        </div>
      </div>
      
      {/* Issue Details from Notes */}
      <div className={`p-3 rounded-lg border ${colorClasses[color]}`}>
        <div className="flex items-start gap-3">
          <div className={`p-1.5 rounded-md bg-white border ${
            color === 'gray' ? 'border-gray-300' :
            color === 'rose' ? 'border-rose-300' :
            color === 'amber' ? 'border-amber-300' :
            'border-purple-300'
          }`}>
            <Icon className={`w-4 h-4 ${
              color === 'gray' ? 'text-gray-600' :
              color === 'rose' ? 'text-rose-600' :
              color === 'amber' ? 'text-amber-600' :
              'text-purple-600'
            }`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                color === 'gray' ? 'bg-gray-100 text-gray-800' :
                color === 'rose' ? 'bg-rose-100 text-rose-800' :
                color === 'amber' ? 'bg-amber-100 text-amber-800' :
                'bg-purple-100 text-purple-800'
              }`}>
                {label}
              </span>
              {issueInfo.issueType === 'INVALID' && (
                <span className="text-xs font-medium text-rose-800">⚠️ Requires Fixing</span>
              )}
              {issueInfo.issueType === 'DUPLICATE' && (
                <span className="text-xs font-medium text-gray-800">⛔ Already Exists</span>
              )}
            </div>
            <p className="text-sm font-medium">{issueMessage}</p>
            {transaction.notes && issueMessage !== transaction.notes && (
              <p className="text-xs mt-1 opacity-75">Full notes: {transaction.notes}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Issue type badge component
const IssueTypeBadge = ({ issueType }) => {
  const config = {
    DUPLICATE: {
      label: 'Duplicate',
      color: 'bg-gray-100 text-gray-800 border border-gray-200',
      icon: DatabaseIcon
    },
    INVALID: {
      label: 'Invalid',
      color: 'bg-rose-100 text-rose-800 border border-rose-200',
      icon: FileX
    },
    UNMATCHED: {
      label: 'Unmatched',
      color: 'bg-amber-100 text-amber-800 border border-amber-200',
      icon: User
    },
    FORMAT: {
      label: 'Format',
      color: 'bg-purple-100 text-purple-800 border border-purple-200',
      icon: Calendar
    }
  };
  
  const { label, color, icon: Icon } = config[issueType] || config.UNMATCHED;
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${color}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
};

// Helper function to show SweetAlert2 file upload modal
const showFileUploadModal = (onFileSelect, onValidationComplete, onImportComplete) => {
  let selectedFile = null;
  let validationData = null;
  let previewData = null;
  let showValidationResults = false;
  let invalidCount = 0;
  let validCount = 0;

  const FileUploadView = () => (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-300 transition-colors bg-gray-50/50">
        <input
          type="file"
          id="file-upload-input"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              selectedFile = file;
              processFile(file);
            }
          }}
          accept=".csv,.xlsx,.xls,.json,.txt"
        />
        <label htmlFor="file-upload-input" className="cursor-pointer">
          <div className="flex flex-col items-center">
            <div className="p-4 bg-blue-50 rounded-full mb-4">
              <UploadCloud className="w-12 h-12 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
              {selectedFile ? 'File Selected' : 'Drag & Drop or Click to Upload'}
            </h3>
            <p className="text-gray-600 mb-4 text-center">
              {selectedFile ? selectedFile.name : 'Supports CSV, Excel, JSON files up to 10MB'}
            </p>
            {!selectedFile && (
              <div className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium mx-auto">
                Browse Files
              </div>
            )}
          </div>
        </label>
      </div>

      {previewData && (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 text-center">File Preview</h4>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                {getFileIcon(selectedFile.name)}
                <div>
                  <h5 className="font-medium text-gray-800">{selectedFile.name}</h5>
                  <p className="text-sm text-gray-600 text-center">
                    {(selectedFile.size / 1024).toFixed(2)} KB • {previewData.rowCount} records
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-3">
              <div className="bg-white rounded border border-gray-300 p-3 max-h-60 overflow-y-auto">
                <pre className="text-sm text-gray-700 font-mono whitespace-pre-wrap text-center">
                  {previewData.content}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const ValidationResultsView = () => {
    if (!validationData) return null;
    
    const { validationResults, warning } = validationData;
    const invalidResults = validationResults.filter(result => 
      result.status === 'INVALID' || result.status === 'UNMATCHED'
    );

    // Count different issue types
    const issueCounts = invalidResults.reduce((acc, result) => {
      let issueType = 'UNMATCHED';
      const message = result.validationMessage?.toLowerCase() || '';
      
      if (message.includes('missing') || message.includes('invalid') || message.includes('required')) {
        issueType = 'INVALID';
      } else if (message.includes('format') || message.includes('date')) {
        issueType = 'FORMAT';
      }
      
      acc[issueType] = (acc[issueType] || 0) + 1;
      return acc;
    }, {});

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 text-center">Validation Results</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700 text-center">
              {validCount} valid • {invalidCount} with issues
            </span>
            {invalidCount > 0 && (
              <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs">
                ⚠️ {invalidCount} Issues
              </span>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
            <p className="text-xs text-emerald-700 text-center">Valid Transactions</p>
            <p className="text-2xl font-bold text-emerald-800 text-center">{validCount}</p>
            <p className="text-xs text-emerald-600 text-center">
              {invalidCount === 0 ? 'Ready to import' : 'Will be auto-matched'}
            </p>
          </div>
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-xs text-amber-700 text-center">Transactions with Issues</p>
            <p className="text-2xl font-bold text-amber-800 text-center">{invalidCount}</p>
            <p className="text-xs text-amber-600 text-center">
              {invalidCount === 0 ? 'No issues found' : 'Will appear in Unmatched tab'}
            </p>
          </div>
        </div>

        {/* Duplicate warning */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <DatabaseIcon className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h5 className="font-semibold text-blue-800 mb-1 text-center">
                Duplicate Protection Enabled
              </h5>
              <p className="text-sm text-blue-700 text-center">
                Any transactions that already exist in the database will be automatically skipped.
                Only unique transactions will be imported.
              </p>
            </div>
          </div>
        </div>

        {/* Success message when no issues */}
        {invalidCount === 0 && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <h5 className="font-semibold text-emerald-800 mb-1 text-center">
                  Validation Successful! ✅
                </h5>
                <p className="text-sm text-emerald-700 text-center">
                  All {validCount} transactions are valid and ready to import.
                  Duplicates will be automatically skipped.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Issues List - Show when there are issues */}
        {invalidCount > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-900 text-center">
                Issues Found ({invalidResults.length})
              </h4>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 text-center">
                  These will appear in the Unmatched tab
                </span>
              </div>
            </div>
            
            {/* Issue breakdown */}
            {Object.keys(issueCounts).length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(issueCounts).map(([type, count]) => (
                  <div key={type} className={`p-3 rounded-lg border ${
                    type === 'INVALID' ? 'bg-rose-50 border-rose-200' :
                    type === 'FORMAT' ? 'bg-purple-50 border-purple-200' :
                    'bg-amber-50 border-amber-200'
                  }`}>
                    <p className="text-xs font-medium mb-1 text-center">
                      {type === 'INVALID' ? 'Invalid' :
                       type === 'FORMAT' ? 'Format Issues' :
                       'Unmatched'}
                    </p>
                    <p className="text-xl font-bold text-center">{count}</p>
                  </div>
                ))}
              </div>
            )}
            
            {/* Warning banner when issues exist */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <h5 className="font-semibold text-amber-800 mb-1 text-center">
                    {invalidCount} Transaction{invalidCount !== 1 ? 's' : ''} Have Issues
                  </h5>
                  <p className="text-sm text-amber-700 text-center">
                    These transactions will be imported but marked as UNVERIFIED.
                    The issues will be added to their description for easy reference.
                    You can find and fix them in the <strong>Unmatched tab</strong> after import.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Quick preview of issues */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-3 bg-gray-100 border-b border-gray-200">
                <h5 className="font-medium text-gray-900 text-center">Quick Preview of Issues:</h5>
              </div>
              <div className="max-h-48 overflow-y-auto">
                <table className="w-full">
                  <tbody className="divide-y divide-gray-200">
                    {invalidResults.slice(0, 5).map((result, index) => {
                      let issueType = 'UNMATCHED';
                      const message = result.validationMessage?.toLowerCase() || '';
                      if (message.includes('missing') || message.includes('invalid') || message.includes('required')) {
                        issueType = 'INVALID';
                      } else if (message.includes('format') || message.includes('date')) {
                        issueType = 'FORMAT';
                      }
                      
                      return (
                        <tr key={index} className="hover:bg-gray-100">
                          <td className="px-3 py-2 text-xs font-mono text-center">#{index + 1}</td>
                          <td className="px-3 py-2 text-center">
                            <code className="text-xs font-mono bg-gray-200 px-1.5 py-0.5 rounded">
                              {result.bankReference || 'N/A'}
                            </code>
                          </td>
                          <td className="px-3 py-2 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              issueType === 'INVALID' 
                                ? 'bg-rose-100 text-rose-800'
                                : issueType === 'FORMAT'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {issueType}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-xs truncate max-w-xs text-center">
                            {result.validationMessage}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {invalidResults.length > 5 && (
                  <div className="p-2 text-center text-xs text-gray-500">
                    Showing 5 of {invalidResults.length} issues
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const processFile = (file) => {
    selectedFile = file;
    previewData = null;
    
    // Generate preview
    if (file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonContent = JSON.parse(e.target.result);
          previewData = {
            type: 'json',
            content: JSON.stringify(jsonContent, null, 2).substring(0, 1000) + '...',
            rowCount: Array.isArray(jsonContent) ? jsonContent.length : 1
          };
          updateModal();
        } catch (error) {
          previewData = {
            type: 'text',
            content: 'Unable to parse JSON. Raw preview: ' + e.target.result.substring(0, 1000) + '...',
            rowCount: 1
          };
          updateModal();
        }
      };
      reader.readAsText(file);
    } else if (file.type.includes('csv') || file.name.endsWith('.csv')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const lines = e.target.result.split('\n');
        previewData = {
          type: 'csv',
          content: lines.slice(0, 10).join('\n'),
          rowCount: Math.max(0, lines.length - 1)
        };
        updateModal();
      };
      reader.readAsText(file);
    } else if (file.type.includes('sheet') || file.name.match(/\.xlsx?$/i)) {
      previewData = {
        type: 'excel',
        content: 'Excel file preview not available. File will be processed on upload.',
        rowCount: 'Unknown'
      };
      updateModal();
    } else {
      previewData = {
        type: 'file',
        content: 'File preview not available.',
        rowCount: 'Unknown'
      };
      updateModal();
    }
  };

  const getFileIcon = (fileName) => {
    if (fileName?.endsWith('.csv')) return <CSVIcon className="w-8 h-8 text-emerald-600" />;
    if (fileName?.endsWith('.xlsx') || fileName?.endsWith('.xls')) return <ExcelIcon className="w-8 h-8 text-green-600" />;
    if (fileName?.endsWith('.json')) return <FileText className="w-8 h-8 text-amber-600" />;
    return <File className="w-8 h-8 text-blue-600" />;
  };

  const updateModal = () => {
    MySwal.update({
      html: showValidationResults ? <ValidationResultsView /> : <FileUploadView />,
      confirmButtonText: showValidationResults 
        ? (invalidCount === 0 ? 'Proceed with Import' : 'Import Anyway') 
        : 'Validate File',
      confirmButtonColor: showValidationResults 
        ? (invalidCount === 0 ? '#10b981' : '#f59e0b')
        : '#3b82f6',
      cancelButtonText: showValidationResults ? 'Back' : 'Cancel',
      showCancelButton: true,
      showConfirmButton: true
    });
  };

  return showModalWithLockedBackground({
    title: <div className="flex items-center gap-2 justify-center">
      <Upload className="w-6 h-6 text-blue-600" />
      <span>{showValidationResults ? 'Import Validation' : 'Import Bank Statement'}</span>
    </div>,
    html: showValidationResults ? <ValidationResultsView /> : <FileUploadView />,
    showCancelButton: true,
    showConfirmButton: true,
    confirmButtonText: showValidationResults 
      ? (invalidCount === 0 ? 'Proceed with Import' : 'Import Anyway') 
      : 'Validate File',
    cancelButtonText: showValidationResults ? 'Back' : 'Cancel',
    confirmButtonColor: showValidationResults 
      ? (invalidCount === 0 ? '#10b981' : '#f59e0b')
      : '#3b82f6',
    customClass: {
      popup: 'rounded-2xl border border-gray-200 shadow-xl w-full max-w-4xl',
      title: 'text-lg font-bold flex items-center gap-2 justify-center',
      confirmButton: 'px-6 py-3 rounded-lg font-medium mx-auto',
      cancelButton: 'px-6 py-3 rounded-lg font-medium',
      htmlContainer: 'text-center'
    },
    preConfirm: async () => {
      if (!showValidationResults) {
        // Step 1: Validate file
        if (!selectedFile) {
          MySwal.showValidationMessage('Please select a file first');
          return false;
        }
        
        try {
          const formData = new FormData();
          formData.append('file', selectedFile);
          formData.append('bankAccount', 'default');
          
          // Pass validation results if available
          if (validationData) {
            formData.append('validationResults', JSON.stringify(validationData));
          }
          
          const response = await transactionApi.post('/import/validate', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          
          validationData = handleResponse(response);
          showValidationResults = true;
          
          // Get counts for button state
          const invalidResults = validationData.validationResults.filter(result => 
            result.status === 'INVALID' || result.status === 'UNMATCHED'
          );
          invalidCount = invalidResults.length;
          validCount = validationData.validCount || (validationData.totalTransactions - invalidCount);
          
          // Update modal with new state
          updateModal();
          
          return false; // Don't close modal
        } catch (error) {
          MySwal.showValidationMessage(error.message || 'Validation failed');
          return false;
        }
      } else {
        // Step 2: Proceed with import
        if (invalidCount > 0) {
          // If there are issues, show a warning but allow import
          const result = await showConfirmDialog(
            'Import Transactions with Issues',
            `You are about to import ${validCount} valid transactions and ${invalidCount} transactions with issues. 
            Transactions with issues will be marked as UNVERIFIED and appear in the Unmatched tab. Continue?`,
            'Proceed with Import',
            'Cancel'
          );
          
          if (!result.isConfirmed) {
            return false;
          }
        }
        
        // Import the file
        if (onImportComplete && selectedFile) {
          await onImportComplete(selectedFile, validationData);
        }
        return true; // Close modal
      }
    },
    willClose: () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
  });
};

// Payment method mapping
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

// Transform backend API response
const transformTransactionResponse = (apiData) => {
  if (!Array.isArray(apiData)) {
    console.warn('transformTransactionResponse: Expected array, got', typeof apiData);
    return [];
  }

  return apiData.map(item => {
    if (item.student && typeof item.student === 'object') {
      return item;
    }

    const transformed = { ...item };
    
    const hasStudentData = item.studentId || item.studentName;
    
    if (hasStudentData) {
      transformed.student = {
        id: item.studentId,
        studentId: item.studentStudentId || item.studentCode || item.studentId,
        fullName: item.studentName,
        grade: item.studentGrade,
        hasTermAssignments: item.hasTermAssignments !== undefined 
          ? item.hasTermAssignments 
          : false,
        termAssignmentCount: item.termAssignmentCount !== undefined 
          ? item.termAssignmentCount 
          : 0,
        totalFee: item.studentTotalFee,
        paidAmount: item.studentPaidAmount,
        pendingAmount: item.studentPendingAmount,
        feeStatus: item.studentFeeStatus,
        paymentPercentage: item.studentPaymentPercentage,
        phone: item.studentPhone,
        email: item.studentEmail,
        emergencyContactPhone: item.studentEmergencyContactPhone,
        emergencyContactName: item.studentEmergencyContactName,
        contact: item.studentPhone || item.studentEmergencyContactPhone
      };

      const fieldsToRemove = [
        'studentId', 'studentName', 'studentGrade',
        'hasTermAssignments', 'termAssignmentCount',
        'studentTotalFee', 'studentPaidAmount', 'studentPendingAmount',
        'studentFeeStatus', 'studentPaymentPercentage',
        'studentPhone', 'studentEmail', 'studentEmergencyContactPhone',
        'studentEmergencyContactName'
      ];

      fieldsToRemove.forEach(field => {
        if (Object.prototype.hasOwnProperty.call(transformed, field)) {
          delete transformed[field];
        }
      });
    }

    return transformed;
  });
};

// Transform student list from backend
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
    hasTermAssignments: dto.hasTermAssignments || false,
    termAssignmentCount: dto.termAssignmentCount || 0
  }));
};

// ============================================
// API SERVICE
// ============================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const transactionApi = axios.create({
  baseURL: `${API_BASE_URL}/transactions`, // ✅ Uses your network IP from .env
});

const feeManagementApi = axios.create({
  baseURL: `${API_BASE_URL}/fees`, // ✅ Uses your network IP from .env
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
  const [issueFilter, setIssueFilter] = useState('ALL');
  
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

  // UPDATED FETCH FUNCTION WITH DUPLICATE HANDLING
  const fetchAllData = useCallback(async (refreshCache = false) => {
    setIsLoading(true);
    
    try {
      // Step 1: Refresh backend cache if requested
      if (refreshCache) {
        await refreshBackendCache();
      }
      
      // Step 2: Fetch statistics FIRST
      await fetchStatistics();
      
      // Step 3: Fetch ALL bank transactions
      try {
        const bankResponse = await transactionApi.get('/bank?all=true');
        const allBankData = handleResponse(bankResponse);
        
        console.log('🔍 Raw API response (first transaction):', allBankData[0]);
        
        // TRANSFORM THE DATA
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

      // Step 4: Fetch ALL students
      try {
      const studentsResponse = await axios.get(`${API_BASE_URL}/v1/students`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const studentsData = studentsResponse.data;
        
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

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    let transactions = [...bankStatements];
    
    if (activeTab === 'unverified') {
      transactions = bankStatements.filter(stmt => 
        stmt.status === 'UNVERIFIED' || stmt.status === 'PENDING'
      );
      
      // Apply issue type filter
      if (issueFilter !== 'ALL') {
        transactions = transactions.filter(transaction => {
          const issueInfo = extractIssueInfo(transaction);
          return issueInfo.hasIssue && issueInfo.issueType === issueFilter;
        });
      }
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
        const issueInfo = extractIssueInfo(transaction);
        const originalDesc = issueInfo.originalDescription || '';
        const issueMessage = issueInfo.issueMessage || '';
        
        return (
          (transaction.student?.fullName || '').toLowerCase().includes(searchLower) ||
          originalDesc.toLowerCase().includes(searchLower) ||
          issueMessage.toLowerCase().includes(searchLower) ||
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
  }, [activeTab, studentIdParam, searchQuery, bankStatements, currentPage, issueFilter]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, issueFilter]);

  // Get student data
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

  // View term assignments
  const handleViewTermAssignments = async (student) => {
    if (!student) return;
    
    console.log('📘 Viewing term assignments for student:', student);
    
    setIsLoading(true);
    
    try {
      console.log('📞 Calling term assignments API for student ID:', student.id);
      
      const response = await feeManagementApi.get(`/student/${student.id}/term-assignments`);
      const data = handleResponse(response);
      
      console.log('✅ Term assignments API response:', data);
      
      let termAssignments = [];
      
      if (data && data.data && Array.isArray(data.data.termAssignments)) {
        termAssignments = data.data.termAssignments;
      } else if (Array.isArray(data)) {
        termAssignments = data;
      } else if (data && Array.isArray(data.termAssignments)) {
        termAssignments = data.termAssignments;
      }
      
      const totalTermFee = termAssignments.reduce((sum, term) => sum + (Number(term.totalFee) || 0), 0);
      const totalTermPaid = termAssignments.reduce((sum, term) => sum + (Number(term.paidAmount) || 0), 0);
      const totalTermPending = termAssignments.reduce((sum, term) => sum + (Number(term.pendingAmount) || 0), 0);
      
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
      await showModalWithLockedBackground({
        title: <div className="flex items-center gap-2 justify-center">
          <BookOpen className="w-6 h-6 text-gray-900" />
          <span>Term Assignments - {student.fullName}</span>
        </div>,
        html: (
          <div className="text-center space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Student Information */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-lg text-gray-900 text-center">Student Information</h3>
                  </div>
                  <p className="text-sm text-gray-600 text-center">{student.grade} • ID: {student.studentId}</p>
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
                  <p className="text-xs text-gray-500 text-center">Total Terms</p>
                  <p className="text-lg font-bold text-gray-900 text-center">
                    {termAssignmentCount}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 text-center">Total Fee</p>
                  <p className="text-lg font-bold text-gray-900 text-center">
                    {formatCurrency(student.totalFee || totalTermFee || 0)}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 text-center">Paid Amount</p>
                  <p className="text-lg font-bold text-gray-900 text-center">
                    {formatCurrency(student.paidAmount || totalTermPaid || 0)}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 text-center">Pending</p>
                  <p className="text-lg font-bold text-amber-600 text-center">
                    {formatCurrency(student.pendingAmount || totalTermPending || 0)}
                  </p>
                </div>
              </div>

              {!hasTermAssignments && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-amber-800 text-center">No Term Assignments</h4>
                      <p className="text-xs text-amber-700 mt-1 text-center">
                        This student has not been assigned to any academic terms.
                      </p>
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
                  <h3 className="font-semibold text-gray-900 text-center">Term-wise Fee Breakdown</h3>
                </div>
                <span className="text-sm text-gray-500 text-center">
                  {termAssignmentCount} term(s) assigned
                </span>
              </div>

              {!hasTermAssignments ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
                  <Book className="w-12 h-12 text-gray-400 mx-auto" />
                  <h4 className="mt-4 text-lg font-semibold text-gray-900 text-center">No Term Assignments Found</h4>
                  <p className="text-gray-600 mt-2 text-center">
                    This student has not been assigned to any academic terms.
                  </p>
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
                            <h4 className="font-medium text-gray-900 text-center">
                              {term.termName || `Term ${index + 1}`}
                            </h4>
                          </div>

                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <p className="text-xs text-gray-500 text-center">Total Fee</p>
                              <p className="text-sm font-bold text-gray-900 text-center">
                                {formatCurrency(term.totalFee || 0)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 text-center">Paid Amount</p>
                              <p className="text-sm font-bold text-emerald-600 text-center">
                                {formatCurrency(term.paidAmount || 0)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 text-center">Pending</p>
                              <p className="text-sm font-bold text-amber-600 text-center">
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
          </div>
        ),
        width: 900, // Increased width
        showConfirmButton: false,
        showCloseButton: true,
        customClass: {
          popup: 'rounded-2xl border border-gray-200 shadow-xl',
          title: 'text-lg font-bold flex items-center gap-2 justify-center',
          htmlContainer: 'text-center'
        }
      });
      
    } catch (error) {
      console.error('❌ Error in handleViewTermAssignments:', error);
      
      await showErrorAlert(
        'Unable to Load Term Data',
        error.message || 'Could not retrieve term assignment information.'
      );
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

      const summaryHtml = `
        <div class="text-center space-y-4 max-w-4xl mx-auto">
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div class="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
              <p class="text-xs text-emerald-700 text-center">Valid Students</p>
              <p class="text-2xl font-bold text-emerald-800 text-center">${validCount}</p>
            </div>
            <div class="p-3 bg-amber-50 rounded-lg border border-amber-200">
              <p class="text-xs text-amber-700 text-center">Invalid Students</p>
              <p class="text-2xl font-bold text-amber-800 text-center">${invalidCount}</p>
            </div>
          </div>

          ${validCount > 0 ? `
            <div class="p-3 bg-blue-50 rounded-lg">
              <p class="text-sm text-blue-800 font-medium text-center">
                Total Pending Amount: KSh ${totalPendingAmount.toLocaleString('en-KE')}
              </p>
            </div>
          ` : ''}

          ${invalidCount > 0 ? `
            <div class="mt-4">
              <h4 class="font-semibold text-amber-800 mb-2 text-center">Issues Found:</h4>
              <div class="space-y-2 max-h-60 overflow-y-auto">
                ${validationResults
                  .filter(r => !r.result.success)
                  .map((r, index) => `
                    <div key="${index}" class="p-2 bg-amber-50 rounded border border-amber-200">
                      <p class="text-sm font-medium text-gray-900 text-center">${r.student.fullName}</p>
                      <p class="text-xs text-amber-700 text-center">${r.result.message}</p>
                    </div>
                  `).join('')
                }
              </div>
            </div>
          ` : ''}
        </div>
      `;

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

// UPDATED: Handle file import with proper response structure
const handleImportFile = () => {
  showFileUploadModal(
    null,
    null,
    async (file, validationData) => {
      setIsLoading(true);
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('bankAccount', 'default');
        
        // Pass validation results if available
        if (validationData) {
          formData.append('validationResults', JSON.stringify(validationData));
        }
        
        const response = await transactionApi.post('/import', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        // Check the actual response structure
        console.log('🔍 Full import response:', response.data);
        
        // Handle the response structure based on your backend
        const responseData = response.data;
        let message = '';
        let savedTransactions = 0;
        let duplicateCount = 0;
        let duplicateRefs = [];
        let importedTransactions = [];
        
        if (responseData.success === true) {
          // Success response
          if (responseData.data) {
            const data = responseData.data;
            const importStats = data.importStats || {};
            
            savedTransactions = importStats.savedTransactions || 0;
            duplicateCount = importStats.duplicatesSkipped || 0;
            duplicateRefs = importStats.duplicateReferences || [];
            importedTransactions = data.transactions || [];
            
            message = responseData.message || '';
          } else {
            // Fallback if data structure is different
            savedTransactions = responseData.savedTransactions || responseData.saved || 0;
            duplicateCount = responseData.duplicatesSkipped || responseData.duplicateCount || 0;
            duplicateRefs = responseData.duplicateReferences || [];
            importedTransactions = responseData.transactions || [];
            
            // Construct message based on what we found
            if (savedTransactions === 0 && duplicateCount > 0) {
              message = `No new transactions imported. ${duplicateCount} duplicate transaction(s) were skipped.`;
            } else if (savedTransactions > 0 && duplicateCount > 0) {
              message = `Successfully imported ${savedTransactions} transactions (${duplicateCount} duplicates skipped)`;
            } else if (savedTransactions > 0 && duplicateCount === 0) {
              message = `Successfully imported ${savedTransactions} transactions`;
            } else {
              message = 'No transactions were imported.';
            }
          }
          
          console.log('📊 Import summary:', {
            savedTransactions,
            duplicateCount,
            duplicateRefs,
            message
          });
          
          // Show appropriate message based on results
          if (savedTransactions === 0 && duplicateCount > 0) {
            // ALL transactions are duplicates
            await showWarningAlert(
              'No New Transactions',
              `<div class="text-center max-w-4xl mx-auto">
                <div class="flex items-start gap-3 mb-4">
                  <div class="p-2 bg-amber-100 rounded-lg">
                    <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2 1.5 3 4 3h8c2.5 0 4-1 4-3V7c0-2-1.5-3-4-3H8C5.5 4 4 5 4 7z" />
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-semibold text-amber-900 text-lg text-center">This bank statement is already in the system</h4>
                    <p class="text-sm text-amber-700 mt-1 text-center">All ${duplicateCount} transactions already exist in the database.</p>
                  </div>
                </div>
                
                <div class="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div class="flex items-center gap-2 mb-2">
                    <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="text-sm font-medium text-gray-900 text-center">What happened?</span>
                  </div>
                  <ul class="text-sm text-gray-600 space-y-1 pl-2">
                    <li class="flex items-start gap-2">
                      <div class="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5"></div>
                      <span>The file contains ${duplicateCount} transaction${duplicateCount !== 1 ? 's' : ''}</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <div class="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5"></div>
                      <span>All transaction references already exist in the database</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <div class="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5"></div>
                      <span>No new data was imported to prevent duplicates</span>
                    </li>
                  </ul>
                </div>
                
                ${duplicateCount > 0 ? 
                  `<div class="mt-4">
                    <button 
                      onclick="this.nextElementSibling.classList.toggle('hidden'); this.textContent = this.textContent.includes('Show') ? 'Hide Duplicate References' : 'Show Duplicate References'"
                      class="text-sm text-blue-600 hover:text-blue-800 font-medium mb-2 mx-auto block"
                    >
                      Show Duplicate References
                    </button>
                    <div class="hidden max-h-40 overflow-y-auto bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <p class="text-xs text-gray-600 mb-2 text-center">Transaction references already in database:</p>
                      <div class="space-y-1">
                        ${duplicateRefs.slice(0, 10).map(ref => `
                          <div class="flex items-center gap-2 p-2 bg-white rounded border border-gray-200 justify-between">
                            <div class="w-2 h-2 bg-amber-500 rounded-full"></div>
                            <code class="text-xs font-mono text-gray-800 flex-1 text-center">${ref}</code>
                          </div>
                        `).join('')}
                      </div>
                      ${duplicateRefs.length > 10 ? 
                        `<p class="text-xs text-gray-500 text-center mt-2">Showing 10 of ${duplicateRefs.length} duplicate references</p>` : 
                        ''}
                    </div>
                  </div>` : 
                  ''}
              </div>`
            );
          } else if (savedTransactions > 0 && duplicateCount > 0) {
            // Some saved, some duplicates
            await showWarningAlert(
              'Import Completed with Warnings',
              `<div class="text-center max-w-4xl mx-auto">
                <div class="flex items-start gap-3 mb-4">
                  <div class="p-2 bg-blue-100 rounded-lg">
                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 class="font-semibold text-blue-900 text-lg text-center">Partially Imported</h4>
                    <p class="text-sm text-blue-700 mt-1 text-center">This bank statement contains both new and existing transactions</p>
                  </div>
                </div>
                
                <div class="grid grid-cols-2 gap-4 mb-4">
                  <div class="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <p class="text-xs text-emerald-700 text-center">New Transactions</p>
                    <p class="text-2xl font-bold text-emerald-800 text-center">${savedTransactions}</p>
                    <p class="text-xs text-emerald-600 text-center">Successfully imported</p>
                  </div>
                  <div class="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p class="text-xs text-amber-700 text-center">Duplicate Transactions</p>
                    <p class="text-2xl font-bold text-amber-800 text-center">${duplicateCount}</p>
                    <p class="text-xs text-amber-600 text-center">Already in system</p>
                  </div>
                </div>
                
                <div class="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div class="flex items-center gap-2 mb-2">
                    <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="text-sm font-medium text-gray-900 text-center">Summary</span>
                  </div>
                  <p class="text-sm text-gray-600 text-center">
                    ✅ <strong>${savedTransactions} new transaction${savedTransactions !== 1 ? 's' : ''}</strong> were added to the database.<br/>
                    ⚠️ <strong>${duplicateCount} transaction${duplicateCount !== 1 ? 's' : ''}</strong> were skipped because they already exist.
                  </p>
                </div>
                
                ${duplicateCount > 0 ? 
                  `<div class="mt-4">
                    <button 
                      onclick="this.nextElementSibling.classList.toggle('hidden'); this.textContent = this.textContent.includes('Show') ? 'Hide Duplicate References' : 'Show Duplicate References'"
                      class="text-sm text-blue-600 hover:text-blue-800 font-medium mb-2 mx-auto block"
                    >
                      Show Duplicate References
                    </button>
                    <div class="hidden max-h-40 overflow-y-auto bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <p class="text-xs text-gray-600 mb-2 text-center">Skipped transaction references:</p>
                      <div class="space-y-1">
                        ${duplicateRefs.slice(0, 10).map(ref => `
                          <div class="flex items-center gap-2 p-2 bg-white rounded border border-gray-200 justify-between">
                            <div class="w-2 h-2 bg-amber-500 rounded-full"></div>
                            <code class="text-xs font-mono text-gray-800 flex-1 text-center">${ref}</code>
                          </div>
                        `).join('')}
                      </div>
                      ${duplicateRefs.length > 10 ? 
                        `<p class="text-xs text-gray-500 text-center mt-2">Showing 10 of ${duplicateRefs.length} duplicate references</p>` : 
                        ''}
                    </div>
                  </div>` : 
                  ''}
              </div>`
            );
          } else if (savedTransactions > 0 && duplicateCount === 0) {
            // All saved, no duplicates
            showSuccessAlert(
              'File Imported Successfully!',
              `<div class="text-center max-w-3xl mx-auto">
                <div class="flex items-start gap-3 mb-3">
                  <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 class="font-semibold text-emerald-900 text-center">All Transactions Imported</h4>
                    <p class="text-sm text-emerald-700 text-center">Successfully imported ${savedTransactions} new transaction${savedTransactions !== 1 ? 's' : ''} from bank statement.</p>
                  </div>
                </div>
                <div class="p-3 bg-emerald-50 border border-emerald-200 rounded-lg mt-2">
                  <p class="text-sm text-emerald-700 text-center">
                    ✅ All ${savedTransactions} transaction${savedTransactions !== 1 ? 's' : ''} were unique and have been added to the database.
                  </p>
                </div>
              </div>`
            );
          } else {
            // No transactions at all (empty file?)
            showWarningAlert(
              'No Transactions Found',
              `<div class="text-center max-w-3xl mx-auto">
                <div class="flex items-start gap-3 mb-3">
                  <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.782 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <h4 class="font-semibold text-amber-900 text-center">Empty or Invalid File</h4>
                    <p class="text-sm text-amber-700 text-center">No valid transactions were found in the uploaded file.</p>
                  </div>
                </div>
                <div class="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p class="text-sm text-amber-700 text-center">
                    Please check that the file contains valid transaction data in the correct format.
                  </p>
                </div>
              </div>`
            );
          }
          
          // Update transactions list with imported ones
          if (importedTransactions.length > 0) {
            const transformedData = transformTransactionResponse(importedTransactions);
            setBankStatements(prev => [...transformedData, ...prev]);
          }
          
          setCurrentPage(1);
          await fetchStatistics();
          
        } else {
          // Error response from backend
          showErrorAlert(
            'Import Failed',
            responseData.message || 'Failed to import bank statement file.'
          );
        }
        
      } catch (error) {
        console.error('Import error:', error);
        
        // Check for duplicate error
        if (error.message && (error.message.includes('Duplicate') || error.message.includes('duplicate'))) {
          await showWarningAlert(
            'Duplicate Transactions Detected',
            `<div class="text-center max-w-4xl mx-auto">
              <div class="flex items-start gap-3 mb-3">
                <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2 1.5 3 4 3h8c2.5 0 4-1 4-3V7c0-2-1.5-3-4-3H8C5.5 4 4 5 4 7z" />
                </svg>
                <div>
                  <h4 class="font-semibold text-amber-900 text-center">Possible Duplicate Transactions</h4>
                  <p class="text-sm text-amber-700 text-center">The import may contain transactions that already exist in the database.</p>
                </div>
              </div>
              <div class="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p class="text-sm text-amber-700 text-center">
                  Only unique transactions will be imported. Duplicates will be automatically skipped.
                  If all transactions are duplicates, no new data will be added.
                </p>
              </div>
            </div>`
          );
        } else {
          showErrorAlert('Import Failed', error.message || 'Failed to import bank statement file.');
        }
      } finally {
        setIsLoading(false);
      }
    }
  );
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
            await handleViewTermAssignments(student);
          }
          return;
        }
      }
    }

    const { value: formValues } = await MySwal.fire({
      title: <div className="flex items-center gap-2 justify-center">
        <Edit className="w-6 h-6 text-gray-900" />
        <span>{isNewMatch ? 'Match Bank Transaction' : 'Edit Payment Record'}</span>
      </div>,
      html: (
        <div className="text-center space-y-6 max-h-[70vh] overflow-y-auto max-w-4xl mx-auto">
          {/* Bank Transaction Details */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Banknote className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-lg text-gray-900 text-center">Bank Transaction</h3>
                </div>
                <p className="text-sm text-gray-600 text-center">Details from bank statement</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-emerald-600 text-center">
                  KSh {bankTransaction?.amount?.toLocaleString('en-KE') || '0'}
                </p>
                <div className="flex justify-center mt-2">
                  <TransactionStatusBadge status={bankTransaction?.status || 'UNVERIFIED'} />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <p className="text-xs text-gray-500 text-center">Date</p>
                <p className="text-sm font-medium text-center">
                  {bankTransaction?.transactionDate ? new Date(bankTransaction.transactionDate).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 text-center">Reference</p>
                <p className="text-sm font-medium font-mono text-center">{bankTransaction?.bankReference || 'N/A'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-gray-500 text-center">Description</p>
                <div className="flex justify-center">
                  <TransactionWithIssue transaction={bankTransaction} />
                </div>
              </div>
            </div>
          </div>

          {/* Student Selection */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 text-center">Select Student</h4>
            <div className="relative max-w-2xl mx-auto">
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
          </div>

          {/* Payment Details */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 text-center">Payment Details</h4>
            <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1 text-center">
                  Amount (KSh)
                </label>
                <input
                  type="number"
                  id="paymentAmount"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center"
                  defaultValue={bankTransaction?.amount || ''}
                  min="0"
                  readOnly={!!bankTransaction}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1 text-center">
                  Payment Method
                </label>
                <select
                  id="paymentMethod"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center"
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
            
            <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1 text-center">
                  Payment Date
                </label>
                <input
                  type="date"
                  id="paymentDate"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center"
                  defaultValue={bankTransaction?.transactionDate ? new Date(bankTransaction.transactionDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1 text-center">
                  Notes (Optional)
                </label>
                <input
                  type="text"
                  id="paymentNotes"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center"
                  placeholder="Add any notes about this payment..."
                  defaultValue={bankTransaction?.notes || ''}
                />
              </div>
            </div>
          </div>

          {/* SMS Notification Options */}
          <div className="space-y-3 max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-900 text-center">SMS Notification</h4>
              <span className="text-xs text-gray-500 text-center">Send confirmation to parent</span>
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
      width: 900,
      customClass: {
        popup: 'rounded-2xl border border-gray-200 shadow-xl',
        title: 'text-lg font-bold flex items-center gap-2 justify-center',
        htmlContainer: 'text-center'
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
              <p className="text-amber-700 font-medium text-center">Student Validation Failed:</p>
              <p className="text-sm text-center">{validationResult.message}</p>
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

  // Process payment verification
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
    const issueInfo = extractIssueInfo(transaction);

    showModalWithLockedBackground({
      title: <div className="flex items-center gap-2 justify-center">
        <Eye className="w-6 h-6 text-gray-900" />
        <span>Transaction Details</span>
      </div>,
      html: (
        <div className="text-center space-y-6 max-w-4xl mx-auto">
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
              {issueInfo.hasIssue && (
                <IssueTypeBadge issueType={issueInfo.issueType} />
              )}
            </div>
          </div>

          {/* Transaction Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 text-center">Reference Number</p>
              <p className="text-sm font-mono font-medium text-center">{transaction.bankReference || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 text-center">Date</p>
              <p className="text-sm font-medium text-center">
                {transaction.transactionDate ? new Date(transaction.transactionDate).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-gray-500 text-center">Description</p>
              <div className="flex justify-center">
                <TransactionWithIssue transaction={transaction} />
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 text-center">Amount</p>
              <p className="text-xl font-bold text-gray-900 text-center">KSh {transaction.amount?.toLocaleString('en-KE') || '0'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 text-center">Payment Method</p>
              <div className="mt-1 flex justify-center">
                <PaymentMethodBadge
                  method={transaction.paymentMethod || getPaymentMethodFromBankTransaction(transaction.description)}
                />
              </div>
            </div>
          </div>

          {/* Duplicate Warning */}
          {issueInfo.issueType === 'DUPLICATE' && (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-start gap-3">
                <DatabaseIcon className="w-5 h-5 text-gray-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2 text-center">⚠️ Duplicate Transaction</h4>
                  <p className="text-sm text-gray-700 text-center">
                    This transaction was skipped during import because it already exists in the database.
                    Each transaction reference must be unique.
                  </p>
                </div>
              </div>
            </div>
          )}

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
              <p className="text-xs text-gray-500 mt-2 text-center">
                Sent on: {new Date(transaction.smsSentAt).toLocaleString()}
              </p>
            )}
          </div>

          {/* Show Issue Resolution section */}
          {issueInfo.hasIssue && transaction.status === 'UNVERIFIED' && issueInfo.issueType !== 'DUPLICATE' && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-800 mb-2 text-center">This transaction has validation issues</h4>
                  <p className="text-sm text-amber-700 mb-3 text-center">
                    To resolve this issue:
                  </p>
                  <ul className="text-sm text-amber-700 space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span>Edit the transaction manually to correct the information</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <User className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                      <span>Match it to the correct student manually</span>
                    </li>
                    {issueInfo.issueType === 'INVALID' && (
                      <li className="flex items-start gap-2">
                        <FileX className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                        <span>Fix the invalid data (e.g., correct date format, add missing fields)</span>
                      </li>
                    )}
                    {issueInfo.issueType === 'FORMAT' && (
                      <li className="flex items-start gap-2">
                        <Calendar className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
                        <span>Fix the format issue (e.g., correct date/amount format)</span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Student Information */}
          {student && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-gray-900 text-center">Student Information</h4>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    MySwal.close();
                    await handleViewTermAssignments(student);
                  }}
                  className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  View Term Assignments
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500 text-center">Student Name</p>
                  <p className="text-sm font-medium text-center">{student.fullName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 text-center">Class</p>
                  <p className="text-sm font-medium text-center">{student.grade}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 text-center">Term Status</p>
                  <p className="text-sm font-medium flex items-center gap-2 justify-center">
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
                  <p className="text-xs text-gray-500 text-center">Total Terms</p>
                  <p className="text-sm font-medium text-center">{student.termAssignmentCount || 0}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      ),
      width: 900,
      showConfirmButton: false,
      showCloseButton: true,
      customClass: {
        popup: 'rounded-2xl border border-gray-200 shadow-xl',
        title: 'text-lg font-bold flex items-center gap-2 justify-center',
        htmlContainer: 'text-center'
      }
    });
  };

  // Handle bulk verification
  const handleBulkVerify = async () => {
    const selectedBankTransactions = bankStatements.filter(stmt =>
      selectedTransactions.includes(stmt.id) &&
      (stmt.status === 'UNVERIFIED' || stmt.status === 'PENDING')
    );

    if (selectedBankTransactions.length === 0) {
      showErrorAlert('No Selection', 'Please select unmatched bank transactions to verify.');
      return;
    }

    // Check if any selected transactions have validation issues
    const transactionsWithIssues = selectedBankTransactions.filter(t => {
      const issueInfo = extractIssueInfo(t);
      return issueInfo.hasIssue && issueInfo.issueType !== 'DUPLICATE';
    });

    if (transactionsWithIssues.length > 0) {
      const result = await showWarningAlert(
        'Transactions with Issues',
        `${transactionsWithIssues.length} of the selected transactions have validation issues. These should be fixed before verification.`,
        {
          text: 'View Issues',
          color: '#f59e0b'
        }
      );

      if (result.isConfirmed) {
        const issuesHtml = `
          <div class="text-center space-y-3 max-w-4xl mx-auto">
            <h4 class="font-semibold text-amber-800 mb-2 text-center">Transactions with Issues:</h4>
            <div class="space-y-2 max-h-60 overflow-y-auto">
              ${transactionsWithIssues.slice(0, 10).map((transaction, index) => {
                const issueInfo = extractIssueInfo(transaction);
                return `
                  <div key="${index}" class="p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <p class="font-medium text-gray-900 text-center">
                      ${transaction.bankReference} - KSh ${transaction.amount?.toLocaleString('en-KE')}
                    </p>
                    <p class="text-sm text-amber-700 mt-1 text-center">
                      ${issueInfo.issueMessage}
                    </p>
                    <p class="text-xs text-gray-500 mt-1 text-center">
                      ${issueInfo.originalDescription}
                    </p>
                  </div>
                `;
              }).join('')}
            </div>
            ${transactionsWithIssues.length > 10 ? `
              <p class="text-sm text-gray-500 text-center">
                Showing 10 of ${transactionsWithIssues.length} transactions with issues
              </p>
            ` : ''}
          </div>
        `;

        await MySwal.fire({
          title: <div className="flex items-center gap-2 justify-center">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
            <span>Fix Issues Before Verification</span>
          </div>,
          html: issuesHtml,
          showConfirmButton: true,
          confirmButtonText: 'Understood',
          confirmButtonColor: '#3b82f6',
          width: 800,
          customClass: {
            popup: 'rounded-2xl border border-gray-200 shadow-xl',
            title: 'text-lg font-bold flex items-center gap-2 justify-center',
            htmlContainer: 'text-center'
          }
        });
        
        return;
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

  // Format amount
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

  // Calculate issue statistics for unmatched tab
  const issueStatistics = useMemo(() => {
    const unmatchedTransactions = bankStatements.filter(stmt => 
      stmt.status === 'UNVERIFIED' || stmt.status === 'PENDING'
    );
    
    return unmatchedTransactions.reduce((stats, transaction) => {
      const issueInfo = extractIssueInfo(transaction);
      if (issueInfo.hasIssue) {
        stats.total++;
        stats.byType[issueInfo.issueType] = (stats.byType[issueInfo.issueType] || 0) + 1;
      } else {
        stats.noIssue++;
      }
      return stats;
    }, { total: 0, noIssue: 0, byType: {} });
  }, [bankStatements]);

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
              onClick={handleImportFile}
              className="flex items-center justify-center gap-2 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-3 rounded-xl shadow-lg shadow-blue-400/20 hover:shadow-xl hover:shadow-blue-400/30 transition-all"
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
                  <h3 className="font-semibold text-blue-900 text-center">Bulk Student Validation</h3>
                  <p className="text-sm text-blue-700 text-center">
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

      {/* Issue Statistics for Unmatched Tab */}
      {activeTab === 'unverified' && issueStatistics.total > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="p-4 bg-linear-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-amber-900 text-center">Transactions with Issues</h3>
                  <p className="text-sm text-amber-700 text-center">
                    {issueStatistics.total} transaction{issueStatistics.total !== 1 ? 's' : ''} have validation issues that need attention
                  </p>
                </div>
              </div>
              <div className="px-3 py-1.5 bg-amber-100 text-amber-800 rounded-lg text-sm font-medium">
                Imported with Issues
              </div>
            </div>
            
            <div className="grid grid-cols-5 gap-3">
              <div className="p-3 bg-white rounded-lg border border-amber-100">
                <p className="text-xs text-gray-500 text-center">Total Issues</p>
                <p className="text-xl font-bold text-amber-800 text-center">{issueStatistics.total}</p>
              </div>
              {Object.entries(issueStatistics.byType).map(([type, count]) => (
                <div key={type} className={`p-3 bg-white rounded-lg border ${
                  type === 'DUPLICATE' ? 'border-gray-100 text-gray-800' :
                  type === 'INVALID' ? 'border-rose-100 text-rose-800' :
                  type === 'FORMAT' ? 'border-purple-100 text-purple-800' :
                  'border-amber-100 text-amber-800'
                }`}>
                  <p className="text-xs text-gray-500 text-center">
                    {type === 'DUPLICATE' ? 'Duplicate' :
                     type === 'INVALID' ? 'Invalid' :
                     type === 'FORMAT' ? 'Format' :
                     'Unmatched'}
                  </p>
                  <p className="text-xl font-bold text-center">{count}</p>
                </div>
              ))}
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
              {activeTab === 'unverified' && tab.id === 'unverified' && issueStatistics.total > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center">
                  {issueStatistics.total}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Issue Filter for Unmatched Tab */}
      {activeTab === 'unverified' && issueStatistics.total > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex flex-wrap items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700 text-center">Filter by Issue Type:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setIssueFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  issueFilter === 'ALL'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                All Issues ({issueStatistics.total})
              </button>
              {Object.entries(issueStatistics.byType).map(([type, count]) => (
                <button
                  key={type}
                  onClick={() => setIssueFilter(type)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    issueFilter === type
                      ? type === 'DUPLICATE' ? 'bg-gray-600 text-white' :
                        type === 'INVALID' ? 'bg-rose-600 text-white' :
                        type === 'FORMAT' ? 'bg-purple-600 text-white' :
                        'bg-amber-600 text-white'
                      : type === 'DUPLICATE' ? 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100' :
                        type === 'INVALID' ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100' :
                        type === 'FORMAT' ? 'bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100' :
                        'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  {type === 'DUPLICATE' && <DatabaseIcon className="w-3 h-3" />}
                  {type === 'INVALID' && <FileX className="w-3 h-3" />}
                  {type === 'FORMAT' && <Calendar className="w-3 h-3" />}
                  {type === 'UNMATCHED' && <User className="w-3 h-3" />}
                  {type === 'DUPLICATE' ? 'Duplicate' :
                   type === 'INVALID' ? 'Invalid' :
                   type === 'FORMAT' ? 'Format' :
                   'Unmatched'} ({count})
                </button>
              ))}
              <button
                onClick={() => setIssueFilter('NO_ISSUE')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  issueFilter === 'NO_ISSUE'
                    ? 'bg-gray-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                No Issues ({issueStatistics.noIssue || 0})
              </button>
            </div>
          </div>
        </motion.div>
      )}

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
                {activeTab === 'unverified' && issueFilter !== 'ALL' && (
                  <span className="ml-2 font-medium">
                    • Showing {issueFilter === 'INVALID' ? 'Invalid' :
                              issueFilter === 'UNMATCHED' ? 'Unmatched' :
                              issueFilter === 'FORMAT' ? 'Format' :
                              'No Issue'} transactions
                  </span>
                )}
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
                    {/* Conditional Checkbox Column - Column 0 */}
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
                    {/* Transaction Details - Column 1/2 */}
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-62.5">
                      Transaction Details
                    </th>
                    {/* Amount & Method - Column 2/3 */}
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-45">
                      Amount & Method
                    </th>
                    {/* Status - Column 3/4 */}
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-40">
                      Status
                    </th>
                    {/* Issue Details / Student Match - Column 4/5 */}
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-55">
                      {activeTab === 'unverified' ? 'Issue Details' : 'Student Match'}
                    </th>
                    {/* Actions - Column 5/6 */}
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
                    const student = transaction.student;
                    const smsSent = transaction.smsSent || false;
                    const issueInfo = extractIssueInfo(transaction);

                    return (
                      <motion.tr
                        key={transaction.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        {/* Conditional Checkbox Column - Column 0 */}
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
                        
                        {/* Transaction Details Column - Column 1/2 */}
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <div className="flex items-start gap-3">
                              <Banknote className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {issueInfo.originalDescription || 'No description'}
                                </p>
                              </div>
                            </div>
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
                            </div>
                          </div>
                        </td>
                        
                        {/* Amount & Method Column - Column 2/3 */}
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
                        
                        {/* Status Column - Column 3/4 */}
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
                            {issueInfo.hasIssue && (
                              <div className="mt-2">
                                <IssueTypeBadge issueType={issueInfo.issueType} />
                              </div>
                            )}
                          </div>
                        </td>
                        
                        {/* Issue Details / Student Match Column - Column 4/5 */}
                        <td className="px-6 py-4">
                          {activeTab === 'unverified' && issueInfo.hasIssue ? (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold text-gray-900">
                                  {issueInfo.issueType === 'INVALID' ? 'Invalid Transaction' :
                                   issueInfo.issueType === 'FORMAT' ? 'Format Issue' :
                                   'Unmatched Transaction'}
                                </p>
                                {issueInfo.issueType === 'INVALID' && (
                                  <span className="text-xs font-medium text-rose-700">⚠️ Requires Fixing</span>
                                )}
                              </div>
                              
                              {/* Show the full issue description */}
                              <div className={`p-3 rounded-lg border ${
                                issueInfo.issueType === 'INVALID' ? 'bg-rose-50 border-rose-200' :
                                issueInfo.issueType === 'FORMAT' ? 'bg-purple-50 border-purple-200' :
                                'bg-amber-50 border-amber-200'
                              }`}>
                                <div className="flex items-start gap-3">
                                  <div className={`p-1.5 rounded-md bg-white border ${
                                    issueInfo.issueType === 'INVALID' ? 'border-rose-200' :
                                    issueInfo.issueType === 'FORMAT' ? 'border-purple-200' :
                                    'border-amber-200'
                                  }`}>
                                    {issueInfo.issueType === 'INVALID' ? (
                                      <FileX className="w-4 h-4 text-rose-600" />
                                    ) : issueInfo.issueType === 'FORMAT' ? (
                                      <Calendar className="w-4 h-4 text-purple-600" />
                                    ) : (
                                      <User className="w-4 h-4 text-amber-600" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 mb-1">{issueInfo.issueMessage}</p>
                                    {transaction.notes && (
                                      <p className="text-xs text-gray-600 mt-1">{transaction.notes}</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              {issueInfo.issueType === 'INVALID' && (
                                <div className="mt-2 p-2 bg-rose-50 rounded border border-rose-200">
                                  <p className="text-xs text-rose-700 font-medium">
                                    Fix required before matching
                                  </p>
                                  <p className="text-xs text-rose-600 mt-1">
                                    Edit transaction to fix the issue
                                  </p>
                                </div>
                              )}
                            </div>
                          ) : student ? (
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
                        
                        {/* Actions Column - Column 5/6 */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {/* Case 1: Unverified transactions */}
                            {isUnverified && (
                              <>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleEditPaymentRecord(transaction, true)}
                                  className={`p-2 rounded-lg transition-colors ${
                                    issueInfo.hasIssue && issueInfo.issueType === 'INVALID'
                                      ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 cursor-not-allowed opacity-50'
                                      : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                  }`}
                                  title={
                                    issueInfo.hasIssue && issueInfo.issueType === 'INVALID'
                                      ? 'Fix issue before matching'
                                      : 'Verify Payment'
                                  }
                                  disabled={issueInfo.hasIssue && issueInfo.issueType === 'INVALID'}
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
                      {activeTab === 'unverified' && issueFilter !== 'ALL' ? (
                        <Filter className="w-8 h-8 text-gray-400" />
                      ) : (
                        <Search className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {activeTab === 'unverified' && issueFilter !== 'ALL'
                        ? `No ${issueFilter === 'INVALID' ? 'Invalid' : 
                            issueFilter === 'UNMATCHED' ? 'Unmatched' : 
                            issueFilter === 'FORMAT' ? 'Format' : 
                            'No Issue'} transactions found`
                        : 'No transactions found'}
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-6">
                      {activeTab === 'unverified'
                        ? issueFilter !== 'ALL'
                          ? `No ${issueFilter.toLowerCase()} transactions match your current filters. Try changing the issue filter or search query.`
                          : 'All bank transactions have been processed. Import new bank statements to see more.'
                        : activeTab === 'matched'
                        ? 'No auto-matched transactions found. The system will auto-match transactions during import.'
                        : activeTab === 'verified'
                        ? 'No verified payments found. Verify some unmatched transactions to see them here.'
                        : 'No transactions match your current search criteria.'}
                    </p>
                    {activeTab === 'unverified' && issueFilter !== 'ALL' && (
                      <button
                        onClick={() => setIssueFilter('ALL')}
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                      >
                        <Filter className="w-4 h-4" />
                        Show All Transactions
                      </button>
                    )}
                    {activeTab === 'unverified' && issueFilter === 'ALL' && (
                      <button
                        onClick={handleImportFile}
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
    </div>
  );
};

export default Transactions;