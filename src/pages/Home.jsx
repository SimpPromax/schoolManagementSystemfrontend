import React from 'react'
import { Link } from 'react-router-dom'
import { School, User, BookOpen, CreditCard, Users, BarChart3 } from 'lucide-react'

const Home = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-linear-to-br from-blue-500 to-blue-600 rounded-3xl mb-8 shadow-xl">
            <School className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Springfield High School
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Modern School Management System with Role-Based Access Control
          </p>
        </div>

        {/* Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Student Portal */}
          <div className="card card-hover p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-2xl mb-6">
                <User className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Student Portal</h2>
              <p className="text-gray-600">Access grades, assignments, schedule, and fees</p>
            </div>
            
            <div className="space-y-3 mb-6">
              {['View Academic Records', 'Check Fee Payments', 'Submit Assignments'].map((feature, idx) => (
                <div key={idx} className="flex items-center text-gray-700">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mr-3"></div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            
            <Link to="/student" className="btn-primary w-full inline-block text-center py-3">
              Access Student Portal
            </Link>
          </div>

          {/* Teacher Portal */}
          <div className="card card-hover p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-2xl mb-6">
                <Users className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Teacher Portal</h2>
              <p className="text-gray-600">Manage classes, grade assignments, track attendance</p>
            </div>
            
            <div className="space-y-3 mb-6">
              {['Manage Gradebooks', 'Track Student Progress', 'Post Assignments'].map((feature, idx) => (
                <div key={idx} className="flex items-center text-gray-700">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            
            <Link to="/teacher" className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg w-full inline-block text-center">
              Access Teacher Portal
            </Link>
          </div>

          {/* Accountant Portal */}
          <div className="card card-hover p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-2xl mb-6">
                <BarChart3 className="w-10 h-10 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Accountant Portal</h2>
              <p className="text-gray-600">Manage finances, process fees, track expenses</p>
            </div>
            
            <div className="space-y-3 mb-6">
              {['Process Salary Payments', 'Track Financial Reports', 'Manage Expenses'].map((feature, idx) => (
                <div key={idx} className="flex items-center text-gray-700">
                  <div className="w-2 h-2 rounded-full bg-purple-500 mr-3"></div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            
            <Link to="/accountant" className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg w-full inline-block text-center">
              Access Accountant Portal
            </Link>
          </div>
        </div>

        {/* System Stats */}
        <div className="card p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">System Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '1,250', label: 'Active Students', color: 'text-blue-600' },
              { value: '85', label: 'Teaching Staff', color: 'text-green-600' },
              { value: '₹2.5Cr', label: 'Annual Budget', color: 'text-purple-600' },
              { value: '98.2%', label: 'Satisfaction Rate', color: 'text-yellow-600' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-4xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Login Prompt */}
        <div className="text-center">
          <div className="inline-flex flex-col items-center">
            <p className="text-gray-600 mb-6 text-lg">Ready to get started?</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/login" 
                className="btn-primary py-3 px-8 rounded-lg"
              >
                Login to Your Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home