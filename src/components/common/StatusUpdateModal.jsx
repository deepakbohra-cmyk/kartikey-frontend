import React from 'react'

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

// ---- Modal Component ----
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
          <option value="PENDING">PENDING</option>
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



export default StatusUpdateModal