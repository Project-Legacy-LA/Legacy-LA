import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { usePeople } from '../../contexts/PeopleContext'

export default function Documents() {
  const navigate = useNavigate()
  const pageRef = useRef(null)
  const formRef = useRef(null)
  const headerRef = useRef(null)
  const { people, getPersonDisplayName, getPeopleOptions, addPerson } = usePeople()

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

  const [documents, setDocuments] = useState([
    {
      id: 1,
      documentType: 'will',
      title: '',
      dateCreated: '',
      dateLastUpdated: '',
      location: '',
      attorneyId: null,
      isCurrent: true,
      notes: '',
      files: []
    }
  ])

  const [showNewPersonForm, setShowNewPersonForm] = useState({
    attorney: null
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

  const documentTypes = [
    { value: 'birth_certificate', label: 'Birth Certificate' },
    { value: 'business_document', label: 'Business Document' },
    { value: 'bank_statement', label: 'Bank/Account/Credit Card Statement' },
    { value: 'death_certificate', label: 'Death Certificate' },
    { value: 'divorce_decree', label: 'Divorce Decree' },
    { value: 'insurance_policy', label: 'Insurance Policy' },
    { value: 'living_will', label: 'Living Will' },
    { value: 'marriage_certificate', label: 'Marriage Certificate' },
    { value: 'military_records', label: 'Military Records' },
    { value: 'power_of_attorney_financial', label: 'Power of Attorney - Financial' },
    { value: 'power_of_attorney_healthcare', label: 'Power of Attorney - Healthcare' },
    { value: 'prenuptial_agreement', label: 'Prenuptial Agreement' },
    { value: 'property_deed', label: 'Property Deed' },
    { value: 'retirement_account', label: 'Retirement Account Document' },
    { value: 'social_security_card', label: 'Social Security Card' },
    { value: 'trust', label: 'Trust' },
    { value: 'will', label: 'Will' },
    { value: 'other', label: 'Other' }
  ]

  const addDocument = () => {
    const newId = Math.max(...documents.map(d => d.id), 0) + 1
    setDocuments([...documents, {
      id: newId,
      documentType: 'will',
      title: '',
      dateCreated: '',
      dateLastUpdated: '',
      location: '',
      attorneyId: null,
      witnesses: [],
      isCurrent: true,
      notes: '',
      files: []
    }])
  }

  const removeDocument = (documentId) => {
    setDocuments(documents.filter(d => d.id !== documentId))
  }

  const handleDocumentChange = (documentId, field, value) => {
    setDocuments(documents.map(d => 
      d.id === documentId 
        ? { ...d, [field]: value }
        : d
    ))
  }

  const handlePersonSelection = (documentId, type, value) => {
    if (value === 'other') {
      setShowNewPersonForm(prev => ({ ...prev, [type]: documentId }))
    } else {
      setShowNewPersonForm(prev => ({ ...prev, [type]: null }))
      if (type === 'attorney') {
        handleDocumentChange(documentId, 'attorneyId', parseInt(value) || null)
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
    // For year, allow partial input without immediate validation
    if (type === 'year') {
      // Allow empty string or partial year input
      if (value === '' || /^\d{1,4}$/.test(value)) {
        handleNewPersonChange(field, value)
      }
      return
    }
    
    let numValue = parseInt(value) || ''
    
    if (type === 'month') {
      numValue = Math.min(Math.max(numValue, 1), 12)
    } else if (type === 'day') {
      numValue = Math.min(Math.max(numValue, 1), 31)
    }
    
    handleNewPersonChange(field, numValue)
  }

  const saveNewPerson = (documentId, type) => {
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
        roles: ['attorney', 'witness']
      })
      
      if (type === 'attorney') {
        handleDocumentChange(documentId, 'attorneyId', newPersonId)
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

  const handleFileUpload = (documentId, files) => {
    const fileArray = Array.from(files).map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file
    }))
    handleDocumentChange(documentId, 'files', fileArray)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Documents submitted:', documents)
    // Submit data to backend service
    navigate('/succession/co-executor-access')
  }

  return (
    <div ref={pageRef} className="min-h-screen text-black bg-white">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div ref={headerRef} className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2" style={{ fontFamily: 'var(--ll-font)' }}>
            Succession - Documents
          </h1>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-gray-700 font-medium mb-2">
              To help us prepare the succession paperwork accurately and efficiently, please upload copies of any documents listed below that you have available. If you've already provided certain documents, you do not need to upload them again.
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Most Important Documents:</strong>
            </p>
            <ul className="text-sm text-gray-600 list-disc list-inside mb-2">
              <li>(1) Death certificate</li>
              <li>(2) Last Will and Testament - if more than one version exists, please upload all versions or drafts, and indicate: You have the original, You have a copy only, or You are unsure whether an original exists</li>
            </ul>
          </div>
        </div>

        {/* Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          
          {/* General Document Upload Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">General Document Upload</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Miscellaneous Documents
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      multiple
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                    />
                    <span className="text-sm text-gray-500">Upload multiple files (PDF, images, Word docs)</span>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Use this section for any documents that don't fit into specific categories below, such as:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Previous wills or estate planning documents</li>
                    <li>Birth certificates</li>
                    <li>Social Security cards</li>
                    <li>Military records</li>
                    <li>Other legal documents</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Documents Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Specific Documents</h2>
              <button
                type="button"
                onClick={addDocument}
                className="px-4 py-2 text-white rounded-lg transition-colors duration-200 font-medium text-sm"
                style={{ background: 'linear-gradient(90deg, var(--ll-bg-2), var(--ll-bg-1))' }}
              >
                + Add Document
              </button>
            </div>
            
            {documents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No documents added yet. Click "Add Document" to add your documents.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {documents.map((document, index) => (
                  <div key={document.id} className="p-6 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Document {index + 1}
                      </h3>
                      {documents.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeDocument(document.id)}
                          className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                        >
                          Remove Document
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Document Type *
                        </label>
                        <select
                          value={document.documentType}
                          onChange={(e) => handleDocumentChange(document.id, 'documentType', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                        >
                          {documentTypes.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Document Title
                        </label>
                        <input
                          type="text"
                          value={document.title}
                          onChange={(e) => handleDocumentChange(document.id, 'title', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                          placeholder="e.g., Last Will and Testament of John Doe"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date Created
                        </label>
                        <input
                          type="date"
                          value={document.dateCreated}
                          onChange={(e) => handleDocumentChange(document.id, 'dateCreated', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date Last Updated
                        </label>
                        <input
                          type="date"
                          value={document.dateLastUpdated}
                          onChange={(e) => handleDocumentChange(document.id, 'dateLastUpdated', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Physical Location
                        </label>
                        <input
                          type="text"
                          value={document.location}
                          onChange={(e) => handleDocumentChange(document.id, 'location', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                          placeholder="e.g., Safe deposit box, home safe, attorney's office"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Attorney (if applicable)
                        </label>
                        <select
                          value={document.attorneyId || ''}
                          onChange={(e) => handlePersonSelection(document.id, 'attorney', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                        >
                          <option value="">Select attorney...</option>
                          {getPeopleOptions().map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                          <option value="other">Other (Add new person)</option>
                        </select>
                      </div>
                    </div>

                    {/* New Person Form for Attorney */}
                    {showNewPersonForm.attorney === document.id && (
                      <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Add New Attorney</h4>
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
                            onClick={() => cancelNewPerson('attorney')}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 font-medium"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => saveNewPerson(document.id, 'attorney')}
                            className="px-6 py-2 text-white rounded-lg transition-colors duration-200 font-medium"
                            style={{ background: 'linear-gradient(90deg, var(--ll-bg-2), var(--ll-bg-1))' }}
                          >
                            Save Attorney
                          </button>
                        </div>
                      </div>
                    )}


                    {/* Document Upload */}
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Document Files
                      </label>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        multiple
                        onChange={(e) => handleFileUpload(document.id, e.target.files)}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                      />
                      {document.files.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">Uploaded files:</p>
                          <ul className="text-sm text-gray-500 mt-1">
                            {document.files.map(file => (
                              <li key={file.id}>• {file.name}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Current Status */}
                    <div className="mt-6">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={document.isCurrent}
                          onChange={(e) => handleDocumentChange(document.id, 'isCurrent', e.target.checked)}
                          className="mr-2 text-gray-600 focus:ring-gray-500"
                        />
                        <span className="text-sm text-gray-700">This is a current/active document</span>
                      </label>
                    </div>

                    {/* Notes */}
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Notes
                      </label>
                      <textarea
                        value={document.notes}
                        onChange={(e) => handleDocumentChange(document.id, 'notes', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                        rows="3"
                        placeholder="Any additional information about this document..."
                      />
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
              onClick={() => navigate('/succession/advisors')}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium"
            >
              Back to Advisors
            </button>
            <button
              type="submit"
              className="px-8 py-3 text-white rounded-lg transition-colors duration-200 font-medium"
              style={{ background: 'linear-gradient(90deg, var(--ll-bg-2), var(--ll-bg-1))' }}
            >
              Continue to Co-Executor Access
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