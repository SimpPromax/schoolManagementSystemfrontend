import React, { useState } from 'react';
import { Calendar, Users, Clock, Download, Upload, Filter, Send, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const AssignmentManager = () => {
  const [selectedAssignment, setSelectedAssignment] = useState('trigonometry');

  const assignments = [
    { id: 'trigonometry', title: 'Trigonometry Problems Set', class: 'Grade 10-A & 10-B', dueDate: 'March 16, 2025', maxMarks: 20, status: 'submission' },
    { id: 'algebra', title: 'Algebra Homework', class: 'Grade 10-B', dueDate: 'March 18, 2025', maxMarks: 25, status: 'grading' },
    { id: 'calculus', title: 'Calculus Test Papers', class: 'Grade 11-Science', dueDate: 'March 20, 2025', maxMarks: 100, status: 'draft' },
  ];

  const submissionStatus = [
    { class: 'Grade 10-A', total: 35, submitted: 28, pending: 7, percent: 80 },
    { class: 'Grade 10-B', total: 32, submitted: 25, pending: 7, percent: 78 },
  ];

  const pendingStudents = [
    { name: 'Vikram Joshi', status: 'reminder', note: 'Sent reminder to parents' },
    { name: 'Rahul Verma', status: 'absent', note: 'Absent due to illness' },
    { name: 'Sneha Reddy', status: 'extension', note: 'Requested extension' },
    { name: 'Arjun Nair', status: 'no-response', note: 'No response' },
    { name: 'Meera Kapoor', status: 'technical', note: 'Technical issue reported' },
    { name: 'Karan Malhotra', status: 'leave', note: 'On leave' },
    { name: 'Pooja Chatterjee', status: 'extension-granted', note: 'Extension granted' },
  ];

  const gradedSubmissions = [
    { name: 'Rohan Kumar', marks: 20, maxMarks: 20, feedback: 'Excellent work' },
    { name: 'Anjali Singh', marks: 18, maxMarks: 20, feedback: 'Minor errors' },
    { name: 'John Smith', marks: 17, maxMarks: 20, feedback: 'Good attempt' },
    { name: 'Priya Patel', marks: 16, maxMarks: 20, feedback: 'Needs improvement' },
  ];

  const getAssignmentById = (id) => assignments.find(a => a.id === id);

  const getBadgeColor = (status) => {
    switch (status) {
      case 'submission': return 'bg-yellow-100 text-yellow-700';
      case 'grading': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStudentBadgeColor = (status) => {
    switch (status) {
      case 'reminder': return 'bg-yellow-100 text-yellow-700';
      case 'absent': return 'bg-gray-100 text-gray-700';
      case 'extension': return 'bg-yellow-100 text-yellow-700';
      case 'no-response': return 'bg-red-100 text-red-700';
      case 'technical': return 'bg-gray-100 text-gray-700';
      default: return 'bg-green-100 text-green-700';
    }
  };

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ASSIGNMENT MANAGEMENT</h1>
          <p className="text-gray-600 mt-2">Manage and grade student assignments</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          + Create Assignment
        </button>
      </div>

      {/* Assignment Selection */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Select Assignment</h2>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <select 
              className="border border-gray-300 rounded-lg px-3 py-2"
              value={selectedAssignment}
              onChange={(e) => setSelectedAssignment(e.target.value)}
            >
              {assignments.map((assignment) => (
                <option key={assignment.id} value={assignment.id}>
                  {assignment.title} - {assignment.class}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {(() => {
          const assignment = getAssignmentById(selectedAssignment);
          return assignment && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Title</p>
                  <p className="font-medium">{assignment.title}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Class</p>
                  <p className="font-medium">{assignment.class}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Due Date</p>
                  <p className="font-medium">{assignment.dueDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(assignment.status)}`}>
                    {assignment.status === 'submission' ? 'SUBMISSION PHASE' :
                     assignment.status === 'grading' ? 'GRADING PHASE' : 'DRAFT'}
                  </span>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Assignment Details */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">
          {getAssignmentById(selectedAssignment)?.title} - Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium">Due Date</p>
                <p className="text-lg font-bold text-gray-900">March 16, 2025</p>
                <p className="text-sm text-gray-600">5:00 PM</p>
              </div>
            </div>
            <p className="text-sm text-red-600">Deadline: Tomorrow</p>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <Users className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium">Max Marks</p>
                <p className="text-lg font-bold text-gray-900">20</p>
                <p className="text-sm text-gray-600">Total points</p>
              </div>
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="w-5 h-5 text-purple-600" />
              <div>
                <p className="font-medium">Status</p>
                <p className="text-lg font-bold text-gray-900">Active</p>
                <p className="text-sm text-gray-600">Accepting submissions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submission Status */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">SUBMISSION STATUS</h2>
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            View All Submissions →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {submissionStatus.map((status, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">{status.class}</h3>
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                  status.percent >= 90 ? 'bg-green-100 text-green-700' :
                  status.percent >= 75 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {status.percent}% submitted
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Submitted: {status.submitted}</span>
                    <span className="text-gray-600">Pending: {status.pending}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        status.percent >= 90 ? 'bg-green-600' :
                        status.percent >= 75 ? 'bg-yellow-600' : 'bg-red-600'
                      }`}
                      style={{ width: `${status.percent}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 py-1 px-3 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    View Submissions
                  </button>
                  <button className="py-1 px-3 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-1">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex justify-between">
            <span className="font-medium">TOTAL: 67 students</span>
            <span className="font-medium">53 submitted | 14 pending</span>
          </div>
        </div>
      </div>

      {/* Pending & Graded Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">PENDING SUBMISSIONS (Grade 10-A)</h2>
            <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">7 pending</span>
          </div>

          <div className="space-y-3">
            {pendingStudents.map((student, index) => (
              <div key={index} className="p-3 border border-gray-200 rounded-lg hover:border-red-300 transition">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{index + 1}. {student.name}</p>
                    <p className="text-sm text-gray-600">{student.note}</p>
                  </div>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStudentBadgeColor(student.status)}`}>
                    {student.status.replace('-', ' ')}
                  </span>
                </div>
                <div className="mt-2 flex gap-2">
                  <button className="text-sm text-blue-600 hover:text-blue-800">Send Reminder</button>
                  <button className="text-sm text-gray-600 hover:text-gray-800">Contact Parent</button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <button className="w-full flex items-center justify-center gap-2 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              <Send className="w-4 h-4" />
              Send Reminder to All Pending Students
            </button>
          </div>
        </div>

        {/* Graded */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">GRADED SUBMISSIONS</h2>
            <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">50 graded</span>
          </div>

          <div className="space-y-3">
            {gradedSubmissions.map((submission, index) => (
              <div key={index} className="p-3 border border-gray-200 rounded-lg hover:border-green-300 transition">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="font-medium">{submission.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-green-700">{submission.marks}/{submission.maxMarks}</span>
                    <div className="text-sm text-gray-600">
                      {Math.round(submission.marks/submission.maxMarks*100)}%
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 italic">"{submission.feedback}"</p>
                <div className="mt-2">
                  <button className="text-sm text-blue-600 hover:text-blue-800">Edit Grade</button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium mb-2">Last graded: Priya Patel - 16/20</p>
              <p className="text-sm text-gray-600">Graded on: March 14, 4:30 PM</p>
            </div>
            <button className="w-full flex items-center justify-center gap-2 py-2 border border-gray-200 rounded-lg hover:border-blue-300 transition">
              <Download className="w-4 h-4" />
              Download All Submissions (ZIP file)
            </button>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">ACTIONS</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition text-center">
            <Send className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="font-medium">Send Reminders</p>
            <p className="text-sm text-gray-600">To pending students</p>
          </button>

          <button className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition text-center">
            <Download className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="font-medium">Download All</p>
            <p className="text-sm text-gray-600">Submissions (ZIP)</p>
          </button>

          <button className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition text-center">
            <Upload className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <p className="font-medium">Bulk Upload</p>
            <p className="text-sm text-gray-600">Grades via CSV</p>
          </button>

          <button className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition text-center">
            <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="font-medium">Publish Grades</p>
            <p className="text-sm text-gray-600">To students</p>
          </button>
        </div>
      </div>

      <div className="text-center">
        <Link to="/teacher" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default AssignmentManager;
