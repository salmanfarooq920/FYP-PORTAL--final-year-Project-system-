import { useState, useEffect } from 'react';
import { DUMMY_GROUP } from '../../utils/constants';
import * as projectsApi from '../../api/projects';

// Extended dummy data for team display
const DUMMY_TEAM_DATA = {
  ...DUMMY_GROUP,
  name: 'Team Alpha',
  members: [
    { id: 'm1', name: 'You', email: 'student@fyp.com', rollNumber: '71461', role: 'Team Lead', tasksCompleted: 12, contributionPct: 35, status: 'active' },
    { id: 'm2', name: 'Ali Khan', email: 'ali@fyp.com', rollNumber: '71462', role: 'Developer', tasksCompleted: 10, contributionPct: 30, status: 'active' },
    { id: 'm3', name: 'Sara Ahmed', email: 'sara@fyp.com', rollNumber: '71463', role: 'Researcher', tasksCompleted: 8, contributionPct: 20, status: 'active' },
    { id: 'm4', name: 'Fatima Noor', email: 'fatima@fyp.com', rollNumber: '71464', role: 'Designer', tasksCompleted: 5, contributionPct: 15, status: 'active' },
  ],
  supervisor: { 
    name: 'Dr. Ahmed Khan', 
    email: 'ahmed.khan@uni.edu', 
    department: 'Computer Science',
    expertise: 'Artificial Intelligence, Machine Learning',
    office: 'Room 302, CS Building',
    officeHours: 'Mon, Wed: 2:00 PM - 4:00 PM'
  },
  stats: {
    totalTasks: 35,
    completedTasks: 28,
    pendingTasks: 7,
    overallProgress: 80
  }
};

export default function StudentTeam() {
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Member');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await projectsApi.getMyGroup();
        setGroup(res?.data ?? DUMMY_TEAM_DATA);
      } catch (err) {
        setGroup(DUMMY_TEAM_DATA);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleInvite = (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    
    // Show success message
    setToast({ message: `Invitation sent to ${inviteEmail}` });
    setTimeout(() => setToast(null), 3000);
    
    // Reset form and close modal
    setInviteEmail('');
    setInviteRole('Member');
    setShowInviteModal(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
    </div>
  );

  const teamName = group?.name || 'Team';
  const members = group?.members ?? [];
  const supervisor = group?.supervisor;
  const stats = group?.stats || DUMMY_TEAM_DATA.stats;

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'team lead': return 'bg-[#1F2E5A]/10 text-[#1F2E5A] border-[#1F2E5A]/20';
      case 'developer': return 'bg-[#F4B400]/10 text-[#D99C00] border-[#F4B400]/20';
      case 'researcher': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'designer': return 'bg-[#1F2E5A]/5 text-[#475569] border-slate-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      {/* Hero Header with Team Info */}
      <div className="bg-gradient-to-r from-[#1F2E5A] to-[#2E3A6B] text-white">
        <div className="px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">{teamName}</h1>
                <p className="text-white/70 mt-1">FYP Team • {members.length} Members • {stats.overallProgress}% Complete</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button 
              type="button" 
              onClick={() => alert('Requests functionality coming soon!')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium backdrop-blur-sm border border-white/20 transition-colors cursor-pointer"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                Requests
              </button>
              <button 
              type="button" 
              onClick={() => setShowInviteModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F4B400] text-white text-sm font-medium hover:bg-[#E6A700] transition-colors shadow-lg"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                Add Member
              </button>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="px-6 pb-6">
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalTasks}</p>
                <p className="text-xs text-white/60">Total Tasks</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.completedTasks}</p>
                <p className="text-xs text-white/60">Completed</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pendingTasks}</p>
                <p className="text-xs text-white/60">Pending</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 -mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Team Members Grid */}
          <div className="lg:col-span-2">
            <div className="bg-[#FFFFFF] rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#1F2E5A]">Team Members</h2>
                <span className="text-sm text-[#1F2E5A]/60">{members.length} members</span>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {members.map((member, index) => (
                    <div key={member.id} className="group relative p-5 rounded-xl bg-slate-50 border border-slate-100 hover:border-[#F4B400]/30 hover:shadow-md transition-all">
                      {index === 0 && (
                        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center shadow-lg">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                      <div className="flex items-start gap-4">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 ${
                          index === 0 ? 'bg-gradient-to-br from-[#F4B400] to-[#E6A700]' : 'bg-gradient-to-br from-[#1F2E5A] to-[#2E3A6B]'
                        }`}>
                          {getInitials(member.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[#1F2E5A] text-lg">{member.name}</p>
                          <p className="text-sm text-[#1F2E5A]/70">{member.rollNumber}</p>
                          <p className="text-sm text-[#1F2E5A]/50 truncate">{member.email}</p>
                          
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${getRoleColor(member.role)}`}>
                              {member.role}
                            </span>
                          </div>

                          <div className="mt-4 space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-[#1F2E5A]/60">Tasks</span>
                              <span className="font-medium text-[#1F2E5A]">{member.tasksCompleted}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-[#1F2E5A]/60">Contribution</span>
                              <span className="font-medium text-[#1F2E5A]">{member.contributionPct}%</span>
                            </div>
                            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-[#F4B400] to-[#E6A700] rounded-full transition-all duration-500" 
                                style={{ width: `${member.contributionPct}%` }} 
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Supervisor Card */}
            {supervisor && (
              <div className="bg-[#FFFFFF] rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="h-24 bg-gradient-to-r from-[#1F2E5A] to-[#2E3A6B]"></div>
                <div className="px-6 pb-6">
                  <div className="-mt-12 mb-4">
                    <div className="w-24 h-24 rounded-2xl bg-[#FFFFFF] p-1 shadow-lg">
                      <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#1F2E5A] to-[#2E3A6B] flex items-center justify-center text-white text-2xl font-bold">
                        {getInitials(supervisor.name)}
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-[#1F2E5A]">{supervisor.name}</h3>
                  <p className="text-[#F4B400] font-medium">{supervisor.department}</p>
                  
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                        <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-[#1F2E5A]/50 uppercase tracking-wide">Email</p>
                        <p className="text-sm font-medium text-[#1F2E5A] truncate">{supervisor.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                        <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-[#1F2E5A]/50 uppercase tracking-wide">Office</p>
                        <p className="text-sm font-medium text-[#1F2E5A]">{supervisor.office}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                        <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-[#1F2E5A]/50 uppercase tracking-wide">Office Hours</p>
                        <p className="text-sm font-medium text-[#1F2E5A]">{supervisor.officeHours}</p>
                      </div>
                    </div>
                  </div>

                  {supervisor.expertise && (
                    <div className="mt-6 pt-6 border-t border-slate-100">
                      <p className="text-xs text-[#1F2E5A]/50 uppercase tracking-wide mb-3">Expertise</p>
                      <div className="flex flex-wrap gap-2">
                        {supervisor.expertise.split(', ').map((skill, idx) => (
                          <span key={idx} className="px-3 py-1.5 rounded-lg bg-[#F4B400]/10 text-[#1F2E5A] text-xs font-medium border border-[#F4B400]/20">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Team Progress */}
            <div className="bg-[#FFFFFF] rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-semibold text-[#1F2E5A] mb-4">Team Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#1F2E5A]/70">Overall Completion</span>
                    <span className="text-sm font-semibold text-[#1F2E5A]">{stats.overallProgress}%</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#F4B400] to-[#E6A700] rounded-full" style={{ width: `${stats.overallProgress}%` }}></div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <div className="text-center p-3 rounded-xl bg-slate-50">
                    <p className="text-lg font-bold text-[#1F2E5A]">{stats.completedTasks}</p>
                    <p className="text-xs text-slate-500">Done</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-[#F4B400]/10">
                    <p className="text-lg font-bold text-[#F4B400]">{stats.pendingTasks}</p>
                    <p className="text-xs text-[#D99C00]">Pending</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-slate-50">
                    <p className="text-lg font-bold text-[#1F2E5A]">{stats.totalTasks}</p>
                    <p className="text-xs text-slate-500">Total</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-[#1F2E5A] to-[#2E3A6B] rounded-2xl p-6 text-white">
              <h3 className="font-semibold mb-1 text-white">Quick Actions</h3>
              <p className="text-sm text-white/60 mb-4">Manage your team</p>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-left text-sm">
                  <svg className="w-5 h-5 text-[#F4B400]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Invite Member
                </button>
                <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-left text-sm">
                  <svg className="w-5 h-5 text-[#F4B400]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Message Team
                </button>
                <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-left text-sm">
                  <svg className="w-5 h-5 text-[#F4B400]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  View Reports
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-24 right-6 z-50 px-5 py-3 bg-[#1F2E5A] text-white rounded-xl shadow-xl text-sm font-medium animate-slide-down">
          {toast.message}
        </div>
      )}

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowInviteModal(false)}>
          <div className="bg-[#FFFFFF] rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1F2E5A] to-[#2E3A6B] flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#1F2E5A]">Invite Team Member</h2>
                <p className="text-sm text-[#1F2E5A]/60">Add a new member to your team</p>
              </div>
            </div>
            
            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1F2E5A] mb-1.5">Email Address</label>
                <input 
                  type="email" 
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="student@university.edu"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#F4B400] focus:ring-2 focus:ring-[#F4B400]/20 transition"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#1F2E5A] mb-1.5">Role</label>
                <select 
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#F4B400] focus:ring-2 focus:ring-[#F4B400]/20 transition"
                >
                  <option value="Member">Member</option>
                  <option value="Developer">Developer</option>
                  <option value="Researcher">Researcher</option>
                  <option value="Designer">Designer</option>
                </select>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-sm text-[#1F2E5A]/70">
                  <span className="font-medium text-[#1F2E5A]">Note:</span> An invitation email will be sent to the provided address. They will need to accept to join the team.
                </p>
              </div>
              
              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#F4B400] text-white font-medium hover:bg-[#E6A700] transition-colors shadow-lg"
                >
                  Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
