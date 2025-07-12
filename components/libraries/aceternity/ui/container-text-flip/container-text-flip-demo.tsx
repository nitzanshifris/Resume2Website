"use client";
import React from "react";
import { ContainerTextFlip } from "./container-text-flip-base";

export function ContainerTextFlipDemo() {
  return (
    <ContainerTextFlip
      words={["better", "modern", "Tyler Durden", "awesome"]}
    />
  );
}