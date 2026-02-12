import  { useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/authSlice";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaDownload,
  FaFileAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaUser,
  FaMapMarkerAlt,
  FaEye,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { useCofOForReview } from "../../hooks/useApprovals";
import DocumentViewer from "../../components/DocumentViewer";
import { submitApprovalDecision, updateCofODocumentStatus } from "../../api/approvalsApi";
import { CofODocument } from "../../api/approvalsApi"; // for typing




const ApprovalReview = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { application, isLoading, error, mutate } = useCofOForReview(id || null);
  const user = useSelector(selectUser);
  const [activeTab, setActiveTab] = useState<"details" | "documents" | "history">("details");
  const [notes, setNotes] = useState("");
  const [plotNumber, setPlotNumber] = useState("");
  const [selectedDocument, setSelectedDocument] = useState<{ name: string; url: string; type: string } | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isApprovingLoading, setIsApprovingLoading] = useState(false);
  const [isRejectingLoading, setIsRejectingLoading] = useState(false);
  const [isSendingBackLoading, setIsSendingBackLoading] = useState(false);
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  const [docActionLoading, setDocActionLoading] = useState<Record<string, {approve?: boolean; reject?: boolean}>>({});

  console.log()

  const handleApproveDocument = async (doc: CofODocument) => {
    console.log(doc)
    setDocActionLoading(prev => ({ ...prev, [doc.id]: { ...prev[doc.id], approve: true } }));
    try {
      await updateCofODocumentStatus(doc.id, "APPROVED");
      Swal.fire({ icon: "success", title: "Document Approved", text: `${doc.title} has been approved.` });
      await mutate?.();
    } catch (error) {
      console.error(error);
      Swal.fire({ icon: "error", title: "Error", text: "Error approving document. Please try again." });
    } finally {
      setDocActionLoading(prev => ({ ...prev, [doc.id]: { ...prev[doc.id], approve: false } }));
    }
  };

  const handleRejectDocument = (doc: CofODocument) => {
    Swal.fire({
      title: `Reject ${doc.title}?`,
      input: "textarea",
      inputPlaceholder: "Enter reason for rejecting this document...",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#10B981",
      confirmButtonText: "Yes, Reject",
      inputAttributes: {
        "aria-label": "Rejection reason",
      },
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        setDocActionLoading(prev => ({ ...prev, [doc.id]: { ...prev[doc.id], reject: true } }));
        try {
          console.log(result.value)
          await updateCofODocumentStatus(doc.id, "REJECTED", result.value);
          
          // If any document is rejected, take the application as Send Back
          Swal.fire({ icon: "success", title: "Document Rejected", text: `${doc.title} has been rejected and application sent back.` }).then(() => navigate(-1));
        } catch (error) {
          console.error(error);
          Swal.fire({ icon: "error", title: "Error", text: "Error rejecting document. Please try again." });
        } finally {
          setDocActionLoading(prev => ({ ...prev, [doc.id]: { ...prev[doc.id], reject: false } }));
        }
      }
    });
  };

  const anyRejected = application?.cofODocuments?.some((d: any) => (d.status || "PENDING") === "REJECTED");
  const anyPending = application?.cofODocuments?.some((d: any) => {
    const s = d.status || "PENDING";
    return s !== "APPROVED" && s !== "REJECTED";
  });

  const handleApprove = async () => {
    if (anyRejected) {
      Swal.fire({ icon: "error", title: "Cannot Approve", text: "One or more documents have been rejected. Please resolve before approving." });
      return;
    }

    if (anyPending) {
      const confirm = await Swal.fire({
        title: "Some documents are still pending",
        text: "Do you want to proceed to approve the application anyway?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, Approve",
      });

      if (!confirm.isConfirmed) return;
    }

    setIsApprovingLoading(true);
    try {
      // If current user is governor require plotNumber
      if (user?.role?.toLowerCase() === "governor") {
        if (!plotNumber || !plotNumber.trim()) {
          Swal.fire({ icon: "error", title: "Missing Plot Number", text: "Please provide the plot number before approving." });
          setIsApprovingLoading(false);
          return;
        }
        await submitApprovalDecision(id!, { action: "APPROVE", message: notes, plotNumber: plotNumber.trim() });
      } else {
        await submitApprovalDecision(id!, { action: "APPROVE", message: notes });
      }
      Swal.fire({ icon: "success", title: "Approved!", text: "Application has been approved." }).then(() => {
        navigate(-1);
      });
    } catch (error) {
      console.log(error);
      Swal.fire({ icon: "error", title: "Error", text: "There was an error approving the application. Please try again." });
    } finally {
      setIsApprovingLoading(false);
    }
  };

  const handleReject = () => {
    Swal.fire({
      title: "Reject Application?",
      input: "textarea",
      inputPlaceholder: "Enter reason for rejection...",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#10B981",
      confirmButtonText: "Yes, Reject",
      inputAttributes: {
        "aria-label": "Rejection reason",
      },
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        setIsRejectingLoading(true);
        try {
          await submitApprovalDecision(id!, { action: "REJECT", message: result.value });
          Swal.fire({
            icon: "success",
            title: "Rejected!",
            text: "Application has been rejected.",
          }).then(() => {
            navigate(-1);
          });
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "There was an error rejecting the application. Please try again.",
          });
        } finally {
          setIsRejectingLoading(false);
        }
      }
    });
  };

  const handleSendBackForCorrection = () => {
    Swal.fire({
      title: "Send Back for Correction?",
      input: "textarea",
      inputPlaceholder: "Enter what needs to be corrected...",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#F59E0B",
      cancelButtonColor: "#10B981",
      confirmButtonText: "Yes, Send Back",
      inputAttributes: {
        "aria-label": "Correction details",
      },
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        setIsSendingBackLoading(true);
        try {
          await submitApprovalDecision(id!, { action: "REJECT", message: result.value });
          Swal.fire({
            icon: "success",
            title: "Sent Back!",
            text: "Application has been sent back for corrections.",
          }).then(() => {
            navigate(-1);
          });
        } catch (error) {

          console.log(error)
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "There was an error sending back the application. Please try again.",
          });
        } finally {
          setIsSendingBackLoading(false);
        }
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gov-text-light">Loading application details...</p>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="gov-card p-8 text-center">
        <p className="text-red-600">Error loading application. Please try again.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-gov hover:bg-primary/90 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      "IN_REVIEW": "bg-yellow-50 border-yellow-200 text-yellow-800",
      "APPROVED": "bg-green-50 border-green-200 text-green-800",
      "REJECTED_FINAL": "bg-red-50 border-red-200 text-red-800",
      "NEEDS_CORRECTION": "bg-orange-50 border-orange-200 text-orange-800",
    };
    return colors[status] || "bg-gray-50 border-gray-200 text-gray-800";
  };

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
        >
          <FaArrowLeft className="w-5 h-5" />
          <span>Back to Applications</span>
        </button>
        <span className={`px-4 py-2 rounded-gov border ${getStatusColor(application.status)}`}>
          {application.status.replace(/_/g, " ")}
        </span>
      </div>

      {/* Applicant Info Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details - 2 columns on large screens */}
        <div className="lg:col-span-2 space-y-6">
          {/* Applicant Information */}
          <div className="gov-card p-6 space-y-4">
            <h2 className="text-xl font-bold text-gov-text">Applicant Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gov-text-light mb-1 flex items-center gap-2">
                  <FaUser className="w-4 h-4" /> Full Name
                </p>
                <p className="font-semibold text-gov-text">
                  {application.user?.fullName} 
                </p>
              </div>
              <div>
                <p className="text-sm text-gov-text-light mb-1">Email Address</p>
                <p className="font-semibold text-gov-text">{application.user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gov-text-light mb-1 flex items-center gap-2">
                  <FaMapMarkerAlt className="w-4 h-4" /> State
                </p>
                <p className="font-semibold text-gov-text">{application.land?.state?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gov-text-light mb-1">Application Number</p>
                <p className="font-semibold text-gov-text font-mono text-sm">{application.applicationNumber}</p>
              </div>
            </div>
          </div>

          {/* Land Information */}
          <div className="gov-card p-6 space-y-4">
            <h2 className="text-xl font-bold text-gov-text">Land Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gov-text-light mb-1">Land Address</p>
                <p className="font-semibold text-gov-text">{application.land.address}</p>
              </div>
              {/* <div>
                <p className="text-sm text-gov-text-light mb-1">Area</p>
                <p className="font-semibold text-gov-text">{application.land?.area}</p>
              </div> */}
            </div>
          </div>

          {/* Tabs Section */}
          <div className="gov-card">
            {/* Tab Navigation */}
            <div className="border-b border-gov-border">
              <div className="flex gap-0">
                {["details", "documents", "history"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as typeof activeTab)}
                    className={`px-4 py-3 font-medium transition-colors border-b-2 ${
                      activeTab === tab
                        ? "border-primary text-primary"
                        : "border-transparent text-gov-text-light hover:text-gov-text"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "details" && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gov-text mb-2">Application Details</h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="text-gov-text-light">Created:</span>{" "}
                        <span className="font-semibold">
                          {new Date(application.createdAt).toLocaleDateString()}
                        </span>
                      </p>
                      {/* <p>
                        <span className="text-gov-text-light">Updated:</span>{" "}
                        <span className="font-semibold">
                          {new Date(application.updatedAt).toLocaleDateString()}
                        </span>
                      </p> */}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "documents" && (
                <div className="space-y-4">
                  {application.cofODocuments && application.cofODocuments.length > 0 ? (
                    <div className="space-y-3">
                      {application.cofODocuments.map((doc, index) => (
                        <div
                          key={index}
                          className="border border-gov-border rounded-gov p-3 sm:p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <FaFileAlt className="w-5 h-5 text-primary flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="font-semibold text-sm text-gov-text truncate">{doc.name}</p>
                              <p className="text-xs text-gov-text-light">{doc.type}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                            <button
                              onClick={() => {
                                setSelectedDocument(doc);
                                setIsViewerOpen(true);
                              }}
                              className="p-2 text-primary hover:bg-primary/10 rounded-gov transition-colors"
                              title="View document"
                            >
                              <FaEye className="w-4 h-4" />
                            </button>
                            <a
                              href={doc.url}
                              download={doc.name}
                              className="p-2 text-primary hover:bg-primary/10 rounded-gov transition-colors"
                              title="Download document"
                            >
                              <FaDownload className="w-4 h-4" />
                            </a>

                            <button
                              onClick={() => handleApproveDocument(doc)}
                              disabled={!!docActionLoading[doc.id]?.approve}
                              className="p-2 text-green-600 hover:bg-green-100 rounded-gov transition-colors"
                              title="Approve document"
                            >
                              {docActionLoading[doc.id]?.approve ? <span className="animate-spin">⏳</span> : <FaCheckCircle className="w-4 h-4" />}
                            </button>

                            <button
                              onClick={() => handleRejectDocument(doc)}
                              disabled={!!docActionLoading[doc.id]?.reject}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-gov transition-colors"
                              title="Reject document"
                            >
                              {docActionLoading[doc.id]?.reject ? <span className="animate-spin">⏳</span> : <FaTimesCircle className="w-4 h-4" />}
                            </button>

                            <span className={`px-2 py-1 text-xs font-medium rounded ${
                              (doc.status || "PENDING") === "APPROVED"
                                ? "bg-green-50 text-green-800"
                                : (doc.status || "PENDING") === "REJECTED"
                                ? "bg-red-50 text-red-800"
                                : "bg-yellow-50 text-yellow-800"
                            }`}>
                              {(doc.status || "PENDING").replace(/_/g, " ")}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gov-text-light text-sm">No documents uploaded</p>
                  )}
                </div>
              )}

              {activeTab === "history" && (
                <div className="space-y-3">
                  {application.approvalAudits && application.approvalAudits.length > 0 ? (
                    application.approvalAudits.map((audit, index) => (
                      <div key={index} className="border-l-4 border-primary pl-4 py-2">
                        <p className="font-semibold text-sm text-gov-text">{audit.status}</p>
                        <p className="text-xs text-gov-text-light">
                          {new Date(audit.createdAt).toLocaleString()}
                        </p>
                        {audit.comment && <p className="text-sm mt-1 text-gov-text">{audit.comment}</p>}
                      </div>
                    ))
                  ) : (
                    <p className="text-gov-text-light text-sm">No audit history available</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Notes Section */}
          <div className="gov-card p-6 space-y-4">
            <h2 className="text-xl font-bold text-gov-text">Review Notes</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add your review notes here..."
              className="w-full px-4 py-3 border border-gov-border rounded-gov focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows={6}
            />
            <button
              onClick={async () => {
                if (notes.trim()) {
                  setIsSavingNotes(true);
                  try {
                    await new Promise(resolve => setTimeout(resolve, 500));
                    Swal.fire({
                      icon: "success",
                      title: "Notes Saved!",
                      text: "Your review notes have been saved.",
                    });
                  } finally {
                    setIsSavingNotes(false);
                  }
                }
              }}
              disabled={isSavingNotes}
              className="px-4 py-2 bg-primary text-white rounded-gov hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSavingNotes ? "Saving..." : "Save Notes"}
            </button>
          </div>
        </div>

        {/* Sidebar - Action Buttons on large screens, stacked on mobile */}
        <div className="lg:col-span-1">
          <div className="gov-card p-6 space-y-3 sticky top-4">
            <h2 className="text-lg font-bold text-gov-text mb-4">Actions</h2>
            {user?.role?.toLowerCase() === "governor" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gov-text-light mb-2">Plot Number</label>
                <input
                  value={plotNumber}
                  onChange={(e) => setPlotNumber(e.target.value)}
                  placeholder="Enter plot number"
                  className="w-full px-3 py-2 border border-gov-border rounded-gov focus:outline-none"
                />
              </div>
            )}
            <button
              onClick={handleApprove}
              disabled={isApprovingLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-gov transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isApprovingLoading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Approving...
                </>
              ) : (
                <>
                  <FaCheckCircle className="w-5 h-5" />
                  Approve
                </>
              )}
            </button>

            <button
              onClick={handleSendBackForCorrection}
              disabled={isSendingBackLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-gov transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSendingBackLoading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Sending...
                </>
              ) : (
                <>
                  <FaClock className="w-5 h-5" />
                  Send Back
                </>
              )}
            </button>

            <button
              onClick={handleReject}
              disabled={isRejectingLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-gov transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRejectingLoading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Rejecting...
                </>
              ) : (
                <>
                  <FaTimesCircle className="w-5 h-5" />
                  Reject
                </>
              )}
            </button>

            {/* Status Info */}
            <div className="mt-6 pt-6 border-t border-gov-border space-y-3">
              <div className="text-center">
                <p className="text-sm text-gov-text-light mb-1">Current Status</p>
                <p className="font-bold text-gov-text">{application.status.replace(/_/g, " ")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Document Viewer Modal */}
      {selectedDocument && (
        <DocumentViewer
          document={selectedDocument}
          isOpen={isViewerOpen}
          onClose={() => {
            setIsViewerOpen(false);
            setSelectedDocument(null);
          }}
        />
      )}
    </div>
  );
};

export default ApprovalReview;