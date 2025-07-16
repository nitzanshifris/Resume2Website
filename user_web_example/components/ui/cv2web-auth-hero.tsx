"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  Globe, 
  Palette, 
  Zap, 
  Sparkles, 
  Star, 
  Code, 
  Rocket,
  Download,
  Eye,
  Share2,
  User
} from "lucide-react";

// Utility function for className merging
const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

// Particles Component for CV2WEB
interface ParticlesProps {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  size?: number;
  refresh?: boolean;
  color?: string;
  vx?: number;
  vy?: number;
}

interface MousePosition {
  x: number;
  y: number;
}

function useMousePosition(): MousePosition {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return mousePosition;
}

function hexToRgb(hex: string): number[] {
  hex = hex.replace("#", "");

  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  const hexInt = parseInt(hex, 16);
  const red = (hexInt >> 16) & 255;
  const green = (hexInt >> 8) & 255;
  const blue = hexInt & 255;
  return [red, green, blue];
}

const CV2WebParticles: React.FC<ParticlesProps> = ({
  className = "",
  quantity = 120,
  staticity = 50,
  ease = 50,
  size = 0.4,
  refresh = false,
  color = "#ffffff",
  vx = 0,
  vy = 0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const circles = useRef<Circle[]>([]);
  const mousePosition = useMousePosition();
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;

  useEffect(() => {
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext("2d");
    }
    initCanvas();
    animate();
    window.addEventListener("resize", initCanvas);

    return () => {
      window.removeEventListener("resize", initCanvas);
    };
  }, [color]);

  useEffect(() => {
    onMouseMove();
  }, [mousePosition.x, mousePosition.y]);

  useEffect(() => {
    initCanvas();
  }, [refresh]);

  const initCanvas = () => {
    resizeCanvas();
    drawParticles();
  };

  const onMouseMove = () => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const { w, h } = canvasSize.current;
      const x = mousePosition.x - rect.left - w / 2;
      const y = mousePosition.y - rect.top - h / 2;
      const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2;
      if (inside) {
        mouse.current.x = x;
        mouse.current.y = y;
      }
    }
  };

  type Circle = {
    x: number;
    y: number;
    translateX: number;
    translateY: number;
    size: number;
    alpha: number;
    targetAlpha: number;
    dx: number;
    dy: number;
    magnetism: number;
  };

  const resizeCanvas = () => {
    if (canvasContainerRef.current && canvasRef.current && context.current) {
      circles.current.length = 0;
      canvasSize.current.w = canvasContainerRef.current.offsetWidth;
      canvasSize.current.h = canvasContainerRef.current.offsetHeight;
      canvasRef.current.width = canvasSize.current.w * dpr;
      canvasRef.current.height = canvasSize.current.h * dpr;
      canvasRef.current.style.width = `${canvasSize.current.w}px`;
      canvasRef.current.style.height = `${canvasSize.current.h}px`;
      context.current.scale(dpr, dpr);
    }
  };

  const circleParams = (): Circle => {
    const x = Math.floor(Math.random() * canvasSize.current.w);
    const y = Math.floor(Math.random() * canvasSize.current.h);
    const translateX = 0;
    const translateY = 0;
    const pSize = Math.floor(Math.random() * 2) + size;
    const alpha = 0;
    const targetAlpha = parseFloat((Math.random() * 0.6 + 0.1).toFixed(1));
    const dx = (Math.random() - 0.5) * 0.1;
    const dy = (Math.random() - 0.5) * 0.1;
    const magnetism = 0.1 + Math.random() * 4;
    return {
      x,
      y,
      translateX,
      translateY,
      size: pSize,
      alpha,
      targetAlpha,
      dx,
      dy,
      magnetism,
    };
  };

  const rgb = hexToRgb(color);

  const drawCircle = (circle: Circle, update = false) => {
    if (context.current) {
      const { x, y, translateX, translateY, size, alpha } = circle;
      context.current.translate(translateX, translateY);
      context.current.beginPath();
      context.current.arc(x, y, size, 0, 2 * Math.PI);
      context.current.fillStyle = `rgba(${rgb.join(", ")}, ${alpha})`;
      context.current.fill();
      context.current.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!update) {
        circles.current.push(circle);
      }
    }
  };

  const clearContext = () => {
    if (context.current) {
      context.current.clearRect(
        0,
        0,
        canvasSize.current.w,
        canvasSize.current.h,
      );
    }
  };

  const drawParticles = () => {
    clearContext();
    const particleCount = quantity;
    for (let i = 0; i < particleCount; i++) {
      const circle = circleParams();
      drawCircle(circle);
    }
  };

  const remapValue = (
    value: number,
    start1: number,
    end1: number,
    start2: number,
    end2: number,
  ): number => {
    const remapped =
      ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
    return remapped > 0 ? remapped : 0;
  };

  const animate = () => {
    clearContext();
    circles.current.forEach((circle: Circle, i: number) => {
      const edge = [
        circle.x + circle.translateX - circle.size,
        canvasSize.current.w - circle.x - circle.translateX - circle.size,
        circle.y + circle.translateY - circle.size,
        canvasSize.current.h - circle.y - circle.translateY - circle.size,
      ];
      const closestEdge = edge.reduce((a, b) => Math.min(a, b));
      const remapClosestEdge = parseFloat(
        remapValue(closestEdge, 0, 20, 0, 1).toFixed(2),
      );
      if (remapClosestEdge > 1) {
        circle.alpha += 0.02;
        if (circle.alpha > circle.targetAlpha) {
          circle.alpha = circle.targetAlpha;
        }
      } else {
        circle.alpha = circle.targetAlpha * remapClosestEdge;
      }
      circle.x += circle.dx + vx;
      circle.y += circle.dy + vy;
      circle.translateX +=
        (mouse.current.x / (staticity / circle.magnetism) - circle.translateX) /
        ease;
      circle.translateY +=
        (mouse.current.y / (staticity / circle.magnetism) - circle.translateY) /
        ease;

      drawCircle(circle, true);

      if (
        circle.x < -circle.size ||
        circle.x > canvasSize.current.w + circle.size ||
        circle.y < -circle.size ||
        circle.y > canvasSize.current.h + circle.size
      ) {
        circles.current.splice(i, 1);
        const newCircle = circleParams();
        drawCircle(newCircle);
      }
    });
    window.requestAnimationFrame(animate);
  };

  return (
    <div
      className={cn("pointer-events-none", className)}
      ref={canvasContainerRef}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="size-full" />
    </div>
  );
};

// CV2WEB Orbiting Icons Component
interface CV2WebOrbitingIconsProps {
  className?: string;
  children: React.ReactNode;
  reverse?: boolean;
  duration?: number;
  delay?: number;
  radius?: number;
  path?: boolean;
}

const CV2WebOrbitingIcons: React.FC<CV2WebOrbitingIconsProps> = ({
  className,
  children,
  reverse = false,
  duration = 20,
  delay = 10,
  radius = 50,
  path = true,
}) => {
  return (
    <>
      {path && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          className="pointer-events-none absolute inset-0 size-full"
        >
          <circle
            className="stroke-white/10 stroke-1"
            cx="50%"
            cy="50%"
            r={radius}
            fill="none"
          />
        </svg>
      )}
      <div
        style={
          {
            "--duration": duration,
            "--radius": radius,
            "--delay": -delay,
          } as React.CSSProperties
        }
        className={cn(
          "absolute flex size-full transform-gpu animate-orbit items-center justify-center rounded-full border bg-white/10 [animation-delay:calc(var(--delay)*1000ms)]",
          reverse ? "[animation-direction:reverse]" : "",
          className
        )}
      >
        {children}
      </div>
    </>
  );
};

// Main CV2Web Auth Hero Component
const CV2WebAuthHero: React.FC = () => {
  const [isTransformed, setIsTransformed] = useState(false);

  // Cycle transformation every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransformed(prev => !prev);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Minimal floating elements - focus on transformation
  const portfolioElements = [
    {
      element: (
        <div className="bg-white/15 backdrop-blur-sm rounded-md p-1.5 border border-emerald-300/30">
          <div className="text-[8px] text-emerald-200 font-mono">&lt;/&gt;</div>
        </div>
      ),
      radius: 90,
      duration: 30,
      delay: 0,
    },
    {
      element: (
        <div className="bg-white/15 backdrop-blur-sm rounded-md p-1.5 border border-sky-300/30">
          <div className="w-2 h-2 bg-gradient-to-br from-sky-300 to-blue-300 rounded-sm"></div>
        </div>
      ),
      radius: 90,
      duration: 30,
      delay: 15,
    },
    {
      element: (
        <div className="bg-white/15 backdrop-blur-sm rounded-md p-1.5 border border-purple-300/30">
          <div className="text-[8px] text-purple-200 font-mono">{ }</div>
        </div>
      ),
      radius: 110,
      duration: 35,
      delay: 8,
    },
  ];

  // Floating skills/achievements
  const floatingTexts = [
    { text: "React", x: "15%", y: "20%", delay: 0 },
    { text: "Senior Dev", x: "85%", y: "30%", delay: 2 },
    { text: "TypeScript", x: "10%", y: "75%", delay: 4 },
    { text: "5+ Years", x: "80%", y: "85%", delay: 6 },
    { text: "UI/UX", x: "20%", y: "95%", delay: 8 },
  ];

  return (
    <div className="w-1/2 max-lg:hidden relative bg-gradient-to-br from-slate-900 via-emerald-900 via-sky-900 to-slate-900">
      {/* Particles Background */}
      <CV2WebParticles
        className="absolute inset-0"
        quantity={100}
        ease={60}
        color="#ffffff"
        size={0.3}
        refresh
      />
      
      {/* CV to Website Transformation Animation */}
      <div className="absolute inset-8 flex items-center justify-center">
        <div className="relative w-80 h-80">
          {/* Central Transforming Element - ENHANCED */}
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
            animate={isTransformed ? { 
              scale: [1, 1.1, 1], 
              rotateY: [0, 10, 0],
              rotateX: [0, 5, 0]
            } : { 
              scale: [1, 0.95, 1],
              rotateY: [0, -10, 0],
              rotateX: [0, -5, 0]
            }}
            transition={{ duration: 2, ease: "easeInOut" }}
          >
            <AnimatePresence mode="wait">
              {isTransformed ? (
                // Website Layout - LARGER & MORE DETAILED
                <motion.div 
                  key="website"
                  initial={{ opacity: 0, scale: 0.7, rotateY: -90 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.7, rotateY: 90 }}
                  transition={{ duration: 1, ease: "backOut" }}
                  className="w-32 h-40 bg-gradient-to-br from-emerald-500 via-sky-400 to-blue-600 rounded-xl p-3 shadow-2xl border border-white/40"
                >
                  <div className="bg-white/95 rounded-lg h-full flex flex-col p-2">
                    {/* Website Header */}
                    <div className="h-2 bg-gradient-to-r from-emerald-500 to-sky-500 rounded mb-1.5"></div>
                    {/* Navigation */}
                    <div className="flex gap-1 mb-2">
                      <div className="h-1 bg-gray-300 rounded flex-1"></div>
                      <div className="h-1 bg-gray-300 rounded flex-1"></div>
                      <div className="h-1 bg-gray-300 rounded flex-1"></div>
                    </div>
                    {/* Hero Section */}
                    <div className="h-3 bg-gradient-to-r from-purple-200 to-blue-200 rounded mb-1"></div>
                    {/* Content Grid */}
                    <div className="flex-1 grid grid-cols-2 gap-1 mb-1">
                      <div className="bg-gradient-to-br from-emerald-200 to-emerald-300 rounded"></div>
                      <div className="bg-gradient-to-br from-sky-200 to-sky-300 rounded"></div>
                    </div>
                    {/* Footer */}
                    <div className="h-1.5 bg-gradient-to-r from-yellow-200 via-orange-200 to-pink-200 rounded"></div>
                  </div>
                </motion.div>
              ) : (
                // CV Document - LARGER & MORE DETAILED  
                <motion.div 
                  key="cv"
                  initial={{ opacity: 0, scale: 0.7, rotateY: 90 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.7, rotateY: -90 }}
                  transition={{ duration: 1, ease: "backOut" }}
                  className="w-28 h-36 bg-white rounded-xl shadow-2xl p-3 border-2 border-gray-200"
                >
                  <div className="text-[8px] text-gray-800 font-bold mb-1.5">John Doe</div>
                  <div className="text-[6px] text-gray-600 mb-1">Senior Developer</div>
                  <div className="h-px bg-gray-400 mb-2"></div>
                  
                  {/* CV Sections */}
                  <div className="space-y-1">
                    <div className="text-[5px] text-emerald-600 font-bold mb-0.5">EXPERIENCE</div>
                    <div className="space-y-0.5">
                      <div className="h-0.5 bg-gray-500 rounded w-full"></div>
                      <div className="h-0.5 bg-gray-400 rounded w-4/5"></div>
                      <div className="h-0.5 bg-gray-400 rounded w-3/4"></div>
                    </div>
                    
                    <div className="text-[5px] text-emerald-600 font-bold mb-0.5 mt-1.5">SKILLS</div>
                    <div className="flex gap-0.5 flex-wrap">
                      <div className="w-3 h-0.5 bg-blue-400 rounded"></div>
                      <div className="w-4 h-0.5 bg-green-400 rounded"></div>
                      <div className="w-2 h-0.5 bg-purple-400 rounded"></div>
                    </div>
                  </div>
                  
                  <div className="mt-2 flex items-center justify-between">
                    <div className="text-[7px] text-emerald-600 font-bold">CV</div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          
          {/* Floating Portfolio Elements */}
          {portfolioElements.map((item, index) => (
            <motion.div
              key={index}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              animate={{
                x: [
                  Math.cos((index * 60) * Math.PI / 180) * item.radius,
                  Math.cos((index * 60 + 60) * Math.PI / 180) * item.radius,
                  Math.cos((index * 60 + 120) * Math.PI / 180) * item.radius,
                  Math.cos((index * 60 + 180) * Math.PI / 180) * item.radius,
                  Math.cos((index * 60 + 240) * Math.PI / 180) * item.radius,
                  Math.cos((index * 60 + 300) * Math.PI / 180) * item.radius,
                  Math.cos((index * 60) * Math.PI / 180) * item.radius,
                ],
                y: [
                  Math.sin((index * 60) * Math.PI / 180) * item.radius,
                  Math.sin((index * 60 + 60) * Math.PI / 180) * item.radius,
                  Math.sin((index * 60 + 120) * Math.PI / 180) * item.radius,
                  Math.sin((index * 60 + 180) * Math.PI / 180) * item.radius,
                  Math.sin((index * 60 + 240) * Math.PI / 180) * item.radius,
                  Math.sin((index * 60 + 300) * Math.PI / 180) * item.radius,
                  Math.sin((index * 60) * Math.PI / 180) * item.radius,
                ],
              }}
              transition={{
                duration: item.duration,
                ease: "linear",
                repeat: Infinity,
                delay: item.delay,
              }}
            >
              {item.element}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Enhanced CV Transformation Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Transformation rays/lines */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 w-px h-16 bg-gradient-to-t from-transparent via-white/30 to-transparent origin-bottom"
            style={{
              transform: `translate(-50%, -100%) rotate(${i * 45}deg)`,
            }}
            animate={{
              scaleY: isTransformed ? [0, 1, 0] : [0, 0.5, 0],
              opacity: isTransformed ? [0, 0.8, 0] : [0, 0.3, 0],
            }}
            transition={{
              duration: 2,
              delay: i * 0.1,
              repeat: Infinity,
              repeatDelay: 2,
            }}
          />
        ))}
        
        {/* Pulsing transformation indicator */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-white/20"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
      
      {/* CV2WEB Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/10 via-sky-500/10 to-transparent" />
      
      {/* CV2WEB Content */}
      <div className="relative z-10 flex flex-col justify-center p-8 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white via-emerald-200 via-sky-200 to-blue-200 bg-clip-text text-transparent leading-tight">
            Watch Your CV Transform Into a Digital Masterpiece
          </h1>
          <p className="text-lg text-gray-300 mb-6 leading-relaxed">
            Experience the magic as your traditional resume becomes an interactive portfolio website. 
            AI-powered transformation that brings your professional story to life.
          </p>
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 via-sky-400 to-blue-600 border-2 border-white/20"
                />
              ))}
            </div>
            <span className="text-xs text-gray-400">
              Join 10,000+ professionals already using CV2WEB
            </span>
          </div>
          
          {/* CV2WEB Features */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-emerald-300">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs">Document to Website Magic</span>
            </div>
            <div className="flex items-center space-x-2 text-sky-300">
              <Rocket className="w-4 h-4" />
              <span className="text-xs">Live Transformation Preview</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-300">
              <Code className="w-4 h-4" />
              <span className="text-xs">Interactive Portfolio Elements</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// CSS for animations (will be injected)
const CV2WebAuthStyles = `
  @keyframes orbit {
    0% {
      transform: rotate(0deg) translateY(calc(var(--radius) * 1px)) rotate(0deg);
    }
    100% {
      transform: rotate(360deg) translateY(calc(var(--radius) * 1px)) rotate(-360deg);
    }
  }

  .animate-orbit {
    animation: orbit calc(var(--duration) * 1s) linear infinite;
  }
`;

// Inject styles if in browser
if (typeof document !== 'undefined') {
  const existingStyle = document.getElementById('cv2web-auth-styles');
  if (!existingStyle) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'cv2web-auth-styles';
    styleSheet.textContent = CV2WebAuthStyles;
    document.head.appendChild(styleSheet);
  }
}

export default CV2WebAuthHero;
export { CV2WebParticles, CV2WebOrbitingIcons };