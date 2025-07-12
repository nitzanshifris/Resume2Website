"use client";

import React from "react";
import { TypewriterEffect, TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const smoothWords = [
  {
    text: "Build",
  },
  {
    text: "awesome",
  },
  {
    text: "apps",
  },
  {
    text: "with",
  },
  {
    text: "Aceternity.",
    className: "text-blue-500 dark:text-blue-500",
  },
];

const jankyWords = [
  {
    text: "Build",
  },
  {
    text: "awesome",
  },
  {
    text: "apps",
  },
  {
    text: "with",
  },
  {
    text: "Aceternity.",
    className: "text-blue-500 dark:text-blue-500",
  },
];

const heroWords = [
  {
    text: "Welcome",
    className: "text-purple-500",
  },
  {
    text: "to",
  },
  {
    text: "the",
  },
  {
    text: "future",
    className: "text-blue-500 font-bold",
  },
];

export default function TypewriterEffectPage() {
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
            Typewriter Effect
          </h1>
          <p className="text-xl text-gray-400">
            Text generates as if it is being typed on the screen
          </p>
        </div>

        {/* Features */}
        <div className="mb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700">
            <h3 className="text-white font-semibold mb-2">Two Variants</h3>
            <p className="text-sm text-gray-400">Smooth and janky typing effects</p>
          </div>
          <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700">
            <h3 className="text-white font-semibold mb-2">Blinking Cursor</h3>
            <p className="text-sm text-gray-400">Customizable cursor animation</p>
          </div>
          <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700">
            <h3 className="text-white font-semibold mb-2">Word Styling</h3>
            <p className="text-sm text-gray-400">Individual word customization</p>
          </div>
          <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700">
            <h3 className="text-white font-semibold mb-2">Responsive</h3>
            <p className="text-sm text-gray-400">Works on all screen sizes</p>
          </div>
        </div>

        {/* Examples */}
        <div className="space-y-16">
          <div>
            <h2 className="text-2xl font-semibold text-gray-200 mb-8">Smooth Typewriter Effect</h2>
            <div className="bg-white dark:bg-neutral-950 rounded-lg overflow-hidden">
              <div className="flex flex-col items-center justify-center h-[40rem]">
                <p className="text-neutral-600 dark:text-neutral-200 text-xs sm:text-base">
                  The road to freedom starts from here
                </p>
                <TypewriterEffectSmooth words={smoothWords} />
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
                  <button className="w-40 h-10 rounded-xl bg-black border dark:border-white border-transparent text-white text-sm">
                    Join now
                  </button>
                  <button className="w-40 h-10 rounded-xl bg-white text-black border border-black text-sm">
                    Signup
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-200 mb-8">Janky Typewriter Effect</h2>
            <div className="bg-white dark:bg-neutral-950 rounded-lg overflow-hidden">
              <div className="flex flex-col items-center justify-center h-[40rem]">
                <p className="text-neutral-600 dark:text-neutral-200 text-base mb-10">
                  The road to freedom starts from here
                </p>
                <TypewriterEffect words={jankyWords} />
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4 mt-10">
                  <button className="w-40 h-10 rounded-xl bg-black border dark:border-white border-transparent text-white text-sm">
                    Join now
                  </button>
                  <button className="w-40 h-10 rounded-xl bg-white text-black border border-black text-sm">
                    Signup
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-200 mb-8">Custom Styling</h2>
            <div className="bg-white dark:bg-neutral-950 rounded-lg overflow-hidden">
              <div className="flex flex-col items-center justify-center h-[30rem]">
                <TypewriterEffectSmooth 
                  words={heroWords}
                  className="text-3xl"
                  cursorClassName="bg-purple-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Code Example */}
        <div className="mt-16 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-200">Example Usage</h2>
          <div className="bg-zinc-900/50 rounded-lg p-6 border border-zinc-700">
            <pre className="text-sm text-gray-300 overflow-x-auto">
              <code>{`import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";

const words = [
  {
    text: "Build",
  },
  {
    text: "awesome",
  },
  {
    text: "apps",
  },
  {
    text: "with",
  },
  {
    text: "Aceternity.",
    className: "text-blue-500 dark:text-blue-500",
  },
];

export function TypewriterDemo() {
  return (
    <div className="flex flex-col items-center justify-center h-[40rem]">
      <p className="text-neutral-600 dark:text-neutral-200 text-xs sm:text-base">
        The road to freedom starts from here
      </p>
      <TypewriterEffectSmooth words={words} />
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
        <button className="w-40 h-10 rounded-xl bg-black border dark:border-white border-transparent text-white text-sm">
          Join now
        </button>
        <button className="w-40 h-10 rounded-xl bg-white text-black border border-black text-sm">
          Signup
        </button>
      </div>
    </div>
  );
}`}</code>
            </pre>
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
        </div>
      </div>
    </div>
  );
}