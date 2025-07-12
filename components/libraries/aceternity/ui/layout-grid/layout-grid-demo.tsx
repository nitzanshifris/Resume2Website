"use client";
import React, { useState, useRef, useEffect } from "react";
import { LayoutGrid } from "./layout-grid-base";
import { LayoutGridDemoProps, LayoutGridGalleryPreviewProps, Card } from "./layout-grid.types";

// Skeleton Components - EXACT from provided code
const SkeletonOne = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white">
        House in the woods
      </p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        A serene and tranquil retreat, this house in the woods offers a peaceful
        escape from the hustle and bustle of city life.
      </p>
    </div>
  );
};

const SkeletonTwo = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white">
        House above the clouds
      </p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        Perched high above the world, this house offers breathtaking views and a
        unique living experience. It&apos;s a place where the sky meets home,
        and tranquility is a way of life.
      </p>
    </div>
  );
};

const SkeletonThree = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white">
        Greens all over
      </p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        A house surrounded by greenery and nature&apos;s beauty. It&apos;s the
        perfect place to relax, unwind, and enjoy life.
      </p>
    </div>
  );
};

const SkeletonFour = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white">
        Rivers are serene
      </p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        A house by the river is a place of peace and tranquility. It&apos;s the
        perfect place to relax, unwind, and enjoy life.
      </p>
    </div>
  );
};

// Default cards - EXACT from provided code
const defaultCards: Card[] = [
  {
    id: 1,
    content: <SkeletonOne />,
    className: "md:col-span-2",
    thumbnail:
      "https://images.unsplash.com/photo-1476231682828-37e571bc172f?q=80&w=3474&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 2,
    content: <SkeletonTwo />,
    className: "col-span-1",
    thumbnail:
      "https://images.unsplash.com/photo-1464457312035-3d7d0e0c058e?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 3,
    content: <SkeletonThree />,
    className: "col-span-1",
    thumbnail:
      "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 4,
    content: <SkeletonFour />,
    className: "md:col-span-2",
    thumbnail:
      "https://images.unsplash.com/photo-1475070929565-c985b496cb9f?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export function LayoutGridDemo({ className, containerClassName }: LayoutGridDemoProps = {}) {
  return (
    <div className={containerClassName || "h-screen py-20 w-full"}>
      <LayoutGrid cards={defaultCards} />
    </div>
  );
}

export function LayoutGridGalleryPreview({ className, containerClassName }: LayoutGridGalleryPreviewProps = {}) {
  return (
    <div className={containerClassName || "h-96 w-full relative overflow-hidden rounded-lg"}>
      <LayoutGrid cards={defaultCards} />
    </div>
  );
}

// Compact skeleton components for smaller variants
const SkeletonSimple = ({ title, description }: { title: string; description: string }) => {
  return (
    <div>
      <p className="font-bold text-lg md:text-2xl text-white">{title}</p>
      <p className="font-normal text-sm my-2 max-w-lg text-neutral-200">
        {description}
      </p>
    </div>
  );
};

const portfolioCards: Card[] = [
  {
    id: 1,
    content: <SkeletonSimple title="Project Alpha" description="Modern web application with cutting-edge design" />,
    className: "md:col-span-2",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop",
  },
  {
    id: 2,
    content: <SkeletonSimple title="Mobile App" description="Cross-platform mobile solution" />,
    className: "col-span-1",
    thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2340&auto=format&fit=crop",
  },
  {
    id: 3,
    content: <SkeletonSimple title="UI Design" description="Beautiful user interface designs" />,
    className: "col-span-1",
    thumbnail: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=2340&auto=format&fit=crop",
  },
  {
    id: 4,
    content: <SkeletonSimple title="Dashboard" description="Analytics and data visualization" />,
    className: "md:col-span-2",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2340&auto=format&fit=crop",
  },
];

export function LayoutGridPortfolio({ className, containerClassName }: LayoutGridDemoProps = {}) {
  return (
    <div className={containerClassName || "h-96 w-full relative overflow-hidden rounded-lg"}>
      <LayoutGrid cards={portfolioCards} />
    </div>
  );
}

const productCards: Card[] = [
  {
    id: 1,
    content: <SkeletonSimple title="Pro Plan" description="Advanced features for power users" />,
    className: "md:col-span-2",
    thumbnail: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=2126&auto=format&fit=crop",
  },
  {
    id: 2,
    content: <SkeletonSimple title="Starter" description="Perfect for beginners" />,
    className: "col-span-1",
    thumbnail: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?q=80&w=2340&auto=format&fit=crop",
  },
  {
    id: 3,
    content: <SkeletonSimple title="Enterprise" description="Scale with confidence" />,
    className: "col-span-1",
    thumbnail: "https://images.unsplash.com/photo-1664382953518-08a87bc96c19?q=80&w=2340&auto=format&fit=crop",
  },
  {
    id: 4,
    content: <SkeletonSimple title="Custom" description="Tailored solutions for your needs" />,
    className: "md:col-span-2",
    thumbnail: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=2340&auto=format&fit=crop",
  },
];

export function LayoutGridProducts({ className, containerClassName }: LayoutGridDemoProps = {}) {
  return (
    <div className={containerClassName || "h-96 w-full relative overflow-hidden rounded-lg"}>
      <LayoutGrid cards={productCards} />
    </div>
  );
}