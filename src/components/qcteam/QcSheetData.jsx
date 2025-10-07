import React, { useState, useEffect } from "react";
import {
  Mail,
  User,
  Hash,
  Clock,
  UserCheck,
  Calendar,
  Download,
  Filter,
} from "lucide-react";
import Table from "../common/Table";
import Pagination from "../common/Pagination";
import FilterControls from "../common/FilterControls";
import Loading from "../common/Loding";
import { useAuth } from "../../contexts/AuthContext";
import { qcTeamAPI } from "../../api/qcTeamAPI";
import { adminAPI } from "../../api/adminAPI";

const QcSheetData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [totalItems, setTotalItems] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const { user } = useAuth();

  const [filters, setFilters] = useState({
    email: "",
    workType: "",
    gid: "",
    decision: "",
    fromDate: "",
    toDate: "",
  });

  const [appliedFilters, setAppliedFilters] = useState({ ...filters });

  const getDecisionColor = (decision) => {
    const colors = {
      Duplicate: "bg-red-100 text-red-800",
      "Not Duplicate": "bg-green-100 text-green-800",
      "Not Sure - Bad Data": "bg-yellow-100 text-yellow-800",
      "On Hold": "bg-gray-100 text-gray-800",
    };
    return colors[decision] || "bg-gray-100 text-gray-800";
  };

  const tableHeaders = [
    { key: "id", label: "ID", icon: Hash },
    { key: "date", label: "Date", icon: Calendar },
    { key: "time", label: "Time", icon: Clock },
    { key: "email", label: "Email", icon: Mail, minWidth: "200px" },
    { key: "workType", label: "Work Type", icon: User },
    { key: "gid", label: "GID", icon: Hash },
    { key: "decision", label: "Decision", icon: UserCheck },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      let response;
      const params = {
        page: currentPage - 1,
        size: rowsPerPage,
        ...appliedFilters,
      };

      Object.keys(params).forEach((key) => {
        if (!params[key] && params[key] !== 0) delete params[key];
      });

      // Call proper API based on role
      if (user.role === "ADMIN") {
        response = await adminAPI.getQcForms(params);
      } else {
        response = await qcTeamAPI.getQcForms(user.email);
      }

      // Normalize response
      let items = [];
      let total = 0;

      if (Array.isArray(response)) {
        items = response.sort(
          (a, b) => new Date(b.date + " " + b.time) - new Date(a.date + " " + a.time)
        );
        total = items.length;
      } else if (response.content && Array.isArray(response.content)) {
        items = response.content.sort(
          (a, b) => new Date(b.date + " " + b.time) - new Date(a.date + " " + a.time)
        );
        total = response.totalElements || items.length;
      }

      setData(items);
      setTotalItems(total);
      setError("");
    } catch (err) {
      console.error("API Error:", err);
      setError("Failed to load data. Please try again.");
      setData([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, rowsPerPage, appliedFilters]);

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  const handleApplyFilters = () => {
    setAppliedFilters({ ...filters });
    setCurrentPage(1);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    const cleared = { email: "", workType: "", gid: "", decision: "", fromDate: "", toDate: "" };
    setFilters(cleared);
    setAppliedFilters(cleared);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => setCurrentPage(page);
  const handlePageSizeChange = (size) => {
    setRowsPerPage(size);
    setCurrentPage(1);
  };

  const handleExport = () => {
    const csvContent = [
      ["ID", "Date", "Time", "Email", "WorkType", "GID", "Decision"].join(","),
      ...data.map(
        (row) =>
          `"${row.id}","${row.date}","${row.time}","${row.email}","${row.workType}","${row.gid}","${row.decision}"`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sheet-data-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading && data.length === 0) return <Loading />;

  const startIndex = totalItems === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const endIndex = Math.min(currentPage * rowsPerPage, totalItems);
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-9xl mx-auto py-2 px-4 sm:px-6 lg:px-8">
        <div className="mb-2">
          <div className="md:flex md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Data Overview</h1>
              <p className="mt-1 text-sm text-gray-500">
                {totalItems > 0
                  ? `Showing ${startIndex}–${endIndex} of ${totalItems} records`
                  : "No records found"}
              </p>
            </div>

            {user.role === "ADMIN" && (
              <div className="mt-4 flex md:mt-0 md:ml-4 space-x-2 relative">
                <button
                  onClick={() => setShowFilters((prev) => !prev)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </button>
              </div>
            )}
          </div>

          {showFilters && (
            <div className="absolute right-0 mt-2 w-200 mr-8 z-15">
              <FilterControls
                filters={filters}
                onFilterChange={handleFilterChange}
                onApplyFilters={handleApplyFilters}
                onClearFilters={handleClearFilters}
                isLoading={loading}
              />
            </div>
          )}
        </div>

        {error && (
          <div className="mb-2 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
            {error}
          </div>
        )}

        <Table headers={tableHeaders} data={data} loading={loading} />

        {data.length > 0 && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={totalItems}
            itemsPerPage={rowsPerPage}
            startIndex={startIndex}
            endIndex={endIndex}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
      </div>
    </div>
  );
};

export default QcSheetData;
