// @ts-nocheck
"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { cn } from "@/lib/utils";

interface HyperTextProps {
  children: string;
  className?: string;
  duration?: number;
  delay?: number;
  as?: React.ElementType;
  startOnView?: boolean;
  animateOnHover?: boolean;
  characterSet?: string[];
}

const DEFAULT_CHARACTER_SET = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(65 + i)
);

export function HyperText({
  children,
  className,
  duration = 800,
  delay = 0,
  as: Component = "div",
  startOnView = false,
  animateOnHover = true,
  characterSet = DEFAULT_CHARACTER_SET,
}: HyperTextProps) {
  const [displayText, setDisplayText] = useState(children);
  const [isAnimating, setIsAnimating] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true });
  const animationFrameId = useRef<number | null>(null);
  const timeoutIds = useRef<number[]>([]);

  const scrambleText = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const chars = children.split("");
    const animationDuration = duration / chars.length;
    
    // Clear any existing timeouts
    timeoutIds.current.forEach(clearTimeout);
    timeoutIds.current = [];
    
    // Start scrambling all characters
    const interval = setInterval(() => {
      setDisplayText(
        chars
          .map((char, index) => {
            if (char === " ") return " ";
            const randomChar =
              characterSet[Math.floor(Math.random() * characterSet.length)];
            return randomChar;
          })
          .join("")
      );
    }, 50);

    // Reveal characters one by one
    chars.forEach((char, index) => {
      const timeoutId = setTimeout(() => {
        setDisplayText((prev) => {
          const prevChars = prev.split("");
          prevChars[index] = char;
          return prevChars.join("");
        });

        // Clear interval and reset when animation completes
        if (index === chars.length - 1) {
          clearInterval(interval);
          setIsAnimating(false);
        }
      }, delay + index * animationDuration);
      
      timeoutIds.current.push(timeoutId);
    });
  };

  // Handle animation on view
  useEffect(() => {
    if (startOnView && isInView && !isAnimating) {
      scrambleText();
    }
  }, [isInView, startOnView]);

  // Cleanup
  useEffect(() => {
    return () => {
      timeoutIds.current.forEach(clearTimeout);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (animateOnHover && !isAnimating) {
      scrambleText();
    }
  };

  return (
    <Component
      ref={ref}
      className={cn(
        "inline-block cursor-default font-mono",
        animateOnHover && "cursor-pointer",
        className
      )}
      onMouseEnter={handleMouseEnter}
    >
      {displayText}
    </Component>
  );
}