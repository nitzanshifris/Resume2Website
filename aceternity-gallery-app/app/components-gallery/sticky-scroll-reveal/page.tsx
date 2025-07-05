"use client";

import React from "react";
import {
  StickyScrollRevealDemo,
  StickyScrollPortfolio,
  StickyScrollProduct,
  StickyScrollCustomStyling
} from "@/components/ui/sticky-scroll-reveal";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollText, Code2, Palette, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function StickyScrollRevealPage() {
  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <ScrollText className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Sticky Scroll Reveal</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          A sticky container component that reveals content based on scroll position. 
          Perfect for showcasing features, portfolio items, or step-by-step processes.
        </p>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary">Scroll Triggered</Badge>
          <Badge variant="secondary">Sticky Content</Badge>
          <Badge variant="secondary">Smooth Animations</Badge>
          <Badge variant="secondary">Dynamic Gradients</Badge>
        </div>
      </div>

      {/* Missing Asset Alert */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Note:</strong> The original demo references "/linear.webp" which doesn't exist. 
          The demos below use alternative content like SVG icons and gradient backgrounds. 
          Replace with your own images as needed.
        </AlertDescription>
      </Alert>

      {/* Demo Section */}
      <Card>
        <CardHeader>
          <CardTitle>Component Demos</CardTitle>
          <CardDescription>
            Explore different use cases and styling options for the Sticky Scroll Reveal component
          </CardDescription>
        </CardHeader>
        <div className="p-6">
          <Tabs defaultValue="default" className="w-full">
            <TabsList className="grid grid-cols-4 w-full max-w-2xl">
              <TabsTrigger value="default">Default</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="product">Product</TabsTrigger>
              <TabsTrigger value="custom">Custom Style</TabsTrigger>
            </TabsList>
            
            <TabsContent value="default" className="mt-6">
              <div className="rounded-lg overflow-hidden">
                <StickyScrollRevealDemo />
              </div>
            </TabsContent>
            
            <TabsContent value="portfolio" className="mt-6">
              <div className="rounded-lg overflow-hidden">
                <StickyScrollPortfolio />
              </div>
            </TabsContent>
            
            <TabsContent value="product" className="mt-6">
              <div className="rounded-lg overflow-hidden">
                <StickyScrollProduct />
              </div>
            </TabsContent>
            
            <TabsContent value="custom" className="mt-6">
              <div className="rounded-lg overflow-hidden">
                <StickyScrollCustomStyling />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Card>

      {/* Props Documentation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code2 className="h-5 w-5" />
            Props Documentation
          </CardTitle>
        </CardHeader>
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">content</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Array of content objects that define the sections. Each object should have title, description, and optional content.
              </p>
              <Badge variant="outline">required</Badge>
              <Badge variant="outline" className="ml-2">StickyScrollContent[]</Badge>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">contentClassName</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Optional className for the sticky content container on the right side.
              </p>
              <Badge variant="outline">optional</Badge>
              <Badge variant="outline" className="ml-2">string</Badge>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <h4 className="font-semibold">Content Object Structure:</h4>
            <pre className="bg-muted p-3 rounded-lg text-xs overflow-x-auto">
              <code>{`interface StickyScrollContent {
  title: string;        // Section heading
  description: string;  // Section description text
  content?: ReactNode;  // Visual content for sticky container
}`}</code>
            </pre>
          </div>
        </div>
      </Card>

      {/* Usage Example */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code2 className="h-5 w-5" />
            Usage Example
          </CardTitle>
        </CardHeader>
        <div className="p-6">
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
            <code className="text-sm">{`import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";

const content = [
  {
    title: "Feature One",
    description: "Detailed description of your first feature...",
    content: (
      <div className="flex h-full w-full items-center justify-center 
                      bg-gradient-to-br from-cyan-500 to-emerald-500 text-white">
        <span className="text-4xl">✨</span>
      </div>
    ),
  },
  {
    title: "Feature Two",
    description: "Explanation of your second feature...",
    content: (
      <div className="flex h-full w-full items-center justify-center 
                      bg-gradient-to-br from-purple-500 to-pink-500 text-white">
        <span className="text-4xl">🚀</span>
      </div>
    ),
  },
  // Add more sections...
];

export function FeatureShowcase() {
  return (
    <div className="w-full py-4">
      <StickyScroll 
        content={content}
        contentClassName="rounded-xl shadow-2xl"
      />
    </div>
  );
}`}</code>
          </pre>
        </div>
      </Card>

      {/* Styling Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Styling Guide
          </CardTitle>
        </CardHeader>
        <div className="p-6 space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Component Structure</h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Container height: <code className="bg-muted px-1 rounded">h-[30rem]</code> (30rem)</li>
              <li>Sticky content: Hidden on mobile, visible on large screens</li>
              <li>Background transitions between dark colors</li>
              <li>Content gradients cycle through predefined colors</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Content Styling Tips</h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Use <code className="bg-muted px-1 rounded">h-full w-full</code> for content containers</li>
              <li>Center content with <code className="bg-muted px-1 rounded">flex items-center justify-center</code></li>
              <li>Apply gradients with <code className="bg-muted px-1 rounded">bg-gradient-to-br</code></li>
              <li>Ensure good contrast for text visibility</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Customizing the Sticky Container</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Use the contentClassName prop to customize the sticky content appearance:
            </p>
            <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
              <code>{`// Add border and shadow
contentClassName="rounded-2xl border border-neutral-200 shadow-xl"

// Glass morphism effect
contentClassName="backdrop-blur-md bg-white/10 rounded-xl"

// Dark theme
contentClassName="bg-gray-900 border border-gray-800 rounded-lg"`}</code>
            </pre>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Animation Behavior</h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Active section: 100% opacity</li>
              <li>Inactive sections: 30% opacity</li>
              <li>Smooth transitions on scroll</li>
              <li>Background color animates between sections</li>
              <li>Gradient updates instantly on section change</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}