"use client";

import { AnimatedTestimonials } from "./animated-testimonials-base";

const testimonials = [
  {
    quote:
      "Working with this team has been an absolute pleasure. Their expertise and dedication to excellence is evident in every interaction.",
    name: "Alex Johnson",
    designation: "CEO at Digital Dynamics",
    src: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    quote:
      "The results speak for themselves. Our conversion rates have doubled since implementing their solutions.",
    name: "Rachel Green",
    designation: "Marketing Director at Growth Co",
    src: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=3461&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    quote:
      "Innovative, reliable, and always ahead of the curve. They've become an integral part of our success story.",
    name: "David Park",
    designation: "Head of Engineering at FutureTech",
    src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export function AnimatedTestimonialsAutoplay() {
  return (
    <div className="min-h-[600px] flex items-center justify-center bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-xl">
      <AnimatedTestimonials testimonials={testimonials} autoplay={true} />
    </div>
  );
}