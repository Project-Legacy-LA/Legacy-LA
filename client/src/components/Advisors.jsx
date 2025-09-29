import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'

export default function Advisors() {
  const navigate = useNavigate()
  const pageRef = useRef(null)
  const formRef = useRef(null)
  const headerRef = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline()
    
    // Simple fade-in animation
    tl.fromTo(pageRef.current, 
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: "none" }
    )
  }, [])

  const [advisors, setAdvisors] = useState([
    {
      id: 1,
      firstName: '',
      middleName: '',
      lastName: '',
      suffix: '',
      title: '',
      company: '',
      advisorType: 'financial',
      phone: '',
      email: '',
      address: {
        line1: '',
        line2: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'US'
      },
      notes: ''
    }
  ])

  const addAdvisor = () => {
    const newId = Math.max(...advisors.map(a => a.id)) + 1
    setAdvisors([...advisors, {
      id: newId,
      firstName: '',
      middleName: '',
      lastName: '',
      suffix: '',
      title: '',
      company: '',
      advisorType: 'financial',
      phone: '',
      email: '',
      address: {
        line1: '',
        line2: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'US'
      },
      notes: ''
    }])
  }

  const removeAdvisor = (advisorId) => {
    if (advisors.length > 1) {
      setAdvisors(advisors.filter(a => a.id !== advisorId))
    }
  }

  const handleAdvisorChange = (advisorId, field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setAdvisors(advisors.map(a => 
        a.id === advisorId 
          ? { ...a, [parent]: { ...a[parent], [child]: value } }
          : a
      ))
    } else {
      setAdvisors(advisors.map(a => 
        a.id === advisorId 
          ? { ...a, [field]: value }
          : a
      ))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Advisors form submitted:', advisors)
    // Navigate to next section
    navigate('/assets')
  }

  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 3) {
      return numbers
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`
    } else {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`
    }
  }

  const handlePhoneChange = (advisorId, e) => {
    const formatted = formatPhone(e.target.value)
    handleAdvisorChange(advisorId, 'phone', formatted)
  }

  return (
    <div ref={pageRef} className="min-h-screen text-black bg-white">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div ref={headerRef} className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2" style={{ fontFamily: 'var(--ll-font)' }}>
            Advisors
          </h1>
          <p className="text-gray-600">
            Please provide information about your professional advisors. All fields marked with * are required.
          </p>
        </div>

        {/* Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          {advisors.map((advisor, index) => (
            <div key={advisor.id} className="mb-8 p-6 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Advisor {index + 1}
                </h3>
                {advisors.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAdvisor(advisor.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Remove Advisor
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={advisor.firstName}
                      onChange={(e) => handleAdvisorChange(advisor.id, 'firstName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    />
                  </div>

                  {/* Middle Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Middle Name
                    </label>
                    <input
                      type="text"
                      value={advisor.middleName}
                      onChange={(e) => handleAdvisorChange(advisor.id, 'middleName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={advisor.lastName}
                      onChange={(e) => handleAdvisorChange(advisor.id, 'lastName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    />
                  </div>

                  {/* Suffix */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Suffix
                    </label>
                    <input
                      type="text"
                      value={advisor.suffix}
                      onChange={(e) => handleAdvisorChange(advisor.id, 'suffix', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                      placeholder="Jr., Sr., II, III, etc."
                    />
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Professional Title
                    </label>
                    <input
                      type="text"
                      value={advisor.title}
                      onChange={(e) => handleAdvisorChange(advisor.id, 'title', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                      placeholder="e.g., CPA, CFP, Attorney"
                    />
                  </div>

                  {/* Company */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company/Organization
                    </label>
                    <input
                      type="text"
                      value={advisor.company}
                      onChange={(e) => handleAdvisorChange(advisor.id, 'company', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                      placeholder="Company or organization name"
                    />
                  </div>

                  {/* Advisor Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Advisor Type *
                    </label>
                    <select
                      value={advisor.advisorType}
                      onChange={(e) => handleAdvisorChange(advisor.id, 'advisorType', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    >
                      <option value="financial">Financial Advisor</option>
                      <option value="accountant">Accountant/CPA</option>
                      <option value="insurance">Insurance Agent</option>
                      <option value="real_estate">Real Estate Agent</option>
                      <option value="business">Business Advisor</option>
                      <option value="investment">Investment Advisor</option>
                      <option value="tax">Tax Advisor</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={advisor.phone}
                      onChange={(e) => handlePhoneChange(advisor.id, e)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={advisor.email}
                      onChange={(e) => handleAdvisorChange(advisor.id, 'email', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                      placeholder="advisor@company.com"
                    />
                  </div>

                  {/* Address Section */}
                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-700">Business Address</h4>
                    
                    {/* Address Line 1 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address Line 1
                      </label>
                      <input
                        type="text"
                        value={advisor.address.line1}
                        onChange={(e) => handleAdvisorChange(advisor.id, 'address.line1', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                        placeholder="Street address"
                      />
                    </div>

                    {/* Address Line 2 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address Line 2
                      </label>
                      <input
                        type="text"
                        value={advisor.address.line2}
                        onChange={(e) => handleAdvisorChange(advisor.id, 'address.line2', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                        placeholder="Suite, floor, etc."
                      />
                    </div>

                    {/* City, State, ZIP */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          value={advisor.address.city}
                          onChange={(e) => handleAdvisorChange(advisor.id, 'address.city', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State
                        </label>
                        <input
                          type="text"
                          value={advisor.address.state}
                          onChange={(e) => handleAdvisorChange(advisor.id, 'address.state', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        value={advisor.address.zipCode}
                        onChange={(e) => handleAdvisorChange(advisor.id, 'address.zipCode', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                        placeholder="70112"
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={advisor.notes}
                      onChange={(e) => handleAdvisorChange(advisor.id, 'notes', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                      rows="3"
                      placeholder="Any additional information about this advisor or your relationship..."
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Add Advisor Button */}
          <div className="mb-8">
            <button
              type="button"
              onClick={addAdvisor}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              + Add Another Advisor
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
              style={{ background: 'linear-gradient(90deg, var(--ll-bg-2), var(--ll-bg-1))' }}
            >
              Continue
            </button>
          </div>
        </form>

        {/* Security Footer */}
        <div className="mt-8 text-center">
          <div className="py-4 px-6 rounded-lg" style={{ background: 'linear-gradient(90deg, var(--ll-bg-2), var(--ll-bg-1))', color: 'white' }}>
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">All data transmitted & stored securely encrypted. Learn more about our security.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
