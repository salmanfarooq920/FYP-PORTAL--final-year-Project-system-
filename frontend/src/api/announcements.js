import { apiRequest } from './client.js';
import { DUMMY_ANNOUNCEMENTS } from '../utils/constants.js';

const USE_DUMMY = !import.meta.env.VITE_API_URL || String(import.meta.env.VITE_API_URL || '').trim() === '';

export async function list(params = {}) {
  if (USE_DUMMY) return { data: DUMMY_ANNOUNCEMENTS };
  const q = new URLSearchParams(params).toString();
  return apiRequest('/announcements' + (q ? '?' + q : ''));
}

export async function create(payload) {
  if (USE_DUMMY) return { data: { id: 'a-new', ...payload } };
  return apiRequest('/announcements', { method: 'POST', body: JSON.stringify(payload) });
}
