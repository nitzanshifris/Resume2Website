"use client";

import { 
  FeatureBlockAnimatedCardDemo,
  BackgroundOverlayCardDemo,
  ContentCardDemo
} from "@/component-library/components/ui/cards";

export default function CardsPage() {
  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4 text-center">Cards</h1>
        <p className="text-gray-400 mb-12 text-center">A set of cards that can be used for different use cases</p>
        
        <div className="space-y-16">
          {/* Feature Block Animated Card */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-8">Feature Block Animated Card</h2>
            <div className="flex justify-center">
              <FeatureBlockAnimatedCardDemo />
            </div>
          </section>

          {/* Background Overlay Card */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-8">Background Overlay Card</h2>
            <div className="flex justify-center">
              <BackgroundOverlayCardDemo />
            </div>
          </section>

          {/* Content Card */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-8">Content Card</h2>
            <div className="flex justify-center">
              <ContentCardDemo />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}