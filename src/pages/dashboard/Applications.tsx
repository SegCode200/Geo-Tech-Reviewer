import { useState } from 'react'
import { FaSearch, FaDownload, FaEye, FaEllipsisV, FaPlus } from 'react-icons/fa';

const Applications = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Sample data
  const applications = [
    { id: 'APP-001', applicant: 'John Doe', property: 'Plot 123, Lagos', status: 'approved', date: '2025-01-15', amount: '₦50,000' },
    { id: 'APP-002', applicant: 'Jane Smith', property: 'Plot 456, Ibadan', status: 'pending', date: '2025-01-14', amount: '₦50,000' },
    { id: 'APP-003', applicant: 'Alice Johnson', property: 'Plot 789, Abuja', status: 'rejected', date: '2025-01-13', amount: '₦50,000' },
    { id: 'APP-004', applicant: 'Bob Wilson', property: 'Plot 101, Kano', status: 'approved', date: '2025-01-12', amount: '₦50,000' },
  ];

  const filteredApps = applications.filter(app => {
    const matchesSearch = app.applicant.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || app.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    const badges = {
      approved: 'gov-badge-success',
      pending: 'gov-badge-warning',
      rejected: 'gov-badge-danger'
    };
    return badges[status as keyof typeof badges] || 'gov-badge-info';
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gov-text">Applications</h1>
          <p className="text-xs sm:text-base text-gov-text-light mt-1 sm:mt-2">Manage all certificate applications</p>
        </div>
        <button className="gov-button w-full sm:w-auto inline-flex justify-center sm:justify-start items-center space-x-2">
          <FaPlus />
          <span>New Application</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="gov-card p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {/* Search */}
          <div>
            <label className="gov-label text-xs sm:text-sm">Search</label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gov-text-light text-xs sm:text-sm" />
              <input
                type="text"
                placeholder="Name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="gov-input pl-9 text-xs sm:text-base"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="gov-label text-xs sm:text-sm">Filter Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="gov-input text-xs sm:text-base"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="gov-label text-xs sm:text-sm">Date</label>
            <input type="date" className="gov-input text-xs sm:text-base" />
          </div>
        </div>
      </div>

      {/* Applications Table - Mobile Card View & Desktop Table View */}
      <div className="gov-card">
        {/* Mobile Card View */}
        <div className="sm:hidden space-y-3 p-4">
          {filteredApps.map((app) => (
            <div key={app.id} className="border border-gov-border rounded-gov p-4 space-y-2">
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-primary text-sm truncate">{app.id}</p>
                  <p className="text-xs text-gov-text">{app.applicant}</p>
                </div>
                <span className={`gov-badge text-xs whitespace-nowrap ${getStatusBadge(app.status)}`}>
                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                </span>
              </div>
              <p className="text-xs text-gov-text-light truncate">{app.property}</p>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gov-text-light">{app.date}</span>
                <span className="font-medium text-gov-text">{app.amount}</span>
              </div>
              <div className="flex gap-2 pt-2 border-t border-gov-border">
                <button className="flex-1 text-xs py-1 text-primary hover:bg-primary/10 rounded transition-colors">View</button>
                <button className="flex-1 text-xs py-1 text-primary hover:bg-primary/10 rounded transition-colors">Download</button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gov-border bg-gov-light">
                <th className="text-left py-3 px-4 font-semibold text-gov-text">ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gov-text">Applicant</th>
                <th className="text-left py-3 px-4 font-semibold text-gov-text hidden lg:table-cell">Property</th>
                <th className="text-left py-3 px-4 font-semibold text-gov-text">Amount</th>
                <th className="text-left py-3 px-4 font-semibold text-gov-text">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gov-text hidden md:table-cell">Date</th>
                <th className="text-center py-3 px-4 font-semibold text-gov-text">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.map((app) => (
                <tr key={app.id} className="border-b border-gov-border hover:bg-gov-light transition-colors">
                  <td className="py-3 px-4 font-semibold text-primary text-sm">{app.id}</td>
                  <td className="py-3 px-4 text-gov-text text-sm">{app.applicant}</td>
                  <td className="py-3 px-4 text-gov-text-light text-sm hidden lg:table-cell">{app.property}</td>
                  <td className="py-3 px-4 font-medium text-gov-text text-sm">{app.amount}</td>
                  <td className="py-3 px-4 text-sm">
                    <span className={`gov-badge ${getStatusBadge(app.status)}`}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gov-text-light text-sm hidden md:table-cell">{app.date}</td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center items-center space-x-2">
                      <button className="text-primary hover:text-secondary transition-colors p-1" title="View">
                        <FaEye />
                      </button>
                      <button className="text-primary hover:text-secondary transition-colors p-1" title="Download">
                        <FaDownload />
                      </button>
                      <button className="text-gov-text-light hover:text-gov-text transition-colors p-1" title="More">
                        <FaEllipsisV />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gov-border flex flex-col sm:flex-row justify-between items-center gap-4 bg-gov-light">
          <p className="text-xs sm:text-sm text-gov-text-light">Showing {filteredApps.length} of {applications.length}</p>
          <div className="flex space-x-1 sm:space-x-2">
            <button className="px-2 sm:px-4 py-1 sm:py-2 border border-gov-border rounded-gov hover:bg-white transition-colors text-xs sm:text-sm">Prev</button>
            <button className="px-2 sm:px-4 py-1 sm:py-2 bg-primary text-white rounded-gov text-xs sm:text-sm">1</button>
            <button className="px-2 sm:px-4 py-1 sm:py-2 border border-gov-border rounded-gov hover:bg-white transition-colors text-xs sm:text-sm hidden sm:inline">2</button>
            <button className="px-2 sm:px-4 py-1 sm:py-2 border border-gov-border rounded-gov hover:bg-white transition-colors text-xs sm:text-sm">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Applications;