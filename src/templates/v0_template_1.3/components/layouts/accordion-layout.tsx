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
      {/* Modern career progression line */}
      <div className="absolute left-[35px] top-0 bottom-0 hidden sm:block">
        <div className="absolute inset-0 w-0.5 bg-gradient-to-b from-blue-400 via-slate-300 to-transparent" />
        <div className="absolute inset-0 w-2 bg-gradient-to-b from-blue-200/40 via-slate-200/30 to-transparent blur-sm" />
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
                ? 'border-slate-200 bg-gradient-to-br from-slate-50/80 to-white/60 shadow-2xl shadow-slate-900/10 scale-[1.02] backdrop-blur-sm' 
                : 'border-slate-200/60 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-900/5 bg-white/40 backdrop-blur-sm'
              }
              ${hoveredIndex === i ? 'z-10' : 'z-0'}
            `}
          >
            {/* Modern subtle background pattern */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-100/50 via-transparent to-blue-50/30" />
              {openItem === `item-${i}` && (
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    backgroundImage: [
                      'radial-gradient(circle at 20% 80%, rgb(148 163 184 / 0.08) 0%, transparent 50%)',
                      'radial-gradient(circle at 80% 20%, rgb(59 130 246 / 0.05) 0%, transparent 50%)',
                      'radial-gradient(circle at 20% 80%, rgb(148 163 184 / 0.08) 0%, transparent 50%)',
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
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25 ring-4 ring-blue-200/50' 
                        : 'bg-gradient-to-br from-slate-100 to-slate-200/80 group-hover:from-slate-200 group-hover:to-slate-300/80 shadow-sm'
                    }`}>
                      <Briefcase className={`h-6 w-6 ${
                        isCurrentRole(item.endDate) ? 'text-white' : 'text-slate-700'
                      }`} />
                      
                      {/* Sparkle effect for current role */}
                      {isCurrentRole(item.endDate) && (
                        <motion.div
                          className="absolute inset-0"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        >
                          <Sparkles className="h-3 w-3 text-white absolute -top-1 -right-1" />
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
                        className="font-serif text-2xl sm:text-4xl font-bold text-slate-900 group-hover:text-blue-600 transition-all duration-300"
                        initialValue={item.title}
                        onSave={(v) => onSave(i, "title", v)}
                      />
                      {isCurrentRole(item.endDate) && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200"
                        >
                          <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
                          Active
                        </motion.span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <EditableText
                        as="p"
                        className="font-sans text-xl sm:text-2xl font-semibold text-slate-800"
                        initialValue={item.company}
                        onSave={(v) => onSave(i, "company", v)}
                      />
                      <span className="text-slate-400">•</span>
                      <span className="text-sm font-medium text-slate-600 bg-slate-100/80 px-2 py-1 rounded-md">
                        {calculateDuration(item.startDate, item.endDate)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2 text-slate-500">
                  <Calendar className="h-4 w-4 opacity-60" />
                  <EditableText
                    as="p"
                    className="font-sans text-base sm:text-lg text-slate-700 font-medium"
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
                    className="p-1.5 bg-blue-50 rounded-lg"
                    title="Key Achievements"
                  >
                    <Award className="h-4 w-4 text-blue-600" />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="p-1.5 bg-green-50 rounded-lg"
                    title="Team Leadership"
                  >
                    <Users className="h-4 w-4 text-green-600" />
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="p-1.5 bg-purple-50 rounded-lg"
                    title="Growth & Impact"
                  >
                    <TrendingUp className="h-4 w-4 text-purple-600" />
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
                <div className="absolute -left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 via-slate-300 to-transparent" />
                <div className="absolute -left-6.5 top-0 bottom-0 w-2 bg-gradient-to-b from-blue-200/40 via-slate-200/30 to-transparent blur-sm" />
                
                <div className="space-y-6">
                  {/* Main description */}
                  <EditableText
                    textarea
                    as="p"
                    className="font-sans text-lg sm:text-xl text-slate-700 leading-relaxed"
                    initialValue={item.description}
                    onSave={(v) => onSave(i, "description", v)}
                  />
                  
                  {/* Key achievements section */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="p-4 bg-gradient-to-br from-blue-50 to-blue-25 rounded-lg border border-blue-200/50 shadow-sm"
                    >
                      <Award className="h-5 w-5 text-blue-600 mb-2" />
                      <h4 className="font-semibold text-sm mb-1 text-slate-800">Key Achievement</h4>
                      <p className="text-xs text-slate-600">Led successful product launch</p>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="p-4 bg-gradient-to-br from-green-50 to-green-25 rounded-lg border border-green-200/50 shadow-sm"
                    >
                      <Users className="h-5 w-5 text-green-600 mb-2" />
                      <h4 className="font-semibold text-sm mb-1 text-slate-800">Team Impact</h4>
                      <p className="text-xs text-slate-600">Managed cross-functional team</p>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="p-4 bg-gradient-to-br from-purple-50 to-purple-25 rounded-lg border border-purple-200/50 shadow-sm"
                    >
                      <Target className="h-5 w-5 text-purple-600 mb-2" />
                      <h4 className="font-semibold text-sm mb-1 text-slate-800">Business Impact</h4>
                      <p className="text-xs text-slate-600">Increased revenue by 40%</p>
                    </motion.div>
                  </div>
                  
                  {/* Skills used */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-wrap gap-2 pt-4 border-t border-slate-200/60"
                  >
                    <span className="text-xs font-medium text-slate-700 mr-2">Technologies:</span>
                    {(item.technologies || []).map((tech, idx) => (
                      <span
                        key={idx}
                        className="group/tech relative px-2 py-1 text-xs bg-black/10 text-black font-medium rounded-md border border-black/20"
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
