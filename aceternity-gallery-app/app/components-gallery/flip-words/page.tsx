"use client";

import { FlipWords, FlipWordsHeroTitle, FlipWordsTestimonialHighlight, FlipWordsFeatureShowcase } from "@/components/ui/flip-words";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Code2, Copy, Check, ArrowLeft } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function FlipWordsGallery() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const installCommand = `npm install framer-motion clsx tailwind-merge`;

  const basicUsageCode = `import { FlipWords } from "@/components/ui/flip-words";

function MyComponent() {
  const words = ["amazing", "beautiful", "modern", "stunning"];
  
  return (
    <div className="text-4xl font-normal text-neutral-600 dark:text-neutral-400">
      Build
      <FlipWords words={words} /> <br />
      websites with Aceternity UI
    </div>
  );
}`;

  const heroTitleCode = `import { FlipWordsHeroTitle } from "@/components/ui/flip-words";

function MyComponent() {
  const words = ["scalable", "reliable", "performant", "secure"];
  
  return (
    <FlipWordsHeroTitle
      prefix="Build"
      words={words}
      suffix="applications with Next.js"
      duration={4000}
    />
  );
}`;

  const testimonialCode = `import { FlipWordsTestimonialHighlight } from "@/components/ui/flip-words";

function MyComponent() {
  const words = ["innovative", "creative", "dedicated", "passionate"];
  
  return (
    <FlipWordsTestimonialHighlight
      words={words}
      testimonial=" and delivers exceptional results every time we work together."
      author="Sarah Johnson"
      role="CEO, TechStartup Inc."
    />
  );
}`;

  const componentCode = `"use client";
import React, { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, LayoutGroup } from "framer-motion";
import { cn } from "@/lib/utils";

export const FlipWords = ({
  words,
  duration = 3000,
  className,
}: {
  words: string[];
  duration?: number;
  className?: string;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Move to next word
  const startAnimation = useCallback(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, duration);
    return () => clearInterval(interval);
  }, [words.length, duration]);

  // Start animation on mount and handle cleanup
  useEffect(() => {
    const cleanup = startAnimation();
    return cleanup;
  }, [startAnimation]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 10,
        }}
        exit={{
          opacity: 0,
          y: -40,
          x: 40,
          filter: "blur(8px)",
          scale: 2,
          position: "absolute",
        }}
        className={cn(
          "relative z-10 inline-block px-2 text-left",
          className
        )}
        key={currentIndex}
      >
        {words[currentIndex].split(" ").map((word, wordIndex) => {
          return (
            <motion.span
              key={word + wordIndex}
              initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                delay: wordIndex * 0.3,
                duration: 0.3,
              }}
              className="inline-block whitespace-nowrap"
            >
              {word.split("").map((letter, letterIndex) => {
                return (
                  <LayoutGroup key={word + letterIndex}>
                    <motion.span
                      key={letter + letterIndex}
                      initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -40, filter: "blur(8px)" }}
                      transition={{
                        delay: wordIndex * 0.3 + letterIndex * 0.05,
                        duration: 0.2,
                      }}
                      className="inline-block"
                    >
                      {letter}
                    </motion.span>
                  </LayoutGroup>
                );
              })}
              <span className="inline-block">&nbsp;</span>
            </motion.span>
          );
        })}
      </motion.div>
    </AnimatePresence>
  );
};`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-900">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <Link 
              href="/components-gallery" 
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Gallery
            </Link>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Flip Words
            </h1>
            <p className="text-xl text-gray-400">
              Dynamic text animation component that cycles through an array of words with smooth flip animations
            </p>
            <div className="flex gap-2 mt-4">
              <Badge variant="outline" className="border-gray-700">Framer Motion</Badge>
              <Badge variant="outline" className="border-gray-700">Letter Animation</Badge>
              <Badge variant="outline" className="border-gray-700">Auto-cycle</Badge>
              <Badge variant="outline" className="border-gray-700">Customizable</Badge>
            </div>
          </div>

          {/* Demo Section */}
          <Card className="mb-8 bg-zinc-900/50 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Live Demos</CardTitle>
              <CardDescription className="text-gray-400">
                Different variants of the FlipWords component
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Basic Demo */}
              <div className="p-6 bg-zinc-950 rounded-lg">
                <h3 className="text-sm font-medium text-gray-400 mb-4">Basic Usage</h3>
                <div className="text-4xl font-normal text-neutral-300">
                  Build{" "}
                  <FlipWords 
                    words={["amazing", "beautiful", "modern", "stunning"]} 
                    className="text-blue-500"
                  />
                  <br />
                  websites with Aceternity UI
                </div>
              </div>

              {/* Hero Title Demo */}
              <div className="p-6 bg-zinc-950 rounded-lg">
                <h3 className="text-sm font-medium text-gray-400 mb-4">Hero Title Variant</h3>
                <FlipWordsHeroTitle
                  prefix="Build"
                  words={["scalable", "reliable", "performant", "secure"]}
                  suffix="applications with Next.js"
                  className="text-white"
                />
              </div>

              {/* Testimonial Demo */}
              <div className="p-6 bg-zinc-950 rounded-lg">
                <h3 className="text-sm font-medium text-gray-400 mb-4">Testimonial Variant</h3>
                <FlipWordsTestimonialHighlight
                  words={["innovative", "creative", "dedicated", "passionate"]}
                  testimonial=" and delivers exceptional results every time we work together."
                  author="Sarah Johnson"
                  role="CEO, TechStartup Inc."
                />
              </div>

              {/* Feature Showcase Demo */}
              <div className="p-6 bg-zinc-950 rounded-lg">
                <h3 className="text-sm font-medium text-gray-400 mb-4">Feature Showcase Variant</h3>
                <FlipWordsFeatureShowcase
                  title="Experience"
                  words={["blazing-fast", "responsive", "accessible", "beautiful"]}
                  description="Our components are built with performance and user experience in mind, ensuring your applications run smoothly across all devices."
                />
              </div>
            </CardContent>
          </Card>

          {/* Documentation */}
          <div className="space-y-4">
            {/* Installation */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Installation</CardTitle>
                <CardDescription className="text-gray-400">
                  Install the required dependencies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="p-4 rounded-lg bg-slate-950 text-slate-50 overflow-x-auto">
                    <code>{installCommand}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(installCommand, 'install')}
                  >
                    {copiedSection === 'install' ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Basic Usage */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Basic Usage</CardTitle>
                <CardDescription className="text-gray-400">
                  Simple implementation with an array of words
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="p-4 rounded-lg bg-slate-950 text-slate-50 overflow-x-auto">
                    <code>{basicUsageCode}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(basicUsageCode, 'basic')}
                  >
                    {copiedSection === 'basic' ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Hero Title Variant */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Hero Title Variant</CardTitle>
                <CardDescription className="text-gray-400">
                  Perfect for hero sections with prefix and suffix text
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="p-4 rounded-lg bg-slate-950 text-slate-50 overflow-x-auto">
                    <code>{heroTitleCode}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(heroTitleCode, 'hero')}
                  >
                    {copiedSection === 'hero' ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial Variant */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Testimonial Variant</CardTitle>
                <CardDescription className="text-gray-400">
                  Highlight dynamic words within testimonials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="p-4 rounded-lg bg-slate-950 text-slate-50 overflow-x-auto">
                    <code>{testimonialCode}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(testimonialCode, 'testimonial')}
                  >
                    {copiedSection === 'testimonial' ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Props */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Component Props</CardTitle>
                <CardDescription className="text-gray-400">
                  All available props for the FlipWords component
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-zinc-700">
                        <th className="text-left p-2 font-medium text-gray-300">Prop</th>
                        <th className="text-left p-2 font-medium text-gray-300">Type</th>
                        <th className="text-left p-2 font-medium text-gray-300">Default</th>
                        <th className="text-left p-2 font-medium text-gray-300">Description</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-400">
                      <tr className="border-b border-zinc-800">
                        <td className="p-2 font-mono text-xs text-blue-400">words</td>
                        <td className="p-2 font-mono text-xs">string[]</td>
                        <td className="p-2">required</td>
                        <td className="p-2">Array of words to cycle through</td>
                      </tr>
                      <tr className="border-b border-zinc-800">
                        <td className="p-2 font-mono text-xs text-blue-400">duration</td>
                        <td className="p-2 font-mono text-xs">number</td>
                        <td className="p-2">3000</td>
                        <td className="p-2">Time between word changes in milliseconds</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-mono text-xs text-blue-400">className</td>
                        <td className="p-2 font-mono text-xs">string</td>
                        <td className="p-2">-</td>
                        <td className="p-2">Additional CSS classes for styling</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Full Code */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Full Component Code</CardTitle>
                <CardDescription className="text-gray-400">
                  Copy and paste this code into your project
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="p-4 rounded-lg bg-slate-950 text-slate-50 overflow-x-auto max-h-[600px]">
                    <code>{componentCode}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(componentCode, 'component')}
                  >
                    {copiedSection === 'component' ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}