import { Link, Outlet } from "react-router-dom";
import { FaTachometerAlt, FaClipboardList, FaCogs, FaSignOutAlt, FaBars, FaTimes, FaFileContract } from "react-icons/fa";
import { useState } from "react";
import { logoutState, selectUser } from "../../store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../api/authApi";

export const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dispatch = useDispatch()

  const user = useSelector(selectUser);
  const role = user?.role?.toLowerCase();

  const reviewerNav = [
    { path: "/dashboard", label: "Dashboard", icon: <FaTachometerAlt className="w-5 h-5" /> },
    { path: "/dashboard/cofo/inbox", label: "Inbox", icon: <FaClipboardList className="w-5 h-5" /> },
    { path: "/dashboard/cofo/applications", label: "All Applications", icon: <FaClipboardList className="w-5 h-5" /> },
  ];

  const governorNav = [
    { path: "/dashboard", label: "Dashboard", icon: <FaTachometerAlt className="w-5 h-5" /> },
    { path: "/dashboard/governor/transfers", label: "Transfers", icon: <FaFileContract className="w-5 h-5" /> },
    { path: "/dashboard/cofo/pending-final", label: "Pending Final Approval", icon: <FaClipboardList className="w-5 h-5" /> },
    { path: "/dashboard/cofo/approved", label: "Approved CofO", icon: <FaClipboardList className="w-5 h-5" /> },
    { path: "/dashboard/reports", label: "Reports", icon: <FaClipboardList className="w-5 h-5" /> },
    { path: "/dashboard/settings", label: "Upload Signature", icon: <FaCogs className="w-5 h-5" /> },
  ];

  const navItems = role === "governor" ? governorNav : reviewerNav;

  const handleLogout = async() => {
    setIsLoggingOut(true);
    try {
      dispatch(logoutState());
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex h-screen bg-gov-light flex-col md:flex-row">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Government Sidebar */}
      <aside
        className={`gov-sidebar fixed md:sticky top-0 left-0 transition-all duration-300 z-40 ${
          sidebarOpen ? "w-64" : "hidden md:block md:w-64"
        } overflow-y-auto`}
      >
        {/* Government Seal / Logo Area */}
        <div className="bg-secondary border-b-4 border-accent p-4 sm:p-6 sticky top-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center font-bold text-primary text-sm sm:text-lg">
              GO
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base sm:text-lg font-bold truncate">Gov Portal</h2>
              <p className="text-xs opacity-90">C of O System</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="py-4 sm:py-6 space-y-1 sm:space-y-2 px-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className="gov-nav-item group text-sm sm:text-base px-4 sm:px-6 text-white hover:text-white flex items-center rounded-gov transition-colors"
              title={item.label}
            >
              {item.icon}
              <span className="ml-3 sm:ml-4 truncate hover:text-white ">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Divider */}
        <div className="border-t border-secondary my-3 sm:my-4"></div>

        {/* Footer */}
        <div className="p-4 sm:p-6 text-xs opacity-75 border-t border-secondary">
          <p className="font-semibold mb-2">System Info</p>
          <p className="truncate">v1.0.0</p>
          <p className="text-xs mt-2">© 2025</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col w-full overflow-hidden">
        {/* Government Header */}
        <header className="gov-header flex justify-between items-center sticky top-0 z-40 gap-2 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-secondary rounded-gov transition-colors flex-shrink-0"
              title="Toggle sidebar"
            >
              {sidebarOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
            </button>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold truncate">Certificate of Occupancy</h1>
              <p className="text-xs opacity-90 hidden sm:block">Government Land Administration</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center space-x-1 sm:space-x-2 hover:bg-secondary px-2 sm:px-4 py-2 rounded-gov transition-colors flex-shrink-0 text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoggingOut ? (
              <>
                <span className="animate-spin">⏳</span>
                <span className="hidden sm:inline">Logging out...</span>
              </>
            ) : (
              <>
                <FaSignOutAlt className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Logout</span>
              </>
            )}
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-3 sm:p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-primary text-white py-3 sm:py-4 px-4 sm:px-8 text-xs sm:text-sm text-center border-t-4 border-accent">
          <p className="break-words">Government of Nigeria - Land Registration © 2025</p>
        </footer>
      </div>
    </div>
  );
};