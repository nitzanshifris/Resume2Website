"use client";

import React from "react";
import { WavyBackground } from "@/components/ui/wavy-background";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function WavyBackgroundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-12">
          <Link 
            href="/components-gallery" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Gallery
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Wavy Background
          </h1>
          <p className="text-xl text-gray-400">
            A cool background effect with waves that move
          </p>
        </div>

        {/* Features */}
        <div className="mb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700">
            <h3 className="text-white font-semibold mb-2">Smooth Waves</h3>
            <p className="text-sm text-gray-400">Canvas-based wave animation using noise</p>
          </div>
          <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700">
            <h3 className="text-white font-semibold mb-2">Customizable</h3>
            <p className="text-sm text-gray-400">Control colors, speed, blur, and opacity</p>
          </div>
          <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700">
            <h3 className="text-white font-semibold mb-2">Responsive</h3>
            <p className="text-sm text-gray-400">Adapts to screen size automatically</p>
          </div>
          <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700">
            <h3 className="text-white font-semibold mb-2">Performance</h3>
            <p className="text-sm text-gray-400">Optimized for smooth animation</p>
          </div>
        </div>

        {/* Examples */}
        <div className="space-y-16">
          <div>
            <h2 className="text-2xl font-semibold text-gray-200 mb-8">Default Wavy Background</h2>
            <div className="bg-black rounded-lg overflow-hidden border border-zinc-700">
              <div className="h-96 relative overflow-hidden">
                <WavyBackground 
                  containerClassName="h-96 w-full relative overflow-hidden rounded-lg"
                  className="max-w-4xl mx-auto pb-40"
                >
                  <p className="text-2xl md:text-4xl lg:text-6xl text-white font-bold inter-var text-center">
                    Hero waves are cool
                  </p>
                  <p className="text-base md:text-lg mt-4 text-white font-normal inter-var text-center">
                    Leverage the power of canvas to create a beautiful hero section
                  </p>
                </WavyBackground>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-200 mb-8">Custom Colors - Purple Theme</h2>
            <div className="bg-black rounded-lg overflow-hidden border border-zinc-700">
              <div className="h-96 relative overflow-hidden">
                <WavyBackground 
                  containerClassName="h-96 w-full relative overflow-hidden rounded-lg"
                  className="max-w-4xl mx-auto pb-40"
                  colors={["#8b5cf6", "#a855f7", "#c084fc", "#d946ef", "#e879f9"]}
                  waveWidth={60}
                  backgroundFill="#0f0b1a"
                >
                  <p className="text-2xl md:text-4xl lg:text-6xl text-white font-bold inter-var text-center">
                    Purple Waves
                  </p>
                  <p className="text-base md:text-lg mt-4 text-white font-normal inter-var text-center">
                    Custom purple color scheme for a mystical feel
                  </p>
                </WavyBackground>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-200 mb-8">Slow Animation - Green Theme</h2>
            <div className="bg-black rounded-lg overflow-hidden border border-zinc-700">
              <div className="h-96 relative overflow-hidden">
                <WavyBackground 
                  containerClassName="h-96 w-full relative overflow-hidden rounded-lg"
                  className="max-w-4xl mx-auto pb-40"
                  colors={["#10b981", "#34d399", "#6ee7b7", "#a7f3d0", "#d1fae5"]}
                  speed="slow"
                  waveWidth={40}
                  blur={15}
                  waveOpacity={0.8}
                >
                  <p className="text-2xl md:text-4xl lg:text-6xl text-white font-bold inter-var text-center">
                    Slow Green Waves
                  </p>
                  <p className="text-base md:text-lg mt-4 text-white font-normal inter-var text-center">
                    Slower animation with green colors and higher opacity
                  </p>
                </WavyBackground>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-200 mb-8">High Contrast - Orange Theme</h2>
            <div className="bg-black rounded-lg overflow-hidden border border-zinc-700">
              <div className="h-96 relative overflow-hidden">
                <WavyBackground 
                  containerClassName="h-96 w-full relative overflow-hidden rounded-lg"
                  className="max-w-4xl mx-auto pb-40"
                  colors={["#f97316", "#fb923c", "#fdba74", "#fed7aa", "#ffedd5"]}
                  speed="fast"
                  waveWidth={80}
                  blur={5}
                  waveOpacity={0.9}
                  backgroundFill="#1a0b00"
                >
                  <p className="text-2xl md:text-4xl lg:text-6xl text-white font-bold inter-var text-center">
                    Energy Waves
                  </p>
                  <p className="text-base md:text-lg mt-4 text-white font-normal inter-var text-center">
                    High contrast orange waves with minimal blur
                  </p>
                </WavyBackground>
              </div>
            </div>
          </div>
        </div>

        {/* Code Example */}
        <div className="mt-16 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-200">Example Usage</h2>
          <div className="bg-zinc-900/50 rounded-lg p-6 border border-zinc-700">
            <pre className="text-sm text-gray-300 overflow-x-auto">
              <code>{`import { WavyBackground } from "@/components/ui/wavy-background";

export function WavyBackgroundDemo() {
  return (
    <WavyBackground className="max-w-4xl mx-auto pb-40">
      <p className="text-2xl md:text-4xl lg:text-7xl text-white font-bold inter-var text-center">
        Hero waves are cool
      </p>
      <p className="text-base md:text-lg mt-4 text-white font-normal inter-var text-center">
        Leverage the power of canvas to create a beautiful hero section
      </p>
    </WavyBackground>
  );
}`}</code>
            </pre>
          </div>
        </div>

        {/* Props Table */}
        <div className="mt-16 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-200">Props</h2>
          <div className="bg-zinc-900/50 rounded-lg overflow-hidden border border-zinc-700">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-zinc-800/50 border-b border-zinc-700">
                  <tr>
                    <th className="text-left p-4 text-gray-300 font-semibold">Prop</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">Type</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">Default</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <tr className="border-b border-zinc-700/50">
                    <td className="p-4 font-mono text-blue-400">children</td>
                    <td className="p-4">any</td>
                    <td className="p-4">-</td>
                    <td className="p-4">The content to be displayed on top of the wavy background</td>
                  </tr>
                  <tr className="border-b border-zinc-700/50">
                    <td className="p-4 font-mono text-blue-400">className</td>
                    <td className="p-4">string</td>
                    <td className="p-4">-</td>
                    <td className="p-4">The CSS class to apply to the content container</td>
                  </tr>
                  <tr className="border-b border-zinc-700/50">
                    <td className="p-4 font-mono text-blue-400">containerClassName</td>
                    <td className="p-4">string</td>
                    <td className="p-4">-</td>
                    <td className="p-4">The CSS class to apply to the main container</td>
                  </tr>
                  <tr className="border-b border-zinc-700/50">
                    <td className="p-4 font-mono text-blue-400">colors</td>
                    <td className="p-4">string[]</td>
                    <td className="p-4">["#38bdf8", "#818cf8", "#c084fc", "#e879f9", "#22d3ee"]</td>
                    <td className="p-4">The colors of the waves</td>
                  </tr>
                  <tr className="border-b border-zinc-700/50">
                    <td className="p-4 font-mono text-blue-400">waveWidth</td>
                    <td className="p-4">number</td>
                    <td className="p-4">50</td>
                    <td className="p-4">The width of the waves</td>
                  </tr>
                  <tr className="border-b border-zinc-700/50">
                    <td className="p-4 font-mono text-blue-400">backgroundFill</td>
                    <td className="p-4">string</td>
                    <td className="p-4">"black"</td>
                    <td className="p-4">The background color</td>
                  </tr>
                  <tr className="border-b border-zinc-700/50">
                    <td className="p-4 font-mono text-blue-400">blur</td>
                    <td className="p-4">number</td>
                    <td className="p-4">10</td>
                    <td className="p-4">The blur effect applied to the waves</td>
                  </tr>
                  <tr className="border-b border-zinc-700/50">
                    <td className="p-4 font-mono text-blue-400">speed</td>
                    <td className="p-4">"slow" | "fast"</td>
                    <td className="p-4">"fast"</td>
                    <td className="p-4">The speed of the wave animation</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-mono text-blue-400">waveOpacity</td>
                    <td className="p-4">number</td>
                    <td className="p-4">0.5</td>
                    <td className="p-4">The opacity of the waves</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Installation */}
        <div className="mt-8 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-200">Installation</h2>
          <div className="bg-zinc-900/50 rounded-lg p-6 border border-zinc-700">
            <pre className="text-sm text-gray-300">
              <code>npm install motion clsx tailwind-merge simplex-noise</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}