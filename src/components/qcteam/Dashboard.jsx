import React, { useState, useEffect, useMemo } from "react";
import { Search, Shield, Mail, Activity, BarChart, Users, FileCheck, ThumbsUp } from "lucide-react";
import Table from "../common/Table";
import Pagination from "../common/Pagination";
import Loading from "../common/Loding";
import { adminAPI } from "../../api/adminAPI";

function Dashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("L1TEAM");
  const [data, setData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔍 Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput.trim());
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // 📦 Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await adminAPI.getAllMetrics({
          page: currentPage - 1,
          size: itemsPerPage,
          email: searchQuery || undefined,
          role: selectedRole || undefined,
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

  // 📊 Headers - Enhanced with Icons
  const l1Headers = useMemo(
    () => [
      {
        key: "name",
        label: "Name",
        icon: Users,
        render: (value) => (
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-medium">
              {value?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <span className="ml-3 text-sm font-semibold text-gray-900">{value}</span>
          </div>
        ),
      },
      {
        key: "role",
        label: "Role",
        icon: Shield,
        render: (value) => {
          const roleColors = {
            L1TEAM: "bg-purple-100 text-purple-800",
            QCTEAM: "bg-green-100 text-green-800",
            TL: "bg-blue-100 text-blue-800",
            ADMIN: "bg-red-100 text-red-800",
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
        render: (value) => (
          <div className="flex items-center text-sm text-gray-600">
            <Mail className="w-4 h-4 mr-2 text-gray-400" />
            {value}
          </div>
        ),
      },
      {
        key: "filled",
        label: "Form Filled",
        icon: FileCheck,
        align: "center",
      },
      {
        key: "qcFilled",
        label: "Form Checked",
        icon: FileCheck,
        align: "center",
      },
      {
        key: "feedbackClicked",
        label: "Feedback Given",
        icon: ThumbsUp,
        align: "center",
      },
      {
        key: "score",
        label: "Score",
        icon: BarChart,
        align: "center",
      },
    ],
    []
  );

  const qcHeaders = useMemo(
    () => [
      {
        key: "name",
        label: "Name",
        icon: Users,
        render: (value) => (
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-white font-medium">
              {value?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <span className="ml-3 text-sm font-semibold text-gray-900">{value}</span>
          </div>
        ),
      },
      {
        key: "role",
        label: "Role",
        icon: Shield,
        render: (value) => (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Shield className="w-3 h-3 mr-1" />
            {value}
          </span>
        ),
      },
      {
        key: "email",
        label: "Email",
        icon: Mail,
        render: (value) => (
          <div className="flex items-center text-sm text-gray-600">
            <Mail className="w-4 h-4 mr-2 text-gray-400" />
            {value}
          </div>
        ),
      },
      {
        key: "qcFilled",
        label: "QC Form Filled",
        icon: Activity,
        align: "center",
      },
      {
        key: "feedbackClicked",
        label: "Feedback",
        icon: ThumbsUp,
        align: "center",
      },
    ],
    []
  );

  const tableHeaders = selectedRole === "QCTEAM" ? qcHeaders : l1Headers;

  const totalPages = Math.ceil(totalRecords / itemsPerPage);
  const startIndex = totalRecords === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalRecords);

  if (loading && data.length === 0) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-9xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex md:items-center md:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              {selectedRole === "QCTEAM" ? "QC Team Dashboard" : "L1 Team Dashboard"}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Showing {data.length} of {totalRecords} records
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <select
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-purple-500"
            >
              <option value="L1TEAM">L1 Team</option>
              <option value="QCTEAM">QC Team</option>
            </select>

            <div className="relative w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by email..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
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
        <div className="mb-6">
          <Table
            headers={tableHeaders}
            data={data}
            loading={loading}
            emptyMessage="No records found"
            emptySubMessage="Try adjusting your search criteria or check back later"
            hoverable
            compact={false}
          />
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={totalRecords}
            itemsPerPage={itemsPerPage}
            startIndex={startIndex}
            endIndex={endIndex}
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
