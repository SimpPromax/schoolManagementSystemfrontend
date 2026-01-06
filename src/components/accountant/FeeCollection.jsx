/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useMemo, useEffect } from 'react';
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
  ExternalLink
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, ScatterChart, Scatter, ZAxis
} from 'recharts';
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

// Custom components
const FeeStatusBadge = ({ status }) => {
  const config = {
    paid: { label: 'Paid', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: CheckCircle },
    pending: { label: 'Pending', color: 'bg-amber-100 text-amber-800 border-amber-200', icon: Clock },
    overdue: { label: 'Overdue', color: 'bg-rose-100 text-rose-800 border-rose-200', icon: AlertTriangle },
    partial: { label: 'Partial', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Percent }
  };

  const { label, color, icon: Icon } = config[status] || config.pending;

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
    online: { label: 'Online', color: 'bg-blue-100 text-blue-800', icon: CreditCard },
    card: { label: 'Card', color: 'bg-emerald-100 text-emerald-800', icon: Card },
    upi: { label: 'UPI', color: 'bg-purple-100 text-purple-800', icon: QrCode },
    cash: { label: 'Cash', color: 'bg-amber-100 text-amber-800', icon: Banknote },
    cheque: { label: 'Cheque', color: 'bg-gray-100 text-gray-800', icon: FileText },
    bank: { label: 'Bank Transfer', color: 'bg-indigo-100 text-indigo-800', icon: FileSpreadsheet }
  };
  
  const { label, color, icon: Icon } = config[method] || config.online;
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${color}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
};

const StatCard = ({ label, value, icon: Icon, color, trend, change }) => {
  const trendColor = change >= 0 ? 'text-emerald-600' : 'text-rose-600';
  const trendIcon = change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />;
  
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

const FeeCollection = () => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedTerm, setSelectedTerm] = useState('Q1 2025');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState('overview');
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [activeTab, setActiveTab] = useState('students');
  const [dateRange, setDateRange] = useState('this_month');
  const [filterStatus, setFilterStatus] = useState('all');

  // Enhanced student data with payment history
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
      paid: 0,
      pending: 45000,
      status: 'pending',
      lastPayment: null,
      paymentHistory: [],
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
      paid: 0,
      pending: 45000,
      status: 'pending',
      lastPayment: null,
      paymentHistory: [],
      remindersSent: 0,
      lastReminder: null
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
      status: 'pending',
      lastPayment: null,
      paymentHistory: [],
      remindersSent: 0,
      lastReminder: null
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
      paid: 0,
      pending: 45000,
      status: 'pending',
      lastPayment: null,
      paymentHistory: [],
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
      paid: 0,
      pending: 45000,
      status: 'pending',
      lastPayment: null,
      paymentHistory: [],
      remindersSent: 0,
      lastReminder: null
    },
  ]);

  // Enhanced transactions data with complete payment history
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      studentId: 1,
      studentName: 'Rohan Kumar',
      class: 'Grade 10A',
      amount: 15000,
      method: 'online',
      date: '2025-03-15 14:30',
      receipt: 'RC-001',
      status: 'success',
      verified: true,
      verifiedBy: 'Admin',
      transactionId: 'TXN_001',
      notes: 'First installment - 1 of 3',
      installmentNumber: 1,
      feeBreakdown: [
        { category: 'Tuition', amount: 10000 },
        { category: 'Transport', amount: 3000 },
        { category: 'Activities', amount: 2000 }
      ]
    },
    {
      id: 2,
      studentId: 1,
      studentName: 'Rohan Kumar',
      class: 'Grade 10A',
      amount: 15000,
      method: 'upi',
      date: '2025-03-18 10:15',
      receipt: 'RC-002',
      status: 'success',
      verified: true,
      verifiedBy: 'System',
      transactionId: 'TXN_002',
      notes: 'Second installment - 2 of 3',
      installmentNumber: 2
    },
    {
      id: 3,
      studentId: 2,
      studentName: 'Anjali Singh',
      class: 'Grade 10A',
      amount: 22500,
      method: 'card',
      date: '2025-03-20 12:45',
      receipt: 'RC-003',
      status: 'success',
      verified: true,
      verifiedBy: 'Admin',
      transactionId: 'TXN_003',
      notes: 'Partial payment - 1st installment',
      installmentNumber: 1,
      feeBreakdown: [
        { category: 'Tuition', amount: 15000 },
        { category: 'Transport', amount: 4000 },
        { category: 'Activities', amount: 2000 },
        { category: 'Lab', amount: 1500 }
      ]
    },
    {
      id: 4,
      studentId: 4,
      studentName: 'Priya Sharma',
      class: 'Grade 11A',
      amount: 45000,
      method: 'upi',
      date: '2025-03-20 10:30',
      receipt: 'RC-004',
      status: 'success',
      verified: true,
      verifiedBy: 'System',
      transactionId: 'TXN_004',
      notes: 'Full payment via UPI'
    },
    {
      id: 5,
      studentId: 1,
      studentName: 'Rohan Kumar',
      class: 'Grade 10A',
      amount: 15000,
      method: 'cash',
      date: '2025-03-22 16:20',
      receipt: 'RC-005',
      status: 'success',
      verified: true,
      verifiedBy: 'Admin',
      transactionId: 'TXN_005',
      notes: 'Final installment - 3 of 3 - Full payment completed',
      installmentNumber: 3
    }
  ]);

  // Calculate student data from transactions whenever transactions change
  useEffect(() => {
    const calculateStudentData = () => {
      const updatedStudents = students.map(student => {
        // Get all transactions for this student
        const studentTransactions = transactions.filter(t => t.studentId === student.id);
        
        if (studentTransactions.length === 0) {
          return {
            ...student,
            paid: 0,
            pending: student.totalFee,
            status: 'pending',
            lastPayment: null,
            paymentHistory: []
          };
        }

        // Calculate total paid amount
        const totalPaid = studentTransactions.reduce((sum, t) => sum + t.amount, 0);
        
        // Calculate pending amount
        const pending = Math.max(0, student.totalFee - totalPaid);
        
        // Determine status
        let status = 'pending';
        if (pending <= 0) {
          status = 'paid';
        } else if (totalPaid > 0) {
          status = 'partial';
        }
        
        // Check if overdue
        const today = new Date();
        const dueDate = new Date(student.dueDate);
        if (status !== 'paid' && today > dueDate) {
          status = 'overdue';
        }
        
        // Sort transactions by date (newest first)
        const sortedTransactions = studentTransactions.sort((a, b) => 
          new Date(b.date) - new Date(a.date)
        );
        
        // Get last payment date
        const lastPayment = sortedTransactions.length > 0 
          ? sortedTransactions[0].date.split(' ')[0] // Get date part only
          : null;
        
        // Create payment history
        const paymentHistory = sortedTransactions.map(t => ({
          id: t.id,
          amount: t.amount,
          date: t.date,
          method: t.method,
          receipt: t.receipt,
          verifiedBy: t.verifiedBy,
          notes: t.notes,
          installmentNumber: t.installmentNumber
        }));
        
        return {
          ...student,
          paid: totalPaid,
          pending: pending,
          status: status,
          lastPayment: lastPayment,
          paymentHistory: paymentHistory
        };
      });
      
      setStudents(updatedStudents);
    };

    calculateStudentData();
  }, [transactions]);

  // Recent payments for dashboard display
  const recentPayments = useMemo(() => {
    return transactions
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
      .map(t => ({
        id: t.id,
        studentName: t.studentName,
        class: t.class,
        amount: t.amount,
        method: t.method,
        date: new Date(t.date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        receipt: t.receipt,
        status: t.status,
        installmentNumber: t.installmentNumber
      }));
  }, [transactions]);

  // Mock data - Fee analytics by class
  const classFeeAnalytics = useMemo(() => {
    const analytics = students.reduce((acc, student) => {
      const classKey = student.class;
      if (!acc[classKey]) {
        acc[classKey] = {
          class: classKey,
          totalStudents: 0,
          totalFee: 0,
          collected: 0,
          pending: 0
        };
      }
      
      acc[classKey].totalStudents += 1;
      acc[classKey].totalFee += student.totalFee;
      acc[classKey].collected += student.paid;
      acc[classKey].pending += student.pending;
      
      return acc;
    }, {});
    
    return Object.values(analytics).map(cls => ({
      ...cls,
      percentage: cls.totalFee > 0 ? Math.round((cls.collected / cls.totalFee) * 100) : 0,
      trend: Math.random() > 0.5 ? Math.floor(Math.random() * 10) : -Math.floor(Math.random() * 10)
    }));
  }, [students]);

  // Chart data
  const collectionTrendData = [
    { month: 'Jan', collected: 4500000, target: 5000000, overdue: 450000 },
    { month: 'Feb', collected: 5200000, target: 5000000, overdue: 320000 },
    { month: 'Mar', collected: 4800000, target: 5000000, overdue: 550000 },
    { month: 'Apr', collected: 5500000, target: 5500000, overdue: 280000 },
    { month: 'May', collected: 6000000, target: 5500000, overdue: 210000 },
    { month: 'Jun', collected: 5800000, target: 6000000, overdue: 390000 },
  ];

  const paymentMethodsData = useMemo(() => {
    const methods = {};
    transactions.forEach(t => {
      if (!methods[t.method]) {
        methods[t.method] = { count: 0, amount: 0 };
      }
      methods[t.method].count += 1;
      methods[t.method].amount += t.amount;
    });
    
    const totalTransactions = transactions.length;
    const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
    
    return Object.entries(methods).map(([method, data]) => {
      const config = {
        online: { name: 'Online Banking', color: '#3b82f6' },
        card: { name: 'Credit/Debit', color: '#10b981' },
        upi: { name: 'UPI', color: '#8b5cf6' },
        cash: { name: 'Cash', color: '#f59e0b' },
        cheque: { name: 'Cheque', color: '#6b7280' },
        bank: { name: 'Bank Transfer', color: '#8b5cf6' }
      };
      
      const methodConfig = config[method] || { name: method, color: '#6b7280' };
      
      return {
        name: methodConfig.name,
        value: Math.round((data.count / totalTransactions) * 100),
        color: methodConfig.color,
        transactions: data.count,
        amount: data.amount
      };
    });
  }, [transactions]);

  const overdueDistributionData = useMemo(() => {
    const overdueStudents = students.filter(s => s.status === 'overdue');
    
    // Calculate overdue ranges
    const today = new Date();
    const ranges = [
      { range: '1-7 days', min: 0, max: 7 },
      { range: '8-15 days', min: 8, max: 15 },
      { range: '16-30 days', min: 16, max: 30 },
      { range: '30+ days', min: 31, max: 365 }
    ];
    
    return ranges.map(range => {
      const studentsInRange = overdueStudents.filter(s => {
        const dueDate = new Date(s.dueDate);
        const daysOverdue = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
        return daysOverdue >= range.min && daysOverdue <= range.max;
      });
      
      return {
        range: range.range,
        count: studentsInRange.length,
        amount: studentsInRange.reduce((sum, s) => sum + s.pending, 0)
      };
    });
  }, [students]);

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
  const handleViewAllTransactions = (student) => {
    const studentTransactions = transactions.filter(t => t.studentId === student.id);
    const totalPaid = studentTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalDue = student.totalFee - totalPaid;
    
    MySwal.fire({
      title: <span className="text-gray-900">Complete Payment History - {student.name}</span>,
      html: (
        <div className="text-left space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Student Summary */}
          <div className="p-4 bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-gray-900">{student.name}</h3>
                <p className="text-sm text-gray-600">{student.class} • {student.guardian}</p>
              </div>
              <FeeStatusBadge status={student.status} />
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <p className="text-xs text-gray-500">Total Fee</p>
                <p className="text-lg font-bold">₹{student.totalFee.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Total Paid</p>
                <p className="text-lg font-bold text-emerald-600">₹{totalPaid.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Pending</p>
                <p className="text-lg font-bold text-rose-600">₹{totalDue.toLocaleString()}</p>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-600">
                <span>Payment Progress</span>
                <span className="font-medium text-emerald-600">
                  {((totalPaid / student.totalFee) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(totalPaid / student.totalFee) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Transaction List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900">
                All Transactions ({studentTransactions.length})
              </h4>
            </div>
            
            {studentTransactions.length > 0 ? (
              <div className="space-y-3">
                {studentTransactions.map((transaction) => (
                  <div 
                    key={transaction.id} 
                    className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          transaction.method === 'online' ? 'bg-blue-100' :
                          transaction.method === 'card' ? 'bg-emerald-100' :
                          transaction.method === 'upi' ? 'bg-purple-100' :
                          transaction.method === 'cash' ? 'bg-amber-100' : 'bg-gray-100'
                        }`}>
                          {transaction.method === 'online' ? <CreditCard className="w-4 h-4 text-blue-600" /> :
                           transaction.method === 'card' ? <Card className="w-4 h-4 text-emerald-600" /> :
                           transaction.method === 'upi' ? <QrCode className="w-4 h-4 text-purple-600" /> :
                           transaction.method === 'cash' ? <Banknote className="w-4 h-4 text-amber-600" /> :
                           <FileText className="w-4 h-4 text-gray-600" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900">{transaction.receipt}</p>
                            {transaction.installmentNumber && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                Installment {transaction.installmentNumber}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">
                            {new Date(transaction.date).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{transaction.verifiedBy}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">₹{transaction.amount.toLocaleString()}</p>
                        <PaymentMethodBadge method={transaction.method} />
                      </div>
                    </div>
                    
                    {transaction.notes && (
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <p className="text-xs text-gray-600">{transaction.notes}</p>
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

          {/* Payment Timeline */}
          {studentTransactions.length > 0 && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Payment Timeline</h4>
              <div className="space-y-4">
                {studentTransactions.map((transaction, index) => (
                  <div key={transaction.id} className="flex items-start">
                    <div className="flex flex-col items-center mr-4">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-emerald-500' : 'bg-blue-500'
                      }`} />
                      {index < studentTransactions.length - 1 && (
                        <div className="w-0.5 h-8 bg-gray-300 mt-1" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="font-medium text-gray-900">{transaction.receipt}</p>
                        <p className="text-sm font-bold">₹{transaction.amount.toLocaleString()}</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        {new Date(transaction.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">{transaction.method.toUpperCase()} • {transaction.verifiedBy}</p>
                      {transaction.notes && (
                        <p className="text-xs text-gray-500 mt-1">{transaction.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment Summary */}
          {studentTransactions.length > 0 && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Payment Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Number of Payments</span>
                  <span className="font-medium">{studentTransactions.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">First Payment</span>
                  <span className="font-medium">
                    {new Date(studentTransactions[studentTransactions.length - 1].date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Last Payment</span>
                  <span className="font-medium">
                    {new Date(studentTransactions[0].date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Payment Methods Used</span>
                  <span className="font-medium">
                    {[...new Set(studentTransactions.map(t => t.method))].join(', ')}
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
  };

  // Show recent payments popup
  const handleShowRecentPayments = (student) => {
    const studentTransactions = transactions.filter(t => t.studentId === student.id);
    
    if (studentTransactions.length === 0) {
      MySwal.fire({
        title: <span className="text-gray-900">No Payments</span>,
        html: (
          <div className="text-center py-6">
            <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-900 font-medium">No payments recorded</p>
            <p className="text-sm text-gray-600 mt-1">No transactions found for this student</p>
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
      return;
    }

    MySwal.fire({
      title: <span className="text-gray-900">Recent Payments - {student.name}</span>,
      html: (
        <div className="text-left space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="text-sm text-gray-600 mb-3">
            Showing {studentTransactions.length} transaction{studentTransactions.length > 1 ? 's' : ''}
          </div>
          
          {studentTransactions.slice(0, 5).map((transaction) => (
            <div 
              key={transaction.id} 
              className="p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3 text-gray-500" />
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(transaction.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                  {transaction.receipt}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PaymentMethodBadge method={transaction.method} />
                  {transaction.installmentNumber && (
                    <span className="text-xs text-gray-600">
                      Installment {transaction.installmentNumber}
                    </span>
                  )}
                </div>
                <span className="text-lg font-bold text-emerald-600">
                  ₹{transaction.amount.toLocaleString()}
                </span>
              </div>
              
              {transaction.notes && (
                <p className="text-xs text-gray-500 mt-2">{transaction.notes}</p>
              )}
            </div>
          ))}
          
          {studentTransactions.length > 5 && (
            <div className="text-center pt-2">
              <button
                onClick={() => {
                  MySwal.close();
                  handleViewAllTransactions(student);
                }}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                View all {studentTransactions.length} transactions →
              </button>
            </div>
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

  // Enhanced Email Reminder Function with Popup
  const handleEmailReminder = async (student) => {
    const { value: formValues } = await MySwal.fire({
      title: <span className="text-gray-900">Send Email Reminder</span>,
      html: (
        <div className="text-left space-y-6">
          {/* Student Information */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{student.name}</h3>
                <p className="text-sm text-gray-600">{student.class} • {student.guardian}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-rose-600">
                  Pending: ₹{student.pending.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">Due: {student.dueDate}</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm font-medium">{student.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Reminders Sent</p>
                <p className="text-sm font-medium">{student.remindersSent} times</p>
              </div>
            </div>
          </div>

          {/* Email Template Selection */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Select Email Template</h4>
            <div className="space-y-2">
              {[
                {
                  id: 'gentle',
                  title: 'Gentle Reminder',
                  description: 'Polite reminder about pending fee',
                  defaultSubject: 'Gentle Reminder: School Fee Pending',
                },
                {
                  id: 'due',
                  title: 'Due Date Reminder',
                  description: 'Urgent reminder about approaching due date',
                  defaultSubject: 'URGENT: Fee Due Date Approaching',
                },
                {
                  id: 'overdue',
                  title: 'Overdue Notice',
                  description: 'Formal notice for overdue payment',
                  defaultSubject: 'OVERDUE NOTICE: Immediate Action Required',
                },
                {
                  id: 'final',
                  title: 'Final Notice',
                  description: 'Final warning before further action',
                  defaultSubject: 'FINAL NOTICE: School Fee Overdue',
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
                    defaultChecked={template.id === 'gentle'}
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
                onClick={() => {
                  // Reset to default template
                }}
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
                  defaultValue={`Gentle Reminder: School Fee Pending for ${student.name}`}
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Message Body
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm min-h-37.5"
                  defaultValue={`Dear ${student.guardian},

This is a gentle reminder that the school fee for ${student.name} (${student.class}) is pending.

Payment Details:
• Total Fee: ₹${student.totalFee.toLocaleString()}
• Amount Paid: ₹${student.paid.toLocaleString()}
• Amount Due: ₹${student.pending.toLocaleString()}
• Due Date: ${student.dueDate}

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
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  className="rounded text-blue-600"
                />
                <span className="text-sm text-gray-700">
                  Send follow-up reminder in 3 days if not paid
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
        return {
          success: true,
          reminderCount: student.remindersSent + 1,
        };
      },
    });

    if (formValues && formValues.success) {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Update student's reminder count
        const updatedStudents = students.map(s => 
          s.id === student.id 
            ? { 
                ...s, 
                remindersSent: formValues.reminderCount, 
                lastReminder: new Date().toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                }) 
              }
            : s
        );
        
        setStudents(updatedStudents);
        
        showSuccessAlert(
          'Email Sent Successfully!',
          `Email reminder has been sent to ${student.guardian} (${student.email}). Total reminders sent: ${formValues.reminderCount}`
        );
        
        addNotification('success', `Email sent to ${student.guardian}`);
        
      } catch (error) {
        showErrorAlert('Failed to Send', 'There was an error sending the email. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Enhanced SMS Reminder Function with Popup
  const handleSMSReminder = async (student) => {
    const { value: formValues } = await MySwal.fire({
      title: <span className="text-gray-900">Send SMS Reminder</span>,
      html: (
        <div className="text-left space-y-6">
          {/* Student Information */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{student.name}</h3>
                <p className="text-sm text-gray-600">{student.class} • {student.guardian}</p>
              </div>
              <div className="text-right">
                <Phone className="w-5 h-5 text-gray-400 inline mr-1" />
                <span className="text-sm font-medium">{student.contact}</span>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500">SMS Balance</p>
                <p className="text-sm font-semibold text-emerald-600">1,245 SMS</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Previous SMS Sent</p>
                <p className="text-sm font-medium">{student.remindersSent} times</p>
              </div>
            </div>
          </div>

          {/* SMS Template Selection */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Select SMS Template</h4>
            <div className="space-y-2">
              {[
                {
                  id: 'gentle',
                  title: 'Gentle SMS',
                  content: `Dear parent, fee for ${student.name} is pending. Amount: ₹${student.pending}. Due: ${student.dueDate}. School Accounts`,
                  charCount: 120,
                },
                {
                  id: 'urgent',
                  title: 'Urgent SMS',
                  content: `URGENT: Fee for ${student.name} overdue. Pay ₹${student.pending} immediately. Last date: ${student.dueDate}. Contact school office.`,
                  charCount: 135,
                },
                {
                  id: 'quick',
                  title: 'Quick Reminder',
                  content: `Reminder: School fee pending for ${student.name}. Amount: ₹${student.pending}. Pay online: [payment-link]`,
                  charCount: 110,
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
                    defaultChecked={template.id === 'gentle'}
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
              defaultValue={`Dear ${student.guardian}, fee for ${student.name} (${student.class}) is pending. Amount due: ₹${student.pending}. Due date: ${student.dueDate}. Pay online or visit school office. School Accounts`}
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
        return {
          success: true,
          content: smsContent,
          reminderCount: student.remindersSent + 1,
        };
      },
    });

    if (formValues && formValues.success) {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Update student's reminder count
        const updatedStudents = students.map(s => 
          s.id === student.id 
            ? { 
                ...s, 
                remindersSent: formValues.reminderCount, 
                lastReminder: new Date().toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                }) 
              }
            : s
        );
        
        setStudents(updatedStudents);
        
        showSuccessAlert(
          'SMS Sent Successfully!',
          `SMS reminder has been sent to ${student.guardian} (${student.contact}). Delivery confirmation will be sent shortly.`
        );
        
        addNotification('success', `SMS sent to ${student.guardian}`);
        
      } catch (error) {
        showErrorAlert('Failed to Send', 'There was an error sending the SMS. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const sendBulkReminders = async () => {
    const selected = filteredStudents.filter(s => selectedStudents.includes(s.id));
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
              Total pending amount: ₹{selected.reduce((sum, s) => sum + s.pending, 0).toLocaleString()}
            </p>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Communication Channels
              </label>
              <div className="space-y-2">
                {[
                  { id: 'email', label: 'Email', icon: Mail },
                  { id: 'sms', label: 'SMS', icon: MessageSquare },
                  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
                  { id: 'app', label: 'In-app Notification', icon: Bell }
                ].map(channel => (
                  <label key={channel.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <input type="checkbox" defaultChecked={channel.id === 'email'} className="text-blue-600 rounded" />
                    <channel.icon className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">{channel.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reminder Type
              </label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option>Standard Reminder</option>
                <option>Overdue Notice</option>
                <option>Pre-due Reminder</option>
                <option>Installment Reminder</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Schedule
              </label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option>Send Now</option>
                <option>Schedule for Later</option>
                <option>Send Daily until Paid</option>
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
      }
    });

    if (formValues) {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        showSuccessAlert(
          'Bulk Reminders Sent!',
          `Reminders have been sent to ${selected.length} student${selected.length > 1 ? 's' : ''}`
        );
        addNotification('success', `Bulk reminders sent to ${selected.length} parents`);
        setSelectedStudents([]);
      } catch (error) {
        showErrorAlert('Operation Failed', 'There was an error sending bulk reminders.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleExportData = async (format) => {
    const result = await showConfirmDialog(
      'Export Data',
      `Export fee collection data to ${format === 'excel' ? 'Excel' : 'PDF'} format?`,
      `Export to ${format === 'excel' ? 'Excel' : 'PDF'}`,
      'Cancel'
    );
    
    if (result.isConfirmed) {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        showSuccessAlert(
          'Export Successful!',
          `Data has been exported to ${format === 'excel' ? 'Excel' : 'PDF'} format`
        );
      } catch (error) {
        showErrorAlert('Export Failed', 'There was an error exporting the data.');
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
              <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          
          {type === 'Class-wise Performance' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Classes
              </label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {classFeeAnalytics.map(cls => (
                  <label key={cls.class} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input type="checkbox" defaultChecked className="text-blue-600 rounded" />
                    <span className="text-sm">{cls.class}</span>
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
              <option>Detailed Report</option>
              <option>Summary Report</option>
              <option>With Charts</option>
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
      }
    });

    if (formValues) {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 3000));
        showSuccessAlert(
          'Report Generated!',
          `Your ${type} report has been generated successfully.`
        );
      } catch (error) {
        showErrorAlert('Generation Failed', 'There was an error generating the report.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Filter students
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = searchQuery === '' || 
        [student.name, student.guardian, student.class, student.email, student.contact]
          .some(field => field.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesClass = selectedClass === 'All' || student.class === selectedClass;
      
      const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
      
      return matchesSearch && matchesClass && matchesStatus;
    });
  }, [searchQuery, selectedClass, filterStatus, students]);

  // Statistics
  const stats = useMemo(() => {
    const totalCollected = students.reduce((sum, student) => sum + student.paid, 0);
    const totalPending = students.reduce((sum, student) => sum + student.pending, 0);
    const totalFee = students.reduce((sum, student) => sum + student.totalFee, 0);
    const paidCount = students.filter(s => s.status === 'paid').length;
    const overdueCount = students.filter(s => s.status === 'overdue').length;
    const partialCount = students.filter(s => s.status === 'partial').length;
    const remindersSent = students.reduce((sum, s) => sum + s.remindersSent, 0);
    
    // Students with multiple payments
    const studentsWithMultiplePayments = students.filter(student => {
      const studentTransactions = transactions.filter(t => t.studentId === student.id);
      return studentTransactions.length > 1;
    }).length;
    
    // Average payments per student
    const avgPaymentsPerStudent = students.length > 0 
      ? (transactions.length / students.length).toFixed(1)
      : '0';
    
    return {
      totalCollected: `₹${(totalCollected / 1000000).toFixed(2)}M`,
      totalPending: `₹${(totalPending / 1000).toFixed(0)}K`,
      totalFee: `₹${(totalFee / 1000000).toFixed(2)}M`,
      collectionRate: `${totalFee > 0 ? ((totalCollected / totalFee) * 100).toFixed(1) : '0'}%`,
      paidCount,
      overdueCount,
      partialCount,
      collectionTrend: '+12.5%',
      pendingTrend: '-8.2%',
      remindersSent,
      multiplePayments: studentsWithMultiplePayments,
      avgPayments: avgPaymentsPerStudent
    };
  }, [students, transactions]);

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
      action: () => handleGenerateReport('Monthly Collection')
    },
    { 
      icon: Printer, 
      label: 'Print Receipts', 
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      action: () => showSuccessAlert('Print Started', 'Receipts are being sent to printer.') 
    },
    { 
      icon: Download, 
      label: 'Export Excel', 
      color: 'bg-gradient-to-br from-amber-500 to-amber-600',
      action: () => handleExportData('excel')
    },
    {
      icon: ArrowRight,
      label: 'View Transactions',
      color: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
      action: () => navigate('/accountant/fees/transactions')
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
      setSelectedStudents(filteredStudents.map(s => s.id));
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
              onClick={() => setIsLoading(!isLoading)}
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

      {/* Quick Stats - Enhanced */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8"
      >
        <StatCard
          label="Total Collected"
          value={stats.totalCollected}
          icon={DollarSign}
          color="bg-gradient-to-br from-blue-500 to-blue-600"
          trend="+12.5%"
          change={12.5}
        />
        <StatCard
          label="Collection Rate"
          value={stats.collectionRate}
          icon={Percent}
          color="bg-gradient-to-br from-emerald-500 to-emerald-600"
          trend="+2.3%"
          change={2.3}
        />
        <StatCard
          label="Paid Students"
          value={`${stats.paidCount}/${students.length}`}
          icon={UserCheck}
          color="bg-gradient-to-br from-green-500 to-green-600"
          trend="94%"
          change={94}
        />
        <StatCard
          label="Students with Multiple Payments"
          value={`${stats.multiplePayments}/${students.length}`}
          icon={Layers}
          color="bg-gradient-to-br from-purple-500 to-purple-600"
          trend="+5.2%"
          change={5.2}
        />
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Collection Trend Chart */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Collection Trend & Targets</h2>
              <p className="text-sm text-gray-600 mt-1">Monthly performance vs targets</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option>Last 6 Months</option>
                <option>Quarterly View</option>
                <option>Year-to-Date</option>
                <option>Full Year</option>
              </select>
              <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 px-3 py-2 hover:bg-blue-50 rounded-lg">
                <BarChart2 className="w-4 h-4" />
                Compare
              </button>
            </div>
          </div>
          
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
                tickFormatter={(value) => `₹${(value/1000000).toFixed(0)}M`}
              />
              <Tooltip 
                formatter={(value) => [`₹${(value/1000000).toFixed(2)}M`, 'Amount']}
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
        </motion.div>

        {/* Payment Methods & Overdue Distribution */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Payment Methods */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Payment Methods</h2>
              <PieChartIcon className="w-5 h-5 text-gray-400" />
            </div>
            
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
          </div>

          {/* Overdue Distribution */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Overdue Distribution</h2>
              <AlertTriangle className="w-5 h-5 text-rose-400" />
            </div>
            
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
                      style={{ width: `${(item.count / Math.max(...overdueDistributionData.map(d => d.count))) * 100}%` }}
                    />
                  </div>
                  <div className="text-right text-sm text-rose-600 font-medium">
                    ₹{item.amount.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Payments Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Recent Payments</h2>
            <p className="text-sm text-gray-600 mt-1">Latest fee payments received</p>
          </div>
          <Link 
            to="/accountant/fees/transactions"
            className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline flex items-center gap-1"
          >
            View All Transactions
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="space-y-3">
          {recentPayments.map((payment) => (
            <motion.div
              key={payment.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ x: 5 }}
              className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 hover:border-blue-200 transition-all cursor-pointer"
              onClick={() => navigate(`/accountant/fees/transactions`)}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${
                  payment.method === 'online' ? 'bg-blue-100' :
                  payment.method === 'card' ? 'bg-emerald-100' :
                  payment.method === 'upi' ? 'bg-purple-100' :
                  payment.method === 'cash' ? 'bg-amber-100' : 'bg-gray-100'
                }`}>
                  {payment.method === 'online' ? <CreditCard className="w-5 h-5 text-blue-600" /> :
                   payment.method === 'card' ? <Card className="w-5 h-5 text-emerald-600" /> :
                   payment.method === 'upi' ? <QrCode className="w-5 h-5 text-purple-600" /> :
                   payment.method === 'cash' ? <Banknote className="w-5 h-5 text-amber-600" /> :
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
                  <p className="text-sm text-gray-600">{payment.class} • {payment.date}</p>
                  <p className="text-xs text-gray-500">{payment.receipt}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-bold text-lg text-gray-900">₹{payment.amount.toLocaleString()}</p>
                  <PaymentMethodBadge method={payment.method} />
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </motion.div>
          ))}
        </div>
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
              className="group bg-white p-5 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-left"
            >
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
        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Student Fee Management</h2>
              <p className="text-gray-600 mt-1">View student fee status and complete payment history</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
              {/* Expand Button */}
              <button
                onClick={() => navigate('/accountant/fees/transactions')}
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
                  />
                </div>
                
                {/* Filters */}
                <div className="flex gap-2">
                  <select
                    className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                  >
                    <option value="All">All Classes</option>
                    {[...new Set(students.map(s => s.class))].map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                  
                  <select
                    className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="overdue">Overdue</option>
                    <option value="partial">Partial</option>
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
                    Total pending: ₹{students
                      .filter(s => selectedStudents.includes(s.id))
                      .reduce((sum, s) => sum + s.pending, 0)
                      .toLocaleString()}
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
                const studentTransactions = transactions.filter(t => t.studentId === student.id);
                const totalPaid = studentTransactions.reduce((sum, t) => sum + t.amount, 0);
                
                return (
                  <motion.tr
                    key={student.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student.id)}
                          onChange={() => toggleStudentSelection(student.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900">{student.name}</p>
                            {student.remindersSent > 0 && (
                              <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                                {student.remindersSent} reminder{student.remindersSent > 1 ? 's' : ''}
                              </span>
                            )}
                            {studentTransactions.length > 0 && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                {studentTransactions.length} payment{studentTransactions.length > 1 ? 's' : ''}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{student.class} • {student.guardian}</p>
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
                        <FeeStatusBadge status={student.status} />
                        <div className="text-xs space-y-1">
                          <p className="text-gray-500">Due: {student.dueDate}</p>
                          {student.lastPayment && (
                            <p className="text-emerald-600">Last payment: {student.lastPayment}</p>
                          )}
                          {student.lastReminder && (
                            <p className="text-amber-600">Last reminder: {student.lastReminder}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Total:</span>
                          <span className="font-semibold">₹{student.totalFee.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Paid:</span>
                          <span className="font-semibold text-emerald-600">₹{totalPaid.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Pending:</span>
                          <span className="font-semibold text-rose-600">₹{student.pending.toLocaleString()}</span>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="mt-2">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Payment Progress</span>
                            <span className="font-medium">
                              {student.totalFee > 0 ? ((totalPaid / student.totalFee) * 100).toFixed(1) : '0'}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${(totalPaid / student.totalFee) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {/* View Recent Payments Button */}
                        {studentTransactions.length > 0 && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleShowRecentPayments(student)}
                            className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg transition-colors text-sm font-medium"
                          >
                            <Clock className="w-4 h-4" />
                            {studentTransactions.length} Txns
                          </motion.button>
                        )}
                        
                        {/* Email Reminder */}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEmailReminder(student)}
                          disabled={isLoading || student.status === 'paid'}
                          className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
                        >
                          <Mail className="w-4 h-4" />
                          Email ({student.remindersSent})
                        </motion.button>
                        
                        {/* SMS Reminder */}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleSMSReminder(student)}
                          disabled={isLoading || student.status === 'paid'}
                          className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
                        >
                          <MessageSquare className="w-4 h-4" />
                          SMS ({student.remindersSent})
                        </motion.button>
                        
                        {/* View All Transactions Button */}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleViewAllTransactions(student)}
                          className="flex items-center gap-1.5 px-3 py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg transition-colors text-sm font-medium"
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
          
          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No students found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                No students match your current search criteria. Try adjusting your filters or search terms.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default FeeCollection;