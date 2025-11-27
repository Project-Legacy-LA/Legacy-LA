import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { usePeople } from '../../contexts/PeopleContext'

export default function DecisionMakers() {
  const navigate = useNavigate()
  const pageRef = useRef(null)
  const formRef = useRef(null)
  const headerRef = useRef(null)
  const { people, addPerson } = usePeople()

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0)
    
    const tl = gsap.timeline()
    tl.fromTo(pageRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "none" })
  }, [])

  const [decisionMakers, setDecisionMakers] = useState([
    {
      id: 1,
      personId: null,
      roles: [
        {
          id: 1,
          role: 'executor',
          isCoRole: false,
          coRolePersonId: null,
          importantInfo: '',
          notes: ''
        }
      ]
    }
  ])

  const [showNewPersonForm, setShowNewPersonForm] = useState({})
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

  const addDecisionMaker = () => {
    const newId = Math.max(...decisionMakers.map(d => d.id), 0) + 1
    setDecisionMakers([...decisionMakers, {
      id: newId,
      personId: null,
      roles: [
        {
          id: 1,
          role: 'executor',
          isCoRole: false,
          coRolePersonId: null,
          importantInfo: '',
          notes: ''
        }
      ]
    }])
  }

  const removeDecisionMaker = (decisionMakerId) => {
    setDecisionMakers(decisionMakers.filter(dm => dm.id !== decisionMakerId))
  }

  const addRoleToDecisionMaker = (decisionMakerId) => {
    const decisionMaker = decisionMakers.find(dm => dm.id === decisionMakerId)
    if (decisionMaker) {
      const newRoleId = Math.max(...decisionMaker.roles.map(r => r.id), 0) + 1
      setDecisionMakers(decisionMakers.map(dm => 
        dm.id === decisionMakerId
          ? { ...dm, roles: [...dm.roles, {
              id: newRoleId,
              role: 'executor',
              isCoRole: false,
              coRolePersonId: null,
              importantInfo: '',
              notes: ''
            }] }
          : dm
      ))
    }
  }

  const removeRoleFromDecisionMaker = (decisionMakerId, roleId) => {
    setDecisionMakers(decisionMakers.map(dm => 
      dm.id === decisionMakerId
        ? { ...dm, roles: dm.roles.filter(r => r.id !== roleId) }
        : dm
    ))
  }

  const handleDecisionMakerChange = (decisionMakerId, field, value) => {
    setDecisionMakers(decisionMakers.map(d => 
      d.id === decisionMakerId 
        ? { ...d, [field]: value }
        : d
    ))
  }

  const handleRoleChange = (decisionMakerId, roleId, field, value) => {
    setDecisionMakers(decisionMakers.map(dm => 
      dm.id === decisionMakerId
        ? {
            ...dm,
            roles: dm.roles.map(role =>
              role.id === roleId
                ? { ...role, [field]: value }
                : role
            )
          }
        : dm
    ))
  }

  const handlePersonSelection = (decisionMakerId, value, type = 'main', roleId = null) => {
    if (value === 'other') {
      const key = roleId ? `${type}_${decisionMakerId}_${roleId}` : `${type}_${decisionMakerId}`
      setShowNewPersonForm(prev => ({ ...prev, [key]: true }))
    } else {
      const key = roleId ? `${type}_${decisionMakerId}_${roleId}` : `${type}_${decisionMakerId}`
      setShowNewPersonForm(prev => ({ ...prev, [key]: false }))
      if (type === 'main') {
        handleDecisionMakerChange(decisionMakerId, 'personId', parseInt(value) || null)
      } else if (roleId) {
        handleRoleChange(decisionMakerId, roleId, 'coRolePersonId', parseInt(value) || null)
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

  const saveNewPerson = (decisionMakerId, type = 'main', roleId = null) => {
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
        roles: ['decision-maker']
      })
      
      if (type === 'main') {
        handleDecisionMakerChange(decisionMakerId, 'personId', newPersonId)
      } else if (roleId) {
        handleRoleChange(decisionMakerId, roleId, 'coRolePersonId', newPersonId)
      }
      
      const key = roleId ? `${type}_${decisionMakerId}_${roleId}` : `${type}_${decisionMakerId}`
      setShowNewPersonForm(prev => ({ ...prev, [key]: false }))
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

  const cancelNewPerson = (decisionMakerId, type = 'main', roleId = null) => {
    const key = roleId ? `${type}_${decisionMakerId}_${roleId}` : `${type}_${decisionMakerId}`
    setShowNewPersonForm(prev => ({ ...prev, [key]: false }))
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

  const getPeopleOptions = () => {
    return people
      .map(person => ({
        value: person.id,
        label: `${person.firstName} ${person.lastName}`.trim() || 'Unnamed Person'
      }))
      .sort((a, b) => a.label.localeCompare(b.label))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Decision Makers submitted:', decisionMakers)
    // Navigate to next section or summary
    navigate('/advisors')
  }

  return (
    <div ref={pageRef} className="min-h-screen text-black bg-white">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div ref={headerRef} className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2" style={{ fontFamily: 'var(--ll-font)' }}>
            Decision Makers
          </h1>
          <p className="text-gray-600">
            Assign roles & Responsibilities to those who may play a role in your estate planning. 
            Decision Maker 1 is typically the person filling out the questionnaire, and Decision Maker 2 is typically the spouse. 
            Each person can have multiple roles (executor, backup executor, power of attorney, etc.).
          </p>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <div className="space-y-6">
            {decisionMakers.map((decisionMaker, index) => (
              <div key={decisionMaker.id} className="p-6 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Decision Maker #{index + 1} {index === 0 && <span className="text-sm font-normal text-gray-500">(Person filling out questionnaire)</span>}
                    {index === 1 && <span className="text-sm font-normal text-gray-500">(Spouse)</span>}
                  </h3>
                  {decisionMakers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDecisionMaker(decisionMaker.id)}
                      className="px-4 py-2 text-red-600 hover:text-red-800 transition-colors duration-200 font-medium text-sm"
                    >
                      Remove Decision Maker
                    </button>
                  )}
                </div>

                {/* Person Selection */}
                <div className="mb-6">
                  <label className="block text-lg font-bold text-gray-800 mb-3">
                    Person *
                  </label>
                  <select
                    value={decisionMaker.personId || ''}
                    onChange={(e) => handlePersonSelection(decisionMaker.id, e.target.value, 'main')}
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

                {/* New Person Form for Decision Makers */}
                {showNewPersonForm[`main_${decisionMaker.id}`] && (
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
                        onClick={() => cancelNewPerson(decisionMaker.id, 'main')}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => saveNewPerson(decisionMaker.id, 'main')}
                        className="px-6 py-2 text-white rounded-lg transition-colors duration-200 font-medium"
                        style={{ background: 'linear-gradient(90deg, var(--ll-bg-2), var(--ll-bg-1))' }}
                      >
                        Save Person
                      </button>
                    </div>
                  </div>
                )}

                {/* Roles Section */}
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">Roles</h4>
                    <button
                      type="button"
                      onClick={() => addRoleToDecisionMaker(decisionMaker.id)}
                      className="px-4 py-2 text-white rounded-lg transition-colors duration-200 font-medium text-sm"
                      style={{ background: 'linear-gradient(90deg, var(--ll-bg-2), var(--ll-bg-1))' }}
                    >
                      + Add Another Role
                    </button>
                  </div>

                  {decisionMaker.roles.map((role, roleIndex) => (
                    <div key={role.id} className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-center mb-4">
                        <h5 className="text-md font-semibold text-gray-800">Role {roleIndex + 1}</h5>
                        {decisionMaker.roles.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeRoleFromDecisionMaker(decisionMaker.id, role.id)}
                            className="px-3 py-1 text-red-600 hover:text-red-800 transition-colors duration-200 font-medium text-sm"
                          >
                            Remove Role
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Role *
                          </label>
                          <select
                            value={role.role}
                            onChange={(e) => handleRoleChange(decisionMaker.id, role.id, 'role', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                          >
                            <option value="backup_designee_remains">Backup Designee for Remains / Burial / Services</option>
                            <option value="backup_executor">Backup Executor</option>
                            <option value="backup_guardian">Backup Guardian</option>
                            <option value="backup_power_of_attorney_financial">Backup Power of Attorney – Financial</option>
                            <option value="backup_power_of_attorney_healthcare">Backup Power of Attorney – Healthcare</option>
                            <option value="backup_trustee">Backup Trustee</option>
                            <option value="backup_undertutor">Backup Undertutor</option>
                            <option value="designee_remains">Designee for Remains / Burial / Services</option>
                            <option value="executor">Executor</option>
                            <option value="guardian_tutor">Guardian (Tutor)</option>
                            <option value="power_of_attorney_financial">Power of Attorney – Financial</option>
                            <option value="power_of_attorney_healthcare">Power of Attorney – Healthcare</option>
                            <option value="special_trustee">Special Trustee</option>
                            <option value="trustee">Trustee</option>
                            <option value="undertutor">Undertutor</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Important Information
                          </label>
                          <textarea
                            value={role.importantInfo}
                            onChange={(e) => handleRoleChange(decisionMaker.id, role.id, 'importantInfo', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                            rows="3"
                            placeholder="Any important information about this role..."
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={role.isCoRole}
                            onChange={(e) => handleRoleChange(decisionMaker.id, role.id, 'isCoRole', e.target.checked)}
                            className="mr-2 text-gray-600 focus:ring-gray-500"
                          />
                          <span className="text-sm text-gray-700">This is a Co-Role (shared responsibility)</span>
                        </label>
                      </div>

                      {role.isCoRole && (
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Co-Role Person
                          </label>
                          <select
                            value={role.coRolePersonId || ''}
                            onChange={(e) => handlePersonSelection(decisionMaker.id, e.target.value, 'coRole', role.id)}
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

                      {/* New Person Form for Co-Role */}
                      {showNewPersonForm[`coRole_${decisionMaker.id}_${role.id}`] && (
                        <div className="mt-4 p-4 bg-white border border-gray-300 rounded-lg">
                          <h5 className="text-md font-semibold text-gray-900 mb-4">Add New Co-Role Person</h5>
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
                              onClick={() => cancelNewPerson(decisionMaker.id, 'coRole', role.id)}
                              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 font-medium"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => saveNewPerson(decisionMaker.id, 'coRole', role.id)}
                              className="px-6 py-2 text-white rounded-lg transition-colors duration-200 font-medium"
                              style={{ background: 'linear-gradient(90deg, var(--ll-bg-2), var(--ll-bg-1))' }}
                            >
                              Save Co-Role Person
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Additional Notes
                        </label>
                        <textarea
                          value={role.notes}
                          onChange={(e) => handleRoleChange(decisionMaker.id, role.id, 'notes', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                          rows="2"
                          placeholder="Additional notes about this role..."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex justify-center">
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

          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/liabilities')}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-8 py-3 text-white rounded-lg transition-colors duration-200 font-medium"
              style={{ background: 'linear-gradient(90deg, var(--ll-bg-2), var(--ll-bg-1))' }}
            >
              Continue to Advisors
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
