import React, { useState } from "react";
import { FaFileAlt, FaFileImage, FaFilePdf, FaFileWord, FaDownload, FaTimes } from "react-icons/fa";

interface DocumentViewerProps {
  document: {
    name: string;
    url: string;
    type: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ document, isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);

  if (!isOpen) return null;

  const getFileExtension = (url: string) => {
    const lastDot = url.lastIndexOf(".");
    if (lastDot === -1) return "";
    return url.substring(lastDot + 1).toLowerCase();
  };

  const getFileTypeFromMime = (mimeType: string) => {
    const type = mimeType.toLowerCase();
    if (type.includes("pdf")) return "pdf";
    if (type.includes("word") || type.includes("document")) return "docx";
    if (type.includes("image")) return "image";
    return "";
  };

  const getFileTypeFromName = (name: string) => {
    const lastDot = name.lastIndexOf(".");
    if (lastDot === -1) return "";
    return name.substring(lastDot + 1).toLowerCase();
  };

  const getFileTypeFromCloudinaryUrl = (url: string) => {
    // Cloudinary URLs use /image/upload/ for images and /raw/upload/ for documents/pdfs
    if (url.includes("/image/upload/")) return "image";
    if (url.includes("/raw/upload/")) return "raw";
    return "";
  };

  // Determine file type: Cloudinary path > URL extension > Name extension > MIME type
  let ext = getFileTypeFromCloudinaryUrl(document.url);
  if (!ext) {
    ext = getFileExtension(document.url);
  }
  if (!ext) {
    ext = getFileTypeFromName(document.name);
  }
  if (!ext) {
    ext = getFileTypeFromMime(document.type);
  }

  const isImage = ext === "image" || ["jpg", "jpeg", "png", "gif", "webp", "bmp"].includes(ext);
  const isPdf = ext === "pdf" || ext === "raw" || document.type.toLowerCase().includes("pdf");
  const isDocx = ext === "raw" || ["docx", "doc"].includes(ext) || document.type.toLowerCase().includes("word") || document.type.toLowerCase().includes("document");

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full h-[90vh] max-w-6xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gov-border flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {isImage && <FaFileImage className="w-5 h-5 text-blue-500 flex-shrink-0" />}
            {isPdf && <FaFilePdf className="w-5 h-5 text-red-500 flex-shrink-0" />}
            {isDocx && <FaFileWord className="w-5 h-5 text-blue-500 flex-shrink-0" />}
            {!isImage && !isPdf && !isDocx && <FaFileAlt className="w-5 h-5 text-gray-500 flex-shrink-0" />}
            <div className="min-w-0">
              <p className="font-semibold text-gov-text truncate">{document.name}</p>
              <p className="text-xs text-gov-text-light">{document.type}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <a
              href={document.url}
              download={document.name}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Download"
            >
              <FaDownload className="w-5 h-5 text-primary" />
            </a>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Close"
            >
              <FaTimes className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-gray-50 flex items-center justify-center w-full min-h-0">
          {isLoading && (
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-gov-text-light text-sm">Loading document...</p>
            </div>
          )}

          {/* Image Viewer */}
          {isImage && (
            <img
              src={document.url}
              alt={document.name}
              onLoad={() => setIsLoading(false)}
              onError={() => setIsLoading(false)}
              className="max-w-full max-h-full object-contain"
            />
          )}

          {/* PDF Viewer */}
          {isPdf && (
            <iframe
              src={`${document.url}#toolbar=1&navpanes=0&scrollbar=1`}
              onLoad={() => setIsLoading(false)}
              onError={() => setIsLoading(false)}
              className="w-full h-full border-0"
              title={document.name}
              allowFullScreen
            />
          )}

          {/* DOCX Viewer - Using Google Docs Viewer */}
          {isDocx && (
            <iframe
              src={`https://docs.google.com/gview?url=${encodeURIComponent(document.url)}&embedded=true`}
              onLoad={() => setIsLoading(false)}
              onError={() => setIsLoading(false)}
              className="w-full h-full border-0"
              title={document.name}
              allowFullScreen
            />
          )}

          {/* Unsupported Format */}
          {!isImage && !isPdf && !isDocx && (
            <div className="text-center space-y-4">
              <FaFileAlt className="w-16 h-16 text-gray-300 mx-auto" />
              <div>
                <p className="text-gov-text font-semibold">File Format Not Supported</p>
                <p className="text-gov-text-light text-sm">Please download the file to view it</p>
              </div>
              <a
                href={document.url}
                download={document.name}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-gov hover:bg-primary/90 transition-colors"
              >
                <FaDownload className="w-4 h-4" />
                Download File
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;
