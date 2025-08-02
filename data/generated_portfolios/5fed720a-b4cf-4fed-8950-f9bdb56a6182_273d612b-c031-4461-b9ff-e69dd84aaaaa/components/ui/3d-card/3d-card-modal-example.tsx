"use client";

import React, { useState } from "react";
import { CardBody, CardItem } from "./3d-card-base";
import { EnhancedCardContainer } from "./3d-card-enhanced";
import { X } from "lucide-react";

export function ThreeDCardModalExample() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const CardContent = ({ isFullscreen = false }: { isFullscreen?: boolean }) => (
    <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-blue-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-auto rounded-xl p-6 border">
      <CardItem
        translateZ="50"
        className={`${isFullscreen ? "text-2xl" : "text-xl"} font-bold text-neutral-600 dark:text-white`}
      >
        Interactive 3D Card
      </CardItem>
      <CardItem
        as="p"
        translateZ="60"
        className={`text-neutral-500 ${isFullscreen ? "text-base" : "text-sm"} max-w-sm mt-2 dark:text-neutral-300`}
      >
        {isFullscreen 
          ? "In fullscreen mode, the rotation is limited to prevent extreme distortion. Notice how the effect remains subtle even when hovering near the edges."
          : "Click to view this card in fullscreen with optimized rotation settings."
        }
      </CardItem>
      <CardItem translateZ="100" className="w-full mt-4">
        <img
          src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop"
          className={`${isFullscreen ? "h-80" : "h-60"} w-full object-cover rounded-xl`}
          alt="Nature"
        />
      </CardItem>
    </CardBody>
  );

  return (
    <>
      {/* Regular Card */}
      <div className="max-w-md mx-auto cursor-pointer" onClick={() => setIsModalOpen(true)}>
        <EnhancedCardContainer
          rotationMethod="normalized"
          maxRotationX={15}
          maxRotationY={15}
        >
          <CardContent />
        </EnhancedCardContainer>
      </div>

      {/* Modal with Fullscreen Card */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute -top-12 right-0 p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
            
            <EnhancedCardContainer
              rotationMethod="normalized"
              maxRotationX={10}  // Reduced for fullscreen
              maxRotationY={10}  // Reduced for fullscreen
              rotationIntensity={0.7}  // Lower intensity
              perspective={1500}  // Higher perspective for subtler effect
            >
              <CardContent isFullscreen />
            </EnhancedCardContainer>
          </div>
        </div>
      )}
    </>
  );
}