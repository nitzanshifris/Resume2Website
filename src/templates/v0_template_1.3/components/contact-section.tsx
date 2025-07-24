"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { EditableText } from "@/components/ui/editable-text"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Download, Send } from "lucide-react"
import { socialIconMap, type ContactData } from "@/lib/data"
import { ContactForm } from "@/components/contact-form"
import { LavaLamp } from "@/components/ui/fluid-blob"

interface ContactSectionProps {
  data: ContactData
  onSave: (field: keyof Omit<ContactData, "professionalLinks" | "location">, value: string) => void
  onSaveLocation: (field: keyof ContactData["location"], value: string) => void
}

export function ContactSection({ data, onSave, onSaveLocation }: ContactSectionProps) {
  const [isFormVisible, setIsFormVisible] = useState(false)

  const handleCopyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${type} copied to clipboard!`)
  }

  return (
    <footer id="contact" className="relative bg-secondary/30 overflow-hidden">
      {/* Fluid Blob Background */}
      <div className="absolute inset-0 z-0 opacity-20">
        <LavaLamp />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center text-center py-24 px-4"
      >
        <h2 className="text-3xl sm:text-5xl md:text-7xl font-bold font-serif mb-4">Let's Create Together</h2>
        <EditableText
          as="p"
          initialValue={data.availability ?? ""}
          onSave={(value) => onSave("availability", value)}
          className="text-sm sm:text-lg font-sans font-light mb-10 sm:mb-20 text-muted-foreground max-w-3xl"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-16 lg:gap-x-24 w-full">
          {/* Left Column: Contact Info & Buttons */}
          <div className="flex flex-col items-center lg:items-start text-left lg:pl-32">
            <h3 className="text-2xl sm:text-3xl font-serif font-bold mb-8">Reach Out Directly</h3>
            <div className="flex flex-col items-start gap-4 sm:gap-6 text-base sm:text-xl mb-12">
              {/* Phone, Email, Location */}
              {data.phone && (
                <button
                  onClick={() => handleCopyToClipboard(data.phone, "Phone number")}
                  className="flex items-center gap-4 text-foreground hover:text-black transition-colors group"
                >
                  <Phone className="h-7 w-7 text-gray-600 group-hover:text-black transition-colors" />
                  <EditableText as="span" initialValue={data.phone ?? ""} onSave={(value) => onSave("phone", value)} />
                </button>
              )}
              {data.email && (
                <button
                  onClick={() => handleCopyToClipboard(data.email, "Email address")}
                  className="flex items-center gap-4 text-foreground hover:text-black transition-colors group"
                >
                  <Mail className="h-7 w-7 text-gray-600 group-hover:text-black transition-colors" />
                  <EditableText as="span" initialValue={data.email ?? ""} onSave={(value) => onSave("email", value)} />
                </button>
              )}
              {data.location?.city && data.location?.country && (
                <div className="flex items-center gap-4 text-foreground">
                  <MapPin className="h-7 w-7 text-gray-600" />
                  <span>
                    <EditableText
                      as="span"
                      initialValue={data.location.city}
                      onSave={(value) => onSaveLocation("city", value)}
                    />
                    {", "}
                    <EditableText
                      as="span"
                      initialValue={data.location.country}
                      onSave={(value) => onSaveLocation("country", value)}
                    />
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center lg:items-start gap-6 mb-12">
              <motion.div
                animate={!isFormVisible ? {
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                  ]
                } : {}}
                transition={{
                  duration: 2,
                  repeat: !isFormVisible ? Infinity : 0,
                  repeatType: "loop",
                  ease: "easeInOut"
                }}
              >
                <Button
                  onClick={() => setIsFormVisible(true)}
                  className="px-6 py-4 text-lg sm:px-10 sm:py-8 sm:text-xl font-semibold rounded-full bg-black text-white hover:bg-gray-800 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <Send className="mr-3 h-6 w-6" />
                  Send a Message
                </Button>
              </motion.div>
              <Button
                asChild
                className="px-6 py-4 text-lg sm:px-10 sm:py-8 sm:text-xl font-semibold rounded-full bg-black text-white hover:bg-gray-800 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <a href="/michelle-lopez-cv.pdf" download="michelle-lopez-cv.pdf">
                  <Download className="mr-3 h-6 w-6" />
                  Download CV
                </a>
              </Button>
            </div>

            <div className="flex justify-start gap-4">
              {data.professionalLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-card/50 rounded-full text-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-300 ease-in-out transform hover:scale-110 backdrop-blur-sm border border-border/20"
                  aria-label={link.name}
                >
                  {socialIconMap[link.name]}
                </a>
              ))}
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="flex flex-col items-center lg:items-start text-left min-h-[450px]">
            <AnimatePresence mode="wait">
              {isFormVisible && (
                <motion.div
                  key="contact-form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="w-full"
                >
                  <ContactForm />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
      <div className="bg-background/80 backdrop-blur-sm py-4">
        <EditableText
          as="p"
          initialValue={data.copyright ?? ""}
          onSave={(value) => onSave("copyright", value)}
          className="text-base text-muted-foreground text-center"
        />
      </div>
    </footer>
  )
}
