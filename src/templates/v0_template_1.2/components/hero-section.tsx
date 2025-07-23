"use client"
import { motion } from "framer-motion"
import { EditableText } from "@/components/ui/editable-text"
import { Sparkles } from "@/components/ui/sparkles"
import { Button } from "@/components/ui/button"
import { ArrowDown } from "lucide-react"
import type { HeroData } from "@/lib/data"
import Image from "next/image"

interface HeroSectionProps {
  data: HeroData
  onSave: (field: keyof HeroData, value: string) => void
  showPhoto: boolean
}

export function HeroSection({ data, onSave, showPhoto }: HeroSectionProps) {
  return (
    <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center overflow-hidden rounded-md pt-24">
      <EditableText
        as="h1"
        initialValue={data.fullName ?? ""}
        onSave={(value) => onSave("fullName", value)}
        className="text-9xl font-bold text-center text-foreground relative z-20 font-serif text-glow"
      />
      <div className="w-[40rem] h-12 relative">
        <div
          className="absolute inset-x-20 top-0 h-[2px] w-3/4 blur-sm"
          style={{ backgroundImage: "linear-gradient(to right, transparent, hsl(var(--accent)), transparent)" }}
        />
        <div
          className="absolute inset-x-20 top-0 h-px w-3/4"
          style={{ backgroundImage: "linear-gradient(to right, transparent, hsl(var(--accent)), transparent)" }}
        />
        <div
          className="absolute inset-x-60 top-0 h-[5px] w-1/4 blur-sm"
          style={{ backgroundImage: "linear-gradient(to right, transparent, hsl(var(--accent)), transparent)" }}
        />
        <div
          className="absolute inset-x-60 top-0 h-px w-1/4"
          style={{ backgroundImage: "linear-gradient(to right, transparent, hsl(var(--accent)), transparent)" }}
        />
        <Sparkles
          background="transparent"
          minSize={0.4}
          maxSize={1}
          particleDensity={1200}
          className="w-full h-full"
          particleColor="hsl(var(--accent))"
        />
        <div className="absolute inset-0 w-full h-full bg-background [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
      </div>
      <div className="text-7xl mx-auto font-normal text-foreground flex items-center gap-3 font-serif text-center">
        <EditableText
          as="span"
          initialValue={data.professionalTitle ?? ""}
          onSave={(value) => onSave("professionalTitle", value)}
        />
      </div>

      {data.profilePhotoUrl && showPhoto && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5, ease: "easeOut" }}
          className="mt-12"
        >
          <Image
            src={data.profilePhotoUrl || "/placeholder.svg"}
            alt={data.fullName ?? "Profile Photo"}
            width={192}
            height={192}
            className="rounded-full object-cover w-48 h-48 ring-2 ring-offset-4 ring-offset-background ring-accent shadow-lg"
            priority
          />
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5, ease: "easeOut" }}
        className="mt-16"
      >
        <Button
          asChild
          className="px-10 py-8 text-2xl font-semibold rounded-full bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          <a href="#contact">
            <ArrowDown className="mr-3 h-6 w-6" />
            Contact Me
          </a>
        </Button>
      </motion.div>
    </div>
  )
}
