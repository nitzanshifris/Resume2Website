"use client";

import { PointerHighlight } from "@/components/ui/pointer-highlight";

export default function PointerHighlightGallery() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-background p-8">
      <div className="mx-auto max-w-6xl space-y-20">
        {/* Variant 1: Basic Text Highlight */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Basic Text Highlight</h3>
          <div className="mx-auto max-w-lg text-2xl font-bold tracking-tight md:text-4xl">
            The best way to grow is to
            <PointerHighlight containerClassName="inline-block mx-2">
              <span>collaborate</span>
            </PointerHighlight>
          </div>
        </div>

        {/* Variant 2: Card Grid with Inline Highlights */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Inline Highlights in Cards</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-md border p-6">
              <div className="h-32 w-full rounded-lg bg-gradient-to-r from-blue-200 to-sky-200" />
              <div className="mt-4 text-base font-bold tracking-tight">
                <PointerHighlight
                  rectangleClassName="bg-neutral-200 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600"
                  pointerClassName="text-yellow-500 h-3 w-3"
                  containerClassName="inline-block mr-1"
                >
                  <span className="relative z-10">collab tool</span>
                </PointerHighlight>
                of the century with max benefits.
              </div>
              <p className="mt-2 text-sm text-neutral-500">
                State of the art collaboration.
              </p>
            </div>
            
            <div className="rounded-md border p-6">
              <div className="h-32 w-full rounded-lg bg-gradient-to-r from-blue-200 to-purple-200" />
              <div className="mt-4 text-base font-bold tracking-tight">
                Discover our
                <PointerHighlight
                  rectangleClassName="bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700"
                  pointerClassName="text-blue-500 h-3 w-3"
                  containerClassName="inline-block mx-1"
                >
                  <span className="relative z-10">innovative</span>
                </PointerHighlight>
                solutions.
              </div>
              <p className="mt-2 text-sm text-neutral-500">
                Cutting-edge technology.
              </p>
            </div>

            <div className="rounded-md border p-6">
              <div className="h-32 w-full rounded-lg bg-gradient-to-r from-green-200 to-yellow-200" />
              <div className="mt-4 text-base font-bold tracking-tight">
                Experience the
                <PointerHighlight
                  rectangleClassName="bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700"
                  pointerClassName="text-green-500 h-3 w-3"
                  containerClassName="inline-block ml-1"
                >
                  <span className="relative z-10">future</span>
                </PointerHighlight>
              </div>
              <p className="mt-2 text-sm text-neutral-500">
                Sustainable solutions.
              </p>
            </div>
          </div>
        </div>

        {/* Variant 3: Custom Background Colors */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Custom Background Colors</h3>
          <div className="mx-auto max-w-lg text-2xl font-bold tracking-tight md:text-4xl">
            There has to be some
            <PointerHighlight
              rectangleClassName="bg-neutral-200 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600"
              pointerClassName="text-yellow-500"
              containerClassName="inline-block ml-2"
            >
              <span className="relative z-10 px-2">background to animate</span>
            </PointerHighlight>
          </div>
        </div>

        {/* Variant 4: Button Highlight */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Button Highlight</h3>
          <div className="flex gap-4">
            <PointerHighlight
              rectangleClassName="bg-blue-100 dark:bg-blue-900/20"
              pointerClassName="text-blue-600"
            >
              <button className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700">
                Get Started
              </button>
            </PointerHighlight>
            
            <PointerHighlight
              rectangleClassName="bg-purple-100 dark:bg-purple-900/20"
              pointerClassName="text-purple-600"
            >
              <button className="rounded-lg border border-purple-600 px-6 py-3 text-purple-600 hover:bg-purple-50">
                Learn More
              </button>
            </PointerHighlight>
          </div>
        </div>

        {/* Variant 5: Large Content Block */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Large Content Block</h3>
          <PointerHighlight
            rectangleClassName="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20"
            pointerClassName="text-purple-600 h-8 w-8"
          >
            <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
              <h2 className="mb-4 text-2xl font-bold">Featured Content</h2>
              <p className="mb-4 text-gray-600 dark:text-gray-300">
                This entire block is highlighted with a custom gradient background
                and larger pointer icon. Perfect for drawing attention to important
                sections of your content.
              </p>
              <button className="rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700">
                Explore Features
              </button>
            </div>
          </PointerHighlight>
        </div>
      </div>
    </div>
  );
}