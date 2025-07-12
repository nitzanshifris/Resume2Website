"use client";
import React from "react";
import {
  TextRevealCard,
  TextRevealCardDescription,
  TextRevealCardTitle,
} from "./text-reveal-card-base";

export function TextRevealCardPreview() {
  return (
    <div className="flex items-center justify-center bg-[#0E0E10] h-[40rem] rounded-2xl w-full">
      <TextRevealCard
        text="You know the business"
        revealText="I know the chemistry "
      >
        <TextRevealCardTitle>
          Sometimes, you just need to see it.
        </TextRevealCardTitle>
        <TextRevealCardDescription>
          This is a text reveal card. Hover over the card to reveal the hidden
          text.
        </TextRevealCardDescription>
      </TextRevealCard>
    </div>
  );
}

export function TextRevealCardShort() {
  return (
    <div className="flex items-center justify-center bg-[#0E0E10] h-[30rem] rounded-2xl w-full">
      <TextRevealCard
        text="Dream big"
        revealText="Work hard"
        className="w-[30rem]"
      >
        <TextRevealCardTitle>
          Short and Sweet
        </TextRevealCardTitle>
        <TextRevealCardDescription>
          A compact version with shorter text.
        </TextRevealCardDescription>
      </TextRevealCard>
    </div>
  );
}

export function TextRevealCardLong() {
  return (
    <div className="flex items-center justify-center bg-[#0E0E10] h-[40rem] rounded-2xl w-full">
      <TextRevealCard
        text="Innovation distinguishes"
        revealText="Leaders from followers"
        className="w-[45rem]"
      >
        <TextRevealCardTitle>
          Think Different
        </TextRevealCardTitle>
        <TextRevealCardDescription>
          Innovation is the ability to see change as an opportunity - not a threat.
          Move your mouse across to reveal the complete message.
        </TextRevealCardDescription>
      </TextRevealCard>
    </div>
  );
}

export function TextRevealCardColorful() {
  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900 h-[40rem] rounded-2xl w-full">
      <TextRevealCard
        text="Create with passion"
        revealText="Design with purpose"
        className="bg-[#1a1a2e] border-purple-500/20"
      >
        <TextRevealCardTitle className="text-purple-300">
          Creative Vision
        </TextRevealCardTitle>
        <TextRevealCardDescription className="text-purple-200/70">
          Where creativity meets functionality. Hover to reveal our design philosophy.
        </TextRevealCardDescription>
      </TextRevealCard>
    </div>
  );
}

export function TextRevealCardMinimal() {
  return (
    <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-900 h-[30rem] rounded-2xl w-full">
      <TextRevealCard
        text="Less is more"
        revealText="Simplicity wins"
        className="bg-white dark:bg-black border-gray-200 dark:border-gray-800 w-[35rem]"
      >
        <TextRevealCardTitle className="text-gray-900 dark:text-gray-100">
          Minimalist Approach
        </TextRevealCardTitle>
        <TextRevealCardDescription className="text-gray-600 dark:text-gray-400">
          Clean, simple, effective design.
        </TextRevealCardDescription>
      </TextRevealCard>
    </div>
  );
}