import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'

export default function SuccessionConcerns() {
  const navigate = useNavigate()
  const pageRef = useRef(null)
  const formRef = useRef(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    const tl = gsap.timeline()
    tl.fromTo(pageRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "none" })
  }, [])

  const [concerns, setConcerns] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Succession Concerns submitted:', concerns)
    // Navigate back to Succession home page
    navigate('/succession')
  }

  return (
    <div ref={pageRef} className="min-h-screen text-black bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2" style={{ fontFamily: 'var(--ll-font)' }}>
            Succession - Concerns
          </h1>
          <p className="text-gray-600">
            Please list/describe any concerns you have at this time (e.g., heirs that do not get along, etc.)
          </p>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <div className="mb-8">
            <label className="block text-lg font-bold text-gray-800 mb-3">
              Concerns *
            </label>
            <textarea
              value={concerns}
              onChange={(e) => setConcerns(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              rows="10"
              placeholder="Please describe any concerns you have regarding the succession process..."
              required
            />
          </div>

          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/succession/co-executor-access')}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium"
            >
              Back to Co-Executor Access
            </button>
            <button
              type="submit"
              className="px-8 py-3 text-white rounded-lg transition-colors duration-200 font-medium"
              style={{ background: 'linear-gradient(90deg, var(--ll-bg-2), var(--ll-bg-1))' }}
            >
              Complete Questionnaire
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

