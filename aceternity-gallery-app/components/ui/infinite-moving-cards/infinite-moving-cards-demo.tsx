"use client";
 
import React, { useEffect, useState } from "react";
import { InfiniteMovingCards } from "./infinite-moving-cards-base";
import { InfiniteMovingCardsDemoProps } from "./infinite-moving-cards.types";
 
const testimonials = [
  {
    quote:
      "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair.",
    name: "Charles Dickens",
    title: "A Tale of Two Cities",
  },
  {
    quote:
      "To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer The slings and arrows of outrageous fortune, Or to take Arms against a Sea of troubles, And by opposing end them: to die, to sleep.",
    name: "William Shakespeare",
    title: "Hamlet",
  },
  {
    quote: "All that we see or seem is but a dream within a dream.",
    name: "Edgar Allan Poe",
    title: "A Dream Within a Dream",
  },
  {
    quote:
      "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
    name: "Jane Austen",
    title: "Pride and Prejudice",
  },
  {
    quote:
      "Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world.",
    name: "Herman Melville",
    title: "Moby-Dick",
  },
];

export function InfiniteMovingCardsDemo({ className, containerClassName }: InfiniteMovingCardsDemoProps = {}) {
  return (
    <div className={containerClassName || "h-[40rem] rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden"}>
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="slow"
        className={className}
      />
    </div>
  );
}

// Preview variant for gallery - constrained display
export function InfiniteMovingCardsPreview({ className, containerClassName }: InfiniteMovingCardsDemoProps = {}) {
  return (
    <div className={containerClassName || "h-96 w-full rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden"}>
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="normal"
        className={className}
      />
    </div>
  );
}

// Fast speed variant
export function InfiniteMovingCardsFast({ className, containerClassName }: InfiniteMovingCardsDemoProps = {}) {
  const modernTestimonials = [
    {
      quote: "This product has completely transformed how we handle our workflow. The efficiency gains are remarkable.",
      name: "Sarah Chen",
      title: "CTO at TechCorp",
    },
    {
      quote: "I've never seen such a seamless integration. It just works perfectly out of the box.",
      name: "Michael Rodriguez",
      title: "Product Manager at StartupX",
    },
    {
      quote: "The attention to detail is incredible. Every feature feels thoughtfully designed.",
      name: "Emily Watson",
      title: "Designer at Creative Studio",
    },
    {
      quote: "Our team productivity has increased by 40% since we started using this tool.",
      name: "David Kim",
      title: "Engineering Lead at DevOps Inc",
    },
  ];

  return (
    <div className={containerClassName || "h-96 w-full rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden"}>
      <InfiniteMovingCards
        items={modernTestimonials}
        direction="left"
        speed="fast"
        className={className}
      />
    </div>
  );
}

// Opposite direction variant
export function InfiniteMovingCardsReverse({ className, containerClassName }: InfiniteMovingCardsDemoProps = {}) {
  const techQuotes = [
    {
      quote: "Any sufficiently advanced technology is indistinguishable from magic.",
      name: "Arthur C. Clarke",
      title: "Clarke's Third Law",
    },
    {
      quote: "The computer was born to solve problems that did not exist before.",
      name: "Bill Gates",
      title: "Microsoft Co-founder",
    },
    {
      quote: "Innovation distinguishes between a leader and a follower.",
      name: "Steve Jobs",
      title: "Apple Co-founder",
    },
    {
      quote: "The best way to predict the future is to invent it.",
      name: "Alan Kay",
      title: "Computer Scientist",
    },
  ];

  return (
    <div className={containerClassName || "h-96 w-full rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden"}>
      <InfiniteMovingCards
        items={techQuotes}
        direction="right"
        speed="slow"
        className={className}
      />
    </div>
  );
}

// No pause on hover variant
export function InfiniteMovingCardsNoPause({ className, containerClassName }: InfiniteMovingCardsDemoProps = {}) {
  const inspirationalQuotes = [
    {
      quote: "The only way to do great work is to love what you do.",
      name: "Steve Jobs",
      title: "Stanford Commencement 2005",
    },
    {
      quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
      name: "Winston Churchill",
      title: "British Prime Minister",
    },
    {
      quote: "The future belongs to those who believe in the beauty of their dreams.",
      name: "Eleanor Roosevelt",
      title: "Former First Lady",
    },
    {
      quote: "It does not matter how slowly you go as long as you do not stop.",
      name: "Confucius",
      title: "Chinese Philosopher",
    },
  ];

  return (
    <div className={containerClassName || "h-96 w-full rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden"}>
      <InfiniteMovingCards
        items={inspirationalQuotes}
        direction="left"
        speed="normal"
        pauseOnHover={false}
        className={className}
      />
    </div>
  );
}