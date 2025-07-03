import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Layout } from '../../components/layout';
import { Loading, Button, Badge, Card } from '../../components/ui';
import PropertyBookingCard from '../../components/booking/PropertyBookingCard';
import { BookingListItem } from '../../types/booking.types';
import { useGetHostBookingsQuery, useUpdateBookingStatusMutation } from '../../services/bookingApi';
import { useErrorHandler } from '../../hooks';
import toast from 'react-hot-toast';
import { formatCurrency } from '../../utils/helpers';

const PropertyBookings: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [statusFilter, setStatusFilter] = useState<string | 'all'>('all');
  const [propertyFilter, setPropertyFilter] = useState<number | 'all'>('all');
  const { handleError } = useErrorHandler();

  // Fetch host bookings
  const {
    data: hostBookingsData,
    isLoading,
    error: hostBookingsError
  } = useGetHostBookingsQuery(undefined, {
    skip: !user,
  });

  const [updateBookingStatus] = useUpdateBookingStatusMutation();

  const handleUpdateBookingStatus = async (bookingId: number, status: string) => {
    try {
      await updateBookingStatus({ id: bookingId, data: { status } }).unwrap();
      toast.success('Booking status updated successfully');
    } catch (error: any) {
      handleError(error, 'Failed to update booking status');
    }
  };

  const handleViewGuest = (guestId: number) => {
    // TODO: Implement guest profile view
    toast.success(`View guest profile: ${guestId}`);
  };

  const hostBookings = hostBookingsData?.bookings || [];

  // Get unique properties for filtering
  const properties = useMemo(() => {
    const uniqueProperties = hostBookings.reduce((acc, booking) => {
      if (!acc.find(p => p.property_id === booking.property_id)) {
        acc.push({
          property_id: booking.property_id,
          title: booking.title,
          city: booking.city,
          image: booking.property_image
        });
      }
      return acc;
    }, [] as Array<{property_id: number, title: string, city: string, image: string}>);
    
    return uniqueProperties;
  }, [hostBookings]);

  // Filter bookings
  const filteredBookings = useMemo(() => {
    let filtered = hostBookings;
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }
    
    if (propertyFilter !== 'all') {
      filtered = filtered.filter(booking => booking.property_id === propertyFilter);
    }
    
    return filtered;
  }, [hostBookings, statusFilter, propertyFilter]);

  // Get booking counts by status
  const getBookingCounts = (bookings: BookingListItem[]) => {
    return {
      all: bookings.length,
      'Pending': bookings.filter(b => b.status === 'Pending').length,
      'Confirmed': bookings.filter(b => b.status === 'Confirmed').length,
      'Completed': bookings.filter(b => b.status === 'Completed').length,
      'Cancelled': bookings.filter(b => b.status === 'Cancelled').length,
    };
  };

  const counts = getBookingCounts(hostBookings);

  // Calculate revenue statistics
  const revenueStats = useMemo(() => {
    const confirmed = hostBookings.filter(b => b.status === 'Confirmed' || b.status === 'Completed');
    const pending = hostBookings.filter(b => b.status === 'Pending');
    
    return {
      totalRevenue: confirmed.reduce((sum, b) => sum + b.total_amount, 0),
      pendingRevenue: pending.reduce((sum, b) => sum + b.total_amount, 0),
      totalBookings: confirmed.length,
      pendingBookings: pending.length,
    };
  }, [hostBookings]);

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Loading size="lg" text="Loading your property bookings..." />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Property Bookings Management
          </h1>
          <p className="text-gray-600">
            Manage bookings for your properties and track your hosting performance
          </p>
        </div>

        {/* Revenue Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(revenueStats.totalRevenue)}
              </div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {formatCurrency(revenueStats.pendingRevenue)}
              </div>
              <div className="text-sm text-gray-600">Pending Revenue</div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {revenueStats.totalBookings}
              </div>
              <div className="text-sm text-gray-600">Confirmed Bookings</div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {revenueStats.pendingBookings}
              </div>
              <div className="text-sm text-gray-600">Pending Requests</div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Property Filter */}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Property:</span>
              <select
                value={propertyFilter}
                onChange={(e) => setPropertyFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Properties ({properties.length})</option>
                {properties.map((property) => (
                  <option key={property.property_id} value={property.property_id}>
                    {property.title} - {property.city}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Status:</span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    statusFilter === 'all'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All ({counts.all})
                </button>
                <button
                  onClick={() => setStatusFilter('Pending')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    statusFilter === 'Pending'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                  }`}
                >
                  Pending ({counts['Pending']})
                </button>
                <button
                  onClick={() => setStatusFilter('Confirmed')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    statusFilter === 'Confirmed'
                      ? 'bg-green-600 text-white'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  Confirmed ({counts['Confirmed']})
                </button>
                <button
                  onClick={() => setStatusFilter('Completed')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    statusFilter === 'Completed'
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  Completed ({counts['Completed']})
                </button>
                <button
                  onClick={() => setStatusFilter('Cancelled')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    statusFilter === 'Cancelled'
                      ? 'bg-red-600 text-white'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  }`}
                >
                  Cancelled ({counts['Cancelled']})
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-6">
          {hostBookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No bookings yet
              </h3>
              <p className="text-gray-500 mb-4">
                When guests book your properties, you'll see them here.
              </p>
              <Button onClick={() => window.location.href = '/upload-property'}>
                Add a property
              </Button>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No bookings found
              </h3>
              <p className="text-gray-500 mb-4">
                No bookings match the selected filters.
              </p>
              <Button variant="outline" onClick={() => {
                setStatusFilter('all');
                setPropertyFilter('all');
              }}>
                Clear filters
              </Button>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <PropertyBookingCard
                key={booking.booking_id}
                booking={booking}
                onUpdateStatus={handleUpdateBookingStatus}
                onViewGuest={handleViewGuest}
                showHostReviewActions={true}
                hasHostReview={booking.has_host_review || false}
              />
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PropertyBookings;
