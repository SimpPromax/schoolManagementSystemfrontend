/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Mail, 
  MessageSquare,
  Eye,
  CreditCard,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Printer,
  Users,
  DollarSign,
  Phone,
  Send,
  RefreshCw,
  FileText,
  Percent,
  Clock,
  UserCheck,
  Zap,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  BarChart2,
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
  CreditCard as Card,
  Wallet,
  Banknote,
  QrCode
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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

// Utility component for fee status badges
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
    cheque: { label: 'Cheque', color: 'bg-gray-100 text-gray-800', icon: FileText }
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

const StudentFeeManagement = () => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedStudent, setExpandedStudent] = useState(null);

  // Mock data - Students with enhanced fee status
  const studentsFeeData = [
    { 
      id: 1, 
      name: 'Rohan Kumar', 
      class: 'Grade 10A', 
      guardian: 'Mr. Kumar', 
      contact: '9876543210', 
      email: 'rohan@email.com', 
      totalFee: 45000, 
      paid: 45000, 
      pending: 0, 
      status: 'paid', 
      lastPayment: 'Mar 15, 2025',
      dueDate: 'Mar 20, 2025',
      paymentMethod: 'online',
      feeBreakdown: [
        { category: 'Tuition', amount: 30000 },
        { category: 'Transport', amount: 8000 },
        { category: 'Activities', amount: 4000 },
        { category: 'Lab', amount: 3000 }
      ],
      paymentHistory: [
        { date: 'Mar 15, 2025', amount: 45000, method: 'online', receipt: 'RC-001' },
        { date: 'Dec 15, 2024', amount: 45000, method: 'card', receipt: 'RC-045' }
      ],
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
      paid: 22500, 
      pending: 22500, 
      status: 'partial', 
      lastPayment: 'Mar 10, 2025',
      dueDate: 'Mar 20, 2025',
      paymentMethod: 'card',
      feeBreakdown: [
        { category: 'Tuition', amount: 30000 },
        { category: 'Transport', amount: 8000 },
        { category: 'Activities', amount: 4000 },
        { category: 'Lab', amount: 3000 }
      ],
      paymentHistory: [
        { date: 'Mar 10, 2025', amount: 22500, method: 'card', receipt: 'RC-002' }
      ],
      remindersSent: 1,
      lastReminder: 'Mar 18, 2025'
    },
    { 
      id: 3, 
      name: 'Vikram Patel', 
      class: 'Grade 10B', 
      guardian: 'Mr. Patel', 
      contact: '9876543212', 
      email: 'vikram@email.com', 
      totalFee: 45000, 
      paid: 0, 
      pending: 45000, 
      status: 'overdue', 
      lastPayment: '-', 
      dueDate: 'Mar 10, 2025',
      paymentMethod: null,
      feeBreakdown: [
        { category: 'Tuition', amount: 30000 },
        { category: 'Transport', amount: 8000 },
        { category: 'Activities', amount: 4000 },
        { category: 'Lab', amount: 3000 }
      ],
      paymentHistory: [],
      remindersSent: 3,
      lastReminder: 'Mar 20, 2025'
    },
    { 
      id: 4, 
      name: 'Priya Sharma', 
      class: 'Grade 11A', 
      guardian: 'Mrs. Sharma', 
      contact: '9876543213', 
      email: 'priya@email.com', 
      totalFee: 45000, 
      paid: 45000, 
      pending: 0, 
      status: 'paid', 
      lastPayment: 'Mar 14, 2025',
      dueDate: 'Mar 20, 2025',
      paymentMethod: 'upi',
      feeBreakdown: [
        { category: 'Tuition', amount: 30000 },
        { category: 'Transport', amount: 8000 },
        { category: 'Activities', amount: 4000 },
        { category: 'Lab', amount: 3000 }
      ],
      paymentHistory: [
        { date: 'Mar 14, 2025', amount: 45000, method: 'upi', receipt: 'RC-003' }
      ],
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
      paid: 30000, 
      pending: 15000, 
      status: 'pending', 
      lastPayment: 'Mar 5, 2025',
      dueDate: 'Mar 20, 2025',
      paymentMethod: 'cash',
      feeBreakdown: [
        { category: 'Tuition', amount: 30000 },
        { category: 'Transport', amount: 8000 },
        { category: 'Activities', amount: 4000 },
        { category: 'Lab', amount: 3000 }
      ],
      paymentHistory: [
        { date: 'Mar 5, 2025', amount: 30000, method: 'cash', receipt: 'RC-004' }
      ],
      remindersSent: 2,
      lastReminder: 'Mar 15, 2025'
    },
    { 
      id: 6, 
      name: 'Neha Gupta', 
      class: 'Grade 12A', 
      guardian: 'Mrs. Gupta', 
      contact: '9876543215', 
      email: 'neha@email.com', 
      totalFee: 45000, 
      paid: 45000, 
      pending: 0, 
      status: 'paid', 
      lastPayment: 'Mar 12, 2025',
      dueDate: 'Mar 20, 2025',
      paymentMethod: 'online',
      feeBreakdown: [
        { category: 'Tuition', amount: 30000 },
        { category: 'Transport', amount: 8000 },
        { category: 'Activities', amount: 4000 },
        { category: 'Lab', amount: 3000 }
      ],
      paymentHistory: [
        { date: 'Mar 12, 2025', amount: 45000, method: 'online', receipt: 'RC-005' }
      ],
      remindersSent: 0,
      lastReminder: null
    },
    { 
      id: 7, 
      name: 'Rahul Verma', 
      class: 'Grade 12B', 
      guardian: 'Mr. Verma', 
      contact: '9876543216', 
      email: 'rahul@email.com', 
      totalFee: 45000, 
      paid: 0, 
      pending: 45000, 
      status: 'overdue', 
      lastPayment: '-', 
      dueDate: 'Mar 5, 2025',
      paymentMethod: null,
      feeBreakdown: [
        { category: 'Tuition', amount: 30000 },
        { category: 'Transport', amount: 8000 },
        { category: 'Activities', amount: 4000 },
        { category: 'Lab', amount: 3000 }
      ],
      paymentHistory: [],
      remindersSent: 4,
      lastReminder: 'Mar 22, 2025'
    },
    { 
      id: 8, 
      name: 'Sneha Reddy', 
      class: 'Grade 10A', 
      guardian: 'Mr. Reddy', 
      contact: '9876543217', 
      email: 'sneha@email.com', 
      totalFee: 45000, 
      paid: 45000, 
      pending: 0, 
      status: 'paid', 
      lastPayment: 'Mar 13, 2025',
      dueDate: 'Mar 20, 2025',
      paymentMethod: 'card',
      feeBreakdown: [
        { category: 'Tuition', amount: 30000 },
        { category: 'Transport', amount: 8000 },
        { category: 'Activities', amount: 4000 },
        { category: 'Lab', amount: 3000 }
      ],
      paymentHistory: [
        { date: 'Mar 13, 2025', amount: 45000, method: 'card', receipt: 'RC-006' }
      ],
      remindersSent: 0,
      lastReminder: null
    },
    { 
      id: 9, 
      name: 'Kunal Singh', 
      class: 'Grade 11A', 
      guardian: 'Mrs. Singh', 
      contact: '9876543218', 
      email: 'kunal@email.com', 
      totalFee: 45000, 
      paid: 15000, 
      pending: 30000, 
      status: 'pending', 
      lastPayment: 'Mar 3, 2025',
      dueDate: 'Mar 25, 2025',
      paymentMethod: 'upi',
      feeBreakdown: [
        { category: 'Tuition', amount: 30000 },
        { category: 'Transport', amount: 8000 },
        { category: 'Activities', amount: 4000 },
        { category: 'Lab', amount: 3000 }
      ],
      paymentHistory: [
        { date: 'Mar 3, 2025', amount: 15000, method: 'upi', receipt: 'RC-007' }
      ],
      remindersSent: 1,
      lastReminder: 'Mar 18, 2025'
    },
    { 
      id: 10, 
      name: 'Meera Joshi', 
      class: 'Grade 9B', 
      guardian: 'Mr. Joshi', 
      contact: '9876543219', 
      email: 'meera@email.com', 
      totalFee: 45000, 
      paid: 22500, 
      pending: 22500, 
      status: 'partial', 
      lastPayment: 'Mar 8, 2025',
      dueDate: 'Mar 20, 2025',
      paymentMethod: 'cash',
      feeBreakdown: [
        { category: 'Tuition', amount: 30000 },
        { category: 'Transport', amount: 8000 },
        { category: 'Activities', amount: 4000 },
        { category: 'Lab', amount: 3000 }
      ],
      paymentHistory: [
        { date: 'Mar 8, 2025', amount: 22500, method: 'cash', receipt: 'RC-008' }
      ],
      remindersSent: 2,
      lastReminder: 'Mar 16, 2025'
    },
  ];

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
      }
    });

    if (formValues) {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        showSuccessAlert(
          'Email Sent Successfully!',
          `Email reminder has been sent to ${student.guardian} (${student.email}).`
        );
        
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
        };
      },
    });

    if (formValues && formValues.success) {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        showSuccessAlert(
          'SMS Sent Successfully!',
          `SMS reminder has been sent to ${student.guardian} (${student.contact}). Delivery confirmation will be sent shortly.`
        );
        
      } catch (error) {
        showErrorAlert('Failed to Send', 'There was an error sending the SMS. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Enhanced Record Payment Function with Popup
  const handleRecordPayment = async (student) => {
    const { value: formValues } = await MySwal.fire({
      title: <span className="text-gray-900">Record Payment</span>,
      html: (
        <div className="text-left space-y-6">
          {/* Student Summary */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{student.name}</h3>
                <p className="text-sm text-gray-600">{student.class}</p>
              </div>
              <FeeStatusBadge status={student.status} />
            </div>
            
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-xs text-gray-500">Total Fee</p>
                <p className="text-lg font-bold">₹{student.totalFee.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Paid</p>
                <p className="text-lg font-bold text-emerald-600">₹{student.paid.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Pending</p>
                <p className="text-lg font-bold text-rose-600">₹{student.pending.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Record New Payment Form */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Record New Payment</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Payment Amount (₹)
                </label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  placeholder="Enter amount"
                  max={student.pending}
                  min="0"
                  defaultValue={student.pending}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Maximum: ₹{student.pending.toLocaleString()}
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'online', label: 'Online', icon: CreditCard },
                    { value: 'card', label: 'Card', icon: Card },
                    { value: 'upi', label: 'UPI', icon: QrCode },
                    { value: 'cash', label: 'Cash', icon: Banknote },
                    { value: 'cheque', label: 'Cheque', icon: FileText },
                    { value: 'bank', label: 'Bank', icon: Wallet },
                  ].map((method) => (
                    <label
                      key={method.value}
                      className="flex flex-col items-center p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.value}
                        defaultChecked={method.value === 'online'}
                        className="text-blue-600 mb-2"
                      />
                      <method.icon className="w-4 h-4 text-gray-600 mb-1" />
                      <span className="text-xs text-center">{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Payment Date
                  </label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    defaultValue={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Receipt Number
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    placeholder="Auto-generated"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  rows="2"
                  placeholder="Add any payment notes..."
                />
              </div>
            </div>
          </div>
        </div>
      ),
      showCancelButton: true,
      confirmButtonText: 'Record Payment',
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
        const amount = document.querySelector('input[type="number"]').value;
        const method = document.querySelector('input[name="paymentMethod"]:checked');
        if (!amount || Number(amount) <= 0) {
          MySwal.showValidationMessage('Please enter a valid amount');
          return false;
        }
        if (!method) {
          MySwal.showValidationMessage('Please select a payment method');
          return false;
        }
        return { amount, method: method.value };
      },
    });

    if (formValues) {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        showSuccessAlert(
          'Payment Recorded Successfully!',
          `Payment of ₹${Number(formValues.amount).toLocaleString()} has been recorded for ${student.name}.`
        );
        
      } catch (error) {
        showErrorAlert('Recording Failed', 'There was an error recording the payment. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleViewStudentDetails = (student) => {
    MySwal.fire({
      title: <span className="text-gray-900">Student Fee Details</span>,
      html: (
        <div className="text-left space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Student Info */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-gray-900">{student.name}</h3>
                <p className="text-sm text-gray-600">{student.class} • {student.guardian}</p>
              </div>
              <FeeStatusBadge status={student.status} />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-xs text-gray-500">Contact</p>
                <p className="text-sm font-medium">{student.contact}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm font-medium">{student.email}</p>
              </div>
            </div>
          </div>

          {/* Fee Breakdown */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Fee Breakdown</h4>
            <div className="space-y-2">
              {student.feeBreakdown.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                  <span className="text-sm">{item.category}</span>
                  <span className="font-medium">₹{item.amount.toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded font-semibold">
                <span>Total Fee</span>
                <span>₹{student.totalFee.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Payment History */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Payment History</h4>
            {student.paymentHistory.length > 0 ? (
              <div className="space-y-2">
                {student.paymentHistory.map((payment, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{payment.date}</p>
                      <p className="text-xs text-gray-600">Receipt: {payment.receipt}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-emerald-600">₹{payment.amount.toLocaleString()}</p>
                      <PaymentMethodBadge method={payment.method} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No payment history available</p>
            )}
          </div>

          {/* Reminder History */}
          {student.remindersSent > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Reminder History</h4>
              <div className="p-3 bg-amber-50 rounded-lg">
                <p className="text-sm">
                  <span className="font-medium">{student.remindersSent} reminder(s) sent</span>
                  {student.lastReminder && (
                    <span className="text-gray-600"> • Last sent: {student.lastReminder}</span>
                  )}
                </p>
              </div>
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
                  { id: 'app', label: 'In-app Notification', icon: AlertCircle }
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
        setSelectedStudents([]);
      } catch (error) {
        showErrorAlert('Operation Failed', 'There was an error sending bulk reminders.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleExportData = async () => {
    const result = await showConfirmDialog(
      'Export Data',
      'Export student fee data to Excel format?',
      'Export to Excel',
      'Cancel'
    );
    
    if (result.isConfirmed) {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        showSuccessAlert(
          'Export Successful!',
          'Data has been exported to Excel format'
        );
      } catch (error) {
        showErrorAlert('Export Failed', 'There was an error exporting the data.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Filter students
  const filteredStudents = useMemo(() => {
    return studentsFeeData.filter(student => {
      const matchesSearch = searchQuery === '' || 
        [student.name, student.guardian, student.class, student.email, student.contact]
          .some(field => field.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesClass = selectedClass === 'All' || student.class === selectedClass;
      
      const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
      
      return matchesSearch && matchesClass && matchesStatus;
    });
  }, [searchQuery, selectedClass, filterStatus, studentsFeeData]);

  // Statistics
  const stats = useMemo(() => {
    const totalCollected = studentsFeeData.reduce((sum, student) => sum + student.paid, 0);
    const totalPending = studentsFeeData.reduce((sum, student) => sum + student.pending, 0);
    const totalFee = studentsFeeData.reduce((sum, student) => sum + student.totalFee, 0);
    const paidCount = studentsFeeData.filter(s => s.status === 'paid').length;
    const overdueCount = studentsFeeData.filter(s => s.status === 'overdue').length;
    const partialCount = studentsFeeData.filter(s => s.status === 'partial').length;
    const pendingCount = studentsFeeData.filter(s => s.status === 'pending').length;
    
    return {
      totalStudents: studentsFeeData.length,
      paidCount,
      pendingCount,
      partialCount,
      overdueCount,
      totalCollected: `₹${(totalCollected / 1000000).toFixed(2)}M`,
      totalPending: `₹${(totalPending / 1000).toFixed(0)}K`,
      totalFee: `₹${(totalFee / 1000000).toFixed(2)}M`,
      collectionRate: `${((totalCollected / totalFee) * 100).toFixed(1)}%`,
    };
  }, [studentsFeeData]);

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
      label: 'Export Excel', 
      color: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
      action: handleExportData
    },
    { 
      icon: Printer, 
      label: 'Print Table', 
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      action: () => showSuccessAlert('Print Started', 'Table is being sent to printer.') 
    },
    { 
      icon: RefreshCw, 
      label: 'Refresh Data', 
      color: 'bg-gradient-to-br from-amber-500 to-amber-600',
      action: () => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 1000);
        showSuccessAlert('Data Refreshed', 'Student data has been updated.');
      }
    },
  ];

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
                onClick={() => navigate('/accountant/fees')}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Student Fee Management
                </h1>
                <p className="text-gray-600 mt-1">
                  Detailed view of all student fee payments and status
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
          label="Total Students"
          value={stats.totalStudents}
          icon={Users}
          color="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatCard
          label="Paid Students"
          value={stats.paidCount}
          icon={CheckCircle}
          color="bg-gradient-to-br from-emerald-500 to-emerald-600"
          trend="94%"
          change={94}
        />
        <StatCard
          label="Pending Fees"
          value={stats.pendingCount + stats.partialCount}
          icon={AlertTriangle}
          color="bg-gradient-to-br from-amber-500 to-amber-600"
        />
        <StatCard
          label="Overdue Students"
          value={stats.overdueCount}
          icon={XCircle}
          color="bg-gradient-to-br from-rose-500 to-rose-600"
        />
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
          <span className="text-sm text-gray-500">One-click operations</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Student Fee Details</h2>
              <p className="text-gray-600 mt-1">Complete list of all students with fee status</p>
            </div>
            
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
                  <option value="Grade 10A">Grade 10A</option>
                  <option value="Grade 10B">Grade 10B</option>
                  <option value="Grade 11A">Grade 11A</option>
                  <option value="Grade 11B">Grade 11B</option>
                  <option value="Grade 12A">Grade 12A</option>
                  <option value="Grade 12B">Grade 12B</option>
                  <option value="Grade 9B">Grade 9B</option>
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
                    Total pending: ₹{studentsFeeData
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

        {/* Student List */}
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
                  Contact Details
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
              {filteredStudents.map((student) => (
                <React.Fragment key={student.id}>
                  <motion.tr
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
                          </div>
                          <p className="text-sm text-gray-600">{student.class} • {student.guardian}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3 text-gray-400" />
                          <span className="text-sm text-gray-700">{student.contact}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <span className="text-sm text-gray-700">{student.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <FeeStatusBadge status={student.status} />
                        <div className="text-xs space-y-1">
                          <p className="text-gray-500">Due: {student.dueDate}</p>
                          <p className="text-gray-500">Last payment: {student.lastPayment}</p>
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
                          <span className="font-semibold text-emerald-600">₹{student.paid.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Pending:</span>
                          <span className="font-semibold text-rose-600">₹{student.pending.toLocaleString()}</span>
                        </div>
                        {student.paymentMethod && (
                          <div className="pt-2">
                            <PaymentMethodBadge method={student.paymentMethod} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
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
                        
                        {/* Record Payment */}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleRecordPayment(student)}
                          disabled={isLoading || student.status === 'paid'}
                          className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
                        >
                          <CreditCard className="w-4 h-4" />
                          Record
                        </motion.button>
                        
                        {/* View Details */}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleViewStudentDetails(student)}
                          className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          Details
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                  
                  {/* Expanded Details Row */}
                  {expandedStudent === student.id && (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Fee Breakdown */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Fee Breakdown</h4>
                            <div className="space-y-2">
                              {student.feeBreakdown.map((item, index) => (
                                <div key={index} className="flex justify-between items-center p-2 hover:bg-white rounded">
                                  <span className="text-sm">{item.category}</span>
                                  <span className="font-medium">₹{item.amount.toLocaleString()}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Recent Payments */}
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Recent Payments</h4>
                            {student.paymentHistory.length > 0 ? (
                              <div className="space-y-2">
                                {student.paymentHistory.slice(0, 3).map((payment, index) => (
                                  <div key={index} className="flex justify-between items-center p-2 bg-white rounded">
                                    <div>
                                      <p className="text-sm font-medium">{payment.date}</p>
                                      <p className="text-xs text-gray-600">{payment.receipt}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-sm font-semibold text-emerald-600">₹{payment.amount.toLocaleString()}</p>
                                      <PaymentMethodBadge method={payment.method} />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500 text-center py-4">No payment history</p>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
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

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {filteredStudents.length} of {studentsFeeData.length} students
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                Previous
              </button>
              <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                1
              </button>
              <button className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                2
              </button>
              <button className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Back to Fee Collection */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center mt-8"
      >
        <button
          onClick={() => navigate('/accountant/fees')}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Fee Collection Dashboard
        </button>
      </motion.div>
    </div>
  );
};

export default StudentFeeManagement;