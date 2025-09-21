import React from "react";

function Dashboard() {
  // Sample static data
  const dashboardData = [
    {
      id: 1,
      name: "Deepak Sharma",
      team: "Frontend",
      email: "deepak@example.com",
      filled: 120,
      error: 3,
    },
    {
      id: 2,
      name: "Aarav Mehta",
      team: "Backend",
      email: "aarav@example.com",
      filled: 98,
      error: 5,
    },
    {
      id: 3,
      name: "Neha Verma",
      team: "QA",
      email: "neha@example.com",
      filled: 130,
      error: 1,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Team
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Filled
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Error
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardData.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm font-medium text-gray-900">
                      {row.name}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600">{row.team}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{row.email}</td>
                    <td className="px-4 py-2 text-sm text-green-600 font-semibold">
                      {row.filled}
                    </td>
                    <td className="px-4 py-2 text-sm text-red-600 font-semibold">
                      {row.error}
                    </td>
                  </tr>
                ))}

                {dashboardData.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-6 text-center text-gray-500 text-sm"
                    >
                      No data available
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

export default Dashboard;
