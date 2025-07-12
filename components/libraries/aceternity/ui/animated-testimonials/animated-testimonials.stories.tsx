import type { Meta, StoryObj } from '@storybook/react';
import { AnimatedTestimonials } from './index';

const meta: Meta<typeof AnimatedTestimonials> = {
  title: 'Aceternity/AnimatedTestimonials',
  component: AnimatedTestimonials
};
export default meta;

type Story = StoryObj<typeof AnimatedTestimonials>;

export const Default: Story = {
  args: {
    testimonials: [
      {
        quote: "This is the best product I've ever used.",
        name: "John Doe",
        designation: "CEO at Company",
        src: "https://placehold.co/400x400/png"
      },
      {
        quote: "Amazing experience and awesome support!",
        name: "Jane Smith",
        designation: "Product Manager",
        src: "https://placehold.co/400x400/png"
      },
      {
        quote: "Highly recommend to everyone.",
        name: "Alex Johnson",
        designation: "Developer",
        src: "https://placehold.co/400x400/png"
      }
    ],
    autoplay: false
  }
};
