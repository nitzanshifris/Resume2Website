'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastProps {
  id?: string;
  message?: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

export type ToastActionElement = React.ReactElement;

export interface ToastViewportProps {
  className?: string;
}

export interface ToastCloseProps {
  className?: string;
  onClick?: () => void;
}

export interface ToastTitleProps {
  children: React.ReactNode;
  className?: string;
}

export interface ToastDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export interface ToastProviderProps {
  children: React.ReactNode;
}

const Toast: React.FC<ToastProps> = ({ id, message, type, duration = 5000, onClose, children }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose?.(), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-white border-green-200';
      case 'error':
        return 'bg-white border-red-200';
      case 'info':
        return 'bg-white border-blue-200';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${getBackgroundColor()} min-w-[300px] max-w-[500px]`}
        >
          {getIcon()}
          {children ? (
            <div className="flex-1">{children}</div>
          ) : (
            <p className="flex-1 text-sm font-medium text-gray-800">{message}</p>
          )}
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => onClose?.(), 300);
            }}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Toast Provider Component
export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  return (
    <div className="toast-provider">
      {children}
      <ToastViewport />
    </div>
  );
};

// Toast Viewport Component
export const ToastViewport: React.FC<ToastViewportProps> = ({ className = '' }) => {
  return (
    <div
      className={`fixed top-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px] ${className}`}
    />
  );
};

// Toast Close Component
export const ToastClose: React.FC<ToastCloseProps> = ({ className = '', onClick }) => {
  return (
    <button
      className={`absolute right-2 top-2 rounded-md p-1 text-gray-400 opacity-0 transition-opacity hover:text-gray-600 focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 ${className}`}
      onClick={onClick}
    >
      <X className="h-4 w-4" />
    </button>
  );
};

// Toast Title Component
export const ToastTitle: React.FC<ToastTitleProps> = ({ children, className = '' }) => {
  return (
    <div className={`text-sm font-semibold ${className}`}>
      {children}
    </div>
  );
};

// Toast Description Component
export const ToastDescription: React.FC<ToastDescriptionProps> = ({ children, className = '' }) => {
  return (
    <div className={`text-sm opacity-90 ${className}`}>
      {children}
    </div>
  );
};

export { Toast };
export default Toast;