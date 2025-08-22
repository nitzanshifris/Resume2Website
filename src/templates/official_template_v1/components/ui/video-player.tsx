"use client"

import React from 'react'
import { cn } from '@/lib/utils'

interface VideoPlayerProps {
  url: string
  className?: string
}

export function VideoPlayer({ url, className }: VideoPlayerProps) {
  // Debug logging for uploaded videos
  console.log('VideoPlayer received URL:', url, 'Type:', typeof url, 'Length:', url?.length)
  
  // Check if it's a YouTube URL (including Shorts)
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&\n?#]+)/)
  const youtubeId = youtubeMatch ? youtubeMatch[1] : null

  // Check if it's a Vimeo URL
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  const vimeoId = vimeoMatch ? vimeoMatch[1] : null

  // Check if it's a TikTok URL
  const tiktokMatch = url.match(/tiktok\.com\/@[\w.-]+\/video\/(\d+)/)
  const tiktokId = tiktokMatch ? tiktokMatch[1] : null

  // Check if it's an Instagram Reel
  const instagramReelMatch = url.match(/instagram\.com\/reel\/([A-Za-z0-9_-]+)/)
  const instagramReelId = instagramReelMatch ? instagramReelMatch[1] : null
  
  console.log('VideoPlayer detected IDs:', { youtubeId, vimeoId, tiktokId, instagramReelId })

  if (youtubeId) {
    // For YouTube Shorts, we need to handle them differently
    const isShorts = url.includes('/shorts/')
    
    // Add parameters to clean up the YouTube embed:
    // - modestbranding=1: Removes YouTube logo (deprecated but keep it)
    // - rel=0: Don't show related videos from other channels
    // - controls=1: Show player controls
    // - fs=1: Allow fullscreen
    // - iv_load_policy=3: Hide annotations
    // - autoplay=0: Don't autoplay
    // - loop=1: Loop the video (good for shorts)
    // - playlist={youtubeId}: Needed for loop to work
    const params = new URLSearchParams({
      modestbranding: '1',
      rel: '0',
      controls: '1',
      fs: '1',
      iv_load_policy: '3',
      autoplay: '0',
      ...(isShorts && { loop: '1', playlist: youtubeId })
    })
    
    const embedUrl = `https://www.youtube.com/embed/${youtubeId}?${params.toString()}`
    
    // For Shorts, we'll crop the iframe to hide UI elements
    if (isShorts) {
      return (
        <div className={cn("relative w-full h-full overflow-hidden bg-black", className)}>
          {/* Wrapper to hide YouTube UI by cropping */}
          <div 
            className="absolute w-full"
            style={{
              top: '-10%',  // Hide top UI
              height: '120%',  // Extend height to compensate
              left: 0,
            }}
          >
            <iframe
              src={embedUrl}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ border: 'none' }}
            />
          </div>
        </div>
      )
    }
    
    // Regular YouTube videos
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

  // TikTok embed - They do allow embedding via iframe
  if (tiktokId) {
    // TikTok allows iframe embedding with their embed URL
    // The embed needs the full TikTok URL, not just the ID
    return (
      <div className={cn("relative w-full h-full bg-black", className)}>
        <iframe
          src={`https://www.tiktok.com/embed/${tiktokId}`}
          className="absolute inset-0 w-full h-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          style={{ border: 'none' }}
        />
      </div>
    )
  }

  // Instagram Reel (Instagram has strict embedding policies)
  if (instagramReelId) {
    // Instagram doesn't allow direct iframe embedding for Reels
    return (
      <div className={cn("relative w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center", className)}>
        <div className="text-center text-white space-y-4 p-8">
          <div className="text-lg font-medium">Instagram Reel</div>
          <div className="text-sm opacity-90">
            Instagram Reels cannot be embedded directly. Please open in Instagram.
          </div>
          <a 
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
          >
            Open in Instagram →
          </a>
        </div>
      </div>
    )
  }

  // Direct video URL (includes blob URLs from uploaded files)
  console.log('Using direct video element for URL:', url)
  
  // Check if it's a blob URL and if it's valid
  if (url.startsWith('blob:')) {
    console.log('Detected blob URL, checking validity...')
  }
  
  // Don't render video element if URL is empty or invalid
  if (!url || url.trim() === '') {
    console.log('VideoPlayer: Empty or invalid URL provided:', url)
    return (
      <div className={cn("relative w-full h-full bg-muted flex items-center justify-center", className)}>
        <div className="text-center text-muted-foreground">
          <div className="text-sm">No video URL provided</div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("relative w-full h-full", className)}>
      <video
        controls
        className="w-full h-full object-cover"
        src={url}
        onLoadStart={() => console.log('Video load started for:', url)}
        onLoadedData={() => console.log('Video loaded successfully')}
        onError={(e) => {
          console.error('Video loading error:', {
            error: e.currentTarget.error,
            networkState: e.currentTarget.networkState,
            readyState: e.currentTarget.readyState,
            src: e.currentTarget.src,
            currentSrc: e.currentTarget.currentSrc
          })
        }}
        onCanPlay={() => console.log('Video can start playing')}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  )
}