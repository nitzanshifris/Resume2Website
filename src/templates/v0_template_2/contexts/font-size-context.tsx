"use client"

import type React from "react"
import { createContext, useContext, useState, useMemo } from "react"

type FontSize = "sm" | "md" | "lg"
type FontSizeContextType = {
  fontSize: FontSize
  setFontSize: (size: FontSize) => void
  // A helper to get Tailwind classes based on the current size
  getSizeClasses: (type: keyof typeof sizeClasses.md) => string
}

// Define the size mappings here so they can be accessed from the context
const sizeClasses = {
  sm: {
    heroName: "text-2xl md:text-4xl lg:text-7xl",
    heroTitle: "text-sm md:text-5xl",
    sectionTitle: "text-5xl",
    profileDesc: "text-xl",
    bentoTitle: "text-base",
    bentoDesc: "text-xs",
    timelinePeriod: "text-base",
    timelineTitle: "text-2xl",
    timelineSubtitle: "text-lg",
    timelineList: "text-base",
    accomplishmentCard: "text-lg",
    contactLabel: "text-xs",
    contactValue: "text-base",
    button: "text-sm",
  },
  md: {
    heroName: "text-2xl md:text-4xl lg:text-9xl",
    heroTitle: "text-base md:text-6xl",
    sectionTitle: "text-7xl",
    profileDesc: "text-2xl",
    bentoTitle: "text-lg",
    bentoDesc: "text-sm",
    timelinePeriod: "text-lg",
    timelineTitle: "text-3xl",
    timelineSubtitle: "text-xl",
    timelineList: "text-lg",
    accomplishmentCard: "text-xl",
    contactLabel: "text-sm",
    contactValue: "text-lg",
    button: "text-base",
  },
  lg: {
    heroName: "text-4xl md:text-6xl lg:text-[10rem]",
    heroTitle: "text-lg md:text-7xl",
    sectionTitle: "text-8xl",
    profileDesc: "text-3xl",
    bentoTitle: "text-xl",
    bentoDesc: "text-base",
    timelinePeriod: "text-xl",
    timelineTitle: "text-4xl",
    timelineSubtitle: "text-2xl",
    timelineList: "text-xl",
    accomplishmentCard: "text-2xl",
    contactLabel: "text-base",
    contactValue: "text-xl",
    button: "text-lg",
  },
}

const FontSizeContext = createContext<FontSizeContextType | undefined>(undefined)

export const FontSizeProvider = ({ children }: { children: React.ReactNode }) => {
  const [fontSize, setFontSize] = useState<FontSize>("md")

  const getSizeClasses = (type: keyof typeof sizeClasses.md) => {
    return sizeClasses[fontSize][type]
  }

  const value = useMemo(
    () => ({
      fontSize,
      setFontSize,
      getSizeClasses,
    }),
    [fontSize],
  )

  return <FontSizeContext.Provider value={value}>{children}</FontSizeContext.Provider>
}

export const useFontSize = () => {
  const context = useContext(FontSizeContext)
  if (!context) {
    throw new Error("useFontSize must be used within a FontSizeProvider")
  }
  return context
}
