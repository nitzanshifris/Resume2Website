"use client";
import React from "react";
import { ThreeDMarquee } from "./3d-marquee-base";

// Sample images for gallery previews - using Aceternity component screenshots
const sampleImages = [
  "https://assets.aceternity.com/3d-card.png",
  "https://assets.aceternity.com/animated-modal.png",
  "https://assets.aceternity.com/animated-testimonials.webp",
  "https://assets.aceternity.com/Tooltip_luwy44.png",
  "https://assets.aceternity.com/github-globe.png",
  "https://assets.aceternity.com/glare-card.png",
  "https://assets.aceternity.com/layout-grid.png",
  "https://assets.aceternity.com/flip-text.png",
  "https://assets.aceternity.com/hero-highlight.png",
  "https://assets.aceternity.com/carousel.webp",
  "https://assets.aceternity.com/placeholders-and-vanish-input.png",
  "https://assets.aceternity.com/shooting-stars-and-stars-background.png",
  "https://assets.aceternity.com/signup-form.png",
  "https://assets.aceternity.com/stars_sxle3d.png",
  "https://assets.aceternity.com/spotlight-new.webp",
  "https://assets.aceternity.com/Spotlight_ar5jpr.png",
  "https://assets.aceternity.com/Parallax_Scroll_pzlatw_anfkh7.png",
  "https://assets.aceternity.com/tabs.png",
  "https://assets.aceternity.com/Tracing_Beam_npujte.png",
  "https://assets.aceternity.com/typewriter-effect.png",
  "https://assets.aceternity.com/glowing-effect.webp",
  "https://assets.aceternity.com/hover-border-gradient.png",
  "https://assets.aceternity.com/Infinite_Moving_Cards_evhzur.png",
  "https://assets.aceternity.com/Lamp_hlq3ln.png",
  "https://assets.aceternity.com/macbook-scroll.png",
  "https://assets.aceternity.com/Meteors_fye3ys.png",
  "https://assets.aceternity.com/Moving_Border_yn78lv.png",
  "https://assets.aceternity.com/multi-step-loader.png",
  "https://assets.aceternity.com/vortex.png",
  "https://assets.aceternity.com/wobble-card.png",
  "https://assets.aceternity.com/world-map.webp",
  "https://assets.aceternity.com/aurora-background.png",
];

// Gallery-specific preview components with consistent sizing
export function ThreeDMarqueeGalleryBasic() {
  return (
    <div className="relative w-full aspect-square max-h-[40rem] overflow-hidden bg-white dark:bg-black">
      <ThreeDMarquee 
        images={sampleImages} 
        className="h-full"
      />
    </div>
  );
}

export function ThreeDMarqueeGalleryPortfolio() {
  const portfolioImages = sampleImages;

  return (
    <div className="relative w-full aspect-square max-h-[40rem] overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
      <ThreeDMarquee 
        images={portfolioImages} 
        className="h-full"
      />
    </div>
  );
}

export function ThreeDMarqueeGalleryCompact() {
  const compactImages = sampleImages.slice(0, 20);

  return (
    <div className="relative w-full aspect-square max-h-[40rem] overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
      <ThreeDMarquee 
        images={compactImages} 
        className="h-full"
      />
    </div>
  );
}

export function ThreeDMarqueeGalleryTestimonials() {
  // Using Aceternity component images
  const testimonialImages = sampleImages;

  return (
    <div className="relative w-full aspect-square max-h-[40rem] overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
      <ThreeDMarquee 
        images={testimonialImages} 
        className="h-full"
      />
    </div>
  );
}