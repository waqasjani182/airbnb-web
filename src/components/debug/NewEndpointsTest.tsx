import React, { useState } from 'react';
import { useGetPropertiesByCityQuery } from '../../services/propertyApi';
import { useGetBookingsByDateRangeQuery } from '../../services/bookingApi';
import { Card, Button, Input, Loading } from '../ui';

const NewEndpointsTest: React.FC = () => {
  const [cityName, setCityName] = useState('Mumbai');
  const [fromDate, setFromDate] = useState('2024-01-01');
  const [toDate, setToDate] = useState('2024-12-31');
  const [testCity, setTestCity] = useState(false);
  const [testBookings, setTestBookings] = useState(false);

  // Properties by City Query
  const {
    data: cityData,
    error: cityError,
    isLoading: cityLoading,
    refetch: refetchCity,
  } = useGetPropertiesByCityQuery(cityName, {
    skip: !testCity,
  });

  // Bookings by Date Range Query
  const {
    data: bookingsData,
    error: bookingsError,
    isLoading: bookingsLoading,
    refetch: refetchBookings,
  } = useGetBookingsByDateRangeQuery(
    { from_date: fromDate, to_date: toDate },
    {
      skip: !testBookings,
    }
  );

  const handleTestCity = () => {
    setTestCity(true);
    refetchCity();
  };

  const handleTestBookings = () => {
    setTestBookings(true);
    refetchBookings();
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">New Endpoints Test</h2>
      
      {/* Properties by City Test */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Properties by City with Ratings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City Name
            </label>
            <Input
              type="text"
              value={cityName}
              onChange={(e) => setCityName(e.target.value)}
              placeholder="Enter city name (e.g., Mumbai, Delhi)"
              className="max-w-md"
            />
          </div>
          
          <Button onClick={handleTestCity} disabled={cityLoading}>
            {cityLoading ? 'Loading...' : 'Test Properties by City'}
          </Button>

          {cityLoading && <Loading />}
          
          {cityError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800">
                Error: {JSON.stringify(cityError)}
              </p>
            </div>
          )}
          
          {cityData && (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                <h4 className="font-semibold text-green-800">Results for {cityData.city}:</h4>
                <p className="text-green-700">
                  Found {cityData.total_count} properties with average rating: {cityData.average_city_rating}
                </p>
              </div>
              
              <div className="grid gap-4">
                {cityData.properties.slice(0, 3).map((property) => (
                  <div key={property.property_id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-semibold">{property.title}</h5>
                        <p className="text-sm text-gray-600">{property.address}</p>
                        <p className="text-sm">Host: {property.host_name}</p>
                        <p className="text-sm">₹{property.rent_per_day}/day • {property.guest} guests</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold">⭐ {property.total_rating}</div>
                        <div className="text-sm text-gray-600">{property.review_count} reviews</div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-xs text-gray-500">
                        Facilities: {property.facilities.map(f => f.facility_type).join(', ')}
                      </p>
                    </div>
                  </div>
                ))}
                {cityData.properties.length > 3 && (
                  <p className="text-sm text-gray-600">
                    ... and {cityData.properties.length - 3} more properties
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Bookings by Date Range Test */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Bookings with Ratings by Date Range</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Date
              </label>
              <Input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To Date
              </label>
              <Input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          </div>
          
          <Button onClick={handleTestBookings} disabled={bookingsLoading}>
            {bookingsLoading ? 'Loading...' : 'Test Bookings by Date Range'}
          </Button>

          {bookingsLoading && <Loading />}
          
          {bookingsError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800">
                Error: {JSON.stringify(bookingsError)}
              </p>
            </div>
          )}
          
          {bookingsData && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                <h4 className="font-semibold text-blue-800">
                  Bookings from {bookingsData.date_range.from_date} to {bookingsData.date_range.to_date}:
                </h4>
                <div className="grid grid-cols-2 gap-4 mt-2 text-sm text-blue-700">
                  <div>Total Bookings: {bookingsData.statistics.total_bookings}</div>
                  <div>With Ratings: {bookingsData.statistics.bookings_with_ratings}</div>
                  <div>Avg Property Rating: {bookingsData.statistics.average_property_rating}</div>
                  <div>Total Revenue: ₹{bookingsData.statistics.total_revenue}</div>
                </div>
              </div>
              
              <div className="grid gap-4">
                {bookingsData.bookings.slice(0, 3).map((booking) => (
                  <div key={booking.booking_id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-semibold">{booking.property_title}</h5>
                        <p className="text-sm text-gray-600">{booking.property_city}</p>
                        <p className="text-sm">Guest: {booking.guest_name}</p>
                        <p className="text-sm">Host: {booking.host_name}</p>
                        <p className="text-sm">
                          {booking.start_date} to {booking.end_date} • ₹{booking.total_amount}
                        </p>
                      </div>
                      <div className="text-right text-sm">
                        <div className="space-y-1">
                          {booking.property_rating && (
                            <div>Property: ⭐ {booking.property_rating}</div>
                          )}
                          {booking.user_rating && (
                            <div>Host: ⭐ {booking.user_rating}</div>
                          )}
                          {booking.owner_rating && (
                            <div>Guest: ⭐ {booking.owner_rating}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {bookingsData.bookings.length > 3 && (
                  <p className="text-sm text-gray-600">
                    ... and {bookingsData.bookings.length - 3} more bookings
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default NewEndpointsTest;
