"use client"

import React from 'react'
import { cn } from '@/lib/utils'
import type { ImageTransform } from './image-transform-editor'

interface TransformedImageProps {
  src: string
  transform?: ImageTransform
  alt?: string
  className?: string
}

export function TransformedImage({ 
  src, 
  transform = { crop: { x: 0, y: 0 }, zoom: 1, rotation: 0 },
  alt = "Image",
  className 
}: TransformedImageProps) {
  // Ensure we have a valid src
  if (!src) {
    return null
  }
  
  // For reset: if zoom is 1 and crop is 0,0 and no rotation, just show the original image
  const isReset = transform.zoom === 1 && transform.crop.x === 0 && transform.crop.y === 0 && transform.rotation === 0
  
  if (isReset) {
    return (
      <div className={cn("relative w-full h-full overflow-hidden", className)}>
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    )
  }
  
  return (
    <div className={cn("relative w-full h-full overflow-hidden", className)}>
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          transform: `scale(${transform.zoom}) rotate(${transform.rotation}deg)`,
          transformOrigin: `${50 - transform.crop.x}% ${50 - transform.crop.y}%`
        }}
      />
    </div>
  )
}