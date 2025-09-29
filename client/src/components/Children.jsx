import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'

export default function Children() {
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

  const [children, setChildren] = useState([
    {
      id: 1,
      firstName: '',
      middleName: '',
      lastName: '',
      dateOfBirth: { month: '', day: '', year: '' },
      lifeStatus: 'alive',
      adoptionStatus: 'none',
      adoptionDate: '',
      incapacityStatus: 'none',
      isForcedHeir: false,
      forcedHeirReason: '', // 'age' or 'disability'
      notes: ''
    }
  ])

  const [parentage, setParentage] = useState([
    {
      id: 1,
      childId: 1,
      parentType: 'biological_parent',
      parentalRights: 'full',
      startDate: '',
      endDate: '',
      legalBasis: '',
      notes: ''
    }
  ])

  const addChild = () => {
    const newId = Math.max(...children.map(c => c.id)) + 1
    setChildren([...children, {
      id: newId,
      firstName: '',
      middleName: '',
      lastName: '',
      dateOfBirth: { month: '', day: '', year: '' },
      lifeStatus: 'alive',
      adoptionStatus: 'none',
      adoptionDate: '',
      incapacityStatus: 'none',
      isForcedHeir: false,
      forcedHeirReason: '',
      notes: ''
    }])
  }

  const removeChild = (childId) => {
    if (children.length > 1) {
      setChildren(children.filter(c => c.id !== childId))
      setParentage(parentage.filter(p => p.childId !== childId))
    }
  }

  const calculateForcedHeirStatus = (child) => {
    const currentYear = new Date().getFullYear()
    const birthYear = parseInt(child.dateOfBirth.year)
    const age = currentYear - birthYear
    
    // Check if child is under 24 years old
    const isUnder24 = age < 24
    
    // Check if child has permanent incapacity
    const hasPermanentIncapacity = child.incapacityStatus === 'permanent_incapacity'
    
    const isForcedHeir = isUnder24 || hasPermanentIncapacity
    let forcedHeirReason = ''
    
    if (isForcedHeir) {
      if (isUnder24 && hasPermanentIncapacity) {
        forcedHeirReason = 'age_and_disability'
      } else if (isUnder24) {
        forcedHeirReason = 'age'
      } else if (hasPermanentIncapacity) {
        forcedHeirReason = 'disability'
      }
    }
    
    return { isForcedHeir, forcedHeirReason }
  }

  const handleChildChange = (childId, field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setChildren(children.map(c => {
        if (c.id === childId) {
          const updatedChild = { ...c, [parent]: { ...c[parent], [child]: value } }
          
          // Recalculate forced heir status when relevant fields change
          if (parent === 'dateOfBirth' || field === 'incapacityStatus') {
            const { isForcedHeir, forcedHeirReason } = calculateForcedHeirStatus(updatedChild)
            return { ...updatedChild, isForcedHeir, forcedHeirReason }
          }
          
          return updatedChild
        }
        return c
      }))
    } else {
      setChildren(children.map(c => {
        if (c.id === childId) {
          const updatedChild = { ...c, [field]: value }
          
          // Recalculate forced heir status when relevant fields change
          if (field === 'incapacityStatus') {
            const { isForcedHeir, forcedHeirReason } = calculateForcedHeirStatus(updatedChild)
            return { ...updatedChild, isForcedHeir, forcedHeirReason }
          }
          
          return updatedChild
        }
        return c
      }))
    }
  }

  const handleParentageChange = (parentageId, field, value) => {
    setParentage(parentage.map(p => 
      p.id === parentageId 
        ? { ...p, [field]: value }
        : p
    ))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Children form submitted:', { children, parentage })
    // Navigate to next section
    navigate('/advisors')
  }

  return (
    <div ref={pageRef} className="min-h-screen text-black bg-white">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div ref={headerRef} className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2" style={{ fontFamily: 'var(--ll-font)' }}>
            Children
          </h1>
          <p className="text-gray-600">
            Please provide information about your children. All fields marked with * are required.
          </p>
        </div>

        {/* Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          {children.map((child, index) => (
            <div key={child.id} className="mb-8 p-6 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Child {index + 1}
                </h3>
                {children.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeChild(child.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Remove Child
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={child.firstName}
                      onChange={(e) => handleChildChange(child.id, 'firstName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    />
                  </div>

                  {/* Middle Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Middle Name
                    </label>
                    <input
                      type="text"
                      value={child.middleName}
                      onChange={(e) => handleChildChange(child.id, 'middleName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={child.lastName}
                      onChange={(e) => handleChildChange(child.id, 'lastName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
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
                          value={child.dateOfBirth.month}
                          onChange={(e) => handleChildChange(child.id, 'dateOfBirth.month', e.target.value)}
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Day</label>
                        <input
                          type="number"
                          value={child.dateOfBirth.day}
                          onChange={(e) => handleChildChange(child.id, 'dateOfBirth.day', e.target.value)}
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Year</label>
                        <input
                          type="number"
                          value={child.dateOfBirth.year}
                          onChange={(e) => handleChildChange(child.id, 'dateOfBirth.year', e.target.value)}
                          className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Life Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Life Status *
                    </label>
                    <select
                      value={child.lifeStatus}
                      onChange={(e) => handleChildChange(child.id, 'lifeStatus', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    >
                      <option value="alive">Alive</option>
                      <option value="deceased">Deceased</option>
                    </select>
                  </div>

                  {/* Adoption Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adoption Status
                    </label>
                    <select
                      value={child.adoptionStatus}
                      onChange={(e) => handleChildChange(child.id, 'adoptionStatus', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    >
                      <option value="none">None</option>
                      <option value="adopted">Adopted</option>
                      <option value="stepchild">Stepchild</option>
                      <option value="foster">Foster</option>
                    </select>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Adoption Date */}
                  {child.adoptionStatus !== 'none' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Adoption Date
                      </label>
                      <input
                        type="date"
                        value={child.adoptionDate}
                        onChange={(e) => handleChildChange(child.id, 'adoptionDate', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                      />
                    </div>
                  )}

                  {/* Incapacity Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Incapacity Status
                    </label>
                    <select
                      value={child.incapacityStatus}
                      onChange={(e) => handleChildChange(child.id, 'incapacityStatus', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                    >
                      <option value="none">None</option>
                      <option value="permanent_incapacity">Permanent Incapacity</option>
                    </select>
                  </div>

                  {/* Forced Heir Status */}
                  {child.isForcedHeir && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <h4 className="text-sm font-medium text-yellow-800">Forced Heir Status</h4>
                          <p className="text-sm text-yellow-700">
                            {child.forcedHeirReason === 'age' && 'This child is under 24 years old and is considered a forced heir under Louisiana law.'}
                            {child.forcedHeirReason === 'disability' && 'This child has permanent incapacity and is considered a forced heir under Louisiana law.'}
                            {child.forcedHeirReason === 'age_and_disability' && 'This child is under 24 years old and has permanent incapacity, making them a forced heir under Louisiana law.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={child.notes}
                      onChange={(e) => handleChildChange(child.id, 'notes', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                      rows="3"
                      placeholder="Any additional information about this child..."
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Add Child Button */}
          <div className="mb-8">
            <button
              type="button"
              onClick={addChild}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              + Add Another Child
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
