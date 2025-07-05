"use client";
import React from "react";
import { BackgroundBeamsWithCollision } from "./background-beams-with-collision-base";

export function BackgroundBeamsWithCollisionMinimal() {
  return (
    <BackgroundBeamsWithCollision className="h-[30rem]">
      <div className="relative z-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-black dark:text-white">
          Collision Beams
        </h1>
        <p className="mt-4 text-gray-600 dark:text-gray-300">
          Beams that explode on impact
        </p>
      </div>
    </BackgroundBeamsWithCollision>
  );
}