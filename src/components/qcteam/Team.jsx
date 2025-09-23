import React, { useEffect, useState, useMemo } from "react";
import { userAPI } from "../../api/userAPI";
import { Mail, User, MapPin, UserCheck, Download, Shield } from "lucide-react";
import Loading from "../common/Loding";
import Table from "../common/Table";
import SearchBar from "../common/SearchBar";
import Pagination from "../common/Pagination";

function Team() {
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const tableHeaders = [
    {
      key: "username",
      label: "Name",
      icon: User,
      render: (value) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {value?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{value}</div>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      icon: Shield,
      render: (value) => {
        const roleColors = {
          SUPERADMIN: "bg-red-100 text-red-800",
          L1TEAM: "bg-purple-100 text-purple-800",
          ADMIN: "bg-blue-100 text-blue-800",
          QCTEAM: "bg-green-100 text-green-800",
        };
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              roleColors[value] || "bg-gray-100 text-gray-800"
            }`}
          >
            <Shield className="w-3 h-3 mr-1" />
            {value}
          </span>
        );
      },
    },
    {
      key: "email",
      label: "Email",
      icon: Mail,
      minWidth: "200px",
      render: (value) => (
        <div className="flex items-center text-sm text-gray-600">
          <Mail className="w-4 h-4 mr-2 text-gray-400" />
          {value}
        </div>
      ),
    },
    {
      key: "tlEmail",
      label: "Team Lead",
      icon: UserCheck,
      render: (value) => (
        <div className="flex items-center text-sm text-gray-600">
          <User className="w-4 h-4 mr-2 text-gray-400" />
          {value || "-"}
        </div>
      ),
    },
    {
      key: "location",
      label: "Location",
      icon: MapPin,
      render: (value) => (
        <span className="inline-flex items-center text-sm text-gray-600">
          <MapPin className="w-3 h-3 mr-1" />
          {value}
        </span>
      ),
    },
  ];

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await userAPI.getAllUsers();
      setUsers(data || []);
      setAllUsers(data || []);
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
      setUsers(allUsers);
      setCurrentPage(1);
    } else {
      const delayDebounce = setTimeout(() => {
        searchUsers(searchQuery);
        setCurrentPage(1);
      }, 400);
      return () => clearTimeout(delayDebounce);
    }
  }, [searchQuery]);

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, users.length);
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return users.slice(start, start + itemsPerPage);
  }, [users, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(users.length / itemsPerPage);

  const handleSearch = (query) => setSearchQuery(query);
  const handlePageChange = (page) => setCurrentPage(page);
  const handlePageSizeChange = (size) => {
    setItemsPerPage(size);
    setCurrentPage(1);
  };

  const handleExport = () => {
    const csvContent = [
      ["Name", "Role", "Email", "Team Lead", "Location"].join(","),
      ...users.map(
        (user) =>
          `"${user.username}","${user.role}","${user.email}","${user.tlEmail}","${user.location}"`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `team-members-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading && users.length === 0) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-9xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="md:flex md:items-center md:justify-between">
            {/* Left: Title + Subtitle */}
            <div className="min-w-0">
              <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Team Directory
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Showing {paginatedUsers.length} of {users.length} team members
              </p>
            </div>

            {/* Center: Search Bar */}
            <div className="flex-1 flex justify-center">
              <SearchBar searchQuery={searchQuery} onSearch={handleSearch} />
            </div>

            {/* Right: Buttons */}
            <div className="mt-4 flex md:mt-0 md:ml-4 space-x-2">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
                Add Employee
              </button>
              <button
                onClick={handleExport}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
            {error}
          </div>
        )}

        <div className="mb-6">
          <Table
            headers={tableHeaders}
            data={paginatedUsers}
            loading={loading}
            emptyMessage="No team members found"
            emptySubMessage="Try adjusting your search criteria or check back later"
            hoverable={true}
            compact={false}
          />
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={users.length}
            itemsPerPage={itemsPerPage}
            startIndex={startIndex}
            endIndex={endIndex}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
      </div>
    </div>
  );
}

export default Team;
