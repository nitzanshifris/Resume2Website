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
      "accent-foreground": "20 14% 4%",
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
      card: "224 71% 6%",
      "card-foreground": "210 40% 98%",
      popover: "224 71% 4%",
      "popover-foreground": "210 40% 98%",
      primary: "210 40% 98%",
      "primary-foreground": "224 71% 4%",
      secondary: "224 71% 9%",
      "secondary-foreground": "210 40% 98%",
      muted: "224 71% 9%",
      "muted-foreground": "210 40% 80%",
      accent: "340 82% 70%", // Soft Pink/Blush
      "accent-foreground": "224 71% 4%",
      destructive: "0 84% 60%",
      "destructive-foreground": "210 40% 98%",
      border: "224 71% 12%",
      input: "224 71% 12%",
      ring: "340 82% 70%",
      "gradient-1": "#E91E63",
      "gradient-2": "#F48FB1",
      "gradient-3": "#F8BBD0",
      "gradient-4": "#C2185B",
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
      accent: "120 39% 31%", // Rich Green
      "accent-foreground": "48 33% 94%",
      destructive: "0 84% 60%",
      "destructive-foreground": "48 33% 94%",
      border: "48 15% 80%",
      input: "48 15% 80%",
      ring: "120 39% 31%",
      "gradient-1": "#2E7D32",
      "gradient-2": "#4CAF50",
      "gradient-3": "#A5D6A7",
      "gradient-4": "#1B5E20",
    },
  },
  {
    name: "Interstellar",
    colors: {
      background: "240 20% 5%", // Deep Space Blue
      foreground: "240 10% 95%", // Light Grey
      card: "240 20% 7%",
      "card-foreground": "240 10% 95%",
      popover: "240 20% 5%",
      "popover-foreground": "240 10% 95%",
      primary: "240 10% 95%",
      "primary-foreground": "240 20% 5%",
      secondary: "240 20% 11%",
      "secondary-foreground": "240 10% 95%",
      muted: "240 20% 11%",
      "muted-foreground": "240 5% 65%",
      accent: "300 100% 70%", // Electric Magenta
      "accent-foreground": "240 20% 5%",
      destructive: "0 84% 60%",
      "destructive-foreground": "240 10% 95%",
      border: "240 20% 15%",
      input: "240 20% 15%",
      ring: "300 100% 70%",
      "gradient-1": "#9C27B0",
      "gradient-2": "#E040FB",
      "gradient-3": "#F3E5F5",
      "gradient-4": "#7B1FA2",
    },
  },
]
