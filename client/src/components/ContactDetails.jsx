import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'

export default function ContactDetails() {
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

  const [contactInfo, setContactInfo] = useState({
    // Primary contact
    primaryPhone: '',
    primaryEmail: '',
    
    // Addresses
    currentAddress: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US'
    },
    
    // Additional contact methods
    secondaryPhone: '',
    secondaryEmail: '',
    workPhone: '',
    workEmail: '',
    
    // Emergency contacts
    emergencyContacts: [
      {
        id: 1,
        firstName: '',
        lastName: '',
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
        }
      }
    ],
    
    // Preferred contact methods
    preferredContactMethod: 'phone',
    preferredContactTime: 'business_hours',
    allowTextMessages: true,
    allowEmailNotifications: true,
    
    // Additional information
    notes: ''
  })

  const addEmergencyContact = () => {
    const newId = Math.max(...contactInfo.emergencyContacts.map(c => c.id)) + 1
    setContactInfo({
      ...contactInfo,
      emergencyContacts: [...contactInfo.emergencyContacts, {
        id: newId,
        firstName: '',
        lastName: '',
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
        }
      }]
    })
  }

  const removeEmergencyContact = (contactId) => {
    if (contactInfo.emergencyContacts.length > 1) {
      setContactInfo({
        ...contactInfo,
        emergencyContacts: contactInfo.emergencyContacts.filter(c => c.id !== contactId)
      })
    }
  }

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setContactInfo(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setContactInfo(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleEmergencyContactChange = (contactId, field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setContactInfo(prev => ({
        ...prev,
        emergencyContacts: prev.emergencyContacts.map(c => 
          c.id === contactId 
            ? { ...c, [parent]: { ...c[parent], [child]: value } }
            : c
        )
      }))
    } else {
      setContactInfo(prev => ({
        ...prev,
        emergencyContacts: prev.emergencyContacts.map(c => 
          c.id === contactId 
            ? { ...c, [field]: value }
            : c
        )
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Contact details form submitted:', contactInfo)
    // Navigate to next section
    navigate('/documents')
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

  const handlePhoneChange = (field, e) => {
    const formatted = formatPhone(e.target.value)
    handleInputChange(field, formatted)
  }

  const handleEmergencyPhoneChange = (contactId, e) => {
    const formatted = formatPhone(e.target.value)
    handleEmergencyContactChange(contactId, 'phone', formatted)
  }

  return (
    <div ref={pageRef} className="min-h-screen text-black bg-white">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div ref={headerRef} className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2" style={{ fontFamily: 'var(--ll-font)' }}>
            Contact Details
          </h1>
          <p className="text-gray-600">
            Please provide your contact information. All fields marked with * are required.
          </p>
        </div>

        {/* Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          {/* Primary Contact Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Primary Contact Information</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Primary Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Phone Number *
                </label>
                <input
                  type="tel"
                  value={contactInfo.primaryPhone}
                  onChange={(e) => handlePhoneChange('primaryPhone', e)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="(555) 123-4567"
                />
              </div>

              {/* Primary Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Email Address *
                </label>
                <input
                  type="email"
                  value={contactInfo.primaryEmail}
                  onChange={(e) => handleInputChange('primaryEmail', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>
          </div>

          {/* Current Address */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Current Address</h2>
            
            <div className="space-y-4">
              {/* Address Line 1 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Line 1 *
                </label>
                <input
                  type="text"
                  value={contactInfo.currentAddress.line1}
                  onChange={(e) => handleInputChange('currentAddress.line1', e.target.value)}
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
                  value={contactInfo.currentAddress.line2}
                  onChange={(e) => handleInputChange('currentAddress.line2', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="Apartment, suite, etc."
                />
              </div>

              {/* City, State, ZIP */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={contactInfo.currentAddress.city}
                    onChange={(e) => handleInputChange('currentAddress.city', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    value={contactInfo.currentAddress.state}
                    onChange={(e) => handleInputChange('currentAddress.state', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    value={contactInfo.currentAddress.zipCode}
                    onChange={(e) => handleInputChange('currentAddress.zipCode', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    placeholder="70112"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Additional Contact Methods */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Additional Contact Methods</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Secondary Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secondary Phone Number
                </label>
                <input
                  type="tel"
                  value={contactInfo.secondaryPhone}
                  onChange={(e) => handlePhoneChange('secondaryPhone', e)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="(555) 123-4567"
                />
              </div>

              {/* Secondary Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secondary Email Address
                </label>
                <input
                  type="email"
                  value={contactInfo.secondaryEmail}
                  onChange={(e) => handleInputChange('secondaryEmail', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="secondary.email@example.com"
                />
              </div>

              {/* Work Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Work Phone Number
                </label>
                <input
                  type="tel"
                  value={contactInfo.workPhone}
                  onChange={(e) => handlePhoneChange('workPhone', e)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="(555) 123-4567"
                />
              </div>

              {/* Work Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Work Email Address
                </label>
                <input
                  type="email"
                  value={contactInfo.workEmail}
                  onChange={(e) => handleInputChange('workEmail', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="work.email@company.com"
                />
              </div>
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Emergency Contacts</h2>
              <button
                type="button"
                onClick={addEmergencyContact}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
              >
                + Add Emergency Contact
              </button>
            </div>

            {contactInfo.emergencyContacts.map((contact, index) => (
              <div key={contact.id} className="mb-6 p-6 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Emergency Contact {index + 1}
                  </h3>
                  {contactInfo.emergencyContacts.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEmergencyContact(contact.id)}
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
                        value={contact.firstName}
                        onChange={(e) => handleEmergencyContactChange(contact.id, 'firstName', e.target.value)}
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
                        value={contact.lastName}
                        onChange={(e) => handleEmergencyContactChange(contact.id, 'lastName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                      />
                    </div>

                    {/* Relationship */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Relationship *
                      </label>
                      <select
                        value={contact.relationship}
                        onChange={(e) => handleEmergencyContactChange(contact.id, 'relationship', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                      >
                        <option value="">Select relationship...</option>
                        <option value="spouse">Spouse</option>
                        <option value="child">Child</option>
                        <option value="parent">Parent</option>
                        <option value="sibling">Sibling</option>
                        <option value="friend">Friend</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={contact.phone}
                        onChange={(e) => handleEmergencyPhoneChange(contact.id, e)}
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
                        value={contact.email}
                        onChange={(e) => handleEmergencyContactChange(contact.id, 'email', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                        placeholder="contact@example.com"
                      />
                    </div>
                  </div>

                  {/* Right Column - Address */}
                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-700">Address (Optional)</h4>
                    
                    {/* Address Line 1 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address Line 1
                      </label>
                      <input
                        type="text"
                        value={contact.address.line1}
                        onChange={(e) => handleEmergencyContactChange(contact.id, 'address.line1', e.target.value)}
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
                        value={contact.address.line2}
                        onChange={(e) => handleEmergencyContactChange(contact.id, 'address.line2', e.target.value)}
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
                          value={contact.address.city}
                          onChange={(e) => handleEmergencyContactChange(contact.id, 'address.city', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State
                        </label>
                        <input
                          type="text"
                          value={contact.address.state}
                          onChange={(e) => handleEmergencyContactChange(contact.id, 'address.state', e.target.value)}
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
                        value={contact.address.zipCode}
                        onChange={(e) => handleEmergencyContactChange(contact.id, 'address.zipCode', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                        placeholder="70112"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Preferences */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Preferences</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Preferred Contact Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Contact Method
                </label>
                <select
                  value={contactInfo.preferredContactMethod}
                  onChange={(e) => handleInputChange('preferredContactMethod', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                >
                  <option value="phone">Phone</option>
                  <option value="email">Email</option>
                  <option value="text">Text Message</option>
                  <option value="mail">Mail</option>
                </select>
              </div>

              {/* Preferred Contact Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Contact Time
                </label>
                <select
                  value={contactInfo.preferredContactTime}
                  onChange={(e) => handleInputChange('preferredContactTime', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                >
                  <option value="business_hours">Business Hours (9 AM - 5 PM)</option>
                  <option value="evenings">Evenings (5 PM - 9 PM)</option>
                  <option value="weekends">Weekends</option>
                  <option value="anytime">Anytime</option>
                </select>
              </div>
            </div>

            {/* Communication Preferences */}
            <div className="mt-6 space-y-4">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={contactInfo.allowTextMessages}
                    onChange={(e) => handleInputChange('allowTextMessages', e.target.checked)}
                    className="mr-2 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Allow text messages for important updates</span>
                </label>
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={contactInfo.allowEmailNotifications}
                    onChange={(e) => handleInputChange('allowEmailNotifications', e.target.checked)}
                    className="mr-2 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Allow email notifications</span>
                </label>
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Additional Notes</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={contactInfo.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                rows="4"
                placeholder="Any additional information about your contact preferences or special instructions..."
              />
            </div>
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
