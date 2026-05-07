import { useState } from "react";
import { FaList, FaEye } from "react-icons/fa";
import { useReviewerApplications } from "../../../hooks/useDashboard";
import { useNavigate } from "react-router-dom";

const CofoApplications = () => {
  const [search, setSearch] = useState("");
  const { applications, landReviewTasks, isLoading } = useReviewerApplications();
  const navigate = useNavigate();

  const filteredApplications = applications.filter((a:any) => {
    const name = `${a.user?.fullName || ''}`.toLowerCase();
    return (
      name.includes(search.toLowerCase()) ||
      a.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
      a.id?.toLowerCase().includes(search.toLowerCase())
    );
  });

  const filteredLandReviewTasks = landReviewTasks.filter((task:any) => {
    const ownerName = `${task.owner?.fullName || ''}`.toLowerCase();
    return (
      ownerName.includes(search.toLowerCase()) ||
      task.owner?.email?.toLowerCase().includes(search.toLowerCase()) ||
      task.id?.toLowerCase().includes(search.toLowerCase()) ||
      task.landCode?.toLowerCase().includes(search.toLowerCase())
    );
  });

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

        {!isLoading && filteredApplications.map((app:any) => (
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

        {!isLoading && filteredApplications.length === 0 && (
          <div className="text-center py-8 text-gov-text-light">No applications found</div>
        )}
      </div>

      <div className="gov-card p-4 sm:p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gov-text">Existing CofO Review Tasks</h2>
          <p className="text-sm text-gov-text-light mt-1">Tasks for existing Certificate of Occupancy review.</p>
        </div>

        {isLoading && <div className="text-center py-8 text-gov-text-light">Loading review tasks...</div>}

        {!isLoading && filteredLandReviewTasks.map((task:any) => (
          <div key={task.id} className="border-b border-gov-border py-3 flex justify-between items-center">
            <div>
              <p className="font-semibold text-primary">{`${task.owner?.fullName || task.owner?.email || ''}`.trim() || task.landCode || task.id}</p>
              <p className="text-xs text-gov-text-light">State: {task.state?.name || '—'}</p>
              <p className="text-xs text-gov-text-light">Land code: {task.landCode || '—'}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`gov-badge ${task.landStatus?.toLowerCase() === 'approved' ? 'gov-badge-success' : 'gov-badge-warning'}`}>{task.landStatus || 'PENDING_REVIEW'}</span>
              <button className="text-primary hover:text-secondary p-2 rounded-gov" title="View" onClick={() => navigate(`/dashboard/cofo/land-review/${task.id}`)}>Review</button>
            </div>
          </div>
        ))}

        {!isLoading && filteredLandReviewTasks.length === 0 && (
          <div className="text-center py-8 text-gov-text-light">No existing CofO review tasks found</div>
        )}
      </div>
    </div>
  );
};

export default CofoApplications;
