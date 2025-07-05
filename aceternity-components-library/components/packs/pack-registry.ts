import { LucideIcon } from "lucide-react";

export interface PackVariant {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  component: React.ComponentType<any>;
  tags: string[];
  featured: boolean;
  codeExample: string;
}

export interface ComponentPack {
  id: string;
  name: string;
  title: string;
  description: string;
  icon: LucideIcon;
  category: string;
  variants: PackVariant[];
  tags: string[];
  dependencies: string[];
  implemented: boolean;
  featured: boolean;
  version: string;
  author: string;
  license: string;
  repository?: string;
  documentation?: string;
  installCommand: string;
  importExample: string;
}

export interface PackCategory {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

export interface PackRegistry {
  packs: ComponentPack[];
  categories: PackCategory[];
  totalVariants: number;
  lastUpdated: string;
}

// Pack categories definition
export const PACK_CATEGORIES: PackCategory[] = [
  {
    id: "hero",
    name: "Hero",
    description: "Landing page and header sections",
    icon: require("lucide-react").Layout,
    color: "purple",
  },
  {
    id: "navigation",
    name: "Navigation", 
    description: "Menus, breadcrumbs, and navigation components",
    icon: require("lucide-react").Menu,
    color: "blue",
  },
  {
    id: "content",
    name: "Content",
    description: "Cards, lists, and content display components",
    icon: require("lucide-react").FileText,
    color: "green",
  },
  {
    id: "layout",
    name: "Layout",
    description: "Grids, containers, and layout components",
    icon: require("lucide-react").Grid3x3,
    color: "orange",
  },
  {
    id: "interactive",
    name: "Interactive",
    description: "Forms, modals, and interactive elements",
    icon: require("lucide-react").MousePointer2,
    color: "pink",
  },
  {
    id: "data",
    name: "Data",
    description: "Tables, charts, and data visualization",
    icon: require("lucide-react").BarChart3,
    color: "cyan",
  },
];

// Helper functions
export function getPackById(packId: string): ComponentPack | undefined {
  return PACK_REGISTRY.packs.find(pack => pack.id === packId);
}

export function getPacksByCategory(categoryId: string): ComponentPack[] {
  return PACK_REGISTRY.packs.filter(pack => pack.category === categoryId);
}

export function getFeaturedPacks(): ComponentPack[] {
  return PACK_REGISTRY.packs.filter(pack => pack.featured);
}

export function getImplementedPacks(): ComponentPack[] {
  return PACK_REGISTRY.packs.filter(pack => pack.implemented);
}

export function searchPacks(query: string): ComponentPack[] {
  const lowercaseQuery = query.toLowerCase();
  return PACK_REGISTRY.packs.filter(pack => 
    pack.title.toLowerCase().includes(lowercaseQuery) ||
    pack.description.toLowerCase().includes(lowercaseQuery) ||
    pack.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    pack.category.toLowerCase().includes(lowercaseQuery)
  );
}

export function getPackVariant(packId: string, variantId: string): PackVariant | undefined {
  const pack = getPackById(packId);
  return pack?.variants.find(variant => variant.id === variantId);
}

export function getPackStats() {
  const totalPacks = PACK_REGISTRY.packs.length;
  const implementedPacks = getImplementedPacks().length;
  const totalVariants = PACK_REGISTRY.totalVariants;
  const featuredPacks = getFeaturedPacks().length;
  
  return {
    totalPacks,
    implementedPacks,
    totalVariants,
    featuredPacks,
    categories: PACK_CATEGORIES.length,
  };
}

// Main pack registry - will be populated with actual packs
export const PACK_REGISTRY: PackRegistry = {
  packs: [], // Will be populated by individual pack registrations
  categories: PACK_CATEGORIES,
  totalVariants: 0,
  lastUpdated: new Date().toISOString(),
};

// Pack registration function
export function registerPack(pack: ComponentPack): void {
  // Remove existing pack if it exists
  const existingIndex = PACK_REGISTRY.packs.findIndex(p => p.id === pack.id);
  if (existingIndex >= 0) {
    PACK_REGISTRY.packs[existingIndex] = pack;
  } else {
    PACK_REGISTRY.packs.push(pack);
  }
  
  // Update total variants count
  PACK_REGISTRY.totalVariants = PACK_REGISTRY.packs.reduce(
    (total, p) => total + p.variants.length, 
    0
  );
  
  // Update last updated timestamp
  PACK_REGISTRY.lastUpdated = new Date().toISOString();
}

// Validation functions
export function validatePack(pack: ComponentPack): boolean {
  // Check required fields
  if (!pack.id || !pack.title || !pack.description) return false;
  if (!pack.category || !pack.variants || pack.variants.length === 0) return false;
  
  // Check variants
  for (const variant of pack.variants) {
    if (!variant.id || !variant.title || !variant.component) return false;
  }
  
  // Check category exists
  if (!PACK_CATEGORIES.find(cat => cat.id === pack.category)) return false;
  
  return true;
}

// Export utility for getting all pack data
export function getAllPackData() {
  return {
    registry: PACK_REGISTRY,
    stats: getPackStats(),
    categories: PACK_CATEGORIES,
  };
}