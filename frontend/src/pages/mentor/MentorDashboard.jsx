import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DUMMY_PROPOSALS, DUMMY_SUBMISSIONS_TO_EVALUATE } from '../../utils/constants';

export default function MentorDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    proposals: DUMMY_PROPOSALS.filter(p => p.status === 'pending').length,
    submissions: DUMMY_SUBMISSIONS_TO_EVALUATE.length,
    groups: 3,
    students: 9
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [filterType, setFilterType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReview, setSelectedReview] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState([
    { id: 1, title: 'New proposal submitted', message: 'Zara Rashid submitted AI Chatbot proposal', time: '2h ago', unread: true },
    { id: 2, title: 'Milestone completed', message: 'Team Alpha completed Literature Review', time: '5h ago', unread: true },
    { id: 3, title: 'Message received', message: 'New message from Sara Ahmed', time: '1d ago', unread: false },
  ]);

  const [recentReviews, setRecentReviews] = useState([
    { id: 1, student: 'Zara Rashid', project: 'AI Chatbot', type: 'Proposal', status: 'pending', time: '2h ago', avatar: 'ZR', description: 'A comprehensive AI-powered chatbot for customer support with NLP capabilities.' },
    { id: 2, student: 'Ali Hassan', project: 'E-Learning Platform', type: 'Milestone', status: 'reviewed', time: '5h ago', avatar: 'AH', description: 'Literature Review milestone submission with 15 references.' },
    { id: 3, student: 'Sara Ahmed', project: 'Health Tracker', type: 'Document', status: 'pending', time: '1d ago', avatar: 'SA', description: 'Project documentation including SRS and design specifications.' },
    { id: 4, student: 'Omar Khan', project: 'Smart Home', type: 'Proposal', status: 'approved', time: '2d ago', avatar: 'OK', description: 'IoT-based smart home automation system using Raspberry Pi.' },
  ]);

  // Filter reviews based on type and search
  const filteredReviews = recentReviews.filter(review => {
    const matchesType = filterType === 'All' || review.type === filterType;
    const matchesSearch = review.student.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         review.project.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Handle review action
  const handleReviewAction = (reviewId, action) => {
    setRecentReviews(prev => prev.map(review => 
      review.id === reviewId ? { ...review, status: action === 'approve' ? 'approved' : 'rejected' } : review
    ));
    setSelectedReview(null);
  };

  // Handle tab navigation
  const handleTabClick = (tab) => {
    setActiveTab(tab.toLowerCase());
    if (tab === 'Proposals') navigate('/mentor/proposals');
    if (tab === 'Milestones') navigate('/mentor/milestones');
    if (tab === 'Groups') navigate('/mentor/groups');
  };

  const myGroups = [
    { id: 1, name: 'Team Alpha', project: 'AI Chatbot', progress: 78, members: 3, status: 'active', color: '#0F172A' },
    { id: 2, name: 'Team Beta', project: 'E-Learning', progress: 45, members: 4, status: 'review', color: '#D99C00' },
    { id: 3, name: 'Team Gamma', project: 'Health App', progress: 92, members: 3, status: 'completed', color: '#16A34A' },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
      {/* Top Navigation Bar - Glassmorphism */}
      <div className="px-6 py-4 sticky top-0 z-50 backdrop-blur-md" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderBottom: '1px solid #E2E8F0' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#0F172A' }}>
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h1 className="text-lg font-bold" style={{ color: '#0F172A' }}>Mentor Portal</h1>
            </div>
            <nav className="flex items-center gap-1">
              {['Overview', 'Proposals', 'Milestones', 'Groups'].map((item) => (
                <button
                  key={item}
                  onClick={() => handleTabClick(item)}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  style={{
                    color: activeTab === item.toLowerCase() ? '#0F172A' : '#64748B',
                    backgroundColor: activeTab === item.toLowerCase() ? '#F1F5F9' : 'transparent'
                  }}
                  onMouseEnter={(e) => { if (activeTab !== item.toLowerCase()) e.target.style.backgroundColor = '#F8FAFC'; }}
                  onMouseLeave={(e) => { if (activeTab !== item.toLowerCase()) e.target.style.backgroundColor = 'transparent'; }}
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 rounded-xl transition-all duration-200 hover:shadow-md"
                style={{ backgroundColor: '#F1F5F9' }}
              >
                <svg className="w-5 h-5" style={{ color: '#64748B' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {notifications.some(n => n.unread) && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full ring-2 ring-white" style={{ backgroundColor: '#DC2626' }}></span>
                )}
              </button>
              
              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 rounded-xl shadow-lg z-50" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                  <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: '#E2E8F0' }}>
                    <h3 className="font-semibold text-sm" style={{ color: '#0F172A' }}>Notifications</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#F1F5F9', color: '#64748B' }}>
                      {notifications.filter(n => n.unread).length} new
                    </span>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div key={notif.id} className="px-4 py-3 hover:bg-slate-50 cursor-pointer transition" style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-1.5 ${notif.unread ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium" style={{ color: '#0F172A' }}>{notif.title}</p>
                            <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>{notif.message}</p>
                            <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>{notif.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 pl-4" style={{ borderLeft: '1px solid #E2E8F0' }}>
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold" style={{ color: '#0F172A' }}>Dr. Smith</p>
                <p className="text-xs" style={{ color: '#64748B' }}>Senior Mentor</p>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium ring-2 ring-slate-100" style={{ backgroundColor: '#0F172A' }}>
                DR
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Welcome Banner - Gradient */}
        <div className="mb-8 p-8 rounded-3xl relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)' }}>
          <div className="absolute top-0 right-0 w-96 h-96 opacity-10" style={{ background: 'radial-gradient(circle, #D99C00 0%, transparent 70%)', transform: 'translate(30%, -30%)' }}></div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(217, 156, 0, 0.2)', color: '#D99C00' }}>
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </span>
              </div>
              <h2 className="text-3xl font-bold mb-2" style={{ color: '#FFFFFF' }}>Welcome back, Dr. Smith!</h2>
              <p className="text-base" style={{ color: '#94A3B8' }}>You have <span className="font-semibold" style={{ color: '#D99C00' }}>{stats.proposals} pending proposals</span> and <span className="font-semibold" style={{ color: '#D99C00' }}>{stats.submissions} submissions</span> awaiting your review today.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden lg:block">
                <p className="text-3xl font-bold" style={{ color: '#FFFFFF' }}>87%</p>
                <p className="text-sm" style={{ color: '#94A3B8' }}>Review Rate</p>
              </div>
              <button className="px-6 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all duration-200 hover:shadow-lg hover:scale-105" style={{ backgroundColor: '#D99C00', color: '#FFFFFF' }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Start Review
              </button>
            </div>
          </div>
        </div>

        {/* Stats Row - Modern Cards with Hover Effects */}
        <div className="grid grid-cols-4 gap-5 mb-8">
          {[
            { label: 'Pending Reviews', value: stats.proposals + stats.submissions, trend: '+3 today', trendUp: true, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: '#D99C00', bg: '#FFFBEB', border: '#FCD34D' },
            { label: 'Active Groups', value: stats.groups, trend: 'All on track', trendUp: true, icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', color: '#2563EB', bg: '#EFF6FF', border: '#93C5FD' },
            { label: 'Total Students', value: stats.students, trend: '3 new this week', trendUp: true, icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', color: '#16A34A', bg: '#F0FDF4', border: '#86EFAC' },
            { label: 'Completion Rate', value: '87%', trend: '+5% this month', trendUp: true, icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', color: '#0F172A', bg: '#F8FAFC', border: '#CBD5E1' },
          ].map((stat, idx) => (
            <div 
              key={idx} 
              className="p-5 rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group"
              style={{ 
                backgroundColor: '#FFFFFF', 
                border: '1px solid #E2E8F0',
                boxShadow: '0 1px 3px rgba(15, 23, 42, 0.08)'
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: stat.bg, border: `1px solid ${stat.border}` }}
                >
                  <svg className="w-6 h-6" fill="none" stroke={stat.color} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                  </svg>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ backgroundColor: stat.trendUp ? '#F0FDF4' : '#FEF2F2' }}>
                  <svg className="w-3 h-3" fill="none" stroke={stat.trendUp ? '#16A34A' : '#DC2626'} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={stat.trendUp ? 'M5 10l7-7m0 0l7 7m-7-7v18' : 'M19 14l-7 7m0 0l-7-7m7 7V3'} />
                  </svg>
                  <span className="text-xs font-semibold" style={{ color: stat.trendUp ? '#16A34A' : '#DC2626' }}>{stat.trend}</span>
                </div>
              </div>
              <p className="text-3xl font-bold mb-1" style={{ color: '#0F172A' }}>{stat.value}</p>
              <p className="text-sm font-medium" style={{ color: '#64748B' }}>{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Main Content - Review Queue */}
          <div className="col-span-2 space-y-6">
            {/* Review Queue - Modern Table */}
            <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(15, 23, 42, 0.08)' }}>
              <div className="px-6 py-5 border-b flex items-center justify-between" style={{ borderColor: '#E2E8F0' }}>
                <div>
                  <h3 className="font-semibold text-lg" style={{ color: '#0F172A' }}>Review Queue</h3>
                  <p className="text-sm mt-0.5" style={{ color: '#64748B' }}>Items awaiting your evaluation</p>
                </div>
                <div className="flex items-center gap-3">
                  {/* Search Input */}
                  <div className="relative">
                    <svg className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#94A3B8' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-2 rounded-lg text-sm border focus:outline-none focus:border-blue-400 transition"
                      style={{ borderColor: '#E2E8F0', width: '180px' }}
                    />
                  </div>
                  {/* Filter Tabs */}
                  <div className="flex items-center gap-1 p-1 rounded-xl" style={{ backgroundColor: '#F1F5F9' }}>
                    {['All', 'Proposal', 'Milestone', 'Document'].map((filter) => (
                      <button 
                        key={filter}
                        onClick={() => setFilterType(filter)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                        style={{ 
                          backgroundColor: filterType === filter ? '#FFFFFF' : 'transparent',
                          color: filterType === filter ? '#0F172A' : '#64748B',
                          boxShadow: filterType === filter ? '0 1px 2px rgba(15, 23, 42, 0.1)' : 'none'
                        }}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                {filteredReviews.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <svg className="w-12 h-12 mx-auto mb-3" style={{ color: '#CBD5E1' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm" style={{ color: '#64748B' }}>No reviews found</p>
                  </div>
                ) : (
                  filteredReviews.map((item, idx) => (
                  <div 
                    key={item.id} 
                    onClick={() => setSelectedReview(item)}
                    className="px-6 py-4 flex items-center gap-4 transition-all duration-200 cursor-pointer group"
                    style={{ 
                      borderBottom: idx !== filteredReviews.length - 1 ? '1px solid #F1F5F9' : 'none',
                      backgroundColor: 'transparent'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <div 
                      className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold text-white transition-transform duration-200 group-hover:scale-110"
                      style={{ backgroundColor: '#0F172A' }}
                    >
                      {item.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm" style={{ color: '#0F172A' }}>{item.student}</span>
                        <span 
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ 
                            backgroundColor: item.type === 'Proposal' ? '#FEF3C7' : item.type === 'Milestone' ? '#DBEAFE' : '#F3E8FF',
                            color: item.type === 'Proposal' ? '#D99C00' : item.type === 'Milestone' ? '#2563EB' : '#7C3AED'
                          }}
                        >
                          {item.type}
                        </span>
                      </div>
                      <p className="text-sm mt-0.5" style={{ color: '#64748B' }}>{item.project}</p>
                    </div>
                    <div className="text-right">
                      <span 
                        className="text-xs px-3 py-1.5 rounded-full font-semibold"
                        style={{
                          backgroundColor: item.status === 'pending' ? '#FEF3C7' : item.status === 'approved' ? '#DCFCE7' : item.status === 'reviewed' ? '#DBEAFE' : '#F1F5F9',
                          color: item.status === 'pending' ? '#D99C00' : item.status === 'approved' ? '#16A34A' : item.status === 'reviewed' ? '#2563EB' : '#64748B'
                        }}
                      >
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                      <p className="text-xs mt-1.5 font-medium" style={{ color: '#94A3B8' }}>{item.time}</p>
                    </div>
                  </div>
                )))}
              </div>
              <div className="px-6 py-4 border-t" style={{ borderColor: '#E2E8F0' }}>
                <button className="text-sm font-semibold flex items-center gap-1 transition-colors duration-200 hover:gap-2" style={{ color: '#D99C00' }}>
                  View all reviews 
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Quick Actions Grid - Modern Cards */}
            <div className="grid grid-cols-3 gap-5">
              {[
                { title: 'Review Proposals', desc: '3 pending', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', color: '#0F172A', bg: '#F1F5F9', border: '#CBD5E1' },
                { title: 'Evaluate Work', desc: '5 submissions', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4', color: '#D99C00', bg: '#FFFBEB', border: '#FCD34D' },
                { title: 'Send Message', desc: 'Chat with teams', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', color: '#16A34A', bg: '#F0FDF4', border: '#86EFAC' },
              ].map((action, idx) => (
                <Link 
                  key={idx} 
                  to={idx === 0 ? '/mentor/proposals' : idx === 1 ? '/mentor/milestones' : '/mentor/chat'} 
                  className="p-5 rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group"
                  style={{ 
                    backgroundColor: '#FFFFFF', 
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 1px 3px rgba(15, 23, 42, 0.08)'
                  }}
                >
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                    style={{ backgroundColor: action.bg, border: `1px solid ${action.border}` }}
                  >
                    <svg className="w-6 h-6" fill="none" stroke={action.color} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
                    </svg>
                  </div>
                  <p className="font-semibold text-sm" style={{ color: '#0F172A' }}>{action.title}</p>
                  <p className="text-sm mt-1" style={{ color: '#64748B' }}>{action.desc}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Sidebar - My Groups */}
          <div className="space-y-6">
            {/* My Groups Card */}
            <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(15, 23, 42, 0.08)' }}>
              <div className="px-6 py-5 border-b flex items-center justify-between" style={{ borderColor: '#E2E8F0' }}>
                <h3 className="font-semibold text-lg" style={{ color: '#0F172A' }}>My Groups</h3>
                <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ backgroundColor: '#F1F5F9', color: '#64748B' }}>{myGroups.length} active</span>
              </div>
              <div className="p-6 space-y-5">
                {myGroups.map((group) => (
                  <div 
                    key={group.id} 
                    className="p-4 rounded-xl transition-all duration-200 cursor-pointer group"
                    style={{ backgroundColor: '#F8FAFC', border: '1px solid transparent' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(15, 23, 42, 0.08)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F8FAFC'; e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-sm" style={{ color: '#0F172A' }}>{group.name}</h4>
                      <span 
                        className="text-xs px-2.5 py-1 rounded-full font-semibold"
                        style={{
                          backgroundColor: group.status === 'active' ? '#DCFCE7' : group.status === 'review' ? '#FEF3C7' : '#DBEAFE',
                          color: group.status === 'active' ? '#16A34A' : group.status === 'review' ? '#D99C00' : '#2563EB'
                        }}
                      >
                        {group.status.charAt(0).toUpperCase() + group.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm mb-4" style={{ color: '#64748B' }}>{group.project}</p>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex -space-x-2">
                        {[...Array(group.members)].map((_, i) => (
                          <div 
                            key={i} 
                            className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-xs font-semibold text-white transition-transform duration-200 group-hover:scale-110"
                            style={{ backgroundColor: group.color }}
                          >
                            {String.fromCharCode(65 + i)}
                          </div>
                        ))}
                      </div>
                      <span className="text-sm font-bold" style={{ color: group.color }}>{group.progress}%</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#E2E8F0' }}>
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${group.progress}%`, backgroundColor: group.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-6 py-4 border-t" style={{ borderColor: '#E2E8F0' }}>
                <button 
                  className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                  style={{ backgroundColor: '#F1F5F9', color: '#0F172A' }}
                  onMouseEnter={(e) => { e.target.style.backgroundColor = '#E2E8F0'; }}
                  onMouseLeave={(e) => { e.target.style.backgroundColor = '#F1F5F9'; }}
                >
                  View all groups
                </button>
              </div>
            </div>

            {/* Calendar Widget - Modern */}
            <div className="p-6 rounded-2xl" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(15, 23, 42, 0.08)' }}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-lg" style={{ color: '#0F172A' }}>Upcoming</h3>
                <button className="text-xs font-semibold" style={{ color: '#D99C00' }}>View calendar</button>
              </div>
              <div className="space-y-4">
                {[
                  { title: 'Team Alpha Review', time: 'Today, 2:00 PM', type: 'meeting', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
                  { title: 'Proposal Deadline', time: 'Tomorrow, 11:59 PM', type: 'deadline', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
                  { title: 'Weekly Sync', time: 'Fri, 10:00 AM', type: 'meeting', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
                ].map((event, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl transition-all duration-200 cursor-pointer hover:bg-slate-50">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: event.type === 'meeting' ? '#EFF6FF' : '#FEF2F2' }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke={event.type === 'meeting' ? '#2563EB' : '#DC2626'} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={event.icon} />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: '#0F172A' }}>{event.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>{event.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Detail Modal */}
      {selectedReview && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }}
          onClick={() => setSelectedReview(null)}
        >
          <div 
            className="rounded-2xl max-w-lg w-full overflow-hidden"
            style={{ backgroundColor: '#FFFFFF' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-5 border-b flex items-center justify-between" style={{ borderColor: '#E2E8F0' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold" style={{ backgroundColor: '#0F172A' }}>
                  {selectedReview.avatar}
                </div>
                <div>
                  <h3 className="font-semibold" style={{ color: '#0F172A' }}>{selectedReview.student}</h3>
                  <p className="text-xs" style={{ color: '#64748B' }}>{selectedReview.project}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedReview(null)}
                className="p-2 rounded-lg hover:bg-slate-100 transition"
              >
                <svg className="w-5 h-5" style={{ color: '#64748B' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <span 
                  className="text-xs px-3 py-1 rounded-full font-semibold"
                  style={{
                    backgroundColor: selectedReview.type === 'Proposal' ? '#FEF3C7' : selectedReview.type === 'Milestone' ? '#DBEAFE' : '#F3E8FF',
                    color: selectedReview.type === 'Proposal' ? '#D99C00' : selectedReview.type === 'Milestone' ? '#2563EB' : '#7C3AED'
                  }}
                >
                  {selectedReview.type}
                </span>
                <span 
                  className="text-xs px-3 py-1 rounded-full font-semibold"
                  style={{
                    backgroundColor: selectedReview.status === 'pending' ? '#FEF3C7' : selectedReview.status === 'approved' ? '#DCFCE7' : '#DBEAFE',
                    color: selectedReview.status === 'pending' ? '#D99C00' : selectedReview.status === 'approved' ? '#16A34A' : '#2563EB'
                  }}
                >
                  {selectedReview.status.charAt(0).toUpperCase() + selectedReview.status.slice(1)}
                </span>
              </div>
              <p className="text-sm mb-6" style={{ color: '#334155' }}>{selectedReview.description}</p>
              <div className="flex gap-3">
                {selectedReview.status === 'pending' && (
                  <>
                    <button 
                      onClick={() => handleReviewAction(selectedReview.id, 'approve')}
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-md"
                      style={{ backgroundColor: '#16A34A', color: '#FFFFFF' }}
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => handleReviewAction(selectedReview.id, 'reject')}
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-md"
                      style={{ backgroundColor: '#F1F5F9', color: '#DC2626', border: '1px solid #E2E8F0' }}
                    >
                      Reject
                    </button>
                  </>
                )}
                <button 
                  onClick={() => navigate(`/mentor/${selectedReview.type.toLowerCase()}s`)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-md"
                  style={{ backgroundColor: '#0F172A', color: '#FFFFFF' }}
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
