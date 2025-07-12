// @ts-nocheck
import "@cv2web/design-tokens/theme.css";
import "../packages/new-renderer/src/app/globals.css";
import React from "react";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    expanded: true,
  },
};

export const decorators = [
  (Story, context) => {
    const {
      textSize,
      color,
      className: extraClass = "",
      style: extraStyle = {},
    } = context.args || {};

    const element = Story(context.args);

    // Compute extra Tailwind font-size class.
    const sizeClass = textSize ? `text-${textSize}` : "";

    // Merge classes: original component className + size class + any arg-provided className.
    const mergedClass = [element.props?.className, sizeClass, extraClass]
      .filter(Boolean)
      .join(" ");

    // Merge inline styles and color.
    const mergedStyle = { ...element.props?.style, ...extraStyle };
    if (color) mergedStyle.color = color;

    return React.cloneElement(element, {
      className: mergedClass || undefined,
      style: Object.keys(mergedStyle).length ? mergedStyle : undefined,
    });
  },
]; 