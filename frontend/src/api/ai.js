import { apiRequest } from './client.js';
import { DUMMY_REPORTS } from '../utils/constants.js';

const USE_DUMMY = !import.meta.env.VITE_API_URL || String(import.meta.env.VITE_API_URL || '').trim() === '';

export async function getReports(projectId) {
  if (USE_DUMMY) return { data: DUMMY_REPORTS };
  const q = projectId ? `?projectId=${projectId}` : '';
  const data = await apiRequest('/ai/reports' + q);
  return data;
}

export async function submitIdeaForScore(idea) {
  if (USE_DUMMY) return { data: { uniquenessScore: 0.75, feedback: 'Stub feedback.' } };
  const data = await apiRequest('/ai/evaluate-idea', { method: 'POST', body: JSON.stringify(idea) });
  return data;
}
