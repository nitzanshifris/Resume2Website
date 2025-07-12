"use client";

import React from "react";
import {
  SpotlightDemo,
  SpotlightPrimary,
  SpotlightCustomPosition,
  SpotlightMultiple,
  SpotlightSubtle
} from "@/components/ui/spotlight";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Flashlight, Code2, Palette } from "lucide-react";

export default function SpotlightPage() {
  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Flashlight className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Spotlight</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          An SVG-based spotlight effect that creates a dramatic lighting animation 
          to highlight content. Perfect for hero sections and feature highlights.
        </p>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary">SVG Animation</Badge>
          <Badge variant="secondary">Customizable Colors</Badge>
          <Badge variant="secondary">Positioning Control</Badge>
          <Badge variant="secondary">Multiple Spotlights</Badge>
        </div>
      </div>

      {/* Demo Section */}
      <Card>
        <CardHeader>
          <CardTitle>Component Demos</CardTitle>
          <CardDescription>
            Explore different variants and configurations of the Spotlight component
          </CardDescription>
        </CardHeader>
        <div className="p-6">
          <Tabs defaultValue="default" className="w-full">
            <TabsList className="grid grid-cols-5 w-full max-w-2xl">
              <TabsTrigger value="default">Default</TabsTrigger>
              <TabsTrigger value="primary">Primary</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
              <TabsTrigger value="multiple">Multiple</TabsTrigger>
              <TabsTrigger value="subtle">Subtle</TabsTrigger>
            </TabsList>
            
            <TabsContent value="default" className="mt-6">
              <div className="rounded-lg overflow-hidden">
                <SpotlightDemo />
              </div>
            </TabsContent>
            
            <TabsContent value="primary" className="mt-6">
              <div className="rounded-lg overflow-hidden">
                <SpotlightPrimary />
              </div>
            </TabsContent>
            
            <TabsContent value="custom" className="mt-6">
              <div className="rounded-lg overflow-hidden">
                <SpotlightCustomPosition />
              </div>
            </TabsContent>
            
            <TabsContent value="multiple" className="mt-6">
              <div className="rounded-lg overflow-hidden">
                <SpotlightMultiple />
              </div>
            </TabsContent>
            
            <TabsContent value="subtle" className="mt-6">
              <div className="rounded-lg overflow-hidden">
                <SpotlightSubtle />
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
              <h3 className="font-semibold mb-2">className</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Additional CSS classes to apply to the spotlight SVG. Use this to control positioning and animation.
              </p>
              <Badge variant="outline">optional</Badge>
              <Badge variant="outline" className="ml-2">string</Badge>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">fill</h3>
              <p className="text-sm text-muted-foreground mb-2">
                The fill color for the spotlight effect. Can be any valid CSS color value.
              </p>
              <Badge variant="outline">optional</Badge>
              <Badge variant="outline" className="ml-2">string</Badge>
              <Badge variant="outline" className="ml-2">default: "white"</Badge>
            </div>
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
            <code className="text-sm">{`import { Spotlight } from "@/components/ui/spotlight";

export function HeroSection() {
  return (
    <div className="relative h-screen bg-black overflow-hidden">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      <div className="relative z-10 h-full flex items-center justify-center">
        <h1 className="text-6xl font-bold text-white">
          Your Hero Content
        </h1>
      </div>
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
            <h3 className="font-semibold mb-2">Positioning</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Use Tailwind classes to position the spotlight. Common patterns:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li><code className="bg-muted px-1 rounded">-top-40 left-0</code> - Top left corner</li>
              <li><code className="bg-muted px-1 rounded">-top-40 right-0</code> - Top right corner</li>
              <li><code className="bg-muted px-1 rounded">md:left-60 md:-top-20</code> - Responsive positioning</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Color Options</h3>
            <p className="text-sm text-muted-foreground mb-2">
              The fill prop accepts any valid CSS color:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Named colors: <code className="bg-muted px-1 rounded">"white"</code>, <code className="bg-muted px-1 rounded">"blue"</code></li>
              <li>Hex colors: <code className="bg-muted px-1 rounded">"#3B82F6"</code></li>
              <li>RGB/RGBA: <code className="bg-muted px-1 rounded">"rgb(59, 130, 246)"</code></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Background Requirements</h3>
            <p className="text-sm text-muted-foreground">
              The spotlight effect works best on dark backgrounds. Consider using:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li><code className="bg-muted px-1 rounded">bg-black</code> or <code className="bg-muted px-1 rounded">bg-black/[0.96]</code></li>
              <li>Grid patterns: <code className="bg-muted px-1 rounded">bg-grid-white/[0.02]</code></li>
              <li>Ensure parent has <code className="bg-muted px-1 rounded">relative overflow-hidden</code></li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}