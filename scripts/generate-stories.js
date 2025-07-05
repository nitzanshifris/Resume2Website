const fs = require('fs');
const path = require('path');
const glob = require('fast-glob');

/**
 * Scan every component folder under aceternity-components-library/components/ui/*
 * and create <ComponentName>.stories.tsx next to index.tsx if it doesn't exist.
 * The stub story simply re-exports the first exported React component from index.tsx.
 */
(async () => {
  const pattern = path.join(__dirname, '../aceternity-components-library/components/ui/*/index.tsx');
  const files = glob.sync(pattern.replace(/\\/g, '/'));

  files.forEach((componentIndexPath) => {
    const dir = path.dirname(componentIndexPath);
    const componentFolder = path.basename(dir); // e.g. hero-parallax
    const storyFile = path.join(dir, `${componentFolder}.stories.tsx`);

    if (fs.existsSync(storyFile)) return; // story already exists

    // Convert kebab-case folder name to PascalCase for variable naming fallback
    const pascalName = componentFolder
      .split('-')
      .map((seg) => seg.charAt(0).toUpperCase() + seg.slice(1))
      .join('');

    const content = `import type { Meta, StoryObj } from '@storybook/react';
import * as Module from './index';
import React from 'react';

// Pick the default export if available, otherwise the first named export
const Component: React.FC<any> = (Module.default ?? (Object.values(Module).filter(v => typeof v === 'function')[0])) as any;

const meta: Meta<typeof Component> = {
  title: 'Aceternity/${pascalName}',
  component: Component
};
export default meta;

type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {}
};
`;

    fs.writeFileSync(storyFile, content);
    console.log(`Created stub story: ${path.relative(process.cwd(), storyFile)}`);
  });
})(); 