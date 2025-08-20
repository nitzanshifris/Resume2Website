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
}

export default function ErrorToast({ 
  isOpen, 
  onClose, 
  title = "Invalid File",
  message,
  suggestion
}: ErrorToastProps) {
  // Auto-close after 6 seconds
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose()
      }, 6000)
      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] max-w-md w-full mx-4"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-red-100 overflow-hidden">
            {/* Red gradient header */}
            <div className="bg-gradient-to-r from-red-500 to-pink-500 p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                    <FileX className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-white font-semibold text-lg">{title}</h3>
                </div>
                <button
                  onClick={onClose}
                  className="text-white/80 hover:text-white transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              <p className="text-gray-700 font-medium">
                {message}
              </p>
              
              {suggestion && (
                <div className="bg-blue-50 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-700">
                    {suggestion}
                  </p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    // Trigger file picker again
                    const fileInput = document.createElement('input')
                    fileInput.type = 'file'
                    fileInput.accept = '.pdf,.doc,.docx'
                    fileInput.onchange = (e) => {
                      const target = e.target as HTMLInputElement
                      if (target.files && target.files[0]) {
                        // This will trigger the parent component's file handler
                        const event = new CustomEvent('retryFileUpload', { 
                          detail: target.files[0] 
                        })
                        window.dispatchEvent(event)
                      }
                    }
                    fileInput.click()
                    onClose()
                  }}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
                >
                  Try Again
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}