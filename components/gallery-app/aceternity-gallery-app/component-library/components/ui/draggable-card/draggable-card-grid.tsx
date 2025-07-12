"use client";
import React from "react";
import {
  DraggableCardBody,
  DraggableCardContainer,
} from "./draggable-card-base";

export function DraggableCardGrid() {
  return (
    <DraggableCardContainer className="relative my-10 flex min-h-screen w-full justify-center overflow-clip">
      <div className="grid w-full max-w-5xl grid-cols-1 items-center justify-center gap-10 md:grid-cols-3">
        <Container>
          <DraggableCardBody>
            <img
              src="https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=3634&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Some mountains"
              className="pointer-events-none relative z-10 h-80 w-full object-cover"
            />
            <p className="mt-4 text-center text-2xl font-bold text-neutral-700 dark:text-neutral-300">
              How
            </p>
          </DraggableCardBody>
        </Container>
        <Container>
          <DraggableCardBody>
            <img
              src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=3506&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Some mountains"
              className="pointer-events-none relative z-10 h-80 w-full object-cover"
            />
            <p className="mt-4 text-center text-2xl font-bold text-neutral-700 dark:text-neutral-300">
              You
            </p>
          </DraggableCardBody>
        </Container>
        <Container>
          <DraggableCardBody>
            <img
              src="https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=3072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Some mountains"
              className="pointer-events-none relative z-10 h-80 w-full object-cover"
            />
            <p className="mt-4 text-center text-2xl font-bold text-neutral-700 dark:text-neutral-300">
              Doin
            </p>
          </DraggableCardBody>
        </Container>
      </div>
    </DraggableCardContainer>
  );
}

const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex items-center justify-center rounded-lg bg-gray-200 dark:bg-neutral-800">
      {children}
    </div>
  );
};