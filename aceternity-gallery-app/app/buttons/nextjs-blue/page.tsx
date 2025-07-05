"use client";

import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Copy, Code2, Palette, Zap } from "lucide-react";
import { toast, Toaster } from "sonner";

export default function NextjsBlueButtonPage() {
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

  const buttonCode = `<button className="shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-8 py-2 bg-[#0070f3] rounded-md text-white font-light transition duration-200 ease-linear">
  Next.js Blue
</button>`;

  const variants = [
    {
      name: "Default",
      component: (
        <button className="shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-8 py-2 bg-[#0070f3] rounded-md text-white font-light transition duration-200 ease-linear">
          Next.js Blue
        </button>
      ),
      code: buttonCode
    },
    {
      name: "Small Size",
      component: (
        <button className="shadow-[0_2px_8px_0_rgb(0,118,255,39%)] hover:shadow-[0_4px_12px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-4 py-1 bg-[#0070f3] rounded text-white font-light text-sm transition duration-200 ease-linear">
          Small Blue
        </button>
      ),
      code: `<button className="shadow-[0_2px_8px_0_rgb(0,118,255,39%)] hover:shadow-[0_4px_12px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-4 py-1 bg-[#0070f3] rounded text-white font-light text-sm transition duration-200 ease-linear">
  Small Blue
</button>`
    },
    {
      name: "Large Size",
      component: (
        <button className="shadow-[0_6px_20px_0_rgb(0,118,255,39%)] hover:shadow-[0_8px_30px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-12 py-3 bg-[#0070f3] rounded-lg text-white font-light text-lg transition duration-200 ease-linear">
          Large Blue
        </button>
      ),
      code: `<button className="shadow-[0_6px_20px_0_rgb(0,118,255,39%)] hover:shadow-[0_8px_30px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-12 py-3 bg-[#0070f3] rounded-lg text-white font-light text-lg transition duration-200 ease-linear">
  Large Blue
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
          <h1 className="text-4xl font-bold">Next.js Blue Button</h1>
          <p className="text-muted-foreground text-lg">
            A button styled with Next.js brand colors and shadow effects, perfect for modern web applications.
          </p>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="secondary">Brand Inspired</Badge>
            <Badge variant="secondary">Blue Shadow</Badge>
            <Badge variant="secondary">Modern</Badge>
            <Badge variant="secondary">Premium</Badge>
          </div>
        </div>
      </div>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>Hover to see the enhanced shadow effect</CardDescription>
        </CardHeader>
        <div className="p-6">
          <div className="flex items-center justify-center h-32 bg-muted/50 rounded-lg">
            <button className="shadow-[0_4px_14px_0_rgb(0,118,255,39%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] hover:bg-[rgba(0,118,255,0.9)] px-8 py-2 bg-[#0070f3] rounded-md text-white font-light transition duration-200 ease-linear">
              Next.js Blue
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
            Size Variations
          </CardTitle>
          <CardDescription>Different sizes of the Next.js blue button</CardDescription>
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

      {/* Color Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Design Details
          </CardTitle>
        </CardHeader>
        <div className="p-6 space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Brand Color</h3>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#0070f3] rounded"></div>
              <code className="text-sm">#0070f3</code>
              <span className="text-sm text-muted-foreground">- Next.js brand blue</span>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Shadow Effects</h3>
            <p className="text-sm text-muted-foreground">
              Uses colored shadows that match the button color for a cohesive, premium appearance.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Hover Animation</h3>
            <p className="text-sm text-muted-foreground">
              Shadow expands and button color slightly darkens on hover for interactive feedback.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Typography</h3>
            <p className="text-sm text-muted-foreground">
              Uses <code>font-light</code> for a modern, clean appearance that matches Next.js branding.
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
            <li>Perfect for Next.js applications and documentation</li>
            <li>Works great as primary action buttons</li>
            <li>The blue shadow creates depth and premium feel</li>
            <li>Maintains brand consistency with Next.js design</li>
            <li>Smooth transitions provide polished user experience</li>
            <li>Light font weight gives modern, clean appearance</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}