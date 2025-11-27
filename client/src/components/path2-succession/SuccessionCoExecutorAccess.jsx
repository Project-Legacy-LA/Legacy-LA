import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'

export default function SpouseAccessManager() {
  const navigate = useNavigate()
  const pageRef = useRef(null)
  const formRef = useRef(null)
  const headerRef = useRef(null)

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

  // Default settings
  const defaultAccessSettings = {
    spouseEmail: '',
    canView: true,
    canEdit: false,
    canDelete: false
  }

  const [accessSettings, setAccessSettings] = useState(defaultAccessSettings)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field, value) => {
    setAccessSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // TODO: Replace with actual API call to send invitation
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulated API call
      console.log('Sending invitation to:', accessSettings.spouseEmail)
      console.log('With permissions:', {
        view: accessSettings.canView,
        edit: accessSettings.canEdit,
        delete: accessSettings.canDelete
      })
      
      // Show success message and navigate back
      alert('Invitation sent successfully!')
      navigate('/')
    } catch (error) {
      console.error('Error sending invitation:', error)
      alert('Failed to send invitation. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div ref={pageRef} className="min-h-screen text-black bg-white">
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div ref={headerRef} className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2" style={{ fontFamily: 'var(--ll-font)' }}>
            Succession - Co-Executor Access
          </h1>
          <p className="text-gray-600">
            Configure access permissions for co-executors to view and manage succession information.
          </p>
        </div>

        {/* Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          {/* Spouse Email */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Invite Co-Executor</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <svg className="w-5 h-5 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm text-blue-700">
                    Enter the co-executor's email address. They will receive an invitation link to create their account.
                  </p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Co-Executor Email Address *
                </label>
                <input
                  type="email"
                  value={accessSettings.spouseEmail}
                  onChange={(e) => handleInputChange('spouseEmail', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="spouse@example.com"
                  required
                />
              </div>
            </div>
          </div>

          {/* Simple Permissions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Access Permissions</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={accessSettings.canView}
                    onChange={(e) => handleInputChange('canView', e.target.checked)}
                    className="mr-2 h-5 w-5 rounded border-gray-300 text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    style={{ backgroundColor: accessSettings.canView ? '#4a5568' : 'white' }}
                  />
                  <span className="text-sm text-gray-700">Can View Information</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={accessSettings.canEdit}
                    onChange={(e) => handleInputChange('canEdit', e.target.checked)}
                    className="mr-2 h-5 w-5 rounded border-gray-300 text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    style={{ backgroundColor: accessSettings.canEdit ? '#eab308' : 'white' }}
                  />
                  <span className="text-sm text-gray-700">Can Edit Information</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={accessSettings.canDelete}
                    onChange={(e) => handleInputChange('canDelete', e.target.checked)}
                    className="mr-2 h-5 w-5 rounded border-gray-300 text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    style={{ backgroundColor: accessSettings.canDelete ? '#dc2626' : 'white' }}
                  />
                  <span className="text-sm text-gray-700">Can Delete Information</span>
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/succession/documents')}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium"
            >
              Back to Documents
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 text-white rounded-lg transition-colors duration-200 font-medium flex items-center"
              style={{ background: 'linear-gradient(90deg, var(--ll-bg-2), var(--ll-bg-1))', opacity: isSubmitting ? '0.75' : '1', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Send Invitation Link
                </>
              )}
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
              <span className="text-sm font-medium">Your spouse will receive a secure invitation link to create their account.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}