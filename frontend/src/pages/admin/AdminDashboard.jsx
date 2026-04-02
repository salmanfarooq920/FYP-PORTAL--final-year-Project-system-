import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const QUICK_LINKS = [
  { to: '/admin/groups', label: 'FYP Groups', desc: 'Manage student groups', icon: 'people', accent: 'indigo' },
  { to: '/admin/milestones', label: 'Milestones', desc: 'Create & manage deadlines', icon: 'flag', accent: 'emerald' },
  { to: '/admin/projects', label: 'Projects', desc: 'View all projects', icon: 'folder', accent: 'amber' },
  { to: '/admin/users', label: 'Accounts', desc: 'Users & roles', icon: 'users', accent: 'slate' },
  { to: '/admin/announcements', label: 'Announcements', desc: 'Broadcast messages', icon: 'megaphone', accent: 'violet' },
  { to: '/admin/reports', label: 'Reports', desc: 'Analytics & exports', icon: 'bar-chart', accent: 'rose' },
];

const GETTING_STARTED = [
  'Create milestones and set deadlines for the term.',
  'Review FYP groups and finalize team formations.',
  'Use Announcements to share important updates with students and mentors.',
];

const accentIconBg = {
  indigo: 'bg-indigo-500',
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  slate: 'bg-slate-600',
  violet: 'bg-violet-500',
  rose: 'bg-rose-500',
};

const accentBorderColor = {
  indigo: '#6366f1',
  emerald: '#10b981',
  amber: '#f59e0b',
  slate: '#475569',
  violet: '#8b5cf6',
  rose: '#f43f5e',
};

const iconSvg = (icon) => {
  const cls = 'w-5 h-5 text-white';
  switch (icon) {
    case 'people':
      return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
    case 'flag':
      return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>;
    case 'folder':
      return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>;
    case 'users':
      return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
    case 'megaphone':
      return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13h3.126M18 13h-3.126" /></svg>;
    case 'bar-chart':
      return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
    default:
      return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>;
  }
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const displayName = user?.name?.split(' ')[0] || 'Admin';

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="mx-auto max-w-6xl w-full space-y-10 rounded-xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
      {/* Welcome, Admin — more color combination + effects */}
      <header className="relative overflow-hidden rounded-2xl border border-slate-200/80 px-6 py-8 sm:px-10 sm:py-10 animate-dashboard-enter" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 20%, #0d9488 40%, #06b6d4 55%, #8b5cf6 70%, #d946ef 85%, #d97706 100%)', backgroundSize: '200% 200%' }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_70%_0%,rgba(255,255,255,0.2),transparent_50%)] pointer-events-none" aria-hidden />
        <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-amber-400/35 blur-3xl pointer-events-none animate-triple-glow" aria-hidden />
        <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-teal-400/35 blur-2xl pointer-events-none animate-triple-glow-delay" aria-hidden />
        <div className="absolute top-1/2 left-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-400/20 blur-3xl pointer-events-none" aria-hidden style={{ animation: 'tripleGlow 6s ease-in-out infinite 1s' }} />
        <div className="absolute bottom-4 right-20 h-16 w-16 rounded-full bg-cyan-400/25 blur-2xl pointer-events-none" aria-hidden style={{ animation: 'tripleGlow 5s ease-in-out infinite 0.3s' }} />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5 sm:gap-6">
            <div className="relative">
              <div className="absolute -inset-1 rounded-2xl opacity-50 blur animate-iconRingPulse" style={{ background: 'linear-gradient(135deg, #818cf8, #22d3ee, #a78bfa, #f472b6, #fbbf24)' }} aria-hidden />
              <div className="welcome-icon-float relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/25 backdrop-blur-sm ring-2 ring-white/40">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div>
              <p className="welcome-greeting text-sm font-medium uppercase tracking-widest sm:text-base" style={{ color: 'rgba(255,255,255,0.95)', textShadow: '0 0 20px rgba(129,140,248,0.5)' }}>
                Welcome,
              </p>
              <h1 className="welcome-name text-3xl font-bold tracking-tight sm:text-4xl" style={{ background: 'linear-gradient(90deg, #fff 0%, #e0e7ff 50%, #cffafe 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', color: 'transparent' }}>
                {displayName}
              </h1>
              <p className="welcome-tagline mt-2 max-w-md text-base text-white/90 sm:text-lg" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                Manage FYP groups, milestones, and users from the dashboard.
              </p>
            </div>
          </div>
          <div className="hidden shrink-0 sm:block">
            <div className="welcome-tagline rounded-xl border border-white/30 bg-white/20 px-4 py-3 text-right backdrop-blur-sm shadow-inner" style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3), 0 2px 8px rgba(0,0,0,0.08)' }}>
              <p className="text-xs font-medium uppercase tracking-wider" style={{ color: '#fef3c7' }}>{dateStr.split(',')[0]}</p>
              <p className="text-sm font-semibold text-white">{dateStr.split(',').slice(1).join(',').trim()}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Quick actions — 3-color section title + cards */}
      <section className="animate-dashboard-enter animation-delay-100">
        <h2 className="gradient-text-three text-base font-bold mb-5">Quick actions</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {QUICK_LINKS.map((item, i) => (
            <Link
              key={item.to}
              to={item.to}
              className={`group flex flex-col rounded-2xl overflow-hidden dashboard-quick-card animate-dashboard-enter ${i === 0 ? 'animation-delay-150' : i === 1 ? 'animation-delay-200' : i === 2 ? 'animation-delay-250' : i === 3 ? 'animation-delay-300' : i === 4 ? 'animation-delay-350' : 'animation-delay-400'}`}
            >
              <div className="card-accent-bar h-1.5 w-full opacity-90" style={{ backgroundColor: accentBorderColor[item.accent] }} />
              <div className="flex flex-1 flex-col p-6">
                <div className={`mb-4 w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${accentIconBg[item.accent]} shadow-md`}>
                  {iconSvg(item.icon)}
                </div>
                <p className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">{item.label}</p>
                <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 group-hover:text-indigo-600 transition-colors">
                  Open
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Getting started — 3-color step dots + soft gradient accent */}
      <section className="relative rounded-xl border border-slate-200 bg-slate-50/50 p-8 sm:p-9 animate-dashboard-enter animation-delay-500 overflow-hidden border-l-4 border-l-indigo-500">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-amber-100/60 via-teal-100/40 to-indigo-100/60 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" aria-hidden />
        <div className="flex items-center gap-3 mb-6 relative">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white" style={{ background: 'linear-gradient(135deg, #4f46e5, #0d9488)' }}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h2 className="text-lg font-semibold text-slate-900">Getting started</h2>
        </div>
        <ul className="space-y-4 relative">
          {GETTING_STARTED.map((text, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
              <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5 text-white ${i === 0 ? 'step-dot-indigo' : i === 1 ? 'step-dot-teal' : 'step-dot-amber'}`}>
                {i + 1}
              </span>
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
