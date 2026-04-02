import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function LiveTimer() {
  const [time, setTime] = useState(() => {
    const n = new Date();
    return [n.getHours(), n.getMinutes(), n.getSeconds()].map((v) => String(v).padStart(2, '0')).join(':');
  });

  useEffect(() => {
    const id = setInterval(() => {
      const n = new Date();
      setTime([n.getHours(), n.getMinutes(), n.getSeconds()].map((v) => String(v).padStart(2, '0')).join(':'));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return <span className="font-mono text-sm font-semibold text-white/90">{time}</span>;
}

export default function Header({ onMenuClick }) {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header
      className="h-16 sticky top-0 z-30 flex items-center px-4 sm:px-6 border-b border-white/10 shadow-md"
      style={{ backgroundColor: 'rgba(26, 54, 93, 0.98)' }}
    >
      <button
        type="button"
        onClick={onMenuClick}
        className="lg:hidden p-2.5 -ml-2 rounded-xl hover:bg-white/10 text-white transition-colors"
        aria-label="Menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div className="flex-1 flex items-center justify-center lg:justify-start gap-4">
        <Link
          to={user?.role === 'Admin' ? '/admin/dashboard' : user?.role === 'Mentor' ? '/mentor/dashboard' : '/student/dashboard'}
          className="hidden sm:flex items-center gap-2.5 rounded-xl px-3 py-1.5 hover:bg-white/5 transition-colors"
        >
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm overflow-hidden">
            <img src="/llu-logo.png" alt="LLU" className="w-full h-full object-cover" style={{ transform: 'scale(1.6)' }} />
          </div>
          <span className="font-semibold text-white">FYP Portal</span>
        </Link>
        <div className="px-4 py-2 rounded-xl bg-white/10 border border-white/20">
          <LiveTimer />
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button className="p-2.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors" aria-label="Notifications">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/10 ml-1 transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-amber-400/90 text-[#1a365d] flex items-center justify-center font-semibold text-sm border-2 border-white/30">
              {user?.avatar ? <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" /> : (user?.name?.charAt(0) || 'U')}
            </div>
            <svg className={`w-4 h-4 text-white/70 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} aria-hidden />
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-xl border border-slate-200 py-2 z-20">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="font-semibold text-slate-900 truncate">{user?.name}</p>
                  <p className="text-sm text-slate-500 truncate">{user?.email}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{user?.role}</p>
                </div>
                <button
                  type="button"
                  onClick={() => { logout(); setDropdownOpen(false); }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-red-50 text-sm text-red-600 font-medium rounded-b-xl"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
