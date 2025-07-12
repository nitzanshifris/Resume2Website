"use client";
import React from "react";
import { Boxes } from "./background-boxes-base";
import { cn } from "@/lib/utils";

// Gallery-specific wrapper that forces consistent sizing
export function BackgroundBoxesGalleryPreview({ 
  title,
  description,
  className 
}: { 
  title?: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className="relative w-full h-[32rem] overflow-hidden bg-slate-900 flex flex-col items-center justify-center rounded-lg">
      <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
      
      <Boxes />
      <div className="text-center z-20 relative">
        <h1 className={cn("md:text-4xl text-xl text-white relative z-20", className)}>
          {title || "Background Boxes"}
        </h1>
        {description && (
          <p className="text-center mt-2 text-neutral-300 relative z-20 max-w-md">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

export function BackgroundBoxesGalleryHero() {
  return (
    <BackgroundBoxesGalleryPreview
      title="Amazing Portfolio"
      description="Showcase your work with stunning animated background boxes that respond to user interaction"
    />
  );
}

export function BackgroundBoxesGalleryFullscreen() {
  return (
    <BackgroundBoxesGalleryPreview
      title="Fullscreen Experience"
      description="Immersive background animation perfect for hero sections and landing pages"
      className="text-2xl md:text-5xl font-bold"
    />
  );
}

export function BackgroundBoxesGalleryMinimal() {
  return (
    <BackgroundBoxesGalleryPreview
      title="Minimal Design"
      description="Clean and subtle animation that doesn't distract from your content"
      className="text-lg md:text-2xl font-light"
    />
  );
}

export function BackgroundBoxesGalleryWithCard() {
  return (
    <div className="relative w-full h-[32rem] overflow-hidden bg-slate-900 flex flex-col items-center justify-center rounded-lg">
      <div className="absolute inset-0 w-full h-full bg-slate-900 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
      
      <Boxes />
      <div className="relative z-20 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 max-w-md mx-4">
        <h2 className="text-xl font-bold text-white mb-3">Featured Content</h2>
        <p className="text-neutral-300 text-sm leading-relaxed">
          Combine the animated background with overlay cards for engaging content presentation.
        </p>
        <div className="mt-4 flex gap-2">
          <div className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">Animation</div>
          <div className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">Interactive</div>
        </div>
      </div>
    </div>
  );
}