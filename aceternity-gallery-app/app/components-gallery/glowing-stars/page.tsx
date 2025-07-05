"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  GlowingStarsBackgroundCardPreview,
  GlowingStarsDemo
} from "@/component-library/components/ui/glowing-stars";
import { PlaygroundModal } from "@/app/components-gallery/components/PlaygroundModal";
import { ArrowLeft, Eye, Code2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const componentConfig = {
  id: "glowing-stars",
  name: "glowing-stars",
  title: "Glowing Background Stars Card",
  description: "Card background stars that animate on hover and animate anyway",
  category: "Special Effects",
  hasPlayground: true,
  defaultProps: {
    className: ""
  },
  propConfigs: {
    className: {
      type: "string" as const,
      label: "Card Classes",
      defaultValue: "",
      description: "Additional CSS classes for the card"
    }
  },
  codeTemplate: `import {
  GlowingStarsBackgroundCard,
  GlowingStarsDescription,
  GlowingStarsTitle,
} from "@/component-library/components/ui/glowing-stars";

export function MyComponent() {
  return (
    <GlowingStarsBackgroundCard className="{{className}}">
      <GlowingStarsTitle>Next.js 14</GlowingStarsTitle>
      <div className="flex justify-between items-end">
        <GlowingStarsDescription>
          The power of full-stack to the frontend. Read the release notes.
        </GlowingStarsDescription>
        <div className="h-8 w-8 rounded-full bg-[hsla(0,0%,100%,.1)] flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-4 w-4 text-white stroke-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
            />
          </svg>
        </div>
      </div>
    </GlowingStarsBackgroundCard>
  );
}`,
  importStatement: 'import { GlowingStarsBackgroundCard, GlowingStarsDescription, GlowingStarsTitle } from "@/component-library/components/ui/glowing-stars";'
};

export default function GlowingStarsPage() {
  const [isPlaygroundOpen, setIsPlaygroundOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState("preview");

  const variants = [
    { id: "preview", name: "Preview", component: <GlowingStarsBackgroundCardPreview /> },
    { id: "demo", name: "Demo Grid", component: <GlowingStarsDemo /> },
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
              <h1 className="text-xl font-semibold">Glowing Background Stars Card</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Glowing Background Stars Card</h1>
          <p className="text-xl text-neutral-400 mb-6">
            Card background stars that animate on hover and animate anyway.
          </p>
          
          {/* Feature badges */}
          <div className="flex flex-wrap gap-2 mb-8">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm border border-blue-500/30">
              Animated Stars
            </span>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm border border-purple-500/30">
              Hover Effects
            </span>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm border border-green-500/30">
              Card Background
            </span>
            <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm border border-orange-500/30">
              Auto Animation
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
          
          <div className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900/50 p-8">
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
              Test different Glowing Stars configurations with live preview.
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
import React from "react";
import {
  GlowingStarsBackgroundCard,
  GlowingStarsDescription,
  GlowingStarsTitle,
} from "@/component-library/components/ui/glowing-stars";

export function GlowingStarsExample() {
  return (
    <GlowingStarsBackgroundCard>
      <GlowingStarsTitle>Next.js 14</GlowingStarsTitle>
      <div className="flex justify-between items-end">
        <GlowingStarsDescription>
          The power of full-stack to the frontend. Read the release notes.
        </GlowingStarsDescription>
        <div className="h-8 w-8 rounded-full bg-[hsla(0,0%,100%,.1)] flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-4 w-4 text-white stroke-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
            />
          </svg>
        </div>
      </div>
    </GlowingStarsBackgroundCard>
  );
}`}
            </pre>
          </div>
        </section>

        {/* Props Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Props</h2>
          
          <div className="space-y-6">
            {/* GlowingStarsBackgroundCard Props */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-blue-400">GlowingStarsBackgroundCard</h3>
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
                      <td className="p-4 font-mono text-blue-400">className</td>
                      <td className="p-4 font-mono text-purple-400">string</td>
                      <td className="p-4 text-neutral-400">Additional CSS classes for the card</td>
                    </tr>
                    <tr className="hover:bg-neutral-900/25">
                      <td className="p-4 font-mono text-blue-400">children</td>
                      <td className="p-4 font-mono text-purple-400">React.ReactNode</td>
                      <td className="p-4 text-neutral-400">Card content</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* GlowingStarsTitle Props */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-blue-400">GlowingStarsTitle</h3>
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
                      <td className="p-4 font-mono text-blue-400">className</td>
                      <td className="p-4 font-mono text-purple-400">string</td>
                      <td className="p-4 text-neutral-400">Additional CSS classes for the title</td>
                    </tr>
                    <tr className="hover:bg-neutral-900/25">
                      <td className="p-4 font-mono text-blue-400">children</td>
                      <td className="p-4 font-mono text-purple-400">React.ReactNode</td>
                      <td className="p-4 text-neutral-400">Title content</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* GlowingStarsDescription Props */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-blue-400">GlowingStarsDescription</h3>
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
                      <td className="p-4 font-mono text-blue-400">className</td>
                      <td className="p-4 font-mono text-purple-400">string</td>
                      <td className="p-4 text-neutral-400">Additional CSS classes for the description</td>
                    </tr>
                    <tr className="hover:bg-neutral-900/25">
                      <td className="p-4 font-mono text-blue-400">children</td>
                      <td className="p-4 font-mono text-purple-400">React.ReactNode</td>
                      <td className="p-4 text-neutral-400">Description content</td>
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