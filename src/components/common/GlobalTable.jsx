import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, Filter, Download, MoreVertical } from "lucide-react";
import Pagination from "./Pagination";

function GlobalTable({ 
  headers = [], 
  data = [], 
  renderRow,
  title,
  subtitle,
  searchable = false,
  searchPlaceholder = "Search...",
  onSearch,
  filterable = false,
  onFilter,
  exportable = false,
  onExport,
  pagination = false,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  onPageSizeChange,
  loading = false,
  emptyMessage = "No data available",
  emptySubMessage = "Try adjusting your search or filter criteria",
  className = "",
  headerActions,
  rowActions
}) {
  const [searchQuery, setSearchQuery] = useState("");

  // Calculate pagination values
  const startIndex = useMemo(() => {
    return data.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  }, [currentPage, itemsPerPage, data.length]);

  const endIndex = useMemo(() => {
    return Math.min(currentPage * itemsPerPage, totalItems || data.length);
  }, [currentPage, itemsPerPage, totalItems, data.length]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <div className={`bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      {/* Table Header Section */}
      {(title || subtitle || searchable || filterable || exportable || headerActions) && (
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Title and Subtitle */}
            <div className="flex-1">
              {title && (
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              )}
              {subtitle && (
                <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Search */}
              {searchable && (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              )}

              {/* Filter */}
              {filterable && (
                <button
                  onClick={onFilter}
                  className="inline-flex items-center p-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  title="Filter"
                >
                  <Filter className="h-4 w-4" />
                </button>
              )}

              {/* Export */}
              {exportable && (
                <button
                  onClick={onExport}
                  className="inline-flex items-center p-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  title="Export"
                >
                  <Download className="h-4 w-4" />
                </button>
              )}

              {/* Custom Header Actions */}
              {headerActions}
            </div>
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Table Header */}
          <thead className="bg-gray-50">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  scope="col"
                >
                  {typeof header === 'string' ? header : header.label || header}
                </th>
              ))}
              {rowActions && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={headers.length + (rowActions ? 1 : 0)} className="px-6 py-12">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : data.length > 0 ? (
              data.map((row, idx) => (
                <React.Fragment key={row.id || idx}>
                  {renderRow ? (
                    renderRow(row, idx)
                  ) : (
                    <tr className="hover:bg-gray-50 transition-colors">
                      {headers.map((header, headerIdx) => (
                        <td key={headerIdx} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {row[header] || '-'}
                        </td>
                      ))}
                      {rowActions && (
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {rowActions(row, idx)}
                        </td>
                      )}
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={headers.length + (rowActions ? 1 : 0)} className="px-6 py-12">
                  <div className="text-center">
                    <div className="mx-auto h-12 w-12 text-gray-400">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-12 w-12">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                      </svg>
                    </div>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">{emptyMessage}</h3>
                    <p className="mt-1 text-sm text-gray-500">{emptySubMessage}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && !loading && data.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          startIndex={startIndex}
          endIndex={endIndex}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </div>
  );
}

export default GlobalTable;
