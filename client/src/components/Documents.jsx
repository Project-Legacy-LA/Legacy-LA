import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'

export default function Documents() {
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

  const [documents, setDocuments] = useState([
    {
      id: 1,
      documentType: 'will',
      title: '',
      dateCreated: '',
      dateLastUpdated: '',
      location: '',
      attorneyName: '',
      witnesses: [],
      isCurrent: true,
      notes: ''
    }
  ])

  const documentTypes = [
    { value: 'will', label: 'Will' },
    { value: 'trust', label: 'Trust' },
    { value: 'power_of_attorney_financial', label: 'Power of Attorney - Financial' },
    { value: 'power_of_attorney_healthcare', label: 'Power of Attorney - Healthcare' },
    { value: 'living_will', label: 'Living Will' },
    { value: 'divorce_decree', label: 'Divorce Decree' },
    { value: 'marriage_certificate', label: 'Marriage Certificate' },
    { value: 'birth_certificate', label: 'Birth Certificate' },
    { value: 'death_certificate', label: 'Death Certificate' },
    { value: 'property_deed', label: 'Property Deed' },
    { value: 'insurance_policy', label: 'Insurance Policy' },
    { value: 'retirement_account', label: 'Retirement Account Document' },
    { value: 'business_document', label: 'Business Document' },
    { value: 'other', label: 'Other' }
  ]

  const addDocument = () => {
    const newId = Math.max(...documents.map(d => d.id)) + 1
    setDocuments([...documents, {
      id: newId,
      documentType: 'will',
      title: '',
      dateCreated: '',
      dateLastUpdated: '',
      location: '',
      attorneyName: '',
      witnesses: [],
      isCurrent: true,
      notes: ''
    }])
  }

  const handleDocumentChange = (documentId, field, value) => {
    setDocuments(documents.map(d => 
      d.id === documentId 
        ? { ...d, [field]: value }
        : d
    ))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Documents submitted:', documents)
    // Navigate to summary or next section
    navigate('/')
  }

  return (
    <div ref={pageRef} className="min-h-screen text-black bg-white">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div ref={headerRef} className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2" style={{ fontFamily: 'var(--ll-font)' }}>
            Documents
          </h1>
          <p className="text-gray-600">
            Document your existing estate planning documents, legal papers, and other important documents. This helps ensure your new plan coordinates with existing arrangements.
          </p>
        </div>

        {/* Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          
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
                      onClick={() => setDocuments(documents.filter(d => d.id !== document.id))}
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
                      Attorney Name (if applicable)
                    </label>
                    <input
                      type="text"
                      value={document.attorneyName}
                      onChange={(e) => handleDocumentChange(document.id, 'attorneyName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                      placeholder="Attorney who prepared the document"
                    />
                  </div>
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

            <button
              type="button"
              onClick={addDocument}
              className="px-6 py-3 text-white rounded-lg transition-colors duration-200 font-medium"
              style={{ background: 'linear-gradient(90deg, var(--ll-bg-2), var(--ll-bg-1))' }}
            >
              + Add Another Document
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/advisors')}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium"
            >
              Back to Advisors
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
