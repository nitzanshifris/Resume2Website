"use client"

import type React from "react"

import { useState, useEffect, useRef, useLayoutEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ArrowDown, Menu, X } from "lucide-react"
import { MacBookFrame } from "@/components/macbook-frame"
import IPhoneFrame from "@/components/iphone-frame"
import { cn } from "@/lib/utils"
import Typewriter from "typewriter-effect"
import { LinkPreview } from "@/components/ui/link-preview"
import StackedCardsCarousel from "@/components/stacked-cards-carousel"
import SeeTheDifference from "@/components/see-the-difference"
import FAQ from "@/components/faq"
import { UGCReelsShowcase } from "@/components/ugc-reels-showcase"
import ResumeFlowModal from "@/components/resume-flow-modal"
import UploadResume from "@/components/upload-resume"
import ResumeBuilder from "@/components/resume-builder"
import InteractiveCVPile from "@/components/interactive-cv-pile"
import ProcessingPage from "@/components/processing-page"
import SimpleDashboard from "@/components/simple-dashboard"
import PortfolioHeroPreview from "@/components/portfolio-hero-preview-wrapper"
import AuthModal from "@/components/auth-modal-new"
import PricingSelector from "@/components/pricing-selector"
import ErrorToast from "@/components/ui/error-toast"
import { useAuthContext } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import dynamic from 'next/dynamic'
import { uploadFile, extractCVData, claimAnonymousCV, API_BASE_URL } from "@/lib/api"

// Linear progress milestones - evenly distributed for predictable progress
const PROGRESS_MILESTONES = {
  UPLOAD_START: 5,      // Quick visual start
  UPLOAD_COMPLETE: 15,  // File upload (fast)
  EXTRACTION_START: 20, // CV processing begins
  EXTRACTION_COMPLETE: 45, // CV analysis (major step)
  GENERATION_START: 50, // Portfolio generation begins  
  GENERATION_COMPLETE: 60, // Portfolio ready (stops at 60% as designed)
} as const

// Timing constants - realistic durations for smooth linear progress
const TIMINGS = {
  UPLOAD_ANIMATION: 500,      // 0.5 second for upload progress (5% → 15%)
  EXTRACTION_ANIMATION: 2000, // 2 seconds for CV extraction (15% → 45%) 
  GENERATION_ANIMATION: 1500, // 1.5 seconds for portfolio generation (45% → 60%)
  FINAL_ANIMATION: 300,       // Quick final animation
  PORTFOLIO_DISPLAY_DELAY: 800, // Shorter delay before showing portfolio
  IFRAME_TIMEOUT_LOCAL: 10000,
  IFRAME_TIMEOUT_REMOTE: 5000,
} as const

// Client-only RoughNotation to prevent hydration issues
const ClientRoughNotation = dynamic(
  () => import('react-rough-notation').then(mod => mod.RoughNotation),
  { 
    ssr: false,
    loading: () => <span className="text-gray-600 italic inline-block">static résumé</span>
  }
)

const renderColoredTypewriterText = (text: string, colorSegments: { text: string; color: string }[]) => {
  let result = text
  colorSegments.forEach(({ text: segmentText, color }) => {
    if (color.includes("gradient")) {
      result = result.replace(
        segmentText,
        `<span style="background: ${color}; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-weight: bold; font-style: italic;">${segmentText}</span>`,
      )
    } else {
      result = result.replace(segmentText, `<span style="color: ${color}; font-weight: bold;">${segmentText}</span>`)
    }
  })
  return <span suppressHydrationWarning dangerouslySetInnerHTML={{ __html: result }} />
}

const TypewriterText = ({ text, delay, className }: { text: string; delay: number; className?: string }) => {
  return (
    <div className={className}>
    <Typewriter
      options={{
        strings: text,
        autoStart: true,
        loop: false,
        delay: delay,
        cursor: "",
        }}
      />
    </div>
  )
}

// Iframe component with fallback handling and timeout
const IframeWithFallback = ({ src, title, className }: { src: string; title: string; className: string }) => {
  const [loadError, setLoadError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showFallback, setShowFallback] = useState(false)
  
  useEffect(() => {
    console.log('🖼️ IframeWithFallback initialized with URL:', src)
    
    // Check if URL is localhost
    const isLocalhost = src.includes('localhost')
    const isProduction = typeof window !== 'undefined' && !window.location.hostname.includes('localhost')
    
    // For localhost URLs from production, show fallback immediately
    if (isLocalhost && isProduction) {
      console.log('🌐 Cross-origin detected: production → localhost, showing fallback immediately')
      setLoadError(true)
      setIsLoading(false)
      setShowFallback(true)
      return
    }
    
    // For Vercel URLs, we now allow iframe embedding since we've configured CSP headers
    // The templates have frame-ancestors * which allows embedding from anywhere
    
    // Set a timeout to show fallback if iframe doesn't load (for any reason)
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.log('⏰ Iframe timeout - showing fallback')
        setLoadError(true)
        setIsLoading(false)
        setShowFallback(true)
      }
    }, 8000) // Give Vercel deployments more time to load
    
    return () => clearTimeout(timeout)
  }, [isLoading, src])
  
  return (
    <div className="relative w-full h-full">
      {!loadError && !showFallback && (
        <iframe
          src={src}
          title={title}
          className={className}
          style={{ backgroundColor: 'white' }}
          onLoad={() => {
            console.log('✅ Iframe loaded successfully for:', src)
            setIsLoading(false)
            setLoadError(false)
            setShowFallback(false)
          }}
          onError={(e) => {
            console.error('❌ Iframe failed to load:', src, e)
            setLoadError(true)
            setIsLoading(false)
            setShowFallback(true)
          }}
          // Enhanced security and compatibility settings for localhost
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-popups-to-escape-sandbox allow-top-navigation"
          referrerPolicy="no-referrer-when-downgrade"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      )}
      
      {/* Loading indicator */}
      {isLoading && !loadError && (
        <div className="absolute inset-0 flex items-center justify-center bg-white">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your portfolio...</p>
          </div>
        </div>
      )}
      
      {/* Error/Timeout fallback */}
      {(loadError || showFallback) && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="text-center p-8 max-w-lg">
            <div className="mb-6">
              {/* Success checkmark animation */}
              <div className="w-20 h-20 mx-auto mb-4 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
                <div className="relative w-full h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {src.includes('.vercel.app') ? '🎉 Deployed to Vercel!' : 'Portfolio Generated Successfully!'}
              </h3>
              
              <p className="text-gray-600 mb-4">
                Your portfolio is live and ready to share!
              </p>
              
              {/* URL display with copy button */}
              <div className="bg-gray-100 rounded-lg p-3 mb-4">
                <p className="text-xs text-gray-500 mb-1">Portfolio URL:</p>
                <div className="flex items-center justify-between bg-white rounded border border-gray-200 p-2">
                  <span className="font-mono text-xs text-gray-700 truncate flex-1 mr-2">{src}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(src)
                      // Could add a toast notification here
                    }}
                    className="text-gray-500 hover:text-gray-700 p-1"
                    title="Copy URL"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <p className="text-xs text-gray-500 mb-4">
                {src.includes('.vercel.app') 
                  ? '🔒 For security, Vercel blocks iframe embedding. Open in a new tab to view.' 
                  : '🔒 Browser security prevents embedding localhost in frames.'}
              </p>
            </div>
            
            <div className="space-y-3">
              <a
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span className="inline-flex items-center">
                  Open Portfolio in New Tab
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </span>
              </a>
              
              <p className="text-xs text-gray-400">
                Pro tip: Share this URL with anyone to showcase your portfolio!
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Direct link overlay - always visible */}
      <div className="absolute top-4 right-4 z-10">
        <a 
          href={src} 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-black/70 text-white px-3 py-1 rounded text-sm hover:bg-black/90 transition-colors backdrop-blur-sm"
        >
          Open in New Tab ↗
        </a>
      </div>
    </div>
  )
}

// CV Card Component with macOS Effects - DIRECT SVG EMBED
const CVCard = ({ className = "", withMacOSEffects = false, onClick }: { className?: string; withMacOSEffects?: boolean; onClick?: () => void }) => {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <div 
      className={cn("relative cursor-pointer transition-transform duration-200 hover:scale-[1.02] group", className)}
      onClick={onClick}
      style={{ pointerEvents: 'auto' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {withMacOSEffects && (
        <>
          {/* Static Background stacked CVs */}
          <div className="absolute -top-8 -right-4 w-[98%] h-full md:h-full sm:h-[388px] rounded-xl bg-white/80 shadow-lg transform rotate-6" style={{ zIndex: 0 }} />
          <div className="absolute -top-6 -left-4 w-[98%] h-full md:h-full sm:h-[388px] rounded-xl bg-white/90 shadow-lg transform -rotate-6" style={{ zIndex: 1 }} />
        </>
      )}
      
      {/* Floating Animation Container - Only for front CV */}
      <motion.div
        animate={withMacOSEffects ? {
          y: [0, -16, 0],
          rotateX: [0, 4, 0],
          rotateY: [0, 3, 0],
        } : {}}
        transition={withMacOSEffects ? {
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        } : {}}
        className="relative z-10"
      >
        {withMacOSEffects && (
          <>
            {/* Outer glow layer */}
            <motion.div
              className="absolute -inset-[6px] rounded-xl blur-md"
              style={{
                background: "linear-gradient(45deg, rgba(16, 185, 129, 0.4), rgba(56, 189, 248, 0.4), rgba(59, 130, 246, 0.4))",
                zIndex: 2,
              }}
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            
            {/* Middle glow layer */}
            <motion.div
              className="absolute -inset-[4px] rounded-xl blur-sm"
              style={{
                background: "linear-gradient(45deg, rgba(16, 185, 129, 0.5), rgba(56, 189, 248, 0.5), rgba(59, 130, 246, 0.5))",
                zIndex: 3,
              }}
              animate={{
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.2,
              }}
            />

            {/* Inner border layer */}
            <motion.div
              className="absolute -inset-[2px] rounded-xl"
              style={{
                background: "linear-gradient(45deg, rgba(16, 185, 129, 0.6), rgba(56, 189, 248, 0.6), rgba(59, 130, 246, 0.6))",
                zIndex: 4,
                padding: "2px",
              }}
              animate={{
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.4,
              }}
            >
              <div className="absolute inset-0 rounded-lg bg-white" />
            </motion.div>

            {/* Enhanced hover glow - Desktop only */}
            <motion.div
              className="absolute -inset-[8px] rounded-xl blur-lg hidden md:block"
              style={{
                background: "linear-gradient(135deg, rgba(16, 185, 129, 0.8), rgba(56, 189, 248, 0.8), rgba(59, 130, 246, 0.8))",
                zIndex: 1,
              }}
              animate={{
                opacity: isHovered ? [0, 0.9, 0.7] : 0,
                scale: isHovered ? [0.95, 1.05, 1] : 1,
              }}
              transition={{
                duration: isHovered ? 0.6 : 0.3,
                ease: "easeOut",
              }}
            />
          </>
        )}

        <Card className={cn("bg-white shadow-xl overflow-hidden relative z-10", withMacOSEffects && "backdrop-blur-sm")}>
          {/* Enhanced macOS-style shadow and border */}
          {withMacOSEffects && (
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 via-transparent to-black/5 pointer-events-none" />
          )}
          
          <div className="w-full h-full flex items-center justify-center">
            <svg viewBox="0 0 816 1000" className="w-full h-full object-cover" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
              <defs>
                <clipPath id="clip0_1_2">
                  <rect width="816" height="1000" fill="white" />
                </clipPath>
              </defs>
              <g clipPath="url(#clip0_1_2)">
                <rect width="816" height="1000" fill="white" />
                
                {/* Header Section */}
                <rect x="0" y="0" width="816" height="120" fill="#1e40af" />
                <text x="408" y="50" textAnchor="middle" fill="white" fontSize="36" fontWeight="bold">
                  ALEX MORGAN
                    </text>
                <text x="408" y="85" textAnchor="middle" fill="white" fontSize="18">
                  Senior Software Engineer
                    </text>
                
                {/* Contact Info */}
                <text x="408" y="150" textAnchor="middle" fill="#6b7280" fontSize="12">
                  alex.morgan@email.com | (555) 123-4567 | San Francisco, CA | LinkedIn: /in/alexmorgan
                    </text>

                {/* Professional Summary */}
                <text x="48" y="200" fill="#1e40af" fontSize="18" fontWeight="bold">
                  PROFESSIONAL SUMMARY
                    </text>
                <line x1="48" y1="210" x2="768" y2="210" stroke="#1e40af" strokeWidth="2" />
                <text x="48" y="235" fill="#374151" fontSize="11">
                  Innovative Senior Software Engineer with 8+ years of experience developing scalable cloud applications and leading engineering
                </text>
                <text x="48" y="250" fill="#374151" fontSize="11">
                  teams. Specialized in microservices architecture, distributed systems, and DevOps practices. Proven track record of delivering
                </text>
                <text x="48" y="265" fill="#374151" fontSize="11">
                  high-performance solutions that drive business growth and operational efficiency.
                    </text>

                {/* Technical Skills */}
                <text x="48" y="310" fill="#1e40af" fontSize="18" fontWeight="bold">
                  TECHNICAL SKILLS
                    </text>
                <line x1="48" y1="320" x2="768" y2="320" stroke="#1e40af" strokeWidth="2" />
                
                {/* Skills badges */}
                <rect x="48" y="335" width="60" height="20" fill="#e5e7eb" rx="10" />
                <text x="78" y="348" textAnchor="middle" fill="#374151" fontSize="10">Python</text>
                
                <rect x="118" y="335" width="70" height="20" fill="#e5e7eb" rx="10" />
                <text x="153" y="348" textAnchor="middle" fill="#374151" fontSize="10">JavaScript</text>
                
                <rect x="198" y="335" width="75" height="20" fill="#e5e7eb" rx="10" />
                <text x="235" y="348" textAnchor="middle" fill="#374151" fontSize="10">TypeScript</text>
                
                <rect x="283" y="335" width="40" height="20" fill="#e5e7eb" rx="10" />
                <text x="303" y="348" textAnchor="middle" fill="#374151" fontSize="10">Go</text>
                
                <rect x="333" y="335" width="45" height="20" fill="#e5e7eb" rx="10" />
                <text x="355" y="348" textAnchor="middle" fill="#374151" fontSize="10">Java</text>
                
                <rect x="388" y="335" width="45" height="20" fill="#e5e7eb" rx="10" />
                <text x="410" y="348" textAnchor="middle" fill="#374151" fontSize="10">React</text>
                
                <rect x="443" y="335" width="55" height="20" fill="#e5e7eb" rx="10" />
                <text x="470" y="348" textAnchor="middle" fill="#374151" fontSize="10">Node.js</text>
                
                <rect x="508" y="335" width="50" height="20" fill="#e5e7eb" rx="10" />
                <text x="533" y="348" textAnchor="middle" fill="#374151" fontSize="10">Django</text>
                
                <rect x="568" y="335" width="40" height="20" fill="#e5e7eb" rx="10" />
                <text x="588" y="348" textAnchor="middle" fill="#374151" fontSize="10">AWS</text>
                
                <rect x="618" y="335" width="50" height="20" fill="#e5e7eb" rx="10" />
                <text x="643" y="348" textAnchor="middle" fill="#374151" fontSize="10">Docker</text>
                
                <rect x="678" y="335" width="70" height="20" fill="#e5e7eb" rx="10" />
                <text x="713" y="348" textAnchor="middle" fill="#374151" fontSize="10">Kubernetes</text>
                
                {/* Professional Experience */}
                <text x="48" y="390" fill="#1e40af" fontSize="18" fontWeight="bold">
                  PROFESSIONAL EXPERIENCE
                    </text>
                <line x1="48" y1="400" x2="768" y2="400" stroke="#1e40af" strokeWidth="2" />
                
                {/* Job 1 */}
                <text x="48" y="425" fill="#1e40af" fontSize="14" fontWeight="bold">
                  TECH INNOVATIONS INC.
                    </text>
                <text x="768" y="425" textAnchor="end" fill="#6b7280" fontSize="12">
                  Jan 2021 - Present
                </text>
                <text x="48" y="440" fill="#374151" fontSize="12" fontStyle="italic">
                  Senior Software Engineer | San Francisco, CA
                </text>
                
                <text x="60" y="460" fill="#374151" fontSize="10">
                  • Led development of cloud-native microservices architecture that improved system scalability by 300% and reduced
                </text>
                <text x="68" y="475" fill="#374151" fontSize="10">
                  operational costs by 40%
                </text>
                <text x="60" y="490" fill="#374151" fontSize="10">
                  • Architected and implemented real-time data processing pipeline handling 10TB+ daily, reducing data latency from hours to
                </text>
                <text x="68" y="505" fill="#374151" fontSize="10">
                  seconds
                </text>
                <text x="60" y="520" fill="#374151" fontSize="10">
                  • Mentored team of 6 junior engineers, implementing agile methodologies that increased sprint velocity by 35%
                </text>
                <text x="60" y="535" fill="#374151" fontSize="10">
                  • Spearheaded migration from monolithic architecture to containerized microservices, reducing deployment time from days to
                </text>
                <text x="68" y="550" fill="#374151" fontSize="10">
                  minutes
                </text>
                
                {/* Job 2 */}
                <text x="48" y="580" fill="#1e40af" fontSize="14" fontWeight="bold">
                  DATAFLOW SYSTEMS
                </text>
                <text x="768" y="580" textAnchor="end" fill="#6b7280" fontSize="12">
                  Mar 2018 - Dec 2020
                </text>
                <text x="48" y="595" fill="#374151" fontSize="12" fontStyle="italic">
                  Software Engineer | San Francisco, CA
                </text>
                
                <text x="60" y="615" fill="#374151" fontSize="10">
                  • Developed distributed data processing framework that scaled to handle 5 million transactions per minute
                </text>
                <text x="60" y="630" fill="#374151" fontSize="10">
                  • Implemented automated testing framework that increased code coverage from 65% to 92%
                </text>
                <text x="60" y="645" fill="#374151" fontSize="10">
                  • Optimized database queries and implemented caching strategies, improving application response time by 75%
                </text>
                
                {/* Job 3 */}
                <text x="48" y="675" fill="#1e40af" fontSize="14" fontWeight="bold">
                  CLOUD SOLUTIONS LLC
                </text>
                <text x="768" y="675" textAnchor="end" fill="#6b7280" fontSize="12">
                  Jun 2016 - Feb 2018
                </text>
                <text x="48" y="690" fill="#374151" fontSize="12" fontStyle="italic">
                  Junior Software Developer | Oakland, CA
                </text>
                
                <text x="60" y="710" fill="#374151" fontSize="10">
                  • Contributed to development of cloud-based CRM system serving 50,000+ users
                </text>
                <text x="60" y="725" fill="#374151" fontSize="10">
                  • Built RESTful APIs and integrations with third-party services
                </text>
                <text x="60" y="740" fill="#374151" fontSize="10">
                  • Implemented responsive UI components using React and Redux
                </text>
                
                {/* Education */}
                <text x="48" y="780" fill="#1e40af" fontSize="18" fontWeight="bold">
                  EDUCATION
                </text>
                <line x1="48" y1="790" x2="768" y2="790" stroke="#1e40af" strokeWidth="2" />
                
                <text x="48" y="815" fill="#374151" fontSize="12" fontWeight="bold">
                  Master of Science in Computer Science
                </text>
                <text x="48" y="830" fill="#1e40af" fontSize="11">
                  University of California, Berkeley
                </text>
                <text x="48" y="845" fill="#6b7280" fontSize="10">
                  Specialization in Distributed Systems | GPA: 3.8/4.0 | 2016
                </text>
                
                <text x="48" y="870" fill="#374151" fontSize="12" fontWeight="bold">
                  Bachelor of Science in Computer Science
                </text>
                <text x="48" y="885" fill="#1e40af" fontSize="11">
                  Stanford University
                </text>
                <text x="48" y="900" fill="#6b7280" fontSize="10">
                  Minor in Mathematics | GPA: 3.7/4.0 | 2014
                </text>
                
                {/* Projects & Open Source */}
                <text x="48" y="940" fill="#1e40af" fontSize="18" fontWeight="bold">
                  PROJECTS &amp; OPEN SOURCE
                </text>
                <line x1="48" y1="950" x2="768" y2="950" stroke="#1e40af" strokeWidth="2" />
                
                <text x="48" y="975" fill="#374151" fontSize="12" fontWeight="bold">
                  Distributed Cache Framework (GitHub)
                </text>
                <text x="48" y="990" fill="#6b7280" fontSize="10">
                  Open-source distributed caching system with 2,000+ stars
                </text>
                
                <text x="48" y="1015" fill="#374151" fontSize="12" fontWeight="bold">
                  Real-time Analytics Dashboard
                </text>
                <text x="48" y="1030" fill="#6b7280" fontSize="10">
                  Visualization tool for streaming data analytics
                    </text>
              </g>
            </svg>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

// Simplified Typewriter Component - No more complex phases
const SimpleTypewriter = ({ 
  finalText, 
  className,
  speed = 60,
  showCursor = false
}: { 
  finalText: string;
  className?: string;
  speed?: number;
  showCursor?: boolean;
}) => {
  const [displayText, setDisplayText] = useState("")
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      if (index < finalText.length) {
        setDisplayText(finalText.slice(0, index + 1))
        index++
      } else {
        setIsComplete(true)
        clearInterval(interval)
      }
    }, speed)

    return () => clearInterval(interval)
  }, [finalText, speed])

  // Convert \n to actual line breaks and apply styling
  const renderText = () => {
    const lines = finalText.split('\n')
    
    return lines.map((line, index) => {
      // Check if line contains "Boring Resume" and apply LinkPreview
      if (line.includes('Boring Resume')) {
        const parts = line.split('Boring Resume')
        return (
          <div key={index} className="relative z-50">
            {parts[0]}
            <LinkPreview
              url="https://www.forbes.com/sites/eliamdur/2024/12/14/your-rsum-is-b-o-r-i-n-g-so-are-99-heres-why/"
              width={400}
              height={250}
            >
              <span className="bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 bg-clip-text text-transparent font-bold cursor-pointer">
                Boring Resume
              </span>
            </LinkPreview>
            {parts[1]}
          </div>
        )
      }
      
      // Check if line contains "3 Minutes to join the 2%" and style as subheadline
      if (line.includes('3 Minutes to join the 2%')) {
        return (
          <div key={index} className="text-base md:text-xl text-gray-600 font-medium mt-3 md:mt-4">
            3 Minutes to join the{" "}
            <span className="bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 bg-clip-text text-transparent font-bold">
              2%
            </span>
          </div>
        )
      }
      
      // Apply styling to other lines
      const styledLine = line
        .replace(/Take Control Now/g, '<span class="font-bold">Take Control Now</span>')
      
      return (
        <div key={index} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: styledLine }} />
      )
    })
  }

  return (
    <div className={className}>
      {renderText()}
      {showCursor && !isComplete && <span className="animate-pulse">|</span>}
    </div>
  )
}

// Vertical Progress Bar Component - Modern Glassmorphism Design
const VerticalProgressBar = ({ 
  onProgressChange, 
  externalProgress,
  isClickable = false,
  onCircleClick
}: { 
  onProgressChange?: (percentage: number) => void
  externalProgress?: number
  isClickable?: boolean
  onCircleClick?: () => void
}) => {
  const [percentage, setPercentage] = useState(0)
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  useEffect(() => {
    // Always use external progress when provided - no time-based animation
    if (externalProgress !== undefined) {
      const integerProgress = Math.floor(externalProgress)
      setPercentage(integerProgress)
      onProgressChange?.(integerProgress)
      return
    }
    
    // Only use time-based animation if no external progress is provided
    // This prevents conflicts between backend progress and time-based progress
    if (!isClient) return
    
    // Fallback time-based animation (only when no backend progress)
    const startTime = Date.now()
    const duration = 60000 // 60 seconds
    
    const updateProgress = () => {
      // Check again if external progress was provided during animation
      if (externalProgress !== undefined) {
        return // Stop time-based animation
      }
      
      const elapsed = Date.now() - startTime
      const progress = Math.min((elapsed / duration) * 60, 60)
      const newPercentage = Math.floor(progress)
      setPercentage(newPercentage)
      onProgressChange?.(newPercentage)
      
      if (progress < PROGRESS_MILESTONES.GENERATION_COMPLETE && externalProgress === undefined) {
        requestAnimationFrame(updateProgress)
      }
    }
    
    requestAnimationFrame(updateProgress)
  }, [onProgressChange, isClient, externalProgress])
  
  return (
    <div className="relative flex items-center justify-center h-full">
      {/* Ambient glow */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-emerald-500/30 via-sky-400/30 to-blue-600/30 blur-3xl rounded-full animate-pulse" />
      </div>
      
      {/* Glass container with centered elements */}
      <div className="relative w-20 h-96">
        {/* Progress Track - Narrower, centered within container */}
        <div className="absolute left-1/2 -translate-x-1/2 w-12 h-full rounded-full overflow-hidden">
          {/* Glass background */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full" />
          
          {/* Inner shadow for depth */}
          <div className="absolute inset-[2px] bg-black/10 rounded-full" />
          
          {/* Progress Fill - stops where the button center is */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 rounded-full overflow-hidden"
            initial={{ height: 0 }}
            animate={{ height: `${(percentage / 60) * 80}%` }} // Scale: 60 progress = 80% height
            transition={{ 
              type: "spring",
              stiffness: 40,
              damping: 15
            }}
          >
            {/* Gradient fill */}
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-500 via-sky-400 to-blue-600">
              {/* Animated shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent"
                animate={{
                  y: ["-100%", "100%"]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </div>
          </motion.div>
          
          {/* Subtle milestone marks */}
          {[20, 40, 60].map((milestone) => (
            <div
              key={milestone}
              className="absolute left-1 right-1 h-[1px] bg-white/20"
              style={{ bottom: `${milestone}%` }} // Direct percentage positions
            />
          ))}
        </div>
        
        {/* Traveling Percentage Button - centered on same axis as bar */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 w-20 h-20 z-30"
          initial={{ bottom: "-40px" }} // Start with center at bottom
          animate={{ bottom: `${(percentage * 384) / 100 - 40}px` }} // Direct percentage of bar height (384px)
          transition={{
            type: "spring",
            stiffness: 40,
            damping: 15
          }}
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 blur-xl opacity-70" />
          
          {/* Glass button */}
          <div 
            className={`relative w-full h-full rounded-full bg-white/30 backdrop-blur-lg border-2 border-white/40 shadow-2xl flex items-center justify-center ${
              isClickable && percentage >= 60 ? 'cursor-pointer hover:scale-110 transition-transform' : ''
            }`}
            onClick={() => {
              if (isClickable && percentage >= 60 && onCircleClick) {
                onCircleClick()
              }
            }}
          >
            {/* Inner glass layer */}
            <div className="absolute inset-[3px] rounded-full bg-gradient-to-br from-white/30 to-white/10" />
            
            {/* Percentage text */}
            <span className="relative z-10 text-2xl font-bold text-white drop-shadow-lg">
              {percentage}%
            </span>
            
            {/* Click indicator when ready */}
            {isClickable && percentage >= 60 && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-white"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// Type definition for standardized errors
interface StandardizedError {
  title: string
  message: string
  suggestion?: string
  isAuthError?: boolean
}

// Constant for custom event name to avoid typos
const RESUME_AUTO_START_EVENT = 'resume2web:autoStart'

// TypeScript declaration for window flags
declare global {
  interface Window {
    __isHandlingFileSelect?: boolean
    __autoStartListeners?: number
  }
}

// Resume2Website Demo Component - Mobile-First WOW Experience
function Resume2WebsiteDemo({ onOpenModal, setShowPricing, uploadedFile, setUploadedFile, onFileClick, handleFileSelect, signIn, setErrorToast, isRetrying, setIsRetrying }: { 
  onOpenModal: () => void; 
  setShowPricing: (value: boolean) => void;
  uploadedFile: File | null;
  setUploadedFile: (file: File | null) => void;
  onFileClick: (file: File) => void;
  handleFileSelect: (file: File) => void;
  signIn?: (sessionId: string, userData: any) => Promise<void>;
  setErrorToast: (toast: {
    isOpen: boolean;
    title: string;
    message: string;
    suggestion?: string;
  }) => void;
  isRetrying: boolean;
  setIsRetrying: (value: boolean) => void;
}) {
  // Helper function to parse error response and get standardized messages
  const getStandardizedError = (error: any): StandardizedError => {
    // Handle network errors, CORS, and fetch failures
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        title: 'Connection problem',
        message: 'Unable to connect to the server.',
        suggestion: 'Check your internet connection and try again.'
      }
    }
    
    // Handle AbortError (client-side timeout)
    if (error.name === 'AbortError' || (error instanceof Error && error.message.includes('AbortError'))) {
      return {
        title: 'Upload timed out',
        message: 'The connection took too long and the upload was interrupted.',
        suggestion: 'Check your network and try again; large files work best on a stable connection.'
      }
    }
    
    // Handle CORS errors
    if (error instanceof TypeError && (error.message.includes('CORS') || error.message.includes('cross-origin'))) {
      return {
        title: 'Connection blocked',
        message: 'The server blocked the connection for security reasons.',
        suggestion: 'Try refreshing the page or contact support if this persists.'
      }
    }
    
    // Handle Resume Gate errors with custom properties
    if (error.isResumeGateError) {
      return {
        title: 'Not a resume',
        message: error.resumeGateReason || "This file doesn't look like a resume (CV).",
        suggestion: error.resumeGateSuggestion || 'Use a resume with contact info and sections like Experience, Education, and Skills.'
      }
    }
    
    const errorMessage = error.message || 'File validation failed'
    const statusCode = error.statusCode || (errorMessage.includes('(401)') ? 401 : errorMessage.includes('(403)') ? 403 : errorMessage.includes('(400)') ? 400 : 500)
    
    // Check for specific error patterns in the message
    if (statusCode === 400 && (errorMessage.includes('resume') || errorMessage.includes('CV') || errorMessage.includes('Resume Gate'))) {
      // Check if we have more specific error details from backend
      if (errorMessage.includes("doesn't contain enough readable text")) {
        return {
          title: 'Not a resume',
          message: "The image doesn't contain enough readable text for a resume.",
          suggestion: 'Please upload a complete resume document or a high-quality scan with all resume sections visible.'
        }
      }
      if (errorMessage.includes("lacks the variety of content")) {
        return {
          title: 'Not a resume',
          message: "The image lacks the variety of content expected in a resume.",
          suggestion: 'Upload a full resume with multiple sections (Experience, Education, Skills, Contact info).'
        }
      }
      if (errorMessage.includes("missing core resume elements")) {
        return {
          title: 'Not a resume',
          message: "The image is missing core resume elements.",
          suggestion: 'Make sure your resume image includes both contact information and work experience.'
        }
      }
      // Default resume error
      return {
        title: 'Not a resume',
        message: "This file doesn't look like a resume (CV).",
        suggestion: 'Use a resume with contact info and sections like Experience, Education, and Skills.'
      }
    }
    
    if (statusCode === 400 && (errorMessage.includes('corrupted') || errorMessage.includes('unreadable'))) {
      return {
        title: 'Unsupported or corrupted file',
        message: "The file type doesn't match its contents or can't be read.",
        suggestion: 'Upload a PDF, DOC/DOCX, TXT, PNG, JPG, or WEBP exported directly from your editor.'
      }
    }
    
    if (statusCode === 401 || statusCode === 403 || errorMessage.includes('Authentication required')) {
      return {
        title: 'Sign in to continue',
        message: 'Creating a portfolio requires an account.',
        suggestion: 'Sign in to link this upload to your workspace.',
        isAuthError: true  // Special flag for auth errors, but still returns standard object
      }
    }
    
    if (statusCode === 408 || errorMessage.includes('timed out')) {
      return {
        title: 'Upload timed out',
        message: 'The connection took too long and the upload was interrupted.',
        suggestion: 'Check your network and try again; large files work best on a stable connection.'
      }
    }
    
    if (statusCode === 413 || errorMessage.includes('too large')) {
      return {
        title: 'File is too large',
        message: 'Maximum file size is 10 MB.',
        suggestion: 'Reduce the file size (export to PDF, compress images) and try again.'
      }
    }
    
    if (statusCode === 415 || errorMessage.includes('Unsupported')) {
      return {
        title: 'File type not supported',
        message: 'Supported types: PDF, DOC/DOCX, TXT, PNG, JPG, WEBP, RTF.',
        suggestion: 'Export your resume to one of the supported formats and re-upload.'
      }
    }
    
    if (statusCode === 429 || errorMessage.includes('rate limit')) {
      return {
        title: 'Too many uploads',
        message: "You've reached the upload limit for now.",
        suggestion: 'Please wait and try again later. Sign in for higher limits.'
      }
    }
    
    if (statusCode === 422 || errorMessage.includes('extract text')) {
      return {
        title: "Couldn't read the file",
        message: "We couldn't extract text from this file.",
        suggestion: 'Try a higher-quality scan or export a text-based PDF.'
      }
    }
    
    if (statusCode === 404) {
      return {
        title: 'Item not found',
        message: "We couldn't find that upload (it may have expired).",
        suggestion: 'Upload the file again to continue.'
      }
    }
    
    // Default 500 error
    return {
      title: 'Something went wrong',
      message: "We couldn't process the file due to a server error.",
      suggestion: 'Try again in a few minutes. If this keeps happening, export to PDF or contact support.'
    }
  }
  
  const [stage, setStage] = useState<
    "typewriter" | "intro" | "initial" | "morphing" | "dissolving" | "materializing" | "complete"
  >("typewriter")
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressBarPercentage, setProgressBarPercentage] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const [showStrikeThrough, setShowStrikeThrough] = useState(false)
  const [showCVCard, setShowCVCard] = useState(true)
  const [hasScrolledHero, setHasScrolledHero] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showNewTypewriter, setShowNewTypewriter] = useState(false)
  const headlineRef = useRef<HTMLDivElement>(null)
  const [headlineWidth, setHeadlineWidth] = useState<number | undefined>(undefined)
  const { isAuthenticated, sessionId } = useAuthContext()
  
  // Backend processing states
  const [portfolioUrl, setPortfolioUrl] = useState<string | null>(null)
  const [portfolioId, setPortfolioId] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingError, setProcessingError] = useState<string | null>(null)
  const [currentJobId, setCurrentJobId] = useState<string | null>(null)
  const [realProgress, setRealProgress] = useState(0)
  const [showPortfolioInMacBook, setShowPortfolioInMacBook] = useState(false)
  const [isRestoringPortfolio, setIsRestoringPortfolio] = useState(false)
  
  // Auth and signup modal states
  const [showSignupModal, setShowSignupModal] = useState(false)
  const [isWaitingForAuth, setIsWaitingForAuth] = useState(false)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  
  // Loading sequence states for mobile
  const [loadingStep, setLoadingStep] = useState(0) // 0: backgrounds, 1: headline, 2: subheadline, 3: cv image

  // Helper functions for stage checking
  const isTransformationStage = () => stage === "materializing" || stage === "complete"
  const isActiveStage = () => stage === "intro" || stage === "initial" || stage === "morphing" || stage === "dissolving" || stage === "materializing" || stage === "complete"
  const isTransformingStage = () => stage === "initial" || stage === "morphing" || stage === "dissolving" || stage === "materializing" || stage === "complete"

  // Detect mobile and set initial stage
  useEffect(() => {
    setIsHydrated(true)
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (!mobile && stage === "typewriter") {
        setStage("intro")
      }
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [stage])

  // Restore portfolio on page load - ONLY for authenticated users
  useEffect(() => {
    console.log('🔄 Portfolio restoration effect running. isHydrated:', isHydrated, 'sessionId:', sessionId)
    
    const restorePortfolio = async () => {
      if (!isHydrated) {
        console.log('⏳ Not hydrated yet, skipping restoration')
        return
      }
      
      // CRITICAL: Only restore portfolios for authenticated users
      if (!sessionId) {
        console.log('📦 No user session - skipping portfolio restoration')
        // Clear any lingering portfolio data
        localStorage.removeItem('lastPortfolio')
        return
      }
      
      console.log('✅ Authenticated user detected, proceeding with restoration')
      
      // Check URL params first (but still require auth)
      const urlParams = new URLSearchParams(window.location.search)
      const urlPortfolioId = urlParams.get('portfolio_id')
      const urlPortfolioUrl = urlParams.get('url')
      
      console.log('🔍 Checking URL params for user:', { urlPortfolioUrl, urlPortfolioId, sessionId })
      
      if (urlPortfolioUrl && sessionId) {
        // Direct URL in query params - verify it belongs to this user
        console.log('📦 Found portfolio URL in params, verifying ownership...')
        
        // For now, restore it if user is authenticated
        // TODO: Add backend validation to verify portfolio belongs to user
        setIsRestoringPortfolio(true)
        
        // Set all necessary states to show the portfolio
        setPortfolioUrl(urlPortfolioUrl)
        setRealProgress(60) // Show as completed
        setShowPortfolioInMacBook(true)
        setStage("complete") // Go directly to complete stage for restored portfolios
        setShowNewTypewriter(false) // Don't show typewriter animation for restored portfolios
        setIsPlaying(false) // No animation needed for restoration
        setShowCVCard(false) // Hide the CV card
        setUploadedFile(null) // Clear uploaded file to show portfolio instead of hero preview
        
        // Clear restoration state after a short delay
        setTimeout(() => {
          setIsRestoringPortfolio(false)
          setStage("complete") // Final stage
        }, 500)
        
        console.log('📦 Restored portfolio from URL for user:', urlPortfolioUrl)
        return
      }
      
      if (urlPortfolioId) {
        // Portfolio ID in query params - fetch details
        setIsRestoringPortfolio(true)
        try {
          const response = await fetch(`${API_BASE_URL}/api/v1/portfolio/${urlPortfolioId}/status`)
          if (response.ok) {
            const data = await response.json()
            if (data.custom_domain_url || data.url) {
              setPortfolioUrl(data.custom_domain_url || data.url)
              setPortfolioId(urlPortfolioId)
              setRealProgress(60)
              setShowPortfolioInMacBook(true)
              setStage("complete")
              setShowNewTypewriter(false) // Don't show typewriter animation for restored portfolios
              setUploadedFile(null) // Clear uploaded file to show portfolio instead of hero preview
              console.log('📦 Restored portfolio from ID:', data.custom_domain_url || data.url)
            }
          }
        } catch (error) {
          console.error('Failed to restore portfolio from ID:', error)
        }
        setIsRestoringPortfolio(false)
        return
      }
      
      // Check localStorage - but only for authenticated users
      if (sessionId) {
        const savedPortfolio = localStorage.getItem('lastPortfolio')
        if (savedPortfolio) {
          try {
            const portfolio = JSON.parse(savedPortfolio)
            // TODO: Verify this portfolio belongs to current user
            // For now, check if portfolio was saved with user ID
            if (portfolio.url && portfolio.userId === sessionId) {
              setIsRestoringPortfolio(true)
              
              // Set all necessary states to show the portfolio
              setPortfolioUrl(portfolio.url)
              setPortfolioId(portfolio.id)
              setRealProgress(60)
              setShowPortfolioInMacBook(true)
              setStage("complete") // Go directly to complete stage for restored portfolios
              setShowNewTypewriter(false) // Don't show typewriter animation for restored portfolios
              setIsPlaying(false) // No animation needed for restoration
              setShowCVCard(false) // Hide the CV card
              setUploadedFile(null) // Clear uploaded file to show portfolio instead of hero preview
              
              // Clear restoration state after a short delay
              setTimeout(() => {
                setIsRestoringPortfolio(false)
                setStage("complete")
              }, 500)
              
              console.log('📦 Restored portfolio from localStorage for user:', portfolio.url)
              return
            } else if (portfolio.url && !portfolio.userId) {
              // Old portfolio without user ID - clear it
              console.log('📦 Clearing old portfolio without user association')
              localStorage.removeItem('lastPortfolio')
            }
          } catch (error) {
            console.error('Failed to parse saved portfolio:', error)
            localStorage.removeItem('lastPortfolio')
          }
        }
      }
      
      // Last resort: fetch from backend if we have a valid session
      // The backend expects either a cookie-based session or X-Session-ID header
      if (sessionId) {
        setIsRestoringPortfolio(true)
        try {
          const response = await fetch(`${API_BASE_URL}/api/v1/portfolio/list`, {
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
              'X-Session-ID': sessionId // Pass the session ID in header
            }
          })
          
          // Only process if we get a successful response
          if (response.ok) {
            const data = await response.json()
            // Backend returns { status, portfolios, count } - extract the portfolios array
            const portfolios = data.portfolios
            if (portfolios && portfolios.length > 0) {
              const latest = portfolios[0] // Assuming sorted by date
              if (latest.custom_domain_url || latest.url) {
                const restoredUrl = latest.custom_domain_url || latest.url
                console.log('📦 Restoring portfolio from backend:', {
                  url: restoredUrl,
                  id: latest.portfolio_id || latest.id,
                  custom_domain: latest.custom_domain_url,
                  vercel_url: latest.url
                })
                setPortfolioUrl(restoredUrl)
                setPortfolioId(latest.portfolio_id || latest.id)
                setRealProgress(60)
                setShowPortfolioInMacBook(true)
                setStage("complete")
                setShowNewTypewriter(false) // Don't show typewriter animation for restored portfolios
                setUploadedFile(null) // Clear uploaded file to show portfolio instead of hero preview
                console.log('📦 Portfolio state set, should display:', restoredUrl)
              }
            }
          } else if (response.status === 401) {
            // Session expired or invalid - this is expected sometimes
            console.log('📦 Session invalid for portfolio fetch, skipping backend restoration')
          }
        } catch (error) {
          // Network error or other issue - not critical
          console.log('📦 Could not reach backend for portfolio restoration')
        }
        setIsRestoringPortfolio(false)
      }
    }
    
    restorePortfolio()
  }, [isHydrated, sessionId])

  // Sequential loading for mobile
  useEffect(() => {
    if (!isMobile) return
    
    // Start the sequence when stage changes from typewriter to intro
    if (stage === "intro" && loadingStep === 0) {
      // Step 0: Backgrounds load immediately, then trigger step 1
      const timer = setTimeout(() => setLoadingStep(1), 800) // Wait for backgrounds to complete
      return () => clearTimeout(timer)
    }
  }, [stage, isMobile, loadingStep])

  // Handle loading step progression
  const handleLoadingComplete = (step: number) => {
    if (step === loadingStep) {
      setLoadingStep(prev => prev + 1)
    }
  }

  // Typewriter effect
  useEffect(() => {
    if (stage === "typewriter") {
      // Mobile now transitions directly to intro after a delay instead of running typewriter
      const timer = setTimeout(() => setStage("intro"), 3000)
      return () => clearTimeout(timer)
    }
  }, [stage])

  // Main animation sequence
  useEffect(() => {
    if (!isPlaying) return
    
    // Don't restart animation if already complete
    if (stage === "complete") return

    const sequence = async () => {
      // Stage 1: CV Display (keep original content visible)
      setStage("initial")
      await new Promise((resolve) => setTimeout(resolve, 500))
      
      // Show strike-through animation on "PDF résumé"
      setShowStrikeThrough(true)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Don't stop the animation immediately - let it progress to show visual feedback
      // We'll check isWaitingForAuth later after showing some animation

      // Stage 2: Quick Morphing (still original content)
      setStage("morphing")
      await new Promise((resolve) => setTimeout(resolve, 1800))

      // Stage 3: Dissolution (still original content)
      setStage("dissolving")
      
      // Don't pause here anymore - let animation continue to MacBook stage
      // if (isWaitingForAuth) {
      //   console.log('⏸️ Animation paused at dissolving stage - waiting for authentication')
      //   return
      // }
      // Trigger text change FIRST, then hide strike-through
      setTimeout(() => {
        setShowNewTypewriter(true)  // Change text immediately
        // Then hide the strike-through after a tiny delay
        setTimeout(() => setShowStrikeThrough(false), 50)
      }, 1000)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Stage 4: Website Materialization (MacBook appears)
      setStage("materializing")
      await new Promise((resolve) => setTimeout(resolve, 1200))

      // Stage 5: Complete (final state)
      setStage("complete")
      
      // Check if we should pause for auth after showing the full animation
      if (isWaitingForAuth) {
        console.log('⏸️ Animation complete, waiting for authentication')
        // Keep isPlaying true to maintain the visual state
        return
      }
      
      setIsPlaying(false)
    }

    sequence()
  }, [isPlaying, isWaitingForAuth])

  // Progress tracking
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 1.5, 100))
      }, 50)
      return () => clearInterval(interval)
    }
  }, [isPlaying])

  // Auto-start animation listener will be added after handleFileClick is defined
  
  // Trigger new typewriter is now handled in the animation sequence
  // This useEffect is disabled to prevent duplicate triggers
  /*
  useEffect(() => {
    if (!isMobile && !showNewTypewriter && isPlaying && stage === "materializing") {
      const timer = setTimeout(() => {
        setShowNewTypewriter(true)
      }, 600) // Wait 600ms after materialization starts
      return () => clearTimeout(timer)
    }
  }, [isMobile, showNewTypewriter, isPlaying, stage])
  */

  useLayoutEffect(() => {
    if (headlineRef.current) {
      setHeadlineWidth(headlineRef.current.offsetWidth)
    }
  }, [stage])

  // Smooth continuous progress animation with asymptotic approach
  const animateSmoothProgress = useRef<{
    isRunning: boolean;
    startTime: number;
    expectedDuration: number;
    animationId: number | null;
    processComplete: boolean;
  }>({
    isRunning: false,
    startTime: 0,
    expectedDuration: 40000, // 40 seconds to reach near 60
    animationId: null,
    processComplete: false
  })

  const startSmoothProgress = () => {
    // Reset progress to 0 and start the smooth animation
    setRealProgress(0)
    
    animateSmoothProgress.current = {
      isRunning: true,
      startTime: Date.now(),
      expectedDuration: 40000, // 40 seconds expected
      animationId: null,
      processComplete: false
    }
    
    const updateProgress = () => {
      if (!animateSmoothProgress.current.isRunning) return
      
      const elapsed = Date.now() - animateSmoothProgress.current.startTime
      const expectedDuration = animateSmoothProgress.current.expectedDuration
      
      // If process completed, quickly go to 60
      if (animateSmoothProgress.current.processComplete) {
        setRealProgress(prev => {
          if (prev < 60) {
            // Animate quickly to 60
            const step = Math.min(3, 60 - prev) // Jump by 3 or remaining
            const newProgress = Math.min(60, prev + step)
            if (newProgress < 60) {
              setTimeout(() => updateProgress(), 100) // Fast updates
            }
            return newProgress
          }
          return 60
        })
        return
      }
      
      // Calculate smooth progress
      let targetProgress: number
      
      if (elapsed < expectedDuration) {
        // Linear progression from 0 to 55
        targetProgress = (elapsed / expectedDuration) * 55
      } else {
        // Asymptotic approach from 55 to 60
        // Using exponential decay: 60 - 5 * e^(-t)
        const overtime = (elapsed - expectedDuration) / 5000 // Scale overtime
        targetProgress = 60 - 5 * Math.exp(-overtime)
      }
      
      // Always show integers only
      const intProgress = Math.floor(targetProgress)
      
      // Never exceed 59 until process is complete
      const cappedProgress = Math.min(59, intProgress)
      
      // Only update if it's a new integer value
      setRealProgress(prev => {
        if (prev !== cappedProgress && cappedProgress > prev) {
          console.log(`📊 Progress: ${cappedProgress}%`)
          return cappedProgress
        }
        return prev
      })
      
      // Continue animation
      animateSmoothProgress.current.animationId = requestAnimationFrame(updateProgress)
    }
    
    // Start the animation
    updateProgress()
  }

  const completeSmoothProgress = () => {
    animateSmoothProgress.current.processComplete = true
  }

  const stopSmoothProgress = () => {
    animateSmoothProgress.current.isRunning = false
    if (animateSmoothProgress.current.animationId) {
      cancelAnimationFrame(animateSmoothProgress.current.animationId)
    }
  }

  // Keep the old function for backward compatibility but simplified
  const animateProgress = (from: number, to: number, duration: number = 1000) => {
    // This is now just used for specific jumps when needed
    setRealProgress(to)
  }

  // Process portfolio generation in the background
  const processPortfolioGeneration = async (file: File, skipValidation: boolean = false) => {
    try {
      setIsProcessing(true)
      setProcessingError(null)
      
      // Start the smooth continuous progress animation
      startSmoothProgress()
      
      // Step 1: Upload file
      console.log('📤 Uploading file...', file.name, file.size, 'bytes')
      
      const uploadResponse = await uploadFile(file)
      const jobId = uploadResponse.job_id
      setCurrentJobId(jobId)
      console.log('✅ Upload complete, job_id:', jobId)
      
      // Start extraction with proper timeout handling
      const extractStartTime = Date.now()
      
      // Check if CV was already extracted during upload (common for cached files)
      let extractionNeeded = true
      try {
        // First check if CV data already exists
        const checkResponse = await fetch(`${API_BASE_URL}/api/v1/cv/${jobId}`, {
          method: 'GET',
          headers: {
            'X-Session-ID': localStorage.getItem('resume2website_session_id') || ''
          }
        })
        
        if (checkResponse.ok) {
          const cvData = await checkResponse.json()
          if (cvData && cvData.cv_data && cvData.status === 'completed') {
            console.log('✅ CV already extracted during upload (cached), skipping extraction')
            extractionNeeded = false
          }
        }
      } catch (e) {
        console.log('Could not check CV status, will proceed with extraction')
      }
      
      // Only extract if needed
      if (extractionNeeded) {
        // Set a longer timeout for CV extraction (60 seconds)
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 60000)
        
        try {
          const extractResponse = await fetch(`${API_BASE_URL}/api/v1/extract/${jobId}`, {
            method: 'POST',
            headers: {
              'X-Session-ID': localStorage.getItem('resume2website_session_id') || ''
            },
            signal: controller.signal
          })
          
          clearTimeout(timeoutId)
          
          if (!extractResponse.ok) {
            throw new Error('Failed to extract CV data')
          }
        
          // Wait for response to ensure extraction completed
          const extractData = await extractResponse.json()
          console.log('✅ CV extraction response received:', extractData)
          console.log('✅ CV extraction complete')
        } catch (error) {
          clearTimeout(timeoutId)
          if (error instanceof Error && error.name === 'AbortError') {
            throw new Error('CV extraction timed out after 60 seconds')
          }
          throw error
        }
      }
      
      // Step 3: Generate portfolio - final step
      console.log('🎨 Generating portfolio...')
      const templates = ['v0_template_v1.5', 'v0_template_v2.1']
      const randomTemplate = templates[Math.floor(Math.random() * templates.length)]
      console.log('🎯 Selected template:', randomTemplate)
      
      const generateStartTime = Date.now()
      const generateUrl = `${API_BASE_URL}/api/v1/portfolio/generate/${jobId}`
      
      // Set timeout for portfolio generation (5 minutes for Vercel CLI deployment)
      const generateController = new AbortController()
      const generateTimeoutId = setTimeout(() => generateController.abort(), 300000) // 5 minutes
      
      try {
        const generateResponse = await fetch(generateUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': localStorage.getItem('resume2website_session_id') || ''
        },
        body: JSON.stringify({
          template: randomTemplate
        }),
        signal: generateController.signal
      })
      
      clearTimeout(generateTimeoutId)
      
      if (!generateResponse.ok) {
        const errorData = await generateResponse.json().catch(() => ({ detail: `HTTP ${generateResponse.status}` }))
        console.error('❌ Portfolio generation failed:', errorData)
        throw new Error(errorData.detail || 'Failed to generate portfolio')
      }
      
      const generateData = await generateResponse.json()
      
      // Calculate remaining time for smooth final animation
      const generateElapsed = Date.now() - generateStartTime
      const remainingGenerationTime = Math.max(200, TIMINGS.GENERATION_ANIMATION - generateElapsed)
      
      if (generateData.url || generateData.portfolio_url || generateData.custom_domain_url) {
        const portfolioUrl = generateData.custom_domain_url || generateData.url || generateData.portfolio_url
        const portfolioIdValue = generateData.portfolio_id || generateData.id
        
        setPortfolioUrl(portfolioUrl)
        setPortfolioId(portfolioIdValue)
        
        // Save to localStorage with user association
        localStorage.setItem('lastPortfolio', JSON.stringify({
          url: portfolioUrl,
          id: portfolioIdValue,
          userId: sessionId, // Associate with current user
          timestamp: Date.now()
        }))
        
        // Update URL without reload
        const newUrl = new URL(window.location.href)
        newUrl.searchParams.set('url', portfolioUrl)
        if (portfolioIdValue) {
          newUrl.searchParams.set('portfolio_id', portfolioIdValue)
        }
        window.history.pushState({}, '', newUrl)
        
        // Complete the smooth progress animation
        completeSmoothProgress()
        console.log('✅ Portfolio generated successfully:', portfolioUrl)
        
        // Show portfolio immediately with a small delay for UX
        setTimeout(() => {
          setShowPortfolioInMacBook(true)
          console.log('🖥️ Auto-showing portfolio in MacBook frame')
        }, TIMINGS.PORTFOLIO_DISPLAY_DELAY)
        
      } else {
        console.error('❌ No portfolio URL in response:', generateData)
        // Check if generation was successful but URL format is different
        if (generateData.status === 'success' && generateData.portfolio_id) {
          // Construct URL from available data - use the actual generated URL if available
          const baseUrl = generateData.url || generateData.portfolio_url || 'http://localhost:4000'
          setPortfolioUrl(baseUrl)
          completeSmoothProgress()
          console.log('✅ Portfolio generated successfully (constructed URL):', baseUrl)
          
          setTimeout(() => {
            setShowPortfolioInMacBook(true)
            console.log('🖥️ Auto-showing portfolio in MacBook frame')
          }, remainingGenerationTime + TIMINGS.PORTFOLIO_DISPLAY_DELAY)
        } else {
          // Only throw error if generation actually failed
          throw new Error('Portfolio generation succeeded but no URL returned')
        }
      }
      } catch (error) {
        clearTimeout(generateTimeoutId)
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error('Portfolio generation timed out after 5 minutes')
        }
        throw error
      }
      
    } catch (error) {
      console.error('❌ Processing error:', error)
      stopSmoothProgress()
      setProcessingError(error instanceof Error ? error.message : 'An error occurred')
      setIsProcessing(false)
      // Show error in UI using standardized ErrorToast
      const errorInfo = getStandardizedError(error)
      setErrorToast({
        isOpen: true,
        title: errorInfo.title,
        message: errorInfo.message,  
        suggestion: errorInfo.suggestion
      })
    }
  }
  
  const handleStartDemo = async () => {
    
    // Reset everything to initial state before starting
    setStage("typewriter")
    setProgress(0)
    setShowNewTypewriter(false)
    setShowStrikeThrough(false)
    setShowCVCard(true)
    setPortfolioUrl(null)
    setPortfolioId(null)
    // Clear saved state
    localStorage.removeItem('lastPortfolio')
    // Clear URL params
    const newUrl = new URL(window.location.href)
    newUrl.searchParams.delete('url')
    newUrl.searchParams.delete('portfolio_id')
    window.history.pushState({}, '', newUrl)
    setProcessingError(null)
    setRealProgress(0)
    
    // Validate file first before starting animation
    if (uploadedFile) {
      console.log('🔍 Validating file before starting demo...')
      try {
        // Upload and validate first
        const uploadResponse = await uploadFile(uploadedFile)
        setCurrentJobId(uploadResponse.job_id)
        console.log('✅ File validated, starting animation and processing')
        
        // Now start the animation
        setIsPlaying(true)
        
        // Start full backend processing
        processPortfolioGeneration(uploadedFile, true) // Skip validation since we just did it
      } catch (error: any) {
        // Don't log to console - we'll show the nice error toast
        // Keep CV card visible so user can see what file failed
        setProcessingError(error.message || 'Please upload a valid resume/CV file')
        
        // Reset all animation and progress states
        setIsPlaying(false)
        setProgress(0)
        setRealProgress(0)
        setStage("typewriter")
        setShowPortfolioInMacBook(false)
        
        // Parse error message
        const errorMessage = error.message || 'Please upload a valid resume/CV file'
        
        // Use standardized error messages
        const errorInfo = getStandardizedError(error)
        
        // Show auth modal if needed
        if (errorInfo.isAuthError) {
          setShowSignupModal(true)
          return
        }
        
        // Show error toast with standardized message
        setErrorToast({
          isOpen: true,
          title: errorInfo.title,
          message: errorInfo.message,
          suggestion: errorInfo.suggestion
        })
      }
    } else {
      // No file, just start animation (shouldn't happen)
      setIsPlaying(true)
    }
  }

  const startPreviewAnimation = (fileToProcess?: File, skipValidation: boolean = false) => {
    console.log('🎬 Starting preview animation (no backend processing)')
    
    // Use provided file or fall back to uploadedFile
    const file = fileToProcess || uploadedFile
    
    // Reset states for preview
    setStage("initial") // Start from initial stage to show CV immediately
    setProgress(0)
    setShowNewTypewriter(false)
    setShowStrikeThrough(false)
    setShowCVCard(true)
    setPortfolioUrl(null)
    setPortfolioId(null)
    // Clear saved state
    localStorage.removeItem('lastPortfolio')
    // Clear URL params
    const newUrl = new URL(window.location.href)
    newUrl.searchParams.delete('url')
    newUrl.searchParams.delete('portfolio_id')
    window.history.pushState({}, '', newUrl)
    setProcessingError(null)
    setRealProgress(0)
    setShowPortfolioInMacBook(false)
    
    // Don't start animation immediately - wait for CV to appear in card
    setIsWaitingForAuth(true)
    setPendingFile(file)
    
    // Check if we have a file to upload
    if (!file) {
      console.error('❌ No file to upload')
      setErrorToast({
        isOpen: true,
        title: 'No file selected',
        message: 'Please select a file first',
        suggestion: 'Drag and drop a file or click to browse'
      })
      return
    }
    
    // Timeline:
    // 1. Wait for CV to fully appear in card (estimated 4 seconds)
    // 2. Wait 3 more seconds with CV visible
    // 3. Start the MacBook animation
    // 4. Wait for MacBook to fully open and show progress bar
    // 5. Show progress bar for 3 seconds
    // 6. Then show signup modal
    
    // Step 1: Check if we need to validate
    if (skipValidation) {
      // File already validated - just start the animation
      console.log('✅ Skipping validation (already done), starting animation...')
      setShowCVCard(true)
      
      // Get job ID from localStorage if available
      const jobId = localStorage.getItem('pending_job_id')
      if (jobId) {
        setCurrentJobId(jobId)
      }
      
      // Start MacBook animation
      console.log('🎬 Starting MacBook animation...')
      setIsPlaying(true)
      
      // Keep progress at 0% - it should NOT animate until user signs up
      setRealProgress(0)
      
      // The animation sequence takes about 6 seconds to reach "materializing" stage
      setTimeout(() => {
        console.log('✅ MacBook fully open, showing progress bar for 3 seconds...')
        setShowPortfolioInMacBook(true)
        
        setTimeout(() => {
          console.log('⏰ Showing signup modal after full preview')
          setShowSignupModal(true)
        }, 3000)
      }, 6000)
    } else {
      // Need to validate first
      console.log('🔍 Validating file before animation...', file.name)
      setShowCVCard(true)
      
      uploadFile(file).then(uploadResponse => {
        console.log('✅ File validated successfully, starting animation...')
        setCurrentJobId(uploadResponse.job_id)
        
        console.log('🎬 Starting MacBook animation...')
        setIsPlaying(true)
        setRealProgress(0)
        
        setTimeout(() => {
          console.log('✅ MacBook fully open, showing progress bar for 3 seconds...')
          setShowPortfolioInMacBook(true)
          
          setTimeout(() => {
            console.log('⏰ Showing signup modal after full preview')
            setShowSignupModal(true)
          }, 3000)
        }, 6000)
      }).catch(error => {
        // File validation failed - show error and don't start animation
        // Don't log to console - we'll show the nice error toast
        // Hide the CV card since the file is invalid
        setShowCVCard(false)
        setProcessingError(error.message || 'Please upload a valid resume/CV file')
        
        // Reset all animation and progress states
        setIsPlaying(false)
        setProgress(0)
        setRealProgress(0)
        setStage("typewriter")
        setShowPortfolioInMacBook(false)
        
        // Parse error message
        const errorMessage = error.message || 'Please upload a valid resume/CV file'
        
        // Use standardized error messages
        const errorInfo = getStandardizedError(error)
        
        // Show auth modal if needed
        if (errorInfo.isAuthError) {
          setShowSignupModal(true)
          return
        }
        
        // Show error toast with standardized message
        setErrorToast({
          isOpen: true,
          title: errorInfo.title,
          message: errorInfo.message,
          suggestion: errorInfo.suggestion
        })
      })
    }
  }

  const handleAuthSuccess = async (data: any) => {
    console.log('✅ User authenticated successfully:', data)
    
    // Update auth context if signIn function is provided
    if (signIn && data.session_id) {
      await signIn(data.session_id, data)
    }
    
    setShowSignupModal(false)
    setIsWaitingForAuth(false)
    
    // Wait a moment for auth context to update
    setTimeout(async () => {
      // Check if we already have a job_id from anonymous upload
      if (currentJobId) {
        console.log('📊 Using existing job_id, claiming and extracting CV data...', currentJobId)
        
        try {
          // IMPORTANT: Keep the UI exactly as it was (video carousel visible)
          // Don't change showNewTypewriter, showCVCard, or stage
          // The user was already seeing the video carousel, keep it that way!
          
          // Just continue or restart the smooth progress animation
          if (!animateSmoothProgress.current.isRunning) {
            startSmoothProgress()
          }
          
          // STEP 1: Claim ownership of the anonymous CV
          console.log('🔄 Claiming anonymous CV...')
          const claimResult = await claimAnonymousCV(currentJobId)
          console.log('✅ CV claimed successfully:', claimResult)
          
          // STEP 2: Extract CV data using the existing job_id (now owned by user)
          console.log('📊 Extracting CV data...')
          const extractResult = await extractCVData(currentJobId)
          console.log('✅ CV extraction completed:', extractResult)
          
          // Continue with portfolio generation using the extracted data
          if (extractResult.status === 'completed') {
            // Generate portfolio directly with the already uploaded and extracted CV
            console.log('🚀 Generating portfolio for job_id:', currentJobId)
            
            // Call portfolio generation endpoint directly (no new upload!)
            const portfolioResponse = await fetch(`${API_BASE_URL}/api/v1/portfolio/generate/${currentJobId}`, {
              method: 'POST',
              headers: {
                'X-Session-ID': localStorage.getItem('resume2website_session_id') || '',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                template_id: 'v0_template_v2.1'
              })
            })
            
            if (portfolioResponse.ok) {
              const portfolioData = await portfolioResponse.json()
              console.log('✅ Portfolio generation started:', portfolioData)
              
              // Store portfolio data
              if (portfolioData.portfolio_url) {
                setPortfolioUrl(portfolioData.portfolio_url)
                setRealProgress(60) // Trigger portfolio display
                setShowPortfolioInMacBook(true) // Show the portfolio
                localStorage.setItem('lastPortfolio', JSON.stringify({
                  url: portfolioData.portfolio_url,
                  timestamp: Date.now()
                }))
                
                // Complete the progress animation
                completeSmoothProgress()
              }
            }
          }
          
          // Keep currentJobId to prevent duplicate uploads
          // We'll clear it later after everything settles
          // setCurrentJobId(null)
        } catch (error: any) {
          console.error('❌ Failed to claim/extract CV data:', error)
          
          // Handle specific error cases
          if (error.message?.includes('already owned')) {
            // CV already owned by user, just extract
            try {
              const extractResult = await extractCVData(currentJobId)
              console.log('✅ CV extraction completed (already owned):', extractResult)
              
              if (extractResult.status === 'completed') {
                // Generate portfolio directly (no new upload!)
                console.log('🚀 Generating portfolio for job_id:', currentJobId)
                
                const portfolioResponse = await fetch(`${API_BASE_URL}/api/v1/portfolio/generate/${currentJobId}`, {
                  method: 'POST',
                  headers: {
                    'X-Session-ID': localStorage.getItem('resume2website_session_id') || '',
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    template_id: 'v0_template_v2.1'
                  })
                })
                
                if (portfolioResponse.ok) {
                  const portfolioData = await portfolioResponse.json()
                  console.log('✅ Portfolio generation started:', portfolioData)
                  
                  if (portfolioData.portfolio_url) {
                    setPortfolioUrl(portfolioData.portfolio_url)
                    setRealProgress(60) // Trigger portfolio display
                    setShowPortfolioInMacBook(true) // Show the portfolio
                    localStorage.setItem('lastPortfolio', JSON.stringify({
                      url: portfolioData.portfolio_url,
                      timestamp: Date.now()
                    }))
                    
                    // Complete the progress animation
                    completeSmoothProgress()
                  }
                }
              }
              // Keep currentJobId to prevent duplicate uploads
              // setCurrentJobId(null)
            } catch (extractError) {
              console.error('❌ Failed to extract CV:', extractError)
              setProcessingError('Failed to process CV data. Please try again.')
              setIsPlaying(false)
              setProgress(0)
            }
          } else {
            setProcessingError('Failed to process CV data. Please try again.')
            setIsPlaying(false)
            setProgress(0)
          }
        }
      } else if (pendingFile) {
        // No existing job_id, upload and process normally
        console.log('📤 No existing job_id, uploading file...')
        processPortfolioGeneration(pendingFile)
        setIsPlaying(true)
      }
    }, 100)
  }

  const handleSignupModalClose = () => {
    console.log('❌ User closed signup modal without signing up')
    setShowSignupModal(false)
    // Don't reset isWaitingForAuth - keep it true to maintain the preview state
    // setIsWaitingForAuth(false) // REMOVED - this was causing the UI to break
    
    // Keep the visual state intact:
    // - MacBook stays open (stage remains "complete")
    // - Progress bar stays at 0%
    // - Video carousel remains visible
    // - User can still decide to sign up later via the "Start now" button
    
    // The user can:
    // 1. Click "Start now" to show signup modal again
    // 2. Upload a different CV to restart the process
    // 3. Navigate away and come back
  }

  // Track previous uploadedFile to detect changes
  const [prevUploadedFile, setPrevUploadedFile] = useState<File | null>(null)
  
  // Watch for uploadedFile changes from ANY source (dropbox, navbar, button)
  useEffect(() => {
    // Skip if we're handling file through handleFileSelect (prevents double upload)
    if (typeof window !== 'undefined' && window.__isHandlingFileSelect) {
      console.log('⏭️ Skipping auto-start in effect, file is being handled by handleFileSelect')
      return
    }
    
    // CRITICAL: Skip if we already have a job_id (anonymous user just signed up)
    if (currentJobId) {
      console.log('⏭️ Skipping auto-start, already have job_id:', currentJobId)
      return
    }
    
    if (uploadedFile && uploadedFile !== prevUploadedFile) {
      console.log('📁 New file detected from parent:', uploadedFile.name)
      setPrevUploadedFile(uploadedFile)
      setShowCVCard(true)
      
      // Trigger animation based on auth status
      if (isAuthenticated) {
        console.log('✅ User authenticated, will validate and start full process')
        // Validate first, then start demo
        handleStartDemo() // This now includes validation
      } else {
        console.log('⚠️ User not authenticated, starting preview sequence')
        setTimeout(() => {
          startPreviewAnimation()
        }, 1500) // Wait for CV to appear first
      }
    }
  }, [uploadedFile, prevUploadedFile, isAuthenticated, currentJobId])
  
  // Wrapper for handleFileSelect that also sets showCVCard
  const handleLocalFileSelect = (file: File) => {
    // Call the parent's handleFileSelect
    handleFileSelect(file)
    // Note: The animation will be triggered by the useEffect above
  }
  
  const handleFileClick = (file: File) => {
    // When CV card is clicked, check if already processing
    console.log('🎯 CV card clicked:', file.name)
    
    // If already playing or waiting for auth, don't restart
    if (isPlaying || isWaitingForAuth) {
      console.log('⚠️ Already processing, ignoring click')
      return
    }
    
    setUploadedFile(file)
    
    // Check if user is authenticated
    if (isAuthenticated) {
      console.log('✅ User authenticated, starting full process')
      handleStartDemo()
    } else {
      console.log('⚠️ User not authenticated, starting preview')
      startPreviewAnimation()
    }
  }

  // Listen for auto-start animation event (from retry flow)
  // Using useCallback to ensure stable reference for event handler
  const handleAutoStart = useCallback((event: CustomEvent) => {
    if (uploadedFile && !isPlaying) {
      console.log('🎬 Auto-starting animation from retry')
      
      // Check if user is authenticated
      if (isAuthenticated) {
        console.log('✅ User authenticated, starting full process')
        handleStartDemo()
      } else {
        console.log('⚠️ User not authenticated, starting preview with skip validation')
        // For anonymous users, skip validation since it was already done
        startPreviewAnimation(uploadedFile, true)
      }
    }
  }, [uploadedFile, isPlaying, isAuthenticated])
  
  useEffect(() => {
    // Log listener registration in dev mode to catch leaks
    if (process.env.NODE_ENV === 'development') {
      console.log('📌 Registering autoStartAnimation listener')
      // Check for existing listeners (dev only)
      const existingListeners = (window as any).__autoStartListeners || 0
      if (existingListeners > 0) {
        console.warn(`⚠️ Potential listener leak: ${existingListeners} existing listeners found`)
      }
      (window as any).__autoStartListeners = existingListeners + 1
    }
    
    window.addEventListener(RESUME_AUTO_START_EVENT, handleAutoStart as EventListener)
    return () => {
      console.log('🧹 Cleaning up autoStartAnimation listener')
      window.removeEventListener(RESUME_AUTO_START_EVENT, handleAutoStart as EventListener)
      
      // Decrement listener count in dev mode
      if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
        (window as any).__autoStartListeners = ((window as any).__autoStartListeners || 1) - 1
        console.log(`📉 Listeners remaining: ${(window as any).__autoStartListeners}`)
      }
    }
  }, [handleAutoStart])

  // Mobile-First Layout
  if (isMobile) {
    // Boxed block rendered only once, inside main content flow, left-aligned, mobile only
    const showStableHeadline = stage !== "typewriter"
    return <div className="min-h-screen w-full relative overflow-hidden">
        {/* Apple-style gradient background */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-transparent via-white to-gray-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        {/* Soft top gradient for mobile only - sun effect from top-left */}
        <motion.div 
          className="pointer-events-none absolute top-0 left-0 w-full h-[400px] z-0 md:hidden bg-gradient-to-br from-teal-400/10 via-sky-400/8 via-emerald-500/6 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        />
        <div className="relative z-10 min-h-screen w-full flex flex-col items-center justify-start px-0">
          {/* Gentle bottom gradient background for CV image highlight */}
          <motion.div 
            className="pointer-events-none absolute bottom-0 left-0 w-full h-[500px] z-0 md:hidden" 
            style={{background: 'linear-gradient(0deg, rgba(16,185,129,0.3) 0%, rgba(56,189,248,0.22) 30%, rgba(59,130,246,0.18) 60%, rgba(243,244,246,0.01) 100%)'}}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            onAnimationComplete={() => handleLoadingComplete(0)}
          />
          {/* Boxed block: badge, headline, subheadline */}
          {showStableHeadline && (
            <div className="w-full max-w-[95vw] mx-auto flex flex-col text-left pt-4 pb-3 md:hidden pl-4">

              <div className="w-full max-w-[95vw]">
                {/* Headline - shows when loadingStep >= 1 */}
                {loadingStep >= 1 && (
                  <motion.div
                    ref={headlineRef}
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      duration: 1.6, 
                      ease: [0.25, 0.46, 0.45, 0.94],
                      opacity: { duration: 1.4 },
                      y: { duration: 1.6, ease: [0.34, 1.56, 0.64, 1] },
                      scale: { duration: 1.8, ease: [0.25, 0.46, 0.45, 0.94] }
                    }}
                    className="w-full font-bold leading-[1.05] mb-4 text-left"
                    style={{ fontSize: 'clamp(3.2rem, 11vw, 4.5rem)', fontWeight: 700, textWrap: 'balance', maxWidth: '600px' }}
                    onAnimationComplete={() => handleLoadingComplete(1)}
                  >
                    <span className="text-gray-800">
                      You Have One Shot to <span className="bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 bg-clip-text text-transparent">Escape</span> the <span className="bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 bg-clip-text text-transparent">'No'</span> <span className="bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 bg-clip-text text-transparent">Pile</span>.
                    </span>
                  </motion.div>
                )}
                
                {/* Subheadline - shows when loadingStep >= 2 */}
                {loadingStep >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 16, scale: 0.99 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      duration: 1.4, 
                      ease: [0.25, 0.46, 0.45, 0.94],
                      opacity: { duration: 1.2, ease: [0.4, 0, 0.2, 1] },
                      y: { duration: 1.4, ease: [0.34, 1.56, 0.64, 1] },
                      scale: { duration: 1.6, ease: [0.25, 0.46, 0.45, 0.94] }
                    }}
                    className="text-black font-bold mb-6 text-left"
                    style={{ fontSize: 'clamp(1.5rem, 5vw, 1.8rem)', fontWeight: 600 }}
                    onAnimationComplete={() => handleLoadingComplete(2)}
                  >
                    Turn your <ClientRoughNotation 
                      type="crossed-off" 
                      show={showStrikeThrough}
                      color="#dc2626"
                      strokeWidth={3}
                      animationDuration={800}
                      animationDelay={0}
                      iterations={2}
                      padding={0}
                    >
                      <span className="text-gray-600 italic inline-block">static résumé</span>
                    </ClientRoughNotation> into a web portfolio that gets a <span className="bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 bg-clip-text text-transparent font-bold">'Yes'</span> in one click.
                  </motion.div>
                )}
                
                {/* Primary CTA Button for Mobile - REMOVED as per requirement */}
                {/* Mobile button removed - users will interact with CV cards instead */}
              </div>
            </div>
          )}
          {/* Transformation sequence: CV image, particle effect, website (mobile) */}
          <div className="w-full flex flex-col items-center justify-start mt-4 min-h-[485px]">
            {/* CV Image: show during 'initial', 'intro', 'typewriter' - only when loadingStep >= 3 */}
            {['initial', 'intro', 'typewriter'].includes(stage) && loadingStep >= 3 && (
              <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 2.0, 
                  ease: [0.25, 0.46, 0.45, 0.94],
                  opacity: { duration: 1.6, ease: [0.4, 0, 0.2, 1] },
                  y: { duration: 2.0, ease: [0.34, 1.56, 0.64, 1] },
                  scale: { duration: 2.2, ease: [0.25, 0.46, 0.45, 0.94] }
                }}
                className="relative w-full max-w-[340px] h-[485px]"
              >
                <InteractiveCVPile 
                  key={uploadedFile ? `${uploadedFile.name}-${uploadedFile.size}-${uploadedFile.lastModified}` : 'empty'}
                  className="w-full h-full" 
                  onFileSelect={handleLocalFileSelect}
                  onFileClick={handleFileClick}
                  uploadedFile={uploadedFile}
                  isProcessing={isPlaying}
                />
              </motion.div>
            )}
            {/* Particle/Fireworks effect: show during 'morphing' and 'dissolving' */}
            {['morphing', 'dissolving'].includes(stage) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.05, y: -20, filter: 'blur(4px)' }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
                className="relative w-full max-w-[340px] h-[485px] flex items-center justify-center"
              >
              </motion.div>
            )}
            {/* Website: show during 'materializing' and 'complete' (iPhoneFrame for mobile) */}
            {['materializing', 'complete'].includes(stage) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
                className="relative w-full max-w-[340px] h-[485px]"
              >
                <IPhoneFrame>
                  {portfolioUrl ? (
                    <IframeWithFallback
                      src={portfolioUrl}
                      title="Generated Portfolio"
                      className="w-full h-full border-0"
                    />
                  ) : (
                    <iframe
                      ref={iframeRef}
                      src="https://dmfmjqvp.manus.space/#"
                      className="w-full h-full border-0"
                      title="Alex Morgan Portfolio"
                      style={{
                        transform: stage === 'complete' ? 'scale(1)' : 'scale(0.98)',
                        transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      }}
                    />
                  )}
                </IPhoneFrame>
              </motion.div>
            )}
          </div>
        </div>
        
        {/* Authentication Modal for signup after file upload */}
        <AuthModal
          isOpen={showSignupModal}
          onClose={handleSignupModalClose}
          onAuthSuccess={handleAuthSuccess}
        />
    </div>
  }

  // Desktop version (keep existing logic but simplified)
  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Apple-style gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white to-gray-100"></div>
      
      {/* Right-to-left gradient overlay */}
      <div className="absolute inset-0 hidden md:block">
        <div className="absolute inset-y-0 inset-x-0 bg-gradient-to-r from-transparent via-emerald-500/[0.08] 50% to-sky-400/[0.15]">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-600/[0.06] 50% to-emerald-500/[0.09]"></div>
        </div>
      </div>
      
      <div className="relative z-10 min-h-screen w-full flex items-center justify-center">
      {/* Keep the existing desktop layout but simplified */}
      <div className="w-full h-screen flex flex-row items-center justify-center gap-0">
        {/* Left Side - Text Content - Dynamic width based on stage */}
        <div className={`${isTransformationStage() ? "w-[35%]" : "w-1/2"} h-full flex flex-col items-start justify-center pl-8 pr-2 text-foreground relative isolate`} style={{ pointerEvents: 'auto', zIndex: 20, isolation: 'isolate' }}>
          <div className="w-full h-full flex flex-col justify-center gap-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`max-w-none w-full relative ${isTransformationStage() ? "space-y-16" : "space-y-16"}`}
            >


              {/* Component 2: Main Headline - much bigger for transformation stage */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
                className={isTransformationStage() ? "" : ""}
              >
                <AnimatePresence mode="wait">
                  {!showNewTypewriter ? (
                    <motion.div
                      key="original-headline"
                      initial={{ opacity: 1 }}
                      exit={{
                        opacity: 0,
                        transition: { duration: 0.15, ease: "easeOut" },
                      }}
                      className={`${isTransformationStage() ? "text-4xl xs:text-4xl sm:text-5xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl 3xl:text-8xl" : "text-5xl xs:text-5xl sm:text-6xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl 3xl:text-9xl"} font-bold max-w-[120%]`}
                      style={{ lineHeight: '0.95' }}
                    >
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          duration: 1.2,
                          ease: "easeOut",
                          delay: 0.3
                        }}
                        className="text-foreground"
                      >
                        <div className={`${isTransformationStage() ? "mb-6" : "mb-8"}`} style={{ fontWeight: 700 }}>
                          <span className="text-gray-800 font-bold">
                            You Have One Shot to <span className="bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 bg-clip-text text-transparent">Escape</span> the <span className="bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 bg-clip-text text-transparent">'No'</span> <span className="bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 bg-clip-text text-transparent">Pile</span>.
                          </span>
                        </div>
                        <motion.div 
                          className={`${isTransformationStage() ? "text-base xs:text-lg sm:text-xl md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl 3xl:text-5xl" : "text-lg xs:text-xl sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl 3xl:text-6xl"} text-black font-medium leading-tight max-w-[120%]`}
                          style={{ fontWeight: 500 }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
                        >
                          Turn your <ClientRoughNotation 
                            type="crossed-off" 
                            show={showStrikeThrough}
                            color="#dc2626"
                            strokeWidth={3}
                            animationDuration={800}
                            animationDelay={0}
                            iterations={2}
                            padding={0}
                          >
                            <span className="text-gray-600 italic inline-block">static résumé</span>
                          </ClientRoughNotation> into a web portfolio that gets a <span className="bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 bg-clip-text text-transparent font-bold">'Yes'</span> in one click.
                        </motion.div>
                        
                        {/* Primary CTA Section */}
                        <div className="flex flex-col gap-6" style={{ marginTop: '32px' }}>
                          {/* Primary Upload CTA - Most prominent */}
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 1.0, ease: "easeOut" }}
                          >
                            <Button
                              onClick={() => {
                                // For consistency, use the same file upload flow as the dropbox
                                const fileInput = document.createElement('input')
                                fileInput.type = 'file'
                                fileInput.accept = '.pdf,.doc,.docx,.txt,.rtf,.png,.jpg,.jpeg,.webp,.heic,.heif,.tiff,.tif,.bmp'
                                fileInput.onchange = (e) => {
                                  const target = e.target as HTMLInputElement
                                  if (target.files && target.files[0]) {
                                    handleFileSelect(target.files[0])
                                  }
                                }
                                fileInput.click()
                              }}
                              className="group relative bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 hover:from-emerald-600 hover:via-sky-500 hover:to-blue-700 text-white border-0 px-12 py-6 rounded-full text-xl md:text-2xl font-bold shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_40px_rgba(16,185,129,0.3)] cursor-pointer overflow-hidden"
                              style={{
                                minWidth: '320px',
                                minHeight: '72px'
                              }}
                            >
                              <span className="relative z-10 flex items-center justify-center">
                                <svg
                                  className="w-6 h-6 mr-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                  />
                                </svg>
                                Upload your CV now
                              </span>
                              {/* Animated gradient overlay */}
                              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-sky-500 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              {/* Shine effect */}
                              <div className="absolute inset-0 -top-2 h-full w-1/2 bg-white/30 skew-x-12 -translate-x-full group-hover:translate-x-[200%] transition-transform duration-700" />
                            </Button>
                          </motion.div>

                          
                        </div>
                      </motion.span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="progress-bar"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 1.2, ease: "easeInOut" }}
                      className="flex items-center w-full"
                      style={{ height: "400px", paddingLeft: "120px" }}
                    >
                      <VerticalProgressBar 
                        onProgressChange={setProgressBarPercentage}
                        externalProgress={realProgress}
                        isClickable={true}
                        onCircleClick={() => {
                          if (portfolioUrl && realProgress >= 60) {
                            // Load portfolio in MacBook iframe
                            console.log('🎯 Loading portfolio in MacBook:', portfolioUrl)
                            setShowPortfolioInMacBook(true)
                          }
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Start now button - keep in original position on left side */}
              <AnimatePresence mode="wait">
                {showNewTypewriter ? (
                  <motion.div
                    key="transform-button"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                    }}
                    transition={{
                      duration: 1.2,
                      ease: "easeOut",
                      delay: 0.2,
                    }}
                    className={`flex ${isTransformationStage() ? "justify-start" : "justify-start"}`}
                  >
                    <div className="flex gap-4">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ 
                          opacity: 1,
                          scale: progressBarPercentage >= 60 ? [1, 1.05, 1] : 1
                        }}
                        transition={{
                          duration: 0.8,
                          ease: "easeOut",
                          scale: {
                            duration: 2,
                            repeat: progressBarPercentage >= 60 ? Infinity : 0,
                            repeatType: "reverse"
                          }
                        }}
                      >
                        <Button
                          size="lg"
                          onClick={() => {
                            // Check if we're in preview mode (waiting for auth)
                            if (isWaitingForAuth && !isAuthenticated) {
                              // Re-open the signup modal for preview users
                              setShowSignupModal(true)
                            } else if (progressBarPercentage >= 60) {
                              // Phase 7: When progress reaches 60%, Start now opens pricing modal
                              setShowPricing(true)
                            } else {
                              // Default: open general auth modal
                              onOpenModal()
                            }
                          }}
                          className={`${progressBarPercentage >= 60 ? 'shadow-2xl' : ''} bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 hover:from-emerald-600 hover:via-sky-500 hover:to-blue-700 text-white border-0 w-auto text-base md:text-lg px-6 py-4 transition-all duration-300 hover:scale-105 rounded-full`}
                        >
                          <span>
                            Start now
                            <ArrowRight className="ml-3 w-5 h-5 inline-block" />
                          </span>
                        </Button>
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                      >
                        <Button
                          size="lg"
                          variant="outline"
                          onClick={() => {
                            const element = document.getElementById('demo')
                            if (element) {
                              element.scrollIntoView({ behavior: 'smooth' })
                            }
                          }}
                          className="bg-black hover:bg-gray-800 text-white border-2 border-black hover:border-gray-800 w-auto text-base md:text-lg px-6 py-4 transition-all duration-300 hover:scale-105 rounded-full"
                        >
                          Learn more
                          <ArrowDown className="ml-3 w-5 h-5 inline-block" />
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
 
            </motion.div>
          </div>
        </div>

        {/* Right Side - Dynamic width based on stage (desktop only, keep MacBookFrame) */}
        <div className={`${isTransformationStage() ? "w-[65%]" : "w-1/2"} h-full flex items-center ${(stage === "materializing" || stage === "complete") ? "justify-start" : "justify-center"} relative ${(stage === "materializing" || stage === "complete") ? "pl-2 pr-4 md:pr-6 lg:pr-8" : "pl-0 pr-4 md:pr-8 lg:pr-12"}`}>



            <AnimatePresence mode="wait">
              {(stage === "initial" || stage === "intro" || stage === "typewriter") && (
                <motion.div
                  key="initial"
                  initial={{ opacity: 0, scale: 0.95, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    x: 100,
                    transition: { duration: 0.6, ease: "easeInOut" },
                  }}
                  transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 1.0 }}
                  className="relative flex justify-center"
                >
                  {/* Interactive CV Pile - Upload area */}
                  <InteractiveCVPile 
                    key={uploadedFile ? `${uploadedFile.name}-${uploadedFile.size}-${uploadedFile.lastModified}` : 'empty'}
                    className="relative z-5 w-[268px] xs:w-[308px] sm:w-[344px] md:w-[384px] lg:w-[424px] xl:w-[460px] 2xl:w-[500px] h-[344px] xs:h-[384px] sm:h-[460px] md:h-[500px] lg:h-[540px] xl:h-[576px]" 
                    onFileSelect={handleLocalFileSelect}
                    onFileClick={handleFileClick}
                    uploadedFile={uploadedFile}
                    isProcessing={isPlaying}
                  />
                </motion.div>
              )}

              {(stage === "morphing" || stage === "dissolving") && (
                <motion.div
                  key="transforming"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ 
                    opacity: 0,
                    x: 100,
                    scale: 0.95
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="w-[290px] xs:w-[335px] sm:w-[385px] md:w-[430px] lg:w-[480px] xl:w-[530px] h-[385px] xs:h-[430px] sm:h-[525px] md:h-[575px] lg:h-[625px] xl:h-[675px] relative"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 via-sky-400/30 to-blue-600/30 rounded-xl"
                    animate={{
                      opacity: [0.2, 0.5, 0.3],
                      scale: [1, 1.03, 0.98, 1.01, 1],
                      rotate: [0, 1, -1, 0],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>
              )}

              {(stage === "materializing" || stage === "complete") && (
                <motion.div
                  key="website"
                  initial={{ opacity: 0, scale: 0.95, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{
                    duration: 0.8,
                    ease: [0.34, 1.56, 0.64, 1],
                  }}
                className="w-[1200px] xs:w-[1300px] sm:w-[1450px] md:w-[1600px] lg:w-[1800px] xl:w-[2000px] 2xl:w-[2200px] relative"
                >
                  <MacBookFrame isComplete={stage === "complete"}>
                    {showNewTypewriter ? (
                      // Phase 3: Sequential fade-in content during progress bar animation
                      <div className="w-full h-full bg-white flex flex-col items-center justify-center p-8">
                        {/* Phase 3A: Main Headline (0-800ms) - split into two lines */}
                        <motion.div
                          className="text-center mb-1"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
                            Your <span className="text-gray-500">resume tells</span> people what you did
                          </h1>
                          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                            A <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">portfolio shows</span> them
                          </h1>
                        </motion.div>

                        {/* Phase 3B: Subheadline (800-1400ms) - positioned below headline */}
                        <motion.p
                          className="text-lg text-center text-black mb-0"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
                        >
                          While we're working, watch HOW ↓
                        </motion.p>

                        {/* Phase 3C/5: Video Carousel OR Gate-kept Website Preview */}
                        <motion.div
                          className="w-full max-w-4xl -mt-8"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, delay: 1.6, ease: "easeOut" }}
                        >
                          {isRestoringPortfolio ? (
                            // Show loading state while restoring portfolio
                            <div className="absolute inset-0 w-full h-full bg-white z-50 flex items-center justify-center">
                              <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                                <p className="text-gray-600">Restoring your last portfolio...</p>
                              </div>
                            </div>
                          ) : (showPortfolioInMacBook || realProgress >= 60) && portfolioUrl ? (
                            // Show the generated portfolio automatically when ready or when clicked
                            <div className="absolute inset-0 w-full h-full bg-white z-50">
                              <IframeWithFallback 
                                src={portfolioUrl}
                                title="Generated Portfolio"
                                className="w-full h-full border-0"
                              />
                            </div>
                          ) : (portfolioUrl && realProgress >= 60) ? (
                            // Phase 5: Show portfolio URL info and debugging when ready
                            <div className="text-center p-8">
                              <div className="mb-4 text-sm text-gray-600">
                                Debug Info:<br/>
                                Progress: {realProgress}%<br/>
                                Portfolio URL: {portfolioUrl || 'Not set'}<br/>
                                Show Portfolio: {showPortfolioInMacBook ? 'Yes' : 'No'}
                              </div>
                              
                              {portfolioUrl && (
                                <div className="mb-4">
                                  <button
                                    onClick={() => {
                                      console.log('🔧 Manual portfolio show triggered')
                                      setShowPortfolioInMacBook(true)
                                    }}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                  >
                                    Force Show Portfolio
                                  </button>
                                  <br/>
                                  <a 
                                    href={portfolioUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline text-sm mt-2 inline-block"
                                  >
                                    Open Portfolio in New Tab
                                  </a>
                                </div>
                              )}
                              
                              <motion.div
                                animate={{
                                  scale: [1, 1.05, 1]
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "easeInOut"
                                }}
                                className="inline-block"
                              >
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                  Your portfolio is ready! 🎉
                                </h3>
                                <p className="text-gray-600">
                                  Click the <span className="font-bold text-blue-600">60%</span> button to preview
                                </p>
                              </motion.div>
                            </div>
                          ) : (
                            // Phase 3C: Video carousel (until progress reaches 60%)
                            <VideoCarousel />
                          )}
                        </motion.div>
                      </div>
                    ) : (
                      // Original content when progress bar is not active
                      uploadedFile ? (
                        <PortfolioHeroPreview 
                          file={uploadedFile}
                          onScrollAttempt={() => {
                            if (!isAuthenticated) {
                              onOpenModal() // Show auth modal for non-authenticated users
                            } else {
                              setHasScrolledHero(true) // Mark as scrolled for authenticated users
                            }
                          }}
                        />
                      ) : portfolioUrl ? (
                        <div className="absolute inset-0 w-full h-full bg-white z-50">
                          <IframeWithFallback 
                            src={portfolioUrl}
                            title="Generated Portfolio"
                            className="w-full h-full border-0"
                          />
                        </div>
                      ) : (
                        <iframe
                          ref={iframeRef}
                          src="https://dmfmjqvp.manus.space/#"
                          className="w-full h-full border-0"
                          title="Alex Morgan Portfolio"
                          style={{
                            transform: stage === "complete" ? "scale(1)" : "scale(0.98)",
                            transition: "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
                          }}
                        />
                      )
                    )}
                  </MacBookFrame>
                  
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      {/* Authentication Modal for signup after file upload */}
      <AuthModal
        isOpen={showSignupModal}
        onClose={handleSignupModalClose}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  )
}

// Apple-style Navbar Component
const AppleNavbar = ({ 
  onOpenModal, 
  isAuthenticated, 
  user, 
  onLogout,
  onShowDashboard,
  onFileSelect 
}: { 
  onOpenModal: () => void
  isAuthenticated: boolean
  user: any
  onLogout: () => void
  onShowDashboard: () => void
  onFileSelect: (file: File) => void
}) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }

  const handleUploadClick = () => {
    if (isAuthenticated) {
      // Show dashboard with resume page
      onShowDashboard()
    } else {
      // For non-authenticated users, trigger file upload like the dropbox
      // This will create a consistent experience across all upload methods
      const fileInput = document.createElement('input')
      fileInput.type = 'file'
      fileInput.accept = '.pdf,.doc,.docx,.txt,.rtf,.png,.jpg,.jpeg,.webp,.heic,.heif,.tiff,.tif,.bmp'
      fileInput.onchange = (e) => {
        const target = e.target as HTMLInputElement
        if (target.files && target.files[0]) {
          onFileSelect(target.files[0])
        }
      }
      fileInput.click()
    }
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "bg-white/95 backdrop-blur-xl border-b border-gray-200/30 shadow-lg"
          : "bg-white/10 backdrop-blur-sm"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Fixed on left */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center cursor-pointer flex-shrink-0"
            onClick={() => scrollToSection('hero')}
          >
            <div className="flex items-center space-x-2">
              {/* Logo Icon */}
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 via-sky-400 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                <svg 
                  className="w-6 h-6 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                  />
                </svg>
              </div>
              <div className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-sky-500 to-blue-700 bg-clip-text text-transparent">
                Resume2Website
              </div>
            </div>
          </motion.div>

          {/* Center Navigation Only */}
          <div className="hidden md:flex items-center flex-1 justify-center">
            <div className="flex items-center space-x-8">
              {[
                { name: 'Home', id: 'hero' },
                { name: 'Demo', id: 'demo' },
                { name: 'Research', id: 'research' },
                { name: 'FAQ', id: 'faq' }
              ].map((item) => (
                <motion.button
                  key={item.name}
                  onClick={() => scrollToSection(item.id)}
                  className="text-gray-600 hover:text-gray-900 px-4 py-2 text-sm font-medium transition-all duration-200 relative group"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10">{item.name}</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-sky-400/10 to-blue-600/10 rounded-lg"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 rounded-full"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Right Section - Auth and Upload CV */}
          <div className="hidden md:flex items-center space-x-4 flex-shrink-0">
            {isAuthenticated ? (
              // Logged in - show user info, dashboard button and logout
              <>
                <span className="text-sm text-gray-700">
                  Welcome, {user?.name || 'User'}
                </span>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={onShowDashboard}
                    variant="outline"
                    className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 bg-gradient-to-r from-emerald-50 via-sky-50 to-blue-50 border-emerald-200 hover:border-emerald-300"
                  >
                    Dashboard
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={onLogout}
                    variant="outline"
                    className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
                  >
                    Logout
                  </Button>
                </motion.div>
              </>
            ) : (
              // Not logged in - show login button
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={onOpenModal}
                  variant="outline"
                  className="relative px-6 py-2.5 rounded-full text-sm font-medium text-gray-700 border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 transition-all duration-300 group overflow-hidden"
                >
                  <span className="relative z-10">Login</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-sky-400/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </motion.div>
            )}
            
            {/* Upload CV Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={handleUploadClick}
                className="relative bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 hover:from-emerald-600 hover:via-sky-500 hover:to-blue-700 text-white px-6 py-2.5 rounded-full text-sm font-semibold shadow-lg transition-all duration-300 transform hover:shadow-xl hover:-translate-y-0.5 overflow-hidden group"
              >
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-sky-500 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Button content */}
                <span className="relative flex items-center">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  Upload your CV now
                </span>
                
                {/* Shine effect */}
                <div className="absolute inset-0 -top-2 h-full w-1/2 bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-[200%] transition-transform duration-700" />
              </Button>
            </motion.div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-gray-900 p-2"
              whileTap={{ scale: 0.95 }}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
            </div>
            </div>

        {/* Mobile Navigation */}
    <AnimatePresence>
          {isMobileMenuOpen && (
        <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
              className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200/30 shadow-lg"
            >
              <div className="px-4 pt-4 pb-6 space-y-2">
                {[
                  { name: 'Home', id: 'hero' },
                  { name: 'Demo', id: 'demo' },
                  { name: 'Research', id: 'research' },
                  { name: 'FAQ', id: 'faq' }
                ].map((item) => (
                  <motion.button
                    key={item.name}
                    onClick={() => scrollToSection(item.id)}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors duration-200"
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.name}
                  </motion.button>
                ))}
                
                {/* Upload CV Button for Mobile */}
                <motion.div className="pt-4 pb-2" whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handleUploadClick}
                    className="w-full bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 hover:from-emerald-600 hover:via-sky-500 hover:to-blue-700 text-white px-6 py-3 rounded-full text-base font-semibold shadow-lg transition-all duration-300"
                  >
                    <svg
                      className="w-5 h-5 mr-2 inline-block"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    Upload your CV now
                  </Button>
                </motion.div>
                
                {/* Auth buttons */}
                {isAuthenticated ? (
                  <motion.div className="pt-2 border-t border-gray-200" whileTap={{ scale: 0.95 }}>
                    <div className="px-3 py-2 text-sm text-gray-600">
                      Welcome, {user?.name || 'User'}
                    </div>
                    <Button
                      onClick={() => {
                        setIsMobileMenuOpen(false)
                        onShowDashboard()
                      }}
                      className="w-full mt-2 bg-gradient-to-r from-emerald-50 via-sky-50 to-blue-50 border-emerald-200 hover:border-emerald-300"
                      variant="outline"
                    >
                      Dashboard
                    </Button>
                    <Button
                      onClick={onLogout}
                      variant="outline"
                      className="w-full mt-2"
                    >
                      Logout
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div className="pt-2" whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={onOpenModal}
                      variant="outline"
                      className="w-full"
                    >
                      Login
                    </Button>
                  </motion.div>
                )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
      </div>
    </motion.nav>
  )
}

// Gate-kept Website Preview Component for Phase 5 - Uses actual iframe with smooth fade-in
const GateKeptWebsitePreview = ({ uploadedFile, onScrollAttempt }: { uploadedFile?: File | null, onScrollAttempt?: () => void }) => {
  return (
    <motion.div 
      className="w-full h-[460px] rounded-lg overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 3, ease: "easeInOut" }}
    >
      {uploadedFile ? (
        <PortfolioHeroPreview 
          file={uploadedFile}
          onScrollAttempt={onScrollAttempt}
        />
      ) : (
        <iframe
          src="https://dmfmjqvp.manus.space/#"
          className="w-full h-full border-0"
          title="Portfolio Preview"
          style={{
            transform: "scale(1)",
            transition: "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        />
      )}
    </motion.div>
  )
}

// Video Carousel Component for Phase 3 & 4
const VideoCarousel = () => {
  const [currentCard, setCurrentCard] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [hasUserInteracted, setHasUserInteracted] = useState(false)

  const videos = [
    {
      id: 1,
      headline: "Skills Showcase",
      thumbnail: "/placeholder-video-1.jpg",
      description: "Interactive skills visualization"
    },
    {
      id: 2, 
      headline: "Project Gallery",
      thumbnail: "/placeholder-video-2.jpg",
      description: "Stunning project showcases"
    },
    {
      id: 3,
      headline: "Career Timeline", 
      thumbnail: "/placeholder-video-3.jpg",
      description: "Professional journey display"
    }
  ]

  const nextCard = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentCard((prev) => (prev + 1) % videos.length)
    setTimeout(() => setIsTransitioning(false), 600)
  }, [isTransitioning, videos.length])

  const prevCard = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setHasUserInteracted(true) // Mark user interaction
    setCurrentCard((prev) => (prev - 1 + videos.length) % videos.length)
    setTimeout(() => setIsTransitioning(false), 600)
  }, [isTransitioning, videos.length])

  const goToCard = useCallback((index: number) => {
    if (index === currentCard || isTransitioning) return
    setIsTransitioning(true)
    setHasUserInteracted(true) // Mark user interaction
    setCurrentCard(index)
    setTimeout(() => setIsTransitioning(false), 600)
  }, [currentCard, isTransitioning])

  // Phase 4: Auto-advance logic - every 3.5 seconds unless hovering or user clicked
  useEffect(() => {
    if (isHovering || hasUserInteracted || isTransitioning) return

    const autoAdvanceInterval = setInterval(() => {
      nextCard()
    }, 3500) // 3.5 seconds

    return () => clearInterval(autoAdvanceInterval)
  }, [isHovering, hasUserInteracted, isTransitioning, nextCard])

  // Calculate position for each card
  const getCardPosition = (index: number) => {
    const diff = (index - currentCard + videos.length) % videos.length
    const normalizedDiff = diff > videos.length / 2 ? diff - videos.length : diff
    return normalizedDiff
  }

  // Get transform values for stacked effect
  const getCardTransform = (position: number) => {
    const absPos = Math.abs(position)

    if (absPos === 0) {
      // Center card - fully visible
      return {
        x: "-50%",
        y: "-50%", 
        scale: 1,
        opacity: 1,
        zIndex: 20,
        rotateY: 0,
        filter: "blur(0px)",
      }
    } else if (absPos === 1) {
      // Adjacent cards - partially visible
      return {
        x: position > 0 ? "-25%" : "-75%",
        y: "-50%",
        scale: 0.85,
        opacity: 0.7,
        zIndex: 15,
        rotateY: position > 0 ? -15 : 15,
        filter: "blur(1px)",
      }
    } else {
      // Hidden cards
      return {
        x: position > 0 ? "10%" : "-110%",
        y: "-50%",
        scale: 0.6,
        opacity: 0,
        zIndex: 5,
        rotateY: position > 0 ? -30 : 30,
        filter: "blur(2px)",
      }
    }
  }

  return (
    <div 
      className="w-full"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Cards Container - Even bigger to catch most of screen */}
      <div 
        className="relative h-[460px] overflow-visible mb-0"
        style={{ perspective: "1200px" }}
      >
        {videos.map((video, index) => {
          const position = getCardPosition(index)
          const isActive = position === 0
          const transform = getCardTransform(position)

          return (
            <motion.div
              key={video.id}
              className={`absolute w-[580px] h-[360px] bg-white/95 backdrop-blur-[20px] rounded-[20px] border border-white/30 cursor-pointer will-change-transform overflow-hidden ${
                isActive ? 'shadow-2xl' : 'shadow-lg'
              }`}
              style={{
                left: "50%",
                top: "50%",
                transformOrigin: "center center",
              }}
              animate={transform}
              transition={{
                duration: 0.6,
                ease: [0.25, 0.1, 0.25, 1],
                type: "tween",
              }}
              onClick={() => {
                if (!isActive) {
                  setHasUserInteracted(true)
                  goToCard(index)
                }
              }}
              whileHover={isActive ? { y: "-52%", scale: 1.02 } : {}}
            >
              {/* Video Headline - Above the video area */}
              <div className="p-6 pb-3">
                <h3 className="text-2xl font-bold text-gray-800 text-center">
                  {video.headline}
                </h3>
              </div>

              {/* Video Placeholder Area - Even larger */}
              <div className="relative bg-gray-900 mx-6 mb-6 rounded-xl h-[260px] flex items-center justify-center group">
                {/* Video Thumbnail Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-xl"></div>
                
                {/* Play Button - Larger */}
                <div className="relative z-10 w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <svg className="w-10 h-10 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Navigation - moved much closer to carousel */}
      <div className="flex justify-center items-center gap-4 -mt-4">
        <button
          onClick={() => {
            setHasUserInteracted(true)
            prevCard()
          }}
          disabled={isTransitioning}
          className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-white/30 flex items-center justify-center text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:scale-105 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex gap-2">
          {videos.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setHasUserInteracted(true)
                goToCard(index)
              }}
              disabled={isTransitioning}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentCard ? 'bg-purple-600 scale-125' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => {
            setHasUserInteracted(true)
            nextCard()
          }}
          disabled={isTransitioning}
          className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-white/30 flex items-center justify-center text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:scale-105 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default function Home() {
  const [currentSection, setCurrentSection] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [showBuilder, setShowBuilder] = useState(false)
  const [showProcessing, setShowProcessing] = useState(false)
  const [isPostPayment, setIsPostPayment] = useState(false)
  const [showDashboard, setShowDashboard] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [droppedFile, setDroppedFile] = useState<File | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [hasTriggeredPhase6Modal, setHasTriggeredPhase6Modal] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const [showPricing, setShowPricing] = useState(false)
  const [isRetrying, setIsRetrying] = useState(false)
  
  // Error toast state
  const [errorToast, setErrorToast] = useState<{
    isOpen: boolean
    title: string
    message: string
    suggestion?: string
  }>({
    isOpen: false,
    title: '',
    message: '',
    suggestion: undefined
  })
  
  // Validation guard to prevent concurrent uploads
  const isValidatingRef = useRef(false)
  const currentFileFingerprint = useRef<string | null>(null)
  
  // Helper to get file fingerprint
  const getFileFingerprint = (file: File): string => {
    return `${file.name}-${file.size}-${file.lastModified}`
  }
  
  // Cleanup window flags on unmount to prevent leaks
  useEffect(() => {
    return () => {
      // Clean up global flags on unmount
      if (typeof window !== 'undefined') {
        window.__isHandlingFileSelect = false
      }
      // Also clean up refs
      isValidatingRef.current = false
      currentFileFingerprint.current = null
    }
  }, [])
  
  // Use the real authentication system
  const { isAuthenticated, user, signIn, signOut } = useAuthContext()
  
  // Clear validation state when auth changes to prevent leaks
  useEffect(() => {
    // Reset validation state on auth change
    isValidatingRef.current = false
    currentFileFingerprint.current = null
    if (typeof window !== 'undefined') {
      window.__isHandlingFileSelect = false
    }
  }, [isAuthenticated])
  
  const sections = ['hero', 'demo', 'research', 'ugc-reels', 'faq']
  
  // Set hydration state
  useEffect(() => {
    setIsHydrated(true)
  }, [])
  
  // Handle retry file upload from error toast
  useEffect(() => {
    const handleRetryUpload = (event: CustomEvent) => {
      const file = event.detail as File
      if (file) {
        handleFileSelect(file)
      }
    }
    
    window.addEventListener('retryFileUpload', handleRetryUpload as EventListener)
    return () => {
      window.removeEventListener('retryFileUpload', handleRetryUpload as EventListener)
    }
  }, [])
  
  // Reset Phase 6 modal trigger when authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      setHasTriggeredPhase6Modal(false) // Reset so it can trigger again if user logs out
    }
  }, [isAuthenticated])

  // Modal handlers
  const handleOpenModal = () => {
    if (isAuthenticated) {
      // User is logged in - go directly to dashboard
      setShowDashboard(true)
    } else {
      // User not logged in - show auth modal
      setShowAuthModal(true)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleYesChoice = () => {
    // Navigate to upload interface (Step 2A)
    setIsModalOpen(false)
    setShowUpload(true)
  }

  const handleNoChoice = () => {
    // Navigate to resume builder page (Step 2B)
    setIsModalOpen(false)
    setShowBuilder(true)
  }

  // Upload flow handlers
  const handleUploadBack = () => {
    setShowUpload(false)
    setIsModalOpen(true)
  }

  const handleUploadSuccess = () => {
    setShowUpload(false)
    setShowProcessing(true)
  }

  const handleUploadClose = () => {
    setShowUpload(false)
  }

  // Authentication handlers
  const handleAuthSuccess = async (data: any) => {
    // Use the real auth system to sign in
    await signIn(data.session_id, data.user)
    setShowAuthModal(false)
    
    // Check if there's a dropped file waiting
    if (droppedFile) {
      // Go directly to upload with the file
      setShowUpload(true)
    } else if (uploadedFile) {
      // If we have an uploaded file from CV card click, go to processing
      setShowProcessing(true)
    } else {
      // After signup/login without a file, stay on home page
      // Don't automatically go to dashboard
      // User can navigate to dashboard manually if they want
      console.log('Authentication successful, staying on home page')
    }
  }

  const handleAuthClose = () => {
    setShowAuthModal(false)
  }

  // Helper function to parse error response and get standardized messages
  const getStandardizedError = (error: any): StandardizedError => {
    // Handle network errors, CORS, and fetch failures
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        title: 'Connection problem',
        message: 'Unable to connect to the server.',
        suggestion: 'Check your internet connection and try again.'
      }
    }
    
    // Handle AbortError (client-side timeout)
    if (error.name === 'AbortError' || (error instanceof Error && error.message.includes('AbortError'))) {
      return {
        title: 'Upload timed out',
        message: 'The connection took too long and the upload was interrupted.',
        suggestion: 'Check your network and try again; large files work best on a stable connection.'
      }
    }
    
    // Handle CORS errors
    if (error instanceof TypeError && (error.message.includes('CORS') || error.message.includes('cross-origin'))) {
      return {
        title: 'Connection blocked',
        message: 'The server blocked the connection for security reasons.',
        suggestion: 'Try refreshing the page or contact support if this persists.'
      }
    }
    
    // Handle Resume Gate errors with custom properties
    if (error.isResumeGateError) {
      return {
        title: 'Not a resume',
        message: error.resumeGateReason || "This file doesn't look like a resume (CV).",
        suggestion: error.resumeGateSuggestion || 'Use a resume with contact info and sections like Experience, Education, and Skills.'
      }
    }
    
    const errorMessage = error.message || 'File validation failed'
    const statusCode = error.statusCode || (errorMessage.includes('(401)') ? 401 : errorMessage.includes('(403)') ? 403 : errorMessage.includes('(400)') ? 400 : 500)
    
    // Check for specific error patterns in the message
    if (statusCode === 400 && (errorMessage.includes('resume') || errorMessage.includes('CV') || errorMessage.includes('Resume Gate'))) {
      // Check if we have more specific error details from backend
      if (errorMessage.includes("doesn't contain enough readable text")) {
        return {
          title: 'Not a resume',
          message: "The image doesn't contain enough readable text for a resume.",
          suggestion: 'Please upload a complete resume document or a high-quality scan with all resume sections visible.'
        }
      }
      if (errorMessage.includes("lacks the variety of content")) {
        return {
          title: 'Not a resume',
          message: "The image lacks the variety of content expected in a resume.",
          suggestion: 'Upload a full resume with multiple sections (Experience, Education, Skills, Contact info).'
        }
      }
      if (errorMessage.includes("missing core resume elements")) {
        return {
          title: 'Not a resume',
          message: "The image is missing core resume elements.",
          suggestion: 'Make sure your resume image includes both contact information and work experience.'
        }
      }
      // Default resume error
      return {
        title: 'Not a resume',
        message: "This file doesn't look like a resume (CV).",
        suggestion: 'Use a resume with contact info and sections like Experience, Education, and Skills.'
      }
    }
    
    if (statusCode === 400 && (errorMessage.includes('corrupted') || errorMessage.includes('unreadable'))) {
      return {
        title: 'Unsupported or corrupted file',
        message: "The file type doesn't match its contents or can't be read.",
        suggestion: 'Upload a PDF, DOC/DOCX, TXT, PNG, JPG, or WEBP exported directly from your editor.'
      }
    }
    
    if (statusCode === 401 || statusCode === 403 || errorMessage.includes('Authentication required')) {
      return {
        title: 'Sign in to continue',
        message: 'Creating a portfolio requires an account.',
        suggestion: 'Sign in to link this upload to your workspace.',
        isAuthError: true  // Special flag for auth errors, but still returns standard object
      }
    }
    
    if (statusCode === 408 || errorMessage.includes('timed out')) {
      return {
        title: 'Upload timed out',
        message: 'The connection took too long and the upload was interrupted.',
        suggestion: 'Check your network and try again; large files work best on a stable connection.'
      }
    }
    
    if (statusCode === 413 || errorMessage.includes('too large')) {
      return {
        title: 'File is too large',
        message: 'Maximum file size is 10 MB.',
        suggestion: 'Reduce the file size (export to PDF, compress images) and try again.'
      }
    }
    
    if (statusCode === 415 || errorMessage.includes('Unsupported')) {
      return {
        title: 'File type not supported',
        message: 'Supported types: PDF, DOC/DOCX, TXT, PNG, JPG, WEBP, RTF.',
        suggestion: 'Export your resume to one of the supported formats and re-upload.'
      }
    }
    
    if (statusCode === 429 || errorMessage.includes('rate limit')) {
      return {
        title: 'Too many uploads',
        message: "You've reached the upload limit for now.",
        suggestion: 'Please wait and try again later. Sign in for higher limits.'
      }
    }
    
    if (statusCode === 422 || errorMessage.includes('extract text')) {
      return {
        title: "Couldn't read the file",
        message: "We couldn't extract text from this file.",
        suggestion: 'Try a higher-quality scan or export a text-based PDF.'
      }
    }
    
    if (statusCode === 404) {
      return {
        title: 'Item not found',
        message: "We couldn't find that upload (it may have expired).",
        suggestion: 'Upload the file again to continue.'
      }
    }
    
    // Default 500 error
    return {
      title: 'Something went wrong',
      message: "We couldn't process the file due to a server error.",
      suggestion: 'Try again in a few minutes. If this keeps happening, export to PDF or contact support.'
    }
  }
  
  const handleFileSelect = async (file: File) => {
    // Single orchestrator for all file uploads - validation first, then animation
    console.log('📁 File selected, starting unified upload flow:', file.name)
    
    // Check if we're already validating
    if (isValidatingRef.current) {
      console.log('⚠️ Already validating a file, ignoring duplicate request')
      return
    }
    
    // Check if it's the same file we're currently processing
    const fingerprint = getFileFingerprint(file)
    if (currentFileFingerprint.current === fingerprint && isValidatingRef.current) {
      console.log('⚠️ Same file already being processed, ignoring duplicate')
      return
    }
    
    // Set validation guard
    isValidatingRef.current = true
    currentFileFingerprint.current = fingerprint
    
    // Close any error toast
    setErrorToast(prev => ({ ...prev, isOpen: false }))
    
    // Clear old files first
    setUploadedFile(null)
    setDroppedFile(null)
    
    // Mark that we're handling file selection to prevent double processing
    // This flag will be read by Resume2WebsiteDemo to skip its auto-start effect
    window.__isHandlingFileSelect = true
    
    // Use requestAnimationFrame to ensure clean render boundary
    requestAnimationFrame(() => {
      // Set the new file after paint
      setUploadedFile(file)
      
      // For unauthenticated users, also set dropped file
      if (!isAuthenticated) {
        setDroppedFile(file)
      }
      
      // Now validate the file first
      console.log('🔍 Validating file before animation...')
      uploadFile(file).then(uploadResponse => {
        // File is valid! Now trigger animation
        console.log('✅ File validated successfully, auto-starting animation...')
        
        // Store the job ID for later use
        if (uploadResponse.job_id) {
          localStorage.setItem('pending_job_id', uploadResponse.job_id)
        }
        
        // Dispatch event immediately - no timeout needed
        const event = new CustomEvent(RESUME_AUTO_START_EVENT, { detail: file })
        window.dispatchEvent(event)
        console.log('🚀 Auto-start event dispatched for:', file.name)
      }).catch(error => {
        console.error('❌ File validation failed:', error)
        
        // Get standardized error message
        const errorInfo = getStandardizedError(error)
        
        // Show auth modal if needed
        if (errorInfo.isAuthError) {
          setShowAuthModal(true)
          return
        }
        
        // Show error toast with standardized message
        setErrorToast({
          isOpen: true,
          title: errorInfo.title,
          message: errorInfo.message,
          suggestion: errorInfo.suggestion
        })
        
        // Clear the invalid file and reset all animation states
        setUploadedFile(null)
        setDroppedFile(null)
      }).finally(() => {
        // Clear all guards on both success and error
        window.__isHandlingFileSelect = false
        isValidatingRef.current = false
        // Keep the fingerprint until next file to detect true duplicates
      })
    })
  }

  const handleCVCardClick = (file: File) => {
    // This function is not used since Resume2WebsiteDemo handles clicks internally
    // We can't directly trigger the animation from here
  }

  const handleLogout = async () => {
    // Call backend logout endpoint
    try {
      const sessionId = localStorage.getItem('resume2website_session_id')
      if (sessionId) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2000'}/api/v1/logout`, {
          method: 'POST',
          headers: {
            'X-Session-ID': sessionId
          }
        })
      }
    } catch (error) {
      console.error('Logout API call failed:', error)
    }
    
    // Clear auth state
    signOut()
    
    // Clear all component states
    setShowDashboard(false)
    setUploadedFile(null)
    setDroppedFile(null)
    
    // Force page refresh to reset everything to initial state
    window.location.href = window.location.origin + '?key=nitzan-secret-2024'
  }

  // Builder flow handlers
  const handleBuilderBack = () => {
    setShowBuilder(false)
    setIsModalOpen(true)
  }

  const handleBuilderClose = () => {
    setShowBuilder(false)
  }

  const handleFreeForm = () => {
    setShowBuilder(false)
    setShowProcessing(true)
  }

  const handleGuided = () => {
    setShowBuilder(false)
    setShowProcessing(true)
  }

  // Processing flow handlers
  const handleProcessingComplete = () => {
    setShowProcessing(false)
    setShowDashboard(true)
    console.log('Processing complete - showing dashboard')
  }

  const handlePlanRequired = () => {
    // This will be called when processing reaches 75%
    // The pricing modal should open over the processing screen
    setShowPricing(true)
  }

  // Pricing modal handlers
  const handlePlanSelected = (planId: string) => {
    setShowPricing(false)
    setIsPostPayment(true)
    // Resume processing from 75% with post-payment flow
    console.log(`Plan selected: ${planId} - resuming processing`)
  }
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  useEffect(() => {
    if (isMobile) return // Only apply snap scrolling on desktop
    
    let scrollTimeout: NodeJS.Timeout
    let isAnimating = false
    
    // Function to get current section based on scroll position
    const getCurrentSectionFromScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      
      for (let i = 0; i < sections.length; i++) {
        const element = document.getElementById(sections[i])
        if (element) {
          const rect = element.getBoundingClientRect()
          const elementTop = rect.top + scrollY
          const elementBottom = elementTop + rect.height
          
          // Check if we're in the middle of this section
          if (scrollY >= elementTop - windowHeight/2 && scrollY < elementBottom - windowHeight/2) {
            return i
          }
        }
      }
      return currentSection
    }
    
    const scrollToSection = (sectionIndex: number) => {
      if (isAnimating) return
      
      isAnimating = true
      setIsScrolling(true)
      setCurrentSection(sectionIndex)
      
      const element = document.getElementById(sections[sectionIndex])
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false)
        isAnimating = false
      }, 1200)
    }
    
    const handleWheel = (e: WheelEvent) => {
      if (isScrolling || isAnimating) return
      
      e.preventDefault()
      
      const currentScrollSection = getCurrentSectionFromScroll()
      const direction = e.deltaY > 0 ? 1 : -1
      const nextSection = Math.max(0, Math.min(sections.length - 1, currentScrollSection + direction))
      
      if (nextSection !== currentScrollSection) {
        scrollToSection(nextSection)
      }
    }
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrolling || isAnimating) return
      
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault()
        const currentScrollSection = getCurrentSectionFromScroll()
        const nextSection = Math.min(sections.length - 1, currentScrollSection + 1)
        if (nextSection !== currentScrollSection) {
          scrollToSection(nextSection)
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault()
        const currentScrollSection = getCurrentSectionFromScroll()
        const nextSection = Math.max(0, currentScrollSection - 1)
        if (nextSection !== currentScrollSection) {
          scrollToSection(nextSection)
        }
      }
    }
    
    // Update current section based on scroll position periodically
    const handleScroll = () => {
      if (!isScrolling && !isAnimating) {
        const newSection = getCurrentSectionFromScroll()
        if (newSection !== currentSection) {
          setCurrentSection(newSection)
          
          // Phase 6: Trigger signup modal after 2 sections (when reaching research section - index 2)
          if (newSection === 2 && !hasTriggeredPhase6Modal && !isAuthenticated) {
            setHasTriggeredPhase6Modal(true)
            // Small delay to ensure smooth transition
            setTimeout(() => {
              handleOpenModal()
            }, 500)
          }
        }
      }
    }
    
    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [currentSection, isScrolling, isMobile, sections, hasTriggeredPhase6Modal, isAuthenticated, handleOpenModal])

  // Show dashboard if processing is complete
  if (showDashboard && isAuthenticated) {
    return (
      <SimpleDashboard 
        userName={user?.name || "User"} 
        onBackToHome={() => setShowDashboard(false)}
        initialPage="resume"
      />
    )
  }

  // Prevent hydration errors by not rendering until client-side
  if (!isHydrated) {
    return (
      <main className="min-h-screen bg-background">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <AppleNavbar 
        onOpenModal={handleOpenModal} 
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={handleLogout}
        onShowDashboard={() => setShowDashboard(true)}
        onFileSelect={handleFileSelect}
      />
      <section id="hero" className="pt-16 relative min-h-screen">
        <div className="hidden md:block absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent via-white/50 to-gray-100 z-20"></div>
        <Resume2WebsiteDemo 
          onOpenModal={handleOpenModal} 
          setShowPricing={setShowPricing}
          uploadedFile={uploadedFile}
          setUploadedFile={setUploadedFile}
          onFileClick={handleCVCardClick}
          handleFileSelect={handleFileSelect}
          signIn={signIn}
          setErrorToast={setErrorToast}
          isRetrying={isRetrying}
          setIsRetrying={setIsRetrying}
        />
      </section>
      <section id="demo" className="min-h-screen">
        <SeeTheDifference onOpenModal={handleOpenModal} setShowPricing={setShowPricing} />
      </section>
      <section id="research" className="py-20 min-h-screen flex items-center relative">
        {/* Base white background */}
        <div className="absolute inset-0 bg-white"></div>
        
        {/* Desktop gradient - Diagonal flow with symmetrical spots */}
        <div className="hidden md:block absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/8 via-transparent via-sky-400/12 via-emerald-500/8 to-transparent"></div>
          {/* Right side emerald glow */}
          <div className="absolute top-1/4 right-0 w-1/3 h-1/2 bg-gradient-to-l from-emerald-500/15 via-sky-400/10 to-transparent rounded-full blur-3xl"></div>
          {/* Left side emerald glow (symmetrical) */}
          <div className="absolute top-1/4 left-0 w-1/3 h-1/2 bg-gradient-to-r from-emerald-500/15 via-sky-400/10 to-transparent rounded-full blur-3xl"></div>
          {/* Bottom blue accent */}
          <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 w-1/2 h-1/3 bg-gradient-to-t from-blue-600/12 via-sky-400/8 to-transparent rounded-full blur-3xl"></div>
        </div>
        
        {/* Mobile gradient - Vertical flow with symmetrical elements */}
        <div className="block md:hidden absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-600/8 via-transparent via-sky-400/15 via-emerald-500/10 to-transparent"></div>
          <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-3/4 h-1/4 bg-gradient-to-b from-emerald-500/20 via-sky-400/15 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 w-3/4 h-1/4 bg-gradient-to-t from-blue-600/15 via-sky-400/12 to-transparent rounded-full blur-2xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <StackedCardsCarousel />
          
          {/* Phase 8 Level 2: Progressive Conviction Flow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-16"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <Button
                size="lg"
                onClick={() => setShowPricing(true)}
                className="bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 hover:from-emerald-600 hover:via-sky-500 hover:to-blue-700 text-white border-0 text-lg px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-xl w-full sm:w-auto"
              >
                Understood, Let's do it!
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  const element = document.getElementById('ugc-reels')
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
                className="bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 hover:border-gray-400 text-lg px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 w-full sm:w-auto"
              >
                I see.. Still not convinced…
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      <section id="ugc-reels" className="min-h-screen">
        <UGCReelsShowcase onOpenModal={handleOpenModal} setShowPricing={setShowPricing} />
      </section>
      <section id="faq" className="min-h-screen">
        <FAQ onOpenModal={handleOpenModal} setShowPricing={setShowPricing} />
      </section>
      <footer className="w-full flex flex-col items-center justify-center py-8 backdrop-blur-md border-t border-gray-200/40 mt-12 relative">
        {/* Base gray background */}
        <div className="absolute inset-0 bg-gray-50"></div>
        
        {/* Desktop gradient - Circular spotlight effect */}
        <div className="hidden md:block absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-100 via-gray-50 to-transparent"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-full bg-gradient-to-r from-emerald-500/6 via-sky-400/8 via-blue-600/6 to-emerald-500/6 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-1/4 w-1/2 h-1/2 bg-gradient-to-t from-blue-600/10 via-sky-400/6 to-transparent rounded-full blur-2xl"></div>
        </div>
        
        {/* Mobile gradient - Subtle bottom glow */}
        <div className="block md:hidden absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-100 to-gray-50"></div>
          <div className="absolute bottom-0 left-0 right-0 h-3/4 bg-gradient-to-t from-emerald-500/8 via-sky-400/6 to-transparent rounded-full blur-xl"></div>
        </div>
        
        <div className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-between gap-4 px-4 relative">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <a href="/blog" className="text-gray-700 hover:text-blue-600 transition-colors text-base font-medium">Blog</a>
            <a href="/terms" className="text-gray-700 hover:text-blue-600 transition-colors text-base font-medium">Terms & Conditions</a>
            <a href="/privacy" className="text-gray-700 hover:text-blue-600 transition-colors text-base font-medium">Privacy Policy</a>
          </div>
          <button 
            onClick={handleOpenModal}
            className="bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 hover:from-emerald-600 hover:via-sky-500 hover:to-blue-700 text-white border-0 px-8 py-3 rounded-full text-base font-semibold shadow-lg transition-all duration-300 hover:scale-105"
          >
            Convert your Resume now
          </button>
        </div>
        <div className="text-xs text-gray-400 mt-6 relative">&copy; {new Date().getFullYear()} Resume2Website. All rights reserved.</div>
      </footer>

      {/* Resume Flow Modal */}
      <ResumeFlowModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onYesChoice={handleYesChoice}
        onNoChoice={handleNoChoice}
      />

      {/* Upload Resume Modal */}
      <UploadResume
        isOpen={showUpload}
        onClose={handleUploadClose}
        onBack={handleUploadBack}
        onSuccess={handleUploadSuccess}
        initialFile={droppedFile}
        onAuthRequired={() => setShowAuthModal(true)}
      />

      {/* Resume Builder Modal */}
      <ResumeBuilder
        isOpen={showBuilder}
        onClose={handleBuilderClose}
        onBack={handleBuilderBack}
        onFreeForm={handleFreeForm}
        onGuided={handleGuided}
      />

      {/* Processing Page */}
      <ProcessingPage
        isOpen={showProcessing}
        file={uploadedFile}
        onComplete={handleProcessingComplete}
        onPlanRequired={handlePlanRequired}
        isPostPayment={isPostPayment}
        onAuthRequired={() => {
          console.log('Auth required after scrolling portfolio preview')
          if (!isAuthenticated) {
            setShowAuthModal(true)
          }
        }}
      />


      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={handleAuthClose}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Pricing Modal */}
      {showPricing && (
        <PricingSelector
          portfolioId={undefined}
          onPaymentSuccess={() => {
            setShowPricing(false)
            // Handle payment success
          }}
        />
      )}
      
      {/* Error Toast - Global for all components */}
      <ErrorToast
        isOpen={errorToast.isOpen}
        onClose={() => setErrorToast(prev => ({ ...prev, isOpen: false }))}
        title={errorToast.title}
        message={errorToast.message}
        suggestion={errorToast.suggestion}
        onRetryUpload={handleFileSelect}
      />
    </main>
  )
}
