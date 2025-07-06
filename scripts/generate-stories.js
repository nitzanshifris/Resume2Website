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

  const propsPath = path.join(__dirname, '../props/component-props.json');
  const propsData = fs.existsSync(propsPath) ? require(propsPath) : {};

  const sampleValue = (propName, typeString) => {
    if (propName === 'children' || /ReactNode/.test(typeString)) {
      return '<div>Demo</div>'; // JSX sample
    }
    if (propName === 'textSize') {
      return "'md'";
    }
    if (propName === 'color') {
      return "'#000000'";
    }
    if (/string\[\]/.test(typeString)) {
      return "['One', 'Two']";
    }
    if (/number\[\]/.test(typeString)) {
      return '[0,1]';
    }
    if (/\[\]$/.test(typeString)) {
      return '[]';
    }
    if (/boolean/.test(typeString)) {
      return 'false';
    }
    if (/number/.test(typeString)) {
      return '0';
    }
    if (/string/.test(typeString)) {
      return "'Sample'";
    }
    return '{}';
  };

  files.forEach((componentIndexPath) => {
    const dir = path.dirname(componentIndexPath);
    const componentFolder = path.basename(dir); // e.g. hero-parallax
    const storyFile = path.join(dir, `${componentFolder}.stories.tsx`);

    const AUTO_HEADER = '// AUTO-GENERATED STORY - edits may be overwritten\n';

    let existingContent = '';
    if (fs.existsSync(storyFile)) {
      existingContent = fs.readFileSync(storyFile, 'utf-8');
      const firstLine = existingContent.split('\n')[0];
      // If user wrote their own story (no header AND no placeholder args), leave it as is
      const isUserStory = !firstLine.includes('AUTO-GENERATED STORY') && !/args:\s*\{\s*\}/.test(existingContent);
      if (isUserStory) {
        return;
      }
    }

    // Convert kebab-case folder name to PascalCase for variable naming fallback
    const pascalName = componentFolder
      .split('-')
      .map((seg) => seg.charAt(0).toUpperCase() + seg.slice(1))
      .join('');

    const componentProps = propsData[componentFolder] || {};
    const argLines = Object.entries(componentProps)
      .map(([k, v]) => `  ${k}: ${sampleValue(k, v)},`)
      .join('\n');

    const argsBlock = `{
${argLines}\n}`;

    const hasTextSize = 'textSize' in componentProps;
    const hasColor = 'color' in componentProps;
    let argTypesBlock = '';
    if (hasTextSize || hasColor) {
      const lines = [];
      if (hasTextSize) {
        lines.push(`    textSize: { control: { type: 'select' }, options: ['xs','sm','md','lg','xl','2xl','3xl','4xl','5xl','6xl','7xl','8xl','9xl'] }`);
      }
      if (hasColor) {
        lines.push(`    color: { control: 'color' }`);
      }
      argTypesBlock = `,
  argTypes: {
${lines.join(',\n')}
  }`;
    }

    const content = `${AUTO_HEADER}import type { Meta, StoryObj } from '@storybook/react';
import * as Module from './index';
import React from 'react';

// Pick the default export if available, otherwise the first named export
const Component: React.FC<any> = (Module.default ?? (Object.values(Module).filter(v => typeof v === 'function')[0])) as any;

const meta: Meta<typeof Component> = {
  title: 'Aceternity/${pascalName}',
  component: Component,
  parameters: { layout: 'fullscreen' }${argTypesBlock}
};
export default meta;

type Story = StoryObj<typeof Component>;

// "Bare" – minimal wrapper, same as legacy Default
export const Bare: Story = {
  args: ${argsBlock}
};

// "Website" – wrapped in section to mimic original site styling
export const Website: Story = {
  render: (args: any) => (
    <section className="min-h-screen flex items-center justify-center bg-neutral-100 dark:bg-neutral-900 p-8">
      <Component {...args} />
    </section>
  ),
  args: ${argsBlock}
};
`;

    fs.writeFileSync(storyFile, content);
    console.log(`Generated story: ${path.relative(process.cwd(), storyFile)}`);
  });
})(); 