"use client";

import { useState, useEffect, useCallback, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X, Maximize, Minimize, Info } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamic imports for gallery components  
const BackgroundBoxesGalleryHero = dynamic(() => import('@/component-library/components/ui/background-boxes').then(mod => mod.BackgroundBoxesGalleryHero), { ssr: false });
const BackgroundGradientGalleryProduct = dynamic(() => import('@/component-library/components/ui/background-gradient').then(mod => mod.BackgroundGradientGalleryProduct), { ssr: false });
const BackgroundLinesGalleryHero = dynamic(() => import('@/component-library/components/ui/background-lines').then(mod => mod.BackgroundLinesGalleryHero), { ssr: false });
const BentoGridGalleryBasic = dynamic(() => import('@/component-library/components/ui/bento-grid').then(mod => mod.BentoGridGalleryBasic), { ssr: false });
const ThreeDCardGalleryProduct = dynamic(() => import('@/component-library/components/ui/3d-card').then(mod => mod.ThreeDCardGalleryProduct), { ssr: false });
const ThreeDMarqueeGalleryTestimonials = dynamic(() => import('@/component-library/components/ui/3d-marquee').then(mod => mod.ThreeDMarqueeGalleryTestimonials), { ssr: false });
const ThreeDPinGalleryBasic = dynamic(() => import('@/component-library/components/ui/3d-pin').then(mod => mod.ThreeDPinGalleryBasic), { ssr: false });
const AnimatedModalGalleryBasic = dynamic(() => import('@/component-library/components/ui/animated-modal').then(mod => mod.AnimatedModalGalleryBasic), { ssr: false });
const AnimatedTestimonialsGalleryBasic = dynamic(() => import('@/component-library/components/ui/animated-testimonials').then(mod => mod.AnimatedTestimonialsGalleryBasic), { ssr: false });
const AnimatedTooltipGalleryTeam = dynamic(() => import('@/component-library/components/ui/animated-tooltip').then(mod => mod.AnimatedTooltipGalleryTeam), { ssr: false });
const AppleCardsCarouselGalleryBasic = dynamic(() => import('@/component-library/components/ui/apple-cards-carousel').then(mod => mod.AppleCardsCarouselGalleryBasic), { ssr: false });
const AuroraBackgroundGalleryHero = dynamic(() => import('@/component-library/components/ui/aurora-background').then(mod => mod.AuroraBackgroundGalleryHero), { ssr: false });
const BackgroundBeamsGalleryHero = dynamic(() => import('@/component-library/components/ui/background-beams').then(mod => mod.BackgroundBeamsGalleryHero), { ssr: false });
const BackgroundBeamsWithCollisionGalleryBasic = dynamic(() => import('@/component-library/components/ui/background-beams-with-collision').then(mod => mod.BackgroundBeamsWithCollisionGalleryBasic), { ssr: false });
const FloatingNavbarGalleryBasic = dynamic(() => import('@/component-library/components/ui/floating-navbar').then(mod => mod.FloatingNavbarGalleryBasic), { ssr: false });
const TimelineGalleryPreview = dynamic(() => import('@/component-library/components/ui/timeline').then(mod => mod.TimelineGalleryPreview), { ssr: false });
const CanvasRevealEffectGalleryBasic = dynamic(() => import('@/component-library/components/ui/canvas-reveal-effect').then(mod => mod.CanvasRevealEffectGalleryBasic), { ssr: false });
const CardHoverEffectGalleryBasic = dynamic(() => import('@/component-library/components/ui/card-hover-effect').then(mod => mod.CardHoverEffectGalleryBasic), { ssr: false });
const CardSpotlightDemo = dynamic(() => import('@/component-library/components/ui/card-spotlight').then(mod => mod.CardSpotlightDemo), { ssr: false });
const MeteorsGalleryBasic = dynamic(() => import('@/components/ui/meteors').then(mod => mod.MeteorsGalleryBasic), { ssr: false });

interface PresentationSlide {
  id: string;
  title: string;
  description: string;
  category: string;
  component: React.ComponentType;
}

const slides: PresentationSlide[] = [
  {
    id: 'background-boxes',
    title: 'Background Boxes',
    description: 'A full width background box container that highlights on hover. Perfect for hero sections and landing pages.',
    category: 'Background',
    component: BackgroundBoxesGalleryHero,
  },
  {
    id: 'background-gradient',
    title: 'Background Gradient',
    description: 'An animated gradient that sits at the background of a card, button or anything. Great for product showcases.',
    category: 'Background',
    component: BackgroundGradientGalleryProduct,
  },
  {
    id: 'background-lines',
    title: 'Background Lines',
    description: 'A set of svg paths that animate in a wave pattern. Ideal for hero sections and dynamic backgrounds.',
    category: 'Background',
    component: BackgroundLinesGalleryHero,
  },
  {
    id: 'aurora-background',
    title: 'Aurora Background',
    description: 'Beautiful animated gradient background with aurora-like effects and smooth transitions.',
    category: 'Background',
    component: AuroraBackgroundGalleryHero,
  },
  {
    id: 'background-beams',
    title: 'Background Beams',
    description: 'Animated beam effects that create dynamic lighting patterns and atmospheric backgrounds.',
    category: 'Background',
    component: BackgroundBeamsGalleryHero,
  },
  {
    id: 'background-beams-with-collision',
    title: 'Background Beams with Collision',
    description: 'Dynamic beam effects with collision detection and explosion animations.',
    category: 'Background',
    component: BackgroundBeamsWithCollisionGalleryBasic,
  },
  {
    id: 'bento-grid',
    title: 'Bento Grid',
    description: 'A skewed grid layout with title, description and a header component. Perfect for feature showcases and portfolios.',
    category: 'Layout',
    component: BentoGridGalleryBasic,
  },
  {
    id: '3d-card',
    title: '3D Card Effect',
    description: 'A card perspective effect, hover over the card to elevate card elements.',
    category: 'Interactive',
    component: ThreeDCardGalleryProduct,
  },
  {
    id: '3d-marquee',
    title: '3D Marquee',
    description: 'A 3D Marquee effect with grid, perfect for testimonials and hero sections.',
    category: 'Background',
    component: ThreeDMarqueeGalleryTestimonials,
  },
  {
    id: '3d-pin',
    title: '3D Animated Pin',
    description: 'A gradient pin that animates on hover, perfect for product links.',
    category: 'Interactive',
    component: ThreeDPinGalleryBasic,
  },
  {
    id: 'animated-modal',
    title: 'Animated Modal',
    description: 'A customizable modal with smooth animated transitions and 3D effects.',
    category: 'Utilities',
    component: AnimatedModalGalleryBasic,
  },
  {
    id: 'animated-testimonials',
    title: 'Animated Testimonials',
    description: 'Beautiful testimonial carousel with smooth 3D animations and stacked photo effects.',
    category: 'Content',
    component: AnimatedTestimonialsGalleryBasic,
  },
  {
    id: 'animated-tooltip',
    title: 'Animated Tooltip',
    description: 'Interactive tooltip component with smooth animations and 3D hover effects.',
    category: 'Interactive',
    component: AnimatedTooltipGalleryTeam,
  },
  {
    id: 'apple-cards-carousel',
    title: 'Apple Cards Carousel',
    description: 'Smooth horizontal scrolling carousel with Apple-style card interactions and modal previews.',
    category: 'Carousel',
    component: AppleCardsCarouselGalleryBasic,
  },
  {
    id: 'floating-navbar',
    title: 'Floating Navbar',
    description: 'Smart navigation bar that hides on scroll down and shows on scroll up.',
    category: 'Navigation',
    component: FloatingNavbarGalleryBasic,
  },
  {
    id: 'timeline',
    title: 'Timeline',
    description: 'Beautiful timeline component for showcasing journeys, experiences, and step-by-step processes.',
    category: 'Content',
    component: TimelineGalleryPreview,
  },
  {
    id: 'canvas-reveal-effect',
    title: 'Canvas Reveal Effect',
    description: 'Interactive canvas-based reveal animations with WebGL shaders for stunning hover effects.',
    category: 'Interactive',
    component: CanvasRevealEffectGalleryBasic,
  },
  {
    id: 'card-hover-effect',
    title: 'Card Hover Effect',
    description: 'Beautiful card grid with animated hover effects and smooth background transitions.',
    category: 'Interactive',
    component: CardHoverEffectGalleryBasic,
  },
  {
    id: 'card-spotlight',
    title: 'Card Spotlight',
    description: 'Interactive spotlight cards with mouse-following illumination effects and canvas animations.',
    category: 'Interactive',
    component: CardSpotlightDemo,
  },
  {
    id: 'meteors',
    title: 'Meteors',
    description: 'Animated meteor effects that create dynamic falling star animations across your content.',
    category: 'Background',
    component: MeteorsGalleryBasic,
  },
];

interface PresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PresentationModal({ isOpen, onClose }: PresentationModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault();
          prevSlide();
          break;
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ': // Spacebar
          event.preventDefault();
          nextSlide();
          break;
        case 'Escape':
          event.preventDefault();
          onClose();
          break;
        case 'f':
        case 'F':
          event.preventDefault();
          toggleFullscreen();
          break;
        case 'i':
        case 'I':
          event.preventDefault();
          setShowInfo(prev => !prev);
          break;
        case 'a':
        case 'A':
          event.preventDefault();
          setAutoPlay(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, nextSlide, prevSlide, onClose]);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || !isOpen) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [autoPlay, isOpen, nextSlide]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const currentSlideData = slides[currentSlide];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Controls Overlay */}
      <div className={`absolute inset-0 z-50 transition-opacity duration-300 ${showInfo ? 'opacity-100' : 'opacity-0 hover:opacity-100'}`}>
        {/* Top Controls */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="bg-gray-900/80 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="text-white">
                <h2 className="text-xl font-bold">{currentSlideData.title}</h2>
                <p className="text-sm text-gray-400">{currentSlideData.category}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoPlay(!autoPlay)}
                className={`bg-gray-900/80 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white ${autoPlay ? 'bg-gray-800 border-gray-600' : ''}`}
              >
                {autoPlay ? 'Pause' : 'Auto'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowInfo(!showInfo)}
                className="bg-gray-900/80 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                <Info className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFullscreen}
                className="bg-gray-900/80 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <Button
              variant="outline"
              size="sm"
              onClick={prevSlide}
              className="bg-black/50 border-white/20 text-white hover:bg-white/20"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </div>

          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <Button
              variant="outline"
              size="sm"
              onClick={nextSlide}
              className="bg-black/50 border-white/20 text-white hover:bg-white/20"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-4 left-4 right-4">
            {/* Progress Indicator */}
            <div className="flex items-center justify-center gap-2 mb-4">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentSlide 
                      ? 'bg-gray-400' 
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                />
              ))}
            </div>

            {/* Slide Info */}
            {showInfo && (
              <div className="text-center text-white">
                <p className="text-lg mb-2">{currentSlideData.description}</p>
                <div className="text-sm text-gray-400">
                  Slide {currentSlide + 1} of {slides.length} • Use arrow keys to navigate • Press 'f' for fullscreen
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Component Display */}
        <div className="w-full h-full flex items-center justify-center bg-black">
          <Suspense
            fallback={
              <div className="flex items-center justify-center text-white text-xl">
                Loading component...
              </div>
            }
          >
            <div className="w-full h-full flex items-center justify-center p-8">
              <currentSlideData.component />
            </div>
          </Suspense>
        </div>

        {/* Auto-play progress bar */}
        {autoPlay && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
            <div 
              className="h-full bg-gray-600 transition-all duration-[5000ms] ease-linear"
              style={{ width: '100%' }}
            />
          </div>
        )}
    </div>
  );
}