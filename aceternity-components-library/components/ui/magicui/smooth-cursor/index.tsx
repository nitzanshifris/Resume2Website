"use client";

import { motion, useSpring } from "motion/react";
import { FC, JSX, useEffect, useRef, useState } from "react";

interface Position {
  x: number;
  y: number;
}

export interface SmoothCursorProps {
  cursor?: JSX.Element;
  springConfig?: {
    damping: number;
    stiffness: number;
    mass: number;
    restDelta: number;
  };
}

const DefaultCursorSVG: FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={50}
      height={54}
      viewBox="0 0 50 54"
      fill="none"
      style={{ scale: 0.5 }}
    >
      <g filter="url(#filter0_d_91_7928)">
        <path
          d="M42.6817 41.1495L27.5103 6.79925C26.7269 5.02557 24.2082 5.02558 23.3927 6.79925L7.59814 41.1495C6.75833 42.9759 8.52712 44.8902 10.4125 44.1954L24.3757 39.0496C24.8829 38.8627 25.4385 38.8627 25.9422 39.0496L39.8121 44.1954C41.6849 44.8902 43.4884 42.9759 42.6817 41.1495Z"
          fill="black"
        />
        <path
          d="M43.7146 40.6933L28.5431 6.34306C27.3556 3.65428 23.5772 3.69516 22.3668 6.32755L6.57226 40.6778C5.3134 43.4122 7.70095 46.0329 10.5457 44.9734L24.5054 39.8276C24.8087 39.7126 25.1374 39.7126 25.4372 39.8276L39.3072 44.9734C42.1418 46.0329 44.5582 43.4122 43.3184 40.6933H43.7146Z"
          stroke="white"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_91_7928"
          x="0.900879"
          y="0.896912"
          width="48.6026"
          height="52.7417"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="1" />
          <feGaussianBlur stdDeviation="3" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.0470588 0 0 0 0 0.0470588 0 0 0 0 0.0509804 0 0 0 0.08 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_91_7928"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_91_7928"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};

export function SmoothCursor({
  cursor = <DefaultCursorSVG />,
  springConfig = {
    damping: 45,
    stiffness: 400,
    mass: 1,
    restDelta: 0.001,
  },
}: SmoothCursorProps) {
  const [isMoving, setIsMoving] = useState(false);
  const lastMousePos = useRef<Position>({ x: 0, y: 0 });
  const velocity = useRef<Position>({ x: 0, y: 0 });
  const lastUpdateTime = useRef(Date.now());
  const previousAngle = useRef(0);
  const accumulatedRotation = useRef(0);

  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);
  const rotation = useSpring(0, {
    ...springConfig,
    damping: 60,
    stiffness: 300,
  });
  const scale = useSpring(1, {
    ...springConfig,
    damping: 50,
    stiffness: 350,
  });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastUpdateTime.current;

      const deltaX = e.clientX - lastMousePos.current.x;
      const deltaY = e.clientY - lastMousePos.current.y;

      if (deltaTime > 0) {
        velocity.current.x = deltaX / deltaTime;
        velocity.current.y = deltaY / deltaTime;
      }

      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      const currentAngle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
      let angleDiff = currentAngle - previousAngle.current;

      if (angleDiff > 180) angleDiff -= 360;
      if (angleDiff < -180) angleDiff += 360;

      accumulatedRotation.current += angleDiff * 0.5;
      accumulatedRotation.current *= 0.95;
      rotation.set(accumulatedRotation.current);

      previousAngle.current = currentAngle;
      lastMousePos.current = { x: e.clientX, y: e.clientY };
      lastUpdateTime.current = currentTime;

      setIsMoving(true);
      scale.set(1.1);

      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsMoving(false);
        scale.set(1);
        const decayRotation = () => {
          accumulatedRotation.current *= 0.95;
          rotation.set(accumulatedRotation.current);

          if (Math.abs(accumulatedRotation.current) > 0.1) {
            animationFrameId = requestAnimationFrame(decayRotation);
          }
        };
        decayRotation();
      }, 150);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent("mousemove", {
          clientX: touch.clientX,
          clientY: touch.clientY,
        });
        handleMouseMove(mouseEvent);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      clearTimeout(timeoutId);
      cancelAnimationFrame(animationFrameId);
    };
  }, [cursorX, cursorY, rotation, scale]);

  useEffect(() => {
    document.body.style.cursor = "none";
    return () => {
      document.body.style.cursor = "";
    };
  }, []);

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[9999]"
      style={{
        x: cursorX,
        y: cursorY,
        rotate: rotation,
        scale,
      }}
    >
      <motion.div
        animate={{
          scale: isMoving ? 0.8 : 1,
        }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 300,
        }}
        className="-translate-x-1/2 -translate-y-1/2"
      >
        {cursor}
      </motion.div>
    </motion.div>
  );
}