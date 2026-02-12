import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaComments, FaClock } from "react-icons/fa";
import { useApprovalApplications } from "../../hooks/useApprovals";

const ReviewDashboard = () => {
  const navigate = useNavigate();
  const { applications, isLoading, error } = useApprovalApplications();
  const [searchTerm, setSearchTerm] = useState("");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const filteredApplications = applications.filter((app) =>
    app.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );



  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gov-text">Approvals Review</h1>
        <p className="text-xs sm:text-base text-gov-text-light mt-1 sm:mt-2">Review and approve pending applications</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="gov-card p-4 sm:p-6 border-l-4 border-primary">
          <p className="text-xs sm:text-sm text-gov-text-light font-medium">Pending Review</p>
          <p className="text-2xl sm:text-3xl font-bold text-primary mt-2">{filteredApplications.length}</p>
        </div>
        <div className="gov-card p-4 sm:p-6 border-l-4 border-green-500">
          <p className="text-xs sm:text-sm text-gov-text-light font-medium">Total Applications</p>
          <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-2">{applications.length}</p>
        </div>
        <div className="gov-card p-4 sm:p-6 border-l-4 border-yellow-500">
          <p className="text-xs sm:text-sm text-gov-text-light font-medium">Awaiting Action</p>
          <p className="text-2xl sm:text-3xl font-bold text-yellow-600 mt-2">{filteredApplications.length}</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="gov-card p-4 sm:p-6">
        <input
          type="text"
          placeholder="Search by applicant name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gov-border rounded-gov focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="gov-card p-8 text-center">
          <p className="text-gov-text-light">Loading applications...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="gov-card p-4 bg-red-50 border border-red-200 rounded-gov">
          <p className="text-red-600 text-sm">Error loading applications. Please try again.</p>
        </div>
      )}

      {/* Applications - Mobile Card View & Desktop Table View */}
      {!isLoading && !error && (
        <div className="gov-card">
          {/* Mobile Card View */}
          <div className="sm:hidden space-y-3 p-4">
            {filteredApplications.length > 0 ? (
              filteredApplications.map((app) => (
                <div
                  key={app.id}
                  onClick={() => navigate(`/dashboard/approvals/${app.id}`)}
                  className="border border-gov-border rounded-gov p-4 space-y-3 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-primary text-sm truncate">
                        {app.user?.fullName} 
                      </p>
                      <p className="text-xs text-gov-text-light truncate">{app.user?.email}</p>
                    </div>
                    <span className="gov-badge gov-badge-warning text-xs whitespace-nowrap">{app.status}</span>
                  </div>
                  <div className="space-y-1 text-xs text-gov-text-light">
                    <p>{app.land?.state?.name}</p>
                    <p className="flex items-center gap-1">
                      <FaClock className="w-3 h-3" />
                      {formatTimeAgo(app.createdAt)}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gov-border">
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/approvals/${app.id}`); }}
                      className="p-2 text-primary hover:bg-primary/10 rounded transition-colors text-xs font-medium"
                    >
                      View Details
                    </button>
                    <button className="p-2 text-primary hover:bg-primary/10 rounded transition-colors text-xs font-medium">
                      Comment
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gov-text-light">
                <p>No applications found</p>
              </div>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gov-border bg-gov-light">
                  <th className="px-4 py-3 sm:py-4 text-left font-semibold text-gov-text">Applicant</th>
                  <th className="px-4 py-3 sm:py-4 text-left font-semibold text-gov-text">State</th>
                  <th className="px-4 py-3 sm:py-4 text-left font-semibold text-gov-text hidden md:table-cell">Email</th>
                  <th className="px-4 py-3 sm:py-4 text-left font-semibold text-gov-text">Status</th>
                  <th className="px-4 py-3 sm:py-4 text-left font-semibold text-gov-text hidden lg:table-cell">Submitted</th>
                  <th className="px-4 py-3 sm:py-4 text-center font-semibold text-gov-text">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.length > 0 ? (
                  filteredApplications.map((app) => (
                    <tr
                      key={app.id}
                      onClick={() => navigate(`/dashboard/approvals/${app.id}`)}
                      className="border-b border-gov-border hover:bg-gov-light transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3 sm:py-4">
                        <p className="font-semibold text-primary text-sm">
                          {app.user?.fullName} 
                        </p>
                      </td>
                      <td className="px-4 py-3 sm:py-4 text-sm text-gov-text">{app.land?.state?.name}</td>
                      <td className="px-4 py-3 sm:py-4 text-xs sm:text-sm text-gov-text-light hidden md:table-cell truncate">
                        {app.user?.email}
                      </td>
                      <td className="px-4 py-3 sm:py-4">
                        <span className="gov-badge gov-badge-warning text-xs">{app.status}</span>
                      </td>
                      <td className="px-4 py-3 sm:py-4 text-xs sm:text-sm text-gov-text-light hidden lg:table-cell">
                        {formatDate(app.createdAt)}
                      </td>
                      <td className="px-4 py-3 sm:py-4">
                        <div className="flex justify-center items-center space-x-1 sm:space-x-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/approvals/${app.id}`); }}
                            title="View Details"
                            className="p-2 text-primary hover:bg-primary/10 rounded-gov transition-colors"
                          >
                            <FaEye className="w-4 h-4" />
                          </button>
                          <button title="Add Comments" className="p-2 text-gov-text-light hover:text-primary transition-colors">
                            <FaComments className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gov-text-light">
                      <p>No applications matching your search</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewDashboard;