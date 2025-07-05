"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

interface AnimatedCircularProgressBarProps {
  className?: string;
  max?: number;
  min?: number;
  value?: number;
  gaugePrimaryColor?: string;
  gaugeSecondaryColor?: string;
}

export function AnimatedCircularProgressBar({
  className,
  max = 100,
  min = 0,
  value = 0,
  gaugePrimaryColor = "#3b82f6",
  gaugeSecondaryColor = "#e5e7eb",
}: AnimatedCircularProgressBarProps) {
  const radius = 60;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const percent = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const strokeDashoffset = circumference - percent * circumference;

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke={gaugeSecondaryColor}
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={gaugePrimaryColor}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
      </svg>
      <span className="mt-2 text-lg font-bold">{Math.round(percent * 100)}%</span>
    </div>
  );
}

export default AnimatedCircularProgressBar; 