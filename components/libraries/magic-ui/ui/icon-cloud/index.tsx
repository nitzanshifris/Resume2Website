"use client";

import React, { useEffect, useRef, useState } from "react";
import { renderToString } from "react-dom/server";
import { cn } from "@/lib/utils";

interface Icon {
  x: number;
  y: number;
  z: number;
  scale: number;
  opacity: number;
  id: number;
}

interface IconCloudProps {
  className?: string;
  icons?: React.ReactNode[];
  images?: string[];
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function IconCloud({ className, icons = [], images = [] }: IconCloudProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [iconPositions, setIconPositions] = useState<Icon[]>([]);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [targetRotation, setTargetRotation] = useState<{
    x: number;
    y: number;
    startX: number;
    startY: number;
    distance: number;
    startTime: number;
    duration: number;
  } | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const rotationRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const iconCanvasesRef = useRef<HTMLCanvasElement[]>([]);
  const imagesLoadedRef = useRef<boolean[]>([]);
  const isDraggingRef = useRef(false);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const targetRotationRef = useRef<null | {
    x: number;
    y: number;
    startX: number;
    startY: number;
    distance: number;
    startTime: number;
    duration: number;
  }>(null);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => { isDraggingRef.current = isDragging; }, [isDragging]);
  useEffect(() => { mousePosRef.current = mousePos; }, [mousePos]);
  useEffect(() => { targetRotationRef.current = targetRotation; }, [targetRotation]);
  useEffect(() => { rotationRef.current = rotation; }, [rotation]);

  // Create icon canvases once when icons/images change
  useEffect(() => {
    // עדיפות ל־images אם קיימות, אחרת icons
    const useImages = images && images.length > 0;
    const items = useImages ? images : icons;
    imagesLoadedRef.current = new Array(items.length).fill(false);

    const newIconCanvases = items.map((item, index) => {
      const offscreen = document.createElement("canvas");
      offscreen.width = 60;
      offscreen.height = 60;
      const offCtx = offscreen.getContext("2d");

      if (offCtx) {
        if (useImages && typeof item === "string") {
          // Handle image URLs - רק אם זה string תקין
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => {
            offCtx.clearRect(0, 0, offscreen.width, offscreen.height);
            // Create circular clipping path
            offCtx.beginPath();
            offCtx.arc(30, 30, 25, 0, Math.PI * 2);
            offCtx.closePath();
            offCtx.clip();
            // Draw the image
            offCtx.drawImage(img, 5, 5, 50, 50);
            imagesLoadedRef.current[index] = true;
          };
          img.onerror = () => {
            console.warn(`Failed to load image: ${item}`);
            imagesLoadedRef.current[index] = false;
          };
          img.src = item;
        } else if (!useImages && React.isValidElement(item)) {
          // Handle SVG icons - רק אם זה ReactElement תקין
          try {
            const svgString = renderToString(item);
            const img = new Image();
            img.onload = () => {
              offCtx.clearRect(0, 0, offscreen.width, offscreen.height);
              offCtx.drawImage(img, 10, 10, 40, 40);
              imagesLoadedRef.current[index] = true;
            };
            img.onerror = () => {
              console.warn(`Failed to render SVG icon at index ${index}`);
              imagesLoadedRef.current[index] = false;
            };
            img.src = "data:image/svg+xml;base64," + btoa(svgString);
          } catch (error) {
            console.warn(`Error processing icon at index ${index}:`, error);
            imagesLoadedRef.current[index] = false;
          }
        }
      }
      return offscreen;
    });

    iconCanvasesRef.current = newIconCanvases;
  }, [icons.length, images.length]);

  // Generate initial icon positions on a sphere
  useEffect(() => {
    const items = images && images.length > 0 ? images : icons;
    const numIcons = items.length || 20;
    const newIcons: Icon[] = [];

    // Fibonacci sphere parameters
    const offset = 2 / numIcons;
    const increment = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < numIcons; i++) {
      const y = i * offset - 1 + offset / 2;
      const r = Math.sqrt(1 - y * y);
      const phi = i * increment;

      const x = Math.cos(phi) * r;
      const z = Math.sin(phi) * r;

      newIcons.push({
        x: x * 120,
        y: y * 120,
        z: z * 120,
        scale: 1,
        opacity: 1,
        id: i,
      });
    }
    setIconPositions(newIcons);
  }, [icons.length, images.length]);

  // Handle mouse events
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect || !canvasRef.current) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    iconPositions.forEach((icon) => {
      const cosX = Math.cos(rotationRef.current.x);
      const sinX = Math.sin(rotationRef.current.x);
      const cosY = Math.cos(rotationRef.current.y);
      const sinY = Math.sin(rotationRef.current.y);

      const rotatedX = icon.x * cosY - icon.z * sinY;
      const rotatedZ = icon.x * sinY + icon.z * cosY;
      const rotatedY = icon.y * cosX + rotatedZ * sinX;

      const screenX = canvasRef.current!.width / 2 + rotatedX;
      const screenY = canvasRef.current!.height / 2 + rotatedY;

      const scale = (rotatedZ + 200) / 300;
      const radius = 20 * scale;
      const dx = x - screenX;
      const dy = y - screenY;

      if (dx * dx + dy * dy < radius * radius) {
        const targetX = -Math.atan2(
          icon.y,
          Math.sqrt(icon.x * icon.x + icon.z * icon.z),
        );
        const targetY = Math.atan2(icon.x, icon.z);

        const currentX = rotationRef.current.x;
        const currentY = rotationRef.current.y;
        const distance = Math.sqrt(
          Math.pow(targetX - currentX, 2) + Math.pow(targetY - currentY, 2),
        );

        const duration = Math.min(2000, Math.max(800, distance * 1000));

        setTargetRotation({
          x: targetX,
          y: targetY,
          startX: currentX,
          startY: currentY,
          distance,
          startTime: performance.now(),
          duration,
        });
        return;
      }
    });

    setIsDragging(true);
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePos({ x, y });
    }

    if (isDragging) {
      const deltaX = e.clientX - lastMousePosRef.current.x;
      const deltaY = e.clientY - lastMousePosRef.current.y;

      rotationRef.current = {
        x: rotationRef.current.x + deltaY * 0.002,
        y: rotationRef.current.y + deltaX * 0.002,
      };

      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Animation and rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const animate = () => {
      // סיבוב אוטומטי
      rotationRef.current.y += 0.005;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // ציור האייקונים עם פרספקטיבה תלת-ממדית
      iconPositions.forEach((icon, index) => {
        const iconCanvas = iconCanvasesRef.current[index];
        if (!iconCanvas || !imagesLoadedRef.current[index]) return;

        // Apply 3D rotation
        const cosX = Math.cos(rotationRef.current.x);
        const sinX = Math.sin(rotationRef.current.x);
        const cosY = Math.cos(rotationRef.current.y);
        const sinY = Math.sin(rotationRef.current.y);

        // Rotate around Y axis first, then X axis
        const rotatedX = icon.x * cosY - icon.z * sinY;
        const rotatedZ = icon.x * sinY + icon.z * cosY;
        const rotatedY = icon.y * cosX - rotatedZ * sinX;
        const finalZ = icon.y * sinX + rotatedZ * cosX;

        // Project to 2D with perspective
        const perspective = 300;
        const scale = perspective / (perspective + finalZ);
        const screenX = canvas.width / 2 + rotatedX * scale;
        const screenY = canvas.height / 2 + rotatedY * scale;

        // Calculate opacity based on Z position
        const opacity = Math.max(0.3, Math.min(1, (finalZ + 150) / 300));

        // Draw the icon
        ctx.save();
        ctx.globalAlpha = opacity;
        const size = 30 * scale;
        ctx.drawImage(
          iconCanvas,
          screenX - size / 2,
          screenY - size / 2,
          size,
          size
        );
        ctx.restore();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [iconPositions]);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={600}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={cn("rounded-lg", className)}
      aria-label="Interactive 3D Icon Cloud"
      role="img"
    />
  );
}

export default IconCloud; 