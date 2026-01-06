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
  User
} from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const stats = [
    { 
      label: 'Attendance', 
      value: '92%', 
      icon: CheckCircle, 
      color: 'text-green-600',
      change: '+2% from last month'
    },
    { 
      label: 'Overall Grade', 
      value: 'A- (85%)', 
      icon: TrendingUp, 
      color: 'text-blue-600',
      change: '↑ 5% improvement'
    },
    { 
      label: 'Fee Status', 
      value: 'PAID ✅', 
      icon: CheckCircle, 
      color: 'text-green-600',
      change: 'Next due: Jan 15, 2025'
    },
  ];

  const schedule = [
    { time: '8:30', subject: 'Mathematics', teacher: 'Ms. Sharma', room: '205', status: 'completed' },
    { time: '9:30', subject: 'Science', teacher: 'Mr. Patel', room: 'Lab 3', status: 'completed' },
    { time: '10:30', subject: 'English', teacher: 'Ms. Lee', room: '210', status: 'in-progress' },
    { time: '11:30', subject: 'History', teacher: 'Mr. Brown', room: '215', status: 'upcoming' },
  ];

  const quickLinks = [
    { icon: BookOpen, label: 'Academic Records', path: '/student/academic', color: 'bg-blue-100 text-blue-600' },
    { icon: CreditCard, label: 'Fee Payments', path: '/student/fees', color: 'bg-green-100 text-green-600' },
    { icon: FileText, label: 'Assignments', path: '/student/assignments', color: 'bg-purple-100 text-purple-600' },
    { icon: User, label: 'Profile', path: '/student/profile', color: 'bg-yellow-100 text-yellow-600' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Springfield High School - Student Portal
        </h1>
        <p className="text-gray-600 mt-2">
          Welcome, John Smith (Grade 10-A | Roll No: 25)
        </p>
        <div className="flex items-center gap-4 mt-4">
          <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
            Academic Year: 2024-2025
          </span>
          <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
            Class Teacher: Ms. Sharma
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-md transition-all">
              <div className={`inline-flex p-3 rounded-lg bg-opacity-10 ${stat.color.replace('text', 'bg')}`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <h3 className="text-2xl font-bold mt-4">{stat.value}</h3>
              <p className="text-gray-600 font-medium">{stat.label}</p>
              <p className="text-sm text-gray-500 mt-2">{stat.change}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Links */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickLinks.map((link, idx) => {
            const Icon = link.icon;
            const [bgColor, textColor] = link.color.split(' ');
            return (
              <Link
                key={idx}
                to={link.path}
                className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all group"
              >
                <div className={`p-3 rounded-lg mb-3 ${bgColor}`}>
                  <Icon className={`w-6 h-6 ${textColor}`} />
                </div>
                <span className="font-medium text-gray-700 group-hover:text-blue-600">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            Today's Schedule (Monday, March 15)
          </h2>
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            View Full Schedule →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Time</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Subject</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Teacher</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Room</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {schedule.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium">{item.time}</td>
                  <td className="px-6 py-3 font-semibold">{item.subject}</td>
                  <td className="px-6 py-3">{item.teacher}</td>
                  <td className="px-6 py-3">{item.room}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                      item.status === 'completed' ? 'bg-green-100 text-green-700' :
                      item.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-200 text-gray-700'
                    }`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Deadlines */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-500" />
              Upcoming Deadlines
            </h2>
            <span className="inline-flex px-3 py-1 text-sm font-medium bg-red-100 text-red-700 rounded-full">3 pending</span>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Math Assignment</p>
                  <p className="text-sm text-gray-600">Trigonometry Problems Set</p>
                </div>
                <span className="text-sm font-semibold text-red-600">Tomorrow</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Due: Mar 16, 5:00 PM | Max Marks: 20</p>
            </div>
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Science Project</p>
                  <p className="text-sm text-gray-600">Solar System Model</p>
                </div>
                <span className="text-sm font-semibold text-yellow-600">Friday</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">Due: Mar 20 | Max Marks: 50</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">History Test</p>
                  <p className="text-sm text-gray-600">Chapter 5: World War I</p>
                </div>
                <span className="text-sm font-semibold text-gray-600">Next Monday</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Grades */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-gray-500" />
              Recent Grades
            </h2>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              View All →
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium">Math Quiz</p>
                <p className="text-sm text-gray-600">Algebra Fundamentals</p>
              </div>
              <div className="text-right">
                <span className="font-bold text-green-700 text-lg">18/20</span>
                <div className="text-sm font-medium text-green-800">A (90%)</div>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium">Science Lab</p>
                <p className="text-sm text-gray-600">Chemistry Experiment</p>
              </div>
              <div className="text-right">
                <span className="font-bold text-green-700 text-lg">15/15</span>
                <div className="text-sm font-medium text-green-800">A+ (100%)</div>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium">English Essay</p>
                <p className="text-sm text-gray-600">"Importance of Reading"</p>
              </div>
              <div className="text-right">
                <span className="font-bold text-blue-700 text-lg">42/50</span>
                <div className="text-sm font-medium text-blue-800">B+ (84%)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* School Announcements */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Bell className="w-5 h-5 text-gray-500" />
            School Announcements
          </h2>
          <span className="inline-flex px-3 py-1 text-sm font-medium bg-gray-200 text-gray-700 rounded-full">3 new</span>
        </div>
        <div className="space-y-3">
          <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
            <p className="font-medium">Parent-Teacher Meetings</p>
            <p className="text-sm text-gray-600">Schedule your meetings for March 20-25 through the portal</p>
            <p className="text-xs text-gray-500 mt-1">Posted: Today</p>
          </div>
          <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
            <p className="font-medium">Sports Day 2025</p>
            <p className="text-sm text-gray-600">Annual Sports Day on March 30. Registrations open for all events</p>
            <p className="text-xs text-gray-500 mt-1">Posted: Yesterday</p>
          </div>
          <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg">
            <p className="font-medium">Library Early Closure</p>
            <p className="text-sm text-gray-600">Library will close early (3:00 PM) this Friday for maintenance</p>
            <p className="text-xs text-gray-500 mt-1">Posted: Mar 13</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
