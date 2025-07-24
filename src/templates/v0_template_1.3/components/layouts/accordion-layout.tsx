"use client"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { EditableText } from "@/components/ui/editable-text"
import type { ExperienceItem } from "@/lib/data"
import { motion, AnimatePresence } from "framer-motion"
import { Briefcase, Calendar, TrendingUp, Award, Users, Target, Sparkles, Plus, X } from "lucide-react"
import { useState, useEffect } from "react"
import { useEditMode } from "@/contexts/edit-mode-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface AccordionLayoutProps {
  items: ExperienceItem[]
  onSave: (index: number, field: keyof ExperienceItem, value: string | string[]) => void
}

export function AccordionLayout({ items, onSave }: AccordionLayoutProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [openItem, setOpenItem] = useState<string | undefined>()
  const [newTechnology, setNewTechnology] = useState<{ [key: number]: string }>({})
  const { isEditMode } = useEditMode()
  
  const isCurrentRole = (endDate: string) => {
    return endDate.toLowerCase().includes('present') || endDate.toLowerCase().includes('current')
  }

  const calculateDuration = (startDate: string, endDate: string) => {
    // Simple duration calculation (can be enhanced)
    const start = new Date(startDate)
    const end = isCurrentRole(endDate) ? new Date() : new Date(endDate)
    const months = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30))
    const years = Math.floor(months / 12)
    const remainingMonths = months % 12
    
    if (years > 0) {
      return `${years}y ${remainingMonths}m`
    }
    return `${months}m`
  }

  return (
    <div className="relative">
      {/* Enhanced career progression line with glow */}
      <div className="absolute left-[35px] top-0 bottom-0 hidden sm:block">
        <div className="absolute inset-0 w-0.5 bg-gradient-to-b from-accent via-accent/50 to-transparent" />
        <div className="absolute inset-0 w-2 bg-gradient-to-b from-accent/30 via-accent/10 to-transparent blur-sm" />
      </div>
      
      <Accordion 
        type="single" 
        collapsible 
        className="w-full max-w-4xl mx-auto space-y-6"
        value={openItem}
        onValueChange={setOpenItem}
      >
        {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          onHoverStart={() => setHoveredIndex(i)}
          onHoverEnd={() => setHoveredIndex(null)}
        >
          <AccordionItem 
            value={`item-${i}`} 
            className={`
              relative border rounded-xl overflow-hidden transition-all duration-300
              ${openItem === `item-${i}` 
                ? 'border-accent bg-gradient-to-br from-accent/5 to-accent/10 shadow-2xl shadow-accent/20 scale-[1.02]' 
                : 'border-accent/20 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/10'
              }
              ${hoveredIndex === i ? 'z-10' : 'z-0'}
            `}
          >
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-gradient-to-br from-accent via-transparent to-accent" />
              {openItem === `item-${i}` && (
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    backgroundImage: [
                      'radial-gradient(circle at 20% 80%, rgba(var(--accent), 0.1) 0%, transparent 50%)',
                      'radial-gradient(circle at 80% 20%, rgba(var(--accent), 0.1) 0%, transparent 50%)',
                      'radial-gradient(circle at 20% 80%, rgba(var(--accent), 0.1) 0%, transparent 50%)',
                    ],
                  }}
                  transition={{ duration: 10, repeat: Infinity }}
                />
              )}
            </div>
            
            <AccordionTrigger className="text-left hover:no-underline py-8 group cursor-pointer px-6 relative z-10">
            <div className="flex flex-row justify-between items-start w-full pr-4">
              <div className="flex-1 mb-0">
                <div className="flex items-start gap-3">
                  <motion.div 
                    className="mt-1.5 relative z-10"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className={`relative p-3 rounded-2xl transition-all duration-300 ${
                      isCurrentRole(item.endDate) 
                        ? 'bg-gradient-to-br from-accent to-accent/80 shadow-lg shadow-accent/30 ring-4 ring-accent/20' 
                        : 'bg-gradient-to-br from-accent/20 to-accent/10 group-hover:from-accent/30 group-hover:to-accent/20'
                    }`}>
                      <Briefcase className={`h-6 w-6 ${
                        isCurrentRole(item.endDate) ? 'text-accent-foreground' : 'text-accent'
                      }`} />
                      
                      {/* Sparkle effect for current role */}
                      {isCurrentRole(item.endDate) && (
                        <motion.div
                          className="absolute inset-0"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        >
                          <Sparkles className="h-3 w-3 text-accent-foreground absolute -top-1 -right-1" />
                        </motion.div>
                      )}
                    </div>
                    
                    {/* Live indicator */}
                    {isCurrentRole(item.endDate) && (
                      <div className="absolute -top-2 -right-2">
                        <div className="relative">
                          <div className="h-4 w-4 bg-green-500 rounded-full animate-pulse" />
                          <div className="absolute inset-0 h-4 w-4 bg-green-400 rounded-full animate-ping" />
                        </div>
                      </div>
                    )}
                  </motion.div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <EditableText
                        as="h3"
                        className="font-serif text-2xl sm:text-4xl font-bold text-card-foreground group-hover:text-[#3b82f6] transition-all duration-300"
                        initialValue={item.title}
                        onSave={(v) => onSave(i, "title", v)}
                      />
                      {isCurrentRole(item.endDate) && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-accent/20 text-accent text-xs font-medium rounded-full border border-accent/30"
                        >
                          <div className="h-1.5 w-1.5 bg-accent rounded-full animate-pulse" />
                          Active
                        </motion.span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <EditableText
                        as="p"
                        className="font-sans text-xl sm:text-2xl font-semibold text-card-foreground"
                        initialValue={item.company}
                        onSave={(v) => onSave(i, "company", v)}
                      />
                      <span className="text-muted-foreground">•</span>
                      <span className="text-sm font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
                        {calculateDuration(item.startDate, item.endDate)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4 opacity-60" />
                  <EditableText
                    as="p"
                    className="font-sans text-base sm:text-lg text-card-foreground font-medium"
                    initialValue={`${item.startDate} - ${item.endDate}`}
                    onSave={(v) => {
                      const [start = "", end = ""] = v.split(" - ")
                      onSave(i, "startDate", start.trim())
                      onSave(i, "endDate", end.trim())
                    }}
                  />
                </div>
                {/* Achievement badges */}
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="p-1.5 bg-accent/10 rounded-lg"
                    title="Key Achievements"
                  >
                    <Award className="h-4 w-4 text-accent" />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="p-1.5 bg-accent/10 rounded-lg"
                    title="Team Leadership"
                  >
                    <Users className="h-4 w-4 text-accent" />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="p-1.5 bg-accent/10 rounded-lg"
                    title="Growth & Impact"
                  >
                    <TrendingUp className="h-4 w-4 text-accent" />
                  </motion.div>
                </div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-8 px-6 relative overflow-hidden">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="pl-16"
            >
              {/* Enhanced content with gradient border */}
              <div className="relative">
                <div className="absolute -left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent via-accent/50 to-transparent" />
                <div className="absolute -left-6.5 top-0 bottom-0 w-2 bg-gradient-to-b from-accent/20 via-accent/10 to-transparent blur-sm" />
                
                <div className="space-y-6">
                  {/* Main description */}
                  <EditableText
                    textarea
                    as="p"
                    className="font-sans text-lg sm:text-xl text-card-foreground leading-relaxed"
                    initialValue={item.description}
                    onSave={(v) => onSave(i, "description", v)}
                  />
                  
                  {/* Key achievements section */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="p-4 bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg border border-accent/20"
                    >
                      <Award className="h-5 w-5 text-accent mb-2" />
                      <h4 className="font-semibold text-sm mb-1 text-card-foreground">Key Achievement</h4>
                      <p className="text-xs text-card-foreground/70">Led successful product launch</p>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="p-4 bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg border border-accent/20"
                    >
                      <Users className="h-5 w-5 text-accent mb-2" />
                      <h4 className="font-semibold text-sm mb-1 text-card-foreground">Team Impact</h4>
                      <p className="text-xs text-card-foreground/70">Managed cross-functional team</p>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="p-4 bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg border border-accent/20"
                    >
                      <Target className="h-5 w-5 text-accent mb-2" />
                      <h4 className="font-semibold text-sm mb-1 text-card-foreground">Business Impact</h4>
                      <p className="text-xs text-card-foreground/70">Increased revenue by 40%</p>
                    </motion.div>
                  </div>
                  
                  {/* Skills used */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-wrap gap-2 pt-4 border-t border-accent/10"
                  >
                    <span className="text-xs font-medium text-card-foreground mr-2">Technologies:</span>
                    {(item.technologies || []).map((tech, idx) => (
                      <span
                        key={idx}
                        className="group/tech relative px-2 py-1 text-xs bg-accent/10 text-accent font-medium rounded-md border border-accent/20"
                      >
                        {tech}
                        {isEditMode && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="absolute -top-2 -right-2 h-4 w-4 p-0 opacity-0 group-hover/tech:opacity-100 transition-opacity"
                            onClick={() => {
                              const newTechs = [...(item.technologies || [])]
                              newTechs.splice(idx, 1)
                              onSave(i, "technologies", newTechs)
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </span>
                    ))}
                    {isEditMode && (
                      <div className="flex items-center gap-1">
                        <Input
                          type="text"
                          placeholder="Add tech"
                          value={newTechnology[i] || ''}
                          onChange={(e) => setNewTechnology({ ...newTechnology, [i]: e.target.value })}
                          className="h-6 w-24 text-xs"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && newTechnology[i]) {
                              const newTechs = [...(item.technologies || []), newTechnology[i]]
                              onSave(i, "technologies", newTechs)
                              setNewTechnology({ ...newTechnology, [i]: '' })
                            }
                          }}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={() => {
                            if (newTechnology[i]) {
                              const newTechs = [...(item.technologies || []), newTechnology[i]]
                              onSave(i, "technologies", newTechs)
                              setNewTechnology({ ...newTechnology, [i]: '' })
                            }
                          }}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AccordionContent>
        </AccordionItem>
        </motion.div>
      ))}
    </Accordion>
    </div>
  )
}
