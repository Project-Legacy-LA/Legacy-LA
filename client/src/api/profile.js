const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1').replace(/\/$/, '');
const API_BASE = `${baseUrl}/profile`;

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
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

export const ProfileAPI = {
  getProfile: () => request('/me'),
  updateProfile: (payload) =>
    request('/me', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
};
