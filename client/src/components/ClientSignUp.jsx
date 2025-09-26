import React, { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'

export default function ClientSignUp() {
  const cardRef = useRef(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    gsap.fromTo(el, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power1.out', clearProps: 'opacity,visibility' })
  }, [])

  const submit = (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert('Passwords do not match')
      return
    }
    setLoading(true)
    // Replace with real signup API call
    setTimeout(() => {
      setLoading(false)
      alert('Client account created (demo).')
    }, 800)
  }

  return (
    <div className="min-h-screen text-black bg-white">
      <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] sm:min-h-[calc(100vh-6rem)] md:min-h-[calc(100vh-7rem)] lg:min-h-[calc(100vh-8rem)] p-4">
      <div ref={cardRef} className="w-full max-w-md bg-white rounded-lg p-6 shadow-lg" style={{ backdropFilter: 'blur(6px)' }}>
        <div className="mb-4">
          <div className="text-xl font-bold text-black">Legacy Louisiana</div>
          <div className="text-xs text-black">Create your client account</div>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-black block mb-1" htmlFor="firstName">First name</label>
              <input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="w-full px-3 py-2 rounded bg-transparent border border-gray-200 outline-none text-black" placeholder="First" />
            </div>

            <div>
              <label className="text-xs text-black block mb-1" htmlFor="lastName">Last name</label>
              <input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required className="w-full px-3 py-2 rounded bg-transparent border border-gray-200 outline-none text-black" placeholder="Last" />
            </div>
          </div>

          <div>
            <label className="text-xs text-black block mb-1" htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 rounded bg-transparent border border-gray-200 outline-none text-black" placeholder="you@domain.com" />
          </div>

          <div>
            <label className="text-xs text-black block mb-1" htmlFor="phone">Phone</label>
            <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 rounded bg-transparent border border-gray-200 outline-none text-black" placeholder="(555) 555-5555" />
          </div>

          <div>
            <label className="text-xs text-black block mb-1" htmlFor="address">Address</label>
            <input id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-3 py-2 rounded bg-transparent border border-gray-200 outline-none text-black" placeholder="123 Main St" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-black block mb-1" htmlFor="password">Password</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2 rounded bg-transparent border border-gray-200 outline-none text-black" placeholder="••••••••" />
            </div>

            <div>
              <label className="text-xs text-black block mb-1" htmlFor="confirmPassword">Confirm</label>
              <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full px-3 py-2 rounded bg-transparent border border-gray-200 outline-none text-black" placeholder="••••••••" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-2 mt-1 rounded font-medium" style={{ background: 'linear-gradient(90deg, var(--ll-bg-2), var(--ll-bg-1))', color: 'white' }}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>

          <p className="text-xs text-black text-center mt-2">
            By creating an account you agree to the terms.
          </p>
        </form>
      </div>
      </div>
    </div>
  )
}