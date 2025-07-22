"use client"

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { Settings, FileText, Image, Code, Github, Link, Video, Twitter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
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
  const [videoUrl, setVideoUrl] = useState(item.videoUrl || '')
  const [tweetId, setTweetId] = useState(item.tweetId || '')
  const [linkUrl, setLinkUrl] = useState(item.linkUrl || '')

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
          images.length > 0 ? (
            <div className="flex-1 p-6">
              <CardContainer className="w-full h-full">
                <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-full rounded-xl p-4 border">
                  <CardItem translateZ="50" className="text-xl font-bold text-neutral-600 dark:text-white mb-4">
                    {item.title}
                  </CardItem>
                  <CardItem translateZ="100" className="w-full flex-1">
                    <ImageCarousel images={images} className="h-full" />
                  </CardItem>
                </CardBody>
              </CardContainer>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center text-gray-500">
                <Image className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Click settings to add images</p>
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
            <div className="flex-1 p-6">
              <div className="h-full flex items-center justify-center">
                <div className="w-full max-w-lg">
                  <div className="border rounded-lg p-4 bg-blue-50">
                    <Twitter className="w-6 h-6 text-blue-500 mb-2" />
                    <p className="text-sm text-gray-600">Tweet ID: {tweetId}</p>
                    <p className="text-xs text-gray-500 mt-2">Tweet card will be implemented with proper API</p>
                  </div>
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
      {/* Settings Button - visible on hover */}
      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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
                  <Label>Image URLs</Label>
                  {images.map((url, i) => (
                    <div key={i} className="flex gap-2">
                      <Input
                        value={url}
                        onChange={(e) => {
                          const newImages = [...images]
                          newImages[i] = e.target.value
                          setImages(newImages)
                          onUpdate?.('images', newImages)
                        }}
                        placeholder="Image URL"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newImages = images.filter((_, index) => index !== i)
                          setImages(newImages)
                          onUpdate?.('images', newImages)
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => {
                      const newImages = [...images, '']
                      setImages(newImages)
                      onUpdate?.('images', newImages)
                    }}
                  >
                    Add Image
                  </Button>
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
    </div>
  )
}