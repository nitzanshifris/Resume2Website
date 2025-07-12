#!/usr/bin/env node

/**
 * CLI Mapper for Components and Sections
 * Tool to map and analyze the organized structure
 */

import { getAllItems, getStats, searchByQuery } from './index';

export interface MapperResult {
  stats: ReturnType<typeof getStats>;
  items: ReturnType<typeof getAllItems>;
  categories: {
    components: {
      base: string[];
      ui: string[];
    };
    sections: {
      [key: string]: string[];
    };
  };
}

export function mapStructure(): MapperResult {
  const stats = getStats();
  const items = getAllItems();
  
  // Group components by category
  const componentsByCategory = {
    base: items.filter(item => item.type === 'component' && item.path.includes('/base/')).map(item => item.name),
    ui: items.filter(item => item.type === 'component' && item.path.includes('/ui/')).map(item => item.name)
  };
  
  // Group sections by category
  const sectionsByCategory: { [key: string]: string[] } = {};
  items
    .filter(item => item.type === 'section')
    .forEach(item => {
      const category = item.path.split('/')[2]; // Extract category from path like '/sections/hero'
      if (!sectionsByCategory[category]) {
        sectionsByCategory[category] = [];
      }
      sectionsByCategory[category].push(item.name);
    });

  return {
    stats,
    items,
    categories: {
      components: componentsByCategory,
      sections: sectionsByCategory
    }
  };
}

export function printStructureMap(): void {
  const result = mapStructure();
  
  console.log('\n🎯 ACETERNITY COMPONENTS STRUCTURE MAP\n');
  console.log('=' .repeat(50));
  
  // Stats
  console.log(`📊 STATISTICS:`);
  console.log(`   • Total Components: ${result.stats.totalComponents}`);
  console.log(`   • Total Sections: ${result.stats.totalSections}`);
  console.log(`   • Grand Total: ${result.stats.total}`);
  console.log('');
  
  // Components
  console.log(`🧩 COMPONENTS:`);
  console.log(`   📁 Base Components (${result.categories.components.base.length}):`);
  result.categories.components.base.forEach(name => {
    console.log(`      • ${name}`);
  });
  
  console.log(`   📁 UI Components (${result.categories.components.ui.length}):`);
  result.categories.components.ui.forEach(name => {
    console.log(`      • ${name}`);
  });
  console.log('');
  
  // Sections
  console.log(`📦 SECTIONS:`);
  Object.entries(result.categories.sections).forEach(([category, sections]) => {
    console.log(`   📁 ${category} (${sections.length}):`);
    sections.forEach(name => {
      console.log(`      • ${name}`);
    });
  });
  
  console.log('\n' + '=' .repeat(50));
  console.log('✅ Structure mapping completed successfully!');
}

export function searchComponents(query: string): void {
  const results = searchByQuery(query);
  
  console.log(`\n🔍 SEARCH RESULTS for "${query}":\n`);
  console.log(`Found ${results.length} items:\n`);
  
  results.forEach(item => {
    const typeIcon = item.type === 'component' ? '🧩' : '📦';
    console.log(`${typeIcon} ${item.name}`);
    console.log(`   📍 ${item.path}`);
    console.log(`   📝 ${item.description}`);
    console.log(`   🏷️  [${item.tags.join(', ')}]`);
    console.log('');
  });
}

// CLI Interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];
  
  switch (command) {
    case 'map':
      printStructureMap();
      break;
    case 'search':
      const query = args[1];
      if (!query) {
        console.log('Usage: mapper search <query>');
        process.exit(1);
      }
      searchComponents(query);
      break;
    default:
      console.log('Available commands:');
      console.log('  map     - Show complete structure map');
      console.log('  search  - Search for components/sections');
      console.log('');
      console.log('Usage examples:');
      console.log('  npm run map');
      console.log('  npm run search timeline');
  }
}