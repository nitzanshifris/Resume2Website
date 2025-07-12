"use client";

import { CardSpotlightDemo } from "@/component-library/components/ui/card-spotlight";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Settings, Play } from "lucide-react";

export default function CardSpotlightPage() {
  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Card Spotlight</h1>
          <p className="text-gray-400 mb-8">A card component with a spotlight effect revealing a radial gradient background</p>
          
          <div className="flex justify-center gap-4">
            <Link href="/components-gallery/card-spotlight/playground">
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Settings className="h-4 w-4 mr-2" />
                Open Playground
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex justify-center">
          <CardSpotlightDemo />
        </div>
      </div>
    </div>
  );
}