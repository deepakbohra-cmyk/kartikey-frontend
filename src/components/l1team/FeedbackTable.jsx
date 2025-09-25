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
  RefreshCw 
} from 'lucide-react';
import Table from '../common/Table';
import { feedbackAPI } from '../../api/feedbackAPI';

function StatusUpdateModal({ isOpen, onClose, selectedRow, onStatusUpdate }) {
  const [newStatus, setNewStatus] = useState(selectedRow?.status || '');

  useEffect(() => {
    setNewStatus(selectedRow?.status || '');
  }, [selectedRow]);

  if (!isOpen || !selectedRow) return null;

  const handleSubmit = () => {
    onStatusUpdate(selectedRow.id, newStatus);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">Update Status</h2>

        <p className="mb-2 text-gray-600">
          <span className="font-medium">GID:</span> {selectedRow.gid}
        </p>
        <p className="mb-4 text-gray-600">
          <span className="font-medium">Agent:</span> {selectedRow.agentEmail}
        </p>

        <select
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        >
          <option value="OPEN">OPEN</option>
          <option value="AGENTACTIONREQUIRED">AGENT ACTION REQUIRED</option>
          <option value="QAREVIEWPENDING">QA REVIEW PENDING</option>
          <option value="CLOSED">CLOSED</option>
        </select>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// ---- Main Component ----
function FeedbackTable() {
  const [feedbackData, setFeedbackData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      setLoading(true);
      try {
        const response = await feedbackAPI.getAllFeedback();
        console.log("API raw response:", response);

        const data = Array.isArray(response) ? response 
                    : response?.data 
                    ? response.data 
                    : [];

        const mapped = data.map(item => ({
          id: String(item.id),
          formDate: item.date,
          formTime: item.time?.split('.')[0] || item.time,
          agentEmail: item.email,
          tlEmail: item.tlEmail,
          gid: item.gid,
          decision: item.decision,
          status: item.status
        }));

        setFeedbackData(mapped);
        setFilteredData(mapped);
      } catch (error) {
        console.error("Failed to fetch feedback:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
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

  const handleStatusUpdate = async (id, newStatus) => {
  try {
    const response = await feedbackAPI.changeStatus(id, { status: newStatus });

    const updatedFeedback = response.data || response;

    const updatedData = feedbackData.map(item =>
      item.id === String(id) ? { ...item, status: updatedFeedback.status } : item
    );

    setFeedbackData(updatedData);
    setFilteredData(updatedData);

  } catch (error) {
    console.error("Failed to update status:", error);
    alert("Error updating status. Please try again.");
  }
};


  // Helpers
  const getStatusColor = (status) => {
    const colors = {
      'OPEN': 'bg-blue-100 text-blue-800',
      'AGENTACTIONREQUIRED': 'bg-yellow-100 text-yellow-800',
      'QAREVIEWPENDING': 'bg-red-100 text-red-800',
      'CLOSED': 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'OPEN': <RefreshCw className="w-3 h-3 mr-1" />,
      'AGENTACTIONREQUIRED': <RefreshCw className="w-3 h-3 mr-1" />,
      'QAREVIEWPENDING': <AlertCircle className="w-3 h-3 mr-1" />,
      'CLOSED': <CheckCircle className="w-3 h-3 mr-1" />
    };
    return icons[status] || null;
  };

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
  ];

  const handleRowClick = (row) => {
    setSelectedRow(row);
    setIsModalOpen(true);
  };

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
          onRowClick={handleRowClick}  
        />

        <StatusUpdateModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedRow={selectedRow}
          onStatusUpdate={handleStatusUpdate}
        />
      </div>
    </div>
  );
}

export default FeedbackTable;
