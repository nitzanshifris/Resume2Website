/**
 * Main Registry Export
 * Central access point for all registries
 */

export * from './components-registry';
export * from './sections-registry';

import { componentsRegistry, ComponentRegistryItem } from './components-registry';
import { sectionsRegistry, SectionRegistryItem } from './sections-registry';

// Combined registry for universal search
export interface UniversalRegistryItem {
  type: 'component' | 'section';
  name: string;
  path: string;
  description: string;
  tags: string[];
}

export function getAllItems(): UniversalRegistryItem[] {
  const components: UniversalRegistryItem[] = componentsRegistry.map(comp => ({
    type: 'component' as const,
    name: comp.name,
    path: comp.path,
    description: comp.description,
    tags: comp.tags
  }));

  const sections: UniversalRegistryItem[] = sectionsRegistry.map(section => ({
    type: 'section' as const,
    name: section.name,
    path: section.path,
    description: section.description,
    tags: section.tags
  }));

  return [...components, ...sections];
}

export function searchByQuery(query: string): UniversalRegistryItem[] {
  const allItems = getAllItems();
  const lowercaseQuery = query.toLowerCase();
  
  return allItems.filter(item => 
    item.name.toLowerCase().includes(lowercaseQuery) ||
    item.description.toLowerCase().includes(lowercaseQuery) ||
    item.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}

export function getStats() {
  return {
    totalComponents: componentsRegistry.length,
    totalSections: sectionsRegistry.length,
    total: componentsRegistry.length + sectionsRegistry.length
  };
}