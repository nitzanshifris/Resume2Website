"use client";

import React from "react";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { calsans } from "@/fonts/calsans";
import { twMerge } from "tailwind-merge";

const demoContent = [
  {
    title: "Getting Started with Next.js",
    description: (
      <>
        <p>
          Next.js is a powerful React framework that enables you to build
          production-ready applications with ease. It provides features like
          server-side rendering, static site generation, and API routes out of
          the box.
        </p>
        <p className="mt-4">
          With Next.js, you can create blazing-fast websites that are optimized
          for SEO and performance. The framework handles many complex tasks
          automatically, allowing you to focus on building great user experiences.
        </p>
      </>
    ),
    badge: "Tutorial",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=2070",
  },
  {
    title: "Understanding React Hooks",
    description: (
      <>
        <p>
          React Hooks revolutionized the way we write React components. They
          allow you to use state and other React features without writing a
          class component.
        </p>
        <p className="mt-4">
          From useState to useEffect, and custom hooks, mastering these patterns
          will make your React code more readable and maintainable.
        </p>
      </>
    ),
    badge: "React",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=2070",
  },
  {
    title: "Building Responsive Layouts",
    description: (
      <>
        <p>
          Creating responsive layouts is essential in modern web development.
          With CSS Grid and Flexbox, you can build layouts that adapt seamlessly
          to different screen sizes.
        </p>
      </>
    ),
    badge: "CSS",
  },
];

const simpleContent = [
  {
    title: "Step 1: Installation",
    description: "Install the required dependencies using npm or yarn.",
    badge: "Setup",
  },
  {
    title: "Step 2: Configuration",
    description: "Configure your project settings and environment variables.",
    badge: "Config",
  },
  {
    title: "Step 3: Development",
    description: "Start building your application with hot reload enabled.",
    badge: "Build",
  },
];

export default function TracingBeamPage() {
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
            Tracing Beam
          </h1>
          <p className="text-xl text-gray-400">
            A Beam that follows the path of an SVG as the user scrolls. Adjusts beam length with scroll speed.
          </p>
        </div>

        {/* Features */}
        <div className="mb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700">
            <h3 className="text-white font-semibold mb-2">Scroll Tracking</h3>
            <p className="text-sm text-gray-400">Beam follows scroll progress</p>
          </div>
          <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700">
            <h3 className="text-white font-semibold mb-2">Speed Responsive</h3>
            <p className="text-sm text-gray-400">Adjusts based on scroll velocity</p>
          </div>
          <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700">
            <h3 className="text-white font-semibold mb-2">Gradient Animation</h3>
            <p className="text-sm text-gray-400">Beautiful multi-color gradient</p>
          </div>
          <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700">
            <h3 className="text-white font-semibold mb-2">Content Wrapper</h3>
            <p className="text-sm text-gray-400">Easy to wrap any content</p>
          </div>
        </div>

        {/* Examples */}
        <div className="space-y-16">
          <div>
            <h2 className="text-2xl font-semibold text-gray-200 mb-8">Blog Article Layout</h2>
            <div className="bg-white dark:bg-neutral-950 rounded-lg overflow-hidden">
              <div className="h-[600px] overflow-y-auto">
                <TracingBeam className="px-6">
                  <div className="max-w-2xl mx-auto antialiased pt-4 relative pb-20">
                    {demoContent.map((item, index) => (
                      <div key={`content-${index}`} className="mb-10">
                        <h2 className="bg-black dark:bg-white text-white dark:text-black rounded-full text-sm w-fit px-4 py-1 mb-4">
                          {item.badge}
                        </h2>

                        <p className={twMerge(calsans.className, "text-xl mb-4")}>
                          {item.title}
                        </p>

                        <div className="text-sm prose prose-sm dark:prose-invert">
                          {item?.image && (
                            <img
                              src={item.image}
                              alt="blog thumbnail"
                              height="400"
                              width="600"
                              className="rounded-lg mb-10 object-cover w-full h-48"
                            />
                          )}
                          {item.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </TracingBeam>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-200 mb-8">Simple Timeline</h2>
            <div className="bg-white dark:bg-neutral-950 rounded-lg overflow-hidden">
              <div className="h-[400px] overflow-y-auto">
                <TracingBeam className="px-6">
                  <div className="max-w-2xl mx-auto antialiased pt-4 relative pb-20">
                    {simpleContent.map((item, index) => (
                      <div key={`simple-${index}`} className="mb-16">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {item.badge}
                        </span>
                        <h3 className="text-lg font-semibold mb-2 mt-2">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </TracingBeam>
              </div>
            </div>
          </div>
        </div>

        {/* Code Example */}
        <div className="mt-16 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-200">Example Usage</h2>
          <div className="bg-zinc-900/50 rounded-lg p-6 border border-zinc-700">
            <pre className="text-sm text-gray-300 overflow-x-auto">
              <code>{`import { TracingBeam } from "@/components/ui/tracing-beam";

const content = [
  {
    title: "Getting Started with Next.js",
    description: (
      <>
        <p>
          Next.js is a powerful React framework that enables you to build
          production-ready applications with ease.
        </p>
      </>
    ),
    badge: "Tutorial",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
  },
  // Add more content items...
];

export function TracingBeamDemo() {
  return (
    <TracingBeam className="px-6">
      <div className="max-w-2xl mx-auto antialiased pt-4 relative">
        {content.map((item, index) => (
          <div key={\`content-\${index}\`} className="mb-10">
            <h2 className="bg-black text-white rounded-full text-sm w-fit px-4 py-1 mb-4">
              {item.badge}
            </h2>
            <p className="text-xl mb-4">
              {item.title}
            </p>
            <div className="text-sm prose prose-sm dark:prose-invert">
              {item?.image && (
                <img
                  src={item.image}
                  alt="blog thumbnail"
                  className="rounded-lg mb-10 object-cover"
                />
              )}
              {item.description}
            </div>
          </div>
        ))}
      </div>
    </TracingBeam>
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