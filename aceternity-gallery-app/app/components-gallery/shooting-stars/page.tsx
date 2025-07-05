"use client";

import React from "react";
import { 
  ShootingStarsAndStarsBackgroundDemo,
  ShootingStarsOnlyDemo,
  ColorfulShootingStarsDemo,
  SlowTwinkleDemo
} from "@/components/ui/shooting-stars/shooting-stars-demo";
import { 
  StarsBackgroundDemo,
  DenseStarsDemo,
  NoTwinkleStarsDemo
} from "@/components/ui/stars-background/stars-background-demo";

export default function ShootingStarsGalleryPage() {
  return (
    <div className="min-h-screen bg-neutral-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Shooting Stars & Stars Background
          </h1>
          <p className="text-neutral-400 text-lg">
            Beautiful animated space effects with shooting stars and twinkling starfield backgrounds
          </p>
        </div>

        <div className="space-y-16">
          {/* Combined Demo */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-6">
              Combined Effects
            </h2>
            <div className="h-96 rounded-lg overflow-hidden">
              <ShootingStarsAndStarsBackgroundDemo />
            </div>
          </section>

          {/* Shooting Stars Variations */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-6">
              Shooting Stars Variations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-96 rounded-lg overflow-hidden">
                <ShootingStarsOnlyDemo />
              </div>
              <div className="h-96 rounded-lg overflow-hidden">
                <ColorfulShootingStarsDemo />
              </div>
            </div>
          </section>

          {/* Stars Background Variations */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-6">
              Stars Background Variations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="h-96 rounded-lg overflow-hidden">
                <StarsBackgroundDemo />
              </div>
              <div className="h-96 rounded-lg overflow-hidden">
                <DenseStarsDemo />
              </div>
              <div className="h-96 rounded-lg overflow-hidden">
                <NoTwinkleStarsDemo />
              </div>
            </div>
          </section>

          {/* Slow Twinkle Demo */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-6">
              Slow & Subtle Effects
            </h2>
            <div className="h-96 rounded-lg overflow-hidden">
              <SlowTwinkleDemo />
            </div>
          </section>

          {/* Code Example */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-6">
              Usage Example
            </h2>
            <div className="bg-neutral-800 rounded-lg p-6">
              <pre className="text-neutral-300 overflow-x-auto">
                <code>{`import { ShootingStars } from "@/components/ui/shooting-stars/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background/stars-background";

export function SpaceBackground() {
  return (
    <div className="relative h-screen bg-neutral-900">
      <ShootingStars />
      <StarsBackground />
      <div className="relative z-10">
        {/* Your content here */}
      </div>
    </div>
  );
}`}</code>
              </pre>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}