export interface Point {
  lat: number;
  lng: number;
  label?: string;
}

export interface MapDot {
  start: Point;
  end: Point;
}

export interface WorldMapProps {
  dots?: MapDot[];
  lineColor?: string;
}