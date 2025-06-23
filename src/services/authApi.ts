import { apiSlice } from '../store/api/apiSlice';
import {
  LoginRequest,
  SignupRequest,
  AuthResponse,
  UserProfile,
  UpdateProfileRequest,
  ChangePasswordRequest,
  UpdateProfileResponse
} from '../types/auth.types';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // POST /api/auth/login
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/api/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),

    // POST /api/auth/register
    register: builder.mutation<AuthResponse, SignupRequest>({
      query: (userData) => ({
        url: '/api/auth/register',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),

    // GET /api/auth/me
    getCurrentUser: builder.query<UserProfile, void>({
      query: () => '/api/auth/me',
      providesTags: ['User'],
    }),

    // PUT /api/users/profile - Update profile with optional image
    updateProfile: builder.mutation<UpdateProfileResponse, FormData>({
      query: (formData) => ({
        url: '/api/users/profile',
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['User'],
    }),

    // PUT /api/users/change-password - Change password
    changePassword: builder.mutation<{ message: string }, ChangePasswordRequest>({
      query: (passwordData) => ({
        url: '/api/users/change-password',
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: passwordData,
      }),
      invalidatesTags: ['User'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetCurrentUserQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = authApi;
