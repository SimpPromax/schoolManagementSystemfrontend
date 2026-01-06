import React from 'react';
import { Calendar, Clock, CheckCircle, AlertTriangle, Upload, FileText, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const Assignments = () => {
  const pendingAssignments = [
    {
      subject: 'Mathematics',
      title: 'Trigonometry Problems',
      assigned: 'Mar 14',
      due: 'Mar 16 (Tomorrow)',
      maxMarks: 20,
      status: 'not-started',
      instructions: 'Solve problems 1-10 from Chapter 8',
      attachment: 'trigonometry_problems.pdf'
    },
    {
      subject: 'Science',
      title: 'Solar System Model',
      assigned: 'Mar 1',
      due: 'Mar 20 (Friday)',
      maxMarks: 50,
      status: 'in-progress',
      progress: 60,
      instructions: 'Upload photos of your model',
      attachment: null
    }
  ];

  const submittedAssignments = [
    {
      subject: 'English',
      title: '"Importance of Reading" Essay',
      submitted: 'Mar 13',
      marks: 42,
      maxMarks: 50,
      grade: 'B+',
      feedback: 'Good arguments, needs better conclusion'
    },
    {
      subject: 'Computer Science',
      title: 'HTML Website Project',
      submitted: 'Mar 10',
      marks: 48,
      maxMarks: 50,
      grade: 'A+',
      feedback: 'Excellent design and code quality'
    },
    {
      subject: 'History',
      title: 'World War I Timeline',
      submitted: 'Mar 5',
      marks: 45,
      maxMarks: 50,
      grade: 'A',
      feedback: 'Well researched, good chronology'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Homework & Assignments - John Smith</h1>
          <p className="text-gray-600 mt-2">Track and submit your assignments</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="border border-gray-300 rounded-lg px-3 py-2">
            <option>All Subjects</option>
            <option>Mathematics</option>
            <option>Science</option>
            <option>English</option>
          </select>
          <span className="inline-flex items-center px-3 py-1 text-sm font-medium bg-gray-200 text-gray-800 rounded-full">
            Pending & Submitted
          </span>
        </div>
      </div>

      {/* Pending Assignments */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            PENDING ASSIGNMENTS ({pendingAssignments.length})
          </h2>
          <span className="inline-flex items-center px-3 py-1 text-sm font-medium bg-red-100 text-red-700 rounded-full">
            2 overdue soon
          </span>
        </div>

        <div className="space-y-6">
          {pendingAssignments.map((assignment, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-red-300 transition-all">
              {/* Assignment Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className={`p-3 rounded-lg ${
                    assignment.subject === 'Mathematics' ? 'bg-blue-100' :
                    assignment.subject === 'Science' ? 'bg-green-100' : 'bg-purple-100'
                  }`}>
                    {assignment.subject === 'Mathematics' && <BookOpen className="w-6 h-6 text-blue-600" />}
                    {assignment.subject === 'Science' && <BookOpen className="w-6 h-6 text-green-600" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{assignment.subject}</h3>
                    <p className="text-gray-600">{assignment.title}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${
                  assignment.status === 'not-started' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {assignment.status === 'not-started' ? 'NOT STARTED ⚠️' : 'IN PROGRESS 🟡'}
                </span>
              </div>

              {/* Assignment Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Assigned: {assignment.assigned}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Due: {assignment.due}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">Max Marks: </span>
                    <span className="font-medium">{assignment.maxMarks}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Instructions:</p>
                  <p className="text-sm">{assignment.instructions}</p>
                  {assignment.attachment && (
                    <div className="mt-2">
                      <a href="#" className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800">
                        <FileText className="w-4 h-4" />
                        {assignment.attachment}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              {assignment.status === 'in-progress' && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{assignment.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-600 h-2 rounded-full" style={{ width: `${assignment.progress}%` }}></div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  <Upload className="w-4 h-4" />
                  Submit Assignment
                </button>
                <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">
                  Request Extension
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recently Submitted */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            RECENTLY SUBMITTED
          </h2>
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            View All →
          </button>
        </div>

        <div className="space-y-4">
          {submittedAssignments.map((assignment, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-green-300 transition-all">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{assignment.subject}</h3>
                  <p className="text-gray-600">{assignment.title}</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-green-700">{assignment.marks}/{assignment.maxMarks}</div>
                  <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${
                    assignment.grade === 'A+' || assignment.grade === 'A' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {assignment.grade}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>Submitted: {assignment.submitted}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">Grade: </span>
                    <span className="font-medium">{assignment.grade} ({Math.round(assignment.marks/assignment.maxMarks*100)}%)</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Teacher Feedback:</p>
                  <p className="text-sm italic">"{assignment.feedback}"</p>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button className="text-sm text-blue-600 hover:text-blue-800">View Submission</button>
                <button className="text-sm text-gray-600 hover:text-gray-800">Download Feedback</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Assignment Statistics */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">Assignment Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-4 bg-green-50 rounded-lg text-center">
            <div className="text-3xl font-bold text-green-600">12</div>
            <div className="text-gray-600">Submitted</div>
            <p className="text-sm text-gray-500 mt-2">This semester</p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg text-center">
            <div className="text-3xl font-bold text-red-600">2</div>
            <div className="text-gray-600">Pending</div>
            <p className="text-sm text-gray-500 mt-2">1 due tomorrow</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg text-center">
            <div className="text-3xl font-bold text-blue-600">88%</div>
            <div className="text-gray-600">Average Score</div>
            <p className="text-sm text-gray-500 mt-2">Across all subjects</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg text-center">
            <div className="text-3xl font-bold text-yellow-600">3</div>
            <div className="text-gray-600">Late Submissions</div>
            <p className="text-sm text-gray-500 mt-2">This academic year</p>
          </div>
        </div>
      </div>

      {/* Back Link */}
      <div className="text-center">
        <Link to="/student" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Assignments;
