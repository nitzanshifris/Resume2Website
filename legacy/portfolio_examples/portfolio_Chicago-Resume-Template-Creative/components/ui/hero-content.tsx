import React from 'react';

interface HeroContentProps {
  data: {
    title?: string;
    subtitle?: string;
    description?: string;
  };
}

export function HeroContent({ data }: HeroContentProps) {
  return (
    <>
      <p className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200">
        {data.subtitle || ''}
      </p>
      <h1 className="text-4xl md:text-6xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600">
        {data.title || 'Portfolio'}
      </h1>
      <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mt-4 max-w-lg text-center">
        {data.description || ''}
      </p>
    </>
  );
}