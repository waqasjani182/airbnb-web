export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  profile_image?: string;
  created_at: string;
  address?: string;
}

// For API responses that use different field names
export interface UserProfile {
  user_ID: number;
  name: string;
  email: string;
  address?: string;
  phone_No?: string;
  profile_image?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  address: string;
  phone_No: string;
}

export interface AuthResponse {
  user: UserProfile;
  token: string;
  message?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface UpdateUserRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

// For backend API profile update (uses different field names)
export interface UpdateProfileRequest {
  name?: string;
  address?: string;
  phone_No?: string;
}

export interface UpdateProfileResponse {
  message: string;
  user: {
    user_ID: number;
    name: string;
    email: string;
    address?: string;
    phone_No?: string;
    profile_image?: string;
  };
}

export interface ChangePasswordRequest {
  new_password: string;
}

export interface UploadImageResponse {
  message: string;
  user: {
    user_ID: number;
    profile_image: string;
  };
}

// Utility function to transform UserProfile to User
export const transformUserProfile = (userProfile: UserProfile): User => {
  // Split name into first_name and last_name if available
  const nameParts = userProfile.name ? userProfile.name.split(' ') : ['', ''];
  const first_name = nameParts[0] || '';
  const last_name = nameParts.slice(1).join(' ') || '';

  return {
    id: userProfile.user_ID,
    first_name,
    last_name,
    email: userProfile.email,
    phone: userProfile.phone_No,
    profile_image: userProfile.profile_image,
    created_at: new Date().toISOString(), // Default value
    address: userProfile.address,
  };
};
