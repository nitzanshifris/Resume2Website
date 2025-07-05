"use client";
import React from "react";
import { ContainerScroll } from "./container-scroll-animation-base";

export function ProductScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-black dark:text-white">
              Introducing our latest <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
                Product Innovation
              </span>
            </h1>
          </>
        }
      >
        <div className="h-full w-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 flex items-center justify-center rounded-2xl">
          <div className="text-center p-8">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Product Dashboard</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
              Experience the next generation of product analytics
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">98%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Satisfaction</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
                <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">50k+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Users</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">4.9</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Rating</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
                <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">24/7</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Support</div>
              </div>
            </div>
          </div>
        </div>
      </ContainerScroll>
    </div>
  );
}