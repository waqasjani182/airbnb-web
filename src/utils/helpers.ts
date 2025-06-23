import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (amount: number, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatDate = (date: string | Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};

export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

export const capitalizeFirst = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string) => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

/**
 * Constructs a full image URL from a relative path or returns the URL as-is if it's already absolute
 * @param imagePath - The image path from the backend (could be relative or absolute)
 * @returns Full image URL
 */
export const getImageUrl = (imagePath: string | undefined): string | undefined => {
  if (!imagePath) return undefined;

  // If the path is already a full URL (starts with http), check if we should use proxy
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    // In development, if the image is from localhost:3004, use the proxy instead
    if (import.meta.env.DEV && imagePath.includes('localhost:3004/uploads')) {
      const uploadPath = imagePath.split('/uploads')[1];
      return `/uploads${uploadPath}`;
    }
    return imagePath;
  }

  // For relative paths, use proxy in development, full URL in production
  if (import.meta.env.DEV) {
    // In development, use the Vite proxy
    if (imagePath.startsWith('/uploads')) {
      return imagePath; // Already starts with /uploads, use as-is for proxy
    }
    if (imagePath.startsWith('/')) {
      return imagePath; // Use as-is for proxy
    }
    return `/uploads/${imagePath}`; // Add /uploads prefix for proxy
  } else {
    // In production, use full URL
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3004';

    if (imagePath.startsWith('/')) {
      return `${API_BASE_URL}${imagePath}`;
    }
    return `${API_BASE_URL}/${imagePath}`;
  }
};

/**
 * Alternative image URL getter that tries to work around CORS issues
 * @param imagePath - The image path from the backend
 * @returns Image URL with potential CORS workarounds
 */
export const getImageUrlWithCorsWorkaround = (imagePath: string | undefined): string | undefined => {
  const baseUrl = getImageUrl(imagePath);
  if (!baseUrl) return undefined;

  // For development, try to use the same origin if possible
  if (baseUrl.includes('localhost:3004') && window.location.hostname === 'localhost') {
    // Check if we're on a different port and try to proxy through the dev server
    if (window.location.port !== '3004') {
      console.log('Attempting CORS workaround for image:', baseUrl);
      // You could implement a proxy here or use a different approach
    }
  }

  return baseUrl;
};

// Re-export error handling utilities
export * from './errorHandling';
