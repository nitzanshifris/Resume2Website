"use client"

import type React from "react"

import { useState, useEffect, useRef, useLayoutEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ArrowDown, Menu, X } from "lucide-react"
import { ParticleSystem } from "@/components/particle-system"
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
import ProcessingPage from "@/components/processing-page"
import PricingModal from "@/components/pricing-modal"
import SimpleDashboard from "@/components/simple-dashboard"

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
  return <span dangerouslySetInnerHTML={{ __html: result }} />
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
        <div key={index} dangerouslySetInnerHTML={{ __html: styledLine }} />
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

// CV2Web Demo Component - Mobile-First WOW Experience
function CV2WebDemo({ onOpenModal }: { onOpenModal: () => void }) {
  const [stage, setStage] = useState<
    "typewriter" | "intro" | "initial" | "morphing" | "dissolving" | "materializing" | "complete"
  >("typewriter")
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showNewTypewriter, setShowNewTypewriter] = useState(false)
  const headlineRef = useRef<HTMLDivElement>(null)
  const [headlineWidth, setHeadlineWidth] = useState<number | undefined>(undefined)
  
  // Loading sequence states for mobile
  const [loadingStep, setLoadingStep] = useState(0) // 0: backgrounds, 1: headline, 2: subheadline, 3: cv image

  // Helper functions for stage checking
  const isTransformationStage = () => stage === "materializing" || stage === "complete"
  const isActiveStage = () => stage === "intro" || stage === "initial" || stage === "morphing" || stage === "dissolving" || stage === "materializing" || stage === "complete"
  const isTransformingStage = () => stage === "initial" || stage === "morphing" || stage === "dissolving" || stage === "materializing" || stage === "complete"

  // Detect mobile and set initial stage
  useEffect(() => {
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

    const sequence = async () => {
      // Stage 1: CV Display (keep original content visible)
      setStage("initial")
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Stage 2: Quick Morphing (still original content)
      setStage("morphing")
      await new Promise((resolve) => setTimeout(resolve, 1800))

      // Stage 3: Dissolution (still original content)
      setStage("dissolving")
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Stage 4: Website Materialization (MacBook appears)
      setStage("materializing")
      await new Promise((resolve) => setTimeout(resolve, 1200))

      // Stage 5: Complete (final state)
      setStage("complete")
      setIsPlaying(false)
    }

    sequence()
  }, [isPlaying])

  // Progress tracking
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 1.5, 100))
      }, 50)
      return () => clearInterval(interval)
    }
  }, [isPlaying])

  // Trigger new typewriter on desktop AFTER MacBook starts materializing
  useEffect(() => {
    if (!isMobile && !showNewTypewriter && isPlaying && stage === "materializing") {
      const timer = setTimeout(() => {
        setShowNewTypewriter(true)
      }, 600) // Wait 600ms after materialization starts
      return () => clearTimeout(timer)
    }
  }, [isMobile, showNewTypewriter, isPlaying, stage])

  useLayoutEffect(() => {
    if (headlineRef.current) {
      setHeadlineWidth(headlineRef.current.offsetWidth)
    }
  }, [stage])

  const handleStartDemo = () => {
    setIsPlaying(true)
    setProgress(0)
  }

  // Mobile-First Layout
  if (isMobile) {
    // Boxed block rendered only once, inside main content flow, left-aligned, mobile only
    const showStableHeadline = stage !== "typewriter"
    return (
      <div className="min-h-screen w-full relative overflow-hidden">
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
                      Turn your <span className="text-gray-800 italic relative inline-block">
                        PDF résumé
                        <span className="absolute top-1/2 left-0 w-full h-0.5 bg-red-500 transform -rotate-1 z-10" style={{ 
                          background: '#dc2626',
                          opacity: '0.6',
                          borderRadius: '1px',
                          filter: 'blur(0.2px)'
                        }}></span>
                      </span> into a <span className="bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 bg-clip-text text-transparent font-bold">Web&nbsp;Portfolio</span> in <span className="bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 bg-clip-text text-transparent font-bold">One&nbsp;click</span>.
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
                    className="text-black font-bold mb-12 text-left"
                    style={{ fontSize: 'clamp(1.5rem, 5vw, 1.8rem)', fontWeight: 600 }}
                    onAnimationComplete={() => handleLoadingComplete(2)}
                  >
                    Take control of your career, stand out, get&nbsp;interviews
                  </motion.div>
                )}
              </div>
            </div>
          )}
          {/* Progress bar */}
          {isPlaying && (
            <motion.div
              className="absolute top-0 left-0 right-0 h-1 bg-muted z-50"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeOut", duration: 0.3 }}
            >
              <div className="h-full bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600"></div>
            </motion.div>
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
                <CVCard 
                  className="w-full h-full" 
                  withMacOSEffects 
                  onClick={!isPlaying ? handleStartDemo : undefined}
                />
                {/* See How It Works button as a floating layer on top of the CV image (mobile only) */}
                <button
                  onClick={handleStartDemo}
                  className="absolute left-1/2 bottom-[73%] -translate-x-1/2 z-30 px-4 py-2.5 rounded-full text-base font-semibold shadow-lg md:hidden whitespace-nowrap group relative bg-black border-2 border-black transition-all duration-300 hover:scale-105"
                  style={{ minWidth: '170px' }}
                  disabled={isPlaying}
                >
                  <span className="relative z-10 inline-flex items-center">
                    <span className="bg-clip-text group-hover:text-transparent bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 transition-colors duration-300 text-white">See how it works</span>
                    <ArrowRight className="ml-2 w-5 h-5 text-white group-hover:text-emerald-400 transition-colors duration-300" />
                  </span>
                </button>
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
                <ParticleSystem
                  isActive={true}
                  width={340}
                  height={485}
                  intensity={stage === 'morphing' ? 'high' : 'medium'}
                  particleType={stage === 'morphing' ? 'magical' : 'dissolve'}
                />
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
                </IPhoneFrame>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    )
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className={`max-w-none w-full relative ${isTransformationStage() ? "space-y-16" : "space-y-16"}`}
            >


              {/* Component 2: Main Headline - much bigger for transformation stage */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className={isTransformationStage() ? "" : ""}
              >
                <AnimatePresence mode="wait">
                  {!showNewTypewriter ? (
                    <motion.div
                      key="original-headline"
                      initial={{ opacity: 1 }}
                      exit={{
                        opacity: 0,
                        transition: { duration: 1.5, ease: "easeOut" },
                      }}
                      className={`${isTransformationStage() ? "text-4xl xs:text-4xl sm:text-5xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl 3xl:text-8xl" : "text-5xl xs:text-5xl sm:text-6xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl 3xl:text-9xl"} font-bold max-w-[120%]`}
                      style={{ lineHeight: '0.95' }}
                    >
                      <motion.span
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{
                          duration: 0.8,
                          ease: [0.34, 1.56, 0.64, 1],
                          delay: 0.6
                        }}
                        className="text-foreground"
                      >
                        <div className={`${isTransformationStage() ? "mb-6" : "mb-8"}`} style={{ fontWeight: 700 }}>
                          <span className="text-gray-800 font-bold">
                            Turn your <span className="text-gray-800 italic relative inline-block">
                              PDF résumé
                              <span className="absolute top-1/2 left-0 w-full h-0.5 bg-red-500 transform -rotate-1 z-10" style={{ 
                                background: '#dc2626',
                                opacity: '0.6',
                                borderRadius: '1px',
                                filter: 'blur(0.2px)'
                              }}></span>
                            </span> into a <span className="bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 bg-clip-text text-transparent font-bold">Web&nbsp;Portfolio</span> in <span className="bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 bg-clip-text text-transparent font-bold">One&nbsp;click</span>.
                          </span>
                        </div>
                        <motion.div 
                          className={`${isTransformationStage() ? "text-base xs:text-lg sm:text-xl md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl 3xl:text-5xl" : "text-lg xs:text-xl sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl 3xl:text-6xl"} text-black font-medium leading-tight max-w-[120%]`}
                          style={{ fontWeight: 500 }}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.6 }}
                        >
                          Take control of your career, stand out, get&nbsp;interviews
                        </motion.div>
                        
                        {/* Watch how it works button - desktop only */}
                        {!isPlaying && (
                          <div 
                            className="hidden md:block mt-6 relative isolate" 
                            style={{ 
                              zIndex: 10000,
                              isolation: 'isolate',
                              pointerEvents: 'auto'
                            }}
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log('Button clicked!');
                                handleStartDemo();
                              }}
                              disabled={isPlaying}
                              className="px-8 py-2.5 rounded-full text-base md:text-lg font-semibold shadow-lg whitespace-nowrap group relative bg-black border-2 border-black cursor-pointer isolate"
                              style={{ 
                                position: 'relative', 
                                zIndex: 10000,
                                transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
                                transform: 'scale(1)',
                                backfaceVisibility: 'hidden',
                                isolation: 'isolate',
                                pointerEvents: 'auto'
                              }}
                              onMouseEnter={(e) => {
                                console.log('Button hover!');
                                e.currentTarget.style.transform = 'scale(1.05)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                              }}
                            >
                              <span className="relative z-10 inline-flex items-center pointer-events-auto">
                                <span className="bg-clip-text group-hover:text-transparent bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 transition-colors duration-200 text-white">Watch how it works</span>
                                <ArrowRight className="ml-3 w-5 h-5 text-white group-hover:text-emerald-400 transition-colors duration-200" />
                              </span>
                            </button>
                          </div>
                        )}
                      </motion.span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="new-headline"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold max-w-[120%] text-left"
                      style={{ lineHeight: '0.9' }}
                    >
                      <div className="space-y-1">
                        <div className="text-foreground">Take</div>
                        <div className="bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 bg-clip-text text-transparent">Control</div>
                      </div>
                      <div className="text-2xl md:text-4xl text-gray-600 font-semibold mt-4 leading-tight">
                        Stand Out, Get Interviews
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                            </motion.div>

              {/* Start now button - keep in original position on left side */}
              <AnimatePresence mode="wait">
                {stage === "complete" ? (
                  <motion.div
                    key="transform-button"
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    transition={{
                      duration: 1.5,
                      ease: "easeInOut",
                      delay: 1.5,
                    }}
                    className={`flex ${isTransformationStage() ? "justify-start" : "justify-start"}`}
                  >
                    <div className="flex gap-4">
                      <motion.div
                        animate={{
                          scale: [1, 1.02, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: 2,
                          ease: "easeInOut",
                          delay: 2.5,
                        }}
                      >
                        <Button
                          size="lg"
                          onClick={onOpenModal}
                          className="bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 hover:from-emerald-600 hover:via-sky-500 hover:to-blue-700 text-white border-0 w-auto text-base md:text-lg px-6 py-4 transition-all duration-300 hover:scale-105 rounded-full"
                        >
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 1.0 }}
                          >
                            Start now
                            <ArrowRight className="ml-3 w-5 h-5 inline-block" />
                          </motion.span>
                        </Button>
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 1.8 }}
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
        <div className={`${isTransformationStage() ? "w-[65%]" : "w-1/2"} h-full flex items-center ${(stage === "materializing" || stage === "complete") ? "justify-start" : "justify-center"} relative ${(stage === "materializing" || stage === "complete") ? "pl-2 pr-4 md:pr-6 lg:pr-8" : "pl-0 pr-4 md:pr-8 lg:pr-12"}`} style={{ pointerEvents: 'none' }}>
            <div className="absolute inset-0" style={{ pointerEvents: 'none', zIndex: 1 }}>
              <ParticleSystem
                isActive={stage === "morphing" || stage === "dissolving"}
                width={1000}
                height={1000}
                intensity={stage === "morphing" ? "high" : "medium"}
                particleType={stage === "morphing" ? "magical" : "dissolve"}
              />
            </div>



            <AnimatePresence mode="wait">
              {(stage === "initial" || stage === "intro" || stage === "typewriter") && (
                <motion.div
                  key="initial"
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    scale: 1.05,
                    y: -20,
                    filter: "blur(4px)",
                    transition: { duration: 0.6, ease: "easeInOut" },
                  }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 1.0 }}
                className="relative flex justify-start pl-8"
              >
                {/* CV Card - 80% of original size, positioned to the left - CLICKABLE */}
                <CVCard 
                  className="relative z-5 w-[268px] xs:w-[308px] sm:w-[344px] md:w-[384px] lg:w-[424px] xl:w-[460px] 2xl:w-[500px] h-[344px] xs:h-[384px] sm:h-[460px] md:h-[500px] lg:h-[540px] xl:h-[576px]" 
                  withMacOSEffects 
                  onClick={!isPlaying ? handleStartDemo : undefined}
                />
                </motion.div>
              )}

              {(stage === "morphing" || stage === "dissolving") && (
                <motion.div
                  key="transforming"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                className="w-[290px] xs:w-[335px] sm:w-[385px] md:w-[430px] lg:w-[480px] xl:w-[530px] h-[385px] xs:w-[430px] sm:h-[525px] md:h-[575px] lg:h-[625px] xl:h-[675px] relative"
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
                  </MacBookFrame>
                  

                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

// Apple-style Navbar Component
const AppleNavbar = ({ onOpenModal }: { onOpenModal: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/80 backdrop-blur-md border-b border-gray-200/20 shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center cursor-pointer"
            onClick={() => scrollToSection('hero')}
          >
            <div className="text-xl font-bold bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 bg-clip-text text-transparent">
              CV2Web
              </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {[
              { name: 'Home', id: 'hero' },
              { name: 'Demo', id: 'demo' },
              { name: 'Research', id: 'research' },
              { name: 'FAQ', id: 'faq' }
            ].map((item) => (
              <motion.button
                key={item.name}
                onClick={() => scrollToSection(item.id)}
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-200 relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.name}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 rounded-full"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.button>
            ))}
      </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={onOpenModal}
                className="bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 hover:from-emerald-600 hover:via-sky-500 hover:to-blue-700 text-white border-0 px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 shadow-lg"
              >
                Get Started
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
              className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200/20"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
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
                <motion.div className="pt-2" whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={onOpenModal}
                    className="w-full bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 hover:from-emerald-600 hover:via-sky-500 hover:to-blue-700 text-white border-0 px-6 py-2 rounded-full text-sm font-medium transition-all duration-300"
                  >
                    Get Started
              </Button>
                </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
      </div>
    </motion.nav>
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
  const [showPricing, setShowPricing] = useState(false)
  const [isPostPayment, setIsPostPayment] = useState(false)
  const [showDashboard, setShowDashboard] = useState(false)
  
  const sections = ['hero', 'demo', 'research', 'ugc-reels', 'faq']

  // Modal handlers
  const handleOpenModal = () => {
    setIsModalOpen(true)
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
  }, [currentSection, isScrolling, isMobile, sections])

  // Show dashboard if processing is complete
  if (showDashboard) {
    return <SimpleDashboard userName="Alex Johnson" />
  }

  return (
    <main className="min-h-screen bg-background">
      <AppleNavbar onOpenModal={handleOpenModal} />
      <section id="hero" className="pt-16 relative min-h-screen">
        <div className="hidden md:block absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent via-white/50 to-gray-100 z-20"></div>
        <CV2WebDemo onOpenModal={handleOpenModal} />
      </section>
      <section id="demo" className="min-h-screen">
        <SeeTheDifference onOpenModal={handleOpenModal} />
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
        </div>
      </section>
      <section id="ugc-reels" className="min-h-screen">
        <UGCReelsShowcase onOpenModal={handleOpenModal} />
      </section>
      <section id="faq" className="min-h-screen">
        <FAQ onOpenModal={handleOpenModal} />
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
        <div className="text-xs text-gray-400 mt-6 relative">&copy; {new Date().getFullYear()} CV2Web. All rights reserved.</div>
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
        onComplete={handleProcessingComplete}
        onPlanRequired={handlePlanRequired}
        isPostPayment={isPostPayment}
      />

      {/* Pricing Modal */}
      <PricingModal
        isOpen={showPricing}
        onPlanSelected={handlePlanSelected}
      />
    </main>
  )
}
