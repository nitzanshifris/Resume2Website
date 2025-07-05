export interface BackgroundGradientProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  animate?: boolean;
}

export interface ProductCardProps {
  image: string;
  title: string;
  description: string;
  price?: string;
  buttonText?: string;
}

export interface FeatureCardProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  features?: string[];
}

export interface ProfileCardProps {
  avatar: string;
  name: string;
  role: string;
  bio?: string;
  socialLinks?: Array<{
    platform: string;
    url: string;
    icon: React.ReactNode;
  }>;
}