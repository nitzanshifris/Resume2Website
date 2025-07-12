"use client";

import React from "react";
import { TabsDemo, TabsMinimal, TabsColorful, TabsWithIcons, TabsResponsive } from "@/components/ui/animated-tabs";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity as TabsIcon, Code2, Palette, Layers } from "lucide-react";

// Import shadcn tabs components separately to avoid naming conflict
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

export default function TabsPage() {
  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TabsIcon className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Animated Tabs</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Tabs to switch content, click on a tab to check background animation. Features 3D stacking effects and smooth transitions.
        </p>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary">3D Effects</Badge>
          <Badge variant="secondary">Spring Animations</Badge>
          <Badge variant="secondary">Hover Interactions</Badge>
          <Badge variant="secondary">Responsive</Badge>
        </div>
      </div>

      {/* Demo Section */}
      <Card>
        <CardHeader>
          <CardTitle>Component Demos</CardTitle>
          <CardDescription>
            Explore different variations of the animated tabs component
          </CardDescription>
        </CardHeader>
        <div className="p-6">
          <TabsWrapper defaultValue="default" className="w-full">
            <TabsList className="grid grid-cols-5 w-full max-w-2xl">
              <TabsTrigger value="default">Default</TabsTrigger>
              <TabsTrigger value="minimal">Minimal</TabsTrigger>
              <TabsTrigger value="colorful">Colorful</TabsTrigger>
              <TabsTrigger value="icons">With Icons</TabsTrigger>
              <TabsTrigger value="responsive">Responsive</TabsTrigger>
            </TabsList>
            
            <TabsContent value="default" className="mt-6">
              <TabsDemo />
            </TabsContent>
            
            <TabsContent value="minimal" className="mt-6">
              <TabsMinimal />
            </TabsContent>
            
            <TabsContent value="colorful" className="mt-6">
              <TabsColorful />
            </TabsContent>
            
            <TabsContent value="icons" className="mt-6">
              <TabsWithIcons />
            </TabsContent>
            
            <TabsContent value="responsive" className="mt-6">
              <TabsResponsive />
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
              <h3 className="font-semibold mb-2">tabs</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Array of tab objects containing title, value, and content.
              </p>
              <Badge variant="outline">required</Badge>
              <Badge variant="outline" className="ml-2">Tab[]</Badge>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">containerClassName</h3>
              <p className="text-sm text-muted-foreground mb-2">
                CSS class name for the tabs container. Use to customize the tab bar styling.
              </p>
              <Badge variant="outline">optional</Badge>
              <Badge variant="outline" className="ml-2">string</Badge>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">activeTabClassName</h3>
              <p className="text-sm text-muted-foreground mb-2">
                CSS class name for the active tab indicator background.
              </p>
              <Badge variant="outline">optional</Badge>
              <Badge variant="outline" className="ml-2">string</Badge>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">tabClassName</h3>
              <p className="text-sm text-muted-foreground mb-2">
                CSS class name for individual tab buttons.
              </p>
              <Badge variant="outline">optional</Badge>
              <Badge variant="outline" className="ml-2">string</Badge>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">contentClassName</h3>
              <p className="text-sm text-muted-foreground mb-2">
                CSS class name for the content container. Useful for adjusting spacing.
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
            <code className="text-sm">{`import { Tabs } from "@/components/ui/animated-tabs";

const tabs = [
  {
    title: "Product",
    value: "product",
    content: (
      <div className="w-full h-full rounded-2xl p-10 bg-gradient-to-br from-purple-700 to-violet-900">
        <p className="text-2xl font-bold text-white">Product Tab</p>
        <p className="text-white/80 mt-4">
          Your product content goes here...
        </p>
      </div>
    ),
  },
  {
    title: "Services",
    value: "services",
    content: (
      <div className="w-full h-full rounded-2xl p-10 bg-gradient-to-br from-blue-700 to-cyan-900">
        <p className="text-2xl font-bold text-white">Services Tab</p>
        <p className="text-white/80 mt-4">
          Your services content goes here...
        </p>
      </div>
    ),
  },
];

export function MyTabs() {
  return (
    <div className="h-[40rem] [perspective:1000px] relative flex flex-col max-w-5xl mx-auto w-full">
      <Tabs tabs={tabs} />
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
            <h3 className="font-semibold mb-2">3D Stacking Effect</h3>
            <p className="text-sm text-muted-foreground">
              Tabs are stacked with perspective, each tab scaled down by 0.1 from the previous one.
              The stacking creates a natural depth effect.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Hover Interaction</h3>
            <p className="text-sm text-muted-foreground">
              When hovering over tabs, they spread vertically by 50px each, making it easier to see
              all available options.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Tab Selection</h3>
            <p className="text-sm text-muted-foreground">
              Clicking a tab moves it to the top of the stack with a spring animation. The active
              tab also bounces slightly for visual feedback.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Content Transition</h3>
            <p className="text-sm text-muted-foreground">
              Content fades in smoothly when switching tabs, with the active content having a subtle
              Y-axis animation.
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
            <h3 className="font-semibold mb-2">Container Requirements</h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Wrap tabs in a container with defined height (e.g., h-[40rem])</li>
              <li>Add [perspective:1000px] class for 3D effects</li>
              <li>Use relative positioning on the container</li>
              <li>Apply flex layout with flex-col</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Custom Styling</h3>
            <p className="text-sm text-muted-foreground mb-2">
              You can customize various aspects of the tabs:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Active tab background with activeTabClassName</li>
              <li>Tab button styling with tabClassName</li>
              <li>Content spacing with contentClassName</li>
              <li>Container layout with containerClassName</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Responsive Design</h3>
            <p className="text-sm text-muted-foreground">
              The tabs support horizontal scrolling on mobile devices. The no-visible-scrollbar
              class hides the scrollbar while maintaining scroll functionality.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}