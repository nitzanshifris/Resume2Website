"use client";

import React from "react";
import { ColourfulTextDemo, ColourfulTextHero, ColourfulTextMinimal } from "@/component-library/components/ui/colourful-text";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Code2, Copy, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";

export default function ColourfulTextPage() {
  const [copySuccess, setCopySuccess] = React.useState(false);

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const installCode = `npm i motion clsx tailwind-merge`;
  const usageCode = `import { ColourfulText } from "@/component-library/components/ui/colourful-text";

export function MyComponent() {
  return (
    <h1 className="text-4xl font-bold text-center">
      Build <ColourfulText text="amazing" /> experiences
    </h1>
  );
}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/components-gallery">
            <Button variant="ghost" className="mb-4 text-gray-400 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Gallery
            </Button>
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Colourful Text
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl">
            A text component with animated color transitions, filter and scale effects. Each character animates individually with smooth transitions.
          </p>
        </div>

        {/* Demo Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6">Demo</h2>
          <div className="rounded-xl overflow-hidden border border-zinc-800">
            <ColourfulTextDemo />
          </div>
        </div>

        {/* Variants */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6">Variants</h2>
          <div className="grid gap-6">
            <Card className="p-6 bg-zinc-900/50 border-zinc-800">
              <h3 className="text-lg font-semibold text-white mb-4">Hero Variant</h3>
              <div className="rounded-lg overflow-hidden border border-zinc-800">
                <ColourfulTextHero />
              </div>
            </Card>

            <Card className="p-6 bg-zinc-900/50 border-zinc-800">
              <h3 className="text-lg font-semibold text-white mb-4">Minimal Variant</h3>
              <div className="rounded-lg overflow-hidden border border-zinc-800">
                <ColourfulTextMinimal />
              </div>
            </Card>
          </div>
        </div>

        {/* Installation */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6">Installation</h2>
          <Card className="p-6 bg-zinc-900/50 border-zinc-800">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Install dependencies</h3>
                <div className="relative">
                  <pre className="bg-black/50 p-4 rounded-lg text-sm text-gray-300 overflow-x-auto">
                    <code>{installCode}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyCode(installCode)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-white"
                  >
                    {copySuccess ? "Copied!" : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Usage */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6">Usage</h2>
          <Card className="p-6 bg-zinc-900/50 border-zinc-800">
            <div className="relative">
              <pre className="bg-black/50 p-4 rounded-lg text-sm text-gray-300 overflow-x-auto">
                <code>{usageCode}</code>
              </pre>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyCode(usageCode)}
                className="absolute top-2 right-2 text-gray-400 hover:text-white"
              >
                {copySuccess ? "Copied!" : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </Card>
        </div>

        {/* Props */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6">Props</h2>
          <Card className="p-6 bg-zinc-900/50 border-zinc-800">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-700">
                  <th className="text-left py-3 px-4 text-gray-400">Prop</th>
                  <th className="text-left py-3 px-4 text-gray-400">Type</th>
                  <th className="text-left py-3 px-4 text-gray-400">Required</th>
                  <th className="text-left py-3 px-4 text-gray-400">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-zinc-800">
                  <td className="py-3 px-4 text-white font-mono text-sm">text</td>
                  <td className="py-3 px-4 text-gray-300 font-mono text-sm">string</td>
                  <td className="py-3 px-4 text-gray-300">Yes</td>
                  <td className="py-3 px-4 text-gray-300">The text string to be rendered with colorful animated characters</td>
                </tr>
              </tbody>
            </table>
          </Card>
        </div>

        {/* Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6">Features</h2>
          <Card className="p-6 bg-zinc-900/50 border-zinc-800">
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                Individual character animation with staggered delays
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                Smooth color transitions between 10 vibrant colors
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                Automatic color shuffling every 5 seconds
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                Y-axis movement, scale, blur, and opacity animations
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                Customizable animation duration and shuffle interval
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}