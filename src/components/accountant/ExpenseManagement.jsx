import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Filter,
  Download,
  FileText,
  CreditCard,
  ChevronRight,
  Bell,
  Building,
  Users,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';

// ✅ Isolated Table Component — avoids React Compiler warning
const ExpenseCategoryTable = ({ data }) => {
  const columns = useMemo(
    () => [
      {
        header: 'Category',
        accessorKey: 'category',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${row.original.iconBg}`}>
              {row.original.icon}
            </div>
            <div>
              <div className="font-semibold text-gray-900">{row.original.category}</div>
              <div className="text-xs text-gray-500">{row.original.subcategory}</div>
            </div>
          </div>
        ),
      },
      {
        header: 'Budget',
        accessorKey: 'budget',
        cell: info => <span className="font-medium text-gray-900">{info.getValue()}</span>,
      },
      {
        header: 'Spent',
        accessorKey: 'spent',
        cell: info => <span className="font-medium text-gray-900">{info.getValue()}</span>,
      },
      {
        header: 'Utilization',
        accessorKey: 'percent',
        cell: info => {
          const percent = info.getValue();
          const color = percent >= 75 ? 'bg-red-500' : percent >= 50 ? 'bg-yellow-500' : 'bg-green-500';
          const textColor = percent >= 75 ? 'text-red-700' : percent >= 50 ? 'text-yellow-700' : 'text-green-700';
          
          return (
            <div className="flex items-center gap-3">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div className={`h-2 rounded-full transition-all duration-500 ${color}`} style={{ width: `${percent}%` }}></div>
              </div>
              <span className={`font-medium ${textColor}`}>{percent}%</span>
            </div>
          );
        },
      },
      {
        header: 'Status',
        accessorKey: 'percent',
        cell: info => {
          const percent = info.getValue();
          const text = percent >= 75 ? 'High Spending' : percent >= 50 ? 'On Track' : 'Within Budget';
          const bgColor =
            percent >= 75
              ? 'bg-red-100 text-red-800'
              : percent >= 50
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-green-100 text-green-800';
          return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${bgColor}`}>
              {text}
            </span>
          );
        },
      },
    ],
    []
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="hover:bg-gray-50 transition-colors">
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="px-6 py-4">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ExpenseManagement = () => {
  const [selectedMonth, setSelectedMonth] = useState('March 2025');

  const expenseCategories = [
    { 
      category: 'Utilities', 
      subcategory: 'Electricity, Water, Internet',
      budget: 'KSH 200K', 
      spent: 'KSH 125K', 
      percent: 63,
      icon: '⚡',
      iconBg: 'bg-blue-100'
    },
    { 
      category: 'Maintenance', 
      subcategory: 'Building & Equipment',
      budget: 'KSH 300K', 
      spent: 'KSH 150K', 
      percent: 50,
      icon: '🔧',
      iconBg: 'bg-yellow-100'
    },
    { 
      category: 'Stationery', 
      subcategory: 'Office & Classroom',
      budget: 'KSH 150K', 
      spent: 'KSH 75K', 
      percent: 50,
      icon: '📎',
      iconBg: 'bg-purple-100'
    },
    { 
      category: 'Events', 
      subcategory: 'School Functions',
      budget: 'KSH 500K', 
      spent: 'KSH 225K', 
      percent: 45,
      icon: '🎉',
      iconBg: 'bg-pink-100'
    },
    { 
      category: 'Laboratory', 
      subcategory: 'Science Equipment',
      budget: 'KSH 200K', 
      spent: 'KSH 100K', 
      percent: 50,
      icon: '🧪',
      iconBg: 'bg-green-100'
    },
    { 
      category: 'Sports', 
      subcategory: 'Equipment & Events',
      budget: 'KSH 150K', 
      spent: 'KSH 50K', 
      percent: 33,
      icon: '⚽',
      iconBg: 'bg-orange-100'
    },
    { 
      category: 'Contingency', 
      subcategory: 'Emergency Funds',
      budget: 'KSH 1.0M', 
      spent: 'KSH 250K', 
      percent: 25,
      icon: '🛡️',
      iconBg: 'bg-red-100'
    },
  ];

  const recentExpenses = [
    { 
      date: 'Mar 14', 
      description: 'Science Lab Equipment', 
      amount: 'KSH 45,000', 
      approved: 'Principal', 
      status: 'approved',
      category: 'Laboratory',
      receipt: 'RCP00567'
    },
    { 
      date: 'Mar 13', 
      description: 'Library Books', 
      amount: 'KSH 85,000', 
      approved: 'Principal', 
      status: 'approved',
      category: 'Academic',
      receipt: 'RCP00568'
    },
    { 
      date: 'Mar 12', 
      description: 'Sports Day Trophies', 
      amount: 'KSH 25,000', 
      approved: 'Principal', 
      status: 'approved',
      category: 'Events',
      receipt: 'RCP00569'
    },
    { 
      date: 'Mar 11', 
      description: 'Printer Cartridges', 
      amount: 'KSH 15,000', 
      approved: null, 
      status: 'pending',
      category: 'Office',
      receipt: 'RCP00570'
    },
    { 
      date: 'Mar 10', 
      description: 'Annual Function Decor', 
      amount: 'KSH 50,000', 
      approved: 'Principal', 
      status: 'approved',
      category: 'Events',
      receipt: 'RCP00571'
    },
  ];

  const pendingApprovals = [
    { item: 'Computer Lab Upgrade', amount: 'KSH 250K', department: 'IT Department', submitted: 'Mar 13', priority: 'high' },
    { item: 'Playground Equipment', amount: 'KSH 175K', department: 'Sports Dept', submitted: 'Mar 12', priority: 'medium' },
    { item: 'Staff Training Workshop', amount: 'KSH 85K', department: 'HR Dept', submitted: 'Mar 10', priority: 'low' },
  ];

  const vendorPayments = [
    { vendor: 'Book Supplier', amount: 'KSH 350K', dueDate: 'March 22', status: 'due', category: 'Academic' },
    { vendor: 'Canteen Contract', amount: 'KSH 120K', dueDate: 'March 18', status: 'due', category: 'Services' },
    { vendor: 'Transport Contractor', amount: 'KSH 200K', dueDate: 'March 20', status: 'due', category: 'Transport' },
    { vendor: 'Electricity Board', amount: 'KSH 125K', dueDate: 'March 20', status: 'paid', category: 'Utilities' },
  ];

  const statsCards = [
    { 
      title: 'Monthly Budget', 
      value: 'KSH 2.5M', 
      change: '+5.2%', 
      icon: <DollarSign className="w-5 h-5" />, 
      color: 'bg-blue-500',
      trend: 'up'
    },
    { 
      title: 'Amount Spent', 
      value: 'KSH 875K', 
      change: '35% used', 
      icon: <CreditCard className="w-5 h-5" />, 
      color: 'bg-green-500',
      trend: 'info'
    },
    { 
      title: 'Remaining Balance', 
      value: 'KSH 1.63M', 
      change: '65% available', 
      icon: <FileText className="w-5 h-5" />, 
      color: 'bg-purple-500',
      trend: 'stable'
    },
    { 
      title: 'Days Remaining', 
      value: '16', 
      change: 'of 31 days', 
      icon: <Calendar className="w-5 h-5" />, 
      color: 'bg-yellow-500',
      trend: 'warning'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Expense Management</h1>
            <p className="text-gray-600 mt-1">Springfield High School • Track and manage expenses</p>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <div className="relative">
              <Bell className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-900" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </div>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* Month Selection Card */}
        <div className="bg-linear-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between">
            <div className="mb-6 lg:mb-0">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Expense Overview: {selectedMonth}</h2>
                  <p className="text-blue-100">Track and manage monthly expenses</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/10 p-3 rounded-lg">
                  <p className="text-sm text-blue-200">Monthly Budget</p>
                  <p className="font-bold text-xl">KSH 2.5M</p>
                </div>
                <div className="bg-white/10 p-3 rounded-lg">
                  <p className="text-sm text-blue-200">Spent</p>
                  <p className="font-bold text-xl">KSH 875K</p>
                </div>
                <div className="bg-white/10 p-3 rounded-lg">
                  <p className="text-sm text-blue-200">Remaining</p>
                  <p className="font-bold text-xl">KSH 1.63M</p>
                </div>
                <div className="bg-white/10 p-3 rounded-lg">
                  <p className="text-sm text-blue-200">Utilization</p>
                  <p className="font-bold text-green-300">35%</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <select
                className="bg-white/20 border border-white/30 text-white rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-white/50"
                value={selectedMonth}
                onChange={e => setSelectedMonth(e.target.value)}
              >
                <option>March 2025</option>
                <option>February 2025</option>
                <option>January 2025</option>
                <option>December 2024</option>
              </select>
              <button className="bg-white text-blue-700 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                Add New Expense
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsCards.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${stat.color} text-white`}>
                {stat.icon}
              </div>
              <span className={`text-sm font-medium px-2 py-1 rounded-full flex items-center gap-1 ${
                stat.trend === 'up' ? 'bg-green-100 text-green-800' :
                stat.trend === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                stat.trend === 'info' ? 'bg-blue-100 text-blue-800' :
                'bg-purple-100 text-purple-800'
              }`}>
                {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : null}
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Expense Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Expenses by Category
            </h2>
            <p className="text-gray-600 text-sm mt-1">Monthly spending distribution across categories</p>
          </div>
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <ExpenseCategoryTable data={expenseCategories} />

        <div className="mt-6 p-5 bg-linear-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <p className="font-semibold text-gray-900">TOTAL MONTHLY SPENDING</p>
              <p className="text-2xl font-bold text-blue-700">KSH 875,000</p>
              <p className="text-sm text-gray-600">For {selectedMonth}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">vs Last Month</p>
                <p className="font-bold text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +12%
                </p>
              </div>
              <div className="h-10 w-px bg-gray-300"></div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Annual Budget</p>
                <p className="font-bold">KSH 30M</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Expenses & Pending Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Expenses */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                Recent Expenses
              </h2>
              <p className="text-gray-600 text-sm mt-1">Latest expense transactions</p>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {recentExpenses.map((expense, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border ${
                  expense.status === 'approved'
                    ? 'border-green-200 bg-green-50/50'
                    : 'border-yellow-200 bg-yellow-50/50'
                } hover:shadow-sm transition-shadow`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-bold text-gray-900">{expense.description}</p>
                    <p className="text-sm text-gray-600">
                      {expense.date} • {expense.category} • Receipt: {expense.receipt}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        expense.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {expense.status === 'approved' ? 'Approved' : 'Pending'}
                    </span>
                    <div className="mt-2 text-lg font-bold text-gray-900">{expense.amount}</div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-gray-600">
                    {expense.approved ? `Approved by: ${expense.approved}` : 'Awaiting approval'}
                  </div>
                  <div className="flex gap-2">
                    <button className="text-sm text-blue-600 hover:text-blue-800 hover:underline px-2 py-1 rounded hover:bg-blue-50">
                      Details
                    </button>
                    <button className="text-sm text-gray-600 hover:text-gray-800 hover:underline px-2 py-1 rounded hover:bg-gray-100">
                      Bill
                    </button>
                    {expense.status === 'pending' && (
                      <button className="text-sm text-green-600 hover:text-green-800 hover:underline px-2 py-1 rounded hover:bg-green-50">
                        Approve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Total This Month</p>
                <p className="text-xl font-bold text-gray-900">KSH 875,000</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Average Daily</p>
                <p className="font-bold text-gray-900">KSH 29,167</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Pending Approvals
              </h2>
              <p className="text-gray-600 text-sm mt-1">Requests awaiting your approval</p>
            </div>
            <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
              {pendingApprovals.length} pending
            </span>
          </div>

          <div className="space-y-4">
            {pendingApprovals.map((approval, index) => (
              <div key={index} className="p-4 rounded-xl border border-red-200 bg-red-50/50">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-bold text-gray-900">{approval.item}</p>
                    <p className="text-sm text-gray-600">{approval.department}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      approval.priority === 'high' ? 'bg-red-100 text-red-800' :
                      approval.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {approval.priority}
                    </span>
                    <div className="mt-2 text-lg font-bold text-red-700">{approval.amount}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">Submitted: {approval.submitted}</div>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-4 rounded-lg transition-colors">
                      Approve
                    </button>
                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm py-2 px-4 rounded-lg transition-colors">
                      Revise
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-linear-to-r from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="font-bold text-gray-900">Approval Deadline</p>
                <p className="text-sm text-gray-600">Process within 3 working days</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vendor Payments */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-600" />
              Vendor Payments
            </h2>
            <p className="text-gray-600 text-sm mt-1">Scheduled and completed vendor payments</p>
          </div>
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
            Schedule All <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {vendorPayments.map((payment, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl border ${
                payment.status === 'paid'
                  ? 'border-green-200 bg-green-50/50'
                  : 'border-red-200 bg-red-50/50'
              } hover:shadow-sm transition-shadow`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-bold text-gray-900">{payment.vendor}</p>
                  <p className="text-sm text-gray-600">
                    {payment.category} • Due: {payment.dueDate}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    payment.status === 'paid'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {payment.status === 'paid' ? 'PAID' : 'DUE'}
                </span>
              </div>

              <div className="text-2xl font-bold mb-4 text-gray-900">{payment.amount}</div>

              {payment.status === 'due' ? (
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded-lg transition-colors">
                  Schedule Payment
                </button>
              ) : (
                <div className="flex items-center justify-center text-green-600">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span className="font-medium">Payment Sent</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Expense Analysis */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Expense Analysis
            </h2>
            <p className="text-gray-600 text-sm mt-1">Monthly spending insights and trends</p>
          </div>
          <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Download className="w-4 h-4" />
            Download Report
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-linear-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-700">12%</div>
                <div className="text-sm text-gray-700">Increase from last month</div>
              </div>
            </div>
            <div className="text-xs text-gray-600 mt-2">KSH 94K more than February</div>
          </div>

          <div className="p-4 bg-linear-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
            <div className="flex items-center gap-3 mb-3">
              <DollarSign className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-700">KSH 120K</div>
                <div className="text-sm text-gray-700">Saved vs budget</div>
              </div>
            </div>
            <div className="text-xs text-gray-600 mt-2">Within budget across 6 categories</div>
          </div>

          <div className="p-4 bg-linear-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="w-8 h-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-purple-700">85%</div>
                <div className="text-sm text-gray-700">On-time payments</div>
              </div>
            </div>
            <div className="text-xs text-gray-600 mt-2">17 of 20 payments on schedule</div>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="mt-8 p-4 bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <Link
              to="/accountant"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
            >
              ← Back to Dashboard
            </Link>
            <div className="h-4 w-px bg-gray-300 hidden md:block"></div>
            <span className="text-sm text-gray-600">Expense Management • Last updated: Today, 02:45 PM</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1 rounded-lg hover:bg-gray-100">
              Save Report
            </button>
            <button className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
              Generate Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseManagement;