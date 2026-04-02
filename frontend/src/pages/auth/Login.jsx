import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import * as authApi from '../../api/auth';
import LoginIcon from '../../components/LoginIcon';

const DEMO_CREDENTIALS = [
  { role: 'Admin', email: 'admin@fyp.com', password: 'password' },
  { role: 'Student', email: 'student@fyp.com', password: 'password' },
  { role: 'Mentor', email: 'mentor@fyp.com', password: 'password' },
];

export default function Login() {
  const { login, isAuthenticated, loading, role } = useAuth();
  const [email, setEmail] = useState('admin@fyp.com');
  const [password, setPassword] = useState('password');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-indigo-100" />
          <p className="text-slate-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    const to = role === 'Admin' ? '/admin/dashboard' : role === 'Mentor' ? '/mentor/dashboard' : '/student/dashboard';
    return <Navigate to={to} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const { token, user } = await authApi.login({ email, password });
      login(user, token, rememberMe);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoLogin = async (cred) => {
    setError('');
    setSubmitting(true);
    try {
      const { token, user } = await authApi.login({ email: cred.email, password: cred.password });
      login(user, token, true);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left: Branding / Visual panel */}
      <div className="relative hidden lg:flex lg:w-[48%] flex-col justify-between p-10 xl:p-14 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #312e81 100%)',
          }}
        />
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(148, 137, 121, 0.2) 0%, transparent 50%)' }} />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(223, 208, 184, 0.1) 0%, transparent 50%)' }} />
        <div className="absolute inset-0 opacity-60" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />


        <div className="relative space-y-6 text-center">
          <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
            FYP Portal
          </h1>
          <p className="text-white/80 text-lg max-w-sm mx-auto">
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

      {/* Right: Form panel */}
      <div className="flex-1 flex flex-col min-h-screen bg-slate-50/80">
        <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 lg:p-12">
          <div className="w-full max-w-md">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm font-medium mb-8 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Back to Home
            </Link>

            <>
              {/* Lock icon — flat, no 3D */}
                <div className="mb-8 flex justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-600 shadow-md">
                    <svg className="h-10 w-10 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path d="M12 2a4 4 0 0 1 4 4v2h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h2V6a4 4 0 0 1 4-4zm0 2a2 2 0 0 0-2 2v2h4V6a2 2 0 0 0-2-2z" />
                    </svg>
                  </div>
                </div>
                <div className="mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Welcome back</h2>
                  <p className="text-slate-500 mt-1">Sign in to continue your FYP journey</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                      placeholder="you@university.edu"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((p) => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.9 19.11l-1.1-1.1m0 0l-2.44-2.43M12 4.249c-1.514 0-2.77.799-3.58 1.64l-2.44 2.43a9.965 9.965 0 016.02 4.68 9.97 9.97 0 001.563-3.029m5.858.908a3 3 0 114.243 4.243" /></svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/20"
                      />
                      <span className="text-sm text-slate-600">Remember me</span>
                    </label>
                    <Link to="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">Forgot password?</Link>
                  </div>
                  {error && <p className="text-sm text-red-600">{error}</p>}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 px-4 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:ring-offset-2 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    {submitting ? 'Signing in…' : 'Sign in'}
                    {!submitting && <LoginIcon className="w-5 h-5" />}
                  </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-500">
                  Don&apos;t have an account?{' '}
                  <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-700">
                    Register
                  </Link>
                </p>
                <p className="mt-4 text-center text-xs text-slate-400">
                  Demo: <button type="button" onClick={() => handleDemoLogin(DEMO_CREDENTIALS[0])} className="text-indigo-500 hover:underline">Admin</button>
                  {' · '}<button type="button" onClick={() => handleDemoLogin(DEMO_CREDENTIALS[1])} className="text-indigo-500 hover:underline">Student</button>
                  {' · '}<button type="button" onClick={() => handleDemoLogin(DEMO_CREDENTIALS[2])} className="text-indigo-500 hover:underline">Mentor</button>
                  {' '}(password: <code className="bg-slate-200 px-1 rounded">password</code>)
                </p>
            </>
          </div>
        </div>

        {/* Mobile: show branding strip at bottom */}
        <div className="lg:hidden py-6 px-6 border-t border-slate-200 bg-white/50">
          <div className="flex items-center justify-center">
            <span className="text-sm font-medium text-slate-600">FYP Portal</span>
          </div>
        </div>
      </div>
    </div>
  );
}
