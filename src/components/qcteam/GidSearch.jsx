import React, { useState, useEffect } from "react";
import { Hash, Mail, User, Clock, Calendar, UserCheck } from "lucide-react";
import Table from "../common/Table";
import SearchBar from "../common/SearchBar";
import Loading from "../common/Loding";
import { qcTeamAPI } from "../../api/qcTeamAPI";

const GidSearch = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");       
  const [appliedSearch, setAppliedSearch] = useState("");   
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!appliedSearch) {
        setData([]);
        return;
      }

      try {
        setLoading(true);
        const res = await qcTeamAPI.searchByGid(appliedSearch); // ✅ await API
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
      key: "action",
      label: "Action",
      render: () => (
        <button className="px-3 py-1 text-xs font-semibold text-white bg-purple-600 rounded-full hover:bg-purple-700">
          Give Feedback
        </button>
      ),
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
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setAppliedSearch(searchQuery);
                }
              }}
              placeholder="Enter GID..."
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
