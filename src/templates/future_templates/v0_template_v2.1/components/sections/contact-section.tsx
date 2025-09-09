"use client"
import { motion } from "framer-motion"
import { AnimatedSection, itemVariants } from "@/components/ui/animated-section"
import { useFontSize } from "@/contexts/font-size-context"
import { cn } from "@/lib/utils"
import type React from "react"
import { Mail, Trash2, ArrowUpRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EditableText } from "@/components/ui/editable-text"
import { EditableSection } from "@/components/editable-section"
import { useEditMode } from "@/contexts/edit-mode-context"
import { useState } from "react"
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient"

interface ContactInfo {
  label: string
  value: string
  icon: React.ElementType
  href?: string
  className?: string
}

interface ContactSectionProps {
  title: string
  items: ContactInfo[]
}

export const ContactSection = ({ title, items }: ContactSectionProps) => {
  const { getSizeClasses } = useFontSize()
  const { isEditMode } = useEditMode()
  const [sectionTitle, setSectionTitle] = useState(title)
  const [contactItems, setContactItems] = useState(items)

  const updateItem = (index: number, field: keyof ContactInfo, value: string) => {
    const updated = [...contactItems]
    updated[index] = { ...updated[index], [field]: value }
    setContactItems(updated)
  }

  const addContactItem = () => {
    const newItem: ContactInfo = {
      label: "New Contact",
      value: "Contact Information",
      icon: Mail,
      href: "#"
    }
    setContactItems([...contactItems, newItem])
  }

  const deleteContactItem = (index: number) => {
    const updated = contactItems.filter((_, i) => i !== index)
    setContactItems(updated)
  }

  return (
    <EditableSection
      sectionTitle="Contact"
      showAddButton={isEditMode}
      showMoveButtons={false}
      onAddItem={addContactItem}
    >
      <AnimatedSection id="contact">
        <EditableText
          as="h2"
          initialValue={sectionTitle}
          onSave={setSectionTitle}
          className={cn(
            "font-bold mb-12 text-left text-foreground",
            getSizeClasses("sectionTitle"),
          )}
        />
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
            {contactItems.map((item, i) => {
              const Icon = item.icon
              
              return (
                <motion.div
                  variants={itemVariants}
                  key={i}
                  className="relative"
                >
                  <HoverBorderGradient
                    containerClassName="rounded-2xl w-full"
                    className="bg-card text-card-foreground p-0 w-full"
                    duration={2}
                    as="div"
                  >
                    <div className={cn("relative z-10 h-full p-8 overflow-hidden",
                      item.className,
                    )}>
                      {/* Delete Button */}
                      {isEditMode && (
                        <Button 
                          size="icon" 
                          variant="destructive" 
                          className="absolute top-2 right-2 z-20 opacity-0 hover:opacity-100 transition-all duration-200 h-8 w-8 shadow-md"
                          onClick={() => deleteContactItem(i)}
                          title="Delete contact"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                      
                      <div className="flex items-start gap-6">
                        {/* Icon Container */}
                        <div className="relative group/icon">
                          <div className="absolute inset-0 bg-accent rounded-xl blur-xl opacity-50 group-hover/icon:opacity-100 transition-opacity duration-300" />
                          <div className="relative bg-accent p-4 rounded-xl transform transition-transform duration-300 group-hover/icon:scale-110">
                            <Icon className="h-8 w-8 text-white" />
                          </div>
                        </div>
                        
                        {/* Text Content */}
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-2">
                            <EditableText
                              as="h3"
                              initialValue={item.label}
                              onSave={(value) => updateItem(i, 'label', value)}
                              className={cn(
                                "text-foreground font-bold uppercase tracking-wider",
                                getSizeClasses("contactLabel"),
                              )}
                            />
                            <motion.div
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.3 }}
                            >
                              <Sparkles className="h-4 w-4 text-accent" />
                            </motion.div>
                          </div>
                          
                          {item.href && !isEditMode ? (
                            <a
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group/link inline-flex items-center gap-2"
                            >
                              <span className={cn(
                                "text-foreground group-hover/link:text-foreground transition-colors duration-300",
                                getSizeClasses("contactValue")
                              )}>
                                {item.value}
                              </span>
                              <ArrowUpRight className="h-4 w-4 text-accent opacity-0 group-hover/link:opacity-100 transition-all duration-300 transform group-hover/link:translate-x-1 group-hover/link:-translate-y-1" />
                            </a>
                          ) : (
                            <EditableText
                              as="p"
                              initialValue={item.value}
                              onSave={(value) => updateItem(i, 'value', value)}
                              className={cn(
                                "text-foreground",
                                getSizeClasses("contactValue")
                              )}
                            />
                          )}
                        </div>
                      </div>
                      
                      {/* Decorative Elements */}
                      <motion.div 
                        className="absolute -bottom-8 -right-8 w-32 h-32 bg-accent/20 rounded-full blur-3xl -z-10 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        transition={{ delay: 0.5 }}
                      />
                      <motion.div 
                        className="absolute -top-8 -left-8 w-24 h-24 bg-accent/20 rounded-full blur-2xl -z-10 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        transition={{ delay: 0.7 }}
                      />
                    </div>
                  </HoverBorderGradient>
                </motion.div>
              )
            })}
          </div>
          
          {/* Call to Action */}
          <motion.div 
            variants={itemVariants}
            className="mt-12 text-center"
          >
            <motion.p
              className="text-foreground text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Let's create something amazing together
            </motion.p>
            <motion.div
              className="mt-2 h-1 w-24 mx-auto bg-accent rounded-full"
              initial={{ width: 0 }}
              animate={{ width: 96 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            />
          </motion.div>
        </div>
      </AnimatedSection>
    </EditableSection>
  )
}
