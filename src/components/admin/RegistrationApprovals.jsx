import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock,
  User,
  Mail,
  Briefcase,
  Phone,
  MapPin,
  Calendar,
  Search,
  Filter,
  Eye,
  CheckSquare,
  Square,
  ChevronDown,
  Users,
  Inbox,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Award
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import axiosInstance from '../../api/axiosConfig';

const RegistrationApprovals = () => {
  const { showAlert, showConfirm } = useAuth();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    approvedToday: 0,
    rejectedToday: 0
  });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const roles = [
    { value: 'STUDENT', label: 'Student', color: 'blue', icon: '👨‍🎓' },
    { value: 'TEACHER', label: 'Teacher', color: 'green', icon: '👨‍🏫' },
    { value: 'PARENT', label: 'Parent', color: 'purple', icon: '👨‍👩‍👧' },
    { value: 'STAFF', label: 'Staff', color: 'amber', icon: '👔' },
    { value: 'ACCOUNTANT', label: 'Accountant', color: 'red', icon: '📊' }
  ];

  useEffect(() => {
    fetchPendingUsers();
    fetchStats();
  }, []);

  useEffect(() => {
    let filtered = pendingUsers;
    
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }
    
    setFilteredUsers(filtered);
  }, [searchTerm, roleFilter, pendingUsers]);

  const fetchPendingUsers = async () => {
    try {
      const response = await axiosInstance.get('/admin/auth/pending-registrations');
      if (response.data.success) {
        setPendingUsers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching pending users:', error);
      showAlert('error', 'Failed to fetch pending registrations');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchPendingUsers(), fetchStats()]);
    setRefreshing(false);
  };

  const fetchStats = async () => {
    try {
      const response = await axiosInstance.get('/admin/auth/registrations/stats');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleApprove = async (userId) => {
    const result = await showConfirm(
      'Approve Registration',
      'Are you sure you want to approve this user? They will be able to login immediately.',
      'Yes, Approve'
    );

    if (result.isConfirmed) {
      try {
        const response = await axiosInstance.post(`/admin/auth/process-registration/${userId}`, {
          status: 'APPROVED',
          notes: approvalNotes
        });

        if (response.data.success) {
          showAlert('success', 'User approved successfully');
          setPendingUsers(prev => prev.filter(user => user.id !== userId));
          setSelectedUser(null);
          setApprovalNotes('');
          fetchStats();
        }
      } catch (error) {
        showAlert('error', 'Failed to approve user');
      }
    }
  };

  const handleReject = async (userId) => {
    if (!rejectionReason) {
      showAlert('error', 'Please provide a reason for rejection');
      return;
    }

    const result = await showConfirm(
      'Reject Registration',
      'Are you sure you want to reject this user? This action cannot be undone.',
      'Yes, Reject'
    );

    if (result.isConfirmed) {
      try {
        const response = await axiosInstance.post(`/admin/auth/process-registration/${userId}`, {
          status: 'REJECTED',
          rejectionReason: rejectionReason,
          notes: approvalNotes
        });

        if (response.data.success) {
          showAlert('success', 'User rejected successfully');
          setPendingUsers(prev => prev.filter(user => user.id !== userId));
          setSelectedUser(null);
          setApprovalNotes('');
          setRejectionReason('');
          fetchStats();
        }
      } catch (error) {
        showAlert('error', 'Failed to reject user');
      }
    }
  };

  const handleBulkApprove = async () => {
    if (selectedUsers.length === 0) {
      showAlert('error', 'Please select users to approve');
      return;
    }

    const result = await showConfirm(
      'Bulk Approve',
      `Are you sure you want to approve ${selectedUsers.length} users?`,
      'Yes, Approve All'
    );

    if (result.isConfirmed) {
      try {
        const response = await axiosInstance.post('/admin/auth/bulk-approve', selectedUsers);

        if (response.data.success) {
          showAlert('success', `${selectedUsers.length} users approved successfully`);
          setPendingUsers(prev => prev.filter(user => !selectedUsers.includes(user.id)));
          setSelectedUsers([]);
          fetchStats();
        }
      } catch (error) {
        showAlert('error', 'Failed to bulk approve users');
      }
    }
  };

  const handleBulkReject = async () => {
    if (selectedUsers.length === 0) {
      showAlert('error', 'Please select users to reject');
      return;
    }

    const rejectionReason = prompt('Please provide a reason for rejection:');
    if (!rejectionReason) {
      showAlert('error', 'Rejection reason is required');
      return;
    }

    const result = await showConfirm(
      'Bulk Reject',
      `Are you sure you want to reject ${selectedUsers.length} users?`,
      'Yes, Reject All'
    );

    if (result.isConfirmed) {
      try {
        const response = await axiosInstance.post('/admin/auth/bulk-reject', {
          userIds: selectedUsers,
          reason: rejectionReason
        });

        if (response.data.success) {
          showAlert('success', `${selectedUsers.length} users rejected successfully`);
          setPendingUsers(prev => prev.filter(user => !selectedUsers.includes(user.id)));
          setSelectedUsers([]);
          fetchStats();
        }
      } catch (error) {
        showAlert('error', 'Failed to bulk reject users');
      }
    }
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length && filteredUsers.length > 0) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  const toggleSelectUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    } else {
      setSelectedUsers(prev => [...prev, userId]);
    }
  };

  const getRoleColor = (role) => {
    const found = roles.find(r => r.value === role);
    return found?.color || 'gray';
  };

  const getRoleIcon = (role) => {
    const found = roles.find(r => r.value === role);
    return found?.icon || '👤';
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-200 to-yellow-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="relative bg-white rounded-full p-6 shadow-xl mb-6 transform hover:scale-110 transition-transform duration-300">
          <Inbox className="w-16 h-16 text-orange-500" />
        </div>
      </div>
      
      <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">
        No pending approvals 🎉
      </h3>
      
      <p className="text-gray-600 text-center max-w-md mb-8 text-lg">
        There are no users requesting validation at the moment. Your dashboard is all clear!
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="group relative px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="flex items-center gap-2">
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
            {refreshing ? 'Checking...' : 'Check for New Requests'}
          </span>
        </button>
        
        <button
          onClick={() => {
            setRoleFilter('all');
            setSearchTerm('');
          }}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors border-2 border-gray-200"
        >
          Clear Filters
        </button>
      </div>
      
      <div className="mt-8 text-sm text-gray-500 flex items-center gap-2">
        <AlertCircle className="w-4 h-4" />
        <span>New registrations will appear here automatically</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Refresh Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
              Registration Approvals
            </h1>
            <p className="text-gray-600 mt-1">Review and manage pending user registrations</p>
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="mt-3 sm:mt-0 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 text-gray-700 border-2 border-gray-100 hover:border-orange-200 group"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
            <span className="text-sm font-medium">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>

        {/* Stats Cards - Enhanced appealing design without progress bars */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
          {/* Pending Card */}
          <div className="bg-white rounded-xl p-3 sm:p-4 shadow-lg border border-yellow-100 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-200 to-yellow-100 rounded-bl-full opacity-50 transform translate-x-6 -translate-y-6 group-hover:scale-110 transition-transform duration-300"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-yellow-200 to-transparent rounded-tr-full opacity-30"></div>
            
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 font-medium flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
                  Pending Review
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">{stats.pending}</p>
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  <Clock size={12} className="text-yellow-500" />
                  Awaiting action
                </p>
              </div>
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 p-3 rounded-xl shadow-lg">
                <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
            </div>
          </div>

          {/* Approved Card */}
          <div className="bg-white rounded-xl p-3 sm:p-4 shadow-lg border border-green-100 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-200 to-green-100 rounded-bl-full opacity-50 transform translate-x-6 -translate-y-6 group-hover:scale-110 transition-transform duration-300"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-green-200 to-transparent rounded-tr-full opacity-30"></div>
            
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 font-medium flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-green-400"></span>
                  Approved
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">{stats.approved}</p>
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  <TrendingUp size={12} className="text-green-500" />
                  Total approved
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-400 to-green-500 p-3 rounded-xl shadow-lg">
                <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
            </div>
          </div>

          {/* Rejected Card */}
          <div className="bg-white rounded-xl p-3 sm:p-4 shadow-lg border border-red-100 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-200 to-red-100 rounded-bl-full opacity-50 transform translate-x-6 -translate-y-6 group-hover:scale-110 transition-transform duration-300"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-red-200 to-transparent rounded-tr-full opacity-30"></div>
            
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 font-medium flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-red-400"></span>
                  Rejected
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">{stats.rejected}</p>
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  <TrendingDown size={12} className="text-red-500" />
                  Total rejected
                </p>
              </div>
              <div className="bg-gradient-to-br from-red-400 to-red-500 p-3 rounded-xl shadow-lg">
                <XCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
            </div>
          </div>

          {/* Approved Today Card */}
          <div className="bg-white rounded-xl p-3 sm:p-4 shadow-lg border border-blue-100 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-200 to-blue-100 rounded-bl-full opacity-50 transform translate-x-6 -translate-y-6 group-hover:scale-110 transition-transform duration-300"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-blue-200 to-transparent rounded-tr-full opacity-30"></div>
            
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 font-medium flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  Approved Today
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">{stats.approvedToday}</p>
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  <Award size={12} className="text-blue-500" />
                  Last 24 hours
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-400 to-blue-500 p-3 rounded-xl shadow-lg">
                <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
            </div>
          </div>

          {/* Rejected Today Card */}
          <div className="bg-white rounded-xl p-3 sm:p-4 shadow-lg border border-orange-100 relative overflow-hidden group hover:shadow-xl transition-all duration-300 col-span-2 sm:col-span-1">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-200 to-orange-100 rounded-bl-full opacity-50 transform translate-x-6 -translate-y-6 group-hover:scale-110 transition-transform duration-300"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-orange-200 to-transparent rounded-tr-full opacity-30"></div>
            
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 font-medium flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                  Rejected Today
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">{stats.rejectedToday}</p>
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  <Clock size={12} className="text-orange-500" />
                  Last 24 hours
                </p>
              </div>
              <div className="bg-gradient-to-br from-orange-400 to-orange-500 p-3 rounded-xl shadow-lg">
                <XCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 hover:shadow-lg transition-shadow">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search by name, email, or username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 sm:py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
              />
            </div>
            <div className="sm:w-48 relative group">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={18} />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 sm:py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all appearance-none bg-white cursor-pointer"
              >
                <option value="all">All Roles</option>
                {roles.map(role => (
                  <option key={role.value} value={role.value}>{role.icon} {role.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-4 mb-6 border-2 border-orange-200 animate-slideDown">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="bg-orange-100 rounded-full px-3 py-1">
                  <span className="text-sm font-medium text-orange-700">
                    {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
                  </span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <button
                  onClick={handleBulkApprove}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm transform hover:scale-105 active:scale-95"
                >
                  <CheckCircle size={18} />
                  Approve Selected
                </button>
                <button
                  onClick={handleBulkReject}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 text-sm transform hover:scale-105 active:scale-95"
                >
                  <XCircle size={18} />
                  Reject Selected
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pending Users Table / Empty State */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left">
                    {pendingUsers.length > 0 && (
                      <button 
                        onClick={toggleSelectAll} 
                        className="text-gray-500 hover:text-orange-600 transition-colors transform hover:scale-110 active:scale-95"
                      >
                        {selectedUsers.length === filteredUsers.length && filteredUsers.length > 0 ? (
                          <CheckSquare size={18} className="text-orange-600" />
                        ) : (
                          <Square size={18} />
                        )}
                      </button>
                    )}
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="hidden sm:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="hidden md:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12">
                      <div className="flex flex-col items-center justify-center">
                        <div className="relative">
                          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                        </div>
                        <p className="mt-4 text-gray-600 font-medium">Loading pending registrations...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-0 py-0">
                      <EmptyState />
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user, index) => (
                    <tr 
                      key={user.id} 
                      className="hover:bg-gray-50 transition-colors group animate-fadeIn"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="px-4 sm:px-6 py-4">
                        <button 
                          onClick={() => toggleSelectUser(user.id)} 
                          className="text-gray-500 hover:text-orange-600 transition-colors transform hover:scale-110 active:scale-95"
                        >
                          {selectedUsers.includes(user.id) ? (
                            <CheckSquare size={18} className="text-orange-600" />
                          ) : (
                            <Square size={18} />
                          )}
                        </button>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center">
                          <div className="relative shrink-0">
                            <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transform group-hover:scale-110 transition-all duration-200">
                              <span className="text-white text-sm sm:text-base font-bold">
                                {user.fullName?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-green-400 rounded-full w-3 h-3 border-2 border-white"></div>
                          </div>
                          <div className="ml-2 sm:ml-4">
                            <div className="text-xs sm:text-sm font-medium text-gray-900">{user.fullName}</div>
                            <div className="text-xs text-gray-500">@{user.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span className={`px-3 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full 
                          bg-${getRoleColor(user.role)}-100 text-${getRoleColor(user.role)}-800 border border-${getRoleColor(user.role)}-200`}>
                          <span>{getRoleIcon(user.role)}</span>
                          {user.role}
                        </span>
                      </td>
                      <td className="hidden sm:table-cell px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Mail size={12} className="text-gray-400" />
                          <div className="text-xs sm:text-sm text-gray-900">{user.email}</div>
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-2 mt-1">
                            <Phone size={12} className="text-gray-400" />
                            <div className="text-xs text-gray-500">{user.phone}</div>
                          </div>
                        )}
                      </td>
                      <td className="hidden md:table-cell px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar size={12} className="text-gray-400" />
                          <span className="text-xs sm:text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all transform hover:scale-110 active:scale-95"
                            title="Review"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleApprove(user.id)}
                            className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-all transform hover:scale-110 active:scale-95"
                            title="Approve"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setRejectionReason('');
                            }}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all transform hover:scale-110 active:scale-95"
                            title="Reject"
                          >
                            <XCircle size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Review Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform animate-slideUp">
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Eye className="w-5 h-5 text-orange-500" />
                    Review Registration
                  </h2>
                  <button
                    onClick={() => {
                      setSelectedUser(null);
                      setApprovalNotes('');
                      setRejectionReason('');
                    }}
                    className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition-all"
                  >
                    <XCircle size={20} className="sm:w-6 sm:h-6" />
                  </button>
                </div>

                {/* User Details */}
                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-lg border border-gray-100 hover:border-orange-200 transition-all">
                      <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                        <User size={14} className="text-orange-500" />
                        <span className="font-medium">Full Name</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-800">{selectedUser.fullName}</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-lg border border-gray-100 hover:border-orange-200 transition-all">
                      <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                        <Mail size={14} className="text-orange-500" />
                        <span className="font-medium">Email</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-800 break-all">{selectedUser.email}</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-lg border border-gray-100 hover:border-orange-200 transition-all">
                      <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                        <Briefcase size={14} className="text-orange-500" />
                        <span className="font-medium">Role</span>
                      </div>
                      <p className="text-sm font-semibold">
                        <span className={`px-2 py-1 rounded-full bg-${getRoleColor(selectedUser.role)}-100 text-${getRoleColor(selectedUser.role)}-800`}>
                          {getRoleIcon(selectedUser.role)} {selectedUser.role}
                        </span>
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-lg border border-gray-100 hover:border-orange-200 transition-all">
                      <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                        <Phone size={14} className="text-orange-500" />
                        <span className="font-medium">Phone</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-800">{selectedUser.phone || 'Not provided'}</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-lg border border-gray-100 hover:border-orange-200 transition-all sm:col-span-2">
                      <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                        <MapPin size={14} className="text-orange-500" />
                        <span className="font-medium">Address</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-800">{selectedUser.address || 'Not provided'}</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-lg border border-gray-100 hover:border-orange-200 transition-all sm:col-span-2">
                      <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                        <Calendar size={14} className="text-orange-500" />
                        <span className="font-medium">Registration Date</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-800">
                        {new Date(selectedUser.createdAt).toLocaleString('en-US', {
                          dateStyle: 'full',
                          timeStyle: 'short'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Rejection Reason Input */}
                  <div className="mt-4">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Rejection Reason {!rejectionReason && <span className="text-red-500">*</span>}
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows="2"
                      className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                      placeholder="Provide a reason for rejection (required for rejection)"
                    />
                  </div>

                  {/* Approval Notes */}
                  <div className="mt-4">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Notes (Optional)
                    </label>
                    <textarea
                      value={approvalNotes}
                      onChange={(e) => setApprovalNotes(e.target.value)}
                      rows="2"
                      className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                      placeholder="Add any notes about this registration..."
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
                  <button
                    onClick={() => {
                      setSelectedUser(null);
                      setApprovalNotes('');
                      setRejectionReason('');
                    }}
                    className="px-4 py-2 border-2 border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-all text-sm font-medium hover:border-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleReject(selectedUser.id)}
                    disabled={!rejectionReason}
                    className={`px-4 py-2 rounded-lg text-white transition-all flex items-center justify-center gap-2 text-sm font-medium transform hover:scale-105 active:scale-95 ${
                      rejectionReason 
                        ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl' 
                        : 'bg-gray-300 cursor-not-allowed'
                    }`}
                  >
                    <XCircle size={16} />
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(selectedUser.id)}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center gap-2 text-sm font-medium transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                  >
                    <CheckCircle size={16} />
                    Approve
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default RegistrationApprovals;