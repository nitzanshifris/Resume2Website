"use client"
import React, { createContext, useContext, useState, useCallback } from 'react'

interface WatermarkContextType {
  isWatermarkVisible: boolean
  toggleWatermark: () => void
  setWatermarkVisible: (value: boolean) => void
}

const WatermarkContext = createContext<WatermarkContextType | undefined>(undefined)

export function WatermarkProvider({ children }: { children: React.ReactNode }) {
  const [isWatermarkVisible, setIsWatermarkVisible] = useState(true)

  const toggleWatermark = useCallback(() => {
    setIsWatermarkVisible(prev => !prev)
  }, [])

  const setWatermarkVisible = useCallback((value: boolean) => {
    setIsWatermarkVisible(value)
  }, [])

  return (
    <WatermarkContext.Provider value={{ isWatermarkVisible, toggleWatermark, setWatermarkVisible }}>
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