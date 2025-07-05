"use client";
import React from "react";
import { ShootingStars } from "./shooting-stars-base";
import { StarsBackground } from "../stars-background/stars-background-base";

export function ShootingStarsAndStarsBackgroundDemo() {
  return (
    <div className="h-[40rem] rounded-md bg-neutral-900 flex flex-col items-center justify-center relative w-full">
      <h2 className="relative flex-col md:flex-row z-10 text-3xl md:text-5xl md:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-white to-white flex items-center gap-2 md:gap-8">
        <span>Shooting Star</span>
        <span className="text-white text-lg font-thin">x</span>
        <span>Star Background</span>
      </h2>
      <ShootingStars />
      <StarsBackground />
    </div>
  );
}

export function ShootingStarsOnlyDemo() {
  return (
    <div className="h-[40rem] rounded-md bg-neutral-900 flex flex-col items-center justify-center relative w-full">
      <h2 className="relative z-10 text-3xl md:text-5xl md:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-white">
        Shooting Stars
      </h2>
      <p className="relative z-10 text-neutral-400 max-w-lg mx-auto text-center mt-4">
        Watch the shooting stars fly across the sky
      </p>
      <ShootingStars />
    </div>
  );
}

export function StarsBackgroundOnlyDemo() {
  return (
    <div className="h-[40rem] rounded-md bg-neutral-900 flex flex-col items-center justify-center relative w-full">
      <h2 className="relative z-10 text-3xl md:text-5xl md:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-white">
        Stars Background
      </h2>
      <p className="relative z-10 text-neutral-400 max-w-lg mx-auto text-center mt-4">
        A twinkling starry background
      </p>
      <StarsBackground />
    </div>
  );
}

export function ColorfulShootingStarsDemo() {
  return (
    <div className="h-[40rem] rounded-md bg-neutral-900 flex flex-col items-center justify-center relative w-full">
      <h2 className="relative z-10 text-3xl md:text-5xl md:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-white">
        Colorful Shooting Stars
      </h2>
      <ShootingStars 
        starColor="#FF00FF"
        trailColor="#00FFFF"
        minSpeed={20}
        maxSpeed={40}
      />
      <StarsBackground starDensity={0.0002} />
    </div>
  );
}

export function SlowTwinkleDemo() {
  return (
    <div className="h-[40rem] rounded-md bg-neutral-900 flex flex-col items-center justify-center relative w-full">
      <h2 className="relative z-10 text-3xl md:text-5xl md:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-white">
        Slow Twinkle Effect
      </h2>
      <ShootingStars minDelay={3000} maxDelay={6000} />
      <StarsBackground 
        minTwinkleSpeed={2}
        maxTwinkleSpeed={4}
        starDensity={0.0003}
      />
    </div>
  );
}