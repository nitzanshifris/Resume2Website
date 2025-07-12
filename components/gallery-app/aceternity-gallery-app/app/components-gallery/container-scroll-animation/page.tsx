"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  HeroScrollDemo,
  ProductScrollDemo,
  FeaturesScrollDemo,
  ContainerScroll 
} from "@/component-library/components/ui/container-scroll-animation";
import { PlaygroundModal } from "@/app/components-gallery/components/PlaygroundModal";
import { ArrowLeft, Eye, Code2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const componentConfig = {
  id: "container-scroll-animation",
  name: "container-scroll-animation",
  title: "Container Scroll Animation",
  description: "A scroll animation that rotates in 3d on scroll. Perfect for hero or marketing sections",
  category: "Special Effects",
  hasPlayground: true,
  defaultProps: {
    titleComponent: "Scroll Animation Demo",
    children: "Content goes here"
  },
  propConfigs: {
    titleComponent: {
      type: "string" as const,
      label: "Title Component",
      defaultValue: "Scroll Animation Demo",
      description: "The title or heading component to display"
    }
  },
  codeTemplate: `import { ContainerScroll } from "@/component-library/components/ui/container-scroll-animation";

export function MyComponent() {
  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-black dark:text-white">
              {{titleComponent}}
            </h1>
          </>
        }
      >
        <img
          src="https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=1400&h=720&fit=crop"
          alt="hero"
          className="mx-auto rounded-2xl object-cover h-full"
        />
      </ContainerScroll>
    </div>
  );
}`,
  importStatement: 'import { ContainerScroll } from "@/component-library/components/ui/container-scroll-animation";'
};

export default function ContainerScrollAnimationPage() {
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
              <h1 className="text-xl font-semibold">Container Scroll Animation</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Container Scroll Animation</h1>
          <p className="text-xl text-neutral-400 mb-6">
            A scroll animation that rotates in 3d on scroll. Perfect for hero or marketing sections.
          </p>
          
          {/* Feature badges */}
          <div className="flex flex-wrap gap-2 mb-8">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm border border-blue-500/30">
              3D Effects
            </span>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm border border-purple-500/30">
              Scroll Triggered
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
            <h2 className="text-2xl font-semibold">Hero Scroll Demo</h2>
          </div>
          
          <div className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900/50">
            <HeroScrollDemo />
          </div>
        </section>

        {/* Variants Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Variants</h2>
          
          <div className="space-y-8">
            {/* Product Variant */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-blue-400">Product Showcase</h3>
              <p className="text-neutral-400 mb-4">Perfect for showcasing product features with analytics</p>
              <div className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900/50">
                <ProductScrollDemo />
              </div>
            </div>

            {/* Features Variant */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-blue-400">Features Grid</h3>
              <p className="text-neutral-400 mb-4">Display key features in an engaging grid layout</p>
              <div className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900/50">
                <FeaturesScrollDemo />
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
              Test different Container Scroll Animation configurations with live preview.
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
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

export function HeroScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-black dark:text-white">
              Unleash the power of <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">
                Scroll Animations
              </span>
            </h1>
          </>
        }
      >
        <img
          src="/linear.webp"
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>
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
                  <th className="text-left p-4 font-medium">Component</th>
                  <th className="text-left p-4 font-medium">Prop</th>
                  <th className="text-left p-4 font-medium">Type</th>
                  <th className="text-left p-4 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                <tr className="hover:bg-neutral-900/25">
                  <td className="p-4 font-mono text-blue-400">ContainerScroll</td>
                  <td className="p-4 font-mono text-purple-400">titleComponent</td>
                  <td className="p-4 font-mono text-green-400">string | React.ReactNode</td>
                  <td className="p-4 text-neutral-400">The component or string to be used as the title</td>
                </tr>
                <tr className="hover:bg-neutral-900/25">
                  <td className="p-4 font-mono text-blue-400">ContainerScroll</td>
                  <td className="p-4 font-mono text-purple-400">children</td>
                  <td className="p-4 font-mono text-green-400">React.ReactNode</td>
                  <td className="p-4 text-neutral-400">The children components to be rendered inside the ContainerScroll component</td>
                </tr>
                <tr className="hover:bg-neutral-900/25">
                  <td className="p-4 font-mono text-blue-400">Header</td>
                  <td className="p-4 font-mono text-purple-400">translate</td>
                  <td className="p-4 font-mono text-green-400">MotionValue&lt;number&gt;</td>
                  <td className="p-4 text-neutral-400">The motion value for translation to be applied to the Header component</td>
                </tr>
                <tr className="hover:bg-neutral-900/25">
                  <td className="p-4 font-mono text-blue-400">Header</td>
                  <td className="p-4 font-mono text-purple-400">titleComponent</td>
                  <td className="p-4 font-mono text-green-400">string | React.ReactNode</td>
                  <td className="p-4 text-neutral-400">The component or string to be used as the title in the Header component</td>
                </tr>
                <tr className="hover:bg-neutral-900/25">
                  <td className="p-4 font-mono text-blue-400">Card</td>
                  <td className="p-4 font-mono text-purple-400">rotate</td>
                  <td className="p-4 font-mono text-green-400">MotionValue&lt;number&gt;</td>
                  <td className="p-4 text-neutral-400">The motion value for rotation to be applied to the Card component</td>
                </tr>
                <tr className="hover:bg-neutral-900/25">
                  <td className="p-4 font-mono text-blue-400">Card</td>
                  <td className="p-4 font-mono text-purple-400">scale</td>
                  <td className="p-4 font-mono text-green-400">MotionValue&lt;number&gt;</td>
                  <td className="p-4 text-neutral-400">The motion value for scaling to be applied to the Card component</td>
                </tr>
                <tr className="hover:bg-neutral-900/25">
                  <td className="p-4 font-mono text-blue-400">Card</td>
                  <td className="p-4 font-mono text-purple-400">translate</td>
                  <td className="p-4 font-mono text-green-400">MotionValue&lt;number&gt;</td>
                  <td className="p-4 text-neutral-400">The motion value for translation to be applied to the Card component</td>
                </tr>
                <tr className="hover:bg-neutral-900/25">
                  <td className="p-4 font-mono text-blue-400">Card</td>
                  <td className="p-4 font-mono text-purple-400">children</td>
                  <td className="p-4 font-mono text-green-400">React.ReactNode</td>
                  <td className="p-4 text-neutral-400">The children components to be rendered inside the Card component</td>
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