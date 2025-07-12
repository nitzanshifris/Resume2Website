"use client";

import React from "react";
import {
  SparklesPreview,
  SparklesFullPage,
  SparklesColorful,
  SparklesMinimal,
  SparklesDense
} from "@/components/ui/sparkles/sparkles-demo";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SparklesGalleryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900 pb-20">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <Link href="/components-gallery">
          <Button
            variant="ghost"
            className="mb-8 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Gallery
          </Button>
        </Link>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Sparkles
          </h1>
          <p className="text-lg text-zinc-400 max-w-3xl">
            A configurable sparkles component that can be used as a background or as a standalone component.
          </p>
        </div>

        {/* Examples */}
        <div className="space-y-16">
          {/* Default Demo */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-6">
              Default Sparkles
            </h2>
            <div className="rounded-lg overflow-hidden">
              <SparklesPreview />
            </div>
          </section>

          {/* Full Page Demo */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-6">
              Full Page Sparkles
            </h2>
            <div className="rounded-lg overflow-hidden">
              <SparklesFullPage />
            </div>
          </section>

          {/* Colorful Demo */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-6">
              Colorful Sparkles
            </h2>
            <div className="rounded-lg overflow-hidden">
              <SparklesColorful />
            </div>
          </section>

          {/* Minimal Demo */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-6">
              Minimal Sparkles
            </h2>
            <div className="rounded-lg overflow-hidden">
              <SparklesMinimal />
            </div>
          </section>

          {/* Dense Demo */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-6">
              Dense Sparkles
            </h2>
            <div className="rounded-lg overflow-hidden">
              <SparklesDense />
            </div>
          </section>

          {/* Code Example */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-6">
              Usage Example
            </h2>
            <div className="bg-zinc-800 rounded-lg p-6">
              <pre className="text-zinc-300 overflow-x-auto">
                <code>{`import { SparklesCore } from "@/components/ui/sparkles";

export function MySparklesBackground() {
  return (
    <div className="relative h-screen bg-black">
      <div className="absolute inset-0">
        <SparklesCore
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#FFFFFF"
          speed={2}
        />
      </div>
      <div className="relative z-10 flex items-center justify-center h-full">
        <h1 className="text-6xl font-bold text-white">
          Your Content Here
        </h1>
      </div>
    </div>
  );
}`}</code>
              </pre>
            </div>
          </section>

          {/* Props Documentation */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-6">
              Props Documentation
            </h2>
            <div className="bg-zinc-800 rounded-lg p-6 space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-zinc-300">
                  <thead>
                    <tr className="border-b border-zinc-700">
                      <th className="text-left py-2 pr-4">Prop</th>
                      <th className="text-left py-2 pr-4">Type</th>
                      <th className="text-left py-2">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-zinc-700/50">
                      <td className="py-2 pr-4 text-blue-400">id</td>
                      <td className="py-2 pr-4">string</td>
                      <td className="py-2">The id of the sparkles component</td>
                    </tr>
                    <tr className="border-b border-zinc-700/50">
                      <td className="py-2 pr-4 text-blue-400">className</td>
                      <td className="py-2 pr-4">string</td>
                      <td className="py-2">Additional CSS classes</td>
                    </tr>
                    <tr className="border-b border-zinc-700/50">
                      <td className="py-2 pr-4 text-blue-400">background</td>
                      <td className="py-2 pr-4">string</td>
                      <td className="py-2">Background color (default: "#0d47a1")</td>
                    </tr>
                    <tr className="border-b border-zinc-700/50">
                      <td className="py-2 pr-4 text-blue-400">minSize</td>
                      <td className="py-2 pr-4">number</td>
                      <td className="py-2">Minimum particle size (default: 1)</td>
                    </tr>
                    <tr className="border-b border-zinc-700/50">
                      <td className="py-2 pr-4 text-blue-400">maxSize</td>
                      <td className="py-2 pr-4">number</td>
                      <td className="py-2">Maximum particle size (default: 3)</td>
                    </tr>
                    <tr className="border-b border-zinc-700/50">
                      <td className="py-2 pr-4 text-blue-400">speed</td>
                      <td className="py-2 pr-4">number</td>
                      <td className="py-2">Animation speed (default: 4)</td>
                    </tr>
                    <tr className="border-b border-zinc-700/50">
                      <td className="py-2 pr-4 text-blue-400">particleColor</td>
                      <td className="py-2 pr-4">string</td>
                      <td className="py-2">Particle color (default: "#ffffff")</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 text-blue-400">particleDensity</td>
                      <td className="py-2 pr-4">number</td>
                      <td className="py-2">Number of particles (default: 120)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}