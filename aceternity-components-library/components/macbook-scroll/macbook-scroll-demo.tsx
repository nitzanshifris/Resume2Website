"use client";
import { MacBookScroll } from "@/components/ui/macbook-scroll";
import React from "react";

// Demo 1: Default
export function MacBookScrollDemo() {
  return (
    <div className="overflow-hidden dark:bg-[#0B0B0F] bg-white w-full">
      <MacBookScroll
        title={
          <span>
            This Macbook is built with Tailwindcss. <br /> No kidding.
          </span>
        }
        badge={<Badge className="h-10 w-10 transform -rotate-12" />}
        src={`https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2071&auto=format&fit=crop`}
        showGradient={false}
      />
    </div>
  );
}

// Demo 2: Portfolio Variant
export function MacBookScrollPortfolioDemo() {
  return (
    <div className="overflow-hidden dark:bg-[#0B0B0F] bg-white w-full">
      <MacBookScroll
        title={
          <span>
            John Doe <br /> Full Stack Developer
          </span>
        }
        src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop"
        showGradient={false}
      />
    </div>
  );
}

// Demo 3: Product Demo Variant
export function MacBookScrollProductDemo() {
  return (
    <div className="overflow-hidden dark:bg-[#0B0B0F] bg-white w-full">
      <MacBookScroll
        title="Revolutionary SaaS Platform"
        src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
        showGradient={true}
      />
    </div>
  );
}

// Demo 4: Hero Variant
export function MacBookScrollHeroDemo() {
  return (
    <div className="overflow-hidden dark:bg-[#0B0B0F] bg-white w-full">
      <MacBookScroll
        title={
          <span className="text-4xl md:text-5xl font-bold">
            Welcome to the Future <br /> 
            <span className="text-2xl md:text-3xl">of Web Development</span>
          </span>
        }
        src="https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?q=80&w=2070&auto=format&fit=crop"
        showGradient={false}
        badge={<TechBadge />}
      />
    </div>
  );
}

// Peerlist logo badge
const Badge = ({ className }: { className?: string }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M56 28C56 43.464 43.464 56 28 56C12.536 56 0 43.464 0 28C0 12.536 12.536 0 28 0C43.464 0 56 12.536 56 28Z"
        fill="#00AA45"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M28 54C42.3594 54 54 42.3594 54 28C54 13.6406 42.3594 2 28 2C13.6406 2 2 13.6406 2 28C2 42.3594 13.6406 54 28 54ZM28 56C43.464 56 56 43.464 56 28C56 12.536 43.464 0 28 0C12.536 0 0 12.536 0 28C0 43.464 12.536 56 28 56Z"
        fill="#219653"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M27.0769 12H15V46H24.3846V38.8889H27.0769C34.7305 38.8889 41 32.9048 41 25.4444C41 17.984 34.7305 12 27.0769 12ZM24.3846 29.7778V21.1111H27.0769C29.6194 21.1111 31.6154 23.0864 31.6154 25.4444C31.6154 27.8024 29.6194 29.7778 27.0769 29.7778H24.3846Z"
        fill="#24292E"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18 12H29.0769C36.2141 12 42 17.5014 42 24.4444C42 31.3875 36.2141 36.8889 29.0769 36.8889H25.3846V44H18V12ZM25.3846 19.1111H29.0769C32.1357 19.1111 34.6154 21.5829 34.6154 24.4444C34.6154 27.306 32.1357 29.7778 29.0769 29.7778H25.3846V19.1111Z"
        fill="white"
      ></path>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17 11H29.0769C36.7305 11 43 16.984 43 24.4444C43 31.9048 36.7305 37.8889 29.0769 37.8889H26.3846V45H17V11ZM19 13V43H24.3846V35.8889H29.0769C35.6978 35.8889 41 30.7298 41 24.4444C41 18.1591 35.6978 13 29.0769 13H19ZM24.3846 17.1111H29.0769C33.6521 17.1111 37.6154 20.9114 37.6154 24.4444C37.6154 27.9775 33.6521 31.7778 29.0769 31.7778H24.3846V17.1111ZM26.3846 19.1111V29.7778H29.0769C32.1357 29.7778 34.6154 27.306 34.6154 24.4444C34.6154 21.5829 32.1357 19.1111 29.0769 19.1111H26.3846Z"
        fill="#24292E"
      ></path>
    </svg>
  );
};

// Tech badge for hero variant
const TechBadge = () => {
  return (
    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
      <span className="text-white text-sm font-medium">Powered by</span>
      <span className="text-white font-bold">React & TypeScript</span>
    </div>
  );
};