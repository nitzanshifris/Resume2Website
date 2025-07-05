export interface ShootingStar {
  id: string;
  x: number;
  y: number;
  angle: number;
  scale: number;
  speed: number;
  distance: number;
}

export interface ShootingStarsProps {
  minSpeed?: number;
  maxSpeed?: number;
  minDelay?: number;
  maxDelay?: number;
  starColor?: string;
  trailColor?: string;
  starWidth?: number;
  starHeight?: number;
  className?: string;
}