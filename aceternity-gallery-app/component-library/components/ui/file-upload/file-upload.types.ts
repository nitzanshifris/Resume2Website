export interface FileUploadProps {
  onChange: (files: File[]) => void;
  className?: string;
  containerClassName?: string;
  maxFiles?: number;
  accept?: Record<string, string[]>;
  maxSize?: number;
  disabled?: boolean;
}

export interface GridPatternProps {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  squares?: Array<[number, number]>;
  className?: string;
}

export interface FileUploadState {
  dragActive: boolean;
  files: File[];
}