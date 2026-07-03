import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import {
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  PlusCircle,
  Sparkles,
  Upload,
  Search,
  Bell,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Users,
  DollarSign,
  Briefcase
} from 'lucide-react';

export default function Dashboard() {
  const { user, applications, activities, notifications, markNotificationRead } = useContext(AppContext);

  // General counts
  const totalApps = applications.length;
  const approvedApps = applications.filter(a => a.status === 'Approved').length;
  const pendingApps = applications.filter(a => a.status === 'Under Review' || a.status === 'Pending Documents').length;
  const rejectedApps = applications.filter(a => a.status === 'Rejected').length;

  const totalDisbursed = applications
    .filter(a => a.status === 'Approved')
    .reduce((sum, a) => sum + a.amount, 0) + 11100000;

  // Manager dashboard quick actions
  const managerActions = [
    { name: 'Approve Loans', desc: 'Review active applicant credit folders', icon: CheckCircle, path: '/approvals', color: 'from-blue-600 to-indigo-600', text: 'text-white' },
    { name: 'Portfolio Growth', desc: 'Aggregated loan statistics', icon: TrendingUp, path: '/reports', color: 'from-emerald-500 to-teal-600', text: 'text-white' },
    { name: 'Manage Profiles', desc: 'Audit applicant identities', icon: Users, path: '/profile', color: 'from-white to-slate-50', text: 'text-slate-900 border border-slate-100' }
  ];

  // Customer dashboard quick actions
  const customerActions = [
    { name: 'Apply Loan', desc: 'Fill out the 4-step loan wizard', icon: PlusCircle, path: '/apply', color: 'from-blue-600 to-indigo-600', text: 'text-white' },
    { name: 'Eligibility Check', desc: 'Run the AI risk scoring engine', icon: Sparkles, path: '/eligibility', color: 'from-emerald-500 to-teal-600', text: 'text-white' },
    { name: 'Upload Documents', desc: 'Drop files for OCR verification', icon: Upload, path: '/documents', color: 'from-white to-slate-50', text: 'text-slate-900 border border-slate-100' },
    { name: 'Track Application', desc: 'View current processing timeline', icon: Search, path: '/tracker', color: 'from-white to-slate-50', text: 'text-slate-900 border border-slate-100' }
  ];

  // ----------------------------------------------------
  // MANAGER DASHBOARD VIEW
  // ----------------------------------------------------
  if (user?.role === 'manager') {
    return (
      <div className="space-y-8 p-4 md:p-8 animate-in fade-in duration-300">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Manager Terminal</h1>
            <p className="text-slate-500 text-sm mt-1">HQ Branch Desk: Rajesh Kumar. Audit credit risk and KYC files.</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full">
            <Clock className="h-3.5 w-3.5" />
            <span>Branch Database Connected</span>
          </div>
        </div>

        {/* Manager Metrics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Awaiting Evaluation</span>
              <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                <FileText className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-blue-600">{applications.filter(a => a.status === 'Under Review').length}</span>
              <span className="text-xs font-semibold text-slate-400">files pending</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Approved</span>
              <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
                <CheckCircle className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-emerald-600">{approvedApps}</span>
              <span className="text-xs font-semibold text-slate-400">approved files</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Disbursed Volume</span>
              <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">₹ {totalDisbursed.toLocaleString()}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Disbursal Growth</span>
              <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">+24.8%</span>
              <span className="text-xs font-semibold text-slate-400">MoM growth</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Manager Quick Actions</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {managerActions.map((action, idx) => (
              <Link
                key={idx}
                to={action.path}
                className={`group flex flex-col justify-between rounded-2xl p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 bg-gradient-to-tr ${action.color} ${action.text}`}
              >
                <div>
                  <action.icon className="h-7 w-7 mb-4" />
                  <h4 className="font-extrabold text-lg">{action.name}</h4>
                  <p className={`text-xs mt-1 leading-relaxed ${action.text.includes('white') ? 'text-white/80' : 'text-slate-500'}`}>
                    {action.desc}
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-1.5 text-xs font-bold self-start">
                  <span>Open Desk</span>
                  <ChevronRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Manager Tables Split */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Active applications under review */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">Loans Awaiting Review</h3>
              <Link to="/approvals" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                Open approvals desk
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="p-4">Application ID</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                  {applications.filter(a => a.status === 'Under Review').length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-slate-400">No applications pending review.</td>
                    </tr>
                  ) : (
                    applications.filter(a => a.status === 'Under Review').map(app => (
                      <tr key={app.id} className="hover:bg-slate-50/40 transition-colors">
                        <td className="p-4 font-bold text-slate-900">{app.id}</td>
                        <td className="p-4">{app.type}</td>
                        <td className="p-4">₹ {app.amount.toLocaleString()}</td>
                        <td className="p-4">
                          <span className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-700">
                            Pending Approval
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <Link to="/approvals" className="rounded-lg bg-slate-900 text-white px-3 py-1.5 text-[10px] font-bold hover:bg-slate-800 transition-colors">
                            Evaluate
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* System logs feed */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">System Logs</h3>
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4 max-h-[360px] overflow-y-auto">
              <div className="space-y-4">
                {activities.slice(0, 6).map(act => (
                  <div key={act.id} className="text-xs space-y-1">
                    <div className="flex justify-between items-center text-slate-400 font-bold text-[9px] uppercase">
                      <span>Log Entry</span>
                      <span>{act.time.split(' ')[1] || act.time}</span>
                    </div>
                    <p className="font-semibold text-slate-700 leading-snug">{act.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // CUSTOMER DASHBOARD VIEW
  // ----------------------------------------------------
  return (
    <div className="space-y-8 p-4 md:p-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Account Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Review active applications and complete document checks.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full">
          <Clock className="h-3.5 w-3.5" />
          <span>Last updated: Just now</span>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric Card: Total */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Applications</span>
            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
              <FileText className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{totalApps}</span>
            <span className="text-xs font-semibold text-slate-400">active files</span>
          </div>
        </div>

        {/* Metric Card: Approved */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Approved Loans</span>
            <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600">
              <CheckCircle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-700">{approvedApps}</span>
            <span className="text-xs font-semibold text-emerald-600">disbursed</span>
          </div>
        </div>

        {/* Metric Card: Pending */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Pending Review</span>
            <div className="rounded-xl bg-amber-50 p-2.5 text-amber-600">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-600">{pendingApps}</span>
            <span className="text-xs font-semibold text-amber-600">under validation</span>
          </div>
        </div>

        {/* Metric Card: Rejected */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Rejected Loans</span>
            <div className="rounded-xl bg-red-50 p-2.5 text-red-600">
              <XCircle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{rejectedApps}</span>
            <span className="text-xs font-semibold text-slate-400">declined</span>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Quick Actions</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {customerActions.map((action, idx) => (
            <Link
              key={idx}
              to={action.path}
              className={`group flex flex-col justify-between rounded-2xl p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 bg-gradient-to-tr ${action.color} ${action.text}`}
            >
              <div>
                <action.icon className="h-7 w-7 mb-4" />
                <h4 className="font-extrabold text-lg">{action.name}</h4>
                <p className={`text-xs mt-1 leading-relaxed ${action.text.includes('white') ? 'text-white/80' : 'text-slate-500'}`}>
                  {action.desc}
                </p>
              </div>
              <div className="mt-6 flex items-center gap-1.5 text-xs font-bold self-start">
                <span>Proceed</span>
                <ChevronRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Bottom Grid: Activities & Notifications */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Column: Recent Activities */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Recent Activity Log</h3>

          <div className="rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-sm">
            <div className="p-4 bg-slate-50/50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider grid grid-cols-12">
              <span className="col-span-8">Activity Detail</span>
              <span className="col-span-4 text-right">Timestamp</span>
            </div>
            <div className="divide-y divide-slate-100">
              {activities.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-400">No activities logged yet.</div>
              ) : (
                activities.slice(0, 5).map(act => (
                  <div key={act.id} className="p-4 grid grid-cols-12 items-center hover:bg-slate-50/40 transition-colors">
                    <div className="col-span-8 flex items-start gap-2.5">
                      <div className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${
                        act.type === 'success' ? 'bg-emerald-500' : act.type === 'warning' ? 'bg-red-500' : 'bg-blue-500'
                      }`} />
                      <span className="text-sm font-semibold text-slate-700 leading-snug">{act.text}</span>
                    </div>
                    <span className="col-span-4 text-right text-xs font-medium text-slate-400">{act.time.split(' ')[1] || act.time}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Notifications Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900">Security Alerts & Updates</h3>
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-700">
              {notifications.filter(n => !n.read).length} new
            </span>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-sm text-slate-400">All caught up! No notifications.</div>
              ) : (
                notifications.slice(0, 4).map(notif => (
                  <div
                    key={notif.id}
                    onClick={() => markNotificationRead(notif.id)}
                    className={`group relative cursor-pointer rounded-xl border p-3.5 text-xs transition-all hover:bg-slate-50 flex items-start gap-3 ${
                      !notif.read ? 'bg-blue-50/40 border-blue-100 font-medium' : 'border-slate-100 text-slate-600'
                    }`}
                  >
                    <div className={`rounded-lg p-1.5 ${!notif.read ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                      {notif.text.includes('approve') || notif.text.includes('success') ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : notif.text.includes('Alert') ? (
                        <AlertCircle className="h-4 w-4" />
                      ) : (
                        <Bell className="h-4 w-4" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="leading-relaxed">{notif.text}</p>
                      <span className="block text-[10px] text-slate-400">{notif.time}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
