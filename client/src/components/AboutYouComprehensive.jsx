import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { usePeople } from '../contexts/PeopleContext'

export default function AboutYou() {
  const navigate = useNavigate()
  const pageRef = useRef(null)
  const formRef = useRef(null)
  const headerRef = useRef(null)
  const { addPerson, updatePerson, people } = usePeople()

  useEffect(() => {
    const tl = gsap.timeline()
    
    // Simple fade-in animation
    tl.fromTo(pageRef.current, 
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: "none" }
    )
  }, [])

  const [formData, setFormData] = useState({
    // Person table fields
    legalFirstName: '',
    middleName: '',
    legalLastName: '',
    suffix: '',
    preferredName: '',
    socialSecurityNumber: '',
    dateOfBirth: {
      month: '',
      day: '',
      year: ''
    },
    birthCountry: '',
    birthState: '',
    birthCity: '',
    
    // Client table fields
    maritalStatus: '',
    residenceCountry: '',
    residenceState: '',
    residenceParish: '',
    residenceCity: '',
    residenceZipCode: '',
    residenceAddress1: '',
    residenceAddress2: '',
    
    // Additional fields from ER diagram
    gender: '',
    usCitizen: '',
    additionalCitizenship: '',
    otherCitizenship: '',
    priorNames: '',
    
    // Marital record fields (if married)
    marriageDate: '',
    marriageCountry: '',
    marriageState: '',
    marriageCity: '',
    hasPreMaritalAgreement: false,
    hasPostMaritalAgreement: false,
    livedInCommunityPropertyState: false,
    
    // Spouse Information (if married)
    spouseFirstName: '',
    spouseMiddleName: '',
    spouseLastName: '',
    spouseSuffix: '',
    spousePreferredName: '',
    spouseSSN: '',
    spouseDateOfBirth: {
      month: '',
      day: '',
      year: ''
    },
    spouseBirthCountry: '',
    spouseBirthState: '',
    spouseBirthCity: '',
    spousePhone: '',
    spouseEmail: '',
    
    // Executor/Administrator Information
    isExecutorOrAdmin: false,
    decedentInfo: {
      firstName: '',
      lastName: '',
      dateOfDeath: ''
    },
    
    // Divorce Information
    numberOfPreviousSpouses: '',
    exSpouseName: '',
    divorceDate: '',
    
    // Widow Information
    deceasedSpouseName: '',
    deceasedSpouseDateOfDeath: '',
    
    // Contact Information
    phone: '',
    email: '',
    
    // Children Information
    children: []
  })

  const [children, setChildren] = useState([])
  const [previousSpouses, setPreviousSpouses] = useState([])

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleDateChange = (field, value, type) => {
    let numValue = parseInt(value) || ''
    
    if (type === 'month') {
      numValue = Math.min(Math.max(numValue, 1), 12)
    } else if (type === 'day') {
      numValue = Math.min(Math.max(numValue, 1), 31)
    } else if (type === 'year') {
      const currentYear = new Date().getFullYear()
      numValue = Math.min(Math.max(numValue, 1900), currentYear)
    }
    
    handleInputChange(field, numValue)
  }

  const formatSSN = (value) => {
    // Remove all non-numeric characters
    const numbers = value.replace(/\D/g, '')
    
    // Format as XXX-XX-XXXX
    if (numbers.length <= 3) {
      return numbers
    } else if (numbers.length <= 5) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 5)}-${numbers.slice(5, 9)}`
    }
  }

  const handleSSNChange = (e) => {
    const formatted = formatSSN(e.target.value)
    handleInputChange('socialSecurityNumber', formatted)
  }

  const addChild = () => {
    const newChild = {
      id: Date.now(),
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
    }
    setChildren([...children, newChild])
  }

  const removeChild = (childId) => {
    setChildren(children.filter(child => child.id !== childId))
  }

  const handleChildChange = (childId, field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setChildren(children.map(c => 
        c.id === childId 
          ? { ...c, [parent]: { ...c[parent], [child]: value } }
          : c
      ))
    } else {
      setChildren(children.map(c => 
        c.id === childId 
          ? { ...c, [field]: value }
          : c
      ))
    }
  }

  const handleChildDateChange = (childId, field, value, type) => {
    let numValue = parseInt(value) || ''
    
    if (type === 'month') {
      numValue = Math.min(Math.max(numValue, 1), 12)
    } else if (type === 'day') {
      numValue = Math.min(Math.max(numValue, 1), 31)
    } else if (type === 'year') {
      const currentYear = new Date().getFullYear()
      numValue = Math.min(Math.max(numValue, 1900), currentYear)
    }
    
    handleChildChange(childId, field, numValue)
  }

  const addPreviousSpouse = () => {
    const newSpouse = {
      id: Date.now(),
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
      marriageDate: '',
      marriageLocation: '',
      divorceDate: '',
      divorceLocation: '',
      deathDate: '',
      deathLocation: '',
      status: 'divorced', // divorced, widowed, separated
      address: {
        line1: '',
        line2: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'US'
      }
    }
    setPreviousSpouses([...previousSpouses, newSpouse])
  }

  const removePreviousSpouse = (spouseId) => {
    setPreviousSpouses(previousSpouses.filter(spouse => spouse.id !== spouseId))
  }

  const handlePreviousSpouseChange = (spouseId, field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setPreviousSpouses(previousSpouses.map(s => 
        s.id === spouseId 
          ? { ...s, [parent]: { ...s[parent], [child]: value } }
          : s
      ))
    } else {
      setPreviousSpouses(previousSpouses.map(s => 
        s.id === spouseId 
          ? { ...s, [field]: value }
          : s
      ))
    }
  }

  const handlePreviousSpouseDateChange = (spouseId, field, value, type) => {
    let numValue = parseInt(value) || ''
    
    if (type === 'month') {
      numValue = Math.min(Math.max(numValue, 1), 12)
    } else if (type === 'day') {
      numValue = Math.min(Math.max(numValue, 1), 31)
    } else if (type === 'year') {
      const currentYear = new Date().getFullYear()
      numValue = Math.min(Math.max(numValue, 1900), currentYear)
    }
    
    handlePreviousSpouseChange(spouseId, field, numValue)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Add main person to people context
    const mainPersonId = addPerson({
      firstName: formData.legalFirstName,
      middleName: formData.middleName,
      lastName: formData.legalLastName,
      suffix: formData.suffix,
      preferredName: formData.preferredName,
      ssn: formData.socialSecurityNumber,
      dateOfBirth: formData.dateOfBirth,
      birthCountry: formData.birthCountry,
      birthState: formData.birthState,
      birthCity: formData.birthCity,
      contactInfo: {
        phone: formData.phone,
        email: formData.email,
        address: {
          line1: formData.residenceAddress1,
          line2: formData.residenceAddress2,
          city: formData.residenceCity,
          state: formData.residenceState,
          zipCode: formData.residenceZipCode,
          country: formData.residenceCountry
        }
      },
      roles: ['client']
    })

    // Add spouse if married
    if (formData.maritalStatus === 'Married' && formData.spouseFirstName) {
      addPerson({
        firstName: formData.spouseFirstName,
        middleName: formData.spouseMiddleName,
        lastName: formData.spouseLastName,
        suffix: formData.spouseSuffix,
        preferredName: formData.spousePreferredName,
        ssn: formData.spouseSSN,
        dateOfBirth: formData.spouseDateOfBirth,
        birthCountry: formData.spouseBirthCountry,
        birthState: formData.spouseBirthState,
        birthCity: formData.spouseBirthCity,
        contactInfo: {
          phone: formData.spousePhone,
          email: formData.spouseEmail,
          address: {
            line1: formData.residenceAddress1,
            line2: formData.residenceAddress2,
            city: formData.residenceCity,
            state: formData.residenceState,
            zipCode: formData.residenceZipCode,
            country: formData.residenceCountry
          }
        },
        roles: ['spouse']
      })
    }

    // Add children
    children.forEach(child => {
      if (child.firstName || child.lastName) {
        addPerson({
          firstName: child.firstName,
          middleName: child.middleName,
          lastName: child.lastName,
          suffix: child.suffix,
          preferredName: child.preferredName,
          ssn: child.ssn,
          dateOfBirth: child.dateOfBirth,
          birthCountry: child.birthCountry,
          birthState: child.birthState,
          birthCity: child.birthCity,
          contactInfo: {
            phone: child.phone,
            email: child.email,
            address: child.address
          },
          roles: ['child']
        })
      }
    })

    // Add previous spouses
    previousSpouses.forEach(spouse => {
      if (spouse.firstName || spouse.lastName) {
        addPerson({
          firstName: spouse.firstName,
          middleName: spouse.middleName,
          lastName: spouse.lastName,
          suffix: spouse.suffix,
          preferredName: spouse.preferredName,
          ssn: spouse.ssn,
          dateOfBirth: spouse.dateOfBirth,
          birthCountry: spouse.birthCountry,
          birthState: spouse.birthState,
          birthCity: spouse.birthCity,
          contactInfo: {
            phone: spouse.phone,
            email: spouse.email,
            address: spouse.address
          },
          roles: ['ex-spouse'],
          maritalHistory: {
            marriageDate: spouse.marriageDate,
            marriageLocation: spouse.marriageLocation,
            divorceDate: spouse.divorceDate,
            divorceLocation: spouse.divorceLocation,
            deathDate: spouse.deathDate,
            deathLocation: spouse.deathLocation,
            status: spouse.status
          }
        })
      }
    })

    console.log('Form submitted:', formData)
    // Navigate to assets section
    navigate('/assets')
  }

  // Louisiana Parishes
  const louisianaParishes = [
    'Acadia', 'Allen', 'Ascension', 'Assumption', 'Avoyelles', 'Beauregard', 'Bienville', 'Bossier', 
    'Caddo', 'Calcasieu', 'Caldwell', 'Cameron', 'Catahoula', 'Claiborne', 'Concordia', 'De Soto', 
    'East Baton Rouge', 'East Carroll', 'East Feliciana', 'Evangeline', 'Franklin', 'Grant', 'Iberia', 
    'Iberville', 'Jackson', 'Jefferson', 'Jefferson Davis', 'Lafayette', 'Lafourche', 'LaSalle', 'Lincoln', 
    'Livingston', 'Madison', 'Morehouse', 'Natchitoches', 'Orleans', 'Ouachita', 'Plaquemines', 'Pointe Coupee', 
    'Rapides', 'Red River', 'Richland', 'Sabine', 'St. Bernard', 'St. Charles', 'St. Helena', 'St. James', 
    'St. John the Baptist', 'St. Landry', 'St. Martin', 'St. Mary', 'St. Tammany', 'Tangipahoa', 'Tensas', 
    'Terrebonne', 'Union', 'Vermilion', 'Vernon', 'Washington', 'Webster', 'West Baton Rouge', 'West Carroll', 
    'West Feliciana', 'Winn'
  ]

  return (
    <div ref={pageRef} className="min-h-screen text-black bg-white">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div ref={headerRef} className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2" style={{ fontFamily: 'var(--ll-font)' }}>
            About You
          </h1>
          <p className="text-gray-600">
            Please provide your personal information below. Fill in your information if you are conducting your estate planning, 
            or if you are representing someone as an executor or administrator for another person that has passed away.
          </p>
        </div>

        {/* Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Legal First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Legal First Name *
                </label>
                <input
                  type="text"
                  value={formData.legalFirstName}
                  onChange={(e) => handleInputChange('legalFirstName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                />
              </div>

              {/* Prefer to be called */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prefer to be called / nickname
                </label>
                <input
                  type="text"
                  value={formData.preferredName}
                  onChange={(e) => handleInputChange('preferredName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                />
              </div>

              {/* Prior names */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prior names / Other names known by
                </label>
                <input
                  type="text"
                  value={formData.priorNames}
                  onChange={(e) => handleInputChange('priorNames', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender *
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              {/* US Citizen */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  US Citizen? *
                </label>
                <div className="flex space-x-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="usCitizen"
                      value="Yes"
                      checked={formData.usCitizen === 'Yes'}
                      onChange={(e) => handleInputChange('usCitizen', e.target.value)}
                      className="mr-2 text-gray-600 focus:ring-gray-500"
                    />
                    <span className="text-sm text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="usCitizen"
                      value="No"
                      checked={formData.usCitizen === 'No'}
                      onChange={(e) => handleInputChange('usCitizen', e.target.value)}
                      className="mr-2 text-gray-600 focus:ring-gray-500"
                    />
                    <span className="text-sm text-gray-700">No</span>
                  </label>
                </div>
              </div>

              {/* Executor/Administrator Section */}
              <div className="col-span-2">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <label className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      checked={formData.isExecutorOrAdmin}
                      onChange={(e) => handleInputChange('isExecutorOrAdmin', e.target.checked)}
                      className="mr-3 text-gray-600 focus:ring-gray-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Are you filling this form out as an executor or administrator for someone who has passed away?
                    </span>
                  </label>
                  
                  {formData.isExecutorOrAdmin && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Decedent First Name
                        </label>
                        <input
                          type="text"
                          value={formData.decedentInfo.firstName}
                          onChange={(e) => handleInputChange('decedentInfo.firstName', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Decedent Last Name
                        </label>
                        <input
                          type="text"
                          value={formData.decedentInfo.lastName}
                          onChange={(e) => handleInputChange('decedentInfo.lastName', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date of Death
                        </label>
                        <input
                          type="date"
                          value={formData.decedentInfo.dateOfDeath}
                          onChange={(e) => handleInputChange('decedentInfo.dateOfDeath', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Marital Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What is your Marital Status? *
                </label>
                <div className="flex items-center space-x-3">
                  <select
                    value={formData.maritalStatus}
                    onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  >
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                    <option value="Separated">Separated</option>
                    <option value="Partnered">Partnered</option>
                    <option value="Other">Other</option>
                  </select>
                  <button
                    type="button"
                    className="px-4 py-3 text-white rounded-lg transition-colors duration-200 font-medium"
                    style={{ background: 'linear-gradient(90deg, var(--ll-bg-2), var(--ll-bg-1))', color: 'white' }}
                  >
                    Adjust
                  </button>
                </div>
              </div>

              {/* Parish */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What parish do you currently reside in? *
                </label>
                <select
                  value={formData.residenceParish}
                  onChange={(e) => handleInputChange('residenceParish', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                >
                  <option value="">Choose...</option>
                  {louisianaParishes.map(parish => (
                    <option key={parish} value={parish}>{parish}</option>
                  ))}
                  <option value="Other">Other (Please specify)</option>
                </select>
              </div>

              {/* Birth Place */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Where were you born? (please provide both city and state) *
                </label>
                <input
                  type="text"
                  value={formData.birthCountry}
                  onChange={(e) => handleInputChange('birthCountry', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="City, State"
                />
              </div>

              {/* Additional Citizenship */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Citizenship?
                </label>
                <select
                  value={formData.additionalCitizenship}
                  onChange={(e) => handleInputChange('additionalCitizenship', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                >
                  <option value="None">None</option>
                  <option value="Canada">Canada</option>
                  <option value="Mexico">Mexico</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Other">Other</option>
                </select>
                {formData.additionalCitizenship === 'Other' && (
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Please specify other citizenship
                    </label>
                    <input
                      type="text"
                      value={formData.otherCitizenship}
                      onChange={(e) => handleInputChange('otherCitizenship', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                      placeholder="Enter citizenship"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Middle Initial */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Middle Initial(s)
                </label>
                <input
                  type="text"
                  value={formData.middleName}
                  onChange={(e) => handleInputChange('middleName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  maxLength="5"
                />
              </div>

              {/* Legal Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Legal Last Name *
                </label>
                <input
                  type="text"
                  value={formData.legalLastName}
                  onChange={(e) => handleInputChange('legalLastName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                />
              </div>

              {/* Suffix */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Suffix
                </label>
                <input
                  type="text"
                  value={formData.suffix}
                  onChange={(e) => handleInputChange('suffix', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="Jr., Sr., II, III, etc."
                />
              </div>

              {/* Social Security Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Social Security Number *
                </label>
                <input
                  type="text"
                  value={formData.socialSecurityNumber}
                  onChange={handleSSNChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="XXX-XX-XXXX"
                  maxLength="11"
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Month</label>
                    <input
                      type="number"
                      value={formData.dateOfBirth.month}
                      onChange={(e) => handleDateChange('dateOfBirth.month', e.target.value, 'month')}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                      min="1"
                      max="12"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Day</label>
                    <input
                      type="number"
                      value={formData.dateOfBirth.day}
                      onChange={(e) => handleDateChange('dateOfBirth.day', e.target.value, 'day')}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                      min="1"
                      max="31"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Year</label>
                    <input
                      type="number"
                      value={formData.dateOfBirth.year}
                      onChange={(e) => handleDateChange('dateOfBirth.year', e.target.value, 'year')}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                      min="1900"
                      max={new Date().getFullYear()}
                    />
                  </div>
                </div>
              </div>

              {/* Current Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Address Line 1
                </label>
                <input
                  type="text"
                  value={formData.residenceAddress1}
                  onChange={(e) => handleInputChange('residenceAddress1', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="Street address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Address Line 2
                </label>
                <input
                  type="text"
                  value={formData.residenceAddress2}
                  onChange={(e) => handleInputChange('residenceAddress2', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="Apartment, suite, etc."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.residenceCity}
                    onChange={(e) => handleInputChange('residenceCity', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    value={formData.residenceZipCode}
                    onChange={(e) => handleInputChange('residenceZipCode', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    placeholder="70112"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Marriage Details Section (if married) */}
          {formData.maritalStatus === 'Married' && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Marriage Details</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marriage Date
                  </label>
                  <input
                    type="date"
                    value={formData.marriageDate}
                    onChange={(e) => handleInputChange('marriageDate', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marriage Location
                  </label>
                  <input
                    type="text"
                    value={formData.marriageCity}
                    onChange={(e) => handleInputChange('marriageCity', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    placeholder="City, State"
                  />
                </div>
                <div className="lg:col-span-2">
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.hasPreMaritalAgreement}
                        onChange={(e) => handleInputChange('hasPreMaritalAgreement', e.target.checked)}
                        className="mr-2 text-gray-600 focus:ring-gray-500"
                      />
                      <span className="text-sm text-gray-700">Has Pre-Marital Agreement</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.hasPostMaritalAgreement}
                        onChange={(e) => handleInputChange('hasPostMaritalAgreement', e.target.checked)}
                        className="mr-2 text-gray-600 focus:ring-gray-500"
                      />
                      <span className="text-sm text-gray-700">Has Post-Marital Agreement</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.livedInCommunityPropertyState}
                        onChange={(e) => handleInputChange('livedInCommunityPropertyState', e.target.checked)}
                        className="mr-2 text-gray-600 focus:ring-gray-500"
                      />
                      <span className="text-sm text-gray-700">Lived in Community Property State</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Spouse Information Section (if married) */}
          {formData.maritalStatus === 'Married' && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Spouse Information</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Spouse First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.spouseFirstName}
                    onChange={(e) => handleInputChange('spouseFirstName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    placeholder="Spouse's first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Spouse Middle Name
                  </label>
                  <input
                    type="text"
                    value={formData.spouseMiddleName}
                    onChange={(e) => handleInputChange('spouseMiddleName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    placeholder="Middle name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Spouse Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.spouseLastName}
                    onChange={(e) => handleInputChange('spouseLastName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    placeholder="Spouse's last name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Spouse Suffix
                  </label>
                  <input
                    type="text"
                    value={formData.spouseSuffix}
                    onChange={(e) => handleInputChange('spouseSuffix', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    placeholder="Jr., Sr., II, III, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Spouse Preferred Name / Nickname
                  </label>
                  <input
                    type="text"
                    value={formData.spousePreferredName}
                    onChange={(e) => handleInputChange('spousePreferredName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    placeholder="What they prefer to be called"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Spouse Social Security Number
                  </label>
                  <input
                    type="text"
                    value={formData.spouseSSN}
                    onChange={(e) => {
                      const formatted = formatSSN(e.target.value)
                      handleInputChange('spouseSSN', formatted)
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    placeholder="XXX-XX-XXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Spouse Date of Birth
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <select
                      value={formData.spouseDateOfBirth.month}
                      onChange={(e) => handleDateChange('spouseDateOfBirth.month', e.target.value, 'month')}
                      className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    >
                      <option value="">Month</option>
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {new Date(0, i).toLocaleString('default', { month: 'long' })}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={formData.spouseDateOfBirth.day}
                      onChange={(e) => handleDateChange('spouseDateOfBirth.day', e.target.value, 'day')}
                      className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                      placeholder="Day"
                      min="1"
                      max="31"
                    />
                    <input
                      type="number"
                      value={formData.spouseDateOfBirth.year}
                      onChange={(e) => handleDateChange('spouseDateOfBirth.year', e.target.value, 'year')}
                      className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                      placeholder="Year"
                      min="1900"
                      max={new Date().getFullYear()}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Spouse Birth Place
                  </label>
                  <input
                    type="text"
                    value={formData.spouseBirthCountry}
                    onChange={(e) => handleInputChange('spouseBirthCountry', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    placeholder="City, State"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Spouse Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.spousePhone}
                    onChange={(e) => handleInputChange('spousePhone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Spouse Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.spouseEmail}
                    onChange={(e) => handleInputChange('spouseEmail', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    placeholder="spouse.email@example.com"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Divorce Information Section (if divorced) */}
          {formData.maritalStatus === 'Divorced' && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Divorce Information</h3>
              
              {/* Number of Previous Spouses */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How many previous spouses have you had? *
                </label>
                <select
                  value={formData.numberOfPreviousSpouses}
                  onChange={(e) => handleInputChange('numberOfPreviousSpouses', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                >
                  <option value="">Select number...</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="more">More than 5</option>
                </select>
              </div>

              {/* Previous Spouses Management */}
              {formData.numberOfPreviousSpouses && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-md font-semibold text-gray-800">Previous Spouses Details</h4>
                    <button
                      type="button"
                      onClick={addPreviousSpouse}
                      className="px-4 py-2 text-white rounded-lg transition-colors duration-200 font-medium text-sm"
                      style={{ background: 'linear-gradient(90deg, var(--ll-bg-2), var(--ll-bg-1))' }}
                    >
                      + Add Previous Spouse
                    </button>
                  </div>
                  
                  {previousSpouses.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                      <p>No previous spouses added yet. Click "Add Previous Spouse" to add information about past marriages.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {previousSpouses.map((spouse, index) => (
                        <div key={spouse.id} className="p-6 border border-gray-200 rounded-lg">
                          <div className="flex justify-between items-center mb-4">
                            <h5 className="text-md font-semibold text-gray-800">Previous Spouse {index + 1}</h5>
                            <button
                              type="button"
                              onClick={() => removePreviousSpouse(spouse.id)}
                              className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                            >
                              Remove Spouse
                            </button>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Personal Information */}
                            <div className="space-y-4">
                              <h6 className="text-sm font-medium text-gray-700 border-b border-gray-200 pb-2">Personal Information</h6>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  First Name
                                </label>
                                <input
                                  type="text"
                                  value={spouse.firstName}
                                  onChange={(e) => handlePreviousSpouseChange(spouse.id, 'firstName', e.target.value)}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                                  placeholder="Spouse's first name"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Last Name
                                </label>
                                <input
                                  type="text"
                                  value={spouse.lastName}
                                  onChange={(e) => handlePreviousSpouseChange(spouse.id, 'lastName', e.target.value)}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                                  placeholder="Spouse's last name"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Preferred Name / Nickname
                                </label>
                                <input
                                  type="text"
                                  value={spouse.preferredName}
                                  onChange={(e) => handlePreviousSpouseChange(spouse.id, 'preferredName', e.target.value)}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                                  placeholder="What they preferred to be called"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Date of Birth
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                            <input
                              type="number"
                              value={spouse.dateOfBirth.month}
                              onChange={(e) => handlePreviousSpouseDateChange(spouse.id, 'dateOfBirth.month', e.target.value, 'month')}
                              className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                              placeholder="MM"
                              min="1"
                              max="12"
                            />
                            <input
                              type="number"
                              value={spouse.dateOfBirth.day}
                              onChange={(e) => handlePreviousSpouseDateChange(spouse.id, 'dateOfBirth.day', e.target.value, 'day')}
                              className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                              placeholder="DD"
                              min="1"
                              max="31"
                            />
                            <input
                              type="number"
                              value={spouse.dateOfBirth.year}
                              onChange={(e) => handlePreviousSpouseDateChange(spouse.id, 'dateOfBirth.year', e.target.value, 'year')}
                              className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                              placeholder="YYYY"
                              min="1900"
                              max={new Date().getFullYear()}
                            />
                                </div>
                              </div>
                            </div>

                            {/* Marriage/Divorce Information */}
                            <div className="space-y-4">
                              <h6 className="text-sm font-medium text-gray-700 border-b border-gray-200 pb-2">Marriage & Separation Information</h6>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Status
                                </label>
                                <select
                                  value={spouse.status}
                                  onChange={(e) => handlePreviousSpouseChange(spouse.id, 'status', e.target.value)}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                                >
                                  <option value="divorced">Divorced</option>
                                  <option value="widowed">Widowed</option>
                                  <option value="separated">Separated</option>
                                </select>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Marriage Date
                                </label>
                                <input
                                  type="date"
                                  value={spouse.marriageDate}
                                  onChange={(e) => handlePreviousSpouseChange(spouse.id, 'marriageDate', e.target.value)}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Marriage Location
                                </label>
                                <input
                                  type="text"
                                  value={spouse.marriageLocation}
                                  onChange={(e) => handlePreviousSpouseChange(spouse.id, 'marriageLocation', e.target.value)}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                                  placeholder="City, State"
                                />
                              </div>
                              
                              {(spouse.status === 'divorced' || spouse.status === 'separated') && (
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {spouse.status === 'divorced' ? 'Divorce Date' : 'Separation Date'}
                                  </label>
                                  <input
                                    type="date"
                                    value={spouse.divorceDate}
                                    onChange={(e) => handlePreviousSpouseChange(spouse.id, 'divorceDate', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                                  />
                                </div>
                              )}
                              
                              {spouse.status === 'widowed' && (
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Date of Death
                                  </label>
                                  <input
                                    type="date"
                                    value={spouse.deathDate}
                                    onChange={(e) => handlePreviousSpouseChange(spouse.id, 'deathDate', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                                  />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Contact Information */}
                          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number
                              </label>
                              <input
                                type="tel"
                                value={spouse.phone}
                                onChange={(e) => handlePreviousSpouseChange(spouse.id, 'phone', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                                placeholder="(555) 123-4567"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                              </label>
                              <input
                                type="email"
                                value={spouse.email}
                                onChange={(e) => handlePreviousSpouseChange(spouse.id, 'email', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                                placeholder="spouse.email@example.com"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Widow Information Section (if widowed) */}
          {formData.maritalStatus === 'Widowed' && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Deceased Spouse Information</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deceased Spouse Name
                  </label>
                  <input
                    type="text"
                    value={formData.deceasedSpouseName}
                    onChange={(e) => handleInputChange('deceasedSpouseName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    placeholder="Full name of deceased spouse"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Death
                  </label>
                  <input
                    type="date"
                    value={formData.deceasedSpouseDateOfDeath}
                    onChange={(e) => handleInputChange('deceasedSpouseDateOfDeath', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Contact Information Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>
          </div>

          {/* Children Information Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Children Information</h3>
              <button
                type="button"
                onClick={addChild}
                className="px-4 py-2 text-white rounded-lg transition-colors duration-200 font-medium text-sm"
                style={{ background: 'linear-gradient(90deg, var(--ll-bg-2), var(--ll-bg-1))' }}
              >
                + Add Child
              </button>
            </div>
            
            {children.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No children added yet. Click "Add Child" to add your children's information.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {children.map((child, index) => (
                  <div key={child.id} className="p-6 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-md font-semibold text-gray-800">Child {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeChild(child.id)}
                        className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                      >
                        Remove Child
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={child.firstName}
                          onChange={(e) => handleChildChange(child.id, 'firstName', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                          placeholder="Child's first name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={child.lastName}
                          onChange={(e) => handleChildChange(child.id, 'lastName', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                          placeholder="Child's last name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Preferred Name / Nickname
                        </label>
                        <input
                          type="text"
                          value={child.preferredName}
                          onChange={(e) => handleChildChange(child.id, 'preferredName', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                          placeholder="What they prefer to be called"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date of Birth
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          <input
                            type="number"
                            value={child.dateOfBirth.month}
                            onChange={(e) => handleChildDateChange(child.id, 'dateOfBirth.month', e.target.value, 'month')}
                            className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                            placeholder="MM"
                            min="1"
                            max="12"
                          />
                          <input
                            type="number"
                            value={child.dateOfBirth.day}
                            onChange={(e) => handleChildDateChange(child.id, 'dateOfBirth.day', e.target.value, 'day')}
                            className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                            placeholder="DD"
                            min="1"
                            max="31"
                          />
                          <input
                            type="number"
                            value={child.dateOfBirth.year}
                            onChange={(e) => handleChildDateChange(child.id, 'dateOfBirth.year', e.target.value, 'year')}
                            className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                            placeholder="YYYY"
                            min="1900"
                            max={new Date().getFullYear()}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={child.phone}
                          onChange={(e) => handleChildChange(child.id, 'phone', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                          placeholder="(555) 123-4567"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={child.email}
                          onChange={(e) => handleChildChange(child.id, 'email', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                          placeholder="child.email@example.com"
                        />
                      </div>
                    </div>
                  </div>
                ))}
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
