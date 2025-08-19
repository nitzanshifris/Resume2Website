"use client"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { EditableText } from "@/components/ui/editable-text"
import type { ExperienceItem } from "@/lib/data"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Briefcase, 
  Calendar, 
  TrendingUp, 
  Award, 
  Users, 
  Target, 
  Plus, 
  X, 
  Palette,
  Building2,
  Code,
  Settings,
  Lightbulb,
  Rocket,
  Star,
  Heart,
  GraduationCap,
  Camera,
  Coffee,
  Globe,
  Mail,
  Phone,
  Sparkles
} from "lucide-react"
import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { renderIcon } from "@/lib/icon-utils"
import { IconWithZoom } from "@/components/ui/icon-with-zoom"

const IconSelector = dynamic(() => import("@/components/ui/icon-selector").then(mod => mod.IconSelector), {
  ssr: false,
  loading: () => <Briefcase className="h-6 w-6" />
})
import { useEditMode } from "@/contexts/edit-mode-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DraggableList } from "@/components/draggable-list"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface AccordionLayoutProps {
  items: ExperienceItem[]
  onSave: (index: number, field: keyof ExperienceItem, value: string | string[]) => void
  onReorder?: (newItems: ExperienceItem[]) => void
  showIconEditor?: boolean
}

export function AccordionLayout({ items, onSave, onReorder, showIconEditor = true }: AccordionLayoutProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [openItem, setOpenItem] = useState<string | undefined>()
  const [newTechnology, setNewTechnology] = useState<{ [key: number]: string }>({})
  
  // Helper function to get all achievements from all cards
  const getAllAchievements = (items: ExperienceItem[]) => {
    return items.reduce((allAchievements, item) => {
      return allAchievements.concat(item.achievements || [])
    }, [] as any[])
  }
  
  const [techTheme, setTechTheme] = useState<{ [key: number]: 'theme-aware' | 'colorful' | 'high-contrast' }>({})
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

  const renderAccordionItem = (item: ExperienceItem, i: number) => (
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
              relative border-2 rounded-2xl overflow-hidden transition-all duration-200 ease-out
              ${openItem === `item-${i}` 
                ? 'border-accent bg-transparent shadow-2xl shadow-slate-900/15 scale-[1.01] backdrop-blur-md' 
                : 'border-accent hover:border-accent hover:shadow-xl hover:shadow-slate-900/8 bg-transparent backdrop-blur-sm hover:backdrop-blur-md'
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
                    {isEditMode && showIconEditor ? (
                      <div className={`relative p-3 rounded-2xl transition-all duration-200 ease-out ${
                        isCurrentRole(item.endDate) 
                          ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25 ring-4 ring-blue-200/50' 
                          : 'bg-gradient-to-br from-slate-100 to-slate-200/80 shadow-sm'
                      }`}>
                        <IconSelector
                          currentIcon={item.icon}
                          onIconSelect={(newIcon) => {
                            onSave(i, "icon" as keyof ExperienceItem, newIcon as string)
                          }}
                          className={`${
                            isCurrentRole(item.endDate) ? 'text-white' : 'text-muted-foreground'
                          }`}
                        />
                      </div>
                    ) : (
                      <IconWithZoom
                        icon={item.icon}
                        onIconUpdate={(newIcon) => {
                          onSave(i, "icon" as keyof ExperienceItem, newIcon as string)
                        }}
                        isCurrentRole={isCurrentRole(item.endDate)}
                      />
                    )}
                    
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
                    </motion.div>
                    
                    {/* Live indicator */}
                    {isCurrentRole(item.endDate) && (
                      <div className="absolute -top-2 -right-2">
                        <div className="relative">
                          <div className="h-4 w-4 bg-green-500 rounded-full animate-pulse" />
                          <div className="absolute inset-0 h-4 w-4 bg-green-400 rounded-full animate-ping" />
                        </div>
                      </div>
                    )}
                  <div className="flex-1">
                    <div className="flex items-start gap-3 flex-wrap mb-4">
                      <div className="flex-1">
                        <EditableText
                          as="h3"
                          className="font-serif text-3xl sm:text-5xl font-black text-foreground group-hover:text-blue-600 transition-all duration-300 leading-tight mb-2"
                          initialValue={item.title}
                          onSave={(v) => onSave(i, "title", v)}
                        />
                        <EditableText
                          as="p"
                          className="font-sans text-base sm:text-lg font-medium text-muted-foreground uppercase tracking-wider"
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
                        <span className="text-xs text-muted-foreground font-medium">Duration:</span>
                        <span className="text-sm font-semibold text-foreground bg-muted px-3 py-1 rounded-full border border-border">
                          {calculateDuration(item.startDate, item.endDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4 opacity-60" />
                  <EditableText
                    as="p"
                    className="font-sans text-base sm:text-lg text-foreground font-medium"
                    initialValue={`${item.startDate} - ${item.endDate}`}
                    onSave={(v) => {
                      const [start = "", end = ""] = v.split(" - ")
                      onSave(i, "startDate", start.trim())
                      onSave(i, "endDate", end.trim())
                    }}
                  />
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
                    className="font-sans text-lg sm:text-xl text-foreground leading-relaxed list-none"
                    initialValue={item.description}
                    onSave={(v) => onSave(i, "description", v)}
                  />
                  
                  {/* Enhanced technologies section - only show if has technologies or in edit mode */}
                  {((item.technologies || []).length > 0 || isEditMode) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="mt-6"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <h6 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <div className="w-6 h-0.5 bg-gradient-to-r from-slate-400 to-slate-600"></div>
                        Technologies & Tools
                      </h6>
                      <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent"></div>
                    </div>
                    <div className="p-4">
                      <div className="flex flex-wrap gap-3">
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
                          const currentTheme = techTheme[i] || 'colorful'
                          
                          // Get styling based on selected theme
                          const getThemeStyles = () => {
                            switch (currentTheme) {
                              case 'theme-aware':
                                // Use the website's current theme accent color for all technologies
                                return 'bg-accent text-accent-foreground border-accent/70 hover:bg-accent/90 shadow-lg shadow-accent/25'
                                
                              case 'high-contrast':
                                return 'bg-black text-white border-gray-800 hover:bg-gray-900 dark:bg-white dark:text-black dark:border-gray-300 dark:hover:bg-gray-100'
                                
                              case 'colorful':
                              default:
                                const appleGradients = [
                                  'bg-gradient-to-br from-blue-500/60 to-cyan-400/60 text-white border-blue-300/60 hover:from-blue-600/70 hover:to-cyan-500/70',
                                  'bg-gradient-to-br from-purple-500/60 to-pink-400/60 text-white border-purple-300/60 hover:from-purple-600/70 hover:to-pink-500/70',
                                  'bg-gradient-to-br from-green-500/60 to-emerald-400/60 text-white border-green-300/60 hover:from-green-600/70 hover:to-emerald-500/70',
                                  'bg-gradient-to-br from-orange-500/60 to-red-400/60 text-white border-orange-300/60 hover:from-orange-600/70 hover:to-red-500/70',
                                  'bg-gradient-to-br from-indigo-500/60 to-blue-400/60 text-white border-indigo-300/60 hover:from-indigo-600/70 hover:to-blue-500/70',
                                  'bg-gradient-to-br from-pink-500/60 to-rose-400/60 text-white border-pink-300/60 hover:from-pink-600/70 hover:to-rose-500/70',
                                  'bg-gradient-to-br from-teal-500/60 to-green-400/60 text-white border-teal-300/60 hover:from-teal-600/70 hover:to-green-500/70',
                                  'bg-gradient-to-br from-violet-500/60 to-purple-400/60 text-white border-violet-300/60 hover:from-violet-600/70 hover:to-purple-500/70'
                                ]
                                return appleGradients[idx % appleGradients.length]
                            }
                          }
                          
                          const themeStyle = getThemeStyles()
                          
                          const getDotStyle = () => {
                            if (currentTheme === 'high-contrast') {
                              return 'bg-white dark:bg-black opacity-80'
                            } else if (currentTheme === 'theme-aware') {
                              return 'bg-accent-foreground/90 shadow-sm'
                            } else {
                              return 'bg-white/80 shadow-sm'
                            }
                          }
                          
                          return (
                            <motion.span
                              key={idx}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.15, ease: "easeOut" }}
                              className={`group/tech relative inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-150 ease-out hover:shadow-lg hover:scale-105 backdrop-blur-sm ${themeStyle}`}
                            >
                              <div className={`w-1.5 h-1.5 rounded-full ${getDotStyle()}`}></div>
                              {tech}
                              {isEditMode && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="absolute inset-0 w-full h-full p-0 opacity-0 group-hover/tech:opacity-100 transition-opacity bg-red-500/90 hover:bg-red-600/90 text-white rounded-full flex items-center justify-center"
                                  onClick={() => {
                                    const newTechs = [...(item.technologies || [])]
                                    newTechs.splice(idx, 1)
                                    onSave(i, "technologies", newTechs)
                                  }}
                                >
                                  <X className="h-3 w-3" />
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
                              placeholder="Add"
                              value={newTechnology[i] || ''}
                              onChange={(e) => setNewTechnology({ ...newTechnology, [i]: e.target.value })}
                              className="h-8 w-32 text-xs bg-white border-slate-300 rounded-full px-3"
                              onKeyDown={(e) => {
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
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  size="sm"
                                  className="h-8 w-8 p-0 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-sm"
                                >
                                  <Palette className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setTechTheme({ ...techTheme, [i]: 'theme-aware' })}>
                                  Theme-aware
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTechTheme({ ...techTheme, [i]: 'colorful' })}>
                                  Colorful
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTechTheme({ ...techTheme, [i]: 'high-contrast' })}>
                                  Black&White
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </AccordionContent>
        </AccordionItem>
        </motion.div>
  )

  return (
    <div className="relative">
      <Accordion 
        type="single" 
        collapsible 
        className="w-full max-w-4xl mx-auto space-y-6"
        value={openItem}
        onValueChange={setOpenItem}
      >
        {onReorder && isEditMode ? (
          <DraggableList
            items={items}
            onReorder={onReorder}
            renderItem={renderAccordionItem}
            keyExtractor={(item, index) => `experience-${index}`}
            className="w-full"
          />
        ) : (
          items.map((item, i) => renderAccordionItem(item, i))
        )}
      </Accordion>
    </div>
  )
}