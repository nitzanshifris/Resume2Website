"use client";

import React from "react";
import { 
  LensDemo, 
  LensGalleryPreview, 
  LensStatic, 
  LensOnComponent 
} from "@/components/ui/lens";

export default function LensGalleryPage() {
  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Lens Components</h1>
          <p className="text-gray-400 text-lg">
            A lens component to zoom into images, videos, or practically anything.
          </p>
        </div>

        <div className="space-y-12">
          {/* Basic with Animation */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-6">Basic with Animation</h2>
            <div className="bg-zinc-900 rounded-lg p-6">
              <LensGalleryPreview />
            </div>
          </section>

          {/* Static Lens */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-6">Static Lens</h2>
            <div className="bg-zinc-900 rounded-lg p-6">
              <LensStatic containerClassName="h-96 w-full relative overflow-hidden rounded-lg" />
            </div>
          </section>

          {/* Lens on React Component */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-6">Lens on React Component</h2>
            <div className="bg-zinc-900 rounded-lg p-6">
              <LensOnComponent containerClassName="h-96 w-full relative overflow-hidden rounded-lg" />
            </div>
          </section>

          {/* Full Size Demo */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-6">Full Size Demo</h2>
            <div className="bg-zinc-900 rounded-lg p-6">
              <LensDemo containerClassName="h-96 w-full relative overflow-hidden rounded-lg" />
            </div>
          </section>
        </div>

        {/* Usage Example */}
        <div className="mt-16 bg-zinc-900 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-white mb-4">Usage Example</h2>
          <pre className="bg-black rounded p-4 text-green-400 text-sm overflow-x-auto">
{`import { Lens } from "@/components/ui/lens";

export function MyLens() {
  return (
    <Lens hovering={hovering} setHovering={setHovering}>
      <img
        src="image-url.jpg"
        alt="image"
        width={500}
        height={500}
        className="rounded-2xl"
      />
    </Lens>
  );
}`}
          </pre>
        </div>

        {/* Props */}
        <div className="mt-12 bg-zinc-900 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-white mb-4">Props</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-700">
                  <th className="text-white font-medium p-3">Prop</th>
                  <th className="text-white font-medium p-3">Type</th>
                  <th className="text-white font-medium p-3">Default</th>
                  <th className="text-white font-medium p-3">Description</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-zinc-800">
                  <td className="p-3 font-mono text-sm">children</td>
                  <td className="p-3">React.ReactNode</td>
                  <td className="p-3">Required</td>
                  <td className="p-3">The content to be displayed inside the lens</td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="p-3 font-mono text-sm">zoomFactor</td>
                  <td className="p-3">number</td>
                  <td className="p-3">1.5</td>
                  <td className="p-3">The magnification factor for the lens</td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="p-3 font-mono text-sm">lensSize</td>
                  <td className="p-3">number</td>
                  <td className="p-3">170</td>
                  <td className="p-3">The diameter of the lens in pixels</td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="p-3 font-mono text-sm">position</td>
                  <td className="p-3">{"{ x: number, y: number }"}</td>
                  <td className="p-3">{"{ x: 200, y: 150 }"}</td>
                  <td className="p-3">The static position of the lens (when isStatic is true)</td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="p-3 font-mono text-sm">isStatic</td>
                  <td className="p-3">boolean</td>
                  <td className="p-3">false</td>
                  <td className="p-3">If true, the lens stays in a fixed position; if false, it follows the mouse</td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="p-3 font-mono text-sm">hovering</td>
                  <td className="p-3">boolean</td>
                  <td className="p-3">-</td>
                  <td className="p-3">External control for the hover state</td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="p-3 font-mono text-sm">setHovering</td>
                  <td className="p-3">{"(hovering: boolean) => void"}</td>
                  <td className="p-3">-</td>
                  <td className="p-3">External setter for the hover state</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 bg-zinc-900 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-white mb-4">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Mouse Tracking</h3>
              <p>The lens follows mouse movement for dynamic zoom positioning.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Static Mode</h3>
              <p>Fixed lens position for consistent zoom area display.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Customizable Zoom</h3>
              <p>Adjustable zoom factor and lens size for different magnification needs.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-2">React Component Support</h3>
              <p>Works with any React content, not just images.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}