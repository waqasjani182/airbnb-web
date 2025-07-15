import React, { useState } from 'react';
import { usePropertiesByCity, endpointUtils } from '../../hooks/useNewEndpoints';
import { Card, Button, Input, Loading, StarRating } from '../ui';

interface CityAnalyticsProps {
  className?: string;
}

const CityAnalytics: React.FC<CityAnalyticsProps> = ({ className = '' }) => {
  const [searchInput, setSearchInput] = useState('');
  const {
    cityName,
    searchCity,
    clearSearch,
    data,
    error,
    isLoading,
    hasSearched,
  } = usePropertiesByCity();

  const handleSearch = () => {
    if (searchInput.trim()) {
      searchCity(searchInput.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const topRatedProperties = endpointUtils.getTopRatedProperties(data, 3);
  const highRatedProperties = endpointUtils.getPropertiesByRating(data, 4.0, 5.0);

  return (
    <div className={`space-y-6 ${className}`}>
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">City Property Analytics</h2>
        
        {/* Search Section */}
        <div className="flex gap-3 mb-6">
          <Input
            type="text"
            placeholder="Enter city name (e.g., Mumbai, Delhi, Bangalore)"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button onClick={handleSearch} disabled={isLoading || !searchInput.trim()}>
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
          {hasSearched && (
            <Button 
              variant="outline" 
              onClick={() => {
                clearSearch();
                setSearchInput('');
              }}
            >
              Clear
            </Button>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-8">
            <Loading />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">
              Failed to load properties for "{cityName}". Please try again.
            </p>
          </div>
        )}

        {/* Results */}
        {data && !isLoading && (
          <div className="space-y-6">
            {/* City Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800">Total Properties</h3>
                <p className="text-2xl font-bold text-blue-900">{data.total_count}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800">Average Rating</h3>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-green-900">{data.average_city_rating}</p>
                  <StarRating rating={parseFloat(data.average_city_rating)} size="sm" />
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-800">High-Rated Properties</h3>
                <p className="text-2xl font-bold text-purple-900">{highRatedProperties.length}</p>
                <p className="text-sm text-purple-600">(4.0+ rating)</p>
              </div>
            </div>

            {/* Top Rated Properties */}
            {topRatedProperties.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Top Rated Properties</h3>
                <div className="grid gap-4">
                  {topRatedProperties.map((property) => (
                    <div key={property.property_id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{property.title}</h4>
                          <p className="text-gray-600 text-sm">{property.address}</p>
                          <p className="text-sm mt-1">
                            <span className="font-medium">Host:</span> {property.host_name}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span className="font-medium">
                              {endpointUtils.formatCurrency(property.rent_per_day)}/day
                            </span>
                            <span>{property.guest} guests</span>
                            <span className="text-gray-500">{property.property_type}</span>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="flex items-center gap-1 mb-1">
                            <StarRating rating={property.total_rating} size="sm" />
                            <span className="font-semibold">{property.total_rating.toFixed(1)}</span>
                          </div>
                          <p className="text-sm text-gray-600">{property.review_count} reviews</p>
                          <div className="text-xs text-gray-500 mt-1">
                            <div>Guest: {property.avg_user_rating.toFixed(1)}</div>
                            <div>Host: {property.avg_owner_rating.toFixed(1)}</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Facilities */}
                      {property.facilities.length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <div className="flex flex-wrap gap-2">
                            {property.facilities.slice(0, 4).map((facility) => (
                              <span
                                key={facility.facility_id}
                                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                              >
                                {facility.facility_type}
                              </span>
                            ))}
                            {property.facilities.length > 4 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                +{property.facilities.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {data.total_count === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-600">No properties found in {data.city}.</p>
                <p className="text-sm text-gray-500 mt-1">Try searching for a different city.</p>
              </div>
            )}
          </div>
        )}

        {/* Initial State */}
        {!hasSearched && !isLoading && (
          <div className="text-center py-8">
            <p className="text-gray-600">Enter a city name to view property analytics</p>
            <p className="text-sm text-gray-500 mt-1">
              Get insights on properties, ratings, and more for any city
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CityAnalytics;
