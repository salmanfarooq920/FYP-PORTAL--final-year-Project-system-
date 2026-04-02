import { apiRequest } from './client.js';
import { DUMMY_USERS } from '../utils/constants.js';

const USE_DUMMY = !import.meta.env.VITE_API_URL || String(import.meta.env.VITE_API_URL || '').trim() === '';

export async function list(params = {}) {
  if (USE_DUMMY) return { data: DUMMY_USERS };
  const q = new URLSearchParams(params).toString();
  const data = await apiRequest('/users' + (q ? '?' + q : ''));
  return data;
}

export async function get(id) {
  if (USE_DUMMY) return { data: DUMMY_USERS.find((u) => u.id === id) || DUMMY_USERS[0] };
  return apiRequest(`/users/${id}`);
}

export async function create(payload) {
  if (USE_DUMMY) return { data: { id: 'new', ...payload } };
  return apiRequest('/users', { method: 'POST', body: JSON.stringify(payload) });
}

export async function update(id, payload) {
  if (USE_DUMMY) return { data: { id, ...payload } };
  return apiRequest(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
}

export async function assignSupervisor(projectId, mentorId) {
  if (USE_DUMMY) return { data: {} };
  return apiRequest(`/projects/${projectId}/supervisor`, { method: 'PATCH', body: JSON.stringify({ supervisorId: mentorId }) });
}
