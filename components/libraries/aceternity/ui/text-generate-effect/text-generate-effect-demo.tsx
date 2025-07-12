"use client";
import { TextGenerateEffect } from "./text-generate-effect-base";

const words = `Oxygen gets you high. In a catastrophic emergency, we're taking giant, panicked breaths. Suddenly you become euphoric, docile. You accept your fate. It's all right here. Emergency water landing, six hundred miles an hour. Blank faces, calm as Hindu cows`;

export function TextGenerateEffectDemo() {
  return <TextGenerateEffect words={words} />;
}

export function TextGenerateEffectWithoutFilter() {
  return <TextGenerateEffect duration={2} filter={false} words={words} />;
}

export function TextGenerateEffectFast() {
  return <TextGenerateEffect duration={0.3} words="Fast text generation with quick animation timing." />;
}

export function TextGenerateEffectSlow() {
  return <TextGenerateEffect duration={1} words="Slow and dramatic text generation for maximum impact." />;
}

export function TextGenerateEffectShort() {
  return <TextGenerateEffect words="Short and sweet text effect." />;
}