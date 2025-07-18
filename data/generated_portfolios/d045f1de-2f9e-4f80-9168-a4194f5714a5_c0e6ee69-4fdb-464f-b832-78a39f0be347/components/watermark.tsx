"use client"

import { useEffect, useState } from "react"

export function Watermark() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Create array of positions for the repeating pattern
  const rows = 20 // Number of rows
  const cols = 8 // Number of columns
  const positions = []

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      positions.push({
        top: `${row * 150 - 300}px`,
        left: `${col * 200 - 100}px`,
        key: `${row}-${col}`
      })
    }
  }

  return (
    <div 
      className="fixed inset-0 z-50 pointer-events-none select-none overflow-hidden"
      style={{
        transform: "rotate(-45deg) scale(1.5)",
        transformOrigin: "center center",
      }}
    >
      {positions.map((pos) => (
        <div
          key={pos.key}
          className="absolute"
          style={{
            top: pos.top,
            left: pos.left,
            fontSize: "24px",
            fontWeight: "400",
            fontFamily: "Arial, sans-serif",
            color: "rgba(0, 0, 0, 0.06)",
            letterSpacing: "0.05em",
            whiteSpace: "nowrap",
          }}
        >
          resume2web
        </div>
      ))}
    </div>
  )
}