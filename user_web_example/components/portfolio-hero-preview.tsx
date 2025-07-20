"use client"

import React, { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Loader2, ArrowDown } from 'lucide-react'
import { TemplateHeroPreview } from './template-hero-preview'

interface PortfolioHeroPreviewProps {
  file: File
  onScrollAttempt?: () => void
}

export default function PortfolioHeroPreview({ file, onScrollAttempt }: PortfolioHeroPreviewProps) {
  const [isProcessing, setIsProcessing] = useState(true)
  const [heroData, setHeroData] = useState({ name: '', professionalTitle: '' })
  const [error, setError] = useState<string>('')
  const containerRef = useRef<HTMLDivElement>(null)
  const hasTriggered = useRef(false)

  useEffect(() => {
    // Reset when file changes
    hasTriggered.current = false
    extractHeroData()
  }, [file])

  const extractHeroData = async () => {
    setIsProcessing(true)
    setError('')
    
    // For the landing page demo, we'll use smart filename parsing
    // to avoid backend dependency and provide instant feedback
    const fileName = file.name.replace(/\.[^/.]+$/, '')
    
    // Pattern: "Name - Title.pdf"
    if (fileName.includes(' - ')) {
      const parts = fileName.split(' - ')
      const name = parts[0].trim()
      const title = parts[1].replace(/CV|Resume|cv|resume|\d+|\./g, '').trim()
      
      setHeroData({
        name: name,
        professionalTitle: title || 'Professional'
      })
    } else if (fileName.toLowerCase().includes('resume') || fileName.toLowerCase().includes('cv')) {
      // Extract name from "Name Resume" or "Name_CV" patterns
      const name = fileName.replace(/[_-]?(Resume|CV|resume|cv).*/i, '').trim()
      setHeroData({
        name: name || 'Your Name',
        professionalTitle: 'Professional'
      })
    } else {
      // Simple pattern
      setHeroData({
        name: fileName.split(/[-_]/)[0].trim(),
        professionalTitle: 'Professional'
      })
    }
    
    setIsProcessing(false)
  }

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || hasTriggered.current) return
      
      const scrollTop = containerRef.current.scrollTop
      
      // Trigger when user scrolls down even slightly (10px)
      if (scrollTop > 10 && !hasTriggered.current) {
        hasTriggered.current = true
        if (onScrollAttempt) {
          onScrollAttempt()
        }
      }
    }

    const container = containerRef.current
    if (container) {
      // Add both scroll and wheel events for better detection
      container.addEventListener('scroll', handleScroll)
      container.addEventListener('wheel', handleScroll)
      
      return () => {
        container.removeEventListener('scroll', handleScroll)
        container.removeEventListener('wheel', handleScroll)
      }
    }
  }, [onScrollAttempt])

  if (isProcessing) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#0a0a0a] rounded-md">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-white mb-4 mx-auto" />
          <p className="text-white/80 text-sm">Extracting CV data...</p>
        </div>
      </div>
    )
  }

  // Use the EXACT template hero preview with extracted data
  return (
    <div 
      ref={containerRef} 
      className="w-full h-full overflow-y-auto bg-[hsl(39,56%,95%)]"
      style={{ position: 'absolute', inset: 0 }}
    >
      <TemplateHeroPreview 
        fullName={heroData.name}
        professionalTitle={heroData.professionalTitle}
      />
      
      {/* Marketing content to encourage scrolling */}
      <div className="min-h-[50vh] w-full bg-gradient-to-b from-[hsl(39,56%,95%)] to-[hsl(39,56%,90%)] flex items-center justify-center px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl"
        >
          <h2 className="text-4xl font-bold text-[hsl(20,14%,4%)] mb-6">
            This Could Be Your Portfolio
          </h2>
          <p className="text-xl text-[hsl(20,14%,4%)]/80 mb-4">
            Join thousands of professionals who've transformed their CVs into stunning portfolios
          </p>
          <p className="text-lg text-[hsl(20,14%,4%)]/60">
            Get hired 3x faster with a portfolio that showcases your true potential
          </p>
          
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="mt-12 text-[hsl(20,14%,4%)]/40"
          >
            <p className="text-sm mb-2">Continue scrolling to see more</p>
            <ArrowDown className="w-6 h-6 mx-auto" />
          </motion.div>
        </motion.div>
      </div>
      
      {/* Additional sections to ensure scrollability */}
      <div className="min-h-[50vh] w-full bg-[hsl(39,56%,90%)] flex items-center justify-center px-8">
        <div className="text-center">
          <h3 className="text-3xl font-bold text-[hsl(20,14%,4%)] mb-4">Ready to Get Started?</h3>
          <p className="text-lg text-[hsl(20,14%,4%)]/80">Sign up now to create your portfolio</p>
        </div>
      </div>
    </div>
  )
}