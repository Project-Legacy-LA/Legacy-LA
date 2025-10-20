// API Integration Examples
// Demonstrates proper API service usage patterns

import React, { useState, useEffect } from 'react'
import apiService from '../services/api'
import { transformPersonData, transformAssetData } from '../utils/dataTransform'

// Example: AboutYouComprehensive with API integration
export default function ExampleAboutYouWithAPI() {
  const [formData, setFormData] = useState({
    legalFirstName: '',
    legalLastName: '',
    email: '',
    phone: '',
    // ... other fields
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [clientId, setClientId] = useState(null)

  // Load existing client data on component mount
  useEffect(() => {
    const loadClientData = async () => {
      try {
        // Retrieve current client ID from routing context
        const currentClientId = getCurrentClientId()
        setClientId(currentClientId)
        
        if (currentClientId) {
          const clientData = await apiService.getClientData(currentClientId)
          setFormData(clientData)
        }
      } catch (err) {
        console.error('Failed to load client data:', err)
        setError('Failed to load client data')
      }
    }

    loadClientData()
  }, [])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Transform data for API
      const transformedData = transformPersonData(formData)
      
      if (clientId) {
        // Update existing client
        await apiService.updateClientData(clientId, transformedData)
        console.log('Client data updated successfully')
      } else {
        // Initialize new client record
        const response = await apiService.updateClientData(null, transformedData)
        setClientId(response.data.client_id)
        console.log('Client created successfully')
      }
      
      // Navigate to next step
      // navigate('/assets')
      
    } catch (err) {
      console.error('Failed to save client data:', err)
      setError(err.message || 'Failed to save client data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">About You</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name *
          </label>
          <input
            type="text"
            value={formData.legalFirstName}
            onChange={(e) => handleInputChange('legalFirstName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name *
          </label>
          <input
            type="text"
            value={formData.legalLastName}
            onChange={(e) => handleInputChange('legalLastName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone *
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            onClick={() => window.history.back()}
          >
            Back
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Continue'}
          </button>
        </div>
      </form>
    </div>
  )
}

// Example: Assets with API integration
export function ExampleAssetsWithAPI() {
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [clientId, setClientId] = useState(null)

  // Load existing assets on component mount
  useEffect(() => {
    const loadAssets = async () => {
      try {
        const currentClientId = getCurrentClientId()
        setClientId(currentClientId)
        
        if (currentClientId) {
          const assetsData = await apiService.getAssets(currentClientId)
          setAssets(assetsData)
        }
      } catch (err) {
        console.error('Failed to load assets:', err)
        setError('Failed to load assets')
      }
    }

    loadAssets()
  }, [])

  const addAsset = async (assetData) => {
    if (!clientId) {
      setError('Client ID not found')
      return
    }

    setLoading(true)
    try {
      const transformedData = transformAssetData(assetData)
      const response = await apiService.createAsset(clientId, transformedData)
      
      setAssets(prev => [...prev, response.data])
      console.log('Asset created successfully')
    } catch (err) {
      console.error('Failed to create asset:', err)
      setError(err.message || 'Failed to create asset')
    } finally {
      setLoading(false)
    }
  }

  const updateAsset = async (assetId, assetData) => {
    if (!clientId) {
      setError('Client ID not found')
      return
    }

    setLoading(true)
    try {
      const transformedData = transformAssetData(assetData)
      const response = await apiService.updateAsset(clientId, assetId, transformedData)
      
      setAssets(prev => prev.map(asset => 
        asset.id === assetId ? response.data : asset
      ))
      console.log('Asset updated successfully')
    } catch (err) {
      console.error('Failed to update asset:', err)
      setError(err.message || 'Failed to update asset')
    } finally {
      setLoading(false)
    }
  }

  const deleteAsset = async (assetId) => {
    if (!clientId) {
      setError('Client ID not found')
      return
    }

    setLoading(true)
    try {
      await apiService.deleteAsset(clientId, assetId)
      
      setAssets(prev => prev.filter(asset => asset.id !== assetId))
      console.log('Asset deleted successfully')
    } catch (err) {
      console.error('Failed to delete asset:', err)
      setError(err.message || 'Failed to delete asset')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Assets</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        {assets.map(asset => (
          <div key={asset.id} className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold">{asset.description}</h3>
            <p>Category: {asset.category}</p>
            <p>Value: ${asset.valuation?.amount}</p>
            
            <div className="mt-2 space-x-2">
              <button
                onClick={() => updateAsset(asset.id, { ...asset, description: asset.description + ' (Updated)' })}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                disabled={loading}
              >
                Update
              </button>
              
              <button
                onClick={() => deleteAsset(asset.id)}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                disabled={loading}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <button
        onClick={() => addAsset({
          category: 'real_estate',
          description: 'New Asset',
          valuation: { amount: 100000, currency: 'USD' }
        })}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        disabled={loading}
      >
        {loading ? 'Adding...' : 'Add Asset'}
      </button>
    </div>
  )
}

// Helper function to get current client ID
function getCurrentClientId() {
  // Retrieve client ID from routing context or local storage
  // Implementation depends on authentication system
  return localStorage.getItem('current_client_id')
}

// Example: Error handling utility
export const handleApiError = (error, setError) => {
  console.error('API Error:', error)
  
  if (error.message) {
    setError(error.message)
  } else if (error.response?.data?.message) {
    setError(error.response.data.message)
  } else {
    setError('An unexpected error occurred')
  }
}

// Example: Loading state component
export const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div className="flex items-center justify-center p-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    <span className="ml-2 text-gray-600">{message}</span>
  </div>
)

// Example: Success message component
export const SuccessMessage = ({ message, onClose }) => (
  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
    <span>{message}</span>
    <button
      onClick={onClose}
      className="text-green-700 hover:text-green-900"
    >
      ×
    </button>
  </div>
)

