import React from 'react'
import { 
  TrendingUp, CreditCard, Users, Calendar, Download, 
  CheckCircle, AlertCircle, DollarSign, BarChart3, 
  FileText, Bell, ChevronRight, Filter, Home,
  ArrowUpRight, ArrowDownRight
} from 'lucide-react'
import { Link } from 'react-router-dom'

const AccountantDashboard = () => {
  const financialOverview = [
    { category: 'Fee Collection', budget: 'KSH 25M', spent: 'KSH 18.0M', balance: 'KSH 7.0M', percentage: 72, trend: 'up' },
    { category: 'Salary', budget: 'KSH 7.5M', spent: 'KSH 4.5M', balance: 'KSH 3.0M', percentage: 60, trend: 'up' },
    { category: 'Infrastructure', budget: 'KSH 2.0M', spent: 'KSH 1.25M', balance: 'KSH 750K', percentage: 63, trend: 'stable' },
    { category: 'Operations', budget: 'KSH 1.5M', spent: 'KSH 875K', balance: 'KSH 625K', percentage: 58, trend: 'down' },
    { category: 'Events', budget: 'KSH 500K', spent: 'KSH 225K', balance: 'KSH 275K', percentage: 45, trend: 'down' },
  ]

  const feeStatus = [
    { class: 'Grade 10', total: 'KSH 4.5M', received: 'KSH 4.05M', pending: 'KSH 450K', percent: 90, students: 120 },
    { class: 'Grade 11', total: 'KSH 4.2M', received: 'KSH 3.57M', pending: 'KSH 630K', percent: 85, students: 115 },
    { class: 'Grade 12', total: 'KSH 4.8M', received: 'KSH 4.32M', pending: 'KSH 480K', percent: 90, students: 125 },
    { class: 'Junior School', total: 'KSH 11.5M', received: 'KSH 6.1M', pending: 'KSH 5.4M', percent: 53, students: 320 },
  ]

  const recentTransactions = [
    { date: 'Mar 14', student: 'Rohan Kumar', amount: 'KSH 25,000', mode: 'Online', receipt: 'RCP00123', status: 'success', time: '10:30 AM' },
    { date: 'Mar 13', student: 'Anjali Singh', amount: 'KSH 25,000', mode: 'Cash', receipt: 'RCP00245', status: 'success', time: '2:15 PM' },
    { date: 'Mar 12', student: 'John Smith', amount: 'KSH 16,000', mode: 'Cheque', receipt: 'RCP00367', status: 'success', time: '11:45 AM' },
    { date: 'Mar 11', student: 'Bulk Payment', amount: 'KSH 850K', mode: 'Online', receipt: 'BULK001', status: 'success', time: '4:20 PM' },
  ]

  const upcomingPayments = [
    { item: 'Teacher Salaries', amount: 'KSH 1.5M', dueDate: 'March 25', priority: 'high', icon: '👨‍🏫', daysLeft: 3 },
    { item: 'Electricity Bill', amount: 'KSH 125K', dueDate: 'March 20', priority: 'medium', icon: '⚡', daysLeft: -2 },
    { item: 'Book Supplier', amount: 'KSH 350K', dueDate: 'March 22', priority: 'high', icon: '📚', daysLeft: 1 },
    { item: 'Maintenance', amount: 'KSH 75,000', dueDate: 'March 18', priority: 'low', icon: '🔧', daysLeft: -4 },
  ]

  const statsCards = [
    { title: 'Total Revenue', value: 'KSH 36.5M', change: '+12.5%', icon: <DollarSign className="w-5 h-5" />, color: 'bg-blue-500', trend: 'up' },
    { title: 'Fee Collected', value: 'KSH 24.9M', change: '+8.2%', icon: <CreditCard className="w-5 h-5" />, color: 'bg-green-500', trend: 'up' },
    { title: 'Pending Fees', value: 'KSH 6.96M', change: '-3.1%', icon: <AlertCircle className="w-5 h-5" />, color: 'bg-yellow-500', trend: 'down' },
    { title: 'Upcoming Payments', value: 'KSH 2.05M', change: 'Due Soon', icon: <Calendar className="w-5 h-5" />, color: 'bg-purple-500', trend: 'warning' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Finance Dashboard</h1>
            <p className="text-gray-600 mt-1">Springfield High School • FY: 2024-2025</p>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              Export Report
            </button>
            <div className="relative">
              <Bell className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-900" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </div>
          </div>
        </div>

        {/* Welcome Card */}
        <div className="bg-linear-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">Welcome back, Rajesh Kumar!</h2>
              <p className="text-blue-100">Chief Accountant • ID: ACC2023005</p>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm">Last login: Today, 09:42 AM</span>
                </div>
                <div className="hidden md:block">
                  <span className="text-sm bg-blue-500/30 px-3 py-1 rounded-full">Session Active</span>
                </div>
              </div>
            </div>
            <div className="mt-6 md:mt-0 text-center md:text-right">
              <div className="text-3xl font-bold mb-1">KSH 24.9M</div>
              <div className="text-blue-200">Total Utilized (68%)</div>
              <div className="mt-3">
                <div className="w-48 bg-blue-500/30 rounded-full h-2">
                  <div className="bg-white rounded-full h-2" style={{ width: '68%' }}></div>
                </div>
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
                  stat.change === 'Due Soon' 
                    ? 'bg-red-100 text-red-800'
                    : stat.trend === 'up'
                    ? 'bg-green-100 text-green-800'
                    : stat.trend === 'warning'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : 
                   stat.trend === 'down' ? <ArrowDownRight className="w-3 h-3" /> : null}
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
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Financial Overview */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Financial Overview
                </h2>
                <p className="text-gray-600 text-sm mt-1">Annual Budget Allocation & Utilization</p>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
                View Details <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {financialOverview.map((item, idx) => (
                <div key={idx} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-all hover:bg-blue-50/30">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900">{item.category}</h3>
                      <p className="text-sm text-gray-600">Budget: {item.budget}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-gray-900">{item.balance}</div>
                      <div className="text-sm text-gray-600">Balance</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">Spent: {item.spent}</span>
                        <span className={`flex items-center gap-1 ${
                          item.trend === 'up' ? 'text-green-600' :
                          item.trend === 'down' ? 'text-red-600' : 'text-yellow-600'
                        }`}>
                          {item.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : 
                           item.trend === 'down' ? <ArrowDownRight className="w-3 h-3" /> : '→'}
                          {item.percentage}%
                        </span>
                      </div>
                      <span className={`font-medium px-2 py-1 rounded-full text-xs ${
                        item.percentage >= 80 ? 'bg-green-100 text-green-800' :
                        item.percentage >= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {item.percentage >= 80 ? 'High' : item.percentage >= 60 ? 'Moderate' : 'Low'} Utilization
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`h-2 rounded-full transition-all duration-500 ${
                        item.percentage >= 80 ? 'bg-green-500' :
                        item.percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`} style={{ width: `${item.percentage}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-5 bg-linear-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <p className="font-semibold text-gray-900">TOTAL ANNUAL BUDGET</p>
                  <p className="text-2xl font-bold text-blue-700">KSH 36.5M</p>
                  <p className="text-sm text-gray-600">FY 2024-2025 Allocation</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Total Spent</p>
                    <p className="font-bold text-gray-900">KSH 24.9M</p>
                  </div>
                  <div className="h-10 w-px bg-gray-300"></div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Utilization</p>
                    <p className="font-bold text-green-600">68%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fee Collection Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                Fee Collection
              </h2>
              <p className="text-gray-600 text-sm mt-1">Class-wise collection status</p>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
              Manage <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {feeStatus.map((item, idx) => (
              <div key={idx} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900">{item.class}</h3>
                    <p className="text-sm text-gray-600">{item.students} students • {item.total}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    item.percent >= 90 ? 'bg-green-100 text-green-800' :
                    item.percent >= 75 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {item.percent}%
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Collected: {item.received}</span>
                    <span className="text-red-600 font-medium">Due: {item.pending}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`h-2 rounded-full transition-all duration-500 ${
                      item.percent >= 90 ? 'bg-green-500' :
                      item.percent >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                    }`} style={{ width: `${item.percent}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900">Total Annual Target</p>
                <p className="text-2xl font-bold text-blue-600">KSH 25M</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">Collected</p>
                <p className="text-2xl font-bold text-green-600">KSH 18.0M</p>
              </div>
            </div>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <div className="h-2 rounded-full bg-green-500" style={{ width: '72%' }} />
            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <span>72% collected</span>
              <span>KSH 7.0M pending</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Transactions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Recent Transactions
                </h2>
                <p className="text-gray-600 text-sm mt-1">Last 7 days of fee collections</p>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {recentTransactions.map((txn, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        txn.mode === 'Online' ? 'bg-blue-100 text-blue-600' :
                        txn.mode === 'Cash' ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'
                      }`}>
                        {txn.mode === 'Online' ? '🌐' : txn.mode === 'Cash' ? '💵' : '🏦'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{txn.student}</p>
                        <p className="text-sm text-gray-600">{txn.date} • {txn.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-lg font-bold text-gray-900">{txn.amount}</span>
                        <div className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-full">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          <span className="text-xs font-medium">Paid</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Receipt: {txn.receipt}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-5 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Total this week</p>
                  <p className="text-xl font-bold text-gray-900">KSH 916,000</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Success rate</p>
                  <p className="font-bold text-green-600">100%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Payments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Upcoming Payments
              </h2>
              <p className="text-gray-600 text-sm mt-1">Scheduled payments & dues</p>
            </div>
            <Link to="/accountant/salary" className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
              Process All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {upcomingPayments.map((pay, idx) => (
              <div key={idx} className={`p-4 rounded-xl border ${
                pay.priority === 'high' ? 'border-red-200 bg-red-50/50' :
                pay.priority === 'medium' ? 'border-yellow-200 bg-yellow-50/50' : 'border-blue-200 bg-blue-50/50'
              } hover:shadow-sm transition-shadow`}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg text-xl ${
                      pay.priority === 'high' ? 'bg-red-100' :
                      pay.priority === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
                    }`}>
                      {pay.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{pay.item}</h3>
                      <p className="text-sm text-gray-600">Due: {pay.dueDate}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    pay.priority === 'high' ? 'bg-red-100 text-red-800' :
                    pay.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {pay.priority}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{pay.amount}</p>
                    <p className={`text-sm ${
                      pay.daysLeft < 0 ? 'text-red-600 font-medium' : 
                      pay.daysLeft < 3 ? 'text-yellow-600' : 'text-gray-600'
                    }`}>
                      {pay.daysLeft < 0 ? `Overdue by ${Math.abs(pay.daysLeft)} days` : 
                       pay.daysLeft === 0 ? 'Due today' : 
                       `${pay.daysLeft} days remaining`}
                    </p>
                  </div>
                  <button className={`px-4 py-2 rounded-lg font-medium text-sm ${
                    pay.priority === 'high' ? 'bg-red-600 hover:bg-red-700 text-white' :
                    pay.priority === 'medium' ? 'bg-yellow-600 hover:bg-yellow-700 text-white' : 
                    'bg-blue-600 hover:bg-blue-700 text-white'
                  } transition-colors`}>
                    Schedule
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Total Upcoming</p>
                <p className="text-xl font-bold text-gray-900">KSH 2.05M</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">High Priority</p>
                <p className="font-bold text-red-600">KSH 1.85M</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Footer */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 mb-2 md:mb-0">Quick Actions</h3>
          <p className="text-sm text-gray-600">Common tasks for quick access</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Process Fees
          </button>
          <button className="px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Generate Reports
          </button>
          <Link to="/accountant/salary" className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors flex items-center gap-2">
            <Users className="w-4 h-4" />
            Salary Processing
          </Link>
          <button className="px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            View Analytics
          </button>
          <button className="px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Data
          </button>
          <button className="px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2">
            <Home className="w-4 h-4" />
            Main Menu
          </button>
        </div>
      </div>
    </div>
  )
}

export default AccountantDashboard