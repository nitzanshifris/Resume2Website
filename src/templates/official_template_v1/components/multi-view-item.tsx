"use client"

import React from 'react'
import { cn } from '@/lib/utils'
import { BentoGridItem } from '@/components/ui/bento-grid-item'
import { SettingsPanel } from './settings/settings-panel'
import { useSettings, ViewMode } from './settings/settings-provider'
import { Tweet } from 'react-tweet'
import { CodeBlockLayout } from './layouts/code-block-layout'
import { GitHubCardLayout } from './layouts/github-card-layout'
import { ImageCarouselLayout } from './layouts/image-carousel-layout'

interface MultiViewItemProps {
  itemId: string
  sectionKey: string
  item: {
    _key?: string
    title: string
    description?: string
    icon: React.ReactNode
    tweetId?: string
    codeSnippet?: string
    images?: string[]
    githubUrl?: string
    demoUrl?: string
    link?: string
    technologiesUsed?: string[]
    [key: string]: any
  }
  className?: string
  titleElement?: React.ReactNode
  descriptionElement?: React.ReactNode
  onTweetIdChange?: (tweetId: string) => void
}

export function MultiViewItem({
  itemId,
  sectionKey,
  item,
  className,
  titleElement,
  descriptionElement,
  onTweetIdChange
}: MultiViewItemProps) {
  const { itemViewModes } = useSettings()
  const viewMode = itemViewModes[sectionKey]?.[itemId] || 'text'

  // Debug logging
  React.useEffect(() => {
    console.log(`🔍 MultiViewItem ${sectionKey}/${itemId} view mode:`, viewMode)
  }, [viewMode, sectionKey, itemId])

  const renderContent = () => {
    switch (viewMode) {
      case 'tweet':
        if (item.tweetId) {
          return (
            <div className="h-full flex items-center justify-center p-4">
              <Tweet id={item.tweetId} />
            </div>
          )
        }
        // Fall back to text if no tweetId
        return renderDefaultContent()

      case 'code':
        if (item.codeSnippet) {
          return (
            <CodeBlockLayout
              title={item.title}
              code={item.codeSnippet}
              language="typescript"
              className="h-full"
            />
          )
        }
        // Fall back to text if no code
        return renderDefaultContent()

      case 'github':
        if (item.githubUrl) {
          return (
            <GitHubCardLayout
              title={item.title}
              description={item.description || ''}
              href={item.githubUrl}
              className="h-full"
            />
          )
        }
        // Fall back to text if no GitHub URL
        return renderDefaultContent()

      case 'image':
        if (item.images && item.images.length > 0) {
          return (
            <div className="relative h-full w-full overflow-hidden rounded-xl">
              <img
                src={item.images[0]}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="font-serif text-lg font-bold">{item.title}</h3>
                {item.description && (
                  <p className="text-sm text-white/80 mt-1">{item.description}</p>
                )}
              </div>
            </div>
          )
        }
        return renderDefaultContent()

      case 'image-carousel':
        if (item.images && item.images.length > 1) {
          return (
            <ImageCarouselLayout
              images={item.images}
              title={item.title}
              description={item.description}
              className="h-full"
            />
          )
        } else if (item.images && item.images.length === 1) {
          // Single image, render as regular image
          return (
            <div className="relative h-full w-full overflow-hidden rounded-xl">
              <img
                src={item.images[0]}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="font-serif text-lg font-bold">{item.title}</h3>
                {item.description && (
                  <p className="text-sm text-white/80 mt-1">{item.description}</p>
                )}
              </div>
            </div>
          )
        }
        return renderDefaultContent()

      case 'url':
        if (item.link || item.demoUrl) {
          const url = item.demoUrl || item.link
          return (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="block h-full"
            >
              {renderDefaultContent()}
            </a>
          )
        }
        return renderDefaultContent()

      default:
        return renderDefaultContent()
    }
  }

  const renderDefaultContent = () => {
    return (
      <BentoGridItem
        className={cn("h-full shadow-lg", className)}
        icon={item.icon}
        title={titleElement || item.title}
        description={descriptionElement || item.description}
      />
    )
  }

  return (
    <div className="group relative h-full">
      <div className="absolute top-2 right-2 z-50">
        <SettingsPanel
          itemId={itemId}
          sectionKey={sectionKey}
          currentViewMode={viewMode}
          currentTweetId={item.tweetId || ''}
          onTweetIdChange={onTweetIdChange}
        />
      </div>
      {renderContent()}
    </div>
  )
}