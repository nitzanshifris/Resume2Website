"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Home, Globe, FileText, User, Settings, MessageSquare, Menu, X, ExternalLink, Share2, Eye, Edit3, Download, TrendingUp, Users, Clock, Star, ArrowRight, CheckCircle, BarChart3, Shield, AlertCircle, Link2, Zap, Search, RefreshCw, Activity, Check, ShoppingCart, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

// Import the enhanced dashboard pages directly
import MyWebsitePage from "./dashboard-pages/my-website"
import MyResumePage from "./dashboard-pages/my-resume"
import ProfilePage from "./dashboard-pages/profile"
import CVEditor from "./dashboard-pages/cv-editor"

// Import upload flow components
import ResumeFlowModal from "./resume-flow-modal"
import UploadResume from "./upload-resume"
import ProcessingPage from "./processing-page"
import ResumeBuilder from "./resume-builder"

interface SimpleDashboardProps {
  userName?: string
  onBackToHome?: () => void
}

const navigationItems = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "website", label: "My Website", icon: Globe },
  { id: "resume", label: "My Resume", icon: FileText },
  { id: "cv-editor", label: "CV Editor", icon: Edit3 },
  { id: "account", label: "Account Details", icon: User },
  { id: "domain", label: "Domain", icon: Settings },
  { id: "feedback", label: "Feedback", icon: MessageSquare },
]

const premiumFeatures = [
  { id: "analytics", label: "Analytics", icon: BarChart3, premium: true },
  { id: "ats", label: "ATS Optimization", icon: CheckCircle, premium: true },
  { id: "jobs", label: "Jobs Finder", icon: TrendingUp, premium: true },
  { id: "recruiters", label: "Recruiter Outreach", icon: Users, premium: true },
]

export default function SimpleDashboard({ userName = "Alex Johnson", onBackToHome }: SimpleDashboardProps) {
  const [activePage, setActivePage] = useState("overview")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  // Upload flow states
  const [isResumeFlowOpen, setIsResumeFlowOpen] = useState(false)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [isProcessingOpen, setIsProcessingOpen] = useState(false)
  const [isBuilderOpen, setIsBuilderOpen] = useState(false)
  const [currentJobId, setCurrentJobId] = useState<string | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  // Listen for upload modal requests from child components
  useEffect(() => {
    const handleOpenUploadModal = () => {
      setIsUploadOpen(true)
    }

    const handleNavigateToCVEditor = (event: CustomEvent) => {
      setActivePage('cv-editor')
      
      // If scrollToGenerate is true, scroll after a brief delay to ensure page is rendered
      if (event.detail?.scrollToGenerate) {
        setTimeout(() => {
          const element = document.getElementById('portfolio-generation-section')
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }, 500)
      }
    }

    window.addEventListener('openUploadModal', handleOpenUploadModal)
    window.addEventListener('navigateToCVEditor', handleNavigateToCVEditor)
    return () => {
      window.removeEventListener('openUploadModal', handleOpenUploadModal)
      window.removeEventListener('navigateToCVEditor', handleNavigateToCVEditor)
    }
  }, [])

  // Upload flow handlers
  const handleResumeFlowContinue = (plan: string) => {
    setSelectedPlan(plan)
    setIsResumeFlowOpen(false)
    setIsUploadOpen(true)
  }

  const handleUploadSuccess = (jobId: string) => {
    setCurrentJobId(jobId)
    setIsUploadOpen(false)
    setIsProcessingOpen(true)
  }

  const handleProcessingComplete = () => {
    setIsProcessingOpen(false)
    // Skip builder, go directly to CV editor
    const event = new CustomEvent('cvUploadComplete')
    window.dispatchEvent(event)
    // Navigate to CV editor page
    setActivePage('cv-editor')
  }

  const handleBuilderComplete = () => {
    setIsBuilderOpen(false)
    // Emit event to notify components that upload is complete
    const event = new CustomEvent('cvUploadComplete')
    window.dispatchEvent(event)
    // Navigate to resume page
    setActivePage('resume')
  }

  const renderOverviewContent = () => (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-xl p-6 border border-blue-100 dark:border-blue-800">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome back, {userName}! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Your professional website is live and looking great
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              <CheckCircle className="w-3 h-3 mr-1" />
              Live
            </Badge>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Website Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">1,247</div>
              <Eye className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              +12% from last week
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Profile Completeness
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">95%</div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Excellent optimization
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Last Updated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">Today</div>
              <Clock className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              2 hours ago
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="w-5 h-5 mr-2 text-blue-500" />
              Website Management
            </CardTitle>
            <CardDescription>
              Manage your professional website and content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={() => setActivePage("website")} 
              className="w-full justify-start" 
              variant="outline"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Website
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Live Site
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Share2 className="w-4 h-4 mr-2" />
              Share Profile
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2 text-green-500" />
              Resume Center
            </CardTitle>
            <CardDescription>
              Manage your resume and download options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={() => setActivePage("resume")} 
              className="w-full justify-start" 
              variant="outline"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Resume
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Resume
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2 text-orange-500" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-300">Website updated with new projects</span>
              <span className="text-xs text-gray-400 ml-auto">2 hours ago</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-300">Resume downloaded by recruiter</span>
              <span className="text-xs text-gray-400 ml-auto">5 hours ago</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-300">Profile viewed 23 times</span>
              <span className="text-xs text-gray-400 ml-auto">1 day ago</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-gray-600 dark:text-gray-300">New skill endorsement received</span>
              <span className="text-xs text-gray-400 ml-auto">2 days ago</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pro Tips */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border-yellow-200 dark:border-yellow-800">
        <CardHeader>
          <CardTitle className="flex items-center text-yellow-800 dark:text-yellow-200">
            <Star className="w-5 h-5 mr-2" />
            Pro Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <ArrowRight className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Add more project details to increase your profile views by 40%
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <ArrowRight className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Update your skills section to match current job market trends
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <ArrowRight className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Consider upgrading to Premium for advanced analytics
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderDomainContent = () => {
    const [customDomain, setCustomDomain] = useState("")
    const [searchDomain, setSearchDomain] = useState("")
    const [isDNSConfigured, setIsDNSConfigured] = useState(false)
    const [showDNSInstructions, setShowDNSInstructions] = useState(false)
    const [isConnecting, setIsConnecting] = useState(false)
    const [domainStatus, setDomainStatus] = useState("pending") // pending, verified, error
    const [selectedTab, setSelectedTab] = useState("overview")
    
    const handleConnectDomain = async () => {
      setIsConnecting(true)
      await new Promise(resolve => setTimeout(resolve, 2000))
      setDomainStatus("verified")
      setIsConnecting(false)
    }

    const domainSuggestions = [
      { domain: "alexjohnson.com", available: true, price: "$12.99/year" },
      { domain: "alexjohnson.net", available: true, price: "$14.99/year" },
      { domain: "alexjohnson.io", available: false, price: "Unavailable" },
      { domain: "alex-johnson.com", available: true, price: "$12.99/year" },
      { domain: "ajohnson.com", available: true, price: "$19.99/year" },
    ]

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 rounded-xl p-6 border border-purple-100 dark:border-purple-800">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Domain Management
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Complete domain management for your professional website
          </p>
        </div>

        {/* Domain Tab Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-700">
            {[
              { id: "overview", label: "Overview", icon: "🏠" },
              { id: "connect", label: "Connect Domain", icon: "🔗" },
              { id: "dns", label: "DNS Settings", icon: "⚙️" },
              { id: "ssl", label: "SSL/Security", icon: "🔒" },
              { id: "analytics", label: "Analytics", icon: "📊" },
              { id: "search", label: "Find Domain", icon: "🔍" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={cn(
                  "px-4 py-3 text-sm font-medium transition-colors flex items-center gap-2",
                  selectedTab === tab.id
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                )}
              >
                <span>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {selectedTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Current Domain Status */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        Current Domain Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Default Domain */}
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Default CV2Web Domain</p>
                        <p className="font-mono text-sm text-gray-900 dark:text-white">
                          cv2web.com/alex-johnson
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Active
                          </Badge>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                            <Shield className="w-3 h-3 mr-1" />
                            SSL Secure
                          </Badge>
                        </div>
                      </div>

                      {/* Custom Domain */}
                      {customDomain && (
                        <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                          <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Custom Domain</p>
                          <p className="font-mono text-sm text-gray-900 dark:text-white">
                            {customDomain}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge 
                              variant="secondary" 
                              className={cn(
                                domainStatus === "verified" 
                                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                                  : domainStatus === "error"
                                  ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
                                  : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200"
                              )}
                            >
                              {domainStatus === "verified" && <CheckCircle className="w-3 h-3 mr-1" />}
                              {domainStatus === "error" && <X className="w-3 h-3 mr-1" />}
                              {domainStatus === "pending" && <Clock className="w-3 h-3 mr-1" />}
                              {domainStatus === "verified" ? "Verified" : domainStatus === "error" ? "Error" : "Pending"}
                            </Badge>
                          </div>
                        </div>
                      )}
                      
                      {/* Domain Performance Stats */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                          <p className="text-xs text-blue-600 dark:text-blue-400">Uptime</p>
                          <p className="text-lg font-bold text-blue-900 dark:text-blue-100">99.9%</p>
                          <p className="text-xs text-blue-600 dark:text-blue-400">Last 30 days</p>
                        </div>
                        <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                          <p className="text-xs text-green-600 dark:text-green-400">Load Time</p>
                          <p className="text-lg font-bold text-green-900 dark:text-green-100">1.2s</p>
                          <p className="text-xs text-green-600 dark:text-green-400">Average</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-purple-600" />
                        Quick Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button 
                        onClick={() => setSelectedTab("connect")}
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <Globe className="w-4 h-4 mr-2" />
                        Connect Custom Domain
                      </Button>
                      <Button 
                        onClick={() => setSelectedTab("dns")}
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Configure DNS
                      </Button>
                      <Button 
                        onClick={() => setSelectedTab("ssl")}
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        SSL Certificate
                      </Button>
                      <Button 
                        onClick={() => setSelectedTab("search")}
                        className="w-full justify-start"
                        variant="outline"
                      >
                        <Search className="w-4 h-4 mr-2" />
                        Buy New Domain
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Connect Domain Tab */}
            {selectedTab === "connect" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Connect Your Custom Domain</CardTitle>
                    <CardDescription>Point your domain to your CV2Web website</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Domain Name</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={customDomain}
                          onChange={(e) => setCustomDomain(e.target.value)}
                          placeholder="yourname.com"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                        />
                        <Button 
                          onClick={handleConnectDomain}
                          disabled={!customDomain || isConnecting}
                        >
                          {isConnecting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Connecting...
                            </>
                          ) : (
                            <>
                              <Link2 className="w-4 h-4 mr-2" />
                              Connect
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    {customDomain && domainStatus !== "verified" && (
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg dark:bg-amber-950 dark:border-amber-800">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">DNS Setup Required</p>
                            <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                              After connecting, you'll need to update your domain's DNS settings
                            </p>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="mt-2"
                              onClick={() => setSelectedTab("dns")}
                            >
                              View DNS Instructions
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Domain Validation Steps */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900 dark:text-white">Connection Steps:</h4>
                      <div className="space-y-2">
                        {[
                          { step: 1, text: "Enter your domain name", completed: !!customDomain },
                          { step: 2, text: "Verify domain ownership", completed: domainStatus === "verified" },
                          { step: 3, text: "Configure DNS settings", completed: isDNSConfigured },
                          { step: 4, text: "SSL certificate installation", completed: domainStatus === "verified" },
                        ].map((item) => (
                          <div key={item.step} className="flex items-center gap-3">
                            <div className={cn(
                              "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                              item.completed 
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                            )}>
                              {item.completed ? <Check className="w-3 h-3" /> : item.step}
                            </div>
                            <span className={cn(
                              "text-sm",
                              item.completed 
                                ? "text-green-800 dark:text-green-200" 
                                : "text-gray-600 dark:text-gray-400"
                            )}>
                              {item.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* DNS Settings Tab */}
            {selectedTab === "dns" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>DNS Configuration</CardTitle>
                    <CardDescription>Configure your domain's DNS settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* DNS Records */}
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">Required DNS Records</h4>
                      <div className="space-y-3">
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-mono text-sm">A Record</span>
                            <Badge variant="secondary">Required</Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                            <div>
                              <span className="text-gray-500">Name:</span>
                              <span className="ml-2 font-mono">@</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Value:</span>
                              <span className="ml-2 font-mono">185.199.108.153</span>
                            </div>
                            <div>
                              <span className="text-gray-500">TTL:</span>
                              <span className="ml-2 font-mono">3600</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-mono text-sm">CNAME Record</span>
                            <Badge variant="secondary">Required</Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                            <div>
                              <span className="text-gray-500">Name:</span>
                              <span className="ml-2 font-mono">www</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Value:</span>
                              <span className="ml-2 font-mono">{customDomain || "yourname.com"}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">TTL:</span>
                              <span className="ml-2 font-mono">3600</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* DNS Status Check */}
                    <div className="p-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium text-gray-900 dark:text-white">DNS Propagation Status</h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Check if your DNS changes have propagated</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Check Status
                        </Button>
                      </div>
                    </div>

                    {/* Provider-specific guides */}
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">Setup Guides</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {[
                          { name: "Cloudflare", logo: "☁️" },
                          { name: "GoDaddy", logo: "🌐" },
                          { name: "Namecheap", logo: "💰" },
                          { name: "Google Domains", logo: "🔍" },
                          { name: "AWS Route 53", logo: "☁️" },
                          { name: "Other Providers", logo: "⚙️" },
                        ].map((provider) => (
                          <Button key={provider.name} variant="outline" className="justify-start">
                            <span className="mr-2">{provider.logo}</span>
                            {provider.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* SSL/Security Tab */}
            {selectedTab === "ssl" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-green-600" />
                        SSL Certificate Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg dark:bg-green-950 dark:border-green-800">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="font-medium text-green-800 dark:text-green-200">SSL Active</span>
                        </div>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          Your website is secured with a valid SSL certificate
                        </p>
                        <div className="mt-3 space-y-1 text-xs text-green-600 dark:text-green-400">
                          <p>Certificate Authority: Let's Encrypt</p>
                          <p>Valid Until: March 15, 2024</p>
                          <p>Grade: A+</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start">
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Renew Certificate
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Download className="w-4 h-4 mr-2" />
                          Download Certificate
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-blue-600" />
                        Security Features
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        {[
                          { name: "HTTPS Redirect", enabled: true, description: "Automatically redirect HTTP to HTTPS" },
                          { name: "HSTS", enabled: true, description: "HTTP Strict Transport Security" },
                          { name: "DDoS Protection", enabled: true, description: "Basic DDoS protection included" },
                          { name: "WAF", enabled: false, description: "Web Application Firewall (Premium)" },
                        ].map((feature) => (
                          <div key={feature.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 dark:text-white">{feature.name}</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">{feature.description}</p>
                            </div>
                            <div className={cn(
                              "w-10 h-6 rounded-full relative transition-colors",
                              feature.enabled ? "bg-green-500" : "bg-gray-300"
                            )}>
                              <div className={cn(
                                "w-4 h-4 bg-white rounded-full absolute top-1 transition-transform",
                                feature.enabled ? "translate-x-5" : "translate-x-1"
                              )} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {selectedTab === "analytics" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { label: "Total Visits", value: "2,847", change: "+12%", color: "blue" },
                    { label: "Unique Visitors", value: "1,923", change: "+8%", color: "green" },
                    { label: "Page Views", value: "4,231", change: "+15%", color: "purple" },
                    { label: "Avg. Session", value: "2m 34s", change: "+5%", color: "orange" },
                  ].map((stat) => (
                    <Card key={stat.label}>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                          <p className={cn(
                            "text-xs",
                            stat.color === "blue" && "text-blue-600",
                            stat.color === "green" && "text-green-600",
                            stat.color === "purple" && "text-purple-600",
                            stat.color === "orange" && "text-orange-600"
                          )}>
                            {stat.change} from last month
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Domain Performance</CardTitle>
                    <CardDescription>Last 30 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">Analytics Chart Placeholder</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Search Domain Tab */}
            {selectedTab === "search" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Find Your Perfect Domain</CardTitle>
                    <CardDescription>Search and register a new domain for your website</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={searchDomain}
                        onChange={(e) => setSearchDomain(e.target.value)}
                        placeholder="Search for a domain..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                      />
                      <Button>
                        <Search className="w-4 h-4 mr-2" />
                        Search
                      </Button>
                    </div>

                    {searchDomain && (
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-900 dark:text-white">Suggestions for "{searchDomain}":</h4>
                        <div className="space-y-2">
                          {domainSuggestions.map((suggestion, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className={cn(
                                  "w-3 h-3 rounded-full",
                                  suggestion.available ? "bg-green-500" : "bg-red-500"
                                )} />
                                <span className="font-mono text-sm">{suggestion.domain}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-600 dark:text-gray-400">{suggestion.price}</span>
                                {suggestion.available ? (
                                  <Button size="sm">
                                    <ShoppingCart className="w-4 h-4 mr-1" />
                                    Buy
                                  </Button>
                                ) : (
                                  <Button size="sm" variant="secondary" disabled>
                                    Unavailable
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>

        {/* Domain Health Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-600" />
              Domain Health Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg dark:bg-green-950 dark:border-green-800">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800 dark:text-green-200">DNS Status</span>
                </div>
                <p className="text-xs text-green-700 dark:text-green-300">All records configured</p>
              </div>
              
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-950 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-200">SSL Certificate</span>
                </div>
                <p className="text-xs text-blue-700 dark:text-blue-300">Valid & Active</p>
              </div>
              
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg dark:bg-purple-950 dark:border-purple-800">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800 dark:text-purple-200">Performance</span>
                </div>
                <p className="text-xs text-purple-700 dark:text-purple-300">Excellent (A+ Grade)</p>
              </div>

              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg dark:bg-orange-950 dark:border-orange-800">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800 dark:text-orange-200">Security</span>
                </div>
                <p className="text-xs text-orange-700 dark:text-orange-300">Fully Protected</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderFeedbackContent = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-950/50 dark:to-teal-950/50 rounded-xl p-6 border border-green-100 dark:border-green-800">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Help & Feedback
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          We'd love to hear from you! Send us your feedback or get help
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Send Feedback</CardTitle>
            <CardDescription>Help us improve CV2Web</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Subject</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>General Feedback</option>
                <option>Bug Report</option>
                <option>Feature Request</option>
                <option>Account Issue</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea 
                rows={4}
                placeholder="Tell us what you think..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button className="w-full">Send Feedback</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Get Help</CardTitle>
            <CardDescription>Common questions and support</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Documentation
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Community Forum
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderPageContent = () => {
    switch (activePage) {
      case "overview":
        return renderOverviewContent()
      case "website":
        return <MyWebsitePage />
      case "resume":
        return <MyResumePage />
      case "cv-editor":
        return <CVEditor userName={userName} />
      case "account":
        return <ProfilePage />
      case "domain":
        return renderDomainContent()
      case "feedback":
        return renderFeedbackContent()
      default:
        return renderOverviewContent()
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Left Sidebar - WORKING VERSION */}
      <div className={`${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out fixed md:relative z-30 w-64 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col`}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-br from-blue-50/50 to-purple-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 via-sky-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">CV</span>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-emerald-500 via-sky-400 to-blue-600 rounded-xl blur opacity-25"></div>
              </div>
              <div>
                <h1 className="font-bold text-xl bg-gradient-to-r from-emerald-600 via-sky-600 to-blue-600 bg-clip-text text-transparent">
                  CV2Web
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Professional Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {onBackToHome && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBackToHome}
                  className="hidden md:flex items-center space-x-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm">Home</span>
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src="/placeholder-user.jpg" alt={userName} />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
                {userName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-gray-900 dark:text-white truncate">{userName}</h2>
              <Badge variant="secondary" className="text-xs bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 dark:from-yellow-900 dark:to-yellow-800 dark:text-yellow-200">
                ⭐ Premium Plan
              </Badge>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = activePage === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`group w-full flex items-center space-x-3 px-3 py-3 text-left rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-50 via-sky-50 to-blue-50 text-emerald-700 border border-emerald-200 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white hover:shadow-sm'
                }`}
              >
                <Icon className={`w-5 h-5 transition-colors ${
                  isActive 
                    ? 'text-emerald-600' 
                    : 'group-hover:text-gray-700 dark:group-hover:text-gray-200'
                }`} />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full"></div>
                )}
              </button>
            )
          })}

          {/* Premium Features Section */}
          <div className="pt-6">
            <div className="px-3 mb-3">
              <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                Premium Features
              </h3>
            </div>
            {premiumFeatures.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 text-left rounded-lg transition-colors duration-200 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium flex-1">{item.label}</span>
                  <Star className="w-3 h-3 text-yellow-500" />
                </button>
              )
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            <p>© 2024 CV2Web</p>
            <p className="mt-1">Version 2.1.0</p>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="font-semibold text-gray-900 dark:text-white">
              {navigationItems.find(item => item.id === activePage)?.label || 'Dashboard'}
            </h1>
            {onBackToHome ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBackToHome}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            ) : (
              <div className="w-9" />
            )}
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {renderPageContent()}
          </div>
        </main>
      </div>

      {/* Upload Flow Modals */}
      <ResumeFlowModal
        isOpen={isResumeFlowOpen}
        onClose={() => setIsResumeFlowOpen(false)}
        onContinue={handleResumeFlowContinue}
      />

      <UploadResume
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onBack={() => {
          setIsUploadOpen(false)
          setIsResumeFlowOpen(true)
        }}
        onSuccess={handleUploadSuccess}
      />

      {currentJobId && (
        <ProcessingPage
          isOpen={isProcessingOpen}
          jobId={currentJobId}
          onComplete={handleProcessingComplete}
          onTemplateSelect={(templateId) => {
            console.log('Template selected:', templateId)
            // Store the selected template if needed
          }}
        />
      )}

    </div>
  )
}