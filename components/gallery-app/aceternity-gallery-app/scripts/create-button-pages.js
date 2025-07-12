const fs = require('fs');
const path = require('path');

// Button data
const buttons = [
  {
    name: "Simple",
    slug: "simple",
    description: "Elegant button for your website",
    component: `<button className="px-4 py-2 rounded-md border border-neutral-300 bg-neutral-100 text-neutral-500 text-sm hover:-translate-y-1 transform transition duration-200 hover:shadow-md">
  Simple
</button>`,
    category: "Minimal",
    features: ["Hover Animation", "Clean Design", "Transform Effect"]
  },
  {
    name: "Invert",
    slug: "invert",
    description: "Simple button that inverts on hover",
    component: `<button className="px-8 py-2 rounded-md bg-teal-500 text-white font-bold transition duration-200 hover:bg-white hover:text-black border-2 border-transparent hover:border-teal-500">
  Invert it
</button>`,
    category: "Interactive",
    features: ["Color Inversion", "Border Animation", "Smooth Transition"]
  },
  {
    name: "Unapologetic",
    slug: "unapologetic",
    description: "Unapologetic button with perfect corners",
    component: `<button className="px-8 py-2 border border-black bg-transparent text-black  dark:border-white relative group transition duration-200">
  <div className="absolute -bottom-2 -right-2 bg-yellow-300 h-full w-full -z-10 group-hover:bottom-0 group-hover:right-0 transition-all duration-200" />
  <span className="relative">Unapologetic</span>
</button>`,
    category: "Creative",
    features: ["Shadow Animation", "Bold Design", "Hover Effect"]
  },
  {
    name: "Lit up borders",
    slug: "lit-up-borders",
    description: "Gradient button with perfect corners",
    component: `<button className="p-[3px] relative">
  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
  <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
    Lit up borders
  </div>
</button>`,
    category: "Gradient",
    features: ["Gradient Border", "Layered Design", "Modern Look"]
  },
  {
    name: "Border Magic",
    slug: "border-magic",
    description: "Border Magic button for your website",
    component: `<button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
  <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
    Border Magic
  </span>
</button>`,
    category: "Animated",
    features: ["Spinning Border", "Conic Gradient", "Magic Effect"]
  },
  {
    name: "Brutal",
    slug: "brutal",
    description: "Brutal button for your website",
    component: `<button className="px-8 py-0.5  border-2 border-black dark:border-white uppercase bg-white text-black transition duration-200 text-sm shadow-[1px_1px_rgba(0,0,0),2px_2px_rgba(0,0,0),3px_3px_rgba(0,0,0),4px_4px_rgba(0,0,0),5px_5px_0px_0px_rgba(0,0,0)] dark:shadow-[1px_1px_rgba(255,255,255),2px_2px_rgba(255,255,255),3px_3px_rgba(255,255,255),4px_4px_rgba(255,255,255),5px_5px_0px_0px_rgba(255,255,255)] ">
  Brutal
</button>`,
    category: "Bold",
    features: ["Stacked Shadows", "Brutal Design", "Dark Mode Support"]
  },
  {
    name: "Favourite",
    slug: "favourite",
    description: "Favourite button for your website",
    component: `<button className="px-8 py-2  bg-black text-white text-sm rounded-md font-semibold hover:bg-black/[0.8] hover:shadow-lg">
  Favourite
</button>`,
    category: "Classic",
    features: ["Simple Hover", "Clean Design", "Versatile"]
  },
  {
    name: "Outline",
    slug: "outline",
    description: "Outline button for your website",
    component: `<button className="px-4 py-2 rounded-xl border border-neutral-600 text-black bg-white hover:bg-gray-100 transition duration-200">
  Outline
</button>`,
    category: "Minimal",
    features: ["Outline Style", "Subtle Hover", "Minimal Design"]
  }
];

// Template for button page
const createButtonPageTemplate = (button) => `"use client";

import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Copy, Code2, Palette, Zap } from "lucide-react";
import { toast, Toaster } from "sonner";

export default function ${button.name.replace(/[^a-zA-Z0-9]/g, '')}ButtonPage() {
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

  const buttonCode = \`${button.component}\`;

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
          <h1 className="text-4xl font-bold">${button.name} Button</h1>
          <p className="text-muted-foreground text-lg">
            ${button.description}
          </p>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="secondary">${button.category}</Badge>
            ${button.features.map(feature => `<Badge variant="secondary">${feature}</Badge>`).join('\n            ')}
          </div>
        </div>
      </div>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>Interactive preview of the ${button.name.toLowerCase()} button</CardDescription>
        </CardHeader>
        <div className="p-6">
          <div className="flex items-center justify-center h-32 bg-muted/50 rounded-lg">
            ${button.component.replace(/\n/g, '\n            ')}
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

      {/* Usage */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Tips</CardTitle>
        </CardHeader>
        <div className="p-6 space-y-4">
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li>Perfect for ${button.category.toLowerCase()} interfaces</li>
            <li>Works well in various contexts</li>
            <li>Responsive and touch-friendly</li>
            <li>Follows modern design principles</li>
            <li>Easy to customize and extend</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}`;

// Create directories and files
const buttonsDir = path.join(__dirname, '../app/buttons');

buttons.forEach(button => {
  const buttonDir = path.join(buttonsDir, button.slug);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(buttonDir)) {
    fs.mkdirSync(buttonDir, { recursive: true });
  }
  
  // Create page.tsx file
  const pageContent = createButtonPageTemplate(button);
  fs.writeFileSync(path.join(buttonDir, 'page.tsx'), pageContent);
  
  console.log(`Created page for ${button.name} button`);
});

console.log('All button pages created successfully!');