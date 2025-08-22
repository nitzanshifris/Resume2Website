export const FIELD_COLOR_MAP = {
  // Work arrangement (Purple = flexibility/modern work)
  remote: {
    edit: 'from-purple-100/10 via-purple-200/15 to-purple-100/10 border border-purple-400/50',
    preview: 'from-purple-100/10 via-purple-200/15 to-purple-100/10 border border-purple-400/60'
  },
  hybrid: {
    edit: 'from-purple-100/10 via-purple-200/15 to-purple-100/10 border border-purple-400/50',
    preview: 'from-purple-100/10 via-purple-200/15 to-purple-100/10 border border-purple-400/60'
  },
  
  // Employment commitment (Amber = stability/commitment)  
  fullTime: {
    edit: 'from-amber-100/10 via-amber-200/15 to-amber-100/10 border border-amber-400/50',
    preview: 'from-amber-100/10 via-amber-200/15 to-amber-100/10 border border-amber-400/60'
  },
  partTime: {
    edit: 'from-amber-100/10 via-amber-200/15 to-amber-100/10 border border-amber-400/50',
    preview: 'from-amber-100/10 via-amber-200/15 to-amber-100/10 border border-amber-400/60'
  },
  
  // Skills/abilities (Green = growth/learning)
  skills: {
    edit: 'from-green-100/10 via-green-200/15 to-green-100/10 border border-green-400/50',
    preview: 'from-green-100/10 via-green-200/15 to-green-100/10 border border-green-400/60'
  },
  
  // Tools/technology (Blue = technical/digital)
  tools: {
    edit: 'from-blue-100/10 via-blue-200/15 to-blue-100/10 border border-blue-400/50',
    preview: 'from-blue-100/10 via-blue-200/15 to-blue-100/10 border border-blue-400/60'
  },
  
  // Education fields
  relevantCoursework: {
    edit: 'from-slate-100/10 via-slate-200/15 to-slate-100/10 border border-slate-400/50',
    preview: 'from-slate-100/10 via-slate-200/15 to-slate-100/10 border border-slate-400/60'
  }, // Neutral
  honors: {
    edit: 'from-amber-100/10 via-amber-200/15 to-amber-100/10 border border-amber-400/50',
    preview: 'from-amber-100/10 via-amber-200/15 to-amber-100/10 border border-amber-400/60'
  }, // Achievement
  gpa: {
    edit: 'from-green-100/10 via-green-200/15 to-green-100/10 border border-green-400/50',
    preview: 'from-green-100/10 via-green-200/15 to-green-100/10 border border-green-400/60'
  }, // Performance
  minors: {
    edit: 'from-purple-100/10 via-purple-200/15 to-purple-100/10 border border-purple-400/50',
    preview: 'from-purple-100/10 via-purple-200/15 to-purple-100/10 border border-purple-400/60'
  }, // Specialization
  exchangePrograms: {
    edit: 'from-blue-100/10 via-blue-200/15 to-blue-100/10 border border-blue-400/50',
    preview: 'from-blue-100/10 via-blue-200/15 to-blue-100/10 border border-blue-400/60'
  }, // International
  
  // Fallback
  custom: {
    edit: 'from-slate-100/10 via-slate-200/15 to-slate-100/10 border border-slate-400/50',
    preview: 'from-slate-100/10 via-slate-200/15 to-slate-100/10 border border-slate-400/60'
  }, // Neutral
} as const

export type FieldColorType = keyof typeof FIELD_COLOR_MAP

export const THEME_VARIANTS = {
  colorful: (fieldType: FieldColorType, mode: 'edit' | 'preview' = 'edit') => 
    `backdrop-blur-md bg-gradient-to-r ${FIELD_COLOR_MAP[fieldType][mode]} text-foreground`,
  'theme-aware': (fieldType: FieldColorType, mode: 'edit' | 'preview' = 'edit') => 
    `backdrop-blur-sm bg-primary/10 border ${mode === 'edit' ? 'border-primary/50' : 'border-primary/60'} text-primary hover:bg-primary/15`,
  'high-contrast': (fieldType: FieldColorType, mode: 'edit' | 'preview' = 'edit') => 
    `bg-black text-white border ${mode === 'edit' ? 'border-gray-800' : 'border-gray-700'}`
} as const

export type ThemeVariant = keyof typeof THEME_VARIANTS

export function getFieldColorClass(fieldType: FieldColorType, theme: ThemeVariant = 'colorful', mode: 'edit' | 'preview' = 'edit'): string {
  return THEME_VARIANTS[theme](fieldType as FieldColorType, mode)
}

export function inferFieldType(fieldKey: string): FieldColorType {
  const key = fieldKey.toLowerCase()
  
  if (key.includes('remote')) return 'remote'
  if (key.includes('hybrid')) return 'hybrid'
  if (key.includes('full') || key.includes('fulltime')) return 'fullTime'
  if (key.includes('part') || key.includes('parttime')) return 'partTime'
  if (key.includes('skill')) return 'skills'
  if (key.includes('tool') || key.includes('tech')) return 'tools'
  if (key.includes('course')) return 'relevantCoursework'
  if (key.includes('honor') || key.includes('award')) return 'honors'
  if (key.includes('gpa') || key.includes('grade')) return 'gpa'
  if (key.includes('minor')) return 'minors'
  if (key.includes('exchange') || key.includes('abroad')) return 'exchangePrograms'
  
  return 'custom'
}