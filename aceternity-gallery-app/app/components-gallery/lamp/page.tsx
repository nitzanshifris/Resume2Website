"use client";

import React from "react";
import { 
  LampDemo, 
  LampGalleryPreview, 
  LampSimple, 
  LampColorful, 
  LampMinimal 
} from "@/components/ui/lamp";

export default function LampGalleryPage() {
  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Lamp Components</h1>
          <p className="text-gray-400 text-lg">
            A lamp effect as seen on linear, great for section headers.
          </p>
        </div>

        <div className="space-y-12">
          {/* Default Lamp Demo */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-6">Default Lamp</h2>
            <div className="bg-zinc-900 rounded-lg p-6">
              <LampGalleryPreview />
            </div>
          </section>

          {/* Simple Lamp */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-6">Simple Lamp</h2>
            <div className="bg-zinc-900 rounded-lg p-6">
              <LampSimple />
            </div>
          </section>

          {/* Colorful Lamp */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-6">Colorful Lamp</h2>
            <div className="bg-zinc-900 rounded-lg p-6">
              <LampColorful />
            </div>
          </section>

          {/* Minimal Lamp */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-6">Minimal Lamp</h2>
            <div className="bg-zinc-900 rounded-lg p-6">
              <LampMinimal />
            </div>
          </section>

          {/* Full Size Demo */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-6">Full Size Demo</h2>
            <div className="bg-zinc-900 rounded-lg p-6">
              <LampGalleryPreview />
            </div>
          </section>
        </div>

        {/* Usage Example */}
        <div className="mt-16 bg-zinc-900 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-white mb-4">Usage Example</h2>
          <pre className="bg-black rounded p-4 text-green-400 text-sm overflow-x-auto">
{`import { LampDemo, LampContainer } from "@/components/ui/lamp";

export function MyLampSection() {
  return (
    <LampContainer>
      <h1 className="text-4xl font-bold text-white">
        Your Content Here
      </h1>
    </LampContainer>
  );
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}