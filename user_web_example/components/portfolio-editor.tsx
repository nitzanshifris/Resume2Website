"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Save, Edit3, X } from "lucide-react"

interface PortfolioEditorProps {
  portfolioUrl: string | null
  onBackToHome?: () => void
}

export default function PortfolioEditor({ portfolioUrl, onBackToHome }: PortfolioEditorProps) {
  const [isEditMode, setIsEditMode] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // Send message to iframe to save changes
    const iframe = document.getElementById('portfolio-iframe') as HTMLIFrameElement
    if (iframe?.contentWindow) {
      iframe.contentWindow.postMessage({ action: 'save' }, '*')
    }
    
    // Simulate save delay
    setTimeout(() => {
      setIsSaving(false)
      // Show success message or notification
    }, 1000)
  }

  // If no portfolio URL, show error state
  if (!portfolioUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Portfolio Found</h2>
          <p className="text-gray-600 mb-6">Please generate a portfolio first before editing.</p>
          <Button 
            onClick={onBackToHome}
            className="bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 hover:from-emerald-600 hover:via-sky-500 hover:to-blue-700 text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-screen bg-gray-50">
      {/* Floating toolbar */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white rounded-full shadow-2xl px-4 py-2 flex items-center gap-3">
        <Button
          size="sm"
          variant="ghost"
          onClick={onBackToHome}
          className="rounded-full hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <div className="h-6 w-px bg-gray-300" />
        
        <Button
          size="sm"
          variant={isEditMode ? "default" : "ghost"}
          onClick={() => setIsEditMode(!isEditMode)}
          className={isEditMode ? "bg-blue-600 hover:bg-blue-700 text-white rounded-full" : "rounded-full hover:bg-gray-100"}
        >
          <Edit3 className="h-4 w-4 mr-2" />
          {isEditMode ? "Editing" : "Edit"}
        </Button>
        
        <Button
          size="sm"
          onClick={handleSave}
          disabled={!isEditMode || isSaving}
          className="bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 hover:from-emerald-600 hover:via-sky-500 hover:to-blue-700 text-white rounded-full disabled:opacity-50"
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>

      {/* Full screen iframe */}
      <iframe
        id="portfolio-iframe"
        src={isEditMode ? `${portfolioUrl}?edit=true` : portfolioUrl}
        className="w-full h-full border-0"
        title="Portfolio Editor"
        allow="fullscreen"
      />
    </div>
  )
}