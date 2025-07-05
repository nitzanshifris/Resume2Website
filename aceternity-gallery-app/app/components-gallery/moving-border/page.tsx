"use client";

import { Button } from "@/components/ui/moving-border";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const examples = [
  {
    name: "Default Moving Border",
    component: () => (
      <div className="flex items-center justify-center p-8">
        <Button
          borderRadius="1.75rem"
          className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
        >
          Borders are cool
        </Button>
      </div>
    ),
  },
  {
    name: "Custom Border Radius",
    component: () => (
      <div className="flex items-center justify-center p-8">
        <Button
          borderRadius="0.5rem"
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white"
        >
          Square Border
        </Button>
      </div>
    ),
  },
  {
    name: "Different Sizes",
    component: () => (
      <div className="flex items-center justify-center gap-4 p-8">
        <Button
          borderRadius="1rem"
          containerClassName="h-12 w-32"
          className="bg-green-600 text-white text-sm"
        >
          Small
        </Button>
        <Button
          borderRadius="1.5rem"
          containerClassName="h-16 w-40"
          className="bg-blue-600 text-white text-base"
        >
          Medium
        </Button>
        <Button
          borderRadius="2rem"
          containerClassName="h-20 w-48"
          className="bg-purple-600 text-white text-lg"
        >
          Large
        </Button>
      </div>
    ),
  },
  {
    name: "Custom Duration",
    component: () => (
      <div className="flex items-center justify-center gap-4 p-8">
        <Button
          borderRadius="1.75rem"
          duration={1000}
          className="bg-red-600 text-white"
        >
          Fast (1s)
        </Button>
        <Button
          borderRadius="1.75rem"
          duration={5000}
          className="bg-orange-600 text-white"
        >
          Slow (5s)
        </Button>
      </div>
    ),
  },
  {
    name: "As Different Elements",
    component: () => (
      <div className="flex items-center justify-center gap-4 p-8">
        <Button
          as="div"
          borderRadius="1.75rem"
          className="bg-teal-600 text-white cursor-pointer"
        >
          Div Element
        </Button>
        <Button
          as="a"
          href="#"
          borderRadius="1.75rem"
          className="bg-indigo-600 text-white no-underline"
        >
          Link Element
        </Button>
      </div>
    ),
  },
];

export default function MovingBorderPage() {
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
            Moving Border
          </h1>
          <p className="text-xl text-gray-400">
            A border that moves around the container. Perfect for making your buttons stand out.
          </p>
        </div>

        {/* Examples */}
        <div className="space-y-24">
          {examples.map((example, index) => (
            <div key={index} className="space-y-6">
              <h2 className="text-2xl font-semibold text-white">
                {example.name}
              </h2>
              <div className="bg-zinc-900/50 rounded-lg min-h-[200px] flex items-center justify-center">
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
                <code className="text-sm text-gray-300">{`import { Button } from "@/components/ui/moving-border";

export default function Example() {
  return (
    <Button
      borderRadius="1.75rem"
      className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
    >
      Borders are cool
    </Button>
  );
}`}</code>
              </pre>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Custom Duration</h3>
              <pre className="bg-zinc-900 rounded-lg p-4 overflow-x-auto">
                <code className="text-sm text-gray-300">{`<Button
  borderRadius="1.75rem"
  duration={1000}
  className="bg-blue-600 text-white"
>
  Fast Animation
</Button>`}</code>
              </pre>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-4">As Different Element</h3>
              <pre className="bg-zinc-900 rounded-lg p-4 overflow-x-auto">
                <code className="text-sm text-gray-300">{`<Button
  as="a"
  href="/link"
  borderRadius="1.75rem"
  className="bg-purple-600 text-white"
>
  Link Button
</Button>`}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Props */}
        <div className="mt-16 bg-zinc-900 rounded-lg p-6">
          <h3 className="text-2xl font-bold text-white mb-4">Props</h3>
          <div className="space-y-4">
            <div>
              <code className="text-blue-400">borderRadius</code>
              <span className="text-gray-400 ml-2">- Border radius of the button (default: "1.75rem")</span>
            </div>
            <div>
              <code className="text-blue-400">children</code>
              <span className="text-gray-400 ml-2">- The content to be displayed inside the button</span>
            </div>
            <div>
              <code className="text-blue-400">as</code>
              <span className="text-gray-400 ml-2">- HTML element or React component to use (default: "button")</span>
            </div>
            <div>
              <code className="text-blue-400">containerClassName</code>
              <span className="text-gray-400 ml-2">- Additional CSS classes for the container</span>
            </div>
            <div>
              <code className="text-blue-400">borderClassName</code>
              <span className="text-gray-400 ml-2">- Additional CSS classes for the border</span>
            </div>
            <div>
              <code className="text-blue-400">duration</code>
              <span className="text-gray-400 ml-2">- Duration for the moving border animation in milliseconds (default: 3000)</span>
            </div>
            <div>
              <code className="text-blue-400">className</code>
              <span className="text-gray-400 ml-2">- Additional CSS classes for the button</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}