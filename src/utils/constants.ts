export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3004';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SEARCH: '/search',
  PROPERTY_DETAILS: '/property/:id',
  UPLOAD_PROPERTY: '/upload-property',
  MY_PROPERTIES: '/my-properties',
  BOOKINGS: '/bookings',
  USER_BOOKINGS: '/bookings',
  HOST_BOOKINGS: '/host/bookings',
  PROPERTY_BOOKINGS: '/property-bookings',
  BOOKING_DETAILS: '/bookings/:id',
  BOOKING_CONFIRMATION: '/booking-confirmation',
  PERSONAL_INFO: '/profile/personal-info',
  SETTINGS: '/profile/settings',
} as const;

export const PROPERTY_TYPES = [
  'House',
  'Flat',
  'Room',
] as const;

export const BOOKING_STATUS = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  CANCELLED: 'Cancelled',
  COMPLETED: 'Completed',
} as const;

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;
