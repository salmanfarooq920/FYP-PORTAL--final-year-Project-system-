import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import * as projectsApi from '../../api/projects';

const DEFAULT_PROJECTS = [
  { id: 'p1', title: 'Smart Campus Navigation App', submittedBy: { name: 'Zara Rashid' }, supervisor: { name: 'Dr. Ahmed Khan' }, status: 'approved', progress: 75 },
  { id: 'p2', title: 'AI-Powered Study Assistant', submittedBy: { name: 'Ali Hassan' }, supervisor: { name: 'Dr. Fatima Noor' }, status: 'approved', progress: 45 },
  { id: 'p3', title: 'Library Management System', submittedBy: { name: 'Sara Ahmed' }, supervisor: { name: 'Dr. Ahmed Khan' }, status: 'approved', progress: 90 },
  { id: 'p4', title: 'Student Health Monitoring App', submittedBy: { name: 'Omar Khalid' }, supervisor: { name: 'Dr. Saima Ali' }, status: 'approved', progress: 60 },
];

const tooltipStyle = {
  backgroundColor: 'rgba(255,255,255,0.96)',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  padding: '10px 14px',
  fontSize: '13px',
};

const cardStyle = {
  background: 'linear-gradient(180deg, #ffffff 0%, #fafbfc 100%)',
  boxShadow: '0 0 0 1px rgba(0,0,0,0.03), 0 2px 4px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)',
};

const BAR_COLORS = ['#6366f1', '#8b5cf6', '#0ea5e9', '#10b981', '#f59e0b'];

function getProgressBarColor(progress) {
  if (progress >= 70) return 'from-emerald-500 to-teal-500';
  if (progress >= 40) return 'from-amber-400 to-orange-500';
  return 'from-rose-400 to-pink-500';
}

export default function AdminProgress() {
  const [projects, setProjects] = useState(DEFAULT_PROJECTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectsApi.getProgress()
      .then((r) => {
        const data = Array.isArray(r?.data) && r.data.length > 0 ? r.data : DEFAULT_PROJECTS;
        setProjects(data.map((p) => ({ ...p, progress: p.progress != null ? Number(p.progress) : 0 })));
      })
      .catch(() => setProjects(DEFAULT_PROJECTS))
      .finally(() => setLoading(false));
  }, []);

  const chartData = projects.map((p) => ({
    name: p.title.length > 28 ? p.title.slice(0, 26) + '…' : p.title,
    fullName: p.title,
    progress: p.progress != null ? Number(p.progress) : 0,
  }));

  const statusCounts = projects.reduce((acc, p) => {
    const s = p.status === 'approved' ? 'Approved' : 'Pending';
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});
  const statusData = Object.entries(statusCounts).length > 0
    ? Object.entries(statusCounts).map(([name, value]) => ({
        name,
        value,
        color: name === 'Approved' ? '#10b981' : '#f59e0b',
      }))
    : [{ name: 'No data', value: 1, color: '#94a3b8' }];

  const avgProgress = projects.length
    ? Math.round(projects.reduce((s, p) => s + (p.progress != null ? Number(p.progress) : 0), 0) / projects.length)
    : 0;

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex min-h-[320px] items-center justify-center rounded-xl border border-slate-200/80 bg-white p-8 shadow-sm">
          <div className="text-center">
            <div className="mx-auto mb-3 h-10 w-10 animate-pulse rounded-xl bg-indigo-100" />
            <p className="text-sm font-medium text-slate-500">Loading progress...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-slate-100">
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        {/* Header — gradient + icon */}
        <div className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-white via-indigo-50/30 to-violet-50/40 p-6 shadow-lg shadow-indigo-500/10 sm:p-8">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-indigo-200/30 blur-3xl" aria-hidden />
          <div className="relative flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30">
              <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Project Progress</h1>
              <p className="mt-1 text-slate-600 text-sm sm:text-base">Track milestone completion and status across all FYP projects.</p>
            </div>
          </div>
          {/* Stats — color per card + hover + animation */}
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="progress-stat-enter animation-delay-100 flex items-center gap-4 rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white px-4 py-4 shadow-sm transition-all duration-200 hover:shadow-md hover:shadow-indigo-200/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V5a2 2 0 00-2-2M5 11V5a2 2 0 012-2m0 0V5a2 2 0 002 2m0 0a2 2 0 002 2m0 0a2 2 0 002-2m0 0V5a2 2 0 00-2-2" /></svg>
              </div>
              <div>
                <p className="text-2xl font-bold tabular-nums text-indigo-700">{projects.length}</p>
                <p className="text-xs font-medium uppercase tracking-wider text-indigo-600/80">Total projects</p>
              </div>
            </div>
            <div className="progress-stat-enter animation-delay-150 flex items-center gap-4 rounded-xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white px-4 py-4 shadow-sm transition-all duration-200 hover:shadow-md hover:shadow-violet-200/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              </div>
              <div>
                <p className="text-2xl font-bold tabular-nums text-violet-700">{avgProgress}%</p>
                <p className="text-xs font-medium uppercase tracking-wider text-violet-600/80">Avg. progress</p>
              </div>
            </div>
            <div className="progress-stat-enter animation-delay-200 col-span-2 flex items-center gap-4 rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white px-4 py-4 shadow-sm transition-all duration-200 hover:shadow-md hover:shadow-emerald-200/50 sm:col-span-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div>
                <p className="text-2xl font-bold tabular-nums text-emerald-700">{statusCounts.Approved ?? 0}</p>
                <p className="text-xs font-medium uppercase tracking-wider text-emerald-600/80">Approved</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts row — colored bars + hover effect */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="progress-chart-card rounded-xl border border-indigo-100 bg-white p-6 shadow-sm" style={cardStyle}>
            <h2 className="text-base font-semibold text-slate-900">Progress by project</h2>
            <p className="mt-1 text-slate-500 text-sm">Milestone completion %</p>
            <div className="mt-6 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ top: 8, right: 24, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickFormatter={(v) => `${v}%`} />
                  <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value}%`, 'Progress']} labelFormatter={(_, payload) => payload?.[0]?.payload?.fullName ?? ''} />
                  <Bar dataKey="progress" name="Progress" radius={[0, 4, 4, 0]} maxBarSize={32}>
                    {chartData.map((_, i) => (
                      <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="progress-chart-card rounded-xl border border-emerald-100 bg-white p-6 shadow-sm" style={cardStyle}>
            <h2 className="text-base font-semibold text-slate-900">Status overview</h2>
            <p className="mt-1 text-slate-500 text-sm">Projects by status</p>
            <div className="mt-6 flex items-center justify-center">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, value }) => `${name} ${value}`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={entry.name} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value} projects`, '']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Projects table — row hover + gradient progress bars */}
        <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm" style={cardStyle}>
          <div className="border-b border-slate-200/80 bg-gradient-to-r from-slate-50 to-slate-100/80 px-5 py-4">
            <h2 className="text-base font-semibold text-slate-900">All projects</h2>
            <p className="mt-0.5 text-sm text-slate-500">{projects.length} projects</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50/80">
                <tr>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Project</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 hidden sm:table-cell">Submitted by</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 hidden md:table-cell">Supervisor</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">Status</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 w-40">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {projects.map((p) => {
                  const progress = p.progress != null ? Number(p.progress) : 0;
                  return (
                    <tr key={p.id || p._id} className="progress-row-hover">
                      <td className="px-5 py-4 font-medium text-slate-900">{p.title}</td>
                      <td className="px-5 py-4 text-slate-600 hidden sm:table-cell">{p.submittedBy?.name || p.group?.name || '—'}</td>
                      <td className="px-5 py-4 text-slate-600 hidden md:table-cell">{p.supervisor?.name || '—'}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-medium ${p.status === 'approved' ? 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200/60' : 'bg-amber-100 text-amber-800 ring-1 ring-amber-200/60'}`}>
                          {p.status || 'approved'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-2.5 flex-1 min-w-[60px] max-w-[100px] overflow-hidden rounded-full bg-slate-200">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r ${getProgressBarColor(progress)} transition-[width] duration-500`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="tabular-nums text-sm font-semibold text-slate-700 w-10">{progress}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
