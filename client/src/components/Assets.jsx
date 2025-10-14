import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { usePeople } from '../contexts/PeopleContext'

export default function Assets() {
  const navigate = useNavigate()
  const pageRef = useRef(null)
  const formRef = useRef(null)
  const headerRef = useRef(null)
  const { people, getPersonDisplayName, getPeopleOptions } = usePeople()

  useEffect(() => {
    const tl = gsap.timeline()
    
    // Simple fade-in animation
    tl.fromTo(pageRef.current, 
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: "none" }
    )
  }, [])

  const [assets, setAssets] = useState([
    {
      id: 1,
      category: 'real_estate',
      description: '',
      valuation: { amount: '', currency: 'USD', valuationDate: '' },
      ownershipPercentage: 100,
      isLouisianaProperty: true,
      probateClass: 'probate',
      beneficiaryDesignationRequired: false,
      excludedFromTaxableEstate: false,
      propertyType: 'community',
      owners: [],
      beneficiaries: [],
      notes: ''
    }
  ])

  const [beneficiaries, setBeneficiaries] = useState([
    {
      id: 1,
      personId: null,
      relationship: '',
      allAssets: false,
      residualAssets: false,
      contingentAssets: false,
      inheritanceType: '',
      percentage: 0,
      specificAssets: [],
      notes: ''
    }
  ])

  const [decisionMakers, setDecisionMakers] = useState([
    {
      id: 1,
      personId: null,
      role: 'executor',
      isCoRole: false,
      coRolePersonId: null,
      relationship: '',
      importantInfo: '',
      notes: ''
    }
  ])

  const assetCategories = [
    { value: 'real_estate', label: 'Real Estate' },
    { value: 'personal_property', label: 'Personal Property' },
    { value: 'vehicle', label: 'Vehicle, Boat, Trailer, Other' },
    { value: 'bank', label: 'Bank Account' },
    { value: 'brokerage', label: 'Brokerage Account' },
    { value: 'retirement', label: 'Retirement Account' },
    { value: 'annuity', label: 'Annuity' },
    { value: 'life_insurance', label: 'Life Insurance' },
    { value: 'business', label: 'Business Interest' },
    { value: 'other', label: 'Other' }
  ]

  const addAsset = () => {
    const newId = Math.max(...assets.map(a => a.id)) + 1
    setAssets([...assets, {
      id: newId,
      category: 'real_estate',
      description: '',
      valuation: { amount: '', currency: 'USD', valuationDate: '' },
      ownershipPercentage: 100,
      isLouisianaProperty: true,
      probateClass: 'probate',
      beneficiaryDesignationRequired: false,
      excludedFromTaxableEstate: false,
      propertyType: 'community',
      owners: [],
      beneficiaries: [],
      notes: ''
    }])
  }

  const handleAssetChange = (assetId, field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setAssets(assets.map(a => 
        a.id === assetId 
          ? { ...a, [parent]: { ...a[parent], [child]: value } }
          : a
      ))
    } else {
      setAssets(assets.map(a => 
        a.id === assetId 
          ? { ...a, [field]: value }
          : a
      ))
    }
  }

  const addBeneficiary = () => {
    const newId = Math.max(...beneficiaries.map(b => b.id)) + 1
    setBeneficiaries([...beneficiaries, {
      id: newId,
      personId: null,
      relationship: '',
      allAssets: false,
      residualAssets: false,
      contingentAssets: false,
      inheritanceType: '',
      percentage: 0,
      specificAssets: [],
      notes: ''
    }])
  }

  const handleBeneficiaryChange = (beneficiaryId, field, value) => {
    setBeneficiaries(beneficiaries.map(b => 
      b.id === beneficiaryId 
        ? { ...b, [field]: value }
        : b
    ))
  }

  const addDecisionMaker = () => {
    const newId = Math.max(...decisionMakers.map(d => d.id)) + 1
    setDecisionMakers([...decisionMakers, {
      id: newId,
      personId: null,
      role: 'executor',
      isCoRole: false,
      coRolePersonId: null,
      relationship: '',
      importantInfo: '',
      notes: ''
    }])
  }

  const handleDecisionMakerChange = (decisionMakerId, field, value) => {
    setDecisionMakers(decisionMakers.map(d => 
      d.id === decisionMakerId 
        ? { ...d, [field]: value }
        : d
    ))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Assets submitted:', {
      assets,
      beneficiaries,
      decisionMakers
    })
    // Navigate to next section or summary
    navigate('/')
  }

  return (
    <div ref={pageRef} className="min-h-screen text-black bg-white">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div ref={headerRef} className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2" style={{ fontFamily: 'var(--ll-font)' }}>
            Assets & Distribution
          </h1>
          <p className="text-gray-600">
            Manage your assets, beneficiaries, and decision makers. Select people from your About You section or add new ones as needed.
          </p>
        </div>

        {/* Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          
          {/* Assets Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Assets</h2>
            <div className="space-y-6">
              {assets.map((asset, index) => (
                <div key={asset.id} className="p-6 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Asset {index + 1}
                    </h3>
                    {assets.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setAssets(assets.filter(a => a.id !== asset.id))}
                        className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                      >
                        Remove Asset
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Asset Category
                      </label>
                      <select
                        value={asset.category}
                        onChange={(e) => handleAssetChange(asset.id, 'category', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                      >
                        {assetCategories.map(category => (
                          <option key={category.value} value={category.value}>{category.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <input
                        type="text"
                        value={asset.description}
                        onChange={(e) => handleAssetChange(asset.id, 'description', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                        placeholder="Asset description"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Value
                      </label>
                      <div className="flex space-x-2">
                        <span className="flex items-center px-3 py-3 bg-gray-100 border border-gray-300 rounded-l-lg text-gray-700">
                          $
                        </span>
                        <input
                          type="number"
                          value={asset.valuation.amount}
                          onChange={(e) => handleAssetChange(asset.id, 'valuation.amount', e.target.value)}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Percentage of Ownership
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="number"
                          value={asset.ownershipPercentage}
                          onChange={(e) => handleAssetChange(asset.id, 'ownershipPercentage', e.target.value)}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                          placeholder="100"
                          min="0"
                          max="100"
                        />
                        <span className="flex items-center px-3 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-700">
                          %
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Asset Owners - Link to people */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Asset Owners
                    </label>
                    <div className="space-y-2">
                      {people.map(person => (
                        <label key={person.id} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={asset.owners.includes(person.id)}
                            onChange={(e) => {
                              const newOwners = e.target.checked
                                ? [...asset.owners, person.id]
                                : asset.owners.filter(id => id !== person.id)
                              handleAssetChange(asset.id, 'owners', newOwners)
                            }}
                            className="mr-2 text-gray-600 focus:ring-gray-500"
                          />
                          <span className="text-sm text-gray-700">
                            {getPersonDisplayName(person.id)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addAsset}
                className="px-6 py-3 text-white rounded-lg transition-colors duration-200 font-medium"
                style={{ background: 'linear-gradient(90deg, var(--ll-bg-2), var(--ll-bg-1))' }}
              >
                + Add Another Asset
              </button>
            </div>
          </div>

          {/* Beneficiaries Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Beneficiaries & Inheritors</h2>
            <div className="space-y-6">
              {beneficiaries.map((beneficiary, index) => (
                <div key={beneficiary.id} className="p-6 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Beneficiary {index + 1}
                    </h3>
                    {beneficiaries.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setBeneficiaries(beneficiaries.filter(b => b.id !== beneficiary.id))}
                        className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                      >
                        Remove Beneficiary
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Person
                      </label>
                      <select
                        value={beneficiary.personId || ''}
                        onChange={(e) => handleBeneficiaryChange(beneficiary.id, 'personId', parseInt(e.target.value) || null)}
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
                        Inheritance Type
                      </label>
                      <select
                        value={beneficiary.inheritanceType}
                        onChange={(e) => handleBeneficiaryChange(beneficiary.id, 'inheritanceType', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                      >
                        <option value="">Select inheritance type...</option>
                        <option value="full_ownership">Full Ownership</option>
                        <option value="usufruct">Usufruct</option>
                        <option value="naked_ownership">Naked Ownership</option>
                        <option value="super_usufruct">Super Usufruct</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Asset Designation
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={beneficiary.allAssets}
                          onChange={(e) => handleBeneficiaryChange(beneficiary.id, 'allAssets', e.target.checked)}
                          className="mr-2 text-gray-600 focus:ring-gray-500"
                        />
                        <span className="text-sm text-gray-700">All Assets</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={beneficiary.residualAssets}
                          onChange={(e) => handleBeneficiaryChange(beneficiary.id, 'residualAssets', e.target.checked)}
                          className="mr-2 text-gray-600 focus:ring-gray-500"
                        />
                        <span className="text-sm text-gray-700">Residual (if primary beneficiaries predecease)</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={beneficiary.contingentAssets}
                          onChange={(e) => handleBeneficiaryChange(beneficiary.id, 'contingentAssets', e.target.checked)}
                          className="mr-2 text-gray-600 focus:ring-gray-500"
                        />
                        <span className="text-sm text-gray-700">Contingent Beneficiary</span>
                      </label>
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addBeneficiary}
                className="px-6 py-3 text-white rounded-lg transition-colors duration-200 font-medium"
                style={{ background: 'linear-gradient(90deg, var(--ll-bg-2), var(--ll-bg-1))' }}
              >
                + Add Another Beneficiary
              </button>
            </div>
          </div>

          {/* Decision Makers Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Decision Makers</h2>
            <div className="space-y-6">
              {decisionMakers.map((decisionMaker, index) => (
                <div key={decisionMaker.id} className="p-6 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Decision Maker {index + 1}
                    </h3>
                    {decisionMakers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setDecisionMakers(decisionMakers.filter(d => d.id !== decisionMaker.id))}
                        className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                      >
                        Remove Decision Maker
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Person
                      </label>
                      <select
                        value={decisionMaker.personId || ''}
                        onChange={(e) => handleDecisionMakerChange(decisionMaker.id, 'personId', parseInt(e.target.value) || null)}
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
                        Role
                      </label>
                      <select
                        value={decisionMaker.role}
                        onChange={(e) => handleDecisionMakerChange(decisionMaker.id, 'role', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                      >
                        <option value="executor">Executor</option>
                        <option value="guardian">Guardian (Tutor)</option>
                        <option value="trustee">Trustee</option>
                        <option value="power_of_attorney">Power of Attorney - Financial</option>
                        <option value="healthcare_proxy">Power of Attorney - Healthcare</option>
                        <option value="designee_remains">Designee for Remains/Burial/Services</option>
                        <option value="backup_guardian">Backup Guardian</option>
                        <option value="undertutor">Undertutor</option>
                        <option value="backup_undertutor">Backup Undertutor</option>
                        <option value="backup_executor">Backup Executor</option>
                        <option value="backup_poa_financial">Backup Power of Attorney - Financial</option>
                        <option value="backup_poa_medical">Backup Power of Attorney - Medical</option>
                        <option value="backup_designee_remains">Backup Designee for Remains/Burial/Services</option>
                        <option value="special_trustee">Special Trustee</option>
                        <option value="backup_trustee">Backup Trustee</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={decisionMaker.isCoRole}
                        onChange={(e) => handleDecisionMakerChange(decisionMaker.id, 'isCoRole', e.target.checked)}
                        className="mr-2 text-gray-600 focus:ring-gray-500"
                      />
                      <span className="text-sm text-gray-700">This is a Co-Role (shared responsibility)</span>
                    </label>
                  </div>

                  {decisionMaker.isCoRole && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Co-Role Person
                      </label>
                      <select
                        value={decisionMaker.coRolePersonId || ''}
                        onChange={(e) => handleDecisionMakerChange(decisionMaker.id, 'coRolePersonId', parseInt(e.target.value) || null)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                      >
                        <option value="">Select co-role person...</option>
                        {getPeopleOptions().map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                        <option value="other">Other (Add new person)</option>
                      </select>
                    </div>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={addDecisionMaker}
                className="px-6 py-3 text-white rounded-lg transition-colors duration-200 font-medium"
                style={{ background: 'linear-gradient(90deg, var(--ll-bg-2), var(--ll-bg-1))' }}
              >
                + Add Another Decision Maker
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/about-you')}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium"
            >
              Back to About You
            </button>
            <button
              type="submit"
              className="px-8 py-3 text-white rounded-lg transition-colors duration-200 font-medium"
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
