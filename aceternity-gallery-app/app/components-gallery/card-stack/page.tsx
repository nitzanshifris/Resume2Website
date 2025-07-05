"use client";

import { CardStackDemo } from "@/component-library/components/ui/card-stack";

export default function CardStackPage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Card Stack</h1>
        <p className="text-gray-400 mb-12 text-center">Cards stack on top of each other after some interval. Perfect for showing testimonials.</p>
        <CardStackDemo />
      </div>
    </div>
  );
}