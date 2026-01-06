import React from 'react';
import { 
  Users, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Bell,
  Clock,
  MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';

const TeacherDashboard = () => {
  const classes = [
    { grade: 'Grade 10', section: 'A', students: 35, schedule: 'Mon,Wed,Fri(8:30)', subject: 'Mathematics' },
    { grade: 'Grade 10', section: 'B', students: 32, schedule: 'Tue,Thu(9:30)', subject: 'Mathematics' },
    { grade: 'Grade 11', section: 'Science', students: 28, schedule: 'Mon-Fri(11:30)', subject: 'Mathematics' },
    { grade: 'Grade 12', section: 'Commerce', students: 25, schedule: 'Tue,Thu(2:30)', subject: 'Mathematics' },
  ];

  const todaySchedule = [
    { time: '8:30', class: 'Grade 10-A', topic: 'Trigonometry', room: '205', status: 'completed' },
    { time: '11:30', class: 'Grade 11-Science', topic: 'Calculus', room: 'Lab 2', status: 'next' },
    { time: '2:30', class: 'Free Period', topic: '-', room: '-', status: 'free' },
  ];

  const assignmentsToCheck = [
    { class: 'Grade 10-B', title: 'Algebra Homework', submissions: 32, pending: 32, maxMarks: 20 },
    { class: 'Grade 11', title: 'Calculus Test papers', submissions: 28, pending: 28, maxMarks: 100 },
    { class: 'Grade 12', title: 'Statistics Project', submissions: 25, pending: 0, maxMarks: 50 },
  ];

  const studentAlerts = [
    { type: 'warning', message: '3 students absent in Grade 10-A today', details: 'Vikram Joshi, Rahul Verma, Sneha Reddy' },
    { type: 'danger', message: '2 students scoring below 40% in recent test', details: 'Arjun Nair, Karan Malhotra' },
    { type: 'success', message: 'All Grade 12 assignments submitted on time', details: 'Perfect submission record' },
  ];

  const upcomingEvents = [
    { title: "Parent Meeting: John Smith's parents", date: 'March 20, 3:00 PM', type: 'scheduled' },
    { title: 'Math Club Meeting', date: 'Tomorrow after school', type: 'confirmed' },
    { title: 'Exam Paper Setting Deadline', date: 'March 25', type: 'urgent' },
  ];

  // Helper: get badge style based on type
  const getBadgeStyle = (type) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'danger': return 'bg-red-100 text-red-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Springfield High - Teacher Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome, Ms. Priya Sharma (Mathematics Department)</p>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">Experience: 5 years</span>
              <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">Teacher ID: TCH2020008</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900">120</div>
            <div className="text-sm text-gray-600">Total Students</div>
          </div>
        </div>
      </div>

      {/* My Classes - TABLE VERSION */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-500" />
            MY CLASSES (2024-2025)
          </h2>
          <Link to="/teacher/gradebook" className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline">
            View Gradebooks →
          </Link>
        </div>
        
        {/* Styled Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {classes.map((cls, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{cls.grade}-{cls.section}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{cls.subject}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {cls.students} students
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-gray-500" />
                      {cls.schedule}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <Link 
                        to={`/teacher/gradebook?class=${cls.grade}-${cls.section}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-1.5 px-3 rounded-lg"
                      >
                        Gradebook
                      </Link>
                      <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm py-1.5 px-3 rounded-lg">
                        <Users className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between text-sm text-gray-600">
          <span>TOTAL STUDENTS: 120</span>
          <span>TOTAL PERIODS: 20/week</span>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              Today's Schedule (Monday)
            </h2>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline">
              View Full Week →
            </button>
          </div>
          
          <div className="space-y-4">
            {todaySchedule.map((item, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg ${
                  item.status === 'completed' ? 'border-l-4 border-l-green-500 bg-green-50' :
                  item.status === 'next' ? 'border-l-4 border-l-blue-500 bg-blue-50' :
                  'border-l-4 border-l-gray-400 bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-lg">{item.time} - {item.class}</div>
                    <div className="text-sm text-gray-600">{item.topic} | {item.room}</div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    item.status === 'completed' ? 'bg-green-100 text-green-800' :
                    item.status === 'next' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {item.status === 'completed' ? 'Completed' : 
                     item.status === 'next' ? 'Next' : 'Free'}
                  </span>
                </div>
                {item.status === 'next' && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-1 px-3 rounded-lg">
                      Prepare Materials
                    </button>
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm py-1 px-3 rounded-lg">
                      View Lesson Plan
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Assignments to Check */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              Assignments to Check
            </h2>
            <Link to="/teacher/assignments" className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline">
              Manage All →
            </Link>
          </div>
          
          <div className="space-y-4">
            {assignmentsToCheck.map((assignment, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg border ${
                  assignment.pending > 0 
                    ? 'border-yellow-200 bg-yellow-50' 
                    : 'border-green-200 bg-green-50'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900">{assignment.class}: {assignment.title}</h3>
                    <p className="text-sm text-gray-600">Max Marks: {assignment.maxMarks}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    assignment.pending > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {assignment.pending > 0 ? `${assignment.pending} pending` : 'All checked'}
                  </span>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="text-sm">
                    <span className="text-gray-600">Submissions: </span>
                    <span className="font-medium">{assignment.submissions}/{assignment.pending > 0 ? assignment.pending : 'All'}</span>
                  </div>
                  {assignment.pending > 0 ? (
                    <Link 
                      to={`/teacher/assignments?class=${assignment.class}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-1 px-3 rounded-lg text-center"
                    >
                      Grade Now
                    </Link>
                  ) : (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">Completed</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Student Alerts & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Alerts */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Bell className="w-5 h-5 text-gray-500" />
              Student Alerts
            </h2>
            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
              {studentAlerts.length} alerts
            </span>
          </div>
          <div className="space-y-4">
            {studentAlerts.map((alert, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg ${
                  alert.type === 'danger' ? 'bg-red-50' :
                  alert.type === 'warning' ? 'bg-yellow-50' : 'bg-green-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  {alert.type === 'danger' ? <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" /> :
                   alert.type === 'warning' ? <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" /> :
                   <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />}
                  <div className="flex-1">
                    <p className="font-medium mb-1">{alert.message}</p>
                    <p className="text-sm text-gray-600">{alert.details}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button className="text-sm text-blue-600 hover:text-blue-800 hover:underline">View Details</button>
                      {alert.type !== 'success' && (
                        <button className="text-sm text-gray-600 hover:text-gray-800 hover:underline flex items-center">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Contact Parent
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              Upcoming Events
            </h2>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline">
              Add Event +
            </button>
          </div>
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-r-lg ${
                  event.type === 'urgent' ? 'border-l-4 border-l-red-500 bg-red-50' :
                  event.type === 'confirmed' ? 'border-l-4 border-l-green-500 bg-green-50' :
                  'border-l-4 border-l-blue-500 bg-blue-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{event.title}</p>
                    <p className="text-sm text-gray-600">{event.date}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getBadgeStyle(event.type)}`}>
                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-6">Teaching Performance</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600">94%</div>
            <div className="text-sm text-gray-600">Student Satisfaction</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600">88%</div>
            <div className="text-sm text-gray-600">Avg. Class Score</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-3xl font-bold text-yellow-600">96%</div>
            <div className="text-sm text-gray-600">Attendance Rate</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-3xl font-bold text-purple-600">5.0</div>
            <div className="text-sm text-gray-600">Avg. Rating (5.0)</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium hover:underline">
          ← Back to Home
        </Link>
        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            to="/teacher/gradebook" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
          >
            Gradebook
          </Link>
          <Link 
            to="/teacher/assignments" 
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium"
          >
            Assignments
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;