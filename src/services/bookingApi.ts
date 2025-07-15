import { apiSlice } from '../store/api/apiSlice';
import {
  Booking,
  BookingResponse,
  BookingListResponse,
  CreateBookingRequest,
  CreateBookingResponse,
  UpdateBookingStatusRequest,
  UpdateBookingResponse,
  AvailabilityResponse,
  PriceCalculationRequest,
  PriceCalculationResponse,
  BookingDetailResponse,
  BookingsByDateRangeParams,
  BookingsByDateRangeResponse
} from '../types/booking.types';

export const bookingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/bookings/user
    getUserBookings: builder.query<BookingListResponse, void>({
      query: () => '/api/bookings/user',
      providesTags: ['Booking'],
    }),

    // GET /api/bookings/host
    getHostBookings: builder.query<BookingListResponse, void>({
      query: () => '/api/bookings/host',
      providesTags: ['Booking'],
    }),

    // GET /api/bookings/{id}
    getBookingById: builder.query<BookingDetailResponse, number>({
      query: (id) => `/api/bookings/${id}`,
      providesTags: (result, error, id) => [{ type: 'Booking', id }],
    }),

    // POST /api/bookings
    createBooking: builder.mutation<CreateBookingResponse, CreateBookingRequest>({
      query: (bookingData) => ({
        url: '/api/bookings',
        method: 'POST',
        body: bookingData,
      }),
      invalidatesTags: ['Booking'],
    }),

    // PUT /api/bookings/{id}/status
    updateBookingStatus: builder.mutation<UpdateBookingResponse, { id: number; data: UpdateBookingStatusRequest }>({
      query: ({ id, data }) => ({
        url: `/api/bookings/${id}/status`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Booking', id }, 'Booking'],
    }),

    // GET /api/bookings/availability
    checkPropertyAvailability: builder.query<AvailabilityResponse, {
      propertyId: number;
      startDate: string;
      endDate: string;
      guests?: number;
    }>({
      query: ({ propertyId, startDate, endDate, guests }) => ({
        url: `/api/bookings/availability`,
        params: {
          property_id: propertyId,
          start_date: startDate,
          end_date: endDate,
          ...(guests && { guests }),
        },
      }),
      providesTags: (result, error, { propertyId }) => [{ type: 'Property', id: propertyId }],
    }),

    // POST /api/bookings/calculate-price
    calculateBookingPrice: builder.mutation<PriceCalculationResponse, PriceCalculationRequest>({
      query: (priceData) => ({
        url: '/api/bookings/calculate-price',
        method: 'POST',
        body: priceData,
      }),
    }),

    // GET /api/bookings/date-range - Get bookings with ratings by date range
    getBookingsByDateRange: builder.query<BookingsByDateRangeResponse, BookingsByDateRangeParams>({
      query: ({ from_date, to_date }) => ({
        url: '/api/bookings/date-range',
        params: {
          from_date,
          to_date,
        },
      }),
      providesTags: ['Booking'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetUserBookingsQuery,
  useGetHostBookingsQuery,
  useGetBookingByIdQuery,
  useCreateBookingMutation,
  useUpdateBookingStatusMutation,
  useCheckPropertyAvailabilityQuery,
  useLazyCheckPropertyAvailabilityQuery,
  useCalculateBookingPriceMutation,
  useGetBookingsByDateRangeQuery,
} = bookingApi;
