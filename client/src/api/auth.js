const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1').replace(/\/$/, '');
const API_BASE = `${baseUrl}/auth`;

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include', // important: sends sid cookie
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}


export const AuthAPI = {
  register: (email, password) =>
    request('/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  login: (email, password) =>
    request('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  logout: () => request('/logout', { method: 'POST' }),
  me: () => request('/me'),
  listSessions: () => request('/sessions'),
  logoutAll: () => request('/sessions', { method: 'DELETE' }),
  logoutSession: (sid) => request(`/sessions/${sid}`, { method: 'DELETE' }),
};
