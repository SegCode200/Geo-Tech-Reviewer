import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectUser } from "../../store/authSlice";
import { uploadSignature } from "../../api/authApi";

const GovernorSettings = () => {
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Check if user is governor
  if (user?.role?.toLowerCase() !== "governor") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-8">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
            <p className="text-gray-600 mb-6">Only governors can access this page.</p>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Handle Signature File Selection
  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type (image only)
      if (!file.type.startsWith("image/")) {
        setMessage({ type: "error", text: "Please select an image file for signature" });
        return;
      }

      setSignatureFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignaturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload Signature
  const handleUploadSignature = async () => {
    if (!signatureFile) {
      setMessage({ type: "error", text: "Please select a signature file" });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("signature", signatureFile);

      const response = await uploadSignature(formData);

      setMessage({ type: "success", text: response.message });
      setSignatureFile(null);
      setSignaturePreview(null);
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to upload signature",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Governor Signature Upload</h1>

        <div className="bg-white shadow overflow-hidden rounded-lg p-6">
          {/* User Information */}
          <div className="mb-6 pb-6 border-b">
            <h2 className="text-lg font-medium text-gray-900 mb-4">User Information</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="mt-1 text-sm text-gray-900">{user?.name || "N/A"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-sm text-gray-900">{user?.email || "N/A"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <p className="mt-1 text-sm text-gray-900">{user?.role || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Signature Upload Section */}
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Upload Your Signature</h2>
            <p className="text-sm text-gray-600 mb-4">
              Please upload a clear image of your signature. This will be used for document approvals.
            </p>

            {/* Alert Messages */}
            {message && (
              <div
                className={`mb-4 p-4 rounded-md ${
                  message.type === "success"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                <p className="text-sm font-medium">{message.text}</p>
              </div>
            )}

            {/* File Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Signature Image
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                  <div className="flex flex-col items-center justify-center pt-7">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <p className="text-sm text-gray-500">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-400">PNG, JPG up to 10MB</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSignatureUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Signature Preview */}
            {signaturePreview && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Signature Preview
                </label>
                <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                  <img
                    src={signaturePreview}
                    alt="Signature Preview"
                    className="max-h-32 object-contain mx-auto"
                  />
                </div>
              </div>
            )}

            {/* Upload Button */}
            <div className="flex space-x-3">
              <button
                onClick={handleUploadSignature}
                disabled={!signatureFile || loading}
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  loading || !signatureFile
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {loading ? "Uploading..." : "Upload Signature"}
              </button>
              {signatureFile && (
                <button
                  onClick={() => {
                    setSignatureFile(null);
                    setSignaturePreview(null);
                  }}
                  disabled={loading}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GovernorSettings;
