"use client"

import React, { useState, useRef, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  Search, 
  Upload, 
  X,
  // Common icons for fallback
  Lightbulb,
  Heart,
  Star,
  Users,
  Code,
  Palette,
  Camera,
  Globe,
  Mail,
  Phone,
  Settings,
  Home,
  Car,
  Music,
  Book,
  Coffee,
  Briefcase,
  Award,
  Target,
  Rocket,
  Building2
} from "lucide-react"

// Import comprehensive Tabler icons
import {
  IconApple,
  IconBrandGithub,
  IconBrandTwitter,
  IconBrandLinkedin,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandYoutube,
  IconBrandGoogle,
  IconBrandNetflix,
  IconBrandSpotify,
  IconBrandDiscord,
  IconBrandSlack,
  IconBrandZoom,
  IconBrandFigma,
  IconBrandSketch,
  IconBrandAdobePhotoshop,
  IconBrandReact,
  IconBrandVue,
  IconBrandAngular,
  IconBrandNodejs,
  IconBrandPython,
  IconBrandJavascript,
  IconBrandTypescript,
  IconBrandDocker,
  IconBrandAws,
  IconActivity,
  IconAdjustments,
  IconAlarm,
  IconArchive,
  IconArrowRight,
  IconArrowLeft,
  IconArrowUp,
  IconArrowDown,
  IconBell,
  IconCalendar,
  IconCamera,
  IconChartLine,
  IconCheck,
  IconCloud,
  IconCpu,
  IconDatabase,
  IconEdit,
  IconFile,
  IconFolder,
  IconGift,
  IconHeart,
  IconHome,
  IconLocation,
  IconLock,
  IconMail,
  IconMap,
  IconMessage,
  IconMoon,
  IconMusic,
  IconNotification,
  IconPalette,
  IconPhone,
  IconPhoto,
  IconPrinter,
  IconSearch,
  IconSettings,
  IconShield,
  IconStar,
  IconSun,
  IconUser,
  IconUsers,
  IconVideo,
  IconWifi,
  IconWorld,
  IconBrain,
  IconBulb,
  IconCode,
  IconDeviceDesktop,
  IconDevices,
  IconFlame,
  IconDeviceGamepad,
  IconHeadphones,
  IconDeviceLaptop,
  IconMicrophone,
  IconDeviceImac,
  IconPizza,
  IconRocket,
  IconTrophy,
  IconCoffee,
  IconCar,
  IconPlane,
  IconTrain,
  IconShip,
  IconBike,
  IconWalk,
  IconRun,
  IconSwimming,
  IconBallBasketball,
  IconBallFootball,
  IconBallTennis,
  IconGolf,
  IconFish,
  IconMountain,
  IconTent,
  IconBeach,
  IconTree,
  IconFlower,
  IconLeaf,
  IconSeedling,
  IconDroplet,
  IconSnowflake,
  IconUmbrella,
  IconCloudRain,
  IconBolt,
  IconKey,
  IconFingerprint,
  IconEye,
  IconEyeOff,
  IconThumbUp,
  IconThumbDown,
  IconMessageCircle,
  IconShare,
  IconDownload,
  IconUpload,
  IconCopy,
  IconCut,
  IconClipboard,
  IconTrash,
  IconRefresh,
  IconMaximize,
  IconMinimize,
  IconX,
  IconPlus,
  IconMinus,
  IconEqual,
  IconPercentage,
  IconHash,
  IconAt,
  IconQuestionMark,
  IconExclamationMark,
  IconInfoCircle,
  IconAlertTriangle,
  IconCircleCheck,
  IconCircleX,
  IconClock,
  IconCalendarEvent,
  IconMapPin,
  IconCompass,
  IconTarget,
  IconFocus,
  IconZoom,
  IconScan,
  IconQrcode,
  IconBarcode,
  IconDeviceFloppy,
  IconMoodSmile,
  IconMoodSad,
  IconMoodHappy,
  IconMoodAngry,
  IconMoodCry,
  IconMoodWink
} from '@tabler/icons-react'

// Comprehensive icon categories with Tabler icons
const ICON_CATEGORIES = {
  'Popular': {
    icons: {
      'heart': IconHeart,
      'star': IconStar,
      'user': IconUser,
      'users': IconUsers,
      'home': IconHome,
      'mail': IconMail,
      'phone': IconPhone,
      'camera': IconCamera,
      'settings': IconSettings,
      'search': IconSearch,
      'calendar': IconCalendar,
      'location': IconLocation,
      'bell': IconBell,
      'lock': IconLock,
      'shield': IconShield,
      'check': IconCheck,
      'edit': IconEdit,
      'gift': IconGift,
      'rocket': IconRocket,
      'trophy': IconTrophy,
      'brain': IconBrain,
      'bulb': IconBulb,
      'flame': IconFlame,
      'target': IconTarget
    }
  },
  'Comm': {
    icons: {
      'mail': IconMail,
      'phone': IconPhone,
      'message': IconMessage,
      'notification': IconNotification,
      'bell': IconBell,
      'video': IconVideo,
      'wifi': IconWifi,
      'messageCircle': IconMessageCircle,
      'share': IconShare,
      'microphone': IconMicrophone,
      'headphones': IconHeadphones
    }
  },
  'Tech': {
    icons: {
      'github': IconBrandGithub,
      'twitter': IconBrandTwitter,
      'linkedin': IconBrandLinkedin,
      'facebook': IconBrandFacebook,
      'instagram': IconBrandInstagram,
      'youtube': IconBrandYoutube,
      'google': IconBrandGoogle,
      'apple': IconApple,
      'netflix': IconBrandNetflix,
      'spotify': IconBrandSpotify,
      'discord': IconBrandDiscord,
      'slack': IconBrandSlack,
      'zoom': IconBrandZoom,
      'figma': IconBrandFigma,
      'sketch': IconBrandSketch,
      'photoshop': IconBrandAdobePhotoshop,
      'react': IconBrandReact,
      'vue': IconBrandVue,
      'angular': IconBrandAngular,
      'nodejs': IconBrandNodejs,
      'python': IconBrandPython,
      'javascript': IconBrandJavascript,
      'typescript': IconBrandTypescript,
      'docker': IconBrandDocker,
      'aws': IconBrandAws
    }
  },
  'System': {
    icons: {
      'settings': IconSettings,
      'cpu': IconCpu,
      'database': IconDatabase,
      'cloud': IconCloud,
      'file': IconFile,
      'folder': IconFolder,
      'archive': IconArchive,
      'printer': IconPrinter,
      'desktop': IconDeviceDesktop,
      'laptop': IconDeviceLaptop,
      'monitor': IconDeviceImac,
      'devices': IconDevices,
      'code': IconCode,
      'download': IconDownload,
      'upload': IconUpload,
      'copy': IconCopy,
      'cut': IconCut,
      'paste': IconClipboard,
      'trash': IconTrash,
      'refresh': IconRefresh
    }
  },
  'Media': {
    icons: {
      'palette': IconPalette,
      'photo': IconPhoto,
      'camera': IconCamera,
      'edit': IconEdit,
      'adjustments': IconAdjustments,
      'gamepad': IconDeviceGamepad,
      'music': IconMusic,
      'headphones': IconHeadphones,
      'microphone': IconMicrophone,
      'maximize': IconMaximize,
      'minimize': IconMinimize,
      'zoom': IconZoom,
      'focus': IconFocus,
      'scan': IconScan,
      'qrcode': IconQrcode,
      'barcode': IconBarcode
    }
  },
  'Business': {
    icons: {
      'chart': IconChartLine,
      'activity': IconActivity,
      'world': IconWorld,
      'map': IconMap,
      'target': IconTarget,
      'focus': IconFocus,
      'trophy': IconTrophy,
      'rocket': IconRocket,
      'brain': IconBrain,
      'bulb': IconBulb,
      'flame': IconFlame
    }
  },
  'Travel': {
    icons: {
      'car': IconCar,
      'plane': IconPlane,
      'train': IconTrain,
      'ship': IconShip,
      'bike': IconBike,
      'walk': IconWalk,
      'run': IconRun,
      'location': IconLocation,
      'mapPin': IconMapPin,
      'compass': IconCompass,
      'map': IconMap
    }
  },
  'Lifestyle': {
    icons: {
      'coffee': IconCoffee,
      'pizza': IconPizza,
      'gift': IconGift,
      'home': IconHome,
      'user': IconUser,
      'users': IconUsers,
      'heart': IconHeart,
      'star': IconStar,
      'thumbUp': IconThumbUp,
      'thumbDown': IconThumbDown
    }
  },
  'Sports': {
    icons: {
      'basketball': IconBallBasketball,
      'football': IconBallFootball,
      'tennisBall': IconBallTennis,
      'golf': IconGolf,
      'fishing': IconFish,
      'hiking': IconMountain,
      'camping': IconTent,
      'swimming': IconSwimming,
      'run': IconRun,
      'walk': IconWalk,
      'bike': IconBike
    }
  },
  'Nature': {
    icons: {
      'sun': IconSun,
      'moon': IconMoon,
      'tree': IconTree,
      'flower': IconFlower,
      'leaf': IconLeaf,
      'seed': IconSeedling,
      'droplet': IconDroplet,
      'snowflake': IconSnowflake,
      'umbrella': IconUmbrella,
      'cloudRain': IconCloudRain,
      'bolt': IconBolt,
      'beach': IconBeach,
      'mountain': IconMountain
    }
  },
  'Security': {
    icons: {
      'lock': IconLock,
      'shield': IconShield,
      'key': IconKey,
      'fingerprint': IconFingerprint,
      'eye': IconEye,
      'eyeOff': IconEyeOff,
      'check': IconCheck,
      'x': IconX,
      'alertTriangle': IconAlertTriangle,
      'infoCircle': IconInfoCircle,
      'circleCheck': IconCircleCheck,
      'circleX': IconCircleX
    }
  },
  'Time': {
    icons: {
      'clock': IconClock,
      'calendar': IconCalendar,
      'calendarEvent': IconCalendarEvent,
      'alarm': IconAlarm,
      'bell': IconBell,
      'notification': IconNotification
    }
  },
  'Emotions': {
    icons: {
      'moodSmile': IconMoodSmile,
      'moodSad': IconMoodSad,
      'moodHappy': IconMoodHappy,
      'moodAngry': IconMoodAngry,
      'moodCry': IconMoodCry,
      'moodWink': IconMoodWink,
      'heart': IconHeart,
      'thumbUp': IconThumbUp,
      'thumbDown': IconThumbDown
    }
  },
  'Actions': {
    icons: {
      'arrowRight': IconArrowRight,
      'arrowLeft': IconArrowLeft,
      'arrowUp': IconArrowUp,
      'arrowDown': IconArrowDown,
      'plus': IconPlus,
      'minus': IconMinus,
      'x': IconX,
      'check': IconCheck,
      'search': IconSearch,
      'edit': IconEdit,
      'settings': IconSettings,
      'home': IconHome
    }
  }
} as const

// Fallback icon library (Lucide icons)
const FALLBACK_ICONS = {
  lightbulb: Lightbulb,
  heart: Heart,
  star: Star,
  users: Users,
  code: Code,
  palette: Palette,
  camera: Camera,
  globe: Globe,
  mail: Mail,
  phone: Phone,
  settings: Settings,
  home: Home,
  car: Car,
  music: Music,
  book: Book,
  coffee: Coffee,
  briefcase: Briefcase,
  award: Award,
  target: Target,
  rocket: Rocket,
  building: Building2
}

interface EnhancedIconSelectorProps {
  currentIcon?: {
    type: 'library' | 'upload'
    value: string
  }
  onIconSelect: (icon: { type: 'library' | 'upload'; value: string }) => void
  className?: string
}

export function EnhancedIconSelector({ currentIcon, onIconSelect, className }: EnhancedIconSelectorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('Popular')

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File size must be less than 2MB")
        return
      }
      
      if (!file.type.startsWith('image/')) {
        alert("Please select an image file")
        return
      }
      
      setIsUploading(true)
      
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        onIconSelect({ type: 'upload', value: base64String })
        setIsUploading(false)
      }
      reader.onerror = () => {
        setIsUploading(false)
        alert("Error reading file")
      }
      reader.readAsDataURL(file)
    }
  }

  const filteredIcons = useMemo(() => {
    // If there's a search term, search across ALL categories
    if (searchTerm) {
      const allIcons: { [key: string]: any } = {}
      Object.values(ICON_CATEGORIES).forEach(category => {
        Object.entries(category.icons).forEach(([key, icon]) => {
          if (key.toLowerCase().includes(searchTerm.toLowerCase())) {
            allIcons[key] = icon
          }
        })
      })
      return allIcons
    }
    
    // Otherwise, show icons from selected category
    const categoryIcons = ICON_CATEGORIES[selectedCategory as keyof typeof ICON_CATEGORIES]?.icons || {}
    return categoryIcons
  }, [selectedCategory, searchTerm])

  const renderCurrentIcon = () => {
    if (!currentIcon) {
      return <Lightbulb className="h-6 w-6 text-gray-400" />
    }

    if (currentIcon.type === 'upload') {
      return (
        <img 
          src={currentIcon.value} 
          alt="Custom icon" 
          className="h-6 w-6 object-cover rounded"
        />
      )
    }

    // Try to find icon in categories first
    for (const category of Object.values(ICON_CATEGORIES)) {
      const IconComponent = category.icons[currentIcon.value as keyof typeof category.icons]
      if (IconComponent) {
        return <IconComponent className="h-6 w-6 text-gray-700 dark:text-gray-300" size={24} />
      }
    }

    // Fallback to Lucide icons
    const FallbackIcon = FALLBACK_ICONS[currentIcon.value as keyof typeof FALLBACK_ICONS] || Lightbulb
    return <FallbackIcon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Current Icon Preview & Upload Section */}
      <div className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
        {/* Current Icon - 1/2 width */}
        <div className="w-1/2 flex items-center gap-2">
          <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
            {renderCurrentIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">Current Icon</p>
          </div>
        </div>
        
        {/* Upload Section - 1/2 width */}
        <div className="w-1/2 flex items-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <Button
            variant="outline"
            size="sm"
            className="w-full h-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-sm hover:shadow-md transition-all duration-200 text-xs"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <Upload className="h-3 w-3 mr-1" />
            {isUploading ? 'Uploading...' : 'Upload'}
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search icons..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 rounded-xl border-gray-200 dark:border-gray-700"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            onClick={() => setSearchTerm('')}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Category Selector - Bubble Buttons */}
      <div className="-mx-2">
        <Label className="text-sm font-medium mb-2 block px-1">Category</Label>
        <div className="flex flex-wrap gap-0.5 px-1">
          {Object.keys(ICON_CATEGORIES).map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              className={`rounded-full px-1.5 py-0.5 text-xs font-medium transition-all duration-200 h-5 min-w-0 flex-shrink-0 ${
                selectedCategory === category 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 shadow-md' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              <span className="text-xs whitespace-nowrap">{category}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Icons Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">
            {selectedCategory} Icons ({Object.keys(filteredIcons).length})
          </Label>
        </div>
        
        <div className="grid grid-cols-6 gap-2 max-h-64 overflow-y-auto p-2 bg-gray-50 dark:bg-gray-800 rounded-xl">
          {Object.entries(filteredIcons).map(([key, IconComponent]) => (
            <Button
              key={key}
              variant="ghost"
              size="sm"
              className={`p-3 h-12 w-12 rounded-xl transition-all duration-200 hover:bg-white hover:shadow-sm ${
                currentIcon?.type === 'library' && currentIcon?.value === key 
                  ? 'bg-blue-100 border border-blue-300 shadow-sm' 
                  : 'hover:bg-white dark:hover:bg-gray-700'
              }`}
              onClick={() => onIconSelect({ type: 'library', value: key })}
              title={key}
            >
              <IconComponent className="h-5 w-5 text-gray-700 dark:text-gray-300" size={20} />
            </Button>
          ))}
        </div>

        {Object.keys(filteredIcons).length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No icons found</p>
            <p className="text-xs">Try adjusting your search or category</p>
          </div>
        )}
      </div>

      {/* Upload Status */}
      {currentIcon?.type === 'upload' && (
        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
          <p className="text-sm text-green-700 dark:text-green-300 font-medium">✓ Custom image selected</p>
          <p className="text-xs text-green-600 dark:text-green-400">Image uploaded successfully</p>
        </div>
      )}
    </div>
  )
}