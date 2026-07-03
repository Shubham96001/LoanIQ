import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Bell, User, LogOut, Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Navbar({ onMobileMenuToggle }) {
  const { user, logout, notifications, markNotificationRead, markAllNotificationsRead } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showMobileLandingMenu, setShowMobileLandingMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;
  const isDashboard = location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/register';

  const handleLogout = () => {
    logout();
    setShowUserDropdown(false);
    navigate('/');
  };

  const handleNotifClick = (id) => {
    markNotificationRead(id);
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            {isDashboard && (
              <button
                onClick={onMobileMenuToggle}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
                aria-label="Toggle menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            )}
            <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2 font-bold text-slate-900">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-sm shadow-blue-500/30">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-slate-900 bg-clip-text text-transparent">
                LoanIQ
              </span>
            </Link>
          </div>

          {/* Navigation Links for Landing Page */}
          {!isDashboard && (
            <div className="hidden md:flex items-center gap-8 font-medium text-slate-600">
              <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How It Works</a>
              <a href="#testimonials" className="hover:text-blue-600 transition-colors">Testimonials</a>
            </div>
          )}

          {/* Action Items */}
          <div className="flex items-center gap-4">
            {user ? (
              // Authenticated Navigation Actions
              <div className="flex items-center gap-4">
                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      setShowUserDropdown(false);
                    }}
                    className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute right-1.5 top-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="mb-3 flex items-center justify-between border-b border-slate-50 pb-2">
                        <span className="font-semibold text-slate-900">Notifications</span>
                        <button
                          onClick={markAllNotificationsRead}
                          className="text-xs font-medium text-blue-600 hover:text-blue-700"
                        >
                          Mark all read
                        </button>
                      </div>
                      <div className="max-h-60 overflow-y-auto space-y-3">
                        {notifications.length === 0 ? (
                          <p className="text-center py-4 text-xs text-slate-400">No notifications yet</p>
                        ) : (
                          notifications.map(n => (
                            <div
                              key={n.id}
                              onClick={() => handleNotifClick(n.id)}
                              className={`cursor-pointer rounded-xl p-2.5 text-xs transition-colors hover:bg-slate-50 ${!n.read ? 'bg-blue-50/50 font-medium' : 'text-slate-600'}`}
                            >
                              <p className="leading-relaxed">{n.text}</p>
                              <span className="mt-1 block text-[10px] text-slate-400">{n.time}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Selector */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowUserDropdown(!showUserDropdown);
                      setShowNotifications(false);
                    }}
                    className="flex items-center gap-2 rounded-xl p-1 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="hidden text-sm font-semibold text-slate-700 md:block">{user.name}</span>
                  </button>

                  {/* Profile Dropdown */}
                  {showUserDropdown && (
                    <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-200">
                      <Link
                        to="/profile"
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                      >
                        <User className="h-4 w-4" />
                        My Profile
                      </Link>
                      <hr className="my-1 border-slate-100" />
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" />
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Unauthenticated Actions
              <div className="hidden md:flex items-center gap-4">
                <Link to="/login" className="text-sm font-semibold text-slate-700 hover:text-blue-600">
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-500/20 hover:bg-blue-700 hover:shadow-lg transition-all duration-200"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}

            {/* Mobile menu toggle for Landing */}
            {!isDashboard && !user && (
              <button
                onClick={() => setShowMobileLandingMenu(!showMobileLandingMenu)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden"
              >
                {showMobileLandingMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu for Landing Page */}
      {showMobileLandingMenu && !isDashboard && !user && (
        <div className="border-t border-slate-100 bg-white p-4 shadow-lg md:hidden animate-in fade-in duration-200">
          <div className="space-y-3">
            <a
              href="#features"
              onClick={() => setShowMobileLandingMenu(false)}
              className="block rounded-xl px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setShowMobileLandingMenu(false)}
              className="block rounded-xl px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
            >
              How It Works
            </a>
            <a
              href="#testimonials"
              onClick={() => setShowMobileLandingMenu(false)}
              className="block rounded-xl px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
            >
              Testimonials
            </a>
            <hr className="border-slate-100" />
            <div className="flex flex-col gap-2 pt-2">
              <Link
                to="/login"
                onClick={() => setShowMobileLandingMenu(false)}
                className="flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setShowMobileLandingMenu(false)}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
