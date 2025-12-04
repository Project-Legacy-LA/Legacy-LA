import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { usePeople } from '../../contexts/PeopleContext'

export default function SuccessionAboutYou() {
  const navigate = useNavigate()
  const pageRef = useRef(null)
  const formRef = useRef(null)
  const headerRef = useRef(null)
  const { addPerson } = usePeople()

  useEffect(() => {
    window.scrollTo(0, 0)
    const tl = gsap.timeline()
    tl.fromTo(pageRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "none" })
  }, [])

  // About You Section (Person filling out the form)
  const [aboutYouData, setAboutYouData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US'
    },
    phone: '',
    email: '',
    relationshipToDecedent: '',
    relationshipToDecedentOther: '',
    roleInSuccession: '',
    roleInSuccessionOther: '',
    attorneyReferral: '',
    hasBeenAppointedExecutor: false,
    executorCourtOrderFiles: [],
    holdsPowerOfAttorney: false,
    powerOfAttorneyFiles: [],
    acknowledgmentChecked: false
  })

  // About the Decedent Section (max 2 decedents)
  const [decedents, setDecedents] = useState([
    {
      id: 1,
      firstName: '',
      middleName: '',
      lastName: '',
      otherNames: [],
      dateOfBirth: { month: '', day: '', year: '' },
      dateOfDeath: { month: '', day: '', year: '' },
      placeOfDeath: {
        city: '',
        parish: '',
        state: ''
      },
      wasLouisianaResident: null,
      residenceIfNotLouisiana: '',
      lastPhysicalAddress: {
        line1: '',
        line2: '',
        city: '',
        state: '',
        zipCode: ''
      },
      mailingAddress: {
        line1: '',
        line2: '',
        city: '',
        state: '',
        zipCode: '',
        isDifferent: false
      },
      maritalStatusAtDeath: '',
      survivingSpouseName: {
        firstName: '',
        middleName: '',
        lastName: ''
      },
      marriageDate: { month: '', day: '', year: '' },
      marriagePlace: '',
      wasFirstMarriage: null,
      priorSpouses: [],
      children: [],
      closestLivingRelatives: []
    }
  ])

  const handleAboutYouChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setAboutYouData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }))
    } else {
      setAboutYouData(prev => ({ ...prev, [field]: value }))
    }
  }

  const handleFileUpload = (field, files) => {
    const fileArray = Array.from(files).map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file
    }))
    setAboutYouData(prev => ({ 
      ...prev, 
      [field]: [...(prev[field] || []), ...fileArray] 
    }))
  }

  const removeFile = (field, fileId) => {
    setAboutYouData(prev => ({
      ...prev,
      [field]: prev[field].filter(f => f.id !== fileId)
    }))
  }

  const handleDecedentChange = (decedentId, field, value) => {
    if (field.includes('.')) {
      const parts = field.split('.')
      setDecedents(prev => prev.map(d => {
        if (d.id === decedentId) {
          let newObj = { ...d }
          let current = newObj
          for (let i = 0; i < parts.length - 1; i++) {
            current[parts[i]] = { ...current[parts[i]] }
            current = current[parts[i]]
          }
          current[parts[parts.length - 1]] = value
          return newObj
        }
        return d
      }))
    } else {
      setDecedents(prev => prev.map(d => 
        d.id === decedentId ? { ...d, [field]: value } : d
      ))
    }
  }

  const handleDateChange = (decedentId, field, value, type) => {
    if (type === 'year') {
      if (value === '' || /^\d{1,4}$/.test(value)) {
        handleDecedentChange(decedentId, field, value)
      }
      return
    }
    if (value === '' || /^\d{1,2}$/.test(value)) {
      if (value !== '') {
        const n = parseInt(value, 10)
        if (type === 'month' && n > 12) value = '12'
        if (type === 'day' && n > 31) value = '31'
      }
      handleDecedentChange(decedentId, field, value)
    }
  }

  const addDecedent = () => {
    if (decedents.length >= 2) return
    const newId = Math.max(...decedents.map(d => d.id), 0) + 1
    setDecedents([...decedents, {
      id: newId,
      firstName: '',
      middleName: '',
      lastName: '',
      otherNames: [],
      dateOfBirth: { month: '', day: '', year: '' },
      dateOfDeath: { month: '', day: '', year: '' },
      placeOfDeath: { city: '', parish: '', state: '' },
      wasLouisianaResident: null,
      residenceIfNotLouisiana: '',
      lastPhysicalAddress: { line1: '', line2: '', city: '', state: '', zipCode: '' },
      mailingAddress: { line1: '', line2: '', city: '', state: '', zipCode: '', isDifferent: false },
      maritalStatusAtDeath: '',
      survivingSpouseName: { firstName: '', middleName: '', lastName: '' },
      marriageDate: { month: '', day: '', year: '' },
      marriagePlace: '',
      wasFirstMarriage: null,
      priorSpouses: [],
      children: [],
      closestLivingRelatives: []
    }])
  }

  const removeDecedent = (decedentId) => {
    if (decedents.length <= 1) return
    setDecedents(decedents.filter(d => d.id !== decedentId))
  }

  const addOtherName = (decedentId) => {
    setDecedents(prev => prev.map(d => 
      d.id === decedentId 
        ? { ...d, otherNames: [...d.otherNames, { id: Date.now(), name: '' }] }
        : d
    ))
  }

  const removeOtherName = (decedentId, nameId) => {
    setDecedents(prev => prev.map(d => 
      d.id === decedentId 
        ? { ...d, otherNames: d.otherNames.filter(n => n.id !== nameId) }
        : d
    ))
  }

  const handleOtherNameChange = (decedentId, nameId, value) => {
    setDecedents(prev => prev.map(d => 
      d.id === decedentId 
        ? { ...d, otherNames: d.otherNames.map(n => n.id === nameId ? { ...n, name: value } : n) }
        : d
    ))
  }

  const addPriorSpouse = (decedentId) => {
    setDecedents(prev => prev.map(d => 
      d.id === decedentId 
        ? { ...d, priorSpouses: [...d.priorSpouses, { 
            id: Date.now(), 
            name: '',
            endedBy: '' // divorce or death
          }] }
        : d
    ))
  }

  const removePriorSpouse = (decedentId, spouseId) => {
    setDecedents(prev => prev.map(d => 
      d.id === decedentId 
        ? { ...d, priorSpouses: d.priorSpouses.filter(s => s.id !== spouseId) }
        : d
    ))
  }

  const handlePriorSpouseChange = (decedentId, spouseId, field, value) => {
    setDecedents(prev => prev.map(d => 
      d.id === decedentId 
        ? { ...d, priorSpouses: d.priorSpouses.map(s => 
            s.id === spouseId ? { ...s, [field]: value } : s
          ) }
        : d
    ))
  }

  const addChild = (decedentId) => {
    setDecedents(prev => prev.map(d => 
      d.id === decedentId 
        ? { ...d, children: [...d.children, { 
            id: Date.now(),
            fullName: '',
            dateOfBirth: '',
            currentAddress: '',
            isDeceased: false,
            dateOfDeath: '',
            isForcedHeir: false // under age 24 or permanently disabled
          }] }
        : d
    ))
  }

  const removeChild = (decedentId, childId) => {
    setDecedents(prev => prev.map(d => 
      d.id === decedentId 
        ? { ...d, children: d.children.filter(c => c.id !== childId) }
        : d
    ))
  }

  const handleChildChange = (decedentId, childId, field, value) => {
    setDecedents(prev => prev.map(d => 
      d.id === decedentId 
        ? { ...d, children: d.children.map(c => 
            c.id === childId ? { ...c, [field]: value } : c
          ) }
        : d
    ))
  }

  const addRelative = (decedentId) => {
    setDecedents(prev => prev.map(d => 
      d.id === decedentId 
        ? { ...d, closestLivingRelatives: [...d.closestLivingRelatives, { 
            id: Date.now(),
            name: '',
            relationship: ''
          }] }
        : d
    ))
  }

  const removeRelative = (decedentId, relativeId) => {
    setDecedents(prev => prev.map(d => 
      d.id === decedentId 
        ? { ...d, closestLivingRelatives: d.closestLivingRelatives.filter(r => r.id !== relativeId) }
        : d
    ))
  }

  const handleRelativeChange = (decedentId, relativeId, field, value) => {
    setDecedents(prev => prev.map(d => 
      d.id === decedentId 
        ? { ...d, closestLivingRelatives: d.closestLivingRelatives.map(r => 
            r.id === relativeId ? { ...r, [field]: value } : r
          ) }
        : d
    ))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Register person filling out form
    if (aboutYouData.firstName || aboutYouData.lastName) {
      addPerson({
        firstName: aboutYouData.firstName,
        middleName: aboutYouData.middleName,
        lastName: aboutYouData.lastName,
        contactInfo: {
          phone: aboutYouData.phone,
          email: aboutYouData.email,
          address: aboutYouData.address
        },
        roles: ['succession-filler']
      })
    }

    console.log('Succession About You submitted:', { aboutYouData, decedents })
    navigate('/succession/assets')
  }

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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div ref={headerRef} className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2" style={{ fontFamily: 'var(--ll-font)' }}>
            Succession - About You and Decedent
          </h1>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          
          {/* Section 1a: About You (Brief Introduction) */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1a. About You</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <p className="text-gray-700 leading-relaxed text-lg">
                Thank you for taking the time to complete this questionnaire. The information you provide will help us gather the key details needed to settle your loved one's estate and prepare the necessary succession documents. Please answer each question to the best of your ability.
              </p>
            </div>
            <p className="text-gray-600 mb-4">
              First, please fill out information about yourself (the executor or person filling out this form). Then, you will provide details about the decedent(s).
            </p>
          </div>

          {/* Section 1b: About You (Detailed Information) */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1b. About You - Detailed Information</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-lg font-bold text-gray-800 mb-3">First Name *</label>
                <input
                  type="text"
                  value={aboutYouData.firstName}
                  onChange={(e) => handleAboutYouChange('firstName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-lg font-bold text-gray-800 mb-3">Middle Name</label>
                <input
                  type="text"
                  value={aboutYouData.middleName}
                  onChange={(e) => handleAboutYouChange('middleName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-lg font-bold text-gray-800 mb-3">Last Name *</label>
                <input
                  type="text"
                  value={aboutYouData.lastName}
                  onChange={(e) => handleAboutYouChange('lastName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-lg font-bold text-gray-800 mb-3">Address Line 1 *</label>
                <input
                  type="text"
                  value={aboutYouData.address.line1}
                  onChange={(e) => handleAboutYouChange('address.line1', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-lg font-bold text-gray-800 mb-3">Address Line 2</label>
                <input
                  type="text"
                  value={aboutYouData.address.line2}
                  onChange={(e) => handleAboutYouChange('address.line2', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-lg font-bold text-gray-800 mb-3">City *</label>
                <input
                  type="text"
                  value={aboutYouData.address.city}
                  onChange={(e) => handleAboutYouChange('address.city', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-lg font-bold text-gray-800 mb-3">State *</label>
                <input
                  type="text"
                  value={aboutYouData.address.state}
                  onChange={(e) => handleAboutYouChange('address.state', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-lg font-bold text-gray-800 mb-3">Zip Code *</label>
                <input
                  type="text"
                  value={aboutYouData.address.zipCode}
                  onChange={(e) => handleAboutYouChange('address.zipCode', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-lg font-bold text-gray-800 mb-3">Phone Number *</label>
                <input
                  type="tel"
                  value={aboutYouData.phone}
                  onChange={(e) => handleAboutYouChange('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-lg font-bold text-gray-800 mb-3">Email Address *</label>
                <input
                  type="email"
                  value={aboutYouData.email}
                  onChange={(e) => handleAboutYouChange('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-lg font-bold text-gray-800 mb-3">Relationship to Decedent *</label>
                <select
                  value={aboutYouData.relationshipToDecedent}
                  onChange={(e) => handleAboutYouChange('relationshipToDecedent', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="">Select relationship...</option>
                  <option value="surviving_spouse">Surviving Spouse</option>
                  <option value="child">Child</option>
                  <option value="sibling">Sibling</option>
                  <option value="parent">Parent</option>
                  <option value="other_relative">Other Relative</option>
                  <option value="friend_other">Friend or Other Interested Party</option>
                </select>
              </div>
              {aboutYouData.relationshipToDecedent === 'other_relative' && (
                <div>
                  <label className="block text-lg font-bold text-gray-800 mb-3">Please specify relationship *</label>
                  <input
                    type="text"
                    value={aboutYouData.relationshipToDecedentOther}
                    onChange={(e) => handleAboutYouChange('relationshipToDecedentOther', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              )}
              {aboutYouData.relationshipToDecedent === 'friend_other' && (
                <div>
                  <label className="block text-lg font-bold text-gray-800 mb-3">Please specify reason for involvement *</label>
                  <input
                    type="text"
                    value={aboutYouData.relationshipToDecedentOther}
                    onChange={(e) => handleAboutYouChange('relationshipToDecedentOther', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              )}
              <div>
                <label className="block text-lg font-bold text-gray-800 mb-3">Role in the Succession Process *</label>
                <select
                  value={aboutYouData.roleInSuccession}
                  onChange={(e) => handleAboutYouChange('roleInSuccession', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="">Select role...</option>
                  <option value="proposed_executor">I am the proposed executor/administrator</option>
                  <option value="assisting_family">I am assisting the family with paperwork</option>
                  <option value="heir_legatee">I am an heir or legatee</option>
                  <option value="other">Other</option>
                </select>
              </div>
              {aboutYouData.roleInSuccession === 'other' && (
                <div>
                  <label className="block text-lg font-bold text-gray-800 mb-3">Please explain briefly *</label>
                  <input
                    type="text"
                    value={aboutYouData.roleInSuccessionOther}
                    onChange={(e) => handleAboutYouChange('roleInSuccessionOther', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              )}
              <div>
                <label className="block text-lg font-bold text-gray-800 mb-3">Attorney Referral / How You Heard About Us</label>
                <input
                  type="text"
                  value={aboutYouData.attorneyReferral}
                  onChange={(e) => handleAboutYouChange('attorneyReferral', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="lg:col-span-2 space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={aboutYouData.hasBeenAppointedExecutor}
                    onChange={(e) => handleAboutYouChange('hasBeenAppointedExecutor', e.target.checked)}
                    className="mr-2 h-5 w-5"
                  />
                  <span className="text-gray-700">Have you been appointed as executor or administrator by the court? (If yes, attach court order)</span>
                </label>
                {aboutYouData.hasBeenAppointedExecutor && (
                  <div className="ml-7 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Court Order *
                      </label>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        multiple
                        onChange={(e) => handleFileUpload('executorCourtOrderFiles', e.target.files)}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                      />
                    </div>
                    {aboutYouData.executorCourtOrderFiles.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 mb-1">Uploaded files:</p>
                        <ul className="text-sm text-gray-500 space-y-1">
                          {aboutYouData.executorCourtOrderFiles.map(file => (
                            <li key={file.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                              <span>• {file.name}</span>
                              <button
                                type="button"
                                onClick={() => removeFile('executorCourtOrderFiles', file.id)}
                                className="px-2 py-1 text-white rounded-lg transition-all duration-200 font-medium text-xs ml-2 shadow-lg hover:shadow-xl hover:brightness-110 active:scale-95"
                                style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626, #b91c1c)' }}
                              >
                                Remove
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={aboutYouData.holdsPowerOfAttorney}
                    onChange={(e) => handleAboutYouChange('holdsPowerOfAttorney', e.target.checked)}
                    className="mr-2 h-5 w-5"
                  />
                  <span className="text-gray-700">Do you hold a Power of Attorney for the decedent? (If yes, attach copy of POA)</span>
                </label>
                {aboutYouData.holdsPowerOfAttorney && (
                  <div className="ml-7 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Power of Attorney Document *
                      </label>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        multiple
                        onChange={(e) => handleFileUpload('powerOfAttorneyFiles', e.target.files)}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                      />
                    </div>
                    {aboutYouData.powerOfAttorneyFiles.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 mb-1">Uploaded files:</p>
                        <ul className="text-sm text-gray-500 space-y-1">
                          {aboutYouData.powerOfAttorneyFiles.map(file => (
                            <li key={file.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                              <span>• {file.name}</span>
                              <button
                                type="button"
                                onClick={() => removeFile('powerOfAttorneyFiles', file.id)}
                                className="px-2 py-1 text-white rounded-lg transition-all duration-200 font-medium text-xs ml-2 shadow-lg hover:shadow-xl hover:brightness-110 active:scale-95"
                                style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626, #b91c1c)' }}
                              >
                                Remove
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={aboutYouData.acknowledgmentChecked}
                    onChange={(e) => handleAboutYouChange('acknowledgmentChecked', e.target.checked)}
                    className="mr-2 h-5 w-5 flex-shrink-0"
                    required
                  />
                  <span className="text-gray-700">I understand that completing this questionnaire does not itself authorize me to act on behalf of the estate, but simply helps the attorney gather preliminary information needed to evaluate and begin the succession process. *</span>
                </label>
              </div>
            </div>
          </div>

          {/* About the Decedent Section(s) */}
          <div className="mb-12">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">About the Decedent</h2>
              <p className="text-gray-600 mb-4">
                In this section, you will provide detailed information about the decedent. You may add information for up to two decedents if applicable.
              </p>
            </div>
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-600">You may add information for up to two decedents if applicable.</p>
            </div>
            <div className="mb-4">
              {decedents.length < 2 && (
                <button
                  type="button"
                  onClick={addDecedent}
                  className="px-4 py-2 text-white rounded-lg transition-colors duration-200 font-medium"
                  style={{ background: 'linear-gradient(90deg, var(--ll-bg-2), var(--ll-bg-1))' }}
                >
                  + Add Second Decedent
                </button>
              )}
            </div>

            {decedents.map((decedent, index) => (
              <div key={decedent.id} className="mb-8 p-6 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Decedent {index + 1}
                  </h3>
                  {decedents.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDecedent(decedent.id)}
                      className="px-4 py-2 text-white rounded-lg transition-all duration-200 font-medium text-sm shadow-lg hover:shadow-xl hover:brightness-110 active:scale-95"
                      style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626, #b91c1c)' }}
                    >
                      Remove Decedent
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-lg font-bold text-gray-800 mb-3">First Name *</label>
                    <input
                      type="text"
                      value={decedent.firstName}
                      onChange={(e) => handleDecedentChange(decedent.id, 'firstName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-bold text-gray-800 mb-3">Middle Name</label>
                    <input
                      type="text"
                      value={decedent.middleName}
                      onChange={(e) => handleDecedentChange(decedent.id, 'middleName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-bold text-gray-800 mb-3">Last Name *</label>
                    <input
                      type="text"
                      value={decedent.lastName}
                      onChange={(e) => handleDecedentChange(decedent.id, 'lastName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-lg font-bold text-gray-800 mb-3">Other Names Used</label>
                    <div className="space-y-2">
                      {decedent.otherNames.map((name) => (
                        <div key={name.id} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={name.name}
                            onChange={(e) => handleOtherNameChange(decedent.id, name.id, e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            placeholder="Maiden name, prior married name, etc."
                          />
                          <button
                            type="button"
                            onClick={() => removeOtherName(decedent.id, name.id)}
                            className="px-3 py-1.5 text-white rounded-lg transition-all duration-200 font-medium text-sm shadow-lg hover:shadow-xl hover:brightness-110 active:scale-95"
                            style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626, #b91c1c)' }}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addOtherName(decedent.id)}
                        className="px-4 py-2 text-sm text-white rounded-lg transition-all duration-200 font-medium hover:opacity-90"
                        style={{ background: 'linear-gradient(90deg, var(--ll-bg-2), var(--ll-bg-1))' }}
                      >
                        + Add Other Name
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-lg font-bold text-gray-800 mb-3">Date of Birth *</label>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={decedent.dateOfBirth.month}
                        onChange={(e) => handleDateChange(decedent.id, 'dateOfBirth.month', e.target.value, 'month')}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="MM"
                        maxLength="2"
                      />
                      <input
                        type="text"
                        value={decedent.dateOfBirth.day}
                        onChange={(e) => handleDateChange(decedent.id, 'dateOfBirth.day', e.target.value, 'day')}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="DD"
                        maxLength="2"
                      />
                      <input
                        type="text"
                        value={decedent.dateOfBirth.year}
                        onChange={(e) => handleDateChange(decedent.id, 'dateOfBirth.year', e.target.value, 'year')}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="YYYY"
                        maxLength="4"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-lg font-bold text-gray-800 mb-3">Date of Death *</label>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={decedent.dateOfDeath.month}
                        onChange={(e) => handleDateChange(decedent.id, 'dateOfDeath.month', e.target.value, 'month')}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="MM"
                        maxLength="2"
                      />
                      <input
                        type="text"
                        value={decedent.dateOfDeath.day}
                        onChange={(e) => handleDateChange(decedent.id, 'dateOfDeath.day', e.target.value, 'day')}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="DD"
                        maxLength="2"
                      />
                      <input
                        type="text"
                        value={decedent.dateOfDeath.year}
                        onChange={(e) => handleDateChange(decedent.id, 'dateOfDeath.year', e.target.value, 'year')}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="YYYY"
                        maxLength="4"
                      />
                    </div>
                  </div>
                  <div className="lg:col-span-2">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Place of Death</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                        <input
                          type="text"
                          value={decedent.placeOfDeath.city}
                          onChange={(e) => handleDecedentChange(decedent.id, 'placeOfDeath.city', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Parish</label>
                        <select
                          value={decedent.placeOfDeath.parish}
                          onChange={(e) => handleDecedentChange(decedent.id, 'placeOfDeath.parish', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        >
                          <option value="">Select parish...</option>
                          {louisianaParishes.map(parish => (
                            <option key={parish} value={parish}>{parish}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                        <input
                          type="text"
                          value={decedent.placeOfDeath.state}
                          onChange={(e) => handleDecedentChange(decedent.id, 'placeOfDeath.state', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-lg font-bold text-gray-800 mb-3">Was the decedent a resident of Louisiana at the time of death? *</label>
                    <div className="flex space-x-6">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name={`la-resident-${decedent.id}`}
                          checked={decedent.wasLouisianaResident === true}
                          onChange={() => handleDecedentChange(decedent.id, 'wasLouisianaResident', true)}
                          className="mr-2"
                        />
                        <span>Yes</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name={`la-resident-${decedent.id}`}
                          checked={decedent.wasLouisianaResident === false}
                          onChange={() => handleDecedentChange(decedent.id, 'wasLouisianaResident', false)}
                          className="mr-2"
                        />
                        <span>No</span>
                      </label>
                    </div>
                  </div>
                  {decedent.wasLouisianaResident === false && (
                    <div>
                      <label className="block text-lg font-bold text-gray-800 mb-3">Where did the decedent reside? *</label>
                      <input
                        type="text"
                        value={decedent.residenceIfNotLouisiana}
                        onChange={(e) => handleDecedentChange(decedent.id, 'residenceIfNotLouisiana', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>
                  )}
                  <div className="lg:col-span-2">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Decedent's Last Physical Address</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Street *</label>
                        <input
                          type="text"
                          value={decedent.lastPhysicalAddress.line1}
                          onChange={(e) => handleDecedentChange(decedent.id, 'lastPhysicalAddress.line1', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                        <input
                          type="text"
                          value={decedent.lastPhysicalAddress.city}
                          onChange={(e) => handleDecedentChange(decedent.id, 'lastPhysicalAddress.city', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                        <input
                          type="text"
                          value={decedent.lastPhysicalAddress.state}
                          onChange={(e) => handleDecedentChange(decedent.id, 'lastPhysicalAddress.state', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code *</label>
                        <input
                          type="text"
                          value={decedent.lastPhysicalAddress.zipCode}
                          onChange={(e) => handleDecedentChange(decedent.id, 'lastPhysicalAddress.zipCode', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="lg:col-span-2">
                    <label className="flex items-center mb-3">
                      <input
                        type="checkbox"
                        checked={decedent.mailingAddress.isDifferent}
                        onChange={(e) => handleDecedentChange(decedent.id, 'mailingAddress.isDifferent', e.target.checked)}
                        className="mr-2 h-5 w-5"
                      />
                      <span className="text-gray-700">Mailing address is different from physical address</span>
                    </label>
                    {decedent.mailingAddress.isDifferent && (
                      <div className="ml-7 mt-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Mailing Address</h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="lg:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Street</label>
                            <input
                              type="text"
                              value={decedent.mailingAddress.line1}
                              onChange={(e) => handleDecedentChange(decedent.id, 'mailingAddress.line1', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                            <input
                              type="text"
                              value={decedent.mailingAddress.city}
                              onChange={(e) => handleDecedentChange(decedent.id, 'mailingAddress.city', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                            <input
                              type="text"
                              value={decedent.mailingAddress.state}
                              onChange={(e) => handleDecedentChange(decedent.id, 'mailingAddress.state', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code</label>
                            <input
                              type="text"
                              value={decedent.mailingAddress.zipCode}
                              onChange={(e) => handleDecedentChange(decedent.id, 'mailingAddress.zipCode', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-lg font-bold text-gray-800 mb-3">Marital Status at Time of Death *</label>
                    <select
                      value={decedent.maritalStatusAtDeath}
                      onChange={(e) => handleDecedentChange(decedent.id, 'maritalStatusAtDeath', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      <option value="">Select status...</option>
                      <option value="married">Married</option>
                      <option value="widowed">Widowed</option>
                      <option value="divorced">Divorced</option>
                      <option value="never_married">Never Married</option>
                    </select>
                  </div>
                  {decedent.maritalStatusAtDeath === 'married' && (
                    <>
                      <div className="lg:col-span-2">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Name of Surviving Spouse</h3>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                            <input
                              type="text"
                              value={decedent.survivingSpouseName.firstName}
                              onChange={(e) => handleDecedentChange(decedent.id, 'survivingSpouseName.firstName', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Middle Name</label>
                            <input
                              type="text"
                              value={decedent.survivingSpouseName.middleName}
                              onChange={(e) => handleDecedentChange(decedent.id, 'survivingSpouseName.middleName', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                            <input
                              type="text"
                              value={decedent.survivingSpouseName.lastName}
                              onChange={(e) => handleDecedentChange(decedent.id, 'survivingSpouseName.lastName', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-lg font-bold text-gray-800 mb-3">Date and Place of Marriage</label>
                        <div className="grid grid-cols-3 gap-2 mb-2">
                          <input
                            type="text"
                            value={decedent.marriageDate.month}
                            onChange={(e) => handleDateChange(decedent.id, 'marriageDate.month', e.target.value, 'month')}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            placeholder="MM"
                            maxLength="2"
                          />
                          <input
                            type="text"
                            value={decedent.marriageDate.day}
                            onChange={(e) => handleDateChange(decedent.id, 'marriageDate.day', e.target.value, 'day')}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            placeholder="DD"
                            maxLength="2"
                          />
                          <input
                            type="text"
                            value={decedent.marriageDate.year}
                            onChange={(e) => handleDateChange(decedent.id, 'marriageDate.year', e.target.value, 'year')}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            placeholder="YYYY"
                            maxLength="4"
                          />
                        </div>
                        <input
                          type="text"
                          value={decedent.marriagePlace}
                          onChange={(e) => handleDecedentChange(decedent.id, 'marriagePlace', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          placeholder="Place of marriage"
                        />
                      </div>
                      <div>
                        <label className="block text-lg font-bold text-gray-800 mb-3">Was this the decedent's first marriage? *</label>
                        <div className="flex space-x-6">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name={`first-marriage-${decedent.id}`}
                              checked={decedent.wasFirstMarriage === true}
                              onChange={() => handleDecedentChange(decedent.id, 'wasFirstMarriage', true)}
                              className="mr-2"
                            />
                            <span>Yes</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name={`first-marriage-${decedent.id}`}
                              checked={decedent.wasFirstMarriage === false}
                              onChange={() => handleDecedentChange(decedent.id, 'wasFirstMarriage', false)}
                              className="mr-2"
                            />
                            <span>No</span>
                          </label>
                        </div>
                      </div>
                      {decedent.wasFirstMarriage === false && (
                        <div className="lg:col-span-2">
                          <label className="block text-lg font-bold text-gray-800 mb-3">Prior Spouses</label>
                          <div className="space-y-3">
                            {decedent.priorSpouses.map((spouse) => (
                              <div key={spouse.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                <input
                                  type="text"
                                  value={spouse.name}
                                  onChange={(e) => handlePriorSpouseChange(decedent.id, spouse.id, 'name', e.target.value)}
                                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                  placeholder="Prior spouse name"
                                />
                                <select
                                  value={spouse.endedBy}
                                  onChange={(e) => handlePriorSpouseChange(decedent.id, spouse.id, 'endedBy', e.target.value)}
                                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                >
                                  <option value="">How ended...</option>
                                  <option value="divorce">Divorce</option>
                                  <option value="death">Death</option>
                                </select>
                                <button
                                  type="button"
                                  onClick={() => removePriorSpouse(decedent.id, spouse.id)}
                                  className="px-3 py-1.5 text-white rounded-lg transition-all duration-200 font-medium text-sm shadow-lg hover:shadow-xl hover:brightness-110 active:scale-95"
                                  style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626, #b91c1c)' }}
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => addPriorSpouse(decedent.id)}
                              className="px-4 py-2 text-sm text-white rounded-lg transition-all duration-200 font-medium hover:opacity-90"
                              style={{ background: 'linear-gradient(90deg, var(--ll-bg-2), var(--ll-bg-1))' }}
                            >
                              + Add Prior Spouse
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  <div className="lg:col-span-2">
                    <label className="block text-lg font-bold text-gray-800 mb-3">All Children (living and deceased, including adopted and stepchildren)</label>
                    <div className="space-y-3">
                      {decedent.children.map((child) => (
                        <div key={child.id} className="p-4 bg-gray-50 rounded-lg grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                            <input
                              type="text"
                              value={child.fullName}
                              onChange={(e) => handleChildChange(decedent.id, child.id, 'fullName', e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                            <input
                              type="date"
                              value={child.dateOfBirth}
                              onChange={(e) => handleChildChange(decedent.id, child.id, 'dateOfBirth', e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Current Address</label>
                            <input
                              type="text"
                              value={child.currentAddress}
                              onChange={(e) => handleChildChange(decedent.id, child.id, 'currentAddress', e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={child.isDeceased}
                                onChange={(e) => handleChildChange(decedent.id, child.id, 'isDeceased', e.target.checked)}
                                className="mr-2"
                              />
                              <span className="text-sm text-gray-700">Deceased</span>
                            </label>
                            {child.isDeceased && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Death</label>
                                <input
                                  type="date"
                                  value={child.dateOfDeath}
                                  onChange={(e) => handleChildChange(decedent.id, child.id, 'dateOfDeath', e.target.value)}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                />
                              </div>
                            )}
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={child.isForcedHeir}
                                onChange={(e) => handleChildChange(decedent.id, child.id, 'isForcedHeir', e.target.checked)}
                                className="mr-2"
                              />
                              <span className="text-sm text-gray-700">Forced heir (under age 24 or permanently disabled)</span>
                            </label>
                          </div>
                          <div className="lg:col-span-2 flex justify-end">
                            <button
                              type="button"
                              onClick={() => removeChild(decedent.id, child.id)}
                              className="px-3 py-1.5 text-white rounded-lg transition-all duration-200 font-medium text-sm shadow-lg hover:shadow-xl hover:brightness-110 active:scale-95"
                              style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626, #b91c1c)' }}
                            >
                              Remove Child
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addChild(decedent.id)}
                        className="px-4 py-2 text-sm text-white rounded-lg transition-all duration-200 font-medium hover:opacity-90"
                        style={{ background: 'linear-gradient(90deg, var(--ll-bg-2), var(--ll-bg-1))' }}
                      >
                        + Add Child
                      </button>
                    </div>
                  </div>
                  {(decedent.maritalStatusAtDeath !== 'married' && decedent.children.length === 0) && (
                    <div className="lg:col-span-2">
                      <label className="block text-lg font-bold text-gray-800 mb-3">If no surviving spouse or children, list the closest living relatives (parents, siblings, nieces/nephews, etc.)</label>
                      <div className="space-y-3">
                        {decedent.closestLivingRelatives.map((relative) => (
                          <div key={relative.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <input
                              type="text"
                              value={relative.name}
                              onChange={(e) => handleRelativeChange(decedent.id, relative.id, 'name', e.target.value)}
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                              placeholder="Relative name"
                            />
                            <input
                              type="text"
                              value={relative.relationship}
                              onChange={(e) => handleRelativeChange(decedent.id, relative.id, 'relationship', e.target.value)}
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                              placeholder="Relationship (e.g., parent, sibling, niece/nephew)"
                            />
                            <button
                              type="button"
                              onClick={() => removeRelative(decedent.id, relative.id)}
                              className="px-3 py-1.5 text-white rounded-lg transition-all duration-200 font-medium text-sm shadow-lg hover:shadow-xl hover:brightness-110 active:scale-95"
                              style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626, #b91c1c)' }}
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addRelative(decedent.id)}
                          className="px-4 py-2 text-sm text-white rounded-lg transition-all duration-200 font-medium hover:opacity-90"
                          style={{ background: 'linear-gradient(90deg, var(--ll-bg-2), var(--ll-bg-1))' }}
                        >
                          + Add Relative
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/succession')}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium"
            >
              Back to Home
            </button>
            <button
              type="submit"
              className="px-8 py-3 text-white rounded-lg transition-colors duration-200 font-medium"
              style={{ background: 'linear-gradient(90deg, var(--ll-bg-2), var(--ll-bg-1))' }}
            >
              Continue to Assets
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

