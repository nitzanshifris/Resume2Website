"use client";

import { CardHoverEffectDemoV2 } from "@/component-library/components/ui/card-hover-effect";

export default function HoverEffectV2Page() {
  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Hover Effect V2</h1>
        <p className="text-gray-400 mb-12">Hover over the cards and the effect slides to the currently hovered card.</p>
        <CardHoverEffectDemoV2 />
      </div>
    </div>
  );
}