"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  color: string
  opacity: number
  rotation: number
  shape: "circle" | "star" | "square" | "triangle"
}

interface ParticleSystemProps {
  isActive: boolean
  width: number
  height: number
  intensity?: "low" | "medium" | "high"
  particleType?: "magical" | "dissolve" | "standard"
}

export function ParticleSystem({
  isActive,
  width,
  height,
  intensity = "medium",
  particleType = "standard",
}: ParticleSystemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>()
  const sourceRef = useRef<{ x: number; y: number }>({ x: width / 2, y: height / 2 })

  // Brand gradient colors
  const brandColors = [
    "#10B981", // emerald-500
    "#0EA5E9", // sky-400
    "#3B82F6", // blue-600
  ]

  // Determine particle count based on intensity
  const getParticleCount = () => {
    switch (intensity) {
      case "low":
        return 100
      case "medium":
        return 200
      case "high":
        return 300
      default:
        return 200
    }
  }

  // Get brand color variations
  const getBrandColor = (type: string): string => {
    switch (type) {
      case "magical":
        // Use brand gradient colors with variations
        const baseColor = brandColors[Math.floor(Math.random() * brandColors.length)]
        return baseColor
      case "dissolve":
        // Slightly muted brand colors for dissolve effect
        const dissolveColors = ["#059669", "#0284C7", "#2563EB"] // Darker variants
        return dissolveColors[Math.floor(Math.random() * dissolveColors.length)]
      default:
        return brandColors[Math.floor(Math.random() * brandColors.length)]
    }
  }

  // Generate particles based on type
  const generateParticles = () => {
    const count = getParticleCount()
    const centerX = width / 2
    const centerY = height / 2

    switch (particleType) {
      case "magical":
        return Array.from({ length: count }, () => {
          // For magical effect, particles emerge from center in a more controlled pattern
          const angle = Math.random() * Math.PI * 2
          const distance = Math.random() * 300
          const speed = Math.random() * 2 + 1

          return {
            x: centerX,
            y: centerY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 0,
            maxLife: Math.random() * 180 + 120,
            size: Math.random() * 4 + 1,
            color: getBrandColor("magical"),
            opacity: Math.random() * 0.4 + 0.4,
            rotation: Math.random() * Math.PI * 2,
            shape: getRandomShape(),
          }
        })

      case "dissolve":
        return Array.from({ length: count }, () => {
          // For dissolve effect, particles start from a CV-shaped area
          const x = centerX + (Math.random() - 0.5) * 400
          const y = centerY + (Math.random() - 0.5) * 500
          const angle = Math.atan2(y - centerY, x - centerX)
          const speed = Math.random() * 3 + 0.5

          return {
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 0,
            maxLife: Math.random() * 150 + 60,
            size: Math.random() * 3 + 0.5,
            color: getBrandColor("dissolve"),
            opacity: Math.random() * 0.5 + 0.3,
            rotation: Math.random() * Math.PI * 2,
            shape: Math.random() > 0.7 ? getRandomShape() : "circle",
          }
        })

      default:
        return Array.from({ length: count }, () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 6,
          life: 0,
          maxLife: Math.random() * 120 + 60,
          size: Math.random() * 3 + 1,
          color: getBrandColor("standard"),
          opacity: Math.random() * 0.4 + 0.2,
          rotation: Math.random() * Math.PI * 2,
          shape: "circle",
        }))
    }
  }

  // Get random shape for particles
  const getRandomShape = (): "circle" | "star" | "square" | "triangle" => {
    const shapes: ("circle" | "star" | "square" | "triangle")[] = ["circle", "star", "square", "triangle"]
    return shapes[Math.floor(Math.random() * shapes.length)]
  }

  // Draw different particle shapes
  const drawParticle = (ctx: CanvasRenderingContext2D, particle: Particle) => {
    ctx.save()
    ctx.globalAlpha = particle.opacity * (1 - particle.life / particle.maxLife)
    ctx.fillStyle = particle.color
    ctx.translate(particle.x, particle.y)
    ctx.rotate(particle.rotation)

    switch (particle.shape) {
      case "star":
        drawStar(ctx, 0, 0, 5, particle.size, particle.size / 2)
        break
      case "square":
        ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size)
        break
      case "triangle":
        drawTriangle(ctx, 0, 0, particle.size)
        break
      default:
        ctx.beginPath()
        ctx.arc(0, 0, particle.size, 0, Math.PI * 2)
        ctx.fill()
    }

    ctx.restore()
  }

  // Draw a star shape
  const drawStar = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    spikes: number,
    outerRadius: number,
    innerRadius: number,
  ) => {
    let rot = (Math.PI / 2) * 3
    let x = cx
    let y = cy
    const step = Math.PI / spikes

    ctx.beginPath()
    ctx.moveTo(cx, cy - outerRadius)

    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius
      y = cy + Math.sin(rot) * outerRadius
      ctx.lineTo(x, y)
      rot += step

      x = cx + Math.cos(rot) * innerRadius
      y = cy + Math.sin(rot) * innerRadius
      ctx.lineTo(x, y)
      rot += step
    }

    ctx.lineTo(cx, cy - outerRadius)
    ctx.closePath()
    ctx.fill()
  }

  // Draw a triangle
  const drawTriangle = (ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) => {
    ctx.beginPath()
    ctx.moveTo(cx, cy - size)
    ctx.lineTo(cx + size, cy + size)
    ctx.lineTo(cx - size, cy + size)
    ctx.closePath()
    ctx.fill()
  }

  // Add particles over time for continuous effect
  const addParticles = (count: number) => {
    if (particleType === "magical") {
      const newParticles = Array.from({ length: count }, () => {
        const angle = Math.random() * Math.PI * 2
        const speed = Math.random() * 2 + 1

        return {
          x: sourceRef.current.x,
          y: sourceRef.current.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 0,
          maxLife: Math.random() * 180 + 120,
          size: Math.random() * 4 + 1,
          color: getBrandColor("magical"),
          opacity: Math.random() * 0.4 + 0.4,
          rotation: Math.random() * Math.PI * 2,
          shape: getRandomShape(),
        }
      })

      particlesRef.current = [...particlesRef.current, ...newParticles]
    }
  }

  useEffect(() => {
    if (!isActive) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Initialize particles
    particlesRef.current = generateParticles()

    // Set source point
    sourceRef.current = { x: width / 2, y: height / 2 }

    let lastTime = 0
    const animate = (time: number) => {
      ctx.clearRect(0, 0, width, height)

      // Add new particles periodically for continuous magical effect
      if (particleType === "magical" && time - lastTime > 100) {
        addParticles(5)
        lastTime = time
      }

      particlesRef.current.forEach((particle, index) => {
        // Update particle position
        particle.x += particle.vx
        particle.y += particle.vy
        particle.life++

        // For magical particles, add some waviness
        if (particleType === "magical") {
          particle.vx += Math.sin(particle.life * 0.05) * 0.02
          particle.vy += Math.cos(particle.life * 0.05) * 0.02
          particle.rotation += 0.01
        }

        // Remove dead particles
        if (particle.life >= particle.maxLife) {
          particlesRef.current.splice(index, 1)
          return
        }

        // Draw the particle
        drawParticle(ctx, particle)
      })

      if (isActive) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isActive, width, height, particleType, intensity])

  return <canvas ref={canvasRef} width={width} height={height} className="absolute inset-0 pointer-events-none z-20" />
}
