"use client"

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Import all view components
import { BentoGridItem } from '@/components/ui/bento-grid-item'
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card'
import { CodeBlock } from '@/components/ui/code-block'
import { ClientTweetCard } from '@/components/ui/client-tweet-card'
import { GitHubCard } from '@/components/ui/github-card'
import { ImageCarousel } from '@/components/ui/image-carousel'
import { VideoPlayer } from '@/components/ui/video-player'
import { LinkPreview } from '@/components/ui/link-preview'

export type ViewMode = 'text' | 'images' | 'code' | 'github' | 'uri' | 'video' | 'tweet'

interface UniversalViewItemProps {
  item: any
  index: number
  sectionKey: string
  onUpdate: (field: string, value: any) => void
  defaultContent: React.ReactNode
  className?: string
}

export function UniversalViewItem({
  item,
  index,
  sectionKey,
  onUpdate,
  defaultContent,
  className
}: UniversalViewItemProps) {
  const [viewMode, setViewMode] = useState<ViewMode>(item.viewMode || 'text')
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  
  const itemKey = item._key || `${sectionKey}-${index}`

  // Content state for different modes
  const [codeContent, setCodeContent] = useState(item.codeSnippet || '')
  const [codeLanguage, setCodeLanguage] = useState(item.codeLanguage || 'typescript')
  const [githubUrl, setGithubUrl] = useState(item.githubUrl || '')
  const [images, setImages] = useState(item.images || [])
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
    onUpdate('viewMode', mode)
  }

  const renderContent = () => {
    switch (viewMode) {
      case 'code':
        return (
          <div className="w-full h-full">
            <CodeBlock
              language={codeLanguage}
              filename={item.title}
              code={codeContent}
            />
          </div>
        )
      
      case 'images':
        return images.length > 0 && images[0] ? (
          <div className="w-full h-full p-4">
            <CardContainer containerClassName="h-full" className="h-full">
              <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-full rounded-xl p-6 border flex flex-col">
                <CardItem
                  translateZ="50"
                  className="text-xl font-bold text-neutral-600 dark:text-white mb-4 text-center w-full"
                >
                  {item.title || 'Image'}
                </CardItem>
                <CardItem translateZ="100" className="w-full flex-1">
                  <ImageCarousel images={images} />
                </CardItem>
              </CardBody>
            </CardContainer>
          </div>
        ) : null
      
      case 'github':
        return githubUrl ? (
          <GitHubCard url={githubUrl} />
        ) : null
      
      case 'video':
        return videoUrl ? (
          <VideoPlayer url={videoUrl} />
        ) : null
      
      case 'tweet':
        return tweetId ? (
          <ClientTweetCard id={tweetId} className="w-full" />
        ) : null
      
      case 'uri':
        return linkUrl ? (
          <LinkPreview url={linkUrl}>
            <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-gray-600">{linkUrl}</p>
            </div>
          </LinkPreview>
        ) : null
      
      case 'text':
      default:
        return defaultContent
    }
  }

  return (
    <div className="group relative h-full">
      {/* Settings Button */}
      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <Sheet open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <SheetTrigger asChild>
            <Button size="icon" variant="secondary" className="h-8 w-8">
              <Settings className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Component Settings</SheetTitle>
              <SheetDescription>
                Customize how this component displays content
              </SheetDescription>
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
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="images">Images</SelectItem>
                    <SelectItem value="code">Code</SelectItem>
                    <SelectItem value="github">GitHub</SelectItem>
                    <SelectItem value="uri">Link/URL</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="tweet">Tweet</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Dynamic Content Editor based on View Mode */}
              <div className="space-y-4">
                {viewMode === 'code' && (
                  <>
                    <div className="space-y-2">
                      <Label>Programming Language</Label>
                      <Select value={codeLanguage} onValueChange={(v) => {
                        setCodeLanguage(v)
                        onUpdate('codeLanguage', v)
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
                          onUpdate('codeSnippet', e.target.value)
                        }}
                        placeholder="Paste your code here..."
                        className="font-mono min-h-[200px]"
                      />
                    </div>
                  </>
                )}

                {viewMode === 'images' && (
                  <div className="space-y-2">
                    <Label>Image URLs</Label>
                    <Tabs defaultValue="list">
                      <TabsList>
                        <TabsTrigger value="list">URL List</TabsTrigger>
                        <TabsTrigger value="upload">Upload</TabsTrigger>
                      </TabsList>
                      <TabsContent value="list" className="space-y-2">
                        {images.map((url: string, i: number) => (
                          <Input
                            key={i}
                            value={url}
                            onChange={(e) => {
                              const newImages = [...images]
                              newImages[i] = e.target.value
                              setImages(newImages)
                              onUpdate('images', newImages)
                            }}
                            placeholder="Image URL"
                          />
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newImages = [...images, '']
                            setImages(newImages)
                            onUpdate('images', newImages)
                          }}
                        >
                          Add Image
                        </Button>
                      </TabsContent>
                      <TabsContent value="upload">
                        <p className="text-sm text-gray-500">Upload functionality coming soon</p>
                      </TabsContent>
                    </Tabs>
                  </div>
                )}

                {viewMode === 'github' && (
                  <div className="space-y-2">
                    <Label>GitHub Repository URL</Label>
                    <Input
                      value={githubUrl}
                      onChange={(e) => {
                        setGithubUrl(e.target.value)
                        onUpdate('githubUrl', e.target.value)
                      }}
                      placeholder="https://github.com/user/repo"
                    />
                    <p className="text-xs text-gray-500">
                      Enter a GitHub repository URL to display repository information
                    </p>
                  </div>
                )}

                {viewMode === 'video' && (
                  <div className="space-y-2">
                    <Label>Video URL</Label>
                    <Input
                      value={videoUrl}
                      onChange={(e) => {
                        setVideoUrl(e.target.value)
                        onUpdate('videoUrl', e.target.value)
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
                        onUpdate('tweetId', id)
                      }}
                      placeholder="Tweet ID or full Twitter/X URL"
                    />
                    <p className="text-xs text-gray-500">
                      Paste a Twitter/X URL or just the tweet ID
                    </p>
                  </div>
                )}

                {viewMode === 'uri' && (
                  <div className="space-y-2">
                    <Label>Link URL</Label>
                    <Input
                      value={linkUrl}
                      onChange={(e) => {
                        setLinkUrl(e.target.value)
                        onUpdate('linkUrl', e.target.value)
                      }}
                      placeholder="https://example.com"
                    />
                    <p className="text-xs text-gray-500">
                      Enter any URL to display with a preview on hover
                    </p>
                  </div>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  )
}