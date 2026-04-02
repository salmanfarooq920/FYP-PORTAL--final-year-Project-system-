import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import * as announcementsApi from '../../api/announcements';
import { DUMMY_ANNOUNCEMENTS } from '../../utils/constants';

const TARGET_LABELS = { all: 'Everyone', students: 'Students', mentors: 'Mentors' };
const TARGET_COLORS = {
  all: { border: 'border-blue-500', pill: 'bg-blue-50 text-blue-700 border-blue-200' },
  students: { border: 'border-emerald-500', pill: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  mentors: { border: 'border-violet-500', pill: 'bg-violet-50 text-violet-700 border-violet-200' },
};

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState(DUMMY_ANNOUNCEMENTS);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', body: '', target: 'all' });

  useEffect(() => {
    announcementsApi.list()
      .then((r) => { setAnnouncements(Array.isArray(r?.data) && r.data.length > 0 ? r.data : DUMMY_ANNOUNCEMENTS); })
      .catch(() => { setAnnouncements(DUMMY_ANNOUNCEMENTS); })
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const newAnn = { id: 'a' + Date.now(), ...form, createdAt: new Date().toISOString().split('T')[0] };
    setAnnouncements((prev) => [newAnn, ...prev]);
    setForm({ title: '', body: '', target: 'all' });
    setShowModal(false);
  };

  const setFormField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const staggerDelays = ['animation-delay-100', 'animation-delay-150', 'animation-delay-200', 'animation-delay-250', 'animation-delay-300'];

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl w-full">
        <div className="flex min-h-[280px] items-center justify-center rounded-2xl bg-white/80 p-8 shadow-sm ring-1 ring-slate-200/60">
          <div className="text-center">
            <div className="mx-auto mb-3 h-10 w-10 animate-pulse rounded-xl bg-blue-100" />
            <p className="text-sm font-medium text-slate-500">Loading announcements...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl w-full">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 via-blue-50/25 to-slate-100/90 px-6 py-8 shadow-inner ring-1 ring-slate-200/50 min-h-[360px]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(59,130,246,0.06),transparent)] pointer-events-none" aria-hidden />
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" aria-hidden />

        {/* Header */}
        <div className="announcements-header-enter relative flex flex-wrap items-center justify-between gap-4 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13h3.126M18 13h-3.126" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Announcements</h1>
              <p className="text-sm text-slate-500">Broadcast messages to students and mentors.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:from-blue-700 hover:to-indigo-700 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-[0.98]"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13h3.126M18 13h-3.126" />
            </svg>
            Send Announcement
          </button>
        </div>

        {/* Stat */}
        <div className="announcements-header-enter animation-delay-100 relative mb-6">
          <div className="inline-flex items-center gap-4 rounded-xl border border-slate-200/80 bg-white px-4 py-3 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-sm font-bold">
              {announcements.length}
            </div>
            <p className="text-sm font-medium text-slate-600">Announcements</p>
          </div>
        </div>

        {/* List — single container, rows with left accent by target */}
        {announcements.length === 0 ? (
          <div className="announcements-row-enter animation-delay-100 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-white/70 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13h3.126M18 13h-3.126" />
              </svg>
            </div>
            <h2 className="mt-4 text-lg font-semibold text-slate-800">No announcements yet</h2>
            <p className="mt-1 text-sm text-slate-500">Send your first announcement to reach students and mentors.</p>
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow transition hover:from-blue-700 hover:to-indigo-700"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13h3.126M18 13h-3.126" />
              </svg>
              Send Announcement
            </button>
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
            <ul className="divide-y divide-slate-100">
              {announcements.map((a, i) => {
                const colors = TARGET_COLORS[a.target] || TARGET_COLORS.all;
                return (
                  <li
                    key={a.id}
                    className={`announcements-row-enter announcements-row-hover flex border-l-4 pl-5 pr-5 py-4 ${colors.border} ${staggerDelays[i % staggerDelays.length]}`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-slate-900">{a.title}</h3>
                        <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${colors.pill}`}>
                          {TARGET_LABELS[a.target] || a.target}
                        </span>
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm text-slate-600 leading-relaxed">{a.body}</p>
                      <p className="mt-2 text-xs text-slate-400">{a.createdAt}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {/* New Announcement modal — portal */}
      {showModal && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="announcement-modal-title"
        >
          <div
            className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200/60"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="rounded-t-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 id="announcement-modal-title" className="text-lg font-bold">New Announcement</h2>
                  <p className="mt-0.5 text-sm text-blue-200">Broadcast a message to the portal.</p>
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
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Title *</label>
                <input
                  value={form.title}
                  onChange={(e) => setFormField('title', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Announcement title"
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Message *</label>
                <textarea
                  value={form.body}
                  onChange={(e) => setFormField('body', e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Write your message..."
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Target audience *</label>
                <select
                  value={form.target}
                  onChange={(e) => setFormField('target', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="all">Everyone</option>
                  <option value="students">Students</option>
                  <option value="mentors">Mentors</option>
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
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Send Announcement
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
