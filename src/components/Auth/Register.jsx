// src/components/Auth/Register.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import { 
  Home,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  CheckCircle,
  UserPlus,
  Briefcase,
  ChevronDown,
  GraduationCap,
  School,
  Users,
  UserCog,
  Calculator,
  Check
} from 'lucide-react';
import { FaGoogle, FaFacebook, FaTwitter } from 'react-icons/fa';

const Register = () => {
  const { register: registerUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState('STUDENT');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const dropdownRef = useRef(null);

  const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm({
    defaultValues: {
      role: 'STUDENT'
    }
  });

  const password = watch('password');

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    
    try {
      const result = await registerUser(data);
      if (!result.success) {
        setError(result.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { value: 'STUDENT', label: 'Student', icon: GraduationCap },
    { value: 'TEACHER', label: 'Teacher', icon: School },
    { value: 'PARENT', label: 'Parent', icon: Users },
    { value: 'STAFF', label: 'Staff', icon: UserCog },
    { value: 'ACCOUNTANT', label: 'Accountant', icon: Calculator }
  ];

  const handleRoleSelect = (roleValue) => {
    setSelectedRole(roleValue);
    setValue('role', roleValue);
    setIsDropdownOpen(false);
  };

  const getSelectedRoleDetails = () => {
    return roles.find(r => r.value === selectedRole) || roles[0];
  };

  const selectedRoleDetails = getSelectedRoleDetails();
  const SelectedIcon = selectedRoleDetails.icon;

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-orange-50 via-white to-yellow-50 p-3 sm:p-4 relative overflow-hidden">
      
      {/* Animated background elements - matching Home page */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-2000"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-4000"></div>
      </div>

      {/* Mobile-friendly container with Home page styling */}
      <div className="w-full max-w-2xl animate-fade-in relative z-10">
        <div className="bg-white/90 backdrop-blur-md p-4 sm:p-6 md:p-8 rounded-3xl shadow-2xl relative border border-orange-100">
          
          {/* Home Button - Matching Home page style */}
          <Link 
            to="/" 
            className="absolute top-3 left-3 sm:top-4 sm:left-4 md:top-6 md:left-6 flex items-center text-gray-600 hover:text-orange-600 transition-all group bg-white/80 backdrop-blur-sm px-3 py-2 rounded-full shadow-md hover:shadow-xl z-10"
            aria-label="Go to home"
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
            <span className="ml-2 text-xs sm:text-sm md:text-sm font-medium group-hover:underline">
              Back to Home
            </span>
          </Link>

          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-200 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-yellow-200 rounded-full opacity-20 blur-3xl"></div>

          {/* Logo & Header with Home page styling */}
          <div className="text-center mt-6 sm:mt-8 mb-4 sm:mb-6 md:mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-20 md:h-20 bg-linear-to-br from-orange-500 to-yellow-500 rounded-full mb-3 sm:mb-4 shadow-lg transform hover:scale-105 transition-transform">
              <UserPlus className="w-8 h-8 sm:w-10 sm:h-10 md:w-10 md:h-10 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-3xl font-bold">
              <span className="bg-linear-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                Create Account
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">Join our school community</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs sm:text-sm flex items-center gap-2">
              <CheckCircle className="text-red-600 shrink-0" size={16} />
              {error}
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5 md:space-y-6">
            {/* Two column layout becomes single column on mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  <span className="flex items-center gap-2">
                    <User className="text-orange-500" size={16} />
                    Username *
                  </span>
                </label>
                <div className="relative group">
                  <input
                    id="username"
                    type="text"
                    {...register('username', { 
                      required: 'Username is required',
                      minLength: { value: 3, message: 'Username must be at least 3 characters' }
                    })}
                    className="w-full px-4 py-2.5 sm:py-3 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all pl-10"
                    placeholder="Choose a username"
                  />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={16} />
                </div>
                {errors.username && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <CheckCircle className="text-red-600" size={12} />
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  <span className="flex items-center gap-2">
                    <Mail className="text-orange-500" size={16} />
                    Email *
                  </span>
                </label>
                <div className="relative group">
                  <input
                    id="email"
                    type="email"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    className="w-full px-4 py-2.5 sm:py-3 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all pl-10"
                    placeholder="your@email.com"
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={16} />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <CheckCircle className="text-red-600" size={12} />
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                <span className="flex items-center gap-2">
                  <User className="text-orange-500" size={16} />
                  Full Name *
                </span>
              </label>
              <div className="relative group">
                <input
                  id="fullName"
                  type="text"
                  {...register('fullName', { 
                    required: 'Full name is required',
                    minLength: { value: 2, message: 'Full name must be at least 2 characters' }
                  })}
                  className="w-full px-4 py-2.5 sm:py-3 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all pl-10"
                  placeholder="Enter your full name"
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={16} />
              </div>
              {errors.fullName && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <CheckCircle className="text-red-600" size={12} />
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  <span className="flex items-center gap-2">
                    <Lock className="text-orange-500" size={16} />
                    Password *
                  </span>
                </label>
                <div className="relative group">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', { 
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Password must be at least 6 characters' }
                    })}
                    className="w-full px-4 py-2.5 sm:py-3 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all pl-10 pr-12"
                    placeholder="Create a password"
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={16} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-orange-600 transition-colors bg-gray-100 hover:bg-orange-100 p-1.5 rounded-full"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <CheckCircle className="text-red-600" size={12} />
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  <span className="flex items-center gap-2">
                    <Lock className="text-orange-500" size={16} />
                    Confirm Password *
                  </span>
                </label>
                <div className="relative group">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...register('confirmPassword', { 
                      required: 'Please confirm your password',
                      validate: value => value === password || 'Passwords do not match'
                    })}
                    className="w-full px-4 py-2.5 sm:py-3 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all pl-10 pr-12"
                    placeholder="Confirm password"
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={16} />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-orange-600 transition-colors bg-gray-100 hover:bg-orange-100 p-1.5 rounded-full"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <CheckCircle className="text-red-600" size={12} />
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            {/* Phone and Role */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
              <div>
                <label htmlFor="phone" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  <span className="flex items-center gap-2">
                    <Phone className="text-orange-500" size={16} />
                    Phone Number
                  </span>
                </label>
                <div className="relative group">
                  <input
                    id="phone"
                    type="tel"
                    {...register('phone', {
                      pattern: {
                        value: /^\+?[0-9\s\-()]{7,15}$/,
                        message: 'Invalid phone number'
                      }
                    })}
                    className="w-full px-4 py-2.5 sm:py-3 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all pl-10"
                    placeholder="+1 (555) 123-4567"
                  />
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={16} />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <CheckCircle className="text-red-600" size={12} />
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Custom Role Dropdown - Reduced Width */}
              <div className="md:col-span-1">
                <label htmlFor="role" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  <span className="flex items-center gap-2">
                    <Briefcase className="text-orange-500" size={16} />
                    Role *
                  </span>
                </label>
                
                {/* Hidden input for react-hook-form */}
                <input
                  type="hidden"
                  {...register('role', { required: 'Role is required' })}
                  value={selectedRole}
                />
                
                {/* Custom dropdown trigger - width adjusted to content */}
                <div className="relative" ref={dropdownRef}>
                  <div
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`inline-flex items-center px-4 py-2.5 sm:py-3 text-sm border-2 rounded-xl 
                             transition-all cursor-pointer
                             ${isDropdownOpen 
                               ? 'border-orange-500 ring-2 ring-orange-200' 
                               : 'border-gray-200 hover:border-orange-300'
                             } bg-white min-w-45`}
                  >
                    <div className="flex items-center justify-between w-full gap-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1 rounded-full bg-amber-100">
                          <SelectedIcon className="w-4 h-4 text-amber-600" />
                        </div>
                        <span className="text-gray-700 whitespace-nowrap">{selectedRoleDetails.label}</span>
                      </div>
                      <ChevronDown 
                        className={`text-gray-400 transition-transform duration-200 shrink-0 ${
                          isDropdownOpen ? 'rotate-180' : ''
                        }`} 
                        size={18} 
                      />
                    </div>
                  </div>

                  {/* Custom dropdown menu - aligned to trigger width */}
                  {isDropdownOpen && (
                    <div className="absolute z-20 mt-1 bg-white border-2 border-orange-100 rounded-xl shadow-xl overflow-hidden animate-fade-in-dropdown min-w-45">
                      {roles.map((role) => {
                        const IconComponent = role.icon;
                        const isSelected = selectedRole === role.value;
                        
                        return (
                          <div
                            key={role.value}
                            onClick={() => handleRoleSelect(role.value)}
                            className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-all
                                      ${isSelected 
                                        ? 'bg-amber-50 text-amber-700' 
                                        : 'hover:bg-gray-50 text-gray-700'
                                      }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`p-1.5 rounded-full ${
                                isSelected ? 'bg-amber-100' : 'bg-gray-100'
                              }`}>
                                <IconComponent className={`w-4 h-4 ${
                                  isSelected ? 'text-amber-600' : 'text-gray-500'
                                }`} />
                              </div>
                              <span className={`text-sm font-medium whitespace-nowrap ${
                                isSelected ? 'text-amber-700' : 'text-gray-700'
                              }`}>
                                {role.label}
                              </span>
                            </div>
                            {isSelected && (
                              <Check className="w-4 h-4 text-amber-600 shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {errors.role && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <CheckCircle className="text-red-600" size={12} />
                    {errors.role.message}
                  </p>
                )}
              </div>
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                <span className="flex items-center gap-2">
                  <MapPin className="text-orange-500" size={16} />
                  Address
                </span>
              </label>
              <div className="relative group">
                <textarea
                  id="address"
                  {...register('address', {
                    maxLength: { value: 500, message: 'Address is too long' }
                  })}
                  className="w-full px-4 py-2.5 sm:py-3 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all pl-10"
                  placeholder="Enter your address"
                  rows="3"
                />
                <MapPin className="absolute left-3 top-3 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={16} />
              </div>
              {errors.address && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <CheckCircle className="text-red-600" size={12} />
                  {errors.address.message}
                </p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  {...register('terms', { required: 'You must accept the terms and conditions' })}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-2">
                <label htmlFor="terms" className="text-xs sm:text-sm text-gray-700">
                  I agree to the{' '}
                  <Link to="/terms" className="text-orange-600 hover:text-orange-700 font-medium">
                    Terms and Conditions
                  </Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-orange-600 hover:text-orange-700 font-medium">
                    Privacy Policy
                  </Link>
                </label>
                {errors.terms && (
                  <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                    <CheckCircle className="text-red-600" size={12} />
                    {errors.terms.message}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button with Home page styling */}
            <button
              type="submit"
              disabled={loading}
              className="w-full relative overflow-hidden rounded-xl bg-linear-to-r from-orange-600 to-yellow-600 text-white py-3.5 sm:py-4 px-4 text-sm sm:text-base font-semibold transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" color="white" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="group-hover:rotate-12 transition-transform" size={18} />
                    <span>Create Account</span>
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-xs sm:text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-orange-600 hover:text-orange-700 font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Custom animations from Home page */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(5deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInDropdown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-fade-in-dropdown {
          animation: fadeInDropdown 0.2s ease-out;
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

export default Register;