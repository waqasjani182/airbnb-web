import React, { useState } from 'react';
import { Input, Button } from './';
import Map from './Map';

interface CityPickerProps {
  onCitySelect: (city: string, coordinates?: { lat: number; lng: number }) => void;
  initialCity?: string;
  className?: string;
  placeholder?: string;
}

const CityPicker: React.FC<CityPickerProps> = ({
  onCitySelect,
  initialCity = '',
  className = '',
  placeholder = 'Search for a city...',
}) => {
  const [searchQuery, setSearchQuery] = useState(initialCity);
  const [selectedLocation, setSelectedLocation] = useState<{
    city: string;
    latitude: number;
    longitude: number;
  } | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showMap, setShowMap] = useState(false);

  const searchCity = async (query: string) => {
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      // Search specifically for cities and places
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=5&addressdetails=1&featuretype=city,town,village`
      );
      const results = await response.json();
      setSearchResults(results);
    } catch (error) {
      console.error('City search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    searchCity(searchQuery);
  };

  const handleLocationSelect = (lat: number, lng: number, address?: string) => {
    const city = extractCityFromAddress(address || '');
    
    if (city) {
      const location = {
        city,
        latitude: lat,
        longitude: lng,
      };
      
      setSelectedLocation(location);
      setSearchQuery(city);
      setSearchResults([]);
      onCitySelect(city, { lat, lng });
    }
  };

  const handleResultSelect = (result: any) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    const city = result.address?.city || 
                 result.address?.town || 
                 result.address?.village || 
                 result.display_name.split(',')[0];
    
    const location = {
      city,
      latitude: lat,
      longitude: lng,
    };
    
    setSelectedLocation(location);
    setSearchQuery(city);
    setSearchResults([]);
    setShowMap(false);
    onCitySelect(city, { lat, lng });
  };

  const extractCityFromAddress = (address: string): string => {
    const parts = address.split(',');
    if (parts.length >= 1) {
      return parts[0]?.trim() || '';
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
          title: 'Selected City',
          popup: selectedLocation.city,
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
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button 
            type="button" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              searchCity(searchQuery);
            }}
            isLoading={isSearching} 
            disabled={!searchQuery.trim()}
            size="sm"
          >
            Search
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowMap(!showMap)}
            size="sm"
          >
            {showMap ? 'Hide Map' : 'Show Map'}
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
                  {result.address?.city || result.address?.town || result.address?.village || result.display_name.split(',')[0]}
                </div>
                <div className="text-xs text-gray-500">
                  {result.display_name}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Map */}
        {showMap && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Click on the map to select a city
            </label>
            <Map
              center={mapCenter}
              zoom={selectedLocation ? 12 : 6}
              markers={markers}
              onLocationSelect={handleLocationSelect}
              height="250px"
            />
          </div>
        )}

        {/* Selected City Info */}
        {selectedLocation && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <h4 className="text-sm font-medium text-blue-800 mb-1">Selected City:</h4>
            <p className="text-sm text-blue-700">{selectedLocation.city}</p>
            <p className="text-xs text-blue-600 mt-1">
              Coordinates: {selectedLocation.latitude.toFixed(4)}, {selectedLocation.longitude.toFixed(4)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CityPicker;
