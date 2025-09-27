import React, { useState } from 'react'
import Navbar from './Navbar'

export default function AboutYou({ onNavigate }) {
  const [formData, setFormData] = useState({
    legalFirstName: 'Asdasd',
    preferToBeCalled: 'Asd',
    priorNames: 'Asdasd',
    gender: 'Male',
    usCitizen: 'Yes',
    maritalStatus: 'Married',
    parish: 'Orleans',
    birthPlace: 'Nepal',
    middleInitial: '',
    legalLastName: 'Asdasd',
    suffix: 'II',
    socialSecurityNumber: '123-12-3123',
    birthMonth: '11',
    birthDay: '11',
    birthYear: '1999',
    additionalCitizenship: 'None'
  })

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // Handle form submission logic here
  }

  return (
    <div className="min-h-screen text-black bg-white">
      <Navbar />
      
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2" style={{ fontFamily: 'var(--ll-font)' }}>
            About You
          </h1>
          <p className="text-gray-600">
            Please provide your personal information below. All fields marked with * are required.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
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
                  required
                />
              </div>

              {/* Prefer to be called */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prefer to be called / nickname
                </label>
                <input
                  type="text"
                  value={formData.preferToBeCalled}
                  onChange={(e) => handleInputChange('preferToBeCalled', e.target.value)}
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
                  required
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
                    required
                  >
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                    <option value="Separated">Separated</option>
                  </select>
                  <button
                    type="button"
                    className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
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
                  value={formData.parish}
                  onChange={(e) => handleInputChange('parish', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  required
                >
                  <option value="Orleans">Orleans</option>
                  <option value="Jefferson">Jefferson</option>
                  <option value="St. Tammany">St. Tammany</option>
                  <option value="East Baton Rouge">East Baton Rouge</option>
                  <option value="Lafayette">Lafayette</option>
                </select>
              </div>

              {/* Birth Place */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Where were you born? (please provide both city and state) *
                </label>
                <input
                  type="text"
                  value={formData.birthPlace}
                  onChange={(e) => handleInputChange('birthPlace', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="City, State"
                  required
                />
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
                  value={formData.middleInitial}
                  onChange={(e) => handleInputChange('middleInitial', e.target.value)}
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
                  required
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
                  onChange={(e) => handleInputChange('socialSecurityNumber', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="XXX-XX-XXXX"
                  pattern="[0-9]{3}-[0-9]{2}-[0-9]{4}"
                  required
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
                      value={formData.birthMonth}
                      onChange={(e) => handleInputChange('birthMonth', e.target.value)}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                      min="1"
                      max="12"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Day</label>
                    <input
                      type="number"
                      value={formData.birthDay}
                      onChange={(e) => handleInputChange('birthDay', e.target.value)}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                      min="1"
                      max="31"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Year</label>
                    <input
                      type="number"
                      value={formData.birthYear}
                      onChange={(e) => handleInputChange('birthYear', e.target.value)}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                      min="1900"
                      max="2024"
                      required
                    />
                  </div>
                </div>
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
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Contact details can be edited under "Contact Details" at the end of the questionnaire.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => onNavigate('home')}
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
