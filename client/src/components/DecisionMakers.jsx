import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'

export default function DecisionMakers() {
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

  const [decisionMakers, setDecisionMakers] = useState([
    {
      id: 1,
      firstName: '',
      middleName: '',
      lastName: '',
      suffix: '',
      role: 'executor',
      relationship: '',
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
      isPrimary: true,
      isAlternate: false,
      notes: ''
    }
  ])

  const addDecisionMaker = () => {
    const newId = Math.max(...decisionMakers.map(d => d.id)) + 1
    setDecisionMakers([...decisionMakers, {
      id: newId,
      firstName: '',
      middleName: '',
      lastName: '',
      suffix: '',
      role: 'executor',
      relationship: '',
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
      isPrimary: false,
      isAlternate: true,
      notes: ''
    }])
  }

  const removeDecisionMaker = (decisionMakerId) => {
    if (decisionMakers.length > 1) {
      setDecisionMakers(decisionMakers.filter(d => d.id !== decisionMakerId))
    }
  }

  const handleDecisionMakerChange = (decisionMakerId, field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setDecisionMakers(decisionMakers.map(d => 
        d.id === decisionMakerId 
          ? { ...d, [parent]: { ...d[parent], [child]: value } }
          : d
      ))
    } else {
      setDecisionMakers(decisionMakers.map(d => 
        d.id === decisionMakerId 
          ? { ...d, [field]: value }
          : d
      ))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Decision makers form submitted:', decisionMakers)
    // Navigate to next section
    navigate('/contact-details')
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

  const handlePhoneChange = (decisionMakerId, e) => {
    const formatted = formatPhone(e.target.value)
    handleDecisionMakerChange(decisionMakerId, 'phone', formatted)
  }

  return (
    <div ref={pageRef} className="min-h-screen text-black bg-white">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div ref={headerRef} className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2" style={{ fontFamily: 'var(--ll-font)' }}>
            Decision Makers
          </h1>
          <p className="text-gray-600">
            Please provide information about individuals who will make important decisions on your behalf. All fields marked with * are required.
          </p>
        </div>

        {/* Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          {decisionMakers.map((decisionMaker, index) => (
            <div key={decisionMaker.id} className="mb-8 p-6 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Decision Maker {index + 1}
                </h3>
                {decisionMakers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDecisionMaker(decisionMaker.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Remove Decision Maker
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
                      value={decisionMaker.firstName}
                      onChange={(e) => handleDecisionMakerChange(decisionMaker.id, 'firstName', e.target.value)}
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
                      value={decisionMaker.middleName}
                      onChange={(e) => handleDecisionMakerChange(decisionMaker.id, 'middleName', e.target.value)}
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
                      value={decisionMaker.lastName}
                      onChange={(e) => handleDecisionMakerChange(decisionMaker.id, 'lastName', e.target.value)}
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
                      value={decisionMaker.suffix}
                      onChange={(e) => handleDecisionMakerChange(decisionMaker.id, 'suffix', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                      placeholder="Jr., Sr., II, III, etc."
                    />
                  </div>

                  {/* Role */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role *
                    </label>
                    <select
                      value={decisionMaker.role}
                      onChange={(e) => handleDecisionMakerChange(decisionMaker.id, 'role', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    >
                      <option value="executor">Executor</option>
                      <option value="guardian">Guardian</option>
                      <option value="trustee">Trustee</option>
                      <option value="power_of_attorney">Power of Attorney</option>
                      <option value="healthcare_proxy">Healthcare Proxy</option>
                      <option value="conservator">Conservator</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Relationship */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Relationship *
                    </label>
                    <select
                      value={decisionMaker.relationship}
                      onChange={(e) => handleDecisionMakerChange(decisionMaker.id, 'relationship', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    >
                      <option value="">Select relationship...</option>
                      <option value="spouse">Spouse</option>
                      <option value="child">Child</option>
                      <option value="parent">Parent</option>
                      <option value="sibling">Sibling</option>
                      <option value="friend">Friend</option>
                      <option value="attorney">Attorney</option>
                      <option value="professional">Professional</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Primary/Alternate Selection */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Designation
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name={`designation-${decisionMaker.id}`}
                          value="primary"
                          checked={decisionMaker.isPrimary}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleDecisionMakerChange(decisionMaker.id, 'isPrimary', true)
                              handleDecisionMakerChange(decisionMaker.id, 'isAlternate', false)
                            }
                          }}
                          className="mr-2 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Primary</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name={`designation-${decisionMaker.id}`}
                          value="alternate"
                          checked={decisionMaker.isAlternate}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleDecisionMakerChange(decisionMaker.id, 'isPrimary', false)
                              handleDecisionMakerChange(decisionMaker.id, 'isAlternate', true)
                            }
                          }}
                          className="mr-2 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Alternate</span>
                      </label>
                    </div>
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
                      value={decisionMaker.phone}
                      onChange={(e) => handlePhoneChange(decisionMaker.id, e)}
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
                      value={decisionMaker.email}
                      onChange={(e) => handleDecisionMakerChange(decisionMaker.id, 'email', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                      placeholder="decisionmaker@example.com"
                    />
                  </div>

                  {/* Address Section */}
                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-700">Address</h4>
                    
                    {/* Address Line 1 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address Line 1
                      </label>
                      <input
                        type="text"
                        value={decisionMaker.address.line1}
                        onChange={(e) => handleDecisionMakerChange(decisionMaker.id, 'address.line1', e.target.value)}
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
                        value={decisionMaker.address.line2}
                        onChange={(e) => handleDecisionMakerChange(decisionMaker.id, 'address.line2', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                        placeholder="Apartment, suite, etc."
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
                          value={decisionMaker.address.city}
                          onChange={(e) => handleDecisionMakerChange(decisionMaker.id, 'address.city', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State
                        </label>
                        <input
                          type="text"
                          value={decisionMaker.address.state}
                          onChange={(e) => handleDecisionMakerChange(decisionMaker.id, 'address.state', e.target.value)}
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
                        value={decisionMaker.address.zipCode}
                        onChange={(e) => handleDecisionMakerChange(decisionMaker.id, 'address.zipCode', e.target.value)}
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
                      value={decisionMaker.notes}
                      onChange={(e) => handleDecisionMakerChange(decisionMaker.id, 'notes', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                      rows="3"
                      placeholder="Any additional information about this decision maker or special instructions..."
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Add Decision Maker Button */}
          <div className="mb-8">
            <button
              type="button"
              onClick={addDecisionMaker}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              + Add Another Decision Maker
            </button>
          </div>

          {/* Information Box */}
          <div className="mb-8 p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Important Information</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Executors are responsible for carrying out the terms of your will</li>
              <li>• Guardians make decisions about the care of minor children</li>
              <li>• Trustees manage assets held in trust</li>
              <li>• Power of Attorney allows someone to make financial decisions on your behalf</li>
              <li>• Healthcare Proxy makes medical decisions when you cannot</li>
            </ul>
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
