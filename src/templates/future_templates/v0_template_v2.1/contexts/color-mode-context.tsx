"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

type ColorMode = "dark" | "light"

interface ColorModeContextType {
  colorMode: ColorMode
  toggleColorMode: () => void
  setColorMode: (mode: ColorMode) => void
}

const ColorModeContext = createContext<ColorModeContextType | undefined>(undefined)

export function ColorModeProvider({ children }: { children: React.ReactNode }) {
  const [colorMode, setColorMode] = useState<ColorMode>("dark")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check localStorage and system preference
    const stored = localStorage.getItem("color-mode") as ColorMode
    if (stored) {
      setColorMode(stored)
    } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      setColorMode("light")
    }
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    const root = document.documentElement
    
    // Remove all color mode classes first
    root.classList.remove("dark", "light")
    
    // Add the appropriate class
    root.classList.add(colorMode)
    
    // Store preference
    localStorage.setItem("color-mode", colorMode)
    
    console.log(`Color mode changed to: ${colorMode}, classes:`, root.className)
  }, [colorMode, mounted])

  const toggleColorMode = () => {
    setColorMode(prev => prev === "dark" ? "light" : "dark")
  }

  const value = {
    colorMode,
    toggleColorMode,
    setColorMode
  }

  // Prevent flash of incorrect theme
  if (!mounted) {
    return null
  }

  return (
    <ColorModeContext.Provider value={value}>
      {children}
    </ColorModeContext.Provider>
  )
}

export function useColorMode() {
  const context = useContext(ColorModeContext)
  if (!context) {
    throw new Error("useColorMode must be used within ColorModeProvider")
  }
  return context
}