"use client"

import React from 'react'
import { BentoGridItem } from '@/components/ui/bento-grid-item'
import { EditableText } from '@/components/ui/editable-text'
import { Button } from '@/components/ui/button'
import { Github, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { contentIconMap } from '@/lib/data'
import { useSettings } from '@/components/settings/settings-provider'

// Import view components
import { ClientTweetCard } from '@/components/ui/client-tweet-card'
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card'
import { CodeBlock } from '@/components/ui/code-block'

interface GenericItemProps {
  item: any
  sectionKey: string
  index: number
  handleSave: (path: string, value: string) => void
  cardBgClass: string
  renderContent: () => React.ReactNode
}

export function GenericItem({ item, sectionKey, index, handleSave, cardBgClass, renderContent }: GenericItemProps) {
  const { itemViewModes } = useSettings()
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

    case 'image':
      // 3D Card view
      return item.images && item.images[0] ? (
        <CardContainer className="h-full">
          <CardBody className={cn("bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-[20rem] rounded-xl p-6 border", cardBgClass)}>
            <CardItem
              translateZ="50"
              className="text-xl font-bold text-neutral-600 dark:text-white"
            >
              {item.title || item.role || item.institution || item.organization}
            </CardItem>
            <CardItem
              as="p"
              translateZ="60"
              className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
            >
              {item.description || item.period || item.year || ""}
            </CardItem>
            <CardItem translateZ="100" className="w-full mt-4">
              <img
                src={item.images[0]}
                height="1000"
                width="1000"
                className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                alt={item.title || item.role || ""}
              />
            </CardItem>
          </CardBody>
        </CardContainer>
      ) : null

    default:
      // Default text/card view - use the provided render content
      return (
        <div className="group relative h-full">
          <BentoGridItem
            className={cn("h-full shadow-lg", cardBgClass)}
            icon={item.icon ? React.createElement(contentIconMap[item.icon], { className: "h-4 w-4 text-muted-foreground" }) : null}
            title={renderContent()}
            description={null}
          />
        </div>
      )
  }
}