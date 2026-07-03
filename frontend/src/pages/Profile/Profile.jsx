import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AppContext } from '../../context/AppContext';
import { User, Mail, Phone, MapPin, CreditCard, ShieldCheck, Check, Edit2, Key, X } from 'lucide-react';

export default function Profile() {
  const { user, updateProfile } = useContext(AppContext);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pwdMessage, setPwdMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      mobile: user?.mobile || '',
      address: user?.address || '',
      aadhaar: user?.aadhaar || '',
      pan: user?.pan || ''
    }
  });

  const {
    register: registerPwd,
    handleSubmit: handleSubmitPwd,
    reset: resetPwd,
    formState: { errors: pwdErrors },
    watch: watchPwd
  } = useForm();

  const currentPwd = watchPwd('newPassword');

  const onProfileSubmit = (data) => {
    updateProfile(data);
    setIsEditing(false);
  };

  const onPasswordSubmit = (data) => {
    setPwdMessage('Password successfully changed (simulated).');
    setTimeout(() => {
      setPwdMessage('');
      setShowPasswordModal(false);
      resetPwd();
    }, 2500);
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset({
      name: user?.name || '',
      email: user?.email || '',
      mobile: user?.mobile || '',
      address: user?.address || '',
      aadhaar: user?.aadhaar || '',
      pan: user?.pan || ''
    });
  };

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">User Profile</h1>
          <p className="text-slate-500 text-sm mt-1">Manage personal details and secure credentials.</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-3 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            <Edit2 className="h-4 w-4" />
            <span>Edit Profile</span>
          </button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        {/* Left Column: Avatar & Quick Stats */}
        <div className="md:col-span-4 flex flex-col items-center text-center rounded-2xl border border-slate-100 bg-white p-6 shadow-sm h-fit">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-3xl font-black text-blue-700 shadow-inner">
            {user?.name.split(' ').map(n => n[0]).join('')}
          </div>
          <h3 className="mt-4 font-extrabold text-slate-900 text-lg">{user?.name}</h3>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">{user?.email}</p>

          <div className="mt-6 w-full border-t border-slate-100 pt-6 space-y-3 text-xs font-semibold">
            <div className="flex justify-between items-center text-slate-500">
              <span>KYC Check</span>
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <ShieldCheck className="h-4 w-4" /> Verified
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-500">
              <span>Account Type</span>
              <span className="text-slate-950">Borrower Standard</span>
            </div>
          </div>

          <button
            onClick={() => setShowPasswordModal(true)}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Key className="h-4 w-4" />
            <span>Update Password</span>
          </button>
        </div>

        {/* Right Column: Editable Details */}
        <div className="md:col-span-8">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 md:p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-50 pb-4 mb-6">
              Account Registration Profile
            </h3>

            <form onSubmit={handleSubmit(onProfileSubmit)} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-slate-400" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    className={`w-full rounded-2xl border py-3 px-4 text-sm font-semibold outline-none transition-all ${
                      isEditing
                        ? 'border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10'
                        : 'border-transparent bg-transparent text-slate-900 pl-0'
                    }`}
                    {...register('name', { required: 'Name is required' })}
                  />
                  {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    disabled={!isEditing}
                    className={`w-full rounded-2xl border py-3 px-4 text-sm font-semibold outline-none transition-all ${
                      isEditing
                        ? 'border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10'
                        : 'border-transparent bg-transparent text-slate-900 pl-0'
                    }`}
                    {...register('email', { required: 'Email is required' })}
                  />
                  {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Mobile */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    disabled={!isEditing}
                    className={`w-full rounded-2xl border py-3 px-4 text-sm font-semibold outline-none transition-all ${
                      isEditing
                        ? 'border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10'
                        : 'border-transparent bg-transparent text-slate-900 pl-0'
                    }`}
                    {...register('mobile', { required: 'Mobile is required' })}
                  />
                </div>

                {/* Address */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    Address
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    className={`w-full rounded-2xl border py-3 px-4 text-sm font-semibold outline-none transition-all ${
                      isEditing
                        ? 'border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10'
                        : 'border-transparent bg-transparent text-slate-900 pl-0'
                    }`}
                    {...register('address', { required: 'Address is required' })}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Aadhaar (Masked) */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <CreditCard className="h-3.5 w-3.5 text-slate-400" />
                    Aadhaar Number
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    className={`w-full rounded-2xl border py-3 px-4 text-sm font-semibold outline-none transition-all ${
                      isEditing
                        ? 'border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white focus:ring-4'
                        : 'border-transparent bg-transparent text-slate-900 pl-0 font-mono'
                    }`}
                    {...register('aadhaar')}
                  />
                </div>

                {/* PAN */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <CreditCard className="h-3.5 w-3.5 text-slate-400" />
                    PAN Number
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    className={`w-full rounded-2xl border py-3 px-4 text-sm font-semibold outline-none transition-all ${
                      isEditing
                        ? 'border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white focus:ring-4'
                        : 'border-transparent bg-transparent text-slate-900 pl-0 font-mono'
                    }`}
                    {...register('pan')}
                  />
                </div>
              </div>

              {/* Form Controls */}
              {isEditing && (
                <div className="flex gap-3 justify-end border-t border-slate-100 pt-6">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-3 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
                  >
                    <Check className="h-4 w-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Password Modal (Simulated overlay) */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl relative animate-in zoom-in duration-200">
            <button
              onClick={() => setShowPasswordModal(false)}
              className="absolute right-4 top-4 rounded-xl p-2 text-slate-400 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-50 pb-3 mb-4 flex items-center gap-2">
              <Key className="h-5 w-5 text-blue-600" />
              Update Account Password
            </h3>

            {pwdMessage && (
              <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3.5 text-xs font-semibold text-emerald-800 mb-4">
                {pwdMessage}
              </div>
            )}

            <form onSubmit={handleSubmitPwd(onPasswordSubmit)} className="space-y-4">
              {/* Current Password */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Current Password</label>
                <input
                  type="password"
                  className={`w-full rounded-2xl border bg-slate-50 py-3 px-4 text-xs font-semibold outline-none focus:border-blue-500 focus:bg-white ${
                    pwdErrors.currentPassword ? 'border-red-500' : 'border-slate-200'
                  }`}
                  {...registerPwd('currentPassword', { required: 'Current password required' })}
                />
              </div>

              {/* New Password */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">New Password</label>
                <input
                  type="password"
                  className={`w-full rounded-2xl border bg-slate-50 py-3 px-4 text-xs font-semibold outline-none focus:border-blue-500 focus:bg-white ${
                    pwdErrors.newPassword ? 'border-red-500' : 'border-slate-200'
                  }`}
                  {...registerPwd('newPassword', {
                    required: 'New password required',
                    minLength: { value: 6, message: 'Must be at least 6 characters' }
                  })}
                />
                {pwdErrors.newPassword && <p className="text-[10px] text-red-500">{pwdErrors.newPassword.message}</p>}
              </div>

              {/* Confirm */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Confirm New Password</label>
                <input
                  type="password"
                  className={`w-full rounded-2xl border bg-slate-50 py-3 px-4 text-xs font-semibold outline-none focus:border-blue-500 focus:bg-white ${
                    pwdErrors.confirmPassword ? 'border-red-500' : 'border-slate-200'
                  }`}
                  {...registerPwd('confirmPassword', {
                    required: 'Please confirm password',
                    validate: val => val === currentPwd || 'Passwords do not match'
                  })}
                />
                {pwdErrors.confirmPassword && (
                  <p className="text-[10px] text-red-500">{pwdErrors.confirmPassword.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-blue-600 py-3.5 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition-colors"
              >
                Change Security Password
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
