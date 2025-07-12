"use client";
import React from "react";
import { BackgroundBeamsWithCollision } from "./background-beams-with-collision-base";

// Gallery-specific preview components with consistent sizing
export function BackgroundBeamsWithCollisionGalleryBasic() {
  return (
    <div className="relative w-full h-[32rem] overflow-hidden">
      <BackgroundBeamsWithCollision className="h-[32rem]">
        <h2 className="text-2xl relative z-20 md:text-4xl lg:text-5xl font-bold text-center text-black dark:text-white font-sans tracking-tight">
          Interactive Beams
        </h2>
      </BackgroundBeamsWithCollision>
    </div>
  );
}

export function BackgroundBeamsWithCollisionGalleryHero() {
  return (
    <div className="relative w-full h-[32rem] overflow-hidden">
      <BackgroundBeamsWithCollision className="h-[32rem]">
        <div className="text-center relative z-20 max-w-2xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black dark:text-white font-sans tracking-tight mb-4">
            Collision Effects
          </h2>
          <p className="text-neutral-600 dark:text-neutral-300 text-lg">
            Experience dynamic beam interactions with collision detection and explosion effects
          </p>
        </div>
      </BackgroundBeamsWithCollision>
    </div>
  );
}

export function BackgroundBeamsWithCollisionGalleryMinimal() {
  return (
    <div className="relative w-full h-[32rem] overflow-hidden">
      <BackgroundBeamsWithCollision className="h-[32rem] bg-white dark:bg-black">
        <div className="flex items-center justify-center h-full relative z-20">
          <div className="w-24 h-24 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl">💫</span>
          </div>
        </div>
      </BackgroundBeamsWithCollision>
    </div>
  );
}

export function BackgroundBeamsWithCollisionGalleryInteractive() {
  return (
    <div className="relative w-full h-[32rem] overflow-hidden">
      <BackgroundBeamsWithCollision className="h-[32rem]">
        <div className="text-center relative z-20">
          <h3 className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-6">
            Interactive Demo
          </h3>
          <p className="text-neutral-600 dark:text-neutral-300 mb-8">
            Watch the beams collide and create explosion effects
          </p>
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            Observe Collisions
          </button>
        </div>
      </BackgroundBeamsWithCollision>
    </div>
  );
}