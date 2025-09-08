"use client"
import { motion } from "framer-motion"
import { AnimatedSection, itemVariants } from "@/components/ui/animated-section"
import { useFontSize } from "@/contexts/font-size-context"
import { cn } from "@/lib/utils"
import { BadgeCheck, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EditableText } from "@/components/ui/editable-text"
import { EditableSection } from "@/components/editable-section"
import { useEditMode } from "@/contexts/edit-mode-context"
import { useState } from "react"

interface Membership {
  organization: string
  role: string
  period: string
}

interface MembershipsSectionProps {
  title: string
  items: Membership[]
}

export const MembershipsSection = ({ title, items }: MembershipsSectionProps) => {
  const { getSizeClasses } = useFontSize()
  const { isEditMode } = useEditMode()
  const [sectionTitle, setSectionTitle] = useState(title)
  const [memberships, setMemberships] = useState(items)

  const updateMembership = (index: number, field: keyof Membership, value: string) => {
    const updated = [...memberships]
    updated[index] = { ...updated[index], [field]: value }
    setMemberships(updated)
  }

  const deleteMembership = (index: number) => {
    const updated = memberships.filter((_, i) => i !== index)
    setMemberships(updated)
  }

  return (
    <EditableSection
      sectionTitle="Memberships"
      showAddButton={isEditMode}
      showMoveButtons={false}
      onAddItem={() => {
        const newMembership: Membership = {
          organization: "New Organization",
          role: "Member",
          period: "2024 - Present"
        }
        setMemberships([...memberships, newMembership])
      }}
    >
      <AnimatedSection id="memberships">
        <EditableText
          as="h2"
          initialValue={sectionTitle}
          onSave={setSectionTitle}
          className={cn(
            "font-bold mb-12 text-center text-foreground",
            getSizeClasses("sectionTitle"),
          )}
        />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {memberships.map((item, i) => (
          <motion.div
            variants={itemVariants}
            key={i}
            className="relative group overflow-hidden bg-background/50 dark:bg-background/50 light:bg-gray-100 border border-neutral-800 dark:border-neutral-800 light:border-gray-300 p-6 rounded-lg flex items-center gap-6 hover:border-accent/50 transition-colors shadow-[0px_0px_8px_0px_rgba(192,132,252,0.08)] dark:shadow-[0px_0px_8px_0px_rgba(192,132,252,0.08)] light:shadow-none"
          >
            <div className="absolute inset-0 bg-accent opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur-2xl"></div>
            
            {/* Delete Button */}
            {isEditMode && (
              <Button 
                size="icon" 
                variant="destructive" 
                className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 w-8 shadow-md"
                onClick={() => deleteMembership(i)}
                title="Delete membership"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            
            <div className="relative flex items-start gap-4 w-full">
              <BadgeCheck className="h-8 w-8 text-accent flex-shrink-0 mt-1" />
              <div className="flex-1">
                <EditableText
                  as="h3"
                  initialValue={item.organization}
                  onSave={(value) => updateMembership(i, 'organization', value)}
                  className={cn("text-foreground font-bold", getSizeClasses("timelineTitle"))}
                />
                {(item.role || isEditMode) && (
                  <EditableText
                    as="p"
                    initialValue={item.role || ""}
                    onSave={(value) => updateMembership(i, 'role', value)}
                    className={cn("text-accent", getSizeClasses("timelineSubtitle"))}
                    placeholder="Role"
                  />
                )}
                {(item.period || isEditMode) && (
                  <EditableText
                    as="p"
                    initialValue={item.period || ""}
                    onSave={(value) => updateMembership(i, 'period', value)}
                    className={cn("text-neutral-400 dark:text-neutral-400 light:text-gray-600 mt-1", getSizeClasses("timelinePeriod"))}
                    placeholder="Period"
                  />
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      </AnimatedSection>
    </EditableSection>
  )
}
