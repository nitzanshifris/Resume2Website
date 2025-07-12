"use client";

import React, { useRef, useEffect } from "react";
import { useMousePosition } from "@/hooks/useMousePosition";

interface SpotlightProps {
  className?: string;
  size?: number;
}

export function Spotlight({ className = "", size = 400 }: SpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePosition = useMousePosition();

  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = mousePosition.x - rect.left;
      const y = mousePosition.y - rect.top;
      
      containerRef.current.style.setProperty('--mouse-x', `${x}px`);
      containerRef.current.style.setProperty('--mouse-y', `${y}px`);
    }
  }, [mousePosition]);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <div
        className="absolute opacity-0 hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(${size}px circle at var(--mouse-x) var(--mouse-y), rgba(168, 85, 247, 0.1), transparent 40%)`,
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
}