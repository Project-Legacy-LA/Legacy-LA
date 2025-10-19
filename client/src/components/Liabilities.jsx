import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePeople } from '../contexts/PeopleContext'
import { useAssets } from '../contexts/AssetsContext'
import { gsap } from 'gsap'

export default function Liabilities() {
  const navigate = useNavigate()
  const pageRef = useRef(null)
  const formRef = useRef(null)
  const headerRef = useRef(null)
  const { people } = usePeople()
  const { assets } = useAssets()

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0)
    
    const tl = gsap.timeline()
    
    // Simple fade-in animation
    tl.fromTo(pageRef.current, 
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: "none" }
    )
  }, [])

  const [liabilities, setLiabilities] = useState([
    {
      id: 1,
      type: 'mortgage',
      description: '',
      amount: '',
      monthlyPayment: '',
      associatedAssetId: null,
      creditor: '',
      accountNumber: '',
      notes: ''
    }
  ])

  const addLiability = () => {
    const newId = Math.max(...liabilities.map(l => l.id)) + 1
    setLiabilities([...liabilities, {
      id: newId,
      type: 'mortgage',
      description: '',
      amount: '',
      monthlyPayment: '',
      associatedAssetId: null,
      creditor: '',
      accountNumber: '',
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

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Liabilities submitted:', liabilities)
    // In a real application, you would send this data to your backend
    navigate('/advisors') // Navigate to next page
  }

  // Define which liability types can be associated with assets
  const getAssociatedAssetTypes = (liabilityType) => {
    switch (liabilityType) {
      case 'mortgage':
        return ['real_estate']
      case 'auto_loan':
        return ['vehicle']
      case 'boat_loan':
        return ['vehicle']
      case 'trailer_loan':
        return ['vehicle']
      case 'business_loan':
        return ['business']
      case 'home_equity':
        return ['real_estate']
      case 'construction_loan':
        return ['real_estate']
      default:
        return []
    }
  }

  // Get available assets that match the liability type
  const getAvailableAssets = (liabilityType) => {
    const associatedTypes = getAssociatedAssetTypes(liabilityType)
    return assets.filter(asset => associatedTypes.includes(asset.category))
  }

  const liabilityTypes = [
    { value: 'mortgage', label: 'Mortgage' },
    { value: 'auto_loan', label: 'Auto Loan' },
    { value: 'boat_loan', label: 'Boat Loan' },
    { value: 'trailer_loan', label: 'Trailer Loan' },
    { value: 'business_loan', label: 'Business Loan' },
    { value: 'home_equity', label: 'Home Equity Loan' },
    { value: 'construction_loan', label: 'Construction Loan' },
    { value: 'credit_card', label: 'Credit Card Debt' },
    { value: 'personal_loan', label: 'Personal Loan' },
    { value: 'student_loan', label: 'Student Loan' },
    { value: 'medical_debt', label: 'Medical Debt' },
    { value: 'other', label: 'Other' }
  ]

  return (
    <div ref={pageRef} className="min-h-screen text-black bg-white">
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div ref={headerRef} className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2" style={{ fontFamily: 'var(--ll-font)' }}>
            Liabilities & Debts
          </h1>
          <p className="text-gray-600">
            List all your debts and liabilities. Some debts can be associated with specific assets.
          </p>
        </div>

        {/* Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          
          {/* Liabilities Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Your Liabilities</h2>
              <button
                type="button"
                onClick={addLiability}
                className="px-4 py-2 text-white rounded-lg transition-colors duration-200 font-medium text-sm"
                style={{ background: 'linear-gradient(90deg, var(--ll-bg-2), var(--ll-bg-1))' }}
              >
                + Add Liability
              </button>
            </div>
            
            {liabilities.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No liabilities added yet. Click "Add Liability" to add your debts.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {liabilities.map((liability, index) => (
                  <div key={liability.id} className="p-6 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-md font-semibold text-gray-800">Liability {index + 1}</h3>
                      <button
                        type="button"
                        onClick={() => removeLiability(liability.id)}
                        className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                      >
                        Remove Liability
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Liability Type *
                        </label>
                        <select
                          value={liability.type}
                          onChange={(e) => handleLiabilityChange(liability.id, 'type', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                        >
                          {liabilityTypes.map(type => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
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
                          placeholder="e.g., Primary residence mortgage"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Outstanding Balance
                        </label>
                        <input
                          type="number"
                          value={liability.amount}
                          onChange={(e) => handleLiabilityChange(liability.id, 'amount', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Monthly Payment
                        </label>
                        <input
                          type="number"
                          value={liability.monthlyPayment}
                          onChange={(e) => handleLiabilityChange(liability.id, 'monthlyPayment', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Creditor/Lender
                        </label>
                        <input
                          type="text"
                          value={liability.creditor}
                          onChange={(e) => handleLiabilityChange(liability.id, 'creditor', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                          placeholder="e.g., Bank of America"
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
                          placeholder="Last 4 digits: ****1234"
                        />
                      </div>
                    </div>

                    {/* Asset Association - Only show for relevant liability types */}
                    {getAssociatedAssetTypes(liability.type).length > 0 && (
                      <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Associated Asset (if applicable)
                        </label>
                        <select
                          value={liability.associatedAssetId || ''}
                          onChange={(e) => handleLiabilityChange(liability.id, 'associatedAssetId', e.target.value ? parseInt(e.target.value) : null)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                        >
                          <option value="">Select asset (optional)</option>
                          {getAvailableAssets(liability.type).map(asset => (
                            <option key={asset.id} value={asset.id}>
                              {asset.description} - {asset.category.replace('_', ' ').toUpperCase()}
                            </option>
                          ))}
                        </select>
                        <p className="text-sm text-gray-500 mt-1">
                          Link this liability to a specific asset (e.g., mortgage for real estate, auto loan for vehicle)
                        </p>
                      </div>
                    )}

                    {/* Notes */}
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Notes
                      </label>
                      <textarea
                        value={liability.notes}
                        onChange={(e) => handleLiabilityChange(liability.id, 'notes', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                        rows="3"
                        placeholder="Any additional information about this liability..."
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
              onClick={() => navigate('/assets')}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium"
            >
              Back to Assets
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

        {/* Info Footer */}
        <div className="mt-8 text-center">
          <div className="py-4 px-6 rounded-lg" style={{ background: 'linear-gradient(90deg, var(--ll-bg-2), var(--ll-bg-1))', color: 'white' }}>
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Only relevant assets will be shown for association. Credit cards and personal loans cannot be linked to specific assets.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
