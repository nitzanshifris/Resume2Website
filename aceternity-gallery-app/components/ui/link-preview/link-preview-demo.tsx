"use client";
import React from "react";
import { LinkPreview } from "./link-preview-base";
import type { LinkPreviewDemoProps, LinkPreviewGalleryPreviewProps, LinkPreviewWithImageProps } from "./link-preview.types";

export function LinkPreviewDemo({ className, containerClassName }: LinkPreviewDemoProps = {}) {
  return (
    <div className={containerClassName || "flex justify-center items-center h-[40rem] flex-col px-4"}>
      <p className={className || "text-neutral-500 dark:text-neutral-400 text-xl md:text-3xl max-w-3xl mx-auto mb-10"}>
        <LinkPreview
          url="https://tailwindcss.com"
          className="font-bold bg-clip-text text-transparent bg-gradient-to-br from-purple-500 to-pink-500"
        >
          Tailwind CSS
        </LinkPreview>{" "}
        is a utility-first CSS framework for creating custom designs without
        having to leave your HTML.
      </p>
      <p className="text-neutral-500 dark:text-neutral-400 text-xl md:text-3xl max-w-3xl mx-auto">
        <LinkPreview url="https://framer.com/motion" className="font-bold">
          Framer Motion
        </LinkPreview>{" "}
        is a production-ready motion library for React from{" "}
        <LinkPreview url="https://framer.com" className="font-bold">
          Framer
        </LinkPreview>
        .
      </p>
    </div>
  );
}

export function LinkPreviewGalleryPreview({ className, containerClassName }: LinkPreviewGalleryPreviewProps = {}) {
  return (
    <div className={containerClassName || "h-96 w-full relative overflow-hidden rounded-lg bg-background flex items-center justify-center"}>
      <div className="text-center max-w-2xl mx-auto px-4">
        <p className={className || "text-neutral-500 dark:text-neutral-400 text-lg"}>
          Hover over{" "}
          <LinkPreview
            url="https://nextjs.org"
            className="font-bold bg-clip-text text-transparent bg-gradient-to-br from-purple-500 to-pink-500"
          >
            Next.js
          </LinkPreview>{" "}
          or{" "}
          <LinkPreview url="https://react.dev" className="font-bold text-blue-500">
            React
          </LinkPreview>{" "}
          to see a preview of the website.
        </p>
      </div>
    </div>
  );
}

export function LinkPreviewDemoSecond() {
  return (
    <div className="flex justify-center items-center h-[40rem] flex-col px-4">
      <p className="text-neutral-500 dark:text-neutral-400 text-xl md:text-3xl max-w-3xl mx-auto mb-10">
        <LinkPreview url="https://vercel.com" className="font-bold">
          Vercel
        </LinkPreview>{" "}
        is a cloud platform for static sites and Serverless Functions that fits
        perfectly with your workflow.
      </p>
      <p className="text-neutral-500 dark:text-neutral-400 text-xl md:text-3xl max-w-3xl mx-auto">
        Over{" "}
        <LinkPreview
          url="https://github.com"
          className="font-bold bg-clip-text text-transparent bg-gradient-to-br from-green-500 to-blue-500"
        >
          100 million developers
        </LinkPreview>{" "}
        use GitHub to build amazing things together.
      </p>
    </div>
  );
}

export function LinkPreviewWithImage({ className, containerClassName }: LinkPreviewWithImageProps = {}) {
  return (
    <div className={containerClassName || "flex justify-center items-center h-[40rem] flex-col px-4"}>
      <p className={className || "text-neutral-500 dark:text-neutral-400 text-xl md:text-3xl max-w-3xl mx-auto mb-10"}>
        <LinkPreview
          url="https://www.imdb.com/name/nm4004793"
          isStatic
          imageSrc="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&q=80"
          className="font-bold"
        >
          John Doe
        </LinkPreview>{" "}
        is an acclaimed actor known for his versatile roles in both independent
        and blockbuster films.
      </p>
      <p className="text-neutral-500 dark:text-neutral-400 text-xl md:text-3xl max-w-3xl mx-auto">
        One of the most iconic movies of all time is{" "}
        <LinkPreview
          url="https://www.imdb.com/title/tt0137523/"
          isStatic
          imageSrc="https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=400&h=250&q=80"
          className="font-bold"
        >
          Fight Club
        </LinkPreview>
        , directed by David Fincher.
      </p>
    </div>
  );
}