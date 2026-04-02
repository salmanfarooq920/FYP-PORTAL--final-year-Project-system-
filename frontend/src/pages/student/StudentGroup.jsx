import { useState, useEffect } from 'react';
import * as projectsApi from '../../api/projects';
import { DUMMY_GROUP, DUMMY_GROUP_INVITES, DUMMY_SUPERVISOR_REQUESTS } from '../../utils/constants';

// Extended dummy data for multiple groups
const DUMMY_GROUPS = [
  {
    id: 'g1',
    name: 'Team Alpha',
    members: [
      { id: 'm1', name: 'You', email: 'student@fyp.com', rollNumber: '71461' },
      { id: 'm2', name: 'Ali Khan', email: 'ali@fyp.com', rollNumber: '71462' },
      { id: 'm3', name: 'Sara Ahmed', email: 'sara@fyp.com', rollNumber: '71463' },
    ],
    supervisor: { name: 'Dr. Ahmed Khan', email: 'ahmed.khan@uni.edu', department: 'Computer Science' },
    project: { title: 'AI-Based Healthcare System', status: 'In Progress' },
    approvalStatus: 'approved',
    createdAt: '2024-01-15',
  },
  {
    id: 'g2',
    name: 'Beta Squad',
    members: [
      { id: 'm4', name: 'You', email: 'student@fyp.com', rollNumber: '71461' },
      { id: 'm5', name: 'Fatima Noor', email: 'fatima@fyp.com', rollNumber: '71464' },
    ],
    supervisor: null,
    project: null,
    approvalStatus: 'pending',
    createdAt: '2024-02-01',
  },
];

const DUMMY_ALL_GROUPS = [
  ...DUMMY_GROUPS,
  {
    id: 'g3',
    name: 'Code Warriors',
    members: [
      { id: 'm6', name: 'Hassan Raza', email: 'hassan@fyp.com', rollNumber: '71465' },
      { id: 'm7', name: 'Ayesha Malik', email: 'ayesha@fyp.com', rollNumber: '71466' },
      { id: 'm8', name: 'Bilal Khan', email: 'bilal@fyp.com', rollNumber: '71467' },
    ],
    supervisor: { name: 'Dr. Fatima Noor', email: 'fatima.noor@uni.edu', department: 'Software Engineering' },
    project: { title: 'Blockchain Voting System', status: 'Proposal Submitted' },
    approvalStatus: 'approved',
    createdAt: '2024-01-20',
  },
  {
    id: 'g4',
    name: 'Tech Titans',
    members: [
      { id: 'm9', name: 'Usman Ali', email: 'usman@fyp.com', rollNumber: '71468' },
      { id: 'm10', name: 'Mariam Shah', email: 'mariam@fyp.com', rollNumber: '71469' },
      { id: 'm11', name: 'Zainab Bibi', email: 'zainab@fyp.com', rollNumber: '71470' },
      { id: 'm12', name: 'Omar Farooq', email: 'omar@fyp.com', rollNumber: '71471' },
    ],
    supervisor: { name: 'Dr. Asad Jamil', email: 'asad.jamil@uni.edu', department: 'Data Science' },
    project: { title: 'Smart Traffic Management', status: 'In Progress' },
    approvalStatus: 'approved',
    createdAt: '2024-01-10',
  },
];

export default function StudentGroup() {
  const [myGroups, setMyGroups] = useState(DUMMY_GROUPS);
  const [allGroups, setAllGroups] = useState(DUMMY_ALL_GROUPS);
  const [activeGroup, setActiveGroup] = useState(DUMMY_GROUPS[0]);
  const [loading, setLoading] = useState(true);
  const [invitations, setInvitations] = useState(DUMMY_GROUP_INVITES);
  const [supervisorRequests, setSupervisorRequests] = useState(DUMMY_SUPERVISOR_REQUESTS);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showRequestSupervisorModal, setShowRequestSupervisorModal] = useState(false);
  const [showAllGroups, setShowAllGroups] = useState(false);
  const [createName, setCreateName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    // Only load from API on initial mount if no groups exist
    if (myGroups.length === 0) {
      projectsApi.getMyGroup()
        .then((r) => {
          if (r?.data) {
            setActiveGroup(r.data);
            setMyGroups([r.data]);
          }
        })
        .catch(() => {
          // Keep dummy data
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const acceptInvite = (id) => {
    setInvitations((prev) => prev.filter((i) => i.id !== id));
    setToast({ message: 'Invitation accepted. You have joined the group.' });
    setTimeout(() => setToast(null), 3000);
  };

  const rejectInvite = (id) => {
    setInvitations((prev) => prev.filter((i) => i.id !== id));
    setToast({ message: 'Invitation declined.' });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreateGroup = (e) => {
    e.preventDefault();
    if (!createName.trim()) return;
    
    const newGroup = {
      id: 'g' + Date.now(),
      name: createName.trim(),
      members: [{ id: 'me', name: 'You', email: 'student@fyp.com', rollNumber: '71461' }],
      supervisor: null,
      project: null,
      approvalStatus: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };
    
    // Update myGroups with new group
    const updatedMyGroups = [...myGroups, newGroup];
    setMyGroups(updatedMyGroups);
    
    // Update allGroups with new group
    const updatedAllGroups = [...allGroups, newGroup];
    setAllGroups(updatedAllGroups);
    
    // Set the new group as active
    setActiveGroup(newGroup);
    
    // Reset form and close modal
    setCreateName('');
    setShowCreateModal(false);
    
    // Show success message
    setToast({ message: 'Group created successfully.' });
    setTimeout(() => setToast(null), 3000);
  };

  const handleInvite = (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setShowInviteModal(false);
    setInviteEmail('');
    setToast({ message: 'Invitation sent to ' + inviteEmail });
    setTimeout(() => setToast(null), 3000);
  };

  const handleRequestSupervisor = (e) => {
    e.preventDefault();
    setShowRequestSupervisorModal(false);
    setToast({ message: 'Supervisor request submitted.' });
    setTimeout(() => setToast(null), 3000);
  };

  const switchGroup = (group) => {
    setActiveGroup(group);
    setToast({ message: `Switched to ${group.name}` });
    setTimeout(() => setToast(null), 2000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-50 text-green-700 border-green-200';
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'rejected': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-24 right-6 z-50 px-5 py-3 bg-[#0F172A] text-white rounded-lg shadow-xl text-sm font-medium animate-slide-down">
          {toast.message}
        </div>
      )}

      {/* Professional Header */}
      <div className="bg-white border-b border-[#E2E8F0]">
        <div className="px-6 py-5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#F4B400] flex items-center justify-center">
                <svg className="w-6 h-6 text-[#1F2E5A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Groups</h1>
                <p className="text-sm text-[#64748B]">Manage your FYP teams and collaborations</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                type="button"
                onClick={() => setShowAllGroups(!showAllGroups)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${showAllGroups ? 'bg-[#334155] text-white' : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'}`}
              >
                All Groups ({allGroups.length})
              </button>
              <button 
                type="button"
                onClick={() => setShowAllGroups(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${!showAllGroups ? 'bg-[#334155] text-white' : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'}`}
              >
                My Groups ({myGroups.length})
              </button>
              <button 
                type="button" 
                onClick={() => setShowCreateModal(true)} 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0F172A] text-white text-sm font-medium hover:bg-[#1E293B] transition-colors shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                New Group
              </button>
            </div>
          </div>
        </div>

        {/* Group Selector Tabs */}
        {!showAllGroups && myGroups.length > 0 && (
          <div className="px-6 border-t border-[#E2E8F0]">
            <div className="flex gap-1 py-3 overflow-x-auto">
              {myGroups.map((g) => (
                <button
                  key={g.id}
                  onClick={() => switchGroup(g)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    activeGroup?.id === g.id 
                      ? 'bg-[#F1F5F9] text-[#334155] border border-[#CBD5E1]' 
                      : 'text-[#64748B] hover:bg-[#F8FAFC]'
                  }`}
                >
                  {g.name}
                  {g.approvalStatus === 'pending' && (
                    <span className="ml-2 inline-flex w-2 h-2 rounded-full bg-amber-500"></span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-6">
        {/* Invitations Alert */}
        {invitations.length > 0 && (
          <div className="mb-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#334155] flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="font-semibold text-[#0F172A]">Pending Invitations</h2>
                <p className="text-sm text-[#64748B]">You have {invitations.length} group invitation{invitations.length > 1 ? 's' : ''}</p>
              </div>
            </div>
            <div className="space-y-3">
              {invitations.map((inv) => (
                <div key={inv.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-lg border border-[#E2E8F0]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#F1F5F9] flex items-center justify-center text-[#475569] font-semibold">
                      {getInitials(inv.fromUser)}
                    </div>
                    <div>
                      <p className="font-medium text-[#0F172A]">{inv.fromGroup}</p>
                      <p className="text-sm text-[#64748B]">Invited by {inv.fromUser}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => acceptInvite(inv.id)} className="px-4 py-2 rounded-lg bg-[#0F172A] text-white text-sm font-medium hover:bg-[#1E293B] transition-colors">Accept</button>
                    <button type="button" onClick={() => rejectInvite(inv.id)} className="px-4 py-2 rounded-lg bg-[#F1F5F9] text-[#64748B] text-sm font-medium hover:bg-[#E2E8F0] transition-colors">Decline</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Groups View */}
        {showAllGroups ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#0F172A]">All FYP Groups</h2>
              <p className="text-sm text-[#64748B]">{allGroups.length} total groups</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {allGroups.map((g) => (
                <div key={g.id} className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#F1F5F9] flex items-center justify-center text-[#475569] font-bold text-lg">
                      {getInitials(g.name)}
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(g.approvalStatus)}`}>
                      {g.approvalStatus}
                    </span>
                  </div>
                  <h3 className="font-semibold text-[#0F172A] mb-1">{g.name}</h3>
                  <p className="text-sm text-[#64748B] mb-3">{g.members.length} members</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                      <svg className="w-4 h-4 text-[#94A3B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="truncate">{g.supervisor ? g.supervisor.name : 'No supervisor'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <svg className="w-4 h-4 text-[#94A3B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="truncate">{g.project ? g.project.title : 'No project'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : activeGroup ? (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="xl:col-span-2 space-y-6">
              {/* Group Info Card */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm">
                <div className="p-6 border-b border-[#E2E8F0]">
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl font-bold text-[#0F172A]">{activeGroup.name}</h2>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(activeGroup.approvalStatus)}`}>
                          {activeGroup.approvalStatus}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-[#64748B]">
                        <span>ID: {activeGroup.id}</span>
                        <span>•</span>
                        <span>Created {activeGroup.createdAt}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        type="button" 
                        onClick={() => setShowInviteModal(true)} 
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0F172A] text-white text-sm font-medium hover:bg-[#1E293B] transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                        Invite
                      </button>
                      {!activeGroup.supervisor && (
                        <button 
                          type="button" 
                          onClick={() => setShowRequestSupervisorModal(true)} 
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#334155] text-white text-sm font-medium hover:bg-[#1E293B] transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                          Supervisor
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Members Section */}
                <div className="p-6">
                  <h3 className="text-sm font-semibold text-[#0F172A] uppercase tracking-wide mb-4">
                    Members ({activeGroup.members.length})
                  </h3>
                  <div className="space-y-3">
                    {activeGroup.members.map((m, i) => (
                      <div key={m.id} className="flex items-center gap-4 p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold ${i === 0 ? 'bg-[#334155]' : 'bg-[#94A3B8]'}`}>
                          {getInitials(m.name)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-[#0F172A]">{m.name}</p>
                            {i === 0 && (
                              <span className="px-2 py-0.5 rounded text-xs font-medium bg-[#F1F5F9] text-[#475569]">Lead</span>
                            )}
                          </div>
                          <p className="text-sm text-[#64748B]">{m.rollNumber}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Supervisor & Project */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-5">
                  <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">Supervisor</h3>
                  {activeGroup.supervisor ? (
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-[#F0FDF4] flex items-center justify-center text-[#16A34A] font-semibold text-lg">
                        {getInitials(activeGroup.supervisor.name)}
                      </div>
                      <div>
                        <p className="font-medium text-[#0F172A]">{activeGroup.supervisor.name}</p>
                        <p className="text-sm text-[#64748B]">{activeGroup.supervisor.department}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-[#64748B] mb-3">No supervisor assigned</p>
                      <button 
                        type="button" 
                        onClick={() => setShowRequestSupervisorModal(true)}
                        className="px-4 py-2 rounded-lg bg-[#0F172A] text-white text-sm font-medium hover:bg-[#1E293B] transition-colors"
                      >
                        Request Supervisor
                      </button>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-5">
                  <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">Project</h3>
                  {activeGroup.project ? (
                    <div>
                      <p className="font-medium text-[#0F172A] mb-2">{activeGroup.project.title}</p>
                      <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-[#F1F5F9] text-[#475569]">
                        {activeGroup.project.status}
                      </span>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-[#64748B] mb-3">No project assigned</p>
                      <button className="px-4 py-2 rounded-lg bg-[#E2E8F0] text-[#334155] text-sm font-medium hover:bg-[#CBD5E1] transition-colors">
                        Submit Proposal
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* My Groups List */}
              <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-5">
                <h3 className="font-semibold text-[#0F172A] mb-4">My Groups</h3>
                <div className="space-y-2">
                  {myGroups.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => switchGroup(g)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                        activeGroup?.id === g.id ? 'bg-[#F8FAFC] border border-[#E2E8F0]' : 'hover:bg-[#F8FAFC] border border-transparent'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-semibold ${activeGroup?.id === g.id ? 'bg-[#334155]' : 'bg-[#94A3B8]'}`}>
                        {getInitials(g.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium text-sm truncate ${activeGroup?.id === g.id ? 'text-[#0F172A]' : 'text-[#0F172A]'}`}>{g.name}</p>
                        <p className="text-xs text-slate-500">{g.members.length} members</p>
                      </div>
                      {g.approvalStatus === 'pending' && (
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Request Status */}
              {supervisorRequests.length > 0 && (
                <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-5">
                  <h3 className="font-semibold text-[#0F172A] mb-4">Pending Requests</h3>
                  <div className="space-y-3">
                    {supervisorRequests.map((sr) => (
                      <div key={sr.id} className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm text-[#0F172A]">{sr.supervisorName}</p>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(sr.status)}`}>
                            {sr.status}
                          </span>
                        </div>
                        <p className="text-xs text-[#64748B] mt-1">{sr.department}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-xl p-5 text-white">
                <h3 className="font-semibold mb-4">Group Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[#94A3B8] text-sm">Total Members</span>
                    <span className="font-semibold">{activeGroup.members.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#94A3B8] text-sm">Status</span>
                    <span className="text-sm capitalize">{activeGroup.approvalStatus}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#94A3B8] text-sm">Created</span>
                    <span className="text-sm">{activeGroup.createdAt}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-10 text-center">
              <div className="w-16 h-16 bg-[#F1F5F9] rounded-xl flex items-center justify-center mx-auto mb-5">
                <svg className="w-8 h-8 text-[#94A3B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-2">No Groups Yet</h3>
              <p className="text-[#64748B] mb-6">Create your first group or accept an invitation to start collaborating on your FYP.</p>
              <button 
                type="button" 
                onClick={() => setShowCreateModal(true)} 
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#0F172A] text-white font-medium hover:bg-[#1E293B] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Create Your First Group
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowCreateModal(false)}>
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-[#E2E8F0]" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-[#0F172A] mb-4">Create New Group</h2>
            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="label">Group Name</label>
                <input type="text" value={createName} onChange={(e) => setCreateName(e.target.value)} className="input-base" placeholder="e.g., Team Alpha" required />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 px-4 py-2.5 rounded-lg bg-[#E2E8F0] text-[#334155] font-medium hover:bg-[#CBD5E1] transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2.5 rounded-lg bg-[#0F172A] text-white font-medium hover:bg-[#1E293B] transition-colors shadow-sm">Create Group</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowInviteModal(false)}>
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-[#E2E8F0]" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-[#0F172A] mb-4">Invite Member</h2>
            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="label">Email or Roll Number</label>
                <input type="text" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} className="input-base" placeholder="student@uni.edu" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowInviteModal(false)} className="flex-1 px-4 py-2.5 rounded-lg bg-[#E2E8F0] text-[#334155] font-medium hover:bg-[#CBD5E1] transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2.5 rounded-lg bg-[#0F172A] text-white font-medium hover:bg-[#1E293B] transition-colors shadow-sm">Send Invite</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Request Supervisor Modal */}
      {showRequestSupervisorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowRequestSupervisorModal(false)}>
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-[#E2E8F0]" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-[#0F172A] mb-4">Request Supervisor</h2>
            <form onSubmit={handleRequestSupervisor} className="space-y-4">
              <div>
                <label className="label">Select Supervisor</label>
                <select className="input-base" defaultValue="">
                  <option value="">— Choose supervisor —</option>
                  <option value="1">Dr. Ahmed Khan (CS)</option>
                  <option value="2">Dr. Fatima Noor (SE)</option>
                  <option value="3">Dr. Asad Jamil (DS)</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowRequestSupervisorModal(false)} className="flex-1 px-4 py-2.5 rounded-lg bg-[#E2E8F0] text-[#334155] font-medium hover:bg-[#CBD5E1] transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2.5 rounded-lg bg-[#0F172A] text-white font-medium hover:bg-[#1E293B] transition-colors shadow-sm">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
