import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import Table from "../common/Table";

function Dashboard() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleView, setRoleView] = useState("All"); // ✅ Default: All
  const [loading, setLoading] = useState(false);

  // ✅ Unified data
  const baseData = [
    {
      id: 1,
      name: "Deepak Sharma",
      role: "L1",
      email: "deepak@example.com",
      team: "Frontend",
      filled: 120,
      qcFilled: 95,
      feedbackClicked: 12,
      feedbackReceived: 20,
      error: 3,
      score: 88,
    },
    {
      id: 2,
      name: "Aarav Mehta",
      role: "QC",
      email: "aarav@example.com",
      team: "Backend",
      filled: 90,
      qcFilled: 0,
      feedbackClicked: 8,
      feedbackReceived: 18,
      error: 5,
      score: 80,
    },
    {
      id: 3,
      name: "Neha Verma",
      role: "TL",
      email: "neha@example.com",
      team: "QA",
      filled: 130,
      qcFilled: 0,
      feedbackClicked: 15,
      feedbackReceived: 25,
      error: 2,
      score: 92,
    },
    {
      id: 4,
      name: "Rohit Kumar",
      role: "L1",
      email: "rohit@example.com",
      team: "DevOps",
      filled: 85,
      qcFilled: 70,
      feedbackClicked: 6,
      feedbackReceived: 10,
      error: 4,
      score: 75,
    },
    {
      id: 5,
      name: "Priya Singh",
      role: "QC",
      email: "priya@example.com",
      team: "Design",
      filled: 100,
      qcFilled: 0,
      feedbackClicked: 11,
      feedbackReceived: 19,
      error: 1,
      score: 90,
    },
  ];

  // ✅ Dynamic table headers per role
  const tableHeaders = useMemo(() => {
    if (roleView === "L1") {
      return [
        { key: "name", label: "Name" },
        { key: "role", label: "Role" },
        { key: "email", label: "Email" },
        { key: "filled", label: "Form Filled" },
        { key: "qcFilled", label: "QC Form Filled" },
        { key: "feedbackClicked", label: "Feedback Clicked" },
        { key: "score", label: "Score" },
      ];
    }
    if (roleView === "QC") {
      return [
        { key: "name", label: "Name" },
        { key: "role", label: "Role" },
        { key: "email", label: "Email" },
        { key: "filled", label: "Form Filled" },
        { key: "feedbackClicked", label: "Feedback Clicked" },
      ];
    }
    if (roleView === "TL") {
      return [
        { key: "name", label: "Name" },
        { key: "role", label: "Role" },
        { key: "email", label: "Email" },
        { key: "team", label: "Team" },
        { key: "filled", label: "Team Form Filled" },
        { key: "feedbackReceived", label: "Feedback Received" },
        { key: "error", label: "Error" },
      ];
    }
    // ✅ “All” view — team column removed
    return [
      { key: "name", label: "Name" },
      { key: "role", label: "Role" },
      { key: "email", label: "Email" },
      { key: "filled", label: "Form Filled" },
      { key: "qcFilled", label: "QC Form Filled" },
      { key: "feedbackClicked", label: "Feedback Clicked" },
      { key: "feedbackReceived", label: "Feedback Received" },
      { key: "error", label: "Error" },
      { key: "score", label: "Score" },
    ];
  }, [roleView]);

  // ✅ Filter + Search + Pagination
  const filteredData = useMemo(() => {
    let filtered =
      roleView === "All"
        ? baseData
        : baseData.filter((item) => item.role === roleView);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.email.toLowerCase().includes(query)
      );
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    return filtered.slice(startIndex, startIndex + itemsPerPage);
  }, [baseData, roleView, searchQuery, currentPage, itemsPerPage]);

  // ✅ Pagination count
  const totalFiltered =
    roleView === "All"
      ? baseData
      : baseData.filter((item) => item.role === roleView);
  const totalPages = Math.ceil(totalFiltered.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-10xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Team Performance Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                View performance by role (L1, QC, TL or All)
              </p>
            </div>

            {/* Search + Dropdown */}
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              {/* Search */}
              <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              {/* Role Dropdown */}
              <select
                value={roleView}
                onChange={(e) => {
                  setRoleView(e.target.value);
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="All">All</option>
                <option value="L1">L1</option>
                <option value="QC">QC</option>
                <option value="TL">TL</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <Table
          headers={tableHeaders}
          data={filteredData}
          loading={loading}
          emptyMessage={`No ${roleView === "All" ? "" : roleView} records found`}
          hoverable
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-lg shadow-sm">
            <div className="flex-1 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Show</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
                  className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
                <span className="text-sm text-gray-700">per page</span>
              </div>

              <div className="text-sm text-gray-700">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, totalFiltered.length)} of{" "}
                {totalFiltered.length}
              </div>

              <div className="flex space-x-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-l-md text-sm bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-r-md text-sm bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

// import React, { useState, useMemo } from "react";
  // import { 
  //   Search, 
  //   Filter, 
  //   Download, 
  //   TrendingUp, 
  //   TrendingDown, 
  //   Users, 
  //   AlertCircle, 
  //   CheckCircle,
  //   User,
  //   Mail,
  //   BarChart3,
  //   XCircle,
  //   Activity,
  //   Calendar,
  //   MoreHorizontal,
  //   Eye,
  //   Edit,
  //   UserX
  // } from "lucide-react";
  // import Table from "../common/Table";

  // function Dashboard() {
  //   const [currentPage, setCurrentPage] = useState(1);
  //   const [itemsPerPage, setItemsPerPage] = useState(10);
  //   const [searchQuery, setSearchQuery] = useState("");
  //   const [statusFilter, setStatusFilter] = useState("");
  //   const [teamFilter, setTeamFilter] = useState("");
  //   const [showFilters, setShowFilters] = useState(false);
  //   const [openActionMenu, setOpenActionMenu] = useState(null);
  //   const [loading, setLoading] = useState(false);

  //   const dashboardData = [
  //     {
  //       id: 1,
  //       name: "Deepak Sharma",
  //       team: "Frontend",
  //       email: "deepak@example.com",
  //       filled: 120,
  //       error: 3,
  //       lastLogin: "2024-01-15",
  //     },
  //     {
  //       id: 2,
  //       name: "Aarav Mehta",
  //       team: "Backend",
  //       email: "aarav@example.com",
  //       filled: 98,
  //       error: 5,
  //       lastLogin: "2024-01-14",
  //     },
  //     {
  //       id: 3,
  //       name: "Neha Verma",
  //       team: "QA",
  //       email: "neha@example.com",
  //       filled: 130,
  //       error: 1,
  //       lastLogin: "2024-01-15",
  //     },
  //     {
  //       id: 4,
  //       name: "Rohit Kumar",
  //       team: "DevOps",
  //       email: "rohit@example.com",
  //       filled: 85,
  //       error: 2,
  //       lastLogin: "2024-01-13",
  //     },
  //     {
  //       id: 5,
  //       name: "Priya Singh",
  //       team: "Design",
  //       email: "priya@example.com",
  //       filled: 145,
  //       error: 0,
  //       lastLogin: "2024-01-15",
  //     },
  //     {
  //       id: 6,
  //       name: "Amit Patel",
  //       team: "Backend",
  //       email: "amit@example.com",
  //       filled: 92,
  //       error: 4,
  //       lastLogin: "2024-01-10",
  //     },
  //     {
  //       id: 7,
  //       name: "Kavya Reddy",
  //       team: "Frontend",
  //       email: "kavya@example.com",
  //       filled: 110,
  //       error: 2,
  //       lastLogin: "2024-01-15",
  //     },
  //     {
  //       id: 8,
  //       name: "Suresh Nair",
  //       team: "QA",
  //       email: "suresh@example.com",
  //       filled: 78,
  //       error: 6,
  //       lastLogin: "2024-01-14",
  //     },
  //   ];

  //   // Define table headers for GlobalTable
  //   const tableHeaders = [
  //     {
  //       key: 'name',
  //       label: 'Name',
  //       icon: User,
  //       minWidth: '200px',
  //       render: (value, row) => (
  //         <div className="flex items-center">
  //           <div className="flex-shrink-0 h-10 w-10">
  //             <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
  //               <span className="text-sm font-medium text-white">
  //                 {value.charAt(0).toUpperCase()}
  //               </span>
  //             </div>
  //           </div>
  //           <div className="ml-4">
  //             <div className="text-sm font-medium text-gray-900">{value}</div>
  //             <div className="text-xs text-gray-500">
  //               Last login: {new Date(row.lastLogin).toLocaleDateString()}
  //             </div>
  //           </div>
  //         </div>
  //       )
  //     },
  //     {
  //       key: 'team',
  //       label: 'Team',
  //       icon: Users,
  //       render: (value) => {
  //         const teamColors = {
  //           Frontend: 'bg-blue-100 text-blue-800',
  //           Backend: 'bg-purple-100 text-purple-800',
  //           QA: 'bg-green-100 text-green-800',
  //           DevOps: 'bg-orange-100 text-orange-800',
  //           Design: 'bg-pink-100 text-pink-800'
  //         };
          
  //         return (
  //           <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${teamColors[value] || 'bg-gray-100 text-gray-800'}`}>
  //             {value}
  //           </span>
  //         );
  //       }
  //     },
  //     {
  //       key: 'email',
  //       label: 'Email',
  //       icon: Mail,
  //       minWidth: '200px',
  //       render: (value) => (
  //         <div className="flex items-center">
  //           <Mail className="w-4 h-4 mr-2 text-gray-400" />
  //           <span className="text-sm text-gray-600">{value}</span>
  //         </div>
  //       )
  //     },
  //     {
  //       key: 'filled',
  //       label: 'Forms Filled',
  //       icon: BarChart3,
  //       align: 'center',
  //       render: (value, row) => (
  //         <div className="flex items-center justify-center">
  //           <div className="text-sm font-semibold text-green-600">{value}</div>
  //           <TrendingUp className="ml-1 h-3 w-3 text-green-400" />
  //         </div>
  //       )
  //     },
  //     {
  //       key: 'formOpened',
  //       label: 'Form Opened',
  //       icon: BarChart3,
  //       align: 'center',
  //       render: (value, row) => (
  //         <div className="flex items-center justify-center">
  //           <div className="text-sm font-semibold text-green-600">{value}</div>
  //           <TrendingUp className="ml-1 h-3 w-3 text-green-400" />
  //         </div>
  //       )
  //     },
  //     {
  //       key: 'error',
  //       label: 'Errors',
  //       icon: AlertCircle,
  //       align: 'center',
  //       render: (value) => (
  //         <div className="flex items-center justify-center">
  //           <div className={`text-sm font-semibold ${value > 3 ? 'text-red-600' : value > 0 ? 'text-yellow-600' : 'text-green-600'}`}>
  //             {value}
  //           </div>
  //           {value > 3 ? (
  //             <AlertCircle className="ml-1 h-3 w-3 text-red-400" />
  //           ) : value === 0 ? (
  //             <CheckCircle className="ml-1 h-3 w-3 text-green-400" />
  //           ) : null}
  //         </div>
  //       )
  //     },

  //   ];

  //   // Filter data based on search query and filters
  //   const filteredData = useMemo(() => {
  //     let filtered = dashboardData;

  //     // Search filter
  //     if (searchQuery.trim()) {
  //       const searchLower = searchQuery.toLowerCase();
  //       filtered = filtered.filter(item =>
  //         item.name.toLowerCase().includes(searchLower) ||
  //         item.team.toLowerCase().includes(searchLower) ||
  //         item.email.toLowerCase().includes(searchLower)
  //       );
  //     }

  //     // Status filter
  //     if (statusFilter) {
  //       filtered = filtered.filter(item => item.status === statusFilter);
  //     }

  //     // Team filter
  //     if (teamFilter) {
  //       filtered = filtered.filter(item => item.team === teamFilter);
  //     }

  //     return filtered;
  //   }, [searchQuery, statusFilter, teamFilter]);

  //   // Paginate data
  //   const paginatedData = useMemo(() => {
  //     const startIndex = (currentPage - 1) * itemsPerPage;
  //     return filteredData.slice(startIndex, startIndex + itemsPerPage);
  //   }, [filteredData, currentPage, itemsPerPage]);

  //   const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  //   // Calculate dashboard stats
  //   const stats = useMemo(() => {
  //     const totalFilled = dashboardData.reduce((sum, item) => sum + item.filled, 0);
  //     const totalErrors = dashboardData.reduce((sum, item) => sum + item.error, 0);
  //     const activeUsers = dashboardData.filter(item => item.status === 'active').length;
  //     const avgFilled = Math.round(totalFilled / dashboardData.length);

  //     return {
  //       totalUsers: dashboardData.length,
  //       activeUsers,
  //       totalFilled,
  //       totalErrors,
  //       avgFilled,
  //       errorRate: ((totalErrors / totalFilled) * 100).toFixed(1)
  //     };
  //   }, []);

  //   const handleSearch = (query) => {
  //     setSearchQuery(query);
  //     setCurrentPage(1);
  //   };

  //   const handlePageChange = (page) => {
  //     setCurrentPage(page);
  //   };

  //   const handlePageSizeChange = (size) => {
  //     setItemsPerPage(size);
  //     setCurrentPage(1);
  //   };

  //   const handleExport = () => {
  //     const csvContent = [
  //       ['Name', 'Team', 'Email', 'Filled', 'Errors', 'Status', 'Last Login'].join(','),
  //       ...filteredData.map(row => 
  //         `"${row.name}","${row.team}","${row.email}","${row.filled}","${row.error}","${row.status}","${row.lastLogin}"`
  //       )
  //     ].join('\n');
      
  //     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  //     const url = window.URL.createObjectURL(blob);
  //     const a = document.createElement('a');
  //     a.href = url;
  //     a.download = `dashboard-data-${new Date().toISOString().split('T')[0]}.csv`;
  //     a.click();
  //     window.URL.revokeObjectURL(url);
  //   };

  //   const clearFilters = () => {
  //     setSearchQuery('');
  //     setStatusFilter('');
  //     setTeamFilter('');
  //     setShowFilters(false);
  //     setCurrentPage(1);
  //   };

  //   const handleToggleActionMenu = (rowIndex) => {
  //     setOpenActionMenu(openActionMenu === rowIndex ? null : rowIndex);
  //   };

  //   const handleAction = (action, row) => {
  //     setOpenActionMenu(null);
      
  //     switch (action) {
  //       case 'view':
  //         alert(`Viewing profile for: ${row.name}`);
  //         break;
  //       case 'edit':
  //         alert(`Editing user: ${row.name}`);
  //         break;
  //       case 'performance':
  //         alert(`Viewing performance for: ${row.name}`);
  //         break;
  //       case 'deactivate':
  //         if (window.confirm(`Are you sure you want to deactivate ${row.name}?`)) {
  //           alert(`Deactivating user: ${row.name}`);
  //         }
  //         break;
  //       default:
  //         console.log('Unknown action:', action);
  //     }
  //   };

  //   // Close action menu when clicking outside
  //   React.useEffect(() => {
  //     const handleClickOutside = () => setOpenActionMenu(null);
  //     if (openActionMenu !== null) {
  //       document.addEventListener('click', handleClickOutside);
  //       return () => document.removeEventListener('click', handleClickOutside);
  //     }
  //   }, [openActionMenu]);

  //   return (
  //     <div className="min-h-screen bg-gray-50">
  //       <div className="max-w-10xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
  //         {/* Header */}
  //         <div className="mb-8">
  //           <div className="md:flex md:items-center md:justify-between">
  //             <div className="flex-1 min-w-0">
  //               <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
  //                 Team Performance Dashboard
  //               </h1>
  //               <p className="mt-1 text-sm text-gray-500">
  //                 Monitor team productivity and performance metrics
  //               </p>
  //             </div>
  //             {/* Search Bar */}
  //           <div className="relative max-w-md">
  //             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
  //               <Search className="h-4 w-4 text-gray-400" />
  //             </div>
  //             <input
  //               type="text"
  //               placeholder="Search by name, team, or email..."
  //               value={searchQuery}
  //               onChange={(e) => handleSearch(e.target.value)}
  //               className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
  //             />
  //           </div>
  //             <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
  //               <button
  //                 onClick={() => setShowFilters(!showFilters)}
  //                 className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
  //               >
  //                 <Filter className="w-4 h-4 mr-2" />
  //                 Filters
  //               </button>
  //               <button
  //                 onClick={handleExport}
  //                 className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
  //               >
  //                 <Download className="w-4 h-4 mr-2" />
  //                 Export
  //               </button>
  //             </div>
  //           </div>
  //         </div>

  //         {/* Search and Filters */}
  //         <div className="mb-6 space-y-4">

  //           {/* Filters Panel */}
  //           {showFilters && (
  //             <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
  //               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  //                 <div>
  //                   <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
  //                   <select
  //                     value={statusFilter}
  //                     onChange={(e) => setStatusFilter(e.target.value)}
  //                     className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
  //                   >
  //                     <option value="">All Status</option>
  //                     <option value="active">Active</option>
  //                     <option value="away">Away</option>
  //                     <option value="inactive">Inactive</option>
  //                   </select>
  //                 </div>
                  
  //                 <div>
  //                   <label className="block text-sm font-medium text-gray-700 mb-2">Team</label>
  //                   <select
  //                     value={teamFilter}
  //                     onChange={(e) => setTeamFilter(e.target.value)}
  //                     className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
  //                   >
  //                     <option value="">All Teams</option>
  //                     <option value="Frontend">Frontend</option>
  //                     <option value="Backend">Backend</option>
  //                     <option value="QA">QA</option>
  //                     <option value="DevOps">DevOps</option>
  //                     <option value="Design">Design</option>
  //                   </select>
  //                 </div>
                  
  //                 <div className="flex items-end">
  //                   <button
  //                     onClick={clearFilters}
  //                     className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
  //                   >
  //                     Clear Filters
  //                   </button>
  //                 </div>
  //               </div>
  //             </div>
  //           )}
  //         </div>

  //         {/* Results Summary */}
  //         {(searchQuery || statusFilter || teamFilter) && (
  //           <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
  //             <div className="flex items-center">
  //               <div className="flex-shrink-0">
  //                 <Users className="h-5 w-5 text-blue-400" />
  //               </div>
  //               <div className="ml-3">
  //                 <p className="text-sm text-blue-800">
  //                   <span className="font-medium">{filteredData.length}</span> of {dashboardData.length} team members shown
  //                 </p>
  //               </div>
  //             </div>
  //           </div>
  //         )}

  //         {/* Table using GlobalTable */}
  //         <Table
  //           headers={tableHeaders}
  //           data={paginatedData}
  //           loading={loading}
  //           emptyMessage="No team members found"
  //           emptySubMessage="Try adjusting your search criteria or filters"
  //           hoverable={true}
  //           compact={false}
  //         />

  //         {/* Pagination */}
  //         {totalPages > 1 && (
  //           <div className="mt-6 bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-lg shadow-sm">
  //             <div className="flex-1 flex justify-between items-center">
  //               <div className="flex items-center space-x-2">
  //                 <span className="text-sm text-gray-700">Show</span>
  //                 <select
  //                   value={itemsPerPage}
  //                   onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
  //                   className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
  //                 >
  //                   <option value={5}>5</option>
  //                   <option value={10}>10</option>
  //                   <option value={20}>20</option>
  //                   <option value={50}>50</option>
  //                 </select>
  //                 <span className="text-sm text-gray-700">per page</span>
  //               </div>
                
  //               <div className="text-sm text-gray-700">
  //                 Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} results
  //               </div>
                
  //               <div className="flex space-x-1">
  //                 <button
  //                   onClick={() => handlePageChange(currentPage - 1)}
  //                   disabled={currentPage === 1}
  //                   className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
  //                 >
  //                   Previous
  //                 </button>
                  
  //                 {[...Array(Math.min(5, totalPages))].map((_, index) => {
  //                   let pageNum;
  //                   if (totalPages <= 5) {
  //                     pageNum = index + 1;
  //                   } else if (currentPage <= 3) {
  //                     pageNum = index + 1;
  //                   } else if (currentPage >= totalPages - 2) {
  //                     pageNum = totalPages - 4 + index;
  //                   } else {
  //                     pageNum = currentPage - 2 + index;
  //                   }
                    
  //                   return (
  //                     <button
  //                       key={pageNum}
  //                       onClick={() => handlePageChange(pageNum)}
  //                       className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
  //                         pageNum === currentPage
  //                           ? 'z-10 bg-purple-50 border-purple-500 text-purple-600'
  //                           : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
  //                       }`}
  //                     >
  //                       {pageNum}
  //                     </button>
  //                   );
  //                 })}
                  
  //                 <button
  //                   onClick={() => handlePageChange(currentPage + 1)}
  //                   disabled={currentPage === totalPages}
  //                   className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
  //                 >
  //                   Next
  //                 </button>
  //               </div>
  //             </div>
  //           </div>
  //         )}
  //       </div>
  //     </div>
  //   );
  // }

  // export default Dashboard;

// import React, { useState } from 'react';
// import { Line } from 'react-chartjs-2';
// import { Chart, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js';
// Chart.register(LineElement, PointElement, CategoryScale, LinearScale);

// const employeeData = {
//   L1: {
//     daily: [5, 8],
//     weekly: [10, 15, 8, 12, 11, 9, 13],
//     monthly: [50, 60, 45, 70]
//   },
//   QC: {
//     daily: [3, 6],
//     weekly: [6, 9, 5, 10, 8, 7, 9],
//     monthly: [30, 40, 35, 45]
//   },
//   TL: {
//     daily: [2, 4],
//     weekly: [4, 6, 3, 5, 6, 4, 5],
//     monthly: [20, 25, 22, 28]
//   }
// };

// // Table headers and mock data per role
// const roleTableConfig = {
//   L1: {
//     headers: ['Employee ID', 'Name', 'Tasks Completed'],
//     rows: [
//       ['L1-001', 'Alice', 14],
//       ['L1-002', 'Bob', 12]
//     ]
//   },
//   QC: {
//     headers: ['QC ID', 'Name', 'Inspections Done', 'Errors Found'],
//     rows: [
//       ['QC-001', 'Charlie', 20, 2],
//       ['QC-002', 'Dave', 18, 1]
//     ]
//   },
//   TL: {
//     headers: ['Team Lead ID', 'Name', 'Team Size', 'Issues Reported'],
//     rows: [
//       ['TL-001', 'Eve', 5, 1],
//       ['TL-002', 'Frank', 6, 0]
//     ]
//   }
// };

// const Dashboard = () => {
//   const [selectedView, setSelectedView] = useState('daily');
//   const [selectedRole, setSelectedRole] = useState('L1');

//   const labels = {
//     daily: ['Day 1', 'Day 2'],
//     weekly: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
//     monthly: ['Week 1', 'Week 2', 'Week 3', 'Week 4']
//   };

//   const chartData = {
//     labels: labels[selectedView],
//     datasets: [
//       {
//         label: `${selectedRole} Performance`,
//         data: employeeData[selectedRole][selectedView],
//         borderColor: 'rgb(99, 102, 241)', // Indigo-500
//         backgroundColor: 'rgba(99, 102, 241, 0.5)',
//         tension: 0.4
//       }
//     ]
//   };

//   const currentTable = roleTableConfig[selectedRole];

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Employee Dashboard</h1>

//         {/* Role Dropdown */}
//         <div>
//           <select
//             value={selectedRole}
//             onChange={(e) => setSelectedRole(e.target.value)}
//             className="px-3 py-2 border rounded bg-white text-gray-700"
//           >
//             <option value="L1">L1</option>
//             <option value="QC">QC</option>
//             <option value="TL">TL</option>
//           </select>
//         </div>
//       </div>

//       {/* View Selector */}
//       <div className="flex space-x-4 mb-6">
//         {['daily', 'weekly', 'monthly'].map(view => (
//           <button
//             key={view}
//             onClick={() => setSelectedView(view)}
//             className={`px-4 py-2 rounded ${
//               selectedView === view ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border'
//             }`}
//           >
//             {view === 'daily' ? '2-Day' : view.charAt(0).toUpperCase() + view.slice(1)}
//           </button>
//         ))}
//       </div>

//       {/* Chart */}
//       <div className="bg-white p-4 rounded shadow mb-6">
//         <Line data={chartData} />
//       </div>

//       {/* Dynamic Table */}
//       <div className="bg-white p-4 rounded shadow">
//         <h2 className="text-lg font-semibold mb-4">{selectedRole} Details</h2>
//         <table className="w-full text-left border border-gray-200">
//           <thead className="bg-gray-100">
//             <tr>
//               {currentTable.headers.map((header, idx) => (
//                 <th key={idx} className="p-2 border-b border-gray-200">{header}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {currentTable.rows.map((row, idx) => (
//               <tr key={idx} className="hover:bg-gray-50">
//                 {row.map((cell, i) => (
//                   <td key={i} className="p-2 border-b border-gray-100">{cell}</td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
