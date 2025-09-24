import React from 'react';

function Table({ 
  headers = [], 
  data = [], 
  loading = false,
  emptyMessage = "No data available",
  emptySubMessage = "Check back later or adjust your filters",
  className = "",
  renderCell = null, 
  onRowClick = null, 
  hoverable = true,
  striped = false,
  compact = false,
  maxHeight = "max-h-150"
}) {
  
  if (loading) {
    return (
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-sm font-medium text-gray-900">{emptyMessage}</h3>
          <p className="mt-1 text-sm text-gray-500">{emptySubMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white shadow-sm rounded-lg overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <div className={`${maxHeight} overflow-y-auto`}>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              {headers.map((header, index) => {
                const IconComponent = header.icon;
                return (
                  <th 
                    key={index} 
                    className={`px-4 py-3 text-left ${header.className || ''} ${header.minWidth ? `min-w-[${header.minWidth}]` : ''}`}
                  >
                    <div className="flex items-center space-x-1">
                      {IconComponent && (
                        <IconComponent className="w-3 h-3 text-gray-400" />
                      )}
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {header.label || header.name || header}
                      </span>
                      {header.sortable && (
                        <button className="ml-1 text-gray-400 hover:text-gray-600">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M5 8l5-5 5 5H5z"/>
                          </svg>
                        </button>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className={`bg-white divide-y divide-gray-200 ${striped ? 'divide-y-0' : ''}`}>
            {data.map((row, rowIndex) => (
              <tr 
                key={row.id || row._id || rowIndex} 
                className={`
                  ${hoverable ? 'hover:bg-gray-50' : ''} 
                  ${striped && rowIndex % 2 === 1 ? 'bg-gray-50' : ''} 
                  ${onRowClick ? 'cursor-pointer' : ''}
                  transition-colors
                `}
                onClick={() => onRowClick && onRowClick(row, rowIndex)}
              >
                {headers.map((header, colIndex) => {
                  const key = header.key || header.field || header;
                  const value = typeof key === 'string' ? row[key] : '';
                  
                  return (
                    <td 
                      key={colIndex} 
                      className={`
                        px-4 ${compact ? 'py-2' : 'py-3'} 
                        ${header.cellClassName || ''} 
                        ${header.align === 'center' ? 'text-center' : header.align === 'right' ? 'text-right' : 'text-left'}
                      `}
                    >
                      {renderCell ? renderCell(value, row, header, rowIndex, colIndex) : (
                        <span className={`${header.textClassName || 'text-sm text-gray-900'}`}>
                          {header.render ? header.render(value, row) : value || '-'}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}

export default Table;