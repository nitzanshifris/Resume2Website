"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  Save, 
  Plus, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Loader2,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Edit3
} from "lucide-react"
import { cn } from "@/lib/utils"

interface CVEditorProps {
  userName?: string
}

export default function CVEditor({ userName }: CVEditorProps) {
  const [cvData, setCvData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [currentJobId, setCurrentJobId] = useState<string | null>(null)
  const [profilePhotoShape, setProfilePhotoShape] = useState<'circle' | 'square' | 'rounded'>('circle')
  const [isGeneratingPortfolio, setIsGeneratingPortfolio] = useState(false)

  // Get CSS classes for profile photo shape
  const getPhotoShapeClasses = (shape: string) => {
    switch(shape) {
      case 'circle': return 'rounded-full'
      case 'square': return 'rounded-none'
      case 'rounded': return 'rounded-xl'
      default: return 'rounded-full'
    }
  }

  // Section color schemes for better UX
  const sectionColors = {
    hero: {
      border: 'border-l-purple-500',
      bg: 'bg-purple-50',
      accent: 'text-purple-700',
      icon: '👤'
    },
    contact: {
      border: 'border-l-blue-500',
      bg: 'bg-blue-50',
      accent: 'text-blue-700',
      icon: '📧'
    },
    experience: {
      border: 'border-l-green-500',
      bg: 'bg-green-50',
      accent: 'text-green-700',
      icon: '💼'
    },
    education: {
      border: 'border-l-indigo-500',
      bg: 'bg-indigo-50',
      accent: 'text-indigo-700',
      icon: '🎓'
    },
    skills: {
      border: 'border-l-orange-500',
      bg: 'bg-orange-50',
      accent: 'text-orange-700',
      icon: '⚡'
    },
    projects: {
      border: 'border-l-cyan-500',
      bg: 'bg-cyan-50',
      accent: 'text-cyan-700',
      icon: '🚀'
    },
    certifications: {
      border: 'border-l-emerald-500',
      bg: 'bg-emerald-50',
      accent: 'text-emerald-700',
      icon: '🏆'
    },
    additional: {
      border: 'border-l-gray-400',
      bg: 'bg-gray-50',
      accent: 'text-gray-600',
      icon: '➕'
    }
  }

  // Fetch the latest CV data on mount
  useEffect(() => {
    fetchLatestCV()
  }, [])

  const fetchLatestCV = async () => {
    try {
      const sessionId = localStorage.getItem('cv2web_session_id')
      if (!sessionId) {
        setIsLoading(false)
        return
      }

      // First get the list of CVs
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2000'}/api/v1/my-cvs`, {
        headers: {
          'X-Session-ID': sessionId
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch CVs')
      }

      const data = await response.json()
      
      // Prioritize the most recently uploaded CV (users expect to see what they just uploaded)
      const completedCVs = data.cvs?.filter((cv: any) => cv.status === 'completed') || []
      
      // Sort by upload_date descending (most recent first)
      completedCVs.sort((a, b) => new Date(b.upload_date).getTime() - new Date(a.upload_date).getTime())
      
      // Get the most recent CV with valid data
      const latestCV = completedCVs.find(cv => cv.cv_data) || data.cvs?.[0]
      
      // Debug logging
      if (latestCV) {
        console.log(`✅ Selected most recent CV from ${completedCVs.length} completed CVs`)
        console.log(`Job ID: ${latestCV.job_id}, Upload Date: ${latestCV.upload_date}`)
        console.log(`Filename: ${latestCV.filename}`)
      } else {
        console.log(`⚠️ No completed CVs found`)
      }
      
      if (latestCV?.cv_data) {
        try {
          const parsedData = JSON.parse(latestCV.cv_data)
          setCvData(parsedData)
          setCurrentJobId(latestCV.job_id)
        } catch (e) {
          console.error('Failed to parse CV data:', e)
        }
      }
    } catch (error) {
      console.error('Error fetching CV:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!currentJobId || !cvData) return

    setIsSaving(true)
    setSaveStatus('saving')

    try {
      const sessionId = localStorage.getItem('cv2web_session_id')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2000'}/api/v1/cv/${currentJobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': sessionId || ''
        },
        body: JSON.stringify(cvData)
      })

      if (!response.ok) {
        throw new Error('Failed to save CV')
      }

      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 3000)
      
      // Emit event to notify other components
      const event = new CustomEvent('cvDataUpdated', { detail: { jobId: currentJobId } })
      window.dispatchEvent(event)
    } catch (error) {
      console.error('Error saving CV:', error)
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  const handleGeneratePortfolio = async () => {
    if (!currentJobId) {
      alert('No CV data found. Please upload a CV first.')
      return
    }

    setIsGeneratingPortfolio(true)

    try {
      // Save current data before generating
      await handleSave()

      // Call portfolio generation API
      const sessionId = localStorage.getItem('cv2web_session_id')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2000'}/api/v1/portfolio/generate/${currentJobId}`, {
        method: 'POST',
        headers: {
          'X-Session-ID': sessionId || 'dev-session'
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to generate portfolio')
      }

      const result = await response.json()
      
      // Show success message
      alert(`Portfolio generated successfully! 🎉\n\nYour portfolio is now available at: ${result.url}\n\nYou can view it in the "My Website" section.`)
      
      // Emit event to notify other components
      const event = new CustomEvent('portfolioGenerated', { 
        detail: { 
          portfolioId: result.portfolio_id,
          url: result.url,
          jobId: currentJobId
        } 
      })
      window.dispatchEvent(event)

      console.log('Portfolio generated:', result)
    } catch (error) {
      console.error('Error generating portfolio:', error)
      alert(`Failed to generate portfolio: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsGeneratingPortfolio(false)
    }
  }

  const updateField = (section: string, field: string, value: any) => {
    setCvData((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const updateNestedField = (section: string, index: number, field: string, value: any) => {
    setCvData((prev: any) => {
      const items = prev[section]?.[`${section}Items`] || []
      const updatedItems = [...items]
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value
      }
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [`${section}Items`]: updatedItems
        }
      }
    })
  }

  const addItem = (section: string) => {
    setCvData((prev: any) => {
      const itemsKey = `${section}Items`
      const currentItems = prev[section]?.[itemsKey] || []
      const newItem = getEmptyItem(section)
      
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [itemsKey]: [...currentItems, newItem]
        }
      }
    })
  }

  const removeItem = (section: string, index: number) => {
    setCvData((prev: any) => {
      const itemsKey = `${section}Items`
      const items = prev[section]?.[itemsKey] || []
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [itemsKey]: items.filter((_: any, i: number) => i !== index)
        }
      }
    })
  }

  const moveItem = (section: string, index: number, direction: 'up' | 'down') => {
    setCvData((prev: any) => {
      const itemsKey = `${section}Items`
      const items = [...(prev[section]?.[itemsKey] || [])]
      const newIndex = direction === 'up' ? index - 1 : index + 1
      
      if (newIndex < 0 || newIndex >= items.length) return prev
      
      [items[index], items[newIndex]] = [items[newIndex], items[index]]
      
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [itemsKey]: items
        }
      }
    })
  }

  const getEmptyItem = (section: string) => {
    switch (section) {
      case 'experience':
        return {
          jobTitle: '',
          companyName: '',
          dateRange: { startDate: '', endDate: '' },
          responsibilitiesAndAchievements: []
        }
      case 'education':
        return {
          degree: '',
          institution: '',
          fieldOfStudy: '',
          dateRange: { startDate: '', endDate: '' }
        }
      case 'skills':
        return { skill: '' }
      case 'projects':
        return {
          title: '',
          description: '',
          technologies: [],
          link: ''
        }
      default:
        return {}
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!cvData) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">No CV Data Found</h2>
        <p className="text-gray-600">Please upload a CV first to edit it here.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex-1">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-br from-emerald-500 via-sky-400 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
                  <div className="relative p-4 bg-gradient-to-br from-emerald-500/10 via-sky-400/10 to-blue-600/10 rounded-2xl shadow-lg backdrop-blur-sm">
                    <Edit3 className="w-9 h-9 text-blue-600" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <h1 className="text-6xl font-extrabold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-600 bg-clip-text text-transparent leading-tight pb-2">
                    CV Editor
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-12 h-1 bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 rounded-full"></div>
                    <span className="text-sm font-medium text-emerald-600">Content Management</span>
                  </div>
                </div>
              </div>
              <div className="h-16 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent" />
              <button
                onClick={() => {
                  // Scroll to portfolio generation section
                  const element = document.getElementById('portfolio-generation-section')
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                }}
                className="group relative px-6 py-3"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative bg-white rounded-lg px-6 py-3 shadow-sm group-hover:shadow-lg transition-shadow">
                  <span className="text-xl font-semibold bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 bg-clip-text text-transparent group-hover:from-emerald-600 group-hover:via-sky-500 group-hover:to-blue-700 transition-all flex items-center gap-2">
                    Generate Your Portfolio
                    <svg className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </div>
              </button>
            </div>
            <p className="text-lg text-gray-600 max-w-3xl leading-relaxed">
              Perfect your professional information below, then click <span className="font-medium text-gray-800">Generate Your Portfolio</span> to transform your CV into a stunning portfolio website
            </p>
          </div>
          
          {/* Section Color Legend */}
          <div className="flex items-center gap-4 mt-6 p-3 bg-gray-50 rounded-lg">
            <span className="text-xs font-medium text-gray-600">Sections:</span>
            <div className="flex flex-wrap gap-3">
              {Object.entries(sectionColors).slice(0, -1).map(([key, colors]) => (
                <div key={key} className="flex items-center gap-1.5 text-xs">
                  <div className={`w-3 h-3 rounded-full ${colors.border.replace('border-l-', 'bg-')}`}></div>
                  <span className="text-gray-600 font-medium capitalize">
                    {key === 'hero' ? 'Profile' : key}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {saveStatus === 'saved' && (
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              <CheckCircle className="w-3 h-3 mr-1" />
              Saved
            </Badge>
          )}
          {saveStatus === 'error' && (
            <Badge variant="secondary" className="bg-red-100 text-red-700">
              <AlertCircle className="w-3 h-3 mr-1" />
              Error saving
            </Badge>
          )}
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 hover:from-emerald-600 hover:via-sky-500 hover:to-blue-700 text-white"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </motion.div>

      {/* Hero Section */}
      <Card className={`${sectionColors.hero.border} border-l-4`}>
        <CardHeader className={sectionColors.hero.bg}>
          <CardTitle className={`flex items-center gap-2 ${sectionColors.hero.accent}`}>
            <span className="text-xl">{sectionColors.hero.icon}</span>
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Profile Photo Section */}
          <div className="space-y-3 border-b pb-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium">Profile Photo</label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Shape:</span>
                <select
                  value={profilePhotoShape}
                  onChange={(e) => setProfilePhotoShape(e.target.value as 'circle' | 'square' | 'rounded')}
                  className="text-xs border border-gray-300 rounded px-2 py-1"
                >
                  <option value="circle">🔴 Circle</option>
                  <option value="square">⬜ Square</option>
                  <option value="rounded">🔳 Rounded</option>
                </select>
              </div>
            </div>
            <div className="flex items-start gap-4">
              {/* Photo Preview */}
              <div className="flex-shrink-0">
                <input
                  type="file"
                  id="profile-photo-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      // Convert file to base64 data URL for immediate preview
                      const reader = new FileReader()
                      reader.onload = (event) => {
                        const result = event.target?.result as string
                        updateField('hero', 'profilePhotoUrl', result)
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                />
                
                {cvData.hero?.profilePhotoUrl ? (
                  <div className="relative group">
                    <img
                      src={cvData.hero.profilePhotoUrl}
                      alt="Profile"
                      className={`w-20 h-20 ${getPhotoShapeClasses(profilePhotoShape)} object-cover border-2 border-gray-200 cursor-pointer hover:opacity-80 transition-opacity`}
                      onClick={() => document.getElementById('profile-photo-upload')?.click()}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiNGM0Y0RjYiLz4KPHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIyNCIgeT0iMjQiPgo8cGF0aCBkPSJNMjAgMjF2LTJhNCA0IDAgMCAwLTQtNEg4YTQgNCAwIDAgMC00IDR2MiIgc3Ryb2tlPSIjOUI5QkEzIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8Y2lyY2xlIGN4PSIxMiIgY3k9IjciIHI9IjQiIHN0cm9rZT0iIzlCOUJBMyIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cjwvc3ZnPgo='
                      }}
                    />
                    {/* Upload overlay on hover */}
                    <div className={`absolute inset-0 ${getPhotoShapeClasses(profilePhotoShape)} bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition-all duration-200 cursor-pointer`}
                         onClick={() => document.getElementById('profile-photo-upload')?.click()}>
                      <span className="text-white opacity-0 group-hover:opacity-100 text-xs font-medium transition-opacity">
                        Change
                      </span>
                    </div>
                    <Button
                      onClick={() => updateField('hero', 'profilePhotoUrl', '')}
                      size="sm"
                      variant="ghost"
                      className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-red-100 hover:bg-red-200 text-red-600 rounded-full"
                    >
                      ×
                    </Button>
                  </div>
                ) : (
                  <div 
                    className={`w-20 h-20 ${getPhotoShapeClasses(profilePhotoShape)} bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors`}
                    onClick={() => document.getElementById('profile-photo-upload')?.click()}
                  >
                    <div className="text-center">
                      <span className="text-2xl text-gray-400 block">📷</span>
                      <span className="text-xs text-gray-500 mt-1">Upload</span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Photo URL Input */}
              <div className="flex-1 space-y-2">
                <Input
                  value={cvData.hero?.profilePhotoUrl || ''}
                  onChange={(e) => updateField('hero', 'profilePhotoUrl', e.target.value)}
                  placeholder="https://your-photo-url.com/photo.jpg"
                  className="text-sm"
                />
                <div className="text-xs text-gray-500 space-y-1">
                  <div>💡 <strong>Upload Options:</strong></div>
                  <div>• Click the circle above to upload from your device</div>
                  <div>• Or paste a URL (LinkedIn photo, Imgur, GitHub, etc.)</div>
                  <div>• Recommended: Square image, 400x400px minimum</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <Input
                value={cvData.hero?.fullName || ''}
                onChange={(e) => updateField('hero', 'fullName', e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Professional Title</label>
              <Input
                value={cvData.hero?.professionalTitle || ''}
                onChange={(e) => updateField('hero', 'professionalTitle', e.target.value)}
                placeholder="Senior Software Engineer"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Summary Tagline</label>
            <Textarea
              value={cvData.hero?.summaryTagline || ''}
              onChange={(e) => updateField('hero', 'summaryTagline', e.target.value)}
              placeholder="Brief professional summary..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className={`${sectionColors.contact.border} border-l-4`}>
        <CardHeader className={sectionColors.contact.bg}>
          <CardTitle className={`flex items-center gap-2 ${sectionColors.contact.accent}`}>
            <span className="text-xl">{sectionColors.contact.icon}</span>
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                value={cvData.contact?.email || ''}
                onChange={(e) => updateField('contact', 'email', e.target.value)}
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <Input
                value={cvData.contact?.phone || ''}
                onChange={(e) => updateField('contact', 'phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">City</label>
              <Input
                value={cvData.contact?.location?.city || ''}
                onChange={(e) => updateField('contact', 'location', {
                  ...cvData.contact?.location,
                  city: e.target.value
                })}
                placeholder="San Francisco"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">State</label>
              <Input
                value={cvData.contact?.location?.state || ''}
                onChange={(e) => updateField('contact', 'location', {
                  ...cvData.contact?.location,
                  state: e.target.value
                })}
                placeholder="CA"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Country</label>
              <Input
                value={cvData.contact?.location?.country || ''}
                onChange={(e) => updateField('contact', 'location', {
                  ...cvData.contact?.location,
                  country: e.target.value
                })}
                placeholder="USA"
              />
            </div>
          </div>

          {/* Professional Links Section */}
          <div className="space-y-4 border-t pt-4">
            <label className="block text-sm font-medium">Professional Links & Portfolio</label>
            <div className="space-y-3">
              {cvData.contact?.professionalLinks?.map((link: any, index: number) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-500">Platform</label>
                      <select
                        value={link.platform || ''}
                        onChange={(e) => {
                          const newLinks = [...(cvData.contact?.professionalLinks || [])]
                          newLinks[index] = { ...newLinks[index], platform: e.target.value }
                          updateField('contact', 'professionalLinks', newLinks)
                        }}
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="">Select Platform</option>
                        <option value="LinkedIn">🔗 LinkedIn</option>
                        <option value="GitHub">⚡ GitHub</option>
                        <option value="Portfolio">🌐 Portfolio Website</option>
                        <option value="Behance">🎨 Behance</option>
                        <option value="Dribbble">🏀 Dribbble</option>
                        <option value="Twitter">🐦 Twitter</option>
                        <option value="Instagram">📸 Instagram</option>
                        <option value="YouTube">📺 YouTube</option>
                        <option value="Medium">📝 Medium</option>
                        <option value="StackOverflow">⚡ Stack Overflow</option>
                        <option value="CodePen">✏️ CodePen</option>
                        <option value="Personal Website">🏠 Personal Website</option>
                        <option value="Other">🔗 Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">URL</label>
                      <Input
                        value={link.url || ''}
                        onChange={(e) => {
                          const newLinks = [...(cvData.contact?.professionalLinks || [])]
                          newLinks[index] = { ...newLinks[index], url: e.target.value }
                          updateField('contact', 'professionalLinks', newLinks)
                        }}
                        placeholder="https://linkedin.com/in/yourname"
                        className="text-sm"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={() => {
                      const newLinks = cvData.contact?.professionalLinks?.filter((_: any, idx: number) => idx !== index) || []
                      updateField('contact', 'professionalLinks', newLinks)
                    }}
                    size="sm"
                    variant="ghost"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              
              {/* Add New Link Button */}
              <Button
                onClick={() => {
                  const newLink = { platform: '', url: '' }
                  const currentLinks = cvData.contact?.professionalLinks || []
                  updateField('contact', 'professionalLinks', [...currentLinks, newLink])
                }}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Professional Link
              </Button>

              {/* Quick Add Common Links */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Button
                  onClick={() => {
                    const newLink = { platform: 'LinkedIn', url: '' }
                    const currentLinks = cvData.contact?.professionalLinks || []
                    updateField('contact', 'professionalLinks', [...currentLinks, newLink])
                  }}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  🔗 + LinkedIn
                </Button>
                <Button
                  onClick={() => {
                    const newLink = { platform: 'GitHub', url: '' }
                    const currentLinks = cvData.contact?.professionalLinks || []
                    updateField('contact', 'professionalLinks', [...currentLinks, newLink])
                  }}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  ⚡ + GitHub
                </Button>
                <Button
                  onClick={() => {
                    const newLink = { platform: 'Portfolio', url: '' }
                    const currentLinks = cvData.contact?.professionalLinks || []
                    updateField('contact', 'professionalLinks', [...currentLinks, newLink])
                  }}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  🌐 + Portfolio
                </Button>
                <Button
                  onClick={() => {
                    const newLink = { platform: 'Personal Website', url: '' }
                    const currentLinks = cvData.contact?.professionalLinks || []
                    updateField('contact', 'professionalLinks', [...currentLinks, newLink])
                  }}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  🏠 + Website
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Experience Section */}
      <Card className={`${sectionColors.experience.border} border-l-4`}>
        <CardHeader className={sectionColors.experience.bg}>
          <div className="flex items-center justify-between">
            <CardTitle className={`flex items-center gap-2 ${sectionColors.experience.accent}`}>
              <span className="text-xl">{sectionColors.experience.icon}</span>
              Experience
            </CardTitle>
            <Button
              onClick={() => addItem('experience')}
              size="sm"
              variant="outline"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Experience
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {cvData.experience?.experienceItems?.map((exp: any, index: number) => (
            <div key={index} className="mb-6 p-4 border rounded-lg">
              <div className="flex items-start justify-between mb-4">
                <h4 className="font-medium">Experience {index + 1}</h4>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => moveItem('experience', index, 'up')}
                    size="sm"
                    variant="ghost"
                    disabled={index === 0}
                  >
                    <ChevronUp className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => moveItem('experience', index, 'down')}
                    size="sm"
                    variant="ghost"
                    disabled={index === cvData.experience.experienceItems.length - 1}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => removeItem('experience', index)}
                    size="sm"
                    variant="ghost"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Job Title</label>
                    <Input
                      value={exp.jobTitle || ''}
                      onChange={(e) => updateNestedField('experience', index, 'jobTitle', e.target.value)}
                      placeholder="Senior Software Engineer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Company</label>
                    <Input
                      value={exp.companyName || ''}
                      onChange={(e) => updateNestedField('experience', index, 'companyName', e.target.value)}
                      placeholder="Tech Corp"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Start Date</label>
                    <Input
                      value={exp.dateRange?.startDate || ''}
                      onChange={(e) => updateNestedField('experience', index, 'dateRange', {
                        ...exp.dateRange,
                        startDate: e.target.value
                      })}
                      placeholder="January 2020"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">End Date</label>
                    <Input
                      value={exp.dateRange?.endDate || ''}
                      onChange={(e) => updateNestedField('experience', index, 'dateRange', {
                        ...exp.dateRange,
                        endDate: e.target.value
                      })}
                      placeholder="Present"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Responsibilities & Achievements</label>
                  <Textarea
                    value={(exp.responsibilitiesAndAchievements || []).join('\n')}
                    onChange={(e) => updateNestedField('experience', index, 'responsibilitiesAndAchievements', 
                      e.target.value.split('\n').filter(line => line.trim())
                    )}
                    placeholder="• Led development of microservices architecture&#10;• Mentored junior developers&#10;• Reduced system latency by 40%"
                    rows={5}
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Education Section */}
      <Card className={`${sectionColors.education.border} border-l-4`}>
        <CardHeader className={sectionColors.education.bg}>
          <div className="flex items-center justify-between">
            <CardTitle className={`flex items-center gap-2 ${sectionColors.education.accent}`}>
              <span className="text-xl">{sectionColors.education.icon}</span>
              Education
            </CardTitle>
            <Button
              onClick={() => addItem('education')}
              size="sm"
              variant="outline"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Education
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {cvData.education?.educationItems?.map((edu: any, index: number) => (
            <div key={index} className="mb-6 p-4 border rounded-lg">
              <div className="flex items-start justify-between mb-4">
                <h4 className="font-medium">Education {index + 1}</h4>
                <Button
                  onClick={() => removeItem('education', index)}
                  size="sm"
                  variant="ghost"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Degree</label>
                    <Input
                      value={edu.degree || ''}
                      onChange={(e) => updateNestedField('education', index, 'degree', e.target.value)}
                      placeholder="Bachelor of Science"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Field of Study</label>
                    <Input
                      value={edu.fieldOfStudy || ''}
                      onChange={(e) => updateNestedField('education', index, 'fieldOfStudy', e.target.value)}
                      placeholder="Computer Science"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Institution</label>
                  <Input
                    value={edu.institution || ''}
                    onChange={(e) => updateNestedField('education', index, 'institution', e.target.value)}
                    placeholder="University of Technology"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Start Date</label>
                    <Input
                      value={edu.dateRange?.startDate || ''}
                      onChange={(e) => updateNestedField('education', index, 'dateRange', {
                        ...edu.dateRange,
                        startDate: e.target.value
                      })}
                      placeholder="2016"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">End Date</label>
                    <Input
                      value={edu.dateRange?.endDate || ''}
                      onChange={(e) => updateNestedField('education', index, 'dateRange', {
                        ...edu.dateRange,
                        endDate: e.target.value
                      })}
                      placeholder="2020"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">GPA</label>
                    <Input
                      value={edu.gpa || ''}
                      onChange={(e) => updateNestedField('education', index, 'gpa', e.target.value)}
                      placeholder="3.8/4.0"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Skills Section */}
      <Card className={`${sectionColors.skills.border} border-l-4`}>
        <CardHeader className={sectionColors.skills.bg}>
          <div className="flex items-center justify-between">
            <CardTitle className={`flex items-center gap-2 ${sectionColors.skills.accent}`}>
              <span className="text-xl">{sectionColors.skills.icon}</span>
              Skills
            </CardTitle>
            <Button
              onClick={() => {
                // Add a new skill category if none exist
                if (!cvData.skills?.skillCategories || cvData.skills.skillCategories.length === 0) {
                  const newCategory = {
                    categoryName: "New Category",
                    skills: ["New Skill"]
                  }
                  setCvData((prev: any) => ({
                    ...prev,
                    skills: {
                      ...prev.skills,
                      skillCategories: [newCategory]
                    }
                  }))
                } else {
                  // Add skill to first category
                  setCvData((prev: any) => ({
                    ...prev,
                    skills: {
                      ...prev.skills,
                      skillCategories: prev.skills.skillCategories.map((cat: any, catIndex: number) => 
                        catIndex === 0 
                          ? { ...cat, skills: [...cat.skills, "New Skill"] }
                          : cat
                      )
                    }
                  }))
                }
              }}
              size="sm"
              variant="outline"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Skill
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {cvData.skills?.skillCategories?.map((category: any, categoryIndex: number) => (
              <div key={categoryIndex} className="space-y-3">
                <div className="flex items-center justify-between">
                  <Input
                    value={category.categoryName || ''}
                    onChange={(e) => {
                      setCvData((prev: any) => ({
                        ...prev,
                        skills: {
                          ...prev.skills,
                          skillCategories: prev.skills.skillCategories.map((cat: any, idx: number) =>
                            idx === categoryIndex 
                              ? { ...cat, categoryName: e.target.value }
                              : cat
                          )
                        }
                      }))
                    }}
                    placeholder="Category Name"
                    className="font-medium"
                  />
                  <Button
                    onClick={() => {
                      setCvData((prev: any) => ({
                        ...prev,
                        skills: {
                          ...prev.skills,
                          skillCategories: prev.skills.skillCategories.filter((_: any, idx: number) => idx !== categoryIndex)
                        }
                      }))
                    }}
                    size="sm"
                    variant="ghost"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {category.skills?.map((skill: string, skillIndex: number) => (
                    <div key={skillIndex} className="flex items-center gap-2">
                      <Input
                        value={skill || ''}
                        onChange={(e) => {
                          setCvData((prev: any) => ({
                            ...prev,
                            skills: {
                              ...prev.skills,
                              skillCategories: prev.skills.skillCategories.map((cat: any, catIdx: number) =>
                                catIdx === categoryIndex 
                                  ? {
                                      ...cat,
                                      skills: cat.skills.map((s: string, sIdx: number) =>
                                        sIdx === skillIndex ? e.target.value : s
                                      )
                                    }
                                  : cat
                              )
                            }
                          }))
                        }}
                        placeholder="Skill name"
                        className="text-sm"
                      />
                      <Button
                        onClick={() => {
                          setCvData((prev: any) => ({
                            ...prev,
                            skills: {
                              ...prev.skills,
                              skillCategories: prev.skills.skillCategories.map((cat: any, catIdx: number) =>
                                catIdx === categoryIndex 
                                  ? {
                                      ...cat,
                                      skills: cat.skills.filter((_: string, sIdx: number) => sIdx !== skillIndex)
                                    }
                                  : cat
                              )
                            }
                          }))
                        }}
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    onClick={() => {
                      setCvData((prev: any) => ({
                        ...prev,
                        skills: {
                          ...prev.skills,
                          skillCategories: prev.skills.skillCategories.map((cat: any, catIdx: number) =>
                            catIdx === categoryIndex 
                              ? { ...cat, skills: [...cat.skills, ""] }
                              : cat
                          )
                        }
                      }))
                    }}
                    size="sm"
                    variant="outline"
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Skill to {category.categoryName}
                  </Button>
                </div>
              </div>
            ))}
            {(!cvData.skills?.skillCategories || cvData.skills.skillCategories.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                <p>No skills added yet. Click "Add Skill" to get started.</p>
              </div>
            )}
            <Button
              onClick={() => {
                const newCategory = {
                  categoryName: "",
                  skills: [""]
                }
                setCvData((prev: any) => ({
                  ...prev,
                  skills: {
                    ...prev.skills,
                    skillCategories: [...(prev.skills?.skillCategories || []), newCategory]
                  }
                }))
              }}
              size="sm"
              variant="outline"
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add New Category
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Projects Section */}
      <Card className={`${sectionColors.projects.border} border-l-4`}>
        <CardHeader className={sectionColors.projects.bg}>
          <div className="flex items-center justify-between">
            <CardTitle className={`flex items-center gap-2 ${sectionColors.projects.accent}`}>
              <span className="text-xl">{sectionColors.projects.icon}</span>
              Projects
            </CardTitle>
            <Button
              onClick={() => {
                const newProject = {
                  title: "",
                  role: "",
                  duration: "",
                  description: "",
                  keyFeatures: [],
                  technologiesUsed: [],
                  projectUrl: "",
                  githubUrl: "",
                  imageUrl: "",
                  videoUrl: "",
                  demoUrl: ""
                }
                setCvData((prev: any) => ({
                  ...prev,
                  projects: {
                    ...prev.projects,
                    projectItems: [...(prev.projects?.projectItems || []), newProject]
                  }
                }))
              }}
              size="sm"
              variant="outline"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Project
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {cvData.projects?.projectItems?.map((project: any, index: number) => (
              <Card key={index} className={`border-l-4 ${sectionColors.projects.border} bg-gradient-to-r from-cyan-50 to-white`}>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Project {index + 1}</span>
                      <Button
                        onClick={() => {
                          setCvData((prev: any) => ({
                            ...prev,
                            projects: {
                              ...prev.projects,
                              projectItems: prev.projects.projectItems.filter((_: any, idx: number) => idx !== index)
                            }
                          }))
                        }}
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        value={project.title || ''}
                        onChange={(e) => {
                          setCvData((prev: any) => ({
                            ...prev,
                            projects: {
                              ...prev.projects,
                              projectItems: prev.projects.projectItems.map((p: any, idx: number) =>
                                idx === index ? { ...p, title: e.target.value } : p
                              )
                            }
                          }))
                        }}
                        placeholder="Project Title"
                      />
                      <Input
                        value={project.role || ''}
                        onChange={(e) => {
                          setCvData((prev: any) => ({
                            ...prev,
                            projects: {
                              ...prev.projects,
                              projectItems: prev.projects.projectItems.map((p: any, idx: number) =>
                                idx === index ? { ...p, role: e.target.value } : p
                              )
                            }
                          }))
                        }}
                        placeholder="Your Role"
                      />
                    </div>
                    <Textarea
                      value={project.description || ''}
                      onChange={(e) => {
                        setCvData((prev: any) => ({
                          ...prev,
                          projects: {
                            ...prev.projects,
                            projectItems: prev.projects.projectItems.map((p: any, idx: number) =>
                              idx === index ? { ...p, description: e.target.value } : p
                            )
                          }
                        }))
                      }}
                      placeholder="Project description"
                      className="min-h-[100px]"
                    />
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Technologies Used</label>
                      <div className="flex flex-wrap gap-2">
                        {project.technologiesUsed?.map((tech: string, techIndex: number) => (
                          <Badge key={techIndex} variant="secondary" className="cursor-pointer">
                            {tech}
                            <button
                              onClick={() => {
                                setCvData((prev: any) => ({
                                  ...prev,
                                  projects: {
                                    ...prev.projects,
                                    projectItems: prev.projects.projectItems.map((p: any, idx: number) =>
                                      idx === index 
                                        ? { ...p, technologiesUsed: p.technologiesUsed.filter((_: string, tIdx: number) => tIdx !== techIndex) }
                                        : p
                                    )
                                  }
                                }))
                              }}
                              className="ml-1 hover:text-red-600"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                        <Input
                          placeholder="Add technology"
                          className="w-32"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              const value = (e.target as HTMLInputElement).value.trim()
                              if (value) {
                                setCvData((prev: any) => ({
                                  ...prev,
                                  projects: {
                                    ...prev.projects,
                                    projectItems: prev.projects.projectItems.map((p: any, idx: number) =>
                                      idx === index 
                                        ? { ...p, technologiesUsed: [...(p.technologiesUsed || []), value] }
                                        : p
                                    )
                                  }
                                }))
                                ;(e.target as HTMLInputElement).value = ''
                              }
                            }
                          }}
                        />
                      </div>
                    </div>

                    {/* Project Links & Media */}
                    <div className="space-y-3 border-t pt-4">
                      <label className="text-sm font-medium text-gray-700">Project Links & Media</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {/* GitHub URL */}
                        <div className="space-y-1">
                          <label className="text-xs text-gray-500">GitHub Repository</label>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">🔗</span>
                            <Input
                              value={project.githubUrl || ''}
                              onChange={(e) => {
                                setCvData((prev: any) => ({
                                  ...prev,
                                  projects: {
                                    ...prev.projects,
                                    projectItems: prev.projects.projectItems.map((p: any, idx: number) =>
                                      idx === index ? { ...p, githubUrl: e.target.value } : p
                                    )
                                  }
                                }))
                              }}
                              placeholder="https://github.com/username/repo"
                              className="text-sm"
                            />
                          </div>
                        </div>

                        {/* Live Demo URL */}
                        <div className="space-y-1">
                          <label className="text-xs text-gray-500">Live Demo</label>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">🚀</span>
                            <Input
                              value={project.demoUrl || ''}
                              onChange={(e) => {
                                setCvData((prev: any) => ({
                                  ...prev,
                                  projects: {
                                    ...prev.projects,
                                    projectItems: prev.projects.projectItems.map((p: any, idx: number) =>
                                      idx === index ? { ...p, demoUrl: e.target.value } : p
                                    )
                                  }
                                }))
                              }}
                              placeholder="https://your-project.com"
                              className="text-sm"
                            />
                          </div>
                        </div>

                        {/* Project Image */}
                        <div className="space-y-1">
                          <label className="text-xs text-gray-500">Project Image</label>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">📷</span>
                            <Input
                              value={project.imageUrl || ''}
                              onChange={(e) => {
                                setCvData((prev: any) => ({
                                  ...prev,
                                  projects: {
                                    ...prev.projects,
                                    projectItems: prev.projects.projectItems.map((p: any, idx: number) =>
                                      idx === index ? { ...p, imageUrl: e.target.value } : p
                                    )
                                  }
                                }))
                              }}
                              placeholder="https://imgur.com/your-image.png"
                              className="text-sm"
                            />
                          </div>
                        </div>

                        {/* Video Demo */}
                        <div className="space-y-1">
                          <label className="text-xs text-gray-500">Video Demo</label>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">🎬</span>
                            <Input
                              value={project.videoUrl || ''}
                              onChange={(e) => {
                                setCvData((prev: any) => ({
                                  ...prev,
                                  projects: {
                                    ...prev.projects,
                                    projectItems: prev.projects.projectItems.map((p: any, idx: number) =>
                                      idx === index ? { ...p, videoUrl: e.target.value } : p
                                    )
                                  }
                                }))
                              }}
                              placeholder="https://youtube.com/watch?v=..."
                              className="text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Link Preview */}
                      {(project.githubUrl || project.demoUrl || project.imageUrl || project.videoUrl) && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-xs font-medium text-gray-600 mb-2">Link Preview:</div>
                          <div className="flex flex-wrap gap-2">
                            {project.githubUrl && (
                              <Badge variant="outline" className="text-xs">
                                🔗 GitHub
                              </Badge>
                            )}
                            {project.demoUrl && (
                              <Badge variant="outline" className="text-xs">
                                🚀 Live Demo
                              </Badge>
                            )}
                            {project.imageUrl && (
                              <Badge variant="outline" className="text-xs">
                                📷 Image
                              </Badge>
                            )}
                            {project.videoUrl && (
                              <Badge variant="outline" className="text-xs">
                                🎬 Video
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {(!cvData.projects?.projectItems || cvData.projects.projectItems.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                <p>No projects added yet. Click "Add Project" to get started.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Certifications Section */}
      <Card className={`${sectionColors.certifications.border} border-l-4`}>
        <CardHeader className={sectionColors.certifications.bg}>
          <div className="flex items-center justify-between">
            <CardTitle className={`flex items-center gap-2 ${sectionColors.certifications.accent}`}>
              <span className="text-xl">{sectionColors.certifications.icon}</span>
              Certifications & Courses
            </CardTitle>
            <Button
              onClick={() => {
                const newCert = {
                  title: "",
                  issuingOrganization: "",
                  issueDate: "",
                  expirationDate: ""
                }
                setCvData((prev: any) => ({
                  ...prev,
                  certifications: {
                    ...prev.certifications,
                    certificationItems: [...(prev.certifications?.certificationItems || []), newCert]
                  }
                }))
              }}
              size="sm"
              variant="outline"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Certification
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cvData.certifications?.certificationItems?.map((cert: any, index: number) => (
              <Card key={index} className={`border-l-4 ${sectionColors.certifications.border} bg-gradient-to-r from-emerald-50 to-white`}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Certification {index + 1}</span>
                      <Button
                        onClick={() => {
                          setCvData((prev: any) => ({
                            ...prev,
                            certifications: {
                              ...prev.certifications,
                              certificationItems: prev.certifications.certificationItems.filter((_: any, idx: number) => idx !== index)
                            }
                          }))
                        }}
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input
                        value={cert.title || ''}
                        onChange={(e) => {
                          setCvData((prev: any) => ({
                            ...prev,
                            certifications: {
                              ...prev.certifications,
                              certificationItems: prev.certifications.certificationItems.map((c: any, idx: number) =>
                                idx === index ? { ...c, title: e.target.value } : c
                              )
                            }
                          }))
                        }}
                        placeholder="Certification Title"
                      />
                      <Input
                        value={cert.issuingOrganization || ''}
                        onChange={(e) => {
                          setCvData((prev: any) => ({
                            ...prev,
                            certifications: {
                              ...prev.certifications,
                              certificationItems: prev.certifications.certificationItems.map((c: any, idx: number) =>
                                idx === index ? { ...c, issuingOrganization: e.target.value } : c
                              )
                            }
                          }))
                        }}
                        placeholder="Issuing Organization"
                      />
                      <Input
                        value={cert.issueDate || ''}
                        onChange={(e) => {
                          setCvData((prev: any) => ({
                            ...prev,
                            certifications: {
                              ...prev.certifications,
                              certificationItems: prev.certifications.certificationItems.map((c: any, idx: number) =>
                                idx === index ? { ...c, issueDate: e.target.value } : c
                              )
                            }
                          }))
                        }}
                        placeholder="Issue Date"
                      />
                      <Input
                        value={cert.expirationDate || ''}
                        onChange={(e) => {
                          setCvData((prev: any) => ({
                            ...prev,
                            certifications: {
                              ...prev.certifications,
                              certificationItems: prev.certifications.certificationItems.map((c: any, idx: number) =>
                                idx === index ? { ...c, expirationDate: e.target.value } : c
                              )
                            }
                          }))
                        }}
                        placeholder="Expiration Date (if any)"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {(!cvData.certifications?.certificationItems || cvData.certifications.certificationItems.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                <p>No certifications added yet. Click "Add Certification" to get started.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Hobbies Section */}
      {cvData.hobbies && cvData.hobbies.hobbies && cvData.hobbies.hobbies.length > 0 && (
        <Card className={`border-l-4 border-l-pink-500 hover:shadow-lg transition-shadow`}>
          <CardHeader className="bg-pink-50">
            <div className="flex items-center justify-between">
              <CardTitle className={`flex items-center gap-2 text-pink-700`}>
                <span className="text-xl">🎯</span>
                {cvData.hobbies.sectionTitle || "Hobbies & Interests"}
              </CardTitle>
              <Button
                onClick={() => {
                  setCvData((prev: any) => ({
                    ...prev,
                    hobbies: undefined
                  }))
                }}
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {cvData.hobbies.hobbies.map((hobby: string, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={hobby}
                    onChange={(e) => {
                      const updatedHobbies = [...cvData.hobbies.hobbies]
                      updatedHobbies[index] = e.target.value
                      setCvData((prev: any) => ({
                        ...prev,
                        hobbies: {
                          ...prev.hobbies,
                          hobbies: updatedHobbies
                        }
                      }))
                    }}
                    placeholder="Enter hobby or interest"
                    className="flex-1"
                  />
                  <Button
                    onClick={() => {
                      const updatedHobbies = cvData.hobbies.hobbies.filter((_: any, i: number) => i !== index)
                      setCvData((prev: any) => ({
                        ...prev,
                        hobbies: {
                          ...prev.hobbies,
                          hobbies: updatedHobbies.length > 0 ? updatedHobbies : undefined
                        }
                      }))
                      if (updatedHobbies.length === 0) {
                        setCvData((prev: any) => ({
                          ...prev,
                          hobbies: undefined
                        }))
                      }
                    }}
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                onClick={() => {
                  setCvData((prev: any) => ({
                    ...prev,
                    hobbies: {
                      ...prev.hobbies,
                      hobbies: [...prev.hobbies.hobbies, ""]
                    }
                  }))
                }}
                variant="outline"
                size="sm"
                className="w-full mt-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Hobby
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Languages Section */}
      {cvData.languages && cvData.languages.languageItems && cvData.languages.languageItems.length > 0 && (
        <Card className={`border-l-4 border-l-teal-500 hover:shadow-lg transition-shadow`}>
          <CardHeader className="bg-teal-50">
            <div className="flex items-center justify-between">
              <CardTitle className={`flex items-center gap-2 text-teal-700`}>
                <span className="text-xl">🌐</span>
                {cvData.languages.sectionTitle || "Languages"}
              </CardTitle>
              <Button
                onClick={() => {
                  setCvData((prev: any) => ({
                    ...prev,
                    languages: undefined
                  }))
                }}
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {cvData.languages.languageItems.map((lang: any, index: number) => (
                <Card key={index} className="border-l-4 border-l-teal-400 bg-gradient-to-r from-teal-50 to-white">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Input
                          value={lang.language || ''}
                          onChange={(e) => {
                            setCvData((prev: any) => ({
                              ...prev,
                              languages: {
                                ...prev.languages,
                                languageItems: prev.languages.languageItems.map((l: any, idx: number) =>
                                  idx === index ? { ...l, language: e.target.value } : l
                                )
                              }
                            }))
                          }}
                          placeholder="Language"
                        />
                        <Input
                          value={lang.proficiency || ''}
                          onChange={(e) => {
                            setCvData((prev: any) => ({
                              ...prev,
                              languages: {
                                ...prev.languages,
                                languageItems: prev.languages.languageItems.map((l: any, idx: number) =>
                                  idx === index ? { ...l, proficiency: e.target.value } : l
                                )
                              }
                            }))
                          }}
                          placeholder="Proficiency (e.g., Native, Fluent, Professional)"
                        />
                        <Input
                          value={lang.certification || ''}
                          onChange={(e) => {
                            setCvData((prev: any) => ({
                              ...prev,
                              languages: {
                                ...prev.languages,
                                languageItems: prev.languages.languageItems.map((l: any, idx: number) =>
                                  idx === index ? { ...l, certification: e.target.value } : l
                                )
                              }
                            }))
                          }}
                          placeholder="Certification (optional)"
                        />
                      </div>
                      <Button
                        onClick={() => {
                          setCvData((prev: any) => ({
                            ...prev,
                            languages: {
                              ...prev.languages,
                              languageItems: prev.languages.languageItems.filter((_: any, idx: number) => idx !== index)
                            }
                          }))
                        }}
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700 ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button
                onClick={() => {
                  setCvData((prev: any) => ({
                    ...prev,
                    languages: {
                      ...prev.languages,
                      languageItems: [...prev.languages.languageItems, { language: "", proficiency: "" }]
                    }
                  }))
                }}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Language
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Volunteer Experience Section */}
      {cvData.volunteer && cvData.volunteer.volunteerItems && cvData.volunteer.volunteerItems.length > 0 && (
        <Card className={`border-l-4 border-l-rose-500 hover:shadow-lg transition-shadow`}>
          <CardHeader className="bg-rose-50">
            <div className="flex items-center justify-between">
              <CardTitle className={`flex items-center gap-2 text-rose-700`}>
                <span className="text-xl">🤝</span>
                {cvData.volunteer.sectionTitle || "Volunteer Experience"}
              </CardTitle>
              <Button
                onClick={() => {
                  setCvData((prev: any) => ({
                    ...prev,
                    volunteer: undefined
                  }))
                }}
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {cvData.volunteer.volunteerItems.map((item: any, index: number) => (
                <Card key={index} className="border-l-4 border-l-rose-400 bg-gradient-to-r from-rose-50 to-white">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Volunteer Role {index + 1}</span>
                        <Button
                          onClick={() => {
                            setCvData((prev: any) => ({
                              ...prev,
                              volunteer: {
                                ...prev.volunteer,
                                volunteerItems: prev.volunteer.volunteerItems.filter((_: any, idx: number) => idx !== index)
                              }
                            }))
                          }}
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input
                          value={item.role || ''}
                          onChange={(e) => {
                            setCvData((prev: any) => ({
                              ...prev,
                              volunteer: {
                                ...prev.volunteer,
                                volunteerItems: prev.volunteer.volunteerItems.map((v: any, idx: number) =>
                                  idx === index ? { ...v, role: e.target.value } : v
                                )
                              }
                            }))
                          }}
                          placeholder="Role/Position"
                        />
                        <Input
                          value={item.organization || ''}
                          onChange={(e) => {
                            setCvData((prev: any) => ({
                              ...prev,
                              volunteer: {
                                ...prev.volunteer,
                                volunteerItems: prev.volunteer.volunteerItems.map((v: any, idx: number) =>
                                  idx === index ? { ...v, organization: e.target.value } : v
                                )
                              }
                            }))
                          }}
                          placeholder="Organization"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Input
                          value={item.dateRange?.startDate || ''}
                          onChange={(e) => {
                            setCvData((prev: any) => ({
                              ...prev,
                              volunteer: {
                                ...prev.volunteer,
                                volunteerItems: prev.volunteer.volunteerItems.map((v: any, idx: number) =>
                                  idx === index ? { ...v, dateRange: { ...v.dateRange, startDate: e.target.value } } : v
                                )
                              }
                            }))
                          }}
                          placeholder="Start Date"
                        />
                        <Input
                          value={item.dateRange?.endDate || ''}
                          onChange={(e) => {
                            setCvData((prev: any) => ({
                              ...prev,
                              volunteer: {
                                ...prev.volunteer,
                                volunteerItems: prev.volunteer.volunteerItems.map((v: any, idx: number) =>
                                  idx === index ? { ...v, dateRange: { ...v.dateRange, endDate: e.target.value } } : v
                                )
                              }
                            }))
                          }}
                          placeholder="End Date"
                        />
                        <Input
                          value={item.commitment || ''}
                          onChange={(e) => {
                            setCvData((prev: any) => ({
                              ...prev,
                              volunteer: {
                                ...prev.volunteer,
                                volunteerItems: prev.volunteer.volunteerItems.map((v: any, idx: number) =>
                                  idx === index ? { ...v, commitment: e.target.value } : v
                                )
                              }
                            }))
                          }}
                          placeholder="Hours/Week (optional)"
                        />
                      </div>
                      <Textarea
                        value={item.description || ''}
                        onChange={(e) => {
                          setCvData((prev: any) => ({
                            ...prev,
                            volunteer: {
                              ...prev.volunteer,
                              volunteerItems: prev.volunteer.volunteerItems.map((v: any, idx: number) =>
                                idx === index ? { ...v, description: e.target.value } : v
                              )
                            }
                          }))
                        }}
                        placeholder="Description of volunteer work and impact"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button
                onClick={() => {
                  setCvData((prev: any) => ({
                    ...prev,
                    volunteer: {
                      ...prev.volunteer,
                      volunteerItems: [...prev.volunteer.volunteerItems, { role: "", organization: "", dateRange: { startDate: "", endDate: "" } }]
                    }
                  }))
                }}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Volunteer Experience
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Achievements Section */}
      {cvData.achievements && cvData.achievements.achievements && cvData.achievements.achievements.length > 0 && (
        <Card className={`border-l-4 border-l-amber-500 hover:shadow-lg transition-shadow`}>
          <CardHeader className="bg-amber-50">
            <div className="flex items-center justify-between">
              <CardTitle className={`flex items-center gap-2 text-amber-700`}>
                <span className="text-xl">🏅</span>
                {cvData.achievements.sectionTitle || "Achievements"}
              </CardTitle>
              <Button
                onClick={() => {
                  setCvData((prev: any) => ({
                    ...prev,
                    achievements: undefined
                  }))
                }}
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {cvData.achievements.achievements.map((achievement: any, index: number) => (
                <Card key={index} className="border-l-4 border-l-amber-400 bg-gradient-to-r from-amber-50 to-white">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <Input
                            value={achievement.value || ''}
                            onChange={(e) => {
                              setCvData((prev: any) => ({
                                ...prev,
                                achievements: {
                                  ...prev.achievements,
                                  achievements: prev.achievements.achievements.map((a: any, idx: number) =>
                                    idx === index ? { ...a, value: e.target.value } : a
                                  )
                                }
                              }))
                            }}
                            placeholder="Achievement Value (e.g., 95%, #1, $1M)"
                          />
                          <Input
                            value={achievement.label || ''}
                            onChange={(e) => {
                              setCvData((prev: any) => ({
                                ...prev,
                                achievements: {
                                  ...prev.achievements,
                                  achievements: prev.achievements.achievements.map((a: any, idx: number) =>
                                    idx === index ? { ...a, label: e.target.value } : a
                                  )
                                }
                              }))
                            }}
                            placeholder="Achievement Label"
                          />
                        </div>
                        <Input
                          value={achievement.contextOrDetail || ''}
                          onChange={(e) => {
                            setCvData((prev: any) => ({
                              ...prev,
                              achievements: {
                                ...prev.achievements,
                                achievements: prev.achievements.achievements.map((a: any, idx: number) =>
                                  idx === index ? { ...a, contextOrDetail: e.target.value } : a
                                )
                              }
                            }))
                          }}
                          placeholder="Context or Additional Details"
                        />
                      </div>
                      <Button
                        onClick={() => {
                          setCvData((prev: any) => ({
                            ...prev,
                            achievements: {
                              ...prev.achievements,
                              achievements: prev.achievements.achievements.filter((_: any, idx: number) => idx !== index)
                            }
                          }))
                        }}
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button
                onClick={() => {
                  setCvData((prev: any) => ({
                    ...prev,
                    achievements: {
                      ...prev.achievements,
                      achievements: [...prev.achievements.achievements, { value: "", label: "", contextOrDetail: "" }]
                    }
                  }))
                }}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Achievement
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Publications Section */}
      {cvData.publications && cvData.publications.publications && cvData.publications.publications.length > 0 && (
        <Card className={`border-l-4 border-l-violet-500 hover:shadow-lg transition-shadow`}>
          <CardHeader className="bg-violet-50">
            <div className="flex items-center justify-between">
              <CardTitle className={`flex items-center gap-2 text-violet-700`}>
                <span className="text-xl">📚</span>
                {cvData.publications.sectionTitle || "Publications & Research"}
              </CardTitle>
              <Button
                onClick={() => {
                  setCvData((prev: any) => ({
                    ...prev,
                    publications: undefined
                  }))
                }}
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {cvData.publications.publications.map((pub: any, index: number) => (
                <Card key={index} className="border-l-4 border-l-violet-400 bg-gradient-to-r from-violet-50 to-white">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Publication {index + 1}</span>
                        <Button
                          onClick={() => {
                            setCvData((prev: any) => ({
                              ...prev,
                              publications: {
                                ...prev.publications,
                                publications: prev.publications.publications.filter((_: any, idx: number) => idx !== index)
                              }
                            }))
                          }}
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <Input
                        value={pub.title || ''}
                        onChange={(e) => {
                          setCvData((prev: any) => ({
                            ...prev,
                            publications: {
                              ...prev.publications,
                              publications: prev.publications.publications.map((p: any, idx: number) =>
                                idx === index ? { ...p, title: e.target.value } : p
                              )
                            }
                          }))
                        }}
                        placeholder="Publication Title"
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input
                          value={pub.authors?.join(', ') || ''}
                          onChange={(e) => {
                            setCvData((prev: any) => ({
                              ...prev,
                              publications: {
                                ...prev.publications,
                                publications: prev.publications.publications.map((p: any, idx: number) =>
                                  idx === index ? { ...p, authors: e.target.value.split(', ').filter(a => a.trim()) } : p
                                )
                              }
                            }))
                          }}
                          placeholder="Authors (comma-separated)"
                        />
                        <Input
                          value={pub.publicationDate || ''}
                          onChange={(e) => {
                            setCvData((prev: any) => ({
                              ...prev,
                              publications: {
                                ...prev.publications,
                                publications: prev.publications.publications.map((p: any, idx: number) =>
                                  idx === index ? { ...p, publicationDate: e.target.value } : p
                                )
                              }
                            }))
                          }}
                          placeholder="Publication Date"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input
                          value={pub.journalName || ''}
                          onChange={(e) => {
                            setCvData((prev: any) => ({
                              ...prev,
                              publications: {
                                ...prev.publications,
                                publications: prev.publications.publications.map((p: any, idx: number) =>
                                  idx === index ? { ...p, journalName: e.target.value } : p
                                )
                              }
                            }))
                          }}
                          placeholder="Journal/Conference Name"
                        />
                        <Input
                          value={pub.doi || ''}
                          onChange={(e) => {
                            setCvData((prev: any) => ({
                              ...prev,
                              publications: {
                                ...prev.publications,
                                publications: prev.publications.publications.map((p: any, idx: number) =>
                                  idx === index ? { ...p, doi: e.target.value } : p
                                )
                              }
                            }))
                          }}
                          placeholder="DOI (optional)"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button
                onClick={() => {
                  setCvData((prev: any) => ({
                    ...prev,
                    publications: {
                      ...prev.publications,
                      publications: [...prev.publications.publications, { title: "", authors: [], publicationDate: "" }]
                    }
                  }))
                }}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Publication
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Speaking Engagements Section */}
      {cvData.speaking && cvData.speaking.speakingEngagements && cvData.speaking.speakingEngagements.length > 0 && (
        <Card className={`border-l-4 border-l-fuchsia-500 hover:shadow-lg transition-shadow`}>
          <CardHeader className="bg-fuchsia-50">
            <div className="flex items-center justify-between">
              <CardTitle className={`flex items-center gap-2 text-fuchsia-700`}>
                <span className="text-xl">🎤</span>
                {cvData.speaking.sectionTitle || "Speaking Engagements"}
              </CardTitle>
              <Button
                onClick={() => {
                  setCvData((prev: any) => ({
                    ...prev,
                    speaking: undefined
                  }))
                }}
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {cvData.speaking.speakingEngagements.map((event: any, index: number) => (
                <Card key={index} className="border-l-4 border-l-fuchsia-400 bg-gradient-to-r from-fuchsia-50 to-white">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Speaking Event {index + 1}</span>
                        <Button
                          onClick={() => {
                            setCvData((prev: any) => ({
                              ...prev,
                              speaking: {
                                ...prev.speaking,
                                speakingEngagements: prev.speaking.speakingEngagements.filter((_: any, idx: number) => idx !== index)
                              }
                            }))
                          }}
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input
                          value={event.eventName || ''}
                          onChange={(e) => {
                            setCvData((prev: any) => ({
                              ...prev,
                              speaking: {
                                ...prev.speaking,
                                speakingEngagements: prev.speaking.speakingEngagements.map((s: any, idx: number) =>
                                  idx === index ? { ...s, eventName: e.target.value } : s
                                )
                              }
                            }))
                          }}
                          placeholder="Event Name"
                        />
                        <Input
                          value={event.topic || ''}
                          onChange={(e) => {
                            setCvData((prev: any) => ({
                              ...prev,
                              speaking: {
                                ...prev.speaking,
                                speakingEngagements: prev.speaking.speakingEngagements.map((s: any, idx: number) =>
                                  idx === index ? { ...s, topic: e.target.value } : s
                                )
                              }
                            }))
                          }}
                          placeholder="Topic/Presentation Title"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Input
                          value={event.date || ''}
                          onChange={(e) => {
                            setCvData((prev: any) => ({
                              ...prev,
                              speaking: {
                                ...prev.speaking,
                                speakingEngagements: prev.speaking.speakingEngagements.map((s: any, idx: number) =>
                                  idx === index ? { ...s, date: e.target.value } : s
                                )
                              }
                            }))
                          }}
                          placeholder="Date"
                        />
                        <Input
                          value={event.venue || ''}
                          onChange={(e) => {
                            setCvData((prev: any) => ({
                              ...prev,
                              speaking: {
                                ...prev.speaking,
                                speakingEngagements: prev.speaking.speakingEngagements.map((s: any, idx: number) =>
                                  idx === index ? { ...s, venue: e.target.value } : s
                                )
                              }
                            }))
                          }}
                          placeholder="Venue/Location"
                        />
                        <Input
                          value={event.role || ''}
                          onChange={(e) => {
                            setCvData((prev: any) => ({
                              ...prev,
                              speaking: {
                                ...prev.speaking,
                                speakingEngagements: prev.speaking.speakingEngagements.map((s: any, idx: number) =>
                                  idx === index ? { ...s, role: e.target.value } : s
                                )
                              }
                            }))
                          }}
                          placeholder="Role (e.g., Keynote Speaker)"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button
                onClick={() => {
                  setCvData((prev: any) => ({
                    ...prev,
                    speaking: {
                      ...prev.speaking,
                      speakingEngagements: [...prev.speaking.speakingEngagements, { eventName: "", topic: "", date: "", venue: "" }]
                    }
                  }))
                }}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Speaking Engagement
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Professional Memberships Section */}
      {cvData.memberships && cvData.memberships.memberships && cvData.memberships.memberships.length > 0 && (
        <Card className={`border-l-4 border-l-lime-500 hover:shadow-lg transition-shadow`}>
          <CardHeader className="bg-lime-50">
            <div className="flex items-center justify-between">
              <CardTitle className={`flex items-center gap-2 text-lime-700`}>
                <span className="text-xl">🏛️</span>
                {cvData.memberships.sectionTitle || "Professional Memberships"}
              </CardTitle>
              <Button
                onClick={() => {
                  setCvData((prev: any) => ({
                    ...prev,
                    memberships: undefined
                  }))
                }}
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {cvData.memberships.memberships.map((membership: any, index: number) => (
                <Card key={index} className="border-l-4 border-l-lime-400 bg-gradient-to-r from-lime-50 to-white">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <Input
                            value={membership.organization || ''}
                            onChange={(e) => {
                              setCvData((prev: any) => ({
                                ...prev,
                                memberships: {
                                  ...prev.memberships,
                                  memberships: prev.memberships.memberships.map((m: any, idx: number) =>
                                    idx === index ? { ...m, organization: e.target.value } : m
                                  )
                                }
                              }))
                            }}
                            placeholder="Organization Name"
                          />
                          <Input
                            value={membership.membershipType || ''}
                            onChange={(e) => {
                              setCvData((prev: any) => ({
                                ...prev,
                                memberships: {
                                  ...prev.memberships,
                                  memberships: prev.memberships.memberships.map((m: any, idx: number) =>
                                    idx === index ? { ...m, membershipType: e.target.value } : m
                                  )
                                }
                              }))
                            }}
                            placeholder="Membership Type (e.g., Fellow, Member)"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <Input
                            value={membership.dateRange?.startDate || ''}
                            onChange={(e) => {
                              setCvData((prev: any) => ({
                                ...prev,
                                memberships: {
                                  ...prev.memberships,
                                  memberships: prev.memberships.memberships.map((m: any, idx: number) =>
                                    idx === index ? { ...m, dateRange: { ...m.dateRange, startDate: e.target.value } } : m
                                  )
                                }
                              }))
                            }}
                            placeholder="Start Date"
                          />
                          <Input
                            value={membership.dateRange?.endDate || membership.dateRange?.isCurrent ? 'Present' : ''}
                            onChange={(e) => {
                              setCvData((prev: any) => ({
                                ...prev,
                                memberships: {
                                  ...prev.memberships,
                                  memberships: prev.memberships.memberships.map((m: any, idx: number) =>
                                    idx === index ? { ...m, dateRange: { ...m.dateRange, endDate: e.target.value, isCurrent: e.target.value.toLowerCase() === 'present' } } : m
                                  )
                                }
                              }))
                            }}
                            placeholder="End Date (or 'Present')"
                          />
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          setCvData((prev: any) => ({
                            ...prev,
                            memberships: {
                              ...prev.memberships,
                              memberships: prev.memberships.memberships.filter((_: any, idx: number) => idx !== index)
                            }
                          }))
                        }}
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button
                onClick={() => {
                  setCvData((prev: any) => ({
                    ...prev,
                    memberships: {
                      ...prev.memberships,
                      memberships: [...prev.memberships.memberships, { organization: "", membershipType: "", dateRange: { startDate: "", endDate: "", isCurrent: true } }]
                    }
                  }))
                }}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Membership
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Patents Section */}
      {cvData.patents && cvData.patents.patents && cvData.patents.patents.length > 0 && (
        <Card className={`border-l-4 border-l-slate-500 hover:shadow-lg transition-shadow`}>
          <CardHeader className="bg-slate-50">
            <div className="flex items-center justify-between">
              <CardTitle className={`flex items-center gap-2 text-slate-700`}>
                <span className="text-xl">💡</span>
                {cvData.patents.sectionTitle || "Patents"}
              </CardTitle>
              <Button
                onClick={() => {
                  setCvData((prev: any) => ({
                    ...prev,
                    patents: undefined
                  }))
                }}
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {cvData.patents.patents.map((patent: any, index: number) => (
                <Card key={index} className="border-l-4 border-l-slate-400 bg-gradient-to-r from-slate-50 to-white">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Patent {index + 1}</span>
                        <Button
                          onClick={() => {
                            setCvData((prev: any) => ({
                              ...prev,
                              patents: {
                                ...prev.patents,
                                patents: prev.patents.patents.filter((_: any, idx: number) => idx !== index)
                              }
                            }))
                          }}
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <Input
                        value={patent.title || ''}
                        onChange={(e) => {
                          setCvData((prev: any) => ({
                            ...prev,
                            patents: {
                              ...prev.patents,
                              patents: prev.patents.patents.map((p: any, idx: number) =>
                                idx === index ? { ...p, title: e.target.value } : p
                              )
                            }
                          }))
                        }}
                        placeholder="Patent Title"
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input
                          value={patent.patentNumber || ''}
                          onChange={(e) => {
                            setCvData((prev: any) => ({
                              ...prev,
                              patents: {
                                ...prev.patents,
                                patents: prev.patents.patents.map((p: any, idx: number) =>
                                  idx === index ? { ...p, patentNumber: e.target.value } : p
                                )
                              }
                            }))
                          }}
                          placeholder="Patent Number"
                        />
                        <Input
                          value={patent.status || ''}
                          onChange={(e) => {
                            setCvData((prev: any) => ({
                              ...prev,
                              patents: {
                                ...prev.patents,
                                patents: prev.patents.patents.map((p: any, idx: number) =>
                                  idx === index ? { ...p, status: e.target.value } : p
                                )
                              }
                            }))
                          }}
                          placeholder="Status (e.g., Granted, Pending)"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input
                          value={patent.filingDate || ''}
                          onChange={(e) => {
                            setCvData((prev: any) => ({
                              ...prev,
                              patents: {
                                ...prev.patents,
                                patents: prev.patents.patents.map((p: any, idx: number) =>
                                  idx === index ? { ...p, filingDate: e.target.value } : p
                                )
                              }
                            }))
                          }}
                          placeholder="Filing Date"
                        />
                        <Input
                          value={patent.grantDate || ''}
                          onChange={(e) => {
                            setCvData((prev: any) => ({
                              ...prev,
                              patents: {
                                ...prev.patents,
                                patents: prev.patents.patents.map((p: any, idx: number) =>
                                  idx === index ? { ...p, grantDate: e.target.value } : p
                                )
                              }
                            }))
                          }}
                          placeholder="Grant Date (if granted)"
                        />
                      </div>
                      <Textarea
                        value={patent.description || ''}
                        onChange={(e) => {
                          setCvData((prev: any) => ({
                            ...prev,
                            patents: {
                              ...prev.patents,
                              patents: prev.patents.patents.map((p: any, idx: number) =>
                                idx === index ? { ...p, description: e.target.value } : p
                              )
                            }
                          }))
                        }}
                        placeholder="Brief description of the patent"
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button
                onClick={() => {
                  setCvData((prev: any) => ({
                    ...prev,
                    patents: {
                      ...prev.patents,
                      patents: [...prev.patents.patents, { title: "", patentNumber: "", status: "", filingDate: "" }]
                    }
                  }))
                }}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Patent
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Section Feature */}
      <Card className={`${sectionColors.additional.border} border-l-4 border-dashed border-2 border-gray-300`}>
        <CardHeader className={sectionColors.additional.bg}>
          <CardTitle className={`flex items-center justify-center gap-2 ${sectionColors.additional.accent}`}>
            <span className="text-xl">{sectionColors.additional.icon}</span>
            Add Missing Sections
          </CardTitle>
          <p className="text-sm text-gray-500 text-center">
            Add any sections that weren't detected in your CV or that you want to include manually
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {/* Languages Section */}
            {(!cvData.languages?.languageItems || cvData.languages.languageItems.length === 0) && (
              <Button
                onClick={() => {
                  setCvData((prev: any) => ({
                    ...prev,
                    languages: {
                      sectionTitle: "Languages",
                      languageItems: [{ language: "", proficiency: "Proficient" }]
                    }
                  }))
                }}
                variant="outline"
                size="sm"
                className="h-auto p-3 flex flex-col items-center"
              >
                <Plus className="w-4 h-4 mb-1" />
                Languages
              </Button>
            )}

            {/* Volunteer Section */}
            {(!cvData.volunteer?.volunteerItems || cvData.volunteer.volunteerItems.length === 0) && (
              <Button
                onClick={() => {
                  setCvData((prev: any) => ({
                    ...prev,
                    volunteer: {
                      sectionTitle: "Volunteer Experience",
                      volunteerItems: [{ 
                        role: "", 
                        organization: "", 
                        dateRange: { startDate: "", endDate: "", isCurrent: false },
                        responsibilities: [""]
                      }]
                    }
                  }))
                }}
                variant="outline"
                size="sm"
                className="h-auto p-3 flex flex-col items-center"
              >
                <Plus className="w-4 h-4 mb-1" />
                Volunteer
              </Button>
            )}

            {/* Achievements Section */}
            {(!cvData.achievements?.achievements || cvData.achievements.achievements.length === 0) && (
              <Button
                onClick={() => {
                  setCvData((prev: any) => ({
                    ...prev,
                    achievements: {
                      sectionTitle: "Achievements",
                      achievements: [{ value: "", label: "", contextOrDetail: "" }]
                    }
                  }))
                }}
                variant="outline"
                size="sm"
                className="h-auto p-3 flex flex-col items-center"
              >
                <Plus className="w-4 h-4 mb-1" />
                Achievements
              </Button>
            )}

            {/* Publications Section */}
            {!cvData.publications && (
              <Button
                onClick={() => {
                  setCvData((prev: any) => ({
                    ...prev,
                    publications: {
                      sectionTitle: "Publications",
                      publicationItems: [{ 
                        title: "", 
                        authors: [""], 
                        journal: "", 
                        publicationDate: "",
                        doi: "",
                        abstractSummary: ""
                      }]
                    }
                  }))
                }}
                variant="outline"
                size="sm"
                className="h-auto p-3 flex flex-col items-center"
              >
                <Plus className="w-4 h-4 mb-1" />
                Publications
              </Button>
            )}

            {/* Speaking Section */}
            {(!cvData.speaking?.speakingEngagements || cvData.speaking.speakingEngagements.length === 0) && (
              <Button
                onClick={() => {
                  setCvData((prev: any) => ({
                    ...prev,
                    speaking: {
                      sectionTitle: "Speaking Engagements",
                      speakingEngagements: [{ 
                        eventName: "", 
                        topic: "", 
                        date: "", 
                        venue: "",
                        role: ""
                      }]
                    }
                  }))
                }}
                variant="outline"
                size="sm"
                className="h-auto p-3 flex flex-col items-center"
              >
                <Plus className="w-4 h-4 mb-1" />
                Speaking
              </Button>
            )}

            {/* Hobbies Section */}
            {(!cvData.hobbies?.hobbies || cvData.hobbies.hobbies.length === 0) && (
              <Button
                onClick={() => {
                  setCvData((prev: any) => ({
                    ...prev,
                    hobbies: {
                      sectionTitle: "Hobbies & Interests",
                      hobbies: [""]
                    }
                  }))
                }}
                variant="outline"
                size="sm"
                className="h-auto p-3 flex flex-col items-center"
              >
                <Plus className="w-4 h-4 mb-1" />
                Hobbies
              </Button>
            )}

            {/* Memberships Section */}
            {(!cvData.memberships?.memberships || cvData.memberships.memberships.length === 0) && (
              <Button
                onClick={() => {
                  setCvData((prev: any) => ({
                    ...prev,
                    memberships: {
                      sectionTitle: "Professional Memberships",
                      memberships: [{ 
                        organization: "", 
                        membershipType: "", 
                        dateRange: { startDate: "", endDate: "", isCurrent: true }
                      }]
                    }
                  }))
                }}
                variant="outline"
                size="sm"
                className="h-auto p-3 flex flex-col items-center"
              >
                <Plus className="w-4 h-4 mb-1" />
                Memberships
              </Button>
            )}

            {/* Patents Section */}
            {!cvData.patents && (
              <Button
                onClick={() => {
                  setCvData((prev: any) => ({
                    ...prev,
                    patents: {
                      sectionTitle: "Patents",
                      patentItems: [{ 
                        title: "", 
                        patentNumber: "", 
                        filingDate: "", 
                        grantDate: "",
                        inventors: [""],
                        description: ""
                      }]
                    }
                  }))
                }}
                variant="outline"
                size="sm"
                className="h-auto p-3 flex flex-col items-center"
              >
                <Plus className="w-4 h-4 mb-1" />
                Patents
              </Button>
            )}
          </div>
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-400">
              Missing sections will be automatically detected based on your CV content
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Generate Website Button */}
      <motion.div 
        id="portfolio-generation-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-center py-8 scroll-mt-24"
      >
        <Card className="p-8 bg-gradient-to-br from-emerald-50 via-sky-50 to-blue-50 border-2 border-emerald-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Ready to Generate Your Portfolio?</h2>
          <p className="text-gray-600 mb-6">
            Your CV data has been saved. Click below to create your stunning portfolio website.
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 hover:from-emerald-600 hover:via-sky-500 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            disabled={!currentJobId || isGeneratingPortfolio}
            onClick={handleGeneratePortfolio}
          >
            {isGeneratingPortfolio ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating Portfolio...
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5 mr-2" />
                Generate Portfolio Website
              </>
            )}
          </Button>
        </Card>
      </motion.div>
    </div>
  )
}