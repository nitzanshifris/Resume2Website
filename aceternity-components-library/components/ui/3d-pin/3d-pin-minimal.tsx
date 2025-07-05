"use client";
import React from "react";
import { PinContainer } from "./3d-pin-base";

export function AnimatedPinMinimal() {
  return (
    <div className="h-[40rem] w-full flex items-center justify-center ">
      <PinContainer
        title="/github.com"
        href="#"
        containerClassName="w-[20rem]"
      >
        <div className="flex basis-full flex-col p-8 tracking-tight text-slate-100/50 sm:basis-1/2 w-full h-[12rem] ">
          <h3 className="max-w-xs !pb-2 !m-0 font-bold text-xl text-center text-slate-100">
            Open Source
          </h3>
          <div className="text-base !m-0 !p-0 font-normal text-center mt-4">
            <span className="text-slate-400 text-lg">
              Contributing to the community
            </span>
          </div>
          <div className="flex items-center justify-center mt-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
              <span className="text-2xl">🚀</span>
            </div>
          </div>
        </div>
      </PinContainer>
    </div>
  );
}