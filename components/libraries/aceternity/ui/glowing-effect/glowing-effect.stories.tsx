// AUTO-GENERATED STORY - edits may be overwritten
import type { Meta, StoryObj } from '@storybook/react';
import * as Module from './index';
import React from 'react';
// Pick the default export if available, otherwise the first named export
const Component: React.FC<any> = (Module.default ?? (Object.values(Module).filter(v => typeof v === 'function')[0])) as any;

const meta: Meta<typeof Component> = {
  title: 'Aceternity/GlowingEffect',
  component: Component,
  parameters: { 
    layout: 'fullscreen',
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#0d0d0d' }
      ]
    }
  },
  argTypes: {
    textSize: { control: { type: 'select' }, options: ['xs','sm','md','lg','xl','2xl','3xl','4xl','5xl','6xl','7xl','8xl','9xl'] },
    color: { control: 'color' }
  }
};
export default meta;

type Story = StoryObj<typeof Component>;

// "Bare" – minimal wrapper, same as legacy Default
export const Bare: Story = {
  args: {
  blur: 0,
  inactiveZone: 0,
  proximity: 0,
  spread: 0,
  variant: {},
  glow: false,
  className: 'Sample',
  disabled: false,
  movementDuration: 0,
  borderWidth: 0,
  children: <div>Demo</div>,
  style: {},
  textSize: 'md',
  color: '#000000',
}
};

// "Website" – wrapped in section to mimic original site styling
export const Website: Story = {
  render: (args: any) => (
    <section className="min-h-screen flex items-center justify-center bg-neutral-100 dark:bg-neutral-900 p-8">
      <Component {...args} />
    </section>
  ),
  args: {
  blur: 0,
  inactiveZone: 0,
  proximity: 0,
  spread: 0,
  variant: {},
  glow: false,
  className: 'Sample',
  disabled: false,
  movementDuration: 0,
  borderWidth: 0,
  children: <div>Demo</div>,
  style: {},
  textSize: 'md',
  color: '#000000',
}
};

