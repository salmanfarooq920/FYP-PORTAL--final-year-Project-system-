import { useState, useEffect } from 'react';
import * as settingsApi from '../../api/settings.js';

const initialSettings = {
  siteName: 'FYPConnect',
  academicYear: '2024',
  semester: 'Spring',
  proposalDeadline: '2024-02-28',
  midTermDemoStart: '2024-04-15',
  midTermDemoEnd: '2024-04-18',
  finalReportDeadline: '2024-06-15',
  exhibitionStart: '2024-06-20',
  exhibitionEnd: '2024-06-22',
  maxGroupSize: 3,
  allowProposalEdit: true,
  emailNotifications: true,
};

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:border-slate-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-500/20';
const labelClass = 'mb-1.5 block text-sm font-medium text-slate-700';

export default function AdminSettings() {
  const [settings, setSettings] = useState(initialSettings);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await settingsApi.get();
        if (!cancelled && res?.data) setSettings((s) => ({ ...s, ...res.data }));
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to load settings');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleChange = (key, value) => setSettings((s) => ({ ...s, [key]: value }));
  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const payload = { ...settings };
      if (typeof payload.maxGroupSize === 'string') payload.maxGroupSize = parseInt(payload.maxGroupSize, 10) || 3;
      const res = await settingsApi.update(payload);
      if (res?.data) setSettings((s) => ({ ...s, ...res.data }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      setError(e.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl w-full">
        <div className="flex min-h-[280px] items-center justify-center rounded-2xl bg-white/80 p-8 shadow-sm ring-1 ring-slate-200/60">
          <div className="text-center">
            <div className="mx-auto mb-3 h-10 w-10 animate-pulse rounded-xl bg-slate-200" />
            <p className="text-sm font-medium text-slate-500">Loading settings…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl w-full">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 via-zinc-50/30 to-slate-100/90 px-6 py-8 shadow-inner ring-1 ring-slate-200/50 min-h-[400px]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(100,116,139,0.06),transparent)] pointer-events-none" aria-hidden />
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-200/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" aria-hidden />

        {error && (
          <div className="settings-header-enter relative mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}

        {/* Header */}
        <div className="settings-header-enter relative flex flex-wrap items-center justify-between gap-4 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-600 to-slate-700 text-white shadow-lg shadow-slate-500/25">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
              <p className="text-sm text-slate-500">Configure portal name, academic year, deadlines, and preferences.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-md transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none ${
              saved
                ? 'bg-emerald-600 text-white focus:ring-emerald-500'
                : 'bg-gradient-to-r from-slate-600 to-slate-700 text-white hover:from-slate-700 hover:to-slate-800 focus:ring-slate-500'
            }`}
          >
            {saved ? (
              <>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Saved!
              </>
            ) : saving ? (
              'Saving…'
            ) : (
              'Save Changes'
            )}
          </button>
        </div>

        {/* General */}
        <div className="settings-section-enter animation-delay-100 relative mb-6 rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-slate-900">General</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Site Name</label>
              <input
                value={settings.siteName}
                onChange={(e) => handleChange('siteName', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Academic Year</label>
              <input
                value={settings.academicYear}
                onChange={(e) => handleChange('academicYear', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Semester</label>
              <select
                value={settings.semester}
                onChange={(e) => handleChange('semester', e.target.value)}
                className={inputClass}
              >
                <option value="Spring">Spring</option>
                <option value="Fall">Fall</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Max Group Size</label>
              <input
                type="number"
                min={1}
                max={5}
                value={settings.maxGroupSize}
                onChange={(e) => handleChange('maxGroupSize', e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Deadlines */}
        <div className="settings-section-enter animation-delay-150 relative mb-6 rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-slate-900">Deadlines</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Proposal Deadline</label>
              <input
                type="date"
                value={settings.proposalDeadline}
                onChange={(e) => handleChange('proposalDeadline', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Final Report Deadline</label>
              <input
                type="date"
                value={settings.finalReportDeadline}
                onChange={(e) => handleChange('finalReportDeadline', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Mid-term Demo Start</label>
              <input
                type="date"
                value={settings.midTermDemoStart}
                onChange={(e) => handleChange('midTermDemoStart', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Mid-term Demo End</label>
              <input
                type="date"
                value={settings.midTermDemoEnd}
                onChange={(e) => handleChange('midTermDemoEnd', e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Exhibition Dates</label>
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="date"
                  value={settings.exhibitionStart}
                  onChange={(e) => handleChange('exhibitionStart', e.target.value)}
                  className="flex-1 min-w-[140px] rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-slate-900 focus:border-slate-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-500/20"
                />
                <span className="text-slate-500 text-sm">to</span>
                <input
                  type="date"
                  value={settings.exhibitionEnd}
                  onChange={(e) => handleChange('exhibitionEnd', e.target.value)}
                  className="flex-1 min-w-[140px] rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-slate-900 focus:border-slate-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-500/20"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="settings-section-enter animation-delay-200 relative rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-2a2 2 0 110 4m0 2v2m0-4V4m0 4v2M6 12h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v4a2 2 0 002 2zm0 0h2a2 2 0 002 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4a2 2 0 012-2zm8 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v4a2 2 0 002 2zm0 0h2a2 2 0 002 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4a2 2 0 012-2z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-slate-900">Preferences</h2>
          </div>
          <div className="space-y-3">
            <label className="settings-row-hover flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200/80 p-4">
              <input
                type="checkbox"
                checked={settings.allowProposalEdit}
                onChange={(e) => handleChange('allowProposalEdit', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-slate-600 focus:ring-slate-500/20"
              />
              <span className="text-sm font-medium text-slate-700">Allow students to edit proposals before approval</span>
            </label>
            <label className="settings-row-hover flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200/80 p-4">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-slate-600 focus:ring-slate-500/20"
              />
              <span className="text-sm font-medium text-slate-700">Send email notifications for deadlines and approvals</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
