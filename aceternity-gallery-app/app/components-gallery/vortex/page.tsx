"use client";

import React from "react";
import { Vortex } from "@/components/ui/vortex";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function VortexPage() {
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
            Vortex Background
          </h1>
          <p className="text-xl text-gray-400">
            A wavy, swirly, vortex background ideal for CTAs and backgrounds
          </p>
        </div>

        {/* Features */}
        <div className="mb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700">
            <h3 className="text-white font-semibold mb-2">Animated Particles</h3>
            <p className="text-sm text-gray-400">Smooth particle animation with noise</p>
          </div>
          <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700">
            <h3 className="text-white font-semibold mb-2">Customizable</h3>
            <p className="text-sm text-gray-400">Control colors, speed, and particle count</p>
          </div>
          <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700">
            <h3 className="text-white font-semibold mb-2">Glow Effects</h3>
            <p className="text-sm text-gray-400">Beautiful glowing particle trails</p>
          </div>
          <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700">
            <h3 className="text-white font-semibold mb-2">Performance</h3>
            <p className="text-sm text-gray-400">Optimized for smooth 60fps animation</p>
          </div>
        </div>

        {/* Examples */}
        <div className="space-y-16">
          <div>
            <h2 className="text-2xl font-semibold text-gray-200 mb-8">Default Vortex</h2>
            <div className="bg-black rounded-lg overflow-hidden border border-zinc-700">
              <div className="w-[calc(100%-4rem)] mx-auto rounded-md h-[30rem] overflow-hidden">
                <Vortex
                  backgroundColor="black"
                  className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
                >
                  <h2 className="text-white text-2xl md:text-6xl font-bold text-center">
                    The hell is this?
                  </h2>
                  <p className="text-white text-sm md:text-2xl max-w-xl mt-6 text-center">
                    This is chemical burn. It&apos;ll hurt more than you&apos;ve ever been
                    burned and you&apos;ll have a scar.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition duration-200 rounded-lg text-white shadow-[0px_2px_0px_0px_#FFFFFF40_inset]">
                      Order now
                    </button>
                    <button className="px-4 py-2 text-white">Watch trailer</button>
                  </div>
                </Vortex>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-200 mb-8">Green Vortex with Custom Settings</h2>
            <div className="bg-black rounded-lg overflow-hidden border border-zinc-700">
              <div className="w-[calc(100%-4rem)] mx-auto rounded-md h-[30rem] overflow-hidden">
                <Vortex
                  backgroundColor="black"
                  rangeY={200}
                  particleCount={500}
                  baseHue={120}
                  className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
                >
                  <h2 className="text-white text-2xl md:text-4xl font-bold text-center">
                    Custom Green Vortex
                  </h2>
                  <p className="text-white text-sm md:text-lg max-w-xl mt-6 text-center">
                    This variant uses custom particle count and green hue for a different feel.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
                    <button className="px-4 py-2 bg-green-600 hover:bg-green-700 transition duration-200 rounded-lg text-white shadow-[0px_2px_0px_0px_#FFFFFF40_inset]">
                      Get Started
                    </button>
                    <button className="px-4 py-2 text-white border border-green-600 rounded-lg hover:bg-green-600/10 transition">
                      Learn More
                    </button>
                  </div>
                </Vortex>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-200 mb-8">Purple Vortex with High Particle Count</h2>
            <div className="bg-black rounded-lg overflow-hidden border border-zinc-700">
              <div className="w-[calc(100%-4rem)] mx-auto rounded-md h-[30rem] overflow-hidden">
                <Vortex
                  backgroundColor="black"
                  rangeY={150}
                  particleCount={800}
                  baseHue={280}
                  baseSpeed={0.5}
                  rangeSpeed={2.0}
                  className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
                >
                  <h2 className="text-white text-2xl md:text-4xl font-bold text-center">
                    High Energy Vortex
                  </h2>
                  <p className="text-white text-sm md:text-lg max-w-xl mt-6 text-center">
                    More particles with increased speed for a high-energy effect.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
                    <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 transition duration-200 rounded-lg text-white shadow-[0px_2px_0px_0px_#FFFFFF40_inset]">
                      Experience Now
                    </button>
                  </div>
                </Vortex>
              </div>
            </div>
          </div>
        </div>

        {/* Code Example */}
        <div className="mt-16 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-200">Example Usage</h2>
          <div className="bg-zinc-900/50 rounded-lg p-6 border border-zinc-700">
            <pre className="text-sm text-gray-300 overflow-x-auto">
              <code>{`import { Vortex } from "@/components/ui/vortex";

export function VortexDemo() {
  return (
    <div className="w-[calc(100%-4rem)] mx-auto rounded-md h-[30rem] overflow-hidden">
      <Vortex
        backgroundColor="black"
        className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
      >
        <h2 className="text-white text-2xl md:text-6xl font-bold text-center">
          Your Content Here
        </h2>
        <p className="text-white text-sm md:text-2xl max-w-xl mt-6 text-center">
          Your description text goes here.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition duration-200 rounded-lg text-white">
            Call to Action
          </button>
        </div>
      </Vortex>
    </div>
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
                    <th className="text-left p-4 text-gray-300 font-semibold">Prop Name</th>
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
                    <td className="p-4">Optional children to be rendered inside the component</td>
                  </tr>
                  <tr className="border-b border-zinc-700/50">
                    <td className="p-4 font-mono text-blue-400">className</td>
                    <td className="p-4">string</td>
                    <td className="p-4">-</td>
                    <td className="p-4">Optional className for styling the children wrapper</td>
                  </tr>
                  <tr className="border-b border-zinc-700/50">
                    <td className="p-4 font-mono text-blue-400">containerClassName</td>
                    <td className="p-4">string</td>
                    <td className="p-4">-</td>
                    <td className="p-4">Optional className for styling the container</td>
                  </tr>
                  <tr className="border-b border-zinc-700/50">
                    <td className="p-4 font-mono text-blue-400">particleCount</td>
                    <td className="p-4">number</td>
                    <td className="p-4">700</td>
                    <td className="p-4">Number of particles to be generated</td>
                  </tr>
                  <tr className="border-b border-zinc-700/50">
                    <td className="p-4 font-mono text-blue-400">rangeY</td>
                    <td className="p-4">number</td>
                    <td className="p-4">100</td>
                    <td className="p-4">Vertical range for particle movement</td>
                  </tr>
                  <tr className="border-b border-zinc-700/50">
                    <td className="p-4 font-mono text-blue-400">baseHue</td>
                    <td className="p-4">number</td>
                    <td className="p-4">220</td>
                    <td className="p-4">Base hue for particle color</td>
                  </tr>
                  <tr className="border-b border-zinc-700/50">
                    <td className="p-4 font-mono text-blue-400">baseSpeed</td>
                    <td className="p-4">number</td>
                    <td className="p-4">0.0</td>
                    <td className="p-4">Base speed for particle movement</td>
                  </tr>
                  <tr className="border-b border-zinc-700/50">
                    <td className="p-4 font-mono text-blue-400">rangeSpeed</td>
                    <td className="p-4">number</td>
                    <td className="p-4">1.5</td>
                    <td className="p-4">Range of speed variation for particles</td>
                  </tr>
                  <tr className="border-b border-zinc-700/50">
                    <td className="p-4 font-mono text-blue-400">baseRadius</td>
                    <td className="p-4">number</td>
                    <td className="p-4">1</td>
                    <td className="p-4">Base radius of particles</td>
                  </tr>
                  <tr className="border-b border-zinc-700/50">
                    <td className="p-4 font-mono text-blue-400">rangeRadius</td>
                    <td className="p-4">number</td>
                    <td className="p-4">2</td>
                    <td className="p-4">Range of radius variation for particles</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-mono text-blue-400">backgroundColor</td>
                    <td className="p-4">string</td>
                    <td className="p-4">"#000000"</td>
                    <td className="p-4">Background color of the canvas</td>
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