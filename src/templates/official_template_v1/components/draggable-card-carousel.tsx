"use client"
import type React from "react"
import { cn } from "@/lib/utils"
import { useEditMode } from "@/contexts/edit-mode-context"
import { DraggableList } from "@/components/draggable-list"
import { CardCarousel } from "@/components/card-carousel"
import type { UseEmblaCarouselType } from "embla-carousel-react"

type CarouselOptions = UseEmblaCarouselType[0]

interface DraggableCardCarouselProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  itemClassName?: string
  carouselOpts?: CarouselOptions
  containerClassName?: string
  onReorder?: (newItems: T[]) => void
  keyExtractor?: (item: T, index: number) => string
}

export function DraggableCardCarousel<T>({
  items,
  renderItem,
  itemClassName,
  carouselOpts = { align: "start", loop: true },
  containerClassName,
  onReorder,
  keyExtractor = (item, index) => `item-${index}`,
}: DraggableCardCarouselProps<T>) {
  const { isEditMode } = useEditMode()

  if (isEditMode && onReorder) {
    // Check if this section uses smart sizing (has smartcard- classes) vs legacy sizing
    const usesSmartSizing = itemClassName.includes('smartcard-')
    
    // Special check for beta2 section to test flexbox approach
    // The itemClassName contains smartcard classes, not the section name
    // We need to check a different way - looking for a special marker class
    const isBeta2Section = containerClassName?.includes('beta2-section')
    
    if (usesSmartSizing && isBeta2Section) {
      // Extract size from itemClassName to apply width directly
      const sizeMatch = itemClassName.match(/smartcard-(large|medium|small|mini|micro)/)
      const size = sizeMatch ? sizeMatch[1] : 'medium'
      
      console.log('Beta2 Edit Mode Debug:', {
        isBeta2Section,
        itemClassName,
        extractedSize: size,
        items: items.length
      })
      
      // Convert smart sizing to actual width percentages (accounting for gaps)
      const getItemWidth = (size: string) => {
        // Match the exact flex-basis values from smartcard-sizing.css
        switch (size) {
          case 'large': return 'lg:w-[40%] md:w-[60%] w-full'    // Matches flex-basis
          case 'medium': return 'lg:w-[33.333333%] md:w-[50%] w-full' // Matches flex-basis
          case 'small': return 'lg:w-[25%] md:w-[33.333333%] w-full'  // Matches flex-basis
          case 'mini': return 'lg:w-[20%] md:w-[20%] w-full'      // Matches flex-basis
          case 'micro': return 'lg:w-[16%] md:w-[18%] w-[40%]'    // Matches flex-basis
          default: return 'lg:w-[33.333333%] md:w-[50%] w-full'
        }
      }
      
      // Extract shape classes separately
      const shapeMatch = itemClassName.match(/smartcard-shape-[\w-]+/)
      const shapeClass = shapeMatch ? shapeMatch[0] : ''
      
      // NEW APPROACH FOR BETA2 - Use explicit widths and apply shape to inner content
      return (
        <div className="w-full max-w-[90vw] mx-auto px-4 md:px-8">
          <div className="overflow-hidden">
            <DraggableList
              items={items}
              onReorder={onReorder}
              renderItem={(item, index) => (
                <div className={cn("h-full", shapeClass)}>
                  {renderItem(item, index)}
                </div>
              )}
              keyExtractor={keyExtractor}
              className="flex flex-wrap -ml-2 md:-ml-3"
              itemWrapperClassName={cn("pl-2 md:pl-3 min-w-0 shrink-0 grow-0", getItemWidth(size))}
              handlePosition="top-right"
              strategy="grid"
            />
          </div>
        </div>
      )
    } else if (usesSmartSizing) {
      // ORIGINAL GRID APPROACH FOR OTHER SMART SIZING SECTIONS
      if (items.length === 1) {
        // Extract size from smart sizing classes for single card container
        const sizeMatch = itemClassName.match(/smartcard-(large|medium|small|mini|micro)/)
        const size = sizeMatch ? sizeMatch[1] : 'medium'
        
        const getSingleCardWidth = (size: string) => {
          switch (size) {
            case 'large': return 'max-w-4xl'   // ~896px - Better represents Large showcase intent
            case 'medium': return 'max-w-2xl'  // ~672px  
            case 'small': return 'max-w-xl'    // ~576px
            case 'mini': return 'max-w-lg'     // ~512px
            case 'micro': return 'max-w-md'    // ~448px
            default: return 'max-w-2xl'
          }
        }
        
        return (
          <div className="w-full flex justify-center">
            <div className={cn("w-full", getSingleCardWidth(size))}>
              <DraggableList
                items={items}
                onReorder={onReorder}
                renderItem={(item, index) => (
                  <div className="p-1 h-full flex">
                    <div className="w-full flex-1">{renderItem(item, index)}</div>
                  </div>
                )}
                keyExtractor={keyExtractor}
                className="w-full"
                handlePosition="top-right"
                strategy="grid"
              />
            </div>
          </div>
        )
      }

      if (items.length <= 3) {
        const gridCols = items.length === 2 ? "md:grid-cols-2 lg:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"
        return (
          <div className="w-full max-w-7xl mx-auto">
            <DraggableList
              items={items}
              onReorder={onReorder}
              renderItem={(item, index) => (
                <div className={cn("w-full h-full flex", itemClassName)}>
                  <div className="p-1 h-full w-full flex-1">{renderItem(item, index)}</div>
                </div>
              )}
              keyExtractor={keyExtractor}
              className={`grid grid-cols-1 ${gridCols} gap-12 justify-items-center items-start`}
              handlePosition="top-right"
              strategy="grid"
            />
          </div>
        )
      }

      // For 4+ items, use carousel layout (TODO: implement carousel dragging)
      return (
        <div className="w-full max-w-7xl mx-auto">
          <DraggableList
            items={items}
            onReorder={onReorder}
            renderItem={(item, index) => (
              <div className={cn("w-full h-full flex", itemClassName)}>
                <div className="p-1 h-full w-full flex-1">{renderItem(item, index)}</div>
              </div>
            )}
            keyExtractor={keyExtractor}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 justify-items-center items-start"
            handlePosition="top-right"
            strategy="grid"
          />
        </div>
      )
    } else {
      // Use original grid layout for legacy sections
      let gridClassName = "grid grid-cols-1 gap-12 max-w-7xl mx-auto items-start justify-items-center"
      
      if (items.length === 1) {
        gridClassName = "flex justify-center max-w-md mx-auto"
      } else if (items.length === 2) {
        gridClassName += " md:grid-cols-2 lg:grid-cols-2"
      } else if (items.length <= 3) {
        gridClassName += " md:grid-cols-2 lg:grid-cols-3"
      } else {
        gridClassName += " md:grid-cols-2 lg:grid-cols-3"
      }
      
      return (
        <DraggableList
          items={items}
          onReorder={onReorder}
          renderItem={(item, index) => (
            <div className="w-full flex">
              <div className={cn("p-1 w-full flex-1", itemClassName)}>
                {renderItem(item, index)}
              </div>
            </div>
          )}
          keyExtractor={keyExtractor}
          className={gridClassName}
          handlePosition="top-right"
          strategy="grid"
        />
      )
    }
  }

  return (
    <CardCarousel
      items={items}
      renderItem={renderItem}
      itemClassName={itemClassName}
      carouselOpts={carouselOpts}
      containerClassName={containerClassName}
    />
  )
}