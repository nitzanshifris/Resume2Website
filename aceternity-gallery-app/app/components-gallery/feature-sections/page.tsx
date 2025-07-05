"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  FeatureSectionsBento,
  FeatureSectionsSimple,
  FeatureSectionsHover
} from "@/component-library/components/ui/feature-sections";
import { PlaygroundModal } from "@/app/components-gallery/components/PlaygroundModal";
import { ArrowLeft, Eye, Code2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const componentConfig = {
  id: "feature-sections",
  name: "feature-sections",
  title: "Feature Sections",
  description: "A set of feature sections ranging from bento grids to simple layouts",
  category: "Layout",
  hasPlayground: true,
  defaultProps: {
    variant: "bento"
  },
  propConfigs: {
    variant: {
      type: "select" as const,
      label: "Variant",
      defaultValue: "bento",
      options: ["bento", "simple", "hover"],
      description: "The variant of the feature sections to display"
    }
  },
  codeTemplate: `import { FeatureSections{{variant}} } from "@/component-library/components/ui/feature-sections";

export function MyComponent() {
  return <FeatureSections{{variant}} />;
}`,
  importStatement: 'import { FeatureSections{{variant}} } from "@/component-library/components/ui/feature-sections";'
};

export default function FeatureSectionsPage() {
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
              <h1 className="text-xl font-semibold">Feature Sections</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Feature Sections</h1>
          <p className="text-xl text-neutral-400 mb-6">
            A set of feature sections ranging from bento grids to simple layouts with beautiful animations and effects.
          </p>
          
          {/* Feature badges */}
          <div className="flex flex-wrap gap-2 mb-8">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm border border-blue-500/30">
              Responsive Layouts
            </span>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm border border-purple-500/30">
              Interactive Hover Effects
            </span>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm border border-green-500/30">
              Multiple Variants
            </span>
            <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm border border-orange-500/30">
              Grid Patterns
            </span>
          </div>
        </div>

        {/* Variants Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Variants</h2>
          
          <div className="space-y-8">
            {/* Bento Grid Variant */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-blue-400">Bento Grid</h3>
              <p className="text-neutral-400 mb-4">Complex bento grid layout with interactive skeletons and animations</p>
              <div className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900/50">
                <FeatureSectionsBento features={[]} />
              </div>
            </div>

            {/* Simple Card Gradient Variant */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-blue-400">Simple with Card Gradient</h3>
              <p className="text-neutral-400 mb-4">Clean card layout with gradient backgrounds and grid patterns</p>
              <div className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900/50">
                <FeatureSectionsSimple features={[]} />
              </div>
            </div>

            {/* Simple Hover Effects Variant */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-blue-400">Simple with Hover Effects</h3>
              <p className="text-neutral-400 mb-4">Grid layout with smooth hover animations and border highlights</p>
              <div className="border border-neutral-800 rounded-lg overflow-hidden bg-neutral-900/50">
                <FeatureSectionsHover features={[]} />
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
              Test different Feature Sections configurations with live preview.
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
                  npm i motion clsx tailwind-merge @tabler/icons-react cobe
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
import { FeatureSectionsBento } from "@/component-library/components/ui/feature-sections";

const features = [
  {
    title: "Track issues effectively",
    description: "Track and manage your project issues with ease.",
    skeleton: <YourCustomSkeleton />,
    className: "col-span-1 lg:col-span-4",
  },
  // More features...
];

export function FeatureSectionsExample() {
  return (
    <FeatureSectionsBento 
      features={features}
      title="Your Amazing Features"
      subtitle="Everything you need in one place"
    />
  );
}`}
            </pre>
          </div>
        </section>

        {/* Props Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Props</h2>
          
          <div className="space-y-6">
            {/* FeatureSections Props */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-blue-400">FeatureSections</h3>
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
                      <td className="p-4 font-mono text-blue-400">features</td>
                      <td className="p-4 font-mono text-purple-400">Feature[]</td>
                      <td className="p-4 text-neutral-400">Array of feature objects</td>
                    </tr>
                    <tr className="hover:bg-neutral-900/25">
                      <td className="p-4 font-mono text-blue-400">title</td>
                      <td className="p-4 font-mono text-purple-400">string</td>
                      <td className="p-4 text-neutral-400">Main section title</td>
                    </tr>
                    <tr className="hover:bg-neutral-900/25">
                      <td className="p-4 font-mono text-blue-400">subtitle</td>
                      <td className="p-4 font-mono text-purple-400">string</td>
                      <td className="p-4 text-neutral-400">Section subtitle</td>
                    </tr>
                    <tr className="hover:bg-neutral-900/25">
                      <td className="p-4 font-mono text-blue-400">className</td>
                      <td className="p-4 font-mono text-purple-400">string</td>
                      <td className="p-4 text-neutral-400">Additional CSS classes</td>
                    </tr>
                    <tr className="hover:bg-neutral-900/25">
                      <td className="p-4 font-mono text-blue-400">columns</td>
                      <td className="p-4 font-mono text-purple-400">1 | 2 | 3 | 4</td>
                      <td className="p-4 text-neutral-400">Number of columns (simple variants)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Feature Type */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-blue-400">Feature</h3>
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
                      <td className="p-4 text-neutral-400">Feature title</td>
                    </tr>
                    <tr className="hover:bg-neutral-900/25">
                      <td className="p-4 font-mono text-blue-400">description</td>
                      <td className="p-4 font-mono text-purple-400">string</td>
                      <td className="p-4 text-neutral-400">Feature description</td>
                    </tr>
                    <tr className="hover:bg-neutral-900/25">
                      <td className="p-4 font-mono text-blue-400">icon</td>
                      <td className="p-4 font-mono text-purple-400">ReactNode</td>
                      <td className="p-4 text-neutral-400">Feature icon (optional)</td>
                    </tr>
                    <tr className="hover:bg-neutral-900/25">
                      <td className="p-4 font-mono text-blue-400">skeleton</td>
                      <td className="p-4 font-mono text-purple-400">ReactNode</td>
                      <td className="p-4 text-neutral-400">Custom skeleton for bento variant</td>
                    </tr>
                    <tr className="hover:bg-neutral-900/25">
                      <td className="p-4 font-mono text-blue-400">className</td>
                      <td className="p-4 font-mono text-purple-400">string</td>
                      <td className="p-4 text-neutral-400">Custom CSS classes</td>
                    </tr>
                    <tr className="hover:bg-neutral-900/25">
                      <td className="p-4 font-mono text-blue-400">href</td>
                      <td className="p-4 font-mono text-purple-400">string</td>
                      <td className="p-4 text-neutral-400">Link URL (optional)</td>
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