#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

async function extractComponent(componentName, targetPath) {
  if (!componentName || !targetPath) {
    console.error('Usage: node extract-component.js <component-name> <target-path>');
    console.error('Example: node extract-component.js timeline /path/to/generated-portfolio');
    process.exit(1);
  }

  console.log(`🔧 Extracting component: ${componentName}`);
  console.log(`📁 Target path: ${targetPath}`);
  
  try {
    const sourcePath = path.join('components/core', componentName);
    const targetComponentPath = path.join(targetPath, 'components/ui', componentName);
    
    // Check if source component exists
    if (!await fs.pathExists(sourcePath)) {
      console.error(`❌ Component ${componentName} not found at ${sourcePath}`);
      process.exit(1);
    }

    // Ensure target directories exist
    await fs.ensureDir(path.join(targetPath, 'components/ui'));
    await fs.ensureDir(path.join(targetPath, 'lib'));

    // Copy component files
    await fs.copy(sourcePath, targetComponentPath);
    console.log(`✓ Copied component files`);

    // Copy utils if needed
    const utilsSource = 'lib/utils.ts';
    const utilsTarget = path.join(targetPath, 'lib/utils.ts');
    
    if (await fs.pathExists(utilsSource) && !await fs.pathExists(utilsTarget)) {
      await fs.copy(utilsSource, utilsTarget);
      console.log(`✓ Copied lib/utils.ts`);
    }

    // Load dependency information
    const { CV2WEB_COMPONENTS } = require('../registry/cv2web-components.ts');
    const component = CV2WEB_COMPONENTS[componentName];
    
    if (component) {
      console.log(`📦 Dependencies needed:`);
      component.externalDeps.forEach(dep => {
        console.log(`  - ${dep}`);
      });
    }

    console.log(`\n✅ Component ${componentName} extracted successfully!`);
    console.log(`📁 Location: ${targetComponentPath}`);
    
  } catch (error) {
    console.error('❌ Error extracting component:', error);
    process.exit(1);
  }
}

// Get command line arguments
const [,, componentName, targetPath] = process.argv;

// Run if called directly
if (require.main === module) {
  extractComponent(componentName, targetPath);
}

module.exports = { extractComponent };