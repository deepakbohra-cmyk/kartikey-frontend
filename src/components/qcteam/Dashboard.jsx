import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import Table from "../common/Table";

function Dashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleView, setRoleView] = useState("All"); // ✅ Default: All
  const [loading, setLoading] = useState(false);

  // ✅ Unified data
  const baseData = [
    {
      id: 1,
      name: "Deepak Sharma",
      role: "L1",
      email: "deepak@example.com",
      team: "Frontend",
      filled: 120,
      qcFilled: 95,
      feedbackClicked: 12,
      feedbackReceived: 20,
      error: 3,
      score: 88,
    },
    {
      id: 2,
      name: "Aarav Mehta",
      role: "QC",
      email: "aarav@example.com",
      team: "Backend",
      filled: 90,
      qcFilled: 0,
      feedbackClicked: 8,
      feedbackReceived: 18,
      error: 5,
      score: 80,
    },
    {
      id: 3,
      name: "Neha Verma",
      role: "TL",
      email: "neha@example.com",
      team: "QA",
      filled: 130,
      qcFilled: 0,
      feedbackClicked: 15,
      feedbackReceived: 25,
      error: 2,
      score: 92,
    },
    {
      id: 4,
      name: "Rohit Kumar",
      role: "L1",
      email: "rohit@example.com",
      team: "DevOps",
      filled: 85,
      qcFilled: 70,
      feedbackClicked: 6,
      feedbackReceived: 10,
      error: 4,
      score: 75,
    },
    {
      id: 5,
      name: "Priya Singh",
      role: "QC",
      email: "priya@example.com",
      team: "Design",
      filled: 100,
      qcFilled: 0,
      feedbackClicked: 11,
      feedbackReceived: 19,
      error: 1,
      score: 90,
    },
  ];

  // ✅ Dynamic table headers per role
  const tableHeaders = useMemo(() => {
    if (roleView === "L1") {
      return [
        { key: "name", label: "Name" },
        { key: "role", label: "Role" },
        { key: "email", label: "Email" },
        { key: "filled", label: "Form Filled" },
        { key: "qcFilled", label: "QC Form Filled" },
        { key: "feedbackClicked", label: "Feedback Clicked" },
        { key: "score", label: "Score" },
      ];
    }
    if (roleView === "QC") {
      return [
        { key: "name", label: "Name" },
        { key: "role", label: "Role" },
        { key: "email", label: "Email" },
        { key: "filled", label: "Form Filled" },
        { key: "feedbackClicked", label: "Feedback Clicked" },
      ];
    }
    if (roleView === "TL") {
      return [
        { key: "name", label: "Name" },
        { key: "role", label: "Role" },
        { key: "email", label: "Email" },
        { key: "team", label: "Team" },
        { key: "filled", label: "Team Form Filled" },
        { key: "feedbackReceived", label: "Feedback Received" },
        { key: "error", label: "Error" },
      ];
    }
    return [
      { key: "name", label: "Name" },
      { key: "role", label: "Role" },
      { key: "email", label: "Email" },
      { key: "filled", label: "Form Filled" },
      { key: "qcFilled", label: "QC Form Filled" },
      { key: "feedbackClicked", label: "Feedback Clicked" },
      { key: "feedbackReceived", label: "Feedback Received" },
      { key: "error", label: "Error" },
      { key: "score", label: "Score" },
    ];
  }, [roleView]);

  // ✅ Filter + Search + Pagination
  const filteredData = useMemo(() => {
    let filtered =
      roleView === "All"
        ? baseData
        : baseData.filter((item) => item.role === roleView);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.email.toLowerCase().includes(query)
      );
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    return filtered.slice(startIndex, startIndex + itemsPerPage);
  }, [baseData, roleView, searchQuery, currentPage, itemsPerPage]);

  // ✅ Pagination count
  const totalFiltered =
    roleView === "All"
      ? baseData
      : baseData.filter((item) => item.role === roleView);
  const totalPages = Math.ceil(totalFiltered.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-10xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Team Performance Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                View performance by role (L1, QC, TL or All)
              </p>
            </div>

            {/* Search + Dropdown */}
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              {/* Search */}
              <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              {/* Role Dropdown */}
              <select
                value={roleView}
                onChange={(e) => {
                  setRoleView(e.target.value);
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="All">All</option>
                <option value="L1">L1</option>
                <option value="QC">QC</option>
                <option value="TL">TL</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <Table
          headers={tableHeaders}
          data={filteredData}
          loading={loading}
          emptyMessage={`No ${roleView === "All" ? "" : roleView} records found`}
          hoverable
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-lg shadow-sm">
            <div className="flex-1 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Show</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
                  className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
                <span className="text-sm text-gray-700">per page</span>
              </div>

              <div className="text-sm text-gray-700">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, totalFiltered.length)} of{" "}
                {totalFiltered.length}
              </div>

              <div className="flex space-x-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-l-md text-sm bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-r-md text-sm bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;