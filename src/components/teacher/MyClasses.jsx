import React, { useState } from 'react';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  Clock, 
  TrendingUp, 
  Download, 
  Filter, 
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  ChevronRight,
  BarChart3,
  GraduationCap,
  FileText,
  MessageSquare,
  Settings,
  Copy,
  ArrowUpDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const TeacherClasses = () => {
  const { user } = useAuth();
  const [selectedView, setSelectedView] = useState('grid'); // 'grid' or 'list'
  const [selectedClass, setSelectedClass] = useState(null);
  const [showClassDetails, setShowClassDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');

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

  // Sample classes data (would come from API in real app)
  const classes = [
    { 
      id: 1,
      grade: 'Grade 10', 
      section: 'A', 
      subject: 'Mathematics',
      students: 35,
      schedule: [
        { day: 'Monday', time: '8:30 - 9:30', room: '205' },
        { day: 'Wednesday', time: '8:30 - 9:30', room: '205' },
        { day: 'Friday', time: '8:30 - 9:30', room: '205' }
      ],
      performance: {
        average: 78.5,
        topScore: 96,
        belowAverage: 5,
        assignmentsCompleted: 8,
        totalAssignments: 10
      },
      classTeacher: 'Ms. Priya Sharma',
      classRepresentative: 'Rohan Kumar',
      academicYear: getSchoolYear(),
      term: 'Term 1',
      status: 'active'
    },
    { 
      id: 2,
      grade: 'Grade 10', 
      section: 'B', 
      subject: 'Mathematics',
      students: 32,
      schedule: [
        { day: 'Tuesday', time: '9:30 - 10:30', room: '206' },
        { day: 'Thursday', time: '9:30 - 10:30', room: '206' }
      ],
      performance: {
        average: 76.2,
        topScore: 92,
        belowAverage: 4,
        assignmentsCompleted: 7,
        totalAssignments: 10
      },
      classTeacher: 'Ms. Priya Sharma',
      classRepresentative: 'Anjali Singh',
      academicYear: getSchoolYear(),
      term: 'Term 1',
      status: 'active'
    },
    { 
      id: 3,
      grade: 'Grade 11', 
      section: 'Science', 
      subject: 'Mathematics',
      students: 28,
      schedule: [
        { day: 'Monday', time: '11:30 - 12:30', room: 'Lab 2' },
        { day: 'Tuesday', time: '11:30 - 12:30', room: 'Lab 2' },
        { day: 'Wednesday', time: '11:30 - 12:30', room: 'Lab 2' },
        { day: 'Thursday', time: '11:30 - 12:30', room: 'Lab 2' },
        { day: 'Friday', time: '11:30 - 12:30', room: 'Lab 2' }
      ],
      performance: {
        average: 82.1,
        topScore: 98,
        belowAverage: 2,
        assignmentsCompleted: 9,
        totalAssignments: 10
      },
      classTeacher: 'Ms. Priya Sharma',
      classRepresentative: 'John Smith',
      academicYear: getSchoolYear(),
      term: 'Term 1',
      status: 'active'
    },
    { 
      id: 4,
      grade: 'Grade 12', 
      section: 'Commerce', 
      subject: 'Mathematics',
      students: 25,
      schedule: [
        { day: 'Tuesday', time: '14:30 - 15:30', room: '304' },
        { day: 'Thursday', time: '14:30 - 15:30', room: '304' }
      ],
      performance: {
        average: 79.8,
        topScore: 95,
        belowAverage: 3,
        assignmentsCompleted: 8,
        totalAssignments: 10
      },
      classTeacher: 'Ms. Priya Sharma',
      classRepresentative: 'Priya Patel',
      academicYear: getSchoolYear(),
      term: 'Term 1',
      status: 'active'
    },
    { 
      id: 5,
      grade: 'Grade 9', 
      section: 'A', 
      subject: 'Mathematics',
      students: 38,
      schedule: [
        { day: 'Monday', time: '10:30 - 11:30', room: '101' },
        { day: 'Wednesday', time: '10:30 - 11:30', room: '101' },
        { day: 'Friday', time: '10:30 - 11:30', room: '101' }
      ],
      performance: {
        average: 74.3,
        topScore: 89,
        belowAverage: 8,
        assignmentsCompleted: 6,
        totalAssignments: 10
      },
      classTeacher: 'Ms. Priya Sharma',
      classRepresentative: 'Raj Mehta',
      academicYear: getSchoolYear(),
      term: 'Term 1',
      status: 'upcoming'
    }
  ];

  // Filter classes based on search and subject
  const filteredClasses = classes.filter(cls => {
    const matchesSearch = 
      `${cls.grade} ${cls.section}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.classRepresentative?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = filterSubject === 'all' || cls.subject === filterSubject;
    
    return matchesSearch && matchesSubject;
  });

  // Get unique subjects for filter
  const subjects = ['all', ...new Set(classes.map(c => c.subject))];

  // Calculate total stats
  const totalStats = {
    totalClasses: classes.length,
    totalStudents: classes.reduce((acc, cls) => acc + cls.students, 0),
    averagePerformance: Math.round(classes.reduce((acc, cls) => acc + cls.performance.average, 0) / classes.length),
    activeClasses: classes.filter(c => c.status === 'active').length
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              My Classes
            </h1>
            <p className="text-gray-600 mt-1">
              Manage and track all your assigned classes for Academic Year {getSchoolYear()}
            </p>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                Teacher: {user?.fullName || 'Ms. Priya Sharma'}
              </span>
              <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                Total Classes: {totalStats.totalClasses}
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create New Class
            </button>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Classes</p>
              <p className="text-2xl font-bold text-gray-900">{totalStats.totalClasses}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2">↑ {totalStats.activeClasses} active this term</p>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{totalStats.totalStudents}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-blue-600 mt-2">Across all classes</p>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Performance</p>
              <p className="text-2xl font-bold text-gray-900">{totalStats.averagePerformance}%</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2">↑ 5% from last term</p>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Weekly Periods</p>
              <p className="text-2xl font-bold text-gray-900">20</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-2">Average per week</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search classes..."
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
            >
              {subjects.map(subject => (
                <option key={subject} value={subject}>
                  {subject === 'all' ? 'All Subjects' : subject}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <div className="bg-gray-100 rounded-lg p-1">
              <button
                className={`px-3 py-1.5 rounded-lg text-sm ${selectedView === 'grid' ? 'bg-white shadow' : 'text-gray-600'}`}
                onClick={() => setSelectedView('grid')}
              >
                Grid
              </button>
              <button
                className={`px-3 py-1.5 rounded-lg text-sm ${selectedView === 'list' ? 'bg-white shadow' : 'text-gray-600'}`}
                onClick={() => setSelectedView('list')}
              >
                List
              </button>
            </div>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2">
              <Filter className="w-4 h-4" /> More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Classes Display */}
      {selectedView === 'grid' ? (
        // Grid View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((cls) => (
            <div key={cls.id} className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {cls.grade} - {cls.section}
                    </h3>
                    <p className="text-sm text-gray-600">{cls.subject}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    cls.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {cls.status === 'active' ? 'Active' : 'Upcoming'}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{cls.students} Students</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{cls.schedule.length} periods/week</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">{cls.performance.average}%</span>
                    <span className="text-gray-600">avg. score</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs text-gray-500">Class Rep: {cls.classRepresentative}</span>
                    <span className="text-xs text-gray-500">{cls.academicYear}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Link 
                      to={`/teacher/gradebook?class=${cls.grade}-${cls.section}`}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-3 rounded-lg flex items-center justify-center gap-1"
                    >
                      <GraduationCap className="w-4 h-4" />
                      Gradebook
                    </Link>
                    <button 
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg"
                      onClick={() => {
                        setSelectedClass(cls);
                        setShowClassDetails(true);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // List View
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-1 cursor-pointer">
                      Class <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class Rep</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredClasses.map((cls) => (
                  <tr key={cls.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{cls.grade}-{cls.section}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{cls.subject}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{cls.students}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      <div className="text-sm">{cls.schedule.length} periods</div>
                      <div className="text-xs text-gray-500">{cls.schedule[0].time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium">{cls.performance.average}%</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{cls.classRepresentative}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        cls.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {cls.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <Link to={`/teacher/gradebook?class=${cls.grade}-${cls.section}`}>
                          <button className="text-blue-600 hover:text-blue-800 p-1" title="Gradebook">
                            <GraduationCap className="w-4 h-4" />
                          </button>
                        </Link>
                        <button className="text-gray-600 hover:text-gray-800 p-1" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-800 p-1" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Class Details Modal */}
      {showClassDetails && selectedClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedClass.grade} - {selectedClass.section} Details
                  </h2>
                  <p className="text-gray-600">{selectedClass.subject}</p>
                </div>
                <button 
                  onClick={() => setShowClassDetails(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {/* Class Info Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Class Teacher</p>
                  <p className="font-medium">{selectedClass.classTeacher}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Class Rep</p>
                  <p className="font-medium">{selectedClass.classRepresentative}</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600">Academic Year</p>
                  <p className="font-medium">{selectedClass.academicYear}</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-gray-600">Term</p>
                  <p className="font-medium">{selectedClass.term}</p>
                </div>
              </div>

              {/* Schedule */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Schedule
                </h3>
                <div className="space-y-2">
                  {selectedClass.schedule.map((slot, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-2 bg-gray-50 rounded">
                      <span className="font-medium w-24">{slot.day}:</span>
                      <span className="text-gray-600">{slot.time}</span>
                      <span className="text-gray-500 text-sm">Room {slot.room}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Performance Overview
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="text-center p-3 bg-blue-50 rounded">
                    <p className="text-sm text-gray-600">Average</p>
                    <p className="text-xl font-bold text-blue-600">{selectedClass.performance.average}%</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded">
                    <p className="text-sm text-gray-600">Top Score</p>
                    <p className="text-xl font-bold text-green-600">{selectedClass.performance.topScore}%</p>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded">
                    <p className="text-sm text-gray-600">Need Support</p>
                    <p className="text-xl font-bold text-red-600">{selectedClass.performance.belowAverage}</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded">
                    <p className="text-sm text-gray-600">Assignments</p>
                    <p className="text-xl font-bold text-purple-600">
                      {selectedClass.performance.assignmentsCompleted}/{selectedClass.performance.totalAssignments}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <Link 
                    to={`/teacher/gradebook?class=${selectedClass.grade}-${selectedClass.section}`}
                    className="p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-center"
                  >
                    <GraduationCap className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                    <span className="text-sm">Gradebook</span>
                  </Link>
                  <button className="p-3 bg-green-50 hover:bg-green-100 rounded-lg text-center">
                    <FileText className="w-5 h-5 mx-auto mb-1 text-green-600" />
                    <span className="text-sm">Attendance</span>
                  </button>
                  <button className="p-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-center">
                    <MessageSquare className="w-5 h-5 mx-auto mb-1 text-purple-600" />
                    <span className="text-sm">Announcement</span>
                  </button>
                  <button className="p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg text-center">
                    <BarChart3 className="w-5 h-5 mx-auto mb-1 text-yellow-600" />
                    <span className="text-sm">Reports</span>
                  </button>
                  <button className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-center">
                    <Edit className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                    <span className="text-sm">Edit Class</span>
                  </button>
                  <button className="p-3 bg-red-50 hover:bg-red-100 rounded-lg text-center">
                    <Settings className="w-5 h-5 mx-auto mb-1 text-red-600" />
                    <span className="text-sm">Settings</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Back to Dashboard */}
      <div className="text-center">
        <Link to="/teacher" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default TeacherClasses;