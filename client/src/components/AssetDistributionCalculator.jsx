import React, { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'

export default function AssetDistributionCalculator({ assets, beneficiaries, onDistributionChange }) {
  const pageRef = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline()
    
    // Simple fade-in animation
    tl.fromTo(pageRef.current, 
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: "none" }
    )
  }, [])

  const [distributions, setDistributions] = useState({})
  const [totalValue, setTotalValue] = useState(0)
  const [distributionType, setDistributionType] = useState('percentage') // 'percentage' or 'fixed_amount'

  // Calculate total asset value
  useEffect(() => {
    const total = assets.reduce((sum, asset) => {
      return sum + (parseFloat(asset.valuation.amount) || 0)
    }, 0)
    setTotalValue(total)
  }, [assets])

  // Initialize distributions for each asset
  useEffect(() => {
    const newDistributions = {}
    assets.forEach(asset => {
      if (!distributions[asset.id]) {
        newDistributions[asset.id] = {
          beneficiaries: {},
          totalPercentage: 0,
          distributionType: 'percentage'
        }
      }
    })
    if (Object.keys(newDistributions).length > 0) {
      setDistributions(prev => ({ ...prev, ...newDistributions }))
    }
  }, [assets])

  const handleBeneficiaryDistributionChange = (assetId, beneficiaryId, value) => {
    const newDistributions = { ...distributions }
    if (!newDistributions[assetId]) {
      newDistributions[assetId] = { beneficiaries: {}, totalPercentage: 0, distributionType: 'percentage' }
    }
    
    newDistributions[assetId].beneficiaries[beneficiaryId] = parseFloat(value) || 0
    
    // Calculate total percentage
    const totalPercentage = Object.values(newDistributions[assetId].beneficiaries)
      .reduce((sum, val) => sum + val, 0)
    newDistributions[assetId].totalPercentage = totalPercentage
    
    setDistributions(newDistributions)
    onDistributionChange(newDistributions)
  }

  const handleDistributionTypeChange = (assetId, type) => {
    const newDistributions = { ...distributions }
    if (!newDistributions[assetId]) {
      newDistributions[assetId] = { beneficiaries: {}, totalPercentage: 0, distributionType: type }
    }
    newDistributions[assetId].distributionType = type
    setDistributions(newDistributions)
    onDistributionChange(newDistributions)
  }

  const calculateBeneficiaryValue = (assetId, beneficiaryId) => {
    const asset = assets.find(a => a.id === assetId)
    const distribution = distributions[assetId]
    if (!asset || !distribution) return 0
    
    const assetValue = parseFloat(asset.valuation.amount) || 0
    const beneficiaryPercentage = distribution.beneficiaries[beneficiaryId] || 0
    
    if (distribution.distributionType === 'percentage') {
      return (assetValue * beneficiaryPercentage) / 100
    } else {
      return beneficiaryPercentage
    }
  }

  const getTotalDistributedValue = (assetId) => {
    const asset = assets.find(a => a.id === assetId)
    const distribution = distributions[assetId]
    if (!asset || !distribution) return 0
    
    const assetValue = parseFloat(asset.valuation.amount) || 0
    if (distribution.distributionType === 'percentage') {
      return (assetValue * distribution.totalPercentage) / 100
    } else {
      return Object.values(distribution.beneficiaries)
        .reduce((sum, val) => sum + val, 0)
    }
  }

  const getRemainingValue = (assetId) => {
    const asset = assets.find(a => a.id === assetId)
    const distribution = distributions[assetId]
    if (!asset || !distribution) return 0
    
    const assetValue = parseFloat(asset.valuation.amount) || 0
    const distributedValue = getTotalDistributedValue(assetId)
    return assetValue - distributedValue
  }

  const autoDistributeEqually = (assetId) => {
    const asset = assets.find(a => a.id === assetId)
    const distribution = distributions[assetId]
    if (!asset || !distribution) return
    
    const selectedBeneficiaries = Object.keys(distribution.beneficiaries)
      .filter(id => distribution.beneficiaries[id] > 0)
    
    if (selectedBeneficiaries.length === 0) return
    
    const equalPercentage = 100 / selectedBeneficiaries.length
    const newDistributions = { ...distributions }
    
    selectedBeneficiaries.forEach(beneficiaryId => {
      newDistributions[assetId].beneficiaries[beneficiaryId] = equalPercentage
    })
    
    newDistributions[assetId].totalPercentage = 100
    setDistributions(newDistributions)
    onDistributionChange(newDistributions)
  }

  const getBeneficiaryDisplayName = (beneficiaryId) => {
    const beneficiary = beneficiaries.find(b => b.id === beneficiaryId)
    if (!beneficiary) return 'Unknown Beneficiary'
    
    const person = assets.find(a => a.id === beneficiary.personId) // This should be from people array
    return person ? `${person.firstName} ${person.lastName}`.trim() : 'Unnamed Beneficiary'
  }

  return (
    <div ref={pageRef} className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-blue-800">Asset Distribution Calculator</h3>
            <p className="text-sm text-blue-700 mt-1">
              This tool helps you calculate exact dollar amounts for asset distributions. 
              You can distribute by percentage or fixed dollar amounts.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Asset Distribution Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700">Total Estate Value</h3>
            <p className="text-2xl font-bold text-green-600">${totalValue.toLocaleString()}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700">Total Distributed</h3>
            <p className="text-2xl font-bold text-blue-600">
              ${Object.keys(distributions).reduce((sum, assetId) => sum + getTotalDistributedValue(assetId), 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700">Remaining</h3>
            <p className="text-2xl font-bold text-red-600">
              ${Object.keys(distributions).reduce((sum, assetId) => sum + getRemainingValue(assetId), 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {assets.map(asset => (
        <div key={asset.id} className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {asset.description || `Asset ${asset.id}`}
            </h3>
            <div className="text-sm text-gray-600">
              Value: ${(parseFloat(asset.valuation.amount) || 0).toLocaleString()}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Distribution Type
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={distributions[asset.id]?.distributionType === 'percentage'}
                  onChange={() => handleDistributionTypeChange(asset.id, 'percentage')}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Percentage</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={distributions[asset.id]?.distributionType === 'fixed_amount'}
                  onChange={() => handleDistributionTypeChange(asset.id, 'fixed_amount')}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Fixed Dollar Amount</span>
              </label>
            </div>
          </div>

          <div className="space-y-4">
            {beneficiaries.map(beneficiary => (
              <div key={beneficiary.id} className="flex items-center space-x-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {getBeneficiaryDisplayName(beneficiary.id)}
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      value={distributions[asset.id]?.beneficiaries[beneficiary.id] || 0}
                      onChange={(e) => handleBeneficiaryDistributionChange(asset.id, beneficiary.id, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                      placeholder={distributions[asset.id]?.distributionType === 'percentage' ? '0' : '0.00'}
                      min="0"
                      step={distributions[asset.id]?.distributionType === 'percentage' ? '0.01' : '0.01'}
                    />
                    <span className="flex items-center px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 text-sm">
                      {distributions[asset.id]?.distributionType === 'percentage' ? '%' : '$'}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-600 min-w-0">
                  <div className="font-medium">
                    ${calculateBeneficiaryValue(asset.id, beneficiary.id).toLocaleString()}
                  </div>
                  <div className="text-xs">
                    {distributions[asset.id]?.distributionType === 'percentage' 
                      ? `${((distributions[asset.id]?.beneficiaries[beneficiary.id] || 0) / 100 * 100).toFixed(1)}%`
                      : `${(((distributions[asset.id]?.beneficiaries[beneficiary.id] || 0) / (parseFloat(asset.valuation.amount) || 1)) * 100).toFixed(1)}%`
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Total Distributed:</span> 
                <span className="ml-2">
                  {distributions[asset.id]?.distributionType === 'percentage' 
                    ? `${distributions[asset.id]?.totalPercentage || 0}%`
                    : `$${(getTotalDistributedValue(asset.id)).toLocaleString()}`
                  }
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => autoDistributeEqually(asset.id)}
                  className="px-3 py-1 text-white rounded text-sm"
                  style={{ background: 'linear-gradient(90deg, var(--ll-bg-2), var(--ll-bg-1))' }}
                >
                  Distribute Equally
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const newDistributions = { ...distributions }
                    newDistributions[asset.id] = { beneficiaries: {}, totalPercentage: 0, distributionType: 'percentage' }
                    setDistributions(newDistributions)
                    onDistributionChange(newDistributions)
                  }}
                  className="px-3 py-1 text-white rounded text-sm"
                  style={{ background: 'linear-gradient(90deg, var(--ll-bg-2), var(--ll-bg-1))' }}
                >
                  Clear All
                </button>
              </div>
            </div>
            
            {getRemainingValue(asset.id) !== 0 && (
              <div className="mt-2 text-sm text-red-600">
                <span className="font-medium">Remaining:</span> 
                <span className="ml-2">${getRemainingValue(asset.id).toLocaleString()}</span>
                {distributions[asset.id]?.distributionType === 'percentage' && (
                  <span className="ml-2">
                    ({((getRemainingValue(asset.id) / (parseFloat(asset.valuation.amount) || 1)) * 100).toFixed(1)}%)
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      ))}

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-yellow-800">Important Notes</h3>
            <ul className="text-sm text-yellow-700 mt-1 space-y-1">
              <li>• Ensure all distributions add up to 100% or the total asset value</li>
              <li>• Consider Louisiana forced heirship laws for children under 24</li>
              <li>• Review with your attorney before finalizing distributions</li>
              <li>• Save your work frequently to avoid data loss</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
