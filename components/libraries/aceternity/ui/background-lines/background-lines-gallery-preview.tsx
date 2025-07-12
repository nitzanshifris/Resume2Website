"use client";
import React from "react";
import { BackgroundLines } from "./background-lines-base";

// Gallery-specific wrapper that forces consistent sizing
export function BackgroundLinesGalleryPreview({ 
  children, 
  title,
  description,
  svgOptions 
}: { 
  children?: React.ReactNode;
  title?: string;
  description?: string;
  svgOptions?: { duration?: number };
}) {
  return (
    <div className="relative w-full h-[32rem] overflow-hidden">
      <BackgroundLines 
        className="absolute inset-0 w-full h-full flex items-center justify-center flex-col px-4 bg-black"
        svgOptions={svgOptions || { duration: 10 }}
      >
        <div className="text-center z-20 relative">
          <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-600 to-white text-xl md:text-3xl font-sans py-2 font-bold tracking-tight">
            {title || "Background Lines Demo"}
          </h2>
          {description && (
            <p className="max-w-md mx-auto text-xs md:text-sm text-neutral-400 text-center mt-2">
              {description}
            </p>
          )}
          {children}
        </div>
      </BackgroundLines>
    </div>
  );
}

export function BackgroundLinesGalleryHero() {
  return (
    <BackgroundLinesGalleryPreview
      title="Amazing Portfolio"
      description="Creative Solutions with animated background lines that flow beautifully across the screen."
      svgOptions={{ duration: 8 }}
    />
  );
}

export function BackgroundLinesGalleryAbout() {
  return (
    <BackgroundLinesGalleryPreview
      title="About Our Vision"
      description="Innovative design meets cutting-edge technology in perfect harmony."
      svgOptions={{ duration: 12 }}
    />
  );
}

export function BackgroundLinesGalleryServices() {
  return (
    <BackgroundLinesGalleryPreview
      title="Our Services"
      description="Comprehensive solutions tailored to your unique business needs."
      svgOptions={{ duration: 6 }}
    />
  );
}

export function BackgroundLinesGalleryContact() {
  return (
    <BackgroundLinesGalleryPreview
      title="Get In Touch"
      description="Ready to transform your ideas into reality? Contact us today."
      svgOptions={{ duration: 15 }}
    />
  );
}

export function BackgroundLinesGalleryMinimal() {
  return (
    <BackgroundLinesGalleryPreview
      title="Minimal Design"
      description="Less is more - clean and elegant background animation."
      svgOptions={{ duration: 20 }}
    />
  );
}

export function BackgroundLinesGalleryFast() {
  return (
    <BackgroundLinesGalleryPreview
      title="Fast Animation"
      description="Quick and energetic lines for dynamic presentations."
      svgOptions={{ duration: 3 }}
    />
  );
}