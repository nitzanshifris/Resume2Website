"use client";
import React from "react";
import { FlipWords } from "./flip-words-base";
import { cn } from "../../lib/utils";

interface FlipWordsFeatureShowcaseProps {
  words: string[];
  title: string;
  description: string;
  className?: string;
  duration?: number;
}

export const FlipWordsFeatureShowcase = ({
  words,
  title,
  description,
  className,
  duration = 3500,
}: FlipWordsFeatureShowcaseProps) => {
  return (
    <div className={cn("space-y-4", className)}>
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
        {title}{" "}
        <FlipWords 
          words={words} 
          duration={duration}
          className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400"
        />
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
        {description}
      </p>
    </div>
  );
};