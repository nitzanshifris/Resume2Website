export interface HoverEffectItem {
  title: string;
  description: string;
  link: string;
}

export interface HoverEffectProps {
  items: HoverEffectItem[];
  className?: string;
} 