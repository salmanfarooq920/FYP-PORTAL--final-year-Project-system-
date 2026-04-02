import { apiRequest } from './client.js';
import { DUMMY_CONVERSATIONS, DUMMY_MESSAGES } from '../utils/constants.js';

const USE_DUMMY = !import.meta.env.VITE_API_URL || String(import.meta.env.VITE_API_URL || '').trim() === '';

export async function getConversations() {
  if (USE_DUMMY) return { data: DUMMY_CONVERSATIONS };
  const data = await apiRequest('/chat/conversations');
  return data;
}

export async function getMessages(conversationId) {
  if (USE_DUMMY) return { data: DUMMY_MESSAGES };
  const data = await apiRequest(`/chat/conversations/${conversationId}/messages`);
  return data;
}

export async function sendMessage(conversationId, body) {
  if (USE_DUMMY) return { data: { id: 'msg-new', body, createdAt: new Date().toISOString() } };
  return apiRequest(`/chat/conversations/${conversationId}/messages`, { method: 'POST', body: JSON.stringify({ body }) });
}
