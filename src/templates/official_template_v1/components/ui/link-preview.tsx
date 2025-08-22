"use client"

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { ExternalLink, AlertTriangle } from 'lucide-react'
import { Button } from './button'

interface LinkPreviewProps {
  url: string
  className?: string
}

export function LinkPreview({ url, className }: LinkPreviewProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname
    } catch {
      return url
    }
  }

  const formatUrl = (url: string) => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return 'https://' + url
    }
    return url
  }

  const formattedUrl = formatUrl(url)

  const handleIframeLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  const handleIframeError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  const openInNewTab = () => {
    window.open(formattedUrl, '_blank', 'noopener,noreferrer')
  }

  if (!url) {
    return (
      <div className={cn("w-full h-full min-h-[300px] flex items-center justify-center bg-muted/30 rounded-lg border border-dashed border-border", className)}>
        <div className="text-center text-muted-foreground">
          <ExternalLink className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Enter a URL to preview</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("w-full h-full min-h-[300px] bg-background rounded-lg border border-border overflow-hidden relative", className)}>
      {/* Loading State */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-background">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary mb-2"></div>
            <p className="text-xs text-muted-foreground">Loading preview...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-background">
          <div className="text-center p-4">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-orange-500" />
            <p className="text-xs text-foreground mb-1">Cannot display this website in a frame</p>
            <p className="text-xs text-muted-foreground mb-3">
              Some websites prevent embedding for security reasons
            </p>
            <Button
              size="sm"
              onClick={openInNewTab}
              className="gap-1 h-6 px-2 text-xs"
            >
              <ExternalLink className="w-2.5 h-2.5" />
              Open in New Tab
            </Button>
          </div>
        </div>
      )}

      {/* Iframe */}
      <iframe
        src={formattedUrl}
        className={cn(
          "w-full h-full border-0",
          "transition-opacity duration-300",
          isLoading || hasError ? "opacity-0" : "opacity-100"
        )}
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
        referrerPolicy="no-referrer-when-downgrade"
        title={`Preview of ${getDomain(url)}`}
      />
    </div>
  )
}