const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getToken() {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
}

export async function apiRequest(endpoint, options = {}) {
  try {
    const url = endpoint.startsWith('http') 
      ? endpoint 
      : `${BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    
    const token = getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };
    
    const res = await fetch(url, { ...options, headers });
    
    // Handle non-JSON responses
    let data;
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await res.json();
    } else {
      const text = await res.text();
      data = { message: text };
    }
    
    if (!res.ok) {
      const error = new Error(data.message || res.statusText || 'Request failed');
      error.status = res.status;
      error.data = data;
      throw error;
    }
    
    return data;
  } catch (error) {
    // Network errors or other fetch failures
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error. Please check your connection.');
    }
    throw error;
  }
}

export { BASE_URL };
