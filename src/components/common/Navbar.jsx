import { useRef } from "react";
import { NavLink } from "react-router-dom"; 
import { LuFileSearch } from "react-icons/lu";
import { CgProfile } from "react-icons/cg";
import { useAuth } from "../../contexts/AuthContext"; 

export default function Navbar() {
  const { user, logout } = useAuth(); 
  const menuRef = useRef(null);

  const username = user?.email ? user.email.split("@")[0].split(".")[0] : "Guest";
  const name = username.charAt(0).toUpperCase() + username.slice(1);
  const navItems = [
    { name: "Dashboard", path: "/dashboard", roles: ["ADMIN"] },
    { name: "Team", path: "/team", roles: ["QCTEAM", "ADMIN"] },
    { name: "Sheets", path: "/sheetdata", roles: ["QCTEAM", "ADMIN"] },
    { name: "Gid Search", path: "/gid", roles: ["QCTEAM", "ADMIN"] },
    { name: "Form", path: "/l1form", roles: ["L1TEAM", "QCTEAM", "ADMIN"] },
    { name: "Feedback", path: "/feedback", roles: ["L1TEAM", "QCTEAM", "ADMIN"] },
  ];

  const filteredNavItems = user
    ? navItems.filter(item => item.roles.includes(user.role))
    : [];

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-800 z-50 shadow-md">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex shrink-0 items-center text-white text-xl font-bold">
            <LuFileSearch size={24} className="mr-2" />
            Kartikey
          </div>

          <div className="hidden sm:block">
            <div className="flex space-x-4">
              {filteredNavItems.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `rounded-md px-3 py-2 text-sm font-medium ${
                      isActive
                        ? "bg-gray-900 text-white" 
                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-3" ref={menuRef}>
                <p className="sm:inline text-white font-medium">
                  {name}
                </p>
                <CgProfile size={24} className="text-gray-300" />
                <NavLink
                  to="/login"
                  onClick={logout}
                  className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
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
