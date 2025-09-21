// SheetData.jsx
import React, { useState, useEffect } from "react";
import Table from "../common/Table";
import Pagination from "../common/Pagination";
import { sampleData } from "../constants/Sample";

const SheetData = () => {
  const [data, setData] = useState([]);
  const [paginatedData, setPaginatedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Load data
  useEffect(() => {
    setData(sampleData);
  }, []);

  // Apply pagination whenever page or rows change
  useEffect(() => {
    applyPagination(data, currentPage, rowsPerPage);
  }, [data, currentPage, rowsPerPage]);

  const applyPagination = (allData, page, perPage) => {
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    setPaginatedData(allData.slice(startIndex, endIndex));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage + 1;
  const endIndex = Math.min(currentPage * rowsPerPage, data.length);

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
          <h1 className="text-2xl font-semibold text-gray-900">Data Overview</h1>
          <div className="flex items-center space-x-2">
            <select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(parseInt(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            >
              <option value={5}>5 rows</option>
              <option value={10}>10 rows</option>
              <option value={20}>20 rows</option>
              <option value={50}>50 rows</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <Table
          filteredData={paginatedData}
          formatDecision={(d) => d}
          getDecisionColor={getDecisionColor}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            totalItems={data.length}
            itemsPerPage={rowsPerPage}
            startIndex={startIndex}
            endIndex={endIndex}
          />
        )}
      </div>
    </div>
  );
};

export default SheetData;
