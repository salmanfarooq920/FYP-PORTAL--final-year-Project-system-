import { apiRequest } from './client.js';
import { DUMMY_GROUP, DUMMY_PROPOSALS, DUMMY_PROJECTS_PROGRESS } from '../utils/constants.js';

const USE_DUMMY = !import.meta.env.VITE_API_URL || String(import.meta.env.VITE_API_URL || '').trim() === '' || import.meta.env.VITE_API_URL === 'undefined';

export async function getMyGroup() {
  if (USE_DUMMY) return { data: DUMMY_GROUP };
  const data = await apiRequest('/projects/my-group');
  return data;
}

export async function submitProposal(data) {
  if (USE_DUMMY) return { data: { id: 'p-new', ...data, status: 'submitted' } };
  return apiRequest('/projects', { method: 'POST', body: JSON.stringify(data) });
}

export async function getMyProposals() {
  if (USE_DUMMY) return { data: DUMMY_PROPOSALS };
  const data = await apiRequest('/projects/my-proposals');
  return data;
}

export async function getProposalsToReview() {
  if (USE_DUMMY) return { data: DUMMY_PROPOSALS };
  const data = await apiRequest('/projects/to-review');
  return data;
}

export async function approveProposal(id) {
  if (USE_DUMMY) return { data: {} };
  return apiRequest(`/projects/${id}/approve`, { method: 'PATCH' });
}

export async function rejectProposal(id) {
  if (USE_DUMMY) return { data: {} };
  return apiRequest(`/projects/${id}/reject`, { method: 'PATCH' });
}

export async function getProgress() {
  if (USE_DUMMY) return { data: DUMMY_PROJECTS_PROGRESS };
  return apiRequest('/projects/progress');
}
