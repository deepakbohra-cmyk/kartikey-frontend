// FilterControls.jsx
import React from "react";
import { Search, Filter, X, Calendar, Mail, User, Hash, UserCheck } from "lucide-react";

const FilterControls = ({ 
  filters, 
  onFilterChange, 
  onApplyFilters, 
  onClearFilters, 
  isLoading 
}) => {
  const workTypeOptions = [
    { value: '', label: 'All Work Types' },
    { value: 'REWORK', label: 'REWORK' },
    { value: 'NORMAL', label: 'NORMAL' }
  ];

  const decisionOptions = [
    { value: '', label: 'All Decisions' },
    { value: 'Duplicate', label: 'Duplicate' },
    { value: 'Not Duplicate', label: 'Not Duplicate' },
    { value: 'Not Sure - Bad Data', label: 'Not Sure - Bad Data' },
    { value: 'Combination of Duplicate & Not Duplicate', label: 'Combination of Duplicate & Not Duplicate' },
    { value: 'Combination of Duplicate & Not Sure', label: 'Combination of Duplicate & Not Sure' },
    { value: 'On Hold', label: 'On Hold' },
    { value: 'Combination of Not Duplicate & Not Sure', label: 'Combination of Not Duplicate & Not Sure' },
    { value: 'Not Duplicate - Variant Data Not Available', label: 'Not Duplicate - Variant Data Not Available' },
    { value: 'Not Duplicate - Different Compatibility', label: 'Not Duplicate - Different Compatibility' },
    { value: 'Not Duplicate - Different Warranty', label: 'Not Duplicate - Different Warranty' },
    { value: 'Not Duplicate - Attribute Value Not Available', label: 'Not Duplicate - Attribute Value Not Available' },
    { value: 'Unpublish', label: 'Unpublish' },
    { value: 'Combination of Duplicate, Not Duplicate & Not Sure', label: 'Combination of Duplicate, Not Duplicate & Not Sure' }
  ];

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
      <div className="flex items-center mb-4">
        <Filter className="w-5 h-5 text-gray-400 mr-2" />
        <h3 className="text-lg font-medium text-gray-900">Filters</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        {/* Email Filter */}
        <div className="space-y-1">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <Mail className="w-4 h-4 mr-1" />
            Email
          </label>
          <input
            type="text"
            value={filters.email}
            onChange={(e) => onFilterChange('email', e.target.value)}
            placeholder="Enter email..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
          />
        </div>

        {/* Work Type Filter */}
        <div className="space-y-1">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <User className="w-4 h-4 mr-1" />
            Work Type
          </label>
          <select
            value={filters.workType}
            onChange={(e) => onFilterChange('workType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
          >
            {workTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Decision Filter */}
        <div className="space-y-1">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <UserCheck className="w-4 h-4 mr-1" />
            Decision
          </label>
          <select
            value={filters.decision}
            onChange={(e) => onFilterChange('decision', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
          >
            {decisionOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* From Date Filter */}
        <div className="space-y-1">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <Calendar className="w-4 h-4 mr-1" />
            From Date
          </label>
          <input
            type="date"
            value={filters.fromDate}
            onChange={(e) => onFilterChange('fromDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
          />
        </div>

        {/* To Date Filter */}
        <div className="space-y-1">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <Calendar className="w-4 h-4 mr-1" />
            To Date
          </label>
          <input
            type="date"
            value={filters.toDate}
            onChange={(e) => onFilterChange('toDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex space-x-3">
          <button
            onClick={onApplyFilters}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Search className="w-4 h-4 mr-2" />
            {isLoading ? 'Applying...' : 'Apply Filters'}
          </button>
          
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="w-4 h-4 mr-2" />
              Clear Filters
            </button>
          )}
        </div>
        
        {hasActiveFilters && (
          <div className="text-sm text-gray-500">
            {Object.values(filters).filter(value => value !== '').length} filter(s) active
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterControls;