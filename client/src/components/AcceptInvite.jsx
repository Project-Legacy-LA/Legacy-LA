import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthAPI } from '../api/auth';

export default function AcceptInvite() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-gray-900 px-4">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 border border-gray-200">
          <h1 className="text-2xl font-semibold mb-4 text-gray-900">Invitation link invalid</h1>
          <p className="text-gray-600">
            This invitation link is missing its token. Please use the link supplied in your email or request a new invitation.
          </p>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="mt-6 w-full py-3 rounded-lg font-medium text-white transition-all duration-200 hover:opacity-90"
            style={{ background: 'linear-gradient(90deg, var(--ll-bg-2), var(--ll-bg-1))' }}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await AuthAPI.acceptInvite(token, password);
      setSuccessMessage('Your account is ready. You can now sign in.');
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err?.message || 'Failed to accept invitation. Please try again or request a new invite.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-gray-900 px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 border border-gray-200">
        <h1 className="text-2xl font-semibold mb-2 text-gray-900">Accept your invitation</h1>
        <p className="text-gray-600 mb-6">
          Set a password to activate your Legacy Louisiana account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-md px-3 py-2">
              {successMessage}
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-gray-900"
              placeholder="Enter a password"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-gray-900"
              placeholder="Re-enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 mt-2 rounded-lg font-medium text-white transition-all duration-200 hover:opacity-90 disabled:opacity-50"
            style={{ background: 'linear-gradient(90deg, var(--ll-bg-2), var(--ll-bg-1))' }}
          >
            {submitting ? 'Activating…' : 'Activate Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
