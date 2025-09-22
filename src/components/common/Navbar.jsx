import { useRef } from "react";
import { NavLink } from "react-router-dom"; 
import { LuFileSearch } from "react-icons/lu";
import { CgProfile } from "react-icons/cg";
import { useAuth } from "../../contexts/AuthContext"; 

export default function Navbar() {
  const { user, logout } = useAuth(); 
  const menuRef = useRef(null);

  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Team", path: "/team" },
    { name: "Sheets", path: "/sheetdata" },
    { name: "Gid Search", path: "/gid" },
    { name: "Form", path: "/l1form" },
    { name: "Feedback", path: "/feedback" },
  ];

  return (
    <nav className="relative bg-gray-800">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex shrink-0 items-center text-white text-xl font-bold">
            <LuFileSearch size={24} className="mr-2" />
            Kartikey
          </div>

          <div className="hidden sm:block">
            <div className="flex space-x-4">
              {navItems.map((link) => (
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
                <CgProfile size={24} className="text-gray-300" />
                <span className="hidden sm:inline text-white font-medium">
                  {user.name}
                </span>
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
