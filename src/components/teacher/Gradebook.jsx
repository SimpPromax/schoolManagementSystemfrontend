import React, { useState } from 'react';
import { BookOpen, Users, TrendingUp, Filter, Download, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const Gradebook = () => {
  const [selectedClass, setSelectedClass] = useState('10-A');
  const [selectedStudent, setSelectedStudent] = useState('');

  const gradeDistribution = [
    { grade: 'A+', count: 5, color: 'bg-green-100 text-green-800' },
    { grade: 'A', count: 10, color: 'bg-green-100 text-green-800' },
    { grade: 'A-', count: 8, color: 'bg-blue-100 text-blue-800' },
    { grade: 'B+', count: 7, color: 'bg-yellow-100 text-yellow-800' },
    { grade: 'B', count: 3, color: 'bg-yellow-100 text-yellow-800' },
    { grade: 'C', count: 1, color: 'bg-red-100 text-red-800' },
    { grade: 'Below C', count: 1, color: 'bg-red-100 text-red-800' },
  ];

  const students = [
    { name: 'Rohan Kumar', t1: 28, t2: 23, t3: 19, t4: 24, total: 94, grade: 'A+' },
    { name: 'Anjali Singh', t1: 26, t2: 22, t3: 18, t4: 23, total: 89, grade: 'A' },
    { name: 'John Smith', t1: 25, t2: 20, t3: 17, t4: 22, total: 84, grade: 'A-' },
    { name: 'Priya Patel', t1: 24, t2: 21, t3: 16, t4: 20, total: 81, grade: 'A-' },
    { name: 'Raj Mehta', t1: 22, t2: 18, t3: 15, t4: 19, total: 74, grade: 'B' },
    { name: 'Vikram Joshi', t1: 12, t2: 10, t3: 8, t4: 11, total: 41, grade: 'D' },
  ];

  const attendance = {
    totalClasses: 45,
    average: 92,
    perfect: 18,
    below75: 2,
  };

  // Helper to map grade to badge style like in TeacherDashboard
  const getGradeBadgeStyle = (grade) => {
    if (['A+', 'A', 'A-'].includes(grade)) return 'bg-green-100 text-green-800';
    if (['B+', 'B'].includes(grade)) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              MATHEMATICS GRADEBOOK - {selectedClass} ({students.length} Students)
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-gray-600">TERM: 1 (2024-2025) | CHAPTERS: 1-5</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm py-2 px-4 rounded-lg flex items-center gap-2">
              <Download className="w-4 h-4" /> Export
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-4 rounded-lg">
              Update Grades
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="flex flex-wrap gap-4">
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="10-A">Grade 10-A</option>
              <option value="10-B">Grade 10-B</option>
              <option value="11-Science">Grade 11-Science</option>
              <option value="12-Commerce">Grade 12-Commerce</option>
            </select>
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option>Term 1</option>
              <option>Term 2</option>
              <option>Term 3</option>
              <option>Final</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search student..."
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm w-full md:w-64"
              />
            </div>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm py-2 px-4 rounded-lg flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filter
            </button>
          </div>
        </div>
      </div>

      {/* Student Performance Summary */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-gray-500" />
            STUDENT PERFORMANCE SUMMARY
          </h2>
          <div className="text-right">
            <div className="text-lg font-bold text-blue-600">Class Average: 78.5%</div>
            <div className="text-sm text-gray-600">Top Scorer: Rohan Kumar (96%)</div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-7 gap-4 mb-6">
          {gradeDistribution.map((item, index) => (
            <div key={index} className="text-center p-3 rounded-lg bg-gray-50">
              <div className={`text-2xl font-bold mb-2 ${item.color}`}>{item.count}</div>
              <div className={`text-sm ${item.color}`}>{item.grade}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="font-bold text-lg">↑ 5.2%</div>
              <div className="text-sm text-gray-600">Improvement from last term</div>
            </div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="font-bold text-lg">Top 20%</div>
              <div className="text-sm text-gray-600">Students scoring above 90%</div>
            </div>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <BookOpen className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <div className="font-bold text-lg">Need Support</div>
              <div className="text-sm text-gray-600">2 students below 50%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Marksheet */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <h2 className="text-xl font-semibold">DETAILED MARKSHEET</h2>
          <span className="text-sm text-gray-600">Showing {students.length} students</span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">T1(30)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">T2(25)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">T3(20)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">T4(25)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Link to="#" className="text-blue-600 hover:text-blue-800 font-medium">{student.name}</Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.t1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.t2}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.t3}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.t4}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{student.total}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGradeBadgeStyle(student.grade)}`}>
                      {student.grade}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex flex-wrap gap-2">
                      <button className="text-blue-600 hover:text-blue-800">Edit</button>
                      <button className="text-gray-600 hover:text-gray-800">View</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-center">
          <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
            Load more students...
          </button>
        </div>
      </div>

      {/* Attendance & Individual Student */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-500" /> ATTENDANCE SUMMARY
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">{attendance.totalClasses}</div>
              <div className="text-sm text-gray-600">Total Classes</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">{attendance.average}%</div>
              <div className="text-sm text-gray-600">Average Attendance</div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium text-sm">{attendance.perfect} students</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  100%
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Attended all {attendance.totalClasses} classes</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium text-sm">{attendance.below75} students</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Below 75%
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Requires parent meeting</p>
            </div>
          </div>
        </div>

        {/* Individual Student */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-6">INDIVIDUAL STUDENT VIEW</h2>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
              >
                <option value="">Select student...</option>
                {students.map((s, idx) => (
                  <option key={idx} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            {selectedStudent && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium mb-2 text-sm">Information for {selectedStudent}:</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>Complete test history</li>
                  <li>Assignment submissions</li>
                  <li>Attendance record</li>
                  <li>Parent contact information</li>
                </ul>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-4 rounded-lg">
                Generate Report
              </button>
              <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm py-2 px-4 rounded-lg">
                Contact Parents
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Link to="/teacher" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Gradebook;