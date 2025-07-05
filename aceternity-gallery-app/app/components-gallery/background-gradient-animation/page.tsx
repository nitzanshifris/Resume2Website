"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  BackgroundGradientAnimationPreview,
  BackgroundGradientAnimationDemo,
  BackgroundGradientAnimationCustom,
  BackgroundGradientAnimationCallToAction
} from "@/components/ui/background-gradient-animation";
import { PlaygroundModal } from "@/app/components-gallery/components/PlaygroundModal";
import { ArrowLeft, Eye, Code2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const componentConfig = {
  id: "background-gradient-animation",
  name: "background-gradient-animation", 
  title: "Background Gradient Animation",
  description: "A smooth and elegant background gradient animation that changes the gradient position over time",
  category: "Background",
  hasPlayground: true,
  defaultProps: {
    gradientBackgroundStart: "rgb(108, 0, 162)",
    gradientBackgroundEnd: "rgb(0, 17, 82)",
    firstColor: "18, 113, 255",
    secondColor: "221, 74, 255",
    thirdColor: "100, 220, 255",
    fourthColor: "200, 50, 50",
    fifthColor: "180, 180, 50",
    pointerColor: "140, 100, 255",
    size: "80%",
    blendingValue: "hard-light",
    interactive: true
  },
  propConfigs: {
    gradientBackgroundStart: {
      type: "string" as const,
      label: "Background Start Color",
      defaultValue: "rgb(108, 0, 162)",
      description: "The starting color of the background gradient"
    },
    gradientBackgroundEnd: {
      type: "string" as const,
      label: "Background End Color",
      defaultValue: "rgb(0, 17, 82)",
      description: "The ending color of the background gradient"
    },
    firstColor: {
      type: "string" as const,
      label: "First Color",
      defaultValue: "18, 113, 255",
      description: "The first animated color (RGB values without rgb())"
    },
    secondColor: {
      type: "string" as const,
      label: "Second Color",
      defaultValue: "221, 74, 255",
      description: "The second animated color (RGB values without rgb())"
    },
    thirdColor: {
      type: "string" as const,
      label: "Third Color",
      defaultValue: "100, 220, 255",
      description: "The third animated color (RGB values without rgb())"
    },
    size: {
      type: "string" as const,
      label: "Animation Size",
      defaultValue: "80%",
      description: "The size of the animated gradient elements"
    },
    blendingValue: {
      type: "select" as const,
      label: "Blend Mode",
      defaultValue: "hard-light",
      options: ["normal", "multiply", "screen", "overlay", "soft-light", "hard-light", "color-dodge", "color-burn"],
      description: "CSS blend mode for the animated elements"
    },
    interactive: {
      type: "boolean" as const,
      label: "Interactive",
      defaultValue: true,
      description: "Enable mouse interaction"
    }
  },
  codeTemplate: `import React from "react";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";

export function MyComponent() {
  return (
    <BackgroundGradientAnimation
      gradientBackgroundStart="{{gradientBackgroundStart}}"
      gradientBackgroundEnd="{{gradientBackgroundEnd}}"
      firstColor="{{firstColor}}"
      secondColor="{{secondColor}}"
      thirdColor="{{thirdColor}}"
      size="{{size}}"
      blendingValue="{{blendingValue}}"
      interactive={{{interactive}}}
    >
      <div className="absolute z-50 inset-0 flex items-center justify-center text-white font-bold px-4 pointer-events-none text-3xl text-center md:text-4xl lg:text-7xl">
        <p className="bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-b from-white/80 to-white/20">
          Your Content Here
        </p>
      </div>
    </BackgroundGradientAnimation>
  );
}`,
  importStatement: 'import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";'
};

export default function BackgroundGradientAnimationPage() {
  const [isPlaygroundOpen, setIsPlaygroundOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState("preview");

  const variants = [
    { id: "preview", name: "Preview", component: <BackgroundGradientAnimationPreview /> },
    { id: "demo", name: "Full Demo", component: <BackgroundGradientAnimationDemo /> },
    { id: "custom", name: "Custom Colors", component: <BackgroundGradientAnimationCustom /> },
    { id: "cta", name: "Call to Action", component: <BackgroundGradientAnimationCallToAction /> },
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
              <h1 className="text-xl font-semibold">Background Gradient Animation</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Background Gradient Animation</h1>
          <p className="text-xl text-neutral-400 mb-6">
            A smooth and elegant background gradient animation that changes the gradient position over time.
          </p>
          
          {/* Feature badges */}
          <div className="flex flex-wrap gap-2 mb-8">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm border border-blue-500/30">
              Gradient Animation
            </span>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm border border-purple-500/30">
              Interactive
            </span>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm border border-green-500/30">
              Background
            </span>
            <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm border border-orange-500/30">
              Call to Action
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
              Test different Background Gradient Animation configurations with live preview.
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
              <h3 className="text-lg font-medium mb-2">Add animations to your CSS file</h3>
              <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
                <pre className="text-green-400 font-mono text-sm overflow-x-auto">
{`@keyframes moveHorizontal {
  0% { transform: translateX(-50%) translateY(-10%); }
  50% { transform: translateX(50%) translateY(10%); }
  100% { transform: translateX(-50%) translateY(-10%); }
}

@keyframes moveInCircle {
  0% { transform: rotate(0deg); }
  50% { transform: rotate(180deg); }
  100% { transform: rotate(360deg); }
}

@keyframes moveVertical {
  0% { transform: translateY(-50%); }
  50% { transform: translateY(50%); }
  100% { transform: translateY(-50%); }
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
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";

export function BackgroundGradientAnimationDemo() {
  return (
    <BackgroundGradientAnimation>
      <div className="absolute z-50 inset-0 flex items-center justify-center text-white font-bold px-4 pointer-events-none text-3xl text-center md:text-4xl lg:text-7xl">
        <p className="bg-clip-text text-transparent drop-shadow-2xl bg-gradient-to-b from-white/80 to-white/20">
          Gradients X Animations
        </p>
      </div>
    </BackgroundGradientAnimation>
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
              <h3 className="text-lg font-medium mb-4 text-blue-400">BackgroundGradientAnimation</h3>
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
                      <td className="p-4 font-mono text-blue-400">gradientBackgroundStart</td>
                      <td className="p-4 font-mono text-purple-400">string</td>
                      <td className="p-4 font-mono text-green-400">"rgb(108, 0, 162)"</td>
                      <td className="p-4 text-neutral-400">Starting color of background gradient</td>
                    </tr>
                    <tr className="hover:bg-neutral-900/25">
                      <td className="p-4 font-mono text-blue-400">gradientBackgroundEnd</td>
                      <td className="p-4 font-mono text-purple-400">string</td>
                      <td className="p-4 font-mono text-green-400">"rgb(0, 17, 82)"</td>
                      <td className="p-4 text-neutral-400">Ending color of background gradient</td>
                    </tr>
                    <tr className="hover:bg-neutral-900/25">
                      <td className="p-4 font-mono text-blue-400">firstColor</td>
                      <td className="p-4 font-mono text-purple-400">string</td>
                      <td className="p-4 font-mono text-green-400">"18, 113, 255"</td>
                      <td className="p-4 text-neutral-400">First animated color (RGB values)</td>
                    </tr>
                    <tr className="hover:bg-neutral-900/25">
                      <td className="p-4 font-mono text-blue-400">interactive</td>
                      <td className="p-4 font-mono text-purple-400">boolean</td>
                      <td className="p-4 font-mono text-green-400">true</td>
                      <td className="p-4 text-neutral-400">Enable mouse interaction</td>
                    </tr>
                    <tr className="hover:bg-neutral-900/25">
                      <td className="p-4 font-mono text-blue-400">size</td>
                      <td className="p-4 font-mono text-purple-400">string</td>
                      <td className="p-4 font-mono text-green-400">"80%"</td>
                      <td className="p-4 text-neutral-400">Size of animated gradient elements</td>
                    </tr>
                    <tr className="hover:bg-neutral-900/25">
                      <td className="p-4 font-mono text-blue-400">blendingValue</td>
                      <td className="p-4 font-mono text-purple-400">string</td>
                      <td className="p-4 font-mono text-green-400">"hard-light"</td>
                      <td className="p-4 text-neutral-400">CSS blend mode for animations</td>
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