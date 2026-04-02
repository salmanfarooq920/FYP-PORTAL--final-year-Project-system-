import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';

import Landing from '../pages/Landing';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminGroups from '../pages/admin/AdminGroups';
import AdminMilestones from '../pages/admin/AdminMilestones';
import AdminProjects from '../pages/admin/AdminProjects';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminSupervisors from '../pages/admin/AdminSupervisors';
import AdminAnnouncements from '../pages/admin/AdminAnnouncements';
import AdminReports from '../pages/admin/AdminReports';
import AdminLogs from '../pages/admin/AdminLogs';
import AdminSettings from '../pages/admin/AdminSettings';
import AdminProgress from '../pages/admin/AdminProgress';

import StudentDashboard from '../pages/student/StudentDashboard';
import StudentProposals from '../pages/student/StudentProposals';
import StudentGroup from '../pages/student/StudentGroup';
import StudentMilestones from '../pages/student/StudentMilestones';
import StudentTeam from '../pages/student/StudentTeam';
import StudentKanban from '../pages/student/StudentKanban';
import StudentChat from '../pages/student/StudentChat';
import StudentDocuments from '../pages/student/StudentDocuments';
import StudentUsers from '../pages/student/StudentUsers';
import StudentReports from '../pages/student/StudentReports';
import StudentProfile from '../pages/student/StudentProfile';

import MentorDashboard from '../pages/mentor/MentorDashboard';
import MentorProfile from '../pages/mentor/MentorProfile';
import MentorProposals from '../pages/mentor/MentorProposals';
import MentorMilestones from '../pages/mentor/MentorMilestones';
import MentorChat from '../pages/mentor/MentorChat';

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, loading, role } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to={role === 'Admin' ? '/admin/dashboard' : role === 'Mentor' ? '/mentor/dashboard' : '/student/dashboard'} replace />;
  return children;
}

function AdminLayout({ children }) {
  return (
    <DashboardLayout role="Admin">
      {children}
    </DashboardLayout>
  );
}
function StudentLayout({ children }) {
  return (
    <DashboardLayout role="Student">
      {children}
    </DashboardLayout>
  );
}
function MentorLayout({ children }) {
  return (
    <DashboardLayout role="Mentor">
      {children}
    </DashboardLayout>
  );
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Landing />} />

        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['Admin']}><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/groups" element={<ProtectedRoute allowedRoles={['Admin']}><AdminLayout><AdminGroups /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/milestones" element={<ProtectedRoute allowedRoles={['Admin']}><AdminLayout><AdminMilestones /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/projects" element={<ProtectedRoute allowedRoles={['Admin']}><AdminLayout><AdminProjects /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['Admin']}><AdminLayout><AdminUsers /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/companies" element={<ProtectedRoute allowedRoles={['Admin']}><AdminLayout><AdminSupervisors /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/announcements" element={<ProtectedRoute allowedRoles={['Admin']}><AdminLayout><AdminAnnouncements /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['Admin']}><AdminLayout><AdminReports /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/logs" element={<ProtectedRoute allowedRoles={['Admin']}><AdminLayout><AdminLogs /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['Admin']}><AdminLayout><AdminSettings /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/progress" element={<ProtectedRoute allowedRoles={['Admin']}><AdminLayout><AdminProgress /></AdminLayout></ProtectedRoute>} />

        <Route path="/student" element={<Navigate to="/student/dashboard" replace />} />
        <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={['Student']}><StudentLayout><StudentDashboard /></StudentLayout></ProtectedRoute>} />
        <Route path="/student/proposals" element={<ProtectedRoute allowedRoles={['Student']}><StudentLayout><StudentProposals /></StudentLayout></ProtectedRoute>} />
        <Route path="/student/group" element={<ProtectedRoute allowedRoles={['Student']}><StudentLayout><StudentGroup /></StudentLayout></ProtectedRoute>} />
        <Route path="/student/milestones" element={<ProtectedRoute allowedRoles={['Student']}><StudentLayout><StudentMilestones /></StudentLayout></ProtectedRoute>} />
        <Route path="/student/team" element={<ProtectedRoute allowedRoles={['Student']}><StudentLayout><StudentTeam /></StudentLayout></ProtectedRoute>} />
        <Route path="/student/kanban" element={<ProtectedRoute allowedRoles={['Student']}><StudentLayout><StudentKanban /></StudentLayout></ProtectedRoute>} />
        <Route path="/student/chat" element={<ProtectedRoute allowedRoles={['Student']}><StudentLayout><StudentChat /></StudentLayout></ProtectedRoute>} />
        <Route path="/student/documents" element={<ProtectedRoute allowedRoles={['Student']}><StudentLayout><StudentDocuments /></StudentLayout></ProtectedRoute>} />
        <Route path="/student/users" element={<ProtectedRoute allowedRoles={['Student']}><StudentLayout><StudentUsers /></StudentLayout></ProtectedRoute>} />
        <Route path="/student/reports" element={<ProtectedRoute allowedRoles={['Student']}><StudentLayout><StudentReports /></StudentLayout></ProtectedRoute>} />
        <Route path="/student/profile" element={<ProtectedRoute allowedRoles={['Student']}><StudentLayout><StudentProfile /></StudentLayout></ProtectedRoute>} />

        <Route path="/mentor" element={<Navigate to="/mentor/dashboard" replace />} />
        <Route path="/mentor/dashboard" element={<ProtectedRoute allowedRoles={['Mentor']}><MentorLayout><MentorDashboard /></MentorLayout></ProtectedRoute>} />
        <Route path="/mentor/proposals" element={<ProtectedRoute allowedRoles={['Mentor']}><MentorLayout><MentorProposals /></MentorLayout></ProtectedRoute>} />
        <Route path="/mentor/milestones" element={<ProtectedRoute allowedRoles={['Mentor']}><MentorLayout><MentorMilestones /></MentorLayout></ProtectedRoute>} />
        <Route path="/mentor/chat" element={<ProtectedRoute allowedRoles={['Mentor']}><MentorLayout><MentorChat /></MentorLayout></ProtectedRoute>} />
        <Route path="/mentor/profile" element={<ProtectedRoute allowedRoles={['Mentor']}><MentorLayout><MentorProfile /></MentorLayout></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
