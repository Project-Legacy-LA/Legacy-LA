import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthAPI } from '../api/auth';

export default function AcceptInvite() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const tokenMissing = useMemo(() => token.length === 0, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;

    if (tokenMissing) {
      setError('Invite link is invalid or missing. Please use the link sent to your email.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await AuthAPI.acceptInvite(token, password);
      setMessage('Invite accepted. Redirecting you…');
      setPassword('');
      setConfirmPassword('');
      
      // Route based on path_type if provided (for client invites)
      // path_type comes from response.data.path_type
      const pathType = response?.data?.path_type || 'path1';
      const redirectPath = pathType === 'path2' 
        ? '/succession' 
        : '/';
      
      setTimeout(() => navigate(redirectPath, { replace: true }), 1500);
    } catch (err) {
      setError(err.message || 'Failed to accept invite');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-gray-900 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl border border-gray-200 p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Accept Invitation</h1>
        <p className="text-sm text-gray-600 mb-4">
          {tokenMissing
            ? 'This page must be opened via the invite link sent to your email.'
            : 'Set a password to activate your account.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">{error}</div>}
          {message && <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-md px-3 py-2">{message}</div>}

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2" htmlFor="confirm">
              Confirm password
            </label>
            <input
              id="confirm"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            disabled={loading || tokenMissing}
            className="w-full py-3 rounded-lg font-medium text-white transition-all duration-200 hover:opacity-90 disabled:opacity-50"
            style={{ background: 'linear-gradient(90deg, var(--ll-bg-2), var(--ll-bg-1))' }}
          >
            {loading ? 'Activating…' : 'Activate account'}
          </button>
        </form>
      </div>
    </div>
  );
}
