#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

async function buildResume2WebsiteBundle() {
  console.log('🚀 Building RESUME2WEBSITE component bundle...');
  
  const outputDir = 'exports/resume2website-core';
  const componentsDir = 'components/core';
  
  try {
    // Ensure output directory exists
    await fs.ensureDir(outputDir);
    await fs.ensureDir(`${outputDir}/components`);
    await fs.ensureDir(`${outputDir}/lib`);

    // Core components needed by RESUME2WEBSITE
    const coreComponents = [
      'hero-parallax',
      'hero-highlight', 
      'timeline',
      'bento-grid',
      'card-hover-effect',
      'text-effects',
      'floating-dock',
      'animated-testimonials',
      '3d-card',
      'animated-tooltip'
    ];

    console.log('📦 Copying components...');
    
    // Copy each component
    for (const component of coreComponents) {
      const sourcePath = path.join(componentsDir, component);
      const targetPath = path.join(outputDir, 'components', component);
      
      if (await fs.pathExists(sourcePath)) {
        await fs.copy(sourcePath, targetPath);
        console.log(`✓ Copied ${component}`);
      } else {
        console.warn(`⚠️  Component ${component} not found at ${sourcePath}`);
      }
    }

    // Copy utilities
    console.log('🔧 Copying utilities...');
    if (await fs.pathExists('lib/utils.ts')) {
      await fs.copy('lib/utils.ts', `${outputDir}/lib/utils.ts`);
      console.log('✓ Copied lib/utils.ts');
    }

    // Generate unified package.json with calculated dependencies
    console.log('📋 Generating package.json...');
    const packageJson = {
      "name": "@aceternity/resume2website-core",
      "version": "1.0.0",
      "description": "Core Aceternity components optimized for RESUME2WEBSITE portfolio generation",
      "main": "index.js",
      "types": "index.d.ts",
      "dependencies": {
        "clsx": "^2.1.1",
        "tailwind-merge": "^3.3.0"
      },
      "peerDependencies": {
        "react": "^18.0.0 || ^19.0.0",
        "react-dom": "^18.0.0 || ^19.0.0",
        "tailwindcss": "^3.0.0",
        "framer-motion": "^12.0.0",
        "motion": "^12.0.0",
        "@tabler/icons-react": "^3.0.0"
      },
      "resume2website": {
        "ready": true,
        "bundleDate": new Date().toISOString(),
        "components": coreComponents
      }
    };

    await fs.writeJson(`${outputDir}/package.json`, packageJson, { spaces: 2 });
    console.log('✓ Generated package.json');

    // Create README
    const readme = `# Aceternity RESUME2WEBSITE Core Bundle

This bundle contains all the core Aceternity components needed for RESUME2WEBSITE portfolio generation.

## Components Included
${coreComponents.map(c => `- ${c}`).join('\n')}

## Usage in RESUME2WEBSITE

\`\`\`typescript
import { Timeline, HeroParallax, BentoGrid } from '@aceternity/resume2website-core';
\`\`\`

## Bundle Info
- Built: ${new Date().toISOString()}
- Components: ${coreComponents.length}
- Ready for RESUME2WEBSITE integration: ✅
`;

    await fs.writeFile(`${outputDir}/README.md`, readme);
    console.log('✓ Generated README.md');

    console.log('\n✅ RESUME2WEBSITE bundle built successfully!');
    console.log(`📁 Bundle location: ${outputDir}/`);
    console.log(`📊 Components included: ${coreComponents.length}`);
    
  } catch (error) {
    console.error('❌ Error building RESUME2WEBSITE bundle:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  buildResume2WebsiteBundle();
}

module.exports = { buildResume2WebsiteBundle };