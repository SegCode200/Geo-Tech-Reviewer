import { createBrowserRouter } from "react-router-dom";
import { Layout } from "../components/layouts/DashboardLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import  Approvals  from "../pages/dashboard/Approval";
import  Settings  from "../pages/dashboard/Settings";
import { Login } from "../pages/auth/Login";
import ApprovalReview from "../pages/dashboard/ApprovalReview";

// Layout Component with Sidebar


// Login Page




// Router Setup
const mainRoute = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <Layout />,
    children: [
      { path: "", element: <Dashboard /> },
      { path: "approvals", element: <Approvals /> },
      { path: "approvals/:id", element: <ApprovalReview /> },
      { path: "settings", element: <Settings /> },
    ],
  },
]);

// App Component
export default mainRoute