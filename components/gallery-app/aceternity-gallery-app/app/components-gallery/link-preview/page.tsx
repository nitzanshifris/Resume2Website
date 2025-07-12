"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Code2, Eye, Copy, Check, GitCompare, Play, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { 
  LinkPreviewDemo, 
  LinkPreviewDemoSecond,
  LinkPreviewWithImage,
  LinkPreviewGalleryPreview
} from "@/components/ui/link-preview";

export default function LinkPreviewGalleryPage() {
  const [activeTab, setActiveTab] = useState("preview");
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState("default");

  const handleCopy = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const variants = {
    default: {
      name: "Default",
      component: LinkPreviewDemo,
      code: `"use client";
import React from "react";
import { LinkPreview } from "@/components/ui/link-preview";

export function LinkPreviewDemo() {
  return (
    <div className="flex justify-center items-center h-[40rem] flex-col px-4">
      <p className="text-neutral-500 dark:text-neutral-400 text-xl md:text-3xl max-w-3xl mx-auto mb-10">
        <LinkPreview
          url="https://tailwindcss.com"
          className="font-bold bg-clip-text text-transparent bg-gradient-to-br from-purple-500 to-pink-500"
        >
          Tailwind CSS
        </LinkPreview>{" "}
        is a utility-first CSS framework for creating custom designs without
        having to leave your HTML.
      </p>
      <p className="text-neutral-500 dark:text-neutral-400 text-xl md:text-3xl max-w-3xl mx-auto">
        <LinkPreview url="https://framer.com/motion" className="font-bold">
          Framer Motion
        </LinkPreview>{" "}
        is a production-ready motion library for React from{" "}
        <LinkPreview url="https://framer.com" className="font-bold">
          Framer
        </LinkPreview>
        .
      </p>
    </div>
  );
}`
    },
    withImage: {
      name: "With Static Image",
      component: LinkPreviewWithImage,
      code: `"use client";
import React from "react";
import { LinkPreview } from "@/components/ui/link-preview";

export function LinkPreviewWithImage() {
  return (
    <div className="flex justify-center items-center h-[40rem] flex-col px-4">
      <p className="text-neutral-500 dark:text-neutral-400 text-xl md:text-3xl max-w-3xl mx-auto mb-10">
        <LinkPreview
          url="https://www.imdb.com/name/nm4004793"
          isStatic
          imageSrc="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&q=80"
          className="font-bold"
        >
          John Doe
        </LinkPreview>{" "}
        is an acclaimed actor known for his versatile roles in both independent
        and blockbuster films.
      </p>
      <p className="text-neutral-500 dark:text-neutral-400 text-xl md:text-3xl max-w-3xl mx-auto">
        One of the most iconic movies of all time is{" "}
        <LinkPreview
          url="https://www.imdb.com/title/tt0137523/"
          isStatic
          imageSrc="https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=400&h=250&q=80"
          className="font-bold"
        >
          Fight Club
        </LinkPreview>
        , directed by David Fincher.
      </p>
    </div>
  );
}`
    },
    multiple: {
      name: "Multiple Links",
      component: LinkPreviewDemoSecond,
      code: `"use client";
import React from "react";
import { LinkPreview } from "@/components/ui/link-preview";

export function LinkPreviewDemoSecond() {
  return (
    <div className="flex justify-center items-center h-[40rem] flex-col px-4">
      <p className="text-neutral-500 dark:text-neutral-400 text-xl md:text-3xl max-w-3xl mx-auto mb-10">
        <LinkPreview url="https://vercel.com" className="font-bold">
          Vercel
        </LinkPreview>{" "}
        is a cloud platform for static sites and Serverless Functions that fits
        perfectly with your workflow.
      </p>
      <p className="text-neutral-500 dark:text-neutral-400 text-xl md:text-3xl max-w-3xl mx-auto">
        Over{" "}
        <LinkPreview
          url="https://github.com"
          className="font-bold bg-clip-text text-transparent bg-gradient-to-br from-green-500 to-blue-500"
        >
          100 million developers
        </LinkPreview>{" "}
        use GitHub to build amazing things together.
      </p>
    </div>
  );
}`
    }
  };

  const baseComponentCode = `"use client";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import Image from "next/image";
import { encode } from "qss";
import React from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

type LinkPreviewProps = {
  children: React.ReactNode;
  url: string;
  className?: string;
  width?: number;
  height?: number;
  quality?: number;
  layout?: string;
} & (
  | { isStatic: true; imageSrc: string }
  | { isStatic?: false; imageSrc?: never }
);

export const LinkPreview = ({
  children,
  url,
  className,
  width = 200,
  height = 125,
  quality = 50,
  layout = "fixed",
  isStatic = false,
  imageSrc = "",
}: LinkPreviewProps) => {
  let src;
  if (!isStatic) {
    const params = encode({
      url,
      screenshot: true,
      meta: false,
      embed: "screenshot.url",
      colorScheme: "dark",
      "viewport.isMobile": true,
      "viewport.deviceScaleFactor": 1,
      "viewport.width": width * 3,
      "viewport.height": height * 3,
    });
    src = \`https://api.microlink.io/?\${params}\`;
  } else {
    src = imageSrc;
  }

  const [isOpen, setOpen] = React.useState(false);

  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const springConfig = { stiffness: 100, damping: 15 };
  const x = useMotionValue(0);

  const translateX = useSpring(x, springConfig);

  const handleMouseMove = (event: any) => {
    const targetRect = event.target.getBoundingClientRect();
    const eventOffsetX = event.clientX - targetRect.left;
    const offsetFromCenter = (eventOffsetX - targetRect.width / 2) / 2; // Reduce the effect to make it subtle
    x.set(offsetFromCenter);
  };

  return (
    <>
      {isMounted ? (
        <div className="hidden">
          <Image
            src={src}
            width={width}
            height={height}
            quality={quality}
            layout={layout}
            priority={true}
            alt="hidden image"
          />
        </div>
      ) : null}

      <HoverCardPrimitive.Root
        openDelay={50}
        closeDelay={100}
        onOpenChange={(open) => {
          setOpen(open);
        }}
      >
        <HoverCardPrimitive.Trigger
          onMouseMove={handleMouseMove}
          className={cn("text-black dark:text-white", className)}
          href={url}
        >
          {children}
        </HoverCardPrimitive.Trigger>

        <HoverCardPrimitive.Content
          className="[transform-origin:var(--radix-hover-card-content-transform-origin)]"
          side="top"
          align="center"
          sideOffset={10}
        >
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.6 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                  },
                }}
                exit={{ opacity: 0, y: 20, scale: 0.6 }}
                className="shadow-xl rounded-xl"
                style={{
                  x: translateX,
                }}
              >
                <Link
                  href={url}
                  className="block p-1 bg-white border-2 border-transparent shadow rounded-xl hover:border-neutral-200 dark:hover:border-neutral-800"
                  style={{ fontSize: 0 }}
                >
                  <Image
                    src={isStatic ? imageSrc : src}
                    width={width}
                    height={height}
                    quality={quality}
                    layout={layout}
                    priority={true}
                    className="rounded-lg"
                    alt="preview image"
                  />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </HoverCardPrimitive.Content>
      </HoverCardPrimitive.Root>
    </>
  );
};`;

  const installCommand = `npm install @radix-ui/react-hover-card qss`;

  const nextConfigCode = `/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["api.microlink.io"],
  },
};

module.exports = nextConfig;`;

  const selectedVariantData = variants[selectedVariant as keyof typeof variants];
  const VariantComponent = selectedVariantData.component;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/components-gallery">
                <Button variant="ghost" size="icon">
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold">Link Preview</h1>
                <p className="text-muted-foreground mt-1">
                  A customizable link preview on hover, powered by Microlink API
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Interactive</Badge>
              <Badge variant="outline">Radix UI</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="preview" className="gap-2">
                <Eye className="h-4 w-4" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="code" className="gap-2">
                <Code2 className="h-4 w-4" />
                Code
              </TabsTrigger>
            </TabsList>
            
            {activeTab === "preview" && (
              <div className="flex items-center gap-2">
                <select
                  value={selectedVariant}
                  onChange={(e) => setSelectedVariant(e.target.value)}
                  className="px-3 py-1.5 rounded-md border bg-background text-sm"
                >
                  {Object.entries(variants).map(([key, variant]) => (
                    <option key={key} value={key}>
                      {variant.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <TabsContent value="preview" className="mt-0">
            <Card className="relative overflow-hidden bg-zinc-900/50 backdrop-blur">
              <div className="absolute inset-0 bg-grid-white/[0.02]" />
              <div className="relative">
                <VariantComponent />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="code" className="space-y-6 mt-0">
            {/* Installation */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Installation</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(installCommand, "install")}
                >
                  {copiedSection === "install" ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
                <code className="text-sm text-zinc-300">{installCommand}</code>
              </pre>
              
              <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                  <strong>Important:</strong> You need to add the Microlink API domain to your Next.js configuration:
                </p>
              </div>
              
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">next.config.js</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(nextConfigCode, "nextconfig")}
                  >
                    {copiedSection === "nextconfig" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm text-zinc-300">{nextConfigCode}</code>
                </pre>
              </div>
            </Card>

            {/* Component Code */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Component Code</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(baseComponentCode, "component")}
                >
                  {copiedSection === "component" ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
                <code className="text-sm text-zinc-300">{baseComponentCode}</code>
              </pre>
            </Card>

            {/* Usage Example */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Usage Example</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(selectedVariantData.code, "usage")}
                >
                  {copiedSection === "usage" ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <pre className="bg-zinc-900 p-4 rounded-lg overflow-x-auto">
                <code className="text-sm text-zinc-300">{selectedVariantData.code}</code>
              </pre>
            </Card>

            {/* Props */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Props</h3>
              <div className="space-y-4">
                <div>
                  <code className="text-sm font-mono bg-zinc-800 px-2 py-1 rounded">url</code>
                  <p className="text-sm text-muted-foreground mt-1">The URL to preview</p>
                </div>
                <div>
                  <code className="text-sm font-mono bg-zinc-800 px-2 py-1 rounded">isStatic</code>
                  <p className="text-sm text-muted-foreground mt-1">Whether to use a static image instead of generating a preview</p>
                </div>
                <div>
                  <code className="text-sm font-mono bg-zinc-800 px-2 py-1 rounded">imageSrc</code>
                  <p className="text-sm text-muted-foreground mt-1">The static image source (required when isStatic is true)</p>
                </div>
                <div>
                  <code className="text-sm font-mono bg-zinc-800 px-2 py-1 rounded">width</code>
                  <p className="text-sm text-muted-foreground mt-1">Preview width (default: 200)</p>
                </div>
                <div>
                  <code className="text-sm font-mono bg-zinc-800 px-2 py-1 rounded">height</code>
                  <p className="text-sm text-muted-foreground mt-1">Preview height (default: 125)</p>
                </div>
                <div>
                  <code className="text-sm font-mono bg-zinc-800 px-2 py-1 rounded">className</code>
                  <p className="text-sm text-muted-foreground mt-1">Additional CSS classes for the link</p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}