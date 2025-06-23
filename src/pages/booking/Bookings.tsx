import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Layout } from '../../components/layout';
import { Loading, Button, Badge } from '../../components/ui';
import BookingListCard from '../../components/booking/BookingListCard';
import { BookingListItem } from '../../types/booking.types';
import { useGetUserBookingsQuery, useGetHostBookingsQuery, useUpdateBookingStatusMutation } from '../../services/bookingApi';
import { useErrorHandler } from '../../hooks';
import toast from 'react-hot-toast';

const Bookings: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState<'guest' | 'host'>('guest');
  const [statusFilter, setStatusFilter] = useState<string | 'all'>('all');
  const { handleError } = useErrorHandler();

  // Fetch bookings based on user role
  const {
    data: userBookingsData,
    isLoading: isLoadingUserBookings,
    error: userBookingsError
  } = useGetUserBookingsQuery(undefined, {
    skip: !user,
  });

  const {
    data: hostBookingsData,
    isLoading: isLoadingHostBookings,
    error: hostBookingsError
  } = useGetHostBookingsQuery(undefined, {
    skip: true, // Temporarily disabled host functionality
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

  const guestBookings = userBookingsData?.bookings || [];
  const hostBookings = hostBookingsData?.bookings || [];
  const isLoading = isLoadingUserBookings || isLoadingHostBookings;

  // Filter bookings by status
  const filteredGuestBookings = useMemo(() => {
    if (statusFilter === 'all') return guestBookings;
    return guestBookings.filter(booking => booking.status === statusFilter);
  }, [guestBookings, statusFilter]);

  const filteredHostBookings = useMemo(() => {
    if (statusFilter === 'all') return hostBookings;
    return hostBookings.filter(booking => booking.status === statusFilter);
  }, [hostBookings, statusFilter]);

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

  const guestCounts = getBookingCounts(guestBookings);
  const hostCounts = getBookingCounts(hostBookings);

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Loading size="lg" text="Loading your bookings..." />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Your Bookings
          </h1>
          
          {/* Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
              <button
                onClick={() => setActiveTab('guest')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'guest'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                My Trips ({guestCounts.all})
              </button>
              {/* Host tab temporarily disabled */}
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Filter:</span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    statusFilter === 'all'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All ({activeTab === 'guest' ? guestCounts.all : hostCounts.all})
                </button>
                <button
                  onClick={() => setStatusFilter('Pending')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    statusFilter === 'Pending'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                  }`}
                >
                  Pending ({activeTab === 'guest' ? guestCounts['Pending'] : hostCounts['Pending']})
                </button>
                <button
                  onClick={() => setStatusFilter('Confirmed')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    statusFilter === 'Confirmed'
                      ? 'bg-green-600 text-white'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  Confirmed ({activeTab === 'guest' ? guestCounts['Confirmed'] : hostCounts['Confirmed']})
                </button>
                <button
                  onClick={() => setStatusFilter('Completed')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    statusFilter === 'Completed'
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  Completed ({activeTab === 'guest' ? guestCounts['Completed'] : hostCounts['Completed']})
                </button>
                <button
                  onClick={() => setStatusFilter('Cancelled')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    statusFilter === 'Cancelled'
                      ? 'bg-red-600 text-white'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  }`}
                >
                  Cancelled ({activeTab === 'guest' ? guestCounts['Cancelled'] : hostCounts['Cancelled']})
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'guest' && (
            <>
              {guestBookings.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No trips yet
                  </h3>
                  <p className="text-gray-500 mb-4">
                    When you book a trip, you'll see your itinerary here.
                  </p>
                  <Button onClick={() => window.location.href = '/search'}>
                    Start searching
                  </Button>
                </div>
              ) : filteredGuestBookings.length === 0 ? (
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
                    No bookings match the selected filter.
                  </p>
                  <Button variant="outline" onClick={() => setStatusFilter('all')}>
                    Clear filter
                  </Button>
                </div>
              ) : (
                filteredGuestBookings.map((booking) => (
                  <BookingListCard
                    key={booking.booking_id}
                    booking={booking}
                    onUpdateStatus={handleUpdateBookingStatus}
                  />
                ))
              )}
            </>
          )}

          {/* Host bookings section temporarily disabled */}
        </div>
      </div>
    </Layout>
  );
};

export default Bookings;
