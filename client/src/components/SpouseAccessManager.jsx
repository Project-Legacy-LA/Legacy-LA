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
    
    // Simple fade-in animation
    tl.fromTo(pageRef.current, 
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: "none" }
    )
  }, [])

  const [accessSettings, setAccessSettings] = useState({
    // Spouse access settings
    spouseHasAccess: true, // Default to true for current spouse
    spouseEmail: '',
    spousePassword: '',
    
    // Spouse status
    spouseStatus: 'current', // 'current', 'former', 'deceased'
    hasPrenup: false,
    hasDivorceDecree: false,
    prenupDate: '',
    divorceDecreeDate: '',
    
    // Access permissions
    canViewPersonalInfo: true,
    canViewChildren: true,
    canViewAssets: true,
    canViewBeneficiaries: true,
    canViewDecisionMakers: true,
    canViewAdvisors: true,
    canEditPersonalInfo: false,
    canEditChildren: false,
    canEditAssets: false,
    canEditBeneficiaries: false,
    canEditDecisionMakers: false,
    canEditAdvisors: false,
    
    // Delete permissions
    canDeletePersonalInfo: false,
    canDeleteChildren: false,
    canDeleteAssets: false,
    canDeleteBeneficiaries: false,
    canDeleteDecisionMakers: false,
    canDeleteAdvisors: false,
    
    // Emergency access
    emergencyAccess: false,
    emergencyContact: '',
    emergencyPhone: '',
    
    // Access expiry
    accessExpiry: '',
    notifyOnAccess: true
  })

  const handleInputChange = (field, value) => {
    setAccessSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePermissionChange = (permission, value) => {
    setAccessSettings(prev => ({
      ...prev,
      [permission]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Spouse Access Settings submitted:', accessSettings)
    // In a real application, you would send this data to your backend
    navigate('/') // Navigate back to home or a confirmation page
  }

  return (
    <div ref={pageRef} className="min-h-screen text-black bg-white">
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div ref={headerRef} className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2" style={{ fontFamily: 'var(--ll-font)' }}>
            Spouse Access Management
          </h1>
          <p className="text-gray-600">
            Configure access permissions for your spouse to view and manage your estate planning information.
          </p>
        </div>

        {/* Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          
          {/* Spouse Status */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Spouse Access</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-blue-800">Current Spouse Access Only</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    This section is for managing access permissions for your current spouse only.
                  </p>
                </div>
              </div>
            </div>
              
              
              <div className="mt-4">
                <label className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={accessSettings.hasPrenup}
                    onChange={(e) => handleInputChange('hasPrenup', e.target.checked)}
                    className="mr-2 text-gray-600 focus:ring-gray-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    I have a prenuptial agreement
                  </span>
                </label>
                {accessSettings.hasPrenup && (
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prenuptial Agreement Date
                    </label>
                    <input
                      type="date"
                      value={accessSettings.prenupDate}
                      onChange={(e) => handleInputChange('prenupDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Spouse Login Information */}
          {accessSettings.spouseHasAccess && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Spouse Login Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Spouse Email Address
                  </label>
                  <input
                    type="email"
                    value={accessSettings.spouseEmail}
                    onChange={(e) => handleInputChange('spouseEmail', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    placeholder="spouse@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Temporary Password
                  </label>
                  <input
                    type="password"
                    value={accessSettings.spousePassword}
                    onChange={(e) => handleInputChange('spousePassword', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    placeholder="Create a secure password"
                  />
                </div>
              </div>
            </div>
          )}

          {/* View Permissions */}
          {accessSettings.spouseHasAccess && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">View Permissions</h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={accessSettings.canViewPersonalInfo}
                      onChange={(e) => handlePermissionChange('canViewPersonalInfo', e.target.checked)}
                      className="mr-2 text-gray-600 focus:ring-gray-500"
                    />
                    <span className="text-sm text-gray-700">Personal Information</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={accessSettings.canViewChildren}
                      onChange={(e) => handlePermissionChange('canViewChildren', e.target.checked)}
                      className="mr-2 text-gray-600 focus:ring-gray-500"
                    />
                    <span className="text-sm text-gray-700">Children Information</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={accessSettings.canViewAssets}
                      onChange={(e) => handlePermissionChange('canViewAssets', e.target.checked)}
                      className="mr-2 text-gray-600 focus:ring-gray-500"
                    />
                    <span className="text-sm text-gray-700">Assets & Distribution</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={accessSettings.canViewBeneficiaries}
                      onChange={(e) => handlePermissionChange('canViewBeneficiaries', e.target.checked)}
                      className="mr-2 text-gray-600 focus:ring-gray-500"
                    />
                    <span className="text-sm text-gray-700">Beneficiaries</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={accessSettings.canViewDecisionMakers}
                      onChange={(e) => handlePermissionChange('canViewDecisionMakers', e.target.checked)}
                      className="mr-2 text-gray-600 focus:ring-gray-500"
                    />
                    <span className="text-sm text-gray-700">Decision Makers</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={accessSettings.canViewAdvisors}
                      onChange={(e) => handlePermissionChange('canViewAdvisors', e.target.checked)}
                      className="mr-2 text-gray-600 focus:ring-gray-500"
                    />
                    <span className="text-sm text-gray-700">Professional Advisors</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Edit Permissions */}
          {accessSettings.spouseHasAccess && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Edit Permissions</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-start mb-4">
                  <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="text-sm font-medium text-yellow-800">Edit Permissions Warning</h3>
                    <p className="text-sm text-yellow-700 mt-1">
                      Granting edit permissions allows your spouse to modify your estate plan. Use with caution.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={accessSettings.canEditPersonalInfo}
                      onChange={(e) => handlePermissionChange('canEditPersonalInfo', e.target.checked)}
                      className="mr-2 text-gray-600 focus:ring-gray-500"
                    />
                    <span className="text-sm text-gray-700">Personal Information</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={accessSettings.canEditChildren}
                      onChange={(e) => handlePermissionChange('canEditChildren', e.target.checked)}
                      className="mr-2 text-gray-600 focus:ring-gray-500"
                    />
                    <span className="text-sm text-gray-700">Children Information</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={accessSettings.canEditAssets}
                      onChange={(e) => handlePermissionChange('canEditAssets', e.target.checked)}
                      className="mr-2 text-gray-600 focus:ring-gray-500"
                    />
                    <span className="text-sm text-gray-700">Assets & Distribution</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={accessSettings.canEditBeneficiaries}
                      onChange={(e) => handlePermissionChange('canEditBeneficiaries', e.target.checked)}
                      className="mr-2 text-gray-600 focus:ring-gray-500"
                    />
                    <span className="text-sm text-gray-700">Beneficiaries</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={accessSettings.canEditDecisionMakers}
                      onChange={(e) => handlePermissionChange('canEditDecisionMakers', e.target.checked)}
                      className="mr-2 text-gray-600 focus:ring-gray-500"
                    />
                    <span className="text-sm text-gray-700">Decision Makers</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={accessSettings.canEditAdvisors}
                      onChange={(e) => handlePermissionChange('canEditAdvisors', e.target.checked)}
                      className="mr-2 text-gray-600 focus:ring-gray-500"
                    />
                    <span className="text-sm text-gray-700">Professional Advisors</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Delete Permissions */}
          {accessSettings.spouseHasAccess && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Delete Permissions</h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-start mb-4">
                  <svg className="w-5 h-5 text-red-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="text-sm font-medium text-red-800">Delete Permissions Warning</h3>
                    <p className="text-sm text-red-700 mt-1">
                      Granting delete permissions allows your spouse to permanently remove data from your estate plan. Use with extreme caution.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={accessSettings.canDeletePersonalInfo}
                      onChange={(e) => handlePermissionChange('canDeletePersonalInfo', e.target.checked)}
                      className="mr-2 text-gray-600 focus:ring-gray-500"
                    />
                    <span className="text-sm text-gray-700">Personal Information</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={accessSettings.canDeleteChildren}
                      onChange={(e) => handlePermissionChange('canDeleteChildren', e.target.checked)}
                      className="mr-2 text-gray-600 focus:ring-gray-500"
                    />
                    <span className="text-sm text-gray-700">Children Information</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={accessSettings.canDeleteAssets}
                      onChange={(e) => handlePermissionChange('canDeleteAssets', e.target.checked)}
                      className="mr-2 text-gray-600 focus:ring-gray-500"
                    />
                    <span className="text-sm text-gray-700">Assets & Distribution</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={accessSettings.canDeleteBeneficiaries}
                      onChange={(e) => handlePermissionChange('canDeleteBeneficiaries', e.target.checked)}
                      className="mr-2 text-gray-600 focus:ring-gray-500"
                    />
                    <span className="text-sm text-gray-700">Beneficiaries</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={accessSettings.canDeleteDecisionMakers}
                      onChange={(e) => handlePermissionChange('canDeleteDecisionMakers', e.target.checked)}
                      className="mr-2 text-gray-600 focus:ring-gray-500"
                    />
                    <span className="text-sm text-gray-700">Decision Makers</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={accessSettings.canDeleteAdvisors}
                      onChange={(e) => handlePermissionChange('canDeleteAdvisors', e.target.checked)}
                      className="mr-2 text-gray-600 focus:ring-gray-500"
                    />
                    <span className="text-sm text-gray-700">Professional Advisors</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/documents')}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium"
            >
              Back to Documents
            </button>
            <button
              type="submit"
              className="px-8 py-3 text-white rounded-lg transition-colors duration-200 font-medium"
              style={{ background: 'linear-gradient(90deg, var(--ll-bg-2), var(--ll-bg-1))' }}
            >
              Save Spouse Access Settings
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