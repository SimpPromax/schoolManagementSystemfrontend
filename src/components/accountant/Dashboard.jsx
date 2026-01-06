import React from 'react'
import { 
  TrendingUp, CreditCard, Users, Calendar, Download, CheckCircle, AlertTriangle, DollarSign, BarChart3
} from 'lucide-react'
import { Link } from 'react-router-dom'

const AccountantDashboard = () => {
  const financialOverview = [
    { category: 'Fee Collection', budget: '₹2,50,00,000', spent: '₹1,80,45,000', balance: '₹69,55,000', percentage: 72 },
    { category: 'Salary', budget: '₹75,00,000', spent: '₹45,00,000', balance: '₹30,00,000', percentage: 60 },
    { category: 'Infrastructure', budget: '₹20,00,000', spent: '₹12,50,000', balance: '₹7,50,000', percentage: 63 },
    { category: 'Operations', budget: '₹15,00,000', spent: '₹8,75,000', balance: '₹6,25,000', percentage: 58 },
    { category: 'Events', budget: '₹5,00,000', spent: '₹2,25,000', balance: '₹2,75,000', percentage: 45 },
  ]

  const feeStatus = [
    { class: 'Grade 10', total: '₹45,00,000', received: '₹40,50,000', pending: '₹4,50,000', percent: 90 },
    { class: 'Grade 11', total: '₹42,00,000', received: '₹35,70,000', pending: '₹6,30,000', percent: 85 },
    { class: 'Grade 12', total: '₹48,00,000', received: '₹43,20,000', pending: '₹4,80,000', percent: 90 },
    { class: 'Junior School', total: '₹1,15,00,000', received: '₹60,95,000', pending: '₹54,05,000', percent: 53 },
  ]

  const recentTransactions = [
    { date: 'Mar 14', student: 'Rohan Kumar', amount: '₹25,000', mode: 'Online', receipt: 'RCP00123', status: 'success' },
    { date: 'Mar 13', student: 'Anjali Singh', amount: '₹25,000', mode: 'Cash', receipt: 'RCP00245', status: 'success' },
    { date: 'Mar 12', student: 'John Smith', amount: '₹16,000', mode: 'Cheque', receipt: 'RCP00367', status: 'success' },
    { date: 'Mar 11', student: 'Bulk Payment', amount: '₹8,50,000', mode: 'Online', receipt: 'BULK001', status: 'success' },
  ]

  const upcomingPayments = [
    { item: 'Teacher Salaries', amount: '₹15,00,000', dueDate: 'March 25', priority: 'high' },
    { item: 'Electricity Bill', amount: '₹1,25,000', dueDate: 'March 20', priority: 'medium' },
    { item: 'Book Supplier', amount: '₹3,50,000', dueDate: 'March 22', priority: 'high' },
    { item: 'Maintenance', amount: '₹75,000', dueDate: 'March 18', priority: 'low' },
  ]

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="dashboard-card flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Springfield High - Finance Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome, Mr. Rajesh Kumar (Chief Accountant)</p>
          <div className="flex items-center gap-4 mt-3">
            <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">FY: 2024-2025</span>
            <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">Accountant ID: ACC2023005</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-gray-900">₹2.49Cr</div>
          <div className="text-sm text-gray-600">Utilized (68%)</div>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="dashboard-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-gray-500" />
            FINANCIAL OVERVIEW (2024-2025)
          </h2>
          <button className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>

        <div className="space-y-4">
          {financialOverview.map((item, idx) => (
            <div key={idx} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-all">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h3 className="font-bold text-lg">{item.category}</h3>
                  <p className="text-sm text-gray-600">Budget: {item.budget}</p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">{item.balance}</div>
                  <div className="text-sm text-gray-600">Balance</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Spent: {item.spent}</span>
                  <span className={`font-medium ${
                    item.percentage >= 80 ? 'text-green-600' :
                    item.percentage >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {item.percentage}% utilized
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className={`h-2 rounded-full ${
                    item.percentage >= 80 ? 'bg-green-600' :
                    item.percentage >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                  }`} style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg flex justify-between items-center">
          <div>
            <span className="font-semibold">TOTAL BUDGET: ₹3,65,00,000</span>
            <p className="text-sm text-gray-600 mt-1">Annual Allocation</p>
          </div>
          <div className="text-right">
            <span className="text-xl font-bold text-blue-700">UTILIZED: 68%</span>
            <p className="text-sm text-gray-600">₹2,49,95,000 spent</p>
          </div>
        </div>
      </div>

      {/* Fee Collection & Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Fee Collection */}
        <div className="dashboard-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-gray-500" />
              Fee Collection Status
            </h2>
            <Link to="#" className="text-sm text-blue-600 hover:text-blue-800 font-medium">View Details →</Link>
          </div>

          <div className="space-y-4">
            {feeStatus.map((item, idx) => (
              <div key={idx} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h3 className="font-bold">{item.class}</h3>
                    <p className="text-sm text-gray-600">Total: {item.total}</p>
                  </div>
                  <span className={`badge ${
                    item.percent >= 90 ? 'badge-success' :
                    item.percent >= 75 ? 'badge-warning' : 'badge-danger'
                  }`}>
                    {item.percent}% collected
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Received: {item.received}</span>
                    <span className="text-red-600 font-medium">Pending: {item.pending}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`h-2 rounded-full ${
                      item.percent >= 90 ? 'bg-green-600' :
                      item.percent >= 75 ? 'bg-yellow-600' : 'bg-red-600'
                    }`} style={{ width: `${item.percent}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-3 bg-gray-50 rounded-lg flex justify-between items-center">
            <div>
              <span className="font-medium">TOTAL FEES: ₹2,50,00,000</span>
              <p className="text-sm text-gray-600">Annual Target</p>
            </div>
            <div className="text-right">
              <span className="font-bold text-blue-700">RECEIVED: 72%</span>
              <p className="text-sm text-gray-600">₹1,80,35,000</p>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="dashboard-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-500" />
              Recent Transactions (Last 7 days)
            </h2>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">View All →</button>
          </div>

          <div className="space-y-3">
            {recentTransactions.map((txn, idx) => (
              <div key={idx} className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{txn.date} - {txn.student}</p>
                    <p className="text-sm text-gray-600">{txn.mode} | Receipt: {txn.receipt}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold text-green-700">{txn.amount}</span>
                    <div className="flex items-center justify-end text-green-600">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">Success</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Payments */}
      <div className="dashboard-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            Upcoming Payments Due
          </h2>
          <Link to="/accountant/salary" className="text-sm text-blue-600 hover:text-blue-800 font-medium">Process Salary →</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {upcomingPayments.map((pay, idx) => (
            <div key={idx} className={`p-4 rounded-lg border-l-4 ${
              pay.priority === 'high' ? 'border-red-500 bg-red-50' :
              pay.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' : 'border-blue-500 bg-blue-50'
            }`}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-medium">{pay.item}</p>
                  <p className="text-sm text-gray-600">Due: {pay.dueDate}</p>
                </div>
                <span className={`badge ${
                  pay.priority === 'high' ? 'badge-danger' :
                  pay.priority === 'medium' ? 'badge-warning' : 'badge-secondary'
                }`}>{pay.priority}</span>
              </div>
              <div className="text-2xl font-bold mb-3">{pay.amount}</div>
              <button className="btn-primary w-full text-sm py-2">Schedule Payment</button>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default AccountantDashboard
