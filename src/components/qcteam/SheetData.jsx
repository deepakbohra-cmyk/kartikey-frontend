import React, { useState, useEffect } from 'react';
import { Mail, Calendar, User, FileText, Home, ChevronDown, Search, Filter, Hash, Clock, UserCheck } from 'lucide-react';

const SheetData = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState({
    email: '',
    workType: '',
    decision: '',
    rowsPerPage: 10
  });

  // Extended sample data simulating database/sheet data
  const sampleData = [
    { id: 1, timestamp: '2024-01-15 10:30:00', email: 'john@example.com', workType: 'remote', gid: 'GID001', decision: 'approved' },
    { id: 2, timestamp: '2024-01-16 14:45:00', email: 'sarah@company.com', workType: 'normal', gid: 'GID002', decision: 'pending_review' },
    { id: 3, timestamp: '2024-01-17 09:15:00', email: 'mike@business.com', workType: 'remote', gid: 'GID003', decision: 'rejected' },
    { id: 4, timestamp: '2024-01-18 16:20:00', email: 'emma@startup.com', workType: 'normal', gid: 'GID004', decision: 'approved' },
    { id: 5, timestamp: '2024-01-19 11:45:00', email: 'alex@tech.com', workType: 'remote', gid: 'GID005', decision: 'escalated' },
    { id: 6, timestamp: '2024-01-20 13:30:00', email: 'lisa@corp.com', workType: 'normal', gid: 'GID006', decision: 'on_hold' },
    { id: 7, timestamp: '2024-01-21 08:50:00', email: 'david@agency.com', workType: 'remote', gid: 'GID007', decision: 'approved' },
    { id: 8, timestamp: '2024-01-22 15:10:00', email: 'anna@studio.com', workType: 'normal', gid: 'GID008', decision: 'needs_more_information' },
    { id: 9, timestamp: '2024-01-23 12:25:00', email: 'tom@enterprise.com', workType: 'remote', gid: 'GID009', decision: 'approved' },
    { id: 10, timestamp: '2024-01-24 17:40:00', email: 'kate@digital.com', workType: 'normal', gid: 'GID010', decision: 'rejected' },
    { id: 11, timestamp: '2024-01-25 09:35:00', email: 'ben@solutions.com', workType: 'remote', gid: 'GID011', decision: 'pending_review' },
    { id: 12, timestamp: '2024-01-26 14:15:00', email: 'julia@media.com', workType: 'normal', gid: 'GID012', decision: 'approved' },
    { id: 13, timestamp: '2024-01-27 11:20:00', email: 'sam@consulting.com', workType: 'remote', gid: 'GID013', decision: 'escalated' },
    { id: 14, timestamp: '2024-01-28 16:45:00', email: 'nina@services.com', workType: 'normal', gid: 'GID014', decision: 'on_hold' },
    { id: 15, timestamp: '2024-01-29 10:55:00', email: 'ryan@innovation.com', workType: 'remote', gid: 'GID015', decision: 'approved' },
    { id: 16, timestamp: '2024-01-30 13:10:00', email: 'zoe@creative.com', workType: 'normal', gid: 'GID016', decision: 'rejected' },
    { id: 17, timestamp: '2024-01-31 15:30:00', email: 'mark@systems.com', workType: 'remote', gid: 'GID017', decision: 'needs_more_information' },
    { id: 18, timestamp: '2024-02-01 09:40:00', email: 'lucy@platform.com', workType: 'normal', gid: 'GID018', decision: 'approved' }
  ];

  useEffect(() => {
    // Simulate loading data from database/sheet
    setData(sampleData);
    setTotalCount(sampleData.length);
    applyFilters();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, data]);

  const applyFilters = () => {
    let filtered = data.filter(item => {
      return (
        item.email.toLowerCase().includes(filters.email.toLowerCase()) &&
        (filters.workType === '' || item.workType === filters.workType) &&
        (filters.decision === '' || item.decision === filters.decision)
      );
    });
    setFilteredData(filtered.slice(0, filters.rowsPerPage));
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const formatDecision = (decision) => {
    return decision.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getDecisionColor = (decision) => {
    const colors = {
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      pending_review: 'bg-yellow-100 text-yellow-800',
      escalated: 'bg-purple-100 text-purple-800',
      on_hold: 'bg-gray-100 text-gray-800',
      needs_more_information: 'bg-blue-100 text-blue-800'
    };
    return colors[decision] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side - Nav items */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2 text-purple-600 font-semibold">
                <Home className="w-5 h-5" />
                <span>Home</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Calendar className="w-5 h-5" />
                <span>Count till now</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <User className="w-5 h-5" />
                <span>Kartikey</span>
              </div>
            </div>
            
            {/* Right side - Email */}
            <div className="flex items-center space-x-2 text-gray-600">
              <Mail className="w-4 h-4" />
              <span className="text-sm">abc@gmail.com</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header with Rows Filter */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Data Overview</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={filters.rowsPerPage}
                  onChange={(e) => handleFilterChange('rowsPerPage', parseInt(e.target.value))}
                  className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                >
                  <option value={5}>5 rows</option>
                  <option value={10}>10 rows</option>
                  <option value={15}>15 rows</option>
                  <option value={20}>20 rows</option>
                  <option value={25}>25 rows</option>
                </select>
              </div>
              <div className="flex items-center space-x-2 bg-purple-100 px-4 py-2 rounded-lg">
                <FileText className="w-5 h-5 text-purple-600" />
                <span className="text-purple-800 font-medium">Showing: {filteredData.length} of {totalCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <div className="flex items-center space-x-1">
                      <Hash className="w-3 h-3 text-gray-400" />
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">ID</span>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</span>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <div className="flex items-center space-x-1">
                      <Mail className="w-3 h-3 text-gray-400" />
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</span>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Filter..."
                          value={filters.email}
                          onChange={(e) => handleFilterChange('email', e.target.value)}
                          className="w-20 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                        <Search className="w-2 h-2 text-gray-400 absolute right-1 top-1.5" />
                      </div>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3 text-gray-400" />
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Work Type</span>
                      <select
                        value={filters.workType}
                        onChange={(e) => handleFilterChange('workType', e.target.value)}
                        className="w-20 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                      >
                        <option value="">All</option>
                        <option value="normal">Normal</option>
                        <option value="remote">Remote</option>
                      </select>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <div className="flex items-center space-x-1">
                      <Hash className="w-3 h-3 text-gray-400" />
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">GID</span>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <div className="flex items-center space-x-1">
                      <UserCheck className="w-3 h-3 text-gray-400" />
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Decision</span>
                      <select
                        value={filters.decision}
                        onChange={(e) => handleFilterChange('decision', e.target.value)}
                        className="w-20 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                      >
                        <option value="">All</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="pending_review">Pending</option>
                        <option value="escalated">Escalated</option>
                        <option value="on_hold">On Hold</option>
                        <option value="needs_more_information">Need Info</option>
                      </select>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                      {row.id}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">
                      {row.timestamp}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      {row.email}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        row.workType === 'remote' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {row.workType.charAt(0).toUpperCase() + row.workType.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 font-mono">
                      {row.gid}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDecisionColor(row.decision)}`}>
                        {formatDecision(row.decision)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Approved</p>
                <p className="text-lg font-semibold text-gray-900">
                  {filteredData.filter(item => item.decision === 'approved').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-lg font-semibold text-gray-900">
                  {filteredData.filter(item => item.decision === 'pending_review').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Rejected</p>
                <p className="text-lg font-semibold text-gray-900">
                  {filteredData.filter(item => item.decision === 'rejected').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SheetData;