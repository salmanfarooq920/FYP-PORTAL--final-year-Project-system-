import { useState, useEffect } from 'react';
import * as milestonesApi from '../../api/milestones';
import { DUMMY_ADMIN_MILESTONES } from '../../utils/constants';

const emptyForm = {
  assignmentNumber: '',
  title: '',
  deadline: '',
  milestoneWorth: '',
  milestoneYear: '',
  description: '',
};

const FLAG_ICON = (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
  </svg>
);

export default function AdminMilestones() {
  const [milestones, setMilestones] = useState(DUMMY_ADMIN_MILESTONES);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  useEffect(() => {
    milestonesApi.list()
      .then((r) => {
        if (Array.isArray(r?.data) && r.data.length > 0) {
          setMilestones(r.data.map((m) => ({
            id: m.id,
            title: m.title,
            description: m.description || '',
            deadline: m.deadline,
            percentage: m.weightage ?? m.percentage,
            year: m.year || new Date().getFullYear(),
          })));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = (e) => {
    e.preventDefault();
    const newM = {
      id: 'm' + Date.now(),
      title: form.title,
      description: form.description,
      deadline: form.deadline || 'mm/dd/yyyy',
      percentage: form.milestoneWorth || '0',
      year: form.milestoneYear || new Date().getFullYear().toString(),
    };
    setMilestones((prev) => [...prev, newM]);
    setForm(emptyForm);
    setShowModal(false);
  };

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl w-full">
        <div className="flex min-h-[320px] items-center justify-center rounded-xl bg-white/80 p-8 shadow-sm ring-1 ring-slate-200/60">
          <div className="text-center">
            <div className="mx-auto mb-3 h-10 w-10 animate-pulse rounded-lg bg-slate-200" />
            <p className="text-sm font-medium text-slate-500">Loading milestones...</p>
          </div>
        </div>
      </div>
    );
  }

  const parseDeadline = (deadline) => {
    if (!deadline) return { day: '—', month: 'Due' };
    const bySlash = deadline.split('/');
    const byDash = deadline.split('-');
    if (byDash.length >= 3 && byDash[0].length === 4) {
      return { day: byDash[2], month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][parseInt(byDash[1], 10) - 1] || '—' };
    }
    if (byDash.length >= 3) {
      return { day: byDash[0], month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][parseInt(byDash[1], 10) - 1] || '—' };
    }
    if (bySlash.length >= 2) {
      return { day: bySlash[1], month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][parseInt(bySlash[0], 10) - 1] || '—' };
    }
    return { day: deadline.slice(0, 2), month: 'Due' };
  };

  // Block accent colors: orange, yellow-orange, teal (per reference image)
  const BLOCK_COLORS = ['#f97316', '#fb923c', '#14b8a6'];
  const BLOCK_ICONS = [
    <svg key="doc" className="h-12 w-12 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    <svg key="book" className="h-12 w-12 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
    <svg key="design" className="h-12 w-12 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" /></svg>,
  ];

  const staggerDelays = ['animation-delay-100', 'animation-delay-200', 'animation-delay-300', 'animation-delay-400', 'animation-delay-500', 'animation-delay-600'];

  return (
    <div className="mx-auto max-w-5xl w-full">
      {/* Light background wrapper */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-50 via-slate-50/95 to-slate-100/80 px-6 py-8 shadow-inner ring-1 ring-slate-200/50 min-h-[320px]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(148,163,184,0.08),transparent)] pointer-events-none" aria-hidden />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/40 to-transparent pointer-events-none" aria-hidden />

        <div className="milestone-header-enter relative flex flex-wrap items-center justify-between gap-3 pb-6">
          <h1 className="text-xl font-bold text-slate-900">Milestones</h1>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 active:scale-[0.98]"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add milestone
          </button>
        </div>

        {/* Three-block infographic layout: horizontal cards with diagonal cuts + animations */}
        {milestones.length === 0 ? (
          <div className="milestone-block-enter animation-delay-100 relative rounded-2xl border-2 border-dashed border-slate-200 bg-white/60 py-16 text-center backdrop-blur-sm">
            <p className="text-sm text-slate-500">No milestones yet. Add a deadline to get started.</p>
            <button type="button" onClick={() => setShowModal(true)} className="mt-3 text-sm font-medium text-slate-700 underline hover:no-underline">Add milestone</button>
          </div>
        ) : (
          <div className="relative flex flex-wrap justify-center gap-6 sm:gap-8">
            {milestones.slice(0, 12).map((m, i) => {
              const { day, month } = parseDeadline(m.deadline);
              const accent = BLOCK_COLORS[i % BLOCK_COLORS.length];
              const Icon = BLOCK_ICONS[i % BLOCK_ICONS.length];
              const num = String(i + 1).padStart(2, '0');
              return (
                <article
                  key={m.id}
                  className={`group milestone-block-enter milestone-block-hover flex w-full max-w-[260px] flex-shrink-0 flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-slate-200/60 ${staggerDelays[i % staggerDelays.length]}`}
                >
                  {/* Top: white, rounded top, diagonal bottom */}
                  <div
                    className="relative px-5 pt-5 pb-6 text-center transition-colors duration-300"
                    style={{ clipPath: 'polygon(0 0, 100% 0, 100% 88%, 0 100%)', background: '#fff' }}
                  >
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                      {m.title}
                    </p>
                    <p className="mt-2 text-4xl font-bold tabular-nums transition-transform duration-300 group-hover:scale-105" style={{ color: accent }}>
                      {num}
                    </p>
                  </div>
                  {/* Middle: colored, diagonal top, icon + description — subtle pulse */}
                  <div
                    className="milestone-accent-pulse flex flex-col items-center px-5 py-6 text-center text-white"
                    style={{
                      background: accent,
                      clipPath: 'polygon(0 12%, 100% 0, 100% 100%, 0 100%)',
                      marginTop: '-1px',
                    }}
                  >
                    <span className="inline-block text-white transition-transform duration-300 group-hover:scale-110">{Icon}</span>
                    <p className="mt-3 text-xs font-medium uppercase tracking-wider text-white/95">
                      {m.description || '—'}
                    </p>
                  </div>
                  {/* Bottom: white, rounded bottom, date · percentage */}
                  <div className="rounded-b-2xl bg-white px-5 py-4 transition-colors duration-300" style={{ marginTop: '-1px' }}>
                    <p className="text-sm text-slate-500">
                      {day} {month} · {m.percentage}%
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal — clean, minimal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">New milestone</h2>
                <p className="text-sm text-slate-500">Add a deadline for the term.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Assignment Number *</label>
                  <input
                    value={form.assignmentNumber}
                    onChange={(e) => update('assignmentNumber', e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                    placeholder="e.g. 1"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Title *</label>
                  <input
                    value={form.title}
                    onChange={(e) => update('title', e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                    placeholder="Milestone Title"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Deadline *</label>
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={(e) => update('deadline', e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-slate-900 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Worth (%) *</label>
                  <input
                    value={form.milestoneWorth}
                    onChange={(e) => update('milestoneWorth', e.target.value)}
                    type="number"
                    min="0"
                    max="100"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                    placeholder="0–100"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Year *</label>
                  <input
                    value={form.milestoneYear}
                    onChange={(e) => update('milestoneYear', e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                    placeholder="e.g. 2025"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Description *</label>
                <textarea
                  value={form.description}
                  onChange={(e) => update('description', e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                  placeholder="Brief description of this milestone..."
                  required
                />
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
                  className="rounded-lg bg-violet-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
                >
                  Create Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
