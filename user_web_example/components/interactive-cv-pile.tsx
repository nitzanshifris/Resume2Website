"use client"

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthContext } from '@/contexts/AuthContext'
import Image from 'next/image'

interface InteractiveCVPileProps {
  onFileSelect: (file: File) => void
  onFileClick?: (file: File) => void
  className?: string
  uploadedFile?: File | null
  uploadedFiles?: File[] | null
  isProcessing?: boolean
}

// Background CV data for the pile - using actual files
const backgroundCVs = [
  {
    title: "Louis Wood", // Top visible CV
    subtitle: "Former Admissions Officer",
    color: "#0891b2",
    fileName: "job.png",
    isImage: true,
    path: "/cv-examples/job.png"
  },
  {
    title: "Sophia Brown", // Second CV
    subtitle: "Retail Business Development",
    color: "#a8525a",
    fileName: "retail-business-development.jpg",
    isImage: true,
    path: "/cv-examples/retail-business-development.jpg"
  }
]

export default function InteractiveCVPile({ onFileSelect, onFileClick, className, uploadedFile, uploadedFiles, isProcessing }: InteractiveCVPileProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadState, setUploadState] = useState<'idle' | 'success' | 'error'>('idle')
  const [localUploadedFiles, setLocalUploadedFiles] = useState<File[]>([])
  const [currentFileIndex, setCurrentFileIndex] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dragCounter = useRef(0)
  const { isAuthenticated } = useAuthContext()
  
  // Use uploadedFiles if provided, otherwise use local state
  const displayFiles = uploadedFiles || localUploadedFiles
  const currentFile = displayFiles[currentFileIndex] || uploadedFile
  
  // Keep track of the last valid file to prevent blinking
  const [stableFile, setStableFile] = useState<File | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  
  useEffect(() => {
    if (currentFile) {
      setStableFile(currentFile)
      
      // Create stable PDF URL to prevent iframe reload
      if (currentFile.type === 'application/pdf' || currentFile.name.endsWith('.pdf')) {
        // Clean up previous URL if exists
        if (pdfUrl) {
          URL.revokeObjectURL(pdfUrl)
        }
        const newUrl = URL.createObjectURL(currentFile)
        setPdfUrl(newUrl)
      }
    }
  }, [currentFile])
  
  // Cleanup PDF URL on unmount
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl)
      }
    }
  }, [])
  
  // Use stable file for display to prevent blinking
  const fileToDisplay = currentFile || stableFile

  const resetUploadState = useCallback(() => {
    setTimeout(() => {
      setUploadState('idle')
    }, 3000)
  }, [])

  const handleFile = useCallback((file: File) => {
    // Validate file type
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'image/png', 'image/jpeg', 'image/jpg']
    const validExtensions = ['.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg']
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
    
    const isValid = validTypes.includes(file.type) || validExtensions.includes(fileExtension)
    
    if (!isValid) {
      setUploadState('error')
      resetUploadState()
      return
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setUploadState('error')
      resetUploadState()
      return
    }

    // Success! - Don't show success overlay, go straight to file display
    // setUploadState('success') // Remove this to avoid showing checkmark
    setLocalUploadedFiles(prev => [...prev, file])
    // Don't trigger animation yet, just notify parent that file was selected
    if (onFileSelect) {
      onFileSelect(file)
    }
    // resetUploadState() // No need to reset since we're not setting success state
  }, [onFileSelect, resetUploadState])
  
  const handleMultipleFiles = useCallback((files: FileList) => {
    const validFiles: File[] = []
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'image/png', 'image/jpeg', 'image/jpg']
      const validExtensions = ['.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg']
      const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
      
      const isValid = validTypes.includes(file.type) || validExtensions.includes(fileExtension)
      
      if (isValid && file.size <= 10 * 1024 * 1024) {
        validFiles.push(file)
      }
    }
    
    if (validFiles.length > 0) {
      // Don't show success overlay, go straight to file display
      // setUploadState('success') // Remove this to avoid showing checkmark
      setLocalUploadedFiles(validFiles)
      setCurrentFileIndex(0)
      // Don't trigger animation yet, just notify parent that files were selected
      if (onFileSelect) {
        onFileSelect(validFiles[0]) // Send the first file to parent
      }
      // resetUploadState() // No need to reset since we're not setting success state
    } else {
      setUploadState('error')
      resetUploadState()
    }
  }, [onFileSelect, resetUploadState])

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current++
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true)
    }
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current--
    if (dragCounter.current === 0) {
      setIsDragging(false)
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    dragCounter.current = 0

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if (e.dataTransfer.files.length === 1) {
        handleFile(e.dataTransfer.files[0])
      } else {
        handleMultipleFiles(e.dataTransfer.files)
      }
      e.dataTransfer.clearData()
    }
  }, [handleFile, handleMultipleFiles])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (e.target.files.length === 1) {
        handleFile(e.target.files[0])
      } else {
        handleMultipleFiles(e.target.files)
      }
    }
  }, [handleFile, handleMultipleFiles])

  const handleClick = useCallback(() => {
    // If we have a file uploaded, clicking should trigger the animation
    if (currentFile && onFileClick) {
      onFileClick(currentFile)
      return
    }
    
    // Always open file dialog when clicking the upload area, regardless of auth status
    fileInputRef.current?.click()
  }, [currentFile, onFileClick])

  return (
    <div 
      className={cn("relative", className)}
      style={{ minHeight: '400px' }} // Ensure minimum height
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword,image/*"
        onChange={handleFileInput}
        className="hidden"
        multiple
      />
      
      {/* Background stacked CVs - Only 2 PNG cards */}
      {/* Second card - Sophia Brown (retail-business-development) */}
      <div 
        className="absolute -top-6 -right-8 w-full h-full rounded-xl bg-white shadow-lg transform rotate-12 overflow-hidden" 
        style={{ zIndex: 2 }}
      >
        <Image 
          src={backgroundCVs[1].path}
          alt={backgroundCVs[1].title}
          fill
          className="object-cover object-top"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
      </div>
      {/* Top card - Louis Wood (job.png) */}
      <div 
        className="absolute -top-4 -left-8 w-full h-full rounded-xl bg-white shadow-lg transform -rotate-12 overflow-hidden" 
        style={{ zIndex: 3 }}
      >
        <Image 
          src={backgroundCVs[0].path}
          alt={backgroundCVs[0].title}
          fill
          className="object-cover object-top"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
      </div>
      
      {/* Front Card - Clickable Upload Area - Enhanced with advanced animations */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotateX: [0, 5, 0],
          rotateY: [0, -3, 3, 0],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        whileHover={{
          scale: 1.05,
          y: -25,
          transition: { duration: 0.3, ease: "easeOut" }
        }}
        whileTap={{ scale: 0.98 }}
        className="relative cursor-pointer mx-auto"
        style={{ width: '85%', height: '85%', marginTop: '7.5%', zIndex: 10 }}
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Multi-layer glow effects */}
        <motion.div
          className="absolute -inset-[12px] rounded-2xl blur-2xl opacity-70"
          style={{
            background: isDragging 
              ? "conic-gradient(from 180deg at 50% 50%, #10f981 0deg, #38bdf8 120deg, #8b5cf6 240deg, #10f981 360deg)"
              : "conic-gradient(from 180deg at 50% 50%, #10b981 0deg, #0ea5e9 120deg, #7c3aed 240deg, #10b981 360deg)",
          }}
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute -inset-[8px] rounded-xl blur-xl"
          style={{
            background: isDragging 
              ? "linear-gradient(135deg, rgba(16, 249, 129, 0.8), rgba(56, 189, 248, 0.8), rgba(139, 92, 246, 0.8))"
              : "linear-gradient(135deg, rgba(16, 185, 129, 0.5), rgba(14, 165, 233, 0.5), rgba(124, 58, 237, 0.5))",
            zIndex: -1,
          }}
          animate={{
            opacity: isDragging ? [0.8, 1, 0.8] : [0.4, 0.7, 0.4],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="w-full h-full bg-gradient-to-br from-white via-white to-gray-50 rounded-xl shadow-2xl overflow-hidden relative">
          {/* Animated background pattern */}
          <motion.div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
            animate={{
              x: [0, 60],
              y: [0, 60],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          
          {!fileToDisplay ? (
            /* Upload State */
            <div className="w-full h-full relative">
              {/* Animated gradient border */}
              <motion.div
                className="absolute inset-0 rounded-xl p-[3px]"
                style={{
                  background: isDragging
                    ? "linear-gradient(90deg, #10f981, #38bdf8, #8b5cf6, #ec4899, #10f981)"
                    : "linear-gradient(90deg, #10b981, #0ea5e9, #7c3aed, #e11d48, #10b981)",
                  backgroundSize: "400% 100%",
                }}
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <div className="w-full h-full bg-white rounded-xl flex flex-col items-center justify-center p-8 relative overflow-hidden">
                  {/* Floating particles */}
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full opacity-70"
                      style={{
                        left: `${20 + i * 12}%`,
                        top: "50%",
                      }}
                      animate={{
                        y: [-100, 100],
                        x: [0, (i % 2 === 0 ? 20 : -20), 0],
                        scale: [0, 1, 0],
                      }}
                      transition={{
                        duration: 3 + i * 0.5,
                        repeat: Infinity,
                        delay: i * 0.3,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                  
                  <motion.div
                    animate={{
                      scale: [1, 1.15, 1],
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="mb-6 relative"
                  >
                    <div className="relative">
                      {/* 3D Upload icon effect */}
                      <motion.div
                        className="absolute inset-0"
                        animate={{
                          scale: [1.2, 1.5, 1.2],
                          opacity: [0.3, 0, 0.3],
                          rotateY: [0, 180, 360],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeOut",
                        }}
                      >
                        <Upload className="w-20 h-20 text-purple-400" />
                      </motion.div>
                      <motion.div
                        className="absolute inset-0"
                        animate={{
                          scale: [1.1, 1.3, 1.1],
                          opacity: [0.5, 0, 0.5],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeOut",
                          delay: 0.5,
                        }}
                      >
                        <Upload className="w-20 h-20 text-emerald-400" />
                      </motion.div>
                      <Upload className="w-20 h-20 text-gray-700 relative z-10" />
                    </div>
                  </motion.div>
                  
                  <motion.div
                    className="text-center z-10"
                    animate={{
                      y: [0, -5, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <motion.h3 
                      className="text-2xl font-bold bg-gradient-to-r from-gray-800 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-3"
                      animate={{
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                      }}
                      style={{
                        backgroundSize: "200% 100%",
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      Drop your CV here
                    </motion.h3>
                    <motion.p 
                      className="text-base text-gray-600 mb-1"
                      animate={{
                        opacity: [0.6, 1, 0.6],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      or click to browse
                    </motion.p>
                    <motion.p 
                      className="text-sm text-gray-500 mt-4 font-medium"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      PDF • DOC • DOCX • PNG • JPG
                    </motion.p>
                  </motion.div>
                  
                  {/* Animated corner accents */}
                  <motion.div 
                    className="absolute top-4 left-4 w-12 h-12"
                    animate={{
                      rotate: [0, 90, 0],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <div className="w-full h-full border-t-3 border-l-3 border-emerald-400 rounded-tl-xl" />
                  </motion.div>
                  <motion.div 
                    className="absolute top-4 right-4 w-12 h-12"
                    animate={{
                      rotate: [0, -90, 0],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear",
                      delay: 2,
                    }}
                  >
                    <div className="w-full h-full border-t-3 border-r-3 border-sky-400 rounded-tr-xl" />
                  </motion.div>
                  <motion.div 
                    className="absolute bottom-4 left-4 w-12 h-12"
                    animate={{
                      rotate: [0, -90, 0],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear",
                      delay: 4,
                    }}
                  >
                    <div className="w-full h-full border-b-3 border-l-3 border-purple-400 rounded-bl-xl" />
                  </motion.div>
                  <motion.div 
                    className="absolute bottom-4 right-4 w-12 h-12"
                    animate={{
                      rotate: [0, 90, 0],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear",
                      delay: 6,
                    }}
                  >
                    <div className="w-full h-full border-b-3 border-r-3 border-rose-400 rounded-br-xl" />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          ) : (
            /* Uploaded File State - Show actual file with optional processing overlay */
            <div className="w-full h-full relative bg-white rounded-xl overflow-hidden">
              {fileToDisplay && (
                <>
                  {/* Processing overlay - shows on top of the file without hiding it */}
                  {isProcessing && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-30">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                      <p className="text-lg font-medium text-gray-700">Processing your CV...</p>
                    </div>
                  )}
                  
                  {/* File type indicator and navigation */}
                  {displayFiles.length > 1 && (
                    <div className="absolute top-2 right-2 z-20 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setCurrentFileIndex((prev) => Math.max(0, prev - 1))
                        }}
                        disabled={currentFileIndex === 0}
                        className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <span className="text-sm font-medium">
                        {currentFileIndex + 1} / {displayFiles.length}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setCurrentFileIndex((prev) => Math.min(displayFiles.length - 1, prev + 1))
                        }}
                        disabled={currentFileIndex === displayFiles.length - 1}
                        className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  )}
                  
                  {/* Display file based on type */}
                  {fileToDisplay.type === 'application/pdf' || fileToDisplay.name.endsWith('.pdf') ? (
                    <div className="w-full h-full relative overflow-hidden">
                      {pdfUrl && (
                        <iframe
                          src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                          className="w-full h-full"
                          title={fileToDisplay.name}
                        />
                      )}
                    </div>
                  ) : fileToDisplay.type.startsWith('image/') || 
                      ['.png', '.jpg', '.jpeg'].some(ext => fileToDisplay.name.toLowerCase().endsWith(ext)) ? (
                    <div className="w-full h-full relative overflow-hidden">
                      <Image
                        src={URL.createObjectURL(fileToDisplay)}
                        alt={fileToDisplay.name}
                        fill
                        className="object-contain"
                        onLoad={(e) => {
                          // Clean up object URL after image loads
                          URL.revokeObjectURL(e.currentTarget.src)
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8">
                      <FileText className="w-16 h-16 text-blue-600 mb-4" />
                      <h3 className="text-lg font-bold text-gray-900 text-center mb-2">{fileToDisplay.name}</h3>
                      <p className="text-sm text-gray-600">Ready to transform</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {(fileToDisplay.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  )}
                  
                  {/* File name overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <p className="text-white text-sm font-medium truncate">{fileToDisplay.name}</p>
                  </div>
                </>
              )}
            </div>
          )}
          
          {/* Upload state indicators */}
          <AnimatePresence>
            {/* Removed success state overlay - file preview shows immediately */}
            
            {uploadState === 'error' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 bg-white/95 flex items-center justify-center"
              >
                <AlertCircle className="w-16 h-16 text-red-500" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}