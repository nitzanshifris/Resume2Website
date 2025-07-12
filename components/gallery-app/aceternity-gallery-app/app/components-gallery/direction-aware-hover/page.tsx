"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  DirectionAwareHoverDemo,
  DirectionAwareHoverCard,
  DirectionAwareHoverFeatures,
  DirectionAwareHoverProduct,
  DirectionAwareHover 
} from "@/component-library/components/ui/direction-aware-hover";
import { PlaygroundModal } from "@/app/components-gallery/components/PlaygroundModal";
import { ArrowLeft, Eye, Code2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const componentConfig = {
  id: "direction-aware-hover",
  name: "direction-aware-hover",
  title: "Direction Aware Hover",
  description: "A direction aware hover effect using Framer Motion, Tailwindcss and good old javascript",
  category: "Interactive",
  hasPlayground: true,
  defaultProps: {
    imageUrl: "https://images.unsplash.com/photo-1663765970236-f2acfde22237?w=500&h=500&fit=crop",
    title: "In the mountains",
    subtitle: "$1299 / night"
  },
  propConfigs: {
    imageUrl: {
      type: "string" as const,
      label: "Image URL",
      defaultValue: "https://images.unsplash.com/photo-1663765970236-f2acfde22237?w=500&h=500&fit=crop",
      description: "The URL of the image to display"
    },
    title: {
      type: "string" as const,
      label: "Title",
      defaultValue: "In the mountains",
      description: "The main title text"
    },
    subtitle: {
      type: "string" as const,
      label: "Subtitle",
      defaultValue: "$1299 / night",
      description: "The subtitle text"
    }
  },
  codeTemplate: `import { DirectionAwareHover } from "@/component-library/components/ui/direction-aware-hover";

export function MyComponent() {
  return (
    <div className="h-[40rem] relative flex items-center justify-center">
      <DirectionAwareHover imageUrl="{{imageUrl}}">
        <p className="font-bold text-xl">{{title}}</p>
        <p className="font-normal text-sm">{{subtitle}}</p>
      </DirectionAwareHover>
    </div>
  );
}`,
  importStatement: 'import { DirectionAwareHover } from "@/component-library/components/ui/direction-aware-hover";'
};

export default function DirectionAwareHoverPage() {
  const [isPlaygroundOpen, setIsPlaygroundOpen] = useState(false);

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
              <h1 className="text-xl font-semibold">Direction Aware Hover</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Direction Aware Hover</h1>
          <p className="text-xl text-neutral-400 mb-6">
            A direction aware hover effect using Framer Motion, Tailwindcss and good old javascript.
          </p>
          
          {/* Feature badges */}
          <div className="flex flex-wrap gap-2 mb-8">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm border border-blue-500/30">
              Direction Detection
            </span>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm border border-purple-500/30">
              Smooth Animations
            </span>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm border border-green-500/30">
              Responsive
            </span>
          </div>
        </div>

        {/* Demo Section */}
        <section className="mb-12">
          <div className="flex items-center space-x-2 mb-6">
            <Eye className="w-5 h-5 text-blue-400" />
            <h2 className="text-2xl font-semibold">Standard Demo</h2>
          </div>
          
          <div className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900/50">
            <DirectionAwareHoverDemo />
          </div>
        </section>

        {/* Variants Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Variants</h2>
          
          <div className="space-y-8">
            {/* Card Grid Variant */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-blue-400">Card Grid</h3>
              <p className="text-neutral-400 mb-4">Perfect for project showcases and portfolios</p>
              <div className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900/50">
                <DirectionAwareHoverCard />
              </div>
            </div>

            {/* Features Variant */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-blue-400">Features Grid</h3>
              <p className="text-neutral-400 mb-4">Showcase features with directional hover effects</p>
              <div className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900/50">
                <DirectionAwareHoverFeatures />
              </div>
            </div>

            {/* Product Variant */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-blue-400">Product Cards</h3>
              <p className="text-neutral-400 mb-4">E-commerce product cards with hover interactions</p>
              <div className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900/50">
                <DirectionAwareHoverProduct />
              </div>
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
              Test different Direction Aware Hover configurations with live preview.
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
                  npm i motion clsx tailwind-merge
                </code>
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
{`"use client";
import { DirectionAwareHover } from "@/components/ui/direction-aware-hover";

export function DirectionAwareHoverDemo() {
  const imageUrl =
    "https://images.unsplash.com/photo-1663765970236-f2acfde22237?q=80&w=3542&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  return (
    <div className="h-[40rem] relative  flex items-center justify-center">
      <DirectionAwareHover imageUrl={imageUrl}>
        <p className="font-bold text-xl">In the mountains</p>
        <p className="font-normal text-sm">$1299 / night</p>
      </DirectionAwareHover>
    </div>
  );
}`}
            </pre>
          </div>
        </section>

        {/* Props Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Props</h2>
          
          <div className="border border-neutral-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-neutral-900/50">
                <tr>
                  <th className="text-left p-4 font-medium">Prop</th>
                  <th className="text-left p-4 font-medium">Type</th>
                  <th className="text-left p-4 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                <tr className="hover:bg-neutral-900/25">
                  <td className="p-4 font-mono text-blue-400">imageUrl</td>
                  <td className="p-4 font-mono text-purple-400">string</td>
                  <td className="p-4 text-neutral-400">The URL of the image to be displayed</td>
                </tr>
                <tr className="hover:bg-neutral-900/25">
                  <td className="p-4 font-mono text-blue-400">children</td>
                  <td className="p-4 font-mono text-purple-400">React.ReactNode | string</td>
                  <td className="p-4 text-neutral-400">The content to be displayed over the image</td>
                </tr>
                <tr className="hover:bg-neutral-900/25">
                  <td className="p-4 font-mono text-blue-400">childrenClassName</td>
                  <td className="p-4 font-mono text-purple-400">string (optional)</td>
                  <td className="p-4 text-neutral-400">The CSS class to be applied to the children</td>
                </tr>
                <tr className="hover:bg-neutral-900/25">
                  <td className="p-4 font-mono text-blue-400">imageClassName</td>
                  <td className="p-4 font-mono text-purple-400">string (optional)</td>
                  <td className="p-4 text-neutral-400">The CSS class to be applied to the image</td>
                </tr>
                <tr className="hover:bg-neutral-900/25">
                  <td className="p-4 font-mono text-blue-400">className</td>
                  <td className="p-4 font-mono text-purple-400">string (optional)</td>
                  <td className="p-4 text-neutral-400">Additional CSS classes for the container</td>
                </tr>
              </tbody>
            </table>
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