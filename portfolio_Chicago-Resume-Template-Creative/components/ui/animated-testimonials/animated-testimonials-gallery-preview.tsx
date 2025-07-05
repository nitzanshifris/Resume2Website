"use client";
import React from "react";
import { AnimatedTestimonials } from "./animated-testimonials-base";

// Sample testimonials for gallery previews
const sampleTestimonials = [
  {
    quote: "The attention to detail and innovative features have completely transformed our workflow. This is exactly what we were looking for.",
    name: "Sarah Chen",
    designation: "Product Manager at TechFlow",
    src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=800&auto=format&fit=crop"
  },
  {
    quote: "Implementation was seamless and the results exceeded our expectations. The team's support has been phenomenal.",
    name: "Michael Rodriguez",
    designation: "CTO at DataPrime",
    src: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=800&auto=format&fit=crop"
  },
  {
    quote: "A game-changing solution that has improved our team's productivity by 200%. Highly recommend to any growing business.",
    name: "Emily Watson",
    designation: "Founder at InnovateLab",
    src: "https://images.unsplash.com/photo-1494790108755-2616c1c46b3b?q=80&w=800&auto=format&fit=crop"
  }
];

const teamTestimonials = [
  {
    quote: "Working here has been an incredible journey of growth and innovation. The collaborative environment truly brings out the best in everyone.",
    name: "Alex Johnson",
    designation: "Senior Developer",
    src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop"
  },
  {
    quote: "The culture of continuous learning and the emphasis on work-life balance makes this the best place I've ever worked.",
    name: "Maria Garcia",
    designation: "UX Designer", 
    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=800&auto=format&fit=crop"
  },
  {
    quote: "Leadership here truly cares about each team member's growth and provides all the resources needed to succeed.",
    name: "David Kim",
    designation: "Product Designer",
    src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop"
  }
];

// Gallery-specific preview components with consistent sizing
export function AnimatedTestimonialsGalleryBasic() {
  return (
    <div className="relative w-full h-[32rem] overflow-hidden bg-white dark:bg-black">
      <div className="scale-75 -translate-y-8">
        <AnimatedTestimonials testimonials={sampleTestimonials} autoplay={false} />
      </div>
    </div>
  );
}

export function AnimatedTestimonialsGalleryAutoplay() {
  return (
    <div className="relative w-full h-[32rem] overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
      <div className="scale-75 -translate-y-8">
        <AnimatedTestimonials testimonials={sampleTestimonials} autoplay={true} />
      </div>
    </div>
  );
}

export function AnimatedTestimonialsGalleryTeam() {
  return (
    <div className="relative w-full h-[32rem] overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
      <div className="scale-75 -translate-y-8">
        <AnimatedTestimonials testimonials={teamTestimonials} autoplay={false} />
      </div>
    </div>
  );
}

export function AnimatedTestimonialsGalleryCompact() {
  const compactTestimonials = sampleTestimonials.slice(0, 2);
  
  return (
    <div className="relative w-full h-[32rem] overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
      <div className="scale-75 -translate-y-8">
        <AnimatedTestimonials testimonials={compactTestimonials} autoplay={true} />
      </div>
    </div>
  );
}