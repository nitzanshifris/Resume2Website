export interface TestimonialItem {
  quote: string;
  name: string;
  title: string;
}

export interface InfiniteMovingCardsProps {
  items: TestimonialItem[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}

export interface InfiniteMovingCardsDemoProps {
  className?: string;
  containerClassName?: string;
}