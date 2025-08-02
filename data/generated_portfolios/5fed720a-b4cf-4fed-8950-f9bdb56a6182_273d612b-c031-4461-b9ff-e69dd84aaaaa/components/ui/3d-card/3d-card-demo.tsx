"use client";

import React from "react";
import { CardBody, CardItem } from "./3d-card-base";
import { EnhancedCardContainer, FullscreenSafeCard } from "./3d-card-enhanced";

export function ThreeDCardDemo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
      {/* Normalized Method - Best for all sizes */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">Normalized Method (Recommended)</h3>
        <p className="text-sm text-neutral-400">Consistent rotation regardless of card size</p>
        <EnhancedCardContainer
          rotationMethod="normalized"
          maxRotationX={15}
          maxRotationY={15}
          className="inter-var"
        >
          <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-auto rounded-xl p-6 border">
            <CardItem
              translateZ="50"
              className="text-xl font-bold text-neutral-600 dark:text-white"
            >
              Normalized Rotation
            </CardItem>
            <CardItem
              as="p"
              translateZ="60"
              className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
            >
              This method calculates rotation based on normalized mouse position (0-1 range).
              Perfect for responsive layouts and fullscreen modals.
            </CardItem>
            <CardItem translateZ="100" className="w-full mt-4">
              <div className="h-40 w-full bg-gradient-to-br from-emerald-500 to-blue-500 rounded-xl" />
            </CardItem>
          </CardBody>
        </EnhancedCardContainer>
      </div>

      {/* Dynamic Constraint Method */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">Dynamic Constraint</h3>
        <p className="text-sm text-neutral-400">Scales rotation constraint with card size</p>
        <EnhancedCardContainer
          rotationMethod="dynamic-constraint"
          maxRotationX={15}
          maxRotationY={15}
          className="inter-var"
        >
          <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-purple-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-auto rounded-xl p-6 border">
            <CardItem
              translateZ="50"
              className="text-xl font-bold text-neutral-600 dark:text-white"
            >
              Dynamic Constraint
            </CardItem>
            <CardItem
              as="p"
              translateZ="60"
              className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
            >
              Automatically adjusts the rotation divisor based on container dimensions.
              Good balance between effect and control.
            </CardItem>
            <CardItem translateZ="100" className="w-full mt-4">
              <div className="h-40 w-full bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl" />
            </CardItem>
          </CardBody>
        </EnhancedCardContainer>
      </div>

      {/* Fullscreen Safe Version */}
      <div className="space-y-4 md:col-span-2">
        <h3 className="text-xl font-bold text-white">Fullscreen Safe Card</h3>
        <p className="text-sm text-neutral-400">Optimized for large containers with reduced rotation intensity</p>
        <FullscreenSafeCard className="inter-var">
          <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-amber-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full max-w-4xl mx-auto h-auto rounded-xl p-8 border">
            <CardItem
              translateZ="50"
              className="text-2xl font-bold text-neutral-600 dark:text-white"
            >
              Fullscreen Optimized
            </CardItem>
            <CardItem
              as="p"
              translateZ="60"
              className="text-neutral-500 text-base max-w-2xl mt-3 dark:text-neutral-300"
            >
              This card is specifically designed for fullscreen or modal views. It has reduced maximum rotation
              angles (10°) and lower intensity (0.7) to prevent the extreme distortion you experienced.
              The larger perspective value (1200px) also helps create a more subtle effect.
            </CardItem>
            <CardItem translateZ="100" className="w-full mt-6">
              <div className="h-60 w-full bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl" />
            </CardItem>
            <div className="flex justify-between items-center mt-8">
              <CardItem
                translateZ={20}
                translateX={-40}
                as="button"
                className="px-6 py-3 rounded-xl text-sm font-normal dark:text-white"
              >
                View Details →
              </CardItem>
              <CardItem
                translateZ={20}
                translateX={40}
                as="button"
                className="px-6 py-3 rounded-xl bg-black dark:bg-white dark:text-black text-white text-sm font-bold"
              >
                Get Started
              </CardItem>
            </div>
          </CardBody>
        </FullscreenSafeCard>
      </div>
    </div>
  );
}