"use client";

import React from "react";
import {
  StickyBannerDemo,
  StickyBannerHideOnScroll,
  StickyBannerDark,
  StickyBannerSuccess,
  StickyBannerWarning
} from "@/components/ui/sticky-banner";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Megaphone, Code2, Palette } from "lucide-react";

export default function StickyBannerPage() {
  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Megaphone className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Sticky Banner</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          A banner component that sticks to the top of its container and can optionally 
          hide when the user scrolls down. Perfect for announcements and notifications.
        </p>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary">Sticky Positioning</Badge>
          <Badge variant="secondary">Hide on Scroll</Badge>
          <Badge variant="secondary">Smooth Animations</Badge>
          <Badge variant="secondary">Close Button</Badge>
        </div>
      </div>

      {/* Demo Section */}
      <Card>
        <CardHeader>
          <CardTitle>Component Demos</CardTitle>
          <CardDescription>
            Explore different variants and behaviors of the Sticky Banner component
          </CardDescription>
        </CardHeader>
        <div className="p-6">
          <Tabs defaultValue="default" className="w-full">
            <TabsList className="grid grid-cols-5 w-full max-w-2xl">
              <TabsTrigger value="default">Default</TabsTrigger>
              <TabsTrigger value="hide-scroll">Hide on Scroll</TabsTrigger>
              <TabsTrigger value="dark">Dark</TabsTrigger>
              <TabsTrigger value="success">Success</TabsTrigger>
              <TabsTrigger value="warning">Warning</TabsTrigger>
            </TabsList>
            
            <TabsContent value="default" className="mt-6">
              <div className="rounded-lg overflow-hidden border">
                <StickyBannerDemo />
              </div>
            </TabsContent>
            
            <TabsContent value="hide-scroll" className="mt-6">
              <div className="rounded-lg overflow-hidden border">
                <StickyBannerHideOnScroll />
              </div>
            </TabsContent>
            
            <TabsContent value="dark" className="mt-6">
              <div className="rounded-lg overflow-hidden border">
                <StickyBannerDark />
              </div>
            </TabsContent>
            
            <TabsContent value="success" className="mt-6">
              <div className="rounded-lg overflow-hidden border">
                <StickyBannerSuccess />
              </div>
            </TabsContent>
            
            <TabsContent value="warning" className="mt-6">
              <div className="rounded-lg overflow-hidden border">
                <StickyBannerWarning />
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
                Optional CSS class to apply to the banner. Use this to customize the background, colors, and other styles.
              </p>
              <Badge variant="outline">optional</Badge>
              <Badge variant="outline" className="ml-2">string</Badge>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">children</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Content to display inside the banner. Can be any React node including text, links, and icons.
              </p>
              <Badge variant="outline">required</Badge>
              <Badge variant="outline" className="ml-2">React.ReactNode</Badge>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">hideOnScroll</h3>
              <p className="text-sm text-muted-foreground mb-2">
                When true, the banner will automatically hide when the user scrolls down more than 40 pixels.
              </p>
              <Badge variant="outline">optional</Badge>
              <Badge variant="outline" className="ml-2">boolean</Badge>
              <Badge variant="outline" className="ml-2">default: false</Badge>
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
            <code className="text-sm">{`import { StickyBanner } from "@/components/ui/sticky-banner";

export function AnnouncementBanner() {
  return (
    <div className="relative h-screen overflow-y-auto">
      <StickyBanner 
        className="bg-gradient-to-b from-blue-500 to-blue-600"
        hideOnScroll={true}
      >
        <p className="text-white">
          🚀 New feature launched!{" "}
          <a href="/features" className="underline hover:no-underline">
            Check it out
          </a>
        </p>
      </StickyBanner>
      
      {/* Your page content */}
      <main className="p-8">
        <h1>Welcome to our site</h1>
        {/* ... */}
      </main>
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
            <h3 className="font-semibold mb-2">Background Styles</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Common background patterns for different use cases:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li><code className="bg-muted px-1 rounded">bg-gradient-to-b from-blue-500 to-blue-600</code> - Announcements</li>
              <li><code className="bg-muted px-1 rounded">bg-gradient-to-b from-green-500 to-green-600</code> - Success</li>
              <li><code className="bg-muted px-1 rounded">bg-gradient-to-b from-yellow-500 to-yellow-600</code> - Warnings</li>
              <li><code className="bg-muted px-1 rounded">bg-gradient-to-b from-red-500 to-red-600</code> - Errors</li>
              <li><code className="bg-muted px-1 rounded">bg-white/90 backdrop-blur-sm dark:bg-gray-900/90</code> - Glass effect</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Container Setup</h3>
            <p className="text-sm text-muted-foreground mb-2">
              The parent container must have proper styling for the sticky banner to work:
            </p>
            <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
              <code>{`<div className="relative h-screen overflow-y-auto">
  <StickyBanner>...</StickyBanner>
  {/* Scrollable content */}
</div>`}</code>
            </pre>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Text Styling</h3>
            <p className="text-sm text-muted-foreground">
              Ensure good contrast for readability:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Use <code className="bg-muted px-1 rounded">text-white</code> for dark backgrounds</li>
              <li>Add <code className="bg-muted px-1 rounded">drop-shadow-md</code> for better text visibility</li>
              <li>Style links with <code className="bg-muted px-1 rounded">hover:underline</code> or similar</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Animation Behavior</h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Initial animation slides down from top with fade-in</li>
              <li>Close button scales in after banner appears</li>
              <li>Hide animation slides up with fade-out</li>
              <li>Scroll threshold for hiding is 40px (when hideOnScroll is true)</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}