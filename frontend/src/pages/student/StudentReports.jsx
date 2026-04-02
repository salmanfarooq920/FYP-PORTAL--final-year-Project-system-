import { useState, useEffect } from 'react';
import * as aiApi from '../../api/ai';
import { DUMMY_REPORTS, DUMMY_MILESTONE_GRADES } from '../../utils/constants';

// Simple Line Chart Component
const LineChart = ({ data, color }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;
  
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((d.value - minValue) / range) * 80 - 10;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon 
        points={`0,100 ${points} 100,100`} 
        fill={`url(#gradient-${color})`}
      />
      <polyline 
        points={points} 
        fill="none" 
        stroke={color} 
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {data.map((d, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - ((d.value - minValue) / range) * 80 - 10;
        return (
          <circle key={i} cx={x} cy={y} r="1.5" fill={color} />
        );
      })}
    </svg>
  );
};

export default function StudentReports() {
  const [reports, setReports] = useState(DUMMY_REPORTS);
  const [milestoneGrades] = useState(DUMMY_MILESTONE_GRADES);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    aiApi.getReports()
      .then((r) => { setReports(r?.data?.length > 0 ? r.data : DUMMY_REPORTS); })
      .catch(() => { setReports(DUMMY_REPORTS); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-screen" style={{ backgroundColor: '#F8F9FC' }}>
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-gray-200 border-t-[#1F2E5A] rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-gray-500 text-sm">Loading analytics...</p>
      </div>
    </div>
  );

  const getScoreColor = (score) => {
    if (score >= 0.8) return { bg: '#10B981', text: '#10B981', light: 'rgba(16, 185, 129, 0.1)' };
    if (score >= 0.6) return { bg: '#F4B400', text: '#F4B400', light: 'rgba(244, 180, 0, 0.1)' };
    return { bg: '#EF4444', text: '#EF4444', light: 'rgba(239, 68, 68, 0.1)' };
  };

  const avgScore = reports.length ? reports.reduce((sum, r) => sum + r.score, 0) / reports.length : 0;
  const gradedMilestones = milestoneGrades.filter((m) => m.grade != null);
  const totalWeight = milestoneGrades.reduce((s, m) => s + (m.maxGrade || m.weightage || 0), 0);
  const earnedWeight = gradedMilestones.reduce((s, m) => s + (m.grade || 0), 0);
  const overallProgressPct = totalWeight ? Math.round((earnedWeight / totalWeight) * 100) : 0;
  const aiSuccessScore = Math.round(avgScore * 100);
  const riskLevel = aiSuccessScore >= 75 ? 'Low' : aiSuccessScore >= 50 ? 'Medium' : 'High';

  // Chart data
  const trendData = reports.map((r, i) => ({ label: i + 1, value: r.score * 100 }));
  const milestoneData = milestoneGrades.map((m) => ({ label: m.milestone, value: m.grade || 0 }));

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F9FC' }}>
      {/* Header */}
      <div className="px-6 py-6 border-b" style={{ backgroundColor: '#1F2E5A', boxShadow: '0 4px 20px rgba(31, 46, 90, 0.3)' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#F4B400' }}>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Analytics Dashboard</h1>
              <p className="text-sm text-white/70">Performance metrics & AI insights</p>
            </div>
          </div>
          <button className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition hover:brightness-110" style={{ backgroundColor: '#F4B400', color: '#1F2E5A', boxShadow: '0 4px 12px rgba(244, 180, 0, 0.4)' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Progress', value: `${overallProgressPct}%`, trend: '+5%', color: '#1F2E5A' },
            { label: 'Avg Score', value: `${(avgScore * 100).toFixed(0)}%`, trend: '+2%', color: '#10B981' },
            { label: 'AI Score', value: `${aiSuccessScore}%`, trend: '+8%', color: '#F4B400' },
            { label: 'Risk', value: riskLevel, trend: 'Stable', color: riskLevel === 'Low' ? '#10B981' : riskLevel === 'Medium' ? '#F4B400' : '#EF4444' },
          ].map((stat, idx) => (
            <div key={idx} className="p-4 rounded-xl" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8ECF4', boxShadow: '0 2px 8px rgba(31, 46, 90, 0.06)' }}>
              <p className="text-gray-500 text-xs mb-1">{stat.label}</p>
              <div className="flex items-end justify-between">
                <p className="text-2xl font-bold" style={{ color: '#1F2E5A' }}>{stat.value}</p>
                <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>{stat.trend}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="col-span-2 space-y-6">
            {/* Performance Trend Chart */}
            <div className="p-5 rounded-xl" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8ECF4', boxShadow: '0 2px 8px rgba(31, 46, 90, 0.06)' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold" style={{ color: '#1F2E5A' }}>Score Trend</h3>
                <div className="flex gap-2">
                  <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: '#F4B400', color: '#1F2E5A' }}>Last 30 days</span>
                </div>
              </div>
              <div className="h-48">
                <LineChart data={trendData} color="#1F2E5A" />
              </div>
              <div className="flex justify-between mt-2 text-xs" style={{ color: '#94A3B8' }}>
                {reports.slice(0, 5).map((r, i) => (
                  <span key={i}>{r.date.split(' ')[0]}</span>
                ))}
              </div>
            </div>

            {/* Milestone Comparison */}
            <div className="p-5 rounded-xl" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8ECF4', boxShadow: '0 2px 8px rgba(31, 46, 90, 0.06)' }}>
              <h3 className="font-semibold mb-4" style={{ color: '#1F2E5A' }}>Milestone Comparison</h3>
              <div className="h-40">
                <LineChart data={milestoneData} color="#F4B400" />
              </div>
              <div className="flex justify-between mt-2 text-xs" style={{ color: '#94A3B8' }}>
                {milestoneGrades.map((m, i) => (
                  <span key={i}>M{i + 1}</span>
                ))}
              </div>
            </div>

            {/* Milestone Bars */}
            <div className="p-5 rounded-xl" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8ECF4', boxShadow: '0 2px 8px rgba(31, 46, 90, 0.06)' }}>
              <h3 className="font-semibold mb-4" style={{ color: '#1F2E5A' }}>Milestone Progress</h3>
              <div className="space-y-3">
                {milestoneGrades.map((m) => {
                  const progress = m.maxGrade ? ((m.grade || 0) / m.maxGrade) * 100 : 0;
                  return (
                    <div key={m.milestone} className="flex items-center gap-3">
                      <span className="text-xs w-24 truncate" style={{ color: '#64748B' }}>{m.milestone}</span>
                      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#E8ECF4' }}>
                        <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, backgroundColor: progress >= 80 ? '#10B981' : progress >= 60 ? '#1F2E5A' : '#EF4444' }} />
                      </div>
                      <span className="text-xs w-12 text-right" style={{ color: '#1F2E5A' }}>{m.grade || 0}/{m.maxGrade}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reports Table */}
            <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8ECF4', boxShadow: '0 2px 8px rgba(31, 46, 90, 0.06)' }}>
              <div className="px-5 py-3 border-b" style={{ borderColor: '#E8ECF4' }}>
                <h3 className="font-semibold" style={{ color: '#1F2E5A' }}>Evaluation History</h3>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs" style={{ color: '#64748B' }}>
                    <th className="px-5 py-3 font-medium">Report</th>
                    <th className="px-5 py-3 font-medium">Date</th>
                    <th className="px-5 py-3 font-medium">Score</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {reports.map((r) => {
                    const scoreColor = getScoreColor(r.score);
                    return (
                      <tr key={r.id} className="border-t cursor-pointer hover:bg-slate-50 transition" style={{ borderColor: '#E8ECF4' }} onClick={() => setSelectedReport(r)}>
                        <td className="px-5 py-3" style={{ color: '#1F2E5A' }}>{r.title}</td>
                        <td className="px-5 py-3" style={{ color: '#64748B' }}>{r.date}</td>
                        <td className="px-5 py-3">
                          <span className="font-semibold" style={{ color: scoreColor.text }}>{(r.score * 100).toFixed(0)}%</span>
                        </td>
                        <td className="px-5 py-3">
                          <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: scoreColor.light, color: scoreColor.text }}>
                            {r.score >= 0.8 ? 'Excellent' : r.score >= 0.6 ? 'Good' : 'Poor'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Score */}
            <div className="p-5 rounded-xl text-center" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8ECF4', boxShadow: '0 2px 8px rgba(31, 46, 90, 0.06)' }}>
              <p className="text-gray-500 text-sm mb-2">AI Success Prediction</p>
              <div className="relative w-32 h-32 mx-auto mb-3">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="56" stroke="#E8ECF4" strokeWidth="8" fill="none" />
                  <circle cx="64" cy="64" r="56" stroke="#F4B400" strokeWidth="8" fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - aiSuccessScore / 100)}`}
                    strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold" style={{ color: '#1F2E5A' }}>{aiSuccessScore}%</span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: riskLevel === 'Low' ? '#10B981' : riskLevel === 'Medium' ? '#F4B400' : '#EF4444' }}></div>
                <span className="text-gray-600 text-sm">{riskLevel} Risk</span>
              </div>
            </div>

            {/* AI Metrics */}
            <div className="p-5 rounded-xl" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8ECF4', boxShadow: '0 2px 8px rgba(31, 46, 90, 0.06)' }}>
              <h3 className="font-semibold mb-4" style={{ color: '#1F2E5A' }}>AI Metrics</h3>
              <div className="space-y-4">
                {[
                  { label: 'Uniqueness', value: 85, color: '#10B981' },
                  { label: 'Feasibility', value: 78, color: '#1F2E5A' },
                  { label: 'Innovation', value: 72, color: '#F4B400' },
                ].map((m, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span style={{ color: '#64748B' }}>{m.label}</span>
                      <span className="font-medium" style={{ color: '#1F2E5A' }}>{m.value}%</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#E8ECF4' }}>
                      <div className="h-full rounded-full" style={{ width: `${m.value}%`, backgroundColor: m.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-5 rounded-xl" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8ECF4', boxShadow: '0 2px 8px rgba(31, 46, 90, 0.06)' }}>
              <h3 className="font-semibold mb-3" style={{ color: '#1F2E5A' }}>Actions</h3>
              <div className="space-y-2">
                {['Download PDF', 'Share Report', 'Schedule Review'].map((a, i) => (
                  <button key={i} className="w-full text-left px-3 py-2.5 rounded-lg text-sm transition hover:bg-slate-50" style={{ color: '#64748B' }}>
                    {a}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(31, 46, 90, 0.5)' }} onClick={() => setSelectedReport(null)}>
          <div className="rounded-xl max-w-md w-full overflow-hidden" style={{ backgroundColor: '#FFFFFF' }} onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: '#E8ECF4' }}>
              <h3 className="font-semibold" style={{ color: '#1F2E5A' }}>{selectedReport.title}</h3>
              <button onClick={() => setSelectedReport(null)} style={{ color: '#94A3B8' }} className="hover:text-slate-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl flex items-center justify-center" style={{ backgroundColor: getScoreColor(selectedReport.score).light }}>
                  <span className="text-2xl font-bold" style={{ color: getScoreColor(selectedReport.score).text }}>{(selectedReport.score * 100).toFixed(0)}%</span>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Evaluation Score</p>
                  <p style={{ color: '#1F2E5A' }}>{selectedReport.date}</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">{selectedReport.feedback}</p>
              <div className="flex gap-3">
                <button className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white transition hover:brightness-110" style={{ backgroundColor: '#F4B400' }}>Download</button>
                <button className="flex-1 py-2.5 rounded-lg text-sm font-medium" style={{ backgroundColor: '#F8F9FC', color: '#1F2E5A', border: '1px solid #E8ECF4' }}>Share</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
