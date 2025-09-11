"use client"

import React, { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, File, CheckCircle, X, ArrowLeft, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { uploadFile, uploadMultipleFiles, setSessionId, API_BASE_URL } from "@/lib/api"
import { useAuthContext } from "@/contexts/AuthContext"

interface UploadResumeProps {
  isOpen: boolean
  onClose: () => void
  onBack: () => void
  onSuccess: (jobId: string) => void
  initialFile?: File | null
  onAuthRequired?: () => void  // Callback to open auth modal
  onFileSelect?: (file: File) => Promise<void>  // New prop to handle file selection with portfolio warning
}

export default function UploadResume({ isOpen, onClose, onBack, onSuccess, initialFile, onAuthRequired, onFileSelect }: UploadResumeProps) {
  const { isAuthenticated } = useAuthContext()
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<{file: string, status: 'uploading' | 'success' | 'error'}[]>([])
  const [completedJobIds, setCompletedJobIds] = useState<string[]>([])

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

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const validateFile = (file: File): boolean => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/png',
      'image/jpeg',
      'image/jpg',
      'image/webp',
      'image/heic',
      'image/heif',
      'image/tiff',
      'image/bmp'
    ]
    const maxSize = 10 * 1024 * 1024 // 10MB

    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a PDF, DOC, DOCX, or image file (PNG, JPG, JPEG, WebP, HEIC, TIFF, BMP).')
      return false
    }

    if (file.size > maxSize) {
      alert('File size must be less than 10MB.')
      return false
    }

    return true
  }

  const handleFileUpload = async (files: File[]) => {
    // Validate all files first
    const validFiles = files.filter(file => validateFile(file))
    if (validFiles.length === 0) return

    // Anonymous users: delegate to parent to start JobFlow preview flow (ensures 6s signup modal timer)
    if (!isAuthenticated && validFiles.length === 1 && onFileSelect) {
      try {
        await onFileSelect(validFiles[0])
        onClose()
        return
      } catch (error) {
        console.error('File selection error (anonymous):', error)
        alert(error instanceof Error ? error.message : 'Failed to process file')
        return
      }
    }

    // Check for existing portfolios ONLY for authenticated users
    if (isAuthenticated && validFiles.length === 1) {
      try {
        const sessionId = localStorage.getItem('resume2website_session_id')
        const portfolioListResponse = await fetch(`${API_BASE_URL}/api/v1/generation/list`, {
          credentials: 'include',
          headers: {
            'X-Session-ID': sessionId || ''
          }
        })

        if (portfolioListResponse.ok) {
          const data = await portfolioListResponse.json()
          if (data.portfolios && data.portfolios.length > 0) {
            // User has existing portfolios - warn them
            const confirmDelete = confirm(
              'You already have a generated portfolio.\n\n' +
              'Uploading a new CV will delete your existing portfolio.\n\n' +
              'Do you want to continue?'
            )

            if (!confirmDelete) {
              console.log('User cancelled upload to preserve existing portfolio')
              return
            }

            // User confirmed - use the special flow with deletion and refresh
            if (onFileSelect) {
              await onFileSelect(validFiles[0])
              onClose()
              return
            }
          }
        }
      } catch (error) {
        console.error('Error checking existing portfolios:', error)
        // Continue with normal upload if check fails
      }
    }

    setSelectedFiles(validFiles)
    setIsValidating(true) // Show validating state
    setIsUploading(false) // Ensure upload animation is not shown yet

    // Check if multiple image files are being uploaded
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.heic', '.heif', '.tiff', '.tif', '.bmp']
    const isMultipleImages = validFiles.length > 1 && validFiles.every(file => {
      const ext = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
      return imageExtensions.includes(ext)
    })

    try {
      if (isMultipleImages) {
        // Multiple images require authentication
        if (!isAuthenticated) {
          setIsValidating(false)
          if (onAuthRequired) {
            onAuthRequired()
          } else {
            alert('Please sign in to upload multiple files')
          }
          return
        }
        
        // Use the multiple upload endpoint for multiple image files
        console.log('Uploading multiple image files as single CV')
        
        // Start upload first, then show progress if successful
        const response = await uploadMultipleFiles(validFiles)
        
        // Only show progress after successful validation
        setIsValidating(false)
        setIsUploading(true)
        setUploadProgress(validFiles.map(file => ({ file: file.name, status: 'uploading' as const })))
        
        if (response.job_id) {
          // Store session ID if provided
          if (response.session_id) {
            setSessionId(response.session_id)
          }
          
          // Update all files as success
          setUploadProgress(validFiles.map(file => ({ file: file.name, status: 'success' as const })))
          setCompletedJobIds([response.job_id])
          setIsUploading(false)
          setUploadSuccess(true)
          
          // Auto-redirect after 1 second
          setTimeout(() => {
            onSuccess(response.job_id)
          }, 1000)
        } else {
          throw new Error('Upload failed - no job ID returned')
        }
      } else {
        // Original logic for single file or non-image files
        const jobIds: string[] = []

        // Upload files sequentially to avoid overwhelming the server
        for (let i = 0; i < validFiles.length; i++) {
          const file = validFiles[i]
          
          try {
            // Upload file to backend
            const response = await uploadFile(file)
            
            // Only show upload progress after successful validation (response.ok)
            if (i === 0) {
              setIsValidating(false)
              setIsUploading(true)
              setUploadProgress(validFiles.map(f => ({ file: f.name, status: 'uploading' as const })))
            }
            
            if (response.job_id) {
              // Store session ID if provided (only from first file)
              if (response.session_id && i === 0) {
                setSessionId(response.session_id)
              }
              
              jobIds.push(response.job_id)
              
              // Update progress for this file
              setUploadProgress(prev => 
                prev.map(p => 
                  p.file === file.name ? { ...p, status: 'success' as const } : p
                )
              )
            } else {
              throw new Error('Upload failed - no job ID returned')
            }
          } catch (error: any) {
            console.error(`Upload error for ${file.name}:`, error)
            
            // Stop validating immediately
            setIsValidating(false)
            setIsUploading(false)
            
            // Handle 401/403 authentication errors
            if (error.message?.includes('401') || error.message?.includes('403') || error.message?.includes('Not authenticated')) {
              if (onAuthRequired) {
                onAuthRequired()
              } else {
                alert('Please sign in to continue')
              }
              return
            }
            
            // Update progress for this file to show error
            setUploadProgress(prev => 
              prev.map(p => 
                p.file === file.name ? { ...p, status: 'error' as const } : p
              )
            )
            
            // Show detailed error message
            const errorMessage = error instanceof Error ? error.message : `Failed to upload ${file.name}`
            alert(errorMessage)
            
            // Stop further uploads on any error
            break
          }
        }

        setCompletedJobIds(jobIds)
        setIsUploading(false)

        // If all files uploaded successfully, mark as success and redirect to first job
        if (jobIds.length === validFiles.length && jobIds.length > 0) {
          setUploadSuccess(true)
          
          // Auto-redirect after 1 second with first job ID
          setTimeout(() => {
            onSuccess(jobIds[0])
          }, 1000)
        }
      }
    } catch (error: any) {
      console.error('Upload error:', error)
      setIsValidating(false)
      setIsUploading(false)
      
      // Handle authentication errors
      if (error.message?.includes('401') || error.message?.includes('403') || error.message?.includes('Not authenticated')) {
        if (onAuthRequired) {
          onAuthRequired()
        } else {
          alert('Please sign in to continue')
        }
        return
      }
      
      // Update all files as error
      setUploadProgress(validFiles.map(file => ({ file: file.name, status: 'error' as const })))
      
      // Show detailed error message
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload files. Please try again.'
      alert(errorMessage)
    } finally {
      // Always ensure we're not stuck in validating state
      setIsValidating(false)
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files)
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(Array.from(files))
    }
  }

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
          className="relative bg-white rounded-2xl p-8 w-full max-w-2xl mx-auto shadow-2xl"
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
              Upload your resumes
            </motion.h1>

            {/* Upload Zone */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="mt-8"
            >
              {!uploadSuccess ? (
                <Card
                  className={cn(
                    "relative border-2 border-dashed transition-all duration-300 p-12",
                    isDragging
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-300 hover:border-gray-400",
                    isUploading && "pointer-events-none opacity-75"
                  )}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp,.heic,.heif,.tiff,.tif,.bmp"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isUploading}
                    multiple
                  />

                  <div className="text-center">
                    {isValidating ? (
                      <>
                        <Loader2 className="w-12 h-12 animate-spin text-emerald-500 mx-auto mb-4" />
                        <p className="text-lg font-medium text-gray-700">Validating file...</p>
                        <p className="text-sm text-gray-500 mt-2">Checking if your file is a valid resume</p>
                      </>
                    ) : isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                        <p className="text-lg font-medium text-gray-700">Processing your files...</p>
                        <p className="text-sm text-gray-500 mt-2">Uploading {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''}</p>
                        
                        {/* Progress list for multiple files */}
                        {uploadProgress.length > 0 && (
                          <div className="mt-4 text-left max-w-sm mx-auto">
                            {uploadProgress.map((progress, index) => (
                              <div key={index} className="flex items-center gap-2 mb-2">
                                {progress.status === 'uploading' && (
                                  <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                                )}
                                {progress.status === 'success' && (
                                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                                )}
                                {progress.status === 'error' && (
                                  <X className="w-4 h-4 text-red-500" />
                                )}
                                <span className="text-sm text-gray-600 truncate">{progress.file}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-lg font-medium text-gray-700 mb-2">
                          Drag & drop your resumes or click to upload
                        </p>
                        <p className="text-sm text-gray-500 mb-4">
                          Supported formats: PDF, DOC, DOCX, PNG, JPG, etc. (Max 10MB each)
                        </p>
                        <p className="text-xs text-gray-400 mb-4">
                          You can select multiple files
                        </p>
                        <Button
                          type="button"
                          className="bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 hover:from-emerald-600 hover:via-sky-500 hover:to-blue-700 text-white border-0"
                        >
                          Choose Files
                        </Button>
                      </>
                    )}
                  </div>
                </Card>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    <CheckCircle className="w-20 h-20 text-emerald-500 mx-auto" />
                  </motion.div>
                  <p className="text-lg font-medium text-gray-700 mt-4">
                    Successfully uploaded {completedJobIds.length} file{completedJobIds.length > 1 ? 's' : ''}!
                  </p>
                  <p className="text-sm text-gray-500 mt-2">Redirecting to your first CV...</p>
                </motion.div>
              )}
            </motion.div>

            {/* Progress indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
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