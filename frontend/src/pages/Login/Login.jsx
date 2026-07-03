import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AppContext } from '../../context/AppContext';
import { ShieldCheck, Mail, Lock, ArrowRight } from 'lucide-react';

export default function Login() {
  const { login } = useContext(AppContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [loginRole, setLoginRole] = useState('customer');

  const [loginError, setLoginError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm();

  const onSubmit = (data) => {
    setLoading(true);
    setLoginError('');
    setTimeout(() => {
      try {
        login(data.email, data.password);
        setLoading(false);
        navigate('/dashboard');
      } catch (err) {
        setLoginError(err.message);
        setLoading(false);
      }
    }, 1200); // Realistic short network delay
  };

  const handleForgotPassword = () => {
    setResetSent(true);
    setTimeout(() => setResetSent(false), 4000);
  };

  const handleRoleChange = (role) => {
    setLoginRole(role);
    setLoginError('');
    setValue('email', role === 'manager' ? 'manager@loaniq.com' : 'customer@loaniq.com');
    setValue('password', role === 'manager' ? 'Manager@123' : 'Customer@123');
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="flex w-full overflow-hidden rounded-none bg-white shadow-2xl lg:flex-row-reverse">
        {/* Left Side: Mock Illustration / Pitch (Hidden on mobile) */}
        <div className="relative hidden w-1/2 bg-slate-900 lg:block">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-700/80 to-slate-950/95 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>
          <div className="relative flex h-full flex-col justify-between p-16 text-white">
            <Link to="/" className="flex items-center gap-2 font-bold text-white">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500 text-white">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <span className="text-lg tracking-tight">LoanIQ</span>
            </Link>

            <div className="space-y-6">
              <h2 className="text-4xl font-extrabold leading-tight tracking-tight">
                Unlock Instant credit <br />
                possibilities.
              </h2>
              <p className="text-slate-300 leading-relaxed text-sm max-w-md">
                "LoanIQ verified my bank credentials and salary statement through client-side API checks. I avoided bank visits and received instant approval."
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 font-bold text-sm">
                  SS
                </div>
                <div>
                  <h5 className="text-sm font-bold">Siddharth Sen</h5>
                  <p className="text-xs text-slate-400">Approved for ₹ 3,00,000</p>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              &copy; {new Date().getFullYear()} LoanIQ Technologies. Fully secured with end-to-end sandbox protection.
            </p>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="flex w-full items-center justify-center p-8 lg:w-1/2 sm:p-12 lg:p-16">
          <div className="w-full max-w-md space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Welcome Back</h1>
              <p className="text-sm text-slate-500">
                Enter your credentials to manage your loan applications.
              </p>
            </div>

            {/* Role Tab Selector */}
            <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => handleRoleChange('customer')}
                className={`flex-1 text-center py-2.5 text-xs font-bold rounded-lg transition-all ${loginRole === 'customer' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
              >
                Customer Portal
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('manager')}
                className={`flex-1 text-center py-2.5 text-xs font-bold rounded-lg transition-all ${loginRole === 'manager' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
              >
                Approval Manager
              </button>
            </div>

            <div className="rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700">
              Demo {loginRole === 'manager' ? 'approval manager' : 'customer'} login ready: <span className="font-semibold">{loginRole === 'manager' ? 'manager@loaniq.com / Manager@123' : 'customer@loaniq.com / Customer@123'}</span>
            </div>

            {resetSent && (
              <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4 text-xs font-semibold text-emerald-800 animate-in fade-in slide-in-from-top-1 duration-200">
                A simulated password reset instructions has been sent to your email.
              </div>
            )}

            {loginError && (
              <div className="rounded-xl bg-red-50 border border-red-100 p-4 text-xs font-semibold text-red-800 animate-in fade-in slide-in-from-top-1 duration-200">
                {loginError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    placeholder="name@company.com"
                    className={`w-full rounded-2xl border bg-slate-50 py-3.5 pl-10 pr-4 text-sm font-medium outline-none transition-all duration-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200'
                      }`}
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                  />
                </div>
                {errors.email && <p className="text-xs font-medium text-red-500">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Password</label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className={`w-full rounded-2xl border bg-slate-50 py-3.5 pl-10 pr-4 text-sm font-medium outline-none transition-all duration-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200'
                      }`}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Password must be at least 6 characters' }
                    })}
                  />
                </div>
                {errors.password && <p className="text-xs font-medium text-red-500">{errors.password.message}</p>}
              </div>

              {/* Actions */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/35 transition-all duration-200 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center text-sm font-medium text-slate-500">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-blue-600 hover:text-blue-700">
                Register Here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
