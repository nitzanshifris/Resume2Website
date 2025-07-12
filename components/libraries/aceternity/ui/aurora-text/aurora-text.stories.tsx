import type { Meta, StoryObj } from '@storybook/react';
import { AuroraText } from './index';

const meta: Meta<typeof AuroraText> = {
  title: 'Aceternity/AuroraText',
  component: AuroraText
};
export default meta;

type Story = StoryObj<typeof AuroraText>;

export const Default: Story = {
  args: {
    children: 'Aceternity',
    speed: 1,
  }
};
