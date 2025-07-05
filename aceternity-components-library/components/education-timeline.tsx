"use client"

import { useState, useEffect } from "react"
import { GraduationCap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type EducationItem = {
  institution: string
  degree: string
  years: string
  description: string
}

type EducationTimelineProps = {
  items: EducationItem[]
}

export function EducationTimeline({ items }: EducationTimelineProps) {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const timelineElement = document.querySelector(".timeline-relative-container")
      if (!timelineElement) return

      const totalHeight = timelineElement.scrollHeight - window.innerHeight
      const progress = (window.scrollY / totalHeight) * 100
      setScrollProgress(Math.min(progress, 100))
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Initial call

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="relative timeline-relative-container">
      <div className="absolute left-1/2 -translate-x-1/2 w-1 bg-muted-foreground/20 h-full" aria-hidden="true" />
      <div
        className="absolute left-1/2 -translate-x-1/2 w-1 bg-primary transition-all duration-150 ease-linear"
        style={{ height: `${scrollProgress}%` }}
      />
      <div
        className="absolute left-1/2 -translate-x-1/2 w-1 bg-primary/40 blur-md transition-all duration-150 ease-linear"
        style={{ height: `${scrollProgress}%` }}
      />
      <div className="space-y-12">
        {items.map((item, index) => (
          <div key={index} className="relative flex items-center odd:flex-row-reverse">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-full absolute left-1/2 -translate-x-1/2 z-10 text-primary-foreground">
              <GraduationCap className="w-5 h-5" />
            </div>
            <Card
              className={cn(
                "w-[calc(50%-2.5rem)] transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl",
                index % 2 === 0 ? "mr-auto animate-slide-in-from-left" : "ml-auto animate-slide-in-from-right",
              )}
              style={{
                animationDelay: `${index * 200}ms`,
                animationFillMode: "forwards",
              }}
            >
              <CardHeader>
                <CardTitle>{item.institution}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="font-semibold">{item.degree}</p>
                <p className="text-sm text-muted-foreground">{item.years}</p>
                <p className="text-sm">{item.description}</p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}
