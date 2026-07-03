import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import {
  Check,
  X,
  User,
  Clock,
  Sparkles,
  ShieldCheck,
  Search,
  FileCheck2,
  AlertCircle,
  FileSpreadsheet,
  TrendingUp,
  DollarSign
} from 'lucide-react';

export default function Approvals() {
  const { applications, approveApplication, rejectApplication } = useContext(AppContext);
  const [selectedAppId, setSelectedAppId] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  // Auto-select first application
  useEffect(() => {
    if (applications.length > 0 && !selectedAppId) {
      setSelectedAppId(applications[0].id);
    }
  }, [applications, selectedAppId]);

  const filteredApps = applications.filter(app => {
    if (filterStatus === 'All') return true;
    return app.status === filterStatus;
  });

  const activeApp = applications.find(a => a.id === selectedAppId);

  const handleApprove = (id) => {
    approveApplication(id);
  };

  const handleReject = (id) => {
    rejectApplication(id);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Under Review':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Rejected':
        return 'bg-red-50 text-red-700 border-red-100';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-8 p-4 md:p-8 h-[calc(100vh-64px)] flex flex-col">
      {/* Top Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Loan Approvals Desk</h1>
        <p className="text-slate-500 text-sm mt-1">Review active credit applications and trigger final approvals.</p>
      </div>

      {applications.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-slate-200 bg-white rounded-2xl p-12 text-center max-w-lg mx-auto w-full">
          <Clock className="h-10 w-10 text-slate-300 animate-pulse mb-4" />
          <h3 className="font-bold text-slate-900 text-lg">No Applications Registered</h3>
          <p className="text-xs text-slate-400 mt-2">There are currently no credit files registered on the platform.</p>
        </div>
      ) : (
        <div className="flex-1 grid lg:grid-cols-12 gap-6 overflow-hidden min-h-0">
          {/* Left Panel: Applications List */}
          <div className="lg:col-span-4 flex flex-col border border-slate-100 bg-white rounded-2xl shadow-sm overflow-hidden min-h-0">
            {/* Filter Tabs */}
            <div className="flex border-b border-slate-100 p-2 gap-1 bg-slate-50 text-[10px] font-bold text-slate-500">
              {['All', 'Under Review', 'Approved', 'Rejected'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setFilterStatus(tab)}
                  className={`flex-1 text-center py-2 rounded-lg transition-all ${
                    filterStatus === tab ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'hover:text-slate-800'
                  }`}
                >
                  {tab === 'Under Review' ? 'Pending' : tab}
                </button>
              ))}
            </div>

            {/* List View */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {filteredApps.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">No applications match this filter.</div>
              ) : (
                filteredApps.map(app => (
                  <div
                    key={app.id}
                    onClick={() => setSelectedAppId(app.id)}
                    className={`p-4 cursor-pointer text-xs transition-colors hover:bg-slate-50 ${
                      selectedAppId === app.id ? 'bg-blue-50/40 border-r-4 border-blue-600 font-semibold' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-slate-900">{app.id}</span>
                      <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold ${getStatusBadge(app.status)}`}>
                        {app.status === 'Under Review' ? 'Pending' : app.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-slate-500">
                      <span>{app.type}</span>
                      <span className="font-bold text-slate-800">₹ {app.amount.toLocaleString()}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-2 flex justify-between">
                      <span>Date: {app.date}</span>
                      <span>Tenure: {app.tenure}M</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Panel: Selected Application Details */}
          <div className="lg:col-span-8 border border-slate-100 bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-0">
            {activeApp ? (
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
                {/* Header detail */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-slate-50 pb-4">
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900">{activeApp.type} Application</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Reference ID: <span className="font-bold text-slate-700">{activeApp.id}</span></p>
                  </div>
                  <span className={`rounded-full border px-3 py-1 text-xs font-bold ${getStatusBadge(activeApp.status)}`}>
                    {activeApp.status}
                  </span>
                </div>

                {/* Grid info boxes */}
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 text-xs font-semibold">
                  <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3">
                    <div className="rounded-lg bg-blue-100 p-2 text-blue-600"><DollarSign className="h-5 w-5" /></div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Loan Amount</span>
                      <span className="text-slate-900 font-extrabold text-sm">₹ {activeApp.amount.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3">
                    <div className="rounded-lg bg-indigo-100 p-2 text-indigo-600"><TrendingUp className="h-5 w-5" /></div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Monthly EMI</span>
                      <span className="text-slate-900 font-extrabold text-sm">₹ {activeApp.emi.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-3">
                    <div className="rounded-lg bg-amber-100 p-2 text-amber-600"><Clock className="h-5 w-5" /></div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Tenure Months</span>
                      <span className="text-slate-900 font-extrabold text-sm">{activeApp.tenure} Months</span>
                    </div>
                  </div>
                </div>

                {/* Applicant Profile */}
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <User className="h-4 w-4" />
                    Applicant Personal Profile
                  </span>
                  {(() => {
                    const applicantEmail = activeApp.userEmail || 'unknown@loaniq.com';
                    const rawName = (applicantEmail.split('@')[0] || 'applicant');
                    const applicantName = rawName.split(/[._-]/).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
                    return (
                      <div className="grid gap-4 sm:grid-cols-2 bg-slate-50/50 border border-slate-100 rounded-2xl p-4 text-xs font-semibold text-slate-600">
                        <div>Applicant Name: <span className="text-slate-900 block mt-0.5">{applicantName}</span></div>
                        <div>Email Address: <span className="text-slate-900 block mt-0.5">{applicantEmail}</span></div>
                        <div>Purpose of Loan: <span className="text-slate-900 block mt-0.5">{activeApp.purpose}</span></div>
                        <div>Verified Income: <span className="text-slate-900 block mt-0.5">₹ 75,000 / month</span></div>
                      </div>
                    );
                  })()}
                </div>

                {/* AI Risk analysis summary */}
                <div className="rounded-2xl border border-blue-100 bg-blue-50/30 p-4 text-xs space-y-2.5">
                  <div className="flex items-center gap-1.5 font-bold text-blue-800">
                    <Sparkles className="h-4.5 w-4.5 text-blue-600 shrink-0" />
                    Mitra AI Risk Evaluation Report
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4 text-slate-600 font-semibold leading-relaxed">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase block">AI Pre-qualification Score</span>
                      <span className="text-blue-700 text-lg font-black block">87 / 100</span>
                      <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">✔ Approved Category (Low Risk)</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase block">DTI Assessment</span>
                      <span className="text-slate-800 block mt-1">Existing EMI obligations are within safe 35% net monthly income parameters.</span>
                    </div>
                  </div>
                </div>

                {/* Documents validation list */}
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4" />
                    AI OCR Documents Verification Status
                  </span>
                  <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl p-2.5 space-y-2 text-xs font-semibold">
                    <div className="flex justify-between items-center py-1.5 px-2">
                      <span className="text-slate-600 flex items-center gap-1.5">
                        <FileCheck2 className="h-4 w-4 text-emerald-500" /> Aadhaar Card Verification
                      </span>
                      <span className="text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded text-[10px] font-bold">Verified (OCR Match)</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 px-2 pt-2.5">
                      <span className="text-slate-600 flex items-center gap-1.5">
                        <FileCheck2 className="h-4 w-4 text-emerald-500" /> PAN Card OCR Check
                      </span>
                      <span className="text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded text-[10px] font-bold">Verified (OCR Match)</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 px-2 pt-2.5">
                      <span className="text-slate-600 flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-blue-500 animate-spin" /> Salary Slip Validation
                      </span>
                      <span className="text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded text-[10px] font-bold">Under Review</span>
                    </div>
                  </div>
                </div>

                {/* Manager Actions */}
                {activeApp.status === 'Under Review' ? (
                  <div className="flex gap-4 border-t border-slate-100 pt-6">
                    <button
                      onClick={() => handleReject(activeApp.id)}
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-3.5 text-xs font-bold text-red-700 hover:bg-red-100 transition-colors"
                    >
                      <X className="h-4 w-4" /> Reject Loan Application
                    </button>
                    <button
                      onClick={() => handleApprove(activeApp.id)}
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-md shadow-emerald-500/10 transition-colors"
                    >
                      <Check className="h-4 w-4" /> Approve & Disburse
                    </button>
                  </div>
                ) : (
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-center text-xs font-bold text-slate-500">
                    Decision Taken: This application has already been <span className="underline uppercase">{activeApp.status}</span>.
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8 text-center text-sm text-slate-400">
                Select an application from the list to review details.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
