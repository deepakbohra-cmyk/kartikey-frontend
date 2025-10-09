// SheetData.jsx
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
  X,
} from "lucide-react";
import Table from "../common/Table";
import Pagination from "../common/Pagination";
import { qcTeamAPI } from "../../api/qcTeamAPI";
import FilterControls from "../common/FilterControls";
import Loading from "../common/Loding";
import SearchBar from "../common/SearchBar";

const SheetData = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [totalItems, setTotalItems] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [appliedSearch, setAppliedSearch] = useState("");

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
      render: (value) => {
        if (!value) return <span className="text-sm text-gray-500">-</span>;
        const [hours, minutes] = value.split(":");
        return (
          <span className="text-sm text-gray-700">{`${hours}:${minutes}`}</span>
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
      render: (value, row) => (
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

  const fetchData = async () => {
    setLoading(true);
    try {
      let response;

      // ✅ If user typed a GID, search only that GID
      if (searchQuery.trim()) {
        response = await qcTeamAPI.searchByGid(searchQuery.trim());
        const dataArray = Array.isArray(response)
          ? response
          : response?.data
          ? [response.data]
          : [];
        setData(dataArray);
        setTotalItems(dataArray.length);
        setError(dataArray.length ? "" : "No record found for this GID");
        return;
      }

      // ✅ Otherwise, fetch the full dataset (paginated)
      const params = {
        page: currentPage - 1,
        size: rowsPerPage,
        ...appliedFilters,
      };

      Object.keys(params).forEach((key) => {
        if (!params[key] && params[key] !== 0) delete params[key];
      });

      response = await qcTeamAPI.getForms(params);

      if (response && typeof response === "object") {
        const dataArray =
          response.content ||
          response.data ||
          response.items ||
          (Array.isArray(response) ? response : []);
        setData(dataArray);
        setTotalItems(
          response.totalElements ||
            response.totalCount ||
            response.total ||
            dataArray.length
        );
      } else {
        setData([]);
        setTotalItems(0);
      }

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
  }, [currentPage, rowsPerPage, appliedFilters, searchQuery]);

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const handleApplyFilters = () => {
    setAppliedFilters({ ...filters });
    setCurrentPage(1); // Reset to first page when applying filters
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    const cleared = {
      email: "",
      workType: "",
      gid: "",
      decision: "",
      fromDate: "",
      toDate: "",
    };
    setFilters(cleared);
    setAppliedFilters(cleared);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

  // Calculate pagination values
  const startIndex = totalItems === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const endIndex = Math.min(currentPage * rowsPerPage, totalItems);
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  console.log("Pagination values:", {
    totalItems,
    totalPages,
    currentPage,
    rowsPerPage,
  }); // Debug log

  return (
    <div className="min-w-screen bg-gray-50 ">
      <div className="max-w-10xl mx-auto py-2 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 md:flex md:items-center md:justify-between mt-2">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-gray-900">Data Overview</h1>
          </div>

          <div className="flex-1 flex justify-center mx-4">
            <SearchBar
              searchQuery={searchQuery}
              onSearch={setSearchQuery}
              placeholder="Enter GID..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  fetchData();
                }
              }}
            />
            <button
              onClick={() => {
                setAppliedSearch(searchQuery);
                fetchData();
              }}
              className="ml-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Search
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-2 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
            {error}
          </div>
        )}

        <div className="mb-2 mt-5">
          <Table
            headers={tableHeaders}
            data={data}
            loading={loading}
            emptyMessage="No data available"
            emptySubMessage="Try adjusting your filters or check back later"
            hoverable
            compact={false}
          />
        </div>

        {totalItems > 0 && (
          <div className="mt-2">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.max(
                totalPages,
                currentPage + (data.length === rowsPerPage ? 1 : 0)
              )}
              onPageChange={handlePageChange}
              totalItems={totalItems}
              itemsPerPage={rowsPerPage}
              startIndex={startIndex}
              endIndex={endIndex}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};
export default SheetData;
