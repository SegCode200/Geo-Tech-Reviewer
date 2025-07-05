import React, { useState } from "react";

const DocumentReview = () => {
  const task = {
    id: "T1",
    name: "John Doe",
    email: "john.doe@example.com",
    currentStep: "Certificate of Occupancy",
    date: "2023-10-01",
    signatureRequired: true,
    documents: [
      {
        name: "Land Title Document",
        url: "https://example.com/document/land-title.pdf",
      },
      {
        name: "C-OF-O Form",
        url: "https://example.com/document/cofo-form.pdf",
      },
    ],
  };
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [signatureName, setSignatureName] = useState("");

  // Handle Approve Action
  const handleApprove = () => {
    if (task.signatureRequired) {
      setShowSignatureModal(true);
    } else {
      alert("Task approved successfully!");
      // Update backend or state here
    }
  };

  // Handle Reject Action
  const handleReject = () => {
    alert("Task rejected successfully!");
    // Update backend or state here
  };

  // Handle Signature Submission
  const handleSubmitSignature = () => {
    if (!signatureName.trim()) {
      alert("Please enter your name for signature.");
      return;
    }
    alert(`Task approved by ${signatureName}.`);
    setShowSignatureModal(false);
    // Update backend or state here
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Review Document - {task.name}
        </h1>
        {/* Document Details */}
        <div className="bg-white shadow overflow-hidden rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-xl font-medium text-gray-900 mb-4">
              Applicant Information
            </h2>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="text-sm text-gray-900">{task.name}</dd>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="text-sm text-gray-900">{task.email}</dd>
              <dt className="text-sm font-medium text-gray-500">Current Step</dt>
              <dd className="text-sm text-gray-900">{task.currentStep}</dd>
              <dt className="text-sm font-medium text-gray-500">Date</dt>
              <dd className="text-sm text-gray-900">{task.date}</dd>
            </dl>
          </div>
        </div>

        {/* Uploaded Documents */}
        <div className="bg-white shadow overflow-hidden rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-xl font-medium text-gray-900 mb-4">
              Uploaded Documents
            </h2>
            <ul className="space-y-4">
              {task.documents.map((doc, index) => (
                <li key={index} className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">{doc.name}</span>
                  <button
                    className="text-sm text-blue-500 hover:text-blue-700"
                    onClick={() => window.open(doc.url, "_blank")}
                  >
                    Preview
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleApprove}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Approve
              </button>
              <button
                onClick={handleReject}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Reject
              </button>
            </div>
          </div>
        </div>

        {/* Signature Modal */}
        {showSignatureModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-medium text-gray-900 mb-4">
                Sign Document
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Please enter your name to sign this document.
              </p>
              <input
                type="text"
                placeholder="Enter your name"
                value={signatureName}
                onChange={(e) => setSignatureName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
              <div className="mt-4 flex justify-end space-x-4">
                <button
                  onClick={() => setShowSignatureModal(false)}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitSignature}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Agree and Sign
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentReview;