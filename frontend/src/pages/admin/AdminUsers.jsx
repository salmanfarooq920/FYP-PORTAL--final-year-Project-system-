import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import * as usersApi from '../../api/users';
import { DUMMY_USERS } from '../../utils/constants';

/* Role color combinations: gradient strip + avatar/pill */
const ROLE_CONFIG = {
  Admin: {
    strip: 'bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600',
    ring: 'ring-violet-200',
    avatarBg: 'bg-gradient-to-br from-indigo-100 to-violet-100 text-indigo-800',
    pill: 'bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-800 border-indigo-200',
  },
  Mentor: {
    strip: 'bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-500',
    ring: 'ring-cyan-200',
    avatarBg: 'bg-gradient-to-br from-sky-100 to-teal-100 text-sky-800',
    pill: 'bg-gradient-to-r from-sky-50 to-teal-50 text-sky-800 border-sky-200',
  },
  Student: {
    strip: 'bg-gradient-to-r from-slate-500 via-amber-500/90 to-orange-400',
    ring: 'ring-amber-200',
    avatarBg: 'bg-gradient-to-br from-slate-100 to-amber-50 text-slate-800',
    pill: 'bg-gradient-to-r from-slate-50 to-amber-50 text-slate-800 border-slate-200',
  },
};

const USERS_ICON = (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

function getInitials(name) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function AdminUsers() {
  const [users, setUsers] = useState(DUMMY_USERS);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Student' });

  useEffect(() => {
    usersApi.list()
      .then((r) => { setUsers(Array.isArray(r?.data) && r.data.length > 0 ? r.data : DUMMY_USERS); })
      .catch(() => { setUsers(DUMMY_USERS); })
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const newUser = { id: 'u' + Date.now(), name: form.name, email: form.email, role: form.role, department: 'Computer Science' };
    setUsers((prev) => [newUser, ...prev]);
    setForm({ name: '', email: '', password: '', role: 'Student' });
    setShowModal(false);
  };

  const setFormField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const stats = {
    total: users.length,
    admin: users.filter((u) => u.role === 'Admin').length,
    mentor: users.filter((u) => u.role === 'Mentor').length,
    student: users.filter((u) => u.role === 'Student').length,
  };

  const statCards = [
    { value: stats.total, label: 'Total users', gradient: 'from-indigo-500 to-violet-500', delay: 'animation-delay-100' },
    { value: stats.admin, label: 'Admins', gradient: 'from-violet-500 to-purple-500', delay: 'animation-delay-150' },
    { value: stats.mentor, label: 'Mentors', gradient: 'from-sky-500 to-teal-500', delay: 'animation-delay-200' },
    { value: stats.student, label: 'Students', gradient: 'from-amber-500 to-orange-500', delay: 'animation-delay-250' },
  ];

  const staggerDelays = ['animation-delay-100', 'animation-delay-150', 'animation-delay-200', 'animation-delay-250', 'animation-delay-300', 'animation-delay-350', 'animation-delay-400'];

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl w-full">
        <div className="flex min-h-[320px] items-center justify-center rounded-2xl bg-white/80 p-8 shadow-sm ring-1 ring-slate-200/60">
          <div className="text-center">
            <div className="mx-auto mb-3 h-10 w-10 animate-pulse rounded-xl bg-indigo-100" />
            <p className="text-sm font-medium text-slate-500">Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl w-full">
      {/* Light background + new layout */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 via-indigo-50/30 via-violet-50/20 to-slate-100 px-6 py-8 shadow-inner ring-1 ring-slate-200/50 min-h-[400px]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-15%,rgba(99,102,241,0.06),transparent)] pointer-events-none" aria-hidden />
        <div className="absolute top-0 right-0 w-72 h-72 bg-violet-200/25 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" aria-hidden />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-200/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" aria-hidden />

        {/* Header — color combo: indigo → violet */}
        <div className="users-header-enter relative flex flex-wrap items-center justify-between gap-4 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30">
              {USERS_ICON}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Users & Accounts</h1>
              <p className="text-sm text-slate-500">Manage accounts and roles</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:from-indigo-600 hover:to-violet-700 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-[0.98]"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add User
          </button>
        </div>

        {/* Horizontal stat cards — each with its own color combination */}
        <div className="relative mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {statCards.map((s) => (
            <div
              key={s.label}
              className={`users-stat-enter flex items-center gap-4 rounded-xl border border-slate-200/80 bg-white px-4 py-4 shadow-sm transition hover:shadow-md ${s.delay}`}
            >
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${s.gradient} text-white shadow-sm`}>
                <span className="text-lg font-bold tabular-nums">{s.value}</span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-600">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* User cards grid — new card style with role accent + hover */}
        {users.length === 0 ? (
          <div className="users-card-enter animation-delay-100 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white/70 py-16 text-center backdrop-blur-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">{USERS_ICON}</div>
            <h3 className="mt-4 text-lg font-semibold text-slate-800">No users yet</h3>
            <p className="mt-1 text-sm text-slate-500">Add your first user to get started.</p>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-sm font-medium text-white shadow transition hover:from-indigo-700 hover:to-violet-700"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add User
            </button>
          </div>
        ) : (
          <div className="relative grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {users.map((u, i) => {
              const roleConfig = ROLE_CONFIG[u.role] || ROLE_CONFIG.Student;
              return (
                <article
                  key={u.id}
                  className={`group users-card-enter users-card-hover flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-md ${staggerDelays[i % staggerDelays.length]}`}
                >
                  {/* Top strip — role gradient */}
                  <div className={`h-2 w-full ${roleConfig.strip}`} />
                  <div className="flex flex-1 flex-col items-center px-5 pt-6 pb-5 text-center">
                    <div
                      className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-lg font-bold ring-4 ring-white shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:ring-4 ${roleConfig.avatarBg} ${roleConfig.ring}`}
                    >
                      {getInitials(u.name)}
                    </div>
                    <h3 className="mt-4 text-base font-bold text-slate-900 truncate w-full">{u.name}</h3>
                    <p className="mt-1 truncate w-full text-sm text-slate-500">{u.email}</p>
                    <span className={`mt-4 inline-block rounded-full border px-3 py-1 text-xs font-semibold ${roleConfig.pill}`}>
                      {u.role}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Add User modal — portal, high z-index */}
      {showModal && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-user-modal-title"
        >
          <div
            className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="rounded-t-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-5 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20">
                    {USERS_ICON}
                  </div>
                  <div>
                    <h2 id="add-user-modal-title" className="text-lg font-bold">Add User</h2>
                    <p className="text-sm text-indigo-200">New portal account</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg p-2 text-white/80 transition hover:bg-white/20 hover:text-white"
                  aria-label="Close"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <form onSubmit={handleCreate} className="space-y-5 p-6">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Full name *</label>
                <input
                  value={form.name}
                  onChange={(e) => setFormField('name', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="e.g. John Smith"
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setFormField('email', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="user@university.edu"
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Password *</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setFormField('password', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="••••••••"
                  required
                />
                <p className="mt-1 text-xs text-slate-500">Min 6 characters</p>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Role *</label>
                <select
                  value={form.role}
                  onChange={(e) => setFormField('role', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="Student">Student</option>
                  <option value="Mentor">Mentor</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-sm font-medium text-white transition hover:from-indigo-700 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
