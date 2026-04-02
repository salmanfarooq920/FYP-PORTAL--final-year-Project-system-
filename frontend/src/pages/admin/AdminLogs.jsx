import { useState } from 'react';

const DUMMY_LOGS = [
  { id: 1, time: '2024-02-15 10:32:15', user: 'Zara Rashid', action: 'Submitted proposal', detail: 'Smart Campus Navigation App', type: 'proposal' },
  { id: 2, time: '2024-02-15 09:18:42', user: 'Admin User', action: 'Created milestone', detail: 'Literature Review - Deadline: 2024-03-01', type: 'milestone' },
  { id: 3, time: '2024-02-14 16:45:00', user: 'Dr. Ahmed Khan', action: 'Approved proposal', detail: 'AI-Powered Study Assistant', type: 'proposal' },
  { id: 4, time: '2024-02-14 14:22:33', user: 'Ali Hassan', action: 'Submitted milestone', detail: 'Proposal Submission - Grade: 85', type: 'milestone' },
  { id: 5, time: '2024-02-14 11:05:12', user: 'Admin User', action: 'Posted announcement', detail: 'FYP Exhibition Date Announced', type: 'announcement' },
  { id: 6, time: '2024-02-13 15:40:00', user: 'Sara Ahmed', action: 'Uploaded document', detail: 'Literature_Review.pdf', type: 'file' },
  { id: 7, time: '2024-02-13 10:00:00', user: 'Admin User', action: 'Registered user', detail: 'Omar Khalid (Student)', type: 'user' },
  { id: 8, time: '2024-02-12 17:30:00', user: 'Dr. Fatima Noor', action: 'Assigned supervisor', detail: 'Team Gamma - AI Study Assistant', type: 'supervisor' },
  { id: 9, time: '2024-02-12 14:15:00', user: 'Zara Rashid', action: 'Logged in', detail: 'Session started', type: 'auth' },
  { id: 10, time: '2024-02-11 09:00:00', user: 'Admin User', action: 'Created milestone', detail: 'Mid-term Demo - Deadline: 2024-04-15', type: 'milestone' },
];

const TYPE_STYLE = {
  proposal: {
    bar: 'bg-amber-500',
    pill: 'bg-amber-500/10 text-amber-700 border-amber-200/80',
    icon: 'document',
  },
  milestone: {
    bar: 'bg-blue-500',
    pill: 'bg-blue-500/10 text-blue-700 border-blue-200/80',
    icon: 'flag',
  },
  announcement: {
    bar: 'bg-violet-500',
    pill: 'bg-violet-500/10 text-violet-700 border-violet-200/80',
    icon: 'megaphone',
  },
  file: {
    bar: 'bg-emerald-500',
    pill: 'bg-emerald-500/10 text-emerald-700 border-emerald-200/80',
    icon: 'folder',
  },
  user: {
    bar: 'bg-slate-500',
    pill: 'bg-slate-500/10 text-slate-700 border-slate-200/80',
    icon: 'user',
  },
  supervisor: {
    bar: 'bg-teal-500',
    pill: 'bg-teal-500/10 text-teal-700 border-teal-200/80',
    icon: 'user',
  },
  auth: {
    bar: 'bg-slate-400',
    pill: 'bg-slate-500/10 text-slate-600 border-slate-200/80',
    icon: 'lock',
  },
};

const FILTER_OPTIONS = [
  { value: '', label: 'All types' },
  { value: 'proposal', label: 'Proposals' },
  { value: 'milestone', label: 'Milestones' },
  { value: 'user', label: 'Users' },
  { value: 'announcement', label: 'Announcements' },
  { value: 'file', label: 'Files' },
  { value: 'supervisor', label: 'Supervisors' },
  { value: 'auth', label: 'Auth' },
];

const STAGGER = ['animation-delay-100', 'animation-delay-150', 'animation-delay-200', 'animation-delay-250', 'animation-delay-300', 'animation-delay-350', 'animation-delay-400', 'animation-delay-450'];

function TypeIcon({ type, className = 'h-5 w-5' }) {
  const style = TYPE_STYLE[type] || TYPE_STYLE.auth;
  const icon = style.icon;
  const cls = className;
  if (icon === 'document')
    return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
  if (icon === 'flag')
    return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>;
  if (icon === 'megaphone')
    return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13h3.126M18 13h-3.126" /></svg>;
  if (icon === 'folder')
    return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>;
  if (icon === 'lock')
    return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
  return <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
}

function exportLogsCSV(logs) {
  const escape = (s) => `"${String(s).replace(/"/g, '""')}"`;
  const header = 'Time,User,Action,Detail,Type';
  const rows = logs.map((log) =>
    [log.time, log.user, log.action, log.detail, log.type].map(escape).join(',')
  );
  const csv = '\uFEFF' + [header, ...rows].join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `system-logs-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function AdminLogs() {
  const [filter, setFilter] = useState('');

  const filteredLogs = filter
    ? DUMMY_LOGS.filter((log) => log.type === filter)
    : DUMMY_LOGS;

  return (
    <div className="mx-auto w-full max-w-4xl">
      {/* Header — gradient strip, icon, title */}
      <div className="logs-header-enter relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500/10 via-violet-500/5 to-slate-50 px-6 py-6 ring-1 ring-slate-200/60">
        <div className="absolute right-0 top-0 h-32 w-48 rounded-full bg-indigo-400/10 blur-3xl" aria-hidden />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/25">
              <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">System Logs</h1>
              <p className="mt-1 text-sm text-slate-600">
                Track activity across proposals, milestones, and users
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/20"
            >
              {FILTER_OPTIONS.map((opt) => (
                <option key={opt.value || 'all'} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => exportLogsCSV(filteredLogs)}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition hover:from-indigo-700 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="logs-header-enter animation-delay-100 mb-6 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-3 rounded-xl bg-white px-5 py-3 shadow-sm ring-1 ring-slate-200/60">
          <span className="text-2xl font-bold tabular-nums text-slate-900">{filteredLogs.length}</span>
          <span className="text-sm text-slate-500">
            {filter ? 'matching' : 'total'} {filteredLogs.length === 1 ? 'entry' : 'entries'}
          </span>
        </div>
      </div>

      {/* Activity list — single container, simple divided rows (no cards) */}
      {filteredLogs.length === 0 ? (
        <div className="logs-activity-enter flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white py-16 text-center">
          <div className="rounded-full bg-slate-100 p-4">
            <svg className="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="mt-4 text-sm font-medium text-slate-700">No matching activity</p>
          <p className="mt-1 text-sm text-slate-500">Change the type filter to see more entries.</p>
        </div>
      ) : (
        <div className="logs-activity-enter overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <ul className="divide-y divide-slate-100">
            {filteredLogs.map((log, i) => {
              const style = TYPE_STYLE[log.type] || TYPE_STYLE.auth;
              return (
                <li
                  key={log.id}
                  className={`logs-activity-enter flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-slate-50/70 ${STAGGER[i % STAGGER.length]}`}
                >
                  <span className={`h-2 w-2 shrink-0 rounded-full ${style.bar}`} aria-hidden title={log.type} />
                  <div className="min-w-0 flex-1">
                    <span className="font-medium text-slate-900">{log.user}</span>
                    <span className="text-slate-400"> · </span>
                    <span className="text-slate-600">{log.action}</span>
                    <span className="text-slate-400"> · </span>
                    <span className="truncate text-slate-500" title={log.detail}>
                      {log.detail}
                    </span>
                  </div>
                  <span className={`shrink-0 rounded-md border px-2 py-0.5 text-xs font-medium capitalize ${style.pill}`}>
                    {log.type}
                  </span>
                  <time className="shrink-0 tabular-nums text-xs text-slate-400">{log.time}</time>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
