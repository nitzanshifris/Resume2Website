"use client";

import React from "react";
import { EvervaultCard, Icon } from "./evervault-card-base";

export function EvervaultCardGalleryPreview() {
  return (
    <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-black to-gray-900 rounded-lg overflow-hidden">
      <div className="border border-white/[0.2] flex flex-col items-start w-40 h-48 p-3 relative">
        <Icon className="absolute h-4 w-4 -top-2 -left-2 text-white" />
        <Icon className="absolute h-4 w-4 -bottom-2 -left-2 text-white" />
        <Icon className="absolute h-4 w-4 -top-2 -right-2 text-white" />
        <Icon className="absolute h-4 w-4 -bottom-2 -right-2 text-white" />

        <div className="h-24 w-full scale-75">
          <EvervaultCard text="hover" />
        </div>

        <p className="text-white text-xs mt-2">
          Hover for effect
        </p>
      </div>
    </div>
  );
}