import { Property } from './property.types';
import { User } from './auth.types';

export interface Booking {
  booking_id: number;
  user_id: number;
  property_id: number;
  host_id: number;
  check_in_date: string;
  check_out_date: string;
  guest_count: number;
  total_amount: number;
  status: BookingStatus;
  property: BookingProperty;
  guest: BookingUser;
  host: BookingUser;
  created_at: string;
  updated_at: string;
}

export interface BookingProperty {
  property_id: number;
  title: string;
  primary_image: string;
  address?: string;
  city?: string;
  description?: string;
  rent_per_day?: number;
}

export interface BookingUser {
  id: number;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  profile_image?: string;
}

export enum BookingStatus {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  CANCELLED = 'Cancelled',
  COMPLETED = 'Completed'
}

export interface CreateBookingRequest {
  property_id: number;
  start_date: string;
  end_date: string;
  guests: number;
}

export interface UpdateBookingStatusRequest {
  status: string;
}

// Simplified booking data from list endpoints (user trips & host bookings)
export interface BookingListItem {
  booking_id: number;
  user_ID: number;
  property_id: number;
  status: string;
  booking_date: string;
  start_date: string;
  end_date: string;
  total_amount: number;
  guests: number;
  title: string;
  city: string;
  rent_per_day: number;
  host_name?: string; // For guest view
  guest_name?: string; // For host view
  property_image: string;
}

export interface BookingResponse {
  bookings: Booking[];
}

export interface BookingListResponse {
  bookings: BookingListItem[];
}

// Simplified booking response from create booking API
export interface CreateBookingData {
  booking_id: number;
  user_ID: number;
  property_id: number;
  status: string;
  booking_date: string;
  start_date: string;
  end_date: string;
  total_amount: number;
  guests: number;
  title: string;
  city: string;
  rent_per_day: number;
  address: string;
  property_type: string;
  host_name: string | null;
  property_image: string;
  number_of_days: number;
}

export interface CreateBookingResponse {
  booking: CreateBookingData;
  message: string;
}

export interface UpdateBookingResponse {
  booking: {
    booking_id: number;
    status: BookingStatus;
    updated_at: string;
  };
  message: string;
}

export interface AvailabilityResponse {
  property_id: number;
  available: boolean;
  check_in_date: string;
  check_out_date: string;
  number_of_days: number;
  guests: number;
  max_guests: number;
  price_per_day: number;
  total_amount: number;
  conflicting_bookings: any[];
  upcoming_bookings: any[];
  property_details: {
    title: string;
    city: string;
    property_type: string;
  };
}

export interface PriceCalculationRequest {
  property_id: number;
  start_date: string;
  end_date: string;
  guests: number;
}

export interface PriceCalculationResponse {
  success: boolean;
  price_breakdown: {
    base_price_per_night: number;
    total_nights: number;
    subtotal: number;
    cleaning_fee: number;
    service_fee: number;
    taxes: number;
    total: number;
    currency: string;
  };
  available: boolean;
}

// New interface for booking detail API response
export interface BookingDetailData {
  booking_id: number;
  user_ID: number;
  property_id: number;
  status: string;
  booking_date: string;
  start_date: string;
  end_date: string;
  total_amount: number;
  guests: number;
  title: string;
  description: string;
  address: string;
  city: string;
  rent_per_day: number;
  property_type: string;
  guest: number;
  host_id: number;
  host_name: string;
  guest_name: string;
  property_images: Array<{
    image_url: string;
  }>;
}

export interface BookingDetailResponse {
  booking: BookingDetailData;
}
