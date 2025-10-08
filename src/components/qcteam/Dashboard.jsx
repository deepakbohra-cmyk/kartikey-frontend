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
  const [data, setData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput.trim());
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // ✅ Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await adminAPI.getAllMetrics({
          page: currentPage - 1,
          size: itemsPerPage,
          email: searchQuery || undefined,
        });
        const transformed = (response.content || []).map((item) => ({
          id: item.id,
          name: item.userName || "N/A", // top-level
          email: item.userEmail || "N/A", // top-level
          role: item.role || "N/A", // top-level
          team: item.user?.team || "N/A", // if team exists in user object, else N/A
          filled: item.formFilled || 0,
          qcFilled: item.formChecked || 0,
          feedbackClicked: item.feedbackGiven || 0,
          feedbackReceived: 0,
          error: 0,
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
  }, [currentPage, itemsPerPage, searchQuery]);

  // ✅ Table headers
  const tableHeaders = useMemo(
    () => [
      { key: "name", label: "Name", minWidth: "150px" },
      { key: "role", label: "Role" },
      { key: "email", label: "Email", minWidth: "200px" },
      { key: "filled", label: "Form Filled", align: "center" },
      { key: "qcFilled", label: "QC Form Filled", align: "center" },
      { key: "feedbackClicked", label: "Feedback Clicked", align: "center" },
      { key: "feedbackReceived", label: "Feedback Received", align: "center" },
      { key: "error", label: "Error", align: "center" },
      { key: "score", label: "Score", align: "center" },
    ],
    []
  );

  const totalPages = Math.ceil(totalRecords / itemsPerPage);
  const startIndex =
    totalRecords === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalRecords);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              All Users Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              View all user metrics with search and pagination
            </p>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
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
          maxHeight="max-h-[calc(100vh-400px)]"
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
