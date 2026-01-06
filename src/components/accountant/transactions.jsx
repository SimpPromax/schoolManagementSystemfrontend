/* eslint-disable no-prototype-builtins */
/* eslint-disable no-unused-vars */
import React, { useState, useMemo, useEffect } from 'react';
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
  AlertCircle as AlertCircleIcon
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

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
  const desc = description.toLowerCase();
  if (desc.includes('upi') || desc.includes('qr')) return 'upi';
  if (desc.includes('neft') || desc.includes('rtgs') || desc.includes('imps')) return 'bank';
  if (desc.includes('card')) return 'card';
  if (desc.includes('cash')) return 'cash';
  return 'bank'; // default to bank transfer
};

const PaymentMethodBadge = ({ method }) => {
  const config = {
    online: { label: 'Online', color: 'bg-blue-100 text-blue-800 border border-blue-200', icon: CreditCard },
    card: { label: 'Card', color: 'bg-emerald-100 text-emerald-800 border border-emerald-200', icon: Card },
    upi: { label: 'UPI', color: 'bg-purple-100 text-purple-800 border border-purple-200', icon: QrCode },
    cash: { label: 'Cash', color: 'bg-amber-100 text-amber-800 border border-amber-200', icon: Banknote },
    cheque: { label: 'Cheque', color: 'bg-gray-100 text-gray-800 border border-gray-200', icon: FileText },
    bank: { label: 'Bank Transfer', color: 'bg-indigo-100 text-indigo-800 border border-indigo-200', icon: FileSpreadsheet }
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
    unmatched: { label: 'Unmatched', color: 'bg-rose-100 text-rose-800 border-rose-200', icon: Unlink }
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

const Transactions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const studentIdParam = queryParams.get('student');
  
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState('today');
  const [paymentMethod, setPaymentMethod] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTransactions, setSelectedTransactions] = useState([]);
  const [viewMode, setViewMode] = useState('list');
  const [activeTab, setActiveTab] = useState('verified'); // 'verified', 'unverified', 'all'
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState(null);

  // Bank statement data (imported from bank)
  const [bankStatements, setBankStatements] = useState([
    {
      id: 'BANK001',
      date: '2025-03-20',
      description: 'UPI-ROHAN KUMAR-SCHOOL FEE',
      amount: 45000,
      reference: 'UPI123456789',
      bankAccount: 'XXXXXX1234',
      status: 'matched', // matched, unmatched, pending
      matchedStudentId: 1,
      matchedStudentName: 'Rohan Kumar',
      verified: true
    },
    {
      id: 'BANK002',
      date: '2025-03-20',
      description: 'NEFT-ANJALI SINGH-FEE PAYMENT',
      amount: 22500,
      reference: 'NEFT987654321',
      bankAccount: 'XXXXXX5678',
      status: 'matched',
      matchedStudentId: 2,
      matchedStudentName: 'Anjali Singh',
      verified: true
    },
    {
      id: 'BANK003',
      date: '2025-03-19',
      description: 'CASH DEPOSIT-PRIYA SHARMA',
      amount: 45000,
      reference: 'CASH001',
      bankAccount: 'XXXXXX9012',
      status: 'unmatched',
      matchedStudentId: null,
      matchedStudentName: null,
      verified: false
    },
    {
      id: 'BANK004',
      date: '2025-03-19',
      description: 'IMPS-VIKRAM PATEL-SCHOOL',
      amount: 30000,
      reference: 'IMPS456789',
      bankAccount: 'XXXXXX3456',
      status: 'unmatched',
      matchedStudentId: null,
      matchedStudentName: null,
      verified: false
    },
    {
      id: 'BANK005',
      date: '2025-03-18',
      description: 'UPI-ARJUN MEHTA-FEE',
      amount: 15000,
      reference: 'UPI789012345',
      bankAccount: 'XXXXXX7890',
      status: 'pending',
      matchedStudentId: 5,
      matchedStudentName: 'Arjun Mehta',
      verified: false
    }
  ]);

  // Student data
  const [students, setStudents] = useState([
    { 
      id: 1, 
      name: 'Rohan Kumar', 
      class: 'Grade 10A', 
      guardian: 'Mr. Kumar', 
      contact: '9876543210', 
      email: 'rohan@email.com', 
      totalFee: 45000, 
      dueDate: '2025-03-20',
      paid: 45000,
      pending: 0,
      status: 'paid',
      lastPayment: '2025-03-20',
      remindersSent: 0,
      lastReminder: null
    },
    { 
      id: 2, 
      name: 'Anjali Singh', 
      class: 'Grade 10A', 
      guardian: 'Mrs. Singh', 
      contact: '9876543211', 
      email: 'anjali@email.com', 
      totalFee: 45000, 
      dueDate: '2025-03-20',
      paid: 22500,
      pending: 22500,
      status: 'partial',
      lastPayment: '2025-03-20',
      remindersSent: 1,
      lastReminder: '2025-03-18'
    },
    { 
      id: 3, 
      name: 'Vikram Patel', 
      class: 'Grade 10B', 
      guardian: 'Mr. Patel', 
      contact: '9876543212', 
      email: 'vikram@email.com', 
      totalFee: 45000, 
      dueDate: '2025-03-10',
      paid: 0,
      pending: 45000,
      status: 'overdue',
      lastPayment: null,
      remindersSent: 3,
      lastReminder: '2025-03-20'
    },
    { 
      id: 4, 
      name: 'Priya Sharma', 
      class: 'Grade 11A', 
      guardian: 'Mrs. Sharma', 
      contact: '9876543213', 
      email: 'priya@email.com', 
      totalFee: 45000, 
      dueDate: '2025-03-20',
      paid: 45000,
      pending: 0,
      status: 'paid',
      lastPayment: '2025-03-19',
      remindersSent: 0,
      lastReminder: null
    },
    { 
      id: 5, 
      name: 'Arjun Mehta', 
      class: 'Grade 11B', 
      guardian: 'Mr. Mehta', 
      contact: '9876543214', 
      email: 'arjun@email.com', 
      totalFee: 45000, 
      dueDate: '2025-03-20',
      paid: 15000,
      pending: 30000,
      status: 'partial',
      lastPayment: '2025-03-18',
      remindersSent: 2,
      lastReminder: '2025-03-15'
    },
  ]);

  // Verified transactions (processed from bank statements)
  const [verifiedTransactions, setVerifiedTransactions] = useState([
    {
      id: 1,
      studentId: 1,
      studentName: 'Rohan Kumar',
      class: 'Grade 10A',
      amount: 45000,
      method: 'upi',
      date: '2025-03-20 14:30',
      receipt: 'RC-001',
      bankReference: 'BANK001',
      verified: true,
      verifiedBy: 'Admin',
      verifiedDate: '2025-03-20 15:00',
      smsSent: true,
      smsDate: '2025-03-20 15:05',
      notes: 'Full payment received via UPI'
    },
    {
      id: 2,
      studentId: 2,
      studentName: 'Anjali Singh',
      class: 'Grade 10A',
      amount: 22500,
      method: 'bank',
      date: '2025-03-20 12:45',
      receipt: 'RC-002',
      bankReference: 'BANK002',
      verified: true,
      verifiedBy: 'Admin',
      verifiedDate: '2025-03-20 13:15',
      smsSent: true,
      smsDate: '2025-03-20 13:20',
      notes: 'Partial payment - 1st installment via NEFT'
    }
  ]);

  // Filter transactions based on active tab
  const filteredTransactions = useMemo(() => {
    let transactions = [];
    
    if (activeTab === 'verified') {
      transactions = verifiedTransactions;
    } else if (activeTab === 'unverified') {
      transactions = bankStatements.filter(stmt => !stmt.verified);
    } else {
      transactions = [...verifiedTransactions, ...bankStatements];
    }
    
    // Filter by student if studentId param exists
    if (studentIdParam) {
      transactions = transactions.filter(t => t.studentId === parseInt(studentIdParam));
    }
    
    // Apply other filters
    return transactions.filter(transaction => {
      const matchesSearch = searchQuery === '' || 
        [transaction.studentName, transaction.description, transaction.reference, transaction.bankReference]
          .some(field => field?.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesSearch;
    });
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
      // Simulate parsing CSV/Excel file
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Parse the file (in real app, you'd use PapaParse or similar)
      const newStatements = [
        {
          id: `BANK${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          description: `NEW IMPORT - ${file.name}`,
          amount: Math.floor(Math.random() * 50000) + 10000,
          reference: `REF${Math.floor(Math.random() * 1000000)}`,
          bankAccount: 'XXXXXX0000',
          status: 'unmatched',
          matchedStudentId: null,
          matchedStudentName: null,
          verified: false
        }
      ];
      
      setBankStatements(prev => [...newStatements, ...prev]);
      setShowImportModal(false);
      setImportFile(null);
      
      showSuccessAlert(
        'File Imported!',
        `Successfully imported ${newStatements.length} transactions from bank statement.`
      );
      
    } catch (error) {
      showErrorAlert('Import Failed', 'Failed to import bank statement file.');
    } finally {
      setIsLoading(false);
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
                <p className="text-sm font-medium">{bankTransaction?.date || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Reference</p>
                <p className="text-sm font-medium font-mono">{bankTransaction?.reference || 'N/A'}</p>
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
                defaultValue={bankTransaction?.matchedStudentId || ""}
              >
                <option value="">Search and select student...</option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.name} ({student.class}) - Parent: {student.guardian} - Pending: ₹{student.pending.toLocaleString()}
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
                  <p className="text-xs font-medium">{student.name}</p>
                  <p className="text-xs text-gray-500">Pending: ₹{student.pending.toLocaleString()}</p>
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
                  <option value="online">Online Banking</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="upi">UPI</option>
                  <option value="cash">Cash</option>
                  <option value="cheque">Cheque</option>
                  <option value="bank">Bank Transfer</option>
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
                  defaultValue={bankTransaction?.date || new Date().toISOString().split('T')[0]}
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
                  Dear Parent, payment of ₹{bankTransaction?.amount?.toLocaleString() || '0'} received for {bankTransaction?.matchedStudentName || 'Student'}. Receipt: RC-{String(verifiedTransactions.length + 1).padStart(3, '0')}. Thank you!
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
                <span className="font-medium">{bankTransaction?.reference || 'New'}</span>
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
          studentName: selectedStudent.name,
          guardianContact: selectedStudent.contact,
          amount: bankTransaction?.amount || parseFloat(document.getElementById('paymentAmount').value),
          method: document.getElementById('paymentMethod').value,
          date: document.getElementById('paymentDate').value,
          receipt: document.getElementById('receiptNumber').value,
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
      // 1. Update bank statement status
      if (bankTransaction && formValues.isNewMatch) {
        const updatedBankStatements = bankStatements.map(stmt => 
          stmt.id === bankTransaction.id 
            ? { 
                ...stmt, 
                status: 'matched',
                matchedStudentId: formValues.studentId,
                matchedStudentName: formValues.studentName,
                verified: true
              }
            : stmt
        );
        setBankStatements(updatedBankStatements);
      }

      // 2. Create verified transaction record
      const newTransaction = {
        id: verifiedTransactions.length + 1,
        studentId: formValues.studentId,
        studentName: formValues.studentName,
        class: students.find(s => s.id === formValues.studentId)?.class || '',
        amount: formValues.amount,
        method: formValues.method,
        date: `${formValues.date} ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`,
        receipt: formValues.receipt,
        bankReference: bankTransaction?.reference || 'N/A',
        verified: true,
        verifiedBy: 'Admin',
        verifiedDate: new Date().toLocaleString('en-IN'),
        smsSent: formValues.sendSMS,
        smsDate: formValues.sendSMS ? new Date().toLocaleString('en-IN') : null,
        notes: formValues.notes
      };

      setVerifiedTransactions(prev => [newTransaction, ...prev]);

      // 3. Update student data
      const updatedStudents = students.map(student => {
        if (student.id === formValues.studentId) {
          const newPaidAmount = student.paid + formValues.amount;
          const newPendingAmount = Math.max(0, student.totalFee - newPaidAmount);
          
          let newStatus = student.status;
          if (newPendingAmount <= 0) {
            newStatus = 'paid';
          } else if (newPaidAmount > 0) {
            newStatus = 'partial';
          }
          
          // Check if overdue
          const today = new Date();
          const dueDate = new Date(student.dueDate);
          if (newStatus !== 'paid' && today > dueDate) {
            newStatus = 'overdue';
          }
          
          return {
            ...student,
            paid: newPaidAmount,
            pending: newPendingAmount,
            status: newStatus,
            lastPayment: new Date().toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            })
          };
        }
        return student;
      });

      setStudents(updatedStudents);

      // 4. Send SMS if requested
      if (formValues.sendSMS) {
        await sendPaymentConfirmationSMS(
          formValues.guardianContact,
          formValues.studentName,
          formValues.amount,
          formValues.receipt
        );
      }

      showSuccessAlert(
        'Payment Verified Successfully!',
        `Payment of ₹${formValues.amount.toLocaleString()} verified for ${formValues.studentName}. ${
          formValues.sendSMS ? 'SMS confirmation sent to parent.' : ''
        }`
      );

    } catch (error) {
      showErrorAlert(
        'Verification Failed',
        'There was an error processing the payment verification.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Send SMS confirmation
  const sendPaymentConfirmationSMS = async (contact, studentName, amount, receipt) => {
    try {
      // Simulate API call to SMS gateway
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const smsMessage = `Dear Parent, payment of ₹${amount.toLocaleString()} received for ${studentName}. Receipt: ${receipt}. Thank you! - School`;
      
      console.log('SMS sent to', contact, ':', smsMessage);
      
      return true;
    } catch (error) {
      console.error('Failed to send SMS:', error);
      return false;
    }
  };

  // Handle view transaction details
  const handleViewTransactionDetails = (transaction) => {
    const isBankTransaction = transaction.hasOwnProperty('bankAccount');
    const student = isBankTransaction 
      ? students.find(s => s.id === transaction.matchedStudentId)
      : getStudentData(transaction.studentId);

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
            <TransactionStatusBadge status={isBankTransaction ? transaction.status : 'verified'} />
          </div>

          {/* Transaction Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Reference Number</p>
              <p className="text-sm font-mono font-medium">{transaction.reference || transaction.bankReference}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Date</p>
              <p className="text-sm font-medium">{transaction.date}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-gray-500">Description</p>
              <p className="text-sm font-medium">{transaction.description || transaction.receipt}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Amount</p>
              <p className="text-xl font-bold text-gray-900">₹{transaction.amount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Payment Method</p>
              <div className="mt-1">
                <PaymentMethodBadge 
                  method={isBankTransaction 
                    ? getPaymentMethodFromBankTransaction(transaction.description)
                    : transaction.method
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
                  <p className="text-sm font-medium">{student.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Class</p>
                  <p className="text-sm font-medium">{student.class}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Guardian</p>
                  <p className="text-sm font-medium">{student.guardian}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Contact</p>
                  <p className="text-sm font-medium">{student.contact}</p>
                </div>
              </div>
            </div>
          )}

          {/* Additional Info */}
          {transaction.verifiedBy && (
            <div className="text-sm text-gray-600">
              <p>Verified by: {transaction.verifiedBy}</p>
              <p>Verified on: {transaction.verifiedDate}</p>
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
      selectedTransactions.includes(stmt.id) && !stmt.verified
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
        // For each selected transaction, process verification
        for (const transaction of selectedBankTransactions) {
          // Find a likely student match based on description
          const likelyStudent = students.find(student => 
            transaction.description.toLowerCase().includes(student.name.toLowerCase().split(' ')[0])
          );
          
          if (likelyStudent) {
            const formValues = {
              studentId: likelyStudent.id,
              studentName: likelyStudent.name,
              guardianContact: likelyStudent.contact,
              amount: transaction.amount,
              method: getPaymentMethodFromBankTransaction(transaction.description),
              date: transaction.date,
              receipt: `RC-${String(verifiedTransactions.length + 1).padStart(3, '0')}`,
              notes: 'Auto-verified from bank statement',
              sendSMS: true,
              bankTransactionId: transaction.id,
              isNewMatch: true
            };
            
            await processPaymentVerification(formValues, transaction);
          }
        }
        
        setSelectedTransactions([]);
        
      } catch (error) {
        showErrorAlert('Bulk Verification Failed', 'There was an error verifying multiple payments.');
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
    const currentTransactions = filteredTransactions.filter(t => !t.verified);
    if (selectedTransactions.length === currentTransactions.length) {
      setSelectedTransactions([]);
    } else {
      setSelectedTransactions(currentTransactions.map(t => t.id));
    }
  };

  // Statistics
  const stats = useMemo(() => {
    const unverifiedCount = bankStatements.filter(stmt => !stmt.verified).length;
    const verifiedCount = verifiedTransactions.length;
    const totalAmount = verifiedTransactions.reduce((sum, t) => sum + t.amount, 0);
    const todayAmount = verifiedTransactions.filter(t => {
      const transactionDate = new Date(t.date);
      const today = new Date();
      return transactionDate.toDateString() === today.toDateString();
    }).reduce((sum, t) => sum + t.amount, 0);
    
    return {
      unverifiedCount,
      verifiedCount,
      totalAmount: `₹${(totalAmount / 1000000).toFixed(2)}M`,
      todayAmount: `₹${(todayAmount / 1000).toFixed(1)}K`,
      matchRate: `${bankStatements.length > 0 ? ((verifiedCount / bankStatements.length) * 100).toFixed(1) : '0'}%`
    };
  }, [bankStatements, verifiedTransactions]);

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
              onClick={() => setIsLoading(!isLoading)}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-xl border border-gray-200 shadow-sm disabled:opacity-50 transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Processing...' : 'Refresh'}
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
            
            <div className="flex gap-2">
              <select
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="last7days">Last 7 Days</option>
                <option value="thismonth">This Month</option>
                <option value="all">All Time</option>
              </select>
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
                    .reduce((sum, stmt) => sum + stmt.amount, 0)
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
                        checked={selectedTransactions.length === filteredTransactions.filter(t => !t.verified).length && filteredTransactions.filter(t => !t.verified).length > 0}
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
                <th className="px6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
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
                const isBankTransaction = transaction.hasOwnProperty('bankAccount');
                const student = isBankTransaction 
                  ? students.find(s => s.id === transaction.matchedStudentId)
                  : getStudentData(transaction.studentId);
                
                // Determine transaction status
                const isVerified = transaction.verified || (!isBankTransaction);
                const isMatched = isBankTransaction && transaction.status === 'matched' && transaction.verified;
                const isUnverifiedBank = isBankTransaction && !transaction.verified;
                
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
                          disabled={transaction.verified}
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
                            {isBankTransaction ? transaction.description : transaction.receipt}
                          </p>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          <p>Date: {transaction.date}</p>
                          <p className="font-mono text-xs mt-1">
                            Ref: {transaction.reference || transaction.bankReference}
                          </p>
                          {isBankTransaction && (
                            <p className="text-xs text-gray-500">Acct: {transaction.bankAccount}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-lg font-bold text-gray-900">₹{transaction.amount.toLocaleString()}</p>
                        <PaymentMethodBadge 
                          method={isBankTransaction 
                            ? getPaymentMethodFromBankTransaction(transaction.description)
                            : transaction.method
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
                        status={isBankTransaction ? transaction.status : 'verified'} 
                      />
                      {!isBankTransaction && transaction.verifiedBy && (
                        <p className="text-xs text-gray-500 mt-1">
                          By {transaction.verifiedBy}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {student ? (
                        <div>
                          <p className="font-medium text-gray-900">{student.name}</p>
                          <p className="text-sm text-gray-600">{student.class}</p>
                          <p className="text-xs text-gray-500">{student.guardian}</p>
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
                          <VerifiedStatusIndicator isVerified={true} />
                        ) : 
                        /* Case 2: Matched bank transactions (still have action buttons) */
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
                              onClick={() => handleEditPaymentRecord(transaction, false)}
                              className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
                              title="View/Update Match"
                            >
                              <Link className="w-4 h-4" />
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
                              onClick={() => handleEditPaymentRecord(transaction, true)}
                              className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
                              title="Match to Student"
                            >
                              <Link className="w-4 h-4" />
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

      {/* Import Modal with Glasmorphic Background */}
      {showImportModal && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          {/* Glassmorphism Backdrop */}
          <div 
            className="absolute inset-0 bg-linear-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10 backdrop-blur-sm"
            onClick={() => setShowImportModal(false)}
          />
          
          {/* Glassmorphism Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="relative bg-white/80 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl w-full max-w-md overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.75) 100%)',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            }}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-white/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-linear-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-xl">
                    <Upload className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Import Bank Statement</h3>
                    <p className="text-sm text-gray-600 mt-1">Upload your bank statement file</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowImportModal(false)}
                  className="p-2 hover:bg-white/50 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Upload Area */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative border-2 border-dashed border-blue-300/50 bg-linear-to-br from-blue-50/50 to-blue-100/30 backdrop-blur-sm rounded-2xl p-8 text-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.05) 100%)',
                }}
              >
                <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-purple-500/5 rounded-2xl" />
                
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-2xl mb-4">
                    <Upload className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-2">
                    Drop your bank statement here
                  </p>
                  <p className="text-xs text-gray-600 mb-4">
                    Supports CSV, Excel, or PDF files
                  </p>
                  
                  <div className="relative">
                    <input
                      type="file"
                      accept=".csv,.xlsx,.xls,.pdf"
                      onChange={(e) => setImportFile(e.target.files[0])}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center gap-2 bg-linear-to-r from-blue-600 to-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-blue-500/25"
                    >
                      <Upload className="w-4 h-4" />
                      Choose File
                    </motion.div>
                  </div>
                  
                  {importFile && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-3 bg-white/80 backdrop-blur-sm rounded-xl border border-emerald-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-emerald-600" />
                          <span className="text-sm font-medium text-gray-900 truncate max-w-50">
                            {importFile.name}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {(importFile.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
              
              {/* Tips Section */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="p-4 bg-linear-to-br from-blue-50/60 to-blue-100/40 backdrop-blur-sm rounded-2xl border border-blue-200/50"
              >
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                  <h4 className="text-sm font-semibold text-blue-900">Import Tips</h4>
                </div>
                <ul className="space-y-2">
                  {[
                    "Ensure file contains date, amount, and description columns",
                    "Remove header rows before uploading",
                    "CSV files should be comma-separated",
                    "Maximum file size: 10MB",
                    "Supported formats: CSV, Excel (xlsx, xls), PDF"
                  ].map((tip, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * index }}
                      className="flex items-start gap-2"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5" />
                      <span className="text-xs text-blue-800">{tip}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
              
              {/* File Requirements */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-700">Required Columns</span>
                  <span className="text-xs text-gray-500">Case insensitive</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {["Date", "Amount", "Description"].map((col) => (
                    <div
                      key={col}
                      className="bg-white/60 backdrop-blur-sm py-1.5 px-2 rounded-lg text-center text-xs font-medium text-gray-700 border border-gray-200/50"
                    >
                      {col}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="p-6 border-t border-white/20 bg-linear-to-r from-transparent via-white/30 to-transparent">
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowImportModal(false)}
                  className="flex-1 px-4 py-3 bg-white/60 hover:bg-white/80 text-gray-700 rounded-xl border border-gray-300/50 backdrop-blur-sm transition-all text-sm font-medium"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleUpload(importFile)}
                  disabled={!importFile || isLoading}
                  className="flex-1 px-4 py-3 bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Importing...
                    </span>
                  ) : (
                    'Import File'
                  )}
                </motion.button>
              </div>
              
              {/* Processing Info */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-linear-to-r from-blue-50/50 to-blue-100/30 backdrop-blur-sm rounded-xl border border-blue-200/50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
                      <span className="text-sm font-medium text-blue-900">Processing file...</span>
                    </div>
                    <span className="text-xs text-blue-700">
                      This may take a moment
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Transactions;