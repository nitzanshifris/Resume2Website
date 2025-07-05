"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  CoverDemo,
  CoverWordEffect,
  CoverInteractive,
  Cover 
} from "@/component-library/components/ui/cover";
import { PlaygroundModal } from "@/app/components-gallery/components/PlaygroundModal";
import { ArrowLeft, Eye, Code2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const componentConfig = {
  id: "cover",
  name: "cover",
  title: "Cover",
  description: "A Cover component that wraps any children, providing beams and space effect, hover to reveal speed",
  category: "Special Effects",
  hasPlayground: true,
  defaultProps: {
    children: "warp speed",
    className: ""
  },
  propConfigs: {
    children: {
      type: "string" as const,
      label: "Text Content",
      defaultValue: "warp speed",
      description: "The text content to wrap with cover effects"
    },
    className: {
      type: "string" as const,
      label: "Custom Classes",
      defaultValue: "",
      description: "Additional CSS classes to apply"
    }
  },
  codeTemplate: `import { Cover } from "@/component-library/components/ui/cover";

export function MyComponent() {
  return (
    <div>
      <h1 className="text-4xl font-semibold text-center">
        Build amazing websites at <Cover{{className ? \` className="\${className}"\` : ''}}>{{children}}</Cover>
      </h1>
    </div>
  );
}`,
  importStatement: 'import { Cover } from "@/component-library/components/ui/cover";'
};

export default function CoverPage() {
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
              <h1 className="text-xl font-semibold">Cover</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Cover</h1>
          <p className="text-xl text-neutral-400 mb-6">
            A Cover component that wraps any children, providing beams and space effect, hover to reveal speed.
          </p>
          
          {/* Feature badges */}
          <div className="flex flex-wrap gap-2 mb-8">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm border border-blue-500/30">
              Special Effects
            </span>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm border border-purple-500/30">
              Animated Beams
            </span>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm border border-green-500/30">
              Sparkle Effects
            </span>
          </div>
        </div>

        {/* Demo Section */}
        <section className="mb-12">
          <div className="flex items-center space-x-2 mb-6">
            <Eye className="w-5 h-5 text-blue-400" />
            <h2 className="text-2xl font-semibold">Standard Demo</h2>
          </div>
          
          <div className="border border-neutral-800 rounded-lg overflow-hidden">
            <div className="bg-neutral-900/50 p-6">
              <CoverDemo />
            </div>
          </div>
        </section>

        {/* Variants Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Variants</h2>
          
          <div className="space-y-8">
            {/* Word Effect */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-blue-400">Word Effect</h3>
              <p className="text-neutral-400 mb-4">Multiple words with cover effects in a longer text</p>
              <div className="border border-neutral-800 rounded-lg overflow-hidden">
                <div className="bg-neutral-900/50 p-6">
                  <CoverWordEffect />
                </div>
              </div>
            </div>

            {/* Interactive */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-blue-400">Interactive</h3>
              <p className="text-neutral-400 mb-4">Multiple interactive cover elements with different text</p>
              <div className="border border-neutral-800 rounded-lg overflow-hidden">
                <div className="bg-neutral-900/50 p-6">
                  <CoverInteractive />
                </div>
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
              Test different Cover component configurations with live preview.
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
            
            <div>
              <h3 className="text-lg font-medium mb-2">Install Sparkles Dependencies</h3>
              <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
                <code className="text-green-400 font-mono text-sm">
                  npm i @tsparticles/react @tsparticles/engine @tsparticles/slim
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
{`import { Cover } from "@/component-library/components/ui/cover";

export function MyComponent() {
  return (
    <div>
      <h1 className="text-4xl md:text-4xl lg:text-6xl font-semibold max-w-7xl mx-auto text-center mt-6 relative z-20 py-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
        Build amazing websites <br /> at <Cover>warp speed</Cover>
      </h1>
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
                  <th className="text-left p-4 font-medium">Default</th>
                  <th className="text-left p-4 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {Object.entries(componentConfig.propConfigs).map(([key, prop], index) => (
                  <tr key={index} className="hover:bg-neutral-900/25">
                    <td className="p-4 font-mono text-blue-400">{key}</td>
                    <td className="p-4 font-mono text-purple-400">{key === 'children' ? 'React.ReactNode' : prop.type}</td>
                    <td className="p-4 font-mono text-green-400">{prop.defaultValue || 'undefined'}</td>
                    <td className="p-4 text-neutral-400">{prop.description}</td>
                  </tr>
                ))}
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