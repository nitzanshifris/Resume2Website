"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  GridAndDotBackgroundsPreview,
  GridAndDotBackgroundsDemo,
  GridAndDotBackgroundsSmall,
  GridAndDotBackgroundsDot
} from "@/components/ui/grid-and-dot-backgrounds";
import { PlaygroundModal } from "@/app/components-gallery/components/PlaygroundModal";
import { ArrowLeft, Eye, Code2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const componentConfig = {
  id: "grid-and-dot-backgrounds",
  name: "grid-and-dot-backgrounds", 
  title: "Grid and Dot Backgrounds",
  description: "Beautiful grid and dot background patterns using CSS gradients",
  category: "Background",
  hasPlayground: true,
  defaultProps: {
    variant: "grid",
    size: "default"
  },
  propConfigs: {
    variant: {
      type: "select" as const,
      label: "Background Variant",
      defaultValue: "grid",
      options: ["grid", "gridSmall", "dot"],
      description: "The type of background pattern to display"
    },
    size: {
      type: "select" as const,
      label: "Pattern Size",
      defaultValue: "default",
      options: ["default", "small"],
      description: "The size of the pattern elements"
    }
  },
  codeTemplate: `import React from "react";
import { GridAndDotBackgrounds } from "@/components/ui/grid-and-dot-backgrounds";

export function MyComponent() {
  return (
    <GridAndDotBackgrounds variant="{{variant}}" size="{{size}}" className="h-96 w-full bg-black relative flex items-center justify-center">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <p className="text-2xl md:text-4xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8">
        Your Content Here
      </p>
    </GridAndDotBackgrounds>
  );
}`,
  importStatement: 'import { GridAndDotBackgrounds } from "@/components/ui/grid-and-dot-backgrounds";'
};

export default function GridAndDotBackgroundsPage() {
  const [isPlaygroundOpen, setIsPlaygroundOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState("preview");

  const variants = [
    { id: "preview", name: "Grid Background", component: <GridAndDotBackgroundsPreview /> },
    { id: "demo", name: "Full Demo", component: <GridAndDotBackgroundsDemo /> },
    { id: "small", name: "Small Grid", component: <GridAndDotBackgroundsSmall /> },
    { id: "dot", name: "Dot Background", component: <GridAndDotBackgroundsDot /> },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link 
                href="/components-gallery"
                className="flex items-center space-x-2 text-neutral-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Gallery</span>
              </Link>
              <div className="h-6 w-px bg-neutral-700" />
              <h1 className="text-xl font-semibold">Grid and Dot Backgrounds</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Grid and Dot Backgrounds</h1>
          <p className="text-xl text-neutral-400 mb-6">
            Beautiful grid and dot background patterns using CSS gradients.
          </p>
          
          {/* Feature badges */}
          <div className="flex flex-wrap gap-2 mb-8">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm border border-blue-500/30">
              CSS Gradients
            </span>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm border border-purple-500/30">
              Background Patterns
            </span>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm border border-green-500/30">
              Grid Layout
            </span>
            <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm border border-orange-500/30">
              Dot Pattern
            </span>
          </div>
        </div>

        {/* Variants Section */}
        <section className="mb-12">
          <div className="flex items-center space-x-2 mb-6">
            <Eye className="w-5 h-5 text-blue-400" />
            <h2 className="text-2xl font-semibold">Variants</h2>
          </div>
          
          {/* Variant Selector */}
          <div className="flex space-x-2 mb-6">
            {variants.map((variant) => (
              <Button
                key={variant.id}
                variant={selectedVariant === variant.id ? "default" : "outline"}
                onClick={() => setSelectedVariant(variant.id)}
                className={selectedVariant === variant.id 
                  ? "bg-blue-600 hover:bg-blue-700" 
                  : "bg-neutral-800 border-neutral-700 hover:bg-neutral-700"
                }
              >
                {variant.name}
              </Button>
            ))}
          </div>
          
          <div className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900/50">
            <div className="relative overflow-hidden">
              {variants.find(v => v.id === selectedVariant)?.component}
            </div>
          </div>
        </section>

        {/* Playground Section */}
        <section className="mb-12">
          <div className="flex items-center space-x-2 mb-6">
            <Settings className="w-5 h-5 text-purple-400" />
            <h2 className="text-2xl font-semibold">Interactive Playground</h2>
          </div>
          <div className="border border-neutral-800 rounded-lg p-6">
            <p className="text-neutral-400 mb-4">
              Test different Grid and Dot Background configurations with live preview.
            </p>
            <Button 
              onClick={() => setIsPlaygroundOpen(true)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Settings className="w-4 h-4 mr-2" />
              Open Playground
            </Button>
          </div>
        </section>

        {/* Installation Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Installation</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Install dependencies</h3>
              <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
                <code className="text-green-400 font-mono text-sm">
                  npm i clsx tailwind-merge
                </code>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Add utility classes</h3>
              <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
                <pre className="text-green-400 font-mono text-sm overflow-x-auto">
{`// Add to your Tailwind CSS configuration
module.exports = {
  theme: {
    extend: {
      backgroundImage: {
        'grid-black': 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
        'grid-white': 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        'dot-black': 'radial-gradient(circle, rgba(0,0,0,0.3) 1px, transparent 1px)',
        'dot-white': 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
      }
    }
  }
}`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Usage Section */}
        <section className="mb-12">
          <div className="flex items-center space-x-2 mb-6">
            <Code2 className="w-5 h-5 text-green-400" />
            <h2 className="text-2xl font-semibold">Usage</h2>
          </div>
          
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
            <pre className="text-green-400 font-mono text-sm overflow-x-auto">
{`import React from "react";
import { GridAndDotBackgrounds } from "@/components/ui/grid-and-dot-backgrounds";

export function GridAndDotBackgroundsDemo() {
  return (
    <GridAndDotBackgrounds variant="grid" className="h-96 w-full bg-black relative flex items-center justify-center">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <p className="text-2xl md:text-4xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8">
        Grid Background
      </p>
    </GridAndDotBackgrounds>
  );
}`}
            </pre>
          </div>
        </section>

        {/* Props Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Props</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4 text-blue-400">GridAndDotBackgrounds</h3>
              <div className="border border-neutral-800 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-neutral-900/50">
                    <tr>
                      <th className="text-left p-4 font-medium">Prop</th>
                      <th className="text-left p-4 font-medium">Type</th>
                      <th className="text-left p-4 font-medium">Default</th>
                      <th className="text-left p-4 font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    <tr className="hover:bg-neutral-900/25">
                      <td className="p-4 font-mono text-blue-400">variant</td>
                      <td className="p-4 font-mono text-purple-400">"grid" | "gridSmall" | "dot"</td>
                      <td className="p-4 font-mono text-green-400">"grid"</td>
                      <td className="p-4 text-neutral-400">Type of background pattern</td>
                    </tr>
                    <tr className="hover:bg-neutral-900/25">
                      <td className="p-4 font-mono text-blue-400">size</td>
                      <td className="p-4 font-mono text-purple-400">"default" | "small"</td>
                      <td className="p-4 font-mono text-green-400">"default"</td>
                      <td className="p-4 text-neutral-400">Size of pattern elements</td>
                    </tr>
                    <tr className="hover:bg-neutral-900/25">
                      <td className="p-4 font-mono text-blue-400">className</td>
                      <td className="p-4 font-mono text-purple-400">string</td>
                      <td className="p-4 font-mono text-green-400">-</td>
                      <td className="p-4 text-neutral-400">Additional CSS classes</td>
                    </tr>
                    <tr className="hover:bg-neutral-900/25">
                      <td className="p-4 font-mono text-blue-400">children</td>
                      <td className="p-4 font-mono text-purple-400">ReactNode</td>
                      <td className="p-4 font-mono text-green-400">-</td>
                      <td className="p-4 text-neutral-400">Content to display over background</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Playground Modal */}
      <PlaygroundModal
        isOpen={isPlaygroundOpen}
        onClose={() => setIsPlaygroundOpen(false)}
        config={componentConfig}
      />
    </div>
  );
}