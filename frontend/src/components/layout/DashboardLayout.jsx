import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

export default function DashboardLayout({ role, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/90">
      <Header role={role} onMenuClick={() => setSidebarOpen((o) => !o)} />
      <div className="flex flex-1" style={{ minHeight: 'calc(100vh - 4rem)' }}>
        <Sidebar role={role} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 w-full min-w-0 overflow-auto dashboard-bg">
          <div key={location.pathname} className="relative max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 animate-page-enter z-10">
            <div className="rounded-2xl bg-white/95 backdrop-blur-sm shadow-sm border border-slate-200/80 min-h-[calc(100vh-8rem)] p-6 sm:p-8 relative z-10">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
