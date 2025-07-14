import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { RootState } from '../../store';
import { Layout } from '../../components/layout';
import { Button, Input, Card, Loading, LocationPicker } from '../../components/ui';
import { useUpdatePropertyMutation, useGetPropertyByIdQuery } from '../../services/propertyApi';
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

const EditProperty: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { handleError } = useErrorHandler();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Debug auth state
  console.log('Auth state:', { user, isAuthenticated });

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<number[]>([]);

  // Fetch property data
  const {
    data: propertyResponse,
    isLoading: isLoadingProperty,
    error: propertyError
  } = useGetPropertyByIdQuery(Number(id), {
    skip: !id,
  });

  // Fetch facilities
  const {
    data: facilitiesData,
    isLoading: isLoadingFacilities,
  } = useGetFacilitiesQuery();

  const [updateProperty, { isLoading: isUpdating }] = useUpdatePropertyMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
  });

  const watchedPropertyType = watch('property_type');

  // Populate form with existing property data
  useEffect(() => {
    if (propertyResponse?.property) {
      const property = propertyResponse.property;
      
      // Reset form with property data
      reset({
        title: property.title,
        description: property.description,
        property_type: property.property_type,
        rent_per_day: property.rent_per_day,
        address: property.address,
        city: property.city,
        latitude: property.latitude,
        longitude: property.longitude,
        guest: property.guest,
        total_bedrooms: property.total_bedrooms,
        total_rooms: property.total_rooms,
        total_beds: property.total_beds,
      });

      // Set existing images
      setExistingImages(property.images || []);
      
      // Set selected facilities
      const facilityIds = property.facilities?.map(f => f.facility_id) || [];
      setSelectedFacilities(facilityIds);
    }
  }, [propertyResponse, reset]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const totalImages = existingImages.length - imagesToDelete.length + selectedImages.length + files.length;
    
    if (totalImages > 10) {
      toast.error('You can upload maximum 10 images');
      return;
    }
    setSelectedImages(prev => [...prev, ...files]);
  };

  const handleRemoveNewImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (imageId: number) => {
    setImagesToDelete(prev => [...prev, imageId]);
  };

  const handleRestoreExistingImage = (imageId: number) => {
    setImagesToDelete(prev => prev.filter(id => id !== imageId));
  };

  const handleFacilityToggle = (facilityId: number) => {
    setSelectedFacilities(prev =>
      prev.includes(facilityId)
        ? prev.filter(id => id !== facilityId)
        : [...prev, facilityId]
    );
  };

  const onSubmit = async (data: PropertyFormData) => {
    if (!id) {
      toast.error('Property ID is required');
      return;
    }

    try {
      const formData = new FormData();

      // Add basic property data
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('property_type', data.property_type);
      formData.append('rent_per_day', data.rent_per_day.toString());
      formData.append('address', data.address);
      formData.append('city', data.city);
      formData.append('latitude', data.latitude.toString());
      formData.append('longitude', data.longitude.toString());
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

      // Add facilities
      selectedFacilities.forEach(facilityId => {
        formData.append('facilities', facilityId.toString());
      });

      // Add new images
      selectedImages.forEach(image => {
        formData.append('property_images', image);
      });

      // Add images to delete
      if (imagesToDelete.length > 0) {
        formData.append('images_to_delete', JSON.stringify(imagesToDelete));
      }

      const result = await updateProperty({ id: Number(id), data: formData }).unwrap();

      toast.success(result.message || 'Property updated successfully!');
      navigate(ROUTES.MY_PROPERTIES);
    } catch (error: any) {
      handleError(error, 'Failed to update property. Please try again.');
    }
  };

  if (isLoadingProperty || isLoadingFacilities || !user) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Loading size="lg" text="Loading property details..." />
        </div>
      </Layout>
    );
  }

  if (propertyError || !propertyResponse?.property) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Property not found</h1>
            <p className="text-gray-600 mt-2">
              The property you are trying to edit does not exist or you don't have permission to edit it.
            </p>
            <Button 
              onClick={() => navigate(ROUTES.MY_PROPERTIES)}
              className="mt-4"
            >
              Back to My Properties
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const property = propertyResponse.property;

  // Debug logging
  console.log('Current user:', user);
  console.log('Property user_id:', property.user_id);
  console.log('User id:', user?.id);

  // Check if user owns this property
  const isOwner = property.user_id === user?.id;
  console.log('Ownership check:', {
    propertyUserId: property.user_id,
    currentUserId: user?.id,
    isOwner
  });

  // Temporarily disable ownership check for debugging
  if (false && !isOwner) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
            <p className="text-gray-600 mt-2">
              You don't have permission to edit this property.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Property User ID: {property.user_id}, Your User ID: {user?.id}
            </p>
            <Button
              onClick={() => navigate(ROUTES.MY_PROPERTIES)}
              className="mt-4"
            >
              Back to My Properties
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <button
              onClick={() => navigate(ROUTES.MY_PROPERTIES)}
              className="hover:text-gray-700"
            >
              My Properties
            </button>
            <span>/</span>
            <span>Edit Property</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Property</h1>
          <p className="text-gray-600 mt-2">
            Update your property details and manage your listing
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Input
                  label="Property Title"
                  {...register('title')}
                  error={errors.title?.message}
                  placeholder="Enter a descriptive title for your property"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                  placeholder="Describe your property, amenities, and what makes it special"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type
                </label>
                <select
                  {...register('property_type')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
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

              <div>
                <Input
                  label="Rent per Day ($)"
                  type="number"
                  {...register('rent_per_day', { valueAsNumber: true })}
                  error={errors.rent_per_day?.message}
                  placeholder="0"
                />
              </div>

              <div>
                <Input
                  label="Maximum Guests"
                  type="number"
                  {...register('guest', { valueAsNumber: true })}
                  error={errors.guest?.message}
                  placeholder="1"
                />
              </div>

              {/* Property type specific fields */}
              {watchedPropertyType === 'House' && (
                <div>
                  <Input
                    label="Total Bedrooms"
                    type="number"
                    {...register('total_bedrooms', { valueAsNumber: true })}
                    error={errors.total_bedrooms?.message}
                    placeholder="0"
                  />
                </div>
              )}

              {watchedPropertyType === 'Flat' && (
                <div>
                  <Input
                    label="Total Rooms"
                    type="number"
                    {...register('total_rooms', { valueAsNumber: true })}
                    error={errors.total_rooms?.message}
                    placeholder="0"
                  />
                </div>
              )}

              {watchedPropertyType === 'Room' && (
                <div>
                  <Input
                    label="Total Beds"
                    type="number"
                    {...register('total_beds', { valueAsNumber: true })}
                    error={errors.total_beds?.message}
                    placeholder="0"
                  />
                </div>
              )}
            </div>
          </Card>

          {/* Location */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Location</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Input
                  label="Address"
                  {...register('address')}
                  error={errors.address?.message}
                  placeholder="Enter the full address"
                />
              </div>

              <div>
                <Input
                  label="City"
                  {...register('city')}
                  error={errors.city?.message}
                  placeholder="Enter city name"
                />
              </div>

              <div className="md:col-span-2">
                <LocationPicker
                  onLocationSelect={(lat, lng) => {
                    setValue('latitude', lat);
                    setValue('longitude', lng);
                  }}
                  initialLat={watch('latitude')}
                  initialLng={watch('longitude')}
                />
                {(errors.latitude || errors.longitude) && (
                  <p className="mt-1 text-sm text-red-600">
                    Please select a valid location on the map
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Facilities */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Facilities</h2>

            {facilitiesData?.facilities && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {facilitiesData.facilities.map((facility) => (
                  <label
                    key={facility.facility_id}
                    className="flex items-center space-x-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedFacilities.includes(facility.facility_id)}
                      onChange={() => handleFacilityToggle(facility.facility_id)}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">{facility.facility_type}</span>
                  </label>
                ))}
              </div>
            )}
          </Card>

          {/* Images */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Property Images</h2>

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Current Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {existingImages.map((image) => (
                    <div key={image.picture_id} className="relative">
                      <img
                        src={image.image_url}
                        alt="Property"
                        className={`w-full h-32 object-cover rounded-lg ${
                          imagesToDelete.includes(image.picture_id)
                            ? 'opacity-50 grayscale'
                            : ''
                        }`}
                      />
                      {imagesToDelete.includes(image.picture_id) ? (
                        <button
                          type="button"
                          onClick={() => handleRestoreExistingImage(image.picture_id)}
                          className="absolute top-2 right-2 bg-green-600 text-white rounded-full p-1 hover:bg-green-700"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingImage(image.picture_id)}
                          className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                      {image.is_primary && (
                        <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                          Primary
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images */}
            {selectedImages.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">New Images to Upload</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {selectedImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt="New property"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveNewImage(index)}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload New Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add More Images (Max 10 total)
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
              />
              <p className="mt-1 text-sm text-gray-500">
                Current: {existingImages.length - imagesToDelete.length + selectedImages.length} / 10 images
              </p>
            </div>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(ROUTES.MY_PROPERTIES)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isUpdating}
              disabled={isUpdating}
            >
              {isUpdating ? 'Updating...' : 'Update Property'}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditProperty;
