import React, { useState, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import Table from "../common/Table";
import Pagination from "../common/Pagination";
import { adminAPI } from "../../api/adminAPI";

function Dashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("");  
  const [data, setData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput.trim());
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await adminAPI.getAllMetrics({
          page: currentPage - 1,
          size: itemsPerPage,
          email: searchQuery || undefined,
          role: selectedRole || undefined,    // 👈 role pass karo
        });

        const transformed = (response.content || []).map((item) => ({
          id: item.id,
          name: item.userName || "N/A",
          email: item.userEmail || "N/A",
          role: item.role || "N/A",
          filled: item.formFilled || 0,
          qcFilled: item.formChecked || 0,
          feedbackClicked: item.feedbackGiven || 0,
          score: Math.round(item.score || 0),
        }));

        setData(transformed);
        setTotalRecords(response.totalElements || transformed.length);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch user metrics.");
        setData([]);
        setTotalRecords(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, itemsPerPage, searchQuery, selectedRole]);

  // 📊 Headers for L1
  const l1Headers = useMemo(
    () => [
      { key: "name", label: "Name", minWidth: "150px" },
      { key: "role", label: "Role" },
      { key: "email", label: "Email", minWidth: "200px" },
      { key: "filled", label: "Form Filled", align: "center" },
      { key: "qcFilled", label: "QC Form Filled", align: "center" },
      { key: "feedbackClicked", label: "Feedback Clicked", align: "center" },
      { key: "score", label: "Score", align: "center" },
    ],
    []
  );

  const qcHeaders = useMemo(
    () => [
      { key: "name", label: "Name", minWidth: "150px" },
      { key: "role", label: "Role" },
      { key: "email", label: "Email", minWidth: "200px" },
      { key: "filled", label: "Form Filled", align: "center" },
      { key: "feedbackClicked", label: "Feedback Clicked", align: "center" },
      { key: "score", label: "Score", align: "center" },
    ],
    []
  );

  const tableHeaders = selectedRole === "QCTEAM" ? qcHeaders : l1Headers;

  const totalPages = Math.ceil(totalRecords / itemsPerPage);
  const startIndex = totalRecords === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalRecords);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-10xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              All Users Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              View all user metrics with search and filters
            </p>
          </div>

          <div className="flex gap-3">
            {/* 🔽 Role Dropdown */}
            <select
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value);
                setCurrentPage(1);
              }}
              className="border rounded-md px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Teams</option>
              <option value="L1TEAM">L1 TEAM</option>
              <option value="QCTEAM">QC TEAM</option>
            </select>

            {/* 🔍 Search */}
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by email..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {/* Table */}
        <Table
          headers={tableHeaders}
          data={data}
          loading={loading}
          emptyMessage="No records found"
          hoverable
        />

        {/* Pagination */}
        {!loading && data.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={totalRecords}
            itemsPerPage={itemsPerPage}
            startIndex={startIndex}
            endIndex={endIndex}
            pageSizeOptions={[50, 100, 150, 200]}
            onPageSizeChange={(size) => {
              setItemsPerPage(size);
              setCurrentPage(1);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
