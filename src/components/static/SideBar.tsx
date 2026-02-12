import { FaTachometerAlt, FaClipboardList, FaUsers, FaCheckCircle, FaFileContract, FaCog } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/authSlice";

const Sidebar = () => {
  const user = useSelector(selectUser);

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: <FaTachometerAlt className="w-5 h-5" /> },
    { to: "/dashboard/approvals", label: "Review Applications", icon: <FaClipboardList className="w-5 h-5" /> },
    { to: "/dashboard/applications", label: "Manager Approvals", icon: <FaCheckCircle className="w-5 h-5" /> },
    { to: "/dashboard/reports", label: "Reports", icon: <FaFileContract className="w-5 h-5" /> },
    { to: "/dashboard/user-management", label: "User Management", icon: <FaUsers className="w-5 h-5" /> },
  ];

  // Add governor menu when user is governor
  if (user?.role?.toLowerCase() === "governor") {
    navItems.splice(3, 0, { to: "/dashboard/governor/transfers", label: "Governor Transfers", icon: <FaFileContract className="w-5 h-5" /> });
  }

  return (
    <aside className="gov-sidebar w-64 h-screen fixed top-0 left-0 flex flex-col">
      {/* Government Seal / Logo Area */}
      <div className="bg-secondary border-b-4 border-accent p-6 sticky top-0">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center font-bold text-primary text-lg">
            GO
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-white">Admin Panel</h2>
            <p className="text-xs opacity-90">Government Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6 space-y-2 px-2 overflow-y-auto">
        <div className="mb-4 px-4">
          <p className="text-xs font-semibold text-white/60 uppercase tracking-wider">Main Menu</p>
        </div>
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `gov-nav-item flex items-center space-x-3 px-6 py-3 rounded-r-gov transition-all duration-200 ${
                    isActive
                      ? "bg-secondary border-l-4 border-accent text-white"
                      : "text-white/80 hover:text-white hover:bg-primary/50"
                  }`
                }
              >
                <div className="flex-shrink-0">{item.icon}</div>
                <span className="text-sm font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Divider */}
      <div className="border-t border-secondary/50 my-2"></div>

      {/* Settings Section */}
      <div className="px-2 pb-6">
        <button className="w-full flex items-center space-x-3 px-6 py-3 rounded-r-gov text-white/80 hover:text-white hover:bg-primary/50 transition-all duration-200">
          <FaCog className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">Settings</span>
        </button>
      </div>

      {/* Footer Info */}
      <div className="bg-secondary/50 px-6 py-4 border-t border-secondary/50">
        <p className="text-xs text-white/60 text-center">
          <span className="block font-semibold mb-1">v1.0.0</span>
          <span className="block">© 2025 Government</span>
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
