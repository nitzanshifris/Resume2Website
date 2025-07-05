"use client";
import React from "react";
import { FlipWords } from "./flip-words-base";
import { cn } from "@/lib/utils";

interface FlipWordsHeroTitleProps {
  words: string[];
  prefix?: string;
  suffix?: string;
  className?: string;
  duration?: number;
}

export const FlipWordsHeroTitle = ({
  words,
  prefix = "Build",
  suffix = "with Aceternity UI",
  className,
  duration = 4000,
}: FlipWordsHeroTitleProps) => {
  return (
    <div className={cn("text-center", className)}>
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
        {prefix && <span>{prefix} </span>}
        <FlipWords 
          words={words} 
          duration={duration}
          className="text-blue-600 dark:text-blue-400"
        />
        {suffix && <span className="block mt-2">{suffix}</span>}
      </h1>
    </div>
  );
};