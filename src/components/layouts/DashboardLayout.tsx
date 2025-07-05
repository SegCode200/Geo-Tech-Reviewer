import { Link, Outlet } from "react-router-dom";

export const Layout = () => (
  <div className="flex h-screen">
    {/* Sidebar */}

    <aside className="w-64 bg-gray-800 text-white p-5  h-screen fixed top-0 left-0">
      <h2 className="text-xl font-bold mb-4">C of O Admin</h2>
      <nav>
        <ul className="space-y-2">
          <li><Link to="/dashboard" className="block p-2 hover:bg-gray-700 rounded">Dashboard</Link></li>
          <li><Link to="/dashboard/approvals" className="block p-2 hover:bg-gray-700 rounded">Approvals</Link></li>
          <li><Link to="/dashboard/settings" className="block p-2 hover:bg-gray-700 rounded">Settings</Link></li>
        </ul>
      </nav>
    </aside>
    
    {/* Main Content */}
    <div className="flex-1 p-6 ml-64 pb-6 pt-2 px-6 bg-gray-100 min-h-screen">
      <Outlet />
    </div>
  </div>
);