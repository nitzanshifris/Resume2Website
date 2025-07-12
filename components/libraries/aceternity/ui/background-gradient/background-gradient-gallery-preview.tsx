"use client";
import React from "react";
import { BackgroundGradient } from "./background-gradient-base";

// Gallery-specific preview components that work well in constrained spaces
export function BackgroundGradientGalleryProduct() {
  return (
    <div className="flex justify-center items-center p-8">
      <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-white dark:bg-zinc-900">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop&crop=center"
          alt="Product"
          height="200"
          width="300"
          className="object-cover rounded-lg"
        />
        <p className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200">
          Premium Product
        </p>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Beautiful gradient borders that enhance your product showcase with elegant animations.
        </p>
        <div className="mt-4 flex gap-2">
          <div className="px-3 py-1 bg-blue-500 text-white rounded-full text-xs">Featured</div>
          <div className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">Premium</div>
        </div>
      </BackgroundGradient>
    </div>
  );
}

export function BackgroundGradientGalleryFeature() {
  return (
    <div className="flex justify-center items-center p-8">
      <BackgroundGradient className="rounded-[22px] max-w-sm p-6 bg-white dark:bg-zinc-900">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mb-4 flex items-center justify-center">
          <span className="text-white text-xl">🚀</span>
        </div>
        <p className="text-base sm:text-xl text-black mb-2 dark:text-neutral-200 font-semibold">
          Fast Performance
        </p>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Lightning-fast animations and smooth gradient transitions that don't compromise on performance.
        </p>
        <div className="mt-4 text-xs text-neutral-500 dark:text-neutral-500">
          ⚡ Optimized • 🎨 Beautiful • 📱 Responsive
        </div>
      </BackgroundGradient>
    </div>
  );
}

export function BackgroundGradientGalleryProfile() {
  return (
    <div className="flex justify-center items-center p-8">
      <BackgroundGradient className="rounded-[22px] max-w-sm p-6 bg-white dark:bg-zinc-900">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white text-lg font-bold">JS</span>
          </div>
          <div>
            <p className="text-base font-semibold text-black dark:text-neutral-200">
              John Smith
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Frontend Developer
            </p>
          </div>
        </div>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Passionate about creating beautiful user experiences with modern web technologies.
        </p>
        <div className="mt-4 flex gap-2">
          <div className="px-2 py-1 bg-green-500/20 text-green-600 rounded text-xs">React</div>
          <div className="px-2 py-1 bg-blue-500/20 text-blue-600 rounded text-xs">TypeScript</div>
          <div className="px-2 py-1 bg-purple-500/20 text-purple-600 rounded text-xs">Next.js</div>
        </div>
      </BackgroundGradient>
    </div>
  );
}

export function BackgroundGradientGalleryMinimal() {
  return (
    <div className="flex justify-center items-center p-8">
      <BackgroundGradient className="rounded-lg p-8 bg-white dark:bg-zinc-900" animate={false}>
        <div className="text-center">
          <p className="text-lg font-medium text-black dark:text-neutral-200 mb-2">
            Minimal Design
          </p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Clean and simple gradient border without animation for subtle elegance.
          </p>
          <div className="mt-4 w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
        </div>
      </BackgroundGradient>
    </div>
  );
}

export function BackgroundGradientGalleryStatic() {
  return (
    <div className="flex justify-center items-center p-8">
      <BackgroundGradient 
        className="rounded-[22px] p-6 bg-white dark:bg-zinc-900"
        animate={false}
        containerClassName="bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500"
      >
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-white">📊</span>
          </div>
          <p className="text-lg font-semibold text-black dark:text-neutral-200 mb-2">
            Static Gradient
          </p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Beautiful static gradient perfect for highlighting important content sections.
          </p>
        </div>
      </BackgroundGradient>
    </div>
  );
}