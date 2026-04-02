import { apiRequest } from './client.js';
import { DUMMY_DOCUMENTS } from '../utils/constants.js';

const USE_DUMMY = !import.meta.env.VITE_API_URL || String(import.meta.env.VITE_API_URL || '').trim() === '';

export async function list(projectId) {
  if (USE_DUMMY) return { data: DUMMY_DOCUMENTS };
  const q = projectId ? `?projectId=${projectId}` : '';
  const data = await apiRequest('/files' + q);
  return data;
}

export async function upload(file, projectId) {
  if (USE_DUMMY) return { data: { id: 'd-new', name: file.name, date: new Date().toISOString() } };
  const form = new FormData();
  form.append('file', file);
  if (projectId) form.append('projectId', projectId);
  const res = await fetch(import.meta.env.VITE_API_URL + '/files/upload', {
    method: 'POST',
    headers: { Authorization: `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}` },
    body: form,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Upload failed');
  return data;
}

export async function getUrl(fileId) {
  if (USE_DUMMY) return { data: { url: '#' } };
  return apiRequest(`/files/${fileId}/url`);
}
