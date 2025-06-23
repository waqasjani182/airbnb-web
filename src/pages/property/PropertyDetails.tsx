import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Layout } from '../../components/layout';
import { Button, Card, Badge, Loading } from '../../components/ui';
import BookingForm from '../../components/booking/BookingForm';
import { formatCurrency } from '../../utils/helpers';
import { useGetPropertyByIdQuery } from '../../services/propertyApi';
import { ROUTES } from '../../utils/constants';

// Helper function to get facility icons
const getFacilityIcon = (facilityType: string): string => {
  const iconMap: { [key: string]: string } = {
    'WiFi': '📶',
    'Air Conditioning': '❄️',
    'Kitchen': '🍳',
    'Parking': '🚗',
    'Pool': '🏊',
    'Gym': '💪',
    'Laundry': '🧺',
    'TV': '📺',
    'Heating': '🔥',
    'Balcony': '🏡',
  };
  return iconMap[facilityType] || '🏠';
};

const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const {
    data: response,
    isLoading,
    error
  } = useGetPropertyByIdQuery(Number(id), {
    skip: !id,
  });

  const property = response?.property;

  // Debug logging
  React.useEffect(() => {
    if (response) {
      console.log('API Response:', response);
      console.log('Property data:', property);
      console.log('Images array:', property?.images);
    }
  }, [response, property]);

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Loading size="lg" text="Loading property details..." />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Property not found</h1>
            <p className="text-gray-600 mt-2">
              {(error as any)?.data?.message || 'The property you are looking for does not exist.'}
            </p>
            <Link to={ROUTES.SEARCH}>
              <Button className="mt-4">Back to Search</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (!property) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Property not found</h1>
            <Link to={ROUTES.SEARCH}>
              <Button className="mt-4">Back to Search</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
            <Badge variant="default">{property.property_type}</Badge>
          </div>
          <div className="flex items-center space-x-4 text-gray-600">
            <span>📍 {property.address}, {property.city}</span>
            <span>👥 {property.guest} guests</span>
            {property.host_name && (
              <span>🏠 Hosted by {property.host_name}</span>
            )}
            {property.rating && property.rating > 0 && (
              <span>⭐ {property.rating} ({property.review_count || 0} reviews)</span>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Images */}
            <div className="mb-8">
              {property.images && property.images.length > 0 ? (
                <>
                  <img
                    src={property.images[0].image_url}
                    alt={property.title}
                    className="w-full h-96 object-cover rounded-lg mb-4"
                    crossOrigin="anonymous"
                    onError={(e) => {
                      console.error('Failed to load main image:', property.images[0].image_url);
                      // Create a placeholder with property info
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      const placeholder = document.createElement('div');
                      placeholder.className = 'w-full h-96 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg mb-4 flex items-center justify-center text-white';
                      placeholder.innerHTML = `
                        <div class="text-center">
                          <div class="text-6xl mb-4">🏠</div>
                          <div class="text-xl font-semibold">${property.title}</div>
                          <div class="text-sm opacity-75 mt-2">${property.property_type} in ${property.city}</div>
                        </div>
                      `;
                      target.parentNode?.insertBefore(placeholder, target);
                    }}
                  />
                  {property.images.length > 1 && (
                    <div className="grid grid-cols-3 gap-4">
                      {property.images.slice(1, 4).map((image, index) => (
                        <img
                          key={image.picture_id}
                          src={image.image_url}
                          alt={`${property.title} - Image ${index + 2}`}
                          className="w-full h-32 object-cover rounded-lg"
                          crossOrigin="anonymous"
                          onError={(e) => {
                            console.error('Failed to load thumbnail:', image.image_url);
                            const target = e.currentTarget;
                            target.style.display = 'none';
                            const placeholder = document.createElement('div');
                            placeholder.className = 'w-full h-32 bg-gradient-to-br from-gray-300 to-gray-400 rounded-lg flex items-center justify-center text-gray-600';
                            placeholder.innerHTML = `
                              <div class="text-center">
                                <div class="text-2xl">🖼️</div>
                                <div class="text-xs mt-1">Image ${index + 2}</div>
                              </div>
                            `;
                            target.parentNode?.insertBefore(placeholder, target);
                          }}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-96 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-center text-gray-600">
                    <div className="text-6xl mb-4">🏠</div>
                    <div className="text-xl font-semibold">{property.title}</div>
                    <div className="text-sm opacity-75 mt-2">No images available</div>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <Card className="mb-8">
              <h2 className="text-xl font-semibold mb-4">About this place</h2>
              <p className="text-gray-700 leading-relaxed mb-6">{property.description}</p>

              {/* Property Details */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Property Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-2">🏠</div>
                    <div className="text-sm text-gray-600">Property Type</div>
                    <div className="font-semibold">{property.property_type}</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-2">👥</div>
                    <div className="text-sm text-gray-600">Guests</div>
                    <div className="font-semibold">{property.guest}</div>
                  </div>
                  {property.total_bedrooms && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl mb-2">🛏️</div>
                      <div className="text-sm text-gray-600">Bedrooms</div>
                      <div className="font-semibold">{property.total_bedrooms}</div>
                    </div>
                  )}
                  {property.total_rooms && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl mb-2">🏠</div>
                      <div className="text-sm text-gray-600">Rooms</div>
                      <div className="font-semibold">{property.total_rooms}</div>
                    </div>
                  )}
                  {property.total_beds && (
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl mb-2">🛌</div>
                      <div className="text-sm text-gray-600">Beds</div>
                      <div className="font-semibold">{property.total_beds}</div>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Facilities */}
            {property.facilities && property.facilities.length > 0 && (
              <Card className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Facilities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.facilities.map((facility) => (
                    <div key={facility.facility_id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <span className="text-xl">{getFacilityIcon(facility.facility_type)}</span>
                      <span className="text-gray-700 font-medium">{facility.facility_type}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Location */}
            <Card className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Location</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">📍</span>
                  <span className="text-gray-700">{property.address}, {property.city}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Latitude:</span> {property.latitude}
                  </div>
                  <div>
                    <span className="font-medium">Longitude:</span> {property.longitude}
                  </div>
                </div>
                <div className="bg-gray-100 rounded-lg p-4 text-center text-gray-600">
                  <p>Map integration can be added here</p>
                  <p className="text-sm">Coordinates: {property.latitude}, {property.longitude}</p>
                </div>
              </div>
            </Card>

            {/* Reviews */}
            <Card>
              <h2 className="text-xl font-semibold mb-4">
                Reviews ({property.review_count || 0})
              </h2>
              {property.reviews && property.reviews.length > 0 ? (
                <div className="space-y-4">
                  {property.reviews.map((review) => (
                    <div key={review.review_id} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                            {review.user_name[0]}
                          </div>
                          <span className="font-medium">{review.user_name}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-yellow-400">{'⭐'.repeat(review.rating)}</span>
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No reviews yet. Be the first to review this property!</p>
                </div>
              )}
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {isAuthenticated ? (
                <BookingForm property={property} />
              ) : (
                <Card>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {formatCurrency(property.rent_per_day)}
                    </div>
                    <div className="text-gray-600 mb-4">per night</div>
                    <p className="text-gray-600 mb-4">
                      Please sign in to book this property
                    </p>
                    <Link to={ROUTES.LOGIN}>
                      <Button className="w-full" size="lg">
                        Sign In to Book
                      </Button>
                    </Link>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PropertyDetails;
