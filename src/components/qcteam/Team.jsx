import React, { useEffect, useState, useMemo } from "react";
import { userAPI } from "../../api/userAPI";
import { Mail, User, MapPin, UserCheck, Search, Download, Filter, Users, Shield, Globe } from "lucide-react";
import Loading from "../common/Loding";
import GlobalTable from "../common/GlobalTable";

function Team() {
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]); // Keep original data for stats
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await userAPI.getAllUsers();
      setUsers(data || []);
      setAllUsers(data || []); // Store original data
    } catch (err) {
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async (query) => {
    try {
      setLoading(true);
      setError("");
      const data = await userAPI.searchUsers(query);
      setUsers(data || []);
    } catch (err) {
      setError("Failed to search users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      fetchUsers();
      setCurrentPage(1); // Reset to first page
    } else {
      const delayDebounce = setTimeout(() => {
        searchUsers(searchQuery);
        setCurrentPage(1); // Reset to first page when searching
      }, 400);
      return () => clearTimeout(delayDebounce);
    }
  }, [searchQuery]);

  // Calculate pagination
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return users.slice(startIndex, startIndex + itemsPerPage);
  }, [users, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(users.length / itemsPerPage);

  // Calculate team stats
  const teamStats = useMemo(() => {
    const stats = {
      totalMembers: allUsers.length,
      activeMembers: allUsers.filter(user => user.status !== 'inactive').length,
      uniqueRoles: [...new Set(allUsers.map(user => user.role))].length,
      uniqueLocations: [...new Set(allUsers.map(user => user.location))].length
    };
    return stats;
  }, [allUsers]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  };

  const handleExport = () => {
    const csvContent = [
      ["Name", "Role", "Email", "Team Lead", "Location"].join(','),
      ...users.map(user => 
        `"${user.username}","${user.role}","${user.email}","${user.tlEmail}","${user.location}"`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `team-members-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getRoleBadge = (role) => {
    const roleColors = {
      'Admin': 'bg-red-100 text-red-800',
      'Manager': 'bg-purple-100 text-purple-800',
      'Developer': 'bg-blue-100 text-blue-800',
      'Designer': 'bg-green-100 text-green-800',
      'QA': 'bg-yellow-100 text-yellow-800',
      'DevOps': 'bg-orange-100 text-orange-800',
      'Analyst': 'bg-indigo-100 text-indigo-800'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColors[role] || 'bg-gray-100 text-gray-800'}`}>
        <Shield className="w-3 h-3 mr-1" />
        {role}
      </span>
    );
  };

  const getLocationBadge = (location) => {
    return (
      <span className="inline-flex items-center text-sm text-gray-600">
        <MapPin className="w-3 h-3 mr-1" />
        {location}
      </span>
    );
  };

  const headers = ["Name", "Role", "Email", "Team Lead", "Location"];

  if (loading && users.length === 0) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Team Members</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage and view all team members across different roles and locations
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Table with GlobalTable */}
        <GlobalTable
          title="Team Directory"
          subtitle={`Showing ${paginatedUsers.length} of ${users.length} team members`}
          headers={headers}
          data={paginatedUsers}
          loading={loading}
          searchable={true}
          searchPlaceholder="Search by name or email..."
          onSearch={handleSearch}
          exportable={true}
          onExport={handleExport}
          pagination={true}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={users.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          emptyMessage="No team members found"
          emptySubMessage="Try adjusting your search criteria or check back later"
          renderRow={(user) => (
            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {user.username?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {user.username}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getRoleBadge(user.role)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2 text-gray-400" />
                  {user.email}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-sm text-gray-600">
                  <User className="w-4 h-4 mr-2 text-gray-400" />
                  {user.tlEmail || '-'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getLocationBadge(user.location)}
              </td>
            </tr>
          )}
          headerActions={
            <div className="flex items-center gap-2">
              <button 
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Refresh
              </button>
            </div>
          }
        />
      </div>
    </div>
  );
}

export default Team;