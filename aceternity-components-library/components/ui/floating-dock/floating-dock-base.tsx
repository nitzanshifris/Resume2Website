"use client";

import React, { useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "motion/react";
import Link from "next/link";
import { cn } from "../../lib/utils";
import { FloatingDockProps, FloatingDockDesktopProps, FloatingDockMobileProps, IconContainerProps, FloatingDockItem } from "./floating-dock.types";

// Default items to prevent crashes when no items are provided
const defaultItems: FloatingDockItem[] = [
  {
    title: "Home",
    icon: () => <div className="w-4 h-4 bg-gray-400 rounded-sm" />,
    href: "/",
  },
];

export function FloatingDock({
  items = defaultItems,
  desktopClassName,
  mobileClassName,
  position = "bottom",
}: FloatingDockProps & { position?: "top" | "bottom" | "left" | "right" }) {
  return (
    <>
      <FloatingDockDesktop items={items} className={desktopClassName} position={position} />
      <FloatingDockMobile items={items} className={mobileClassName} />
    </>
  );
}

export function FloatingDockMobile({
  items = defaultItems,
  className,
}: FloatingDockMobileProps) {
  const [open, setOpen] = useState(false);
  
  return (
    <div className={cn("relative block md:hidden", className)}>
      <AnimatePresence>
        {open && (
          <motion.div
            layoutId="nav"
            className="absolute bottom-full mb-2 inset-x-0 flex flex-col gap-2"
          >
            {items.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: 10,
                  transition: {
                    delay: idx * 0.05,
                  },
                }}
                transition={{ delay: (items.length - 1 - idx) * 0.05 }}
              >
                <Link
                  href={item.href}
                  key={item.title}
                  className="h-10 w-10 rounded-full bg-gray-50 dark:bg-neutral-900 flex items-center justify-center"
                >
                  <div className="h-4 w-4">
                    <IconContainer icon={item.icon} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen(!open)}
        className="h-10 w-10 rounded-full bg-gray-50 dark:bg-neutral-800 flex items-center justify-center"
      >
        <div className="h-4 w-4">
          {items.length > 0 && items[0]?.icon ? (
            <IconContainer icon={items[0].icon} />
          ) : (
            <div className="w-4 h-4 bg-gray-400 rounded-sm" />
          )}
        </div>
      </button>
    </div>
  );
}

export function FloatingDockDesktop({
  items = defaultItems,
  className,
  position = "bottom",
}: FloatingDockDesktopProps & { position?: "top" | "bottom" | "left" | "right" }) {
  const mouseX = useMotionValue(Infinity);

  const positionStyles = {
    top: "top-4 left-1/2 -translate-x-1/2 flex-row",
    bottom: "bottom-4 left-1/2 -translate-x-1/2 flex-row",
    left: "left-4 top-1/2 -translate-y-1/2 flex-col",
    right: "right-4 top-1/2 -translate-y-1/2 flex-col",
  };

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "fixed hidden md:flex gap-4 items-center rounded-2xl bg-gray-50 dark:bg-neutral-900 px-4 py-3",
        positionStyles[position],
        className
      )}
    >
      {items.map((item) => (
        <IconContainer key={item.title} mouseX={mouseX} {...item} />
      ))}
    </motion.div>
  );
}

function IconContainer({
  mouseX,
  title,
  icon,
  href,
}: {
  mouseX?: any;
  title?: string;
  icon: any;
  href?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX || useMotionValue(0), (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  const heightTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);

  const widthTransformIcon = useTransform(distance, [-150, 0, 150], [20, 40, 20]);
  const heightTransformIcon = useTransform(distance, [-150, 0, 150], [20, 40, 20]);

  const width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  const height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  const heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const [hovered, setHovered] = useState(false);

  const IconComponent = icon;

  if (!href || !title) {
    return (
      <div className="aspect-square rounded-full bg-gray-200 dark:bg-neutral-800 flex items-center justify-center">
        {IconComponent && <IconComponent className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />}
      </div>
    );
  }

  return (
    <Link href={href}>
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="aspect-square rounded-full bg-gray-200 dark:bg-neutral-800 flex items-center justify-center relative"
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 2, x: "-50%" }}
              className="px-2 py-0.5 whitespace-pre rounded-md bg-gray-100 border dark:bg-neutral-800 dark:border-neutral-900 dark:text-white border-gray-200 text-neutral-700 absolute left-1/2 -translate-x-1/2 -top-8 w-fit text-xs"
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className="flex items-center justify-center"
        >
          {IconComponent && <IconComponent className="text-neutral-500 dark:text-neutral-400" />}
        </motion.div>
      </motion.div>
    </Link>
  );
}