"use client"
import { cn } from "@/lib/utils"
import { useEffect, useRef } from "react"
import { createNoise3D } from "simplex-noise"
import { useColorMode } from "@/contexts/color-mode-context"

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors,
  waveWidth,
  backgroundFill,
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  ...props
}: {
  children?: any
  className?: string
  containerClassName?: string
  colors?: string[]
  waveWidth?: number
  backgroundFill?: string
  blur?: number
  speed?: "slow" | "fast"
  waveOpacity?: number
  [key: string]: any
}) => {
  const noise = createNoise3D()
  const { colorMode } = useColorMode()
  let w: number, h: number, nt: number, i: number, x: number, ctx: any, canvas: any
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const getSpeed = () => {
    switch (speed) {
      case "slow":
        return 0.001
      case "fast":
        return 0.002
      default:
        return 0.001
    }
  }

  const init = () => {
    canvas = canvasRef.current
    ctx = canvas.getContext("2d")
    w = ctx.canvas.width = window.innerWidth
    h = ctx.canvas.height = window.innerHeight
    ctx.filter = `blur(${blur}px)`
    nt = 0
    window.onresize = () => {
      w = ctx.canvas.width = window.innerWidth
      h = ctx.canvas.height = window.innerHeight
      ctx.filter = `blur(${blur}px)`
    }
    render()
  }

  const waveColors = colors ?? ["#38bdf8", "#818cf8", "#c084fc", "#e879f9", "#22d3ee"]
  const drawWave = (n: number) => {
    nt += getSpeed()
    for (i = 0; i < n; i++) {
      ctx.beginPath()
      ctx.lineWidth = waveWidth ?? 50
      ctx.strokeStyle = waveColors[i % waveColors.length]
      for (x = 0; x < w; x += 5) {
        var y = noise(x / 800, 0.3 * i, nt) * 100
        ctx.lineTo(x, y + h * 0.5) // Center the waves
      }
      ctx.stroke()
      ctx.closePath()
    }
  }

  let animationFrameId: number
  const render = () => {
    ctx.fillStyle = backgroundFill ?? (colorMode === "light" ? "#ffffff" : "#0a0a0a")
    ctx.globalAlpha = waveOpacity ?? 0.5
    ctx.fillRect(0, 0, w, h)
    drawWave(5)
    animationFrameId = window.requestAnimationFrame(render)
  }

  useEffect(() => {
    init()
    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [colors, colorMode])

  return (
    <div className={cn("h-screen flex flex-col items-center justify-center bg-background", containerClassName)}>
      <canvas className="absolute inset-0 z-0" ref={canvasRef} id="canvas"></canvas>
      <div className={cn("relative z-10", className)} {...props}>
        {children}
      </div>
    </div>
  )
}
