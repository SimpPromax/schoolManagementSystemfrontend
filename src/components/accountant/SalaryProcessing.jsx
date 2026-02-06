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
  FileText,
  CreditCard,
  Building,
  Banknote,
  Printer,
  ChevronRight,
  Bell,
  Settings,
  Eye,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';

// ✅ Isolated Table Component
const SalaryBreakdownTable = ({ data }) => {
  const columns = useMemo(
    () => [
      {
        header: 'Category',
        accessorKey: 'category',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${row.original.iconBg} ${row.original.iconColor}`}>
              {row.original.icon}
            </div>
            <div>
              <div className="font-semibold text-gray-900">{row.original.category}</div>
              <div className="text-xs text-gray-500">{row.original.subtitle}</div>
            </div>
          </div>
        ),
      },
      {
        header: 'Employees',
        accessorKey: 'count',
        cell: ({ row }) => (
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{row.original.count}</div>
            <div className="text-xs text-gray-500">people</div>
          </div>
        ),
      },
      {
        header: 'Total Salary',
        accessorKey: 'totalSalary',
        cell: ({ row }) => (
          <div className="text-center">
            <div className="text-lg font-bold text-green-700">{row.original.totalSalary}</div>
            <div className="text-xs text-gray-500">monthly</div>
          </div>
        ),
      },
      {
        header: 'Average',
        accessorKey: 'avgPerPerson',
        cell: ({ row }) => (
          <div className="text-center">
            <div className="font-medium text-gray-900">{row.original.avgPerPerson}</div>
            <div className={`text-xs flex items-center justify-center gap-1 ${row.original.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {row.original.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {row.original.change}%
            </div>
          </div>
        ),
      },
      {
        header: 'Actions',
        accessorKey: 'actions',
        cell: () => (
          <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors">
            <Eye className="w-4 h-4" />
            View Details
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

const SalaryProcessing = () => {
  const [payrollMonth, setPayrollMonth] = useState('March 2025');
  const [selectedEmployee, setSelectedEmployee] = useState('Priya Sharma');

  const salaryBreakdown = [
    { 
      category: 'Teaching Staff', 
      subtitle: 'Faculty members',
      count: 45, 
      totalSalary: 'KSH 3.0M', 
      avgPerPerson: 'KSH 66,667',
      trend: 'up',
      change: '5.2',
      icon: <Users className="w-5 h-5" />,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    { 
      category: 'Admin Staff', 
      subtitle: 'Office & Management',
      count: 15, 
      totalSalary: 'KSH 750K', 
      avgPerPerson: 'KSH 50,000',
      trend: 'stable',
      change: '0.0',
      icon: <Building className="w-5 h-5" />,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    { 
      category: 'Support Staff', 
      subtitle: 'Maintenance & Support',
      count: 25, 
      totalSalary: 'KSH 750K', 
      avgPerPerson: 'KSH 30,000',
      trend: 'down',
      change: '2.1',
      icon: <Settings className="w-5 h-5" />,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
  ];

  const paymentMethods = [
    { 
      method: 'Bank Transfer', 
      count: 80, 
      percentage: 94, 
      totalAmount: 'KSH 4.2M',
      description: 'Direct bank deposit',
      icon: <CreditCard className="w-5 h-5" />,
      color: 'green'
    },
    { 
      method: 'Cheque', 
      count: 5, 
      percentage: 6, 
      totalAmount: 'KSH 300K',
      description: 'Physical cheques',
      icon: <FileText className="w-5 h-5" />,
      color: 'yellow'
    },
    { 
      method: 'Cash', 
      count: 0, 
      percentage: 0, 
      totalAmount: 'KSH 0',
      description: 'Not recommended',
      icon: <Banknote className="w-5 h-5" />,
      color: 'red'
    },
  ];

  const employees = [
    { name: 'Priya Sharma', id: 'TCH2020008', role: 'Mathematics Teacher', salary: 'KSH 75,000' },
    { name: 'Raj Patel', id: 'TCH2020015', role: 'Science Teacher', salary: 'KSH 72,000' },
    { name: 'Anita Desai', id: 'ADM2020003', role: 'Admin Manager', salary: 'KSH 55,000' },
    { name: 'Samuel Kariuki', id: 'SUP2020012', role: 'Maintenance Head', salary: 'KSH 35,000' },
  ];

  const quickActions = [
    { 
      icon: <Download className="w-5 h-5" />, 
      title: 'Generate Salary Slips', 
      subtitle: 'PDF for all employees',
      color: 'bg-blue-50 text-blue-700 hover:bg-blue-100',
      action: 'download'
    },
    { 
      icon: <CreditCard className="w-5 h-5" />, 
      title: 'Bank Transfer File', 
      subtitle: 'CSV for bank processing',
      color: 'bg-green-50 text-green-700 hover:bg-green-100',
      action: 'bank'
    },
    { 
      icon: <Printer className="w-5 h-5" />, 
      title: 'Print Cheques', 
      subtitle: '5 cheques ready',
      color: 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100',
      action: 'print'
    },
    { 
      icon: <FileText className="w-5 h-5" />, 
      title: 'Tax Reports', 
      subtitle: 'Monthly compliance',
      color: 'bg-purple-50 text-purple-700 hover:bg-purple-100',
      action: 'tax'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Salary Processing</h1>
            <p className="text-gray-600 mt-1">Springfield High School • Payroll Management</p>
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
          </div>
        </div>

        {/* Payroll Status Card */}
        <div className="bg-linear-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between">
            <div className="mb-6 lg:mb-0">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Payroll Month: {payrollMonth}</h2>
                  <p className="text-blue-100">Processing for March 2025</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/10 p-3 rounded-lg">
                  <p className="text-sm text-blue-200">Pay Date</p>
                  <p className="font-bold">March 25, 2025</p>
                </div>
                <div className="bg-white/10 p-3 rounded-lg">
                  <p className="text-sm text-blue-200">Total Employees</p>
                  <p className="font-bold text-2xl">85</p>
                </div>
                <div className="bg-white/10 p-3 rounded-lg">
                  <p className="text-sm text-blue-200">Total Outlay</p>
                  <p className="font-bold text-2xl">KSH 4.5M</p>
                </div>
                <div className="bg-white/10 p-3 rounded-lg">
                  <p className="text-sm text-blue-200">Status</p>
                  <p className="font-bold text-green-300">Processing</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <select
                className="bg-white/20 border border-white/30 text-white rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-white/50"
                value={payrollMonth}
                onChange={e => setPayrollMonth(e.target.value)}
              >
                <option>March 2025</option>
                <option>February 2025</option>
                <option>January 2025</option>
                <option>December 2024</option>
              </select>
              <button className="bg-white text-blue-700 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                Start Processing
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Salary Breakdown */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  Salary Breakdown
                </h2>
                <p className="text-gray-600 text-sm mt-1">Category-wise salary distribution</p>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
                Detailed Report <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <SalaryBreakdownTable data={salaryBreakdown} />

            <div className="mt-6 p-5 bg-linear-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <p className="font-semibold text-gray-900">TOTAL MONTHLY OUTLAY</p>
                  <p className="text-2xl font-bold text-blue-700">KSH 4,500,000</p>
                  <p className="text-sm text-gray-600">For {payrollMonth} • 85 employees</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">vs Previous Month</p>
                    <p className="font-bold text-green-600 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      +2.4%
                    </p>
                  </div>
                  <div className="h-10 w-px bg-gray-300"></div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Annual Budget</p>
                    <p className="font-bold">KSH 54M</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                Payment Methods
              </h2>
              <p className="text-gray-600 text-sm mt-1">Distribution by payment type</p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
              Processing
            </span>
          </div>

          <div className="space-y-4">
            {paymentMethods.map((method, idx) => (
              <div key={idx} className={`p-4 rounded-xl border ${
                method.color === 'green' ? 'border-green-200 bg-green-50/50' :
                method.color === 'yellow' ? 'border-yellow-200 bg-yellow-50/50' : 'border-red-200 bg-red-50/50'
              }`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      method.color === 'green' ? 'bg-green-100 text-green-600' :
                      method.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {method.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{method.method}</h3>
                      <p className="text-sm text-gray-600">{method.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">{method.totalAmount}</div>
                    <p className="text-sm text-gray-600">{method.count} employees</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Distribution</span>
                    <span className="font-medium">{method.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        method.color === 'green' ? 'bg-green-500' :
                        method.color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${method.percentage}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  {method.method === 'Bank Transfer' && (
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                      Generate Bank File
                    </button>
                  )}
                  {method.method === 'Cheque' && (
                    <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                      Print Cheques ({method.count})
                    </button>
                  )}
                  {method.method === 'Cash' && (
                    <button className="w-full bg-gray-200 text-gray-500 py-2 px-4 rounded-lg font-medium cursor-not-allowed">
                      Disabled
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Salary Slip Preview & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Employee Selection & Preview */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Salary Slip Preview
                </h2>
                <p className="text-gray-600 text-sm mt-1">View and download individual salary slips</p>
              </div>
              
              {/* Employee Selector */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Select Employee:</span>
                <select 
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedEmployee}
                  onChange={e => setSelectedEmployee(e.target.value)}
                >
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.name}>
                      {emp.name} ({emp.role})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Salary Slip Card */}
            <div className="p-6 border-2 border-blue-200 rounded-xl bg-linear-to-br from-white to-blue-50">
              <div className="mb-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Ms. {selectedEmployee}</h3>
                        <p className="text-gray-600">ID: TCH2020008 • Mathematics Teacher</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <p className="text-sm text-gray-600">Pay Period</p>
                        <p className="font-medium">Mar 1-31, 2025</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Payment Date</p>
                        <p className="font-medium">March 25, 2025</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Bank Account</p>
                        <p className="font-medium">Equity Bank • ****1234</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-green-700">KSH 65,500</div>
                    <p className="text-sm text-gray-600">Net Payable Amount</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Earnings */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h4 className="font-bold text-lg">EARNINGS</h4>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: 'Basic Salary', value: 'KSH 45,000' },
                      { label: 'Housing Allowance', value: 'KSH 15,000' },
                      { label: 'Travel Allowance', value: 'KSH 5,000' },
                      { label: 'Extra Classes', value: 'KSH 5,000' },
                      { label: 'Performance Bonus', value: 'KSH 5,000' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-100">
                        <span className="text-gray-700">{item.label}</span>
                        <span className="font-bold text-green-700">{item.value}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center p-3 bg-green-100 border border-green-200 rounded-lg">
                      <span className="font-bold text-gray-900">Total Earnings</span>
                      <span className="font-bold text-green-800 text-lg">KSH 75,000</span>
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <h4 className="font-bold text-lg">DEDUCTIONS</h4>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: 'Provident Fund', value: 'KSH 4,500' },
                      { label: 'Professional Tax', value: 'KSH 2,000' },
                      { label: 'Income Tax', value: 'KSH 3,000' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
                        <span className="text-gray-700">{item.label}</span>
                        <span className="font-bold text-red-700">{item.value}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center p-3 bg-red-100 border border-red-200 rounded-lg">
                      <span className="font-bold text-gray-900">Total Deductions</span>
                      <span className="font-bold text-red-800 text-lg">KSH 9,500</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium hover:underline">
                    <Eye className="w-4 h-4" />
                    Preview Full Slip
                  </button>
                  <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    <Download className="w-4 h-4" />
                    Download Salary Slip (PDF)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-600" />
                Quick Actions
              </h2>
              <p className="text-gray-600 text-sm mt-1">Process payroll efficiently</p>
            </div>
          </div>

          <div className="space-y-3">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                className={`w-full p-4 rounded-xl border border-gray-200 flex items-center justify-between ${action.color} hover:border-blue-300 transition-all duration-200`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white">
                    {action.icon}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">{action.title}</p>
                    <p className="text-sm opacity-75">{action.subtitle}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
            ))}
          </div>

          {/* Deadline Warning */}
          <div className="mt-6 p-4 bg-linear-to-r from-yellow-50 to-yellow-100 rounded-xl border border-yellow-200">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="font-bold text-gray-900">Payroll Deadline</p>
                <p className="text-sm text-gray-600">Complete processing by:</p>
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-700 mb-1">March 24, 2025</div>
              <div className="text-sm text-gray-600 bg-white/50 py-1 px-3 rounded-full inline-block">
                ⏰ 3 days remaining
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Need help with processing?</p>
            <div className="flex gap-2">
              <button className="flex-1 text-sm bg-white border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50">
                Contact Support
              </button>
              <button className="flex-1 text-sm bg-blue-50 text-blue-700 py-2 rounded-lg hover:bg-blue-100">
                View Guidelines
              </button>
            </div>
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
            <span className="text-sm text-gray-600">Payroll Processing v2.4 • Last updated: Today, 11:30 AM</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1 rounded-lg hover:bg-gray-100">
              Save Draft
            </button>
            <button className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
              Finalize Payroll
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryProcessing;