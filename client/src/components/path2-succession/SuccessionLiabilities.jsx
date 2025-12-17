import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePeople } from '../../contexts/PeopleContext'
import { useAssets } from '../../contexts/AssetsContext'
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
    
    // Page entrance animation
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
      currentAmount: '',
      monthlyPayment: '',
      associatedAssetId: null,
      creditor: '',
      accountNumber: '',
      debtHolder: 'your_name', // 'your_name', 'joint', 'spouse_name', 'other'
      debtHolderOther: '', // For 'other' option
      debtCharacter: 'community', // 'community', 'quasi_community', 'separate'
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
      currentAmount: '',
      monthlyPayment: '',
      associatedAssetId: null,
      creditor: '',
      accountNumber: '',
      debtHolder: 'your_name', // 'your_name', 'joint', 'spouse_name', 'other'
      debtHolderOther: '', // For 'other' option
      debtCharacter: 'community', // 'community', 'quasi_community', 'separate'
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
    // Submit data to backend service
    navigate('/succession/roles')
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
    { value: 'auto_loan', label: 'Auto Loan' },
    { value: 'boat_loan', label: 'Boat Loan' },
    { value: 'business_loan', label: 'Business Loan' },
    { value: 'construction_loan', label: 'Construction Loan' },
    { value: 'credit_card', label: 'Credit Card Debt' },
    { value: 'funeral_burial', label: 'Funeral/Burial Expenses' },
    { value: 'home_equity', label: 'Home Equity Loan' },
    { value: 'medical_debt', label: 'Medical Debt' },
    { value: 'mortgage', label: 'Mortgage' },
    { value: 'personal_loan', label: 'Personal Loan' },
    { value: 'student_loan', label: 'Student Loan' },
    { value: 'trailer_loan', label: 'Trailer Loan' },
    { value: 'other', label: 'Other' }
  ]

  return (
    <div ref={pageRef} className="min-h-screen text-black bg-white">
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div ref={headerRef} className="mb-8">
          <h1 className="text-3xl font-bold text-black mb-2" style={{ fontFamily: 'var(--ll-font)' }}>
            Succession - Liabilities & Debts
          </h1>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-gray-700 font-medium mb-2">
              Please list all known debts, loans, or other obligations of the decedent that were outstanding at the time of death.
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Include both secured debts (such as a mortgage or vehicle loan) and unsecured debts (such as credit cards or medical bills). If exact balances are not known, provide your best estimate as of the date of death, or note "unknown."
            </p>
            <p className="text-sm text-gray-600 mb-2">
              Be sure to include: Mortgages or home equity loans on any real estate; auto loans, boat loans, or other installment debts; credit card balances or personal loans; medical bills or nursing home expenses (including unpaid invoices received after death); funeral or burial expenses, taxes owed, including income taxes, property taxes, or business-related taxes, and other obligations, such as court judgments, child/spousal support arrears, or unpaid business debts.
            </p>
            <p className="text-sm text-gray-600">
              If you are unsure whether a liability should be listed, please include it - we can determine later whether it needs to be addressed in the succession. Attach copies of recent statements or invoices if available, as these help us verify balances and creditors.
            </p>
          </div>
        </div>

        {/* Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          
          {/* Liabilities Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Decedent's Liabilities</h2>
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
                        className="px-4 py-2 text-white rounded-lg transition-all duration-200 font-medium text-sm shadow-lg hover:shadow-xl hover:brightness-110 active:scale-95"
                        style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626, #b91c1c)' }}
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
                          Outstanding Balance <span className="text-sm font-normal text-gray-600">(as of decedent's date of death)</span>
                        </label>
                        <div className="flex space-x-2">
                          <span className="flex items-center px-3 py-3 bg-gray-100 border border-gray-300 rounded-l-lg text-gray-700">
                            $
                          </span>
                          <input
                            type="number"
                            value={liability.amount}
                            onChange={(e) => handleLiabilityChange(liability.id, 'amount', e.target.value)}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Balance outstanding as of date of death</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Current Balance <span className="text-sm font-normal text-gray-600">(Today's balance)</span>
                        </label>
                        <div className="flex space-x-2">
                          <span className="flex items-center px-3 py-3 bg-gray-100 border border-gray-300 rounded-l-lg text-gray-700">
                            $
                          </span>
                          <input
                            type="number"
                            value={liability.currentAmount}
                            onChange={(e) => handleLiabilityChange(liability.id, 'currentAmount', e.target.value)}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Current outstanding balance</p>
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

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Whose Name is the Debt In? *
                        </label>
                        <select
                          value={liability.debtHolder}
                          onChange={(e) => handleLiabilityChange(liability.id, 'debtHolder', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                        >
                          <option value="your_name">Decedent's name only (Can still be a community debt even if just in the decedent's name)</option>
                          <option value="joint">Joint (Both names)</option>
                          <option value="spouse_name">Spouse's name only</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      {liability.debtHolder === 'other' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Please specify
                          </label>
                          <input
                            type="text"
                            value={liability.debtHolderOther}
                            onChange={(e) => handleLiabilityChange(liability.id, 'debtHolderOther', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                            placeholder="e.g., Business name, Trust name, etc."
                          />
                        </div>
                      )}
                    </div>

                    {/* Marital Character */}
                    <div className="mt-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Marital Character *
                          </label>
                          <select
                            value={liability.debtCharacter || 'community'}
                            onChange={(e) => handleLiabilityChange(liability.id, 'debtCharacter', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                          >
                            <option value="community">Community Debt</option>
                            <option value="quasi_community">Quasi Community Debt</option>
                            <option value="separate">Separate Debt</option>
                          </select>
                        </div>
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
              onClick={() => navigate('/succession/assets')}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium"
            >
              Back to Assets
            </button>
            <button
              type="submit"
              className="px-8 py-3 text-white rounded-lg transition-colors duration-200 font-medium"
              style={{ background: 'linear-gradient(90deg, var(--ll-bg-2), var(--ll-bg-1))' }}
            >
              Continue to Estate Representative
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
