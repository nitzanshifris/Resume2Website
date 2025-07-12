"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  ContainerTextFlipDemo,
  ContainerTextFlipHero,
  ContainerTextFlipCustom,
  ContainerTextFlip 
} from "@/component-library/components/ui/container-text-flip";
import { PlaygroundModal } from "@/app/components-gallery/components/PlaygroundModal";
import { ArrowLeft, Eye, Code2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const componentConfig = {
  id: "container-text-flip",
  name: "container-text-flip",
  title: "Container Text Flip",
  description: "A container that flips through words, animating the width",
  category: "Content",
  hasPlayground: true,
  defaultProps: {
    words: ["better", "modern", "beautiful", "awesome"],
    interval: 3000,
    animationDuration: 700
  },
  propConfigs: {
    words: {
      type: "textarea" as const,
      label: "Words (comma separated)",
      defaultValue: "better,modern,beautiful,awesome",
      description: "Words to cycle through (comma separated)"
    },
    interval: {
      type: "range" as const,
      label: "Interval (ms)",
      defaultValue: 3000,
      min: 500,
      max: 5000,
      step: 500,
      description: "Time between word transitions"
    },
    animationDuration: {
      type: "range" as const,
      label: "Animation Duration (ms)",
      defaultValue: 700,
      min: 200,
      max: 2000,
      step: 100,
      description: "Duration of the transition animation"
    }
  },
  codeTemplate: `import { ContainerTextFlip } from "@/component-library/components/ui/container-text-flip";

export function MyComponent() {
  return (
    <ContainerTextFlip
      words={[{{words.split(',').map(w => '"' + w.trim() + '"').join(', ')}}]}
      interval={{{interval}}}
      animationDuration={{{animationDuration}}}
    />
  );
}`,
  importStatement: 'import { ContainerTextFlip } from "@/component-library/components/ui/container-text-flip";'
};

export default function ContainerTextFlipPage() {
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
              <h1 className="text-xl font-semibold">Container Text Flip</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Container Text Flip</h1>
          <p className="text-xl text-neutral-400 mb-6">
            A container that flips through words, animating the width.
          </p>
          
          {/* Feature badges */}
          <div className="flex flex-wrap gap-2 mb-8">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm border border-blue-500/30">
              Text Animation
            </span>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm border border-purple-500/30">
              Auto Width
            </span>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm border border-green-500/30">
              Letter Animation
            </span>
          </div>
        </div>

        {/* Demo Section */}
        <section className="mb-12">
          <div className="flex items-center space-x-2 mb-6">
            <Eye className="w-5 h-5 text-blue-400" />
            <h2 className="text-2xl font-semibold">Standard Demo</h2>
          </div>
          
          <div className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900/50 p-12 flex items-center justify-center">
            <ContainerTextFlipDemo />
          </div>
        </section>

        {/* Variants Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Variants</h2>
          
          <div className="space-y-8">
            {/* Hero Variant */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-blue-400">Hero Section</h3>
              <p className="text-neutral-400 mb-4">Perfect for hero sections with animated text</p>
              <div className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900/50 p-12">
                <ContainerTextFlipHero />
              </div>
            </div>

            {/* Custom Variant */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-blue-400">Custom Styling</h3>
              <p className="text-neutral-400 mb-4">Multiple instances with different configurations</p>
              <div className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900/50 p-12">
                <ContainerTextFlipCustom />
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
              Test different Container Text Flip configurations with live preview.
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
{`import { ContainerTextFlip } from "@/components/ui/container-text-flip";

export function ContainerTextFlipDemo() {
  return (
    <ContainerTextFlip
      words={["better", "modern", "Tyler Durden", "awesome"]}
    />
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
                  <th className="text-left p-4 font-medium">Default</th>
                  <th className="text-left p-4 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                <tr className="hover:bg-neutral-900/25">
                  <td className="p-4 font-mono text-blue-400">words</td>
                  <td className="p-4 font-mono text-purple-400">string[]</td>
                  <td className="p-4 font-mono text-green-400">["better", "modern", "beautiful", "awesome"]</td>
                  <td className="p-4 text-neutral-400">Array of words to cycle through in the animation</td>
                </tr>
                <tr className="hover:bg-neutral-900/25">
                  <td className="p-4 font-mono text-blue-400">interval</td>
                  <td className="p-4 font-mono text-purple-400">number</td>
                  <td className="p-4 font-mono text-green-400">3000</td>
                  <td className="p-4 text-neutral-400">Time in milliseconds between word transitions</td>
                </tr>
                <tr className="hover:bg-neutral-900/25">
                  <td className="p-4 font-mono text-blue-400">className</td>
                  <td className="p-4 font-mono text-purple-400">string</td>
                  <td className="p-4 font-mono text-green-400">-</td>
                  <td className="p-4 text-neutral-400">Additional CSS classes to apply to the container</td>
                </tr>
                <tr className="hover:bg-neutral-900/25">
                  <td className="p-4 font-mono text-blue-400">textClassName</td>
                  <td className="p-4 font-mono text-purple-400">string</td>
                  <td className="p-4 font-mono text-green-400">-</td>
                  <td className="p-4 text-neutral-400">Additional CSS classes to apply to the text</td>
                </tr>
                <tr className="hover:bg-neutral-900/25">
                  <td className="p-4 font-mono text-blue-400">animationDuration</td>
                  <td className="p-4 font-mono text-purple-400">number</td>
                  <td className="p-4 font-mono text-green-400">700</td>
                  <td className="p-4 text-neutral-400">Duration of the transition animation in milliseconds</td>
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