"use client";

import React from "react";
import { TextRevealCardPreview, TextRevealCardShort, TextRevealCardLong, TextRevealCardColorful, TextRevealCardMinimal } from "@/components/ui/text-reveal-card";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Code2, Palette, Layers, Zap, MousePointer, Sparkles } from "lucide-react";

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

export default function TextRevealCardPage() {
  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <CreditCard className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Text Reveal Card</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Mousemove effect to reveal text content at the bottom of the card. Features interactive text reveal with animated stars background.
        </p>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary">Mouse Tracking</Badge>
          <Badge variant="secondary">Text Reveal</Badge>
          <Badge variant="secondary">Animated Stars</Badge>
          <Badge variant="secondary">Touch Support</Badge>
        </div>
      </div>

      {/* Demo Section */}
      <Card>
        <CardHeader>
          <CardTitle>Component Demos</CardTitle>
          <CardDescription>
            Move your mouse across the cards to reveal the hidden text
          </CardDescription>
        </CardHeader>
        <div className="p-6">
          <TabsWrapper defaultValue="preview" className="w-full">
            <TabsList className="grid grid-cols-5 w-full max-w-2xl">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="short">Short</TabsTrigger>
              <TabsTrigger value="long">Long</TabsTrigger>
              <TabsTrigger value="colorful">Colorful</TabsTrigger>
              <TabsTrigger value="minimal">Minimal</TabsTrigger>
            </TabsList>
            
            <TabsContent value="preview" className="mt-6">
              <TextRevealCardPreview />
            </TabsContent>
            
            <TabsContent value="short" className="mt-6">
              <TextRevealCardShort />
            </TabsContent>
            
            <TabsContent value="long" className="mt-6">
              <TextRevealCardLong />
            </TabsContent>
            
            <TabsContent value="colorful" className="mt-6">
              <TextRevealCardColorful />
            </TabsContent>
            
            <TabsContent value="minimal" className="mt-6">
              <TextRevealCardMinimal />
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
                The static text that remains visible on the card. This text appears in a muted color.
              </p>
              <Badge variant="outline">required</Badge>
              <Badge variant="outline" className="ml-2">string</Badge>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">revealText</h3>
              <p className="text-sm text-muted-foreground mb-2">
                The text that is revealed when hovering/touching the card. This text appears with a gradient effect.
              </p>
              <Badge variant="outline">required</Badge>
              <Badge variant="outline" className="ml-2">string</Badge>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">children</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Content to display above the reveal area, typically TextRevealCardTitle and TextRevealCardDescription components.
              </p>
              <Badge variant="outline">optional</Badge>
              <Badge variant="outline" className="ml-2">ReactNode</Badge>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">className</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Additional CSS classes to apply to the card container for custom styling.
              </p>
              <Badge variant="outline">optional</Badge>
              <Badge variant="outline" className="ml-2">string</Badge>
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
            <code className="text-sm">{`import {
  TextRevealCard,
  TextRevealCardDescription,
  TextRevealCardTitle,
} from "@/components/ui/text-reveal-card";

export function MyComponent() {
  return (
    <div className="flex items-center justify-center bg-[#0E0E10] h-[40rem] rounded-2xl w-full">
      <TextRevealCard
        text="You know the business"
        revealText="I know the chemistry"
        className="w-[40rem]"
      >
        <TextRevealCardTitle>
          Sometimes, you just need to see it.
        </TextRevealCardTitle>
        <TextRevealCardDescription>
          This is a text reveal card. Hover over the card to reveal the hidden text.
        </TextRevealCardDescription>
      </TextRevealCard>
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
            <h3 className="font-semibold mb-2">Mouse Tracking</h3>
            <p className="text-sm text-muted-foreground">
              Tracks mouse position relative to the card and calculates percentage for the reveal effect. The reveal follows the cursor position in real-time.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Touch Support</h3>
            <p className="text-sm text-muted-foreground">
              Fully supports touch devices with touchstart, touchmove, and touchend events for mobile interaction.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Clip Path Animation</h3>
            <p className="text-sm text-muted-foreground">
              Uses CSS clip-path with inset values to create the reveal effect. The clip path adjusts based on mouse position.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Animated Background</h3>
            <p className="text-sm text-muted-foreground">
              Features 80 animated star particles that move continuously in the background, creating a dynamic starfield effect.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Reveal Indicator</h3>
            <p className="text-sm text-muted-foreground">
              A vertical gradient line follows the mouse position and rotates slightly based on movement for visual feedback.
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
            <h3 className="font-semibold mb-2">Default Colors</h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li><code>bg-[#1d1c20]</code> - Dark card background</li>
              <li><code>border-white/[0.08]</code> - Subtle border</li>
              <li><code>text-[#323238]</code> - Muted text color</li>
              <li><code>text-[#a9a9a9]</code> - Description text</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Text Styling</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Main text uses large size with gradient:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li><code>text-[3rem]</code> - Large text size on desktop</li>
              <li><code>bg-gradient-to-b from-white to-neutral-300</code> - Gradient text</li>
              <li><code>font-bold</code> - Bold font weight</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Container Sizing</h3>
            <p className="text-sm text-muted-foreground">
              Default width is <code>w-[40rem]</code>. Adjust with className prop for different sizes.
            </p>
          </div>
        </div>
      </Card>

      {/* Components Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Component Parts
          </CardTitle>
        </CardHeader>
        <div className="p-6 space-y-4">
          <div>
            <h3 className="font-semibold mb-2">TextRevealCard</h3>
            <p className="text-sm text-muted-foreground">
              Main container component that handles all interactions and animations.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">TextRevealCardTitle</h3>
            <p className="text-sm text-muted-foreground">
              Title component with white text and proper spacing. Use for headings.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">TextRevealCardDescription</h3>
            <p className="text-sm text-muted-foreground">
              Description component with muted text color. Use for supporting text.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">MemoizedStars</h3>
            <p className="text-sm text-muted-foreground">
              Animated star background component. Memoized for performance.
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
            <h3 className="font-semibold mb-2">Performance</h3>
            <p className="text-sm text-muted-foreground">
              Stars component is memoized to prevent unnecessary re-renders. Mouse tracking is optimized with will-change-transform.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Text Length</h3>
            <p className="text-sm text-muted-foreground">
              Works best with short to medium length text. Long text may overflow on smaller screens.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Accessibility</h3>
            <p className="text-sm text-muted-foreground">
              Both texts are accessible to screen readers. Consider adding aria-labels for better context.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Responsive Design</h3>
            <p className="text-sm text-muted-foreground">
              Text size adjusts with <code>sm:text-[3rem]</code>. Consider using smaller widths on mobile devices.
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
            <li>Interactive hero sections with hidden messages</li>
            <li>Product cards with reveal features</li>
            <li>Portfolio items with project details</li>
            <li>Marketing campaigns with engaging reveals</li>
            <li>Educational content with answers on hover</li>
            <li>Creative presentations and showcases</li>
            <li>Landing pages with interactive elements</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}