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
  status?: 'active' | 'maintenance';
  is_active?: boolean;
  can_accept_bookings?: boolean;
  maintenance_reason?: string;
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
  min_rating?: number;
  max_rating?: number;
  check_in_date?: string;
  check_out_date?: string;
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

// Property Status Management Types
export interface PropertyStatusResponse {
  property_id: number;
  title: string;
  status: 'active' | 'maintenance';
  is_active: boolean;
  can_accept_bookings: boolean;
}

export interface SetMaintenanceRequest {
  maintenance_reason: string;
}

export interface SetMaintenanceResponse {
  message: string;
  property: Property;
  maintenance_reason: string;
}

export interface ActivatePropertyResponse {
  message: string;
  property: Property;
}

export interface TogglePropertyRequest {
  is_active: boolean;
}

export interface TogglePropertyResponse {
  message: string;
  property: Property;
}

// New types for Properties by City with Ratings endpoint
export interface PropertyWithRatings {
  property_id: number;
  user_id: number;
  property_type: string;
  rent_per_day: number;
  address: string;
  rating: number;
  city: string;
  longitude: number;
  latitude: number;
  title: string;
  description: string;
  guest: number;
  status: string;
  is_active: boolean;
  host_name: string;
  host_profile_image: string;
  property_image: string;
  total_rating: number;
  review_count: number;
  avg_user_rating: number;
  avg_owner_rating: number;
  images: string[];
  facilities: Array<{
    facility_id: number;
    facility_type: string;
  }>;
}

export interface PropertiesByCityResponse {
  city: string;
  properties: PropertyWithRatings[];
  total_count: number;
  average_city_rating: string;
}
