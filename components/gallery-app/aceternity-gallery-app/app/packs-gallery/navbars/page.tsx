"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Package, Code2, Eye, Copy, Layout } from "lucide-react";
import { getPackById } from "@/component-library/packs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function NavbarsGalleryPage() {
  const navbarsPack = getPackById("navbars");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const variants = navbarsPack?.variants || [];
  const [selectedVariant, setSelectedVariant] = useState(variants[0]);

  if (!navbarsPack) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Navbars pack not found</p>
      </div>
    );
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link 
              href="/packs-gallery"
              className="inline-flex items-center justify-center h-9 px-3 text-xs font-medium transition-colors rounded-md border border-slate-600 text-gray-300 hover:bg-slate-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Packs
            </Link>
            
            <div className="flex items-center gap-2">
              <Package className="h-8 w-8 text-purple-400" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {navbarsPack.title}
              </h1>
            </div>
          </div>

          <p className="text-lg text-gray-300 mb-6 max-w-4xl">
            {navbarsPack.description}
          </p>

          {/* Pack Stats */}
          <div className="flex flex-wrap gap-6 mb-8">
            <div className="flex items-center gap-2">
              <Layout className="h-5 w-5 text-purple-400" />
              <span className="text-gray-300">{variants.length} Variants</span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-400" />
              <span className="text-gray-300">{navbarsPack.dependencies.length} Dependencies</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="gallery" className="w-full">
          <TabsList className="mb-8 bg-slate-800 border-slate-700">
            <TabsTrigger value="gallery" className="data-[state=active]:bg-purple-600">
              <Eye className="h-4 w-4 mr-2" />
              Gallery
            </TabsTrigger>
            <TabsTrigger value="code" className="data-[state=active]:bg-purple-600">
              <Code2 className="h-4 w-4 mr-2" />
              Code
            </TabsTrigger>
          </TabsList>

          {/* Gallery Tab */}
          <TabsContent value="gallery" className="space-y-8">
            {/* Variant Selector */}
            {variants.length > 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {variants.map((variant) => (
                  <Card 
                    key={variant.id}
                    className={`cursor-pointer transition-all duration-300 ${
                      selectedVariant?.id === variant.id 
                        ? 'bg-purple-900/30 border-purple-500' 
                        : 'bg-slate-800/50 border-slate-700 hover:border-purple-500/50'
                    }`}
                    onClick={() => setSelectedVariant(variant)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                          <variant.icon className="h-5 w-5 text-purple-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white text-sm">{variant.title}</h3>
                          {variant.featured && (
                            <Badge className="bg-yellow-500/20 text-yellow-400 mt-1">
                              Featured
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-400 text-xs mb-3">{variant.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {variant.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs bg-slate-700 text-gray-300">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Selected Variant Preview */}
            {selectedVariant && (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <selectedVariant.icon className="h-6 w-6 text-purple-400" />
                      <h2 className="text-2xl font-bold text-white">{selectedVariant.title}</h2>
                      {selectedVariant.featured && (
                        <Badge className="bg-yellow-500/20 text-yellow-400">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-slate-600 text-gray-300 hover:bg-slate-700"
                      onClick={() => copyToClipboard(`<${selectedVariant.component.name} />`, selectedVariant.id)}
                    >
                      {copiedCode === selectedVariant.id ? "Copied!" : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>

                  <p className="text-gray-300 mb-6">{selectedVariant.description}</p>

                  {/* Component Preview */}
                  <div className="relative rounded-lg border border-slate-700 overflow-hidden">
                    <div className="min-h-[400px] bg-white dark:bg-gray-900">
                      <selectedVariant.component />
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {selectedVariant.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-slate-700 text-gray-300">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Code Tab */}
          <TabsContent value="code" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">Installation</h3>
                <div className="relative">
                  <pre className="bg-slate-900 p-4 rounded-lg text-gray-300 text-sm overflow-x-auto">
                    <code>{navbarsPack.installCommand}</code>
                  </pre>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="absolute top-3 right-3 border-slate-600"
                    onClick={() => copyToClipboard(navbarsPack.installCommand, "install")}
                  >
                    {copiedCode === "install" ? "Copied!" : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">Import Example</h3>
                <div className="relative">
                  <pre className="bg-slate-900 p-4 rounded-lg text-gray-300 text-sm overflow-x-auto">
                    <code>{navbarsPack.importExample}</code>
                  </pre>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="absolute top-3 right-3 border-slate-600"
                    onClick={() => copyToClipboard(navbarsPack.importExample, "import")}
                  >
                    {copiedCode === "import" ? "Copied!" : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {selectedVariant && (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Usage Example</h3>
                  <div className="relative">
                    <pre className="bg-slate-900 p-4 rounded-lg text-gray-300 text-sm overflow-x-auto">
                      <code>{selectedVariant.codeExample}</code>
                    </pre>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="absolute top-3 right-3 border-slate-600"
                      onClick={() => copyToClipboard(selectedVariant.codeExample || "", "usage")}
                    >
                      {copiedCode === "usage" ? "Copied!" : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}