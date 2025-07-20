"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'

interface TemplateHeroPreviewProps {
  fullName: string
  professionalTitle: string
}

// This is the EXACT hero section from v0_template_1, just without EditableText
export function TemplateHeroPreview({ fullName, professionalTitle }: TemplateHeroPreviewProps) {
  return (
    <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center rounded-md">
      <h1 className="text-5xl sm:text-7xl md:text-9xl lg:text-[11rem] font-bold text-center text-foreground relative z-20 font-serif text-glow">
        {fullName || "Your Name"}
      </h1>
      <div className="w-[40rem] h-12 relative">
        <div
          className="absolute inset-x-20 top-0 h-[2px] w-3/4 blur-sm"
          style={{ backgroundImage: "linear-gradient(to right, transparent, hsl(var(--accent)), transparent)" }}
        />
        <div
          className="absolute inset-x-20 top-0 h-px w-3/4"
          style={{ backgroundImage: "linear-gradient(to right, transparent, hsl(var(--accent)), transparent)" }}
        />
        <div
          className="absolute inset-x-60 top-0 h-[5px] w-1/4 blur-sm"
          style={{ backgroundImage: "linear-gradient(to right, transparent, hsl(var(--accent)), transparent)" }}
        />
        <div
          className="absolute inset-x-60 top-0 h-px w-1/4"
          style={{ backgroundImage: "linear-gradient(to right, transparent, hsl(var(--accent)), transparent)" }}
        />
        {/* Sparkles effect placeholder - in real template this uses @/components/ui/sparkles */}
        <div className="w-full h-full relative">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-accent/20 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.random() * 3 + 2}s`
              }}
            />
          ))}
        </div>
        <div className="absolute inset-0 w-full h-full bg-background [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
      </div>
      <div className="text-2xl sm:text-5xl md:text-7xl mx-auto font-normal text-foreground flex items-center gap-3 font-serif text-center">
        {professionalTitle || ""}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5, ease: "easeOut" }}
        className="mt-16"
      >
        <button
          className="px-6 py-4 text-lg sm:px-10 sm:py-8 sm:text-2xl font-semibold rounded-full bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-3"
        >
          <ArrowDown className="mr-3 h-6 w-6" />
          Contact Me
        </button>
      </motion.div>
      
      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ 
          opacity: { delay: 1.5, duration: 0.5 },
          y: { repeat: Infinity, duration: 2, ease: "easeInOut" }
        }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-foreground/60"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm">Scroll to explore</span>
          <ArrowDown className="w-5 h-5" />
        </div>
      </motion.div>
    </div>
  )
}

// Add CSS variables for the template theme - exact colors from v0_template_1
const templateStyles = `
  :root {
    --background: 39 56% 95%; /* cream */
    --foreground: 20 14% 4%; /* near-black */
    --accent: 45 86% 62%; /* gold */
    --accent-foreground: 20 14% 4%;
  }
  
  .text-glow {
    text-shadow: 0 0 80px hsla(45, 86%, 62%, 0.5), 0 0 40px hsla(45, 86%, 62%, 0.3);
  }
  
  .bg-background {
    background-color: hsl(var(--background));
  }
  
  .text-foreground {
    color: hsl(var(--foreground));
  }
  
  .bg-accent {
    background-color: hsl(var(--accent));
  }
  
  .text-accent-foreground {
    color: hsl(var(--accent-foreground));
  }
  
  .bg-accent\\/20 {
    background-color: hsla(var(--accent), 0.2);
  }
`

// Inject styles
if (typeof document !== 'undefined') {
  const styleEl = document.createElement('style')
  styleEl.innerHTML = templateStyles
  document.head.appendChild(styleEl)
}