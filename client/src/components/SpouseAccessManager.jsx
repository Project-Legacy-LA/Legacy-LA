import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'

export default function SpouseAccessManager() {
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

  const [accessSettings, setAccessSettings] = useState({
    // Master account settings
    isMasterAccount: true,
    masterEmail: '',
    masterPassword: '',
    
    // Spouse access settings
    spouseAccess: {
      enabled: false,
      spouseEmail: '',
      spousePassword: '',
      permissions: {
        viewSharedData: true,
        editAssets: false,
        editBeneficiaries: false,
        editDecisionMakers: false,
        editPersonalInfo: false
      },
      accessExpiry: null,
      canRevokeAccess: true
    },
    
    // Shared data settings
    sharedData: {
      personalInfo: true,
      children: true,
      advisors: true,
      assets: false, // Separate by default for community vs separate property
      beneficiaries: false, // Separate by default
      decisionMakers: false, // Separate by default
      documents: true
    },
    
    // Community vs Separate Property settings
    propertyRegime: 'community', // 'community' or 'separate'
    communityPropertyAssets: [],
    separatePropertyAssets: []
  })

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child, subChild] = field.split('.')
      if (subChild) {
        setAccessSettings(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: {
              ...prev[parent][child],
              [subChild]: value
            }
          }
        }))
      } else {
        setAccessSettings(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        }))
      }
    } else {
      setAccessSettings(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handlePermissionChange = (permission, value) => {
    setAccessSettings(prev => ({
      ...prev,
      spouseAccess: {
        ...prev.spouseAccess,
        permissions: {
          ...prev.spouseAccess.permissions,
          [permission]: value
        }
      }
    }))
  }

  const handleSharedDataChange = (dataType, value) => {
    setAccessSettings(prev => ({
      ...prev,
      sharedData: {
        ...prev.sharedData,
        [dataType]: value
      }
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Spouse Access Settings submitted:', accessSettings)
    // Navigate to estate planning wizard
    navigate('/estate-wizard')
  }

  return (
    <div ref={pageRef} className="min-h-screen text-black bg-white">
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div ref={headerRef} className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2" style={{ fontFamily: 'var(--ll-font)' }}>
            Spouse Access & Account Management
          </h1>
          <p className="text-gray-600">
            Set up shared access for your spouse with controlled permissions for different sections of your estate plan.
          </p>
        </div>

        {/* Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          
          {/* Master Account Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 p-4 bg-gray-50 rounded-lg">
              Master Account (Primary Account Holder)
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Master Account Email
                </label>
                <input
                  type="email"
                  value={accessSettings.masterEmail}
                  onChange={(e) => handleInputChange('masterEmail', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="primary@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Master Account Password
                </label>
                <input
                  type="password"
                  value={accessSettings.masterPassword}
                  onChange={(e) => handleInputChange('masterPassword', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="Enter password"
                />
              </div>
            </div>
          </div>

          {/* Spouse Access Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 p-4 bg-gray-50 rounded-lg">
              Spouse Access (Secondary Account)
            </h2>
            
            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={accessSettings.spouseAccess.enabled}
                  onChange={(e) => handleInputChange('spouseAccess.enabled', e.target.checked)}
                  className="mr-3 text-gray-600 focus:ring-gray-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Enable spouse access to shared information
                </span>
              </label>
            </div>

            {accessSettings.spouseAccess.enabled && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Spouse Email
                    </label>
                    <input
                      type="email"
                      value={accessSettings.spouseAccess.spouseEmail}
                      onChange={(e) => handleInputChange('spouseAccess.spouseEmail', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                      placeholder="spouse@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Spouse Password
                    </label>
                    <input
                      type="password"
                      value={accessSettings.spouseAccess.spousePassword}
                      onChange={(e) => handleInputChange('spouseAccess.spousePassword', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                      placeholder="Enter password"
                    />
                  </div>
                </div>

                {/* Permissions */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Spouse Permissions</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={accessSettings.spouseAccess.permissions.viewSharedData}
                          onChange={(e) => handlePermissionChange('viewSharedData', e.target.checked)}
                          className="mr-2 text-gray-600 focus:ring-gray-500"
                        />
                        <span className="text-sm text-gray-700">View shared data</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={accessSettings.spouseAccess.permissions.editAssets}
                          onChange={(e) => handlePermissionChange('editAssets', e.target.checked)}
                          className="mr-2 text-gray-600 focus:ring-gray-500"
                        />
                        <span className="text-sm text-gray-700">Edit assets</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={accessSettings.spouseAccess.permissions.editBeneficiaries}
                          onChange={(e) => handlePermissionChange('editBeneficiaries', e.target.checked)}
                          className="mr-2 text-gray-600 focus:ring-gray-500"
                        />
                        <span className="text-sm text-gray-700">Edit beneficiaries</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={accessSettings.spouseAccess.permissions.editDecisionMakers}
                          onChange={(e) => handlePermissionChange('editDecisionMakers', e.target.checked)}
                          className="mr-2 text-gray-600 focus:ring-gray-500"
                        />
                        <span className="text-sm text-gray-700">Edit decision makers</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={accessSettings.spouseAccess.permissions.editPersonalInfo}
                          onChange={(e) => handlePermissionChange('editPersonalInfo', e.target.checked)}
                          className="mr-2 text-gray-600 focus:ring-gray-500"
                        />
                        <span className="text-sm text-gray-700">Edit personal information</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Access Control */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Access Control</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={accessSettings.spouseAccess.canRevokeAccess}
                          onChange={(e) => handleInputChange('spouseAccess.canRevokeAccess', e.target.checked)}
                          className="mr-2 text-gray-600 focus:ring-gray-500"
                        />
                        <span className="text-sm text-gray-700">
                          Master account can revoke spouse access (e.g., in case of separation)
                        </span>
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Access Expiry Date (Optional)
                      </label>
                      <input
                        type="date"
                        value={accessSettings.spouseAccess.accessExpiry || ''}
                        onChange={(e) => handleInputChange('spouseAccess.accessExpiry', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Shared Data Configuration */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 p-4 bg-gray-50 rounded-lg">
              Shared Data Configuration
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={accessSettings.sharedData.personalInfo}
                    onChange={(e) => handleSharedDataChange('personalInfo', e.target.checked)}
                    className="mr-2 text-gray-600 focus:ring-gray-500"
                  />
                  <span className="text-sm text-gray-700">Personal information</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={accessSettings.sharedData.children}
                    onChange={(e) => handleSharedDataChange('children', e.target.checked)}
                    className="mr-2 text-gray-600 focus:ring-gray-500"
                  />
                  <span className="text-sm text-gray-700">Children information</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={accessSettings.sharedData.advisors}
                    onChange={(e) => handleSharedDataChange('advisors', e.target.checked)}
                    className="mr-2 text-gray-600 focus:ring-gray-500"
                  />
                  <span className="text-sm text-gray-700">Advisors</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={accessSettings.sharedData.assets}
                    onChange={(e) => handleSharedDataChange('assets', e.target.checked)}
                    className="mr-2 text-gray-600 focus:ring-gray-500"
                  />
                  <span className="text-sm text-gray-700">Assets (separate by default for community vs separate property)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={accessSettings.sharedData.beneficiaries}
                    onChange={(e) => handleSharedDataChange('beneficiaries', e.target.checked)}
                    className="mr-2 text-gray-600 focus:ring-gray-500"
                  />
                  <span className="text-sm text-gray-700">Beneficiaries (separate by default)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={accessSettings.sharedData.decisionMakers}
                    onChange={(e) => handleSharedDataChange('decisionMakers', e.target.checked)}
                    className="mr-2 text-gray-600 focus:ring-gray-500"
                  />
                  <span className="text-sm text-gray-700">Decision makers (separate by default)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={accessSettings.sharedData.documents}
                    onChange={(e) => handleSharedDataChange('documents', e.target.checked)}
                    className="mr-2 text-gray-600 focus:ring-gray-500"
                  />
                  <span className="text-sm text-gray-700">Documents</span>
                </label>
              </div>
            </div>
          </div>

          {/* Property Regime Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 p-4 bg-gray-50 rounded-lg">
              Community vs Separate Property
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Regime
                </label>
                <select
                  value={accessSettings.propertyRegime}
                  onChange={(e) => handleInputChange('propertyRegime', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                >
                  <option value="community">Community Property</option>
                  <option value="separate">Separate Property</option>
                  <option value="mixed">Mixed (Some community, some separate)</option>
                </select>
              </div>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-gray-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="text-sm font-medium text-gray-800">Important Note</h3>
                    <p className="text-sm text-gray-700 mt-1">
                      In Louisiana, community property requires separate asset entries for each spouse with different beneficiary designations. 
                      This ensures proper legal classification and estate planning.
                    </p>
                  </div>
                </div>
              </div>
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
              className="px-8 py-3 text-white rounded-lg transition-colors duration-200 font-medium"
              style={{ background: 'linear-gradient(90deg, var(--ll-bg-2), var(--ll-bg-1))' }}
            >
              Save Settings & Continue
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
