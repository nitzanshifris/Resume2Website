"use client"

import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Settings, FileText, Image, Code, Github, Link, Video, Twitter, Maximize2, ExternalLink, Edit2, Plus, X, MoveHorizontal, GripVertical, Trash2, BarChart3, Type, Layers, PanelLeftOpen, PanelRightOpen } from 'lucide-react'
import { useEditMode } from '@/contexts/edit-mode-context'
import { Safari } from '@/components/ui/safari'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Import view components
import { BentoGridItem } from '@/components/ui/bento-grid-item'
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card'
import { CometCard } from '@/components/ui/comet-card'
import { CodeBlock } from '@/components/ui/code-block'
import { GitHubRepoView } from './ui/github-repo-view'
import { ImageCarousel } from './ui/image-carousel'
import { VideoPlayer } from './ui/video-player'
import { LinkPreview } from './ui/link-preview'
import { ClientTweetCard } from './ui/client-tweet-card'
import { ImageTransformEditor, type ImageTransform } from './ui/image-transform-editor'
import { TransformedImage } from './ui/transformed-image'
import { AnimatedTestimonials } from './ui/animated-testimonials'
import { Sparkles } from './ui/sparkles'
import { Compare } from './ui/compare'
import type { BaseViewItem } from '@/lib/data'
import { contentIconMap } from '@/lib/data'

export type ViewMode = 'text' | 'images' | 'code' | 'github' | 'uri' | 'video' | 'tweet' | 'multi-images' | 'compare'
export type TextVariant = 'detailed' | 'simple'

export interface CodeTab {
  name: string
  code: string
  language: string
  highlightLines?: number[]
}

interface SmartCardProps {
  item: BaseViewItem & any // Allow additional properties from specific item types
  children: React.ReactNode // The default text content
  className?: string
  onUpdate?: (field: string, value: any) => void
  onDelete?: () => void
}

const viewModeOptions = [
  { value: 'text', label: 'Text View', icon: FileText },
  { value: 'images', label: '3D Image Card', icon: Image },
  { value: 'multi-images', label: 'Multi Images', icon: Image },
  { value: 'compare', label: 'Compare View', icon: BarChart3 },
  { value: 'code', label: 'Code Block', icon: Code },
  { value: 'github', label: 'GitHub Card', icon: Github },
  { value: 'uri', label: 'Link Preview', icon: Link },
  { value: 'video', label: 'Video Player', icon: Video },
  { value: 'tweet', label: 'Tweet Card', icon: Twitter },
]

export function SmartCard({ item, children, className, onUpdate, onDelete }: SmartCardProps) {
  const { isEditMode } = useEditMode()
  const [viewMode, setViewMode] = useState<ViewMode>(item.viewMode || 'text')
  
  // Text size states - Updated defaults to match education timeline
  const [titleTextSize, setTitleTextSize] = useState(item.titleTextSize || 'text-lg sm:text-2xl')
  const [descriptionTextSize, setDescriptionTextSize] = useState(item.descriptionTextSize || 'text-sm sm:text-base')
  
  // Font and styling states - Updated defaults to match education timeline
  const [titleFontWeight, setTitleFontWeight] = useState(item.titleFontWeight || 'font-bold')
  const [descriptionFontWeight, setDescriptionFontWeight] = useState(item.descriptionFontWeight || 'font-normal')
  const [titleFontFamily, setTitleFontFamily] = useState(item.titleFontFamily || 'font-serif')
  const [descriptionFontFamily, setDescriptionFontFamily] = useState(item.descriptionFontFamily || 'font-sans')
  const [titleColor, setTitleColor] = useState(item.titleColor || 'text-card-foreground')
  const [descriptionColor, setDescriptionColor] = useState(item.descriptionColor || 'text-muted-foreground')
  const [separateColors, setSeparateColors] = useState(false)
  
  // Local state for editing
  const [codeContent, setCodeContent] = useState(item.codeSnippet || '')
  const [codeLanguage, setCodeLanguage] = useState(item.codeLanguage || 'typescript')
  const [codeTabs, setCodeTabs] = useState<CodeTab[]>(item.codeTabs || [])
  const [githubUrl, setGithubUrl] = useState(item.githubUrl || '')
  const [images, setImages] = useState<string[]>(item.images || [])
  const [imageTransform, setImageTransform] = useState<ImageTransform>(
    item.imageTransform || {
      crop: { x: 0, y: 0 },
      zoom: 1,
      rotation: 0
    }
  )
  
  // Update local state when item prop changes
  React.useEffect(() => {
    setViewMode(item.viewMode || 'text')
    setCodeContent(item.codeSnippet || '')
    setCodeLanguage(item.codeLanguage || 'typescript')
    setCodeTabs(item.codeTabs || [])
    setGithubUrl(item.githubUrl || '')
    setImages(item.images || [])
    setImageTransform(item.imageTransform || { crop: { x: 0, y: 0 }, zoom: 1, rotation: 0 })
    setVideoUrl(item.videoUrl || '')
    setTweetId(item.tweetId || '')
    setLinkUrl(item.linkUrl || '')
    setTweetVariant(item.tweetVariant || 'default')
    setImageVariant(item.imageVariant || 'tilted')
    setMultiImages(item.multiImages || [])
    setCompareItems(item.compareItems || [{ title: 'Before', value: '', color: '#ff6b6b' }, { title: 'After', value: '', color: '#4ecdc4' }])
    setCompareImages({ first: item.compareFirstImage || '', second: item.compareSecondImage || '' })
    setCompareSlideMode(item.compareSlideMode || 'hover')
    setCompareVariant(item.compareVariant || 'standard')
    setTextVariant(item.textVariant || 'detailed')
  }, [item])
  const [videoUrl, setVideoUrl] = useState(item.videoUrl || '')
  const [tweetId, setTweetId] = useState(item.tweetId || '')
  const [linkUrl, setLinkUrl] = useState(item.linkUrl || '')
  const [tweetVariant, setTweetVariant] = useState<'default' | 'shadow' | 'minimal'>(item.tweetVariant || 'default')
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false)
  const [isEditingImage, setIsEditingImage] = useState(false)
  const [sheetSide, setSheetSide] = useState<'right' | 'left'>('right')
  const [sheetWidth, setSheetWidth] = useState(540)
  const [isResizing, setIsResizing] = useState(false)
  const [imageVariant, setImageVariant] = useState<'standard' | 'tilted'>(item.imageVariant || 'tilted')
  const [multiImages, setMultiImages] = useState(item.multiImages || [])
  const [compareItems, setCompareItems] = useState(item.compareItems || [{ title: 'Before', value: '', color: '#ff6b6b' }, { title: 'After', value: '', color: '#4ecdc4' }])
  const [compareImages, setCompareImages] = useState({ first: item.compareFirstImage || '', second: item.compareSecondImage || '' })
  const [compareSlideMode, setCompareSlideMode] = useState<'hover' | 'drag'>(item.compareSlideMode || 'hover')
  const [compareVariant, setCompareVariant] = useState<'standard' | '3d'>(item.compareVariant || 'standard')
  const [textVariant, setTextVariant] = useState<TextVariant>(item.textVariant || 'detailed')

  const extractTweetId = (input: string): string => {
    const tweetUrlMatch = input.match(/twitter\.com\/\w+\/status\/(\d+)/)
    const xUrlMatch = input.match(/x\.com\/\w+\/status\/(\d+)/)
    
    if (tweetUrlMatch) return tweetUrlMatch[1]
    if (xUrlMatch) return xUrlMatch[1]
    if (/^\d+$/.test(input.trim())) return input.trim()
    
    return input
  }

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode)
    onUpdate?.('viewMode', mode)
  }

  const getViewModeLink = () => {
    switch (viewMode) {
      case 'github':
        return githubUrl
      case 'tweet':
        return tweetId ? `https://twitter.com/i/status/${tweetId}` : ''
      case 'uri':
        return linkUrl
      case 'video':
        return videoUrl
      case 'images':
        // For images, check if there's an external link or if it's a URL (not base64)
        return item.link || (images[0] && !images[0].startsWith('data:') ? images[0] : '')
      case 'multi-images':
        return ''
      case 'compare':
        return ''
      default:
        return item.link || ''
    }
  }

  const renderContent = () => {
    // Wrap all content in a consistent container to maintain aspect ratio
    const contentWrapper = (content: React.ReactNode) => (
      <div className="w-full h-full flex flex-col">
        {content}
      </div>
    )

    switch (viewMode) {
      case 'code':
        return contentWrapper(
          codeContent || codeTabs.length > 0 ? (
            <div className="flex-1 overflow-hidden flex flex-col p-6">
              <div className="flex-1 overflow-auto">
                <CodeBlock
                  language={codeLanguage}
                  code={codeContent}
                  filename={item.title || 'code.tsx'}
                  tabs={codeTabs.length > 0 ? codeTabs : undefined}
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center text-muted-foreground">
                <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Click settings to add code</p>
              </div>
            </div>
          )
        )
      
      case 'images':
        return contentWrapper(
          images.length > 0 && images[0] ? (
            <div className="flex-1 p-4 flex items-center justify-center">
              <CometCard rotateDepth={10} translateDepth={15}>
                <div className="bg-cream relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto max-w-4xl h-[600px] rounded-xl p-6 border flex flex-col" style={{ backgroundColor: 'hsl(39, 56%, 95%)' }}>
                  <h2 className="text-2xl font-bold text-neutral-600 dark:text-white mb-6 text-center">
                    {item.title}
                  </h2>
                  <div className="relative flex-1 flex items-center justify-center overflow-hidden">
                    {images[0] ? (
                      <img
                        src={images[0]}
                        alt={item.title || 'Image'}
                        className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                      />
                    ) : (
                      <div className="aspect-video bg-muted rounded-xl flex items-center justify-center">
                        <p className="text-muted-foreground">No image uploaded</p>
                      </div>
                    )}
                  </div>
                </div>
              </CometCard>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center text-muted-foreground">
                <Image className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Click settings to add an image</p>
              </div>
            </div>
          )
        )
      
      case 'github':
        return contentWrapper(
          githubUrl ? (
            <div className="flex-1 overflow-hidden">
              <GitHubRepoView url={githubUrl} className="w-full h-full" />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center text-muted-foreground">
                <Github className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Click settings to add GitHub URL</p>
              </div>
            </div>
          )
        )
      
      case 'video':
        return contentWrapper(
          videoUrl ? (
            <div className="flex-1 p-6">
              <VideoPlayer url={videoUrl} className="w-full h-full" />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center text-muted-foreground">
                <Video className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Click settings to add video URL</p>
              </div>
            </div>
          )
        )
      
      case 'tweet':
        return contentWrapper(
          tweetId ? (
            <div className={tweetVariant === 'default' ? "flex-1 p-6 overflow-y-auto" : "flex-1 p-6"}>
              <div className={tweetVariant === 'default' ? "flex justify-center" : "h-full flex items-center justify-center"}>
                <div className="w-full max-w-lg">
                  <ClientTweetCard 
                    id={tweetId} 
                    className={tweetVariant === 'shadow' ? 'shadow-2xl' : tweetVariant === 'minimal' ? '' : undefined}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center text-muted-foreground">
                <Twitter className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Click settings to add tweet URL</p>
              </div>
            </div>
          )
        )
      
      case 'uri':
        return contentWrapper(
          linkUrl ? (
            <div className="flex-1 p-6">
              <div className="h-full flex items-center justify-center">
                <div className="relative w-full h-full max-w-4xl max-h-[500px]">
                  <Safari 
                    url={(() => {
                      try {
                        return new URL(linkUrl).hostname.replace('www.', '')
                      } catch {
                        return linkUrl
                      }
                    })()}
                    className="w-full h-full"
                  />
                  {/* Iframe to show actual website */}
                  <iframe
                    src={linkUrl}
                    className="absolute inset-0 w-full h-full rounded-b-xl"
                    style={{
                      top: '52px',
                      height: 'calc(100% - 52px)',
                      border: 'none'
                    }}
                    title={item.title}
                    sandbox="allow-same-origin allow-scripts"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center text-muted-foreground">
                <Link className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Click settings to add link URL</p>
              </div>
            </div>
          )
        )
      
      case 'multi-images':
        return contentWrapper(
          multiImages.length > 0 ? (
            <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
              {/* Main featured image - full size */}
              <div className="absolute inset-0">
                {multiImages[0].src && (
                  <img
                    src={multiImages[0].src}
                    alt={multiImages[0].name || 'Featured'}
                    className="w-full h-full object-cover"
                  />
                )}
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              </div>
              
              {/* Content overlay */}
              <div className="relative h-full flex flex-col justify-between p-6">
                {/* Top section - Gallery indicator */}
                <div className="flex justify-between items-start">
                  <div className="bg-white/10 backdrop-blur-md rounded-full px-3 py-1.5 flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {multiImages.slice(0, 3).map((img, index) => (
                        <div
                          key={index}
                          className="w-6 h-6 rounded-full overflow-hidden border-2 border-white/50"
                          style={{ zIndex: 3 - index }}
                        >
                          {img.src ? (
                            <img
                              src={img.src}
                              alt={img.name || `Person ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-400" />
                          )}
                        </div>
                      ))}
                    </div>
                    <span className="text-white text-sm font-medium">
                      {multiImages.length} Stories
                    </span>
                  </div>
                  
                  {/* View indicator */}
                  <div className="bg-black/30 backdrop-blur-sm rounded-lg p-2">
                    <Maximize2 className="w-4 h-4 text-white/80" />
                  </div>
                </div>
                
                {/* Bottom section - Current testimonial info */}
                <div className="space-y-3">
                  {/* Quote preview */}
                  {multiImages[0].quote && (
                    <p className="text-white/90 text-sm line-clamp-2 italic">
                      "{multiImages[0].quote}"
                    </p>
                  )}
                  
                  {/* Person info */}
                  <div className="flex items-center gap-3">
                    {multiImages[0].src && (
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/50">
                        <img
                          src={multiImages[0].src}
                          alt={multiImages[0].name || 'Person'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <p className="text-white font-semibold text-sm">
                        {multiImages[0].name || 'Name'}
                      </p>
                      <p className="text-white/70 text-xs">
                        {multiImages[0].designation || 'Title'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Pagination dots */}
                  <div className="flex gap-1.5 justify-center pt-2">
                    {multiImages.slice(0, 5).map((_, index) => (
                      <div
                        key={index}
                        className={cn(
                          "h-1.5 rounded-full transition-all duration-300",
                          index === 0 
                            ? "w-6 bg-white" 
                            : "w-1.5 bg-white/40"
                        )}
                      />
                    ))}
                    {multiImages.length > 5 && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                    )}
                  </div>
                </div>
              </div>
              
              {/* Hover effect - Click prompt */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/50 transition-colors duration-300 opacity-0 hover:opacity-100">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl px-6 py-4 transform scale-90 hover:scale-100 transition-transform duration-300">
                  <p className="text-white font-medium flex items-center gap-2">
                    <Maximize2 className="w-5 h-5" />
                    View Gallery
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center text-muted-foreground">
                <Image className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Click settings to add images</p>
              </div>
            </div>
          )
        )
      
      case 'compare':
        return contentWrapper(
          compareImages.first && compareImages.second ? (
            compareVariant === '3d' ? (
              <div className="w-full h-full px-1 md:px-8 flex items-center justify-center [perspective:800px] [transform-style:preserve-3d]">
                <div
                  style={{
                    transform: "rotateX(15deg) translateZ(80px)",
                  }}
                  className="p-1 md:p-4 border rounded-3xl dark:bg-neutral-900 bg-neutral-100 border-neutral-200 dark:border-neutral-800 mx-auto w-3/4 h-1/2 md:h-3/4"
                >
                  <Compare
                    firstImage={compareImages.first}
                    secondImage={compareImages.second}
                    firstImageClassName="object-cover object-center w-full"
                    secondImageClassname="object-cover object-center w-full"
                    className="w-full h-full rounded-[22px] md:rounded-lg"
                    slideMode={compareSlideMode}
                    autoplay={true}
                  />
                </div>
              </div>
            ) : (
              <div className="p-4 border rounded-3xl dark:bg-neutral-900 bg-neutral-100 border-neutral-200 dark:border-neutral-800 h-full flex items-center justify-center">
                <Compare
                  firstImage={compareImages.first}
                  secondImage={compareImages.second}
                  firstImageClassName="object-cover object-center"
                  secondImageClassname="object-cover object-center"
                  className="h-full w-full max-h-[300px]"
                  slideMode={compareSlideMode}
                />
              </div>
            )
          ) : (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center text-muted-foreground">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Click settings to add images to compare</p>
              </div>
            </div>
          )
        )
      
      default:
        return children
    }
  }

  // Main component return
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
              <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 w-[90vw] h-[90vh] max-w-5xl max-h-[800px] translate-x-[-50%] translate-y-[-50%] p-0 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 rounded-lg overflow-hidden">
                <DialogTitle className="sr-only">Full View</DialogTitle>
                
                {/* Close button */}
                <DialogPrimitive.Close className="absolute right-6 top-6 z-50 rounded-full bg-background/90 p-2 backdrop-blur-sm opacity-70 ring-offset-background transition-all hover:opacity-100 hover:bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                  <X className="h-6 w-6" />
                  <span className="sr-only">Close</span>
                </DialogPrimitive.Close>
                
                {/* Content */}
                <div className="w-full h-full flex items-center justify-center p-16">
                {viewMode === 'uri' && linkUrl ? (
                  <div className="relative w-full h-full max-w-7xl max-h-[80vh]">
                    <Safari 
                      url={(() => {
                        try {
                          return new URL(linkUrl).hostname.replace('www.', '')
                        } catch {
                          return linkUrl
                        }
                      })()}
                      className="w-full h-full"
                    />
                    {/* Iframe to show actual website */}
                    <iframe
                      src={linkUrl}
                      className="absolute inset-0 w-full h-full rounded-b-xl"
                      style={{
                        top: '52px',
                        height: 'calc(100% - 52px)',
                        border: 'none'
                      }}
                      title={item.title}
                      sandbox="allow-same-origin allow-scripts"
                    />
                  </div>
                ) : viewMode === 'images' ? (
                  images.length > 0 && images[0] ? (
                  <div className="w-full">
                    <CardContainer containerClassName="w-full" className="w-full">
                      <CardBody 
                        className="relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full aspect-[3/2] rounded-xl p-5 border flex flex-col will-change-transform"
                        style={{ 
                          backgroundColor: 'hsl(39, 56%, 95%)',
                          transformStyle: 'preserve-3d'
                        }}
                      >
                        <CardItem
                          translateZ="50"
                          className="text-xl font-bold text-neutral-600 dark:text-white mb-4 text-center w-full"
                        >
                          {item.title}
                        </CardItem>
                        <CardItem 
                          translateZ="100" 
                          rotateX={imageVariant === 'tilted' ? 20 : 0}
                          rotateZ={imageVariant === 'tilted' ? -10 : 0}
                          className="w-full flex-1 flex items-center justify-center px-4 py-2"
                        >
                          <div className="w-5/6 h-5/6">
                            {images[0] ? (
                              <img
                                src={images[0]}
                                alt={item.title || 'Image'}
                                className="h-full w-full rounded-xl group-hover/card:shadow-xl object-cover"
                                onError={(e) => {
                                  console.error('Image failed to load:', images[0]);
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="h-full w-full rounded-xl bg-muted flex items-center justify-center">
                                <p className="text-muted-foreground">No image</p>
                              </div>
                            )}
                          </div>
                        </CardItem>
                      </CardBody>
                    </CardContainer>
                  </div>
                  ) : (
                    <div className="w-full">
                      <CardContainer containerClassName="w-full" className="w-full">
                        <CardBody 
                          className="relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full aspect-[3/2] rounded-xl p-5 border flex flex-col will-change-transform"
                          style={{ 
                            backgroundColor: 'hsl(39, 56%, 95%)',
                            transformStyle: 'preserve-3d'
                          }}
                        >
                          <CardItem
                            translateZ="50"
                            className="text-xl font-bold text-neutral-600 dark:text-white mb-4 text-center w-full"
                          >
                            {item.title}
                          </CardItem>
                          <CardItem 
                            translateZ="100" 
                            className="w-full flex-1 flex items-center justify-center"
                          >
                            <div className="text-center text-muted-foreground">
                              <Image className="w-16 h-16 mx-auto mb-2 opacity-30" />
                              <p className="text-sm">No image uploaded</p>
                              <p className="text-xs mt-1">Click settings to add an image</p>
                            </div>
                          </CardItem>
                        </CardBody>
                      </CardContainer>
                    </div>
                  )
                ) : viewMode === 'multi-images' && multiImages.length > 0 ? (
                  <div className="w-full">
                    <AnimatedTestimonials 
                      testimonials={multiImages.map(img => ({
                        quote: img.quote || '',
                        name: img.name || '',
                        designation: img.designation || '',
                        src: img.src || ''
                      }))}
                      autoplay={false}
                      className="w-full px-2 py-4"
                    />
                  </div>
                ) : viewMode === 'compare' && compareImages.first && compareImages.second ? (
                  compareVariant === '3d' ? (
                    <div className="w-full h-full flex items-center justify-center [perspective:800px] [transform-style:preserve-3d]">
                      <div
                        style={{
                          transform: "rotateX(15deg) translateZ(120px)",
                        }}
                        className="p-4 md:p-8 border rounded-3xl dark:bg-neutral-900 bg-neutral-100 border-neutral-200 dark:border-neutral-800 w-4/5 h-3/4"
                      >
                        <Compare
                          firstImage={compareImages.first}
                          secondImage={compareImages.second}
                          firstImageClassName="object-cover object-center w-full"
                          secondImageClassname="object-cover object-center w-full"
                          className="w-full h-full rounded-[22px] md:rounded-lg"
                          slideMode={compareSlideMode}
                          autoplay={true}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full max-w-6xl mx-auto p-8">
                      <Compare
                        firstImage={compareImages.first}
                        secondImage={compareImages.second}
                        firstImageClassName="object-cover object-center"
                        secondImageClassname="object-cover object-center"
                        className="h-full w-full max-h-[80vh]"
                        slideMode={compareSlideMode}
                      />
                    </div>
                  )
                ) : (
                  <div className="w-full h-full">
                    {renderContent()}
                  </div>
                )}
                </div>
              </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
          </Dialog>
        )}
        
        {/* Settings Button */}
        {/*
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="secondary" className="h-8 w-8 shadow-md">
              <Settings className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent 
            side={sheetSide} 
            className="overflow-y-auto p-0"
            style={{ width: `${sheetWidth}px` }}
          >
            {/* Resize Handle */}
            <div
              className={cn(
                "absolute top-0 w-2 h-full cursor-ew-resize group/resize transition-colors",
                sheetSide === 'right' ? 'left-0' : 'right-0',
                isResizing && 'bg-primary/30'
              )}
              onMouseDown={(e) => {
                e.preventDefault()
                setIsResizing(true)
                
                const startX = e.clientX
                const startWidth = sheetWidth
                
                const handleMouseMove = (e: MouseEvent) => {
                  const deltaX = e.clientX - startX
                  const newWidth = sheetSide === 'right' 
                    ? startWidth - deltaX 
                    : startWidth + deltaX
                  
                  // Constrain width between 400px and 80% of viewport
                  const minWidth = 400
                  const maxWidth = window.innerWidth * 0.8
                  setSheetWidth(Math.max(minWidth, Math.min(maxWidth, newWidth)))
                }
                
                const handleMouseUp = () => {
                  setIsResizing(false)
                  document.removeEventListener('mousemove', handleMouseMove)
                  document.removeEventListener('mouseup', handleMouseUp)
                  document.body.style.cursor = ''
                  document.body.style.userSelect = ''
                }
                
                document.addEventListener('mousemove', handleMouseMove)
                document.addEventListener('mouseup', handleMouseUp)
                document.body.style.cursor = 'ew-resize'
                document.body.style.userSelect = 'none'
              }}
            >
              <div className={cn(
                "absolute top-0 w-0.5 h-full bg-border transition-all",
                sheetSide === 'right' ? 'left-0' : 'right-0',
                "group-hover/resize:bg-primary/20",
                isResizing && "bg-primary/40"
              )} />
              <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 opacity-0 group-hover/resize:opacity-100 transition-opacity">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            
            <div className="flex flex-col h-full">
              {/* Enhanced Header */}
              <div className="p-6 pb-4 border-b bg-gradient-to-b from-background to-muted/20">
                <SheetHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
                        <Settings className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <SheetTitle className="text-xl font-semibold">Card Settings</SheetTitle>
                        <p className="text-xs text-muted-foreground mt-0.5">Customize appearance and content</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setSheetSide(sheetSide === 'right' ? 'left' : 'right')}
                        className="h-8 w-8 hover:bg-secondary/80 transition-colors"
                        title={`Move to ${sheetSide === 'right' ? 'left' : 'right'}`}
                      >
                        {sheetSide === 'right' ? (
                          <PanelLeftOpen className="h-4 w-4" />
                        ) : (
                          <PanelRightOpen className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </SheetHeader>
              </div>
              
              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-4">
                  {/* View Mode Selector */}
                  <div className="group relative overflow-hidden rounded-xl border bg-card transition-all hover:shadow-md">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-sm">
                          <Layers className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <Label className="font-semibold text-base">Display Mode</Label>
                          <p className="text-xs text-muted-foreground">Choose how content appears</p>
                        </div>
                      </div>
                      <Select value={viewMode} onValueChange={handleViewModeChange}>
                        <SelectTrigger className="w-full bg-background/50 hover:bg-background/80 border-muted-foreground/20 transition-all">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {viewModeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center gap-3">
                                <option.icon className="h-4 w-4" />
                                <span>{option.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Text Layout Style - Available for all view modes */}
                  <div className="group relative overflow-hidden rounded-xl border bg-card transition-all hover:shadow-md">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500/20 to-green-500/20 backdrop-blur-sm">
                          <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <Label className="font-semibold text-base">Text Layout</Label>
                          <p className="text-xs text-muted-foreground">Content arrangement style</p>
                        </div>
                      </div>
                <Select value={textVariant} onValueChange={(v: TextVariant) => {
                  setTextVariant(v)
                  onUpdate?.('textVariant', v)
                }}>
                  <SelectTrigger className="bg-background/50 hover:bg-background transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="simple">
                      <div className="flex flex-col">
                        <span className="font-medium">Simple Layout</span>
                        <span className="text-xs text-muted-foreground">Title + Subtitle</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="detailed">
                      <div className="flex flex-col">
                        <span className="font-medium">Detailed Layout</span>
                        <span className="text-xs text-muted-foreground">Title + Organization + Description</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground bg-background/30 p-2 rounded-lg border">
                  💡 Choose how text content is displayed in the card
                </p>
                    </div>
                  </div>

              {/* Typography Controls - Available for all view modes */}
              <div className="space-y-4 p-4 border rounded-lg bg-muted/10">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <Type className="h-4 w-4 text-primary" />
                  <Label className="font-medium">Typography Controls</Label>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  Typography controls are available in all display modes
                </div>
              </div>

              {/* Dynamic content editors based on view mode */}
              
              {viewMode === 'code' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Code Display</Label>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const useTabs = codeTabs.length === 0
                            if (useTabs) {
                              // Convert single code to tabs
                              const newTabs: CodeTab[] = [
                                {
                                  name: item.title || 'main.tsx',
                                  code: codeContent || '',
                                  language: codeLanguage
                                }
                              ]
                              setCodeTabs(newTabs)
                              onUpdate?.('codeTabs', newTabs)
                              setCodeContent('')
                              onUpdate?.('codeSnippet', '')
                            } else {
                              // Convert tabs to single code
                              if (codeTabs.length > 0) {
                                setCodeContent(codeTabs[0].code)
                                setCodeLanguage(codeTabs[0].language)
                                onUpdate?.('codeSnippet', codeTabs[0].code)
                                onUpdate?.('codeLanguage', codeTabs[0].language)
                              }
                              setCodeTabs([])
                              onUpdate?.('codeTabs', [])
                            }
                          }}
                        >
                          {codeTabs.length > 0 ? 'Single File' : 'Multiple Tabs'}
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {codeTabs.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Code Tabs</Label>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const newTab: CodeTab = {
                              name: `file${codeTabs.length + 1}.tsx`,
                              code: '',
                              language: 'typescript'
                            }
                            const updatedTabs = [...codeTabs, newTab]
                            setCodeTabs(updatedTabs)
                            onUpdate?.('codeTabs', updatedTabs)
                          }}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Tab
                        </Button>
                      </div>
                      
                      <Tabs defaultValue="0" className="w-full">
                        <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${codeTabs.length}, 1fr)` }}>
                          {codeTabs.map((tab, index) => (
                            <TabsTrigger key={index} value={index.toString()}>
                              {tab.name}
                            </TabsTrigger>
                          ))}
                        </TabsList>
                        
                        {codeTabs.map((tab, index) => (
                          <TabsContent key={index} value={index.toString()} className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Input
                                value={tab.name}
                                onChange={(e) => {
                                  const updatedTabs = [...codeTabs]
                                  updatedTabs[index].name = e.target.value
                                  setCodeTabs(updatedTabs)
                                  onUpdate?.('codeTabs', updatedTabs)
                                }}
                                placeholder="Filename"
                                className="flex-1"
                              />
                              <Select 
                                value={tab.language} 
                                onValueChange={(v) => {
                                  const updatedTabs = [...codeTabs]
                                  updatedTabs[index].language = v
                                  setCodeTabs(updatedTabs)
                                  onUpdate?.('codeTabs', updatedTabs)
                                }}
                              >
                                <SelectTrigger className="w-[120px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="typescript">TypeScript</SelectItem>
                                  <SelectItem value="javascript">JavaScript</SelectItem>
                                  <SelectItem value="jsx">JSX</SelectItem>
                                  <SelectItem value="tsx">TSX</SelectItem>
                                  <SelectItem value="html">HTML</SelectItem>
                                  <SelectItem value="css">CSS</SelectItem>
                                  <SelectItem value="python">Python</SelectItem>
                                  <SelectItem value="java">Java</SelectItem>
                                  <SelectItem value="go">Go</SelectItem>
                                  <SelectItem value="rust">Rust</SelectItem>
                                  <SelectItem value="cpp">C++</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => {
                                  const updatedTabs = codeTabs.filter((_, i) => i !== index)
                                  setCodeTabs(updatedTabs)
                                  onUpdate?.('codeTabs', updatedTabs)
                                }}
                                disabled={codeTabs.length === 1}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <Textarea
                              value={tab.code}
                              onChange={(e) => {
                                const updatedTabs = [...codeTabs]
                                updatedTabs[index].code = e.target.value
                                setCodeTabs(updatedTabs)
                                onUpdate?.('codeTabs', updatedTabs)
                              }}
                              placeholder="Paste your code here..."
                              className="font-mono min-h-[200px]"
                            />
                          </TabsContent>
                        ))}
                      </Tabs>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label>Programming Language</Label>
                        <Select value={codeLanguage} onValueChange={(v) => {
                          setCodeLanguage(v)
                          onUpdate?.('codeLanguage', v)
                        }}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="typescript">TypeScript</SelectItem>
                            <SelectItem value="javascript">JavaScript</SelectItem>
                            <SelectItem value="jsx">JSX</SelectItem>
                            <SelectItem value="tsx">TSX</SelectItem>
                            <SelectItem value="html">HTML</SelectItem>
                            <SelectItem value="css">CSS</SelectItem>
                            <SelectItem value="python">Python</SelectItem>
                            <SelectItem value="java">Java</SelectItem>
                            <SelectItem value="go">Go</SelectItem>
                            <SelectItem value="rust">Rust</SelectItem>
                            <SelectItem value="cpp">C++</SelectItem>
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
                          className="font-mono min-h-[200px]"
                        />
                      </div>
                    </>
                  )}
                </div>
              )}

              {viewMode === 'images' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>3D Effect Style</Label>
                    <Select value={imageVariant} onValueChange={(v: 'standard' | 'tilted') => {
                      setImageVariant(v)
                      onUpdate?.('imageVariant', v)
                    }}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard (No Tilt)</SelectItem>
                        <SelectItem value="tilted">Tilted Perspective</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Image Source</Label>
                    <div className="space-y-4">
                      {/* URL Input */}
                      <div className="space-y-2">
                        <Label className="text-sm">Image URL</Label>
                        <Input
                          value={images[0]?.startsWith('data:') ? '' : images[0] || ''}
                          onChange={(e) => {
                            const newImages = [e.target.value]
                            setImages(newImages)
                            setImageTransform({ crop: { x: 0, y: 0 }, zoom: 1, rotation: 0 })
                            onUpdate?.('images', newImages)
                            onUpdate?.('imageTransform', { crop: { x: 0, y: 0 }, zoom: 1, rotation: 0 })
                          }}
                          onBlur={(e) => {
                            // Ensure the image is set on blur as well
                            if (e.target.value && e.target.value !== images[0]) {
                              const newImages = [e.target.value]
                              setImages(newImages)
                              onUpdate?.('images', newImages)
                            }
                          }}
                          placeholder="https://example.com/image.jpg"
                        />
                        {images[0]?.startsWith('data:') && (
                          <p className="text-xs text-muted-foreground">Currently showing uploaded image</p>
                        )}
                      </div>
                      
                      {/* OR Divider */}
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-background px-2 text-muted-foreground">Or</span>
                        </div>
                      </div>
                      
                      {/* File Upload */}
                      <div className="space-y-2">
                        <Label className="text-sm">Upload Image</Label>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              const reader = new FileReader()
                              reader.onloadend = () => {
                                const base64String = reader.result as string
                                const newImages = [base64String]
                                setImages(newImages)
                                setImageTransform({ crop: { x: 0, y: 0 }, zoom: 1, rotation: 0 })
                                onUpdate?.('images', newImages)
                                onUpdate?.('imageTransform', { crop: { x: 0, y: 0 }, zoom: 1, rotation: 0 })
                              }
                              reader.readAsDataURL(file)
                            }
                          }}
                        />
                        {images[0] && images[0].startsWith('data:') && (
                          <p className="text-xs text-muted-foreground">Image uploaded successfully</p>
                        )}
                      </div>
                      
                      {/* Image Preview */}
                      {images[0] && (
                        <div className="space-y-2">
                          <Label className="text-sm">Preview (as shown in card)</Label>
                          <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                            <TransformedImage
                              src={images[0]}
                              transform={imageTransform}
                              alt="Preview"
                              className="w-full h-full"
                            />
                            <Button
                              size="sm"
                              variant="secondary"
                              className="absolute bottom-2 right-2 h-7 text-xs"
                              onClick={() => setIsEditingImage(true)}
                            >
                              <Edit2 className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {/* Clear Button */}
                      {images[0] && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => {
                            setImages([])
                            setImageTransform({ crop: { x: 0, y: 0 }, zoom: 1, rotation: 0 })
                            onUpdate?.('images', [])
                            onUpdate?.('imageTransform', { crop: { x: 0, y: 0 }, zoom: 1, rotation: 0 })
                          }}
                        >
                          Clear Image
                        </Button>
                      )}
                    </div>
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
                  />
                </div>
              )}

              {viewMode === 'video' && (
                <div className="space-y-2">
                  <Label>Video URL</Label>
                  <Input
                    value={videoUrl}
                    onChange={(e) => {
                      setVideoUrl(e.target.value)
                      onUpdate?.('videoUrl', e.target.value)
                    }}
                    placeholder="YouTube, Vimeo, or direct video URL"
                  />
                </div>
              )}

              {viewMode === 'tweet' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tweet ID or URL</Label>
                    <Input
                      value={tweetId}
                      onChange={(e) => {
                        const id = extractTweetId(e.target.value)
                        setTweetId(id)
                        onUpdate?.('tweetId', id)
                      }}
                      placeholder="Tweet ID or full Twitter/X URL"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tweet Style</Label>
                    <Select value={tweetVariant} onValueChange={(v: 'default' | 'shadow' | 'minimal') => {
                      setTweetVariant(v)
                      onUpdate?.('tweetVariant', v)
                    }}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="shadow">With Shadow (shadow-2xl)</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                      </SelectContent>
                    </Select>
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
                  />
                </div>
              )}

              {viewMode === 'multi-images' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Images ({multiImages.length})</Label>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const newImage = {
                          src: '',
                          name: 'Name',
                          designation: 'Title',
                          quote: 'Quote or description'
                        }
                        const updated = [...multiImages, newImage]
                        setMultiImages(updated)
                        onUpdate?.('multiImages', updated)
                      }}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Image
                    </Button>
                  </div>
                  
                  {multiImages.map((img, index) => (
                    <div key={index} className="space-y-3 p-4 border rounded-lg relative">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute top-2 right-2 h-6 w-6"
                        onClick={() => {
                          const updated = multiImages.filter((_, i) => i !== index)
                          setMultiImages(updated)
                          onUpdate?.('multiImages', updated)
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      
                      <div className="space-y-2">
                        <Label className="text-xs">Image {index + 1}</Label>
                        
                        {/* Image upload/URL */}
                        <div className="space-y-2">
                          <Input
                            value={img.src?.startsWith('data:') ? '' : img.src || ''}
                            onChange={(e) => {
                              const updated = [...multiImages]
                              updated[index].src = e.target.value
                              setMultiImages(updated)
                              onUpdate?.('multiImages', updated)
                            }}
                            placeholder="Image URL"
                            className="text-sm"
                          />
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                const reader = new FileReader()
                                reader.onloadend = () => {
                                  const updated = [...multiImages]
                                  updated[index].src = reader.result as string
                                  setMultiImages(updated)
                                  onUpdate?.('multiImages', updated)
                                }
                                reader.readAsDataURL(file)
                              }
                            }}
                            className="text-sm"
                          />
                        </div>
                        
                        {/* Name */}
                        <Input
                          value={img.name || ''}
                          onChange={(e) => {
                            const updated = [...multiImages]
                            updated[index].name = e.target.value
                            setMultiImages(updated)
                            onUpdate?.('multiImages', updated)
                          }}
                          placeholder="Name"
                          className="text-sm"
                        />
                        
                        {/* Designation */}
                        <Input
                          value={img.designation || ''}
                          onChange={(e) => {
                            const updated = [...multiImages]
                            updated[index].designation = e.target.value
                            setMultiImages(updated)
                            onUpdate?.('multiImages', updated)
                          }}
                          placeholder="Title/Role"
                          className="text-sm"
                        />
                        
                        {/* Quote */}
                        <Textarea
                          value={img.quote || ''}
                          onChange={(e) => {
                            const updated = [...multiImages]
                            updated[index].quote = e.target.value
                            setMultiImages(updated)
                            onUpdate?.('multiImages', updated)
                          }}
                          placeholder="Quote or description"
                          className="text-sm min-h-[60px]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {viewMode === 'compare' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Compare Style</Label>
                    <Select value={compareVariant} onValueChange={(v: 'standard' | '3d') => {
                      setCompareVariant(v)
                      onUpdate?.('compareVariant', v)
                    }}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard View</SelectItem>
                        <SelectItem value="3d">3D Perspective View</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Compare Mode</Label>
                    <Select value={compareSlideMode} onValueChange={(v: 'hover' | 'drag') => {
                      setCompareSlideMode(v)
                      onUpdate?.('compareSlideMode', v)
                    }}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hover">Hover to Compare</SelectItem>
                        <SelectItem value="drag">Drag to Compare</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* First Image */}
                  <div className="space-y-2">
                    <Label>First Image (Before)</Label>
                    <div className="space-y-2">
                      <Input
                        value={compareImages.first?.startsWith('data:') ? '' : compareImages.first || ''}
                        onChange={(e) => {
                          setCompareImages({ ...compareImages, first: e.target.value })
                          onUpdate?.('compareFirstImage', e.target.value)
                        }}
                        placeholder="Image URL"
                      />
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const reader = new FileReader()
                            reader.onloadend = () => {
                              const base64String = reader.result as string
                              setCompareImages({ ...compareImages, first: base64String })
                              onUpdate?.('compareFirstImage', base64String)
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                      />
                      {compareImages.first && (
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={compareImages.first}
                            alt="First image"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Second Image */}
                  <div className="space-y-2">
                    <Label>Second Image (After)</Label>
                    <div className="space-y-2">
                      <Input
                        value={compareImages.second?.startsWith('data:') ? '' : compareImages.second || ''}
                        onChange={(e) => {
                          setCompareImages({ ...compareImages, second: e.target.value })
                          onUpdate?.('compareSecondImage', e.target.value)
                        }}
                        placeholder="Image URL"
                      />
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const reader = new FileReader()
                            reader.onloadend = () => {
                              const base64String = reader.result as string
                              setCompareImages({ ...compareImages, second: base64String })
                              onUpdate?.('compareSecondImage', base64String)
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                      />
                      {compareImages.second && (
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={compareImages.second}
                            alt="Second image"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    Upload two images to create an interactive before/after comparison. Perfect for showcasing transformations, improvements, or different states.
                  </p>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
        */}
        
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
      <div className="h-full w-full overflow-hidden">
        {renderContent()}
      </div>

      {/* Image Editor Dialog */}
      <Dialog open={isEditingImage} onOpenChange={setIsEditingImage}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-6">
          <DialogTitle className="sr-only">Edit Image</DialogTitle>
          {images[0] && (
            <ImageTransformEditor
              image={images[0]}
              initialTransform={imageTransform}
              aspectRatio={4 / 3}
              onSave={(transform) => {
                setImageTransform(transform)
                onUpdate?.('imageTransform', transform)
                setIsEditingImage(false)
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}