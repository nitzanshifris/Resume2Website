"use client";
import React from "react";
import { Carousel, Card } from "./apple-cards-carousel-base";

// Sample cards for gallery previews
const sampleCards = [
  {
    category: "Travel",
    title: "Mountain Adventure",
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800&auto=format&fit=crop",
    content: "Explore breathtaking mountain landscapes and discover hidden trails with our adventure travel packages."
  },
  {
    category: "Nature",
    title: "Forest Discovery",
    src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800&auto=format&fit=crop",
    content: "Immerse yourself in pristine wilderness and connect with nature through guided forest exploration tours."
  },
  {
    category: "Ocean",
    title: "Coastal Paradise",
    src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=800&auto=format&fit=crop",
    content: "Experience stunning coastal views and pristine beaches in some of the world's most beautiful destinations."
  },
  {
    category: "Adventure",
    title: "Desert Expedition",
    src: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=800&auto=format&fit=crop",
    content: "Journey through vast desert landscapes and witness incredible sunsets in this unforgettable adventure."
  }
];

const techCards = [
  {
    category: "Development",
    title: "React Development",
    src: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop",
    content: "Build modern user interfaces with React's component-based architecture and cutting-edge features."
  },
  {
    category: "Design",
    title: "UI/UX Design",
    src: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop",
    content: "Create beautiful and intuitive user experiences with modern design principles and user-centered approach."
  },
  {
    category: "Backend",
    title: "Node.js API",
    src: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=800&auto=format&fit=crop",
    content: "Build scalable and efficient server-side applications with Node.js and modern backend technologies."
  }
];

const portfolioCards = [
  {
    category: "Project",
    title: "E-commerce Platform",
    src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
    content: "A comprehensive e-commerce solution built with modern technologies and optimized for performance."
  },
  {
    category: "App",
    title: "Mobile Application",
    src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
    content: "Cross-platform mobile app with stunning UI and seamless user experience across devices."
  },
  {
    category: "Web",
    title: "SaaS Dashboard",
    src: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?q=80&w=800&auto=format&fit=crop",
    content: "Advanced analytics dashboard with real-time data visualization and comprehensive reporting features."
  }
];

// Gallery-specific preview components with consistent sizing
export function AppleCardsCarouselGalleryBasic() {
  return (
    <div className="relative w-full h-[32rem] bg-gray-100 dark:bg-neutral-900">
      <Carousel items={sampleCards.map((card, index) => (
        <Card key={card.src} card={card} index={index} />
      ))} />
    </div>
  );
}

export function AppleCardsCarouselGalleryTech() {
  return (
    <div className="relative w-full h-[32rem] bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900">
      <Carousel items={techCards.map((card, index) => (
        <Card key={card.src} card={card} index={index} />
      ))} />
    </div>
  );
}

export function AppleCardsCarouselGalleryPortfolio() {
  return (
    <div className="relative w-full h-[32rem] bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900">
      <Carousel items={portfolioCards.map((card, index) => (
        <Card key={card.src} card={card} index={index} />
      ))} />
    </div>
  );
}

export function AppleCardsCarouselGalleryCompact() {
  const compactCards = sampleCards.slice(0, 3);
  
  return (
    <div className="relative w-full h-[32rem] bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900">
      <Carousel items={compactCards.map((card, index) => (
        <Card key={card.src} card={card} index={index} />
      ))} />
    </div>
  );
}