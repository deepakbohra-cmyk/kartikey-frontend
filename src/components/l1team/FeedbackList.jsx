import React, { useState, useEffect } from 'react';
import { MessageSquare, Eye, Edit, Trash2, Plus, Search, Filter, AlertCircle } from 'lucide-react';

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock feedback data - replace with actual API call
  const mockFeedbacks = [
    {
      id: 1,
      gid: 'GID001',
      title: 'Product Quality Issue',
      description: 'The product description does not match the actual item received.',
      status: 'Pending QA Review',
      priority: 'High',
      createdBy: 'john@example.com',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T14:20:00Z',
      assignedTo: 'qa-team@company.com'
    },
    {
      id: 2,
      gid: 'GID002',
      title: 'Data Inconsistency',
      description: 'Found inconsistent pricing data across multiple product variants.',
      status: 'Agent Action Required',
      priority: 'Medium',
      createdBy: 'sarah@example.com',
      createdAt: '2024-01-14T09:15:00Z',
      updatedAt: '2024-01-16T11:45:00Z',
      assignedTo: 'agent-team@company.com'
    },
    {
      id: 3,
      gid: 'GID003',
      title: 'Missing Product Images',
      description: 'Several products are missing required product images.',
      status: 'Closed',
      priority: 'Low',
      createdBy: 'mike@example.com',
      createdAt: '2024-01-13T16:20:00Z',
      updatedAt: '2024-01-17T10:30:00Z',
      assignedTo: 'content-team@company.com'
    },
    {
      id: 4,
      gid: 'GID004',
      title: 'Category Misclassification',
      description: 'Product has been placed in wrong category hierarchy.',
      status: 'Pending QA Review',
      priority: 'High',
      createdBy: 'emma@example.com',
      createdAt: '2024-01-12T13:45:00Z',
      updatedAt: '2024-01-18T09:15:00Z',
      assignedTo: 'qa-team@company.com'
    },
    {
      id: 5,
      gid: 'GID005',
      title: 'Duplicate Content Detection',
      description: 'Potential duplicate product entries found in the system.',
      status: 'Agent Action Required',
      priority: 'Medium',
      createdBy: 'alex@example.com',
      createdAt: '2024-01-11T11:30:00Z',
      updatedAt: '2024-01-19T15:20:00Z',
      assignedTo: 'agent-team@company.com'
    }
  ];

  // Simulate API call
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setFeedbacks(mockFeedbacks);
        setError(null);
      } catch (err) {
        setError('Failed to load feedback data');
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  // Filter feedbacks based on search and status
  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesSearch = feedback.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.gid.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || feedback.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredFeedbacks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedFeedbacks = filteredFeedbacks.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Closed':
        return 'bg-gray-100 text-gray-800';
      case 'Pending QA Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Agent Action Required':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const handleViewFeedback = (feedback) => {
    alert(`Viewing feedback: ${feedback.title}`);
  };

  const handleEditFeedback = (feedback) => {
    alert(`Editing feedback: ${feedback.title}`);
  };

  const handleDeleteFeedback = (feedbackId) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      setFeedbacks(prev => prev.filter(f => f.id !== feedbackId));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading feedback data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-6 h-6 text-purple-600" />
              <h1 className="text-2xl font-semibold text-gray-900">Feedback Management</h1>
            </div>
            <button className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              New Feedback
            </button>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, GID, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
              >
                <option value="All">All Status</option>
                <option value="Pending QA Review">Pending QA Review</option>
                <option value="Agent Action Required">Agent Action Required</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Feedback Cards */}
        <div className="space-y-4">
          {paginatedFeedbacks.map((feedback) => (
            <div key={feedback.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{feedback.title}</h3>
                    <span className="text-sm text-gray-500 font-mono">{feedback.gid}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{feedback.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(feedback.status)}`}>
                      {feedback.status}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(feedback.priority)}`}>
                      {feedback.priority} Priority
                    </span>
                  </div>

                  <div className="flex items-center text-xs text-gray-500 space-x-4">
                    <span>Created by: {feedback.createdBy}</span>
                    <span>Created: {formatDate(feedback.createdAt)}</span>
                    <span>Updated: {formatDate(feedback.updatedAt)}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleViewFeedback(feedback)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEditFeedback(feedback)}
                    className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                    title="Edit Feedback"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteFeedback(feedback.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Delete Feedback"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {paginatedFeedbacks.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <p className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredFeedbacks.length)} of {filteredFeedbacks.length} results
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded-md">
                {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackList;