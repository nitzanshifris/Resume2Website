"use client";
import { MultiStepLoader } from "./multi-step-loader-base";

const loadingStates = [
  {
    text: "Buying a condo",
  },
  {
    text: "Travelling around the world",
  },
  {
    text: "Meeting Elon Musk",
  },
  {
    text: "Building a spaceship",
  },
  {
    text: "Going to the moon",
  },
  {
    text: "Planting flag on moon",
  },
  {
    text: "Celebrating on moon",
  },
];

export function MultiStepLoaderDemo() {
  return (
    <div className="w-full h-[60vh] flex items-center justify-center">
      <MultiStepLoader loadingStates={loadingStates} loading={true} duration={2000} />
    </div>
  );
}