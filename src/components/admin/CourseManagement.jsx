import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  ChevronDown,
  Plus,
  Edit2,
  Trash2,
  Eye,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Calendar,
  DollarSign,
  GraduationCap,
  School,
  BarChart2,
  Download,
  Upload,
  Copy,
  Archive
} from 'lucide-react';

const CourseManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Mock courses data
  const courses = [
    {
      id: 1,
      code: 'MATH101',
      name: 'Introduction to Algebra',
      department: 'Mathematics',
      instructor: 'Dr. James Smith',
      credits: 3,
      students: 45,
      maxStudents: 50,
      status: 'active',
      schedule: 'Mon, Wed 10:00 AM',
      duration: '16 weeks',
      fee: 450,
      description: 'Fundamental concepts of algebra including equations, inequalities, and functions.',
      startDate: '2024-04-01',
      endDate: '2024-07-15'
    },
    {
      id: 2,
      code: 'ENG102',
      name: 'English Literature',
      department: 'English',
      instructor: 'Prof. Sarah Williams',
      credits: 3,
      students: 38,
      maxStudents: 40,
      status: 'active',
      schedule: 'Tue, Thu 2:00 PM',
      duration: '16 weeks',
      fee: 400,
      description: 'Study of major literary works and critical analysis.',
      startDate: '2024-04-01',
      endDate: '2024-07-15'
    },
    {
      id: 3,
      code: 'PHY201',
      name: 'Physics Fundamentals',
      department: 'Science',
      instructor: 'Dr. Michael Brown',
      credits: 4,
      students: 32,
      maxStudents: 35,
      status: 'active',
      schedule: 'Mon, Wed, Fri 11:00 AM',
      duration: '16 weeks',
      fee: 500,
      description: 'Introduction to mechanics, heat, and sound.',
      startDate: '2024-04-01',
      endDate: '2024-07-15'
    },
    {
      id: 4,
      code: 'CS101',
      name: 'Computer Science Basics',
      department: 'Computer Science',
      instructor: 'Prof. David Johnson',
      credits: 3,
      students: 50,
      maxStudents: 50,
      status: 'full',
      schedule: 'Tue, Thu 9:00 AM',
      duration: '16 weeks',
      fee: 550,
      description: 'Introduction to programming and computer science concepts.',
      startDate: '2024-04-01',
      endDate: '2024-07-15'
    },
    {
      id: 5,
      code: 'HIS101',
      name: 'World History',
      department: 'History',
      instructor: 'Dr. Maria Garcia',
      credits: 3,
      students: 42,
      maxStudents: 45,
      status: 'active',
      schedule: 'Mon, Wed 1:00 PM',
      duration: '16 weeks',
      fee: 380,
      description: 'Survey of major world civilizations and historical events.',
      startDate: '2024-04-01',
      endDate: '2024-07-15'
    },
    {
      id: 6,
      code: 'ART101',
      name: 'Introduction to Art',
      department: 'Arts',
      instructor: 'Prof. Lisa Anderson',
      credits: 2,
      students: 25,
      maxStudents: 30,
      status: 'active',
      schedule: 'Fri 2:00 PM - 5:00 PM',
      duration: '16 weeks',
      fee: 350,
      description: 'Exploration of various art forms and techniques.',
      startDate: '2024-04-01',
      endDate: '2024-07-15'
    },
    {
      id: 7,
      code: 'BUS201',
      name: 'Business Management',
      department: 'Business',
      instructor: 'Dr. Robert Taylor',
      credits: 3,
      students: 35,
      maxStudents: 40,
      status: 'draft',
      schedule: 'Wed 6:00 PM - 9:00 PM',
      duration: '16 weeks',
      fee: 520,
      description: 'Principles of business management and organizational behavior.',
      startDate: '2024-05-01',
      endDate: '2024-08-15'
    },
    {
      id: 8,
      code: 'CHEM101',
      name: 'General Chemistry',
      department: 'Science',
      instructor: 'Dr. Emma Watson',
      credits: 4,
      students: 28,
      maxStudents: 35,
      status: 'archived',
      schedule: 'Tue, Thu 11:00 AM',
      duration: '16 weeks',
      fee: 530,
      description: 'Introduction to chemical principles and laboratory techniques.',
      startDate: '2023-09-01',
      endDate: '2023-12-15'
    }
  ];

  const departments = [
    { value: 'all', label: 'All Departments' },
    { value: 'Mathematics', label: 'Mathematics' },
    { value: 'English', label: 'English' },
    { value: 'Science', label: 'Science' },
    { value: 'Computer Science', label: 'Computer Science' },
    { value: 'History', label: 'History' },
    { value: 'Arts', label: 'Arts' },
    { value: 'Business', label: 'Business' }
  ];

  const statuses = [
    { value: 'all', label: 'All Status', color: 'gray' },
    { value: 'active', label: 'Active', color: 'green' },
    { value: 'full', label: 'Full', color: 'orange' },
    { value: 'draft', label: 'Draft', color: 'blue' },
    { value: 'archived', label: 'Archived', color: 'gray' }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'full': return 'bg-orange-100 text-orange-800';
      case 'draft': return 'bg-blue-100 text-blue-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'active': return <CheckCircle className="w-3 h-3" />;
      case 'full': return <Users className="w-3 h-3" />;
      case 'draft': return <Clock className="w-3 h-3" />;
      case 'archived': return <Archive className="w-3 h-3" />;
      default: return <CheckCircle className="w-3 h-3" />;
    }
  };

  // Filter courses
  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = departmentFilter === 'all' || course.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const toggleSelectAll = () => {
    if (selectedCourses.length === filteredCourses.length) {
      setSelectedCourses([]);
    } else {
      setSelectedCourses(filteredCourses.map(course => course.id));
    }
  };

  const toggleSelectCourse = (courseId) => {
    if (selectedCourses.includes(courseId)) {
      setSelectedCourses(prev => prev.filter(id => id !== courseId));
    } else {
      setSelectedCourses(prev => [...prev, courseId]);
    }
  };

  const totalRevenue = filteredCourses.reduce((sum, course) => sum + (course.fee * course.students), 0);
  const totalStudents = filteredCourses.reduce((sum, course) => sum + course.students, 0);
  const averageFillRate = (totalStudents / filteredCourses.reduce((sum, course) => sum + course.maxStudents, 0)) * 100;

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-yellow-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
              Course Management
            </h1>
            <p className="text-gray-600 mt-1">Manage courses, schedules, and enrollment</p>
          </div>
          
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-orange-500 transition-colors flex items-center gap-2 text-sm">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button className="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-orange-500 transition-colors flex items-center gap-2 text-sm">
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Import</span>
            </button>
            <button className="px-4 py-2 bg-linear-to-r from-orange-600 to-yellow-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2 text-sm">
              <Plus className="w-4 h-4" />
              <span>Add Course</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-white rounded-xl p-3 sm:p-4 shadow-md">
            <p className="text-xs text-gray-600">Total Courses</p>
            <p className="text-lg sm:text-2xl font-bold text-gray-800">{courses.length}</p>
            <p className="text-xs text-green-600 mt-1">+3 this semester</p>
          </div>
          <div className="bg-white rounded-xl p-3 sm:p-4 shadow-md">
            <p className="text-xs text-gray-600">Active Courses</p>
            <p className="text-lg sm:text-2xl font-bold text-green-600">
              {courses.filter(c => c.status === 'active').length}
            </p>
            <p className="text-xs text-gray-600 mt-1">{courses.filter(c => c.status === 'full').length} full</p>
          </div>
          <div className="bg-white rounded-xl p-3 sm:p-4 shadow-md">
            <p className="text-xs text-gray-600">Enrolled Students</p>
            <p className="text-lg sm:text-2xl font-bold text-gray-800">{totalStudents}</p>
            <p className="text-xs text-gray-600 mt-1">Avg {Math.round(averageFillRate)}% fill rate</p>
          </div>
          <div className="bg-white rounded-xl p-3 sm:p-4 shadow-md">
            <p className="text-xs text-gray-600">Total Revenue</p>
            <p className="text-lg sm:text-2xl font-bold text-gray-800">${totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-green-600 mt-1">+15.3% vs last semester</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by course name, code, instructor, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
              />
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-orange-100 text-orange-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-orange-100 text-orange-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Filter Toggle - Mobile */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden px-4 py-2.5 border-2 border-gray-200 rounded-lg flex items-center justify-center gap-2"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            {/* Filters - Desktop */}
            <div className="hidden lg:flex items-center gap-3">
              <div className="relative w-48">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 appearance-none bg-white"
                >
                  {departments.map(dept => (
                    <option key={dept.value} value={dept.value}>{dept.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>

              <div className="relative w-40">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 appearance-none bg-white"
                >
                  {statuses.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="lg:hidden mt-4 space-y-3">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 appearance-none bg-white"
                >
                  {departments.map(dept => (
                    <option key={dept.value} value={dept.value}>{dept.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>

              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 appearance-none bg-white"
                >
                  {statuses.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>
          )}
        </div>

        {/* Bulk Actions */}
        {selectedCourses.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-4 mb-6 border-2 border-orange-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-sm font-medium text-gray-700">
                {selectedCourses.length} course{selectedCourses.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex flex-wrap gap-2">
                <button className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Activate
                </button>
                <button className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm flex items-center gap-1">
                  <Copy className="w-4 h-4" />
                  Duplicate
                </button>
                <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center gap-1">
                  <Archive className="w-4 h-4" />
                  Archive
                </button>
                <button className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm flex items-center gap-1">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Course Grid/List View */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                <div className="p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleSelectCourse(course.id)} className="text-gray-500 hover:text-orange-600">
                        {selectedCourses.includes(course.id) ? (
                          <CheckCircle className="w-4 h-4 text-orange-600" />
                        ) : (
                          <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
                        )}
                      </button>
                      <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">{course.code}</span>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${getStatusColor(course.status)}`}>
                      {getStatusIcon(course.status)}
                      {course.status}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">{course.name}</h3>
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">{course.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <School className="w-3 h-3" />
                      <span>{course.department}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <GraduationCap className="w-3 h-3" />
                      <span>{course.instructor}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Calendar className="w-3 h-3" />
                      <span>{course.schedule}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Users className="w-3 h-3" />
                      <span>{course.students}/{course.maxStudents} students</span>
                      <span className="ml-auto font-medium">
                        {Math.round((course.students / course.maxStudents) * 100)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <DollarSign className="w-3 h-3" />
                      <span>${course.fee} per student</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t-2 border-gray-100">
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-blue-600">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-green-600">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <button className="text-xs text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1">
                      View Details
                      <ChevronDown className="w-3 h-3 rotate-270" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left">
                      <button onClick={toggleSelectAll} className="text-gray-500 hover:text-orange-600">
                        {selectedCourses.length === filteredCourses.length && filteredCourses.length > 0 ? (
                          <CheckCircle className="w-4 h-4 text-orange-600" />
                        ) : (
                          <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
                        )}
                      </button>
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                    <th className="hidden md:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                    <th className="hidden lg:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Instructor</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Students</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCourses.map((course) => (
                    <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 sm:px-6 py-4">
                        <button onClick={() => toggleSelectCourse(course.id)} className="text-gray-500 hover:text-orange-600">
                          {selectedCourses.includes(course.id) ? (
                            <CheckCircle className="w-4 h-4 text-orange-600" />
                          ) : (
                            <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
                          )}
                        </button>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">{course.code}</span>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{course.name}</div>
                        <div className="text-xs text-gray-500 md:hidden">{course.department}</div>
                      </td>
                      <td className="hidden md:table-cell px-4 sm:px-6 py-4 text-sm text-gray-600">
                        {course.department}
                      </td>
                      <td className="hidden lg:table-cell px-4 sm:px-6 py-4 text-sm text-gray-600">
                        {course.instructor}
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="text-sm text-gray-600">{course.students}/{course.maxStudents}</div>
                        <div className="w-16 h-1 bg-gray-200 rounded-full mt-1">
                          <div 
                            className="h-1 bg-orange-600 rounded-full"
                            style={{ width: `${(course.students / course.maxStudents) * 100}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 w-fit ${getStatusColor(course.status)}`}>
                          {getStatusIcon(course.status)}
                          {course.status}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-blue-600">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-green-600">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-red-600">
                            <Trash2 className="w-4 h-4" />
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

        {/* Pagination */}
        <div className="mt-6 px-4 sm:px-6 py-4 bg-white rounded-xl shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-gray-600">
              Showing 1 to {filteredCourses.length} of {courses.length} courses
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 border-2 border-gray-200 rounded-lg hover:border-orange-500 transition-colors text-sm disabled:opacity-50" disabled>
                Previous
              </button>
              <button className="px-3 py-1 bg-orange-600 text-white rounded-lg text-sm">1</button>
              <button className="px-3 py-1 border-2 border-gray-200 rounded-lg hover:border-orange-500 transition-colors text-sm">2</button>
              <button className="px-3 py-1 border-2 border-gray-200 rounded-lg hover:border-orange-500 transition-colors text-sm">3</button>
              <button className="px-3 py-1 border-2 border-gray-200 rounded-lg hover:border-orange-500 transition-colors text-sm">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseManagement;