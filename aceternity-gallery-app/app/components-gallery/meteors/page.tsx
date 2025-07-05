"use client";

import { Meteors } from "@/components/ui/meteors";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const examples = [
  {
    name: "Basic Meteors",
    component: () => (
      <div className="relative w-full max-w-xl mx-auto">
        <div className="absolute inset-0 h-full w-full scale-[0.80] transform rounded-full bg-red-500 bg-gradient-to-r from-blue-500 to-teal-500 blur-3xl" />
        <div className="relative flex h-full flex-col items-start justify-end overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 px-4 py-8 shadow-xl">
          <div className="mb-4 flex h-5 w-5 items-center justify-center rounded-full border border-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-2 w-2 text-gray-300"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25"
              />
            </svg>
          </div>

          <h1 className="relative z-50 mb-4 text-xl font-bold text-white">
            Meteors because they&apos;re cool
          </h1>

          <p className="relative z-50 mb-4 text-base font-normal text-slate-500">
            I don&apos;t know what to write so I&apos;ll just paste something
            cool here. One more sentence because lorem ipsum is just
            unacceptable. Won&apos;t ChatGPT the shit out of this.
          </p>

          <button className="rounded-lg border border-gray-500 px-4 py-1 text-gray-300">
            Explore
          </button>

          <Meteors number={20} />
        </div>
      </div>
    ),
  },
  {
    name: "Feature Cards",
    component: () => (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {[
          { title: "Fast Performance", desc: "Lightning fast load times" },
          { title: "Secure by Default", desc: "Enterprise-grade security" },
        ].map((feature, idx) => (
          <div key={idx} className="relative">
            <div className="relative h-full flex flex-col items-start justify-center overflow-hidden rounded-lg border border-gray-800 bg-gray-900 p-6 shadow-xl">
              <h3 className="relative z-50 mb-2 text-lg font-bold text-white">
                {feature.title}
              </h3>
              <p className="relative z-50 text-sm text-slate-500">
                {feature.desc}
              </p>
              <Meteors number={10} />
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    name: "Hero Section",
    component: () => (
      <div className="relative w-full h-96 overflow-hidden rounded-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-4">
          <h1 className="mb-4 text-4xl font-bold text-white">
            Welcome to the Future
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl">
            Experience the power of modern web development with stunning animations
          </p>
        </div>
        <Meteors number={30} />
      </div>
    ),
  },
  {
    name: "Portfolio Showcase",
    component: () => (
      <div className="relative max-w-2xl mx-auto">
        <div className="relative overflow-hidden rounded-xl border border-gray-800 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-white mb-4">
              Project Spotlight
            </h2>
            <p className="text-gray-400 mb-6">
              A cutting-edge web application built with modern technologies
            </p>
            <div className="flex gap-2 mb-6">
              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                React
              </span>
              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                TypeScript
              </span>
              <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                Tailwind
              </span>
            </div>
            <button className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors">
              View Project
            </button>
          </div>
          <Meteors number={15} />
        </div>
      </div>
    ),
  },
];

export default function MeteorsPage() {
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
            Meteors
          </h1>
          <p className="text-xl text-gray-400">
            Animated meteor effects that create dynamic falling star animations across your content
          </p>
        </div>

        {/* Examples */}
        <div className="space-y-24">
          {examples.map((example, index) => (
            <div key={index} className="space-y-6">
              <h2 className="text-2xl font-semibold text-white">
                {example.name}
              </h2>
              <div className="flex items-center justify-center min-h-[400px]">
                <example.component />
              </div>
            </div>
          ))}
        </div>

        {/* Code Examples */}
        <div className="mt-24 space-y-8">
          <h2 className="text-3xl font-bold text-white mb-8">Usage Examples</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Basic Usage</h3>
              <pre className="bg-zinc-900 rounded-lg p-4 overflow-x-auto">
                <code className="text-sm text-gray-300">{`import { Meteors } from "@/components/ui/meteors";

export default function Example() {
  return (
    <div className="relative">
      <div className="relative overflow-hidden rounded-lg border p-8">
        {/* Your content here */}
        <h1>Content with meteor effect</h1>
        
        {/* Add meteor effect */}
        <Meteors number={20} />
      </div>
    </div>
  );
}`}</code>
              </pre>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-4">With Custom Number</h3>
              <pre className="bg-zinc-900 rounded-lg p-4 overflow-x-auto">
                <code className="text-sm text-gray-300">{`<Meteors number={30} className="opacity-50" />`}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Props */}
        <div className="mt-16 bg-zinc-900 rounded-lg p-6">
          <h3 className="text-2xl font-bold text-white mb-4">Props</h3>
          <div className="space-y-4">
            <div>
              <code className="text-blue-400">number</code>
              <span className="text-gray-400 ml-2">- The number of meteors you want in the card (default: 20)</span>
            </div>
            <div>
              <code className="text-blue-400">className</code>
              <span className="text-gray-400 ml-2">- Additional CSS classes for styling</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}