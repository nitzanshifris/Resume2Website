"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Clock, Edit2 } from 'lucide-react'
import { useEditMode } from '@/contexts/edit-mode-context'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { MovingBorder } from '@/components/ui/moving-border'

interface EditableAvailabilityProps {
  initialAvailability: string | null
  onAvailabilityChange: (availability: string | null) => void
  fontSize?: string
}

const availabilityOptions = [
  { value: 'Available for immediate start', icon: CheckCircle, color: 'green' },
  { value: 'Available for freelance', icon: CheckCircle, color: 'green' },
  { value: 'Open to opportunities', icon: Clock, color: 'yellow' },
  { value: 'Currently employed', icon: XCircle, color: 'red' },
  { value: null, icon: null, color: null, label: 'Hide status' },
]

export const EditableAvailability = ({ 
  initialAvailability, 
  onAvailabilityChange,
  fontSize = "text-base"
}: EditableAvailabilityProps) => {
  const { isEditMode } = useEditMode()
  const [availability, setAvailability] = useState(initialAvailability)
  const [showOptions, setShowOptions] = useState(false)

  const handleChange = (value: string | null) => {
    setAvailability(value)
    onAvailabilityChange(value)
    setShowOptions(false)
  }
  
  const scrollToContact = () => {
    console.log('🎯 Scroll to contact triggered!')
    
    const findAndScrollToContact = () => {
      // Try multiple strategies to find the contact section
      let contactSection = null
      
      // Strategy 1: Direct ID lookup
      contactSection = document.getElementById('contact')
      if (contactSection) {
        console.log('✅ Found contact section via ID:', contactSection)
      } else {
        console.log('❌ No element found with ID "contact"')
        
        // Strategy 2: Look for data attributes
        contactSection = document.querySelector('[data-section-id="contact"]')
        if (contactSection) {
          console.log('✅ Found contact section via data-section-id:', contactSection)
        } else {
          console.log('❌ No element found with data-section-id="contact"')
          
          // Strategy 3: Text-based search for Contact heading
          const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
          const contactHeading = headings.find(h => h.textContent?.toLowerCase().includes('contact'))
          
          if (contactHeading) {
            contactSection = contactHeading.closest('section') || contactHeading.parentElement
            console.log('✅ Found contact section via heading search:', contactSection)
          } else {
            // Strategy 4: Look for the last section (often contact)
            const allSections = document.querySelectorAll('section')
            if (allSections.length > 0) {
              contactSection = allSections[allSections.length - 1]
              console.log('✅ Using last section as contact:', contactSection)
            }
          }
        }
      }
      
      if (contactSection) {
        console.log('🚀 Scrolling to contact section...', contactSection)
        
        try {
          // Get the position of the contact section
          const rect = contactSection.getBoundingClientRect()
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop
          const targetPosition = rect.top + scrollTop - 100 // 100px offset from top for fixed headers
          
          console.log('📍 Current scroll position:', scrollTop)
          console.log('📍 Target position:', targetPosition)
          console.log('📍 Contact section rect:', rect)
          
          // Use requestAnimationFrame for smoother scrolling
          const smoothScroll = () => {
            const currentPosition = window.pageYOffset
            const distance = targetPosition - currentPosition
            const duration = 1000 // 1 second
            const start = performance.now()
            
            const animateScroll = (currentTime) => {
              const elapsed = currentTime - start
              const progress = Math.min(elapsed / duration, 1)
              
              // Easing function for smooth acceleration/deceleration
              const easeInOutCubic = (t) => t < 0.5
                ? 4 * t * t * t
                : 1 - Math.pow(-2 * t + 2, 3) / 2
              
              const easedProgress = easeInOutCubic(progress)
              const newPosition = currentPosition + (distance * easedProgress)
              
              window.scrollTo(0, newPosition)
              
              if (progress < 1) {
                requestAnimationFrame(animateScroll)
              } else {
                // Highlight the section after scrolling
                contactSection.style.transition = 'outline 0.3s ease-in-out'
                contactSection.style.outline = '3px solid #8b5cf6'
                contactSection.style.outlineOffset = '5px'
                setTimeout(() => {
                  contactSection.style.outline = ''
                  contactSection.style.outlineOffset = ''
                }, 2000)
              }
            }
            
            requestAnimationFrame(animateScroll)
          }
          
          // Start the smooth scroll
          smoothScroll()
          
        } catch (error) {
          console.error('❌ Scroll error:', error)
          // Fallback to native smooth scroll
          contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
        
        return true
      } else {
        console.warn('❌ Contact section not found!')
        return false
      }
    }
    
    // Try immediately first
    if (!findAndScrollToContact()) {
      // If not found, wait a bit longer for dynamic content to load
      console.log('🔄 Retrying after delay...')
      setTimeout(() => {
        if (!findAndScrollToContact()) {
          // Debug information
          const allSections = document.querySelectorAll('section')
          console.log('🔍 All sections found:', Array.from(allSections).map(section => ({
            tagName: section.tagName,
            id: section.id,
            className: section.className,
            textContent: section.textContent?.substring(0, 100) + '...'
          })))
          
          const elementsWithIds = document.querySelectorAll('[id]')
          console.log('🆔 All elements with IDs:', Array.from(elementsWithIds).map(el => ({
            id: el.id,
            tagName: el.tagName,
            className: el.className
          })))
          
          // Final fallback: scroll to bottom of page
          console.log('📜 Scrolling to bottom as final fallback')
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
          })
        }
      }, 500)
    }
  }

  const getColorClasses = (color: string | null) => {
    switch (color) {
      case 'green':
        return {
          border: 'border-green-500/30',
          bg: 'bg-green-500/20',
          text: 'text-green-300',
          hover: 'hover:bg-green-500/30'
        }
      case 'yellow':
        return {
          border: 'border-yellow-500/30',
          bg: 'bg-yellow-500/20',
          text: 'text-yellow-300',
          hover: 'hover:bg-yellow-500/30'
        }
      case 'red':
        return {
          border: 'border-red-500/30',
          bg: 'bg-red-500/20',
          text: 'text-red-300',
          hover: 'hover:bg-red-500/30'
        }
      default:
        return {
          border: 'border-neutral-500/30',
          bg: 'bg-neutral-500/20',
          text: 'text-neutral-300',
          hover: 'hover:bg-neutral-500/30'
        }
    }
  }

  const currentOption = availabilityOptions.find(opt => opt.value === availability) || availabilityOptions[0]
  const colors = getColorClasses(currentOption.color)
  const Icon = currentOption.icon

  if (!availability && !isEditMode) {
    return null
  }

  return (
    <div className="relative">
      {isEditMode && showOptions ? (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute z-50 -top-2 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-sm border border-neutral-700 rounded-lg p-2 shadow-xl min-w-[250px]"
        >
          <div className="space-y-2">
            {availabilityOptions.map((option, index) => {
              const optionColors = getColorClasses(option.color)
              const OptionIcon = option.icon
              
              return (
                <button
                  key={index}
                  onClick={() => handleChange(option.value)}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all",
                    "hover:bg-neutral-800 text-left",
                    availability === option.value && "bg-neutral-800"
                  )}
                >
                  {OptionIcon && <OptionIcon className={cn("h-4 w-4", optionColors.text)} />}
                  <span className={cn("text-sm", option.value ? optionColors.text : "text-neutral-400")}>
                    {option.label || option.value}
                  </span>
                </button>
              )
            })}
          </div>
        </motion.div>
      ) : (
        <Button
          variant="ghost"
          onClick={() => {
            if (isEditMode) {
              setShowOptions(true)
            } else {
              // Small delay to ensure sections are rendered
              setTimeout(() => {
                scrollToContact()
              }, 100)
            }
          }}
          className={cn(
            "relative px-8 py-6 rounded-full",
            "bg-white/10 dark:bg-white/10 backdrop-blur-md",
            "border-2 border-white/20 dark:border-white/20",
            "text-foreground font-semibold",
            "shadow-lg hover:shadow-xl",
            "hover:bg-white/20 dark:hover:bg-white/20",
            "transition-all duration-300",
            "group",
            fontSize,
            isEditMode && "cursor-pointer pr-10"
          )}
        >
          <span className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            {availability}
            {isEditMode && (
              <Edit2 className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 opacity-70" />
            )}
          </span>
        </Button>
      )}
      
      {/* Click outside to close */}
      {showOptions && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowOptions(false)}
        />
      )}
    </div>
  )
}