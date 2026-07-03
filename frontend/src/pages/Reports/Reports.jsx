import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { Navigate } from 'react-router-dom';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { BarChart3, TrendingUp, DollarSign, Award, Clock, Lock } from 'lucide-react';

export default function Reports() {
  const { user, applications } = useContext(AppContext);
  const [filterPeriod, setFilterPeriod] = useState('6M');

  // ── CUSTOMER ACCESS GUARD ──────────────────────────────────────────────
  // Reports are manager-only; customers are redirected to dashboard
  if (!user || user.role !== 'manager') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
        <div className="max-w-md text-center rounded-2xl border border-slate-100 bg-white p-12 shadow-sm">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-amber-50 p-4">
              <Lock className="h-8 w-8 text-amber-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Access Restricted</h1>
          <p className="text-slate-600 mb-6">
            Financial reports and portfolio analytics are available only for loan officers and managers.
          </p>
          <a 
            href="/dashboard" 
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  // ── MANAGER ANALYTICS VIEW ─────────────────────────────────────────────
  // Derive counts from applications list
  const approvedCount = applications.filter(a => a.status === 'Approved').length;
  const pendingCount = applications.filter(a => a.status === 'Under Review' || a.status === 'Pending Documents').length;
  const rejectedCount = applications.filter(a => a.status === 'Rejected').length;

  // Chart 1: Application Trends (Historical + Dynamic June count)
  // Let's add the user's active applications to the June counts
  const juneCount = applications.filter(a => a.date && a.date.startsWith('2026-06')).length;
  const juneApproved = applications.filter(a => a.date && a.date.startsWith('2026-06') && a.status === 'Approved').length;

  const trendData = [
    { month: 'Jan', applications: 12, approved: 9 },
    { month: 'Feb', applications: 18, approved: 14 },
    { month: 'Mar', applications: 15, approved: 12 },
    { month: 'Apr', applications: 28, approved: 24 },
    { month: 'May', applications: 35, approved: 30 },
    { month: 'Jun', applications: 42 + juneCount, approved: 35 + juneApproved }
  ];

  // Chart 2: Approval Ratio (Pie Chart)
  // Baseline static portfolio approvals + current user applications
  const pieData = [
    { name: 'Approved', value: 85 + approvedCount, color: '#10b981' }, // emerald-500
    { name: 'Pending Review', value: 5 + pendingCount, color: '#3b82f6' }, // blue-500
    { name: 'Rejected / High Risk', value: 4 + rejectedCount, color: '#ef4444' } // red-500
  ];

  // Chart 3: Loan Type Distribution (Bar Chart)
  const getLoanTypeCount = (type) => {
    return applications.filter(a => a.type === type).length;
  };

  const distributionData = [
    { name: 'Personal Loan', count: 18 + getLoanTypeCount('Personal Loan'), amount: 4500000 },
    { name: 'Student Loan', count: 8 + getLoanTypeCount('Student Loan'), amount: 1600000 },
    { name: 'Business Loan', count: 6 + getLoanTypeCount('Business Loan'), amount: 3000000 },
    { name: 'Home Renov.', count: 4 + getLoanTypeCount('Home Renovation'), amount: 2000000 }
  ];

  // Totals calculations for summary header cards
  const totalVolume = applications.reduce((sum, a) => sum + a.amount, 0) + 11100000; // adding pre-seed baseline volume
  const avgApprovalScore = 84; // average credit approval rating

  return (
    <div className="space-y-8 p-4 md:p-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Financial Reports</h1>
          <p className="text-slate-500 text-sm mt-1">
            Statistical portfolio metrics and loan distribution indexes.
          </p>
        </div>
        <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setFilterPeriod('30D')}
            className={`rounded-lg px-3.5 py-1.5 transition-colors ${filterPeriod === '30D' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
          >
            30 Days
          </button>
          <button
            onClick={() => setFilterPeriod('6M')}
            className={`rounded-lg px-3.5 py-1.5 transition-colors ${filterPeriod === '6M' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
          >
            6 Months
          </button>
        </div>
      </div>

      {/* Summary Metrics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex items-center gap-4">
          <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Total Disbursed Volume</span>
            <p className="text-lg font-black text-slate-900 mt-0.5">₹ {totalVolume.toLocaleString()}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex items-center gap-4">
          <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Avg. Approval Score</span>
            <p className="text-lg font-black text-slate-900 mt-0.5">{avgApprovalScore} / 100</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex items-center gap-4">
          <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Portfolio Growth</span>
            <p className="text-lg font-black text-slate-900 mt-0.5">+ 24.8% MoM</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex items-center gap-4">
          <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Average Processing</span>
            <p className="text-lg font-black text-slate-900 mt-0.5">2.5 Hours</p>
          </div>
        </div>
      </div>

      {/* Charts Display Grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Area Chart: Application History */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-5 w-5 text-slate-400" />
            <h3 className="font-extrabold text-slate-900 text-base">Application & Approval Trend</h3>
          </div>
          <div className="h-72 w-full text-xs font-medium text-slate-500">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorApproved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: '#fff',
                    borderRadius: '12px',
                    border: '1px solid #f1f5f9',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                  }}
                />
                <Area type="monotone" dataKey="applications" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorApps)" name="Submitted" />
                <Area type="monotone" dataKey="approved" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorApproved)" name="Approved" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Approval Ratio */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="h-5 w-5 text-slate-400" />
            <h3 className="font-extrabold text-slate-900 text-base">Approval Shares</h3>
          </div>
          <div className="h-52 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#fff',
                    borderRadius: '12px',
                    border: '1px solid #f1f5f9'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-slate-900">
                {Math.round(((85 + approvedCount) / (94 + approvedCount + pendingCount + rejectedCount)) * 100)}%
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Approval Ratio</span>
            </div>
          </div>

          {/* Custom Legends list */}
          <div className="mt-4 space-y-2 text-xs font-semibold text-slate-600">
            {pieData.map((p, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: p.color }} />
                  <span>{p.name}</span>
                </div>
                <span className="font-bold text-slate-900">{p.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bar Chart: Loan Type Distribution */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h3 className="font-extrabold text-slate-900 text-base mb-6 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-slate-400" />
          Product Volume Breakdown
        </h3>
        <div className="h-72 w-full text-xs font-medium text-slate-500">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distributionData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: '#white',
                  borderRadius: '12px',
                  border: '1px solid #f1f5f9'
                }}
              />
              <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} maxBarSize={45} name="Total Loans" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
