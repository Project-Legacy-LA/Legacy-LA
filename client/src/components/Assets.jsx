import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { usePeople } from '../contexts/PeopleContext'
import { useAssets } from '../contexts/AssetsContext'
import AssetDistributionCalculator from './AssetDistributionCalculator'

export default function Assets() {
  const navigate = useNavigate()
  const pageRef = useRef(null)
  const formRef = useRef(null)
  const headerRef = useRef(null)
  const { people, getPersonDisplayName, getPeopleOptions, addPerson } = usePeople()
  const { assets, setAssetsData } = useAssets()

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





  const [showDistributionCalculator, setShowDistributionCalculator] = useState(true)
  const [distributions, setDistributions] = useState({})

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

  const [showNewPersonForm, setShowNewPersonForm] = useState({
    beneficiary: null,
    decisionMaker: null,
    advisor: null
  })

  const assetCategories = [
    { value: 'annuity', label: 'Annuity' },
    { value: 'bank', label: 'Bank Account' },
    { value: 'brokerage', label: 'Brokerage Account' },
    { value: 'business', label: 'Business Interest' },
    { value: 'cryptocurrency', label: 'Cryptocurrency/Alternatives' },
    { value: 'donor_advised_fund', label: 'Donor Advised Fund' },
    { value: 'education_account', label: 'Education Account' },
    { value: 'employer_equity', label: 'Employer Equity' },
    { value: 'future_interest', label: 'Future Interest/IOU' },
    { value: 'hsa_fsa', label: 'HSA/FSA' },
    { value: 'life_insurance', label: 'Life Insurance' },
    { value: 'mineral_interest', label: 'Mineral Interest' },
    { value: 'patent', label: 'Patent' },
    { value: 'personal_property', label: 'Personal Property' },
    { value: 'promissory_note', label: 'Promissory Note' },
    { value: 'real_estate', label: 'Real Estate' },
    { value: 'reits', label: 'REITs/Interest' },
    { value: 'retirement', label: 'Retirement Account' },
    { value: 'royalty_interest', label: 'Royalty Interest' },
    { value: 'savings_bond', label: 'Savings Bond' },
    { value: 'trust_interest', label: 'Trust Interest' },
    { value: 'vehicle', label: 'Vehicle, Boat, Trailer, Other' },
    { value: 'other', label: 'Other' }
  ]

  const probateClasses = [
    { value: 'probate', label: 'Probate' },
    { value: 'non_probate', label: 'Non-Probate' },
    { value: 'ancillary_probate', label: 'Ancillary Probate' }
  ]

  const states = [
    { value: 'AL', label: 'Alabama' },
    { value: 'AK', label: 'Alaska' },
    { value: 'AZ', label: 'Arizona' },
    { value: 'AR', label: 'Arkansas' },
    { value: 'CA', label: 'California' },
    { value: 'CO', label: 'Colorado' },
    { value: 'CT', label: 'Connecticut' },
    { value: 'DC', label: 'District of Columbia' },
    { value: 'DE', label: 'Delaware' },
    { value: 'FL', label: 'Florida' },
    { value: 'GA', label: 'Georgia' },
    { value: 'HI', label: 'Hawaii' },
    { value: 'ID', label: 'Idaho' },
    { value: 'IL', label: 'Illinois' },
    { value: 'IN', label: 'Indiana' },
    { value: 'IA', label: 'Iowa' },
    { value: 'KS', label: 'Kansas' },
    { value: 'KY', label: 'Kentucky' },
    { value: 'LA', label: 'Louisiana' },
    { value: 'ME', label: 'Maine' },
    { value: 'MD', label: 'Maryland' },
    { value: 'MA', label: 'Massachusetts' },
    { value: 'MI', label: 'Michigan' },
    { value: 'MN', label: 'Minnesota' },
    { value: 'MS', label: 'Mississippi' },
    { value: 'MO', label: 'Missouri' },
    { value: 'MT', label: 'Montana' },
    { value: 'NE', label: 'Nebraska' },
    { value: 'NV', label: 'Nevada' },
    { value: 'NH', label: 'New Hampshire' },
    { value: 'NJ', label: 'New Jersey' },
    { value: 'NM', label: 'New Mexico' },
    { value: 'NY', label: 'New York' },
    { value: 'NC', label: 'North Carolina' },
    { value: 'ND', label: 'North Dakota' },
    { value: 'OH', label: 'Ohio' },
    { value: 'OK', label: 'Oklahoma' },
    { value: 'OR', label: 'Oregon' },
    { value: 'PA', label: 'Pennsylvania' },
    { value: 'RI', label: 'Rhode Island' },
    { value: 'SC', label: 'South Carolina' },
    { value: 'SD', label: 'South Dakota' },
    { value: 'TN', label: 'Tennessee' },
    { value: 'TX', label: 'Texas' },
    { value: 'UT', label: 'Utah' },
    { value: 'VT', label: 'Vermont' },
    { value: 'VA', label: 'Virginia' },
    { value: 'WA', label: 'Washington' },
    { value: 'WV', label: 'West Virginia' },
    { value: 'WI', label: 'Wisconsin' },
    { value: 'WY', label: 'Wyoming' }
  ]

  const annuityTypes = [
    { value: 'qualified', label: 'Qualified (IRA)' },
    { value: 'non_qualified', label: 'Non-Qualified' }
  ]

  const titleForms = [
    { value: 'custodial_ugma', label: 'Custodial UGMA' },
    { value: 'custodial_utma', label: 'Custodial UTMA' },
    { value: 'joint_tenancy', label: 'Joint Tenancy with Right of Survivorship' },
    { value: 'naked_ownership', label: 'Naked Ownership' },
    { value: 'sole_ownership', label: 'Sole Ownership' },
    { value: 'tenancy_in_common', label: 'Tenancy in Common' },
    { value: 'trust_titled', label: 'Trust Titled' },
    { value: 'usufruct', label: 'Usufruct' },
    { value: 'other', label: 'Other' }
  ]



  const addAsset = () => {
    const newId = Math.max(...assets.map(a => a.id), 0) + 1
    const newAsset = {
      id: newId,
      category: 'real_estate',
      description: '',
      institution: '',
      accountNumber: '',
      valuation: { amount: '', currency: 'USD', valuationDate: '' },
      ownershipPercentage: 100,
      isLouisianaProperty: true,
      propertyLocation: 'LA',
      probateClass: 'probate',
      beneficiaryDesignationRequired: false,
      excludedFromTaxableEstate: false,
      propertyType: 'community',
      titleForm: 'sole_ownership',
      annuityQualified: false,
      annuityNonQualified: false,
      propertyAddress: {
        street: '',
        city: '',
        zipCode: ''
      },
      owners: [],
      beneficiaries: [],
      notes: ''
    }
    setAssetsData([...assets, newAsset])
  }

  const handleAssetChange = (assetId, field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      const updatedAssets = assets.map(a => 
        a.id === assetId 
          ? { ...a, [parent]: { ...a[parent], [child]: value } }
          : a
      )
      setAssetsData(updatedAssets)
    } else {
      const updatedAssets = assets.map(a => 
        a.id === assetId 
          ? { ...a, [field]: value }
          : a
      )
      setAssetsData(updatedAssets)
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


  const handlePersonSelection = (type, id, value) => {
    if (value === 'other') {
      setShowNewPersonForm(prev => ({ ...prev, [type]: id }))
    } else {
      setShowNewPersonForm(prev => ({ ...prev, [type]: null }))
      if (type === 'beneficiary') {
        handleBeneficiaryChange(id, 'personId', parseInt(value) || null)
      } else if (type === 'decisionMaker') {
        handleDecisionMakerChange(id, 'personId', parseInt(value) || null)
      } else if (type === 'advisor') {
        handleAdvisorChange(id, 'personId', parseInt(value) || null)
      }
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

  const handleNewPersonDateChange = (field, value, type) => {
    let numValue = parseInt(value) || ''
    
    if (type === 'month') {
      numValue = Math.min(Math.max(numValue, 1), 12)
    } else if (type === 'day') {
      numValue = Math.min(Math.max(numValue, 1), 31)
    } else if (type === 'year') {
      const currentYear = new Date().getFullYear()
      numValue = Math.min(Math.max(numValue, 1900), currentYear)
    }
    
    handleNewPersonChange(field, numValue)
  }

  const saveNewPerson = (type, id) => {
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
        roles: [type]
      })

      if (type === 'beneficiary') {
        handleBeneficiaryChange(id, 'personId', newPersonId)
      } else if (type === 'decisionMaker') {
        handleDecisionMakerChange(id, 'personId', newPersonId)
      } else if (type === 'advisor') {
        handleAdvisorChange(id, 'personId', newPersonId)
      }

      setShowNewPersonForm(prev => ({ ...prev, [type]: null }))
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

  const cancelNewPerson = (type) => {
    setShowNewPersonForm(prev => ({ ...prev, [type]: null }))
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

  const handleDistributionChange = (newDistributions) => {
    setDistributions(newDistributions)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Assets submitted:', {
      assets,
      beneficiaries,
      distributions
    })
    navigate('/liabilities')
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
            Please enter your personal asset details. In this section you will be able to assign beneficiaries for your assets.
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
                        <label className="block text-lg font-bold text-gray-800 mb-3">
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
                        <label className="block text-lg font-bold text-gray-800 mb-3">
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
                        <label className="block text-lg font-bold text-gray-800 mb-3">
                          Institution/Provider
                        </label>
                        <input
                          type="text"
                          value={asset.institution || ''}
                          onChange={(e) => handleAssetChange(asset.id, 'institution', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                          placeholder="e.g., Bank of America, Fidelity"
                        />
                      </div>
                      <div>
                        <label className="block text-lg font-bold text-gray-800 mb-3">
                          Account/Policy Number
                        </label>
                        <input
                          type="text"
                          value={asset.accountNumber || ''}
                          onChange={(e) => handleAssetChange(asset.id, 'accountNumber', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                          placeholder="Account or policy number"
                        />
                      </div>
                      <div>
                        <label className="block text-lg font-bold text-gray-800 mb-3">
                          Title Form *
                        </label>
                        <select
                          value={asset.titleForm || 'sole_ownership'}
                          onChange={(e) => handleAssetChange(asset.id, 'titleForm', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                        >
                          {titleForms.map(titleForm => (
                            <option key={titleForm.value} value={titleForm.value}>{titleForm.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-lg font-bold text-gray-800 mb-3">
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
                      <div>
                        <label className="block text-lg font-bold text-gray-800 mb-3">
                          Valuation Date *
                        </label>
                        <input
                          type="date"
                          value={asset.valuation.valuationDate || ''}
                          onChange={(e) => handleAssetChange(asset.id, 'valuation.valuationDate', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-lg font-bold text-gray-800 mb-3">
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

                    {/* Additional Asset Fields */}
                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-lg font-bold text-gray-800 mb-3">
                          Marital Character *
                        </label>
                        <select
                          value={asset.propertyType || 'community'}
                          onChange={(e) => handleAssetChange(asset.id, 'propertyType', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                        >
                          <option value="community">Community Property</option>
                          <option value="quasi_community">Quasi Community Property</option>
                          <option value="separate">Separate Property</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-lg font-bold text-gray-800 mb-3">
                          Probate Class *
                        </label>
                        <select
                          value={asset.probateClass}
                          onChange={(e) => handleAssetChange(asset.id, 'probateClass', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                        >
                          {probateClasses.map(probateClass => (
                            <option key={probateClass.value} value={probateClass.value}>{probateClass.label}</option>
                          ))}
                        </select>
                      </div>
                      
                      {/* Address Fields for Real Estate */}
                      {asset.category === 'real_estate' && (
                        <>
                          <div>
                            <label className="block text-lg font-bold text-gray-800 mb-3">
                              Street Address *
                            </label>
                            <input
                              type="text"
                              value={asset.propertyAddress?.street || ''}
                              onChange={(e) => handleAssetChange(asset.id, 'propertyAddress.street', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                              placeholder="123 Main Street"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-lg font-bold text-gray-800 mb-3">
                                City *
                              </label>
                              <input
                                type="text"
                                value={asset.propertyAddress?.city || ''}
                                onChange={(e) => handleAssetChange(asset.id, 'propertyAddress.city', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                                placeholder="New Orleans"
                              />
                            </div>
                            <div>
                              <label className="block text-lg font-bold text-gray-800 mb-3">
                                Zip Code *
                              </label>
                              <input
                                type="text"
                                value={asset.propertyAddress?.zipCode || ''}
                                onChange={(e) => handleAssetChange(asset.id, 'propertyAddress.zipCode', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                                placeholder="70112"
                              />
                            </div>
                          </div>
                        </>
                      )}

                      <div>
                        <label className="block text-lg font-bold text-gray-800 mb-3">
                          Property Location
                        </label>
                        <div className="space-y-3">
                          <div className="flex space-x-4">
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name={`property-location-${asset.id}`}
                                checked={asset.isLouisianaProperty}
                                onChange={(e) => {
                                  const updatedAssets = assets.map(a => 
                                    a.id === asset.id 
                                      ? { 
                                          ...a, 
                                          isLouisianaProperty: true,
                                          propertyLocation: 'LA',
                                          probateClass: 'probate'
                                        }
                                      : a
                                  )
                                  setAssetsData(updatedAssets)
                                }}
                                className="mr-2 text-gray-600 focus:ring-gray-500"
                              />
                              <span className="text-sm text-gray-700">Louisiana Property</span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name={`property-location-${asset.id}`}
                                checked={!asset.isLouisianaProperty}
                                onChange={(e) => {
                                  const updatedAssets = assets.map(a => 
                                    a.id === asset.id 
                                      ? { 
                                          ...a, 
                                          isLouisianaProperty: false,
                                          probateClass: 'ancillary_probate'
                                        }
                                      : a
                                  )
                                  setAssetsData(updatedAssets)
                                }}
                                className="mr-2 text-gray-600 focus:ring-gray-500"
                              />
                              <span className="text-sm text-gray-700">Out of State Property</span>
                            </label>
                          </div>
                          
                          {!asset.isLouisianaProperty && (
                            <div className="mt-2">
                              <label className="block text-lg font-bold text-gray-800 mb-3">
                                State Location *
                              </label>
                              <select
                                value={asset.propertyLocation || ''}
                                onChange={(e) => handleAssetChange(asset.id, 'propertyLocation', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                              >
                                <option value="">Select State</option>
                                {states.map(state => (
                                  <option key={state.value} value={state.value}>{state.label}</option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={asset.excludedFromTaxableEstate}
                            onChange={(e) => handleAssetChange(asset.id, 'excludedFromTaxableEstate', e.target.checked)}
                            className="mr-2 text-gray-600 focus:ring-gray-500"
                          />
                          <span className="text-sm text-gray-700">Excluded from Taxable Estate</span>
                        </label>
                      </div>
                    </div>

                    {/* Annuity Type (if annuity category) */}
                    {asset.category === 'annuity' && (
                      <div className="mt-6">
                        <label className="block text-lg font-bold text-gray-800 mb-3">
                          Annuity Type
                        </label>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={asset.annuityQualified || false}
                              onChange={(e) => {
                                handleAssetChange(asset.id, 'annuityQualified', e.target.checked)
                                if (e.target.checked) {
                                  handleAssetChange(asset.id, 'annuityNonQualified', false)
                                }
                              }}
                              className="mr-2 text-gray-600 focus:ring-gray-500"
                            />
                            <span className="text-sm text-gray-700">Qualified (IRA)</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={asset.annuityNonQualified || false}
                              onChange={(e) => {
                                handleAssetChange(asset.id, 'annuityNonQualified', e.target.checked)
                                if (e.target.checked) {
                                  handleAssetChange(asset.id, 'annuityQualified', false)
                                }
                              }}
                              className="mr-2 text-gray-600 focus:ring-gray-500"
                            />
                            <span className="text-sm text-gray-700">Non-Qualified</span>
                          </label>
                        </div>
                      </div>
                    )}

                    {/* Direct Beneficiary Asset Checkbox */}
                    <div className="mt-6">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={asset.beneficiaryDesignationRequired}
                          onChange={(e) => handleAssetChange(asset.id, 'beneficiaryDesignationRequired', e.target.checked)}
                          className="mr-2 text-gray-600 focus:ring-gray-500"
                        />
                        <span className="text-sm text-gray-700">Direct Beneficiary Asset</span>
                      </label>
                    </div>

                  {/* Asset Owners - Link to people */}
                  <div className="mt-6">
                    <label className="block text-lg font-bold text-gray-800 mb-3">
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

                    {/* Document Upload for Asset */}
                    <div className="mt-6">
                      <h4 className="text-md font-semibold text-gray-800 mb-4">Related Documents</h4>
                      <div className="space-y-4">
                        {asset.category === 'real_estate' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Property Deed
                            </label>
                            <div className="flex items-center space-x-4">
                              <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                              />
                              <span className="text-sm text-gray-500">Upload property deed</span>
                            </div>
                          </div>
                        )}
                        
                        {asset.category === 'insurance' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Insurance Policy
                            </label>
                            <div className="flex items-center space-x-4">
                              <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                              />
                              <span className="text-sm text-gray-500">Upload insurance policy</span>
                            </div>
                          </div>
                        )}
                        
                        {asset.category === 'retirement' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Retirement Account Document
                            </label>
                            <div className="flex items-center space-x-4">
                              <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                              />
                              <span className="text-sm text-gray-500">Upload retirement account document</span>
                            </div>
                          </div>
                        )}
                        
                        {asset.category === 'business' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Business Document
                            </label>
                            <div className="flex items-center space-x-4">
                              <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                              />
                              <span className="text-sm text-gray-500">Upload business document</span>
                            </div>
                          </div>
                        )}
                        
                        {/* General document upload for any asset */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Other Related Documents
                          </label>
                          <div className="flex items-center space-x-4">
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                              multiple
                              onChange={(e) => handleFileUpload(asset.id, e.target.files)}
                              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                            />
                            <span className="text-sm text-gray-500">Upload other related documents</span>
                          </div>
                          {asset.documentFiles?.length > 0 && (
                            <div className="mt-2">
                              <p className="text-sm text-gray-600">Uploaded files:</p>
                              <ul className="text-sm text-gray-500 mt-1">
                                {asset.documentFiles.map(file => (
                                  <li key={file.id}>• {file.name}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
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
                {assets.length === 0 ? '+ Add' : '+ Add Another Asset'}
              </button>
            </div>
          </div>

          {/* Inheritor & Beneficiary Page Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Inheritor & Beneficiary Page</h2>
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
                        onChange={(e) => handlePersonSelection('beneficiary', beneficiary.id, e.target.value)}
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
                        <option value="naked_ownership">Naked Ownership</option>
                        <option value="super_usufruct">Super Usufruct</option>
                        <option value="trust">Trust</option>
                        <option value="usufruct">Usufruct</option>
                      </select>
                    </div>
                  </div>

                  {/* New Person Form for Beneficiaries */}
                  {showNewPersonForm.beneficiary === beneficiary.id && (
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
                          onClick={() => cancelNewPerson('beneficiary')}
                          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 font-medium"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => saveNewPerson('beneficiary', beneficiary.id)}
                          className="px-6 py-2 text-white rounded-lg transition-colors duration-200 font-medium"
                          style={{ background: 'linear-gradient(90deg, var(--ll-bg-2), var(--ll-bg-1))' }}
                        >
                          Save Person
                        </button>
                      </div>
                    </div>
                  )}

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

                  {/* Specific Asset Selection */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Specific Assets
                    </label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {assets.map(asset => (
                        <label key={asset.id} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={beneficiary.specificAssets.includes(asset.id)}
                            onChange={(e) => {
                              const isChecked = e.target.checked
                              const newSpecificAssets = isChecked
                                ? [...beneficiary.specificAssets, asset.id]
                                : beneficiary.specificAssets.filter(id => id !== asset.id)
                              handleBeneficiaryChange(beneficiary.id, 'specificAssets', newSpecificAssets)
                            }}
                            className="mr-2 text-gray-600 focus:ring-gray-500"
                          />
                          <span className="text-sm text-gray-700">{asset.description || `Asset #${asset.id}`}</span>
                        </label>
                      ))}
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


          {/* Asset Distribution Calculator Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Asset Distribution Calculator</h2>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-blue-800">Structured Distribution Planning</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    This calculator helps you plan exact asset distributions using percentages or fixed dollar amounts. 
                    This eliminates the need for complex text-based distribution instructions that cannot be automatically calculated.
                  </p>
                </div>
              </div>
            </div>

            <AssetDistributionCalculator
              assets={assets}
              beneficiaries={beneficiaries}
              onDistributionChange={handleDistributionChange}
            />
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
              Continue to Liabilities
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
