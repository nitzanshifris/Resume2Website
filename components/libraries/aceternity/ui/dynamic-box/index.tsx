"use client";
import React, { CSSProperties } from "react";
// @ts-ignore – react-rnd has its own types but linter may not resolve before installation
import { Rnd } from "react-rnd";
import { cn } from "../../lib/utils";

export interface DynamicBoxProps {
  /** Children to render inside the box */
  children: React.ReactNode;
  /** Layout mode. 'flow' – regular document flow. 'absolute' – positioned absolutely & can be dragged / resized. */
  mode?: "flow" | "absolute";
  /** Enable dragging (only applies in `absolute` mode) */
  draggable?: boolean;
  /** Enable resizing (only applies in `absolute` mode) */
  resizable?: boolean;
  /** Initial left offset (px) in absolute mode */
  initialX?: number;
  /** Initial top offset (px) in absolute mode */
  initialY?: number;
  /** Initial width (px or css value) */
  initialWidth?: number | string;
  /** Initial height (px or css value) */
  initialHeight?: number | string;
  /** Extra class names */
  className?: string;
  /** Inline styles */
  style?: CSSProperties;
  /** Bounds for dragging, same as react-rnd bounds prop */
  bounds?: "parent" | "window" | string;
  /** Show a visible dashed outline around wrapper for easier manipulation */
  showOutline?: boolean;
  /** Callback invoked whenever drag / resize ends */
  onLayoutChange?: (layout: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) => void;
  /** Controlled position (overrides internal) */
  position?: { x: number; y: number };
  /** Controlled size */
  controlledSize?: { width: number | string; height: number | string };
}

export const DynamicBox: React.FC<DynamicBoxProps> = ({
  children,
  mode = "flow",
  draggable = true,
  resizable = true,
  initialX = 0,
  initialY = 0,
  initialWidth = "auto",
  initialHeight = "auto",
  className,
  style,
  bounds = "parent",
  showOutline = false,
  onLayoutChange,
  position,
  controlledSize,
}) => {
  if (mode === "absolute") {
    return (
      <Rnd
        bounds={bounds}
        default={{
          x: initialX,
          y: initialY,
          width: initialWidth,
          height: initialHeight,
        }}
        position={position}
        size={controlledSize}
        enableResizing={resizable ? { top:true,right:true,bottom:true,left:true,topRight:true,bottomRight:true,bottomLeft:true,topLeft:true } : false }
        disableDragging={!draggable}
        style={{
          ...(showOutline ? { border: "1px dashed #888" } : {}),
          ...style,
        }}
        handleStyles={{
          bottomRight: { width: 14, height: 14, right: -7, bottom: -7, background: "#888", borderRadius: 2, zIndex:50 },
          bottomLeft: { width: 14, height: 14, left: -7, bottom: -7, background: "#888", borderRadius: 2, zIndex:50 },
          topLeft: { width: 14, height: 14, left: -7, top: -7, background: "#888", borderRadius: 2, zIndex:50 },
          topRight: { width: 14, height: 14, right: -7, top: -7, background: "#888", borderRadius: 2, zIndex:50 },
          top: { height: 10, top: -5, left: 18, right: 18, background: "#888", zIndex:50 },
          bottom: { height: 10, bottom: -5, left: 18, right: 18, background: "#888", zIndex:50 },
          left: { width: 10, left: -5, top: 18, bottom: 18, background: "#888", zIndex:50 },
          right: { width: 10, right: -5, top: 18, bottom: 18, background: "#888", zIndex:50 },
        }}
        onDragStop={(_, d) =>
          onLayoutChange?.({
            x: d.x,
            y: d.y,
            width: d.node.offsetWidth,
            height: d.node.offsetHeight,
          })
        }
        onResizeStop={(_, __, ref, ___, pos) =>
          onLayoutChange?.({
            x: pos.x,
            y: pos.y,
            width: ref.offsetWidth,
            height: ref.offsetHeight,
          })
        }
        className={cn(className)}
      >
        {children}
      </Rnd>
    );
  }

  // Flow (static) mode – just render a wrapper div.
  const flowStyle = showOutline ? { border: "1px dashed #888", ...style } : style;
  return (
    <div className={cn(className)} style={flowStyle}>
      {children}
    </div>
  );
}; 