"use client"

import React from 'react'
import { BentoGridItem } from '@/components/ui/bento-grid-item'
import { EditableText } from '@/components/ui/editable-text'
import { Button } from '@/components/ui/button'
import { Github, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { contentIconMap } from '@/lib/data'
import { useSettings } from '@/components/settings/settings-provider'
import { renderIcon } from '@/lib/icon-utils'
import { IconSelector } from '@/components/ui/icon-selector'
import { useEditMode } from '@/contexts/edit-mode-context'

// Import view components
import { ClientTweetCard } from '@/components/ui/client-tweet-card'
import { CodeBlock } from '@/components/ui/code-block'

interface GenericItemProps {
  item: any
  sectionKey: string
  index: number
  handleSave: (path: string, value: string) => void
  cardBgClass: string
  renderContent: () => React.ReactNode
  onSaveIcon?: (icon: { type: 'library' | 'upload'; value: string }) => void
}

export function GenericItem({ item, sectionKey, index, handleSave, cardBgClass, renderContent, onSaveIcon }: GenericItemProps) {
  const { itemViewModes } = useSettings()
  const { isEditMode } = useEditMode()
  const itemKey = item._key || `${sectionKey}-${index}`
  const viewMode = itemViewModes[sectionKey]?.[itemKey] || 'text'

  // Render based on view mode
  switch (viewMode) {
    case 'tweet':
      return item.tweetId ? (
        <div className="group relative h-full">
          <ClientTweetCard id={item.tweetId} className="h-full" />
        </div>
      ) : null

    case 'code':
      return item.codeSnippet ? (
        <div className="group relative h-full">
          <div className="p-4 bg-slate-900 rounded-lg h-full">
            <h3 className="text-lg font-semibold text-white mb-2">{item.title || item.role || item.institution || item.organization || "Code"}</h3>
            <p className="text-sm text-gray-400 mb-4">{item.description || ""}</p>
            <CodeBlock
              code={item.codeSnippet}
              language="typescript"
              filename={`${(item.title || item.role || "code").toLowerCase().replace(/\s+/g, '-')}.ts`}
            />
          </div>
        </div>
      ) : null


    default:
      // Default text/card view - use the provided render content
      return (
        <div className="group relative h-full">
          <BentoGridItem
            className={cn("h-full shadow-lg", cardBgClass)}
            icon={
              item.icon 
                ? (typeof item.icon === 'object' 
                    ? renderIcon(item.icon, "h-4 w-4 text-muted-foreground") 
                    : React.createElement(contentIconMap[item.icon] || contentIconMap.Lightbulb, { className: "h-4 w-4 text-muted-foreground" })
                  ) 
                : null
            }
            iconData={typeof item.icon === 'object' ? item.icon : undefined}
            onIconUpdate={onSaveIcon}
            title={renderContent()}
            description={null}
          />
        </div>
      )
  }
}