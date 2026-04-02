export const ROLES = { Student: 'Student', Mentor: 'Mentor', Admin: 'Admin' };

export const DUMMY_USERS = [
  { id: '1', name: 'Admin User', email: 'admin@fyp.com', role: 'Admin', department: 'Computer Science', avatar: null },
  { id: '2', name: 'Man Alina Yaqoob', email: 'alina@fyp.com', role: 'Mentor', department: 'Computer Science', expertise: 'Project Management', avatar: null },
  { id: '3', name: 'Salman Farooq', email: 'student@fyp.com', role: 'Student', rollNumber: '71461', department: 'Computer Science', avatar: null },
  { id: '4', name: 'M Hassan', email: 'student2@fyp.com', role: 'Student', rollNumber: 'F22-1644', department: 'Computer Science', avatar: null },
  { id: '5', name: 'M Saleem', email: 'student3@fyp.com', role: 'Student', rollNumber: 'F22-1161', department: 'Computer Science', avatar: null },
  { id: '6', name: 'Dr. Fatima Noor', email: 'mentor2@fyp.com', role: 'Mentor', department: 'Software Engineering', expertise: 'Web, Security', avatar: null },
  { id: '11', name: 'Default Mentor', email: 'mentor@fyp.com', role: 'Mentor', department: 'Computer Science', expertise: 'General', avatar: null },
  { id: '7', name: 'Omar Khalid', email: 'student4@fyp.com', role: 'Student', rollNumber: '71464', department: 'Computer Science', avatar: null },
  { id: '8', name: 'Ayesha Malik', email: 'student5@fyp.com', role: 'Student', rollNumber: '71465', department: 'Software Engineering', avatar: null },
  { id: '9', name: 'Hassan Raza', email: 'student6@fyp.com', role: 'Student', rollNumber: '71466', department: 'Computer Science', avatar: null },
  { id: '10', name: 'Dr. Saima Ali', email: 'mentor3@fyp.com', role: 'Mentor', department: 'Computer Science', expertise: 'Databases, Cloud', avatar: null },
];

export const DUMMY_GROUP = {
  id: 'g1',
  name: 'Team Alpha',
  members: [
    { id: '3', name: 'Salman Farooq', email: 'student@fyp.com', rollNumber: 'F22-1693', role: 'Lead', tasksCompleted: 5, contributionPct: 40 },
    { id: '4', name: 'M Hassan', email: 'student2@fyp.com', rollNumber: 'F22-1644', role: 'Member', tasksCompleted: 3, contributionPct: 30 },
    { id: '5', name: 'M Saleem', email: 'student3@fyp.com', rollNumber: 'F22-1161', role: 'Member', tasksCompleted: 2, contributionPct: 30 },
  ],
  supervisor: { id: '1', name: 'Alina Yaqoob', email: 'alina@fyp.com', department: 'Computer Science', expertise: 'Project Management' },
  project: { title: 'FYP PORTAL', description: 'Final Year Project Management Portal', status: 'approved' },
};

export const DUMMY_TEAM_PROGRESS = { todo: 8, inProgress: 3, done: 1, total: 12 };
export const DUMMY_CURRENT_TERM = { year: '2026', activePhase: 'Proposal', semester: 'Spring' };
export const DUMMY_MILESTONE_PROGRESS = { totalMilestones: 7, submittedMilestones: 1 };
export const DUMMY_MILESTONE_DUE_DATES = [
  { id: 'm1', title: 'Proposal Submission', date: '2026-07-01', status: 'completed' },
  { id: 'm2', title: 'Literature Review', date: '2026-07-13', status: 'upcoming' },
  { id: 'm3', title: 'Design Document', date: '2026-07-18', status: 'upcoming' },
  { id: 'm4', title: 'Mid-term Demo', date: '2026-07-25', status: 'upcoming' },
];

export const DUMMY_PROPOSALS = [
  { id: 'p1', title: 'Smart Campus Navigation App', description: 'A mobile application that helps students navigate the campus using AR technology.', status: 'approved', createdAt: '2024-01-15', submittedBy: { name: 'Zara Rashid' } },
  { id: 'p2', title: 'AI-Powered Study Assistant', description: 'An intelligent chatbot that helps students with coursework.', status: 'pending', createdAt: '2024-01-20', submittedBy: { name: 'Ali Hassan' } },
  { id: 'p3', title: 'Campus Event Management System', description: 'A platform for organizing and attending campus events.', status: 'rejected', createdAt: '2024-01-18', submittedBy: { name: 'Sara Ahmed' } },
];

export const DUMMY_IDEAS = [
  { id: 'i1', title: 'Data Simulator', description: 'Tool to simulate datasets for ML pipelines.', ideaBy: 'Zara Rashid', group: 'Blinders', likes: 1, liked: true, source: 'student', status: 'approved', supervisorFeedback: 'Strong scope and clear deliverables.', uniquenessScore: 0.88, feasibilityScore: 0.82, requiredSkills: ['Python', 'ML'], aiSuggestions: 'Consider adding validation benchmarks.' },
  { id: 'i2', title: 'Form Automator', description: 'Automate form filling from templates.', ideaBy: 'Shifa Nawaz', group: null, likes: 0, liked: false, source: 'student', status: 'pending', supervisorFeedback: null, uniquenessScore: 0.65, feasibilityScore: 0.9, requiredSkills: ['JavaScript', 'Automation'], aiSuggestions: 'Clarify target platforms (web/mobile).' },
  { id: 'i3', title: 'API Tester', description: 'API testing and mock server.', ideaBy: 'Rafay Imran', group: 'Tech Titans', likes: 2, liked: true, source: 'student', status: 'rejected', supervisorFeedback: 'Overlaps with existing course project.', uniquenessScore: 0.45, feasibilityScore: 0.95, requiredSkills: ['Node.js', 'REST'], aiSuggestions: null },
];

export const DUMMY_MILESTONES = [
  { id: 'm1', title: 'Proposal Submission', deadline: '2024-02-15', openDate: '2024-01-15', weightage: 10, description: 'Submit project proposal.', submission: { status: 'evaluated', grade: 85, feedback: 'Excellent.', submittedAt: '2024-02-14' }, createdBy: 'Admin' },
  { id: 'm2', title: 'Literature Review', deadline: '2024-03-01', openDate: '2024-02-16', weightage: 10, description: 'Literature review document.', submission: { status: 'submitted', submittedAt: '2024-02-28' }, createdBy: 'Admin' },
  { id: 'm3', title: 'System Design Document', deadline: '2024-03-15', openDate: '2024-03-02', weightage: 15, description: 'SRS and BRD.', submission: null, createdBy: 'Admin' },
];

export const DUMMY_SUBMISSIONS = [
  { id: 's1', milestone: { title: 'Proposal Submission', deadline: '2024-02-15', weightage: 10 }, project: { title: 'Smart Campus App' }, submittedBy: { name: 'Zara Rashid', email: 'student@fyp.com' } },
  { id: 's2', milestone: { title: 'Design Document', deadline: '2024-03-01', weightage: 15 }, project: { title: 'E-Learning Platform' }, submittedBy: { name: 'Ali Hassan', email: 'student2@fyp.com' } },
];

export const DUMMY_SUBMISSIONS_TO_EVALUATE = [
  { id: 's1', milestone: { title: 'Proposal Submission', deadline: '2024-02-15', weightage: 10 }, project: { title: 'E-Learning Platform' }, submittedBy: { name: 'Ali Hassan', email: 'student2@fyp.com' } },
  { id: 's2', milestone: { title: 'Design Document', deadline: '2024-03-01', weightage: 15 }, project: { title: 'Smart Campus App' }, submittedBy: { name: 'Zara Rashid', email: 'student@fyp.com' } },
];

export const DUMMY_PROGRESS_PROJECTS = [
  { id: 'pr1', title: 'Smart Campus App', submittedBy: { name: 'Zara Rashid', email: 'student@fyp.com' }, supervisor: { name: 'Dr. Ahmed Khan' }, status: 'approved' },
  { id: 'pr2', title: 'E-Learning Platform', submittedBy: { name: 'Ali Hassan', email: 'student2@fyp.com' }, supervisor: { name: 'Dr. Fatima Noor' }, status: 'approved' },
];

export const DUMMY_PROJECTS_PROGRESS = [
  { id: 'p1', title: 'Smart Campus Navigation App', submittedBy: { name: 'Zara Rashid' }, supervisor: { name: 'Dr. Ahmed Khan' }, status: 'approved', progress: 75 },
  { id: 'p2', title: 'AI-Powered Study Assistant', submittedBy: { name: 'Ali Hassan' }, supervisor: { name: 'Dr. Fatima Noor' }, status: 'approved', progress: 45 },
];

export const DUMMY_DOCUMENTS = [
  { id: 'd1', name: 'Project_Proposal_v1.pdf', type: 'PDF', date: '2024-01-15', size: '2.4 MB', uploadedBy: 'Zara Rashid', category: 'Proposal', version: 1, versions: [{ version: 1, date: '2024-01-15', uploadedBy: 'Zara Rashid' }] },
  { id: 'd2', name: 'System_Design_Document.docx', type: 'Document', date: '2024-02-01', size: '1.8 MB', uploadedBy: 'Ali Hassan', category: 'Design', version: 2, versions: [{ version: 1, date: '2024-01-20', uploadedBy: 'Ali Hassan' }, { version: 2, date: '2024-02-01', uploadedBy: 'Ali Hassan' }] },
  { id: 'd3', name: 'Milestone1_Report.pdf', type: 'PDF', date: '2024-02-10', size: '0.5 MB', uploadedBy: 'Sara Ahmed', category: 'Reports', version: 1, versions: [{ version: 1, date: '2024-02-10', uploadedBy: 'Sara Ahmed' }] },
];
export const DOCUMENT_CATEGORIES = ['Proposal', 'Design', 'Reports', 'Code', 'Other'];

export const DUMMY_REPORTS = [
  { id: 'r1', title: 'Idea Uniqueness Analysis', score: 0.82, feedback: 'Your project idea shows strong originality.', date: '2024-01-10' },
  { id: 'r2', title: 'Feasibility Assessment', score: 0.75, feedback: 'The project is technically feasible.', date: '2024-01-15' },
];
export const DUMMY_MILESTONE_GRADES = [
  { milestone: 'Proposal Submission', weightage: 10, grade: 85, maxGrade: 100, submittedAt: '2024-02-14' },
  { milestone: 'Literature Review', weightage: 10, grade: null, maxGrade: 100, submittedAt: null },
  { milestone: 'System Design Document', weightage: 15, grade: null, maxGrade: 100, submittedAt: null },
];

export const DUMMY_CONVERSATIONS = [
  { id: 'c1', participants: [{ id: '2', name: 'Dr. Ahmed Khan', avatar: null }], lastMessage: 'Great progress on the proposal!', lastAt: '2024-01-22T14:30:00', unread: 2, type: 'direct' },
  { id: 'c2', participants: [{ id: '4', name: 'Ali Hassan', avatar: null }], lastMessage: 'Can we meet tomorrow?', lastAt: '2024-01-21T10:15:00', unread: 0, type: 'direct' },
];
export const DUMMY_GROUP_CHATS = [
  { id: 'gc1', name: 'Team Alpha', participants: ['Zara', 'Ali', 'Sara', 'Dr. Ahmed Khan'], lastMessage: 'Design doc shared in Files.', lastAt: '2024-01-22T16:00:00', unread: 1 },
];

export const DUMMY_MESSAGES = [
  { id: 'msg1', sender: 'Dr. Ahmed Khan', body: 'Hi everyone! I have reviewed your proposal.', createdAt: '2024-01-22T10:00:00' },
  { id: 'msg2', sender: 'Me', body: 'Thank you for the feedback!', createdAt: '2024-01-22T10:05:00' },
];

export const DUMMY_ANNOUNCEMENTS = [
  { id: 'a1', title: 'FYP Exhibition Date', body: 'The Final Year Project Exhibition will be held on June 20–22, 2024.', target: 'all', createdAt: '2024-02-01' },
  { id: 'a2', title: 'Proposal Deadline', body: 'Project proposals must be submitted by February 28, 2024.', target: 'students', createdAt: '2024-02-10' },
];

export const DUMMY_FYP_GROUPS = [
  { id: 'g1', groupName: 'The User Friendlies', projectLead: 'Taha Mirza', project: 'FYP Portal', members: 'Owais Ali, Taha Mirza', supervisor: 'Hamza Akbar', year: '2024', confirmed: 'Yes', finalized: true },
  { id: 'g2', groupName: 'Tech Titans', projectLead: 'Imran Ali', project: 'API Tester', members: 'Rafay Imran, Imran Ali', supervisor: 'Dr. Fatima Noor', year: '2024', confirmed: 'Yes', finalized: false },
];

export const DUMMY_GROUP_INVITES = [
  { id: 'inv1', fromGroup: 'Team Beta', fromUser: 'Omar Khalid', message: 'Join our FYP group for the Smart Library project.', createdAt: '2024-02-01T10:00:00' },
];
export const DUMMY_SUPERVISOR_REQUESTS = [
  { id: 'sr1', supervisorName: 'Dr. Ahmed Khan', department: 'Computer Science', status: 'approved' },
  { id: 'sr2', supervisorName: 'Dr. Fatima Noor', department: 'Software Engineering', status: 'pending' },
];

export const DUMMY_ADMIN_MILESTONES = [
  { id: 'm1', title: 'Proposal Submission', description: 'Submit project proposal.', deadline: '2024-02-15', percentage: '10', year: '2024' },
  { id: 'm2', title: 'Literature Review', description: 'Literature review document.', deadline: '2024-03-01', percentage: '10', year: '2024' },
  { id: 'm3', title: 'System Design Document', description: 'SRS and BRD.', deadline: '2024-03-15', percentage: '15', year: '2024' },
];

export const DUMMY_ADMIN_PROJECTS = [
  { id: 'p1', groupName: 'Xiongmao Legends', progress: '60', status: 'Private', year: '2024', finished: 'No' },
  { id: 'p2', groupName: 'The User Friendlies', progress: '30', status: 'Private', year: '2024', finished: 'No' },
];

export const SIDEBAR_STUDENT = [
  { path: '/student/dashboard', label: 'Dashboard', icon: 'home' },
  { path: '/student/profile', label: 'My Profile', icon: 'user' },
  { path: '/student/proposals', label: 'Ideas', icon: 'lightbulb' },
  { path: '/student/group', label: 'Groups', icon: 'people' },
  { path: '/student/milestones', label: 'Milestones', icon: 'flag' },
  { path: '/student/team', label: 'Team', icon: 'users' },
  { path: '/student/kanban', label: 'Kanban', icon: 'kanban' },
  { path: '/student/chat', label: 'Chat', icon: 'message-circle' },
  { path: '/student/documents', label: 'Documents', icon: 'folder' },
  { path: '/student/users', label: 'Users', icon: 'people' },
  { path: '/student/reports', label: 'Reports', icon: 'bar-chart' },
];

export const SIDEBAR_MENTOR = [
  { path: '/mentor/dashboard', label: 'Dashboard', icon: 'home' },
  { path: '/mentor/profile', label: 'Supervisor Profile', icon: 'user' },
  { path: '/mentor/proposals', label: 'Proposals', icon: 'file-text' },
  { path: '/mentor/milestones', label: 'Milestones', icon: 'flag' },
  { path: '/mentor/chat', label: 'Chat', icon: 'message-circle' },
];

export const SIDEBAR_ADMIN = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: 'speedometer' },
  { path: '/admin/milestones', label: 'Milestones', icon: 'flag' },
  { path: '/admin/groups', label: 'FYP Groups', icon: 'people' },
  { path: '/admin/users', label: 'Accounts', icon: 'users' },
  { path: '/admin/projects', label: 'Projects', icon: 'folder' },
  { path: '/admin/companies', label: 'Companies', icon: 'user-check' },
  { path: '/admin/announcements', label: 'Announcements', icon: 'megaphone' },
  { path: '/admin/settings', label: 'Settings', icon: 'settings' },
  { path: '/admin/reports', label: 'Reports', icon: 'bar-chart' },
  { path: '/admin/logs', label: 'Logs', icon: 'file-text' },
  { path: '/admin/progress', label: 'Progress', icon: 'trending-up' },
];
