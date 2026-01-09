// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/Auth/PrivateRoute';
import Layout from './components/common/Layout';

// Public Pages
import Home from './pages/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import NotFound from './pages/NotFound';

// Student Components
import StudentDashboard from './components/student/Dashboard';
import AcademicRecords from './components/student/AcademicRecords';
import FeePayments from './components/student/FeePayments';
import Assignments from './components/student/Assignments';
import StudentProfile from './components/student/Profile';

// Teacher Components
import TeacherDashboard from './components/teacher/Dashboard';
import Gradebook from './components/teacher/Gradebook';
import AssignmentManager from './components/teacher/AssignmentManager';
import TeacherProfile from './components/teacher/Profile';

// Admin Components - Create placeholder components if they don't exist
const AdminDashboard = () => <div className="p-8"><h1 className="text-3xl font-bold">Admin Dashboard</h1><p>Welcome to Admin Panel</p></div>;
const UserManagement = () => <div className="p-8"><h1 className="text-3xl font-bold">User Management</h1></div>;
const CourseManagement = () => <div className="p-8"><h1 className="text-3xl font-bold">Course Management</h1></div>;

// Parent Components - Create placeholder components if they don't exist
const ParentDashboard = () => <div className="p-8"><h1 className="text-3xl font-bold">Parent Dashboard</h1><p>Welcome Parent</p></div>;
const ChildProgress = () => <div className="p-8"><h1 className="text-3xl font-bold">Child Progress</h1></div>;

// Accountant Components
import AccountantDashboard from './components/accountant/Dashboard';
import SalaryProcessing from './components/accountant/SalaryProcessing';
import ExpenseManagement from './components/accountant/ExpenseManagement';
import FeeCollection from './components/accountant/FeeCollection';
import Transactions from './components/accountant/Transactions';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student Routes */}
          <Route
            path="/student/*"
            element={
              <PrivateRoute allowedRoles={['STUDENT']}>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<StudentDashboard />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="academic" element={<AcademicRecords />} />
            <Route path="fees" element={<FeePayments />} />
            <Route path="assignments" element={<Assignments />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Teacher Routes */}
          <Route
            path="/teacher/*"
            element={
              <PrivateRoute allowedRoles={['TEACHER']}>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<TeacherDashboard />} />
            <Route path="dashboard" element={<TeacherDashboard />} />
            <Route path="gradebook" element={<Gradebook />} />
            <Route path="assignments" element={<AssignmentManager />} />
            <Route path="profile" element={<TeacherProfile />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <PrivateRoute allowedRoles={['ADMIN']}>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="courses" element={<CourseManagement />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Parent Routes */}
          <Route
            path="/parent/*"
            element={
              <PrivateRoute allowedRoles={['PARENT']}>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<ParentDashboard />} />
            <Route path="dashboard" element={<ParentDashboard />} />
            <Route path="progress" element={<ChildProgress />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Accountant Routes - ONLY ACCOUNTANT role */}
          <Route
            path="/accountant/*"
            element={
              <PrivateRoute allowedRoles={['ACCOUNTANT', 'STAFF']}>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<AccountantDashboard />} />
            <Route path="dashboard" element={<AccountantDashboard />} />
            <Route path="salary" element={<SalaryProcessing />} />
            <Route path="expenses" element={<ExpenseManagement />} />
            <Route path="fees" element={<FeeCollection />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Staff Routes (if you want separate routes for STAFF) */}
          <Route
            path="/staff/*"
            element={
              <PrivateRoute allowedRoles={['STAFF']}>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<div className="p-8"><h1 className="text-3xl font-bold">Staff Dashboard</h1><p>Welcome Staff Member</p></div>} />
            <Route path="dashboard" element={<div className="p-8"><h1 className="text-3xl font-bold">Staff Dashboard</h1></div>} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Fallback Routes */}
          <Route path="/dashboard" element={
            <PrivateRoute allowedRoles={['ADMIN', 'TEACHER', 'STUDENT', 'PARENT', 'ACCOUNTANT', 'STAFF']}>
              <Layout />
            </PrivateRoute>
          }>
            <Route index element={
              <PrivateRoute allowedRoles={['ADMIN', 'TEACHER', 'STUDENT', 'PARENT', 'ACCOUNTANT', 'STAFF']}>
                <div className="p-8">
                  <h1 className="text-2xl font-bold">Welcome to Dashboard</h1>
                  <p className="mt-2 text-gray-600">Select a section from the sidebar to get started.</p>
                </div>
              </PrivateRoute>
            } />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;