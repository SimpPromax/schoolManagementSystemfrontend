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
      },
      {
        header: 'Budget (₹)',
        accessorKey: 'budget',
        cell: info => `₹${info.getValue().toLocaleString()}`,
      },
      {
        header: 'Spent (₹)',
        accessorKey: 'spent',
        cell: info => `₹${info.getValue().toLocaleString()}`,
      },
      {
        header: 'Percentage',
        accessorKey: 'percent',
        cell: info => {
          const percent = info.getValue();
          const color = percent >= 75 ? 'bg-red-600' : percent >= 50 ? 'bg-yellow-600' : 'bg-green-600';
          return (
            <div className="flex items-center gap-3">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div className={`h-2 rounded-full ${color}`} style={{ width: `${percent}%` }}></div>
              </div>
              <span className={`font-medium ${color}`}>{percent}%</span>
            </div>
          );
        },
      },
      {
        header: 'Status',
        accessorKey: 'percent',
        cell: info => {
          const percent = info.getValue();
          const text = percent >= 75 ? 'Over Budget' : percent >= 50 ? 'On Track' : 'Under Budget';
          const bgColor =
            percent >= 75
              ? 'bg-red-100 text-red-800'
              : percent >= 50
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-green-100 text-green-800';
          return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor}`}>
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
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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
    { category: 'Utilities', budget: 200000, spent: 125000, percent: 63 },
    { category: 'Maintenance', budget: 300000, spent: 150000, percent: 50 },
    { category: 'Stationery', budget: 150000, spent: 75000, percent: 50 },
    { category: 'Events', budget: 500000, spent: 225000, percent: 45 },
    { category: 'Laboratory', budget: 200000, spent: 100000, percent: 50 },
    { category: 'Sports', budget: 150000, spent: 50000, percent: 33 },
    { category: 'Contingency', budget: 1000000, spent: 250000, percent: 25 },
  ];

  const recentExpenses = [
    { date: 'Mar 14', description: 'Science Lab Equipment', amount: 45000, approved: 'Principal', status: 'approved' },
    { date: 'Mar 13', description: 'Library Books', amount: 85000, approved: 'Principal', status: 'approved' },
    { date: 'Mar 12', description: 'Sports Day Trophies', amount: 25000, approved: 'Principal', status: 'approved' },
    { date: 'Mar 11', description: 'Printer Cartridges', amount: 15000, approved: null, status: 'pending' },
    { date: 'Mar 10', description: 'Annual Function Decor', amount: 50000, approved: 'Principal', status: 'approved' },
  ];

  const pendingApprovals = [
    { item: 'Computer Lab Upgrade', amount: 250000, department: 'IT Department', submitted: 'Mar 13' },
    { item: 'Playground Equipment', amount: 175000, department: 'Sports Dept', submitted: 'Mar 12' },
    { item: 'Staff Training Workshop', amount: 85000, department: 'HR Dept', submitted: 'Mar 10' },
  ];

  const vendorPayments = [
    { vendor: 'Book Supplier', amount: 350000, dueDate: 'March 22', status: 'due' },
    { vendor: 'Canteen Contract', amount: 120000, dueDate: 'March 18', status: 'due' },
    { vendor: 'Transport Contractor', amount: 200000, dueDate: 'March 20', status: 'due' },
    { vendor: 'Electricity Board', amount: 125000, dueDate: 'March 20', status: 'paid' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">EXPENSE MANAGEMENT - {selectedMonth}</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div>
                <p className="text-sm text-gray-600">Monthly Budget</p>
                <p className="font-medium">₹25,00,000</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Spent</p>
                <p className="font-medium">₹8,75,000 (35%)</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Remaining</p>
                <p className="font-medium">₹16,25,000</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Days Left</p>
                <p className="font-medium">16</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
            >
              <option>March 2025</option>
              <option>February 2025</option>
              <option>January 2025</option>
              <option>December 2024</option>
            </select>
            <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Expense Table */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
          <h2 className="text-xl font-semibold">EXPENSES BY CATEGORY</h2>
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline">
            View All Categories →
          </button>
        </div>

        <ExpenseCategoryTable data={expenseCategories} />
      </div>

      {/* Recent Expenses & Pending Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Expenses */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">RECENT EXPENSES</h2>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline">View All →</button>
          </div>

          <div className="space-y-4">
            {recentExpenses.map((expense, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  expense.status === 'approved'
                    ? 'border-green-200 bg-green-50'
                    : 'border-yellow-200 bg-yellow-50'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-bold text-lg">{expense.date} - {expense.description}</p>
                    <p className="text-sm text-gray-600">Amount: ₹{expense.amount.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        expense.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {expense.status === 'approved' ? '✅ Approved' : '⏳ Pending'}
                    </span>
                    {expense.approved && (
                      <p className="text-sm text-gray-600 mt-1">By: {expense.approved}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="text-sm text-blue-600 hover:text-blue-800 hover:underline">View Details</button>
                  <button className="text-sm text-gray-600 hover:text-gray-800 hover:underline">Download Bill</button>
                  {expense.status === 'pending' && (
                    <button className="text-sm text-green-600 hover:text-green-800 hover:underline">Approve</button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-3 bg-gray-50 rounded-lg flex justify-between">
            <span className="font-medium">Total This Month: ₹8,75,000</span>
            <span className="font-medium">Average Daily: ₹29,167</span>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              PENDING APPROVALS
            </h2>
            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
              {pendingApprovals.length} pending
            </span>
          </div>

          <div className="space-y-4">
            {pendingApprovals.map((approval, index) => (
              <div key={index} className="p-4 border border-red-200 bg-red-50 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-bold text-lg">{approval.item}</p>
                    <p className="text-sm text-gray-600">{approval.department}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-red-700 text-lg">
                      ₹{approval.amount.toLocaleString()}
                    </span>
                    <p className="text-sm text-gray-600">Submitted: {approval.submitted}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-4 rounded-lg">
                    Approve
                  </button>
                  <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm py-2 px-4 rounded-lg">
                    Request Revision
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-3 bg-yellow-50 rounded-lg flex items-center gap-3">
            <Clock className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="font-medium">Approval Deadline</p>
              <p className="text-sm text-gray-600">Process within 3 working days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Vendor Payments */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">VENDOR PAYMENTS DUE</h2>
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline">
            Schedule All →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {vendorPayments.map((payment, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                payment.status === 'paid'
                  ? 'border-green-200 bg-green-50'
                  : 'border-red-200 bg-red-50'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-medium">{payment.vendor}</p>
                  <p className="text-sm text-gray-600">Due: {payment.dueDate}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    payment.status === 'paid'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {payment.status === 'paid' ? 'PAID' : 'DUE'}
                </span>
              </div>

              <div className="text-2xl font-bold mb-4">₹{payment.amount.toLocaleString()}</div>

              {payment.status === 'due' ? (
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded-lg">
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
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-6">EXPENSE ANALYSIS</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-3xl font-bold text-blue-600">12%</div>
                <div className="text-sm text-gray-600">Increase from last month</div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-lg text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <DollarSign className="w-8 h-8 text-green-600" />
              <div>
                <div className="text-3xl font-bold text-green-600">₹1.2L</div>
                <div className="text-sm text-gray-600">Saved vs budget</div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Calendar className="w-8 h-8 text-purple-600" />
              <div>
                <div className="text-3xl font-bold text-purple-600">85%</div>
                <div className="text-sm text-gray-600">On-time payments</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-3 bg-gray-50 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-3">
          <div>
            <p className="font-medium">Monthly Report</p>
            <p className="text-sm text-gray-600">{selectedMonth} expense analysis</p>
          </div>
          <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium">
            <Download className="w-4 h-4" />
            Download Report
          </button>
        </div>
      </div>

      <div className="text-center">
        <Link
          to="/accountant"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium hover:underline"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default ExpenseManagement;