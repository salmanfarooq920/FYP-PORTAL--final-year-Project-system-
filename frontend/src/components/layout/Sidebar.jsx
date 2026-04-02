import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { SIDEBAR_STUDENT, SIDEBAR_MENTOR, SIDEBAR_ADMIN } from '../../utils/constants';

/* Layout theme: dark blue (LLU) + amber accents */
const SIDEBAR_FRAME_BG = '#1a365d';
const SIDEBAR_BG = 'linear-gradient(180deg, #1e3a5f 0%, #1a365d 50%, #0c1929 100%)';
const SIDEBAR_ACTIVE_BG = 'rgba(251, 191, 36, 0.2)';
const SIDEBAR_ACTIVE_BORDER = '#f59e0b';
const LOGOUT_BTN_BG = 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)';
const LOGOUT_BTN_TEXT = '#92400e';
const BRAND_SUBTITLE = '#fcd34d';

const iconSvg = (icon) => {
  const cls = 'w-5 h-5 flex-shrink-0';
  switch (icon) {
    case 'home':
      return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
    case 'lightbulb':
      return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;
    case 'people':
    case 'users':
      return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
    case 'flag':
      return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>;
    case 'folder':
      return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>;
    case 'message-circle':
      return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
    case 'file-text':
      return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
    case 'megaphone':
      return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13h3.126M18 13h-3.126" /></svg>;
    case 'settings':
      return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
    case 'bar-chart':
      return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
    case 'speedometer':
      return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>;
    case 'user':
      return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
    case 'user-check':
      return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
    case 'kanban':
      return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" /></svg>;
    case 'trending-up':
      return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
    default:
      return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>;
  }
};

export default function Sidebar({ role, open, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const links = role === 'Admin' ? SIDEBAR_ADMIN : role === 'Mentor' ? SIDEBAR_MENTOR : SIDEBAR_STUDENT;

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/login');
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-20 lg:hidden bg-black/40 transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden
      />
      {/* Dark blue frame (matches header) */}
      <div
        className={`fixed top-16 left-0 bottom-0 w-[17rem] z-30 flex flex-col rounded-r-2xl shadow-xl transition-transform duration-200 ease-out lg:translate-x-0 lg:static ${open ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ backgroundColor: SIDEBAR_FRAME_BG }}
      >
        {/* Sidebar panel — dark blue gradient, inset so frame shows */}
        <aside
          className="flex flex-1 flex-col rounded-2xl m-2 mt-2 mb-2 ml-2 mr-1 min-h-0 border border-white/5"
          style={{ background: SIDEBAR_BG }}
        >
          {/* Branding: logo + role */}
          <div className="flex items-center gap-3 px-4 pt-6 pb-6 border-b border-white/10">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-md overflow-hidden">
              {role === 'Student' ? (
                <img src="/student-logo.png" alt="Student" className="w-full h-full object-cover" />
              ) : role === 'Mentor' ? (
                <img src="/mentor-logo.png" alt="Mentor" className="w-full h-full object-cover" style={{ transform: 'scale(1.2)' }} />
              ) : (
                <img src="/admin-logo.png" alt="Admin" className="w-full h-full object-cover" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-base font-semibold text-white">{role || 'Admin'}</p>
              <p className="text-sm font-medium" style={{ color: BRAND_SUBTITLE }}>Dashboard</p>
            </div>
          </div>

          {/* Nav: active = amber pill + left accent; hover = white/10 */}
          <nav className="flex-1 overflow-y-auto px-2 py-1 space-y-1">
            {links.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive ? 'text-white' : 'text-white/85 hover:text-white hover:bg-white/10'
                  }`
                }
                style={({ isActive }) =>
                  isActive
                    ? {
                        backgroundColor: SIDEBAR_ACTIVE_BG,
                        boxShadow: `inset 4px 0 0 0 ${SIDEBAR_ACTIVE_BORDER}`,
                      }
                    : undefined
                }
              >
                {iconSvg(item.icon)}
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Logout: amber gradient pill, dark amber text */}
          <div className="p-4 pt-2 pb-4 border-t border-white/10">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-full py-3 px-4 text-sm font-medium transition hover:opacity-90"
              style={{
                background: LOGOUT_BTN_BG,
                color: LOGOUT_BTN_TEXT,
              }}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </aside>
      </div>
    </>
  );
}
