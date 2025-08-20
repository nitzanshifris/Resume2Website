"use client"

import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertCircle, FileX } from 'lucide-react'

interface ErrorToastProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  message: string
  suggestion?: string
  onRetryUpload?: (file: File) => void
}

export default function ErrorToast({ 
  isOpen, 
  onClose, 
  title = "Not a resume",
  message,
  suggestion,
  onRetryUpload
}: ErrorToastProps) {
  // Don't auto-close - user must close manually or retry
  // Removed auto-dismiss timer per user requirement

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[99]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ 
              duration: 0.3,
              ease: [0.16, 1, 0.3, 1]
            }}
            className="relative bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-md mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button - top right corner */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            
            {/* Error icon and title */}
            <div className="pt-8 pb-4 px-8 text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
                <FileX className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {title}
              </h2>
            </div>

            {/* Content */}
            <div className="px-8 pb-6">
              <p className="text-center text-gray-600 mb-4">
                {message}
              </p>
              
              {suggestion && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-800">
                      <span className="font-semibold">Tip:</span> {suggestion}
                    </p>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    // Trigger file picker again
                    const fileInput = document.createElement('input')
                    fileInput.type = 'file'
                    fileInput.accept = '.pdf,.doc,.docx,.txt,.rtf,.png,.jpg,.jpeg,.webp,.heic,.heif,.tiff,.tif,.bmp'
                    fileInput.onchange = (e) => {
                      const target = e.target as HTMLInputElement
                      if (target.files && target.files[0]) {
                        const file = target.files[0]
                        onClose() // Close the error modal first
                        
                        // If a callback was provided, use it
                        if (onRetryUpload) {
                          onRetryUpload(file)
                        } else {
                          // Fallback to custom event for backward compatibility
                          const event = new CustomEvent('retryFileUpload', { 
                            detail: file 
                          })
                          window.dispatchEvent(event)
                        }
                      }
                    }
                    fileInput.click()
                  }}
                  className="flex-1 bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 hover:from-emerald-600 hover:via-sky-500 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  Try Another File
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}