// src/components/Auth/Login.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home,
  Lock,
  Mail,
  Eye,
  EyeOff,
  LogIn,
  User,
  CheckCircle
} from 'lucide-react';
import { FaGoogle, FaFacebook, FaTwitter } from 'react-icons/fa';

const Login = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-yellow-50 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Animated background elements - matching Home page */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-2000"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-4000"></div>
      </div>

      {/* Mobile-friendly container with Home page styling */}
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 relative z-10 border border-orange-100">
        
        {/* Home Button - Matching Home page style */}
        <Link 
          to="/" 
          className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center text-gray-600 hover:text-orange-600 transition-all group bg-white/80 backdrop-blur-sm px-3 py-2 rounded-full shadow-md hover:shadow-xl"
          aria-label="Go to home"
        >
          <Home className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
          <span className="ml-2 text-xs sm:text-sm font-medium group-hover:underline">
            Back to Home
          </span>
        </Link>

        {/* Decorative element */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-200 rounded-full opacity-20 blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-yellow-200 rounded-full opacity-20 blur-2xl"></div>

        {/* Header with Home page styling */}
        <div className="text-center mt-8 sm:mt-6 mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-linear-to-br from-orange-500 to-yellow-500 rounded-full mb-3 sm:mb-4 shadow-lg transform hover:scale-105 transition-transform">
            <LogIn className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold">
            <span className="bg-linear-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
              Welcome Back
            </span>
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
            Sign in to continue your journey
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
          {/* Username/Email field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              <span className="flex items-center gap-2">
                <Mail className="text-orange-500" size={16} />
                Username or Email
              </span>
            </label>
            <div className="relative group">
              <input
                type="text"
                {...register('username', { required: 'Username is required' })}
                className="w-full px-4 py-3 sm:py-3.5 text-sm sm:text-base bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all pl-11"
                placeholder="Enter your username or email"
              />
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={18} />
            </div>
            {errors.username && (
              <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center gap-1">
                <CheckCircle className="text-red-600" size={14} />
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Password field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              <span className="flex items-center gap-2">
                <Lock className="text-orange-500" size={16} />
                Password
              </span>
            </label>
            <div className="relative group">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password', { required: 'Password is required' })}
                className="w-full px-4 py-3 sm:py-3.5 text-sm sm:text-base bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all pl-11 pr-12"
                placeholder="Enter your password"
              />
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={18} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-orange-600 transition-colors bg-gray-100 hover:bg-orange-100 p-1.5 rounded-full"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center gap-1">
                <CheckCircle className="text-red-600" size={14} />
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Remember me and Forgot password */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember-me"
                className="h-4 w-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500"
              />
              <label htmlFor="remember-me" className="ml-2 text-xs sm:text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <Link to="/forgot-password" className="text-xs sm:text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors">
              Forgot password?
            </Link>
          </div>

          {/* Submit button with Home page styling */}
          <button
            type="submit"
            disabled={loading}
            className="w-full relative overflow-hidden rounded-xl bg-linear-to-r from-orange-600 to-yellow-600 text-white py-3.5 sm:py-4 px-4 text-sm sm:text-base font-semibold transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn className="group-hover:rotate-12 transition-transform" size={18} />
                  <span>Sign In</span>
                </>
              )}
            </span>
          </button>

        </form>

        {/* Register link */}
        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-xs sm:text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-orange-600 hover:text-orange-700 font-semibold transition-colors">
              Sign up
            </Link>
          </p>
        </div>


      </div>

      {/* Custom animations from Home page */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(5deg); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Login;