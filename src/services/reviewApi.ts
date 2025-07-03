import { apiSlice } from '../store/api/apiSlice';
import {
  Review,
  ReviewResponse,
  ReviewsResponse,
  PropertyReviewsResponse,
  UserReviewsResponse,
  HostReviewsResponse,
  CreateGuestReviewRequest,
  CreateHostReviewRequest,
  UpdateGuestReviewRequest,
  UpdateHostReviewRequest,
} from '../types';

export const reviewApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/reviews/property/{propertyId} - Get all reviews for a property (public)
    getPropertyReviews: builder.query<PropertyReviewsResponse, number>({
      query: (propertyId) => `/api/reviews/property/${propertyId}`,
      providesTags: (result, error, propertyId) => [
        { type: 'Review', id: `property-${propertyId}` },
      ],
    }),

    // GET /api/reviews/user - Get all reviews by current user (legacy - same as guest)
    getUserReviews: builder.query<UserReviewsResponse, void>({
      query: () => '/api/reviews/user',
      providesTags: ['Review'],
    }),

    // GET /api/reviews/guest - Get all reviews written by current user as guest
    getGuestReviews: builder.query<UserReviewsResponse, void>({
      query: () => '/api/reviews/guest',
      providesTags: ['Review'],
    }),

    // GET /api/reviews/host - Get all reviews received by current user as host
    getHostReviews: builder.query<HostReviewsResponse, void>({
      query: () => '/api/reviews/host',
      providesTags: ['Review'],
    }),

    // POST /api/reviews - Create a new guest review (property + host review)
    createGuestReview: builder.mutation<ReviewResponse, CreateGuestReviewRequest>({
      query: (reviewData) => ({
        url: '/api/reviews',
        method: 'POST',
        body: reviewData,
      }),
      invalidatesTags: (result, error, { property_id, booking_id }) => [
        'Review',
        { type: 'Review', id: `property-${property_id}` },
        { type: 'Booking', id: booking_id },
        'Property',
      ],
    }),

    // POST /api/reviews/host - Create a new host review (guest review)
    createHostReview: builder.mutation<ReviewResponse, CreateHostReviewRequest>({
      query: (reviewData) => ({
        url: '/api/reviews/host',
        method: 'POST',
        body: reviewData,
      }),
      invalidatesTags: (result, error, { booking_id }) => [
        'Review',
        { type: 'Booking', id: booking_id },
      ],
    }),

    // PUT /api/reviews/{bookingId} - Update a guest review
    updateGuestReview: builder.mutation<ReviewResponse, { bookingId: number; reviewData: UpdateGuestReviewRequest }>({
      query: ({ bookingId, reviewData }) => ({
        url: `/api/reviews/${bookingId}`,
        method: 'PUT',
        body: reviewData,
      }),
      invalidatesTags: (result, error, { bookingId }) => [
        'Review',
        { type: 'Booking', id: bookingId },
        'Property',
      ],
    }),

    // PUT /api/reviews/host/{bookingId} - Update a host review
    updateHostReview: builder.mutation<ReviewResponse, { bookingId: number; reviewData: UpdateHostReviewRequest }>({
      query: ({ bookingId, reviewData }) => ({
        url: `/api/reviews/host/${bookingId}`,
        method: 'PUT',
        body: reviewData,
      }),
      invalidatesTags: (result, error, { bookingId }) => [
        'Review',
        { type: 'Booking', id: bookingId },
      ],
    }),

    // DELETE /api/reviews/{bookingId} - Delete a review
    deleteReview: builder.mutation<{ message: string }, number>({
      query: (bookingId) => ({
        url: `/api/reviews/${bookingId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, bookingId) => [
        'Review',
        { type: 'Booking', id: bookingId },
        'Property',
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPropertyReviewsQuery,
  useGetUserReviewsQuery,
  useGetGuestReviewsQuery,
  useGetHostReviewsQuery,
  useCreateGuestReviewMutation,
  useCreateHostReviewMutation,
  useUpdateGuestReviewMutation,
  useUpdateHostReviewMutation,
  useDeleteReviewMutation,
} = reviewApi;
