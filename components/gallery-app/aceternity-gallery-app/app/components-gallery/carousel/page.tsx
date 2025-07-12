"use client";

import { CarouselDemo, CarouselEnhancedDemo, CarouselFixedDemo } from "@/component-library/components/ui/carousel";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Play, Settings } from "lucide-react";

export default function CarouselPage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-full mx-auto px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Carousel</h1>
          <p className="text-gray-400 mb-8">A customizable carousel with microinteractions and slider.</p>
          
          <div className="flex justify-center gap-4">
            <Link href="/components-gallery/carousel/playground">
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Settings className="h-4 w-4 mr-2" />
                Open Playground
              </Button>
            </Link>
          </div>
        </div>

        <div className="space-y-16">
          <section>
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Aceternity Official Carousel</h2>
            <p className="text-gray-400 text-center mb-8">Matches the official Aceternity UI carousel design</p>
            <CarouselFixedDemo />
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Enhanced Carousel</h2>
            <p className="text-gray-400 text-center mb-8">Extended version with auto-play and enhanced features</p>
            <CarouselEnhancedDemo />
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Basic Carousel</h2>
            <p className="text-gray-400 text-center mb-8">Simple version for basic use cases</p>
            <CarouselDemo />
          </section>
        </div>
      </div>
    </div>
  );
}