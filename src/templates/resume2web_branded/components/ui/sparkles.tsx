"use client"
import { useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"

export const Sparkles = ({
  id = "sparkles",
  background = "transparent",
  minSize = 0.4,
  maxSize = 1,
  particleDensity = 1200,
  className,
  particleColor = "#FFFFFF",
}: {
  id?: string
  background?: string
  minSize?: number
  maxSize?: number
  particleDensity?: number
  className?: string
  particleColor?: string
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [sparkles, setSparkles] = useState<any[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const initSparkles = () => {
      const newSparkles = []
      for (let i = 0; i < particleDensity; i++) {
        newSparkles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * (maxSize - minSize) + minSize,
          alpha: Math.random(),
          speed: Math.random() * 0.5 + 0.1,
        })
      }
      setSparkles(newSparkles)
    }

    initSparkles()

    let animationFrameId: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      sparkles.forEach((s) => {
        s.y -= s.speed
        if (s.y < 0) {
          s.y = canvas.height
        }
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.size, 0, 2 * Math.PI)
        ctx.fillStyle = `rgba(${Number.parseInt(
          particleColor.slice(1, 3),
          16,
        )}, ${Number.parseInt(particleColor.slice(3, 5), 16)}, ${Number.parseInt(particleColor.slice(5, 7), 16)}, ${s.alpha})`
        ctx.fill()
      })
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [particleDensity, minSize, maxSize, particleColor])

  return (
    <div className={cn("relative w-full h-full", className)}>
      <canvas
        id={id}
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: background,
        }}
      />
    </div>
  )
}
