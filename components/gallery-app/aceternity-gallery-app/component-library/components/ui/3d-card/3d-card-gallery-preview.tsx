"use client";
import React from "react";
import { CardBody, CardContainer, CardItem } from "./3d-card-base";

// Gallery-specific preview components with consistent sizing
export function ThreeDCardGalleryBasic() {
  return (
    <div className="flex justify-center items-center p-8 h-[32rem]">
      <CardContainer className="inter-var">
        <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border">
          <CardItem
            translateZ="50"
            className="text-xl font-bold text-neutral-600 dark:text-white"
          >
            3D Card Effect
          </CardItem>
          <CardItem
            as="p"
            translateZ="60"
            className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
          >
            Hover over this card to experience the 3D effect and depth perception.
          </CardItem>
          <CardItem translateZ="100" className="w-full mt-4">
            <img
              src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              height="1000"
              width="1000"
              className="h-40 w-full object-cover rounded-xl group-hover/card:shadow-xl"
              alt="3D Card thumbnail"
            />
          </CardItem>
          <div className="flex justify-between items-center mt-6">
            <CardItem
              translateZ={20}
              as="button"
              className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
            >
              Learn More →
            </CardItem>
            <CardItem
              translateZ={20}
              as="button"
              className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
            >
              Get Started
            </CardItem>
          </div>
        </CardBody>
      </CardContainer>
    </div>
  );
}

export function ThreeDCardGalleryProduct() {
  return (
    <div className="flex justify-center items-center p-8 h-[32rem]">
      <CardContainer className="inter-var">
        <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-blue-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border">
          <CardItem
            translateZ="50"
            className="text-xl font-bold text-neutral-600 dark:text-white"
          >
            Premium Product
          </CardItem>
          <CardItem
            as="p"
            translateZ="60"
            className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
          >
            Experience our premium product with stunning 3D visualization and interactive elements.
          </CardItem>
          <CardItem translateZ="100" className="w-full mt-4">
            <div className="h-40 w-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl group-hover/card:shadow-xl flex items-center justify-center">
              <div className="text-white text-center">
                <div className="text-3xl mb-2">💎</div>
                <div className="text-lg font-bold">Premium</div>
              </div>
            </div>
          </CardItem>
          <div className="flex justify-between items-center mt-6">
            <CardItem
              translateZ={20}
              className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
            >
              $99/month
            </CardItem>
            <CardItem
              translateZ={20}
              as="button"
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
            >
              Subscribe
            </CardItem>
          </div>
        </CardBody>
      </CardContainer>
    </div>
  );
}

export function ThreeDCardGalleryPortfolio() {
  return (
    <div className="flex justify-center items-center p-8 h-[32rem]">
      <CardContainer className="inter-var">
        <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-purple-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border">
          <CardItem
            translateZ="50"
            className="text-xl font-bold text-neutral-600 dark:text-white"
          >
            Portfolio Project
          </CardItem>
          <CardItem
            as="p"
            translateZ="60"
            className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
          >
            Interactive 3D card perfect for showcasing portfolio projects with depth and style.
          </CardItem>
          <CardItem translateZ="100" className="w-full mt-4">
            <div className="h-40 w-full bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-xl group-hover/card:shadow-xl flex items-center justify-center">
              <div className="text-white text-center">
                <div className="text-3xl mb-2">🎨</div>
                <div className="text-lg font-bold">Creative Work</div>
              </div>
            </div>
          </CardItem>
          <div className="flex justify-between items-center mt-6">
            <CardItem
              translateZ={20}
              className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white flex items-center gap-1"
            >
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Live Project
            </CardItem>
            <CardItem
              translateZ={20}
              as="button"
              className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700"
            >
              View Project
            </CardItem>
          </div>
        </CardBody>
      </CardContainer>
    </div>
  );
}

export function ThreeDCardGalleryMinimal() {
  return (
    <div className="flex justify-center items-center p-8 h-[32rem]">
      <CardContainer className="inter-var">
        <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-gray-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[25rem] h-auto rounded-xl p-6 border">
          <CardItem
            translateZ="50"
            className="text-lg font-bold text-neutral-600 dark:text-white"
          >
            Minimal Card
          </CardItem>
          <CardItem
            as="p"
            translateZ="60"
            className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
          >
            Clean and simple 3D card design for minimal aesthetics.
          </CardItem>
          <CardItem translateZ="80" className="w-full mt-6">
            <div className="h-1 w-full bg-gradient-to-r from-gray-300 to-gray-500 rounded-full"></div>
          </CardItem>
          <div className="flex justify-center mt-6">
            <CardItem
              translateZ={20}
              as="button"
              className="px-6 py-2 rounded-xl bg-gray-800 dark:bg-white dark:text-black text-white text-xs font-bold"
            >
              Simple Action
            </CardItem>
          </div>
        </CardBody>
      </CardContainer>
    </div>
  );
}