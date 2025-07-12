"use client";

import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Copy, Code2, Palette, Zap, Music } from "lucide-react";
import { toast, Toaster } from "sonner";

export default function SpotifyButtonPage() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Copied to clipboard");
      })
      .catch((err) => {
        console.error("Error copying text to clipboard:", err);
        toast.error("Error copying to clipboard");
      });
  };

  const buttonCode = `<button className="px-12 py-4 rounded-full bg-[#1ED760] font-bold text-white tracking-widest uppercase transform hover:scale-105 hover:bg-[#21e065] transition-colors duration-200">
  Spotify
</button>`;

  const variants = [
    {
      name: "Default",
      component: (
        <button className="px-12 py-4 rounded-full bg-[#1ED760] font-bold text-white tracking-widest uppercase transform hover:scale-105 hover:bg-[#21e065] transition-colors duration-200">
          Spotify
        </button>
      ),
      code: buttonCode
    },
    {
      name: "With Icon",
      component: (
        <button className="px-8 py-4 rounded-full bg-[#1ED760] font-bold text-white tracking-widest uppercase transform hover:scale-105 hover:bg-[#21e065] transition-colors duration-200 flex items-center gap-2">
          <Music className="w-5 h-5" />
          Play Music
        </button>
      ),
      code: `<button className="px-8 py-4 rounded-full bg-[#1ED760] font-bold text-white tracking-widest uppercase transform hover:scale-105 hover:bg-[#21e065] transition-colors duration-200 flex items-center gap-2">
  <Music className="w-5 h-5" />
  Play Music
</button>`
    },
    {
      name: "Small Size",
      component: (
        <button className="px-6 py-2 rounded-full bg-[#1ED760] font-bold text-white tracking-wide uppercase text-sm transform hover:scale-105 hover:bg-[#21e065] transition-colors duration-200">
          Listen
        </button>
      ),
      code: `<button className="px-6 py-2 rounded-full bg-[#1ED760] font-bold text-white tracking-wide uppercase text-sm transform hover:scale-105 hover:bg-[#21e065] transition-colors duration-200">
  Listen
</button>`
    },
    {
      name: "Outline Version",
      component: (
        <button className="px-12 py-4 rounded-full border-2 border-[#1ED760] font-bold text-[#1ED760] tracking-widest uppercase transform hover:scale-105 hover:bg-[#1ED760] hover:text-white transition-all duration-200">
          Spotify
        </button>
      ),
      code: `<button className="px-12 py-4 rounded-full border-2 border-[#1ED760] font-bold text-[#1ED760] tracking-widest uppercase transform hover:scale-105 hover:bg-[#1ED760] hover:text-white transition-all duration-200">
  Spotify
</button>`
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-8">
      <Toaster position="top-center" />
      
      {/* Header */}
      <div className="space-y-4">
        <Link href="/buttons" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Buttons
        </Link>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Spotify Button</h1>
          <p className="text-muted-foreground text-lg">
            A vibrant button inspired by Spotify's signature green color and bold typography.
          </p>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="secondary">Brand Inspired</Badge>
            <Badge variant="secondary">Scale Animation</Badge>
            <Badge variant="secondary">Bold Typography</Badge>
            <Badge variant="secondary">Music Theme</Badge>
          </div>
        </div>
      </div>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>Hover to see the scale animation effect</CardDescription>
        </CardHeader>
        <div className="p-6">
          <div className="flex items-center justify-center h-32 bg-muted/50 rounded-lg">
            <button className="px-12 py-4 rounded-full bg-[#1ED760] font-bold text-white tracking-widest uppercase transform hover:scale-105 hover:bg-[#21e065] transition-colors duration-200">
              Spotify
            </button>
          </div>
        </div>
      </Card>

      {/* Code */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code2 className="h-5 w-5" />
            Code
          </CardTitle>
          <CardDescription>Copy the code and paste it into your project</CardDescription>
        </CardHeader>
        <div className="p-6">
          <div className="relative">
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">{buttonCode}</code>
            </pre>
            <Button
              size="sm"
              variant="outline"
              className="absolute top-2 right-2"
              onClick={() => copyToClipboard(buttonCode)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Variants */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Variations
          </CardTitle>
          <CardDescription>Different styles and sizes of the Spotify button</CardDescription>
        </CardHeader>
        <div className="p-6 space-y-6">
          {variants.map((variant, index) => (
            <div key={index} className="space-y-4">
              <h3 className="text-lg font-semibold">{variant.name}</h3>
              <div className="flex items-center justify-center h-24 bg-muted/50 rounded-lg">
                {variant.component}
              </div>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm">{variant.code}</code>
                </pre>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(variant.code)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Brand Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Brand Elements
          </CardTitle>
        </CardHeader>
        <div className="p-6 space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Spotify Green</h3>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#1ED760] rounded"></div>
              <code className="text-sm">#1ED760</code>
              <span className="text-sm text-muted-foreground">- Spotify's signature green</span>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Typography</h3>
            <p className="text-sm text-muted-foreground">
              Uses <code>font-bold</code>, <code>tracking-widest</code>, and <code>uppercase</code> for Spotify's characteristic bold, spaced-out text style.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Scale Animation</h3>
            <p className="text-sm text-muted-foreground">
              <code>hover:scale-105</code> creates a subtle zoom effect that adds energy and playfulness.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Rounded Design</h3>
            <p className="text-sm text-muted-foreground">
              Full border radius creates the pill shape commonly used in music streaming interfaces.
            </p>
          </div>
        </div>
      </Card>

      {/* Usage */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Tips</CardTitle>
        </CardHeader>
        <div className="p-6 space-y-4">
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li>Perfect for music streaming applications</li>
            <li>Great for play buttons and music-related actions</li>
            <li>The bright green color demands attention</li>
            <li>Scale animation adds playful energy</li>
            <li>Works well on both light and dark backgrounds</li>
            <li>Bold typography conveys confidence and energy</li>
            <li>Use sparingly as it's a very prominent color</li>
          </ul>
        </div>
      </Card>

      {/* Color Accessibility */}
      <Card>
        <CardHeader>
          <CardTitle>Accessibility Notes</CardTitle>
        </CardHeader>
        <div className="p-6 space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Color Contrast</h3>
            <p className="text-sm text-muted-foreground">
              White text on Spotify green (#1ED760) provides excellent contrast for readability.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Motion Sensitivity</h3>
            <p className="text-sm text-muted-foreground">
              Consider adding <code>@media (prefers-reduced-motion: reduce)</code> to disable the scale animation for users who prefer reduced motion.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}