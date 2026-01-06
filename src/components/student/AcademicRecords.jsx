import React from 'react';
import { BookOpen, Users, Award, TrendingUp, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

const AcademicRecords = () => {
  const subjects = [
    { name: 'Mathematics', max: 100, obtained: 85, grade: 'A', teacher: 'Ms. Sharma', percentage: 85 },
    { name: 'Science', max: 100, obtained: 88, grade: 'A', teacher: 'Mr. Patel', percentage: 88 },
    { name: 'English', max: 100, obtained: 78, grade: 'B+', teacher: 'Ms. Lee', percentage: 78 },
    { name: 'History', max: 100, obtained: 82, grade: 'A-', teacher: 'Mr. Brown', percentage: 82 },
    { name: 'Computer Science', max: 100, obtained: 92, grade: 'A+', teacher: 'Mr. Gupta', percentage: 92 },
    { name: 'Sanskrit', max: 100, obtained: 75, grade: 'B', teacher: 'Ms. Das', percentage: 75 },
  ];

  const attendance = {
    total: 90,
    present: 83,
    absent: 7,
    percentage: 92.2,
    medical: 3,
    other: 4
  };

  const extracurricular = [
    { activity: 'Football Team', role: 'Captain', achievement: 'Inter-school Champions 2023' },
    { activity: 'Science Club', role: 'Active Member', achievement: 'Participated in 5 events' },
    { activity: 'Debate Competition', role: 'Participant', achievement: '2nd Prize - District Level' },
  ];

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Academic Records - John Smith</h1>
          <div className="flex flex-wrap items-center gap-4 mt-2 text-gray-600 text-sm">
            <span className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              ACADEMIC YEAR: 2024-2025
            </span>
            <span>|</span>
            <span>CLASS: 10-A</span>
            <span>|</span>
            <span>ROLL NO: 25</span>
          </div>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-all">
          <Download className="w-4 h-4" />
          Download Report
        </button>
      </div>

      {/* Term 1 Report */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
          <div className="flex items-center gap-2 mb-2 md:mb-0">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold">TERM 1 REPORT (Aug-Oct 2024)</h2>
          </div>
          <div className="flex gap-6 text-right">
            <div>
              <div className="text-sm text-gray-600">Term Total</div>
              <div className="text-lg font-bold text-blue-700">500/600 (83.3%)</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Overall Grade</div>
              <div className="text-lg font-bold text-green-700">A-</div>
            </div>
          </div>
        </div>

        {/* Subjects Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Subject</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Max Marks</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Obtained</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Percentage</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Grade</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Teacher</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subjects.map((subject, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium text-gray-900">{subject.name}</td>
                  <td className="px-6 py-3">{subject.max}</td>
                  <td className="px-6 py-3 font-semibold">{subject.obtained}</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            subject.percentage >= 90
                              ? 'bg-green-600'
                              : subject.percentage >= 80
                              ? 'bg-blue-600'
                              : subject.percentage >= 70
                              ? 'bg-yellow-600'
                              : 'bg-red-600'
                          }`}
                          style={{ width: `${subject.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{subject.percentage}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        ['A+', 'A', 'A-'].includes(subject.grade)
                          ? 'bg-green-100 text-green-700'
                          : ['B+', 'B'].includes(subject.grade)
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {subject.grade}
                    </span>
                  </td>
                  <td className="px-6 py-3">{subject.teacher}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Summary */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-green-600" />
            <h2 className="text-xl font-semibold">ATTENDANCE SUMMARY</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-green-600">{attendance.present}</div>
              <div className="text-sm text-gray-600">Days Present</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-red-600">{attendance.absent}</div>
              <div className="text-sm text-gray-600">Days Absent</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-blue-600">{attendance.percentage}%</div>
              <div className="text-sm text-gray-600">Attendance Rate</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-gray-600">{attendance.total}</div>
              <div className="text-sm text-gray-600">Total Days</div>
            </div>
          </div>

          {/* Leave Details */}
          <div className="space-y-2">
            <h3 className="text-gray-700 font-medium">Leave Details</h3>
            <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
              <span className="text-sm text-gray-600">Medical Leave</span>
              <span className="font-medium">{attendance.medical} days</span>
            </div>
            <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
              <span className="text-sm text-gray-600">Other Leave</span>
              <span className="font-medium">{attendance.other} days</span>
            </div>
          </div>

          {/* Attendance Trend */}
          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium">Above School Average</p>
              <p className="text-sm text-gray-600">Your attendance is 5% higher than school average (87.2%)</p>
            </div>
          </div>
        </div>

        {/* Extra-Curricular Activities */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-yellow-600" />
            <h2 className="text-xl font-semibold">EXTRA-CURRICULAR ACTIVITIES</h2>
          </div>

          {extracurricular.map((activity, idx) => (
            <div key={idx} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-all">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-900">{activity.activity}</h3>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">{activity.role}</span>
              </div>
              <p className="text-gray-600 mb-2">{activity.achievement}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Active participation throughout the year</span>
                <Link to="#" className="text-blue-600 hover:text-blue-800">View Details →</Link>
              </div>
            </div>
          ))}

          <div className="text-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-all">
            <button className="text-blue-600 hover:text-blue-800 font-medium">+ Add New Activity</button>
            <p className="text-sm text-gray-500 mt-1">Add your achievements and activities</p>
          </div>
        </div>
      </div>

      {/* Performance Analysis */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h2 className="text-xl font-semibold mb-4">Performance Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="font-bold text-2xl">↑ 8%</div>
              <div className="text-sm text-gray-600">Improvement from Last Term</div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <Award className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="font-bold text-2xl">Top 10%</div>
              <div className="text-sm text-gray-600">Class Ranking</div>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <BookOpen className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="font-bold text-2xl">3/6</div>
              <div className="text-sm text-gray-600">Subjects with A Grade</div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Dashboard */}
      <div className="text-center">
        <Link to="/student" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default AcademicRecords;
