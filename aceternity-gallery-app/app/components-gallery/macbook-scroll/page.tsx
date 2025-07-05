"use client";

import { MacBookScroll } from "@/components/ui/macbook-scroll";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const examples = [
  {
    name: "Default MacBook Scroll",
    component: () => (
      <div className="overflow-hidden dark:bg-[#0B0B0F] bg-white w-full">
        <MacBookScroll
          title={
            <span>
              This Macbook is built with Tailwindcss. <br /> No kidding.
            </span>
          }
          src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2071&auto=format&fit=crop"
          showGradient={false}
        />
      </div>
    ),
  },
  {
    name: "With Gradient Overlay",
    component: () => (
      <div className="overflow-hidden dark:bg-[#0B0B0F] bg-white w-full">
        <MacBookScroll
          title="Beautiful Gradient Effects"
          src="https://images.unsplash.com/photo-1517430816045-df4b7de01f9d?q=80&w=2071&auto=format&fit=crop"
          showGradient={true}
        />
      </div>
    ),
  },
  {
    name: "Portfolio Showcase",
    component: () => (
      <div className="overflow-hidden dark:bg-[#0B0B0F] bg-white w-full">
        <MacBookScroll
          title={
            <span>
              John Doe <br /> Full Stack Developer
            </span>
          }
          src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop"
          showGradient={false}
        />
      </div>
    ),
  },
];

export default function MacBookScrollGallery() {
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
            MacBook Scroll
          </h1>
          <p className="text-xl text-gray-400">
            A 3D MacBook Pro animation component that responds to scroll. Features a realistic MacBook design with keyboard, trackpad, and screen that transforms as you scroll.
          </p>
        </div>

        {/* Examples */}
        <div className="space-y-24">
          {examples.map((example, index) => (
            <div key={index} className="space-y-6">
              <h2 className="text-2xl font-semibold text-white">
                {example.name}
              </h2>
              <div className="rounded-lg overflow-hidden">
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
                <code className="text-sm text-gray-300">{`import { MacBookScroll } from "@/components/ui/macbook-scroll";

export default function Example() {
  return (
    <MacBookScroll
      src="/your-image.jpg"
      title="Your Title"
      showGradient={false}
    />
  );
}`}</code>
              </pre>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-4">With Custom Title</h3>
              <pre className="bg-zinc-900 rounded-lg p-4 overflow-x-auto">
                <code className="text-sm text-gray-300">{`<MacBookScroll
  title={
    <span>
      Line One <br /> Line Two
    </span>
  }
  src="https://example.com/image.jpg"
  showGradient={false}
/>`}</code>
              </pre>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-4">With Badge</h3>
              <pre className="bg-zinc-900 rounded-lg p-4 overflow-x-auto">
                <code className="text-sm text-gray-300">{`<MacBookScroll
  title="Your Title"
  src="/image.jpg"
  badge={<YourBadgeComponent />}
  showGradient={false}
/>`}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Props */}
        <div className="mt-16 bg-zinc-900 rounded-lg p-6">
          <h3 className="text-2xl font-bold text-white mb-4">Props</h3>
          <div className="space-y-4">
            <div>
              <code className="text-blue-400">src</code>
              <span className="text-gray-400 ml-2">- Image source for the MacBook screen</span>
            </div>
            <div>
              <code className="text-blue-400">title</code>
              <span className="text-gray-400 ml-2">- Title text or React node displayed above the MacBook</span>
            </div>
            <div>
              <code className="text-blue-400">showGradient</code>
              <span className="text-gray-400 ml-2">- Whether to show gradient overlay on the screen</span>
            </div>
            <div>
              <code className="text-blue-400">badge</code>
              <span className="text-gray-400 ml-2">- Optional badge component to display</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}