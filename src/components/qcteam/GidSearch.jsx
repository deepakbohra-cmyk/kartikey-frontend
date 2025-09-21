import React, { useState, useEffect } from "react";
import { Hash, Mail, User, Clock, Calendar, UserCheck } from "lucide-react";
import { sampleData } from "../constants/Sample";

function GidSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    setFilteredData(sampleData);
  }, []);

  // Filter by GID
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredData(sampleData);
    } else {
      const lower = searchTerm.toLowerCase();
      setFilteredData(
        sampleData.filter((item) => item.gid.toLowerCase().includes(lower))
      );
    }
  }, [searchTerm]);

  const getDecisionColor = (decision) => {
    const colors = {
      'Duplicate': "bg-red-100 text-red-800",
      'Not Duplicate': "bg-green-100 text-green-800",
      'Not Sure - Bad Data': "bg-yellow-100 text-yellow-800",
      'Combination of Duplicate & Not Duplicate': "bg-purple-100 text-purple-800",
      'Combination of Duplicate & Not Sure': "bg-orange-100 text-orange-800",
      'On Hold': "bg-gray-100 text-gray-800",
      'Combination of Not Duplicate & Not Sure': "bg-blue-100 text-blue-800",
      'Not Duplicate - Variant Data Not Available': "bg-teal-100 text-teal-800",
      'Not Duplicate - Different Compatibility': "bg-indigo-100 text-indigo-800",
      'Not Duplicate - Different Warranty': "bg-pink-100 text-pink-800",
      'Not Duplicate - Attribute Value Not Available': "bg-cyan-100 text-cyan-800",
      'Unpublish': "bg-red-200 text-red-900",
      'Combination of Duplicate, Not Duplicate & Not Sure': "bg-gradient-to-r from-red-100 to-green-100 text-gray-800"
    };
    return colors[decision] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Search by GID</h1>
          <input
            type="text"
            placeholder="Enter GID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none text-sm"
          />
        </div>

        {/* Table */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <div className="flex items-center space-x-1">
                      <Hash className="w-3 h-3 text-gray-400" />
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </span>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left min-w-[120px]">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </span>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left min-w-[100px]">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time
                      </span>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left min-w-[200px]">
                    <div className="flex items-center space-x-1">
                      <Mail className="w-3 h-3 text-gray-400" />
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </span>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left min-w-[150px]">
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3 text-gray-400" />
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Work Type
                      </span>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <div className="flex items-center space-x-1">
                      <Hash className="w-3 h-3 text-gray-400" />
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        GID
                      </span>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left min-w-[300px]">
                    <div className="flex items-center space-x-1">
                      <UserCheck className="w-3 h-3 text-gray-400" />
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Decision
                      </span>
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                      {row.id}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">
                      {row.date}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">
                      {row.time}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                      {row.email}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          row.workType === "remote"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {row.workType.charAt(0).toUpperCase() + row.workType.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 font-mono">
                      {row.gid}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDecisionColor(
                          row.decision
                        )}`}
                      >
                        {row.decision}
                      </span>
                    </td>
                  </tr>
                ))}

                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-gray-500 text-sm">
                      No results found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GidSearch;
