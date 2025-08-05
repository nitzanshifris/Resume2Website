import type { Meta, StoryObj } from '@storybook/react';
import HelloWorld from './HelloWorld';

const meta = {
  title: 'Example/HelloWorld',
  component: HelloWorld
} satisfies Meta<typeof HelloWorld>;
export default meta;

type Story = StoryObj<typeof HelloWorld>;

export const Default: Story = {
  args: {}
}; 