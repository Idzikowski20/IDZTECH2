
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Accessibility helper functions
export function srOnly() {
  return "sr-only"
}

export function focusVisible() {
  return "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-premium-purple"
}
