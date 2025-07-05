"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  DraggableCardDemo,
  DraggableCardGrid,
  DraggableCardSingle
} from "@/component-library/components/ui/draggable-card";
import { PlaygroundModal } from "@/app/components-gallery/components/PlaygroundModal";
import { ArrowLeft, Eye, Code2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const componentConfig = {
  id: "draggable-card",
  name: "draggable-card",
  title: "Draggable Card",
  description: "A tiltable, draggable card component that jumps on bounds",
  category: "Interactive",
  hasPlayground: true,
  defaultProps: {
    variant: "demo",
    containerClassName: "relative flex min-h-screen w-full items-center justify-center overflow-clip",
    cardClassName: "",
    imageUrl: "https://images.unsplash.com/photo-1732310216648-603c0255c000?q=80&w=3540&auto=format&fit=crop",
    imageAlt: "Draggable card",
    title: "Tyler Durden",
    showTitle: true,
    imageClassName: "pointer-events-none relative z-10 h-80 w-80 object-cover",
    titleClassName: "mt-4 text-center text-2xl font-bold text-neutral-700 dark:text-neutral-300"
  },
  propConfigs: {
    variant: {
      type: "select" as const,
      label: "Variant",
      defaultValue: "demo",
      options: ["demo", "grid", "single"],
      description: "The variant of the draggable card to display"
    },
    containerClassName: {
      type: "string" as const,
      label: "Container Classes",
      defaultValue: "relative flex min-h-screen w-full items-center justify-center overflow-clip",
      description: "CSS classes for the container"
    },
    cardClassName: {
      type: "string" as const,
      label: "Card Classes",
      defaultValue: "",
      description: "Additional CSS classes for the card"
    },
    imageUrl: {
      type: "string" as const,
      label: "Image URL",
      defaultValue: "https://images.unsplash.com/photo-1732310216648-603c0255c000?q=80&w=3540&auto=format&fit=crop",
      description: "URL of the card image"
    },
    imageAlt: {
      type: "string" as const,
      label: "Image Alt Text",
      defaultValue: "Draggable card",
      description: "Alternative text for the image"
    },
    title: {
      type: "string" as const,
      label: "Card Title",
      defaultValue: "Tyler Durden",
      description: "Title text displayed on the card"
    },
    showTitle: {
      type: "boolean" as const,
      label: "Show Title",
      defaultValue: true,
      description: "Whether to display the title"
    }
  },
  codeTemplate: `import { DraggableCard{{variant}} } from "@/component-library/components/ui/draggable-card";

export function MyComponent() {
  return <DraggableCard{{variant}} />;
}`,
  importStatement: 'import { DraggableCard{{variant}} } from "@/component-library/components/ui/draggable-card";'
};

export default function DraggableCardPage() {
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
              <h1 className="text-xl font-semibold">Draggable Card</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Draggable Card</h1>
          <p className="text-xl text-neutral-400 mb-6">
            A tiltable, draggable card component that jumps on bounds with physics-based animations.
          </p>
          
          {/* Feature badges */}
          <div className="flex flex-wrap gap-2 mb-8">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm border border-blue-500/30">
              Physics-based Drag
            </span>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm border border-purple-500/30">
              3D Tilt Effects
            </span>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm border border-green-500/30">
              Touch Support
            </span>
            <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm border border-orange-500/30">
              Velocity Aware
            </span>
          </div>
        </div>

        {/* Demo Section */}
        <section className="mb-12">
          <div className="flex items-center space-x-2 mb-6">
            <Eye className="w-5 h-5 text-blue-400" />
            <h2 className="text-2xl font-semibold">Polaroid Stack Demo</h2>
          </div>
          
          <div className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900/50">
            <DraggableCardDemo />
          </div>
        </section>

        {/* Variants Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Variants</h2>
          
          <div className="space-y-8">
            {/* Grid Variant */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-blue-400">Grid Layout</h3>
              <p className="text-neutral-400 mb-4">Multiple draggable cards arranged in a responsive grid</p>
              <div className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900/50">
                <DraggableCardGrid />
              </div>
            </div>

            {/* Single Variant */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-blue-400">Single Card</h3>
              <p className="text-neutral-400 mb-4">A single centered draggable card with full-size image</p>
              <div className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900/50">
                <DraggableCardSingle />
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
              Test different Draggable Card configurations with live preview.
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
import { 
  DraggableCardBody, 
  DraggableCardContainer 
} from "@/component-library/components/ui/draggable-card";

export function DraggableCardExample() {
  return (
    <DraggableCardContainer className="relative flex min-h-screen w-full items-center justify-center overflow-clip">
      <DraggableCardBody>
        <img
          src="https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=300&fit=crop"
          alt="Draggable card"
          className="pointer-events-none relative z-10 h-80 w-80 object-cover"
        />
        <p className="mt-4 text-center text-2xl font-bold text-neutral-700 dark:text-neutral-300">
          Drag Me!
        </p>
      </DraggableCardBody>
    </DraggableCardContainer>
  );
}`}
            </pre>
          </div>
        </section>

        {/* Props Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Props</h2>
          
          <div className="space-y-6">
            {/* DraggableCardContainer Props */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-blue-400">DraggableCardContainer</h3>
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
                      <td className="p-4 text-neutral-400">CSS classes for the container</td>
                    </tr>
                    <tr className="hover:bg-neutral-900/25">
                      <td className="p-4 font-mono text-blue-400">children</td>
                      <td className="p-4 font-mono text-purple-400">React.ReactNode</td>
                      <td className="p-4 text-neutral-400">Child elements (DraggableCardBody components)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* DraggableCardBody Props */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-blue-400">DraggableCardBody</h3>
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
                      <td className="p-4 text-neutral-400">CSS classes for the card body</td>
                    </tr>
                    <tr className="hover:bg-neutral-900/25">
                      <td className="p-4 font-mono text-blue-400">children</td>
                      <td className="p-4 font-mono text-purple-400">React.ReactNode</td>
                      <td className="p-4 text-neutral-400">Content of the card</td>
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