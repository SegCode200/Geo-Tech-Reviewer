import { FaCheck } from "react-icons/fa";
import { useGovernorCofOs } from "../../../hooks/useDashboard";
import { useNavigate } from "react-router-dom";

const Approved = () => {
  const navigate = useNavigate();
  // fetch only approved status for governor
  const { cofos, isLoading, meta } = useGovernorCofOs("APPROVED");

  

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <FaCheck className="w-5 h-5 text-primary" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gov-text">Approved CofO</h1>
        </div>
        <p className="text-xs sm:text-base text-gov-text-light mt-1 sm:mt-2">List of granted Certificates of Occupancy {meta?.total ? `(${meta.total})` : ""}</p>
      </div>

      <div className="gov-card p-4 sm:p-6">
        <div className="space-y-3">
          {isLoading && <div className="text-center py-8">Loading...</div>}

          {!isLoading && cofos.map(a => (
            <div key={a.id} className="flex justify-between items-center border-b border-gov-border py-3 last:border-0">
              <div>
                <p className="font-semibold text-primary">{a.applicationNumber ?? a.id}</p>
                <p className="text-sm text-gov-text">{a.user?.fullName ?? `${a.user?.firstName} ${a.user?.lastName}`}</p>
                <p className="text-xs text-gov-text-light">Applied: {new Date(a.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="gov-badge gov-badge-success">Approved</span>
                <button onClick={() => navigate(`/dashboard/cofo/${a.id}`)} className="gov-button">View</button>
              </div>
            </div>
          ))}

          {!isLoading && cofos.length === 0 && <div className="text-center py-8 text-gov-text-light">No approved CofO found</div>}
        </div>
      </div>
    </div>
  );
};

export default Approved;
