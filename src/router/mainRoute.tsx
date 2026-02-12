import { createBrowserRouter } from "react-router-dom";
import { Layout } from "../components/layouts/DashboardLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import  Approvals  from "../pages/dashboard/Approval";
import GovernorSettings from "../pages/dashboard/GovernorSettings";
import GovernorTransfers from "../pages/dashboard/governor/GovernorTransfers";
import GovernorTransferView from "../pages/dashboard/governor/GovernorTransferView";
import ApprovalReview from "../pages/dashboard/ApprovalReview";
import ProtectedRoute from "../pages/auth/ProtectedRoute";
import Login from "../pages/auth/Login";
import VerifyEmail from "../pages/auth/VerifyEmail";
import SetPassword from "../pages/auth/SetPassword";
import Applications from "../pages/dashboard/Applications";
import Inbox from "../pages/dashboard/cofo/Inbox";
import CofoApplications from "../pages/dashboard/cofo/CofoApplications";
import PendingFinal from "../pages/dashboard/cofo/PendingFinal";
import Approved from "../pages/dashboard/cofo/Approved";
import CofoView from "../pages/dashboard/cofo/CofoView";
import Reports from "../pages/dashboard/Reports";

// Layout Component with Sidebar


// Login Page




// Router Setup
const mainRoute = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/verify",
    element: <VerifyEmail />,
  },
  {
    path: "/set-password",
    element: <SetPassword />,
  },
  {
    path: "/dashboard",
    element: 
      <ProtectedRoute>
    <Layout />
    </ProtectedRoute>
    ,
    children: [
      { path: "", element: <Dashboard /> },
      { path: "approvals", element: <Approvals /> },
      { path: "applications", element: <Applications /> },
      { path: "cofo/inbox", element: <Inbox /> },
      { path: "cofo/applications", element: <CofoApplications /> },
      { path: "cofo/pending-final", element: <PendingFinal /> },
      { path: "cofo/approved", element: <Approved /> },
      { path: "cofo/:id", element: <CofoView /> },
      { path: "approvals/:id", element: <ApprovalReview /> },
      { path: "governor/transfers", element: <GovernorTransfers /> },
      { path: "governor/transfers/:id", element: <GovernorTransferView /> },
      { path: "reports", element: <Reports /> },
      { path: "settings", element: <GovernorSettings /> },
    ],
  },
]);

// App Component
export default mainRoute