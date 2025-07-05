"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, Package, Code2, Eye, Copy, ExternalLink, 
  Layout, Zap, Grid3x3, Images, Sparkles, Type, 
  Star, Download, BookOpen, Settings
} from "lucide-react";
import Link from "next/link";
import { getPackById } from "@/component-library/packs";

// Get the hero sections pack from registry
const heroSectionsPack = getPackById("hero-sections");
const heroVariants = heroSectionsPack?.variants || [];
const dependencies = heroSectionsPack?.dependencies || [];

export default function HeroSectionsPackPage() {
  const [selectedVariant, setSelectedVariant] = useState(heroVariants[0]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const installCommand = heroSectionsPack?.installCommand || `npm i ${dependencies.join(" ")}`;
  const importCode = heroSectionsPack?.importExample || `import { ${heroVariants.map(v => v.component.name).join(", ")} } from "@/packs/hero-sections";`;

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
                {heroSectionsPack?.title || "Hero Sections Pack"}
              </h1>
            </div>
          </div>

          <p className="text-lg text-gray-300 mb-6 max-w-4xl">
            {heroSectionsPack?.description || "A comprehensive collection of hero section components with animations, beams, grids, and interactive effects. Perfect for landing pages, product launches, and creative headers."}
          </p>

          {/* Pack Stats */}
          <div className="flex flex-wrap gap-6 mb-8">
            <div className="flex items-center gap-2">
              <Layout className="h-5 w-5 text-purple-400" />
              <span className="text-gray-300">{heroVariants.length} Variants</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400" />
              <span className="text-gray-300">{heroVariants.filter(v => v.featured).length} Featured</span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-400" />
              <span className="text-gray-300">{dependencies.length} Dependencies</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              <Download className="h-4 w-4 mr-2" />
              Download Pack
            </Button>
            <Button variant="outline" className="border-slate-600 text-gray-300 hover:bg-slate-700">
              <BookOpen className="h-4 w-4 mr-2" />
              Documentation
            </Button>
            <Button variant="outline" className="border-slate-600 text-gray-300 hover:bg-slate-700">
              <ExternalLink className="h-4 w-4 mr-2" />
              Live Demo
            </Button>
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
            <TabsTrigger value="setup" className="data-[state=active]:bg-purple-600">
              <Settings className="h-4 w-4 mr-2" />
              Setup
            </TabsTrigger>
          </TabsList>

          {/* Gallery Tab */}
          <TabsContent value="gallery" className="space-y-8">
            {/* Variant Selector */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {heroVariants.map((variant) => (
                <Card 
                  key={variant.id}
                  className={`cursor-pointer transition-all duration-300 ${
                    selectedVariant.id === variant.id 
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
                            <Star className="h-3 w-3 mr-1" />
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

            {/* Selected Variant Preview */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <selectedVariant.icon className="h-6 w-6 text-purple-400" />
                    <h2 className="text-2xl font-bold text-white">{selectedVariant.title}</h2>
                    {selectedVariant.featured && (
                      <Badge className="bg-yellow-500/20 text-yellow-400">
                        <Star className="h-3 w-3 mr-1" />
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
                <div className="relative rounded-lg border border-slate-700 bg-black">
                  <div className="min-h-[600px] lg:min-h-[800px]">
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
          </TabsContent>

          {/* Code Tab */}
          <TabsContent value="code" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">Import Components</h3>
                <div className="relative">
                  <pre className="bg-slate-900 p-4 rounded-lg text-gray-300 text-sm overflow-x-auto">
                    <code>{importCode}</code>
                  </pre>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="absolute top-3 right-3 border-slate-600"
                    onClick={() => copyToClipboard(importCode, "import")}
                  >
                    {copiedCode === "import" ? "Copied!" : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">Usage Examples</h3>
                <div className="space-y-4">
                  {heroVariants.map((variant) => (
                    <div key={variant.id} className="relative">
                      <h4 className="text-lg font-semibold text-purple-300 mb-2">{variant.title}</h4>
                      <pre className="bg-slate-900 p-4 rounded-lg text-gray-300 text-sm overflow-x-auto">
                        <code>{variant.codeExample || `<${variant.component.name} />`}</code>
                      </pre>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="absolute top-8 right-3 border-slate-600"
                        onClick={() => copyToClipboard(variant.codeExample || `<${variant.component.name} />`, `usage-${variant.id}`)}
                      >
                        {copiedCode === `usage-${variant.id}` ? "Copied!" : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Setup Tab */}
          <TabsContent value="setup" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">Installation</h3>
                <div className="relative">
                  <pre className="bg-slate-900 p-4 rounded-lg text-gray-300 text-sm overflow-x-auto">
                    <code>{installCommand}</code>
                  </pre>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="absolute top-3 right-3 border-slate-600"
                    onClick={() => copyToClipboard(installCommand, "install")}
                  >
                    {copiedCode === "install" ? "Copied!" : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">Dependencies</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {dependencies.map((dep) => (
                    <div key={dep} className="flex items-center gap-2 p-3 bg-slate-900 rounded-lg">
                      <Package className="h-4 w-4 text-purple-400" />
                      <code className="text-gray-300 text-sm">{dep}</code>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}