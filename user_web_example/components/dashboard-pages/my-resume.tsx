"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  FileText, 
  Download, 
  Edit3, 
  Plus, 
  Upload, 
  Eye, 
  Calendar,
  CheckCircle,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Share2,
  ExternalLink,
  FileImage
} from "lucide-react"
import { cn } from "@/lib/utils"

interface MyResumeProps {
  userName?: string
}

export default function MyResume({ userName = "Alex" }: MyResumeProps) {
  const [activeTab, setActiveTab] = useState<"current" | "history">("current")
  const [zoomLevel, setZoomLevel] = useState(100)
  const [cvUploads, setCvUploads] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentCV, setCurrentCV] = useState<any>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [filePreviewLoading, setFilePreviewLoading] = useState(false)
  const [filePreviewError, setFilePreviewError] = useState<string | null>(null)
  const [multiFileDetails, setMultiFileDetails] = useState<any>(null)
  const [selectedFileIndex, setSelectedFileIndex] = useState(0)

  // Fetch user's CV uploads
  useEffect(() => {
    fetchCVUploads()
  }, [])

  // Check for multi-file uploads
  useEffect(() => {
    const checkMultiFile = async () => {
      if (cvUploads.length > 0) {
        const upload = cvUploads[0]
        try {
          const sessionId = localStorage.getItem('resume2website_session_id')
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2000'}/api/v1/download/${upload.job_id}/all`,
            {
              headers: {
                'X-Session-ID': sessionId || ''
              }
            }
          )
          
          if (response.ok) {
            const data = await response.json()
            setMultiFileDetails(data)
          }
        } catch (error) {
          console.error('Error checking multi-file:', error)
        }
      }
    }
    
    checkMultiFile()
  }, [cvUploads])

  // Load file when we have a CV upload or selected file changes
  useEffect(() => {
    const loadFile = async () => {
      if (cvUploads.length > 0) {
        const upload = cvUploads[0]
        let downloadUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2000'}/api/v1/download/${upload.job_id}`
        
        // If multi-file and a specific file is selected
        if (multiFileDetails?.is_multi_file && multiFileDetails.files[selectedFileIndex]) {
          const selectedFile = multiFileDetails.files[selectedFileIndex]
          downloadUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2000'}${selectedFile.url}`
        }
        
        const fileType = multiFileDetails?.is_multi_file 
          ? multiFileDetails.files[selectedFileIndex]?.type 
          : upload.file_type.toLowerCase()
        
        // Determine if file can be previewed
        const previewableTypes = ['.pdf', '.jpg', '.jpeg', '.png', '.webp', '.bmp', '.tiff', '.tif']
        
        if (previewableTypes.includes(fileType)) {
          setFilePreviewLoading(true)
          setFilePreviewError(null)
          
          try {
            const sessionId = localStorage.getItem('resume2website_session_id')
            const response = await fetch(downloadUrl, {
              headers: {
                'X-Session-ID': sessionId || ''
              }
            })
            
            if (!response.ok) {
              throw new Error(`Failed to load file: ${response.status} ${response.statusText}`)
            }
            
            const blob = await response.blob()
            const url = URL.createObjectURL(blob)
            setPdfUrl(url)
          } catch (error) {
            console.error('Error loading file:', error)
            setFilePreviewError(error instanceof Error ? error.message : 'Failed to load file preview')
          } finally {
            setFilePreviewLoading(false)
          }
        }
      }
    }
    
    loadFile()
    
    // Cleanup blob URL on unmount
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl)
      }
    }
  }, [cvUploads, multiFileDetails, selectedFileIndex])

  // Listen for upload completion events to refresh the list
  useEffect(() => {
    const handleUploadComplete = () => {
      // Refresh CV uploads after a short delay
      setTimeout(() => {
        fetchCVUploads()
      }, 500)
    }

    const handleCVDataUpdated = () => {
      // Refresh CV uploads when data is updated
      fetchCVUploads()
    }

    window.addEventListener('cvUploadComplete', handleUploadComplete)
    window.addEventListener('cvDataUpdated', handleCVDataUpdated)
    return () => {
      window.removeEventListener('cvUploadComplete', handleUploadComplete)
      window.removeEventListener('cvDataUpdated', handleCVDataUpdated)
    }
  }, [])

  const fetchCVUploads = async () => {
    try {
      const sessionId = localStorage.getItem('resume2website_session_id')
      if (!sessionId) {
        setIsLoading(false)
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2000'}/api/v1/my-cvs`, {
        headers: {
          'X-Session-ID': sessionId
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch CVs')
      }

      const data = await response.json()
      setCvUploads(data.cvs || [])
      
      // Set the most recent CV as current
      if (data.cvs && data.cvs.length > 0) {
        const latestCV = data.cvs[0]
        if (latestCV.cv_data) {
          try {
            setCurrentCV(JSON.parse(latestCV.cv_data))
          } catch (e) {
            console.error('Failed to parse CV data:', e)
          }
        }
      }
    } catch (error) {
      console.error('Error fetching CVs:', error)
    } finally {
      setIsLoading(false)
    }
  }


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative p-4 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 rounded-2xl shadow-lg backdrop-blur-sm">
                  <FileText className="w-9 h-9 text-blue-600" />
                </div>
              </div>
              <div className="flex flex-col">
                <h1 className="text-6xl font-extrabold bg-gradient-to-r from-blue-900 via-indigo-700 to-purple-700 bg-clip-text text-transparent leading-tight pb-2">
                  My Resume
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                  <span className="text-sm font-medium text-blue-600">Professional Documents</span>
                </div>
              </div>
            </div>
            <p className="text-lg text-gray-600 max-w-3xl leading-relaxed">
              View, download, and manage your professional resume files with multi-file support and instant preview
            </p>
          </div>
          <div className="flex items-center gap-3">
            {cvUploads.length > 0 ? (
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                <CheckCircle className="w-3 h-3 mr-1" />
                {cvUploads.length} CV{cvUploads.length > 1 ? 's' : ''} Uploaded
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                No CV Uploaded
              </Badge>
            )}
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                if (cvUploads[0]?.job_id) {
                  const sessionId = localStorage.getItem('resume2website_session_id')
                  // Create a temporary link to download
                  const link = document.createElement('a')
                  link.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2000'}/api/v1/download/${cvUploads[0].job_id}`
                  link.download = cvUploads[0].filename
                  // We can't set headers on a link, so we'll fetch and download
                  fetch(link.href, {
                    headers: { 'X-Session-ID': sessionId || '' }
                  })
                  .then(res => res.blob())
                  .then(blob => {
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = cvUploads[0].filename
                    a.click()
                    URL.revokeObjectURL(url)
                  })
                }
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <Button 
              className="bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 hover:from-emerald-600 hover:via-sky-500 hover:to-blue-700 text-white"
              size="sm"
              onClick={() => {
                if (cvUploads[0]?.job_id) {
                  const event = new CustomEvent('navigateToCVEditor', { 
                    detail: { 
                      jobId: cvUploads[0].job_id,
                      scrollToGenerate: true 
                    } 
                  })
                  window.dispatchEvent(event)
                }
              }}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Generate Portfolio
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="border-b border-gray-200">
          <nav className="flex gap-8">
            <button
              onClick={() => setActiveTab("current")}
              className={cn(
                "py-2 px-1 border-b-2 font-medium text-sm transition-colors",
                activeTab === "current"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              Current Resume
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={cn(
                "py-2 px-1 border-b-2 font-medium text-sm transition-colors",
                activeTab === "history"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              Version History
            </button>
          </nav>
        </div>
      </motion.div>

      {activeTab === "current" && (
        <div className="space-y-6">
          {cvUploads.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="p-12 text-center">
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Resume Uploaded Yet</h2>
                <p className="text-gray-600 mb-6">Upload your CV to get started with your professional portfolio</p>
                <Button 
                  className="bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 hover:from-emerald-600 hover:via-sky-500 hover:to-blue-700 text-white"
                  onClick={() => {
                    // Trigger the upload flow
                    const event = new CustomEvent('openUploadModal')
                    window.dispatchEvent(event)
                  }}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Your Resume
                </Button>
              </Card>
            </motion.div>
          ) : (
            <>
              {/* Main Resume Display */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Resume Preview - Left Side */}
              <div className="lg:col-span-2">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Resume Preview</h2>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setZoomLevel(Math.max(50, zoomLevel - 25))}
                        disabled={zoomLevel <= 50}
                      >
                        <ZoomOut className="w-4 h-4" />
                      </Button>
                      <span className="text-sm text-gray-600 min-w-[4rem] text-center">
                        {zoomLevel}%
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setZoomLevel(Math.min(200, zoomLevel + 25))}
                        disabled={zoomLevel >= 200}
                      >
                        <ZoomIn className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Multi-file selector */}
                  {multiFileDetails?.is_multi_file && multiFileDetails.files.length > 1 && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-900 mb-2">Multiple files uploaded ({multiFileDetails.files.length} files)</p>
                      <div className="flex flex-wrap gap-2">
                        {multiFileDetails.files.map((file: any, index: number) => (
                          <Button
                            key={index}
                            variant={selectedFileIndex === index ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedFileIndex(index)}
                            className={selectedFileIndex === index ? "bg-blue-600" : ""}
                          >
                            <FileText className="w-3 h-3 mr-1" />
                            {file.filename.replace(/^\d+_/, '')}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* File Preview Content */}
                  <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ height: '800px' }}>
                    {filePreviewLoading ? (
                      // Loading state
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                          <p className="text-gray-600">Loading file preview...</p>
                        </div>
                      </div>
                    ) : filePreviewError ? (
                      // Error state
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <FileText className="w-16 h-16 text-red-400 mx-auto mb-4" />
                          <p className="text-red-600 mb-2">Preview Error</p>
                          <p className="text-gray-600 mb-4 text-sm">{filePreviewError}</p>
                          <Button
                            onClick={() => {
                              const sessionId = localStorage.getItem('resume2website_session_id')
                              fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2000'}/api/v1/download/${cvUploads[0].job_id}`, {
                                headers: { 'X-Session-ID': sessionId || '' }
                              })
                              .then(res => res.blob())
                              .then(blob => {
                                const url = URL.createObjectURL(blob)
                                const a = document.createElement('a')
                                a.href = url
                                a.download = cvUploads[0].filename
                                a.click()
                                URL.revokeObjectURL(url)
                              })
                            }}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download File
                          </Button>
                        </div>
                      </div>
                    ) : pdfUrl && cvUploads[0] ? (
                      // File preview (PDF or image)
                      (() => {
                        const fileType = cvUploads[0].file_type.toLowerCase()
                        const imageTypes = ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.tiff', '.tif']
                        
                        if (fileType === '.pdf') {
                          return (
                            <iframe
                              src={pdfUrl}
                              className="w-full h-full"
                              style={{ 
                                transform: `scale(${zoomLevel / 100})`,
                                transformOrigin: 'top center',
                                width: `${100 * (100 / zoomLevel)}%`,
                                height: `${100 * (100 / zoomLevel)}%`
                              }}
                              title="Resume Preview"
                            />
                          )
                        } else if (imageTypes.includes(fileType)) {
                          return (
                            <div 
                              className="w-full h-full flex items-center justify-center p-4"
                              style={{ 
                                transform: `scale(${zoomLevel / 100})`,
                                transformOrigin: 'center',
                              }}
                            >
                              <img
                                src={pdfUrl}
                                alt="Resume Preview"
                                className="max-w-full max-h-full object-contain"
                              />
                            </div>
                          )
                        }
                        return null
                      })()
                    ) : (
                      // No preview available
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 mb-4">
                            Preview not available for {cvUploads[0]?.file_type || 'this file type'}
                          </p>
                          <p className="text-gray-500 mb-4 text-sm">
                            Supported preview formats: PDF, JPG, PNG, WEBP, BMP, TIFF
                          </p>
                          <Button
                            onClick={() => {
                              const sessionId = localStorage.getItem('resume2website_session_id')
                              fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2000'}/api/v1/download/${cvUploads[0].job_id}`, {
                                headers: { 'X-Session-ID': sessionId || '' }
                              })
                              .then(res => res.blob())
                              .then(blob => {
                                const url = URL.createObjectURL(blob)
                                const a = document.createElement('a')
                                a.href = url
                                a.download = cvUploads[0].filename
                                a.click()
                                URL.revokeObjectURL(url)
                              })
                            }}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download File
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              {/* Resume Info Sidebar - Right Side */}
              <div className="space-y-6">
                {/* Resume Details */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Resume Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">File name</span>
                      <span className="font-medium text-sm" title={cvUploads[0]?.filename}>
                        {multiFileDetails?.is_multi_file 
                          ? `${multiFileDetails.files.length} files`
                          : (cvUploads[0]?.filename || 'No file')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Job ID</span>
                      <span className="font-medium text-xs">{cvUploads[0]?.job_id?.slice(0, 8) || 'N/A'}...</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Format</span>
                      <span className="font-medium">
                        {multiFileDetails?.is_multi_file 
                          ? multiFileDetails.files.map((f: any) => f.type.toUpperCase().replace('.', '')).join(', ')
                          : (cvUploads[0]?.file_type?.toUpperCase().replace('.', '') || 'N/A')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600">Uploaded</span>
                      <span className="font-medium">
                        {cvUploads[0] ? new Date(cvUploads[0].upload_date).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600">Status</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        Active
                      </Badge>
                    </div>
                  </div>
                </Card>

                {/* Multi-file List */}
                {multiFileDetails?.is_multi_file && multiFileDetails.files.length > 1 && (
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Files</h3>
                    <div className="space-y-2">
                      {multiFileDetails.files.map((file: any, index: number) => (
                        <div 
                          key={index} 
                          className={cn(
                            "flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors",
                            selectedFileIndex === index 
                              ? "bg-blue-50 border border-blue-200" 
                              : "bg-gray-50 hover:bg-gray-100"
                          )}
                          onClick={() => setSelectedFileIndex(index)}
                        >
                          <div className="flex items-center gap-2">
                            <FileImage className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium">{file.filename.replace(/^\d+_/, '')}</span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {(file.size / 1024).toFixed(1)} KB
                          </span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-3">
                      All files processed together as one CV
                    </p>
                  </Card>
                )}

                {/* Quick Actions */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => {
                        // Navigate to CV Editor
                        const event = new CustomEvent('navigateToCVEditor', { detail: { jobId: cvUploads[0]?.job_id } })
                        window.dispatchEvent(event)
                      }}
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Resume
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Plus className="w-4 h-4 mr-2" />
                      Create New Version
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => {
                        // Trigger the upload flow
                        const event = new CustomEvent('openUploadModal')
                        window.dispatchEvent(event)
                      }}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload New Resume
                    </Button>
                    <Button 
                      className="w-full justify-start bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 hover:from-emerald-600 hover:via-sky-500 hover:to-blue-700 text-white"
                      size="sm" 
                      onClick={() => {
                        if (cvUploads[0]?.job_id) {
                          const event = new CustomEvent('navigateToCVEditor', { 
                            detail: { 
                              jobId: cvUploads[0].job_id,
                              scrollToGenerate: true 
                            } 
                          })
                          window.dispatchEvent(event)
                        }
                      }}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Generate Portfolio
                    </Button>
                  </div>
                </Card>

                {/* Website Integration */}
                <Card className="p-6 bg-blue-50 border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">Website Integration</h4>
                  <p className="text-sm text-blue-700 mb-3">
                    This resume has been processed and integrated into your professional website.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>Content extracted and optimized</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>ATS keywords identified</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>Professional layout applied</span>
                    </div>
                  </div>
                </Card>

                {/* Analytics */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Resume Analytics</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Downloads</span>
                      <span className="font-semibold text-gray-900">47</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Views</span>
                      <span className="font-semibold text-gray-900">312</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Shares</span>
                      <span className="font-semibold text-gray-900">23</span>
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">ATS Score</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          95/100
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
                </div>
              </motion.div>
            </>
          )}
        </div>
      )}

      {activeTab === "history" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload History</h2>
            {cvUploads.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No CV uploads yet</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4"
                  onClick={() => {
                    // Trigger the upload flow
                    const event = new CustomEvent('openUploadModal')
                    window.dispatchEvent(event)
                  }}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Your First CV
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {cvUploads.map((upload, index) => (
                  <div key={upload.upload_id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">{upload.filename}</span>
                        {index === 0 && (
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            Current
                          </Badge>
                        )}
                        <Badge variant="secondary" className={
                          upload.status === 'completed' ? "bg-green-100 text-green-700" :
                          upload.status === 'processing' ? "bg-yellow-100 text-yellow-700" :
                          "bg-red-100 text-red-700"
                        }>
                          {upload.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        File type: {upload.file_type}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(upload.upload_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {upload.status === 'completed' && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              if (upload.cv_data) {
                                try {
                                  setCurrentCV(JSON.parse(upload.cv_data))
                                  setActiveTab('current')
                                } catch (e) {
                                  console.error('Failed to parse CV data:', e)
                                }
                              }
                            }}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              const sessionId = localStorage.getItem('resume2website_session_id')
                              fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2000'}/api/v1/download/${upload.job_id}`, {
                                headers: { 'X-Session-ID': sessionId || '' }
                              })
                              .then(res => res.blob())
                              .then(blob => {
                                const url = URL.createObjectURL(blob)
                                const a = document.createElement('a')
                                a.href = url
                                a.download = upload.filename
                                a.click()
                                URL.revokeObjectURL(url)
                              })
                            }}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      )}
    </div>
  )
} 