"use client"

import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Settings, FileText, Image, Code, Github, Link, Video, Twitter, Maximize2, ExternalLink, Edit2, Plus, X, MoveHorizontal, GripVertical, Trash2, BarChart3, Type, Layers, PanelLeftOpen, PanelRightOpen, Briefcase, Building2, Palette, Users, Target, TrendingUp, Award, Lightbulb, Rocket, Star, Heart, GraduationCap, Camera, Coffee, Globe, Mail, Phone, ChevronDown, ChevronUp, Search, Monitor, Smartphone, Home, Car, Plane, Clock, Calendar, MapPin, Shield, Zap, Flame, Droplets, Sun, Moon, Cloud, Wifi, Battery, Bell, Lock, Key, Eye, EyeOff, ThumbsUp, MessageCircle, Send, Download, Upload, Share2, Copy, Scissors, PenTool, Paintbrush, Compass, Mountain, TreePine, Flower, Bug, Fish, Dog, Cat, Pizza, Utensils, ShoppingCart, CreditCard, Banknote, Gamepad2, Music, Headphones, Mic, Play, Pause, Volume2, Book, Bookmark, Newspaper, FileCheck, Folder, Archive, Database, Server, Cpu, HardDrive, Smartphone as SmartphoneIcon, Laptop, Mouse, Keyboard, Printer, ScanLine, Calculator, Microscope, Telescope, Stethoscope, Pill, Syringe, Thermometer, Activity, HeartHandshake, UserCheck, Users2, Crown, Trophy, Medal, Flag, Target as TargetIcon, LayoutGrid } from 'lucide-react'
import { useEditMode } from '@/contexts/edit-mode-context'
import { SmartCardProvider } from '@/contexts/smart-card-context'
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
import { EnhancedIconSelector } from './ui/enhanced-icon-selector'
import { IconWithZoom } from './ui/icon-with-zoom'
import { SmartCardControls } from './ui/smart-card-controls'
import { EditGuard, EditOnlyWrapper } from './ui/edit-guard'
import { renderIcon } from '@/lib/icon-utils'

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
  showIconEditor?: boolean // Whether to show icon editor for default text view
  disableHoverEffects?: boolean // Disable card hover effects for certain layouts
  supportsTextVariant?: boolean // Auto-detected if not provided
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

export function SmartCard({ item, children, className, onUpdate, onDelete, showIconEditor = true, disableHoverEffects = false, supportsTextVariant }: SmartCardProps) {
  const { isEditMode, isEditAllowed } = useEditMode()
  
  // Safety check - if not in edit mode, disable all edit functionality
  const safeOnUpdate = isEditAllowed('SmartCard') ? onUpdate : undefined
  const safeOnDelete = isEditAllowed('SmartCard') ? onDelete : undefined
  const safeShowIconEditor = isEditAllowed('SmartCard') ? showIconEditor : false
  const [viewMode, setViewMode] = useState<ViewMode>(item.viewMode || 'text')
  const [sheetOpen, setSheetOpen] = useState(false)
  const [images, setImages] = useState<string[]>(item.images || [])
  const [codeContent, setCodeContent] = useState(item.codeSnippet || '')
  const [codeLanguage, setCodeLanguage] = useState(item.codeLanguage || 'typescript')
  const [codeTabs, setCodeTabs] = useState<CodeTab[]>(item.codeTabs || [])
  const [activeCodeTab, setActiveCodeTab] = useState(0)
  const [textVariant, setTextVariant] = useState<TextVariant>(item.textVariant || 'detailed')
  const [githubUrl, setGithubUrl] = useState(item.githubUrl || '')
  const [videoUrl, setVideoUrl] = useState(item.videoUrl || '')
  const [linkUrl, setLinkUrl] = useState(item.linkUrl || '')
  const [tweetId, setTweetId] = useState(item.tweetId || '')
  const [multiImages, setMultiImages] = useState<string[]>(item.multiImages || [])
  const [compareImages, setCompareImages] = useState<string[]>(item.compareImages || [])
  const [isEditingImage, setIsEditingImage] = useState(false)
  const [imageTransform, setImageTransform] = useState<ImageTransform>(
    item.imageTransform || { crop: { x: 0, y: 0 }, zoom: 1, rotation: 0 }
  )
  const [collapsedSections, setCollapsedSections] = useState<{[key: string]: boolean}>({
    display: false,
    overlay: true,
    icon: true,
    typography: true
  })

  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  // Determine if textVariant functionality should be shown
  const hasTextVariantSupport = React.useMemo(() => {
    // If explicitly provided, use that value
    if (supportsTextVariant !== undefined) {
      return supportsTextVariant
    }
    
    // Simple fallback detection: check if item has textVariant property
    // This is reliable because components that support textVariant typically pass it through
    return item.textVariant !== undefined
  }, [supportsTextVariant, item.textVariant])

  // Update local state when item prop changes
  React.useEffect(() => {
    setViewMode(item.viewMode || 'text')
    setImages(item.images || [])
    setCodeContent(item.codeSnippet || '')
    setCodeLanguage(item.codeLanguage || 'typescript')
    setCodeTabs(item.codeTabs || [])
    setTextVariant(item.textVariant || 'detailed')
    setGithubUrl(item.githubUrl || '')
    setVideoUrl(item.videoUrl || '')
    setLinkUrl(item.linkUrl || '')
    setTweetId(item.tweetId || '')
    setMultiImages(item.multiImages || [])
    setCompareImages(item.compareImages || [])
    setImageTransform(item.imageTransform || { crop: { x: 0, y: 0 }, zoom: 1, rotation: 0 })
  }, [item])

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode)
    onUpdate?.('viewMode', mode)
  }
  
  const renderContent = () => {
    switch (viewMode) {
      case 'images':
        return (
          <div className="relative h-full w-full">
            {images[0] ? (
              <div className={cn(
                "bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden scale-[1.6] origin-center",
                isEditMode && "border-2 border-dashed border-green-500 p-1"
              )}>
                {/* Clean headline section */}
                {item.title && (
                  <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                    <h2 className="text-lg font-semibold text-foreground">
                      {item.title}
                    </h2>
                  </div>
                )}
                {/* Image container */}
                <div className="relative w-full aspect-video bg-gray-50 dark:bg-gray-950 rounded-b-2xl overflow-hidden">
                  <img
                    src={images[0]}
                    alt={item.title || 'Image'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23f3f4f6"/><text x="200" y="150" text-anchor="middle" fill="%236b7280" font-family="sans-serif" font-size="14">Image failed to load</text></svg>';
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="text-center text-gray-400">
                  <Image className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Click settings to add image</p>
                </div>
              </div>
            )}
          </div>
        )
      
      case 'code':
        return (
          <div className="relative h-full w-full">
            {(codeTabs.length > 0 || codeContent) ? (
              <div className="w-full h-full">
                {/* Clean headline section */}
                {item.title && (
                  <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                    <h2 className="text-lg font-semibold text-foreground">
                      {item.title}
                    </h2>
                  </div>
                )}
                {/* Code content */}
                <div className="overflow-hidden">
                  {codeTabs.length > 0 ? (
                    <Tabs value={activeCodeTab.toString()} onValueChange={(v) => setActiveCodeTab(parseInt(v))} className="flex flex-col">
                      <TabsList className="grid w-full grid-cols-auto gap-0 rounded-none border-b bg-gray-50 dark:bg-gray-800 h-auto">
                        {codeTabs.map((tab, index) => (
                          <TabsTrigger 
                            key={index} 
                            value={index.toString()}
                            className="px-4 py-2 text-xs font-mono data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900"
                          >
                            {tab.name}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                      {codeTabs.map((tab, index) => (
                        <TabsContent key={index} value={index.toString()} className="m-0 p-6">
                          <CodeBlock
                            language={tab.language}
                            code={tab.code}
                            filename={tab.name}
                            highlightLines={tab.highlightLines}
                          />
                        </TabsContent>
                      ))}
                    </Tabs>
                  ) : (
                    <div className="p-6">
                      <CodeBlock
                        language={codeLanguage}
                        code={codeContent}
                        filename={item.title || 'code.tsx'}
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="text-center text-gray-400">
                  <Code className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Click settings to add code</p>
                </div>
              </div>
            )}
          </div>
        )

      case 'github':
        return (
          <div className="relative h-full w-full">
            {githubUrl ? (
              <div className="w-full h-full">
                {/* Clean headline section */}
                {item.title && (
                  <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                    <h2 className="text-lg font-semibold text-foreground">
                      {item.title}
                    </h2>
                  </div>
                )}
                {/* GitHub repo view */}
                <div className="p-6">
                  <GitHubRepoView url={githubUrl} className="w-full" />
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="text-center text-gray-400">
                  <Github className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Click settings to add GitHub repo</p>
                </div>
              </div>
            )}
          </div>
        )

      case 'video':
        return (
          <div className="relative h-full w-full">
            {videoUrl ? (
              <div className={cn(
                "bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden scale-[1.6] origin-center",
                isEditMode && "border-2 border-dashed border-green-500 p-1"
              )}>
                {/* Clean headline section */}
                {item.title && (
                  <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                    <h2 className="text-lg font-semibold text-foreground">
                      {item.title}
                    </h2>
                  </div>
                )}
                {/* Video container with proper aspect ratio */}
                <div className="relative w-full aspect-video bg-gray-50 dark:bg-gray-950 rounded-b-2xl overflow-hidden">
                  <VideoPlayer url={videoUrl} className="absolute inset-0" />
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="text-center text-gray-400">
                  <Video className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Click settings to add video</p>
                </div>
              </div>
            )}
          </div>
        )

      case 'uri':
        return (
          <div className="relative h-full w-full">
            {linkUrl ? (
              <div className="w-full h-full">
                {/* Clean headline section */}
                {item.title && (
                  <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                    <h2 className="text-lg font-semibold text-foreground">
                      {item.title}
                    </h2>
                  </div>
                )}
                {/* Link preview */}
                <div className="p-6">
                  <LinkPreview url={linkUrl} className="w-full">
                    {linkUrl}
                  </LinkPreview>
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="text-center text-gray-400">
                  <Link className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Click settings to add link</p>
                </div>
              </div>
            )}
          </div>
        )

      case 'tweet':
        return (
          <div className="relative h-full w-full">
            {tweetId ? (
              <div className="w-full h-full">
                {/* Clean headline section */}
                {item.title && (
                  <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                    <h2 className="text-lg font-semibold text-foreground">
                      {item.title}
                    </h2>
                  </div>
                )}
                {/* Tweet embed */}
                <div className="p-6">
                  <ClientTweetCard id={tweetId} className="w-full" />
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="text-center text-gray-400">
                  <Twitter className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Click settings to add tweet</p>
                </div>
              </div>
            )}
          </div>
        )

      case 'multi-images':
        return (
          <div className="relative h-full w-full">
            {multiImages.length > 0 ? (
              <div className="w-full h-full">
                {/* Clean headline section */}
                {item.title && (
                  <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                    <h2 className="text-lg font-semibold text-foreground">
                      {item.title}
                    </h2>
                  </div>
                )}
                {/* Image carousel */}
                <div className="relative w-full aspect-video bg-gray-50 dark:bg-gray-950">
                  <ImageCarousel images={multiImages} className="w-full h-full" />
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="text-center text-gray-400">
                  <Image className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Click settings to add images</p>
                </div>
              </div>
            )}
          </div>
        )

      case 'compare':
        return (
          <div className="relative h-full w-full">
            {compareImages && compareImages.length >= 2 ? (
              <div className="w-full h-full">
                {/* Clean headline section */}
                {item.title && (
                  <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                    <h2 className="text-lg font-semibold text-foreground">
                      {item.title}
                    </h2>
                  </div>
                )}
                {/* Comparison view */}
                <div className="relative w-full aspect-video bg-gray-50 dark:bg-gray-950">
                  <Compare
                    firstImage={compareImages[0]}
                    secondImage={compareImages[1]}
                    firstImageClassName="object-cover"
                    secondImageClassname="object-cover"
                    className="w-full h-full"
                    slideMode="hover"
                  />
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="text-center text-gray-400">
                  <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Click settings to add images</p>
                </div>
              </div>
            )}
          </div>
        )

      default:
        return (
          <div className="relative h-full overflow-hidden">
            {/* Invisible Icon Click Overlay - Only in edit mode for text view */}
            {isEditMode && viewMode === 'text' && (
              <div 
                className="absolute top-6 left-6 w-16 h-16 z-20 cursor-pointer rounded-xl"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setSheetOpen(true)
                  // Open Icon Settings section when opened from icon click, close Display Mode
                  setCollapsedSections(prev => ({
                    ...prev,
                    display: true,
                    icon: false
                  }))
                }}
                title="Click to edit icon"
              />
            )}
            {children}
          </div>
        )
    }
  }

  // Main component return
  return (
    <div className={cn("group relative h-full", className)}>
      {/* Universal Smart Card Controls - FULLY PROTECTED by EditGuard */}
      <EditGuard>
        {/* Settings Sheet */}
        <Sheet open={sheetOpen} onOpenChange={(open) => {
          setSheetOpen(open)
          // Reset all sections to closed when sheet is closed
          if (!open) {
            setCollapsedSections({
              display: false,
              overlay: true,
              icon: true,
              typography: true
            })
          }
        }}>
          <SheetContent side="right" className="overflow-hidden flex flex-col w-[26rem] sm:w-[31rem]">
            <SheetHeader className="shrink-0">
              <SheetTitle className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Card Settings
              </SheetTitle>
            </SheetHeader>
            
            {/* Modern Vertical Stacked Sections */}
            <div className="flex-1 mt-6 space-y-4 overflow-y-auto">
                
                {/* Section 1: Display Mode - Collapsible */}
                <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200/50 dark:border-blue-800/30 shadow-sm overflow-hidden">
                  <div className="space-y-4">
                    <div 
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-gradient-to-br hover:from-blue-100 hover:to-indigo-200 dark:hover:from-blue-900/40 dark:hover:to-indigo-900/40 transition-all duration-200"
                      onClick={() => toggleSection('display')}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-blue-200 to-indigo-300 dark:from-blue-800/50 dark:to-indigo-800/50">
                          <LayoutGrid className="h-4 w-4 text-blue-700 dark:text-blue-300" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm text-blue-800 dark:text-blue-200">Display Mode</h3>
                        </div>
                      </div>
                      <ChevronDown className={`h-4 w-4 text-blue-600 dark:text-blue-400 transition-transform duration-200 ${
                        collapsedSections.display ? 'rotate-180' : ''
                      }`} />
                    </div>
                    
                    {!collapsedSections.display && (
                      <div className="px-4 pb-4 space-y-3">
                        <Select value={viewMode} onValueChange={handleViewModeChange}>
                          <SelectTrigger className="rounded-xl border-gray-200 dark:border-gray-700 shadow-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-gray-200 dark:border-gray-700">
                            {viewModeOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value} className="rounded-lg">
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

              {/* Dynamic content based on view mode */}
              {viewMode === 'images' && (
                <div className="space-y-3">
                  <Label>Image Upload</Label>
                  <div className="space-y-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const reader = new FileReader()
                          reader.onloadend = () => {
                            const base64String = reader.result as string
                            setImages([base64String])
                            onUpdate?.('images', [base64String])
                            onUpdate?.('imageUrl', base64String)
                          }
                          reader.readAsDataURL(file)
                        }
                      }}
                    />
                    <Input
                      value={item.imageUrl?.startsWith('data:') ? '' : (item.imageUrl || '')}
                      onChange={(e) => {
                        setImages([e.target.value])
                        onUpdate?.('images', [e.target.value])
                        onUpdate?.('imageUrl', e.target.value)
                      }}
                      placeholder="Or enter image URL"
                    />
                  </div>
                  {(images[0] || item.imageUrl) && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Preview</Label>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setIsEditingImage(true)}
                        >
                          <Edit2 className="h-3 w-3 mr-1" />
                          Transform
                        </Button>
                      </div>
                      <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                        <img
                          src={images[0] || item.imageUrl || ''}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {viewMode === 'code' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Code</Label>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const newTab: CodeTab = {
                          name: `file${codeTabs.length + 1}.tsx`,
                          code: '',
                          language: 'typescript'
                        }
                        const newTabs = [...codeTabs, newTab]
                        setCodeTabs(newTabs)
                        onUpdate?.('codeTabs', newTabs)
                      }}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Tab
                    </Button>
                  </div>
                  
                  {codeTabs.length > 0 ? (
                    <Tabs value={activeCodeTab.toString()} onValueChange={(v) => setActiveCodeTab(parseInt(v))} className="w-full">
                      <TabsList className="grid w-full grid-cols-auto gap-1">
                        {codeTabs.map((tab, index) => (
                          <TabsTrigger key={index} value={index.toString()} className="text-xs">
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
                                const newTabs = [...codeTabs]
                                newTabs[index] = { ...tab, name: e.target.value }
                                setCodeTabs(newTabs)
                                onUpdate?.('codeTabs', newTabs)
                              }}
                              placeholder="filename.tsx"
                              className="flex-1"
                            />
                            <Select 
                              value={tab.language}
                              onValueChange={(v) => {
                                const newTabs = [...codeTabs]
                                newTabs[index] = { ...tab, language: v }
                                setCodeTabs(newTabs)
                                onUpdate?.('codeTabs', newTabs)
                              }}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="typescript">TS</SelectItem>
                                <SelectItem value="javascript">JS</SelectItem>
                                <SelectItem value="jsx">JSX</SelectItem>
                                <SelectItem value="tsx">TSX</SelectItem>
                                <SelectItem value="html">HTML</SelectItem>
                                <SelectItem value="css">CSS</SelectItem>
                                <SelectItem value="python">Python</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                const newTabs = codeTabs.filter((_, i) => i !== index)
                                setCodeTabs(newTabs)
                                onUpdate?.('codeTabs', newTabs)
                                if (activeCodeTab >= newTabs.length) {
                                  setActiveCodeTab(Math.max(0, newTabs.length - 1))
                                }
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                          <Textarea
                            value={tab.code}
                            onChange={(e) => {
                              const newTabs = [...codeTabs]
                              newTabs[index] = { ...tab, code: e.target.value }
                              setCodeTabs(newTabs)
                              onUpdate?.('codeTabs', newTabs)
                            }}
                            placeholder="Enter your code here..."
                            className="font-mono text-sm min-h-[200px]"
                          />
                        </TabsContent>
                      ))}
                    </Tabs>
                  ) : (
                    <div className="space-y-2">
                      <Select 
                        value={codeLanguage} 
                        onValueChange={(v) => {
                          setCodeLanguage(v)
                          onUpdate?.('codeLanguage', v)
                        }}
                      >
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
                        </SelectContent>
                      </Select>
                      <Textarea
                        value={codeContent}
                        onChange={(e) => {
                          setCodeContent(e.target.value)
                          onUpdate?.('codeSnippet', e.target.value)
                        }}
                        placeholder="Enter your code here..."
                        className="font-mono text-sm min-h-[200px]"
                      />
                    </div>
                  )}
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

              {viewMode === 'tweet' && (
                <div className="space-y-2">
                  <Label>Tweet ID</Label>
                  <Input
                    value={tweetId}
                    onChange={(e) => {
                      setTweetId(e.target.value)
                      onUpdate?.('tweetId', e.target.value)
                    }}
                    placeholder="1234567890123456789"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the tweet ID from the URL (e.g., the numbers after /status/)
                  </p>
                </div>
              )}

              {viewMode === 'multi-images' && (
                <div className="space-y-3">
                  <Label>Multiple Images</Label>
                  <div className="space-y-2">
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || [])
                        files.forEach(file => {
                          const reader = new FileReader()
                          reader.onloadend = () => {
                            const base64String = reader.result as string
                            setMultiImages(prev => [...prev, base64String])
                            onUpdate?.('multiImages', [...multiImages, base64String])
                          }
                          reader.readAsDataURL(file)
                        })
                      }}
                    />
                    <Textarea
                      value={multiImages.join('\n')}
                      onChange={(e) => {
                        const urls = e.target.value.split('\n').filter(url => url.trim())
                        setMultiImages(urls)
                        onUpdate?.('multiImages', urls)
                      }}
                      placeholder="Or enter image URLs (one per line)"
                      className="min-h-[100px]"
                    />
                  </div>
                  {multiImages.length > 0 && (
                    <div className="space-y-2">
                      <Label>Preview ({multiImages.length} images)</Label>
                      <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto">
                        {multiImages.map((img, i) => (
                          <div key={i} className="relative">
                            <img
                              src={img}
                              alt={`Preview ${i + 1}`}
                              className="w-full h-20 object-cover rounded border"
                            />
                            <Button
                              size="sm"
                              variant="destructive"
                              className="absolute top-1 right-1 h-6 w-6 p-0"
                              onClick={() => {
                                const newImages = multiImages.filter((_, idx) => idx !== i)
                                setMultiImages(newImages)
                                onUpdate?.('multiImages', newImages)
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {viewMode === 'compare' && (
                <div className="space-y-3">
                  <Label>Comparison Images</Label>
                  <div className="space-y-2">
                    <div>
                      <Label className="text-sm">First Image</Label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const reader = new FileReader()
                            reader.onloadend = () => {
                              const base64String = reader.result as string
                              const newCompareImages = [base64String, compareImages[1] || '']
                              setCompareImages(newCompareImages)
                              onUpdate?.('compareImages', newCompareImages)
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                      />
                      <Input
                        value={compareImages[0] || ''}
                        onChange={(e) => {
                          const newCompareImages = [e.target.value, compareImages[1] || '']
                          setCompareImages(newCompareImages)
                          onUpdate?.('compareImages', newCompareImages)
                        }}
                        placeholder="Or enter first image URL"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm">Second Image</Label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const reader = new FileReader()
                            reader.onloadend = () => {
                              const base64String = reader.result as string
                              const newCompareImages = [compareImages[0] || '', base64String]
                              setCompareImages(newCompareImages)
                              onUpdate?.('compareImages', newCompareImages)
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                      />
                      <Input
                        value={compareImages[1] || ''}
                        onChange={(e) => {
                          const newCompareImages = [compareImages[0] || '', e.target.value]
                          setCompareImages(newCompareImages)
                          onUpdate?.('compareImages', newCompareImages)
                        }}
                        placeholder="Or enter second image URL"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  {compareImages[0] && compareImages[1] && (
                    <div className="space-y-2">
                      <Label>Preview</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <img
                          src={compareImages[0]}
                          alt="First comparison"
                          className="w-full h-20 object-cover rounded border"
                        />
                        <img
                          src={compareImages[1]}
                          alt="Second comparison"
                          className="w-full h-20 object-cover rounded border"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Section 2: Text Overlay - Collapsible (Only show if textVariant is supported) */}
                {hasTextVariantSupport && (
                <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-950/30 dark:to-violet-950/30 border border-purple-200/50 dark:border-purple-800/30 shadow-sm overflow-hidden">
                  <div className="space-y-4">
                    <div 
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-gradient-to-br hover:from-purple-100 hover:to-violet-200 dark:hover:from-purple-900/40 dark:hover:to-violet-900/40 transition-all duration-200"
                      onClick={() => toggleSection('overlay')}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-purple-200 to-violet-300 dark:from-purple-800/50 dark:to-violet-800/50">
                          <Type className="h-4 w-4 text-purple-700 dark:text-purple-300" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm text-purple-800 dark:text-purple-200">Text Overlay</h3>
                        </div>
                      </div>
                      <ChevronDown className={`h-4 w-4 text-purple-600 dark:text-purple-400 transition-transform duration-200 ${
                        collapsedSections.overlay ? 'rotate-180' : ''
                      }`} />
                    </div>
                    
                    {!collapsedSections.overlay && (
                      <div className="px-4 pb-4 space-y-3">
                        <Label className="text-sm font-medium">Text Display Mode</Label>
                      <Select 
                        value={textVariant} 
                        onValueChange={(v: TextVariant) => {
                          setTextVariant(v)
                          onUpdate?.('textVariant', v)
                        }}
                      >
                        <SelectTrigger className="rounded-xl border-gray-200 dark:border-gray-700 shadow-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-gray-200 dark:border-gray-700">
                          <SelectItem value="detailed" className="rounded-lg">
                            <div className="flex flex-col items-start gap-1">
                              <span className="font-medium">Detailed</span>
                              <span className="text-xs text-muted-foreground">Shows title, description, and all details</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="simple" className="rounded-lg">
                            <div className="flex flex-col items-start gap-1">
                              <span className="font-medium">Simple</span>
                              <span className="text-xs text-muted-foreground">Shows only title and essential info</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </div>
                )}

                {/* Section 3: Icon Settings - Collapsible */}
                <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200/50 dark:border-amber-800/30 shadow-sm overflow-hidden">
                  <div className="space-y-4">
                    <div 
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-gradient-to-br hover:from-amber-100 hover:to-orange-200 dark:hover:from-amber-900/40 dark:hover:to-orange-900/40 transition-all duration-200"
                      onClick={() => toggleSection('icon')}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-amber-200 to-orange-300 dark:from-amber-800/50 dark:to-orange-800/50">
                          <Star className="h-4 w-4 text-amber-700 dark:text-amber-300" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm text-amber-800 dark:text-amber-200">Icon Settings</h3>
                        </div>
                      </div>
                      <ChevronDown className={`h-4 w-4 text-amber-600 dark:text-amber-400 transition-transform duration-200 ${
                        collapsedSections.icon ? 'rotate-180' : ''
                      }`} />
                    </div>
                    
                    {!collapsedSections.icon && (
                      <div className="px-4 pb-4">
                        <EnhancedIconSelector
                          currentIcon={typeof item.icon === 'object' ? item.icon : { type: 'library', value: item.icon || 'lightbulb' }}
                          onIconSelect={(icon) => onUpdate?.('icon', icon)}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Section 4: Typography - Collapsible */}
                <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200/50 dark:border-emerald-800/30 shadow-sm overflow-hidden">
                  <div className="space-y-4">
                    <div 
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-gradient-to-br hover:from-emerald-100 hover:to-teal-200 dark:hover:from-emerald-900/40 dark:hover:to-teal-900/40 transition-all duration-200"
                      onClick={() => toggleSection('typography')}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-200 to-teal-300 dark:from-emerald-800/50 dark:to-teal-800/50">
                          <Palette className="h-4 w-4 text-emerald-700 dark:text-emerald-300" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm text-emerald-800 dark:text-emerald-200">Typography</h3>
                        </div>
                      </div>
                      <ChevronDown className={`h-4 w-4 text-emerald-600 dark:text-emerald-400 transition-transform duration-200 ${
                        collapsedSections.typography ? 'rotate-180' : ''
                      }`} />
                    </div>
                    
                    {!collapsedSections.typography && (
                      <div className="px-4 pb-4 space-y-3">
                        {/* Title */}
                      <div className="p-3 bg-white/50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200/50 dark:border-emerald-700/50">
                        <div className="flex items-start gap-2 mb-2">
                          <Label className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Title</Label>
                          <Select 
                            value={item.titleSize || 'text-lg'} 
                            onValueChange={(v) => onUpdate?.('titleSize', v)}
                          >
                            <SelectTrigger className="w-16 h-6 rounded-md border-emerald-300 dark:border-emerald-600 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                              <SelectItem value="text-xs">XS</SelectItem>
                              <SelectItem value="text-sm">SM</SelectItem>
                              <SelectItem value="text-base">MD</SelectItem>
                              <SelectItem value="text-lg">LG</SelectItem>
                              <SelectItem value="text-xl">XL</SelectItem>
                              <SelectItem value="text-2xl">2XL</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Input
                          value={item.title || ''}
                          onChange={(e) => onUpdate?.('title', e.target.value)}
                          placeholder="Enter title..."
                          className={`border-emerald-200 dark:border-emerald-700 bg-transparent font-semibold text-emerald-800 dark:text-emerald-200 ${item.titleSize || 'text-lg'}`}
                        />
                      </div>
                      
                      {/* Description */}
                      <div className="p-3 bg-white/50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200/50 dark:border-emerald-700/50">
                        <div className="flex items-start gap-2 mb-2">
                          <Label className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Description</Label>
                          <Select 
                            value={item.descriptionSize || 'text-sm'} 
                            onValueChange={(v) => onUpdate?.('descriptionSize', v)}
                          >
                            <SelectTrigger className="w-16 h-6 rounded-md border-emerald-300 dark:border-emerald-600 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                              <SelectItem value="text-xs">XS</SelectItem>
                              <SelectItem value="text-sm">SM</SelectItem>
                              <SelectItem value="text-base">MD</SelectItem>
                              <SelectItem value="text-lg">LG</SelectItem>
                              <SelectItem value="text-xl">XL</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Textarea
                          value={item.description || ''}
                          onChange={(e) => onUpdate?.('description', e.target.value)}
                          placeholder="Enter description..."
                          className={`border-emerald-200 dark:border-emerald-700 bg-transparent text-emerald-700 dark:text-emerald-300 min-h-[60px] resize-none ${item.descriptionSize || 'text-sm'}`}
                        />
                      </div>

                      {/* Company/Institution (if exists) */}
                      {(item.company || item.institution) && (
                        <div className="p-3 bg-white/50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200/50 dark:border-emerald-700/50">
                          <div className="flex items-start gap-2 mb-2">
                            <Label className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">{item.company ? 'Company' : 'Institution'}</Label>
                            <Select 
                              value={item.companySize || 'text-sm'} 
                              onValueChange={(v) => onUpdate?.('companySize', v)}
                            >
                              <SelectTrigger className="w-16 h-6 rounded-md border-emerald-300 dark:border-emerald-600 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl">
                                <SelectItem value="text-xs">XS</SelectItem>
                                <SelectItem value="text-sm">SM</SelectItem>
                                <SelectItem value="text-base">MD</SelectItem>
                                <SelectItem value="text-lg">LG</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Input
                            value={item.company || item.institution || ''}
                            onChange={(e) => onUpdate?.(item.company ? 'company' : 'institution', e.target.value)}
                            placeholder={`Enter ${item.company ? 'company' : 'institution'}...`}
                            className={`border-emerald-200 dark:border-emerald-700 bg-transparent text-emerald-700 dark:text-emerald-300 ${item.companySize || 'text-sm'}`}
                          />
                        </div>
                      )}

                      {/* Location (if exists) */}
                      {item.location && (
                        <div className="p-3 bg-white/50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200/50 dark:border-emerald-700/50">
                          <div className="flex items-start gap-2 mb-2">
                            <Label className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Location</Label>
                            <Select 
                              value={item.locationSize || 'text-xs'} 
                              onValueChange={(v) => onUpdate?.('locationSize', v)}
                            >
                              <SelectTrigger className="w-16 h-6 rounded-md border-emerald-300 dark:border-emerald-600 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl">
                                <SelectItem value="text-xs">XS</SelectItem>
                                <SelectItem value="text-sm">SM</SelectItem>
                                <SelectItem value="text-base">MD</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Input
                            value={item.location || ''}
                            onChange={(e) => onUpdate?.('location', e.target.value)}
                            placeholder="Enter location..."
                            className={`border-emerald-200 dark:border-emerald-700 bg-transparent text-emerald-600 dark:text-emerald-400 ${item.locationSize || 'text-xs'}`}
                          />
                        </div>
                      )}

                      {/* Role (if exists) */}
                      {item.role && (
                        <div className="p-3 bg-white/50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200/50 dark:border-emerald-700/50">
                          <div className="flex items-start gap-2 mb-2">
                            <Label className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Role</Label>
                            <Select 
                              value={item.roleSize || 'text-sm'} 
                              onValueChange={(v) => onUpdate?.('roleSize', v)}
                            >
                              <SelectTrigger className="w-16 h-6 rounded-md border-emerald-300 dark:border-emerald-600 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl">
                                <SelectItem value="text-xs">XS</SelectItem>
                                <SelectItem value="text-sm">SM</SelectItem>
                                <SelectItem value="text-base">MD</SelectItem>
                                <SelectItem value="text-lg">LG</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Input
                            value={item.role || ''}
                            onChange={(e) => onUpdate?.('role', e.target.value)}
                            placeholder="Enter role..."
                            className={`border-emerald-200 dark:border-emerald-700 bg-transparent text-emerald-700 dark:text-emerald-300 ${item.roleSize || 'text-sm'}`}
                          />
                        </div>
                      )}
                      </div>
                    )}
                  </div>
                </div>
            </div>
          </SheetContent>
        </Sheet>

        <SmartCardControls
          onDelete={safeOnDelete}
          onSettings={() => setSheetOpen(true)}
          onExpand={() => {}}
          externalLink={viewMode === 'uri' ? linkUrl : viewMode === 'github' ? githubUrl : viewMode === 'video' ? videoUrl : undefined}
          showExternal={viewMode === 'uri' || viewMode === 'github' || viewMode === 'video'}
          showExpand={viewMode === 'uri' || viewMode !== 'text'}
          variant="floating"
        />
      </EditGuard>

      {/* Content */}
      <div className="h-full w-full">
        <SmartCardProvider>
          {renderContent()}
        </SmartCardProvider>
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