import React, { useState } from 'react';
import { User, Calendar, DollarSign, Briefcase, Download, Edit, Clock, Award, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const TeacherProfile = () => {
  const timetable = [
    { time: '8:30-9:30', monday: '10-A Math', tuesday: '10-B Math', wednesday: '10-A Math', thursday: '10-B Math' },
    { time: '9:30-10:30', monday: 'Free', tuesday: 'Staff Meeting', wednesday: 'Free', thursday: 'Math Club' },
    { time: '11:30-12:30', monday: '11-Sci Math', tuesday: 'Free', wednesday: '11-Sci Math', thursday: 'Free' },
    { time: '2:30-3:30', monday: '12-Com Math', tuesday: '12-Com Math', wednesday: 'Duty', thursday: 'Free' },
    { time: '3:30-4:30', monday: 'Paper Work', tuesday: 'Extra Class', wednesday: 'Paper Work', thursday: 'PT Meeting' },
  ];

  const leaveBalance = [
    { type: 'Casual Leave', remaining: 8, total: 12 },
    { type: 'Sick Leave', remaining: 12, total: 15 },
    { type: 'Earned Leave', remaining: 15, total: 30 },
    { type: 'Maternity Leave', remaining: 180, total: 180 },
  ];

  const responsibilities = [
    'Class Teacher: Grade 10-A',
    'Club In-charge: Mathematics Club',
    'Exam Coordinator: Term 1 Mathematics',
    'Mentor: 3 new teachers',
  ];

  const students = [
    { name: 'Rohan Kumar', subject: 'Math', class: '10-A' },
    { name: 'Anjali Singh', subject: 'Math', class: '10-B' },
    { name: 'Priya Patel', subject: 'Math', class: '11-Sci' },
    { name: 'John Smith', subject: 'Math', class: '12-Com' },
  ];

  const [selectedStudent, setSelectedStudent] = useState(students[0].name);

  // Helper for leave badge style
  const getLeaveBadgeStyle = (remaining, total) => {
    const ratio = remaining / total;
    if (ratio > 0.5) return 'bg-green-100 text-green-800';
    if (ratio > 0.25) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">TEACHER PROFILE - Ms. Priya Sharma</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div>
                <p className="text-sm text-gray-600">Teacher ID</p>
                <p className="font-medium">TCH2020008</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Department</p>
                <p className="font-medium">Mathematics</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Experience</p>
                <p className="font-medium">5 years</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Qualification</p>
                <p className="font-medium">M.Sc Mathematics, B.Ed</p>
              </div>
            </div>
          </div>
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm py-2 px-4 rounded-lg flex items-center gap-2">
            <Edit className="w-4 h-4" />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Weekly Timetable */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-3">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            WEEKLY TIMETABLE
          </h2>
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            Download PDF →
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monday</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tuesday</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wednesday</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thursday</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {timetable.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.monday}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.tuesday}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.wednesday}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.thursday}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Salary Information */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-gray-500" />
            SALARY INFORMATION
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Basic Salary</p>
                <p className="font-bold text-lg">₹65,000/month</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Net Salary</p>
                <p className="font-bold text-lg">₹70,500/month</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3 text-sm">Allowances</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">HRA</span>
                  <span className="font-medium text-sm">₹15,000</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Travel Allowance</span>
                  <span className="font-medium text-sm">₹5,000</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3 text-sm">Deductions</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Provident Fund</span>
                  <span className="font-medium text-sm">₹6,500</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Income Tax</span>
                  <span className="font-medium text-sm">₹8,000</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex flex-col md:flex-row justify-between gap-3">
                <div>
                  <p className="font-medium text-sm">Next Payday</p>
                  <p className="text-sm text-gray-600">March 25, 2025</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm">Bank Details</p>
                  <p className="text-sm text-gray-600">State Bank, A/C ****1234</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Leave Balance */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            LEAVE BALANCE
          </h2>

          <div className="space-y-4">
            {leaveBalance.map((leave, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-all">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-2">
                  <div>
                    <p className="font-medium text-sm">{leave.type}</p>
                    <p className="text-sm text-gray-600">Total: {leave.total} days</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLeaveBadgeStyle(leave.remaining, leave.total)}`}>
                    {leave.remaining} days
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      leave.remaining / leave.total > 0.5 ? 'bg-green-600' :
                      leave.remaining / leave.total > 0.25 ? 'bg-yellow-600' : 'bg-red-600'
                    }`}
                    style={{ width: `${(leave.remaining / leave.total) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {leave.type === 'Maternity Leave' ? 'Available if applicable' : 'Available for use'}
                </p>
              </div>
            ))}

            <div className="p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-yellow-600 shrink-0" />
                <div>
                  <p className="font-medium text-sm">Leave Application</p>
                  <p className="text-sm text-gray-600">Submit at least 3 days in advance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Development & Responsibilities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Professional Development */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-gray-500" />
            PROFESSIONAL DEVELOPMENT
          </h2>

          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-medium text-sm">Last Workshop</p>
                  <p className="text-sm text-gray-600">"Modern Teaching Methods"</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Completed
                </span>
              </div>
              <p className="text-sm text-gray-600">Feb 2024 | Duration: 3 days</p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-medium text-sm">Upcoming Training</p>
                  <p className="text-sm text-gray-600">"AI in Education"</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Scheduled
                </span>
              </div>
              <p className="text-sm text-gray-600">April 2025 | Duration: 2 weeks</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 px-3 rounded-lg mt-3">
                Register Now
              </button>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm">Certifications</p>
                  <p className="text-sm text-gray-600">Google Certified Educator</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Valid until 2026
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button className="text-xs text-blue-600 hover:text-blue-800">View Certificate</button>
                <button className="text-xs text-gray-600 hover:text-gray-800">Renew</button>
              </div>
            </div>
          </div>
        </div>

        {/* Responsibilities & Student Selector */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-gray-500" />
            RESPONSIBILITIES
          </h2>

          <div className="space-y-4">
            {responsibilities.map((responsibility, index) => (
              <div key={index} className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-all">
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-sm">{responsibility}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button className="text-xs text-blue-600 hover:text-blue-800">View Details</button>
                      <button className="text-xs text-gray-600 hover:text-gray-800">Reports</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Individual Student View */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="font-medium text-sm mb-2">Select Student to View:</p>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
            >
              {students.map((student, index) => (
                <option key={index} value={student.name}>{student.name}</option>
              ))}
            </select>

            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <p className="font-medium text-sm">Student Info:</p>
              {students
                .filter((s) => s.name === selectedStudent)
                .map((s) => (
                  <div key={s.name} className="mt-1 text-xs text-gray-600">
                    Class: {s.class} <br />
                    Subject: {s.subject}
                  </div>
                ))}
            </div>
          </div>

          <div className="mt-6 p-3 bg-gray-50 rounded-lg">
            <div className="flex flex-col sm:flex-row justify-between gap-3">
              <div>
                <p className="font-medium text-sm">Performance Rating</p>
                <p className="text-sm text-gray-600">Based on student feedback</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">4.8/5.0</div>
                <div className="text-sm text-gray-600">Excellent</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Documents & Actions */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-6">Documents & Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-all text-center">
            <Download className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="font-medium text-sm">Salary Slip</p>
            <p className="text-xs text-gray-600">Download PDF</p>
          </button>

          <button className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-all text-center">
            <User className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="font-medium text-sm">ID Card</p>
            <p className="text-xs text-gray-600">Download & Print</p>
          </button>

          <button className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-all text-center">
            <Calendar className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <p className="font-medium text-sm">Apply Leave</p>
            <p className="text-xs text-gray-600">Submit application</p>
          </button>

          <button className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-all text-center">
            <Edit className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
            <p className="font-medium text-sm">Update Profile</p>
            <p className="text-xs text-gray-600">Personal details</p>
          </button>
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

export default TeacherProfile;