// SheetData.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Mail, User, Hash, Clock, UserCheck, Calendar, Download, Filter } from "lucide-react";
import Table from "../common/Table";
import Pagination from "../common/Pagination";
import { qcTeamAPI } from "../../api/qcTeamAPI";
import FilterControls from "../common/FilterControls";
import SearchBar from "../common/SearchBar";
import Loading from "../common/Loding";

const SheetData = () => {
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [showFilters, setShowFilters] = useState(false);
  const [copiedId, setCopiedId] = useState(null);


  // Filters
  const [filters, setFilters] = useState({
    email: "",
    workType: "",
    gid: "",
    decision: "",
    fromDate: "",
    toDate: "",
  });

  const [appliedFilters, setAppliedFilters] = useState({ ...filters });

  // Table Headers
  const tableHeaders = [
    { key: "id", label: "ID", icon: Hash },
    {
      key: "date",
      label: "Date",
      icon: Calendar,
      render: (value) => <span className="text-sm text-gray-700">{value}</span>,
    },
    {
      key: "time",
      label: "Time",
      icon: Clock,
      render: (value) => <span className="text-sm text-gray-700">{value}</span>,
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
      key: "workType",
      label: "Work Type",
      icon: User,
      render: (value) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            value === "remote"
              ? "bg-blue-100 text-blue-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {value || "-"}
        </span>
      ),
    },
    {
      key: "gid",
      label: "GID",
      icon: Hash,
      render: (value,row) => (
        <span
          className="text-sm font-mono text-gray-900 cursor-pointer hover:text-blue-600"
          onClick={() => {
            navigator.clipboard.writeText(value).then(() => {
            setCopiedId(row.id);
        });
      }}
        >
          {value}
          {copiedId === row.id && (
            <span className="ml-2 text-xs text-green-600">✔ Copied</span>
            )}
        </span>
      ),
    },
    {
      key: "decision",
      label: "Decision",
      icon: UserCheck,
      render: (value) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDecisionColor(
            value
          )}`}
        >
          {value || "-"}
        </span>
      ),
    },
  ];

  const getDecisionColor = (decision) => {
    const colors = {
      Duplicate: "bg-red-100 text-red-800",
      "Not Duplicate": "bg-green-100 text-green-800",
      "Not Sure - Bad Data": "bg-yellow-100 text-yellow-800",
      "On Hold": "bg-gray-100 text-gray-800",
    };
    return colors[decision] || "bg-gray-100 text-gray-800";
  };

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await qcTeamAPI.getForms(appliedFilters);
      setData(response || []);
      setAllData(response || []);
    } catch (err) {
      setError("Failed to load data. Please try again.");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [appliedFilters]);

  // Search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setData(allData);
      setCurrentPage(1);
    } else {
      const delayDebounce = setTimeout(() => {
        const filtered = allData.filter((item) =>
          item.email?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setData(filtered);
        setCurrentPage(1);
      }, 400);
      return () => clearTimeout(delayDebounce);
    }
  }, [searchQuery]);

  // Pagination
  const startIndex = (currentPage - 1) * rowsPerPage + 1;
  const endIndex = Math.min(currentPage * rowsPerPage, data.length);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return data.slice(start, start + rowsPerPage);
  }, [data, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(data.length / rowsPerPage);

  // Export CSV
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-9xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="md:flex md:items-center md:justify-between">
            {/* Left: Title */}
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-gray-900">Data Overview</h1>
              <p className="mt-1 text-sm text-gray-500">
                Showing {paginatedData.length} of {data.length} records
              </p>
            </div>

            {/* Center: Search Bar */}
            <div className="flex-1 flex justify-center">
              <SearchBar searchQuery={searchQuery} onSearch={setSearchQuery} />
            </div>

            {/* Right: Buttons */}
            <div className="mt-4 flex md:mt-0 md:ml-4 space-x-2 relative">
              <button
                onClick={() => setShowFilters((prev) => !prev)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
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

          {/* Filter dropdown */}
          {showFilters && (
            <div className="absolute right-0 mt-2 w-200 mr-8">
              <FilterControls
                filters={filters}
                onFilterChange={(name, value) =>
                  setFilters((prev) => ({ ...prev, [name]: value }))
                }
                onApplyFilters={() => {
                  setAppliedFilters({ ...filters });
                  setShowFilters(false);
                }}
                onClearFilters={() => {
                  setFilters({
                    email: "",
                    workType: "",
                    gid: "",
                    decision: "",
                    fromDate: "",
                    toDate: "",
                  });
                  setAppliedFilters({
                    email: "",
                    workType: "",
                    gid: "",
                    decision: "",
                    fromDate: "",
                    toDate: "",
                  });
                  setShowFilters(false);
                }}
              />
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
            {error}
          </div>
        )}

        <div className="mb-6">
          <Table
            headers={tableHeaders}
            data={paginatedData}
            loading={loading}
            emptyMessage="No data available"
            emptySubMessage="Try adjusting your filters or check back later"
            hoverable={true}
            compact={false}
            maxHeight="max-h-140"
          />
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={data.length}
            itemsPerPage={rowsPerPage}
            startIndex={startIndex}
            endIndex={endIndex}
            onPageSizeChange={(size) => {
              setRowsPerPage(size);
              setCurrentPage(1);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default SheetData;
