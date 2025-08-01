export interface Theme {
  name: string
  colors: {
    background: string
    foreground: string
    card: string
    "card-foreground": string
    popover: string
    "popover-foreground": string
    primary: string
    "primary-foreground": string
    secondary: string
    "secondary-foreground": string
    muted: string
    "muted-foreground": string
    accent: string
    "accent-foreground": string
    destructive: string
    "destructive-foreground": string
    border: string
    input: string
    ring: string
    "gradient-1": string
    "gradient-2": string
    "gradient-3": string
    "gradient-4": string
  }
}

export const themes: Theme[] = [
  {
    name: "Cream & Gold",
    colors: {
      background: "39 56% 95%",
      foreground: "20 14% 4%",
      card: "39 56% 95%",
      "card-foreground": "20 14% 4%",
      popover: "39 56% 95%",
      "popover-foreground": "20 14% 4%",
      primary: "20 14% 4%",
      "primary-foreground": "39 56% 95%",
      secondary: "39 10% 90%",
      "secondary-foreground": "20 14% 4%",
      muted: "39 10% 90%",
      "muted-foreground": "20 5% 45%",
      accent: "45 86% 62%",
      "accent-foreground": "45 86% 10%", // Dark text on gold accent
      destructive: "0 84% 60%",
      "destructive-foreground": "39 56% 95%",
      border: "39 10% 85%",
      input: "39 10% 85%",
      ring: "45 86% 62%",
      "gradient-1": "#A67C00",
      "gradient-2": "#FBBF24",
      "gradient-3": "#FDE68A",
      "gradient-4": "#A67C00",
    },
  },
  {
    name: "Midnight Blush",
    colors: {
      background: "224 71% 4%", // Deep Navy
      foreground: "210 40% 98%", // Almost White
      card: "224 71% 8%", // Increased contrast
      "card-foreground": "210 40% 98%",
      popover: "224 71% 4%",
      "popover-foreground": "210 40% 98%",
      primary: "210 40% 98%",
      "primary-foreground": "224 71% 4%",
      secondary: "224 71% 12%", // Better contrast
      "secondary-foreground": "210 40% 98%",
      muted: "224 71% 12%",
      "muted-foreground": "215 20% 70%", // Brighter muted text
      accent: "340 82% 70%", // Soft Pink/Blush
      "accent-foreground": "340 82% 10%", // Dark text on accent
      destructive: "0 84% 60%",
      "destructive-foreground": "210 40% 98%",
      border: "224 60% 20%", // Brighter borders
      input: "224 60% 18%", // Better input definition
      ring: "340 82% 75%", // More visible focus ring
      "gradient-1": "#1E3A8A", // Blue family
      "gradient-2": "#3B82F6", // Blue family
      "gradient-3": "#60A5FA", // Blue family
      "gradient-4": "#1E40AF", // Blue family
    },
  },
  {
    name: "Evergreen",
    colors: {
      background: "48 33% 94%", // Light Beige
      foreground: "120 27% 15%", // Deep Forest Green
      card: "48 33% 96%",
      "card-foreground": "120 27% 15%",
      popover: "48 33% 94%",
      "popover-foreground": "120 27% 15%",
      primary: "120 27% 15%",
      "primary-foreground": "48 33% 94%",
      secondary: "48 20% 88%",
      "secondary-foreground": "120 27% 15%",
      muted: "48 20% 88%",
      "muted-foreground": "120 10% 45%",
      accent: "142 70% 45%", // More distinct forest green
      "accent-foreground": "142 70% 5%", // Dark text on accent
      destructive: "0 84% 60%",
      "destructive-foreground": "48 33% 94%",
      border: "48 15% 80%",
      input: "48 15% 80%",
      ring: "142 70% 50%", // Better focus visibility
      "gradient-1": "#065F46", // Green family
      "gradient-2": "#10B981", // Green family
      "gradient-3": "#86EFAC", // Green family
      "gradient-4": "#047857", // Green family
    },
  },
  {
    name: "Interstellar",
    colors: {
      background: "240 20% 5%", // Deep Space Blue
      foreground: "240 10% 95%", // Light Grey
      card: "240 20% 9%", // Better card contrast
      "card-foreground": "240 10% 95%",
      popover: "240 20% 5%",
      "popover-foreground": "240 10% 95%",
      primary: "240 10% 95%",
      "primary-foreground": "240 20% 5%",
      secondary: "240 20% 13%", // Better contrast
      "secondary-foreground": "240 10% 95%",
      muted: "240 20% 13%",
      "muted-foreground": "240 10% 75%", // Brighter muted text
      accent: "300 100% 70%", // Electric Magenta
      "accent-foreground": "300 100% 10%", // Dark text on accent
      destructive: "0 84% 60%",
      "destructive-foreground": "240 10% 95%",
      border: "240 20% 22%", // Much brighter borders
      input: "240 20% 20%", // Better input visibility
      ring: "300 100% 75%", // More visible focus ring
      "gradient-1": "#9C27B0",
      "gradient-2": "#E040FB",
      "gradient-3": "#F3E5F5",
      "gradient-4": "#7B1FA2",
    },
  },
  {
    name: "Serene Sky",
    colors: {
      background: "210 60% 98%",
      foreground: "215 28% 17%",
      card: "210 60% 98%",
      "card-foreground": "215 28% 17%",
      popover: "210 60% 98%",
      "popover-foreground": "215 28% 17%",
      primary: "215 28% 17%",
      "primary-foreground": "210 60% 98%",
      secondary: "210 30% 94%",
      "secondary-foreground": "215 28% 17%",
      muted: "210 30% 94%",
      "muted-foreground": "215 15% 45%",
      accent: "199 70% 50%", // Toned down ocean blue
      "accent-foreground": "199 70% 98%", // Light text on accent
      destructive: "0 84% 60%",
      "destructive-foreground": "210 40% 98%",
      border: "210 20% 88%",
      input: "210 20% 88%",
      ring: "199 70% 55%", // Better focus visibility
      "gradient-1": "#0891B2", // Ocean blue family
      "gradient-2": "#06B6D4", // Ocean blue family
      "gradient-3": "#67E8F9", // Ocean blue family
      "gradient-4": "#0E7490", // Ocean blue family
    },
  },
  {
    name: "Crimson Night",
    colors: {
      background: "0 5% 7%",
      foreground: "0 0% 95%",
      card: "0 5% 11%", // Better card contrast
      "card-foreground": "0 0% 95%",
      popover: "0 5% 7%",
      "popover-foreground": "0 0% 95%",
      primary: "0 0% 95%",
      "primary-foreground": "0 5% 7%",
      secondary: "0 5% 16%", // Better contrast
      "secondary-foreground": "0 0% 95%",
      muted: "0 5% 16%",
      "muted-foreground": "0 0% 75%", // Brighter muted text
      accent: "347 77% 50%",
      "accent-foreground": "0 0% 100%",
      destructive: "10 80% 55%",
      "destructive-foreground": "0 0% 100%",
      border: "0 5% 25%", // Much brighter borders
      input: "0 5% 23%", // Better input visibility
      ring: "347 77% 55%", // More visible focus ring
      "gradient-1": "#DC2626",
      "gradient-2": "#EF4444",
      "gradient-3": "#FCA5A5",
      "gradient-4": "#B91C1C",
    },
  },
]
