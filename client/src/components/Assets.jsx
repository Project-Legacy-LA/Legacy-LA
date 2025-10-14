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

  const [liabilities, setLiabilities] = useState([
    {
      id: 1,
      category: '',
      description: '',
      amount: '',
      creditor: '',
      accountNumber: '',
      monthlyPayment: '',
      isSecured: false,
      collateral: '',
      notes: ''
    }
  ])

  const [showNewPersonForm, setShowNewPersonForm] = useState({
    beneficiary: null,
    decisionMaker: null,
    advisor: null
  })

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

  const probateClasses = [
    { value: 'probate', label: 'Probate' },
    { value: 'non_probate', label: 'Non-Probate' },
    { value: 'ancillary_probate', label: 'Ancillary Probate' }
  ]

  const annuityTypes = [
    { value: 'qualified', label: 'Qualified (IRA)' },
    { value: 'non_qualified', label: 'Non-Qualified' }
  ]

  const liabilityCategories = [
    { value: 'mortgage', label: 'Mortgage' },
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'personal_loan', label: 'Personal Loan' },
    { value: 'auto_loan', label: 'Auto Loan' },
    { value: 'student_loan', label: 'Student Loan' },
    { value: 'business_loan', label: 'Business Loan' },
    { value: 'medical_debt', label: 'Medical Debt' },
    { value: 'tax_debt', label: 'Tax Debt' },
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

  const addLiability = () => {
    const newId = Math.max(...liabilities.map(l => l.id)) + 1
    setLiabilities([...liabilities, {
      id: newId,
      category: '',
      description: '',
      amount: '',
      creditor: '',
      accountNumber: '',
      monthlyPayment: '',
      isSecured: false,
      collateral: '',
      notes: ''
    }])
  }

  const removeLiability = (liabilityId) => {
    setLiabilities(liabilities.filter(liability => liability.id !== liabilityId))
  }

  const handleLiabilityChange = (liabilityId, field, value) => {
    setLiabilities(liabilities.map(liability => 
      liability.id === liabilityId 
        ? { ...liability, [field]: value }
        : liability
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

                    {/* Additional Asset Fields */}
                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Probate Class
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
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Property Location
                        </label>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={asset.isLouisianaProperty}
                              onChange={(e) => handleAssetChange(asset.id, 'isLouisianaProperty', e.target.checked)}
                              className="mr-2 text-gray-600 focus:ring-gray-500"
                            />
                            <span className="text-sm text-gray-700">Louisiana Property</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Annuity Type (if annuity category) */}
                    {asset.category === 'annuity' && (
                      <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Annuity Type
                        </label>
                        <div className="space-y-2">
                          {annuityTypes.map(type => (
                            <label key={type.value} className="flex items-center">
                              <input
                                type="radio"
                                name={`annuityType-${asset.id}`}
                                value={type.value}
                                checked={asset.annuityType === type.value}
                                onChange={(e) => handleAssetChange(asset.id, 'annuityType', e.target.value)}
                                className="mr-2 text-gray-600 focus:ring-gray-500"
                              />
                              <span className="text-sm text-gray-700">{type.label}</span>
                            </label>
                          ))}
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

          {/* Inheritors & Beneficiaries Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Inheritors & Beneficiaries</h2>
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
                        <option value="usufruct">Usufruct</option>
                        <option value="naked_ownership">Naked Ownership</option>
                        <option value="super_usufruct">Super Usufruct</option>
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

          {/* Liabilities Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Liabilities</h2>
            <div className="space-y-6">
              {liabilities.map((liability, index) => (
                <div key={liability.id} className="p-6 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Liability #{index + 1}
                    </h3>
                    {liabilities.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLiability(liability.id)}
                        className="px-4 py-2 text-red-600 hover:text-red-800 transition-colors duration-200 font-medium text-sm"
                      >
                        Remove Liability
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Liability Category
                      </label>
                      <select
                        value={liability.category}
                        onChange={(e) => handleLiabilityChange(liability.id, 'category', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                      >
                        <option value="">Select category...</option>
                        {liabilityCategories.map(category => (
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
                        value={liability.description}
                        onChange={(e) => handleLiabilityChange(liability.id, 'description', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                        placeholder="Liability description"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Outstanding Balance
                      </label>
                      <div className="flex space-x-2">
                        <span className="flex items-center px-3 py-3 bg-gray-100 border border-gray-300 rounded-l-lg text-gray-700">
                          $
                        </span>
                        <input
                          type="number"
                          value={liability.amount}
                          onChange={(e) => handleLiabilityChange(liability.id, 'amount', e.target.value)}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Creditor
                      </label>
                      <input
                        type="text"
                        value={liability.creditor}
                        onChange={(e) => handleLiabilityChange(liability.id, 'creditor', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                        placeholder="Creditor name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Number
                      </label>
                      <input
                        type="text"
                        value={liability.accountNumber}
                        onChange={(e) => handleLiabilityChange(liability.id, 'accountNumber', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                        placeholder="Account number"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Monthly Payment
                      </label>
                      <div className="flex space-x-2">
                        <span className="flex items-center px-3 py-3 bg-gray-100 border border-gray-300 rounded-l-lg text-gray-700">
                          $
                        </span>
                        <input
                          type="number"
                          value={liability.monthlyPayment}
                          onChange={(e) => handleLiabilityChange(liability.id, 'monthlyPayment', e.target.value)}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        checked={liability.isSecured}
                        onChange={(e) => handleLiabilityChange(liability.id, 'isSecured', e.target.checked)}
                        className="mr-2 text-gray-600 focus:ring-gray-500"
                      />
                      <span className="text-sm text-gray-700">This is a secured debt</span>
                    </label>
                    
                    {liability.isSecured && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Collateral
                        </label>
                        <input
                          type="text"
                          value={liability.collateral}
                          onChange={(e) => handleLiabilityChange(liability.id, 'collateral', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                          placeholder="Describe the collateral"
                        />
                      </div>
                    )}
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={liability.notes}
                      onChange={(e) => handleLiabilityChange(liability.id, 'notes', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                      rows="3"
                      placeholder="Additional notes about this liability..."
                    />
                  </div>
                </div>
              ))}
              
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={addLiability}
                  className="px-6 py-3 text-white rounded-lg transition-colors duration-200 font-medium"
                  style={{ background: 'linear-gradient(90deg, var(--ll-bg-2), var(--ll-bg-1))' }}
                >
                  + Add Another Liability
                </button>
              </div>
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
                        onChange={(e) => handlePersonSelection('decisionMaker', decisionMaker.id, e.target.value)}
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

                  {/* New Person Form for Decision Makers */}
                  {showNewPersonForm.decisionMaker === decisionMaker.id && (
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
                          onClick={() => cancelNewPerson('decisionMaker')}
                          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 font-medium"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => saveNewPerson('decisionMaker', decisionMaker.id)}
                          className="px-6 py-2 text-white rounded-lg transition-colors duration-200 font-medium"
                          style={{ background: 'linear-gradient(90deg, var(--ll-bg-2), var(--ll-bg-1))' }}
                        >
                          Save Person
                        </button>
                      </div>
                    </div>
                  )}

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
