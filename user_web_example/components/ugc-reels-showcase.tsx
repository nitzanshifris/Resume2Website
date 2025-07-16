"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface UGCReel {
  id: string;
  videoUrl: string;
  thumbnail?: string;
}

// Note: Replace these with actual UGC video content
// Recommended video specifications:
// - Format: MP4 (H.264 codec)
// - Aspect ratio: 9:16 (Instagram Reels/Stories format)
// - Resolution: 1080x1920 recommended
// - Duration: 15-30 seconds (optimal for attention span)
// - File size: Keep under 4MB per video for fast loading
const demoReels: UGCReel[] = [
  {
    id: "2",
    videoUrl: "/videos/testimonial-2placeholder.mp4",
    thumbnail: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=700&fit=crop&crop=face"
  },
  // Additional reels can be added when video files are available
];

export function UGCReelsShowcase({ onOpenModal }: { onOpenModal?: () => void }) {
  const [activeReel, setActiveReel] = useState<string | null>(null);
  const [thumbnails, setThumbnails] = useState<{ [key: string]: string }>({});
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement }>({});

  // Improved thumbnail generation with better error handling
  const generateThumbnail = async (videoUrl: string, reelId: string) => {
    try {
      const video = document.createElement('video');
      video.crossOrigin = "anonymous";
      video.src = videoUrl;
      
      // Add timeout to prevent hanging
      const loadPromise = new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Video load timeout'));
        }, 5000);
        
        video.addEventListener('loadeddata', () => {
          clearTimeout(timeout);
          resolve(video);
        });
        
        video.addEventListener('error', (e) => {
          clearTimeout(timeout);
          reject(e);
        });
        
        video.load();
      });

      await loadPromise;

      // Check if video has dimensions
      if (!video.videoWidth || !video.videoHeight) {
        throw new Error('Video has no dimensions');
      }

      // Set to 1 second into the video instead of the first frame
      video.currentTime = 1.0;

      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Seek timeout'));
        }, 3000);
        
        video.addEventListener('seeked', () => {
          clearTimeout(timeout);
          resolve(video);
        }, { once: true });
      });

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.9);
        setThumbnails(prev => ({
          ...prev,
          [reelId]: thumbnailUrl
        }));
      }
    } catch (error) {
      // Silently fail - thumbnails are not critical
      // console.log(`Thumbnail generation skipped for reel ${reelId}`);
    }
  };

  useEffect(() => {
    demoReels.forEach((reel) => {
      if (!reel.thumbnail) {
        generateThumbnail(reel.videoUrl, reel.id);
      }
    });
  }, []);

  const handleReelClick = (reelId: string) => {
    if (activeReel === reelId) {
      const video = videoRefs.current[reelId];
      if (video) {
        video.pause();
        video.muted = true; // Mute when paused
      }
      setActiveReel(null);
    } else {
      // Pause and mute the currently active video
      if (activeReel && videoRefs.current[activeReel]) {
        const currentVideo = videoRefs.current[activeReel];
        currentVideo.pause();
        currentVideo.muted = true;
      }
      
      // Play and unmute the new video
      const newVideo = videoRefs.current[reelId];
      if (newVideo) {
        newVideo.muted = false; // Enable sound when playing
        newVideo.play().catch((error) => {
          console.log('Video play failed:', error);
          // If unmuted play fails, try muted play as fallback
          newVideo.muted = true;
          newVideo.play();
        });
      }
      setActiveReel(reelId);
    }
  };

  return (
    <section className="w-full py-32 dark:bg-black relative">
      {/* Base background */}
      <div className="absolute inset-0 bg-gray-50 dark:bg-black"></div>
      
      {/* Desktop gradient - Enhanced waves effect */}
      <div className="hidden md:block absolute left-0 right-0 top-0 bottom-0">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent via-emerald-500/20 via-sky-400/15 via-blue-600/10 via-transparent to-[#f8fafc]"></div>
        <div className="absolute top-1/4 left-0 w-full h-1/2 bg-gradient-to-r from-emerald-500/10 via-sky-400/8 via-blue-600/6 to-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-1/2 h-1/3 bg-gradient-to-l from-sky-400/12 via-blue-600/8 to-transparent rounded-full blur-2xl"></div>
      </div>
      
      {/* Mobile gradient - Enhanced vertical flow */}
      <div className="block md:hidden absolute left-0 right-0 top-0 bottom-0">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent via-emerald-500/20 via-sky-400/15 via-blue-600/10 via-transparent to-[#f8fafc]"></div>
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-4/5 h-1/3 bg-gradient-to-b from-emerald-500/15 via-sky-400/12 to-blue-600/8 rounded-full blur-xl"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center space-y-4 mb-20">
          <motion.h2 
            className="text-[2.5rem] md:text-[3.2rem] leading-[1.1] font-bold text-gray-900 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            They did it,{" "}
            <span className="bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 bg-clip-text text-transparent">
              so can you.
            </span>
          </motion.h2>
          <motion.p 
            className="text-base md:text-xl text-gray-600 font-medium mt-3 md:mt-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            3700+ professionals are landing more interviews every day
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          {demoReels.map((reel, index) => (
            <motion.div
              key={reel.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex justify-center"
            >
              <div 
                className="cursor-pointer group relative w-full max-w-[360px]"
                onClick={() => handleReelClick(reel.id)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl transform transition-transform group-hover:scale-[1.02]" />
                <div className="relative aspect-[9/16] rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-900">
                  <video
                    ref={(el) => {
                      if (el) videoRefs.current[reel.id] = el;
                    }}
                    className="w-full h-full object-cover"
                    src={reel.videoUrl}
                    poster={reel.thumbnail || thumbnails[reel.id]}
                    playsInline
                    loop
                    muted
                    preload="metadata"
                  />
                  {(!activeReel || activeReel !== reel.id) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                      <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                      </div>
                    </div>
                  )}
                  
                  {/* Sound indicator */}
                  <div className="absolute top-4 right-4">
                    {activeReel === reel.id ? (
                      <div className="w-8 h-8 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.814L4.5 13.5H2a1 1 0 01-1-1v-3a1 1 0 011-1h2.5l3.883-3.314a1 1 0 011.617.814zM12 6.5a1 1 0 011.414 0 5 5 0 010 7.07A1 1 0 0112 12.5a3 3 0 000-4.24A1 1 0 0112 6.5z" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.814L4.5 13.5H2a1 1 0 01-1-1v-3a1 1 0 011-1h2.5l3.883-3.314a1 1 0 011.617.814zM12.5 8a1 1 0 00-1.414 0L10 9.086 8.914 8A1 1 0 007.5 9.414L8.586 10.5 7.5 11.586A1 1 0 008.914 13L10 11.914 11.086 13A1 1 0 0012.5 11.586L11.414 10.5 12.5 9.414A1 1 0 0012.5 8z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action - Mobile Only */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16 md:hidden"
        >
          <Button
            size="lg"
            onClick={onOpenModal}
            className="bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 hover:from-emerald-600 hover:via-sky-500 hover:to-blue-700 text-white border-0 text-lg px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-xl"
          >
            Transform Your Resume Now
          </Button>
        </motion.div>
      </div>
    </section>
  );
} 