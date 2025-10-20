import React, { createContext, useContext, useState } from 'react'

const AssetsContext = createContext()

export const useAssets = () => {
  const context = useContext(AssetsContext)
  if (!context) {
    throw new Error('useAssets must be used within an AssetsProvider')
  }
  return context
}

export const AssetsProvider = ({ children }) => {
  const [assets, setAssets] = useState([])

  const addAsset = (asset) => {
    setAssets(prev => [...prev, asset])
  }

  const updateAsset = (assetId, updates) => {
    setAssets(prev => prev.map(asset => 
      asset.id === assetId ? { ...asset, ...updates } : asset
    ))
  }

  const removeAsset = (assetId) => {
    setAssets(prev => prev.filter(asset => asset.id !== assetId))
  }

  const setAssetsData = (assetsData) => {
    setAssets(assetsData)
  }

  const value = {
    assets,
    addAsset,
    updateAsset,
    removeAsset,
    setAssetsData
  }

  return (
    <AssetsContext.Provider value={value}>
      {children}
    </AssetsContext.Provider>
  )
}
