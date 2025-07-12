export interface CTASectionProps {
  title?: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  className?: string;
}

export interface CTASectionItem {
  id: string;
  title: string;
  description?: string;
}

export interface CTASectionVariant {
  id: string;
  name: string;
  description: string;
}

export type CTASectionStyle = "minimal" | "modern" | "gradient" | "featured";