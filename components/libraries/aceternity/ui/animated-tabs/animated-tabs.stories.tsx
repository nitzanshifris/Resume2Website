import type { Meta, StoryObj } from '@storybook/react';
import { Tabs } from './index';

const meta: Meta<typeof Tabs> = {
  title: 'Aceternity/AnimatedTabs',
  component: Tabs
};
export default meta;

type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  args: {
    tabs: [
      { title: 'Tab 1', value: 'tab1', content: 'Content for Tab 1' },
      { title: 'Tab 2', value: 'tab2', content: 'Content for Tab 2' },
      { title: 'Tab 3', value: 'tab3', content: 'Content for Tab 3' }
    ]
  }
};
