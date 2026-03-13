import React from 'react';
import { 
  Calendar, 
  CheckCircle, 
  Clock,
  Bell,
  TrendingUp,
  BookOpen,
  CreditCard,
  FileText,
  User,
  GraduationCap,
  Award,
  Zap,
  AlertCircle,
  ChevronRight,
  CalendarDays,
  BookMarked,
  Library,
  Phone,
  Mail,
  MapPin,
  Star,
  Flame,
  Target,
  Users,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const StudentDashboard = () => {
  const { user, isAuthenticated } = useAuth();

  // Get current school year
  const getSchoolYear = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    
    if (currentMonth >= 1) {
      return `${currentYear}-${currentYear + 1}`;
    } else {
      return `${currentYear - 1}-${currentYear}`;
    }
  };

  // Get formatted current date
  const getCurrentDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (user?.fullName) return user.fullName;
    if (user?.username) return user.username;
    if (user?.email) return user.email.split('@')[0];
    return 'Student';
  };

  // Get student class/grade
  const getStudentClass = () => {
    if (user?.class) return user.class;
    if (user?.grade) return `Grade ${user.grade}`;
    if (user?.section) return `Grade ${user.grade || '10'}-${user.section}`;
    return 'Grade 10-A';
  };

  // Get roll number
  const getRollNumber = () => {
    if (user?.rollNumber) return user.rollNumber;
    if (user?.studentId) return user.studentId;
    if (user?.id) return `STU${user.id.toString().padStart(5, '0')}`;
    return '25';
  };

  // Get class teacher
  const getClassTeacher = () => {
    if (user?.classTeacher) return user.classTeacher;
    if (user?.advisor) return user.advisor;
    return 'Ms. Sharma';
  };

  // Get fee status
  const getFeeStatus = () => {
    if (user?.feeStatus) {
      return user.feeStatus === 'paid' ? 'PAID' : 'PENDING';
    }
    return 'PAID';
  };

  // Get fee due date
  const getFeeDueDate = () => {
    if (user?.feeDueDate) {
      return new Date(user.feeDueDate).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    }
    return 'Jan 15, 2025';
  };

  // Mock data (would come from API in real app)
  const stats = [
    { 
      label: 'Attendance', 
      value: '92%', 
      icon: CheckCircle, 
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      change: '+2% from last month',
      trend: 'up'
    },
    { 
      label: 'Overall Grade', 
      value: 'A- (85%)', 
      icon: Award, 
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      change: '↑ 5% improvement',
      trend: 'up'
    },
    { 
      label: 'Fee Status', 
      value: getFeeStatus(), 
      icon: CreditCard, 
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      change: `Next due: ${getFeeDueDate()}`,
      trend: 'neutral'
    },
  ];

  const schedule = [
    { time: '8:30', subject: 'Mathematics', teacher: 'Ms. Sharma', room: '205', status: 'completed', icon: BookOpen },
    { time: '9:30', subject: 'Science', teacher: 'Mr. Patel', room: 'Lab 3', status: 'completed', icon: FlaskConical },
    { time: '10:30', subject: 'English', teacher: 'Ms. Lee', room: '210', status: 'in-progress', icon: BookMarked },
    { time: '11:30', subject: 'History', teacher: 'Mr. Brown', room: '215', status: 'upcoming', icon: Library },
  ];

  const upcomingAssignments = [
    { 
      subject: 'Mathematics', 
      title: 'Trigonometry Problems Set', 
      dueDate: 'Tomorrow, 5:00 PM', 
      priority: 'high',
      icon: BookOpen,
      maxMarks: 20,
      status: 'pending'
    },
    { 
      subject: 'Science', 
      title: 'Solar System Model', 
      dueDate: 'Friday, 11:59 PM', 
      priority: 'medium',
      icon: FlaskConical,
      maxMarks: 50,
      status: 'not-started'
    },
    { 
      subject: 'History', 
      title: 'Chapter 5: World War I', 
      dueDate: 'Next Monday, 8:00 AM', 
      priority: 'low',
      icon: Library,
      maxMarks: 30,
      status: 'not-started'
    },
  ];

  const recentGrades = [
    { subject: 'Math Quiz', topic: 'Algebra Fundamentals', score: 18, maxScore: 20, grade: 'A', percentage: 90, icon: BookOpen },
    { subject: 'Science Lab', topic: 'Chemistry Experiment', score: 15, maxScore: 15, grade: 'A+', percentage: 100, icon: FlaskConical },
    { subject: 'English Essay', topic: '"Importance of Reading"', score: 42, maxScore: 50, grade: 'B+', percentage: 84, icon: BookMarked },
  ];

  const announcements = [
    { 
      title: 'Parent-Teacher Meetings', 
      message: 'Schedule your meetings for March 20-25 through the portal',
      date: 'Today',
      icon: Users,
      color: 'blue',
      important: true
    },
    { 
      title: 'Sports Day 2025', 
      message: 'Annual Sports Day on March 30. Registrations open for all events',
      date: 'Yesterday',
      icon: Award,
      color: 'green',
      important: false
    },
    { 
      title: 'Library Early Closure', 
      message: 'Library will close early (3:00 PM) this Friday for maintenance',
      date: 'Mar 13',
      icon: Library,
      color: 'yellow',
      important: false
    },
  ];

  const quickLinks = [
    { icon: GraduationCap, label: 'Academic Records', path: '/student/academic', color: 'from-blue-500 to-blue-600', bgLight: 'bg-blue-50', iconColor: 'text-blue-600' },
    { icon: CreditCard, label: 'Fee Payments', path: '/student/fees', color: 'from-green-500 to-green-600', bgLight: 'bg-green-50', iconColor: 'text-green-600' },
    { icon: FileText, label: 'Assignments', path: '/student/assignments', color: 'from-purple-500 to-purple-600', bgLight: 'bg-purple-50', iconColor: 'text-purple-600' },
    { icon: User, label: 'Profile', path: '/student/profile', color: 'from-amber-500 to-amber-600', bgLight: 'bg-amber-50', iconColor: 'text-amber-600' },
    { icon: Calendar, label: 'Timetable', path: '/student/timetable', color: 'from-pink-500 to-pink-600', bgLight: 'bg-pink-50', iconColor: 'text-pink-600' },
    { icon: Target, label: 'Goals', path: '/student/goals', color: 'from-indigo-500 to-indigo-600', bgLight: 'bg-indigo-50', iconColor: 'text-indigo-600' },
  ];

  // Helper to get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'in-progress': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'upcoming': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Helper to get priority icon
  const getPriorityIcon = (priority) => {
    switch(priority) {
      case 'high': return <Zap className="w-3 h-3" />;
      case 'medium': return <AlertCircle className="w-3 h-3" />;
      case 'low': return <Clock className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto space-y-6">
{/* Welcome Card */}
<div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">

  {/* Header Gradient */}
  <div className="relative h-36 bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600">
    
    {/* Avatar */}
    <div className="absolute -bottom-12 left-6">
      <div className="w-24 h-24 rounded-2xl bg-white shadow-xl p-1">
        <div className="w-full h-full rounded-xl bg-linear-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
          <span className="text-3xl font-bold text-white">
            {user?.fullName ? user.fullName.charAt(0) : "S"}
          </span>
        </div>
      </div>
    </div>

  </div>

  {/* Body */}
  <div className="pt-16 px-6 pb-6">

    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

      {/* Student Info */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          {getUserDisplayName()}
        </h1>

        <div className="flex flex-wrap items-center gap-3 mt-3">

          <span className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium">
            <GraduationCap className="w-4 h-4" />
            {getStudentClass()} | Roll No: {getRollNumber()}
          </span>

          <span className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium">
            <CalendarDays className="w-4 h-4" />
            {getSchoolYear()}
          </span>

        </div>
      </div>

      {/* Quick Stats */}
      <div className="flex gap-4">

        <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-3 text-center min-w-27.5">
          <div className="text-xl font-bold text-blue-600">120</div>
          <div className="text-xs text-gray-500">Days Attended</div>
        </div>

        <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-5 py-3 text-center min-w-27.5">
          <div className="text-xl font-bold text-indigo-600">8</div>
          <div className="text-xs text-gray-500">Assignments</div>
        </div>

      </div>

    </div>

  </div>

  {/* Contact Bar */}
  <div className="bg-gray-50 border-t border-gray-100 px-6 py-4 flex flex-wrap gap-6 text-sm">

    <div className="flex items-center gap-2 text-gray-600">
      <Mail className="w-4 h-4 text-gray-400" />
      {user?.email || "student@school.edu"}
    </div>

    <div className="flex items-center gap-2 text-gray-600">
      <Phone className="w-4 h-4 text-gray-400" />
      {user?.phone || "+1 234 567 890"}
    </div>

    <div className="flex items-center gap-2 text-gray-600">
      <MapPin className="w-4 h-4 text-gray-400" />
      Class Teacher: {getClassTeacher()}
    </div>

  </div>

</div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                {/* Animated gradient background */}
                <div className={`absolute inset-0 bg-linear-to-r ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                
                <div className="relative p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                      <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                      <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                        {stat.trend === 'up' && <TrendingUp className="w-3 h-3 text-green-500" />}
                        {stat.change}
                      </p>
                    </div>
                    <div className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-6 h-6 ${stat.textColor}`} />
                    </div>
                  </div>
                  
                  {/* Progress bar for attendance/grade */}
                  {idx < 2 && (
                    <div className="mt-4">
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-linear-to-r ${stat.color} rounded-full transition-all duration-500`}
                          style={{ width: idx === 0 ? '92%' : '85%' }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Links Grid */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-500" />
              Quick Access
            </h2>
            <span className="text-xs text-gray-400">6 shortcuts available</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickLinks.map((link, idx) => {
              const Icon = link.icon;
              return (
                <Link
                  key={idx}
                  to={link.path}
                  className="group flex flex-col items-center p-4 rounded-xl border border-gray-100 hover:border-transparent hover:shadow-lg transition-all duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${link.bgLight} 0%, white 100%)`
                  }}
                >
                  <div className={`p-3 rounded-lg ${link.bgLight} group-hover:scale-110 transition-transform duration-300 mb-3`}>
                    <Icon className={`w-5 h-5 ${link.iconColor}`} />
                  </div>
                  <span className="text-xs font-medium text-gray-700 text-center group-hover:text-gray-900">
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                Today's Schedule
              </h2>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">{getCurrentDate()}</span>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 group">
                  Full Schedule
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {schedule.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div 
                    key={idx}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-md ${
                      item.status === 'completed' ? 'border-green-200 bg-green-50/30' :
                      item.status === 'in-progress' ? 'border-yellow-200 bg-yellow-50/30 animate-pulse' :
                      'border-gray-200 hover:border-blue-200'
                    }`}
                  >
                    {/* Time indicator */}
                    <div className="absolute -top-2 left-4 px-2 py-0.5 bg-white rounded-full text-xs font-medium border border-gray-200">
                      {item.time}
                    </div>
                    
                    <div className="mt-2">
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`p-2 rounded-lg ${
                          item.status === 'completed' ? 'bg-green-100' :
                          item.status === 'in-progress' ? 'bg-yellow-100' : 'bg-gray-100'
                        }`}>
                          <Icon className={`w-4 h-4 ${
                            item.status === 'completed' ? 'text-green-600' :
                            item.status === 'in-progress' ? 'text-yellow-600' : 'text-gray-600'
                          }`} />
                        </div>
                        <span className="font-semibold text-gray-900">{item.subject}</span>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <p className="text-gray-600">{item.teacher}</p>
                        <p className="text-gray-500">Room {item.room}</p>
                      </div>
                      
                      <div className="mt-3">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1).replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Deadlines */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-500" />
                  Upcoming Deadlines
                </h2>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                  {upcomingAssignments.filter(a => a.priority === 'high').length} urgent
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {upcomingAssignments.map((item, idx) => (
                  <div 
                    key={idx}
                    className="group relative p-4 rounded-xl border border-gray-200 hover:border-transparent hover:shadow-lg transition-all duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${
                        item.priority === 'high' ? '#FEE2E2' :
                        item.priority === 'medium' ? '#FEF3C7' : '#DBEAFE'
                      } 0%, white 100%)`
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${
                        item.priority === 'high' ? 'bg-red-100' :
                        item.priority === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
                      }`}>
                        <item.icon className={`w-5 h-5 ${
                          item.priority === 'high' ? 'text-red-600' :
                          item.priority === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                        }`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">{item.subject}</h3>
                            <p className="text-sm text-gray-600 mt-1">{item.title}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.priority)}`}>
                              {getPriorityIcon(item.priority)}
                              {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="w-3 h-3" />
                            <span>Due: {item.dueDate}</span>
                          </div>
                          <span className="text-xs font-medium text-gray-500">
                            Max Marks: {item.maxMarks}
                          </span>
                        </div>
                        
                        <div className="mt-3 flex gap-2">
                          <button className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-colors">
                            Start Now
                          </button>
                          <button className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition-colors">
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 text-center">
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-1 mx-auto">
                  View All Assignments
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Recent Grades */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Recent Grades
                </h2>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                  View All
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {recentGrades.map((item, idx) => (
                  <div 
                    key={idx}
                    className="group p-4 rounded-xl border border-gray-200 hover:border-green-200 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${
                        item.percentage >= 90 ? 'bg-green-100' :
                        item.percentage >= 80 ? 'bg-blue-100' : 'bg-yellow-100'
                      }`}>
                        <item.icon className={`w-5 h-5 ${
                          item.percentage >= 90 ? 'text-green-600' :
                          item.percentage >= 80 ? 'text-blue-600' : 'text-yellow-600'
                        }`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">{item.subject}</h3>
                            <p className="text-sm text-gray-600 mt-1">{item.topic}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-gray-900">
                              {item.score}/{item.maxScore}
                            </div>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              item.percentage >= 90 ? 'bg-green-100 text-green-700' :
                              item.percentage >= 80 ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {item.grade} ({item.percentage}%)
                            </span>
                          </div>
                        </div>
                        
                        {/* Mini progress bar */}
                        <div className="mt-3">
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                item.percentage >= 90 ? 'bg-green-500' :
                                item.percentage >= 80 ? 'bg-blue-500' : 'bg-yellow-500'
                              }`}
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Performance Summary */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-linear-to-br from-green-50 to-green-100 rounded-xl">
                  <Star className="w-4 h-4 text-green-600 mx-auto mb-1" />
                  <div className="text-sm font-bold text-green-700">92%</div>
                  <div className="text-xs text-gray-600">Average</div>
                </div>
                <div className="text-center p-3 bg-linear-to-br from-blue-50 to-blue-100 rounded-xl">
                  <Award className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                  <div className="text-sm font-bold text-blue-700">A-</div>
                  <div className="text-xs text-gray-600">Grade</div>
                </div>
                <div className="text-center p-3 bg-linear-to-br from-purple-50 to-purple-100 rounded-xl">
                  <Flame className="w-4 h-4 text-purple-600 mx-auto mb-1" />
                  <div className="text-sm font-bold text-purple-700">#5</div>
                  <div className="text-xs text-gray-600">Rank</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Announcements */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-500" />
                School Announcements
              </h2>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                {announcements.filter(a => a.important).length} important
              </span>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {announcements.map((item, idx) => (
                <div 
                  key={idx}
                  className={`group p-4 rounded-xl transition-all duration-300 cursor-pointer hover:shadow-md ${
                    item.important 
                      ? 'bg-linear-to-r from-red-50 to-orange-50 border-l-4 border-red-500' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${
                      item.color === 'blue' ? 'bg-blue-100' :
                      item.color === 'green' ? 'bg-green-100' :
                      item.color === 'yellow' ? 'bg-yellow-100' : 'bg-red-100'
                    }`}>
                      <item.icon className={`w-5 h-5 ${
                        item.color === 'blue' ? 'text-blue-600' :
                        item.color === 'green' ? 'text-green-600' :
                        item.color === 'yellow' ? 'text-yellow-600' : 'text-red-600'
                      }`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{item.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{item.message}</p>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                          {item.date}
                        </span>
                      </div>
                      
                      {item.important && (
                        <div className="mt-2 flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                            <Zap className="w-3 h-3" />
                            Important
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
};

// Missing icon import
const FlaskConical = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10 2v7.31" />
    <path d="M14 9.3V1.99" />
    <path d="M8.5 2h7" />
    <path d="M14 9.3a6.5 6.5 0 1 1-4 0" />
    <path d="M5.52 16h12.96" />
  </svg>
);

export default StudentDashboard;