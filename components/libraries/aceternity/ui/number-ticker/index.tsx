"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useInView } from "motion/react";

export interface NumberTickerProps {
  value: number;
  direction?: "up" | "down";
  delay?: number;
  className?: string;
  startValue?: number;
  decimalPlaces?: number;
}

export function NumberTicker({
  value,
  direction = "up",
  delay = 0,
  className,
  startValue = 0,
  decimalPlaces = 0,
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayValue, setDisplayValue] = useState(startValue);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!isInView) return;

    const timeout = setTimeout(() => {
      const duration = 2000; // Animation duration in ms
      const frameDuration = 1000 / 60; // 60 fps
      const totalFrames = Math.round(duration / frameDuration);
      const increment = (value - startValue) / totalFrames;

      let frame = 0;
      const counter = setInterval(() => {
        frame++;
        const currentValue = startValue + increment * frame;
        
        if (direction === "up") {
          if (frame === totalFrames || currentValue >= value) {
            setDisplayValue(value);
            clearInterval(counter);
          } else {
            setDisplayValue(currentValue);
          }
        } else {
          if (frame === totalFrames || currentValue <= value) {
            setDisplayValue(value);
            clearInterval(counter);
          } else {
            setDisplayValue(currentValue);
          }
        }
      }, frameDuration);

      return () => clearInterval(counter);
    }, delay);

    return () => clearTimeout(timeout);
  }, [value, startValue, direction, delay, isInView]);

  const formattedValue = displayValue.toFixed(decimalPlaces);

  return (
    <span ref={ref} className={cn("inline-block tabular-nums", className)}>
      {formattedValue}
    </span>
  );
}