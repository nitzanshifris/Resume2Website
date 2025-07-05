"use client";
import React from "react";
import { PinContainer } from "./3d-pin-base";

export function AnimatedPinWithImage() {
  return (
    <div className="h-[40rem] w-full flex items-center justify-center ">
      <PinContainer
        title="/portfolio.com"
        href="#"
      >
        <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[20rem] h-[20rem] ">
          <h3 className="max-w-xs !pb-2 !m-0 font-bold text-base text-slate-100">
            Portfolio Project
          </h3>
          <div className="text-base !m-0 !p-0 font-normal">
            <span className="text-slate-500 ">
              A showcase of creative work and technical expertise
            </span>
          </div>
          <div className="flex flex-1 w-full rounded-lg mt-4 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=500&h=500&fit=crop"
              alt="Portfolio preview"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </PinContainer>
    </div>
  );
}