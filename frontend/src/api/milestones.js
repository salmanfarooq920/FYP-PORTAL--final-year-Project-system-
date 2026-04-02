import { apiRequest } from './client.js';
import { DUMMY_MILESTONES, DUMMY_SUBMISSIONS } from '../utils/constants.js';

const USE_DUMMY = !import.meta.env.VITE_API_URL || String(import.meta.env.VITE_API_URL || '').trim() === '' || import.meta.env.VITE_API_URL === 'undefined';

export async function getForStudent() {
  if (USE_DUMMY) return { data: DUMMY_MILESTONES };
  const data = await apiRequest('/milestones/for-student');
  return data;
}

export async function getSubmissionsToEvaluate() {
  if (USE_DUMMY) return { data: DUMMY_SUBMISSIONS };
  const data = await apiRequest('/milestones/to-evaluate');
  return data;
}

export async function submitMilestone(milestoneId, data) {
  if (USE_DUMMY) return { data: {} };
  return apiRequest(`/milestones/${milestoneId}/submit`, { method: 'POST', body: JSON.stringify(data) });
}

export async function evaluate(submissionId, data) {
  if (USE_DUMMY) return { data: {} };
  return apiRequest(`/milestones/submissions/${submissionId}/evaluate`, { method: 'PATCH', body: JSON.stringify(data) });
}

export async function list() {
  if (USE_DUMMY) return { data: DUMMY_MILESTONES };
  const res = await apiRequest('/milestones');
  return res;
}

export async function create(payload) {
  if (USE_DUMMY) return { data: { id: 'm-new', ...payload } };
  return apiRequest('/milestones', { method: 'POST', body: JSON.stringify(payload) });
}

export async function update(id, payload) {
  if (USE_DUMMY) return { data: {} };
  return apiRequest(`/milestones/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
}

export async function remove(id) {
  if (USE_DUMMY) return {};
  return apiRequest(`/milestones/${id}`, { method: 'DELETE' });
}
