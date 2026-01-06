import React, { useMemo, useState } from 'react';
import {
  DollarSign,
  Users,
  Calendar,
  Download,
  Filter,
  CheckCircle,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';

// ✅ Isolated Table Component (avoids React Compiler warning)
const SalaryBreakdownTable = ({ data }) => {
  const columns = useMemo(
    () => [
      {
        header: 'Category',
        accessorKey: 'category',
      },
      {
        header: 'Count',
        accessorKey: 'count',
      },
      {
        header: 'Total Salary',
        accessorKey: 'totalSalary',
      },
      {
        header: 'Avg/Person',
        accessorKey: 'avgPerPerson',
      },
      {
        header: 'Actions',
        accessorKey: 'actions',
        cell: () => (
          <button className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
            View List
          </button>
        ),
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

const SalaryProcessing = () => {
  const [payrollMonth, setPayrollMonth] = useState('March 2025');

  const salaryBreakdown = [
    { category: 'Teaching Staff', count: 45, totalSalary: '₹30,00,000', avgPerPerson: '₹66,667' },
    { category: 'Admin Staff', count: 15, totalSalary: '₹7,50,000', avgPerPerson: '₹50,000' },
    { category: 'Support Staff', count: 25, totalSalary: '₹7,50,000', avgPerPerson: '₹30,000' },
  ];

  const paymentMethods = [
    { method: 'Bank Transfer', count: 80, percentage: 94, totalAmount: '₹42,00,000' },
    { method: 'Cheque', count: 5, percentage: 6, totalAmount: '₹3,00,000' },
    { method: 'Cash', count: 0, percentage: 0, totalAmount: '₹0' },
  ];

  const quickActions = [
    { icon: <Download className="w-6 h-6 text-blue-600 mx-auto mb-2" />, title: 'Generate All Slips', subtitle: 'PDF format' },
    { icon: <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />, title: 'Bank Transfer File', subtitle: 'CSV format' },
    { icon: <Calendar className="w-6 h-6 text-purple-600 mx-auto mb-2" />, title: 'Print Cheques', subtitle: 'For 5 employees' },
    { icon: <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />, title: 'Update Software', subtitle: 'Accounting records' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SALARY PROCESSING - {payrollMonth}</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <p className="text-sm text-gray-600">Pay Date</p>
              <p className="font-medium">March 25, 2025</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Employees</p>
              <p className="font-medium">85</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Outlay</p>
              <p className="font-medium">₹45,00,000</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            value={payrollMonth}
            onChange={e => setPayrollMonth(e.target.value)}
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

      {/* Salary Breakdown */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
          <h2 className="text-xl font-semibold">SALARY BREAKDOWN BY CATEGORY</h2>
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline">
            View Detailed Report →
          </button>
        </div>

        <SalaryBreakdownTable data={salaryBreakdown} />

        <div className="mt-6 p-4 bg-blue-50 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-3">
          <div>
            <span className="font-semibold">TOTAL SALARY OUTLAY: ₹45,00,000</span>
            <p className="text-sm text-gray-600">For {payrollMonth}</p>
          </div>
          <div className="text-right">
            <span className="font-bold text-blue-700">85 employees</span>
            <p className="text-sm text-gray-600">Across all categories</p>
          </div>
        </div>
      </div>

      {/* Individual Salary Slip */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-6">INDIVIDUAL SALARY SLIP (Sample)</h2>

        <div className="p-6 border border-gray-200 rounded-lg bg-linear-to-r from-blue-50 to-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-600">EMPLOYEE</p>
              <p className="font-bold text-lg">Ms. Priya Sharma (TCH2020008)</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">DESIGNATION</p>
              <p className="font-bold text-lg">Mathematics Teacher</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">PAY PERIOD</p>
              <p className="font-bold text-lg">Mar 1-31, 2025</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Earnings */}
            <div>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" /> EARNINGS
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Basic Salary', value: '₹45,000' },
                  { label: 'HRA', value: '₹15,000' },
                  { label: 'Travel Allowance', value: '₹5,000' },
                  { label: 'Extra Classes', value: '₹5,000' },
                  { label: 'Performance Bonus', value: '₹5,000' },
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-gray-700">{item.label}</span>
                    <span className="font-bold text-green-700">{item.value}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center p-3 bg-green-100 border border-green-200 rounded-lg">
                  <span className="font-bold text-gray-900">TOTAL EARNINGS</span>
                  <span className="font-bold text-green-800">₹75,000</span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div>
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" /> DEDUCTIONS
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Provident Fund', value: '₹4,500' },
                  { label: 'Professional Tax', value: '₹2,000' },
                  { label: 'Income Tax', value: '₹3,000' },
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span className="text-gray-700">{item.label}</span>
                    <span className="font-bold text-red-700">{item.value}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center p-3 bg-red-100 border border-red-200 rounded-lg">
                  <span className="font-bold text-gray-900">TOTAL DEDUCTIONS</span>
                  <span className="font-bold text-red-800">₹9,500</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-100 border border-blue-200 rounded-lg">
                  <span className="font-bold text-gray-900">NET PAYABLE</span>
                  <span className="font-bold text-blue-800">₹65,500</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">BANK: State Bank | A/C: ****1234</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
              <Download className="w-4 h-4" /> Download Salary Slip
            </button>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
          <h2 className="text-xl font-semibold">PAYMENT METHODS</h2>
          <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
            Processing
          </span>
        </div>

        <div className="space-y-6">
          {paymentMethods.map((method, idx) => (
            <div key={idx} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-3 rounded-lg ${
                      method.method === 'Bank Transfer'
                        ? 'bg-green-100'
                        : method.method === 'Cheque'
                        ? 'bg-yellow-100'
                        : 'bg-red-100'
                    }`}
                  >
                    <DollarSign
                      className={`w-6 h-6 ${
                        method.method === 'Bank Transfer'
                          ? 'text-green-600'
                          : method.method === 'Cheque'
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{method.method}</h3>
                    <p className="text-sm text-gray-600">
                      {method.count} employees ({method.percentage}%)
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">{method.totalAmount}</div>
                  <p className="text-sm text-gray-600">Total amount</p>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    method.method === 'Bank Transfer'
                      ? 'bg-green-600'
                      : method.method === 'Cheque'
                      ? 'bg-yellow-600'
                      : 'bg-red-600'
                  }`}
                  style={{ width: `${method.percentage}%` }}
                />
              </div>

              <div className="mt-4 flex gap-2">
                {method.method === 'Bank Transfer' && (
                  <button className="bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-4 rounded-lg">
                    Generate Bank File
                  </button>
                )}
                {method.method === 'Cheque' && (
                  <button className="bg-yellow-600 hover:bg-yellow-700 text-white text-sm py-2 px-4 rounded-lg">
                    Print Cheques
                  </button>
                )}
                {method.method === 'Cash' && (
                  <button
                    className="bg-gray-200 text-gray-500 text-sm py-2 px-4 rounded-lg cursor-not-allowed"
                    disabled
                  >
                    Not Recommended
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-6">ACTIONS</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-center"
            >
              {action.icon}
              <p className="font-medium">{action.title}</p>
              <p className="text-sm text-gray-600">{action.subtitle}</p>
            </button>
          ))}
        </div>

        <div className="mt-6 p-4 bg-yellow-50 rounded-lg flex items-center gap-3">
          <Clock className="w-5 h-5 text-yellow-600" />
          <div>
            <p className="font-medium">Payroll Deadline</p>
            <p className="text-sm text-gray-600">Complete processing by March 24, 2025</p>
          </div>
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

export default SalaryProcessing;