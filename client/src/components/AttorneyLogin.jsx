import React, { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'

export default function AttorneyLogin() {
  const cardRef = useRef(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    gsap.fromTo(el, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power1.out', clearProps: 'opacity,visibility' })
  }, [])

  const submit = (e) => {
    e.preventDefault()
    setLoading(true)
    // Replace with real login call
    setTimeout(() => {
      setLoading(false)
      alert('Attorney signed in (demo).')
    }, 700)
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 text-black">
      <div ref={cardRef} className="w-full max-w-sm bg-white rounded-lg p-6 shadow-lg" style={{ backdropFilter: 'blur(6px)' }}>
        <div className="mb-4">
          <div className="text-xl font-bold text-black">Legacy Louisiana — Attorney Login</div>
          <div className="text-xs text-black">Sign in with your attorney account</div>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="text-xs text-black block mb-1" htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 rounded bg-transparent border border-gray-200 outline-none text-black" placeholder="you@lawfirm.com" />
          </div>

          <div>
            <label className="text-xs text-black block mb-1" htmlFor="password">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2 rounded bg-transparent border border-gray-200 outline-none text-black" placeholder="••••••••" />
          </div>

          <button type="submit" disabled={loading} className="w-full py-2 mt-1 rounded font-medium" style={{ background: 'linear-gradient(90deg, var(--ll-bg-2), var(--ll-bg-1))', color: 'white' }}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>

          <p className="text-xs text-black text-center mt-2">
            Need an attorney account? Contact support or register.
          </p>
        </form>
      </div>
    </div>
  )
}