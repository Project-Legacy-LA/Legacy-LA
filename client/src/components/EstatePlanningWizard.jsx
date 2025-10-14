import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import AssetDistributionCalculator from './AssetDistributionCalculator'

export default function EstatePlanningWizard() {
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

  // Cast of Characters - Central data store
  const [people, setPeople] = useState([
    {
      id: 1,
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
      lifeStatus: 'alive',
      dateOfDeath: '',
      placeOfDeath: '',
      isDecedent: false,
      roles: ['child'], // Can have multiple roles
      maritalHistory: {
        marriedAtDeath: false,
        spouseAtDeath: {
          legalName: '',
          dateOfMarriage: ''
        },
        divorces: [],
        widowedAtDeath: false,
        deceasedSpouse: {
          legalName: '',
          dateOfDeath: ''
        }
      },
      contactInfo: {
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
      },
      notes: ''
    }
  ])

  // Assets with linked people
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
      // Link to people in cast of characters
      owners: [], // Array of person IDs
      beneficiaries: [], // Array of person IDs with percentages
      notes: ''
    }
  ])

  // Beneficiaries with linked people
  const [beneficiaries, setBeneficiaries] = useState([
    {
      id: 1,
      personId: null, // Links to people array
      relationship: '',
      allAssets: false,
      residualAssets: false,
      contingentAssets: false,
      inheritanceType: '',
      percentage: 0,
      specificAssets: [], // Array of asset IDs
      notes: ''
    }
  ])

  // Decision Makers with linked people
  const [decisionMakers, setDecisionMakers] = useState([
    {
      id: 1,
      personId: null, // Links to people array
      role: 'executor',
      isCoRole: false,
      coRolePersonId: null, // Links to people array
      relationship: '',
      importantInfo: '',
      notes: ''
    }
  ])

  // Collapsible sections state
  const [expandedSections, setExpandedSections] = useState({
    castOfCharacters: false,
    advisors: false,
    assets: false,
    assetDistribution: false,
    beneficiaries: false,
    decisionMakers: false,
    documents: false
  })

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  // People management functions
  const addPerson = () => {
    const newId = Math.max(...people.map(p => p.id)) + 1
    setPeople([...people, {
      id: newId,
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
      lifeStatus: 'alive',
      dateOfDeath: '',
      placeOfDeath: '',
      isDecedent: false,
      roles: [],
      maritalHistory: {
        marriedAtDeath: false,
        spouseAtDeath: { legalName: '', dateOfMarriage: '' },
        divorces: [],
        widowedAtDeath: false,
        deceasedSpouse: { legalName: '', dateOfDeath: '' }
      },
      contactInfo: {
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
      },
      notes: ''
    }])
  }

  const removePerson = (personId) => {
    if (people.length > 1) {
      setPeople(people.filter(p => p.id !== personId))
      // Remove references from other sections
      setAssets(assets.map(asset => ({
        ...asset,
        owners: asset.owners.filter(id => id !== personId),
        beneficiaries: asset.beneficiaries.filter(b => b.personId !== personId)
      })))
      setBeneficiaries(beneficiaries.filter(b => b.personId !== personId))
      setDecisionMakers(decisionMakers.filter(d => d.personId !== personId))
    }
  }

  const handlePersonChange = (personId, field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setPeople(people.map(p => 
        p.id === personId 
          ? { ...p, [parent]: { ...p[parent], [child]: value } }
          : p
      ))
    } else {
      setPeople(people.map(p => 
        p.id === personId 
          ? { ...p, [field]: value }
          : p
      ))
    }
  }

  const handleRoleChange = (personId, role, isChecked) => {
    setPeople(people.map(p => {
      if (p.id === personId) {
        if (isChecked) {
          return { ...p, roles: [...p.roles, role] }
        } else {
          return { ...p, roles: p.roles.filter(r => r !== role) }
        }
      }
      return p
    }))
  }

  // Asset management functions
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

  // Beneficiary management functions
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

  // Decision Maker management functions
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

  // Asset distribution state
  const [assetDistributions, setAssetDistributions] = useState({})

  const handleDistributionChange = (distributions) => {
    setAssetDistributions(distributions)
  }

  // Utility functions
  const getPersonById = (personId) => {
    return people.find(p => p.id === personId)
  }

  const getPersonDisplayName = (personId) => {
    const person = getPersonById(personId)
    if (!person) return 'Select person...'
    return `${person.firstName} ${person.lastName}`.trim() || 'Unnamed Person'
  }

  const formatSSN = (value) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 3) {
      return numbers
    } else if (numbers.length <= 5) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 5)}-${numbers.slice(5, 9)}`
    }
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

  const roleOptions = [
    { value: 'child', label: 'Child' },
    { value: 'beneficiary', label: 'Beneficiary/Inheritor' },
    { value: 'advisor', label: 'Professional Advisor' },
    { value: 'decedent', label: 'Decedent' },
    { value: 'representative', label: 'Representative' },
    { value: 'trustee', label: 'Trustee' },
    { value: 'executor', label: 'Executor' },
    { value: 'poa_financial', label: 'Power of Attorney - Financial' },
    { value: 'poa_medical', label: 'Power of Attorney - Healthcare' },
    { value: 'guardian', label: 'Guardian (Tutor)' },
    { value: 'backup_guardian', label: 'Backup Guardian' },
    { value: 'undertutor', label: 'Undertutor' },
    { value: 'backup_undertutor', label: 'Backup Undertutor' },
    { value: 'backup_executor', label: 'Backup Executor' },
    { value: 'backup_poa_financial', label: 'Backup Power of Attorney - Financial' },
    { value: 'backup_poa_medical', label: 'Backup Power of Attorney - Medical' },
    { value: 'designee_remains', label: 'Designee for Remains/Burial/Services' },
    { value: 'backup_designee_remains', label: 'Backup Designee for Remains/Burial/Services' },
    { value: 'special_trustee', label: 'Special Trustee' },
    { value: 'backup_trustee', label: 'Backup Trustee' },
    { value: 'other', label: 'Other' }
  ]

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

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Estate Planning Wizard submitted:', {
      people,
      assets,
      beneficiaries,
      decisionMakers
    })
    // Navigate to review/summary page
    navigate('/')
  }

  return (
    <div ref={pageRef} className="min-h-screen text-black bg-white">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div ref={headerRef} className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2" style={{ fontFamily: 'var(--ll-font)' }}>
            Estate Planning Wizard
          </h1>
          <p className="text-gray-600">
            Complete your estate planning in one integrated form. Start with your Cast of Characters, then assign roles and link people throughout your plan.
          </p>
        </div>

        {/* Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          
          {/* Cast of Characters Section */}
          <div className="mb-8">
            <button
              type="button"
              onClick={() => toggleSection('castOfCharacters')}
              className="flex items-center justify-between w-full text-left text-xl font-semibold text-gray-900 mb-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span>Cast of Characters</span>
              <svg
                className={`w-6 h-6 transform transition-transform ${expandedSections.castOfCharacters ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {expandedSections.castOfCharacters && (
              <div className="space-y-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-gray-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h3 className="text-sm font-medium text-gray-800">Cast of Characters</h3>
                      <p className="text-sm text-gray-700 mt-1">
                        Add children, family members, advisors, and other people involved in your estate planning here. 
                        <strong>Note:</strong> Your personal information and spouse details are handled in the "About You" section, not here.
                        Each person can have multiple roles. Once entered, you can assign them to various roles throughout the application without re-entering their information.
                      </p>
                    </div>
                  </div>
                </div>

                {people.map((person, index) => (
                  <div key={person.id} className="p-6 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Person {index + 1}
                      </h3>
                      {people.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePerson(person.id)}
                          className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                        >
                          Remove Person
                        </button>
                      )}
                    </div>

                    {/* Personal Information */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            First Name
                          </label>
                          <input
                            type="text"
                            value={person.firstName}
                            onChange={(e) => handlePersonChange(person.id, 'firstName', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name
                          </label>
                          <input
                            type="text"
                            value={person.lastName}
                            onChange={(e) => handlePersonChange(person.id, 'lastName', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={person.contactInfo.phone}
                            onChange={(e) => {
                              const formatted = formatPhone(e.target.value)
                              handlePersonChange(person.id, 'contactInfo.phone', formatted)
                            }}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                            placeholder="(555) 123-4567"
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={person.contactInfo.email}
                            onChange={(e) => handlePersonChange(person.id, 'contactInfo.email', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                            placeholder="person@example.com"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date of Birth
                          </label>
                          <div className="grid grid-cols-3 gap-3">
                            <input
                              type="number"
                              value={person.dateOfBirth.month}
                              onChange={(e) => handlePersonChange(person.id, 'dateOfBirth.month', e.target.value)}
                              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                              placeholder="MM"
                            />
                            <input
                              type="number"
                              value={person.dateOfBirth.day}
                              onChange={(e) => handlePersonChange(person.id, 'dateOfBirth.day', e.target.value)}
                              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                              placeholder="DD"
                            />
                            <input
                              type="number"
                              value={person.dateOfBirth.year}
                              onChange={(e) => handlePersonChange(person.id, 'dateOfBirth.year', e.target.value)}
                              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                              placeholder="YYYY"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Roles */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Roles
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {roleOptions.map(role => (
                          <label key={role.value} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={person.roles.includes(role.value)}
                              onChange={(e) => handleRoleChange(person.id, role.value, e.target.checked)}
                              className="mr-2 text-gray-600 focus:ring-gray-500"
                            />
                            <span className="text-sm text-gray-700">{role.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addPerson}
                  className="px-6 py-3 text-white rounded-lg transition-colors duration-200 font-medium"
                  style={{ background: 'linear-gradient(90deg, var(--ll-bg-2), var(--ll-bg-1))' }}
                >
                  + Add Another Person
                </button>
              </div>
            )}
          </div>


          {/* Advisors Section */}
          <div className="mb-8">
            <button
              type="button"
              onClick={() => toggleSection('advisors')}
              className="flex items-center justify-between w-full text-left text-xl font-semibold text-gray-900 mb-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span>Professional Advisors</span>
              <svg
                className={`w-6 h-6 transform transition-transform ${expandedSections.advisors ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {expandedSections.advisors && (
              <div className="space-y-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-gray-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h3 className="text-sm font-medium text-gray-800">Professional Advisors</h3>
                      <p className="text-sm text-gray-700 mt-1">
                        Add your professional advisors (attorneys, financial advisors, accountants, etc.) 
                        to your Cast of Characters with the "Professional Advisor" role, or add them directly here.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-6 border border-gray-200 rounded-lg bg-gray-50">
                  <p className="text-gray-600 text-center">
                    You can add professional advisors either through the Cast of Characters section above 
                    or add them directly in this section. Both methods will work for your estate planning needs.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Assets Section */}
          <div className="mb-8">
            <button
              type="button"
              onClick={() => toggleSection('assets')}
              className="flex items-center justify-between w-full text-left text-xl font-semibold text-gray-900 mb-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span>Assets</span>
              <svg
                className={`w-6 h-6 transform transition-transform ${expandedSections.assets ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {expandedSections.assets && (
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

                    {/* Asset Owners - Link to Cast of Characters */}
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Asset Owners (from Cast of Characters)
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
            )}
          </div>

          {/* Beneficiaries Section */}
          <div className="mb-8">
            <button
              type="button"
              onClick={() => toggleSection('beneficiaries')}
              className="flex items-center justify-between w-full text-left text-xl font-semibold text-gray-900 mb-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span>Beneficiaries & Inheritors</span>
              <svg
                className={`w-6 h-6 transform transition-transform ${expandedSections.beneficiaries ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {expandedSections.beneficiaries && (
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
                          Person (from Cast of Characters)
                        </label>
                        <select
                          value={beneficiary.personId || ''}
                          onChange={(e) => handleBeneficiaryChange(beneficiary.id, 'personId', parseInt(e.target.value) || null)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                        >
                          <option value="">Select person...</option>
                          {people.map(person => (
                            <option key={person.id} value={person.id}>
                              {getPersonDisplayName(person.id)}
                            </option>
                          ))}
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
            )}
          </div>

          {/* Asset Distribution Calculator Section */}
          <div className="mb-8">
            <button
              type="button"
              onClick={() => toggleSection('assetDistribution')}
              className="flex items-center justify-between w-full text-left text-xl font-semibold text-gray-900 mb-4 p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              <span>Asset Distribution Calculator</span>
              <svg
                className={`w-6 h-6 transform transition-transform ${expandedSections.assetDistribution ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {expandedSections.assetDistribution && (
              <div className="space-y-6">
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-indigo-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h3 className="text-sm font-medium text-indigo-800">Structured Distribution Planning</h3>
                      <p className="text-sm text-indigo-700 mt-1">
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
            )}
          </div>

          {/* Decision Makers Section */}
          <div className="mb-8">
            <button
              type="button"
              onClick={() => toggleSection('decisionMakers')}
              className="flex items-center justify-between w-full text-left text-xl font-semibold text-gray-900 mb-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span>Decision Makers</span>
              <svg
                className={`w-6 h-6 transform transition-transform ${expandedSections.decisionMakers ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {expandedSections.decisionMakers && (
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
                          Person (from Cast of Characters)
                        </label>
                        <select
                          value={decisionMaker.personId || ''}
                          onChange={(e) => handleDecisionMakerChange(decisionMaker.id, 'personId', parseInt(e.target.value) || null)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                        >
                          <option value="">Select person...</option>
                          {people.map(person => (
                            <option key={person.id} value={person.id}>
                              {getPersonDisplayName(person.id)}
                            </option>
                          ))}
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
                          Co-Role Person (from Cast of Characters)
                        </label>
                        <select
                          value={decisionMaker.coRolePersonId || ''}
                          onChange={(e) => handleDecisionMakerChange(decisionMaker.id, 'coRolePersonId', parseInt(e.target.value) || null)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                        >
                          <option value="">Select co-role person...</option>
                          {people.map(person => (
                            <option key={person.id} value={person.id}>
                              {getPersonDisplayName(person.id)}
                            </option>
                          ))}
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
            )}
          </div>

          {/* Documents Section */}
          <div className="mb-8">
            <button
              type="button"
              onClick={() => toggleSection('documents')}
              className="flex items-center justify-between w-full text-left text-xl font-semibold text-gray-900 mb-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span>Documents</span>
              <svg
                className={`w-6 h-6 transform transition-transform ${expandedSections.documents ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {expandedSections.documents && (
              <div className="space-y-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-gray-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <h3 className="text-sm font-medium text-gray-800">Estate Planning Documents</h3>
                      <p className="text-sm text-gray-700 mt-1">
                        Document existing wills, trusts, powers of attorney, and other estate planning documents. 
                        This helps ensure your new plan coordinates with existing arrangements.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-6 border border-gray-200 rounded-lg bg-gray-50">
                  <p className="text-gray-600 text-center">
                    Document management will be integrated in a future update. 
                    For now, you can add notes about existing documents in the notes section of each person or asset.
                  </p>
                </div>
              </div>
            )}
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
              Complete Estate Plan
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
