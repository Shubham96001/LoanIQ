import React, { createContext, useState, useEffect, useMemo } from 'react';
import CryptoJS from 'crypto-js';

// Hashing helper
const hashPassword = (pwd) => CryptoJS.SHA256(pwd).toString();

// Configuration constants
const INTEREST_RATE = 0.12; // Annual interest rate used in eligibility calculations
const MAX_DTI = 55; // Maximum Debt-to-Income ratio (%)
const MIN_DTI = 40; // Minimum DTI threshold for moderate risk
const MAX_LOAN_TO_INCOME = 0.8; // Maximum loan amount to annual income ratio

export const AppContext = createContext();

// ─── Blank document template for new users ────────────────────────────────────
const EMPTY_DOCUMENTS = {
  aadhaar: { name: 'Aadhaar Card', status: null, fileName: '', progress: 0, ocrData: null },
  pan: { name: 'PAN Card', status: null, fileName: '', progress: 0, ocrData: null },
  salarySlip: { name: 'Salary Slip', status: null, fileName: '', progress: 0, ocrData: null },
  bankStatement: { name: 'Bank Statement', status: null, fileName: '', progress: 0, ocrData: null },
  photo: { name: 'Passport Size Photo', status: null, fileName: '', progress: 0, ocrData: null },
};

// ─── Seed data (empty for public deployments) ──────────────────────────────
const DEMO_EMAIL = '';

const SEED_APPLICATIONS = [];

const SEED_DOCUMENTS = {};

const SEED_ACTIVITIES = [];

const SEED_NOTIFICATIONS = [];

const SEED_ELIGIBILITY = {}; // keyed by email

// ─── Registered users (demo accounts for local use) ───────────────────────
const SEED_REGISTERED_USERS = [
  {
    name: 'Approval Manager',
    email: 'manager@loaniq.com',
    mobile: '9999999999',
    password: 'Manager@123',
    address: 'Head Office, Mumbai',
    aadhaar: 'Not Provided',
    pan: 'Not Provided',
    role: 'manager',
  },
  {
    name: 'Demo Customer',
    email: 'customer@loaniq.com',
    mobile: '8888888888',
    password: 'Customer@123',
    address: 'Please update your address in Profile',
    aadhaar: 'Not Provided',
    pan: 'Not Provided',
    role: 'customer',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const load = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const resolveRegisteredUsers = (savedUsers) => {
  const baseUsers = Array.isArray(savedUsers) ? savedUsers : [];
  const seeded = SEED_REGISTERED_USERS.filter(seed => !baseUsers.some(user => user.email === seed.email));
  return [...baseUsers, ...seeded];
};

// ─── Provider ─────────────────────────────────────────────────────────────────
export const AppProvider = ({ children }) => {

  // ── One-time migration: clear stale flat keys from v1 of the app ─────────
  if (!localStorage.getItem('loaniq_migrated_v2')) {
    ['loaniq_applications', 'loaniq_documents', 'loaniq_activities',
      'loaniq_notifications', 'loaniq_eligibility', 'loaniq_user'].forEach(k => localStorage.removeItem(k));
    localStorage.setItem('loaniq_migrated_v2', 'true');
  }

  // ── Logged-in session (always start fresh - no auto-login) ────────────────
  // Never auto-load persisted user; users must explicitly login
  const [user, setUser] = useState(null);

  // ── Registered users list ────────────────────────────────────────────────
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = load('loaniq_registered_users', []);
    return resolveRegisteredUsers(saved);
  });

  // ── Global data stores (all keyed by userEmail where needed) ─────────────
  const [allApplications, setAllApplications] = useState(() =>
    load('loaniq_all_applications', SEED_APPLICATIONS)
  );

  // allDocuments: { [email]: { aadhaar, pan, ... } }
  const [allDocuments, setAllDocuments] = useState(() =>
    load('loaniq_all_documents', SEED_DOCUMENTS)
  );

  // allActivities: array of { userEmail, ... }
  const [allActivities, setAllActivities] = useState(() =>
    load('loaniq_all_activities', SEED_ACTIVITIES)
  );

  // allNotifications: array of { userEmail, ... }
  const [allNotifications, setAllNotifications] = useState(() =>
    load('loaniq_all_notifications', SEED_NOTIFICATIONS)
  );

  // allEligibility: { [email]: result }
  const [allEligibility, setAllEligibility] = useState(() =>
    load('loaniq_all_eligibility', SEED_ELIGIBILITY)
  );

  // ── Persist everything ────────────────────────────────────────────────────
  useEffect(() => {
    if (user) localStorage.setItem('loaniq_user', JSON.stringify(user));
    else localStorage.removeItem('loaniq_user');
  }, [user]);

  useEffect(() => { localStorage.setItem('loaniq_registered_users', JSON.stringify(registeredUsers)); }, [registeredUsers]);
  useEffect(() => { localStorage.setItem('loaniq_all_applications', JSON.stringify(allApplications)); }, [allApplications]);
  useEffect(() => { localStorage.setItem('loaniq_all_documents', JSON.stringify(allDocuments)); }, [allDocuments]);
  useEffect(() => { localStorage.setItem('loaniq_all_activities', JSON.stringify(allActivities)); }, [allActivities]);
  useEffect(() => { localStorage.setItem('loaniq_all_notifications', JSON.stringify(allNotifications)); }, [allNotifications]);
  useEffect(() => { localStorage.setItem('loaniq_all_eligibility', JSON.stringify(allEligibility)); }, [allEligibility]);

  // ── Derived views for the current session ────────────────────────────────
  // Manager sees ALL applications; customer sees only their own
  const applications = useMemo(() => {
    if (!user) return [];
    if (user.role === 'manager') return allApplications;
    return allApplications.filter(a => a.userEmail === user.email);
  }, [user, allApplications]);

  // Documents for the current customer (manager has no personal documents)
  const documents = useMemo(() => {
    if (!user || user.role === 'manager') return EMPTY_DOCUMENTS;
    return allDocuments[user.email] || EMPTY_DOCUMENTS;
  }, [user, allDocuments]);

  // Activities for the current user only
  const activities = useMemo(() => {
    if (!user) return [];
    return allActivities.filter(a => a.userEmail === user.email);
  }, [user, allActivities]);

  // Notifications for the current user only
  const notifications = useMemo(() => {
    if (!user) return [];
    return allNotifications.filter(n => n.userEmail === user.email);
  }, [user, allNotifications]);

  // Eligibility result for current user
  const eligibilityResult = useMemo(() => {
    if (!user) return null;
    return allEligibility[user.email] || null;
  }, [user, allEligibility]);

  // ── Targeted helpers (targetEmail defaults to logged-in user) ────────────
  const addActivity = (text, type = 'info', targetEmail = null) => {
    const email = targetEmail || user?.email;
    if (!email) return;
    const now = new Date();
    const formattedTime = now.toISOString().replace('T', ' ').substring(0, 19);
    setAllActivities(prev => [
      { id: Date.now(), userEmail: email, text, time: formattedTime, type },
      ...prev.slice(0, 99), // keep at most 100 global entries
    ]);
  };

  const addNotification = (text, targetEmail = null) => {
    const email = targetEmail || user?.email;
    if (!email) return;
    setAllNotifications(prev => [
      { id: Date.now(), userEmail: email, text, time: 'Just now', read: false },
      ...prev,
    ]);
  };

  // ── Auth ──────────────────────────────────────────────────────────────────
  const login = (email, password) => {
    const lookupUsers = resolveRegisteredUsers(registeredUsers);
    const found = lookupUsers.find(u => u.email === email && u.password === password);
    if (!found) throw new Error('Invalid email or password');
    if (!registeredUsers.some(u => u.email === found.email)) {
      setRegisteredUsers(prev => [...prev, found]);
    }
    const { password: _, ...sessionUser } = found;
    setUser(sessionUser);
    addActivity(`Logged in successfully`, 'info', email);
    addNotification(`Welcome back, ${found.name}!`, email);
    return true;
  };

  const logout = () => {
    if (user) addActivity('User logged out', 'info', user.email);
    setUser(null);
  };

  const register = (name, email, mobile, password) => {
    if (registeredUsers.some(u => u.email === email))
      throw new Error('An account with this email already exists.');

    const newReg = {
      name, email, mobile, password,
      address: 'Please update your address in Profile',
      aadhaar: 'Not Provided',
      pan: 'Not Provided',
      role: 'customer',
    };
    setRegisteredUsers(prev => [...prev, newReg]);

    // Create empty document slot for the new user
    setAllDocuments(prev => ({ ...prev, [email]: { ...EMPTY_DOCUMENTS } }));

    const { password: _, ...sessionUser } = newReg;
    setUser(sessionUser);

    addActivity(`Account created successfully`, 'success', email);
    addNotification(`Registration successful! Welcome to LoanIQ, ${name}.`, email);
    return true;
  };

  const updateProfile = (profileData) => {
    setUser(prev => ({ ...prev, ...profileData }));
    // Also update in registeredUsers so login reflects new info
    setRegisteredUsers(prev =>
      prev.map(u => u.email === user.email ? { ...u, ...profileData } : u)
    );
    addActivity('Profile information updated', 'success');
    addNotification('Profile updated successfully.');
  };

  // ── Eligibility predictor ─────────────────────────────────────────────────
  const predictEligibility = (inputs) => {
    const { age, income, employmentType, existingEmi, loanAmount, tenure } = inputs;
    const monthlyIncome = parseFloat(income);
    const requestedAmount = parseFloat(loanAmount);
    const months = parseFloat(tenure);
    const currentEmi = parseFloat(existingEmi || 0);
    const r = 0.12 / 12;

    const newEmi = Math.round(
      (requestedAmount * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1)
    );
    const totalEmiCommitment = currentEmi + newEmi;
    const dtiRatio = (totalEmiCommitment / monthlyIncome) * 100;
    const loanToIncomeRatio = requestedAmount / (monthlyIncome * 12);

    let score = 90;
    let riskLevel = 'Eligible';
    let recommendations = [];

    if (dtiRatio > 55) { score -= 40; recommendations.push('DTI ratio is high. Existing commitments plus new EMI exceeds 55% of monthly income.'); }
    else if (dtiRatio > 40) { score -= 20; recommendations.push('DTI is moderate. Limit extra spending to maintain healthy credit.'); }
    if (loanToIncomeRatio > 0.8) { score -= 25; recommendations.push('Requested loan amount is high relative to your annual income.'); }
    if (age < 21 || age > 60) { score -= 15; recommendations.push('Age is outside prime borrowing years (21-60). Might require a co-applicant.'); }
    if (employmentType === 'Student') { score -= 30; recommendations.push('Students generally require a salaried co-signer or proof of stipends.'); }
    else if (employmentType === 'Self-Employed') { score -= 10; recommendations.push('Self-employed files require 2 years of ITR validation.'); }

    if (score < 50) riskLevel = 'High Risk';
    else if (score < 80) riskLevel = 'Moderately Eligible';

    const maxHealthyEmi = (monthlyIncome * 0.40) - currentEmi;
    let recommendedAmount = requestedAmount;
    if (maxHealthyEmi < newEmi) {
      recommendedAmount = Math.max(
        0,
        Math.round(
          Math.round((maxHealthyEmi * (Math.pow(1 + r, months) - 1)) / (r * Math.pow(1 + r, months))) / 10000
        ) * 10000
      );
    }

    const result = {
      score: Math.max(15, Math.min(score, 99)),
      riskLevel,
      recommendedAmount,
      dtiRatio: Math.round(dtiRatio),
      calculatedEmi: newEmi,
      factors: recommendations,
      inputs,
    };

    setAllEligibility(prev => ({ ...prev, [user.email]: result }));
    addActivity(`AI Eligibility Check run: Score ${result.score} (${riskLevel})`, 'info');
    return result;
  };

  // ── Submit application ────────────────────────────────────────────────────
  const submitApplication = async (formData) => {
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      const newAppId = data.id;

      const { loanType, loanAmount, tenure, loanPurpose } = formData;
      const amt = parseFloat(loanAmount);
      const months = parseInt(tenure);
      const r = 0.12 / 12;
      const emi = formData.calculatedEmi ||
        Math.round((amt * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1));

      const now = new Date();
      const formattedDate = now.toISOString().split('T')[0];

      const newApp = {
        id: newAppId,
        userEmail: user.email,        // ← tagged to this customer
        type: loanType,
        amount: amt,
        purpose: loanPurpose,
        tenure: months,
        emi,
        status: 'Under Review',
        date: formattedDate,
        progress: 1,
        timeline: [
          { stage: 'Application Submitted', date: `${formattedDate} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`, done: true },
          { stage: 'Eligibility Reviewed', date: 'Estimated: Within 2 hours', done: false, current: true },
          { stage: 'Documents Verified', date: 'Pending document uploads', done: false },
          { stage: 'Loan Under Review', date: 'Pending', done: false },
          { stage: 'Approved / Rejected', date: 'Pending', done: false },
        ],
      };

      setAllApplications(prev => [newApp, ...prev]);
      addActivity(`Submitted loan application ${newAppId} for ₹${amt.toLocaleString()}`, 'info');
      addNotification(`Application ${newAppId} submitted! Please go to Document Center to upload files.`);
      return newAppId;
    } catch (err) {
      console.error(err);
      addNotification(`Failed to submit application: ${err.message}`);
    }
  };

  // ── Document upload ───────────────────────────────────────────────────────
  const startDocumentUpload = async (docType, file) => {
    const fileName = file.name;
    const sessionId = user?.email || 'demo_session';
    const email = user?.email;

    // Optimistic update for the current user's documents
    setAllDocuments(prev => ({
      ...prev,
      [email]: {
        ...(prev[email] || EMPTY_DOCUMENTS),
        [docType]: { ...(prev[email]?.[docType] || {}), status: 'Uploaded', fileName, progress: 10, ocrData: null },
      },
    }));

    addActivity(`Uploading ${docType === 'salarySlip' ? 'Salary Slip' : docType === 'bankStatement' ? 'Bank Statement' : docType.toUpperCase()} for AI verification`, 'info');

    let currentProgress = 10;
    const progressInterval = setInterval(() => {
      currentProgress += 20;
      if (currentProgress < 95) {
        setAllDocuments(prev => ({
          ...prev,
          [email]: {
            ...(prev[email] || EMPTY_DOCUMENTS),
            [docType]: { ...(prev[email]?.[docType] || {}), progress: currentProgress },
          },
        }));
      }
    }, 400);

    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('docType', docType);
      fd.append('pipeline_id', sessionId);
      fd.append('applicant_email', user?.email || '');

      const response = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await response.json();

      clearInterval(progressInterval);
      setAllDocuments(prev => ({
        ...prev,
        [email]: {
          ...(prev[email] || EMPTY_DOCUMENTS),
          [docType]: {
            ...(prev[email]?.[docType] || {}),
            status: 'Under Review',
            progress: 100,
            fileName: data.filename || fileName,
            encryptedPath: data.encrypted_path || null,
          },
        },
      }));
      addActivity(`Upload stored successfully for ${fileName}`, 'info');

      const ocrResult = {
        fileName: data.filename || fileName,
        status: data.status || 'ready_to_process',
        encryptedPath: data.encrypted_path || null,
        pipelineId: data.pipeline_id || sessionId,
        message: 'Document uploaded to backend storage and queued for processing.',
      };

      setAllDocuments(prev => ({
        ...prev,
        [email]: {
          ...(prev[email] || EMPTY_DOCUMENTS),
          [docType]: {
            ...(prev[email]?.[docType] || {}),
            status: 'Verified',
            progress: 100,
            ocrData: ocrResult,
          },
        },
      }));
      addActivity(`Document upload completed for ${fileName}`, 'success');

      setAllApplications(prevApps =>
        prevApps.map(app => {
          if (app.userEmail === email && app.status === 'Under Review') {
            const newProgress = Math.max(app.progress, 3);
            const updatedTimeline = [...app.timeline];
            updatedTimeline[0] = { ...updatedTimeline[0], done: true };
            updatedTimeline[1] = { ...updatedTimeline[1], done: true };
            updatedTimeline[2] = { ...updatedTimeline[2], done: true, date: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` };
            updatedTimeline[3] = { ...updatedTimeline[3], done: true, current: true, date: 'In Progress' };
            return { ...app, progress: newProgress, timeline: updatedTimeline };
          }
          return app;
        })
      );
    } catch (err) {
      clearInterval(progressInterval);
      console.error(err);
      addNotification(`Upload failed: ${err.message}`);
    }
  };

  // ── Delete document ───────────────────────────────────────────────────────
  const deleteDocument = (docType) => {
    const email = user?.email;
    setAllDocuments(prev => ({
      ...prev,
      [email]: {
        ...(prev[email] || EMPTY_DOCUMENTS),
        [docType]: { ...(EMPTY_DOCUMENTS[docType]) },
      },
    }));
    addActivity(`Removed document: ${docType === 'salarySlip' ? 'Salary Slip' : docType === 'bankStatement' ? 'Bank Statement' : docType.toUpperCase()}`, 'info');
  };

  // ── Manager: approve / reject ─────────────────────────────────────────────
  const approveApplication = (appId) => {
    let customerEmail = null;
    setAllApplications(prev => prev.map(app => {
      if (app.id === appId) {
        customerEmail = app.userEmail;
        const formattedDate = new Date().toISOString().split('T')[0];
        const formattedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const updatedTimeline = app.timeline.map(t =>
          ['Approved / Rejected', 'Approved', 'Loan Under Review', 'Documents Verified'].includes(t.stage)
            ? { ...t, done: true, current: false, date: `${formattedDate} ${formattedTime}` }
            : { ...t, done: true }
        );
        if (updatedTimeline[4]?.stage === 'Approved / Rejected') updatedTimeline[4].stage = 'Approved';
        return { ...app, status: 'Approved', progress: 5, timeline: updatedTimeline };
      }
      return app;
    }));
    // Activity for the manager, notification for the customer
    addActivity(`Application ${appId} approved`, 'success');
    if (customerEmail) {
      addActivity(`Your application ${appId} has been approved by the Bank Manager`, 'success', customerEmail);
      addNotification(`🎉 Your loan application ${appId} has been Approved! Funds will be disbursed shortly.`, customerEmail);
    }
  };

  const rejectApplication = (appId) => {
    let customerEmail = null;
    setAllApplications(prev => prev.map(app => {
      if (app.id === appId) {
        customerEmail = app.userEmail;
        const formattedDate = new Date().toISOString().split('T')[0];
        const formattedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const updatedTimeline = app.timeline.map(t =>
          ['Approved / Rejected', 'Approved', 'Loan Under Review', 'Documents Verified'].includes(t.stage)
            ? { ...t, done: true, current: false, date: `${formattedDate} ${formattedTime}` }
            : { ...t, done: true }
        );
        if (updatedTimeline[4]?.stage === 'Approved / Rejected') updatedTimeline[4].stage = 'Rejected';
        return { ...app, status: 'Rejected', progress: 5, timeline: updatedTimeline };
      }
      return app;
    }));
    addActivity(`Application ${appId} rejected`, 'warning');
    if (customerEmail) {
      addActivity(`Your application ${appId} was not approved`, 'warning', customerEmail);
      addNotification(`Your loan application ${appId} has been rejected. Please contact support to review the decision.`, customerEmail);
    }
  };

  // ── Notification helpers ──────────────────────────────────────────────────
  const markNotificationRead = (id) => {
    setAllNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllNotificationsRead = () => {
    const email = user?.email;
    setAllNotifications(prev =>
      prev.map(n => n.userEmail === email ? { ...n, read: true } : n)
    );
  };

  // ── Context value ─────────────────────────────────────────────────────────
  return (
    <AppContext.Provider value={{
      user,
      applications,
      documents,
      activities,
      notifications,
      eligibilityResult,
      login,
      logout,
      register,
      updateProfile,
      predictEligibility,
      submitApplication,
      startDocumentUpload,
      deleteDocument,
      markNotificationRead,
      markAllNotificationsRead,
      approveApplication,
      rejectApplication,
    }}>
      {children}
    </AppContext.Provider>
  );
};
