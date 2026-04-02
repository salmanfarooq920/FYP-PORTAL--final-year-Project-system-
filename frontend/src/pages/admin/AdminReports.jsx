import { jsPDF } from 'jspdf';
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
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';

// ─── Data ─────────────────────────────────────────────────────────────────
const kpiCards = [
  { label: 'Total Students', value: 48, change: '+12%', color: '#3b82f6' },
  { label: 'Active Projects', value: 16, change: '+4', color: '#10b981' },
  { label: 'Proposals Submitted', value: 22, change: '+8', color: '#f59e0b' },
  { label: 'Milestones Completed', value: 85, change: '+15%', color: '#8b5cf6' },
];

const phaseData = [
  { name: 'Proposal', value: 6, color: '#6366f1' },
  { name: 'Design', value: 4, color: '#0ea5e9' },
  { name: 'Implementation', value: 3, color: '#f59e0b' },
  { name: 'Final', value: 3, color: '#10b981' },
];

const monthlyData = [
  { month: 'Jan', completed: 20, submitted: 28 },
  { month: 'Feb', completed: 35, submitted: 42 },
  { month: 'Mar', completed: 50, submitted: 58 },
  { month: 'Apr', completed: 65, submitted: 72 },
  { month: 'May', completed: 78, submitted: 85 },
  { month: 'Jun', completed: 85, submitted: 92 },
];

const submissionsTrend = [
  { week: 'W1', submissions: 12 },
  { week: 'W2', submissions: 19 },
  { week: 'W3', submissions: 15 },
  { week: 'W4', submissions: 24 },
  { week: 'W5', submissions: 18 },
  { week: 'W6', submissions: 22 },
];

const topProjects = [
  { name: 'Smart Campus Navigation App', progress: 75, team: 'Team Alpha' },
  { name: 'Library Management System', progress: 90, team: 'Team Beta' },
  { name: 'AI-Powered Study Assistant', progress: 45, team: 'Team Gamma' },
  { name: 'Student Health Monitoring App', progress: 60, team: 'Team Delta' },
];

const reportDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

// ─── Chart tooltip styles ─────────────────────────────────────────────────
const tooltipStyle = {
  backgroundColor: 'rgba(255,255,255,0.96)',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  padding: '10px 14px',
  fontSize: '13px',
};

const kpiDelays = ['animation-delay-100', 'animation-delay-150', 'animation-delay-200', 'animation-delay-250'];

// Build PDF and trigger download
function downloadReportPDF() {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  let y = 18;
  const lineH = 7;
  const sectionGap = 6;

  const sectionTitle = (title) => {
    if (y > 250) { doc.addPage(); y = 18; }
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(title, 14, y);
    y += lineH + 2;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
  };

  const row = (label, value, wrapLabel = false) => {
    if (y > 270) { doc.addPage(); y = 18; }
    if (wrapLabel) {
      const lines = doc.splitTextToSize(String(label), 80);
      doc.text(lines, 14, y);
      doc.text(String(value), 100, y);
      y += Math.max(lineH, lines.length * lineH * 0.6);
    } else {
      doc.text(String(label), 14, y);
      doc.text(String(value), 100, y);
      y += lineH;
    }
  };

  // Title
  doc.setFontSize(20);
  doc.setFont(undefined, 'bold');
  doc.text('Reports & Analytics', 14, y);
  y += lineH + 2;
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text(`Report generated: ${reportDate}`, 14, y);
  y += lineH + sectionGap;

  // Key metrics
  sectionTitle('Key metrics');
  kpiCards.forEach((k) => { row(k.label, `${k.value} (${k.change})`); });
  y += sectionGap;

  // Projects by phase
  sectionTitle('Projects by phase');
  phaseData.forEach((p) => { row(p.name, p.value); });
  y += sectionGap;

  // Milestone completion by month
  sectionTitle('Milestone completion by month (Jan–Jun 2024)');
  row('Month', 'Completed / Submitted');
  monthlyData.forEach((d) => { row(d.month, `${d.completed} / ${d.submitted}`); });
  y += sectionGap;

  // Submissions trend
  sectionTitle('Submissions trend (last 6 weeks)');
  submissionsTrend.forEach((d) => { row(d.week, d.submissions); });
  y += sectionGap;

  // Top projects
  sectionTitle('Top projects by progress');
  topProjects.forEach((p) => { row(p.name, `${p.progress}% (${p.team})`, true); });

  doc.save(`reports-analytics-${new Date().toISOString().slice(0, 10)}.pdf`);
}

// ─── Component ────────────────────────────────────────────────────────────
export default function AdminReports() {
  return (
    <div className="mx-auto max-w-6xl w-full">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 via-indigo-50/20 to-slate-100/90 px-6 py-8 shadow-inner ring-1 ring-slate-200/50 min-h-[400px]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(99,102,241,0.06),transparent)] pointer-events-none" aria-hidden />
        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-200/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" aria-hidden />

        {/* Header */}
        <div className="reports-header-enter relative flex flex-wrap items-center justify-between gap-4 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Reports &amp; Analytics</h1>
              <p className="text-sm text-slate-500">Report generated {reportDate}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={downloadReportPDF}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:from-indigo-700 hover:to-purple-700 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-[0.98]"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export PDF
          </button>
        </div>

        {/* KPI cards */}
        <div className="relative mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {kpiCards.map((k, i) => (
            <div
              key={k.label}
              className={`reports-kpi-enter reports-card-hover rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm ${kpiDelays[i % kpiDelays.length]}`}
            >
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{k.label}</p>
              <p className="mt-2 text-2xl font-bold tabular-nums text-slate-900">{k.value}</p>
              <p className="mt-1 text-sm font-medium text-emerald-600">{k.change}</p>
              <div className="mt-3 h-1.5 w-12 rounded-full" style={{ backgroundColor: k.color }} />
            </div>
          ))}
        </div>

        {/* Row 1: Bar chart + Pie chart */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
          <div className="reports-chart-enter animation-delay-100 reports-card-hover xl:col-span-3 rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">Milestone completion by month</h2>
            <p className="mt-1 text-sm text-slate-500">Completed vs submitted (Jan–Jun 2024)</p>
            <div className="mt-6 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(value) => [value, '']} labelFormatter={(label) => `Month: ${label}`} />
                  <Bar dataKey="completed" name="Completed" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="submitted" name="Submitted" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="reports-chart-enter animation-delay-150 reports-card-hover xl:col-span-2 rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">Projects by phase</h2>
            <p className="mt-1 text-sm text-slate-500">16 active projects</p>
            <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:justify-center">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={phaseData}
                    cx="50%"
                    cy="50%"
                    innerRadius={56}
                    outerRadius={88}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                    labelLine={false}
                  >
                    {phaseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value} projects`, '']} />
                  <Legend formatter={(value, entry) => `${value}: ${entry.payload?.value ?? 0}`} layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ fontSize: 13 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 border-t border-slate-100 pt-4 text-sm">
              {phaseData.map((p) => (
                <li key={p.name} className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                    <span className="text-slate-700">{p.name}</span>
                  </span>
                  <span className="font-semibold tabular-nums text-slate-900">{p.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Row 2: Area chart + Top projects bar */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="reports-chart-enter animation-delay-200 reports-card-hover rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">Submissions trend (last 6 weeks)</h2>
            <p className="mt-1 text-sm text-slate-500">Weekly submission count</p>
            <div className="mt-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={submissionsTrend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSubmissions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value} submissions`, '']} />
                  <Area type="monotone" dataKey="submissions" name="Submissions" stroke="#6366f1" strokeWidth={2} fill="url(#colorSubmissions)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="reports-chart-enter animation-delay-250 reports-card-hover rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">Top projects by progress</h2>
            <p className="mt-1 text-sm text-slate-500">Milestone completion %</p>
            <div className="mt-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProjects} layout="vertical" margin={{ top: 8, right: 24, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickFormatter={(v) => `${v}%`} />
                  <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value}%`, 'Progress']} />
                  <Bar dataKey="progress" name="Progress" fill="#10b981" radius={[0, 4, 4, 0]} maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
