import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FaArrowLeft,
  FaFileContract,
  FaUser,
  FaCheckCircle,
  FaTimesCircle,
  FaMap,
  FaLayerGroup,
  FaInfoCircle,
} from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { selectUser } from '../../store/authSlice';
import { useTransferForReview } from '../../hooks/useTransfers';
import { reviewTransfer, approveDocument, rejectDocument } from '../../api/transferApi';

const parseDocumentUrl = (url: string) => {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed.startsWith('{') && !trimmed.startsWith('[')) return null;
  try {
    return JSON.parse(trimmed);
  } catch {
    return null;
  }
};

const renderSurveyUrl = (data: any) => {
  if (!data) return null;

  return (
    <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
      <div className="grid grid-cols-2 gap-3 text-sm">
        {data.surveyType && (
          <div>
            <p className="text-gray-500">Survey Type</p>
            <p className="font-medium">{data.surveyType}</p>
          </div>
        )}
        {data.area != null && (
          <div>
            <p className="text-gray-500">Area</p>
            <p className="font-medium">{data.area} sqm</p>
          </div>
        )}
        {data.utmZone && (
          <div>
            <p className="text-gray-500">UTM Zone</p>
            <p className="font-medium">{data.utmZone}</p>
          </div>
        )}
        {data.bearings && (
          <div className="col-span-2">
            <p className="text-gray-500">Bearings</p>
            <p className="font-medium">
              {data.bearings.map((item: any) => `${item.bearing}°/${item.distance}m`).join(', ')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const TransferView = () => {
  const { transferId } = useParams<{ transferId: string }>();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const { transfer, isLoading, error, mutate } = useTransferForReview(transferId || null);
  const [reviewAction, setReviewAction] = useState<'APPROVE' | 'REJECT' | null>(null);
  const [reviewMessage, setReviewMessage] = useState('');
  const [signatureUrl, setSignatureUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  console.log(user)
  const getDocumentStatus = (doc: any) => {

    console.log(doc.reviews?.[0]?.reviewerId, user?.id);
    if (!user) return doc.status || 'PENDING';
    const userReview = doc.reviews?.find((review: any) => review.reviewerId === user.id);

    // console.log(do)
    if (userReview) {
      return userReview.status;
    }
    if (doc.reviews?.length) {
      return 'PENDING';
    }
    return doc.status || 'PENDING';
  };

  const canReviewDocument = (doc: any) => {
    if (!user) return false;
    const userReview = doc.reviews?.find((review: any) => review.reviewerId === user.id);
    if (userReview) return false;
    return doc.status !== 'REJECTED';
  };


  const handleReview = async () => {
    if (!transfer || !reviewAction) return;

    setSubmitting(true);
    try {
      await reviewTransfer({
        transferId: transfer.id,
        action: reviewAction,
        message: reviewMessage,
        signatureUrl: reviewAction === 'APPROVE' ? signatureUrl : undefined,
      });
      mutate();
      navigate('/dashboard/transfers');
    } catch (err) {
      console.error('Review failed:', err);
      alert('Review failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDocumentAction = async (documentId: string, action: 'approve' | 'reject', reason?: string) => {
    try {
      if (action === 'approve') {
        await approveDocument(documentId);
      } else {
        await rejectDocument(documentId, reason || '');
      }
      mutate();
    } catch (err) {
      console.error('Document action failed:', err);
      alert('Action failed. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gov-primary"></div>
      </div>
    );
  }

  if (error || !transfer) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load transfer details. Please try again.</p>
        <button onClick={() => navigate('/dashboard/transfers')} className="mt-4 gov-button">
          Back to Transfers
        </button>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PENDING_GOVERNOR: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
    };
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  const documentUrlData = (doc: any) => parseDocumentUrl(doc.url);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard/transfers')} className="p-2 rounded-lg hover:bg-gray-100 border border-gray-200">
            <FaArrowLeft className="text-gov-text" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gov-text">Transfer Review</h1>
            <p className="text-sm text-gray-500">Review all submitted transfer details before approval.</p>
          </div>
        </div>
        <div className="space-y-1 text-right">
          {transfer.applicationNumber && <p className="text-sm text-gray-600">Application: <span className="font-semibold text-gov-text">{transfer.applicationNumber}</span></p>}
          <p className="text-sm text-gray-600">Created: {new Date(transfer.createdAt).toLocaleString()}</p>
          {transfer.expiresAt && <p className="text-sm text-gray-600">Expires: {new Date(transfer.expiresAt).toLocaleString()}</p>}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="gov-card p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaFileContract />
            Transfer Summary
          </h2>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-gray-500">Status</p>
              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(transfer.status)}`}>
                {transfer.status.replace('_', ' ')}
              </span>
            </div>
            <div>
              <p className="text-gray-500">Transfer Type</p>
              <p className="font-medium">{transfer.transferType}</p>
            </div>
            {transfer.transferAreaSqm != null && (
              <div>
                <p className="text-gray-500">Transfer Area</p>
                <p className="font-medium">{transfer.transferAreaSqm} sqm</p>
              </div>
            )}
            {transfer.transferSurveyType && (
              <div>
                <p className="text-gray-500">Survey Type</p>
                <p className="font-medium">{transfer.transferSurveyType}</p>
              </div>
            )}
            {transfer.transferUtmZone && (
              <div>
                <p className="text-gray-500">UTM Zone</p>
                <p className="font-medium">{transfer.transferUtmZone}</p>
              </div>
            )}
            {transfer.transferBearings?.length ? (
              <div>
                <p className="text-gray-500">Transfer Bearings</p>
                <p className="font-medium">{transfer.transferBearings.map((item) => `${item.bearing}°/${item.distance}m`).join(', ')}</p>
              </div>
            ) : null}
          </div>
        </div>

        <div className="gov-card p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaUser />
            Owners
          </h2>
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-gray-500">Current Owner</p>
              <p className="font-medium">{transfer.currentOwner.fullName}</p>
              <p className="text-gray-500 text-xs">{transfer.currentOwner.email}</p>
              {transfer.currentOwner.phone && <p className="text-gray-500 text-xs">{transfer.currentOwner.phone}</p>}
            </div>
            <div>
              <p className="text-gray-500">New Owner</p>
              <p className="font-medium">{transfer.newOwner?.fullName || 'Not provided'}</p>
              <p className="text-gray-500 text-xs">{transfer.newOwner?.email || transfer.newOwnerEmail || 'No email'}</p>
              {transfer.newOwner?.phone || transfer.newOwnerPhone ? (
                <p className="text-gray-500 text-xs">{transfer.newOwner?.phone || transfer.newOwnerPhone}</p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="gov-card p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaMap />
            Land Details
          </h2>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-gray-500">Land Code</p>
              <p className="font-medium">{transfer.land.landCode}</p>
            </div>
            <div>
              <p className="text-gray-500">Address</p>
              <p className="font-medium">{transfer.land.address}</p>
            </div>
            {transfer.land.areaSqm != null && (
              <div>
                <p className="text-gray-500">Land Area</p>
                <p className="font-medium">{transfer.land.areaSqm} sqm</p>
              </div>
            )}
            {transfer.land.ownershipType && (
              <div>
                <p className="text-gray-500">Ownership Type</p>
                <p className="font-medium">{transfer.land.ownershipType}</p>
              </div>
            )}
            {transfer.land.titleType && (
              <div>
                <p className="text-gray-500">Title Type</p>
                <p className="font-medium capitalize">{transfer.land.titleType}</p>
              </div>
            )}
            {transfer.land.state?.name && (
              <div>
                <p className="text-gray-500">State</p>
                <p className="font-medium">{transfer.land.state.name}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="gov-card p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaLayerGroup />
            Transfer Geometry
          </h2>
          <div className="grid gap-4 text-sm">
            {transfer.transferCenterLat != null && transfer.transferCenterLng != null && (
              <div>
                <p className="text-gray-500">Center Coordinates</p>
                <p className="font-medium">{transfer.transferCenterLat.toFixed(6)}, {transfer.transferCenterLng.toFixed(6)}</p>
              </div>
            )}
            {transfer.transferStartPoint && (
              <div>
                <p className="text-gray-500">Transfer Start Point</p>
                <p className="font-medium">{transfer.transferStartPoint.join(', ')}</p>
              </div>
            )}
            {transfer.transferCoordinates?.length ? (
              <div>
                <p className="text-gray-500">Boundary Coordinates</p>
                <div className="overflow-x-auto text-xs text-gray-700 bg-white border border-gray-200 rounded-lg p-3">
                  {transfer.transferCoordinates.map((coord, idx) => (
                    <p key={idx}>{coord[0].toFixed(6)}, {coord[1].toFixed(6)}</p>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="gov-card p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaInfoCircle />
            Additional Info
          </h2>
          <div className="space-y-3 text-sm">
            {transfer.rejectionReason && (
              <div>
                <p className="text-gray-500">Rejection Reason</p>
                <p className="font-medium">{transfer.rejectionReason}</p>
              </div>
            )}
            {transfer.governorComment && (
              <div>
                <p className="text-gray-500">Governor Comment</p>
                <p className="font-medium">{transfer.governorComment}</p>
              </div>
            )}
            {transfer.stages?.length ? (
              <div>
                <p className="text-gray-500">Current Stage</p>
                <p className="font-medium">{transfer.stages[0]?.status || 'Unknown'}</p>
                <p className="text-xs text-gray-500">Arrived: {new Date(transfer.stages[0]?.arrivedAt || transfer.createdAt).toLocaleString()}</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="gov-card p-4 sm:p-6">
        <h2 className="text-lg font-semibold mb-4">Documents</h2>
        <div className="space-y-3">
          {transfer.documents.map((doc) => {
            const parsedUrl = documentUrlData(doc);
            return (
              <div key={doc.id} className="border rounded-lg p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold">{doc.title}</p>
                    <p className="text-xs text-gray-500">Type: {doc.type}</p>
                    <p className="text-xs text-gray-500">Uploaded: {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : 'Unknown'}</p>
                    {doc.rejectionMessage && <p className="text-xs text-red-600">Rejected: {doc.rejectionMessage}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(getDocumentStatus(doc))}`}>
                      {getDocumentStatus(doc).replace('_', ' ')}
                    </span>
                    {parsedUrl ? (
                      <button className="gov-button text-sm px-3 py-2" type="button">
                        View Data
                      </button>
                    ) : (
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" className="gov-button text-sm px-3 py-2">
                        View
                      </a>
                    )}
                  </div>
                </div>
                {parsedUrl ? (
                  <div className="mt-3">
                    <p className="text-gray-500 text-xs">Document payload</p>
                    {renderSurveyUrl(parsedUrl)}
                  </div>
                ) : null}
                {canReviewDocument(doc) && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      onClick={() => handleDocumentAction(doc.id, 'approve')}
                      className="gov-button text-sm px-3 py-2"
                    >
                      <FaCheckCircle className="mr-2" /> Approve
                    </button>
                    <button
                      onClick={() => {
                        const reason = prompt('Rejection reason:');
                        if (reason) handleDocumentAction(doc.id, 'reject', reason);
                      }}
                      className="gov-button gov-button-danger text-sm px-3 py-2"
                    >
                      <FaTimesCircle className="mr-2" /> Reject
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="gov-card p-4 sm:p-6">
        <h2 className="text-lg font-semibold mb-4">Review Actions</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Action</label>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="action"
                  value="APPROVE"
                  checked={reviewAction === 'APPROVE'}
                  onChange={() => setReviewAction('APPROVE')}
                  className="mr-2"
                />
                Approve
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="action"
                  value="REJECT"
                  checked={reviewAction === 'REJECT'}
                  onChange={() => setReviewAction('REJECT')}
                  className="mr-2"
                />
                Reject
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message (Optional)</label>
            <textarea
              value={reviewMessage}
              onChange={(e) => setReviewMessage(e.target.value)}
              className="gov-input w-full"
              rows={4}
              placeholder="Add a comment..."
            />
          </div>

          {reviewAction === 'APPROVE' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Signature URL (Optional)</label>
              <input
                type="url"
                value={signatureUrl}
                onChange={(e) => setSignatureUrl(e.target.value)}
                className="gov-input w-full"
                placeholder="https://..."
              />
            </div>
          )}

          <button
            onClick={handleReview}
            disabled={!reviewAction || submitting}
            className="gov-button w-full text-sm py-3 disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransferView;