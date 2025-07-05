"use client";
import React from "react";
import { Spotlight } from "./spotlight-new-base";
 
export function SpotlightNewDemo() {
  return (
    <div className="h-[40rem] w-full rounded-md flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <Spotlight />
      <div className=" p-4 max-w-7xl  mx-auto relative z-10  w-full pt-20 md:pt-0">
        <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
          Spotlight <br /> which is not overused.
        </h1>
        <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
          A subtle yet effective spotlight effect, because the previous version
          is used a bit too much these days.
        </p>
      </div>
    </div>
  );
}

export function SpotlightCustomColors() {
  return (
    <div className="h-[40rem] w-full rounded-md flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <Spotlight 
        gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(280, 100%, 85%, .08) 0, hsla(280, 100%, 55%, .02) 50%, hsla(280, 100%, 45%, 0) 80%)"
        gradientSecond="radial-gradient(50% 50% at 50% 50%, hsla(280, 100%, 85%, .06) 0, hsla(280, 100%, 55%, .02) 80%, transparent 100%)"
        gradientThird="radial-gradient(50% 50% at 50% 50%, hsla(280, 100%, 85%, .04) 0, hsla(280, 100%, 45%, .02) 80%, transparent 100%)"
      />
      <div className=" p-4 max-w-7xl  mx-auto relative z-10  w-full pt-20 md:pt-0">
        <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-purple-50 to-purple-400 bg-opacity-50">
          Custom <br /> Purple Spotlight.
        </h1>
        <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
          Customize the gradient colors to match your brand or design theme.
        </p>
      </div>
    </div>
  );
}

export function SpotlightFast() {
  return (
    <div className="h-[40rem] w-full rounded-md flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <Spotlight 
        duration={3}
        xOffset={200}
      />
      <div className=" p-4 max-w-7xl  mx-auto relative z-10  w-full pt-20 md:pt-0">
        <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
          Fast <br /> Moving Spotlight.
        </h1>
        <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
          Increased animation speed and offset for more dynamic movement.
        </p>
      </div>
    </div>
  );
}

export function SpotlightSubtle() {
  return (
    <div className="h-[40rem] w-full rounded-md flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <Spotlight 
        gradientFirst="radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(210, 100%, 85%, .04) 0, hsla(210, 100%, 55%, .01) 50%, hsla(210, 100%, 45%, 0) 80%)"
        gradientSecond="radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .03) 0, hsla(210, 100%, 55%, .01) 80%, transparent 100%)"
        gradientThird="radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .02) 0, hsla(210, 100%, 45%, .01) 80%, transparent 100%)"
        duration={10}
        xOffset={50}
      />
      <div className=" p-4 max-w-7xl  mx-auto relative z-10  w-full pt-20 md:pt-0">
        <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
          Subtle <br /> Ambient Light.
        </h1>
        <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
          Lower opacity and slower movement for a more subtle effect.
        </p>
      </div>
    </div>
  );
}

export function SpotlightLarge() {
  return (
    <div className="h-[40rem] w-full rounded-md flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <Spotlight 
        width={800}
        smallWidth={350}
        translateY={-250}
      />
      <div className=" p-4 max-w-7xl  mx-auto relative z-10  w-full pt-20 md:pt-0">
        <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
          Large <br /> Spotlight Effect.
        </h1>
        <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
          Bigger spotlight beams for more coverage and dramatic impact.
        </p>
      </div>
    </div>
  );
}