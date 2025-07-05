"use client";
import React from "react";
import { AuroraBackground } from "./aurora-background-base";

// Gallery-specific preview components with consistent sizing
export function AuroraBackgroundGalleryBasic() {
  return (
    <div className="relative w-full h-[32rem] overflow-hidden">
      <AuroraBackground 
        className="h-[32rem] w-full flex items-center justify-center"
        showRadialGradient={true}
      >
        <div className="text-center z-10 relative">
          <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-4">
            Aurora Background
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-md">
            Beautiful animated gradient background with aurora-like effects
          </p>
        </div>
      </AuroraBackground>
    </div>
  );
}

export function AuroraBackgroundGalleryHero() {
  return (
    <div className="relative w-full h-[32rem] overflow-hidden">
      <AuroraBackground 
        className="h-[32rem] w-full flex items-center justify-center"
        showRadialGradient={false}
      >
        <div className="text-center z-10 relative max-w-2xl px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-6">
            Welcome to the Future
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Experience next-generation design with stunning aurora effects and modern aesthetics
          </p>
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            Get Started
          </button>
        </div>
      </AuroraBackground>
    </div>
  );
}

export function AuroraBackgroundGalleryMinimal() {
  return (
    <div className="relative w-full h-[32rem] overflow-hidden">
      <AuroraBackground 
        className="h-[32rem] w-full flex items-center justify-center bg-white dark:bg-black"
        showRadialGradient={true}
      >
        <div className="text-center z-10 relative">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <div className="text-white text-2xl">✨</div>
          </div>
          <h3 className="text-2xl font-semibold text-black dark:text-white">
            Minimal Aurora
          </h3>
        </div>
      </AuroraBackground>
    </div>
  );
}

export function AuroraBackgroundGalleryContent() {
  return (
    <div className="relative w-full h-[32rem] overflow-hidden">
      <AuroraBackground 
        className="h-[32rem] w-full flex items-center justify-center"
        showRadialGradient={true}
      >
        <div className="text-center z-10 relative max-w-lg px-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white/10 dark:bg-black/20 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl mb-2">🚀</div>
              <div className="text-sm text-black dark:text-white font-medium">Fast</div>
            </div>
            <div className="bg-white/10 dark:bg-black/20 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl mb-2">💎</div>
              <div className="text-sm text-black dark:text-white font-medium">Premium</div>
            </div>
            <div className="bg-white/10 dark:bg-black/20 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl mb-2">🎯</div>
              <div className="text-sm text-black dark:text-white font-medium">Focused</div>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-black dark:text-white">
            Content with Aurora
          </h3>
        </div>
      </AuroraBackground>
    </div>
  );
}