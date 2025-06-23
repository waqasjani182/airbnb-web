import { apiSlice } from '../store/api/apiSlice';
import { PropertyFacility, PropertyAmenity } from '../types/property.types';

export const facilitiesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/facilities
    getFacilities: builder.query<PropertyFacility[], void>({
      query: () => '/api/facilities',
    }),

    // GET /api/amenities
    getAmenities: builder.query<PropertyAmenity[], void>({
      query: () => '/api/amenities',
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetFacilitiesQuery,
  useGetAmenitiesQuery,
} = facilitiesApi;
