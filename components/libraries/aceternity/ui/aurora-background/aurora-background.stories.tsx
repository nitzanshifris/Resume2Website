import type { Meta, StoryObj } from '@storybook/react';
import { AuroraBackground } from './index';

const meta: Meta<any> = {
  title: 'Aceternity/AuroraBackground',
  component: AuroraBackground,
  argTypes: {
    children: { control: 'text', description: 'Inner content' },
    textClass: {
      control: { type: 'select' },
      options: [
        'text-sm',
        'text-base',
        'text-xl',
        'text-2xl',
        'text-3xl',
        'text-4xl',
        'text-5xl',
        'text-6xl',
        'text-8xl'
      ],
      description: 'Tailwind font-size class applied to children'
    },
    showRadialGradient: { control: 'boolean' },
    className: { control: 'text' }
  },
  render: (args) => {
    const { textClass, ...rest } = args as any;
    return (
      <AuroraBackground {...rest}>
        <span className={textClass}>{rest.children}</span>
      </AuroraBackground>
    );
  }
};
export default meta;

type Story = StoryObj<any>;

export const Default: Story = {
  args: {
    children: 'Hello Storybook',
    textClass: 'text-4xl font-bold text-white',
    showRadialGradient: true,
    className: ''
  }
};
