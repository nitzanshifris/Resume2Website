import { MotionValue } from "framer-motion";

export interface Product {
  title: string;
  link: string;
  thumbnail: string;
}

export interface HeroParallaxProps {
  products?: Product[];
}

export interface ProductCardProps {
  product: Product;
  translate: MotionValue<number>;
}

export interface HeroParallaxDemoProps {
  className?: string;
  containerClassName?: string;
}