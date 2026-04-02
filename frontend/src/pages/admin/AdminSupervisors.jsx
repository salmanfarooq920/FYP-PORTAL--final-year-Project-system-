import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import * as projectsApi from '../../api/projects';
import * as usersApi from '../../api/users';
import { DUMMY_PROJECTS_PROGRESS, DUMMY_USERS } from '../../utils/constants';

const DUMMY_MENTORS = DUMMY_USERS.filter((u) => u.role === 'Mentor');

const tooltipStyle = {
  backgroundColor: 'rgba(255,255,255,0.98)',
  border: '1px solid #e2e8f0',
  borderRadius: '10px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  padding: '10px 14px',
  fontSize: '13px',
};

export default function AdminSupervisors() {
  const [projects, setProjects] = useState(DUMMY_PROJECTS_PROGRESS);
  const [mentors, setMentors] = useState(DUMMY_MENTORS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([projectsApi.getProgress(), usersApi.list()])
      .then(([pRes, uRes]) => {
        setProjects(Array.isArray(pRes?.data) && pRes.data.length > 0 ? pRes.data : DUMMY_PROJECTS_PROGRESS);
        const list = uRes?.data || [];
        setMentors(list.filter((u) => u.role === 'Mentor').length > 0 ? list.filter((u) => u.role === 'Mentor') : DUMMY_MENTORS);
      })
      .catch(() => {
        setProjects(DUMMY_PROJECTS_PROGRESS);
        setMentors(DUMMY_MENTORS);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAssign = (projectId, mentorId) => {
    if (!mentorId) return;
    const mentor = mentors.find((m) => m.id === mentorId);
    setProjects((prev) =>
      prev.map((proj) =>
        (proj.id || proj._id) === projectId
          ? { ...proj, supervisor: mentor ? { name: mentor.name } : proj.supervisor }
          : proj
      )
    );
    usersApi.assignSupervisor(projectId, mentorId).catch(() => {});
  };

  const assignedCount = projects.filter((p) => p.supervisor?.name).length;
  const unassignedCount = projects.length - assignedCount;

  const assignChartData = [
    { name: 'Assigned', value: assignedCount, fill: '#0d9488' },
    { name: 'Unassigned', value: unassignedCount, fill: '#f59e0b' },
  ];

  const staggerDelays = ['animation-delay-100', 'animation-delay-150', 'animation-delay-200', 'animation-delay-250', 'animation-delay-300'];

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl w-full">
        <div className="flex min-h-[280px] items-center justify-center rounded-2xl bg-white/80 p-8 shadow-sm ring-1 ring-slate-200/60">
          <div className="text-center">
            <div className="mx-auto mb-3 h-10 w-10 animate-pulse rounded-xl bg-teal-100" />
            <p className="text-sm font-medium text-slate-500">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl w-full">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 via-teal-50/25 to-slate-100/90 px-6 py-8 shadow-inner ring-1 ring-slate-200/50 min-h-[360px]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(20,184,166,0.06),transparent)] pointer-events-none" aria-hidden />
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-200/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" aria-hidden />

        {/* Header */}
        <div className="supervisors-header-enter relative flex flex-wrap items-center justify-between gap-4 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-lg shadow-teal-500/25">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Assign Supervisors</h1>
              <p className="text-sm text-slate-500">Assign mentors as supervisors to FYP projects.</p>
            </div>
          </div>
        </div>

        {/* Stat blocks — horizontal, with gradient number boxes */}
        <div className="supervisors-stat-enter relative mb-6 grid grid-cols-3 gap-4">
          <div className="animation-delay-100 flex items-center gap-4 rounded-xl border border-slate-200/80 bg-white px-4 py-4 shadow-sm">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-slate-500 to-slate-600 text-white text-lg font-bold">
              {projects.length}
            </div>
            <p className="text-sm font-medium text-slate-600">Projects</p>
          </div>
          <div className="animation-delay-150 flex items-center gap-4 rounded-xl border border-slate-200/80 bg-white px-4 py-4 shadow-sm">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 text-white text-lg font-bold">
              {assignedCount}
            </div>
            <p className="text-sm font-medium text-slate-600">Assigned</p>
          </div>
          <div className="animation-delay-200 flex items-center gap-4 rounded-xl border border-slate-200/80 bg-white px-4 py-4 shadow-sm">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white text-lg font-bold">
              {mentors.length}
            </div>
            <p className="text-sm font-medium text-slate-600">Supervisors</p>
          </div>
        </div>

        {/* Graph: Assigned vs Unassigned */}
        {projects.length > 0 && (
          <div className="supervisors-row-enter animation-delay-100 mb-6 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">Assignment overview</h2>
            <div className="h-[160px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={assignChartData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(value) => [value, 'Projects']} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={48} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Project list — modern rows, no table */}
        {projects.length === 0 ? (
          <div className="supervisors-row-enter animation-delay-100 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-white/70 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-teal-100 text-teal-600">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h2 className="mt-4 text-lg font-semibold text-slate-800">No projects</h2>
            <p className="mt-1 text-sm text-slate-500">There are no projects to assign supervisors to yet.</p>
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50/60 px-5 py-3">
              <p className="text-sm font-medium text-slate-600">Project list · Select a supervisor to assign</p>
            </div>
            <ul className="divide-y divide-slate-100">
              {projects.map((p, i) => (
                <li
                  key={p.id || p._id}
                  className={`supervisors-row-enter supervisors-row-hover flex flex-wrap items-center gap-4 px-5 py-4 sm:flex-nowrap ${staggerDelays[i % staggerDelays.length]}`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900">{p.title}</p>
                    {p.supervisor?.name ? (
                      <span className="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-teal-50 px-2.5 py-1 text-sm font-medium text-teal-700 border border-teal-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                        {p.supervisor.name}
                      </span>
                    ) : (
                      <span className="mt-1 text-sm text-slate-400">Not assigned</span>
                    )}
                  </div>
                  <div className="w-full sm:w-auto sm:min-w-[180px]">
                    <select
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                      onChange={(e) => handleAssign(p.id || p._id, e.target.value)}
                      value=""
                    >
                      <option value="">Assign...</option>
                      {mentors.map((m) => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
