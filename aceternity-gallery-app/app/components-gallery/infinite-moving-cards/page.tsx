"use client";

import React, { useState } from "react";
import { 
  InfiniteMovingCardsPreview,
  InfiniteMovingCardsDemo,
  InfiniteMovingCardsFast,
  InfiniteMovingCardsReverse,
  InfiniteMovingCardsNoPause
} from "@/components/ui/infinite-moving-cards";
import { PlaygroundModal } from "@/app/components-gallery/components/PlaygroundModal";
import { ArrowLeft, Eye, Code2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const componentConfig = {
  id: "infinite-moving-cards",
  name: "infinite-moving-cards", 
  title: "Infinite Moving Cards",
  description: "A customizable group of cards that move infinitely in a loop",
  category: "Utilities",
  hasPlayground: true,
  defaultProps: {
    items: [
      {
        quote: "The only way to do great work is to love what you do.",
        name: "Steve Jobs",
        title: "Apple Co-founder"
      },
      {
        quote: "Innovation distinguishes between a leader and a follower.",
        name: "Steve Jobs", 
        title: "Stanford Commencement 2005"
      },
      {
        quote: "Your time is limited, don't waste it living someone else's life.",
        name: "Steve Jobs",
        title: "Stanford Commencement 2005"
      }
    ],
    direction: "left",
    speed: "normal",
    pauseOnHover: true,
    className: ""
  },
  propConfigs: {
    items: {
      type: "textarea" as const,
      label: "Items (JSON)",
      defaultValue: JSON.stringify([
        {
          quote: "The only way to do great work is to love what you do.",
          name: "Steve Jobs",
          title: "Apple Co-founder"
        },
        {
          quote: "Innovation distinguishes between a leader and a follower.",
          name: "Steve Jobs", 
          title: "Stanford Commencement 2005"
        },
        {
          quote: "Your time is limited, don't waste it living someone else's life.",
          name: "Steve Jobs",
          title: "Stanford Commencement 2005"
        }
      ], null, 2),
      description: "Array of testimonial items with quote, name, and title"
    },
    direction: {
      type: "select" as const,
      label: "Direction",
      defaultValue: "left",
      options: ["left", "right"],
      description: "Direction of the scrolling animation"
    },
    speed: {
      type: "select" as const,
      label: "Speed",
      defaultValue: "normal",
      options: ["fast", "normal", "slow"],
      description: "Speed of the scrolling animation"
    },
    pauseOnHover: {
      type: "boolean" as const,
      label: "Pause on Hover",
      defaultValue: true,
      description: "Pause animation when hovering over cards"
    },
    className: {
      type: "string" as const,
      label: "Additional Classes",
      defaultValue: "",
      description: "Additional CSS classes for the container"
    }
  },
  codeTemplate: `import React from "react";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";

const testimonials = {{items}};

export function MyComponent() {
  return (
    <div className="h-[40rem] rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards
        items={testimonials}
        direction="{{direction}}"
        speed="{{speed}}"
        pauseOnHover={{{pauseOnHover}}}
        className="{{className}}"
      />
    </div>
  );
}`,
  importStatement: 'import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";'
};

export default function InfiniteMovingCardsPage() {
  const [isPlaygroundOpen, setIsPlaygroundOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState("preview");

  const variants = [
    { id: "preview", name: "Preview", component: <InfiniteMovingCardsPreview /> },
    { id: "demo", name: "Full Demo", component: <InfiniteMovingCardsDemo /> },
    { id: "fast", name: "Fast Speed", component: <InfiniteMovingCardsFast /> },
    { id: "reverse", name: "Reverse Direction", component: <InfiniteMovingCardsReverse /> },
    { id: "no-pause", name: "No Pause", component: <InfiniteMovingCardsNoPause /> },
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
              <h1 className="text-xl font-semibold">Infinite Moving Cards</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Infinite Moving Cards</h1>
          <p className="text-xl text-neutral-400 mb-6">
            A customizable group of cards that move infinitely in a loop. Made with Framer Motion and Tailwind CSS.
          </p>
          
          {/* Feature badges */}
          <div className="flex flex-wrap gap-2 mb-8">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm border border-blue-500/30">
              Infinite Loop
            </span>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm border border-purple-500/30">
              Customizable Speed
            </span>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm border border-green-500/30">
              Bidirectional
            </span>
            <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm border border-orange-500/30">
              Pause on Hover
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
              Test different Infinite Moving Cards configurations with live preview.
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
              <h3 className="text-lg font-medium mb-2">Add Tailwind CSS animation</h3>
              <p className="text-neutral-400 mb-2">Add the scroll animation to your tailwind.config.js:</p>
              <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
                <pre className="text-green-400 font-mono text-sm overflow-x-auto">
{`module.exports = {
  theme: {
    extend: {
      keyframes: {
        scroll: {
          to: {
            transform: "translate(calc(-50% - 0.5rem))",
          },
        },
      },
      animation: {
        scroll: "scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite",
      },
    },
  },
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
{`"use client";
 
import React from "react";
import { InfiniteMovingCards } from "../ui/infinite-moving-cards";
 
export function InfiniteMovingCardsDemo() {
  return (
    <div className="h-[40rem] rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="slow"
      />
    </div>
  );
}
 
const testimonials = [
  {
    quote:
      "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair.",
    name: "Charles Dickens",
    title: "A Tale of Two Cities",
  },
  {
    quote:
      "To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer The slings and arrows of outrageous fortune, Or to take Arms against a Sea of troubles, And by opposing end them: to die, to sleep.",
    name: "William Shakespeare",
    title: "Hamlet",
  },
  // ... more testimonials
];`}
            </pre>
          </div>
        </section>

        {/* Props Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Props</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4 text-blue-400">InfiniteMovingCards</h3>
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
                      <td className="p-4 font-mono text-blue-400">items</td>
                      <td className="p-4 font-mono text-purple-400">{`{ quote: string; name: string; title: string; }[]`}</td>
                      <td className="p-4 font-mono text-green-400">-</td>
                      <td className="p-4 text-neutral-400">Array of testimonial items</td>
                    </tr>
                    <tr className="hover:bg-neutral-900/25">
                      <td className="p-4 font-mono text-blue-400">direction</td>
                      <td className="p-4 font-mono text-purple-400">&quot;left&quot; | &quot;right&quot;</td>
                      <td className="p-4 font-mono text-green-400">&quot;left&quot;</td>
                      <td className="p-4 text-neutral-400">Direction of the animation</td>
                    </tr>
                    <tr className="hover:bg-neutral-900/25">
                      <td className="p-4 font-mono text-blue-400">speed</td>
                      <td className="p-4 font-mono text-purple-400">&quot;fast&quot; | &quot;normal&quot; | &quot;slow&quot;</td>
                      <td className="p-4 font-mono text-green-400">&quot;fast&quot;</td>
                      <td className="p-4 text-neutral-400">Speed of the animation</td>
                    </tr>
                    <tr className="hover:bg-neutral-900/25">
                      <td className="p-4 font-mono text-blue-400">pauseOnHover</td>
                      <td className="p-4 font-mono text-purple-400">boolean</td>
                      <td className="p-4 font-mono text-green-400">true</td>
                      <td className="p-4 text-neutral-400">Pause animation on hover</td>
                    </tr>
                    <tr className="hover:bg-neutral-900/25">
                      <td className="p-4 font-mono text-blue-400">className</td>
                      <td className="p-4 font-mono text-purple-400">string</td>
                      <td className="p-4 font-mono text-green-400">-</td>
                      <td className="p-4 text-neutral-400">Additional CSS classes</td>
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