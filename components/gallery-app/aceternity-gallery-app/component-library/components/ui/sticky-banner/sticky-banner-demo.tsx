"use client";
import React from "react";
import { StickyBanner } from "./sticky-banner-base";
 
export function StickyBannerDemo() {
  return (
    <div className="relative flex h-[60vh] w-full flex-col overflow-y-auto">
      <StickyBanner className="bg-gradient-to-b from-blue-500 to-blue-600">
        <p className="mx-0 max-w-[90%] text-white drop-shadow-md">
          Announcing $10M seed funding from project mayhem ventures.{" "}
          <a href="#" className="transition duration-200 hover:underline">
            Read announcement
          </a>
        </p>
      </StickyBanner>
      <DummyContent />
    </div>
  );
}

export function StickyBannerHideOnScroll() {
  return (
    <div className="relative flex h-[60vh] w-full flex-col overflow-y-auto">
      <StickyBanner 
        className="bg-gradient-to-b from-purple-500 to-purple-600"
        hideOnScroll={true}
      >
        <p className="mx-0 max-w-[90%] text-white drop-shadow-md">
          This banner will hide when you scroll down.{" "}
          <a href="#" className="transition duration-200 hover:underline">
            Learn more
          </a>
        </p>
      </StickyBanner>
      <DummyContent />
    </div>
  );
}

export function StickyBannerDark() {
  return (
    <div className="relative flex h-[60vh] w-full flex-col overflow-y-auto">
      <StickyBanner className="bg-gradient-to-b from-gray-800 to-gray-900">
        <p className="mx-0 max-w-[90%] text-white drop-shadow-md">
          Important: System maintenance scheduled for tonight.{" "}
          <a href="#" className="transition duration-200 hover:underline">
            View details
          </a>
        </p>
      </StickyBanner>
      <DummyContent />
    </div>
  );
}

export function StickyBannerSuccess() {
  return (
    <div className="relative flex h-[60vh] w-full flex-col overflow-y-auto">
      <StickyBanner className="bg-gradient-to-b from-green-500 to-green-600">
        <p className="mx-0 max-w-[90%] text-white drop-shadow-md">
          🎉 Successfully deployed to production!{" "}
          <a href="#" className="transition duration-200 hover:underline">
            View deployment
          </a>
        </p>
      </StickyBanner>
      <DummyContent />
    </div>
  );
}

export function StickyBannerWarning() {
  return (
    <div className="relative flex h-[60vh] w-full flex-col overflow-y-auto">
      <StickyBanner className="bg-gradient-to-b from-yellow-500 to-yellow-600">
        <p className="mx-0 max-w-[90%] text-white drop-shadow-md">
          ⚠️ Limited time offer: 50% off all plans.{" "}
          <a href="#" className="transition duration-200 hover:underline">
            Upgrade now
          </a>
        </p>
      </StickyBanner>
      <DummyContent />
    </div>
  );
}
 
const DummyContent = () => {
  return (
    <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-10 py-8">
      <div className="h-96 w-full animate-pulse rounded-lg bg-neutral-100 dark:bg-neutral-800" />
      <div className="h-96 w-full animate-pulse rounded-lg bg-neutral-100 dark:bg-neutral-800" />
      <div className="h-96 w-full animate-pulse rounded-lg bg-neutral-100 dark:bg-neutral-800" />
    </div>
  );
};