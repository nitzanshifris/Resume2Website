"use client";
import React from "react";
import { StarsBackground } from "./stars-background-base";

export function StarsBackgroundDemo() {
  return (
    <div className="h-[40rem] rounded-md bg-neutral-900 flex flex-col items-center justify-center relative w-full">
      <h2 className="relative z-10 text-3xl md:text-5xl md:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-white">
        Stars Background
      </h2>
      <p className="relative z-10 text-neutral-400 max-w-lg mx-auto text-center mt-4">
        A beautiful twinkling starry background
      </p>
      <StarsBackground />
    </div>
  );
}

export function DenseStarsDemo() {
  return (
    <div className="h-[40rem] rounded-md bg-neutral-900 flex flex-col items-center justify-center relative w-full">
      <h2 className="relative z-10 text-3xl md:text-5xl md:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-white">
        Dense Stars
      </h2>
      <StarsBackground starDensity={0.0005} />
    </div>
  );
}

export function NoTwinkleStarsDemo() {
  return (
    <div className="h-[40rem] rounded-md bg-neutral-900 flex flex-col items-center justify-center relative w-full">
      <h2 className="relative z-10 text-3xl md:text-5xl md:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-white">
        Static Stars
      </h2>
      <StarsBackground allStarsTwinkle={false} twinkleProbability={0} />
    </div>
  );
}