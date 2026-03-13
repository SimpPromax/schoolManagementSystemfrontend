import React, { useState } from 'react';
import { 
  Users,
  BookOpen,
  DollarSign,
  Calendar,
  TrendingUp,
  TrendingDown,
  Bell,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  UserPlus,
  GraduationCap,
  School,
  BarChart3,
  PieChart,
  Download,
  MoreVertical,
  Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [timeframe, setTimeframe] = useState('week');

  // Mock statistics data
  const stats = [
    {
      title: 'Total Students',
      value: '2,547',
      change: '+12.5%',
      trend: 'up',
      icon: GraduationCap,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Teachers',
      value: '186',
      change: '+5.2%',
      trend: 'up',
      icon: School,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Active Courses',
      value: '48',
      change: '+8.1%',
      trend: 'up',
      icon: BookOpen,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Revenue (Monthly)',
      value: '$124,500',
      change: '+18.3%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-orange-500 to-yellow-500',
      bgColor: 'bg-orange-50'
    }
  ];

  // Mock recent registrations
  const recentRegistrations = [
    {
      id: 1,
      name: 'Emma Watson',
      email: 'emma.w@example.com',
      role: 'STUDENT',
      date: '2024-03-15',
      status: 'pending',
      avatar: 'EW'
    },
    {
      id: 2,
      name: 'James Smith',
      email: 'james.s@example.com',
      role: 'TEACHER',
      date: '2024-03-15',
      status: 'approved',
      avatar: 'JS'
    },
    {
      id: 3,
      name: 'Maria Garcia',
      email: 'maria.g@example.com',
      role: 'PARENT',
      date: '2024-03-14',
      status: 'pending',
      avatar: 'MG'
    },
    {
      id: 4,
      name: 'David Johnson',
      email: 'david.j@example.com',
      role: 'ACCOUNTANT',
      date: '2024-03-14',
      status: 'rejected',
      avatar: 'DJ'
    },
    {
      id: 5,
      name: 'Sarah Williams',
      email: 'sarah.w@example.com',
      role: 'STUDENT',
      date: '2024-03-13',
      status: 'approved',
      avatar: 'SW'
    }
  ];

  // Mock upcoming events
  const upcomingEvents = [
    {
      id: 1,
      title: 'Faculty Meeting',
      date: '2024-03-20',
      time: '10:00 AM',
      attendees: 45,
      location: 'Conference Room A'
    },
    {
      id: 2,
      title: 'Parent-Teacher Conference',
      date: '2024-03-22',
      time: '2:00 PM',
      attendees: 120,
      location: 'School Hall'
    },
    {
      id: 3,
      title: 'Exam Board Meeting',
      date: '2024-03-25',
      time: '11:30 AM',
      attendees: 15,
      location: 'Admin Office'
    },
    {
      id: 4,
      title: 'Sports Day Planning',
      date: '2024-03-28',
      time: '3:00 PM',
      attendees: 25,
      location: 'Gymnasium'
    }
  ];

  // Mock system alerts
  const alerts = [
    {
      id: 1,
      type: 'warning',
      message: 'Server backup completed with warnings',
      time: '5 min ago'
    },
    {
      id: 2,
      type: 'success',
      message: 'New user registration pending approval',
      time: '15 min ago'
    },
    {
      id: 3,
      type: 'error',
      message: 'Payment gateway connection failed',
      time: '1 hour ago'
    },
    {
      id: 4,
      type: 'info',
      message: 'System update scheduled for tonight',
      time: '2 hours ago'
    }
  ];

  // Mock chart data for revenue
  const revenueData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    values: [12500, 15000, 18500, 16500, 21000, 19000, 22500]
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAlertIcon = (type) => {
    switch(type) {
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <Bell className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-yellow-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Welcome back, Admin! Here's what's happening today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">{stat.title}</p>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800">{stat.value}</h3>
                    <div className="flex items-center gap-1 mt-2">
                      {stat.trend === 'up' ? (
                        <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                      ) : (
                        <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
                      )}
                      <span className={`text-xs sm:text-sm font-medium ${
                        stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">vs last {timeframe}</span>
                    </div>
                  </div>
                  <div className={`p-2 sm:p-3 rounded-xl bg-linear-to-r ${stat.color} bg-opacity-10`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - 2/3 width on desktop */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Revenue Chart - Mock */}
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base sm:text-lg font-semibold text-gray-800">Revenue Overview</h2>
                <div className="flex items-center gap-2">
                  <select 
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    className="text-xs sm:text-sm border-2 border-gray-200 rounded-lg px-2 py-1 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                  >
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                  </select>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Download className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
              
              {/* Mock Chart - Simple bar chart representation */}
              <div className="h-48 sm:h-64 flex items-end justify-between gap-1 sm:gap-2 mb-2">
                {revenueData.values.map((value, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-linear-to-t from-orange-500 to-yellow-500 rounded-t-lg transition-all hover:from-orange-600 hover:to-yellow-600" 
                         style={{ height: `${(value / 25000) * 180}px` }}>
                    </div>
                    <span className="text-xs text-gray-600 mt-2">{revenueData.labels[index]}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-4">
                <span>Total: $125,000</span>
                <span>Average: $17,857</span>
                <span>Projected: $135,000</span>
              </div>
            </div>

            {/* Recent Registrations */}
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base sm:text-lg font-semibold text-gray-800">Recent Registrations</h2>
                <Link 
                  to="/admin/registrations"
                  className="text-xs sm:text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
                >
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                  View All
                </Link>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b-2 border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentRegistrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-linear-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                              {reg.avatar}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{reg.name}</p>
                              <p className="text-xs text-gray-500">{reg.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                            {reg.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(reg.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(reg.status)}`}>
                            {reg.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column - 1/3 width on desktop */}
          <div className="space-y-4 sm:space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                <Link 
                  to="/admin/registrations"
                  className="flex flex-col items-center p-3 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors group"
                >
                  <UserPlus className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs text-center text-gray-700">Review Registrations</span>
                </Link>
                <Link 
                  to="/admin/users"
                  className="flex flex-col items-center p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors group"
                >
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs text-center text-gray-700">Manage Users</span>
                </Link>
                <Link 
                  to="/admin/courses"
                  className="flex flex-col items-center p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors group"
                >
                  <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs text-center text-gray-700">Manage Courses</span>
                </Link>
                <Link 
                  to="#"
                  className="flex flex-col items-center p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors group"
                >
                  <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs text-center text-gray-700">Generate Reports</span>
                </Link>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base sm:text-lg font-semibold text-gray-800">Upcoming Events</h2>
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              </div>
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="shrink-0 w-10 h-10 bg-linear-to-br from-orange-500 to-yellow-500 rounded-lg flex flex-col items-center justify-center text-white">
                      <span className="text-xs font-bold">{new Date(event.date).getDate()}</span>
                      <span className="text-[10px]">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{event.title}</p>
                      <p className="text-xs text-gray-500">{event.time} • {event.location}</p>
                      <p className="text-xs text-gray-400">{event.attendees} attendees</p>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* System Alerts */}
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base sm:text-lg font-semibold text-gray-800">System Alerts</h2>
                <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              </div>
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg">
                    <div className="shrink-0">
                      {getAlertIcon(alert.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-gray-700">{alert.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;