"use client"

import type React from "react"
import { createContext, useContext, useState, useMemo, useEffect } from "react"

type Theme = "purple" | "blue" | "green" | "orange"

export const themeOptions: { name: Theme; hsl: string; wavy: string[]; evervaultGradient: string }[] = [
  {
    name: "purple",
    hsl: "262 83% 60%",
    wavy: ["#38bdf8", "#818cf8", "#c084fc", "#e879f9", "#22d3ee"],
    evervaultGradient: "bg-gradient-to-r from-green-500 to-blue-700",
  },
  {
    name: "blue",
    hsl: "221 83% 53%",
    wavy: ["#4cc9f0", "#4361ee", "#3a0ca3", "#7400b8", "#56cfe1"],
    evervaultGradient: "bg-gradient-to-r from-cyan-400 to-blue-600",
  },
  {
    name: "green",
    hsl: "145 63% 42%",
    wavy: ["#9ef01a", "#70e000", "#38b000", "#008000", "#004b23"],
    evervaultGradient: "bg-gradient-to-r from-lime-400 to-emerald-600",
  },
  {
    name: "orange",
    hsl: "25 95% 53%",
    wavy: ["#fef08a", "#fed7aa", "#fb923c", "#f97316", "#ef4444"],
    evervaultGradient: "bg-gradient-to-r from-yellow-400 to-red-500",
  },
]

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  wavyColors: string[]
  evervaultGradient: string
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>("purple")

  useEffect(() => {
    const currentTheme = themeOptions.find((t) => t.name === theme)
    if (currentTheme) {
      // Set the HSL value in the CSS variable
      document.documentElement.style.setProperty("--accent-hsl", currentTheme.hsl)
    }
  }, [theme])

  const value = useMemo(() => {
    const currentTheme = themeOptions.find((t) => t.name === theme)
    return {
      theme,
      setTheme,
      wavyColors: currentTheme?.wavy || [],
      evervaultGradient: currentTheme?.evervaultGradient || "bg-gradient-to-r from-green-500 to-blue-700",
    }
  }, [theme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
