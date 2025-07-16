"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type JobCategory = "Software Developer" | "Digital Marketer" | "Financial Analyst" | "Sales Manager"

interface CategoryData {
  title: JobCategory
  pdfUrl: string
  websiteUrl: string
  name: string
  role: string
}

const categoryData: Record<JobCategory, CategoryData> = {
  "Software Developer": {
    title: "Software Developer",
    pdfUrl: "https://via.placeholder.com/400x600/1e40af/white?text=Software+Developer+Resume",
    websiteUrl: "https://dmfmjqvp.manus.space/#",
    name: "Alex Morgan",
    role: "Senior Software Engineer"
  },
  "Digital Marketer": {
    title: "Digital Marketer",
    pdfUrl: "https://via.placeholder.com/400x600/ec4899/white?text=Digital+Marketer+Resume",
    websiteUrl: "https://portfolio-example.com",
    name: "Sarah Chen",
    role: "Creative Director"
  },
  "Financial Analyst": {
    title: "Financial Analyst",
    pdfUrl: "https://via.placeholder.com/400x600/059669/white?text=Financial+Analyst+Resume",
    websiteUrl: "https://finance-portfolio.com",
    name: "Michael Johnson",
    role: "Finance Director"
  },
  "Sales Manager": {
    title: "Sales Manager",
    pdfUrl: "https://via.placeholder.com/400x600/dc2626/white?text=Sales+Manager+Resume",
    websiteUrl: "https://sales-portfolio.com",
    name: "Jennifer Davis",
    role: "Sales Director"
  }
}

const BeforeAfterSlider = ({ data }: { data: CategoryData }) => {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Get gradient style based on category
  const getGradientStyle = (category: string, opacity: number) => {
    switch (category) {
      case "Software Developer":
        return `linear-gradient(135deg, rgba(96, 165, 250, ${opacity}), rgba(59, 130, 246, ${opacity}), rgba(99, 102, 241, ${opacity}))`;
      case "Digital Marketer":
        return `linear-gradient(135deg, rgba(244, 114, 182, ${opacity}), rgba(244, 63, 94, ${opacity}), rgba(168, 85, 247, ${opacity}))`;
      case "Financial Analyst":
        return `linear-gradient(135deg, rgba(52, 211, 153, ${opacity}), rgba(34, 197, 94, ${opacity}), rgba(20, 184, 166, ${opacity}))`;
      default: // Sales Manager
        return `linear-gradient(135deg, rgba(251, 146, 60, ${opacity}), rgba(245, 158, 11, ${opacity}), rgba(234, 179, 8, ${opacity}))`;
    }
  };

  // Get solid color based on category for the slider handle
  const getSliderColor = (category: string) => {
    switch (category) {
      case "Software Developer":
        return "rgb(59, 130, 246)";
      case "Digital Marketer":
        return "rgb(244, 63, 94)";
      case "Financial Analyst":
        return "rgb(34, 197, 94)";
      default: // Sales Manager
        return "rgb(245, 158, 11)";
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
    updateSliderPosition(e.clientX)
    // Prevent text selection during drag
    document.body.style.userSelect = 'none'
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
    updateSliderPosition(e.touches[0].clientX)
    document.body.style.userSelect = 'none'
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return
    e.preventDefault()
    updateSliderPosition(e.clientX)
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return
    e.preventDefault()
    updateSliderPosition(e.touches[0].clientX)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    document.body.style.userSelect = ''
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    document.body.style.userSelect = ''
  }

  const updateSliderPosition = (clientX: number) => {
    if (!containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const percentage = ((clientX - rect.left) / rect.width) * 100
    setSliderPosition(Math.max(0, Math.min(100, percentage))) // Allow full range from edge to edge
  }

  useEffect(() => {
    if (isDragging) {
      // Mouse events
      document.addEventListener('mousemove', handleMouseMove, { passive: false })
      document.addEventListener('mouseup', handleMouseUp)
      // Touch events
      document.addEventListener('touchmove', handleTouchMove, { passive: false })
      document.addEventListener('touchend', handleTouchEnd)
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.removeEventListener('touchmove', handleTouchMove)
        document.removeEventListener('touchend', handleTouchEnd)
        document.body.style.userSelect = ''
      }
    }
  }, [isDragging])

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[600px] overflow-hidden rounded-xl cursor-col-resize select-none touch-none"
      style={{
        background: getGradientStyle(data.title, 0.1),
        padding: "1px",
        boxShadow: `0 0 20px ${getGradientStyle(data.title, 0.2)}`
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* Before - PDF Resume */}
      <div className="absolute inset-0 bg-white rounded-xl">
        <div className="w-full h-full flex items-center justify-center bg-gray-50">
          <Card className="w-[400px] h-[550px] bg-white shadow-lg overflow-hidden">
            <div className="p-6 space-y-4">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900">{data.name}</h3>
                <p className="text-gray-600">{data.role}</p>
                <p className="text-sm text-gray-500">📧 email@example.com | 📱 (555) 123-4567</p>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-800 border-b border-gray-300 pb-1">EXPERIENCE</h4>
                  <div className="mt-2 space-y-2 text-sm text-gray-700">
                    <div>
                      <p className="font-medium">Senior Position • Company Name</p>
                      <p className="text-xs text-gray-500">2021 - Present</p>
                      <ul className="list-disc list-inside text-xs space-y-1 mt-1">
                        <li>Bullet point describing achievement</li>
                        <li>Another accomplishment listed here</li>
                        <li>Additional responsibility or result</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-medium">Previous Role • Another Company</p>
                      <p className="text-xs text-gray-500">2018 - 2021</p>
                      <ul className="list-disc list-inside text-xs space-y-1 mt-1">
                        <li>Key achievement in previous role</li>
                        <li>Important project or responsibility</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 border-b border-gray-300 pb-1">SKILLS</h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"].map((skill) => (
                      <span key={skill} className="px-2 py-1 bg-gray-200 text-xs rounded">{skill}</span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 border-b border-gray-300 pb-1">EDUCATION</h4>
                  <div className="mt-2 text-sm text-gray-700">
                    <p className="font-medium">Degree Name</p>
                    <p className="text-xs text-gray-500">University Name • Year</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* After - Interactive Website */}
      <div 
        className="absolute inset-0 bg-white rounded-xl"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <div className="w-full h-full relative">
          <iframe
            src={data.websiteUrl}
            className="w-full h-full border-0"
            title={`${data.name} Portfolio Website`}
            style={{ pointerEvents: isDragging ? 'none' : 'auto' }}
          />
          {/* Overlay to prevent iframe interference during drag */}
          {isDragging && (
            <div className="absolute inset-0 z-10 cursor-col-resize" />
          )}
        </div>
      </div>

      {/* Slider Handle */}
      <div 
        className={`absolute top-0 bottom-0 w-1 shadow-lg cursor-col-resize z-20 ${isDragging ? '' : 'transition-all duration-150'}`}
        style={{ 
          left: `${sliderPosition}%`, 
          transform: 'translateX(-50%)',
          background: getGradientStyle(data.title, 0.8)
        }}
      >
        {/* Expanded hit area for easier grabbing */}
        <div 
          className="absolute top-0 bottom-0 w-8 cursor-col-resize"
          style={{ 
            left: '50%', 
            transform: 'translateX(-50%)',
            pointerEvents: 'auto'
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        />
        <div 
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center ${isDragging ? 'scale-110 shadow-xl' : 'hover:scale-105 transition-all duration-150'}`}
          style={{
            border: `2px solid ${getSliderColor(data.title)}`,
          }}
        >
          <div className="w-1 h-4 rounded" style={{ background: getSliderColor(data.title) }}></div>
          <div className="w-1 h-4 rounded ml-1" style={{ background: getSliderColor(data.title) }}></div>
        </div>
      </div>
    </div>
  )
}

export default function SeeTheDifference({ onOpenModal }: { onOpenModal?: () => void }) {
  const [selectedCategory, setSelectedCategory] = useState<JobCategory>("Software Developer")

  // Define gradient styles for both hover and selected states
  const getGradientStyle = (category: string, opacity: number) => {
    switch (category) {
      case "Software Developer":
        return `linear-gradient(135deg, rgba(96, 165, 250, ${opacity}), rgba(59, 130, 246, ${opacity}), rgba(99, 102, 241, ${opacity}))`;
      case "Digital Marketer":
        return `linear-gradient(135deg, rgba(244, 114, 182, ${opacity}), rgba(244, 63, 94, ${opacity}), rgba(168, 85, 247, ${opacity}))`;
      case "Financial Analyst":
        return `linear-gradient(135deg, rgba(52, 211, 153, ${opacity}), rgba(34, 197, 94, ${opacity}), rgba(20, 184, 166, ${opacity}))`;
      default: // Sales Manager
        return `linear-gradient(135deg, rgba(251, 146, 60, ${opacity}), rgba(245, 158, 11, ${opacity}), rgba(234, 179, 8, ${opacity}))`;
    }
  };

  return (
    <section className="py-20 relative">
      {/* Desktop gradient */}
      <div className="hidden md:block absolute inset-0 bg-gradient-to-b from-gray-100 via-emerald-500/10 via-sky-400/8 via-blue-600/6 to-transparent"></div>
      
      {/* Mobile gradient backgrounds */}
      <div className="block md:hidden absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/30 to-slate-50"></div>
        
        {/* Top emerald glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/8 rounded-full blur-3xl"></div>
        
        {/* Center sky accent */}
        <div className="absolute top-1/3 right-8 w-72 h-72 bg-sky-400/6 rounded-full blur-3xl"></div>
        
        {/* Bottom blue accent */}
        <div className="absolute bottom-0 left-8 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl"></div>
        
        {/* Additional soft emerald flow */}
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-emerald-400/4 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Section Header - Matching Research Section Styling */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 md:mb-8"
        >
          <div className="space-y-1 md:space-y-2 flex flex-col items-center">
            <h2 className="text-[2.5rem] md:text-[3.2rem] leading-[1.1] font-bold text-gray-900 tracking-tight">
              See the{" "}
              <span className="bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 bg-clip-text text-transparent">
                Difference.
              </span>
            </h2>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base md:text-xl text-gray-600 font-medium mt-2 md:mt-3 max-w-[400px] md:max-w-2xl"
            >
              <span className="hidden md:inline whitespace-nowrap">
                Same skills, different format, <span className="relative">who would you hire?
                  <motion.span 
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
                    className="absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-emerald-400 via-emerald-500 to-green-500"
                  ></motion.span>
                </span>
              </span>
              <span className="md:hidden text-center block">
                Same skills, different format, <span className="relative">who would you hire?
                  <motion.span 
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
                    className="absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-emerald-400 via-emerald-500 to-green-500"
                  ></motion.span>
                </span>
              </span>
            </motion.p>
          </div>
        </motion.div>

        {/* Floating Category Buttons with Unique Gradients */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.keys(categoryData).map((category) => {
              const isSelected = selectedCategory === category
              
              return (
                <Button
                  key={category}
                  onClick={() => setSelectedCategory(category as JobCategory)}
                  style={{
                    background: isSelected ? getGradientStyle(category, 0.8) : undefined
                  }}
                  className={cn(
                    "px-4 py-2 text-sm font-medium transition-all duration-300 border-0 backdrop-blur-md shadow-lg hover:shadow-xl hover:scale-105 rounded-full relative overflow-hidden",
                    isSelected 
                      ? "text-white shadow-xl scale-105 ring-2 ring-white/50"
                      : "bg-white/80 text-gray-700 backdrop-blur-sm"
                  )}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      const button = e.currentTarget;
                      button.style.background = getGradientStyle(category, 0.15);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      const button = e.currentTarget;
                      button.style.background = "";
                    }
                  }}
                >
                  {category}
                </Button>
              )
            })}
          </div>
        </motion.div>

        {/* Before/After Comparison with Glass Effect */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-6xl mx-auto relative"
        >
          <div 
            className="p-[1px] rounded-3xl relative"
            style={{
              background: getGradientStyle(selectedCategory, 0.8)
            }}
          >
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-4 shadow-lg relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedCategory}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <BeforeAfterSlider data={categoryData[selectedCategory]} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Call to Action - Mobile Only */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12 md:hidden"
        >
          <Button
            size="lg"
            onClick={onOpenModal}
            className="bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 hover:from-emerald-600 hover:via-sky-500 hover:to-blue-700 text-white border-0 text-lg px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-xl"
          >
            Transform Your Resume Now
          </Button>
        </motion.div>
      </div>
    </section>
  )
} 