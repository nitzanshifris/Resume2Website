export interface TooltipItem {
  id: number;
  name: string;
  designation: string;
  image: string;
}

export interface AnimatedTooltipProps {
  items: TooltipItem[];
  className?: string;
}