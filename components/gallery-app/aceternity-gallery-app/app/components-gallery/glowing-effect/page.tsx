"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  GlowingEffectDemo,
  GlowingEffectDemoSecond
} from "@/components/ui/glowing-effect";
import { PlaygroundModal } from "@/app/components-gallery/components/PlaygroundModal";
import { ArrowLeft, Eye, Code2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const componentConfig = {
  id: "glowing-effect",
  name: "glowing-effect",
  title: "Glowing Effect",
  description: "A border glowing effect that adapts to any container or card, as seen on Cursor's website",
  category: "Interactive",
  hasPlayground: true,
  defaultProps: {
    blur: 0,
    inactiveZone: 0.7,
    proximity: 0,
    spread: 20,
    variant: "default",
    glow: false,
    disabled: true,
    movementDuration: 2,
    borderWidth: 1
  },
  propConfigs: {
    blur: {
      type: "range" as const,
      label: "Blur",
      defaultValue: 0,
      min: 0,
      max: 10,
      step: 1,
      description: "The amount of blur applied to the glowing effect in pixels"
    },
    inactiveZone: {
      type: "range" as const,
      label: "Inactive Zone",
      defaultValue: 0.7,
      min: 0,
      max: 1,
      step: 0.1,
      description: "The radius multiplier for the center zone where the effect is disabled"
    },
    proximity: {
      type: "range" as const,
      label: "Proximity",
      defaultValue: 0,
      min: 0,
      max: 200,
      step: 10,
      description: "The distance in pixels beyond the element's bounds where the effect remains active"
    },
    spread: {
      type: "range" as const,
      label: "Spread",
      defaultValue: 20,
      min: 0,
      max: 180,
      step: 10,
      description: "The angular spread of the glowing effect in degrees"
    },
    variant: {
      type: "select" as const,
      label: "Variant",
      defaultValue: "default",
      options: ["default", "white"],
      description: "The color variant of the effect"
    },
    glow: {
      type: "boolean" as const,
      label: "Force Glow",
      defaultValue: false,
      description: "When true, forces the effect to be visible regardless of hover state"
    },
    disabled: {
      type: "boolean" as const,
      label: "Disabled",
      defaultValue: true,
      description: "When true, disables the interactive glowing effect"
    },
    movementDuration: {
      type: "range" as const,
      label: "Movement Duration",
      defaultValue: 2,
      min: 0.1,
      max: 5,
      step: 0.1,
      description: "The duration of the glow movement animation in seconds"
    },
    borderWidth: {
      type: "range" as const,
      label: "Border Width",
      defaultValue: 1,
      min: 1,
      max: 10,
      step: 1,
      description: "The width of the glowing border in pixels"
    }
  },
  codeTemplate: `import { GlowingEffect } from "@/components/ui/glowing-effect";

export function MyComponent() {
  return (
    <div className="relative p-4 border rounded-lg">
      <GlowingEffect
        blur={{{blur}}}
        inactiveZone={{{inactiveZone}}}
        proximity={{{proximity}}}
        spread={{{spread}}}
        variant="{{variant}}"
        glow={{{glow}}}
        disabled={{{disabled}}}
        movementDuration={{{movementDuration}}}
        borderWidth={{{borderWidth}}}
      />
      <div className="p-6">
        <h3 className="text-lg font-semibold">Card with Glowing Effect</h3>
        <p className="text-neutral-400">Move your mouse around to see the effect.</p>
      </div>
    </div>
  );
}`,
  importStatement: 'import { GlowingEffect } from "@/components/ui/glowing-effect";'
};

export default function GlowingEffectPage() {
  const [isPlaygroundOpen, setIsPlaygroundOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState("demo");

  const variants = [
    { id: "demo", name: "Demo", component: <GlowingEffectDemo /> },
    { id: "enhanced", name: "Enhanced", component: <GlowingEffectDemoSecond /> },
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
              <h1 className="text-xl font-semibold">Glowing Effect</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Glowing Effect</h1>
          <p className="text-xl text-neutral-400 mb-6">
            A border glowing effect that adapts to any container or card, as seen on Cursor&apos;s website.
          </p>
          
          {/* Feature badges */}
          <div className="flex flex-wrap gap-2 mb-8">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm border border-blue-500/30">
              Mouse Tracking
            </span>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm border border-purple-500/30">
              Adaptive Borders
            </span>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm border border-green-500/30">
              Bento Grid Layout
            </span>
            <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm border border-orange-500/30">
              Performance Optimized
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
              Test different Glowing Effect configurations with live preview.
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
import { GlowingEffect } from "@/components/ui/glowing-effect";

export function GlowingEffectExample() {
  return (
    <div className="relative p-4 border rounded-lg">
      <GlowingEffect
        spread={40}
        glow={true}
        disabled={false}
        proximity={64}
        inactiveZone={0.01}
      />
      <div className="p-6">
        <h3 className="text-lg font-semibold">Card Title</h3>
        <p className="text-neutral-400">Move your mouse to see the glowing effect.</p>
      </div>
    </div>
  );
}`}
            </pre>
          </div>
        </section>

        {/* Props Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Props</h2>
          
          <div className="space-y-6">
            {/* GlowingEffect Props */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-blue-400">GlowingEffect</h3>
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
                      <td className="p-4 font-mono text-blue-400">blur</td>
                      <td className="p-4 font-mono text-purple-400">number</td>
                      <td className="p-4 font-mono text-green-400">0</td>
                      <td className="p-4 text-neutral-400">The amount of blur applied to the glowing effect in pixels</td>
                    </tr>
                    <tr className="hover:bg-neutral-900/25">
                      <td className="p-4 font-mono text-blue-400">inactiveZone</td>
                      <td className="p-4 font-mono text-purple-400">number</td>
                      <td className="p-4 font-mono text-green-400">0.7</td>
                      <td className="p-4 text-neutral-400">The radius multiplier for the center zone where the effect is disabled</td>
                    </tr>
                    <tr className="hover:bg-neutral-900/25">
                      <td className="p-4 font-mono text-blue-400">proximity</td>
                      <td className="p-4 font-mono text-purple-400">number</td>
                      <td className="p-4 font-mono text-green-400">0</td>
                      <td className="p-4 text-neutral-400">The distance beyond element bounds where effect remains active</td>
                    </tr>
                    <tr className="hover:bg-neutral-900/25">
                      <td className="p-4 font-mono text-blue-400">spread</td>
                      <td className="p-4 font-mono text-purple-400">number</td>
                      <td className="p-4 font-mono text-green-400">20</td>
                      <td className="p-4 text-neutral-400">The angular spread of the glowing effect in degrees</td>
                    </tr>
                    <tr className="hover:bg-neutral-900/25">
                      <td className="p-4 font-mono text-blue-400">variant</td>
                      <td className="p-4 font-mono text-purple-400">"default" | "white"</td>
                      <td className="p-4 font-mono text-green-400">"default"</td>
                      <td className="p-4 text-neutral-400">The color variant of the effect</td>
                    </tr>
                    <tr className="hover:bg-neutral-900/25">
                      <td className="p-4 font-mono text-blue-400">glow</td>
                      <td className="p-4 font-mono text-purple-400">boolean</td>
                      <td className="p-4 font-mono text-green-400">false</td>
                      <td className="p-4 text-neutral-400">Forces the effect to be visible regardless of hover state</td>
                    </tr>
                    <tr className="hover:bg-neutral-900/25">
                      <td className="p-4 font-mono text-blue-400">disabled</td>
                      <td className="p-4 font-mono text-purple-400">boolean</td>
                      <td className="p-4 font-mono text-green-400">true</td>
                      <td className="p-4 text-neutral-400">When true, disables the interactive glowing effect</td>
                    </tr>
                    <tr className="hover:bg-neutral-900/25">
                      <td className="p-4 font-mono text-blue-400">movementDuration</td>
                      <td className="p-4 font-mono text-purple-400">number</td>
                      <td className="p-4 font-mono text-green-400">2</td>
                      <td className="p-4 text-neutral-400">The duration of the glow movement animation in seconds</td>
                    </tr>
                    <tr className="hover:bg-neutral-900/25">
                      <td className="p-4 font-mono text-blue-400">borderWidth</td>
                      <td className="p-4 font-mono text-purple-400">number</td>
                      <td className="p-4 font-mono text-green-400">1</td>
                      <td className="p-4 text-neutral-400">The width of the glowing border in pixels</td>
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