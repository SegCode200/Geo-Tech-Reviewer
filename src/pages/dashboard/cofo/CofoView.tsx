import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaEye } from "react-icons/fa";
import { useGovernorCofO } from "../../../hooks/useDashboard";

const CofoView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cofo, isLoading, error } = useGovernorCofO(id ?? null);


    ;

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      APPROVED: "gov-badge-success",
      REJECTED: "gov-badge-error",
      IN_REVIEW: "gov-badge-warning",
      NEEDS_CORRECTION: "gov-badge-warning",
      DRAFT: "gov-badge-secondary",
    };
    return colors[status] || "gov-badge-secondary";
  };

  const getDocumentTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      SURVEY_PLAN: "bg-blue-100 text-blue-800",
      DEED_OF_ASSIGNMENT: "bg-purple-100 text-purple-800",
      PURCHASE_RECEIPT: "bg-green-100 text-green-800",
      LAND_AGREEMENT: "bg-yellow-100 text-yellow-800",
      PASSPORT_PHOTO: "bg-pink-100 text-pink-800",
      MEANS_OF_ID: "bg-indigo-100 text-indigo-800",
      TAX_CLEARANCE: "bg-cyan-100 text-cyan-800",
      SITE_PLAN: "bg-orange-100 text-orange-800",
      APPLICATION_LETTER: "bg-gray-100 text-gray-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="gov-button gov-button-ghost flex items-center gap-2">
          <FaArrowLeft /> Back
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-gov-text">Certificate of Occupancy</h1>
      </div>

      {/* Loading & Error */}
      {isLoading && <div className="gov-card p-6 text-center">Loading CofO details...</div>}
      {error && <div className="gov-card p-6 bg-red-50 border border-red-200 text-red-700">Failed to load CofO details</div>}

      {!isLoading && cofo && (
        <div className="space-y-4">
          {/* Application Info Card */}
          <div className="gov-card p-4 sm:p-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gov-text-light">Application Number</p>
                <h2 className="text-lg font-semibold text-primary">{cofo.applicationNumber ?? cofo.id}</h2>
              </div>
              <div>
                <p className="text-sm text-gov-text-light">Status</p>
                <span className={`gov-badge ${getStatusColor(cofo.status)}`}>{cofo.status}</span>
              </div>
              <div>
                <p className="text-sm text-gov-text-light">Applied On</p>
                <p className="font-medium">{new Date(cofo.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gov-text-light">Revisions</p>
                <p className="font-medium">{cofo.revisionCount ?? 0}</p>
              </div>
            </div>
          </div>

          {/* Applicant Info */}
          <div className="gov-card p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gov-text mb-4 border-b border-gov-border pb-2">Applicant Information</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gov-text-light">Name</p>
                <p className="font-medium">{cofo.user?.fullName ?? `${cofo.user?.firstName} ${cofo.user?.lastName}`}</p>
              </div>
              <div>
                <p className="text-sm text-gov-text-light">Email</p>
                <p className="font-medium text-sm">{cofo.user?.email}</p>
              </div>
            </div>
          </div>

          {/* Land Info */}
          <div className="gov-card p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gov-text mb-4 border-b border-gov-border pb-2">Land Information</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gov-text-light">Address</p>
                <p className="font-medium">{cofo.land?.address}</p>
              </div>
              <div>
                <p className="text-sm text-gov-text-light">State</p>
                <p className="font-medium">{cofo.land?.state?.name ?? "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Current Reviewer */}
          {cofo.currentReviewer && (
            <div className="gov-card p-4 sm:p-6 bg-blue-50 border-l-4 border-blue-500">
              <h3 className="text-lg font-semibold text-gov-text mb-3">Current Reviewer</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gov-text-light">Name</p>
                  <p className="font-medium">{cofo.currentReviewer.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gov-text-light">Role</p>
                  <p className="font-medium">{cofo.currentReviewer.role}</p>
                </div>
                <div>
                  <p className="text-sm text-gov-text-light">Department</p>
                  <p className="font-medium">{cofo.currentReviewer.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gov-text-light">Email</p>
                  <p className="font-medium text-sm">{cofo.currentReviewer.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Documents */}
          <div className="gov-card p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gov-text mb-4 border-b border-gov-border pb-2">Documents ({cofo.cofODocuments?.length ?? 0})</h3>
            {cofo.cofODocuments && cofo.cofODocuments.length > 0 ? (
              <div className="grid gap-3">
                {cofo.cofODocuments.map((d: any) => (
                  <div key={d.id} className="flex items-center justify-between border border-gov-border rounded-lg p-3 hover:bg-gov-bg-light transition">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded text-xs font-semibold ${getDocumentTypeColor(d.type)}`}>{d.type}</span>
                        <div>
                          <p className="font-medium">{d.title ?? d.name}</p>
                          <p className="text-xs text-gov-text-light">Status: {d.status || "Pending"}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={d.url}
                        target="_blank"
                        rel="noreferrer"
                        className="gov-button gov-button-sm flex items-center gap-1"
                      >
                        <FaEye className="w-4 h-4" /> View
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gov-text-light">No documents attached</div>
            )}
          </div>

          {/* Processing Logs */}
          {cofo.logs && cofo.logs.length > 0 && (
            <div className="gov-card p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gov-text mb-4 border-b border-gov-border pb-2">Processing History</h3>
              <div className="space-y-3">
                {cofo.logs.map((log: any, idx: number) => (
                  <div key={log.id} className="flex items-start gap-3 pb-3 border-b border-gov-border last:border-0">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                      log.status === "APPROVED" ? "bg-green-500" : log.status === "REJECTED" ? "bg-red-500" : "bg-blue-500"
                    }`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">
                        Stage {log.stageNumber} - <span className={log.status === "APPROVED" ? "text-green-600" : log.status === "REJECTED" ? "text-red-600" : "text-blue-600"}>{log.status}</span>
                      </p>
                      <p className="text-xs text-gov-text-light">{new Date(log.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CofoView;
