import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'

export default function AboutYou() {
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

  const [formData, setFormData] = useState({
    // Person table fields
    legalFirstName: '',
    middleName: '',
    legalLastName: '',
    suffix: '',
    preferredName: '',
    socialSecurityNumber: '',
    dateOfBirth: {
      month: '',
      day: '',
      year: ''
    },
    birthCountry: '',
    birthState: '',
    birthCity: '',
    
    // Client table fields
    maritalStatus: '',
    residenceCountry: '',
    residenceState: '',
    residenceParish: '',
    residenceCity: '',
    residenceZipCode: '',
    residenceAddress1: '',
    residenceAddress2: '',
    
    // Additional fields from ER diagram
    gender: '',
    usCitizen: '',
    additionalCitizenship: '',
    otherCitizenship: '',
    priorNames: '',
    
    // Marital record fields (if married)
    marriageDate: '',
    marriageCountry: '',
    marriageState: '',
    marriageCity: '',
    hasPreMaritalAgreement: false,
    hasPostMaritalAgreement: false,
    livedInCommunityPropertyState: false
  })

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const formatSSN = (value) => {
    // Remove all non-numeric characters
    const numbers = value.replace(/\D/g, '')
    
    // Format as XXX-XX-XXXX
    if (numbers.length <= 3) {
      return numbers
    } else if (numbers.length <= 5) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 5)}-${numbers.slice(5, 9)}`
    }
  }

  const handleSSNChange = (e) => {
    const formatted = formatSSN(e.target.value)
    handleInputChange('socialSecurityNumber', formatted)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // Navigate to next section
    navigate('/children')
  }

  return (
    <div ref={pageRef} className="min-h-screen text-black bg-white">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div ref={headerRef} className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2" style={{ fontFamily: 'var(--ll-font)' }}>
            About You
          </h1>
          <p className="text-gray-600">
            Please provide your personal information below. All fields marked with * are required.
          </p>
        </div>

        {/* Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Legal First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Legal First Name *
                </label>
                <input
                  type="text"
                  value={formData.legalFirstName}
                  onChange={(e) => handleInputChange('legalFirstName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                />
              </div>

              {/* Prefer to be called */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prefer to be called / nickname
                </label>
                <input
                  type="text"
                  value={formData.preferredName}
                  onChange={(e) => handleInputChange('preferredName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                />
              </div>

              {/* Prior names */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prior names / Other names known by
                </label>
                <input
                  type="text"
                  value={formData.priorNames}
                  onChange={(e) => handleInputChange('priorNames', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender *
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              {/* US Citizen */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  US Citizen? *
                </label>
                <div className="flex space-x-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="usCitizen"
                      value="Yes"
                      checked={formData.usCitizen === 'Yes'}
                      onChange={(e) => handleInputChange('usCitizen', e.target.value)}
                      className="mr-2 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="usCitizen"
                      value="No"
                      checked={formData.usCitizen === 'No'}
                      onChange={(e) => handleInputChange('usCitizen', e.target.value)}
                      className="mr-2 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">No</span>
                  </label>
                </div>
              </div>

              {/* Marital Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What is your Marital Status? *
                </label>
                <div className="flex items-center space-x-3">
                  <select
                    value={formData.maritalStatus}
                    onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  >
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                    <option value="Separated">Separated</option>
                    <option value="Partnered">Partnered</option>
                    <option value="Other">Other</option>
                  </select>
                  <button
                    type="button"
                    className="px-4 py-3 text-white rounded-lg transition-colors duration-200 font-medium"
                    style={{ background: 'linear-gradient(90deg, var(--ll-bg-2), var(--ll-bg-1))', color: 'white' }}
                  >
                    Adjust
                  </button>
                </div>
              </div>

              {/* Parish */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What parish do you currently reside in? *
                </label>
                <select
                  value={formData.residenceParish}
                  onChange={(e) => handleInputChange('residenceParish', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                >
                  <option value="">Choose...</option>
                  <option value="St. Tammany">St. Tammany</option>
                  <option value="Tangipahoa">Tangipahoa</option>
                  <option value="Washington">Washington</option>
                  <option value="Jefferson">Jefferson</option>
                  <option value="Orleans">Orleans</option>
                  <option value="East Baton Rouge">East Baton Rouge</option>
                  <option value="West Baton Rouge">West Baton Rouge</option>
                  <option value="Livingston">Livingston</option>
                  <option value="St. Bernard">St. Bernard</option>
                </select>
              </div>

              {/* Birth Place */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Where were you born? (please provide both city and state) *
                </label>
                <input
                  type="text"
                  value={formData.birthCountry}
                  onChange={(e) => handleInputChange('birthCountry', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="City, State"
                />
              </div>

              {/* Additional Citizenship */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Citizenship?
                </label>
                <select
                  value={formData.additionalCitizenship}
                  onChange={(e) => handleInputChange('additionalCitizenship', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                >
                  <option value="None">None</option>
                  <option value="Canada">Canada</option>
                  <option value="Mexico">Mexico</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Other">Other</option>
                </select>
                {formData.additionalCitizenship === 'Other' && (
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Please specify other citizenship
                    </label>
                    <input
                      type="text"
                      value={formData.otherCitizenship}
                      onChange={(e) => handleInputChange('otherCitizenship', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                      placeholder="Enter citizenship"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Middle Initial */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Middle Initial(s)
                </label>
                <input
                  type="text"
                  value={formData.middleName}
                  onChange={(e) => handleInputChange('middleName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  maxLength="5"
                />
              </div>

              {/* Legal Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Legal Last Name *
                </label>
                <input
                  type="text"
                  value={formData.legalLastName}
                  onChange={(e) => handleInputChange('legalLastName', e.target.value)}
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
                  value={formData.suffix}
                  onChange={(e) => handleInputChange('suffix', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="Jr., Sr., II, III, etc."
                />
              </div>

              {/* Social Security Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Social Security Number *
                </label>
                <input
                  type="text"
                  value={formData.socialSecurityNumber}
                  onChange={handleSSNChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="XXX-XX-XXXX"
                  maxLength="11"
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Month</label>
                    <input
                      type="number"
                      value={formData.dateOfBirth.month}
                      onChange={(e) => handleInputChange('dateOfBirth.month', e.target.value)}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Day</label>
                    <input
                      type="number"
                      value={formData.dateOfBirth.day}
                      onChange={(e) => handleInputChange('dateOfBirth.day', e.target.value)}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Year</label>
                    <input
                      type="number"
                      value={formData.dateOfBirth.year}
                      onChange={(e) => handleInputChange('dateOfBirth.year', e.target.value)}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Current Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Address Line 1
                </label>
                <input
                  type="text"
                  value={formData.residenceAddress1}
                  onChange={(e) => handleInputChange('residenceAddress1', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="Street address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Address Line 2
                </label>
                <input
                  type="text"
                  value={formData.residenceAddress2}
                  onChange={(e) => handleInputChange('residenceAddress2', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="Apartment, suite, etc."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.residenceCity}
                    onChange={(e) => handleInputChange('residenceCity', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    value={formData.residenceZipCode}
                    onChange={(e) => handleInputChange('residenceZipCode', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    placeholder="70112"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Marriage Details Section (if married) */}
          {formData.maritalStatus === 'Married' && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Marriage Details</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marriage Date
                  </label>
                  <input
                    type="date"
                    value={formData.marriageDate}
                    onChange={(e) => handleInputChange('marriageDate', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marriage Location
                  </label>
                  <input
                    type="text"
                    value={formData.marriageCity}
                    onChange={(e) => handleInputChange('marriageCity', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    placeholder="City, State"
                  />
                </div>
                <div className="lg:col-span-2">
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.hasPreMaritalAgreement}
                        onChange={(e) => handleInputChange('hasPreMaritalAgreement', e.target.checked)}
                        className="mr-2 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Has Pre-Marital Agreement</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.hasPostMaritalAgreement}
                        onChange={(e) => handleInputChange('hasPostMaritalAgreement', e.target.checked)}
                        className="mr-2 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Has Post-Marital Agreement</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.livedInCommunityPropertyState}
                        onChange={(e) => handleInputChange('livedInCommunityPropertyState', e.target.checked)}
                        className="mr-2 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Lived in Community Property State</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}


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
