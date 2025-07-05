"use client";

import React from "react";
import { TextGenerateEffectDemo, TextGenerateEffectWithoutFilter, TextGenerateEffectFast, TextGenerateEffectSlow, TextGenerateEffectShort } from "@/components/ui/text-generate-effect";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Type, Code2, Palette, Layers, Zap } from "lucide-react";

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

export default function TextGenerateEffectPage() {
  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Type className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Text Generate Effect</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          A cool text effect that fades in text on page load, one by one. Perfect for hero sections and content reveals.
        </p>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary">Text Animation</Badge>
          <Badge variant="secondary">Blur Effect</Badge>
          <Badge variant="secondary">Stagger Animation</Badge>
          <Badge variant="secondary">Customizable</Badge>
        </div>
      </div>

      {/* Demo Section */}
      <Card>
        <CardHeader>
          <CardTitle>Component Demos</CardTitle>
          <CardDescription>
            Explore different variations of the text generate effect
          </CardDescription>
        </CardHeader>
        <div className="p-6">
          <TabsWrapper defaultValue="default" className="w-full">
            <TabsList className="grid grid-cols-5 w-full max-w-2xl">
              <TabsTrigger value="default">Default</TabsTrigger>
              <TabsTrigger value="no-filter">No Filter</TabsTrigger>
              <TabsTrigger value="fast">Fast</TabsTrigger>
              <TabsTrigger value="slow">Slow</TabsTrigger>
              <TabsTrigger value="short">Short</TabsTrigger>
            </TabsList>
            
            <TabsContent value="default" className="mt-6">
              <div className="min-h-[200px] flex items-center justify-center bg-muted/50 rounded-lg p-8">
                <TextGenerateEffectDemo />
              </div>
            </TabsContent>
            
            <TabsContent value="no-filter" className="mt-6">
              <div className="min-h-[200px] flex items-center justify-center bg-muted/50 rounded-lg p-8">
                <TextGenerateEffectWithoutFilter />
              </div>
            </TabsContent>
            
            <TabsContent value="fast" className="mt-6">
              <div className="min-h-[200px] flex items-center justify-center bg-muted/50 rounded-lg p-8">
                <TextGenerateEffectFast />
              </div>
            </TabsContent>
            
            <TabsContent value="slow" className="mt-6">
              <div className="min-h-[200px] flex items-center justify-center bg-muted/50 rounded-lg p-8">
                <TextGenerateEffectSlow />
              </div>
            </TabsContent>
            
            <TabsContent value="short" className="mt-6">
              <div className="min-h-[200px] flex items-center justify-center bg-muted/50 rounded-lg p-8">
                <TextGenerateEffectShort />
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
              <h3 className="font-semibold mb-2">words</h3>
              <p className="text-sm text-muted-foreground mb-2">
                The word string that you want to animate. Words are split by spaces and animated individually.
              </p>
              <Badge variant="outline">required</Badge>
              <Badge variant="outline" className="ml-2">string</Badge>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">className</h3>
              <p className="text-sm text-muted-foreground mb-2">
                The class name of the child component for custom styling.
              </p>
              <Badge variant="outline">optional</Badge>
              <Badge variant="outline" className="ml-2">string</Badge>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">duration</h3>
              <p className="text-sm text-muted-foreground mb-2">
                The duration of each word's animation in seconds. Default is 0.5.
              </p>
              <Badge variant="outline">optional</Badge>
              <Badge variant="outline" className="ml-2">number</Badge>
              <Badge variant="outline" className="ml-2">default: 0.5</Badge>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">filter</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Whether to apply a blur filter effect during animation. Default is true.
              </p>
              <Badge variant="outline">optional</Badge>
              <Badge variant="outline" className="ml-2">boolean</Badge>
              <Badge variant="outline" className="ml-2">default: true</Badge>
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
            <code className="text-sm">{`import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

const words = "Your amazing text content that will animate beautifully";

export function MyComponent() {
  return (
    <div className="max-w-4xl mx-auto">
      <TextGenerateEffect 
        words={words}
        duration={0.8}
        filter={true}
        className="text-center"
      />
    </div>
  );
}`}</code>
          </pre>
        </div>
      </Card>

      {/* Animation Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Animation Details
          </CardTitle>
        </CardHeader>
        <div className="p-6 space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Stagger Effect</h3>
            <p className="text-sm text-muted-foreground">
              Words appear one after another with a 0.2-second delay between each word, creating a smooth staggered animation.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Blur Filter</h3>
            <p className="text-sm text-muted-foreground">
              When enabled, words start with a 10px blur and animate to sharp focus as they appear.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Opacity Transition</h3>
            <p className="text-sm text-muted-foreground">
              All words start with opacity 0 and fade in to full opacity during the animation.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Motion Integration</h3>
            <p className="text-sm text-muted-foreground">
              Uses Framer Motion's useAnimate hook for precise control over the animation timing and effects.
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
              Default styling includes:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li><code>font-bold</code> - Bold font weight</li>
              <li><code>text-2xl</code> - Large text size</li>
              <li><code>leading-snug</code> - Tight line height</li>
              <li><code>tracking-wide</code> - Increased letter spacing</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Dark Mode Support</h3>
            <p className="text-sm text-muted-foreground">
              Automatically adapts to dark mode with <code>dark:text-white text-black</code> classes.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Custom Styling</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Override default styles by passing a custom className:
            </p>
            <code className="text-sm bg-muted p-2 rounded">
              className="text-4xl text-blue-500 font-light"
            </code>
          </div>
        </div>
      </Card>

      {/* Performance Notes */}
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
              Works best with 10-50 words. Very long text may cause performance issues or overwhelm users.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Animation Timing</h3>
            <p className="text-sm text-muted-foreground">
              Adjust duration based on text length. Shorter text can use faster animations (0.3s), longer text benefits from slower timing (0.8s+).
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Accessibility</h3>
            <p className="text-sm text-muted-foreground">
              Consider users with motion sensitivity. Provide options to disable animations when prefers-reduced-motion is set.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">SEO Considerations</h3>
            <p className="text-sm text-muted-foreground">
              Text content is fully accessible to search engines and screen readers, maintaining good SEO practices.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}