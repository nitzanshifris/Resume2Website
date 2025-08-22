"use client"

import React, { useState, useRef, useEffect, useCallback } from 'react'
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
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism"

// Code Editor with Line Numbers Component
const CodeTextareaWithLineNumbers = ({ value, onChange, onBlur, placeholder, language = 'typescript', className = '' }) => {
  const lines = value.split('\n')
  const lineCount = lines.length
  const visibleLines = 8 // Show exactly 8 lines in preview
  const lineHeight = 24 // 1.5rem = 24px
  const containerHeight = visibleLines * lineHeight + 24 // 24px for padding
  const lineNumbersRef = useRef(null)
  const textareaRef = useRef(null)
  const previewRef = useRef(null)
  const [isEditing, setIsEditing] = useState(false)

  // Language mapping for Prism.js compatibility
  const languageMap = {
    'typescript': 'typescript',
    'javascript': 'javascript', 
    'jsx': 'jsx',
    'tsx': 'tsx',
    'html': 'markup',
    'css': 'css',
    'python': 'python'  // Keep original python language identifier
  }

  const prismLanguage = languageMap[language] || language

  // Ensure we always have at least 8 lines for display
  const displayValue = value || ''
  const paddedLines = displayValue.split('\n')
  while (paddedLines.length < visibleLines) {
    paddedLines.push('')
  }
  const paddedValue = paddedLines.join('\n')

  const handleScroll = (e) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.target.scrollTop
    }
    if (previewRef.current && !isEditing) {
      previewRef.current.scrollTop = e.target.scrollTop
    }
  }

  const handleFocus = () => setIsEditing(true)
  const handleBlur = (e) => {
    setIsEditing(false)
    onBlur?.(e)
  }

  return (
    <div className={`relative bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 border border-slate-700/50 rounded-md overflow-hidden ${className}`} style={{ height: `${containerHeight}px` }}>
      <div className="flex h-full">
        {/* Line Numbers */}
        <div 
          ref={lineNumbersRef}
          className="flex-shrink-0 bg-slate-800/50 px-3 py-3 text-right border-r border-slate-700/50 overflow-hidden" 
          style={{ width: '60px' }}
        >
          <div className="font-mono text-sm text-zinc-500" style={{ lineHeight: `${lineHeight}px` }}>
            {Array.from({ length: Math.max(paddedLines.length, visibleLines) }, (_, i) => (
              <div key={i + 1} className="select-none" style={{ height: `${lineHeight}px` }}>
                {i + 1}
              </div>
            ))}
          </div>
        </div>
        
        {/* Code Area - Toggle between textarea and syntax highlighted preview */}
        <div className="flex-1 relative overflow-hidden">
          {isEditing ? (
            <Textarea
              ref={textareaRef}
              value={value}
              onChange={onChange}
              onBlur={handleBlur}
              onScroll={handleScroll}
              placeholder={placeholder}
              className="font-mono text-sm bg-transparent border-0 text-white placeholder:text-zinc-400 resize-none p-3 focus:ring-0 focus:outline-none w-full h-full overflow-y-auto"
              style={{
                background: 'transparent',
                lineHeight: `${lineHeight}px`
              }}
              autoFocus
            />
          ) : (
            <div 
              ref={previewRef}
              className="w-full h-full overflow-y-auto p-3 cursor-text"
              onClick={handleFocus}
              style={{ lineHeight: `${lineHeight}px` }}
            >
              {paddedValue ? (
                <SyntaxHighlighter
                  language={prismLanguage}
                  style={atomDark}
                  customStyle={{
                    margin: 0,
                    padding: 0,
                    background: "transparent",
                    fontSize: "0.875rem",
                    lineHeight: `${lineHeight}px`
                  }}
                  wrapLines={false}
                  showLineNumbers={false}
                  lineProps={(lineNumber) => ({
                    style: {
                      display: "block",
                      width: "100%",
                      minHeight: `${lineHeight}px`
                    },
                  })}
                  PreTag="div"
                >
                  {String(paddedValue)}
                </SyntaxHighlighter>
              ) : (
                <div className="text-zinc-400 font-mono text-sm" style={{ lineHeight: `${lineHeight}px` }}>
                  {Array.from({ length: visibleLines }, (_, i) => (
                    <div key={i} style={{ height: `${lineHeight}px` }}>
                      {i === 0 ? placeholder : ''}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EditableText } from '@/components/ui/editable-text'

// Import view components
import { BentoGridItem } from '@/components/ui/bento-grid-item'
import { CometCard } from '@/components/ui/comet-card'
import { CodeBlock } from '@/components/ui/code-block'
import { GitHubRepoView } from './ui/github-repo-view'
import { GitHubShowcase } from './ui/github-showcase'
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

export type ViewMode = 'text' | 'code' | 'github-showcase' | 'uri' | 'video' | 'tweet' | 'multi-images' | 'compare' | 'education'
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
  defaultSettingsOpen?: boolean // Whether to open settings panel by default
  disableHoverEffects?: boolean // Disable card hover effects for certain layouts
  supportsTextVariant?: boolean // Auto-detected if not provided
  onIconClick?: () => void // Handler for when icon is clicked
}

const viewModeOptions = [
  { value: 'text', label: 'Text View', icon: FileText },
  { value: 'multi-images', label: 'Image / Multiple Images', icon: Image },
  { value: 'compare', label: 'Before/After', icon: BarChart3 },
  { value: 'code', label: 'Code Visualizer', icon: Code },
  { value: 'github-showcase', label: 'GitHub Showcase', icon: Star },
  { value: 'uri', label: 'Link Preview', icon: Link },
  { value: 'video', label: 'Video Player', icon: Video },
  { value: 'tweet', label: 'Tweet Card', icon: Twitter },
  { value: 'education', label: 'Education View', icon: GraduationCap },
]

export function SmartCard({ item, children, className, onUpdate, onDelete, showIconEditor = true, defaultSettingsOpen = false, disableHoverEffects = false, supportsTextVariant, onIconClick }: SmartCardProps) {
  const { isEditMode, isEditAllowed } = useEditMode()
  
  // Safety check - if not in edit mode, disable all edit functionality
  const safeOnUpdate = isEditAllowed('SmartCard') ? onUpdate : undefined
  const safeOnDelete = isEditAllowed('SmartCard') ? onDelete : undefined
  const safeShowIconEditor = isEditAllowed('SmartCard') ? showIconEditor : false
  const [viewMode, setViewMode] = useState<ViewMode>(item.viewMode || 'text')
  const [sheetOpen, setSheetOpen] = useState(defaultSettingsOpen)
  const [images, setImages] = useState<string[]>(item.images || [])
  const [codeContent, setCodeContent] = useState(item.codeSnippet || '\n'.repeat(7))
  const [codeLanguage, setCodeLanguage] = useState(item.codeLanguage || 'typescript')
  const [codeTabs, setCodeTabs] = useState<CodeTab[]>(item.codeTabs || [])
  const [activeCodeTab, setActiveCodeTab] = useState(0)
  const [textVariant, setTextVariant] = useState<TextVariant>(item.textVariant || 'detailed')
  const [githubUrl, setGithubUrl] = useState(item.githubUrl || '')
  const [githubTheme, setGithubTheme] = useState(item.githubTheme || 'light')
  const [videoUrl, setVideoUrl] = useState(item.videoUrl || '')
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState('')
  const [uploadedVideoName, setUploadedVideoName] = useState('')
  const [uploadedVideoFile, setUploadedVideoFile] = useState<File | null>(null)
  const [isUploadingVideo, setIsUploadingVideo] = useState(false)
  const [videoBlobUrl, setVideoBlobUrl] = useState<string | null>(null)
  const [linkUrl, setLinkUrl] = useState(item.linkUrl || '')

  const [tweetUrl, setTweetUrl] = useState(item.tweetUrl || '')
  const [multiImages, setMultiImages] = useState<string[]>(item.multiImages || [])
  const [compareImages, setCompareImages] = useState<string[]>(item.compareImages || [])
  const [isEditingImage, setIsEditingImage] = useState(false)
  const [imageTransform, setImageTransform] = useState<ImageTransform>(
    item.imageTransform || { crop: { x: 0, y: 0 }, zoom: 1, rotation: 0 }
  )
  const [collapsedSections, setCollapsedSections] = useState<{[key: string]: boolean}>({
    display: false,
    icon: true
  })

  // Handle icon click to open settings on Icon tab
  const handleIconClick = () => {
    setSheetOpen(true)
    // Open Icon Settings section, close Display Mode section
    setCollapsedSections(prev => ({
      ...prev,
      display: true,
      icon: false
    }))
    if (onIconClick) {
      onIconClick()
    }
  }

  // Clone children and pass down the icon click handler
  const enhancedChildren = React.isValidElement(children) && children.type === 'div' 
    ? React.cloneElement(children, {
        children: React.Children.map(children.props?.children, (child) => {
          // If child is BentoGridItem, add onIconClick prop
          if (React.isValidElement(child) && (child.type as any)?.displayName === 'BentoGridItem') {
            return React.cloneElement(child, { onIconClick: handleIconClick } as any)
          }
          return child
        })
      })
    : children


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
    setCodeContent(item.codeSnippet || '\n'.repeat(7))
    setCodeLanguage(item.codeLanguage || 'typescript')
    setCodeTabs((item.codeTabs || []).map(tab => ({
      ...tab,
      code: tab.code || '\n'.repeat(7) // Ensure existing tabs also start with 8 lines if empty
    })))
    setTextVariant(item.textVariant || 'detailed')
    setGithubUrl(item.githubUrl || '')
    setGithubTheme(item.githubTheme || 'light')
    // Don't set the URL input if there's an uploaded video
    if (!item.uploadedVideoUrl) {
      setVideoUrl(item.videoUrl || '')
    }
    // Handle uploaded video restoration from data URL
    if (item.uploadedVideoUrl && item.uploadedVideoUrl !== 'uploaded') {
      console.log('🎬 Restoring video from data URL:', item.uploadedVideoName)
      setUploadedVideoUrl(item.uploadedVideoUrl) // This is now a data URL
      setUploadedVideoName(item.uploadedVideoName || 'Uploaded video')
      // We don't set uploadedVideoFile here as we'll use the data URL directly
    }
    setLinkUrl(item.linkUrl || '')
    setTweetUrl(item.tweetUrl || '')
    setMultiImages(item.multiImages || [])
    setCompareImages(item.compareImages || [])
    setImageTransform(item.imageTransform || { crop: { x: 0, y: 0 }, zoom: 1, rotation: 0 })
  }, [item])

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode)
    onUpdate?.('viewMode', mode)
    
    // Auto-populate URLs with defaults when switching modes if empty
    if (mode === 'github-showcase' && !githubUrl) {
      const defaultUrl = 'https://github.com/Reefnaaman/v0_template_v1.5'
      setGithubUrl(defaultUrl)
      onUpdate?.('githubUrl', defaultUrl)
    }
    if (mode === 'video' && !videoUrl) {
      const defaultUrl = 'https://www.youtube.com/watch?v=SGLhrRCBu-s'
      setVideoUrl(defaultUrl)
      onUpdate?.('videoUrl', defaultUrl)
    }
    if (mode === 'uri' && !linkUrl) {
      const defaultUrl = 'https://www.dreamsjournal.app/blog'
      setLinkUrl(defaultUrl)
      onUpdate?.('linkUrl', defaultUrl)
    }
    if (mode === 'tweet' && !tweetUrl) {
      const defaultUrl = 'https://x.com/0x_Reef/status/1956757731957780758'
      setTweetUrl(defaultUrl)
      onUpdate?.('tweetUrl', defaultUrl)
    }
  }
  
  const renderContent = () => {
    switch (viewMode) {
      case 'text':
        return (
          <div className="relative h-full overflow-hidden">
            {enhancedChildren}
          </div>
        )

      case 'code':
        return (
          <div className="relative h-full w-full">
            {(codeTabs.length > 0 || codeContent) ? (
              <div className={cn(
                "bg-card/95 backdrop-blur-sm rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 origin-center h-full flex flex-col",
                isEditMode && "border-2 border-dashed border-accent p-1"
              )}>
                {/* Title section with buttons */}
                <div className="px-6 py-6 bg-muted rounded-t-2xl border-b border-border flex-shrink-0 min-h-[80px] flex items-center justify-between gap-4">
                  {/* Title area - max 3/4 width */}
                  <div className="flex-1 max-w-[75%]">
                    <EditableText
                      as="h3"
                      className="text-lg font-semibold text-foreground leading-tight w-full truncate"
                      initialValue={item.title || "Add title..."}
                      onSave={(value) => onUpdate?.('title', value)}
                      placeholder="Add title..."
                    />
                  </div>
                  {/* Buttons area - 1/4 width */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-background/50"
                          title="Expand code"
                        >
                          <Maximize2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-[85vw] w-full aspect-video p-0 rounded-xl border-0 shadow-2xl bg-slate-900/95 backdrop-blur-sm">
                        <DialogTitle className="sr-only">Code Block</DialogTitle>
                        {item.description && item.description.trim() ? (
                          <div className="w-full h-full rounded-xl overflow-hidden flex">
                            {/* Left Panel: Title and Description - Theme-aware glassmorphism */}
                            <div className="w-[30%] bg-background/80 dark:bg-background/85 backdrop-blur-2xl border border-border/30 p-10 flex flex-col rounded-l-xl shadow-2xl">
                              <div className="flex-shrink-0 mb-8">
                                <h2 className="text-4xl font-semibold text-foreground mb-6 leading-[1.2] tracking-[-0.01em] font-system">
                                  {item.title || "Code Block"}
                                </h2>
                              </div>
                              <div className="flex-1 overflow-y-auto">
                                <p className="text-foreground/80 leading-[1.6] text-xl font-system font-normal">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                            {/* Right Panel: Code Content - Full size */}
                            <div className="w-[70%] rounded-r-xl overflow-hidden p-6">
                              {codeTabs.length > 0 ? (
                                <Tabs value={activeCodeTab.toString()} onValueChange={(v) => setActiveCodeTab(parseInt(v))} className="flex flex-col h-full">
                                  <TabsList className="flex w-full gap-1 bg-slate-100 dark:bg-slate-800 h-auto justify-start p-1 rounded-t-lg">
                                    {codeTabs.map((tab, index) => (
                                      <TabsTrigger 
                                        key={index} 
                                        value={index.toString()}
                                        className="px-3 py-1.5 text-xs font-medium bg-slate-50 border border-slate-200 hover:bg-slate-200 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm data-[state=active]:border-slate-300 data-[state=inactive]:text-slate-600 dark:bg-slate-700 dark:border-slate-600 dark:hover:bg-slate-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-white dark:data-[state=active]:border-slate-500 dark:data-[state=inactive]:text-slate-400 rounded-md transition-all duration-200 cursor-pointer"
                                      >
                                        {tab.name}
                                      </TabsTrigger>
                                    ))}
                                  </TabsList>
                                  {codeTabs.map((tab, index) => (
                                    <TabsContent key={index} value={index.toString()} className="m-0 p-0 flex-1 overflow-y-auto">
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
                                <div className="h-full overflow-y-auto">
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
                          <div className="w-full h-full rounded-xl overflow-hidden p-6">
                            {codeTabs.length > 0 ? (
                              <Tabs value={activeCodeTab.toString()} onValueChange={(v) => setActiveCodeTab(parseInt(v))} className="flex flex-col h-full">
                                <TabsList className="flex w-full gap-1 bg-slate-100 dark:bg-slate-800 h-auto justify-start p-1 rounded-t-lg">
                                  {codeTabs.map((tab, index) => (
                                    <TabsTrigger 
                                      key={index} 
                                      value={index.toString()}
                                      className="px-3 py-1.5 text-xs font-medium bg-slate-50 border border-slate-200 hover:bg-slate-200 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm data-[state=active]:border-slate-300 data-[state=inactive]:text-slate-600 dark:bg-slate-700 dark:border-slate-600 dark:hover:bg-slate-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-white dark:data-[state=active]:border-slate-500 dark:data-[state=inactive]:text-slate-400 rounded-md transition-all duration-200 cursor-pointer"
                                    >
                                      {tab.name}
                                    </TabsTrigger>
                                  ))}
                                </TabsList>
                                {codeTabs.map((tab, index) => (
                                  <TabsContent key={index} value={index.toString()} className="m-0 p-0 flex-1 overflow-y-auto">
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
                              <div className="h-full overflow-y-auto">
                                <CodeBlock
                                  language={codeLanguage}
                                  code={codeContent}
                                  filename={item.title || 'code.tsx'}
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                {/* Code content with rounded bottom corners */}
                <div className="flex-1 overflow-hidden rounded-b-2xl">
                  {codeTabs.length > 0 ? (
                    <Tabs value={activeCodeTab.toString()} onValueChange={(v) => setActiveCodeTab(parseInt(v))} className="flex flex-col">
                      <TabsList className="flex w-full gap-1 bg-slate-100 dark:bg-slate-800 h-auto justify-start p-1 rounded-t-lg">
                        {codeTabs.map((tab, index) => (
                          <TabsTrigger 
                            key={index} 
                            value={index.toString()}
                            className="px-3 py-1.5 text-xs font-medium bg-slate-50 border border-slate-200 hover:bg-slate-200 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm data-[state=active]:border-slate-300 data-[state=inactive]:text-slate-600 dark:bg-slate-700 dark:border-slate-600 dark:hover:bg-slate-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:text-white dark:data-[state=active]:border-slate-500 dark:data-[state=inactive]:text-slate-400 rounded-md transition-all duration-200 cursor-pointer"
                          >
                            {tab.name}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                      {codeTabs.map((tab, index) => (
                        <TabsContent key={index} value={index.toString()} className="m-0 p-0 max-h-80 overflow-y-auto">
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
                    <div className="p-0 max-h-80 overflow-y-auto">
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
                <div className="text-center text-muted-foreground">
                  <Code className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Click settings to add code</p>
                </div>
              </div>
            )}
          </div>
        )
        
      case 'github-showcase':
        return (
          <div className="relative h-full w-full">
            {githubUrl ? (
              <div className={cn(
                "bg-card/95 backdrop-blur-sm rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 origin-center h-full flex flex-col",
                isEditMode && "border-2 border-dashed border-accent p-1"
              )}>
                {/* Title section with buttons */}
                <div className="px-6 py-6 bg-muted rounded-t-2xl border-b border-border flex-shrink-0 min-h-[80px] flex items-center justify-between gap-4">
                  {/* Title area - max 3/4 width */}
                  <div className="flex-1 max-w-[75%]">
                    <EditableText
                      as="h3"
                      className="text-lg font-semibold text-foreground leading-tight w-full truncate"
                      initialValue={item.title || "Add title..."}
                      onSave={(value) => onUpdate?.('title', value)}
                      placeholder="Add title..."
                    />
                  </div>
                  {/* Buttons area - 1/4 width */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-background/50"
                          title="Expand GitHub repository"
                        >
                          <Maximize2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-[85vw] w-full aspect-video p-0 rounded-xl border-0 shadow-2xl bg-slate-900/95 backdrop-blur-sm">
                        <DialogTitle className="sr-only">GitHub Repository</DialogTitle>
                        {item.description && item.description.trim() ? (
                          <div className="w-full h-full rounded-xl overflow-hidden flex">
                            {/* Left Panel: Title and Description - Theme-aware glassmorphism */}
                            <div className="w-[30%] bg-background/80 dark:bg-background/85 backdrop-blur-2xl border border-border/30 p-10 flex flex-col rounded-l-xl shadow-2xl">
                              <div className="flex-shrink-0 mb-8">
                                <h2 className="text-4xl font-semibold text-foreground mb-6 leading-[1.2] tracking-[-0.01em] font-system">
                                  {item.title || "GitHub Repository"}
                                </h2>
                              </div>
                              <div className="flex-1 overflow-y-auto">
                                <p className="text-foreground/80 leading-[1.6] text-xl font-system font-normal">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                            {/* Right Panel: GitHub Repository - Full size */}
                            <div className="w-[70%] rounded-r-xl overflow-hidden">
                              <GitHubRepoView url={githubUrl} className="w-full h-full" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-full rounded-xl overflow-hidden">
                            <GitHubRepoView url={githubUrl} className="w-full h-full" />
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-background/50"
                      title="Open in GitHub"
                      onClick={() => window.open(githubUrl, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {/* GitHub showcase with rounded bottom corners */}
                <div className="flex-1 overflow-hidden rounded-b-2xl">
                  <GitHubShowcase url={githubUrl} className="w-full h-full" theme={githubTheme} />
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Star className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Click settings to add GitHub repo</p>
                </div>
              </div>
            )}
          </div>
        )

      case 'video':
        return (
          <div className="relative h-full w-full">
            {(() => {
              const hasVideo = uploadedVideoFile || uploadedVideoUrl || (videoUrl && videoUrl.trim() !== '')
              console.log('🎬 VIDEO CASE EVALUATION:', { 
                uploadedVideoFile: !!uploadedVideoFile, 
                uploadedVideoFileName: uploadedVideoFile?.name,
                uploadedVideoUrl: uploadedVideoUrl ? 'exists (length: ' + uploadedVideoUrl.length + ')' : 'none',
                videoUrl: videoUrl, 
                hasVideo: !!hasVideo,
                displayMode: item.displayMode,
                isEditMode: isEditMode,
                itemUploadedVideoUrl: item.uploadedVideoUrl ? 'exists (length: ' + item.uploadedVideoUrl.length + ')' : 'none'
              })
              return hasVideo ? (
              <div className={cn(
                "bg-card/95 backdrop-blur-sm rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 origin-center h-full flex flex-col",
                isEditMode && "border-2 border-dashed border-accent p-1"
              )}>
                {/* Title section with rounded top corners - fixed height */}
                <div className="px-6 py-6 bg-muted rounded-t-2xl border-b border-border flex-shrink-0 min-h-[80px] flex items-center justify-between gap-4">
                  {/* Title area - max 3/4 width */}
                  <div className="flex-1 max-w-[75%]">
                    <EditableText
                      as="h3"
                      className="text-lg font-semibold text-foreground leading-tight w-full truncate"
                      initialValue={item.title || "Add title..."}
                      onSave={(value) => onUpdate?.('title', value)}
                      placeholder="Add title..."
                    />
                  </div>
                  {/* Buttons area - 1/4 width */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-background/50"
                          title="Expand video"
                        >
                          <Maximize2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-[85vw] w-full aspect-video p-0 rounded-xl border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
                        <DialogTitle className="sr-only">Video Player</DialogTitle>
                        {/* Two-panel layout if description exists, otherwise full video */}
                        {item.description && item.description.trim() ? (
                          <div className="w-full h-full rounded-xl overflow-hidden flex">
                            {/* Left Panel: Title and Description - Theme-aware glassmorphism */}
                            <div className="w-[30%] bg-background/80 dark:bg-background/85 backdrop-blur-2xl border border-border/30 p-10 flex flex-col rounded-l-xl shadow-2xl">
                              <div className="flex-shrink-0 mb-8">
                                <h2 className="text-4xl font-semibold text-foreground mb-6 leading-[1.2] tracking-[-0.01em] font-system">
                                  {item.title || "Video Title"}
                                </h2>
                              </div>
                              <div className="flex-1 overflow-y-auto">
                                <p className="text-foreground/80 leading-[1.6] text-xl font-system font-normal">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                            {/* Right Panel: Video - Full size with proper aspect ratio */}
                            <div className="w-[70%] bg-black flex items-center justify-center">
                              <div className="w-full aspect-video max-h-full">
                                {uploadedVideoUrl ? (
                                  <video
                                    controls
                                    className="w-full h-full object-cover"
                                    src={uploadedVideoUrl}
                                  />
                                ) : videoUrl ? (
                                  <VideoPlayer url={videoUrl} className="w-full h-full" />
                                ) : null}
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* Full-screen video when no description */
                          <div className="w-full h-full rounded-xl overflow-hidden">
                            {uploadedVideoUrl ? (
                              <video
                                controls
                                className="w-full h-full object-cover"
                                src={uploadedVideoUrl}
                              />
                            ) : videoUrl ? (
                              <VideoPlayer url={videoUrl} className="w-full h-full" />
                            ) : null}
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-background/50"
                      title="Open in new tab"
                      onClick={() => {
                        if (uploadedVideoFile) {
                          // For uploaded files, we can't open in a new tab, but we could download
                          console.log('Cannot open uploaded video in new tab')
                        } else {
                          window.open(videoUrl, '_blank')
                        }
                      }}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {/* Video container with rounded bottom corners */}
                <div className="relative w-full flex-1 bg-background rounded-b-2xl overflow-hidden">
                  {uploadedVideoUrl ? (
                    (() => {
                      console.log('🎬 MAIN CARD: Rendering restored video (Data URL)')
                      return (
                        <video
                          controls
                          className="w-full h-full object-cover"
                          src={uploadedVideoUrl}
                          onLoadStart={() => console.log('🎬 MAIN CARD: Video load started (Data URL)')}
                          onLoadedData={() => console.log('🎬 MAIN CARD: Video loaded successfully (Data URL)')}
                          onError={(e) => console.log('🎬 MAIN CARD: Video error (Data URL):', e.currentTarget.error?.message)}
                        />
                      )
                    })()
                  ) : videoUrl ? (
                    <VideoPlayer url={videoUrl} className="absolute inset-0" />
                  ) : null}
                </div>
              </div>
              ) : (
                <div className={cn(
                  "bg-card/95 backdrop-blur-sm rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 origin-center h-full flex flex-col",
                  isEditMode && "border-2 border-dashed border-accent p-1"
                )}>
                  {/* Title section with rounded top corners - fixed height */}
                  <div className="px-6 py-6 bg-muted rounded-t-2xl border-b border-border flex-shrink-0 min-h-[80px] flex items-center justify-between gap-4">
                    <div className="flex-1 max-w-[75%]">
                      <EditableText
                        as="h3"
                        className="text-lg font-semibold text-foreground leading-tight w-full truncate"
                        initialValue={item.title || "Add title..."}
                        onSave={(value) => onUpdate?.('title', value)}
                        placeholder="Add title..."
                      />
                    </div>
                  </div>
                  {/* Empty video container */}
                  <div className="relative w-full flex-1 bg-background rounded-b-2xl overflow-hidden">
                    <div className="flex h-full items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <Video className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">Click settings to add video</p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })()}
          </div>
        )

      case 'uri':
        return (
          <div className="relative h-full w-full">
            {linkUrl ? (
              <div className={cn(
                "bg-card/95 backdrop-blur-sm rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 origin-center h-full flex flex-col",
                isEditMode && "border-2 border-dashed border-accent p-1"
              )}>
                {/* Title section with buttons */}
                <div className="px-6 py-6 bg-muted rounded-t-2xl border-b border-border flex-shrink-0 min-h-[80px] flex items-center justify-between gap-4">
                  {/* Title area - max 3/4 width */}
                  <div className="flex-1 max-w-[75%]">
                    <EditableText
                      as="h3"
                      className="text-lg font-semibold text-foreground leading-tight w-full truncate"
                      initialValue={item.title || "Add title..."}
                      onSave={(value) => onUpdate?.('title', value)}
                      placeholder="Add title..."
                    />
                  </div>
                  {/* Buttons area - 1/4 width */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-background/50"
                          title="Expand link preview"
                        >
                          <Maximize2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-[85vw] w-full aspect-video p-0 rounded-xl border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
                        <DialogTitle className="sr-only">Link Preview</DialogTitle>
                        {item.description && item.description.trim() ? (
                          <div className="w-full h-full rounded-xl overflow-hidden flex">
                            {/* Left Panel: Title and Description - Theme-aware glassmorphism */}
                            <div className="w-[30%] bg-background/80 dark:bg-background/85 backdrop-blur-2xl border border-border/30 p-10 flex flex-col rounded-l-xl shadow-2xl">
                              <div className="flex-shrink-0 mb-8">
                                <h2 className="text-4xl font-semibold text-foreground mb-6 leading-[1.2] tracking-[-0.01em] font-system">
                                  {item.title || "Link Preview"}
                                </h2>
                              </div>
                              <div className="flex-1 overflow-y-auto">
                                <p className="text-foreground/80 leading-[1.6] text-xl font-system font-normal">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                            {/* Right Panel: Link Preview - Full size */}
                            <div className="w-[70%] rounded-r-xl overflow-hidden">
                              <LinkPreview url={linkUrl} className="w-full h-full" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-full rounded-xl overflow-hidden">
                            <LinkPreview url={linkUrl} className="w-full h-full" />
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-background/50"
                      title="Open in new tab"
                      onClick={() => window.open(linkUrl, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {/* Link preview iframe */}
                <div className="flex-1 bg-background rounded-b-2xl overflow-hidden">
                  <LinkPreview url={linkUrl} className="w-full h-full" />
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="text-center text-muted-foreground">
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
            {tweetUrl ? (
              <div className={cn(
                "bg-card/95 backdrop-blur-sm rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 origin-center h-full flex flex-col",
                isEditMode && "border-2 border-dashed border-accent p-1"
              )}>
                {/* Title section with buttons */}
                <div className="px-6 py-6 bg-muted rounded-t-2xl border-b border-border flex-shrink-0 min-h-[80px] flex items-center justify-between gap-4">
                  {/* Title area - max 3/4 width */}
                  <div className="flex-1 max-w-[75%]">
                    <EditableText
                      as="h3"
                      className="text-lg font-semibold text-foreground leading-tight w-full truncate"
                      initialValue={item.title || "Add title..."}
                      onSave={(value) => onUpdate?.('title', value)}
                      placeholder="Add title..."
                    />
                  </div>
                  {/* Buttons area - 1/4 width */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-background/50"
                          title="Expand tweet"
                        >
                          <Maximize2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-[600px] w-full aspect-[9/16] p-0 rounded-xl border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
                        <DialogTitle className="sr-only">Tweet</DialogTitle>
                        <div className="w-full h-full rounded-xl overflow-hidden p-6 flex items-center justify-center">
                          <ClientTweetCard 
                            id={(() => {
                              // Extract tweet ID from URL
                              const tweetIdMatch = tweetUrl.match(/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/i)
                              return tweetIdMatch ? tweetIdMatch[1] : ''
                            })()} 
                            className="w-full max-w-md" 
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-background/50"
                      title="Open on X"
                      onClick={() => window.open(tweetUrl, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {/* Tweet embed with rounded bottom corners */}
                <div className="flex-1 p-6 bg-background rounded-b-2xl overflow-hidden">
                  <ClientTweetCard 
                    id={(() => {
                      // Extract tweet ID from URL
                      const tweetIdMatch = tweetUrl.match(/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/i)
                      return tweetIdMatch ? tweetIdMatch[1] : ''
                    })()} 
                    className="w-full" 
                  />
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="text-center text-muted-foreground">
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
              <div className={cn(
                "bg-card/95 backdrop-blur-sm rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 origin-center h-full flex flex-col",
                isEditMode && "border-2 border-dashed border-accent p-1"
              )}>
                {/* Title section with buttons */}
                <div className="px-6 py-6 bg-muted rounded-t-2xl border-b border-border flex-shrink-0 min-h-[80px] flex items-center justify-between gap-4">
                  {/* Title area - max 3/4 width */}
                  <div className="flex-1 max-w-[75%]">
                    <EditableText
                      as="h3"
                      className="text-lg font-semibold text-foreground leading-tight w-full truncate"
                      initialValue={item.title || "Add title..."}
                      onSave={(value) => onUpdate?.('title', value)}
                      placeholder="Add title..."
                    />
                  </div>
                  {/* Buttons area - 1/4 width */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-background/50"
                          title="Expand images"
                        >
                          <Maximize2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-[85vw] w-full aspect-video p-0 rounded-xl border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
                        <DialogTitle className="sr-only">Image Gallery</DialogTitle>
                        {/* Two-panel layout if description exists, otherwise full gallery */}
                        {item.description && item.description.trim() ? (
                          <div className="w-full h-full rounded-xl overflow-hidden flex">
                            {/* Left Panel: Title and Description - Theme-aware glassmorphism */}
                            <div className="w-[30%] bg-background/80 dark:bg-background/85 backdrop-blur-2xl border border-border/30 p-10 flex flex-col rounded-l-xl shadow-2xl">
                              <div className="flex-shrink-0 mb-8">
                                <h2 className="text-4xl font-semibold text-foreground mb-6 leading-[1.2] tracking-[-0.01em] font-system">
                                  {item.title || "Image Gallery"}
                                </h2>
                              </div>
                              <div className="flex-1 overflow-y-auto">
                                <p className="text-foreground/80 leading-[1.6] text-xl font-system font-normal">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                            {/* Right Panel: Image Gallery - Full size */}
                            <div className="w-[70%] bg-black flex items-center justify-center">
                              <ImageCarousel images={multiImages} className="w-full h-full" />
                            </div>
                          </div>
                        ) : (
                          /* Full-screen gallery when no description */
                          <div className="w-full h-full rounded-xl overflow-hidden">
                            <ImageCarousel images={multiImages} className="w-full h-full" />
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                {/* Image carousel with rounded bottom corners */}
                <div className="relative w-full flex-1 bg-background rounded-b-2xl overflow-hidden">
                  <ImageCarousel images={multiImages} className="w-full h-full" />
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="text-center text-muted-foreground">
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
              <div className={cn(
                "bg-card/95 backdrop-blur-sm rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 origin-center h-full flex flex-col",
                isEditMode && "border-2 border-dashed border-accent p-1"
              )}>
                {/* Title section with buttons */}
                <div className="px-6 py-6 bg-muted rounded-t-2xl border-b border-border flex-shrink-0 min-h-[80px] flex items-center justify-between gap-4">
                  {/* Title area - max 3/4 width */}
                  <div className="flex-1 max-w-[75%]">
                    <EditableText
                      as="h3"
                      className="text-lg font-semibold text-foreground leading-tight w-full truncate"
                      initialValue={item.title || "Add title..."}
                      onSave={(value) => onUpdate?.('title', value)}
                      placeholder="Add title..."
                    />
                  </div>
                  {/* Buttons area - 1/4 width */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-background/50"
                          title="Expand comparison"
                        >
                          <Maximize2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-[85vw] w-full aspect-video p-0 rounded-xl border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
                        <DialogTitle className="sr-only">Before/After Comparison</DialogTitle>
                        {/* Two-panel layout if description exists, otherwise full comparison */}
                        {item.description && item.description.trim() ? (
                          <div className="w-full h-full rounded-xl overflow-hidden flex">
                            {/* Left Panel: Title and Description - Theme-aware glassmorphism */}
                            <div className="w-[30%] bg-background/80 dark:bg-background/85 backdrop-blur-2xl border border-border/30 p-10 flex flex-col rounded-l-xl shadow-2xl">
                              <div className="flex-shrink-0 mb-8">
                                <h2 className="text-4xl font-semibold text-foreground mb-6 leading-[1.2] tracking-[-0.01em] font-system">
                                  {item.title || "Before/After"}
                                </h2>
                              </div>
                              <div className="flex-1 overflow-y-auto">
                                <p className="text-foreground/80 leading-[1.6] text-xl font-system font-normal">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                            {/* Right Panel: Comparison - Full size */}
                            <div className="w-[70%] bg-black flex items-center justify-center">
                              <Compare
                                firstImage={compareImages[0]}
                                secondImage={compareImages[1]}
                                firstImageClassName="object-cover"
                                secondImageClassname="object-cover"
                                className="w-full h-full"
                                slideMode="drag"
                              />
                            </div>
                          </div>
                        ) : (
                          /* Full-screen comparison when no description */
                          <div className="w-full h-full rounded-xl overflow-hidden">
                            <Compare
                              firstImage={compareImages[0]}
                              secondImage={compareImages[1]}
                              firstImageClassName="object-cover"
                              secondImageClassname="object-cover"
                              className="w-full h-full"
                              slideMode="drag"
                            />
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                {/* Comparison view with rounded bottom corners */}
                <div className="relative w-full flex-1 bg-background rounded-b-2xl overflow-hidden">
                  <Compare
                    firstImage={compareImages[0]}
                    secondImage={compareImages[1]}
                    firstImageClassName="object-cover"
                    secondImageClassname="object-cover"
                    className="w-full h-full"
                    slideMode="drag"
                  />
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Click settings to add images</p>
                </div>
              </div>
            )}
          </div>
        )

      case 'education':
        const isLeftTimeline = item.timelinePosition?.side === 'left'
        const isRightTimeline = item.timelinePosition?.side === 'right'
        
        return (
          <div className="relative h-full overflow-hidden">
            {/* EXACT match to original VerticalTimeline card design */}
            <div className="bg-card p-6 sm:p-8 rounded-xl border-2 border-accent shadow-lg relative group h-full">
              <div className="space-y-4 h-full flex flex-col">
                {/* Top section: Text + Image */}
                <div className={cn("flex gap-6", isLeftTimeline ? "flex-row" : "flex-row-reverse")}>
                  {/* Text content - always left-aligned regardless of timeline side */}
                  <div className="flex-1 space-y-2 text-left">
                  <EditableText
                    as="h3"
                    className="font-serif text-lg sm:text-2xl font-bold text-card-foreground text-left"
                    initialValue={item.title || item.institution || "Add institution..."}
                    onSave={(value) => onUpdate?.('institution', value)}
                    placeholder="Add institution..."
                    isEditMode={isEditMode}
                  />
                  <EditableText
                    as="h4"
                    className="font-sans text-base sm:text-lg font-semibold text-card-foreground/90 mt-1 text-left"
                    initialValue={item.degree || "Add degree..."}
                    onSave={(value) => onUpdate?.('degree', value)}
                    placeholder="Add degree..."
                    isEditMode={isEditMode}
                  />
                  <EditableText
                    as="p"
                    className="font-sans text-base text-muted-foreground my-2 text-left"
                    initialValue={item.years || "Add years..."}
                    onSave={(value) => onUpdate?.('years', value)}
                    placeholder="Add years..."
                    isEditMode={isEditMode}
                  />
                  <div className="mt-3">
                    <EditableText
                      as="p"
                      className="font-sans text-muted-foreground text-sm sm:text-base leading-relaxed text-left"
                      initialValue={item.description || "Add description..."}
                      onSave={(value) => onUpdate?.('description', value)}
                      placeholder="Add description..."
                      isEditMode={isEditMode}
                    />
                  </div>
                </div>
                
                {/* Image alongside text - EXACT same as original timeline */}
                {item.imageUrl && (
                  <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0">
                    <div className="w-full h-full rounded-xl overflow-hidden shadow-lg border-2 border-accent/20">
                      <TransformedImage
                        src={item.imageUrl}
                        alt={item.imageAlt || "Education image"}
                        transform={item.imageTransform || { crop: { x: 0, y: 0 }, zoom: 1, rotation: 0 }}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              {/* Bottom section: Static buttons - full width, always left-aligned */}
              <div className="mt-4 space-y-2 text-left">
                {/* All buttons mixed together to fill line width - always start from left */}
                <div className="flex flex-wrap gap-2 justify-start">
                      {/* Relevant Coursework */}
                      {(item.relevantCoursework || []).map((course, idx) => (
                        <span
                          key={`course-${idx}`}
                          className="group/tech relative inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full backdrop-blur-md bg-gradient-to-r from-slate-100/10 via-slate-200/15 to-slate-100/10 border border-slate-400/20 text-foreground shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 hover:bg-gradient-to-r hover:from-slate-200/15 hover:via-slate-300/20 hover:to-slate-200/15"
                        >
                          <span className="text-slate-700 dark:text-slate-300 font-semibold">Coursework:</span>
                          <span>{course}</span>
                          {isEditMode && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="absolute inset-0 w-full h-full p-0 opacity-0 group-hover/tech:opacity-100 transition-opacity bg-red-500/90 hover:bg-red-600/90 text-white rounded-full flex items-center justify-center"
                              onClick={() => {
                                const newCourses = [...(item.relevantCoursework || [])]
                                newCourses.splice(idx, 1)
                                onUpdate?.('relevantCoursework', newCourses)
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </span>
                      ))}
                      
                      {/* Honors */}
                      {(item.honors || []).map((honor, idx) => (
                        <span
                          key={`honor-${idx}`}
                          className="group/tech relative inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full backdrop-blur-md bg-gradient-to-r from-amber-100/10 via-amber-200/15 to-amber-100/10 border border-amber-400/20 text-foreground shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 hover:bg-gradient-to-r hover:from-amber-200/15 hover:via-amber-300/20 hover:to-amber-200/15"
                        >
                          <span className="text-amber-700 dark:text-amber-300 font-semibold">Honor:</span>
                          <span>{honor}</span>
                          {isEditMode && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="absolute inset-0 w-full h-full p-0 opacity-0 group-hover/tech:opacity-100 transition-opacity bg-red-500/90 hover:bg-red-600/90 text-white rounded-full flex items-center justify-center"
                              onClick={() => {
                                const newHonors = [...(item.honors || [])]
                                newHonors.splice(idx, 1)
                                onUpdate?.('honors', newHonors)
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </span>
                      ))}
                      
                      {/* GPA */}
                      {item.gpa && (
                        <span
                          className="group/tech relative inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full backdrop-blur-md bg-gradient-to-r from-green-100/10 via-green-200/15 to-green-100/10 border border-green-400/20 text-foreground shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 hover:bg-gradient-to-r hover:from-green-200/15 hover:via-green-300/20 hover:to-green-200/15"
                        >
                          <span className="text-green-700 dark:text-green-300 font-semibold">GPA:</span>
                          <span>{item.gpa}</span>
                          {isEditMode && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="absolute inset-0 w-full h-full p-0 opacity-0 group-hover/tech:opacity-100 transition-opacity bg-red-500/90 hover:bg-red-600/90 text-white rounded-full flex items-center justify-center"
                              onClick={() => {
                                onUpdate?.('gpa', '')
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </span>
                      )}
                      
                      {/* Minors */}
                      {(item.minors || []).map((minor, idx) => (
                        <span
                          key={`minor-${idx}`}
                          className="group/tech relative inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full backdrop-blur-md bg-gradient-to-r from-purple-100/10 via-purple-200/15 to-purple-100/10 border border-purple-400/20 text-foreground shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 hover:bg-gradient-to-r hover:from-purple-200/15 hover:via-purple-300/20 hover:to-purple-200/15"
                        >
                          <span className="text-purple-700 dark:text-purple-300 font-semibold">Minor:</span>
                          <span>{minor}</span>
                          {isEditMode && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="absolute inset-0 w-full h-full p-0 opacity-0 group-hover/tech:opacity-100 transition-opacity bg-red-500/90 hover:bg-red-600/90 text-white rounded-full flex items-center justify-center"
                              onClick={() => {
                                const newMinors = [...(item.minors || [])]
                                newMinors.splice(idx, 1)
                                onUpdate?.('minors', newMinors)
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </span>
                      ))}
                      
                      {/* Exchange Programs */}
                      {(item.exchangePrograms || []).map((program, idx) => (
                        <span
                          key={`exchange-${idx}`}
                          className="group/tech relative inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full backdrop-blur-md bg-gradient-to-r from-blue-100/10 via-blue-200/15 to-blue-100/10 border border-blue-400/20 text-foreground shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-200/15 hover:via-blue-300/20 hover:to-blue-200/15"
                        >
                          <span className="text-blue-700 dark:text-blue-300 font-semibold">Exchange:</span>
                          <span>{program}</span>
                          {isEditMode && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="absolute inset-0 w-full h-full p-0 opacity-0 group-hover/tech:opacity-100 transition-opacity bg-red-500/90 hover:bg-red-600/90 text-white rounded-full flex items-center justify-center"
                              onClick={() => {
                                const newPrograms = [...(item.exchangePrograms || [])]
                                newPrograms.splice(idx, 1)
                                onUpdate?.('exchangePrograms', newPrograms)
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </span>
                      ))}
                      
                      {/* Edit mode input fields */}
                      {isEditMode && (
                        <>
                          <Input
                            type="text"
                            placeholder="Add coursework"
                            className="h-7 w-28 text-xs bg-white border-slate-300 rounded-full px-3"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && e.currentTarget.value) {
                                const newCourses = [...(item.relevantCoursework || []), e.currentTarget.value]
                                onUpdate?.('relevantCoursework', newCourses)
                                e.currentTarget.value = ''
                              }
                            }}
                          />
                          <Input
                            type="text"
                            placeholder="Add honor"
                            className="h-7 w-28 text-xs bg-white border-amber-300 rounded-full px-3"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && e.currentTarget.value) {
                                const newHonors = [...(item.honors || []), e.currentTarget.value]
                                onUpdate?.('honors', newHonors)
                                e.currentTarget.value = ''
                              }
                            }}
                          />
                          <Input
                            type="text"
                            placeholder="Add GPA"
                            className="h-7 w-24 text-xs bg-white border-green-300 rounded-full px-3"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && e.currentTarget.value) {
                                onUpdate?.('gpa', e.currentTarget.value)
                                e.currentTarget.value = ''
                              }
                            }}
                          />
                          <Input
                            type="text"
                            placeholder="Add minor"
                            className="h-7 w-28 text-xs bg-white border-purple-300 rounded-full px-3"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && e.currentTarget.value) {
                                const newMinors = [...(item.minors || []), e.currentTarget.value]
                                onUpdate?.('minors', newMinors)
                                e.currentTarget.value = ''
                              }
                            }}
                          />
                          <Input
                            type="text"
                            placeholder="Add exchange"
                            className="h-7 w-28 text-xs bg-white border-blue-300 rounded-full px-3"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && e.currentTarget.value) {
                                const newPrograms = [...(item.exchangePrograms || []), e.currentTarget.value]
                                onUpdate?.('exchangePrograms', newPrograms)
                                e.currentTarget.value = ''
                              }
                            }}
                          />
                        </>
                      )}
                    </div>
                </div>
              </div>
            </div>
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
            {enhancedChildren}
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
              icon: true
            })
          }
        }}>
          <SheetContent side="right" className="overflow-hidden flex flex-col w-[26rem] sm:w-[31rem]">
            <SheetHeader className="shrink-0">
              <SheetTitle className="text-lg font-semibold text-foreground">
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
                          <SelectTrigger className="rounded-xl border-border shadow-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-border">
                            {viewModeOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value} className="rounded-lg">
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

              {/* Dynamic content based on view mode */}

              {viewMode === 'code' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Code</Label>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={codeTabs.length >= 3}
                      onClick={() => {
                        if (codeTabs.length >= 3) return
                        const newTab: CodeTab = {
                          name: `file${codeTabs.length + 1}.tsx`,
                          code: '\n'.repeat(7), // 8 empty lines (7 newlines = 8 lines)
                          language: 'typescript'
                        }
                        const newTabs = [...codeTabs, newTab]
                        setCodeTabs(newTabs)
                        onUpdate?.('codeTabs', newTabs)
                      }}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      {codeTabs.length >= 3 ? 'Max Tabs' : 'Add Tab'}
                    </Button>
                  </div>
                  
                  {codeTabs.length > 0 ? (
                    <Tabs value={activeCodeTab.toString()} onValueChange={(v) => setActiveCodeTab(parseInt(v))} className="w-full">
                      <TabsList className="flex w-full gap-1 h-auto p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                        {codeTabs.map((tab, index) => (
                          <TabsTrigger 
                            key={index} 
                            value={index.toString()} 
                            className="text-xs px-3 py-2 rounded-md bg-slate-50 hover:bg-slate-200 border border-slate-200 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 dark:border-slate-600 dark:data-[state=active]:bg-slate-700 dark:data-[state=active]:border-slate-500 transition-all duration-200 flex items-center gap-2 group relative cursor-pointer"
                          >
                            <span>{tab.name}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                const newTabs = codeTabs.filter((_, i) => i !== index)
                                setCodeTabs(newTabs)
                                onUpdate?.('codeTabs', newTabs)
                                if (activeCodeTab >= newTabs.length) {
                                  setActiveCodeTab(Math.max(0, newTabs.length - 1))
                                }
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity w-4 h-4 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white text-xs ml-1"
                            >
                              <X className="h-2.5 w-2.5" />
                            </button>
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
                                newTabs[index] = { ...tab, name: e.target.value.slice(0, 30) }
                                setCodeTabs(newTabs)
                                onUpdate?.('codeTabs', newTabs)
                              }}
                              placeholder="filename.tsx"
                              className="flex-1"
                              maxLength={30}
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
                          </div>
                          <CodeTextareaWithLineNumbers
                            value={tab.code}
                            language={tab.language}
                            onChange={(e) => {
                              const newTabs = [...codeTabs]
                              newTabs[index] = { ...tab, code: e.target.value }
                              setCodeTabs(newTabs)
                              // No immediate onUpdate - only save when user moves away or saves manually
                            }}
                            onBlur={() => {
                              onUpdate?.('codeTabs', codeTabs)
                            }}
                            placeholder="Enter your code here..."
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
                      <CodeTextareaWithLineNumbers
                        value={codeContent}
                        language={codeLanguage}
                        onChange={(e) => {
                          setCodeContent(e.target.value)
                          // No immediate onUpdate - only save when user moves away
                        }}
                        onBlur={() => {
                          onUpdate?.('codeSnippet', codeContent)
                        }}
                        placeholder="Enter your code here..."
                      />
                    </div>
                  )}
                </div>
              )}

              {viewMode === 'github-showcase' && (
                <div className="space-y-3">
                  <Label>GitHub Repository URL</Label>
                  <div className="flex gap-3 items-center">
                    <div className="flex-1">
                      <Input
                        value={githubUrl}
                        onChange={(e) => {
                          setGithubUrl(e.target.value)
                          onUpdate?.('githubUrl', e.target.value)
                        }}
                        placeholder="https://github.com/Reefnaaman/v0_template_v1.5"
                        className="w-full"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2 bg-muted/30 rounded-lg p-2 border border-border/50">
                      <Sun className="w-4 h-4 text-yellow-500" />
                      <Switch
                        id="github-theme"
                        checked={githubTheme === 'dark'}
                        onCheckedChange={(checked) => {
                          const newTheme = checked ? 'dark' : 'light'
                          setGithubTheme(newTheme)
                          onUpdate?.('githubTheme', newTheme)
                        }}
                      />
                      <Moon className="w-4 h-4 text-blue-400" />
                    </div>
                  </div>
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
                      placeholder="YouTube, TikTok, Vimeo URL or direct video file"
                      disabled={!!uploadedVideoUrl}
                      className={uploadedVideoUrl ? 'opacity-50' : ''}
                    />
                    {uploadedVideoUrl && (
                      <p className="text-xs text-muted-foreground">
                        URL input disabled while using uploaded video
                      </p>
                    )}
                  </div>
                  
                  <div className="relative">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <span>OR</span>
                      <div className="flex-1 h-px bg-border"></div>
                    </div>
                    
                    <div className="flex gap-3">
                      {/* Left side - Upload button */}
                      <div className="flex-1">
                        <Label htmlFor="video-upload" className={uploadedVideoUrl ? 'pointer-events-none opacity-50' : 'cursor-pointer'}>
                          <div className="flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors border border-primary/20">
                            <Upload className="h-4 w-4" />
                            <span>Upload Video</span>
                          </div>
                        </Label>
                        <input
                          id="video-upload"
                          type="file"
                          accept="video/*"
                          className="hidden"
                          disabled={!!uploadedVideoUrl}
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              setIsUploadingVideo(true)
                              // Simulate upload delay for progress animation
                              setTimeout(() => {
                                  console.log('🎬 File selected:', { 
                                  name: file.name, 
                                  size: file.size, 
                                  type: file.type,
                                  lastModified: file.lastModified
                                })
                                
                                // Convert file to data URL for persistence
                                const reader = new FileReader()
                                reader.onload = (e) => {
                                  const dataUrl = e.target?.result as string
                                  console.log('🎬 File converted to data URL:', {
                                    length: dataUrl.length,
                                    startsWithData: dataUrl.startsWith('data:'),
                                    mimeType: dataUrl.split(';')[0],
                                    fileName: file.name
                                  })
                                  
                                  // Store both the file object and data URL
                                  setUploadedVideoFile(file)
                                  setUploadedVideoUrl(dataUrl) // Store actual data URL instead of just 'uploaded'
                                  setUploadedVideoName(file.name)
                                  
                                  // Clear the URL input when uploading
                                  setVideoUrl('')
                                  
                                  // Save to item with data URL
                                  onUpdate?.('videoUrl', '')
                                  onUpdate?.('uploadedVideoUrl', dataUrl)
                                  onUpdate?.('uploadedVideoName', file.name)
                                  
                                  setIsUploadingVideo(false)
                                  
                                }
                                reader.onerror = (e) => {
                                  console.error('🎬 FileReader error:', e)
                                  setIsUploadingVideo(false)
                                }
                                reader.readAsDataURL(file)
                              }, 500) // Small delay to show loading state
                            }
                          }}
                        />
                      </div>
                      
                      {/* Right side - Progress/Status */}
                      <div className="flex-1 flex items-center">
                        {isUploadingVideo && (
                          <div className="w-full space-y-1">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></div>
                              <span>Uploading...</span>
                            </div>
                            <div className="w-full bg-border/50 rounded-full h-1.5">
                              <div className="bg-primary h-1.5 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                            </div>
                          </div>
                        )}
                        
                        {!isUploadingVideo && uploadedVideoUrl && (
                          <div className="w-full p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2 text-xs">
                                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                                <span className="text-green-600 dark:text-green-400 font-medium">Uploaded</span>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-5 w-5 p-0 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                                title="Remove uploaded video"
                                onClick={() => {
                                  // Clear the uploaded video
                                  setUploadedVideoFile(null)
                                  setUploadedVideoUrl('')
                                  setUploadedVideoName('')
                                  onUpdate?.('uploadedVideoUrl', '')
                                  onUpdate?.('uploadedVideoName', '')
                                  console.log('Uploaded video removed')
                                }}
                              >
                                <X className="h-3 w-3 text-red-600 dark:text-red-400" />
                              </Button>
                            </div>
                            <p className="text-xs text-green-700 dark:text-green-300 truncate font-mono" title={uploadedVideoName}>
                              {uploadedVideoName.length > 25 
                                ? `${uploadedVideoName.substring(0, 25)}...` 
                                : uploadedVideoName}
                            </p>
                          </div>
                        )}
                        
                        {!isUploadingVideo && !uploadedVideoUrl && (
                          <div className="text-xs text-muted-foreground">
                            No video uploaded
                          </div>
                        )}
                      </div>
                    </div>
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
                    placeholder="https://www.dreamsjournal.app/blog"
                  />
                </div>
              )}

              {viewMode === 'tweet' && (
                <div className="space-y-2">
                  <Label>Tweet URL</Label>
                  <Input
                    value={tweetUrl}
                    onChange={(e) => {
                      setTweetUrl(e.target.value)
                      onUpdate?.('tweetUrl', e.target.value)
                    }}
                    placeholder="https://x.com/0x_Reef/status/1956757731957780758"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the full tweet URL from Twitter/X (supports both twitter.com and x.com)
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
                            setMultiImages(prev => {
                              const newImages = [...prev, base64String]
                              onUpdate?.('multiImages', newImages)
                              return newImages
                            })
                          }
                          reader.readAsDataURL(file)
                        })
                      }}
                    />
                    <Textarea
                      value={multiImages.filter(url => !url.startsWith('data:')).join('\n')}
                      onChange={(e) => {
                        const urls = e.target.value.split('\n').filter(url => url.trim())
                        const uploadedImages = multiImages.filter(url => url.startsWith('data:'))
                        const allImages = [...uploadedImages, ...urls]
                        setMultiImages(allImages)
                        onUpdate?.('multiImages', allImages)
                      }}
                      placeholder="Enter image URLs (one per line)"
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
                  <div className="space-y-2">
                    <Label>Upload Images</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {/* Before Image */}
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground text-center block">Before</Label>
                        <div 
                          className="relative aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 overflow-hidden bg-muted/50 hover:border-muted-foreground/50 transition-colors cursor-pointer"
                          onDragOver={(e) => {
                            e.preventDefault()
                            e.currentTarget.classList.add('border-primary')
                          }}
                          onDragLeave={(e) => {
                            e.currentTarget.classList.remove('border-primary')
                          }}
                          onDrop={(e) => {
                            e.preventDefault()
                            e.currentTarget.classList.remove('border-primary')
                            const file = e.dataTransfer.files[0]
                            if (file && file.type.startsWith('image/')) {
                              const reader = new FileReader()
                              reader.onloadend = () => {
                                const newCompareImages = [reader.result as string, compareImages[1] || '']
                                setCompareImages(newCompareImages)
                                onUpdate?.('compareImages', newCompareImages)
                              }
                              reader.readAsDataURL(file)
                            }
                          }}
                          onClick={() => {
                            const input = document.createElement('input')
                            input.type = 'file'
                            input.accept = 'image/*'
                            input.onchange = (e) => {
                              const file = (e.target as HTMLInputElement).files?.[0]
                              if (file) {
                                const reader = new FileReader()
                                reader.onloadend = () => {
                                  const newCompareImages = [reader.result as string, compareImages[1] || '']
                                  setCompareImages(newCompareImages)
                                  onUpdate?.('compareImages', newCompareImages)
                                }
                                reader.readAsDataURL(file)
                              }
                            }
                            input.click()
                          }}
                        >
                          {compareImages[0] ? (
                            <>
                              <img
                                src={compareImages[0]}
                                alt="Before"
                                className="w-full h-full object-cover"
                              />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  const newCompareImages = ['', compareImages[1] || '']
                                  setCompareImages(newCompareImages)
                                  onUpdate?.('compareImages', newCompareImages)
                                }}
                                className="absolute top-1 right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Plus className="w-8 h-8 text-muted-foreground/50" />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* After Image */}
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground text-center block">After</Label>
                        <div 
                          className="relative aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 overflow-hidden bg-muted/50 hover:border-muted-foreground/50 transition-colors cursor-pointer"
                          onDragOver={(e) => {
                            e.preventDefault()
                            e.currentTarget.classList.add('border-primary')
                          }}
                          onDragLeave={(e) => {
                            e.currentTarget.classList.remove('border-primary')
                          }}
                          onDrop={(e) => {
                            e.preventDefault()
                            e.currentTarget.classList.remove('border-primary')
                            const file = e.dataTransfer.files[0]
                            if (file && file.type.startsWith('image/')) {
                              const reader = new FileReader()
                              reader.onloadend = () => {
                                const newCompareImages = [compareImages[0] || '', reader.result as string]
                                setCompareImages(newCompareImages)
                                onUpdate?.('compareImages', newCompareImages)
                              }
                              reader.readAsDataURL(file)
                            }
                          }}
                          onClick={() => {
                            const input = document.createElement('input')
                            input.type = 'file'
                            input.accept = 'image/*'
                            input.onchange = (e) => {
                              const file = (e.target as HTMLInputElement).files?.[0]
                              if (file) {
                                const reader = new FileReader()
                                reader.onloadend = () => {
                                  const newCompareImages = [compareImages[0] || '', reader.result as string]
                                  setCompareImages(newCompareImages)
                                  onUpdate?.('compareImages', newCompareImages)
                                }
                                reader.readAsDataURL(file)
                              }
                            }
                            input.click()
                          }}
                        >
                          {compareImages[1] ? (
                            <>
                              <img
                                src={compareImages[1]}
                                alt="After"
                                className="w-full h-full object-cover"
                              />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  const newCompareImages = [compareImages[0] || '', '']
                                  setCompareImages(newCompareImages)
                                  onUpdate?.('compareImages', newCompareImages)
                                }}
                                className="absolute top-1 right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Plus className="w-8 h-8 text-muted-foreground/50" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {viewMode === 'education' && (
                <div className="space-y-3">
                  <Label>Education Image</Label>
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
                            onUpdate?.('imageUrl', base64String)
                          }
                          reader.readAsDataURL(file)
                        }
                      }}
                    />
                    <Input
                      placeholder="Or enter image URL"
                      value={images[0] || ''}
                      onChange={(e) => {
                        const newImages = e.target.value ? [e.target.value] : []
                        setImages(newImages)
                        onUpdate?.('images', newImages)
                        onUpdate?.('imageUrl', e.target.value)
                      }}
                    />
                    <Input
                      placeholder="Image description (alt text)"
                      value={item.imageAlt || ''}
                      onChange={(e) => {
                        onUpdate?.('imageAlt', e.target.value)
                      }}
                    />
                  </div>
                  
                  {(images[0] || item.imageUrl) && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Preview</Label>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setIsEditingImage(true)}
                          >
                            <Edit2 className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              setImages([])
                              onUpdate?.('images', [])
                              onUpdate?.('imageUrl', '')
                              onUpdate?.('imageAlt', '')
                              onUpdate?.('imageTransform', undefined)
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="relative aspect-square w-full max-w-[200px] overflow-hidden rounded-lg border bg-muted">
                        <TransformedImage
                          src={images[0] || item.imageUrl || ''}
                          alt={item.imageAlt || 'Education image'}
                          transform={imageTransform}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Text Overlay settings - Only shown for text viewMode */}
              {viewMode === 'text' && hasTextVariantSupport && (
                <div className="space-y-3 pt-3 mt-3 border-t border-blue-200/30 dark:border-blue-800/30">
                  <div className="flex items-center gap-2">
                    <Type className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <Label className="text-sm font-medium text-blue-700 dark:text-blue-300">Text Overlay</Label>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setTextVariant('detailed')
                        onUpdate?.('textVariant', 'detailed')
                      }}
                      className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${
                        textVariant === 'detailed'
                          ? 'bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-200'
                          : 'bg-background border-border text-muted-foreground hover:bg-muted/50'
                      }`}
                    >
                      Detailed
                    </button>
                    <button
                      onClick={() => {
                        setTextVariant('simple')
                        onUpdate?.('textVariant', 'simple')
                      }}
                      className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${
                        textVariant === 'simple'
                          ? 'bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-200'
                          : 'bg-background border-border text-muted-foreground hover:bg-muted/50'
                      }`}
                    >
                      Simple
                    </button>
                  </div>
                </div>
              )}

              {/* Typography Section - Always shown at bottom */}
              <div className="space-y-3 pt-4 mt-4 border-t border-blue-200/40 dark:border-blue-800/40">
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <h4 className="font-semibold text-sm text-blue-800 dark:text-blue-200">Typography</h4>
                </div>
                
                {/* Title */}
                <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-200/30 dark:border-blue-800/30">
                  <div className="flex items-start gap-2 mb-2">
                    <Label className="text-xs text-blue-600 dark:text-blue-400 mt-1">Title</Label>
                    <Select 
                      value={item.titleSize || 'text-lg'} 
                      onValueChange={(v) => onUpdate?.('titleSize', v)}
                    >
                      <SelectTrigger className="w-16 h-6 rounded-md border-blue-300/50 dark:border-blue-700/50 text-xs">
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
                    className={`border-blue-200/30 dark:border-blue-800/30 bg-transparent font-semibold text-foreground ${item.titleSize || 'text-lg'}`}
                  />
                </div>
                
                {/* Description */}
                <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-200/30 dark:border-blue-800/30">
                  <div className="flex items-start gap-2 mb-2">
                    <Label className="text-xs text-blue-600 dark:text-blue-400 mt-1">Description</Label>
                    <Select 
                      value={item.descriptionSize || 'text-sm'} 
                      onValueChange={(v) => onUpdate?.('descriptionSize', v)}
                    >
                      <SelectTrigger className="w-16 h-6 rounded-md border-blue-300/50 dark:border-blue-700/50 text-xs">
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
                    className={`border-blue-200/30 dark:border-blue-800/30 bg-transparent text-foreground min-h-[60px] resize-none ${item.descriptionSize || 'text-sm'}`}
                  />
                </div>
                
                {/* Company/Institution (if exists) */}
                {(item.company || item.institution) && (
                  <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-200/30 dark:border-blue-800/30">
                    <div className="flex items-start gap-2 mb-2">
                      <Label className="text-xs text-blue-600 dark:text-blue-400 mt-1">{item.company ? 'Company' : 'Institution'}</Label>
                      <Select 
                        value={item.companySize || 'text-sm'} 
                        onValueChange={(v) => onUpdate?.('companySize', v)}
                      >
                        <SelectTrigger className="w-16 h-6 rounded-md border-blue-300/50 dark:border-blue-700/50 text-xs">
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
                      className={`border-blue-200/30 dark:border-blue-800/30 bg-transparent text-foreground ${item.companySize || 'text-sm'}`}
                    />
                  </div>
                )}
                
                {/* Location (if exists) */}
                {item.location && (
                  <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-200/30 dark:border-blue-800/30">
                    <div className="flex items-start gap-2 mb-2">
                      <Label className="text-xs text-blue-600 dark:text-blue-400 mt-1">Location</Label>
                      <Select 
                        value={item.locationSize || 'text-xs'} 
                        onValueChange={(v) => onUpdate?.('locationSize', v)}
                      >
                        <SelectTrigger className="w-16 h-6 rounded-md border-blue-300/50 dark:border-blue-700/50 text-xs">
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
                      className={`border-blue-200/30 dark:border-blue-800/30 bg-transparent text-foreground ${item.locationSize || 'text-xs'}`}
                    />
                  </div>
                )}
              </div>
                      </div>
                    )}
                  </div>
                </div>


                {/* Section 2: Icon Settings - Collapsible (Only for Text View) */}
                {viewMode === 'text' && (
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
                )}

            </div>
          </SheetContent>
        </Sheet>

        <SmartCardControls
          onDelete={safeOnDelete}
          onSettings={() => setSheetOpen(true)}
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