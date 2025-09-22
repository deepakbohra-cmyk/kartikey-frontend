import React, { useState, useMemo } from "react";
import { Search, Filter, Download, TrendingUp, TrendingDown, Users, AlertCircle, CheckCircle } from "lucide-react";
import GlobalTable from "../common/GlobalTable";
import Pagination from "../common/Pagination";

function Dashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const dashboardData = [
    {
      id: 1,
      name: "Deepak Sharma",
      team: "Frontend",
      email: "deepak@example.com",
      filled: 120,
      error: 3,
      status: "active",
      lastLogin: "2024-01-15",
    },
    {
      id: 2,
      name: "Aarav Mehta",
      team: "Backend",
      email: "aarav@example.com",
      filled: 98,
      error: 5,
      status: "active",
      lastLogin: "2024-01-14",
    },
    {
      id: 3,
      name: "Neha Verma",
      team: "QA",
      email: "neha@example.com",
      filled: 130,
      error: 1,
      status: "active",
      lastLogin: "2024-01-15",
    },
    {
      id: 4,
      name: "Rohit Kumar",
      team: "DevOps",
      email: "rohit@example.com",
      filled: 85,
      error: 2,
      status: "away",
      lastLogin: "2024-01-13",
    },
    {
      id: 5,
      name: "Priya Singh",
      team: "Design",
      email: "priya@example.com",
      filled: 145,
      error: 0,
      status: "active",
      lastLogin: "2024-01-15",
    },
    {
      id: 6,
      name: "Amit Patel",
      team: "Backend",
      email: "amit@example.com",
      filled: 92,
      error: 4,
      status: "inactive",
      lastLogin: "2024-01-10",
    },
    {
      id: 7,
      name: "Kavya Reddy",
      team: "Frontend",
      email: "kavya@example.com",
      filled: 110,
      error: 2,
      status: "active",
      lastLogin: "2024-01-15",
    },
    {
      id: 8,
      name: "Suresh Nair",
      team: "QA",
      email: "suresh@example.com",
      filled: 78,
      error: 6,
      status: "active",
      lastLogin: "2024-01-14",
    },
  ];

  const headers = ["Name", "Team", "Email", "Filled", "Errors", "Status"];

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return dashboardData;
    
    return dashboardData.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Calculate dashboard stats
  const stats = useMemo(() => {
    const totalFilled = dashboardData.reduce((sum, item) => sum + item.filled, 0);
    const totalErrors = dashboardData.reduce((sum, item) => sum + item.error, 0);
    const activeUsers = dashboardData.filter(item => item.status === 'active').length;
    const avgFilled = Math.round(totalFilled / dashboardData.length);

    return {
      totalUsers: dashboardData.length,
      activeUsers,
      totalFilled,
      totalErrors,
      avgFilled,
      errorRate: ((totalErrors / totalFilled) * 100).toFixed(1)
    };
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  };

  const handleExport = () => {
    // Simple CSV export
    const csvContent = [
      headers.join(','),
      ...filteredData.map(row => 
        `${row.name},${row.team},${row.email},${row.filled},${row.error},${row.status}`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dashboard-data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Active' },
      away: { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle, label: 'Away' },
      inactive: { color: 'bg-red-100 text-red-800', icon: AlertCircle, label: 'Inactive' }
    };
    
    const config = statusConfig[status] || statusConfig.inactive;
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  const getTeamBadge = (team) => {
    const teamColors = {
      Frontend: 'bg-blue-100 text-blue-800',
      Backend: 'bg-purple-100 text-purple-800',
      QA: 'bg-green-100 text-green-800',
      DevOps: 'bg-orange-100 text-orange-800',
      Design: 'bg-pink-100 text-pink-800'
    };
    
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${teamColors[team] || 'bg-gray-100 text-gray-800'}`}>
        {team}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Enhanced Table */}
        <GlobalTable
          title="Team Performance"
          subtitle={`Showing ${filteredData.length} of ${dashboardData.length} team members`}
          headers={headers}
          data={paginatedData}
          searchable={true}
          searchPlaceholder="Search by name, team, or email..."
          onSearch={handleSearch}
          exportable={true}
          onExport={handleExport}
          pagination={true}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredData.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          emptyMessage="No team members found"
          emptySubMessage="Try adjusting your search criteria"
          renderRow={(row) => (
            <tr key={row.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-8 w-8">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700">
                        {row.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {row.name}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getTeamBadge(row.team)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {row.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="text-sm font-semibold text-green-600">
                    {row.filled}
                  </div>
                  <TrendingUp className="ml-1 h-3 w-3 text-green-400" />
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className={`text-sm font-semibold ${row.error > 3 ? 'text-red-600' : 'text-yellow-600'}`}>
                    {row.error}
                  </div>
                  {row.error > 3 && <AlertCircle className="ml-1 h-3 w-3 text-red-400" />}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(row.status)}
              </td>
            </tr>
          )}
          headerActions={
            <div className="flex items-center gap-2">
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </button>
            </div>
          }
        />
      </div>
    </div>
  );
}

export default Dashboard;