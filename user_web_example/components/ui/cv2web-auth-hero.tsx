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
  const [currentCVIndex, setCurrentCVIndex] = useState(0);
  const [activeCardSet, setActiveCardSet] = useState(0);

  // CV Examples with diverse professionals
  const cvExamples = [
    {
      name: "Sarah Chen",
      role: "Product Designer",
      years: "7+ Years",
      skills: ["Figma", "Design Systems", "User Research"],
      color: "from-purple-500 to-pink-500",
      initials: "SC",
      cvColor: "bg-purple-50",
      cvAccent: "bg-purple-600",
      email: "sarah.chen@email.com",
      phone: "+1 (555) 123-4567"
    },
    {
      name: "Marcus Rodriguez",
      role: "Data Scientist",
      years: "5+ Years",
      skills: ["Python", "ML", "TensorFlow"],
      color: "from-blue-500 to-cyan-500",
      initials: "MR",
      cvColor: "bg-blue-50",
      cvAccent: "bg-blue-600",
      email: "marcus.r@email.com",
      phone: "+1 (555) 234-5678"
    },
    {
      name: "Amara Okafor",
      role: "Marketing Director",
      years: "10+ Years",
      skills: ["Strategy", "Analytics", "Leadership"],
      color: "from-orange-500 to-red-500",
      initials: "AO",
      cvColor: "bg-orange-50",
      cvAccent: "bg-orange-600",
      email: "amara.okafor@email.com",
      phone: "+1 (555) 345-6789"
    },
    {
      name: "Dimitri Petrov",
      role: "Software Architect",
      years: "12+ Years",
      skills: ["Cloud", "Microservices", "DevOps"],
      color: "from-green-500 to-emerald-500",
      initials: "DP",
      cvColor: "bg-green-50",
      cvAccent: "bg-green-600",
      email: "d.petrov@email.com",
      phone: "+1 (555) 456-7890"
    },
    {
      name: "Priya Patel",
      role: "UX Researcher",
      years: "6+ Years",
      skills: ["User Testing", "Analytics", "Workshops"],
      color: "from-indigo-500 to-purple-500",
      initials: "PP",
      cvColor: "bg-indigo-50",
      cvAccent: "bg-indigo-600",
      email: "priya.p@email.com",
      phone: "+1 (555) 567-8901"
    },
    {
      name: "Emma Thompson",
      role: "Financial Analyst",
      years: "8+ Years",
      skills: ["Excel", "Python", "Risk Analysis"],
      color: "from-amber-500 to-yellow-500",
      initials: "ET",
      cvColor: "bg-amber-50",
      cvAccent: "bg-amber-600",
      email: "emma.t@email.com",
      phone: "+1 (555) 678-9012"
    }
  ];

  // Cycle transformation every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransformed(prev => !prev);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Data-oriented card display system
  const cardSets = [
    [0, 1, 2], // First set of 3 cards
    [3, 4, 5], // Second set of 3 cards
  ];
  
  const cardPositions = [
    { x: 40, y: 180, delay: 0 },       // Left position - moved right and down
    { x: 180, y: 80, delay: 0.2 },     // Top center position  
    { x: 320, y: 160, delay: 0.4 },    // Right position - spread much wider
  ];
  
  // Rotate between card sets every 10 seconds (optimized timing)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCardSet(prev => (prev + 1) % cardSets.length);
    }, 10000);
    
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
      
      {/* CV Cards Animation - Defined Rectangle Area */}
      <div className="absolute bottom-16 left-4 w-[500px] h-[500px] pointer-events-none">
        {/* Show only visible cards */}
        <AnimatePresence>
        {cardSets[activeCardSet].map((cvIndex, positionIndex) => {
          const cv = cvExamples[cvIndex];
          const position = cardPositions[positionIndex];
          
          // Simple, clean positioning
          const finalPos = { 
            x: position.x, 
            y: position.y, 
            rotate: -4 + (positionIndex * 4), // Minimal rotation to avoid overlap
            scale: 1.0  // Slightly smaller cards
          };
          
          return (
            <motion.div
              key={`${activeCardSet}-${cvIndex}`}
              className="absolute"
              initial={{ 
                x: finalPos.x, 
                y: finalPos.y + 50, 
                rotate: finalPos.rotate,
                scale: 0,
                opacity: 0
              }}
              animate={{ 
                x: finalPos.x,
                y: finalPos.y,
                rotate: finalPos.rotate,
                scale: finalPos.scale,
                opacity: 1,
                rotateY: [0, 0, 180, 180, 0, 0] // Simple flip animation
              }}
              exit={{
                y: finalPos.y - 20,
                opacity: 0,
                scale: finalPos.scale * 0.9,
                transition: { duration: 1, ease: "easeOut" }
              }}
              transition={{
                duration: 0.8,
                delay: position.delay,
                ease: "easeOut",
                opacity: {
                  duration: 0.5,
                  delay: position.delay
                },
                rotateY: {
                  duration: 2, // 2 second flip
                  delay: position.delay + 1.5, // Start flip 1.5 seconds after card appears
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatDelay: 3 // Wait 3 seconds between flips
                }
              }}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* CV Card */}
              <div className="relative w-48 h-60" style={{ transformStyle: "preserve-3d" }}>
                {/* Front Side - CV */}
                <div 
                  className={`absolute inset-0 ${cv.cvColor} rounded-lg shadow-2xl p-2.5 border border-gray-200 backface-hidden overflow-hidden`}
                  style={{ backfaceVisibility: "hidden" }}
                >
                  {/* Traditional CV Header */}
                  <div className="mb-2">
                    <div className="text-[10px] font-bold text-gray-900 tracking-wide">{cv.name.toUpperCase()}</div>
                    <div className="text-[7px] text-gray-700 font-medium">{cv.role}</div>
                    <div className="flex gap-2 mt-1">
                      <div className="text-[5px] text-gray-600">{cv.email}</div>
                      <div className="text-[5px] text-gray-600">•</div>
                      <div className="text-[5px] text-gray-600">{cv.phone}</div>
                    </div>
                  </div>
                  
                  <div className={`h-0.5 ${cv.cvAccent} mb-2`}></div>
                  
                  {/* CV Content - Traditional Layout */}
                  <div className="space-y-1.5">
                    {/* Professional Summary */}
                    <div>
                      <div className={`text-[6px] font-bold ${cv.cvAccent} text-white px-1 py-0.5 inline-block rounded`}>PROFESSIONAL SUMMARY</div>
                      <div className="mt-0.5 space-y-0.5">
                        <div className="h-0.5 bg-gray-300 rounded w-full"></div>
                        <div className="h-0.5 bg-gray-300 rounded w-11/12"></div>
                        <div className="h-0.5 bg-gray-300 rounded w-4/5"></div>
                      </div>
                    </div>
                    
                    {/* Experience */}
                    <div>
                      <div className={`text-[6px] font-bold ${cv.cvAccent} text-white px-1 py-0.5 inline-block rounded`}>EXPERIENCE</div>
                      <div className="mt-0.5 space-y-1">
                        <div>
                          <div className="text-[5px] font-semibold text-gray-800">{cv.years} • Senior Position</div>
                          <div className="h-0.5 bg-gray-300 rounded w-5/6 mt-0.5"></div>
                        </div>
                        <div>
                          <div className="text-[5px] font-semibold text-gray-800">Previous Role</div>
                          <div className="h-0.5 bg-gray-300 rounded w-4/6 mt-0.5"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Skills */}
                    <div>
                      <div className={`text-[6px] font-bold ${cv.cvAccent} text-white px-1 py-0.5 inline-block rounded`}>SKILLS</div>
                      <div className="flex gap-1 flex-wrap mt-0.5">
                        {cv.skills.map((skill, idx) => (
                          <div 
                            key={idx}
                            className="text-[5px] px-1 py-0.5 border border-gray-400 rounded text-gray-700 bg-white"
                          >
                            {skill}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Education */}
                    <div>
                      <div className={`text-[6px] font-bold ${cv.cvAccent} text-white px-1 py-0.5 inline-block rounded`}>EDUCATION</div>
                      <div className="mt-0.5">
                        <div className="h-0.5 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-0.5 bg-gray-300 rounded w-1/2 mt-0.5"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Back Side - Beautiful Modern Website */}
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-lg shadow-2xl overflow-hidden"
                  style={{ 
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)"
                  }}
                >
                  {/* Beautiful gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${cv.color} opacity-30`}></div>
                  
                  {/* Animated particles background */}
                  <div className="absolute inset-0 opacity-20">
                    {[...Array(15)].map((_, i) => (
                      <div 
                        key={i}
                        className={`absolute w-1 h-1 bg-gradient-to-r ${cv.color} rounded-full animate-pulse`}
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          animationDelay: `${i * 0.2}s`,
                          animationDuration: `${2 + Math.random() * 2}s`
                        }}
                      />
                    ))}
                  </div>
                  
                  <div className="relative h-full flex flex-col p-4">
                    {/* Modern Website Header */}
                    <div className="mb-3">
                      {/* Site Logo/Brand */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${cv.color} shadow-lg`}></div>
                        <div className="text-[8px] text-white font-bold tracking-wide">{cv.name.split(' ')[0]}.dev</div>
                      </div>
                      
                      {/* Hero Section */}
                      <div className={`bg-gradient-to-r ${cv.color} rounded-lg p-2 shadow-xl`}>
                        <div className="text-xs font-bold text-white mb-1">
                          {cv.name}
                        </div>
                        <div className="text-[8px] text-white/90">
                          {cv.role}
                        </div>
                        <div className="text-[6px] text-white/80 mt-1">
                          {cv.years} Experience
                        </div>
                      </div>
                    </div>
                    
                    {/* Modern Navigation */}
                    <div className="flex gap-2 mb-3">
                      {['Home', 'Portfolio', 'About', 'Contact'].map((item, i) => (
                        <div key={i} className={`flex-1 text-center py-1 px-1 rounded text-[6px] font-medium ${
                          i === 0 
                            ? `bg-gradient-to-r ${cv.color} text-white` 
                            : 'bg-white/10 text-gray-300 hover:bg-white/20'
                        }`}>
                          {item}
                        </div>
                      ))}
                    </div>
                    
                    {/* Modern Content Sections */}
                    <div className="flex-1 space-y-2">
                      {/* Featured Work */}
                      <div className="bg-white/10 rounded-lg p-2 backdrop-blur-sm">
                        <div className="text-[7px] text-white font-semibold mb-1.5">Featured Projects</div>
                        <div className="grid grid-cols-2 gap-1.5">
                          {[1, 2].map((project) => (
                            <div key={project} className={`bg-gradient-to-br ${cv.color} rounded p-1.5 h-8 relative overflow-hidden`}>
                              <div className="text-[6px] text-white font-medium">Project {project}</div>
                              <div className="absolute bottom-0 right-0 w-6 h-6 bg-white/20 rounded-full transform translate-x-2 translate-y-2"></div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Skills Showcase */}
                      <div className="bg-white/10 rounded-lg p-2 backdrop-blur-sm">
                        <div className="text-[7px] text-white font-semibold mb-1.5">Core Skills</div>
                        <div className="flex flex-wrap gap-1">
                          {cv.skills.map((skill, idx) => (
                            <div key={idx} className={`text-[6px] px-1.5 py-0.5 bg-gradient-to-r ${cv.color} rounded-full text-white font-medium opacity-90`}>
                              {skill}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Experience Stats */}
                      <div className="bg-white/10 rounded-lg p-2 backdrop-blur-sm">
                        <div className="text-[7px] text-white font-semibold mb-1.5">Experience</div>
                        <div className="flex items-center gap-2">
                          <div className={`text-[10px] font-bold bg-gradient-to-r ${cv.color} bg-clip-text text-transparent`}>
                            {cv.years}
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className={`h-1 bg-gradient-to-r ${cv.color} rounded-full`}></div>
                            <div className={`h-0.5 bg-gradient-to-r ${cv.color} rounded-full opacity-60`}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Modern Footer */}
                    <div className="mt-2">
                      <div className="flex items-center justify-between bg-white/5 rounded-lg p-1.5">
                        <div className="text-[6px] text-gray-400">© 2024 {cv.name.split(' ')[0]}</div>
                        <div className="flex gap-1">
                          <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${cv.color} animate-pulse`}></div>
                          <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${cv.color} animate-pulse opacity-70`} style={{animationDelay: '0.5s'}}></div>
                          <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${cv.color} animate-pulse opacity-50`} style={{animationDelay: '1s'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
        </AnimatePresence>
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
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 via-sky-400 to-blue-600 border-2 border-white/20"
                />
              ))}
            </div>
            <span className="text-base text-gray-300">
              Join 10,000+ professionals already using CV2WEB
            </span>
          </div>
          
          {/* CV2WEB Features */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-emerald-300">
              <Sparkles className="w-5 h-5" />
              <span className="text-base">Document to Website Magic</span>
            </div>
            <div className="flex items-center space-x-3 text-sky-300">
              <Rocket className="w-5 h-5" />
              <span className="text-base">Live Transformation Preview</span>
            </div>
            <div className="flex items-center space-x-3 text-blue-300">
              <Code className="w-5 h-5" />
              <span className="text-base">Interactive Portfolio Elements</span>
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