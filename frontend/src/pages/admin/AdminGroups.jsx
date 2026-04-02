import { useState } from 'react';
import { createPortal } from 'react-dom';
import { DUMMY_FYP_GROUPS } from '../../utils/constants';

const PEOPLE_ICON = (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

export default function AdminGroups() {
  const [groups, setGroups] = useState(DUMMY_FYP_GROUPS);
  const [detailGroup, setDetailGroup] = useState(null);

  const setGroupFinalized = (groupId, finalized) => {
    setGroups((prev) => prev.map((g) => (g.id === groupId ? { ...g, finalized, confirmed: finalized ? 'Yes' : 'No' } : g)));
    setDetailGroup((d) => (d?.id === groupId ? { ...d, finalized, confirmed: finalized ? 'Yes' : 'No' } : d));
  };

  const finalizeAll = () => {
    setGroups((prev) => prev.map((g) => ({ ...g, finalized: true, confirmed: 'Yes' })));
    setDetailGroup((d) => (d ? { ...d, finalized: true, confirmed: 'Yes' } : null));
  };

  const staggerDelays = ['animation-delay-100', 'animation-delay-150', 'animation-delay-200', 'animation-delay-250', 'animation-delay-300', 'animation-delay-350'];

  return (
    <div className="mx-auto max-w-6xl w-full">
      {/* Light background + stylish layout */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 via-teal-50/30 to-slate-100/80 px-6 py-8 shadow-inner ring-1 ring-slate-200/50 min-h-[360px]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_-10%,rgba(20,184,166,0.06),transparent)] pointer-events-none" aria-hidden />
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-200/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" aria-hidden />

        {/* Header — minimal, no big strip */}
        <div className="groups-header-enter relative flex flex-wrap items-center justify-between gap-4 pb-6">
          <div className="flex items-baseline gap-3">
            <h1 className="text-2xl font-bold text-slate-900">FYP Groups</h1>
            <span className="rounded-full bg-teal-100 px-3 py-1 text-sm font-medium text-teal-800">
              {groups.length} group{groups.length !== 1 ? 's' : ''}
            </span>
          </div>
          <button
            type="button"
            onClick={finalizeAll}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-teal-500 bg-transparent px-4 py-2.5 text-sm font-semibold text-teal-700 transition hover:bg-teal-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Finalize all
          </button>
        </div>

        {/* Group cards grid — no table */}
        {groups.length === 0 ? (
          <div className="groups-card-enter animation-delay-100 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white/60 py-16 text-center backdrop-blur-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-100 text-teal-600">{PEOPLE_ICON}</div>
            <p className="mt-4 text-slate-600">No FYP groups yet.</p>
          </div>
        ) : (
          <div className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map((g, i) => (
              <article
                key={g.id}
                className={`groups-card-enter groups-card-hover flex flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-slate-200/60 ${staggerDelays[i % staggerDelays.length]}`}
              >
                {/* Top accent bar by status */}
                <div
                  className="h-1.5 w-full"
                  style={{ background: g.finalized !== false ? 'linear-gradient(90deg,#0d9488,#14b8a6)' : 'linear-gradient(90deg,#d97706,#f59e0b)' }}
                />
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-lg font-bold text-slate-900 leading-tight">{g.groupName || g.project}</h2>
                    <span
                      className={`shrink-0 rounded-lg border px-2.5 py-1 text-xs font-semibold ${g.finalized !== false ? 'border-teal-200 bg-teal-50 text-teal-700' : 'border-amber-200 bg-amber-50 text-amber-700'}`}
                    >
                      {g.finalized !== false ? 'Finalized' : 'Pending'}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-medium text-teal-700">{g.project}</p>
                  <dl className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between gap-2">
                      <dt className="text-slate-500">Lead</dt>
                      <dd className="font-medium text-slate-800 text-right">{g.projectLead}</dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt className="text-slate-500">Members</dt>
                      <dd className="text-slate-700 text-right truncate max-w-[60%]" title={g.members}>{g.members}</dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt className="text-slate-500">Supervisor</dt>
                      <dd className="text-slate-700 text-right">{g.supervisor}</dd>
                    </div>
                    <div className="flex justify-between gap-2">
                      <dt className="text-slate-500">Year</dt>
                      <dd className="text-slate-700 text-right">{g.year}</dd>
                    </div>
                  </dl>
                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setDetailGroup(g)}
                      className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                    >
                      View
                    </button>
                    {g.finalized !== false ? (
                      <button
                        type="button"
                        onClick={() => setGroupFinalized(g.id, false)}
                        className="rounded-lg px-3 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                      >
                        Unfinalize
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setGroupFinalized(g.id, true)}
                        className="rounded-lg bg-teal-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                      >
                        Finalize
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Detail modal — portal so it always shows on top; clear header with group name + "Group details" */}
      {detailGroup && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          onClick={() => setDetailGroup(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="group-modal-title"
          aria-describedby="group-modal-desc"
        >
          <div
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Strong header: group name and "Group details" clearly visible */}
            <div className="rounded-t-2xl bg-teal-700 px-6 py-5 text-white">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p id="group-modal-desc" className="text-xs font-semibold uppercase tracking-wider text-teal-200">
                    Group details
                  </p>
                  <h2 id="group-modal-title" className="mt-1 text-xl font-bold leading-tight text-white sm:text-2xl">
                    {detailGroup.groupName || detailGroup.project}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setDetailGroup(null)}
                  className="shrink-0 rounded-lg p-2 text-white/80 transition hover:bg-white/20 hover:text-white"
                  aria-label="Close"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <dl className="space-y-3 text-sm">
                {[
                  { label: 'Group Lead', value: detailGroup.projectLead },
                  { label: 'Project', value: detailGroup.project },
                  { label: 'Members', value: detailGroup.members },
                  { label: 'Supervisor', value: detailGroup.supervisor },
                  { label: 'Year', value: detailGroup.year },
                  { label: 'Finalized', value: detailGroup.finalized !== false ? 'Yes' : 'No' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between gap-4 rounded-xl bg-slate-50 px-4 py-3">
                    <dt className="font-semibold text-slate-600">{label}</dt>
                    <dd className="text-slate-900 text-right font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
              <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setDetailGroup(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => setGroupFinalized(detailGroup.id, false)}
                  className="rounded-xl border border-amber-200 px-4 py-2.5 text-sm font-medium text-amber-700 transition hover:bg-amber-50"
                >
                  Unfinalize
                </button>
                <button
                  type="button"
                  onClick={() => setGroupFinalized(detailGroup.id, true)}
                  className="rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                >
                  Finalize
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
