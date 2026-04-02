import { apiRequest } from './client.js';
import { DUMMY_USERS } from '../utils/constants.js';

const USE_DUMMY = !import.meta.env.VITE_API_URL || String(import.meta.env.VITE_API_URL || '').trim() === '';

export async function login(credentials) {
  if (USE_DUMMY) {
    const user = DUMMY_USERS.find(
      (u) => u.email === credentials.email && (credentials.password === 'password' || credentials.password === '123456')
    );
    if (!user) throw new Error('Invalid email or password');
    const token = 'dummy-token-' + user.id;
    return { 
      token, 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        rollNumber: user.rollNumber || null,
        department: user.department || null,
        avatar: user.avatar || null,
      } 
    };
  }
  const data = await apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(credentials) });
  return { token: data.token, user: data.user };
}

export async function register(payload) {
  if (USE_DUMMY) {
    return { message: 'Registration submitted. Contact your administrator for account activation.' };
  }
  const data = await apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(payload) });
  return data;
}

export async function forgotPassword(email) {
  if (USE_DUMMY) return { message: 'Stub: check your email' };
  return apiRequest('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) });
}
