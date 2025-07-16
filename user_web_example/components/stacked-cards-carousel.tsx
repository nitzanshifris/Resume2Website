"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { ExternalLink } from "lucide-react"
import Image from "next/image"
import { LinkPreview } from "@/components/ui/link-preview"
import { Button } from "@/components/ui/button"

const OpenQuote = () => <span className="md:text-[9rem] text-[6rem] font-bold">"</span>;
const CloseQuote = () => <span className="md:text-[9rem] text-[6rem] font-bold">"</span>;

const StackedCardsCarousel = () => {
  const [currentCard, setCurrentCard] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const testimonials = [
    {
      id: 4,
      quote: "90% say that it's acceptable to use generative AI in application materials",
      stat: "90%",
      company: "Forbes",
      category: "Business Publication",
      verification: "HR Survey",
      logoColor: "#000000",
      logoImage: "/images/forbes-logo-clean.png",
      isForbesLogo: true,
      source:
        "https://www.forbes.com/sites/chriswestfall/2024/01/26/study-says-hiring-managers-expect-and-prefer-ai-enhanced-resumes/",
    },
    {
      id: 1,
      quote: "73% of hiring managers more likely to interview visually appealing resume",
      stat: "73%",
      company: "Qureos",
      category: "Career Platform",
      verification: "Research Study",
      logoColor: "linear-gradient(135deg, #007AFF 0%, #5856D6 100%)",
      logoText: "Q",
      logoImage: "/images/qureos-logo-new.png",
      source: "https://www.qureos.com/career-guide/resume-statistics-for-job-seekers",
    },
    {
      id: 2,
      quote: "Study Says Hiring Managers Expect (and Prefer) AI-Enhanced Resumes",
      company: "Forbes",
      category: "Business Publication",
      verification: "Industry Report",
      logoColor: "#000000",
      logoImage: "/images/forbes-logo-clean.png",
      isForbesLogo: true,
      source:
        "https://www.forbes.com/sites/chriswestfall/2024/01/26/study-says-hiring-managers-expect-and-prefer-ai-enhanced-resumes/",
    },
    {
      id: 3,
      quote: "Recruiters spend average of 7.4 seconds reviewing a CV",
      stat: "7.4 seconds",
      company: "Career Improvement Club",
      category: "Career Research",
      verification: "Statistical Analysis",
      logoColor: "linear-gradient(135deg, #059669 0%, #10B981 100%)",
      logoText: "C",
      logoImage: "/images/cic-logo.png",
      source: "https://careerimprovement.club/blog/job-search-statistics",
    },
    {
      id: 5,
      quote: "Your resume is just one part of the job search engine. But it's the part you control 100%.",
      stat: "100%",
      company: "LinkedIn",
      category: "Professional Network",
      verification: "Career Expert",
      logoColor: "#0077B5",
      logoImage: "/images/Linkedin-logo.png",
      isLinkedInLogo: true,
      source: "https://www.linkedin.com/pulse/30-resume-statistics-every-job-seeker-must-know-2025-anisha-khanna-qex2c/",
    },
    {
      id: 6,
      quote: "Action verbs increase the chances of an interview by 140%.",
      stat: "140%",
      company: "FinancesOnline",
      category: "Business Research",
      verification: "Data Analysis",
      logoColor: "#1E4D72",
      logoImage: "/images/FinanceOnline-Logo.png",
      isFinancesOnlineLogo: true,
      source: "https://financesonline.com/resume-statistics/",
    },
  ]

  const nextCard = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentCard((prev) => (prev + 1) % testimonials.length)
    setTimeout(() => setIsTransitioning(false), 800)
  }, [isTransitioning, testimonials.length])

  const prevCard = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentCard((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setTimeout(() => setIsTransitioning(false), 800)
  }, [isTransitioning, testimonials.length])

  const goToCard = useCallback(
    (index: number) => {
      if (index === currentCard || isTransitioning) return
      setIsTransitioning(true)
      setCurrentCard(index)
      setTimeout(() => setIsTransitioning(false), 800)
    },
    [currentCard, isTransitioning],
  )

  // Auto-advance
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioning) {
        nextCard()
      }
    }, 12000)
    return () => clearInterval(interval)
  }, [isTransitioning, nextCard])

  // Helper function to render quote with highlighted stat
  const renderQuoteWithStat = useCallback((quote: string, stat?: string) => {
    if (!stat) {
      // Check if this is the AI-Enhanced Resumes quote and highlight it
      if (quote.includes("AI-Enhanced Resumes")) {
        const parts = quote.split("AI-Enhanced Resumes")
        return (
          <>
            {parts[0]}
            <span className="text-blue-600 font-bold text-[1.4em]">AI-Enhanced Resumes</span>
            {parts[1]}
          </>
        )
      }
      return quote
    }
    const parts = quote.split(stat)
    return (
      <>
        {parts[0]}
        <span className="text-blue-600 font-bold text-[1.4em]">{stat}</span>
        {parts[1]}
      </>
    )
  }, [])

  // Calculate smooth position for each card
  const getCardPosition = (index: number) => {
    const diff = (index - currentCard + testimonials.length) % testimonials.length
    const normalizedDiff = diff > testimonials.length / 2 ? diff - testimonials.length : diff
    return normalizedDiff
  }

  // Get smooth transform values
  const getCardTransform = (position: number) => {
    const absPos = Math.abs(position)

    if (absPos === 0) {
      // Center card
      return {
        x: "-50%",
        y: "-50%",
        scale: 1,
        opacity: 1,
        zIndex: 20,
        rotateY: 0,
        filter: "blur(0px)",
      }
    } else if (absPos === 1) {
      // Adjacent cards
      return {
        x: position > 0 ? "-25%" : "-75%",
        y: "-50%",
        scale: 0.85,
        opacity: 0.7,
        zIndex: 15,
        rotateY: position > 0 ? -20 : 20,
        filter: "blur(1px)",
      }
    } else if (absPos === 2) {
      // Far cards
      return {
        x: position > 0 ? "-10%" : "-90%",
        y: "-50%",
        scale: 0.7,
        opacity: 0.4,
        zIndex: 10,
        rotateY: position > 0 ? -35 : 35,
        filter: "blur(2px)",
      }
    } else {
      // Hidden cards
      return {
        x: position > 0 ? "10%" : "-110%",
        y: "-50%",
        scale: 0.6,
        opacity: 0,
        zIndex: 5,
        rotateY: position > 0 ? -50 : 50,
        filter: "blur(3px)",
      }
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Headline Section - Adding Motion Effects */}
      <div className="text-center mb-8 md:mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-1 md:space-y-2 flex flex-col items-center"
        >
          {/* Mobile: stacked, Desktop: inline */}
          <h2 className="text-[2.5rem] md:text-[3.2rem] leading-[1.1] font-bold text-gray-900 tracking-tight">
            Backed By <span className="bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 bg-clip-text text-transparent">Research.</span><br />
            Proven By <span className="bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 bg-clip-text text-transparent">Results.</span>
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-xl text-gray-600 font-medium mt-3 md:mt-4 max-w-[340px] md:max-w-2xl"
          >
            <span className="hidden md:inline whitespace-nowrap">
              See what experts and leading platforms say about the future of resumes
            </span>
            <span className="md:hidden text-center block">
              See what experts and leading platforms<br />say about the future of resumes
            </span>
          </motion.p>
        </motion.div>
      </div>

      {/* Cards Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="relative h-[350px] md:h-[450px] overflow-visible"
        style={{ perspective: "1200px" }}
      >
        {testimonials.map((card, index) => {
          const position = getCardPosition(index)
          const isActive = position === 0
          const transform = getCardTransform(position)

          return (
            <motion.div
              key={card.id}
              className={`absolute ${isActive ? 'w-[95vw] max-w-[360px]' : 'w-[min(600px,90vw)]'} md:w-[min(700px,90vw)] md:max-w-[700px] h-[280px] md:h-[350px] bg-white/95 backdrop-blur-[30px] rounded-[20px] md:rounded-[28px] p-6 md:p-12 border border-white/30 cursor-pointer will-change-transform ${
                isActive ? 'before:absolute before:inset-[-2px] before:rounded-[22px] md:before:rounded-[30px] before:bg-gradient-to-r before:from-emerald-500/10 before:via-sky-400/10 before:to-blue-600/10 before:blur-[8px] before:-z-10 after:absolute after:inset-[-1px] after:rounded-[21px] md:after:rounded-[29px] after:bg-gradient-to-r after:from-emerald-500/10 after:via-sky-400/10 after:to-blue-600/10 after:-z-20' : ''
              }`}
              style={{
                left: "50%",
                top: "50%",
                transformOrigin: "center center",
                boxShadow: isActive
                  ? "0 25px 80px rgba(0, 0, 0, 0.15), 0 10px 40px rgba(0, 0, 0, 0.1)"
                  : "0 10px 30px rgba(0, 0, 0, 0.08)",
                isolation: isActive ? "isolate" : "auto",
              }}
              animate={transform}
              transition={{
                duration: 0.8,
                ease: [0.25, 0.1, 0.25, 1], // Custom cubic-bezier for smooth motion
                type: "tween",
              }}
              onClick={() => !isActive && goToCard(index)}
              whileHover={
                isActive
                  ? {
                      y: "-52%",
                      scale: 1.02,
                      transition: {
                        duration: 0.4,
                        ease: [0.25, 0.1, 0.25, 1],
                      },
                    }
                  : {}
              }
            >
              {/* Verification Badge - Positioned at bottom left */}
              <motion.div
                className="absolute left-[35%] md:left-[40%] -bottom-[0.75rem] md:-bottom-[1rem] bg-green-50 text-green-600 px-2 md:px-3 py-1 md:py-1.5 rounded-lg text-[0.75rem] md:text-[0.85rem] font-semibold flex items-center whitespace-nowrap z-10"
                animate={{
                  opacity: isActive ? 1 : 0,
                  scale: isActive ? 1 : 0.8,
                }}
                transition={{
                  duration: 0.4,
                  ease: [0.25, 0.1, 0.25, 1],
                  delay: isActive ? 0.2 : 0,
                }}
                style={{ pointerEvents: isActive ? "auto" : "none" }}
              >
                <div className="w-[12px] h-[12px] md:w-[14px] md:h-[14px] bg-green-600 rounded-full text-white flex items-center justify-center mr-1 md:mr-1.5 text-xs font-bold">
                  ✓
                </div>
                {card.verification}
              </motion.div>

              {/* Card content with proper positioning */}
              <div className="h-full flex flex-col justify-center items-center px-4 py-6 md:px-12 md:py-8 relative">
                {/* Opening Quote Symbol */}
                <motion.div
                  className="absolute -left-[6%] md:-top-[52%] -top-[32%]"
                  style={{
                    transform: 'translate(0%, 0%)',
                  }}
                  animate={{
                    opacity: isActive ? 1 : 0,
                  }}
                  transition={{
                    duration: 0.4,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                >
                  <OpenQuote />
                </motion.div>

                {/* Closing Quote Symbol */}
                <motion.div
                  className="absolute -right-[6%] md:-bottom-[72%] -bottom-[48%]"
                  style={{
                    transform: 'translate(0%, 0%)',
                  }}
                  animate={{
                    opacity: isActive ? 1 : 0,
                  }}
                  transition={{
                    duration: 0.4,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                >
                  <CloseQuote />
                </motion.div>

                {/* Logo with LinkPreview - centered */}
                <div className="mb-4 md:mb-6 mt-4 md:mt-4">
                  <LinkPreview
                    url={card.source}
                    className="inline-block"
                    width={400}
                    height={250}
                  >
                    <Image
                      src={card.logoImage || "/placeholder.svg"}
                      alt={`${card.company} logo`}
                      width={400}
                      height={160}
                      className="h-26 w-auto max-w-[180px] md:h-40 md:max-w-[300px] object-contain hover:scale-105 transition-transform duration-200"
                    />
                  </LinkPreview>
                </div>

                {/* Quote Text with LinkPreview - centered */}
                <motion.div
                  className="mb-4 md:mb-6 md:-mt-4"
                  animate={{
                    opacity: isActive ? 1 : 0.6,
                    y: isActive ? 0 : 10,
                  }}
                  transition={{
                    duration: 0.6,
                    ease: [0.25, 0.1, 0.25, 1],
                    delay: 0.1,
                  }}
                >
                  <LinkPreview
                    url={card.source}
                    className="inline-block"
                    width={400}
                    height={250}
                  >
                    <div className="text-[1.1rem] md:text-[1.8rem] leading-[1.3] text-gray-900 font-semibold tracking-tight text-center max-w-full px-2 cursor-pointer">
                      {renderQuoteWithStat(card.quote, card.stat)}
                    </div>
                  </LinkPreview>
                </motion.div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="flex justify-center items-center mt-8 md:mt-12 gap-3 md:gap-5"
      >
        <motion.button
          onClick={prevCard}
          disabled={isTransitioning}
          className="w-[40px] h-[40px] md:w-[50px] md:h-[50px] rounded-full bg-white/90 backdrop-blur-md border border-white/30 flex items-center justify-center text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          whileHover={{
            scale: 1.05,
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <svg className="w-5 h-5 md:w-6 md:h-6 fill-current" viewBox="0 0 24 24">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </motion.button>

        <div className="flex gap-2 md:gap-3 mx-4 md:mx-6">
          {testimonials.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToCard(index)}
              disabled={isTransitioning}
              className="w-[8px] h-[8px] md:w-[10px] md:h-[10px] rounded-full border-0 cursor-pointer disabled:cursor-not-allowed"
              animate={{
                scale: index === currentCard ? 1.4 : 1,
                backgroundColor: index === currentCard ? "#007AFF" : "rgba(134, 134, 139, 0.3)",
              }}
              transition={{
                duration: 0.4,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              whileHover={{
                scale: index === currentCard ? 1.5 : 1.2,
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>

        <motion.button
          onClick={nextCard}
          disabled={isTransitioning}
          className="w-[40px] h-[40px] md:w-[50px] md:h-[50px] rounded-full bg-white/90 backdrop-blur-md border border-white/30 flex items-center justify-center text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          whileHover={{
            scale: 1.05,
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <svg className="w-5 h-5 md:w-6 md:h-6 fill-current" viewBox="0 0 24 24">
            <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
          </svg>
        </motion.button>
      </motion.div>
    </div>
  )
}

export default StackedCardsCarousel
