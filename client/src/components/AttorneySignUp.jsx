import React, { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'

export default function AttorneySignUp() {
  const cardRef = useRef(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [barNumber, setBarNumber] = useState('')
  const [barState, setBarState] = useState('')
  const [firm, setFirm] = useState('')
  const [phone, setPhone] = useState('')
  const [practiceAreas, setPracticeAreas] = useState('')
  const [yearsExperience, setYearsExperience] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    gsap.fromTo(el, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power1.out', clearProps: 'opacity,visibility' })
  }, [])

  const submit = (e) => {
    e.preventDefault()
    setLoading(true)
    // Replace with real signup + verification flow
    setTimeout(() => {
      setLoading(false)
      alert('Attorney account submitted (demo). You may need verification before active access.')
    }, 900)
  }

  return (
    <div className="min-h-screen text-black bg-white">
      <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] sm:min-h-[calc(100vh-6rem)] md:min-h-[calc(100vh-7rem)] lg:min-h-[calc(100vh-8rem)] p-4">
      <div ref={cardRef} className="w-full max-w-md bg-white rounded-lg p-6 shadow-lg" style={{ backdropFilter: 'blur(6px)' }}>
        <div className="mb-4">
          <div className="text-xl font-bold text-black">Legacy Louisiana — Attorneys</div>
          <div className="text-xs text-black">Create an attorney account</div>
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
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 rounded bg-transparent border border-gray-200 outline-none text-black" placeholder="you@lawfirm.com" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-black block mb-1" htmlFor="barNumber">Bar number</label>
              <input id="barNumber" value={barNumber} onChange={(e) => setBarNumber(e.target.value)} required className="w-full px-3 py-2 rounded bg-transparent border border-gray-200 outline-none text-black" placeholder="123456" />
            </div>

            <div>
              <label className="text-xs text-black block mb-1" htmlFor="barState">Bar state</label>
              <input id="barState" value={barState} onChange={(e) => setBarState(e.target.value)} required className="w-full px-3 py-2 rounded bg-transparent border border-gray-200 outline-none text-black" placeholder="LA" />
            </div>
          </div>

          <div>
            <label className="text-xs text-black block mb-1" htmlFor="firm">Firm</label>
            <input id="firm" value={firm} onChange={(e) => setFirm(e.target.value)} className="w-full px-3 py-2 rounded bg-transparent border border-gray-200 outline-none text-black" placeholder="Firm name" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-black block mb-1" htmlFor="phone">Phone</label>
              <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 rounded bg-transparent border border-gray-200 outline-none text-black" placeholder="(555) 555-5555" />
            </div>

            <div>
              <label className="text-xs text-black block mb-1" htmlFor="yearsExperience">Years exp.</label>
              <input id="yearsExperience" type="number" min="0" value={yearsExperience} onChange={(e) => setYearsExperience(e.target.value)} className="w-full px-3 py-2 rounded bg-transparent border border-gray-200 outline-none text-black" placeholder="5" />
            </div>
          </div>

          <div>
            <label className="text-xs text-black block mb-1" htmlFor="practiceAreas">Practice areas</label>
            <input id="practiceAreas" value={practiceAreas} onChange={(e) => setPracticeAreas(e.target.value)} className="w-full px-3 py-2 rounded bg-transparent border border-gray-200 outline-none text-black" placeholder="e.g. Family, Estate, Criminal (comma-separated)" />
          </div>

          <div>
            <label className="text-xs text-black block mb-1" htmlFor="password">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2 rounded bg-transparent border border-gray-200 outline-none text-black" placeholder="••••••••" />
          </div>

          <button type="submit" disabled={loading} className="w-full py-2 mt-1 rounded font-medium" style={{ background: 'linear-gradient(90deg, var(--ll-bg-2), var(--ll-bg-1))', color: 'white' }}>
            {loading ? 'Submitting…' : 'Create attorney account'}
          </button>

          <p className="text-xs text-black text-center mt-2">
            Attorney accounts may require verification before access is granted.
          </p>
        </form>
      </div>
      </div>
    </div>
  )
}