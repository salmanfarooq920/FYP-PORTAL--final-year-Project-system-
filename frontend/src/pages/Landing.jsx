import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import LoginIcon from '../components/LoginIcon';

// CSS Animations for Landing Page
const landingAnimations = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.4); }
    50% { box-shadow: 0 0 40px rgba(99, 102, 241, 0.8), 0 0 60px rgba(139, 92, 246, 0.6); }
  }
  @keyframes pulse-navy {
    0%, 100% { box-shadow: 0 0 0 4px #F4B400, 0 20px 60px rgba(31, 46, 90, 0.6), 0 0 40px rgba(31, 46, 90, 0.2), inset 0 0 30px rgba(31, 46, 90, 0.05); }
    50% { box-shadow: 0 0 0 4px #F4B400, 0 25px 70px rgba(31, 46, 90, 0.8), 0 0 60px rgba(31, 46, 90, 0.5), inset 0 0 40px rgba(31, 46, 90, 0.15); }
  }
  @keyframes click-bounce {
    0%, 100% { transform: scale(1); }
    25% { transform: scale(0.95); }
    50% { transform: scale(1.05); }
    75% { transform: scale(0.98); }
  }
  @keyframes glow-pulse {
    0%, 100% { box-shadow: 0 0 20px rgba(244, 180, 0, 0.3), 0 0 40px rgba(244, 180, 0, 0.1); }
    50% { box-shadow: 0 0 40px rgba(244, 180, 0, 0.6), 0 0 80px rgba(244, 180, 0, 0.3); }
  }
  @keyframes slide-in-up {
    0% { opacity: 0; transform: translateY(30px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  .animate-click-bounce { animation: click-bounce 0.6s ease-in-out; }
  .animate-glow-pulse { animation: glow-pulse 2s ease-in-out infinite; }
  .animate-slide-in-up { animation: slide-in-up 0.5s ease-out forwards; }
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes rotate-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes bounce-subtle {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  @keyframes gradient-shift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  .animate-float { animation: float 6s ease-in-out infinite; }
  .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
  .animate-shimmer { 
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
  }
  .animate-rotate-slow { animation: rotate-slow 20s linear infinite; }
  .animate-bounce-subtle { animation: bounce-subtle 2s ease-in-out infinite; }
  .animate-gradient-shift {
    background-size: 200% 200%;
    animation: gradient-shift 8s ease infinite;
  }
  .hover-lift {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .hover-lift:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
  .glass-effect {
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  .text-gradient {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .gradient-border {
    position: relative;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 2px;
    border-radius: 12px;
  }
  .gradient-border-inner {
    background: white;
    border-radius: 10px;
    padding: 20px;
  }
`;

function useLandingVisible(options = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const { rootMargin = '0px 0px -80px 0px', threshold = 0.1 } = options;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { rootMargin, threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, threshold]);
  return [ref, visible];
}

const NAV_HEIGHT_PX = 64;

const NAV_LINKS = [
  { to: '#how-it-works', label: 'How It Works' },
  { to: '#roles', label: 'Roles' },
  { to: '#development-team', label: 'Development Team' },
];

const HOW_IT_WORKS_STEPS = [
  {
    num: '01',
    title: 'Register & Login',
    description: 'Access the portal with your university credentials and get started instantly',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
    ),
  },
  {
    num: '02',
    title: 'Form Your Group',
    description: 'Create or join a project group with your teammates up to the maximum limit',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    ),
  },
  {
    num: '03',
    title: 'Get a Supervisor',
    description: 'Browse available supervisors and send supervision requests professionally',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
    ),
  },
  {
    num: '04',
    title: 'Track & Evaluate',
    description: 'Submit deliverables and track your evaluation progress seamlessly',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    ),
  },
];

const PORTAL_ROLES = [
  {
    title: 'Student',
    description: 'Complete FYP management for students',
    color: '#6C5CE7',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>
    ),
    features: ['Create or join groups', 'Submit project documents', 'Request supervisors', 'Track evaluations'],
  },
  {
    title: 'Supervisor',
    description: 'Manage and guide student projects',
    color: '#1ABC9C',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
    ),
    features: ['Post project ideas', 'Accept group requests', 'Evaluate projects', 'Provide feedback', 'Track progress'],
  },
  {
    title: 'Evaluator',
    description: 'Internal evaluation and scoring',
    color: '#3498DB',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
    ),
    features: ['Evaluate assigned projects', 'Score based on rubrics', 'Provide detailed feedback', 'View project documents'],
  },
  {
    title: 'External',
    description: 'Industry perspective evaluation',
    color: '#F1C40F',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
    ),
    features: ['Final semester grading', 'Industry perspective', 'External evaluation', 'Score contributions'],
  },
];

const PROJECT_IDEAS_SAMPLE = [
  {
    id: '1',
    title: 'AI-powered Interview Simulator',
    difficulty: 'HARD',
    difficultyColor: 'bg-pink-100 text-pink-700',
    description: 'AI-powered Interview Simulator is a solo FYP idea. It\'s basically a system that conducts mock interviews for users, analyzes answers, and provides feedback + scores (both technical + HR).',
    postedBy: 'Dr. Muneeb Ahmad',
    initial: 'D',
  },
  {
    id: '2',
    title: 'Smart Campus Navigation',
    difficulty: 'MEDIUM',
    difficultyColor: 'bg-amber-100 text-amber-700',
    description: 'An indoor-outdoor navigation app for university campuses with real-time availability of rooms and facilities.',
    postedBy: 'Dr. Muneeb Ahmad',
    initial: 'D',
  },
  {
    id: '3',
    title: 'Automated Code Review Assistant',
    difficulty: 'EASY',
    difficultyColor: 'bg-emerald-100 text-emerald-700',
    description: 'Tool that suggests improvements and detects common bugs in source code using static analysis and ML.',
    postedBy: 'Dr. Sarah Khan',
    initial: 'S',
  },
];

const SUPERVISORS_FILTER = [
  { id: '', name: 'All Supervisors' },
  { id: 'muneeb', name: 'Dr. Muneeb Ahmad' },
  { id: 'sarah', name: 'Dr. Sarah Khan' },
];

const DEV_TEAM = [
  {
    id: '1',
    name: 'Salman Farooq',
    initial: 'SF',
    role: 'Team Member',
    roleIcon: 'shield',
    badge: 'crown',
    description: 'Team member of the FYP Portal. Contributed to project planning, system development, and overall implementation activities.',
    portfolioUrl: '#',
    image: '/salman-farooq.jpg',
    imagePosition: 'center 0%',
  },
  {
    id: '2',
    name: 'Muhammad Hassan',
    initial: 'MH',
    role: 'Team Member',
    roleIcon: 'shield',
    badge: 'star',
    description: 'Team member of the FYP Portal. Participated in project development, coordination tasks, and documentation processes.',
    portfolioUrl: '#',
    image: '/hassan.jpg.png',
    imagePosition: 'center center',
  },
  {
    id: '3',
    name: 'Muhammad Saleem',
    initial: 'MS',
    role: 'Team Member',
    roleIcon: 'shield',
    badge: 'star',
    description: 'Team member of the FYP Portal. Assisted in research, testing, and collaborative efforts for the successful completion of the project.',
    portfolioUrl: '#',
    image: '/saleem.jpg',
  },
];

export default function Landing() {
  const { isAuthenticated, loading, role } = useAuth();
  const [howRef, howVisible] = useLandingVisible();
  const [rolesRef, rolesVisible] = useLandingVisible();
  const [ideasRef, ideasVisible] = useLandingVisible();
  const [teamRef, teamVisible] = useLandingVisible();
  const [contactRef, contactVisible] = useLandingVisible();
  const [navOpen, setNavOpen] = useState(false);
  const [howWorksClicked, setHowWorksClicked] = useState(false);

  useEffect(() => {
    if (!navOpen) return;
    const onResize = () => {
      if (window.matchMedia('(min-width: 1024px)').matches) setNavOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [navOpen]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setNavOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = navOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [navOpen]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-700" />
          <p className="text-slate-300 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    const to = role === 'Admin' ? '/admin/dashboard' : role === 'Mentor' ? '/mentor/dashboard' : '/student/dashboard';
    return <Navigate to={to} replace />;
  }

  return (
    <>
      <style>{landingAnimations}</style>
      <div className="min-h-screen flex flex-col text-white overflow-hidden">
        {/* Background - LLU logo theme: dark blue with animated gradient */}
        <div className="fixed inset-0 -z-20 animate-gradient-shift" style={{ 
          background: 'linear-gradient(160deg, #0f172a 0%, #1a365d 40%, #1e3a5f 70%, #1a365d 100%)',
          backgroundSize: '400% 400%'
        }} />
        <div className="fixed inset-0 -z-20 opacity-50" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(234, 179, 8, 0.12) 0%, transparent 60%)' }} aria-hidden />

      {/* Subtle dot pattern */}
      <div
        className="fixed inset-0 -z-10 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
        aria-hidden
      />

      {/* Very subtle particles - gentle shimmer */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/25 animate-shimmer"
            style={{
              width: Math.random() * 2 + 1 + 'px',
              height: Math.random() * 2 + 1 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>

      {/* Fixed Navbar - LLU colors: dark blue + yellow */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-12 h-16 backdrop-blur-md border-b border-white/10 shadow-lg animate-fade-in"
        style={{ backgroundColor: 'rgba(26, 54, 93, 0.95)' }}
      >
        <Link to="/" className="flex items-center gap-2 sm:gap-2.5 transition-transform hover:scale-[1.02] duration-200 min-w-0 flex-1 md:flex-initial">
          <div className="w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 rounded-full overflow-hidden ring-2 ring-white/20 bg-white flex items-center justify-center" aria-hidden>
            <img src="/llu-logo.png" alt="LLU" className="w-full h-full object-cover" style={{ transform: 'scale(1.6)' }} />
          </div>
          <span className="font-semibold text-white text-sm sm:text-base md:text-lg truncate uppercase tracking-wider">FYP PORTAL</span>
        </Link>

        {/* Desktop nav - visible only on large screens */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-8">
          {NAV_LINKS.map(({ to, label }) => (
            to.startsWith('#') ? (
              <a key={label} href={to} className="text-sm text-white/90 hover:text-white transition-colors whitespace-nowrap">
                {label}
              </a>
            ) : (
              <Link key={label} to={to} className="text-sm text-white/90 hover:text-white transition-colors whitespace-nowrap">
                {label}
              </Link>
            )
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <Link
            to="/login"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-[#1a365d] text-sm font-semibold transition-all"
          >
            <LoginIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            Login
          </Link>
          {/* Menu icon - visible on small & medium screens (below lg) */}
          <button
            type="button"
            onClick={() => setNavOpen((o) => !o)}
            className="lg:hidden flex items-center justify-center min-w-[44px] min-h-[44px] p-2.5 rounded-lg text-white hover:bg-white/10 active:bg-white/15 transition-colors touch-manipulation"
            aria-expanded={navOpen}
            aria-label={navOpen ? 'Close menu' : 'Open menu'}
          >
            {navOpen ? (
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile menu overlay + panel (shown on small/medium when menu icon is used) */}
      <div
        className={`fixed left-0 right-0 bottom-0 z-40 lg:hidden transition-opacity duration-200 ${navOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        style={{ top: NAV_HEIGHT_PX }}
        aria-hidden={!navOpen}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setNavOpen(false)} aria-hidden />
        {navOpen && (
        <nav key="mobile-menu" className="relative border-b border-white/10 shadow-xl rounded-b-2xl overflow-hidden animate-slide-down" style={{ backgroundColor: 'rgba(26, 54, 93, 0.98)' }}>
          <div className="flex flex-col py-2">
            {NAV_LINKS.map(({ to, label }) => (
              to.startsWith('#') ? (
                <a
                  key={label}
                  href={to}
                  onClick={() => setNavOpen(false)}
                  className="px-6 py-3.5 text-white/90 hover:text-white hover:bg-white/5 transition-colors text-base"
                >
                  {label}
                </a>
              ) : (
                <Link
                  key={label}
                  to={to}
                  onClick={() => setNavOpen(false)}
                  className="px-6 py-3.5 text-white/90 hover:text-white hover:bg-white/5 transition-colors text-base"
                >
                  {label}
                </Link>
              )
            ))}
            <Link
              to="/login"
              onClick={() => setNavOpen(false)}
              className="mx-4 mt-2 mb-3 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#1a365d] font-semibold"
            >
              <LoginIcon className="w-5 h-5" />
              Login
            </Link>
          </div>
        </nav>
        )}
      </div>

      {/* Spacer for fixed navbar */}
      <div style={{ height: NAV_HEIGHT_PX }} aria-hidden />

      {/* Hero */}
      <section className="relative px-4 sm:px-6 lg:px-12 pt-6 sm:pt-8 pb-24 lg:pb-32">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12 lg:gap-16">
          {/* Left content */}
          <div className="flex-1 max-w-2xl">
            <p className="flex items-center gap-2 text-white/80 text-sm mb-4 animate-fade-in-up animation-delay-100">
              <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
              Lahore Leads University
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6 leading-tight animate-fade-in-up animation-delay-200">
              FYP PORTAL
            </h1>
            <p className="text-white/90 text-lg leading-relaxed mb-8 max-w-xl animate-fade-in-up animation-delay-300">
              A comprehensive platform for managing FYP projects. Streamline supervision, track progress, submit deliverables, and manage evaluations — all in one place.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in-up animation-delay-400">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-amber-400 hover:bg-amber-300 hover-scale-subtle text-[#1a365d] text-sm font-semibold transition-all duration-200 shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Get Started
              </Link>
            </div>
          </div>

          {/* Right - Logo only */}
          <div className="flex-shrink-0 lg:w-[260px] animate-fade-in-up animation-delay-500">
            <div 
              className="w-64 h-64 mx-auto flex items-center justify-center overflow-hidden rounded-full border-4 shadow-2xl animate-pulse-glow relative transition-all duration-300 hover:scale-105 hover:-translate-y-2 group" 
              aria-hidden
              style={{ 
                borderColor: 'rgba(31, 46, 90, 0.5)',
                boxShadow: '0 0 0 4px rgba(244, 180, 0, 0.1), 0 15px 40px rgba(31, 46, 90, 0.5), 0 0 30px rgba(31, 46, 90, 0.5), inset 0 0 20px rgba(31, 46, 90, 0.5)',
                animation: 'pulse-navy 3s ease-in-out infinite',
                background: 'linear-gradient(135deg, rgba(31, 46, 90, 0.5) 0%, rgba(244, 180, 0, 0.1) 50%, rgba(31, 46, 90, 0.5) 100%)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 0 4px rgba(244, 180, 0, 0.3), 0 25px 50px rgba(31, 46, 90, 0.6), 0 0 50px rgba(244, 180, 0, 0.2), inset 0 0 30px rgba(31, 46, 90, 0.5)';
                e.currentTarget.style.borderColor = 'rgba(244, 180, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 0 0 4px rgba(244, 180, 0, 0.1), 0 15px 40px rgba(31, 46, 90, 0.5), 0 0 30px rgba(31, 46, 90, 0.5), inset 0 0 20px rgba(31, 46, 90, 0.5)';
                e.currentTarget.style.borderColor = 'rgba(31, 46, 90, 0.5)';
              }}
            >
              <div className="absolute inset-0 rounded-full animate-shimmer opacity-30" />
              <img 
                src="/llu-logo.png" 
                alt="Lahore Leads University" 
                className="w-full h-full object-cover relative z-10 transition-transform duration-500 hover:scale-110" 
                style={{ objectPosition: 'center center', transform: 'scale(1.45)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - scroll target when clicking "How It Works" */}
      <section
        id="how-it-works"
        ref={howRef}
        onClick={() => setHowWorksClicked(true)}
        className={`relative py-20 sm:py-24 bg-[#F8F8F8] scroll-mt-nav transition-all duration-700 cursor-pointer ${howVisible ? 'landing-visible' : ''} ${howWorksClicked ? 'animate-click-bounce' : ''}`}
        style={{
          boxShadow: howWorksClicked 
            ? 'inset 0 4px 60px rgba(244,180,0,0.15), inset 0 2px 20px rgba(244,180,0,0.1), 0 0 60px rgba(244,180,0,0.2)' 
            : 'inset 0 4px 60px rgba(0,0,0,0.08), inset 0 2px 20px rgba(0,0,0,0.04)',
        }}
      >
        <div className={`max-w-6xl mx-auto px-6 lg:px-12 landing-animate ${howVisible ? 'landing-visible' : ''}`}>
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-200 text-slate-700 text-sm font-medium mb-4">
              <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Simple Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">How It Works</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Four simple steps to manage your FYP journey from start to finish.
            </p>
          </div>

          {/* Connecting line - LLU yellow accent */}
          <div className="hidden lg:flex absolute left-0 right-0 top-[calc(50%+1.5rem)] h-0.5 z-0 px-4">
            <div className="max-w-5xl mx-auto w-full h-full rounded-full bg-amber-400/80" />
          </div>

          <div className={`relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 landing-stagger ${howVisible ? 'landing-visible' : ''}`}>
            {HOW_IT_WORKS_STEPS.map((step, index) => (
              <div
                key={step.num}
                className={`relative bg-white rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl group ${howWorksClicked ? 'animate-slide-in-up' : ''}`}
                style={{
                  boxShadow: howWorksClicked 
                    ? '0 4px 6px -1px rgba(244,180,0,0.2), 0 10px 20px -10px rgba(244,180,0,0.15), 0 0 0 1px rgba(244,180,0,0.2), 0 0 30px rgba(244,180,0,0.15)' 
                    : '0 4px 6px -1px rgba(0,0,0,0.08), 0 10px 20px -10px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)',
                  animationDelay: howWorksClicked ? `${index * 0.1}s` : '0s',
                }}
              >
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-400/0 to-amber-400/0 group-hover:from-amber-400/10 group-hover:to-amber-400/5 transition-all duration-500 ${howWorksClicked ? 'animate-glow-pulse' : ''}`} />
                <p className={`text-2xl font-bold mb-4 relative z-10 transition-colors duration-300 ${howWorksClicked ? 'text-amber-600' : 'text-slate-900'}`}>{step.num}</p>
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center text-[#1a365d] mb-4 shadow-lg bg-amber-400 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-amber-400/30 transition-all duration-300 relative z-10 ${howWorksClicked ? 'animate-glow-pulse' : ''}`}
                  style={{ animationDelay: howWorksClicked ? `${index * 0.15}s` : '0s' }}
                >
                  {step.icon}
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-2 relative z-10 group-hover:text-amber-600 transition-colors duration-300">{step.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed relative z-10">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portal Roles - scroll target when clicking "Roles" */}
      <section
        id="roles"
        ref={rolesRef}
        className={`relative py-20 sm:py-24 bg-white scroll-mt-nav ${rolesVisible ? 'landing-visible' : ''}`}
      >
        <div className={`max-w-6xl mx-auto px-6 lg:px-12 landing-animate ${rolesVisible ? 'landing-visible' : ''}`}>
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 text-sm font-medium mb-4">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              User Roles
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: '#1a365d' }}>Portal Roles</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Different roles with tailored features for everyone in the FYP process
            </p>
          </div>

          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 landing-stagger ${rolesVisible ? 'landing-visible' : ''}`}>
            {PORTAL_ROLES.map((role) => (
              <div
                key={role.title}
                className="relative bg-white rounded-2xl shadow-md hover-lift overflow-hidden border border-slate-100 group"
              >
                <div className="h-1.5 w-full" style={{ backgroundColor: role.color }} />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `linear-gradient(135deg, ${role.color}08 0%, transparent 50%)` }} />
                <div className="p-6 relative z-10">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300"
                    style={{ backgroundColor: role.color, boxShadow: `0 4px 14px ${role.color}40` }}
                  >
                    {role.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-1" style={{ color: role.color }}>{role.title}</h3>
                  <p className="text-slate-600 text-sm mb-4">{role.description}</p>
                  <ul className="space-y-2">
                    {role.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-slate-700">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center mt-0.5">
                          <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Development Team - scroll target when clicking "Development Team" */}
      <section
        id="development-team"
        ref={teamRef}
        className={`relative py-20 sm:py-24 scroll-mt-nav overflow-hidden ${teamVisible ? 'landing-visible' : ''}`}
      >
        <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(160deg, #1e1b4b 0%, #312e81 30%, #1e3a5f 70%, #0f172a 100%)' }} />
        <div className="absolute inset-0 -z-10 opacity-50" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(99, 102, 241, 0.2) 0%, transparent 60%)' }} aria-hidden />

        <div className={`max-w-6xl mx-auto px-6 lg:px-12 relative landing-animate ${teamVisible ? 'landing-visible' : ''}`}>
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Development Team</h2>
            <p className="text-white/80 text-lg max-w-xl mx-auto">The talented minds behind this FYP Portal.</p>
          </div>

          {/* Supervisor - top card, distinct style */}
          <div className={`mb-8 landing-animate ${teamVisible ? 'landing-visible' : ''}`}>
            <div
              className="relative rounded-2xl overflow-hidden border border-amber-400/30 bg-gradient-to-br from-amber-500/10 via-white/5 to-transparent backdrop-blur-sm transition-all duration-500 ease-out hover:border-amber-400/40 hover:shadow-lg hover:shadow-amber-500/10 hover:-translate-y-0.5"
              style={{
                boxShadow: '0 0 0 1px rgba(251, 191, 36, 0.15), 0 4px 24px -8px rgba(0,0,0,0.3)',
              }}
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 to-amber-600" aria-hidden />
              <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left p-6 sm:p-8 pl-7 sm:pl-9">
                <div
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl flex items-center justify-center border-2 border-amber-400/50 flex-shrink-0 shadow-inner overflow-hidden"
                  style={{
                    background: 'linear-gradient(145deg, #fcd34d 0%, #f59e0b 50%, #d97706 100%)',
                    boxShadow: '0 0 24px -4px rgba(245, 158, 11, 0.4)',
                  }}
                >
                  <img
                    src="/supervisor-icon.png"
                    alt="Supervisor"
                    className="w-full h-full object-contain object-center p-2"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="inline-block text-xs font-semibold uppercase tracking-wider text-amber-400/90 mb-1">Supervisor</span>
                  <h3 className="text-xl font-bold text-white mb-1">Ms. Alina Yaqoob</h3>
                  <p className="text-white/70 text-sm sm:text-base leading-relaxed">
                    Academic supervisor and project guide for the FYP Portal. Oversees project direction, evaluations, and student mentorship.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 landing-stagger ${teamVisible ? 'landing-visible' : ''}`}>
            {DEV_TEAM.map((dev) => (
              <div
                key={dev.id}
                className="relative rounded-2xl p-6 border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group"
                style={{
                  boxShadow: '0 0 0 1px rgba(255,255,255,0.08), 0 0 40px -10px rgba(99, 102, 241, 0.25)',
                }}
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/10 group-hover:to-purple-500/5 transition-all duration-500" />
                <div className="flex flex-col items-center text-center relative z-10">
                  <div className="relative mb-4">
                    <div
                      className="w-32 h-32 rounded-full flex items-center justify-center text-white border-4 border-white/20 flex-shrink-0 shadow-lg shadow-indigo-500/30 transition-all duration-300 group-hover:scale-[1.3] group-hover:shadow-indigo-500/50"
                      style={{ 
                        background: dev.image ? '#1a365d' : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #3b82f6 100%)',
                        boxShadow: '0 0 0 4px rgba(99, 102, 241, 0.3), 0 8px 32px rgba(99, 102, 241, 0.4)',
                        overflow: 'hidden'
                      }}
                    >
                      {dev.image ? (
                        <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center">
                          <img 
                            src={dev.image} 
                            alt={dev.name} 
                            className="w-full h-full object-cover" 
                            style={{ 
                              imageRendering: '-webkit-optimize-contrast',
                              borderRadius: '50%',
                              objectPosition: dev.imagePosition || 'center center'
                            }}
                          />
                        </div>
                      ) : (
                        <span className="text-2xl font-bold">{dev.initial}</span>
                      )}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{dev.name}</h3>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white/90 border border-white/20 bg-white/10 mb-3">
                    {dev.roleIcon === 'shield' && (
                      <svg className="w-3.5 h-3.5 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    )}
                    {dev.roleIcon === 'code' && (
                      <svg className="w-3.5 h-3.5 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                    )}
                    {dev.role}
                  </span>
                  <p className="text-white/70 text-sm leading-relaxed">{dev.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom wave - soft white undulating */}
      <div className="relative -z-10 mt-auto" aria-hidden style={{ animation: 'fadeIn 1s ease-out 0.8s both' }}>
        <svg className="w-full h-20 sm:h-28 block" viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path
            d="M0 50 Q360 20 720 50 T1440 50 V100 H0 Z"
            fill="rgba(255,255,255,0.06)"
          />
          <path
            d="M0 60 Q360 30 720 60 T1440 60 V100 H0 Z"
            fill="rgba(255,255,255,0.04)"
          />
        </svg>
      </div>

      {/* Footer - compact height, dark (original) */}
      <footer
        id="contact"
        ref={contactRef}
        className={`relative py-5 sm:py-6 px-6 lg:px-12 border-t border-white/10 bg-slate-900/50 scroll-mt-nav landing-animate ${contactVisible ? 'landing-visible' : ''}`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-4">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <Link to="/" className="inline-flex items-center gap-2 mb-1.5">
                <div className="w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center ring-2 ring-white/20" aria-hidden />
                <span className="font-semibold text-white text-xs sm:text-sm uppercase tracking-wider">FYP PORTAL</span>
              </Link>
              <p className="text-white/60 text-xs mt-1 max-w-xs">
                Final Year Project Management System for Lahore Leads University.
              </p>
            </div>
            {/* Quick links */}
            <div>
              <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-2">Quick Links</h4>
              <ul className="space-y-1">
                <li><a href="#how-it-works" className="text-white/60 hover:text-white text-xs transition-colors">How It Works</a></li>
                <li><a href="#roles" className="text-white/60 hover:text-white text-xs transition-colors">Portal Roles</a></li>
                <li><a href="#development-team" className="text-white/60 hover:text-white text-xs transition-colors">Development Team</a></li>
              </ul>
            </div>
            {/* Account */}
            <div>
              <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-2">Account</h4>
              <ul className="space-y-1">
                <li><Link to="/login" className="text-white/60 hover:text-white text-xs transition-colors">Sign in</Link></li>
                <li><Link to="/register" className="text-white/60 hover:text-white text-xs transition-colors">Register</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-white/50 text-xs">
              © {new Date().getFullYear()} FYP PORTAL. All rights reserved.
            </p>
            <p className="text-white/50 text-xs">
              Lahore Leads University
            </p>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}
