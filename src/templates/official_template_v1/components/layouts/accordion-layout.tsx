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
import { getFieldColorClass, inferFieldType, type ThemeVariant } from "@/lib/universal-field-colors"

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
  onSave: (index: number, field: keyof ExperienceItem, value: any) => void
  onReorder?: (newItems: ExperienceItem[]) => void
  showIconEditor?: boolean
}

export function AccordionLayout({ items, onSave, onReorder, showIconEditor = true }: AccordionLayoutProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [openItem, setOpenItem] = useState<string | undefined>()
  
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
                ? 'border-accent bg-transparent shadow-2xl shadow-slate-900/15 backdrop-blur-md' 
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
            
            <AccordionTrigger className="text-left hover:no-underline py-8 group cursor-pointer px-6 relative z-10 [&[data-state=open]>div>div:last-child>svg]:rotate-180 [&>div>div:last-child>svg]:h-8 [&>div>div:last-child>svg]:w-8 [&>div>div:last-child>svg]:transition-all [&>div>div:last-child>svg]:duration-300 [&>div>div:last-child>svg]:text-accent [&>div>div:last-child>svg]:hover:text-accent [&>div>div:last-child>svg]:drop-shadow-lg">
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
                          className="font-serif text-3xl sm:text-5xl font-black text-foreground group-hover:!text-accent transition-all duration-300 leading-tight mb-2"
                          initialValue={item.title}
                          onSave={(v) => onSave(i, "title", v)}
                        />
                        {(item.company || isEditMode) && (
                          <EditableText
                            as="p"
                            className="font-sans text-base sm:text-lg font-medium text-muted-foreground uppercase tracking-wider"
                            initialValue={item.company}
                            onSave={(v) => onSave(i, "company", v)}
                          />
                        )}
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
                      <motion.span
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="group/duration relative inline-flex items-center gap-1.5 px-3 py-1.5 pr-8 text-xs font-medium rounded-full backdrop-blur-md bg-gradient-to-r from-accent/10 via-accent/30 to-accent/10 border border-accent/40 text-foreground shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200"
                      >
                        <span className="text-accent font-semibold">Duration:</span>
                        {isEditMode ? (
                          <EditableText
                            as="span"
                            className="text-xs font-medium"
                            initialValue={item.customDuration || calculateDuration(item.startDate, item.endDate)}
                            onSave={(value) => onSave(i, "customDuration", value)}
                            placeholder="Enter duration..."
                          />
                        ) : (
                          <span>{item.customDuration || calculateDuration(item.startDate, item.endDate)}</span>
                        )}
                        {isEditMode && item.customDuration && (
                          <button
                            className="absolute -right-1 -top-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors shadow-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSave(i, "customDuration", null);
                            }}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </motion.span>
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
                  
                  {/* Additional Information section - only show if has any additional fields or in edit mode */}
                  {((item.additionalInfo || []).length > 0 || item.remoteWork || item.employmentType || isEditMode) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="mt-6"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <h6 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <div className="w-6 h-0.5 bg-gradient-to-r from-slate-400 to-slate-600"></div>
                        Additional Information
                      </h6>
                      <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent"></div>
                      {isEditMode && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline" className="h-6 px-2 text-xs bg-background/80 backdrop-blur-sm border-foreground/20 hover:bg-foreground/10">
                              <Palette className="h-3 w-3 mr-1" />
                              {techTheme[i] === 'colorful' ? 'Colorful' : techTheme[i] === 'high-contrast' ? 'B&W' : 'Theme'}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setTechTheme({...techTheme, [i]: 'theme-aware'})}>
                              Theme-aware
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTechTheme({...techTheme, [i]: 'colorful'})}>
                              Colorful
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTechTheme({...techTheme, [i]: 'high-contrast'})}>
                              Black & White
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex flex-wrap gap-3">
                        {/* Display remoteWork */}
                        {item.remoteWork && (
                          <motion.span
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            className={`group/tech relative inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 ${
                              getFieldColorClass('remote', techTheme[i] as ThemeVariant || 'colorful', isEditMode ? 'edit' : 'preview')
                            }`}
                          >
                            <span className="font-medium">{item.remoteWork}</span>
                            {isEditMode && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="absolute inset-0 w-full h-full p-0 opacity-0 group-hover/tech:opacity-100 transition-opacity bg-red-500/90 hover:bg-red-600/90 text-white rounded-full flex items-center justify-center"
                                onClick={() => onSave(i, "remoteWork", null)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            )}
                          </motion.span>
                        )}
                        
                        {/* Display employmentType */}
                        {item.employmentType && (
                          <motion.span
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            className={`group/tech relative inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 ${
                              getFieldColorClass('fullTime', techTheme[i] as ThemeVariant || 'colorful', isEditMode ? 'edit' : 'preview')
                            }`}
                          >
                            <span className="font-medium">{item.employmentType}</span>
                            {isEditMode && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="absolute inset-0 w-full h-full p-0 opacity-0 group-hover/tech:opacity-100 transition-opacity bg-red-500/90 hover:bg-red-600/90 text-white rounded-full flex items-center justify-center"
                                onClick={() => onSave(i, "employmentType", null)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            )}
                          </motion.span>
                        )}
                        
                        {/* Display existing additional info - grouped by label */}
                        {(() => {
                          // Group additionalInfo by label
                          const groupedInfo = (item.additionalInfo || []).reduce((acc, info) => {
                            if (!acc[info.label]) {
                              acc[info.label] = []
                            }
                            acc[info.label].push(info.value)
                            return acc
                          }, {} as Record<string, string[]>)
                          
                          return Object.entries(groupedInfo).flatMap(([label, values], idx) => {
                            // Display each value as a separate tag for Tools, but combine for other labels
                            if (label === "Tools") {
                              // Each tool gets its own tag
                              return values.map((value, valueIdx) => {
                                const fieldType = inferFieldType(label)
                                const colorScheme = getFieldColorClass(fieldType, techTheme[i] as ThemeVariant || 'colorful', isEditMode ? 'edit' : 'preview')
                                
                                return (
                                  <motion.span
                                    key={`${label}-${valueIdx}`}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.15, ease: "easeOut" }}
                                    className={`group/tech relative inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 ${colorScheme}`}
                                  >
                                    <span className="font-medium">{value}</span>
                                    {isEditMode && (
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="absolute inset-0 w-full h-full p-0 opacity-0 group-hover/tech:opacity-100 transition-opacity bg-red-500/90 hover:bg-red-600/90 text-white rounded-full flex items-center justify-center"
                                        onClick={() => {
                                          // Remove this specific tool
                                          const newInfo = (item.additionalInfo || []).filter(info => !(info.label === label && info.value === value))
                                          onSave(i, "additionalInfo", newInfo)
                                        }}
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                    )}
                                  </motion.span>
                                )
                              })
                            } else {
                              // Other labels (Type, Mode, etc.) display combined
                              const combinedValues = values.join(', ')
                              const fieldType = inferFieldType(label)
                              const colorScheme = getFieldColorClass(fieldType, techTheme[i] as ThemeVariant || 'colorful', isEditMode ? 'edit' : 'preview')
                              
                              return (
                                <motion.span
                                  key={label}
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ duration: 0.15, ease: "easeOut" }}
                                  className={`group/tech relative inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 ${colorScheme}`}
                                >
                                  {label === "Custom" ? (
                                    <span className="font-medium">{combinedValues}</span>
                                  ) : (
                                    <>
                                      <span className="font-semibold">{label}:</span>
                                      <span>{combinedValues}</span>
                                    </>
                                  )}
                                  {isEditMode && (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="absolute inset-0 w-full h-full p-0 opacity-0 group-hover/tech:opacity-100 transition-opacity bg-red-500/90 hover:bg-red-600/90 text-white rounded-full flex items-center justify-center"
                                      onClick={() => {
                                        // Remove all items with this label
                                        const newInfo = (item.additionalInfo || []).filter(info => info.label !== label)
                                        onSave(i, "additionalInfo", newInfo)
                                      }}
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  )}
                              </motion.span>
                            )
                          }
                        })
                      })()}
                        {/* Edit mode input fields - Clickable buttons first, then textbox inputs */}
                        {isEditMode && (
                          <>
                            {/* Clickable-text-ready buttons first */}
                            {item.remoteWork !== "Remote" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className={`h-7 text-xs rounded-full px-3 font-medium transition-all ${
                                  getFieldColorClass('remote', techTheme[i] as ThemeVariant || 'colorful', 'edit')
                                }`}
                                onClick={() => onSave(i, "remoteWork", "Remote")}
                              >
                                Remote
                              </Button>
                            )}
                            {item.remoteWork !== "Hybrid" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className={`h-7 text-xs rounded-full px-3 font-medium transition-all ${
                                  getFieldColorClass('hybrid', techTheme[i] as ThemeVariant || 'colorful', 'edit')
                                }`}
                                onClick={() => onSave(i, "remoteWork", "Hybrid")}
                              >
                                Hybrid
                              </Button>
                            )}
                            {item.employmentType !== "Full-time" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className={`h-7 text-xs rounded-full px-3 font-medium transition-all ${
                                  getFieldColorClass('fullTime', techTheme[i] as ThemeVariant || 'colorful', 'edit')
                                }`}
                                onClick={() => onSave(i, "employmentType", "Full-time")}
                              >
                                Full-time
                              </Button>
                            )}
                            {item.employmentType !== "Part-time" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className={`h-7 text-xs rounded-full px-3 font-medium transition-all ${
                                  getFieldColorClass('partTime', techTheme[i] as ThemeVariant || 'colorful', 'edit')
                                }`}
                                onClick={() => onSave(i, "employmentType", "Part-time")}
                              >
                                Part-time
                              </Button>
                            )}
                            
                            {/* Textbox inputs second */}
                            <Input
                              type="text"
                              placeholder="Custom"
                              className="h-7 w-20 text-xs bg-white border-purple-300 rounded-full px-3"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && e.currentTarget.value) {
                                  const newInfo = [...(item.additionalInfo || []), {
                                    label: "Custom",
                                    value: e.currentTarget.value
                                  }]
                                  onSave(i, "additionalInfo", newInfo)
                                  e.currentTarget.value = ''
                                }
                              }}
                            />
                            <Input
                              type="text"
                              placeholder="Location"
                              className="h-7 w-24 text-xs bg-white border-blue-300 rounded-full px-3"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && e.currentTarget.value) {
                                  onSave(i, "remoteWork", e.currentTarget.value)
                                  e.currentTarget.value = ''
                                }
                              }}
                            />
                            <Input
                              type="text"
                              placeholder="Add skills"
                              className="h-7 w-28 text-xs bg-white border-slate-300 rounded-full px-3"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && e.currentTarget.value) {
                                  const newInfo = [...(item.additionalInfo || []), {
                                    label: "Skills",
                                    value: e.currentTarget.value
                                  }]
                                  onSave(i, "additionalInfo", newInfo)
                                  e.currentTarget.value = ''
                                }
                              }}
                            />
                            <Input
                              type="text"
                              placeholder="Add tools"
                              className="h-7 w-28 text-xs bg-white border-amber-300 rounded-full px-3"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && e.currentTarget.value) {
                                  const newInfo = [...(item.additionalInfo || []), {
                                    label: "Tools",
                                    value: e.currentTarget.value
                                  }]
                                  onSave(i, "additionalInfo", newInfo)
                                  e.currentTarget.value = ''
                                }
                              }}
                            />
                          </>
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