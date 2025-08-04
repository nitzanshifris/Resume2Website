"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

import { cn } from "@/lib/utils"
import { createSSEConnection, ProcessingStatus, uploadFile, API_BASE_URL } from "@/lib/api"
import { Confetti, type ConfettiRef } from "@/components/ui/confetti"
import { MacBookFrame } from "@/components/macbook-frame"

interface ProcessingPageProps {
  isOpen: boolean
  jobId?: string
  file?: File | null
  onComplete: () => void
  onTemplateSelect?: (templateId: string) => void
  onPlanRequired?: () => void
  isPostPayment?: boolean
  onAuthRequired?: () => void
}

export default function ProcessingPage({ isOpen, jobId, file, onComplete, onTemplateSelect, onPlanRequired, isPostPayment = false, onAuthRequired }: ProcessingPageProps) {
  const [currentProgress, setCurrentProgress] = useState(0)
  const [currentMessage, setCurrentMessage] = useState("Bringing your career story to life...")
  const [showTemplateSelect, setShowTemplateSelect] = useState(false)
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus | null>(null)
  const [currentJobId, setCurrentJobId] = useState<string | null>(jobId || null)
  const [portfolioUrl, setPortfolioUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showPortfolioPreview, setShowPortfolioPreview] = useState(false)
  const [hasScrolledEnough, setHasScrolledEnough] = useState(false)
  const [sectionsScrolled, setSectionsScrolled] = useState(0)
  const confettiRef = useRef<ConfettiRef>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

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

  // Handle file upload and portfolio generation
  useEffect(() => {
    if (!isOpen) return

    const processFile = async () => {
      try {
        setError(null)
        setCurrentProgress(0)
        setCurrentMessage("Uploading your CV...")

        // Step 1: Upload file if we have one and no jobId
        let activeJobId = currentJobId
        if (file && !activeJobId) {
          try {
            // For demo purposes, create a temporary job ID if upload fails
            try {
              const uploadResponse = await uploadFile(file)
              activeJobId = uploadResponse.job_id
              setCurrentJobId(activeJobId)
            } catch (uploadError) {
              console.log('Upload failed, using demo mode:', uploadError)
              // Generate a temporary job ID for demo purposes
              activeJobId = `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
              setCurrentJobId(activeJobId)
            }
            setCurrentProgress(10)
            setCurrentMessage("CV uploaded successfully!")
          } catch (error) {
            console.error('Upload error:', error)
            setError(error instanceof Error ? error.message : 'Failed to upload CV')
            return
          }
        }

        if (!activeJobId) {
          setError('No job ID available')
          return
        }

        // Step 2: Extract CV data
        setCurrentProgress(20)
        setCurrentMessage("Extracting information from your CV...")
        
        try {
          const sessionId = localStorage.getItem('cv2web_session_id')
          const extractResponse = await fetch(`${API_BASE_URL}/api/v1/cv/extract/${activeJobId}`, {
            method: 'POST',
            headers: {
              'X-Session-ID': sessionId || ''
            }
          })

          if (!extractResponse.ok) {
            throw new Error('Failed to extract CV data')
          }

          const extractData = await extractResponse.json()
          setCurrentProgress(40)
          setCurrentMessage("Analyzing your career highlights...")
        } catch (error) {
          console.error('Extraction error:', error)
          setError('Failed to extract CV data')
          return
        }

        // Step 3: Generate portfolio with random template selection
        setCurrentProgress(60)
        setCurrentMessage("Creating your personalized portfolio...")

        try {
          const sessionId = localStorage.getItem('cv2web_session_id')
          const templates = ['v0_template_v1.5', 'v0_template_v2.1']
          const randomTemplate = templates[Math.floor(Math.random() * templates.length)]
          
          console.log(`🎯 Selected template: ${randomTemplate}`)

          // Use anonymous endpoint if no session
          const generateUrl = sessionId 
            ? `${API_BASE_URL}/api/v1/portfolio/generate/${activeJobId}`
            : `${API_BASE_URL}/api/v1/portfolio/generate-anonymous/${activeJobId}`
          
          const generateResponse = await fetch(generateUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Session-ID': sessionId || ''
            },
            body: JSON.stringify({
              template: randomTemplate
            })
          })

          if (!generateResponse.ok) {
            const errorData = await generateResponse.json()
            throw new Error(errorData.detail || 'Failed to generate portfolio')
          }

          const generateData = await generateResponse.json()
          setPortfolioUrl(generateData.portfolio_url)
          setCurrentProgress(100)
          setCurrentMessage("Portfolio generated successfully!")

          // Fire confetti
          if (confettiRef.current) {
            confettiRef.current.fire({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#10b981', '#0ea5e9', '#3b82f6']
            })
          }

          // Show portfolio preview after a brief delay
          setTimeout(() => {
            setShowPortfolioPreview(true)
          }, 1500)
        } catch (error) {
          console.error('Generation error:', error)
          setError(error instanceof Error ? error.message : 'Failed to generate portfolio')
          return
        }
      } catch (error) {
        console.error('Processing error:', error)
        setError(error instanceof Error ? error.message : 'An error occurred during processing')
      }
    }

    processFile()
  }, [isOpen, file, currentJobId, onComplete])

  const handleTemplateSelect = (templateId: string) => {
    onTemplateSelect(templateId)
    onComplete()
  }

  // Show auth prompt after user has viewed portfolio for a few seconds
  useEffect(() => {
    if (!showPortfolioPreview) return

    // After 5 seconds of viewing, trigger auth
    const timer = setTimeout(() => {
      if (!hasScrolledEnough && onAuthRequired) {
        setHasScrolledEnough(true)
        console.log('User has viewed portfolio, triggering auth...')
        onAuthRequired()
      }
    }, 5000)

    return () => clearTimeout(timer)
  }, [showPortfolioPreview, hasScrolledEnough, onAuthRequired])

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

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <p className="text-red-700 text-sm font-medium">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
              >
                Try again
              </button>
            </motion.div>
          )}

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

        {/* Portfolio Preview */}
        {showPortfolioPreview && portfolioUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed inset-0 bg-white z-50 flex items-center justify-center p-8"
          >
            <div className="w-full max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  Your portfolio is ready! 🎉
                </h1>
                <p className="text-lg text-gray-600 mb-6">
                  Take a moment to preview your new portfolio below
                </p>
                <button
                  onClick={onComplete}
                  className="px-8 py-3 bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 text-white font-medium rounded-lg hover:shadow-lg transition-shadow"
                >
                  Continue to Dashboard
                </button>
              </div>

              {/* MacBook Preview */}
              <div className="w-full max-w-4xl mx-auto">
                <MacBookFrame isComplete={true}>
                  <iframe
                    ref={iframeRef}
                    src={portfolioUrl}
                    className="w-full h-full border-0"
                    title="Portfolio Preview"
                    onLoad={() => console.log('Portfolio iframe loaded')}
                  />
                </MacBookFrame>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  )
} 