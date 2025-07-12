"use client";
import { IconArrowNarrowRight, IconPlayerPause, IconPlayerPlay } from "@tabler/icons-react";
import { useState, useRef, useId, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SlideData {
  title: string;
  subtitle?: string;
  button: string;
  src: string;
  gradient?: string;
}

interface SlideProps {
  slide: SlideData;
  index: number;
  current: number;
  handleSlideClick: (index: number) => void;
}

const Slide = ({ slide, index, current, handleSlideClick }: SlideProps) => {
  const slideRef = useRef<HTMLLIElement>(null);
  const xRef = useRef(0);
  const yRef = useRef(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const animate = () => {
      if (!slideRef.current) return;

      const x = xRef.current;
      const y = yRef.current;

      slideRef.current.style.setProperty("--x", `${x}px`);
      slideRef.current.style.setProperty("--y", `${y}px`);

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const handleMouseMove = (event: React.MouseEvent) => {
    const el = slideRef.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    xRef.current = event.clientX - (r.left + Math.floor(r.width / 2));
    yRef.current = event.clientY - (r.top + Math.floor(r.height / 2));
  };

  const handleMouseLeave = () => {
    xRef.current = 0;
    yRef.current = 0;
  };

  const imageLoaded = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.style.opacity = "1";
  };

  const { src, button, title, subtitle, gradient } = slide;
  const isActive = current === index;

  return (
    <div className="[perspective:1200px] [transform-style:preserve-3d]">
      <li
        ref={slideRef}
        className="flex flex-1 flex-col items-center justify-center relative text-center text-white opacity-100 transition-all duration-500 ease-out w-[75vmin] h-[75vmin] mx-[2vmin] z-10 cursor-pointer"
        onClick={() => handleSlideClick(index)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: isActive
            ? "scale(1) rotateX(0deg) translateZ(0)"
            : "scale(0.85) rotateX(15deg) translateZ(-100px)",
          opacity: isActive ? 1 : 0.7,
          filter: isActive ? "blur(0px)" : "blur(2px)",
          transition: "all 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
          transformOrigin: "center center",
        }}
      >
        <div
          className="absolute top-0 left-0 w-full h-full rounded-2xl overflow-hidden transition-all duration-300 ease-out shadow-2xl"
          style={{
            transform: isActive
              ? "translate3d(calc(var(--x) / 25), calc(var(--y) / 25), 20px)"
              : "none",
            boxShadow: isActive
              ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
              : "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
          }}
        >
          {/* Image */}
          <img
            className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out"
            style={{
              transform: isActive ? "scale(1.1)" : "scale(1.2)",
            }}
            alt={title}
            src={src}
            onLoad={imageLoaded}
            loading="eager"
            decoding="sync"
          />
          
          {/* Gradient Overlay */}
          <div 
            className="absolute inset-0 transition-opacity duration-700"
            style={{
              background: gradient || "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.8) 100%)",
              opacity: isActive ? 1 : 0.7,
            }}
          />

          {/* Glassmorphism Effect for Active Slide */}
          {isActive && (
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 via-black/30 to-transparent backdrop-blur-sm" />
          )}
        </div>

        <AnimatePresence mode="wait">
          {isActive && (
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute bottom-0 left-0 right-0 p-8 z-10"
            >
              {subtitle && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-sm md:text-base text-white/80 mb-2 font-medium tracking-wider uppercase"
                >
                  {subtitle}
                </motion.p>
              )}
              
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl md:text-4xl lg:text-5xl font-bold mb-6 text-white"
              >
                {title}
              </motion.h2>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="flex justify-center"
              >
                <button className="group relative px-6 py-3 bg-white/10 backdrop-blur-md text-white rounded-full hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40 flex items-center gap-2 hover:gap-3">
                  <span className="font-medium">{button}</span>
                  <IconArrowNarrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </motion.div>
            </motion.article>
          )}
        </AnimatePresence>
      </li>
    </div>
  );
};

interface CarouselControlProps {
  type: string;
  title: string;
  handleClick: () => void;
}

const CarouselControl = ({
  type,
  title,
  handleClick,
}: CarouselControlProps) => {
  return (
    <button
      className={`group relative w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/20 hover:border-white/40 transition-all duration-300 hover:scale-110 ${
        type === "previous" ? "rotate-180" : ""
      }`}
      title={title}
      onClick={handleClick}
    >
      <IconArrowNarrowRight className="w-5 h-5 text-white transition-transform group-hover:translate-x-0.5" />
    </button>
  );
};

interface CarouselProps {
  slides: SlideData[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  className?: string;
  containerSize?: "small" | "medium" | "large" | "full";
}

export function CarouselEnhanced({ 
  slides, 
  autoPlay = true, 
  autoPlayInterval = 5000,
  className = "",
  containerSize = "medium"
}: CarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handlePreviousClick = useCallback(() => {
    const previous = current - 1;
    setCurrent(previous < 0 ? slides.length - 1 : previous);
  }, [current, slides.length]);

  const handleNextClick = useCallback(() => {
    const next = current + 1;
    setCurrent(next === slides.length ? 0 : next);
  }, [current, slides.length]);

  const handleSlideClick = (index: number) => {
    if (current !== index) {
      setCurrent(index);
    }
  };

  const handleIndicatorClick = (index: number) => {
    setCurrent(index);
  };

  const toggleAutoPlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        handleNextClick();
      }, autoPlayInterval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, handleNextClick, autoPlayInterval]);

  const id = useId();

  const getSizeClasses = () => {
    switch (containerSize) {
      case "small": return "w-[50vmin] h-[50vmin]";
      case "medium": return "w-[70vmin] h-[70vmin]";
      case "large": return "w-[85vmin] h-[85vmin]";
      case "full": return "w-[90vw] h-[70vh]";
      default: return "w-[70vmin] h-[70vmin]";
    }
  };

  return (
    <div
      className={`relative w-full mx-auto ${className}`}
      aria-labelledby={`carousel-heading-${id}`}
      onMouseEnter={() => autoPlay && setIsPlaying(false)}
      onMouseLeave={() => autoPlay && setIsPlaying(true)}
    >
      <div className={`relative mx-auto overflow-visible ${getSizeClasses()}`}>
        <ul
          className="absolute flex transition-transform duration-700 ease-out"
          style={{
            transform: `translateX(calc(-${current * 100}% + ${current * 4}vmin))`,
          }}
        >
          {slides.map((slide, index) => (
            <Slide
              key={index}
              slide={slide}
              index={index}
              current={current}
              handleSlideClick={handleSlideClick}
            />
          ))}
        </ul>
      </div>

      {/* Controls */}
      <div className="absolute flex items-center justify-between w-full top-1/2 -translate-y-1/2 px-4 pointer-events-none">
        <div className="pointer-events-auto">
          <CarouselControl
            type="previous"
            title="Go to previous slide"
            handleClick={handlePreviousClick}
          />
        </div>
        <div className="pointer-events-auto">
          <CarouselControl
            type="next"
            title="Go to next slide"
            handleClick={handleNextClick}
          />
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
        <div className="flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => handleIndicatorClick(index)}
              className={`transition-all duration-300 rounded-full ${
                current === index
                  ? "w-8 h-2 bg-white"
                  : "w-2 h-2 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        
        {/* Auto-play toggle */}
        {autoPlay && (
          <button
            onClick={toggleAutoPlay}
            className="ml-4 w-8 h-8 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/20 transition-all duration-300"
            aria-label={isPlaying ? "Pause auto-play" : "Resume auto-play"}
          >
            {isPlaying ? (
              <IconPlayerPause className="w-4 h-4 text-white" />
            ) : (
              <IconPlayerPlay className="w-4 h-4 text-white" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default CarouselEnhanced;