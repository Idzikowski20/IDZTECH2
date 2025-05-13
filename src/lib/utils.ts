
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Canvas-like transform utility
export const applyCanvasTransform = (element: HTMLElement | null, x: number = 0, y: number = 0): void => {
  if (!element) return;
  
  const transformValue = `
    translate(var(--tw-translate-x, ${x}px), var(--tw-translate-y, ${y}px))
    rotate(var(--tw-rotate, 0))
    skewX(var(--tw-skew-x, 0))
    skewY(var(--tw-skew-y, 0))
    scaleX(var(--tw-scale-x, 1))
    scaleY(var(--tw-scale-y, 1))
  `;
  
  element.style.transform = transformValue;
};

// Function to apply blur effect based on scroll position
export const applyScrollBlur = (
  element: HTMLElement | null, 
  scrollPosition: number, 
  threshold: number = 10,
  maxBlur: number = 10
): void => {
  if (!element) return;
  
  // Calculate blur amount based on scroll position
  let blurAmount = 0;
  if (scrollPosition > threshold) {
    blurAmount = Math.min((scrollPosition - threshold) / 10, maxBlur);
  }
  
  element.style.backdropFilter = `blur(${blurAmount}px)`;
  element.style.backdropFilter = `blur(${blurAmount}px)`; // Replaced WebkitBackdropFilter with backdropFilter
};
