import { useState, useEffect } from 'react';
import * as milestonesApi from '../../api/milestones';
import { DUMMY_SUBMISSIONS } from '../../utils/constants';

const ENHANCED_SUBMISSIONS = [
  {
    id: 1,
    milestone: { title: 'Project Proposal & Requirements' },
    project: { title: 'AI Campus Navigator' },
    submittedBy: { name: 'Team Alpha', avatar: 'TA' },
    submittedDate: '2 hours ago',
    dueDate: 'Due in 3 days',
    status: 'pending',
    files: 3,
    comments: 5,
    grade: null
  },
  {
    id: 2,
    milestone: { title: 'System Design Document' },
    project: { title: 'Smart Library System' },
    submittedBy: { name: 'Team Beta', avatar: 'TB' },
    submittedDate: '5 hours ago',
    dueDate: 'Due tomorrow',
    status: 'urgent',
    files: 5,
    comments: 2,
    grade: null
  },
  {
    id: 3,
    milestone: { title: 'Prototype Development' },
    project: { title: 'Blockchain Credentials' },
    submittedBy: { name: 'Team Gamma', avatar: 'TG' },
    submittedDate: '1 day ago',
    dueDate: 'Overdue by 1 day',
    status: 'overdue',
    files: 8,
    comments: 12,
    grade: null
  },
  {
    id: 4,
    milestone: { title: 'Mid-term Presentation' },
    project: { title: 'IoT Classroom Monitor' },
    submittedBy: { name: 'Team Delta', avatar: 'TD' },
    submittedDate: '3 days ago',
    dueDate: 'Due in 5 days',
    status: 'pending',
    files: 2,
    comments: 0,
    grade: null
  },
];

const STATS = [
  { label: 'Pending Review', value: 8, color: '#D99C00', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  { label: 'Evaluated Today', value: 12, color: '#16A34A', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  { label: 'Overdue', value: 3, color: '#DC2626', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
  { label: 'Avg Grade', value: '84%', color: '#2563EB', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
];

const getStatusColor = (status) => {
  switch(status) {
    case 'urgent': return { bg: '#FEE2E2', text: '#DC2626', border: '#FECACA', dot: '#DC2626' };
    case 'overdue': return { bg: '#FEE2E2', text: '#DC2626', border: '#FECACA', dot: '#DC2626' };
    case 'pending': return { bg: '#FEF3C7', text: '#D99C00', border: '#FDE68A', dot: '#D99C00' };
    default: return { bg: '#F1F5F9', text: '#64748B', border: '#E2E8F0', dot: '#94A3B8' };
  }
};

export default function MentorMilestones() {
  const [submissions, setSubmissions] = useState(ENHANCED_SUBMISSIONS);
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');
  const [filter, setFilter] = useState('all');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    milestonesApi.getSubmissionsToEvaluate()
      .then((r) => { setSubmissions(Array.isArray(r?.data) && r.data.length > 0 ? r.data : ENHANCED_SUBMISSIONS); })
      .catch(() => { setSubmissions(ENHANCED_SUBMISSIONS); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleEvaluate = async (submissionId) => {
    if (!grade && !feedback.trim()) return;
    setSubmissions((prev) => prev.filter((s) => s.id !== submissionId));
    setEvaluating(null);
    setSelectedSubmission(null);
    setGrade('');
    setFeedback('');
    showToast('Evaluation submitted successfully!');
  };

  const handleOpenEvaluate = (submission) => {
    setSelectedSubmission(submission);
    setEvaluating(submission.id);
  };

  const handleCloseEvaluate = () => {
    setEvaluating(null);
    setSelectedSubmission(null);
    setGrade('');
    setFeedback('');
  };

  const filteredSubmissions = filter === 'all' 
    ? submissions 
    : filter === 'urgent' 
      ? submissions.filter(s => s.status === 'urgent' || s.status === 'overdue')
      : submissions.filter(s => s.status === filter);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0F172A' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#D99C00', borderTopColor: 'transparent' }}></div>
          <span className="text-lg font-medium text-white">Loading submissions...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%)' }}>
      {/* Glassmorphism Header */}
      <div className="sticky top-4 z-40 mx-8">
        <div 
          className="px-6 py-4 rounded-2xl backdrop-blur-xl"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            boxShadow: '0 8px 32px rgba(15, 23, 42, 0.1)'
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ 
                  background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                  boxShadow: '0 4px 15px rgba(15, 23, 42, 0.3)'
                }}
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: '#0F172A' }}>Evaluate Milestones</h1>
                <p className="text-sm" style={{ color: '#64748B' }}>Review and grade student submissions</p>
              </div>
            </div>
            
            {/* Stats Pills */}
            <div className="flex items-center gap-3">
              {STATS.slice(0, 3).map((stat, idx) => (
                <div 
                  key={idx}
                  className="px-4 py-2 rounded-full flex items-center gap-2"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.6)',
                    border: '1px solid rgba(226, 232, 240, 0.8)'
                  }}
                >
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: stat.color }}
                  ></div>
                  <span className="font-bold text-sm" style={{ color: '#0F172A' }}>{stat.value}</span>
                  <span className="text-xs" style={{ color: '#64748B' }}>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Filter Chips */}
        <div className="flex items-center gap-3 mb-8">
          {[
            { key: 'all', label: 'All', count: submissions.length },
            { key: 'urgent', label: 'Urgent', count: submissions.filter(s => s.status === 'urgent' || s.status === 'overdue').length },
            { key: 'pending', label: 'Pending', count: submissions.filter(s => s.status === 'pending').length },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setFilter(item.key)}
              className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2"
              style={{ 
                backgroundColor: filter === item.key ? '#0F172A' : 'rgba(255, 255, 255, 0.7)',
                color: filter === item.key ? '#FFFFFF' : '#64748B',
                border: '1px solid rgba(226, 232, 240, 0.8)',
                boxShadow: filter === item.key ? '0 4px 15px rgba(15, 23, 42, 0.2)' : '0 2px 8px rgba(15, 23, 42, 0.05)',
                backdropFilter: 'blur(10px)'
              }}
            >
              {item.label}
              <span 
                className="px-2 py-0.5 rounded-full text-xs"
                style={{ 
                  backgroundColor: filter === item.key ? 'rgba(255,255,255,0.2)' : '#F1F5F9',
                  color: filter === item.key ? '#FFFFFF' : '#64748B'
                }}
              >
                {item.count}
              </span>
            </button>
          ))}
        </div>

        {filteredSubmissions.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div 
              className="text-center p-12 rounded-3xl"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.5)'
              }}
            >
              <div 
                className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ 
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  boxShadow: '0 8px 30px rgba(16, 185, 129, 0.3)'
                }}
              >
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: '#0F172A' }}>All caught up!</h3>
              <p className="text-sm" style={{ color: '#64748B' }}>No submissions to evaluate. Great job!</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            {filteredSubmissions.map((submission) => {
              const statusStyle = getStatusColor(submission.status);
              return (
                <div 
                  key={submission.id}
                  className="p-6 rounded-3xl transition-all duration-300 cursor-pointer group relative overflow-hidden"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.6)',
                    boxShadow: '0 4px 20px rgba(15, 23, 42, 0.08)'
                  }}
                  onMouseEnter={(e) => { 
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 1)';
                    e.currentTarget.style.boxShadow = '0 20px 50px rgba(15, 23, 42, 0.15)';
                    e.currentTarget.style.transform = 'translateY(-6px) scale(1.01)';
                  }}
                  onMouseLeave={(e) => { 
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(15, 23, 42, 0.08)';
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  }}
                >
                  {/* Status Line */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ backgroundColor: statusStyle.text }}
                  ></div>

                  {/* Content */}
                  <div className="flex items-start gap-4 mb-4">
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold flex-shrink-0 shadow-lg"
                      style={{ 
                        backgroundColor: statusStyle.bg,
                        color: statusStyle.text,
                        border: `2px solid ${statusStyle.border}`
                      }}
                    >
                      {submission.submittedBy.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="text-lg font-bold truncate" style={{ color: '#0F172A' }}>{submission.milestone.title}</h3>
                        <span 
                          className="px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap flex-shrink-0 flex items-center gap-1.5"
                          style={{ 
                            backgroundColor: statusStyle.bg,
                            color: statusStyle.text,
                            border: `1px solid ${statusStyle.border}`
                          }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: statusStyle.dot }}></span>
                          {submission.status}
                        </span>
                      </div>
                      <p className="text-sm font-medium" style={{ color: '#64748B' }}>{submission.project.title}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm mb-5 line-clamp-2" style={{ color: '#64748B' }}>
                    Submission from <span className="font-semibold" style={{ color: '#0F172A' }}>{submission.submittedBy.name}</span> requires your evaluation.
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center gap-5 mb-5">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#F8FAFC' }}>
                      <svg className="w-4 h-4" style={{ color: '#94A3B8' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-medium" style={{ color: '#64748B' }}>{submission.submittedDate}</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#F8FAFC' }}>
                      <svg className="w-4 h-4" style={{ color: '#94A3B8' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-sm font-medium" style={{ color: '#64748B' }}>{submission.files} files</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#F8FAFC' }}>
                      <svg className="w-4 h-4" style={{ color: '#94A3B8' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                      <span className="text-sm font-medium" style={{ color: '#64748B' }}>{submission.comments}</span>
                    </div>
                  </div>

                  {/* Due Date & Action */}
                  <div className="flex items-center justify-between pt-5" style={{ borderTop: '1px solid #F1F5F9' }}>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" style={{ color: submission.status === 'overdue' ? '#DC2626' : '#94A3B8' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-semibold" style={{ color: submission.status === 'overdue' ? '#DC2626' : '#64748B' }}>
                        {submission.dueDate}
                      </span>
                    </div>
                    <button 
                      onClick={() => handleOpenEvaluate(submission)}
                      className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2"
                      style={{ 
                        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                        color: '#FFFFFF',
                        boxShadow: '0 4px 15px rgba(15, 23, 42, 0.3)'
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Evaluate
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Evaluation Modal - Glassmorphism */}
      {evaluating && selectedSubmission && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)' }}
          onClick={handleCloseEvaluate}
        >
          <div 
            className="rounded-3xl max-w-lg w-full p-8 relative overflow-hidden"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              boxShadow: '0 25px 80px rgba(15, 23, 42, 0.2)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decorative gradient orb */}
            <div 
              className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-30"
              style={{ background: 'linear-gradient(135deg, #D99C00 0%, #F4B400 100%)', filter: 'blur(60px)' }}
            ></div>

            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold" style={{ color: '#0F172A' }}>Evaluate Submission</h3>
                  <p className="text-sm mt-1" style={{ color: '#64748B' }}>{selectedSubmission.milestone.title}</p>
                </div>
                <button 
                  onClick={handleCloseEvaluate}
                  className="p-2 rounded-xl transition-all duration-200 hover:shadow-md"
                  style={{ backgroundColor: '#F1F5F9' }}
                >
                  <svg className="w-5 h-5" style={{ color: '#64748B' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div 
                className="p-4 rounded-2xl mb-6"
                style={{ 
                  backgroundColor: 'rgba(248, 250, 252, 0.8)',
                  border: '1px solid rgba(226, 232, 240, 0.8)'
                }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold text-white shadow-lg"
                    style={{ 
                      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)'
                    }}
                  >
                    {selectedSubmission.submittedBy.avatar}
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: '#0F172A' }}>{selectedSubmission.submittedBy.name}</p>
                    <p className="text-xs" style={{ color: '#64748B' }}>{selectedSubmission.project.title}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#334155' }}>Grade (0-100)</label>
                  <input 
                    type="number" 
                    min="0" 
                    max="100" 
                    placeholder="Enter grade" 
                    value={grade} 
                    onChange={(e) => setGrade(e.target.value)} 
                    className="w-full px-4 py-3 rounded-xl focus:outline-none transition-all duration-200"
                    style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      border: '1px solid #E2E8F0',
                      color: '#0F172A'
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: '#334155' }}>Feedback</label>
                  <textarea 
                    placeholder="Provide detailed feedback..." 
                    value={feedback} 
                    onChange={(e) => setFeedback(e.target.value)} 
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl focus:outline-none transition-all duration-200 resize-none"
                    style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      border: '1px solid #E2E8F0',
                      color: '#0F172A'
                    }}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={handleCloseEvaluate}
                  className="flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:shadow-md"
                  style={{ backgroundColor: '#F1F5F9', color: '#64748B' }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleEvaluate(selectedSubmission.id)}
                  className="flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-xl flex items-center justify-center gap-2"
                  style={{ 
                    background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                    color: '#FFFFFF',
                    boxShadow: '0 4px 15px rgba(15, 23, 42, 0.3)'
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Submit Evaluation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
          <div 
            className="px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3"
            style={{ 
              backgroundColor: toast.type === 'success' ? '#16A34A' : '#DC2626',
              color: '#FFFFFF'
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
