import { apiSlice } from '../store/api/apiSlice';
import {
  Property,
  PropertyResponse,
  PropertySearchParams,
  CreatePropertyRequest,
  CreatePropertyResponse,
  UpdatePropertyRequest,
  UpdatePropertyResponse,
  DeletePropertyResponse,
  PropertyStatusResponse,
  SetMaintenanceRequest,
  SetMaintenanceResponse,
  ActivatePropertyResponse,
  TogglePropertyRequest,
  TogglePropertyResponse
} from '../types/property.types';

export const propertyApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/properties
    getProperties: builder.query<PropertyResponse, { page?: number; limit?: number; city?: string; property_type?: string }>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.append(key, value.toString());
          }
        });
        return `/api/properties?${searchParams.toString()}`;
      },
      providesTags: ['Property'],
    }),

    // GET /api/properties/{id}
    getPropertyById: builder.query<{ property: Property }, number>({
      query: (id) => `/api/properties/${id}`,
      providesTags: (result, error, id) => [{ type: 'Property', id }],
    }),

    // POST /api/properties
    createProperty: builder.mutation<CreatePropertyResponse, FormData>({
      query: (formData) => ({
        url: '/api/properties/',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Property'],
    }),

    // PUT /api/properties/{id}
    updateProperty: builder.mutation<UpdatePropertyResponse, { id: number; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/api/properties/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Property', id }, 'Property'],
    }),

    // DELETE /api/properties/{id}
    deleteProperty: builder.mutation<DeletePropertyResponse, number>({
      query: (id) => ({
        url: `/api/properties/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Property', id }, 'Property'],
    }),

    // GET /api/properties/search
    searchProperties: builder.query<PropertyResponse, PropertySearchParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();

        // Only add parameters that have values (not null, undefined, or empty string)
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, value.toString());
          }
        });

        return `/api/properties/search?${searchParams.toString()}`;
      },
      providesTags: ['Property'],
    }),

    // GET /api/users/properties
    getUserProperties: builder.query<{ properties: Property[] }, void>({
      query: () => '/api/users/properties',
      providesTags: ['Property'],
    }),

    // POST /api/properties/{id}/images - Upload single image
    uploadPropertyImage: builder.mutation<any, { id: number; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/api/properties/${id}/images`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Property', id }, 'Property'],
    }),

    // POST /api/properties/{id}/images/multiple - Upload multiple images
    uploadPropertyImages: builder.mutation<any, { id: number; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/api/properties/${id}/images/multiple`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Property', id }, 'Property'],
    }),

    // Property Status Management Endpoints

    // GET /api/properties/{id}/status
    getPropertyStatus: builder.query<PropertyStatusResponse, number>({
      query: (id) => `/api/properties/${id}/status`,
      providesTags: (result, error, id) => [{ type: 'Property', id }],
    }),

    // PUT /api/properties/{id}/maintenance
    setPropertyMaintenance: builder.mutation<SetMaintenanceResponse, { id: number; data: SetMaintenanceRequest }>({
      query: ({ id, data }) => ({
        url: `/api/properties/${id}/maintenance`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Property', id }, 'Property'],
    }),

    // PUT /api/properties/{id}/activate
    activateProperty: builder.mutation<ActivatePropertyResponse, number>({
      query: (id) => ({
        url: `/api/properties/${id}/activate`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Property', id }, 'Property'],
    }),

    // PUT /api/properties/{id}/toggle
    togglePropertyStatus: builder.mutation<TogglePropertyResponse, { id: number; data: TogglePropertyRequest }>({
      query: ({ id, data }) => ({
        url: `/api/properties/${id}/toggle`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Property', id }, 'Property'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPropertiesQuery,
  useGetPropertyByIdQuery,
  useCreatePropertyMutation,
  useUpdatePropertyMutation,
  useDeletePropertyMutation,
  useSearchPropertiesQuery,
  useGetUserPropertiesQuery,
  useUploadPropertyImageMutation,
  useUploadPropertyImagesMutation,
  useGetPropertyStatusQuery,
  useSetPropertyMaintenanceMutation,
  useActivatePropertyMutation,
  useTogglePropertyStatusMutation,
} = propertyApi;
