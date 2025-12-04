import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { usePeople } from '../../contexts/PeopleContext'
import { useAssets } from '../../contexts/AssetsContext'
// AssetDistributionCalculator not used in Path 2 (Succession) - inheritor/beneficiary handled by attorney view only

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

  // Decision makers (executors, guardians, etc.)
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

  // Advisors (financial, legal, etc.)
  const [advisors, setAdvisors] = useState([
    {
      id: 1,
      personId: null,
      relationship: '',
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
      valuationAtDateOfDeath: { amount: '', valuationDate: '' },
      currentValuation: { amount: '', valuationDate: new Date().toISOString().split('T')[0] },
      dateOfDeathValuationDate: '',
      currentValue: '',
      currentValuationDate: new Date().toISOString().split('T')[0],
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

  const handleAdvisorChange = (advisorId, field, value) => {
    setAdvisors(advisors.map(a => 
      a.id === advisorId
        ? { ...a, [field]: value }
        : a
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

  const handleFileUpload = (assetId, files) => {
    // Minimal file handling: store filename placeholders in asset.documentFiles
    const fileArray = Array.from(files).map((f, i) => ({ id: Date.now() + i, name: f.name }))
    const updatedAssets = assets.map(a => 
      a.id === assetId ? { ...a, documentFiles: [...(a.documentFiles || []), ...fileArray] } : a
    )
    setAssetsData(updatedAssets)
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
    console.log('Succession Assets submitted:', {
      assets
    })
    navigate('/succession/liabilities')
  }

  return (
    <div ref={pageRef} className="min-h-screen text-black bg-white">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div ref={headerRef} className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2" style={{ fontFamily: 'var(--ll-font)' }}>
            Succession - Assets
          </h1>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-gray-700 font-medium mb-2">
              Please list all property the decedent owned or had an interest in at the time of death.
            </p>
            <p className="text-sm text-gray-600 mb-2">
              For each asset, please provide an approximate fair market value as of the date of death - not today's value. If you do not know the exact value, please give your best good-faith estimate, or note that it is "unknown." If you have supporting documentation (such as an appraisal, account statement, or online valuation), please attach a copy or upload it with your questionnaire.
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Be sure to include all real estate (whether located in LA or elsewhere), bank accounts, investment accounts, retirement accounts (including beneficiary designations if known), vehicles, boats, or recreational vehicles, business interests, LLCs, or partnerships, Trust interests (if the decedent was a beneficiary or if the decedent created a trust) and personal property of significant value (such as jewelry, firearms, collectibles, or equipment).
            </p>
            <p className="text-sm text-gray-600">
              <strong>Important:</strong> This section collects both the asset value at the time of death AND the current asset value. Both pieces of data are required.
            </p>
          </div>
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
                        onClick={() => setAssetsData(assets.filter(a => a.id !== asset.id))}
                        className="px-4 py-2 text-white rounded-lg transition-all duration-200 font-medium text-sm shadow-lg hover:shadow-xl hover:brightness-110 active:scale-95"
                        style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626, #b91c1c)' }}
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
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 placeholder:text-gray-500 placeholder:opacity-100"
                          placeholder="Bank/retirement account provider (eg. Fidelity or commercial bank)"
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
                          Value at Date of Death * <span className="text-sm font-normal text-gray-600">(Not today's value)</span>
                        </label>
                        <div className="flex space-x-2">
                          <span className="flex items-center px-3 py-3 bg-gray-100 border border-gray-300 rounded-l-lg text-gray-700">
                            $
                          </span>
                          <input
                            type="number"
                            value={asset.valuation?.amount || asset.valuationAtDateOfDeath?.amount || ''}
                            onChange={(e) => {
                              const val = e.target.value
                              if (asset.valuationAtDateOfDeath) {
                                handleAssetChange(asset.id, 'valuationAtDateOfDeath.amount', val)
                              } else {
                                handleAssetChange(asset.id, 'valuation.amount', val)
                              }
                            }}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                            placeholder="0.00"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Fair market value as of the date of death</p>
                      </div>
                      <div>
                        <label className="block text-lg font-bold text-gray-800 mb-3">
                          Date of Death Valuation Date *
                        </label>
                        <input
                          type="date"
                          value={asset.valuation?.valuationDate || asset.valuationAtDateOfDeath?.valuationDate || asset.dateOfDeathValuationDate || ''}
                          onChange={(e) => {
                            const val = e.target.value
                            if (asset.valuationAtDateOfDeath) {
                              handleAssetChange(asset.id, 'valuationAtDateOfDeath.valuationDate', val)
                            } else {
                              handleAssetChange(asset.id, 'valuation.valuationDate', val)
                              handleAssetChange(asset.id, 'dateOfDeathValuationDate', val)
                            }
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-lg font-bold text-gray-800 mb-3">
                          Current Value * <span className="text-sm font-normal text-gray-600">(Today's value)</span>
                        </label>
                        <div className="flex space-x-2">
                          <span className="flex items-center px-3 py-3 bg-gray-100 border border-gray-300 rounded-l-lg text-gray-700">
                            $
                          </span>
                          <input
                            type="number"
                            value={asset.currentValuation?.amount || asset.currentValue || ''}
                            onChange={(e) => {
                              const val = e.target.value
                              if (asset.currentValuation) {
                                handleAssetChange(asset.id, 'currentValuation.amount', val)
                              } else {
                                handleAssetChange(asset.id, 'currentValue', val)
                              }
                            }}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                            placeholder="0.00"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Current fair market value</p>
                      </div>
                      <div>
                        <label className="block text-lg font-bold text-gray-800 mb-3">
                          Current Valuation Date *
                        </label>
                        <input
                          type="date"
                          value={asset.currentValuation?.valuationDate || asset.currentValuationDate || new Date().toISOString().split('T')[0]}
                          onChange={(e) => {
                            const val = e.target.value
                            if (asset.currentValuation) {
                              handleAssetChange(asset.id, 'currentValuation.valuationDate', val)
                            } else {
                              handleAssetChange(asset.id, 'currentValuationDate', val)
                            }
                          }}
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

                      {/* Property Location - Only show for real estate */}
                      {asset.category === 'real_estate' && (
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
                      )}

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

                    {/* Direct Beneficiary Asset Checkbox and Beneficiaries Section */}
                    <div className="mt-6">
                      <label className="flex items-center mb-4">
                        <input
                          type="checkbox"
                          checked={asset.beneficiaryDesignationRequired}
                          onChange={(e) => handleAssetChange(asset.id, 'beneficiaryDesignationRequired', e.target.checked)}
                          className="mr-2 text-gray-600 focus:ring-gray-500"
                        />
                        <span className="text-sm text-gray-700 font-medium">Direct Beneficiary Asset</span>
                      </label>
                      
                      {/* Beneficiaries Section - Only show if Direct Beneficiary Asset is checked */}
                      {asset.beneficiaryDesignationRequired && (
                        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                          <h4 className="text-md font-semibold text-gray-800 mb-4">Beneficiaries for this Asset</h4>
                          <div className="space-y-4">
                            {(asset.beneficiaries || []).map((beneficiary, idx) => (
                              <div key={idx} className="p-3 bg-white rounded border border-gray-200">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Beneficiary Name
                                    </label>
                                    <input
                                      type="text"
                                      value={beneficiary.name || ''}
                                      onChange={(e) => {
                                        const updatedBeneficiaries = [...(asset.beneficiaries || [])]
                                        updatedBeneficiaries[idx] = { ...updatedBeneficiaries[idx], name: e.target.value }
                                        handleAssetChange(asset.id, 'beneficiaries', updatedBeneficiaries)
                                      }}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                      placeholder="Beneficiary name"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Relationship
                                    </label>
                                    <input
                                      type="text"
                                      value={beneficiary.relationship || ''}
                                      onChange={(e) => {
                                        const updatedBeneficiaries = [...(asset.beneficiaries || [])]
                                        updatedBeneficiaries[idx] = { ...updatedBeneficiaries[idx], relationship: e.target.value }
                                        handleAssetChange(asset.id, 'beneficiaries', updatedBeneficiaries)
                                      }}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                      placeholder="e.g., Spouse, Child, etc."
                                    />
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updatedBeneficiaries = (asset.beneficiaries || []).filter((_, i) => i !== idx)
                                    handleAssetChange(asset.id, 'beneficiaries', updatedBeneficiaries)
                                  }}
                                  className="px-3 py-1.5 text-white rounded-lg transition-all duration-200 font-medium text-sm mt-2 shadow-lg hover:shadow-xl hover:brightness-110 active:scale-95"
                                  style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626, #b91c1c)' }}
                                >
                                  Remove Beneficiary
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => {
                                const updatedBeneficiaries = [...(asset.beneficiaries || []), { name: '', relationship: '' }]
                                handleAssetChange(asset.id, 'beneficiaries', updatedBeneficiaries)
                              }}
                              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                              + Add Beneficiary
                            </button>
                          </div>
                        </div>
                      )}
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

          {/* Note: Inheritor & Beneficiary Page removed for Succession path - this is handled in attorney view only */}
          {false && <div className="mb-8 hidden">
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
                        className="px-3 py-1.5 text-white rounded-lg transition-all duration-200 font-medium text-sm shadow-lg hover:shadow-xl hover:brightness-110 active:scale-95"
                        style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626, #b91c1c)' }}
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
                        <span className="text-sm text-gray-700">Residual — receives the remainder of the estate (everything not otherwise distributed)</span>
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
          </div>}


          {/* Asset Distribution Calculator Section - Removed for Succession */}
          {/* Note: Distribution planning is handled in attorney view only for succession path */}


          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/succession/about-you')}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium"
            >
              Back to About You and Decedent
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
