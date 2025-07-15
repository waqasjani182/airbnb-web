import React, { useState } from 'react';
import { useBookingsByDateRange, endpointUtils } from '../../hooks/useNewEndpoints';
import { Card, Button, Input, Loading, StarRating } from '../ui';

interface BookingsAnalyticsProps {
  className?: string;
}

const BookingsAnalytics: React.FC<BookingsAnalyticsProps> = ({ className = '' }) => {
  const [fromInput, setFromInput] = useState('2024-01-01');
  const [toInput, setToInput] = useState('2024-12-31');
  
  const {
    fromDate,
    toDate,
    searchDateRange,
    clearSearch,
    data,
    error,
    isLoading,
    hasSearched,
    isValidDateRange,
  } = useBookingsByDateRange();

  const handleSearch = () => {
    if (fromInput && toInput && new Date(fromInput) <= new Date(toInput)) {
      searchDateRange(fromInput, toInput);
    }
  };

  const revenueStats = endpointUtils.getRevenueStats(data);
  const highRatedBookings = endpointUtils.getHighRatedBookings(data, 4.0);
  const completedBookings = endpointUtils.getBookingsByStatus(data, 'completed');

  return (
    <div className={`space-y-6 ${className}`}>
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Bookings Analytics</h2>
        
        {/* Date Range Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <Input
              type="date"
              value={fromInput}
              onChange={(e) => setFromInput(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <Input
              type="date"
              value={toInput}
              onChange={(e) => setToInput(e.target.value)}
            />
          </div>
          <div className="flex items-end gap-2">
            <Button 
              onClick={handleSearch} 
              disabled={isLoading || !fromInput || !toInput || new Date(fromInput) > new Date(toInput)}
              className="flex-1"
            >
              {isLoading ? 'Loading...' : 'Analyze'}
            </Button>
            {hasSearched && (
              <Button variant="outline" onClick={clearSearch}>
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Date Validation */}
        {fromInput && toInput && new Date(fromInput) > new Date(toInput) && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md mb-4">
            <p className="text-yellow-800 text-sm">From date must be before or equal to To date</p>
          </div>
        )}

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
              Failed to load bookings data. Please try again.
            </p>
          </div>
        )}

        {/* Results */}
        {data && !isLoading && (
          <div className="space-y-6">
            {/* Statistics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800">Total Bookings</h3>
                <p className="text-2xl font-bold text-blue-900">{data.statistics.total_bookings}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-800">With Ratings</h3>
                <p className="text-2xl font-bold text-purple-900">{data.statistics.bookings_with_ratings}</p>
                <p className="text-sm text-purple-600">
                  {revenueStats ? `${revenueStats.ratingPercentage.toFixed(1)}%` : '0%'}
                </p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold text-orange-800">Avg Property Rating</h3>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-orange-900">{data.statistics.average_property_rating}</p>
                  <StarRating rating={parseFloat(data.statistics.average_property_rating)} size="sm" />
                </div>
              </div>
            </div>

         ?

            {/* Recent High-Rated Bookings */}
            {highRatedBookings.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">High-Rated Bookings (4.0+)</h3>
                <div className="grid gap-4">
                  {highRatedBookings.slice(0, 5).map((booking) => (
                    <div key={booking.booking_id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold">{booking.property_title}</h4>
                          <p className="text-gray-600 text-sm">{booking.property_city}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span><strong>Guest:</strong> {booking.guest_name}</span>
                            <span><strong>Host:</strong> {booking.host_name}</span>
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                            <span>{endpointUtils.formatDate(booking.start_date)} - {endpointUtils.formatDate(booking.end_date)}</span>
                            <span>{endpointUtils.formatCurrency(booking?.total_amount)}</span>
                            <span className="capitalize">{booking.status}</span>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="space-y-1 text-sm">
                            {booking.property_rating && (
                              <div className="flex items-center gap-1">
                                <span className="text-gray-600">Property:</span>
                                <StarRating rating={booking.property_rating} size="sm" />
                                <span className="font-medium">{booking.property_rating}</span>
                              </div>
                            )}
                            {booking.user_rating && (
                              <div className="flex items-center gap-1">
                                <span className="text-gray-600">Host:</span>
                                <StarRating rating={booking.user_rating} size="sm" />
                                <span className="font-medium">{booking.user_rating}</span>
                              </div>
                            )}
                            {booking.owner_rating && (
                              <div className="flex items-center gap-1">
                                <span className="text-gray-600">Guest:</span>
                                <StarRating rating={booking.owner_rating} size="sm" />
                                <span className="font-medium">{booking.owner_rating}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Reviews */}
                      {(booking.property_review || booking.user_review || booking.owner_review) && (
                        <div className="mt-3 pt-3 border-t">
                          <div className="space-y-2 text-sm">
                            {booking.property_review && (
                              <div>
                                <span className="font-medium text-gray-700">Property Review:</span>
                                <p className="text-gray-600 italic">"{booking.property_review}"</p>
                              </div>
                            )}
                            {booking.user_review && (
                              <div>
                                <span className="font-medium text-gray-700">Host Review:</span>
                                <p className="text-gray-600 italic">"{booking.user_review}"</p>
                              </div>
                            )}
                            {booking.owner_review && (
                              <div>
                                <span className="font-medium text-gray-700">Guest Review:</span>
                                <p className="text-gray-600 italic">"{booking.owner_review}"</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {highRatedBookings.length > 5 && (
                    <p className="text-sm text-gray-600 text-center">
                      ... and {highRatedBookings.length - 5} more high-rated bookings
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* No Results */}
            {data.total_count === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-600">No bookings found in the selected date range.</p>
                <p className="text-sm text-gray-500 mt-1">Try selecting a different date range.</p>
              </div>
            )}
          </div>
        )}

        {/* Initial State */}
        {!hasSearched && !isLoading && (
          <div className="text-center py-8">
            <p className="text-gray-600">Select a date range to view booking analytics</p>
            <p className="text-sm text-gray-500 mt-1">
              Get insights on bookings, ratings, revenue, and more
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default BookingsAnalytics;
