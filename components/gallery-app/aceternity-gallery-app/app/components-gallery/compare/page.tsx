"use client";

import React from "react";
import { CompareDemo, CompareAutoplay, CompareDrag } from "@/component-library/components/ui/compare";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Code2, Copy, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";

export default function ComparePage() {
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

  const installCode = `npm i motion clsx tailwind-merge
npm i @tsparticles/react @tsparticles/engine @tsparticles/slim`;
  
  const usageCode = `import { Compare } from "@/component-library/components/ui/compare";

export function MyComponent() {
  return (
    <Compare
      firstImage="/before.png"
      secondImage="/after.png"
      slideMode="hover"
      className="h-[400px] w-[600px]"
    />
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
            Compare
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl">
            A comparison component between two images. Slide or drag to compare with beautiful sparkle effects.
          </p>
        </div>

        {/* Demo Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6">Standard Demo</h2>
          <div className="flex items-center justify-center">
            <CompareDemo />
          </div>
        </div>

        {/* Variants */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6">Variants</h2>
          <div className="space-y-12">
            <Card className="p-6 bg-zinc-900/50 border-zinc-800 overflow-hidden">
              <h3 className="text-lg font-semibold text-white mb-4">Autoplay Mode</h3>
              <p className="text-gray-400 mb-6">
                Automatic sliding animation with 3D perspective effect
              </p>
              <div className="flex items-center justify-center">
                <CompareAutoplay />
              </div>
            </Card>

            <Card className="p-6 bg-zinc-900/50 border-zinc-800 overflow-hidden">
              <h3 className="text-lg font-semibold text-white mb-4">Drag Mode</h3>
              <p className="text-gray-400 mb-6">
                Manual drag control for precise comparison
              </p>
              <div className="flex items-center justify-center">
                <CompareDrag />
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
          <Card className="p-6 bg-zinc-900/50 border-zinc-800 overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-zinc-700">
                  <th className="text-left py-3 px-4 text-gray-400">Prop</th>
                  <th className="text-left py-3 px-4 text-gray-400">Type</th>
                  <th className="text-left py-3 px-4 text-gray-400">Default</th>
                  <th className="text-left py-3 px-4 text-gray-400">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-zinc-800">
                  <td className="py-3 px-4 text-white font-mono text-sm">firstImage</td>
                  <td className="py-3 px-4 text-gray-300 font-mono text-sm">string</td>
                  <td className="py-3 px-4 text-gray-300 font-mono text-sm">""</td>
                  <td className="py-3 px-4 text-gray-300">URL of the first image</td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="py-3 px-4 text-white font-mono text-sm">secondImage</td>
                  <td className="py-3 px-4 text-gray-300 font-mono text-sm">string</td>
                  <td className="py-3 px-4 text-gray-300 font-mono text-sm">""</td>
                  <td className="py-3 px-4 text-gray-300">URL of the second image</td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="py-3 px-4 text-white font-mono text-sm">slideMode</td>
                  <td className="py-3 px-4 text-gray-300 font-mono text-sm">"hover" | "drag"</td>
                  <td className="py-3 px-4 text-gray-300 font-mono text-sm">"hover"</td>
                  <td className="py-3 px-4 text-gray-300">Mode of interaction for the slider</td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="py-3 px-4 text-white font-mono text-sm">autoplay</td>
                  <td className="py-3 px-4 text-gray-300 font-mono text-sm">boolean</td>
                  <td className="py-3 px-4 text-gray-300 font-mono text-sm">false</td>
                  <td className="py-3 px-4 text-gray-300">Enable automatic sliding</td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="py-3 px-4 text-white font-mono text-sm">autoplayDuration</td>
                  <td className="py-3 px-4 text-gray-300 font-mono text-sm">number</td>
                  <td className="py-3 px-4 text-gray-300 font-mono text-sm">5000</td>
                  <td className="py-3 px-4 text-gray-300">Duration of one autoplay cycle in milliseconds</td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="py-3 px-4 text-white font-mono text-sm">showHandlebar</td>
                  <td className="py-3 px-4 text-gray-300 font-mono text-sm">boolean</td>
                  <td className="py-3 px-4 text-gray-300 font-mono text-sm">true</td>
                  <td className="py-3 px-4 text-gray-300">Whether to show the slider handle</td>
                </tr>
                <tr className="border-b border-zinc-800">
                  <td className="py-3 px-4 text-white font-mono text-sm">initialSliderPercentage</td>
                  <td className="py-3 px-4 text-gray-300 font-mono text-sm">number</td>
                  <td className="py-3 px-4 text-gray-300 font-mono text-sm">50</td>
                  <td className="py-3 px-4 text-gray-300">Initial position of the slider (0-100)</td>
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
                Multiple interaction modes: hover or drag to control
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                Beautiful sparkle particle effects on the slider line
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                Autoplay support with customizable duration
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                Touch-enabled for mobile devices
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                Smooth animations and gradient effects
              </li>
              <li className="flex items-start">
                <span className="text-blue-400 mr-2">•</span>
                3D perspective transformation support
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}