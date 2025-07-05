"use client";

import React, { useState } from "react";
import { 
  HoverBorderGradientPreview,
  HoverBorderGradientDemo,
  HoverBorderGradientMinimal,
  HoverBorderGradientLink,
  HoverBorderGradientSquare
} from "@/components/ui/hover-border-gradient";
import { PlaygroundModal } from "@/app/components-gallery/components/PlaygroundModal";
import { ArrowLeft, Eye, Code2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const componentConfig = {
  id: "hover-border-gradient",
  name: "hover-border-gradient", 
  title: "Hover Border Gradient",
  description: "A hover effect that expands to the entire container with a gradient border",
  category: "Utilities",
  hasPlayground: true,
  defaultProps: {
    children: "Hover Me",
    containerClassName: "rounded-full",
    className: "dark:bg-black bg-white text-black dark:text-white",
    as: "button",
    duration: 1,
    clockwise: true
  },
  propConfigs: {
    children: {
      type: "string" as const,
      label: "Content",
      defaultValue: "Hover Me",
      description: "The content to display inside the button"
    },
    containerClassName: {
      type: "string" as const,
      label: "Container Classes",
      defaultValue: "rounded-full",
      description: "CSS classes for the container"
    },
    className: {
      type: "string" as const,
      label: "Inner Classes",
      defaultValue: "dark:bg-black bg-white text-black dark:text-white",
      description: "CSS classes for the inner content"
    },
    as: {
      type: "select" as const,
      label: "Element Type",
      defaultValue: "button",
      options: ["button", "a", "div", "span"],
      description: "The HTML element type"
    },
    duration: {
      type: "range" as const,
      label: "Animation Duration",
      defaultValue: 1,
      min: 0.5,
      max: 5,
      step: 0.5,
      description: "Duration of the gradient rotation in seconds"
    },
    clockwise: {
      type: "boolean" as const,
      label: "Clockwise Rotation",
      defaultValue: true,
      description: "Direction of gradient rotation"
    }
  },
  codeTemplate: `import React from "react";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

export function MyComponent() {
  return (
    <HoverBorderGradient
      containerClassName="{{containerClassName}}"
      as="{{as}}"
      className="{{className}}"
      duration={{{duration}}}
      clockwise={{{clockwise}}}
    >
      {{children}}
    </HoverBorderGradient>
  );
}`,
  importStatement: 'import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";'
};

export default function HoverBorderGradientPage() {
  const [isPlaygroundOpen, setIsPlaygroundOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState("preview");

  const variants = [
    { id: "preview", name: "Preview", component: <HoverBorderGradientPreview /> },
    { id: "demo", name: "Full Demo", component: <HoverBorderGradientDemo /> },
    { id: "minimal", name: "Minimal", component: <HoverBorderGradientMinimal /> },
    { id: "link", name: "Link", component: <HoverBorderGradientLink /> },
    { id: "square", name: "Square", component: <HoverBorderGradientSquare /> },
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
              <h1 className="text-xl font-semibold">Hover Border Gradient</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Hover Border Gradient</h1>
          <p className="text-xl text-neutral-400 mb-6">
            A hover effect that expands to the entire container with a gradient border.
          </p>
          
          {/* Feature badges */}
          <div className="flex flex-wrap gap-2 mb-8">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm border border-blue-500/30">
              Hover Effect
            </span>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm border border-purple-500/30">
              Gradient Border
            </span>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm border border-green-500/30">
              Animated
            </span>
            <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm border border-orange-500/30">
              Customizable
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
              Test different Hover Border Gradient configurations with live preview.
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
import { HoverBorderGradient } from "../ui/hover-border-gradient";
 
export function HoverBorderGradientDemo() {
  return (
    <div className="m-40 flex justify-center text-center">
      <HoverBorderGradient
        containerClassName="rounded-full"
        as="button"
        className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
      >
        <AceternityLogo />
        <span>Aceternity UI</span>
      </HoverBorderGradient>
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
            <div>
              <h3 className="text-lg font-medium mb-4 text-blue-400">HoverBorderGradient</h3>
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
                      <td className="p-4 font-mono text-blue-400">children</td>
                      <td className="p-4 font-mono text-purple-400">React.ReactNode</td>
                      <td className="p-4 font-mono text-green-400">-</td>
                      <td className="p-4 text-neutral-400">Content to display inside the component</td>
                    </tr>
                    <tr className="hover:bg-neutral-900/25">
                      <td className="p-4 font-mono text-blue-400">containerClassName</td>
                      <td className="p-4 font-mono text-purple-400">string</td>
                      <td className="p-4 font-mono text-green-400">-</td>
                      <td className="p-4 text-neutral-400">CSS classes for the container</td>
                    </tr>
                    <tr className="hover:bg-neutral-900/25">
                      <td className="p-4 font-mono text-blue-400">className</td>
                      <td className="p-4 font-mono text-purple-400">string</td>
                      <td className="p-4 font-mono text-green-400">-</td>
                      <td className="p-4 text-neutral-400">CSS classes for the inner content</td>
                    </tr>
                    <tr className="hover:bg-neutral-900/25">
                      <td className="p-4 font-mono text-blue-400">as</td>
                      <td className="p-4 font-mono text-purple-400">React.ElementType</td>
                      <td className="p-4 font-mono text-green-400">"button"</td>
                      <td className="p-4 text-neutral-400">The component type to render</td>
                    </tr>
                    <tr className="hover:bg-neutral-900/25">
                      <td className="p-4 font-mono text-blue-400">duration</td>
                      <td className="p-4 font-mono text-purple-400">number</td>
                      <td className="p-4 font-mono text-green-400">1</td>
                      <td className="p-4 text-neutral-400">Duration of animation cycle in seconds</td>
                    </tr>
                    <tr className="hover:bg-neutral-900/25">
                      <td className="p-4 font-mono text-blue-400">clockwise</td>
                      <td className="p-4 font-mono text-purple-400">boolean</td>
                      <td className="p-4 font-mono text-green-400">true</td>
                      <td className="p-4 text-neutral-400">Direction of gradient rotation</td>
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