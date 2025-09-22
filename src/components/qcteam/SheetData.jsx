// SheetData.jsx
import React, { useState, useEffect } from "react";
import Table from "../common/Table";
import Pagination from "../common/Pagination";
import FilterControls from "../common/FilterControls";
import { qcTeamAPI } from "../../api/qcTeamAPI";

const SheetData = () => {
  const [data, setData] = useState([]);
  const [paginatedData, setPaginatedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    email: '',
    workType: '',
    gid: '',
    decision: '',
    fromDate: '',
    toDate: ''
  });
  
  const [appliedFilters, setAppliedFilters] = useState({
    email: '',
    workType: '',
    gid: '',
    decision: '',
    fromDate: '',
    toDate: ''
  });

  // Fetch data from API
  const fetchData = async (page = 0, size = 10, filterParams = {}) => {
    setIsLoading(true);
    try {
      const params = {
        page,
        size,
        ...filterParams
      };
      
      // Remove empty values
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await qcTeamAPI.getForms(params);
      setData(response);
      setPaginatedData(response);
      setTotalItems(response.length); // You might want to get total count from backend
    } catch (error) {
      console.error('Error fetching data:', error);
      setData([]);
      setPaginatedData([]);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchData(currentPage - 1, rowsPerPage, appliedFilters);
  }, [currentPage, rowsPerPage, appliedFilters]);

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Apply filters
  const handleApplyFilters = () => {
    setAppliedFilters({ ...filters });
    setCurrentPage(1); // Reset to first page when applying filters
  };

  // Clear filters
  const handleClearFilters = () => {
    const clearedFilters = {
      email: '',
      workType: '',
      gid: '',
      decision: '',
      fromDate: '',
      toDate: ''
    };
    setFilters(clearedFilters);
    setAppliedFilters(clearedFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage + 1;
  const endIndex = Math.min(currentPage * rowsPerPage, totalItems);

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

        {/* Filter Controls */}
        <FilterControls
          filters={filters}
          onFilterChange={handleFilterChange}
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
          isLoading={isLoading}
        />

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            <span className="ml-2 text-gray-600">Loading...</span>
          </div>
        )}

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
            totalItems={totalItems}
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