import { useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LuFileSearch } from "react-icons/lu";
import { CgProfile } from "react-icons/cg";
import { useAuth } from "../../contexts/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const menuRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const username = user?.email;
  const navItems = [
    { name: "Dashboard", path: "/dashboard", roles: ["ADMIN"] },
    { name: "Team", path: "/team", roles: ["ADMIN"] },
    { name: "QcSheets", path: "/qcsheetdata", roles: ["QCTEAM", "ADMIN"] },
    { name: "Sheets", path: "/sheetdata", roles: ["ADMIN"] },
    { name: "Gid Search", path: "/gid", roles: ["QCTEAM", "ADMIN"] },
    { name: "Form", path: "/l1form", roles: ["L1TEAM"] },
    { name: "Feedback", path: "/feedback", roles: ["L1TEAM", "QCTEAM", "ADMIN"] },
  ];

  const filteredNavItems = user
    ? navItems.filter((item) => item.roles.includes(user.role))
    : [];

  const handleChangePassword = () => {
    setDropdownOpen(false);
    navigate("/forgotpassword");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-800 z-50 shadow-md">
      <div className="mx-auto max-w-10xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex shrink-0 items-center text-white text-xl font-bold">
            <LuFileSearch size={24} className="mr-2" />
            Kartikey
          </div>

          {/* Navigation Links */}
          <div className="hidden sm:flex flex-1 justify-center">
            <div className="flex space-x-4">
              {filteredNavItems.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          </div>

          {/* User Profile & Logout */}
          <div className="flex items-center space-x-4 relative">
            {user && (
              <div className="flex items-center space-x-3" ref={menuRef}>
                <div
                  className="hidden sm:flex items-center space-x-2 cursor-pointer"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                >
                  <CgProfile size={20} className="text-gray-300" />
                  <p className="text-white font-medium text-sm">{username}</p>
                </div>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-10 w-48 bg-white rounded-md shadow-lg py-2 z-50">
                    <button
                      onClick={handleChangePassword}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Change Password
                    </button>
                  </div>
                )}

                <NavLink
                  to="/login"
                  onClick={logout}
                  className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
                >
                  Logout
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
