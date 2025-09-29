import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'

export default function Beneficiaries() {
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

  const [beneficiaries, setBeneficiaries] = useState([
    {
      id: 1,
      assetId: null,
      tier: 'primary',
      partyType: 'person', // 'person' or 'trust'
      personId: null,
      trustId: null,
      percent: '',
      perStirpes: false,
      effectiveDate: '',
      verificationStatus: 'draft'
    }
  ])

  const [beneficiaryPersons, setBeneficiaryPersons] = useState([
    {
      id: 1,
      firstName: '',
      middleName: '',
      lastName: '',
      suffix: '',
      relationship: '',
      dateOfBirth: { month: '', day: '', year: '' },
      ssn: '',
      address: {
        line1: '',
        line2: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'US'
      },
      contactInfo: {
        phone: '',
        email: ''
      }
    }
  ])

  const addBeneficiary = () => {
    const newId = Math.max(...beneficiaries.map(b => b.id)) + 1
    setBeneficiaries([...beneficiaries, {
      id: newId,
      assetId: null,
      tier: 'primary',
      partyType: 'person',
      personId: null,
      trustId: null,
      percent: '',
      perStirpes: false,
      effectiveDate: '',
      verificationStatus: 'draft'
    }])
  }

  const addBeneficiaryPerson = () => {
    const newId = Math.max(...beneficiaryPersons.map(p => p.id)) + 1
    setBeneficiaryPersons([...beneficiaryPersons, {
      id: newId,
      firstName: '',
      middleName: '',
      lastName: '',
      suffix: '',
      relationship: '',
      dateOfBirth: { month: '', day: '', year: '' },
      ssn: '',
      address: {
        line1: '',
        line2: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'US'
      },
      contactInfo: {
        phone: '',
        email: ''
      }
    }])
  }

  const removeBeneficiary = (beneficiaryId) => {
    if (beneficiaries.length > 1) {
      setBeneficiaries(beneficiaries.filter(b => b.id !== beneficiaryId))
    }
  }

  const removeBeneficiaryPerson = (personId) => {
    if (beneficiaryPersons.length > 1) {
      setBeneficiaryPersons(beneficiaryPersons.filter(p => p.id !== personId))
    }
  }

  const handleBeneficiaryChange = (beneficiaryId, field, value) => {
    setBeneficiaries(beneficiaries.map(b => 
      b.id === beneficiaryId 
        ? { ...b, [field]: value }
        : b
    ))
  }

  const handlePersonChange = (personId, field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setBeneficiaryPersons(beneficiaryPersons.map(p => 
        p.id === personId 
          ? { ...p, [parent]: { ...p[parent], [child]: value } }
          : p
      ))
    } else {
      setBeneficiaryPersons(beneficiaryPersons.map(p => 
        p.id === personId 
          ? { ...p, [field]: value }
          : p
      ))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Beneficiaries form submitted:', { beneficiaries, beneficiaryPersons })
    // Navigate to next section
    navigate('/decisionmakers')
  }

  const formatSSN = (value) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 3) {
      return numbers
    } else if (numbers.length <= 5) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 5)}-${numbers.slice(5, 9)}`
    }
  }

  const handleSSNChange = (personId, e) => {
    const formatted = formatSSN(e.target.value)
    handlePersonChange(personId, 'ssn', formatted)
  }

  return (
    <div ref={pageRef} className="min-h-screen text-black bg-white">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div ref={headerRef} className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2" style={{ fontFamily: 'var(--ll-font)' }}>
            Beneficiaries
          </h1>
          <p className="text-gray-600">
            Please provide information about your beneficiaries. All fields marked with * are required.
          </p>
        </div>

        {/* Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          {/* Beneficiary Persons Section */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Beneficiary Information</h2>
              <button
                type="button"
                onClick={addBeneficiaryPerson}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
              >
                + Add Beneficiary
              </button>
            </div>

            {beneficiaryPersons.map((person, index) => (
              <div key={person.id} className="mb-8 p-6 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Beneficiary {index + 1}
                  </h3>
                  {beneficiaryPersons.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeBeneficiaryPerson(person.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Remove
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
                        value={person.firstName}
                        onChange={(e) => handlePersonChange(person.id, 'firstName', e.target.value)}
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
                        value={person.middleName}
                        onChange={(e) => handlePersonChange(person.id, 'middleName', e.target.value)}
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
                        value={person.lastName}
                        onChange={(e) => handlePersonChange(person.id, 'lastName', e.target.value)}
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
                        value={person.suffix}
                        onChange={(e) => handlePersonChange(person.id, 'suffix', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                        placeholder="Jr., Sr., II, III, etc."
                      />
                    </div>

                    {/* Relationship */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Relationship *
                      </label>
                      <select
                        value={person.relationship}
                        onChange={(e) => handlePersonChange(person.id, 'relationship', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                      >
                        <option value="">Select relationship...</option>
                        <option value="spouse">Spouse</option>
                        <option value="child">Child</option>
                        <option value="parent">Parent</option>
                        <option value="sibling">Sibling</option>
                        <option value="grandchild">Grandchild</option>
                        <option value="grandparent">Grandparent</option>
                        <option value="niece_nephew">Niece/Nephew</option>
                        <option value="aunt_uncle">Aunt/Uncle</option>
                        <option value="cousin">Cousin</option>
                        <option value="friend">Friend</option>
                        <option value="charity">Charity</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date of Birth
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Month</label>
                          <input
                            type="number"
                            value={person.dateOfBirth.month}
                            onChange={(e) => handlePersonChange(person.id, 'dateOfBirth.month', e.target.value)}
                            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Day</label>
                          <input
                            type="number"
                            value={person.dateOfBirth.day}
                            onChange={(e) => handlePersonChange(person.id, 'dateOfBirth.day', e.target.value)}
                            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Year</label>
                          <input
                            type="number"
                            value={person.dateOfBirth.year}
                            onChange={(e) => handlePersonChange(person.id, 'dateOfBirth.year', e.target.value)}
                            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                          />
                        </div>
                      </div>
                    </div>

                    {/* SSN */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Social Security Number
                      </label>
                      <input
                        type="text"
                        value={person.ssn}
                        onChange={(e) => handleSSNChange(person.id, e)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                        placeholder="XXX-XX-XXXX"
                        maxLength="11"
                      />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    {/* Address Line 1 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address Line 1
                      </label>
                      <input
                        type="text"
                        value={person.address.line1}
                        onChange={(e) => handlePersonChange(person.id, 'address.line1', e.target.value)}
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
                        value={person.address.line2}
                        onChange={(e) => handlePersonChange(person.id, 'address.line2', e.target.value)}
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
                          value={person.address.city}
                          onChange={(e) => handlePersonChange(person.id, 'address.city', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State
                        </label>
                        <input
                          type="text"
                          value={person.address.state}
                          onChange={(e) => handlePersonChange(person.id, 'address.state', e.target.value)}
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
                        value={person.address.zipCode}
                        onChange={(e) => handlePersonChange(person.id, 'address.zipCode', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                        placeholder="70112"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={person.contactInfo.phone}
                        onChange={(e) => handlePersonChange(person.id, 'contactInfo.phone', e.target.value)}
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
                        value={person.contactInfo.email}
                        onChange={(e) => handlePersonChange(person.id, 'contactInfo.email', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                        placeholder="beneficiary@example.com"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Beneficiary Designations Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Beneficiary Designations</h2>
            <p className="text-gray-600 mb-6">
              Specify which assets each beneficiary should receive and in what percentage.
            </p>

            {beneficiaries.map((beneficiary, index) => (
              <div key={beneficiary.id} className="mb-6 p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Designation {index + 1}
                  </h3>
                  {beneficiaries.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeBeneficiary(beneficiary.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Asset Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Asset
                    </label>
                    <select
                      value={beneficiary.assetId || ''}
                      onChange={(e) => handleBeneficiaryChange(beneficiary.id, 'assetId', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    >
                      <option value="">Select asset...</option>
                      <option value="1">Primary Residence</option>
                      <option value="2">401(k) Account</option>
                      <option value="3">Savings Account</option>
                      {/* Add more assets as needed */}
                    </select>
                  </div>

                  {/* Beneficiary Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Beneficiary
                    </label>
                    <select
                      value={beneficiary.personId || ''}
                      onChange={(e) => handleBeneficiaryChange(beneficiary.id, 'personId', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    >
                      <option value="">Select beneficiary...</option>
                      {beneficiaryPersons.map(person => (
                        <option key={person.id} value={person.id}>
                          {person.firstName} {person.lastName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Tier */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tier
                    </label>
                    <select
                      value={beneficiary.tier}
                      onChange={(e) => handleBeneficiaryChange(beneficiary.id, 'tier', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    >
                      <option value="primary">Primary</option>
                      <option value="contingent">Contingent</option>
                    </select>
                  </div>

                  {/* Percentage */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Percentage *
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        value={beneficiary.percent}
                        onChange={(e) => handleBeneficiaryChange(beneficiary.id, 'percent', e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                      />
                      <span className="flex items-center px-3 py-3 bg-gray-100 border border-gray-300 rounded-r-lg text-gray-700">
                        %
                      </span>
                    </div>
                  </div>

                  {/* Per Stirpes */}
                  <div className="lg:col-span-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={beneficiary.perStirpes}
                        onChange={(e) => handleBeneficiaryChange(beneficiary.id, 'perStirpes', e.target.checked)}
                        className="mr-2 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Per Stirpes (inheritance by representation)</span>
                    </label>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addBeneficiary}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
            >
              + Add Another Designation
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
