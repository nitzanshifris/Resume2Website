"use client"

import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './button'
import { cn } from '@/lib/utils'

interface ImageCarouselProps {
  images: string[]
  className?: string
}

export function ImageCarousel({ images, className }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    )
  }

  const goToNext = () => {
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
                "absolute w-full h-full object-cover transition-opacity duration-500",
                index === currentIndex ? "opacity-100" : "opacity-0"
              )}
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
    </div>
  )
}