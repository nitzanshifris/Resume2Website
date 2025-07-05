"use client";
import React from "react";
import { BackgroundBeams } from "./background-beams-base";

// Gallery-specific preview components with consistent sizing
export function BackgroundBeamsGalleryBasic() {
  return (
    <div className="relative w-full h-[32rem] bg-neutral-950 overflow-hidden">
      <BackgroundBeams />
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Background Beams
          </h2>
          <p className="text-neutral-300 max-w-md">
            Animated beam effects that create dynamic lighting patterns
          </p>
        </div>
      </div>
    </div>
  );
}

export function BackgroundBeamsGalleryHero() {
  return (
    <div className="relative w-full h-[32rem] bg-gradient-to-b from-neutral-950 to-neutral-900 overflow-hidden">
      <BackgroundBeams />
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center max-w-2xl px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Experience the Power
          </h1>
          <p className="text-lg text-neutral-300 mb-8">
            Harness cutting-edge technology with beautiful animated backgrounds that captivate and engage
          </p>
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            Explore Now
          </button>
        </div>
      </div>
    </div>
  );
}

export function BackgroundBeamsGalleryFeature() {
  return (
    <div className="relative w-full h-[32rem] bg-neutral-950 overflow-hidden">
      <BackgroundBeams />
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center max-w-lg px-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <div className="text-2xl mb-2">⚡</div>
              <div className="text-sm text-white font-medium">Lightning Fast</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <div className="text-2xl mb-2">🔒</div>
              <div className="text-sm text-white font-medium">Secure</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <div className="text-2xl mb-2">🌟</div>
              <div className="text-sm text-white font-medium">Premium</div>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-white">
            Feature Showcase
          </h3>
        </div>
      </div>
    </div>
  );
}

export function BackgroundBeamsGalleryMinimal() {
  return (
    <div className="relative w-full h-[32rem] bg-black overflow-hidden">
      <BackgroundBeams />
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <div className="text-white text-2xl">✦</div>
          </div>
          <h3 className="text-2xl font-semibold text-white">
            Minimal Beams
          </h3>
        </div>
      </div>
    </div>
  );
}