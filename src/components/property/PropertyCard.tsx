import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Property } from '../../types';
import { Card, Badge, Loading, StarRating } from '../ui';
import { formatCurrency } from '../../utils/helpers';
import { useLazyCheckPropertyAvailabilityQuery } from '../../services/bookingApi';

interface PropertyCardProps {
  property: Property;
  checkInDate?: string;
  checkOutDate?: string;
  guests?: number;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  checkInDate,
  checkOutDate,
  guests
}) => {
  const [availabilityStatus, setAvailabilityStatus] = useState<'checking' | 'available' | 'unavailable' | null>(null);
  const [checkAvailability, { isLoading: isCheckingAvailability }] = useLazyCheckPropertyAvailabilityQuery();

  // Check availability when dates are provided
  useEffect(() => {
    const checkPropertyAvailability = async () => {
      if (checkInDate && checkOutDate && guests) {
        setAvailabilityStatus('checking');
        try {
          const result = await checkAvailability({
            propertyId: property.property_id,
            startDate: checkInDate,
            endDate: checkOutDate,
            guests,
          }).unwrap();

          setAvailabilityStatus(result.available ? 'available' : 'unavailable');
        } catch (error) {
          setAvailabilityStatus('unavailable');
        }
      } else {
        setAvailabilityStatus(null);
      }
    };

    const timeoutId = setTimeout(checkPropertyAvailability, 300); // Debounce
    return () => clearTimeout(timeoutId);
  }, [checkInDate, checkOutDate, guests, property.property_id, checkAvailability]);

  return (
    <Card padding="none" className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/property/${property.property_id}`}>
        <div className="relative">
          <img
            src={property.primary_image || property.images?.[0]?.image_url || '/placeholder-property.jpg'}
            alt={property.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-3 left-3">
            <Badge variant="default" className="bg-white text-gray-800">
              {property.property_type}
            </Badge>
          </div>

          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {property.rating && property.rating > 0 && (
              <Badge variant="success" className="bg-white text-gray-800 flex items-center gap-1">
                <StarRating rating={property.rating} size="sm" />
              </Badge>
            )}

            {/* Availability Status */}
            {availabilityStatus === 'checking' && (
              <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
                <Loading size="sm" />
                <span className="text-xs">Checking...</span>
              </Badge>
            )}
            {availabilityStatus === 'available' && (
              <Badge variant="success" className="bg-green-100 text-green-800">
                ✓ Available
              </Badge>
            )}
            {availabilityStatus === 'unavailable' && (
              <Badge variant="error" className="bg-red-100 text-red-800">
                ✗ Unavailable
              </Badge>
            )}
          </div>
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
              {property.title}
            </h3>
          </div>

          <p className="text-gray-600 text-sm mb-2">
            {property.city} • {property.guest} guests
          </p>

          <p className="text-gray-700 text-sm mb-3 line-clamp-2">
            {property.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {(property.review_count || 0) > 0 && (
                <span className="text-sm text-gray-500">
                  {property.review_count} reviews
                </span>
              )}
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-gray-900">
                {formatCurrency(property.rent_per_day)}
              </span>
              <span className="text-sm text-gray-500"> / night</span>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default PropertyCard;
