"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Package, Layers, Search, Filter, Play, Eye, Code2, 
  Grid3x3, Layout, Star, ArrowRight, Zap
} from "lucide-react";
import { useState, useMemo } from "react";
import { PACK_REGISTRY, PACK_CATEGORIES, getPackStats } from "@/component-library/packs";

const componentPacks = PACK_REGISTRY.packs;
const categories = ["All", ...PACK_CATEGORIES.map(cat => cat.name)];

export default function PacksGalleryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPacks = useMemo(() => {
    return componentPacks.filter(pack => {
      const matchesSearch = pack.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           pack.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           pack.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const categoryMatch = PACK_CATEGORIES.find(cat => cat.name === selectedCategory);
      const matchesCategory = selectedCategory === "All" || 
                             pack.category === categoryMatch?.id ||
                             pack.category === selectedCategory.toLowerCase();
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-6 flex items-center gap-2">
            <Package className="h-8 w-8 text-gray-400" />
            <h1 className="text-4xl font-bold text-white">
              Component Packs Gallery
            </h1>
          </div>
          
          <p className="text-lg text-gray-400 mb-6 max-w-3xl">
            Curated collections of related components that work together as cohesive units. 
            Each pack includes multiple variants, complete documentation, and all necessary dependencies.
          </p>

          {/* Stats */}
          <div className="flex gap-6 mb-8">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-gray-400" />
              <span className="text-gray-400">{componentPacks.length} Pack{componentPacks.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-gray-400" />
              <span className="text-gray-400">
                {componentPacks.reduce((total, pack) => total + pack.variants.length, 0)} Total Variants
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-gray-400" />
              <span className="text-gray-400">
                {componentPacks.filter(pack => pack.featured).length} Featured
              </span>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search component packs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-800 text-white placeholder-gray-500 focus:border-gray-700"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-gray-900 border border-gray-800 rounded-md text-white focus:border-gray-700"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Packs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredPacks.map((pack) => (
            <div key={pack.id} className="group">
              <Card 
                className="relative overflow-hidden bg-gray-900 border-gray-800 hover:border-gray-700 transition-all duration-300 card-spotlight border-glow group-hover:scale-[1.02]"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                  e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
                }}
              >
                {/* Glow Effect */}
                <div className="glow-effect" />
                
                {pack.featured && (
                  <div className="absolute top-3 right-3 z-10">
                    <Badge className="bg-gray-800 text-gray-400 border border-gray-700">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-gray-800 rounded-lg">
                    <pack.icon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white group-hover:text-gray-200 transition-colors">
                      {pack.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Layers className="h-3 w-3" />
                      <span>{pack.variants.length} variants</span>
                    </div>
                  </div>
                </div>
                
                <CardDescription className="text-gray-400 mb-4">
                  {pack.description}
                </CardDescription>

                {/* Pack Info */}
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Components included:</p>
                    <div className="text-xs text-gray-400">
                      {pack.variants.slice(0, 3).map(v => v.title).join(", ")}
                      {pack.variants.length > 3 && ` + ${pack.variants.length - 3} more`}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {pack.tags.slice(0, 4).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs bg-gray-800 text-gray-400 border-gray-700">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  <Link 
                    href={`/packs-gallery/${pack.id}`}
                    className="flex-1 inline-flex items-center justify-center h-9 px-3 text-xs font-medium transition-colors rounded-md bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Pack
                  </Link>
                  
                  <Link 
                    href={`/packs-gallery/${pack.id}?tab=code`}
                    className="inline-flex items-center justify-center h-9 px-3 text-xs font-medium transition-colors rounded-md border border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white"
                  >
                    <Code2 className="h-4 w-4" />
                  </Link>
                </div>
              </CardHeader>
            </Card>
          </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPacks.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No packs found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg">
            <Zap className="h-4 w-4 text-gray-400" />
            <span className="text-gray-400">More packs coming soon!</span>
          </div>
        </div>
      </div>
    </div>
  );
}