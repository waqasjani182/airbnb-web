import React, { useState, useEffect } from 'react';
import { Input, Button } from './';
import Map from './Map';

interface LocationPickerProps {
  onLocationChange: (location: {
    address: string;
    city: string;
    latitude: number;
    longitude: number;
  }) => void;
  initialLocation?: {
    address?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
  };
  className?: string;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  onLocationChange,
  initialLocation,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState(initialLocation?.address || '');
  const [selectedLocation, setSelectedLocation] = useState<{
    address: string;
    city: string;
    latitude: number;
    longitude: number;
  } | null>(
    initialLocation?.latitude && initialLocation?.longitude
      ? {
          address: initialLocation.address || '',
          city: initialLocation.city || '',
          latitude: initialLocation.latitude,
          longitude: initialLocation.longitude,
        }
      : null
  );
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const searchLocation = async (query: string) => {
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=5&addressdetails=1`
      );
      const results = await response.json();
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    searchLocation(searchQuery);
  };

  const handleLocationSelect = (lat: number, lng: number, address?: string) => {
    const location = {
      address: address || `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      city: extractCityFromAddress(address || ''),
      latitude: lat,
      longitude: lng,
    };
    
    setSelectedLocation(location);
    setSearchQuery(location.address);
    setSearchResults([]);
    onLocationChange(location);
  };

  const handleResultSelect = (result: any) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    const address = result.display_name;
    const city = result.address?.city || result.address?.town || result.address?.village || '';
    
    const location = {
      address,
      city,
      latitude: lat,
      longitude: lng,
    };
    
    setSelectedLocation(location);
    setSearchQuery(address);
    setSearchResults([]);
    onLocationChange(location);
  };

  const extractCityFromAddress = (address: string): string => {
    // Simple city extraction - you might want to improve this
    const parts = address.split(',');
    if (parts.length >= 2) {
      return parts[parts.length - 3]?.trim() || parts[1]?.trim() || '';
    }
    return '';
  };

  const mapCenter: [number, number] = selectedLocation
    ? [selectedLocation.latitude, selectedLocation.longitude]
    : [40.7128, -74.0060]; // Default to NYC

  const markers = selectedLocation
    ? [
        {
          id: 'selected',
          position: [selectedLocation.latitude, selectedLocation.longitude] as [number, number],
          title: 'Selected Location',
          popup: selectedLocation.address,
        },
      ]
    : [];

  return (
    <div className={className}>
      <div className="space-y-4">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <Input
            type="text"
            placeholder="Search for an address or place..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              searchLocation(searchQuery);
            }}
            isLoading={isSearching}
            disabled={!searchQuery.trim()}
          >
            Search
          </Button>
        </form>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="bg-white border border-gray-300 rounded-md shadow-sm max-h-48 overflow-y-auto">
            {searchResults.map((result, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleResultSelect(result)}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
              >
                <div className="text-sm font-medium text-gray-900">
                  {result.display_name}
                </div>
                <div className="text-xs text-gray-500">
                  {result.type} • {result.lat}, {result.lon}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Map */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Click on the map to select a location
          </label>
          <Map
            center={mapCenter}
            zoom={selectedLocation ? 15 : 13}
            markers={markers}
            onLocationSelect={handleLocationSelect}
            height="300px"
          />
        </div>

        {/* Selected Location Info */}
        {selectedLocation && (
          <div className="bg-green-50 border border-green-200 rounded-md p-3">
            <h4 className="text-sm font-medium text-green-800 mb-1">Selected Location:</h4>
            <p className="text-sm text-green-700">{selectedLocation.address}</p>
            <p className="text-xs text-green-600 mt-1">
              Coordinates: {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
            </p>
            {selectedLocation.city && (
              <p className="text-xs text-green-600">City: {selectedLocation.city}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationPicker;
