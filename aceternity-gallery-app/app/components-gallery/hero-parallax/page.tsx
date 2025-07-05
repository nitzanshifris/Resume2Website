"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  HeroParallaxPreview,
  HeroParallaxDemo,
  HeroParallaxMinimal
} from "@/components/ui/hero-parallax";
import { PlaygroundModal } from "@/app/components-gallery/components/PlaygroundModal";
import { ArrowLeft, Eye, Code2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const componentConfig = {
  id: "hero-parallax",
  name: "hero-parallax", 
  title: "Hero Parallax",
  description: "A scroll effect with rotation, translation and opacity animations",
  category: "Special Effects",
  hasPlayground: true,
  defaultProps: {
    products: []
  },
  propConfigs: {
    products: {
      type: "textarea" as const,
      label: "Products Data",
      defaultValue: "[]",
      description: "Array of product objects with title, link, and thumbnail"
    }
  },
  codeTemplate: `import React from "react";
import { HeroParallax } from "@/components/ui/hero-parallax";

const products = [
  {
    title: "Product 1",
    link: "https://example.com",
    thumbnail: "https://example.com/image1.png",
  },
  // Add more products...
];

export function MyComponent() {
  return <HeroParallax products={products} />;
}`,
  importStatement: 'import { HeroParallax } from "@/components/ui/hero-parallax";'
};

export default function HeroParallaxPage() {
  const [isPlaygroundOpen, setIsPlaygroundOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState("preview");

  const variants = [
    { id: "preview", name: "Preview", component: <HeroParallaxPreview /> },
    { id: "demo", name: "Full Demo", component: <HeroParallaxDemo /> },
    { id: "minimal", name: "Minimal", component: <HeroParallaxMinimal /> },
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
              <h1 className="text-xl font-semibold">Hero Parallax</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Hero Parallax</h1>
          <p className="text-xl text-neutral-400 mb-6">
            A scroll effect with rotation, translation and opacity animations.
          </p>
          
          {/* Feature badges */}
          <div className="flex flex-wrap gap-2 mb-8">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm border border-blue-500/30">
              Scroll Effect
            </span>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm border border-purple-500/30">
              3D Transform
            </span>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm border border-green-500/30">
              Parallax
            </span>
            <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm border border-orange-500/30">
              Hero Section
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
            <div className="relative">
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
              Test different Hero Parallax configurations with live preview.
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
{`import React from "react";
import { HeroParallax } from "@/components/ui/hero-parallax";

export function HeroParallaxDemo() {
  return <HeroParallax products={products} />;
}

export const products = [
  {
    title: "Moonbeam",
    link: "https://gomoonbeam.com",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/moonbeam.png",
  },
  {
    title: "Cursor",
    link: "https://cursor.so",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/cursor.png",
  },
  // ... more products
];`}
            </pre>
          </div>
        </section>

        {/* Props Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Props</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4 text-blue-400">HeroParallax</h3>
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
                      <td className="p-4 font-mono text-blue-400">products</td>
                      <td className="p-4 font-mono text-purple-400">Product[]</td>
                      <td className="p-4 font-mono text-green-400">defaultProducts</td>
                      <td className="p-4 text-neutral-400">An array of product objects</td>
                    </tr>
                    <tr className="hover:bg-neutral-900/25">
                      <td className="p-4 font-mono text-blue-400">containerClassName</td>
                      <td className="p-4 font-mono text-purple-400">string</td>
                      <td className="p-4 font-mono text-green-400">-</td>
                      <td className="p-4 text-neutral-400">CSS classes for the container</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4 text-blue-400">ProductCard</h3>
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
                      <td className="p-4 font-mono text-blue-400">product</td>
                      <td className="p-4 font-mono text-purple-400">Product</td>
                      <td className="p-4 text-neutral-400">Product object with title, link, and thumbnail</td>
                    </tr>
                    <tr className="hover:bg-neutral-900/25">
                      <td className="p-4 font-mono text-blue-400">translate</td>
                      <td className="p-4 font-mono text-purple-400">MotionValue&lt;number&gt;</td>
                      <td className="p-4 text-neutral-400">Framer Motion value for x-axis translation</td>
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