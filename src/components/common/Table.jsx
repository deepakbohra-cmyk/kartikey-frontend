import { Mail, User, Hash, Clock, UserCheck, Calendar, Search } from "lucide-react";

const Table = ({ filteredData, formatDecision, getDecisionColor }) => {
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {/* ID */}
              <th className="px-4 py-3 text-left">
                <div className="flex items-center space-x-1">
                  <Hash className="w-3 h-3 text-gray-400" />
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </span>
                </div>
              </th>

              {/* Date */}
              <th className="px-4 py-3 text-left min-w-[120px]">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3 text-gray-400" />
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </span>
                </div>
              </th>

              {/* Time */}
              <th className="px-4 py-3 text-left min-w-[100px]">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </span>
                </div>
              </th>

              {/* Email */}
              <th className="px-4 py-3 text-left min-w-[200px]">
                <div className="flex items-center space-x-1">
                  <Mail className="w-3 h-3 text-gray-400" />
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </span>
                </div>
              </th>

              {/* Work Type */}
              <th className="px-4 py-3 text-left min-w-[150px]">
                <div className="flex items-center space-x-1">
                  <User className="w-3 h-3 text-gray-400" />
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Work Type
                  </span>
                </div>
              </th>

              {/* GID */}
              <th className="px-4 py-3 text-left">
                <div className="flex items-center space-x-1">
                  <Hash className="w-3 h-3 text-gray-400" />
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    GID
                  </span>
                </div>
              </th>

              {/* Decision */}
              <th className="px-4 py-3 text-left min-w-[300px]">
                <div className="flex items-center space-x-1">
                  <UserCheck className="w-3 h-3 text-gray-400" />
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Decision
                  </span>
                </div>
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                  {row.id}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">
                  {row.date}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500">
                  {row.time}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                  {row.email}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      row.workType === "remote"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {row.workType.charAt(0).toUpperCase() + row.workType.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 font-mono">
                  {row.gid}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDecisionColor(
                      row.decision
                    )}`}
                  >
                    {formatDecision(row.decision)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
