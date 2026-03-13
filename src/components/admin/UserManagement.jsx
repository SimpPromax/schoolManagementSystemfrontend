import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  ChevronDown,
  UserPlus,
  Edit2,
  Trash2,
  Eye,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Mail,
  Phone,
  GraduationCap,
  School,
  UserCog,
  Calculator,
  Users as UsersIcon,
  Shield,
  Lock,
  Unlock,
  RefreshCw
} from 'lucide-react';

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Mock users data
  const users = [
    {
      id: 1,
      name: 'Emma Watson',
      username: 'emma.w',
      email: 'emma.watson@school.com',
      role: 'STUDENT',
      status: 'active',
      lastActive: '2024-03-15T10:30:00',
      phone: '+1 234 567 890',
      grade: '10th Grade',
      avatar: 'EW',
      verified: true
    },
    {
      id: 2,
      name: 'James Smith',
      username: 'james.s',
      email: 'james.smith@school.com',
      role: 'TEACHER',
      status: 'active',
      lastActive: '2024-03-15T09:15:00',
      phone: '+1 234 567 891',
      department: 'Mathematics',
      avatar: 'JS',
      verified: true
    },
    {
      id: 3,
      name: 'Maria Garcia',
      username: 'maria.g',
      email: 'maria.garcia@school.com',
      role: 'PARENT',
      status: 'inactive',
      lastActive: '2024-03-10T14:20:00',
      phone: '+1 234 567 892',
      children: ['Emma Watson', 'Lucas Garcia'],
      avatar: 'MG',
      verified: false
    },
    {
      id: 4,
      name: 'David Johnson',
      username: 'david.j',
      email: 'david.johnson@school.com',
      role: 'ACCOUNTANT',
      status: 'active',
      lastActive: '2024-03-15T11:45:00',
      phone: '+1 234 567 893',
      department: 'Finance',
      avatar: 'DJ',
      verified: true
    },
    {
      id: 5,
      name: 'Sarah Williams',
      username: 'sarah.w',
      email: 'sarah.williams@school.com',
      role: 'STAFF',
      status: 'suspended',
      lastActive: '2024-03-12T08:30:00',
      phone: '+1 234 567 894',
      department: 'Administration',
      avatar: 'SW',
      verified: true
    },
    {
      id: 6,
      name: 'Michael Brown',
      username: 'michael.b',
      email: 'michael.brown@school.com',
      role: 'TEACHER',
      status: 'active',
      lastActive: '2024-03-15T08:00:00',
      phone: '+1 234 567 895',
      department: 'Science',
      avatar: 'MB',
      verified: true
    },
    {
      id: 7,
      name: 'Lisa Anderson',
      username: 'lisa.a',
      email: 'lisa.anderson@school.com',
      role: 'STUDENT',
      status: 'locked',
      lastActive: '2024-03-14T16:20:00',
      phone: '+1 234 567 896',
      grade: '11th Grade',
      avatar: 'LA',
      verified: true
    },
    {
      id: 8,
      name: 'Robert Taylor',
      username: 'robert.t',
      email: 'robert.taylor@school.com',
      role: 'PARENT',
      status: 'pending',
      lastActive: '2024-03-13T13:10:00',
      phone: '+1 234 567 897',
      children: ['Michael Taylor'],
      avatar: 'RT',
      verified: false
    }
  ];

  const roles = [
    { value: 'all', label: 'All Roles', icon: Users },
    { value: 'STUDENT', label: 'Student', icon: GraduationCap, color: 'blue' },
    { value: 'TEACHER', label: 'Teacher', icon: School, color: 'green' },
    { value: 'PARENT', label: 'Parent', icon: UsersIcon, color: 'purple' },
    { value: 'STAFF', label: 'Staff', icon: UserCog, color: 'amber' },
    { value: 'ACCOUNTANT', label: 'Accountant', icon: Calculator, color: 'red' },
    { value: 'ADMIN', label: 'Admin', icon: Shield, color: 'orange' }
  ];

  const statuses = [
    { value: 'all', label: 'All Status', color: 'gray' },
    { value: 'active', label: 'Active', color: 'green' },
    { value: 'inactive', label: 'Inactive', color: 'gray' },
    { value: 'pending', label: 'Pending', color: 'yellow' },
    { value: 'suspended', label: 'Suspended', color: 'red' },
    { value: 'locked', label: 'Locked', color: 'orange' }
  ];

  const getRoleIcon = (role) => {
    const found = roles.find(r => r.value === role);
    const Icon = found?.icon || Users;
    return <Icon className="w-4 h-4" />;
  };

  const getRoleColor = (role) => {
    const found = roles.find(r => r.value === role);
    return found?.color || 'gray';
  };

  const getStatusColor = (status) => {
    const found = statuses.find(s => s.value === status);
    return found?.color || 'gray';
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'active': return <CheckCircle className="w-3 h-3" />;
      case 'inactive': return <XCircle className="w-3 h-3" />;
      case 'pending': return <Clock className="w-3 h-3" />;
      case 'suspended': return <XCircle className="w-3 h-3" />;
      case 'locked': return <Lock className="w-3 h-3" />;
      default: return <CheckCircle className="w-3 h-3" />;
    }
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
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

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-yellow-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
              User Management
            </h1>
            <p className="text-gray-600 mt-1">Manage all users in the system</p>
          </div>
          
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-orange-500 transition-colors flex items-center gap-2 text-sm">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button className="px-4 py-2 bg-linear-to-r from-orange-600 to-yellow-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2 text-sm">
              <UserPlus className="w-4 h-4" />
              <span>Add User</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-white rounded-xl p-3 sm:p-4 shadow-md">
            <p className="text-xs text-gray-600">Total Users</p>
            <p className="text-lg sm:text-2xl font-bold text-gray-800">1,284</p>
            <p className="text-xs text-green-600 mt-1">+12 this week</p>
          </div>
          <div className="bg-white rounded-xl p-3 sm:p-4 shadow-md">
            <p className="text-xs text-gray-600">Active Today</p>
            <p className="text-lg sm:text-2xl font-bold text-gray-800">342</p>
            <p className="text-xs text-green-600 mt-1">27% of total</p>
          </div>
          <div className="bg-white rounded-xl p-3 sm:p-4 shadow-md">
            <p className="text-xs text-gray-600">Pending</p>
            <p className="text-lg sm:text-2xl font-bold text-yellow-600">18</p>
            <p className="text-xs text-gray-600 mt-1">Need approval</p>
          </div>
          <div className="bg-white rounded-xl p-3 sm:p-4 shadow-md">
            <p className="text-xs text-gray-600">Locked</p>
            <p className="text-lg sm:text-2xl font-bold text-red-600">6</p>
            <p className="text-xs text-gray-600 mt-1">Accounts</p>
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
                placeholder="Search by name, email, or username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
              />
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
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 appearance-none bg-white"
                >
                  {roles.map(role => (
                    <option key={role.value} value={role.value}>{role.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>

              <div className="relative w-48">
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

              <button className="p-2.5 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <RefreshCw className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="lg:hidden mt-4 space-y-3">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 appearance-none bg-white"
                >
                  {roles.map(role => (
                    <option key={role.value} value={role.value}>{role.label}</option>
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
        {selectedUsers.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-4 mb-6 border-2 border-orange-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-sm font-medium text-gray-700">
                {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex flex-wrap gap-2">
                <button className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Activate
                </button>
                <button className="px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors text-sm flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Suspend
                </button>
                <button className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm flex items-center gap-1">
                  <Unlock className="w-4 h-4" />
                  Unlock
                </button>
                <button className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm flex items-center gap-1">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left">
                    <button onClick={toggleSelectAll} className="text-gray-500 hover:text-orange-600">
                      {selectedUsers.length === filteredUsers.length && filteredUsers.length > 0 ? (
                        <CheckCircle className="w-4 h-4 text-orange-600" />
                      ) : (
                        <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
                      )}
                    </button>
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="hidden md:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="hidden lg:table-cell px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 sm:px-6 py-4">
                      <button onClick={() => toggleSelectUser(user.id)} className="text-gray-500 hover:text-orange-600">
                        {selectedUsers.includes(user.id) ? (
                          <CheckCircle className="w-4 h-4 text-orange-600" />
                        ) : (
                          <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
                        )}
                      </button>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-linear-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-medium">
                          {user.avatar}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-xs text-gray-500">@{user.username}</div>
                          <div className="md:hidden text-xs text-gray-400 mt-1">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-3 h-3" />
                        <span className="text-sm">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <Phone className="w-3 h-3" />
                        <span className="text-sm">{user.phone}</span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`p-1 rounded-full bg-${getRoleColor(user.role)}-100`}>
                          {getRoleIcon(user.role)}
                        </div>
                        <span className="text-sm font-medium">{user.role}</span>
                      </div>
                      {user.grade && (
                        <div className="text-xs text-gray-500 mt-1">{user.grade}</div>
                      )}
                      {user.department && (
                        <div className="text-xs text-gray-500 mt-1">{user.department}</div>
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full
                        bg-${getStatusColor(user.status)}-100 text-${getStatusColor(user.status)}-800`}>
                        {getStatusIcon(user.status)}
                        {user.status}
                      </span>
                      {!user.verified && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 ml-2">
                          <XCircle className="w-3 h-3" />
                          Unverified
                        </span>
                      )}
                    </td>
                    <td className="hidden lg:table-cell px-4 sm:px-6 py-4 text-sm text-gray-600">
                      {new Date(user.lastActive).toLocaleString()}
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
                        <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-600">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t-2 border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm text-gray-600">
                Showing 1 to {filteredUsers.length} of {users.length} users
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 border-2 border-gray-200 rounded-lg hover:border-orange-500 transition-colors text-sm disabled:opacity-50" disabled>
                  Previous
                </button>
                <button className="px-3 py-1 bg-orange-600 text-white rounded-lg text-sm">1</button>
                <button className="px-3 py-1 border-2 border-gray-200 rounded-lg hover:border-orange-500 transition-colors text-sm">2</button>
                <button className="px-3 py-1 border-2 border-gray-200 rounded-lg hover:border-orange-500 transition-colors text-sm">3</button>
                <button className="px-3 py-1 border-2 border-gray-200 rounded-lg hover:border-orange-500 transition-colors text-sm">4</button>
                <button className="px-3 py-1 border-2 border-gray-200 rounded-lg hover:border-orange-500 transition-colors text-sm">5</button>
                <button className="px-3 py-1 border-2 border-gray-200 rounded-lg hover:border-orange-500 transition-colors text-sm">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;