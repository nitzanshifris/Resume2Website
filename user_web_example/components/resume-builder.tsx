"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, ArrowLeft, Edit3, MessageSquare, Sparkles } from "lucide-react"

interface ResumeBuilderProps {
  isOpen: boolean
  onClose: () => void
  onBack: () => void
  onFreeForm: () => void
  onGuided: () => void
}

export default function ResumeBuilder({ isOpen, onClose, onBack, onFreeForm, onGuided }: ResumeBuilderProps) {
  // Handle escape key press
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Prevent body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative bg-white rounded-2xl p-8 w-full max-w-4xl mx-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Back button */}
          <button
            onClick={onBack}
            className="absolute top-6 left-6 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          {/* Content */}
          <div className="text-center pt-8">
            {/* Header */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-2"
            >
              Let's create your résumé!
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="text-lg text-gray-600 mb-8"
            >
              How do you prefer to get started?
            </motion.p>

            {/* Option Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="grid md:grid-cols-2 gap-6 mt-8"
            >
              {/* Card 1: Free Form */}
              <Card className="relative overflow-hidden border-2 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg group cursor-pointer">
                <div className="p-8" onClick={onFreeForm}>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Edit3 className="w-8 h-8 text-emerald-600" />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      I want to write freely
                    </h3>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Your words, no guidance or limits. Perfect for those who know exactly what they want to say.
                    </p>
                    
                    <Button
                      className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-0 py-3 rounded-full transition-all duration-300 group-hover:scale-105"
                      onClick={onFreeForm}
                    >
                      Start Writing
                    </Button>
                  </div>
                </div>
                
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-emerald-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </Card>

              {/* Card 2: Guided Questions */}
              <Card className="relative overflow-hidden border-2 hover:border-sky-300 transition-all duration-300 hover:shadow-lg group cursor-pointer">
                <div className="p-8" onClick={onGuided}>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-sky-100 to-sky-200 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <MessageSquare className="w-8 h-8 text-sky-600" />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      I want to answer questions
                    </h3>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Think coffee conversation - we ask, you share, AI perfects, resume born.
                    </p>
                    
                    <Button
                      className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white border-0 py-3 rounded-full transition-all duration-300 group-hover:scale-105"
                      onClick={onGuided}
                    >
                      Start Conversation
                    </Button>
                  </div>
                </div>
                
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </Card>
            </motion.div>

            {/* AI Enhancement Note */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200"
            >
              <div className="flex items-center justify-center text-purple-700">
                <Sparkles className="w-5 h-5 mr-2" />
                <span className="font-medium">
                  ✨ [Free] AI enhancement for maximum impact
                </span>
              </div>
            </motion.div>

            {/* Progress indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              className="mt-8 text-sm text-gray-500"
            >
              Step 2 of 4
            </motion.div>
          </div>

          {/* Decorative gradient border */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 p-[1px] pointer-events-none -z-10">
            <div className="w-full h-full bg-white rounded-2xl"></div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
} 