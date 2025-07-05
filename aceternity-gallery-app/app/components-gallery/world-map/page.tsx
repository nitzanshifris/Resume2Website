"use client";

import React from "react";
import WorldMap from "@/components/ui/world-map";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function WorldMapPage() {
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
            World Map
          </h1>
          <p className="text-xl text-gray-400">
            A world map with animated lines and dots, programmatically generated
          </p>
        </div>

        {/* Features */}
        <div className="mb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700">
            <h3 className="text-white font-semibold mb-2">Animated Paths</h3>
            <p className="text-sm text-gray-400">Smooth curved paths with animation</p>
          </div>
          <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700">
            <h3 className="text-white font-semibold mb-2">Dotted Map</h3>
            <p className="text-sm text-gray-400">Generated using dotted-map library</p>
          </div>
          <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700">
            <h3 className="text-white font-semibold mb-2">Dark Mode Support</h3>
            <p className="text-sm text-gray-400">Adapts to theme automatically</p>
          </div>
          <div className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700">
            <h3 className="text-white font-semibold mb-2">Pulsing Dots</h3>
            <p className="text-sm text-gray-400">Animated endpoints for connections</p>
          </div>
        </div>

        {/* Examples */}
        <div className="space-y-16">
          <div>
            <h2 className="text-2xl font-semibold text-gray-200 mb-8">Global Connectivity</h2>
            <div className="bg-white dark:bg-black rounded-lg overflow-hidden border border-zinc-700">
              <div className="py-20">
                <div className="max-w-7xl mx-auto text-center px-4">
                  <p className="font-bold text-xl md:text-4xl dark:text-white text-black">
                    Remote{" "}
                    <span className="text-neutral-400">
                      {"Connectivity".split("").map((word, idx) => (
                        <motion.span
                          key={idx}
                          className="inline-block"
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ duration: 0.5, delay: idx * 0.04 }}
                        >
                          {word}
                        </motion.span>
                      ))}
                    </span>
                  </p>
                  <p className="text-sm md:text-lg text-neutral-500 max-w-2xl mx-auto py-4">
                    Break free from traditional boundaries. Work from anywhere, at the
                    comfort of your own studio apartment. Perfect for Nomads and
                    Travellers.
                  </p>
                </div>
                <WorldMap
                  dots={[
                    {
                      start: { lat: 64.2008, lng: -149.4937 }, // Alaska
                      end: { lat: 34.0522, lng: -118.2437 }, // Los Angeles
                    },
                    {
                      start: { lat: 64.2008, lng: -149.4937 }, // Alaska
                      end: { lat: -15.7975, lng: -47.8919 }, // Brazil
                    },
                    {
                      start: { lat: -15.7975, lng: -47.8919 }, // Brazil
                      end: { lat: 38.7223, lng: -9.1393 }, // Lisbon
                    },
                    {
                      start: { lat: 51.5074, lng: -0.1278 }, // London
                      end: { lat: 28.6139, lng: 77.209 }, // New Delhi
                    },
                    {
                      start: { lat: 28.6139, lng: 77.209 }, // New Delhi
                      end: { lat: 43.1332, lng: 131.9113 }, // Vladivostok
                    },
                    {
                      start: { lat: 28.6139, lng: 77.209 }, // New Delhi
                      end: { lat: -1.2921, lng: 36.8219 }, // Nairobi
                    },
                  ]}
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-200 mb-8">Office Locations</h2>
            <div className="bg-white dark:bg-black rounded-lg overflow-hidden border border-zinc-700">
              <div className="py-20">
                <div className="max-w-7xl mx-auto text-center px-4 mb-8">
                  <p className="font-bold text-xl md:text-4xl dark:text-white text-black mb-4">
                    Our Global Presence
                  </p>
                  <p className="text-sm md:text-lg text-neutral-500 max-w-2xl mx-auto">
                    With offices around the world, we're always close to our customers.
                  </p>
                </div>
                <WorldMap
                  dots={[
                    {
                      start: { lat: 37.7749, lng: -122.4194 }, // San Francisco
                      end: { lat: 40.7128, lng: -74.0060 }, // New York
                    },
                    {
                      start: { lat: 40.7128, lng: -74.0060 }, // New York
                      end: { lat: 51.5074, lng: -0.1278 }, // London
                    },
                    {
                      start: { lat: 51.5074, lng: -0.1278 }, // London
                      end: { lat: 48.8566, lng: 2.3522 }, // Paris
                    },
                    {
                      start: { lat: 48.8566, lng: 2.3522 }, // Paris
                      end: { lat: 35.6762, lng: 139.6503 }, // Tokyo
                    },
                    {
                      start: { lat: 35.6762, lng: 139.6503 }, // Tokyo
                      end: { lat: -33.8688, lng: 151.2093 }, // Sydney
                    },
                  ]}
                  lineColor="#10b981"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-200 mb-8">Custom Colors</h2>
            <div className="bg-white dark:bg-black rounded-lg overflow-hidden border border-zinc-700">
              <div className="py-20">
                <div className="max-w-7xl mx-auto text-center px-4 mb-8">
                  <p className="font-bold text-xl md:text-4xl dark:text-white text-black mb-4">
                    Network Infrastructure
                  </p>
                  <p className="text-sm md:text-lg text-neutral-500 max-w-2xl mx-auto">
                    High-speed connections between our data centers.
                  </p>
                </div>
                <WorldMap
                  dots={[
                    {
                      start: { lat: 39.0458, lng: -77.6413 }, // Virginia
                      end: { lat: 37.5665, lng: 126.9780 }, // Seoul
                    },
                    {
                      start: { lat: 37.5665, lng: 126.9780 }, // Seoul
                      end: { lat: 1.3521, lng: 103.8198 }, // Singapore
                    },
                    {
                      start: { lat: 1.3521, lng: 103.8198 }, // Singapore
                      end: { lat: 19.0760, lng: 72.8777 }, // Mumbai
                    },
                    {
                      start: { lat: 19.0760, lng: 72.8777 }, // Mumbai
                      end: { lat: 50.1109, lng: 8.6821 }, // Frankfurt
                    },
                  ]}
                  lineColor="#ef4444"
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
              <code>{`import WorldMap from "@/components/ui/world-map";

export function WorldMapDemo() {
  return (
    <WorldMap
      dots={[
        {
          start: { lat: 64.2008, lng: -149.4937 }, // Alaska
          end: { lat: 34.0522, lng: -118.2437 }, // Los Angeles
        },
        {
          start: { lat: 51.5074, lng: -0.1278 }, // London
          end: { lat: 28.6139, lng: 77.209 }, // New Delhi
        },
        {
          start: { lat: 28.6139, lng: 77.209 }, // New Delhi
          end: { lat: -1.2921, lng: 36.8219 }, // Nairobi
        },
      ]}
      lineColor="#0ea5e9"
    />
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
                    <td className="p-4 font-mono text-blue-400">dots</td>
                    <td className="p-4">Array&lt;{`{start: Point, end: Point}`}&gt;</td>
                    <td className="p-4">[]</td>
                    <td className="p-4">Array of coordinate pairs representing connections on the map</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-mono text-blue-400">lineColor</td>
                    <td className="p-4">string</td>
                    <td className="p-4">#0ea5e9</td>
                    <td className="p-4">Color of the lines connecting the dots</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-200 mt-8">Point Object</h3>
          <div className="bg-zinc-900/50 rounded-lg overflow-hidden border border-zinc-700">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-zinc-800/50 border-b border-zinc-700">
                  <tr>
                    <th className="text-left p-4 text-gray-300 font-semibold">Property</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">Type</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">Required</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <tr className="border-b border-zinc-700/50">
                    <td className="p-4 font-mono text-blue-400">lat</td>
                    <td className="p-4">number</td>
                    <td className="p-4">Yes</td>
                    <td className="p-4">Latitude coordinate (-90 to 90)</td>
                  </tr>
                  <tr className="border-b border-zinc-700/50">
                    <td className="p-4 font-mono text-blue-400">lng</td>
                    <td className="p-4">number</td>
                    <td className="p-4">Yes</td>
                    <td className="p-4">Longitude coordinate (-180 to 180)</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-mono text-blue-400">label</td>
                    <td className="p-4">string</td>
                    <td className="p-4">No</td>
                    <td className="p-4">Optional label for the point</td>
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
              <code>npm install motion clsx tailwind-merge dotted-map</code>
            </pre>
          </div>
          <div className="bg-zinc-900/50 rounded-lg p-6 border border-zinc-700">
            <p className="text-sm text-gray-300 mb-2">For React 19 / Next.js 15 users:</p>
            <pre className="text-sm text-gray-300">
              <code>npm install motion@12.0.0-alpha.2</code>
            </pre>
            <pre className="text-sm text-gray-300 mt-2">
              <code>npm install dotted-map --legacy-peer-deps</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}