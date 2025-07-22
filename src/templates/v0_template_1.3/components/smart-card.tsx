"use client"

import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Settings, FileText, Image, Code, Github, Link, Video, Twitter, Maximize2, ExternalLink, Edit2, Plus, X, MoveHorizontal, GripVertical } from 'lucide-react'
import { Safari } from '@/components/ui/safari'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Import view components
import { BentoGridItem } from '@/components/ui/bento-grid-item'
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card'
import { CodeBlock } from '@/components/ui/code-block'
import { GitHubCard } from './ui/github-card'
import { ImageCarousel } from './ui/image-carousel'
import { VideoPlayer } from './ui/video-player'
import { LinkPreview } from './ui/link-preview'
import { ClientTweetCard } from './ui/client-tweet-card'
import { ImageTransformEditor, type ImageTransform } from './ui/image-transform-editor'
import { TransformedImage } from './ui/transformed-image'
import type { BaseViewItem } from '@/lib/data'

export type ViewMode = 'text' | 'images' | 'code' | 'github' | 'uri' | 'video' | 'tweet'

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
}

const viewModeOptions = [
  { value: 'text', label: 'Text View', icon: FileText },
  { value: 'images', label: '3D Image Card', icon: Image },
  { value: 'code', label: 'Code Block', icon: Code },
  { value: 'github', label: 'GitHub Card', icon: Github },
  { value: 'uri', label: 'Link Preview', icon: Link },
  { value: 'video', label: 'Video Player', icon: Video },
  { value: 'tweet', label: 'Tweet Card', icon: Twitter },
]

export function SmartCard({ item, children, className, onUpdate }: SmartCardProps) {
  const [viewMode, setViewMode] = useState<ViewMode>(item.viewMode || 'text')
  
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
              <div className="text-center text-gray-500">
                <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Click settings to add code</p>
              </div>
            </div>
          )
        )
      
      case 'images':
        return contentWrapper(
          images.length > 0 && images[0] ? (
            <div className="flex-1 p-4">
              <CardContainer containerClassName="h-full" className="h-full">
                <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-full rounded-xl p-6 border flex flex-col">
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
                    className="w-full flex-1"
                  >
                    <TransformedImage
                      src={images[0]}
                      transform={imageTransform}
                      alt={item.title || 'Image'}
                      className="h-full w-full rounded-xl group-hover/card:shadow-xl"
                    />
                  </CardItem>
                </CardBody>
              </CardContainer>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center text-gray-500">
                <Image className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Click settings to add an image</p>
              </div>
            </div>
          )
        )
      
      case 'github':
        return contentWrapper(
          githubUrl ? (
            <div className="flex-1 p-6">
              <GitHubCard url={githubUrl} className="w-full h-full" />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center text-gray-500">
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
              <div className="text-center text-gray-500">
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
              <div className="text-center text-gray-500">
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
              <div className="text-center text-gray-500">
                <Link className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Click settings to add link URL</p>
              </div>
            </div>
          )
        )
      
      case 'text':
      default:
        return children
    }
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
            <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 overflow-hidden">
              <DialogTitle className="sr-only">Full View</DialogTitle>
              <div className="w-full h-[85vh] flex items-center justify-center bg-background p-8">
                {viewMode === 'uri' && linkUrl ? (
                  <div className="relative w-full h-full">
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
                ) : viewMode === 'images' && images.length > 0 && images[0] ? (
                  <div className="w-full h-full max-w-4xl">
                    <CardContainer containerClassName="h-full" className="h-full">
                      <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-full rounded-xl p-8 border flex flex-col">
                        <CardItem
                          translateZ="50"
                          className="text-2xl font-bold text-neutral-600 dark:text-white mb-6 text-center w-full"
                        >
                          {item.title}
                        </CardItem>
                        <CardItem 
                          translateZ="100" 
                          rotateX={imageVariant === 'tilted' ? 20 : 0}
                          rotateZ={imageVariant === 'tilted' ? -10 : 0}
                          className="w-full flex-1"
                        >
                          <TransformedImage
                            src={images[0]}
                            transform={imageTransform}
                            alt={item.title || 'Image'}
                            className="h-full w-full rounded-xl group-hover/card:shadow-xl"
                          />
                        </CardItem>
                      </CardBody>
                    </CardContainer>
                  </div>
                ) : (
                  <div className="w-full h-full">
                    {renderContent()}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
        
        {/* Settings Button */}
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
            
            <div className="p-6">
            <SheetHeader>
              <div className="flex items-center justify-between">
                <SheetTitle>Component Settings</SheetTitle>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{sheetWidth}px</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSheetSide(sheetSide === 'right' ? 'left' : 'right')}
                    className="h-8 px-2 hover:bg-secondary"
                    title={`Move sidebar to ${sheetSide === 'right' ? 'left' : 'right'} side`}
                  >
                    <MoveHorizontal className="h-4 w-4 mr-1" />
                    {sheetSide === 'right' ? 'Left' : 'Right'}
                  </Button>
                </div>
              </div>
            </SheetHeader>
            
            <div className="mt-6 space-y-6">
              {/* View Mode Selector */}
              <div className="space-y-2">
                <Label>Display Mode</Label>
                <Select value={viewMode} onValueChange={handleViewModeChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
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
            </div>
            </div>
          </SheetContent>
        </Sheet>
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