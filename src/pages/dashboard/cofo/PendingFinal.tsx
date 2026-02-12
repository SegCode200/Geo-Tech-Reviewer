import { FaClock } from "react-icons/fa";
import { useReviewerApplications } from "../../../hooks/useDashboard";
import { useNavigate } from "react-router-dom";

const PendingFinal = () => {
  const { applications, isLoading } = useReviewerApplications();
  const navigate = useNavigate();

  console.log(applications)

  const pending = applications.filter(a => {
    const s = (a.status || '').toLowerCase();
    return s.includes('in_review') || s.includes('resubmitted') || s.includes('needs_correction');
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <FaClock className="w-5 h-5 text-primary" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gov-text">Pending Final Approval</h1>
        </div>
        <p className="text-xs sm:text-base text-gov-text-light mt-1 sm:mt-2">Applications waiting for Governor's final sign-off</p>
      </div>

      <div className="gov-card p-4 sm:p-6">
        <div className="space-y-3">
          {isLoading && <div className="text-center py-8 text-gov-text-light">Loading...</div>}

          {!isLoading && pending.map(p => (
            <div key={p.id} className="flex justify-between items-center border-b border-gov-border py-3 cursor-pointer" onClick={() => navigate(`/dashboard/approvals/${p.id}`)}>
              <div>
                <p className="font-semibold text-primary">{`${p.user?.firstName || ''} ${p.user?.lastName || ''}`.trim() || p.id}</p>
                <p className="text-xs text-gov-text-light">Submitted: {new Date(p.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="gov-badge gov-badge-warning">Awaiting</span>
                <button className="gov-button" onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/approvals/${p.id}`); }}>View</button>
              </div>
            </div>
          ))}

          {!isLoading && pending.length === 0 && <div className="text-center py-8 text-gov-text-light">No pending final approvals</div>}
        </div>
      </div>
    </div>
  );
};

export default PendingFinal;
