import { apiRequest } from './client.js';

const USE_DUMMY = !import.meta.env.VITE_API_URL || String(import.meta.env.VITE_API_URL || '').trim() === '';

const defaultData = {
  siteName: 'FYPConnect',
  academicYear: '2026',
  semester: 'Spring',
  proposalDeadline: '2026-02-28',
  midTermDemoStart: '2026-04-15',
  midTermDemoEnd: '2026-04-18',
  finalReportDeadline: '2026-06-15',
  exhibitionStart: '2026-06-20',
  exhibitionEnd: '2026-06-22',
  maxGroupSize: 3,
  allowProposalEdit: true,
  emailNotifications: true,
};

export async function get() {
  if (USE_DUMMY) return { success: true, data: { ...defaultData } };
  return apiRequest('/settings');
}

export async function update(payload) {
  if (USE_DUMMY) return { success: true, data: { ...defaultData, ...payload } };
  return apiRequest('/settings', { method: 'PUT', body: JSON.stringify(payload) });
}
