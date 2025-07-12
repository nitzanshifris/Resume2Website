import { ReactNode, ElementType, ComponentPropsWithoutRef } from "react";

export interface ResizableNavbarProps {
  children: ReactNode;
  className?: string;
}

export interface NavBodyProps {
  children: ReactNode;
  className?: string;
  visible?: boolean;
}

export interface NavItem {
  name: string;
  link: string;
}

export interface NavItemsProps {
  items: NavItem[];
  className?: string;
  onItemClick?: () => void;
}

export interface MobileNavProps {
  children: ReactNode;
  className?: string;
  visible?: boolean;
}

export interface MobileNavHeaderProps {
  children: ReactNode;
  className?: string;
}

export interface MobileNavMenuProps {
  children: ReactNode;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

export interface MobileNavToggleProps {
  isOpen: boolean;
  onClick: () => void;
}

export type ButtonVariant = "primary" | "secondary" | "dark" | "gradient";

export interface NavbarButtonProps {
  href?: string;
  as?: ElementType;
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
}

export type NavbarButtonPropsWithRef = NavbarButtonProps & (
  | ComponentPropsWithoutRef<"a">
  | ComponentPropsWithoutRef<"button">
);