"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { EditableText } from "@/components/ui/editable-text"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Download, Send, X } from "lucide-react"
import { socialIconMap, type ContactData } from "@/lib/data"
import { cn } from "@/lib/utils"
import { renderIcon } from "@/lib/icon-utils"
import { IconSelector } from "@/components/ui/icon-selector"
import { IconWithZoom } from "@/components/ui/icon-with-zoom"
import { useEditMode } from "@/contexts/edit-mode-context"
import { EditGuard } from "@/components/ui/edit-guard"
import { ContactForm } from "@/components/contact-form"
import { LavaLamp } from "@/components/ui/fluid-blob"

interface ContactSectionProps {
  data: ContactData
  onSave: (field: keyof Omit<ContactData, "professionalLinks" | "location">, value: string) => void
  onSaveLocation: (field: keyof ContactData["location"], value: string) => void
  onSaveProfessionalLink?: (index: number, field: keyof ContactData["professionalLinks"][0], value: any) => void
}

export function ContactSection({ data, onSave, onSaveLocation, onSaveProfessionalLink }: ContactSectionProps) {
  const { isEditMode, isEditAllowed } = useEditMode()
  const [isFormVisible, setIsFormVisible] = useState(false)
  
  // Safety check - only allow edit functions when in edit mode
  const safeOnSaveProfessionalLink = isEditAllowed('ContactSection') ? onSaveProfessionalLink : undefined

  const handleCopyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${type} copied to clipboard!`)
  }

  return (
    <footer id="contact" className="relative bg-background overflow-hidden">
      {/* Fluid Blob Background */}
      <div className="absolute inset-0 z-0 opacity-15">
        <LavaLamp />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center text-center py-24 px-4"
      >
        <EditableText
          as="h2"
          initialValue={data.mainTitle || "Let's Create Together"}
          onSave={(value) => onSave("mainTitle", value)}
          className="text-3xl sm:text-5xl md:text-7xl font-bold font-serif mb-4"
          isEditMode={isEditMode}
        />
        <EditableText
          as="p"
          initialValue={data.availability ?? ""}
          onSave={(value) => onSave("availability", value)}
          className="text-sm sm:text-lg font-sans font-light mb-10 sm:mb-20 text-muted-foreground max-w-3xl"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-16 lg:gap-x-24 w-full">
          {/* Left Column: Contact Info & Buttons */}
          <div className="flex flex-col items-center lg:items-start text-left lg:pl-32">
            <EditableText
              as="h3"
              initialValue={data.contactSectionTitle || "Reach Me Directly"}
              onSave={(value) => onSave("contactSectionTitle", value)}
              className="text-2xl sm:text-3xl font-serif font-bold mb-8"
              isEditMode={isEditMode}
            />
            <div className="flex flex-col items-start gap-4 sm:gap-6 text-base sm:text-xl mb-12">
              {/* Phone, Email, Location */}
              {data.phone && (
                <div className="relative group/contact-item">
                  {isEditMode ? (
                    <div className="flex items-center gap-4 text-foreground">
                      <Phone className="h-7 w-7 text-accent/80" />
                      <EditableText as="span" initialValue={data.phone ?? ""} onSave={(value) => onSave("phone", value)} isEditMode={isEditMode} />
                    </div>
                  ) : (
                    <button
                      onClick={() => handleCopyToClipboard(data.phone, "Phone number")}
                      className="flex items-center gap-4 text-foreground hover:text-accent transition-colors group"
                    >
                      <Phone className="h-7 w-7 text-accent/80 group-hover:text-accent transition-colors" />
                      <span>{data.phone}</span>
                    </button>
                  )}
                  {isEditMode && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute -top-2 -right-2 z-20 h-6 w-6 p-0 rounded-full bg-red-500/90 hover:bg-red-600/90 text-white shadow-lg opacity-0 group-hover/contact-item:opacity-100 transition-all duration-200"
                      onClick={() => onSave("phone", "")}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              )}
              {data.email && (
                <div className="relative group/contact-item">
                  {isEditMode ? (
                    <div className="flex items-center gap-4 text-foreground">
                      <Mail className="h-7 w-7 text-accent/80" />
                      <EditableText as="span" initialValue={data.email ?? ""} onSave={(value) => onSave("email", value)} isEditMode={isEditMode} />
                    </div>
                  ) : (
                    <button
                      onClick={() => handleCopyToClipboard(data.email, "Email address")}
                      className="flex items-center gap-4 text-foreground hover:text-accent transition-colors group"
                    >
                      <Mail className="h-7 w-7 text-accent/80 group-hover:text-accent transition-colors" />
                      <span>{data.email}</span>
                    </button>
                  )}
                  {isEditMode && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute -top-2 -right-2 z-20 h-6 w-6 p-0 rounded-full bg-red-500/90 hover:bg-red-600/90 text-white shadow-lg opacity-0 group-hover/contact-item:opacity-100 transition-all duration-200"
                      onClick={() => onSave("email", "")}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              )}
              {data.location?.city && data.location?.country && (
                <div className="relative group/contact-item">
                  <div className="flex items-center gap-4 text-foreground">
                    <MapPin className="h-7 w-7 text-accent/80" />
                    <span>
                      <EditableText
                        as="span"
                        initialValue={data.location.city}
                        onSave={(value) => onSaveLocation("city", value)}
                        isEditMode={isEditMode}
                      />
                      {", "}
                      <EditableText
                        as="span"
                        initialValue={data.location.country}
                        onSave={(value) => onSaveLocation("country", value)}
                        isEditMode={isEditMode}
                      />
                    </span>
                  </div>
                  {isEditMode && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute -top-2 -right-2 z-20 h-6 w-6 p-0 rounded-full bg-red-500/90 hover:bg-red-600/90 text-white shadow-lg opacity-0 group-hover/contact-item:opacity-100 transition-all duration-200"
                      onClick={() => {
                        onSaveLocation("city", "")
                        onSaveLocation("country", "")
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col items-center lg:items-start gap-6 mb-12">
              <div className="relative group/button">
                {isEditMode ? (
                  <div className="relative px-6 py-4 text-lg sm:px-10 sm:py-8 sm:text-xl font-semibold rounded-full bg-accent text-accent-foreground transition-all duration-300 ease-in-out shadow-lg transform flex items-center justify-center overflow-hidden">
                    {/* Glow effect */}
                    <div className="absolute inset-0 rounded-full bg-accent/20 blur-xl transition-all duration-300" />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent/0 via-accent/20 to-accent/0 blur-2xl animate-pulse" />
                    
                    {/* Border glow */}
                    <div className="absolute inset-0 rounded-full ring-2 ring-accent/50 transition-all duration-300" />
                    <div className="absolute inset-0 rounded-full ring-4 ring-accent/20 animate-pulse transition-all duration-300" />
                    
                    {/* Content */}
                    <span className="relative z-10 flex items-center">
                      <Send className="mr-3 h-6 w-6" />
                      <EditableText
                        as="span"
                        initialValue={data.sendMessageButtonText || "Send a Message"}
                        onSave={(value) => onSave("sendMessageButtonText", value)}
                        className="font-semibold !bg-transparent !text-accent-foreground"
                        isEditMode={isEditMode}
                      />
                    </span>
                  </div>
                ) : (
                  <Button
                    onClick={() => setIsFormVisible(true)}
                    className="relative px-6 py-4 text-lg sm:px-10 sm:py-8 sm:text-xl font-semibold rounded-full bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300 ease-in-out transform hover:-translate-y-1 group overflow-hidden"
                  >
                    {/* Glow effect */}
                    <div className="absolute inset-0 rounded-full bg-accent/20 blur-xl group-hover:bg-accent/30 transition-all duration-300" />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent/0 via-accent/20 to-accent/0 blur-2xl animate-pulse" />
                    
                    {/* Border glow */}
                    <div className="absolute inset-0 rounded-full ring-2 ring-accent/50 group-hover:ring-accent/80 transition-all duration-300" />
                    <div className="absolute inset-0 rounded-full ring-4 ring-accent/20 group-hover:ring-accent/40 animate-pulse transition-all duration-300" />
                    
                    {/* Content */}
                    <span className="relative z-10 flex items-center">
                      <Send className="mr-3 h-6 w-6" />
                      {data.sendMessageButtonText || "Send a Message"}
                    </span>
                  </Button>
                )}
                {isEditMode && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute -top-2 -right-2 z-20 h-6 w-6 p-0 rounded-full bg-red-500/90 hover:bg-red-600/90 text-white shadow-lg opacity-0 group-hover/button:opacity-100 transition-all duration-200"
                    onClick={() => onSave("sendMessageButtonText", "")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
              
              <div className="relative group/button">
                {isEditMode ? (
                  <div className="px-6 py-4 text-lg sm:px-10 sm:py-8 sm:text-xl font-semibold rounded-full bg-accent text-accent-foreground transition-all duration-300 ease-in-out shadow-lg transform flex items-center justify-center">
                    <Download className="mr-3 h-6 w-6" />
                    <EditableText
                      as="span"
                      initialValue={data.downloadCvButtonText || "Download CV"}
                      onSave={(value) => onSave("downloadCvButtonText", value)}
                      className="font-semibold !bg-transparent !text-accent-foreground"
                      isEditMode={isEditMode}
                    />
                  </div>
                ) : (
                  <Button
                    asChild
                    className="px-6 py-4 text-lg sm:px-10 sm:py-8 sm:text-xl font-semibold rounded-full bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <a href="/cv.pdf" download="cv.pdf">
                      <Download className="mr-3 h-6 w-6" />
                      {data.downloadCvButtonText || "Download CV"}
                    </a>
                  </Button>
                )}
                {isEditMode && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute -top-2 -right-2 z-20 h-6 w-6 p-0 rounded-full bg-red-500/90 hover:bg-red-600/90 text-white shadow-lg opacity-0 group-hover/button:opacity-100 transition-all duration-200"
                    onClick={() => onSave("downloadCvButtonText", "")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>

            <div className="flex justify-start gap-4">
              {data.professionalLinks.map((link, index) => (
                <div key={link.name} className="relative group/link">
                  {isEditMode ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className={cn(
                        "p-3 bg-card/50 rounded-full text-foreground transition-all duration-300 ease-in-out backdrop-blur-sm border border-border/20",
                        "gradient-border-dashed"
                      )}>
                        {link.customIcon ? renderIcon(link.customIcon, "h-7 w-7") : socialIconMap[link.name]}
                      </div>
                      <EditableText
                        as="span"
                        initialValue={link.url}
                        onSave={(value) => safeOnSaveProfessionalLink?.(index, "url", value)}
                        className="text-xs text-center max-w-20 truncate text-muted-foreground block"
                        isEditMode={isEditMode}
                      />
                    </div>
                  ) : (
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-card/50 rounded-full text-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-300 ease-in-out transform hover:scale-110 backdrop-blur-sm border border-border/20 block"
                      aria-label={link.name}
                    >
                      {link.customIcon ? renderIcon(link.customIcon, "h-7 w-7") : socialIconMap[link.name]}
                    </a>
                  )}
                </div>
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
        
        {/* Apple-style Additional Information Section - Theme Aware */}
        {(data.placeOfBirth || data.nationality || data.dateOfBirth || data.maritalStatus || data.drivingLicense || data.visaStatus) && (
          <div className="mt-6 w-full max-w-7xl mx-auto px-4">
            {/* Main glassmorphism container - Full width */}
            <div className="relative">
              {/* Background blur layers - Subtle */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.08] via-white/[0.04] to-white/[0.02] dark:from-white/[0.04] dark:via-white/[0.02] dark:to-white/[0.01] backdrop-blur-lg border border-white/10 dark:border-white/5 shadow-lg"></div>
              
              {/* Content */}
              <div className="relative p-6">
                <EditableText
                  as="h3"
                  initialValue={data.personalInfoTitle || "Personal Information"}
                  onSave={(value) => onSave("personalInfoTitle", value)}
                  className="text-lg font-normal text-center mb-6 text-foreground/70 tracking-normal"
                  isEditMode={isEditMode}
                />
                
                {/* Single row grid for desktop */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-6 gap-3">
                  
                  {/* Only show cards for actual data */}
                  {data.placeOfBirth && (
                    <div className="group/card relative">
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/[0.08] to-white/[0.03] dark:from-white/[0.04] dark:to-white/[0.02] backdrop-blur-md border border-white/10 dark:border-white/5 shadow-sm group-hover/card:shadow-md transition-all duration-200"></div>
                      {isEditMode && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute -top-2 -right-2 z-10 h-6 w-6 p-0 rounded-full bg-red-500/90 hover:bg-red-600/90 text-white shadow-lg opacity-0 group-hover/card:opacity-100 transition-all duration-200"
                          onClick={() => onSave("placeOfBirth", "")}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                      <div className="relative p-3 flex flex-col space-y-1">
                        <span className="text-[10px] font-medium text-foreground/50 uppercase tracking-wider">Place of Birth</span>
                        <EditableText
                          as="span"
                          initialValue={data.placeOfBirth}
                          onSave={(value) => onSave("placeOfBirth", value)}
                          className="text-sm font-medium text-foreground leading-tight"
                          isEditMode={isEditMode}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Handle multiple nationalities - split by comma and display as separate cards */}
                  {data.nationality && (
                    <>
                      {(typeof data.nationality === 'string' && data.nationality.includes(',') ? 
                        data.nationality.split(',').map(n => n.trim()) : 
                        [data.nationality]
                      ).map((nationality, index) => (
                        <div key={`nationality-${index}`} className="group/card relative">
                          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/[0.08] to-white/[0.03] dark:from-white/[0.04] dark:to-white/[0.02] backdrop-blur-md border border-white/10 dark:border-white/5 shadow-sm group-hover/card:shadow-md transition-all duration-200"></div>
                          {isEditMode && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute -top-2 -right-2 z-10 h-6 w-6 p-0 rounded-full bg-red-500/90 hover:bg-red-600/90 text-white shadow-lg opacity-0 group-hover/card:opacity-100 transition-all duration-200"
                              onClick={() => {
                                // Remove this specific nationality
                                const nationalities = data.nationality.split(',').map(n => n.trim());
                                nationalities.splice(index, 1);
                                onSave("nationality", nationalities.join(', ') || "");
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                          <div className="relative p-3 flex flex-col space-y-1">
                            <span className="text-[10px] font-medium text-foreground/50 uppercase tracking-wider">Nationality</span>
                            <span className="text-sm font-medium text-foreground leading-tight">
                              {nationality}
                            </span>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                  
                  {data.dateOfBirth && (
                    <div className="group/card relative">
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/[0.08] to-white/[0.03] dark:from-white/[0.04] dark:to-white/[0.02] backdrop-blur-md border border-white/10 dark:border-white/5 shadow-sm group-hover/card:shadow-md transition-all duration-200"></div>
                      {isEditMode && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute -top-2 -right-2 z-10 h-6 w-6 p-0 rounded-full bg-red-500/90 hover:bg-red-600/90 text-white shadow-lg opacity-0 group-hover/card:opacity-100 transition-all duration-200"
                          onClick={() => onSave("dateOfBirth", "")}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                      <div className="relative p-3 flex flex-col space-y-1">
                        <span className="text-[10px] font-medium text-foreground/50 uppercase tracking-wider">Date of Birth</span>
                        <EditableText
                          as="span"
                          initialValue={data.dateOfBirth}
                          onSave={(value) => onSave("dateOfBirth", value)}
                          className="text-sm font-medium text-foreground leading-tight"
                          isEditMode={isEditMode}
                        />
                      </div>
                    </div>
                  )}
                  
                  {data.maritalStatus && (
                    <div className="group/card relative">
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/[0.08] to-white/[0.03] dark:from-white/[0.04] dark:to-white/[0.02] backdrop-blur-md border border-white/10 dark:border-white/5 shadow-sm group-hover/card:shadow-md transition-all duration-200"></div>
                      {isEditMode && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute -top-2 -right-2 z-10 h-6 w-6 p-0 rounded-full bg-red-500/90 hover:bg-red-600/90 text-white shadow-lg opacity-0 group-hover/card:opacity-100 transition-all duration-200"
                          onClick={() => onSave("maritalStatus", "")}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                      <div className="relative p-3 flex flex-col space-y-1">
                        <span className="text-[10px] font-medium text-foreground/50 uppercase tracking-wider">Marital Status</span>
                        <EditableText
                          as="span"
                          initialValue={data.maritalStatus}
                          onSave={(value) => onSave("maritalStatus", value)}
                          className="text-sm font-medium text-foreground leading-tight"
                          isEditMode={isEditMode}
                        />
                      </div>
                    </div>
                  )}
                  
                  {data.drivingLicense && (
                    <div className="group/card relative">
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/[0.08] to-white/[0.03] dark:from-white/[0.04] dark:to-white/[0.02] backdrop-blur-md border border-white/10 dark:border-white/5 shadow-sm group-hover/card:shadow-md transition-all duration-200"></div>
                      {isEditMode && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute -top-2 -right-2 z-10 h-6 w-6 p-0 rounded-full bg-red-500/90 hover:bg-red-600/90 text-white shadow-lg opacity-0 group-hover/card:opacity-100 transition-all duration-200"
                          onClick={() => onSave("drivingLicense", "")}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                      <div className="relative p-3 flex flex-col space-y-1">
                        <span className="text-[10px] font-medium text-foreground/50 uppercase tracking-wider">Driving License</span>
                        <EditableText
                          as="span"
                          initialValue={data.drivingLicense}
                          onSave={(value) => onSave("drivingLicense", value)}
                          className="text-sm font-medium text-foreground leading-tight"
                          isEditMode={isEditMode}
                        />
                      </div>
                    </div>
                  )}
                  
                  {data.visaStatus && (
                    <div className="group/card relative">
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/[0.08] to-white/[0.03] dark:from-white/[0.04] dark:to-white/[0.02] backdrop-blur-md border border-white/10 dark:border-white/5 shadow-sm group-hover/card:shadow-md transition-all duration-200"></div>
                      {isEditMode && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute -top-2 -right-2 z-10 h-6 w-6 p-0 rounded-full bg-red-500/90 hover:bg-red-600/90 text-white shadow-lg opacity-0 group-hover/card:opacity-100 transition-all duration-200"
                          onClick={() => onSave("visaStatus", "")}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                      <div className="relative p-3 flex flex-col space-y-1">
                        <span className="text-[10px] font-medium text-foreground/50 uppercase tracking-wider">Visa Status</span>
                        <EditableText
                          as="span"
                          initialValue={data.visaStatus}
                          onSave={(value) => onSave("visaStatus", value)}
                          className="text-sm font-medium text-foreground leading-tight"
                          isEditMode={isEditMode}
                        />
                      </div>
                    </div>
                  )}
                  
                  {data.location?.state && (
                    <div className="group/card relative">
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/[0.08] to-white/[0.03] dark:from-white/[0.04] dark:to-white/[0.02] backdrop-blur-md border border-white/10 dark:border-white/5 shadow-sm group-hover/card:shadow-md transition-all duration-200"></div>
                      {isEditMode && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute -top-2 -right-2 z-10 h-6 w-6 p-0 rounded-full bg-red-500/90 hover:bg-red-600/90 text-white shadow-lg opacity-0 group-hover/card:opacity-100 transition-all duration-200"
                          onClick={() => onSaveLocation("state", "")}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                      <div className="relative p-3 flex flex-col space-y-1">
                        <span className="text-[10px] font-medium text-foreground/50 uppercase tracking-wider">State</span>
                        <EditableText
                          as="span"
                          initialValue={data.location.state}
                          onSave={(value) => onSaveLocation("state", value)}
                          className="text-sm font-medium text-foreground leading-tight"
                          isEditMode={isEditMode}
                        />
                      </div>
                    </div>
                  )}
                  
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </footer>
  )
}
