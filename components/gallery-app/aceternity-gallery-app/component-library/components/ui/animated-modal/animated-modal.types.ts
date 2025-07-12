import { ReactNode } from "react";

export interface ModalContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export interface ModalProviderProps {
  children: ReactNode;
}

export interface ModalProps {
  children: ReactNode;
}

export interface ModalTriggerProps {
  children: ReactNode;
  className?: string;
}

export interface ModalBodyProps {
  children: ReactNode;
  className?: string;
}

export interface ModalContentProps {
  children: ReactNode;
  className?: string;
}

export interface ModalFooterProps {
  children: ReactNode;
  className?: string;
}

export interface OverlayProps {
  className?: string;
}