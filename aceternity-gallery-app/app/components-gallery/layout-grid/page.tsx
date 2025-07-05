"use client";

import React from "react";
import { 
  LayoutGridDemo, 
  LayoutGridGalleryPreview, 
  LayoutGridPortfolio, 
  LayoutGridProducts 
} from "@/components/ui/layout-grid";

export default function LayoutGridGalleryPage() {
  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Layout Grid Components</h1>
          <p className="text-gray-400 text-lg">
            A layout effect that animates the grid item on click, powered by Framer Motion layout.
          </p>
        </div>

        <div className="space-y-12">
          {/* Default Layout Grid */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-6">Default Layout Grid</h2>
            <div className="bg-zinc-900 rounded-lg p-6">
              <LayoutGridGalleryPreview />
            </div>
          </section>

          {/* Portfolio Variant */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-6">Portfolio Layout</h2>
            <div className="bg-zinc-900 rounded-lg p-6">
              <LayoutGridPortfolio />
            </div>
          </section>

          {/* Products Variant */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-6">Products Layout</h2>
            <div className="bg-zinc-900 rounded-lg p-6">
              <LayoutGridProducts />
            </div>
          </section>

          {/* Full Size Demo */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-6">Full Size Demo</h2>
            <div className="bg-zinc-900 rounded-lg p-6">
              <LayoutGridDemo containerClassName="h-96 w-full relative overflow-hidden rounded-lg" />
            </div>
          </section>
        </div>

        {/* Usage Example */}
        <div className="mt-16 bg-zinc-900 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-white mb-4">Usage Example</h2>
          <pre className="bg-black rounded p-4 text-green-400 text-sm overflow-x-auto">
{`import { LayoutGrid } from "@/components/ui/layout-grid";

const cards = [
  {
    id: 1,
    content: <div>Your content here</div>,
    className: "md:col-span-2",
    thumbnail: "image-url.jpg",
  },
  // ... more cards
];

export function MyLayoutGrid() {
  return (
    <div className="h-screen py-20 w-full">
      <LayoutGrid cards={cards} />
    </div>
  );
}`}
          </pre>
        </div>

        {/* Features */}
        <div className="mt-12 bg-zinc-900 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-white mb-4">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Interactive Grid</h3>
              <p>Click on any card to expand it with smooth layout animations.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Framer Motion Layout</h3>
              <p>Powered by Framer Motion&apos;s layoutId for seamless transitions.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Responsive Design</h3>
              <p>Adapts from single column on mobile to 3-column grid on desktop.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Customizable Cards</h3>
              <p>Each card can have custom content, styling, and grid positioning.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}