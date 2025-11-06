// Clean login interface with smooth animations
import React, { useRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const cardRef = useRef(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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
    e.preventDefault()
    if (loading) return
    setLoading(true)
    setError('')

    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      const message = err?.message || 'Unable to sign in. Please try again.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen text-black bg-white">
      {/* use the site's default gray background utility from index.css; ensure text is black */}
      <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] sm:min-h-[calc(100vh-6rem)] md:min-h-[calc(100vh-7rem)] lg:min-h-[calc(100vh-8rem)] p-4">
      <div
        ref={cardRef}
        className="w-full max-w-sm bg-white rounded-lg p-6 shadow-lg"
        style={{ backdropFilter: 'blur(6px)' }}
      >
        {/* Branding */}
        <div className="mb-6 text-center">
          <div className="text-2xl font-bold text-gray-900">Legacy Louisiana</div>
          <div className="text-sm text-gray-600 mt-1">Log in to continue</div>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="space-y-4">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-gray-900"
              placeholder="example@domain.com"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-gray-900"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-4 rounded-lg font-medium text-white transition-all duration-200 hover:opacity-90 disabled:opacity-50"
            style={{
              background: 'linear-gradient(90deg, var(--ll-bg-2), var(--ll-bg-1))'
            }}
          >
            {loading ? 'Signing in…' : 'Log in'}
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            By signing in you agree to all the terms and conditions, privacy policy, and user agreement.
          </p>
          
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              ← Back to Home
            </button>
          </div>
        </form>
      </div>
      </div>
    </div>
  );
}
