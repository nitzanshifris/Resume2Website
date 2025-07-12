import type { Meta, StoryObj } from '@storybook/react';
import * as Module from './index';
import type { PointerHighlightProps } from './pointer-highlight.types';
import React from 'react';

// Pick the default export if available, otherwise the first named export
const Component: React.FC<PointerHighlightProps> = Module.PointerHighlight as any;

const meta: Meta<typeof Component> = {
  title: 'Aceternity/PointerHighlight',
  component: Component,
  parameters: { layout: 'fullscreen' }
};
export default meta;

type Story = StoryObj<typeof Component>;

export const Default: Story = {
  args: {
    children: <div style={{ padding: 40, background: '#111', color: '#fff' }}>Hover me</div>,
    rectangleClassName: '',
    pointerClassName: '',
    containerClassName: 'relative'
  },
  argTypes: {
    children: { control: 'object', description: 'Content wrapped by the highlight' },
    rectangleClassName: { control: 'text' },
    pointerClassName: { control: 'text' },
    containerClassName: { control: 'text' }
  }
};
