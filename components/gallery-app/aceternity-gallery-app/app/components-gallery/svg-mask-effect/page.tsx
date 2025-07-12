"use client";

import React from "react";
import {
  SVGMaskEffectDemo,
  SVGMaskEffectMinimal,
  SVGMaskEffectColorful,
  SVGMaskEffectLarge,
  SVGMaskEffectMultiline
} from "@/components/ui/svg-mask-effect";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Code2, Palette, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SVGMaskEffectPage() {
  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Eye className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">SVG Mask Effect</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          A mask reveal effect that shows hidden content when hovering over a container. 
          Uses SVG masking for smooth circular reveals that follow your cursor.
        </p>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary">Cursor Following</Badge>
          <Badge variant="secondary">SVG Masking</Badge>
          <Badge variant="secondary">Smooth Transitions</Badge>
          <Badge variant="secondary">Dark Mode Support</Badge>
        </div>
      </div>

      {/* Setup Alert */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Important:</strong> This component requires the mask.svg file to be present in your 
          public folder. The file has been created at /public/mask.svg during component installation.
        </AlertDescription>
      </Alert>

      {/* Demo Section */}
      <Card>
        <CardHeader>
          <CardTitle>Component Demos</CardTitle>
          <CardDescription>
            Explore different variations of the SVG mask effect
          </CardDescription>
        </CardHeader>
        <div className="p-6">
          <Tabs defaultValue="default" className="w-full">
            <TabsList className="grid grid-cols-5 w-full max-w-2xl">
              <TabsTrigger value="default">Default</TabsTrigger>
              <TabsTrigger value="minimal">Minimal</TabsTrigger>
              <TabsTrigger value="colorful">Colorful</TabsTrigger>
              <TabsTrigger value="large">Large</TabsTrigger>
              <TabsTrigger value="multiline">Multiline</TabsTrigger>
            </TabsList>
            
            <TabsContent value="default" className="mt-6">
              <SVGMaskEffectDemo />
            </TabsContent>
            
            <TabsContent value="minimal" className="mt-6">
              <SVGMaskEffectMinimal />
            </TabsContent>
            
            <TabsContent value="colorful" className="mt-6">
              <SVGMaskEffectColorful />
            </TabsContent>
            
            <TabsContent value="large" className="mt-6">
              <SVGMaskEffectLarge />
            </TabsContent>
            
            <TabsContent value="multiline" className="mt-6">
              <SVGMaskEffectMultiline />
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
              <h3 className="font-semibold mb-2">children</h3>
              <p className="text-sm text-muted-foreground mb-2">
                The content that is always visible on the page. This appears inside the mask area.
              </p>
              <Badge variant="outline">optional</Badge>
              <Badge variant="outline" className="ml-2">string | ReactNode</Badge>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">revealText</h3>
              <p className="text-sm text-muted-foreground mb-2">
                The content that is revealed when hovering. This is the hidden content that becomes visible.
              </p>
              <Badge variant="outline">optional</Badge>
              <Badge variant="outline" className="ml-2">string | ReactNode</Badge>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">size</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Initial size of the mask circle in pixels when not hovered.
              </p>
              <Badge variant="outline">optional</Badge>
              <Badge variant="outline" className="ml-2">number</Badge>
              <Badge variant="outline" className="ml-2">default: 10</Badge>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">revealSize</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Size of the mask circle when hovered. Larger values reveal more content.
              </p>
              <Badge variant="outline">optional</Badge>
              <Badge variant="outline" className="ml-2">number</Badge>
              <Badge variant="outline" className="ml-2">default: 600</Badge>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">className</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Additional CSS classes for the container. Use to customize height, borders, etc.
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
            <code className="text-sm">{`import { MaskContainer } from "@/components/ui/svg-mask-effect";

export function HeroSection() {
  return (
    <MaskContainer
      revealText={
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold">
            Welcome to Our Platform
          </h1>
          <p className="text-xl text-gray-600">
            Build amazing experiences with modern tools
          </p>
          <button className="px-6 py-3 bg-blue-500 text-white rounded-lg">
            Get Started
          </button>
        </div>
      }
      className="h-[40rem] rounded-lg border"
      size={30}
      revealSize={500}
    >
      <div className="text-white">
        <h2 className="text-3xl mb-2">✨ Discover More</h2>
        <p className="text-lg">Move your cursor to explore</p>
      </div>
    </MaskContainer>
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
            <h3 className="font-semibold mb-2">Container Styling</h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Default height is <code className="bg-muted px-1 rounded">h-screen</code> - override with className</li>
              <li>Add borders with <code className="bg-muted px-1 rounded">border rounded-md</code></li>
              <li>Background transitions from white to dark slate on hover</li>
              <li>Container should have defined dimensions for best results</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Mask Sizes</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Adjust mask sizes for different effects:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li><strong>Subtle:</strong> size={10} revealSize={200}</li>
              <li><strong>Standard:</strong> size={30} revealSize={400}</li>
              <li><strong>Dramatic:</strong> size={50} revealSize={800}</li>
              <li><strong>Full reveal:</strong> size={100} revealSize={1200}</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Color Schemes</h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Always visible text should contrast with dark background</li>
              <li>Revealed text should be readable on light background</li>
              <li>Use <code className="bg-muted px-1 rounded">text-white dark:text-black</code> for visible content</li>
              <li>Use <code className="bg-muted px-1 rounded">text-slate-800 dark:text-white</code> for revealed content</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Performance Tips</h3>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Keep mask sizes reasonable - very large masks can impact performance</li>
              <li>Avoid complex animations in revealed content during hover</li>
              <li>Use CSS transforms for positioning rather than absolute values</li>
              <li>Consider debouncing if using with other mouse events</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}