"use client"

import React, { createContext, useContext } from 'react'

interface SmartCardContextType {
  isInsideSmartCard: boolean
}

const SmartCardContext = createContext<SmartCardContextType>({ isInsideSmartCard: false })

export const useSmartCardContext = () => useContext(SmartCardContext)

interface SmartCardProviderProps {
  children: React.ReactNode
}

export const SmartCardProvider: React.FC<SmartCardProviderProps> = ({ children }) => {
  return (
    <SmartCardContext.Provider value={{ isInsideSmartCard: true }}>
      {children}
    </SmartCardContext.Provider>
  )
}