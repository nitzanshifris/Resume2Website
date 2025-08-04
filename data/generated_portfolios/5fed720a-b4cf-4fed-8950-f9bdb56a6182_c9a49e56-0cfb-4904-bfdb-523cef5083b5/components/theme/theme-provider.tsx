"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useMemo } from "react"
import { themes, type Theme } from "@/lib/themes"

// Turn "Cream & Gold" -> "cream-and-gold", "Sapphire Night" -> "sapphire-night"
const slugify = (str: string) =>
  str
    .toLowerCase()
    .replace(/&/g, "and") // replace ampersand
    .replace(/\s+/g, "-") // replace one or more spaces with -
    .replace(/[^\w-]/g, "") // strip any other non-word chars

interface ThemeProviderProps {
  children: React.ReactNode
}

interface ThemeProviderState {
  theme: Theme
  setTheme: (name: string) => void
  themes: Theme[]
  wavyColors: string[]
}

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined)

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [themeName, setThemeName] = useState("Cream & Gold")

  useEffect(() => {
    const storedTheme = localStorage.getItem("portfolio-theme")
    if (storedTheme && themes.find((t) => t.name === storedTheme)) {
      setThemeName(storedTheme)
    }
  }, [])

  useEffect(() => {
    const currentTheme = themes.find((t) => t.name === themeName)
    if (currentTheme) {
      const root = window.document.documentElement
      root.classList.remove(...themes.map((t) => slugify(t.name)))
      root.classList.add(slugify(currentTheme.name))

      Object.entries(currentTheme.colors).forEach(([name, color]) => {
        root.style.setProperty(`--${name}`, color)
      })
      localStorage.setItem("portfolio-theme", currentTheme.name)
    }
  }, [themeName])

  const theme = useMemo(() => themes.find((t) => t.name === themeName) || themes[0], [themeName])

  // Map theme colors to wavy background colors
  const wavyColors = useMemo(() => {
    const colorMap = {
      "Cream & Gold": ["#FBBF24", "#F59E0B", "#D97706", "#B45309", "#92400E"],
      "Midnight Blush": ["#F472B6", "#EC4899", "#DB2777", "#BE185D", "#9D174D"],
      "Evergreen": ["#10B981", "#059669", "#047857", "#065F46", "#064E3B"],
      "Interstellar": ["#C084FC", "#A855F7", "#9333EA", "#7C3AED", "#6D28D9"],
      "Serene Sky": ["#60A5FA", "#3B82F6", "#2563EB", "#1D4ED8", "#1E40AF"],
      "Crimson Night": ["#F87171", "#EF4444", "#DC2626", "#B91C1C", "#991B1B"],
    }
    return colorMap[theme.name] || colorMap["Cream & Gold"]
  }, [theme.name])

  const value = {
    theme,
    setTheme: setThemeName,
    themes,
    wavyColors,
  }

  return <ThemeProviderContext.Provider value={value}>{children}</ThemeProviderContext.Provider>
}

export const useTheme = (): ThemeProviderState => {
  const context = useContext(ThemeProviderContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}