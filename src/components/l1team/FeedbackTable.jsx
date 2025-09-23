import React, { useState, useEffect } from 'react';
import { 
  Hash, 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  UserCheck, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2 
} from 'lucide-react';
import Table from '../common/Table';
import { sampleFeedbackData } from '../constants/Sample';

function FeedbackTable() {
  const [feedbackData, setFeedbackData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
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

  // Filter data
  useEffect(() => {
    let filtered = feedbackData;

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.agentEmail.toLowerCase().includes(searchLower) ||
        item.tlEmail.toLowerCase().includes(searchLower) ||
        item.gid.toLowerCase().includes(searchLower) ||
        item.id.toLowerCase().includes(searchLower)
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    setFilteredData(filtered);
  }, [feedbackData, searchTerm, statusFilter]);

  // Helpers
  const getStatusColor = (status) => {
    const colors = {
      'OPEN': 'bg-blue-100 text-blue-800',
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'CLOSED': 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'OPEN': <RefreshCw className="w-3 h-3 mr-1" />,
      'PENDING': <AlertCircle className="w-3 h-3 mr-1" />,
      'CLOSED': <CheckCircle className="w-3 h-3 mr-1" />
    };
    return icons[status] || null;
  };

  // Table headers
  const tableHeaders = [
    { key: 'id', label: 'ID', icon: Hash },
    { key: 'formDate', label: 'Date', icon: Calendar },
    { key: 'formTime', label: 'Time', icon: Clock },
    { key: 'gid', label: 'GID', icon: Hash },
    { key: 'agentEmail', label: 'Agent Email', icon: User },
    { key: 'tlEmail', label: 'TL Email', icon: Mail },
    { key: 'decision', label: 'Decision', icon: UserCheck },
    {
      key: 'status',
      label: 'Status',
      icon: AlertCircle,
      render: (value) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(value)}`}>
          {getStatusIcon(value)}
          {value}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      icon: MoreHorizontal,
      render: (value, row, header, rowIndex) => (
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpenActionMenu(openActionMenu === rowIndex ? null : rowIndex);
            }}
            className="inline-flex items-center p-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {openActionMenu === rowIndex && (
            <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-20">
              <button className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-50">
                <Eye className="w-4 h-4 mr-2" /> View
              </button>
              <button className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-50">
                <Edit className="w-4 h-4 mr-2" /> Edit
              </button>
              <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </button>
            </div>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Feedback Management</h1>

        <Table
          headers={tableHeaders}
          data={filteredData}
          loading={loading}
          emptyMessage="No feedback entries found"
          emptySubMessage="Try searching by ID, GID, Agent or TL email"
          hoverable
          compact={false}
        />
      </div>
    </div>
  );
}

export default FeedbackTable;
