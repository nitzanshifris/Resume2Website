"use client"
import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"

export type ViewMode = "text" | "image" | "url" | "github" | "code" | "image-carousel"

// New state shape: { [sectionKey: string]: { [itemKey: string]: ViewMode } }
type ItemViewModes = Record<string, Record<string, ViewMode>>

interface SettingsProviderState {
  itemViewModes: ItemViewModes
  setItemViewMode: (sectionKey: string, itemKey: string, mode: ViewMode) => void
}

const SettingsProviderContext = createContext<SettingsProviderState | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [itemViewModes, setItemViewModes] = useState<ItemViewModes>({})

  useEffect(() => {
    try {
      const storedModes = localStorage.getItem("portfolio-item-view-modes")
      if (storedModes) {
        setItemViewModes(JSON.parse(storedModes))
      }
    } catch (error) {
      console.error("Failed to parse stored item view modes", error)
      setItemViewModes({})
    }
  }, [])

  const setItemViewMode = useCallback((sectionKey: string, itemKey: string, mode: ViewMode) => {
    setItemViewModes((prevModes) => {
      const newModes = {
        ...prevModes,
        [sectionKey]: {
          ...prevModes[sectionKey],
          [itemKey]: mode,
        },
      }
      localStorage.setItem("portfolio-item-view-modes", JSON.stringify(newModes))
      return newModes
    })
  }, [])

  const value = {
    itemViewModes,
    setItemViewMode,
  }

  return <SettingsProviderContext.Provider value={value}>{children}</SettingsProviderContext.Provider>
}

export const useSettings = (): SettingsProviderState => {
  const context = useContext(SettingsProviderContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
