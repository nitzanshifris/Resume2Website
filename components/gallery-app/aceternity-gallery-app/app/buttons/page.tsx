"use client";

import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mouse, ArrowRight, Palette, Zap, ArrowLeft, Layers } from "lucide-react";
import { buttons } from "@/components/ui/tailwindcss-buttons";

export default function ButtonsPage() {
  const buttonCategories = [
    {
      title: "Classic Buttons",
      description: "Simple, clean designs for everyday use",
      buttons: ["sketch", "simple", "favourite", "outline"],
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Gradient Effects",
      description: "Eye-catching gradients and lighting effects",
      buttons: ["gradient", "lit-up-borders", "border-magic", "shimmer", "top-gradient"],
      color: "from-purple-500 to-pink-600"
    },
    {
      title: "Brand Inspired",
      description: "Buttons inspired by popular brands",
      buttons: ["nextjs-blue", "nextjs-white", "spotify", "figma", "figma-outline"],
      color: "from-green-500 to-teal-600"
    },
    {
      title: "Interactive & Animated",
      description: "Buttons with hover effects and animations",
      buttons: ["invert", "unapologetic", "brutal", "backdrop-blur", "playlist", "tailwindcss-connect"],
      color: "from-orange-500 to-red-600"
    }
  ];

  const getButtonSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <Link href="/components-gallery" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Component Gallery
        </Link>
        <div className="flex items-center gap-2">
          <Mouse className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Button Collection</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Explore our complete collection of Tailwind CSS buttons. Each button has its own dedicated page with code examples and variations.
        </p>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary">20+ Buttons</Badge>
          <Badge variant="secondary">Individual Pages</Badge>
          <Badge variant="secondary">Copy to Clipboard</Badge>
          <Badge variant="secondary">Responsive</Badge>
        </div>
      </div>

      {/* Categories */}
      {buttonCategories.map((category, categoryIndex) => (
        <Card key={categoryIndex}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${category.color}`} />
              <CardTitle>{category.title}</CardTitle>
            </div>
            <CardDescription>{category.description}</CardDescription>
          </CardHeader>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.buttons.map((buttonSlug) => {
                const button = buttons.find(b => getButtonSlug(b.name) === buttonSlug);
                if (!button) return null;

                return (
                  <Link key={buttonSlug} href={`/buttons/${buttonSlug}`}>
                    <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold">{button.name}</h3>
                          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">{button.description}</p>
                        <div className="flex items-center justify-center h-20 bg-muted/50 rounded-lg">
                          {button.component}
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </Card>
      ))}

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Collection Overview
          </CardTitle>
        </CardHeader>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">{buttons.length}</div>
              <div className="text-sm text-muted-foreground">Total Buttons</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">4</div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">100%</div>
              <div className="text-sm text-muted-foreground">Responsive</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">1-Click</div>
              <div className="text-sm text-muted-foreground">Copy Code</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Navigation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Quick Navigation
          </CardTitle>
        </CardHeader>
        <div className="p-6">
          <div className="flex flex-wrap gap-2">
            {buttons.map((button) => {
              const slug = getButtonSlug(button.name);
              return (
                <Link key={slug} href={`/buttons/${slug}`}>
                  <Badge variant="outline" className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                    {button.name}
                  </Badge>
                </Link>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}