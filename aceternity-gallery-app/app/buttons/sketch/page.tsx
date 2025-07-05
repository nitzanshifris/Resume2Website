"use client";

import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Copy, Code2, Palette, Zap } from "lucide-react";
import { toast, Toaster } from "sonner";
import reactElementToJSXString from "react-element-to-jsx-string";

export default function SketchButtonPage() {
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

  const buttonCode = `<button className="px-4 py-2 rounded-md border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200">
  Sketch
</button>`;

  const variants = [
    {
      name: "Default",
      component: (
        <button className="px-4 py-2 rounded-md border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200">
          Sketch
        </button>
      ),
      code: buttonCode
    },
    {
      name: "Large",
      component: (
        <button className="px-6 py-3 rounded-md border border-black bg-white text-black text-base hover:shadow-[6px_6px_0px_0px_rgba(0,0,0)] transition duration-200">
          Sketch Large
        </button>
      ),
      code: `<button className="px-6 py-3 rounded-md border border-black bg-white text-black text-base hover:shadow-[6px_6px_0px_0px_rgba(0,0,0)] transition duration-200">
  Sketch Large
</button>`
    },
    {
      name: "Colored",
      component: (
        <button className="px-4 py-2 rounded-md border border-blue-500 bg-white text-blue-500 text-sm hover:shadow-[4px_4px_0px_0px_rgba(59,130,246)] transition duration-200">
          Sketch Blue
        </button>
      ),
      code: `<button className="px-4 py-2 rounded-md border border-blue-500 bg-white text-blue-500 text-sm hover:shadow-[4px_4px_0px_0px_rgba(59,130,246)] transition duration-200">
  Sketch Blue
</button>`
    },
    {
      name: "Dark Mode",
      component: (
        <button className="px-4 py-2 rounded-md border border-white bg-black text-white text-sm hover:shadow-[4px_4px_0px_0px_rgba(255,255,255)] transition duration-200">
          Sketch Dark
        </button>
      ),
      code: `<button className="px-4 py-2 rounded-md border border-white bg-black text-white text-sm hover:shadow-[4px_4px_0px_0px_rgba(255,255,255)] transition duration-200">
  Sketch Dark
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
          <h1 className="text-4xl font-bold">Sketch Button</h1>
          <p className="text-muted-foreground text-lg">
            A clean, minimal button with a distinctive shadow effect that appears on hover, inspired by sketch-style design.
          </p>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="secondary">Minimal</Badge>
            <Badge variant="secondary">Shadow Effect</Badge>
            <Badge variant="secondary">Clean Design</Badge>
            <Badge variant="secondary">Hover Animation</Badge>
          </div>
        </div>
      </div>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>Hover over the button to see the shadow effect</CardDescription>
        </CardHeader>
        <div className="p-6">
          <div className="flex items-center justify-center h-32 bg-muted/50 rounded-lg">
            <button className="px-4 py-2 rounded-md border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200">
              Sketch
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
          <CardDescription>Different sizes and colors of the sketch button</CardDescription>
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

      {/* Properties */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Properties
          </CardTitle>
        </CardHeader>
        <div className="p-6 space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Shadow Effect</h3>
            <p className="text-sm text-muted-foreground">
              Uses <code>shadow-[4px_4px_0px_0px_rgba(0,0,0)]</code> to create a solid offset shadow that appears on hover.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Transition</h3>
            <p className="text-sm text-muted-foreground">
              Smooth 200ms transition for all properties when hovering.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Customization</h3>
            <p className="text-sm text-muted-foreground">
              Change border color, text color, and shadow color to match your brand. Adjust padding for different sizes.
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
            <li>Perfect for minimal, clean interfaces</li>
            <li>Works well on light backgrounds</li>
            <li>Great for call-to-action buttons that need subtle emphasis</li>
            <li>Pairs well with other sketch-style elements</li>
            <li>Responsive and touch-friendly</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}