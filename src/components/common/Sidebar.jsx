import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  User, 
  BookOpen, 
  CreditCard, 
  FileText, 
  Users,
  BarChart3,
  Settings,
  LogOut,
  School,
  X,
  Calendar,
  DollarSign,
  PieChart,
  TrendingUp,
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const currentPath = location.pathname;
  
  let role = 'student';
  if (currentPath.includes('/teacher')) role = 'teacher';
  else if (currentPath.includes('/accountant')) role = 'accountant';

  const studentNav = [
    { name: 'Dashboard', icon: Home, path: '/student' },
    { name: 'Academic Records', icon: BookOpen, path: '/student/academic' },
    { name: 'Fee Payments', icon: CreditCard, path: '/student/fees' },
    { name: 'Assignments', icon: FileText, path: '/student/assignments' },
    { name: 'Profile', icon: User, path: '/student/profile' },
  ];

  const teacherNav = [
    { name: 'Dashboard', icon: Home, path: '/teacher' },
    { name: 'Gradebook', icon: BookOpen, path: '/teacher/gradebook' },
    { name: 'Assignments', icon: FileText, path: '/teacher/assignments' },
    { name: 'My Classes', icon: Users, path: '/teacher/classes' },
    { name: 'Profile', icon: User, path: '/teacher/profile' },
  ];

  const accountantNav = [
    { name: 'Dashboard', icon: Home, path: '/accountant' },
    { name: 'Salary Processing', icon: CreditCard, path: '/accountant/salary' },
    { name: 'Expense Management', icon: BarChart3, path: '/accountant/expenses' },
    { name: 'Fee Collection', icon: Users, path: '/accountant/fees' },
    { name: 'Transactions', icon: FileSpreadsheet, path: '/accountant/transactions' },
  ];

  // Term Allocation Sub-menu for Accountant
  const termAllocationNav = [
    { 
      name: 'Term Fee Dashboard', 
      icon: BarChart3, 
      path: '/accountant/term-fees',
      exact: true
    },
    { 
      name: 'Term Management', 
      icon: Calendar, 
      path: '/accountant/term-fees/management' 
    },
    { 
      name: 'Fee Structures', 
      icon: Layers, 
      path: '/accountant/term-fees/structures' 
    },
    { 
      name: 'Additional Fees', 
      icon: TrendingUp, 
      path: '/accountant/term-fees/additional-fees' 
    },
    { 
      name: 'Fee Reports', 
      icon: PieChart, 
      path: '/accountant/term-fees/reports' 
    },
  ];

  const navItems = role === 'student' ? studentNav : role === 'teacher' ? teacherNav : accountantNav;

  const getUserInfo = () => {
    if (!user) return { name: 'User', id: 'N/A' };
    
    switch(role) {
      case 'student': 
        return { 
          name: user.fullName || 'Student', 
          id: user.id ? `STU${user.id.substring(0, 8).toUpperCase()}` : 'STU000000' 
        };
      case 'teacher': 
        return { 
          name: user.fullName || 'Teacher', 
          id: user.id ? `TCH${user.id.substring(0, 8).toUpperCase()}` : 'TCH000000' 
        };
      case 'accountant': 
        return { 
          name: user.fullName || 'Accountant', 
          id: user.id ? `ACC${user.id.substring(0, 8).toUpperCase()}` : 'ACC000000' 
        };
      default: 
        return { 
          name: user.fullName || user.username || 'User', 
          id: user.id ? user.id.substring(0, 8).toUpperCase() : 'N/A' 
        };
    }
  };

  const userInfo = getUserInfo();

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) onClose();
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleHomeClick = () => {
    window.location.href = '/';
    if (window.innerWidth < 1024) onClose();
  };

  return (
    <>
      {/* Glassmorphic Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 backdrop-blur-md bg-black/40 lg:hidden animate-fadeIn"
          onClick={onClose}
        />
      )}

      {/* Mobile Sidebar - Slides from left */}
      <aside
        className={`lg:hidden fixed top-0 left-0 bottom-0 w-72 z-50 bg-white/95 backdrop-blur-xl border-r border-white/30 shadow-2xl transform transition-all duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Header with Close Button */}
          <div className="p-4 border-b border-gray-200/40">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-linear-to-br from-blue-100/80 to-blue-50/60 backdrop-blur-sm rounded-xl">
                  <School className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">Springfield High</h2>
                  <p className="text-xs text-gray-500 capitalize">{role} Portal</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100/50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Info in Mobile */}
            <div className="bg-linear-to-r from-gray-50/70 to-gray-100/50 backdrop-blur-sm p-3 rounded-xl border border-white/30 shadow-sm">
              <p className="font-semibold text-sm text-gray-900">{userInfo.name}</p>
              <p className="text-xs text-gray-500/80 mt-1 font-mono">{userInfo.id}</p>
              <p className="text-xs text-gray-500/60 mt-1">Role: {user?.role || role}</p>
            </div>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {/* Home Button for Mobile */}
            <button
              onClick={handleHomeClick}
              className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 mb-2 w-full text-left text-gray-700 hover:bg-gray-100/50 hover:shadow-sm"
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </button>

            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === `/${role}`}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-linear-to-r from-blue-100/80 to-blue-50/60 text-blue-700 backdrop-blur-sm shadow-sm' 
                      : 'text-gray-700 hover:bg-gray-100/50'
                  }`
                }
                onClick={handleLinkClick}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </NavLink>
            ))}

            {/* Term Allocation Sub-menu for Accountant (Mobile) */}
            {role === 'accountant' && (
              <div className="pt-4 mt-4 border-t border-gray-200/40">
                <div className="mb-3">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4">
                    Term Allocations
                  </h3>
                </div>
                <div className="space-y-1">
                  {termAllocationNav.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      end={item.exact}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                          isActive 
                            ? 'bg-linear-to-r from-indigo-100/80 to-indigo-50/60 text-indigo-700 backdrop-blur-sm shadow-sm' 
                            : 'text-gray-700 hover:bg-gray-100/50'
                        }`
                      }
                      onClick={handleLinkClick}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            )}
          </nav>

          {/* Mobile Bottom Actions - Always visible */}
          <div className="p-4 border-t border-gray-200/40 space-y-2 mt-auto">
            <NavLink
              to="/settings"
              className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100/50 transition-colors"
              onClick={handleLinkClick}
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </NavLink>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50/50 w-full transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Desktop Sidebar - Normal sidebar on left */}
      <aside className="hidden lg:flex flex-col w-72 h-[calc(100vh-4rem)] bg-white/90 backdrop-blur-xl border-r border-white/30 shadow-sm shrink-0 mt-16">
        <div className="flex flex-col h-full">
          {/* Logo & User Info */}
          <div className="p-6 border-b border-gray-200/40 space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-linear-to-br from-blue-100/80 to-blue-50/60 backdrop-blur-sm rounded-2xl shadow-sm">
                <School className="w-7 h-7 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Springfield High</h1>
                <p className="text-xs text-gray-500/80 capitalize mt-1">{role} Portal</p>
              </div>
            </div>

            {/* Home Button - Always at top */}
            <button
              onClick={handleHomeClick}
              className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 w-full text-left text-gray-700 hover:bg-gray-100/50 hover:shadow-sm"
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </button>

            <div className="bg-linear-to-r from-gray-50/70 to-gray-100/50 backdrop-blur-sm p-4 rounded-xl border border-white/30 shadow-sm">
              <p className="font-semibold text-sm text-gray-900">{userInfo.name}</p>
              <p className="text-xs text-gray-500/80 mt-1 font-mono">{userInfo.id}</p>
              <p className="text-xs text-gray-500/60 mt-1">Role: {user?.role || role}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-5 space-y-1.5 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === `/${role}`}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive 
                      ? 'bg-linear-to-r from-blue-100/80 to-blue-50/60 text-blue-700 backdrop-blur-sm shadow-sm' 
                      : 'text-gray-700 hover:bg-gray-100/50 hover:shadow-sm'
                  }`
                }
                onClick={handleLinkClick}
              >
                <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>{item.name}</span>
              </NavLink>
            ))}

            {/* Term Allocation Sub-menu for Accountant (Desktop) */}
            {role === 'accountant' && (
              <div className="pt-6 mt-4 border-t border-gray-200/40">
                <div className="mb-4">
                  <div className="flex items-center gap-2 px-4 mb-3">
                    <DollarSign className="w-4 h-4 text-indigo-500" />
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Term Allocations
                    </h3>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {termAllocationNav.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      end={item.exact}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                          isActive 
                            ? 'bg-linear-to-r from-indigo-100/80 to-indigo-50/60 text-indigo-700 backdrop-blur-sm shadow-sm' 
                            : 'text-gray-700 hover:bg-gray-100/50 hover:shadow-sm'
                        }`
                      }
                      onClick={handleLinkClick}
                    >
                      <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span>{item.name}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            )}
          </nav>

          {/* Bottom Actions */}
          <div className="p-5 border-t border-gray-200/40 space-y-2.5 mt-auto">
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-linear-to-r from-gray-100/70 to-gray-50/60 text-gray-900 backdrop-blur-sm shadow-sm' 
                    : 'text-gray-700 hover:bg-gray-100/50 hover:shadow-sm'
                }`
              }
              onClick={handleLinkClick}
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </NavLink>

            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-red-600 hover:bg-linear-to-r from-red-50/60 to-red-100/40 backdrop-blur-sm hover:shadow-sm w-full transition-all duration-200 group"
            >
              <LogOut className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;