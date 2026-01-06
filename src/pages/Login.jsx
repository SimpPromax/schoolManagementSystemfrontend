import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { School, Lock, Mail, User } from 'lucide-react'

const Login = () => {
  const [role, setRole] = useState('student')
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    // Redirect based on role
    if (role === 'student') navigate('/student')
    else if (role === 'teacher') navigate('/teacher')
    else if (role === 'accountant') navigate('/accountant')
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <School className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        {/* Login Card */}
        <div className="dashboard-card">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Role
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'student', label: 'Student', icon: User },
                  { id: 'teacher', label: 'Teacher', icon: User },
                  { id: 'accountant', label: 'Accountant', icon: User },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setRole(item.id)}
                      className={`p-3 rounded-lg border flex flex-col items-center transition-all ${
                        role === item.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mb-2 ${
                        role === item.id ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                      <span className={`text-sm font-medium ${
                        role === item.id ? 'text-blue-700' : 'text-gray-600'
                      }`}>
                        {item.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="btn-primary w-full py-3"
            >
              Sign In
            </button>

            {/* Demo Accounts */}
            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3">Demo Accounts:</p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="p-2 bg-blue-50 rounded">
                  <div className="font-medium">Student</div>
                  <div className="text-gray-600">student@demo.com</div>
                </div>
                <div className="p-2 bg-green-50 rounded">
                  <div className="font-medium">Teacher</div>
                  <div className="text-gray-600">teacher@demo.com</div>
                </div>
                <div className="p-2 bg-purple-50 rounded">
                  <div className="font-medium">Accountant</div>
                  <div className="text-gray-600">accountant@demo.com</div>
                </div>
              </div>
            </div>

            {/* Back to Home */}
            <div className="text-center">
              <Link to="/" className="text-blue-600 hover:text-blue-800 text-sm">
                ← Back to Home
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login