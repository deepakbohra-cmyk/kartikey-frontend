import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Star, 
  Filter,
  Search,
  Download,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw
} from 'lucide-react';
import Table from '../common/Table';

// Sample feedback data
const sampleFeedbackData = [
  {
    id: 'FB001',
    date: '2024-03-15',
    time: '10:30 AM',
    formData: 'Customer Service Issue - Order #12345',
    agentEmail: 'john.doe@company.com',
    tlEmail: 'sarah.manager@company.com',
    rating: 4,
    status: 'Resolved',
    priority: 'Medium',
    category: 'Customer Service'
  },
  {
    id: 'FB002',
    date: '2024-03-14',
    time: '2:15 PM',
    formData: 'Technical Bug Report - Login Issues',
    agentEmail: 'mike.smith@company.com',
    tlEmail: 'sarah.manager@company.com',
    rating: 2,
    status: 'In Progress',
    priority: 'High',
    category: 'Technical'
  },
  {
    id: 'FB003',
    date: '2024-03-14',
    time: '9:45 AM',
    formData: 'Feature Request - Dashboard Enhancement',
    agentEmail: 'jane.wilson@company.com',
    tlEmail: 'david.lead@company.com',
    rating: 5,
    status: 'New',
    priority: 'Low',
    category: 'Feature Request'
  },
  {
    id: 'FB004',
    date: '2024-03-13',
    time: '4:20 PM',
    formData: 'Payment Processing Error - Transaction Failed',
    agentEmail: 'alex.brown@company.com',
    tlEmail: 'sarah.manager@company.com',
    rating: 1,
    status: 'Critical',
    priority: 'Critical',
    category: 'Payment'
  },
  {
    id: 'FB005',
    date: '2024-03-13',
    time: '11:10 AM',
    formData: 'UI/UX Improvement Suggestion',
    agentEmail: 'emma.davis@company.com',
    tlEmail: 'david.lead@company.com',
    rating: 4,
    status: 'Under Review',
    priority: 'Medium',
    category: 'Design'
  }
];

function FeedbackTable() {
  const [feedbackData, setFeedbackData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [openActionMenu, setOpenActionMenu] = useState(null);

  // Initialize data
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setFeedbackData(sampleFeedbackData);
      setFilteredData(sampleFeedbackData);
      setLoading(false);
    }, 500);
  }, []);

  // Filter data based on search and filters
  useEffect(() => {
    let filtered = feedbackData;

    // Search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.formData.toLowerCase().includes(searchLower) ||
        item.agentEmail.toLowerCase().includes(searchLower) ||
        item.tlEmail.toLowerCase().includes(searchLower) ||
        item.id.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter) {
      filtered = filtered.filter(item => item.priority === priorityFilter);
    }

    setFilteredData(filtered);
  }, [feedbackData, searchTerm, statusFilter, priorityFilter]);

  // Table headers configuration
  const tableHeaders = [
    {
      key: 'id',
      label: 'ID',
      icon: MessageSquare,
      textClassName: 'text-sm font-medium text-gray-900'
    },
    {
      key: 'date',
      label: 'Date',
      icon: Calendar,
      minWidth: '120px',
      textClassName: 'text-xs text-gray-500'
    },
    {
      key: 'time',
      label: 'Time',
      icon: Clock,
      minWidth: '100px',
      textClassName: 'text-xs text-gray-500'
    },
    {
      key: 'formData',
      label: 'Form Data',
      icon: MessageSquare,
      minWidth: '300px',
      render: (value, row) => (
        <div className="max-w-xs">
          <p className="text-sm text-gray-900 truncate" title={value}>
            {value}
          </p>
          <div className="flex items-center mt-1 space-x-2">
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(row.category)}`}>
              {row.category}
            </span>
            {getRatingStars(row.rating)}
          </div>
        </div>
      )
    },
    {
      key: 'agentEmail',
      label: 'Agent Email',
      icon: User,
      minWidth: '200px',
      render: (value) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-8 w-8">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
              <span className="text-xs font-medium text-white">
                {value.split('@')[0].charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm text-gray-900">{value}</p>
          </div>
        </div>
      )
    },
    {
      key: 'tlEmail',
      label: 'TL Email',
      icon: Mail,
      minWidth: '200px',
      render: (value) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-8 w-8">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
              <span className="text-xs font-medium text-white">
                {value.split('@')[0].charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm text-gray-900">{value}</p>
          </div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      icon: AlertCircle,
      minWidth: '120px',
      render: (value) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(value)}`}>
          {getStatusIcon(value)}
          {value}
        </span>
      )
    },
    {
      key: 'priority',
      label: 'Priority',
      icon: AlertCircle,
      minWidth: '100px',
      render: (value) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(value)}`}>
          {value}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      icon: MoreHorizontal,
      minWidth: '120px',
      cellClassName: 'relative',
      render: (value, row, header, rowIndex) => (
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleActionMenu(rowIndex);
            }}
            className="inline-flex items-center p-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          
          {openActionMenu === rowIndex && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-20">
              <div className="py-1">
                <button
                  onClick={() => handleAction('view', row)}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Eye className="w-4 h-4 mr-3" />
                  View Details
                </button>
                <button
                  onClick={() => handleAction('edit', row)}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Edit className="w-4 h-4 mr-3" />
                  Edit Feedback
                </button>
                <button
                  onClick={() => handleAction('assign', row)}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User className="w-4 h-4 mr-3" />
                  Reassign
                </button>
                <hr className="my-1" />
                <button
                  onClick={() => handleAction('delete', row)}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-3" />
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      )
    }
  ];

  // Helper functions
  const getStatusColor = (status) => {
    const colors = {
      'New': 'bg-blue-100 text-blue-800',
      'In Progress': 'bg-yellow-100 text-yellow-800',
      'Under Review': 'bg-purple-100 text-purple-800',
      'Resolved': 'bg-green-100 text-green-800',
      'Critical': 'bg-red-100 text-red-800',
      'Closed': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'New': <AlertCircle className="w-3 h-3 mr-1" />,
      'In Progress': <RefreshCw className="w-3 h-3 mr-1" />,
      'Under Review': <Eye className="w-3 h-3 mr-1" />,
      'Resolved': <CheckCircle className="w-3 h-3 mr-1" />,
      'Critical': <XCircle className="w-3 h-3 mr-1" />,
      'Closed': <CheckCircle className="w-3 h-3 mr-1" />
    };
    return icons[status] || null;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Low': 'bg-green-100 text-green-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'High': 'bg-orange-100 text-orange-800',
      'Critical': 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Customer Service': 'bg-blue-100 text-blue-800',
      'Technical': 'bg-red-100 text-red-800',
      'Feature Request': 'bg-green-100 text-green-800',
      'Payment': 'bg-yellow-100 text-yellow-800',
      'Design': 'bg-purple-100 text-purple-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getRatingStars = (rating) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3 h-3 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-xs text-gray-500">({rating})</span>
      </div>
    );
  };

  // Action handlers
  const handleToggleActionMenu = (rowIndex) => {
    setOpenActionMenu(openActionMenu === rowIndex ? null : rowIndex);
  };

  const handleAction = (action, row) => {
    setOpenActionMenu(null);
    
    switch (action) {
      case 'view':
        alert(`Viewing feedback: ${row.id}`);
        break;
      case 'edit':
        alert(`Editing feedback: ${row.id}`);
        break;
      case 'assign':
        alert(`Reassigning feedback: ${row.id}`);
        break;
      case 'delete':
        if (window.confirm(`Are you sure you want to delete feedback ${row.id}?`)) {
          setFeedbackData(prev => prev.filter(item => item.id !== row.id));
        }
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['ID', 'Date', 'Time', 'Form Data', 'Agent Email', 'TL Email', 'Status', 'Priority', 'Rating'].join(','),
      ...filteredData.map(row => 
        `"${row.id}","${row.date}","${row.time}","${row.formData}","${row.agentEmail}","${row.tlEmail}","${row.status}","${row.priority}","${row.rating}"`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feedback-data-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setPriorityFilter('');
    setShowFilters(false);
  };

  // Close action menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenActionMenu(null);
    if (openActionMenu !== null) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openActionMenu]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Feedback Management</h1>
              <p className="mt-1 text-sm text-gray-500">
                Showing {filteredData.length} of {feedbackData.length} feedback entries
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleExport}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mt-4 space-y-4">
            {/* Search Bar */}
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search feedback..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
              />
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="">All Status</option>
                      <option value="New">New</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Critical">Critical</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                    <select
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value)}
                      className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="">All Priorities</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                  
                  <div className="flex items-end">
                    <button
                      onClick={clearFilters}
                      className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <MessageSquare className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Feedback</dt>
                    <dd className="text-lg font-medium text-gray-900">{feedbackData.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-6 w-6 text-red-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Critical Issues</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {feedbackData.filter(item => item.priority === 'Critical' || item.status === 'Critical').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Resolved</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {feedbackData.filter(item => item.status === 'Resolved').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Star className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Avg Rating</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {feedbackData.length > 0 ? (feedbackData.reduce((sum, item) => sum + item.rating, 0) / feedbackData.length).toFixed(1) : '0'}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <Table
          headers={tableHeaders}
          data={filteredData}
          loading={loading}
          emptyMessage="No feedback entries found"
          emptySubMessage="Try adjusting your search criteria or add some feedback"
          hoverable={true}
          compact={false}
        />
      </div>
    </div>
  );
}

export default FeedbackTable;