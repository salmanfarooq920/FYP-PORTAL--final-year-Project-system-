import { useState } from 'react';
import { Link } from 'react-router-dom';
import * as authApi from '../../api/auth';

const DEPARTMENTS = ['Computer Science', 'Software Engineering', 'Electrical Engineering', 'Information Technology', 'Other'];

const inputClass = 'w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors';
const labelClass = 'block text-sm font-medium text-slate-700 mb-1';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    rollNumber: '',
    department: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const validate = () => {
    if (!form.name.trim()) return 'Full name is required.';
    if (!form.email.trim()) return 'Email is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Enter a valid email address.';
    if (!form.password) return 'Password is required.';
    if (form.password.length < 6) return 'Password must be at least 6 characters.';
    if (form.password !== form.confirmPassword) return 'Passwords do not match.';
    if (!form.rollNumber.trim()) return 'Roll number is required.';
    if (!form.department) return 'Please select a department.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await authApi.register({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        rollNumber: form.rollNumber.trim(),
        department: form.department,
        role: 'Student',
      });
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="h-screen flex flex-col lg:flex-row overflow-hidden">
        <div className="relative hidden lg:flex lg:w-[48%] min-h-0 flex-col justify-between p-10 xl:p-14 overflow-hidden">
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #312e81 100%)' }} />
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(148, 137, 121, 0.2) 0%, transparent 50%)' }} />
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(223, 208, 184, 0.1) 0%, transparent 50%)' }} />
          <div className="absolute inset-0 opacity-60" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
              <span className="text-white font-bold text-lg">LLU</span>
            </div>
          </div>
          <div className="relative space-y-6">
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight">FYP Portal</h1>
            <p className="text-white/80 text-lg max-w-sm">Lahore Leads University — Empowering Minds, Transforming Lives.</p>
            <div className="flex gap-2 pt-2">
              <div className="w-2 h-2 rounded-full bg-indigo-400" />
              <div className="w-2 h-2 rounded-full bg-white/40" />
              <div className="w-2 h-2 rounded-full bg-white/20" />
            </div>
          </div>
          <div className="relative text-white/50 text-sm">Lahore Leads University · Final Year Project Management</div>
        </div>
        <div className="flex-1 flex flex-col min-h-0 bg-slate-50/80 overflow-hidden">
          <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 lg:p-12 overflow-auto scrollbar-hide">
            <div className="w-full max-w-md">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Registration submitted</h2>
              <p className="text-slate-500 mt-1 mb-8">
                Contact your administrator for account activation. You will be able to sign in once your account is approved.
              </p>
              <Link
                to="/login"
                className="w-full py-3.5 px-4 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:ring-offset-2 transition-all flex items-center justify-center gap-2"
              >
                Go to Sign in
              </Link>
            </div>
          </div>
          <div className="lg:hidden py-6 px-6 border-t border-slate-200 bg-white/50">
            <div className="flex items-center justify-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold text-xs">LLU</span>
              </div>
              <span className="text-sm font-medium text-slate-600">FYP Portal · Lahore Leads University</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden">
      {/* Left: Branding / Visual panel - same as Login */}
      <div className="relative hidden lg:flex lg:w-[48%] min-h-0 flex-col justify-between p-10 xl:p-14 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #312e81 100%)',
          }}
        />
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(148, 137, 121, 0.2) 0%, transparent 50%)' }} />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(223, 208, 184, 0.1) 0%, transparent 50%)' }} />
        <div className="absolute inset-0 opacity-60" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        <div className="relative">
          <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
            <span className="text-white font-bold text-lg">LLU</span>
          </div>
        </div>
        <div className="relative space-y-6">
          <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
            FYP Portal
          </h1>
          <p className="text-white/80 text-lg max-w-sm">
            Lahore Leads University — Empowering Minds, Transforming Lives.
          </p>
          <div className="flex gap-2 pt-2">
            <div className="w-2 h-2 rounded-full bg-indigo-400" />
            <div className="w-2 h-2 rounded-full bg-white/40" />
            <div className="w-2 h-2 rounded-full bg-white/20" />
          </div>
        </div>
        <div className="relative text-white/50 text-sm">
          Lahore Leads University · Final Year Project Management
        </div>
      </div>

      {/* Right: Form panel - same as Login, scrollable when needed, no scrollbar */}
      <div className="flex-1 flex flex-col min-h-0 bg-slate-50/80 overflow-hidden">
        <div className="flex-1 flex flex-col items-center justify-center min-h-0 overflow-y-auto scrollbar-hide p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-md py-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm font-medium mb-4 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Back to Home
            </Link>

            <div className="mb-5">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Create account</h2>
              <p className="text-slate-500 text-sm mt-0.5">Register to start your FYP journey</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label htmlFor="name" className={labelClass}>Full name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Your full name"
                  autoComplete="name"
                />
              </div>
              <div>
                <label htmlFor="email" className={labelClass}>Email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="you@university.edu"
                  autoComplete="email"
                />
              </div>
              <div>
                <label htmlFor="rollNumber" className={labelClass}>Roll number</label>
                <input
                  id="rollNumber"
                  type="text"
                  name="rollNumber"
                  value={form.rollNumber}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="e.g. 71461"
                />
              </div>
              <div>
                <label htmlFor="department" className={labelClass}>Department</label>
                <select
                  id="department"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select department</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="password" className={labelClass}>Password</label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className={labelClass}>Confirm password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Re-enter password"
                  autoComplete="new-password"
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:ring-offset-2 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {submitting ? 'Submitting…' : 'Register'}
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Mobile: branding strip at bottom - same as Login */}
        <div className="lg:hidden py-6 px-6 border-t border-slate-200 bg-white/50">
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs">LLU</span>
            </div>
            <span className="text-sm font-medium text-slate-600">FYP Portal · Lahore Leads University</span>
          </div>
        </div>
      </div>
    </div>
  );
}
