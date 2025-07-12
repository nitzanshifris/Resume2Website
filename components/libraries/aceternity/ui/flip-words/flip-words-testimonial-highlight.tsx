"use client";
import React from "react";
import { FlipWords } from "./flip-words-base";
import { cn } from "../../lib/utils";

interface FlipWordsTestimonialHighlightProps {
  words: string[];
  testimonial: string;
  author: string;
  role?: string;
  className?: string;
  duration?: number;
}

export const FlipWordsTestimonialHighlight = ({
  words,
  testimonial,
  author,
  role,
  className,
  duration = 3000,
}: FlipWordsTestimonialHighlightProps) => {
  return (
    <div className={cn("max-w-2xl mx-auto text-center", className)}>
      <blockquote className="relative">
        <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300">
          "Our team is{" "}
          <FlipWords 
            words={words} 
            duration={duration}
            className="font-semibold text-indigo-600 dark:text-indigo-400"
          />
          {testimonial}"
        </p>
        <footer className="mt-6">
          <div className="flex items-center justify-center space-x-3">
            <div className="text-base">
              <div className="font-semibold text-gray-900 dark:text-white">
                {author}
              </div>
              {role && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {role}
                </div>
              )}
            </div>
          </div>
        </footer>
      </blockquote>
    </div>
  );
};