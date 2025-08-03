"use client"
import type React from "react"
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
    return (
      <DraggableList
        items={items}
        onReorder={onReorder}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto"
        handlePosition="top-right"
        strategy="grid"
      />
    )
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