import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import PageTitle from '../../components/ui/PageTitle';
import { DUMMY_GROUP } from '../../utils/constants';

export default function StudentProfile() {
  const { user } = useAuth();
  const [group] = useState(DUMMY_GROUP);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    rollNumber: user?.rollNumber ?? '',
    department: user?.department ?? '',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [toast, setToast] = useState(null);

  const profile = {
    ...form,
    role: user?.role ?? 'Student',
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setEditing(false);
    setToast({ type: 'success', message: 'Profile updated successfully.' });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) {
      setToast({ type: 'error', message: 'New passwords do not match.' });
      return;
    }
    if (passwordForm.new.length < 6) {
      setToast({ type: 'error', message: 'Password must be at least 6 characters.' });
      return;
    }
    setShowPasswordModal(false);
    setPasswordForm({ current: '', new: '', confirm: '' });
    setToast({ type: 'success', message: 'Password changed successfully.' });
    setTimeout(() => setToast(null), 3000);
  };

  const avatarUrl = profileImage ? URL.createObjectURL(profileImage) : null;
  const displayInitial = (profile.name || 'U').charAt(0);
  const accountActive = true;

  return (
    <div className="space-y-8">
      <PageTitle
        title="My Profile"
        subtitle="Manage your personal and academic information."
        action={
          !editing ? (
            <button type="button" onClick={() => setEditing(true)} className="btn-primary min-w-[140px] transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0">
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button type="button" onClick={() => setEditing(false)} className="btn-secondary min-w-[140px] transition-all duration-200 hover:bg-slate-100">Cancel</button>
              <button type="submit" form="profile-form" className="btn-primary min-w-[140px] transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0">Save</button>
            </div>
          )
        }
      />

      {toast && (
        <div className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-slide-up ${toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
          {toast.type === 'success' ? (
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          ) : (
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          )}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* Cover band + avatar card with effects */}
      <div className="relative max-w-3xl animate-fade-in-up">
        <div className="h-28 sm:h-32 rounded-t-2xl bg-gradient-to-r from-slate-800 to-slate-700 shadow-inner" />
        <div className="absolute left-6 right-6 top-16 sm:top-20">
          <div className="flex flex-col sm:flex-row sm:items-end gap-6 p-6 rounded-2xl bg-white shadow-xl border border-slate-200 profile-card-hover">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 flex-shrink-0">
              <div className="relative -mt-14 sm:-mt-16 overflow-visible">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center text-4xl font-bold text-slate-600 shadow-inner ring-4 ring-white">
                  {avatarUrl ? <img src={avatarUrl} alt="Profile" className="w-full h-full object-contain" /> : displayInitial}
                </div>
                {editing && (
                  <label className="absolute bottom-2 right-2 z-10 w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center cursor-pointer shadow-lg ring-2 ring-white border-2 border-blue-700 hover:bg-blue-500 hover:scale-110 active:scale-95 transition-all duration-200">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /></svg>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => setProfileImage(e.target.files?.[0])} />
                  </label>
                )}
              </div>
              <div className="text-center sm:text-left sm:pb-1">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">{profile.name || 'Profile'}</h2>
                <p className="text-slate-500 text-sm mt-0.5">{profile.role}</p>
                <span className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-medium ${accountActive ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${accountActive ? 'bg-green-500' : 'bg-amber-500'}`} />
                  {accountActive ? 'Active' : 'Pending'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two columns: form left, supervisor + actions right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-3xl lg:items-end">
        {/* Personal information */}
        <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden profile-card-hover animate-fade-in-up animation-delay-100">
          <div className="px-6 py-5 bg-slate-50 border-b border-slate-200">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Personal information</h3>
          </div>
          <div className="p-6 sm:p-8">
            <form id="profile-form" onSubmit={handleSaveProfile} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="label">Full name</label>
                  {editing ? (
                    <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="input-base focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200" />
                  ) : (
                    <p className="text-slate-800 font-medium mt-0.5">{profile.name}</p>
                  )}
                </div>
                <div>
                  <label className="label">Email</label>
                  {editing ? (
                    <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="input-base focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200" />
                  ) : (
                    <p className="text-slate-900 font-medium mt-0.5">{profile.email}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="label">Roll number</label>
                  {editing ? (
                    <input type="text" value={form.rollNumber} onChange={(e) => setForm((f) => ({ ...f, rollNumber: e.target.value }))} className="input-base focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200" placeholder="e.g. 71461" />
                  ) : (
                    <p className="text-slate-900 font-medium mt-0.5">{profile.rollNumber}</p>
                  )}
                </div>
                <div>
                  <label className="label">Department</label>
                  {editing ? (
                    <input type="text" value={form.department} onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))} className="input-base focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200" />
                  ) : (
                    <p className="text-slate-900 font-medium mt-0.5">{profile.department}</p>
                  )}
                </div>
              </div>
              <div>
                <label className="label">Role</label>
                <p className="text-slate-900 font-medium mt-0.5">{profile.role}</p>
              </div>
            </form>
          </div>
        </div>

        {/* Right column: supervisor card + change password */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden profile-card-hover animate-fade-in-up animation-delay-200">
            <div className="px-5 py-4 bg-slate-50 border-b border-slate-200">
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Supervisor & project</h3>
            </div>
            <div className="p-5 space-y-3 text-sm">
              <div>
                <p className="text-slate-500 text-xs uppercase tracking-wider">Supervisor</p>
                <p className="font-medium text-slate-900 mt-0.5">{group?.supervisor?.name ?? 'Not assigned'}</p>
              </div>
              {group?.supervisor?.email && (
                <div>
                  <p className="text-slate-500 text-xs">Email</p>
                  <p className="text-slate-800 mt-0.5">{group.supervisor.email}</p>
                </div>
              )}
              <div>
                <p className="text-slate-500 text-xs uppercase tracking-wider">Project</p>
                <p className="font-medium text-slate-900 mt-0.5 truncate" title={group?.project?.title}>{group?.project?.title ?? '—'}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs">Status</p>
                <p className="font-medium text-slate-900 mt-0.5 capitalize">{group?.project?.status ?? '—'}</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-5 profile-card-hover animate-fade-in-up animation-delay-300">
            <button
              type="button"
              onClick={() => setShowPasswordModal(true)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-slate-300 text-slate-700 font-medium hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 hover:shadow-md transition-all duration-200 active:scale-[0.98]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
              Change password
            </button>
          </div>
        </div>
      </div>

      {/* Change password modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 profile-modal-backdrop" onClick={() => setShowPasswordModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 profile-modal-content border border-slate-200/80" onClick={(e) => e.stopPropagation()}>
            <div className="w-10 h-1 rounded-full bg-blue-200 mb-4" aria-hidden />
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Change password</h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="label">Current password</label>
                <input type="password" value={passwordForm.current} onChange={(e) => setPasswordForm((p) => ({ ...p, current: e.target.value }))} className="input-base focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200" required />
              </div>
              <div>
                <label className="label">New password</label>
                <input type="password" value={passwordForm.new} onChange={(e) => setPasswordForm((p) => ({ ...p, new: e.target.value }))} className="input-base focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200" minLength={6} required />
              </div>
              <div>
                <label className="label">Confirm new password</label>
                <input type="password" value={passwordForm.confirm} onChange={(e) => setPasswordForm((p) => ({ ...p, confirm: e.target.value }))} className="input-base focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200" required />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowPasswordModal(false)} className="btn-secondary flex-1 transition-all duration-200 hover:bg-slate-100">Cancel</button>
                <button type="submit" className="btn-primary flex-1 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0">Update password</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
