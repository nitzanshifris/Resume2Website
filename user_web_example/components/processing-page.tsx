"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

import { cn } from "@/lib/utils"
import { createSSEConnection, ProcessingStatus } from "@/lib/api"
import { Confetti, type ConfettiRef } from "@/components/ui/confetti"

interface ProcessingPageProps {
  isOpen: boolean
  jobId: string
  onComplete: () => void
  onTemplateSelect: (templateId: string) => void
  isPostPayment?: boolean
}

export default function ProcessingPage({ isOpen, jobId, onComplete, onTemplateSelect, isPostPayment = false }: ProcessingPageProps) {
  const [currentProgress, setCurrentProgress] = useState(0)
  const [currentMessage, setCurrentMessage] = useState("Bringing your career story to life...")
  const [showTemplateSelect, setShowTemplateSelect] = useState(false)
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus | null>(null)
  const confettiRef = useRef<ConfettiRef>(null)

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Simulate processing for MVP (SSE will be implemented later)
  useEffect(() => {
    if (!isOpen || !jobId) return

    // Simulate processing steps
    const steps = [
      { progress: 20, message: "Extracting text from your CV..." },
      { progress: 40, message: "Analyzing CV structure and content..." },
      { progress: 60, message: "Optimizing content for web display..." },
      { progress: 80, message: "Preparing your portfolio..." },
      { progress: 100, message: "Processing complete!" }
    ]

    let currentStep = 0
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        const step = steps[currentStep]
        setCurrentProgress(step.progress)
        setCurrentMessage(step.message)
        currentStep++
        
        if (step.progress === 100) {
          clearInterval(interval)
          // Fire confetti when complete
          if (confettiRef.current) {
            confettiRef.current.fire({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#10b981', '#0ea5e9', '#3b82f6']
            })
          }
          // Auto-complete after showing 100%
          setTimeout(() => {
            onComplete()
          }, 1500)
        }
      }
    }, 800)

    return () => {
      clearInterval(interval)
    }
  }, [isOpen, jobId, onComplete])

  const handleTemplateSelect = (templateId: string) => {
    onTemplateSelect(templateId)
    onComplete()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-white flex items-center justify-center z-40"
      >
        <div className="w-full max-w-2xl mx-auto px-8 text-center">
          {/* Header Message */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-12"
          >
            Bringing your career story to life...
          </motion.h1>

          {/* Apple-style Circular Spinner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center mb-12"
          >
            <div className="relative">
              {/* Outer ring */}
              <div className="w-20 h-20 rounded-full border-4 border-gray-200"></div>
              
              {/* Animated spinner */}
              <motion.div
                className="absolute inset-0 w-20 h-20 rounded-full border-4 border-transparent border-t-emerald-500 border-r-sky-400"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              
              {/* Inner gradient accent */}
              <motion.div
                className="absolute inset-2 w-16 h-16 rounded-full border-2 border-transparent border-t-blue-600 border-l-emerald-400"
                animate={{ rotate: -360 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </div>
          </motion.div>

          {/* Progress Bar Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full mb-8"
          >
            {/* Progress Bar Background */}
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              {/* Progress Bar Fill */}
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${Math.round(currentProgress)}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
            
            {/* Progress Percentage */}
            <motion.div
              key={Math.round(currentProgress)}
              initial={{ opacity: 0.7 }}
              animate={{ opacity: 1 }}
              className="text-right mt-2 text-sm text-gray-500 font-medium"
            >
              {Math.round(currentProgress)}%
            </motion.div>
          </motion.div>

          {/* Dynamic Status Messages */}
          <AnimatePresence mode="wait">
            <motion.p
              key={currentMessage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="text-lg text-gray-600 mb-8 min-h-[1.75rem]"
            >
              {currentMessage}
            </motion.p>
          </AnimatePresence>

          {/* Template Selection */}
          <AnimatePresence>
            {showTemplateSelect && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="mx-auto max-w-lg"
              >
                <div className="bg-gradient-to-r from-blue-50 via-sky-50 to-emerald-50 border border-blue-200 rounded-xl p-6 shadow-lg">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-blue-800 mb-4">
                      Choose Your Template
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => handleTemplateSelect("v0_template_1")}
                        className="p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-blue-400 transition-colors"
                      >
                        <div className="text-sm font-medium text-gray-800">Modern Professional</div>
                        <div className="text-xs text-gray-600 mt-1">Clean & Minimal</div>
                      </button>
                      <button
                        onClick={() => handleTemplateSelect("v0_template_2")}
                        className="p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-blue-400 transition-colors"
                      >
                        <div className="text-sm font-medium text-gray-800">Creative Portfolio</div>
                        <div className="text-xs text-gray-600 mt-1">Bold & Dynamic</div>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Subtle background gradient */}
          <div className="fixed inset-0 bg-gradient-to-br from-emerald-50/30 via-white to-sky-50/30 -z-10" />
          
          {/* Floating background elements */}
          <div className="fixed top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-emerald-200/20 to-emerald-300/20 rounded-full blur-3xl -z-10" />
          <div className="fixed bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-br from-sky-200/20 to-blue-300/20 rounded-full blur-3xl -z-10" />
          
          {/* Confetti component - doesn't render anything, just provides the fire method */}
          <Confetti ref={confettiRef} manualstart={true} />
        </div>
      </motion.div>
    </AnimatePresence>
  )
} 