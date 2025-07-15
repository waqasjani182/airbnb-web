import React from 'react';
import { useGetPropertiesByCityQuery, useGetBookingsByDateRangeQuery } from '../../services';

/**
 * Quick test component that can be added to any page to test the new endpoints
 * Just import and add <QuickEndpointTest /> to any component
 */
const QuickEndpointTest: React.FC = () => {
  // Test Properties by City endpoint
  const { 
    data: cityData, 
    isLoading: cityLoading, 
    error: cityError 
  } = useGetPropertiesByCityQuery('Mumbai');

  // Test Bookings by Date Range endpoint
  const { 
    data: bookingsData, 
    isLoading: bookingsLoading, 
    error: bookingsError 
  } = useGetBookingsByDateRangeQuery({
    from_date: '2024-01-01',
    to_date: '2024-12-31'
  });

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg my-4">
      <h3 className="text-lg font-semibold text-yellow-800 mb-3">🧪 New Endpoints Test</h3>
      
      <div className="grid md:grid-cols-2 gap-4 text-sm">
        {/* Properties by City Test */}
        <div className="bg-white p-3 rounded border">
          <h4 className="font-medium text-gray-900 mb-2">Properties by City (Mumbai)</h4>
          {cityLoading && <p className="text-blue-600">Loading...</p>}
          {cityError && <p className="text-red-600">Error: {JSON.stringify(cityError)}</p>}
          {cityData && (
            <div className="text-green-600">
              ✅ Success! Found {cityData.total_count} properties
              <br />
              Average rating: {cityData.average_city_rating}
            </div>
          )}
        </div>

        {/* Bookings by Date Range Test */}
        <div className="bg-white p-3 rounded border">
          <h4 className="font-medium text-gray-900 mb-2">Bookings by Date Range (2024)</h4>
          {bookingsLoading && <p className="text-blue-600">Loading...</p>}
          {bookingsError && <p className="text-red-600">Error: {JSON.stringify(bookingsError)}</p>}
          {bookingsData && (
            <div className="text-green-600">
              ✅ Success! Found {bookingsData.statistics?.total_bookings || 0} bookings
              <br />
              Revenue: ₹{bookingsData.statistics?.total_revenue || '0'}
              <br />
              <details className="text-xs mt-1">
                <summary>Debug Info</summary>
                <pre className="text-gray-600 mt-1">
                  {JSON.stringify(bookingsData.statistics, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </div>
      </div>
      
      <p className="text-xs text-yellow-700 mt-2">
        This test component can be removed after confirming the endpoints work.
      </p>
    </div>
  );
};

export default QuickEndpointTest;
