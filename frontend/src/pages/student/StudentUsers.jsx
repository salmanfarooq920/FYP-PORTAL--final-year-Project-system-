import { useState, useEffect } from 'react';
import { DUMMY_USERS, DUMMY_SUPERVISOR_REQUESTS } from '../../utils/constants';
import * as usersApi from '../../api/users';

const facultyUsers = DUMMY_USERS.filter((u) => u.role === 'Mentor');
const studentUsers = DUMMY_USERS.filter((u) => u.role === 'Student');
const industryUsers = DUMMY_USERS.filter((u) => u.role === 'Mentor').slice(0, 3);

const TABS = [
  { key: 'faculty', label: 'Supervisors', count: facultyUsers.length, icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { key: 'students', label: 'Students', count: studentUsers.length, icon: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z' },
  { key: 'industry', label: 'Industry', count: industryUsers.length, icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
];

const DEPARTMENTS = ['All Departments', 'Computer Science', 'Software Engineering', 'Information Technology', 'Electrical Engineering'];

const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

export default function StudentUsers() {
  const [tab, setTab] = useState('faculty');
  const [users, setUsers] = useState(facultyUsers);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All Departments');
  const [successMessage, setSuccessMessage] = useState(null);
  const [requestStatus] = useState(DUMMY_SUPERVISOR_REQUESTS);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [requestType, setRequestType] = useState('supervisor');

  useEffect(() => {
    usersApi.list().then((r) => {
      if (Array.isArray(r?.data) && r.data.length > 0) setUsers(r.data);
    }).catch(() => {});
  }, []);

  const tabData = TABS.find((t) => t.key === tab)?.data ?? [];
  const displayList = Array.isArray(tabData) ? tabData : [];
  const filtered = displayList
    .filter(
      (u) =>
        !search ||
        (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
        (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
        (u.expertise || '').toLowerCase().includes(search.toLowerCase())
    )
    .filter((u) => departmentFilter === 'All Departments' || (u.department || '') === departmentFilter);

  const showSuccess = () => {
    setSuccessMessage(`Request sent to ${selectedUser?.name}`);
    setShowRequestModal(false);
    setSelectedUser(null);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const openRequestModal = (user, type) => {
    setSelectedUser(user);
    setRequestType(type);
    setShowRequestModal(true);
  };

  const handleSendRequest = () => {
    showSuccess();
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F9FC' }}>
      {/* Header */}
      <div className="px-8 py-6" style={{ backgroundColor: '#1F2E5A', boxShadow: '0 4px 20px rgba(31, 46, 90, 0.3)' }}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#F4B400' }}>
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Find Supervisors</h1>
              <p className="text-sm text-white/70">Browse by department and expertise</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {(tab === 'faculty' || tab === 'industry') && (
              <select 
                value={departmentFilter} 
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-4 py-3 rounded-lg text-sm bg-white/10 text-white border border-white/20 focus:ring-2 focus:ring-[#F4B400]/50"
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d} className="text-slate-900">{d}</option>
                ))}
              </select>
            )}
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="Search by name, expertise..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)}
                className="pl-11 pr-4 py-3 rounded-lg text-sm bg-white/10 text-white placeholder-white/50 border border-white/20 focus:ring-2 focus:ring-[#F4B400]/50 w-64"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Success Toast */}
        {successMessage && (
          <div className="fixed top-24 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-lg shadow-xl" style={{ backgroundColor: '#10B981' }}>
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium text-white">{successMessage}</span>
            <button type="button" onClick={() => setSuccessMessage(null)} className="ml-2 p-1 hover:bg-white/20 rounded">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Request Status Cards */}
        {requestStatus.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4" style={{ color: '#1F2E5A' }}>My Requests</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {requestStatus.map((sr) => (
                <div key={sr.id} className="rounded-lg p-4 flex items-center gap-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8ECF4', boxShadow: '0 2px 8px rgba(31, 46, 90, 0.06)' }}>
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: sr.status === 'approved' ? '#10B981' : sr.status === 'pending' ? '#F4B400' : '#6B7280' }}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sr.status === 'approved' ? 'M5 13l4 4L19 7' : sr.status === 'pending' ? 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' : 'M6 18L18 6M6 6l12 12'} />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium" style={{ color: '#1F2E5A' }}>{sr.supervisorName}</p>
                    <p className="text-sm" style={{ color: '#6B7280' }}>{sr.department}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ 
                    backgroundColor: sr.status === 'approved' ? '#D1FAE5' : sr.status === 'pending' ? '#FEF3C7' : '#F3F4F6',
                    color: sr.status === 'approved' ? '#059669' : sr.status === 'pending' ? '#D97706' : '#6B7280'
                  }}>
                    {sr.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-3 mb-6">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className="flex items-center gap-3 px-5 py-4 rounded-lg transition"
              style={{
                backgroundColor: tab === t.key ? '#1F2E5A' : '#FFFFFF',
                color: tab === t.key ? '#FFFFFF' : '#1F2E5A',
                border: '1px solid #E8ECF4',
                boxShadow: tab === t.key ? '0 4px 12px rgba(31, 46, 90, 0.25)' : '0 2px 8px rgba(31, 46, 90, 0.06)'
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={t.icon} />
              </svg>
              <div className="text-left">
                <p className="font-medium">{t.label}</p>
                <p className="text-xs opacity-70">{t.count} available</p>
              </div>
            </button>
          ))}
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((u) => (
            <div key={u.id} className="rounded-lg overflow-hidden" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8ECF4', boxShadow: '0 2px 8px rgba(31, 46, 90, 0.06)' }}>
              {/* Card Header */}
              <div className="p-5" style={{ backgroundColor: '#F8F9FC', borderBottom: '1px solid #E8ECF4' }}>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: '#1F2E5A', boxShadow: '0 4px 12px rgba(31, 46, 90, 0.25)' }}>
                    {getInitials(u.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate" style={{ color: '#1F2E5A' }}>{u.name}</h3>
                    <p className="text-sm truncate" style={{ color: '#6B7280' }}>{u.email}</p>
                    {u.department && (
                      <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded" style={{ backgroundColor: '#E8ECF4', color: '#1F2E5A' }}>
                        {u.department}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Card Body */}
              <div className="p-5">
                {u.expertise && (
                  <div className="mb-4">
                    <p className="text-xs font-medium mb-2" style={{ color: '#6B7280' }}>Expertise</p>
                    <div className="flex flex-wrap gap-2">
                      {u.expertise.split(', ').slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="text-xs px-2 py-1 rounded" style={{ backgroundColor: '#F8F9FC', color: '#1F2E5A' }}>
                          {skill}
                        </span>
                      ))}
                      {u.expertise.split(', ').length > 3 && (
                        <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: '#F4B400', color: '#FFFFFF' }}>
                          +{u.expertise.split(', ').length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Actions */}
                {tab !== 'students' && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => openRequestModal(u, 'supervisor')}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition hover:brightness-110"
                      style={{ backgroundColor: '#1F2E5A', color: '#FFFFFF', boxShadow: '0 4px 12px rgba(31, 46, 90, 0.25)' }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                      Supervisor
                    </button>
                    <button
                      type="button"
                      onClick={() => openRequestModal(u, 'coadvisor')}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition hover:brightness-110"
                      style={{ backgroundColor: '#F4B400', color: '#1F2E5A', boxShadow: '0 4px 12px rgba(244, 180, 0, 0.4)' }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      Co-Advisor
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#F8F9FC' }}>
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#1F2E5A' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: '#1F2E5A' }}>No users found</h3>
            <p style={{ color: '#6B7280' }}>Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Request Modal */}
      {showRequestModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(31, 46, 90, 0.5)' }}>
          <div className="rounded-lg shadow-2xl max-w-md w-full overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="px-6 py-5" style={{ backgroundColor: '#1F2E5A' }}>
              <h2 className="text-lg font-semibold text-white">Send Request</h2>
              <p className="text-sm text-white/70">Request {selectedUser.name} as your {requestType}</p>
            </div>
            
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6 p-4 rounded-lg" style={{ backgroundColor: '#F8F9FC' }}>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold" style={{ backgroundColor: '#F4B400' }}>
                  {getInitials(selectedUser.name)}
                </div>
                <div>
                  <p className="font-medium" style={{ color: '#1F2E5A' }}>{selectedUser.name}</p>
                  <p className="text-sm" style={{ color: '#6B7280' }}>{selectedUser.department}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2" style={{ color: '#1F2E5A' }}>Message (Optional)</label>
                <textarea 
                  className="w-full px-4 py-3 rounded-lg text-sm border focus:ring-2 focus:ring-[#F4B400]/50 resize-none"
                  style={{ borderColor: '#E8ECF4' }}
                  rows={3}
                  placeholder="Add a message to your request..."
                />
              </div>
              
              <div className="flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition"
                  style={{ backgroundColor: '#F8F9FC', color: '#1F2E5A', border: '1px solid #E8ECF4' }}
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={handleSendRequest}
                  className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition hover:brightness-110"
                  style={{ backgroundColor: '#F4B400', color: '#1F2E5A', boxShadow: '0 4px 12px rgba(244, 180, 0, 0.4)' }}
                >
                  Send Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
