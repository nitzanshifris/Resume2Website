export interface Word {
  text: string;
  className?: string;
}

export interface TypewriterEffectProps {
  words: Word[];
  className?: string;
  cursorClassName?: string;
}

export interface TypewriterEffectSmoothProps {
  words: Word[];
  className?: string;
  cursorClassName?: string;
}