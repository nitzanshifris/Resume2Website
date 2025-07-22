"use client"

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { Settings, FileText, Image, Code, Github, Link, Video, Twitter, Maximize2, ExternalLink, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

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
    setGithubUrl(item.githubUrl || '')
    setImages(item.images || [])
    setImageTransform(item.imageTransform || { crop: { x: 0, y: 0 }, zoom: 1, rotation: 0 })
    setVideoUrl(item.videoUrl || '')
    setTweetId(item.tweetId || '')
    setLinkUrl(item.linkUrl || '')
    setTweetVariant(item.tweetVariant || 'default')
  }, [item])
  const [videoUrl, setVideoUrl] = useState(item.videoUrl || '')
  const [tweetId, setTweetId] = useState(item.tweetId || '')
  const [linkUrl, setLinkUrl] = useState(item.linkUrl || '')
  const [tweetVariant, setTweetVariant] = useState<'default' | 'shadow' | 'minimal'>(item.tweetVariant || 'default')
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false)
  const [isEditingImage, setIsEditingImage] = useState(false)

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
          codeContent ? (
            <div className="flex-1 overflow-hidden flex flex-col p-6">
              <div className="flex-1 overflow-auto">
                <CodeBlock
                  language={codeLanguage}
                  code={codeContent}
                  filename={item.title}
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
                    className="text-xl font-bold text-neutral-600 dark:text-white mb-4"
                  >
                    {item.title}
                  </CardItem>
                  <CardItem translateZ="100" className="w-full flex-1">
                    <TransformedImage
                      src={images[0]}
                      transform={imageTransform}
                      alt={item.title || 'Image'}
                      className="w-full h-full rounded-xl group-hover/card:shadow-xl"
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
              <LinkPreview url={linkUrl}>
                <div className="h-full flex items-center justify-center">
                  <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-blue-600 hover:underline">{linkUrl}</p>
                  </div>
                </div>
              </LinkPreview>
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
        {/* Open in New Tab Button */}
        {getViewModeLink() && (
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
            <DialogContent className="max-w-[80vw] max-h-[80vh] p-0 overflow-hidden">
              <DialogTitle className="sr-only">Full View</DialogTitle>
              <div className="w-full h-[80vh] overflow-auto bg-background">
                <div className="min-h-full">
                  {renderContent()}
                </div>
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
          <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Component Settings</SheetTitle>
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
                        <SelectItem value="python">Python</SelectItem>
                        <SelectItem value="java">Java</SelectItem>
                        <SelectItem value="go">Go</SelectItem>
                        <SelectItem value="rust">Rust</SelectItem>
                        <SelectItem value="cpp">C++</SelectItem>
                        <SelectItem value="jsx">JSX</SelectItem>
                        <SelectItem value="tsx">TSX</SelectItem>
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
                </div>
              )}

              {viewMode === 'images' && (
                <div className="space-y-4">
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