import React, { useState, useEffect } from "react";
import { Hash, Mail, User, Clock, Calendar, UserCheck, MoreHorizontal, Edit, Eye, Trash2, Copy, ExternalLink } from "lucide-react";
import { sampleData } from "../constants/Sample";
import Table from "../common/Table";

function GidSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedText, setCopiedText] = useState("");
  const [openActionMenu, setOpenActionMenu] = useState(null);

  useEffect(() => {
    setFilteredData(sampleData);
  }, []);

  // Filter by GID
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredData(sampleData);
    } else {
      setLoading(true);
      const timer = setTimeout(() => {
        const lower = searchTerm.toLowerCase();
        setFilteredData(
          sampleData.filter((item) => item.gid.toLowerCase().includes(lower))
        );
        setLoading(false);
      }, 300); // Simulate search delay
      
      return () => clearTimeout(timer);
    }
  }, [searchTerm]);

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
        <div className="flex items-center space-x-2">
          <span className="copyable-gid text-sm text-gray-900 font-mono">
            {value}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCopyGid(value);
            }}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Copy GID"
          >
            <Copy className="w-3 h-3" />
          </button>
          {copiedText === value && (
            <span className="text-green-600 text-xs">✓ Copied!</span>
          )}
        </div>
      )
    },
    {
      key: 'decision',
      label: 'Decision',
      icon: UserCheck,
      minWidth: '250px',
      render: (value) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDecisionColor(value)}`}
        >
          {value || '-'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      icon: MoreHorizontal,
      minWidth: '120px',
      cellClassName: 'relative',
      render: (value, row, header, rowIndex) => (
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleActionMenu(rowIndex);
            }}
            className="inline-flex items-center p-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          
          {/* Action Menu Dropdown */}
          {openActionMenu === rowIndex && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-20">
              <div className="py-1">
                <button
                  onClick={() => handleAction('view', row)}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Eye className="w-4 h-4 mr-3" />
                  View Details
                </button>
                <button
                  onClick={() => handleAction('edit', row)}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Edit className="w-4 h-4 mr-3" />
                  Edit Record
                </button>
                <button
                  onClick={() => handleAction('external', row)}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-3" />
                  Open External
                </button>
                <hr className="my-1" />
                <button
                  onClick={() => handleAction('delete', row)}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-3" />
                  Delete Record
                </button>
              </div>
            </div>
          )}
        </div>
      )
    }
  ];

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

  const handleCopyGid = async (gid) => {
    try {
      await navigator.clipboard.writeText(gid);
      setCopiedText(gid);
      setTimeout(() => setCopiedText(""), 2000);
    } catch (err) {
      console.error('Failed to copy GID:', err);
    }
  };

  const handleToggleActionMenu = (rowIndex) => {
    setOpenActionMenu(openActionMenu === rowIndex ? null : rowIndex);
  };

  const handleAction = (action, row) => {
    setOpenActionMenu(null); // Close the menu
    
    switch (action) {
      case 'view':
        console.log('View details for:', row);
        // Implement view logic here
        alert(`Viewing details for GID: ${row.gid}`);
        break;
      case 'edit':
        console.log('Edit record for:', row);
        // Implement edit logic here
        alert(`Editing record for GID: ${row.gid}`);
        break;
      case 'external':
        console.log('Open external for:', row);
        // Implement external link logic here
        window.open(`https://example.com/record/${row.gid}`, '_blank');
        break;
      case 'delete':
        console.log('Delete record for:', row);
        // Implement delete logic here
        if (window.confirm(`Are you sure you want to delete record with GID: ${row.gid}?`)) {
          alert(`Deleting record for GID: ${row.gid}`);
          // Add actual delete logic here
        }
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  // Close action menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenActionMenu(null);
    };

    if (openActionMenu !== null) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openActionMenu]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Search by GID</h1>
            <p className="mt-1 text-sm text-gray-500">
              Found {filteredData.length} record{filteredData.length !== 1 ? 's' : ''}
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Hash className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Enter GID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none text-sm w-64"
              />
            </div>
            
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Enhanced Search Stats */}
        {searchTerm && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Hash className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">{filteredData.length}</span> record{filteredData.length !== 1 ? 's' : ''} found for GID containing "{searchTerm}"
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Table using GlobalTable */}
        <Table
          headers={tableHeaders}
          data={filteredData}
          loading={loading}
          emptyMessage="No GID records found"
          emptySubMessage={searchTerm ? `No records match "${searchTerm}"` : "Try entering a GID to search"}
          hoverable={true}
          compact={false}
        />
      </div>
    </div>
  );
}

export default GidSearch;