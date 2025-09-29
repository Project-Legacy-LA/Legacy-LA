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

  const [documents, setDocuments] = useState({
    // Wills
    wills: [
      {
        id: 1,
        testatorPersonId: null,
        dateSigned: '',
        independentAdministration: false,
        bondOrCompensation: '',
        isLastWill: true,
        bequests: [
          {
            id: 1,
            bequestType: 'specific',
            description: '',
            partyPersonId: null,
            partyTrustId: null,
            percent: null,
            perStirpes: false
          }
        ]
      }
    ],
    
    // Trusts
    trusts: [
      {
        id: 1,
        trustName: '',
        trustType: 'revocable',
        dateSigned: '',
        notes: ''
      }
    ],
    
    // Other documents
    otherDocuments: [
      {
        id: 1,
        documentType: 'power_of_attorney',
        documentName: '',
        dateSigned: '',
        location: '',
        notes: ''
      }
    ]
  })

  const addWill = () => {
    const newId = Math.max(...documents.wills.map(w => w.id)) + 1
    setDocuments(prev => ({
      ...prev,
      wills: [...prev.wills, {
        id: newId,
        testatorPersonId: null,
        dateSigned: '',
        independentAdministration: false,
        bondOrCompensation: '',
        isLastWill: true,
        bequests: [
          {
            id: 1,
            bequestType: 'specific',
            description: '',
            partyPersonId: null,
            partyTrustId: null,
            percent: null,
            perStirpes: false
          }
        ]
      }]
    }))
  }

  const addTrust = () => {
    const newId = Math.max(...documents.trusts.map(t => t.id)) + 1
    setDocuments(prev => ({
      ...prev,
      trusts: [...prev.trusts, {
        id: newId,
        trustName: '',
        trustType: 'revocable',
        dateSigned: '',
        notes: ''
      }]
    }))
  }

  const addOtherDocument = () => {
    const newId = Math.max(...documents.otherDocuments.map(d => d.id)) + 1
    setDocuments(prev => ({
      ...prev,
      otherDocuments: [...prev.otherDocuments, {
        id: newId,
        documentType: 'power_of_attorney',
        documentName: '',
        dateSigned: '',
        location: '',
        notes: ''
      }]
    }))
  }

  const removeWill = (willId) => {
    if (documents.wills.length > 1) {
      setDocuments(prev => ({
        ...prev,
        wills: prev.wills.filter(w => w.id !== willId)
      }))
    }
  }

  const removeTrust = (trustId) => {
    if (documents.trusts.length > 1) {
      setDocuments(prev => ({
        ...prev,
        trusts: prev.trusts.filter(t => t.id !== trustId)
      }))
    }
  }

  const removeOtherDocument = (docId) => {
    if (documents.otherDocuments.length > 1) {
      setDocuments(prev => ({
        ...prev,
        otherDocuments: prev.otherDocuments.filter(d => d.id !== docId)
      }))
    }
  }

  const handleWillChange = (willId, field, value) => {
    setDocuments(prev => ({
      ...prev,
      wills: prev.wills.map(w => 
        w.id === willId 
          ? { ...w, [field]: value }
          : w
      )
    }))
  }

  const handleTrustChange = (trustId, field, value) => {
    setDocuments(prev => ({
      ...prev,
      trusts: prev.trusts.map(t => 
        t.id === trustId 
          ? { ...t, [field]: value }
          : t
      )
    }))
  }

  const handleOtherDocumentChange = (docId, field, value) => {
    setDocuments(prev => ({
      ...prev,
      otherDocuments: prev.otherDocuments.map(d => 
        d.id === docId 
          ? { ...d, [field]: value }
          : d
      )
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Documents form submitted:', documents)
    // Navigate back to home (end of flow)
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
            Please provide information about your existing estate planning documents. All fields marked with * are required.
          </p>
        </div>

        {/* Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          {/* Wills Section */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Wills</h2>
              <button
                type="button"
                onClick={addWill}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
              >
                + Add Will
              </button>
            </div>

            {documents.wills.map((will, index) => (
              <div key={will.id} className="mb-8 p-6 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Will {index + 1}
                  </h3>
                  {documents.wills.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeWill(will.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Remove Will
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    {/* Date Signed */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date Signed *
                      </label>
                      <input
                        type="date"
                        value={will.dateSigned}
                        onChange={(e) => handleWillChange(will.id, 'dateSigned', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                      />
                    </div>

                    {/* Independent Administration */}
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={will.independentAdministration}
                          onChange={(e) => handleWillChange(will.id, 'independentAdministration', e.target.checked)}
                          className="mr-2 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Independent Administration</span>
                      </label>
                    </div>

                    {/* Bond or Compensation */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bond or Compensation
                      </label>
                      <input
                        type="text"
                        value={will.bondOrCompensation}
                        onChange={(e) => handleWillChange(will.id, 'bondOrCompensation', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                        placeholder="e.g., No bond required, $10,000 bond"
                      />
                    </div>

                    {/* Is Last Will */}
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={will.isLastWill}
                          onChange={(e) => handleWillChange(will.id, 'isLastWill', e.target.checked)}
                          className="mr-2 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">This is your last will and testament</span>
                      </label>
                    </div>
                  </div>

                  {/* Right Column - Bequests */}
                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-700">Bequests</h4>
                    {will.bequests.map((bequest, bequestIndex) => (
                      <div key={bequest.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="space-y-3">
                          {/* Bequest Type */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Bequest Type
                            </label>
                            <select
                              value={bequest.bequestType}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                            >
                              <option value="specific">Specific Bequest</option>
                              <option value="percentage">Percentage Bequest</option>
                              <option value="residuary">Residuary Bequest</option>
                            </select>
                          </div>

                          {/* Description */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Description
                            </label>
                            <input
                              type="text"
                              value={bequest.description}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                              placeholder="Description of the bequest"
                            />
                          </div>

                          {/* Percentage (if applicable) */}
                          {bequest.bequestType === 'percentage' && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Percentage
                              </label>
                              <div className="flex space-x-2">
                                <input
                                  type="number"
                                  value={bequest.percent || ''}
                                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                                />
                                <span className="flex items-center px-3 py-3 bg-gray-100 border border-gray-300 rounded-r-lg text-gray-700">
                                  %
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Per Stirpes */}
                          <div>
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={bequest.perStirpes}
                                className="mr-2 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700">Per Stirpes</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trusts Section */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Trusts</h2>
              <button
                type="button"
                onClick={addTrust}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
              >
                + Add Trust
              </button>
            </div>

            {documents.trusts.map((trust, index) => (
              <div key={trust.id} className="mb-8 p-6 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Trust {index + 1}
                  </h3>
                  {documents.trusts.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTrust(trust.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Remove Trust
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    {/* Trust Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Trust Name *
                      </label>
                      <input
                        type="text"
                        value={trust.trustName}
                        onChange={(e) => handleTrustChange(trust.id, 'trustName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                        placeholder="e.g., Smith Family Trust"
                      />
                    </div>

                    {/* Trust Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Trust Type *
                      </label>
                      <select
                        value={trust.trustType}
                        onChange={(e) => handleTrustChange(trust.id, 'trustType', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                      >
                        <option value="revocable">Revocable Trust</option>
                        <option value="irrevocable">Irrevocable Trust</option>
                        <option value="family">Family Trust</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Date Signed */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date Signed
                      </label>
                      <input
                        type="date"
                        value={trust.dateSigned}
                        onChange={(e) => handleTrustChange(trust.id, 'dateSigned', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    {/* Notes */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notes
                      </label>
                      <textarea
                        value={trust.notes}
                        onChange={(e) => handleTrustChange(trust.id, 'notes', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                        rows="4"
                        placeholder="Any additional information about this trust..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Other Documents Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Other Documents</h2>
              <button
                type="button"
                onClick={addOtherDocument}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
              >
                + Add Document
              </button>
            </div>

            {documents.otherDocuments.map((doc, index) => (
              <div key={doc.id} className="mb-6 p-6 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Document {index + 1}
                  </h3>
                  {documents.otherDocuments.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeOtherDocument(doc.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Remove Document
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    {/* Document Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Document Type *
                      </label>
                      <select
                        value={doc.documentType}
                        onChange={(e) => handleOtherDocumentChange(doc.id, 'documentType', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                      >
                        <option value="power_of_attorney">Power of Attorney</option>
                        <option value="healthcare_proxy">Healthcare Proxy</option>
                        <option value="living_will">Living Will</option>
                        <option value="advance_directive">Advance Directive</option>
                        <option value="prenuptial_agreement">Prenuptial Agreement</option>
                        <option value="postnuptial_agreement">Postnuptial Agreement</option>
                        <option value="business_agreement">Business Agreement</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Document Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Document Name
                      </label>
                      <input
                        type="text"
                        value={doc.documentName}
                        onChange={(e) => handleOtherDocumentChange(doc.id, 'documentName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                        placeholder="Name or title of the document"
                      />
                    </div>

                    {/* Date Signed */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date Signed
                      </label>
                      <input
                        type="date"
                        value={doc.dateSigned}
                        onChange={(e) => handleOtherDocumentChange(doc.id, 'dateSigned', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    {/* Location */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={doc.location}
                        onChange={(e) => handleOtherDocumentChange(doc.id, 'location', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                        placeholder="Where the document is stored"
                      />
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notes
                      </label>
                      <textarea
                        value={doc.notes}
                        onChange={(e) => handleOtherDocumentChange(doc.id, 'notes', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                        rows="3"
                        placeholder="Any additional information about this document..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
