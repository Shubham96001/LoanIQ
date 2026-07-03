import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import {
  Sparkles,
  ShieldCheck,
  Clock,
  Zap,
  ArrowRight,
  TrendingUp,
  Award,
  Users,
  CheckCircle2
} from 'lucide-react';

export default function Landing() {
  const { user } = useContext(AppContext);

  const features = [
    {
      title: 'Instant Eligibility Check',
      description: 'Our advanced credit algorithms calculate your risk score and recommend loan amounts in seconds.',
      icon: Sparkles,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      title: 'Secure Document Upload',
      description: 'OCR document readers scan Aadhaar, PAN, and statements instantly with 99.8% precision.',
      icon: ShieldCheck,
      color: 'text-emerald-600 bg-emerald-50'
    },
    {
      title: 'Real-Time Loan Tracking',
      description: 'Follow every stage of your application, from submittal to bank disbursement, with live updates.',
      icon: Clock,
      color: 'text-indigo-600 bg-indigo-50'
    },
    {
      title: 'Fast Approval Process',
      description: 'Frontend AI checks pre-validate documents, enabling under-review loans to clear within hours.',
      icon: Zap,
      color: 'text-amber-600 bg-amber-50'
    }
  ];

  const steps = [
    { number: '01', title: 'Create Account', desc: 'Register in seconds using just basic credentials.' },
    { number: '02', title: 'Check Eligibility', desc: 'Enter basic details to get your credit scoring instantly.' },
    { number: '03', title: 'Submit Application', desc: 'Complete our multi-step form to customize your terms.' },
    { number: '04', title: 'Upload Documents', desc: 'Drop in your KYC & bank papers for rapid OCR analysis.' },
    { number: '05', title: 'Track Approval', desc: 'Watch progress live and get funds in your bank account.' }
  ];

  const testimonials = [
    {
      quote: 'LoanIQ was a game-changer! The AI scanned my PAN and Aadhaar in 5 seconds and I was approved for ₹2,50,000 within 2 hours. Simply brilliant.',
      author: 'Rohit Verma',
      role: 'Salaried Software Engineer',
      amount: 'Approved for ₹2.5 Lakhs',
      rating: 5
    },
    {
      quote: 'As a self-employed retailer, banks asked me for mountains of paperwork. LoanIQ approved my business expansion loan with just a 6-month bank statement.',
      author: 'Priya Patel',
      role: 'Small Business Owner',
      amount: 'Approved for ₹5 Lakhs',
      rating: 5
    },
    {
      quote: 'The eligibility estimator helped me see exactly how my existing EMIs affected my score. I adjusted my tenure and got approved without any rejection risk.',
      author: 'Kabir Mehta',
      role: 'Consultant',
      amount: 'Approved for ₹1.8 Lakhs',
      rating: 5
    }
  ];

  return (
    <div className="flex flex-col bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white py-20 lg:py-28 border-b border-slate-100">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left Col Info */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3.5 py-1 text-sm font-semibold text-blue-700">
                <Zap className="h-4 w-4" />
                <span>Modern Personal Loan Platform</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Get Personal Loans <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Faster and Smarter
                </span>
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0">
                Experience a paperless, AI-powered lending platform. Calculate eligibility in real-time, scan documents instantly, and experience modern fintech convenience.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to={user ? "/apply" : "/register"}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/35 transition-all duration-200"
                >
                  Apply Now
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  to={user ? "/eligibility" : "/login"}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Check Eligibility
                  <Sparkles className="h-5 w-5 text-blue-600" />
                </Link>
              </div>

              {/* Badges/Highlights */}
              <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-8 max-w-md mx-auto lg:mx-0">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-slate-900">100%</span>
                  <span className="text-xs text-slate-500 font-medium">Digital Process</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-slate-900">₹0</span>
                  <span className="text-xs text-slate-500 font-medium">Hidden Charges</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-slate-900">2 Hr</span>
                  <span className="text-xs text-slate-500 font-medium">Avg. Disbursal</span>
                </div>
              </div>
            </div>

            {/* Right Col Graphical Mockup */}
            <div className="lg:col-span-5 relative">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 opacity-10 blur-xl"></div>
              <div className="relative rounded-3xl border border-slate-100 bg-slate-50/50 p-4 shadow-2xl backdrop-blur">
                <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100/80 space-y-6">
                  {/* Mock Loan Application Widget */}
                  <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                        <TrendingUp className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">Instant Estimate</h4>
                        <p className="text-xs text-slate-400">Powered by LoanIQ scoring</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      High Eligibility
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1.5">
                        <span>LOAN AMOUNT</span>
                        <span className="font-bold text-slate-900">₹ 3,50,000</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full w-4/6 rounded-full bg-blue-600"></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-3 text-xs">
                      <div>
                        <span className="text-slate-400">Monthly EMI</span>
                        <p className="font-bold text-slate-900 mt-0.5">₹ 17,250</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Tenure Requested</span>
                        <p className="font-bold text-slate-900 mt-0.5">24 Months</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span>AI Document Matcher Active</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span>No Security Deposit Required</span>
                    </div>
                  </div>

                  <Link
                    to={user ? "/apply" : "/register"}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
                  >
                    Start Paperless Journey
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-50 border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Why Borrowers Trust LoanIQ
            </h2>
            <p className="text-lg text-slate-600">
              We replace legacy banking documentation with instant automated checks, creating a simpler and friendlier borrowing experience.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feat, idx) => (
              <div
                key={idx}
                className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className={`inline-flex rounded-xl p-3 ${feat.color} mb-5`}>
                  <feat.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {feat.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {feat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              The 5-Step Approval Flow
            </h2>
            <p className="text-lg text-slate-600">
              Apply in minutes, scan papers instantly, and get your loan verified with minimal delay.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-5 relative">
            {/* Step lines connecting */}
            <div className="absolute top-1/4 left-10 right-10 hidden md:block h-0.5 bg-slate-100 z-0"></div>

            {steps.map((step, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center text-center group">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white border-2 border-slate-200 text-lg font-extrabold text-slate-900 group-hover:border-blue-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all duration-300 shadow-sm">
                  {step.number}
                </div>
                <h4 className="mt-5 text-base font-bold text-slate-900">{step.title}</h4>
                <p className="mt-2 text-xs leading-relaxed text-slate-500 max-w-[170px]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              What Our Customers Say
            </h2>
            <p className="text-lg text-slate-600">
              Hear from students, salary earners, and entrepreneurs who scaled their finances with LoanIQ.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {testimonials.map((t, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex gap-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <span key={i} className="text-amber-400 text-lg">★</span>
                    ))}
                  </div>
                  <p className="text-sm italic leading-relaxed text-slate-600">"{t.quote}"</p>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-slate-50 pt-4">
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">{t.author}</h5>
                    <p className="text-xs text-slate-400">{t.role}</p>
                  </div>
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700">
                    {t.amount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="bg-gradient-to-br from-blue-700 to-indigo-800 py-16 text-white">
        <div className="mx-auto max-w-5xl px-4 text-center space-y-6">
          <h2 className="text-3xl font-bold sm:text-4xl">Ready to get your loan approved?</h2>
          <p className="text-blue-100 max-w-2xl mx-auto">
            Take a minute to verify your eligibility score. No impact on your credit history, fully digital simulation, instant results.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              to={user ? "/apply" : "/register"}
              className="w-full sm:w-auto rounded-2xl bg-white px-8 py-4 text-base font-bold text-blue-700 shadow-md hover:bg-blue-50 transition-colors"
            >
              Apply Online Now
            </Link>
            <Link
              to={user ? "/eligibility" : "/login"}
              className="w-full sm:w-auto rounded-2xl border border-blue-500 px-8 py-4 text-base font-bold text-white hover:bg-blue-600/30 transition-colors"
            >
              Test Eligibility Score
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-sm border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4 border-b border-slate-800 pb-8 mb-8">
            <div className="space-y-4">
              <span className="text-xl font-extrabold text-white">LoanIQ</span>
              <p className="text-xs leading-relaxed text-slate-400">
                LoanIQ is a technology-enabled simulated personal lending software platform. Helping users simulate personal, student, and business credit scores.
              </p>
            </div>
            <div>
              <h5 className="font-bold text-white mb-3">Products</h5>
              <ul className="space-y-2 text-xs">
                <li><a href="#" className="hover:text-white transition-colors">Personal Loans</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Student Education Loans</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Small Business Credit Lines</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-white mb-3">Legal</h5>
              <ul className="space-y-2 text-xs">
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Simulated Lending Disclosures</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-white mb-3">Support</h5>
              <p className="text-xs text-slate-400">Email: support@loaniq.example.com</p>
              <p className="text-xs text-slate-400 mt-1">Phone: +91 1800 123 4567</p>
            </div>
          </div>
          <p className="text-center text-xs text-slate-500">
            &copy; {new Date().getFullYear()} LoanIQ Technologies. All simulated rights reserved. Real personal loan approvals require standard institutional checks.
          </p>
        </div>
      </footer>
    </div>
  );
}
