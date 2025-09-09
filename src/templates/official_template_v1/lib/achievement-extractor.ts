// Smart achievement extraction from job descriptions
export interface ExtractedAchievement {
  title: string
  description: string
  icon: 'award' | 'users' | 'target' | 'trending-up'
  confidence: number // 0-1 score of how confident we are this is a real achievement
}

export class AchievementExtractor {
  // Patterns that indicate measurable achievements
  private static readonly MEASUREMENT_PATTERNS = [
    // Percentages
    /(\d+)%\s+(increase|improvement|growth|reduction|decrease)/gi,
    /increased?.*?by\s+(\d+)%/gi,
    /improved?.*?by\s+(\d+)%/gi,
    /reduced?.*?by\s+(\d+)%/gi,
    
    // Revenue/Money
    /\$[\d,.]+(k|m|million|thousand|billion)/gi,
    /generated?\s+\$[\d,.]+/gi,
    /saved?\s+\$[\d,.]+/gi,
    /revenue.*?\$[\d,.]+/gi,
    
    // Team/People numbers
    /team of (\d+)/gi,
    /led (\d+)\s+(people|employees|members)/gi,
    /managed (\d+)\s+(people|employees|members)/gi,
    /(\d+)\+?\s+(team|people|employees)/gi,
    
    // Time/Efficiency
    /reduced?.*?time.*?by\s+(\d+)\s*(hours?|days?|weeks?|months?)/gi,
    /faster by (\d+)/gi,
    /(\d+)x faster/gi,
    
    // Scale/Volume  
    /(\d+[\d,]*)\+?\s+(users?|customers?|clients?|projects?|files?|records?|accounts?)/gi,
    /(\d+[\d,]*)\s+(client|customer|user|project|file|record|account)\s+\w+/gi,
    /transferred?\s+(\d+[\d,]*)/gi,
    /processed?\s+(\d+[\d,]*)/gi,
    /migrated?\s+(\d+[\d,]*)/gi,
    /converted?\s+(\d+[\d,]*)/gi,
    /scaled?.*?to\s+(\d+)/gi,
    
    // Awards/Recognition
    /won|awarded|recognized|featured|selected/gi,
    /first.*?to/gi,
    /achieved.*?(award|recognition|certification)/gi
  ]

  // Keywords that indicate different types of achievements
  private static readonly ACHIEVEMENT_TYPES = {
    award: ['award', 'recognition', 'featured', 'selected', 'won', 'achieved', 'honored', 'distinguished'],
    users: ['team', 'led', 'managed', 'people', 'employees', 'members', 'mentored', 'trained'],
    target: ['exceeded', 'achieved', 'reached', 'delivered', 'completed', 'launched', 'implemented', 'transferred', 'migrated', 'converted', 'processed', 'instrumental', 'successfully'],
    'trending-up': ['increased', 'improved', 'grew', 'scaled', 'expanded', 'revenue', 'growth', 'faster', 'efficiency']
  }

  // Common business buzzwords that don't indicate real achievements
  private static readonly BUZZWORD_FILTERS = [
    'synergy', 'leverage', 'utilize', 'facilitate', 'optimize', 'streamline',
    'collaborate', 'coordinate', 'support', 'assist', 'help', 'work with',
    'responsible for', 'involved in', 'participated in', 'contributed to'
  ]

  static extractAchievements(description: string): ExtractedAchievement[] {
    if (!description || description.length < 50) return []

    const achievements: ExtractedAchievement[] = []
    const sentences = this.splitIntoSentences(description)

    for (const sentence of sentences) {
      const achievement = this.analyzeSentence(sentence)
      if (achievement && achievement.confidence > 0.6) {
        achievements.push(achievement)
      }
    }

    // Limit to top 3 most confident achievements
    return achievements
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 3)
  }

  private static splitIntoSentences(text: string): string[] {
    return text
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 20) // Filter out very short fragments
  }

  private static analyzeSentence(sentence: string): ExtractedAchievement | null {
    let confidence = 0
    let achievementType: 'award' | 'users' | 'target' | 'trending-up' = 'award'

    // Check if sentence contains measurable data
    const hasMeasurement = this.MEASUREMENT_PATTERNS.some(pattern => pattern.test(sentence))
    if (!hasMeasurement) return null

    confidence += 0.4

    // Check for achievement type indicators
    for (const [type, keywords] of Object.entries(this.ACHIEVEMENT_TYPES)) {
      const keywordCount = keywords.filter(keyword => 
        sentence.toLowerCase().includes(keyword)
      ).length
      
      if (keywordCount > 0) {
        achievementType = type as any
        confidence += keywordCount * 0.2
        break
      }
    }

    // Penalize for buzzwords that don't indicate real achievements
    const buzzwordCount = this.BUZZWORD_FILTERS.filter(buzzword =>
      sentence.toLowerCase().includes(buzzword)
    ).length
    confidence -= buzzwordCount * 0.1

    // Extract numbers for context
    const numbers = sentence.match(/\d+/g) || []
    if (numbers.length > 0) confidence += 0.2

    // Create achievement title and description
    const title = this.generateTitle(sentence, achievementType)
    const description = this.generateDescription(sentence)

    return {
      title,
      description,
      icon: achievementType,
      confidence: Math.max(0, Math.min(1, confidence))
    }
  }

  // Generate a 4-word professional summary for badge display
  static generateBadgeSummary(title: string, description: string): string {
    const fullText = `${title} ${description}`.toLowerCase()
    
    // Extract key information patterns
    const patterns = [
      // Numbers with actions
      /(\w+)\s+(\d+[\d,]*)\s+(clients?|files?|people|team|members?|users?)/i,
      /(\w+)\s+by\s+(\d+%?)/i,
      /(\w+)\s+\$?([\d,.]+[km]?)/i,
      /led\s+(\d+)\s+(\w+)/i,
      /managed\s+(\d+)\s+(\w+)/i,
    ]
    
    for (const pattern of patterns) {
      const match = fullText.match(pattern)
      if (match) {
        if (pattern.source.includes('clients?|files?|people')) {
          return `${this.capitalizeFirst(match[1])} ${match[2]} ${match[3]}`
        } else if (pattern.source.includes('by')) {
          return `${this.capitalizeFirst(match[1])} by ${match[2]}`
        } else if (pattern.source.includes('\\$')) {
          return `${this.capitalizeFirst(match[1])} $${match[2]}`
        } else if (pattern.source.includes('led|managed')) {
          const action = match[0].includes('led') ? 'Led' : 'Managed'
          return `${action} ${match[1]} ${match[2]}`
        }
      }
    }
    
    // Fallback: take first 4 meaningful words
    const words = title.split(' ')
      .filter(word => word.length > 2 && !['the', 'and', 'for', 'with', 'that'].includes(word.toLowerCase()))
      .slice(0, 4)
    
    return words.join(' ') || title.slice(0, 20)
  }

  private static generateTitle(sentence: string, type: 'award' | 'users' | 'target' | 'trending-up'): string {
    // Extract specific achievements with numbers/concrete data
    const patterns = [
      // Numbers with context
      /(\d+[\d,]*)\s+(client|customer|user|project|file|record|account|people|team|member|employee)s?\s*(\w+)?/i,
      /transferred?\s+(\d+[\d,]*)\s*([^.]+?)(?:\s+to|\s+onto|\s*\.|$)/i,
      /managed?\s+(\d+[\d,]*)\s*([^.]+?)(?:\s+to|\s+for|\s*\.|$)/i,
      /led\s+(?:a\s+)?(?:team\s+of\s+)?(\d+[\d,]*)\s*([^.]+?)(?:\s+to|\s+for|\s*\.|$)/i,
      /increased?\s+([^.]+?)\s+by\s+(\d+%?)/i,
      /improved?\s+([^.]+?)\s+by\s+(\d+%?)/i,
      /reduced?\s+([^.]+?)\s+by\s+(\d+%?)/i,
      /generated?\s+\$?([\d,.]+[km]?)\s*(in\s+)?([^.]*)/i,
      /saved?\s+\$?([\d,.]+[km]?)\s*(in\s+)?([^.]*)/i
    ]

    for (const pattern of patterns) {
      const match = sentence.match(pattern)
      if (match) {
        if (pattern.source.includes('transferred')) {
          return `Transferred ${match[1]} ${match[2] || 'Items'}`
        } else if (pattern.source.includes('managed|led')) {
          return `Led Team of ${match[1]} ${match[2] || 'People'}`
        } else if (pattern.source.includes('increased|improved|reduced')) {
          return `${this.capitalizeFirst(match[1])} ${match[2]}`
        } else if (pattern.source.includes('generated|saved')) {
          return `${match[0].includes('generated') ? 'Generated' : 'Saved'} $${match[1]}`
        } else {
          // Generic number-based achievement
          return `${match[1]} ${this.capitalizeFirst(match[2] || '')} ${match[3] || ''}`.trim()
        }
      }
    }

    // Fallback - return first few words of sentence if it contains numbers
    const words = sentence.split(' ').slice(0, 4).join(' ')
    return this.capitalizeFirst(words)
  }

  private static generateDescription(sentence: string): string {
    // Clean up and truncate the sentence for description
    let description = sentence
      .replace(/^(I|We)\s+/i, '') // Remove leading "I" or "We"
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()

    // Truncate if too long
    if (description.length > 80) {
      description = description.substring(0, 80).trim() + '...'
    }

    return this.capitalizeFirst(description)
  }

  private static capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }
}