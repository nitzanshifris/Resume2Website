"use client"

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Sparkles, ArrowRight } from 'lucide-react'

interface PortfolioCompletionPopupProps {
  isOpen: boolean
  onStartEditing: () => void
  onDismiss: () => void
}

// Two text variants to show randomly
const textVariants = [
  {
    title: "Almost there! Just a few fun touches left",
    description: "Your portfolio is 80% ready—now for the fun part! Drop your photos, videos, files, code, pick your favorite colors, and let your personality shine.",
    buttonText: "Start now, Highlight what Makes You, You ✨"
  },
  {
    title: "Your portfolio is 80% complete!",
    description: "Join 10,000+ who get more interviews by SHOWING recruiters who they are beyond plain text. Now it's your time to shine—add photos, videos, files, code, whatever shows them the real you.",
    buttonText: "Start now, Highlight What Makes You Different"
  }
]

export default function PortfolioCompletionPopup({ 
  isOpen, 
  onStartEditing, 
  onDismiss 
}: PortfolioCompletionPopupProps) {
  const [selectedVariant, setSelectedVariant] = useState(textVariants[0])
  
  useEffect(() => {
    // Randomly select a variant when component mounts
    const randomIndex = Math.floor(Math.random() * textVariants.length)
    setSelectedVariant(textVariants[randomIndex])
  }, [])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - clicking outside dismisses (but we make it hard) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onDismiss}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          
          {/* Popup Container - Takes up most of the screen to make dismissal harder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the popup
          >
            <div 
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
              style={{ minHeight: '400px' }} // Make it large
            >
              {/* Gradient background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-sky-50 to-blue-50 opacity-50" />
              
              {/* Content */}
              <div className="relative p-8 md:p-12">
                {/* Success Icon with animation */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="flex justify-center mb-6"
                >
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 via-sky-400 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">80%</span>
                    </div>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute -inset-1"
                    >
                      <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-1 -right-1" />
                    </motion.div>
                  </div>
                </motion.div>

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl md:text-3xl font-bold text-center mb-4 text-gray-900"
                >
                  {selectedVariant.title}
                </motion.h2>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-base md:text-lg text-gray-600 text-center mb-8 leading-relaxed max-w-xl mx-auto"
                >
                  {selectedVariant.description}
                </motion.p>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex justify-center"
                >
                  <Button
                    onClick={onStartEditing}
                    size="lg"
                    className="bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 hover:from-emerald-600 hover:via-sky-500 hover:to-blue-700 text-white px-8 py-6 text-base md:text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                  >
                    <span className="flex items-center gap-3">
                      {selectedVariant.buttonText}
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  </Button>
                </motion.div>

                {/* Subtle dismiss hint (making it hard to find) */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  transition={{ delay: 1 }}
                  className="text-xs text-gray-400 text-center mt-8"
                >
                  Click outside to continue without editing
                </motion.p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}