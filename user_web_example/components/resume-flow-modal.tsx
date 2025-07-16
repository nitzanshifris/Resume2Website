"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ResumeFlowModalProps {
  isOpen: boolean
  onClose: () => void
  onYesChoice: () => void
  onNoChoice: () => void
}

export default function ResumeFlowModal({ isOpen, onClose, onYesChoice, onNoChoice }: ResumeFlowModalProps) {
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            {/* Modal content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200 z-10"
                aria-label="Close modal"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>

              {/* Modal content */}
              <div className="p-8 pt-12">
                {/* Header */}
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-8"
                >
                  Great choice!
                </motion.h1>

                {/* Question */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="text-xl md:text-2xl text-gray-700 text-center mb-10 font-medium"
                >
                  Do you have a resume?
                </motion.p>

                {/* Buttons */}
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                  >
                    <Button
                      onClick={onYesChoice}
                      className="w-full h-12 md:h-14 text-lg font-semibold bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 hover:from-emerald-600 hover:via-sky-500 hover:to-blue-700 text-white border-0 rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl"
                    >
                      Yes, use mine
                    </Button>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                  >
                    <Button
                      onClick={onNoChoice}
                      variant="outline"
                      className="w-full h-12 md:h-14 text-lg font-semibold border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-800 bg-white hover:bg-gray-50 rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-sm hover:shadow-md"
                    >
                      No, help me create
                    </Button>
                  </motion.div>
                </div>

                {/* Progress indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  className="text-center mt-8"
                >
                  <span className="text-sm text-gray-500 font-medium">Step 1 of 4</span>
                </motion.div>
              </div>

              {/* Decorative gradient border - behind content */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 p-[1px] pointer-events-none -z-10">
                <div className="w-full h-full bg-white rounded-2xl"></div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
} 