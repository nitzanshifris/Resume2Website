export interface Logo {
  name: string;
  src: string;
}

export interface LogoCloudProps {
  logos?: Logo[][];
  animationDuration?: number;
  flipInterval?: number;
  className?: string;
}

export interface LogoCloudVariant {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<any>;
}