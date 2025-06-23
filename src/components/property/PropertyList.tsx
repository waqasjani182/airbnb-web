import React from 'react';
import { Property } from '../../types';
import { Loading } from '../ui';
import PropertyCard from './PropertyCard';

interface PropertyListProps {
  properties: Property[];
  isLoading?: boolean;
  emptyMessage?: string;
  checkInDate?: string;
  checkOutDate?: string;
  guests?: number;
}

const PropertyList: React.FC<PropertyListProps> = ({
  properties,
  isLoading = false,
  emptyMessage = 'No properties found',
  checkInDate,
  checkOutDate,
  guests,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loading size="lg" text="Loading properties..." />
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {emptyMessage}
        </h3>
        <p className="text-gray-500">
          Try adjusting your search criteria or browse all properties.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {properties.map((property) => (
        <PropertyCard
          key={property.property_id}
          property={property}
          checkInDate={checkInDate}
          checkOutDate={checkOutDate}
          guests={guests}
        />
      ))}
    </div>
  );
};

export default PropertyList;
