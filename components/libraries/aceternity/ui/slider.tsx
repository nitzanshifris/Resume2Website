"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

export interface SliderProps {
  value?: number[];
  onValueChange?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  ({ value = [0], onValueChange, min = 0, max = 100, step = 1, disabled = false, className }, ref) => {
    const [internalValue, setInternalValue] = React.useState(value);
    
    React.useEffect(() => {
      setInternalValue(value);
    }, [value]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = [Number(event.target.value)];
      setInternalValue(newValue);
      onValueChange?.(newValue);
    };

    const percentage = ((internalValue[0] - min) / (max - min)) * 100;

    return (
      <div ref={ref} className={cn("relative flex w-full touch-none select-none items-center", className)}>
        <div className="relative h-2 w-full grow overflow-hidden rounded-full bg-zinc-700">
          <div 
            className="absolute h-full bg-blue-600 transition-all" 
            style={{ width: `${percentage}%` }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={internalValue[0]}
          onChange={handleChange}
          disabled={disabled}
          className="absolute inset-0 h-2 w-full cursor-pointer appearance-none bg-transparent opacity-0"
        />
        <div 
          className="absolute block h-5 w-5 rounded-full border-2 border-blue-600 bg-white ring-offset-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          style={{ left: `calc(${percentage}% - 10px)` }}
        />
      </div>
    );
  }
);
Slider.displayName = "Slider";

export { Slider };