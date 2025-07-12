"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  ExpandableCardsStandard,
  ExpandableCardsGrid,
  ExpandableCardsBento
} from "@/component-library/components/ui/expandable-cards";
import { PlaygroundModal } from "@/app/components-gallery/components/PlaygroundModal";
import { ArrowLeft, Eye, Code2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const componentConfig = {
  id: "expandable-cards",
  name: "expandable-cards",
  title: "Expandable Cards",
  description: "Click cards to expand them and show additional information",
  category: "Interactive",
  hasPlayground: true,
  defaultProps: {
    variant: "standard"
  },
  propConfigs: {
    variant: {
      type: "select" as const,
      label: "Variant",
      defaultValue: "standard",
      options: ["standard", "grid", "bento"],
      description: "The variant of the expandable cards to display"
    }
  },
  codeTemplate: `import { ExpandableCards{{variant}} } from "@/component-library/components/ui/expandable-cards";

export function MyComponent() {
  return <ExpandableCards{{variant}} />;
}`,
  importStatement: 'import { ExpandableCards{{variant}} } from "@/component-library/components/ui/expandable-cards";'
};

export default function ExpandableCardsPage() {
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
              <h1 className="text-xl font-semibold">Expandable Cards</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Expandable Cards</h1>
          <p className="text-xl text-neutral-400 mb-6">
            Click cards to expand them and show additional information with smooth layout animations.
          </p>
          
          {/* Feature badges */}
          <div className="flex flex-wrap gap-2 mb-8">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm border border-blue-500/30">
              Layout Animations
            </span>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm border border-purple-500/30">
              Modal Overlays
            </span>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm border border-green-500/30">
              Click to Expand
            </span>
            <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm border border-orange-500/30">
              Responsive Design
            </span>
          </div>
        </div>

        {/* Variants Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Variants</h2>
          
          <div className="space-y-8">
            {/* Standard Variant */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-blue-400">Standard Layout</h3>
              <p className="text-neutral-400 mb-4">List-style expandable cards with horizontal layout</p>
              <div className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900/50">
                <ExpandableCardsStandard />
              </div>
            </div>

            {/* Grid Variant */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-blue-400">Grid Layout</h3>
              <p className="text-neutral-400 mb-4">Cards arranged in a responsive grid layout</p>
              <div className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900/50">
                <ExpandableCardsGrid />
              </div>
            </div>

            {/* Bento Variant */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-blue-400">Bento Grid Layout</h3>
              <p className="text-neutral-400 mb-4">Masonry-style bento grid with varying card sizes</p>
              <div className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900/50">
                <ExpandableCardsBento />
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
              Test different Expandable Cards configurations with live preview.
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
import { ExpandableCards } from "@/component-library/components/ui/expandable-cards";

const cards = [
  {
    description: "Artist Name",
    title: "Song Title",
    src: "image-url.jpg",
    ctaText: "Play",
    ctaLink: "https://example.com",
    content: () => {
      return <p>Detailed description goes here...</p>;
    },
  },
  // More cards...
];

export function ExpandableCardsExample() {
  return <ExpandableCards cards={cards} />;
}`}
            </pre>
          </div>
        </section>

        {/* Props Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Props</h2>
          
          <div className="space-y-6">
            {/* ExpandableCards Props */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-blue-400">ExpandableCards</h3>
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
                      <td className="p-4 font-mono text-blue-400">cards</td>
                      <td className="p-4 font-mono text-purple-400">CardData[]</td>
                      <td className="p-4 text-neutral-400">Array of card data objects</td>
                    </tr>
                    <tr className="hover:bg-neutral-900/25">
                      <td className="p-4 font-mono text-blue-400">className</td>
                      <td className="p-4 font-mono text-purple-400">string</td>
                      <td className="p-4 text-neutral-400">Additional CSS classes</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* CardData Type */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-blue-400">CardData</h3>
              <div className="border border-neutral-800 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-neutral-900/50">
                    <tr>
                      <th className="text-left p-4 font-medium">Property</th>
                      <th className="text-left p-4 font-medium">Type</th>
                      <th className="text-left p-4 font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    <tr className="hover:bg-neutral-900/25">
                      <td className="p-4 font-mono text-blue-400">title</td>
                      <td className="p-4 font-mono text-purple-400">string</td>
                      <td className="p-4 text-neutral-400">Card title</td>
                    </tr>
                    <tr className="hover:bg-neutral-900/25">
                      <td className="p-4 font-mono text-blue-400">description</td>
                      <td className="p-4 font-mono text-purple-400">string</td>
                      <td className="p-4 text-neutral-400">Card description</td>
                    </tr>
                    <tr className="hover:bg-neutral-900/25">
                      <td className="p-4 font-mono text-blue-400">src</td>
                      <td className="p-4 font-mono text-purple-400">string</td>
                      <td className="p-4 text-neutral-400">Image URL</td>
                    </tr>
                    <tr className="hover:bg-neutral-900/25">
                      <td className="p-4 font-mono text-blue-400">ctaText</td>
                      <td className="p-4 font-mono text-purple-400">string</td>
                      <td className="p-4 text-neutral-400">Call-to-action button text</td>
                    </tr>
                    <tr className="hover:bg-neutral-900/25">
                      <td className="p-4 font-mono text-blue-400">ctaLink</td>
                      <td className="p-4 font-mono text-purple-400">string</td>
                      <td className="p-4 text-neutral-400">Call-to-action link</td>
                    </tr>
                    <tr className="hover:bg-neutral-900/25">
                      <td className="p-4 font-mono text-blue-400">content</td>
                      <td className="p-4 font-mono text-purple-400">{'() => JSX.Element'}</td>
                      <td className="p-4 text-neutral-400">Expanded content function</td>
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