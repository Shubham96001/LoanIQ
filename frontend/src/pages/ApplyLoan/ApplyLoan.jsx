import React, { useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AppContext } from '../../context/AppContext';
import { Check, ArrowLeft, ArrowRight, ClipboardList, ShieldAlert } from 'lucide-react';

export default function ApplyLoan() {
  const { user, submitApplication, eligibilityResult } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // Read recommendation if we just redirected from Eligibility check
  const defaultAmount = location.state?.fromEligibility && eligibilityResult
    ? eligibilityResult.recommendedAmount
    : 100000;
  const defaultTenure = location.state?.fromEligibility && eligibilityResult
    ? eligibilityResult.inputs.tenure
    : 12;

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      fullName: user?.name || '',
      email: user?.email || '',
      mobile: user?.mobile || '',
      dob: '1995-08-15',
      gender: 'Male',
      address: user?.address || '',
      employmentType: eligibilityResult?.inputs.employmentType || 'Salaried',
      companyName: 'Fintech Solutions Ltd',
      monthlyIncome: eligibilityResult?.inputs.income || 75000,
      experience: 4,
      loanType: 'Personal Loan',
      loanAmount: defaultAmount,
      loanPurpose: 'Home Renovation',
      tenure: defaultTenure
    }
  });

  const allFormData = watch();

  const steps = [
    { num: 1, label: 'Personal Details' },
    { num: 2, label: 'Employment Details' },
    { num: 3, label: 'Loan Details' },
    { num: 4, label: 'Review & Submit' }
  ];

  const handleNext = async () => {
    // Perform step validation before advancing
    let isValid = false;
    if (currentStep === 1) {
      isValid = await trigger(['fullName', 'dob', 'mobile', 'email', 'address']);
    } else if (currentStep === 2) {
      isValid = await trigger(['employmentType', 'companyName', 'monthlyIncome', 'experience']);
    } else if (currentStep === 3) {
      isValid = await trigger(['loanType', 'loanAmount', 'loanPurpose', 'tenure']);
    }

    if (isValid) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => prev - 1);
  };

  const onSubmit = async () => {
    // Final Form Submission
    setSubmitted(true);
    setTimeout(async () => {
      const appId = await submitApplication(allFormData);
      navigate('/documents'); // Auto redirect to upload center
    }, 1800);
  };

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-4xl mx-auto">
      {/* Top Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Personal Loan Application</h1>
        <p className="text-slate-500 text-sm mt-1">Complete the 4-step wizard to register your application.</p>
      </div>

      {/* Progress Bar Header */}
      <div className="relative flex items-center justify-between">
        <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-slate-100 -translate-y-1/2 z-0"></div>
        {steps.map(step => (
          <div key={step.num} className="relative z-10 flex flex-col items-center">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ring-4 ring-white ${currentStep > step.num
                  ? 'bg-emerald-500 text-white'
                  : currentStep === step.num
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-slate-200 text-slate-500'
                }`}
            >
              {currentStep > step.num ? <Check className="h-5 w-5" /> : step.num}
            </div>
            <span
              className={`hidden sm:block text-[11px] font-bold mt-2 ${currentStep === step.num ? 'text-blue-600' : 'text-slate-400'
                }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>

      {/* Form Container */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 md:p-8 shadow-sm">
        {/* STEP 1: Personal Details */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-50 pb-3">
              Step 1: Personal Details
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Full Name</label>
                <input
                  type="text"
                  className={`w-full rounded-2xl border bg-slate-50 py-3 px-4 text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 ${errors.fullName ? 'border-red-500' : 'border-slate-200'
                    }`}
                  {...register('fullName', { required: 'Name is required' })}
                />
                {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Date of Birth</label>
                <input
                  type="date"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 px-4 text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white"
                  {...register('dob', { required: 'DOB is required' })}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Gender</label>
                <select
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 px-4 text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white"
                  {...register('gender')}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Mobile Number</label>
                <input
                  type="tel"
                  className={`w-full rounded-2xl border bg-slate-50 py-3 px-4 text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white ${errors.mobile ? 'border-red-500' : 'border-slate-200'
                    }`}
                  {...register('mobile', { required: 'Mobile is required' })}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Address</label>
                <input
                  type="email"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 px-4 text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white"
                  {...register('email', { required: 'Email is required' })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Residential Address</label>
                <input
                  type="text"
                  placeholder="Street name, landmark, City, ZIP"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 px-4 text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white"
                  {...register('address', { required: 'Address is required' })}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Employment Details */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-50 pb-3">
              Step 2: Employment & Income Details
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Employment Type</label>
                <select
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 px-4 text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white"
                  {...register('employmentType')}
                >
                  <option value="Salaried">Salaried Employee</option>
                  <option value="Self-Employed">Self-Employed</option>
                  <option value="Business Owner">Business Owner</option>
                  <option value="Student">Student (With Stipends)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Employer / Company Name</label>
                <input
                  type="text"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 px-4 text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white"
                  {...register('companyName', { required: 'Company is required' })}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Monthly Net Income (₹)</label>
                <input
                  type="number"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 px-4 text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white"
                  {...register('monthlyIncome', { required: 'Income is required', min: 1000 })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Work Experience (Years)</label>
                <input
                  type="number"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 px-4 text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white"
                  {...register('experience', { required: 'Experience is required' })}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Loan Details */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-50 pb-3">
              Step 3: Loan Terms & Specifics
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Loan Product</label>
                <select
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 px-4 text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white"
                  {...register('loanType')}
                >
                  <option value="Personal Loan">Personal Loan</option>
                  <option value="Student Loan">Student Loan</option>
                  <option value="Business Loan">Business Expansion Loan</option>
                  <option value="Home Renovation">Home Improvement Loan</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Loan Amount (₹)</label>
                <input
                  type="number"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 px-4 text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white"
                  {...register('loanAmount', { required: 'Amount required', min: 10000 })}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Purpose of Loan</label>
                <input
                  type="text"
                  placeholder="e.g. Higher Education, medical bills, wedding"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 px-4 text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white"
                  {...register('loanPurpose', { required: 'Purpose is required' })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Tenure Preference (Months)</label>
                <select
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 px-4 text-sm font-semibold outline-none focus:border-blue-500"
                  {...register('tenure')}
                >
                  <option value="6">6 Months</option>
                  <option value="12">12 Months</option>
                  <option value="18">18 Months</option>
                  <option value="24">24 Months</option>
                  <option value="36">36 Months</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Review & Submit */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-50 pb-3">
              Step 4: Summary & Declaration
            </h3>

            <div className="rounded-2xl border border-slate-100 overflow-hidden text-xs">
              {/* Personal */}
              <div className="bg-slate-50/50 p-4 border-b border-slate-100">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-bold text-slate-800 uppercase tracking-wide">Personal Details</h4>
                  <button onClick={() => setCurrentStep(1)} className="text-blue-600 font-bold hover:underline">Edit</button>
                </div>
                <div className="grid gap-3 sm:grid-cols-3 font-semibold text-slate-600">
                  <div>Name: <span className="text-slate-900">{allFormData.fullName}</span></div>
                  <div>DOB: <span className="text-slate-900">{allFormData.dob}</span></div>
                  <div>Mobile: <span className="text-slate-900">{allFormData.mobile}</span></div>
                  <div className="sm:col-span-3">Address: <span className="text-slate-900">{allFormData.address}</span></div>
                </div>
              </div>

              {/* Employment */}
              <div className="p-4 border-b border-slate-100">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-bold text-slate-800 uppercase tracking-wide">Employment Details</h4>
                  <button onClick={() => setCurrentStep(2)} className="text-blue-600 font-bold hover:underline">Edit</button>
                </div>
                <div className="grid gap-3 sm:grid-cols-3 font-semibold text-slate-600">
                  <div>Type: <span className="text-slate-900">{allFormData.employmentType}</span></div>
                  <div>Company: <span className="text-slate-900">{allFormData.companyName}</span></div>
                  <div>Monthly Income: <span className="text-slate-900">₹ {parseFloat(allFormData.monthlyIncome).toLocaleString()}</span></div>
                </div>
              </div>

              {/* Loan details */}
              <div className="bg-slate-50/50 p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-bold text-slate-800 uppercase tracking-wide">Loan Terms</h4>
                  <button onClick={() => setCurrentStep(3)} className="text-blue-600 font-bold hover:underline">Edit</button>
                </div>
                <div className="grid gap-3 sm:grid-cols-3 font-semibold text-slate-600">
                  <div>Product: <span className="text-slate-900">{allFormData.loanType}</span></div>
                  <div>Amount: <span className="text-blue-600 font-extrabold">₹ {parseFloat(allFormData.loanAmount).toLocaleString()}</span></div>
                  <div>Tenure: <span className="text-slate-900">{allFormData.tenure} Months</span></div>
                  <div className="sm:col-span-3">Purpose: <span className="text-slate-900">{allFormData.loanPurpose}</span></div>
                </div>
              </div>
            </div>

            {/* Declaration disclaimer box */}
            <div className="rounded-2xl bg-blue-50 border border-blue-100 p-4 flex gap-3 text-xs leading-relaxed text-blue-800 font-semibold">
              <ClipboardList className="h-5 w-5 text-blue-600 shrink-0" />
              <p>
                By clicking submit, I authorize LoanIQ to retrieve my KYC data and process this application through the client-side validation models.
              </p>
            </div>
          </div>
        )}

        {/* Form Controls */}
        <div className="mt-8 flex justify-between items-center border-t border-slate-100 pt-6">
          {currentStep > 1 && (
            <button
              onClick={handlePrev}
              type="button"
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
          )}

          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              type="button"
              className="ml-auto flex items-center gap-1.5 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-blue-700"
            >
              <span>Continue</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={onSubmit}
              disabled={submitted}
              type="button"
              className="ml-auto flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-extrabold text-white shadow-md hover:bg-emerald-700 disabled:opacity-50"
            >
              {submitted ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  <span>Registering Loan Application...</span>
                </>
              ) : (
                <>
                  <span>Submit Application</span>
                  <Check className="h-4 w-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
