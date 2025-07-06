"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface MagicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  gradientColor?: string;
  gradientSize?: number;
}

export function MagicCard({
  children,
  className,
  gradientColor = "#262626",
  gradientSize = 200,
  ...props
}: MagicCardProps) {
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPosition({ x, y });
  };

  return (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden rounded-xl bg-neutral-100 p-8 dark:bg-neutral-900",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {/* Gradient effect */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `
            radial-gradient(
              ${gradientSize}px circle at ${position.x}px ${position.y}px,
              ${gradientColor},
              transparent 100%
            )
          `,
        }}
      />

      {/* Border gradient */}
      <div 
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `
            radial-gradient(
              600px circle at ${position.x}px ${position.y}px,
              rgba(255, 255, 255, 0.1),
              transparent 40%
            )
          `,
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}