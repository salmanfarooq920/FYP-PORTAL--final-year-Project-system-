import { useState, useEffect } from 'react';
import * as milestonesApi from '../../api/milestones';
import { DUMMY_MILESTONES } from '../../utils/constants';

const PAGE_SIZE = 10;

function formatDateTime(str) {
  if (!str) return '—';
  const d = new Date(str);
  return d.toLocaleString('en-US', { month: 'numeric', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function formatDate(str) {
  if (!str) return '—';
  return new Date(str).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

function getStatusBadge(milestone) {
  if (milestone.submission?.status === 'evaluated') {
    return { text: 'Evaluated', class: 'bg-[#F4B400]/10 text-[#F4B400] border-[#F4B400]' };
  }
  if (milestone.submission?.submittedAt) {
    return { text: 'Submitted', class: 'bg-[#F4B400]/10 text-[#F4B400] border-[#F4B400]' };
  }
  const now = new Date();
  const deadline = new Date(milestone.deadline);
  if (deadline < now) {
    return { text: 'Overdue', class: 'bg-red-100 text-red-700 border-red-200' };
  }
  return { text: 'Pending', class: 'bg-[#1F2E5A]/10 text-[#1F2E5A] border-[#1F2E5A]' };
}

export default function StudentMilestones() {
  const [milestones, setMilestones] = useState(DUMMY_MILESTONES);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [viewMilestone, setViewMilestone] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);

  useEffect(() => {
    milestonesApi.getForStudent()
      .then((r) => { setMilestones(r?.data?.length > 0 ? r.data : DUMMY_MILESTONES); })
      .catch(() => { setMilestones(DUMMY_MILESTONES); })
      .finally(() => setLoading(false));
  }, []);

  const filtered = milestones.filter(
    (m) => !search || m.title.toLowerCase().includes(search.toLowerCase())
  );
  const total = filtered.length;
  const start = (page - 1) * PAGE_SIZE;
  const paginated = filtered.slice(start, start + PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const submittedCount = milestones.filter((m) => m.submission?.submittedAt || m.submission?.status === 'evaluated').length;
  const evaluatedCount = milestones.filter((m) => m.submission?.status === 'evaluated').length;
  const pendingCount = total - submittedCount;
  const completionPct = total ? Math.round((submittedCount / total) * 100) : 0;

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#F4B400] border-t-transparent"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white px-6 py-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1F2E5A] to-[#F4B400] opacity-10 pointer-events-none"></div>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white border-2 border-[#F4B400] flex items-center justify-center">
              <svg className="w-6 h-6 text-[#F4B400]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1F2E5A]">Milestones</h1>
              <p className="text-sm text-[#1F2E5A]/70">Track and submit your FYP milestones</p>
            </div>
          </div>
          <div className="relative w-full sm:w-72">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1F2E5A]/50">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search milestones..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#F4B400]/20 transition bg-white text-[#1F2E5A] placeholder-[#1F2E5A]/50"
            />
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Total Milestones */}
          <div className="bg-white rounded-xl p-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1F2E5A] to-[#F4B400] opacity-5 pointer-events-none"></div>
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm font-medium text-[#1F2E5A]/70 mb-1">Total Milestones</p>
                <p className="text-3xl font-bold text-[#1F2E5A]">{total}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
                <svg className="w-6 h-6 text-[#F4B400]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          {/* Submitted */}
          <div className="bg-white rounded-xl p-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1F2E5A] to-[#F4B400] opacity-5 pointer-events-none"></div>
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm font-medium text-[#1F2E5A]/70 mb-1">Submitted</p>
                <p className="text-3xl font-bold text-[#F4B400]">{submittedCount}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
                <svg className="w-6 h-6 text-[#F4B400]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Evaluated */}
          <div className="bg-white rounded-xl p-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1F2E5A] to-[#F4B400] opacity-5 pointer-events-none"></div>
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm font-medium text-[#1F2E5A]/70 mb-1">Evaluated</p>
                <p className="text-3xl font-bold text-[#F4B400]">{evaluatedCount}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
                <svg className="w-6 h-6 text-[#F4B400]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Completion */}
          <div className="bg-white rounded-xl p-5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1F2E5A] to-[#F4B400] opacity-5 pointer-events-none"></div>
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm font-medium text-[#1F2E5A]/70 mb-1">Completion</p>
                <p className="text-3xl font-bold text-[#1F2E5A]">{completionPct}%</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
                <svg className="w-6 h-6 text-[#F4B400]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              </div>
            </div>
            <div className="mt-3">
              <div className="h-2 bg-[#1F2E5A]/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#1F2E5A] to-[#F4B400] rounded-full transition-all duration-500" style={{ width: `${completionPct}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Milestones Table */}
        <div className="bg-white rounded-xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#1F2E5A] to-[#F4B400] opacity-5 pointer-events-none"></div>
          <div className="px-6 py-4 flex items-center justify-between relative z-10">
            <h2 className="font-semibold text-[#1F2E5A]">All Milestones</h2>
            <p className="text-sm text-[#1F2E5A]/70">{pendingCount} pending</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#1F2E5A]/20">
              <thead className="bg-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#1F2E5A] uppercase tracking-wider">#</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#1F2E5A] uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#1F2E5A] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#1F2E5A] uppercase tracking-wider">Score</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#1F2E5A] uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-[#1F2E5A] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#1F2E5A]/20">
                {paginated.map((m, index) => {
                  const status = getStatusBadge(m);
                  return (
                    <tr key={m.id} className="hover:bg-[#1F2E5A]/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1F2E5A]">{start + index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm font-medium text-[#1F2E5A]">{m.title}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${status.class.replace('bg-', 'bg-').replace('text-', 'text-').replace('border-', 'border-')}`}>
                          {status.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1F2E5A]">
                        {m.submission?.grade != null ? (
                          <span className="font-medium text-[#F4B400]">{m.submission.grade}</span>
                        ) : (
                          <span className="text-[#1F2E5A]/40">—</span>
                        )}
                        <span className="text-[#1F2E5A]/40"> / {m.weightage ?? '—'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#1F2E5A]">{formatDate(m.deadline)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          type="button"
                          onClick={() => setViewMilestone(m)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-[#F4B400] hover:bg-[#F4B400]/10 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-[#1F2E5A]">
              Showing {total === 0 ? 0 : start + 1}–{Math.min(start + PAGE_SIZE, total)} of {total} milestones
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-2 rounded-lg text-sm font-medium text-[#1F2E5A] hover:bg-[#1F2E5A]/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm font-medium text-[#1F2E5A] bg-[#1F2E5A]/10 rounded-lg">{page}</span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-2 rounded-lg text-sm font-medium text-[#1F2E5A] hover:bg-[#1F2E5A]/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* View Milestone Modal */}
      {viewMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F2E5A]/50" onClick={() => setViewMilestone(null)}>
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto relative" onClick={(e) => e.stopPropagation()}>
            <div className="absolute inset-0 bg-gradient-to-br from-[#1F2E5A] to-[#F4B400] opacity-5 pointer-events-none"></div>
            <div className="flex items-center justify-between mb-6 relative z-10">
              <h2 className="text-xl font-bold text-[#1F2E5A]">{viewMilestone.title}</h2>
              <button type="button" onClick={() => setViewMilestone(null)} className="p-2 rounded-lg hover:bg-[#1F2E5A]/10 text-[#1F2E5A]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4 text-sm relative z-10">
              <div>
                <span className="font-semibold text-[#1F2E5A]">Open Date:</span>
                <span className="ml-2 text-[#1F2E5A]/70">{formatDateTime(viewMilestone.openDate)}</span>
              </div>
              <div>
                <span className="font-semibold text-[#1F2E5A]">Due Date:</span>
                <span className="ml-2 text-[#1F2E5A]/70">{formatDateTime(viewMilestone.deadline)}</span>
              </div>
              <div>
                <span className="font-semibold text-[#1F2E5A]">Max Score:</span>
                <span className="ml-2 text-[#1F2E5A]/70">{viewMilestone.weightage ?? '—'}</span>
              </div>
              {viewMilestone.submission?.submittedAt && (
                <div>
                  <span className="font-semibold text-[#1F2E5A]">Submitted:</span>
                  <span className="ml-2 text-[#1F2E5A]/70">{formatDateTime(viewMilestone.submission.submittedAt)}</span>
                </div>
              )}
              {viewMilestone.submission?.status === 'evaluated' && (
                <div className="p-4 bg-[#1F2E5A]/5 space-y-2">
                  <h3 className="font-semibold text-[#1F2E5A]">Evaluation results</h3>
                  {viewMilestone.submission.grade != null && (
                    <p className="text-sm"><span className="text-[#1F2E5A]/70">Grade:</span> <span className="font-medium text-[#F4B400]">{viewMilestone.submission.grade} / {viewMilestone.weightage ?? '—'}</span></p>
                  )}
                  {viewMilestone.submission.feedback && (
                    <p className="text-sm"><span className="text-[#1F2E5A]/70">Supervisor comments:</span> {viewMilestone.submission.feedback}</p>
                  )}
                </div>
              )}
              {viewMilestone.description && (
                <div>
                  <span className="font-semibold text-[#1F2E5A] block mb-1">Description:</span>
                  <p className="text-[#1F2E5A]/70">{viewMilestone.description}</p>
                </div>
              )}
              <div>
                <span className="font-semibold text-[#1F2E5A]">Deliverables / Attachments:</span>
                <p className="text-sm text-[#1F2E5A]/70 mt-1">Upload your report or files below before the deadline.</p>
              </div>
              {viewMilestone.createdBy && (
                <div>
                  <span className="font-semibold text-[#1F2E5A]">Created by:</span>
                  <span className="ml-2 text-[#1F2E5A]/70">{viewMilestone.createdBy}</span>
                </div>
              )}
            </div>
            {!viewMilestone.submission && (
              <div className="mt-6 space-y-4 relative z-10">
                <div>
                  <label className="text-[#1F2E5A]">Upload deliverable (PDF, DOC, ZIP)</label>
                  <input type="file" accept=".pdf,.doc,.docx,.zip" onChange={(e) => setUploadFile(e.target.files?.[0])} className="w-full px-3 py-2 rounded-lg text-[#1F2E5A] focus:outline-none focus:ring-2 focus:ring-[#F4B400]/50" />
                  {uploadFile && <p className="text-sm text-[#1F2E5A]/70 mt-1">Selected: {uploadFile.name}</p>}
                </div>
                <button type="button" className="w-full py-2.5 px-4 bg-[#F4B400] text-[#1F2E5A] font-semibold rounded-lg hover:bg-[#E6A700] transition-colors">
                  Submit milestone
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
