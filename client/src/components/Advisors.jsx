import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { usePeople } from '../contexts/PeopleContext'

export default function Advisors() {
  const navigate = useNavigate()
  const pageRef = useRef(null)
  const formRef = useRef(null)
  const headerRef = useRef(null)
  const { people, getPersonDisplayName, getPeopleOptions, addPerson } = usePeople()

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0)
    
    const tl = gsap.timeline()
    
    // Page entrance animation
    tl.fromTo(pageRef.current, 
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: "none" }
    )
  }, [])

  const [advisors, setAdvisors] = useState([
    {
      id: 1,
      personId: null, // Links to people array
      advisorType: 'attorney',
      firmName: '',
      specializations: [],
      yearsOfExperience: '',
      notes: ''
    }
  ])

  const [showNewPersonForm, setShowNewPersonForm] = useState(null)
  const [newPersonData, setNewPersonData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    preferredName: '',
    ssn: '',
    dateOfBirth: { month: '', day: '', year: '' },
    birthCountry: '',
    birthState: '',
    birthCity: '',
    phone: '',
    email: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US'
    }
  })

  const advisorTypes = [
    { value: 'accountant', label: 'Accountant' },
    { value: 'attorney', label: 'Attorney' },
    { value: 'banker', label: 'Banker' },
    { value: 'financial_advisor', label: 'Financial Advisor' },
    { value: 'insurance_agent', label: 'Insurance Agent' },
    { value: 'real_estate_agent', label: 'Real Estate Agent' },
    { value: 'tax_preparer', label: 'Tax Preparer' },
    { value: 'other', label: 'Other' }
  ]

  const specializations = [
    { value: 'business_law', label: 'Business Law' },
    { value: 'estate_planning', label: 'Estate Planning' },
    { value: 'family_law', label: 'Family Law' },
    { value: 'insurance_planning', label: 'Insurance Planning' },
    { value: 'investment_planning', label: 'Investment Planning' },
    { value: 'real_estate_law', label: 'Real Estate Law' },
    { value: 'retirement_planning', label: 'Retirement Planning' },
    { value: 'tax_law', label: 'Tax Law' },
    { value: 'tax_preparation', label: 'Tax Preparation' },
    { value: 'other', label: 'Other' }
  ]

  const addAdvisor = () => {
    const newId = Math.max(...advisors.map(a => a.id)) + 1
    setAdvisors([...advisors, {
      id: newId,
      personId: null,
      advisorType: 'attorney',
      firmName: '',
      specializations: [],
      yearsOfExperience: '',
      notes: ''
    }])
  }

  const handleAdvisorChange = (advisorId, field, value) => {
    if (field === 'specializations') {
      setAdvisors(advisors.map(a => 
        a.id === advisorId 
          ? { ...a, [field]: value }
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

  const handlePersonSelection = (advisorId, value) => {
    if (value === 'other') {
      setShowNewPersonForm(advisorId)
    } else {
      setShowNewPersonForm(null)
      handleAdvisorChange(advisorId, 'personId', parseInt(value) || null)
    }
  }

  const handleNewPersonChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setNewPersonData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setNewPersonData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const saveNewPerson = (advisorId) => {
    if (newPersonData.firstName || newPersonData.lastName) {
      const newPersonId = addPerson({
        firstName: newPersonData.firstName,
        middleName: newPersonData.middleName,
        lastName: newPersonData.lastName,
        suffix: newPersonData.suffix,
        preferredName: newPersonData.preferredName,
        ssn: newPersonData.ssn,
        dateOfBirth: newPersonData.dateOfBirth,
        birthCountry: newPersonData.birthCountry,
        birthState: newPersonData.birthState,
        birthCity: newPersonData.birthCity,
        contactInfo: {
          phone: newPersonData.phone,
          email: newPersonData.email,
          address: newPersonData.address
        },
        roles: ['advisor']
      })

      handleAdvisorChange(advisorId, 'personId', newPersonId)
      setShowNewPersonForm(null)
      setNewPersonData({
        firstName: '',
        middleName: '',
        lastName: '',
        suffix: '',
        preferredName: '',
        ssn: '',
        dateOfBirth: { month: '', day: '', year: '' },
        birthCountry: '',
        birthState: '',
        birthCity: '',
        phone: '',
        email: '',
        address: {
          line1: '',
          line2: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'US'
        }
      })
    }
  }

  const cancelNewPerson = () => {
    setShowNewPersonForm(null)
    setNewPersonData({
      firstName: '',
      middleName: '',
      lastName: '',
      suffix: '',
      preferredName: '',
      ssn: '',
      dateOfBirth: { month: '', day: '', year: '' },
      birthCountry: '',
      birthState: '',
      birthCity: '',
      phone: '',
      email: '',
      address: {
        line1: '',
        line2: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'US'
      }
    })
  }

  const handleSpecializationChange = (advisorId, specialization, isChecked) => {
    setAdvisors(advisors.map(a => {
      if (a.id === advisorId) {
        if (isChecked) {
          return { ...a, specializations: [...a.specializations, specialization] }
        } else {
          return { ...a, specializations: a.specializations.filter(s => s !== specialization) }
        }
      }
      return a
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate advisor person references
    advisors.forEach(advisor => {
      if (advisor.personId && !people.find(p => p.id === advisor.personId)) {
        console.warn('Advisor person not found in people context')
      }
    })

    console.log('Advisors submitted:', advisors)
    // Navigate to next section or summary
    navigate('/documents')
  }

  return (
    <div ref={pageRef} className="min-h-screen text-black bg-white">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div ref={headerRef} className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2" style={{ fontFamily: 'var(--ll-font)' }}>
            Other Professionals & Advisors
          </h1>
          <p className="text-gray-600">
            Add your professionals who may help with your estate planning.
          </p>
        </div>

        {/* Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          
          <div className="space-y-6">
            {advisors.map((advisor, index) => (
              <div key={advisor.id} className="p-6 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Advisor {index + 1}
                  </h3>
                  {advisors.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setAdvisors(advisors.filter(a => a.id !== advisor.id))}
                      className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                    >
                      Remove Advisor
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Advisor Type *
                    </label>
                    <select
                      value={advisor.advisorType}
                      onChange={(e) => handleAdvisorChange(advisor.id, 'advisorType', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    >
                      {advisorTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Person (from About You)
                    </label>
                    <select
                      value={advisor.personId || ''}
                      onChange={(e) => handlePersonSelection(advisor.id, e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    >
                      <option value="">Select person...</option>
                      {getPeopleOptions().map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                      <option value="other">Other (Add new person)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Firm/Company Name
                    </label>
                    <input
                      type="text"
                      value={advisor.firmName}
                      onChange={(e) => handleAdvisorChange(advisor.id, 'firmName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                      placeholder="Law firm, financial company, etc."
                    />
                  </div>
                  
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      value={advisor.yearsOfExperience}
                      onChange={(e) => handleAdvisorChange(advisor.id, 'yearsOfExperience', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                      placeholder="Years"
                      min="0"
                      max="50"
                    />
                  </div>
                </div>

                {/* Specializations */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specializations
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {specializations.map(spec => (
                      <label key={spec.value} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={advisor.specializations.includes(spec.value)}
                          onChange={(e) => handleSpecializationChange(advisor.id, spec.value, e.target.checked)}
                          className="mr-2 text-gray-600 focus:ring-gray-500"
                        />
                        <span className="text-sm text-gray-700">{spec.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* New Person Form for Advisors */}
                {showNewPersonForm === advisor.id && (
                  <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Add New Person</h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          value={newPersonData.firstName}
                          onChange={(e) => handleNewPersonChange('firstName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                          placeholder="First name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          value={newPersonData.lastName}
                          onChange={(e) => handleNewPersonChange('lastName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                          placeholder="Last name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Middle Name
                        </label>
                        <input
                          type="text"
                          value={newPersonData.middleName}
                          onChange={(e) => handleNewPersonChange('middleName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                          placeholder="Middle name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Preferred Name
                        </label>
                        <input
                          type="text"
                          value={newPersonData.preferredName}
                          onChange={(e) => handleNewPersonChange('preferredName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                          placeholder="Preferred name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={newPersonData.phone}
                          onChange={(e) => handleNewPersonChange('phone', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                          placeholder="(555) 123-4567"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={newPersonData.email}
                          onChange={(e) => handleNewPersonChange('email', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                          placeholder="email@example.com"
                        />
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={cancelNewPerson}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => saveNewPerson(advisor.id)}
                        className="px-6 py-2 text-white rounded-lg transition-colors duration-200 font-medium"
                        style={{ background: 'linear-gradient(90deg, var(--ll-bg-2), var(--ll-bg-1))' }}
                      >
                        Save Person
                      </button>
                    </div>
                  </div>
                )}

                {/* Notes */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    value={advisor.notes}
                    onChange={(e) => handleAdvisorChange(advisor.id, 'notes', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    rows="3"
                    placeholder="Any additional information about this advisor..."
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addAdvisor}
              className="px-6 py-3 text-white rounded-lg transition-colors duration-200 font-medium"
              style={{ background: 'linear-gradient(90deg, var(--ll-bg-2), var(--ll-bg-1))' }}
            >
              + Add Another Advisor
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/assets')}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium"
            >
              Back to Assets
            </button>
            <button
              type="submit"
              className="px-8 py-3 text-white rounded-lg transition-colors duration-200 font-medium"
              style={{ background: 'linear-gradient(90deg, var(--ll-bg-2), var(--ll-bg-1))' }}
            >
              Continue to Documents
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
