// Simple, minimal login page using Tailwind + small GSAP entrance animation
import React, { useRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'

export default function Login() {
  const navigate = useNavigate()
  const cardRef = useRef(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return

    gsap.fromTo(
      el,
      { autoAlpha: 0, y: 12 },
      {
        autoAlpha: 1, y: 0, duration: 0.45, ease: 'power1.out',
        clearProps: 'opacity,visibility'
      }
    )
  }, [])

  const submit = (e) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate login process
    setTimeout(() => {
      setLoading(false)
      // For demo purposes, navigate to home page after "successful" login
      // In a real app, you would validate credentials first
      navigate('/')
    }, 1000)
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
          <div className="text-sm text-gray-600 mt-1">Sign in to continue</div>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-gray-900"
              placeholder="you@domain.com"
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
            {loading ? 'Signing in…' : 'Sign in'}
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
  )
}