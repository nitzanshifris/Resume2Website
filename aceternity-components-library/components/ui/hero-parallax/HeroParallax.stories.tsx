import type { Meta, StoryObj } from '@storybook/react';
import { HeroParallax } from '@aceternity/components-library';

const meta: Meta<typeof HeroParallax> = {
  title: 'Aceternity/HeroParallax',
  component: HeroParallax,
  parameters: {
    layout: 'fullscreen'
  }
};
export default meta;

type Story = StoryObj<typeof HeroParallax>;

export const Default: Story = {
  args: {},
}; 