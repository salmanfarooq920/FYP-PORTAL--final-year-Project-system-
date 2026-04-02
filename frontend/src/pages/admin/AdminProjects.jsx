import { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { DUMMY_ADMIN_PROJECTS } from '../../utils/constants';

const CHART_COLORS = ['#f59e0b', '#d97706', '#b45309', '#92400e'];
const tooltipStyle = {
  backgroundColor: 'rgba(255,255,255,0.98)',
  border: '1px solid #e2e8f0',
  borderRadius: '10px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  padding: '10px 14px',
  fontSize: '13px',
};

const projectDetails = {
  p1: {
    groupLead: 'Shariq Anwar',
    projectTitle: 'Data Warehousing',
    projectDescription: 'Create a spaghetti database and derive a data mart from it for analysis.',
    projectFinished: 'No',
    fypGroupMembers: 'Group has no members',
    projectStatus: 'Private',
    projectProgress: '60',
  },
  p2: {
    groupLead: 'Taha Mirza',
    projectTitle: 'The User Friendlies',
    projectDescription: 'User-friendly tools for project management.',
    projectFinished: 'No',
    fypGroupMembers: 'Owais Ali',
    projectStatus: 'Private',
    projectProgress: '30',
  },
};

function ProgressRing({ value, size = 44 }) {
  const pct = Math.min(100, Math.max(0, Number(value) || 0));
  const stroke = 4;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const color = pct >= 60 ? '#10b981' : pct >= 30 ? '#f59e0b' : '#ef4444';
  return (
    <svg width={size} height={size} className="shrink-0" aria-hidden>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#e2e8f0"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}

export default function AdminProjects() {
  const [projects] = useState(DUMMY_ADMIN_PROJECTS);
  const [detailProject, setDetailProject] = useState(null);

  const detail = detailProject ? projectDetails[detailProject.id] : null;

  const chartData = projects.map((p, i) => ({
    name: p.groupName.length > 20 ? p.groupName.slice(0, 18) + '…' : p.groupName,
    fullName: p.groupName,
    progress: Math.min(100, Math.max(0, Number(p.progress) || 0)),
    fill: CHART_COLORS[i % CHART_COLORS.length],
  }));

  const staggerDelays = ['animation-delay-100', 'animation-delay-150', 'animation-delay-200', 'animation-delay-250', 'animation-delay-300'];

  return (
    <div className="mx-auto max-w-5xl w-full">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 via-amber-50/20 to-slate-100/90 px-6 py-8 shadow-inner ring-1 ring-slate-200/50 min-h-[320px]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(245,158,11,0.06),transparent)] pointer-events-none" aria-hidden />
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-200/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" aria-hidden />

        {/* Header */}
        <div className="projects-header-enter relative flex flex-wrap items-center justify-between gap-4 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
              <p className="text-sm text-slate-500">{projects.length} FYP project{projects.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>

        {/* Graph: progress by project (bar chart) */}
        {projects.length > 0 && (
          <div className="projects-row-enter animation-delay-100 mb-6 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">Progress by project</h2>
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 8, right: 24, left: 0, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} stroke="#94a3b8" fontSize={12} />
                  <YAxis type="category" dataKey="name" width={100} stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value) => [`${value}%`, 'Progress']}
                    labelFormatter={(_, payload) => payload[0]?.payload?.fullName ?? ''}
                  />
                  <Bar dataKey="progress" radius={[0, 4, 4, 0]} maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Modern list layout — no card boxes, rows with progress ring + meta */}
        {projects.length === 0 ? (
          <div className="projects-row-enter animation-delay-100 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-white/70 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <p className="mt-4 text-slate-600">No projects yet.</p>
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
            <ul className="divide-y divide-slate-100">
              {projects.map((p, i) => (
                <li
                  key={p.id}
                  className={`projects-row-enter projects-row-hover flex items-center gap-4 px-5 py-4 ${staggerDelays[i % staggerDelays.length]}`}
                >
                  <ProgressRing value={p.progress} />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900">{p.groupName}</p>
                    <p className="mt-0.5 text-sm text-slate-500">
                      {p.progress}% · {p.status} · {p.year} · {p.finished === 'Yes' ? 'Finished' : 'In progress'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDetailProject(p)}
                    className="shrink-0 rounded-lg border border-amber-200 bg-amber-50/80 px-3 py-2 text-sm font-medium text-amber-800 transition hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                  >
                    View
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Detail modal — portal, clear header */}
      {detailProject && detail && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          onClick={() => setDetailProject(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
        >
          <div
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="rounded-t-2xl bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-100">Project details</p>
                  <h2 id="project-modal-title" className="mt-1 text-xl font-bold">{detailProject.groupName}</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setDetailProject(null)}
                  className="rounded-lg p-2 text-white/80 transition hover:bg-white/20 hover:text-white"
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
                  { label: 'Group Lead', value: detail.groupLead },
                  { label: 'Project Title', value: detail.projectTitle },
                  { label: 'Description', value: detail.projectDescription },
                  { label: 'Finished', value: detail.projectFinished },
                  { label: 'FYP Group Members', value: detail.fypGroupMembers },
                  { label: 'Status', value: detail.projectStatus },
                  { label: 'Progress', value: `${detail.projectProgress}%` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between gap-4 rounded-xl bg-slate-50 px-4 py-3">
                    <dt className="font-semibold text-slate-600">{label}</dt>
                    <dd className="text-slate-900 text-right font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setDetailProject(null)}
                  className="rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                >
                  Close
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
