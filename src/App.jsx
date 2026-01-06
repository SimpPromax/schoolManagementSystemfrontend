import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/common/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import NotFound from './pages/NotFound'

// Student Components
import StudentDashboard from './components/student/Dashboard'
import AcademicRecords from './components/student/AcademicRecords'
import FeePayments from './components/student/FeePayments'
import Assignments from './components/student/Assignments'
import StudentProfile from './components/student/Profile'

// Teacher Components
import TeacherDashboard from './components/teacher/Dashboard'
import Gradebook from './components/teacher/Gradebook'
import AssignmentManager from './components/teacher/AssignmentManager'
import TeacherProfile from './components/teacher/Profile'

// Accountant Components
import AccountantDashboard from './components/accountant/Dashboard'
import SalaryProcessing from './components/accountant/SalaryProcessing'
import ExpenseManagement from './components/accountant/ExpenseManagement'
import FeeCollection from './components/accountant/FeeCollection'
import StudentFeeManagement from './components/accountant/StudentFeeManagement'
import Transactions from './components/accountant/transactions'

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes with Layout */}
        <Route element={<Layout />}>
          {/* Student Routes */}
          <Route path="student">
            <Route index element={<StudentDashboard />} />
            <Route path="academic" element={<AcademicRecords />} />
            <Route path="fees" element={<FeePayments />} />
            <Route path="assignments" element={<Assignments />} />
            <Route path="profile" element={<StudentProfile />} />
          </Route>
          
          {/* Teacher Routes */}
          <Route path="teacher">
            <Route index element={<TeacherDashboard />} />
            <Route path="gradebook" element={<Gradebook />} />
            <Route path="assignments" element={<AssignmentManager />} />
            <Route path="profile" element={<TeacherProfile />} />
          </Route>
          
          {/* Accountant Routes */}
          <Route path="accountant">
            <Route index element={<AccountantDashboard />} />
            <Route path="salary" element={<SalaryProcessing />} />
            <Route path="expenses" element={<ExpenseManagement />} />
            {/* Fee Management Routes */}
            <Route path="fees">
              <Route index element={<FeeCollection />} />
              <Route path="students" element={<StudentFeeManagement />} />
              <Route path="transactions" element={<Transactions />} />
            </Route>
          </Route>
        </Route>
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App