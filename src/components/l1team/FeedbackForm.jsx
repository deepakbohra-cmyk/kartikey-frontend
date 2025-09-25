import React, { useState, useEffect } from 'react';
import { MessageSquare, Loader2, CheckCircle, AlertCircle, X, RefreshCw } from 'lucide-react';

export default function FeedbackStatusUpdater() {
  const [selectedStatus, setSelectedStatus] = useState('Closed');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [feedbackData, setFeedbackData] = useState({
    rowNumber: null,
    gid: null
  });

  const statusOptions = [
    { value: 'Closed', label: 'Closed', color: 'bg-gray-500' },
    { value: 'Pending QA Review', label: 'Pending QA Review', color: 'bg-yellow-500' },
    { value: 'Agent Action Required', label: 'Agent Action Required', color: 'bg-red-500' }
  ];

  // Simulate getting URL parameters
  useEffect(() => {

    //Automated mock data for testing
    const mockData = {
      rowNumber: Math.floor(Math.random() * 100) + 2,
      gid: `GID-${Math.random().toString(36).substr(2, 8).toUpperCase()}`
    };
    
    setFeedbackData(mockData);
    
    if (!mockData.rowNumber || mockData.rowNumber <= 1) {
      setError('Error: Feedback Row Number is missing or invalid. Cannot update status.');
      console.error('Invalid row number:', mockData.rowNumber);
    }
  }, []);
  const updateFeedbackStatus = async (rowNumber, status) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const outcomes = [
          { success: true, message: `Status successfully updated to "${status}" for row ${rowNumber}` },
          { success: true, message: `Feedback status changed to "${status}" - GID: ${feedbackData.gid}` },
          { success: false, message: 'Network error: Could not connect to database' },
          { success: false, message: 'Permission denied: Unable to update feedback status' }
        ];
        
        const outcome = Math.random() < 0.8 ? outcomes[Math.floor(Math.random() * 2)] : outcomes[Math.floor(Math.random() * 2) + 2];
        
        if (outcome.success) {
          resolve(outcome.message);
        } else {
          reject(new Error(outcome.message));
        }
      }, 2000);
    });
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!feedbackData.rowNumber || feedbackData.rowNumber <= 1) {
      setError('Cannot update: Invalid row number');
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('Updating status...');

    try {
      const response = await updateFeedbackStatus(feedbackData.rowNumber, selectedStatus);
      setMessage(response);
      setIsSuccess(true);
      
      setTimeout(() => {
        alert('Status updated successfully! Dialog would close now.');
        console.log('Dialog closed');
      }, 2000);
      
    } catch (err) {
      setError(`Error updating status: ${err.message}`);
      setMessage('');
    } finally {
      setIsLoading(false);
    }
  };

  //This is for testing and it will be skipped later on
  const handleClose = () => {
    if (window.confirm('Are you sure you want to close without saving?')) {
      alert('Dialog closed');
    }
  };

  const handleRetry = () => {
    setError('');
    setFeedbackData({
      rowNumber: Math.floor(Math.random() * 100) + 2,
      gid: `GID-${Math.random().toString(36).substr(2, 8).toUpperCase()}`
    });
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Status Updated</h2>
          <p className="text-gray-600">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-50 py-8 px-4 flex items-center justify-center">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-t-lg border-t-4 border-purple-600 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-6 h-6 text-purple-600" />
              <div>
                <h1 className="text-2xl font-normal text-gray-800">Update Feedback Status</h1>
                {feedbackData.gid && (
                  <p className="text-sm text-gray-600">GID: {feedbackData.gid}</p>
                )}
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-b-lg shadow-sm">
          <div className="p-6 space-y-6">
            
            {/* Row info */}
            {feedbackData.rowNumber && (
              <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Processing Row:</span> {feedbackData.rowNumber}
                </p>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            {/* Loading message */}
            {isLoading && message && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md flex items-center space-x-3">
                <Loader2 className="w-5 h-5 text-blue-500 animate-spin flex-shrink-0" />
                <span className="text-blue-700 text-sm">{message}</span>
              </div>
            )}

            {!error && (
              <div className="space-y-4">
                {/* Status selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Select New Status
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    disabled={isLoading}
                    className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      isLoading 
                        ? 'border-gray-200 bg-gray-50 cursor-not-allowed' 
                        : 'border-gray-300'
                    }`}
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Submit button */}
                <div className="flex justify-end pt-4">
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className={`flex items-center px-8 py-2 rounded-md font-medium transition-colors ${
                      isLoading
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500'
                    }`}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4 mr-2" />
                    )}
                    {isLoading ? 'Updating...' : 'Update Status'}
                  </button>
                </div>
              </div>
            )}

            {/* Retry button for errors */}
            {error && feedbackData.rowNumber <= 1 && (
              <div className="flex justify-end">
                <button
                  onClick={handleRetry}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  Retry with Valid Data
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          Feedback Management System
        </div>
      </div>
    </div>
  );
}

export { FeedbackStatusUpdater };