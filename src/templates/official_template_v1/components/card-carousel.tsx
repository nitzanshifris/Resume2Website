"use client"
import type React from "react"
import { cn } from "@/lib/utils"

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import type { UseEmblaCarouselType } from "embla-carousel-react"

type CarouselOptions = UseEmblaCarouselType[0]

interface CardCarouselProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  itemClassName?: string
  carouselOpts?: CarouselOptions
  containerClassName?: string
}

export function CardCarousel<T>({
  items,
  renderItem,
  itemClassName,
  carouselOpts = { align: "start", loop: true },
  containerClassName,
}: CardCarouselProps<T>) {
  if (!items || items.length === 0) {
    return null // Don't render anything for empty or undefined items
  }

  // If there is only one item, display it centered.
  if (items.length === 1) {
    // Extract size from smart sizing classes for single card container
    const sizeMatch = itemClassName?.match(/smartcard-(large|medium|small|mini|micro)/)
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
      <div className={cn("w-full flex justify-center", containerClassName)}>
        <div className={cn("w-full", getSingleCardWidth(size))}>
          <div className={cn("p-1 h-full flex", itemClassName)}>
            <div className="w-full flex-1">{renderItem(items[0], 0)}</div>
          </div>
        </div>
      </div>
    )
  }

  // If there are 2-3 items, display them in a grid (no carousel arrows)
  if (items.length <= 3) {
    const gridCols = items.length === 2 ? "md:grid-cols-2 lg:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"
    return (
      <div className={cn("w-full max-w-7xl mx-auto", containerClassName)}>
        <div className={`grid grid-cols-1 ${gridCols} gap-12 justify-items-center items-start`}>
          {items.map((item, i) => (
            <div key={i} className={cn("w-full h-full flex", itemClassName)}>
              <div className="p-1 h-full w-full flex-1">{renderItem(item, i)}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // If there are more than 3 items, render the carousel with arrows
  return (
    <Carousel opts={carouselOpts} className={cn("w-full max-w-[90vw] mx-auto px-4 md:px-8", containerClassName)}>
      <CarouselContent className="-ml-2 md:-ml-3">
        {items.map((item, i) => (
          <CarouselItem key={i} className={cn("pl-2 md:pl-3", itemClassName)}>
            <div className="h-full">{renderItem(item, i)}</div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="-left-12 md:-left-14" />
      <CarouselNext className="-right-12 md:-right-14" />
    </Carousel>
  )
}
