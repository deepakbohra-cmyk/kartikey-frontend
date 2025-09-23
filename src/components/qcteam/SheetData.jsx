// SheetData.jsx
import React, { useState, useEffect } from "react";
import { Mail, User, Hash, Clock, UserCheck, Calendar } from "lucide-react";
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
  const [showFilters, setShowFilters] = useState(false);
  const [copiedText, setCopiedText] = useState(""); 
  
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

  // Define table headers for GlobalTable
  const tableHeaders = [
    {
      key: 'id',
      label: 'ID',
      icon: Hash,
      className: '',
      textClassName: 'text-sm font-medium text-gray-900'
    },
    {
      key: 'date',
      label: 'Date',
      icon: Calendar,
      minWidth: '120px',
      textClassName: 'text-xs text-gray-500'
    },
    {
      key: 'time',
      label: 'Time',
      icon: Clock,
      minWidth: '100px',
      textClassName: 'text-xs text-gray-500'
    },
    {
      key: 'email',
      label: 'Email',
      icon: Mail,
      minWidth: '200px',
      textClassName: 'text-sm text-gray-900'
    },
    {
      key: 'workType',
      label: 'Work Type',
      icon: User,
      minWidth: '150px',
      render: (value) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            value === "remote"
              ? "bg-blue-100 text-blue-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {value ? value.charAt(0).toUpperCase() + value.slice(1) : '-'}
        </span>
      )
    },
    {
      key: 'gid',
      label: 'GID',
      icon: Hash,
      render: (value, row) => (
        <span className="copyable-gid text-sm text-gray-900 font-mono">
          {value}
          {copiedText === value && (
            <span className="ml-2 text-green-600 text-xs">✓ Copied!</span>
          )}
        </span>
      )
    },
    {
      key: 'decision',
      label: 'Decision',
      icon: UserCheck,
      minWidth: '300px',
      render: (value) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDecisionColor(value)}`}
        >
          {value || '-'}
        </span>
      )
    }
  ];

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
    setShowFilters(false);
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

  //copy function
  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      if (!selection) return;

      const selectedText = selection.toString();

      // Check if the selection is inside a gid cell
      const parent = selection.anchorNode?.parentElement;
      if (parent?.classList.contains("copyable-gid") && selectedText) {
        navigator.clipboard.writeText(selectedText).then(() => {
          setCopiedText(selectedText); // show ✓ Copied!
        });
      }
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Data Overview</h1>
          <div className="flex items-center space-x-4">
            {/* Rows per page selector */}
            <div className="space-x-2 relative">
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
            
            {/* Filter Controls */}
            <div className="space-x-2 relative">
              <button
                onClick={() => setShowFilters((prev) => !prev)}
                className="px-4 py-1 bg-purple-500 text-white rounded-md text-sm hover:bg-purple-600 transition-colors"
              >
                Filters
              </button>
              {/* Filter Panel (dropdown style) */}
              {showFilters && (
                <div className="absolute top-full right-0 mt-2 z-20 w-80 bg-white border border-gray-300 shadow-lg rounded-lg p-4">
                  <FilterControls
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onApplyFilters={handleApplyFilters}
                    onClearFilters={handleClearFilters}
                    isLoading={isLoading}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table using GlobalTable */}
        <Table
          headers={tableHeaders}
          data={paginatedData}
          loading={isLoading}
          emptyMessage="No data available"
          emptySubMessage="Try adjusting your filters or check back later"
          hoverable={true}
          compact={false}
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