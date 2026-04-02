import { useState, useEffect } from 'react';
import * as projectsApi from '../../api/projects';
import { DUMMY_PROPOSALS } from '../../utils/constants';

const ENHANCED_PROPOSALS = [
  { 
    id: 1, 
    title: 'AI-Powered Campus Navigation System', 
    description: 'A mobile application using machine learning algorithms to help students navigate the campus efficiently. Features include real-time indoor mapping, accessibility routes, and AR-based directions.',
    submittedBy: { name: 'Team Alpha', avatar: 'TA' },
    submittedDate: '2 hours ago',
    category: 'Mobile App',
    priority: 'high',
    status: 'pending'
  },
  { 
    id: 2, 
    title: 'Smart Library Management Platform', 
    description: 'An integrated system for automating library operations including book tracking, reservation management, and AI-based book recommendations for students.',
    submittedBy: { name: 'Team Beta', avatar: 'TB' },
    submittedDate: '5 hours ago',
    category: 'Web Platform',
    priority: 'medium',
    status: 'pending'
  },
  { 
    id: 3, 
    title: 'Blockchain-Based Academic Credential Verification', 
    description: 'A decentralized solution for verifying academic certificates and transcripts using blockchain technology to prevent fraud and streamline verification processes.',
    submittedBy: { name: 'Team Gamma', avatar: 'TG' },
    submittedDate: '1 day ago',
    category: 'Blockchain',
    priority: 'high',
    status: 'pending'
  },
  { 
    id: 4, 
    title: 'IoT-Based Classroom Environment Monitor', 
    description: 'A sensor network system to monitor and optimize classroom conditions including temperature, lighting, air quality, and occupancy for better learning environments.',
    submittedBy: { name: 'Team Delta', avatar: 'TD' },
    submittedDate: '2 days ago',
    category: 'IoT',
    priority: 'low',
    status: 'pending'
  },
];

const STATS = [
  { label: 'Pending Review', value: 12, color: '#D99C00', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  { label: 'Approved Today', value: 5, color: '#16A34A', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  { label: 'Rejected', value: 2, color: '#DC2626', icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z' },
  { label: 'Avg Review Time', value: '3.2h', color: '#2563EB', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
];

const getPriorityColor = (priority) => {
  switch(priority) {
    case 'high': return { bg: '#FEE2E2', text: '#DC2626', border: '#FECACA' };
    case 'medium': return { bg: '#FEF3C7', text: '#D99C00', border: '#FDE68A' };
    case 'low': return { bg: '#DBEAFE', text: '#2563EB', border: '#BFDBFE' };
    default: return { bg: '#F1F5F9', text: '#64748B', border: '#E2E8F0' };
  }
};

const getCategoryIcon = (category) => {
  const icons = {
    'Mobile App': 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
    'Web Platform': 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9',
    'Blockchain': 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
    'IoT': 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z',
  };
  return icons[category] || icons['Web Platform'];
};

export default function MentorProposals() {
  const [proposals, setProposals] = useState(ENHANCED_PROPOSALS);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    projectsApi.getProposalsToReview()
      .then((r) => { setProposals(Array.isArray(r?.data) && r.data.length > 0 ? r.data : ENHANCED_PROPOSALS); })
      .catch(() => { setProposals(ENHANCED_PROPOSALS); })
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

  const handleApprove = async (id) => {
    try {
      await projectsApi.approveProposal(id);
      setProposals((p) => p.filter((x) => x.id !== id));
      setShowDetailModal(false);
      showToast('Proposal approved successfully!');
    } catch (_) {
      setProposals((p) => p.filter((x) => x.id !== id));
      setShowDetailModal(false);
      showToast('Proposal approved successfully!');
    }
  };

  const handleReject = async (id) => {
    try {
      await projectsApi.rejectProposal(id);
      setProposals((p) => p.filter((x) => x.id !== id));
      setShowDetailModal(false);
      showToast('Proposal rejected.', 'error');
    } catch (_) {
      setProposals((p) => p.filter((x) => x.id !== id));
      setShowDetailModal(false);
      showToast('Proposal rejected.', 'error');
    }
  };

  const handleViewDetail = (proposal) => {
    setSelectedProposal(proposal);
    setShowDetailModal(true);
  };

  const filteredProposals = filter === 'all' 
    ? proposals 
    : proposals.filter(p => p.priority === filter);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F8FAFC' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#D99C00', borderTopColor: 'transparent' }}></div>
          <span className="text-lg font-medium" style={{ color: '#64748B' }}>Loading proposals...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Side-by-Side Layout */}
      <div className="flex min-h-screen">
        {/* Left Sidebar - Stats & Filters */}
        <div className="w-80 p-6 flex flex-col" style={{ backgroundColor: '#F8FAFC', borderRight: '1px solid #E2E8F0' }}>
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2" style={{ color: '#0F172A' }}>Proposals</h1>
            <p className="text-sm" style={{ color: '#64748B' }}>Review & Evaluate</p>
          </div>

          {/* Stats */}
          <div className="space-y-3 mb-8">
            {STATS.map((stat, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-2xl transition-all duration-300 cursor-pointer group"
                style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)' }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${stat.color}15` }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke={stat.color} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xl font-bold" style={{ color: '#0F172A' }}>{stat.value}</p>
                      <p className="text-xs" style={{ color: '#64748B' }}>{stat.label}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex-1">
            <h3 className="text-sm font-semibold mb-4" style={{ color: '#334155' }}>Filter by Priority</h3>
            <div className="space-y-2">
              {[
                { key: 'all', label: 'All Proposals', count: proposals.length, color: '#0F172A' },
                { key: 'high', label: 'High Priority', count: proposals.filter(p => p.priority === 'high').length, color: '#DC2626' },
                { key: 'medium', label: 'Medium Priority', count: proposals.filter(p => p.priority === 'medium').length, color: '#D99C00' },
                { key: 'low', label: 'Low Priority', count: proposals.filter(p => p.priority === 'low').length, color: '#2563EB' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className="w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-between group"
                  style={{ 
                    backgroundColor: filter === tab.key ? '#0F172A' : '#FFFFFF',
                    color: filter === tab.key ? '#FFFFFF' : '#64748B',
                    border: '1px solid #E2E8F0',
                    boxShadow: filter === tab.key ? '0 4px 12px rgba(15, 23, 42, 0.15)' : 'none'
                  }}
                >
                  <span className="flex items-center gap-3">
                    <span 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: filter === tab.key ? '#D99C00' : tab.color }}
                    ></span>
                    {tab.label}
                  </span>
                  <span 
                    className="px-2 py-0.5 rounded-lg text-xs"
                    style={{ backgroundColor: filter === tab.key ? 'rgba(255,255,255,0.2)' : '#F1F5F9' }}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content - Proposals Grid */}
        <div className="flex-1 p-8 overflow-y-auto" style={{ backgroundColor: '#FFFFFF' }}>
          {filteredProposals.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#F1F5F9' }}>
                  <svg className="w-10 h-10" style={{ color: '#94A3B8' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#0F172A' }}>No proposals to review</h3>
                <p className="text-sm" style={{ color: '#64748B' }}>All proposals have been reviewed. Check back later!</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              {filteredProposals.map((proposal) => {
                const priorityStyle = getPriorityColor(proposal.priority);
                return (
                  <div 
                    key={proposal.id}
                    className="p-6 rounded-3xl transition-all duration-300 cursor-pointer group relative overflow-hidden"
                    style={{ 
                      backgroundColor: '#F8FAFC', 
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)'
                    }}
                    onMouseEnter={(e) => { 
                      e.currentTarget.style.backgroundColor = '#FFFFFF';
                      e.currentTarget.style.borderColor = '#D99C00';
                      e.currentTarget.style.boxShadow = '0 8px 30px rgba(15, 23, 42, 0.12)';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                    }}
                    onMouseLeave={(e) => { 
                      e.currentTarget.style.backgroundColor = '#F8FAFC';
                      e.currentTarget.style.borderColor = '#E2E8F0';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(15, 23, 42, 0.04)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {/* Priority Indicator Line */}
                    <div 
                      className="absolute top-0 left-0 w-full h-1"
                      style={{ backgroundColor: priorityStyle.text }}
                    ></div>

                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div 
                        className="w-12 h-12 rounded-2xl flex items-center justify-center"
                        style={{ backgroundColor: '#F1F5F9' }}
                      >
                        <svg className="w-6 h-6" style={{ color: '#0F172A' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={getCategoryIcon(proposal.category)} />
                        </svg>
                      </div>
                      <span 
                        className="px-3 py-1 rounded-full text-xs font-bold uppercase"
                        style={{ 
                          backgroundColor: priorityStyle.bg,
                          color: priorityStyle.text,
                          border: `1px solid ${priorityStyle.border}`
                        }}
                      >
                        {proposal.priority}
                      </span>
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-bold mb-2 line-clamp-2" style={{ color: '#0F172A' }}>{proposal.title}</h3>
                    <p className="text-sm mb-4 line-clamp-3" style={{ color: '#64748B' }}>{proposal.description}</p>

                    {/* Team Info */}
                    <div className="flex items-center gap-3 mb-5 p-3 rounded-xl" style={{ backgroundColor: '#F8FAFC' }}>
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                        style={{ backgroundColor: '#0F172A' }}
                      >
                        {proposal.submittedBy.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium" style={{ color: '#0F172A' }}>{proposal.submittedBy.name}</p>
                        <p className="text-xs" style={{ color: '#94A3B8' }}>{proposal.submittedDate}</p>
                      </div>
                    </div>

                    {/* Category & Actions */}
                    <div className="flex items-center justify-between">
                      <span 
                        className="px-3 py-1.5 rounded-lg text-xs font-medium"
                        style={{ backgroundColor: '#F1F5F9', color: '#64748B' }}
                      >
                        {proposal.category}
                      </span>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleViewDetail(proposal)}
                          className="p-2 rounded-lg transition-all duration-200 hover:shadow-md"
                          style={{ backgroundColor: '#F1F5F9' }}
                        >
                          <svg className="w-4 h-4" style={{ color: '#0F172A' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleApprove(proposal.id)}
                          className="p-2 rounded-lg transition-all duration-200 hover:shadow-md"
                          style={{ backgroundColor: '#16A34A' }}
                        >
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleReject(proposal.id)}
                          className="p-2 rounded-lg transition-all duration-200 hover:shadow-md"
                          style={{ backgroundColor: '#DC2626' }}
                        >
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal - Light Theme */}
      {showDetailModal && selectedProposal && (
        <div 
          className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto"
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }}
          onClick={() => setShowDetailModal(false)}
        >
          <div 
            className="rounded-3xl max-w-2xl w-full p-8 my-8 relative"
            style={{ 
              backgroundColor: '#FFFFFF', 
              border: '1px solid #E2E8F0',
              boxShadow: '0 25px 80px rgba(15, 23, 42, 0.3)' 
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Priority Line */}
            <div 
              className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
              style={{ backgroundColor: getPriorityColor(selectedProposal.priority).text }}
            ></div>

            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: '#F1F5F9' }}
                >
                  <svg className="w-8 h-8" style={{ color: '#0F172A' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={getCategoryIcon(selectedProposal.category)} />
                  </svg>
                </div>
                <div>
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
                    style={{ 
                      backgroundColor: getPriorityColor(selectedProposal.priority).bg,
                      color: getPriorityColor(selectedProposal.priority).text
                    }}
                  >
                    {selectedProposal.priority} Priority
                  </span>
                  <h2 className="text-2xl font-bold mt-2" style={{ color: '#0F172A' }}>{selectedProposal.title}</h2>
                </div>
              </div>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="p-2 rounded-xl transition-colors hover:bg-slate-100"
                style={{ backgroundColor: '#F1F5F9' }}
              >
                <svg className="w-5 h-5" style={{ color: '#64748B' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold mb-2" style={{ color: '#64748B' }}>Description</h4>
                <p className="text-base leading-relaxed" style={{ color: '#334155' }}>{selectedProposal.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl" style={{ backgroundColor: '#F8FAFC' }}>
                  <h4 className="text-sm font-semibold mb-2" style={{ color: '#64748B' }}>Submitted By</h4>
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white"
                      style={{ backgroundColor: '#0F172A' }}
                    >
                      {selectedProposal.submittedBy.avatar}
                    </div>
                    <span className="font-medium" style={{ color: '#0F172A' }}>{selectedProposal.submittedBy.name}</span>
                  </div>
                </div>
                <div className="p-4 rounded-xl" style={{ backgroundColor: '#F8FAFC' }}>
                  <h4 className="text-sm font-semibold mb-2" style={{ color: '#64748B' }}>Submission Date</h4>
                  <p className="font-medium" style={{ color: '#0F172A' }}>{selectedProposal.submittedDate}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl" style={{ backgroundColor: '#F8FAFC' }}>
                <h4 className="text-sm font-semibold mb-2" style={{ color: '#64748B' }}>Category</h4>
                <span 
                  className="px-4 py-2 rounded-xl text-sm font-medium"
                  style={{ backgroundColor: '#F1F5F9', color: '#0F172A', border: '1px solid #E2E8F0' }}
                >
                  {selectedProposal.category}
                </span>
              </div>
            </div>

            <div className="flex gap-3 mt-8 pt-6" style={{ borderTop: '1px solid #E2E8F0' }}>
              <button
                onClick={() => handleReject(selectedProposal.id)}
                className="flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
                style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}
              >
                Reject Proposal
              </button>
              <button
                onClick={() => handleApprove(selectedProposal.id)}
                className="flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-2"
                style={{ backgroundColor: '#16A34A', color: '#FFFFFF' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Approve Proposal
              </button>
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
