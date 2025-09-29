import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'

export default function Assets() {
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

  const [assets, setAssets] = useState([
    {
      id: 1,
      displayName: '',
      institutionOrProvider: '',
      accountOrPolicyIdentifier: '',
      ownerScope: 'household',
      ownerPersonId: null,
      titleForm: 'sole',
      maritalCharacter: 'community',
      percentOwned: null,
      category: 'real_estate',
      subtype: '',
      probateClass: 'probate',
      beneficiaryDesignationRequired: false,
      isExcludedFromTaxableEstate: false,
      faceAmount: null,
      cashValue: null,
      planType: '',
      custodian: '',
      isIraWrapper: false,
      employer: '',
      instrumentType: null,
      grantId: '',
      vestedValue: null,
      legalDescriptionOrEntity: '',
      trustId: null,
      trustCapacity: null,
      valuation: {
        amount: '',
        currency: 'USD',
        valuationDate: ''
      }
    }
  ])

  const addAsset = () => {
    const newId = Math.max(...assets.map(a => a.id)) + 1
    setAssets([...assets, {
      id: newId,
      displayName: '',
      institutionOrProvider: '',
      accountOrPolicyIdentifier: '',
      ownerScope: 'household',
      ownerPersonId: null,
      titleForm: 'sole',
      maritalCharacter: 'community',
      percentOwned: null,
      category: 'real_estate',
      subtype: '',
      probateClass: 'probate',
      beneficiaryDesignationRequired: false,
      isExcludedFromTaxableEstate: false,
      faceAmount: null,
      cashValue: null,
      planType: '',
      custodian: '',
      isIraWrapper: false,
      employer: '',
      instrumentType: null,
      grantId: '',
      vestedValue: null,
      legalDescriptionOrEntity: '',
      trustId: null,
      trustCapacity: null,
      valuation: {
        amount: '',
        currency: 'USD',
        valuationDate: ''
      }
    }])
  }

  const removeAsset = (assetId) => {
    if (assets.length > 1) {
      setAssets(assets.filter(a => a.id !== assetId))
    }
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

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Assets form submitted:', assets)
    // Navigate to next section
    navigate('/beneficiaries')
  }

  const assetCategories = [
    { value: 'real_estate', label: 'Real Estate' },
    { value: 'personal_property', label: 'Personal Property' },
    { value: 'vehicle', label: 'Vehicle' },
    { value: 'bank', label: 'Bank Account' },
    { value: 'brokerage', label: 'Brokerage Account' },
    { value: 'retirement', label: 'Retirement Account' },
    { value: 'annuity', label: 'Annuity' },
    { value: 'life_insurance', label: 'Life Insurance' },
    { value: 'employer_equity', label: 'Employer Equity' },
    { value: 'education_account', label: 'Education Account' },
    { value: 'hsa_fsa', label: 'HSA/FSA' },
    { value: 'crypto_alts', label: 'Cryptocurrency/Alternatives' },
    { value: 'reits_interest', label: 'REITs/Interest' },
    { value: 'business_interest', label: 'Business Interest' },
    { value: 'trust_interest', label: 'Trust Interest' },
    { value: 'future_interest_iou', label: 'Future Interest/IOU' },
    { value: 'promissory_note', label: 'Promissory Note' },
    { value: 'donor_advised_fund', label: 'Donor Advised Fund' },
    { value: 'patent', label: 'Patent' },
    { value: 'royalty_interest', label: 'Royalty Interest' },
    { value: 'mineral_interest', label: 'Mineral Interest' },
    { value: 'savings_bond', label: 'Savings Bond' },
    { value: 'other', label: 'Other' }
  ]

  const titleForms = [
    { value: 'sole', label: 'Sole Ownership' },
    { value: 'jtwros', label: 'Joint Tenancy with Right of Survivorship' },
    { value: 'tenancy_in_common', label: 'Tenancy in Common' },
    { value: 'trust_titled', label: 'Trust Titled' },
    { value: 'custodial_utma', label: 'Custodial UTMA' },
    { value: 'custodial_ugma', label: 'Custodial UGMA' },
    { value: 'usufruct', label: 'Usufruct' },
    { value: 'naked_ownership', label: 'Naked Ownership' },
    { value: 'other', label: 'Other' }
  ]

  return (
    <div ref={pageRef} className="min-h-screen text-black bg-white">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div ref={headerRef} className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2" style={{ fontFamily: 'var(--ll-font)' }}>
            Assets
          </h1>
          <p className="text-gray-600">
            Please provide information about your assets. All fields marked with * are required.
          </p>
        </div>

        {/* Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          {assets.map((asset, index) => (
            <div key={asset.id} className="mb-8 p-6 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Asset {index + 1}
                </h3>
                {assets.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAsset(asset.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Remove Asset
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Display Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Asset Name/Description *
                    </label>
                    <input
                      type="text"
                      value={asset.displayName}
                      onChange={(e) => handleAssetChange(asset.id, 'displayName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                      placeholder="e.g., Primary Residence, 401(k) Account"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Asset Category *
                    </label>
                    <select
                      value={asset.category}
                      onChange={(e) => handleAssetChange(asset.id, 'category', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    >
                      {assetCategories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Institution/Provider */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Institution/Provider
                    </label>
                    <input
                      type="text"
                      value={asset.institutionOrProvider}
                      onChange={(e) => handleAssetChange(asset.id, 'institutionOrProvider', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                      placeholder="e.g., Bank of America, Fidelity"
                    />
                  </div>

                  {/* Account/Policy Identifier */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account/Policy Number
                    </label>
                    <input
                      type="text"
                      value={asset.accountOrPolicyIdentifier}
                      onChange={(e) => handleAssetChange(asset.id, 'accountOrPolicyIdentifier', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                      placeholder="Account or policy number"
                    />
                  </div>

                  {/* Title Form */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title Form *
                    </label>
                    <select
                      value={asset.titleForm}
                      onChange={(e) => handleAssetChange(asset.id, 'titleForm', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    >
                      {titleForms.map(form => (
                        <option key={form.value} value={form.value}>{form.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Percent Owned (for tenancy in common) */}
                  {asset.titleForm === 'tenancy_in_common' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Percent Owned *
                      </label>
                      <input
                        type="number"
                        value={asset.percentOwned || ''}
                        onChange={(e) => handleAssetChange(asset.id, 'percentOwned', parseFloat(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                      />
                    </div>
                  )}

                  {/* Valuation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Value *
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

                  {/* Valuation Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valuation Date *
                    </label>
                    <input
                      type="date"
                      value={asset.valuation.valuationDate}
                      onChange={(e) => handleAssetChange(asset.id, 'valuation.valuationDate', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Marital Character */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Marital Character *
                    </label>
                    <select
                      value={asset.maritalCharacter}
                      onChange={(e) => handleAssetChange(asset.id, 'maritalCharacter', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    >
                      <option value="community">Community Property</option>
                      <option value="separate">Separate Property</option>
                      <option value="quasi_community">Quasi-Community Property</option>
                      <option value="unknown">Unknown</option>
                    </select>
                  </div>

                  {/* Probate Class */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Probate Class *
                    </label>
                    <select
                      value={asset.probateClass}
                      onChange={(e) => handleAssetChange(asset.id, 'probateClass', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    >
                      <option value="probate">Probate</option>
                      <option value="non_probate">Non-Probate</option>
                      <option value="contingent_to_trust">Contingent to Trust</option>
                    </select>
                  </div>

                  {/* Beneficiary Designation Required */}
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={asset.beneficiaryDesignationRequired}
                        onChange={(e) => handleAssetChange(asset.id, 'beneficiaryDesignationRequired', e.target.checked)}
                        className="mr-2 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Beneficiary Designation Required</span>
                    </label>
                  </div>

                  {/* Excluded from Taxable Estate */}
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={asset.isExcludedFromTaxableEstate}
                        onChange={(e) => handleAssetChange(asset.id, 'isExcludedFromTaxableEstate', e.target.checked)}
                        className="mr-2 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Excluded from Taxable Estate</span>
                    </label>
                  </div>

                  {/* Life Insurance specific fields */}
                  {asset.category === 'life_insurance' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Face Amount
                        </label>
                        <input
                          type="number"
                          value={asset.faceAmount || ''}
                          onChange={(e) => handleAssetChange(asset.id, 'faceAmount', parseFloat(e.target.value))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cash Value
                        </label>
                        <input
                          type="number"
                          value={asset.cashValue || ''}
                          onChange={(e) => handleAssetChange(asset.id, 'cashValue', parseFloat(e.target.value))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                        />
                      </div>
                    </>
                  )}

                  {/* Retirement specific fields */}
                  {asset.category === 'retirement' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Plan Type
                        </label>
                        <input
                          type="text"
                          value={asset.planType}
                          onChange={(e) => handleAssetChange(asset.id, 'planType', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                          placeholder="e.g., 401(k), IRA, 403(b)"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Custodian
                        </label>
                        <input
                          type="text"
                          value={asset.custodian}
                          onChange={(e) => handleAssetChange(asset.id, 'custodian', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                          placeholder="Account custodian"
                        />
                      </div>
                      <div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={asset.isIraWrapper}
                            onChange={(e) => handleAssetChange(asset.id, 'isIraWrapper', e.target.checked)}
                            className="mr-2 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">IRA Wrapper</span>
                        </label>
                      </div>
                    </>
                  )}

                  {/* Employer Equity specific fields */}
                  {asset.category === 'employer_equity' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Employer
                        </label>
                        <input
                          type="text"
                          value={asset.employer}
                          onChange={(e) => handleAssetChange(asset.id, 'employer', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                          placeholder="Employer name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Instrument Type
                        </label>
                        <select
                          value={asset.instrumentType || ''}
                          onChange={(e) => handleAssetChange(asset.id, 'instrumentType', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                        >
                          <option value="">Select...</option>
                          <option value="RSU">RSU</option>
                          <option value="ISO">ISO</option>
                          <option value="NSO">NSO</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Grant ID
                        </label>
                        <input
                          type="text"
                          value={asset.grantId}
                          onChange={(e) => handleAssetChange(asset.id, 'grantId', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                          placeholder="Grant identifier"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Vested Value
                        </label>
                        <input
                          type="number"
                          value={asset.vestedValue || ''}
                          onChange={(e) => handleAssetChange(asset.id, 'vestedValue', parseFloat(e.target.value))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Add Asset Button */}
          <div className="mb-8">
            <button
              type="button"
              onClick={addAsset}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              + Add Another Asset
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
