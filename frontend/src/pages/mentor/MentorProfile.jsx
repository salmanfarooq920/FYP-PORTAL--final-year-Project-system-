import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const THEME = {
  navy: '#1F2E5A',
  white: '#FFFFFF',
  gold: '#F4B400',
};

const INITIAL_GROUPS = [
  { id: 1, name: 'Team Alpha', project: 'Smart Campus Navigation App', students: 3, progress: 78, status: 'active', color: THEME.navy, members: ['ZR', 'AH', 'SA'] },
  { id: 2, name: 'Team Beta', project: 'AI-Powered Study Assistant', students: 2, progress: 45, status: 'review', color: THEME.gold, members: ['OK', 'MK'] },
  { id: 3, name: 'Team Gamma', project: 'Campus Event Management', students: 3, progress: 92, status: 'completed', color: '#16A34A', members: ['FA', 'RA', 'NA'] },
];

const ACTIVITY_STATS = [
  { label: 'Total Reviews', value: 156, icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', color: THEME.navy },
  { label: 'Avg Response', value: '4.2h', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: THEME.gold },
  { label: 'Satisfaction', value: '98%', icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: '#16A34A' },
];

const INITIAL_ACTIVITY = [
  { id: 1, action: 'Approved proposal', target: 'Team Alpha', time: '2 hours ago', type: 'success' },
  { id: 2, action: 'Reviewed milestone', target: 'Team Beta', time: '5 hours ago', type: 'info' },
  { id: 3, action: 'Sent feedback', target: 'Team Gamma', time: '1 day ago', type: 'message' },
  { id: 4, action: 'Scheduled meeting', target: 'Team Alpha', time: '2 days ago', type: 'calendar' },
];

const NOTIFICATIONS = [
  { id: 1, message: 'New milestone submission from Team Alpha', time: '10 min ago', unread: true },
  { id: 2, message: 'Team Beta requested a meeting', time: '1 hour ago', unread: true },
  { id: 3, message: 'Proposal review completed', time: '3 hours ago', unread: false },
];

export default function MentorProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [groups, setGroups] = useState(INITIAL_GROUPS);
  const [activities, setActivities] = useState(INITIAL_ACTIVITY);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [toast, setToast] = useState(null);
  
  const [profile, setProfile] = useState({
    name: user?.name ?? 'Dr. Sarah Smith',
    email: user?.email ?? 'sarah.smith@university.edu',
    department: user?.department ?? 'Computer Science',
    role: 'Senior Supervisor / Mentor',
    bio: 'Experienced supervisor with 10+ years in software engineering education. Specialized in AI, Machine Learning, and Web Development projects.',
    expertise: ['Artificial Intelligence', 'Machine Learning', 'Web Development', 'Data Science', 'Cloud Computing'],
    office: 'Room 302, CS Building',
    hours: 'Mon-Thu: 2:00 PM - 5:00 PM',
    phone: '+1 (555) 123-4567',
    joined: 'September 2018',
  });

  const [editForm, setEditForm] = useState({ ...profile });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleSaveProfile = () => {
    setProfile({ ...editForm, profileImage: imagePreview || profile.profileImage });
    setIsEditing(false);
    setProfileImage(null);
    showToast('Profile updated successfully!');
  };

  const handleCancelEdit = () => {
    setEditForm({ ...profile });
    setImagePreview(profile.profileImage || null);
    setProfileImage(null);
    setIsEditing(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    setImagePreview(null);
  };

  const handleSendMessage = (groupId) => {
    setShowMessageModal(false);
    showToast(`Message sent to ${groups.find(g => g.id === groupId)?.name}!`);
    const newActivity = {
      id: Date.now(),
      action: 'Sent message',
      target: groups.find(g => g.id === groupId)?.name,
      time: 'Just now',
      type: 'message'
    };
    setActivities([newActivity, ...activities.slice(0, 3)]);
  };

  const handleMarkNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const handleViewGroup = (groupId) => {
    navigate(`/mentor/groups?id=${groupId}`);
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="min-h-screen py-4" style={{ backgroundColor: THEME.white }}>
      {/* Header Banner - Professional Gradient */}
      <div className="relative h-32 overflow-hidden">
        <div className="absolute inset-0" style={{ 
          background: `linear-gradient(135deg, ${THEME.navy} 0%, ${THEME.navy} 100%)`
        }}></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] opacity-30" style={{ 
            background: `radial-gradient(circle, ${THEME.gold} 0%, transparent 60%)`,
            transform: 'translate(20%, -40%)',
            filter: 'blur(60px)'
          }}></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] opacity-25" style={{ 
            background: `radial-gradient(circle, ${THEME.white} 0%, transparent 60%)`,
            transform: 'translate(-30%, 30%)',
            filter: 'blur(60px)'
          }}></div>
          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `linear-gradient(${THEME.white} 1px, transparent 1px), linear-gradient(90deg, ${THEME.white} 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12" style={{ background: `linear-gradient(to top, ${THEME.white}, transparent)` }}></div>
        
        {/* Top Navigation Bar - Glassmorphism */}
        <div className="absolute top-0 left-0 right-0 px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center backdrop-blur-sm" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="text-white font-semibold">Supervisor Profile</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg backdrop-blur-sm transition-all duration-200 hover:bg-white/10"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span 
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
                    style={{ backgroundColor: THEME.gold, color: THEME.white }}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>
              <button 
                onClick={() => setIsEditing(true)}
                className="p-2 rounded-lg backdrop-blur-sm transition-all duration-200 hover:bg-white/10"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-8 relative z-10">
        {/* Profile Header Card - Glassmorphism Effect */}
        <div 
          className="rounded-lg p-4 mb-4 shadow"
          style={{ 
            backgroundColor: THEME.white,
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div className="flex flex-col md:flex-row gap-3">
            {/* Avatar Section - Enhanced with Image */}
            <div className="flex-shrink-0">
              <div className="relative group">
                <div 
                  className="w-32 h-32 rounded-2xl flex items-center justify-center text-4xl font-bold text-white shadow-lg transition-all duration-300 overflow-hidden hover-lift border-4 border-white"
                  style={{ 
                    background: profile.profileImage ? 'transparent' : `linear-gradient(135deg, ${THEME.navy} 0%, ${THEME.navy} 100%)`,
                    boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.3), 0 12px 16px -8px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  {profile.profileImage ? (
                    <img 
                      src={profile.profileImage} 
                      alt={profile.name}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    profile.name.split(' ').map(n => n[0]).join('')
                  )}
                </div>
                {/* Removed the checkmark icon at the bottom right of the image box */}
                {/* <div 
                  className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ 
                    background: '#10b981',
                    border: '2px solid #FFFFFF',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div> */}
                {/* Removed Decorative Ring */}
                {/* <div className="absolute -inset-1 rounded-full border-2 border-dashed opacity-20" style={{ borderColor: '#D99C00' }}></div> */}
              </div>
            </div>

            {/* Info Section - Enhanced */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                <div>
                  <div className="flex items-center gap-4 mb-3">
                    <h1 className="text-xl font-bold" style={{ color: THEME.navy }}>{profile.name}</h1>
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"
                      style={{ 
                        background: 'linear-gradient(135deg, #DCFCE7 0%, #BBF7D0 100%)',
                        color: '#16A34A',
                        border: '1px solid #86EFAC'
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                      Active
                    </span>
                  </div>
                  <p className="text-base font-medium mb-2 flex items-center gap-1.5" style={{ color: '#64748b' }}>
                    <span className="w-8 h-[2px]" style={{ backgroundColor: THEME.gold }}></span>
                    {profile.role}
                  </p>
                  <p className="text-sm max-w-xl leading-relaxed" style={{ color: '#475569' }}>{profile.bio}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 hover:shadow-sm flex items-center gap-2 btn-hover hover-scale"
                    style={{ 
                      backgroundColor: '#f1f5f9',
                      color: '#1e293b',
                      border: '1px solid #e2e8f0'
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit Profile
                  </button>
                  <button 
                    onClick={() => setShowMessageModal(true)}
                    className="px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 hover:shadow-sm flex items-center gap-2 btn-hover hover-scale"
                    style={{ 
                      backgroundColor: THEME.navy,
                      color: THEME.white,
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Message
                  </button>
                </div>
              </div>

              {/* Quick Info - Enhanced with Icons */}
              <div className="flex flex-wrap gap-3 mt-6 pt-4" style={{ borderTop: '1px solid #e2e8f0' }}>
                {[
                  { icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', label: profile.email, color: THEME.navy },
                  { icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', label: profile.department, color: THEME.gold },
                  { icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z', label: profile.office, color: '#DC2626' },
                  { icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', label: profile.hours, color: '#16A34A' },
                ].map((item, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center gap-2 px-2 py-1.5 rounded-md transition-all duration-200 hover:shadow-sm"
                    style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}
                  >
                    <div className="w-6 h-6 rounded-sm flex items-center justify-center" style={{ backgroundColor: `${item.color}15` }}>
                      <svg className="w-4 h-4" fill="none" stroke={item.color} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                      </svg>
                    </div>
                    <span className="text-xs" style={{ color: '#475569' }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {/* Left Column */}
          <div className="col-span-2 space-y-4">
            {/* Stats Cards - Enhanced */}
            <div className="grid grid-cols-3 gap-2">
              {ACTIVITY_STATS.map((stat, idx) => (
                <div 
                  key={idx} 
                  className="p-3 rounded-lg transition-all duration-200 hover:shadow-sm cursor-pointer group card-hover"
                  style={{ 
                    backgroundColor: '#FFFFFF', 
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <div 
                    className="w-8 h-8 rounded-md flex items-center justify-center mb-2 transition-all duration-200 icon-hover"
                    style={{ 
                      background: `linear-gradient(135deg, ${stat.color}10 0%, ${stat.color}20 100%)`,
                      border: `1px solid ${stat.color}20`
                    }}
                  >
                    <svg className="w-6 h-6" fill="none" stroke={stat.color} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                    </svg>
                  </div>
                  <p className="text-lg font-bold mb-0" style={{ color: '#1e293b' }}>{stat.value}</p>
                  <p className="text-xs font-medium" style={{ color: '#64748b' }}>{stat.label}</p>
                  <div className="mt-2 h-0.5 rounded-full overflow-hidden" style={{ backgroundColor: '#e2e8f0' }}>
                    <div 
                      className="h-full rounded-full transition-all duration-500 group-hover:w-full"
                      style={{ width: '60%', backgroundColor: stat.color }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Supervised Groups - Enhanced */}
            <div 
              className="rounded-lg overflow-hidden"
              style={{ 
                backgroundColor: '#FFFFFF', 
                border: '1px solid #e2e8f0', 
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
              }}
            >
              <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: '#e2e8f0' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#f1f5f9' }}>
                    <svg className="w-6 h-6" style={{ color: THEME.navy }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-base" style={{ color: THEME.navy }}>Supervised Groups</h3>
                    <p className="text-xs mt-0" style={{ color: '#64748b' }}>Groups you are mentoring this term</p>
                  </div>
                </div>
                <Link 
                  to="/mentor/groups"
                  className="px-2 py-1 rounded-md text-xs font-medium flex items-center gap-2 transition-all duration-200 hover:shadow-sm"
                  style={{ backgroundColor: '#f1f5f9', color: THEME.navy }}
                >
                  View all
                  <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: '#10b981' }}>
                    <span className="text-white text-xs font-bold">&gt;</span>
                  </div>
                </Link>
              </div>
              <div className="p-6 space-y-4">
                {groups.map((group, idx) => (
                  <div 
                    key={group.id} 
                    onClick={() => handleViewGroup(group.id)}
                    className="p-5 rounded-2xl transition-all duration-300 cursor-pointer group card-hover"
                    style={{ 
                      backgroundColor: '#F8FAFC',
                      border: '1px solid transparent',
                      boxShadow: '0 1px 3px rgba(31, 46, 90, 0.04)'
                    }}
                    onMouseEnter={(e) => { 
                      e.currentTarget.style.backgroundColor = '#FFFFFF'; 
                      e.currentTarget.style.borderColor = '#E2E8F0';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(31, 46, 90, 0.12)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => { 
                      e.currentTarget.style.backgroundColor = '#F8FAFC'; 
                      e.currentTarget.style.borderColor = 'transparent';
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(31, 46, 90, 0.04)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div className="flex items-center gap-5">
                      <div 
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-lg transition-transform duration-300 group-hover:scale-110 icon-hover"
                        style={{ 
                          background: `linear-gradient(135deg, ${group.color} 0%, ${group.color}DD 100%)`,
                          boxShadow: `0 8px 20px ${group.color}40`
                        }}
                      >
                        {group.name.charAt(5)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-bold text-lg hover-transform" style={{ color: THEME.navy }}>{group.name}</h4>
                          <span 
                            className="px-3 py-1 rounded-full text-xs font-bold"
                            style={{
                              backgroundColor: group.status === 'active' ? '#DCFCE7' : group.status === 'review' ? '#FEF3C7' : '#DBEAFE',
                              color: group.status === 'active' ? '#16A34A' : group.status === 'review' ? THEME.gold : THEME.navy
                            }}
                          >
                            {group.status.charAt(0).toUpperCase() + group.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm font-medium mb-3 hover-opacity" style={{ color: '#64748B' }}>{group.project}</p>
                        <div className="flex items-center gap-4">
                          <div className="flex -space-x-2">
                            {group.members.map((member, i) => (
                              <div 
                                key={i} 
                                className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white transition-all duration-200 group-hover:scale-110 icon-hover"
                                style={{ backgroundColor: group.color, transitionDelay: `${i * 50}ms` }}
                              >
                                {member}
                              </div>
                            ))}
                          </div>
                          <span className="text-xs font-medium hover-opacity" style={{ color: '#94A3B8' }}>{group.students} students</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold mb-2 hover-glow" style={{ color: group.color }}>{group.progress}%</p>
                        <div className="w-28 h-2 rounded-full overflow-hidden hover-glow" style={{ backgroundColor: '#E2E8F0' }}>
                          <div 
                            className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${group.progress}%`, backgroundColor: group.color }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Enhanced */}
          <div className="space-y-4">
            {/* Expertise - Enhanced */}
            <div 
              className="p-6 rounded-3xl"
              style={{ 
                backgroundColor: THEME.white, 
                border: '1px solid #E2E8F0', 
                boxShadow: '0 4px 20px rgba(31, 46, 90, 0.08)'
              }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(244, 180, 0, 0.18)' }}>
                  <svg className="w-5 h-5" style={{ color: THEME.gold }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-base" style={{ color: THEME.navy }}>Areas of Expertise</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.expertise.map((skill, idx) => (
                  <span 
                    key={idx}
                    className="px-2 py-1 rounded-md text-xs font-medium transition-all duration-200 hover:shadow-sm hover-scale"
                    style={{ 
                      backgroundColor: '#f8fafc',
                      color: '#475569',
                      border: '1px solid #e2e8f0'
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Recent Activity - Enhanced */}
            <div 
              className="p-6 rounded-3xl"
              style={{ 
                backgroundColor: THEME.white, 
                border: '1px solid #E2E8F0', 
                boxShadow: '0 4px 20px rgba(31, 46, 90, 0.08)'
              }}
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(31, 46, 90, 0.12)' }}>
                    <svg className="w-5 h-5" style={{ color: THEME.navy }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-lg" style={{ color: THEME.navy }}>Recent Activity</h3>
                </div>
                <button className="text-xs font-semibold" style={{ color: THEME.gold }}>View all</button>
              </div>
              <div className="space-y-4">
                {activities.map((activity, idx) => (
                  <div 
                    key={activity.id} 
                    className="flex items-start gap-2 p-2 rounded-md transition-all duration-200 hover-bg-shift"
                    style={{ 
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 1px 1px rgba(0, 0, 0, 0.05)'
                    }}
                  >
                    <div 
                      className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 icon-hover"
                      style={{ 
                        backgroundColor: activity.type === 'success' ? '#dcfce7' : activity.type === 'info' ? '#dbeafe' : activity.type === 'message' ? '#f3e8ff' : '#fef3c7'
                      }}
                    >
                      <svg 
                        className="w-3 h-3" 
                        fill="none" 
                        stroke={activity.type === 'success' ? '#16a34a' : activity.type === 'info' ? '#2563eb' : activity.type === 'message' ? '#7c3aed' : '#d99c00'} 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium hover-opacity" style={{ color: '#1e293b' }}>{activity.action}</p>
                      <p className="text-xs mt-0 hover-opacity" style={{ color: '#64748b' }}>{activity.target}</p>
                      <p className="text-xs mt-0.5 font-medium hover-opacity" style={{ color: '#94a3b8' }}>{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Account Info - Enhanced */}
            <div 
              className="p-6 rounded-3xl"
              style={{ 
                backgroundColor: THEME.white, 
                border: '1px solid #E2E8F0', 
                boxShadow: '0 4px 20px rgba(31, 46, 90, 0.08)'
              }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#DCFCE7' }}>
                  <svg className="w-5 h-5" style={{ color: '#16A34A' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg" style={{ color: THEME.navy }}>Account Info</h3>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Member since', value: profile.joined, icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
                  { label: 'Phone', value: profile.phone, icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' },
                  { label: 'Status', value: 'Active', isStatus: true, icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover-border-glow" style={{ backgroundColor: '#F8FAFC' }}>
                    <div className="flex items-center gap-3">
                      <svg className="w-4 h-4 icon-hover" style={{ color: '#94A3B8' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                      </svg>
                      <span className="text-sm hover-opacity" style={{ color: '#64748B' }}>{item.label}</span>
                    </div>
                    <span className={`text-sm font-semibold ${item.isStatus ? 'text-green-600' : ''} hover-opacity`} style={{ color: item.isStatus ? '#16A34A' : THEME.navy }}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
          <div 
            className="px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3"
            style={{ 
              backgroundColor: THEME.navy,
              color: THEME.white,
              borderLeft: `4px solid ${toast.type === 'success' ? THEME.gold : THEME.white}`,
              boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div 
          className="fixed top-20 right-6 z-50 w-80 rounded-2xl overflow-hidden"
          style={{ 
            backgroundColor: THEME.white,
            border: '1px solid #E2E8F0',
            boxShadow: '0 20px 60px rgba(31, 46, 90, 0.2)'
          }}
        >
          <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: '#E2E8F0' }}>
            <h4 className="font-bold" style={{ color: THEME.navy }}>Notifications</h4>
            <button 
              onClick={() => setShowNotifications(false)}
              className="p-1 rounded-lg hover:bg-slate-100"
            >
              <svg className="w-4 h-4" style={{ color: '#64748B' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <p className="text-sm" style={{ color: '#64748B' }}>No notifications</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif.id}
                  onClick={() => handleMarkNotificationRead(notif.id)}
                  className="px-5 py-4 border-b cursor-pointer transition-all duration-200 hover:bg-slate-50"
                  style={{ borderColor: '#F1F5F9', backgroundColor: notif.unread ? '#F8FAFC' : '#FFFFFF' }}
                >
                  <div className="flex items-start gap-2">
                    {notif.unread && <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ backgroundColor: THEME.gold }}></div>}
                    <div className="flex-1">
                      <p className="text-xs font-medium" style={{ color: THEME.navy }}>{notif.message}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>{notif.time}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Message Modal */}
      {showMessageModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(31, 46, 90, 0.6)' }}
          onClick={() => setShowMessageModal(false)}
        >
          <div 
            className="rounded-3xl max-w-md w-full p-6"
            style={{ backgroundColor: THEME.white, boxShadow: '0 25px 80px rgba(31, 46, 90, 0.3)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold" style={{ color: THEME.navy }}>Send Message</h3>
              <button 
                onClick={() => setShowMessageModal(false)}
                className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <svg className="w-5 h-5" style={{ color: '#64748B' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-sm mb-4" style={{ color: '#64748B' }}>Select a group to message:</p>
            <div className="space-y-3">
              {groups.map((group) => (
                <button
                  key={group.id}
                  onClick={() => handleSendMessage(group.id)}
                  className="w-full p-4 rounded-xl flex items-center gap-4 transition-all duration-200 hover:shadow-md"
                  style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = THEME.white; e.currentTarget.style.borderColor = THEME.gold; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F8FAFC'; e.currentTarget.style.borderColor = '#E2E8F0'; }}
                >
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: group.color }}
                  >
                    {group.name.charAt(5)}
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-semibold" style={{ color: THEME.navy }}>{group.name}</p>
                    <p className="text-xs" style={{ color: '#64748B' }}>{group.students} members</p>
                  </div>
                  <svg className="w-5 h-5" style={{ color: THEME.gold }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditing && (
        <div 
          className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto"
          style={{ backgroundColor: 'rgba(31, 46, 90, 0.6)' }}
          onClick={handleCancelEdit}
        >
          <div 
            className="rounded-xl max-w-lg w-full p-6 my-6"
            style={{ backgroundColor: THEME.white, boxShadow: '0 10px 50px rgba(0, 0, 0, 0.2)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold" style={{ color: '#1e293b' }}>Edit Profile</h3>
                <p className="text-sm mt-1" style={{ color: '#64748B' }}>Update your personal information</p>
              </div>
              <button 
                onClick={handleCancelEdit}
                className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <svg className="w-5 h-5" style={{ color: '#64748B' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Profile Image Upload */}
            <div className="flex items-center gap-4 mb-6 pb-6" style={{ borderBottom: '1px solid #e2e8f0' }}>
              <div className="relative">
                <div 
                  className="w-20 h-20 rounded-xl overflow-hidden flex items-center justify-center"
                  style={{ 
                    background: imagePreview || profile.profileImage ? 'transparent' : `linear-gradient(135deg, ${THEME.navy} 0%, ${THEME.navy} 100%)`,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  {imagePreview || profile.profileImage ? (
                    <img 
                      src={imagePreview || profile.profileImage} 
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-white">
                      {editForm.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  )}
                </div>
                {(imagePreview || profile.profileImage) && (
                  <button
                    onClick={handleRemoveImage}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200"
                    style={{ backgroundColor: '#dc2626', color: '#FFFFFF', boxShadow: '0 1px 4px rgba(220, 38, 38, 0.4)' }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold mb-2" style={{ color: '#334155' }}>Profile Photo</label>
                <p className="text-xs mb-3" style={{ color: '#64748b' }}>Upload a new photo or remove existing</p>
                <div className="flex gap-2">
                  <label 
                    className="px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer transition-all duration-200 hover:shadow-md flex items-center gap-2"
                    style={{ backgroundColor: THEME.navy, color: THEME.white }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Upload Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  {(imagePreview || profile.profileImage) && (
                    <button
                      onClick={handleRemoveImage}
                      className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                      style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#334155' }}>Full Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                  style={{ borderColor: '#E2E8F0', focusRing: THEME.gold }}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#334155' }}>Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-2 py-2 rounded-md border focus:outline-none focus:ring-1 transition-all"
                  style={{ borderColor: '#e2e8f0' }}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#334155' }}>Department</label>
                <input
                  type="text"
                  value={editForm.department}
                  onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                  className="w-full px-2 py-2 rounded-md border focus:outline-none focus:ring-1 transition-all"
                  style={{ borderColor: '#e2e8f0' }}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#334155' }}>Office</label>
                <input
                  type="text"
                  value={editForm.office}
                  onChange={(e) => setEditForm({ ...editForm, office: e.target.value })}
                  className="w-full px-2 py-2 rounded-md border focus:outline-none focus:ring-1 transition-all"
                  style={{ borderColor: '#e2e8f0' }}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#334155' }}>Hours</label>
                <input
                  type="text"
                  value={editForm.hours}
                  onChange={(e) => setEditForm({ ...editForm, hours: e.target.value })}
                  className="w-full px-2 py-2 rounded-md border focus:outline-none focus:ring-1 transition-all"
                  style={{ borderColor: '#e2e8f0' }}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#334155' }}>Phone</label>
                <input
                  type="text"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-2 py-2 rounded-md border focus:outline-none focus:ring-1 transition-all"
                  style={{ borderColor: '#e2e8f0' }}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#334155' }}>Bio</label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  rows={3}
                  className="w-full px-2 py-2 rounded-md border focus:outline-none focus:ring-1 transition-all resize-none"
                  style={{ borderColor: '#e2e8f0' }}
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={handleCancelEdit}
                className="flex-1 px-4 py-2.5 rounded-lg font-medium transition-all duration-200"
                style={{ backgroundColor: '#f1f5f9', color: '#475569' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="flex-1 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 hover:shadow-md"
                style={{ backgroundColor: THEME.navy, color: THEME.white }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        /* Professional Hover Effects */
        .group-hover\:scale-110:hover { transform: scale(1.1); }
        .group-hover\:glow:hover { 
          box-shadow: 0 0 20px rgba(37, 99, 235, 0.5);
          transition: box-shadow 0.3s ease;
        }
        
        .hover-lift {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .hover-lift:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        
        .hover-scale {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .hover-scale:hover {
          transform: scale(1.02);
        }
        
        .hover-glow {
          transition: all 0.3s ease;
        }
        .hover-glow:hover {
          box-shadow: 0 0 15px rgba(244, 180, 0, 0.3);
        }
        
        .hover-shadow {
          transition: all 0.3s ease;
        }
        .hover-shadow:hover {
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }
        
        .hover-border-glow {
          transition: all 0.3s ease;
        }
        .hover-border-glow:hover {
          border-color: ${THEME.gold};
          box-shadow: 0 0 0 3px rgba(244, 180, 0, 0.1);
        }
        
        .hover-gradient {
          transition: all 0.3s ease;
        }
        .hover-gradient:hover {
          background: linear-gradient(135deg, ${THEME.navy}, ${THEME.navy});
          color: white;
        }
        
        .hover-opacity {
          transition: opacity 0.3s ease;
        }
        .hover-opacity:hover {
          opacity: 0.8;
        }
        
        .hover-transform {
          transition: transform 0.3s ease;
        }
        .hover-transform:hover {
          transform: translateX(5px);
        }
        
        .hover-bg-shift {
          transition: background-color 0.3s ease;
        }
        .hover-bg-shift:hover {
          background-color: #F8FAFC;
        }
        
        /* Professional Button Effects */
        .btn-hover {
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .btn-hover::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }
        .btn-hover:hover::before {
          left: 100%;
        }
        
        /* Professional Card Effects */
        .card-hover {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .card-hover:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        
        /* Professional Icon Effects */
        .icon-hover {
          transition: all 0.3s ease;
        }
        .icon-hover:hover {
          transform: scale(1.1) rotate(5deg);
        }
      `}</style>
    </div>
  );
}
