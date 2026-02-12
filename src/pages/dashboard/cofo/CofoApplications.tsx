import { useState } from "react";
import { FaList, FaEye } from "react-icons/fa";
import { useReviewerApplications } from "../../../hooks/useDashboard";
import { useNavigate } from "react-router-dom";

const CofoApplications = () => {
  const [search, setSearch] = useState("");
  const { applications, isLoading } = useReviewerApplications();
  const navigate = useNavigate();

  console.log(applications)

  const filtered = applications.filter(a => {
    const name = `${a.user?.fullName || ''}`.toLowerCase();
    return name.includes(search.toLowerCase()) || a.user?.email?.toLowerCase().includes(search.toLowerCase()) || a.id?.toLowerCase().includes(search.toLowerCase());
  });
  console.log(filtered)
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <FaList className="w-5 h-5 text-primary" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gov-text">All CofO Applications</h1>
        </div>
        <p className="text-xs sm:text-base text-gov-text-light mt-1 sm:mt-2">Browse all Certificate of Occupancy applications</p>
      </div>

      <div className="gov-card p-4 sm:p-6">
        <div className="mb-4">
          <input
            placeholder="Search by name or id..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="gov-input w-full"
          />
        </div>

        {isLoading && <div className="text-center py-8 text-gov-text-light">Loading applications...</div>}

        {!isLoading && filtered.map(app => (
          <div key={app.id} className="border-b border-gov-border py-3 flex justify-between items-center cursor-pointer" onClick={() => navigate(`/dashboard/approvals/${app.id}`)}>
            <div>
              <p className="font-semibold text-primary">{`${app.user?.fullName || ''}`.trim() || app.id}</p>
              <p className="text-xs text-gov-text-light">State: {app.land?.state?.name || '—'}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`gov-badge ${app.status?.toLowerCase() === 'approved' ? 'gov-badge-success' : 'gov-badge-warning'}`}>{app.status}</span>
              <button className="text-primary hover:text-secondary p-2 rounded-gov" title="View" onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/approvals/${app.id}`); }}><FaEye /></button>
            </div>
          </div>
        ))}

        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-8 text-gov-text-light">No applications found</div>
        )}
      </div>
    </div>
  );
};

export default CofoApplications;
