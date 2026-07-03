import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AppContext } from '../../context/AppContext';
import { Sparkles, ShieldCheck, HelpCircle, ArrowRight, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export default function Eligibility() {
  const { eligibilityResult, predictEligibility } = useContext(AppContext);
  const navigate = useNavigate();
  const [calculating, setCalculating] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: eligibilityResult ? eligibilityResult.inputs : {
      age: 28,
      income: 75000,
      employmentType: 'Salaried',
      existingEmi: 5000,
      loanAmount: 250000,
      tenure: 24
    }
  });

  const onSubmit = (data) => {
    setCalculating(true);
    setTimeout(() => {
      predictEligibility(data);
      setCalculating(false);
    }, 1500); // Simulate ML predictive algorithm run
  };

  const handleApply = () => {
    // Navigate to apply page, passing recommended loan terms if necessary
    navigate('/apply', { state: { fromEligibility: true } });
  };

  // Helper colors for risk badges
  const getRiskStyles = (risk) => {
    switch (risk) {
      case 'Eligible':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-100',
          text: 'text-emerald-600',
          gaugeColor: 'stroke-emerald-500',
          badge: 'bg-emerald-500'
        };
      case 'Moderately Eligible':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-100',
          text: 'text-amber-600',
          gaugeColor: 'stroke-amber-500',
          badge: 'bg-amber-500'
        };
      case 'High Risk':
      default:
        return {
          bg: 'bg-red-50 text-red-700 border-red-100',
          text: 'text-red-600',
          gaugeColor: 'stroke-red-500',
          badge: 'bg-red-500'
        };
    }
  };

  // SVG parameters for radial scoring gauge
  const radius = 60;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const currentResult = eligibilityResult;
  const score = currentResult ? currentResult.score : 0;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const riskStyle = getRiskStyles(currentResult?.riskLevel);

  return (
    <div className="space-y-8 p-4 md:p-8">
      {/* Top Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Credit Score Predictor</h1>
        <p className="text-slate-500 text-sm mt-1">
          Our AI Loan Eligibility Model forecasts approval probability and credit capacity.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Col: Prediction Form */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-50 pb-4 mb-6">
              Financial & Profile Details
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Age */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Applicant Age</label>
                  <input
                    type="number"
                    placeholder="25"
                    className={`w-full rounded-2xl border bg-slate-50 py-3 px-4 text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 ${
                      errors.age ? 'border-red-500' : 'border-slate-200'
                    }`}
                    {...register('age', { required: 'Age is required', min: 18, max: 75 })}
                  />
                  {errors.age && <p className="text-xs text-red-500">Age must be between 18 and 75</p>}
                </div>

                {/* Employment Type */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Employment Type</label>
                  <select
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 px-4 text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white focus:ring-4"
                    {...register('employmentType')}
                  >
                    <option value="Salaried">Salaried Employee</option>
                    <option value="Self-Employed">Self-Employed Consultant</option>
                    <option value="Business Owner">Small Business Owner</option>
                    <option value="Student">Student (with Stipends)</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Monthly Income */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Monthly Net Income (₹)</label>
                  <input
                    type="number"
                    placeholder="50000"
                    className={`w-full rounded-2xl border bg-slate-50 py-3 px-4 text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 ${
                      errors.income ? 'border-red-500' : 'border-slate-200'
                    }`}
                    {...register('income', { required: 'Income is required', min: 5000 })}
                  />
                  {errors.income && <p className="text-xs text-red-500">Income is required (min ₹5,000)</p>}
                </div>

                {/* Existing EMI commitments */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Existing Monthly EMIs (₹)</label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 px-4 text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white focus:ring-4"
                    {...register('existingEmi')}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Loan Amount */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Requested Amount (₹)</label>
                  <input
                    type="number"
                    placeholder="100000"
                    className={`w-full rounded-2xl border bg-slate-50 py-3 px-4 text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 ${
                      errors.loanAmount ? 'border-red-500' : 'border-slate-200'
                    }`}
                    {...register('loanAmount', { required: 'Loan amount is required', min: 10000 })}
                  />
                  {errors.loanAmount && <p className="text-xs text-red-500">Loan amount required (min ₹10,000)</p>}
                </div>

                {/* Loan Tenure */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Tenure Requested (Months)</label>
                  <select
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 px-4 text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white"
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

              <button
                type="submit"
                disabled={calculating}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 text-sm font-bold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {calculating ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    <span>AI Model Scoring in progress...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    <span>Run AI Eligibility Check</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Col: Prediction Output */}
        <div className="lg:col-span-5">
          {!currentResult ? (
            // Placeholder State
            <div className="h-full rounded-2xl border border-dashed border-slate-200 bg-white p-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="rounded-2xl bg-blue-50 p-4 text-blue-600">
                <Sparkles className="h-8 w-8 animate-pulse" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-lg">Predictive Scoring Idle</h4>
                <p className="text-xs text-slate-500 max-w-xs leading-relaxed mt-2 mx-auto">
                  Provide income details and requested loan amount, then trigger the AI model to calculate eligibility score.
                </p>
              </div>
            </div>
          ) : (
            // Scoring Result State
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-6 animate-in fade-in duration-300">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-50 pb-4">
                Credit Rating Assessment
              </h3>

              {/* Circular score gauge */}
              <div className="flex flex-col items-center justify-center text-center">
                <div className="relative flex items-center justify-center">
                  <svg className="h-36 w-36 transform -rotate-90">
                    <circle
                      cx="72"
                      cy="72"
                      r={radius}
                      className="stroke-slate-100 fill-transparent"
                      strokeWidth={strokeWidth}
                    />
                    <circle
                      cx="72"
                      cy="72"
                      r={radius}
                      className={`fill-transparent transition-all duration-1000 ease-out ${riskStyle.gaugeColor}`}
                      strokeWidth={strokeWidth}
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-slate-900">{score}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AI Credit Score</span>
                  </div>
                </div>

                <div className={`mt-5 rounded-full border px-4 py-1.5 text-xs font-bold ${riskStyle.bg}`}>
                  Risk Level: {currentResult.riskLevel}
                </div>
              </div>

              {/* Numeric details */}
              <div className="divide-y divide-slate-100 bg-slate-50 rounded-2xl p-4 text-xs font-semibold space-y-2">
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400">Debt-to-Income (DTI)</span>
                  <span className="text-slate-900 font-bold">{currentResult.dtiRatio}%</span>
                </div>
                <div className="flex justify-between items-center pt-2 py-1">
                  <span className="text-slate-400">Monthly Installment (EMI)</span>
                  <span className="text-slate-900 font-bold">₹ {currentResult.calculatedEmi.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-slate-400">AI Recommended Loan</span>
                  <span className="text-blue-600 font-extrabold text-sm">₹ {currentResult.recommendedAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Factors lists */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Info className="h-4 w-4 text-slate-400" />
                  Key Factors Evaluated
                </span>
                <div className="space-y-2">
                  {currentResult.factors.length === 0 ? (
                    <div className="flex items-start gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-xl p-3">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                      <p>All credit ratios are highly healthy! High probability of instant auto-approval.</p>
                    </div>
                  ) : (
                    currentResult.factors.map((fact, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs font-semibold text-amber-700 bg-amber-50 rounded-xl p-3">
                        <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                        <p>{fact}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Quick Apply Action */}
              {currentResult.recommendedAmount > 0 && (
                <button
                  onClick={handleApply}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-3.5 text-sm font-bold text-white hover:bg-slate-800 transition-colors shadow-md"
                >
                  Apply for Loan
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
