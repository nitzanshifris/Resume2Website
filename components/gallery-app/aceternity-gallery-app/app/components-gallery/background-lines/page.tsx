"use client";

import { 
  BackgroundLinesGalleryHero,
  BackgroundLinesGalleryAbout,
  BackgroundLinesGalleryServices,
  BackgroundLinesGalleryContact,
  BackgroundLinesGalleryMinimal,
  BackgroundLinesGalleryFast
} from "@/component-library/components/ui/background-lines";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const variants = [
  {
    name: "Hero Section",
    component: BackgroundLinesGalleryHero,
  },
  {
    name: "About Section",
    component: BackgroundLinesGalleryAbout,
  },
  {
    name: "Services Section",
    component: BackgroundLinesGalleryServices,
  },
  {
    name: "Contact Section",
    component: BackgroundLinesGalleryContact,
  },
  {
    name: "Minimal",
    component: BackgroundLinesGalleryMinimal,
  },
  {
    name: "Fast Animation",
    component: BackgroundLinesGalleryFast,
  }
];

export default function BackgroundLinesPage() {
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
            Background Lines
          </h1>
          <p className="text-xl text-gray-400">
            A set of SVG paths that animate in a wave pattern. Good for hero sections background
          </p>
        </div>

        {/* Variants Showcase */}
        <div className="space-y-16">
          {variants.map((variant) => {
            const Component = variant.component;
            return (
              <div key={variant.name} className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-200">{variant.name}</h2>
                <div className="bg-zinc-900/30 rounded-lg border border-gray-800 overflow-hidden">
                  <Component />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}