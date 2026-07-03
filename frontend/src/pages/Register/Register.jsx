import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AppContext } from '../../context/AppContext';
import { ShieldCheck, User, Mail, Phone, Lock, ArrowRight } from 'lucide-react';

export default function Register() {
  const { register: registerUser } = useContext(AppContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const passwordVal = watch('password');

  const onSubmit = (data) => {
    setLoading(true);
    setRegisterError('');
    setTimeout(() => {
      try {
        registerUser(data.fullName, data.email, data.mobileNumber, data.password);
        setLoading(false);
        navigate('/dashboard');
      } catch (err) {
        setRegisterError(err.message);
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="flex w-full overflow-hidden rounded-none bg-white shadow-2xl lg:flex-row">
        {/* Left Side: Mock Illustration / Pitch (Hidden on mobile) */}
        <div className="relative hidden w-1/2 bg-slate-900 lg:block">
          <div className="absolute inset-0 bg-gradient-to-tl from-blue-700/80 to-slate-950/95 mix-blend-multiply"></div>
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
                Create your account <br />
                and verify instantly.
              </h2>
              <p className="text-slate-300 leading-relaxed text-sm max-w-md">
                "Signing up was seamless. I pre-checked my eligibility first, and the LoanIQ platform guided me through a 4-step wizard with real-time feedback."
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20 text-blue-400 font-bold text-sm">
                  AP
                </div>
                <div>
                  <h5 className="text-sm font-bold">Aditi Prasad</h5>
                  <p className="text-xs text-slate-400">Approved for ₹ 1,50,000</p>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              &copy; {new Date().getFullYear()} LoanIQ Technologies. Fully secured with end-to-end sandbox protection.
            </p>
          </div>
        </div>

        {/* Right Side: Register Form */}
        <div className="flex w-full items-center justify-center p-8 lg:w-1/2 sm:p-12 lg:p-16">
          <div className="w-full max-w-md space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Create Account</h1>
              <p className="text-sm text-slate-500">
                Join LoanIQ to experience modern paperless borrowing.
              </p>
            </div>

            {registerError && (
              <div className="rounded-xl bg-red-50 border border-red-100 p-4 text-xs font-semibold text-red-800">
                {registerError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="John Doe"
                    className={`w-full rounded-2xl border bg-slate-50 py-3 pl-10 pr-4 text-sm font-medium outline-none transition-all duration-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 ${errors.fullName ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200'
                      }`}
                    {...register('fullName', { required: 'Full name is required' })}
                  />
                </div>
                {errors.fullName && <p className="text-xs font-medium text-red-500">{errors.fullName.message}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    placeholder="name@company.com"
                    className={`w-full rounded-2xl border bg-slate-50 py-3 pl-10 pr-4 text-sm font-medium outline-none transition-all duration-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200'
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

              {/* Mobile Number */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Mobile Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    placeholder="+91 99999 88888"
                    className={`w-full rounded-2xl border bg-slate-50 py-3 pl-10 pr-4 text-sm font-medium outline-none transition-all duration-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 ${errors.mobileNumber ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200'
                      }`}
                    {...register('mobileNumber', {
                      required: 'Mobile number is required',
                      pattern: {
                        value: /^[0-9+ ]{10,14}$/,
                        message: 'Enter a valid mobile number'
                      }
                    })}
                  />
                </div>
                {errors.mobileNumber && <p className="text-xs font-medium text-red-500">{errors.mobileNumber.message}</p>}
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className={`w-full rounded-2xl border bg-slate-50 py-3 pl-10 pr-4 text-sm font-medium outline-none transition-all duration-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200'
                      }`}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 6, message: 'Password must be at least 6 characters' }
                    })}
                  />
                </div>
                {errors.password && <p className="text-xs font-medium text-red-500">{errors.password.message}</p>}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className={`w-full rounded-2xl border bg-slate-50 py-3 pl-10 pr-4 text-sm font-medium outline-none transition-all duration-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 ${errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200'
                      }`}
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: (value) => value === passwordVal || 'Passwords do not match'
                    })}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs font-medium text-red-500">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Actions */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/35 transition-all duration-200 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center text-sm font-medium text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-blue-600 hover:text-blue-700">
                Log In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
