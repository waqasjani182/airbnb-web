import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { RootState } from '../../store';
import { Layout } from '../../components/layout';
import { Button, Input, Card, Loading, LocationPicker } from '../../components/ui';
import { useCreatePropertyMutation } from '../../services/propertyApi';
import { useGetFacilitiesQuery } from '../../services/facilitiesApi';
import { useErrorHandler } from '../../hooks';
import { PROPERTY_TYPES, ROUTES } from '../../utils/constants';

const propertySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  property_type: z.string().min(1, 'Please select a property type'),
  rent_per_day: z.number().min(1, 'Rent per day must be at least $1'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  latitude: z.number().min(-90).max(90, 'Invalid latitude'),
  longitude: z.number().min(-180).max(180, 'Invalid longitude'),
  guest: z.number().min(1, 'Must accommodate at least 1 guest'),
  facilities: z.array(z.number()).optional(),
  total_bedrooms: z.number().optional(),
  total_rooms: z.number().optional(),
  total_beds: z.number().optional(),
});

type PropertyFormData = z.infer<typeof propertySchema>;

const UploadProperty: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { handleError } = useErrorHandler();
  
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<number[]>([]);
  
  const [createProperty, { isLoading: isCreating }] = useCreatePropertyMutation();
  const { data: facilities, isLoading: isLoadingFacilities } = useGetFacilitiesQuery();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: '',
      description: '',
      property_type: '',
      rent_per_day: 0,
      address: '',
      city: '',
      latitude: 0,
      longitude: 0,
      guest: 1,
      facilities: [],
      total_bedrooms: undefined,
      total_rooms: undefined,
      total_beds: undefined,
    },
  });



  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length + selectedImages.length > 10) {
      toast.error('You can upload maximum 10 images');
      return;
    }
    setSelectedImages(prev => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleFacilityToggle = (facilityId: number) => {
    setSelectedFacilities(prev => {
      const newFacilities = prev.includes(facilityId)
        ? prev.filter(id => id !== facilityId)
        : [...prev, facilityId];
      setValue('facilities', newFacilities);
      return newFacilities;
    });
  };

  const handleLocationChange = (location: {
    address: string;
    city: string;
    latitude: number;
    longitude: number;
  }) => {
    setValue('address', location.address);
    setValue('city', location.city);
    setValue('latitude', location.latitude);
    setValue('longitude', location.longitude);
  };

  const onSubmit = async (data: PropertyFormData) => {
    try {
      if (selectedImages.length === 0) {
        toast.error('Please upload at least one image');
        return;
      }

      const formData = new FormData();

      // Add basic property data
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('address', data.address);
      formData.append('city', data.city);
      formData.append('latitude', data.latitude.toString());
      formData.append('longitude', data.longitude.toString());
      formData.append('rent_per_day', data.rent_per_day.toString());
      formData.append('property_type', data.property_type);
      formData.append('guest', data.guest.toString());

      // Add property type specific fields
      const propertyType = data.property_type;
      if (propertyType === 'House' && data.total_bedrooms) {
        formData.append('total_bedrooms', data.total_bedrooms.toString());
      }
      if (propertyType === 'Flat' && data.total_rooms) {
        formData.append('total_rooms', data.total_rooms.toString());
      }
      if (propertyType === 'Room' && data.total_beds) {
        formData.append('total_beds', data.total_beds.toString());
      }

      // Add facilities as array format that backend expects
      selectedFacilities.forEach(facilityId => {
        formData.append('facilities', facilityId.toString());
      });

      // Add images with correct field name for backend
      selectedImages.forEach(image => {
        formData.append('property_images', image);
      });

      const result = await createProperty(formData).unwrap();

      toast.success(result.message || 'Property created successfully!');
      navigate(ROUTES.MY_PROPERTIES);
    } catch (error: any) {
      handleError(error, 'Failed to create property. Please try again.');
    }
  };

  if (isLoadingFacilities) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Loading size="lg" text="Loading form data..." />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Upload Your Property</h1>
          <p className="text-gray-600 mt-2">
            Share your space with travelers from around the world
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <h2 className="text-xl font-semibold mb-6">Basic Information</h2>
            <div className="space-y-6">
              <Input
                label="Property Title"
                {...register('title')}
                error={errors.title?.message}
                placeholder="e.g., Beautiful Beachfront Villa"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Describe your property, its features, and what makes it special..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Type
                  </label>
                  <select
                    {...register('property_type')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select property type</option>
                    {PROPERTY_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.property_type && (
                    <p className="mt-1 text-sm text-red-600">{errors.property_type.message}</p>
                  )}
                </div>

                <Input
                  label="Guest Count"
                  type="number"
                  min="1"
                  {...register('guest', { valueAsNumber: true })}
                  error={errors.guest?.message}
                />
              </div>

              <Input
                label="Rent per Day ($)"
                type="number"
                min="1"
                step="0.01"
                {...register('rent_per_day', { valueAsNumber: true })}
                error={errors.rent_per_day?.message}
              />

              {/* Property Type Specific Fields */}
              {watch('property_type') === 'House' && (
                <Input
                  label="Total Bedrooms"
                  type="number"
                  min="1"
                  {...register('total_bedrooms', { valueAsNumber: true })}
                  error={errors.total_bedrooms?.message}
                />
              )}

              {watch('property_type') === 'Flat' && (
                <Input
                  label="Total Rooms"
                  type="number"
                  min="1"
                  {...register('total_rooms', { valueAsNumber: true })}
                  error={errors.total_rooms?.message}
                />
              )}

              {watch('property_type') === 'Room' && (
                <Input
                  label="Total Beds"
                  type="number"
                  min="1"
                  {...register('total_beds', { valueAsNumber: true })}
                  error={errors.total_beds?.message}
                />
              )}
            </div>
          </Card>

          {/* Location */}
          <Card>
            <h2 className="text-xl font-semibold mb-6">Location</h2>
            <LocationPicker
              onLocationChange={handleLocationChange}
              initialLocation={{
                address: watch('address'),
                city: watch('city'),
                latitude: watch('latitude'),
                longitude: watch('longitude'),
              }}
            />
            {(errors.address || errors.city || errors.latitude || errors.longitude) && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">
                  Please select a valid location using the map or search above.
                </p>
              </div>
            )}
          </Card>

          {/* Images */}
          <Card>
            <h2 className="text-xl font-semibold mb-6">Property Images</h2>
            <div className="space-y-4">
              <div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="property-images"
                />
                <label htmlFor="property-images">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary-500">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600">
                      <span className="font-medium text-primary-600">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each (max 10 images)</p>
                  </div>
                </label>
              </div>

              {selectedImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Property ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Facilities */}
          <Card>
            <h2 className="text-xl font-semibold mb-6">Facilities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {facilities?.map((facility) => (
                <label key={facility.facility_id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedFacilities.includes(facility.facility_id)}
                    onChange={() => handleFacilityToggle(facility.facility_id)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">{facility.facility_type}</span>
                </label>
              ))}
            </div>
          </Card>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(ROUTES.DASHBOARD)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isCreating}
              disabled={isCreating}
            >
              Create Property
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default UploadProperty;
