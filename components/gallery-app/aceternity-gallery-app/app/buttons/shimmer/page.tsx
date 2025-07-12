"use client";

import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Copy, Code2, Palette, Zap, Settings } from "lucide-react";
import { toast, Toaster } from "sonner";

export default function ShimmerButtonPage() {
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

  const buttonCode = `<button className="inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
  Shimmer
</button>`;

  const tailwindConfig = `// Add to tailwind.config.js
module.exports = {
  theme: {
    extend: {
      animation: {
        shimmer: "shimmer 2s linear infinite"
      },
      keyframes: {
        shimmer: {
          from: { backgroundPosition: "0 0" },
          to: { backgroundPosition: "-200% 0" }
        }
      }
    }
  }
}`;

  const variants = [
    {
      name: "Default",
      component: (
        <button className="inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
          Shimmer
        </button>
      ),
      code: buttonCode
    },
    {
      name: "Blue Variant",
      component: (
        <button className="inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-blue-800 bg-[linear-gradient(110deg,#001529,45%,#1e3a8a,55%,#001529)] bg-[length:200%_100%] px-6 font-medium text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-50">
          Blue Shimmer
        </button>
      ),
      code: `<button className="inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-blue-800 bg-[linear-gradient(110deg,#001529,45%,#1e3a8a,55%,#001529)] bg-[length:200%_100%] px-6 font-medium text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-50">
  Blue Shimmer
</button>`
    },
    {
      name: "Purple Variant",
      component: (
        <button className="inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-purple-800 bg-[linear-gradient(110deg,#2e1065,45%,#7c3aed,55%,#2e1065)] bg-[length:200%_100%] px-6 font-medium text-purple-400 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-50">
          Purple Shimmer
        </button>
      ),
      code: `<button className="inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-purple-800 bg-[linear-gradient(110deg,#2e1065,45%,#7c3aed,55%,#2e1065)] bg-[length:200%_100%] px-6 font-medium text-purple-400 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-50">
  Purple Shimmer
</button>`
    },
    {
      name: "Small Size",
      component: (
        <button className="inline-flex h-8 animate-shimmer items-center justify-center rounded border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-4 text-sm font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
          Small Shimmer
        </button>
      ),
      code: `<button className="inline-flex h-8 animate-shimmer items-center justify-center rounded border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-4 text-sm font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
  Small Shimmer
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
          <h1 className="text-4xl font-bold">Shimmer Button</h1>
          <p className="text-muted-foreground text-lg">
            An animated button with a shimmering gradient effect that continuously moves across the background.
          </p>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="secondary">Animated</Badge>
            <Badge variant="secondary">Gradient</Badge>
            <Badge variant="secondary">Modern</Badge>
            <Badge variant="secondary">CSS Animation</Badge>
          </div>
        </div>
      </div>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>Watch the shimmer effect move across the button</CardDescription>
        </CardHeader>
        <div className="p-6">
          <div className="flex items-center justify-center h-32 bg-gray-900 rounded-lg">
            <button className="inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
              Shimmer
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
        <div className="p-6 space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Button Code</h3>
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
          
          <div>
            <h3 className="font-semibold mb-2">Tailwind Configuration</h3>
            <div className="relative">
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                <code className="text-sm">{tailwindConfig}</code>
              </pre>
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(tailwindConfig)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
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
          <CardDescription>Different colors and sizes of the shimmer button</CardDescription>
        </CardHeader>
        <div className="p-6 space-y-6">
          {variants.map((variant, index) => (
            <div key={index} className="space-y-4">
              <h3 className="text-lg font-semibold">{variant.name}</h3>
              <div className="flex items-center justify-center h-24 bg-gray-900 rounded-lg">
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

      {/* Animation Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Animation Details
          </CardTitle>
        </CardHeader>
        <div className="p-6 space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Shimmer Effect</h3>
            <p className="text-sm text-muted-foreground">
              The shimmer effect is created using a linear gradient with <code>bg-[length:200%_100%]</code> and animating the <code>backgroundPosition</code> from <code>0 0</code> to <code>-200% 0</code>.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Animation Duration</h3>
            <p className="text-sm text-muted-foreground">
              The animation runs for 2 seconds and repeats infinitely with linear timing.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Gradient Positioning</h3>
            <p className="text-sm text-muted-foreground">
              The gradient uses a 110-degree angle and specific color stops to create the shimmering light effect.
            </p>
          </div>
        </div>
      </Card>

      {/* Setup Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Setup Instructions
          </CardTitle>
        </CardHeader>
        <div className="p-6 space-y-4">
          <div>
            <h3 className="font-semibold mb-2">1. Add Animation to Tailwind Config</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Add the shimmer keyframe and animation to your <code>tailwind.config.js</code> file:
            </p>
            <div className="bg-muted p-3 rounded text-sm">
              <code>animation: { shimmer: "shimmer 2s linear infinite" }</code>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">2. Copy Button Code</h3>
            <p className="text-sm text-muted-foreground">
              Copy the button code from above and paste it into your component.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">3. Customize Colors</h3>
            <p className="text-sm text-muted-foreground">
              Modify the gradient colors and border colors to match your design system.
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
            <li>Perfect for premium or high-tech interfaces</li>
            <li>Works best on dark backgrounds</li>
            <li>Great for call-to-action buttons that need attention</li>
            <li>Use sparingly to avoid overwhelming the user</li>
            <li>Consider accessibility and users who prefer reduced motion</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}