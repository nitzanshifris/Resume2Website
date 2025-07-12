import React from 'react';
import { DynamicBox } from '../components/ui/dynamic-box';

interface DynamicPlaygroundProps {
  Component: React.ComponentType<any>;
  items: any[];
  maxCols?: number;
  cardWidth?: number;
  cardHeight?: number;
  background?: string;
}

/**
 * Generic playground that displays a grid of draggable/resizable cards rendered by `Component`.
 * Meant for Storybook dynamic demos. Keeps API minimal intentionally.
 */
export const DynamicPlayground: React.FC<DynamicPlaygroundProps> = ({
  Component,
  items,
  maxCols = 3,
  cardWidth = 300,
  cardHeight = 300,
  background = '#0d0d0d',
  ...rest
}) => {
  const cols = Math.min(maxCols, items.length);
  const colWidth = Math.floor(100 / cols);

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden p-8"
      style={{ background }}
    >
      {items.map((item, idx) => (
        <DynamicBox
          key={idx}
          mode="absolute"
          draggable
          resizable
          bounds="body"
          initialX={50 + (idx % cols) * (cardWidth + 40)}
          initialY={50 + Math.floor(idx / cols) * (cardHeight + 40)}
          initialWidth={cardWidth}
          initialHeight={cardHeight}
          showOutline={false}
        >
          <Component {...rest} items={[item]} />
        </DynamicBox>
      ))}
    </div>
  );
}; 