"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

export type FontCategory = "professional" | "premium" | "unique"

export interface FontOption {
  name: string
  displayName: string
  cssName: string
  category: FontCategory
  weights: string[]
  fallback: string
}

export const fontOptions: FontOption[] = [
  // Professional
  {
    name: "roboto",
    displayName: "Roboto",
    cssName: "'Roboto', sans-serif",
    category: "professional",
    weights: ["300", "400", "500", "700"],
    fallback: "sans-serif"
  },
  {
    name: "open-sans",
    displayName: "Open Sans", 
    cssName: "'Open Sans', sans-serif",
    category: "professional",
    weights: ["300", "400", "500", "600", "700"],
    fallback: "sans-serif"
  },
  {
    name: "lato",
    displayName: "Lato",
    cssName: "'Lato', sans-serif", 
    category: "professional",
    weights: ["300", "400", "700"],
    fallback: "sans-serif"
  },
  {
    name: "inter",
    displayName: "Inter",
    cssName: "'Inter', sans-serif",
    category: "professional", 
    weights: ["300", "400", "500", "600", "700"],
    fallback: "sans-serif"
  },
  {
    name: "source-sans-pro",
    displayName: "Source Sans Pro",
    cssName: "'Source Sans Pro', sans-serif",
    category: "professional",
    weights: ["300", "400", "600", "700"],
    fallback: "sans-serif"
  },
  {
    name: "ibm-plex-sans",
    displayName: "IBM Plex Sans", 
    cssName: "'IBM Plex Sans', sans-serif",
    category: "professional",
    weights: ["300", "400", "500", "600", "700"],
    fallback: "sans-serif"
  },
  {
    name: "merriweather",
    displayName: "Merriweather",
    cssName: "'Merriweather', serif",
    category: "professional",
    weights: ["300", "400", "700"],
    fallback: "serif"
  },
  {
    name: "libre-baskerville", 
    displayName: "Libre Baskerville",
    cssName: "'Libre Baskerville', serif",
    category: "professional",
    weights: ["400", "700"],
    fallback: "serif"
  },
  
  // Premium
  {
    name: "montserrat",
    displayName: "Montserrat",
    cssName: "'Montserrat', sans-serif",
    category: "premium",
    weights: ["300", "400", "500", "600", "700"],
    fallback: "sans-serif"
  },
  {
    name: "poppins",
    displayName: "Poppins", 
    cssName: "'Poppins', sans-serif",
    category: "premium",
    weights: ["300", "400", "500", "600", "700"],
    fallback: "sans-serif"
  },
  {
    name: "work-sans",
    displayName: "Work Sans",
    cssName: "'Work Sans', sans-serif",
    category: "premium",
    weights: ["300", "400", "500", "600", "700"],
    fallback: "sans-serif"
  },
  {
    name: "manrope",
    displayName: "Manrope",
    cssName: "'Manrope', sans-serif", 
    category: "premium",
    weights: ["300", "400", "500", "600", "700"],
    fallback: "sans-serif"
  },
  {
    name: "literata",
    displayName: "Literata",
    cssName: "'Literata', serif",
    category: "premium",
    weights: ["300", "400", "500", "600", "700"],
    fallback: "serif"
  },
  {
    name: "playfair-display",
    displayName: "Playfair Display",
    cssName: "'Playfair Display', serif",
    category: "premium",
    weights: ["400", "500", "600", "700", "800", "900"],
    fallback: "serif"
  },
  
  // Unique
  {
    name: "nunito",
    displayName: "Nunito",
    cssName: "'Nunito', sans-serif",
    category: "unique",
    weights: ["300", "400", "600", "700"],
    fallback: "sans-serif"
  },
  {
    name: "atkinson-hyperlegible",
    displayName: "Atkinson Hyperlegible",
    cssName: "'Atkinson Hyperlegible', sans-serif",
    category: "unique", 
    weights: ["400", "700"],
    fallback: "sans-serif"
  },
  {
    name: "zilla-slab",
    displayName: "Zilla Slab",
    cssName: "'Zilla Slab', serif",
    category: "unique",
    weights: ["300", "400", "500", "600", "700"],
    fallback: "serif"
  },
  {
    name: "fira-sans",
    displayName: "Fira Sans", 
    cssName: "'Fira Sans', sans-serif",
    category: "unique",
    weights: ["300", "400", "500", "600", "700"],
    fallback: "sans-serif"
  },
  {
    name: "ranade",
    displayName: "Ranade",
    cssName: "'Ranade', sans-serif",
    category: "unique",
    weights: ["400", "500", "600", "700"],
    fallback: "sans-serif"
  },
  {
    name: "quicksand",
    displayName: "Quicksand",
    cssName: "'Quicksand', sans-serif",
    category: "unique",
    weights: ["300", "400", "500", "600", "700"],
    fallback: "sans-serif"
  }
]

interface FontContextType {
  currentFont: FontOption
  setFont: (font: FontOption) => void
  fontsByCategory: {
    professional: FontOption[]
    premium: FontOption[]
    unique: FontOption[]
  }
}

const FontContext = createContext<FontContextType | undefined>(undefined)

export function FontProvider({ children }: { children: React.ReactNode }) {
  const [currentFont, setCurrentFont] = useState<FontOption>(fontOptions[0]) // Default to Roboto

  const fontsByCategory = {
    professional: fontOptions.filter(f => f.category === "professional"),
    premium: fontOptions.filter(f => f.category === "premium"), 
    unique: fontOptions.filter(f => f.category === "unique")
  }

  useEffect(() => {
    // Load saved font from localStorage
    const savedFont = localStorage.getItem("selectedFont")
    if (savedFont) {
      const font = fontOptions.find(f => f.name === savedFont)
      if (font) {
        setCurrentFont(font)
      }
    }
  }, [])

  useEffect(() => {
    // Apply font to document
    document.documentElement.style.setProperty("--font-primary", currentFont.cssName)
    document.documentElement.style.setProperty("--font-heading", currentFont.cssName)
    
    // Load Google Font
    loadGoogleFont(currentFont)
    
    // Save to localStorage
    localStorage.setItem("selectedFont", currentFont.name)
  }, [currentFont])

  const setFont = (font: FontOption) => {
    setCurrentFont(font)
  }

  return (
    <FontContext.Provider value={{ currentFont, setFont, fontsByCategory }}>
      {children}
    </FontContext.Provider>
  )
}

export function useFont() {
  const context = useContext(FontContext)
  if (context === undefined) {
    throw new Error("useFont must be used within a FontProvider")
  }
  return context
}

function loadGoogleFont(font: FontOption) {
  // Remove existing font link
  const existingLink = document.querySelector(`link[data-font="${font.name}"]`)
  if (existingLink) {
    existingLink.remove()
  }

  // Create new font link
  const link = document.createElement("link")
  link.href = `https://fonts.googleapis.com/css2?family=${font.displayName.replace(/ /g, "+")}:wght@${font.weights.join(";")}&display=swap`
  link.rel = "stylesheet"
  link.setAttribute("data-font", font.name)
  document.head.appendChild(link)
}