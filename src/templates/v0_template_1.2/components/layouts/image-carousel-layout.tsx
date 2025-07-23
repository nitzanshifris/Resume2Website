"use client"
import { ImageScroller } from "@/components/ui/image-scroller"

export interface ImageCarouselItem {
  title: string
  imageUrl?: string
  linkUrl?: string
  _key: string | number
}

interface ImageCarouselLayoutProps {
  items: ImageCarouselItem[]
  onSave: (key: string | number, field: "title", value: string) => void
}

export function ImageCarouselLayout({ items, onSave }: ImageCarouselLayoutProps) {
  const slideData = items.map((item) => ({
    title: item.title,
    buttonText: "Explore",
    imageUrl: item.imageUrl || "/placeholder.svg",
    linkUrl: item.linkUrl,
    onSaveTitle: (value: string) => onSave(item._key, "title", value),
  }))

  return <ImageScroller slides={slideData} />
}
