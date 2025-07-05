"use client";
import React from "react";
import {
  GlowingStarsBackgroundCard,
  GlowingStarsDescription,
  GlowingStarsTitle,
} from "./glowing-stars-base";

export function GlowingStarsBackgroundCardPreview() {
  return (
    <div className="flex py-20 items-center justify-center antialiased">
      <GlowingStarsBackgroundCard>
        <GlowingStarsTitle>Next.js 14</GlowingStarsTitle>
        <div className="flex justify-between items-end">
          <GlowingStarsDescription>
            The power of full-stack to the frontend. Read the release notes.
          </GlowingStarsDescription>
          <div className="h-8 w-8 rounded-full bg-[hsla(0,0%,100%,.1)] flex items-center justify-center">
            <Icon />
          </div>
        </div>
      </GlowingStarsBackgroundCard>
    </div>
  );
}

export function GlowingStarsDemo() {
  const defaultCards = [
    {
      title: "Next.js 14",
      description: "The power of full-stack to the frontend. Read the release notes.",
    },
    {
      title: "React 18",
      description: "The latest version of React with concurrent features and improved performance.",
    },
    {
      title: "TypeScript",
      description: "Build with confidence using static type checking and modern JavaScript features.",
    },
  ];

  return (
    <div className="flex flex-wrap gap-8 items-center justify-center antialiased py-8">
      {defaultCards.map((card, index) => (
        <GlowingStarsBackgroundCard key={index}>
          <GlowingStarsTitle>{card.title}</GlowingStarsTitle>
          <div className="flex justify-between items-end">
            <GlowingStarsDescription>
              {card.description}
            </GlowingStarsDescription>
            <div className="h-8 w-8 rounded-full bg-[hsla(0,0%,100%,.1)] flex items-center justify-center">
              <Icon />
            </div>
          </div>
        </GlowingStarsBackgroundCard>
      ))}
    </div>
  );
}

const Icon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="h-4 w-4 text-white stroke-2"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
      />
    </svg>
  );
};