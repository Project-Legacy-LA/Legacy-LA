import React, { useState } from 'react';
import { AuthAPI } from '../api/auth';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await AuthAPI.register(email, password);
      setSuccess('Account created! You can now log in.');
      console.log('Registered:', res.data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black">
      <div className="w-full max-w-sm bg-white rounded-lg p-6 shadow-lg">
        <h1 className="text-xl font-bold mb-4">Sign Up</h1>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="text-xs block mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-200 rounded text-black"
            />
          </div>
          <div>
            <label className="text-xs block mb-1" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-200 rounded text-black"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 mt-1 rounded font-medium bg-gradient-to-r from-green-500 to-emerald-500 text-white"
          >
            {loading ? 'Creating...' : 'Sign Up'}
          </button>
          {error && <p className="text-xs text-red-600 text-center mt-2">{error}</p>}
          {success && <p className="text-xs text-green-600 text-center mt-2">{success}</p>}
        </form>
      </div>
    </div>
  );
}
