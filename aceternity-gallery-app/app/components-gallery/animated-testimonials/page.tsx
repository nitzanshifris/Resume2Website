"use client";

import { 
  AnimatedTestimonialsGalleryBasic,
  AnimatedTestimonialsGalleryAutoplay,
  AnimatedTestimonialsGalleryTeam,
  AnimatedTestimonialsGalleryCompact
} from "@/component-library/components/ui/animated-testimonials";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const variants = [
  {
    name: "Basic Testimonials",
    component: AnimatedTestimonialsGalleryBasic,
  },
  {
    name: "Autoplay Mode",
    component: AnimatedTestimonialsGalleryAutoplay,
  },
  {
    name: "Team Reviews",
    component: AnimatedTestimonialsGalleryTeam,
  },
  {
    name: "Compact Display",
    component: AnimatedTestimonialsGalleryCompact,
  }
];

export default function AnimatedTestimonialsPage() {
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
            Animated Testimonials
          </h1>
          <p className="text-xl text-gray-400">
            Beautiful testimonial carousel with smooth 3D animations and stacked photo effects
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