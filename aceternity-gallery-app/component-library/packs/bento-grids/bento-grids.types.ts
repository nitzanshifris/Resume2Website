export interface BentoGridItem {
  id: string;
  title?: string;
  description?: string;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export interface BentoGridProps {
  items: BentoGridItem[];
  className?: string;
}

export interface BentoGridVariant {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<any>;
}