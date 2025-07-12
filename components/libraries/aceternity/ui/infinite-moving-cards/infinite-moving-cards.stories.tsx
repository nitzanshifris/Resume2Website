import type { Meta, StoryObj } from '@storybook/react';
import { InfiniteMovingCards } from './index';

const meta: Meta<typeof InfiniteMovingCards> = {
  title: 'Aceternity/InfiniteMovingCards',
  component: InfiniteMovingCards
};
export default meta;

type Story = StoryObj<typeof InfiniteMovingCards>;

export const Default: Story = {
  args: {
    items: [
      {
        quote: "Great service and support!",
        name: "Alice",
        title: "Designer"
      },
      {
        quote: "Love the UI components!",
        name: "Bob",
        title: "Developer"
      },
      {
        quote: "Highly customizable and easy to use.",
        name: "Charlie",
        title: "Product Manager"
      }
    ],
    direction: "left",
    speed: "normal",
    pauseOnHover: true
  }
};
