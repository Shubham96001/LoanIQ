import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import {
  LayoutDashboard,
  Sparkles,
  ClipboardEdit,
  FileCheck,
  Activity,
  BarChart3,
  User,
  LogOut,
  X,
  CreditCard
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/');
  };

  const customerItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Check Eligibility', path: '/eligibility', icon: Sparkles, badge: 'AI Predict' },
    { name: 'Apply for Loan', path: '/apply', icon: ClipboardEdit },
    { name: 'Document Center', path: '/documents', icon: FileCheck, badge: 'AI OCR' },
    { name: 'Track Application', path: '/tracker', icon: Activity },
    { name: 'Financial Reports', path: '/reports', icon: BarChart3 },
    { name: 'My Profile', path: '/profile', icon: User }
  ];

  const managerItems = [
    { name: 'Manager Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Loan Approvals', path: '/approvals', icon: ClipboardEdit, badge: 'Review' },
    { name: 'Portfolio Reports', path: '/reports', icon: BarChart3 },
    { name: 'My Profile', path: '/profile', icon: User }
  ];

  const navItems = user?.role === 'manager' ? managerItems : customerItems;

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed bottom-0 top-0 left-0 z-40 flex w-72 flex-col border-r border-slate-100 bg-white pt-16 transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>

        {/* User Mini Info */}
        {user && (
          <div className="mx-4 my-6 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800 p-4 text-white shadow-sm shadow-slate-900/20">
            <p className="text-xs font-semibold text-slate-400">Welcome back,</p>
            <h4 className="mt-1 font-bold tracking-tight text-white line-clamp-1">{user.name}</h4>
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-200">
              <CreditCard className="h-4 w-4 shrink-0" />
              <span>{user.role === 'manager' ? 'Clearance: Level 2' : 'KYC Status: Verified'}</span>
            </div>
          </div>
        )}

        {/* Navigation items */}
        <nav className="flex-1 space-y-1 px-4 py-2 overflow-y-auto">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 group ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 shadow-sm shadow-blue-500/5'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5 shrink-0" />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="rounded-full bg-blue-100/70 px-2 py-0.5 text-[10px] font-bold text-blue-600 group-hover:bg-blue-100">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout at bottom */}
        <div className="border-t border-slate-100 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
