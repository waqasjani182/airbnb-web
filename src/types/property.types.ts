import { User } from './auth.types';

export interface Property {
  property_id: number;
  user_id: number;
  title: string;
  description: string;
  property_type: string;
  rent_per_day: number;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  guest: number;
  rating?: number | null;
  review_count?: number;
  booking_count?: number;
  primary_image?: string;
  avg_rating?: number;
  host_name?: string;
  total_bedrooms?: number;
  total_rooms?: number;
  total_beds?: number;
  images: PropertyImage[];
  facilities: PropertyFacility[];
  reviews: PropertyReview[];
  created_at?: string;
  updated_at?: string;
}

export interface PropertyImage {
  picture_id: number;
  property_id: number;
  image_url: string;
  is_primary?: boolean;
}

export interface PropertyFacility {
  facility_id: number;
  facility_type: string;
}

export interface PropertyAmenity {
  amenity_id: number;
  name: string;
  icon?: string;
}

export interface PropertyReview {
  review_id: number;
  user_id: number;
  property_id: number;
  rating: number;
  comment: string;
  user_name: string;
  user_image?: string;
  created_at: string;
}

export interface PropertySearchParams {
  query?: string;
  city?: string;
  min_price?: number;
  max_price?: number;
  property_type?: string;
  bedrooms?: number;
  page?: number;
  limit?: number;
}

export interface PropertyResponse {
  properties: Property[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface CreatePropertyRequest {
  title: string;
  description: string;
  property_type: string;
  rent_per_day: number;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  guest: number;
  facilities?: number[];
  total_bedrooms?: number; // For House
  total_rooms?: number;    // For Flat
  total_beds?: number;     // For Room
}

export interface UpdatePropertyRequest {
  title?: string;
  description?: string;
  rent_per_day?: number;
  guest_count?: number;
}

export interface CreatePropertyResponse {
  message: string;
  property: Property;
}

export interface UpdatePropertyResponse {
  property: Partial<Property>;
  message: string;
}

export interface DeletePropertyResponse {
  message: string;
}
