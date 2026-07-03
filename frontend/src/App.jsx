import React, { useContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppContext } from './context/AppContext';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MitraCopilot from './components/Copilot/MitraCopilot';

// Pages
import Landing from './pages/Landing/Landing';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import Eligibility from './pages/Eligibility/Eligibility';
import ApplyLoan from './pages/ApplyLoan/ApplyLoan';
import Documents from './pages/Documents/Documents';
import Tracker from './pages/Tracker/Tracker';
import Approvals from './pages/Dashboard/Approvals';
import Reports from './pages/Reports/Reports';
import Profile from './pages/Profile/Profile';

// Route Guard Component
function AuthGuard({ children }) {
  const { user } = useContext(AppContext);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Shell Layout containing Conditional Sidebar & Top Header bindings
function AppShell() {
  const { user } = useContext(AppContext);
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const isPublicRoute = ['/', '/login', '/register'].includes(location.pathname);

  // Unauthenticated Public Pages Layout
  if (isPublicRoute) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    );
  }

  // Authenticated Portal Pages Layout
  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden bg-slate-50 relative">
        {/* Sidebar Nav */}
        <Sidebar isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />

        {/* Right panel section */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header */}
          <Navbar onMobileMenuToggle={() => setMobileSidebarOpen(true)} />

          {/* Scrolling Content viewport */}
          <main className="flex-1 overflow-y-auto bg-slate-50">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/eligibility" element={<Eligibility />} />
              <Route path="/apply" element={<ApplyLoan />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/tracker" element={<Tracker />} />
              <Route path="/approvals" element={<Approvals />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>

        {/* Floating AI Co-Pilot (Mitra) */}
        <MitraCopilot />
      </div>
    </AuthGuard>
  );
}

export default function App() {
  return (
    <Router>
      <AppShell />
    </Router>
  );
}
