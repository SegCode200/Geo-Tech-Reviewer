import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../../store/authSlice";
import {
  getTransferForReview,
  approveOwnershipTransfer,
  rejectOwnershipTransfer,
  approveDocument,
  rejectDocument,
} from "../../../api/dashboardApi";
import { FaArrowLeft, FaCheckCircle, FaTimesCircle, FaFileAlt, FaMapMarkerAlt, FaUser, FaCalendar, FaRuler, FaEye, FaFilePdf, FaFileImage, FaTimes } from "react-icons/fa";

const GovernorTransferView: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [loading, setLoading] = useState(true);
  const [transfer, setTransfer] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [approveComment, setApproveComment] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [rejectComment, setRejectComment] = useState("");
  const [previewDoc, setPreviewDoc] = useState<any>(null);
  const [docActionModal, setDocActionModal] = useState<{ type: "approve" | "reject"; docId: string; docTitle: string } | null>(null);
  const [docRejectMessage, setDocRejectMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await getTransferForReview(id);
        console.log(res)
        setTransfer(res.transfer);
      } catch (err) {
        console.error(err);
        alert("Failed to load transfer");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  if (user?.role?.toLowerCase() !== "governor") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="p-8 bg-white shadow-lg rounded-lg text-center">
          <h2 className="text-xl font-bold text-gray-800">Access Denied</h2>
          <p className="text-gray-600 mt-2">Only governors can access this page.</p>
        </div>
      </div>
    );
  }

  const handleApprove = async () => {
    if (!id) return;
    try {
      setSubmitting(true);
      await approveOwnershipTransfer(id, approveComment || undefined);
      alert("✓ Transfer approved successfully");
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert("Failed to approve transfer");
    } finally {
      setSubmitting(false);
      setShowApproveModal(false);
    }
  };

  const handleReject = async () => {
    if (!id || !rejectReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }
    try {
      setSubmitting(true);
      await rejectOwnershipTransfer(id, rejectReason, rejectComment || undefined);
      alert("✗ Transfer rejected successfully");
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert("Failed to reject transfer");
    } finally {
      setSubmitting(false);
      setShowRejectModal(false);
    }
  };

  const handleApproveDocument = async () => {
    if (!docActionModal) return;
    try {
      setSubmitting(true);
      await approveDocument(docActionModal.docId);
      alert("✓ Document approved successfully");
      setDocActionModal(null);
      // Reload transfer data
      if (id) {
        const res = await getTransferForReview(id);
        setTransfer(res.transfer);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to approve document");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRejectDocument = async () => {
    if (!docActionModal || !docRejectMessage.trim()) {
      alert("Please provide a rejection message");
      return;
    }
    try {
      setSubmitting(true);
      await rejectDocument(docActionModal.docId, docRejectMessage);
      alert("✗ Document rejected successfully");
      setDocActionModal(null);
      setDocRejectMessage("");
      // Reload transfer data
      if (id) {
        const res = await getTransferForReview(id);
        setTransfer(res.transfer);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to reject document");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
        >
          <FaArrowLeft className="w-4 h-4" />
          Back to Transfers
        </button>

        {loading ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="inline-block animate-spin mb-4">
              <FaFileAlt className="w-8 h-8 text-indigo-600" />
            </div>
            <p className="text-gray-600">Loading transfer details...</p>
          </div>
        ) : transfer ? (
          <div className="space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Ownership Transfer Review</h1>
                    <p className="text-indigo-100 text-sm font-mono">{transfer.id}</p>
                  </div>
                  <div className={`px-4 py-2 rounded-full text-white font-semibold text-sm ${
                    transfer.status === "PENDING_GOVERNOR" ? "bg-yellow-500/80" :
                    transfer.status === "APPROVED" ? "bg-green-500/80" :
                    "bg-red-500/80"
                  }`}>
                    {transfer.status?.replace(/_/g, " ") || "Unknown"}
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Land Information */}
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                    <FaMapMarkerAlt className="w-5 h-5 text-indigo-600" />
                    Land Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Address</p>
                      <p className="text-gray-900 font-semibold">{transfer.land?.address || "Not specified"}</p>
                    </div>
                    {transfer.land?.latitude && transfer.land?.longitude && (
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Coordinates</p>
                        <p className="text-gray-900 font-mono text-sm">{transfer.land.latitude}, {transfer.land.longitude}</p>
                      </div>
                    )}
                    {transfer.land?.squareMeters && (
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Size</p>
                        <p className="text-gray-900 font-semibold flex items-center gap-1">
                          <FaRuler className="w-4 h-4" /> {transfer.land.squareMeters}m²
                        </p>
                      </div>
                    )}
                    {transfer.land?.state?.name && (
                      <div>
                        <p className="text-sm text-gray-600 font-medium">State</p>
                        <p className="text-gray-900 font-semibold">{transfer.land.state.name}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Owner Information */}
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                    <FaUser className="w-5 h-5 text-indigo-600" />
                    Transfer Details
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Current Owner</p>
                      <p className="text-gray-900 font-semibold">{transfer.currentOwner?.fullName || "Unknown"}</p>
                      {transfer.currentOwner?.email && (
                        <p className="text-sm text-gray-600">{transfer.currentOwner.email}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">New Owner</p>
                      <p className="text-gray-900 font-semibold">{transfer.newOwnerEmail || transfer.newOwnerPhone || "TBD"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium flex items-center gap-1">
                        <FaCalendar className="w-4 h-4" /> Created
                      </p>
                      <p className="text-gray-900 font-semibold">{new Date(transfer.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Documents Section */}
            {transfer.documents && transfer.documents.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
                  <FaFileAlt className="w-5 h-5 text-indigo-600" />
                  Documents ({transfer.documents.length})
                </h3>
                <div className="space-y-3">
                  {transfer.documents.map((doc: any) => {
                    const isImage = doc.url && (doc.url.includes(".png") || doc.url.includes(".jpg") || doc.url.includes(".jpeg") || doc.url.includes(".gif") || doc.url.includes("/image/"));
                    const isPdf = doc.url && (doc.url.includes(".pdf") || doc.url.includes("/raw/"));
                    const canView = doc.url && (isImage || isPdf);
                    
                    return (
                      <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3 flex-1">
                          {isPdf ? (
                            <FaFilePdf className="w-5 h-5 text-red-500 flex-shrink-0" />
                          ) : isImage ? (
                            <FaFileImage className="w-5 h-5 text-blue-500 flex-shrink-0" />
                          ) : (
                            <FaFileAlt className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{doc.title || "Document"}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-xs text-gray-500 font-mono truncate">{doc.id}</p>
                              {doc.type && (
                                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded whitespace-nowrap">
                                  {doc.type.toUpperCase().replace(/_/g, " ")}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {canView && (
                            <button
                              onClick={() => setPreviewDoc(doc)}
                              className="px-3 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-1"
                            >
                              <FaEye className="w-4 h-4" />
                              View
                            </button>
                          )}
                          {doc.status === "PENDING" && (
                            <>
                              <button
                                onClick={() => setDocActionModal({ type: "approve", docId: doc.id, docTitle: doc.title })}
                                className="px-3 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-1"
                              >
                                <FaCheckCircle className="w-4 h-4" />
                                Approve
                              </button>
                              <button
                                onClick={() => setDocActionModal({ type: "reject", docId: doc.id, docTitle: doc.title })}
                                className="px-3 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-1"
                              >
                                <FaTimesCircle className="w-4 h-4" />
                                Reject
                              </button>
                            </>
                          )}
                          <span className={`px-3 py-2 rounded-lg text-xs font-semibold ${
                            doc.status === "APPROVED" ? "bg-green-100 text-green-700" :
                            doc.status === "REJECTED" ? "bg-red-100 text-red-700" :
                            "bg-gray-100 text-gray-700"
                          }`}>
                            {doc.status || "Pending"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Action Buttons - Only show for pending transfers */}
            {transfer.status === "PENDING_GOVERNOR" && (
              <div className="flex gap-4 sm:flex-row flex-col-reverse">
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <FaTimesCircle className="w-4 h-4" />
                  Reject Transfer
                </button>
                <button
                  onClick={() => setShowApproveModal(true)}
                  className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <FaCheckCircle className="w-4 h-4" />
                  Approve Transfer
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-200">
            <FaFileAlt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Transfer not found</p>
          </div>
        )}
      </div>

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Approve Transfer?</h2>
            <p className="text-gray-600 mb-4">Are you sure you want to approve this ownership transfer?</p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Governor's Comment (Optional)
              </label>
              <textarea
                value={approveComment}
                onChange={(e) => setApproveComment(e.target.value)}
                placeholder="Add any notes or comments..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={3}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowApproveModal(false)}
                disabled={submitting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? "Approving..." : <><FaCheckCircle className="w-4 h-4" /> Approve</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Reject Transfer?</h2>
            <p className="text-gray-600 mb-4">Provide a reason for rejecting this transfer.</p>
            <div className="mb-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Explain why you are rejecting this transfer..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Comment (Optional)
                </label>
                <textarea
                  value={rejectComment}
                  onChange={(e) => setRejectComment(e.target.value)}
                  placeholder="Any additional notes..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows={2}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                disabled={submitting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={submitting || !rejectReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? "Rejecting..." : <><FaTimesCircle className="w-4 h-4" /> Reject</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Action Modal */}
      {docActionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            {docActionModal.type === "approve" ? (
              <>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Approve Document?</h2>
                <p className="text-gray-600 mb-4">
                  Are you sure you want to approve <strong>{docActionModal.docTitle}</strong>?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDocActionModal(null)}
                    disabled={submitting}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApproveDocument}
                    disabled={submitting}
                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting ? "Approving..." : <><FaCheckCircle className="w-4 h-4" /> Approve</>}
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Reject Document?</h2>
                <p className="text-gray-600 mb-4">
                  Provide a message for rejecting <strong>{docActionModal.docTitle}</strong>.
                </p>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rejection Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={docRejectMessage}
                    onChange={(e) => setDocRejectMessage(e.target.value)}
                    placeholder="Explain why this document is being rejected..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    rows={3}
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setDocActionModal(null);
                      setDocRejectMessage("");
                    }}
                    disabled={submitting}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRejectDocument}
                    disabled={submitting || !docRejectMessage.trim()}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting ? "Rejecting..." : <><FaTimesCircle className="w-4 h-4" /> Reject</>}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {previewDoc && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{previewDoc.title || "Document"}</h2>
                <p className="text-sm text-gray-600 mt-1">{previewDoc.type?.toUpperCase().replace(/_/g, " ")} • {new Date(previewDoc.createdAt).toLocaleDateString()}</p>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 bg-gray-50 min-h-96 flex items-center justify-center">
              {previewDoc.url?.includes(".pdf") || previewDoc.url?.includes("/raw/") ? (
                <iframe
                  src={previewDoc.url}
                  className="w-full h-[70vh] border border-gray-300 rounded-lg"
                  title={previewDoc.title}
                />
              ) : previewDoc.url && (previewDoc.url.includes(".png") || previewDoc.url.includes(".jpg") || previewDoc.url.includes(".jpeg") || previewDoc.url.includes(".gif") || previewDoc.url.includes("/image/")) ? (
                <img
                  src={previewDoc.url}
                  alt={previewDoc.title}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-md"
                />
              ) : (
                <div className="text-center">
                  <FaFileAlt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Document type not supported for preview</p>
                  {previewDoc.url && (
                    <a
                      href={previewDoc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Download Document
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GovernorTransferView;