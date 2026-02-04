import React from 'react';
import { Bell, Search, Menu, Home } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Import the AuthContext

const Header = ({ onToggleSidebar, sidebarOpen }) => {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth(); // Get user from AuthContext

  const getPageTitle = () => {
    const path = location.pathname;
    const titles = {
      '/': 'Home',
      '/student': 'Student Dashboard',
      '/student/academic': 'Academic Records',
      '/student/fees': 'Fee Management',
      '/student/assignments': 'Assignments',
      '/student/profile': 'Student Profile',
      '/teacher': 'Teacher Dashboard',
      '/teacher/gradebook': 'Gradebook',
      '/teacher/assignments': 'Assignment Manager',
      '/teacher/profile': 'Teacher Profile',
      '/accountant': 'Finance Dashboard',
      '/accountant/salary': 'Salary Processing',
      '/accountant/expenses': 'Expense Management',
      // Add Term Fee Management routes
      '/accountant/term-fees': 'Term Fee Dashboard',
      '/accountant/term-fees/management': 'Term Management',
      '/accountant/term-fees/structures': 'Fee Structures',
      '/accountant/term-fees/additional-fees': 'Additional Fees',
      '/accountant/term-fees/reports': 'Fee Reports',
    };
    return titles[path] || 'Springfield High School Portal';
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.fullName) return 'U';
    
    const nameParts = user.fullName.trim().split(' ');
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };

  // Get user role for display
  const getUserRole = () => {
    if (!user || !user.role) {
      // Determine role from path as fallback
      const path = location.pathname;
      if (path.includes('/student')) return 'Student';
      if (path.includes('/teacher')) return 'Teacher';
      if (path.includes('/accountant')) return 'Accountant';
      return 'User';
    }
    
    // Capitalize the role for display
    return user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase();
  };

  // Get user name for display
  const getUserName = () => {
    if (user?.fullName) return user.fullName;
    if (user?.username) return user.username;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm transition-all duration-300 ${
      sidebarOpen ? 'lg:translate-x-0' : ''
    }`}>
      <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Left: Hamburger + Title */}
        <div className="flex items-center gap-4">
          {/* Hamburger (visible only on mobile) */}
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100/60 backdrop-blur-sm transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Home Button (always visible) */}
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-900 hover:text-blue-600 transition-all duration-200 font-medium group"
          >
            <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="text-lg font-semibold">Home</span>
          </Link>

          {/* Page Title */}
          <h1 className="text-lg font-bold hidden sm:block text-gray-800">/ {getPageTitle()}</h1>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {/* Search (hidden on small mobile) */}
          <div className="hidden md:block relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2.5 w-48 sm:w-64 border border-gray-300/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/30 text-sm bg-white/60 backdrop-blur-sm placeholder-gray-500 transition-all duration-200"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:bg-gray-100/60 backdrop-blur-sm rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 group">
            <Bell className="w-5 h-5 group-hover:animate-pulse" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </button>

          {/* User Profile */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center backdrop-blur-sm shadow-sm">
                <span className="font-semibold text-white text-sm">{getUserInitials()}</span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{getUserName()}</p>
                <p className="text-xs text-gray-500/80">{getUserRole()}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-linear-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center backdrop-blur-sm shadow-sm">
                <span className="font-semibold text-white text-sm">G</span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">Guest</p>
                <p className="text-xs text-gray-500/80">Not logged in</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;