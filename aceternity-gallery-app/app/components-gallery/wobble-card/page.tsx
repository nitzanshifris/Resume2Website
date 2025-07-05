"use client";

import React from "react";
import { WobbleCard } from "@/components/ui/wobble-card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function WobbleCardPage() {
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
            Wobble Card
          </h1>
          <p className="text-xl text-gray-400">
            A card effect that translates and scales on mousemove, perfect for feature cards
          </p>
        </div>

        {/* Features */}
        <div className="mb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700">
            <h3 className="text-white font-semibold mb-2">Mouse Tracking</h3>
            <p className="text-sm text-gray-400">Follows mouse movement with subtle parallax</p>
          </div>
          <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700">
            <h3 className="text-white font-semibold mb-2">Smooth Animation</h3>
            <p className="text-sm text-gray-400">Fluid transitions with easing</p>
          </div>
          <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700">
            <h3 className="text-white font-semibold mb-2">Noise Texture</h3>
            <p className="text-sm text-gray-400">Subtle texture overlay for depth</p>
          </div>
          <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700">
            <h3 className="text-white font-semibold mb-2">Customizable</h3>
            <p className="text-sm text-gray-400">Flexible styling with className props</p>
          </div>
        </div>

        {/* Examples */}
        <div className="space-y-16">
          <div>
            <h2 className="text-2xl font-semibold text-gray-200 mb-8">Grid Layout Example</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full">
              <WobbleCard
                containerClassName="col-span-1 lg:col-span-2 h-full bg-pink-800 min-h-[500px] lg:min-h-[300px]"
                className=""
              >
                <div className="max-w-xs">
                  <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                    Gippity AI powers the entire universe
                  </h2>
                  <p className="mt-4 text-left text-base/6 text-neutral-200">
                    With over 100,000 monthly active bot users, Gippity AI is the most
                    popular AI platform for developers.
                  </p>
                </div>
                <div className="absolute -right-4 lg:-right-[40%] -bottom-10 w-[200px] h-[200px] bg-gradient-to-br from-pink-600 to-pink-400 rounded-2xl opacity-20"></div>
              </WobbleCard>
              <WobbleCard containerClassName="col-span-1 min-h-[300px]">
                <h2 className="max-w-80 text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                  No shirt, no shoes, no weapons.
                </h2>
                <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
                  If someone yells "stop!", goes limp, or taps out, the fight is over.
                </p>
              </WobbleCard>
              <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-blue-900 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]">
                <div className="max-w-sm">
                  <h2 className="max-w-sm md:max-w-lg text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
                    Signup for blazing-fast cutting-edge state of the art Gippity AI
                    wrapper today!
                  </h2>
                  <p className="mt-4 max-w-[26rem] text-left text-base/6 text-neutral-200">
                    With over 100,000 monthly active bot users, Gippity AI is the most
                    popular AI platform for developers.
                  </p>
                </div>
                <div className="absolute -right-10 md:-right-[40%] lg:-right-[20%] -bottom-10 w-[250px] h-[250px] bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl opacity-20"></div>
              </WobbleCard>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-200 mb-8">Different Colors & Sizes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              <WobbleCard containerClassName="bg-gradient-to-br from-purple-800 to-purple-900 min-h-[200px]">
                <h3 className="text-xl font-semibold text-white">Purple Gradient</h3>
                <p className="mt-2 text-neutral-200">
                  A beautiful purple gradient background with wobble effect.
                </p>
              </WobbleCard>
              <WobbleCard containerClassName="bg-gradient-to-br from-green-800 to-green-900 min-h-[200px]">
                <h3 className="text-xl font-semibold text-white">Green Gradient</h3>
                <p className="mt-2 text-neutral-200">
                  An eco-friendly green gradient with smooth animations.
                </p>
              </WobbleCard>
              <WobbleCard containerClassName="bg-gradient-to-br from-orange-800 to-red-900 min-h-[200px]">
                <h3 className="text-xl font-semibold text-white">Sunset Gradient</h3>
                <p className="mt-2 text-neutral-200">
                  Warm sunset colors that wobble with your mouse.
                </p>
              </WobbleCard>
              <WobbleCard containerClassName="bg-gradient-to-br from-cyan-800 to-blue-900 min-h-[200px]">
                <h3 className="text-xl font-semibold text-white">Ocean Gradient</h3>
                <p className="mt-2 text-neutral-200">
                  Cool ocean vibes with interactive movement.
                </p>
              </WobbleCard>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-200 mb-8">Feature Cards</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
              <WobbleCard containerClassName="bg-gradient-to-br from-zinc-800 to-zinc-900 min-h-[250px]">
                <div className="mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                    1
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Fast Performance</h3>
                <p className="text-neutral-300 text-sm">
                  Optimized for speed with minimal overhead and smooth 60fps animations.
                </p>
              </WobbleCard>
              <WobbleCard containerClassName="bg-gradient-to-br from-zinc-800 to-zinc-900 min-h-[250px]">
                <div className="mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                    2
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Easy Integration</h3>
                <p className="text-neutral-300 text-sm">
                  Simple API with just three props makes it easy to add to any project.
                </p>
              </WobbleCard>
              <WobbleCard containerClassName="bg-gradient-to-br from-zinc-800 to-zinc-900 min-h-[250px]">
                <div className="mb-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                    3
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Fully Responsive</h3>
                <p className="text-neutral-300 text-sm">
                  Works perfectly on all screen sizes from mobile to desktop displays.
                </p>
              </WobbleCard>
            </div>
          </div>
        </div>

        {/* Code Example */}
        <div className="mt-16 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-200">Example Usage</h2>
          <div className="bg-zinc-900/50 rounded-lg p-6 border border-zinc-700">
            <pre className="text-sm text-gray-300 overflow-x-auto">
              <code>{`import { WobbleCard } from "@/components/ui/wobble-card";

export function WobbleCardDemo() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <WobbleCard
        containerClassName="col-span-1 lg:col-span-2 bg-pink-800 min-h-[300px]"
        className=""
      >
        <h2 className="text-xl lg:text-3xl font-semibold text-white">
          Your Title Here
        </h2>
        <p className="mt-4 text-neutral-200">
          Your description text goes here.
        </p>
      </WobbleCard>
      
      <WobbleCard containerClassName="col-span-1 min-h-[300px]">
        <h2 className="text-xl lg:text-3xl font-semibold text-white">
          Another Card
        </h2>
        <p className="mt-4 text-neutral-200">
          More content here.
        </p>
      </WobbleCard>
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
                    <th className="text-left p-4 text-gray-300 font-semibold">Required</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <tr className="border-b border-zinc-700/50">
                    <td className="p-4 font-mono text-blue-400">children</td>
                    <td className="p-4">React.ReactNode</td>
                    <td className="p-4">Yes</td>
                    <td className="p-4">Content to be rendered inside the WobbleCard</td>
                  </tr>
                  <tr className="border-b border-zinc-700/50">
                    <td className="p-4 font-mono text-blue-400">containerClassName</td>
                    <td className="p-4">string</td>
                    <td className="p-4">No</td>
                    <td className="p-4">Optional className for styling the container</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-mono text-blue-400">className</td>
                    <td className="p-4">string</td>
                    <td className="p-4">No</td>
                    <td className="p-4">Optional className for styling the children wrapper</td>
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
              <code>npm install motion clsx tailwind-merge</code>
            </pre>
          </div>
          <div className="bg-zinc-900/50 rounded-lg p-6 border border-zinc-700">
            <p className="text-sm text-gray-300 mb-2">
              Download the noise texture and add it to your public folder:
            </p>
            <pre className="text-sm text-gray-300">
              <code>public/noise.webp</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}