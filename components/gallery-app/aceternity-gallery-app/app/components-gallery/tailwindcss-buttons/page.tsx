"use client";

import React from "react";
import { TailwindcssButtons, TailwindcssButtonsMinimal, TailwindcssButtonsGradient, TailwindcssButtonsAnimated } from "@/components/ui/tailwindcss-buttons";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code2, Palette, Layers, Mouse } from "lucide-react";

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

export default function TailwindcssButtonsPage() {
  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Mouse className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Tailwind CSS Buttons</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          A curated list of awesome, battle tested Tailwind CSS buttons components. Click any button to copy its code.
        </p>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary">Copy to Clipboard</Badge>
          <Badge variant="secondary">20+ Variants</Badge>
          <Badge variant="secondary">Hover Effects</Badge>
          <Badge variant="secondary">Responsive</Badge>
        </div>
      </div>

      {/* Demo Section */}
      <Card>
        <CardHeader>
          <CardTitle>Component Demos</CardTitle>
          <CardDescription>
            Explore different variations of beautiful Tailwind CSS buttons
          </CardDescription>
        </CardHeader>
        <div className="p-6">
          <TabsWrapper defaultValue="all" className="w-full">
            <TabsList className="grid grid-cols-4 w-full max-w-2xl">
              <TabsTrigger value="all">All Buttons</TabsTrigger>
              <TabsTrigger value="minimal">Minimal</TabsTrigger>
              <TabsTrigger value="gradient">Gradient</TabsTrigger>
              <TabsTrigger value="animated">Animated</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              <TailwindcssButtons />
            </TabsContent>
            
            <TabsContent value="minimal" className="mt-6">
              <TailwindcssButtonsMinimal />
            </TabsContent>
            
            <TabsContent value="gradient" className="mt-6">
              <TailwindcssButtonsGradient />
            </TabsContent>
            
            <TabsContent value="animated" className="mt-6">
              <TailwindcssButtonsAnimated />
            </TabsContent>
          </TabsWrapper>
        </div>
      </Card>

      {/* Usage Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code2 className="h-5 w-5" />
            How to Use
          </CardTitle>
        </CardHeader>
        <div className="p-6 space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Copy Button Code</h3>
            <p className="text-sm text-muted-foreground">
              Click any button in the gallery above to automatically copy its HTML and CSS classes to your clipboard.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Paste Into Your Project</h3>
            <p className="text-sm text-muted-foreground">
              Simply paste the copied code into your HTML or JSX files. All styles use Tailwind CSS utility classes.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Customize as Needed</h3>
            <p className="text-sm text-muted-foreground">
              Modify colors, sizes, and animations by adjusting the Tailwind classes to match your design system.
            </p>
          </div>
        </div>
      </Card>

      {/* Installation Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code2 className="h-5 w-5" />
            Installation
          </CardTitle>
        </CardHeader>
        <div className="p-6 space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Install Dependencies</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">npm install react-element-to-jsx-string sonner</code>
            </pre>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Add Shimmer Animation</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Add this to your tailwind.config.js for the shimmer button:
            </p>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">{`// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      animation: {
        shimmer: "shimmer 2s linear infinite"
      },
      keyframes: {
        shimmer: {
          from: { backgroundPosition: "0 0" },
          to: { backgroundPosition: "-200% 0" }
        }
      }
    }
  }
}`}</code>
            </pre>
          </div>
        </div>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Features
          </CardTitle>
        </CardHeader>
        <div className="p-6 space-y-4">
          <div>
            <h3 className="font-semibold mb-2">🎨 20+ Button Styles</h3>
            <p className="text-sm text-muted-foreground">
              From minimal outlines to complex gradient animations, find the perfect button for any design.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">📋 One-Click Copy</h3>
            <p className="text-sm text-muted-foreground">
              Click any button to copy its complete HTML and CSS code to your clipboard instantly.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">🎭 Hover Effects</h3>
            <p className="text-sm text-muted-foreground">
              Each button includes carefully crafted hover animations and transitions.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">📱 Responsive Design</h3>
            <p className="text-sm text-muted-foreground">
              All buttons work perfectly across desktop, tablet, and mobile devices.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">🌙 Dark Mode Ready</h3>
            <p className="text-sm text-muted-foreground">
              Many buttons include dark mode variants using Tailwind's dark: prefix.
            </p>
          </div>
        </div>
      </Card>

      {/* Button Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Button Categories
          </CardTitle>
        </CardHeader>
        <div className="p-6 space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Gradient Buttons</h3>
            <p className="text-sm text-muted-foreground">
              Gradient, Lit up borders, Border Magic, Shimmer, Top Gradient, Tailwindcss Connect
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Brand-Inspired</h3>
            <p className="text-sm text-muted-foreground">
              Next.js Blue, Next.js White, Spotify, Figma, Figma Outline
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Animation Effects</h3>
            <p className="text-sm text-muted-foreground">
              Simple, Invert, Unapologetic, Shimmer, Border Magic
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Classic Styles</h3>
            <p className="text-sm text-muted-foreground">
              Sketch, Brutal, Favourite, Outline, Backdrop Blur
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}