export interface TestimonialProps {
  name: string;
  quote: string;
  src: string;
  designation?: string;
}

export interface TestimonialsProps {
  testimonials?: TestimonialProps[];
  className?: string;
}

export interface TestimonialsVariant {
  id: string;
  name: string;
  description: string;
}

export type TestimonialsStyle = "grid" | "carousel" | "minimal" | "featured";