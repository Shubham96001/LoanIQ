import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  ChevronRight,
  TrendingUp,
  FileText,
  Calendar,
  AlertTriangle,
  HelpCircle,
  HelpCircle as QuestionIcon
} from 'lucide-react';

export default function Tracker() {
  const { applications } = useContext(AppContext);
  const [selectedAppId, setSelectedAppId] = useState('');

  // Auto-select the first application if available
  useEffect(() => {
    if (applications.length > 0 && !selectedAppId) {
      setSelectedAppId(applications[0].id);
    }
  }, [applications, selectedAppId]);

  const activeApp = applications.find(a => a.id === selectedAppId);

  // Helper colors for status badges
  const getStatusStyles = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Under Review':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Rejected':
        return 'bg-red-50 text-red-700 border-red-100';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="space-y-8 p-4 md:p-8">
      {/* Top Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Application Tracker</h1>
        <p className="text-slate-500 text-sm mt-1">Review live stages and estimated disbursal times.</p>
      </div>

      {applications.length === 0 ? (
        // Empty State
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center space-y-4 max-w-lg mx-auto">
          <div className="mx-auto rounded-2xl bg-blue-50 p-4 text-blue-600 w-14 h-14 flex items-center justify-center">
            <Clock className="h-7 w-7" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-900 text-lg">No Active Applications</h4>
            <p className="text-xs text-slate-500 leading-relaxed mt-2">
              You haven't submitted any loan applications yet. Check your eligibility score first or proceed straight to application.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row justify-center items-center gap-3">
            <Link
              to="/apply"
              className="w-full sm:w-auto rounded-xl bg-blue-600 px-5 py-3 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
            >
              Apply Now
            </Link>
            <Link
              to="/eligibility"
              className="w-full sm:w-auto rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Check Eligibility
            </Link>
          </div>
        </div>
      ) : (
        // Main Tracker Layout
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Left Column: Application Selector & Info */}
          <div className="lg:col-span-5 space-y-6">
            {/* Selector Card */}
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Select Active Application
              </label>
              <select
                value={selectedAppId}
                onChange={(e) => setSelectedAppId(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 px-4 text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white"
              >
                {applications.map(app => (
                  <option key={app.id} value={app.id}>
                    {app.type} ({app.id})
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Application Details Card */}
            {activeApp && (
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-5">
                <div className="flex justify-between items-start border-b border-slate-50 pb-4">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg">{activeApp.type || 'Loan'}</h3>
                    <span className="text-xs font-semibold text-slate-400">ID: {activeApp.id}</span>
                  </div>
                  <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${getStatusStyles(activeApp.status)}`}>
                    {activeApp.status || 'Under Review'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                  <div className="bg-slate-50 rounded-xl p-3">
                    <span className="text-slate-400 block">Requested Amount</span>
                    <span className="text-slate-900 font-extrabold text-sm mt-0.5 block">
                      ₹ {(activeApp.amount || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3">
                    <span className="text-slate-400 block">Monthly Installment</span>
                    <span className="text-blue-600 font-extrabold text-sm mt-0.5 block">
                      ₹ {(activeApp.emi || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3">
                    <span className="text-slate-400 block">Loan Tenure</span>
                    <span className="text-slate-900 font-bold mt-0.5 block">
                      {activeApp.tenure || 12} Months
                    </span>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3">
                    <span className="text-slate-400 block">Submission Date</span>
                    <span className="text-slate-900 font-bold mt-0.5 block">
                      {activeApp.date || 'Pending'}
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-blue-50 bg-blue-50/50 p-4 text-xs font-semibold text-blue-700 space-y-1">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Clock className="h-4 w-4 shrink-0 text-blue-600" />
                    Estimated Processing Time
                  </span>
                  <p className="pl-5 text-slate-500 font-medium">
                    {activeApp.status === 'Approved'
                      ? 'Funds successfully disbursed.'
                      : 'AI pre-verification complete. Expected review: within 4 hours.'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Timeline tracker */}
          <div className="lg:col-span-7">
            {activeApp && (
              <div className="rounded-2xl border border-slate-100 bg-white p-6 md:p-8 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-50 pb-4 mb-6">
                  Processing Progress Logs
                </h3>

                {/* Vertical Timeline */}
                <div className="relative border-l border-slate-100 pl-6 space-y-8 ml-3 text-xs">
                  {activeApp.timeline.map((step, idx) => {
                    const stepIndex = idx + 1;
                    const isDone = step.done;
                    const isCurrent = step.current;

                    return (
                      <div key={idx} className="relative">
                        {/* Circle Indicator */}
                        <div
                          className={`absolute -left-[35px] top-0.5 flex h-6.5 w-6.5 items-center justify-center rounded-full border-2 ring-4 ring-white transition-all duration-300 ${
                            isDone
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : isCurrent
                              ? 'bg-blue-100 border-blue-600 text-blue-600 animate-pulse'
                              : 'bg-white border-slate-200 text-slate-400'
                          }`}
                        >
                          <CheckCircle2 className={`h-4.5 w-4.5 ${isDone ? 'opacity-100' : 'opacity-0'}`} />
                          {!isDone && (
                            <span className={`h-1.5 w-1.5 rounded-full ${isCurrent ? 'bg-blue-600' : 'bg-slate-300'}`} />
                          )}
                        </div>

                        {/* Detail text */}
                        <div className="space-y-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <h4
                              className={`text-sm font-extrabold tracking-tight ${
                                isDone ? 'text-slate-800' : isCurrent ? 'text-blue-600' : 'text-slate-400'
                              }`}
                            >
                              {step.stage}
                            </h4>
                            <span className="text-[10px] font-bold text-slate-400 sm:text-right">
                              {step.date}
                            </span>
                          </div>
                          <p className="text-slate-500 font-medium leading-relaxed max-w-xl">
                            {idx === 0 && 'Form submission recorded on server registry.'}
                            {idx === 1 && 'Financial metrics passed preliminary scoring engine.'}
                            {idx === 2 && (isDone ? 'Aadhaar, PAN, and Photo verified via AI OCR.' : 'KYC docs check pending upload.')}
                            {idx === 3 && (isDone ? 'Credit risks assessment validated.' : isCurrent ? 'Loan package files are undergoing algorithmic checks.' : 'Awaiting document verifications.')}
                            {idx === 4 && (isDone ? 'Disbursement complete.' : 'Final underwriter sign-off.')}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
