import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/layout';
import { SearchInput, Button, Card } from '../../components/ui';
import PropertyList from '../../components/property/PropertyList';
import { PROPERTY_TYPES } from '../../utils/constants';
import { useSearchPropertiesQuery } from '../../services/propertyApi';
import { PropertySearchParams } from '../../types/property.types';

const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useState<PropertySearchParams>({
    query: '',
    city: '',
    min_price: undefined,
    max_price: undefined,
    property_type: '',
    bedrooms: undefined,
    page: 1,
  });

  // Date and guest filters for availability
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState(1);

  const [shouldSearch, setShouldSearch] = useState(false);

  const {
    data: searchResults,
    isLoading,
    error
  } = useSearchPropertiesQuery(searchParams, {
    skip: !shouldSearch,
  });

  const handleSearch = () => {
    setShouldSearch(true);
  };

  const handleClearFilters = () => {
    setSearchParams({
      query: '',
      city: '',
      min_price: undefined,
      max_price: undefined,
      property_type: '',
      bedrooms: undefined,
      page: 1,
    });
    setCheckInDate('');
    setCheckOutDate('');
    setGuests(1);
    setShouldSearch(false);
  };

  const updateSearchParam = (key: keyof PropertySearchParams, value: any) => {
    setSearchParams(prev => ({
      ...prev,
      [key]: value === '' ? undefined : value,
      page: key === 'page' ? value : 1, // Reset to first page when filters change, except for page changes
    }));
  };

  // Auto-search when page changes (for pagination)
  useEffect(() => {
    if (shouldSearch && searchParams.page && searchParams.page > 1) {
      // Trigger search automatically when page changes
    }
  }, [searchParams.page, shouldSearch]);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Find your perfect stay
          </h1>

          {/* Search Filters */}
          <Card>
            {/* Main Search Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div className="lg:col-span-2">
                <SearchInput
                  placeholder="Search by location or property name"
                  value={searchParams.query || ''}
                  onChange={(e) => updateSearchParam('query', e.target.value)}
                  onSearch={handleSearch}
                />
              </div>

              <input
                type="text"
                placeholder="City"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={searchParams.city || ''}
                onChange={(e) => updateSearchParam('city', e.target.value)}
              />
            </div>

            {/* Date and Guest Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check-in Date
                </label>
                <input
                  type="date"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check-out Date
                </label>
                <input
                  type="date"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  min={checkInDate || new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Guests
                </label>
                <select
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                >
                  {Array.from({ length: 10 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} guest{i > 0 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <select
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={searchParams.property_type || ''}
                onChange={(e) => updateSearchParam('property_type', e.target.value)}
              >
                <option value="">All property types</option>
                {PROPERTY_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Min price per night"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={searchParams.min_price || ''}
                onChange={(e) => updateSearchParam('min_price', e.target.value ? Number(e.target.value) : undefined)}
              />

              <input
                type="number"
                placeholder="Max price per night"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={searchParams.max_price || ''}
                onChange={(e) => updateSearchParam('max_price', e.target.value ? Number(e.target.value) : undefined)}
              />

              <select
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={searchParams.bedrooms || ''}
                onChange={(e) => updateSearchParam('bedrooms', e.target.value ? Number(e.target.value) : undefined)}
              >
                <option value="">Any bedrooms</option>
                <option value="1">1 bedroom</option>
                <option value="2">2 bedrooms</option>
                <option value="3">3 bedrooms</option>
                <option value="4">4 bedrooms</option>
                <option value="5">5+ bedrooms</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleSearch} isLoading={isLoading} className="flex-1">
                🔍 Search Properties
              </Button>
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="sm:w-auto"
              >
                Clear Filters
              </Button>
            </div>

            {/* Active Filters Display */}
            {(searchParams.query || searchParams.city || searchParams.property_type ||
              searchParams.min_price || searchParams.max_price || searchParams.bedrooms ||
              checkInDate || checkOutDate || guests > 1) && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-gray-600 mr-2">Active filters:</span>
                  {searchParams.query && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Query: {searchParams.query}
                    </span>
                  )}
                  {searchParams.city && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      City: {searchParams.city}
                    </span>
                  )}
                  {checkInDate && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                      Check-in: {new Date(checkInDate).toLocaleDateString()}
                    </span>
                  )}
                  {checkOutDate && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                      Check-out: {new Date(checkOutDate).toLocaleDateString()}
                    </span>
                  )}
                  {guests > 1 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      {guests} guest{guests > 1 ? 's' : ''}
                    </span>
                  )}
                  {searchParams.property_type && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Type: {searchParams.property_type}
                    </span>
                  )}
                  {searchParams.min_price && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Min: ${searchParams.min_price}
                    </span>
                  )}
                  {searchParams.max_price && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Max: ${searchParams.max_price}
                    </span>
                  )}
                  {searchParams.bedrooms && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {searchParams.bedrooms} bedroom{searchParams.bedrooms > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Results */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <p className="text-lg font-semibold text-gray-900">
                {isLoading ? 'Searching...' :
                 error ? 'Search Error' :
                 searchResults ? `${searchResults.pagination.total} properties found` :
                 'Enter search criteria and click search'}
              </p>
              {searchResults && searchResults.pagination.total > 0 && (
                <p className="text-sm text-gray-600">
                  Showing {((searchResults.pagination.page - 1) * searchResults.pagination.limit) + 1} - {Math.min(searchResults.pagination.page * searchResults.pagination.limit, searchResults.pagination.total)} of {searchResults.pagination.total} results
                </p>
              )}
            </div>

            {searchResults && searchResults.pagination.pages > 1 && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={searchParams.page === 1}
                  onClick={() => updateSearchParam('page', (searchParams.page || 1) - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {searchParams.page || 1} of {searchResults.pagination.pages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={searchParams.page === searchResults.pagination.pages}
                  onClick={() => updateSearchParam('page', (searchParams.page || 1) + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-red-400">⚠️</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Search Error</h3>
                <p className="mt-1 text-sm text-red-700">
                  {(error as any)?.data?.message || 'Failed to search properties. Please try again.'}
                </p>
              </div>
            </div>
          </div>
        )}

        <PropertyList
          properties={searchResults?.properties || []}
          isLoading={isLoading}
          emptyMessage={shouldSearch ? "No properties match your search criteria. Try adjusting your filters." : "Use the search form above to find properties."}
          checkInDate={checkInDate}
          checkOutDate={checkOutDate}
          guests={guests}
        />

        {/* Pagination at bottom */}
        {searchResults && searchResults.pagination.pages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                disabled={searchParams.page === 1}
                onClick={() => updateSearchParam('page', (searchParams.page || 1) - 1)}
              >
                Previous
              </Button>

              {/* Page numbers */}
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, searchResults.pagination.pages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Button
                      key={pageNum}
                      variant={pageNum === searchParams.page ? "primary" : "outline"}
                      size="sm"
                      onClick={() => updateSearchParam('page', pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                {searchResults.pagination.pages > 5 && (
                  <>
                    <span className="px-2 py-1 text-gray-500">...</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateSearchParam('page', searchResults.pagination.pages)}
                    >
                      {searchResults.pagination.pages}
                    </Button>
                  </>
                )}
              </div>

              <Button
                variant="outline"
                disabled={searchParams.page === searchResults.pagination.pages}
                onClick={() => updateSearchParam('page', (searchParams.page || 1) + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Search;
