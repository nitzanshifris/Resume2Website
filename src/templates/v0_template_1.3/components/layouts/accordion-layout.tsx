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
    // Enhanced duration calculation with clearer formatting
    const start = new Date(startDate)
    const end = isCurrentRole(endDate) ? new Date() : new Date(endDate)
    const months = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30))
    const years = Math.floor(months / 12)
    const remainingMonths = months % 12
    
    if (years > 0 && remainingMonths > 0) {
      return `${years} ${years === 1 ? 'year' : 'years'}, ${remainingMonths} ${remainingMonths === 1 ? 'month' : 'months'}`
    } else if (years > 0) {
      return `${years} ${years === 1 ? 'year' : 'years'}`
    } else {
      return `${months} ${months === 1 ? 'month' : 'months'}`
    }
  }

  return (
    <div className="relative">
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
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: i * 0.03, ease: "easeOut" }}
          onHoverStart={() => setHoveredIndex(i)}
          onHoverEnd={() => setHoveredIndex(null)}
        >
          <AccordionItem 
            value={`item-${i}`} 
            className={`
              relative border rounded-2xl overflow-hidden transition-all duration-200 ease-out
              ${openItem === `item-${i}` 
                ? 'border-slate-300/80 bg-gradient-to-br from-white/90 to-slate-50/70 shadow-2xl shadow-slate-900/15 scale-[1.01] backdrop-blur-md ring-1 ring-slate-200/50' 
                : 'border-slate-200/70 hover:border-slate-300/80 hover:shadow-xl hover:shadow-slate-900/8 bg-white/60 backdrop-blur-sm hover:backdrop-blur-md'
              }
              ${hoveredIndex === i ? 'z-10 shadow-lg shadow-slate-900/10' : 'z-0'}
            `}
          >
            {/* Enhanced background pattern with depth */}
            <div className="absolute inset-0 opacity-40">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-100/60 via-white/20 to-blue-50/40" />
              {openItem === `item-${i}` && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-slate-50/10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              )}
              {hoveredIndex === i && (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/10 via-transparent to-slate-50/5 transition-opacity duration-200 ease-out"></div>
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
                    <div className={`relative p-3 rounded-2xl transition-all duration-200 ease-out ${
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
                    <div className="flex items-start gap-3 flex-wrap mb-4">
                      <div className="flex-1">
                        <EditableText
                          as="h3"
                          className="font-serif text-3xl sm:text-5xl font-black text-slate-900 group-hover:text-blue-600 transition-all duration-300 leading-tight mb-2"
                          initialValue={item.title}
                          onSave={(v) => onSave(i, "title", v)}
                        />
                        <EditableText
                          as="p"
                          className="font-sans text-base sm:text-lg font-medium text-slate-500 uppercase tracking-wider"
                          initialValue={item.company}
                          onSave={(v) => onSave(i, "company", v)}
                        />
                      </div>
                      {isCurrentRole(item.endDate) && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex-shrink-0 inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200"
                        >
                          <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
                          Active
                        </motion.span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-slate-500 font-medium">Duration:</span>
                        <span className="text-sm font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                          {calculateDuration(item.startDate, item.endDate)}
                        </span>
                      </div>
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="pl-16"
            >
              {/* Enhanced content with gradient border */}
              <div className="relative">
                <div className="space-y-6">
                  {/* Main description */}
                  <EditableText
                    textarea
                    as="p"
                    className="font-sans text-lg sm:text-xl text-slate-700 leading-relaxed list-none"
                    initialValue={item.description}
                    onSave={(v) => onSave(i, "description", v)}
                  />
                  
                  {/* Connected achievements section */}
                  <div className="mt-8 mb-4">
                    <h5 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <div className="w-8 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400"></div>
                      Key Achievements & Impact
                      <div className="flex-1 h-0.5 bg-gradient-to-r from-purple-400 to-green-400"></div>
                    </h5>
                    <div className="bg-gradient-to-br from-slate-50/80 to-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 shadow-sm">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="relative group"
                        >
                          <div className="h-full bg-white rounded-xl border border-blue-200/60 shadow-sm hover:shadow-md transition-all duration-200 ease-out hover:-translate-y-1 p-5">
                            <div className="flex items-start justify-between mb-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                                <Award className="h-5 w-5 text-white" />
                              </div>
                              <div className="text-right">
                                <div className="text-xs text-slate-500 font-medium">Success Rate</div>
                                <div className="text-lg font-bold text-blue-600">98%</div>
                              </div>
                            </div>
                            <h4 className="font-bold text-base mb-2 text-slate-900">Key Achievement</h4>
                            <p className="text-sm text-slate-600 leading-relaxed mb-3">Led successful product launch</p>
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs text-slate-500">
                                <span>Impact</span>
                                <span>98%</span>
                              </div>
                              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                                <motion.div 
                                  className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: "98%" }}
                                  transition={{ duration: 0.4, ease: "easeOut" }}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-blue-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out -z-10"></div>
                        </motion.div>
                    
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="relative group"
                        >
                          <div className="h-full bg-white rounded-xl border border-green-200/60 shadow-sm hover:shadow-md transition-all duration-200 ease-out hover:-translate-y-1 p-5">
                            <div className="flex items-start justify-between mb-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                                <Users className="h-5 w-5 text-white" />
                              </div>
                              <div className="text-right">
                                <div className="text-xs text-slate-500 font-medium">Team Size</div>
                                <div className="text-lg font-bold text-green-600">12</div>
                              </div>
                            </div>
                            <h4 className="font-bold text-base mb-2 text-slate-900">Team Impact</h4>
                            <p className="text-sm text-slate-600 leading-relaxed mb-3">Managed cross-functional team</p>
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs text-slate-500">
                                <span>Leadership Score</span>
                                <span>95%</span>
                              </div>
                              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                                <motion.div 
                                  className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: "95%" }}
                                  transition={{ duration: 0.4, ease: "easeOut" }}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-green-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out -z-10"></div>
                        </motion.div>
                    
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="relative group"
                        >
                          <div className="h-full bg-white rounded-xl border border-purple-200/60 shadow-sm hover:shadow-md transition-all duration-200 ease-out hover:-translate-y-1 p-5">
                            <div className="flex items-start justify-between mb-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                                <Target className="h-5 w-5 text-white" />
                              </div>
                              <div className="text-right">
                                <div className="text-xs text-slate-500 font-medium">Growth</div>
                                <div className="text-lg font-bold text-purple-600">+40%</div>
                              </div>
                            </div>
                            <h4 className="font-bold text-base mb-2 text-slate-900">Business Impact</h4>
                            <p className="text-sm text-slate-600 leading-relaxed mb-3">Increased revenue by 40%</p>
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs text-slate-500">
                                <span>Revenue Growth</span>
                                <span>40%</span>
                              </div>
                              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                                <motion.div 
                                  className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: "40%" }}
                                  transition={{ duration: 0.4, ease: "easeOut" }}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-purple-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out -z-10"></div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced technologies section */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="mt-6"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <h6 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <div className="w-6 h-0.5 bg-gradient-to-r from-slate-400 to-slate-600"></div>
                        Technologies & Tools
                      </h6>
                      <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent"></div>
                    </div>
                    <div className="bg-gradient-to-br from-slate-50/60 to-white/40 backdrop-blur-sm rounded-xl p-4 border border-slate-200/40">
                      <div className="flex flex-wrap gap-2">
                        {(item.technologies || []).map((tech, idx) => {
                          // Determine tech category and proficiency for visual hierarchy
                          const getTeachCategory = (techName: string) => {
                            const frameworks = ['React', 'Next.js', 'Vue', 'Angular', 'Svelte']
                            const languages = ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Go']
                            const tools = ['Docker', 'AWS', 'Git', 'Figma', 'Photoshop']
                            
                            if (frameworks.some(f => techName.toLowerCase().includes(f.toLowerCase()))) return 'framework'
                            if (languages.some(l => techName.toLowerCase().includes(l.toLowerCase()))) return 'language'
                            if (tools.some(t => techName.toLowerCase().includes(t.toLowerCase()))) return 'tool'
                            return 'other'
                          }
                          
                          const category = getTeachCategory(tech)
                          const categoryStyles = {
                            framework: 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border-blue-200/60 hover:from-blue-100 hover:to-blue-200',
                            language: 'bg-gradient-to-r from-green-50 to-green-100 text-green-800 border-green-200/60 hover:from-green-100 hover:to-green-200',
                            tool: 'bg-gradient-to-r from-purple-50 to-purple-100 text-purple-800 border-purple-200/60 hover:from-purple-100 hover:to-purple-200',
                            other: 'bg-gradient-to-r from-slate-50 to-slate-100 text-slate-800 border-slate-200/60 hover:from-slate-100 hover:to-slate-200'
                          }
                          
                          return (
                            <motion.span
                              key={idx}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.15, ease: "easeOut" }}
                              className={`group/tech relative inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-150 ease-out hover:shadow-sm hover:scale-105 ${categoryStyles[category]}`}
                            >
                              <div className={`w-1.5 h-1.5 rounded-full ${
                                category === 'framework' ? 'bg-blue-400' :
                                category === 'language' ? 'bg-green-400' :
                                category === 'tool' ? 'bg-purple-400' : 'bg-slate-400'
                              }`}></div>
                              {tech}
                              {isEditMode && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="ml-1 h-4 w-4 p-0 opacity-0 group-hover/tech:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white rounded-full flex-shrink-0"
                                  onClick={() => {
                                    const newTechs = [...(item.technologies || [])]
                                    newTechs.splice(idx, 1)
                                    onSave(i, "technologies", newTechs)
                                  }}
                                >
                                  <X className="h-2 w-2" />
                                </Button>
                              )}
                            </motion.span>
                          )
                        })}
                        {isEditMode && (
                          <motion.div 
                            className="flex items-center gap-2 mt-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                          >
                            <Input
                              type="text"
                              placeholder="Add technology..."
                              value={newTechnology[i] || ''}
                              onChange={(e) => setNewTechnology({ ...newTechnology, [i]: e.target.value })}
                              className="h-8 w-32 text-xs bg-white border-slate-300 rounded-full px-3"
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
                              className="h-8 w-8 p-0 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-sm"
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
                          </motion.div>
                        )}
                      </div>
                    </div>
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
