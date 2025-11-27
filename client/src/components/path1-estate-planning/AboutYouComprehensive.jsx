import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { usePeople } from '../../contexts/PeopleContext'

export default function AboutYou() {
  const navigate = useNavigate()
  const pageRef = useRef(null)
  const formRef = useRef(null)
  const headerRef = useRef(null)
  const { addPerson, updatePerson, people } = usePeople()

  useEffect(() => {
    const tl = gsap.timeline()
    
    // Page entrance animation
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
    socialSecurityNumber: '',
    dateOfBirth: {
      month: '',
      day: '',
      year: ''
    },
    birthState: '',
    birthCity: '',
    
    // Client table fields
  residenceCountry: 'US',
  residenceCountryOption: 'US',
    residenceState: '',
    residenceParish: '',
    residenceCity: '',
    residenceZipCode: '',
    residenceAddress1: '',
    residenceAddress2: '',
    
    // Extended person data fields
    usCitizen: '',
    dualCitizen: '',
    citizenship: '',
    otherCitizenship: '',
    priorNames: [],
    
    // Marriage Status
    hasBeenMarried: false,
    
    // Executor/Administrator Information
    isExecutorOrAdmin: false,
    decedentInfo: {
      firstName: '',
      lastName: '',
      dateOfDeath: '',
      // placeOfDeath: structured so we can capture US vs foreign details
      placeOfDeath: {
        passedInUS: null, // true | false | null
        us: { city: '', state: '', zip: '' },
        foreign: { country: '', city: '' }
      }
    },
    
    // Contact Information
    phone: '',
    email: '',
    
    // Children Information
    children: []
  })

  const [children, setChildren] = useState([])
  const [spouses, setSpouses] = useState([])
  const [previousSpouses, setPreviousSpouses] = useState([])
  const [priorNames, setPriorNames] = useState([])

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
    // For year, allow partial input without immediate validation
    if (type === 'year') {
      // Allow empty string or partial year input (1-4 digits)
      if (value === '' || /^\d{1,4}$/.test(value)) {
        handleInputChange(field, value)
      }
      return
    }

    // For month/day we store the raw string the user types so
    // they can enter leading zeros (e.g. "01"). Validate allowed
    // characters and clamp numeric values when they exceed limits.
    if (value === '' || /^\d{1,2}$/.test(value)) {
      if (value !== '') {
        const n = parseInt(value, 10)
        if (type === 'month') {
          if (n > 12) value = '12'
          // allow '0' as intermediate input (so don't coerce to empty)
        } else if (type === 'day') {
          if (n > 31) value = '31'
        }
      }
      handleInputChange(field, value)
    }
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

  const addSpouse = () => {
    const newSpouse = {
      id: Date.now(),
      firstName: '',
      middleName: '',
      lastName: '',
      suffix: '',
      ssn: '',
      dateOfBirth: { month: '', day: '', year: '' },
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
        country: 'US',
        countryOption: 'same'
      },
      relationship: 'married', // married, divorced, widowed, separated
      marriageDate: { month: '', day: '', year: '' },
      divorceDate: { month: '', day: '', year: '' },
      deathDate: { month: '', day: '', year: '' },
      isCurrent: false,
      priorNames: []
    }
    setSpouses([...spouses, newSpouse])
  }

  const removeSpouse = (spouseId) => {
    setSpouses(spouses.filter(s => s.id !== spouseId))
  }

  const handleSpouseChange = (spouseId, field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setSpouses(spouses.map(s => 
        s.id === spouseId 
          ? { ...s, [parent]: { ...s[parent], [child]: value } }
          : s
      ))
    } else {
      setSpouses(spouses.map(s => 
        s.id === spouseId 
          ? { ...s, [field]: value }
          : s
      ))
    }
  }

  const handleSpouseDateChange = (spouseId, field, value, type) => {
    // Year: allow partial input
    if (type === 'year') {
      if (value === '' || /^\d{1,4}$/.test(value)) {
        handleSpouseChange(spouseId, field, value)
      }
      return
    }

    // Month/Day: accept typed string (allow leading zero) and clamp if out of range
    if (value === '' || /^\d{1,2}$/.test(value)) {
      if (value !== '') {
        const n = parseInt(value, 10)
        if (type === 'month' && n > 12) value = '12'
        if (type === 'day' && n > 31) value = '31'
      }
      handleSpouseChange(spouseId, field, value)
    }
  }

  const addSpousePriorName = (spouseId) => {
    const newPriorName = {
      id: Date.now(),
      firstName: '',
      middleName: '',
      lastName: '',
      suffix: '',
      effectiveDate: { month: '', day: '', year: '' },
      reason: ''
    }
    setSpouses(spouses.map(s => 
      s.id === spouseId 
        ? { ...s, priorNames: [...s.priorNames, newPriorName] }
        : s
    ))
  }

  const removeSpousePriorName = (spouseId, nameId) => {
    setSpouses(spouses.map(s => 
      s.id === spouseId 
        ? { ...s, priorNames: s.priorNames.filter(name => name.id !== nameId) }
        : s
    ))
  }

  const handleSpousePriorNameChange = (spouseId, nameId, field, value) => {
    setSpouses(spouses.map(s => {
      if (s.id !== spouseId) return s
      
      if (field.includes('.')) {
        const [parent, child] = field.split('.')
        return {
          ...s,
          priorNames: s.priorNames.map(n => 
            n.id === nameId 
              ? { ...n, [parent]: { ...n[parent], [child]: value } }
              : n
          )
        }
      } else {
        return {
          ...s,
          priorNames: s.priorNames.map(n => 
            n.id === nameId 
              ? { ...n, [field]: value }
              : n
          )
        }
      }
    }))
  }

  const handleSpousePriorNameDateChange = (spouseId, nameId, field, value, type) => {
    if (type === 'year') {
      if (value === '' || /^\d{1,4}$/.test(value)) {
        handleSpousePriorNameChange(spouseId, nameId, field, value)
      }
      return
    }

    if (value === '' || /^\d{1,2}$/.test(value)) {
      if (value !== '') {
        const n = parseInt(value, 10)
        if (type === 'month' && n > 12) value = '12'
        if (type === 'day' && n > 31) value = '31'
      }
      handleSpousePriorNameChange(spouseId, nameId, field, value)
    }
  }

  const addChild = () => {
    const newChild = {
      id: Date.now(),
      firstName: '',
      middleName: '',
      lastName: '',
      suffix: '',
      ssn: '',
      dateOfBirth: { month: '', day: '', year: '' },
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
        country: 'US',
        countryOption: 'same'
      },
      specialNeeds: false,
      specialNeedsDescription: '',
      parentRelationship: '', // 'your', 'both', 'spouse'
      isDeceased: false,
      dateOfDeath: { month: '', day: '', year: '' },
      // placeOfDeath structure: passedInUS | us details | foreign details
      placeOfDeath: {
        passedInUS: null, // true | false | null
        us: { city: '', state: '', zip: '' },
        foreign: { country: '', city: '' }
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
    // For year, allow partial input without immediate validation
    if (type === 'year') {
      // Allow empty string or partial year input
      if (value === '' || /^\d{1,4}$/.test(value)) {
        handleChildChange(childId, field, value)
      }
      return
    }
    
    // Month/Day: allow leading zeros by storing raw string, clamp if out of range
    if (value === '' || /^\d{1,2}$/.test(value)) {
      if (value !== '') {
        const n = parseInt(value, 10)
        if (type === 'month' && n > 12) value = '12'
        if (type === 'day' && n > 31) value = '31'
      }
      handleChildChange(childId, field, value)
    }
  }

  const handleChildDeathDateChange = (childId, field, value, type) => {
    // For year, allow partial input without immediate validation
    if (type === 'year') {
      // Allow empty string or partial year input
      if (value === '' || /^\d{1,4}$/.test(value)) {
        handleChildChange(childId, field, value)
      }
      return
    }
    
    if (value === '' || /^\d{1,2}$/.test(value)) {
      if (value !== '') {
        const n = parseInt(value, 10)
        if (type === 'month' && n > 12) value = '12'
        if (type === 'day' && n > 31) value = '31'
      }
      handleChildChange(childId, field, value)
    }
  }

  const addPriorName = () => {
    const newPriorName = {
      id: Date.now(),
      firstName: '',
      middleName: '',
      lastName: '',
      suffix: '',
      effectiveDate: { month: '', day: '', year: '' },
      reason: '' // marriage, divorce, legal name change, etc.
    }
    setPriorNames([...priorNames, newPriorName])
  }

  const removePriorName = (nameId) => {
    setPriorNames(priorNames.filter(name => name.id !== nameId))
  }

  const handlePriorNameChange = (nameId, field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setPriorNames(priorNames.map(n => 
        n.id === nameId 
          ? { ...n, [parent]: { ...n[parent], [child]: value } }
          : n
      ))
    } else {
      setPriorNames(priorNames.map(n => 
        n.id === nameId 
          ? { ...n, [field]: value }
          : n
      ))
    }
  }

  const handlePriorNameDateChange = (nameId, field, value, type) => {
    if (type === 'year') {
      if (value === '' || /^\d{1,4}$/.test(value)) {
        handlePriorNameChange(nameId, field, value)
      }
      return
    }
    
    if (value === '' || /^\d{1,2}$/.test(value)) {
      if (value !== '') {
        const n = parseInt(value, 10)
        if (type === 'month' && n > 12) value = '12'
        if (type === 'day' && n > 31) value = '31'
      }
      handlePriorNameChange(nameId, field, value)
    }
  }

  const addPreviousSpouse = () => {
    const newSpouse = {
      id: Date.now(),
      firstName: '',
      middleName: '',
      lastName: '',
      suffix: '',
      ssn: '',
      dateOfBirth: { month: '', day: '', year: '' },
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
    // Year: allow partial input (1-4 digits)
    if (type === 'year') {
      if (value === '' || /^\d{1,4}$/.test(value)) {
        handlePreviousSpouseChange(spouseId, field, value)
      }
      return
    }

    // Month/Day: accept typed string (allow leading zero) and clamp if out of range
    if (value === '' || /^\d{1,2}$/.test(value)) {
      if (value !== '') {
        const n = parseInt(value, 10)
        if (type === 'month' && n > 12) value = '12'
        if (type === 'day' && n > 31) value = '31'
      }
      handlePreviousSpouseChange(spouseId, field, value)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Register primary person in context
    const mainPersonId = addPerson({
      firstName: formData.legalFirstName,
      middleName: formData.middleName,
      lastName: formData.legalLastName,
      suffix: formData.suffix,
      ssn: formData.socialSecurityNumber,
      dateOfBirth: formData.dateOfBirth,
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

    // Register spouse information
    spouses.forEach(spouse => {
      if (spouse.firstName || spouse.lastName) {
        addPerson({
          firstName: spouse.firstName,
          middleName: spouse.middleName,
          lastName: spouse.lastName,
          suffix: spouse.suffix,
          ssn: spouse.ssn,
          dateOfBirth: spouse.dateOfBirth,
          birthState: spouse.birthState,
          birthCity: spouse.birthCity,
          contactInfo: {
            phone: spouse.phone,
            email: spouse.email,
            address: spouse.address
          },
          roles: [spouse.relationship === 'married' ? 'spouse' : 'ex-spouse'],
          maritalHistory: {
            relationship: spouse.relationship,
            marriageDate: spouse.marriageDate,
            divorceDate: spouse.divorceDate,
            deathDate: spouse.deathDate,
            isCurrent: spouse.isCurrent
          }
        })
      }
    })

    // Register children information
    children.forEach(child => {
      if (child.firstName || child.lastName) {
        addPerson({
          firstName: child.firstName,
          middleName: child.middleName,
          lastName: child.lastName,
          suffix: child.suffix,
          ssn: child.ssn,
          dateOfBirth: child.dateOfBirth,
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


    console.log('Form submitted:', formData)
    console.log('About to navigate to /assets')
    
    // Navigate to assets section
    try {
      navigate('/assets')
      console.log('Navigation successful')
    } catch (error) {
      console.error('Navigation error:', error)
      // Fallback navigation
      window.location.href = '/assets'
    }
  }

  // US States
  const usStates = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri',
    'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina',
    'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ]

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
            Please provide your personal information below.
          </p>
        </div>

        {/* Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

              {/* If US Citizen - Ask about Dual Citizenship */}
              {formData.usCitizen === 'Yes' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dual Citizen? *
                  </label>
                  <div className="flex space-x-6">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="dualCitizen"
                        value="Yes"
                        checked={formData.dualCitizen === 'Yes'}
                        onChange={(e) => handleInputChange('dualCitizen', e.target.value)}
                        className="mr-2 text-gray-600 focus:ring-gray-500"
                      />
                      <span className="text-sm text-gray-700">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="dualCitizen"
                        value="No"
                        checked={formData.dualCitizen === 'No'}
                        onChange={(e) => handleInputChange('dualCitizen', e.target.value)}
                        className="mr-2 text-gray-600 focus:ring-gray-500"
                      />
                      <span className="text-sm text-gray-700">No</span>
                    </label>
                  </div>
                </div>
              )}

              {/* If Dual Citizen - Ask for Country */}
              {formData.usCitizen === 'Yes' && formData.dualCitizen === 'Yes' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Citizenship Country *
                  </label>
                  <input
                    type="text"
                    value={formData.citizenship}
                    onChange={(e) => handleInputChange('citizenship', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    placeholder="Enter country name"
                  />
                </div>
              )}

              {/* If Not US Citizen - Ask for Citizenship Country */}
              {formData.usCitizen === 'No' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country of Citizenship *
                  </label>
                  <input
                    type="text"
                    value={formData.citizenship}
                    onChange={(e) => handleInputChange('citizenship', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    placeholder="Enter country name"
                  />
                </div>
              )}

              {/* Prior Names Section */}
              <div className="col-span-2 mt-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <div className="mb-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Prior Names / Former Names</h3>
                        <p className="text-sm text-gray-600">Add any previous names you've been known by (maiden name, previous married name, legal name changes, etc.)</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={addPriorName}
                      className="mt-4 px-6 py-3 text-white rounded-lg transition-colors duration-200 font-medium"
                      style={{ background: 'linear-gradient(90deg, var(--ll-bg-2), var(--ll-bg-1))' }}
                    >
                      + Add Prior Name
                    </button>
                  </div>
                  
                  {priorNames.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No prior names added yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {priorNames.map((name, index) => (
                        <div key={name.id} className="p-4 bg-white border border-gray-200 rounded-lg">
                          <div className="flex justify-between items-center mb-3">
                            <h4 className="text-sm font-semibold text-gray-800">Prior Name {index + 1}</h4>
                            <button
                              type="button"
                              onClick={() => removePriorName(name.id)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                              Remove
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                First Name
                              </label>
                              <input
                                type="text"
                                value={name.firstName}
                                onChange={(e) => handlePriorNameChange(name.id, 'firstName', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Middle Name
                              </label>
                              <input
                                type="text"
                                value={name.middleName}
                                onChange={(e) => handlePriorNameChange(name.id, 'middleName', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Last Name
                              </label>
                              <input
                                type="text"
                                value={name.lastName}
                                onChange={(e) => handlePriorNameChange(name.id, 'lastName', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Suffix
                              </label>
                              <input
                                type="text"
                                value={name.suffix}
                                onChange={(e) => handlePriorNameChange(name.id, 'suffix', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-sm"
                                placeholder="Jr., Sr., II, etc."
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Reason for Change
                              </label>
                              <select
                                value={name.reason}
                                onChange={(e) => handlePriorNameChange(name.id, 'reason', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-sm"
                              >
                                <option value="">Select reason</option>
                                <option value="marriage">Marriage</option>
                                <option value="divorce">Divorce</option>
                                <option value="legal_change">Legal Name Change</option>
                                <option value="adoption">Adoption</option>
                                <option value="other">Other</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Effective Date (MM/DD/YYYY)
                              </label>
                              <div className="grid grid-cols-3 gap-2">
                                <input
                                  type="text"
                                  value={name.effectiveDate.month}
                                  onChange={(e) => handlePriorNameDateChange(name.id, 'effectiveDate.month', e.target.value, 'month')}
                                  className="px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-sm"
                                  placeholder="MM"
                                  maxLength="2"
                                />
                                <input
                                  type="text"
                                  value={name.effectiveDate.day}
                                  onChange={(e) => handlePriorNameDateChange(name.id, 'effectiveDate.day', e.target.value, 'day')}
                                  className="px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-sm"
                                  placeholder="DD"
                                  maxLength="2"
                                />
                                <input
                                  type="text"
                                  value={name.effectiveDate.year}
                                  onChange={(e) => handlePriorNameDateChange(name.id, 'effectiveDate.year', e.target.value, 'year')}
                                  className="px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-sm"
                                  placeholder="YYYY"
                                  maxLength="4"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Executor/Administrator Section */}
              <div className="col-span-2 mt-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
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
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Place of Death
                        </label>
                        <div className="space-y-3">
                          <div className="text-sm text-gray-700">Did he/she pass in the US?</div>
                          <div className="flex items-center space-x-6">
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name={`decedent_passed_us`}
                                value="yes"
                                checked={formData.decedentInfo.placeOfDeath.passedInUS === true}
                                onChange={() => handleInputChange('decedentInfo', { ...formData.decedentInfo, placeOfDeath: { ...formData.decedentInfo.placeOfDeath, passedInUS: true } })}
                                className="mr-2 text-gray-600 focus:ring-gray-500"
                              />
                              <span className="text-sm text-gray-700">Yes</span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name={`decedent_passed_us`}
                                value="no"
                                checked={formData.decedentInfo.placeOfDeath.passedInUS === false}
                                onChange={() => handleInputChange('decedentInfo', { ...formData.decedentInfo, placeOfDeath: { ...formData.decedentInfo.placeOfDeath, passedInUS: false } })}
                                className="mr-2 text-gray-600 focus:ring-gray-500"
                              />
                              <span className="text-sm text-gray-700">No</span>
                            </label>
                          </div>

                          {formData.decedentInfo.placeOfDeath.passedInUS === true && (
                            <div className="grid grid-cols-3 gap-2">
                              <input
                                type="text"
                                value={formData.decedentInfo.placeOfDeath.us.city}
                                onChange={(e) => handleInputChange('decedentInfo', { ...formData.decedentInfo, placeOfDeath: { ...formData.decedentInfo.placeOfDeath, us: { ...formData.decedentInfo.placeOfDeath.us, city: e.target.value } } })}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                                placeholder="City"
                              />
                              <select
                                value={formData.decedentInfo.placeOfDeath.us.state}
                                onChange={(e) => handleInputChange('decedentInfo', { ...formData.decedentInfo, placeOfDeath: { ...formData.decedentInfo.placeOfDeath, us: { ...formData.decedentInfo.placeOfDeath.us, state: e.target.value } } })}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                              >
                                <option value="">State</option>
                                {usStates.map(state => (
                                  <option key={state} value={state}>{state}</option>
                                ))}
                              </select>
                              <input
                                type="text"
                                value={formData.decedentInfo.placeOfDeath.us.zip}
                                onChange={(e) => handleInputChange('decedentInfo', { ...formData.decedentInfo, placeOfDeath: { ...formData.decedentInfo.placeOfDeath, us: { ...formData.decedentInfo.placeOfDeath.us, zip: e.target.value } } })}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                                placeholder="ZIP"
                              />
                            </div>
                          )}

                          {formData.decedentInfo.placeOfDeath.passedInUS === false && (
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={formData.decedentInfo.placeOfDeath.foreign.country}
                                onChange={(e) => handleInputChange('decedentInfo', { ...formData.decedentInfo, placeOfDeath: { ...formData.decedentInfo.placeOfDeath, foreign: { ...formData.decedentInfo.placeOfDeath.foreign, country: e.target.value } } })}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                                placeholder="Country"
                              />
                              <input
                                type="text"
                                value={formData.decedentInfo.placeOfDeath.foreign.city}
                                onChange={(e) => handleInputChange('decedentInfo', { ...formData.decedentInfo, placeOfDeath: { ...formData.decedentInfo.placeOfDeath, foreign: { ...formData.decedentInfo.placeOfDeath.foreign, city: e.target.value } } })}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                                placeholder="City"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Marriage Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Have you now or in the past been married? *
                </label>
                <div className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hasBeenMarried"
                      value="yes"
                      checked={formData.hasBeenMarried === true}
                      onChange={(e) => handleInputChange('hasBeenMarried', e.target.value === 'yes')}
                      className="mr-2 text-gray-600 focus:ring-gray-500"
                    />
                    <span className="text-sm text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="hasBeenMarried"
                      value="no"
                      checked={formData.hasBeenMarried === false}
                      onChange={(e) => handleInputChange('hasBeenMarried', e.target.value === 'yes')}
                      className="mr-2 text-gray-600 focus:ring-gray-500"
                    />
                    <span className="text-sm text-gray-700">No</span>
                  </label>
                </div>
              </div>

              {/* Country of Residence (USA or Other) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country of Residence *
                </label>
                <div className="flex items-center space-x-6 mb-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="residenceCountryOption"
                      value="US"
                      checked={formData.residenceCountryOption === 'US'}
                      onChange={() => { handleInputChange('residenceCountryOption', 'US'); handleInputChange('residenceCountry', 'US') }}
                      className="mr-2 text-gray-600 focus:ring-gray-500"
                    />
                    <span className="text-sm text-gray-700">United States</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="residenceCountryOption"
                      value="Other"
                      checked={formData.residenceCountryOption === 'Other'}
                      onChange={() => { handleInputChange('residenceCountryOption', 'Other'); handleInputChange('residenceCountry', '') }}
                      className="mr-2 text-gray-600 focus:ring-gray-500"
                    />
                    <span className="text-sm text-gray-700">Other</span>
                  </label>
                </div>

                {formData.residenceCountryOption === 'Other' ? (
                  <div>
                    <input
                      type="text"
                      value={formData.residenceCountry}
                      onChange={(e) => handleInputChange('residenceCountry', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                      placeholder="Country"
                    />
                  </div>
                ) : (
                  <div className="text-sm text-gray-600">We'll assume United States as your country of residence.</div>
                )}
              </div>

              {/* Parish - Only show if Louisiana is selected */}
              {formData.residenceCountryOption === 'US' && formData.residenceState === 'Louisiana' && (
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
              )}

            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Middle Name */}
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                  Middle Name
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
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Month</label>
                    <input
                      type="text"
                      value={formData.dateOfBirth.month}
                      onChange={(e) => handleDateChange('dateOfBirth.month', e.target.value, 'month')}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                      placeholder="MM"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Day</label>
                    <input
                      type="text"
                      value={formData.dateOfBirth.day}
                      onChange={(e) => handleDateChange('dateOfBirth.day', e.target.value, 'day')}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                      placeholder="DD"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Year</label>
                    <input
                      type="text"
                      value={formData.dateOfBirth.year}
                      onChange={(e) => handleDateChange('dateOfBirth.year', e.target.value, 'year')}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                      placeholder="YYYY"
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

              {formData.residenceCountryOption === 'US' && (
                <div className="grid grid-cols-3 gap-2">
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
                      State
                    </label>
                    <div className="relative">
                      <select
                        value={formData.residenceState}
                        onChange={(e) => handleInputChange('residenceState', e.target.value)}
                        className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 appearance-none bg-white"
                        style={{ minHeight: '48px' }}
                      >
                        <option value="">Select State</option>
                        {usStates.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
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
              )}
            </div>
          </div>

          {/* Marriage Details Section (if married) */}
          {formData.maritalStatus === 'Married' && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Marriage Details</h3>
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


          {/* Divorce Information Section (if divorced) - REMOVED */}
          {false && (
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
                                  <option value="separated">Separated</option>
                                  <option value="widowed">Widowed</option>
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

          {/* Widow Information Section (if widowed) - REMOVED */}
          {false && (
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
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Contact Information</h3>
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

          {/* Spouse Information Section */}
          {formData.hasBeenMarried && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Spouse Information</h3>
                <button
                  type="button"
                  onClick={addSpouse}
                  className="px-4 py-2 text-white rounded-lg transition-colors duration-200 font-medium text-sm"
                  style={{ background: 'linear-gradient(90deg, var(--ll-bg-2), var(--ll-bg-1))' }}
                >
                  + Add Spouse
                </button>
              </div>
              
              {spouses.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No spouses added yet. Click "Add Spouse" to add spouse information.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {spouses.map((spouse, index) => (
                    <div key={spouse.id} className="p-6 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-center mb-6">
                        <h4 className="text-md font-semibold text-gray-900">
                          Spouse {index + 1}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeSpouse(spouse.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Remove Spouse
                        </button>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Relationship Type */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Relationship *
                          </label>
                          <select
                            value={spouse.relationship}
                            onChange={(e) => handleSpouseChange(spouse.id, 'relationship', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                          >
                            <option value="divorced">Divorced</option>
                            <option value="married">Currently Married</option>
                            <option value="separated">Separated</option>
                            <option value="widowed">Widowed</option>
                          </select>
                        </div>

                        {/* Current Spouse Checkbox */}
                        <div className="flex items-center">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={spouse.isCurrent}
                              onChange={(e) => handleSpouseChange(spouse.id, 'isCurrent', e.target.checked)}
                              className="mr-2 text-gray-600 focus:ring-gray-500"
                            />
                            <span className="text-sm text-gray-700">This is my current spouse</span>
                          </label>
                        </div>

                        {/* Name Fields */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            First Name *
                  </label>
                  <input
                    type="text"
                            value={spouse.firstName}
                            onChange={(e) => handleSpouseChange(spouse.id, 'firstName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                            placeholder="First name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            value={spouse.lastName}
                            onChange={(e) => handleSpouseChange(spouse.id, 'lastName', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                            placeholder="Last name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Middle Name
                          </label>
                          <input
                            type="text"
                            value={spouse.middleName}
                            onChange={(e) => handleSpouseChange(spouse.id, 'middleName', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                            placeholder="Middle name"
                          />
                        </div>

                        {/* Marriage Date */}
                        {spouse.relationship === 'married' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Marriage Date
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <select
                                value={spouse.marriageDate.month}
                                onChange={(e) => handleSpouseDateChange(spouse.id, 'marriageDate.month', e.target.value, 'month')}
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
                                type="text"
                                value={spouse.marriageDate.day}
                                onChange={(e) => handleSpouseDateChange(spouse.id, 'marriageDate.day', e.target.value, 'day')}
                      className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                                placeholder="DD"
                    />
                    <input
                                type="text"
                                value={spouse.marriageDate.year}
                                onChange={(e) => handleSpouseDateChange(spouse.id, 'marriageDate.year', e.target.value, 'year')}
                      className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                                placeholder="YYYY"
                    />
                  </div>
                </div>
                        )}

                        {/* Divorce Date */}
                        {spouse.relationship === 'divorced' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                              Divorce Date
                  </label>
                            <div className="grid grid-cols-3 gap-2">
                              <select
                                value={spouse.divorceDate.month}
                                onChange={(e) => handleSpouseDateChange(spouse.id, 'divorceDate.month', e.target.value, 'month')}
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
                    type="text"
                                value={spouse.divorceDate.day}
                                onChange={(e) => handleSpouseDateChange(spouse.id, 'divorceDate.day', e.target.value, 'day')}
                                className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                                placeholder="DD"
                              />
                              <input
                                type="text"
                                value={spouse.divorceDate.year}
                                onChange={(e) => handleSpouseDateChange(spouse.id, 'divorceDate.year', e.target.value, 'year')}
                                className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                                placeholder="YYYY"
                  />
                </div>
                </div>
                        )}

                        {/* Death Date */}
                        {spouse.relationship === 'widowed' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                              Date of Death
                  </label>
                            <div className="grid grid-cols-3 gap-2">
                              <select
                                value={spouse.deathDate.month}
                                onChange={(e) => handleSpouseDateChange(spouse.id, 'deathDate.month', e.target.value, 'month')}
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
                                type="text"
                                value={spouse.deathDate.day}
                                onChange={(e) => handleSpouseDateChange(spouse.id, 'deathDate.day', e.target.value, 'day')}
                                className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                                placeholder="DD"
                              />
                              <input
                                type="text"
                                value={spouse.deathDate.year}
                                onChange={(e) => handleSpouseDateChange(spouse.id, 'deathDate.year', e.target.value, 'year')}
                                className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                                placeholder="YYYY"
                              />
                </div>
                          </div>
                        )}

                        {/* Contact Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                  </label>
                  <input
                    type="tel"
                            value={spouse.phone}
                            onChange={(e) => handleSpouseChange(spouse.id, 'phone', e.target.value)}
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
                            onChange={(e) => handleSpouseChange(spouse.id, 'email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                            placeholder="email@example.com"
                  />
                </div>

                {/* Spouse Country of Residence - Same as client or Other */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country of Residence</label>
                  <div className="flex items-center space-x-6 mb-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name={`spouse_country_option_${spouse.id}`}
                        value="same"
                        checked={spouse.address?.countryOption === 'same' || (!spouse.address?.countryOption && spouse.address?.country === formData.residenceCountry)}
                        onChange={() => handleSpouseChange(spouse.id, 'address', { ...spouse.address, country: formData.residenceCountry, countryOption: 'same' })}
                        className="mr-2 text-gray-600 focus:ring-gray-500"
                      />
                      <span className="text-sm text-gray-700">Same as client</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name={`spouse_country_option_${spouse.id}`}
                        value="other"
                        checked={spouse.address?.countryOption === 'other'}
                        onChange={() => handleSpouseChange(spouse.id, 'address', { ...spouse.address, country: '', countryOption: 'other' })}
                        className="mr-2 text-gray-600 focus:ring-gray-500"
                      />
                      <span className="text-sm text-gray-700">Other</span>
                    </label>
                  </div>

                  {spouse.address?.countryOption === 'other' ? (
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={spouse.address?.country}
                        onChange={(e) => handleSpouseChange(spouse.id, 'address.country', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                        placeholder="Country"
                      />
                      <select
                        value={spouse.address?.state || ''}
                        onChange={(e) => handleSpouseChange(spouse.id, 'address.state', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                      >
                        <option value="">Select State</option>
                        {usStates.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600">Using client's country: {formData.residenceCountry || 'United States'}</div>
                  )}
                </div>

                {/* Document Upload for Spouse */}
                <div className="mt-6">
                  <h4 className="text-md font-semibold text-gray-800 mb-4">Related Documents</h4>
                  <div className="space-y-4">
                    {spouse.relationship === 'married' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Marriage Documents
                        </label>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Document Type
                            </label>
                            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200">
                              <option value="">Select document type...</option>
                              <option value="marriage_certificate">Marriage Certificate</option>
                              <option value="prenuptial_agreement">Prenuptial Agreement</option>
                              <option value="divorce_decree">Divorce Decree</option>
                            </select>
                          </div>
                          <div className="flex items-center space-x-4">
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                            />
                            <span className="text-sm text-gray-500">Upload selected document</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {spouse.relationship === 'divorced' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                          Divorce Decree
                  </label>
                        <div className="flex items-center space-x-4">
                  <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                          />
                          <span className="text-sm text-gray-500">Upload divorce decree</span>
                </div>
                      </div>
                    )}
                    
                    {spouse.relationship === 'widowed' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                          Death Certificate
                  </label>
                        <div className="flex items-center space-x-4">
                  <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                          />
                          <span className="text-sm text-gray-500">Upload death certificate</span>
                </div>
              </div>
                    )}

                    {/* Spouse Prior Names Section */}
                    <div className="mt-6 col-span-2">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                        <div className="mb-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">Prior Names / Former Names</h3>
                              <p className="text-sm text-gray-600 mt-1">Add any previous names your spouse has been known by (maiden name, previous married name, legal name changes, etc.)</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => addSpousePriorName(spouse.id)}
                            className="mt-4 px-6 py-3 text-white rounded-lg transition-colors duration-200 font-medium"
                            style={{ background: 'linear-gradient(90deg, var(--ll-bg-2), var(--ll-bg-1))' }}
                          >
                            + Add Prior Name
                          </button>
                        </div>
                        
                        {spouse.priorNames.length === 0 ? (
                          <p className="text-sm text-gray-500 italic">No prior names added yet.</p>
                        ) : (
                          <div className="space-y-4">
                            {spouse.priorNames.map((priorName, nameIndex) => (
                              <div key={priorName.id} className="bg-white border border-gray-200 rounded-lg p-4">
                                <div className="flex justify-between items-center mb-4">
                                  <h4 className="text-sm font-semibold text-gray-900">
                                    Prior Name {nameIndex + 1}
                                  </h4>
                                  <button
                                    type="button"
                                    onClick={() => removeSpousePriorName(spouse.id, priorName.id)}
                                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                                  >
                                    Remove
                                  </button>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                  {/* First Name */}
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      First Name
                                    </label>
                                    <input
                                      type="text"
                                      value={priorName.firstName}
                                      onChange={(e) => handleSpousePriorNameChange(spouse.id, priorName.id, 'firstName', e.target.value)}
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                                      placeholder="First name"
                                    />
                                  </div>

                                  {/* Middle Name */}
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Middle Name
                                    </label>
                                    <input
                                      type="text"
                                      value={priorName.middleName}
                                      onChange={(e) => handleSpousePriorNameChange(spouse.id, priorName.id, 'middleName', e.target.value)}
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                                      placeholder="Middle name"
                                    />
                                  </div>

                                  {/* Last Name */}
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Last Name
                                    </label>
                                    <input
                                      type="text"
                                      value={priorName.lastName}
                                      onChange={(e) => handleSpousePriorNameChange(spouse.id, priorName.id, 'lastName', e.target.value)}
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                                      placeholder="Last name"
                                    />
                                  </div>

                                  {/* Suffix */}
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Suffix
                                    </label>
                                    <select
                                      value={priorName.suffix}
                                      onChange={(e) => handleSpousePriorNameChange(spouse.id, priorName.id, 'suffix', e.target.value)}
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                                    >
                                      <option value="">None</option>
                                      <option value="Jr.">Jr.</option>
                                      <option value="Sr.">Sr.</option>
                                      <option value="II">II</option>
                                      <option value="III">III</option>
                                      <option value="IV">IV</option>
                                    </select>
                                  </div>

                                  {/* Reason for Change */}
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Reason for Name Change
                                    </label>
                                    <select
                                      value={priorName.reason}
                                      onChange={(e) => handleSpousePriorNameChange(spouse.id, priorName.id, 'reason', e.target.value)}
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                                    >
                                      <option value="">Select reason</option>
                                      <option value="marriage">Marriage</option>
                                      <option value="divorce">Divorce</option>
                                      <option value="legal_name_change">Legal Name Change</option>
                                      <option value="other">Other</option>
                                    </select>
                                  </div>

                                  {/* Effective Date */}
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Effective Date
                                    </label>
                                    <div className="flex space-x-2">
                                      <input
                                        type="number"
                                        min="1"
                                        max="12"
                                        placeholder="MM"
                                        value={priorName.effectiveDate.month}
                                        onChange={(e) => handleSpousePriorNameDateChange(spouse.id, priorName.id, 'effectiveDate.month', e.target.value, 'month')}
                                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                                      />
                                      <input
                                        type="number"
                                        min="1"
                                        max="31"
                                        placeholder="DD"
                                        value={priorName.effectiveDate.day}
                                        onChange={(e) => handleSpousePriorNameDateChange(spouse.id, priorName.id, 'effectiveDate.day', e.target.value, 'day')}
                                        className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                                      />
                                      <input
                                        type="number"
                                        min="1900"
                                        max="2100"
                                        placeholder="YYYY"
                                        value={priorName.effectiveDate.year}
                                        onChange={(e) => handleSpousePriorNameDateChange(spouse.id, priorName.id, 'effectiveDate.year', e.target.value, 'year')}
                                        className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Children Information Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center mb-6">
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
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-lg font-semibold text-gray-900">Child {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeChild(child.id)}
                        className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                      >
                        Remove Child
                      </button>
                    </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                    Middle Name
                  </label>
                  <input
                    type="text"
                    value={child.middleName}
                    onChange={(e) => handleChildChange(child.id, 'middleName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    placeholder="Middle name"
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
                          Date of Birth
                  </label>
                        <div className="grid grid-cols-3 gap-2">
                          <input
                            type="text"
                            value={child.dateOfBirth.month}
                            onChange={(e) => handleChildDateChange(child.id, 'dateOfBirth.month', e.target.value, 'month')}
                            className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                            placeholder="MM"
                          />
                          <input
                            type="text"
                            value={child.dateOfBirth.day}
                            onChange={(e) => handleChildDateChange(child.id, 'dateOfBirth.day', e.target.value, 'day')}
                            className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                            placeholder="DD"
                          />
                          <input
                            type="text"
                            value={child.dateOfBirth.year}
                            onChange={(e) => handleChildDateChange(child.id, 'dateOfBirth.year', e.target.value, 'year')}
                            className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                            placeholder="YYYY"
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

            {/* Child Address - allow adult children living elsewhere to have address */}
            <div className="mt-4 grid grid-cols-1 gap-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Child's Address (if different)</label>
              <input
                type="text"
                value={child.address?.line1}
                onChange={(e) => handleChildChange(child.id, 'address.line1', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                placeholder="Address Line 1"
              />
              <input
                type="text"
                value={child.address?.line2}
                onChange={(e) => handleChildChange(child.id, 'address.line2', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                placeholder="Address Line 2 (apt, suite, etc.)"
              />
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  value={child.address?.city}
                  onChange={(e) => handleChildChange(child.id, 'address.city', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="City"
                />
                <select
                  value={child.address?.state || ''}
                  onChange={(e) => handleChildChange(child.id, 'address.state', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                >
                  <option value="">Select State</option>
                  {usStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={child.address?.zipCode}
                  onChange={(e) => handleChildChange(child.id, 'address.zipCode', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                  placeholder="ZIP"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country of Residence</label>
                <div className="flex items-center space-x-6 mb-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name={`child_country_option_${child.id}`}
                      value="same"
                      checked={child.address?.countryOption === 'same' || (!child.address?.countryOption && child.address?.country === formData.residenceCountry)}
                      onChange={() => handleChildChange(child.id, 'address', { ...child.address, country: formData.residenceCountry, countryOption: 'same' })}
                      className="mr-2 text-gray-600 focus:ring-gray-500"
                    />
                    <span className="text-sm text-gray-700">Same as client</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name={`child_country_option_${child.id}`}
                      value="other"
                      checked={child.address?.countryOption === 'other'}
                      onChange={() => handleChildChange(child.id, 'address', { ...child.address, country: '', countryOption: 'other' })}
                      className="mr-2 text-gray-600 focus:ring-gray-500"
                    />
                    <span className="text-sm text-gray-700">Other</span>
                  </label>
                </div>

                {child.address?.countryOption === 'other' ? (
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={child.address?.country}
                      onChange={(e) => handleChildChange(child.id, 'address.country', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                      placeholder="Country"
                    />
                    <select
                      value={child.address?.state || ''}
                      onChange={(e) => handleChildChange(child.id, 'address.state', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    >
                      <option value="">Select State</option>
                      {usStates.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="text-sm text-gray-600">Using client's country: {formData.residenceCountry || 'United States'}</div>
                )}
              </div>
            </div>

                    {/* Special Needs Section */}
                    <div className="mt-6">
                      <label className="flex items-center mb-4">
                        <input
                          type="checkbox"
                          checked={child.specialNeeds}
                          onChange={(e) => handleChildChange(child.id, 'specialNeeds', e.target.checked)}
                          className="mr-2 text-gray-600 focus:ring-gray-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Does this child have any special needs or known medical, developmental, or mental health conditions—either suspected or diagnosed—that we should be aware of to provide appropriate support?
                        </span>
                      </label>
                      
                      {child.specialNeeds && (
                        <div className="mt-3">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Please describe the special needs or conditions
                          </label>
                          <textarea
                            value={child.specialNeedsDescription}
                            onChange={(e) => handleChildChange(child.id, 'specialNeedsDescription', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                            rows="3"
                            placeholder="Describe any special needs, medical conditions, or diagnoses..."
                          />
                        </div>
                      )}
          </div>

                    {/* Parent Relationship Section */}
                    <div className="mt-6">
                      <label className="block text-lg font-semibold text-gray-900 mb-3">
                        Whose child is this?
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name={`parentRelationship_${child.id}`}
                            value="your"
                            checked={child.parentRelationship === 'your'}
                            onChange={(e) => handleChildChange(child.id, 'parentRelationship', e.target.value)}
                            className="mr-2 text-gray-600 focus:ring-gray-500"
                          />
                          <span className="text-sm text-gray-700">Your child</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name={`parentRelationship_${child.id}`}
                            value="both"
                            checked={child.parentRelationship === 'both'}
                            onChange={(e) => handleChildChange(child.id, 'parentRelationship', e.target.value)}
                            className="mr-2 text-gray-600 focus:ring-gray-500"
                          />
                          <span className="text-sm text-gray-700">You and Spouse's child</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name={`parentRelationship_${child.id}`}
                            value="spouse"
                            checked={child.parentRelationship === 'spouse'}
                            onChange={(e) => handleChildChange(child.id, 'parentRelationship', e.target.value)}
                            className="mr-2 text-gray-600 focus:ring-gray-500"
                          />
                          <span className="text-sm text-gray-700">Spouse's child</span>
                        </label>
                      </div>
                    </div>

                    {/* Deceased Status Section */}
                    <div className="mt-6">
                      <label className="flex items-center mb-4">
                        <input
                          type="checkbox"
                          checked={child.isDeceased}
                          onChange={(e) => handleChildChange(child.id, 'isDeceased', e.target.checked)}
                          className="mr-2 text-gray-600 focus:ring-gray-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Is this child deceased?
                        </span>
                      </label>
                      
                      {child.isDeceased && (
                        <div className="mt-3">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date of Death
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            <input
                              type="text"
                              value={child.dateOfDeath.month}
                              onChange={(e) => handleChildDeathDateChange(child.id, 'dateOfDeath.month', e.target.value, 'month')}
                              className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                              placeholder="MM"
                            />
                            <input
                              type="text"
                              value={child.dateOfDeath.day}
                              onChange={(e) => handleChildDeathDateChange(child.id, 'dateOfDeath.day', e.target.value, 'day')}
                              className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                              placeholder="DD"
                            />
                            <input
                              type="text"
                              value={child.dateOfDeath.year}
                              onChange={(e) => handleChildDeathDateChange(child.id, 'dateOfDeath.year', e.target.value, 'year')}
                              className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                              placeholder="YYYY"
                            />
                          </div>

                          {/* Place of Death for child: did they pass in US? then city/state/zip else country/city */}
                          <div className="mt-4">
                            <div className="text-sm text-gray-700 mb-2">Did he/she pass in the US?</div>
                            <div className="flex items-center space-x-6 mb-3">
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name={`child_passed_us_${child.id}`}
                                  value="yes"
                                  checked={child.placeOfDeath?.passedInUS === true}
                                  onChange={() => handleChildChange(child.id, 'placeOfDeath', { ...child.placeOfDeath, passedInUS: true })}
                                  className="mr-2 text-gray-600 focus:ring-gray-500"
                                />
                                <span className="text-sm text-gray-700">Yes</span>
                              </label>
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name={`child_passed_us_${child.id}`}
                                  value="no"
                                  checked={child.placeOfDeath?.passedInUS === false}
                                  onChange={() => handleChildChange(child.id, 'placeOfDeath', { ...child.placeOfDeath, passedInUS: false })}
                                  className="mr-2 text-gray-600 focus:ring-gray-500"
                                />
                                <span className="text-sm text-gray-700">No</span>
                              </label>
                            </div>

                            {child.placeOfDeath?.passedInUS === true && (
                              <div className="grid grid-cols-3 gap-2">
                                <input
                                  type="text"
                                  value={child.placeOfDeath?.us?.city || ''}
                                  onChange={(e) => handleChildChange(child.id, 'placeOfDeath', { ...child.placeOfDeath, us: { ...child.placeOfDeath?.us, city: e.target.value } })}
                                  className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                                  placeholder="City"
                                />
                                <select
                                  value={child.placeOfDeath?.us?.state || ''}
                                  onChange={(e) => handleChildChange(child.id, 'placeOfDeath', { ...child.placeOfDeath, us: { ...child.placeOfDeath?.us, state: e.target.value } })}
                                  className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                                >
                                  <option value="">State</option>
                                  {usStates.map(state => (
                                    <option key={state} value={state}>{state}</option>
                                  ))}
                                </select>
                                <input
                                  type="text"
                                  value={child.placeOfDeath?.us?.zip || ''}
                                  onChange={(e) => handleChildChange(child.id, 'placeOfDeath', { ...child.placeOfDeath, us: { ...child.placeOfDeath?.us, zip: e.target.value } })}
                                  className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                                  placeholder="ZIP"
                                />
                              </div>
                            )}

                            {child.placeOfDeath?.passedInUS === false && (
                              <div className="grid grid-cols-2 gap-2">
                                <input
                                  type="text"
                                  value={child.placeOfDeath?.foreign?.country || ''}
                                  onChange={(e) => handleChildChange(child.id, 'placeOfDeath', { ...child.placeOfDeath, foreign: { ...child.placeOfDeath?.foreign, country: e.target.value } })}
                                  className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                                  placeholder="Country"
                                />
                                <input
                                  type="text"
                                  value={child.placeOfDeath?.foreign?.city || ''}
                                  onChange={(e) => handleChildChange(child.id, 'placeOfDeath', { ...child.placeOfDeath, foreign: { ...child.placeOfDeath?.foreign, city: e.target.value } })}
                                  className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                                  placeholder="City"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Document Upload Section for Children */}
                    <div className="mt-6">
                      <h4 className="text-md font-semibold text-gray-800 mb-4">Related Documents</h4>
                      <div className="space-y-4">
                        {child.isDeceased && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Death Certificate
                            </label>
                            <div className="flex items-center space-x-4">
                              <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                              />
                              <span className="text-sm text-gray-500">Upload death certificate</span>
                            </div>
                          </div>
                        )}
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Birth Certificate
                          </label>
                          <div className="flex items-center space-x-4">
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                            />
                            <span className="text-sm text-gray-500">Upload birth certificate</span>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Other Related Documents
                          </label>
                          <div className="flex items-center space-x-4">
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                              multiple
                              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                            />
                            <span className="text-sm text-gray-500">Upload other documents (adoption papers, medical records, etc.)</span>
                          </div>
                        </div>
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
              onClick={(e) => {
                console.log('Continue button clicked')
                // Ensure form submission completes
                setTimeout(() => {
                  if (window.location.pathname === '/about-you') {
                    console.log('Form submission may have failed, using backup navigation')
                    navigate('/assets')
                  }
                }, 100)
              }}
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
