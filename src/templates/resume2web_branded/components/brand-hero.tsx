"use client"

import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

interface BrandHeroProps {
  className?: string
}

export function BrandHero({ className }: BrandHeroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={cn(
        "w-full bg-gradient-to-b from-primary/5 to-transparent py-4 px-6 mb-8",
        className
      )}
    >
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Sparkles className="w-8 h-8 text-primary animate-pulse" />
            <div className="absolute inset-0 blur-xl bg-primary/20"></div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-primary">
              This portfolio is powered by CV2WEB
            </h3>
            <p className="text-sm text-muted-foreground">
              Transform your CV into a stunning website in minutes
            </p>
          </div>
        </div>
        
        <Button
          asChild
          variant="default"
          size="sm"
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <a
            href="https://cv2web.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            Create Your Own
            <ArrowRight className="w-4 h-4" />
          </a>
        </Button>
      </div>
    </motion.div>
  )
}