"use client";

import React from "react";
import {
  SpotlightNewDemo,
  SpotlightCustomColors,
  SpotlightFast,
  SpotlightSubtle,
  SpotlightLarge
} from "@/components/ui/spotlight-new";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Flashlight, Code2, Palette } from "lucide-react";

export default function SpotlightNewPage() {
  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Flashlight className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Spotlight New</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          A new and improved spotlight effect with animated left and right spotlights 
          that create a dynamic lighting effect. More subtle and sophisticated than 
          the traditional spotlight.
        </p>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary">Dual Spotlights</Badge>
          <Badge variant="secondary">Smooth Animation</Badge>
          <Badge variant="secondary">Customizable Gradients</Badge>
          <Badge variant="secondary">Adjustable Speed</Badge>
        </div>
      </div>

      {/* Demo Section */}
      <Card>
        <CardHeader>
          <CardTitle>Component Demos</CardTitle>
          <CardDescription>
            Explore different variants and configurations of the new Spotlight component
          </CardDescription>
        </CardHeader>
        <div className="p-6">
          <Tabs defaultValue="default" className="w-full">
            <TabsList className="grid grid-cols-5 w-full max-w-2xl">
              <TabsTrigger value="default">Default</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
              <TabsTrigger value="fast">Fast</TabsTrigger>
              <TabsTrigger value="subtle">Subtle</TabsTrigger>
              <TabsTrigger value="large">Large</TabsTrigger>
            </TabsList>
            
            <TabsContent value="default" className="mt-6">
              <div className="rounded-lg overflow-hidden">
                <SpotlightNewDemo />
              </div>
            </TabsContent>
            
            <TabsContent value="custom" className="mt-6">
              <div className="rounded-lg overflow-hidden">
                <SpotlightCustomColors />
              </div>
            </TabsContent>
            
            <TabsContent value="fast" className="mt-6">
              <div className="rounded-lg overflow-hidden">
                <SpotlightFast />
              </div>
            </TabsContent>
            
            <TabsContent value="subtle" className="mt-6">
              <div className="rounded-lg overflow-hidden">
                <SpotlightSubtle />
              </div>
            </TabsContent>
            
            <TabsContent value="large" className="mt-6">
              <div className="rounded-lg overflow-hidden">
                <SpotlightLarge />
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
              <h3 className="font-semibold mb-2">gradientFirst / gradientSecond / gradientThird</h3>
              <p className="text-sm text-muted-foreground mb-2">
                CSS gradient strings for the three spotlight layers. Use radial-gradient() for best results.
              </p>
              <Badge variant="outline">optional</Badge>
              <Badge variant="outline" className="ml-2">string</Badge>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">translateY</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Vertical translation offset in pixels. Negative values move the spotlights up.
              </p>
              <Badge variant="outline">optional</Badge>
              <Badge variant="outline" className="ml-2">number</Badge>
              <Badge variant="outline" className="ml-2">default: -350</Badge>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">width / height / smallWidth</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Dimensions of the spotlight elements in pixels.
              </p>
              <Badge variant="outline">optional</Badge>
              <Badge variant="outline" className="ml-2">number</Badge>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">duration</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Animation duration in seconds for one complete cycle.
              </p>
              <Badge variant="outline">optional</Badge>
              <Badge variant="outline" className="ml-2">number</Badge>
              <Badge variant="outline" className="ml-2">default: 7</Badge>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">xOffset</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Horizontal animation offset in pixels. Higher values create wider movement.
              </p>
              <Badge variant="outline">optional</Badge>
              <Badge variant="outline" className="ml-2">number</Badge>
              <Badge variant="outline" className="ml-2">default: 100</Badge>
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
            <code className="text-sm">{`import { Spotlight } from "@/components/ui/spotlight-new";

export function HeroSection() {
  return (
    <div className="relative h-screen bg-black overflow-hidden">
      <Spotlight 
        duration={5}
        xOffset={150}
        gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(220, 100%, 85%, .1) 0, hsla(220, 100%, 55%, .03) 50%, hsla(220, 100%, 45%, 0) 80%)"
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
            <h3 className="font-semibold mb-2">Creating Custom Gradients</h3>
            <p className="text-sm text-muted-foreground mb-2">
              The spotlight uses radial gradients. Here's the anatomy:
            </p>
            <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
              <code>{`radial-gradient(
  68.54% 68.72% at 55.02% 31.46%,  // Size and position
  hsla(210, 100%, 85%, .08) 0,      // Start color with opacity
  hsla(210, 100%, 55%, .02) 50%,    // Mid color
  hsla(210, 100%, 45%, 0) 80%       // End color (transparent)
)`}</code>
            </pre>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Color Variations</h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Blue (default): <code className="bg-muted px-1 rounded">hsla(210, 100%, 85%, .08)</code></li>
              <li>Purple: <code className="bg-muted px-1 rounded">hsla(280, 100%, 85%, .08)</code></li>
              <li>Green: <code className="bg-muted px-1 rounded">hsla(120, 100%, 85%, .08)</code></li>
              <li>Red: <code className="bg-muted px-1 rounded">hsla(0, 100%, 85%, .08)</code></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Background Requirements</h3>
            <p className="text-sm text-muted-foreground">
              The spotlight effect works best with:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Dark backgrounds (<code className="bg-muted px-1 rounded">bg-black</code> or similar)</li>
              <li>Container with <code className="bg-muted px-1 rounded">relative overflow-hidden</code></li>
              <li>Content with higher z-index (<code className="bg-muted px-1 rounded">z-10</code> or above)</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Animation Tips</h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Lower duration (3-5s) for energetic feel</li>
              <li>Higher duration (8-12s) for calm ambiance</li>
              <li>Adjust xOffset based on container width</li>
              <li>Use subtle opacity values for professional look</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}