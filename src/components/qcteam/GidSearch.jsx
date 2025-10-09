import React, { useState, useEffect } from "react";
import {
  Hash,
  Mail,
  User,
  Clock,
  Calendar,
  UserCheck,
  Save,
} from "lucide-react";
import Table from "../common/Table";
import SearchBar from "../common/SearchBar";
import Loading from "../common/Loding";
import { qcTeamAPI } from "../../api/qcTeamAPI";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const GidSearch = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!appliedSearch) {
        setData([]);
        return;
      }

      try {
        setLoading(true);
        const res = await qcTeamAPI.searchByGid(appliedSearch);
        setData(res || []);
      } catch (error) {
        console.error("Error fetching GID:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [appliedSearch]);

  // Load from sessionStorage on mount
  useEffect(() => {
    const savedSearch = sessionStorage.getItem("appliedSearch");
    const savedData = sessionStorage.getItem("gidSearchData");

    if (savedSearch && savedData) {
      setAppliedSearch(savedSearch);
      setData(JSON.parse(savedData));
    }
  }, []);

  // Save to sessionStorage whenever data or appliedSearch changes
  useEffect(() => {
    if (appliedSearch) {
      sessionStorage.setItem("appliedSearch", appliedSearch);
      sessionStorage.setItem("gidSearchData", JSON.stringify(data));
    }
  }, [data, appliedSearch]);

  const handleRecord = (row) => {
    navigate(`/qcform/${row.id}`, { state: { formData: row } });
  };

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
    { key: "email", label: "Email", icon: Mail },
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
    { key: "gid", label: "GID", icon: Hash },
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
    {
      key: "record",
      label: "Record",
      icon: Save,
      render: (value, row) => {
        return (
          <button
            onClick={() => handleRecord(row)}
            disabled={row.checked} // ✅ disables the button when checked is true
            className={`px-3 py-1 text-xs font-semibold rounded-full transition
          ${
            row.checked
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-purple-600 hover:bg-purple-700 text-white"
          }`}
          >
            Record
          </button>
        );
      },
    },
  ];

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-9xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 md:flex md:items-center md:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-gray-900">Search by GID</h1>
          </div>

          <div className="flex-1 flex justify-center mx-4">
            <SearchBar
              searchQuery={searchQuery}
              onSearch={setSearchQuery}
              placeholder="Enter GID..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setAppliedSearch(searchQuery);
                }
              }}
            />
            <button
              onClick={() => setAppliedSearch(searchQuery)}
              className="ml-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Search
            </button>
          </div>
        </div>

        <Table
          headers={tableHeaders}
          data={data}
          loading={loading}
          emptyMessage="No GID records found"
          emptySubMessage={
            appliedSearch
              ? `No records match "${appliedSearch}"`
              : "Enter a GID and click search"
          }
          hoverable
          compact={false}
        />
      </div>
    </div>
  );
};

export default GidSearch;
