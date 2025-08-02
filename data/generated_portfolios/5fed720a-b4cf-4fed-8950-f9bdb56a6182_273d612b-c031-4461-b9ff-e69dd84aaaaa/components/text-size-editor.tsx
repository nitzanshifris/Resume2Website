"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { RotateCcw, Type, Palette } from 'lucide-react'
import { useTextSize, type TextSizeSettings, type TextSizeOption } from '@/contexts/text-size-context'
import { toast } from 'sonner'

const textSizeOptions: { value: TextSizeOption; label: string; description: string }[] = [
  { value: 'xs', label: 'Extra Small', description: '12px - Very small text' },
  { value: 'sm', label: 'Small', description: '14px - Small text' },
  { value: 'base', label: 'Base', description: '16px - Normal text' },
  { value: 'lg', label: 'Large', description: '18px - Large text' },
  { value: 'xl', label: 'Extra Large', description: '20px - Extra large text' },
  { value: '2xl', label: '2X Large', description: '24px - Very large text' },
  { value: '3xl', label: '3X Large', description: '30px - Huge text' },
  { value: '4xl', label: '4X Large', description: '36px - Very huge text' },
  { value: '5xl', label: '5X Large', description: '48px - Enormous text' },
  { value: '6xl', label: '6X Large', description: '60px - Massive text' },
]

interface TextSizeControlProps {
  label: string
  description: string
  sizeKey: keyof TextSizeSettings
  currentSize: TextSizeOption
  onSizeChange: (size: TextSizeOption) => void
}

function TextSizeControl({ label, description, sizeKey, currentSize, onSizeChange }: TextSizeControlProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm font-medium">{label}</Label>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <Select value={currentSize} onValueChange={onSizeChange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {textSizeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex flex-col">
                  <span className="font-medium">{option.label}</span>
                  <span className="text-xs text-muted-foreground">{option.description}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Separator className="my-2" />
    </div>
  )
}

export function TextSizeEditor() {
  const { textSizes, updateTextSize, resetToDefaults } = useTextSize()
  const [isOpen, setIsOpen] = useState(false)

  const handleReset = () => {
    resetToDefaults()
    toast.success('Text sizes reset to defaults')
  }

  const cardSections = [
    {
      title: '🏆 Achievement Cards',
      controls: [
        { key: 'achievementTitle' as const, label: 'Title', description: 'Achievement title text' },
        { key: 'achievementDescription' as const, label: 'Description', description: 'Achievement description text' },
      ]
    },
    {
      title: '💼 Project Cards', 
      controls: [
        { key: 'projectTitle' as const, label: 'Title', description: 'Project title text' },
        { key: 'projectDescription' as const, label: 'Description', description: 'Project description text' },
      ]
    },
    {
      title: '💼 Experience Cards',
      controls: [
        { key: 'experienceTitle' as const, label: 'Title', description: 'Job title text' },
        { key: 'experienceDescription' as const, label: 'Description', description: 'Job description text' },
      ]
    },
    {
      title: '🎓 Education Cards',
      controls: [
        { key: 'educationTitle' as const, label: 'Title', description: 'Degree/School title text' },
        { key: 'educationDescription' as const, label: 'Description', description: 'Education description text' },
      ]
    },
    {
      title: '📜 Certification Cards',
      controls: [
        { key: 'certificationTitle' as const, label: 'Title', description: 'Certification title text' },
        { key: 'certificationDescription' as const, label: 'Description', description: 'Certification description text' },
      ]
    },
    {
      title: '🤝 Volunteer Cards',
      controls: [
        { key: 'volunteerTitle' as const, label: 'Title', description: 'Volunteer role title text' },
        { key: 'volunteerDescription' as const, label: 'Description', description: 'Volunteer description text' },
      ]
    },
    {
      title: '📚 Publication Cards',
      controls: [
        { key: 'publicationTitle' as const, label: 'Title', description: 'Publication title text' },
        { key: 'publicationDescription' as const, label: 'Description', description: 'Publication description text' },
      ]
    },
    {
      title: '🎤 Speaking Cards',
      controls: [
        { key: 'speakingTitle' as const, label: 'Title', description: 'Speaking event title text' },
        { key: 'speakingDescription' as const, label: 'Description', description: 'Speaking description text' },
      ]
    },
    {
      title: '🎨 Hobby Cards',
      controls: [
        { key: 'hobbyTitle' as const, label: 'Title', description: 'Hobby title text' },
        { key: 'hobbyDescription' as const, label: 'Description', description: 'Hobby description text' },
      ]
    }
  ]

  const skillsSection = {
    title: '🛠️ Skills Section',
    controls: [
      { key: 'skillCategoryTitle' as const, label: 'Category Title', description: 'Skill category headers' },
      { key: 'skillItem' as const, label: 'Skill Items', description: 'Individual skill text' },
    ]
  }

  const globalSection = {
    title: '🌐 Global Text Settings',
    controls: [
      { key: 'bodyText' as const, label: 'Body Text', description: 'General paragraph text' },
      { key: 'smallText' as const, label: 'Small Text', description: 'Secondary/helper text' },
      { key: 'contactText' as const, label: 'Contact Text', description: 'Contact section text' },
      { key: 'summaryText' as const, label: 'Summary Text', description: 'Summary section text' },
    ]
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Type className="h-4 w-4" />
          Text Sizes
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Type className="h-5 w-5" />
            Typography Settings
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Customize text sizes for every component in your portfolio
          </p>
        </DialogHeader>

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="text-sm font-medium">Text Size Controls</span>
          </div>
          <Button onClick={handleReset} variant="outline" size="sm" className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset All
          </Button>
        </div>

        <Tabs defaultValue="cards" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="cards">Card Components</TabsTrigger>
            <TabsTrigger value="skills">Skills & Other</TabsTrigger>
            <TabsTrigger value="global">Global Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="cards" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cardSections.map((section) => (
                <div key={section.title} className="space-y-4 p-4 border rounded-lg">
                  <h3 className="font-semibold text-lg">{section.title}</h3>
                  {section.controls.map((control) => (
                    <TextSizeControl
                      key={control.key}
                      label={control.label}
                      description={control.description}
                      sizeKey={control.key}
                      currentSize={textSizes[control.key]}
                      onSizeChange={(size) => updateTextSize(control.key, size)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="font-semibold text-lg">{skillsSection.title}</h3>
                {skillsSection.controls.map((control) => (
                  <TextSizeControl
                    key={control.key}
                    label={control.label}
                    description={control.description}
                    sizeKey={control.key}
                    currentSize={textSizes[control.key]}
                    onSizeChange={(size) => updateTextSize(control.key, size)}
                  />
                ))}
              </div>

              {/* Preview section */}
              <div className="space-y-4 p-4 border rounded-lg bg-muted/10">
                <h3 className="font-semibold text-lg">📖 Live Preview</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-card rounded border">
                    <div className={`font-bold text-card-foreground ${textSizes.achievementTitle === 'xs' ? 'text-xs' : textSizes.achievementTitle === 'sm' ? 'text-sm' : textSizes.achievementTitle === 'base' ? 'text-base' : textSizes.achievementTitle === 'lg' ? 'text-lg' : textSizes.achievementTitle === 'xl' ? 'text-xl' : textSizes.achievementTitle === '2xl' ? 'text-2xl' : textSizes.achievementTitle === '3xl' ? 'text-3xl' : textSizes.achievementTitle === '4xl' ? 'text-4xl' : textSizes.achievementTitle === '5xl' ? 'text-5xl' : 'text-6xl'}`}>
                      Achievement Title Preview
                    </div>
                    <div className={`text-muted-foreground mt-1 ${textSizes.achievementDescription === 'xs' ? 'text-xs' : textSizes.achievementDescription === 'sm' ? 'text-sm' : textSizes.achievementDescription === 'base' ? 'text-base' : textSizes.achievementDescription === 'lg' ? 'text-lg' : textSizes.achievementDescription === 'xl' ? 'text-xl' : textSizes.achievementDescription === '2xl' ? 'text-2xl' : textSizes.achievementDescription === '3xl' ? 'text-3xl' : textSizes.achievementDescription === '4xl' ? 'text-4xl' : textSizes.achievementDescription === '5xl' ? 'text-5xl' : 'text-6xl'}`}>
                      This is how your achievement description will look with the current settings.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="global" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="font-semibold text-lg">{globalSection.title}</h3>
                {globalSection.controls.map((control) => (
                  <TextSizeControl
                    key={control.key}
                    label={control.label}
                    description={control.description}
                    sizeKey={control.key}
                    currentSize={textSizes[control.key]}
                    onSizeChange={(size) => updateTextSize(control.key, size)}
                  />
                ))}
              </div>

              <div className="space-y-4 p-4 border rounded-lg bg-muted/10">
                <h3 className="font-semibold text-lg">💡 Tips</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• <strong>Titles:</strong> Usually look best at 2xl or larger</li>
                  <li>• <strong>Descriptions:</strong> Base to xl works well for readability</li>
                  <li>• <strong>Body text:</strong> Base or lg for comfortable reading</li>
                  <li>• <strong>Small text:</strong> Use for secondary information</li>
                  <li>• <strong>Mobile:</strong> Consider smaller sizes for mobile screens</li>
                  <li>• <strong>Accessibility:</strong> Avoid text smaller than 14px (sm)</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}