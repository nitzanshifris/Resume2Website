"use client";
import React from "react";
import { PinContainer } from "./3d-pin-base";

// Gallery-specific preview components with consistent sizing
export function ThreeDPinGalleryBasic() {
  return (
    <div className="flex items-center justify-center p-8 h-[32rem]">
      <PinContainer
        title="3D Pin Effect"
        href="#"
        className=""
      >
        <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[20rem] h-[24rem]">
          <h3 className="max-w-xs !pb-2 !m-0 font-bold text-base text-slate-100">
            Interactive 3D Pin
          </h3>
          <div className="text-base !m-0 !p-0 font-normal">
            <span className="text-slate-500">
              Hover over this pin to see the stunning 3D transformation effect
            </span>
          </div>
          <div className="flex flex-1 w-full rounded-lg mt-4 bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500" />
        </div>
      </PinContainer>
    </div>
  );
}

export function ThreeDPinGalleryProduct() {
  return (
    <div className="flex items-center justify-center p-8 h-[32rem]">
      <PinContainer
        title="Product Showcase"
        href="#"
        className=""
      >
        <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[20rem] h-[24rem]">
          <h3 className="max-w-xs !pb-2 !m-0 font-bold text-base text-slate-100">
            Premium Product
          </h3>
          <div className="text-base !m-0 !p-0 font-normal">
            <span className="text-slate-500">
              Perfect for showcasing products with an elegant 3D hover effect
            </span>
          </div>
          <div className="flex flex-1 w-full rounded-lg mt-4 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="text-4xl mb-2">📦</div>
              <div className="text-lg font-bold">Product</div>
            </div>
          </div>
        </div>
      </PinContainer>
    </div>
  );
}

export function ThreeDPinGalleryPortfolio() {
  return (
    <div className="flex items-center justify-center p-8 h-[32rem]">
      <PinContainer
        title="Portfolio Project"
        href="#"
        className=""
      >
        <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[20rem] h-[24rem]">
          <h3 className="max-w-xs !pb-2 !m-0 font-bold text-base text-slate-100">
            Creative Project
          </h3>
          <div className="text-base !m-0 !p-0 font-normal">
            <span className="text-slate-500">
              Showcase your portfolio projects with interactive 3D pins
            </span>
          </div>
          <div className="flex flex-1 w-full rounded-lg mt-4 bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="text-4xl mb-2">🎨</div>
              <div className="text-lg font-bold">Design</div>
            </div>
          </div>
        </div>
      </PinContainer>
    </div>
  );
}

export function ThreeDPinGalleryMinimal() {
  return (
    <div className="flex items-center justify-center p-8 h-[32rem]">
      <PinContainer
        title="Minimal Pin"
        href="#"
        className=""
      >
        <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[18rem] h-[22rem]">
          <h3 className="max-w-xs !pb-2 !m-0 font-bold text-base text-slate-100">
            Simple & Clean
          </h3>
          <div className="text-base !m-0 !p-0 font-normal">
            <span className="text-slate-500">
              Minimal design with maximum impact
            </span>
          </div>
          <div className="flex flex-1 w-full rounded-lg mt-4 bg-gradient-to-br from-gray-500 via-gray-600 to-gray-700 flex items-center justify-center">
            <div className="w-16 h-16 bg-white rounded-full opacity-80"></div>
          </div>
        </div>
      </PinContainer>
    </div>
  );
}