"use client"

import React, { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"

const faqData = [
  // Column 1
  [
    {
      question: "How long does the conversion process take?",
      answer: "Most resume-to-website conversions are completed within 24-48 hours. Our AI-powered system quickly analyzes your resume and creates a stunning interactive website that showcases your experience in the best possible light."
    },
    {
      question: "Do I need any technical skills to use this?",
      answer: "Not at all! Our platform is designed for everyone. Simply upload your resume, and we handle all the technical work. You'll get a fully functional website without writing a single line of code."
    },
    {
      question: "Can I customize the design and layout?",
      answer: "Absolutely! You can choose from multiple professional templates, customize colors, fonts, layouts, and add your own personal branding. Our drag-and-drop editor makes customization simple and intuitive."
    },
    {
      question: "What file formats do you accept?",
      answer: "We accept all common resume formats including PDF, DOC, DOCX, and TXT files. Our AI can extract information from any well-formatted resume regardless of the template or design used."
    },
    {
      question: "Is my personal information secure?",
      answer: "Yes, we take security seriously. All data is encrypted in transit and at rest. We never share your personal information with third parties, and you maintain full control over what information is displayed on your website."
    }
  ],
  // Column 2
  [
    {
      question: "How much does it cost?",
      answer: "We offer flexible pricing starting at $29 for a basic website conversion. Premium plans include advanced features like custom domains, analytics, contact forms, and priority support."
    },
    {
      question: "Can I get a custom domain name?",
      answer: "Yes! Premium users can connect their own custom domain (like yourname.com) or choose from our selection of professional domain options. This gives your website a more professional appearance."
    },
    {
      question: "What if I'm not satisfied with the result?",
      answer: "We offer a 30-day money-back guarantee. If you're not completely satisfied with your website, we'll refund your payment in full. We're confident you'll love the transformation!"
    },
    {
      question: "Do you provide hosting and maintenance?",
      answer: "Yes! All websites include reliable hosting, SSL certificates, and automatic updates. We handle all the technical maintenance so you can focus on your job search and career growth."
    },
    {
      question: "Can I track visitor analytics?",
      answer: "Premium plans include detailed analytics showing who visits your website, which sections they view most, and how they found you. This data helps you understand what recruiters and employers are most interested in."
    }
  ]
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
}

// Safe FAQ Card Component with Working Glass Effects and Role Color Hover
const LiquidFaqCard = ({ faq, index, colKey }: { faq: any, index: number, colKey: string }) => {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])
  const [isWobbling, setIsWobbling] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const rippleCounter = useRef(0)
  const itemRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)

  // Expanded, more randomized gentle gradients for hover
  const roleColors = [
    {
      name: "Blue 1",
      textClass: "bg-gradient-to-r from-blue-400/60 via-blue-500/40 to-indigo-500/60 bg-clip-text text-transparent",
      backgroundGradient: "linear-gradient(135deg, rgba(96, 165, 250, 0.13), rgba(59, 130, 246, 0.09), rgba(99, 102, 241, 0.07))"
    },
    {
      name: "Blue 2",
      textClass: "bg-gradient-to-r from-sky-400/60 via-blue-400/40 to-blue-600/60 bg-clip-text text-transparent",
      backgroundGradient: "linear-gradient(135deg, rgba(56, 189, 248, 0.13), rgba(96, 165, 250, 0.09), rgba(37, 99, 235, 0.07))"
    },
    {
      name: "Green 1",
      textClass: "bg-gradient-to-r from-emerald-400/60 via-green-500/40 to-teal-500/60 bg-clip-text text-transparent",
      backgroundGradient: "linear-gradient(135deg, rgba(52, 211, 153, 0.13), rgba(34, 197, 94, 0.09), rgba(20, 184, 166, 0.07))"
    },
    {
      name: "Green 2",
      textClass: "bg-gradient-to-r from-lime-400/60 via-green-400/40 to-emerald-500/60 bg-clip-text text-transparent",
      backgroundGradient: "linear-gradient(135deg, rgba(163, 230, 53, 0.13), rgba(74, 222, 128, 0.09), rgba(16, 185, 129, 0.07))"
    },
    {
      name: "Pink",
      textClass: "bg-gradient-to-r from-pink-400/60 via-rose-500/40 to-purple-500/60 bg-clip-text text-transparent",
      backgroundGradient: "linear-gradient(135deg, rgba(244, 114, 182, 0.13), rgba(244, 63, 94, 0.09), rgba(168, 85, 247, 0.07))"
    },
    {
      name: "Orange",
      textClass: "bg-gradient-to-r from-orange-400/60 via-amber-500/40 to-yellow-500/60 bg-clip-text text-transparent",
      backgroundGradient: "linear-gradient(135deg, rgba(251, 146, 60, 0.13), rgba(245, 158, 11, 0.09), rgba(234, 179, 8, 0.07))"
    }
  ]

  // Improved random color assignment
  const getRandomColorIndex = (index: number, colKey: string) => {
    // Use a better hash for more randomness
    const baseIndex = colKey === 'col1' ? index : index + 100
    const seed = (baseIndex * 47) + (colKey.charCodeAt(0) * 23) + (index * 11) + 7
    return Math.abs(Math.sin(seed) * 10000) % roleColors.length | 0
  }

  const colorIndex = getRandomColorIndex(index, colKey)
  const assignedColor = roleColors[colorIndex]

  // Listen to accordion open/close
  React.useEffect(() => {
    const el = itemRef.current
    if (!el) return
    const update = () => setIsOpen(el.getAttribute('data-state') === 'open')
    update()
    const observer = new MutationObserver(update)
    observer.observe(el, { attributes: true, attributeFilter: ['data-state'] })
    return () => observer.disconnect()
  }, [])

  const createRipple = (e: React.MouseEvent) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newRipple = {
      id: rippleCounter.current++,
      x,
      y,
    }

    setRipples((prev) => [...prev, newRipple])

    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id))
    }, 600)
  }

  const handleClick = (e: React.MouseEvent) => {
    createRipple(e)
    setIsWobbling(true)
    setTimeout(() => setIsWobbling(false), 800)
  }

  // Check if should show colored text (hover only for now, open state handled by accordion)
  const shouldShowColoredText = isHovered || isOpen

  return (
    <div 
      ref={cardRef}
      className={`relative overflow-hidden cursor-pointer bg-white shadow-lg rounded-xl px-6 py-3 min-w-[200px] transition-all duration-300 ${isWobbling ? 'liquid-wobble-active' : ''} ${(isHovered || isOpen) ? 'faq-card-hover' : ''}`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={(isHovered || isOpen) ? { background: assignedColor.backgroundGradient } : {}}
    >
      <div style={{ position: 'relative', zIndex: 2 }}>
        <AccordionItem 
          ref={itemRef}
          key={`${colKey}-${index}`} 
          value={`${colKey}-item-${index}`}
          className="border-none bg-transparent rounded-none shadow-none transition-all duration-300 overflow-hidden [&[data-state=open]>.liquid-trigger]:text-transparent [&[data-state=open]>.liquid-trigger]:bg-gradient-to-r [&[data-state=open]>.liquid-trigger]:bg-clip-text"
          style={{
            [`--gradient-from` as any]: assignedColor.textClass.includes('blue') ? '#60a5fa' : 
                                       assignedColor.textClass.includes('pink') ? '#f472b6' :
                                       assignedColor.textClass.includes('emerald') ? '#34d399' : '#fb923c',
            [`--gradient-via` as any]: assignedColor.textClass.includes('blue') ? '#3b82f6' : 
                                      assignedColor.textClass.includes('pink') ? '#f43f5e' :
                                      assignedColor.textClass.includes('emerald') ? '#22c55e' : '#f59e0b',
            [`--gradient-to` as any]: assignedColor.textClass.includes('blue') ? '#6366f1' : 
                                     assignedColor.textClass.includes('pink') ? '#a855f7' :
                                     assignedColor.textClass.includes('emerald') ? '#14b8a6' : '#eab308'
          }}
        >
          <AccordionTrigger 
            className={`liquid-trigger text-left font-semibold hover:no-underline px-6 py-2 text-base md:text-lg leading-relaxed flex items-center justify-between transition-all duration-300 ${
              shouldShowColoredText ? assignedColor.textClass : 'text-gray-900'
            }`}
          >
            <span className="flex-1 pr-4 text-gray-900 whitespace-nowrap truncate overflow-hidden transition-colors duration-200" title={faq.question}>{faq.question}</span>
          </AccordionTrigger>
          <AccordionContent className="text-gray-700 leading-relaxed px-6 pb-6 pt-2 text-sm md:text-base">
            <div className="flex items-start justify-center">
              <p className="text-left text-gray-700">{faq.answer}</p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </div>

      {/* Enhanced Ripple Effects */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="absolute pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: "4px",
            height: "4px",
            borderRadius: "50%",
            background: "rgba(59, 130, 246, 0.6)",
            transform: "translate(-50%, -50%)",
            animation: "liquidRipple 0.6s ease-out forwards",
          }}
        />
      ))}

      {/* Authentic Glass Highlight */}
      <div 
        className="absolute inset-0 pointer-events-none z-1" 
        style={{
          borderRadius: '20px',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%, rgba(0, 0, 0, 0.05) 100%)',
        }}
      />
    </div>
  )
}

export default function FAQ({ onOpenModal }: { onOpenModal?: () => void }) {
  return (
    <section className="py-20 relative">
      {/* Base background */}
      <div className="absolute inset-0 control-center-bg"></div>
      
      {/* Desktop gradient - Behind FAQ cards area, flowing from sides inward */}
      <div className="hidden md:block absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/3 via-transparent via-sky-400/4 via-blue-600/3 to-transparent"></div>
        
        {/* Left side emerald flow - targeting cards area */}
        <div className="absolute top-1/2 left-0 w-1/2 h-3/5 bg-gradient-to-r from-emerald-500/10 via-emerald-400/6 via-sky-400/4 to-transparent rounded-full blur-3xl transform -translate-y-1/4"></div>
        
        {/* Right side blue flow - targeting cards area */}
        <div className="absolute top-1/2 right-0 w-1/2 h-3/5 bg-gradient-to-l from-blue-600/10 via-blue-500/6 via-sky-400/4 to-transparent rounded-full blur-3xl transform -translate-y-1/4"></div>
        
        {/* Left side purple accent - upper cards */}
        <div className="absolute top-1/3 left-0 w-2/5 h-1/3 bg-gradient-to-r from-purple-500/8 via-purple-400/5 to-transparent rounded-full blur-3xl"></div>
        
        {/* Right side pink accent - upper cards */}
        <div className="absolute top-1/3 right-0 w-2/5 h-1/3 bg-gradient-to-l from-pink-500/8 via-pink-400/5 to-transparent rounded-full blur-3xl"></div>
        
        {/* Left side orange accent - lower cards */}
        <div className="absolute bottom-1/4 left-0 w-2/5 h-1/3 bg-gradient-to-r from-orange-400/7 via-orange-300/4 to-transparent rounded-full blur-3xl"></div>
        
        {/* Right side teal accent - lower cards */}
        <div className="absolute bottom-1/4 right-0 w-2/5 h-1/3 bg-gradient-to-l from-teal-500/7 via-teal-400/4 to-transparent rounded-full blur-3xl"></div>
        
        {/* Central background glow behind card columns */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/4 w-4/5 h-3/5 bg-gradient-to-r from-emerald-500/4 via-sky-400/5 via-purple-500/4 via-blue-600/4 to-pink-500/3 rounded-full blur-3xl"></div>
      </div>
      
      {/* Mobile gradient - Behind FAQ cards area, flowing from sides inward */}
      <div className="block md:hidden absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/4 via-transparent via-sky-400/5 via-blue-600/4 to-transparent"></div>
        
        {/* Left side emerald flow - behind cards */}
        <div className="absolute top-1/2 left-0 w-3/4 h-4/5 bg-gradient-to-r from-emerald-500/10 via-emerald-400/6 via-sky-400/4 to-transparent rounded-full blur-3xl transform -translate-y-1/4"></div>
        
        {/* Right side blue flow - behind cards */}
        <div className="absolute top-1/2 right-0 w-3/4 h-4/5 bg-gradient-to-l from-blue-600/10 via-blue-500/6 via-sky-400/4 to-transparent rounded-full blur-3xl transform -translate-y-1/4"></div>
        
        {/* Left side purple accent - upper cards area */}
        <div className="absolute top-1/3 left-0 w-3/5 h-1/4 bg-gradient-to-r from-purple-500/8 via-purple-400/5 to-transparent rounded-full blur-2xl"></div>
        
        {/* Right side pink accent - upper cards area */}
        <div className="absolute top-1/3 right-0 w-3/5 h-1/4 bg-gradient-to-l from-pink-500/8 via-pink-400/5 to-transparent rounded-full blur-2xl"></div>
        
        {/* Left side orange accent - lower cards area */}
        <div className="absolute bottom-1/3 left-0 w-3/5 h-1/4 bg-gradient-to-r from-orange-400/7 via-orange-300/4 to-transparent rounded-full blur-2xl"></div>
        
        {/* Right side teal accent - lower cards area */}
        <div className="absolute bottom-1/3 right-0 w-3/5 h-1/4 bg-gradient-to-l from-teal-500/7 via-teal-400/4 to-transparent rounded-full blur-2xl"></div>
        
        {/* Central background glow behind all cards */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/4 w-5/6 h-4/5 bg-gradient-to-b from-emerald-500/4 via-sky-400/5 via-purple-500/4 via-blue-600/4 to-pink-500/3 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Desktop-only CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20 hidden md:block"
        >
          <motion.div
            animate={{
              y: [0, -16, 0],
              rotateX: [0, 4, 0],
              rotateY: [0, 3, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
                      <Button
            size="lg"
            onClick={onOpenModal}
            className="bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 hover:from-emerald-600 hover:via-sky-500 hover:to-blue-700 text-white border-0 text-lg px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-xl"
          >
            Transform Your Resume Now
          </Button>
          </motion.div>
        </motion.div>

        {/* Section Header - Centered and Matching Research Section Styling */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16 flex flex-col items-center justify-center"
        >
          <div className="space-y-1 md:space-y-2 flex flex-col items-center">
            <h2 className="text-[2.5rem] md:text-[3.2rem] leading-[1.1] font-bold text-gray-900 tracking-tight text-center">
              Questions <span className="text-3xl md:text-4xl">and</span>{" "}
              <span className="bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 bg-clip-text text-transparent">
                Answers.
              </span>
            </h2>
          </div>
        </motion.div>

        {/* FAQ Grid - Professional Liquid Glass Effect on Individual Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 justify-center max-w-5xl mx-auto"
        >
          {/* Column 1 */}
          <motion.div variants={itemVariants} className="space-y-6 flex flex-col items-center">
            <Accordion type="single" collapsible className="space-y-6 w-full max-w-[500px]">
              {faqData[0].map((faq, index) => (
                <LiquidFaqCard
                  key={`col1-${index}`}
                  faq={faq}
                  index={index}
                  colKey="col1"
                />
              ))}
            </Accordion>
          </motion.div>

          {/* Column 2 */}
          <motion.div variants={itemVariants} className="space-y-6 flex flex-col items-center">
            <Accordion type="single" collapsible className="space-y-6 w-full max-w-[500px]">
              {faqData[1].map((faq, index) => (
                <LiquidFaqCard
                  key={`col2-${index}`}
                  faq={faq}
                  index={index}
                  colKey="col2"
                />
              ))}
            </Accordion>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
} 