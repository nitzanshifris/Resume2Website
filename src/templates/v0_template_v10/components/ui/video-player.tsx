"use client"

import React from 'react'
import { cn } from '@/lib/utils'

interface VideoPlayerProps {
  url: string
  className?: string
}

export function VideoPlayer({ url, className }: VideoPlayerProps) {
  // Check if it's a YouTube URL
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/)
  const youtubeId = youtubeMatch ? youtubeMatch[1] : null

  // Check if it's a Vimeo URL
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  const vimeoId = vimeoMatch ? vimeoMatch[1] : null

  if (youtubeId) {
    const embedUrl = `https://www.youtube.com/embed/${youtubeId}`
    return (
      <div className={cn("relative w-full h-full", className)}>
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  if (vimeoId) {
    const embedUrl = `https://player.vimeo.com/video/${vimeoId}`
    return (
      <div className={cn("relative w-full h-full", className)}>
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  // Direct video URL
  return (
    <div className={cn("relative w-full h-full", className)}>
      <video
        src={url}
        controls
        className="w-full h-full object-cover"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  )
}