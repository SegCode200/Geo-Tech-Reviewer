import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaFileAlt,

  FaHistory,
} from "react-icons/fa";
import { useLandForReview } from "../../../hooks/useApprovals";
import { submitLandReviewDecision } from "../../../api/approvalsApi";
import Alert from "../../../components/Alert";

const LandReview = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { land, isLoading, error } = useLandForReview(id || null);
  const [notes, setNotes] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      await submitLandReviewDecision(id!, { action: "APPROVE", message: notes || undefined });
      Alert.success("Approved", "Land review has been approved.").then(() => navigate(-1));
    } catch (err) {
      console.error(err);
      Alert.error("Error", "There was an error approving the land review. Please try again.");
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    const reason = await Alert.prompt({
      title: "Reject Land Review?",
      text: "Enter the reason for rejecting this land review.",
      inputPlaceholder: "Enter rejection reason...",
      inputType: "textarea",
      confirmButtonText: "Reject",
      cancelButtonText: "Cancel",
      type: "warning",
    });

    if (!reason) {
      return;
    }

    setIsRejecting(true);
    try {
      await submitLandReviewDecision(id!, { action: "REJECT", message: reason });
      Alert.success("Rejected", "Land review has been rejected.").then(() => navigate(-1));
    } catch (err) {
      console.error(err);
      Alert.error("Error", "There was an error rejecting the land review. Please try again.");
    } finally {
      setIsRejecting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gov-text-light">Loading land review details...</p>
        </div>
      </div>
    );
  }

  if (error || !land) {
    return (
      <div className="gov-card p-8 text-center">
        <p className="text-red-600">Error loading land review task. Please try again.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-gov hover:bg-primary/90 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
        >
          <FaArrowLeft className="w-4 h-4" />
          <span>Back to Review Tasks</span>
        </button>
        <span className="gov-badge gov-badge-warning">{land.landStatus || "PENDING_REVIEW"}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="gov-card p-6 space-y-4">
            <h2 className="text-xl font-bold text-gov-text">Land Review Task</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gov-text-light mb-1">Land Code</p>
                <p className="font-semibold text-gov-text">{land.landCode || land.id}</p>
              </div>
              <div>
                <p className="text-sm text-gov-text-light mb-1">State</p>
                <p className="font-semibold text-gov-text">{land.state?.name || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gov-text-light mb-1">Owner</p>
                <p className="font-semibold text-gov-text">{land.owner?.fullName || land.ownerName || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gov-text-light mb-1">Owner Email</p>
                <p className="font-semibold text-gov-text">{land.owner?.email || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gov-text-light mb-1">Address</p>
                <p className="font-semibold text-gov-text">{land.address || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gov-text-light mb-1">Area (sqm)</p>
                <p className="font-semibold text-gov-text">{land.areaSqm?.toLocaleString() || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gov-text-light mb-1">Purpose</p>
                <p className="font-semibold text-gov-text">{land.purpose || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gov-text-light mb-1">Ownership Type</p>
                <p className="font-semibold text-gov-text">{land.ownershipType || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gov-text-light mb-1">Title Type</p>
                <p className="font-semibold text-gov-text">{land.titleType || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gov-text-light mb-1">Accuracy Level</p>
                <p className="font-semibold text-gov-text">{land.accuracyLevel || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gov-text-light mb-1">Has Existing C of O</p>
                <p className="font-semibold text-gov-text">{land.hasExistingCofO ? "Yes" : "No"}</p>
              </div>
              {land.hasExistingCofO && (
                <>
                  <div>
                    <p className="text-sm text-gov-text-light mb-1">C of O Number</p>
                    <p className="font-semibold text-gov-text">{land.existingCofONumber || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gov-text-light mb-1">C of O Issue Date</p>
                    <p className="font-semibold text-gov-text">{land.existingCofOIssueDate ? new Date(land.existingCofOIssueDate).toLocaleDateString() : "—"}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="gov-card p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gov-text">Survey Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gov-text-light mb-1">Survey Plan Number</p>
                <p className="font-semibold text-gov-text">{land.surveyPlanNumber || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gov-text-light mb-1">Survey Date</p>
                <p className="font-semibold text-gov-text">{land.surveyDate ? new Date(land.surveyDate).toLocaleDateString() : "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gov-text-light mb-1">Surveyor Name</p>
                <p className="font-semibold text-gov-text">{land.surveyorName || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gov-text-light mb-1">Surveyor Address</p>
                <p className="font-semibold text-gov-text">{land.surveyorAddress || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gov-text-light mb-1">Survey Telephone</p>
                <p className="font-semibold text-gov-text">{land.surveyTelephone || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gov-text-light mb-1">Survey Type</p>
                <p className="font-semibold text-gov-text">{land.surveyType || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gov-text-light mb-1">UTM Zone</p>
                <p className="font-semibold text-gov-text">{land.utmZone || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-gov-text-light mb-1">Center Coordinates</p>
                <p className="font-semibold text-gov-text">{land.centerLat && land.centerLng ? `${land.centerLat.toFixed(6)}, ${land.centerLng.toFixed(6)}` : "—"}</p>
              </div>
            </div>
            {land.surveyNotes && (
              <div>
                <p className="text-sm text-gov-text-light mb-1">Survey Notes</p>
                <p className="font-semibold text-gov-text">{land.surveyNotes}</p>
              </div>
            )}
          </div>

          {land.bearings && land.bearings.length > 0 && (
            <div className="gov-card p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gov-text">Bearings</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {land.bearings.map((bearing, index) => (
                  <div key={index} className="border border-gov-border rounded-gov p-3">
                    <p className="text-sm text-gov-text-light mb-1">Bearing {index + 1}</p>
                    <p className="font-semibold text-gov-text">{bearing.bearing}°</p>
                    <p className="text-sm text-gov-text-light">{bearing.distance}m</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {land.latlngCoordinates && land.latlngCoordinates.length > 0 && (
            <div className="gov-card p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gov-text">Lat/Lng Coordinates</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gov-border">
                      <th className="text-left py-2 text-gov-text-light">Point</th>
                      <th className="text-left py-2 text-gov-text-light">Latitude</th>
                      <th className="text-left py-2 text-gov-text-light">Longitude</th>
                    </tr>
                  </thead>
                  <tbody>
                    {land.latlngCoordinates.map((coord, index) => (
                      <tr key={index} className="border-b border-gov-border/50">
                        <td className="py-2 font-semibold text-gov-text">{index + 1}</td>
                        <td className="py-2 text-gov-text">{coord[0].toFixed(6)}</td>
                        <td className="py-2 text-gov-text">{coord[1].toFixed(6)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {land.utmCoordinates && land.utmCoordinates.length > 0 && (
            <div className="gov-card p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gov-text">UTM Coordinates</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gov-border">
                      <th className="text-left py-2 text-gov-text-light">Point</th>
                      <th className="text-left py-2 text-gov-text-light">Easting</th>
                      <th className="text-left py-2 text-gov-text-light">Northing</th>
                    </tr>
                  </thead>
                  <tbody>
                    {land.utmCoordinates.map((coord, index) => (
                      <tr key={index} className="border-b border-gov-border/50">
                        <td className="py-2 font-semibold text-gov-text">{index + 1}</td>
                        <td className="py-2 text-gov-text">{coord[0].toFixed(3)}</td>
                        <td className="py-2 text-gov-text">{coord[1].toFixed(3)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="gov-card p-6 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-lg font-semibold text-gov-text">Review Notes</h3>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add a note for approval (optional)"
              className="gov-input min-h-[120px] w-full"
            />
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleApprove}
                disabled={isApproving || isRejecting}
                className="gov-button gov-button-primary"
              >
                {isApproving ? "Approving..." : "Approve"}
              </button>
              <button
                onClick={handleReject}
                disabled={isApproving || isRejecting}
                className="gov-button gov-button-secondary"
              >
                {isRejecting ? "Rejecting..." : "Reject"}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="gov-card p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gov-text">Documents</h3>
            {land.documents && land.documents.length > 0 ? (
              <div className="space-y-3">
                {land.documents.map((doc) => (
                  <a
                    key={doc.id}
                    href={doc.documentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between gap-3 border border-gov-border rounded-gov p-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FaFileAlt className="w-4 h-4 text-primary" />
                      <div>
                        <p className="font-semibold text-sm text-gov-text">{doc.fileName}</p>
                        <p className="text-xs text-gov-text-light">{new Date(doc.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className="text-sm text-primary">Open</span>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-gov-text-light">No supporting documents available.</p>
            )}
          </div>

          <div className="gov-card p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gov-text">Review History</h3>
            {land.reviewLogs && land.reviewLogs.length > 0 ? (
              <div className="space-y-3">
                {land.reviewLogs.map((log: any) => (
                  <div key={log.id} className="border border-gov-border rounded-gov p-3">
                    <div className="flex items-center gap-2 text-sm text-gov-text-light mb-2">
                      <FaHistory className="w-4 h-4" />
                      <span>{new Date(log.arrivedAt).toLocaleString()}</span>
                    </div>
                    <p className="font-semibold text-gov-text">{log.status}</p>
                    {log.message && <p className="text-sm text-gov-text-light mt-1">{log.message}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gov-text-light">No review history yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandReview;
