"use client";

import React from "react";
import { TextHoverEffectDemo, TextHoverEffectCustom, TextHoverEffectShort, TextHoverEffectLong, TextHoverEffectSlow } from "@/components/ui/text-hover-effect";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Type, Code2, Palette, Layers, Zap, MousePointer } from "lucide-react";

// Import shadcn tabs components separately
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

// Simple Tabs wrapper for the gallery
function TabsWrapper({ children, className, ...props }: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root className={cn("w-full", className)} {...props}>
      {children}
    </TabsPrimitive.Root>
  );
}

function TabsList({ children, className, ...props }: React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </TabsPrimitive.List>
  );
}

function TabsTrigger({ children, className, ...props }: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </TabsPrimitive.Trigger>
  );
}

function TabsContent({ children, className, ...props }: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      {...props}
    >
      {children}
    </TabsPrimitive.Content>
  );
}

export default function TextHoverEffectPage() {
  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MousePointer className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Text Hover Effect</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          A text hover effect that animates and outlines gradient on hover, as seen on x.ai. Features SVG animations and gradient reveals.
        </p>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary">Hover Effect</Badge>
          <Badge variant="secondary">SVG Animation</Badge>
          <Badge variant="secondary">Gradient Reveal</Badge>
          <Badge variant="secondary">Mouse Tracking</Badge>
        </div>
      </div>

      {/* Demo Section */}
      <Card>
        <CardHeader>
          <CardTitle>Component Demos</CardTitle>
          <CardDescription>
            Hover over the text to see the gradient reveal effect following your cursor
          </CardDescription>
        </CardHeader>
        <div className="p-6">
          <TabsWrapper defaultValue="default" className="w-full">
            <TabsList className="grid grid-cols-5 w-full max-w-2xl">
              <TabsTrigger value="default">Default</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
              <TabsTrigger value="short">Short</TabsTrigger>
              <TabsTrigger value="long">Long</TabsTrigger>
              <TabsTrigger value="slow">Slow</TabsTrigger>
            </TabsList>
            
            <TabsContent value="default" className="mt-6">
              <div className="bg-muted/50 rounded-lg">
                <TextHoverEffectDemo />
              </div>
            </TabsContent>
            
            <TabsContent value="custom" className="mt-6">
              <div className="bg-muted/50 rounded-lg">
                <TextHoverEffectCustom />
              </div>
            </TabsContent>
            
            <TabsContent value="short" className="mt-6">
              <div className="bg-muted/50 rounded-lg">
                <TextHoverEffectShort />
              </div>
            </TabsContent>
            
            <TabsContent value="long" className="mt-6">
              <div className="bg-muted/50 rounded-lg">
                <TextHoverEffectLong />
              </div>
            </TabsContent>
            
            <TabsContent value="slow" className="mt-6">
              <div className="bg-muted/50 rounded-lg">
                <TextHoverEffectSlow />
              </div>
            </TabsContent>
          </TabsWrapper>
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
              <h3 className="font-semibold mb-2">text</h3>
              <p className="text-sm text-muted-foreground mb-2">
                The text to be displayed with the hover effect. Works best with short text or acronyms.
              </p>
              <Badge variant="outline">required</Badge>
              <Badge variant="outline" className="ml-2">string</Badge>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">duration</h3>
              <p className="text-sm text-muted-foreground mb-2">
                The duration of the mask transition animation in seconds. Controls how quickly the gradient follows the cursor.
              </p>
              <Badge variant="outline">optional</Badge>
              <Badge variant="outline" className="ml-2">number</Badge>
              <Badge variant="outline" className="ml-2">default: 0</Badge>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">automatic</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Whether to automatically start the animation. Currently not implemented in the provided code.
              </p>
              <Badge variant="outline">optional</Badge>
              <Badge variant="outline" className="ml-2">boolean</Badge>
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
            <code className="text-sm">{`import { TextHoverEffect } from "@/components/ui/text-hover-effect";

export function MyComponent() {
  return (
    <div className="h-[40rem] flex items-center justify-center">
      <TextHoverEffect 
        text="HOVER" 
        duration={0.3}
      />
    </div>
  );
}`}</code>
          </pre>
        </div>
      </Card>

      {/* Technical Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Technical Details
          </CardTitle>
        </CardHeader>
        <div className="p-6 space-y-4">
          <div>
            <h3 className="font-semibold mb-2">SVG-Based Animation</h3>
            <p className="text-sm text-muted-foreground">
              Uses SVG elements with masks and gradients to create the reveal effect. The gradient follows mouse movement in real-time.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Gradient Colors</h3>
            <p className="text-sm text-muted-foreground mb-2">
              The gradient includes five vibrant colors:
            </p>
            <div className="flex gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className="text-xs">Yellow (#eab308)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-xs">Red (#ef4444)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-xs">Blue (#3b82f6)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-cyan-500 rounded"></div>
                <span className="text-xs">Cyan (#06b6d4)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-violet-500 rounded"></div>
                <span className="text-xs">Violet (#8b5cf6)</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Mouse Tracking</h3>
            <p className="text-sm text-muted-foreground">
              Tracks mouse position and converts it to SVG coordinates for the radial gradient mask positioning.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Stroke Animation</h3>
            <p className="text-sm text-muted-foreground">
              Features a stroke dash animation that draws the text outline over 4 seconds with easeInOut timing.
            </p>
          </div>
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
            <h3 className="font-semibold mb-2">Typography</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Uses system fonts with fallback:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li><code>font-[helvetica]</code> - Helvetica font family</li>
              <li><code>text-7xl</code> - Large text size</li>
              <li><code>font-bold</code> - Bold font weight</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Container Requirements</h3>
            <p className="text-sm text-muted-foreground mb-2">
              For optimal display:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Use a container with defined height (e.g., h-[40rem])</li>
              <li>Center the component with flex layout</li>
              <li>Ensure adequate spacing around the text</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Responsive Considerations</h3>
            <p className="text-sm text-muted-foreground">
              The SVG scales with container size. Consider adjusting container height on mobile devices for better fit.
            </p>
          </div>
        </div>
      </Card>

      {/* Performance & Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Performance & Best Practices
          </CardTitle>
        </CardHeader>
        <div className="p-6 space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Text Length</h3>
            <p className="text-sm text-muted-foreground">
              Works best with 1-8 characters. Longer text may not fit well in the SVG viewBox.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Performance</h3>
            <p className="text-sm text-muted-foreground">
              Mouse tracking updates on every mousemove event. Consider throttling for performance-critical applications.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Accessibility</h3>
            <p className="text-sm text-muted-foreground">
              Text content is accessible to screen readers. Consider providing alternative text for users who cannot see the animation.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Browser Support</h3>
            <p className="text-sm text-muted-foreground">
              Requires modern browsers with SVG mask and gradient support. Works in all current browsers.
            </p>
          </div>
        </div>
      </Card>

      {/* Use Cases */}
      <Card>
        <CardHeader>
          <CardTitle>Common Use Cases</CardTitle>
        </CardHeader>
        <div className="p-6 space-y-4">
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li>Hero section headings and brand names</li>
            <li>Logo animations and interactive branding</li>
            <li>Call-to-action elements that need attention</li>
            <li>Portfolio headers and creative showcases</li>
            <li>Landing page focal points</li>
            <li>Interactive text elements in modern web applications</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}