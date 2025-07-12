"use client";

import { CarouselEnhanced } from "./carousel-enhanced";

export function CarouselEnhancedDemo() {
  const slideData = [
    {
      title: "Mystic Mountains",
      subtitle: "Adventure Awaits",
      button: "Explore Journey",
      src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=3540&auto=format&fit=crop",
      gradient: "linear-gradient(to bottom, transparent 0%, rgba(59, 130, 246, 0.3) 50%, rgba(30, 58, 138, 0.9) 100%)",
    },
    {
      title: "Urban Dreams",
      subtitle: "City Lights",
      button: "Discover More",
      src: "https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=3456&auto=format&fit=crop",
      gradient: "linear-gradient(to bottom, transparent 0%, rgba(168, 85, 247, 0.3) 50%, rgba(88, 28, 135, 0.9) 100%)",
    },
    {
      title: "Neon Nights",
      subtitle: "Electric Vibes",
      button: "Experience Now",
      src: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=3540&auto=format&fit=crop",
      gradient: "linear-gradient(to bottom, transparent 0%, rgba(236, 72, 153, 0.3) 50%, rgba(157, 23, 77, 0.9) 100%)",
    },
    {
      title: "Desert Whispers",
      subtitle: "Endless Horizons",
      button: "Start Adventure",
      src: "https://images.unsplash.com/photo-1542401886-65d6c61db217?q=80&w=3540&auto=format&fit=crop",
      gradient: "linear-gradient(to bottom, transparent 0%, rgba(251, 146, 60, 0.3) 50%, rgba(194, 65, 12, 0.9) 100%)",
    },
    {
      title: "Ocean Tales",
      subtitle: "Deep Blue Mystery",
      button: "Dive Deeper",
      src: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=3540&auto=format&fit=crop",
      gradient: "linear-gradient(to bottom, transparent 0%, rgba(34, 197, 214, 0.3) 50%, rgba(21, 94, 117, 0.9) 100%)",
    },
  ];

  return (
    <div className="relative overflow-hidden w-full min-h-screen bg-black flex items-center justify-center">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 opacity-50" />
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Enhanced Carousel
          </h1>
          <p className="text-lg text-white/70">
            Experience smooth transitions with auto-play and interactive controls
          </p>
        </div>
        
        <CarouselEnhanced 
          slides={slideData} 
          autoPlay={true}
          autoPlayInterval={4000}
        />
      </div>
    </div>
  );
}