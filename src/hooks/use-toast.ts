
import { useState, useEffect, ReactNode } from 'react';

// Toast types
export type ToastType = 'default' | 'success' | 'error' | 'warning' | 'info' | 'destructive';

// Toast options interface
export interface ToastOptions {
  title?: string;
  description?: string;
  variant?: ToastType;
  duration?: number;
  action?: ReactNode;
}

// Toast interface
export interface Toast extends ToastOptions {
  id: string;
}

// Create a global array to store toasts
const toasts: Toast[] = [];
let listeners: (() => void)[] = [];

// Function to notify listeners of state changes
const notifyListeners = () => {
  listeners.forEach((listener) => listener());
};

// Toast API
export const toast = (options: ToastOptions) => {
  const id = Math.random().toString(36).slice(2, 11);
  
  const newToast: Toast = {
    id,
    title: options.title,
    description: options.description,
    variant: options.variant || 'default',
    duration: options.duration || 5000, // Default 5 seconds
    action: options.action,
  };
  
  toasts.push(newToast);
  notifyListeners();
  
  // Auto-dismiss after duration
  setTimeout(() => {
    const index = toasts.findIndex((t) => t.id === id);
    if (index !== -1) {
      toasts.splice(index, 1);
      notifyListeners();
    }
  }, newToast.duration);
  
  return id;
};

// Custom hook for components
export const useToast = () => {
  const [state, setState] = useState<Toast[]>([...toasts]);
  
  useEffect(() => {
    const listener = () => {
      setState([...toasts]);
    };
    
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);
  
  const dismiss = (id: string) => {
    const index = toasts.findIndex((t) => t.id === id);
    if (index !== -1) {
      toasts.splice(index, 1);
      notifyListeners();
    }
  };
  
  return {
    toasts: state,
    toast,
    dismiss,
  };
};
