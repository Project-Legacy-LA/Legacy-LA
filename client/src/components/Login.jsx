import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { AuthAPI } from '../api/auth';

export default function Login() {
  const cardRef = useRef(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    gsap.fromTo(
      el,
      { autoAlpha: 0, y: 12 },
      { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power1.out', clearProps: 'opacity,visibility' }
    );
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await AuthAPI.login(email, password);
      console.log('Logged in:', res.data.user);
      // TODO: redirect to dashboard or home page
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-black bg-white">
      <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] p-4">
        <div ref={cardRef} className="w-full max-w-sm bg-white rounded-lg p-6 shadow-lg">
          <div className="mb-4">
            <div className="text-xl font-bold text-black">Legacy Louisiana</div>
            <div className="text-xs text-black">Sign in to continue</div>
          </div>

          <form onSubmit={submit} className="space-y-3">
            <div>
              <label className="text-xs text-black block mb-1" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 rounded border border-gray-200 text-black"
                placeholder="you@domain.com"
              />
            </div>

            <div>
              <label className="text-xs text-black block mb-1" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 rounded border border-gray-200 text-black"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 mt-1 rounded font-medium bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>

            {error && <p className="text-xs text-red-600 text-center mt-2">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
