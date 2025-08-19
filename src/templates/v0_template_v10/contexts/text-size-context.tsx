"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

export type TextSizeOption = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'

export interface TextSizeSettings {
  // Achievement cards
  achievementTitle: TextSizeOption
  achievementDescription: TextSizeOption
  
  // Project cards
  projectTitle: TextSizeOption
  projectDescription: TextSizeOption
  
  // Experience cards
  experienceTitle: TextSizeOption
  experienceDescription: TextSizeOption
  
  // Education cards
  educationTitle: TextSizeOption
  educationDescription: TextSizeOption
  
  // Skills
  skillCategoryTitle: TextSizeOption
  skillItem: TextSizeOption
  
  // Certifications
  certificationTitle: TextSizeOption
  certificationDescription: TextSizeOption
  
  // Volunteer
  volunteerTitle: TextSizeOption
  volunteerDescription: TextSizeOption
  
  // Publications
  publicationTitle: TextSizeOption
  publicationDescription: TextSizeOption
  
  // Speaking
  speakingTitle: TextSizeOption
  speakingDescription: TextSizeOption
  
  // Hobbies
  hobbyTitle: TextSizeOption
  hobbyDescription: TextSizeOption
  
  // Global text
  bodyText: TextSizeOption
  smallText: TextSizeOption
  
  // Contact section
  contactText: TextSizeOption
  
  // Summary section
  summaryText: TextSizeOption
}

const defaultTextSizes: TextSizeSettings = {
  // Achievement cards
  achievementTitle: '2xl',
  achievementDescription: 'base',
  
  // Project cards  
  projectTitle: '2xl',
  projectDescription: 'base',
  
  // Experience cards
  experienceTitle: '2xl', 
  experienceDescription: 'base',
  
  // Education cards
  educationTitle: '2xl',
  educationDescription: 'base',
  
  // Skills
  skillCategoryTitle: 'xl',
  skillItem: 'base',
  
  // Certifications
  certificationTitle: '2xl',
  certificationDescription: 'base',
  
  // Volunteer
  volunteerTitle: '2xl',
  volunteerDescription: 'base',
  
  // Publications
  publicationTitle: '2xl',
  publicationDescription: 'base',
  
  // Speaking
  speakingTitle: '2xl',
  speakingDescription: 'base',
  
  // Hobbies
  hobbyTitle: '2xl',
  hobbyDescription: 'base',
  
  // Global text
  bodyText: 'base',
  smallText: 'sm',
  
  // Contact section
  contactText: 'base',
  
  // Summary section
  summaryText: 'base'
}

interface TextSizeContextType {
  textSizes: TextSizeSettings
  updateTextSize: (key: keyof TextSizeSettings, size: TextSizeOption) => void
  resetToDefaults: () => void
  getTextSizeClass: (key: keyof TextSizeSettings) => string
}

const TextSizeContext = createContext<TextSizeContextType | undefined>(undefined)

export function TextSizeProvider({ children }: { children: React.ReactNode }) {
  const [textSizes, setTextSizes] = useState<TextSizeSettings>(defaultTextSizes)

  // Load saved text sizes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('portfolio-text-sizes')
    if (saved) {
      try {
        const parsedSizes = JSON.parse(saved)
        setTextSizes({ ...defaultTextSizes, ...parsedSizes })
      } catch (error) {
        console.warn('Failed to load saved text sizes:', error)
      }
    }
  }, [])

  // Save text sizes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('portfolio-text-sizes', JSON.stringify(textSizes))
  }, [textSizes])

  const updateTextSize = (key: keyof TextSizeSettings, size: TextSizeOption) => {
    setTextSizes(prev => ({
      ...prev,
      [key]: size
    }))
  }

  const resetToDefaults = () => {
    setTextSizes(defaultTextSizes)
  }

  const getTextSizeClass = (key: keyof TextSizeSettings): string => {
    const size = textSizes[key]
    switch (size) {
      case 'xs': return 'text-xs'
      case 'sm': return 'text-sm'
      case 'base': return 'text-base'
      case 'lg': return 'text-lg'
      case 'xl': return 'text-xl'
      case '2xl': return 'text-2xl'
      case '3xl': return 'text-3xl'
      case '4xl': return 'text-4xl'
      case '5xl': return 'text-5xl'
      case '6xl': return 'text-6xl'
      default: return 'text-base'
    }
  }

  return (
    <TextSizeContext.Provider value={{
      textSizes,
      updateTextSize,
      resetToDefaults,
      getTextSizeClass
    }}>
      {children}
    </TextSizeContext.Provider>
  )
}

export function useTextSize() {
  const context = useContext(TextSizeContext)
  if (context === undefined) {
    throw new Error('useTextSize must be used within a TextSizeProvider')
  }
  return context
}

// Helper component for easy text size application
export function CustomText({ 
  sizeKey, 
  children, 
  className = '', 
  as: Component = 'div',
  ...props 
}: {
  sizeKey: keyof TextSizeSettings
  children: React.ReactNode
  className?: string
  as?: React.ElementType
  [key: string]: any
}) {
  const { getTextSizeClass } = useTextSize()
  
  return (
    <Component 
      className={`${getTextSizeClass(sizeKey)} ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}