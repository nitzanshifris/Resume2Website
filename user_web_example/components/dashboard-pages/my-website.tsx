"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { 
  Edit3, 
  Share2, 
  ExternalLink, 
  Download, 
  Eye, 
  Users, 
  Clock,
  TrendingUp,
  Zap,
  Monitor,
  Smartphone,
  Save,
  Palette,
  Type,
  Layout,
  ChevronRight,
  ChevronLeft,
  Settings,
  X,
  Loader2,
  ChevronUp,
  ChevronDown,
  Plus,
  Trash2,
  GripVertical,
  Globe
} from "lucide-react"
import { cn } from "@/lib/utils"

interface MyWebsiteProps {
  userName?: string
}

const colorThemes = [
  { id: "cream-gold", name: "Cream & Gold", primary: "#F5E6D3", secondary: "#A67C00", accent: "#FBBF24", background: "#FFF8E1" },
  { id: "midnight-blush", name: "Midnight Blush", primary: "#F8BBD0", secondary: "#1A2332", accent: "#E91E63", background: "#0D1117" },
  { id: "evergreen", name: "Evergreen", primary: "#4CAF50", secondary: "#1B5E20", accent: "#2E7D32", background: "#F1F8E9" },
  { id: "interstellar", name: "Interstellar", primary: "#E040FB", secondary: "#0A0E27", accent: "#9C27B0", background: "#0A0E27" },
  { id: "serene-sky", name: "Serene Sky", primary: "#60A5FA", secondary: "#1E3A8A", accent: "#3B82F6", background: "#EFF6FF" },
  { id: "crimson-night", name: "Crimson Night", primary: "#EF4444", secondary: "#991B1B", accent: "#DC2626", background: "#1A0A0A" },
]


interface Portfolio {
  portfolio_id: string
  url: string
  port: number
  created_at: string
  template: string
  cv_filename: string
  status: string
}

export default function MyWebsite({ userName = "Alex" }: MyWebsiteProps) {
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop")
  const [selectedTheme, setSelectedTheme] = useState("cream-gold")
  const [showEditor, setShowEditor] = useState(true) // Default to true (editor shown)
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null)
  const [isLoadingPortfolios, setIsLoadingPortfolios] = useState(true)
  const [portfolioError, setPortfolioError] = useState<string | null>(null)
  const [isRestartingServer, setIsRestartingServer] = useState(false)
  const [currentCVData, setCurrentCVData] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    hero: true,
    contact: true,
    summary: true,
    experience: true,
    education: true,
    skills: true
  })
  const [showProfilePhoto, setShowProfilePhoto] = useState(true)
  const [sectionVisibility, setSectionVisibility] = useState<Record<string, boolean>>({
    summary: true,
    experience: true,
    projects: false,
    skills: false,
    education: true,
    testimonials: false,
    achievements: true,
    certifications: false,
    volunteer: false,
    hobbies: false,
    courses: true,
    publications: false,
    speaking: true,
    memberships: false,
    languages: false
  })
  const [sectionOrder, setSectionOrder] = useState<string[]>([
    'summary',
    'experience',
    'projects',
    'skills',
    'education',
    'testimonials',
    'achievements',
    'certifications',
    'volunteer',
    'hobbies',
    'courses',
    'publications',
    'speaking',
    'memberships',
    'languages'
  ])

  const currentTheme = colorThemes.find(theme => theme.id === selectedTheme) || colorThemes[0]

  const handleSectionEdit = (sectionId: string, content: string) => {
    setSectionContent(prev => ({
      ...prev,
      [sectionId]: content
    }))
    
    // Send content update to portfolio iframe
    const iframe = document.querySelector('iframe[title="Portfolio Preview"]') as HTMLIFrameElement
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({
        type: 'UPDATE_CONTENT',
        sectionId: sectionId,
        content: content
      }, selectedPortfolio?.url || '*')
    }
  }

  // Load user's portfolios from API
  const loadPortfolios = async () => {
    try {
      setIsLoadingPortfolios(true)
      setPortfolioError(null)
      
      const sessionId = localStorage.getItem('cv2web_session_id')
      if (!sessionId) {
        console.log('No session ID found, user needs to login')
        setPortfolios([])
        setPortfolioError('Please login to view your portfolios')
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2000'}/api/v1/portfolio/list`, {
        headers: {
          'X-Session-ID': sessionId
        }
      })

      if (!response.ok) {
        if (response.status === 401) {
          setPortfolioError('Session expired. Please login again.')
          setPortfolios([])
          return
        }
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.detail || 'Failed to load portfolios')
      }

      const data = await response.json()
      setPortfolios(data.portfolios || [])
      
      // Auto-select the most recent portfolio
      if (data.portfolios && data.portfolios.length > 0) {
        setSelectedPortfolio(data.portfolios[0])
      } else {
        setSelectedPortfolio(null)
        console.log('No portfolios found for user')
      }
      
    } catch (error) {
      console.error('Error loading portfolios:', error)
      setPortfolioError(error instanceof Error ? error.message : 'Failed to load portfolios')
      setPortfolios([])
    } finally {
      setIsLoadingPortfolios(false)
    }
  }

  // Restart portfolio server
  const restartPortfolioServer = async () => {
    if (!selectedPortfolio) return
    
    try {
      setIsRestartingServer(true)
      
      const sessionId = localStorage.getItem('cv2web_session_id') || 'dev-session'
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2000'}/api/v1/portfolio/${selectedPortfolio.portfolio_id}/restart`, {
        method: 'POST',
        headers: {
          'X-Session-ID': sessionId
        }
      })

      if (!response.ok) {
        throw new Error('Failed to restart portfolio server')
      }

      const data = await response.json()
      
      // Update the selected portfolio with the new URL and port
      if (selectedPortfolio && data.port) {
        const newUrl = `http://localhost:${data.port}`
        const updatedPortfolio = {
          ...selectedPortfolio,
          url: newUrl,
          port: data.port
        }
        
        // Update the selected portfolio state
        setSelectedPortfolio(updatedPortfolio)
        
        // Update the portfolios list with the new URL
        setPortfolios(prev => prev.map(p => 
          p.portfolio_id === selectedPortfolio.portfolio_id 
            ? updatedPortfolio 
            : p
        ))
        
        // Force reload the iframe with the new URL
        setTimeout(() => {
          const iframe = document.querySelector('iframe[title="Portfolio Preview"]') as HTMLIFrameElement
          if (iframe) {
            iframe.src = newUrl
          }
        }, 500) // Increased timeout to ensure state updates are complete
      }
      
      alert(`Portfolio server restarted successfully on port ${data.port}!`)
      
    } catch (error) {
      console.error('Error restarting portfolio server:', error)
      alert('Failed to restart portfolio server. Please try again.')
    } finally {
      setIsRestartingServer(false)
    }
  }

  // Load CV data for the selected portfolio
  const loadPortfolioCVData = async (portfolioId: string) => {
    try {
      const sessionId = localStorage.getItem('cv2web_session_id') || 'dev-session'
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2000'}/api/v1/portfolio/${portfolioId}/cv-data`,
        {
          headers: {
            'X-Session-ID': sessionId
          }
        }
      )

      if (!response.ok) {
        throw new Error('Failed to load CV data')
      }

      const data = await response.json()
      if (data.cv_data) {
        // Store the original CV data
        setCurrentCVData(data.cv_data)
      }
    } catch (error) {
      console.error('Error loading CV data:', error)
      // Keep default sections on error
    }
  }

  // Save changes back to portfolio
  const savePortfolioChanges = async () => {
    if (!selectedPortfolio || !currentCVData) return
    
    try {
      setIsSaving(true)
      
      // The currentCVData is already updated through the individual field onChange handlers
      // So we just need to send it to the API
      
      const sessionId = localStorage.getItem('cv2web_session_id') || 'dev-session'
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2000'}/api/v1/portfolio/${selectedPortfolio.portfolio_id}/cv-data`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Session-ID': sessionId
          },
          body: JSON.stringify(currentCVData)
        }
      )

      if (!response.ok) {
        throw new Error('Failed to save changes')
      }

      const result = await response.json()
      
      // Show success message
      alert('Changes saved successfully! The portfolio will reload to show your updates.')
      
      // Reload the iframe to show the updated content
      const iframe = document.querySelector('iframe[title="Portfolio Preview"]') as HTMLIFrameElement
      if (iframe) {
        iframe.src = iframe.src // Force reload
      }
      
    } catch (error) {
      console.error('Error saving portfolio changes:', error)
      alert('Failed to save changes. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  // Load portfolios on component mount and listen for new portfolio events
  useEffect(() => {
    loadPortfolios()
    
    // Listen for portfolio generation events
    const handlePortfolioGenerated = () => {
      loadPortfolios() // Refresh the list when a new portfolio is generated
    }
    
    // Listen for messages from portfolio iframe
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'ADD_ITEM') {
        // The portfolio is requesting to add a new item
        const { section, item } = event.data
        
        // Add the item to currentCVData
        setCurrentCVData((prev: any) => {
          if (!prev) return prev
          const newData = { ...prev }
          
          switch(section) {
            case 'projects':
              if (!newData.projects) newData.projects = { projectItems: [] }
              newData.projects.projectItems = [...(newData.projects.projectItems || []), item]
              break
            case 'hobbies':
              if (!newData.hobbies) newData.hobbies = { hobbyItems: [] }
              newData.hobbies.hobbyItems = [...(newData.hobbies.hobbyItems || []), item]
              break
            case 'courses':
              if (!newData.courses) newData.courses = { courseItems: [] }
              newData.courses.courseItems = [...(newData.courses.courseItems || []), item]
              break
            case 'certifications':
              if (!newData.certifications) newData.certifications = { certificationItems: [] }
              newData.certifications.certificationItems = [...(newData.certifications.certificationItems || []), item]
              break
            case 'volunteer':
              if (!newData.volunteer) newData.volunteer = { volunteerItems: [] }
              newData.volunteer.volunteerItems = [...(newData.volunteer.volunteerItems || []), item]
              break
            case 'achievements':
              if (!newData.achievements) newData.achievements = { achievementItems: [] }
              newData.achievements.achievementItems = [...(newData.achievements.achievementItems || []), item]
              break
            case 'publications':
              if (!newData.publications) newData.publications = { publicationItems: [] }
              newData.publications.publicationItems = [...(newData.publications.publicationItems || []), item]
              break
            case 'speaking':
              if (!newData.speakingEngagements) newData.speakingEngagements = { engagementItems: [] }
              newData.speakingEngagements.engagementItems = [...(newData.speakingEngagements.engagementItems || []), item]
              break
            case 'memberships':
              if (!newData.memberships) newData.memberships = { membershipItems: [] }
              newData.memberships.membershipItems = [...(newData.memberships.membershipItems || []), item]
              break
          }
          
          return newData
        })
        
        // Send the updated data back to the iframe
        const iframe = document.querySelector('iframe[title="Portfolio Preview"]') as HTMLIFrameElement
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage({
            type: 'ADD_ITEM',
            section: section,
            item: item
          }, '*')
        }
      }
    }
    
    window.addEventListener('portfolioGenerated', handlePortfolioGenerated)
    window.addEventListener('message', handleMessage)
    
    return () => {
      window.removeEventListener('portfolioGenerated', handlePortfolioGenerated)
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  // Load CV data when portfolio selection changes
  useEffect(() => {
    if (selectedPortfolio) {
      loadPortfolioCVData(selectedPortfolio.portfolio_id)
      
      // Add a small delay before loading the iframe to ensure Next.js is ready
      const iframe = document.querySelector('iframe[title="Portfolio Preview"]') as HTMLIFrameElement
      if (iframe) {
        // Clear the src first
        iframe.src = 'about:blank'
        // Then set it after a delay
        setTimeout(() => {
          iframe.src = selectedPortfolio.url
        }, 500)
      }
    }
  }, [selectedPortfolio])

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className={cn(
        "flex-1 p-6 transition-all duration-300 overflow-auto",
        showEditor ? "mr-96" : "mr-0"
      )}>
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
                  <div className="absolute -inset-1 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
                  <div className="relative p-4 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-rose-500/10 rounded-2xl shadow-lg backdrop-blur-sm">
                    <Globe className="w-9 h-9 text-purple-600" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <h1 className="text-6xl font-extrabold bg-gradient-to-r from-purple-900 via-purple-700 to-pink-700 bg-clip-text text-transparent leading-tight pb-2">
                    My Website
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                    <span className="text-sm font-medium text-purple-600">Live Portfolio Manager</span>
                  </div>
                </div>
              </div>
              <p className="text-lg text-gray-600 max-w-3xl leading-relaxed">
                Design, preview, and manage your live portfolio website with real-time updates and advanced customization tools
              </p>
            </div>
            <div className="flex items-center gap-3">
              {selectedPortfolio ? (
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                  Live - {selectedPortfolio.template}
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-2" />
                  No Portfolio
                </Badge>
              )}
              
              {/* Portfolio Selection */}
              {portfolios.length > 1 && (
                <select 
                  value={selectedPortfolio?.portfolio_id || ''} 
                  onChange={(e) => {
                    const portfolio = portfolios.find(p => p.portfolio_id === e.target.value)
                    setSelectedPortfolio(portfolio || null)
                  }}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                >
                  {portfolios.map(portfolio => (
                    <option key={portfolio.portfolio_id} value={portfolio.portfolio_id}>
                      {portfolio.cv_filename} ({new Date(portfolio.created_at).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              )}
              
              <Button 
                onClick={() => setShowEditor(!showEditor)}
                variant={showEditor ? "default" : "outline"}
                size="sm"
              >
                {showEditor ? (
                  <>
                    <ChevronRight className="w-4 h-4 mr-2" />
                    Hide Info
                  </>
                ) : (
                  <>
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Show Info
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* View Mode Toggle & Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 bg-white rounded-lg p-1 border">
              <Button
                variant={viewMode === "desktop" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("desktop")}
                className="h-8"
              >
                <Monitor className="w-4 h-4 mr-1" />
                Desktop
              </Button>
              <Button
                variant={viewMode === "mobile" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("mobile")}
                className="h-8"
              >
                <Smartphone className="w-4 h-4 mr-1" />
                Mobile
              </Button>
            </div>

            <div className="flex items-center gap-2">
              {selectedPortfolio && (
                <>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(selectedPortfolio.url, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open in New Tab
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(selectedPortfolio.url)
                      alert('Portfolio URL copied to clipboard!')
                    }}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Copy URL
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={restartPortfolioServer}
                    disabled={isRestartingServer}
                  >
                    {isRestartingServer ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Settings className="w-4 h-4 mr-2" />
                    )}
                    {isRestartingServer ? 'Restarting...' : 'Restart Server'}
                  </Button>
                </>
              )}
              {!selectedPortfolio && (
                <div className="text-sm text-gray-500">
                  Generate a portfolio from the CV Editor to preview it here
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Website Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-full"
        >
          {isLoadingPortfolios ? (
            // Loading State
            <Card className="p-8 bg-white w-full">
              <div className="flex items-center justify-center h-[600px]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading your portfolios...</p>
                </div>
              </div>
            </Card>
          ) : portfolioError ? (
            // Error State
            <Card className="p-8 bg-white w-full">
              <div className="flex items-center justify-center h-[600px]">
                <div className="text-center">
                  <div className="text-red-500 text-6xl mb-4">⚠️</div>
                  <p className="text-gray-600 mb-4">{portfolioError}</p>
                  <Button onClick={loadPortfolios} variant="outline">
                    Try Again
                  </Button>
                </div>
              </div>
            </Card>
          ) : !selectedPortfolio ? (
            // No Portfolio State
            <Card className="p-8 bg-white w-full">
              <div className="flex items-center justify-center h-[600px]">
                <div className="text-center">
                  <div className="text-gray-400 text-6xl mb-4">🌐</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Portfolio Generated Yet</h3>
                  <p className="text-gray-600 mb-4">Go to the CV Editor and click "Generate Portfolio Website" to create your first portfolio.</p>
                  <Button 
                    onClick={() => {
                      // Navigate to CV Editor (you can implement this based on your routing)
                      const event = new CustomEvent('navigateToPage', { detail: 'cv-editor' })
                      window.dispatchEvent(event)
                    }}
                    className="bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600"
                  >
                    Go to CV Editor
                  </Button>
                </div>
              </div>
            </Card>
          ) : viewMode === "desktop" ? (
            // Desktop View
            <Card className="p-2 bg-white w-full h-full">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: 'calc(100vh - 200px)', minHeight: '600px' }}>
                {/* Browser Chrome */}
                <div className="bg-gray-100 px-4 py-2 border-b flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="flex-1 bg-white rounded px-3 py-1 text-sm text-gray-600 mx-4">
                    {selectedPortfolio.url}
                  </div>
                  <div className="w-4 h-4 text-gray-400">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>

                {/* Portfolio Iframe */}
                <iframe
                  src={selectedPortfolio.url}
                  className="w-full h-full border-0"
                  title="Portfolio Preview"
                  style={{ 
                    height: 'calc(100% - 44px)', 
                    minHeight: '550px',
                    width: '100%'
                  }}
                  onLoad={(e) => {
                    const iframe = e.target as HTMLIFrameElement
                    
                    // Send initial visibility states to the portfolio
                    setTimeout(() => {
                      if (iframe.contentWindow) {
                        // Send profile photo visibility
                        iframe.contentWindow.postMessage({
                          type: 'TOGGLE_PHOTO',
                          show: showProfilePhoto
                        }, selectedPortfolio?.url || '*')
                        
                        // Send all section visibility states
                        Object.entries(sectionVisibility).forEach(([section, visible]) => {
                          iframe.contentWindow.postMessage({
                            type: 'TOGGLE_SECTION',
                            section: section,
                            visible: visible
                          }, selectedPortfolio?.url || '*')
                        })
                        
                        // Send current theme
                        iframe.contentWindow.postMessage({
                          type: 'CHANGE_THEME',
                          themeId: selectedTheme
                        }, selectedPortfolio?.url || '*')
                      }
                    }, 1000) // Wait for iframe to fully load
                    try {
                      // Check if the page loaded successfully
                      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
                      const title = iframeDoc?.title || ''
                      
                      // If we get a 404 or error page, retry after a delay
                      if (title.includes('404') || title.includes('not found') || title.includes('Error')) {
                        setTimeout(() => {
                          iframe.src = iframe.src // Reload the iframe
                        }, 1000) // Wait 1 second and retry
                      }
                    } catch (err) {
                      // Cross-origin, can't check content, but that's OK
                    }
                  }}
                />
              </div>
            </Card>
          ) : (
            // iPhone 15 Pro Max Mobile View
            <div className="relative">
              {/* iPhone 15 Pro Max Frame */}
              <div className="relative w-[428px] h-[926px] bg-black rounded-[55px] p-2 shadow-2xl">
                {/* Dynamic Island */}
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-black rounded-full z-20"></div>
                
                {/* Screen */}
                <div className="w-full h-full bg-white rounded-[50px] overflow-hidden relative">
                  {/* Status Bar */}
                  <div className="absolute top-0 left-0 right-0 h-12 bg-white z-10 flex items-center justify-between px-8 pt-2">
                    <div className="text-sm font-semibold text-black">9:41</div>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-2 border border-black rounded-sm">
                        <div className="w-3 h-1 bg-black rounded-sm"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Browser Chrome */}
                  <div className="mt-12 bg-gray-100 px-4 py-3 border-b flex items-center gap-2">
                    <div className="flex-1 bg-white rounded-full px-3 py-2 text-xs text-gray-600">
                      {selectedPortfolio.url}
                    </div>
                  </div>

                  {/* Portfolio Iframe - Mobile */}
                  <iframe
                    src={selectedPortfolio.url}
                    className="w-full border-0"
                    title="Portfolio Preview Mobile"
                    style={{ height: 'calc(100% - 104px)' }}
                    onLoad={(e) => {
                      const iframe = e.target as HTMLIFrameElement
                      
                      // Send initial visibility states to the portfolio
                      setTimeout(() => {
                        if (iframe.contentWindow) {
                          // Send profile photo visibility
                          iframe.contentWindow.postMessage({
                            type: 'TOGGLE_PHOTO',
                            show: showProfilePhoto
                          }, selectedPortfolio?.url || '*')
                          
                          // Send all section visibility states
                          Object.entries(sectionVisibility).forEach(([section, visible]) => {
                            iframe.contentWindow.postMessage({
                              type: 'TOGGLE_SECTION',
                              section: section,
                              visible: visible
                            }, selectedPortfolio?.url || '*')
                          })
                          
                          // Send current theme
                          iframe.contentWindow.postMessage({
                            type: 'CHANGE_THEME',
                            themeId: selectedTheme
                          }, selectedPortfolio?.url || '*')
                        }
                      }, 1000) // Wait for iframe to fully load
                      
                      try {
                        // Check if the page loaded successfully
                        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
                        const title = iframeDoc?.title || ''
                        
                        // If we get a 404 or error page, retry after a delay
                        if (title.includes('404') || title.includes('not found') || title.includes('Error')) {
                          setTimeout(() => {
                            iframe.src = iframe.src // Reload the iframe
                          }, 1000) // Wait 1 second and retry
                        }
                      } catch (err) {
                        // Cross-origin, can't check content, but that's OK
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Editor Sidebar */}
      <motion.div
        initial={{ x: 384 }}
        animate={{ x: showEditor ? 0 : 384 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed right-0 top-0 h-full w-96 bg-white border-l border-gray-200 shadow-lg z-50"
      >
        <div className="p-6 h-full overflow-y-auto">
          {/* Editor Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Website Editor</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEditor(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Color Themes */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Color Theme
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {colorThemes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => {
                    setSelectedTheme(theme.id)
                    // Send theme change message to portfolio iframe
                    const iframe = document.querySelector('iframe[title="Portfolio Preview"]') as HTMLIFrameElement
                    if (iframe && iframe.contentWindow) {
                      iframe.contentWindow.postMessage({
                        type: 'CHANGE_THEME',
                        themeId: theme.id
                      }, selectedPortfolio?.url || '*')
                    }
                  }}
                  className={cn(
                    "p-3 rounded-lg border-2 transition-all hover:scale-105",
                    selectedTheme === theme.id 
                      ? "border-blue-500 shadow-md" 
                      : "border-gray-200"
                  )}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div 
                      className="w-5 h-5 rounded-full border border-gray-300" 
                      style={{ backgroundColor: theme.background }}
                    />
                    <div 
                      className="w-5 h-5 rounded-full border border-gray-300" 
                      style={{ backgroundColor: theme.secondary }}
                    />
                    <div 
                      className="w-5 h-5 rounded-full border border-gray-300" 
                      style={{ backgroundColor: theme.accent }}
                    />
                    <div 
                      className="w-5 h-5 rounded-full border border-gray-300" 
                      style={{ backgroundColor: theme.primary }}
                    />
                  </div>
                  <p className="text-xs font-medium text-gray-900">{theme.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Section Visibility Controls */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Layout className="w-4 h-4" />
              Display Sections
            </h3>
            <p className="text-xs text-gray-500 mb-3">Toggle visibility and drag to reorder.</p>
            
            <div className="space-y-2">
              {/* Display Profile Photo Toggle */}
              <div className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50">
                <Switch 
                  id="profile-photo" 
                  checked={showProfilePhoto} 
                  onCheckedChange={(checked) => {
                    setShowProfilePhoto(checked)
                    // Send update to iframe
                    const iframe = document.querySelector('iframe[title="Portfolio Preview"]') as HTMLIFrameElement
                    if (iframe && iframe.contentWindow) {
                      iframe.contentWindow.postMessage({
                        type: 'TOGGLE_PHOTO',
                        show: checked
                      }, selectedPortfolio?.url || '*')
                    }
                  }}
                />
                <Label htmlFor="profile-photo" className="flex-1 cursor-pointer">
                  Display Profile Photo
                </Label>
              </div>

              {/* Section Toggles */}
              {sectionOrder.map((section) => {
                const sectionName = section.charAt(0).toUpperCase() + section.slice(1).replace(/([A-Z])/g, ' $1')
                return (
                  <div 
                    key={section}
                    className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 group"
                  >
                    <div className="cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
                      <GripVertical className="w-4 h-4 text-gray-400" />
                    </div>
                    <Switch 
                      id={section}
                      checked={sectionVisibility[section]} 
                      onCheckedChange={(checked) => {
                        setSectionVisibility(prev => ({ ...prev, [section]: checked }))
                        // Send update to iframe
                        const iframe = document.querySelector('iframe[title="Portfolio Preview"]') as HTMLIFrameElement
                        if (iframe && iframe.contentWindow) {
                          iframe.contentWindow.postMessage({
                            type: 'TOGGLE_SECTION',
                            section: section,
                            visible: checked
                          }, selectedPortfolio?.url || '*')
                        }
                      }}
                    />
                    <Label htmlFor={section} className="flex-1 cursor-pointer">
                      {sectionName}
                    </Label>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Content Editor */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2 mb-4">
              <Type className="w-4 h-4" />
              Content Editor
            </h3>
            
            {currentCVData ? (
              <div className="space-y-4">
                {/* Hero Section */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                      <span>👤</span> Hero Section
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedSections(prev => ({ ...prev, hero: !prev.hero }))}
                    >
                      {expandedSections.hero ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                  </div>
                  {expandedSections.hero && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-gray-600">Full Name</label>
                        <Input
                          value={currentCVData.hero?.fullName || ''}
                          onChange={(e) => {
                            setCurrentCVData(prev => ({
                              ...prev,
                              hero: { ...prev.hero, fullName: e.target.value }
                            }))
                            handleSectionEdit('fullName', e.target.value)
                          }}
                          className="mt-1 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600">Professional Title</label>
                        <Input
                          value={currentCVData.hero?.professionalTitle || ''}
                          onChange={(e) => {
                            setCurrentCVData(prev => ({
                              ...prev,
                              hero: { ...prev.hero, professionalTitle: e.target.value }
                            }))
                            handleSectionEdit('professionalTitle', e.target.value)
                          }}
                          className="mt-1 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600">Summary Tagline</label>
                        <Input
                          value={currentCVData.hero?.summaryTagline || ''}
                          onChange={(e) => {
                            setCurrentCVData(prev => ({
                              ...prev,
                              hero: { ...prev.hero, summaryTagline: e.target.value }
                            }))
                          }}
                          className="mt-1 text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Contact Section */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                      <span>📧</span> Contact Information
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedSections(prev => ({ ...prev, contact: !prev.contact }))}
                    >
                      {expandedSections.contact ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                  </div>
                  {expandedSections.contact && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-gray-600">Email</label>
                        <Input
                          value={currentCVData.contact?.email || ''}
                          onChange={(e) => {
                            setCurrentCVData(prev => ({
                              ...prev,
                              contact: { ...prev.contact, email: e.target.value }
                            }))
                          }}
                          className="mt-1 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600">Phone</label>
                        <Input
                          value={currentCVData.contact?.phone || ''}
                          onChange={(e) => {
                            setCurrentCVData(prev => ({
                              ...prev,
                              contact: { ...prev.contact, phone: e.target.value }
                            }))
                          }}
                          className="mt-1 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-600">Location</label>
                        <Input
                          value={`${currentCVData.contact?.location?.city || ''} ${currentCVData.contact?.location?.state || ''} ${currentCVData.contact?.location?.country || ''}`.trim()}
                          onChange={(e) => {
                            const parts = e.target.value.split(' ')
                            setCurrentCVData(prev => ({
                              ...prev,
                              contact: { 
                                ...prev.contact, 
                                location: {
                                  city: parts[0] || '',
                                  state: parts[1] || '',
                                  country: parts[2] || ''
                                }
                              }
                            }))
                          }}
                          className="mt-1 text-sm"
                          placeholder="City State Country"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Professional Summary */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                      <span>📝</span> Professional Summary
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedSections(prev => ({ ...prev, summary: !prev.summary }))}
                    >
                      {expandedSections.summary ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                  </div>
                  {expandedSections.summary && (
                    <Textarea
                      value={currentCVData.summary?.summaryText || ''}
                      onChange={(e) => {
                        setCurrentCVData(prev => ({
                          ...prev,
                          summary: { ...prev.summary, summaryText: e.target.value }
                        }))
                        handleSectionEdit('summary', e.target.value)
                      }}
                      className="text-sm"
                      rows={4}
                      placeholder="Professional summary..."
                    />
                  )}
                </div>

                {/* Experience Section */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                      <span>💼</span> Work Experience
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedSections(prev => ({ ...prev, experience: !prev.experience }))}
                    >
                      {expandedSections.experience ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                  </div>
                  {expandedSections.experience && (
                    <div className="space-y-3">
                      {currentCVData.experience?.experienceItems?.map((exp: any, index: number) => (
                        <div key={index} className="border border-gray-200 rounded p-3 bg-white">
                          <div className="flex items-start justify-between mb-2">
                            <span className="text-xs font-medium text-gray-600">Experience {index + 1}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const updatedExperiences = currentCVData.experience.experienceItems.filter((_: any, i: number) => i !== index)
                                setCurrentCVData(prev => ({
                                  ...prev,
                                  experience: { ...prev.experience, experienceItems: updatedExperiences }
                                }))
                              }}
                              className="text-red-600 hover:text-red-700 h-6 w-6 p-0"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                          <div className="space-y-2">
                            <Input
                              value={exp.jobTitle || ''}
                              onChange={(e) => {
                                const updatedExperiences = [...currentCVData.experience.experienceItems]
                                updatedExperiences[index] = { ...exp, jobTitle: e.target.value }
                                setCurrentCVData(prev => ({
                                  ...prev,
                                  experience: { ...prev.experience, experienceItems: updatedExperiences }
                                }))
                              }}
                              placeholder="Job Title"
                              className="text-sm"
                            />
                            <Input
                              value={exp.companyName || ''}
                              onChange={(e) => {
                                const updatedExperiences = [...currentCVData.experience.experienceItems]
                                updatedExperiences[index] = { ...exp, companyName: e.target.value }
                                setCurrentCVData(prev => ({
                                  ...prev,
                                  experience: { ...prev.experience, experienceItems: updatedExperiences }
                                }))
                              }}
                              placeholder="Company Name"
                              className="text-sm"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <Input
                                value={exp.dateRange?.startDate || ''}
                                onChange={(e) => {
                                  const updatedExperiences = [...currentCVData.experience.experienceItems]
                                  updatedExperiences[index] = { 
                                    ...exp, 
                                    dateRange: { ...exp.dateRange, startDate: e.target.value }
                                  }
                                  setCurrentCVData(prev => ({
                                    ...prev,
                                    experience: { ...prev.experience, experienceItems: updatedExperiences }
                                  }))
                                }}
                                placeholder="Start Date"
                                className="text-sm"
                              />
                              <Input
                                value={exp.dateRange?.endDate || (exp.dateRange?.isCurrent ? 'Present' : '')}
                                onChange={(e) => {
                                  const updatedExperiences = [...currentCVData.experience.experienceItems]
                                  updatedExperiences[index] = { 
                                    ...exp, 
                                    dateRange: { 
                                      ...exp.dateRange, 
                                      endDate: e.target.value,
                                      isCurrent: e.target.value.toLowerCase() === 'present'
                                    }
                                  }
                                  setCurrentCVData(prev => ({
                                    ...prev,
                                    experience: { ...prev.experience, experienceItems: updatedExperiences }
                                  }))
                                }}
                                placeholder="End Date"
                                className="text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newExperience = {
                            jobTitle: '',
                            companyName: '',
                            dateRange: { startDate: '', endDate: '', isCurrent: false },
                            responsibilitiesAndAchievements: []
                          }
                          setCurrentCVData(prev => ({
                            ...prev,
                            experience: {
                              ...prev.experience,
                              experienceItems: [...(prev.experience?.experienceItems || []), newExperience]
                            }
                          }))
                        }}
                        className="w-full"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Experience
                      </Button>
                    </div>
                  )}
                </div>

                {/* Skills Section */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                      <span>⚡</span> Skills
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedSections(prev => ({ ...prev, skills: !prev.skills }))}
                    >
                      {expandedSections.skills ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                  </div>
                  {expandedSections.skills && (
                    <div className="space-y-3">
                      {currentCVData.skills?.skillCategories?.map((category: any, index: number) => (
                        <div key={index} className="space-y-2">
                          <Input
                            value={category.categoryName || ''}
                            onChange={(e) => {
                              const updatedCategories = [...currentCVData.skills.skillCategories]
                              updatedCategories[index] = { ...category, categoryName: e.target.value }
                              setCurrentCVData(prev => ({
                                ...prev,
                                skills: { ...prev.skills, skillCategories: updatedCategories }
                              }))
                            }}
                            placeholder="Category Name"
                            className="text-sm font-medium"
                          />
                          <Input
                            value={category.skills?.join(', ') || ''}
                            onChange={(e) => {
                              const updatedCategories = [...currentCVData.skills.skillCategories]
                              updatedCategories[index] = { 
                                ...category, 
                                skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                              }
                              setCurrentCVData(prev => ({
                                ...prev,
                                skills: { ...prev.skills, skillCategories: updatedCategories }
                              }))
                            }}
                            placeholder="Skills (comma-separated)"
                            className="text-sm"
                          />
                        </div>
                      ))}
                      {(!currentCVData.skills?.skillCategories || currentCVData.skills.skillCategories.length === 0) && 
                       currentCVData.skills?.ungroupedSkills && (
                        <Input
                          value={currentCVData.skills.ungroupedSkills.join(', ')}
                          onChange={(e) => {
                            setCurrentCVData(prev => ({
                              ...prev,
                              skills: { 
                                ...prev.skills, 
                                ungroupedSkills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                              }
                            }))
                          }}
                          placeholder="Skills (comma-separated)"
                          className="text-sm"
                        />
                      )}
                    </div>
                  )}
                </div>

                {/* Education Section */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                      <span>🎓</span> Education
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedSections(prev => ({ ...prev, education: !prev.education }))}
                    >
                      {expandedSections.education ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                  </div>
                  {expandedSections.education && (
                    <div className="space-y-3">
                      {currentCVData.education?.educationItems?.map((edu: any, index: number) => (
                        <div key={index} className="border border-gray-200 rounded p-3 bg-white">
                          <div className="space-y-2">
                            <Input
                              value={edu.degree || ''}
                              onChange={(e) => {
                                const updatedEducation = [...currentCVData.education.educationItems]
                                updatedEducation[index] = { ...edu, degree: e.target.value }
                                setCurrentCVData(prev => ({
                                  ...prev,
                                  education: { ...prev.education, educationItems: updatedEducation }
                                }))
                              }}
                              placeholder="Degree"
                              className="text-sm"
                            />
                            <Input
                              value={edu.fieldOfStudy || ''}
                              onChange={(e) => {
                                const updatedEducation = [...currentCVData.education.educationItems]
                                updatedEducation[index] = { ...edu, fieldOfStudy: e.target.value }
                                setCurrentCVData(prev => ({
                                  ...prev,
                                  education: { ...prev.education, educationItems: updatedEducation }
                                }))
                              }}
                              placeholder="Field of Study"
                              className="text-sm"
                            />
                            <Input
                              value={edu.institution || ''}
                              onChange={(e) => {
                                const updatedEducation = [...currentCVData.education.educationItems]
                                updatedEducation[index] = { ...edu, institution: e.target.value }
                                setCurrentCVData(prev => ({
                                  ...prev,
                                  education: { ...prev.education, educationItems: updatedEducation }
                                }))
                              }}
                              placeholder="Institution"
                              className="text-sm"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Dynamic Sections with Add Buttons */}
                {Object.entries(sectionVisibility).map(([section, isVisible]) => {
                  if (!isVisible) return null
                  
                  // Skip sections that are already rendered above
                  if (['summary', 'experience', 'skills', 'education'].includes(section)) return null
                  
                  const sectionData = currentCVData[section]
                  const sectionName = section.charAt(0).toUpperCase() + section.slice(1).replace(/([A-Z])/g, ' $1')
                  const hasItems = sectionData && (
                    sectionData[`${section}Items`] || 
                    sectionData[`${section.slice(0, -1)}Items`] || 
                    sectionData.hobbyItems ||
                    sectionData.projectItems ||
                    sectionData.courseItems ||
                    sectionData.certificationItems ||
                    sectionData.volunteerItems ||
                    sectionData.achievementItems ||
                    sectionData.publicationItems ||
                    sectionData.engagementItems ||
                    sectionData.membershipItems
                  )?.length > 0
                  
                  const sectionEmojis: Record<string, string> = {
                    projects: '🚀',
                    hobbies: '🎯',
                    courses: '📚',
                    certifications: '🏆',
                    volunteer: '🤝',
                    achievements: '⭐',
                    publications: '📄',
                    speaking: '🎤',
                    speakingEngagements: '🎤',
                    memberships: '👥',
                    languages: '🌍',
                    testimonials: '💬'
                  }
                  
                  return (
                    <div key={section} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                          <span>{sectionEmojis[section] || '📋'}</span> {sectionName}
                        </h4>
                      </div>
                      
                      {!hasItems ? (
                        <div className="text-center py-4">
                          <p className="text-xs text-gray-500 mb-3">No {sectionName.toLowerCase()} added yet</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // Create appropriate item based on section
                              let newItem: any = {}
                              
                              switch(section) {
                                case 'projects':
                                  newItem = { title: 'New Project', description: 'Project description...', link: 'https://example.com', icon: 'project' }
                                  break
                                case 'hobbies':
                                  newItem = { title: 'New Hobby' }
                                  break
                                case 'courses':
                                  newItem = { courseName: 'New Course', platform: 'Platform', completionYear: new Date().getFullYear().toString() }
                                  break
                                case 'certifications':
                                  newItem = { title: 'New Certification', issuingBody: 'Issuing Organization', year: new Date().getFullYear().toString() }
                                  break
                                case 'volunteer':
                                  newItem = { role: 'Volunteer Role', organization: 'Organization', description: 'Description...', icon: 'heart' }
                                  break
                                case 'achievements':
                                  newItem = { title: 'New Achievement' }
                                  break
                                case 'publications':
                                  newItem = { title: 'New Publication', journal: 'Journal Name', year: new Date().getFullYear().toString(), link: 'https://example.com' }
                                  break
                                case 'speaking':
                                case 'speakingEngagements':
                                  newItem = { title: 'New Speaking Engagement', event: 'Event Name', year: new Date().getFullYear().toString() }
                                  break
                                case 'memberships':
                                  newItem = { organization: 'Organization Name', role: 'Member', period: 'Period' }
                                  break
                              }
                              
                              // Send ADD_ITEM message to iframe
                              const iframe = document.querySelector('iframe[title="Portfolio Preview"]') as HTMLIFrameElement
                              if (iframe && iframe.contentWindow) {
                                iframe.contentWindow.postMessage({
                                  type: 'ADD_ITEM',
                                  section: section === 'speakingEngagements' ? 'speaking' : section,
                                  item: newItem
                                }, selectedPortfolio?.url || '*')
                              }
                              
                              // Also update local state
                              setCurrentCVData((prev: any) => {
                                if (!prev) return prev
                                const newData = { ...prev }
                                const sectionKey = section === 'speaking' ? 'speakingEngagements' : section
                                
                                if (!newData[sectionKey]) {
                                  newData[sectionKey] = {}
                                }
                                
                                const itemsKey = `${section}Items`
                                if (!newData[sectionKey][itemsKey]) {
                                  newData[sectionKey][itemsKey] = []
                                }
                                
                                newData[sectionKey][itemsKey] = [...(newData[sectionKey][itemsKey] || []), newItem]
                                
                                return newData
                              })
                            }}
                            className="w-full"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add {sectionName.slice(0, -1)}
                          </Button>
                        </div>
                      ) : (
                        <div className="text-xs text-gray-600">
                          <p>{hasItems ? `${hasItems} items` : 'Edit in preview'}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">Select a portfolio to edit its content</p>
              </div>
            )}
          </div>

          {/* Layout Controls */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Layout className="w-4 h-4" />
              Layout Settings
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-700">Spacing</label>
                <input 
                  type="range" 
                  min="1" 
                  max="3" 
                  className="w-full mt-1" 
                />
              </div>
              
              <div>
                <label className="text-xs font-medium text-gray-700">Font Size</label>
                <input 
                  type="range" 
                  min="14" 
                  max="20" 
                  className="w-full mt-1" 
                />
              </div>
              
              <div>
                <label className="text-xs font-medium text-gray-700">Border Radius</label>
                <input 
                  type="range" 
                  min="0" 
                  max="20" 
                  className="w-full mt-1" 
                />
              </div>
            </div>
          </div>

          {/* Save Changes */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <Button 
              onClick={savePortfolioChanges}
              disabled={isSaving || !selectedPortfolio}
              className="w-full bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 hover:from-emerald-600 hover:via-sky-500 hover:to-blue-700 text-white border-0"
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
        </div>
      </motion.div>
    </div>
  )
} 