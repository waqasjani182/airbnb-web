import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { RootState } from '../../store';
import { updateUser } from '../../store/slices/authSlice';
import { Layout } from '../../components/layout';
import { Button, Input, Card, Loading } from '../../components/ui';
import { useUpdateProfileMutation } from '../../services/authApi';
import { useGetUserPropertiesQuery } from '../../services/propertyApi';
import { useGetUserBookingsQuery } from '../../services/bookingApi';
import { useErrorHandler } from '../../hooks';
import { getImageUrl } from '../../utils/helpers';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone_No: z.string().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const Profile: React.FC = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, token } = useSelector((state: RootState) => state.auth);
  const { handleError } = useErrorHandler();

  // State for handling image uploads
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);

  // API hooks
  const [updateUserProfile] = useUpdateProfileMutation();

  // Fetch user statistics
  const { data: userProperties } = useGetUserPropertiesQuery();

  const { data: userBookings } = useGetUserBookingsQuery(undefined, {
    skip: !user,
  });

  const propertiesCount = userProperties?.properties?.length || 0;
  const bookingsCount = userBookings?.bookings?.length || 0;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user ? `${user.first_name} ${user.last_name}`.trim() : '',
      phone_No: user?.phone || '',
      address: user?.address || '',
    },
  });

  // Debug form errors
  React.useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log('Form validation errors:', errors);
    }
  }, [errors]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      console.log('=== Profile Update Started ===');
      console.log('Form data:', data);
      console.log('Current user:', user);
      console.log('Selected image:', selectedImage);
      console.log('Token exists:', !!token);

      if (!user?.id) {
        console.error('No user ID found');
        toast.error('User not found. Please log in again.');
        return;
      }

      if (!token) {
        console.error('No authentication token found');
        toast.error('Authentication required. Please log in again.');
        return;
      }

      // Create FormData for backend API
      const formData = new FormData();

      // Add required fields
      formData.append('name', data.name.trim());
      console.log('Name:', data.name.trim());

      // Add optional fields only if they have values
      if (data.phone_No && data.phone_No.trim()) {
        formData.append('phone_No', data.phone_No.trim());
        console.log('Adding phone:', data.phone_No.trim());
      }

      if (data.address && data.address.trim()) {
        formData.append('address', data.address.trim());
        console.log('Adding address:', data.address.trim());
      }

      // Include selected image if available
      if (selectedImage) {
        formData.append('profile_image', selectedImage);
        console.log('Adding image:', selectedImage.name, selectedImage.size, 'bytes');
      }

      console.log('=== FormData Contents ===');
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(key, '(File):', value.name, value.size, 'bytes');
        } else {
          console.log(key, ':', value);
        }
      }

      console.log('=== Calling API ===');
      console.log('API URL: PUT /api/users/profile');
      console.log('Base URL:', import.meta.env.VITE_API_URL || 'http://localhost:3004');

      const result = await updateUserProfile(formData).unwrap();
      console.log('=== API Success ===');
      console.log('API response:', result);

      // Parse the response and update user data
      let updatedProfileImage = user.profile_image;

      if (result.user?.profile_image) {
        updatedProfileImage = result.user.profile_image;
        console.log('New profile image URL:', updatedProfileImage);
      }

      // Split name back into first_name and last_name for local state
      const nameParts = data.name.trim().split(' ');
      const first_name = nameParts[0] || '';
      const last_name = nameParts.slice(1).join(' ') || '';

      // Update user with the new data, preserving existing fields
      const updatedUser = {
        ...user,
        first_name,
        last_name,
        phone: data.phone_No || user.phone,
        address: data.address || user.address,
        profile_image: updatedProfileImage,
      };

      console.log('=== Updating Redux State ===');
      console.log('Updated user:', updatedUser);
      dispatch(updateUser(updatedUser));

      // Clear selected image after successful update
      setSelectedImage(null);

      toast.success(result.message || 'Profile updated successfully!');
      console.log('=== Profile Update Complete ===');

    } catch (error: any) {
      console.error('=== Profile Update Error ===');
      console.error('Error object:', error);
      console.error('Error status:', error?.status);
      console.error('Error data:', error?.data);
      console.error('Error message:', error?.message);

      let errorMessage = 'Failed to update profile. Please try again.';

      if (error?.status === 401) {
        errorMessage = 'Authentication failed. Please log in again.';
      } else if (error?.status === 403) {
        errorMessage = 'Permission denied. Please check your account.';
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      }

      handleError(error, errorMessage);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    // Set the selected image to be uploaded with the form
    setSelectedImage(file);
    toast.success('Image selected! Click "Save Changes" to update your profile.');
  };



  // Show loading state while user data is being fetched
  if (isAuthenticated && token && !user) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <Loading size="lg" text="Loading your profile..." />
          </div>
        </div>
      </Layout>
    );
  }

  // Show login message if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Please log in to view your profile</h1>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
          <p className="text-gray-600 mt-2">
            Manage your account information and preferences
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Picture */}
          <div className="lg:col-span-1">
            <Card>
              <div className="text-center">
                <div className="w-32 h-32 mx-auto bg-gray-300 rounded-full flex items-center justify-center mb-4 relative">
                  {selectedImage ? (
                    // Show preview of selected image
                    <img
                      src={URL.createObjectURL(selectedImage)}
                      alt="Preview"
                      className="w-32 h-32 rounded-full object-cover"
                    />
                  ) : user.profile_image ? (
                    // Show current profile image
                    <img
                      src={getImageUrl(user.profile_image)}
                      alt={`${user.first_name} ${user.last_name}`}
                      className="w-32 h-32 rounded-full object-cover"
                      onError={(e) => {
                        console.error('Profile image failed to load:', getImageUrl(user.profile_image));
                        console.error('Error details:', e);
                        // Try to load the image with a different approach
                        const img = e.target as HTMLImageElement;
                        if (!img.dataset.retried) {
                          img.dataset.retried = 'true';
                          // Try with a timestamp to bypass cache
                          const originalSrc = getImageUrl(user.profile_image);
                          const separator = originalSrc?.includes('?') ? '&' : '?';
                          img.src = `${originalSrc}${separator}t=${Date.now()}`;
                          console.log('Retrying with cache-busting URL:', img.src);
                        } else {
                          console.error('Image failed to load even after retry');
                          // Hide the image and show initials instead
                          img.style.display = 'none';
                        }
                      }}
                      onLoad={() => {
                        console.log('Profile image loaded successfully:', getImageUrl(user.profile_image));
                      }}
                    />
                  ) : (
                    // Show initials if no image
                    <span className="text-4xl font-bold text-gray-600">
                      {user.first_name[0]}{user.last_name[0]}
                    </span>
                  )}
                  {selectedImage && (
                    <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                      ✓
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {user.first_name} {user.last_name}
                </h3>
                <p className="text-gray-600">{user.email}</p>
                <div className="mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Host
                    </span>
                  </div>
                <div className="mt-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="profile-image-upload"
                  />
                  <label htmlFor="profile-image-upload" className="w-full">
                    <span className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 cursor-pointer w-full">
                      {selectedImage ? 'Change Selected Photo' : 'Select Photo'}
                    </span>
                  </label>
                  {selectedImage && (
                    <button
                      type="button"
                      onClick={() => setSelectedImage(null)}
                      className="mt-2 text-sm text-red-600 hover:text-red-700"
                    >
                      Remove selected photo
                    </button>
                  )}
                </div>
              </div>
            </Card>

            {/* Account Stats */}
            <Card className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Account Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Member since</span>
                  <span className="font-medium">
                    {new Date(user.created_at).getFullYear()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total bookings</span>
                  <span className="font-medium">{bookingsCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Properties listed</span>
                  <span className="font-medium">{propertiesCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total earnings</span>
                  <span className="font-medium">$0</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <Card>
              <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
              {selectedImage && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-700">
                    <strong>Image selected:</strong> {selectedImage.name} - Click "Save Changes" to update your profile with the new image.
                  </p>
                </div>
              )}

              <form
                onSubmit={(e) => {
                  console.log('Form submit event triggered');
                  handleSubmit(onSubmit)(e);
                }}
                className="space-y-6"
              >
                <Input
                  label="Full name"
                  {...register('name')}
                  error={errors.name?.message}
                />

                <Input
                  label="Phone number"
                  type="tel"
                  {...register('phone_No')}
                  error={errors.phone_No?.message}
                  helperText="Optional - helps with booking confirmations"
                />

                <Input
                  label="Address"
                  {...register('address')}
                  error={errors.address?.message}
                  helperText="Optional - helps with property listings"
                />

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => window.location.reload()}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={async () => {
                      console.log('=== Debug Info ===');
                      console.log('User:', user);
                      console.log('Token:', token);
                      console.log('Is authenticated:', isAuthenticated);
                      console.log('Form errors:', errors);
                      console.log('Is submitting:', isSubmitting);
                      console.log('Selected image:', selectedImage);

                      // Test image accessibility
                      if (user?.profile_image) {
                        const imageUrl = getImageUrl(user.profile_image);
                        console.log('=== Testing Image Accessibility ===');
                        console.log('Original profile_image:', user.profile_image);
                        console.log('Constructed URL:', imageUrl);

                        try {
                          // Test with fetch
                          const response = await fetch(imageUrl || '', { mode: 'cors' });
                          console.log('Fetch response status:', response.status);
                          console.log('Fetch response headers:', Object.fromEntries(response.headers.entries()));

                          if (response.ok) {
                            console.log('✅ Image is accessible via fetch');
                          } else {
                            console.log('❌ Image fetch failed:', response.statusText);
                          }
                        } catch (fetchError) {
                          console.error('❌ Fetch error:', fetchError);
                        }

                        // Test with Image object
                        const testImg = new Image();
                        testImg.crossOrigin = 'anonymous';
                        testImg.onload = () => {
                          console.log('✅ Image loaded successfully with Image object');
                        };
                        testImg.onerror = (imgError) => {
                          console.error('❌ Image object load failed:', imgError);
                        };
                        testImg.src = imageUrl || '';
                      }

                      toast('Check console for debug info');
                    }}
                  >
                    Debug
                  </Button>
                  <Button
                    type="submit"
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                    onClick={() => {
                      console.log('Save button clicked!');
                    }}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </Card>

            {/* Account Settings */}
            <Card className="mt-6">
              <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email notifications</h3>
                    <p className="text-sm text-gray-600">
                      Receive booking confirmations and updates
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Marketing emails</h3>
                    <p className="text-sm text-gray-600">
                      Receive special offers and travel inspiration
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </div>


              </div>
            </Card>

           
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
