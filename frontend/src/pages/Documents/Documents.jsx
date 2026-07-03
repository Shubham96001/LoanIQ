import React, { useContext, useRef } from 'react';
import { AppContext } from '../../context/AppContext';
import {
  UploadCloud,
  FileCheck2,
  AlertCircle,
  Clock,
  Trash2,
  Eye,
  CheckCircle,
  Database,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Documents() {
  const { documents, startDocumentUpload, deleteDocument } = useContext(AppContext);

  // References for file inputs
  const fileInputs = {
    aadhaar: useRef(null),
    pan: useRef(null),
    salarySlip: useRef(null),
    bankStatement: useRef(null),
    photo: useRef(null)
  };

  const handleFileChange = (e, docType) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      startDocumentUpload(docType, file);
    }
  };

  const triggerInput = (docType) => {
    fileInputs[docType].current?.click();
  };

  // Helper colors for badges
  const getBadgeStyle = (status) => {
    switch (status) {
      case 'Verified':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Under Review':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Rejected':
        return 'bg-red-50 text-red-700 border-red-100';
      case 'Uploaded':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-400 border-slate-100';
    }
  };

  return (
    <div className="space-y-8 p-4 md:p-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Document Upload Center</h1>
          <p className="text-slate-500 text-sm mt-1">
            Submit KYC and income statements. Uploads are analyzed client-side via AI OCR scanners.
          </p>
        </div>
        <Link
          to="/tracker"
          className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-5 py-3 text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition-colors"
        >
          <span>Track Application</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Grid of Documents */}
      <div className="grid gap-6 md:grid-cols-2">
        {Object.keys(documents).map(key => {
          const doc = documents[key];
          const isUploading = doc.progress > 0 && doc.progress < 100;
          const isReviewing = doc.status === 'Under Review';
          const isVerified = doc.status === 'Verified';
          const inputRef = fileInputs[key];

          return (
            <div
              key={key}
              className="relative flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
            >
              {/* Review scanning laser animation */}
              {isReviewing && (
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-80 animate-scanner-laser z-10" />
              )}

              {/* Input trigger (hidden) */}
              <input
                type="file"
                ref={inputRef}
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => handleFileChange(e, key)}
              />

              <div className="space-y-4">
                {/* File Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">{doc.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Required for identity and income check</p>
                  </div>
                  <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${getBadgeStyle(doc.status)}`}>
                    {doc.status || 'Not Uploaded'}
                  </span>
                </div>

                {/* Upload Zone / State Box */}
                {!doc.status ? (
                  // Dropzone placeholder
                  <div
                    onClick={() => triggerInput(key)}
                    className="cursor-pointer rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-8 text-center transition-all hover:border-blue-400 hover:bg-blue-50/10 group flex flex-col items-center justify-center"
                  >
                    <UploadCloud className="h-8 w-8 text-slate-400 group-hover:text-blue-500 group-hover:scale-110 transition-all" />
                    <span className="mt-3 text-xs font-bold text-slate-700">Drag & drop or Click to upload</span>
                    <span className="mt-1 text-[10px] text-slate-400">PDF, PNG, JPG up to 10MB</span>
                  </div>
                ) : (
                  // File display box
                  <div className="rounded-2xl bg-slate-50 p-4 space-y-3">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                      <span className="truncate max-w-[200px]">{doc.fileName}</span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {isVerified && <FileCheck2 className="h-4 w-4 text-emerald-500" />}
                        {isReviewing && <Clock className="h-4 w-4 text-blue-500 animate-spin" />}
                        {!isUploading && (
                          <button
                            onClick={() => deleteDocument(key)}
                            className="text-slate-400 hover:text-red-500 p-1 rounded-lg hover:bg-slate-200 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {isUploading && (
                      <div className="space-y-1">
                        <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-blue-600 transition-all duration-300"
                            style={{ width: `${doc.progress}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[9px] font-bold text-slate-400">
                          <span>Uploading...</span>
                          <span>{doc.progress}%</span>
                        </div>
                      </div>
                    )}

                    {/* OCR Results box */}
                    {isReviewing && (
                      <div className="text-[10px] font-bold text-blue-600 bg-blue-50/50 rounded-xl p-3 space-y-1 animate-pulse">
                        <span className="flex items-center gap-1">
                          <Database className="h-3.5 w-3.5" />
                          AI OCR: Scanning document structure...
                        </span>
                      </div>
                    )}

                    {isVerified && doc.ocrData && (
                      <div className="text-[11px] font-semibold text-slate-600 bg-white border border-slate-100 rounded-xl p-3.5 space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 mb-1">
                          <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                          <span>AI OCR Analysis Success</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[10px] border-t border-slate-50 pt-2">
                          {Object.keys(doc.ocrData).map(ocrKey => (
                            <div key={ocrKey}>
                              <span className="text-slate-400 capitalize">{ocrKey.replace(/([A-Z])/g, ' $1')}</span>
                              <p className="font-bold text-slate-800 truncate">{doc.ocrData[ocrKey]}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
