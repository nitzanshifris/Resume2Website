"use client";

import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Copy, Code2, Palette, Zap } from "lucide-react";
import { toast, Toaster } from "sonner";

export default function GradientButtonPage() {
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

  const buttonCode = `<button className="px-8 py-2 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200">
  Gradient
</button>`;

  const variants = [
    {
      name: "Default Blue",
      component: (
        <button className="px-8 py-2 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200">
          Gradient
        </button>
      ),
      code: buttonCode
    },
    {
      name: "Purple Gradient",
      component: (
        <button className="px-8 py-2 rounded-full bg-gradient-to-b from-purple-500 to-purple-600 text-white focus:ring-2 focus:ring-purple-400 hover:shadow-xl transition duration-200">
          Purple
        </button>
      ),
      code: `<button className="px-8 py-2 rounded-full bg-gradient-to-b from-purple-500 to-purple-600 text-white focus:ring-2 focus:ring-purple-400 hover:shadow-xl transition duration-200">
  Purple
</button>`
    },
    {
      name: "Green Gradient",
      component: (
        <button className="px-8 py-2 rounded-full bg-gradient-to-b from-green-500 to-green-600 text-white focus:ring-2 focus:ring-green-400 hover:shadow-xl transition duration-200">
          Green
        </button>
      ),
      code: `<button className="px-8 py-2 rounded-full bg-gradient-to-b from-green-500 to-green-600 text-white focus:ring-2 focus:ring-green-400 hover:shadow-xl transition duration-200">
  Green
</button>`
    },
    {
      name: "Multi-Color",
      component: (
        <button className="px-8 py-2 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white focus:ring-2 focus:ring-purple-400 hover:shadow-xl transition duration-200">
          Rainbow
        </button>
      ),
      code: `<button className="px-8 py-2 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white focus:ring-2 focus:ring-purple-400 hover:shadow-xl transition duration-200">
  Rainbow
</button>`
    },
    {
      name: "Diagonal Gradient",
      component: (
        <button className="px-8 py-2 rounded-full bg-gradient-to-br from-orange-400 to-red-500 text-white focus:ring-2 focus:ring-orange-400 hover:shadow-xl transition duration-200">
          Diagonal
        </button>
      ),
      code: `<button className="px-8 py-2 rounded-full bg-gradient-to-br from-orange-400 to-red-500 text-white focus:ring-2 focus:ring-orange-400 hover:shadow-xl transition duration-200">
  Diagonal
</button>`
    },
    {
      name: "Small Size",
      component: (
        <button className="px-4 py-1 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 text-white text-sm focus:ring-2 focus:ring-blue-400 hover:shadow-lg transition duration-200">
          Small
        </button>
      ),
      code: `<button className="px-4 py-1 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 text-white text-sm focus:ring-2 focus:ring-blue-400 hover:shadow-lg transition duration-200">
  Small
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
          <h1 className="text-4xl font-bold">Gradient Button</h1>
          <p className="text-muted-foreground text-lg">
            A modern button with a smooth gradient background and rounded corners, perfect for call-to-action elements.
          </p>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="secondary">Gradient</Badge>
            <Badge variant="secondary">Rounded</Badge>
            <Badge variant="secondary">Modern</Badge>
            <Badge variant="secondary">Focus Ring</Badge>
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
            <button className="px-8 py-2 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200">
              Gradient
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
          <CardDescription>Different gradient directions and colors</CardDescription>
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

      {/* Gradient Directions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Gradient Directions
          </CardTitle>
        </CardHeader>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">bg-gradient-to-b</h3>
              <p className="text-sm text-muted-foreground">Top to bottom gradient</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">bg-gradient-to-r</h3>
              <p className="text-sm text-muted-foreground">Left to right gradient</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">bg-gradient-to-br</h3>
              <p className="text-sm text-muted-foreground">Top-left to bottom-right diagonal</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">bg-gradient-to-bl</h3>
              <p className="text-sm text-muted-foreground">Top-right to bottom-left diagonal</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Properties */}
      <Card>
        <CardHeader>
          <CardTitle>Key Features</CardTitle>
        </CardHeader>
        <div className="p-6 space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Smooth Gradient</h3>
            <p className="text-sm text-muted-foreground">
              Uses Tailwind's gradient utilities to create smooth color transitions.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Focus Ring</h3>
            <p className="text-sm text-muted-foreground">
              Includes accessibility-friendly focus ring that appears when navigating with keyboard.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Hover Effect</h3>
            <p className="text-sm text-muted-foreground">
              Shadow increases on hover to provide visual feedback.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Rounded Design</h3>
            <p className="text-sm text-muted-foreground">
              Full border radius creates a pill-shaped button that feels modern and friendly.
            </p>
          </div>
        </div>
      </Card>

      {/* Customization */}
      <Card>
        <CardHeader>
          <CardTitle>Customization Guide</CardTitle>
        </CardHeader>
        <div className="p-6 space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Change Colors</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Replace the color classes to match your brand:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li><code>from-blue-500 to-blue-600</code> → <code>from-purple-500 to-purple-600</code></li>
              <li><code>focus:ring-blue-400</code> → <code>focus:ring-purple-400</code></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Adjust Size</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Modify padding to change button size:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Small: <code>px-4 py-1</code></li>
              <li>Medium: <code>px-6 py-2</code></li>
              <li>Large: <code>px-8 py-3</code></li>
            </ul>
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
            <li>Perfect for primary call-to-action buttons</li>
            <li>Works well on both light and dark backgrounds</li>
            <li>Gradients add visual interest without being overwhelming</li>
            <li>The rounded shape feels friendly and approachable</li>
            <li>Focus ring ensures keyboard accessibility</li>
            <li>Use consistently with your brand colors</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}