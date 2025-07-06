"use client";

import { cn } from "@/lib/utils";

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  delay?: number;
}

export function BorderBeam({
  className,
  size = 200,
  duration = 15,
  delay = 0,
}: BorderBeamProps) {
  return (
    <div
      style={{
        "--size": size,
        "--duration": duration,
        "--delay": delay,
      } as React.CSSProperties}
      className={cn(
        "absolute inset-0 rounded-[inherit] [mask-image:linear-gradient(to_bottom,white,transparent,white)]",
        className,
      )}
    >
      <div
        className="absolute inset-0 rounded-[inherit] border border-transparent"
        style={{
          background: `linear-gradient(90deg, transparent, #3b82f6, transparent) border-box`,
          mask: `linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)`,
          maskComposite: "exclude",
          animation: `border-beam ${duration}s linear ${delay}s infinite`,
        }}
      />
    </div>
  );
}