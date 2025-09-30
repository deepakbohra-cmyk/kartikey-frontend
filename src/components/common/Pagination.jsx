import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, Filter, Download, MoreVertical } from "lucide-react";

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  totalItems, 
  itemsPerPage, 
  startIndex, 
  endIndex,
  pageSizeOptions = [50, 100, 150, 200],
  onPageSizeChange
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="bg-white border-t border-gray-200">
      <div className="px-4 py-1 flex items-center justify-between sm:px-6">
        {/* Mobile pagination */}
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700">
            {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>

        {/* Desktop pagination */}
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-700">
              Showing <span className="font-semibold text-gray-900">{startIndex}</span> to{' '}
              <span className="font-semibold text-gray-900">{endIndex}</span> of{' '}
              <span className="font-semibold text-gray-900">{totalItems}</span> results
            </p>
            
            {onPageSizeChange && (
              <div className="flex items-center gap-2">
                <label htmlFor="pageSize" className="text-sm text-gray-700">
                  Show:
                </label>
                <select
                  id="pageSize"
                  value={itemsPerPage}
                  onChange={(e) => onPageSizeChange(Number(e.target.value))}
                  className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {pageSizeOptions.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <nav className="flex items-center gap-1" aria-label="Pagination">
            {/* First page */}
            <button
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center p-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="First page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
            
            {/* Previous page */}
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center p-2 text-sm font-medium text-gray-500 bg-white border-t border-b border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            {/* Page numbers */}
            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' ? onPageChange(page) : null}
                disabled={page === '...'}
                className={`relative inline-flex items-center px-3 py-2 text-sm font-medium border-t border-b transition-colors ${
                  page === currentPage
                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                    : page === '...'
                    ? 'border-gray-300 bg-white text-gray-500 cursor-default'
                    : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            
            {/* Next page */}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center p-2 text-sm font-medium text-gray-500 bg-white border-t border-b border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            
            {/* Last page */}
            <button
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center p-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Last page"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};


export default Pagination;