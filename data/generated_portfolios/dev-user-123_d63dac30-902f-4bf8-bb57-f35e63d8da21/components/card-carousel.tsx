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
    return (
      <div className={cn("w-full flex justify-center", containerClassName)}>
        <div className="w-full max-w-xl">
          <div className="p-1 h-full">{renderItem(items[0], 0)}</div>
        </div>
      </div>
    )
  }

  // If there are two items, display them side-by-side in a centered flex container.
  if (items.length === 2) {
    return (
      <div className={cn("w-full max-w-5xl mx-auto", containerClassName)}>
        <div className="flex justify-center items-stretch flex-col md:flex-row gap-4">
          {items.map((item, i) => (
            <div key={i} className={cn("w-full", itemClassName)}>
              <div className="p-1 h-full">{renderItem(item, i)}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // If there are more than two items, render the carousel as usual.
  return (
    <Carousel opts={carouselOpts} className={cn("w-full max-w-5xl mx-auto px-14 md:px-20", containerClassName)}>
      <CarouselContent>
        {items.map((item, i) => (
          <CarouselItem key={i} className={itemClassName}>
            <div className="p-1 h-full">{renderItem(item, i)}</div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
