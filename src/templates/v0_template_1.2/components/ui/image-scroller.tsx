"use client"
import { motion, useScroll } from "framer-motion"
import { useRef } from "react"
import { Button } from "./button"
import { EditableText } from "./editable-text"
import { useTransform } from "framer-motion"

interface Slide {
  title: string
  buttonText: string
  imageUrl: string
  linkUrl?: string
  onSaveTitle: (value: string) => void
}

interface ImageScrollerProps {
  slides: Slide[]
}

export const ImageScroller = ({ slides }: ImageScrollerProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  const scales = slides.map((_, i) =>
    useTransform(scrollYProgress, [i / slides.length, 1], [1, 1 - (slides.length - i) * 0.05]),
  )
  const opacities = slides.map((_, i) =>
    useTransform(scrollYProgress, [(i - 0.5) / slides.length, i / slides.length], [1, 0]),
  )

  return (
    <div ref={containerRef} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen bg-background flex items-center justify-center overflow-hidden">
        {slides.map((slide, i) => {
          return (
            <motion.div
              key={i}
              style={{
                backgroundImage: `url(${slide.imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                scale: scales[i],
                opacity: opacities[i],
              }}
              className="absolute inset-0 h-full w-full flex flex-col items-center justify-center text-white"
            >
              <div className="absolute inset-0 bg-black/50" />
              <div className="relative z-10 text-center space-y-4">
                <EditableText
                  as="h2"
                  initialValue={slide.title}
                  onSave={slide.onSaveTitle}
                  className="text-5xl font-bold font-serif text-white [text-shadow:_0_2px_4px_rgba(0,0,0,0.5)] hover:bg-transparent focus:bg-black/20"
                />
                <Button asChild size="lg" className="bg-accent text-accent-foreground">
                  <a href={slide.linkUrl || "#"}>{slide.buttonText}</a>
                </Button>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
