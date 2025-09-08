"use client"

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { Settings, FileText, Image, Code, Github, Link, Video, Trash2, Maximize2, ExternalLink, X, Loader2 } from 'lucide-react'
import { useEditMode } from '@/contexts/edit-mode-context'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Safari } from "@/components/magicui/safari"
import { EditableText } from '@/components/ui/editable-text'
import { CodeBlock } from '@/components/ui/code-block/code-block'

export type ViewMode = 'text' | 'images' | 'code' | 'github' | 'uri' | 'video'

interface SmartCardProps {
  item: any
  children?: React.ReactNode
  className?: string
  onUpdate?: (field: string, value: any) => void
  onDelete?: () => void
  fullRender?: boolean
}

const viewModeOptions = [
  { value: 'text', label: 'Text View', icon: FileText },
  { value: 'images', label: 'Image View', icon: Image },
  { value: 'code', label: 'Code Block', icon: Code },
  { value: 'github', label: 'GitHub Card', icon: Github },
  { value: 'uri', label: 'Link Preview', icon: Link },
  { value: 'video', label: 'Video Player', icon: Video },
]

// Video Preview Component for SmartCard
const SmartCardVideoPreview = ({ url }: { url: string }) => {
  const [hasError, setHasError] = useState(false)
  
  // Convert YouTube/Vimeo URLs to embeddable format
  const getEmbedUrl = (originalUrl: string) => {
    try {
      const urlObj = new URL(originalUrl)
      
      // YouTube URL conversion
      if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
        let videoId = ''
        if (urlObj.hostname.includes('youtu.be')) {
          videoId = urlObj.pathname.slice(1).split('?')[0]
        } else if (urlObj.searchParams.has('v')) {
          videoId = urlObj.searchParams.get('v') || ''
        } else if (urlObj.pathname.includes('/embed/')) {
          videoId = urlObj.pathname.split('/embed/')[1].split('?')[0]
        }
        if (videoId) {
          videoId = videoId.split('&')[0]
          return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`
        }
      }
      
      // Vimeo URL conversion
      if (urlObj.hostname.includes('vimeo.com')) {
        const videoId = urlObj.pathname.split('/').pop()
        if (videoId && /^\d+$/.test(videoId)) {
          return `https://player.vimeo.com/video/${videoId}`
        }
      }
      
      return originalUrl
    } catch {
      return originalUrl
    }
  }

  const embedUrl = getEmbedUrl(url)
  const hostname = (() => {
    try {
      return new URL(url).hostname
    } catch {
      return 'Video Player'
    }
  })()

  // Check if this is a local video file (data URL or blob URL)
  const isLocalVideo = url.startsWith('data:video') || url.startsWith('blob:')
  
  // Check if it's a direct video file
  const isDirectVideo = url.match(/\.(mp4|webm|ogg|mov|avi)(\?.*)?$/i)
  
  // If it's a local video, render a native video element with border
  if (isLocalVideo) {
    return (
      <div className="aspect-video rounded-lg overflow-hidden border border-neutral-800 dark:border-neutral-800 light:border-gray-300 shadow-[0px_0px_8px_0px_rgba(192,132,252,0.08)] dark:shadow-[0px_0px_8px_0px_rgba(192,132,252,0.08)] light:shadow-[0px_0px_8px_0px_rgba(0,0,0,0.08)]">
        <video
          src={url}
          className="w-full h-full object-contain bg-background"
          controls
          controlsList="nodownload"
          onError={() => setHasError(true)}
        />
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-background">
            <div className="text-center p-4">
              <X className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-foreground text-sm mb-1">Video unavailable</p>
              <p className="text-neutral-400 dark:text-neutral-400 light:text-gray-600 text-xs">Cannot play this video</p>
            </div>
          </div>
        )}
      </div>
    )
  }

  if (isDirectVideo) {
    // Use Safari's videoSrc prop for direct video files with border
    return (
      <div className="aspect-video rounded-lg overflow-hidden border border-neutral-800 dark:border-neutral-800 light:border-gray-300 shadow-[0px_0px_8px_0px_rgba(192,132,252,0.08)] dark:shadow-[0px_0px_8px_0px_rgba(192,132,252,0.08)] light:shadow-[0px_0px_8px_0px_rgba(0,0,0,0.08)]">
        <Safari 
          url={hostname}
          videoSrc={url}
          className="w-full h-full"
          mode="default"
        />
      </div>
    )
  }

  return (
    <div className="aspect-video rounded-lg overflow-hidden border border-neutral-800 shadow-[0px_0px_8px_0px_rgba(192,132,252,0.08)]">
      <div className="relative w-full h-full">
        <Safari 
          url={hostname} 
          className="w-full h-full"
          mode="default"
        />
        <div 
          className="absolute"
          style={{ 
            top: '7%',
            left: '0.1%',
            right: '0.1%',
            bottom: '0.1%',
            overflow: 'hidden',
            borderBottomLeftRadius: '12px',
            borderBottomRightRadius: '12px',
            backgroundColor: '#000'
          }}
        >
          <iframe
            src={embedUrl}
            className="w-full h-full"
            style={{ 
              border: 'none',
              backgroundColor: '#000'
            }}
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            onError={() => setHasError(true)}
          />
          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-background">
              <div className="text-center p-4">
                <X className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <p className="text-foreground text-sm mb-1">Video unavailable</p>
                <p className="text-neutral-400 dark:text-neutral-400 light:text-gray-600 text-xs">Cannot embed this video</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function SmartCard({ item, children, className, onUpdate, onDelete, fullRender = false }: SmartCardProps) {
  const { isEditMode } = useEditMode()
  const [viewMode, setViewMode] = useState<ViewMode>(item.viewMode || 'text')
  
  // Local state for editing
  const [codeContent, setCodeContent] = useState(item.codeSnippet || '')
  const [codeLanguage, setCodeLanguage] = useState(item.codeLanguage || 'typescript')
  const [githubUrl, setGithubUrl] = useState(item.githubUrl || '')
  const [images, setImages] = useState<string[]>(item.images || [])
  const [videoUrl, setVideoUrl] = useState(item.videoUrl || '')
  const [linkUrl, setLinkUrl] = useState(item.linkUrl || '')
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false)
  
  // Color state management
  const [titleColor, setTitleColor] = useState(item.titleColor || '#ffffff')
  const [descriptionColor, setDescriptionColor] = useState(item.descriptionColor || '#d4d4d4')
  const [timeframeColor, setTimeframeColor] = useState(item.timeframeColor || '#a3a3a3')

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode)
    onUpdate?.('viewMode', mode)
  }

  const getViewModeLink = () => {
    switch (viewMode) {
      case 'github':
        return githubUrl
      case 'uri':
        return linkUrl
      case 'video':
        return videoUrl
      case 'images':
        return item.link || (images[0] && !images[0].startsWith('data:') ? images[0] : '')
      default:
        return item.link || ''
    }
  }

  // Link Preview Component for SmartCard
  const SmartCardLinkPreview = ({ url }: { url: string }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)
    
    const hostname = (() => {
      try {
        return new URL(url).hostname
      } catch {
        return 'Website Preview'
      }
    })()

    // Check if URL can be embedded (most sites block iframe embedding)
    const isEmbeddable = (url: string) => {
      try {
        const urlObj = new URL(url)
        // Known embeddable sites (this is a very short list)
        const embeddableDomains = [
          'wikipedia.org',
          'github.com',
          'codepen.io',
          'codesandbox.io',
          'stackblitz.com'
        ]
        return embeddableDomains.some(domain => urlObj.hostname.includes(domain))
      } catch {
        return false
      }
    }

    const canEmbed = isEmbeddable(url)

    // For most sites, use a screenshot service
    // Option 1: Microlink API (free tier available)
    const screenshotUrl = `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`
    
    // Option 2: Alternative screenshot service
    // const screenshotUrl = `https://image.thum.io/get/width/1200/crop/675/${url}`
    
    return (
      <div className="aspect-video rounded-lg overflow-hidden relative group">
        <Safari 
          url={hostname}
          className="w-full h-full"
          mode="default"
        />
        <div 
          className="absolute"
          style={{ 
            top: '7%',
            left: '0.1%',
            right: '0.1%',
            bottom: '0.1%',
            overflow: 'hidden',
            borderBottomLeftRadius: '12px',
            borderBottomRightRadius: '12px',
            backgroundColor: '#000'
          }}
        >
          {!canEmbed ? (
            <>
              {/* Use screenshot API for live preview */}
              <img 
                src={screenshotUrl}
                alt={`Preview of ${hostname}`}
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  // Fallback if screenshot fails
                  e.currentTarget.style.display = 'none'
                }}
              />
              {/* Fallback content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-100 dark:to-neutral-200 light:from-gray-100 light:to-gray-200 text-neutral-800 dark:text-neutral-800 light:text-gray-800">
                <ExternalLink className="w-12 h-12 mb-3 text-neutral-600" />
                <p className="font-semibold text-lg mb-1">{hostname}</p>
                <p className="text-sm text-neutral-600 dark:text-neutral-600 light:text-gray-600 px-4 text-center">Live preview</p>
              </div>
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <a 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-primary-foreground rounded-md hover:bg-accent/80 transition-colors text-sm font-medium"
                >
                  Visit Website
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </>
          ) : (
            <>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
                  <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
                </div>
              )}
              <iframe
                src={url}
                className="w-full h-full"
                style={{ 
                  border: 'none',
                  backgroundColor: '#fff'
                }}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setHasError(true)
                  setIsLoading(false)
                }}
                sandbox="allow-scripts allow-same-origin"
              />
              {hasError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-100">
                  <X className="w-8 h-8 text-red-500 mb-2" />
                  <p className="text-neutral-800 dark:text-neutral-800 light:text-gray-800 text-sm mb-1">Preview unavailable</p>
                  <a 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="mt-2 text-accent hover:underline text-sm"
                  >
                    Open in new tab
                  </a>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    )
  }

  const renderNonTextContent = () => {
    switch (viewMode) {
      case 'code':
        return codeContent ? (
          <CodeBlock
            language={codeLanguage || 'typescript'}
            filename={item.title || 'Code'}
            code={codeContent}
          />
        ) : (
          <div className="flex items-center justify-center p-8 text-neutral-500">
            <Code className="w-8 h-8 mr-2" />
            <span>Add code in settings</span>
          </div>
        )
      
      case 'images':
        return images.length > 0 && images[0] ? (
          <img 
            src={images[0]} 
            alt={item.title || item.label || 'Image'} 
            className="w-full h-48 object-cover rounded-lg"
          />
        ) : (
          <div className="flex items-center justify-center p-8 text-neutral-500">
            <Image className="w-8 h-8 mr-2" />
            <span>Add image in settings</span>
          </div>
        )
      
      case 'github':
        return githubUrl ? (
          <div className="p-4">
            <div className="flex items-center gap-2 text-neutral-300">
              <Github className="w-5 h-5" />
              <span className="text-sm truncate">{githubUrl}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center p-8 text-neutral-500">
            <Github className="w-8 h-8 mr-2" />
            <span>Add GitHub URL in settings</span>
          </div>
        )
      
      case 'video':
        return videoUrl ? (
          <SmartCardVideoPreview url={videoUrl} />
        ) : (
          <div className="flex items-center justify-center p-8 text-neutral-500">
            <Video className="w-8 h-8 mr-2" />
            <span>Add video URL in settings</span>
          </div>
        )
      
      case 'uri':
        return linkUrl ? (
          <SmartCardLinkPreview url={linkUrl} />
        ) : (
          <div className="flex items-center justify-center p-8 text-neutral-500">
            <Link className="w-8 h-8 mr-2" />
            <span>Add link URL in settings</span>
          </div>
        )
      
      default:
        return null
    }
  }

  const renderContent = () => {
    switch (viewMode) {
      case 'code':
        return codeContent ? (
          <CodeBlock
            language={codeLanguage || 'typescript'}
            filename={item.title || 'Code'}
            code={codeContent}
          />
        ) : (
          <div className="flex items-center justify-center p-8 text-neutral-500">
            <Code className="w-8 h-8 mr-2" />
            <span>Add code in settings</span>
          </div>
        )
      
      case 'images':
        return images.length > 0 && images[0] ? (
          <img 
            src={images[0]} 
            alt={item.title} 
            className="w-full h-48 object-cover rounded-lg"
          />
        ) : (
          <div className="flex items-center justify-center p-8 text-neutral-500">
            <Image className="w-8 h-8 mr-2" />
            <span>Add image in settings</span>
          </div>
        )
      
      case 'github':
        return githubUrl ? (
          <div className="p-4">
            <div className="flex items-center gap-2 text-neutral-300">
              <Github className="w-5 h-5" />
              <span className="text-sm truncate">{githubUrl}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center p-8 text-neutral-500">
            <Github className="w-8 h-8 mr-2" />
            <span>Add GitHub URL in settings</span>
          </div>
        )
      
      case 'video':
        // For projects/accomplishments that use custom full-card layout
        if (item.description || item.label) {
          return videoUrl ? (
            <div className="h-full flex flex-col p-6">
              {/* Title and Description - handle different data structures */}
              <div className="flex-shrink-0 mb-4">
                {/* For projects */}
                {item.title && item.description && (
                  <>
                    <EditableText
                      as="h3"
                      initialValue={item.title}
                      onSave={(value) => onUpdate?.('title', value)}
                      initialColor={titleColor}
                      onColorChange={(color) => {
                        setTitleColor(color)
                        onUpdate?.('titleColor', color)
                      }}
                      enableColorEdit={true}
                      className="font-bold text-lg mb-2"
                    />
                    <EditableText
                      as="p"
                      initialValue={item.description}
                      onSave={(value) => onUpdate?.('description', value)}
                      initialColor={descriptionColor}
                      onColorChange={(color) => {
                        setDescriptionColor(color)
                        onUpdate?.('descriptionColor', color)
                      }}
                      enableColorEdit={true}
                      className="text-sm"
                      textarea
                    />
                  </>
                )}
                {/* For accomplishments */}
                {item.label && (
                  <>
                    <EditableText
                      as="h3"
                      initialValue={`${item.label} ${item.value}`}
                      onSave={(value) => {
                        // Split the value back into label and value
                        const parts = value.split(' ')
                        const lastWord = parts.pop()
                        const label = parts.join(' ')
                        onUpdate?.('label', label)
                        onUpdate?.('value', lastWord)
                      }}
                      initialColor={titleColor}
                      onColorChange={(color) => {
                        setTitleColor(color)
                        onUpdate?.('titleColor', color)
                      }}
                      enableColorEdit={true}
                      className="font-bold text-lg mb-2"
                    />
                    {item.contextOrDetail && (
                      <EditableText
                        as="p"
                        initialValue={item.contextOrDetail}
                        onSave={(value) => onUpdate?.('contextOrDetail', value)}
                        initialColor={descriptionColor}
                        onColorChange={(color) => {
                          setDescriptionColor(color)
                          onUpdate?.('descriptionColor', color)
                        }}
                        enableColorEdit={true}
                        className="text-sm"
                        textarea
                      />
                    )}
                    {item.timeframe && (
                      <EditableText
                        as="p"
                        initialValue={`(${item.timeframe})`}
                        onSave={(value) => onUpdate?.('timeframe', value.replace(/[()]/g, ''))}
                        initialColor={timeframeColor}
                        onColorChange={(color) => {
                          setTimeframeColor(color)
                          onUpdate?.('timeframeColor', color)
                        }}
                        enableColorEdit={true}
                        className="text-xs mt-1"
                      />
                    )}
                  </>
                )}
              </div>
              {/* Video Content */}
              <div className="flex-1">
                <SmartCardVideoPreview url={videoUrl} />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center p-8 text-neutral-500">
              <Video className="w-8 h-8 mr-2" />
              <span>Add video URL in settings</span>
            </div>
          )
        }
        // For other sections (publications, etc.), use children + media below
        return children
      
      case 'uri':
        return linkUrl ? (
          <div className="relative group">
            {/* Simplified preview for cards */}
            <div className="relative h-48 bg-gradient-to-br from-neutral-900 to-black rounded-lg overflow-hidden border border-neutral-800">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-6">
                  <Link className="w-12 h-12 text-accent mx-auto mb-3" />
                  <p className="text-foreground font-medium text-sm mb-1">
                    {(() => {
                      try {
                        return new URL(linkUrl).hostname
                      } catch {
                        return 'External Link'
                      }
                    })()}
                  </p>
                  <p className="text-neutral-400 text-xs truncate max-w-full px-4">{linkUrl}</p>
                </div>
              </div>
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <a 
                  href={linkUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-primary-foreground rounded-md hover:bg-accent/80 transition-colors text-sm font-medium"
                >
                  Visit Site
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center p-8 text-neutral-500">
            <Link className="w-8 h-8 mr-2" />
            <span>Add link URL in settings</span>
          </div>
        )
      
      case 'text':
      default:
        return children
    }
  }

  // For projects section - full render mode replaces entire card
  if (fullRender && viewMode !== 'text') {
    return (
      <div className={cn("group relative h-full", className)}>
        {/* Action Buttons - visible on hover */}
        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
          {/* Settings Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="secondary" className="h-8 w-8 shadow-md">
                <Settings className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-background border border-border text-foreground overflow-y-auto w-[400px] sm:w-[540px]">
              <SheetHeader>
                <SheetTitle className="text-foreground text-2xl font-bold">Display Settings</SheetTitle>
                <p className="text-neutral-400 dark:text-neutral-400 light:text-gray-600 text-sm mt-1">Customize how this item appears</p>
              </SheetHeader>
              
              <div className="mt-6 space-y-6">
                {/* View Mode Selector */}
                <div className="space-y-2">
                  <Label>Display Mode</Label>
                  <Select value={viewMode} onValueChange={handleViewModeChange}>
                    <SelectTrigger className="bg-background border-neutral-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-neutral-700">
                      {viewModeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <option.icon className="h-4 w-4" />
                            <span>{option.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Dynamic content editors based on view mode */}
                {viewMode === 'code' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Programming Language</Label>
                      <Select value={codeLanguage} onValueChange={(v) => {
                        setCodeLanguage(v)
                        onUpdate?.('codeLanguage', v)
                      }}>
                        <SelectTrigger className="bg-background border-neutral-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-background border-neutral-700">
                          <SelectItem value="typescript">TypeScript</SelectItem>
                          <SelectItem value="javascript">JavaScript</SelectItem>
                          <SelectItem value="python">Python</SelectItem>
                          <SelectItem value="html">HTML</SelectItem>
                          <SelectItem value="css">CSS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Code</Label>
                      <Textarea
                        value={codeContent}
                        onChange={(e) => {
                          setCodeContent(e.target.value)
                          onUpdate?.('codeSnippet', e.target.value)
                        }}
                        placeholder="Paste your code here..."
                        className="font-mono min-h-[200px] bg-background border-neutral-700"
                      />
                    </div>
                  </div>
                )}

                {viewMode === 'images' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-base font-medium">Upload Image</Label>
                      <div className="relative">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              const reader = new FileReader()
                              reader.onloadend = () => {
                                const newImages = [reader.result as string]
                                setImages(newImages)
                                onUpdate?.('images', newImages)
                              }
                              reader.readAsDataURL(file)
                            }
                          }}
                          className="bg-input border border-border text-sm h-auto py-3 px-3 file:mr-3 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-accent file:text-primary-foreground hover:file:bg-accent/80 file:cursor-pointer cursor-pointer"
                        />
                      </div>
                    </div>
                    <div className="text-center text-neutral-500 text-sm font-medium">- OR -</div>
                    <div className="space-y-2">
                      <Label className="text-base font-medium">Image URL</Label>
                      <Input
                        value={images[0] || ''}
                        onChange={(e) => {
                          const newImages = [e.target.value]
                          setImages(newImages)
                          onUpdate?.('images', newImages)
                        }}
                        placeholder="https://example.com/image.jpg"
                        className="bg-background border-neutral-700 text-sm h-10"
                      />
                    </div>
                  </div>
                )}

                {viewMode === 'github' && (
                  <div className="space-y-2">
                    <Label>GitHub Repository URL</Label>
                    <Input
                      value={githubUrl}
                      onChange={(e) => {
                        setGithubUrl(e.target.value)
                        onUpdate?.('githubUrl', e.target.value)
                      }}
                      placeholder="https://github.com/user/repo"
                      className="bg-background border-neutral-700"
                    />
                  </div>
                )}

                {viewMode === 'video' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Video URL</Label>
                      <Input
                        value={videoUrl}
                        onChange={(e) => {
                          setVideoUrl(e.target.value)
                          onUpdate?.('videoUrl', e.target.value)
                        }}
                        placeholder="YouTube, Vimeo, or direct video URL"
                        className="bg-background border-neutral-700"
                      />
                      <p className="text-xs text-neutral-500">
                        Supports YouTube, Vimeo, and direct video links
                      </p>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-neutral-700" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-neutral-500">or</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Upload Video</Label>
                      <div className="relative">
                        <Input
                          type="file"
                          accept="video/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              const reader = new FileReader()
                              reader.onloadend = () => {
                                const videoDataUrl = reader.result as string
                                setVideoUrl(videoDataUrl)
                                onUpdate?.('videoUrl', videoDataUrl)
                              }
                              reader.readAsDataURL(file)
                            }
                          }}
                          className="bg-input border border-border text-sm h-auto py-3 px-3 file:mr-3 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-accent file:text-primary-foreground hover:file:bg-accent/80 file:cursor-pointer cursor-pointer"
                        />
                      </div>
                      <p className="text-xs text-neutral-500">
                        Upload video from your computer (MP4, WebM, etc.)
                      </p>
                    </div>
                  </div>
                )}

                {viewMode === 'uri' && (
                  <div className="space-y-2">
                    <Label>Link URL</Label>
                    <Input
                      value={linkUrl}
                      onChange={(e) => {
                        setLinkUrl(e.target.value)
                        onUpdate?.('linkUrl', e.target.value)
                      }}
                      placeholder="https://example.com"
                      className="bg-background border-neutral-700"
                    />
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
          
          {/* Delete Button - only visible in edit mode */}
          {isEditMode && onDelete && (
            <Button 
              size="icon" 
              variant="destructive" 
              className="h-8 w-8 shadow-md"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Full render content - replaces entire card */}
        <div className="h-full">
          {renderContent()}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("group relative h-full", className)}>
      {/* Action Buttons - visible on hover */}
      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
        {/* Open in New Tab Button - show for all non-text modes */}
        {viewMode !== 'text' && (
          <Button 
            size="icon" 
            variant="secondary" 
            className="h-8 w-8 shadow-md"
            onClick={() => {
              const link = getViewModeLink()
              if (link) {
                window.open(link, '_blank')
              }
            }}
            disabled={!getViewModeLink()}
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        )}
        
        {/* Full View Button - only for non-text view modes */}
        {viewMode !== 'text' && (
          <Dialog open={isFullscreenOpen} onOpenChange={setIsFullscreenOpen}>
            <DialogTrigger asChild>
              <Button size="icon" variant="secondary" className="h-8 w-8 shadow-md">
                <Maximize2 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogPrimitive.Portal>
              <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
              <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 w-full h-full max-w-none translate-x-[-50%] translate-y-[-50%] p-0 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
                <DialogTitle className="sr-only">Full View</DialogTitle>
                
                {/* Close button */}
                <DialogPrimitive.Close className="absolute right-6 top-6 z-50 rounded-full bg-background/90 p-2 backdrop-blur-sm opacity-70 ring-offset-background transition-all hover:opacity-100 hover:bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                  <X className="h-6 w-6" />
                  <span className="sr-only">Close</span>
                </DialogPrimitive.Close>
                
                {/* Content */}
                <div className="w-full h-full flex items-center justify-center p-16">
                  <div className="w-full h-full">
                    {renderContent()}
                  </div>
                </div>
              </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
          </Dialog>
        )}
        
        {/* Settings Button */}
        <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="secondary" className="h-8 w-8 shadow-md">
                <Settings className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-background border border-border text-foreground overflow-y-auto w-[400px] sm:w-[540px]">
              <SheetHeader>
                <SheetTitle className="text-foreground text-2xl font-bold">Display Settings</SheetTitle>
                <p className="text-neutral-400 dark:text-neutral-400 light:text-gray-600 text-sm mt-1">Customize how this item appears</p>
              </SheetHeader>
              
              <div className="mt-6 space-y-6">
                {/* View Mode Selector */}
                <div className="space-y-2">
                  <Label>Display Mode</Label>
                  <Select value={viewMode} onValueChange={handleViewModeChange}>
                    <SelectTrigger className="bg-background border-neutral-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-neutral-700">
                      {viewModeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <option.icon className="h-4 w-4" />
                            <span>{option.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Dynamic content editors based on view mode */}
                {viewMode === 'code' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Programming Language</Label>
                      <Select value={codeLanguage} onValueChange={(v) => {
                        setCodeLanguage(v)
                        onUpdate?.('codeLanguage', v)
                      }}>
                        <SelectTrigger className="bg-background border-neutral-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-background border-neutral-700">
                          <SelectItem value="typescript">TypeScript</SelectItem>
                          <SelectItem value="javascript">JavaScript</SelectItem>
                          <SelectItem value="python">Python</SelectItem>
                          <SelectItem value="html">HTML</SelectItem>
                          <SelectItem value="css">CSS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Code</Label>
                      <Textarea
                        value={codeContent}
                        onChange={(e) => {
                          setCodeContent(e.target.value)
                          onUpdate?.('codeSnippet', e.target.value)
                        }}
                        placeholder="Paste your code here..."
                        className="font-mono min-h-[200px] bg-background border-neutral-700"
                      />
                    </div>
                  </div>
                )}

                {viewMode === 'images' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-base font-medium">Upload Image</Label>
                      <div className="relative">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              const reader = new FileReader()
                              reader.onloadend = () => {
                                const newImages = [reader.result as string]
                                setImages(newImages)
                                onUpdate?.('images', newImages)
                              }
                              reader.readAsDataURL(file)
                            }
                          }}
                          className="bg-input border border-border text-sm h-auto py-3 px-3 file:mr-3 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-accent file:text-primary-foreground hover:file:bg-accent/80 file:cursor-pointer cursor-pointer"
                        />
                      </div>
                    </div>
                    <div className="text-center text-neutral-500 text-sm font-medium">- OR -</div>
                    <div className="space-y-2">
                      <Label className="text-base font-medium">Image URL</Label>
                      <Input
                        value={images[0] || ''}
                        onChange={(e) => {
                          const newImages = [e.target.value]
                          setImages(newImages)
                          onUpdate?.('images', newImages)
                        }}
                        placeholder="https://example.com/image.jpg"
                        className="bg-background border-neutral-700 text-sm h-10"
                      />
                    </div>
                  </div>
                )}

                {viewMode === 'github' && (
                  <div className="space-y-2">
                    <Label>GitHub Repository URL</Label>
                    <Input
                      value={githubUrl}
                      onChange={(e) => {
                        setGithubUrl(e.target.value)
                        onUpdate?.('githubUrl', e.target.value)
                      }}
                      placeholder="https://github.com/user/repo"
                      className="bg-background border-neutral-700"
                    />
                  </div>
                )}

                {viewMode === 'video' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Video URL</Label>
                      <Input
                        value={videoUrl}
                        onChange={(e) => {
                          setVideoUrl(e.target.value)
                          onUpdate?.('videoUrl', e.target.value)
                        }}
                        placeholder="YouTube, Vimeo, or direct video URL"
                        className="bg-background border-neutral-700"
                      />
                      <p className="text-xs text-neutral-500">
                        Supports YouTube, Vimeo, and direct video links
                      </p>
                    </div>
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-neutral-700" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-neutral-500">or</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Upload Video</Label>
                      <div className="relative">
                        <Input
                          type="file"
                          accept="video/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              const reader = new FileReader()
                              reader.onloadend = () => {
                                const videoDataUrl = reader.result as string
                                setVideoUrl(videoDataUrl)
                                onUpdate?.('videoUrl', videoDataUrl)
                              }
                              reader.readAsDataURL(file)
                            }
                          }}
                          className="bg-input border border-border text-sm h-auto py-3 px-3 file:mr-3 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-accent file:text-primary-foreground hover:file:bg-accent/80 file:cursor-pointer cursor-pointer"
                        />
                      </div>
                      <p className="text-xs text-neutral-500">
                        Upload video from your computer (MP4, WebM, etc.)
                      </p>
                    </div>
                  </div>
                )}

                {viewMode === 'uri' && (
                  <div className="space-y-2">
                    <Label>Link URL</Label>
                    <Input
                      value={linkUrl}
                      onChange={(e) => {
                        setLinkUrl(e.target.value)
                        onUpdate?.('linkUrl', e.target.value)
                      }}
                      placeholder="https://example.com"
                      className="bg-background border-neutral-700"
                    />
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        
        {/* Delete Button - only visible in edit mode */}
        {isEditMode && onDelete && (
          <Button 
            size="icon" 
            variant="destructive" 
            className="h-8 w-8 shadow-md"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Content */}
      {children}
      
      {/* Media content appears below children for non-text modes */}
      {viewMode !== 'text' && renderNonTextContent() && (
        <div className="mt-4 px-6 pb-6">
          {renderNonTextContent()}
        </div>
      )}
    </div>
  )
}