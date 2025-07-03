export interface Review {
  booking_id: number;
  user_ID: number;
  property_id: number;
  user_rating?: number;
  user_review?: string;
  owner_rating?: number;
  owner_review?: string;
  property_rating: number;
  property_review: string;
  user_name?: string;
  name?: string;
  property_title?: string;
  property_city?: string;
  property_image?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateGuestReviewRequest {
  booking_id: number;
  property_id: number;
  property_rating?: number;
  property_review?: string;
  user_rating?: number; // Host rating
  user_review?: string; // Host review
}

export interface CreateHostReviewRequest {
  booking_id: number;
  owner_rating: number;
  owner_review: string;
}

export interface UpdateGuestReviewRequest {
  property_rating?: number;
  property_review?: string;
  user_rating?: number;
  user_review?: string;
}

export interface UpdateHostReviewRequest {
  owner_rating: number;
  owner_review: string;
}

export interface ReviewResponse {
  message: string;
  review: Review;
}

export interface ReviewsResponse {
  reviews: Review[];
}

// For property reviews display
export interface PropertyReviewsResponse {
  reviews: Review[];
  total: number;
  average_rating: number;
}

// For user reviews management
export interface UserReviewsResponse {
  reviews: Review[];
  total: number;
}

// For host reviews management
export interface HostReviewsResponse {
  reviews: Review[];
  total: number;
}
