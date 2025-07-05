import { FaTachometerAlt, FaClipboardList, FaUsers, FaCheckCircle, FaFileContract } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <aside className="bg-gray-800 text-white w-64 h-screen fixed top-0 left-0">
      {/* Logo */}
      <div className="flex items-center p-4 bg-blue-600 text-white">
        <span className="text-xl font-bold">Admin Panel</span>
      </div>

      {/* Navigation Links */}
      <nav className="mt-6">
        <ul>
          <li className="p-4 hover:bg-gray-700 cursor-pointer">
            <NavLink to="/admin" className="flex items-center">
              <FaTachometerAlt className="h-5 w-5 mr-2" />
              Dashboard
            </NavLink>
          </li>
          <li className="p-4 hover:bg-gray-700 cursor-pointer">
            <NavLink to="/admin/applications/reviewer" className="flex items-center">
              <FaClipboardList className="h-5 w-5 mr-2" />
              Review Applications
            </NavLink>
          </li>
          <li className="p-4 hover:bg-gray-700 cursor-pointer">
            <NavLink to="/admin/applications/manager" className="flex items-center">
              <FaCheckCircle className="h-5 w-5 mr-2" />
              Manager Approvals
            </NavLink>
          </li>
          <li className="p-4 hover:bg-gray-700 cursor-pointer">
            <NavLink to="/admin/applications/governor" className="flex items-center">
              <FaFileContract className="h-5 w-5 mr-2" />
              Final Approval
            </NavLink>
          </li>
          <li className="p-4 hover:bg-gray-700 cursor-pointer">
            <NavLink to="/admin/user-management" className="flex items-center">
              <FaUsers className="h-5 w-5 mr-2" />
              User Management
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
