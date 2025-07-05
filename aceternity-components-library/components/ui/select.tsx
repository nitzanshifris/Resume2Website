"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  children: React.ReactNode;
}

export interface SelectTriggerProps {
  className?: string;
  children: React.ReactNode;
}

export interface SelectContentProps {
  className?: string;
  children: React.ReactNode;
}

export interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  onSelect?: () => void;
}

export interface SelectValueProps {
  placeholder?: string;
}

const SelectContext = React.createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
} | null>(null);

const useSelect = () => {
  const context = React.useContext(SelectContext);
  if (!context) {
    throw new Error("useSelect must be used within a Select component");
  }
  return context;
};

const Select = ({ value, onValueChange, disabled = false, children }: SelectProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  );
};

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children }, ref) => {
    const { open, setOpen } = useSelect();

    return (
      <button
        ref={ref}
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white",
          "placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
      >
        {children}
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>
    );
  }
);
SelectTrigger.displayName = "SelectTrigger";

const SelectContent = ({ className, children }: SelectContentProps) => {
  const { open } = useSelect();

  if (!open) return null;

  return (
    <div className={cn(
      "absolute top-full z-50 w-full rounded-md border border-zinc-700 bg-zinc-800 shadow-md",
      "max-h-60 overflow-auto mt-1",
      className
    )}>
      {children}
    </div>
  );
};

const SelectItem = ({ value, children, onSelect }: SelectItemProps) => {
  const { onValueChange, setOpen } = useSelect();

  const handleSelect = () => {
    onValueChange?.(value);
    setOpen(false);
    onSelect?.();
  };

  return (
    <div
      onClick={handleSelect}
      className="relative flex cursor-pointer select-none items-center py-2 px-3 text-sm text-white hover:bg-zinc-700 focus:bg-zinc-700"
    >
      {children}
    </div>
  );
};

const SelectValue = ({ placeholder }: SelectValueProps) => {
  const { value } = useSelect();

  return (
    <span className={value ? "text-white" : "text-zinc-400"}>
      {value || placeholder}
    </span>
  );
};

export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue };