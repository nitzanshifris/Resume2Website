"use client"

import React, { createContext, useContext, useState } from 'react'

interface WatermarkContextType {
  isWatermarkVisible: boolean
  toggleWatermark: () => void
}

const WatermarkContext = createContext<WatermarkContextType | undefined>(undefined)

export function WatermarkProvider({ children }: { children: React.ReactNode }) {
  const [isWatermarkVisible, setIsWatermarkVisible] = useState(true)

  const toggleWatermark = () => {
    setIsWatermarkVisible(prev => !prev)
  }

  return (
    <WatermarkContext.Provider value={{ isWatermarkVisible, toggleWatermark }}>
      {children}
    </WatermarkContext.Provider>
  )
}

export function useWatermark() {
  const context = useContext(WatermarkContext)
  if (context === undefined) {
    throw new Error('useWatermark must be used within a WatermarkProvider')
  }
  return context
}