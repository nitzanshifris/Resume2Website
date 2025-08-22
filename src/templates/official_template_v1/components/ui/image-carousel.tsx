"use client"

import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, Minus } from 'lucide-react'
import { Button } from './button'
import { cn } from '@/lib/utils'
import { useEditMode } from '@/contexts/edit-mode-context'

interface ImageCarouselProps {
  images: string[]
  className?: string
}

export function ImageCarousel({ images, className }: ImageCarouselProps) {
  const { isEditMode } = useEditMode()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [imageZooms, setImageZooms] = useState<{[key: number]: number}>({})

  // Reset index if it's out of bounds when images change
  React.useEffect(() => {
    if (currentIndex >= images.length && images.length > 0) {
      setCurrentIndex(0)
    }
  }, [images.length, currentIndex])

  const getCurrentZoom = () => imageZooms[currentIndex] || 1

  const handleZoomIn = () => {
    setImageZooms(prev => ({
      ...prev,
      [currentIndex]: Math.min(3, (prev[currentIndex] || 1) + 0.25)
    }))
  }

  const handleZoomOut = () => {
    setImageZooms(prev => ({
      ...prev,
      [currentIndex]: Math.max(0.5, (prev[currentIndex] || 1) - 0.25)
    }))
  }

  const goToPrevious = () => {
    if (images.length === 0) return
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    )
  }

  const goToNext = () => {
    if (images.length === 0) return
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    )
  }

  if (!images || images.length === 0) return null

  return (
    <div className={cn("relative w-full h-full", className)}>
      <div className="relative w-full h-full overflow-hidden rounded-lg">
        {images.map((image, index) => 
          image ? (
            <img
              key={index}
              src={image}
              alt={`Slide ${index + 1}`}
              className={cn(
                "absolute w-full h-full object-contain transition-all duration-500",
                index === currentIndex ? "opacity-100" : "opacity-0"
              )}
              style={{
                transform: index === currentIndex ? `scale(${getCurrentZoom()})` : 'scale(1)',
                transformOrigin: 'center center'
              }}
            />
          ) : null
        )}
      </div>
      
      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white"
            onClick={goToNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  index === currentIndex ? "bg-white" : "bg-white/50"
                )}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </>
      )}

      {/* Zoom Controls */}
      {isEditMode && (
        <div className="absolute top-8 right-2 flex gap-1 z-10">
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 shadow-md z-50 border border-black/20"
            onClick={handleZoomOut}
            title="Zoom out"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 shadow-md z-50 border border-black/20"
            onClick={handleZoomIn}
            title="Zoom in"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}