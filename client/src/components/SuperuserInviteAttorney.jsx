import React, { useState } from 'react';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1').replace(/\/$/, '');

export default function SuperuserInviteAttorney() {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    setError('');
    setSuccess(null);

    try {
      const res = await fetch(`${API_BASE}/tenant/onboard`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, display_name: displayName }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to invite attorney');
      }

      setSuccess({
        message: 'Attorney invite sent successfully.',
        token: data.data?.token,
        inviteLink: data.data?.inviteLink,
      });
      setEmail('');
      setDisplayName('');
    } catch (err) {
      setError(err.message || 'Unable to send invite');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Invite an Attorney</h1>
        <p className="text-gray-600 mt-2">
          Submit a primary attorney's email and tenant name. If you do not have permission, the server will reject the request.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </div>
          )}

          {success && (
            <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-md px-3 py-2">
              {success.message}
              {success.token && (
                <div className="mt-2 text-xs text-green-700 break-words">
                  Token: {success.token}
                </div>
              )}
              {success.inviteLink && (
                <div className="mt-1 text-xs text-green-700 break-words">
                  Invite link: {success.inviteLink}
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Attorney email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              placeholder="attorney@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tenant display name *</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              placeholder="e.g. Smith & Associates PLLC"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium text-white transition-opacity duration-200 bg-gradient-to-r from-[var(--ll-bg-2)] to-[var(--ll-bg-1)] hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Sending invite…' : 'Send invite'}
          </button>
        </form>
      </div>
    </div>
  );
}
